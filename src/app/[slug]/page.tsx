import { getAllProfessionals } from "@/lib/db";
import ProfileClient from "./ProfileClient";

// Since we're using "output: export", we must pre-render all possible slugs.
// This fetches the known professionals from the database at build time.
// Note: If a new professional signs up, this won't automatically update 
// unless the project is rebuilt, or if Firebase can fallback to index.html (SPA mode).
// For the MVP, this enables deployment on the free tier!
export async function generateStaticParams() {
  const professionals = await getAllProfessionals();
  return professionals.map((professional) => ({
    slug: professional.slug,
  }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProfessionalPublicPage({ params }: PageProps) {
  const { slug } = await params;
  
  return <ProfileClient slug={slug} />;
}
