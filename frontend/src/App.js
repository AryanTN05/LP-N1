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

    gsap.set(wipeEl, { clipPath: "inset(100% 0 0% 0)" });

    const trigger = ScrollTrigger.create({
      trigger: "#hero-sentinel",
      start: "bottom 95%",
      end: "bottom 0%",
      scrub: 0.6,
      onUpdate: (self) => {
        const pct = (1 - self.progress) * 100;
        wipeEl.style.clipPath = `inset(${pct.toFixed(2)}% 0 0% 0)`;
      },
      onLeave: () => {
        wipeEl.style.clipPath = "inset(0% 0 0% 0)";
      },
      onEnterBack: () => {
        // Let scrub re-take control
      },
    });

    return () => trigger.kill();
  }, [preloaderDone]);

  return (
    <div className="min-h-screen bg-black relative" data-testid="landing-page">
      <GrainOverlay />

      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      <div className="relative z-10">
        <Navbar />

        {/* DARK: Hero */}
        <div className="section-dark" id="hero-sentinel">
          <HeroSection />
        </div>

        {/* LIGHT sections — wrapped for clip-path wipe */}
        <div id="light-wipe" style={{ willChange: "clip-path" }}>
          <div className="section-light dot-float-bg">
            <PainPointsSection />
          </div>

          <div className="section-light dot-float-bg">
            <SolutionSection />
          </div>

          {/* DARK: Results */}
          <div className="section-dark">
            <ResultsSection />
          </div>

          {/* LIGHT: Why Me */}
          <div className="section-light dot-float-bg">
            <WhyMeSection />
          </div>

          {/* DARK: Process */}
          <div className="section-dark">
            <ProcessSection />
          </div>

          {/* DARK: FAQ */}
          <div className="section-dark">
            <FaqSection />
          </div>

          {/* Footer */}
          <div className="section-dark">
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
