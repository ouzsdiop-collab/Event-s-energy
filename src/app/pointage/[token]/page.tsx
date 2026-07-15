"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ScanResult = {
  type: "success" | "already" | "error";
  prenom?: string; nom?: string; organisation?: string; pass_type?: string;
  message?: string; checked_in_at?: string;
};

type Stats = { total: number; present: number; lastCheckins: { prenom: string; nom: string; pass_type: string; checked_in_at: string }[] };

const PASS_COLORS: Record<string, string> = {
  "Standard": "#1e5238", "VIP": "#c49a30", "Presse": "#2d4a6e",
  "Institutionnel": "#0f2d1f", "Exposant": "#246444", "Professionnel": "#1e5238", "Conférencier": "#c49a30",
};

export default function PointagePage() {
  const { token } = useParams<{ token: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanningRef = useRef(false);
  const lastScannedRef = useRef<string>("");
  const cooldownRef = useRef(false);

  const [scanning, setScanning] = useState(false);
  const [manualRef, setManualRef] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [stats, setStats] = useState<Stats>({ total: 0, present: 0, lastCheckins: [] });
  const [cameraError, setCameraError] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    const [totalRes, presentRes, lastRes] = await Promise.all([
      supabase.from("registrations").select("id", { count: "exact", head: true }),
      supabase.from("registrations").select("id", { count: "exact", head: true }).eq("checked_in", true),
      supabase.from("registrations").select("prenom, nom, pass_type, checked_in_at")
        .eq("checked_in", true).order("checked_in_at", { ascending: false }).limit(5),
    ]);
    setStats({
      total: totalRes.count ?? 0,
      present: presentRes.count ?? 0,
      lastCheckins: (lastRes.data ?? []) as Stats["lastCheckins"],
    });
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const handleCheckin = useCallback(async (reference: string) => {
    if (cooldownRef.current || loading) return;
    const clean = reference.trim().toUpperCase();
    if (!clean) return;
    cooldownRef.current = true;
    setLoading(true);

    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: clean, token }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setResult({ type: "error", message: data.error ?? "Erreur inconnue" });
    } else if (data.alreadyCheckedIn) {
      setResult({ type: "already", prenom: data.prenom, nom: data.nom, organisation: data.organisation, pass_type: data.pass_type, checked_in_at: data.checked_in_at });
    } else {
      setResult({ type: "success", prenom: data.prenom, nom: data.nom, organisation: data.organisation, pass_type: data.pass_type });
      loadStats();
    }

    setManualRef("");
    setTimeout(() => {
      setResult(null);
      cooldownRef.current = false;
    }, 3500);
  }, [token, loading, loadStats]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setScanning(true); scanningRef.current = true;
    } catch { setCameraError(true); }
  }, []);

  const stopCamera = useCallback(() => {
    scanningRef.current = false; setScanning(false);
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    if (!scanning) return;
    let animId: number;
    const tick = async () => {
      if (!scanningRef.current) return;
      const video = videoRef.current; const canvas = canvasRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA && canvas) {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const { default: jsQR } = await import("jsqr");
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code?.data && code.data !== lastScannedRef.current && !cooldownRef.current) {
            lastScannedRef.current = code.data;
            // Extraire la référence depuis l'URL du QR (/badge/SOAFGN-2027-XXXX)
            const match = code.data.match(/\/badge\/(SOAFGN-\d{4}-[A-Z0-9]+)/i) || code.data.match(/(SOAFGN-\d{4}-[A-Z0-9]+)/i);
            const ref = match?.[1] ?? code.data;
            handleCheckin(ref);
            setTimeout(() => { lastScannedRef.current = ""; }, 4000);
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [scanning, handleCheckin]);

  useEffect(() => () => { stopCamera(); }, [stopCamera]);

  const pct = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f0f4f2" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #071810, #0f2d1f)", borderBottom: "1px solid rgba(196,154,48,0.20)" }}>
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: "#c49a30" }}>SOAFGN 2027</p>
          <p className="text-white font-bold text-sm leading-tight">Pointage accréditation</p>
        </div>
        <div className="text-right">
          <p className="font-heading font-black text-2xl leading-none tabular-nums" style={{ color: "#c49a30" }}>{stats.present}</p>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>/ {stats.total} inscrits</p>
        </div>
      </div>

      <div className="max-w-sm mx-auto px-4 py-5 space-y-4">

        {/* Barre de progression */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
          <div className="flex items-end justify-between mb-3">
            <p className="text-xs font-bold" style={{ color: "#0f2d1f" }}>Participants présents</p>
            <p className="font-heading font-black text-xl tabular-nums" style={{ color: "#246444" }}>{pct}%</p>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(36,100,68,0.10)" }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "linear-gradient(to right, #246444, #c49a30)" }} />
          </div>
          <p className="text-[10px] mt-2" style={{ color: "rgba(15,45,31,0.40)" }}>{stats.total - stats.present} participant(s) pas encore arrivé(s)</p>
        </div>

        {/* Résultat scan */}
        {result && (
          <div className="rounded-2xl p-5 transition-all" style={{
            backgroundColor: result.type === "success" ? "rgba(36,100,68,0.08)" : result.type === "already" ? "rgba(234,179,8,0.10)" : "rgba(220,38,38,0.08)",
            border: `1px solid ${result.type === "success" ? "rgba(36,100,68,0.25)" : result.type === "already" ? "rgba(234,179,8,0.30)" : "rgba(220,38,38,0.25)"}`,
          }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shrink-0"
                style={{ backgroundColor: result.type === "success" ? "#246444" : result.type === "already" ? "#a16207" : "#dc2626", color: "white" }}>
                {result.type === "success" ? "✓" : result.type === "already" ? "!" : "✗"}
              </div>
              <div>
                {result.type === "error" ? (
                  <p className="font-bold text-sm" style={{ color: "#b91c1c" }}>{result.message}</p>
                ) : (
                  <>
                    <p className="font-black text-base leading-tight" style={{ color: "#0f2d1f" }}>{result.prenom} {result.nom}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.55)" }}>{result.organisation}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: (PASS_COLORS[result.pass_type ?? ""] ?? "#246444") + "20", color: PASS_COLORS[result.pass_type ?? ""] ?? "#246444" }}>
                        {result.pass_type}
                      </span>
                      {result.type === "already" && <span className="text-[10px]" style={{ color: "#a16207" }}>Déjà pointé</span>}
                      {result.type === "success" && <span className="text-[10px] font-semibold" style={{ color: "#246444" }}>Pointé ✓</span>}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scanner caméra */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
          {scanning ? (
            <div className="relative">
              <video ref={videoRef} className="w-full" style={{ display: "block", maxHeight: 280, objectFit: "cover" }} playsInline muted />
              <canvas ref={canvasRef} className="hidden" />
              {/* Cadre de scan */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-52 h-52 relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg" style={{ borderColor: "#c49a30" }} />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg" style={{ borderColor: "#c49a30" }} />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg" style={{ borderColor: "#c49a30" }} />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-lg" style={{ borderColor: "#c49a30" }} />
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 animate-pulse" style={{ backgroundColor: "rgba(196,154,48,0.70)" }} />
                </div>
              </div>
              <button onClick={stopCamera} className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: "rgba(0,0,0,0.60)", color: "white" }}>
                Arrêter
              </button>
            </div>
          ) : (
            <div className="p-5">
              {cameraError ? (
                <p className="text-xs text-center py-4" style={{ color: "rgba(15,45,31,0.45)" }}>Caméra non disponible — utilisez la saisie manuelle</p>
              ) : (
                <button onClick={startCamera} className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #0f2d1f, #163d2a)", color: "#c49a30" }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Scanner un badge QR
                </button>
              )}
            </div>
          )}
        </div>

        {/* Saisie manuelle */}
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(15,45,31,0.40)" }}>Saisie manuelle de la référence</p>
          <div className="flex gap-2">
            <input
              value={manualRef}
              onChange={e => setManualRef(e.target.value.toUpperCase())}
              onKeyDown={e => { if (e.key === "Enter") handleCheckin(manualRef); }}
              placeholder="SOAFGN-2027-XXXX"
              className="flex-1 text-xs px-3 py-2.5 rounded-xl border font-mono outline-none focus:ring-2 focus:ring-[#246444]/20"
              style={{ borderColor: "rgba(36,100,68,0.20)" }}
            />
            <button onClick={() => handleCheckin(manualRef)} disabled={!manualRef || loading}
              className="px-4 py-2.5 rounded-xl font-bold text-xs disabled:opacity-50 transition-all"
              style={{ backgroundColor: "#0f2d1f", color: "#c49a30" }}>
              {loading ? "…" : "Pointer"}
            </button>
          </div>
        </div>

        {/* Derniers pointés */}
        {stats.lastCheckins.length > 0 && (
          <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(15,45,31,0.40)" }}>Derniers arrivés</p>
            <div className="space-y-2.5">
              {stats.lastCheckins.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                    style={{ backgroundColor: (PASS_COLORS[c.pass_type] ?? "#246444") + "20", color: PASS_COLORS[c.pass_type] ?? "#246444" }}>
                    {c.prenom?.[0]}{c.nom?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "#0f2d1f" }}>{c.prenom} {c.nom}</p>
                    <p className="text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>{c.pass_type} · {new Date(c.checked_in_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: "#246444" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-[10px] pb-4" style={{ color: "rgba(15,45,31,0.25)" }}>
          SOAFGN 2027 · Accès réservé au personnel accrédité
        </p>
      </div>
    </div>
  );
}
