import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

export default function AboutPage() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background">
      <Header />

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        <h1 className="font-[family-name:var(--font-crimson)] text-3xl text-foreground mb-8">
          About
        </h1>

        <div className="prose prose-stone dark:prose-invert">
          <p className="text-muted leading-relaxed mb-6">
            {siteConfig.name} is a space for reflection. We believe that the
            answers we seek are often already within us — they just need the
            right questions to bring them out.
          </p>

          <p className="text-muted leading-relaxed mb-6">
            Our process is simple: we ask you to imagine your most successful
            life, then guide you through a series of deepening questions. From
            your honest answers, we create something personal — using your own
            words and images, arranged to reveal what you already know.
          </p>

          <p className="text-muted leading-relaxed mb-6">
            This isn&apos;t about advice or self-help platitudes. It&apos;s about
            seeing yourself clearly, through your own eyes, in your own words.
          </p>

          <h2 className="font-[family-name:var(--font-crimson)] text-xl text-foreground mt-12 mb-4">
            How it works
          </h2>

          <ol className="list-decimal list-inside text-muted space-y-3">
            <li>Answer a deep reflection question honestly</li>
            <li>Explore follow-up prompts that deepen your reflection</li>
            <li>Receive something personal, written from your words</li>
            <li>Share, save, or simply sit with what you&apos;ve discovered</li>
          </ol>

          <h2 className="font-[family-name:var(--font-crimson)] text-xl text-foreground mt-12 mb-4">
            Privacy first
          </h2>

          <p className="text-muted leading-relaxed">
            Your answers are private. They&apos;re used only to create your
            reflection and are never shared or sold. When you share, only the
            result is visible — never your original answers.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
