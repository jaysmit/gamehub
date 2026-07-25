import { NextRequest, NextResponse } from "next/server";
import { EventType } from "@/types";

// ============================================
// ANALYTICS TRACKING API
// Simple event logging - stores to database when Supabase is configured
// ============================================

interface TrackRequest {
  eventType: EventType;
  userId?: string;
  anonymousToken?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackRequest;
    const { eventType, userId, anonymousToken, metadata, timestamp } = body;

    // Validate event type
    const validEvents: EventType[] = [
      "landing_view",
      "begin_click",
      "answer_completed",
      "deepening_started",
      "deepening_completed",
      "deepening_skipped",
      "privacy_consent",
      "poem_generated",
      "poem_viewed",
      "share_clicked",
      "copy_clicked",
      "download_clicked",
      "signup_started",
      "signup_completed",
      "paywall_view",
      "profile_view",
    ];

    if (!validEvents.includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    // Log event (in production, save to database)
    console.log("[Analytics]", {
      eventType,
      userId,
      anonymousToken,
      metadata,
      timestamp: timestamp || new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent"),
    });

    // TODO: Save to Supabase events table when configured
    // const supabase = await createClient();
    // if (supabase) {
    //   await supabase.from("events").insert({
    //     event_type: eventType,
    //     user_id: userId,
    //     anonymous_token: anonymousToken,
    //     metadata,
    //     created_at: timestamp || new Date().toISOString(),
    //   });
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    // Don't fail requests due to analytics errors
    return NextResponse.json({ success: false });
  }
}
