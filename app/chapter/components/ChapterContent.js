"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ContentViewer = dynamic(() => import('./ContentViewer'), { ssr: false });
const GraphicsViewer = dynamic(() => import('./GraphicsViewer'), { ssr: false });

const ChapterContent = ({ chapterId, contentData, error }) => {
  const [currentGraphic, setCurrentGraphic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (graphicId) => {
    setCurrentGraphic(graphicId);
    setIsPlaying(true);
  };

  const handleCloseGraphic = () => {
    setIsPlaying(false);
    setCurrentGraphic(null);
  };

  // Deserialize contentData
  let deserializedContentData = null;
  let deserializedError = null;
  try {
    deserializedContentData = contentData ? JSON.parse(contentData) : null;
    deserializedError = error ? JSON.parse(error) : null;
  } catch (err) {
    console.error('Error deserializing contentData:', err);
  }

  useEffect(() => {
    console.log('ChapterContent: error:', deserializedError);
  }, [deserializedContentData, deserializedError]);

  if (deserializedError) {
    return (
      <div className="p-6 text-white bg-red-900/50 rounded">
        <h2 className="text-2xl font-bold mb-4">Error loading content</h2>
        <p className="mb-2">{deserializedError.message}</p>
        <p className="whitespace-pre-wrap">Error details: {JSON.stringify(deserializedError, Object.getOwnPropertyNames(deserializedError), 2)}</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      {deserializedContentData && deserializedContentData.mdxSource && (
        <ContentViewer mdxSource={deserializedContentData.mdxSource} onPlay={handlePlay} />
      )}
      <GraphicsViewer 
        chapterId={chapterId} 
        graphicId={currentGraphic} 
        isPlaying={isPlaying}
        onClose={handleCloseGraphic}
      />
    </div>
  );
};

export default ChapterContent;
