// app/chapter/components/ContentViewer.js
import { getMdxContent } from '@/lib/mdx'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

const ContentViewer = async ({ chapterId }) => {
  console.log(`ContentViewer: Starting to fetch content for chapter ${chapterId}`);
  
  try {
    const { content, frontmatter } = await getMdxContent(chapterId);
    
    console.log('ContentViewer: Content fetched successfully');
    console.log('ContentViewer: Frontmatter:', frontmatter);
    console.log('ContentViewer: Content type:', typeof content);

    return (
      <div className="p-6 text-white">
        <h2 className="text-3xl font-bold mb-6">Chapter {chapterId}</h2>
        <div className="mdx-content">
          {content}
        </div>
      </div>
    );
  } catch (error) {
    console.error('ContentViewer: Error fetching content:', error);
    return (
      <div className="p-6 text-white bg-red-900/50 rounded">
        <h2 className="text-2xl font-bold mb-4">Error loading content</h2>
        <p className="mb-2">{error.message}</p>
        <p className="whitespace-pre-wrap">Error details: {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}</p>
      </div>
    );
  }
}

export default ContentViewer;