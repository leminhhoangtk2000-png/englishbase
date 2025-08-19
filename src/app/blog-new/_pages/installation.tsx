import { CodeBlock } from "@/components/code-block";

export function InstallationPage() {
  return (
    <>
      <h2 id="overview">My First Blog Post</h2>
      <p>
        This is an example of a blog post page. You can add any content you like here.
      </p>

      <h3 id="step-1">Code Blocks</h3>
      <p>
        You can easily include code blocks to share snippets.
      </p>
      <CodeBlock value={`function helloWorld() {
  console.log("Hello, World!");
}`} />

      <h3 id="step-2">More Content</h3>
      <p>
        Continue adding sections and content as needed.
      </p>
    </>
  );
}
