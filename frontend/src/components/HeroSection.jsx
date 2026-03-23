import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/animations";
import ParticleCanvas from "@/components/ParticleCanvas";

const CAL_LINK = "https://cal.com/aryantn01/30min";

const tools = ["Clay", "n8n", "Apollo", "Claude AI", "HubSpot", "Instantly"];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const rightColRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Heading lines: alternating left/right slide-in
      const lines = headingRef.current?.querySelectorAll(".hero-line");
      if (lines) {
        lines.forEach((line, i) => {
          tl.fromTo(
            line,
            { x: i % 2 === 0 ? "-5%" : "5%", opacity: 0 },
            { x: "0%", opacity: 1, duration: 1.2, ease: "power3.out" },
            0.1 + i * 0.1
          );
        });
      }

      // CTA slides up
      tl.fromTo(
        ctaRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.55
      );

      // Right col fades in from right
      tl.fromTo(
        rightColRef.current,
        { x: "4%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.0, ease: "power3.out" },
        0.3
      );
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
        className="absolute top-0 right-0 z-10 pt-24 md:pt-28 pr-20 md:pr-24 hidden md:flex flex-col items-end"
        style={{ opacity: 0 }}
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

        {/* Subtext — line by line */}
        <p
          data-testid="hero-subtext"
          className="text-right text-zinc-300"
          style={{ fontSize: "16px", fontWeight: 500, lineHeight: "1.9" }}
        >
          Stop manual prospecting.<br />
          I build autonomous<br />
          AI systems that find,<br />
          qualify, and book meetings<br />
          with your ideal clients<br />
          so you focus on closing.
        </p>
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

      {/* BOTTOM LEFT — heading + CTA */}
      <div className="absolute bottom-0 left-0 z-10 pb-12 md:pb-16 px-6 md:px-12">
        <h1
          ref={headingRef}
          data-testid="hero-heading"
          className="hero-heading text-white mb-8"
        >
          <span className="hero-line block" style={{ opacity: 0 }}>Build Your</span>
          <span className="hero-line block" style={{ opacity: 0 }}>Entire AI</span>
          <span className="hero-line block" style={{ opacity: 0, color: "var(--electric-teal)" }}>Lead Gen</span>
          <span className="hero-line block" style={{ opacity: 0, color: "var(--electric-teal)" }}>System.</span>
        </h1>

        <div ref={ctaRef} style={{ opacity: 0 }}>
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="hero-cta"
            className="btn-bracket text-white"
          >
            Book an Audit
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile only — subtext at bottom */}
        <div className="md:hidden mt-6">
          <p className="text-sm text-zinc-300 leading-relaxed mb-4" style={{ fontWeight: 500 }}>
            Stop manual prospecting. I build autonomous AI systems that find, qualify,
            and book meetings with your ideal clients — so you focus on closing.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {tools.map((tool) => (
              <span key={tool} className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator — centered bottom */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: 0.35 }}
      >
        <div className="scroll-mouse">
          <div className="scroll-mouse-dot" />
        </div>
      </div>
    </section>
  );
}
