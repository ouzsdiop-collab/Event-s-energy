"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { useLang } from "@/lib/i18n";

const speakers = [
  { name: "Amadou Hott",        title: "Envoyé spécial Président BAD, Power Africa",     titleEn: "Special Envoy, AfDB President, Power Africa",          country: "Sénégal",  countryEn: "Senegal",  flag: "🇸🇳", bg: "1e5238" },
  { name: "Amina Benkhadra",    title: "Directrice exécutive, African Energy Chamber",   titleEn: "Executive Director, African Energy Chamber",            country: "Maroc",    countryEn: "Morocco",  flag: "🇲🇦", bg: "163d2a" },
  { name: "Wole Ogunsanya",     title: "CEO, NNPC Gas Marketing Ltd.",                   titleEn: "CEO, NNPC Gas Marketing Ltd.",                          country: "Nigeria",  countryEn: "Nigeria",  flag: "🇳🇬", bg: "246444" },
  { name: "Romuald Wadagni",    title: "Ancien Ministre de l'Économie et des Finances",  titleEn: "Former Minister of Economy and Finance",                country: "Bénin",    countryEn: "Benin",    flag: "🇧🇯", bg: "1e5238" },
  { name: "Mahaman Laouan Gaya",title: "Secrétaire Général, APPO",                       titleEn: "Secretary General, APPO",                               country: "Niger",    countryEn: "Niger",    flag: "🇳🇪", bg: "163d2a" },
  { name: "Fatoumata Bah",      title: "VP Énergie, Afreximbank",                        titleEn: "VP Energy, Afreximbank",                                country: "Guinée",   countryEn: "Guinea",   flag: "🇬🇳", bg: "246444" },
  { name: "Cheikh Tidiane Mbaye",title: "Dir. Stratégie, TotalEnergies Afrique",         titleEn: "Head of Strategy, TotalEnergies Africa",                country: "Sénégal",  countryEn: "Senegal",  flag: "🇸🇳", bg: "1e5238" },
  { name: "Kassimu Issa",       title: "Commissaire Énergie, CEDEAO",                    titleEn: "Energy Commissioner, ECOWAS",                           country: "Ghana",    countryEn: "Ghana",    flag: "🇬🇭", bg: "163d2a" },
];

function avatarUrl(name: string, bg: string) {
  const encoded = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encoded}&background=${bg}&color=fff&size=200&bold=true&font-size=0.38`;
}

export default function SpeakersSection() {
  const { lang, t } = useLang();
  const sp = t.speakersSection;
  const [visible, setVisible] = useState<boolean[]>(new Array(speakers.length).fill(false));
  const [headerVisible, setHeaderVisible] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeaderVisible(true); headerObs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (headerRef.current) headerObs.observe(headerRef.current);

    const cardObservers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisible((prev) => { const next = [...prev]; next[i] = true; return next; });
            }, (i % 4) * 100);
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
      cardObservers.forEach((o) => o?.disconnect());
    };
  }, []);

  return (
    <section className="py-14 md:py-24 px-4 bg-[#f7faf8] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1e5238 0px, #1e5238 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #1e5238 0px, #1e5238 1px, transparent 1px, transparent 40px)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={headerRef}
          className={`flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div>
            <p className="section-label mb-3">{sp.label}</p>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-gray-900 leading-tight">
              {sp.title} <span className="text-forest-600">{sp.titleHighlight}</span>
            </h2>
            <div className="w-14 h-[3px] bg-gold-400 rounded-full mt-5" />
          </div>
          <TransitionLink
            href="/programme"
            className="self-start md:self-auto inline-flex items-center gap-2 text-forest-600 font-semibold text-sm border border-forest-200 rounded-lg px-5 py-2.5 hover:bg-forest-50 hover:border-forest-400 transition-all duration-200 shrink-0"
          >
            {sp.ctaBtn}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </TransitionLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {speakers.map((speaker, i) => (
            <div
              key={speaker.name}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`
                group relative bg-white rounded-2xl p-5 border border-gray-100
                shadow-sm hover:shadow-xl hover:shadow-forest-900/10
                hover:-translate-y-1.5
                transition-all duration-400 ease-out cursor-default
                ${visible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
              `}
              style={{ transitionDelay: visible[i] ? "0ms" : `${(i % 4) * 80}ms` }}
            >
              <div className="relative w-fit mx-auto mb-4">
                <div
                  className="w-20 h-20 rounded-full p-[2.5px] transition-all duration-300 group-hover:p-[3px]"
                  style={{ background: "linear-gradient(135deg, #c49a30, #e8c96a, #a07828)" }}
                >
                  <img
                    src={avatarUrl(speaker.name, speaker.bg)}
                    alt={speaker.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-forest-600 border-2 border-white">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>

              <div className="text-center">
                <div className="font-heading font-bold text-gray-900 text-sm leading-tight mb-1">
                  {speaker.name}
                </div>
                <div className="text-gray-400 text-[11px] leading-snug mb-3 min-h-[2.5rem] flex items-center justify-center">
                  {lang === "en" ? speaker.titleEn : speaker.title}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span>{speaker.flag}</span>
                    <span>{lang === "en" ? speaker.countryEn : speaker.country}</span>
                  </span>
                  <span className="w-px h-3 bg-gray-200" />
                  <span className="text-[10px] font-bold text-forest-600 tracking-wider">
                    {sp.confirmedBadge}
                  </span>
                </div>
              </div>

              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-gradient-to-r from-forest-600 to-gold-500 transition-all duration-300"
                style={{ width: "0%", transitionProperty: "width" }}
              />
              <style jsx>{`
                .group:hover div:last-child { width: 60% !important; }
              `}</style>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            {sp.more} <span className="font-semibold text-forest-600">12+ {sp.moreSuffix}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
