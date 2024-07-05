import React from 'react';
import Image from 'next/image';

const Card = ({ chapterNumber, chapterTitle, chapterDescription, topics }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-gray-900 bg-opacity-95 text-white rounded-lg shadow-lg p-6 w-4/5 h-4/5">
      <div className="w-full md:w-1/2 p-4">
        <p className="text-gray-300 mb-2 text-sm md:text-base">Chapter {chapterNumber}</p>
        <h2 className="text-xl md:text-2xl font-bold mb-4">{chapterTitle}</h2>
        <p className="mb-4 text-sm md:text-base">{chapterDescription}</p>
        <button className="bg-blue-600 text-white py-2 px-4 rounded-full text-sm md:text-base hover:bg-blue-700 transition-colors duration-300">Coming Soon</button>
      </div>
      <div className="w-full md:w-1/2 p-4">
        {topics.map((topic, index) => (
          <div key={index} className="mb-4 flex items-center">
            <div className="bg-gray-800 text-black rounded-full w-12 h-12 md:w-20 md:h-20 flex items-center justify-center mr-4 overflow-hidden">
              <Image src={`/${topic.image}`} alt={topic.title} width={40} height={40} className="object-contain" />
            </div>
            <div>
              <h3 className="text-sm md:text-xl font-semibold">{topic.title}</h3>
              <p className="hidden md:block text-sm md:text-base">{topic.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
