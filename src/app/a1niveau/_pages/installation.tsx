import { CodeBlock } from "@/components/code-block";

export function InstallationPage() {
  return (
    <>
      <h2 id="overview">Installation Guide</h2>
      <p>
        Getting started with Deutsch.vn is simple. You can clone the repository
        and start editing the content right away.
      </p>

      <h3 id="step-1">Step 1: Clone the Repository</h3>
      <p>
        First, clone the project from GitHub using your preferred method (HTTPS or SSH).
      </p>
      <CodeBlock value={`git clone https://github.com/your-repo/deutsch-vn.git
cd deutsch-vn`} />

      <h3 id="step-2">Step 2: Install Dependencies</h3>
      <p>
        Next, install the necessary dependencies using your favorite package manager.
      </p>
      <CodeBlock value="npm install" />

      <h3 id="step-3">Step 3: Run the Development Server</h3>
      <p>
        Finally, start the local development server to see your site in action.
      </p>
      <CodeBlock value="npm run dev" />

      <p>
        Your documentation site should now be running at{" "}
        <a href="http://localhost:3000">http://localhost:3000</a>. You can start
        by editing the files in <code>src/app/docs/_pages</code> and updating the configuration in{" "}
        <code>src/config/docs.ts</code>.
      </p>
    </>
  );
}
