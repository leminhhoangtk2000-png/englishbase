import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { type NavItem, type Doc } from '@/types';
import { toc } from "mdast-util-toc";
import { remark } from "remark";
import { visit } from "unist-util-visit";
import { VFile } from 'vfile';

const contentDir = path.join(process.cwd(), 'src/content');

// Types for Table of Contents
interface TOCItem {
  title: string;
  url: string;
  items?: TOCItem[];
}

export interface TOC {
  items: TOCItem[];
}

const textTypes = ["text", "emphasis", "strong", "inlineCode"];

function flattenNode(node: any) {
  const p: string[] = [];
  visit(node, (node) => {
    if (!textTypes.includes(node.type)) return;
    p.push(node.value);
  });
  return p.join('');
}

function getItems(node: any, current: any): TOC {
  if (!node) {
    return {} as TOC;
  }

  if (node.type === "paragraph") {
    visit(node, (item) => {
      if (item.type === "link") {
        current.items.push({
          title: flattenNode(item),
          url: item.url,
        });
      }
    });
    return current;
  }

  if (node.type === "list") {
    current.items = node.children.map((i: any) => getItems(i, { items: [] }));
    return current;
  } else if (node.type === "listItem") {
    const heading = getItems(node.children[0], { items: [] });
    if (node.children.length > 1) {
      getItems(node.children[1], heading);
    }
    return heading;
  }

  return {} as TOC;
}

const getTableOfContents = async (content: string): Promise<TOC> => {
  const result = await remark().use(() => (tree, file) => {
    const tableOfContents = toc(tree);
    file.data = getItems(tableOfContents.map, { items: [] });
  }).process(content);

  return result.data as TOC;
};


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

async function getFileContent(slug: string[]) {
    const filePath = path.join(contentDir, `${slug.join('/')}.mdx`);
  
    if (!fs.existsSync(filePath)) {
      // try .md as a fallback
      const mdFilePath = path.join(contentDir, `${slug.join('/')}.md`);
      if (!fs.existsSync(mdFilePath)) {
        return null;
      }
    }
  
    const actualPath = fs.existsSync(filePath) ? filePath : path.join(contentDir, `${slug.join('/')}.md`);
    return fs.readFileSync(actualPath, 'utf8');
}


export async function getDocBySlug(slug: string[]) {
  const fileContents = await getFileContent(slug);
  
  if (fileContents === null) {
      return null;
  }
  
  const { data, content } = matter(fileContents);

  const toc = await getTableOfContents(content);

  return {
    frontmatter: data,
    content,
    toc,
  };
}

export async function getTableOfContentsForSlug(slug: string[]): Promise<TOC | null> {
    const fileContents = await getFileContent(slug);

    if (fileContents === null) {
        return null;
    }

    const { content } = matter(fileContents);
    return getTableOfContents(content);
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
        // Exclude index pages from search results to avoid duplication
        if (slug === 'index') continue;

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
