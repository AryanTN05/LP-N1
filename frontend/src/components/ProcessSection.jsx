import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/animations";

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
  const lineRefDesktop = useRef(null);
  const lineRefMobile = useRef(null);
  const stepRefs = useRef([]);

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

      // Horizontal line grows left to right (Desktop)
      if (lineRefDesktop.current) {
        gsap.fromTo(
          lineRefDesktop.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ".process-steps-container", start: "top 78%", once: true },
          }
        );
      }

      // Vertical line grows top to bottom (Mobile)
      if (lineRefMobile.current) {
        gsap.fromTo(
          lineRefMobile.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: { trigger: ".process-steps-container", start: "top 78%", once: true },
          }
        );
      }

      // Each step fades in sequentially
      stepRefs.current.forEach((step, i) => {
        if (!step) return;
        const dot = step.querySelector(".step-dot");
        const content = step.querySelector(".step-content");
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
            once: true,
          }
        });

        tl.fromTo(dot, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" })
          .fromTo(content, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.2");
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      data-testid="process-section"
      className="py-32 lg:py-44 px-6 relative overflow-hidden section-dark"
    >
      <div className="dot-burst" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20 md:mb-32 text-center md:text-left max-w-3xl">
          <span className="process-label section-label mb-4 block text-zinc-400">How It Works</span>
          <h2
            ref={headingRef}
            className="font-heading text-[clamp(2.5rem,5vw,4rem)] uppercase tracking-wide text-white leading-[1.05]"
          >
            From First Call to<br className="hidden md:block" /> Qualified Leads
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--electric-teal)] mt-8 leading-relaxed">
            A battle-tested 4-step framework. Under 30 days to launch.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="process-steps-container relative w-full">
          
          {/* Desktop Horizontal Line */}
          <div className="hidden lg:block absolute top-[28px] left-0 right-0 h-px bg-white/10" />
          <div
            ref={lineRefDesktop}
            className="hidden lg:block absolute top-[28px] left-0 right-0 h-px bg-gradient-to-r from-[var(--electric-teal)] to-transparent"
            style={{ transform: "scaleX(0)" }}
          />

          {/* Mobile Vertical Line */}
          <div className="lg:hidden absolute left-[27px] top-0 bottom-0 w-px bg-white/10" />
          <div
            ref={lineRefMobile}
            className="lg:hidden absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--electric-teal)] to-transparent"
            style={{ transform: "scaleY(0)" }}
          />

          {/* Steps Grid */}
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 w-full">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => (stepRefs.current[i] = el)}
                className="relative flex flex-row lg:flex-col items-start lg:w-1/4 group"
              >
                {/* Step Dot & Number */}
                <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#111111] border border-white/20 group-hover:border-[var(--electric-teal)] transition-all duration-500 step-dot shadow-lg group-hover:shadow-[0_0_20px_rgba(92,147,159,0.3)]">
                  <div className="absolute inset-2 rounded-full bg-[var(--electric-teal)] opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-sm" />
                  <span className="font-mono text-xs tracking-widest text-zinc-300 group-hover:text-white transition-colors">
                    {step.number}
                  </span>
                </div>

                {/* Content Container */}
                <div className="ml-8 lg:ml-0 lg:mt-10 step-content">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-6 h-px bg-[var(--electric-teal)]/50 hidden lg:block group-hover:w-10 transition-all duration-500" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--electric-teal)]">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl uppercase tracking-wide text-white mb-4 group-hover:text-[var(--electric-teal)] transition-colors duration-500">
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-[1.7] text-zinc-400 font-light pr-4 group-hover:text-zinc-300 transition-colors duration-500">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 lg:mt-32 text-center md:text-left">
          <a
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="process-cta"
            className="btn-bracket text-white"
          >
            Start The Process
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
