import React from "react";
import LazyLoad from "react-lazyload";

// Helpers
import { isVideoFile } from '../../content.helpers';

const Videos = ({ media }) => isVideoFile(media) ? (
    <div className="mediaItem" key={media}>
        <LazyLoad offset={100}>
            <video controls className="media" src={media} />
        </LazyLoad>
    </div>
) : null;

export default Videos;
