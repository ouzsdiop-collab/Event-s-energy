"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Minus } from "lucide-react";

interface Speaker {
  id: string;
  name: string;
  role: string;
  org: string;
  country: string;
  flag: string;
  topic: string;
  image: string;
  confirmed: boolean;
}

const SPEAKERS: Speaker[] = [
  {
    id: "01",
    name: "Amadou Hott",
    role: "Envoyé spécial du Président",
    org: "Banque Africaine de Développement",
    country: "Sénégal", flag: "🇸🇳",
    topic: "Financement des infrastructures gazières",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&q=80",
    confirmed: true,
  },
  {
    id: "02",
    name: "Romuald Wadagni",
    role: "Ancien Ministre de l'Économie",
    org: "République du Bénin",
    country: "Bénin", flag: "🇧🇯",
    topic: "Harmonisation des cadres réglementaires UEMOA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    confirmed: true,
  },
  {
    id: "03",
    name: "Fatoumata Bah",
    role: "Vice-Présidente Énergie",
    org: "Afreximbank",
    country: "Guinée", flag: "🇬🇳",
    topic: "Mobilisation des capitaux privés",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    confirmed: true,
  },
  {
    id: "04",
    name: "Mahaman Laouan Gaya",
    role: "Secrétaire Général",
    org: "APPO — Africa Petroleum Producers' Organization",
    country: "Niger", flag: "🇳🇪",
    topic: "Souveraineté énergétique africaine",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
    confirmed: true,
  },
  {
    id: "05",
    name: "Amina Benkhadra",
    role: "Directrice Exécutive",
    org: "African Energy Chamber",
    country: "Maroc", flag: "🇲🇦",
    topic: "Transition énergétique et gaz naturel",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&q=80",
    confirmed: true,
  },
  {
    id: "06",
    name: "Wole Ogunsanya",
    role: "Chief Executive Officer",
    org: "NNPC Gas Marketing Ltd.",
    country: "Nigeria", flag: "🇳🇬",
    topic: "Marchés régionaux du gaz naturel",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    confirmed: true,
  },
  {
    id: "07",
    name: "Cheikh Tidiane Mbaye",
    role: "Directeur Stratégie Afrique",
    org: "TotalEnergies",
    country: "Sénégal", flag: "🇸🇳",
    topic: "Investissement privé dans la chaîne de valeur",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    confirmed: true,
  },
  {
    id: "08",
    name: "Kassimu Issa",
    role: "Commissaire Énergie",
    org: "CEDEAO",
    country: "Ghana", flag: "🇬🇭",
    topic: "Intégration régionale des réseaux gaziers",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=800&q=80",
    confirmed: true,
  },
  {
    id: "09",
    name: "Aïssatou Diallo",
    role: "Directrice des Investissements",
    org: "BOAD",
    country: "Sénégal", flag: "🇸🇳",
    topic: "Financement structuré de projets gaziers",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80",
    confirmed: false,
  },
  {
    id: "10",
    name: "Kofi Asante Mensah",
    role: "Directeur Général",
    org: "Ghana National Gas Company",
    country: "Ghana", flag: "🇬🇭",
    topic: "Valorisation du gaz associé",
    image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80",
    confirmed: false,
  },
];

export default function IntervenantsPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cardPos, setCardPos] = useState({ x: 0, y: 0 });
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const rafRef = useRef<number | null>(null);

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

  // Smooth floating card with lerp
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    cardRef.current.tx = e.clientX + 24;
    cardRef.current.ty = e.clientY + 24;
  }, [isMobile]);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      cardRef.current.x = lerp(cardRef.current.x, cardRef.current.tx, 0.12);
      cardRef.current.y = lerp(cardRef.current.y, cardRef.current.ty, 0.12);
      setCardPos({ x: cardRef.current.x, y: cardRef.current.y });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const activeSpeaker = SPEAKERS.find((s) => s.id === activeId);

  return (
    <div
      className="relative min-h-screen w-full cursor-default"
      style={{ backgroundColor: "#0a1f14" }}
      onMouseMove={handleMouseMove}
    >
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 60% 20%, rgba(196,154,48,0.05) 0%, transparent 60%)" }} />

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-24">

        {/* Header */}
        <div
          ref={headerRef}
          className="mb-20 transition-all duration-700"
          style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? "translateY(0)" : "translateY(24px)" }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-4" style={{ color: "#c49a30" }}>
                ILS PRENDRONT LA PAROLE
              </p>
              <h1 className="font-heading font-black leading-[0.92]">
                <span className="block text-white" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-0.02em" }}>
                  INTER
                </span>
                <span className="block" style={{
                  fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-0.02em",
                  background: "linear-gradient(90deg, #246444, #c49a30)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  VENANTS
                </span>
              </h1>
            </div>
            <div className="flex flex-col gap-2 md:text-right">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>
                {SPEAKERS.filter(s => s.confirmed).length} confirmés · {SPEAKERS.length} au total
              </p>
              <Link href="/programme"
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 self-start md:self-end"
                style={{ color: "#c49a30" }}
              >
                Voir le programme <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Gold divider */}
          <div className="mt-10 h-px w-full" style={{ background: "linear-gradient(to right, rgba(196,154,48,0.5), rgba(196,154,48,0.1))" }} />
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
              onEnter={() => !isMobile && setActiveId(sp.id)}
              onLeave={() => !isMobile && setActiveId(null)}
              onToggle={() => isMobile && setActiveId(activeId === sp.id ? null : sp.id)}
            />
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-16 pt-8 flex items-center gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.30)" }}>
            D&apos;autres intervenants seront annoncés dans les prochaines semaines. Passez la souris sur un nom pour découvrir le profil.
          </p>
        </div>
      </div>

      {/* Desktop floating card */}
      {!isMobile && activeSpeaker && (
        <div
          className="pointer-events-none fixed left-0 top-0 z-50 w-72 rounded-xl overflow-hidden"
          style={{
            transform: `translate(${cardPos.x}px, ${cardPos.y}px)`,
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
            border: "1px solid rgba(196,154,48,0.20)",
            opacity: activeId ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          <img
            src={activeSpeaker.image}
            alt={activeSpeaker.name}
            className="w-full h-52 object-cover object-top"
          />
          <div className="p-4" style={{ backgroundColor: "#0f2d1f" }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.50)" }}>
                {activeSpeaker.confirmed ? "Confirmé" : "À confirmer"}
              </span>
            </div>
            <p className="text-xs font-semibold text-white mb-0.5">{activeSpeaker.org}</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>{activeSpeaker.topic}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SpeakerRow({
  data, index, isActive, isAnyActive, isMobile,
  onEnter, onLeave, onToggle,
}: {
  data: Speaker; index: number;
  isActive: boolean; isAnyActive: boolean; isMobile: boolean;
  onEnter: () => void; onLeave: () => void; onToggle: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setMounted(true), index * 55); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (rowRef.current) obs.observe(rowRef.current);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={rowRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={isMobile ? onToggle : undefined}
      className="border-t last:border-b"
      style={{
        borderColor: "rgba(255,255,255,0.07)",
        opacity: mounted ? (isAnyActive && !isActive ? 0.25 : 1) : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        cursor: isMobile ? "pointer" : "default",
        backgroundColor: isActive && isMobile ? "rgba(255,255,255,0.02)" : "transparent",
      }}
    >
      <div className="flex flex-col py-7 md:flex-row md:items-center md:justify-between md:py-10"
        style={{ transition: "padding 0.3s ease" }}>

        {/* Left: index + name */}
        <div className="flex items-baseline gap-6 md:gap-10 pl-2 md:pl-0"
          style={{
            transform: isActive ? "translateX(16px)" : "translateX(0)",
            transition: "transform 0.4s ease",
          }}>
          <span className="font-mono text-xs shrink-0" style={{ color: "rgba(255,255,255,0.20)" }}>
            {data.id}
          </span>
          <div>
            <h2 className="font-heading font-black tracking-tight transition-colors duration-300"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 3.2rem)",
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.45)",
              }}>
              {data.name}
            </h2>
          </div>
        </div>

        {/* Right: role + badge + arrow */}
        <div className="mt-3 flex items-center justify-between pl-14 pr-2 md:mt-0 md:justify-end md:gap-10 md:pl-0 md:pr-0">
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300"
              style={{ color: isActive ? "rgba(255,255,255,0.60)" : "rgba(255,255,255,0.25)" }}>
              {data.role}
            </p>
            <p className="text-xs mt-0.5" style={{ color: isActive ? "#c49a30" : "rgba(255,255,255,0.18)" }}>
              {data.flag} {data.country}
            </p>
          </div>

          {/* Confirmed badge */}
          <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ml-6"
            style={{
              color: data.confirmed ? "#c49a30" : "rgba(255,255,255,0.30)",
              border: `1px solid ${data.confirmed ? "rgba(196,154,48,0.35)" : "rgba(255,255,255,0.10)"}`,
              background: data.confirmed ? "rgba(196,154,48,0.08)" : "transparent",
            }}>
            {data.confirmed ? "✓ Confirmé" : "À confirmer"}
          </span>

          {/* Mobile toggle */}
          <div className="block md:hidden" style={{ color: "rgba(255,255,255,0.40)" }}>
            {isActive ? <Minus size={16} /> : <Plus size={16} />}
          </div>

          {/* Desktop arrow */}
          <div className="hidden md:block ml-4 transition-all duration-300"
            style={{ opacity: isActive ? 1 : 0, transform: isActive ? "translateX(0)" : "translateX(-8px)", color: "#c49a30" }}>
            <ArrowUpRight size={24} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Mobile accordion */}
      {isMobile && isActive && (
        <div className="overflow-hidden pb-4 px-4">
          <div className="relative rounded-xl overflow-hidden aspect-video">
            <img src={data.image} alt={data.name} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,31,20,0.85) 0%, transparent 60%)" }} />
            <div className="absolute bottom-3 left-3">
              <p className="text-xs font-semibold text-white mb-0.5">{data.org}</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.60)" }}>{data.topic}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
