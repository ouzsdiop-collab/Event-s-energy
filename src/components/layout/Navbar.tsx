"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { ChevronRight } from "lucide-react";

const navLinks = [
  { href: "/a-propos",      label: "À propos" },
  { href: "/programme",     label: "Programme" },
  { href: "/intervenants",  label: "Intervenants" },
  { href: "/b2b",           label: "B2B" },
  { href: "/sponsors",      label: "Sponsors" },
  { href: "/lieu",          label: "Lieu" },
];

export default function Navbar() {
  const pathname  = usePathname();
  const isHome    = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On home: transparent until scrolled; on other pages: always solid white
  const solidBg  = !isHome || scrolled;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: solidBg ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter:  solidBg ? "blur(12px)"              : "none",
        borderBottom:    solidBg ? "1px solid rgba(0,0,0,0.07)" : "1px solid rgba(255,255,255,0.10)",
        boxShadow:       solidBg ? "0 1px 24px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-10 flex items-center justify-between h-16">
        <Logo dark={solidBg} />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium px-3.5 py-2 rounded-md transition-colors duration-200"
              style={{
                color: pathname === link.href
                  ? (solidBg ? "#1e5238" : "#d4aa3a")
                  : (solidBg ? "#4b5563" : "rgba(255,255,255,0.70)"),
                fontWeight: pathname === link.href ? 600 : 500,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium"
            style={{ color: solidBg ? "#6b7280" : "rgba(255,255,255,0.50)" }}>
            <button
              className="font-bold transition-colors"
              style={{ color: solidBg ? "#1e5238" : "#d4aa3a" }}
            >
              FR
            </button>
            <span style={{ color: solidBg ? "#d1d5db" : "rgba(255,255,255,0.20)" }}>|</span>
            <button className="transition-colors hover:opacity-80">EN</button>
          </div>
          <Link
            href="/inscription"
            className="text-sm font-semibold px-5 py-2.5 rounded-md transition-all duration-200 inline-flex items-center gap-1.5"
            style={solidBg
              ? { backgroundColor: "#1e5238", color: "#fff" }
              : { backgroundColor: "#c49a30", color: "#0a1f14", boxShadow: "0 0 16px rgba(196,154,48,0.30)" }
            }
          >
            Inscription <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 transition-colors"
          style={{ color: solidBg ? "#374151" : "rgba(255,255,255,0.80)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden border-t px-4 py-4 space-y-1"
          style={{
            backgroundColor: solidBg ? "rgba(255,255,255,0.98)" : "rgba(10,31,20,0.96)",
            borderColor: solidBg ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.10)",
            backdropFilter: "blur(16px)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium transition-colors"
              style={{ color: solidBg ? "#374151" : "rgba(255,255,255,0.75)" }}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <Link
              href="/inscription"
              className="block text-sm font-bold px-4 py-3 rounded-md text-center"
              style={{ backgroundColor: "#c49a30", color: "#0a1f14" }}
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
