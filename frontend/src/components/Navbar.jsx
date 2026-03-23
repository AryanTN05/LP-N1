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
  const [inLight, setInLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuLinksRef = useRef([]);
  const navRef = useRef(null);
  const pillRef = useRef(null);

  // ── Smooth continuous scroll interpolation ────────────────
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let scrollY = 0;
    let current = 0; // lerped value
    let rafId;
    const FADE_RANGE = 220; // px over which glass fades in
    const HERO_THRESHOLD = window.innerHeight * 0.85;

    const tick = () => {
      // Lerp toward target scroll value
      current += (scrollY - current) * 0.1;
      const p = Math.min(current / FADE_RANGE, 1); // 0 → 1

      // Interpolate styles directly — no state flip, no class toggle
      nav.style.background        = `rgba(12,12,14,${(p * 0.52).toFixed(3)})`;
      nav.style.backdropFilter    = `blur(${(p * 28).toFixed(1)}px) saturate(${(100 + p * 80).toFixed(0)}%)`;
      nav.style.webkitBackdropFilter = nav.style.backdropFilter;
      nav.style.borderBottomColor = `rgba(255,255,255,${(p * 0.08).toFixed(3)})`;
      nav.style.boxShadow         = p > 0.05
        ? `0 4px ${(p * 24).toFixed(0)}px rgba(0,0,0,${(p * 0.3).toFixed(2)})`
        : "none";
      // Shrink padding as user scrolls
      const py = (1.25 - p * 0.5).toFixed(3);
      nav.style.paddingTop    = `${py}rem`;
      nav.style.paddingBottom = `${py}rem`;

      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
      setInLight(window.scrollY > HERO_THRESHOLD);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ── Pill in / full-nav out when entering light section ────
  useEffect(() => {
    if (!pillRef.current || !navRef.current) return;

    if (inLight) {
      gsap.to(navRef.current, {
        opacity: 0, y: -8,
        duration: 0.45, ease: "power3.inOut",
        onComplete: () => { if (navRef.current) navRef.current.style.pointerEvents = "none"; },
      });
      pillRef.current.style.pointerEvents = "auto";
      gsap.fromTo(
        pillRef.current,
        { opacity: 0, y: -16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out", delay: 0.12 }
      );
    } else {
      gsap.to(pillRef.current, {
        opacity: 0, y: -10, scale: 0.96,
        duration: 0.3, ease: "power2.in",
        onComplete: () => { if (pillRef.current) pillRef.current.style.pointerEvents = "none"; },
      });
      navRef.current.style.pointerEvents = "auto";
      gsap.to(navRef.current, {
        opacity: 1, y: 0,
        duration: 0.5, ease: "power3.out", delay: 0.08,
      });
    }
  }, [inLight]);

  // ── Mobile menu ───────────────────────────────────────────
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
        x: "100%", duration: 0.45, ease: "power3.in", delay: 0.15,
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
      {/* ── Full-width bar ───────────────────────────────── */}
      <nav
        ref={navRef}
        data-testid="navbar"
        className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
        style={{ paddingTop: "1.25rem", paddingBottom: "1.25rem" }}
      >
        <div className="px-6 md:px-12 flex items-center justify-between">
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

      {/* ── Pill nav (light-section state) ──────────────── */}
      <div
        ref={pillRef}
        className="fixed top-5 left-1/2 z-50 hidden md:flex items-center gap-6 px-6 py-3 rounded-full"
        style={{
          transform: "translateX(-50%)",
          background: "rgba(14, 14, 16, 0.5)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.1)",
          opacity: 0,
          pointerEvents: "none",
          boxShadow: "0 4px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
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
          className="pill-cta font-mono text-[10px] uppercase tracking-[0.18em] text-white px-4 py-1.5 rounded-full"
          style={{ background: "var(--electric-teal)" }}
        >
          Book a Call
        </a>
      </div>

      {/* ── Mobile full-screen menu ──────────────────────── */}
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
