import type React from 'react';

export type NavItem = {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  items?: NavItemWithComponent[];
  description?: string;
  component?: () => JSX.Element;
};

export type NavItemWithComponent = NavItem & {
  component?: () => JSX.Element;
};

export type DocsConfig = {
  items: NavItem[];
};

export type Doc = {
  title: string;
  content: string;
  href: string;
};
