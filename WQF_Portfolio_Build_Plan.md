# WQF-Inspired Portfolio Build Plan
### Adapted for: React 19 + CRA + JavaScript (Aryan TN — AI Automation Specialist)
### Reference Site: [https://www.worldquantfoundry.com/](https://www.worldquantfoundry.com/)

---

> **What this document is:** A complete, actionable build plan for making this landing page
> match the design quality of WorldQuant Foundry. It is written specifically for the **existing
> CRA + React 19 + JavaScript codebase** — not Next.js. Every section references real files
> in this project. Nothing here requires starting over.

---

## TABLE OF CONTENTS

1. [Reference Site Analysis (Real Data)](#1-reference-site-analysis)
2. [Current Codebase State](#2-current-codebase-state)
3. [Gap Analysis — What's Missing](#3-gap-analysis)
4. [Tech Stack (Existing + Additions)](#4-tech-stack)
5. [Design System — WQF Tokens Mapped to This Project](#5-design-system)
6. [Animation System](#6-animation-system)
7. [Three.js 3D Scenes](#7-threejs-3d-scenes)
8. [Section-by-Section Build Guide](#8-section-by-section-build-guide)
9. [Micro-Interactions & Polish](#9-micro-interactions--polish)
10. [Responsive Design](#10-responsive-design)
11. [Performance](#11-performance)
12. [Build Order (Priority Queue)](#12-build-order)

---

## 1. REFERENCE SITE ANALYSIS

**Site:** [https://www.worldquantfoundry.com/](https://www.worldquantfoundry.com/)
**Built by:** Series Eight (agency) — Awwwards nominated
**CMS:** Craft CMS (irrelevant to us — we use React)

### 1.1 Actual Color Palette (scraped from live site)

```
BACKGROUNDS:
  Page primary:          #111111  ("Rich Carbon" — very dark, not pure black)
  Page secondary:        #090909  ("Core Black" — darkest elements)
  Urban Smoke:           #1b1b1b  (secondary dark backgrounds)
  Off-White:             #e7e7e7  (light sections — headings, cards)
  Neural Fog:            #dadada  (secondary light)

ACCENT COLORS:
  Electric Teal:         #5c939f  (card backgrounds, highlights, hover states)
  Infrared:              #ed6d40  (secondary cards, footer accents, CTAs)

TEXT:
  Light text:            #e7e7e7  (on dark backgrounds)
  Dark text:             #111111  (on light backgrounds)
  Muted:                 #535353  ("Pulse Ash" — reduced emphasis text)

BORDERS:
  Subtle (dark):         rgba(255, 255, 255, 0.06)
  Subtle (light):        rgba(0, 0, 0, 0.08)
  Hover:                 rgba(255, 255, 255, 0.12)

GRADIENTS:
  Mask gradient:         linear-gradient(0deg, transparent 0%, black 20%, black 80%, transparent 100%)
  Card glow hover:       radial-gradient(ellipse at center, rgba(92,147,159,0.12) 0%, transparent 70%)
```

### 1.2 Actual Typography (scraped from live site)

```
FONTS:
  Primary:    "Roc Grotesk" — weights 400, 500 (geometric sans-serif, NOT Space Grotesk)
  Monospace:  "Azeret Mono" — accents, labels, counters (NOT Space Mono)
  Fallbacks:  system-ui, sans-serif

  NOTE: Roc Grotesk is a paid font. Best free alternative: "Space Grotesk" (already in project)
        Azeret Mono is on Google Fonts — add it.

HEADING SCALE (using clamp, all weight: 500):
  H1:   clamp(2rem, 5cqw, 3.75rem)    line-height: 1      letter-spacing: -0.02em
  H2:   clamp(2.25rem, 5cqw, 3.75rem) line-height: 0.95   letter-spacing: -0.02em
  H3:   clamp(2rem, 4cqw, 3.125rem)   line-height: 1      letter-spacing: -0.02em
  H4:   clamp(1.75rem, 3cqw, 2.5rem)  line-height: 1      letter-spacing: -0.02em
  H5:   clamp(1.5rem, 2.5cqw, 1.875rem) line-height: 1    letter-spacing: -0.01em
  H6:   clamp(1.125rem, 2cqw, 1.375rem) line-height: 1.1

  Label (P1 mono): 0.75rem, uppercase, letter-spacing: 0.1em, font: Azeret Mono
  Counter:         0.875rem, tabular-nums, letter-spacing: 0.05em

CUSTOM EASING:
  --easing: cubic-bezier(0.62, 0.16, 0.13, 1.01)   ← This is the WQF easing. Use everywhere.
```

### 1.3 Animation Inventory (every animation cataloged)

**Page Load / Preloader:**
- Logo animates in: fade + scale (1s, `loader-logo` keyframe)
- Logo rotates: 0.5s at 1.75s delay (`loader-logo-rotate`)
- Logo translates up: 1s at 1.75s delay (`loader-logo-translate`)
- Preloader fades out, revealing the hero

**Hero Section:**
- Title split into two halves: left half slides in from left, right half from right
  - Keyframes: `hero-title-left` and `hero-title-right`, 1.5s, 2.75s delay
- Subtitle fades up after title (0.8s delay after title)
- CTA button fades in last
- Three.js canvas: geometric mesh + particle system in background
- On scroll: hero content has subtle parallax (moves at 0.5x scroll speed)

**Navigation:**
- Starts transparent
- On scroll >80px: adds blurred dark background `rgba(17,17,17,0.85) backdrop-blur(20px)`
- Nav links: underline draws left→right on hover (scaleX: 0→1, 400ms)
- Mobile: full-screen overlay slides in from right

**Section Headers (all sections follow this pattern):**
1. Small mono label fades in first (opacity 0→1, y: 20px→0)
2. Heading splits into words → each word slides up from below (clip-path or translateY)
3. Body text fades in after heading
4. Triggered by ScrollTrigger at `"top 80%"` viewport

**Ethos Cards (horizontal carousel):**
- Cards stagger in from bottom as section enters viewport
- On hover: card EXPANDS (flex-grow 1→1.8, 0.6s `cubic-bezier(0.16, 1, 0.3, 1)`)
- Background fills with clip-path animation on active card
- Text and number fade to full opacity on hover
- Card counter shows position (01 / 04)

**Focus Industries Accordion (the expandable list):**
- Items fade in on scroll with stagger
- Click to expand: `max-height: 0 → 200px`, opacity 0→1 (0.4s `cubic-bezier(0.16, 1, 0.3, 1)`)
- Inactive items fade to 30% opacity when one is active
- Active item heading changes color

**Portfolio / Work Section:**
- Swiper.js carousel
- Active card is wider (e.g., 40% width vs 25% for inactive)
- Each card has 3D perspective tilt on hover (rotates ±5° based on mouse position)
- Slide counter shows current position (01 / 05)
- Entrance: stagger in from right as section enters viewport

**Leadership / Partners Carousel:**
- Swiper with 3 items, one active at a time
- Active card: much larger than inactive cards (container query sizing)
- Bio slides in below active card on click
- Word-by-word text reveal on statement text ("We spot trends before they're trends")
- Prev/next with counter (01 / 03)

**CTA Section:**
- Large text reveal animation (word by word)
- Magnetic button: button subtly follows cursor within ~60px radius
- Background: Three.js scene visible again (or gradient)

**Footer:**
- Three.js canvas in left column (hidden on mobile)
- Links have underline hover animation
- Footer fades in on scroll

**Global Patterns:**
- ALL text reveals: split into words → `translateY(100%) + opacity(0)` → normal
  Use `overflow: hidden` wrapper on each line so words clip properly
- ALL scroll animations: GSAP ScrollTrigger, start: `"top 80%"`
- Custom cursor: dot follows mouse, grows on hover elements (optional but premium)
- Film grain overlay: barely perceptible noise texture on entire page

### 1.4 Three.js Usage on WQF Site

WQF uses Three.js in **3 locations**:
1. **Hero:** Main geometric mesh + floating particles — full-width behind content
2. **Partners section:** Background visualization
3. **Footer:** Left-column animated canvas (desktop only)

The hero canvas has:
- A geometric mesh (wireframe or solid, likely a torus or icosahedron)
- Particle system around it
- Mouse-reactive: mesh tilts/rotates subtly based on cursor position
- Slow auto-rotation
- Fog for depth

---

## 2. CURRENT CODEBASE STATE

### What's Already Built

| Feature | File | Status |
|---------|------|--------|
| GSAP + Lenis smooth scroll | `src/lib/animations.js` | ✅ Done |
| Three.js particle torus (hero bg) | `src/components/ParticleCanvas.jsx` | ✅ Done |
| 8 page sections | Multiple component files | ✅ Done |
| Dark/light section theming | `src/index.css` | ✅ Done |
| Ethos cards (flex-grow hover) | `src/index.css` (`.ethos-card`) | ✅ Done |
| Focus accordion | `src/index.css` (`.focus-list-item`) | ✅ Done |
| Bracket-style CTA button | `src/index.css` (`.btn-bracket`) | ✅ Done |
| Glass card (dark sections) | `src/index.css` (`.glass-card`) | ✅ Done |
| Scroll mouse indicator | `src/index.css` | ✅ Done |
| GSAP hero word animation | `src/components/HeroSection.jsx` | ✅ Done |
| Scroll reveal hook | `src/hooks/useScrollReveal.js` | ✅ Done |
| Shadcn UI component library | `src/components/ui/` | ✅ Done |
| Tailwind config with custom fonts | `frontend/tailwind.config.js` | ✅ Done |
| FastAPI backend stub | `backend/server.py` | ✅ Done (unused) |

### Tech Stack (Current)

```
Framework:     Create React App (React 19.0.0)
Language:      JavaScript (JSX) — NOT TypeScript
Styles:        Tailwind CSS 3.4.17 + custom CSS (index.css 401 lines)
Animation:     GSAP 3.14.2 + Lenis 1.3.19
3D:            Three.js 0.183.2 (raw, no React Three Fiber needed)
Icons:         Lucide React 0.507.0
Components:    Shadcn UI (Radix UI based)
Build:         Craco (CRA override)
Package mgr:   Yarn
```

---

## 3. GAP ANALYSIS

### Missing Features (Priority Order)

| Feature | Priority | Complexity | Maps to WQF |
|---------|----------|------------|-------------|
| Film grain overlay | P0 | Low | Global texture |
| Preloader / loading screen | P0 | Medium | Page load animation |
| Clip-path text reveal (proper word masks) | P0 | Medium | All section headings |
| Hero title split-direction animation | P1 | Medium | `hero-title-left/right` |
| Three.js footer canvas | P1 | Medium | Footer left column |
| Magnetic CTA button | P1 | Medium | CTA section |
| Portfolio/work carousel (Swiper.js) | P1 | High | Portfolio section |
| 3D card tilt on hover | P1 | Medium | Portfolio cards |
| Partners/team carousel | P2 | High | Leadership section |
| Custom cursor (dot follower) | P2 | Medium | Global |
| Nav underline draw animation | P2 | Low | Navbar |
| Scroll-based navbar background | P2 | Low | Navbar |
| Numbered benefit cards (01/02/03) | P2 | Low | Results/Why Me sections |
| Page transition (between sections) | P3 | High | Optional |
| Azeret Mono font (upgrade from Space Mono) | P3 | Low | Typography |

---

## 4. TECH STACK

### Keep (already installed)
- React 19 + React Router 7
- GSAP 3.14.2 (with ScrollTrigger)
- Lenis 1.3.19
- Three.js 0.183.2
- Tailwind CSS 3.4.17
- Lucide React

### Add (new installs needed)

```bash
# From frontend/ directory:

# Swiper.js — for portfolio and team carousels
yarn add swiper

# Splitting.js — free GSAP SplitText alternative for word/char splitting
yarn add splitting

# @studio-freight/react-lenis — optional upgrade for better React integration
# (skip if current Lenis setup works fine)
```

### Do NOT add
- Next.js — wrong framework for this project
- TypeScript — project is JavaScript
- React Three Fiber — current vanilla Three.js setup is simpler and sufficient
- Framer Motion — GSAP handles all animations

---

## 5. DESIGN SYSTEM

### 5.1 Update CSS Variables in `src/index.css`

Add/update these variables to match real WQF tokens:

```css
:root {
  /* Backgrounds (WQF exact) */
  --rich-carbon:    #111111;   /* primary dark bg */
  --core-black:     #090909;   /* deepest dark */
  --urban-smoke:    #1b1b1b;   /* secondary dark */
  --off-white:      #e7e7e7;   /* primary light */
  --neural-fog:     #dadada;   /* secondary light */

  /* Accents (WQF exact) */
  --electric-teal:  #5c939f;   /* replaces --card-teal */
  --infrared:       #ed6d40;   /* replaces --accent-orange */

  /* Text */
  --text-on-dark:   #e7e7e7;
  --text-on-light:  #111111;
  --pulse-ash:      #535353;   /* muted text */

  /* Borders */
  --border-dark:    rgba(255, 255, 255, 0.06);
  --border-light:   rgba(0, 0, 0, 0.08);

  /* Easing (WQF custom easing — use on all transitions) */
  --easing: cubic-bezier(0.62, 0.16, 0.13, 1.01);

  /* Keep existing accents for compatibility */
  --accent-teal:    #5EEAD4;   /* brighter teal for hero gradient */
  --accent-blue:    #6366f1;
}
```

### 5.2 Typography Update

Add Azeret Mono to Google Fonts import in `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&family=Azeret+Mono:wght@400;500&display=swap');
```

Add to `tailwind.config.js`:
```javascript
fontFamily: {
  heading: ['"DM Serif Display"', 'serif'],
  mono: ['"Space Mono"', '"Azeret Mono"', 'monospace'],
  'azeret': ['"Azeret Mono"', 'monospace'],  // add this
}
```

### 5.3 WQF Design Tokens Summary

```
Section padding:     clamp(80px, 12vw, 160px) top + bottom  ← very generous = premium feel
Container max-width: 1320px centered
Card border-radius:  20px (WQF uses 20px, not 16px)
Card padding:        clamp(20px, 3vw, 40px) px, clamp(40px, 5vw, 60px) py
Gap between cards:   32px (desktop), 12px (mobile)
Button height:       40px, padding: 0 20px
Divider:            1px, rgba(255,255,255,0.06) on dark / rgba(0,0,0,0.08) on light
```

---

## 6. ANIMATION SYSTEM

### 6.1 What Exists in `src/lib/animations.js`

Check current exports: `gsap`, `initSmoothScroll`, `destroySmoothScroll`.
The Lenis + ScrollTrigger connection should already be set up here.

### 6.2 Add to `src/lib/animations.js`

```javascript
// ── Text Word Reveal ─────────────────────────────────────────────
// Uses Splitting.js to split text into .word spans, then animates them
// Call this after Splitting() has run on the element
export function animateTextReveal(element, options = {}) {
  const words = element.querySelectorAll('.word');
  if (!words.length) return;

  return gsap.fromTo(
    words,
    { yPercent: 105, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: options.duration || 0.9,
      stagger: options.stagger || 0.04,
      ease: options.ease || 'power3.out',
      delay: options.delay || 0,
      scrollTrigger: options.scrollTrigger || {
        trigger: element,
        start: 'top 80%',
        once: true,
      },
    }
  );
}

// ── Stagger Fade In ───────────────────────────────────────────────
export function animateStaggerIn(elements, options = {}) {
  return gsap.fromTo(
    elements,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: options.duration || 0.7,
      stagger: options.stagger || 0.1,
      ease: options.ease || 'power2.out',
      scrollTrigger: options.scrollTrigger || {
        trigger: elements[0],
        start: 'top 80%',
        once: true,
      },
    }
  );
}

// ── Clip-path Line Draw ───────────────────────────────────────────
export function animateLineDraw(element, options = {}) {
  return gsap.fromTo(
    element,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration: options.duration || 1.2,
      ease: 'power3.inOut',
      scrollTrigger: options.scrollTrigger || {
        trigger: element,
        start: 'top 85%',
        once: true,
      },
    }
  );
}

// ── Parallax ─────────────────────────────────────────────────────
export function animateParallax(element, yPercent = -20) {
  return gsap.to(element, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}
```

### 6.3 Reusable `useTextReveal` Hook

Create `src/hooks/useTextReveal.js`:

```javascript
import { useEffect, useRef } from 'react';
import Splitting from 'splitting';
import 'splitting/dist/splitting.css';
import { animateTextReveal } from '@/lib/animations';

// Usage: const ref = useTextReveal();
// Apply ref to any heading element.
export function useTextReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // Wrap each word in overflow:hidden container so clip works
    const result = Splitting({ target: ref.current, by: 'words' });

    // Wrap each .word in a mask span
    result[0].words.forEach(word => {
      const mask = document.createElement('span');
      mask.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
      word.parentNode.insertBefore(mask, word);
      mask.appendChild(word);
    });

    animateTextReveal(ref.current, options);
  }, []);

  return ref;
}
```

### 6.4 Hero Title Animation Update

The WQF hero title uses a **split-direction** reveal:
- Left portion of text slides in from the LEFT
- Right portion slides in from the RIGHT
- Delay: 2.75s (after preloader exits)

Update `HeroSection.jsx` heading animation:

```javascript
// Split heading into two halves — first line slides from left, second from right
gsap.fromTo('.hero-line-left',
  { x: '-10%', opacity: 0 },
  { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.3 }
);
gsap.fromTo('.hero-line-right',
  { x: '10%', opacity: 0 },
  { x: '0%', opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.3 }
);
```

---

## 7. THREE.JS 3D SCENES

### 7.1 Hero Scene (Already Exists — Improvements)

**File:** `src/components/ParticleCanvas.jsx`

**Current state:** Torus particle cloud with mouse interaction. Good foundation.

**Improvements to match WQF:**
- Add a **geometric wireframe mesh** in addition to particles (WQF has a solid/wireframe shape)
- Add `THREE.FogExp2` depth effect (already done — keep it)
- Increase particle count to 6000 for density
- Add a second particle layer at larger radius, slower rotation (depth parallax)
- Change rotation: mesh should rotate on Y-axis primarily, slight X wobble
- Mouse tilt: increase sensitivity slightly

**Suggested geometry additions:**
```javascript
// Add inside the existing useEffect, after particle mesh:

// Wireframe torus for the geometric shape
const torusGeo = new THREE.TorusGeometry(300, 60, 16, 80);
const torusMat = new THREE.MeshBasicMaterial({
  color: 0x5c939f,      // WQF electric teal
  wireframe: true,
  transparent: true,
  opacity: 0.08,
});
const torusMesh = new THREE.Mesh(torusGeo, torusMat);
scene.add(torusMesh);

// Animate it (add to animate loop):
torusMesh.rotation.x = t * 0.02;
torusMesh.rotation.y = t * 0.04;
```

### 7.2 Footer Canvas (New)

Create `src/components/FooterCanvas.jsx` — Three.js canvas for footer left column.

**Spec (matching WQF footer):**
- Render a minimal particle field or slow-moving grid
- Size: fills its container (not fullscreen)
- Hidden on mobile, shown on `lg:` breakpoint
- Mask gradient applied: `linear-gradient(0deg, transparent 0%, black 20%, black 80%, transparent 100%)`
- Colors: white particles, very low opacity
- Performance: reduce particle count to 800, skip mouse interaction

```javascript
// Key difference from HeroCanvas:
// - Positioned absolute inside its container (already fixed in ParticleCanvas)
// - Simpler scene: just floating particles, no torus
// - Lower frame rate is acceptable (30fps cap)
const animate = () => {
  raf = requestAnimationFrame(animate);
  // Limit to ~30fps
  if (clock.getElapsedTime() - lastFrame < 0.033) return;
  lastFrame = clock.getElapsedTime();
  // ...
};
```

---

## 8. SECTION-BY-SECTION BUILD GUIDE

### 8.1 Preloader (NEW — Build First)

**File to create:** `src/components/Preloader.jsx`

**What it does:** Shows while page loads, then exits with animation to reveal site.

**Implementation:**
```
1. Fixed overlay, z-index: 10000, bg: #111111
2. Center content:
   - Your name in heading font, large
   - A subtle progress counter: 0 → 100 (gsap.to counter, 1.5s)
   - OR: the bracket CTA style as a loading indicator
3. Exit animation (GSAP timeline):
   - counter/logo fades out (0.4s)
   - overlay slides up (translateY: 0 → -100%, 0.8s, power3.inOut)
   - Set display:none on complete
4. Mount in App.js as sibling to main content
5. On exit completion: trigger hero entrance animations
```

**App.js integration:**
```javascript
// Add state to track preloader complete
const [loaded, setLoaded] = useState(false);
// Pass setLoaded to Preloader, hero uses loaded state to trigger its animations
```

### 8.2 Navbar (UPDATE existing `Navbar.jsx`)

**Current state:** Likely has basic nav links.

**Updates needed:**
1. **Scroll-based background:**
```javascript
useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 80);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
// Apply class: scrolled ? 'bg-[rgba(17,17,17,0.85)] backdrop-blur-[20px]' : 'bg-transparent'
```

2. **Nav link underline animation** (CSS):
```css
.nav-link {
  position: relative;
  color: #535353;
  transition: color 0.3s var(--easing);
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 100%; height: 1.5px;
  background: #e7e7e7;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.4s var(--easing);
}
.nav-link:hover { color: #e7e7e7; }
.nav-link:hover::after { transform: scaleX(1); }
```

3. **Mobile menu:** Full-screen overlay, slides from right, links stagger in.

### 8.3 Hero Section (UPDATE existing `HeroSection.jsx`)

**Current state:** Has word-by-word GSAP animation, badge, CTA, scroll indicator, ParticleCanvas.

**Updates needed:**
1. **Split-direction heading** — wrap first lines in `.hero-line-left`, last lines in `.hero-line-right`
2. **Tool logos row** — if not present, add a row of partner/tool logos below the subtext (WQF does this)
3. **Verify ParticleCanvas is scoped to this section** — already done in previous session

### 8.4 Pain Points Section → Ethos Cards (UPDATE `PainPointsSection.jsx`)

**Current state:** Has ethos card CSS in index.css. Check if PainPointsSection uses it.

**WQF pattern:** 4 cards in a row, each with:
- Number (01 / 04) in top corner
- Card title in heading font
- Short description
- Dot art or icon at bottom
- On hover: card expands (flex-grow)
- Colors: card-black, card-teal, card-orange, card-light (alternating)

**Updates needed:**
1. Add scroll-triggered stagger entrance (GSAP staggerIn)
2. Ensure flex-grow hover is working (CSS already exists)
3. Add counter numbers (01/04, 02/04, etc.) in mono font

### 8.5 Solution Section → Focus Industries (UPDATE `SolutionSection.jsx`)

**WQF pattern:** Expandable list of focus areas — click one, it expands with description.
Inactive items fade to 30% opacity.

**Current state:** Bento grid layout.

**Decision point:** Keep bento grid OR switch to WQF-style accordion list.
- **Recommendation:** Keep bento grid (it's already built, distinct from WQF, still premium)
- **Add:** Scroll-triggered stagger entrance, hover lift effects on grid items

### 8.6 Results Section (UPDATE `ResultsSection.jsx`)

**WQF equivalent:** Numbered benefit cards (01, 02, 03) with icon + heading + description.

**Updates needed:**
1. Replace checklist with WQF-style numbered cards
2. Each card: large mono number, SVG/Lucide icon, heading, description
3. Stagger entrance animation on scroll
4. Subtle hover lift (`translateY(-4px)`, `box-shadow`)

**Card structure:**
```jsx
<div className="glass-card rounded-[20px] p-10 group hover:-translate-y-1 transition-transform">
  <span className="font-mono text-xs text-[#535353] tracking-widest">01 / 03</span>
  <h3 className="font-heading text-2xl mt-4 mb-3">Qualified Leads Only</h3>
  <p className="text-sm text-[#535353] leading-relaxed">Description...</p>
</div>
```

### 8.7 Why Me Section → Portfolio/Work Cards (MAJOR UPDATE `WhyMeSection.jsx`)

**WQF pattern:** This is the portfolio carousel — the most impressive section.

**Updates needed (using Swiper.js):**
```jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// Config:
// - slidesPerView: 1.2 (mobile), 2.5 (tablet), 3.5 (desktop)
// - active slide: width 40%, inactive: 25%
// - Each card: rounded-[20px], 3D tilt on hover
// - Card counter: "01 / 05" in bottom right
// - Navigation: prev/next arrows with counter
```

**3D Card Tilt (add to each card):**
```javascript
const handleMouseMove = (e, cardRef) => {
  const rect = cardRef.current.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  gsap.to(cardRef.current, {
    rotationY: x * 10,   // max 5deg tilt
    rotationX: -y * 10,
    transformPerspective: 800,
    duration: 0.3,
    ease: 'power2.out',
  });
};
const handleMouseLeave = (cardRef) => {
  gsap.to(cardRef.current, { rotationY: 0, rotationX: 0, duration: 0.5 });
};
```

### 8.8 Process Section (MINOR UPDATE `ProcessSection.jsx`)

**WQF pattern:** Clean numbered steps with connecting lines.

**Updates needed:**
1. Ensure step numbers are large mono counters (01, 02, 03, 04)
2. Add connecting line between steps (1px, animated with GSAP lineDraw on scroll)
3. Stagger entrance animation

### 8.9 FAQ Section (MINOR UPDATE `FaqSection.jsx`)

**WQF pattern:** Clean accordion — open item has full opacity, closed items are muted.

**Current state:** Uses Shadcn Accordion. Good baseline.

**Updates needed:**
1. When one item is open, fade other items to 40% opacity
2. Use WQF easing on expand/collapse
3. Add mono numbered labels (01, 02, 03...)

### 8.10 Footer (UPDATE `Footer.jsx`)

**WQF pattern:**
- Left column: Three.js canvas (desktop only) — `FooterCanvas.jsx`
- Right column: Infrared (`#ed6d40`) background, 2-column link grid
- Bottom: Copyright, social links

**Updates needed:**
1. Add `FooterCanvas.jsx` in left column (hidden below `lg:`)
2. Apply infrared/teal background to right column for visual punch
3. Add link hover underline animations (same as nav)
4. Social links: GitHub, LinkedIn, Email, Cal.com

---

## 9. MICRO-INTERACTIONS & POLISH

### 9.1 Film Grain Overlay (Build This First — High Impact, Low Effort)

**File to create:** `src/components/GrainOverlay.jsx`

```jsx
export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '-50%', left: '-50%',
        width: '200%', height: '200%',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: 0.35,
        animation: 'grain 8s steps(10) infinite',
      }}
    />
  );
}
```

Add `@keyframes grain` to `index.css`:
```css
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10%       { transform: translate(-5%, -10%); }
  20%       { transform: translate(-15%, 5%); }
  30%       { transform: translate(7%, -25%); }
  40%       { transform: translate(-5%, 25%); }
  50%       { transform: translate(-15%, 10%); }
  60%       { transform: translate(15%, 0%); }
  70%       { transform: translate(0%, 15%); }
  80%       { transform: translate(3%, 35%); }
  90%       { transform: translate(-10%, 10%); }
}
```

Mount in `App.js` as sibling to content (renders once, globally).

### 9.2 Magnetic CTA Button

**How it works:** When cursor enters the button's bounding box (±60px), the button follows the cursor slightly.

```javascript
// Add to the main CTA button component
const handleMouseMove = (e) => {
  const rect = btnRef.current.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const x = (e.clientX - centerX) * 0.25;  // 25% of distance
  const y = (e.clientY - centerY) * 0.25;
  gsap.to(btnRef.current, { x, y, duration: 0.3, ease: 'power2.out' });
};
const handleMouseLeave = () => {
  gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
};
```

### 9.3 Custom Cursor (Optional but Premium)

**File to create:** `src/components/CustomCursor.jsx`

```
- A small dot (8px) that follows mouse via GSAP
- On hoverable elements (a, button, [data-cursor]): dot scales to 40px, changes opacity
- Use GSAP to lerp position (not CSS transition — smoother)
- Hide default cursor: cursor: none on body (in index.css)
```

### 9.4 Selection Color

Add to `index.css`:
```css
::selection {
  background-color: rgba(92, 147, 159, 0.3);  /* electric teal */
  color: #e7e7e7;
}
```

### 9.5 Scroll Progress Indicator (Optional)

Thin line at top of viewport, scaleX: 0→1 based on scroll progress.
```javascript
gsap.to('.scroll-progress', {
  scaleX: 1,
  transformOrigin: 'left center',
  ease: 'none',
  scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
});
```

---

## 10. RESPONSIVE DESIGN

### Breakpoints (Tailwind defaults — already configured)
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Key Responsive Rules (WQF patterns)

```
Ethos cards:
  Desktop (lg+): horizontal row, flex-grow on hover
  Mobile: stacked vertically, no flex-grow animation

Footer canvas:
  Mobile: hidden (lg:block)
  Desktop: full height left column

Portfolio carousel:
  Mobile:  slidesPerView: 1.2, loop: false
  Tablet:  slidesPerView: 2.2
  Desktop: slidesPerView: 3.2, active card 40% width

Typography:
  Use clamp() on all headings — already set up in tailwind.config.js
  Minimum: never below 1.5rem for h1/h2

Section padding:
  Mobile:   py-16 (64px)
  Desktop:  py-32 (128px) to py-40 (160px)

3D Canvas:
  Mobile: Reduce particle count by 50%, skip complex geometry
  Desktop: Full quality
```

---

## 11. PERFORMANCE

### Three.js
- Cap FPS at 60 (requestAnimationFrame already does this)
- Set `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` — already done
- Dispose geometry/material/renderer on unmount — already done
- For FooterCanvas: cap at 30fps

### GSAP
- Use `gsap.context()` for cleanup — already done in HeroSection
- Set `once: true` on all ScrollTrigger animations (don't re-trigger on scroll back up)
- Register plugins once in `src/lib/animations.js` — do not re-register in components

### General
- `will-change: transform` only on actively animating elements
- `pointer-events: none` on all canvas/overlay elements
- Lazy load Swiper.js: `import('swiper/react')` (dynamic import if needed)
- Reduce motion: wrap GSAP animations with `window.matchMedia('(prefers-reduced-motion: reduce)').matches`

---

## 12. BUILD ORDER

Execute in this sequence to minimize rework:

```
Phase 1 — Foundation (no visible change, but required for everything)
  [ ] 1. Add Azeret Mono font import
  [ ] 2. Add --easing, --electric-teal, --infrared, --rich-carbon to CSS variables
  [ ] 3. Add @keyframes grain to index.css
  [ ] 4. Install Splitting.js: yarn add splitting
  [ ] 5. Install Swiper.js: yarn add swiper
  [ ] 6. Add animateTextReveal, animateStaggerIn to animations.js

Phase 2 — High-Impact Visual Changes
  [ ] 7.  GrainOverlay.jsx → mount in App.js (10 min, huge visual uplift)
  [ ] 8.  Preloader.jsx → mount in App.js (30 min)
  [ ] 9.  Navbar scroll background + underline animation (20 min)
  [ ] 10. Update ParticleCanvas: add wireframe torus overlay (20 min)
  [ ] 11. Hero title split-direction animation update (15 min)

Phase 3 — Section Upgrades
  [ ] 12. useTextReveal hook + apply to all section headings (45 min)
  [ ] 13. Pain Points: add scroll stagger, card numbers (20 min)
  [ ] 14. Results: switch to numbered cards (01/02/03) (30 min)
  [ ] 15. Why Me: add Swiper.js carousel + 3D card tilt (60 min)
  [ ] 16. Process: add connecting line animation (20 min)
  [ ] 17. FAQ: active fade behavior (15 min)

Phase 4 — Polish
  [ ] 18. FooterCanvas.jsx + Footer update (45 min)
  [ ] 19. Magnetic CTA button (20 min)
  [ ] 20. Custom cursor (optional, 30 min)
  [ ] 21. Scroll progress indicator (10 min)
  [ ] 22. Responsive audit (60 min)

Phase 5 — QA
  [ ] 23. Test all scroll animations
  [ ] 24. Test prefers-reduced-motion
  [ ] 25. Test mobile breakpoints
  [ ] 26. Performance audit (Lighthouse)
```

---

## APPENDIX: WQF vs. This Project — Mapping

| WQF Section | This Project Equivalent | Status |
|-------------|-------------------------|--------|
| Hero (3D + title) | HeroSection.jsx + ParticleCanvas.jsx | Built, needs polish |
| Our Ethos (4 cards) | PainPointsSection.jsx | Built, needs numbers + stagger |
| Our Focus (accordion) | SolutionSection.jsx | Different layout (bento) — keep |
| Portfolio (carousel) | WhyMeSection.jsx | Needs Swiper.js rebuild |
| Leadership (carousel) | ProcessSection.jsx or new | Needs Swiper.js |
| For Investors (numbered) | ResultsSection.jsx | Needs numbered card redesign |
| For Founders (numbered) | WhyMeSection.jsx | Overlap — combine |
| CTA Section | Footer.jsx (top CTA band) | Needs magnetic button |
| Footer (canvas + grid) | Footer.jsx | Needs FooterCanvas + infrared bg |
| Preloader | — | Not built yet |
| Film Grain | — | Not built yet |
| Custom Cursor | — | Not built yet (optional) |
