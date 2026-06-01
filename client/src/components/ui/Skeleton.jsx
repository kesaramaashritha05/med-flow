import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, radius = '4px', margin = '0' }) => {
    return (
        <div 
            className="skeleton-pulse" 
            style={{ width, height, borderRadius: radius, margin }}
        ></div>
    );
};

export default Skeleton;
