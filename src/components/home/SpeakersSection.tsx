"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import TransitionLink from "@/components/TransitionLink";
import { useLang } from "@/lib/i18n";
import { supabase, type Speaker } from "@/lib/supabase";

const BG_COLORS = ["1e5238","163d2a","246444","1e5238","163d2a","246444","1e5238","163d2a"];

function avatarUrl(name: string, bg: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=200&bold=true&font-size=0.38`;
}

function SpeakerCard({ speaker, i, lang }: { speaker: Speaker; i: number; lang: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 12, y: (x - 0.5) * -12 });
  }, []);

  const onLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative shrink-0 rounded-2xl overflow-hidden select-none"
      style={{
        width: 180,
        background: "linear-gradient(135deg, #1a3a28 0%, #0f2d1f 100%)",
        border: "1px solid rgba(196,154,48,0.12)",
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.04 : 1})`,
        transition: hovered ? "transform 0.12s ease" : "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
        boxShadow: hovered
          ? "0 20px 40px rgba(10,28,18,0.45), 0 0 0 1px rgba(196,154,48,0.25)"
          : "0 4px 16px rgba(10,28,18,0.20)",
        willChange: "transform",
        cursor: "default",
      }}
    >
      {/* Glow top-right */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: "#c49a30", opacity: hovered ? 0.18 : 0.07, transition: "opacity 0.4s" }} />

      <div className="p-5 flex flex-col items-center text-center gap-3">
        {/* Photo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full p-[2px]"
            style={{ background: hovered ? "linear-gradient(135deg,#c49a30,#e8c96a,#a07828)" : "linear-gradient(135deg,rgba(196,154,48,0.4),rgba(196,154,48,0.15))", transition: "background 0.4s" }}>
            {speaker.photo_url ? (
              <img src={speaker.photo_url} alt={speaker.name}
                className="w-full h-full rounded-full object-cover"
                style={{ objectPosition: `${(speaker.photo_focal_x ?? 0.5)*100}% ${(speaker.photo_focal_y ?? 0.5)*100}%` }} />
            ) : (
              <img src={avatarUrl(speaker.name, BG_COLORS[i % BG_COLORS.length])}
                alt={speaker.name} className="w-full h-full rounded-full object-cover" />
            )}
          </div>
          {/* Badge confirmé */}
          <span className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center"
            style={{ backgroundColor: "#246444", borderColor: "#0f2d1f", width: 18, height: 18 }}>
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </div>

        {/* Nom */}
        <div>
          <p className="font-heading font-bold text-sm leading-tight mb-1"
            style={{ color: hovered ? "#c49a30" : "rgba(255,255,255,0.92)", transition: "color 0.3s" }}>
            {speaker.name}
          </p>
          <p className="text-[10px] leading-snug" style={{ color: "rgba(255,255,255,0.45)" }}>
            {lang === "en" ? (speaker.title_en || speaker.title_fr) : speaker.title_fr}
          </p>
        </div>

        {/* Pays */}
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          <span>{speaker.flag}</span>
          <span>{lang === "en" ? (speaker.country_en || speaker.country_fr) : speaker.country_fr}</span>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ speakers, lang, reverse = false, speed = 32 }: {
  speakers: Speaker[]; lang: string; reverse?: boolean; speed?: number;
}) {
  const [paused, setPaused] = useState(false);
  // Duplicate for seamless loop
  const items = [...speakers, ...speakers, ...speakers];

  return (
    <div className="overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        className="flex gap-4"
        style={{
          animation: `marquee${reverse ? "Rev" : ""} ${speed}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
          willChange: "transform",
        }}
      >
        {items.map((s, i) => (
          <SpeakerCard key={`${s.id}-${i}`} speaker={s} i={i} lang={lang} />
        ))}
      </div>
    </div>
  );
}

export default function SpeakersSection() {
  const { lang, t } = useLang();
  const sp = t.speakersSection;
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("speakers").select("*").eq("confirmed", true).order("order_index")
      .then(({ data }) => { if (data) setSpeakers(data); });
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  if (!speakers.length) return null;

  // Split into two rows
  const mid = Math.ceil(speakers.length / 2);
  const row1 = speakers.slice(0, mid);
  const row2 = speakers.slice(mid).length ? speakers.slice(mid) : speakers.slice(0, mid).reverse();

  return (
    <section className="py-14 md:py-24 overflow-hidden relative" style={{ backgroundColor: "#0a1c12" }}>
      {/* Styles keyframes */}
      <style>{`
        @keyframes marquee    { from { transform: translateX(0); }    to { transform: translateX(calc(-100% / 3)); } }
        @keyframes marqueeRev { from { transform: translateX(calc(-100% / 3)); } to { transform: translateX(0); } }
      `}</style>

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "#246444", opacity: 0.08 }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "#c49a30", opacity: 0.06 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div ref={headerRef}
          className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#c49a30" }}>{sp.label}</p>
            <h2 className="text-4xl md:text-5xl font-heading font-black leading-tight" style={{ color: "white" }}>
              {sp.title} <span style={{ color: "#c49a30" }}>{sp.titleHighlight}</span>
            </h2>
            <div className="w-14 h-[3px] rounded-full mt-5" style={{ background: "linear-gradient(to right, #c49a30, transparent)" }} />
          </div>
          <TransitionLink href="/intervenants"
            className="self-start md:self-auto inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full shrink-0 transition-all duration-200"
            style={{ border: "1px solid rgba(196,154,48,0.30)", color: "#c49a30", backgroundColor: "rgba(196,154,48,0.06)" }}>
            {sp.ctaBtn}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </TransitionLink>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-4">
        <MarqueeRow speakers={row1} lang={lang} reverse={false} speed={35} />
        <MarqueeRow speakers={row2} lang={lang} reverse={true}  speed={28} />
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right, #0a1c12, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left, #0a1c12, transparent)" }} />

      {/* Footer count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 relative z-10">
        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
          {sp.more} <span className="font-semibold" style={{ color: "rgba(255,255,255,0.50)" }}>12+ {sp.moreSuffix}</span>
        </p>
      </div>
    </section>
  );
}
