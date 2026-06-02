import Link from "next/link";
import { Calendar, Globe, Users, Mic, Shield, Handshake, TrendingUp, Leaf } from "lucide-react";

const stats = [
  { Icon: Calendar, value: "3", label: "jours" },
  { Icon: Globe, value: "8+", label: "pays représentés" },
  { Icon: Users, value: "500+", label: "participants attendus" },
  { Icon: Mic, value: "40+", label: "intervenants" },
];

const themes = [
  {
    num: "01",
    title: "Financement des infrastructures gazières",
    desc: "Mobiliser les capitaux pour développer des infrastructures compétitives et résilientes.",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80",
  },
  {
    num: "02",
    title: "Mitigation des risques pour les investisseurs",
    desc: "Identifier, partager et réduire les risques pour sécuriser les projets gaziers.",
    img: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&q=80",
  },
  {
    num: "03",
    title: "Harmonisation des cadres réglementaires",
    desc: "Aligner les politiques et réglementations pour un marché régional intégré et attractif.",
    img: "https://images.unsplash.com/photo-1575879285940-f7d4a4b5a60d?w=600&q=80",
  },
  {
    num: "04",
    title: "Mesures incitatives à l'investissement privé",
    desc: "Créer un environnement favorable à l'investissement et à l'innovation dans toute la chaîne de valeur.",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
  },
];

const platformFeatures = [
  { Icon: Shield, label: "Dialogue politique et réglementaire" },
  { Icon: Handshake, label: "Partenariats stratégiques" },
  { Icon: TrendingUp, label: "Opportunités d'investissement" },
  { Icon: Leaf, label: "Transition énergétique et durabilité" },
];

const programItems = [
  {
    title: "Sessions plénières et tables rondes",
    desc: "Débats de haut niveau avec décideurs publics et leaders de l'industrie.",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
  },
  {
    title: "Rencontres B2B et networking",
    desc: "Des opportunités qualifiées pour développer des partenariats et des projets.",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80",
  },
  {
    title: "Ateliers techniques et solutions",
    desc: "Sessions pratiques pour partager les meilleures pratiques et innovations.",
    img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80",
  },
  {
    title: "Espace d'exposition et innovation",
    desc: "Découvrez les solutions, technologies et services des acteurs clés du gaz naturel.",
    img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&q=80",
  },
];

const speakers = [
  { name: "Amadou Hott", title: "Envoyé spécial du Président de la BAD pour Power Africa", img: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Amina Benkhadra", title: "Directrice exécutive, African Energy Chamber", img: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Erik W. Rasmussen", title: "Vice-Président, Energia, IFC", img: "https://randomuser.me/api/portraits/men/3.jpg" },
  { name: "Wole Ogunsanya", title: "CEO, NNPC Gas Marketing Ltd.", img: "https://randomuser.me/api/portraits/men/4.jpg" },
];

const partners = ["UEMOA", "African Dev. Bank Group", "IFC", "Afreximbank", "Petronas", "bp", "TotalEnergies", "NNPC"];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-[580px] flex items-end pb-16"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(13,27,42,0.92) 50%, rgba(13,27,42,0.4) 100%), url('https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <p className="section-label">1ère ÉDITION</p>
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight mb-4 max-w-2xl">
            Salon Ouest Africain Francophone sur le Gaz Naturel
          </h1>
          <p className="text-green-400 font-semibold text-lg mb-2">
            Construire un marché gazier intégré et accessible dans l&apos;espace UEMOA
          </p>
          <div className="flex flex-wrap gap-5 text-white text-sm mb-8">
            <span className="flex items-center gap-2 opacity-90">
              <Calendar className="w-4 h-4 text-green-400 shrink-0" />
              3 au 5 février 2027
            </span>
            <span className="flex items-center gap-2 opacity-90">
              <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Sofitel Cotonou Marina Hôtel & Spa, Cotonou, Bénin
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/inscription" className="btn-primary text-base">
              S&apos;inscrire
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/programme" className="btn-outline text-base">
              Découvrir le programme
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-navy-800 py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map(({ Icon, value, label }, i) => (
              <div key={i} className="flex items-center gap-4 justify-center py-2 px-6">
                <Icon className="w-8 h-8 text-green-400 shrink-0" strokeWidth={1.5} />
                <div className="text-white">
                  <div className="text-3xl font-heading font-black leading-none">{value}</div>
                  <div className="text-sm text-gray-400 mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM SECTION */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="section-label">UNE PLATEFORME RÉGIONALE STRATÉGIQUE</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-900 mb-6 leading-tight">
              Le rendez-vous incontournable du gaz naturel en Afrique de l&apos;Ouest
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Le Salon Ouest Africain Francophone sur le Gaz Naturel est la plateforme de référence pour le
              dialogue, la coopération et l&apos;investissement dans le secteur gazier au sein de l&apos;espace
              UEMOA et au-delà.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Décideurs publics, investisseurs, opérateurs, institutions financières et experts se réunissent
              pour accélérer le développement d&apos;un marché gazier compétitif, durable et inclusif.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {platformFeatures.map(({ Icon, label }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <Icon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-navy-900 rounded-2xl p-8 text-white">
            <h3 className="font-heading font-bold text-xl mb-4">L&apos;espace UEMOA</h3>
            <div className="bg-navy-800 rounded-xl p-6 mb-4 flex items-center justify-center min-h-48">
              <svg viewBox="0 0 200 180" className="w-full max-w-xs opacity-80" fill="none">
                <path d="M60 40 Q80 20 120 30 L150 50 Q170 60 165 90 L155 120 Q140 145 120 150 L90 155 Q65 150 50 130 L40 100 Q35 70 60 40Z" fill="#1a3550" stroke="#22c55e" strokeWidth="1.5"/>
                {[85,105,120,70,95,135,110,75].map((cx, i) => (
                  <circle key={i} cx={cx} cy={[95,80,105,110,120,90,60,70][i]} r="3" fill="#22c55e" opacity={i < 2 ? "0.9" : "0.5"}/>
                ))}
                <path d="M15 32 Q24 26 33 32" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Un marché de plus de 125 millions d&apos;habitants, engagé pour une intégration énergétique et
              économique durable.
            </p>
            <Link href="/a-propos" className="text-green-400 text-sm font-semibold hover:text-green-300 mt-4 inline-flex items-center gap-1">
              En savoir plus sur l&apos;UEMOA
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* KEY THEMES */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label">LES THÈMES CLÉS</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-900">
              4 axes pour bâtir ensemble l&apos;avenir du gaz naturel
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {themes.map((t) => (
              <div
                key={t.num}
                className="relative rounded-xl overflow-hidden min-h-64 group cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(13,27,42,0.45) 0%, rgba(13,27,42,0.88) 100%), url('${t.img}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.num}
                  </div>
                  <div>
                    <h3 className="text-white font-heading font-bold text-base leading-snug mb-2">{t.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMME OVERVIEW + SPEAKERS */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <p className="section-label">APERÇU DU PROGRAMME</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {programItems.map((item) => (
                <div key={item.title} className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  <div
                    className="h-32 bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(rgba(13,27,42,0.5),rgba(13,27,42,0.5)), url('${item.img}')` }}
                  />
                  <div className="p-3">
                    <h4 className="font-heading font-bold text-navy-900 text-sm leading-snug mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/programme" className="text-green-600 text-sm font-semibold hover:text-green-500 inline-flex items-center gap-1">
              Voir le programme complet
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div>
            <p className="section-label">ILS PRENDRONT LA PAROLE</p>
            <div className="grid grid-cols-2 gap-6 mb-6">
              {speakers.map((sp) => (
                <div key={sp.name} className="text-center">
                  <img
                    src={sp.img}
                    alt={sp.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-gray-100"
                  />
                  <div className="font-heading font-bold text-navy-900 text-sm">{sp.name}</div>
                  <div className="text-gray-500 text-xs mt-1 leading-snug">{sp.title}</div>
                  <span className="inline-block mt-2 text-xs font-semibold text-green-600 border border-green-600 rounded px-2 py-0.5">
                    CONFIRMÉ
                  </span>
                </div>
              ))}
            </div>
            <Link href="/intervenants" className="text-green-600 text-sm font-semibold hover:text-green-500 inline-flex items-center gap-1">
              Découvrir tous les intervenants
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-10 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
            NOS PARTENAIRES ET SPONSORS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {partners.map((p) => (
              <span key={p} className="text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors cursor-pointer">
                {p}
              </span>
            ))}
            <Link href="/partenaires" className="text-green-600 text-sm font-medium hover:underline">
              Voir tous nos partenaires &rarr;
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
