import { CodeBlock } from "@/components/code-block";

export function InstallationPage() {
  return (
    <>
      <h2 id="overview">First Exercise</h2>
      <p>
        This is a placeholder for the first exercise.
      </p>
      <p>You could include questions and interactive components here.</p>

      <CodeBlock value={`<Exercise>
  <Question text="What is the capital of Germany?" />
  <Answer options={["Berlin", "Munich", "Hamburg"]} />
</Exercise>`} />

    </>
  );
}
