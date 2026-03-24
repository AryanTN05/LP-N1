import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { isSafari } from "@/lib/safari";

gsap.registerPlugin(ScrollTrigger);

let lenis;
let lenisTicker;

export function initSmoothScroll() {
  // Safari: skip Lenis entirely — it fights with WebKit's native scroll
  // and causes jank with ScrollTrigger. Native scroll works fine.
  if (isSafari) {
    // Just ensure ScrollTrigger updates on native scroll
    ScrollTrigger.defaults({ scroller: window });
    ScrollTrigger.refresh();
    return null;
  }

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  lenisTicker = (time) => {
    if (lenis) lenis.raf(time * 1000);
  };
  gsap.ticker.add(lenisTicker);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroySmoothScroll() {
  if (lenisTicker) {
    gsap.ticker.remove(lenisTicker);
    lenisTicker = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

/* Staggered fade-in-up for children */
export function animateStaggerIn(containerSelector, childSelector = "> *") {
  gsap.fromTo(
    `${containerSelector} ${childSelector}`,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerSelector,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    }
  );
}

/* Simple fade-in-up on scroll */
export function animateFadeInUp(selector) {
  gsap.fromTo(
    selector,
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: selector,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    }
  );
}

/* Parallax float */
export function animateParallax(selector, speed = 50) {
  gsap.to(selector, {
    y: speed,
    ease: "none",
    scrollTrigger: {
      trigger: selector,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

/**
 * Split element text into word spans and animate them up on scroll.
 * Mutates the element's innerHTML — call once on mount.
 */
export function animateTextReveal(element, options = {}) {
  if (!element) return;
  const raw = element.innerText;
  element.innerHTML = "";
  raw.split(" ").forEach((word, i) => {
    if (i > 0) element.appendChild(document.createTextNode("\u00A0"));
    const mask = document.createElement("span");
    mask.className = "word-mask";
    const inner = document.createElement("span");
    inner.className = "split-word";
    inner.textContent = word;
    mask.appendChild(inner);
    element.appendChild(mask);
  });

  const words = element.querySelectorAll(".split-word");
  return gsap.fromTo(
    words,
    { yPercent: 110, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: options.duration || 0.9,
      stagger: options.stagger || 0.04,
      ease: options.ease || "power3.out",
      delay: options.delay || 0,
      scrollTrigger: options.scrollTrigger !== undefined
        ? options.scrollTrigger
        : {
            trigger: element,
            start: "top 82%",
            once: true,
          },
    }
  );
}

/**
 * Animate a line growing from scaleX 0 → 1 (left to right).
 */
export function animateLineDraw(element, options = {}) {
  if (!element) return;
  return gsap.fromTo(
    element,
    { scaleX: 0, transformOrigin: "left center" },
    {
      scaleX: 1,
      duration: options.duration || 1.2,
      ease: "power3.inOut",
      scrollTrigger: options.scrollTrigger !== undefined
        ? options.scrollTrigger
        : {
            trigger: element,
            start: "top 85%",
            once: true,
          },
    }
  );
}

export { gsap, ScrollTrigger };
