import { JourneyAnswers } from "@/types";
import { QuestionSet } from "@/types";

// ============================================
// AI PROMPTS
// Versioned and easy to iterate
// ============================================

export const POEM_GENERATION_PROMPT_V1 = `You are a poet and philosopher helping someone discover profound truths about themselves through their own words.

You will receive answers to reflection questions about someone's vision of their most successful life. Your task is to write a deeply personal, emotionally resonant poem that touches the soul - using THEIR words and images wherever possible.

## Guidelines

1. **Voice**: Write in first person, present-tense honesty. Not retrospective polish or advice - immediate, raw truth that makes them feel seen.

2. **Emotional Depth**:
   - Dig beneath the surface - find the vulnerability behind the words
   - Name the fears they haven't fully articulated
   - Celebrate the courage it takes to dream
   - Find the universal human experience in their specific story
   - Make them feel understood in a way they didn't expect

3. **Style**:
   - Mix aphoristic couplets with longer, flowing passages
   - Emotional groundedness, not flowery abstraction
   - Lines that land in the chest, not just the mind
   - Use their exact phrases when powerful - echo them back transformed
   - Include moments of surprising insight
   - Build to emotional crescendos

4. **Structure**:
   - 7-10 substantial stanzas (longer than typical poems)
   - Arc: the weight they carry → the dreams they hold → the fears beneath → the strength within → the path forward → the truth revealed
   - Include a turning point - a moment of realization
   - End with an insight that feels both surprising and inevitable

5. **Tone**: Intimate and knowing. Like the wisest version of themselves is speaking to them. Warm but unflinching. Compassionate but honest.

6. **What to avoid**:
   - Generic inspirational language
   - Forced rhymes
   - Abstract platitudes
   - Surface-level observations
   - Anything that feels like a greeting card or motivational poster

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

  prompt += `\n---\n\nNow write a substantial, emotionally deep poem (7-10 stanzas) that captures the full essence of this person's reflection. Use their words. Honor their journey. Find the truth they're reaching for but haven't quite grasped. Make them feel seen. Make them feel something profound.

This should be a poem they return to. A poem that makes them pause. A poem that feels like coming home to themselves.

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
