import { NiveauPageLayout } from "@/app/_components/niveau-page-layout";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function A2NiveauPage({ params }: DocPageProps) {
  const { slug: rawSlug } = await params;
  
  // Decode URL components to handle German characters like Ü in Übungen
  const slug = rawSlug ? rawSlug.map(segment => decodeURIComponent(segment)) : rawSlug;

  return (
    <NiveauPageLayout 
      niveau="a2niveau"
      niveauTitle="A2 Niveau"
      niveauDescription="Tiếng Đức cơ bản nâng cao - Niveau A2 theo khung tham chiếu châu Âu"
      slug={slug}
    />
  );
}
