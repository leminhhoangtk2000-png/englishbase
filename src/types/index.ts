import type React from 'react';

export type NavItem = {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  items?: NavItemWithComponent[];
  description?: string;
  component?: React.ComponentType<any>;
};

export type NavItemWithComponent = NavItem & {
  component?: React.ComponentType<any>;
};

export type DocsConfig = {
  items: NavItem[];
};

export type Doc = {
  title: string;
  content: string;
  href: string;
};

// Markdown related types
export type MarkdownMeta = {
  title: string;
  description: string;
  date: string;
  author?: string;
  tags?: string[];
  level: string;
  order?: number;
  slug: string;
};

export type MarkdownContent = {
  meta: MarkdownMeta;
  content: string;
};

export type MarkdownSection = {
  name: string;
  slug: string;
  items: MarkdownContent[];
};
