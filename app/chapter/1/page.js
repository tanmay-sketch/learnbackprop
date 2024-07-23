"use client";

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import ChapterHome from '../components/ChapterHome'; // Adjust the path as necessary
import Footer from '../../components/Footer';
import NextChapterButton from '../components/NextChapterButton';

// Dynamically import the Timeline component
const DynamicTimeline = dynamic(() => import('../components/Timeline'), { ssr: false });

const Chapter1Page = () => {
    useEffect(() => {
    }, []);

    return (
        <div className="bg-black text-foreground">
            <ChapterHome chapterId={1} />
            <DynamicTimeline />
            <NextChapterButton currentChapterId={1} /> {/* Corrected prop name */}
            <Footer />
        </div>
    );
};

export default Chapter1Page;
