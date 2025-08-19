import { CodeBlock } from "@/components/code-block";

export function InstallationPage() {
  return (
    <>
      <h2 id="overview">Dashboard Example</h2>
      <p>
        This is a placeholder for a full dashboard example page.
      </p>
      <p>You could include charts, tables, and other components here.</p>

      <CodeBlock value={`<Dashboard>
  <Header />
  <Content>
    <DataTable />
  </Content>
</Dashboard>`} />

    </>
  );
}
