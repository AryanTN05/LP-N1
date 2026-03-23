import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene — no fog, sphere is the focal point
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 4000);
    camera.position.z = 950;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Sphere particle system (WQF style) ────────────────────────────
    const sphereCount = 3000;
    const wakeCount   = 1400;
    const total       = sphereCount + wakeCount;

    const positions = new Float32Array(total * 3);
    const colors    = new Float32Array(total * 3);

    const R = 300; // sphere radius

    // Core sphere — Fibonacci golden-angle distribution
    for (let i = 0; i < sphereCount; i++) {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / sphereCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const noise = 0.88 + Math.random() * 0.24;
      const r = R * noise;

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // White → light gray, occasional teal hint
      const roll = Math.random();
      const b = 0.45 + Math.random() * 0.55;
      if (roll < 0.08) {
        colors[i * 3]     = 0.36 * b;
        colors[i * 3 + 1] = 0.58 * b;
        colors[i * 3 + 2] = 0.62 * b; // teal tint
      } else {
        colors[i * 3]     = b;
        colors[i * 3 + 1] = b;
        colors[i * 3 + 2] = b;
      }
    }

    // Wake / scattered particles extending outward
    for (let i = sphereCount; i < total; i++) {
      const t    = (i - sphereCount) / wakeCount;
      const phi  = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const r = R * 0.85 + t * 500;

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi);

      const b = (1 - t) * 0.28;
      colors[i * 3]     = b;
      colors[i * 3 + 1] = b;
      colors[i * 3 + 2] = b * 1.15; // slight cool tint
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sphere = new THREE.Points(geometry, material);
    scene.add(sphere);

    // ── Mouse tracking ─────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    const handleMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse);

    // ── Animation loop ─────────────────────────────────────────────────
    let raf;
    const clock = new THREE.Clock();
    let rotX = 0, rotY = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Target rotation: gentle auto-spin + strong mouse influence
      const targetRotY = t * 0.05 + mouseX * 0.55;
      const targetRotX = mouseY * 0.35;

      rotY += (targetRotY - rotY) * 0.035;
      rotX += (targetRotX - rotX) * 0.035;

      sphere.rotation.y = rotY;
      sphere.rotation.x = rotX;

      // Camera drift for parallax depth
      camera.position.x += (mouseX * 100 - camera.position.x) * 0.045;
      camera.position.y += (-mouseY * 80  - camera.position.y) * 0.045;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ─────────────────────────────────────────────────────────
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-0"
      style={{ willChange: "transform", pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
