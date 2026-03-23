import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/animations";

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

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Group (like footer) ──────────────────────────────────────────
    const group = new THREE.Group();
    group.position.set(0, 0, -300);
    scene.add(group);

    // ── Generate sphere points (Fibonacci, like footer) ──────────────
    const RADIUS = 500;
    const COUNT = 1200;
    const MAX_CONN_DIST = 90;

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const pointVecs = [];

    // Random distribution (unstructured network, not Fibonacci grid)
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

      // Teal color palette
      const b = 0.5 + Math.random() * 0.5;
      colors[i * 3] = 0.36 * b;
      colors[i * 3 + 1] = 0.57 * b;
      colors[i * 3 + 2] = 0.62 * b;
    }

    // ── Dots (PointsMaterial, like footer) ────────────────────────────
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dotGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const dotMat = new THREE.PointsMaterial({
      size: 3.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const dots = new THREE.Points(dotGeo, dotMat);
    group.add(dots);

    // ── Connection lines (LineBasicMaterial, like footer wireframe) ───
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
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // ── Wake particles (like footer) ─────────────────────────────────
    const wakeCount = 600;
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
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const wake = new THREE.Points(wakeGeo, wakeMat);
    group.add(wake);

    // ── Hover glow — screen-space proximity ─────────────────────────
    const mouseScreen = new THREE.Vector2(9999, 9999);
    const GLOW_SCREEN_RADIUS = 0.15; // NDC units (~15% of screen)
    const GLOW_SCREEN_RADIUS_SQ = GLOW_SCREEN_RADIUS * GLOW_SCREEN_RADIUS;
    const origColors = new Float32Array(colors);
    const tempVec = new THREE.Vector3();

    const handleHoverMove = (e) => {
      mouseScreen.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseScreen.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleHoverMove);

    // ── Scroll-driven scatter animation ──────────────────────────────
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

    // ── Mouse tracking (identical to footer) ─────────────────────────
    let mouseX = 0, mouseY = 0;
    const handleMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse);

    // ── Animation loop (identical structure to footer) ────────────────
    let raf;
    let lastFrame = 0;
    const clock = new THREE.Clock();
    let rotX = 0, rotY = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const now = clock.getElapsedTime();
      // Frame-rate throttle like footer (28ms)
      if (now - lastFrame < 0.028) return;
      lastFrame = now;

      const p = scrollData.progress;
      const influence = 1 - p;

      // ── Scroll: expand entire globe outward + fade ──
      const expand = 1 + p * p * 4; // scale 1x → 5x
      group.scale.set(expand, expand, expand);

      // Fade everything as it expands
      const fade = Math.max(0, 1 - p * p * 1.5);
      dotMat.opacity = 0.85 * fade;
      dotMat.needsUpdate = true;
      lineMat.opacity = 0.18 * fade;
      lineMat.needsUpdate = true;
      wakeMat.opacity = 0.15 * fade;
      wakeMat.needsUpdate = true;

      // ── Rotation + parallax (identical to footer) ──
      const targetRotY = now * 0.03 * influence + mouseX * 0.25 * influence;
      const targetRotX = mouseY * 0.15 * influence;

      rotY += (targetRotY - rotY) * 0.04;
      rotX += (targetRotX - rotX) * 0.04;

      group.rotation.y = rotY;
      group.rotation.x = rotX;

      // Camera drift (like footer)
      camera.position.x += (mouseX * 60 * influence - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 50 * influence - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      // ── Hover glow: project dots to screen, brighten near cursor ──
      const colArr = dotGeo.attributes.color.array;
      const posArr = dotGeo.attributes.position.array;
      let colorChanged = false;

      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;

        // Project dot's world position to NDC
        tempVec.set(posArr[ix], posArr[ix + 1], posArr[ix + 2]);
        dots.localToWorld(tempVec);
        tempVec.project(camera);

        const dx = tempVec.x - mouseScreen.x;
        const dy = tempVec.y - mouseScreen.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < GLOW_SCREEN_RADIUS_SQ) {
          const t = 1 - Math.sqrt(distSq) / GLOW_SCREEN_RADIUS;
          const boost = t * t;
          colArr[ix] = origColors[ix] + (1.0 - origColors[ix]) * boost;
          colArr[ix + 1] = origColors[ix + 1] + (1.0 - origColors[ix + 1]) * boost;
          colArr[ix + 2] = origColors[ix + 2] + (1.0 - origColors[ix + 2]) * boost;
          colorChanged = true;
        } else if (colArr[ix] !== origColors[ix]) {
          colArr[ix] = origColors[ix];
          colArr[ix + 1] = origColors[ix + 1];
          colArr[ix + 2] = origColors[ix + 2];
          colorChanged = true;
        }
      }

      if (colorChanged) dotGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ───────────────────────────────────────────────────────
    const handleResize = () => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleHoverMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      dotGeo.dispose(); dotMat.dispose();
      lineGeo.dispose(); lineMat.dispose();
      wakeGeo.dispose(); wakeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0 pointer-events-auto"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  );
}
