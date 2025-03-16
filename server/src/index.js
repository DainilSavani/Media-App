const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { drive } = require('./oauth/oauth2Client');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });
const assetsDirectory = path.join(__dirname, 'public', 'assets');

app.use('/assets', express.static(assetsDirectory));
app.use(cors());
app.use(express.json());

const getMediaFiles = async () => {
  return new Promise((resolve, reject) => {
    fs.readdir(assetsDirectory, (err, files) => {
      if (err) return reject("Failed to read image directory");

      const mediaFiles = files.filter((file) => /\.(mp4|mov|avi|mkv|flv|wmv|webm|ts|m4v|3gp|jpg|jpeg|png|gif)$/i.test(file));

      resolve(mediaFiles);
    });
  });
};

app.get('/api/media/all', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.headers.host}`;
    const mediaFiles = await getMediaFiles();

    mediaUrls = mediaFiles.map(file => `${baseUrl}/assets/${file}`);

    res.json(mediaUrls);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

const downloadFile = async ({ file, io: socket, baseUrl }) => {
  const filePath = path.join(assetsDirectory, file.name);
  const destination = fs.createWriteStream(filePath);

  drive.files.get(
    { fileId: file.id, alt: 'media' },
    { responseType: 'stream' },
    (error, response) => {
      if (error) return console.error(`Error downloading ${file.name}:`, error);
      response.data.pipe(destination);
      const mediaUrl = `${baseUrl}/assets/${file.name}`;
      destination.on('finish', () => socket.emit('progress', mediaUrl));
    }
  );
};

const listFiles = async folderId => {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false and (mimeType contains 'image/' or mimeType contains 'video/')`,
    fields: 'files(id, name, mimeType)',
  });
  return response.data.files;
};

app.post('/api/media', async (req, res) => {
  const { googleDriveUrl } = req.body;
  if (!googleDriveUrl) return res.status(400).json({ error: 'Google Drive URL is required' });

  const folderId = googleDriveUrl.split('/folders/')[1]?.split('?')[0];
  if (!folderId) return res.status(400).json({ error: 'Invalid Google Drive URL' });

  try {
    const files = await listFiles(folderId);
    if (!files.length) return res.json({ message: 'No media files found' });

    if(!fs.existsSync(assetsDirectory)) {
      fs.mkdirSync(assetsDirectory, { recursive: true });
    }

    const baseUrl = `${req.protocol}://${req.headers.host}`;
    files.forEach(file => downloadFile({ file, io, baseUrl }));

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