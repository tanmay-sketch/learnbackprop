import React from 'react';
import Image from 'next/image';

const Topic = ({ title, description, image, isSmallScreen }) => {
  return (
    <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} items-center`}>
      <div className={`w-16 h-16 bg-gray-300 rounded-full mr-4 ${isSmallScreen ? 'mb-2' : 'mb-0'} flex items-center justify-center`}>
        {/* Placeholder for image */}
        {!image && <span className="text-black">Image</span>}
        {image && (
          <Image
            src={image}
            alt={title}
            width={64}  // Adjust the width as needed
            height={64} // Adjust the height as needed
            className="rounded-full object-cover"
          />
        )}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
        {!isSmallScreen && <p className="text-gray-300">{description}</p>}
      </div>
    </div>
  );
};

export default Topic;
