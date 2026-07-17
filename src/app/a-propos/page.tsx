"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

// Single-element reveal
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

// Per-element staggered reveal
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
      }, { threshold: 0.1 });
      o.observe(el);
      return o;
    });
    return () => obs.forEach(o => o?.disconnect());
  }, []);
  return { refs, visible };
}

export default function AProposPage() {
  return (
    <div style={{ backgroundColor: "#f4f7f5" }}>
      <HeroSection />
      <ContextSection />
      <ThemeSection />
      <SubthemesSection />
      <ChallengesSection />
      <WhyBeninSection />
      <ParticipantsSection />
      <ObjectivesSection />
      <ResultsSection />
      <OrgsSection />

      <style jsx global>{`
        @keyframes ap-slide-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ap-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ap-reveal { opacity: 0; }
        .ap-reveal.visible {
          animation: ap-slide-up 0.65s cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards;
        }
        .ap-fade { opacity: 0; }
        .ap-fade.visible {
          animation: ap-fade 0.75s ease forwards;
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
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: statRefs, visible: statsVisible } = useRevealList(4, 100);
  const { t } = useLang();
  const a = t.about;
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-12" style={{ backgroundColor: "white" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div ref={headerRef} className={`ap-reveal ${headerVisible ? "visible" : ""}`}>
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
              <div key={s.value} ref={el => { statRefs.current[i] = el; }}>
                <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full ap-reveal ${statsVisible[i] ? "visible" : ""}`}
                  style={{ animationDelay: `${i * 0.08}s` }}>
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
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: rowRefs, visible: rowsVisible } = useRevealList(4, 80);
  const { t } = useLang();
  const a = t.about;
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20" style={{ backgroundColor: "#f7f9f7" }}>
      <div ref={headerRef}>
        <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${headerVisible ? "visible" : ""}`}
          style={{ color: "#c49a30" }}>
          {a.subthemesLabel}
        </p>
        <h2 className={`font-heading font-black text-2xl md:text-3xl mb-12 ap-reveal ${headerVisible ? "visible" : ""}`}
          style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
          {a.subthemesTitle}
        </h2>
      </div>
      <div className="flex flex-col divide-y" style={{ borderColor: "rgba(36,100,68,0.10)" }}>
        {a.subthemes.map((st, i) => (
          <div key={st.num} ref={el => { rowRefs.current[i] = el; }}>
            <div className={`flex gap-8 py-5 md:py-8 ap-reveal ${rowsVisible[i] ? "visible" : ""}`}
              style={{ borderColor: "rgba(36,100,68,0.10)" }}>
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
          </div>
        ))}
      </div>
    </section>
  );
}

function ChallengesSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: cardRefs, visible: cardsVisible } = useRevealList(3, 100);
  const { t } = useLang();
  const a = t.about;

  const ICONS = [
    // Pipeline / infrastructure
    <svg key="infra" width="24" height="24" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="13" width="28" height="6" rx="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="24" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="7" x2="16" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="19" x2="16" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    // Shield / regulation
    <svg key="shield" width="24" height="24" viewBox="0 0 32 32" fill="none">
      <path d="M16 3L5 8v8c0 6.5 4.7 12.6 11 14 6.3-1.4 11-7.5 11-14V8L16 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M11 16l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    // Finance / chart
    <svg key="finance" width="24" height="24" viewBox="0 0 32 32" fill="none">
      <path d="M4 24l7-8 6 4 11-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="28" cy="8" r="2.5" stroke="currentColor" strokeWidth="2"/>
      <line x1="4" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
  ];

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-12" style={{ backgroundColor: "white" }}>
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef}>
          <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${headerVisible ? "visible" : ""}`}
            style={{ color: "#c49a30" }}>
            DÉFIS STRUCTURELS
          </p>
          <h2 className={`font-heading font-black text-2xl md:text-3xl mb-12 ap-reveal ${headerVisible ? "visible" : ""}`}
            style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
            Pourquoi ce salon est nécessaire
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {a.challenges.map((c, i) => (
            <div key={c.num} ref={el => { cardRefs.current[i] = el; }}>
              <div className={`group relative rounded-2xl p-6 border h-full ap-reveal ${cardsVisible[i] ? "visible" : ""}`}
                style={{
                  borderColor: "rgba(36,100,68,0.12)",
                  background: "white",
                  animationDelay: `${i * 0.1}s`,
                }}>
                {/* Numéro filigrane */}
                <span className="absolute top-5 right-5 font-heading font-black select-none pointer-events-none"
                  style={{ fontSize: "1.8rem", color: "#246444", opacity: 0.05 }}>
                  {c.num}
                </span>
                {/* Icône */}
                <div className="w-10 h-10 flex items-center justify-center rounded-xl mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "rgba(36,100,68,0.07)", color: "#c49a30" }}>
                  {ICONS[i]}
                </div>
                <h3 className="font-heading font-bold text-base mb-3" style={{ color: "#0f2d1f" }}>
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(15,45,31,0.55)" }}>
                  {c.desc}
                </p>
                {/* Barre colorée au survol */}
                <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: "linear-gradient(to right, #246444, #c49a30)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyBeninSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: cardRefs, visible: cardsVisible } = useRevealList(4, 90);
  const { t } = useLang();
  const a = t.about;

  const ICONS = [
    // Map / location
    <svg key="map" width="22" height="22" viewBox="0 0 32 32" fill="none">
      <path d="M16 3C11 3 7 7.5 7 13c0 7.5 9 16 9 16s9-8.5 9-16c0-5.5-4-10-9-10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="16" cy="13" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    // Pipeline
    <svg key="pipe" width="22" height="22" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="13" width="28" height="6" rx="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="24" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    // Shield
    <svg key="shield" width="22" height="22" viewBox="0 0 32 32" fill="none">
      <path d="M16 3L5 8v8c0 6.5 4.7 12.6 11 14 6.3-1.4 11-7.5 11-14V8L16 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M11 16l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    // Star / target
    <svg key="star" width="22" height="22" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2"/>
      <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="5" x2="16" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="30" x2="16" y2="27" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="5" y1="16" x2="2" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="30" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-12 relative overflow-hidden" style={{ backgroundColor: "#071810" }}>
      {/* Glow ambiance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none blur-[120px] opacity-20"
        style={{ background: "radial-gradient(ellipse, rgba(36,100,68,0.5) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headerRef} className="mb-14">
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
              style={{ color: "rgba(255,255,255,0.35)", animationDelay: "0.3s" }}>
              {a.whyBeninSub}
            </p>
          </div>
          <div className="w-14 h-[2px] mt-6"
            style={{ background: "linear-gradient(to right, #c49a30, transparent)" }} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {a.whyBenin.map((item, i) => (
            <div key={item.tag} ref={el => { cardRefs.current[i] = el; }}>
              <div className={`group relative rounded-2xl p-6 border h-full transition-all duration-300 hover:-translate-y-1 ap-reveal ${cardsVisible[i] ? "visible" : ""}`}
                style={{
                  borderColor: "rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(4px)",
                }}>
                {/* Icône */}
                <div className="w-10 h-10 flex items-center justify-center rounded-xl mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "rgba(196,154,48,0.12)", color: "#c49a30" }}>
                  {ICONS[i]}
                </div>
                {/* Tag */}
                <span className="text-[10px] font-bold uppercase tracking-widest mb-2 block"
                  style={{ color: "rgba(196,154,48,0.60)" }}>
                  {item.tag}
                </span>
                {/* Title */}
                <h3 className="font-heading font-bold text-base mb-3 transition-colors duration-200 group-hover:text-white"
                  style={{ color: "rgba(255,255,255,0.85)" }}>
                  {item.title}
                </h3>
                {/* Desc */}
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                  {item.desc}
                </p>
                {/* Bordure gauche au survol */}
                <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: "linear-gradient(to bottom, #c49a30, transparent)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParticipantsSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: itemRefs, visible: itemsVisible } = useRevealList(6, 80);
  const { t } = useLang();
  const a = t.about;

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-12" style={{ backgroundColor: "#f7f9f7" }}>
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="mb-12">
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
              style={{ color: "rgba(15,45,31,0.45)", animationDelay: "0.25s" }}>
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
                <span className="shrink-0 inline-block font-heading font-black text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{ background: "rgba(36,100,68,0.08)", color: "#246444" }}>
                  {p.count}
                </span>
                <p className="text-sm leading-snug pt-0.5" style={{ color: "rgba(15,45,31,0.65)" }}>
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

function ObjectivesSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: itemRefs, visible: itemsVisible } = useRevealList(5, 70);
  const { t } = useLang();
  const a = t.about;
  return (
    <section className="py-16 px-4 sm:px-6 md:px-12" style={{ backgroundColor: "white" }}>
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef}>
          <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${headerVisible ? "visible" : ""}`}
            style={{ color: "#c49a30" }}>
            {a.objectivesLabel}
          </p>
          <h2 className={`font-heading font-black text-2xl md:text-3xl mb-12 ap-reveal ${headerVisible ? "visible" : ""}`}
            style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
            {a.objectivesTitle}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-x-0 md:gap-x-16 gap-y-0">
          {a.objectives.map((obj, i) => (
            <div key={i} ref={el => { itemRefs.current[i] = el; }}>
              <div className={`flex items-start gap-4 py-5 border-t ap-reveal ${itemsVisible[i] ? "visible" : ""}`}
                style={{ borderColor: "rgba(36,100,68,0.09)" }}>
                <span className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(196,154,48,0.12)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#c49a30" }} />
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(15,45,31,0.65)" }}>{obj}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultsSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: colRefs, visible: colsVisible } = useRevealList(3, 100);
  const { t } = useLang();
  const a = t.about;

  const COLORS = ["#c49a30", "#246444", "#1e5238"];
  const cols = [a.results.institutional, a.results.economic, a.results.technical];

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-12" style={{ backgroundColor: "#f7f9f7" }}>
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="mb-12">
          <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${headerVisible ? "visible" : ""}`}
            style={{ color: "#c49a30" }}>
            {a.resultsLabel}
          </p>
          <h2 className={`font-heading font-black text-2xl md:text-3xl ap-reveal ${headerVisible ? "visible" : ""}`}
            style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
            {a.resultsTitle}
          </h2>
          <div className="w-12 h-[3px] rounded-full mt-5"
            style={{ background: "linear-gradient(to right, #c49a30, transparent)" }} />
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {cols.map((col, i) => (
            <div key={col.title} ref={el => { colRefs.current[i] = el; }}>
              <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full ap-reveal ${colsVisible[i] ? "visible" : ""}`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wider" style={{ color: COLORS[i] }}>
                    {col.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm leading-relaxed"
                      style={{ color: "rgba(15,45,31,0.60)" }}>
                      <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: COLORS[i] }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrgsSection() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { refs: cardRefs, visible: cardsVisible } = useRevealList(3, 90);
  const { t } = useLang();
  const a = t.about;
  return (
    <section className="px-4 sm:px-6 md:px-12 py-12 md:py-20" style={{ backgroundColor: "white" }}>
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef}>
          <p className={`text-[10px] font-bold uppercase tracking-[0.20em] mb-3 ap-fade ${headerVisible ? "visible" : ""}`}
            style={{ color: "#c49a30" }}>
            {a.orgsLabel}
          </p>
          <h2 className={`font-heading font-black text-2xl md:text-3xl mb-12 ap-reveal ${headerVisible ? "visible" : ""}`}
            style={{ color: "#0f2d1f", animationDelay: "0.1s" }}>
            {a.orgsTitle}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {a.orgs.map((org, i) => (
            <div key={org.name} ref={el => { cardRefs.current[i] = el; }}>
              <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-7 ap-reveal ${cardsVisible[i] ? "visible" : ""}`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 font-heading font-black text-sm"
                  style={{ background: "linear-gradient(135deg, #1e5238, #0f2d1f)", color: "#c49a30" }}>
                  {org.initials}
                </div>
                <h3 className="font-heading font-bold text-base mb-1" style={{ color: "#0f2d1f" }}>{org.name}</h3>
                <p className="text-[11px] font-bold uppercase tracking-wide mb-3" style={{ color: "#c49a30" }}>{org.role}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(15,45,31,0.50)" }}>{org.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 ap-fade ${headerVisible ? "visible" : ""}`}
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
      </div>
    </section>
  );
}
