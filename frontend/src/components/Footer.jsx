import { useEffect, useRef, useCallback } from "react";
import { ArrowRight, Mail, Linkedin } from "lucide-react";
import { gsap, animateTextReveal } from "@/lib/animations";
import FooterCanvas from "@/components/FooterCanvas";

const CAL_LINK = "https://cal.com/aryantn01/30min";

function MagneticButton({ href, children }) {
  const wrapRef = useRef(null);
  const btnRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.22;
    const dy = (e.clientY - cy) * 0.22;
    gsap.to(btnRef.current, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }, []);

  return (
    <div
      ref={wrapRef}
      className="magnetic-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <a
        ref={btnRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="footer-cta"
        className="btn-bracket text-white"
      >
        {children}
      </a>
    </div>
  );
}

export default function Footer() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true } }
      );
      if (headingRef.current) {
        animateTextReveal(headingRef.current, {
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
        });
      }
      gsap.fromTo(
        ".footer-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.4,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } }
      );
      gsap.fromTo(
        ".footer-mag-btn",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} data-testid="footer" className="relative overflow-hidden">

      {/* Top CTA section — grid layout like WQF */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">

        {/* Left — Three.js canvas (desktop only) */}
        <div className="hidden lg:block relative" style={{ background: "var(--rich-carbon)" }}>
          <FooterCanvas />
        </div>

        {/* Right — Infrared accent bg */}
        <div
          className="relative flex flex-col justify-center px-10 md:px-16 py-20"
          style={{ background: "var(--infrared)" }}
        >
          <span className="footer-label font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 mb-6 block">
            Ready to Scale?
          </span>
          <h2
            ref={headingRef}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white leading-tight mb-6"
          >
            Build Your AI Outbound Engine
          </h2>
          <p className="footer-sub font-mono text-[11px] uppercase tracking-[0.15em] text-white/60 max-w-sm mb-10 leading-relaxed">
            Stop losing deals to competitors who use AI. Let's map out your
            custom architecture on a free 30-minute audit call.
          </p>
          <div className="footer-mag-btn">
            <MagneticButton href={CAL_LINK}>
              Book a Free Audit
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-6 py-8"
        style={{ background: "var(--rich-carbon)", borderTop: "1px solid var(--border-dark)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-heading text-xl uppercase tracking-widest text-zinc-300">
            Aryan <span className="font-sans font-light text-zinc-500">TN</span>
          </span>

          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            © {new Date().getFullYear()} All rights reserved
          </p>

          <div className="flex items-center gap-6">
            <a
              href="mailto:aryan.tn01@gmail.com"
              className="text-zinc-500 hover:text-[#5c939f] transition-colors duration-300"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/aryantn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-[#5c939f] transition-colors duration-300"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
