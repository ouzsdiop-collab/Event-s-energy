"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { GlowingEffect } from "@/components/ui/glowing-effect";

function useCounter(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let current = 0;
    const steps = Math.max(1, Math.round(duration / 16));
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

function HeroStat({ value, suffix, label, source, started }: {
  value: number; suffix: string; label: string; source: string; started: boolean;
}) {
  const count = useCounter(value, 1400, started);
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
      <div
        className="font-heading font-black leading-none shrink-0"
        style={{ fontSize: "clamp(3.5rem,7vw,5rem)", color: "#c49a30", letterSpacing: "-0.02em" }}
      >
        {Math.round(count)}{suffix}
      </div>
      <div>
        <p className="text-white font-semibold leading-snug mb-3" style={{ fontSize: "clamp(0.95rem,1.6vw,1.1rem)" }}>
          {label}
        </p>
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
          style={{ color: "rgba(196,154,48,0.65)", background: "rgba(196,154,48,0.08)", border: "1px solid rgba(196,154,48,0.12)" }}
        >
          {source}
        </span>
      </div>
    </div>
  );
}

function StatCard({ prefix = "", value, suffix, decimals = 0, label, source, started, barWidth, visible }: {
  prefix?: string; value: number; suffix: string; decimals?: number;
  label: string; source: string; started: boolean; barWidth: number; visible: boolean;
}) {
  const count = useCounter(value, 1800, started && visible);
  const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toString();
  const progressCount = useCounter(barWidth, 1800, started && visible);

  return (
    <div
      className={`group relative bg-white/[0.04] rounded-2xl p-6 flex flex-col gap-4 border cursor-default
        hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/30
        transition-all duration-400 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      <GlowingEffect spread={40} glow={false} disabled={false} proximity={60} inactiveZone={0.01} borderWidth={2} variant="forest" />

      {/* Number */}
      <div
        className="font-heading font-black leading-none"
        style={{ fontSize: "clamp(1.75rem,3.5vw,2.25rem)", color: "#c49a30" }}
      >
        {prefix}{display}{suffix}
      </div>

      {/* Label */}
      <p className="text-white text-sm font-medium leading-snug flex-1">{label}</p>

      {/* Progress bar */}
      <div>
        <div className="h-[2px] rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: (started && visible) ? `${Math.min(progressCount, 100)}%` : "0%",
              background: "linear-gradient(to right, #c49a30, #e8c96a)",
              transition: "width 1.8s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(196,154,48,0.38)" }}>
          {source}
        </p>
      </div>

      {/* Bottom hover bar — même que cartes intervenants */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
        style={{
          background: "linear-gradient(to right, #246444, #c49a30)",
          width: "0%",
        }}
      />
      <style jsx>{`
        .group:hover div:last-child { width: 60% !important; }
      `}</style>
    </div>
  );
}

export default function KeyFigures() {
  const { t } = useLang();
  const kf = t.keyFigures;

  const [heroStarted, setHeroStarted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardsVisible, setCardsVisible] = useState([false, false, false]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); headerObs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (headerRef.current) headerObs.observe(headerRef.current);

    const heroObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeroStarted(true); heroObs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (heroRef.current) heroObs.observe(heroRef.current);

    const cardObservers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setCardsVisible(prev => { const n = [...prev]; n[i] = true; return n; });
            }, i * 100);
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
      heroObs.disconnect();
      cardObservers.forEach(o => o?.disconnect());
    };
  }, []);

  const stats = kf.stats;

  return (
    <section style={{ background: "#071810" }} className="relative overflow-hidden py-20 md:py-28 px-4">
      {/* Glows d'ambiance */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px] opacity-25"
        style={{ background: "radial-gradient(circle, rgba(36,100,68,0.3) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full pointer-events-none blur-[100px] opacity-15"
        style={{ background: "radial-gradient(circle, rgba(196,154,48,0.18) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-12 transition-all duration-700 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: "#c49a30" }}>
            {kf.label}
          </span>
          <h2 className="font-heading font-black text-white leading-tight" style={{ fontSize: "clamp(1.6rem,3vw,2.5rem)" }}>
            {kf.title}
          </h2>
        </div>

        {/* Hero stat block */}
        <div
          ref={heroRef}
          className={`rounded-2xl p-7 md:p-10 mb-5 transition-all duration-700 ${heroStarted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            background: "linear-gradient(135deg, rgba(36,100,68,0.18) 0%, rgba(196,154,48,0.06) 100%)",
            border: "1px solid rgba(196,154,48,0.14)",
          }}
        >
          <HeroStat
            value={600}
            suffix="M"
            label={stats[0].label}
            source={stats[0].source}
            started={heroStarted}
          />
        </div>

        {/* 3 secondary stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { prefix: "",  value: 56.37, suffix: "%",    decimals: 1, bar: 56.37, idx: 1 },
            { prefix: "+", value: 35,    suffix: "%",    decimals: 0, bar: 35,    idx: 2 },
            { prefix: "+", value: 3,     suffix: "%/an", decimals: 0, bar: 3,     idx: 3 },
          ].map(({ prefix, value, suffix, decimals, bar, idx }, i) => (
            <div key={idx} ref={el => { cardRefs.current[i] = el; }}>
              <StatCard
                prefix={prefix}
                value={value}
                suffix={suffix}
                decimals={decimals}
                label={stats[idx].label}
                source={stats[idx].source}
                started={heroStarted}
                barWidth={bar}
                visible={cardsVisible[i]}
              />
            </div>
          ))}
        </div>

        {/* Context line */}
        <div
          className={`mt-10 pt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all duration-700 delay-300 ${headerVisible ? "opacity-100" : "opacity-0"}`}
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.32)" }}>
            {kf.context}
          </p>
          <a
            href="/a-propos"
            className="inline-flex items-center gap-2 text-sm font-semibold shrink-0 transition-opacity hover:opacity-75"
            style={{ color: "#c49a30" }}
          >
            {kf.contextLink}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
