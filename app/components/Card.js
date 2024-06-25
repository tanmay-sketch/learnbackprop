import React from 'react';

const Card = ({ chapterNumber, chapterTitle, chapterDescription, topics }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-white text-black rounded-lg shadow-lg p-6 w-4/5 h-4/5">
      <div className="w-full md:w-1/2 p-4">
        <p className="text-gray-500 mb-2">Chapter {chapterNumber}</p>
        <h2 className="text-2xl font-bold mb-4">{chapterTitle}</h2>
        <p className="mb-4">{chapterDescription}</p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-full">Go to {chapterTitle}</button>
      </div>
      <div className="w-full md:w-1/2 p-4">
        {topics.map((topic, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{topic.title}</h3>
            <p>{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
