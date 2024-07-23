// ContentViewer.js
import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const PlayButton = ({ graphicId, onPlay }) => (
  <div className="flex justify-center my-8">
    <button
      onClick={() => onPlay(graphicId)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Play
    </button>
  </div>
);

const components = {
  PlayButton,
  InlineMath,
  BlockMath,
};

const ContentViewer = ({ mdxSource, onPlay }) => {
  return (
    <div className="prose prose-invert max-w-none p-6 text-white overflow-x-auto">
      <MDXRemote
        {...mdxSource}
        components={{
          ...components,
          PlayButton: (props) => <PlayButton {...props} onPlay={onPlay} />,
        }}
      />
    </div>
  );
};

export default ContentViewer;
