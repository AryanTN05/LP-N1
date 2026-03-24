import { useEffect, useRef } from "react";

/**
 * Dot-sphere field for light sections.
 * Dots distributed on a 3D sphere, projected to 2D with slow rotation.
 * Pure 2D canvas — no Three.js.
 */
export default function LightTunnelCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio, 1.5); // Cap at 1.5 for perf

    let W, H, centerX, centerY, RADIUS;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      centerX = W * 0.5;
      centerY = H * 0.5;
      RADIUS = Math.max(W, H) * 0.52;
    };
    resize();

    // ── Sphere dots (Fibonacci) — use typed arrays for speed ───
    const COUNT = 1400; // Reduced from 2200
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    const sx = new Float32Array(COUNT);
    const sy = new Float32Array(COUNT);
    const sz = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);
    const alphas = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const yVal = 1 - (i / (COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - yVal * yVal);
      const theta = goldenAngle * i;

      sx[i] = Math.cos(theta) * radiusAtY;
      sy[i] = yVal;
      sz[i] = Math.sin(theta) * radiusAtY;
      sizes[i] = 1.2 + Math.random() * 1.6;
      alphas[i] = 0.22 + Math.random() * 0.28;
    }

    // ── Mouse ──────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    let currentRotX = 0, currentRotY = 0;

    const handleMouse = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    // ── Animation ──────────────────────────────────────────────
    let raf;
    // Pre-allocate fillStyle string (avoid GC pressure from template literals)
    const fillPrefix = "rgba(90,90,90,";

    const draw = (timestamp) => {
      raf = requestAnimationFrame(draw);

      const t = timestamp * 0.001;
      const autoAngle = t * 0.06;

      // Mouse tilt
      const targetRotY = ((mouseX - centerX) / W) * 0.4;
      const targetRotX = ((mouseY - centerY) / H) * -0.3;
      currentRotX += (targetRotX - currentRotX) * 0.03;
      currentRotY += (targetRotY - currentRotY) * 0.03;

      const rotY = autoAngle + currentRotY;
      const rotXVal = currentRotX;

      const sinRY = Math.sin(rotY);
      const cosRY = Math.cos(rotY);
      const sinRX = Math.sin(rotXVal);
      const cosRX = Math.cos(rotXVal);

      ctx.clearRect(0, 0, W, H);

      // Batch all dots into a single path per alpha bucket for fewer draw calls
      // Simple approach: just draw with minimal overhead
      for (let i = 0; i < COUNT; i++) {
        const x = sx[i] * cosRY + sz[i] * sinRY;
        const y2 = sy[i] * cosRX - (-sx[i] * sinRY + sz[i] * cosRY) * sinRX;
        const z2 = sy[i] * sinRX + (-sx[i] * sinRY + sz[i] * cosRY) * cosRX;

        const depthFade = (z2 + 1) * 0.5;
        if (depthFade < 0.1) continue;

        const alpha = alphas[i] * depthFade * depthFade * 0.5;
        if (alpha < 0.015) continue;

        const px = centerX + x * RADIUS;
        const py = centerY + y2 * RADIUS;
        const size = sizes[i] * (0.6 + depthFade * 0.6);

        ctx.beginPath();
        ctx.arc(px, py, size, 0, 6.2832);
        ctx.fillStyle = fillPrefix + ((alpha * 1000 | 0) / 1000) + ")";
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(draw);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
