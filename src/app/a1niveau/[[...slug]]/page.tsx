import { NiveauPageLayout } from "@/app/_components/niveau-page-layout";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function A1NiveauPage({ params }: DocPageProps) {
  const { slug: rawSlug } = await params;
  
  // Decode URL components to handle German characters like Ü in Übungen
  const slug = rawSlug ? rawSlug.map(segment => decodeURIComponent(segment)) : rawSlug;

  return (
    <NiveauPageLayout 
      niveau="a1niveau"
      niveauTitle="A1 Niveau"
      niveauDescription="Học tiếng Đức từ cơ bản - Niveau A1 theo khung tham chiếu châu Âu"
      slug={slug}
    />
  );
}
