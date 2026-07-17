"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { useLang } from "@/lib/i18n";
import { supabase, type ProgrammeSession } from "@/lib/supabase";

const DAY_COLORS = ["#c49a30", "#246444", "#1e5238"];

const FALLBACK_SESSIONS = [
  { id: "f1", day: "Jour 1", day_label: "3 fév.", time_start: "09:00", time_end: "10:30", title_fr: "Cérémonie d'ouverture & discours institutionnels", title_en: "Opening ceremony & institutional speeches", type: "plenary", speakers_text: "Ministre de l'Énergie du Bénin, DG VerteVille Energy", location: "Grande salle" },
  { id: "f2", day: "Jour 1", day_label: "3 fév.", time_start: "14:00", time_end: "16:00", title_fr: "Financement des infrastructures gazières : modèles et perspectives", title_en: "Financing gas infrastructure: models and prospects", type: "panel", speakers_text: "Experts Banque Mondiale, BOAD, investisseurs privés", location: "Salle Atlantique" },
  { id: "f3", day: "Jour 2", day_label: "4 fév.", time_start: "10:00", time_end: "12:00", title_fr: "Harmonisation réglementaire UEMOA : état des lieux et roadmap", title_en: "UEMOA regulatory harmonisation: status and roadmap", type: "roundtable", speakers_text: "Régulateurs nationaux, Commission UEMOA", location: "Salle Atlantique" },
];

type SessionItem = {
  id: string;
  day: string;
  day_label?: string;
  time_start: string;
  time_end: string;
  title_fr: string;
  title_en?: string;
  type: string;
  speakers_text?: string;
  location?: string;
};

const TYPE_LABELS: Record<string, { fr: string; en: string; color: string }> = {
  plenary:    { fr: "Plénière",     en: "Plenary",     color: "#c49a30" },
  panel:      { fr: "Panel",        en: "Panel",        color: "#246444" },
  roundtable: { fr: "Table ronde",  en: "Roundtable",  color: "#5b8a6e" },
  workshop:   { fr: "Atelier",      en: "Workshop",     color: "#1e5238" },
  networking: { fr: "Networking",   en: "Networking",   color: "#7a6020" },
};

function SessionCard({ session, i, lang, visible }: { session: SessionItem; i: number; lang: string; visible: boolean }) {
  const [hovered, setHovered] = useState(false);
  const typeInfo = TYPE_LABELS[session.type] || { fr: session.type, en: session.type, color: "#246444" };
  const dayColor = DAY_COLORS[i % DAY_COLORS.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden transition-all"
      style={{
        background: "white",
        border: `1px solid ${hovered ? "rgba(196,154,48,0.35)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered ? "0 16px 40px rgba(15,45,31,0.12)" : "0 2px 12px rgba(15,45,31,0.06)",
        transform: visible ? `translateY(${hovered ? -4 : 0}px)` : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transition: `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease, box-shadow 0.25s, border-color 0.25s`,
      }}
    >
      {/* Barre colorée top */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${dayColor}, transparent)` }} />

      <div className="p-6">
        {/* Jour + horaire */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: `${dayColor}15`, color: dayColor }}>
            {session.day_label || session.day}
          </span>
          <span className="text-xs font-mono font-semibold" style={{ color: "rgba(0,0,0,0.35)" }}>
            {session.time_start} – {session.time_end}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-auto"
            style={{ background: `${typeInfo.color}18`, color: typeInfo.color }}>
            {lang === "en" ? typeInfo.en : typeInfo.fr}
          </span>
        </div>

        {/* Titre */}
        <h3 className="font-heading font-bold text-gray-900 text-base leading-snug mb-4"
          style={{ transition: "color 0.2s", color: hovered ? "#0f2d1f" : "#111827" }}>
          {lang === "en" ? (session.title_en || session.title_fr) : session.title_fr}
        </h3>

        {/* Lieu + intervenants */}
        <div className="flex flex-col gap-1.5">
          {session.location && (
            <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(0,0,0,0.40)" }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {session.location}
            </div>
          )}
          {session.speakers_text && (
            <div className="flex items-start gap-2 text-xs" style={{ color: "rgba(0,0,0,0.40)" }}>
              <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-2">{session.speakers_text}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ligne dorée bottom hover */}
      <div className="absolute bottom-0 left-0 h-[2px] rounded-full bg-gradient-to-r from-[#c49a30] to-transparent transition-all duration-500"
        style={{ width: hovered ? "100%" : "0%" }} />
    </div>
  );
}

export default function ProgrammePreview() {
  const { lang, t } = useLang();
  const pp = t.programmePreview;
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("programme_sessions")
      .select("*")
      .order("day_index")
      .order("time_start")
      .limit(3)
      .then(({ data }) => {
        setSessions(data && data.length >= 2 ? (data as SessionItem[]) : FALLBACK_SESSIONS);
      });
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-14 md:py-24 px-4 overflow-hidden" style={{ backgroundColor: "#f7f9f7" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={ref} className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: "#c49a30" }}>{pp.label}</p>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 leading-tight">
              {pp.title} <span style={{ color: "#246444" }}>{pp.titleHighlight}</span>
            </h2>
            <div className="w-14 h-[3px] rounded-full mt-5" style={{ background: "linear-gradient(to right, #c49a30, transparent)" }} />
          </div>
          <TransitionLink href="/programme"
            className="self-start md:self-auto inline-flex items-center gap-2 text-forest-600 font-semibold text-sm border border-forest-200 rounded-lg px-5 py-2.5 hover:bg-forest-50 hover:border-forest-400 transition-all duration-200 shrink-0">
            {pp.ctaBtn}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </TransitionLink>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sessions.map((s, i) => (
            <SessionCard key={s.id} session={s} i={i} lang={lang} visible={visible} />
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-sm" style={{ color: "rgba(0,0,0,0.35)" }}>
          {pp.note}
        </p>
      </div>
    </section>
  );
}
