import React from 'react';

const Topic = ({ title, description, image, isSmallScreen }) => {
  return (
    <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} items-center`}>
      <div className={`w-16 h-16 bg-gray-300 rounded-full mr-4 ${isSmallScreen ? 'mb-2' : 'mb-0'} flex items-center justify-center`}>
        {/* Placeholder for image */}
        {!image && <span className="text-black">Image</span>}
        {image && <img src={image} alt={title} className="w-full h-full rounded-full object-cover" />}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
        {!isSmallScreen && <p className="text-gray-300">{description}</p>}
      </div>
    </div>
  );
};

export default Topic;
