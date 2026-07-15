"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Users, CreditCard, CalendarDays, Mail,
  Bell, ChevronRight, Search, Download, Eye,
  CheckCircle2, XCircle, Clock, TrendingUp,
  Globe, Mic, Send, Menu, X, ArrowUpRight,
  Image, Newspaper, Handshake, UserPlus, Trash2, Pencil, Upload, Plus,
} from "lucide-react";
import { supabase, type Speaker, type GalleryImage, type Article, type Partner } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────
type Statut = "confirmé" | "en attente" | "annulé" | "VIP";
type PassType = "Conférencier" | "Exposant" | "Professionnel" | "Institutionnel";
type PayMethod = "Virement bancaire" | "Mobile Money" | "Carte bancaire";

interface Participant {
  id: string; nom: string; prenom: string; email: string;
  organisation: string; pays: string; pass: PassType;
  statut: Statut; montant: number; methode: PayMethod; date: string;
}

const PARTICIPANTS: Participant[] = [
  { id: "P001", nom: "Ouédraogo", prenom: "Kofi",      email: "k.ouedraogo@energygh.com",  organisation: "Ghana Energy Corp",    pays: "Ghana",         pass: "Exposant",      statut: "confirmé",   montant: 1_500_000, methode: "Virement bancaire", date: "2026-11-03" },
  { id: "P002", nom: "Diallo",    prenom: "Mariama",   email: "m.diallo@petroguin.com",     organisation: "PetroGuinée",          pays: "Guinée",        pass: "Conférencier",  statut: "confirmé",   montant: 0,         methode: "Virement bancaire", date: "2026-11-07" },
  { id: "P003", nom: "Mensah",    prenom: "Kweku",     email: "k.mensah@minen.gov.gh",      organisation: "Min. Énergie Ghana",   pays: "Ghana",         pass: "Institutionnel",statut: "VIP",        montant: 750_000,   methode: "Virement bancaire", date: "2026-11-12" },
  { id: "P004", nom: "Traoré",    prenom: "Adama",     email: "a.traore@sonacos.sn",        organisation: "Sonacos Sénégal",      pays: "Sénégal",       pass: "Professionnel", statut: "confirmé",   montant: 1_000_000, methode: "Mobile Money",      date: "2026-11-15" },
  { id: "P005", nom: "Bah",       prenom: "Ibrahim",   email: "i.bah@sogaz.ci",             organisation: "SOGAZ Côte d'Ivoire",  pays: "Côte d'Ivoire", pass: "Exposant",      statut: "en attente", montant: 1_500_000, methode: "Carte bancaire",    date: "2026-11-18" },
  { id: "P006", nom: "Sawadogo",  prenom: "Rasmata",   email: "r.sawadogo@minbf.gov",       organisation: "Min. Mines Burkina",   pays: "Burkina Faso",  pass: "Institutionnel",statut: "confirmé",   montant: 750_000,   methode: "Virement bancaire", date: "2026-11-20" },
  { id: "P007", nom: "Kone",      prenom: "Lacina",    email: "l.kone@totalci.com",         organisation: "TotalEnergies CI",     pays: "Côte d'Ivoire", pass: "Exposant",      statut: "confirmé",   montant: 1_500_000, methode: "Virement bancaire", date: "2026-11-22" },
  { id: "P008", nom: "Sow",       prenom: "Fatoumata", email: "f.sow@ong-energie.org",      organisation: "ONG Énergie Propre",   pays: "Sénégal",       pass: "Professionnel", statut: "en attente", montant: 1_000_000, methode: "Mobile Money",      date: "2026-11-25" },
  { id: "P009", nom: "Zongo",     prenom: "Emmanuel",  email: "e.zongo@gazoduc.bf",         organisation: "Gazoduc Burkina",      pays: "Burkina Faso",  pass: "Professionnel", statut: "confirmé",   montant: 1_000_000, methode: "Virement bancaire", date: "2026-11-28" },
  { id: "P010", nom: "Coulibaly", prenom: "Seydou",    email: "s.coulibaly@ntab.ml",        organisation: "NTAB Energy Mali",     pays: "Mali",          pass: "Conférencier",  statut: "VIP",        montant: 0,         methode: "Virement bancaire", date: "2026-12-01" },
];

const SESSIONS = [
  { id: "S01", titre: "Cérémonie d'ouverture officielle",   jour: "J1", heure: "09:00", type: "Plénière",    statut: "Confirmé",   intervenant: "Présidence Bénin" },
  { id: "S02", titre: "Panorama gazier de l'espace UEMOA",  jour: "J1", heure: "10:30", type: "Conférence",  statut: "Confirmé",   intervenant: "BCEAO / UEMOA" },
  { id: "S03", titre: "Infrastructure & pipeline régionaux", jour: "J1", heure: "14:00", type: "Panel",       statut: "En cours",   intervenant: "TotalEnergies + 3" },
  { id: "S04", titre: "Financement de projets gaziers",      jour: "J1", heure: "16:00", type: "Workshop",    statut: "Confirmé",   intervenant: "BAD / BM / IFC" },
  { id: "S05", titre: "Transition énergétique & gaz naturel",jour: "J2", heure: "09:00", type: "Conférence",  statut: "Confirmé",   intervenant: "IRENA" },
  { id: "S06", titre: "Cadres réglementaires nationaux",     jour: "J2", heure: "11:00", type: "Panel",       statut: "En attente", intervenant: "Ministères ×5" },
  { id: "S07", titre: "Table ronde investisseurs privés",    jour: "J2", heure: "14:30", type: "Table ronde", statut: "Confirmé",   intervenant: "CEOs secteur privé" },
  { id: "S08", titre: "Résolutions & clôture",               jour: "J3", heure: "10:00", type: "Plénière",    statut: "Confirmé",   intervenant: "Comité organisateur" },
];

const TIMELINE = [3, 5, 7, 4, 9, 12, 15, 11, 18, 22, 20, 25, 30, 28, 35, 40, 38, 45];
const PAYS_DATA = [
  { pays: "Sénégal", count: 42 }, { pays: "Côte d'Ivoire", count: 38 },
  { pays: "Bénin", count: 35 },   { pays: "Burkina Faso", count: 28 },
  { pays: "Mali", count: 24 },    { pays: "Ghana", count: 21 },
  { pays: "Guinée", count: 18 },  { pays: "Togo", count: 15 },
  { pays: "International", count: 31 },
];

const STATUT_STYLE: Record<Statut, { bg: string; text: string; icon: React.ReactNode }> = {
  "confirmé":   { bg: "rgba(36,100,68,0.10)",  text: "#246444", icon: <CheckCircle2 className="w-3 h-3" /> },
  "VIP":        { bg: "rgba(196,154,48,0.15)", text: "#b8890a", icon: <CheckCircle2 className="w-3 h-3" /> },
  "en attente": { bg: "rgba(234,179,8,0.12)",  text: "#a16207", icon: <Clock className="w-3 h-3" /> },
  "annulé":     { bg: "rgba(220,38,38,0.10)",  text: "#b91c1c", icon: <XCircle className="w-3 h-3" /> },
};

const PASS_COLORS: Record<PassType, string> = {
  "Conférencier": "#c49a30", "Exposant": "#246444", "Professionnel": "#1e5238", "Institutionnel": "#0f2d1f",
};

const NAV_SECTIONS = [
  { id: "overview",          label: "Vue d'ensemble",   icon: LayoutDashboard },
  { id: "participants",      label: "Participants",      icon: Users },
  { id: "paiements",         label: "Paiements",         icon: CreditCard },
  { id: "pointage",          label: "QR & Pointage",     icon: CheckCircle2 },
  { id: "programme",         label: "Programme",         icon: CalendarDays },
  { id: "communications",    label: "Communications",    icon: Mail },
  { id: "intervenants",      label: "Intervenants",      icon: Mic },
  { id: "galerie",           label: "Galerie",           icon: Image },
  { id: "articles",          label: "Actualités",        icon: Newspaper },
  { id: "partenaires_cm",    label: "Partenaires",       icon: Handshake },
  { id: "dem_partenariat",   label: "Demandes partenariat", icon: UserPlus },
  { id: "dem_presse",        label: "Accréditations presse", icon: Globe },
];

function fmtFCFA(n: number) { return n.toLocaleString("fr-FR") + " FCFA"; }
function fmtFCFAShort(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0","") + " M FCFA";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + " k FCFA";
  return n + " FCFA";
}

function useCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return { value, ref };
}

function KPICard({ label, value, rawValue, sub, icon: Icon, accent, delay = 0, isMoney = false }: {
  label: string; value?: string; rawValue?: number; sub: string;
  icon: React.ElementType; accent: string; delay?: number; isMoney?: boolean;
}) {
  const { value: counted, ref } = useCounter(rawValue ?? 0, 1100);
  const display = rawValue !== undefined ? (isMoney ? fmtFCFAShort(counted) : counted.toLocaleString("fr-FR")) : value ?? "";
  return (
    <div ref={ref} className="admin-card bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-4" style={{ animationDelay: `${delay}ms` }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: accent + "18" }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>{label}</p>
        <p className="font-heading font-black text-2xl leading-none tabular-nums" style={{ color: "#0f2d1f" }}>{display}</p>
        <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "rgba(15,45,31,0.40)" }}>
          <ArrowUpRight className="w-3 h-3" style={{ color: accent }} />{sub}
        </p>
      </div>
    </div>
  );
}

function SVGBarChart({ data }: { data: number[] }) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect(); } }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const max = Math.max(...data);
  const w = 520, h = 120, barW = 18, gap = 9;
  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 120 }}>
        {data.map((v, i) => {
          const barH = (v / max) * (h - 20);
          const x = i * (barW + gap) + 10;
          const y = h - barH - 4;
          return (
            <g key={i}>
              <rect x={x} y={revealed ? y : h - 4} width={barW} height={revealed ? barH : 0} rx={3}
                fill={i === data.length - 1 ? "#c49a30" : "#246444"} opacity={0.85}
                style={{ transition: `y 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 30}ms, height 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 30}ms` }} />
              {i % 3 === 0 && <text x={x + barW / 2} y={h} textAnchor="middle" fontSize={7} fill="rgba(15,45,31,0.35)">{i + 1}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  const r = 44, cx = 60, cy = 60;
  let cumulative = 0;
  const arcs = data.map((d) => {
    const pct = d.value / total;
    const start = cumulative; cumulative += pct;
    const startAngle = start * 2 * Math.PI - Math.PI / 2;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle),   y2 = cy + r * Math.sin(endAngle);
    return { ...d, path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${x2} ${y2} Z`, pct };
  });
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, flexShrink: 0 }}>
        {arcs.map((a, i) => <path key={i} d={a.path} fill={a.color} opacity={0.88} className="donut-arc" style={{ animationDelay: `${i * 80}ms` }} />)}
        <circle cx={cx} cy={cy} r={r - 18} fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={11} fontWeight="700" fill="#0f2d1f">{total}</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize={7} fill="rgba(15,45,31,0.45)">participants</text>
      </svg>
      <div className="flex flex-col gap-2">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: a.color }} />
            <span className="text-xs" style={{ color: "rgba(15,45,31,0.65)" }}>{a.label} <span className="font-semibold" style={{ color: "#0f2d1f" }}>{a.value}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setW(pct), delay); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref} className="h-2 rounded-full flex-1" style={{ backgroundColor: "rgba(36,100,68,0.08)" }}>
      <div className="h-2 rounded-full" style={{ width: `${w}%`, backgroundColor: color, transition: "width 0.8s cubic-bezier(0.34,1.2,0.64,1)" }} />
    </div>
  );
}

// ─── Photo Crop Widget ────────────────────────────────────────────────────────
function FocalPointPicker({ url, focalX, focalY, onChange }: { url: string; focalX: number; focalY: number; onChange: (x: number, y: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onChange(Math.round(x * 100) / 100, Math.round(y * 100) / 100);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(15,45,31,0.45)" }}>
        Point focal · Cliquez sur la zone à centrer
      </p>
      <div ref={containerRef} className="relative cursor-crosshair rounded-xl overflow-hidden border border-gray-200" style={{ height: 200 }} onClick={handleClick}>
        <img src={url} alt="preview" className="w-full h-full object-cover" style={{ objectPosition: `${focalX * 100}% ${focalY * 100}%` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1))" }} />
        <div className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${focalX * 100}%`, top: `${focalY * 100}%` }}>
          <div className="w-full h-full rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: "rgba(196,154,48,0.6)" }} />
        </div>
      </div>
      <p className="text-[10px]" style={{ color: "rgba(15,45,31,0.35)" }}>
        Position : X {Math.round(focalX * 100)}% · Y {Math.round(focalY * 100)}%
      </p>
    </div>
  );
}

// ─── Upload helper ────────────────────────────────────────────────────────────
async function uploadFile(file: File, path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("soafgang-media").upload(path, file, { upsert: true });
  if (error || !data) return null;
  const { data: urlData } = supabase.storage.from("soafgang-media").getPublicUrl(data.path);
  return urlData.publicUrl;
}

// ─── Section Intervenants (CMS) ───────────────────────────────────────────────
function SectionIntervenants() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Speaker | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", title_fr: "", title_en: "", country_fr: "", country_en: "", flag: "🌍", confirmed: true, order_index: 0 });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [focalX, setFocalX] = useState(0.5);
  const [focalY, setFocalY] = useState(0.5);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("speakers").select("*").order("order_index");
    if (data) setSpeakers(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditTarget(null);
    setForm({ name: "", title_fr: "", title_en: "", country_fr: "", country_en: "", flag: "🌍", confirmed: true, order_index: speakers.length + 1 });
    setPhotoFile(null); setPhotoPreview(null); setFocalX(0.5); setFocalY(0.5);
    setShowForm(true);
  };

  const openEdit = (s: Speaker) => {
    setEditTarget(s);
    setForm({ name: s.name, title_fr: s.title_fr, title_en: s.title_en || "", country_fr: s.country_fr, country_en: s.country_en || "", flag: s.flag, confirmed: s.confirmed, order_index: s.order_index });
    setPhotoFile(null); setPhotoPreview(s.photo_url); setFocalX(s.photo_focal_x ?? 0.5); setFocalY(s.photo_focal_y ?? 0.5);
    setShowForm(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setFocalX(0.5); setFocalY(0.5);
  };

  const handleSave = async () => {
    setSaving(true);
    let photo_url = editTarget?.photo_url || null;
    if (photoFile) {
      const path = `speakers/${Date.now()}-${photoFile.name}`;
      photo_url = await uploadFile(photoFile, path);
    }
    const payload = { ...form, photo_url, photo_focal_x: focalX, photo_focal_y: focalY };
    if (editTarget) {
      await supabase.from("speakers").update(payload).eq("id", editTarget.id);
    } else {
      await supabase.from("speakers").insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet intervenant ?")) return;
    await supabase.from("speakers").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between admin-card" style={{ animationDelay: "0ms" }}>
        <div>
          <h2 className="font-heading font-black text-xl" style={{ color: "#0f2d1f" }}>Intervenants</h2>
          <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>{speakers.length} intervenant(s) · données en direct depuis Supabase</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg btn-primary">
          <UserPlus className="w-3.5 h-3.5" /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 admin-card" style={{ animationDelay: "0ms" }}>
          <h3 className="font-heading font-bold text-base" style={{ color: "#0f2d1f" }}>{editTarget ? "Modifier" : "Nouvel intervenant"}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {([["name","Nom complet *"],["title_fr","Titre (FR) *"],["title_en","Titre (EN)"],["country_fr","Pays (FR) *"],["country_en","Pays (EN)"],["flag","Drapeau emoji"]] as [keyof typeof form, string][]).map(([key, label]) => (
              <div key={key}>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>{label}</label>
                <input value={String(form[key])} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20 transition-shadow"
                  style={{ borderColor: "rgba(36,100,68,0.20)" }} />
              </div>
            ))}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Ordre d'affichage</label>
              <input type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: Number(e.target.value) }))}
                className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20"
                style={{ borderColor: "rgba(36,100,68,0.20)" }} />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="confirmed" checked={form.confirmed} onChange={e => setForm(f => ({ ...f, confirmed: e.target.checked }))} className="rounded" />
              <label htmlFor="confirmed" className="text-xs font-medium" style={{ color: "#0f2d1f" }}>Intervenant confirmé</label>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: "rgba(15,45,31,0.45)" }}>Photo</label>
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold px-4 py-2 rounded-lg border transition-colors hover:bg-[#f4f7f5]"
              style={{ borderColor: "rgba(36,100,68,0.25)", color: "#246444" }}>
              <Upload className="w-3.5 h-3.5" /> Choisir une photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>

          {photoPreview && (
            <FocalPointPicker url={photoPreview} focalX={focalX} focalY={focalY}
              onChange={(x, y) => { setFocalX(x); setFocalY(y); }} />
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-lg btn-primary disabled:opacity-60">
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-xs font-medium px-4 py-2.5 rounded-lg border transition-colors hover:bg-gray-50"
              style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>Annuler</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {loading ? <p className="text-xs text-gray-400 col-span-2 py-8 text-center">Chargement…</p> :
          speakers.map((s, i) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow admin-card" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: "rgba(196,154,48,0.30)" }}>
                {s.photo_url
                  ? <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" style={{ objectPosition: `${(s.photo_focal_x ?? 0.5) * 100}% ${(s.photo_focal_y ?? 0.5) * 100}%` }} />
                  : <div className="w-full h-full flex items-center justify-center text-xs font-black" style={{ backgroundColor: "#1e5238", color: "#c49a30" }}>{s.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "#0f2d1f" }}>{s.name}</p>
                <p className="text-xs truncate" style={{ color: "rgba(15,45,31,0.55)" }}>{s.title_fr}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs">{s.flag} {s.country_fr}</span>
                  {s.confirmed && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: "rgba(36,100,68,0.10)", color: "#246444" }}>✓ Confirmé</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-gray-50 transition-colors"><Pencil className="w-4 h-4" style={{ color: "#246444" }} /></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── Section Galerie (CMS) ───────────────────────────────────────────────────
function SectionGalerie() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editTarget, setEditTarget] = useState<GalleryImage | null>(null);
  const [focalX, setFocalX] = useState(0.5);
  const [focalY, setFocalY] = useState(0.5);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("gallery_images").select("*").order("order_index");
    if (data) setImages(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const path = `gallery/${Date.now()}-${file.name}`;
      const url = await uploadFile(file, path);
      if (url) await supabase.from("gallery_images").insert({ url, focal_x: 0.5, focal_y: 0.5, published: true, order_index: images.length + 1 });
    }
    setUploading(false);
    load();
  };

  const handleSaveFocal = async () => {
    if (!editTarget) return;
    await supabase.from("gallery_images").update({ focal_x: focalX, focal_y: focalY }).eq("id", editTarget.id);
    setEditTarget(null);
    load();
  };

  const handleTogglePublish = async (img: GalleryImage) => {
    await supabase.from("gallery_images").update({ published: !img.published }).eq("id", img.id);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette image ?")) return;
    await supabase.from("gallery_images").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between admin-card" style={{ animationDelay: "0ms" }}>
        <div>
          <h2 className="font-heading font-black text-xl" style={{ color: "#0f2d1f" }}>Galerie</h2>
          <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>{images.length} image(s) · Cliquez sur une image pour ajuster le point focal</p>
        </div>
        <label className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg btn-primary cursor-pointer">
          <Upload className="w-3.5 h-3.5" /> {uploading ? "Upload…" : "Ajouter des photos"}
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {editTarget && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 admin-card" style={{ animationDelay: "0ms" }}>
          <h3 className="font-heading font-bold text-base" style={{ color: "#0f2d1f" }}>Ajuster le point focal</h3>
          <FocalPointPicker url={editTarget.url} focalX={focalX} focalY={focalY} onChange={(x, y) => { setFocalX(x); setFocalY(y); }} />
          <div className="flex gap-3">
            <button onClick={handleSaveFocal} className="text-xs font-semibold px-5 py-2.5 rounded-lg btn-primary">Enregistrer</button>
            <button onClick={() => setEditTarget(null)} className="text-xs font-medium px-4 py-2.5 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>Annuler</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-xs text-gray-400 py-8 text-center">Chargement…</p> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={img.id} className="group relative rounded-xl overflow-hidden border border-gray-100 admin-card" style={{ animationDelay: `${i * 30}ms`, aspectRatio: "4/3" }}>
              <img src={img.url} alt="" className="w-full h-full object-cover" style={{ objectPosition: `${(img.focal_x ?? 0.5) * 100}% ${(img.focal_y ?? 0.5) * 100}%` }} />
              {!img.published && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded">Masqué</span></div>}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => { setEditTarget(img); setFocalX(img.focal_x ?? 0.5); setFocalY(img.focal_y ?? 0.5); }}
                  className="text-[10px] font-bold bg-white text-gray-800 px-2 py-1 rounded-lg">Point focal</button>
                <div className="flex gap-1">
                  <button onClick={() => handleTogglePublish(img)} className="p-1.5 rounded-lg bg-white/90 hover:bg-white transition-colors">
                    <Eye className="w-3.5 h-3.5" style={{ color: img.published ? "#246444" : "#9ca3af" }} />
                  </button>
                  <button onClick={() => handleDelete(img.id)} className="p-1.5 rounded-lg bg-white/90 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section Articles (CMS) ──────────────────────────────────────────────────
function SectionArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title_fr: "", excerpt_fr: "", category: "annonce" as Article["category"], published: false, featured: false, read_time: 3 });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("articles").select("*").order("published_at", { ascending: false });
    if (data) setArticles(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditTarget(null);
    setForm({ title_fr: "", excerpt_fr: "", category: "annonce", published: false, featured: false, read_time: 3 });
    setShowForm(true);
  };

  const openEdit = (a: Article) => {
    setEditTarget(a);
    setForm({ title_fr: a.title_fr, excerpt_fr: a.excerpt_fr, category: a.category, published: a.published, featured: a.featured, read_time: a.read_time });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editTarget) {
      await supabase.from("articles").update(form).eq("id", editTarget.id);
    } else {
      await supabase.from("articles").insert({ ...form, published_at: new Date().toISOString() });
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    await supabase.from("articles").delete().eq("id", id);
    load();
  };

  const categoryLabels: Record<string, string> = { annonce: "Communiqué", partenariat: "Partenariats", programme: "Programme", presse: "Presse", logistique: "Organisation" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between admin-card" style={{ animationDelay: "0ms" }}>
        <div>
          <h2 className="font-heading font-black text-xl" style={{ color: "#0f2d1f" }}>Actualités</h2>
          <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>{articles.length} article(s)</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg btn-primary">
          <Plus className="w-3.5 h-3.5" /> Nouvel article
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 admin-card" style={{ animationDelay: "0ms" }}>
          <h3 className="font-heading font-bold text-base" style={{ color: "#0f2d1f" }}>{editTarget ? "Modifier" : "Nouvel article"}</h3>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Titre *</label>
            <input value={form.title_fr} onChange={e => setForm(f => ({ ...f, title_fr: e.target.value }))}
              className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20"
              style={{ borderColor: "rgba(36,100,68,0.20)" }} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Extrait *</label>
            <textarea value={form.excerpt_fr} onChange={e => setForm(f => ({ ...f, excerpt_fr: e.target.value }))} rows={3}
              className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none resize-none focus:ring-2 focus:ring-[#246444]/20"
              style={{ borderColor: "rgba(36,100,68,0.20)" }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Catégorie</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Article["category"] }))}
                className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Temps de lecture (min)</label>
              <input type="number" value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: Number(e.target.value) }))}
                className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
              <span className="text-xs font-medium" style={{ color: "#0f2d1f" }}>Publié</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
              <span className="text-xs font-medium" style={{ color: "#0f2d1f" }}>À la une</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="text-xs font-semibold px-5 py-2.5 rounded-lg btn-primary disabled:opacity-60">
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-xs font-medium px-4 py-2.5 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? <p className="text-xs text-gray-400 py-8 text-center">Chargement…</p> :
          articles.map((a, i) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-4 hover:shadow-sm transition-shadow admin-card" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(36,100,68,0.10)", color: "#246444" }}>{categoryLabels[a.category]}</span>
                  {a.featured && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(196,154,48,0.12)", color: "#9a7320" }}>À la une</span>}
                  {!a.published && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Brouillon</span>}
                </div>
                <p className="text-sm font-semibold line-clamp-1" style={{ color: "#0f2d1f" }}>{a.title_fr}</p>
                <p className="text-xs mt-1 line-clamp-1" style={{ color: "rgba(15,45,31,0.45)" }}>{a.excerpt_fr}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-gray-50 transition-colors"><Pencil className="w-4 h-4" style={{ color: "#246444" }} /></button>
                <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── Section Partenaires (CMS) ───────────────────────────────────────────────
function SectionPartenaires() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", tier: "or" as Partner["tier"], website_url: "", order_index: 0, published: true });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("partners").select("*").order("order_index");
    if (data) setPartners(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditTarget(null);
    setForm({ name: "", tier: "or", website_url: "", order_index: partners.length + 1, published: true });
    setLogoFile(null); setLogoPreview(null); setShowForm(true);
  };

  const openEdit = (p: Partner) => {
    setEditTarget(p);
    setForm({ name: p.name, tier: p.tier, website_url: p.website_url || "", order_index: p.order_index, published: p.published });
    setLogoFile(null); setLogoPreview(p.logo_url); setShowForm(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    let logo_url = editTarget?.logo_url || null;
    if (logoFile) {
      const path = `partners/${Date.now()}-${logoFile.name}`;
      logo_url = await uploadFile(logoFile, path);
    }
    const payload = { ...form, logo_url };
    if (editTarget) {
      await supabase.from("partners").update(payload).eq("id", editTarget.id);
    } else {
      await supabase.from("partners").insert(payload);
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce partenaire ?")) return;
    await supabase.from("partners").delete().eq("id", id);
    load();
  };

  const tierColors: Record<string, string> = { platine: "#c49a30", or: "#b8892a", argent: "#6b7280", institutionnel: "#246444" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between admin-card" style={{ animationDelay: "0ms" }}>
        <div>
          <h2 className="font-heading font-black text-xl" style={{ color: "#0f2d1f" }}>Partenaires</h2>
          <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>{partners.length} partenaire(s)</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg btn-primary">
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 admin-card" style={{ animationDelay: "0ms" }}>
          <h3 className="font-heading font-bold text-base" style={{ color: "#0f2d1f" }}>{editTarget ? "Modifier" : "Nouveau partenaire"}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {([["name","Nom *"],["website_url","Site web"]] as [keyof typeof form, string][]).map(([key, label]) => (
              <div key={key}>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>{label}</label>
                <input value={String(form[key])} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20"
                  style={{ borderColor: "rgba(36,100,68,0.20)" }} />
              </div>
            ))}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Tier</label>
              <select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value as Partner["tier"] }))}
                className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                {["platine","or","argent","institutionnel"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Ordre</label>
              <input type="number" value={form.order_index} onChange={e => setForm(f => ({ ...f, order_index: Number(e.target.value) }))}
                className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: "rgba(15,45,31,0.45)" }}>Logo</label>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold px-4 py-2 rounded-lg border transition-colors hover:bg-[#f4f7f5]"
                style={{ borderColor: "rgba(36,100,68,0.25)", color: "#246444" }}>
                <Upload className="w-3.5 h-3.5" /> Choisir un logo
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
              {logoPreview && <img src={logoPreview} alt="logo" className="h-10 w-auto object-contain rounded border border-gray-100" />}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="text-xs font-semibold px-5 py-2.5 rounded-lg btn-primary disabled:opacity-60">
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-xs font-medium px-4 py-2.5 rounded-lg border hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>Annuler</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {loading ? <p className="text-xs text-gray-400 py-8 text-center col-span-2">Chargement…</p> :
          partners.map((p, i) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 admin-card" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                {p.logo_url
                  ? <img src={p.logo_url} alt={p.name} className="w-full h-full object-contain p-1" />
                  : <span className="text-xs font-black" style={{ color: tierColors[p.tier] }}>{p.name.slice(0, 2)}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: "#0f2d1f" }}>{p.name}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: tierColors[p.tier] + "15", color: tierColors[p.tier] }}>
                  {p.tier.charAt(0).toUpperCase() + p.tier.slice(1)}
                </span>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-gray-50 transition-colors"><Pencil className="w-4 h-4" style={{ color: "#246444" }} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── Sections existantes ──────────────────────────────────────────────────────
function SectionOverview() {
  const confirmed = PARTICIPANTS.filter(p => p.statut === "confirmé" || p.statut === "VIP").length;
  const revenue = PARTICIPANTS.filter(p => p.statut !== "annulé").reduce((a, p) => a + p.montant, 0);
  const passBreakdown = (["Conférencier","Exposant","Professionnel","Institutionnel"] as PassType[]).map(p => ({ label: p, value: PARTICIPANTS.filter(x => x.pass === p).length, color: PASS_COLORS[p] }));
  return (
    <div className="space-y-8">
      <div className="admin-card" style={{ animationDelay: "0ms" }}>
        <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Vue d'ensemble</h2>
        <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>Tableau de bord · données simulées</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Inscrits totaux"     rawValue={PARTICIPANTS.length} sub={`${confirmed} confirmés`}  icon={Users}        accent="#246444" delay={0} />
        <KPICard label="Revenus générés"     rawValue={revenue}             sub="hors conférenciers"         icon={TrendingUp}   accent="#c49a30" delay={80} isMoney />
        <KPICard label="Sessions planifiées" rawValue={SESSIONS.length}     sub="sur 3 jours"                icon={CalendarDays} accent="#1e5238" delay={160} />
        <KPICard label="Pays représentés"    rawValue={PAYS_DATA.length}    sub="dont 1 international"       icon={Globe}        accent="#0f2d1f" delay={240} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "100ms" }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "#c49a30" }}>Inscriptions / jour (J1–J18)</p>
          <SVGBarChart data={TIMELINE} />
        </div>
        <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "180ms" }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "#c49a30" }}>Répartition par pass</p>
          <DonutChart data={passBreakdown} />
        </div>
      </div>
      <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "240ms" }}>
        <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "#c49a30" }}>Participants par pays</p>
        <div className="space-y-3">
          {[...PAYS_DATA].sort((a,b) => b.count - a.count).map((p, i) => (
            <div key={p.pays} className="flex items-center gap-3">
              <span className="text-xs w-28 shrink-0" style={{ color: "rgba(15,45,31,0.65)" }}>{p.pays}</span>
              <AnimBar pct={(p.count / Math.max(...PAYS_DATA.map(x => x.count))) * 100} color="#246444" delay={i * 60} />
              <span className="text-xs font-semibold w-6 text-right" style={{ color: "#0f2d1f" }}>{p.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionParticipants() {
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState<Statut | "">("");
  const [filterPays, setFilterPays] = useState("");
  const filtered = useMemo(() => PARTICIPANTS.filter(p => {
    const q = search.toLowerCase();
    return (!q || p.nom.toLowerCase().includes(q) || p.prenom.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
      && (!filterStatut || p.statut === filterStatut) && (!filterPays || p.pays === filterPays);
  }), [search, filterStatut, filterPays]);
  const pays = Array.from(new Set(PARTICIPANTS.map(p => p.pays))).sort();
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap admin-card" style={{ animationDelay: "0ms" }}>
        <div>
          <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Participants</h2>
          <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>{filtered.length} résultat(s) sur {PARTICIPANTS.length}</p>
        </div>
        <button className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg btn-primary">
          <Download className="w-3.5 h-3.5" /> Exporter CSV
        </button>
      </div>
      <div className="flex gap-3 flex-wrap admin-card" style={{ animationDelay: "60ms" }}>
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(15,45,31,0.35)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
            className="w-full text-xs pl-8 pr-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20 transition-shadow"
            style={{ borderColor: "rgba(36,100,68,0.20)", backgroundColor: "white" }} />
        </div>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value as Statut | "")}
          className="text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)", backgroundColor: "white", color: "#0f2d1f" }}>
          <option value="">Tous les statuts</option>
          {(["confirmé","en attente","annulé","VIP"] as Statut[]).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterPays} onChange={e => setFilterPays(e.target.value)}
          className="text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)", backgroundColor: "white", color: "#0f2d1f" }}>
          <option value="">Tous les pays</option>
          {pays.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="admin-card bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ animationDelay: "120ms" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: "#f4f7f5" }}>
                {["ID","Participant","Organisation","Pays","Pass","Statut","Montant","Date"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "rgba(15,45,31,0.50)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const s = STATUT_STYLE[p.statut];
                return (
                  <tr key={p.id} className="table-row-anim hover:bg-[#f9fbfa] transition-colors"
                    style={{ borderTop: i > 0 ? "1px solid rgba(36,100,68,0.07)" : undefined, animationDelay: `${i * 40}ms` }}>
                    <td className="px-4 py-3 font-mono" style={{ color: "rgba(15,45,31,0.35)" }}>{p.id}</td>
                    <td className="px-4 py-3"><div className="font-semibold" style={{ color: "#0f2d1f" }}>{p.prenom} {p.nom}</div><div style={{ color: "rgba(15,45,31,0.45)" }}>{p.email}</div></td>
                    <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.65)" }}>{p.organisation}</td>
                    <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.65)" }}>{p.pays}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md font-semibold text-[10px]" style={{ backgroundColor: PASS_COLORS[p.pass] + "15", color: PASS_COLORS[p.pass] }}>{p.pass}</span></td>
                    <td className="px-4 py-3"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-[10px]" style={{ backgroundColor: s.bg, color: s.text }}>{s.icon}{p.statut}</span></td>
                    <td className="px-4 py-3 font-semibold tabular-nums" style={{ color: p.montant ? "#0f2d1f" : "rgba(15,45,31,0.30)" }}>{p.montant ? fmtFCFA(p.montant) : "-"}</td>
                    <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.45)" }}>{p.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SectionPaiements() {
  const passes: PassType[] = ["Conférencier","Exposant","Professionnel","Institutionnel"];
  const tarifs: Record<PassType, number> = { "Conférencier": 0, "Exposant": 1_500_000, "Professionnel": 1_000_000, "Institutionnel": 750_000 };
  const methods: PayMethod[] = ["Virement bancaire","Mobile Money","Carte bancaire"];
  const totalRevenue = PARTICIPANTS.filter(p => p.statut !== "annulé").reduce((a, p) => a + p.montant, 0);
  const pending = PARTICIPANTS.filter(p => p.statut === "en attente").reduce((a, p) => a + p.montant, 0);
  return (
    <div className="space-y-6">
      <div className="admin-card" style={{ animationDelay: "0ms" }}>
        <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Paiements & Revenus</h2>
        <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>Analyse financière · données simulées</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Revenus confirmés" rawValue={totalRevenue} sub="paiements reçus"   icon={TrendingUp}  accent="#246444" delay={0}   isMoney />
        <KPICard label="En attente"        rawValue={pending}      sub="à encaisser"        icon={Clock}       accent="#c49a30" delay={80}  isMoney />
        <KPICard label="Taux de conversion" value="80%"            sub="inscrits confirmés" icon={CheckCircle2} accent="#1e5238" delay={160} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "80ms" }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "#c49a30" }}>Revenus par type de pass</p>
          <div className="space-y-5">
            {passes.filter(p => tarifs[p] > 0).map((pass, i) => {
              const count = PARTICIPANTS.filter(x => x.pass === pass && x.statut !== "annulé").length;
              const rev = count * tarifs[pass];
              const pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
              return (
                <div key={pass}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: "#0f2d1f" }}>{pass}</span>
                    <span className="text-xs font-semibold tabular-nums" style={{ color: PASS_COLORS[pass] }}>{fmtFCFAShort(rev)}</span>
                  </div>
                  <AnimBar pct={pct} color={PASS_COLORS[pass]} delay={i * 100} />
                  <p className="text-[10px] mt-1" style={{ color: "rgba(15,45,31,0.40)" }}>{count} participant(s) · {fmtFCFAShort(tarifs[pass])}/u</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "160ms" }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "#c49a30" }}>Méthodes de paiement</p>
          <div className="space-y-4">
            {methods.map((m, i) => {
              const count = PARTICIPANTS.filter(p => p.methode === m).length;
              return (
                <div key={m} className="flex items-center gap-3">
                  <span className="text-xs w-36 shrink-0" style={{ color: "rgba(15,45,31,0.65)" }}>{m}</span>
                  <AnimBar pct={(count / PARTICIPANTS.length) * 100} color="#246444" delay={i * 100} />
                  <span className="text-xs font-semibold w-6 text-right" style={{ color: "#0f2d1f" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionProgramme() {
  const typeColors: Record<string, string> = { "Plénière": "#246444", "Conférence": "#1e5238", "Panel": "#c49a30", "Workshop": "#0f2d1f", "Table ronde": "#7c5e10", "Terrain": "#4a7c59" };
  const statutColors: Record<string, { bg: string; text: string }> = {
    "Confirmé": { bg: "rgba(36,100,68,0.10)", text: "#246444" },
    "En cours": { bg: "rgba(196,154,48,0.12)", text: "#b8890a" },
    "En attente": { bg: "rgba(234,179,8,0.10)", text: "#a16207" },
  };
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap admin-card" style={{ animationDelay: "0ms" }}>
        <div>
          <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Gestion du Programme</h2>
          <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>{SESSIONS.length} sessions sur 3 jours</p>
        </div>
      </div>
      {["J1","J2","J3"].map((jour, ji) => (
        <div key={jour} className="admin-card bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ animationDelay: `${60 + ji * 80}ms` }}>
          <div className="px-6 py-4" style={{ backgroundColor: "#0f2d1f" }}>
            <p className="text-sm font-bold" style={{ color: "#c49a30" }}>
              {jour === "J1" ? "Jour 1 · 3 février 2027" : jour === "J2" ? "Jour 2 · 4 février 2027" : "Jour 3 · 5 février 2027"}
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(36,100,68,0.07)" }}>
            {SESSIONS.filter(s => s.jour === jour).map((session) => {
              const sc = statutColors[session.statut] || statutColors["En attente"];
              const tc = typeColors[session.type] || "#246444";
              return (
                <div key={session.id} className="px-6 py-4 flex items-start gap-4 hover:bg-[#f9fbfa] transition-colors group">
                  <span className="text-xs font-mono font-bold shrink-0 pt-0.5 w-10" style={{ color: "#c49a30" }}>{session.heure}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: "#0f2d1f" }}>{session.titre}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0" style={{ backgroundColor: tc + "15", color: tc }}>{session.type}</span>
                    </div>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "rgba(15,45,31,0.50)" }}><Mic className="w-3 h-3" />{session.intervenant}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0" style={{ backgroundColor: sc.bg, color: sc.text }}>{session.statut}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionCommunications() {
  const [tab, setTab] = useState<"compose"|"sent">("compose");
  const [subject, setSubject] = useState("Confirmation d'inscription · SOAFGANG 2027");
  const [body, setBody] = useState(`Bonjour {prenom},\n\nNous avons bien reçu votre inscription au SOAFGANG 2027.\n\nVotre pass : {pass}\nStatut : {statut}\n\nCordialement,\nLe Comité d'Organisation SOAFGANG 2027`);
  return (
    <div className="space-y-6">
      <div className="admin-card" style={{ animationDelay: "0ms" }}>
        <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Communications</h2>
        <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>Gestion des envois d'e-mails aux participants</p>
      </div>
      <div className="admin-card bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ animationDelay: "80ms" }}>
        <div className="flex border-b" style={{ borderColor: "rgba(36,100,68,0.10)" }}>
          {[["compose","Composer"],["sent","Historique"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as "compose"|"sent")} className="px-6 py-3.5 text-xs font-semibold transition-colors"
              style={{ color: tab === id ? "#246444" : "rgba(15,45,31,0.45)", borderBottom: tab === id ? "2px solid #246444" : "2px solid transparent" }}>
              {label}
            </button>
          ))}
        </div>
        {tab === "compose" ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Objet</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Corps du message</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={8} className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none resize-none font-mono focus:ring-2 focus:ring-[#246444]/20" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
            </div>
            <button className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-lg btn-primary"><Send className="w-3.5 h-3.5" /> Envoyer</button>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(36,100,68,0.07)" }}>
            {[{ sujet: "Bienvenue · Confirmation d'inscription", dest: "Tous (15)", date: "2026-12-12" }].map((e, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(36,100,68,0.08)" }}>
                  <Mail className="w-3.5 h-3.5" style={{ color: "#246444" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#0f2d1f" }}>{e.sujet}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>→ {e.dest} · {e.date}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0" style={{ backgroundColor: "rgba(36,100,68,0.10)", color: "#246444" }}>Envoyé</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section Demandes Partenariat ─────────────────────────────────────────────
function SectionDemandesPartenariat() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    nouveau:    { bg: "rgba(234,179,8,0.12)",  text: "#a16207", label: "Nouveau" },
    en_contact: { bg: "rgba(36,100,68,0.10)",  text: "#246444", label: "En contact" },
    "signé":    { bg: "rgba(196,154,48,0.15)", text: "#9a7320", label: "Signé" },
    refusé:     { bg: "rgba(220,38,38,0.10)",  text: "#b91c1c", label: "Refusé" },
  };

  const TIER_LABELS: Record<string, string> = {
    platine: "Platine", or: "Or", argent: "Argent", institutionnel: "Institutionnel", autre: "Autre",
  };

  useEffect(() => {
    supabase.from("partnership_requests").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setRequests(data); setLoading(false); });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("partnership_requests").update({ status }).eq("id", id);
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  };

  const filtered = requests.filter(r =>
    [r.name, r.organisation, r.email, r.pays].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-card bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
      <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-3" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
        <div>
          <h2 className="font-heading font-black text-xl" style={{ color: "#0f2d1f" }}>Demandes de partenariat</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>{requests.length} demande{requests.length !== 1 ? "s" : ""} reçue{requests.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(15,45,31,0.30)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="text-xs pl-8 pr-3 py-2 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm" style={{ color: "rgba(15,45,31,0.40)" }}>Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm" style={{ color: "rgba(15,45,31,0.40)" }}>{requests.length === 0 ? "Aucune demande pour le moment." : "Aucun résultat."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr style={{ backgroundColor: "rgba(15,45,31,0.03)", borderBottom: "1px solid rgba(36,100,68,0.08)" }}>
                {["Date","Nom","Organisation","Niveau","Email","Statut","Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold uppercase tracking-wider text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const s = STATUS_STYLE[r.status] || STATUS_STYLE.nouveau;
                return (
                  <tr key={r.id} className="table-row-anim" style={{ borderBottom: "1px solid rgba(36,100,68,0.06)", animationDelay: `${i * 40}ms` }}>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(15,45,31,0.50)" }}>{new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#0f2d1f" }}>{r.name}</td>
                    <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.65)" }}>{r.organisation}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: "rgba(196,154,48,0.12)", color: "#9a7320" }}>{TIER_LABELS[r.tier_interest] || r.tier_interest}</span>
                    </td>
                    <td className="px-4 py-3"><a href={`mailto:${r.email}`} className="text-forest-600 hover:underline">{r.email}</a></td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} className="text-[10px] border rounded px-1.5 py-1 outline-none bg-white" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                        <option value="nouveau">Nouveau</option>
                        <option value="en_contact">En contact</option>
                        <option value="signé">Signé</option>
                        <option value="refusé">Refusé</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Détail message si présent */}
      {filtered.some(r => r.message) && (
        <div className="px-6 py-4 space-y-3" style={{ borderTop: "1px solid rgba(36,100,68,0.07)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(15,45,31,0.35)" }}>Messages reçus</p>
          {filtered.filter(r => r.message).map(r => (
            <div key={r.id} className="rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(15,45,31,0.03)", border: "1px solid rgba(36,100,68,0.08)" }}>
              <p className="text-[10px] font-bold mb-1" style={{ color: "#246444" }}>{r.name} — {r.organisation}</p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(15,45,31,0.65)" }}>{r.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section Demandes Presse ───────────────────────────────────────────────────
function SectionDemandePresse() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    nouveau:  { bg: "rgba(234,179,8,0.12)",  text: "#a16207", label: "Nouveau" },
    approuvé: { bg: "rgba(36,100,68,0.10)",  text: "#246444", label: "Approuvé" },
    refusé:   { bg: "rgba(220,38,38,0.10)",  text: "#b91c1c", label: "Refusé" },
  };

  useEffect(() => {
    supabase.from("press_requests").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setRequests(data); setLoading(false); });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("press_requests").update({ status }).eq("id", id);
    setRequests(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  };

  const filtered = requests.filter(r =>
    [r.name, r.media, r.email, r.media_type].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [["Date","Nom","Média","Type","Rôle","Email","Téléphone","Statut"]];
    filtered.forEach(r => rows.push([
      new Date(r.created_at).toLocaleDateString("fr-FR"),
      r.name, r.media, r.media_type, r.role, r.email, r.phone || "", r.status,
    ]));
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "accreditations-presse.csv"; a.click();
  };

  return (
    <div className="admin-card bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
      <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-3" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
        <div>
          <h2 className="font-heading font-black text-xl" style={{ color: "#0f2d1f" }}>Accréditations presse</h2>
          <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>{requests.length} demande{requests.length !== 1 ? "s" : ""} · {requests.filter(r => r.status === "approuvé").length} approuvée{requests.filter(r => r.status === "approuvé").length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(15,45,31,0.30)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="text-xs pl-8 pr-3 py-2 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
          </div>
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors hover:bg-forest-50" style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm" style={{ color: "rgba(15,45,31,0.40)" }}>Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm" style={{ color: "rgba(15,45,31,0.40)" }}>{requests.length === 0 ? "Aucune demande pour le moment." : "Aucun résultat."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[750px]">
            <thead>
              <tr style={{ backgroundColor: "rgba(15,45,31,0.03)", borderBottom: "1px solid rgba(36,100,68,0.08)" }}>
                {["Date","Nom","Média","Pays","Email","Dossier","Statut","Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold uppercase tracking-wider text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const s = STATUS_STYLE[r.status] || STATUS_STYLE.nouveau;
                return (
                  <tr key={r.id} className="table-row-anim" style={{ borderBottom: "1px solid rgba(36,100,68,0.06)", animationDelay: `${i * 40}ms` }}>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(15,45,31,0.50)" }}>{new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#0f2d1f" }}>
                      <div>{r.name}</div>
                      <div className="text-[10px] font-normal" style={{ color: "rgba(15,45,31,0.45)" }}>{r.role} · {r.media_type}</div>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: "rgba(15,45,31,0.75)" }}>{r.media}</td>
                    <td className="px-4 py-3 text-[11px]" style={{ color: "rgba(15,45,31,0.55)" }}>{r.country || "—"}</td>
                    <td className="px-4 py-3"><a href={`mailto:${r.email}`} className="text-forest-600 hover:underline text-[11px]">{r.email}</a></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {r.mission_letter_url ? (
                          <a href={r.mission_letter_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded hover:opacity-80 transition-opacity" style={{ backgroundColor: "rgba(36,100,68,0.10)", color: "#246444" }}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            Mission
                          </a>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#b91c1c" }}>⚠ Lettre manquante</span>
                        )}
                        {r.press_card_url && (
                          <a href={r.press_card_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded hover:opacity-80 transition-opacity" style={{ backgroundColor: "rgba(196,154,48,0.12)", color: "#9a7320" }}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2"/></svg>
                            Carte presse
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} className="text-[10px] border rounded px-1.5 py-1 outline-none bg-white" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                        <option value="nouveau">Nouveau</option>
                        <option value="approuvé">Approuvé</option>
                        <option value="refusé">Refusé</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Section QR Codes & Pointage ──────────────────────────────────────────────
function SectionPointage() {
  const [search, setSearch] = useState("");
  const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({});
  const [checkedInAt, setCheckedInAt] = useState<Record<string, string>>({});
  const [qrModal, setQrModal] = useState<typeof PARTICIPANTS[0] | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const filtered = PARTICIPANTS.filter(p =>
    [p.nom, p.prenom, p.organisation, p.id].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckIn = (id: string) => {
    const now = new Date().toISOString();
    setCheckedIn(c => ({ ...c, [id]: true }));
    setCheckedInAt(a => ({ ...a, [id]: now }));
  };

  useEffect(() => {
    if (!qrModal || !qrCanvasRef.current) return;
    const url = `${window.location.origin}/badge/${qrModal.id}`;
    import("qrcode").then(QRCode => {
      QRCode.toCanvas(qrCanvasRef.current!, url, {
        width: 200, margin: 2,
        color: { dark: "#0f2d1f", light: "#ffffff" },
      });
    });
  }, [qrModal]);

  const presentCount = Object.values(checkedIn).filter(Boolean).length;

  return (
    <div className="space-y-5 admin-card">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Participants attendus", value: PARTICIPANTS.length, color: "#246444" },
          { label: "Présents pointés", value: presentCount, color: "#c49a30" },
          { label: "En attente", value: PARTICIPANTS.length - presentCount, color: "rgba(15,45,31,0.40)" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
            <div className="font-heading font-black text-2xl mb-1" style={{ color: s.color }}>{s.value}</div>
            <p className="text-[10px] font-medium" style={{ color: "rgba(15,45,31,0.50)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
        <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-3" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
          <h2 className="font-heading font-black text-xl" style={{ color: "#0f2d1f" }}>Contrôle d'accès & QR Codes</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(15,45,31,0.30)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, ID…" className="text-xs pl-8 pr-3 py-2 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[680px]">
            <thead>
              <tr style={{ backgroundColor: "rgba(15,45,31,0.03)", borderBottom: "1px solid rgba(36,100,68,0.08)" }}>
                {["ID","Participant","Organisation","Pass","Présence","QR / Pointer"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-bold uppercase tracking-wider text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const isIn = checkedIn[p.id];
                const inAt = checkedInAt[p.id];
                return (
                  <tr key={p.id} className="table-row-anim" style={{ borderBottom: "1px solid rgba(36,100,68,0.06)", animationDelay: `${i * 30}ms`, backgroundColor: isIn ? "rgba(36,100,68,0.025)" : undefined }}>
                    <td className="px-4 py-3 font-mono text-[10px]" style={{ color: "rgba(15,45,31,0.45)" }}>{p.id}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#0f2d1f" }}>{p.prenom} {p.nom}</td>
                    <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.65)" }}>{p.organisation}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: PASS_COLORS[p.pass] }}>
                        {p.pass}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isIn ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(36,100,68,0.10)", color: "#246444" }}>
                            <CheckCircle2 className="w-3 h-3" /> Pointé
                          </span>
                          {inAt && <p className="text-[9px] mt-0.5" style={{ color: "rgba(15,45,31,0.35)" }}>{new Date(inAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(234,179,8,0.12)", color: "#a16207" }}>
                          <Clock className="w-3 h-3" /> En attente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setQrModal(p)} className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors hover:bg-forest-50" style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>
                          QR
                        </button>
                        {!isIn && (
                          <button onClick={() => handleCheckIn(p.id)} className="text-[10px] font-semibold px-2.5 py-1.5 rounded-lg text-white transition-colors hover:opacity-80" style={{ backgroundColor: "#246444" }}>
                            Pointer ✓
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={() => setQrModal(null)}>
          <div className="bg-white rounded-2xl p-7 shadow-2xl text-center max-w-xs w-full mx-4" onClick={e => e.stopPropagation()}>
            <p className="font-heading font-black text-lg mb-0.5" style={{ color: "#0f2d1f" }}>{qrModal.prenom} {qrModal.nom}</p>
            <p className="text-xs mb-1" style={{ color: "rgba(15,45,31,0.50)" }}>{qrModal.organisation}</p>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white inline-block mb-5" style={{ backgroundColor: PASS_COLORS[qrModal.pass] }}>{qrModal.pass}</span>
            <div className="flex justify-center mb-3">
              <canvas ref={qrCanvasRef} className="rounded-xl" />
            </div>
            <p className="text-[9px] font-mono mb-4" style={{ color: "rgba(15,45,31,0.35)" }}>{qrModal.id}</p>
            <p className="text-[10px] mb-4" style={{ color: "rgba(15,45,31,0.45)" }}>Ce QR ouvre la page badge sur n'importe quel téléphone</p>
            <button onClick={() => setQrModal(null)} className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EspaceAdminPage() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const section: Record<string, React.ReactNode> = {
    overview:        <SectionOverview />,
    participants:    <SectionParticipants />,
    paiements:       <SectionPaiements />,
    pointage:        <SectionPointage />,
    programme:       <SectionProgramme />,
    communications:  <SectionCommunications />,
    intervenants:    <SectionIntervenants />,
    galerie:         <SectionGalerie />,
    articles:        <SectionArticles />,
    partenaires_cm:  <SectionPartenaires />,
    dem_partenariat: <SectionDemandesPartenariat />,
    dem_presse:      <SectionDemandePresse />,
  };

  const contentSections = ["intervenants","galerie","articles","partenaires_cm"];
  const demandeSections = ["dem_partenariat","dem_presse","pointage"];

  return (
    <div style={{ backgroundColor: "#f4f7f5", minHeight: "100vh" }}>
      <style>{`
        @keyframes admin-in { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes donut-pop { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
        @keyframes row-in { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        .admin-card { animation: admin-in 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .donut-arc { animation: donut-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .table-row-anim { animation: row-in 0.35s ease both; }
        .btn-primary { background-color:#246444; color:white; transition:background-color 0.2s,box-shadow 0.2s,transform 0.15s; }
        .btn-primary:hover { background-color:#1e5238; box-shadow:0 4px 14px rgba(36,100,68,0.35); transform:translateY(-1px); }
        .btn-primary:active { transform:translateY(0); }
      `}</style>

      <div className="w-full px-4 py-3 flex items-center gap-3" style={{ backgroundColor: "#0f2d1f", borderBottom: "1px solid rgba(196,154,48,0.20)" }}>
        <Eye className="w-4 h-4 shrink-0" style={{ color: "#c49a30" }} />
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.70)" }}>
          <span className="font-bold" style={{ color: "#c49a30" }}>Espace admin · </span>
          Données simulées pour participants/paiements/programme. Intervenants, galerie, articles et partenaires sont connectés à Supabase en temps réel.
        </p>
      </div>

      <div className="flex" style={{ minHeight: "calc(100vh - 49px)" }}>
        {mobileSidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

        <aside className={`shrink-0 flex flex-col transition-transform duration-300 fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto lg:z-auto ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          style={{ width: sidebarOpen ? 224 : 62, backgroundColor: "#0f2d1f", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {sidebarOpen && <div><p className="text-xs font-black tracking-widest uppercase" style={{ color: "#c49a30" }}>Admin</p><p className="text-[10px]" style={{ color: "rgba(255,255,255,0.30)" }}>SOAFGANG 2027</p></div>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto">
              {sidebarOpen ? <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} /> : <Menu className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} />}
            </button>
          </div>

          <nav className="flex-1 py-4 px-2 overflow-y-auto space-y-4">
            {/* Gestion événement */}
            <div>
              {sidebarOpen && <p className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 mb-2" style={{ color: "rgba(255,255,255,0.20)" }}>Gestion événement</p>}
              <div className="space-y-0.5">
                {NAV_SECTIONS.filter(n => !contentSections.includes(n.id) && !demandeSections.includes(n.id)).map(({ id, label, icon: Icon }) => {
                  const isActive = active === id;
                  return (
                    <button key={id} onClick={() => { setActive(id); setMobileSidebarOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                      style={{ backgroundColor: isActive ? "rgba(196,154,48,0.15)" : "transparent", color: isActive ? "#c49a30" : "rgba(255,255,255,0.45)" }}>
                      <Icon className="w-4 h-4 shrink-0" />
                      {sidebarOpen && <span className="text-xs font-medium flex-1">{label}</span>}
                      {sidebarOpen && isActive && <ChevronRight className="w-3 h-3" style={{ color: "#c49a30" }} />}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Demandes & accès */}
            <div>
              {sidebarOpen && <p className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 mb-2" style={{ color: "rgba(255,255,255,0.20)" }}>Demandes & Accès</p>}
              <div className="space-y-0.5">
                {NAV_SECTIONS.filter(n => demandeSections.includes(n.id)).map(({ id, label, icon: Icon }) => {
                  const isActive = active === id;
                  return (
                    <button key={id} onClick={() => { setActive(id); setMobileSidebarOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                      style={{ backgroundColor: isActive ? "rgba(196,154,48,0.15)" : "transparent", color: isActive ? "#c49a30" : "rgba(255,255,255,0.45)" }}>
                      <Icon className="w-4 h-4 shrink-0" />
                      {sidebarOpen && <span className="text-xs font-medium flex-1">{label}</span>}
                      {sidebarOpen && isActive && <ChevronRight className="w-3 h-3" style={{ color: "#c49a30" }} />}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Contenu du site */}
            <div>
              {sidebarOpen && <p className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 mb-2" style={{ color: "rgba(255,255,255,0.20)" }}>Contenu du site</p>}
              <div className="space-y-0.5">
                {NAV_SECTIONS.filter(n => contentSections.includes(n.id)).map(({ id, label, icon: Icon }) => {
                  const isActive = active === id;
                  return (
                    <button key={id} onClick={() => { setActive(id); setMobileSidebarOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                      style={{ backgroundColor: isActive ? "rgba(196,154,48,0.15)" : "transparent", color: isActive ? "#c49a30" : "rgba(255,255,255,0.45)" }}>
                      <Icon className="w-4 h-4 shrink-0" />
                      {sidebarOpen && <span className="text-xs font-medium flex-1">{label}</span>}
                      {sidebarOpen && isActive && <ChevronRight className="w-3 h-3" style={{ color: "#c49a30" }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{ background: "linear-gradient(135deg, #246444, #c49a30)", color: "white" }}>NE</div>
              {sidebarOpen && <div className="min-w-0"><p className="text-xs font-semibold truncate" style={{ color: "rgba(255,255,255,0.80)" }}>NTAB Energy</p><p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.30)" }}>Administrateur</p></div>}
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-6 py-4 bg-white border-b" style={{ borderColor: "rgba(36,100,68,0.10)" }}>
            <div className="flex items-center">
              <button className="lg:hidden mr-3 p-2 rounded-lg hover:bg-gray-50" onClick={() => setMobileSidebarOpen(true)}>
                <Menu className="w-5 h-5" style={{ color: "rgba(15,45,31,0.60)" }} />
              </button>
              <div>
                <p className="text-sm font-black" style={{ color: "#0f2d1f" }}>{NAV_SECTIONS.find(n => n.id === active)?.label}</p>
                <p className="text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>SOAFGANG 2027 · Espace Administration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <Bell className="w-4 h-4" style={{ color: "rgba(15,45,31,0.50)" }} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#c49a30" }} />
              </button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black" style={{ background: "linear-gradient(135deg, #1e5238, #0f2d1f)", color: "#c49a30" }}>NE</div>
            </div>
          </header>
          <main key={active} className="flex-1 p-4 md:p-6 overflow-auto">{section[active]}</main>
        </div>
      </div>
    </div>
  );
}
