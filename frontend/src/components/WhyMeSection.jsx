import { useEffect, useRef, useState } from "react";
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
    accent: "#0a0a0a",
    desc: "Every system is built custom with Claude, n8n, Clay, and Apollo — engineered for your specific ICP, not cookie-cutter templates.",
  },
  {
    num: "03",
    title: "Full Transparency",
    tag: "Ownership",
    color: "#ed6d40",
    accent: "#0a0a0a",
    desc: "You get access to every workflow, every metric, every campaign. No black boxes, no gatekeeping. It's your system.",
  },
  {
    num: "04",
    title: "Fast Execution",
    tag: "Speed",
    color: "#1e2d35",
    accent: "#5c939f",
    desc: "Infrastructure built in 2 weeks. Campaigns live by week 3. First qualified leads before day 30.",
  },
  {
    num: "05",
    title: "Handoff Ready",
    tag: "Independence",
    color: "#0a0a0a",
    accent: "#5c939f",
    desc: "Unlike agencies that lock you in, I build systems you can eventually own. Prove it works with me, then run it yourself.",
  },
];

function TiltCard({ slide, isActive, onClick }) {
  const textColor = ["#5f8f8a", "#ed6d40"].includes(slide.color) ? "#0a0a0a" : "#ffffff";
  const isLight = textColor === "#0a0a0a";

  return (
    <div
      className={`work-slide ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div
        className="hover-card-dark h-full min-h-[340px] sm:min-h-[400px] md:min-h-[440px] lg:min-h-[480px] rounded-[20px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between cursor-pointer"
        style={{
          background: `${slide.color}e6`,
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          border: `1px solid ${isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)"}`,
          boxShadow: isActive
            ? `0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 ${isLight ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}`
            : `0 8px 28px rgba(0,0,0,0.2), inset 0 1px 0 ${isLight ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)"}`,
          color: textColor,
          transition: "box-shadow 0.4s ease",
        }}
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
            className={`text-base leading-relaxed transition-all duration-500 ${
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
  const carouselRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === slides.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const activeCard = carousel.querySelectorAll(".work-slide")[activeIdx];
    if (activeCard) {
      const cardLeft = activeCard.offsetLeft;
      const cardWidth = activeCard.offsetWidth;
      const carouselWidth = carousel.offsetWidth;
      carousel.scrollTo({ left: cardLeft - (carouselWidth - cardWidth) / 2, behavior: "smooth" });
    }
  }, [activeIdx]);

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
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-wide leading-tight text-zinc-900"
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
        <div className="work-carousel" ref={carouselRef}>
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
