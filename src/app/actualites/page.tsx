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

type Category = "Tout" | "Intervenants" | "Programme" | "Partenariats" | "Organisation" | "Communiqué";

const categories: Category[] = ["Tout", "Intervenants", "Programme", "Partenariats", "Organisation", "Communiqué"];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Intervenants:  { bg: "rgba(36,100,68,0.10)",   text: "#246444" },
  Programme:     { bg: "rgba(30,82,56,0.10)",     text: "#1e5238" },
  Partenariats:  { bg: "rgba(196,154,48,0.12)",   text: "#9a7320" },
  Organisation:  { bg: "rgba(107,114,128,0.10)",  text: "#4b5563" },
  Communiqué:    { bg: "rgba(15,45,31,0.10)",     text: "#0f2d1f" },
};

const articles = [
  {
    id: 1,
    category: "Communiqué" as Category,
    date: "12 juillet 2026",
    title: "Lancement officiel du SOAFGANG 2027 : la première édition du Salon Ouest Africain Francophone sur le Gaz Naturel annoncée à Cotonou",
    excerpt: "NTAB ENERGY SARL annonce officiellement la tenue de la première édition du Salon Ouest Africain Francophone sur le Gaz Naturel du 3 au 5 février 2027 à l'hôtel Sofitel Cotonou Marina Hotel & Spa, sous le patronage du Gouvernement de la République du Bénin.",
    featured: true,
    readTime: "3 min",
  },
  {
    id: 2,
    category: "Intervenants" as Category,
    date: "8 juillet 2026",
    title: "Amadou Hott, Envoyé spécial du Président de la BAD pour Power Africa, confirmé comme intervenant principal",
    excerpt: "Figure incontournable de la transition énergétique africaine, Amadou Hott prendra la parole lors de la session plénière d'ouverture du SOAFGANG 2027 consacrée au financement des infrastructures gazières dans l'espace UEMOA.",
    featured: false,
    readTime: "2 min",
  },
  {
    id: 3,
    category: "Partenariats" as Category,
    date: "3 juillet 2026",
    title: "TotalEnergies rejoint le SOAFGANG 2027 en tant que partenaire platine",
    excerpt: "Le groupe TotalEnergies confirme son soutien à la première édition du salon en qualité de partenaire platine, marquant son engagement fort dans le développement du marché gazier ouest-africain francophone.",
    featured: false,
    readTime: "2 min",
  },
  {
    id: 4,
    category: "Programme" as Category,
    date: "28 juin 2026",
    title: "Les quatre sous-thèmes du SOAFGANG 2027 dévoilés : financement, risques, réglementation et investissement privé",
    excerpt: "Le comité scientifique du salon a arrêté les grandes orientations thématiques qui structureront les trois jours d'échanges. Chaque sous-thème donnera lieu à une session plénière et à des ateliers de travail.",
    featured: false,
    readTime: "4 min",
  },
  {
    id: 5,
    category: "Organisation" as Category,
    date: "20 juin 2026",
    title: "Ouverture des inscriptions : trois types de pass disponibles pour les participants",
    excerpt: "Les inscriptions en ligne sont désormais ouvertes sur le site officiel du salon. Trois catégories de pass sont proposées — VIP, Professionnel et Observateur — adaptées aux différents profils de participants attendus.",
    featured: false,
    readTime: "2 min",
  },
  {
    id: 6,
    category: "Intervenants" as Category,
    date: "15 juin 2026",
    title: "Mahaman Laouan Gaya, Secrétaire Général de l'APPO, confirmé au programme",
    excerpt: "Le Secrétaire Général de l'Organisation des Producteurs de Pétrole Africains participera à la table ronde sur l'harmonisation des cadres réglementaires dans le secteur gazier UEMOA.",
    featured: false,
    readTime: "2 min",
  },
  {
    id: 7,
    category: "Partenariats" as Category,
    date: "10 juin 2026",
    title: "L'UEMOA et la BOAD s'associent au salon comme partenaires institutionnels",
    excerpt: "Les deux institutions régionales confirment leur soutien institutionnel au SOAFGANG 2027, témoignant de la dimension stratégique de l'événement pour l'intégration économique de l'Afrique de l'Ouest.",
    featured: false,
    readTime: "3 min",
  },
  {
    id: 8,
    category: "Organisation" as Category,
    date: "2 juin 2026",
    title: "Accréditations presse : les demandes sont ouvertes jusqu'au 20 janvier 2027",
    excerpt: "Les journalistes, photographes et équipes audiovisuelles souhaitant couvrir le SOAFGANG 2027 peuvent soumettre leur demande d'accréditation via le formulaire en ligne disponible sur la page Presse du site officiel.",
    featured: false,
    readTime: "1 min",
  },
];

function ArticleCard({ article, featured = false, delay = 0 }: { article: typeof articles[0]; featured?: boolean; delay?: number }) {
  const cat = categoryColors[article.category] || { bg: "rgba(107,114,128,0.10)", text: "#6b7280" };

  if (featured) {
    return (
      <FadeIn delay={delay}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
          <div className="h-48 md:h-56 flex items-center justify-center relative" style={{ background: "linear-gradient(135deg, #0f2d1f 0%, #163d2a 50%, #246444 100%)" }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 12px)" }} />
            <div className="relative text-center px-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400 block mb-3">À la une</span>
              <div className="w-12 h-[2px] bg-gold-400/50 rounded-full mx-auto" />
            </div>
          </div>
          <div className="p-6 md:p-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ backgroundColor: cat.bg, color: cat.text }}>{article.category}</span>
              <span className="text-xs text-gray-400">{article.date}</span>
              <span className="text-xs text-gray-300">· {article.readTime} de lecture</span>
            </div>
            <h2 className="font-heading font-black text-gray-900 text-xl md:text-2xl leading-tight mb-3 group-hover:text-forest-700 transition-colors">{article.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">{article.excerpt}</p>
            <div className="flex items-center gap-2 text-sm font-semibold text-forest-600 group-hover:gap-3 transition-all duration-200">
              Lire l'article
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={delay}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-forest-200 transition-all duration-200 group cursor-pointer flex flex-col gap-3 h-full">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ backgroundColor: cat.bg, color: cat.text }}>{article.category}</span>
          <span className="text-xs text-gray-400">{article.date}</span>
        </div>
        <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug group-hover:text-forest-700 transition-colors flex-1">{article.title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-gray-300">{article.readTime} de lecture</span>
          <div className="flex items-center gap-1 text-xs font-semibold text-forest-600 group-hover:gap-2 transition-all duration-200">
            Lire
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export default function ActualitesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Tout");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featured = articles[0];
  const filtered = articles.slice(1).filter(a => activeCategory === "Tout" || a.category === activeCategory);

  return (
    <div className="bg-[#f4f7f5] min-h-screen">

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #071810 0%, #0f2d1f 60%, #163d2a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px)" }} />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 border border-gold-500/30 rounded-full px-4 py-1.5 mb-7" style={{ backgroundColor: "rgba(196,154,48,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-400">Actualités du salon</span>
          </div>
          <h1 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.05 }}>
            Actualités
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl">
            Suivez toutes les annonces, confirmations d'intervenants, partenariats et informations pratiques liées au SOAFGANG 2027.
          </p>
        </div>
        <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #c49a30 25%, #e8c96a 50%, #c49a30 75%, transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">

        {/* Article à la une */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <div className="md:col-span-2">
            <ArticleCard article={featured} featured delay={0} />
          </div>

          {/* Newsletter sidebar */}
          <FadeIn delay={100}>
            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4" style={{ backgroundColor: "#f0f6f2" }}>📬</div>
                <h3 className="font-heading font-bold text-gray-900 mb-2">Restez informé</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-5">Recevez les annonces exclusives du SOAFGANG 2027 directement dans votre boîte mail.</p>
                {subscribed ? (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(36,100,68,0.08)" }}>
                      <svg className="w-5 h-5 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-xs font-semibold text-gray-700">Inscription confirmée !</p>
                    <p className="text-xs text-gray-400 mt-1">Vous recevrez nos prochaines annonces.</p>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setSubscribed(true); }} className="space-y-3">
                    <input
                      required type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300"
                    />
                    <button type="submit" className="w-full text-xs font-bold py-2.5 rounded-lg transition-all duration-200 hover:opacity-90" style={{ backgroundColor: "#246444", color: "#fff" }}>
                      S'abonner aux actualités
                    </button>
                    <p className="text-[10px] text-gray-400 text-center">Pas de spam · Désinscription en 1 clic</p>
                  </form>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-600 mb-4">Liens rapides</p>
                <div className="space-y-2">
                  {[
                    { href: "/inscription", label: "S'inscrire au salon" },
                    { href: "/intervenants", label: "Voir les intervenants" },
                    { href: "/partenaires", label: "Devenir partenaire" },
                    { href: "/presse", label: "Accréditation presse" },
                  ].map(({ href, label }) => (
                    <TransitionLink key={href} href={href} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-xs text-gray-600 hover:text-forest-700 transition-colors group">
                      {label}
                      <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-forest-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </TransitionLink>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Filtres */}
        <FadeIn>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200"
                style={{
                  backgroundColor: activeCategory === cat ? "#246444" : "#fff",
                  color: activeCategory === cat ? "#fff" : "#6b7280",
                  borderColor: activeCategory === cat ? "#246444" : "#e5e7eb",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grille articles */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((article, i) => (
            <ArticleCard key={article.id} article={article} delay={i * 60} />
          ))}
        </div>

        {filtered.length === 0 && (
          <FadeIn>
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">Aucun article dans cette catégorie pour le moment.</p>
            </div>
          </FadeIn>
        )}

        {/* CTA bas de page */}
        <FadeIn>
          <div className="mt-14 rounded-2xl overflow-hidden">
            <div className="px-8 py-10 text-center" style={{ background: "linear-gradient(135deg, #0f2d1f, #163d2a)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-400 mb-3">Ne manquez rien</p>
              <h2 className="font-heading font-black text-white text-xl md:text-2xl mb-3">Rejoignez les participants</h2>
              <p className="text-white/40 text-sm mb-7 max-w-md mx-auto">Inscrivez-vous dès maintenant pour participer au premier salon gazier francophone d'Afrique de l'Ouest.</p>
              <TransitionLink href="/inscription" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 hover:opacity-90" style={{ backgroundColor: "#c49a30", color: "#071810" }}>
                S'inscrire maintenant
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </TransitionLink>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
