"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#f4f7f5]">
      <EnergyCanvas />

      {/* Overlay doux — laisse les particules visibles à droite */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(to right, rgba(244,247,245,0.97) 32%, rgba(244,247,245,0.80) 58%, rgba(244,247,245,0.10) 100%)",
        }}
      />

      {/* Contenu */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto px-6 w-full flex items-center py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="hero-fade inline-flex items-center gap-2 bg-forest-700/10 border border-forest-600/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-xs font-semibold text-forest-700 uppercase tracking-widest">
              1ère Édition — Cotonou 2027
            </span>
          </div>

          {/* Titre */}
          <h1 className="font-heading font-black leading-tight mb-4 hero-slide-up">
            <span className="block text-gray-900 text-4xl md:text-5xl lg:text-[3.4rem]">
              Salon Ouest Africain
            </span>
            <span className="block text-gray-900 text-4xl md:text-5xl lg:text-[3.4rem]">
              Francophone du
            </span>
            <span className="block text-4xl md:text-5xl lg:text-[3.4rem] text-forest-600">
              Gaz Naturel
            </span>
            <span className="block text-4xl md:text-5xl lg:text-[3.4rem] text-gold-500">
              2027
            </span>
          </h1>

          {/* Trait doré */}
          <div className="w-16 h-1 bg-gold-400 rounded mb-5 hero-fade" />

          {/* Sous-titre */}
          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg hero-fade">
            Construire un marché gazier intégré et accessible dans l&apos;espace UEMOA :
            défis, opportunités et engagements.
          </p>

          {/* Chips info */}
          <div className="flex flex-wrap gap-3 mb-10 hero-fade">
            <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2.5 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-forest-600 shrink-0" />
              3–5 février 2027
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2.5 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
              Sofitel Cotonou Marina Hotel & Spa
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2.5 text-sm text-gray-700">
              <span className="inline-flex w-5 h-3.5 rounded-sm overflow-hidden shrink-0">
                <span className="w-1/3 h-full bg-green-600" />
                <span className="w-1/3 h-full bg-yellow-400" />
                <span className="w-1/3 h-full bg-red-500" />
              </span>
              Bénin
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 hero-fade">
            <Link
              href="/inscription"
              className="bg-forest-700 hover:bg-forest-800 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 inline-flex items-center gap-2 shadow-md shadow-forest-900/20"
            >
              S&apos;inscrire maintenant <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/programme"
              className="border-2 border-forest-700 text-forest-700 hover:bg-forest-700 hover:text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 inline-flex items-center gap-2"
            >
              Découvrir le programme <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 inline-flex items-center gap-2"
            >
              Devenir sponsor <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Barre de stats */}
      <div className="relative z-20 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap divide-x divide-gray-200">
            {[
              { value: "200+", label: "Participants" },
              { value: "8",    label: "Pays UEMOA" },
              { value: "4",    label: "Thématiques stratégiques" },
              { value: "3",    label: "Jours d'échanges" },
              { value: null,   label: "Rencontres B2B", accent: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-4 flex-1 min-w-36">
                <div>
                  {s.value && (
                    <div className="text-2xl font-heading font-black text-gold-500 leading-none">
                      {s.value}
                    </div>
                  )}
                  <div className={`text-xs font-medium mt-0.5 ${s.accent ? "text-forest-600 font-semibold text-sm" : "text-gray-500"}`}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
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

// ─── Three.js canvas ──────────────────────────────────────────────────────────
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
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock  = new THREE.Clock();

    const particleCount = 40000;
    const positions         = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors            = new Float32Array(particleCount * 3);
    const velocities        = new Float32Array(particleCount * 3);

    const knot = new THREE.TorusKnotGeometry(1.8, 0.55, 250, 32);
    const base = knot.attributes.position;

    for (let i = 0; i < particleCount; i++) {
      const vi = i % base.count;
      const x = base.getX(vi), y = base.getY(vi), z = base.getZ(vi);

      positions[i*3]   = originalPositions[i*3]   = x;
      positions[i*3+1] = originalPositions[i*3+1] = y;
      positions[i*3+2] = originalPositions[i*3+2] = z;

      // Palette fond clair : vert forêt profond + or soutenu + vert émeraude
      const t = Math.random();
      const c = new THREE.Color();
      if (t < 0.50)      c.setRGB(0.08, 0.30 + Math.random()*0.18, 0.12); // vert forêt
      else if (t < 0.78) c.setRGB(0.60 + Math.random()*0.18, 0.46 + Math.random()*0.12, 0.04); // or/ambre
      else               c.setRGB(0.05, 0.52 + Math.random()*0.18, 0.22); // vert émeraude
      colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    // NormalBlending indispensable sur fond clair (AdditiveBlending = invisible sur blanc)
    const mat = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      blending: THREE.NormalBlending,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
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
        if (d < 1.5) vel.add(new THREE.Vector3().subVectors(cur, mw).normalize().multiplyScalar((1.5-d)*0.008));
        vel.add(new THREE.Vector3().subVectors(ori, cur).multiplyScalar(0.0015));
        vel.multiplyScalar(0.94);

        positions[ix] += vel.x; positions[iy] += vel.y; positions[iz] += vel.z;
        velocities[ix] = vel.x; velocities[iy] = vel.y; velocities[iz] = vel.z;
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
      mountRef.current?.removeChild(renderer.domElement);
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
