"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "#0a1f14" }}
    >
      {/* ── Background photo + overlay ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(135deg, rgba(10,31,20,0.96) 0%, rgba(10,31,20,0.82) 45%, rgba(10,31,20,0.60) 100%)",
        }}
      />

      {/* ── Grain texture overlay ── */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Subtle gold radial glow (top-left) ── */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(196,154,48,0.08) 0%, transparent 65%)",
        }}
      />

      {/* ── Three.js 3D — right side, decorative ── */}
      <div className="absolute right-0 top-0 h-full w-[50%] z-[3] hidden lg:block pointer-events-none opacity-60">
        <EnergyCanvas />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto px-6 lg:px-10 w-full flex items-center py-28">
        <div className="w-full lg:w-[55%]">

          {/* Badge */}
          <div
            className="hero-badge inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8"
            style={{
              border: "1px solid rgba(196,154,48,0.40)",
              background: "rgba(196,154,48,0.08)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "#d4aa3a" }}
            />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: "#d4aa3a" }}
            >
              1ère Édition &nbsp;·&nbsp; Cotonou, Bénin &nbsp;·&nbsp; 3–5 fév. 2027
            </span>
          </div>

          {/* Eyebrow */}
          <p className="hero-eyebrow text-base md:text-lg font-medium uppercase tracking-[0.22em] mb-3"
            style={{ color: "rgba(255,255,255,0.40)" }}>
            Salon Ouest Africain Francophone
          </p>

          {/* Giant title */}
          <h1 className="hero-title font-heading font-black leading-[0.92] mb-6 select-none">
            <span
              className="block"
              style={{
                fontSize: "clamp(4rem, 10vw, 7.5rem)",
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              GAZ
            </span>
            <span
              className="block"
              style={{
                fontSize: "clamp(4rem, 10vw, 7.5rem)",
                letterSpacing: "-0.02em",
                background: "linear-gradient(90deg, #e8c96a 0%, #c49a30 60%, #a07828 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              NATUREL
            </span>
            <span
              className="block hero-outline-text"
              style={{
                fontSize: "clamp(3rem, 7.5vw, 5.5rem)",
                letterSpacing: "0.06em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(196,154,48,0.45)",
              }}
            >
              2027
            </span>
          </h1>

          {/* Separator */}
          <div className="hero-sep flex items-center gap-3 mb-6">
            <div
              className="h-px w-14"
              style={{ background: "rgba(196,154,48,0.40)" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#c49a30" }}
            />
            <div
              className="h-px w-8"
              style={{ background: "rgba(196,154,48,0.20)" }}
            />
          </div>

          {/* Description */}
          <p
            className="hero-desc text-base leading-[1.75] mb-8 max-w-md"
            style={{ color: "rgba(255,255,255,0.58)" }}
          >
            La rencontre régionale de référence pour les décideurs, investisseurs
            et opérateurs du secteur gazier de l&apos;espace UEMOA.
          </p>

          {/* Info chips — minimal inline */}
          <div
            className="hero-chips flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-10 text-sm"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#c49a30" }}>
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.8" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              3–5 février 2027
            </span>
            <span style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#c49a30" }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="1.8" />
                <circle cx="12" cy="9" r="2.5" strokeWidth="1.8" />
              </svg>
              Sofitel Cotonou Marina
            </span>
            <span style={{ color: "rgba(255,255,255,0.20)" }}>·</span>
            <span className="flex items-center gap-1.5">
              <svg width="18" height="13" viewBox="0 0 20 14" className="rounded-sm shrink-0 overflow-hidden">
                <rect width="7" height="14" fill="#008751" />
                <rect x="7" width="13" height="7" fill="#FCD116" />
                <rect x="7" y="7" width="13" height="7" fill="#E8112D" />
              </svg>
              Bénin
            </span>
          </div>

          {/* CTAs */}
          <div className="hero-ctas flex flex-wrap gap-3">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2.5 font-bold text-sm px-8 py-4 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: "#c49a30",
                color: "#0a1f14",
                boxShadow: "0 0 28px rgba(196,154,48,0.30), 0 4px 16px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#d4aa3a";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 40px rgba(212,170,58,0.45), 0 4px 20px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#c49a30";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 28px rgba(196,154,48,0.30), 0 4px 16px rgba(0,0,0,0.3)";
              }}
            >
              S&apos;inscrire maintenant
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/programme"
              className="inline-flex items-center gap-2.5 font-semibold text-sm px-8 py-4 rounded-lg transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.78)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.42)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.18)";
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.78)";
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              }}
            >
              Voir le programme
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div
        className="hero-stats relative z-20 border-t"
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex divide-x" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            {[
              { value: "500+", label: "Participants" },
              { value: "15",   label: "Pays représentés" },
              { value: "4",    label: "Thématiques" },
              { value: "3",    label: "Jours d'échanges" },
            ].map((s, i) => (
              <div
                key={i}
                className="flex-1 px-6 py-5 flex flex-col gap-0.5"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="text-3xl font-heading font-black leading-none"
                  style={{ color: "#d4aa3a" }}
                >
                  {s.value}
                </div>
                <div
                  className="text-xs font-medium mt-1"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 scroll-bounce hidden md:block">
        <ChevronDown
          className="w-5 h-5"
          style={{ color: "rgba(255,255,255,0.25)" }}
        />
      </div>

      {/* ── Keyframe animations ── */}
      <style jsx>{`
        .hero-badge {
          animation: fadeIn 0.6s ease both;
          animation-delay: 0.1s;
        }
        .hero-eyebrow {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.2s;
        }
        .hero-title {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.3s;
        }
        .hero-sep {
          animation: fadeIn 0.6s ease both;
          animation-delay: 0.6s;
        }
        .hero-desc {
          animation: fadeIn 0.6s ease both;
          animation-delay: 0.7s;
        }
        .hero-chips {
          animation: fadeIn 0.6s ease both;
          animation-delay: 0.85s;
        }
        .hero-ctas {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.9s;
        }
        .hero-stats {
          animation: fadeIn 0.5s ease both;
          animation-delay: 1.1s;
        }
        .scroll-bounce {
          animation: scrollBounce 2s ease-in-out infinite;
          animation-delay: 2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.25; }
          50%       { transform: translateX(-50%) translateY(6px); opacity: 0.50; }
        }
      `}</style>
    </section>
  );
}

// ─── Three.js canvas — bright additive particles on dark bg ─────────────────
function EnergyCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const w = mountRef.current.clientWidth || window.innerWidth * 0.5;
    const h = mountRef.current.clientHeight || window.innerHeight;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(65, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const clock  = new THREE.Clock();
    const mouse  = new THREE.Vector2(0, 0);

    const particleCount      = 45000;
    const positions          = new Float32Array(particleCount * 3);
    const originalPositions  = new Float32Array(particleCount * 3);
    const colors             = new Float32Array(particleCount * 3);
    const velocities         = new Float32Array(particleCount * 3);

    const knot = new THREE.TorusKnotGeometry(1.9, 0.58, 280, 36);
    const base = knot.attributes.position;

    for (let i = 0; i < particleCount; i++) {
      const vi = i % base.count;
      const x  = base.getX(vi), y = base.getY(vi), z = base.getZ(vi);
      positions[i*3]   = originalPositions[i*3]   = x;
      positions[i*3+1] = originalPositions[i*3+1] = y;
      positions[i*3+2] = originalPositions[i*3+2] = z;

      const t = Math.random();
      const c = new THREE.Color();
      if (t < 0.50)      c.setRGB(0.08, 0.82 + Math.random() * 0.18, 0.28); // vert lumineux
      else if (t < 0.78) c.setRGB(0.92 + Math.random() * 0.08, 0.72 + Math.random() * 0.18, 0.08); // or brillant
      else               c.setRGB(0.06, 0.60 + Math.random() * 0.30, 0.90); // cyan-émeraude
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    // AdditiveBlending = particules lumineuses qui brillent sur fond sombre
    const mat = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
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
        if (d < 1.6) vel.add(new THREE.Vector3().subVectors(cur, mw).normalize().multiplyScalar((1.6 - d) * 0.009));
        vel.add(new THREE.Vector3().subVectors(ori, cur).multiplyScalar(0.0018));
        vel.multiplyScalar(0.93);

        positions[ix] += vel.x; positions[iy] += vel.y; positions[iz] += vel.z;
        velocities[ix] = vel.x; velocities[iy] = vel.y; velocities[iz] = vel.z;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.y = elapsed * 0.07;
      points.rotation.x = Math.sin(elapsed * 0.035) * 0.18;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      mountRef.current?.removeChild(renderer.domElement);
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
