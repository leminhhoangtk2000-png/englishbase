import { Separator } from "@/components/ui/separator";

export function IntroductionPage() {
  return (
    <>
      <h2 id="overview">Overview</h2>
      <p>
        Welcome to the blog. This section is built with the same flexible component-based system as the docs.
      </p>
      <p>
        You can create new posts by adding React components and updating the configuration file.
      </p>

      <Separator className="my-6" />

      <h2 id="key-features">Key Features</h2>
      <ul>
        <li>
          <strong>Component-Based:</strong> Each post is a React component, giving you full control.
        </li>
        <li>
          <strong>Easy to Customize:</strong> Use Tailwind CSS and simple
          React components to tailor the site to your brand.
        </li>
        <li>
          <strong>Fast and Performant:</strong> Leverages Next.js for server-side
          rendering and static site generation.
        </li>
      </ul>
    </>
  );
}
