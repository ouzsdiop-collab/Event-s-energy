"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import { useLang } from "@/lib/i18n";
import TransitionLink from "@/components/TransitionLink";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const navLinks = [
    { href: "/a-propos", label: t.nav.about },
    { href: "/programme", label: t.nav.programme },
    { href: "/intervenants", label: t.nav.speakers },
    { href: "/inscription", label: t.nav.register },
  ];

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-3 py-2 rounded transition-colors ${
                pathname === link.href
                  ? "text-forest-700 font-semibold"
                  : "text-gray-600 hover:text-forest-700"
              }`}
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-4">
          <TransitionLink href="/espace-admin"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              pathname === "/espace-admin"
                ? "border-forest-700 text-forest-700 bg-forest-50"
                : "border-gray-200 text-gray-500 hover:border-forest-700 hover:text-forest-700"
            }`}>
            <LayoutDashboard className="w-3.5 h-3.5" /> Admin
          </TransitionLink>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <button
              onClick={() => setLang("fr")}
              className={`transition-colors ${lang === "fr" ? "text-forest-700 font-bold" : "hover:text-forest-700"}`}
            >FR</button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setLang("en")}
              className={`transition-colors ${lang === "en" ? "text-forest-700 font-bold" : "hover:text-forest-700"}`}
            >EN</button>
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
      <div className={`lg:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="px-4 py-4 space-y-0.5">
          {navLinks.map((link) => (
            <TransitionLink key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-600 hover:text-forest-700">
              {link.label}
            </TransitionLink>
          ))}
          <TransitionLink href="/espace-admin" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 py-2.5 text-sm font-medium text-gray-600 hover:text-forest-700 border-t border-gray-100 pt-2 mt-1">
            <LayoutDashboard className="w-4 h-4" /> Espace Admin
          </TransitionLink>
          <div className="flex items-center gap-3 pt-2 pb-1">
            <button onClick={() => setLang("fr")}
              className={`text-sm font-semibold ${lang === "fr" ? "text-forest-700" : "text-gray-400"}`}>FR</button>
            <span className="text-gray-300">|</span>
            <button onClick={() => setLang("en")}
              className={`text-sm font-semibold ${lang === "en" ? "text-forest-700" : "text-gray-400"}`}>EN</button>
          </div>
          <div className="pt-2">
            <TransitionLink href="/inscription" className="block w-full bg-forest-700 text-white text-sm font-semibold px-4 py-2.5 rounded-md text-center">
              {t.nav.registerCta}
            </TransitionLink>
          </div>
        </div>
      </div>
    </header>
  );
}
