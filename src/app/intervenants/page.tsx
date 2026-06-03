"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { useLang } from "@/lib/i18n";

interface Speaker {
  id: string;
  name: string;
  role: string; roleEn: string;
  org: string;
  country: string; countryEn: string;
  flag: string;
  topic: string; topicEn: string;
  image: string;
  confirmed: boolean;
}

const SPEAKERS: Speaker[] = [
  { id: "01", name: "Amadou Hott",
    role: "Envoyé spécial du Président", roleEn: "Special Envoy of the President",
    org: "Banque Africaine de Développement",
    country: "Sénégal", countryEn: "Senegal", flag: "🇸🇳",
    topic: "Financement des infrastructures gazières", topicEn: "Financing gas infrastructure",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&q=80", confirmed: true },
  { id: "02", name: "Romuald Wadagni",
    role: "Ancien Ministre de l'Économie", roleEn: "Former Minister of Economy",
    org: "République du Bénin",
    country: "Bénin", countryEn: "Benin", flag: "🇧🇯",
    topic: "Harmonisation des cadres réglementaires UEMOA", topicEn: "Harmonising UEMOA regulatory frameworks",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&q=80", confirmed: true },
  { id: "03", name: "Fatoumata Bah",
    role: "Vice-Présidente Énergie", roleEn: "VP Energy",
    org: "Afreximbank",
    country: "Guinée", countryEn: "Guinea", flag: "🇬🇳",
    topic: "Mobilisation des capitaux privés", topicEn: "Mobilising private capital",
    image: "", confirmed: true },
  { id: "04", name: "Mahaman Laouan Gaya",
    role: "Secrétaire Général", roleEn: "Secretary General",
    org: "APPO · Africa Petroleum Producers' Organization",
    country: "Niger", countryEn: "Niger", flag: "🇳🇪",
    topic: "Souveraineté énergétique africaine", topicEn: "African energy sovereignty",
    image: "", confirmed: true },
  { id: "05", name: "Aïssatou Diallo",
    role: "Directrice des Investissements", roleEn: "Director of Investments",
    org: "BOAD",
    country: "Sénégal", countryEn: "Senegal", flag: "🇸🇳",
    topic: "Financement structuré de projets gaziers", topicEn: "Structured financing of gas projects",
    image: "", confirmed: true },
  { id: "06", name: "Wole Ogunsanya",
    role: "Chief Executive Officer", roleEn: "Chief Executive Officer",
    org: "NNPC Gas Marketing Ltd.",
    country: "Nigeria", countryEn: "Nigeria", flag: "🇳🇬",
    topic: "Marchés régionaux du gaz naturel", topicEn: "Regional natural gas markets",
    image: "https://images.unsplash.com/photo-1542909168-82c3e7fdcd5f?w=800&q=80", confirmed: true },
  { id: "07", name: "Cheikh Tidiane Mbaye",
    role: "Directeur Stratégie Afrique", roleEn: "Head of Africa Strategy",
    org: "TotalEnergies",
    country: "Sénégal", countryEn: "Senegal", flag: "🇸🇳",
    topic: "Investissement privé dans la chaîne de valeur", topicEn: "Private investment across the value chain",
    image: "", confirmed: true },
  { id: "08", name: "Kassimu Issa",
    role: "Commissaire Énergie", roleEn: "Energy Commissioner",
    org: "CEDEAO",
    country: "Ghana", countryEn: "Ghana", flag: "🇬🇭",
    topic: "Intégration régionale des réseaux gaziers", topicEn: "Regional gas network integration",
    image: "", confirmed: true },
  { id: "09", name: "Kofi Asante Mensah",
    role: "Directeur Général", roleEn: "Chief Executive Officer",
    org: "Ghana National Gas Company",
    country: "Ghana", countryEn: "Ghana", flag: "🇬🇭",
    topic: "Valorisation du gaz associé", topicEn: "Associated gas monetisation",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=800&q=80", confirmed: false },
  { id: "10", name: "Amara Kouyaté",
    role: "Directrice Développement Durable", roleEn: "Director of Sustainable Development",
    org: "IFC · Groupe Banque Mondiale",
    country: "Mali", countryEn: "Mali", flag: "🇲🇱",
    topic: "Transition énergétique & standards ESG", topicEn: "Energy transition & ESG standards",
    image: "https://images.unsplash.com/photo-1618498082410-b4aa22193b9e?w=800&q=80", confirmed: false },
];

export default function IntervenantsPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rafRef = useRef<number | null>(null);
  const { lang, t } = useLang();
  const iv = t.intervenants;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.2 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    cardRef.current.tx = e.clientX + 28;
    cardRef.current.ty = e.clientY - 60;
  }, [isMobile]);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      cardRef.current.x = lerp(cardRef.current.x, cardRef.current.tx, 0.10);
      cardRef.current.y = lerp(cardRef.current.y, cardRef.current.ty, 0.10);
      setCardPos({ x: cardRef.current.x, y: cardRef.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const activeSpeaker = SPEAKERS.find((s) => s.id === activeId);
  const confirmed = SPEAKERS.filter(s => s.confirmed).length;

  const confirmedLabel = lang === "en" ? "confirmed" : "confirmés";
  const totalLabel = lang === "en"
    ? `${SPEAKERS.length} speakers total`
    : `${SPEAKERS.length} intervenants au total`;
  const noteText = lang === "en"
    ? "More speakers will be announced in the coming weeks. Hover over a name to see the profile."
    : "D'autres intervenants seront annoncés dans les prochaines semaines. Passez la souris sur un nom pour découvrir le profil.";

  return (
    <div
      className="relative min-h-screen w-full cursor-default"
      style={{ backgroundColor: "#f4f7f5" }}
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[40vh]"
        style={{ background: "linear-gradient(to bottom, rgba(36,100,68,0.04) 0%, transparent 100%)" }} />

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-24">

        {/* Header */}
        <div
          ref={headerRef}
          className="mb-16 transition-all duration-700"
          style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? "translateY(0)" : "translateY(24px)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "#c49a30" }}>
              {iv.eyebrow}
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-pulse" />
                <span className="text-xs font-medium" style={{ color: "rgba(15,45,31,0.55)" }}>
                  {confirmed} {confirmedLabel}
                </span>
              </div>
              <span className="w-px h-3 bg-gray-300" />
              <span className="text-xs" style={{ color: "rgba(15,45,31,0.40)" }}>{totalLabel}</span>
              <Link href="/programme"
                className="hidden md:inline-flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
                style={{ color: "#246444" }}>
                {iv.viewProg} <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <h1 className="font-heading font-black leading-[0.88] mb-10">
            <span className="block" style={{ fontSize: "clamp(3.2rem, 8vw, 7rem)", letterSpacing: "-0.03em", color: "#0f2d1f" }}>
              {iv.title1}
            </span>
            <span className="block" style={{
              fontSize: "clamp(3.2rem, 8vw, 7rem)", letterSpacing: "-0.03em",
              background: "linear-gradient(90deg, #246444 0%, #1e5238 50%, #c49a30 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              {iv.title2}
            </span>
          </h1>

          <div className="flex flex-wrap gap-4 mb-8">
            {iv.stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                <span className="font-heading font-black text-xl" style={{ color: "#246444" }}>{s.value}</span>
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="h-px w-full" style={{ background: "linear-gradient(to right, rgba(36,100,68,0.30), rgba(196,154,48,0.20), transparent)" }} />
        </div>

        {/* Kinetic list */}
        <div className="flex flex-col">
          {SPEAKERS.map((sp, i) => (
            <SpeakerRow
              key={sp.id}
              data={sp}
              index={i}
              isActive={activeId === sp.id}
              isAnyActive={activeId !== null}
              isMobile={isMobile}
              lang={lang}
              confirmedText={iv.confirmed}
              onEnter={() => !isMobile && setActiveId(sp.id)}
              onLeave={() => !isMobile && setActiveId(null)}
              onToggle={() => isMobile && setActiveId(activeId === sp.id ? null : sp.id)}
            />
          ))}
        </div>

        <div className="mt-14 pt-7 flex items-center gap-3"
          style={{ borderTop: "1px solid rgba(36,100,68,0.12)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#c49a30" }} />
          <p className="text-xs" style={{ color: "rgba(15,45,31,0.40)" }}>{noteText}</p>
        </div>
      </div>

      {/* Floating card */}
      {!isMobile && activeSpeaker && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-50 w-72 rounded-2xl overflow-hidden"
          style={{
            transform: `translate(${cardPos.x}px, ${cardPos.y}px)`,
            boxShadow: "0 32px 64px rgba(10,31,20,0.25), 0 0 0 1px rgba(196,154,48,0.15)",
            opacity: activeId ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {activeSpeaker.image ? (
            <img src={activeSpeaker.image} alt={activeSpeaker.name} className="w-full h-56 object-cover object-top" />
          ) : (
            <div className="w-full h-56 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1e5238 0%, #0f2d1f 100%)" }}>
              <span className="font-heading font-black text-5xl" style={{
                background: "linear-gradient(135deg, rgba(196,154,48,0.7), rgba(212,170,58,0.5))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                {activeSpeaker.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </span>
            </div>
          )}
          <div className="p-4" style={{ backgroundColor: "#0f2d1f" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold"
                style={{ color: activeSpeaker.confirmed ? "#c49a30" : "rgba(255,255,255,0.40)" }}>
                <span className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: activeSpeaker.confirmed ? "#c49a30" : "rgba(255,255,255,0.30)" }} />
                {activeSpeaker.confirmed
                  ? (lang === "en" ? "Confirmed" : "Confirmé")
                  : (lang === "en" ? "To be confirmed" : "À confirmer")}
              </span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                {activeSpeaker.flag} {lang === "en" ? activeSpeaker.countryEn : activeSpeaker.country}
              </span>
            </div>
            <p className="text-sm font-bold text-white mb-0.5">{activeSpeaker.name}</p>
            <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.50)" }}>{activeSpeaker.org}</p>
            <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                {lang === "en" ? activeSpeaker.topicEn : activeSpeaker.topic}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .row-hover:hover { background-color: rgba(36,100,68,0.03); }
      `}</style>
    </div>
  );
}

function SpeakerRow({
  data, index, isActive, isAnyActive, isMobile, lang, confirmedText,
  onEnter, onLeave, onToggle,
}: {
  data: Speaker; index: number;
  isActive: boolean; isAnyActive: boolean; isMobile: boolean; lang: string; confirmedText: string;
  onEnter: () => void; onLeave: () => void; onToggle: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setMounted(true), index * 50); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    if (rowRef.current) obs.observe(rowRef.current);
    return () => obs.disconnect();
  }, [index]);

  const dimmed = isAnyActive && !isActive;
  const topic = lang === "en" ? data.topicEn : data.topic;
  const country = lang === "en" ? data.countryEn : data.country;
  const confirmedBadge = data.confirmed
    ? `✓ ${confirmedText}`
    : (lang === "en" ? "To be confirmed" : "À confirmer");

  return (
    <div
      ref={rowRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={isMobile ? onToggle : undefined}
      className="border-t last:border-b row-hover"
      style={{
        borderColor: "rgba(36,100,68,0.10)",
        opacity: mounted ? (dimmed ? 0.20 : 1) : 0,
        transform: mounted ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease, background-color 0.2s ease",
        cursor: isMobile ? "pointer" : "default",
      }}
    >
      <div className="flex flex-col py-6 md:flex-row md:items-center md:py-8"
        style={{ transition: "padding 0.3s ease" }}>
        <div className="flex items-center gap-6 md:gap-8 flex-1 min-w-0"
          style={{ transform: isActive ? "translateX(12px)" : "translateX(0)", transition: "transform 0.35s ease" }}>
          <span className="font-mono text-xs shrink-0 w-6 text-right" style={{ color: "rgba(36,100,68,0.25)" }}>
            {data.id}
          </span>
          <div className="min-w-0">
            <h2 className="font-heading font-black tracking-tight leading-none transition-colors duration-300 truncate"
              style={{ fontSize: "clamp(1.3rem, 3.5vw, 2.8rem)", color: isActive ? "#0f2d1f" : "rgba(15,45,31,0.35)" }}>
              {data.name}
            </h2>
            <p className="text-xs mt-1.5 font-medium transition-colors duration-300 truncate"
              style={{ color: isActive ? "rgba(36,100,68,0.70)" : "rgba(36,100,68,0.30)" }}>
              {data.org}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 pl-12 md:mt-0 md:pl-0 md:gap-8">
          <div className="text-right hidden md:block">
            <p className="text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-300"
              style={{ color: isActive ? "rgba(15,45,31,0.55)" : "rgba(15,45,31,0.22)" }}>
              {lang === "en" ? data.roleEn : data.role}
            </p>
            <p className="text-xs mt-0.5 transition-colors duration-300"
              style={{ color: isActive ? "#c49a30" : "rgba(196,154,48,0.35)" }}>
              {data.flag}&nbsp;{country}
            </p>
          </div>
          <div className="hidden md:block overflow-hidden"
            style={{ maxWidth: isActive ? "240px" : "0px", opacity: isActive ? 1 : 0, transition: "max-width 0.4s ease, opacity 0.3s ease" }}>
            <span className="whitespace-nowrap text-[10px] font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(36,100,68,0.08)", color: "#246444" }}>
              {topic}
            </span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
            style={{
              color: data.confirmed ? "#246444" : "rgba(15,45,31,0.30)",
              border: `1px solid ${data.confirmed ? "rgba(36,100,68,0.25)" : "rgba(15,45,31,0.10)"}`,
              background: data.confirmed ? "rgba(36,100,68,0.07)" : "transparent",
            }}>
            {confirmedBadge}
          </span>
          <div className="flex items-center gap-3 md:hidden">
            <span className="text-xs" style={{ color: "rgba(15,45,31,0.40)" }}>{data.flag}</span>
            <div style={{ color: "rgba(15,45,31,0.40)" }}>
              {isActive ? <Minus size={15} /> : <Plus size={15} />}
            </div>
          </div>
          <div className="hidden md:block transition-all duration-300"
            style={{ opacity: isActive ? 1 : 0, transform: isActive ? "translateX(0)" : "translateX(-6px)", color: "#c49a30" }}>
            <ArrowUpRight size={22} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {isMobile && isActive && (
        <div className="overflow-hidden pb-5 px-4">
          <div className="rounded-xl overflow-hidden relative aspect-video">
            {data.image ? (
              <img src={data.image} alt={data.name} className="w-full h-full object-cover object-top" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1e5238 0%, #0f2d1f 100%)" }}>
                <span className="font-heading font-black text-6xl" style={{
                  background: "linear-gradient(135deg, rgba(196,154,48,0.7), rgba(212,170,58,0.5))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {data.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                </span>
              </div>
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,31,20,0.88) 0%, transparent 55%)" }} />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-xs font-semibold text-white mb-1">{data.org}</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.65)" }}>{topic}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ backgroundColor: "rgba(36,100,68,0.09)", color: "#246444" }}>
              {data.flag} {country}
            </span>
            {data.confirmed && (
              <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={{ backgroundColor: "rgba(36,100,68,0.09)", color: "#246444" }}>
                {confirmedBadge}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
