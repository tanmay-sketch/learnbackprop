// lib/mdx.js
import fs from 'fs'
import path from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'
import { InlineMath, BlockMath } from 'react-katex'

const components = {
  InlineMath,
  BlockMath
}

export async function getMdxContent(chapterId) {
  console.log(`getMdxContent: Starting to fetch content for chapter ${chapterId}`);
  
  const mdxFilePath = path.join(process.cwd(), `app/chapter/${chapterId}/content/index.mdx`);
  
  console.log(`getMdxContent: Attempting to read file: ${mdxFilePath}`);
  
  if (!fs.existsSync(mdxFilePath)) {
    console.error(`getMdxContent: MDX file not found for chapter ${chapterId}`);
    throw new Error(`MDX file not found for chapter ${chapterId}`);
  }
  
  const source = fs.readFileSync(mdxFilePath, 'utf-8');
  console.log(`getMdxContent: File read successfully. Content length: ${source.length}`);
  
  try {
    const { content, frontmatter } = await compileMDX({
      source,
      components,
      options: { parseFrontmatter: true }
    });
    
    console.log('getMdxContent: MDX compiled successfully');
    console.log('getMdxContent: Frontmatter:', frontmatter);
    
    return { content, frontmatter };
  } catch (error) {
    console.error('getMdxContent: Error compiling MDX:', error);
    throw error;
  }
}