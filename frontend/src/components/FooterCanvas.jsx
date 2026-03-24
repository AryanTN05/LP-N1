import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FooterCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 1, 3000);
    camera.position.z = 800;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const R = 260;

    // ── Latitude lines (reduced segments) ───────────────────────
    const latLines = [];
    const latCount = 10; // Reduced from 14
    for (let i = 1; i < latCount; i++) {
      const phi = (i / latCount) * Math.PI;
      const r = R * Math.sin(phi);
      const y = R * Math.cos(phi);
      const segments = 48; // Reduced from 80
      const pts = [];
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0x5c939f,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      latLines.push({ line, geo, mat });
    }

    // ── Longitude lines (reduced) ───────────────────────────────
    const lngLines = [];
    const lngCount = 12; // Reduced from 18
    for (let i = 0; i < lngCount; i++) {
      const theta = (i / lngCount) * Math.PI * 2;
      const segments = 48; // Reduced from 80
      const pts = [];
      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI;
        pts.push(new THREE.Vector3(
          R * Math.sin(phi) * Math.cos(theta),
          R * Math.cos(phi),
          R * Math.sin(phi) * Math.sin(theta)
        ));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0x5c939f,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      lngLines.push({ line, geo, mat });
    }

    // ── Surface particles ───────────────────────────────────────
    const ptCount = 1800; // Reduced from 2800
    const positions = new Float32Array(ptCount * 3);
    const colors = new Float32Array(ptCount * 3);

    for (let i = 0; i < ptCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / ptCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const noise = 0.92 + Math.random() * 0.16;
      const r = R * noise;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const roll = Math.random();
      const b = 0.4 + Math.random() * 0.5;
      if (roll < 0.09) {
        colors[i * 3] = 0.36 * b;
        colors[i * 3 + 1] = 0.58 * b;
        colors[i * 3 + 2] = 0.62 * b;
      } else {
        colors[i * 3] = b;
        colors[i * 3 + 1] = b;
        colors[i * 3 + 2] = b;
      }
    }

    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    ptGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const ptMat = new THREE.PointsMaterial({
      size: 2.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const globe = new THREE.Points(ptGeo, ptMat);

    // ── Wake particles ──────────────────────────────────────────
    const wakeCount = 500; // Reduced from 900
    const wakePos = new Float32Array(wakeCount * 3);
    for (let i = 0; i < wakeCount; i++) {
      const t = i / wakeCount;
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const r = R * 0.9 + t * 260;
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
      opacity: 0.18,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const wake = new THREE.Points(wakeGeo, wakeMat);

    // ── Group ───────────────────────────────────────────────────
    const group = new THREE.Group();
    latLines.forEach(({ line }) => group.add(line));
    lngLines.forEach(({ line }) => group.add(line));
    group.add(globe);
    group.add(wake);
    scene.add(group);

    // ── Mouse ───────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    const handleMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    // ── Animation (throttled) ───────────────────────────────────
    let raf;
    let lastFrame = 0;
    const clock = new THREE.Clock();
    let rotX = 0, rotY = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const now = clock.getElapsedTime();
      if (now - lastFrame < 0.033) return; // ~30fps cap (footer is less critical)
      lastFrame = now;

      const targetRotY = now * 0.06 + mouseX * 0.5;
      const targetRotX = mouseY * 0.3;
      rotY += (targetRotY - rotY) * 0.04;
      rotX += (targetRotX - rotX) * 0.04;

      group.rotation.y = rotY;
      group.rotation.x = rotX;

      camera.position.x += (mouseX * 60 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 50 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

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
      latLines.forEach(({ geo, mat }) => { geo.dispose(); mat.dispose(); });
      lngLines.forEach(({ geo, mat }) => { geo.dispose(); mat.dispose(); });
      ptGeo.dispose(); ptMat.dispose();
      wakeGeo.dispose(); wakeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="footer-canvas-wrap">
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
