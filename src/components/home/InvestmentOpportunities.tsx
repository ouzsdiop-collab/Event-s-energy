"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const ICONS = [
  // Infrastructure gazière — pipeline
  <svg key="infra" width="28" height="28" viewBox="0 0 32 32" fill="none">
    <rect x="2" y="13" width="28" height="6" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="8" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="24" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="7" x2="16" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="19" x2="16" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>,
  // Gas-to-Power — éclair
  <svg key="power" width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M18 4L8 18h8l-2 10 14-16h-8l2-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>,
  // Industrialisation — usine
  <svg key="industry" width="28" height="28" viewBox="0 0 32 32" fill="none">
    <rect x="2" y="18" width="28" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
    <path d="M2 18l8-8v8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M10 18l8-8v8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M18 18l8-8v8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <line x1="8" y1="4" x2="8" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="4" x2="16" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>,
  // Finance — courbe
  <svg key="finance" width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M4 24l7-8 6 4 11-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="28" cy="8" r="2.5" stroke="currentColor" strokeWidth="2"/>
    <line x1="4" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>,
  // Technologie — circuit
  <svg key="tech" width="28" height="28" viewBox="0 0 32 32" fill="none">
    <rect x="10" y="10" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="4" x2="16" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="22" x2="16" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="2" fill="currentColor"/>
  </svg>,
];

const NUMS = ["01", "02", "03", "04", "05"];

function InvestCard({
  icon, title, desc, num, visible,
}: {
  icon: React.ReactNode; title: string; desc: string; num: string; visible: boolean;
}) {
  return (
    <div
      className={`group relative bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100
        shadow-sm hover:shadow-xl hover:shadow-forest-900/10 hover:-translate-y-1.5
        transition-all duration-400 ease-out cursor-default h-full
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <GlowingEffect spread={40} glow={false} disabled={false} proximity={60} inactiveZone={0.01} borderWidth={2} variant="forest" />

      {/* Numéro filigrane */}
      <span
        className="absolute top-5 right-5 font-heading font-black select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.10]"
        style={{ fontSize: "2rem", color: "#246444", opacity: 0.05 }}
      >
        {num}
      </span>

      {/* Icône */}
      <div
        className="w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
        style={{ background: "rgba(36,100,68,0.07)", color: "#c49a30" }}
      >
        {icon}
      </div>

      {/* Titre */}
      <h3
        className="font-heading font-bold leading-snug text-gray-900 pr-8 transition-colors duration-200 group-hover:text-forest-800"
        style={{ fontSize: "clamp(0.9rem,1.5vw,1rem)" }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed flex-1" style={{ color: "#5a7060" }}>
        {desc}
      </p>

      {/* Barre dorée bas — même que SpeakersSection */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
        style={{ background: "linear-gradient(to right, #246444, #c49a30)", width: "0%" }}
      />
      <style jsx>{`
        .group:hover div:last-child { width: 60% !important; }
      `}</style>
    </div>
  );
}

export default function InvestmentOpportunities() {
  const { t } = useLang();
  const io = t.investmentOpportunities;

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardsVisible, setCardsVisible] = useState(new Array(5).fill(false));

  useEffect(() => {
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
              setCardsVisible(prev => { const n = [...prev]; n[i] = true; return n; });
            }, i * 90);
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
  }, []);

  return (
    <section className="py-20 md:py-28 px-4 overflow-hidden" style={{ background: "#f7f9f7" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-14 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="section-label mb-3 block">{io.label}</span>
              <h2
                className="font-heading font-black text-gray-900 leading-tight"
                style={{ fontSize: "clamp(1.9rem,4vw,3rem)" }}
              >
                {io.title}
              </h2>
              <div className="w-12 h-[3px] bg-gold-400 rounded-full mt-5" />
            </div>
            <p
              className="text-sm leading-relaxed md:max-w-xs"
              style={{ color: "rgba(15,45,31,0.42)" }}
            >
              {io.subtitle}
            </p>
          </div>
        </div>

        {/* Grille 6 colonnes : top 3 × col-span-2, bottom 2 × col-span-3 */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {io.items.slice(0, 3).map((item, i) => (
            <div key={i} className="md:col-span-2" ref={el => { cardRefs.current[i] = el; }}>
              <InvestCard
                icon={ICONS[i]}
                title={item.title}
                desc={item.desc}
                num={NUMS[i]}
                visible={cardsVisible[i]}
              />
            </div>
          ))}
          {io.items.slice(3, 5).map((item, i) => (
            <div key={i + 3} className="md:col-span-3" ref={el => { cardRefs.current[i + 3] = el; }}>
              <InvestCard
                icon={ICONS[i + 3]}
                title={item.title}
                desc={item.desc}
                num={NUMS[i + 3]}
                visible={cardsVisible[i + 3]}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`mt-10 text-center transition-all duration-700 delay-300 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <a
            href="mailto:contact@soafgn2027.org"
            className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-[0_4px_20px_rgba(196,154,48,0.25)]"
            style={{ backgroundColor: "#c49a30", color: "#071810" }}
          >
            Devenir investisseur partenaire
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
