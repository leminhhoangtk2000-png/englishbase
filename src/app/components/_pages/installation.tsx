import { CodeBlock } from "@/components/code-block";

export function InstallationPage() {
  return (
    <>
      <h2 id="overview">Component Installation</h2>
      <p>
        Getting started with our components is easy.
      </p>

      <h3 id="step-1">Step 1: Install Package</h3>
      <p>
        Install the component library from npm.
      </p>
      <CodeBlock value={`npm install @your-scope/components`} />

      <h3 id="step-2">Step 2: Import Components</h3>
      <p>
        Import the components you need in your application.
      </p>
      <CodeBlock value={`import { Button } from '@your-scope/components';`} />
    </>
  );
}
