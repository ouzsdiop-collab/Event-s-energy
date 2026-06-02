import Link from "next/link";
import { Target, Users, Globe, Zap, CheckCircle } from "lucide-react";

const objectives = [
  "Faciliter le dialogue et le partage de connaissances entre gouvernements, investisseurs et opérateurs du secteur",
  "Identifier des modèles de financement viables et des structures de partenariat pour les projets gaziers",
  "Promouvoir le gaz naturel comme solution pour la production d'électricité et le développement industriel",
  "Renforcer la coopération régionale en matière d'intégration énergétique",
  "Positionner l'espace UEMOA comme un marché gazier attractif et compétitif",
];

const subthemes = [
  {
    num: "01",
    title: "Financement des infrastructures gazières",
    desc: "Mobiliser les capitaux pour développer des infrastructures de transport, de stockage et de distribution compétitives et résilientes dans la région.",
  },
  {
    num: "02",
    title: "Mitigation des risques dans la chaîne de valeur du gaz",
    desc: "Identifier, partager et réduire les risques techniques, financiers et règlementaires pour sécuriser les investissements dans les projets gaziers.",
  },
  {
    num: "03",
    title: "Harmonisation des cadres réglementaires",
    desc: "Aligner les politiques et réglementations nationales pour créer un cadre régional cohérent, prévisible et attractif pour les investisseurs.",
  },
  {
    num: "04",
    title: "Mesures incitatives à l'investissement privé",
    desc: "Créer un environnement des affaires favorable à l'investissement privé et à l'innovation dans toute la chaîne de valeur du gaz naturel.",
  },
];

const expectedResults = [
  { category: "Résultats institutionnels", items: ["Adoption d'une feuille de route régionale sur le gaz naturel", "Renforcement des cadres de coopération entre pays francophones et secteur privé"] },
  { category: "Résultats économiques", items: ["Identification de projets structurants (centrales, pipelines, terminaux GNL)", "Mobilisation d'investissements publics et privés", "Développement de partenariats stratégiques régionaux et internationaux"] },
  { category: "Résultats techniques", items: ["Partage des meilleures pratiques sur la conception et l'exploitation d'infrastructures gazières", "Meilleure compréhension de la réglementation sectorielle", "Contributions pratiques à l'intégration énergétique régionale"] },
];

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-64 flex items-end pb-12"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(13,27,42,0.9) 50%, rgba(13,27,42,0.5) 100%), url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <p className="section-label">À PROPOS</p>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-3">
            Présentation de l&apos;évènement
          </h1>
          <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">
            La première plateforme régionale dédiée au développement du gaz naturel en Afrique de l&apos;Ouest francophone.
          </p>
        </div>
      </section>

      {/* Context */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="section-label">CONTEXTE ET JUSTIFICATION</p>
            <h2 className="text-3xl font-heading font-bold text-navy-900 mb-6 leading-tight">
              Un marché gazier régional en construction
            </h2>
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4 leading-relaxed">
              <p>
                L&apos;Afrique connaît une croissance soutenue de la demande d&apos;électricité, projetée à plus de 40 % à l&apos;horizon 2040. Dans l&apos;espace UEMOA, le taux d&apos;électrification moyen s&apos;établissait à 56,37 % en 2023, laissant près de la moitié de la population sans accès à une énergie fiable.
              </p>
              <p>
                Le gaz naturel représente déjà plus de 35 % du mix de production électrique de la région. Des découvertes gazières significatives en Côte d&apos;Ivoire et au Sénégal viennent consolider ce potentiel, offrant une opportunité historique de structurer un marché régional intégré.
              </p>
              <p>
                C&apos;est dans ce contexte que le Gouvernement de la République du Bénin, en collaboration avec la société VerteVille Energy, opérateur du secteur gazier au Nigéria, organise la première édition du <strong>Salon Ouest Africain Francophone sur le Gaz Naturel</strong>, entièrement confié à la société NTAB ENERGY SARL.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-navy-900 text-white rounded-xl p-6">
              <div className="text-4xl font-heading font-black text-green-400 mb-1">+35%</div>
              <div className="text-sm text-gray-300">du mix électrique régional couvert par le gaz naturel dans l&apos;espace UEMOA</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
              <div className="text-4xl font-heading font-black text-navy-900 mb-1">125M+</div>
              <div className="text-sm text-gray-500">d&apos;habitants dans l&apos;espace UEMOA, marché potentiel pour le développement gazier</div>
            </div>
            <div className="bg-green-600 text-white rounded-xl p-6">
              <div className="text-4xl font-heading font-black mb-1">+3%/an</div>
              <div className="text-sm text-green-100">croissance projetée de la demande gazière en Afrique jusqu&apos;en 2050</div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme */}
      <section className="py-16 px-4 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-label">THÈME CENTRAL</p>
          <h2 className="text-2xl md:text-4xl font-heading font-bold leading-tight mb-6">
            &laquo;&nbsp;Construire un marché gazier intégré et accessible dans l&apos;espace UEMOA :
            défis, opportunités et engagements&nbsp;&raquo;
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Les échanges s&apos;articuleront autour de quatre sous-thèmes stratégiques qui définissent les conditions d&apos;émergence d&apos;un marché gazier régional compétitif et durable.
          </p>
        </div>
      </section>

      {/* Sub-themes */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <p className="section-label text-center">LES SOUS-THÈMES</p>
          <h2 className="text-3xl font-heading font-bold text-navy-900 text-center mb-12">4 axes de travail</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {subthemes.map((t) => (
              <div key={t.num} className="bg-white rounded-xl border border-gray-100 p-6 flex gap-5">
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {t.num}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-navy-900 text-base mb-2">{t.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <p className="section-label">OBJECTIFS</p>
            <h2 className="text-3xl font-heading font-bold text-navy-900 mb-8 leading-tight">
              Une plateforme au service de l&apos;intégration énergétique régionale
            </h2>
            <ul className="space-y-3">
              {objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="section-label">RÉSULTATS ATTENDUS</p>
            <h2 className="text-3xl font-heading font-bold text-navy-900 mb-8 leading-tight">
              Des impacts concrets et mesurables
            </h2>
            <div className="space-y-5">
              {expectedResults.map((r) => (
                <div key={r.category}>
                  <h4 className="font-semibold text-navy-900 text-sm mb-2">{r.category}</h4>
                  <ul className="space-y-1.5">
                    {r.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                        <svg className="w-3.5 h-3.5 text-green-500 shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Organizers */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <p className="section-label text-center">ORGANISATEURS</p>
          <h2 className="text-3xl font-heading font-bold text-navy-900 text-center mb-10">À l&apos;initiative de l&apos;évènement</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "NTAB ENERGY SARL", role: "Organisateur principal de l'évènement", desc: "Société de conseil et d'organisation d'évènements dans le secteur énergétique." },
              { name: "VerteVille Energy", role: "Sponsor officiel & initiateur", desc: "Opérateur gazier basé au Nigéria, partenaire stratégique pour le développement du marché gazier régional." },
              { name: "Gouvernement du Bénin", role: "Co-organisateur institutionnel", desc: "La République du Bénin, pays hôte, apporte son soutien institutionnel à cet événement régional stratégique." },
            ].map((org) => (
              <div key={org.name} className="bg-white rounded-xl border border-gray-100 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-navy-900 mx-auto mb-4 flex items-center justify-center">
                  <Globe className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="font-heading font-bold text-navy-900 mb-1">{org.name}</h3>
                <p className="text-green-600 text-xs font-semibold mb-3">{org.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{org.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-800 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-2xl font-heading font-bold mb-4">Participez à cet événement historique</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Rejoignez les décideurs, investisseurs et experts du secteur gazier à Cotonou du 3 au 5 février 2027.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inscription" className="btn-primary">S&apos;inscrire dès maintenant</Link>
            <Link href="/programme" className="btn-outline">Voir le programme</Link>
          </div>
        </div>
      </section>
    </>
  );
}
