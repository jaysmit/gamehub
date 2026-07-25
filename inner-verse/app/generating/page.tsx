"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { useJourneyState } from "@/hooks/useJourneyState";
import { trackEvent, getAnonymousToken } from "@/lib/analytics";

const generationStages = [
  { message: "Reading your words...", duration: 3000 },
  { message: "Finding the deeper meaning...", duration: 4000 },
  { message: "Weaving your truth...", duration: 5000 },
  { message: "Crafting something personal...", duration: 5000 },
  { message: "Adding the finishing touches...", duration: 3000 },
];

export default function GeneratingPage() {
  const router = useRouter();
  const { state, isHydrated, setPrivacyConsent } = useJourneyState();
  const [agreed, setAgreed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
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

  // Progress animation
  useEffect(() => {
    if (!isGenerating) return;

    const stage = generationStages[currentStage];
    if (!stage) return;

    // Animate progress within current stage
    const progressInterval = setInterval(() => {
      setStageProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, stage.duration / 50);

    // Move to next stage
    const stageTimeout = setTimeout(() => {
      if (currentStage < generationStages.length - 1) {
        setCurrentStage((prev) => prev + 1);
        setStageProgress(0);
      }
    }, stage.duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stageTimeout);
    };
  }, [isGenerating, currentStage]);

  const generatePoem = useCallback(async () => {
    setIsGenerating(true);
    setCurrentStage(0);
    setStageProgress(0);
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

      // Store poem data for reveal page AND for retrieval later
      if (typeof window !== "undefined") {
        localStorage.setItem("iv_current_poem", JSON.stringify(data));

        // Also store in poem history
        const history = JSON.parse(localStorage.getItem("iv_poem_history") || "[]");
        history.unshift({
          ...data,
          savedAt: new Date().toISOString(),
        });
        // Keep last 10 poems
        localStorage.setItem("iv_poem_history", JSON.stringify(history.slice(0, 10)));
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

  // Calculate overall progress
  const totalStages = generationStages.length;
  const overallProgress = ((currentStage / totalStages) * 100) + (stageProgress / totalStages);

  // Show loading state with progress meter
  if (isGenerating) {
    const currentMessage = generationStages[currentStage]?.message || "Almost there...";

    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background stars">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-md w-full text-center page-transition">
            {/* Glowing orb animation */}
            <div className="relative w-32 h-32 mx-auto mb-12">
              <div
                className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <div
                className="absolute inset-4 rounded-full opacity-40 animate-pulse"
                style={{ backgroundColor: "var(--accent)", animationDelay: "0.5s" }}
              />
              <div
                className="absolute inset-8 rounded-full opacity-60 animate-pulse"
                style={{ backgroundColor: "var(--accent)", animationDelay: "1s" }}
              />
              <div
                className="absolute inset-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.min(overallProgress, 95)}%`,
                    backgroundColor: "var(--accent)"
                  }}
                />
              </div>
              <p className="text-xs text-muted mt-2">
                {Math.round(Math.min(overallProgress, 95))}% complete
              </p>
            </div>

            {/* Current stage message */}
            <p className="font-[family-name:var(--font-crimson)] text-xl text-foreground mb-4">
              {currentMessage}
            </p>

            {/* Stage indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {generationStages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index < currentStage
                      ? "scale-100"
                      : index === currentStage
                      ? "scale-125"
                      : "opacity-30"
                  }`}
                  style={{
                    backgroundColor: index <= currentStage ? "var(--accent)" : "var(--border)"
                  }}
                />
              ))}
            </div>
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
            This usually takes about 20 seconds
          </p>
        </div>
      </div>
    </main>
  );
}
