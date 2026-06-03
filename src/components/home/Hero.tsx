"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#f4f7f5]">
      <EnergyCanvas />

      {/* Overlay — laisse les particules visibles à droite */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(244,247,245,0.97) 30%, rgba(244,247,245,0.75) 55%, rgba(244,247,245,0.05) 100%)",
        }}
      />

      {/* Contenu */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto px-6 w-full flex items-center py-24">
        <div className="max-w-xl">

          {/* Badge */}
          <div className="hero-fade inline-flex items-center gap-2 bg-forest-700/8 border border-forest-600/25 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-semibold text-forest-700 uppercase tracking-[0.12em]">
              1ère Édition &nbsp;·&nbsp; Cotonou, Bénin
            </span>
          </div>

          {/* Titre monumental */}
          <h1 className="font-heading font-black mb-6 hero-slide-up" style={{ lineHeight: 0.92 }}>
            {/* Sur-titre */}
            <span
              className="block font-medium uppercase tracking-[0.18em] mb-4"
              style={{ fontSize: "clamp(0.65rem, 1.1vw, 0.80rem)", color: "rgba(36,100,68,0.45)", lineHeight: 1 }}
            >
              Salon Ouest Africain Francophone
            </span>
            {/* GAZ */}
            <span
              className="block text-gray-900"
              style={{ fontSize: "clamp(3.8rem, 7.5vw, 6.2rem)", letterSpacing: "-0.02em" }}
            >
              GAZ
            </span>
            {/* NATUREL — dégradé */}
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
            {/* 2027 — outline */}
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

          {/* Trait doré */}
          <div className="w-12 h-[3px] bg-gold-400 rounded-full mb-6 hero-fade" />

          {/* Sous-titre */}
          <p className="text-gray-500 text-base leading-[1.75] mb-8 max-w-md hero-fade">
            La rencontre régionale de référence pour les acteurs du secteur gazier
            de l&apos;espace UEMOA : investisseurs, opérateurs et décideurs publics.
          </p>

          {/* Chips info */}
          <div className="flex flex-wrap items-center gap-2 mb-9 hero-fade">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-3.5 py-2 text-sm font-medium text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              3–5 fév. 2027
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-3.5 py-2 text-sm font-medium text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
              Sofitel Cotonou Marina
            </div>
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-full px-3.5 py-2 text-sm font-medium text-gray-700">
              <svg width="20" height="14" viewBox="0 0 20 14" className="rounded-sm shrink-0 overflow-hidden">
                <rect width="7" height="14" fill="#008751" />
                <rect x="7" width="13" height="7" fill="#FCD116" />
                <rect x="7" y="7" width="13" height="7" fill="#E8112D" />
              </svg>
              Bénin
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 hero-fade">
            <Link
              href="/inscription"
              className="bg-forest-700 hover:bg-forest-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 inline-flex items-center gap-2 shadow-sm text-sm"
            >
              S&apos;inscrire <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/programme"
              className="border border-forest-700 text-forest-700 hover:bg-forest-700 hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 inline-flex items-center gap-2 text-sm"
            >
              Programme <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/devenir-sponsor"
              className="border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 inline-flex items-center gap-2 text-sm"
            >
              Devenir sponsor <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Transition douce hero → stats */}
      <div
        className="relative z-20 pointer-events-none"
        style={{ height: "80px", marginBottom: "-1px",
          background: "linear-gradient(to bottom, rgba(244,247,245,0) 0%, rgba(244,247,245,0.6) 50%, rgba(255,255,255,1) 100%)"
        }}
      />

      {/* Barre de stats */}
      <StatsBar />

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
        .stats-item {
          animation: fadeInUp 0.6s cubic-bezier(0.2, 0.65, 0.3, 0.9) both;
        }
        .stats-item:hover .stat-dot {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}

// ─── Stats bar avec count-up ─────────────────────────────────────────────────
const StatIcons = {
  participants: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="9" cy="7" r="3"/><circle cx="17" cy="8" r="2.5"/>
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/><path d="M22 20c0-2.5-2-4.5-5-5.2"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 3c-2.5 3-4 5.5-4 9s1.5 6 4 9"/><path d="M12 3c2.5 3 4 5.5 4 9s-1.5 6-4 9"/>
      <path d="M3.6 9h16.8M3.6 15h16.8"/>
    </svg>
  ),
  themes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  days: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="5" width="18" height="16" rx="2"/>
      <path d="M3 10h18M8 3v4M16 3v4"/>
      <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
};

const stats = [
  { target: 200, suffix: "+", label: "Participants attendus",    icon: StatIcons.participants },
  { target: 8,   suffix: "",  label: "Pays de l'espace UEMOA",  icon: StatIcons.globe },
  { target: 4,   suffix: "",  label: "Thématiques stratégiques", icon: StatIcons.themes },
  { target: 3,   suffix: "",  label: "Jours d'échanges intenses",icon: StatIcons.days },
];

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = React.useState(false);
  const [counts, setCounts] = React.useState(stats.map(() => 0));

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered) return;
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts(stats.map((s) => Math.floor(s.target * ease)));
      if (progress < 1) requestAnimationFrame(tick);
      else setCounts(stats.map((s) => s.target));
    };
    requestAnimationFrame(tick);
  }, [triggered]);

  return (
    <div ref={ref} className="relative z-20 bg-white border-t border-gray-100">
      {/* Ligne dorée décorative en haut */}
      <div
        className="h-[3px] w-full"
        style={{ background: "linear-gradient(to right, transparent 0%, #c49a30 30%, #d4aa3a 50%, #c49a30 70%, transparent 100%)" }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`
                relative px-6 py-7 flex flex-col items-center text-center
                ${i < stats.length - 1 ? "border-r border-gray-100" : ""}
                stats-item
              `}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icône SVG */}
              <div className="mb-3 text-forest-600 opacity-50">{s.icon}</div>

              {/* Chiffre animé */}
              <div
                className="font-heading font-black leading-none mb-1"
                style={{
                  fontSize: "clamp(2.2rem, 4vw, 3rem)",
                  background: "linear-gradient(135deg, #1e5238 0%, #c49a30 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {counts[i]}{s.suffix}
              </div>

              {/* Label */}
              <div className="text-xs font-medium text-gray-400 leading-snug max-w-[120px]">
                {s.label}
              </div>

              {/* Point doré en bas au hover */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400 opacity-0 transition-opacity duration-300 stat-dot"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rencontres B2B — bandeau séparé */}
      <div
        className="border-t border-gray-100 py-3 px-6 flex items-center justify-center gap-3"
        style={{ background: "linear-gradient(to right, rgba(30,82,56,0.03), rgba(196,154,48,0.05), rgba(30,82,56,0.03))" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-forest-600">
          Rencontres B2B organisées
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
      </div>
    </div>
  );
}

// ─── Three.js canvas ──────────────────────────────────────────────────────────
function EnergyCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock  = new THREE.Clock();

    // ── Particles ──
    const particleCount     = 50000;
    const positions         = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors            = new Float32Array(particleCount * 3);
    const velocities        = new Float32Array(particleCount * 3);

    const knot = new THREE.TorusKnotGeometry(1.8, 0.55, 250, 32);
    const base = knot.attributes.position;

    for (let i = 0; i < particleCount; i++) {
      const vi = i % base.count;
      const x  = base.getX(vi);
      const y  = base.getY(vi);
      const z  = base.getZ(vi);

      positions[i*3]   = originalPositions[i*3]   = x;
      positions[i*3+1] = originalPositions[i*3+1] = y;
      positions[i*3+2] = originalPositions[i*3+2] = z;

      const t = Math.random();
      const c = new THREE.Color();
      // Sur fond clair NormalBlending : couleurs mid-range bien visibles
      if (t < 0.50)      c.setHSL(0.37, 0.72, 0.28 + Math.random() * 0.12); // vert forêt
      else if (t < 0.78) c.setHSL(0.11, 0.88, 0.35 + Math.random() * 0.10); // or/ambre
      else               c.setHSL(0.42, 0.65, 0.32 + Math.random() * 0.12); // vert émeraude

      colors[i*3]   = c.r;
      colors[i*3+1] = c.g;
      colors[i*3+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.032,
      vertexColors: true,
      blending: THREE.NormalBlending,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      sizeAttenuation: true,
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
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const mw = new THREE.Vector3(mouse.x * 3, mouse.y * 3, 0);

      for (let i = 0; i < particleCount; i++) {
        const ix = i*3, iy = ix+1, iz = ix+2;
        const cur = new THREE.Vector3(positions[ix], positions[iy], positions[iz]);
        const ori = new THREE.Vector3(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
        const vel = new THREE.Vector3(velocities[ix], velocities[iy], velocities[iz]);

        const d = cur.distanceTo(mw);
        if (d < 1.5) {
          vel.add(
            new THREE.Vector3().subVectors(cur, mw).normalize().multiplyScalar((1.5 - d) * 0.01)
          );
        }
        vel.add(new THREE.Vector3().subVectors(ori, cur).multiplyScalar(0.002));
        vel.multiplyScalar(0.95);

        positions[ix] += vel.x;
        positions[iy] += vel.y;
        positions[iz] += vel.z;
        velocities[ix] = vel.x;
        velocities[iy] = vel.y;
        velocities[iz] = vel.z;
      }

      geo.attributes.position.needsUpdate = true;
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
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
