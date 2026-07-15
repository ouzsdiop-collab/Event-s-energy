"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import TransitionLink from "@/components/TransitionLink";

interface LogoCanvasProps {
  size?: number;
  speed?: number;
}

function LogoCanvas({ size = 40, speed = 0.8 }: LogoCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    container.innerHTML = "";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 3.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    let elapsed = 0;
    let lastTs  = performance.now();

    const particleCount = 6000;
    const positions = new Float32Array(particleCount * 3);
    const colors    = new Float32Array(particleCount * 3);

    const knot = new THREE.TorusKnotGeometry(1, 0.38, 120, 16);
    const base  = knot.attributes.position;

    for (let i = 0; i < particleCount; i++) {
      const vi = i % base.count;
      positions[i * 3]     = base.getX(vi);
      positions[i * 3 + 1] = base.getY(vi);
      positions[i * 3 + 2] = base.getZ(vi);

      const t = Math.random();
      const c = new THREE.Color();
      if (t < 0.55)      c.setHSL(0.37, 0.75, 0.30 + Math.random() * 0.12);
      else if (t < 0.82) c.setHSL(0.11, 0.90, 0.38 + Math.random() * 0.10);
      else               c.setHSL(0.42, 0.68, 0.34 + Math.random() * 0.10);
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      blending: THREE.NormalBlending,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let animId: number;
    let active = true;

    const animate = (ts: number) => {
      if (!active) return;
      animId = requestAnimationFrame(animate);
      const delta = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs  = ts;
      elapsed += delta;
      points.rotation.y = elapsed * speed;
      points.rotation.x = Math.sin(elapsed * 0.4) * 0.3;
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    const onVisibility = () => { if (!document.hidden) lastTs = performance.now(); };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      document.removeEventListener("visibilitychange", onVisibility);
      container.innerHTML = "";
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, [size, speed]);

  return <div ref={mountRef} style={{ width: size, height: size }} />;
}

export function LogoMark({ size = 40 }: { size?: number }) {
  return <LogoCanvas size={size} speed={0.8} />;
}

export default function Logo() {
  return (
    <TransitionLink href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="SOAFGANG 2027 — Accueil">
      <LogoCanvas size={36} speed={0.8} />
      <div className="flex flex-col leading-none">
        <span className="font-heading font-black text-[13px] tracking-tight text-gray-900 group-hover:text-forest-700 transition-colors">SOAFGANG</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">2027 · Abidjan</span>
      </div>
    </TransitionLink>
  );
}
