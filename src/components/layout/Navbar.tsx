"use client";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import Logo from "@/components/Logo";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import { useLang } from "@/lib/i18n";
import TransitionLink from "@/components/TransitionLink";

type NavItem = {
  label: string;
  href?: string;
  children?: { href: string; label: string; desc?: string }[];
};

function DropdownMenu({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = item.href
    ? pathname === item.href
    : item.children?.some(c => pathname === c.href);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!item.children) {
    return (
      <TransitionLink
        href={item.href!}
        onClick={onNavigate}
        className={`text-sm font-medium px-3 py-2 rounded transition-colors ${
          isActive ? "text-forest-700 font-semibold" : "text-gray-600 hover:text-forest-700"
        }`}
      >
        {item.label}
      </TransitionLink>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setOpen(true)}
        className={`flex items-center gap-1 text-sm font-medium px-3 py-2 rounded transition-colors ${
          isActive ? "text-forest-700 font-semibold" : "text-gray-600 hover:text-forest-700"
        }`}
      >
        {item.label}
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-gray-100 shadow-xl py-2 z-50"
          style={{ minWidth: "220px" }}
          onMouseLeave={() => setOpen(false)}
        >
          {item.children.map(child => (
            <TransitionLink
              key={child.href}
              href={child.href}
              onClick={() => { setOpen(false); onNavigate(); }}
              className={`flex flex-col px-4 py-2.5 transition-colors ${
                pathname === child.href ? "bg-forest-50 text-forest-700" : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span className="text-sm font-medium">{child.label}</span>
              {child.desc && <span className="text-xs text-gray-400 mt-0.5">{child.desc}</span>}
            </TransitionLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { lang, setLang, t } = useLang();

  const navItems: NavItem[] = [
    {
      label: lang === "en" ? "The Event" : "L'Événement",
      children: [
        { href: "/a-propos",      label: lang === "en" ? "About" : "À propos",        desc: lang === "en" ? "Context and themes" : "Contexte et thèmes" },
        { href: "/intervenants",  label: lang === "en" ? "Speakers" : "Intervenants", desc: lang === "en" ? "Confirmed experts" : "Experts confirmés" },
        { href: "/partenaires",   label: lang === "en" ? "Partners" : "Partenaires",  desc: lang === "en" ? "Sponsors and partners" : "Sponsors et partenaires" },
      ],
    },
    {
      label: lang === "en" ? "Programme" : "Programme",
      href: "/programme",
    },
    {
      label: lang === "en" ? "Participate" : "Participer",
      children: [
        { href: "/inscription",   label: lang === "en" ? "Register" : "S'inscrire",           desc: lang === "en" ? "Book your pass" : "Réservez votre pass" },
        { href: "/partenaires",   label: lang === "en" ? "Become a partner" : "Devenir partenaire", desc: lang === "en" ? "Sponsorship offers" : "Offres de sponsoring" },
        { href: "/presse",        label: lang === "en" ? "Press accreditation" : "Accréditation presse", desc: lang === "en" ? "Media & journalists" : "Médias & journalistes" },
      ],
    },
    {
      label: lang === "en" ? "Practical Info" : "Infos pratiques",
      children: [
        { href: "/informations-pratiques", label: lang === "en" ? "Getting there" : "Venir à Cotonou",  desc: lang === "en" ? "Flights, visa, hotel" : "Vols, visa, hôtel" },
        { href: "/informations-pratiques#hebergement", label: lang === "en" ? "Accommodation" : "Hébergement", desc: lang === "en" ? "Hotels & rates" : "Hôtels & tarifs" },
        { href: "/contact",       label: "Contact",                                                       desc: lang === "en" ? "Invitation letter" : "Lettre d'invitation" },
      ],
    },
    {
      label: lang === "en" ? "News" : "Actualités",
      href: "/actualites",
    },
  ];

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map(item => (
            <DropdownMenu key={item.label} item={item} pathname={pathname} onNavigate={closeMenu} />
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3">
          <TransitionLink href="/presentation"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              pathname === "/presentation"
                ? "border-gold-500 text-gold-600 bg-gold-50"
                : "border-gold-300/60 text-gold-600/80 hover:border-gold-500 hover:text-gold-600"
            }`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Présentation
          </TransitionLink>
          <TransitionLink href="/espace-admin"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              pathname === "/espace-admin"
                ? "border-forest-700 text-forest-700 bg-forest-50"
                : "border-gray-200 text-gray-500 hover:border-forest-700 hover:text-forest-700"
            }`}>
            <LayoutDashboard className="w-3.5 h-3.5" /> Admin
          </TransitionLink>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <button onClick={() => setLang("fr")} className={`transition-colors ${lang === "fr" ? "text-forest-700 font-bold" : "hover:text-forest-700"}`}>FR</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => setLang("en")} className={`transition-colors ${lang === "en" ? "text-forest-700 font-bold" : "hover:text-forest-700"}`}>EN</button>
          </div>
          <TransitionLink
            href="/inscription"
            className="bg-forest-700 hover:bg-forest-800 text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors inline-flex items-center gap-1.5"
          >
            {t.nav.registerCta} <ChevronRight className="w-3.5 h-3.5" />
          </TransitionLink>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-gray-600 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
        <div className="px-4 py-3 space-y-0.5">
          {navItems.map(item => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    className="w-full flex items-center justify-between py-2.5 text-sm font-semibold text-gray-700"
                  >
                    {item.label}
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileExpanded === item.label ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${mobileExpanded === item.label ? "max-h-60" : "max-h-0"}`}>
                    <div className="pl-3 border-l-2 border-forest-100 ml-1 mb-2 space-y-0.5">
                      {item.children.map(child => (
                        <TransitionLink key={child.href} href={child.href} onClick={() => setMenuOpen(false)}
                          className={`block py-2 text-sm ${pathname === child.href ? "text-forest-700 font-semibold" : "text-gray-500 hover:text-forest-700"}`}>
                          {child.label}
                        </TransitionLink>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <TransitionLink href={item.href!} onClick={() => setMenuOpen(false)}
                  className={`block py-2.5 text-sm font-semibold ${pathname === item.href ? "text-forest-700" : "text-gray-700 hover:text-forest-700"}`}>
                  {item.label}
                </TransitionLink>
              )}
            </div>
          ))}

          <div className="border-t border-gray-100 pt-3 mt-2 space-y-0.5">
            <TransitionLink href="/presentation" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 text-sm font-medium text-gold-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Présentation maquette
            </TransitionLink>
            <TransitionLink href="/espace-admin" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 text-sm font-medium text-gray-600 hover:text-forest-700">
              <LayoutDashboard className="w-4 h-4" /> Espace Admin
            </TransitionLink>
          </div>

          <div className="flex items-center gap-3 pt-2 pb-1 border-t border-gray-100 mt-1">
            <button onClick={() => setLang("fr")} className={`text-sm font-semibold ${lang === "fr" ? "text-forest-700" : "text-gray-400"}`}>FR</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => setLang("en")} className={`text-sm font-semibold ${lang === "en" ? "text-forest-700" : "text-gray-400"}`}>EN</button>
          </div>
          <div className="pt-2 pb-3">
            <TransitionLink href="/inscription" className="block w-full bg-forest-700 text-white text-sm font-semibold px-4 py-2.5 rounded-md text-center">
              {t.nav.registerCta}
            </TransitionLink>
          </div>
        </div>
      </div>
    </header>
  );
}
