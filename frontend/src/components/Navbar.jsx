import { useEffect, useRef, useState } from "react";
import { ArrowRight, X, Menu } from "lucide-react";
import { gsap } from "@/lib/animations";

const CAL_LINK = "https://cal.com/aryantn01/30min";

const navLinks = [
  { label: "Solution", href: "#solution" },
  { label: "Results", href: "#results" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [inLight, setInLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuLinksRef = useRef([]);
  const navRef = useRef(null);
  const pillRef = useRef(null);

  // Track scroll state (dark blur) and light-section state (pill)
  useEffect(() => {
    const HERO_THRESHOLD = () => window.innerHeight * 0.85;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      setInLight(y > HERO_THRESHOLD());
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate pill in/out
  useEffect(() => {
    if (!pillRef.current || !navRef.current) return;

    if (inLight) {
      // Fade out full navbar, fade in pill
      gsap.to(navRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        pillRef.current,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", delay: 0.1 }
      );
    } else {
      // Fade in full navbar, fade out pill
      gsap.to(pillRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" });
      gsap.to(navRef.current, { opacity: 1, duration: 0.4, ease: "power3.out", delay: 0.1 });
    }
  }, [inLight]);

  // Mobile menu open/close animation
  useEffect(() => {
    if (!menuRef.current) return;
    const links = menuLinksRef.current.filter(Boolean);
    if (menuOpen) {
      gsap.set(menuRef.current, { display: "flex" });
      gsap.to(menuRef.current, { x: "0%", duration: 0.5, ease: "power3.out" });
      gsap.fromTo(
        links,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.2 }
      );
      document.body.style.overflow = "hidden";
    } else {
      gsap.to(links, { y: 20, opacity: 0, duration: 0.3, stagger: 0.05, ease: "power2.in" });
      gsap.to(menuRef.current, {
        x: "100%",
        duration: 0.45,
        ease: "power3.in",
        delay: 0.15,
        onComplete: () => {
          if (menuRef.current) gsap.set(menuRef.current, { display: "none" });
        },
      });
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <>
      {/* ── Full-width bar (hero state) ─────────────────────── */}
      <nav
        ref={navRef}
        data-testid="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 border-b" : "bg-transparent py-5"
        }`}
        style={
          scrolled
            ? {
                background: "rgba(17,17,17,0.88)",
                backdropFilter: "blur(20px)",
                borderColor: "rgba(255,255,255,0.06)",
              }
            : {}
        }
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="font-heading text-xl tracking-widest uppercase text-white hover:opacity-70 transition-opacity"
          >
            Aryan <span className="font-sans font-light text-zinc-400">TN</span>
          </a>

          {/* Right-aligned links + CTA — desktop */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="navbar-cta"
              className="btn-bracket text-white text-[11px]"
            >
              Start Today
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* ── Pill nav (light-section state) ─────────────────── */}
      <div
        ref={pillRef}
        className="fixed top-5 left-1/2 z-50 hidden md:flex items-center gap-6 px-6 py-3 rounded-full"
        style={{
          transform: "translateX(-50%)",
          background: "rgba(17,17,17,0.96)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          opacity: 0,
          boxShadow: "0 4px 32px rgba(0,0,0,0.35)",
        }}
      >
        {/* Monogram */}
        <a
          href="#"
          className="font-heading text-sm tracking-widest uppercase text-white hover:opacity-70 transition-opacity mr-2"
        >
          ATN
        </a>

        <div className="w-px h-4 bg-white/10" />

        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 hover:text-white transition-colors"
          >
            {link.label}
          </a>
        ))}

        <div className="w-px h-4 bg-white/10" />

        <a
          href={CAL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-white px-4 py-1.5 rounded-full transition-all"
          style={{ background: "var(--electric-teal)" }}
        >
          Book a Call
        </a>
      </div>

      {/* ── Mobile full-screen menu ──────────────────────────── */}
      <div
        ref={menuRef}
        className="mobile-menu"
        style={{ display: "none", transform: "translateX(100%)" }}
        aria-hidden={!menuOpen}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              ref={(el) => (menuLinksRef.current[i] = el)}
              className="mobile-menu-link"
              onClick={() => handleNavClick(link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            ref={(el) => (menuLinksRef.current[navLinks.length] = el)}
            href={CAL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-menu-link mt-4"
            style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)", color: "var(--electric-teal)" }}
            onClick={() => setMenuOpen(false)}
          >
            Book a Call →
          </a>
        </div>
      </div>
    </>
  );
}
