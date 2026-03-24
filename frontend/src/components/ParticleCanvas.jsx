import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/animations";
import { isSafari, safariCount, safariThrottle } from "@/lib/safari";

export default function ParticleCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 1, 4000);
    camera.position.z = 1200;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSafari ? 1 : 1.5));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.position.set(0, 0, -300);
    scene.add(group);

    // ── Sphere points (reduced for Safari) ─────────────────────
    const RADIUS = 500;
    const COUNT = safariCount(800, 700, 700);
    const MAX_CONN_DIST = 90;

    // Safari: use NormalBlending (much cheaper than Additive)
    const BLEND = isSafari ? THREE.NormalBlending : THREE.AdditiveBlending;

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const pointVecs = [];

    for (let i = 0; i < COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      const x = RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = RADIUS * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      pointVecs.push(new THREE.Vector3(x, y, z));

      const b = 0.5 + Math.random() * 0.5;
      colors[i * 3] = 0.36 * b;
      colors[i * 3 + 1] = 0.57 * b;
      colors[i * 3 + 2] = 0.62 * b;
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dotGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const dotMat = new THREE.PointsMaterial({
      size: 3.0,
      vertexColors: true,
      transparent: true,
      opacity: isSafari ? 0.95 : 0.85,
      sizeAttenuation: true,
      blending: BLEND,
      depthWrite: false,
    });

    const dots = new THREE.Points(dotGeo, dotMat);
    group.add(dots);

    // ── Connection lines ────────────────────────────────────────
    const linePositions = [];
    for (let i = 0; i < COUNT; i++) {
      let connections = 0;
      for (let j = i + 1; j < COUNT; j++) {
        if (connections >= 3) break;
        const dist = pointVecs[i].distanceTo(pointVecs[j]);
        if (dist < MAX_CONN_DIST) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
          connections++;
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x5c939f,
      transparent: true,
      opacity: isSafari ? 0.25 : 0.18,
      blending: BLEND,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // ── Wake particles ──────────────────────────────────────────
    const wakeCount = safariCount(350, 300, 300);
    const wakePos = new Float32Array(wakeCount * 3);
    for (let i = 0; i < wakeCount; i++) {
      const t = i / wakeCount;
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const r = RADIUS * 0.9 + t * 400;
      wakePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      wakePos[i * 3 + 1] = r * Math.cos(phi);
      wakePos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const wakeGeo = new THREE.BufferGeometry();
    wakeGeo.setAttribute("position", new THREE.BufferAttribute(wakePos, 3));
    const wakeMat = new THREE.PointsMaterial({
      size: 1.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      sizeAttenuation: true,
      blending: BLEND,
      depthWrite: false,
    });
    const wake = new THREE.Points(wakeGeo, wakeMat);
    group.add(wake);

    // ── Single mouse handler ────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    const handleMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    // ── Scroll-driven scatter ───────────────────────────────────
    const scrollData = { progress: 0 };
    const heroSection = container.closest("section");

    if (heroSection) {
      gsap.to(scrollData, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "+=150%",
          scrub: 1,
        },
      });
    }

    // ── Animation loop ──────────────────────────────────────────
    let raf;
    let lastFrame = 0;
    const clock = new THREE.Clock();
    let rotX = 0, rotY = 0;
    const THROTTLE = safariThrottle(0.028, 0.04); // Safari: ~25fps

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const now = clock.getElapsedTime();
      if (now - lastFrame < THROTTLE) return;
      lastFrame = now;

      const p = scrollData.progress;
      const influence = 1 - p;

      // Skip when scrolled away (Safari: skip earlier to save GPU)
      if (p > (isSafari ? 0.8 : 0.95)) return;

      const expand = 1 + p * p * 4;
      group.scale.set(expand, expand, expand);

      const fade = Math.max(0, 1 - p * p * 1.5);
      dotMat.opacity = (isSafari ? 0.95 : 0.85) * fade;
      lineMat.opacity = (isSafari ? 0.25 : 0.18) * fade;
      wakeMat.opacity = 0.15 * fade;

      const targetRotY = now * 0.03 * influence + mouseX * 0.25 * influence;
      const targetRotX = mouseY * 0.15 * influence;
      rotY += (targetRotY - rotY) * 0.04;
      rotX += (targetRotX - rotX) * 0.04;
      group.rotation.y = rotY;
      group.rotation.x = rotX;

      camera.position.x += (mouseX * 60 * influence - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 50 * influence - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      // Skip hover glow entirely on Safari (the GPU→CPU readback kills perf)
      // Chrome/Firefox: run every 2nd frame, sample every 4th particle
      if (!isSafari) {
        const colArr = dotGeo.attributes.color.array;
        const posArr = dotGeo.attributes.position.array;
        const origColors = dotGeo.userData.origColors;
        if (!origColors) {
          dotGeo.userData.origColors = new Float32Array(colArr);
        }
        const orig = dotGeo.userData.origColors;
        const mouseNdcX = (mouseX + 1) * 0.5 * 2 - 1; // already in -1..1 range
        // Simplified: skip the expensive localToWorld projection
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize (debounced) ──────────────────────────────────────
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }, 100);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      dotGeo.dispose(); dotMat.dispose();
      lineGeo.dispose(); lineMat.dispose();
      wakeGeo.dispose(); wakeMat.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 pointer-events-auto"
      aria-hidden="true"
    />
  );
}
