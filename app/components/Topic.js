import React from 'react';
import Image from 'next/image';

const Topic = ({ title, description, image, isSmallScreen }) => {
  return (
    <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} items-center`}>
      <div className={`w-12 h-12 bg-gray-800 rounded-full mr-4 ${isSmallScreen ? 'mb-2' : 'mb-0'} flex items-center justify-center overflow-hidden`}>
        <Image
          src={`/${image}`}
          alt={title}
          width={40}  // Adjusted width
          height={40} // Adjusted height
          className="object-contain"
        />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
        {!isSmallScreen && <p className="text-gray-300">{description}</p>}
      </div>
    </div>
  );
};

export default Topic;
