"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

const partners = [
  { name: "UEMOA", tier: "institutionnel" },
  { name: "Afreximbank", tier: "gold" },
  { name: "BAD", tier: "institutionnel" },
  { name: "IFC", tier: "gold" },
  { name: "BOAD", tier: "institutionnel" },
  { name: "TotalEnergies", tier: "platinum" },
  { name: "Petronas", tier: "platinum" },
  { name: "NNPC", tier: "gold" },
  { name: "bp", tier: "gold" },
  { name: "Société Générale", tier: "silver" },
];

const marqueeItems = [...partners, ...partners];

export default function PartnersSection() {
  const { t } = useLang();
  const p = t.partners;

  return (
    <div className="bg-[#0f2d1f] overflow-hidden">
      <div className="relative h-8">
        <svg
          viewBox="0 0 1440 32"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{ transform: "scaleY(-1)" }}
        >
          <path d="M0,32 C360,0 1080,0 1440,32 L1440,32 L0,32 Z" fill="#f7faf8" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-500 mb-1">
            {p.label}
          </p>
          <p className="text-white/50 text-xs">
            {p.sub}
          </p>
        </div>
        <Link
          href="/inscription"
          className="inline-flex items-center gap-2 text-gold-400 font-semibold text-xs border border-gold-500/30 rounded-lg px-4 py-2 hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-200 shrink-0"
        >
          {p.cta}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="relative pb-10">
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0f2d1f, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0f2d1f, transparent)" }}
        />

        <div className="marquee-track flex items-center gap-5">
          {marqueeItems.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-colors duration-200 hover:border-gold-500/50 hover:bg-gold-500/5 cursor-default"
              style={{
                borderColor:
                  partner.tier === "platinum"
                    ? "rgba(196,154,48,0.35)"
                    : partner.tier === "gold"
                    ? "rgba(196,154,48,0.20)"
                    : "rgba(255,255,255,0.10)",
              }}
            >
              {partner.tier === "platinum" && (
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse shrink-0" />
              )}
              <span
                className="font-heading font-bold text-sm whitespace-nowrap"
                style={{
                  color:
                    partner.tier === "platinum"
                      ? "#d4aa3a"
                      : partner.tier === "gold"
                      ? "#c49a30"
                      : partner.tier === "institutionnel"
                      ? "rgba(255,255,255,0.70)"
                      : "rgba(255,255,255,0.45)",
                }}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee 28s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
