import { useEffect, useRef } from "react";
import { gsap, animateTextReveal } from "@/lib/animations";

const ethosCards = [
  {
    title: "You're Still\nProspecting\nManually",
    colorClass: "ethos-card-black",
    dotArt: "dot-art-grid",
    desc: "Spending hours finding leads on LinkedIn and spreadsheets instead of closing deals.",
  },
  {
    title: "Your Outreach\nGets Ignored",
    colorClass: "ethos-card-teal",
    dotArt: "dot-art-wave",
    desc: "Generic templates land in spam. Response rates are under 1% and pipeline stays dry.",
  },
  {
    title: "Scaling Feels\nImpossible",
    colorClass: "ethos-card-orange",
    dotArt: "dot-art-rays",
    desc: "You know AI can help but don't have the time or expertise to build the system yourself.",
  },
  {
    title: "Agencies Burned\nYour Budget",
    colorClass: "ethos-card-light",
    dotArt: "dot-art-concentric",
    desc: "You paid monthly retainers with no guaranteed results. Just reports and excuses.",
  },
];

export default function PainPointsSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ethos-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 76%", once: true } }
        );
      }
      gsap.fromTo(
        ".ethos-card",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".ethos-cards-row", start: "top 80%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pain-points"
      data-testid="pain-points-section"
      className="py-32 lg:py-44 px-6 relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <span className="ethos-label section-label-dark mb-4 block">Does this feel like you?</span>
            <h2
              ref={headingRef}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide leading-tight text-zinc-900"
            >
              Most B2B Founders Are Stuck.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-400 to-transparent mb-6" />
            <p className="text-base leading-relaxed text-zinc-600 max-w-lg">
              Most B2B founders are stuck in one of these cycles. Manual prospecting, ignored outreach,
              failed agencies. Sound familiar?
            </p>
          </div>
        </div>

        {/* WQF flex-grow cards */}
        <div className="ethos-cards-row">
          {ethosCards.map((card, i) => (
            <div key={i} className={`ethos-card ${card.colorClass}`} data-testid={`pain-point-card-${i}`}>
              <div>
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-50">
                  0{i + 1}
                </span>
                <h3 className="mt-3">{card.title}</h3>
              </div>
              <p className="font-mono text-[12px] uppercase tracking-wider leading-relaxed mt-4" style={{ position: "relative", zIndex: 1 }}>
                {card.desc}
              </p>
              <div className="dot-art">
                <div className={card.dotArt} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
