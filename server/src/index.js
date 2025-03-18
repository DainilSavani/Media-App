const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { drive } = require('./oauth/oauth2Client');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const IMAGES_DIRECTORY = 'images';
const VIDEOS_DIRECTORY = 'videos';
const PUBLIC_DIRECTORY = 'public';
const ASSETS_DIRECTORY = 'assets';
const VIDEOS_MEDIA_TYPE = 'VIDEOS';
const PAGE_SIZE_LIMIT = 20;

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });
const assetsDirectory = path.join(__dirname, PUBLIC_DIRECTORY, ASSETS_DIRECTORY);

app.use('/assets', express.static(assetsDirectory));
app.use(cors());
app.use(express.json());

const isVideoFile = file => /\.(mp4|mov|avi|mkv|flv|wmv|webm|ts|m4v|3gp)$/i.test(file.name);

const getMediaFiles = async ({ pageSize, currentPage, mediaType, baseUrl }) => {
  const parentDirectoryName = mediaType === VIDEOS_MEDIA_TYPE ? VIDEOS_DIRECTORY : IMAGES_DIRECTORY;
  const parentDirectoryPath = path.join(assetsDirectory, parentDirectoryName);

  if(!fs.existsSync(parentDirectoryPath)) {
    fs.mkdirSync(parentDirectoryPath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    fs.readdir(parentDirectoryPath, (err, files) => {
      if (err) return reject("Failed to read image directory");

      const startIndex = (currentPage - 1) * pageSize;
      const mediaFiles = files.slice(startIndex, startIndex + pageSize);

      const mediaUrls = mediaFiles.map(file => `${baseUrl}/assets/${parentDirectoryName}/${file}`);

      resolve(mediaUrls);
    });
  });
};

app.post('/api/media/all', async (req, res) => {
  const { mediaType } = req.body;
  const currentPage = req.query.page || 1;
  const pageSize = req.query.limit || PAGE_SIZE_LIMIT;
  try {
    const baseUrl = `${req.protocol}://${req.headers.host}`;

    const mediaUrls = await getMediaFiles({ pageSize, currentPage, mediaType, baseUrl });

    res.json(mediaUrls);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

const downloadFile = ({ io: socket, baseUrl, pageSize, mediaType }) => (currentSize, file)  => {
  if (currentSize === pageSize) {
    console.log(currentSize);
    socket.disconnect(true);
  }

  const parentDirectoryName = isVideoFile(file) ? VIDEOS_DIRECTORY : IMAGES_DIRECTORY;
  const parentDirectoryPath = path.join(assetsDirectory, parentDirectoryName);

  if(!fs.existsSync(parentDirectoryPath)) {
    fs.mkdirSync(parentDirectoryPath, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(parentDirectoryPath, fileName);
  const destination = fs.createWriteStream(filePath);

  drive.files.get(
    { fileId: file.id, alt: 'media' },
    { responseType: 'stream' },
    (error, response) => {
      if (error) return console.error(`Error downloading ${file.name}:`, error);
      response.data.pipe(destination);
      const mediaUrl = `${baseUrl}/assets/${parentDirectoryName}/${fileName}`;
      destination.on('finish', () => socket.emit('progress', mediaUrl));
    }
  );
  return ((mediaType===VIDEOS_MEDIA_TYPE && isVideoFile(file)) || (mediaType==='IMAGES' && !isVideoFile(file)))
  ? currentSize + 1 
  : currentSize;
};

const listFiles = async folderId => {
  const files = [];

  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
  });
  
  for (const file of response.data.files) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      const subFolderFiles = await listFiles(file.id);
      files.push(...subFolderFiles);
    } else if (file.mimeType.startsWith("image/") || file.mimeType.startsWith("video/")) {
      files.push(file);
    }
  }

  return files;
};

app.post('/api/media', async (req, res) => {
  const { googleDriveUrl, mediaType } = req.body;
  if (!googleDriveUrl) return res.status(400).json({ error: 'Google Drive URL is required' });

  const folderId = googleDriveUrl.split('/folders/')[1]?.split('?')[0];
  if (!folderId) return res.status(400).json({ error: 'Invalid Google Drive URL' });

  const pageSize = req.query.limit || PAGE_SIZE_LIMIT;

  try {
    const files = await listFiles(folderId);
    if (!files.length) return res.json({ message: 'No media files found' });

    const baseUrl = `${req.protocol}://${req.headers.host}`;
    files.reduce(downloadFile({ io, baseUrl, pageSize, mediaType }), 0);

    res.json({ message: 'Download started', totalFiles: files.length });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', () => {
  console.log('Client connected');
});

server.listen(PORT, () => {
  console.log('server running at port: ' + PORT);
});

module.exports = server;