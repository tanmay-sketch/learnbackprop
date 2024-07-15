"use client"

import React, { useEffect } from 'react';
import ChapterHome from '../components/ChapterHome';
import Footer from '../../components/Footer';

const Chapter2Page = () => {
    useEffect(() => {
        console.log('Chapter2Page component mounted');
    }, []);

    return (
        <div className="bg-background text-foreground">
            <ChapterHome chapterId={2} />
            <Footer />
        </div>
    );
}

export default Chapter2Page;