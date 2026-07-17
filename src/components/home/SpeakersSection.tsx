"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { useLang } from "@/lib/i18n";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { supabase, type Speaker } from "@/lib/supabase";

const BG_COLORS = ["1e5238", "163d2a", "246444", "1e5238", "163d2a", "246444", "1e5238", "163d2a"];

// Blob unique par carte : couleur, position, taille, timing
const BLOBS = [
  { r: "196,154,48", opacity: 0.28, x: "78%",  y: "18%",  size: 140, duration: "5.2s", delay: "0s"   },
  { r: "36,100,68",  opacity: 0.38, x: "18%",  y: "72%",  size: 160, duration: "6.1s", delay: "1.3s" },
  { r: "196,154,48", opacity: 0.22, x: "25%",  y: "22%",  size: 130, duration: "4.8s", delay: "0.7s" },
  { r: "36,100,68",  opacity: 0.32, x: "72%",  y: "68%",  size: 150, duration: "5.6s", delay: "2.0s" },
];

function avatarUrl(name: string, bg: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=200&bold=true&font-size=0.38`;
}

function SpeakerCard({
  speaker, i, lang, confirmedLabel, visible,
}: {
  speaker: Speaker; i: number; lang: string; confirmedLabel: string; visible: boolean;
}) {
  const blob = BLOBS[i % BLOBS.length];

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden cursor-default
        hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(0,0,0,0.45)]
        transition-all duration-400 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        background: "rgba(255,255,255,0.045)",
        border: "1px solid rgba(255,255,255,0.09)",
        transitionDelay: visible ? "0ms" : `${(i % 4) * 90}ms`,
      }}
    >
      <GlowingEffect spread={50} glow={false} disabled={false} proximity={70} inactiveZone={0.01} borderWidth={1.5} variant="forest" />

      {/* ── Blob animé énergie ── */}
      <div
        className="blob-energy absolute rounded-full pointer-events-none"
        style={{
          width: blob.size,
          height: blob.size,
          left: blob.x,
          top: blob.y,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(${blob.r},${blob.opacity}) 0%, transparent 70%)`,
          filter: "blur(28px)",
          animationDuration: blob.duration,
          animationDelay: blob.delay,
        }}
      />

      {/* Grain subtil */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "150px" }} />

      {/* Contenu */}
      <div className="relative z-10 p-5 text-center">

        {/* Avatar */}
        <div className="relative w-fit mx-auto mb-4">
          <div
            className="w-20 h-20 rounded-full p-[2.5px] transition-all duration-300 group-hover:p-[3.5px]"
            style={{ background: "linear-gradient(135deg, #c49a30, #e8c96a, #a07828)" }}
          >
            {speaker.photo_url ? (
              <img
                src={speaker.photo_url}
                alt={speaker.name}
                className="w-full h-full rounded-full object-cover"
                style={{ objectPosition: `${(speaker.photo_focal_x ?? 0.5) * 100}% ${(speaker.photo_focal_y ?? 0.5) * 100}%` }}
              />
            ) : (
              <img
                src={avatarUrl(speaker.name, BG_COLORS[i % BG_COLORS.length])}
                alt={speaker.name}
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>
          {/* Badge check */}
          <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full border-2"
            style={{ backgroundColor: "#246444", borderColor: "#071810" }}>
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </div>

        {/* Nom */}
        <div className="font-heading font-bold text-sm leading-tight mb-1.5 transition-colors duration-200"
          style={{ color: "rgba(255,255,255,0.92)" }}>
          {speaker.name}
        </div>

        {/* Titre */}
        <div className="text-[11px] leading-snug mb-4 min-h-[2.5rem] flex items-center justify-center"
          style={{ color: "rgba(255,255,255,0.42)" }}>
          {lang === "en" ? (speaker.title_en || speaker.title_fr) : speaker.title_fr}
        </div>

        {/* Pays + badge */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.38)" }}>
            <span>{speaker.flag}</span>
            <span>{lang === "en" ? (speaker.country_en || speaker.country_fr) : speaker.country_fr}</span>
          </span>
          <span className="w-px h-3" style={{ backgroundColor: "rgba(255,255,255,0.12)" }} />
          <span className="text-[10px] font-bold tracking-wider" style={{ color: "#c49a30" }}>
            {confirmedLabel}
          </span>
        </div>
      </div>

      {/* Barre dorée bas au hover */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-400"
        style={{ background: "linear-gradient(to right, #246444, #c49a30)", width: "0%" }}
      />
      <style jsx>{`
        .group:hover div:last-child { width: 65% !important; }
        .blob-energy {
          animation: blobFloat var(--blob-dur, 5s) ease-in-out infinite;
        }
        @keyframes blobFloat {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          30%  { transform: translate(calc(-50% + 10px), calc(-50% - 8px)) scale(1.15); }
          65%  { transform: translate(calc(-50% - 7px), calc(-50% + 6px)) scale(0.92); }
        }
      `}</style>
    </div>
  );
}

export default function SpeakersSection() {
  const { lang, t } = useLang();
  const sp = t.speakersSection;
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [visible, setVisible] = useState<boolean[]>([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("speakers")
      .select("*")
      .eq("confirmed", true)
      .order("order_index")
      .then(({ data }) => {
        if (data) {
          const limited = data.slice(0, 4);
          setSpeakers(limited);
          setVisible(new Array(limited.length).fill(false));
        }
      });
  }, []);

  useEffect(() => {
    if (!speakers.length) return;

    const headerObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); headerObs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (headerRef.current) headerObs.observe(headerRef.current);

    const cardObservers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisible(prev => { const n = [...prev]; n[i] = true; return n; });
            }, (i % 4) * 90);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return obs;
    });

    return () => {
      headerObs.disconnect();
      cardObservers.forEach(o => o?.disconnect());
    };
  }, [speakers]);

  return (
    <section className="py-14 md:py-24 px-4 relative overflow-hidden" style={{ backgroundColor: "#071810" }}>
      {/* Grille fond */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)" }} />
      {/* Glow ambiance haut */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full pointer-events-none blur-[130px] opacity-18"
        style={{ background: "radial-gradient(ellipse, rgba(36,100,68,0.45) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div
          ref={headerRef}
          className={`flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3 block" style={{ color: "#c49a30" }}>{sp.label}</p>
            <h2 className="text-4xl md:text-5xl font-heading font-black leading-tight text-white">
              {sp.title} <span style={{ color: "#c49a30" }}>{sp.titleHighlight}</span>
            </h2>
            <div className="w-14 h-[3px] bg-gold-400 rounded-full mt-5" />
          </div>
          <TransitionLink
            href="/intervenants"
            className="self-start md:self-auto inline-flex items-center gap-2 font-semibold text-sm rounded-lg px-5 py-2.5 transition-all duration-200 shrink-0 hover:opacity-80"
            style={{ border: "1px solid rgba(196,154,48,0.35)", color: "#c49a30" }}
          >
            {sp.ctaBtn}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </TransitionLink>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {speakers.map((speaker, i) => (
            <div key={speaker.id} ref={el => { cardRefs.current[i] = el; }}>
              <SpeakerCard
                speaker={speaker}
                i={i}
                lang={lang}
                confirmedLabel={sp.confirmedBadge}
                visible={visible[i]}
              />
            </div>
          ))}
        </div>

        {speakers.length > 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.32)" }}>
              {sp.more} <span className="font-semibold" style={{ color: "#c49a30" }}>12+ {sp.moreSuffix}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
