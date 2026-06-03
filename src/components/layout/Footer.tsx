"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const footerLinks = {
  rapides: [
    { href: "/", label: "Accueil" },
    { href: "/a-propos", label: "À propos" },
    { href: "/programme", label: "Programme" },
    { href: "/inscription", label: "S'inscrire" },
  ],
  evenement: [
    { href: "/a-propos", label: "Thèmes & sous-thèmes" },
    { href: "/intervenants", label: "Intervenants" },
    { href: "/programme", label: "Agenda complet" },
    { href: "/inscription", label: "Participer" },
  ],
  legal: [
    { href: "#", label: "Mentions légales" },
    { href: "#", label: "Politique de confidentialité" },
  ],
};

const socials = [
  {
    label: "LinkedIn", href: "#",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    label: "X / Twitter", href: "#",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    label: "YouTube", href: "#",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
];

export default function Footer() {
  const waveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const barCount = 28;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let t = 0;
    const animate = () => {
      waveRefs.current.forEach((el, i) => {
        if (el) {
          const shift = Math.sin((t + i * 0.35) * 0.5) * 4;
          el.style.transform = `translateX(${shift}px)`;
        }
      });
      t += 0.04;
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    if (isVisible) {
      animate();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isVisible]);

  return (
    <footer ref={footerRef} className="relative flex flex-col w-full overflow-hidden select-none">

      {/* ── CTA Banner — fond légèrement surélevé avec vignette radiale ── */}
      <div className="relative py-16 px-4 text-center"
        style={{ backgroundColor: "#132b1c", backgroundImage: "radial-gradient(ellipse 70% 120% at 50% 50%, rgba(36,100,68,0.18) 0%, transparent 70%)" }}>

        {/* Ligne dorée supérieure */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ background: "linear-gradient(to right, transparent, #c49a30 25%, #e8c96a 50%, #c49a30 75%, transparent)" }} />

        <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-4" style={{ color: "#c49a30" }}>
          1ère Édition &nbsp;·&nbsp; Cotonou, Bénin &nbsp;·&nbsp; 3–5 Février 2027
        </p>
        <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-3 max-w-2xl mx-auto leading-tight">
          Participez à la construction d&apos;un avenir gazier intégré et durable.
        </h2>
        <p className="mb-7 max-w-md mx-auto text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Rejoignez les décideurs, investisseurs et experts du secteur à Cotonou en février 2027.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/inscription"
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#c49a30", color: "#0a1f14" }}>
            S&apos;inscrire dès maintenant
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/inscription"
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 hover:bg-white/5"
            style={{ border: "1px solid rgba(196,154,48,0.4)", color: "#d4aa3a" }}>
            Programme
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Ligne de séparation bas */}
        <div className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.06) 80%, transparent)" }} />
      </div>

      {/* ── Main links — fond le plus sombre ── */}
      <div className="py-14 px-4" style={{ backgroundColor: "#071810" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-heading font-black mb-5" style={{ lineHeight: 0.95 }}>
              <span className="block text-[10px] font-medium uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>
                Salon Ouest Africain Francophone du
              </span>
              <span className="block text-2xl text-white">GAZ</span>
              <span className="block text-2xl" style={{
                background: "linear-gradient(90deg, #246444, #c49a30)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>NATUREL</span>
              <span className="block text-xl mt-1" style={{ color: "transparent", WebkitTextStroke: "1px rgba(196,154,48,0.30)" }}>2027</span>
            </div>
            <p className="text-xs leading-relaxed mb-6 max-w-xs" style={{ color: "rgba(255,255,255,0.38)" }}>
              La rencontre régionale de référence pour les acteurs du secteur gazier de l&apos;espace UEMOA.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.40)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#c49a30"; (e.currentTarget as HTMLElement).style.color = "#c49a30"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.40)"; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: "rgba(255,255,255,0.30)" }}>Liens rapides</h4>
            <ul className="space-y-3">
              {footerLinks.rapides.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.50)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.50)")}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* L'événement */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: "rgba(255,255,255,0.30)" }}>L&apos;Événement</h4>
            <ul className="space-y-3">
              {footerLinks.evenement.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href} className="text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.50)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.50)")}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5" style={{ color: "rgba(255,255,255,0.30)" }}>Contact</h4>
            <ul className="space-y-3.5">
              {[
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#c49a30" }}>
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                  </svg>), text: "info@gaz-naturel-uemoa.org" },
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#c49a30" }}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3-8.57A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.29 6.29l1.42-1.42a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>), text: "+229 21 30 56 78" },
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#c49a30" }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>), text: "Sofitel Cotonou Marina, Bénin" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {icon}<span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="px-4" style={{ backgroundColor: "#071810", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 py-4">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © 2027 Salon Ouest Africain Francophone sur le Gaz Naturel – Tous droits réservés
          </span>
          <div className="flex gap-5">
            {footerLinks.legal.map(({ href, label }) => (
              <Link key={label} href={href} className="text-xs transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >{label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Wave animation ── */}
      <div aria-hidden="true" style={{ overflow: "hidden", height: 80, position: "relative", backgroundColor: "#071810" }}>
        {Array.from({ length: barCount }).map((_, i) => {
          const progress = i / (barCount - 1);
          const alpha = Math.sin(progress * Math.PI);
          return (
            <div key={i} ref={(el) => { waveRefs.current[i] = el; }}
              style={{
                height: "1.5px",
                background: `linear-gradient(to right, transparent, rgba(30,82,56,${0.3 + alpha * 0.4}) 20%, rgba(196,154,48,${alpha * 0.7}) 50%, rgba(30,82,56,${0.3 + alpha * 0.4}) 80%, transparent)`,
                marginBottom: "1.5px",
                willChange: "transform",
                opacity: 0.4 + alpha * 0.6,
              }}
            />
          );
        })}
      </div>
    </footer>
  );
}
