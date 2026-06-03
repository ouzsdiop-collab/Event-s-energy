"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { ChevronRight } from "lucide-react";

const navLinks = [
  { href: "/a-propos", label: "À propos" },
  { href: "/programme", label: "Programme" },
  { href: "/intervenants", label: "Intervenants" },
  { href: "/inscription", label: "Inscription" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-3 py-2 rounded transition-colors ${
                pathname === link.href
                  ? "text-forest-700 font-semibold"
                  : "text-gray-600 hover:text-forest-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <button className="text-forest-700 font-bold">FR</button>
            <span className="text-gray-300">|</span>
            <button className="hover:text-forest-700 transition-colors">EN</button>
          </div>
          <Link
            href="/inscription"
            className="bg-forest-700 hover:bg-forest-800 text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors inline-flex items-center gap-1.5"
          >
            Inscription <ChevronRight className="w-3.5 h-3.5" />
          </Link>
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
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-600 hover:text-forest-700">
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <Link href="/inscription" className="block bg-forest-700 text-white text-sm font-semibold px-4 py-2.5 rounded-md text-center">
              Inscription
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
