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
  return (
    <div
      className={`border-t transition-all duration-500 cursor-pointer group select-none ${
        isLast ? "border-b" : ""
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{
        borderColor: "rgba(36,100,68,0.12)",
        transitionDelay: `${index * 80}ms`,
        backgroundColor: isActive ? "rgba(36,100,68,0.03)" : "transparent",
      }}
      onClick={onToggle}
    >
      <div className="flex items-start gap-4 md:gap-8 py-6 md:py-7 px-1">
        {/* Number */}
        <span
          className="font-heading font-black shrink-0 pt-0.5"
          style={{
            fontSize: "clamp(1.25rem,2.5vw,1.75rem)",
            color: isActive ? "#c49a30" : "rgba(36,100,68,0.20)",
            transition: "color 0.3s",
            minWidth: "2.5rem",
          }}
        >
          {item.num}
        </span>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Tag */}
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-2.5"
            style={{ color: "#246444", background: "rgba(36,100,68,0.08)" }}
          >
            {item.tag}
          </span>

          {/* Title */}
          <h3
            className="font-heading font-bold leading-snug text-gray-900 transition-colors duration-200"
            style={{ fontSize: "clamp(1rem,2vw,1.2rem)" }}
          >
            {item.title}
          </h3>

          {/* Description — expanded */}
          <div
            className="overflow-hidden transition-all duration-500"
            style={{ maxHeight: isActive ? "8rem" : "0" }}
          >
            <p className="text-sm leading-relaxed pt-3" style={{ color: "rgba(15,45,31,0.55)" }}>
              {item.desc}
            </p>
          </div>

          {/* Mobile stat (visible always on mobile) */}
          <div
            className="flex items-baseline gap-2 mt-3 md:hidden"
          >
            <span className="font-heading font-black text-xl" style={{ color: "#c49a30" }}>
              {extra.stat}
            </span>
            <span className="text-[11px] leading-tight" style={{ color: "rgba(15,45,31,0.35)" }}>
              {extra.detail}
            </span>
          </div>
        </div>

        {/* Desktop stat */}
        <div className="hidden md:flex flex-col items-end shrink-0 text-right" style={{ minWidth: "190px" }}>
          <span className="font-heading font-black" style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)", color: "#c49a30" }}>
            {extra.stat}
          </span>
          <span
            className="text-[11px] leading-snug mt-1.5 max-w-[170px]"
            style={{ color: "rgba(15,45,31,0.35)" }}
          >
            {extra.detail}
          </span>
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 mt-1 shrink-0 transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
          style={{ color: "rgba(36,100,68,0.35)" }}
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
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 md:py-28 px-4 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header — 2 col */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-16 mb-14">
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
          <p className="text-sm leading-relaxed md:max-w-xs" style={{ color: "rgba(15,45,31,0.45)" }}>
            {th.ctaText}
          </p>
        </div>

        {/* Theme rows */}
        <div>
          {th.items.map((item, i) => (
            <ThemeRow
              key={item.num}
              item={item}
              extra={THEME_EXTRAS[i]}
              index={i}
              isLast={i === th.items.length - 1}
              isActive={activeIndex === i}
              onToggle={() => setActiveIndex(activeIndex === i ? null : i)}
              visible={visible}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10">
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
