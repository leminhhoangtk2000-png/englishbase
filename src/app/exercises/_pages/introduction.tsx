import { Separator } from "@/components/ui/separator";

export function IntroductionPage() {
  return (
    <>
      <h2 id="overview">Overview</h2>
      <p>
        This section contains exercises to practice your German.
      </p>
      <p>
        These exercises are designed to reinforce what you've learned.
      </p>

      <Separator className="my-6" />

      <h2 id="key-features">Key Features</h2>
      <ul>
        <li>
          <strong>Interactive:</strong> Get immediate feedback on your answers.
        </li>
        <li>
          <strong>Comprehensive:</strong> Covers all aspects of the language.
        </li>
        <li>
          <strong>Customizable:</strong> Create your own exercises.
        </li>
      </ul>
    </>
  );
}
