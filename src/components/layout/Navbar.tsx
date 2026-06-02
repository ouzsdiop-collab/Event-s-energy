"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/programme", label: "Programme" },
  { href: "/inscription", label: "S'inscrire" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-navy-900 sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" stroke="#22c55e" strokeWidth="2"/>
              <path d="M20 8 C14 14 12 18 16 22 C18 24 18 26 16 30" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M25 10 C21 16 19 20 23 24 C25 26 24 28 22 32" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
              <path d="M12 28 Q20 22 28 28" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-white leading-tight hidden sm:block">
            <div className="font-semibold uppercase tracking-wide" style={{fontSize:"9px"}}>SALON OUEST AFRICAIN FRANCOPHONE SUR LE</div>
            <div className="font-bold uppercase tracking-wide" style={{fontSize:"11px"}}>GAZ NATUREL</div>
            <div className="text-green-500 font-semibold" style={{fontSize:"9px"}}>1ère ÉDITION</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-4 py-2 rounded transition-colors ${
                pathname === link.href
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-white text-sm">
            <button className="font-bold border-b border-white pb-0.5">FR</button>
            <span className="text-gray-500">|</span>
            <button className="text-gray-400 hover:text-white transition-colors">EN</button>
          </div>
          <Link href="/inscription" className="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded transition-colors">
            S&apos;inscrire
          </Link>
          <Link href="#" className="border border-white/40 text-white hover:border-white text-sm font-semibold px-4 py-2 rounded transition-colors">
            Devenir sponsor
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy-800 border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className={`block py-2.5 text-sm font-medium ${pathname === link.href ? "text-green-400" : "text-gray-300"}`}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex gap-2">
            <Link href="/inscription" className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded flex-1 text-center">S&apos;inscrire</Link>
            <Link href="#" className="border border-white/40 text-white text-sm font-semibold px-4 py-2 rounded flex-1 text-center">Sponsor</Link>
          </div>
        </div>
      )}
    </header>
  );
}
