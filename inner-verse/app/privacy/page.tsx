import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

export default function PrivacyPage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background">
      <Header />

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        <h1 className="font-[family-name:var(--font-crimson)] text-3xl text-foreground mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-stone dark:prose-invert">
          <p className="text-sm text-muted mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-xl text-foreground mt-8 mb-4">
            What we collect
          </h2>

          <p className="text-muted leading-relaxed mb-4">
            When you use {siteConfig.name}, we collect:
          </p>

          <ul className="list-disc list-inside text-muted space-y-2 mb-6">
            <li>Your reflection answers (to generate your result)</li>
            <li>Your email address (if you create an account)</li>
            <li>Basic analytics (page views, button clicks)</li>
          </ul>

          <h2 className="font-[family-name:var(--font-crimson)] text-xl text-foreground mt-8 mb-4">
            How we use it
          </h2>

          <p className="text-muted leading-relaxed mb-4">
            Your reflection answers are:
          </p>

          <ul className="list-disc list-inside text-muted space-y-2 mb-6">
            <li>Sent to an AI service (Anthropic&apos;s Claude) to generate your result</li>
            <li>Never shared with third parties for marketing</li>
            <li>Never sold</li>
            <li>Stored securely if you create an account</li>
          </ul>

          <h2 className="font-[family-name:var(--font-crimson)] text-xl text-foreground mt-8 mb-4">
            Shared content
          </h2>

          <p className="text-muted leading-relaxed mb-6">
            When you share your result, only the final output is visible on the public
            page. Your original answers are never shown.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-xl text-foreground mt-8 mb-4">
            Data retention
          </h2>

          <p className="text-muted leading-relaxed mb-6">
            If you use {siteConfig.name} without an account, your answers are
            stored only in your browser and on our servers temporarily during
            generation. If you create an account, your results are stored
            until you delete them or your account.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-xl text-foreground mt-8 mb-4">
            Contact
          </h2>

          <p className="text-muted leading-relaxed">
            Questions about privacy? Email us at privacy@innerverse.app
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
