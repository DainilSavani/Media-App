import React, { useState, useRef } from "react";

// Helpers
import { handleFormSubmit } from './form.helpers';

// Styles
import './form.scss';

const Form = ({ setTotalFiles, setDownloadedFiles, setMediaFiles, totalFiles, downloadedFiles, setIsDownloading }) => {
    const [error, setError] = useState(null);
    const inputRef = useRef('');

    return (
        <form className="inputForm" onSubmit={handleFormSubmit({ setError, inputRef, setIsDownloading, setTotalFiles, setDownloadedFiles, setMediaFiles, totalFiles, downloadedFiles })}>
            <textarea ref={inputRef} id="driveLink" placeholder='Paste your drive link here...' rows={8} />
            {error && (<span className="formError">{error}</span>)}
            <button type="submit" className="submitBtn" >Submit</button>
        </form>
    )
};

export default Form;
