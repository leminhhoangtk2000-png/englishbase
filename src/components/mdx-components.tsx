import type { MDXComponents } from 'mdx/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: number) {
  // eslint-disable-next-line react/display-name
  return ({ className, ...props }: { children?: React.ReactNode, className?: string }) => {
    let slug = slugify(props.children ? props.children.toString() : "");
    let Comp = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Comp
        id={slug}
        className={cn(
          'mt-2 scroll-m-20 tracking-tight',
          level === 1 && 'text-4xl font-bold font-headline',
          level === 2 && 'mt-10 border-b pb-1 text-3xl font-semibold font-headline first:mt-0',
          level === 3 && 'mt-8 text-2xl font-semibold font-headline',
          level === 4 && 'mt-8 text-xl font-semibold font-headline',
          level === 5 && 'mt-8 text-lg font-semibold',
          level === 6 && 'mt-8 text-base font-semibold',
          className
        )}
        {...props}
      />
    );
  };
}


export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    a: ({ className, ...props }) => (
      <a
        className={cn('font-medium text-primary underline underline-offset-4', className)}
        {...props}
      />
    ),
    p: ({ className, ...props }) => (
      <p
        className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
    ),
    li: ({ className, ...props }) => (
      <li className={cn('mt-2', className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          'mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground',
          className
        )}
        {...props}
      />
    ),
    img: ({
      className,
      alt,
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={cn('rounded-md border', className)} alt={alt} {...props} />
    ),
    hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
    table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className={cn('w-full', className)} {...props} />
      </div>
    ),
    tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr
        className={cn('m-0 border-t p-0 even:bg-muted', className)}
        {...props}
      />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn(
          'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td
        className={cn(
          'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
          className
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-secondary/50 p-4 font-code',
          className
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }) => (
      <code
        className={cn(
          'relative rounded border bg-secondary/50 px-[0.3rem] py-[0.2rem] font-mono text-sm',
          className
        )}
        {...props}
      />
    ),
    Image,
    Link,
    ...components,
  };
}
