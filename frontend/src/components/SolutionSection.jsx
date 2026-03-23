import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, animateTextReveal } from "@/lib/animations";

const CAL_LINK = "https://cal.com/aryantn01/30min";

const focusItems = [
  {
    label: "Custom AI Sales Infrastructure",
    desc: "We build your complete outbound system from scratch — AI personalization engine, email deliverability setup, campaign workflows, CRM automations, and Slack integration.",
  },
  {
    label: "Signal-Based Prospecting",
    desc: "No more spray-and-pray. I set up systems that identify prospects showing buying signals — job changes, funding rounds, tech stack shifts — and reach them at the right moment.",
  },
  {
    label: "Performance-Based Setup",
    desc: "One-time setup fee, then you only pay for qualified leads delivered. No monthly retainers, no hidden costs.",
  },
  {
    label: "Done-For-You Operations",
    desc: "I handle the daily operations — copywriting, prospect research, A/B testing, and meeting booking. You just show up and close.",
  },
];

export default function SolutionSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".solution-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );
      if (headingRef.current) animateTextReveal(headingRef.current);
      gsap.fromTo(
        ".solution-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solution"
      data-testid="solution-section"
      className="py-32 lg:py-44 px-6 relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20">
          <span className="solution-label section-label-dark mb-4 block">The Solution</span>
          <h2
            ref={headingRef}
            className="font-heading text-4xl sm:text-5xl lg:text-7xl uppercase tracking-wide leading-tight text-zinc-900"
          >
            Qualified Leads Delivered to Your Inbox
          </h2>
          <p className="solution-desc text-sm mt-6 max-w-2xl mx-auto leading-relaxed text-zinc-600">
            We build and run the entire AI lead generation machine — You focus on what you do best.
          </p>
        </div>

        {/* WQF accordion focus list */}
        <div className="max-w-2xl mx-auto">
          {focusItems.map((item, i) => (
            <div
              key={i}
              className={`focus-list-item ${activeIndex === i ? "active" : activeIndex !== null ? "faded" : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[10px] tracking-widest text-zinc-400">
                  0{i + 1}
                </span>
                <h3>{item.label}</h3>
              </div>
              <p className="ml-10">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="solution-cta"
            className="btn-bracket text-zinc-900"
          >
            Get Your Custom Blueprint
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
