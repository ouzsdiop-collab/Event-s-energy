"use client";

import { useEffect, useRef } from "react";

const DOTS = 7;
const EASE = 0.18;

export default function CustomCursor() {
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const trail   = useRef(Array.from({ length: DOTS }, () => ({ x: -200, y: -200 })));
  const mouse   = useRef({ x: -200, y: -200 });
  const raf     = useRef<number>(0);
  const visible = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        visible.current = true;
        trail.current.forEach(p => { p.x = e.clientX; p.y = e.clientY; });
      }
    };
    const onLeave = () => { visible.current = false; };
    const onEnter = () => { visible.current = true; };

    document.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    const tick = () => {
      // Each dot chases the one in front of it
      trail.current[0].x += (mouse.current.x - trail.current[0].x) * EASE;
      trail.current[0].y += (mouse.current.y - trail.current[0].y) * EASE;

      for (let i = 1; i < DOTS; i++) {
        trail.current[i].x += (trail.current[i - 1].x - trail.current[i].x) * EASE;
        trail.current[i].y += (trail.current[i - 1].y - trail.current[i].y) * EASE;
      }

      dotsRef.current.forEach((el, i) => {
        if (!el) return;
        const { x, y } = trail.current[i];
        const progress = 1 - i / DOTS; // 1 → 0 from front to back
        const size = 7 * progress + 2;
        el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
        el.style.width  = `${size}px`;
        el.style.height = `${size}px`;
        el.style.opacity = visible.current ? String(progress * 0.85 + 0.08) : "0";
      });

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      {Array.from({ length: DOTS }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) dotsRef.current[i] = el; }}
          style={{
            position: "fixed",
            top: 0, left: 0,
            zIndex: 99999,
            pointerEvents: "none",
            borderRadius: "50%",
            backgroundColor: i === 0 ? "#c49a30" : "#246444",
            opacity: 0,
            willChange: "transform, opacity",
            transition: "opacity 0.3s",
          }}
        />
      ))}
    </>
  );
}
