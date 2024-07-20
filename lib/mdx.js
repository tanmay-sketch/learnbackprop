// lib/mdx.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

export async function getMdxContent(chapterId) {
  const filePath = path.join(process.cwd(), 'app', 'chapter', String(chapterId), 'content', 'index.mdx');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found for chapter ${chapterId}`);
  }

  const source = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(source);
  const mdxSource = await serialize(content, { scope: data });

  return {
    mdxSource,
    frontmatter: data,
  };
}
