"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import TransitionLink from "@/components/TransitionLink";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#f4f7f5]">
      <EnergyCanvas />

      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(244,247,245,0.97) 30%, rgba(244,247,245,0.75) 55%, rgba(244,247,245,0.05) 100%)",
        }}
      />

      <div className="relative z-20 flex-1 max-w-7xl mx-auto px-6 w-full flex items-center py-24">
        <div className="max-w-xl">
          <div className="hero-fade inline-flex items-center gap-2 bg-forest-700/8 border border-forest-600/25 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-semibold text-forest-700 uppercase tracking-[0.12em]">
              {h.badge}
            </span>
          </div>

          <h1 className="font-heading font-black mb-6 hero-slide-up" style={{ lineHeight: 0.92 }}>
            <span
              className="block font-medium uppercase tracking-[0.18em] mb-4"
              style={{ fontSize: "clamp(0.65rem, 1.1vw, 0.80rem)", color: "rgba(36,100,68,0.45)", lineHeight: 1 }}
            >
              {h.supertitle}
            </span>
            <span
              className="block text-gray-900"
              style={{ fontSize: "clamp(3.8rem, 7.5vw, 6.2rem)", letterSpacing: "-0.02em" }}
            >
              GAZ
            </span>
            <span
              className="block"
              style={{
                fontSize: "clamp(3.8rem, 7.5vw, 6.2rem)",
                letterSpacing: "-0.02em",
                background: "linear-gradient(90deg, #246444 0%, #1e5238 45%, #c49a30 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              NATUREL
            </span>
            <span
              className="block"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                letterSpacing: "0.14em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(15,45,31,0.20)",
                lineHeight: 1.2,
              }}
            >
              2027
            </span>
          </h1>

          <div className="w-12 h-[3px] bg-gold-400 rounded-full mb-6 hero-fade" />

          <p className="text-gray-500 text-base leading-[1.75] mb-8 max-w-md hero-fade">
            {h.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-9 hero-fade">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-3.5 py-2 text-sm font-medium text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              {h.date}
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-3.5 py-2 text-sm font-medium text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              {h.location}
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-3.5 py-2 text-sm font-medium text-gray-700">
              <svg width="20" height="14" viewBox="0 0 20 14" className="rounded-sm shrink-0 overflow-hidden">
                <rect width="7" height="14" fill="#008751" />
                <rect x="7" width="13" height="7" fill="#FCD116" />
                <rect x="7" y="7" width="13" height="7" fill="#E8112D" />
              </svg>
              {h.country}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 hero-fade">
            <TransitionLink
              href="/inscription"
              className="bg-forest-700 hover:bg-forest-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 inline-flex items-center gap-2 shadow-sm text-sm"
            >
              {h.registerBtn} <ChevronRight className="w-4 h-4" />
            </TransitionLink>
            <TransitionLink
              href="/programme"
              className="border border-forest-700 text-forest-700 hover:bg-forest-700 hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 inline-flex items-center gap-2 text-sm"
            >
              {h.programBtn} <ChevronRight className="w-4 h-4" />
            </TransitionLink>
            <TransitionLink
              href="/intervenants"
              className="border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 inline-flex items-center gap-2 text-sm"
            >
              {h.speakersBtn} <ChevronRight className="w-4 h-4" />
            </TransitionLink>
          </div>
        </div>
      </div>

      <div className="relative z-20 bg-white border-t border-gray-100">
        <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #c49a30 25%, #d4aa3a 50%, #c49a30 75%, transparent)" }} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {h.stats.map((s, i) => (
              <div key={i} className="px-6 py-6 flex flex-col gap-1 group">
                <div
                  className="font-heading font-black leading-none"
                  style={{
                    fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                    background: "linear-gradient(135deg, #1e5238 0%, #c49a30 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.value}
                </div>
                <div className="text-sm font-semibold text-gray-800 mt-1">{s.label}</div>
                <div className="text-xs text-gray-400 font-normal leading-snug">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 py-3 flex items-center justify-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-forest-600">
              {h.b2b}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-slide-up {
          animation: slideUp 0.9s cubic-bezier(0.2, 0.65, 0.3, 0.9) 0.3s both;
        }
        .hero-fade {
          animation: fadeIn 1s ease 0.7s both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

function EnergyCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Clear any stale canvas from a previous mount (e.g. HMR or fast navigation)
    container.innerHTML = "";

    const W = window.innerWidth;
    const H = window.innerHeight;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    // Track elapsed time manually so tab-visibility pauses don't cause jumps
    let elapsed = 0;
    let lastTs  = performance.now();

    const particleCount     = 50000;
    const positions         = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors            = new Float32Array(particleCount * 3);
    const velocities        = new Float32Array(particleCount * 3);

    const knot = new THREE.TorusKnotGeometry(1.8, 0.55, 250, 32);
    const base = knot.attributes.position;

    for (let i = 0; i < particleCount; i++) {
      const vi = i % base.count;
      positions[i*3]   = originalPositions[i*3]   = base.getX(vi);
      positions[i*3+1] = originalPositions[i*3+1] = base.getY(vi);
      positions[i*3+2] = originalPositions[i*3+2] = base.getZ(vi);

      const t = Math.random();
      const c = new THREE.Color();
      if (t < 0.50)      c.setHSL(0.37, 0.72, 0.28 + Math.random() * 0.12);
      else if (t < 0.78) c.setHSL(0.11, 0.88, 0.35 + Math.random() * 0.10);
      else               c.setHSL(0.42, 0.65, 0.32 + Math.random() * 0.12);
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.032, vertexColors: true, blending: THREE.NormalBlending,
      transparent: true, opacity: 1.0, depthWrite: false, sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    points.position.x = 2.8;
    scene.add(points);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId: number;
    let active = true;

    const animate = (ts: number) => {
      if (!active) return;
      animId = requestAnimationFrame(animate);

      // Cap delta so a long background pause doesn't cause a huge jump
      const delta = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs  = ts;
      elapsed += delta;

      const mw = new THREE.Vector3(mouse.x * 3, mouse.y * 3, 0);
      for (let i = 0; i < particleCount; i++) {
        const ix = i*3, iy = ix+1, iz = ix+2;
        const cur = new THREE.Vector3(positions[ix], positions[iy], positions[iz]);
        const ori = new THREE.Vector3(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
        const vel = new THREE.Vector3(velocities[ix], velocities[iy], velocities[iz]);

        const d = cur.distanceTo(mw);
        if (d < 1.5) vel.add(new THREE.Vector3().subVectors(cur, mw).normalize().multiplyScalar((1.5 - d) * 0.01));
        vel.add(new THREE.Vector3().subVectors(ori, cur).multiplyScalar(0.002));
        vel.multiplyScalar(0.95);

        positions[ix] += vel.x; positions[iy] += vel.y; positions[iz] += vel.z;
        velocities[ix] = vel.x; velocities[iy] = vel.y; velocities[iz] = vel.z;
      }

      geo.attributes.position.needsUpdate = true;
      points.rotation.y = elapsed * 0.06;
      points.rotation.x = Math.sin(elapsed * 0.03) * 0.15;
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    // When tab comes back into view, reset lastTs so delta doesn't spike
    const onVisibility = () => {
      if (!document.hidden) lastTs = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      // Clear the container regardless of whether the node is still attached
      container.innerHTML = "";
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
