"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ring    = useRef({ x: -100, y: -100 });
  const raf     = useRef<number>(0);
  const [visible,  setVisible]  = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      const el = e.target as Element;
      setHovering(!!el.closest('a, button, [role="button"], input, select, textarea, label[for], [tabindex]'));
    };

    const onDown  = () => setClicking(true);
    const onUp    = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup",   onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    const EASE = 0.11;
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * EASE;
      ring.current.y += (pos.current.y - ring.current.y) * EASE;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.current.x}px,${pos.current.y}px) translate(-50%,-50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px) translate(-50%,-50%)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup",   onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  const dotSize  = hovering ? 8  : clicking ? 3  : 5;
  const ringSize = hovering ? 48 : clicking ? 20 : 34;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Dot — mix-blend-mode: difference → toujours visible */}
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0, zIndex: 99999,
          pointerEvents: "none",
          width: dotSize, height: dotSize,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
          opacity: visible ? 1 : 0,
          transition: "width 0.18s ease, height 0.18s ease, opacity 0.3s",
        }}
      />

      {/* Ring — or au hover, blanc sinon */}
      <div
        ref={ringRef}
        style={{
          position: "fixed", top: 0, left: 0, zIndex: 99998,
          pointerEvents: "none",
          width: ringSize, height: ringSize,
          borderRadius: "50%",
          border: `1.5px solid ${hovering ? "#c49a30" : "rgba(255,255,255,0.55)"}`,
          opacity: visible ? 1 : 0,
          transition: "width 0.28s cubic-bezier(0.34,1.56,0.64,1), height 0.28s cubic-bezier(0.34,1.56,0.64,1), border-color 0.22s, opacity 0.3s",
        }}
      />
    </>
  );
}
