"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { GlowingEffect } from "@/components/ui/glowing-effect";

function useReveal(threshold = 0.1) {
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

function useRevealList(count: number, delayMs = 90) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(new Array(count).fill(false));
  useEffect(() => {
    const obs = refs.current.map((el, i) => {
      if (!el) return null;
      const o = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVisible(prev => { const n = [...prev]; n[i] = true; return n; }), i * delayMs);
          o.disconnect();
        }
      }, { threshold: 0.05 });
      o.observe(el);
      return o;
    });
    return () => obs.forEach(o => o?.disconnect());
  }, []);
  return { refs, visible };
}

export default function AProposPage() {
  return (
    <div>
      <HeroSection />
      <ContextSection />
      <ThemeSection />
      <SubthemesSection />
      <WhyBeninSection />
      <ParticipantsSection />
      <OrgsSection />

      <style jsx global>{`
        @keyframes ap-slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ap-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ap-reveal { opacity: 0; }
        .ap-reveal.visible {
          animation: ap-slide-up 0.6s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards;
        }
        .ap-fade { opacity: 0; }
        .ap-fade.visible {
          animation: ap-fade 0.7s ease forwards;
        }
      `}</style>
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────── */
function HeroSection() {
  const { ref, visible } = useReveal(0.01);
  const { t } = useLang();
  const a = t.about;

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#071810" }}>
      {/* Glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none blur-[160px] opacity-20"
        style={{ background: "radial-gradient(ellipse, rgba(36,100,68,0.7) 0%, transparent 70%)" }} />
      {/* Glow gold bas-droite */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[350px] rounded-full pointer-events-none blur-[120px] opacity-12"
        style={{ background: "radial-gradient(ellipse, rgba(196,154,48,0.5) 0%, transparent 70%)" }} />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-14 md:py-20">
        <p className={`text-[11px] font-bold uppercase tracking-[0.25em] mb-6 ap-fade ${visible ? "visible" : ""}`}
          style={{ color: "rgba(196,154,48,0.75)", animationDelay: "0.05s" }}>
          {a.eyebrow}
        </p>

        <h1 className={`font-heading font-black leading-[0.9] mb-8 ap-reveal ${visible ? "visible" : ""}`}
          style={{ animationDelay: "0.15s" }}>
          <span className="block text-white" style={{ fontSize: "clamp(2rem, 5.5vw, 4.2rem)", letterSpacing: "-0.02em" }}>
            {a.title1}
          </span>
          <span className="block" style={{
            fontSize: "clamp(2rem, 5.5vw, 4.2rem)",
            letterSpacing: "-0.02em",
            background: "linear-gradient(90deg, #c49a30 0%, #e8c96a 60%, #c49a30 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {a.title2}
          </span>
        </h1>

        <div className={`flex flex-col md:flex-row md:items-end gap-8 ap-fade ${visible ? "visible" : ""}`}
          style={{ animationDelay: "0.35s" }}>
          <p className="text-sm md:text-base leading-[1.85] max-w-xl" style={{ color: "rgba(255,255,255,0.48)" }}>
            {a.intro}
          </p>
          <div className="shrink-0 flex flex-col gap-1.5 md:text-right">
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.30)" }}>3–5 février 2027</span>
            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>Sofitel Cotonou Marina, Bénin</span>
            <span className="text-xs font-bold" style={{ color: "#c49a30" }}>{a.edition}</span>
          </div>
        </div>

        <div className={`mt-10 h-px ap-fade ${visible ? "visible" : ""}`}
          style={{
            animationDelay: "0.5s",
            background: "linear-gradient(to right, rgba(196,154,48,0.45), rgba(36,100,68,0.20), transparent)",
          }} />
      </div>
    </section>
  );
}

/* ─── CONTEXTE ──────────────────────────────────────────────────────────── */
function ContextSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: paraRefs, visible: parasVisible } = useRevealList(3, 110);
  const { refs: statRefs, visible: statsVisible } = useRevealList(4, 80);
  const { refs: chalRefs, visible: chalsVisible } = useRevealList(3, 100);
  const { t } = useLang();
  const a = t.about;

  const CHAL_ICONS = [
    <svg key="infra" width="20" height="20" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="13" width="28" height="6" rx="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="24" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    <svg key="shield" width="20" height="20" viewBox="0 0 32 32" fill="none">
      <path d="M16 3L5 8v8c0 6.5 4.7 12.6 11 14 6.3-1.4 11-7.5 11-14V8L16 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>,
    <svg key="finance" width="20" height="20" viewBox="0 0 32 32" fill="none">
      <path d="M4 24l7-8 6 4 11-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="4" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
  ];

  return (
    <section className="overflow-hidden" style={{ backgroundColor: "white" }}>

      {/* Headline + 600M */}
      <div className="relative py-10 md:py-14 px-4 sm:px-6 md:px-12" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 md:pr-10 pointer-events-none select-none" aria-hidden="true">
          <span className="font-heading font-black" style={{
            fontSize: "clamp(5rem, 20vw, 18rem)", letterSpacing: "-0.04em",
            color: "rgba(36,100,68,0.04)", lineHeight: 1,
          }}>600M</span>
        </div>
        <div className="max-w-6xl mx-auto relative z-10" ref={headerRef}>
          <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-4 ap-fade ${headerVisible ? "visible" : ""}`}
            style={{ color: "#c49a30" }}>
            {a.contextLabel}
          </p>
          <h2 className={`font-heading font-black text-2xl md:text-3xl mb-7 leading-tight max-w-lg ap-reveal ${headerVisible ? "visible" : ""}`}
            style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
            {a.contextTitle}
          </h2>
          <div className={`flex items-center gap-4 ap-fade ${headerVisible ? "visible" : ""}`}
            style={{ animationDelay: "0.25s" }}>
            <span className="font-heading font-black leading-none" style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
              background: "linear-gradient(135deg, #1e5238, #c49a30)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>600M</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: "#0f2d1f" }}>personnes</p>
              <p className="text-xs leading-snug" style={{ color: "rgba(15,45,31,0.45)" }}>sans accès à l'électricité en Afrique subsaharienne</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 paragraphes */}
      <div className="py-10 px-4 sm:px-6 md:px-12" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 md:gap-10">
          {[
            { text: a.contextP1, color: "#c49a30" },
            { text: a.contextP2, color: "#246444" },
            { text: null,        color: "#1e5238" },
          ].map((col, i) => (
            <div key={i} ref={el => { paraRefs.current[i] = el; }}>
              <div className={`ap-reveal ${parasVisible[i] ? "visible" : ""}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-7 h-[2px] mb-4 rounded-full" style={{ background: col.color }} />
                <p className="text-sm leading-[1.9]" style={{ color: "rgba(15,45,31,0.60)" }}>
                  {col.text ?? (
                    <>
                      {a.contextP3.split("{name}")[0]}
                      <strong style={{ color: "#0f2d1f" }}>{a.contextP3Bold}</strong>
                      {a.contextP3.split("{name}")[1]}
                    </>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="py-8 px-4 sm:px-6 md:px-12" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)", backgroundColor: "rgba(36,100,68,0.025)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {a.stats.map((s, i) => (
            <div key={s.value} ref={el => { statRefs.current[i] = el; }}>
              <div className={`ap-reveal ${statsVisible[i] ? "visible" : ""}`}>
                <div className="font-heading font-black leading-none mb-1.5" style={{
                  fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)",
                  background: "linear-gradient(135deg, #1e5238 0%, #c49a30 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{s.value}</div>
                <p className="text-xs leading-snug" style={{ color: "rgba(15,45,31,0.45)" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 défis structurels */}
      <div className="py-10 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-6" style={{ color: "rgba(15,45,31,0.35)" }}>
            Pourquoi ce salon est nécessaire
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {a.challenges.map((c, i) => (
              <div key={c.num} ref={el => { chalRefs.current[i] = el; }}>
                <div className={`flex gap-4 p-5 rounded-xl border ap-reveal ${chalsVisible[i] ? "visible" : ""}`}
                  style={{ borderColor: "rgba(36,100,68,0.10)", animationDelay: `${i * 0.1}s` }}>
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                    style={{ background: "rgba(36,100,68,0.07)", color: "#c49a30" }}>
                    {CHAL_ICONS[i]}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm mb-1" style={{ color: "#0f2d1f" }}>{c.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(15,45,31,0.50)" }}>{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── THÈME ─────────────────────────────────────────────────────────────── */
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
        <blockquote className={`font-heading font-black leading-tight ap-reveal ${visible ? "visible" : ""}`}
          style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)", color: "rgba(255,255,255,0.92)", animationDelay: "0.2s" }}>
          {a.themeQuote}
        </blockquote>
        <div className="mt-8 mx-auto w-16 h-[2px]"
          style={{ background: "linear-gradient(to right, transparent, #c49a30, transparent)" }} />
        <p className={`mt-6 text-sm leading-relaxed max-w-xl mx-auto ap-fade ${visible ? "visible" : ""}`}
          style={{ color: "rgba(255,255,255,0.38)", animationDelay: "0.4s" }}>
          {a.themeSub}
        </p>
      </div>
    </section>
  );
}

/* ─── SOUS-THÈMES ───────────────────────────────────────────────────────── */
function SubthemesSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: cardRefs, visible: cardsVisible } = useRevealList(4, 90);
  const { t } = useLang();
  const a = t.about;

  const ICONS = [
    <svg key="flame" width="22" height="22" viewBox="0 0 32 32" fill="none">
      <path d="M16 3c0 0-1 5-5 8s-5 7-3 11c1.5 3 5 5 8 5s8-3 8-7c0-3-2-5-2-5s0 3-2 4c0-4-2-7-4-10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>,
    <svg key="globe" width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 16h24M16 4c-3 4-4 8-4 12s1 8 4 12M16 4c3 4 4 8 4 12s-1 8-4 12" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    <svg key="leaf" width="22" height="22" viewBox="0 0 32 32" fill="none">
      <path d="M6 26c4-8 10-12 20-14-2 10-8 16-20 14z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M6 26l5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    <svg key="handshake" width="22" height="22" viewBox="0 0 32 32" fill="none">
      <path d="M3 18l6-6h4l3-3h4l6 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M3 18l4 4 5-5 3 3 5-5 4 4-6 6H9L3 18z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>,
  ];

  return (
    <section className="relative" style={{ backgroundColor: "#f7f9f7" }}>
      {/* Fondu depuis le sombre du haut */}
      <div className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #0f2d1f 0%, #f7f9f7 100%)" }} />
      {/* Fondu vers le sombre du bas */}
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top, #071810 0%, #f7f9f7 100%)" }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-20 md:py-28 relative z-10">
        <div ref={headerRef} className="mb-12">
          <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${headerVisible ? "visible" : ""}`}
            style={{ color: "#c49a30" }}>
            {a.subthemesLabel}
          </p>
          <h2 className={`font-heading font-black text-2xl md:text-3xl ap-reveal ${headerVisible ? "visible" : ""}`}
            style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
            {a.subthemesTitle}
          </h2>
          <div className="w-14 h-[3px] rounded-full mt-4" style={{ background: "#c49a30" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {a.subthemes.map((st, i) => (
            <div
              key={st.num}
              ref={el => { cardRefs.current[i] = el; }}
              className={`group relative bg-white rounded-2xl p-6 border border-gray-100 cursor-default
                shadow-sm hover:shadow-xl hover:shadow-forest-900/10 hover:-translate-y-1.5
                transition-all duration-400 ease-out overflow-hidden
                ${cardsVisible[i] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: cardsVisible[i] ? "0ms" : `${i * 90}ms` }}
            >
              <GlowingEffect spread={40} glow={false} disabled={false} proximity={60} inactiveZone={0.01} borderWidth={2} variant="forest" />

              {/* Number watermark */}
              <span
                className="absolute top-3 right-4 font-heading font-black select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.08]"
                style={{ fontSize: "clamp(3rem, 8vw, 5rem)", color: "#246444", opacity: 0.04, lineHeight: 1 }}
                aria-hidden
              >
                {st.num}
              </span>

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center rounded-xl mb-4 transition-colors duration-300"
                  style={{ background: "rgba(36,100,68,0.08)", color: "#246444" }}>
                  {ICONS[i % ICONS.length]}
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-base md:text-lg mb-3 leading-snug" style={{ color: "#0f2d1f" }}>
                  {st.title}
                </h3>

                {/* Desc */}
                <p className="text-sm leading-relaxed" style={{ color: "rgba(15,45,31,0.52)" }}>
                  {st.desc}
                </p>
              </div>

              {/* Gold bottom bar */}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full rounded-full"
                style={{ background: "linear-gradient(to right, #246444, #c49a30)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── POURQUOI BÉNIN ────────────────────────────────────────────────────── */
function WhyBeninSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: cardRefs, visible: cardsVisible } = useRevealList(4, 90);
  const { t } = useLang();
  const a = t.about;

  const ICONS = [
    <svg key="map" width="20" height="20" viewBox="0 0 32 32" fill="none">
      <path d="M16 3C11 3 7 7.5 7 13c0 7.5 9 16 9 16s9-8.5 9-16c0-5.5-4-10-9-10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="16" cy="13" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    <svg key="pipe" width="20" height="20" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="13" width="28" height="6" rx="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="24" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    <svg key="shield" width="20" height="20" viewBox="0 0 32 32" fill="none">
      <path d="M16 3L5 8v8c0 6.5 4.7 12.6 11 14 6.3-1.4 11-7.5 11-14V8L16 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M11 16l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    <svg key="star" width="20" height="20" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="5" x2="16" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="30" x2="16" y2="27" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="16" x2="2" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="30" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-12 relative overflow-hidden" style={{ backgroundColor: "#071810" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none blur-[120px] opacity-18"
        style={{ background: "radial-gradient(ellipse, rgba(36,100,68,0.5) 0%, transparent 70%)" }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headerRef} className="mb-12">
          <p className={`text-[10px] font-bold uppercase tracking-[0.22em] mb-4 ap-fade ${headerVisible ? "visible" : ""}`}
            style={{ color: "rgba(196,154,48,0.70)", animationDelay: "0.05s" }}>
            {a.whyBeninLabel}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className={`font-heading font-black leading-tight ap-reveal ${headerVisible ? "visible" : ""}`}
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "white", animationDelay: "0.15s" }}>
              {a.whyBeninTitle}
            </h2>
            <p className={`text-sm md:max-w-xs ap-fade ${headerVisible ? "visible" : ""}`}
              style={{ color: "rgba(255,255,255,0.32)", animationDelay: "0.3s" }}>
              {a.whyBeninSub}
            </p>
          </div>
          <div className="w-14 h-[2px] mt-6" style={{ background: "linear-gradient(to right, #c49a30, transparent)" }} />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {a.whyBenin.map((item, i) => (
            <div key={item.tag} ref={el => { cardRefs.current[i] = el; }}>
              <div className={`group relative rounded-2xl p-6 border h-full transition-all duration-300 hover:-translate-y-1 ap-reveal ${cardsVisible[i] ? "visible" : ""}`}
                style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" }}>
                <div className="w-9 h-9 flex items-center justify-center rounded-xl mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "rgba(196,154,48,0.12)", color: "#c49a30" }}>
                  {ICONS[i]}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block"
                  style={{ color: "rgba(196,154,48,0.55)" }}>
                  {item.tag}
                </span>
                <h3 className="font-heading font-bold text-sm mb-2.5 transition-colors duration-200 group-hover:text-white"
                  style={{ color: "rgba(255,255,255,0.80)" }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {item.desc}
                </p>
                <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: "linear-gradient(to bottom, #c49a30, transparent)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PARTICIPANTS ──────────────────────────────────────────────────────── */
function ParticipantsSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: itemRefs, visible: itemsVisible } = useRevealList(6, 75);
  const { t } = useLang();
  const a = t.about;
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-12" style={{ backgroundColor: "#f7f9f7" }}>
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="mb-10">
          <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${headerVisible ? "visible" : ""}`}
            style={{ color: "#c49a30" }}>
            {a.participantsLabel}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className={`font-heading font-black text-2xl md:text-3xl ap-reveal ${headerVisible ? "visible" : ""}`}
              style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
              {a.participantsTitle}
            </h2>
            <p className={`text-sm md:max-w-xs ap-fade ${headerVisible ? "visible" : ""}`}
              style={{ color: "rgba(15,45,31,0.42)", animationDelay: "0.25s" }}>
              {a.participantsSub}
            </p>
          </div>
          <div className="w-12 h-[3px] rounded-full mt-5"
            style={{ background: "linear-gradient(to right, #c49a30, transparent)" }} />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {a.participants.map((p, i) => (
            <div key={i} ref={el => { itemRefs.current[i] = el; }}>
              <div className={`flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm ap-reveal ${itemsVisible[i] ? "visible" : ""}`}>
                <span className="shrink-0 inline-block font-heading font-bold text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{ background: "rgba(36,100,68,0.08)", color: "#246444" }}>
                  {p.count}
                </span>
                <p className="text-sm leading-snug pt-0.5" style={{ color: "rgba(15,45,31,0.62)" }}>
                  {p.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ORGANISATEURS ─────────────────────────────────────────────────────── */
function OrgsSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: cardRefs, visible: cardsVisible } = useRevealList(3, 110);
  const { t } = useLang();
  const a = t.about;

  return (
    <section className="px-4 sm:px-6 md:px-12 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: "white" }}>
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="mb-14">
          <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${headerVisible ? "visible" : ""}`}
            style={{ color: "#c49a30" }}>
            {a.orgsLabel}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className={`font-heading font-black text-2xl md:text-3xl leading-tight ap-reveal ${headerVisible ? "visible" : ""}`}
              style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
              {a.orgsTitle}
            </h2>
            <p className={`text-sm md:max-w-sm ap-fade ${headerVisible ? "visible" : ""}`}
              style={{ color: "rgba(15,45,31,0.42)", animationDelay: "0.25s" }}>
              {a.orgsSub}
            </p>
          </div>
          <div className="w-12 h-[3px] rounded-full mt-5"
            style={{ background: "linear-gradient(to right, #c49a30, transparent)" }} />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {a.orgs.map((org, i) => (
            <div key={org.name} ref={el => { cardRefs.current[i] = el; }}>
              <div className={`group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-full flex flex-col ap-reveal ${cardsVisible[i] ? "visible" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-1.5 w-full shrink-0"
                  style={{ background: `linear-gradient(to right, ${org.color}, transparent)` }} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center font-heading font-black text-sm shrink-0 transition-transform duration-300 group-hover:scale-105"
                      style={{ background: `${org.color}15`, color: org.color, border: `1.5px solid ${org.color}28` }}>
                      {org.initials}
                    </div>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full"
                      style={{ background: "rgba(36,100,68,0.06)", color: "rgba(15,45,31,0.45)" }}>
                      {org.location}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-base mb-1.5 leading-snug" style={{ color: "#0f2d1f" }}>
                    {org.name}
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-4" style={{ color: org.color }}>
                    {org.role}
                  </p>
                  <div className="h-px mb-4" style={{ background: "rgba(36,100,68,0.08)" }} />
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(15,45,31,0.52)" }}>
                    {org.desc}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] transition-all duration-500 group-hover:w-full"
                  style={{ background: `linear-gradient(to right, ${org.color}, transparent)`, width: "0%" }} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 ap-fade ${headerVisible ? "visible" : ""}`}
          style={{ borderTop: "1px solid rgba(36,100,68,0.10)", animationDelay: "0.4s" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#0f2d1f" }}>{a.ctaTitle}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.42)" }}>{a.ctaSub}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="mailto:contact@soafgn2027.org"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#246444", color: "white" }}>
              {a.ctaRegister} <ArrowUpRight className="w-4 h-4" />
            </a>
            <TransitionLink href="/programme"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200"
              style={{ border: "1px solid rgba(36,100,68,0.22)", color: "#246444" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(36,100,68,0.05)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
              {a.ctaProgram} <ArrowUpRight className="w-4 h-4" />
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
