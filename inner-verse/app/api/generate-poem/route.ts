import { NextRequest, NextResponse } from "next/server";
import { generatePoem } from "@/lib/anthropic";
import { buildPoemPrompt } from "@/lib/prompts";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { getDefaultQuestionSet, getQuestionSetBySlug } from "@/data/questionSets";
import { generateShareSlug } from "@/lib/utils";
import { JourneyAnswers } from "@/types";

export async function POST(request: NextRequest) {
  console.log("[API] POST /api/generate-poem called");

  try {
    // Check if API key exists
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
    console.log("[API] ANTHROPIC_API_KEY present:", hasApiKey);
    if (!hasApiKey) {
      console.error("[API] ANTHROPIC_API_KEY is missing!");
      return NextResponse.json(
        { error: "API key not configured. Check .env.local file." },
        { status: 500 }
      );
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);
    console.log("[API] Rate limit check:", rateLimit);

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
    console.log("[API] Request body received, heroAnswer length:", body.answers?.heroAnswer?.length);

    const { answers, questionSetId } = body as {
      answers: JourneyAnswers;
      questionSetId?: string;
      anonymousToken?: string;
    };

    // Validate answers
    if (!answers?.heroAnswer || answers.heroAnswer.trim().length < 10) {
      console.log("[API] Validation failed: heroAnswer too short");
      return NextResponse.json(
        { error: "Please provide a longer reflection to generate your poem." },
        { status: 400 }
      );
    }

    // Get question set
    const questionSet = questionSetId
      ? getQuestionSetBySlug(questionSetId) || getDefaultQuestionSet()
      : getDefaultQuestionSet();
    console.log("[API] Using question set:", questionSet.id);

    // Build prompt
    const prompt = buildPoemPrompt(answers, questionSet);
    console.log("[API] Prompt built, length:", prompt.length);

    // Generate poem
    console.log("[API] Calling generatePoem...");
    const poemContent = await generatePoem(prompt);
    console.log("[API] Poem generated, length:", poemContent.length);

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

    console.log("[API] Success! Returning poem data");
    return NextResponse.json(poemData, {
      headers: {
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": rateLimit.resetAt.toString(),
      },
    });
  } catch (error) {
    console.error("[API] Error generating poem:", error);

    // Return detailed error in development
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("[API] Error message:", errorMessage);
    console.error("[API] Error stack:", errorStack);

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes("ANTHROPIC_API_KEY")) {
        return NextResponse.json(
          { error: "API key not configured. Check .env.local file.", details: errorMessage },
          { status: 500 }
        );
      }
      if (error.message.includes("401") || error.message.includes("authentication")) {
        return NextResponse.json(
          { error: "Invalid API key. Check your ANTHROPIC_API_KEY.", details: errorMessage },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate poem.", details: errorMessage },
      { status: 500 }
    );
  }
}
