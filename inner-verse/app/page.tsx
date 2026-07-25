import { Hero } from "@/components/landing/Hero";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col stars">
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
