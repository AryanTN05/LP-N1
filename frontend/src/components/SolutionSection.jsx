import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/animations";

const CAL_LINK = "https://cal.com/aryantn01/30min";

const focusItems = [
  {
    label: "Custom AI Sales Infrastructure",
    desc: "We build your complete outbound system from scratch — AI personalization engine, email deliverability setup, campaign workflows, CRM automations, and Slack integration.",
    color: "rgba(10,10,10,0.92)",
    textColor: "#ffffff",
    numColor: "rgba(255,255,255,0.35)",
  },
  {
    label: "Signal-Based Prospecting",
    desc: "No more spray-and-pray. I set up systems that identify prospects showing buying signals — job changes, funding rounds, tech stack shifts — and reach them at the right moment.",
    color: "rgba(95,143,138,0.88)",
    textColor: "#0a0a0a",
    numColor: "rgba(0,0,0,0.4)",
  },
  {
    label: "Performance-Based Setup",
    desc: "One-time setup fee, then you only pay for qualified leads delivered. No monthly retainers, no hidden costs.",
    color: "rgba(212,120,92,0.88)",
    textColor: "#0a0a0a",
    numColor: "rgba(0,0,0,0.4)",
  },
  {
    label: "Done-For-You Operations",
    desc: "I handle the daily operations — copywriting, prospect research, A/B testing, and meeting booking. You just show up and close.",
    color: "rgba(30,45,53,0.92)",
    textColor: "#ffffff",
    numColor: "rgba(255,255,255,0.35)",
  },
];

export default function SolutionSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".solution-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );
      gsap.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 76%", once: true } }
      );
      gsap.fromTo(
        ".solution-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true } }
      );

      // Cards slide up individually
      cardRefs.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          }
        );
      });
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
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20">
          <span className="solution-label section-label-dark mb-4 block">The Solution</span>
          <h2
            ref={headingRef}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide leading-tight text-zinc-900"
          >
            Qualified Leads Delivered<br />to Your Inbox
          </h2>
          <p className="solution-desc text-sm mt-6 max-w-2xl mx-auto leading-relaxed text-zinc-600">
            We build and run the entire AI lead generation machine — You focus on what you do best.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-5">
          {focusItems.map((item, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="rounded-2xl p-7 hover-card-light"
              style={{
                background: item.color,
                backdropFilter: "blur(24px) saturate(160%)",
                WebkitBackdropFilter: "blur(24px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)",
                color: item.textColor,
              }}
            >
              <div className="flex items-start gap-5">
                <span
                  className="font-mono text-[10px] tracking-[0.25em] mt-1 flex-shrink-0"
                  style={{ color: item.numColor }}
                >
                  0{i + 1}
                </span>
                <div>
                  <h3 className="font-heading text-xl uppercase tracking-wide mb-2" style={{ color: item.textColor }}>
                    {item.label}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: item.textColor, opacity: 0.7 }}>{item.desc}</p>
                </div>
              </div>
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
