import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type NavItem, type Doc } from '@/types';

const contentDir = path.join(process.cwd(), 'src/content');

export function getDocsNavigation(): NavItem[] {
  const items: NavItem[] = [];
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });

  // Handle top-level files
  entries
    .filter((entry) => entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')))
    .forEach((file) => {
      const slug = file.name.replace(/\.mdx?$/, '');
      const fullPath = path.join(contentDir, file.name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      items.push({
        title: data.title || slug,
        href: `/docs/${slug}`,
      });
    });

  // Handle directories
  entries
    .filter((entry) => entry.isDirectory())
    .forEach((dir) => {
      const dirPath = path.join(contentDir, dir.name);
      const dirEntries = fs.readdirSync(dirPath, { withFileTypes: true });
      const children: NavItem[] = [];
      let groupTitle = dir.name.charAt(0).toUpperCase() + dir.name.slice(1);

      dirEntries
        .filter((entry) => entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')))
        .forEach((file) => {
            const slug = file.name.replace(/\.mdx?$/, '');
            const fullPath = path.join(dirPath, file.name);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);
            
            // If it's an index file, use it for the group title
            if(slug === 'index'){
                groupTitle = data.title || groupTitle;
            } else {
                 children.push({
                    title: data.title || slug,
                    href: `/docs/${dir.name}/${slug}`,
                });
            }
        });

      if (children.length > 0) {
        items.push({
          title: groupTitle,
          items: children,
        });
      }
    });

  return items;
}

export async function getDocBySlug(slug: string[]) {
  const filePath = path.join(contentDir, `${slug.join('/')}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data,
    content,
  };
}

export function getAllDocs(): Doc[] {
  const allDocs: Doc[] = [];
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });

  function traverseDir(directory: string, basePath = '') {
    const dirEntries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of dirEntries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        traverseDir(fullPath, `${basePath}${entry.name}/`);
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
        const slug = entry.name.replace(/\.mdx?$/, '');
        const href = `/docs/${basePath}${slug}`;
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        allDocs.push({
          href,
          title: data.title || slug,
          content,
        });
      }
    }
  }

  traverseDir(contentDir);
  return allDocs;
}
