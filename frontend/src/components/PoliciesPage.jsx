import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, initSmoothScroll, destroySmoothScroll } from "@/lib/animations";
import DarkFieldCanvas from "@/components/DarkFieldCanvas";

const EMAIL = "aryantn01@gmail.com";
const CAL_LINK = "https://cal.com/aryantn01/30min";

const policiesData = [
  {
    id: "privacy",
    title: "Privacy Policy",
    num: "01",
    updated: "March 2025",
    color: "var(--electric-teal)",
    sections: [
      { heading: "Introduction", text: "I'm Aryan TN, an independent freelancer based in Bengaluru, India, offering AI Automation and Lead Generation services. This policy explains how I collect, use, and safeguard your personal information in accordance with applicable Indian data protection laws." },
      { heading: "Who I Am", text: "I operate as an individual freelancer under the name Aryan TN and am solely responsible for your personal data. You can reach me at " + EMAIL + "." },
      { heading: "Data I Collect", items: [
          "Identity & Contact Data – Name, email, and details you voluntarily share",
          "Project & Business Data – Business information shared during consultations or onboarding",
          "Financial Data – Payment information processed through secure third-party platforms. I do not store card or banking details directly",
          "Technical Data – IP address, browser type, and usage data collected automatically via my website"
        ] },
      { heading: "How I Collect Your Data", text: "Data is collected through direct interactions (contact forms, emails, calls), information shared during project onboarding, and automated technologies like cookies and analytics tools on my website." },
      { heading: "How I Use Your Data", text: "I use your data to communicate about projects, deliver agreed services, process payments, and comply with legal obligations. I do not sell or share your data with third parties for marketing purposes." },
      { heading: "Data Security", text: "I implement reasonable measures to protect your data from unauthorized access or disclosure. No method of internet transmission is 100% secure, but I take this seriously." },
      { heading: "Data Retention", text: "I retain your data only as long as necessary to fulfill the purposes in this policy or as required by law. Project-related data is generally kept for up to 2 years after completion." },
      { heading: "Your Rights", text: "Under applicable Indian law, you have the right to access, correct, or request deletion of your personal data, and to withdraw consent at any time. To exercise these rights, email " + EMAIL + "." },
      { heading: "Third-Party Links", text: "My website may link to external sites. I have no control over their privacy practices and take no responsibility for them." },
      { heading: "International Data Transfers", text: "If your data is processed outside India through third-party tools I use, I ensure such transfers comply with applicable Indian data protection regulations." },
      { heading: "Contact", text: "Email: " + EMAIL + "\nLocation: Bengaluru, India" },
      { heading: "Changes to This Policy", text: "I reserve the right to update this policy at any time. Changes will be posted on this page with a revised date." }
    ]
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    num: "02",
    updated: "March 2025",
    color: "var(--infrared)",
    sections: [
      { heading: "Introduction", text: "These Terms and Conditions govern your use of my website and engagement with my freelance services. By accessing my website or entering into a service agreement with me, you agree to be bound by these Terms." },
      { heading: "Changes to These Terms", text: "I reserve the right to modify these Terms at any time. Updates will be posted on my website. Continued use after changes are posted constitutes acceptance." },
      { heading: "Payments & Agreements", text: "All projects begin with a written proposal or agreement. Making an initial payment confirms acceptance of the project scope and these Terms. Payment terms follow the structure in my Cancellation & Refund Policy." },
      { heading: "Client Responsibilities", text: "You agree to provide accurate and timely information, be available for feedback within agreed timelines, and ensure you have the legal right to share any assets or data provided to me. Delays caused by your end are not grounds for refunds." },
      { heading: "Intellectual Property", text: "Work becomes your property upon full payment. Until then, all deliverables remain mine. I may feature completed work in my portfolio unless you request otherwise in writing." },
      { heading: "Confidentiality", text: "I treat all client information as confidential and will not disclose your business data to third parties without your consent, except as required by law." },
      { heading: "Third-Party Tools", text: "My services may involve third-party tools or platforms. I am not responsible for their terms or data practices. Any associated costs will be disclosed upfront." },
      { heading: "Termination", text: "I reserve the right to terminate a project if you breach these Terms or engage in fraudulent or abusive behavior. Financial implications are governed by my Cancellation & Refund Policy." },
      { heading: "Disclaimer & Limitation of Liability", text: "I do not guarantee specific business outcomes such as revenue growth or lead volume as these depend on factors beyond my control. My liability is limited to the amount paid for the specific service in question." },
      { heading: "Governing Law", text: "These Terms are governed by the laws of India. Disputes fall under the jurisdiction of courts in Bengaluru, Karnataka." },
      { heading: "Contact", text: "Email: " + EMAIL + "\nLocation: Bengaluru, India" }
    ]
  },
  {
    id: "cancellation",
    title: "Cancellation & Refund Policy",
    num: "03",
    updated: "March 2025",
    color: "#5f8f8a",
    sections: [
      { heading: "Overview", text: "All my work is custom-built for each client. This policy outlines the payment structure, cancellation terms, and refund eligibility. By engaging my services, you acknowledge and agree to this policy." },
      { heading: "Payment Structure", text: "All projects follow a standard two-part payment schedule:", items: [
          "50% Initial Payment – Required upon contract signing to initiate the project",
          "50% Final Payment – Due upon successful project delivery"
        ], after: "For larger or complex projects, an alternative payment schedule may be proposed and outlined in your project agreement." },
      { heading: "No Refund Policy", text: "All payments are non-refundable once project work has commenced. This is because time and resources are allocated immediately, research and planning begin from day one, and accepting your project means turning away other opportunities." },
      { heading: "48-Hour Grace Period", text: "If you need to cancel shortly after signing, the following applies:", items: [
          "Cancellation requested within 48 hours of contract signing",
          "No substantial project work has commenced",
          "Request submitted in writing to " + EMAIL
        ], after: "Refund Structure: Administrative Fee (non-refundable) — 20% of total project value. Refundable Amount — 30% of total project value. Refund Timeline — Processed within 5–10 business days." },
      { heading: "Mid-Project Cancellation", text: "If you cancel after the 48-hour grace period but before project completion:", items: [
          "The initial 50% payment is non-refundable",
          "The final 50% payment is not required",
          "All work developed up to that point remains my intellectual property",
          "No partial refunds will be issued"
        ] },
      { heading: "Project Modifications & Delays", text: "Project postponements, scope adjustments, and timeline extensions are accommodated without penalty. All modification requests must be submitted in writing to " + EMAIL + " and confirmed via email before changes take effect." },
      { heading: "Quality Commitment", text: "I stand behind the quality of my work. If I fail to meet agreed deliverables due to my own error, I will resolve the issue at no additional cost to you." },
      { heading: "Exceptional Circumstances", text: "Exceptions may be considered for documented emergencies such as medical issues, natural disasters, or significant unforeseen business changes. All requests are reviewed case-by-case and require supporting documentation. Email " + EMAIL + "." },
      { heading: "Contact", text: "Email: " + EMAIL + "\nLocation: Bengaluru, India\n\nResponse Time: All cancellation requests will be acknowledged within 24 hours." },
      { heading: "Policy Updates", text: "I reserve the right to update this policy at any time. Changes will be posted on my website and apply to all contracts signed after the updated effective date." }
    ]
  }
];

export default function PoliciesPage() {
  const containerRef = useRef(null);
  const [activeId, setActiveId] = useState(policiesData[0].id);

  useEffect(() => {
    window.scrollTo(0, 0);
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Nav
      gsap.fromTo(".policy-header",
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      // Hero stagger
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .fromTo(".policy-hero-label", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
        .fromTo(".policy-hero-title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.4")
        .fromTo(".policy-hero-line", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, "-=0.3")
        .fromTo(".policy-hero-desc", { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.4");

      // Sidebar
      gsap.fromTo(".policy-sidebar",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 }
      );

      // Each policy section
      gsap.utils.toArray(".policy-section").forEach((section) => {
        // Section header
        gsap.fromTo(section.querySelector(".policy-section-header"),
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 82%", once: true }
          }
        );

        // Items stagger
        const items = section.querySelectorAll(".policy-item");
        gsap.fromTo(items,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 75%", once: true }
          }
        );

        // Sidebar active state tracking
        ScrollTrigger.create({
          trigger: section,
          start: "top 30%",
          end: "bottom 30%",
          onToggle: (self) => {
            if (self.isActive) setActiveId(section.id);
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative"
      style={{ background: "var(--rich-carbon)", color: "var(--text-light)" }}
    >
      {/* Constellation background */}
      <DarkFieldCanvas particleCount={180} opacityMultiplier={1.8} />

      {/* ── Fixed Navbar ──────────────────────────────────────── */}
      <div className="policy-header fixed top-4 left-1/2 z-50" style={{ transform: "translateX(-50%)" }}>
        <nav
          className="flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2.5 rounded-full"
          style={{
            background: "rgba(14, 14, 16, 0.7)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 4px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-[var(--electric-teal)] group-hover:shadow-[0_0_12px_rgba(92,147,159,0.3)] transition-all duration-300">
              <ArrowLeft className="w-3 h-3 text-zinc-400 group-hover:text-white transition-all duration-300" />
            </div>
          </Link>

          <div className="w-px h-4 bg-white/10 hidden sm:block" />

          {/* Section jump links */}
          {policiesData.map((policy) => {
            const isActive = activeId === policy.id;
            return (
              <button
                key={policy.id}
                onClick={() => scrollToSection(policy.id)}
                className="px-3 py-1.5 rounded-full font-mono text-[9px] uppercase tracking-[0.15em] whitespace-nowrap"
                style={{
                  background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                  color: isActive ? policy.color : "var(--pulse-ash)",
                  transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = policy.color;
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.transform = "scale(1.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--pulse-ash)";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              >
                <span className="hidden sm:inline">{policy.title}</span>
                <span className="sm:hidden">{policy.num}</span>
              </button>
            );
          })}

          <div className="w-px h-4 bg-white/10 hidden sm:block" />

          <span className="logo-glow font-heading text-xs uppercase tracking-widest text-white font-bold transition-all duration-500 cursor-default shrink-0">
            ATN
          </span>
        </nav>
      </div>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <div className="relative z-10 pt-24 md:pt-28 pb-16 md:pb-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <span className="policy-hero-label section-label mb-6 block">
          Legal
        </span>
        <h1
          className="policy-hero-title font-heading text-[clamp(2.5rem,6vw,4.5rem)] uppercase tracking-wide text-white leading-[1.05] mb-8"
          style={{ opacity: 0 }}
        >
          Policies & Terms
        </h1>
        <div
          className="policy-hero-line h-px bg-gradient-to-r from-transparent via-[var(--electric-teal)]/60 to-transparent mb-8 max-w-md mx-auto"
        />
        <p className="policy-hero-desc font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-400 font-bold leading-relaxed max-w-lg mx-auto">
          Transparency is non-negotiable. Here's everything about how I handle
          your data, the terms of working together, and my cancellation policy.
        </p>

      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 pb-32 relative z-10">
        <main>
          <div className="space-y-28 md:space-y-36">
            {policiesData.map((policy) => (
              <section key={policy.id} id={policy.id} className="policy-section scroll-mt-32">

                {/* Section Header */}
                <div className="policy-section-header mb-12 md:mb-16">
                  <div className="flex items-center gap-4 mb-6">
                    <span
                      className="font-mono text-[10px] tracking-[0.25em]"
                      style={{ color: policy.color }}
                    >
                      {policy.num} / 03
                    </span>
                    <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${policy.color}30, transparent)` }} />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold block mb-4">
                    Last Updated: {policy.updated}
                  </span>
                  <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] uppercase tracking-wide text-white leading-tight">
                    {policy.title}
                  </h2>
                </div>

                {/* Section Items */}
                <div className="space-y-10">
                  {policy.sections.map((item, i) => (
                    <div key={i} className="policy-item group">
                      <div className="flex items-start gap-5">
                        <span
                          className="font-mono text-[10px] tracking-[0.25em] mt-1.5 shrink-0 opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                          style={{ color: policy.color }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-base md:text-lg uppercase tracking-wide text-zinc-100 font-bold mb-3 group-hover:text-white transition-colors duration-300">
                            {item.heading}
                          </h3>
                          {item.text && (
                            <p className="text-[14px] md:text-[15px] leading-[1.85] text-zinc-400 font-medium whitespace-pre-wrap">
                              {item.text}
                            </p>
                          )}
                          {item.items && (
                            <ul className="mt-4 space-y-3">
                              {item.items.map((li, j) => (
                                <li key={j} className="text-[14px] md:text-[15px] leading-[1.85] text-zinc-400 font-medium pl-6 relative">
                                  <span
                                    className="absolute left-0 top-[11px] w-2.5 h-px"
                                    style={{ background: policy.color, opacity: 0.5 }}
                                  />
                                  {li}
                                </li>
                              ))}
                            </ul>
                          )}
                          {item.after && (
                            <p className="text-[14px] md:text-[15px] leading-[1.85] text-zinc-400 font-medium mt-4">
                              {item.after}
                            </p>
                          )}
                        </div>
                      </div>

                      {i < policy.sections.length - 1 && (
                        <div className="h-px bg-white/[0.04] mt-10 ml-10" />
                      )}
                    </div>
                  ))}
                </div>

              </section>
            ))}
          </div>

          {/* Bottom CTA Card */}
          <div className="mt-28 md:mt-36">
            <div
              className="rounded-[24px] p-8 md:p-12 relative overflow-hidden"
              style={{
                background: "rgba(237, 109, 64, 0.12)",
                border: "1px solid rgba(237, 109, 64, 0.2)",
              }}
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-bl from-[var(--infrared)] to-transparent blur-[80px] rounded-full" />
              </div>

              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--infrared)] block mb-4 opacity-70">
                  Have Questions?
                </span>
                <h3 className="font-heading text-2xl md:text-3xl uppercase tracking-wide text-white mb-4">
                  Let's Talk
                </h3>
                <p className="text-[14px] leading-relaxed text-zinc-400 font-medium max-w-md mb-8">
                  Not sure about something in these terms? Book a free call and I'll walk you through everything.
                </p>
                <a
                  href={CAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-bracket text-white"
                >
                  Book a Call
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>


      {/* ── Footer ────────────────────────────────────────────── */}
      <footer>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link
            to="/"
            className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 font-bold hover:text-white transition-colors duration-300"
          >
            Back to Home
          </Link>

          <span className="logo-glow font-heading text-base uppercase tracking-widest text-white font-bold transition-all duration-500 cursor-default">
            Aryan <span className="logo-tn transition-colors duration-500">TN</span>
          </span>

          <a
            href={`mailto:${EMAIL}`}
            className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 font-bold hover:text-[var(--electric-teal)] transition-colors duration-300"
          >
            {EMAIL}
          </a>
        </div>
      </footer>
    </div>
  );
}
