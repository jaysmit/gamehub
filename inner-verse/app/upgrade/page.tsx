"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";
import { trackEvent, getAnonymousToken } from "@/lib/analytics";
import { siteConfig } from "@/config/site";

// Stubbed pricing tiers - Stripe not live yet
const tiers = [
  {
    id: "one-off",
    name: "Single Reflection",
    price: "$3",
    description: "One more reflection, one more discovery",
    features: [
      "Answer a new question",
      "Receive a personalized result",
      "Download and share",
    ],
    cta: "Get one reflection",
    popular: false,
  },
  {
    id: "subscriber",
    name: "Monthly Reflections",
    price: "$9",
    period: "/month",
    description: "A practice of self-discovery",
    features: [
      "Unlimited reflections",
      "New questions each month",
      "Longer, deeper results",
      "Regenerate with different styles",
      "Go deeper on any reflection",
    ],
    cta: "Start reflecting",
    popular: true,
  },
];

export default function UpgradePage() {
  useEffect(() => {
    trackEvent("paywall_view", { anonymousToken: getAnonymousToken() });
  }, []);

  const handleSelectTier = (tierId: string) => {
    // Stripe not live - show coming soon message
    alert("Payments coming soon! For now, enjoy your free reflections.");
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background">
      <Header />

      {/* Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-crimson)] text-3xl text-foreground mb-4">
            Continue your journey
          </h1>
          <p className="text-muted max-w-md mx-auto">
            You&apos;ve experienced the power of reflection. Keep going.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative p-6 rounded-xl border ${
                tier.popular
                  ? "border-accent/30 bg-card shadow-sm"
                  : "border-border bg-card"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-medium text-white bg-accent rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="font-[family-name:var(--font-crimson)] text-xl text-foreground mb-2">
                  {tier.name}
                </h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-semibold text-foreground">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted">{tier.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted mt-2">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-accent flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectTier(tier.id)}
                variant={tier.popular ? "primary" : "secondary"}
                className="w-full"
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link
            href="/profile"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← Back to profile
          </Link>
        </div>
      </div>

      {/* Feature flag notice (dev only) */}
      {!siteConfig.features.stripeEnabled && (
        <div className="fixed bottom-4 right-4 px-3 py-2 bg-card border border-border text-muted text-xs rounded-lg opacity-50">
          Payments disabled (feature flag)
        </div>
      )}
    </main>
  );
}
