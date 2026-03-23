import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/animations";

export default function ParticleCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 4000);
    // Move camera further back to ensure depth stays intact behind texts
    camera.position.z = 1200;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Build Network Sphere ───────────────────────────────────────
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const RADIUS = 500; 
    const COUNT = 1200; // Increased density
    const MAX_CONN_DIST = 90;

    const points = [];
    const positions = new Float32Array(COUNT * 3);
    const scatterTargets = new Float32Array(COUNT * 3);
    const customColors = new Float32Array(COUNT * 3);
    const roles = new Float32Array(COUNT);
    const extractStarts = new Float32Array(COUNT);

    // 1. Generate random points
    for (let i = 0; i < COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const x = RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = RADIUS * Math.cos(phi);
      
      points.push(new THREE.Vector3(x, y, z));
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // ALL dots are standard teal variations
      const b = 0.5 + Math.random() * 0.5;
      customColors[i * 3]     = 0.36 * b; // #5c939f base
      customColors[i * 3 + 1] = 0.57 * b;
      customColors[i * 3 + 2] = 0.62 * b;

      if (i === 0) {
        roles[i] = 0.0; // The Final Surviving Client
        extractStarts[i] = 0.0; // Constantly travels
        // Center screen
        scatterTargets[i * 3] = 0; 
        scatterTargets[i * 3 + 1] = 0;   
        scatterTargets[i * 3 + 2] = 250; // Pop aggressively forward
      } else if (i === 1) {
        roles[i] = 1.0; // Lead 1 (Left)
        extractStarts[i] = 0.1;
        scatterTargets[i * 3] = -250;
        scatterTargets[i * 3 + 1] = 150;
        scatterTargets[i * 3 + 2] = 0;
      } else if (i === 2) {
        roles[i] = 2.0; // Lead 2 (Top)
        extractStarts[i] = 0.25;
        scatterTargets[i * 3] = 0;
        scatterTargets[i * 3 + 1] = 300;
        scatterTargets[i * 3 + 2] = 0;
      } else if (i === 3) {
        roles[i] = 3.0; // Lead 3 (Right)
        extractStarts[i] = 0.4;
        scatterTargets[i * 3] = 250;
        scatterTargets[i * 3 + 1] = 150;
        scatterTargets[i * 3 + 2] = 0;
      } else {
        roles[i] = 4.0; // Irrelevant leads (Scattering)
        extractStarts[i] = 0.0;
        
        // Explode/scatter massively outward
        const explodeDist = 1500 + Math.random() * 2000;
        scatterTargets[i * 3]     = x * (explodeDist / RADIUS) + (Math.random() - 0.5) * 500;
        scatterTargets[i * 3 + 1] = y * (explodeDist / RADIUS) + (Math.random() - 0.5) * 500;
        scatterTargets[i * 3 + 2] = z * (explodeDist / RADIUS) + (Math.random() - 0.5) * 500;
      }
    }

    // Make the final client start facing the viewer manually for better initial look
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = RADIUS;
    points[0].set(0, 0, RADIUS);

    // 2. Generate connections (lines) between close points
    const linePairs = [];
    const linePositions = [];
    // We do NOT draw lines connected to the Main Client or the 3 Leads originally 
    // to prevent stretching giant umbilical cords across the screen while they travel
    const validPointIds = new Set();
    for (let i = 4; i < COUNT; i++) validPointIds.add(i);

    for (let i = 4; i < COUNT; i++) {
      let connections = 0;
      for (let j = i + 1; j < COUNT; j++) {
        const dist = points[i].distanceTo(points[j]);
        if (dist < MAX_CONN_DIST && connections < 4) {
          linePairs.push({ a: i, b: j });
          linePositions.push(
            positions[i*3], positions[i*3+1], positions[i*3+2],
            positions[j*3], positions[j*3+1], positions[j*3+2]
          );
          connections++;
        }
      }
    }

    // Pass the scatter target of each point connected by the line
    const lineScatterTargets = new Float32Array(linePairs.length * 6);
    
    for(let k=0; k < linePairs.length; k++) {
      const {a, b} = linePairs[k];
      
      lineScatterTargets[k*6]   = scatterTargets[a*3];
      lineScatterTargets[k*6+1] = scatterTargets[a*3+1];
      lineScatterTargets[k*6+2] = scatterTargets[a*3+2];
      lineScatterTargets[k*6+3] = scatterTargets[b*3];
      lineScatterTargets[k*6+4] = scatterTargets[b*3+1];
      lineScatterTargets[k*6+5] = scatterTargets[b*3+2];
    }

    // ── Create Custom GPU Shaders ───────────────────────────────────────
    
    // POINT SHADER
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute("scatterTarget", new THREE.BufferAttribute(scatterTargets, 3));
    pointGeo.setAttribute("customColor", new THREE.BufferAttribute(customColors, 3));
    pointGeo.setAttribute("role", new THREE.BufferAttribute(roles, 1));
    pointGeo.setAttribute("extractStart", new THREE.BufferAttribute(extractStarts, 1));

    const uniforms = {
      uProgress: { value: 0.0 },
      uBaseSize: { value: 35.0 },
      uMouse: { value: new THREE.Vector2(0, 0) }
    };

    const pointMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        attribute vec3 scatterTarget;
        attribute float role;
        attribute float extractStart;
        attribute vec3 customColor;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uProgress;
        uniform float uBaseSize;
        uniform vec2 uMouse;

        void main() {
          vColor = customColor;
          
          vec3 currentPos = position;
          float alpha = 1.0;
          float sizeMult = 1.0;

          if (role == 0.0) {
              // CLIENT: Travels to center gracefully
              float p = smoothstep(0.0, 1.0, uProgress);
              currentPos = mix(position, scatterTarget, p);
              
              if (uProgress > 0.8) {
                 // Final flare when leads hit (MASSIVE POPUP)
                 float p2 = smoothstep(0.8, 1.0, uProgress);
                 sizeMult = 2.5 + (p2 * p2 * 15.0); // Huge explosion
                 alpha = 1.0;
              } else {
                 sizeMult = 2.5; 
                 alpha = 0.5; // Dim waiting for data
              }
          } 
          else if (role >= 1.0 && role <= 3.0) {
              // 3 LEADS: Extract in sequence from globe out to holding spots
              float p = smoothstep(extractStart, extractStart + 0.35, uProgress);
              currentPos = mix(position, scatterTarget, p);
              
              // Second stage: Converge to client dot at the end!
              if (uProgress > 0.75) {
                  float mergeP = smoothstep(0.75, 0.95, uProgress);
                  currentPos = mix(currentPos, vec3(0.0, 0.0, 250.0), mergeP);
                  // Fade out as they merge directly into client
                  alpha = 1.0 - smoothstep(0.85, 0.95, uProgress);
              }
              
              sizeMult = 1.5 + p * 3.5; 
          }
          else {
              // REJECTED LEADS: Explode out & fade
              float shoot = uProgress * uProgress; 
              currentPos = mix(position, scatterTarget, shoot);
              
              alpha = 1.0 - shoot;
              sizeMult = 1.0 + (shoot * 3.0); 
          }
          
          vAlpha = alpha;

          vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
          
          gl_PointSize = uBaseSize * sizeMult * alpha * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          if (vAlpha <= 0.01) discard;
          
          // Create a soft circle
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          
          // Soft glow
          float glow = (0.5 - ll) * 2.0;
          gl_FragColor = vec4(vColor * glow, vAlpha * glow);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointMesh = new THREE.Points(pointGeo, pointMat);
    sphereGroup.add(pointMesh);

    // LINE SHADER (connects scattering points cleanly until they fade out)
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("scatterTarget", new THREE.BufferAttribute(lineScatterTargets, 3));
    
    // Standard connection lines (for scattering rejected leads)
    const lineUniforms = {
      uProgress: { value: 0.0 },
      uColor: { value: new THREE.Color(0x5c939f) }
    };

    const lineMat = new THREE.ShaderMaterial({
      uniforms: lineUniforms,
      vertexShader: `
        attribute vec3 scatterTarget;
        varying float vAlpha;
        uniform float uProgress;

        void main() {
          vec3 currentPos = position;
          float alpha = 0.35; // Base brightness
          
          float shoot = uProgress * uProgress;
          currentPos = mix(position, scatterTarget, shoot);
          alpha = 0.35 * (1.0 - shoot);

          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(currentPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          if (vAlpha <= 0.01) discard;
          gl_FragColor = vec4(uColor, vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    sphereGroup.add(lineMesh);

    // DYNAMIC CONNECTION LINES (Beams from Leads to Client at the end)
    const mainBeamsGeo = new THREE.BufferGeometry();
    const beamPositions = [];
    
    // WebGL wireframes are max 1px wide. We simulate a bolder, thicker beam 
    // by drawing multiple overlapping lines with tiny sub-pixel offsets.
    const offsets = [
        [0,0,0], [1,1,0], [-1,-1,0], [1,-1,0], [-1,1,0],
        [2,0,0], [-2,0,0], [0,2,0], [0,-2,0], [3,0,0], [-3,0,0], [0,3,0], [0,-3,0]
    ];
    
    for (const off of offsets) {
      beamPositions.push(
         // Lead 1 to Client
         scatterTargets[1*3] + off[0], scatterTargets[1*3+1] + off[1], scatterTargets[1*3+2] + off[2],
         0 + off[0], off[1], 250 + off[2],
         // Lead 2 to Client
         scatterTargets[2*3] + off[0], scatterTargets[2*3+1] + off[1], scatterTargets[2*3+2] + off[2],
         0 + off[0], off[1], 250 + off[2],
         // Lead 3 to Client
         scatterTargets[3*3] + off[0], scatterTargets[3*3+1] + off[1], scatterTargets[3*3+2] + off[2],
         0 + off[0], off[1], 250 + off[2]
      );
    }
    
    const beamPositionsArray = new Float32Array(beamPositions);
    mainBeamsGeo.setAttribute("position", new THREE.BufferAttribute(beamPositionsArray, 3));

    const mainBeamsMat = new THREE.ShaderMaterial({
      uniforms: {
         uProgress: { value: 0.0 },
         uColor: { value: new THREE.Color(0xffffff) }
      },
      vertexShader: `
        uniform float uProgress;
        varying float vAlpha;
        void main() {
           // Wait until uProgress > 0.75 when Leads are fully extracted
           // Display the beam until uProgress 0.95 when they merge
           float alpha = 0.0;
           if (uProgress > 0.75 && uProgress < 0.95) {
               alpha = smoothstep(0.75, 0.85, uProgress) * smoothstep(0.95, 0.9, uProgress);
               alpha *= 1.2; // Extra brightness multiplier for boldness
           }
           vAlpha = alpha;
           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
           if (vAlpha <= 0.01) discard;
           gl_FragColor = vec4(uColor, vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const mainBeams = new THREE.LineSegments(mainBeamsGeo, mainBeamsMat);
    sphereGroup.add(mainBeams);


    // Position globe in the center, deep behind texts
    sphereGroup.position.set(0, 0, -300);

    // ── Scroll Animation Logistics ────────────────────────────────
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
        }
      });
      // Camera is static now, all zooming/animating is natively embedded in shader logic.
    }

    // ── Mouse Parallax ──────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener("mousemove", handleMouseMove);

    // ── Animate ──────────────────────────────────────────────────────
    let raf;
    let baseRotationY = 0;
    
    const animate = () => {
      raf = requestAnimationFrame(animate);

      const p = scrollData.progress;
      
      // Sync scroll progress and mouse coordinates to GPU
      uniforms.uProgress.value = p;
      
      lineUniforms.uProgress.value = p;
      mainBeamsMat.uniforms.uProgress.value = p;

      // Decrease rotation speed significantly as they explode out
      const rotationSpeed = 0.001 * (1.0 - p); 
      baseRotationY -= rotationSpeed;

      // Smooth mouse parallax tilt (dampens out as scroll happens)
      target.x = mouse.x * 0.15 * (1.0 - p); 
      target.y = mouse.y * 0.15 * (1.0 - p);
      
      sphereGroup.rotation.y += (baseRotationY + target.x - sphereGroup.rotation.y) * 0.05;
      sphereGroup.rotation.x += (-target.y - sphereGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ───────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      pointGeo.dispose();
      pointMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      mainBeamsGeo.dispose();
      mainBeamsMat.dispose();
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
