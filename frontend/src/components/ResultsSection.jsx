import { useEffect, useRef } from "react";
import { gsap, animateTextReveal, animateLineDraw } from "@/lib/animations";

const cards = [
  {
    num: "01",
    title: "Qualified Meetings Only",
    desc: "Pipeline filled with decision-makers actively looking for your solution. No time-wasters, no tire-kickers — just people who need what you sell.",
    color: "rgba(95,143,138,0.88)",
    accent: "#0a0a0a",
    textColor: "#0a0a0a",
  },
  {
    num: "02",
    title: "5–15% Reply Rates",
    desc: "AI-personalized outreach that resonates. Not generic templates — messages written around each prospect's specific context, company, and pain.",
    color: "rgba(237,109,64,0.88)",
    accent: "#0a0a0a",
    textColor: "#0a0a0a",
  },
  {
    num: "03",
    title: "System You Own",
    desc: "Full transparency across every campaign, metric, and workflow. Once proven, I hand everything off — no vendor lock-in, no dependency on me.",
    color: "rgba(30,45,53,0.92)",
    accent: "#5c939f",
    textColor: "#ffffff",
  },
];

export default function ResultsSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated heading
      if (headingRef.current) animateTextReveal(headingRef.current);

      // Decorative line
      if (lineRef.current) animateLineDraw(lineRef.current);

      // Cards stagger in
      gsap.fromTo(
        ".results-card",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".results-cards", start: "top 78%", once: true },
        }
      );

      // Label
      gsap.fromTo(
        ".results-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="results"
      data-testid="results-section"
      className="py-32 lg:py-44 px-6 relative overflow-hidden"
    >
      <div className="dot-burst" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading block */}
        <div className="mb-20 max-w-2xl">
          <span className="results-label section-label-dark mb-4 block">What You Get</span>
          <h2
            ref={headingRef}
            className="font-heading text-[clamp(1.5rem,5vw,3.75rem)] uppercase tracking-normal sm:tracking-wide text-zinc-900 leading-tight break-words"
          >
            Results That Actually Matter
          </h2>
          <div
            ref={lineRef}
            className="mt-8 h-px bg-gradient-to-r from-[#5c939f]/60 to-transparent"
            style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
          />
          <p className="font-mono text-[12px] uppercase tracking-[0.15em] text-zinc-700 leading-relaxed max-w-md mt-6 font-bold">
            No vanity metrics. No excuses. Just a predictable flow of
            qualified conversations with people who need what you sell.
          </p>
        </div>

        {/* WQF numbered cards */}
        <div className="results-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <div
              key={i}
              data-testid={`result-item-${i}`}
              className="results-card hover-card-light rounded-[20px] p-8 md:p-10 flex flex-col gap-6"
              style={{
                background: card.color,
                backdropFilter: "blur(28px) saturate(160%)",
                WebkitBackdropFilter: "blur(28px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)",
                color: card.textColor,
              }}
            >
              <span className="font-mono text-xs tracking-[0.25em]" style={{ color: card.accent, opacity: 0.6 }}>
                {card.num} / 03
              </span>
              <div>
                <h3 className="font-heading text-xl uppercase tracking-wide mb-3" style={{ color: card.textColor }}>
                  {card.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: card.textColor, opacity: 0.75 }}>
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
