"use client";

import React, { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";

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
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-400">Document de présentation</span>
          </div>
          <h1 className="font-heading font-black text-white mb-5" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1.05 }}>
            Maquette interactive du<br />
            <span style={{ background: "linear-gradient(90deg, #c49a30, #e8c96a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Salon Gaz Naturel UEMOA 2027
            </span>
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10">
            Ce document présente les fonctionnalités, les pages et le potentiel de développement de cette maquette web interactive réalisée pour le SOAFGN 2027.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <TransitionLink href="/" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 hover:opacity-90" style={{ backgroundColor: "#c49a30", color: "#071810" }}>
              Voir la maquette
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </TransitionLink>
            <TransitionLink href="/espace-admin" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ border: "1px solid rgba(196,154,48,0.35)", color: "#c49a30" }}>
              Voir l'espace admin
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </TransitionLink>
          </div>
        </div>
        <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #c49a30 25%, #e8c96a 50%, #c49a30 75%, transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-20">

        {/* Qu'est-ce que cette maquette */}
        <FadeIn>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-3">Contexte</p>
            <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl mb-5">Qu'est-ce que cette maquette ?</h2>
            <div className="w-10 h-[3px] bg-gold-400 rounded-full mb-6" />
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 leading-relaxed">
              <p>
                Cette maquette est un prototype web interactif haute fidélité conçu pour illustrer le potentiel digital du <strong className="text-gray-800">Salon Ouest Africain Francophone sur le Gaz Naturel (SOAFGN) 2027</strong>. Elle représente ce que pourrait être le site officiel de l'événement, une fois développé en production.
              </p>
              <p>
                Elle permet aux parties prenantes de naviguer sur l'ensemble des pages, de tester les fonctionnalités interactives et d'évaluer l'identité visuelle avant tout engagement de développement. Elle n'est pas connectée à une base de données réelle : les données affichées sont des exemples représentatifs.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Les 6 pages */}
        <div>
          <FadeIn>
            <div className="mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-3">Contenu</p>
              <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Les 6 pages de la maquette</h2>
              <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
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
              <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Fonctionnalités clés</h2>
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
              {["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Three.js", "App Router", "i18n FR/EN", "IntersectionObserver API"].map((tech) => (
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-4">Explorer</p>
            <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl mb-3">Naviguez sur la maquette</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">Explorez librement toutes les pages, testez le changement de langue, les animations et l'espace admin.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <TransitionLink href="/" className="inline-flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-white font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 shadow-sm">
                Page d'accueil
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </TransitionLink>
              <TransitionLink href="/espace-admin" className="inline-flex items-center justify-center gap-2 border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200">
                Espace admin
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </TransitionLink>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
