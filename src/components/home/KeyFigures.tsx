"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

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

function HeroStat({ value, suffix, decimals = 0, label, source, started }: {
  value: number; suffix: string; decimals?: number; label: string; source: string; started: boolean;
}) {
  const count = useCounter(value, 1600, started);
  const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toString();
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
      <div
        className="font-heading font-black leading-none shrink-0"
        style={{ fontSize: "clamp(5rem,12vw,8rem)", color: "#c49a30", letterSpacing: "-0.02em" }}
      >
        {display}{suffix}
      </div>
      <div>
        <p className="text-white font-semibold leading-snug mb-3" style={{ fontSize: "clamp(1.1rem,2vw,1.35rem)" }}>
          {label}
        </p>
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
          style={{ color: "rgba(196,154,48,0.70)", background: "rgba(196,154,48,0.08)", border: "1px solid rgba(196,154,48,0.12)" }}
        >
          {source}
        </span>
      </div>
    </div>
  );
}

function SecondaryStat({ prefix = "", value, suffix, decimals = 0, label, source, started, barWidth }: {
  prefix?: string; value: number; suffix: string; decimals?: number;
  label: string; source: string; started: boolean; barWidth?: number;
}) {
  const count = useCounter(value, 1800, started);
  const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toString();
  const progressTarget = barWidth ?? value;
  const progressCount = useCounter(progressTarget, 1800, started);

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="font-heading font-black leading-none"
        style={{ fontSize: "clamp(2.25rem,4vw,3rem)", color: "#c49a30" }}
      >
        {prefix}{display}{suffix}
      </div>
      <div className="flex-1">
        <p className="text-white text-sm font-medium leading-snug mb-4">{label}</p>
        {/* Progress bar */}
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-[1800ms] ease-out"
            style={{
              width: started ? `${Math.min(progressCount, 100)}%` : "0%",
              background: "linear-gradient(to right, #c49a30, #e8c96a)",
            }}
          />
        </div>
        <p className="text-[10px] mt-2 font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(196,154,48,0.40)" }}>
          {source}
        </p>
      </div>
    </div>
  );
}

export default function KeyFigures() {
  const { t } = useLang();
  const kf = t.keyFigures;
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = kf.stats;

  return (
    <section style={{ background: "#071810" }} className="relative overflow-hidden py-20 md:py-32 px-4">
      {/* Subtle radial glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none blur-[120px] opacity-30"
        style={{ background: "radial-gradient(circle, rgba(36,100,68,0.25) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none blur-[100px] opacity-20"
        style={{ background: "radial-gradient(circle, rgba(196,154,48,0.15) 0%, transparent 70%)" }}
      />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: "#c49a30" }}>
            {kf.label}
          </span>
          <h2 className="font-heading font-black text-white leading-tight" style={{ fontSize: "clamp(1.75rem,3.5vw,2.75rem)" }}>
            {kf.title}
          </h2>
        </div>

        {/* Hero stat block */}
        <div
          className="rounded-2xl p-8 md:p-12 mb-6"
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
            started={started}
          />
        </div>

        {/* 3 secondary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SecondaryStat
            value={56.37}
            suffix="%"
            decimals={1}
            label={stats[1].label}
            source={stats[1].source}
            started={started}
            barWidth={56.37}
          />
          <SecondaryStat
            prefix="+"
            value={35}
            suffix="%"
            label={stats[2].label}
            source={stats[2].source}
            started={started}
            barWidth={35}
          />
          <SecondaryStat
            prefix="+"
            value={3}
            suffix="%/an"
            label={stats[3].label}
            source={stats[3].source}
            started={started}
            barWidth={3}
          />
        </div>

        {/* Context line */}
        <div
          className="mt-10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-sm max-w-xl" style={{ color: "rgba(255,255,255,0.35)" }}>
            {kf.context}
          </p>
          <a
            href="/a-propos"
            className="inline-flex items-center gap-2 text-sm font-semibold shrink-0 transition-opacity hover:opacity-80"
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
