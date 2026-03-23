import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/animations";
import ParticleCanvas from "@/components/ParticleCanvas";

const CAL_LINK = "https://cal.com/aryantn01/30min";

const tools = ["Clay", "n8n", "Apollo", "Claude AI", "HubSpot", "Instantly"];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const leftBlockRef = useRef(null);
  const rightBlockRef = useRef(null);
  const ctaRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial fade in
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(leftBlockRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.1)
        .fromTo(rightBlockRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.2)
        .fromTo(rightColRef.current, { x: "4%", opacity: 0 }, { x: "0%", opacity: 1, duration: 1.0, ease: "power3.out" }, 0.3)
        .fromTo(ctaRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.55);

      // 2. Scroll Trigger (Pin and Split)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
        }
      });

      scrollTl
        .fromTo(leftBlockRef.current,
          { x: "0vw", opacity: 1 },
          { x: "-60vw", opacity: 0, ease: "none", immediateRender: false }, 0)
        .fromTo(rightBlockRef.current,
          { x: "0vw", opacity: 1 },
          { x: "60vw", opacity: 0, ease: "none", immediateRender: false }, 0)
        .fromTo([ctaRef.current, rightColRef.current, ".scroll-mouse-container"],
          { y: 0, opacity: 1 },
          { y: -50, opacity: 0, ease: "none", duration: 0.3, immediateRender: false }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-testid="hero-section"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--rich-carbon)" }}
    >
      {/* 3D Sphere — fills entire section */}
      <ParticleCanvas />

      {/* TOP RIGHT — badge + subtext */}
      <div
        ref={rightColRef}
        className="absolute top-0 right-0 z-20 pt-24 md:pt-28 pr-20 md:pr-24 hidden md:flex flex-col items-end"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--electric-teal)", boxShadow: "0 0 8px rgba(92,147,159,0.9)" }}
          />
          <span
            className="font-mono uppercase tracking-[0.2em]"
            style={{ fontSize: "15px", fontWeight: 700, color: "var(--electric-teal)" }}
          >
            Make AI Your Default Setting
          </span>
        </div>

        {/* Subtext */}
        <div className="relative pr-6">
          <div className="absolute right-0 top-1 bottom-1 w-[1px] bg-gradient-to-b from-transparent via-[var(--electric-teal)] to-transparent opacity-40" />
          <p
            data-testid="hero-subtext"
            className="text-right text-zinc-400"
            style={{ fontSize: "15.5px", fontWeight: 400, lineHeight: "1.85", letterSpacing: "0.01em" }}
          >
            <span className="text-white font-medium block mb-2">Stop manual prospecting.</span>
            I build <span className="text-[var(--electric-teal)] font-medium">autonomous AI systems</span><br />
            that find, qualify, and book<br />
            meetings with your ideal clients<br />
            so you focus on <span className="text-white font-medium">closing</span>.
          </p>
        </div>
      </div>

      {/* FAR RIGHT — tool names vertical */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col items-center gap-5 pr-4"
        style={{ opacity: 0.5 }}
      >
        {tools.map((tool) => (
          <span
            key={tool}
            className="font-mono uppercase tracking-[0.2em] text-zinc-500"
            style={{ fontSize: "11px", writingMode: "vertical-rl", letterSpacing: "0.2em" }}
          >
            {tool}
          </span>
        ))}
      </div>

      {/* BOTTOM LEFT HEADING & CTA */}
      <div className="absolute bottom-0 left-0 z-20 w-full px-6 md:px-12 pb-16 md:pb-24 flex flex-col items-start pointer-events-none">
        
        {/* Main Heading Text */}
        <h1
          data-testid="hero-heading"
          className="hero-heading flex flex-col items-start w-full pointer-events-auto max-w-7xl mb-4 md:mb-8"
          style={{ lineHeight: "0.9" }}
        >
          <div ref={leftBlockRef} className="text-left w-full text-white">
            <span className="block text-[3.5rem] md:text-[5.5rem] lg:text-[7.5rem] font-bold tracking-tighter">BUILD YOUR</span>
            <span className="block text-[3.5rem] md:text-[5.5rem] lg:text-[7.5rem] font-bold tracking-tighter">ENTIRE AI</span>
          </div>
          <div ref={rightBlockRef} className="text-left w-full text-[#5c939f]">
            <span className="block text-[3.5rem] md:text-[5.5rem] lg:text-[7.5rem] font-bold tracking-tighter">LEAD GEN</span>
            <span className="block text-[3.5rem] md:text-[5.5rem] lg:text-[7.5rem] font-bold tracking-tighter">SYSTEM</span>
          </div>
        </h1>

        {/* Custom Bracket CTA Button */}
        <div ref={ctaRef} className="pointer-events-auto mt-4">
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="hero-cta"
            className="group relative inline-flex items-center px-5 py-4 text-white hover:text-white transition-colors"
          >
            {/* Top Left Bracket */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/60 transition-all group-hover:border-white group-hover:w-4 group-hover:h-4"></span>
            
            {/* Bottom Right Bracket */}
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/60 transition-all group-hover:border-white group-hover:w-4 group-hover:h-4"></span>
            
            <span className="mr-4 font-mono font-bold text-[12px] tracking-[0.2em] uppercase">BOOK AN AUDIT</span>
            <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Mobile only — subtext at bottom */}
        <div className="md:hidden mt-8 border-l border-[var(--border-dark)] pl-5 relative">
          <div className="absolute left-[-1px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-transparent via-[var(--electric-teal)] to-transparent opacity-40" />
          <p className="text-[14.5px] text-zinc-400 leading-[1.8] font-light">
            <span className="text-white font-medium block mb-1">Stop manual prospecting.</span>
            I build <span className="text-[var(--electric-teal)] font-medium">autonomous AI systems</span> that find, qualify, and book meetings with your ideal clients — so you focus on <span className="text-white font-medium">closing</span>.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5">
            {tools.map((tool) => (
              <span key={tool} className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator — centered bottom */}
      <div className="scroll-mouse-container absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2" style={{ opacity: 0.35 }}>
        <div className="scroll-mouse">
          <div className="scroll-mouse-dot" />
        </div>
      </div>
    </section>
  );
}
