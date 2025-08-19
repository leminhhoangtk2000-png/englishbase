import { toc } from "mdast-util-toc";
import { remark } from "remark";
import { visit } from "unist-util-visit";

const textTypes = ["text", "emphasis", "strong", "inlineCode"];

function flattenNode(node: any) {
  const p = [];
  visit(node, (node) => {
    if (!textTypes.includes(node.type)) return;
    p.push(node.value);
  });
  return p.join(``);
}

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

interface TOC {
  items: Item[];
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

export const getTableOfContents = async (
  content: React.ReactNode
): Promise<TOC> => {
  // This is a workaround to get the content from the children prop.
  // The better way to do this is to get the content from the file system.
  const mdxContent = (content as any)?.props?.children?.props?.source || "";

  const result = await remark().use(() => (tree, file) => {
    const tableOfContents = toc(tree);
    file.data = getItems(tableOfContents.map, { items: [] });
  }).process(mdxContent);

  return result.data as TOC;
};