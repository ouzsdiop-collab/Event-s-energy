"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(22px)" }}>
      {children}
    </div>
  );
}

const subjects = [
  "Demande d'information générale",
  "Inscription et accréditation",
  "Partenariat et sponsoring",
  "Accréditation presse / média",
  "Demande de lettre d'invitation",
  "Logistique et hébergement",
  "Autre",
];

const contacts = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
      </svg>
    ),
    label: "Email général",
    value: "info@soafgang2027.org",
    href: "mailto:info@soafgang2027.org",
    desc: "Réponse sous 48h ouvrées",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
      </svg>
    ),
    label: "Partenariats",
    value: "partenariats@soafgang2027.org",
    href: "mailto:partenariats@soafgang2027.org",
    desc: "Offres de sponsoring et partenariat",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
      </svg>
    ),
    label: "Presse & Médias",
    value: "presse@soafgang2027.org",
    href: "mailto:presse@soafgang2027.org",
    desc: "Accréditations et demandes journalistes",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3-8.57A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.29 6.29l1.42-1.42a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    label: "Téléphone",
    value: "+229 21 30 56 78",
    href: "tel:+22921305678",
    desc: "Lun – Ven · 8h00 – 17h00 (WAT)",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
    label: "Adresse",
    value: "Sofitel Cotonou Marina Hotel & Spa",
    href: "#",
    desc: "Boulevard de la Marina, Cotonou, Bénin",
  },
];

type FormState = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", org: "", email: "", subject: "", message: "", lettre: false });
  const [status, setStatus] = useState<FormState>("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulation — remplacé par un vrai appel API en production
    setTimeout(() => setStatus("sent"), 1800);
  };

  return (
    <div className="bg-[#f4f7f5] min-h-screen">

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #071810 0%, #0f2d1f 60%, #163d2a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px)" }} />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 border border-gold-500/30 rounded-full px-4 py-1.5 mb-7" style={{ backgroundColor: "rgba(196,154,48,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-400">Nous contacter</span>
          </div>
          <h1 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.05 }}>
            Contact
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl">
            Une question sur l'inscription, le programme, un partenariat ou une accréditation presse ? Notre équipe vous répond dans les plus brefs délais.
          </p>
        </div>
        <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #c49a30 25%, #e8c96a 50%, #c49a30 75%, transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Formulaire */}
          <div className="lg:col-span-3">
            <FadeIn>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 md:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-2">Formulaire</p>
                <h2 className="font-heading font-black text-gray-900 text-xl md:text-2xl mb-1">Envoyez-nous un message</h2>
                <div className="w-8 h-[3px] bg-gold-400 rounded-full mb-7" />

                {status === "sent" ? (
                  <div className="py-12 text-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(36,100,68,0.08)" }}>
                      <svg className="w-7 h-7 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">Message envoyé</h3>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">Notre équipe vous répondra sous 48h ouvrées à l'adresse indiquée.</p>
                    <button
                      onClick={() => { setStatus("idle"); setForm({ name: "", org: "", email: "", subject: "", message: "", lettre: false }); }}
                      className="mt-6 text-sm font-semibold text-forest-600 hover:text-forest-800 transition-colors"
                    >
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom complet <span className="text-red-400">*</span></label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Votre nom et prénom"
                          className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organisation</label>
                        <input
                          type="text"
                          value={form.org}
                          onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
                          placeholder="Entreprise ou institution"
                          className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Adresse e-mail <span className="text-red-400">*</span></label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="votre@email.com"
                        className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Objet <span className="text-red-400">*</span></label>
                      <select
                        required
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all text-gray-700 bg-white"
                      >
                        <option value="">Sélectionnez un objet</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message <span className="text-red-400">*</span></label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Décrivez votre demande..."
                        className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all resize-none placeholder:text-gray-300"
                      />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={form.lettre}
                          onChange={e => setForm(f => ({ ...f, lettre: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${form.lettre ? "border-forest-600 bg-forest-600" : "border-gray-300 bg-white"}`}>
                          {form.lettre && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 leading-relaxed">Je souhaite recevoir une lettre d'invitation officielle du SOAFGN 2027 pour faciliter l'obtention de mon visa.</span>
                    </label>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
                      style={{ backgroundColor: "#246444", color: "#fff" }}
                    >
                      {status === "sending" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer le message
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Contacts & liens rapides */}
          <div className="lg:col-span-2 space-y-5">
            <FadeIn delay={100}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-5">Coordonnées</p>
                <div className="space-y-4">
                  {contacts.map((c, i) => (
                    <a key={i} href={c.href} className="flex items-start gap-3.5 group">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-forest-600 transition-colors group-hover:bg-forest-600 group-hover:text-white" style={{ backgroundColor: "#f0f6f2" }}>
                        {c.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{c.label}</p>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-forest-700 transition-colors">{c.value}</p>
                        <p className="text-xs text-gray-400">{c.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={160}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-5">Liens utiles</p>
                <div className="space-y-2">
                  {[
                    { href: "/inscription", label: "S'inscrire au salon" },
                    { href: "/informations-pratiques", label: "Visas et hébergement" },
                    { href: "/partenaires", label: "Devenir partenaire" },
                    { href: "/programme", label: "Consulter le programme" },
                  ].map(({ href, label }) => (
                    <TransitionLink key={href} href={href} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 text-sm text-gray-600 hover:text-forest-700 transition-colors group">
                      {label}
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-forest-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </TransitionLink>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={220}>
              <div className="rounded-2xl p-5 border border-gold-200/50" style={{ backgroundColor: "rgba(196,154,48,0.05)" }}>
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0">⏱️</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Délai de réponse</p>
                    <p className="text-xs text-gray-500 leading-relaxed">Notre équipe traite les demandes du lundi au vendredi de 8h à 17h (heure de Cotonou, UTC+1). Délai habituel de réponse : 48h ouvrées.</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
