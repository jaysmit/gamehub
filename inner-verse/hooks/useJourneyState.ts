"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { JourneyState, JourneyAnswers } from "@/types";
import { getDefaultQuestionSet, getTotalQuestions } from "@/data/questionSets";

const JOURNEY_STORAGE_KEY = "iv_journey_state";

const defaultQuestionSet = getDefaultQuestionSet();

const initialState: JourneyState = {
  questionSetId: defaultQuestionSet.id,
  currentStep: "hero",
  currentPromptIndex: 0,
  answers: {
    heroAnswer: "",
    deepeningAnswers: {},
  },
  totalPrompts: getTotalQuestions(defaultQuestionSet),
  privacyConsent: false,
};

export function useJourneyState() {
  const [state, setState, clearState, isHydrated] = useLocalStorage<JourneyState>(
    JOURNEY_STORAGE_KEY,
    initialState
  );

  // Update hero answer
  const setHeroAnswer = useCallback(
    (answer: string) => {
      setState((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          heroAnswer: answer,
        },
      }));
    },
    [setState]
  );

  // Update a deepening answer
  const setDeepeningAnswer = useCallback(
    (promptId: string, answer: string) => {
      setState((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          deepeningAnswers: {
            ...prev.answers.deepeningAnswers,
            [promptId]: answer,
          },
        },
      }));
    },
    [setState]
  );

  // Move to next step
  const nextStep = useCallback(() => {
    setState((prev) => {
      const questionSet = getDefaultQuestionSet();

      if (prev.currentStep === "hero") {
        return {
          ...prev,
          currentStep: "deepening",
          currentPromptIndex: 0,
        };
      }

      if (prev.currentStep === "deepening") {
        const nextIndex = prev.currentPromptIndex + 1;
        if (nextIndex >= questionSet.deepeningPrompts.length) {
          return {
            ...prev,
            currentStep: "privacy",
          };
        }
        return {
          ...prev,
          currentPromptIndex: nextIndex,
        };
      }

      if (prev.currentStep === "privacy") {
        return {
          ...prev,
          currentStep: "generating",
          privacyConsent: true,
        };
      }

      if (prev.currentStep === "generating") {
        return {
          ...prev,
          currentStep: "reveal",
        };
      }

      return prev;
    });
  }, [setState]);

  // Skip current deepening prompt
  const skipPrompt = useCallback(() => {
    setState((prev) => {
      const questionSet = getDefaultQuestionSet();
      const nextIndex = prev.currentPromptIndex + 1;

      if (nextIndex >= questionSet.deepeningPrompts.length) {
        return {
          ...prev,
          currentStep: "privacy",
        };
      }

      return {
        ...prev,
        currentPromptIndex: nextIndex,
      };
    });
  }, [setState]);

  // Get current question number (1-indexed for display)
  const getCurrentQuestionNumber = useCallback(() => {
    if (state.currentStep === "hero") return 1;
    if (state.currentStep === "deepening") return state.currentPromptIndex + 2; // +1 for hero, +1 for 1-index
    return state.totalPrompts;
  }, [state]);

  // Reset journey
  const resetJourney = useCallback(() => {
    clearState();
  }, [clearState]);

  // Set privacy consent
  const setPrivacyConsent = useCallback(
    (consent: boolean) => {
      setState((prev) => ({
        ...prev,
        privacyConsent: consent,
      }));
    },
    [setState]
  );

  return {
    state,
    isHydrated,
    setHeroAnswer,
    setDeepeningAnswer,
    nextStep,
    skipPrompt,
    getCurrentQuestionNumber,
    resetJourney,
    setPrivacyConsent,
  };
}
