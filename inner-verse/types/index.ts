// ============================================
// TYPE DEFINITIONS
// ============================================

export interface QuestionSet {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "personal" | "relationship" | "milestone" | "seasonal";
  heroQuestion: string;
  heroGuidance: string;
  deepeningPrompts: DeepeningPrompt[];
  isPremium: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface DeepeningPrompt {
  id: string;
  question: string;
  promptList?: string[]; // List of aspects to consider
  placeholder?: string;
  isOptional: boolean;
}

export interface Journey {
  id: string;
  userId?: string;
  anonymousToken?: string;
  questionSetId: string;
  answers: JourneyAnswers;
  startedAt: string;
  completedAt?: string;
  poemId?: string;
  privacyConsent: boolean;
}

export interface JourneyAnswers {
  heroAnswer: string;
  deepeningAnswers: Record<string, string>; // promptId -> answer
}

export interface Poem {
  id: string;
  journeyId: string;
  userId?: string;
  content: string;
  questionSetId: string;
  occasion?: string;
  isPremium: boolean;
  shareSlug: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  poemsRemaining: number;
  subscriptionTier: "free" | "one-off" | "subscriber";
  completedSets: string[];
  totalJourneys: number;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType: EventType;
  userId?: string;
  anonymousToken?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type EventType =
  | "landing_view"
  | "begin_click"
  | "answer_completed"
  | "deepening_started"
  | "deepening_completed"
  | "deepening_skipped"
  | "privacy_consent"
  | "poem_generated"
  | "poem_viewed"
  | "share_clicked"
  | "copy_clicked"
  | "download_clicked"
  | "signup_started"
  | "signup_completed"
  | "paywall_view"
  | "profile_view";

// Journey state for client-side management
export interface JourneyState {
  questionSetId: string;
  currentStep: "hero" | "deepening" | "privacy" | "generating" | "reveal";
  currentPromptIndex: number;
  answers: JourneyAnswers;
  totalPrompts: number;
  privacyConsent: boolean;
}
