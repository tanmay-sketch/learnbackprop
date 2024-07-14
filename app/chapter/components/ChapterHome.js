"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'; // Adjust the path as necessary
import styles from './ChapterHome.module.css';

const ChapterHome = ({ chapterId }) => {
  const [chapterData, setChapterData] = useState(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      try {
        const response = await fetch('/chapters.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const chapter = data.find(chapter => chapter.id === chapterId);
        setChapterData(chapter);
      } catch (error) {
        console.error('Failed to fetch chapter data:', error);
      }
    };

    fetchChapterData();
  }, [chapterId]);

  if (!chapterData) {
    return <div>Loading...</div>;
  }

  const { chapterTitle, chapterDescription, topics } = chapterData;

  return (
    <div className={`${styles.chapterHome} dark flex flex-col min-h-screen bg-black text-foreground p-8`}>
      <Navbar />
      <div className={`${styles.content} flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mt-12 md:mt-20 w-full`}>
        <div className="flex-1 space-y-4 md:px-8">
          <h1 className="text-xl font-light text-gray-400">Chapter {chapterId}</h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white">{chapterTitle}</h2>
          <p className="text-lg md:text-xl text-gray-300">{chapterDescription}</p>
        </div>
        <div className="flex-1 space-y-8 md:px-8">
          {topics.map((topic, index) => (
            <div key={index} className={`${styles.topicItem} bg-card rounded-lg p-4 flex items-center gap-4 hover:bg-gray-700 transition-colors`}>
              <div className={`${styles.topicIcon} bg-gray-900 rounded-full flex items-center justify-center`}>
                <img src={`/${topic.image}`} alt={topic.title} className={`${styles.iconImage} object-contain`} />
              </div>
              <div>
                <h3 className="text-lg text-white">{topic.title}</h3>
                <p className="text-gray-400 text-sm">{topic.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterHome;
