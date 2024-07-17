"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const NextChapterButton = ({ currentChapterId }) => {
  const [nextChapter, setNextChapter] = useState(null);

  useEffect(() => {
    const fetchChapterDetails = async () => {
      try {
        const response = await fetch('/chapters.json');
        if (response.ok) {
          const data = await response.json();
          const currentChapterIndex = data.findIndex(chap => chap.id === currentChapterId);
          if (currentChapterIndex !== -1 && currentChapterIndex < data.length - 1) {
            const chapter = data[currentChapterIndex + 1];
            setNextChapter(chapter);
          } else {
            console.error('Next chapter not found.');
          }
        } else {
          console.error('Failed to load chapters.json');
        }
      } catch (error) {
        console.error('Error loading chapters.json', error);
      }
    };

    fetchChapterDetails();
  }, [currentChapterId]);

  if (!nextChapter) {
    return null;
  }

  return (
    <div className="w-full mt-8">
      <Link href={`/chapter/${nextChapter.id}`} legacyBehavior>
        <a className="block w-full text-center py-10 bg-gray-800 text-white text-lg font-bold transition-colors duration-500 hover:bg-teal-700">
          <div className="flex justify-between items-center px-4 md:px-10 w-full">
            <span className="font-normal">Next</span>
            <span>{nextChapter.chapterTitle} &#8594;</span>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default NextChapterButton;
