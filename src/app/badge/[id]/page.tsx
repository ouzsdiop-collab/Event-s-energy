"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase, type Registration } from "@/lib/supabase";
import QRCode from "qrcode";

const PASS_CONFIG: Record<string, { label: string; color: string; bg: string; pattern: string }> = {
  "Standard":       { label: "PASS STANDARD",       color: "#ffffff", bg: "#1e5238", pattern: "forest" },
  "VIP":            { label: "PASS VIP",             color: "#0f2d1f", bg: "#c49a30", pattern: "gold"   },
  "Presse":         { label: "ACCRÉDITATION PRESSE", color: "#ffffff", bg: "#2d4a6e", pattern: "press"  },
  "Institutionnel": { label: "PASS INSTITUTIONNEL",  color: "#c49a30", bg: "#0f2d1f", pattern: "dark"   },
  "Exposant":       { label: "PASS EXPOSANT",        color: "#ffffff", bg: "#246444", pattern: "forest" },
};

function getPassConfig(passType: string) {
  return PASS_CONFIG[passType] || { label: passType.toUpperCase(), color: "#ffffff", bg: "#246444", pattern: "forest" };
}

function initials(prenom: string, nom: string) {
  return `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase();
}

export default function BadgePage() {
  const { id: ref } = useParams<{ id: string }>();
  const [reg, setReg] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const badgeRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    supabase.from("registrations").select("*").eq("reference", ref).maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true);
        else setReg(data as Registration);
        setLoading(false);
      });
  }, [ref]);

  useEffect(() => {
    if (!reg) return;
    const url = `${window.location.origin}/badge/${reg.reference}`;
    QRCode.toDataURL(url, {
      width: 200,
      margin: 1,
      color: { dark: "#0f2d1f", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl);
  }, [reg]);

  const handleDownload = useCallback(async () => {
    if (!badgeRef.current) return;
    setDownloading(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(badgeRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `badge-${reg?.reference ?? "soafgang"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  }, [reg]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f4f7f5" }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(36,100,68,0.2)", borderTopColor: "#246444" }} />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f4f7f5" }}>
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(220,38,38,0.08)" }}>
          <svg className="w-8 h-8" fill="none" stroke="#dc2626" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <h1 className="font-heading font-black text-xl mb-2" style={{ color: "#0f2d1f" }}>Badge introuvable</h1>
        <p className="text-sm" style={{ color: "rgba(15,45,31,0.50)" }}>
          La référence <span className="font-mono font-bold">{ref}</span> n'existe pas ou n'est pas encore confirmée.
        </p>
        <p className="text-sm mt-2" style={{ color: "rgba(15,45,31,0.35)" }}>Contactez l'organisation : contact@soafgang2027.org</p>
      </div>
    </div>
  );

  if (!reg) return null;

  const pass = getPassConfig(reg.pass_type);

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #badge-printable, #badge-printable * { visibility: visible; }
          #badge-printable { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: "#f0f4f2" }}>
        <div className="max-w-sm mx-auto">

          {/* Header page */}
          <div className="text-center mb-8 no-print">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color: "#c49a30" }}>SOAFGANG 2027</p>
            <h1 className="font-heading font-black text-2xl" style={{ color: "#0f2d1f" }}>Votre badge officiel</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(15,45,31,0.45)" }}>Présentez ce badge à l'accueil le jour de l'événement</p>
          </div>

          {/* Badge */}
          <div id="badge-printable" ref={badgeRef}
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "white", border: "1px solid rgba(36,100,68,0.10)" }}>

            {/* Top dark header */}
            <div className="relative px-7 pt-8 pb-6 text-center overflow-hidden"
              style={{ background: "linear-gradient(160deg, #071810 0%, #0f2d1f 60%, #163d2a 100%)" }}>
              {/* Motif diagonal doré */}
              <div className="absolute inset-0 opacity-[0.06]"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 14px)" }} />
              {/* Glow central */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: "#c49a30", opacity: 0.07 }} />

              <div className="relative z-10">
                {/* Logo texte */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-px h-4" style={{ backgroundColor: "rgba(196,154,48,0.4)" }} />
                  <div className="text-center">
                    <p className="font-heading font-black text-[13px] tracking-widest" style={{ color: "#c49a30" }}>SOAFGANG</p>
                    <p className="text-[8px] font-semibold tracking-[0.2em]" style={{ color: "rgba(196,154,48,0.55)" }}>2027 · COTONOU</p>
                  </div>
                  <div className="w-px h-4" style={{ backgroundColor: "rgba(196,154,48,0.4)" }} />
                </div>

                {/* Avatar initiales */}
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-heading font-black text-3xl mx-auto mb-4"
                  style={{ background: `linear-gradient(135deg, ${pass.bg}, #0f2d1f)`, color: pass.bg === "#0f2d1f" ? "#c49a30" : pass.color, border: "2px solid rgba(196,154,48,0.3)" }}>
                  {initials(reg.prenom, reg.nom)}
                </div>

                {/* Nom */}
                <h2 className="font-heading font-black text-xl leading-tight" style={{ color: "white" }}>
                  {reg.prenom} {reg.nom}
                </h2>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{reg.fonction}</p>
              </div>
            </div>

            {/* Pass type banner */}
            <div className="py-2.5 text-center text-[11px] font-black tracking-[0.25em]"
              style={{ backgroundColor: pass.bg, color: pass.color }}>
              {pass.label}
            </div>

            {/* Infos */}
            <div className="px-7 py-5">
              <div className="grid grid-cols-2 gap-3 mb-5">
                <InfoBlock label="Organisation" value={reg.organisation} />
                <InfoBlock label="Pays" value={reg.pays} />
                <InfoBlock label="Catégorie" value={reg.categorie} />
                <InfoBlock label="Référence" value={reg.reference} mono />
              </div>

              {/* Ligne séparatrice */}
              <div className="h-px mb-5" style={{ background: "linear-gradient(to right, rgba(36,100,68,0.15), rgba(196,154,48,0.10), transparent)" }} />

              {/* QR Code */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: "white", border: "1px solid rgba(36,100,68,0.10)", boxShadow: "0 2px 12px rgba(10,28,18,0.06)" }}>
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR Code badge" width={160} height={160} />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center" style={{ backgroundColor: "#f4f7f5" }}>
                      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(36,100,68,0.2)", borderTopColor: "#246444" }} />
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-mono text-center" style={{ color: "rgba(15,45,31,0.30)" }}>
                  Scanner à l'accueil · {reg.reference}
                </p>
              </div>
            </div>

            {/* Footer badge */}
            <div className="px-7 py-4 text-center" style={{ borderTop: "1px solid rgba(36,100,68,0.08)", backgroundColor: "#f9fbfa" }}>
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(15,45,31,0.30)" }}>
                Cotonou, Bénin · 3–5 Février 2027 · Sofitel Marina
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3 no-print">
            <button onClick={handleDownload} disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-60"
              style={{ backgroundColor: "#0f2d1f", color: "#c49a30" }}>
              {downloading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              )}
              {downloading ? "Génération…" : "Télécharger PNG"}
            </button>
            <button onClick={handlePrint}
              className="flex items-center justify-center gap-2 font-semibold text-sm py-3.5 px-5 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              style={{ border: "1px solid rgba(36,100,68,0.20)", color: "#246444", backgroundColor: "white" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Imprimer
            </button>
          </div>

          <p className="text-center text-[10px] mt-5 no-print" style={{ color: "rgba(15,45,31,0.30)" }}>
            Ce badge est personnel et non transférable · SOAFGANG 2027
          </p>
        </div>
      </div>
    </>
  );
}

function InfoBlock({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(36,100,68,0.04)", border: "1px solid rgba(36,100,68,0.07)" }}>
      <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(15,45,31,0.35)" }}>{label}</p>
      <p className={`text-xs font-semibold leading-snug ${mono ? "font-mono" : ""}`} style={{ color: "#0f2d1f" }}>{value || "—"}</p>
    </div>
  );
}
