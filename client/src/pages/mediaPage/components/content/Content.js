import React, { useState } from 'react';
import _map from 'lodash/map';

// Components
import Navbar from './components/navbar';
import Images from './components/images';
import Videos from './components/videos';
import Loader from './components/loader';

// Constants
import { IMAGES_TAB_ID } from '../../mediaPage.constants';

// Styles
import './content.scss';

const renderMedia = selectedTab => (media, index) => selectedTab === IMAGES_TAB_ID ? <Images media={media} index={index} /> : <Videos media={media} index={index} />

const Content = ({ mediaFiles, isLoading }) => {
    const [selectedTab, setSelectedTab] = useState(IMAGES_TAB_ID);

    return (
        <div className='container'>
            <Navbar selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
            {
                isLoading ? <Loader /> : (
                    <div className='mediaContainer'>
                    {
                        mediaFiles.length === 0 ? (
                            <p class="center-text" className='text'>No media files found</p>
                        ) : _map(mediaFiles, renderMedia(selectedTab))
                    }
                    </div>
                )
            }
        </div>
    );
};

export default Content;
