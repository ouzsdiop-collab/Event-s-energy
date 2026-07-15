"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLang } from "@/lib/i18n";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const ICONS = [
  (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path d="M8 40V20l16-12 16 12v20H8z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M18 40v-10h12v10" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M24 8v4M16 24h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="28" r="2.5" fill="currentColor" opacity="0.5"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path d="M24 6L10 14v12c0 8 6 14 14 16 8-2 14-8 14-16V14L24 6z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M17 24l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <rect x="8" y="10" width="32" height="4" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="8" y="22" width="24" height="4" rx="2" stroke="currentColor" strokeWidth="2"/>
      <rect x="8" y="34" width="16" height="4" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="38" cy="36" r="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M35.5 36l1.5 1.5 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
      <path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2.2"/>
      <path d="M24 18v6l4 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10l2 2M30 34l2 2M16 38l2-2M30 12l2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
];

const GRADIENTS = [
  "from-forest-900 to-forest-700",
  "from-[#1a3a28] to-forest-600",
  "from-forest-800 to-[#2d5a40]",
  "from-[#162f22] to-forest-700",
];
const ACCENTS = ["#c49a30", "#d4aa3a", "#c49a30", "#e8c96a"];

function ThemeCard({ item, i, accent, gradient, visible }: {
  item: { num: string; tag: string; title: string; desc: string };
  i: number; accent: string; gradient: string; visible: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 14, y: (x - 0.5) * -14 });
    setMousePos({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${gradient} border border-white/5 transition-[opacity,transform,box-shadow] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{
        minHeight: 300,
        transitionDuration: hovered ? "120ms" : "500ms",
        transform: visible
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${hovered ? -6 : 0}px)`
          : "translateY(40px)",
        boxShadow: hovered
          ? `0 24px 48px rgba(10,28,18,0.40), 0 0 0 1px rgba(196,154,48,0.15)`
          : "0 6px 24px rgba(10,28,18,0.18)",
        willChange: "transform",
      }}
    >
      <GlowingEffect spread={50} glow={false} disabled={false} proximity={80} inactiveZone={0.01} borderWidth={2} variant="forest" />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      {/* Orbe lumineux suivant la souris */}
      <div className="absolute w-48 h-48 rounded-full pointer-events-none transition-[left,top] duration-200 ease-out"
        style={{
          background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`,
          left: `calc(${mousePos.x}% - 96px)`,
          top: `calc(${mousePos.y}% - 96px)`,
          opacity: hovered ? 1 : 0,
          transition: hovered ? "opacity 0.3s, left 0.12s, top 0.12s" : "opacity 0.4s",
        }} />

      {/* Coin glow statique */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ backgroundColor: accent }} />

      <div className="relative z-10 p-7 flex flex-col" style={{ minHeight: 300 }}>
        {/* Numéro + icône */}
        <div className="flex items-start justify-between mb-5">
          <span className="font-heading font-black leading-none select-none"
            style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)", color: accent, opacity: hovered ? 0.40 : 0.18, transition: "opacity 0.4s" }}>
            {item.num}
          </span>
          <div className="p-2.5 rounded-xl"
            style={{
              color: accent,
              background: `${accent}20`,
              transform: hovered ? "scale(1.14) rotate(-5deg)" : "scale(1) rotate(0deg)",
              transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            }}>
            {ICONS[i]}
          </div>
        </div>

        {/* Tag */}
        <div className="mb-3.5">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ color: accent, background: `${accent}22` }}>
            {item.tag}
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-white font-heading font-bold text-base leading-snug mb-3 flex-1"
          style={{ transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "transform 0.35s ease" }}>
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)", opacity: hovered ? 1 : 0.7, transform: hovered ? "translateY(0)" : "translateY(4px)", transition: "opacity 0.4s, transform 0.4s" }}>
          {item.desc}
        </p>

        {/* Barre dorée */}
        <div className="mt-5 h-[2px] rounded-full"
          style={{
            background: `linear-gradient(to right, ${accent}, transparent)`,
            width: hovered ? "100%" : "28px",
            transition: "width 0.5s cubic-bezier(0.22,1,0.36,1)",
          }} />
      </div>
    </div>
  );
}

export default function ThemesSection() {
  const { t } = useLang();
  const th = t.themes;
  const [visible, setVisible] = useState<boolean[]>(new Array(4).fill(false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(prev => { const n = [...prev]; n[i] = true; return n; }), i * 110);
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <section className="py-14 md:py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <p className="section-label mb-3">{th.label}</p>
          <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 leading-tight">
            {th.title}{" "}
            <span className="text-forest-600">{th.titleHighlight}</span>{" "}
            <br className="hidden md:block" />
            {th.titleEnd}
          </h2>
          <div className="w-14 h-[3px] bg-gold-400 rounded-full mt-5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {th.items.map((item, i) => (
            <div key={item.num} ref={el => { refs.current[i] = el; }}>
              <ThemeCard item={item} i={i} accent={ACCENTS[i]} gradient={GRADIENTS[i]} visible={visible[i]} />
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-between flex-wrap gap-4">
          <p className="text-gray-400 text-sm max-w-lg">{th.ctaText}</p>
          <a href="/programme"
            className="inline-flex items-center gap-2 text-forest-600 font-semibold text-sm border border-forest-200 rounded-lg px-5 py-2.5 hover:bg-forest-50 hover:border-forest-400 transition-all duration-200">
            {th.ctaBtn}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
