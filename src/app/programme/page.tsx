"use client";

import { useState, useEffect, useRef } from "react";
import TransitionLink from "@/components/TransitionLink";
import { ArrowUpRight, MapPin, Calendar, Clock } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

type SessionType = "Protocole" | "Panel" | "Table ronde" | "Networking" | "B2B";

interface Session {
  time: string; end: string; type: SessionType;
  title: string; titleEn: string;
  location: string;
  desc: string; descEn: string;
  speakers?: { name: string; initials: string }[];
}

const TYPE_STYLE: Record<SessionType, { label: string; labelEn: string; color: string; dot: string; border: string }> = {
  Protocole:     { label: "Protocole",       labelEn: "Protocol",      color: "rgba(196,154,48,0.10)", dot: "#c49a30", border: "#c49a30" },
  Panel:         { label: "Panel",           labelEn: "Panel",         color: "rgba(36,100,68,0.09)",  dot: "#246444", border: "#246444" },
  "Table ronde": { label: "Table ronde",     labelEn: "Roundtable",    color: "rgba(30,82,56,0.09)",   dot: "#1e5238", border: "#1e5238" },
  Networking:    { label: "Networking",      labelEn: "Networking",    color: "rgba(90,158,120,0.12)", dot: "#5a9e78", border: "#5a9e78" },
  B2B:           { label: "Rendez-vous B2B", labelEn: "B2B Meetings",  color: "rgba(160,120,40,0.09)", dot: "#a07828", border: "#a07828" },
};

function duration(start: string, end: string): string {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

const DAYS: { label: string; labelEn: string; short: string; shortEn: string; date: string; sessions: Session[] }[] = [
  {
    label: "3 février 2027", labelEn: "February 3, 2027", short: "Jour 1", shortEn: "Day 1", date: "03 FÉV",
    sessions: [
      { time: "08:30", end: "09:30", type: "Protocole", title: "Cérémonie d'ouverture officielle", titleEn: "Official Opening Ceremony", location: "Salle Plénière", desc: "Allocutions d'ouverture en présence des autorités, des partenaires institutionnels et des leaders du secteur.", descEn: "Opening addresses in the presence of authorities, institutional partners and sector leaders.", speakers: [{ name: "Romuald Wadagni", initials: "RW" }, { name: "Wole Ogunsanya", initials: "WO" }, { name: "Mamadou Sangafowa", initials: "MS" }] },
      { time: "09:45", end: "11:15", type: "Panel", title: "Financer les infrastructures gazières régionales", titleEn: "Financing Regional Gas Infrastructure", location: "Salle Plénière", desc: "Mobiliser les capitaux pour développer des infrastructures de transport, de stockage et de distribution compétitives.", descEn: "Mobilising capital to develop competitive transport, storage and distribution infrastructure.", speakers: [{ name: "Amadou Hott", initials: "AH" }, { name: "Amina Benkhadra", initials: "AB" }, { name: "Fatoumata Bah", initials: "FB" }] },
      { time: "11:30", end: "12:45", type: "Table ronde", title: "Gaz naturel et sécurité énergétique dans l'espace UEMOA", titleEn: "Natural Gas and Energy Security in the UEMOA Area", location: "Salle Plénière", desc: "Rôle du gaz naturel dans la transition énergétique et la sécurité d'approvisionnement régionale.", descEn: "The role of natural gas in the energy transition and regional supply security.", speakers: [{ name: "Mahaman Laouan Gaya", initials: "ML" }, { name: "Kassimu Issa", initials: "KI" }] },
      { time: "12:45", end: "14:00", type: "Networking", title: "Déjeuner & réseautage", titleEn: "Lunch & Networking", location: "Espace Marina", desc: "", descEn: "" },
      { time: "14:00", end: "15:30", type: "Panel", title: "Cadres réglementaires et intégration régionale", titleEn: "Regulatory Frameworks and Regional Integration", location: "Salle Plénière", desc: "Harmoniser les politiques nationales pour un marché gazier régional cohérent et attractif.", descEn: "Harmonising national policies for a coherent and attractive regional gas market.", speakers: [{ name: "Aïssatou Diallo", initials: "AD" }, { name: "Cheikh Tidiane Mbaye", initials: "CT" }] },
      { time: "15:45", end: "17:45", type: "B2B", title: "Rencontres B2B · Session 1", titleEn: "B2B Meetings · Session 1", location: "Salles B2B", desc: "Sessions préprogrammées entre investisseurs, développeurs et fournisseurs. Sur invitation uniquement.", descEn: "Pre-scheduled meetings between investors, developers and suppliers. By invitation only." },
      { time: "19:30", end: "22:00", type: "Protocole", title: "Dîner officiel des délégations", titleEn: "Official Gala Dinner", location: "Salle Marina", desc: "Dîner de gala et réseautage institutionnel.", descEn: "Gala dinner and institutional networking." },
    ],
  },
  {
    label: "4 février 2027", labelEn: "February 4, 2027", short: "Jour 2", shortEn: "Day 2", date: "04 FÉV",
    sessions: [
      { time: "09:00", end: "10:30", type: "Panel", title: "Mesures incitatives à l'investissement privé", titleEn: "Incentives for Private Investment", location: "Salle Plénière", desc: "Créer un environnement favorable à l'investissement privé dans toute la chaîne de valeur du gaz naturel.", descEn: "Creating a favourable environment for private investment across the entire natural gas value chain.", speakers: [{ name: "Kofi Asante Mensah", initials: "KM" }, { name: "Amara Kouyaté", initials: "AK" }] },
      { time: "10:45", end: "12:15", type: "Table ronde", title: "Valorisation du gaz associé et économie circulaire", titleEn: "Associated Gas Monetisation and Circular Economy", location: "Salle Plénière", desc: "Réduire le torchage et valoriser le gaz associé comme levier de développement industriel régional.", descEn: "Reducing flaring and monetising associated gas as a lever for regional industrial development.", speakers: [{ name: "Wole Ogunsanya", initials: "WO" }, { name: "Kassimu Issa", initials: "KI" }] },
      { time: "12:15", end: "14:00", type: "Networking", title: "Déjeuner & réseautage", titleEn: "Lunch & Networking", location: "Espace Marina", desc: "", descEn: "" },
      { time: "14:00", end: "17:00", type: "B2B", title: "Rencontres B2B · Session 2", titleEn: "B2B Meetings · Session 2", location: "Salles B2B", desc: "Deuxième série de rencontres B2B préprogrammées. Sur invitation uniquement.", descEn: "Second series of pre-scheduled B2B meetings. By invitation only." },
      { time: "17:15", end: "18:30", type: "Table ronde", title: "Financement vert et gaz naturel : compatibilité ou contradiction ?", titleEn: "Green Finance and Natural Gas: Compatibility or Contradiction?", location: "Salle Plénière", desc: "Standards ESG, taxonomies vertes et place du gaz naturel dans les stratégies de financement durable.", descEn: "ESG standards, green taxonomies and the place of natural gas in sustainable finance strategies.", speakers: [{ name: "Fatoumata Bah", initials: "FB" }, { name: "Amara Kouyaté", initials: "AK" }] },
    ],
  },
  {
    label: "5 février 2027", labelEn: "February 5, 2027", short: "Jour 3", shortEn: "Day 3", date: "05 FÉV",
    sessions: [
      { time: "09:00", end: "10:30", type: "Panel", title: "Feuille de route régionale : vers un marché UEMOA intégré", titleEn: "Regional Roadmap: Towards an Integrated UEMOA Market", location: "Salle Plénière", desc: "Synthèse des trois jours et définition des engagements collectifs pour structurer le marché gazier régional.", descEn: "Summary of three days and definition of collective commitments to structure the regional gas market.", speakers: [{ name: "Amadou Hott", initials: "AH" }, { name: "Mahaman Laouan Gaya", initials: "ML" }, { name: "Aïssatou Diallo", initials: "AD" }] },
      { time: "10:45", end: "12:00", type: "Table ronde", title: "Formation de la prochaine génération d'experts gaziers", titleEn: "Training the Next Generation of Gas Experts", location: "Salle Plénière", desc: "Enjeux de formation, de transfert de compétences et d'emploi local dans les projets gaziers africains.", descEn: "Training, skills transfer and local employment challenges in African gas projects.", speakers: [{ name: "Cheikh Tidiane Mbaye", initials: "CT" }] },
      { time: "12:00", end: "13:30", type: "Networking", title: "Déjeuner de clôture", titleEn: "Closing Lunch", location: "Espace Marina", desc: "", descEn: "" },
      { time: "14:00", end: "15:30", type: "Protocole", title: "Cérémonie de clôture & déclaration finale", titleEn: "Closing Ceremony & Final Declaration", location: "Salle Plénière", desc: "Lecture de la déclaration de Cotonou et remise des reconnaissances aux partenaires de l'édition inaugurale.", descEn: "Reading of the Cotonou Declaration and recognition of the partners of the inaugural edition.", speakers: [{ name: "Romuald Wadagni", initials: "RW" }, { name: "Wole Ogunsanya", initials: "WO" }] },
    ],
  },
];

const FILTER_KEYS: (SessionType | "Tous")[] = ["Tous", "Panel", "Table ronde", "B2B", "Protocole", "Networking"];

type DbSession = { id: string; day: number; start_time: string; end_time: string; title_fr: string; title_en: string; description_fr: string; description_en: string; type: string; location: string; speakers_text: string; order_index: number };

function dbToSession(s: DbSession): Session {
  return {
    time: s.start_time.slice(0, 5),
    end: s.end_time.slice(0, 5),
    type: s.type as SessionType,
    title: s.title_fr,
    titleEn: s.title_en || s.title_fr,
    location: s.location || "",
    desc: s.description_fr || "",
    descEn: s.description_en || s.description_fr || "",
    speakers: s.speakers_text ? s.speakers_text.split(",").map(n => n.trim()).filter(Boolean).map(name => ({ name, initials: name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() })) : undefined,
  };
}

function splitByMoment(sessions: Session[]): { morning: Session[]; afternoon: Session[] } {
  const morning: Session[] = [], afternoon: Session[] = [];
  sessions.forEach(s => {
    const h = parseInt(s.time.split(":")[0]);
    if (h < 13) morning.push(s); else afternoon.push(s);
  });
  return { morning, afternoon };
}

export default function ProgrammePage() {
  const [activeDay, setActiveDay] = useState(0);
  const [activeFilter, setActiveFilter] = useState<SessionType | "Tous">("Tous");
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const { lang, t } = useLang();
  const p = t.programme;
  const [days, setDays] = useState(DAYS);

  useEffect(() => {
    supabase.from("programme_sessions").select("*").order("day").order("start_time")
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const grouped = [1, 2, 3].map((d, i) => ({
          ...DAYS[i],
          sessions: (data as DbSession[]).filter(s => s.day === d).map(s => dbToSession(s)),
        }));
        setDays(grouped);
      });
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  const allSessions = days[activeDay].sessions;
  const filtered = activeFilter === "Tous" ? allSessions : allSessions.filter(s => s.type === activeFilter);
  const { morning, afternoon } = splitByMoment(filtered);

  const filterLabel = (f: SessionType | "Tous") => {
    if (f === "Tous") return p.filterAll;
    return lang === "en" ? TYPE_STYLE[f].labelEn : TYPE_STYLE[f].label;
  };

  return (
    <div style={{ backgroundColor: "#f4f7f5", minHeight: "100vh" }}>

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-24 pb-10" ref={headerRef}>
        <p className={`text-[11px] font-bold uppercase tracking-[0.22em] mb-6 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ color: "#c49a30" }}>
          {p.eyebrow}
        </p>
        <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "0.1s" }}>
          <h1 className="font-heading font-black leading-[0.88]">
            <span className="block" style={{ fontSize: "clamp(2.2rem,8vw,5.5rem)", letterSpacing: "-0.03em", color: "#0f2d1f" }}>{p.title1}</span>
            <span className="block" style={{ fontSize: "clamp(2.2rem,8vw,5.5rem)", letterSpacing: "-0.03em", background: "linear-gradient(90deg,#246444,#1e5238 50%,#c49a30)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{p.title2}</span>
          </h1>
          <div className="flex flex-col gap-2 md:text-right">
            <div className="flex items-center gap-2 md:justify-end text-sm" style={{ color: "rgba(15,45,31,0.45)" }}>
              <Calendar className="w-3.5 h-3.5" />{p.date}
            </div>
            <div className="flex items-center gap-2 md:justify-end text-sm" style={{ color: "rgba(15,45,31,0.45)" }}>
              <MapPin className="w-3.5 h-3.5" />{p.location}
            </div>
            <a href="mailto:contact@soafgn2027.org"
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide md:self-end"
              style={{ color: "#c49a30" }}>
              {p.registerCta} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        <div className={`h-px transition-all duration-700 ${headerVisible ? "opacity-100" : "opacity-0"}`}
          style={{ background: "linear-gradient(to right,rgba(36,100,68,0.3),rgba(196,154,48,0.2),transparent)" }} />
      </div>

      {/* Day selector */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {days.map((d, i) => (
            <button key={i} onClick={() => { setActiveDay(i); setActiveFilter("Tous"); }}
              className="relative rounded-2xl p-4 text-left transition-all duration-200 overflow-hidden group"
              style={{
                backgroundColor: activeDay === i ? "#0f2d1f" : "white",
                border: `1px solid ${activeDay === i ? "transparent" : "rgba(36,100,68,0.12)"}`,
                boxShadow: activeDay === i ? "0 8px 28px rgba(10,31,20,0.22)" : "0 2px 8px rgba(10,31,20,0.05)",
              }}>
              {activeDay === i && (
                <div className="absolute inset-0 opacity-20"
                  style={{ background: "radial-gradient(circle at top right, #c49a30, transparent 70%)" }} />
              )}
              <div className="relative z-10">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: activeDay === i ? "#c49a30" : "rgba(36,100,68,0.40)" }}>
                  {lang === "en" ? d.shortEn : d.short}
                </span>
                <span className="block font-heading font-black text-base leading-tight"
                  style={{ color: activeDay === i ? "white" : "#0f2d1f" }}>
                  {lang === "en" ? d.labelEn : d.label}
                </span>
                <span className="block text-[11px] mt-1.5 font-medium"
                  style={{ color: activeDay === i ? "rgba(255,255,255,0.40)" : "rgba(15,45,31,0.35)" }}>
                  {d.sessions.filter(s => s.type !== "Networking").length} {lang === "en" ? "sessions" : "sessions"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 mb-10">
        <div className="flex gap-2 flex-wrap">
          {FILTER_KEYS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="transition-all duration-200 rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
              style={{
                backgroundColor: activeFilter === f
                  ? (f === "Tous" ? "#246444" : TYPE_STYLE[f as SessionType]?.dot)
                  : "white",
                color: activeFilter === f ? "white" : "rgba(15,45,31,0.55)",
                border: `1px solid ${activeFilter === f ? "transparent" : "rgba(36,100,68,0.15)"}`,
                boxShadow: activeFilter === f ? "0 2px 8px rgba(10,31,20,0.15)" : "none",
              }}>
              {f !== "Tous" && (
                <span className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: activeFilter === f ? "rgba(255,255,255,0.7)" : TYPE_STYLE[f as SessionType]?.dot }} />
              )}
              {filterLabel(f)}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "rgba(15,45,31,0.35)" }}>
            <p className="text-sm">{p.noSessions}</p>
          </div>
        ) : (
          <>
            {morning.length > 0 && (
              <TimeBlock label={lang === "en" ? "Morning" : "Matinée"} sessions={morning} lang={lang} startIndex={0} />
            )}
            {afternoon.length > 0 && (
              <TimeBlock label={lang === "en" ? "Afternoon & Evening" : "Après-midi & soirée"} sessions={afternoon} lang={lang} startIndex={morning.length} />
            )}
          </>
        )}

        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(36,100,68,0.12)" }}>
          <p className="text-sm" style={{ color: "rgba(15,45,31,0.40)" }}>
            {lang === "en" ? "Programme subject to change · Version June 2026" : "Programme sous réserve de modifications · Version juin 2026"}
          </p>
          <div className="flex gap-3">
            <a href="mailto:contact@soafgn2027.org"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#246444", color: "white" }}>
              {p.registerCta} <ArrowUpRight className="w-4 h-4" />
            </a>
            <TransitionLink href="/intervenants"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:bg-forest-50"
              style={{ border: "1px solid rgba(36,100,68,0.20)", color: "#246444" }}>
              {lang === "en" ? "Speakers" : "Intervenants"} <ArrowUpRight className="w-4 h-4" />
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeBlock({ label, sessions, lang, startIndex }: { label: string; sessions: Session[]; lang: string; startIndex: number }) {
  return (
    <div className="mb-10">
      {/* Block header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.20em]" style={{ color: "rgba(15,45,31,0.35)" }}>{label}</span>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, rgba(36,100,68,0.15), transparent)" }} />
      </div>

      {/* Sessions */}
      <div className="flex flex-col gap-4">
        {sessions.map((session, i) => (
          <SessionCard key={i} session={session} index={startIndex + i} lang={lang} />
        ))}
      </div>
    </div>
  );
}

function SessionCard({ session, index, lang }: { session: Session; index: number; lang: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const style = TYPE_STYLE[session.type];
  const isBreak = session.type === "Networking";
  const title = lang === "en" ? session.titleEn : session.title;
  const desc = lang === "en" ? session.descEn : session.desc;
  const typeLabel = lang === "en" ? style.labelEn : style.label;
  const dur = duration(session.time, session.end);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
        { threshold: 0.05 }
      );
      if (ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, (index % 6) * 50);
    return () => clearTimeout(timer);
  }, [session, index]);

  /* ── Pause / networking ── */
  if (isBreak) {
    return (
      <div ref={ref}
        className="flex items-center gap-5 px-5 py-3.5 rounded-xl transition-all duration-500"
        style={{
          backgroundColor: "rgba(90,158,120,0.08)",
          border: "1px dashed rgba(90,158,120,0.25)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
        }}>
        {/* Time */}
        <div className="hidden md:flex flex-col items-end w-20 shrink-0">
          <span className="font-mono text-xs font-semibold" style={{ color: "#5a9e78" }}>{session.time}</span>
          <span className="font-mono text-[10px]" style={{ color: "rgba(90,158,120,0.50)" }}>–{session.end}</span>
        </div>
        <div className="hidden md:block w-px h-8 shrink-0" style={{ backgroundColor: "rgba(90,158,120,0.25)" }} />
        <div className="flex items-center gap-3 flex-1">
          <span className="text-lg">☕</span>
          <div>
            <span className="text-sm font-semibold" style={{ color: "#3d7a58" }}>{title}</span>
            <span className="hidden md:inline text-xs ml-3 px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(90,158,120,0.12)", color: "#5a9e78" }}>
              <Clock className="w-3 h-3 inline mr-1" />{dur}
            </span>
          </div>
        </div>
        {session.location && (
          <div className="hidden md:flex items-center gap-1 text-xs shrink-0" style={{ color: "rgba(90,158,120,0.60)" }}>
            <MapPin className="w-3 h-3" />{session.location}
          </div>
        )}
      </div>
    );
  }

  /* ── Session card ── */
  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex gap-0 rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        backgroundColor: "white",
        border: `1px solid ${hovered ? `${style.border}35` : "rgba(36,100,68,0.09)"}`,
        boxShadow: hovered ? `0 12px 36px rgba(10,28,18,0.11), 0 0 0 1px ${style.border}18` : "0 2px 10px rgba(10,28,18,0.05)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}>

      {/* Left accent bar */}
      <div className="w-1 shrink-0 rounded-l-2xl" style={{ backgroundColor: style.border, opacity: hovered ? 1 : 0.55, transition: "opacity 0.3s" }} />

      {/* Time column — desktop */}
      <div className="hidden md:flex flex-col items-end justify-start pt-6 px-5 w-28 shrink-0"
        style={{ borderRight: "1px solid rgba(36,100,68,0.07)" }}>
        <span className="font-mono text-sm font-bold" style={{ color: style.dot }}>{session.time}</span>
        <span className="font-mono text-[11px] mt-0.5" style={{ color: "rgba(15,45,31,0.30)" }}>–{session.end}</span>
        <span className="mt-2 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
          style={{ backgroundColor: style.color, color: style.dot }}>
          {dur}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 md:p-6">
        {/* Top row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Mobile time */}
          <span className="md:hidden font-mono text-xs font-semibold" style={{ color: style.dot }}>
            {session.time}–{session.end}
          </span>
          {/* Type badge */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{ backgroundColor: style.color, color: style.dot }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
            {typeLabel}
          </span>
          {/* Location */}
          {session.location && (
            <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: "rgba(15,45,31,0.38)" }}>
              <MapPin className="w-3 h-3" />{session.location}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-base md:text-lg leading-snug mb-3 transition-colors duration-200"
          style={{ color: hovered ? style.dot : "#0f2d1f" }}>
          {title}
        </h3>

        {/* Description */}
        {desc && (
          <p className="text-sm leading-relaxed mb-4 max-w-2xl" style={{ color: "rgba(15,45,31,0.52)" }}>
            {desc}
          </p>
        )}

        {/* Speakers */}
        {session.speakers && session.speakers.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: "1px solid rgba(36,100,68,0.07)" }}>
            {session.speakers.map((sp) => (
              <div key={sp.name} className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 transition-colors duration-150"
                style={{ backgroundColor: "rgba(36,100,68,0.05)", border: "1px solid rgba(36,100,68,0.10)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                  style={{ background: "linear-gradient(135deg,#1e5238,#0f2d1f)", color: "rgba(196,154,48,0.9)" }}>
                  {sp.initials}
                </div>
                <span className="text-xs font-medium" style={{ color: "rgba(15,45,31,0.65)" }}>{sp.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
