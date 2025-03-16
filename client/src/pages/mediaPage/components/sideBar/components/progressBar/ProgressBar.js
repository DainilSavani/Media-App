import React from "react";

// Styles
import './progressBar.scss';

const ProgressBar = ({ totalFiles, downloadedFiles, isDownloading }) => {
    return (
        <div className="progressBar">
            {
                isDownloading && (
                    <div className="slider">
                        <progress value={String(downloadedFiles/totalFiles*100)} max="100" />
                    </div>
                )
            }
            <span>Assets Synced: {downloadedFiles}/{totalFiles}</span>
        </div>
    )
};

export default ProgressBar;
