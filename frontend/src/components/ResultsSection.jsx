import { useEffect, useRef } from "react";
import { gsap, animateTextReveal, animateLineDraw } from "@/lib/animations";

const cards = [
  {
    num: "01",
    title: "Qualified Meetings Only",
    desc: "Pipeline filled with decision-makers actively looking for your solution. No time-wasters, no tire-kickers — just people who need what you sell.",
  },
  {
    num: "02",
    title: "5–15% Reply Rates",
    desc: "AI-personalized outreach that resonates. Not generic templates — messages written around each prospect's specific context, company, and pain.",
  },
  {
    num: "03",
    title: "System You Own",
    desc: "Full transparency across every campaign, metric, and workflow. Once proven, I hand everything off — no vendor lock-in, no dependency on me.",
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
          <span className="results-label section-label mb-4 block">What You Get</span>
          <h2
            ref={headingRef}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white leading-tight"
          >
            Results That Actually Matter
          </h2>
          <div
            ref={lineRef}
            className="mt-8 h-px bg-gradient-to-r from-[#5c939f]/60 to-transparent"
            style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500 leading-relaxed max-w-md mt-6">
            No vanity metrics. No excuses. Just a predictable flow of
            qualified conversations with people who need what you sell.
          </p>
        </div>

        {/* WQF numbered cards */}
        <div className="results-cards grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <div
              key={i}
              data-testid={`result-item-${i}`}
              className="results-card glass-card tilt-card rounded-[20px] p-8 md:p-10 flex flex-col gap-6 group"
            >
              <span className="font-mono text-xs tracking-[0.25em] text-zinc-600 group-hover:text-[#5c939f] transition-colors duration-300">
                {card.num} / 03
              </span>
              <div>
                <h3 className="font-heading text-xl uppercase tracking-wide text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-base text-zinc-300 leading-relaxed">
                  {card.desc}
                </p>
              </div>
              {/* Accent corner */}
              <div className="mt-auto h-px bg-gradient-to-r from-[#5c939f]/0 via-[#5c939f]/30 to-[#5c939f]/0
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
