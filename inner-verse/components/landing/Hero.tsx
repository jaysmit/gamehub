"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { trackEvent, getAnonymousToken } from "@/lib/analytics";
import { useEffect } from "react";

export function Hero() {
  const router = useRouter();
  const { landing } = siteConfig;

  useEffect(() => {
    trackEvent("landing_view", { anonymousToken: getAnonymousToken() });
  }, []);

  const handleBegin = () => {
    trackEvent("begin_click", { anonymousToken: getAnonymousToken() });
    router.push("/begin");
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main headline */}
          <h1 className="font-[family-name:var(--font-crimson)] text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mb-6">
            {landing.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted leading-relaxed mb-10 max-w-2xl mx-auto">
            {landing.subheadline}
          </p>

          {/* CTA Button */}
          <Button onClick={handleBegin} size="lg" className="min-w-[200px]">
            {landing.cta}
          </Button>

          {/* Social proof */}
          <p className="mt-8 text-sm text-muted/70">
            {landing.socialProof}
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl sm:text-3xl text-foreground text-center mb-16">
            How it works
          </h2>

          <div className="grid sm:grid-cols-3 gap-12 sm:gap-8">
            {landing.features.map((feature, index) => (
              <div key={index} className="text-center">
                {/* Step number */}
                <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="font-[family-name:var(--font-crimson)] text-xl text-accent">
                    {index + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-crimson)] text-xl text-foreground mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Trust */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="font-[family-name:var(--font-crimson)] text-xl sm:text-2xl text-foreground/80 leading-relaxed italic mb-6">
            &ldquo;I didn&apos;t expect to feel so seen by my own words.&rdquo;
          </blockquote>
          <p className="text-sm text-muted">
            — A recent reflection
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-card/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-crimson)] text-2xl sm:text-3xl text-foreground mb-6">
            Ready to meet yourself?
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            It takes about 10 minutes. No sign-up required.
          </p>
          <Button onClick={handleBegin} size="lg" className="min-w-[200px]">
            {landing.cta}
          </Button>
        </div>
      </section>
    </div>
  );
}
