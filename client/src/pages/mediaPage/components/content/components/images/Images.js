import React from "react";
import LazyLoad from 'react-lazyload';

// Helpers
import { isVideoFile } from '../../content.helpers';

const Images = ({ media }) => isVideoFile(media) ? null : (
    <div className="mediaItem" key={media}>
        <LazyLoad offset={100}>
            <img className='media' id='index' src={media} alt='img'></img>
        </LazyLoad>
    </div>
)

export default Images;
