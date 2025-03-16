import React, { useState } from "react";

// Components
import Form from "./components/form";
import ProgressBar from "./components/progressBar";


// Styles
import './sidebar.scss';

const SideBar = ({ setMediaFiles }) => {
    const [totalFiles, setTotalFiles] = useState(0);
    const [downloadedFiles, setDownloadedFiles] = useState([]);
    const [isDownloading, setIsDownloading] = useState(false);

    return (
        <div className="sideBar">
            <Form setTotalFiles={setTotalFiles} setDownloadedFiles={setDownloadedFiles} setMediaFiles={setMediaFiles} totalFiles={totalFiles} downloadedFiles={downloadedFiles} setIsDownloading={setIsDownloading} />
            <ProgressBar totalFiles={totalFiles} downloadedFiles={downloadedFiles.length} isDownloading={isDownloading} />
        </div>
    )
};

export default SideBar;
