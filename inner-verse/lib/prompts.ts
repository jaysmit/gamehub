import { JourneyAnswers } from "@/types";
import { QuestionSet } from "@/types";

// ============================================
// AI PROMPTS
// Versioned and easy to iterate
// ============================================

export const POEM_GENERATION_PROMPT_V1 = `You are a poet helping someone discover themselves through their own words.

You will receive answers to reflection questions about someone's vision of their most successful life. Your task is to write a deeply personal poem using THEIR words and images wherever possible.

## Guidelines

1. **Voice**: Write in first person, present-tense honesty. Not retrospective polish or advice - immediate truth.

2. **Style**:
   - Prefer aphoristic couplets over flowing stanzas
   - Emotional groundedness, not flowery abstraction
   - Short, punchy lines that land
   - Use their exact phrases when powerful

3. **Structure**:
   - 4-6 short stanzas
   - Arc: fear → courage → the journey → discovery
   - End with an insight or truth that feels earned

4. **Tone**: Warm but not saccharine. Honest but not harsh. Like a letter from a wise friend.

5. **What to avoid**:
   - Generic inspirational language
   - Forced rhymes
   - Abstract platitudes
   - Anything that feels like a greeting card

## The reflection answers to work from:`;

export function buildPoemPrompt(
  answers: JourneyAnswers,
  questionSet: QuestionSet
): string {
  let prompt = POEM_GENERATION_PROMPT_V1 + "\n\n";

  // Add hero answer
  prompt += `### Main reflection (${questionSet.heroQuestion})\n`;
  prompt += answers.heroAnswer + "\n\n";

  // Add deepening answers
  const answeredPrompts = questionSet.deepeningPrompts.filter(
    (p) => answers.deepeningAnswers[p.id]?.trim()
  );

  if (answeredPrompts.length > 0) {
    prompt += "### Deepening reflections\n\n";

    for (const deepeningPrompt of answeredPrompts) {
      const answer = answers.deepeningAnswers[deepeningPrompt.id];
      if (answer?.trim()) {
        prompt += `**${deepeningPrompt.question}**\n`;
        prompt += answer + "\n\n";
      }
    }
  }

  prompt += `\n---\n\nNow write a poem (4-6 stanzas) that captures the essence of this person's reflection. Use their words. Honor their journey. Make it feel like their own truth, beautifully arranged.

Output only the poem, no title or commentary.`;

  return prompt;
}

// Future: prompt for regeneration with different style
export const POEM_REGENERATE_PROMPT_V1 = `Take the following poem and rewrite it with a slightly different emphasis. Keep the same core truths but find new angles, new images, or a different emotional landing point.

Original poem:
{poem}

New version:`;

// Future: prompt for "go deeper" feature
export const POEM_DEEPEN_PROMPT_V1 = `The following poem was written from someone's reflection. They want to go deeper. Write 2-3 follow-up questions that would help them explore the themes in this poem more fully.

Poem:
{poem}

Questions should be:
- Open-ended
- Personal but not intrusive
- Focused on one specific image or line from the poem

Output as a JSON array of strings.`;
