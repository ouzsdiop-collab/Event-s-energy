"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Calendar } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

type SessionType = "Protocole" | "Panel" | "Table ronde" | "Networking" | "B2B";

interface Session {
  time: string;
  end: string;
  type: SessionType;
  title: string;
  location: string;
  desc: string;
  speakers?: { name: string; initials: string }[];
}

const TYPE_STYLE: Record<SessionType, { label: string; color: string; dot: string }> = {
  Protocole:      { label: "Protocole",     color: "rgba(196,154,48,0.12)",  dot: "#c49a30" },
  Panel:          { label: "Panel",         color: "rgba(36,100,68,0.10)",   dot: "#246444" },
  "Table ronde":  { label: "Table ronde",   color: "rgba(30,82,56,0.10)",    dot: "#1e5238" },
  Networking:     { label: "Networking",    color: "rgba(100,160,120,0.12)", dot: "#5a9e78" },
  B2B:            { label: "Rendez-vous B2B", color: "rgba(196,154,48,0.08)", dot: "#a07828" },
};

const DAYS: { label: string; short: string; sessions: Session[] }[] = [
  {
    label: "3 février 2027",
    short: "Jour 1",
    sessions: [
      {
        time: "08:30", end: "09:30",
        type: "Protocole",
        title: "Cérémonie d'ouverture officielle",
        location: "Salle Plénière",
        desc: "Allocutions d'ouverture en présence des autorités, des partenaires institutionnels et des leaders du secteur.",
        speakers: [
          { name: "Romuald Wadagni", initials: "RW" },
          { name: "Wole Ogunsanya", initials: "WO" },
          { name: "Mamadou Sangafowa", initials: "MS" },
        ],
      },
      {
        time: "09:45", end: "11:15",
        type: "Panel",
        title: "Financer les infrastructures gazières régionales",
        location: "Salle Plénière",
        desc: "Mobiliser les capitaux pour développer des infrastructures de transport, de stockage et de distribution compétitives.",
        speakers: [
          { name: "Amadou Hott", initials: "AH" },
          { name: "Amina Benkhadra", initials: "AB" },
          { name: "Fatoumata Bah", initials: "FB" },
        ],
      },
      {
        time: "11:30", end: "12:45",
        type: "Table ronde",
        title: "Gaz naturel et sécurité énergétique dans l'espace UEMOA",
        location: "Salle Plénière",
        desc: "Rôle du gaz naturel dans la transition énergétique et la sécurité d'approvisionnement régionale.",
        speakers: [
          { name: "Mahaman Laouan Gaya", initials: "ML" },
          { name: "Kassimu Issa", initials: "KI" },
        ],
      },
      {
        time: "12:45", end: "14:00",
        type: "Networking",
        title: "Déjeuner & réseautage",
        location: "Espace Marina",
        desc: "Espace d'échanges informels entre participants.",
      },
      {
        time: "14:00", end: "15:30",
        type: "Panel",
        title: "Cadres réglementaires et intégration régionale",
        location: "Salle Plénière",
        desc: "Harmoniser les politiques nationales pour un marché gazier régional cohérent et attractif.",
        speakers: [
          { name: "Aïssatou Diallo", initials: "AD" },
          { name: "Cheikh Tidiane Mbaye", initials: "CT" },
        ],
      },
      {
        time: "15:45", end: "17:45",
        type: "B2B",
        title: "Rencontres B2B — Session 1",
        location: "Salles B2B",
        desc: "Sessions préprogrammées entre investisseurs, développeurs et fournisseurs. Sur invitation uniquement.",
      },
      {
        time: "19:30", end: "22:00",
        type: "Protocole",
        title: "Dîner officiel des délégations",
        location: "Salle Marina",
        desc: "Dîner de gala et réseautage institutionnel.",
      },
    ],
  },
  {
    label: "4 février 2027",
    short: "Jour 2",
    sessions: [
      {
        time: "09:00", end: "10:30",
        type: "Panel",
        title: "Mesures incitatives à l'investissement privé",
        location: "Salle Plénière",
        desc: "Créer un environnement favorable à l'investissement privé dans toute la chaîne de valeur du gaz naturel.",
        speakers: [
          { name: "Kofi Asante Mensah", initials: "KM" },
          { name: "Amara Kouyaté", initials: "AK" },
        ],
      },
      {
        time: "10:45", end: "12:15",
        type: "Table ronde",
        title: "Valorisation du gaz associé et économie circulaire",
        location: "Salle Plénière",
        desc: "Réduire le torchage et valoriser le gaz associé comme levier de développement industriel régional.",
        speakers: [
          { name: "Wole Ogunsanya", initials: "WO" },
          { name: "Kassimu Issa", initials: "KI" },
        ],
      },
      {
        time: "12:15", end: "14:00",
        type: "Networking",
        title: "Déjeuner & réseautage",
        location: "Espace Marina",
        desc: "Déjeuner libre entre participants.",
      },
      {
        time: "14:00", end: "17:00",
        type: "B2B",
        title: "Rencontres B2B — Session 2",
        location: "Salles B2B",
        desc: "Deuxième série de rencontres B2B préprogrammées. Sur invitation uniquement.",
      },
      {
        time: "17:15", end: "18:30",
        type: "Table ronde",
        title: "Financement vert et gaz naturel : compatibilité ou contradiction ?",
        location: "Salle Plénière",
        desc: "Standards ESG, taxonomies vertes et place du gaz naturel dans les stratégies de financement durable.",
        speakers: [
          { name: "Fatoumata Bah", initials: "FB" },
          { name: "Amara Kouyaté", initials: "AK" },
        ],
      },
    ],
  },
  {
    label: "5 février 2027",
    short: "Jour 3",
    sessions: [
      {
        time: "09:00", end: "10:30",
        type: "Panel",
        title: "Feuille de route régionale : vers un marché UEMOA intégré",
        location: "Salle Plénière",
        desc: "Synthèse des trois jours et définition des engagements collectifs pour structurer le marché gazier régional.",
        speakers: [
          { name: "Amadou Hott", initials: "AH" },
          { name: "Mahaman Laouan Gaya", initials: "ML" },
          { name: "Aïssatou Diallo", initials: "AD" },
        ],
      },
      {
        time: "10:45", end: "12:00",
        type: "Table ronde",
        title: "Formation de la prochaine génération d'experts gaziers",
        location: "Salle Plénière",
        desc: "Enjeux de formation, de transfert de compétences et d'emploi local dans les projets gaziers africains.",
        speakers: [
          { name: "Cheikh Tidiane Mbaye", initials: "CT" },
        ],
      },
      {
        time: "12:00", end: "13:30",
        type: "Networking",
        title: "Déjeuner de clôture",
        location: "Espace Marina",
        desc: "Dernier moment d'échanges entre participants avant la cérémonie de clôture.",
      },
      {
        time: "14:00", end: "15:30",
        type: "Protocole",
        title: "Cérémonie de clôture & déclaration finale",
        location: "Salle Plénière",
        desc: "Lecture de la déclaration de Cotonou et remise des reconnaissances aux partenaires de l'édition inaugurale.",
        speakers: [
          { name: "Romuald Wadagni", initials: "RW" },
          { name: "Wole Ogunsanya", initials: "WO" },
        ],
      },
    ],
  },
];

const FILTERS: (SessionType | "Tous")[] = ["Tous", "Panel", "Table ronde", "B2B", "Protocole", "Networking"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgrammePage() {
  const [activeDay, setActiveDay] = useState(0);
  const [activeFilter, setActiveFilter] = useState<SessionType | "Tous">("Tous");
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered = DAYS[activeDay].sessions.filter(
    (s) => activeFilter === "Tous" || s.type === activeFilter
  );

  return (
    <div style={{ backgroundColor: "#f4f7f5", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-12" ref={headerRef}>
        <p className={`text-[11px] font-bold uppercase tracking-[0.22em] mb-8 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ color: "#c49a30", transitionDelay: "0.1s" }}>
          SOFGN 2027
        </p>

        <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "0.2s" }}>
          <h1 className="font-heading font-black leading-[0.88]">
            <span className="block" style={{ fontSize: "clamp(3rem, 7vw, 6rem)", letterSpacing: "-0.03em", color: "#0f2d1f" }}>
              PROGRAMME
            </span>
            <span className="block" style={{
              fontSize: "clamp(3rem, 7vw, 6rem)", letterSpacing: "-0.03em",
              background: "linear-gradient(90deg, #246444, #1e5238 50%, #c49a30)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              DU SALON
            </span>
          </h1>

          <div className={`flex flex-col gap-2 md:text-right transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "0.35s" }}>
            <div className="flex items-center gap-2 md:justify-end text-sm" style={{ color: "rgba(15,45,31,0.50)" }}>
              <Calendar className="w-3.5 h-3.5" />
              3–5 février 2027
            </div>
            <div className="flex items-center gap-2 md:justify-end text-sm" style={{ color: "rgba(15,45,31,0.50)" }}>
              <MapPin className="w-3.5 h-3.5" />
              Sofitel Cotonou Marina
            </div>
            <Link href="/inscription"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide transition-colors duration-200 md:self-end"
              style={{ color: "#c49a30" }}>
              S'inscrire <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px transition-all duration-700 ${headerVisible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "0.45s", background: "linear-gradient(to right, rgba(36,100,68,0.30), rgba(196,154,48,0.20), transparent)" }} />
      </div>

      {/* ── Controls ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mb-10">

        {/* Day tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {DAYS.map((d, i) => (
            <button key={i} onClick={() => { setActiveDay(i); setActiveFilter("Tous"); }}
              className="transition-all duration-200 rounded-xl px-5 py-2.5 text-sm font-semibold"
              style={{
                backgroundColor: activeDay === i ? "#0f2d1f" : "white",
                color: activeDay === i ? "white" : "rgba(15,45,31,0.55)",
                border: `1px solid ${activeDay === i ? "transparent" : "rgba(36,100,68,0.15)"}`,
                boxShadow: activeDay === i ? "0 4px 14px rgba(10,31,20,0.18)" : "none",
              }}>
              <span className="font-mono text-[10px] uppercase tracking-wide mr-2 opacity-60">{d.short}</span>
              {d.label}
            </button>
          ))}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="transition-all duration-200 rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
              style={{
                backgroundColor: activeFilter === f
                  ? (f === "Tous" ? "#246444" : TYPE_STYLE[f as SessionType]?.dot ?? "#246444")
                  : "white",
                color: activeFilter === f ? "white" : "rgba(15,45,31,0.55)",
                border: `1px solid ${activeFilter === f ? "transparent" : "rgba(36,100,68,0.15)"}`,
              }}>
              {f !== "Tous" && (
                <span className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: activeFilter === f ? "rgba(255,255,255,0.6)" : TYPE_STYLE[f as SessionType]?.dot }} />
              )}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <div className="flex flex-col gap-0">
          {filtered.map((session, i) => (
            <SessionCard key={`${activeDay}-${i}`} session={session} index={i} />
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16" style={{ color: "rgba(15,45,31,0.35)" }}>
              <p className="text-sm">Aucune session pour ce filtre.</p>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(36,100,68,0.12)" }}>
          <p className="text-sm" style={{ color: "rgba(15,45,31,0.45)" }}>
            Programme sous réserve de modifications · Version du 3 juin 2026
          </p>
          <div className="flex gap-3">
            <Link href="/inscription"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#246444", color: "white" }}>
              S'inscrire <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/intervenants"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200"
              style={{ border: "1px solid rgba(36,100,68,0.25)", color: "#246444" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(36,100,68,0.05)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
              Intervenants <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({ session, index }: { session: Session; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const style = TYPE_STYLE[session.type];

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
        { threshold: 0.05 }
      );
      if (ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, index * 40);
    return () => clearTimeout(timer);
  }, [session, index]);

  const isBreak = session.type === "Networking";

  if (isBreak) {
    return (
      <div ref={ref}
        className="flex items-center gap-6 py-4 transition-all duration-500"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)" }}>
        <span className="font-mono text-xs w-24 shrink-0 text-right" style={{ color: "rgba(36,100,68,0.35)" }}>
          {session.time}
        </span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(36,100,68,0.15), transparent)" }} />
        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: style.color, color: style.dot }}>
          {session.title}
        </span>
        <div className="flex-1 h-px hidden md:block" style={{ background: "linear-gradient(to left, rgba(36,100,68,0.15), transparent)" }} />
      </div>
    );
  }

  return (
    <div ref={ref}
      className="border-t flex gap-0 transition-all duration-500"
      style={{
        borderColor: "rgba(36,100,68,0.10)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}>

      {/* Time column */}
      <div className="hidden md:flex flex-col items-end pt-7 pr-8 w-28 shrink-0">
        <span className="font-mono text-xs font-semibold" style={{ color: "#246444" }}>{session.time}</span>
        <span className="font-mono text-[10px] mt-0.5" style={{ color: "rgba(36,100,68,0.35)" }}>–{session.end}</span>
      </div>

      {/* Left accent line */}
      <div className="hidden md:block w-px my-4 shrink-0"
        style={{ backgroundColor: style.dot, opacity: 0.25 }} />

      {/* Content */}
      <div className="flex-1 py-7 pl-0 md:pl-8">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {/* Mobile time */}
          <span className="md:hidden font-mono text-xs font-semibold" style={{ color: "#246444" }}>
            {session.time}–{session.end}
          </span>
          {/* Type badge */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{ backgroundColor: style.color, color: style.dot }}>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: style.dot }} />
            {style.label}
          </span>
          {/* Location */}
          <span className="text-xs flex items-center gap-1" style={{ color: "rgba(15,45,31,0.35)" }}>
            <MapPin className="w-3 h-3" />
            {session.location}
          </span>
        </div>

        <h3 className="font-heading font-bold text-base md:text-lg mb-2 leading-tight" style={{ color: "#0f2d1f" }}>
          {session.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4 max-w-xl" style={{ color: "rgba(15,45,31,0.55)" }}>
          {session.desc}
        </p>

        {/* Speakers */}
        {session.speakers && session.speakers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {session.speakers.map((sp) => (
              <div key={sp.name} className="flex items-center gap-2 bg-white border border-gray-100 rounded-full pl-1 pr-3 py-1">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                  style={{ background: "linear-gradient(135deg, #1e5238, #0f2d1f)", color: "rgba(196,154,48,0.9)" }}>
                  {sp.initials}
                </div>
                <span className="text-xs font-medium" style={{ color: "rgba(15,45,31,0.70)" }}>{sp.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
