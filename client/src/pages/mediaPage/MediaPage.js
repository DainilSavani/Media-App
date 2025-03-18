import React, { useState, useEffect } from 'react';

// Components
import Content from './components/content';
import SideBar from './components/sideBar';

// Helpers
import { fetchMediaFiles } from './mediapage.helpers';

// Constants
import { IMAGES_TAB_ID, FIRST_PAGE, PAGE_SIZE } from './mediaPage.constants';

// Styles
import './mediaPage.scss';

const MediaPage = () => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(IMAGES_TAB_ID);
    const [currentPage, setCurrentPage] = useState(FIRST_PAGE);

    useEffect(() => {
        setMediaFiles([]);
        fetchMediaFiles({ setMediaFiles, setIsLoading, selectedTab })(PAGE_SIZE, currentPage);
    }, [selectedTab, currentPage])

    return (
        <div className='mediaPage'>
            <SideBar setMediaFiles={setMediaFiles} selectedTab={selectedTab} />
            <Content mediaFiles={mediaFiles} isLoading={isLoading} selectedTab={selectedTab} setSelectedTab={setSelectedTab} setCurrentPage={setCurrentPage} />
        </div>
    )
};

export default MediaPage;
