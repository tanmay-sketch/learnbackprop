// app/chapter/2/page.js
import React from 'react'
import ChapterHome from '../components/ChapterHome'
import Footer from '../../components/Footer'
import NextChapterButton from '../components/NextChapterButton'
import ContentViewer from '../components/ContentViewer'

const Chapter2Page = () => {
  return (
    <div className="bg-black text-foreground">
      <ChapterHome chapterId={2} />
      <ContentViewer chapterId={2} />
      <NextChapterButton currentChapterId={2} />
      <Footer />
    </div>
  )
}

export default Chapter2Page