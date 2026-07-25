import { QuestionSet } from "@/types";

// ============================================
// QUESTION SETS
// v1 ships with one set; structure supports max 3 questions
// ============================================

export const questionSets: QuestionSet[] = [
  {
    id: "self-discovery-v1",
    slug: "self-discovery",
    title: "Self Discovery",
    description: "Explore the person you're becoming",
    category: "personal",
    heroQuestion:
      "Sitting in the middle of my most successful life, what do I see within me that I didn't know was available to me before?",
    heroGuidance:
      "Close your eyes. Visualise. Sit with this question and let it unfold. There's no right answer — only your truth.",
    deepeningPrompts: [
      {
        id: "deepen",
        question: "Now add to your reflection. Consider any of these that speak to you:",
        promptList: [
          "Where are you sitting? Describe the place.",
          "Who is around you — or are you alone?",
          "What does your body feel like in this moment?",
          "What does your work or purpose look like?",
          "What do your closest relationships feel like?",
          "What fear did you have to walk through to get here?",
          "What would your future self want you to know right now?",
        ],
        placeholder: "Add anything else that comes to mind...",
        isOptional: true,
      },
    ],
    isPremium: false,
    isActive: true,
    displayOrder: 1,
  },
];

// Helper to get the default question set
export const getDefaultQuestionSet = (): QuestionSet => {
  return questionSets.find((qs) => qs.isActive && !qs.isPremium) || questionSets[0];
};

// Helper to get question set by slug
export const getQuestionSetBySlug = (slug: string): QuestionSet | undefined => {
  return questionSets.find((qs) => qs.slug === slug);
};

// Calculate total questions (hero + deepening prompts)
export const getTotalQuestions = (questionSet: QuestionSet): number => {
  return 1 + questionSet.deepeningPrompts.length; // hero + deepening
};
