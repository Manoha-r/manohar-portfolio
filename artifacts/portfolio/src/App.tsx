import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { Navigation } from "./components/Navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Background3D } from "./components/Background3D";
import Lenis from "lenis";

import { Hero } from "./pages/Hero";
import { About } from "./pages/About";
import { Skills } from "./pages/Skills";
import { Projects } from "./pages/Projects";
import { Experience } from "./pages/Experience";
import { Education } from "./pages/Education";
import { Contact } from "./pages/Contact";

function App() {
  const [location] = useLocation();

  // Initialize Lenis Smooth Scroll globally
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);
  const [isIntroPlaying, setIsIntroPlaying] = useState(() => {
    // Only play the cinematic 3D intro once per browser session
    return !sessionStorage.getItem("intro_played");
  });

  const [showFlash, setShowFlash] = useState(false);
  const [showContent, setShowContent] = useState(() => {
    return !!sessionStorage.getItem("intro_played");
  });

  // Reset scroll position to top on route change after the exiting page has faded out
  useEffect(() => {
    // Delay scroll to top so the exiting page doesn't jarringly snap to top during its exit animation (duration: 400ms)
    const scrollTimer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as any });
      const scrollContainers = document.querySelectorAll(".overflow-y-auto");
      scrollContainers.forEach((el) => {
        el.scrollTop = 0;
      });
    }, 380);

    return () => {
      clearTimeout(scrollTimer);
    };
  }, [location]);

  // Handle the cinematic warp transition timeline on first load
  useEffect(() => {
    if (!isIntroPlaying) return;

    // 1. At 2350ms: Trigger the screen flash (crystal core explosion begins)
    const flashTimer = setTimeout(() => {
      setShowFlash(true);
    }, 2350);

    // 2. At 2750ms: Reveal the HTML content with a radial motion blur and scale transition
    const contentTimer = setTimeout(() => {
      setShowContent(true);
      setShowFlash(false); // start fading out the flash
    }, 2750);

    // 3. At 3000ms: Complete the intro phase
    const endTimer = setTimeout(() => {
      setIsIntroPlaying(false);
      sessionStorage.setItem("intro_played", "true");
    }, 3000);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(contentTimer);
      clearTimeout(endTimer);
    };
  }, [isIntroPlaying]);

  return (
    <TooltipProvider>
      <div className="min-h-screen font-sans selection:bg-primary selection:text-primary-foreground text-foreground overflow-x-hidden relative">
        <Background3D
          location={location}
          isIntroPlaying={isIntroPlaying}
          onIntroComplete={() => {
            // Camera controller finished flight. Clean up state if timeouts haven't fired yet.
            setShowContent(true);
            setShowFlash(false);
            setIsIntroPlaying(false);
            sessionStorage.setItem("intro_played", "true");
          }}
        />

        {/* Blinding screen flash overlay during the 3D core explosion */}
        {isIntroPlaying && (
          <div
            className={`fixed inset-0 z-50 pointer-events-none bg-gradient-to-r from-blue-600 via-white to-sky-400 mix-blend-screen transition-opacity duration-[350ms] ease-out ${showFlash ? "opacity-95" : "opacity-0"
              }`}
          />
        )}

        {/* Navigation — placed outside the containing block to keep viewport-fixed positioning working */}
        <div
          className={
            isIntroPlaying
              ? `fixed top-0 left-0 w-full z-50 transition-all duration-[1000ms] ${!showContent
                  ? "opacity-0 -translate-y-4 blur-[10px] pointer-events-none"
                  : "opacity-100 translate-y-0 blur-0"
                }`
              : "fixed top-0 left-0 w-full z-50 opacity-100"
          }
          style={isIntroPlaying ? { transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" } : undefined}
        >
          <Navigation />
        </div>

        {/* Smooth radial blur and scale transition for HTML elements once the 3D cinematic finishes */}
        <div
          className={
            isIntroPlaying
              ? `transition-all duration-[1000ms] ${!showContent
                  ? "opacity-0 scale-[0.88] blur-[25px] pointer-events-none"
                  : "opacity-100 scale-100 blur-0"
                }`
              : "opacity-100"
          }
          style={isIntroPlaying ? { transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" } : undefined}
        >
          {/* Subtle dark backdrop overlay to improve text readability against busy 3D elements */}
          <div className="fixed inset-0 bg-black/45 -z-5 pointer-events-none" />
          <main className="relative pt-16">
            <AnimatePresence mode="wait">
              <Switch location={location} key={location}>
                <Route path="/" component={Hero} />
                <Route path="/about" component={About} />
                <Route path="/skills" component={Skills} />
                <Route path="/projects" component={Projects} />
                <Route path="/experience" component={Experience} />
                <Route path="/education" component={Education} />
                <Route path="/contact" component={Contact} />
              </Switch>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
