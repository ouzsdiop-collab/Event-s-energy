import Hero from "@/components/home/Hero";
import Link from "next/link";
import { CheckCircle, TrendingUp, Shield, Handshake, Leaf } from "lucide-react";

const themes = [
  { num: "01", title: "Financement des infrastructures gazières", desc: "Mobiliser les capitaux pour développer des infrastructures compétitives et résilientes.", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80" },
  { num: "02", title: "Mitigation des risques pour les investisseurs", desc: "Identifier, partager et réduire les risques pour sécuriser les projets gaziers.", img: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&q=80" },
  { num: "03", title: "Harmonisation des cadres réglementaires", desc: "Aligner les politiques pour un marché régional intégré et attractif.", img: "https://images.unsplash.com/photo-1575879285940-f7d4a4b5a60d?w=600&q=80" },
  { num: "04", title: "Mesures incitatives à l'investissement privé", desc: "Créer un environnement favorable à l'investissement dans toute la chaîne de valeur.", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" },
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
      <Hero />

      {/* THEMES */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label">LES THÈMES CLÉS</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              4 axes pour bâtir l&apos;avenir du gaz naturel
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {themes.map((t) => (
              <div key={t.num} className="relative rounded-xl overflow-hidden min-h-64 group cursor-pointer"
                style={{ backgroundImage: `linear-gradient(to bottom, rgba(15,45,31,0.4) 0%, rgba(15,45,31,0.88) 100%), url('${t.img}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.num}
                  </div>
                  <div>
                    <h3 className="text-white font-heading font-bold text-sm leading-snug mb-2">{t.title}</h3>
                    <p className="text-gray-300 text-xs leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPEAKERS */}
      <section className="py-20 px-4 bg-sage-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label">ILS PRENDRONT LA PAROLE</p>
            <h2 className="text-3xl font-heading font-bold text-gray-900">Intervenants confirmés</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {speakers.map((sp) => (
              <div key={sp.name} className="text-center">
                <img src={sp.img} alt={sp.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-4 ring-white shadow-md" />
                <div className="font-heading font-bold text-gray-900 text-sm">{sp.name}</div>
                <div className="text-gray-500 text-xs mt-1 leading-snug">{sp.title}</div>
                <span className="inline-block mt-2 text-xs font-semibold text-forest-600 border border-forest-500 rounded-full px-3 py-0.5">CONFIRMÉ</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/programme" className="text-forest-600 text-sm font-semibold hover:text-forest-800 inline-flex items-center gap-1">
              Voir le programme complet →
            </Link>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-10 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">NOS PARTENAIRES ET SPONSORS</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {partners.map((p) => (
              <span key={p} className="text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors">{p}</span>
            ))}
            <Link href="#" className="text-forest-600 text-sm font-medium hover:underline">Voir tous →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
