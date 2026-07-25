import { EventType } from "@/types";

// ============================================
// ANALYTICS HELPERS
// Simple event tracking from day one
// ============================================

interface TrackEventOptions {
  userId?: string;
  anonymousToken?: string;
  metadata?: Record<string, unknown>;
}

export async function trackEvent(
  eventType: EventType,
  options: TrackEventOptions = {}
): Promise<void> {
  try {
    // Don't block on analytics
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        ...options,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the app
    });
  } catch {
    // Silently fail
  }
}

// Client-side helper to get or create anonymous token
export function getAnonymousToken(): string {
  if (typeof window === "undefined") return "";

  let token = localStorage.getItem("iv_anonymous_token");
  if (!token) {
    token = `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("iv_anonymous_token", token);
  }
  return token;
}
