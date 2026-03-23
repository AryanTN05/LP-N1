import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/animations";

const CAL_LINK = "https://cal.com/aryantn01/30min";

const steps = [
  {
    number: "01",
    title: "Discovery & Audit",
    desc: "We hop on a 30-min call. I learn your ICP, offer, and current outbound setup. I map out exactly what your AI lead gen system needs to look like.",
    color: "rgba(95,143,138,0.88)",
    accent: "#0a0a0a",
    textColor: "#0a0a0a",
  },
  {
    number: "02",
    title: "Infrastructure Build",
    desc: "I set up your complete AI sales stack — domains, inbox warming, deliverability, Clay enrichment flows, Apollo prospecting, n8n automations, CRM, and Slack notifications.",
    color: "rgba(237,109,64,0.88)",
    accent: "#0a0a0a",
    textColor: "#0a0a0a",
  },
  {
    number: "03",
    title: "Campaign Launch",
    desc: "Campaigns go live. I handle copywriting, prospect research, personalization, A/B testing, and daily optimization. You get full visibility into every metric.",
    color: "rgba(10,10,10,0.92)",
    accent: "#5c939f",
    textColor: "#ffffff",
  },
  {
    number: "04",
    title: "Leads Flow In",
    desc: "Qualified decision-makers start appearing in your calendar. You get Slack pings for every hot lead. Show up, run the call, close the deal.",
    color: "rgba(30,45,53,0.92)",
    accent: "#5c939f",
    textColor: "#ffffff",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label
      gsap.fromTo(
        ".process-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );

      // Heading
      gsap.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%", once: true } }
      );

      // Vertical line grows downward
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.6,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ".process-steps", start: "top 78%", once: true },
          }
        );
      }

      // Each card slides up individually as it enters viewport
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
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      data-testid="process-section"
      className="py-32 lg:py-44 px-6 relative overflow-hidden"
    >
      <div className="dot-burst" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20">
          <span className="process-label section-label mb-4 block">How It Works</span>
          <h2
            ref={headingRef}
            className="font-heading text-[clamp(2rem,5vw,3.75rem)] uppercase tracking-wide text-white leading-tight"
          >
            From First Call to<br />Qualified Leads
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500 mt-6 leading-relaxed">
            From first call to qualified leads in under 30 days.
          </p>
        </div>

        {/* Timeline + Cards */}
        <div className="process-steps relative pl-12 sm:pl-14 md:pl-16">
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="absolute left-3 sm:left-4 top-4 bottom-4 w-px"
            style={{
              background: "linear-gradient(180deg, #5c939f 0%, rgba(92,147,159,0.08) 100%)",
              transform: "scaleY(0)",
            }}
          />

          <div className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                data-testid={`process-step-${i}`}
                className="relative"
              >
                {/* Step dot on timeline */}
                <div
                  className="absolute flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                  style={{
                    left: "clamp(-3.5rem, -8vw, -4rem)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(18,18,20,0.8)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(92,147,159,0.35)",
                    boxShadow: "0 0 16px rgba(92,147,159,0.15)",
                  }}
                >
                  <span className="font-mono text-[9px] tracking-widest" style={{ color: "var(--electric-teal)" }}>
                    {step.number}
                  </span>
                </div>

                {/* Card */}
                <div
                  className="rounded-2xl p-5 sm:p-6 lg:p-7 hover-card-dark"
                  style={{
                    background: step.color,
                    backdropFilter: "blur(24px) saturate(160%)",
                    WebkitBackdropFilter: "blur(24px) saturate(160%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                    color: step.textColor,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: step.accent, opacity: 0.7 }}
                    >
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl uppercase tracking-wide mb-3" style={{ color: step.textColor }}>
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: step.textColor, opacity: 0.75 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="process-cta"
            className="btn-bracket text-white"
          >
            Book a Call
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
