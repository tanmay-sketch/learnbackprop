// app/chapter/2/page.js
import React from 'react';
import ChapterHome from '../components/ChapterHome';
import Footer from '../../components/Footer';
import NextChapterButton from '../components/NextChapterButton';
import ChapterContent from '../components/ChapterContent';
import { getMdxContent } from '../../../lib/mdx';

const Chapter2Page = async () => {
  const chapterId = 2;
  let contentData = {};
  let error = null;

  try {
    contentData = await getMdxContent(chapterId);
  } catch (err) {
    error = err;
  }

  // Serialize contentData
  const serializedContentData = contentData ? JSON.stringify(contentData) : null;
  const serializedError = error ? JSON.stringify(error) : null;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <ChapterHome chapterId={chapterId} />
      <ChapterContent chapterId={chapterId} contentData={serializedContentData} error={serializedError} />
      <Footer />
    </div>
  );
};

export default Chapter2Page;
