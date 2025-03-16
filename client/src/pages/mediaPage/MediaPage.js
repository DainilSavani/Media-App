import React, { useState, useEffect } from 'react';

// Components
import Content from './components/content';
import SideBar from './components/sideBar';

// Helpers
import { fetchMediaFiles } from './mediapage.helpers';

// Constants
import { IMAGES_TAB_ID } from './mediaPage.constants';

// Styles
import './mediaPage.scss';

const MediaPage = () => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchMediaFiles(setMediaFiles, setIsLoading);
    }, [])

    return (
        <div className='mediaPage'>
            <SideBar setMediaFiles={setMediaFiles} />
            <Content mediaFiles={mediaFiles} isLoading={isLoading} />
        </div>
    )
};

export default MediaPage;
