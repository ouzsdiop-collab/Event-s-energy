"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { useLang } from "@/lib/i18n";

const TARGET = new Date("2027-02-03T08:00:00");

function useCountdown() {
  const calc = () => {
    const diff = TARGET.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function Pad({ n }: { n: number }) {
  return String(n).padStart(2, "0");
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-heading font-black tabular-nums leading-none"
        style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: "#c49a30" }}>
        <Pad n={value} />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return <span className="font-heading font-black pb-5" style={{ fontSize: "clamp(1.5rem,3vw,2.5rem)", color: "rgba(196,154,48,0.4)" }}>:</span>;
}

export default function CtaSection() {
  const { t } = useLang();
  const c = t.ctaSection;
  const { days, hours, minutes, seconds } = useCountdown();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden" style={{ backgroundColor: "#060f09" }}>
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(196,154,48,0.12) 0%, rgba(36,100,68,0.08) 50%, transparent 70%)" }} />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "#246444", opacity: 0.06 }} />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: "#c49a30", opacity: 0.06 }} />

      <div ref={ref} className="max-w-4xl mx-auto px-4 text-center relative z-10">
        {/* Label */}
        <p className={`text-[11px] font-bold uppercase tracking-[0.25em] mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ color: "#c49a30", transitionDelay: "0ms" }}>
          {c.label}
        </p>

        {/* Titre */}
        <h2 className={`font-heading font-black leading-tight mb-4 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ fontSize: "clamp(2rem,5vw,3.75rem)", color: "white", transitionDelay: "80ms" }}>
          {c.title}
          <br />
          <span style={{ color: "#c49a30" }}>{c.titleHighlight}</span>
        </h2>

        {/* Lieu */}
        <p className={`text-base mb-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ color: "rgba(255,255,255,0.45)", transitionDelay: "160ms" }}>
          {c.location}
        </p>

        {/* Countdown */}
        <div className={`flex items-end justify-center gap-4 md:gap-8 mb-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "240ms" }}>
          <CountUnit value={days}    label={c.days} />
          <Sep />
          <CountUnit value={hours}   label={c.hours} />
          <Sep />
          <CountUnit value={minutes} label={c.minutes} />
          <Sep />
          <CountUnit value={seconds} label={c.seconds} />
        </div>

        {/* Ligne déco */}
        <div className={`flex items-center gap-4 mb-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "300ms" }}>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(196,154,48,0.25))" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
            Cotonou · Bénin · 2027
          </span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(196,154,48,0.25))" }} />
        </div>

        {/* CTA buttons */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "360ms" }}>
          <a href="mailto:contact@soafgn2027.org"
            className="inline-flex items-center gap-2.5 font-bold px-8 py-4 rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-[0_0_32px_rgba(196,154,48,0.35)]"
            style={{ backgroundColor: "#c49a30", color: "#060f09" }}>
            {c.registerBtn}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <TransitionLink href="/programme"
            className="inline-flex items-center gap-2.5 font-semibold px-8 py-4 rounded-full text-sm transition-all duration-200 hover:scale-105"
            style={{ border: "1px solid rgba(196,154,48,0.3)", color: "#c49a30", backgroundColor: "rgba(196,154,48,0.06)" }}>
            {c.programBtn}
          </TransitionLink>
        </div>

        {/* Note */}
        <p className={`mt-10 text-xs transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ color: "rgba(255,255,255,0.2)", transitionDelay: "440ms" }}>
          {c.note}
        </p>
      </div>
    </section>
  );
}
