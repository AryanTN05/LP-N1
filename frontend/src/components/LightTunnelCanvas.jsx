import { useEffect, useRef } from "react";

/**
 * Dot-sphere field for the light sections.
 * Dots are distributed on a 3D sphere and projected to 2D with orthographic feel.
 * The sphere rotates slowly — giving the immersive "dots moving in uniform motion" effect.
 * Pure 2D canvas, no Three.js.
 */
export default function LightTunnelCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio, 2);

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
      // Sphere radius — fills most of the viewport
      RADIUS = Math.max(W, H) * 0.52;
    };
    resize();

    // ── Distribute dots on a sphere (Fibonacci) ────────────────────
    const COUNT = 2200;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // Store spherical coords (theta, phi) + base dot properties
    const dots = new Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      dots[i] = {
        // Unit sphere coords
        sx: Math.cos(theta) * radiusAtY,
        sy: y,
        sz: Math.sin(theta) * radiusAtY,
        // Dot visual properties
        baseSize: 1.2 + Math.random() * 1.6,
        baseAlpha: 0.22 + Math.random() * 0.28,
      };
    }

    // ── Mouse tracking ─────────────────────────────────────────────
    let mouseX = centerX;
    let mouseY = centerY;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouse = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    // ── Animation ──────────────────────────────────────────────────
    let raf;
    let autoAngle = 0;

    const draw = (timestamp) => {
      raf = requestAnimationFrame(draw);

      const t = timestamp * 0.001;

      // Auto-rotation (slow, continuous)
      autoAngle = t * 0.06;

      // Mouse influence: tilt the sphere toward cursor
      targetRotY = ((mouseX - centerX) / W) * 0.4;
      targetRotX = ((mouseY - centerY) / H) * -0.3;

      // Smooth lerp
      currentRotX += (targetRotX - currentRotX) * 0.03;
      currentRotY += (targetRotY - currentRotY) * 0.03;

      // Combined rotation angles
      const rotY = autoAngle + currentRotY;
      const rotX = currentRotX;

      // Precompute sin/cos
      const sinRY = Math.sin(rotY);
      const cosRY = Math.cos(rotY);
      const sinRX = Math.sin(rotX);
      const cosRX = Math.cos(rotX);

      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < COUNT; i++) {
        const d = dots[i];

        // Rotate around Y axis
        let x = d.sx * cosRY + d.sz * sinRY;
        let y = d.sy;
        let z = -d.sx * sinRY + d.sz * cosRY;

        // Rotate around X axis
        const y2 = y * cosRX - z * sinRX;
        const z2 = y * sinRX + z * cosRX;

        // z2 is now depth (-1 back, +1 front)
        // Only draw dots on the front hemisphere + a bit of the sides
        // Fade based on depth for the 3D feel
        const depthFade = (z2 + 1) * 0.5; // 0 (back) to 1 (front)
        if (depthFade < 0.08) continue; // Skip dots fully behind

        // Project to screen
        const px = centerX + x * RADIUS;
        const py = centerY + y2 * RADIUS;

        // Size: slightly larger when closer
        const size = d.baseSize * (0.6 + depthFade * 0.6);

        // Alpha: stronger in front, fades toward back
        const alpha = d.baseAlpha * depthFade * depthFade;

        if (alpha < 0.01) continue;

        // Draw
        ctx.beginPath();
        ctx.arc(px, py, size, 0, 6.2832);
        ctx.fillStyle = `rgba(90,90,90,${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(draw);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 80);
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
