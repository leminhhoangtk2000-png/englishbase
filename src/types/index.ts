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
