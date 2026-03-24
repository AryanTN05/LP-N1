import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EMAIL = "aryantn01@gmail.com";

const sections = [
  {
    id: "privacy",
    title: "Privacy Policy",
    updated: "March 2025",
    content: [
      {
        heading: "1. Introduction",
        text: `I'm Aryan TN, an independent freelancer based in Bengaluru, India, offering AI Automation and Lead Generation services. This policy explains how I collect, use, and safeguard your personal information in accordance with applicable Indian data protection laws.`,
      },
      {
        heading: "2. Who I Am",
        text: `I operate as an individual freelancer under the name Aryan TN and am solely responsible for your personal data. You can reach me at ${EMAIL}.`,
      },
      {
        heading: "3. Data I Collect",
        text: null,
        list: [
          "Identity & Contact Data — Name, email, and details you voluntarily share",
          "Project & Business Data — Business information shared during consultations or onboarding",
          "Financial Data — Payment information processed through secure third-party platforms. I do not store card or banking details directly",
          "Technical Data — IP address, browser type, and usage data collected automatically via my website",
        ],
      },
      {
        heading: "4. How I Collect Your Data",
        text: "Data is collected through direct interactions (contact forms, emails, calls), information shared during project onboarding, and automated technologies like cookies and analytics tools on my website.",
      },
      {
        heading: "5. How I Use Your Data",
        text: "I use your data to communicate about projects, deliver agreed services, process payments, and comply with legal obligations. I do not sell or share your data with third parties for marketing purposes.",
      },
      {
        heading: "6. Data Security",
        text: "I implement reasonable measures to protect your data from unauthorized access or disclosure. No method of internet transmission is 100% secure, but I take this seriously.",
      },
      {
        heading: "7. Data Retention",
        text: "I retain your data only as long as necessary to fulfill the purposes in this policy or as required by law. Project-related data is generally kept for up to 2 years after completion.",
      },
      {
        heading: "8. Your Rights",
        text: `Under applicable Indian law, you have the right to access, correct, or request deletion of your personal data, and to withdraw consent at any time. To exercise these rights, email ${EMAIL}.`,
      },
      {
        heading: "9. Third-Party Links",
        text: "My website may link to external sites. I have no control over their privacy practices and take no responsibility for them.",
      },
      {
        heading: "10. International Data Transfers",
        text: "If your data is processed outside India through third-party tools I use, I ensure such transfers comply with applicable Indian data protection regulations.",
      },
      {
        heading: "11. Contact",
        text: `Email: ${EMAIL}\nLocation: Bengaluru, India`,
      },
      {
        heading: "12. Changes to This Policy",
        text: "I reserve the right to update this policy at any time. Changes will be posted on this page with a revised date.",
      },
    ],
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    updated: "March 2025",
    content: [
      {
        heading: "1. Introduction",
        text: "These Terms and Conditions govern your use of my website and engagement with my freelance services. By accessing my website or entering into a service agreement with me, you agree to be bound by these Terms.",
      },
      {
        heading: "2. Changes to These Terms",
        text: "I reserve the right to modify these Terms at any time. Updates will be posted on my website. Continued use after changes are posted constitutes acceptance.",
      },
      {
        heading: "3. Payments & Agreements",
        text: "All projects begin with a written proposal or agreement. Making an initial payment confirms acceptance of the project scope and these Terms. Payment terms follow the structure in my Cancellation & Refund Policy.",
      },
      {
        heading: "4. Client Responsibilities",
        text: "You agree to provide accurate and timely information, be available for feedback within agreed timelines, and ensure you have the legal right to share any assets or data provided to me. Delays caused by your end are not grounds for refunds.",
      },
      {
        heading: "5. Intellectual Property",
        text: "Work becomes your property upon full payment. Until then, all deliverables remain mine. I may feature completed work in my portfolio unless you request otherwise in writing.",
      },
      {
        heading: "6. Confidentiality",
        text: "I treat all client information as confidential and will not disclose your business data to third parties without your consent, except as required by law.",
      },
      {
        heading: "7. Third-Party Tools",
        text: "My services may involve third-party tools or platforms. I am not responsible for their terms or data practices. Any associated costs will be disclosed upfront.",
      },
      {
        heading: "8. Termination",
        text: "I reserve the right to terminate a project if you breach these Terms or engage in fraudulent or abusive behavior. Financial implications are governed by my Cancellation & Refund Policy.",
      },
      {
        heading: "9. Disclaimer & Limitation of Liability",
        text: "I do not guarantee specific business outcomes such as revenue growth or lead volume as these depend on factors beyond my control. My liability is limited to the amount paid for the specific service in question.",
      },
      {
        heading: "10. Governing Law",
        text: "These Terms are governed by the laws of India. Disputes fall under the jurisdiction of courts in Bengaluru, Karnataka.",
      },
      {
        heading: "11. Contact",
        text: `Email: ${EMAIL}\nLocation: Bengaluru, India`,
      },
    ],
  },
  {
    id: "refund",
    title: "Cancellation & Refund Policy",
    updated: "March 2025",
    content: [
      {
        heading: "1. Overview",
        text: "All my work is custom-built for each client. This policy outlines the payment structure, cancellation terms, and refund eligibility. By engaging my services, you acknowledge and agree to this policy.",
      },
      {
        heading: "2. Payment Structure",
        text: "All projects follow a standard two-part payment schedule:",
        list: [
          "50% Initial Payment — Required upon contract signing to initiate the project",
          "50% Final Payment — Due upon successful project delivery",
        ],
        after: "For larger or complex projects, an alternative payment schedule may be proposed and outlined in your project agreement.",
      },
      {
        heading: "3. No Refund Policy",
        text: "All payments are non-refundable once project work has commenced. This is because time and resources are allocated immediately, research and planning begin from day one, and accepting your project means turning away other opportunities.",
      },
      {
        heading: "4. 48-Hour Grace Period",
        text: "If you need to cancel shortly after signing, the following applies:",
        list: [
          "Cancellation requested within 48 hours of contract signing",
          "No substantial project work has commenced",
          `Request submitted in writing to ${EMAIL}`,
        ],
        after: "Refund Structure: Administrative Fee (non-refundable) — 20% of total project value. Refundable Amount — 30% of total project value. Refund Timeline — Processed within 5–10 business days.",
      },
      {
        heading: "5. Mid-Project Cancellation",
        text: "If you cancel after the 48-hour grace period but before project completion:",
        list: [
          "The initial 50% payment is non-refundable",
          "The final 50% payment is not required",
          "All work developed up to that point remains my intellectual property",
          "No partial refunds will be issued",
        ],
      },
      {
        heading: "6. Project Modifications & Delays",
        text: `Project postponements, scope adjustments, and timeline extensions are accommodated without penalty. All modification requests must be submitted in writing to ${EMAIL} and confirmed via email before changes take effect.`,
      },
      {
        heading: "7. Quality Commitment",
        text: "I stand behind the quality of my work. If I fail to meet agreed deliverables due to my own error, I will resolve the issue at no additional cost to you.",
      },
      {
        heading: "8. Exceptional Circumstances",
        text: `Exceptions may be considered for documented emergencies such as medical issues, natural disasters, or significant unforeseen business changes. All requests are reviewed case-by-case and require supporting documentation. Email ${EMAIL}.`,
      },
      {
        heading: "9. Contact",
        text: `Email: ${EMAIL}\nLocation: Bengaluru, India\n\nResponse Time: All cancellation requests will be acknowledged within 24 hours.`,
      },
      {
        heading: "10. Policy Updates",
        text: "I reserve the right to update this policy at any time. Changes will be posted on my website and apply to all contracts signed after the updated effective date.",
      },
    ],
  },
];

function PolicySection({ section }) {
  return (
    <div id={section.id} className="mb-20">
      <div className="mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 block mb-3">
          Last Updated: {section.updated}
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl uppercase tracking-wide text-white">
          {section.title}
        </h2>
      </div>

      <div className="space-y-8">
        {section.content.map((item, i) => (
          <div key={i}>
            <h3 className="font-heading text-base sm:text-lg uppercase tracking-wide text-zinc-200 mb-3">
              {item.heading}
            </h3>
            {item.text && (
              <p className="text-sm leading-relaxed text-zinc-400 whitespace-pre-line">
                {item.text}
              </p>
            )}
            {item.list && (
              <ul className="mt-3 space-y-2">
                {item.list.map((li, j) => (
                  <li key={j} className="text-sm leading-relaxed text-zinc-400 pl-4 relative">
                    <span className="absolute left-0 text-zinc-600">—</span>
                    {li}
                  </li>
                ))}
              </ul>
            )}
            {item.after && (
              <p className="text-sm leading-relaxed text-zinc-400 mt-3">
                {item.after}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PoliciesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--rich-carbon)", color: "var(--text-light)" }}
    >
      {/* Top bar */}
      <div className="px-6 md:px-12 py-6 flex items-center justify-between border-b border-white/5">
        <Link
          to="/"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <span className="font-heading text-sm uppercase tracking-widest text-zinc-500">
          Aryan TN
        </span>
      </div>

      {/* Jump links */}
      <div className="px-6 md:px-12 py-6 flex flex-wrap gap-4 border-b border-white/5">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 hover:text-white transition-colors"
          >
            {s.title}
          </a>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {sections.map((s) => (
          <PolicySection key={s.id} section={s} />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            © {new Date().getFullYear()} Aryan TN. All rights reserved.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            {EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
