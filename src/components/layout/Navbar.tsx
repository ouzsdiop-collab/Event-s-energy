"use client";

import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import Logo from "@/components/Logo";
import { ChevronRight, LayoutDashboard, Home, Compass, CalendarDays, Users, Newspaper, Info } from "lucide-react";
import { useLang } from "@/lib/i18n";
import TransitionLink from "@/components/TransitionLink";
import { TubelightNav, type TubelightItem } from "@/components/ui/tubelight-navbar";

function guessActive(pathname: string, items: TubelightItem[]): string {
  for (const item of items) {
    if (item.href && (pathname === item.href || pathname.startsWith(item.href + "/"))) return item.name;
    if (item.children?.some(c => pathname === c.href || pathname.startsWith(c.href + "/"))) return item.name;
  }
  return items[0]?.name ?? "";
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { lang, setLang, t } = useLang();

  const navItems: TubelightItem[] = [
    {
      name: lang === "en" ? "Event" : "Événement",
      icon: Compass,
      children: [
        { href: "/a-propos",      label: lang === "en" ? "About"       : "À propos",        desc: lang === "en" ? "Context and themes"   : "Contexte et thèmes" },
        { href: "/intervenants",  label: lang === "en" ? "Speakers"    : "Intervenants",    desc: lang === "en" ? "Confirmed experts"     : "Experts confirmés" },
        { href: "/partenaires",   label: lang === "en" ? "Partners"    : "Partenaires",     desc: lang === "en" ? "Sponsors & partners"  : "Sponsors et partenaires" },
        { href: "/galerie",       label: lang === "en" ? "Gallery"     : "Galerie",          desc: lang === "en" ? "Photos & venue"       : "Photos & lieu" },
      ],
    },
    {
      name: lang === "en" ? "Programme" : "Programme",
      icon: CalendarDays,
      href: "/programme",
    },
    {
      name: lang === "en" ? "Participate" : "Participer",
      icon: Users,
      children: [
        { href: "/inscription",   label: lang === "en" ? "Register"         : "S'inscrire",            desc: lang === "en" ? "Book your pass"      : "Réservez votre pass" },
        { href: "/partenaires",   label: lang === "en" ? "Become a partner" : "Devenir partenaire",    desc: lang === "en" ? "Sponsorship offers"  : "Offres de sponsoring" },
        { href: "/presse",        label: lang === "en" ? "Press"            : "Accréditation presse",  desc: lang === "en" ? "Media & journalists" : "Médias & journalistes" },
      ],
    },
    {
      name: lang === "en" ? "Info" : "Infos",
      icon: Info,
      children: [
        { href: "/informations-pratiques",              label: lang === "en" ? "Getting there"   : "Venir à Cotonou",  desc: lang === "en" ? "Flights, visa, hotel"  : "Vols, visa, hôtel" },
        { href: "/informations-pratiques#hebergement",  label: lang === "en" ? "Accommodation"   : "Hébergement",      desc: lang === "en" ? "Hotels & rates"        : "Hôtels & tarifs" },
        { href: "/contact",                             label: "Contact",                                               desc: lang === "en" ? "Get in touch"          : "Nous contacter" },
      ],
    },
    {
      name: lang === "en" ? "News" : "Actualités",
      icon: Newspaper,
      href: "/actualites",
    },
  ];

  const [active, setActive] = useState(() => guessActive(pathname, navItems));
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: "rgba(255,255,255,0.98)", borderBottom: "1px solid rgba(36,100,68,0.09)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[60px] gap-4">

        {/* Left — Logo */}
        <Logo />

        {/* Center — Tubelight nav (desktop) */}
        <div className="hidden lg:flex flex-1 justify-center">
          <TubelightNav
            items={navItems}
            active={active}
            onActivate={setActive}
          />
        </div>

        {/* Right — actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Lang switcher */}
          <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgba(15,45,31,0.45)" }}>
            <button onClick={() => setLang("fr")} className="transition-colors px-1"
              style={{ color: lang === "fr" ? "#246444" : undefined, fontWeight: lang === "fr" ? 800 : undefined }}>FR</button>
            <span style={{ color: "rgba(15,45,31,0.18)" }}>|</span>
            <button onClick={() => setLang("en")} className="transition-colors px-1"
              style={{ color: lang === "en" ? "#246444" : undefined, fontWeight: lang === "en" ? 800 : undefined }}>EN</button>
          </div>
          {/* Admin */}
          <TransitionLink href="/espace-admin"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors"
            style={{
              borderColor: pathname === "/espace-admin" ? "#246444" : "rgba(36,100,68,0.18)",
              color: pathname === "/espace-admin" ? "#246444" : "rgba(15,45,31,0.45)",
              backgroundColor: pathname === "/espace-admin" ? "rgba(36,100,68,0.06)" : "transparent",
            }}>
            <LayoutDashboard className="w-3 h-3" /> Admin
          </TransitionLink>
          {/* CTA */}
          <TransitionLink href="/inscription"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold px-4 py-2 rounded-full transition-all"
            style={{ backgroundColor: "#0f2d1f", color: "#c49a30", boxShadow: "0 2px 12px rgba(10,28,18,0.18)" }}>
            {t.nav.registerCta} <ChevronRight className="w-3.5 h-3.5" />
          </TransitionLink>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 rounded-lg" style={{ color: "rgba(15,45,31,0.60)" }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
        style={{ borderTop: "1px solid rgba(36,100,68,0.08)", backgroundColor: "rgba(10,28,18,0.97)" }}>
        <div className="px-4 py-3 space-y-0.5">
          {navItems.map(item => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                    className="w-full flex items-center justify-between py-3 text-sm font-bold"
                    style={{ color: mobileExpanded === item.name ? "#c49a30" : "rgba(255,255,255,0.75)" }}
                  >
                    {item.name}
                    <svg className={`w-4 h-4 opacity-50 transition-transform duration-200 ${mobileExpanded === item.name ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-200 ${mobileExpanded === item.name ? "max-h-80" : "max-h-0"}`}>
                    <div className="pl-3 mb-2 space-y-0 border-l" style={{ borderColor: "rgba(196,154,48,0.25)" }}>
                      {item.children.map(child => (
                        <TransitionLink key={child.href} href={child.href} onClick={() => setMenuOpen(false)}
                          className="block py-2.5 text-sm transition-colors"
                          style={{ color: pathname === child.href ? "#c49a30" : "rgba(255,255,255,0.50)" }}>
                          {child.label}
                        </TransitionLink>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <TransitionLink href={item.href!} onClick={() => setMenuOpen(false)}
                  className="block py-3 text-sm font-bold transition-colors"
                  style={{ color: pathname === item.href ? "#c49a30" : "rgba(255,255,255,0.75)" }}>
                  {item.name}
                </TransitionLink>
              )}
            </div>
          ))}

          <div className="pt-3 mt-1 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <TransitionLink href="/espace-admin" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.40)" }}>
              <LayoutDashboard className="w-4 h-4" /> Espace Admin
            </TransitionLink>
            <div className="flex items-center gap-3">
              <button onClick={() => setLang("fr")} className="text-sm font-bold transition-colors"
                style={{ color: lang === "fr" ? "#c49a30" : "rgba(255,255,255,0.30)" }}>FR</button>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              <button onClick={() => setLang("en")} className="text-sm font-bold transition-colors"
                style={{ color: lang === "en" ? "#c49a30" : "rgba(255,255,255,0.30)" }}>EN</button>
            </div>
            <TransitionLink href="/inscription" onClick={() => setMenuOpen(false)}
              className="block w-full text-sm font-bold px-4 py-3 rounded-xl text-center"
              style={{ backgroundColor: "#c49a30", color: "#0f2d1f" }}>
              {t.nav.registerCta}
            </TransitionLink>
          </div>
        </div>
      </div>
    </header>
  );
}
