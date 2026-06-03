import Link from "next/link";
import { Calendar, MapPin, Flag, ChevronRight } from "lucide-react";

const stats = [
  { value: "200+", label: "Participants" },
  { value: "8", label: "Pays UEMOA" },
  { value: "4", label: "Thématiques stratégiques" },
  { value: "3", label: "Jours d'échanges" },
  { value: null, label: "Rencontres B2B", special: true },
];

export default function Hero() {
  return (
    <section className="bg-sage-50 min-h-[88vh] flex flex-col">
      {/* Main hero */}
      <div className="flex-1 max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center py-16">
        {/* Left — text */}
        <div>
          <p className="section-label">UNE PLATEFORME RÉGIONALE STRATÉGIQUE</p>

          <h1 className="font-heading font-black text-gray-900 leading-tight mb-4">
            <span className="text-5xl md:text-6xl block">Salon Ouest Africain</span>
            <span className="text-5xl md:text-6xl block">Francophone du</span>
            <span className="text-5xl md:text-6xl block text-forest-600">Gaz Naturel</span>
            <span className="text-5xl md:text-6xl block text-gold-500">2027</span>
          </h1>

          {/* Gold underline accent */}
          <div className="w-16 h-1 bg-gold-400 rounded mb-5" />

          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
            Construire un marché gazier intégré et accessible dans l&apos;espace UEMOA.
          </p>

          {/* Event info chips */}
          <div className="flex flex-wrap gap-3 mb-10">
            <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm">
              <Calendar className="w-4 h-4 text-forest-600 shrink-0" />
              3–5 février 2027
            </div>
            <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm">
              <MapPin className="w-4 h-4 text-forest-600 shrink-0" />
              Sofitel Cotonou Marina Hotel & Spa
            </div>
            <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm">
              {/* Benin flag inline */}
              <span className="inline-flex w-5 h-4 rounded-sm overflow-hidden shrink-0">
                <span className="w-1/3 h-full bg-green-600" />
                <span className="w-1/3 h-full bg-yellow-400" />
                <span className="w-1/3 h-full bg-red-500" />
              </span>
              Bénin
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link href="/inscription" className="btn-primary text-base">
              S&apos;inscrire maintenant <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/programme" className="btn-outline text-base">
              Découvrir le programme <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="#" className="btn-gold text-base">
              Devenir sponsor <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right — UEMOA map */}
        <div className="flex items-center justify-center">
          <UEMOAMap />
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-t border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap divide-x divide-gray-100">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-4 flex-1 min-w-40">
                <StatIcon index={i} />
                <div>
                  {s.value && (
                    <div className="text-2xl font-heading font-black text-forest-700 leading-none">{s.value}</div>
                  )}
                  <div className={`text-xs font-medium ${s.special ? "text-forest-600 font-semibold" : "text-gray-500"} mt-0.5`}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatIcon({ index }: { index: number }) {
  const icons = [
    // Participants
    <svg key="p" className="w-8 h-8 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>,
    // Globe
    <svg key="g" className="w-8 h-8 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>,
    // Target
    <svg key="t" className="w-8 h-8 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>,
    // Clock
    <svg key="c" className="w-8 h-8 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    // Handshake
    <svg key="h" className="w-8 h-8 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>,
  ];
  return icons[index] ?? null;
}

function UEMOAMap() {
  // SVG représentation stylisée de l'espace UEMOA avec pipelines
  return (
    <div className="relative w-full max-w-lg">
      <svg viewBox="0 0 500 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-xl">
        {/* Background glow */}
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e8f5ee" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#f0f5f2" stopOpacity="0"/>
          </radialGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="4" dy="8" stdDeviation="12" floodColor="#1e5238" floodOpacity="0.12"/>
          </filter>
        </defs>

        <ellipse cx="250" cy="210" rx="220" ry="180" fill="url(#mapGlow)"/>

        {/* ===== PAYS UEMOA ===== */}
        {/* Sénégal */}
        <path d="M80 100 L130 95 L145 115 L140 135 L120 145 L95 140 L75 125 Z" fill="#d4e8db" stroke="#2d7a4f" strokeWidth="1.5"/>
        <text x="108" y="125" fontSize="9" fill="#1e5238" fontWeight="600" textAnchor="middle">Sénégal</text>

        {/* Guinée-Bissau */}
        <path d="M75 125 L95 120 L100 140 L85 148 L70 138 Z" fill="#c9e2d3" stroke="#2d7a4f" strokeWidth="1.5"/>

        {/* Mali */}
        <path d="M130 60 L220 55 L245 80 L240 130 L200 140 L160 135 L140 115 L130 95 Z" fill="#d4e8db" stroke="#2d7a4f" strokeWidth="1.5"/>
        <text x="190" y="100" fontSize="9" fill="#1e5238" fontWeight="600" textAnchor="middle">Mali</text>

        {/* Burkina Faso */}
        <path d="M200 140 L240 135 L260 150 L255 175 L225 185 L195 178 L185 160 Z" fill="#bfdacb" stroke="#2d7a4f" strokeWidth="1.5"/>
        <text x="222" y="165" fontSize="8" fill="#1e5238" fontWeight="600" textAnchor="middle">Burkina</text>

        {/* Niger */}
        <path d="M245 80 L340 70 L370 100 L365 145 L330 155 L280 150 L260 150 L240 130 Z" fill="#d4e8db" stroke="#2d7a4f" strokeWidth="1.5"/>
        <text x="310" y="115" fontSize="9" fill="#1e5238" fontWeight="600" textAnchor="middle">Niger</text>

        {/* Côte d'Ivoire */}
        <path d="M145 180 L195 175 L225 185 L220 225 L195 245 L160 250 L135 230 L130 205 Z" fill="#bfdacb" stroke="#2d7a4f" strokeWidth="1.5"/>
        <text x="178" y="215" fontSize="8" fill="#1e5238" fontWeight="600" textAnchor="middle">Côte d'Ivoire</text>

        {/* Ghana (hors UEMOA mais voisin) */}
        <path d="M225 185 L255 180 L265 210 L258 245 L230 250 L220 225 Z" fill="#e8f0ea" stroke="#aacab7" strokeWidth="1" strokeDasharray="4 3"/>
        <text x="242" y="218" fontSize="7.5" fill="#6b9e7f" textAnchor="middle">Ghana</text>

        {/* Togo */}
        <path d="M258 180 L278 178 L282 210 L278 245 L258 245 L255 210 Z" fill="#bfdacb" stroke="#2d7a4f" strokeWidth="1.5"/>
        <text x="268" y="215" fontSize="7" fill="#1e5238" fontWeight="600" textAnchor="middle">Togo</text>

        {/* Bénin */}
        <path d="M278 175 L310 170 L318 200 L314 240 L285 245 L278 245 L282 210 Z" fill="#a8d4b8" stroke="#2d7a4f" strokeWidth="2"/>
        <text x="297" y="210" fontSize="8" fill="#0f2d1f" fontWeight="700" textAnchor="middle">Bénin</text>

        {/* Nigeria (hors UEMOA) */}
        <path d="M318 165 L390 160 L410 190 L405 240 L370 258 L330 255 L314 240 L318 200 Z" fill="#e8f0ea" stroke="#aacab7" strokeWidth="1" strokeDasharray="4 3"/>
        <text x="362" y="210" fontSize="8.5" fill="#6b9e7f" textAnchor="middle">Nigeria</text>

        {/* ===== PIPELINES ===== */}
        {/* WAGP : Nigeria → Bénin → Togo → Ghana */}
        <path d="M385 215 L300 220 L268 222 L240 225" stroke="#c49a30" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="0"/>
        {/* Extension Mali → Burkina */}
        <path d="M190 100 L210 160 L222 178" stroke="#c49a30" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4"/>
        {/* Sénégal → CI */}
        <path d="M108 130 L135 165 L165 200" stroke="#c49a30" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4"/>
        {/* Niger → Nigeria */}
        <path d="M330 148 L345 175 L370 190" stroke="#c49a30" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4"/>

        {/* ===== CITY DOTS ===== */}
        {/* Cotonou — étoile (lieu de l'événement) */}
        <circle cx="302" cy="238" r="8" fill="#c49a30" opacity="0.2"/>
        <circle cx="302" cy="238" r="5" fill="#c49a30"/>
        <circle cx="302" cy="238" r="2.5" fill="white"/>

        {/* Abuja */}
        <circle cx="370" cy="215" r="4" fill="#2d7a4f" opacity="0.6"/>
        {/* Dakar */}
        <circle cx="88" cy="118" r="4" fill="#2d7a4f" opacity="0.6"/>
        {/* Abidjan */}
        <circle cx="172" cy="238" r="4" fill="#2d7a4f" opacity="0.6"/>
        {/* Bamako */}
        <circle cx="168" cy="108" r="4" fill="#2d7a4f" opacity="0.6"/>
        {/* Niamey */}
        <circle cx="305" cy="130" r="4" fill="#2d7a4f" opacity="0.6"/>
        {/* Ouagadougou */}
        <circle cx="218" cy="165" r="4" fill="#2d7a4f" opacity="0.6"/>

        {/* Label Cotonou */}
        <rect x="310" y="228" width="56" height="16" rx="3" fill="white" opacity="0.95"/>
        <text x="338" y="240" fontSize="8.5" fill="#0f2d1f" fontWeight="700" textAnchor="middle">Cotonou ★</text>

        {/* Legend */}
        <rect x="20" y="355" width="200" height="42" rx="6" fill="white" opacity="0.9"/>
        <line x1="32" y1="370" x2="58" y2="370" stroke="#c49a30" strokeWidth="2.5"/>
        <text x="65" y="374" fontSize="8" fill="#555">Pipeline existant (WAGP)</text>
        <line x1="32" y1="386" x2="58" y2="386" stroke="#c49a30" strokeWidth="2" strokeDasharray="5 3"/>
        <text x="65" y="390" fontSize="8" fill="#555">Extension projetée</text>

        {/* Title top */}
        <text x="250" y="30" fontSize="11" fill="#1e5238" fontWeight="700" textAnchor="middle">Espace UEMOA — Réseau gazier régional</text>
      </svg>
    </div>
  );
}
