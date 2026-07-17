"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { supabase, type Partner } from "@/lib/supabase";

const tierOptions = [
  { value: "platine", label: "Platine,  15 000 000 FCFA" },
  { value: "or", label: "Or,  8 000 000 FCFA" },
  { value: "argent", label: "Argent,  4 000 000 FCFA" },
  { value: "institutionnel", label: "Institutionnel,  Sur mesure" },
  { value: "autre", label: "Autre / Je ne sais pas encore" },
];

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

const tiers = [
  {
    id: "platine", label: "Partenaire Platine", price: "15 000 000 FCFA",
    color: "#c49a30", bgColor: "rgba(196,154,48,0.06)", borderColor: "rgba(196,154,48,0.35)",
    badge: "Exclusif · 2 places",
    avantages: [
      "Logo en première position sur tous les supports (site, roll-ups, programme, badges)",
      "Stand premium 12m² dans l'espace d'exposition centrale",
      "10 pass VIP incluant accès à tous les événements (cocktails, dîner de gala)",
      "Prise de parole de 10 minutes lors d'une session plénière",
      "Remise d'une distinction officielle lors de la cérémonie d'ouverture",
      "Interview vidéo du représentant diffusée sur le site et les réseaux sociaux",
      "Full page publicitaire dans le programme officiel",
      "Accès à la liste des participants (avec consentement)",
      "Communication dédiée par newsletter auprès des inscrits",
      "Couverture photo/vidéo de votre stand",
    ],
  },
  {
    id: "or", label: "Partenaire Or", price: "8 000 000 FCFA",
    color: "#b8892a", bgColor: "rgba(184,137,42,0.04)", borderColor: "rgba(184,137,42,0.25)",
    badge: "4 places disponibles",
    avantages: [
      "Logo en deuxième rang sur tous les supports officiels",
      "Stand 6m² dans l'espace d'exposition",
      "6 pass Professionnel incluant accès aux cocktails",
      "Prise de parole de 5 minutes lors d'un atelier thématique",
      "Demi-page publicitaire dans le programme officiel",
      "Mention dans la newsletter pré-événement",
      "Remise de documentation aux participants",
      "Photo de groupe officielle avec les organisateurs",
    ],
  },
  {
    id: "argent", label: "Partenaire Argent", price: "4 000 000 FCFA",
    color: "#6b7280", bgColor: "rgba(107,114,128,0.04)", borderColor: "rgba(107,114,128,0.18)",
    badge: "Places disponibles",
    avantages: [
      "Logo sur les supports imprimés et le site web",
      "Stand 4m² dans l'espace d'exposition",
      "4 pass Professionnel",
      "Quart de page publicitaire dans le programme officiel",
      "Mention dans la newsletter post-événement",
      "Remise de documentation aux participants",
    ],
  },
  {
    id: "institutionnel", label: "Partenaire Institutionnel", price: "Sur mesure",
    color: "#246444", bgColor: "rgba(36,100,68,0.04)", borderColor: "rgba(36,100,68,0.18)",
    badge: "Organisations & Institutions",
    avantages: [
      "Logo sur le site et les supports officiels",
      "2 pass VIP pour les représentants officiels",
      "Mention dans les discours d'ouverture et de clôture",
      "Espace dédié dans le programme pour votre institution",
      "Conditions adaptées selon le niveau d'engagement",
    ],
  },
];

const tierColors: Record<string, string> = { platine: "#c49a30", or: "#b8892a", argent: "#6b7280", institutionnel: "#246444" };
const tierLabels: Record<string, string> = { platine: "Platine", or: "Or", argent: "Argent", institutionnel: "Institutionnel" };

const stats = [
  { value: "500+", label: "Participants attendus" },
  { value: "15", label: "Pays représentés" },
  { value: "40+", label: "Intervenants de haut niveau" },
  { value: "3 jours", label: "D'échanges et de networking" },
];

type PFormState = "idle" | "sending" | "sent";

export default function PartenairesPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [pForm, setPForm] = useState({ name: "", organisation: "", role: "", email: "", phone: "", tier_interest: "", message: "" });
  const [pStatus, setPStatus] = useState<PFormState>("idle");

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPStatus("sending");
    await supabase.from("partnership_requests").insert({
      name: pForm.name, organisation: pForm.organisation, role: pForm.role,
      email: pForm.email, phone: pForm.phone || null,
      tier_interest: pForm.tier_interest, message: pForm.message || null,
      status: "nouveau",
    });
    setPStatus("sent");
  };

  useEffect(() => {
    supabase.from("partners").select("*").eq("published", true).order("order_index")
      .then(({ data }) => { if (data) setPartners(data); });
  }, []);

  return (
    <div className="bg-[#f4f7f5] min-h-screen">
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #071810 0%, #0f2d1f 60%, #163d2a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px)" }} />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 border border-gold-500/30 rounded-full px-4 py-1.5 mb-7" style={{ backgroundColor: "rgba(196,154,48,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-400">Opportunités de partenariat</span>
          </div>
          <h1 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.05 }}>Partenaires & Sponsors</h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl mb-10">
            Associez votre organisation à la première édition du Salon Ouest Africain Francophone sur le Gaz Naturel et accédez à un réseau de décideurs de haut niveau à l'échelle régionale.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="font-heading font-black text-2xl mb-1" style={{ background: "linear-gradient(135deg, #c49a30, #e8c96a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.value}</div>
                <div className="text-xs text-white/40 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #c49a30 25%, #e8c96a 50%, #c49a30 75%, transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14 md:py-20 space-y-16">
        <FadeIn>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-3">Pourquoi nous rejoindre</p>
            <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl mb-5">Un événement au rayonnement régional</h2>
            <div className="w-10 h-[3px] bg-gold-400 rounded-full mb-7" />
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "🌍", title: "Visibilité régionale", desc: "Accédez à une audience de décideurs issus de 15 pays d'Afrique de l'Ouest francophone et centrale : ministres, DG d'entreprises énergétiques, institutions financières." },
                { icon: "🤝", title: "Networking de haut niveau", desc: "3 jours de panels, tables rondes et rencontres B2B avec les acteurs clés du secteur gazier UEMOA, dans un cadre propice aux partenariats stratégiques." },
                { icon: "📢", title: "Positionnement sectoriel", desc: "Associez votre marque à la transition énergétique en Afrique de l'Ouest et renforcez votre positionnement sur un marché à fort potentiel de croissance." },
              ].map(({ icon, title, desc }) => (
                <div key={title}>
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-heading font-bold text-gray-900 text-sm mb-2">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <div>
          <FadeIn>
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-3">Offres de partenariat</p>
              <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Choisissez votre niveau d'engagement</h2>
              <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
            </div>
          </FadeIn>
          <div className="space-y-5">
            {tiers.map((tier, i) => (
              <FadeIn key={tier.id} delay={i * 80}>
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200" style={{ borderColor: tier.borderColor }}>
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 shrink-0 p-6 md:p-7 flex flex-col justify-between" style={{ backgroundColor: tier.bgColor, borderRight: `1px solid ${tier.borderColor}` }}>
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full mb-4" style={{ backgroundColor: tier.color, color: "#fff" }}>{tier.label}</div>
                        <div className="font-heading font-black text-2xl md:text-3xl mb-1" style={{ color: tier.color }}>{tier.price}</div>
                        <p className="text-xs text-gray-400">{tier.badge}</p>
                      </div>
                      <a href="mailto:partenariats@soafgang2027.org"
                        className="mt-6 inline-flex items-center justify-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-lg transition-all duration-200 hover:opacity-90"
                        style={{ backgroundColor: tier.color, color: tier.id === "institutionnel" ? "#fff" : "#071810" }}>
                        Nous contacter
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </a>
                    </div>
                    <div className="flex-1 p-6 md:p-7">
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">Avantages inclus</p>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                        {tier.avantages.map((av) => (
                          <div key={av} className="flex items-start gap-2 text-xs text-gray-600">
                            <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: tier.color }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            {av}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {partners.length > 0 && (
          <div>
            <FadeIn>
              <div className="mb-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-3">Déjà engagés</p>
                <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Nos partenaires</h2>
                <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {partners.map((p, i) => (
                <FadeIn key={p.id} delay={i * 50}>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md hover:border-gray-200 transition-all duration-200 h-full">
                    {p.logo_url ? (
                      <img src={p.logo_url} alt={p.name} className="h-10 w-auto object-contain mb-3" />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-heading font-black text-sm mb-3" style={{ backgroundColor: `${tierColors[p.tier]}15`, color: tierColors[p.tier] }}>
                        {p.name.slice(0, 2)}
                      </div>
                    )}
                    <p className="font-heading font-bold text-gray-900 text-xs mb-2">{p.name}</p>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: `${tierColors[p.tier]}15`, color: tierColors[p.tier] }}>
                      {tierLabels[p.tier]}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        )}

        <FadeIn>
          <div id="contact-partenariat" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-7 border-b border-gray-50">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-2">Nous rejoindre</p>
              <h2 className="font-heading font-black text-gray-900 text-2xl">Déposez votre demande de partenariat</h2>
              <p className="text-sm text-gray-400 mt-2">Notre équipe vous recontacte sous 48h pour affiner ensemble le niveau d'engagement le mieux adapté.</p>
            </div>
            {pStatus === "sent" ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(36,100,68,0.08)" }}>
                  <svg className="w-7 h-7 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">Demande reçue !</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">Notre équipe partenariats vous contactera sous 48h à l'adresse <span className="font-semibold text-gray-700">{pForm.email}</span>.</p>
                <button onClick={() => { setPStatus("idle"); setPForm({ name:"",organisation:"",role:"",email:"",phone:"",tier_interest:"",message:"" }); }} className="mt-6 text-sm font-semibold text-forest-600 hover:text-forest-800 transition-colors">
                  Nouvelle demande
                </button>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="p-8 grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom complet <span className="text-red-400">*</span></label>
                  <input required type="text" value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} placeholder="Prénom Nom" className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organisation <span className="text-red-400">*</span></label>
                  <input required type="text" value={pForm.organisation} onChange={e => setPForm(f => ({ ...f, organisation: e.target.value }))} placeholder="Nom de l'entreprise / institution" className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fonction <span className="text-red-400">*</span></label>
                  <input required type="text" value={pForm.role} onChange={e => setPForm(f => ({ ...f, role: e.target.value }))} placeholder="DG, Directeur Marketing..." className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email professionnel <span className="text-red-400">*</span></label>
                  <input required type="email" value={pForm.email} onChange={e => setPForm(f => ({ ...f, email: e.target.value }))} placeholder="vous@organisation.com" className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Téléphone</label>
                  <input type="tel" value={pForm.phone} onChange={e => setPForm(f => ({ ...f, phone: e.target.value }))} placeholder="+229 XX XXX XXX" className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Niveau de partenariat envisagé <span className="text-red-400">*</span></label>
                  <select required value={pForm.tier_interest} onChange={e => setPForm(f => ({ ...f, tier_interest: e.target.value }))} className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all bg-white text-gray-700">
                    <option value="">Sélectionnez</option>
                    {tierOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message (facultatif)</label>
                  <textarea rows={3} value={pForm.message} onChange={e => setPForm(f => ({ ...f, message: e.target.value }))} placeholder="Vos objectifs, vos questions, votre contexte..." className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all resize-none placeholder:text-gray-300" />
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <p className="text-[11px] text-gray-400">Réponse garantie sous 48h · <a href="mailto:partenariats@soafgang2027.org" className="text-forest-600 font-semibold hover:underline">partenariats@soafgang2027.org</a></p>
                  <button type="submit" disabled={pStatus === "sending"} className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-60 shrink-0" style={{ backgroundColor: "#246444", color: "#fff" }}>
                    {pStatus === "sending" ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Envoi...</> : <>Envoyer ma demande <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></>}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* CTA rapide email en bas */}
          <div className="rounded-2xl overflow-hidden mt-5">
            <div className="px-8 py-8" style={{ background: "linear-gradient(135deg, #0f2d1f, #163d2a)" }}>
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-white/40 text-sm mb-4">Vous préférez nous écrire directement ?</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="mailto:partenariats@soafgang2027.org"
                    className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: "#c49a30", color: "#071810" }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
                    partenariats@soafgang2027.org
                  </a>
                  <TransitionLink href="/contact"
                    className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 hover:bg-white/5"
                    style={{ border: "1px solid rgba(196,154,48,0.35)", color: "#c49a30" }}>
                    Formulaire de contact
                  </TransitionLink>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
