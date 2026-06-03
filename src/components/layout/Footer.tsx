import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-white">
      {/* CTA Banner */}
      <div
        className="relative py-16 px-4 text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(13,27,42,0.85), rgba(13,27,42,0.85)), url('https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Participez à la construction d&apos;un avenir gazier intégré et durable.
        </h2>
        <p className="text-forest-400 font-medium mb-8">
          Rejoignez les décideurs, investisseurs et experts du secteur à Cotonou en février 2027.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/inscription" className="btn-primary">
            S&apos;inscrire dès maintenant
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="/devenir-sponsor" className="btn-outline-green">
            Devenir sponsor
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Partners bar */}
      <div className="bg-white py-6 px-4">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
          NOS PARTENAIRES ET SPONSORS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 max-w-5xl mx-auto">
          {["UEMOA", "African Dev. Bank", "IFC", "Afreximbank", "Petronas", "bp", "TotalEnergies", "NNPC"].map(
            (p) => (
              <span key={p} className="text-gray-400 font-bold text-sm grayscale hover:grayscale-0 transition-all">
                {p}
              </span>
            )
          )}
          <a href="#" className="text-forest-600 text-sm font-medium hover:underline">
            Voir tous nos partenaires &rarr;
          </a>
        </div>
      </div>

      {/* Footer links */}
      <div className="bg-forest-900 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo col */}
          <div className="lg:col-span-1">
            <div className="text-white font-heading font-bold text-sm leading-tight mb-4">
              <div className="text-xs uppercase tracking-wide opacity-80">SALON OUEST AFRICAIN</div>
              <div className="text-xs uppercase tracking-wide opacity-80">FRANCOPHONE SUR LE</div>
              <div className="text-base uppercase">GAZ NATUREL</div>
              <div className="text-forest-500 text-xs mt-1">1ère ÉDITION</div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">LIENS RAPIDES</h4>
            {[
              { label: "Accueil", href: "/" },
              { label: "À propos", href: "/a-propos" },
              { label: "Programme", href: "/programme" },
              { label: "S'inscrire", href: "/inscription" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="block text-sm text-gray-400 hover:text-white mb-2">{label}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">L'ÉVÉNEMENT</h4>
            {[
              { label: "Thèmes & sous-thèmes", href: "/a-propos" },
              { label: "Devenir sponsor", href: "#" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="block text-sm text-gray-400 hover:text-white mb-2">{label}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">SUIVEZ-NOUS</h4>
            <div className="flex gap-3">
              {["in", "𝕏", "▶"].map((icon) => (
                <a key={icon} href="#" className="w-8 h-8 border border-gray-600 rounded flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors text-sm">
                  {icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">CONTACTEZ-NOUS</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span>✉</span>
                <span>info@gaz-naturel-uemoa.org</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>+229 21 30 56 78</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Cotonou, Bénin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <span>© 2027 Salon Ouest Africain Francophone sur le Gaz Naturel – Tous droits réservés</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">Mentions légales</Link>
            <Link href="#" className="hover:text-white">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
