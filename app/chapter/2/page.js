"use client"

import React, { useEffect } from 'react';
import ChapterHome from '../components/ChapterHome';
import Footer from '../../components/Footer';
import NextChapterButton from '../components/NextChapterButton';

const Chapter2Page = () => {
    useEffect(() => {
        console.log('Chapter2Page component mounted');
    }, []);

    return (
        <div className="bg-black text-foreground">
            <ChapterHome chapterId={2} />
            <NextChapterButton currentChapterId={2} />
            <Footer />
        </div>
    );
}

export default Chapter2Page;
