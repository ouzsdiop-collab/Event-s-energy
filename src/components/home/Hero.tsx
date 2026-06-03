"use client";

import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import * as THREE from "three";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

// ─── Main Hero ────────────────────────────────────────────────────────────────
export default function Hero() {
  const textControls = useAnimation();
  const fadeControls = useAnimation();

  useEffect(() => {
    textControls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08 + 0.6, duration: 1, ease: [0.2, 0.65, 0.3, 0.9] },
    }));
    fadeControls.start({
      opacity: 1,
      transition: { delay: 1.6, duration: 1 },
    });
  }, [textControls, fadeControls]);

  const line1 = "Salon Ouest Africain";
  const line2 = "Francophone du";

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0a1a0f]">
      {/* Three.js canvas — full background */}
      <EnergyCanvas />

      {/* Dark gradient overlay — left side stronger for readability */}
      <div className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(to right, rgba(10,26,15,0.92) 40%, rgba(10,26,15,0.45) 75%, rgba(10,26,15,0.15) 100%)" }}
      />

      {/* Content */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto px-6 w-full flex items-center py-20">
        <div className="max-w-2xl">
          {/* Edition badge */}
          <motion.div
            custom={0}
            initial={{ opacity: 0, y: 20 }}
            animate={textControls}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-semibold text-white uppercase tracking-widest">1ère Édition — Cotonou 2027</span>
          </motion.div>

          {/* Title */}
          <h1 className="font-heading font-black leading-none mb-2">
            {line1.split("").map((char, i) => (
              <motion.span key={i} custom={i + 1} initial={{ opacity: 0, y: 40 }} animate={textControls}
                className="inline-block text-white text-4xl md:text-5xl lg:text-6xl">
                {char === " " ? " " : char}
              </motion.span>
            ))}
            <br />
            {line2.split("").map((char, i) => (
              <motion.span key={i} custom={line1.length + i + 1} initial={{ opacity: 0, y: 40 }} animate={textControls}
                className="inline-block text-white text-4xl md:text-5xl lg:text-6xl">
                {char === " " ? " " : char}
              </motion.span>
            ))}
            <br />
            <motion.span custom={line1.length + line2.length + 1} initial={{ opacity: 0, y: 40 }} animate={textControls}
              className="inline-block text-4xl md:text-5xl lg:text-6xl text-forest-400">
              Gaz&nbsp;Naturel
            </motion.span>
            {" "}
            <motion.span custom={line1.length + line2.length + 8} initial={{ opacity: 0, y: 40 }} animate={textControls}
              className="inline-block text-4xl md:text-5xl lg:text-6xl text-gold-400">
              2027
            </motion.span>
          </h1>

          {/* Gold underline */}
          <motion.div custom={line1.length + line2.length + 12} initial={{ opacity: 0, scaleX: 0 }} animate={textControls}
            className="w-20 h-1 bg-gold-400 rounded my-5 origin-left" />

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0 }} animate={fadeControls}
            className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
            Construire un marché gazier intégré et accessible dans l&apos;espace UEMOA :
            défis, opportunités et engagements.
          </motion.p>

          {/* Event info chips */}
          <motion.div initial={{ opacity: 0 }} animate={fadeControls} className="flex flex-wrap gap-3 mb-10">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white">
              <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
              3–5 février 2027
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
              Sofitel Cotonou Marina Hotel & Spa
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white">
              <span className="inline-flex w-5 h-3.5 rounded-sm overflow-hidden shrink-0">
                <span className="w-1/3 h-full bg-green-600" /><span className="w-1/3 h-full bg-yellow-400" /><span className="w-1/3 h-full bg-red-500" />
              </span>
              Bénin
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0 }} animate={fadeControls} className="flex flex-wrap gap-4">
            <Link href="/inscription"
              className="bg-forest-600 hover:bg-forest-500 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-forest-900/40">
              S&apos;inscrire maintenant <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/programme"
              className="border-2 border-white/30 hover:border-white/60 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 inline-flex items-center gap-2 backdrop-blur-sm">
              Découvrir le programme <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="#"
              className="border-2 border-gold-500/50 hover:border-gold-400 text-gold-400 font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 inline-flex items-center gap-2">
              Devenir sponsor <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div initial={{ opacity: 0 }} animate={fadeControls}
        className="relative z-20 bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap divide-x divide-white/10">
            {[
              { value: "200+", label: "Participants" },
              { value: "8", label: "Pays UEMOA" },
              { value: "4", label: "Thématiques stratégiques" },
              { value: "3", label: "Jours d'échanges" },
              { value: null, label: "Rencontres B2B", accent: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-4 flex-1 min-w-36">
                <div>
                  {s.value && <div className="text-2xl font-heading font-black text-gold-400 leading-none">{s.value}</div>}
                  <div className={`text-xs font-medium mt-0.5 ${s.accent ? "text-forest-400 font-semibold" : "text-gray-400"}`}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Three.js Energy Particle Canvas ─────────────────────────────────────────
function EnergyCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // ── Particle system on a torus knot (évoque les pipelines gaziers) ──
    const particleCount = 40000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // TorusKnot évoque les infrastructures gazières entrelacées
    const torusKnot = new THREE.TorusKnotGeometry(1.8, 0.55, 250, 32);
    const basePositions = torusKnot.attributes.position;

    for (let i = 0; i < particleCount; i++) {
      const vi = i % basePositions.count;
      const x = basePositions.getX(vi);
      const y = basePositions.getY(vi);
      const z = basePositions.getZ(vi);

      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3]     = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Palette : vert forêt → or → vert clair (thème énergie/gaz)
      const color = new THREE.Color();
      const t = Math.random();
      if (t < 0.5) {
        // Vert forêt
        color.setRGB(0.1 + Math.random() * 0.1, 0.35 + Math.random() * 0.25, 0.15 + Math.random() * 0.15);
      } else if (t < 0.8) {
        // Or / ambre
        color.setRGB(0.65 + Math.random() * 0.25, 0.55 + Math.random() * 0.2, 0.1 + Math.random() * 0.15);
      } else {
        // Vert vif (gaz naturel)
        color.setRGB(0.1, 0.7 + Math.random() * 0.2, 0.3 + Math.random() * 0.2);
      }
      colors[i * 3]     = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.018,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    // Décalé vers la droite pour laisser place au texte à gauche
    points.position.x = 1.8;
    scene.add(points);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const mouseWorld = new THREE.Vector3(mouse.x * 3, mouse.y * 3, 0);

      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3, iy = ix + 1, iz = ix + 2;
        const cur = new THREE.Vector3(positions[ix], positions[iy], positions[iz]);
        const ori = new THREE.Vector3(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
        const vel = new THREE.Vector3(velocities[ix], velocities[iy], velocities[iz]);

        const d = cur.distanceTo(mouseWorld);
        if (d < 1.5) {
          const force = (1.5 - d) * 0.008;
          vel.add(new THREE.Vector3().subVectors(cur, mouseWorld).normalize().multiplyScalar(force));
        }
        vel.add(new THREE.Vector3().subVectors(ori, cur).multiplyScalar(0.0015));
        vel.multiplyScalar(0.94);

        positions[ix] += vel.x;
        positions[iy] += vel.y;
        positions[iz] += vel.z;
        velocities[ix] = vel.x;
        velocities[iy] = vel.y;
        velocities[iz] = vel.z;
      }
      geometry.attributes.position.needsUpdate = true;

      points.rotation.y = elapsed * 0.06;
      points.rotation.x = Math.sin(elapsed * 0.03) * 0.15;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
