import { Separator } from "@/components/ui/separator";

export function IntroductionPage() {
  return (
    <>
      <h2 id="overview">Overview</h2>
      <p>
        This section contains full page examples to demonstrate what you can build.
      </p>
      <p>
        These examples are meant to be a starting point for your own applications.
      </p>

      <Separator className="my-6" />

      <h2 id="key-features">Key Features</h2>
      <ul>
        <li>
          <strong>Ready to Use:</strong> Copy and paste entire pages.
        </li>
        <li>
          <strong>Responsive:</strong> Designed to work on all screen sizes.
        </li>
        <li>
          <strong>Customizable:</strong> Easily adapt the examples to your needs.
        </li>
      </ul>
    </>
  );
}
