"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { useLang } from "@/lib/i18n";
import { supabase, type Speaker } from "@/lib/supabase";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const BG_COLORS = ["1e5238", "163d2a", "246444", "1e5238", "163d2a", "246444", "1e5238", "163d2a"];

function avatarUrl(name: string, bg: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=200&bold=true&font-size=0.38`;
}

function SpeakerCard({
  speaker, i, lang, confirmedLabel, visible,
}: {
  speaker: Speaker; i: number; lang: string; confirmedLabel: string; visible: boolean;
}) {
  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border border-gray-100 cursor-default
        shadow-sm hover:shadow-xl hover:shadow-forest-900/10 hover:-translate-y-1.5
        transition-all duration-400 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: visible ? "0ms" : `${(i % 4) * 90}ms` }}
    >
      <GlowingEffect spread={40} glow={false} disabled={false} proximity={60} inactiveZone={0.01} borderWidth={2} variant="forest" />

      {/* Contenu */}
      <div className="relative z-10 text-center">

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
          <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full border-2 border-white"
            style={{ backgroundColor: "#246444" }}>
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </div>

        {/* Nom */}
        <div className="font-heading font-bold text-gray-900 text-sm leading-tight mb-1.5">
          {speaker.name}
        </div>

        {/* Titre */}
        <div className="text-gray-400 text-[11px] leading-snug mb-4 min-h-[2.5rem] flex items-center justify-center">
          {lang === "en" ? (speaker.title_en || speaker.title_fr) : speaker.title_fr}
        </div>

        {/* Pays + badge */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span>{speaker.flag}</span>
            <span>{lang === "en" ? (speaker.country_en || speaker.country_fr) : speaker.country_fr}</span>
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="text-[10px] font-bold text-forest-600 tracking-wider">
            {confirmedLabel}
          </span>
        </div>
      </div>

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
