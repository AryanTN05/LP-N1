import { useEffect, useRef } from "react";
import { ArrowRight, Mail, Linkedin } from "lucide-react";
import { gsap } from "@/lib/animations";
import FooterCanvas from "@/components/FooterCanvas";

const CAL_LINK = "https://cal.com/aryantn01/30min";

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
        gsap.fromTo(
          headingRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
        );
      }
      gsap.fromTo(
        ".footer-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } }
      );
      gsap.fromTo(
        ".footer-cta-wrap",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.5,
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} data-testid="footer" className="relative overflow-hidden">

      {/* Main section: globe left, orange card right */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 items-stretch"
        style={{ background: "var(--rich-carbon)", minHeight: 520 }}
      >
        {/* Left — globe canvas */}
        <div className="hidden lg:block relative">
          <FooterCanvas />
        </div>

        {/* Right — orange card floating inside dark bg */}
        <div className="flex items-center justify-center p-8 lg:p-10">
          <div
            className="w-full rounded-[24px] flex flex-col justify-between px-10 py-12"
            style={{
              background: "var(--infrared)",
              minHeight: 400,
            }}
          >
            <div>
              <span className="footer-label font-mono text-[10px] uppercase tracking-[0.25em] mb-6 block" style={{ color: "rgba(0,0,0,0.5)" }}>
                Ready to Scale?
              </span>
              <h2
                ref={headingRef}
                className="font-heading text-4xl sm:text-5xl lg:text-5xl uppercase tracking-wide leading-tight mb-5"
                style={{ color: "#0a0a0a" }}
              >
                Build Your AI Outbound Engine
              </h2>
              <p className="footer-sub font-mono text-[11px] uppercase tracking-[0.15em] max-w-sm mb-10 leading-relaxed" style={{ color: "rgba(0,0,0,0.55)" }}>
                Stop losing deals to competitors who use AI. Let's map out your
                custom architecture on a free 30-minute audit call.
              </p>
            </div>

            <div className="footer-cta-wrap">
              <a
                href={CAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-cta"
                className="btn-bracket"
                style={{ color: "#0a0a0a" }}
              >
                Book an Audit
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-6 py-8"
        style={{ background: "var(--rich-carbon)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
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
