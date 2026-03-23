import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, animateTextReveal } from "@/lib/animations";

const CAL_LINK = "https://cal.com/aryantn01/30min";

const steps = [
  {
    number: "01",
    title: "Discovery & Audit",
    desc: "We hop on a 30-min call. I learn your ICP, offer, and current outbound setup. I map out exactly what your AI lead gen system needs to look like.",
  },
  {
    number: "02",
    title: "Infrastructure Build",
    desc: "I set up your complete AI sales stack — domains, inbox warming, deliverability, Clay enrichment flows, Apollo prospecting, n8n automations, CRM, and Slack notifications.",
  },
  {
    number: "03",
    title: "Campaign Launch",
    desc: "Campaigns go live. I handle copywriting, prospect research, personalization, A/B testing, and daily optimization. You get full visibility into every metric.",
  },
  {
    number: "04",
    title: "Leads Flow In",
    desc: "Qualified decision-makers start appearing in your calendar. You get Slack pings for every hot lead. Show up, run the call, close the deal.",
  },
];

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".process-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );
      if (headingRef.current) animateTextReveal(headingRef.current);

      // Animated vertical line — grows downward
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ".process-steps", start: "top 75%", once: true },
          }
        );
      }

      // Steps stagger
      gsap.fromTo(
        ".process-step",
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".process-steps", start: "top 78%", once: true },
        }
      );
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

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-20">
          <span className="process-label section-label mb-4 block">How It Works</span>
          <h2
            ref={headingRef}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white leading-tight"
          >
            From First Call to Qualified Leads
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500 max-w-xl mt-6 leading-relaxed">
            From first call to qualified leads in under 30 days.
          </p>
        </div>

        {/* Timeline */}
        <div className="process-steps relative pl-20 md:pl-28">
          {/* Animated vertical line */}
          <div
            ref={lineRef}
            className="absolute left-8 md:left-10 top-2 bottom-2 w-px"
            style={{
              background: "linear-gradient(180deg, #5c939f 0%, rgba(92,147,159,0.1) 100%)",
              transform: "scaleY(0)",
            }}
          />

          <div className="space-y-14">
            {steps.map((step, i) => (
              <div
                key={i}
                data-testid={`process-step-${i}`}
                className="process-step group relative"
              >
                {/* Step dot */}
                <div
                  className="absolute -left-12 md:-left-18 top-0 w-8 h-8 rounded-full glass-card border border-[#5c939f]/20 flex items-center justify-center group-hover:border-[#5c939f]/60 group-hover:shadow-[0_0_16px_rgba(92,147,159,0.2)] transition-all duration-400"
                  style={{ left: "-4.5rem" }}
                >
                  <span className="font-mono text-[9px] text-[#5c939f] tracking-widest">{step.number}</span>
                </div>

                <div className="pb-2">
                  <h3 className="font-heading text-2xl uppercase tracking-wide text-white mb-2 group-hover:text-[#5c939f] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">{step.desc}</p>
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
