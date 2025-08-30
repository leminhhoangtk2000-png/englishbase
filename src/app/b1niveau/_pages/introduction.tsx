import { Separator } from "@/components/ui/separator";

export function IntroductionPage() {
  return (
    <>
      <h2 id="overview">Overview</h2>
      <p>
        Welcome to our component library. This section provides detailed documentation for each component.
      </p>
      <p>
        Built with reusable and customizable React components to speed up your development.
      </p>

      <Separator className="my-6" />

      <h2 id="key-features">Key Features</h2>
      <ul>
        <li>
          <strong>Reusable:</strong> Components designed to be used across multiple projects.
        </li>
        <li>
          <strong>Easy to Customize:</strong> Use Tailwind CSS and simple
          React components to tailor the site to your brand.
        </li>
        <li>
          <strong>Accessible:</strong> Built with accessibility in mind from the ground up.
        </li>
      </ul>
    </>
  );
}
