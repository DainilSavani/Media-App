import axios from 'axios';
import io from 'socket.io-client';

// Constants
import { BASE_URL, PAGE_SIZE } from '../../../../mediaPage.constants';

const saveMediaFile = async ({ driveLink, inputRef, setIsDownloading, setTotalFiles, setDownloadedFiles, setMediaFiles, selectedTab }) => {
    setIsDownloading(true);
    setDownloadedFiles([]);
    const payload = { googleDriveUrl: driveLink, mediaType: selectedTab };
    try {
        const response = await axios.post(`${BASE_URL}/api/media?limit=${PAGE_SIZE}`, payload);
        inputRef.current.value = '';
        setTotalFiles(response.data.totalFiles);

        const socket = io(BASE_URL);
    
        socket.on('progress', fileName => {
            setMediaFiles((prev) => {
                if (prev.some((file) => file === fileName)) return prev;
                return [fileName, ...prev];
            });
            setDownloadedFiles(prev => {
                const newDownloadedFiles = [...prev, fileName];

                if (newDownloadedFiles.length === response.data.totalFiles) {
                    socket.disconnect();
                }
                return newDownloadedFiles;
            });
        });

        socket.on('disconnect', () => {
            setTimeout(() => { // to show completion of progress bar
                setIsDownloading(false);
            }, 500);
        })
    } catch (err) {
        console.log(err);
        alert('Unfortunately your file could not be saved!!!');
    }
};

const validateForm = driveLink => {
    if (!driveLink) {
        return 'Google drive link can not be empty';
    }
    const pattern = /^(https|http):\/\/drive.google.com\//;
    if (!pattern.test(driveLink)) {
        return 'Enter valid Google drive link';
    }
    return null;
}

export const handleFormSubmit = ({ setError, inputRef, setIsDownloading, setTotalFiles, setDownloadedFiles, setMediaFiles, selectedTab }) => event => {
    event.preventDefault();
    const driveLink = inputRef.current.value;

    const error = validateForm(driveLink);
    if (!error) {
        setError(null);
        saveMediaFile({ driveLink, inputRef, setIsDownloading, setTotalFiles, setDownloadedFiles, setMediaFiles, selectedTab });
    } else {
        setError(error);
    }
};
