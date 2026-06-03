import Hero from "@/components/home/Hero";
import ThemesSection from "@/components/home/ThemesSection";
import Link from "next/link";

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

      <ThemesSection />

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
