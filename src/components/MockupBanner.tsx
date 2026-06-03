"use client";

import { useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { usePathname } from "next/navigation";

export default function MockupBanner() {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  // Don't show on the presentation page itself
  if (dismissed || pathname === "/presentation") return null;

  return (
    <div className="relative z-50 flex items-center justify-center gap-3 px-4 py-2 text-center" style={{ backgroundColor: "#0f2d1f", borderBottom: "1px solid rgba(196,154,48,0.25)" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse shrink-0" />
      <p className="text-xs text-white/60 font-medium">
        Maquette interactive ·{" "}
        <TransitionLink href="/presentation" className="text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-2 transition-colors">
          Voir la présentation de la maquette
        </TransitionLink>
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Fermer"
        className="ml-2 text-white/30 hover:text-white/70 transition-colors shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
