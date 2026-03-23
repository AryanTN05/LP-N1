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

      {/* Bottom split layout */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-12 md:pb-16 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-6">

          {/* LEFT — heading + CTA */}
          <div className="flex-shrink-0 md:max-w-[58%]">
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
                Book a Free Audit
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* RIGHT — badge, subtext, tools */}
          <div
            ref={rightColRef}
            className="md:max-w-[34%] md:text-right"
            style={{ opacity: 0 }}
          >
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 mb-5 md:ml-auto md:flex md:justify-end">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--electric-teal)", boxShadow: "0 0 8px rgba(92,147,159,0.8)" }}
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-400">
                Make AI Your Default Setting
              </span>
            </div>

            <p
              data-testid="hero-subtext"
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500 leading-relaxed mb-8"
            >
              Stop manual prospecting. I build autonomous AI systems that find, qualify,
              and book meetings with your ideal clients — so you focus on closing.
            </p>

            {/* Tool stack */}
            <div className="flex flex-wrap md:justify-end gap-x-4 gap-y-2 opacity-25">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400"
                >
                  {tool}
                </span>
              ))}
            </div>
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
