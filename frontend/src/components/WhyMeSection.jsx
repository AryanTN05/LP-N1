import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, animateTextReveal } from "@/lib/animations";

const slides = [
  {
    num: "01",
    title: "Pay-Per-Lead Model",
    tag: "Pricing",
    color: "#0a0a0a",
    accent: "#5c939f",
    desc: "No monthly retainers. One-time setup, then you only pay for qualified leads I deliver. If I don't perform, you don't pay.",
  },
  {
    num: "02",
    title: "AI-Native Architecture",
    tag: "Technology",
    color: "#5f8f8a",
    accent: "#ffffff",
    desc: "Every system is built custom with Claude, n8n, Clay, and Apollo — engineered for your specific ICP, not cookie-cutter templates.",
  },
  {
    num: "03",
    title: "Full Transparency",
    tag: "Ownership",
    color: "#1b1b1b",
    accent: "#ed6d40",
    desc: "You get access to every workflow, every metric, every campaign. No black boxes, no gatekeeping. It's your system.",
  },
  {
    num: "04",
    title: "Fast Execution",
    tag: "Speed",
    color: "#d4785c",
    accent: "#ffffff",
    desc: "Infrastructure built in 2 weeks. Campaigns live by week 3. First qualified leads before day 30.",
  },
  {
    num: "05",
    title: "Handoff Ready",
    tag: "Independence",
    color: "#c8c8c8",
    accent: "#111111",
    desc: "Unlike agencies that lock you in, I build systems you can eventually own. Prove it works with me, then run it yourself.",
  },
];

function TiltCard({ slide, isActive, onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current, {
      rotationY: x * 12,
      rotationX: -y * 12,
      transformPerspective: 900,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  const textColor = slide.color === "#c8c8c8" || slide.color === "#5f8f8a" ? "#ffffff" : "#ffffff";

  return (
    <div
      className={`work-slide ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div
        ref={cardRef}
        className="tilt-card h-full min-h-[380px] md:min-h-[480px] rounded-[20px] p-8 md:p-10 flex flex-col justify-between cursor-pointer"
        style={{ background: slide.color, color: textColor }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-start justify-between">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-50"
            style={{ color: slide.accent }}
          >
            {slide.num} / 0{slides.length}
          </span>
          <span
            className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-full border opacity-50"
            style={{ borderColor: slide.accent, color: slide.accent }}
          >
            {slide.tag}
          </span>
        </div>

        <div>
          <h3 className="font-heading text-2xl md:text-3xl uppercase tracking-wide leading-tight mb-4">
            {slide.title}
          </h3>
          <p
            className={`text-sm leading-relaxed transition-all duration-500 ${
              isActive ? "opacity-80 max-h-40" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            {slide.desc}
          </p>
        </div>

        <div
          className="h-px opacity-20"
          style={{ background: `linear-gradient(90deg, transparent, ${slide.accent}, transparent)` }}
        />
      </div>
    </div>
  );
}

export default function WhyMeSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === slides.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          ".why-label",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
        );
        animateTextReveal(headingRef.current);
      }
      gsap.fromTo(
        ".work-carousel",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".work-carousel", start: "top 80%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-me"
      data-testid="why-me-section"
      className="py-32 lg:py-44 px-6 relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <span className="why-label section-label-dark mb-4 block">Why Work With Me</span>
            <h2
              ref={headingRef}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide leading-tight text-zinc-900"
            >
              Not Another Agency
            </h2>
          </div>

          {/* Counter + arrows */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest text-zinc-400">
              {String(activeIdx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:border-zinc-800 hover:text-zinc-900 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel — active card expands in-place, cards visible around it */}
        <div className="work-carousel">
          {slides.map((slide, i) => (
            <TiltCard
              key={slide.num}
              slide={slide}
              isActive={activeIdx === i}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
