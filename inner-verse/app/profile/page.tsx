"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/client";
import { trackEvent, getAnonymousToken } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";

interface SavedPoem {
  id: string;
  content: string;
  shareSlug: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [poems, setPoems] = useState<SavedPoem[]>([]);
  const [loading, setLoading] = useState(true);
  const [poemsRemaining, setPoemsRemaining] = useState(1); // Default for new users

  useEffect(() => {
    trackEvent("profile_view", { anonymousToken: getAnonymousToken() });

    const checkUser = async () => {
      const supabase = createClient();

      if (!supabase) {
        // Supabase not configured - show mock state
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/signin?next=/profile");
        return;
      }

      setUser({ email: user.email || "" });

      // TODO: Fetch poems from database
      // For now, try to get from localStorage as demo
      const currentPoem = localStorage.getItem("iv_current_poem");
      if (currentPoem) {
        try {
          const poemData = JSON.parse(currentPoem);
          setPoems([
            {
              id: poemData.poemId,
              content: poemData.content,
              shareSlug: poemData.shareSlug,
              createdAt: poemData.createdAt,
            },
          ]);
        } catch {
          // Invalid data
        }
      }

      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
  };

  const handleNewPoem = () => {
    if (poemsRemaining > 0) {
      router.push("/begin");
    } else {
      router.push("/upgrade");
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background">
      <Header />

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="font-[family-name:var(--font-crimson)] text-2xl text-foreground mb-2">
            Your reflections
          </h1>
          {user && (
            <p className="text-sm text-muted">{user.email}</p>
          )}
        </div>

        {/* Poems remaining */}
        <div className="mb-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">
                {poemsRemaining > 0
                  ? `You have ${poemsRemaining} free reflection${poemsRemaining > 1 ? "s" : ""} remaining`
                  : "You've used your free reflections"}
              </p>
            </div>
            <Button size="sm" onClick={handleNewPoem}>
              {poemsRemaining > 0 ? "Write new" : "Get more"}
            </Button>
          </div>
        </div>

        {/* Poems list */}
        {poems.length > 0 ? (
          <div className="space-y-6">
            {poems.map((poem) => (
              <div
                key={poem.id}
                className="p-6 bg-card rounded-lg border border-border hover:border-accent/30 transition-colors"
              >
                {/* Preview of poem */}
                <div className="mb-4">
                  <p className="font-[family-name:var(--font-crimson)] text-foreground/80 line-clamp-3">
                    {poem.content.split("\n")[0]}...
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted">
                    {formatDate(poem.createdAt)}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/poem/${poem.shareSlug}`}
                      className="text-xs text-accent hover:brightness-110"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted mb-6">No reflections yet</p>
            <Button onClick={handleNewPoem}>Write your first</Button>
          </div>
        )}

        {/* Sign out */}
        <div className="mt-12 pt-8 border-t border-border">
          <button
            onClick={handleSignOut}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
