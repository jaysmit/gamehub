import { Metadata } from "next";
import Link from "next/link";
import { PoemDisplay } from "@/components/poem/PoemDisplay";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

// TODO: Fetch poem from database by shareSlug
// For now, this is a placeholder that will show an error

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  // TODO: Fetch poem and use first line as description
  return {
    title: `A Poem | ${siteConfig.name}`,
    description: "A personal reflection, transformed into verse.",
    openGraph: {
      title: `A Poem from ${siteConfig.name}`,
      description: "Someone reflected deeply and received this poem. Write yours.",
      type: "article",
    },
  };
}

export default async function SharedPoemPage({ params }: PageProps) {
  const { id: shareSlug } = await params;

  // TODO: Fetch poem from Supabase by shareSlug
  // For now, return a placeholder message
  const poem = null; // await fetchPoemByShareSlug(shareSlug);

  if (!poem) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-stone-50 px-6">
        <div className="text-center max-w-md">
          <p className="font-[family-name:var(--font-crimson)] text-sm text-stone-400 mb-8">
            {siteConfig.name}
          </p>

          <h1 className="font-[family-name:var(--font-crimson)] text-2xl text-stone-700 mb-4">
            Poem not found
          </h1>

          <p className="text-stone-500 mb-8">
            This poem may have been removed or the link may be incorrect.
          </p>

          <Link href="/">
            <Button>Write your own</Button>
          </Link>
        </div>
      </main>
    );
  }

  // When poem exists, display it
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-stone-50">
      {/* Header */}
      <header className="py-8 text-center">
        <Link href="/">
          <p className="font-[family-name:var(--font-crimson)] text-sm text-stone-400 hover:text-stone-600 transition-colors">
            {siteConfig.name}
          </p>
        </Link>
      </header>

      {/* Poem */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto w-full">
          {/* @ts-expect-error - poem.content will exist when fetched */}
          <PoemDisplay content={poem.content} animate={false} />
        </div>
      </div>

      {/* CTA */}
      <footer className="py-12 text-center">
        <div className="max-w-md mx-auto px-6">
          <p className="text-stone-500 mb-6">
            This poem was written from someone&apos;s reflection.
          </p>
          <Link href="/">
            <Button size="lg">Write yours</Button>
          </Link>
        </div>
      </footer>
    </main>
  );
}
