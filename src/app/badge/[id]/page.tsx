"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import QRCode from "qrcode";

// Types for badge participants (real table in Supabase)
type BadgeParticipant = {
  id: string;
  nom: string;
  prenom: string;
  organisation: string;
  pays: string;
  pass: string;
  statut: string;
  checked_in: boolean;
  checked_in_at: string | null;
};

const PASS_COLORS: Record<string, { bg: string; text: string }> = {
  "Conférencier":  { bg: "#c49a30", text: "#071810" },
  "Exposant":      { bg: "#246444", text: "#ffffff" },
  "Professionnel": { bg: "#1e5238", text: "#ffffff" },
  "Institutionnel":{ bg: "#0f2d1f", text: "#c49a30" },
  "VIP":           { bg: "#c49a30", text: "#071810" },
};

export default function BadgePage() {
  const { id } = useParams<{ id: string }>();
  const [participant, setParticipant] = useState<BadgeParticipant | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    supabase.from("participants").select("*").eq("id", id).single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); }
        else { setParticipant(data); }
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!participant || !qrRef.current) return;
    const url = `${window.location.origin}/badge/${participant.id}`;
    QRCode.toCanvas(qrRef.current, url, {
      width: 160,
      margin: 2,
      color: { dark: "#0f2d1f", light: "#ffffff" },
    });
  }, [participant]);

  const handleCheckIn = async () => {
    if (!participant || participant.checked_in) return;
    setCheckingIn(true);
    const now = new Date().toISOString();
    await supabase.from("participants").update({ checked_in: true, checked_in_at: now }).eq("id", participant.id);
    setParticipant(p => p ? { ...p, checked_in: true, checked_in_at: now } : p);
    setJustCheckedIn(true);
    setCheckingIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f5]">
        <div className="w-8 h-8 border-2 border-forest-400/40 border-t-forest-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7f5] px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          <h1 className="font-heading font-black text-gray-900 text-xl mb-2">Badge introuvable</h1>
          <p className="text-sm text-gray-500">Ce badge n'existe pas ou a été révoqué. Contactez l'accueil.</p>
        </div>
      </div>
    );
  }

  if (!participant) return null;

  const passStyle = PASS_COLORS[participant.pass] || { bg: "#246444", text: "#fff" };
  const isValid = participant.statut === "confirmé" || participant.statut === "VIP";

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Badge card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          {/* Header */}
          <div className="px-6 pt-7 pb-5 text-center" style={{ background: "linear-gradient(135deg, #071810 0%, #0f2d1f 70%, #163d2a 100%)" }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 10px)" }} />
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gold-400 mb-1 relative">SOAFGANG 2027</p>
            <p className="text-[9px] text-white/40 relative">Cotonou, Bénin · 3–5 Février 2027</p>
          </div>

          {/* Pass type strip */}
          <div className="py-2.5 text-center text-xs font-black uppercase tracking-[0.2em]" style={{ backgroundColor: passStyle.bg, color: passStyle.text }}>
            {participant.pass}
          </div>

          {/* Content */}
          <div className="px-7 py-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center font-heading font-black text-2xl mx-auto mb-4" style={{ background: "linear-gradient(135deg, #0f2d1f, #246444)", color: "#c49a30" }}>
              {participant.prenom[0]}{participant.nom[0]}
            </div>
            <h1 className="font-heading font-black text-gray-900 text-xl leading-tight mb-1">
              {participant.prenom} {participant.nom}
            </h1>
            <p className="text-sm text-gray-500 mb-0.5">{participant.organisation}</p>
            <p className="text-xs text-gray-400">{participant.pays}</p>

            {/* QR Code */}
            <div className="flex justify-center my-6">
              <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm inline-block">
                <canvas ref={qrRef} />
              </div>
            </div>
            <p className="text-[10px] text-gray-300 font-mono mb-6">{participant.id}</p>

            {/* Status */}
            {isValid ? (
              participant.checked_in ? (
                <div className="rounded-xl py-3 px-4 text-center" style={{ backgroundColor: "rgba(36,100,68,0.08)" }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-sm font-bold text-forest-700">{justCheckedIn ? "Pointage confirmé !" : "Déjà pointé"}</span>
                  </div>
                  {participant.checked_in_at && (
                    <p className="text-[11px] text-forest-600/60">
                      {new Date(participant.checked_in_at).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
              ) : (
                <button onClick={handleCheckIn} disabled={checkingIn}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#246444", color: "#fff" }}>
                  {checkingIn ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Pointage...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Pointer l'entrée</>
                  )}
                </button>
              )
            ) : (
              <div className="rounded-xl py-3 px-4 text-center bg-red-50">
                <p className="text-sm font-bold text-red-600">Badge non valide</p>
                <p className="text-xs text-red-400 mt-0.5">Statut : {participant.statut}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-4">
          SOAFGANG 2027 · Pour toute question : <a href="mailto:accueil@soafgang2027.org" className="underline">accueil@soafgang2027.org</a>
        </p>
      </div>
    </div>
  );
}
