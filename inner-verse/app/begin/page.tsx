"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/journey/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { useJourneyState } from "@/hooks/useJourneyState";
import { getDefaultQuestionSet } from "@/data/questionSets";
import { trackEvent, getAnonymousToken } from "@/lib/analytics";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const MIN_CHARACTERS = 300;

export default function BeginPage() {
  const router = useRouter();
  const questionSet = getDefaultQuestionSet();
  const [showQuestion, setShowQuestion] = useState(false);
  const {
    state,
    isHydrated,
    setHeroAnswer,
    nextStep,
    getCurrentQuestionNumber,
  } = useJourneyState();

  const currentQuestion = getCurrentQuestionNumber();
  const totalQuestions = state.totalPrompts;
  const characterCount = state.answers.heroAnswer.trim().length;
  const canContinue = characterCount >= MIN_CHARACTERS;
  const charactersRemaining = MIN_CHARACTERS - characterCount;

  // Track page view
  useEffect(() => {
    trackEvent("answer_completed", {
      anonymousToken: getAnonymousToken(),
      metadata: { step: "hero_view" },
    });
  }, []);

  // Auto-show question if user already has content (returning to edit)
  useEffect(() => {
    if (isHydrated && state.answers.heroAnswer.length > 0) {
      setShowQuestion(true);
    }
  }, [isHydrated, state.answers.heroAnswer]);

  const handleReady = () => {
    setShowQuestion(true);
  };

  const handleContinue = () => {
    trackEvent("answer_completed", {
      anonymousToken: getAnonymousToken(),
      metadata: { step: "hero_complete" },
    });
    nextStep();
    router.push("/deepen");
  };

  const handleBack = () => {
    router.push("/");
  };

  // Ready popup
  if (!showQuestion) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background stars">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="max-w-md w-full text-center page-transition">
            <div className="mb-12">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-accent/20 flex items-center justify-center glow-accent">
                <svg
                  className="w-10 h-10 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>

              <h1 className="font-[family-name:var(--font-crimson)] text-3xl text-foreground mb-4">
                Ready for your question?
              </h1>

              <p className="text-muted leading-relaxed mb-8">
                Find a quiet moment. This works best when you can give it your full attention.
              </p>
            </div>

            <Button onClick={handleReady} size="lg" className="min-w-[180px]">
              I&apos;m ready
            </Button>

            <div className="mt-6">
              <button
                onClick={handleBack}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background stars">
      <Header />

      {/* Progress bar section */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <span className="text-xs text-accent font-medium px-2 py-1 bg-accent/10 rounded-full">
              Question 1 of 2
            </span>
          </div>
          <ProgressBar
            current={currentQuestion}
            total={totalQuestions}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 py-12 overflow-auto">
        <div className="max-w-2xl mx-auto page-transition">
          {/* Question - bigger and bolder */}
          <h1 className="font-[family-name:var(--font-crimson)] text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground leading-snug mb-6">
            {questionSet.heroQuestion}
          </h1>

          {/* Guidance - minimal, encouraging */}
          <p className="text-muted mb-8 leading-relaxed italic">
            {questionSet.heroGuidance}
          </p>

          {/* Writing area - more obvious */}
          <div className="relative">
            <textarea
              value={state.answers.heroAnswer}
              onChange={(e) => setHeroAnswer(e.target.value)}
              placeholder="Start writing here..."
              autoFocus
              className={cn(
                "w-full min-h-[300px] p-6 rounded-xl",
                "bg-card border-2 border-border",
                "text-lg text-foreground leading-relaxed",
                "placeholder:text-muted/50",
                "focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/20",
                "transition-all duration-200",
                "resize-none"
              )}
            />

            {/* Character count */}
            <div className="absolute bottom-4 right-4 text-sm">
              {canContinue ? (
                <span className="text-green-500">{characterCount} characters</span>
              ) : (
                <span className="text-muted">
                  {charactersRemaining} more to go
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with continue button */}
      <footer className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-muted">
            {!canContinue && (
              <span>Minimum {MIN_CHARACTERS} characters</span>
            )}
          </div>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="min-w-[120px]"
          >
            Continue
          </Button>
        </div>
      </footer>
    </main>
  );
}
