"use client";
import Link from "next/link";
import { useState } from "react";

const days = [
  { date: "3 février 2027", label: "3 février 2027" },
  { date: "4 février 2027", label: "4 février 2027" },
  { date: "5 février 2027", label: "5 février 2027" },
];

const filterTabs = ["Tous", "Panels", "Tables rondes", "B2B", "Protocole", "Networking"];

type SessionType = "Protocole" | "Panel" | "Table ronde" | "Networking" | "B2B";

const sessions: { time: string; type: SessionType; title: string; location: string; desc: string; speakers?: { name: string; role: string; img: string }[] }[] = [
  {
    time: "08:30 – 09:30",
    type: "Protocole",
    title: "Ouverture officielle",
    location: "Salle Plénière",
    desc: "Cérémonie d'ouverture en présence des autorités, des partenaires institutionnels et des leaders du secteur gazier.",
    speakers: [
      { name: "Romuald Wadagni", role: "Ministre d'État, Ministre de l'Économie et des Finances, Bénin", img: "https://randomuser.me/api/portraits/men/10.jpg" },
      { name: "Mamadou Sangafowa", role: "Président de la Commission de l'UEMOA", img: "https://randomuser.me/api/portraits/men/11.jpg" },
      { name: "Wole Ogunsanya", role: "Président, NNPC Gas Marketing Ltd.", img: "https://randomuser.me/api/portraits/men/12.jpg" },
    ],
  },
  {
    time: "09:45 – 11:15",
    type: "Panel",
    title: "Financer les infrastructures gazières régionales",
    location: "Salle Plénière",
    desc: "Mobiliser les capitaux pour développer des infrastructures compétitives et résilientes.",
    speakers: [
      { name: "Erik W. Rasmussen", role: "Vice-Président, Engie, Inc.", img: "https://randomuser.me/api/portraits/men/3.jpg" },
      { name: "Amina Benkhadra", role: "Directrice exécutive, African Energy Chamber", img: "https://randomuser.me/api/portraits/women/2.jpg" },
      { name: "Jean-Marc Savi de Tové", role: "Directeur Afrique, IFC", img: "https://randomuser.me/api/portraits/men/14.jpg" },
    ],
  },
  {
    time: "11:30 – 12:45",
    type: "Table ronde",
    title: "Gaz naturel et sécurité énergétique dans l'espace UEMOA",
    location: "Salle Plénière",
    desc: "Rôle du gaz naturel dans la transition énergétique et la sécurité d'approvisionnement.",
    speakers: [
      { name: "Hassane Barro", role: "Directeur Général, Société Béninoise d'Énergie Électrique (SBEE)", img: "https://randomuser.me/api/portraits/men/15.jpg" },
      { name: "Fatoumata Koné", role: "Directrice, Énergie, Commission de l'UEMOA", img: "https://randomuser.me/api/portraits/women/5.jpg" },
      { name: "Omar Farouk", role: "Expert Énergie, Banque Africaine de Développement", img: "https://randomuser.me/api/portraits/men/16.jpg" },
    ],
  },
  {
    time: "12:45 – 14:00",
    type: "Networking",
    title: "Networking",
    location: "Espace Marina",
    desc: "Espace d'échanges libre entre participants.",
  },
  {
    time: "14:00 – 15:30",
    type: "Panel",
    title: "Cadres réglementaires et intégration régionale",
    location: "Salle Plénière",
    desc: "Harmoniser les règles pour un marché gazier intégré et attractif.",
    speakers: [
      { name: "Serge Ekué", role: "Directeur Juridique, PETRONAS", img: "https://randomuser.me/api/portraits/men/20.jpg" },
      { name: "Adama Ndiaye", role: "Conseiller Juridique, UEMOA", img: "https://randomuser.me/api/portraits/men/21.jpg" },
      { name: "Moctar Yedaly", role: "Directeur Réglementation, ARREC", img: "https://randomuser.me/api/portraits/men/22.jpg" },
    ],
  },
  {
    time: "15:45 – 17:45",
    type: "B2B",
    title: "Rencontres B2B investisseurs et opérateurs",
    location: "Salles B2B",
    desc: "Sessions B2B préprogrammées entre investisseurs, développeurs et fournisseurs.\n• Sessions sur invitation uniquement",
  },
  {
    time: "19:30 – 22:00",
    type: "Protocole",
    title: "Dîner officiel des délégations",
    location: "Salle Marina",
    desc: "Dîner de gala et réseautage institutionnel.",
  },
];

const typeColors: Record<SessionType, string> = {
  Protocole: "bg-purple-100 text-purple-700",
  Panel: "bg-blue-100 text-blue-700",
  "Table ronde": "bg-yellow-100 text-yellow-700",
  Networking: "bg-green-100 text-green-700",
  B2B: "bg-orange-100 text-orange-700",
};

const highlights = [
  "Cérémonie d'ouverture avec les autorités et partenaires clés",
  "Panels de haut niveau sur le financement, la sécurité énergétique et les cadres réglementaires",
  "Rencontres B2B ciblées avec investisseurs et opérateurs",
  "Dîner officiel des délégations et networking",
];

const daySpeakers = [
  { name: "Romuald Wadagni", role: "Ministre d'État, Ministre de l'Économie et des Finances, Bénin", img: "https://randomuser.me/api/portraits/men/10.jpg" },
  { name: "Mamadou Sangafowa", role: "Président de la Commission de l'UEMOA", img: "https://randomuser.me/api/portraits/men/11.jpg" },
  { name: "Wole Ogunsanya", role: "Président, NNPC Gas Marketing Ltd.", img: "https://randomuser.me/api/portraits/men/12.jpg" },
  { name: "Amina Benkhadra", role: "Directrice exécutive, African Energy Chamber", img: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Erik W. Rasmussen", role: "Vice-Président, Engie, Inc.", img: "https://randomuser.me/api/portraits/men/3.jpg" },
];

export default function ProgrammePage() {
  const [activeDay, setActiveDay] = useState(0);
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filtered = sessions.filter(
    (s) => activeFilter === "Tous" || s.type === activeFilter || (activeFilter === "Tables rondes" && s.type === "Table ronde")
  );

  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-72 flex items-end pb-12"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(13,27,42,0.9) 50%, rgba(13,27,42,0.5) 100%), url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-3">
            Programme du Salon
          </h1>
          <p className="text-green-400 font-medium text-lg mb-4">
            Trois jours de conférences, panels, rencontres B2B et networking au cœur de Cotonou.
          </p>
          <div className="flex flex-wrap gap-4 text-white text-sm">
            <span className="flex items-center gap-2 opacity-90">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              3 au 5 février 2027
            </span>
            <span className="flex items-center gap-2 opacity-90">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Sofitel Cotonou Marina Hôtel & Spa, Cotonou, Bénin
            </span>
          </div>
        </div>
      </section>

      {/* Programme grid */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: timeline */}
            <div className="flex-1">
              {/* Day tabs */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                {days.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    className={`px-5 py-3 text-sm font-semibold rounded-t-lg border-b-2 transition-colors flex items-center gap-2 ${
                      activeDay === i
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-white text-gray-600 border-transparent hover:text-navy-900"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {filterTabs.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === f
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-green-600 hover:text-green-600"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Sessions */}
              <div className="space-y-4">
                {filtered.map((session, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 font-bold text-sm font-mono min-w-32">{session.time}</span>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[session.type]}`}>
                            {session.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {session.location}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-navy-900 text-lg mb-2">{session.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line mb-4">{session.desc}</p>
                      {session.speakers && (
                        <div className="flex flex-wrap gap-3">
                          {session.speakers.map((sp) => (
                            <div key={sp.name} className="flex items-center gap-2">
                              <img src={sp.img} alt={sp.name} className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <div className="text-xs font-semibold text-navy-900">{sp.name}</div>
                                <div className="text-xs text-gray-400 max-w-48 leading-tight">{sp.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="lg:w-72 space-y-6 shrink-0">
              {/* Highlights */}
              <div className="bg-navy-900 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="font-heading font-bold text-sm uppercase tracking-wide">Temps forts du jour</span>
                </div>
                <ul className="space-y-3">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Day speakers */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading font-bold text-navy-900 text-sm">Intervenants du jour</span>
                  <Link href="/intervenants" className="text-green-600 text-xs font-medium hover:underline">Voir tous</Link>
                </div>
                <div className="space-y-3">
                  {daySpeakers.map((sp) => (
                    <div key={sp.name} className="flex items-center gap-3">
                      <img src={sp.img} alt={sp.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-navy-900">{sp.name}</div>
                        <div className="text-xs text-gray-400 leading-snug">{sp.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/intervenants" className="mt-4 block text-center text-sm font-semibold text-navy-900 border border-gray-200 rounded-lg py-2 hover:border-green-600 hover:text-green-600 transition-colors">
                  Voir tous les intervenants
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-green-400 mb-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-sm">Réservez votre place dès maintenant</span>
            </div>
            <p className="text-gray-300 text-sm">
              Participez aux échanges stratégiques qui façonneront l&apos;avenir du gaz naturel en Afrique de l&apos;Ouest.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/inscription" className="btn-primary">S&apos;inscrire dès maintenant</Link>
            <Link href="/devenir-sponsor" className="btn-outline">Devenir sponsor</Link>
          </div>
        </div>
      </section>
    </>
  );
}
