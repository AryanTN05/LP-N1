import { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { gsap, ScrollTrigger, initSmoothScroll, destroySmoothScroll } from "@/lib/animations";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PainPointsSection from "@/components/PainPointsSection";
import SolutionSection from "@/components/SolutionSection";
import ResultsSection from "@/components/ResultsSection";
import WhyMeSection from "@/components/WhyMeSection";
import ProcessSection from "@/components/ProcessSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import GrainOverlay from "@/components/GrainOverlay";
import Preloader from "@/components/Preloader";
import LightTunnelCanvas from "@/components/LightTunnelCanvas";

const LandingPage = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => {
    if (!preloaderDone) return;
    const lenis = initSmoothScroll();
    return () => destroySmoothScroll();
  }, [preloaderDone]);

  // Scroll wipe: clip-path reveal on first light section
  useEffect(() => {
    if (!preloaderDone) return;

    const wipeEl = document.getElementById("light-wipe");
    if (!wipeEl) return;

    gsap.set(wipeEl, { clipPath: "inset(0 100% 0 0)" });

    const trigger = ScrollTrigger.create({
      trigger: "#hero-sentinel",
      start: "bottom 95%",
      end: "bottom 0%",
      scrub: true,
      onUpdate: (self) => {
        const pct = (1 - self.progress) * 100;
        wipeEl.style.clipPath = `inset(0 ${pct.toFixed(2)}% 0 0)`;
      },
      onLeave: () => {
        wipeEl.style.clipPath = "inset(0 0% 0 0)";
      },
      onEnterBack: () => {
        // Let scrub re-take control
      },
    });

    return () => trigger.kill();
  }, [preloaderDone]);

  return (
    <div className="min-h-screen relative" style={{ background: "var(--rich-carbon)" }} data-testid="landing-page">
      <GrainOverlay />

      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      <div className="relative z-10">
        <Navbar />

        {/* DARK: Hero */}
        <div className="section-dark" id="hero-sentinel">
          <HeroSection />
        </div>

        {/* LIGHT sections — wrapped for clip-path wipe */}
        <div id="light-wipe" style={{ willChange: "clip-path", borderRadius: "clamp(16px, 3vw, 32px) clamp(16px, 3vw, 32px) 0 0" }}>
          <LightTunnelCanvas />

          <div className="section-light relative" style={{ marginTop: "-100vh" }}>
            <PainPointsSection />
          </div>

          <div className="section-light relative">
            <SolutionSection />
          </div>

          {/* LIGHT: Results */}
          <div className="section-light relative">
            <ResultsSection />
          </div>

          {/* LIGHT: Why Me */}
          <div className="section-light relative">
            <WhyMeSection />
          </div>

          {/* DARK: Process + FAQ + Footer — single block with rounded top corners */}
          <div className="section-dark" style={{ borderRadius: "clamp(24px, 4vw, 48px) clamp(24px, 4vw, 48px) 0 0", overflow: "hidden", position: "relative", zIndex: 2 }}>
            <ProcessSection />
            <FaqSection />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
