import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations";

export default function Preloader({ onComplete }) {
  const wrapRef = useRef(null);
  const nameRef = useRef(null);
  const lineRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Fade name in
    tl.to(nameRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.2)
      // Line fills left→right
      .to(lineRef.current, { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, 0.4)
      // Counter counts 0→100
      .to(counterRef.current, {
        innerText: 100,
        duration: 1.2,
        ease: "power2.out",
        snap: { innerText: 1 },
        onUpdate() {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(
              gsap.getProperty(counterRef.current, "innerText")
            ) + " %";
          }
        },
      }, 0.4)
      // Exit: overlay slides up
      .to(nameRef.current, { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" }, "+=0.3")
      .to(wrapRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () => {
          if (wrapRef.current) wrapRef.current.style.display = "none";
          onComplete?.();
        },
      }, "-=0.2");
  }, [onComplete]);

  return (
    <div className="preloader" ref={wrapRef}>
      <p ref={nameRef} className="preloader-name" style={{ opacity: 0, transform: "translateY(20px)" }}>
        Aryan TN
      </p>
      <div className="preloader-line">
        <div ref={lineRef} className="preloader-line-fill" style={{ transform: "scaleX(0)" }} />
      </div>
      <span ref={counterRef} className="preloader-counter">0 %</span>
    </div>
  );
}
