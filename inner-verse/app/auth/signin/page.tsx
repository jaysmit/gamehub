"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/client";
import { trackEvent, getAnonymousToken } from "@/lib/analytics";
import { siteConfig } from "@/config/site";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    if (!supabase) {
      setError("Authentication is not configured yet. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      trackEvent("signup_started", { anonymousToken: getAnonymousToken() });

      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteConfig.url}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
        },
      });

      if (authError) {
        throw authError;
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Email sent confirmation
  if (sent) {
    return (
      <div className="max-w-md w-full text-center page-transition">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="font-[family-name:var(--font-crimson)] text-2xl text-foreground mb-4">
            Check your email
          </h1>

          <p className="text-muted leading-relaxed">
            We sent a magic link to <strong className="text-foreground">{email}</strong>.
            Click it to sign in.
          </p>
        </div>

        <p className="text-sm text-muted">
          Didn&apos;t receive it?{" "}
          <button
            onClick={() => setSent(false)}
            className="text-accent hover:brightness-110"
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full page-transition">
      <h1 className="font-[family-name:var(--font-crimson)] text-2xl text-foreground text-center mb-4">
        Save your reflections
      </h1>

      <p className="text-muted text-center mb-8 leading-relaxed">
        Create an account to save your results, access them anytime, and create more.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading || !email}
          className="w-full"
          size="lg"
        >
          {loading ? "Sending..." : "Continue with email"}
        </Button>
      </form>

      <p className="text-xs text-muted/50 text-center mt-6">
        We&apos;ll send you a magic link. No password needed.
      </p>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

function SignInLoading() {
  return (
    <div className="max-w-md w-full text-center">
      <p className="text-muted">Loading...</p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background stars">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <Suspense fallback={<SignInLoading />}>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
