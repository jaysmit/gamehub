"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatDate } from "@/lib/utils";

interface SharedPoem {
  id: string;
  preview: string;
  shareSlug: string;
  createdAt: string;
  likes: number;
}

// Mock data for now - will be replaced with real data from database
const mockPoems: SharedPoem[] = [
  {
    id: "1",
    preview: "In the quiet moments before dawn, I found myself standing at the edge of possibility...",
    shareSlug: "abc123",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 24,
  },
  {
    id: "2",
    preview: "The path I've walked has taught me that strength isn't about never falling...",
    shareSlug: "def456",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    likes: 18,
  },
  {
    id: "3",
    preview: "What matters most isn't what I achieve, but who I become in the pursuit...",
    shareSlug: "ghi789",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    likes: 31,
  },
  {
    id: "4",
    preview: "I've learned that the answers I seek are often hidden in the questions I avoid...",
    shareSlug: "jkl012",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    likes: 42,
  },
  {
    id: "5",
    preview: "There's a version of me that exists in my dreams, bold and unafraid...",
    shareSlug: "mno345",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    likes: 15,
  },
  {
    id: "6",
    preview: "The weight I carry isn't mine alone to bear, though I've pretended otherwise...",
    shareSlug: "pqr678",
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    likes: 28,
  },
];

export default function ExplorePage() {
  const [poems, setPoems] = useState<SharedPoem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading - replace with actual API call
    const timer = setTimeout(() => {
      setPoems(mockPoems);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="px-6 pt-12 pb-8 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-crimson)] text-3xl sm:text-4xl text-foreground mb-4">
            Explore Reflections
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Discover what others have uncovered about themselves.
            Each reflection is a window into someone&apos;s journey of self-discovery.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 bg-card rounded-xl border border-border animate-pulse">
                  <div className="h-4 bg-border rounded w-3/4 mb-4" />
                  <div className="h-4 bg-border rounded w-1/2 mb-4" />
                  <div className="h-4 bg-border rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {poems.map((poem) => (
                <Link
                  key={poem.id}
                  href={`/poem/${poem.shareSlug}`}
                  className="group p-6 bg-card rounded-xl border border-border hover:border-accent/30 transition-all duration-200 hover:shadow-lg"
                >
                  {/* Preview */}
                  <p className="font-[family-name:var(--font-crimson)] text-foreground/80 leading-relaxed mb-4 line-clamp-3">
                    &ldquo;{poem.preview}&rdquo;
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">
                      {formatDate(poem.createdAt)}
                    </span>
                    <div className="flex items-center gap-1 text-muted group-hover:text-accent transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{poem.likes}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load more placeholder */}
          {!loading && poems.length > 0 && (
            <div className="mt-12 text-center">
              <button className="text-sm text-muted hover:text-foreground transition-colors">
                Load more reflections
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && poems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted mb-6">No shared reflections yet</p>
              <Link
                href="/begin"
                className="text-accent hover:brightness-110 transition-colors"
              >
                Be the first to share yours
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
