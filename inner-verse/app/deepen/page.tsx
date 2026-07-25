"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/journey/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { useJourneyState } from "@/hooks/useJourneyState";
import { getDefaultQuestionSet } from "@/data/questionSets";
import { trackEvent, getAnonymousToken } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function DeepenPage() {
  const router = useRouter();
  const questionSet = getDefaultQuestionSet();
  const {
    state,
    isHydrated,
    setDeepeningAnswer,
    nextStep,
    getCurrentQuestionNumber,
  } = useJourneyState();

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showPreviousAnswer, setShowPreviousAnswer] = useState(true);
  const currentPrompt = questionSet.deepeningPrompts[state.currentPromptIndex];
  const currentQuestion = getCurrentQuestionNumber();
  const totalQuestions = state.totalPrompts;

  // Track when entering deepening stage
  useEffect(() => {
    if (state.currentPromptIndex === 0) {
      trackEvent("deepening_started", {
        anonymousToken: getAnonymousToken(),
      });
    }
  }, [state.currentPromptIndex]);

  // Redirect if no hero answer - ONLY after hydration
  useEffect(() => {
    if (!isHydrated) return; // Wait for localStorage to load

    if (!state.answers.heroAnswer || state.answers.heroAnswer.trim().length < 100) {
      router.push("/begin");
    }
  }, [isHydrated, state.answers.heroAnswer, router]);

  // Clear the answer when arriving (don't load saved deepening answer)
  useEffect(() => {
    setCurrentAnswer("");
  }, []);

  // Handle answer changes
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCurrentAnswer(value);
    if (currentPrompt) {
      setDeepeningAnswer(currentPrompt.id, value);
    }
  };

  // Handle continue - go directly to generating page
  const handleContinue = () => {
    trackEvent("deepening_completed", {
      anonymousToken: getAnonymousToken(),
    });
    nextStep();
    router.push("/generating");
  };

  // Handle skip - also go to generating page
  const handleSkip = () => {
    trackEvent("deepening_skipped", {
      anonymousToken: getAnonymousToken(),
      metadata: { promptId: currentPrompt?.id },
    });
    nextStep();
    router.push("/generating");
  };

  // Handle edit previous answer
  const handleEditPrevious = () => {
    router.push("/begin");
  };

  // Handle back
  const handleBack = () => {
    router.push("/begin");
  };

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

  if (!currentPrompt) {
    return null;
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
              Question 2 of 2
            </span>
          </div>
          <ProgressBar
            current={currentQuestion}
            total={totalQuestions}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 py-8 overflow-auto">
        <div className="max-w-2xl mx-auto page-transition">
          {/* Question header - always at top */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 text-xs font-medium text-accent bg-accent/10 rounded-full mb-4">
              Go deeper
            </span>
            <h1 className="font-[family-name:var(--font-crimson)] text-xl sm:text-2xl font-semibold text-foreground leading-snug">
              {currentPrompt.question}
            </h1>
          </div>

          {/* Prompt list - aspects to consider */}
          {currentPrompt.promptList && currentPrompt.promptList.length > 0 && (
            <ul className="space-y-2 mb-6 pl-1">
              {currentPrompt.promptList.map((prompt, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-muted text-sm"
                >
                  <span className="text-accent mt-0.5">•</span>
                  <span className="leading-relaxed">{prompt}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Writing area - now above previous answer */}
          <div className="relative mb-8">
            <textarea
              value={currentAnswer}
              onChange={handleAnswerChange}
              placeholder={currentPrompt.placeholder || "Add more details here..."}
              autoFocus
              className={cn(
                "w-full min-h-[200px] p-6 rounded-xl",
                "bg-card border-2 border-border",
                "text-lg text-foreground leading-relaxed",
                "placeholder:text-muted/50",
                "focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/20",
                "transition-all duration-200",
                "resize-none"
              )}
            />
          </div>

          {/* Previous answer section - now below the input */}
          {showPreviousAnswer && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted">Your reflection so far</p>
                <button
                  onClick={handleEditPrevious}
                  className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
              </div>
              <div className="p-4 bg-card rounded-lg border border-border max-h-40 overflow-auto">
                <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {state.answers.heroAnswer}
                </p>
              </div>
              <button
                onClick={() => setShowPreviousAnswer(false)}
                className="mt-2 text-xs text-muted hover:text-foreground"
              >
                Hide
              </button>
            </div>
          )}

          {!showPreviousAnswer && (
            <button
              onClick={() => setShowPreviousAnswer(true)}
              className="text-sm text-accent hover:text-accent/80 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Show my previous answer
            </button>
          )}
        </div>
      </div>

      {/* Footer with continue button */}
      <footer className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-muted">
            {currentPrompt.isOptional && "This step is optional"}
          </p>
          <div className="flex gap-3">
            {currentPrompt.isOptional && (
              <Button variant="ghost" onClick={handleSkip}>
                Skip this
              </Button>
            )}
            <Button
              onClick={handleContinue}
              className="min-w-[160px]"
            >
              Create my reflection
            </Button>
          </div>
        </div>
      </footer>
    </main>
  );
}
