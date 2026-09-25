import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/Hero";
import { TechnologySolutions } from "@/components/sections/TechnologySolutions";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Primary Site Navigation */}
      <Header />

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        <div
          id="business-challenge-reveal-wrapper"
          className="relative w-full z-20 motion-safe:-mt-[100vh]"
        >
          <TechnologySolutions />
        </div>
      </main>

      {/* Primary Site Footer */}
      <Footer />
    </div>
  );
}
