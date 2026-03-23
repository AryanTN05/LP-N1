import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { gsap, animateTextReveal } from "@/lib/animations";

const faqs = [
  {
    q: "What exactly do you build?",
    a: "I build end-to-end AI-powered lead generation systems. This includes domain & inbox setup, deliverability infrastructure, prospect identification using Clay and Apollo.io, AI-personalized outreach sequences, automated follow-ups via n8n, CRM integration, and real-time Slack notifications when leads engage.",
  },
  {
    q: "How is this different from hiring an SDR or using an agency?",
    a: "An SDR costs $6,000–10,000/month with 3–6 months ramp time and no guarantees. Traditional agencies charge monthly retainers regardless of results. I charge a one-time setup fee, then you pay per qualified lead delivered. If I don't deliver, you don't pay. The system I build is also yours to keep.",
  },
  {
    q: "What does 'pay as you get leads' mean?",
    a: "After the initial infrastructure build, my fee is tied directly to results. You pay a fixed amount per qualified lead or booked meeting. No monthly retainers, no hidden fees. If the pipeline is empty, your invoice is zero.",
  },
  {
    q: "How fast will I see results?",
    a: "Infrastructure is built in 1–2 weeks. Campaigns live by week 3. Most clients see their first qualified leads within 21–30 days. The system compounds — results improve each month as we optimize targeting and messaging.",
  },
  {
    q: "What industries or markets do you work with?",
    a: "I work primarily with B2B companies targeting decision-makers in the US, Europe, and UAE. Whether you're in SaaS, consulting, services, or tech — if your buyer is a business, I can build the system to reach them.",
  },
  {
    q: "Can I eventually run this system myself?",
    a: "Absolutely. Every system I build is designed for handoff. Once it's proven and optimized, I can train your team to run it in-house. You get full ownership of all workflows, automations, templates, and documentation. No vendor lock-in.",
  },
];

function FaqItem({ faq, index, isActive, onToggle }) {
  const contentRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current || !innerRef.current) return;
    const height = innerRef.current.offsetHeight;
    gsap.to(contentRef.current, {
      height: isActive ? height : 0,
      opacity: isActive ? 1 : 0,
      duration: 0.45,
      ease: "power3.inOut",
    });
  }, [isActive]);

  return (
    <div
      className={`faq-item border-b transition-opacity duration-300 ${
        isActive ? "border-white/10" : "border-white/5"
      }`}
      style={{ opacity: 1 }}
    >
      <button
        className="w-full flex items-start justify-between gap-4 py-6 text-left group"
        onClick={() => onToggle(index)}
        aria-expanded={isActive}
      >
        <div className="flex items-start gap-5">
          <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-600 mt-1 flex-shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`font-heading text-lg uppercase tracking-wide transition-colors duration-300 ${
              isActive ? "text-[#5c939f]" : "text-white group-hover:text-zinc-300"
            }`}
          >
            {faq.q}
          </span>
        </div>
        <span className={`flex-shrink-0 mt-1 transition-colors duration-300 ${isActive ? "text-[#5c939f]" : "text-zinc-600"}`}>
          {isActive ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>

      <div ref={contentRef} style={{ height: 0, overflow: "hidden", opacity: 0 }}>
        <div ref={innerRef} className="pb-6 pl-9">
          <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(null);

  const handleToggle = (i) => setActiveIdx((prev) => (prev === i ? null : i));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );
      if (headingRef.current) animateTextReveal(headingRef.current);
      gsap.fromTo(
        ".faq-list",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".faq-list", start: "top 82%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      data-testid="faq-section"
      className="py-32 lg:py-44 px-6 relative"
    >
      <div className="section-divider max-w-4xl mx-auto mb-20" />

      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <span className="faq-label section-label mb-4 block">FAQ</span>
          <h2
            ref={headingRef}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white"
          >
            Common Questions
          </h2>
        </div>

        <div className="faq-list glass-card rounded-[20px] px-6 sm:px-10 py-4">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              faq={faq}
              index={i}
              isActive={activeIdx === i}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
