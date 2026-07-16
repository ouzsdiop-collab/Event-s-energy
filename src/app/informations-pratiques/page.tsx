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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-3">{children}</p>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">{children}</h2>
      <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
    </div>
  );
}

const airlines = [
  { name: "Air France", route: "Paris CDG → Cotonou", freq: "4x/semaine" },
  { name: "Ethiopian Airlines", route: "Addis-Abeba → Cotonou", freq: "Quotidien" },
  { name: "Air Côte d'Ivoire", route: "Abidjan → Cotonou", freq: "Quotidien" },
  { name: "ASKY Airlines", route: "Lomé → Cotonou", freq: "Quotidien" },
  { name: "Royal Air Maroc", route: "Casablanca → Cotonou", freq: "3x/semaine" },
  { name: "Turkish Airlines", route: "Istanbul → Cotonou", freq: "3x/semaine" },
];

const hotels = [
  { name: "Sofitel Cotonou Marina Hotel & Spa", stars: 5, dist: "Lieu de l'événement", price: "150 000 – 250 000 FCFA / nuit", note: "Tarif négocié pour les participants — mentionner SOAFGN 2027 à la réservation", highlight: true },
  { name: "Azalaï Hôtel de la Plage", stars: 4, dist: "3 km du Sofitel", price: "60 000 – 95 000 FCFA / nuit", note: "Navette disponible sur demande", highlight: false },
  { name: "Golden Tulip Le Diplomate", stars: 4, dist: "5 km du Sofitel", price: "55 000 – 85 000 FCFA / nuit", note: "Proche du centre des affaires", highlight: false },
  { name: "Hôtel du Lac", stars: 3, dist: "4 km du Sofitel", price: "35 000 – 55 000 FCFA / nuit", note: "Rapport qualité/prix apprécié", highlight: false },
];

const visaFree = [
  "Bénin", "Burkina Faso", "Côte d'Ivoire", "Guinée-Bissau", "Mali", "Niger", "Sénégal", "Togo",
  "Nigeria", "Ghana", "Cameroun", "Gabon", "Congo", "RDC", "Rwanda", "Kenya", "Éthiopie",
  "Maurice", "Seychelles", "Cap-Vert",
];

const practicalInfo = [
  { icon: "💱", title: "Monnaie", content: "Franc CFA (XOF). 1 EUR ≈ 655 FCFA. Distributeurs disponibles à l'aéroport et en ville. Cartes bancaires acceptées dans les grands hôtels." },
  { icon: "🌡️", title: "Météo en février", content: "Saison sèche à Cotonou. Températures entre 27°C et 33°C. Faible humidité. Aucune précipitation attendue. Tenue légère recommandée." },
  { icon: "🕐", title: "Fuseau horaire", content: "UTC+1 (WAT – West Africa Time). Pas de décalage avec Paris en hiver. 1h de décalage avec Dakar." },
  { icon: "🔌", title: "Électricité", content: "220V / 50Hz. Prises de type E (standard français). Adaptateurs disponibles à l'hôtel." },
  { icon: "📱", title: "Connectivité", content: "Wi-Fi haut débit fourni dans toutes les salles de conférence et les espaces communs du Sofitel. SIM locale disponible à l'aéroport (MTN, Moov)." },
  { icon: "🚗", title: "Transferts", content: "Taxis depuis l'aéroport Cardinal Bernardin Gantin (~15 min, 3 000–5 000 FCFA). Uber disponible. Navettes organisées pour les délégations officielles sur demande." },
];

export default function InformationsPratiquesPage() {
  return (
    <div className="bg-[#f4f7f5] min-h-screen">

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #071810 0%, #0f2d1f 60%, #163d2a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px)" }} />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 border border-gold-500/30 rounded-full px-4 py-1.5 mb-7" style={{ backgroundColor: "rgba(196,154,48,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-400">Cotonou, Bénin · 3–5 février 2027</span>
          </div>
          <h1 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.05 }}>
            Informations pratiques
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl mb-10">
            Tout ce qu'il faut savoir pour préparer votre venue au Salon Ouest Africain Francophone sur le Gaz Naturel 2027.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#lieu" className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.70)" }}>
              📍 Le lieu
            </a>
            <a href="#acces" className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.70)" }}>
              ✈️ Accès
            </a>
            <a href="#visa" className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.70)" }}>
              🛂 Visas
            </a>
            <a href="#hebergement" className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.70)" }}>
              🏨 Hébergement
            </a>
          </div>
        </div>
        <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #c49a30 25%, #e8c96a 50%, #c49a30 75%, transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14 md:py-20 space-y-16">

        {/* Le lieu */}
        <div id="lieu">
          <FadeIn>
            <SectionLabel>Lieu de l'événement</SectionLabel>
            <SectionTitle>Sofitel Cotonou Marina Hotel & Spa</SectionTitle>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={60}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-52 relative" style={{ background: "linear-gradient(135deg, #0f2d1f 0%, #163d2a 50%, #246444 100%)" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-3">🏨</div>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Sofitel Cotonou Marina</p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#c49a30", color: "#071810" }}>★★★★★</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-gray-900 mb-2">Sofitel Cotonou Marina Hotel & Spa</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Établissement 5 étoiles situé en bord de mer, le Sofitel Cotonou est la référence hôtelière de la capitale économique du Bénin. Ses salles de conférence de dernière génération et ses espaces de networking en font le cadre idéal pour un salon de cette envergure.
                  </p>
                  <div className="space-y-2">
                    {[
                      { icon: "📍", text: "Boulevard de la Marina, Cotonou, Bénin" },
                      { icon: "📞", text: "+229 21 30 50 50" },
                      { icon: "🌐", text: "sofitel.com/cotonou" },
                      { icon: "🚗", text: "15 min de l'aéroport international" },
                    ].map(({ icon, text }) => (
                      <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500">
                        <span>{icon}</span><span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
                <div className="h-52 bg-gray-100 relative flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e8f0eb 0%, #d4e6d9 100%)" }}>
                  <div className="text-center">
                    <div className="text-5xl mb-2">🗺️</div>
                    <p className="text-gray-400 text-xs">Carte Google Maps</p>
                    <p className="text-gray-300 text-[10px] mt-1">Intégrée en production</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-gray-900 mb-3">Accès & Localisation</h3>
                  <div className="space-y-3">
                    {[
                      { mode: "Depuis l'aéroport", detail: "15 min en taxi (3 000–5 000 FCFA) · Uber disponible" },
                      { mode: "Depuis le centre-ville", detail: "10 min · Quartier de la Marina" },
                      { mode: "Parking", detail: "Parking sécurisé gratuit pour les participants" },
                      { mode: "Navettes officielles", detail: "Organisées pour les délégations sur inscription" },
                    ].map(({ mode, detail }) => (
                      <div key={mode} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{mode}</p>
                          <p className="text-xs text-gray-400">{detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Accès aérien */}
        <div id="acces">
          <FadeIn>
            <SectionLabel>Se rendre à Cotonou</SectionLabel>
            <SectionTitle>Accès aérien</SectionTitle>
          </FadeIn>
          <FadeIn delay={60}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-5">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: "#f0f6f2" }}>✈️</div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900 mb-1">Aéroport International Cardinal Bernardin Gantin</h3>
                  <p className="text-sm text-gray-500">Code IATA : <strong>COO</strong> · À 15 minutes du Sofitel Cotonou</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {airlines.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-forest-200 hover:bg-forest-50/30 transition-all duration-200">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ backgroundColor: "#f0f6f2" }}>✈</div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{a.name}</p>
                      <p className="text-[11px] text-gray-500">{a.route}</p>
                      <p className="text-[10px] font-semibold text-forest-600 mt-0.5">{a.freq}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="rounded-2xl p-5 md:p-6 border border-gold-200/50" style={{ backgroundColor: "rgba(196,154,48,0.05)" }}>
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">💡</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Conseil pour les participants</p>
                  <p className="text-sm text-gray-500 leading-relaxed">Nous recommandons d'arriver le 2 février 2027 au plus tard afin de vous installer et de participer à la session d'ouverture le 3 février. Des vols de retour le 6 février permettent d'assister à l'intégralité du programme.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Visas */}
        <div id="visa">
          <FadeIn>
            <SectionLabel>Formalités d'entrée</SectionLabel>
            <SectionTitle>Visas & Entrée au Bénin</SectionTitle>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-5">
            <FadeIn delay={60}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: "#f0f6f2" }}>✅</div>
                  <h3 className="font-heading font-bold text-gray-900">Pays exemptés de visa</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {visaFree.map((pays) => (
                    <span key={pays} className="text-xs font-medium px-2.5 py-1 rounded-full border border-forest-100 text-forest-700" style={{ backgroundColor: "#f0f6f2" }}>
                      {pays}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">Liste non exhaustive. Vérifiez auprès de l'ambassade du Bénin dans votre pays.</p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: "#f0f6f2" }}>🌐</div>
                    <h3 className="font-heading font-bold text-gray-900">Visa en ligne (e-Visa)</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Le Bénin propose un système d'e-Visa accessible depuis le portail officiel. Délai de traitement : 72h ouvrées. Coût : environ 50 USD.
                  </p>
                  <a href="https://evisa.gouv.bj" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-forest-600 hover:text-forest-800 transition-colors">
                    evisa.gouv.bj
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
                <div className="rounded-2xl p-5 border border-gold-200/50" style={{ backgroundColor: "rgba(196,154,48,0.05)" }}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg shrink-0">📋</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">Lettre d'invitation officielle</p>
                      <p className="text-sm text-gray-500 leading-relaxed">Une lettre d'invitation officielle du SOAFGN 2027 peut être fournie sur demande pour faciliter l'obtention du visa. Contactez-nous après votre inscription.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Hébergement */}
        <div id="hebergement">
          <FadeIn>
            <SectionLabel>Où séjourner</SectionLabel>
            <SectionTitle>Hébergements recommandés</SectionTitle>
          </FadeIn>
          <div className="space-y-4">
            {hotels.map((h, i) => (
              <FadeIn key={h.name} delay={i * 70}>
                <div className={`bg-white rounded-2xl border shadow-sm p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 transition-all duration-200 hover:shadow-md ${h.highlight ? "border-gold-300/60" : "border-gray-100"}`}>
                  {h.highlight && (
                    <div className="hidden md:flex w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: "#c49a30" }} />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="font-heading font-bold text-gray-900 text-sm">{h.name}</h3>
                          {h.highlight && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#c49a30", color: "#071810" }}>Lieu de l'événement</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gold-500">{"★".repeat(h.stars)}</span>
                          <span className="text-xs text-gray-400">· {h.dist}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{h.note}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-gray-800">{h.price}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <div className="mt-5 rounded-2xl p-5 border border-forest-200/40" style={{ backgroundColor: "rgba(36,100,68,0.04)" }}>
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">🏷️</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Tarif préférentiel Sofitel</p>
                  <p className="text-sm text-gray-500 leading-relaxed">Un bloc de chambres a été réservé au Sofitel Cotonou Marina à tarif négocié pour les participants du SOAFGN 2027. Mentionnez le code <strong className="text-gray-700">SOAFGN2027</strong> lors de votre réservation. Disponibilité limitée — réservez dès que possible.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Infos pratiques */}
        <div>
          <FadeIn>
            <SectionLabel>Sur place</SectionLabel>
            <SectionTitle>Informations utiles</SectionTitle>
          </FadeIn>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {practicalInfo.map((info, i) => (
              <FadeIn key={info.title} delay={i * 60}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full hover:shadow-md hover:border-forest-200 transition-all duration-200">
                  <div className="text-2xl mb-3">{info.icon}</div>
                  <h3 className="font-heading font-bold text-gray-900 text-sm mb-2">{info.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{info.content}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* CTA */}
        <FadeIn>
          <div className="rounded-2xl overflow-hidden">
            <div className="px-8 py-10 text-center" style={{ background: "linear-gradient(135deg, #0f2d1f, #163d2a)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-400 mb-3">Prêt à participer ?</p>
              <h2 className="font-heading font-black text-white text-xl md:text-2xl mb-2">Réservez votre place</h2>
              <p className="text-white/40 text-sm mb-7 max-w-md mx-auto">Demandez votre invitation et bénéficiez du bloc de chambres négocié au Sofitel pour les participants.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="mailto:contact@soafgn2027.org" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 hover:opacity-90" style={{ backgroundColor: "#c49a30", color: "#071810" }}>
                  Demander une invitation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </a>
                <a href="mailto:contact@soafgn2027.org?subject=Lettre%20d%27invitation%20SOAFGN%202027" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ border: "1px solid rgba(196,154,48,0.35)", color: "#c49a30" }}>
                  Demander une lettre d'invitation
                </a>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
