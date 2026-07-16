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
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

interface StatProps {
  prefix?: string;
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
  source: string;
  started: boolean;
}

function Stat({ prefix = "", value, suffix, decimals = 0, label, source, started }: StatProps) {
  const count = useCounter(value, 1800, started);
  const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toString();
  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      <div
        className="font-black leading-none tracking-tight"
        style={{ color: "#c49a30", fontSize: "clamp(36px, 5vw, 52px)" }}
      >
        {prefix}{display}{suffix}
      </div>
      <div className="mt-3 text-white font-semibold text-sm uppercase tracking-wider leading-snug max-w-[200px]">
        {label}
      </div>
      <div className="mt-2 text-xs leading-tight max-w-[200px]" style={{ color: "#5a7060" }}>
        {source}
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = kf.stats;

  return (
    <section ref={ref} style={{ background: "#0a1a10" }} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-14">
          <span
            className="text-xs font-bold uppercase tracking-[0.25em] mb-4 block"
            style={{ color: "#c49a30" }}
          >
            {kf.label}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {kf.title}
          </h2>
        </div>

        {/* Stats grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ borderTop: "1px solid #1f3a27", borderLeft: "1px solid #1f3a27" }}
        >
          {[
            { prefix: "", value: 600, suffix: "M", decimals: 0, idx: 0 },
            { prefix: "", value: 56.37, suffix: "%", decimals: 2, idx: 1 },
            { prefix: "+", value: 35, suffix: "%", decimals: 0, idx: 2 },
            { prefix: "+", value: 3, suffix: "%/an", decimals: 0, idx: 3 },
          ].map(({ prefix, value, suffix, decimals, idx }) => (
            <div
              key={idx}
              style={{ borderRight: "1px solid #1f3a27", borderBottom: "1px solid #1f3a27" }}
            >
              <Stat
                prefix={prefix}
                value={value}
                suffix={suffix}
                decimals={decimals}
                label={stats[idx].label}
                source={stats[idx].source}
                started={started}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
