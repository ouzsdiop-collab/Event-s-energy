"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function AProposPage() {
  return (
    <div style={{ backgroundColor: "#f4f7f5" }}>
      <HeroSection />
      <ContextSection />
      <ThemeSection />
      <SubthemesSection />
      <ObjectivesSection />
      <OrgsSection />

      <style jsx global>{`
        @keyframes ap-slide-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ap-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ap-reveal { opacity: 0; }
        .ap-reveal.visible {
          animation: ap-slide-up 0.7s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards;
        }
        .ap-fade { opacity: 0; }
        .ap-fade.visible {
          animation: ap-fade 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}

function HeroSection() {
  const { ref, visible } = useReveal(0.1);
  const { t } = useLang();
  const a = t.about;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-16 pb-12 md:pt-24 md:pb-20">
      <div ref={ref}>
        <p className={`text-[11px] font-bold uppercase tracking-[0.22em] mb-8 ap-fade ${visible ? "visible" : ""}`}
          style={{ color: "#c49a30", animationDelay: "0.1s" }}>
          {a.eyebrow}
        </p>
        <h1 className={`font-heading font-black leading-[0.88] mb-10 ap-reveal ${visible ? "visible" : ""}`}
          style={{ animationDelay: "0.2s" }}>
          <span className="block" style={{ fontSize: "clamp(2.2rem, 8vw, 6rem)", letterSpacing: "-0.03em", color: "#0f2d1f" }}>
            {a.title1}
          </span>
          <span className="block" style={{
            fontSize: "clamp(2.2rem, 8vw, 6rem)", letterSpacing: "-0.03em",
            background: "linear-gradient(90deg, #246444 0%, #1e5238 50%, #c49a30 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {a.title2}
          </span>
        </h1>
        <div className={`flex flex-col md:flex-row md:items-end gap-8 ap-fade ${visible ? "visible" : ""}`}
          style={{ animationDelay: "0.45s" }}>
          <p className="text-base leading-[1.8] max-w-xl" style={{ color: "rgba(15,45,31,0.60)" }}>
            {a.intro}
          </p>
          <div className="shrink-0 flex flex-col gap-1.5 md:text-right">
            <span className="text-xs font-medium" style={{ color: "rgba(15,45,31,0.40)" }}>3–5 février 2027</span>
            <span className="text-xs font-medium" style={{ color: "rgba(15,45,31,0.40)" }}>Sofitel Cotonou Marina, Bénin</span>
            <span className="text-xs font-semibold" style={{ color: "#246444" }}>{a.edition}</span>
          </div>
        </div>
        <div className={`mt-12 h-px ap-fade ${visible ? "visible" : ""}`}
          style={{
            animationDelay: "0.55s",
            background: "linear-gradient(to right, rgba(36,100,68,0.30), rgba(196,154,48,0.20), transparent)",
          }} />
      </div>
    </section>
  );
}

function ContextSection() {
  const { ref, visible } = useReveal();
  const { t } = useLang();
  const a = t.about;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16" ref={ref}>
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
        <div className={`ap-reveal ${visible ? "visible" : ""}`} style={{ animationDelay: "0s" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.20em] mb-4" style={{ color: "#c49a30" }}>
            {a.contextLabel}
          </p>
          <h2 className="font-heading font-black text-2xl md:text-3xl mb-6 leading-tight" style={{ color: "#0f2d1f" }}>
            {a.contextTitle}
          </h2>
          <div className="space-y-4 text-sm leading-[1.85]" style={{ color: "rgba(15,45,31,0.60)" }}>
            <p>{a.contextP1}</p>
            <p>{a.contextP2}</p>
            <p>
              {a.contextP3.split("{name}")[0]}
              <strong style={{ color: "#0f2d1f" }}>{a.contextP3Bold}</strong>
              {a.contextP3.split("{name}")[1]}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {a.stats.map((s, i) => (
            <div key={s.value}
              className={`ap-reveal ${visible ? "visible" : ""}`}
              style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full">
                <div className="font-heading font-black mb-2" style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  background: "linear-gradient(135deg, #1e5238 0%, #c49a30 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {s.value}
                </div>
                <p className="text-xs leading-snug" style={{ color: "rgba(15,45,31,0.50)" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThemeSection() {
  const { ref, visible } = useReveal();
  const { t } = useLang();
  const a = t.about;
  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 md:px-12" style={{ backgroundColor: "#0f2d1f" }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className={`text-[10px] font-bold uppercase tracking-[0.22em] mb-8 ap-fade ${visible ? "visible" : ""}`}
          style={{ color: "rgba(196,154,48,0.70)", animationDelay: "0.1s" }}>
          {a.themeLabel}
        </p>
        <blockquote
          className={`font-heading font-black leading-tight ap-reveal ${visible ? "visible" : ""}`}
          style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)", color: "rgba(255,255,255,0.92)", animationDelay: "0.2s" }}>
          {a.themeQuote}
        </blockquote>
        <div className="mt-8 mx-auto w-16 h-[2px]"
          style={{ background: "linear-gradient(to right, transparent, #c49a30, transparent)" }} />
        <p className={`mt-6 text-sm leading-relaxed max-w-xl mx-auto ap-fade ${visible ? "visible" : ""}`}
          style={{ color: "rgba(255,255,255,0.40)", animationDelay: "0.4s" }}>
          {a.themeSub}
        </p>
      </div>
    </section>
  );
}

function SubthemesSection() {
  const { ref, visible } = useReveal();
  const { t } = useLang();
  const a = t.about;
  return (
    <section ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20">
      <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${visible ? "visible" : ""}`}
        style={{ color: "#c49a30", animationDelay: "0s" }}>
        {a.subthemesLabel}
      </p>
      <h2 className={`font-heading font-black text-2xl md:text-3xl mb-12 ap-reveal ${visible ? "visible" : ""}`}
        style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
        {a.subthemesTitle}
      </h2>
      <div className="flex flex-col divide-y" style={{ borderColor: "rgba(36,100,68,0.10)" }}>
        {a.subthemes.map((st, i) => (
          <div key={st.num}
            className={`flex gap-8 py-5 md:py-8 ap-reveal ${visible ? "visible" : ""}`}
            style={{ borderColor: "rgba(36,100,68,0.10)", animationDelay: `${0.05 + i * 0.07}s` }}>
            <span className="font-mono text-xs shrink-0 pt-1 w-6" style={{ color: "rgba(36,100,68,0.30)" }}>
              {st.num}
            </span>
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-10 flex-1">
              <h3 className="font-heading font-bold text-base md:text-lg shrink-0 md:w-72" style={{ color: "#0f2d1f" }}>
                {st.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(15,45,31,0.55)" }}>{st.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ObjectivesSection() {
  const { ref, visible } = useReveal();
  const { t } = useLang();
  const a = t.about;
  return (
    <section ref={ref} className="py-16 px-4 sm:px-6 md:px-12" style={{ backgroundColor: "white" }}>
      <div className="max-w-6xl mx-auto">
        <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${visible ? "visible" : ""}`}
          style={{ color: "#c49a30", animationDelay: "0s" }}>
          {a.objectivesLabel}
        </p>
        <h2 className={`font-heading font-black text-2xl md:text-3xl mb-12 ap-reveal ${visible ? "visible" : ""}`}
          style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
          {a.objectivesTitle}
        </h2>
        <div className="grid md:grid-cols-2 gap-x-0 md:gap-x-16 gap-y-0">
          {a.objectives.map((obj, i) => (
            <div key={i}
              className={`flex items-start gap-4 py-5 border-t ap-reveal ${visible ? "visible" : ""}`}
              style={{ borderColor: "rgba(36,100,68,0.09)", animationDelay: `${0.05 + i * 0.06}s` }}>
              <span className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                style={{ backgroundColor: "rgba(196,154,48,0.12)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#c49a30" }} />
              </span>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(15,45,31,0.65)" }}>{obj}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrgsSection() {
  const { ref, visible } = useReveal();
  const { t } = useLang();
  const a = t.about;
  return (
    <section ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20">
      <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${visible ? "visible" : ""}`}
        style={{ color: "#c49a30", animationDelay: "0s" }}>
        {a.orgsLabel}
      </p>
      <h2 className={`font-heading font-black text-2xl md:text-3xl mb-12 ap-reveal ${visible ? "visible" : ""}`}
        style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
        {a.orgsTitle}
      </h2>
      <div className="grid md:grid-cols-3 gap-5">
        {a.orgs.map((org, i) => (
          <div key={org.name}
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-7 ap-reveal ${visible ? "visible" : ""}`}
            style={{ animationDelay: `${0.05 + i * 0.08}s` }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 font-heading font-black text-sm"
              style={{ background: "linear-gradient(135deg, #1e5238, #0f2d1f)", color: "#c49a30" }}>
              {org.initials}
            </div>
            <h3 className="font-heading font-bold text-base mb-1" style={{ color: "#0f2d1f" }}>{org.name}</h3>
            <p className="text-[11px] font-bold uppercase tracking-wide mb-3" style={{ color: "#c49a30" }}>{org.role}</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(15,45,31,0.50)" }}>{org.desc}</p>
          </div>
        ))}
      </div>

      <div className={`mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 ap-fade ${visible ? "visible" : ""}`}
        style={{ borderTop: "1px solid rgba(36,100,68,0.12)", animationDelay: "0.35s" }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#0f2d1f" }}>{a.ctaTitle}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>{a.ctaSub}</p>
        </div>
        <div className="flex gap-3">
          <a href="mailto:contact@soafgn2027.org"
            className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#246444", color: "white" }}>
            {a.ctaRegister} <ArrowUpRight className="w-4 h-4" />
          </a>
          <TransitionLink href="/programme"
            className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200"
            style={{ border: "1px solid rgba(36,100,68,0.25)", color: "#246444" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(36,100,68,0.05)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
            {a.ctaProgram} <ArrowUpRight className="w-4 h-4" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
