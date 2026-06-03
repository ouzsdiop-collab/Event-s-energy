"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import Link from "next/link";

interface LogoCanvasProps {
  size?: number;
  speed?: number;
}

function LogoCanvas({ size = 40, speed = 0.8 }: LogoCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 3.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const clock = new THREE.Clock();

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
      if (t < 0.55)      c.setRGB(0.1, 0.55 + Math.random() * 0.25, 0.2);
      else if (t < 0.82) c.setRGB(0.75 + Math.random() * 0.15, 0.62, 0.08);
      else               c.setRGB(0.08, 0.85 + Math.random() * 0.1, 0.35);
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
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      points.rotation.y = t * speed;
      points.rotation.x = Math.sin(t * 0.4) * 0.3;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      mountRef.current?.removeChild(renderer.domElement);
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
    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
      <LogoCanvas size={40} speed={0.8} />
      <div className="leading-tight">
        <div className="font-heading font-bold text-gray-800" style={{ fontSize: "11px", lineHeight: "1.35" }}>
          Salon Ouest Africain<br />
          Francophone du{" "}
          <span className="text-emerald-700">Gaz Naturel</span>{" "}
          <span className="text-yellow-600">2027</span>
        </div>
      </div>
    </Link>
  );
}
