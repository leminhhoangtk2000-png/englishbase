export type NavItem = {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  items?: NavItem[];
};

export type Doc = {
  title: string;
  content: string;
  href: string;
};
