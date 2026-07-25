"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { useJourneyState } from "@/hooks/useJourneyState";
import { trackEvent, getAnonymousToken } from "@/lib/analytics";

const loadingMessages = [
  "Reading your words...",
  "Finding the thread...",
  "Weaving meaning...",
  "Shaping your reflection...",
];

export default function GeneratingPage() {
  const router = useRouter();
  const { state, isHydrated, setPrivacyConsent } = useJourneyState();
  const [agreed, setAgreed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    router.push("/deepen");
  };

  // Redirect if no hero answer - only after hydration
  useEffect(() => {
    if (!isHydrated) return;

    if (!state.answers.heroAnswer || state.answers.heroAnswer.trim().length < 10) {
      router.push("/begin");
    }
  }, [isHydrated, state.answers.heroAnswer, router]);

  // Cycle through loading messages
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const generatePoem = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      trackEvent("privacy_consent", { anonymousToken: getAnonymousToken() });

      const response = await fetch("/api/generate-poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: state.answers,
          questionSetId: state.questionSetId,
          anonymousToken: getAnonymousToken(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate");
      }

      const data = await response.json();

      trackEvent("poem_generated", {
        anonymousToken: getAnonymousToken(),
        metadata: { poemId: data.poemId },
      });

      // Store poem data for reveal page
      if (typeof window !== "undefined") {
        localStorage.setItem("iv_current_poem", JSON.stringify(data));
      }

      router.push("/poem");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsGenerating(false);
    }
  }, [state.answers, state.questionSetId, router]);

  const handleGenerate = () => {
    setPrivacyConsent(true);
    generatePoem();
  };

  // Show loading state
  if (isGenerating) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background stars">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center page-transition">
            {/* Animated dots */}
            <div className="flex justify-center gap-2 mb-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            {/* Loading message */}
            <p className="font-[family-name:var(--font-crimson)] text-xl text-foreground">
              {loadingMessages[loadingMessageIndex]}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted">Loading...</div>
        </div>
      </main>
    );
  }

  // Show privacy consent (simple checkbox)
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background stars">
      <Header />

      {/* Back button bar */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <button
            onClick={handleBack}
            className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full page-transition">
          {/* Almost there message */}
          <h1 className="font-[family-name:var(--font-crimson)] text-2xl text-foreground text-center mb-8">
            Almost there
          </h1>

          <p className="text-muted text-center mb-8 leading-relaxed">
            Your answers will be used only to create your reflection and won&apos;t be shared with anyone.
          </p>

          {/* Simple checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-8 p-4 rounded-lg bg-card border border-border hover:border-accent/50 transition-colors">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border bg-background text-accent focus:ring-accent focus:ring-offset-0 focus:ring-offset-background"
            />
            <span className="text-sm text-foreground/80 leading-relaxed">
              I understand my answers are private and I haven&apos;t included sensitive personal details like full names or addresses.
            </span>
          </label>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            disabled={!agreed}
            className="w-full"
            size="lg"
          >
            See my reflection
          </Button>

          {/* Small note */}
          <p className="text-xs text-muted/50 text-center mt-6">
            This usually takes about 15 seconds
          </p>
        </div>
      </div>
    </main>
  );
}
