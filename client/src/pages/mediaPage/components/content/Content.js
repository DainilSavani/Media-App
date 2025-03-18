import React, { useRef, useEffect } from 'react';
import _map from 'lodash/map';

// Components
import Navbar from './components/navbar';
import Images from './components/images';
import Videos from './components/videos';
import Loader from '../sideBar/components/form/components/loader';

// Constants
import { IMAGES_TAB_ID } from '../../mediaPage.constants';

// Styles
import './content.scss';

const renderMedia = selectedTab => (media, index) => selectedTab === IMAGES_TAB_ID ? <Images media={media} index={index} /> : <Videos media={media} index={index} />;

const Content = ({ mediaFiles, isLoading, selectedTab, setSelectedTab, setCurrentPage }) => {
    const observerRef = useRef(null);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();
    
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              setCurrentPage(prev => prev + 1);
            }
          },
          { threshold: 1.0 }
        );
    
        const lastMediaFile = document.querySelector(".mediaItem:last-child");
        if (lastMediaFile) observer.observe(lastMediaFile);
    
        observerRef.current = observer;
      }, [mediaFiles, setCurrentPage]);

    return (
        <div className='container'>
            <Navbar selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
            {
                isLoading ? <Loader /> : (
                    <>
                        {
                            mediaFiles.length === 0 ? <p className='text'>No media files found</p> : (
                                <div className='mediaContainer'>
                                {
                                    _map(mediaFiles, renderMedia(selectedTab))
                                }
                                </div>
                            )
                        }
                    </>
                )
            }
        </div>
    );
};

export default Content;
