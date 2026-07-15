"use client";

import { createContext, useContext, useRef, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

// ─── Labels par route ────────────────────────────────────────────────────────
const ROUTE_LABELS: Record<string, { fr: string; en: string }> = {
  "/":             { fr: "Accueil",       en: "Home" },
  "/a-propos":     { fr: "À propos",      en: "About" },
  "/programme":    { fr: "Programme",     en: "Programme" },
  "/intervenants": { fr: "Intervenants",  en: "Speakers" },
  "/inscription":  { fr: "Inscription",   en: "Register" },
  "/espace-admin": { fr: "Espace Admin",  en: "Admin" },
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface TransitionCtx {
  navigate: (href: string, label?: string) => void;
}
const Ctx = createContext<TransitionCtx>({ navigate: () => {} });
export function useTransition() { return useContext(Ctx); }

// ─── Provider + Overlay ───────────────────────────────────────────────────────
type Phase = "idle" | "in" | "hold" | "out";

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router   = useRouter();
  const [phase, setPhase]   = useState<Phase>("idle");
  const [label, setLabel]   = useState("");
  const [subLabel, setSubLabel] = useState("SOAFGN · 2027");
  const busy = useRef(false);

  const navigate = useCallback((href: string, customLabel?: string) => {
    if (busy.current) return;
    busy.current = true;

    const route  = ROUTE_LABELS[href];
    const text   = customLabel ?? route?.fr ?? "";
    setLabel(text);
    setSubLabel("SOAFGN · 2027");
    setPhase("in");

    // After panel slides in → navigate + brief hold → slide out
    setTimeout(() => {
      router.push(href);
      setPhase("hold");
    }, 420);

    setTimeout(() => {
      setPhase("out");
    }, 820);

    setTimeout(() => {
      setPhase("idle");
      busy.current = false;
    }, 1220);
  }, [router]);

  return (
    <Ctx.Provider value={{ navigate }}>
      {children}
      <Overlay phase={phase} label={label} subLabel={subLabel} />
    </Ctx.Provider>
  );
}

// ─── Overlay panel ────────────────────────────────────────────────────────────
function Overlay({ phase, label, subLabel }: { phase: Phase; label: string; subLabel: string }) {
  if (phase === "idle") return null;

  const panelY =
    phase === "in"   ? "0%"    :
    phase === "hold" ? "0%"    :
    /* out */          "-100%";

  const textOpacity =
    phase === "in"   ? 0 :
    phase === "hold" ? 1 :
    /* out */          0;

  const panelTransition =
    phase === "in"  ? "transform 0.42s cubic-bezier(0.76, 0, 0.24, 1)" :
    phase === "out" ? "transform 0.38s cubic-bezier(0.76, 0, 0.24, 1)" :
    "none";

  const textTransition =
    phase === "hold" ? "opacity 0.18s ease" :
    phase === "out"  ? "opacity 0.12s ease" :
    "none";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        transform: `translateY(${panelY})`,
        transition: panelTransition,
        backgroundColor: "#0f2d1f",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {/* Gold bar at top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 3,
        background: "linear-gradient(to right, transparent, #c49a30 30%, #d4aa3a 50%, #c49a30 70%, transparent)",
      }} />

      {/* Text */}
      <div style={{
        opacity: textOpacity,
        transition: textTransition,
        textAlign: "center",
        userSelect: "none",
      }}>
        {label && (
          <p
            style={{
              fontFamily: "var(--font-heading, serif)",
              fontWeight: 900,
              fontSize: "clamp(2.8rem, 8vw, 6rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "white",
              marginBottom: "0.4rem",
            }}
          >
            {label.toUpperCase()}
          </p>
        )}
        <p style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#c49a30",
        }}>
          {subLabel}
        </p>
      </div>

      {/* Gold bar at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 2,
        background: "linear-gradient(to right, transparent, rgba(196,154,48,0.40), transparent)",
      }} />
    </div>
  );
}
