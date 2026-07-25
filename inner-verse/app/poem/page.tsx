"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PoemDisplay } from "@/components/poem/PoemDisplay";
import { PoemActions } from "@/components/poem/PoemActions";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useJourneyState } from "@/hooks/useJourneyState";
import { trackEvent, getAnonymousToken } from "@/lib/analytics";

interface PoemData {
  poemId: string;
  content: string;
  shareSlug: string;
  questionSetId: string;
  createdAt: string;
}

export default function PoemRevealPage() {
  const router = useRouter();
  const { resetJourney } = useJourneyState();
  const [poemData, setPoemData] = useState<PoemData | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load poem data from localStorage (current or history)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Try current poem first
    let stored = localStorage.getItem("iv_current_poem");

    // If no current poem, try most recent from history
    if (!stored) {
      const history = localStorage.getItem("iv_poem_history");
      if (history) {
        try {
          const poems = JSON.parse(history);
          if (poems.length > 0) {
            stored = JSON.stringify(poems[0]);
            // Restore to current
            localStorage.setItem("iv_current_poem", stored);
          }
        } catch {
          // Invalid history
        }
      }
    }

    if (stored) {
      try {
        const data = JSON.parse(stored) as PoemData;
        setPoemData(data);
        trackEvent("poem_viewed", {
          anonymousToken: getAnonymousToken(),
          metadata: { poemId: data.poemId },
        });
      } catch {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  // Show actions after poem animation completes
  useEffect(() => {
    if (!poemData) return;

    const stanzaCount =
      poemData.content
        .split(/\n\s*\n/)
        .filter((s) => s.trim().length > 0).length || 1;

    const delay = stanzaCount * 800 + 500; // Time for all stanzas + buffer
    const timer = setTimeout(() => setShowActions(true), delay);

    return () => clearTimeout(timer);
  }, [poemData]);

  const handleReveal = () => {
    setIsTransitioning(true);
    // Short delay for fade out effect
    setTimeout(() => {
      setIsRevealed(true);
      trackEvent("poem_revealed", {
        anonymousToken: getAnonymousToken(),
        metadata: { poemId: poemData?.poemId },
      });
    }, 500);
  };

  const handleCreateAnother = () => {
    // Clear current poem and journey
    localStorage.removeItem("iv_current_poem");
    resetJourney();

    // TODO: Check if user is logged in and has poems remaining
    // For now, redirect to signup prompt or begin
    router.push("/auth/signin?next=begin");
  };

  if (!poemData) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted">Loading...</div>
        </div>
      </main>
    );
  }

  // Show "ready" screen before revealing poem
  if (!isRevealed) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background stars">
        <Header />
        <div className={`flex-1 flex flex-col items-center justify-center px-6 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <div className="max-w-md w-full text-center page-transition">
            {/* Glowing icon */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div
                className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <div
                className="absolute inset-3 rounded-full opacity-40 animate-pulse"
                style={{ backgroundColor: "var(--accent)", animationDelay: "0.3s" }}
              />
              <div
                className="absolute inset-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            <h1 className="font-[family-name:var(--font-crimson)] text-3xl text-foreground mb-4">
              Your reflection is ready
            </h1>

            <p className="text-muted leading-relaxed mb-4">
              We&apos;ve transformed your words into something personal.
            </p>

            <p className="text-foreground/80 text-lg mb-10 font-[family-name:var(--font-crimson)]">
              It&apos;s a poem, written just for you.
            </p>

            <Button onClick={handleReveal} size="lg" className="min-w-[200px]">
              I&apos;m ready to see it
            </Button>

            <p className="text-xs text-muted/50 mt-8">
              Take a breath. This is your moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background stars">
      <Header />

      {/* Poem */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto w-full">
          <PoemDisplay content={poemData.content} animate />
        </div>
      </div>

      {/* Actions */}
      <footer
        className={`py-8 transition-opacity duration-500 ${
          showActions ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-2xl mx-auto px-6">
          <PoemActions
            content={poemData.content}
            shareSlug={poemData.shareSlug}
            onCreateAnother={handleCreateAnother}
          />
        </div>
      </footer>
    </main>
  );
}
