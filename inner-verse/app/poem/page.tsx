"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PoemDisplay } from "@/components/poem/PoemDisplay";
import { PoemActions } from "@/components/poem/PoemActions";
import { Header } from "@/components/layout/Header";
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

  // Load poem data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("iv_current_poem");
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
