"use client";

import { useEffect, useRef, useState } from "react";

const themes = [
  {
    num: "01",
    title: "Financement des infrastructures gazières",
    desc: "Mobiliser les capitaux publics et privés pour développer des infrastructures compétitives, résilientes et adaptées aux réalités de la sous-région.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M8 40V20l16-12 16 12v20H8z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
        <path d="M18 40v-10h12v10" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
        <path d="M24 8v4M16 24h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="28" r="2.5" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
    gradient: "from-forest-900 to-forest-700",
    accent: "#c49a30",
    tag: "Capitaux & Projets",
  },
  {
    num: "02",
    title: "Mitigation des risques pour les investisseurs",
    desc: "Identifier, partager et réduire les risques géopolitiques, financiers et opérationnels pour sécuriser les projets gaziers sur le long terme.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 6L10 14v12c0 8 6 14 14 16 8-2 14-8 14-16V14L24 6z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
        <path d="M17 24l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    gradient: "from-[#1a3a28] to-forest-600",
    accent: "#d4aa3a",
    tag: "Sécurité & Garanties",
  },
  {
    num: "03",
    title: "Harmonisation des cadres réglementaires",
    desc: "Aligner les politiques nationales et régionales pour construire un marché intégré, transparent et attractif pour tous les acteurs de la filière.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="10" width="32" height="4" rx="2" stroke="currentColor" strokeWidth="2"/>
        <rect x="8" y="22" width="24" height="4" rx="2" stroke="currentColor" strokeWidth="2"/>
        <rect x="8" y="34" width="16" height="4" rx="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="38" cy="36" r="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M35.5 36l1.5 1.5 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    gradient: "from-forest-800 to-[#2d5a40]",
    accent: "#c49a30",
    tag: "Politique & Droit",
  },
  {
    num: "04",
    title: "Mesures incitatives à l'investissement privé",
    desc: "Créer un environnement fiscal et juridique favorable à l'investissement privé dans toute la chaîne de valeur du gaz naturel en espace UEMOA.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2.2"/>
        <path d="M24 18v6l4 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 10l2 2M30 34l2 2M16 38l2-2M30 12l2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    gradient: "from-[#162f22] to-forest-700",
    accent: "#e8c96a",
    tag: "Fiscalité & Incitations",
  },
];

export default function ThemesSection() {
  const [visible, setVisible] = useState<boolean[]>(new Array(themes.length).fill(false));
  const [hovered, setHovered] = useState<number | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisible((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 120);
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <p className="section-label mb-3">LES THÈMES CLÉS</p>
          <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 leading-tight">
            4 axes pour bâtir{" "}
            <span className="text-forest-600">l&apos;avenir</span>{" "}
            <br className="hidden md:block" />
            du gaz naturel
          </h2>
          <div className="w-14 h-[3px] bg-gold-400 rounded-full mt-5" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {themes.map((t, i) => (
            <div
              key={t.num}
              ref={(el) => { refs.current[i] = el; }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`
                relative rounded-2xl overflow-hidden cursor-pointer
                bg-gradient-to-br ${t.gradient}
                transition-all duration-500 ease-out
                ${visible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                ${hovered === i ? "-translate-y-2 shadow-2xl shadow-forest-900/30" : "shadow-lg shadow-forest-900/10"}
              `}
              style={{ minHeight: "340px" }}
            >
              {/* Subtle grid texture */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Accent glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at top left, ${t.accent}22 0%, transparent 60%)`,
                  opacity: hovered === i ? 1 : 0,
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-7 flex flex-col h-full" style={{ minHeight: "340px" }}>
                {/* Top row: number + icon */}
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="text-5xl font-heading font-black leading-none select-none"
                    style={{ color: t.accent, opacity: 0.25 }}
                  >
                    {t.num}
                  </span>
                  <div
                    className="p-2.5 rounded-xl transition-transform duration-300"
                    style={{
                      color: t.accent,
                      background: `${t.accent}18`,
                      transform: hovered === i ? "scale(1.12) rotate(-4deg)" : "scale(1)",
                    }}
                  >
                    {t.icon}
                  </div>
                </div>

                {/* Tag */}
                <div className="mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ color: t.accent, background: `${t.accent}22` }}
                  >
                    {t.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-heading font-bold text-base leading-snug mb-3 flex-1">
                  {t.title}
                </h3>

                {/* Description */}
                <p
                  className="text-gray-300 text-xs leading-relaxed transition-all duration-500"
                  style={{ opacity: hovered === i ? 1 : 0.6 }}
                >
                  {t.desc}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-5 h-[2px] rounded-full transition-all duration-500"
                  style={{
                    background: `linear-gradient(to right, ${t.accent}, transparent)`,
                    width: hovered === i ? "100%" : "32px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex items-center justify-between flex-wrap gap-4">
          <p className="text-gray-400 text-sm max-w-lg">
            Chaque thème donne lieu à des sessions plénières, tables rondes et ateliers pratiques
            réunissant experts, décideurs et investisseurs de la région.
          </p>
          <a
            href="/programme"
            className="inline-flex items-center gap-2 text-forest-600 font-semibold text-sm border border-forest-200 rounded-lg px-5 py-2.5 hover:bg-forest-50 hover:border-forest-400 transition-all duration-200"
          >
            Voir le programme complet
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
