import { NextRequest, NextResponse } from "next/server";
import { generatePoem } from "@/lib/anthropic";
import { buildPoemPrompt } from "@/lib/prompts";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { getDefaultQuestionSet, getQuestionSetBySlug } from "@/data/questionSets";
import { generateShareSlug } from "@/lib/utils";
import { JourneyAnswers } from "@/types";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          resetAt: rateLimit.resetAt,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetAt.toString(),
          },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { answers, questionSetId, anonymousToken } = body as {
      answers: JourneyAnswers;
      questionSetId?: string;
      anonymousToken?: string;
    };

    // Validate answers
    if (!answers?.heroAnswer || answers.heroAnswer.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a longer reflection to generate your poem." },
        { status: 400 }
      );
    }

    // Get question set
    const questionSet = questionSetId
      ? getQuestionSetBySlug(questionSetId) || getDefaultQuestionSet()
      : getDefaultQuestionSet();

    // Build prompt
    const prompt = buildPoemPrompt(answers, questionSet);

    // Generate poem
    const poemContent = await generatePoem(prompt);

    // Generate share slug
    const shareSlug = generateShareSlug();

    // TODO: Save to database when Supabase is configured
    // For now, we'll just return the poem data
    const poemData = {
      poemId: `temp_${Date.now()}`,
      content: poemContent,
      shareSlug,
      questionSetId: questionSet.id,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(poemData, {
      headers: {
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": rateLimit.resetAt.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating poem:", error);

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes("ANTHROPIC_API_KEY")) {
        return NextResponse.json(
          { error: "Service configuration error. Please try again later." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate poem. Please try again." },
      { status: 500 }
    );
  }
}
