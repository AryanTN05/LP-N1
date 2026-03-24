import { useEffect, useRef } from "react";

/**
 * Constellation network background for dark sections (Process + FAQ).
 * Slowly drifting particles with faint teal connection lines.
 * Pure 2D canvas for smooth 60fps.
 */
export default function DarkFieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio, 2);

    let W, H;

    const resize = () => {
      const parent = canvas.parentElement;
      W = parent ? parent.offsetWidth : window.innerWidth;
      H = parent ? parent.offsetHeight : window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ── Particles ──────────────────────────────────────────────────
    const COUNT = Math.min(120, Math.round((W * H) / 12000));
    const CONNECTION_DIST = 160;
    const particles = [];

    for (let i = 0; i < COUNT; i++) {
      const speed = 0.15 + Math.random() * 0.3;
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.2 + Math.random() * 1.2,
        alpha: 0.3 + Math.random() * 0.4,
        // For subtle breathing
        phase: Math.random() * Math.PI * 2,
      });
    }

    // ── Mouse ──────────────────────────────────────────────────────
    let mouseX = -9999;
    let mouseY = -9999;
    const MOUSE_RADIUS = 200;

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const handleLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("mouseleave", handleLeave);

    // ── Animation ──────────────────────────────────────────────────
    let raf;

    const draw = (timestamp) => {
      raf = requestAnimationFrame(draw);
      const t = timestamp * 0.001;

      ctx.clearRect(0, 0, W, H);

      // Update positions
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges with padding
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;
      }

      // Draw connections first (behind dots)
      for (let i = 0; i < COUNT; i++) {
        const a = particles[i];
        for (let j = i + 1; j < COUNT; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.25;

            // Brighter lines near mouse
            let mouseBrightness = 0;
            const midX = (a.x + b.x) * 0.5;
            const midY = (a.y + b.y) * 0.5;
            const mDx = midX - mouseX;
            const mDy = midY - mouseY;
            const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
            if (mDist < MOUSE_RADIUS) {
              mouseBrightness = (1 - mDist / MOUSE_RADIUS) * 0.15;
            }

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(92,147,159,${(lineAlpha + mouseBrightness).toFixed(4)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];

        // Subtle breathing
        const breathe = Math.sin(t * 0.8 + p.phase) * 0.1;
        const alpha = p.alpha + breathe;

        // Glow near mouse
        let glow = 0;
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          glow = (1 - dist / MOUSE_RADIUS) * 0.5;
        }

        const finalAlpha = Math.min(1, alpha * 0.8 + glow);

        // Teal-tinted dots, whiter near mouse
        const r = glow > 0.1 ? Math.round(92 + glow * 163) : 92;
        const g = glow > 0.1 ? Math.round(147 + glow * 108) : 147;
        const b = glow > 0.1 ? Math.round(159 + glow * 96) : 159;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + glow * 1.5, 0, 6.2832);
        ctx.fillStyle = `rgba(${r},${g},${b},${finalAlpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(draw);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        // Redistribute particles on resize
        for (let i = 0; i < COUNT; i++) {
          particles[i].x = Math.random() * W;
          particles[i].y = Math.random() * H;
        }
      }, 100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
