"use client";

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import ChapterHome from '../components/ChapterHome'; // Adjust the path as necessary
import Footer from '../../components/Footer';

// Dynamically import the Timeline component
const DynamicTimeline = dynamic(() => import('../components/Timeline'), { ssr: false });

const Chapter1Page = () => {
    useEffect(() => {
        console.log('Chapter1Page component mounted');
    }, []);

    return (
        <div className="bg-background text-foreground">
            <ChapterHome chapterId={1} />
            <DynamicTimeline />
            <Footer />
        </div>
    );
};

export default Chapter1Page;
