import React, { useState } from "react";

// Components
import Form from "./components/form";
import ProgressBar from "./components/progressBar";


// Styles
import './sidebar.scss';

const SideBar = ({ setMediaFiles, selectedTab }) => {
    const [totalFiles, setTotalFiles] = useState(0);
    const [downloadedFiles, setDownloadedFiles] = useState([]);
    const [isDownloading, setIsDownloading] = useState(false);

    return (
        <div className="sideBar">
            <Form setTotalFiles={setTotalFiles} setDownloadedFiles={setDownloadedFiles} setMediaFiles={setMediaFiles} setIsDownloading={setIsDownloading} selectedTab={selectedTab} />
            <ProgressBar totalFiles={totalFiles} downloadedFiles={downloadedFiles.length} isDownloading={isDownloading} />
        </div>
    )
};

export default SideBar;
