"use client";

import React, { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";

const subThemes = [
  {
    num: "01",
    title: "Financement des infrastructures gazières",
    desc: "Mécanismes de financement adaptés au contexte ouest-africain : PPP, project finance et financement mixte. Rôle de la BOAD dans la structuration des projets régionaux. Mobilisation des investisseurs nigérians dans les projets UEMOA.",
    question: "Comment rendre les projets gaziers bancables dans un environnement à risques élevés ?",
    items: [
      "Partenariats public-privé (PPP) et project finance",
      "Financement mixte et blended finance",
      "Rôle et instruments de la BOAD",
      "Mobilisation des investisseurs nigérians",
    ],
  },
  {
    num: "02",
    title: "Mécanismes de mitigation des risques",
    desc: "Couverture des risques politiques et réglementaires, mécanismes de garantie de paiement et instruments de garantie multilatéraux. Sécurité d'approvisionnement régionale via le West African Gas Pipeline (WAGP).",
    question: "Quels instruments permettent de sécuriser les investissements dans un contexte de risques transfrontaliers ?",
    items: [
      "Garanties de la Banque Mondiale et de la BAD",
      "Agences de crédit export (ECA)",
      "Mécanismes de garantie de paiement",
      "Sécurité d'approvisionnement via le WAGP",
    ],
  },
  {
    num: "03",
    title: "Harmonisation réglementaire pour un marché intégré",
    desc: "Cadre réglementaire cohérent à l'échelle UEMOA, alignement avec le WAPP, régulation tarifaire et accès non discriminatoire aux infrastructures. Facilitation des échanges transfrontaliers de gaz naturel.",
    question: "Comment construire un cadre régulateur commun qui facilite les échanges et attire les investisseurs ?",
    items: [
      "Alignement réglementaire UEMOA / WAPP",
      "Régulation tarifaire harmonisée",
      "Accès aux infrastructures partagées",
      "Facilitation des échanges transfrontaliers",
    ],
  },
  {
    num: "04",
    title: "Mesures incitatives à l'investissement privé",
    desc: "Incitations fiscales ciblées (exemptions, amortissements accélérés), structures tarifaires attractives et contrats d'achat d'électricité (PPA) sécurisés. Zones économiques énergétiques et hubs gaziers régionaux.",
    question: "Quelles incitations concrètes peuvent déclencher des décisions d'investissement dans le secteur gazier ?",
    items: [
      "Exemptions fiscales et amortissements accélérés",
      "Contrats d'achat d'électricité (PPA) sécurisés",
      "Zones économiques énergétiques spéciales",
      "Hubs gaziers régionaux",
    ],
  },
];

const participantCategories = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M5 21V7l8-4 8 4v14M9 21V9h6v12" />
      </svg>
    ),
    label: "Gouvernements des États membres",
    desc: "Ministres de l'Énergie et délégués officiels des 8 États membres de l'UEMOA",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: "Sociétés de distribution d'électricité",
    desc: "Responsables des entreprises nationales d'électricité des 8 pays UEMOA",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    label: "Producteurs d'électricité indépendants (IPP)",
    desc: "Secteur privé actif dans la production et la distribution d'énergie en Afrique de l'Ouest",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    label: "Sociétés nationales de distribution de gaz",
    desc: "Opérateurs gaziers nationaux et régionaux de l'espace UEMOA et du Nigeria",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
    label: "Institutions régionales",
    desc: "WAGP, WAPP, UEMOA — acteurs de l'intégration énergétique régionale",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Partenaires techniques et financiers",
    desc: "Banque Mondiale, BAD, BOAD, AES Investment Bank et autres bailleurs de fonds du secteur énergétique",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Délégation spéciale nigériane",
    desc: "Délégation de haut niveau du secteur énergétique nigérian — premier producteur gazier de la région",
  },
];

const beninReasons = [
  {
    title: "Position géographique stratégique",
    desc: "Corridor naturel Nigeria → Côte d'Ivoire, gateway pour le Niger et le Burkina Faso. Le Bénin se situe au cœur des flux énergétiques ouest-africains.",
    icon: "◎",
  },
  {
    title: "Hub gazier émergent",
    desc: "Voisin immédiat du Nigeria, premier producteur gazier d'Afrique de l'Ouest. Bénéficiaire direct du West African Gas Pipeline (WAGP), avec un objectif national d'électrification universelle.",
    icon: "✦",
  },
  {
    title: "Stabilité et attractivité",
    desc: "Stabilité politique reconnue, réformes économiques continues et environnement favorable à l'investissement — gages de confiance pour les partenaires internationaux.",
    icon: "◈",
  },
  {
    title: "Plateforme de dialogue régional",
    desc: "Opportunité stratégique pour consolider le rôle du Bénin comme plateforme de dialogue gazier régional et ancrer Cotonou comme capitale de l'énergie UEMOA.",
    icon: "⬡",
  },
];

const pages = [
  {
    name: "Accueil",
    href: "/",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    desc: "La vitrine principale du salon. Animation 3D interactive en temps réel, présentation de l'événement, chiffres clés, intervenants confirmés et partenaires.",
    features: ["Animation particules Three.js interactive à la souris", "Statistiques animées au défilement", "Carrousel partenaires en boucle", "Cartes intervenants avec effet hover"],
  },
  {
    name: "À propos",
    href: "/a-propos",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    desc: "Contexte, enjeux et raison d'être du salon. Présentation de la vision stratégique, des thématiques abordées et du cadre géographique UEMOA.",
    features: ["Thématiques principales du forum", "Contexte du marché gazier ouest-africain", "Objectifs de la 1ère édition", "Appel à devenir partenaire"],
  },
  {
    name: "Programme",
    href: "/programme",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    desc: "L'agenda complet sur 3 jours, du 3 au 5 février 2027. Sessions plénières, ateliers thématiques, networking et dîner de gala.",
    features: ["Navigation par jour (J1 / J2 / J3)", "Codes couleur par type de session", "Horaires et salles détaillés", "Intervenants associés à chaque session"],
  },
  {
    name: "Intervenants",
    href: "/intervenants",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    desc: "Galerie des experts, ministres et dirigeants confirmés pour cette édition, avec filtrage par catégorie et fiches détaillées.",
    features: ["Filtres par catégorie (Institutionnel, Secteur privé, etc.)", "Cartes avec animation d'entrée progressive", "Pays d'origine et drapeaux", "Badge de confirmation par intervenant"],
  },
  {
    name: "Inscription",
    href: "/inscription",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    desc: "Formulaire complet d'inscription avec sélection du type de pass, informations personnelles, organisations et accompagnants.",
    features: ["3 types de pass (VIP, Professionnel, Observateur)", "Tarification en FCFA", "Résumé dynamique de la commande", "Gestion des accompagnants"],
  },
  {
    name: "Espace Admin",
    href: "/espace-admin",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    desc: "Tableau de bord de gestion de l'événement avec KPIs en temps réel, gestion des participants, suivi des paiements et administration du programme.",
    features: ["KPIs animés (inscriptions, revenus FCFA, taux de remplissage)", "Table des participants avec recherche et filtres", "Graphiques de paiements et répartition des passes", "Sidebar collapsible et responsive mobile"],
  },
];

const techFeatures = [
  {
    title: "Animation 3D temps réel",
    desc: "Particules Three.js formant un nœud torique, réactives au mouvement de la souris. Optimisées pour ne pas freezer lors de la navigation entre pages.",
    icon: "✦",
  },
  {
    title: "Transitions de pages fluides",
    desc: "Un panneau sombre animé masque chaque changement de page et affiche le nom de la section, pour une navigation cinématique sans rechargement.",
    icon: "◈",
  },
  {
    title: "Bilingue FR / EN",
    desc: "Intégralité du contenu disponible en français et en anglais via un sélecteur de langue persistant dans la navigation.",
    icon: "◎",
  },
  {
    title: "100% responsive",
    desc: "Adapté smartphones, tablettes et desktops. Menu mobile avec ouverture fluide, sidebar admin avec drawer, grilles adaptatives.",
    icon: "⬡",
  },
  {
    title: "Animations au défilement",
    desc: "Cartes, titres et statistiques s'animent progressivement à l'entrée dans le viewport via IntersectionObserver, sans librairie externe.",
    icon: "◇",
  },
  {
    title: "Dashboard admin complet",
    desc: "Interface de gestion avec compteurs animés, graphiques SVG, tableau de participants, suivi des revenus en FCFA et gestion des communications.",
    icon: "▣",
  },
];

const prodFeatures = [
  "Base de données réelle (participants, paiements, sessions)",
  "Système de paiement en ligne (Mobile Money, carte bancaire, virement)",
  "Envoi automatique d'e-mails de confirmation et de badges",
  "Espace participant connecté (profil, programme personnalisé)",
  "Back-office admin avec authentification sécurisée",
  "Gestion des accréditations et QR codes",
  "Streaming live ou replay des sessions plénières",
  "Application mobile complémentaire (optionnelle)",
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms`, transition: "opacity 0.6s ease, transform 0.6s ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}>
      {children}
    </div>
  );
}

export default function PresentationPage() {
  return (
    <div className="bg-[#f4f7f5] min-h-screen">

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #071810 0%, #0f2d1f 60%, #163d2a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px)" }} />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 border border-gold-500/30 rounded-full px-4 py-1.5 mb-8" style={{ backgroundColor: "rgba(196,154,48,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-400">Concept Note Officiel — SOAFGN 2027</span>
          </div>
          <h1 className="font-heading font-black text-white mb-5" style={{ fontSize: "clamp(1.7rem, 5vw, 3rem)", lineHeight: 1.08 }}>
            Construire un marché gazier intégré<br />et accessible dans l'espace UEMOA
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-4">
            <span className="italic text-white/35">Défis, opportunités et engagements</span>
          </p>
          <p className="text-white/40 text-xs md:text-sm leading-relaxed max-w-xl mx-auto mb-10">
            Cotonou, Bénin — 3, 4 & 5 février 2027 · Sofitel Cotonou Marina
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <TransitionLink href="/" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 hover:opacity-90" style={{ backgroundColor: "#c49a30", color: "#071810" }}>
              Voir la maquette interactive
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </TransitionLink>
            <a href="mailto:contact@soafgn2027.org" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ border: "1px solid rgba(196,154,48,0.35)", color: "#c49a30" }}>
              Demander une invitation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
        <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #c49a30 25%, #e8c96a 50%, #c49a30 75%, transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-20">

        {/* Thème officiel */}
        <FadeIn>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-3">Thème central</p>
            <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl mb-5">
              Le thème officiel du SOAFGN 2027
            </h2>
            <div className="w-10 h-[3px] bg-gold-400 rounded-full mb-6" />
            <blockquote className="border-l-4 border-gold-400 pl-6 py-2 mb-6">
              <p className="font-heading font-bold text-gray-800 text-xl md:text-2xl leading-tight">
                "Construire un marché gazier intégré et accessible dans l'espace UEMOA : défis, opportunités et engagements"
              </p>
            </blockquote>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
              <p>
                Ce thème central reflète l'ambition collective des États membres de l'UEMOA de transformer la ressource gazière en véritable levier de développement économique et énergétique. Il positionne le SOAFGN 2027 comme l'espace de dialogue incontournable pour définir la trajectoire du secteur gazier régional.
              </p>
              <p>
                Panels, tables rondes et réunions B2B facilitées par le comité organisateur — le format est conçu pour maximiser les échanges substantiels, favoriser la conclusion de partenariats et produire des engagements concrets à l'issue de l'événement.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* 4 sous-thèmes */}
        <div>
          <FadeIn>
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-3">Programme thématique</p>
              <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Les 4 sous-thèmes</h2>
              <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
            </div>
          </FadeIn>
          <div className="space-y-5">
            {subThemes.map((st, i) => (
              <FadeIn key={st.num} delay={i * 80}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 hover:shadow-md hover:border-forest-200 transition-all duration-200">
                  <div className="flex items-start gap-5">
                    <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-heading font-black text-xl" style={{ backgroundColor: "#f0f6f2", color: "#246444" }}>
                      {st.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">{st.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4">{st.desc}</p>
                      <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mb-4">
                        <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                          <span className="text-amber-600 font-bold">Question centrale : </span>{st.question}
                        </p>
                      </div>
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                        {st.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Participants attendus */}
        <div>
          <FadeIn>
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-3">Participants</p>
              <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Qui sera présent à Cotonou ?</h2>
              <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
              <p className="text-sm text-gray-500 mt-3 max-w-2xl">
                Le SOAFGN 2027 rassemble les décideurs, investisseurs et institutions clés de l'écosystème gazier ouest-africain.
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-4">
            {participantCategories.map((cat, i) => (
              <FadeIn key={cat.label} delay={i * 60}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md hover:border-forest-200 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-forest-600" style={{ backgroundColor: "#f0f6f2" }}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 text-sm mb-1">{cat.label}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Pourquoi le Bénin ? */}
        <FadeIn>
          <div className="rounded-2xl overflow-hidden border border-forest-200/40">
            <div className="px-8 py-6 md:px-10" style={{ background: "linear-gradient(135deg, #0f2d1f, #163d2a)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-400 mb-2">Ancrage géographique</p>
              <h2 className="font-heading font-black text-white text-2xl md:text-3xl mb-1">Pourquoi le Bénin ?</h2>
              <p className="text-white/40 text-sm">Une position stratégique unique au cœur du réseau énergétique ouest-africain</p>
            </div>
            <div className="bg-white px-8 py-7 md:px-10">
              <div className="grid sm:grid-cols-2 gap-6">
                {beninReasons.map((reason) => (
                  <div key={reason.title} className="flex items-start gap-4">
                    <div className="text-2xl text-forest-600 font-light shrink-0 mt-0.5">{reason.icon}</div>
                    <div>
                      <h3 className="font-heading font-bold text-gray-900 text-sm mb-1.5">{reason.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{reason.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Les 6 pages de la maquette */}
        <div>
          <FadeIn>
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-3">Maquette interactive</p>
              <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Les 6 pages de la maquette</h2>
              <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
              <p className="text-sm text-gray-500 mt-3 max-w-xl">
                Prototype haute fidélité illustrant le potentiel digital du site officiel SOAFGN 2027 — naviguez librement.
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-5">
            {pages.map((page, i) => (
              <FadeIn key={page.name} delay={i * 60}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full group hover:shadow-md hover:border-forest-200 transition-all duration-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-forest-600" style={{ backgroundColor: "#f0f6f2" }}>
                      {page.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-gray-900 mb-0.5">{page.name}</h3>
                      <TransitionLink href={page.href} className="text-xs text-forest-600 hover:text-forest-800 font-medium transition-colors">
                        Voir la page →
                      </TransitionLink>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{page.desc}</p>
                  <ul className="space-y-1.5">
                    {page.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 mt-1.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Fonctionnalités techniques */}
        <div>
          <FadeIn>
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-3">Technique</p>
              <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Fonctionnalités clés de la maquette</h2>
              <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {techFeatures.map((feat, i) => (
              <FadeIn key={feat.title} delay={i * 50}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full hover:shadow-md hover:border-forest-200 transition-all duration-200">
                  <div className="text-2xl text-forest-600 mb-3 font-light">{feat.icon}</div>
                  <h3 className="font-heading font-bold text-gray-900 text-sm mb-2">{feat.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Ce qui serait développé en prod */}
        <FadeIn>
          <div className="rounded-2xl overflow-hidden border border-forest-200/40">
            <div className="px-8 py-6 md:px-10" style={{ background: "linear-gradient(135deg, #0f2d1f, #163d2a)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400 mb-2">Perspectives</p>
              <h2 className="font-heading font-black text-white text-2xl md:text-3xl mb-1">En version production</h2>
              <p className="text-white/40 text-sm">Ce que le site complet inclurait en plus de cette maquette</p>
            </div>
            <div className="bg-white px-8 py-7 md:px-10">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {prodFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Stack technique */}
        <FadeIn>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-3">Stack</p>
            <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl mb-5">Technologies utilisées</h2>
            <div className="w-10 h-[3px] bg-gold-400 rounded-full mb-7" />
            <div className="flex flex-wrap gap-2.5">
              {["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Three.js", "App Router", "Supabase", "i18n FR/EN", "IntersectionObserver API"].map((tech) => (
                <span key={tech} className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-forest-200 text-forest-700" style={{ backgroundColor: "#f0f6f2" }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* CTA final */}
        <FadeIn>
          <div className="text-center py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-4">Participer</p>
            <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl mb-3">Rejoignez le SOAFGN 2027</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">Cotonou, 3–5 février 2027. Pour toute demande de participation ou de partenariat, contactez le comité organisateur.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <TransitionLink href="/" className="inline-flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-white font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 shadow-sm">
                Explorer la maquette
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </TransitionLink>
              <a href="mailto:contact@soafgn2027.org" className="inline-flex items-center justify-center gap-2 border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200">
                Demander une invitation
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
