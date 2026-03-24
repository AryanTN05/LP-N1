import { useEffect, useRef } from "react";
import { isSafari, safariCount } from "@/lib/safari";

/**
 * Constellation network for dark sections.
 * Pure 2D canvas with spatial grid.
 */
export default function DarkFieldCanvas({ particleCount, opacityMultiplier = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio, isSafari ? 1 : 1.5);

    let W, H;
    let cachedRect = null;

    const resize = () => {
      const parent = canvas.parentElement;
      W = parent ? parent.offsetWidth : window.innerWidth;
      H = parent ? parent.offsetHeight : window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cachedRect = null;
    };
    resize();

    // ── Particles (reduced for Safari) ──────────────────────────
    const defaultCount = Math.min(90, Math.round((W * H) / 16000));
    const baseCount = particleCount || defaultCount;
    const COUNT = isSafari ? Math.round(baseCount * 0.6) : baseCount;
    const CONNECTION_DIST = 160;
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
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
        phase: Math.random() * Math.PI * 2,
      });
    }

    // ── Spatial grid ────────────────────────────────────────────
    const CELL_SIZE = CONNECTION_DIST;
    let gridCols, gridRows, grid;

    const buildGrid = () => {
      gridCols = Math.ceil(W / CELL_SIZE) + 1;
      gridRows = Math.ceil(H / CELL_SIZE) + 1;
      grid = new Array(gridCols * gridRows);
    };
    buildGrid();

    const clearGrid = () => {
      for (let i = 0; i < grid.length; i++) grid[i] = null;
    };

    const insertGrid = (idx, x, y) => {
      const col = (x / CELL_SIZE) | 0;
      const row = (y / CELL_SIZE) | 0;
      if (col < 0 || col >= gridCols || row < 0 || row >= gridRows) return;
      const key = row * gridCols + col;
      grid[key] = { idx, next: grid[key] };
    };

    // ── Mouse ───────────────────────────────────────────────────
    let mouseX = -9999, mouseY = -9999;
    const MOUSE_RADIUS = 200;
    const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;

    const handleMouse = (e) => {
      if (!cachedRect) cachedRect = canvas.getBoundingClientRect();
      mouseX = e.clientX - cachedRect.left;
      mouseY = e.clientY - cachedRect.top;
    };
    const handleLeave = () => { mouseX = -9999; mouseY = -9999; };
    const handleScroll = () => { cachedRect = null; };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── Animation (throttled for Safari) ────────────────────────
    let raf;
    let lastFrame = 0;
    const THROTTLE = isSafari ? 33 : 0; // Safari: ~30fps

    const draw = (timestamp) => {
      raf = requestAnimationFrame(draw);

      if (THROTTLE > 0 && timestamp - lastFrame < THROTTLE) return;
      lastFrame = timestamp;

      const t = timestamp * 0.001;
      ctx.clearRect(0, 0, W, H);

      clearGrid();
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;
        insertGrid(i, p.x, p.y);
      }

      // Connections
      ctx.lineWidth = 0.6;
      for (let i = 0; i < COUNT; i++) {
        const a = particles[i];
        const col = (a.x / CELL_SIZE) | 0;
        const row = (a.y / CELL_SIZE) | 0;

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr < 0 || nr >= gridRows || nc < 0 || nc >= gridCols) continue;

            let node = grid[nr * gridCols + nc];
            while (node) {
              const j = node.idx;
              if (j > i) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < CONNECTION_DIST_SQ) {
                  const dist = Math.sqrt(distSq);
                  let lineAlpha = (1 - dist / CONNECTION_DIST) * 0.25 * opacityMultiplier;

                  const midX = (a.x + b.x) * 0.5;
                  const midY = (a.y + b.y) * 0.5;
                  const mDx = midX - mouseX;
                  const mDy = midY - mouseY;
                  const mDistSq = mDx * mDx + mDy * mDy;
                  if (mDistSq < MOUSE_RADIUS_SQ) {
                    lineAlpha += (1 - Math.sqrt(mDistSq) / MOUSE_RADIUS) * 0.15;
                  }

                  ctx.beginPath();
                  ctx.moveTo(a.x, a.y);
                  ctx.lineTo(b.x, b.y);
                  ctx.strokeStyle = `rgba(92,147,159,${lineAlpha.toFixed(3)})`;
                  ctx.stroke();
                }
              }
              node = node.next;
            }
          }
        }
      }

      // Dots
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        const breathe = Math.sin(t * 0.8 + p.phase) * 0.1;
        const alpha = p.alpha + breathe;

        let glow = 0;
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < MOUSE_RADIUS_SQ) {
          glow = (1 - Math.sqrt(distSq) / MOUSE_RADIUS) * 0.5;
        }

        const finalAlpha = Math.min(1, (alpha * 0.8 + glow) * opacityMultiplier);
        const r = glow > 0.1 ? Math.round(92 + glow * 163) : 92;
        const g = glow > 0.1 ? Math.round(147 + glow * 108) : 147;
        const b = glow > 0.1 ? Math.round(159 + glow * 96) : 159;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + glow * 1.5, 0, 6.2832);
        ctx.fillStyle = `rgba(${r},${g},${b},${finalAlpha.toFixed(2)})`;
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(draw);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        buildGrid();
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
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
