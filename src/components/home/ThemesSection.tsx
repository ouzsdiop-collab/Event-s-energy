"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

const THEME_EXTRAS = [
  { stat: "50 Md$",  detail: "d'investissements identifiés dans les infrastructures gazières en Afrique de l'Ouest à l'horizon 2030" },
  { stat: "×3",      detail: "réduction du coût du capital avec couverture multilatérale (AFD, IFC, MIGA) selon la Banque mondiale" },
  { stat: "8 pays",  detail: "membres UEMOA concernés par l'harmonisation des cadres réglementaires et de transit gazier" },
  { stat: "+200%",   detail: "d'IDE attirés dans les pays à régimes fiscaux compétitifs pour l'énergie (CNUCED 2023)" },
];

function ThemeRow({
  item,
  extra,
  index,
  isLast,
  isActive,
  onToggle,
  visible,
}: {
  item: { num: string; tag: string; title: string; desc: string };
  extra: { stat: string; detail: string };
  index: number;
  isLast: boolean;
  isActive: boolean;
  onToggle: () => void;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const highlighted = isActive || hovered;

  return (
    <div
      className={`relative border-t transition-all duration-500 cursor-pointer select-none ${
        isLast ? "border-b" : ""
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        borderColor: "rgba(36,100,68,0.10)",
        transitionDelay: visible ? "0ms" : `${index * 80}ms`,
        backgroundColor: isActive
          ? "rgba(36,100,68,0.05)"
          : hovered
          ? "rgba(36,100,68,0.025)"
          : "transparent",
        transition: "background-color 0.25s ease, opacity 0.5s ease, transform 0.5s ease",
      }}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Bordure gauche active */}
      <div
        className="absolute left-0 top-0 bottom-0 rounded-r-full transition-all duration-300"
        style={{
          width: "3px",
          backgroundColor: "#c49a30",
          opacity: isActive ? 1 : hovered ? 0.45 : 0,
          transform: isActive || hovered ? "scaleY(1)" : "scaleY(0.3)",
          transformOrigin: "top",
        }}
      />

      <div className="flex items-start gap-4 md:gap-8 py-6 md:py-7 pl-5 pr-1">

        {/* Number */}
        <span
          className="font-heading font-black shrink-0 pt-0.5 transition-all duration-300"
          style={{
            fontSize: "clamp(1.2rem,2vw,1.6rem)",
            color: highlighted ? "#c49a30" : "rgba(36,100,68,0.18)",
            minWidth: "2.5rem",
          }}
        >
          {item.num}
        </span>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Tag */}
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-2.5 transition-all duration-300"
            style={{
              color: highlighted ? "#246444" : "rgba(36,100,68,0.55)",
              background: highlighted ? "rgba(36,100,68,0.10)" : "rgba(36,100,68,0.05)",
            }}
          >
            {item.tag}
          </span>

          {/* Title */}
          <h3
            className="font-heading font-bold leading-snug transition-colors duration-300"
            style={{
              fontSize: "clamp(0.95rem,1.8vw,1.15rem)",
              color: highlighted ? "#0f2d1f" : "#374151",
            }}
          >
            {item.title}
          </h3>

          {/* Description — dépliée au clic */}
          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{ maxHeight: isActive ? "10rem" : "0" }}
          >
            <p className="text-sm leading-relaxed pt-3" style={{ color: "rgba(15,45,31,0.52)" }}>
              {item.desc}
            </p>
          </div>

          {/* Stat mobile */}
          <div className="flex items-baseline gap-2 mt-3 md:hidden">
            <span className="font-heading font-black text-lg transition-colors duration-300" style={{ color: highlighted ? "#c49a30" : "rgba(196,154,48,0.60)" }}>
              {extra.stat}
            </span>
            <span className="text-[11px] leading-tight" style={{ color: "rgba(15,45,31,0.32)" }}>
              {extra.detail}
            </span>
          </div>
        </div>

        {/* Stat desktop */}
        <div className="hidden md:flex flex-col items-end shrink-0 text-right" style={{ minWidth: "185px" }}>
          <span
            className="font-heading font-black transition-all duration-300"
            style={{
              fontSize: "clamp(1.4rem,2.2vw,1.85rem)",
              color: highlighted ? "#c49a30" : "rgba(196,154,48,0.50)",
            }}
          >
            {extra.stat}
          </span>
          <span
            className="text-[11px] leading-snug mt-1.5 max-w-[165px] transition-colors duration-300"
            style={{ color: highlighted ? "rgba(15,45,31,0.40)" : "rgba(15,45,31,0.25)" }}
          >
            {extra.detail}
          </span>
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 mt-1 shrink-0 transition-all duration-300 ${isActive ? "rotate-180" : ""}`}
          style={{ color: highlighted ? "rgba(196,154,48,0.60)" : "rgba(36,100,68,0.25)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default function ThemesSection() {
  const { t } = useLang();
  const th = t.themes;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [rowsVisible, setRowsVisible] = useState([false, false, false, false]);

  useEffect(() => {
    const headerObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); headerObs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (headerRef.current) headerObs.observe(headerRef.current);

    const rowObservers = rowRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setRowsVisible(prev => { const n = [...prev]; n[i] = true; return n; });
            }, i * 80);
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
      rowObservers.forEach(o => o?.disconnect());
    };
  }, []);

  return (
    <section className="py-16 md:py-28 px-4 overflow-hidden" style={{ backgroundColor: "#f7f9f7" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={headerRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-16 mb-14 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="md:max-w-sm">
            <p className="section-label mb-3">{th.label}</p>
            <h2
              className="font-heading font-black text-gray-900 leading-tight"
              style={{ fontSize: "clamp(2rem,4vw,3.25rem)" }}
            >
              {th.title}{" "}
              <span className="text-forest-600">{th.titleHighlight}</span>
              <br />
              {th.titleEnd}
            </h2>
            <div className="w-12 h-[3px] bg-gold-400 rounded-full mt-5" />
          </div>
          <p className="text-sm leading-relaxed md:max-w-xs" style={{ color: "rgba(15,45,31,0.42)" }}>
            {th.ctaText}
          </p>
        </div>

        {/* Theme rows — observer individuel par ligne */}
        <div>
          {th.items.map((item, i) => (
            <div key={item.num} ref={el => { rowRefs.current[i] = el; }}>
              <ThemeRow
                item={item}
                extra={THEME_EXTRAS[i]}
                index={i}
                isLast={i === th.items.length - 1}
                isActive={activeIndex === i}
                onToggle={() => setActiveIndex(activeIndex === i ? null : i)}
                visible={rowsVisible[i]}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`mt-10 transition-all duration-700 delay-300 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <a
            href="/programme"
            className="inline-flex items-center gap-2 text-forest-600 font-semibold text-sm border border-forest-200 rounded-lg px-5 py-2.5 hover:bg-forest-50 hover:border-forest-400 transition-all duration-200"
          >
            {th.ctaBtn}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
