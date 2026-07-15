"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Users, CreditCard, CalendarDays, Mail,
  Bell, ChevronRight, Search, Download, Eye,
  CheckCircle2, XCircle, Clock, TrendingUp,
  Globe, Mic, Send, Menu, X, ArrowUpRight,
  Image, Newspaper, Handshake, UserPlus, Trash2, Pencil, Upload, Plus, FileText, Settings,
} from "lucide-react";
import { supabase, type Speaker, type GalleryImage, type Article, type Partner, type Registration, type PartnershipRequest, type PressRequest } from "@/lib/supabase";

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
  { id: "parametres",        label: "Paramètres site",  icon: Settings },
  { id: "participants",      label: "Participants",      icon: Users },
  { id: "paiements",         label: "Paiements",         icon: CreditCard },
  { id: "pointage",          label: "QR & Pointage",     icon: CheckCircle2 },
  { id: "programme",         label: "Programme",         icon: CalendarDays },
  { id: "communications",    label: "Communications",    icon: Mail },
  { id: "intervenants",      label: "Intervenants",      icon: Mic },
  { id: "galerie",           label: "Galerie",           icon: Image },
  { id: "articles",          label: "Actualités",        icon: Newspaper },
  { id: "partenaires_cm",    label: "Partenaires",       icon: Handshake },
  { id: "inscriptions",      label: "Inscriptions",          icon: FileText },
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
  const [stats, setStats] = useState({ total: 0, confirmed: 0, sessions: 0, countries: 0, partnerReqs: 0, pressReqs: 0 });
  const [passBreakdown, setPassBreakdown] = useState<{ label: string; value: number; color: string }[]>([]);
  const [countryBreakdown, setCountryBreakdown] = useState<{ pays: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [regRes, sessRes, partRes, pressRes] = await Promise.all([
        supabase.from("registrations").select("status, pays, pass_type"),
        supabase.from("programme_sessions").select("id", { count: "exact", head: true }),
        supabase.from("partnership_requests").select("id", { count: "exact", head: true }).eq("status", "nouveau"),
        supabase.from("press_requests").select("id", { count: "exact", head: true }).eq("status", "nouveau"),
      ]);
      const regs = regRes.data ?? [];
      const confirmed = regs.filter(r => r.status === "confirmé").length;
      const countries = Array.from(new Set(regs.map(r => r.pays).filter(Boolean))).length;
      const passCounts: Record<string, number> = {};
      regs.forEach(r => { if (r.pass_type) passCounts[r.pass_type] = (passCounts[r.pass_type] || 0) + 1; });
      const PASS_C: Record<string, string> = { "Conférencier": "#c49a30", "Exposant": "#246444", "Professionnel": "#1e5238", "Institutionnel": "#0f2d1f" };
      setPassBreakdown(Object.entries(passCounts).map(([label, value]) => ({ label, value, color: PASS_C[label] || "#246444" })));
      const countryCounts: Record<string, number> = {};
      regs.forEach(r => { if (r.pays) countryCounts[r.pays] = (countryCounts[r.pays] || 0) + 1; });
      setCountryBreakdown(Object.entries(countryCounts).map(([pays, count]) => ({ pays, count })).sort((a,b) => b.count - a.count).slice(0, 10));
      setStats({ total: regs.length, confirmed, sessions: sessRes.count ?? 0, countries, partnerReqs: partRes.count ?? 0, pressReqs: pressRes.count ?? 0 });
      setLoading(false);
    }
    load();
  }, []);

  const maxCountry = Math.max(1, ...countryBreakdown.map(c => c.count));

  return (
    <div className="space-y-8">
      <div className="admin-card" style={{ animationDelay: "0ms" }}>
        <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Vue d'ensemble</h2>
        <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>
          {loading ? "Chargement des données…" : "Tableau de bord · données Supabase en temps réel"}
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Inscrits totaux"     rawValue={stats.total}      sub={`${stats.confirmed} confirmés`}       icon={Users}        accent="#246444" delay={0} />
        <KPICard label="Sessions au programme" rawValue={stats.sessions} sub="sur 3 jours"                           icon={CalendarDays} accent="#1e5238" delay={80} />
        <KPICard label="Pays représentés"    rawValue={stats.countries}  sub="d'inscrits"                            icon={Globe}        accent="#0f2d1f" delay={160} />
        <KPICard label="Demandes en attente" rawValue={stats.partnerReqs + stats.pressReqs} sub={`${stats.partnerReqs} part. · ${stats.pressReqs} presse`} icon={Bell} accent="#c49a30" delay={240} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "100ms" }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "#c49a30" }}>Répartition par pass</p>
          {passBreakdown.length > 0
            ? <DonutChart data={passBreakdown} />
            : <p className="text-xs text-center py-8" style={{ color: "rgba(15,45,31,0.30)" }}>Aucune inscription</p>
          }
        </div>
        <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "180ms" }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "#c49a30" }}>Inscrits par pays</p>
          {countryBreakdown.length > 0
            ? <div className="space-y-3">
                {countryBreakdown.map((c, i) => (
                  <div key={c.pays} className="flex items-center gap-3">
                    <span className="text-xs w-28 shrink-0 truncate" style={{ color: "rgba(15,45,31,0.65)" }}>{c.pays}</span>
                    <AnimBar pct={(c.count / maxCountry) * 100} color="#246444" delay={i * 50} />
                    <span className="text-xs font-semibold w-5 text-right shrink-0" style={{ color: "#0f2d1f" }}>{c.count}</span>
                  </div>
                ))}
              </div>
            : <p className="text-xs text-center py-8" style={{ color: "rgba(15,45,31,0.30)" }}>Aucune donnée</p>
          }
        </div>
      </div>
      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 admin-card" style={{ animationDelay: "260ms" }}>
        {[
          { label: "Nouvelles inscriptions",       count: stats.total,       color: "#246444" },
          { label: "Demandes partenariat à traiter", count: stats.partnerReqs, color: "#c49a30" },
          { label: "Accréditations presse",         count: stats.pressReqs,   color: "#1e5238" },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl p-4 flex items-center gap-3" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: item.color + "15" }}>
              <span className="font-heading font-black text-lg" style={{ color: item.color }}>{item.count}</span>
            </div>
            <p className="text-xs font-medium leading-tight" style={{ color: "rgba(15,45,31,0.60)" }}>{item.label}</p>
          </div>
        ))}
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

type ProgramSession = {
  id: string; day: 1 | 2 | 3; start_time: string; end_time: string;
  title_fr: string; title_en: string; description_fr: string; description_en: string;
  type: string; location: string; speakers_text: string; order_index: number; created_at: string;
};

const TYPE_COLORS: Record<string, string> = {
  "Protocole": "#c49a30", "Panel": "#246444", "Table ronde": "#1e5238",
  "Networking": "#5a9e78", "B2B": "#7c5e10",
};
const SESSION_TYPES = ["Protocole","Panel","Table ronde","Networking","B2B"];
const DAY_LABELS: Record<number, string> = { 1: "Jour 1 · 3 février 2027", 2: "Jour 2 · 4 février 2027", 3: "Jour 3 · 5 février 2027" };

const EMPTY_SESSION: Omit<ProgramSession, "id"|"created_at"> = {
  day: 1, start_time: "09:00", end_time: "10:30",
  title_fr: "", title_en: "", description_fr: "", description_en: "",
  type: "Panel", location: "Salle Plénière", speakers_text: "", order_index: 0,
};

function SectionProgramme() {
  const [sessions, setSessions] = useState<ProgramSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<ProgramSession | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_SESSION });
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("programme_sessions").select("*").order("day").order("start_time");
    if (data) setSessions(data as ProgramSession[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_SESSION, order_index: sessions.length + 1 });
    setShowForm(true);
  };

  const openEdit = (s: ProgramSession) => {
    setEditTarget(s);
    setForm({ day: s.day, start_time: s.start_time, end_time: s.end_time, title_fr: s.title_fr, title_en: s.title_en || "", description_fr: s.description_fr || "", description_en: s.description_en || "", type: s.type, location: s.location || "", speakers_text: s.speakers_text || "", order_index: s.order_index });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title_fr.trim() || !form.start_time) return;
    setSaving(true);
    if (editTarget) {
      await supabase.from("programme_sessions").update(form).eq("id", editTarget.id);
    } else {
      await supabase.from("programme_sessions").insert(form);
    }
    await load();
    setSaving(false);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await supabase.from("programme_sessions").delete().eq("id", id);
    setSessions(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
  };

  const f = (k: keyof typeof form, v: string | number) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 admin-card">
        <div>
          <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Gestion du Programme</h2>
          <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>{sessions.length} sessions · 3 jours</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl">
          <Plus className="w-3.5 h-3.5" /> Ajouter une session
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm" style={{ color: "rgba(15,45,31,0.35)" }}>Chargement…</div>
      ) : (
        [1,2,3].map(day => {
          const daySessions = sessions.filter(s => s.day === day);
          return (
            <div key={day} className="admin-card bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: "#0f2d1f" }}>
                <p className="text-sm font-bold" style={{ color: "#c49a30" }}>{DAY_LABELS[day]}</p>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{daySessions.length} session{daySessions.length !== 1 ? "s" : ""}</span>
              </div>
              {daySessions.length === 0 ? (
                <p className="px-6 py-8 text-xs text-center" style={{ color: "rgba(15,45,31,0.30)" }}>Aucune session — cliquez sur Ajouter</p>
              ) : (
                <div className="divide-y" style={{ borderColor: "rgba(36,100,68,0.07)" }}>
                  {daySessions.map(s => {
                    const tc = TYPE_COLORS[s.type] || "#246444";
                    return (
                      <div key={s.id} className="px-6 py-4 flex items-start gap-4 hover:bg-[#f9fbfa] transition-colors group">
                        <div className="shrink-0 text-center w-16">
                          <p className="text-xs font-mono font-bold" style={{ color: "#c49a30" }}>{s.start_time}</p>
                          <p className="text-[10px]" style={{ color: "rgba(15,45,31,0.30)" }}>{s.end_time}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 flex-wrap mb-1">
                            <p className="text-sm font-semibold" style={{ color: "#0f2d1f" }}>{s.title_fr}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0" style={{ backgroundColor: tc + "18", color: tc }}>{s.type}</span>
                          </div>
                          {s.speakers_text && <p className="text-[11px] flex items-center gap-1 mb-0.5" style={{ color: "rgba(15,45,31,0.50)" }}><Mic className="w-3 h-3" />{s.speakers_text}</p>}
                          {s.location && <p className="text-[11px]" style={{ color: "rgba(15,45,31,0.40)" }}>📍 {s.location}</p>}
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#246444" }} title="Modifier"><Pencil className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: "#b91c1c" }} title="Supprimer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)" }} onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(36,100,68,0.10)" }}>
              <h3 className="font-heading font-black text-lg" style={{ color: "#0f2d1f" }}>{editTarget ? "Modifier la session" : "Nouvelle session"}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4" style={{ color: "rgba(15,45,31,0.40)" }} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Jour + type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Jour</label>
                  <select value={form.day} onChange={e => f("day", Number(e.target.value) as 1|2|3)} className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                    <option value={1}>Jour 1 – 3 fév.</option>
                    <option value={2}>Jour 2 – 4 fév.</option>
                    <option value={3}>Jour 3 – 5 fév.</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Type</label>
                  <select value={form.type} onChange={e => f("type", e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                    {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              {/* Horaires */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Début</label>
                  <input type="time" value={form.start_time} onChange={e => f("start_time", e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Fin</label>
                  <input type="time" value={form.end_time} onChange={e => f("end_time", e.target.value)} className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                </div>
              </div>
              {/* Titre FR */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Titre (Français) *</label>
                <input value={form.title_fr} onChange={e => f("title_fr", e.target.value)} placeholder="Titre de la session" className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
              </div>
              {/* Titre EN */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Titre (English)</label>
                <input value={form.title_en} onChange={e => f("title_en", e.target.value)} placeholder="Session title" className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
              </div>
              {/* Lieu + intervenants */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Lieu</label>
                  <input value={form.location} onChange={e => f("location", e.target.value)} placeholder="Salle Plénière" className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Intervenants</label>
                  <input value={form.speakers_text} onChange={e => f("speakers_text", e.target.value)} placeholder="Nom 1, Nom 2…" className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                </div>
              </div>
              {/* Description FR */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Description (Français)</label>
                <textarea value={form.description_fr} onChange={e => f("description_fr", e.target.value)} rows={2} placeholder="Description de la session…" className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none resize-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
              </div>
              {/* Description EN */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Description (English)</label>
                <textarea value={form.description_en} onChange={e => f("description_en", e.target.value)} rows={2} placeholder="Session description…" className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none resize-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
              </div>
              {/* Order */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Ordre d'affichage</label>
                <input type="number" value={form.order_index} onChange={e => f("order_index", Number(e.target.value))} className="w-24 text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="text-xs font-semibold px-4 py-2.5 rounded-xl border" style={{ borderColor: "rgba(36,100,68,0.20)", color: "rgba(15,45,31,0.55)" }}>Annuler</button>
              <button onClick={handleSave} disabled={saving || !form.title_fr.trim()} className="btn-primary text-xs font-semibold px-5 py-2.5 rounded-xl disabled:opacity-50">
                {saving ? "Enregistrement…" : editTarget ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionCommunications() {
  const [tab, setTab] = useState<"compose"|"sent">("compose");
  const [subject, setSubject] = useState("Confirmation d'inscription · SOAFGN 2027");
  const [body, setBody] = useState(`Bonjour {prenom},\n\nNous avons bien reçu votre inscription au SOAFGN 2027.\n\nVotre pass : {pass}\nStatut : {statut}\n\nCordialement,\nLe Comité d'Organisation SOAFGN 2027`);
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
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [regRes, settingsRes] = await Promise.all([
      supabase.from("registrations").select("id, prenom, nom, organisation, reference, pass_type, checked_in, checked_in_at, status").order("checked_in_at", { ascending: false, nullsFirst: false }),
      supabase.from("site_settings").select("pointage_token").eq("id", "main").single(),
    ]);
    if (regRes.data) setRegistrations(regRes.data as unknown as Registration[]);
    if (settingsRes.data?.pointage_token) setToken(settingsRes.data.pointage_token);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const generateToken = async () => {
    setGenerating(true);
    const newToken = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    await supabase.from("site_settings").upsert({ id: "main", pointage_token: newToken });
    setToken(newToken);
    setGenerating(false);
  };

  const pointageUrl = token ? `${typeof window !== "undefined" ? window.location.origin : ""}/pointage/${token}` : null;

  const copyLink = () => {
    if (!pointageUrl) return;
    navigator.clipboard.writeText(pointageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = registrations.filter(r =>
    [r.nom, r.prenom, r.organisation, r.reference].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const presentCount = registrations.filter(r => r.checked_in).length;
  const total = registrations.length;

  return (
    <div className="space-y-5 admin-card">

      {/* Lien de pointage staff */}
      <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-heading font-black text-xl" style={{ color: "#0f2d1f" }}>Lien de pointage staff</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>Partagez ce lien au personnel d'accueil — scanner QR ou saisie manuelle</p>
          </div>
          {!token && (
            <button onClick={generateToken} disabled={generating} className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg btn-primary shrink-0 disabled:opacity-60">
              <Plus className="w-3.5 h-3.5" /> {generating ? "Génération…" : "Générer le lien"}
            </button>
          )}
        </div>

        {token && pointageUrl ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: "rgba(36,100,68,0.04)", border: "1px solid rgba(36,100,68,0.12)" }}>
              <p className="flex-1 text-xs font-mono truncate" style={{ color: "#0f2d1f" }}>{pointageUrl}</p>
              <button onClick={copyLink} className="shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                style={{ backgroundColor: copied ? "rgba(36,100,68,0.12)" : "#0f2d1f", color: copied ? "#246444" : "#c49a30" }}>
                {copied ? "Copié ✓" : "Copier"}
              </button>
              <a href={pointageUrl} target="_blank" rel="noreferrer" className="shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>
                Ouvrir
              </a>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>Ce lien donne accès uniquement au pointage, pas à l'administration</p>
              <button onClick={generateToken} disabled={generating} className="text-[10px] font-semibold transition-colors hover:underline" style={{ color: "rgba(15,45,31,0.40)" }}>
                {generating ? "…" : "Regénérer"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs py-4 text-center" style={{ color: "rgba(15,45,31,0.35)" }}>Aucun lien généré — cliquez sur "Générer le lien" pour créer le lien de pointage staff</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Inscrits attendus", value: total, color: "#246444" },
          { label: "Présents pointés", value: presentCount, color: "#c49a30" },
          { label: "Pas encore arrivés", value: total - presentCount, color: "rgba(15,45,31,0.40)" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
            <div className="font-heading font-black text-2xl mb-1" style={{ color: s.color }}>{s.value}</div>
            <p className="text-[10px] font-medium" style={{ color: "rgba(15,45,31,0.50)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
        <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-3" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
          <h2 className="font-heading font-black text-lg" style={{ color: "#0f2d1f" }}>Suivi des présences</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(15,45,31,0.30)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, réf…" className="text-xs pl-8 pr-3 py-2 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: "rgba(15,45,31,0.35)" }}>Chargement…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[680px]">
              <thead>
                <tr style={{ backgroundColor: "rgba(15,45,31,0.03)", borderBottom: "1px solid rgba(36,100,68,0.08)" }}>
                  {["Référence","Participant","Organisation","Pass","Présence","Heure"].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-bold uppercase tracking-wider text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className="table-row-anim" style={{ borderBottom: "1px solid rgba(36,100,68,0.06)", animationDelay: `${i * 25}ms`, backgroundColor: r.checked_in ? "rgba(36,100,68,0.02)" : undefined }}>
                    <td className="px-4 py-3 font-mono text-[10px]" style={{ color: "rgba(15,45,31,0.45)" }}>{r.reference}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#0f2d1f" }}>{r.prenom} {r.nom}</td>
                    <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.65)" }}>{r.organisation}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: (PASS_COLORS[r.pass_type as PassType] ?? "#246444") + "20", color: PASS_COLORS[r.pass_type as PassType] ?? "#246444" }}>
                        {r.pass_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.checked_in ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(36,100,68,0.10)", color: "#246444" }}>
                          <CheckCircle2 className="w-3 h-3" /> Présent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(234,179,8,0.12)", color: "#a16207" }}>
                          <Clock className="w-3 h-3" /> Attendu
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[10px]" style={{ color: "rgba(15,45,31,0.45)" }}>
                      {r.checked_in_at ? new Date(r.checked_in_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Invitation Letter Printer ────────────────────────────────────────────────
function printInvitationLetter(r: Registration) {
  const win = window.open("", "_blank");
  if (!win) return;
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  win.document.write(`<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>Lettre d'invitation – ${r.prenom} ${r.nom}</title>
<style>
  body { font-family: Georgia, serif; margin: 0; padding: 40px 60px; color: #111; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #246444; padding-bottom: 20px; margin-bottom: 32px; }
  .logo-block .title { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #0f2d1f; }
  .logo-block .sub { font-size: 11px; color: #6b7280; letter-spacing: 2px; text-transform: uppercase; }
  .ref { font-size: 11px; color: #6b7280; text-align: right; }
  h2 { font-size: 18px; color: #246444; margin: 0 0 24px; font-weight: 700; letter-spacing: 0.5px; }
  p { line-height: 1.8; margin: 0 0 16px; font-size: 13px; }
  .highlight { font-weight: bold; color: #0f2d1f; }
  .badge-box { border: 2px solid #246444; border-radius: 8px; padding: 16px 20px; margin: 28px 0; background: #f9fafb; }
  .badge-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; }
  .badge-label { color: #6b7280; }
  .badge-val { font-weight: 700; color: #0f2d1f; }
  .footer { border-top: 1px solid #d1d5db; margin-top: 60px; padding-top: 16px; font-size: 11px; color: #9ca3af; text-align: center; }
  @media print { button { display: none; } }
</style></head><body>
<div class="header">
  <div class="logo-block"><div class="title">SOAFGN 2027</div><div class="sub">Sommet Africain du Gaz Naturel</div></div>
  <div class="ref"><div>Réf. : <strong>${r.reference}</strong></div><div>Cotonou, le ${today}</div></div>
</div>
<h2>LETTRE D'INVITATION OFFICIELLE</h2>
<p>Le Comité d'Organisation du <span class="highlight">Sommet Africain du Gaz Naturel (SOAFGN 2027)</span> a l'honneur de convier :</p>
<div class="badge-box">
  <div class="badge-row"><span class="badge-label">Nom complet</span><span class="badge-val">${r.civilite} ${r.prenom} ${r.nom}</span></div>
  <div class="badge-row"><span class="badge-label">Fonction</span><span class="badge-val">${r.fonction}</span></div>
  <div class="badge-row"><span class="badge-label">Organisation</span><span class="badge-val">${r.organisation}</span></div>
  <div class="badge-row"><span class="badge-label">Pays</span><span class="badge-val">${r.pays}</span></div>
  <div class="badge-row"><span class="badge-label">Catégorie</span><span class="badge-val">${r.categorie}</span></div>
  <div class="badge-row"><span class="badge-label">Pass</span><span class="badge-val">${r.pass_type}</span></div>
  <div class="badge-row"><span class="badge-label">Réf. inscription</span><span class="badge-val">${r.reference}</span></div>
</div>
<p>à participer au <span class="highlight">1er Sommet Africain du Gaz Naturel (SOAFGN 2027)</span>, qui se tiendra les <span class="highlight">15, 16 et 17 mars 2027</span> au <span class="highlight">Palais des Congrès de Cotonou, Bénin</span>.</p>
<p>Cet événement réunira les décideurs politiques, les opérateurs énergétiques, les investisseurs et les experts du secteur gazier de la région ouest-africaine autour d'un programme de haut niveau axé sur les enjeux de transition énergétique, d'infrastructure et de financement.</p>
<p>La présente lettre vaut invitation officielle et peut être utilisée pour toutes démarches administratives nécessaires, notamment l'obtention de visa.</p>
<p style="margin-top:40px;">Nous vous prions d'agréer, ${r.civilite} ${r.nom}, l'expression de notre considération distinguée.</p>
<p style="margin-top:32px;"><strong>Le Comité d'Organisation</strong><br>SOAFGN 2027 – Cotonou, Bénin<br><em>contact@soafgang2027.org</em></p>
<div class="footer">SOAFGN 2027 · Palais des Congrès de Cotonou · contact@soafgang2027.org · Ce document est officiel et non cessible.</div>
<script>window.onload=()=>window.print();</script>
</body></html>`);
  win.document.close();
}

// ─── Section Inscriptions ─────────────────────────────────────────────────────
const PASS_OPTIONS = [
  { label: "Standard",       price: 500_000,   desc: "Accès aux conférences et expositions" },
  { label: "Professionnel",  price: 1_000_000, desc: "Standard + networking VIP" },
  { label: "Institutionnel", price: 750_000,   desc: "Pour institutions & ministères" },
  { label: "Exposant",       price: 1_500_000, desc: "Stand d'exposition inclus" },
  { label: "VIP",            price: 0,         desc: "Invitation officielle — gratuit" },
  { label: "Presse",         price: 0,         desc: "Accréditation presse" },
  { label: "Conférencier",   price: 0,         desc: "Intervenant invité — gratuit" },
];

const EMPTY_FORM = {
  civilite: "M.", nom: "", prenom: "", email: "", telephone: "", pays: "", fonction: "", organisation: "", categorie: "",
  pass_type: "Professionnel", pass_price: 1_000_000, pay_method: "Virement bancaire", needs_invitation_letter: false, status: "en_attente",
};

function SectionInscriptions() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
    if (data) setRegistrations(data as Registration[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("registrations").update({ status }).eq("id", id);
    setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: status as Registration["status"] } : r));
  };

  const openNew = () => { setForm({ ...EMPTY_FORM }); setSaveError(""); setShowForm(true); };

  const handleCreate = async () => {
    setSaveError("");
    if (!form.nom || !form.prenom || !form.email || !form.organisation || !form.pays || !form.fonction || !form.categorie) {
      setSaveError("Veuillez remplir tous les champs obligatoires."); return;
    }
    setSaving(true);
    const ref = `SOAFGN-2027-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const { error } = await supabase.from("registrations").insert({
      reference: ref,
      civilite: form.civilite, nom: form.nom, prenom: form.prenom, email: form.email,
      telephone: form.telephone, pays: form.pays, organisation: form.organisation,
      fonction: form.fonction, categorie: form.categorie, pass_type: form.pass_type,
      pass_price: form.pass_price, pay_method: form.pay_method,
      needs_invitation_letter: form.needs_invitation_letter, status: form.status,
    });
    setSaving(false);
    if (error) { setSaveError(error.message); return; }
    setShowForm(false);
    load();
    // Send confirmation email (non-blocking)
    fetch("/api/send-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prenom: form.prenom, nom: form.nom, email: form.email, reference: ref, passType: form.pass_type, organisation: form.organisation }),
    }).catch(() => {});
  };

  const filtered = registrations.filter(r =>
    [r.nom, r.prenom, r.email, r.organisation, r.reference, r.pays].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const total = registrations.length;
  const confirmed = registrations.filter(r => r.status === "confirmé").length;
  const pending = registrations.filter(r => r.status === "en_attente").length;
  const cancelled = registrations.filter(r => r.status === "annulé").length;

  const exportCSV = () => {
    const headers = ["Réf","Date","Civilité","Nom","Prénom","Fonction","Organisation","Pays","Email","Téléphone","Catégorie","Pass","Tarif","Paiement","Statut"];
    const rows = registrations.map(r => [
      r.reference, r.created_at.slice(0,10), r.civilite, r.nom, r.prenom, r.fonction,
      r.organisation, r.pays, r.email, r.telephone, r.categorie, r.pass_type,
      r.pass_price, r.pay_method, r.status,
    ]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,﻿" + encodeURIComponent(csv);
    a.download = `inscriptions-soafgang2027-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
    en_attente: { bg: "rgba(234,179,8,0.12)", text: "#a16207", label: "En attente" },
    confirmé:   { bg: "rgba(36,100,68,0.10)", text: "#246444", label: "Confirmé" },
    annulé:     { bg: "rgba(220,38,38,0.10)", text: "#b91c1c", label: "Annulé" },
  };

  return (
    <div className="space-y-5 admin-card">

      {/* Modal nouvelle inscription */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(7,24,16,0.55)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ border: "1px solid rgba(36,100,68,0.15)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(36,100,68,0.08)" }}>
              <div>
                <h3 className="font-heading font-black text-lg" style={{ color: "#0f2d1f" }}>Nouvelle inscription</h3>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>Créer une inscription manuellement (virement, invitation VIP, groupe…)</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-50 transition-colors"><X className="w-4 h-4" style={{ color: "#246444" }} /></button>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* Identité */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(15,45,31,0.40)" }}>Identité</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Civilité</label>
                    <select value={form.civilite} onChange={e => setForm(f => ({ ...f, civilite: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                      {["M.","Mme","Dr","Pr","Amb."].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Prénom *</label>
                    <input value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20"
                      style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Nom *</label>
                    <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20"
                      style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20"
                      style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Téléphone</label>
                    <input value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                      placeholder="+229..." className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20"
                      style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                  </div>
                </div>
              </div>

              {/* Professionnel */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(15,45,31,0.40)" }}>Profil professionnel</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Organisation *</label>
                    <input value={form.organisation} onChange={e => setForm(f => ({ ...f, organisation: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20"
                      style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Pays *</label>
                    <input value={form.pays} onChange={e => setForm(f => ({ ...f, pays: e.target.value }))}
                      placeholder="Bénin, Sénégal…" className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20"
                      style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Fonction *</label>
                    <input value={form.fonction} onChange={e => setForm(f => ({ ...f, fonction: e.target.value }))}
                      placeholder="Directeur Général, Consultant…" className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20"
                      style={{ borderColor: "rgba(36,100,68,0.20)" }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Catégorie *</label>
                    <select value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                      <option value="">— Choisir —</option>
                      {["Secteur privé","Secteur public","Institution internationale","ONG / Association","Académique / Chercheur","Presse / Médias","Autre"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pass */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "rgba(15,45,31,0.40)" }}>Pass & paiement</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {PASS_OPTIONS.map(p => (
                    <button key={p.label} type="button" onClick={() => setForm(f => ({ ...f, pass_type: p.label, pass_price: p.price }))}
                      className="text-left p-3 rounded-xl border-2 transition-all"
                      style={{ borderColor: form.pass_type === p.label ? "#246444" : "rgba(36,100,68,0.15)", backgroundColor: form.pass_type === p.label ? "rgba(36,100,68,0.05)" : "white" }}>
                      <p className="text-xs font-bold" style={{ color: form.pass_type === p.label ? "#0f2d1f" : "rgba(15,45,31,0.65)" }}>{p.label}</p>
                      <p className="text-[10px] font-semibold mt-0.5" style={{ color: p.price > 0 ? "#c49a30" : "#246444" }}>
                        {p.price > 0 ? fmtFCFAShort(p.price) : "Gratuit"}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Méthode de paiement</label>
                    <select value={form.pay_method} onChange={e => setForm(f => ({ ...f, pay_method: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                      {["Virement bancaire","Mobile Money","Carte bancaire","Exonéré / Invitation"].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>Statut initial</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                      <option value="en_attente">En attente</option>
                      <option value="confirmé">Confirmé</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-3 cursor-pointer">
                  <input type="checkbox" checked={form.needs_invitation_letter} onChange={e => setForm(f => ({ ...f, needs_invitation_letter: e.target.checked }))} />
                  <span className="text-xs font-medium" style={{ color: "#0f2d1f" }}>Nécessite une lettre d'invitation officielle</span>
                </label>
              </div>

              {saveError && <p className="text-xs font-medium px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(220,38,38,0.08)", color: "#b91c1c" }}>{saveError}</p>}

              <div className="flex gap-3 pt-1 pb-1">
                <button onClick={handleCreate} disabled={saving}
                  className="inline-flex items-center gap-2 text-xs font-semibold px-6 py-2.5 rounded-xl btn-primary disabled:opacity-60">
                  {saving ? "Enregistrement…" : <><Plus className="w-3.5 h-3.5" /> Créer l'inscription</>}
                </button>
                <button onClick={() => setShowForm(false)} className="text-xs font-medium px-4 py-2.5 rounded-xl border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total inscriptions", value: total, color: "#246444" },
          { label: "Confirmées", value: confirmed, color: "#246444" },
          { label: "En attente", value: pending, color: "#a16207" },
          { label: "Annulées", value: cancelled, color: "#b91c1c" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
            <div className="font-heading font-black text-2xl mb-1" style={{ color: s.color }}>{s.value}</div>
            <p className="text-[10px] font-medium" style={{ color: "rgba(15,45,31,0.50)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
        <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-3" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
          <h2 className="font-heading font-black text-xl" style={{ color: "#0f2d1f" }}>Inscriptions</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "rgba(15,45,31,0.30)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, email, réf…" className="text-xs pl-8 pr-3 py-2 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
            </div>
            <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button onClick={openNew} className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg btn-primary">
              <Plus className="w-3.5 h-3.5" /> Nouvelle inscription
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm" style={{ color: "rgba(15,45,31,0.35)" }}>Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm" style={{ color: "rgba(15,45,31,0.35)" }}>
            {registrations.length === 0 ? "Aucune inscription reçue pour l'instant." : "Aucun résultat pour cette recherche."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[900px]">
              <thead>
                <tr style={{ backgroundColor: "rgba(15,45,31,0.03)", borderBottom: "1px solid rgba(36,100,68,0.08)" }}>
                  {["Réf","Date","Participant","Organisation","Pays","Pass","Paiement","Statut","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-bold uppercase tracking-wider text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const s = STATUS_STYLE[r.status] ?? STATUS_STYLE.en_attente;
                  return (
                    <tr key={r.id} className="table-row-anim" style={{ borderBottom: "1px solid rgba(36,100,68,0.06)", animationDelay: `${i * 25}ms` }}>
                      <td className="px-4 py-3 font-mono text-[10px]" style={{ color: "rgba(15,45,31,0.45)" }}>{r.reference}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(15,45,31,0.55)" }}>{r.created_at?.slice(0,10)}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold" style={{ color: "#0f2d1f" }}>{r.civilite} {r.prenom} {r.nom}</p>
                        <p className="text-[10px]" style={{ color: "rgba(15,45,31,0.45)" }}>{r.email}</p>
                        <p className="text-[10px]" style={{ color: "rgba(15,45,31,0.35)" }}>{r.fonction}</p>
                      </td>
                      <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.65)" }}>{r.organisation}</td>
                      <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.65)" }}>{r.pays}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[10px]" style={{ color: "#0f2d1f" }}>{r.pass_type}</p>
                        <p className="text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>{r.pass_price}</p>
                      </td>
                      <td className="px-4 py-3 text-[10px]" style={{ color: "rgba(15,45,31,0.55)" }}>{r.pay_method}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)} className="text-[10px] border rounded px-1.5 py-1 outline-none bg-white" style={{ borderColor: "rgba(36,100,68,0.20)" }}>
                            <option value="en_attente">En attente</option>
                            <option value="confirmé">Confirmé</option>
                            <option value="annulé">Annulé</option>
                          </select>
                          <button onClick={() => printInvitationLetter(r)} title="Lettre d'invitation" className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors" style={{ color: "#c49a30", border: "1px solid rgba(196,154,48,0.30)" }}>
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section Paramètres du site ──────────────────────────────────────────────
type SiteSettings = {
  event_date: string;
  event_location: string;
  stat_participants: string;
  stat_countries: string;
  stat_sessions: string;
  banner_active: boolean;
  banner_text: string;
  banner_type: "info" | "warning" | "success";
  registrations_open: boolean;
};

const DEFAULT_SETTINGS: SiteSettings = {
  event_date: "3–5 Février 2027",
  event_location: "Cotonou, Bénin",
  stat_participants: "500+",
  stat_countries: "15",
  stat_sessions: "20+",
  banner_active: false,
  banner_text: "",
  banner_type: "info",
  registrations_open: true,
};

function SectionParametres() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", "main").single()
      .then(({ data }) => {
        if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
        setLoading(false);
      });
  }, []);

  const s = (k: keyof SiteSettings, v: string | boolean) =>
    setSettings(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("site_settings").upsert({ id: "main", ...settings });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const BANNER_COLORS = {
    info:    { bg: "rgba(36,100,68,0.10)",  text: "#246444",  label: "Info (vert)" },
    warning: { bg: "rgba(196,154,48,0.12)", text: "#9a7320",  label: "Alerte (or)" },
    success: { bg: "rgba(30,82,56,0.10)",   text: "#1e5238",  label: "Succès (forêt)" },
  };

  if (loading) return <div className="py-16 text-center text-sm" style={{ color: "rgba(15,45,31,0.35)" }}>Chargement…</div>;

  return (
    <div className="space-y-6 admin-card">
      {/* Bannière d'alerte */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
          <div>
            <h3 className="font-heading font-black text-base" style={{ color: "#0f2d1f" }}>Bannière d'alerte</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>Affichée sur toutes les pages du site si activée</p>
          </div>
          {/* Toggle */}
          <button onClick={() => s("banner_active", !settings.banner_active)}
            className="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0"
            style={{ backgroundColor: settings.banner_active ? "#246444" : "rgba(15,45,31,0.15)" }}>
            <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
              style={{ transform: settings.banner_active ? "translateX(24px)" : "translateX(0)" }} />
          </button>
        </div>
        {/* Preview */}
        {settings.banner_active && settings.banner_text && (
          <div className="px-6 py-3 text-xs font-semibold" style={{ backgroundColor: BANNER_COLORS[settings.banner_type].bg, color: BANNER_COLORS[settings.banner_type].text }}>
            📢 {settings.banner_text}
          </div>
        )}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Message</label>
            <input value={settings.banner_text} onChange={e => s("banner_text", e.target.value)}
              placeholder="Ex : Les inscriptions ferment le 31 janvier 2027."
              className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wide block mb-2" style={{ color: "rgba(15,45,31,0.45)" }}>Style</label>
            <div className="flex gap-2 flex-wrap">
              {(["info","warning","success"] as const).map(t => (
                <button key={t} onClick={() => s("banner_type", t)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold border-2 transition-all"
                  style={{
                    backgroundColor: BANNER_COLORS[t].bg,
                    color: BANNER_COLORS[t].text,
                    borderColor: settings.banner_type === t ? BANNER_COLORS[t].text : "transparent",
                  }}>
                  {BANNER_COLORS[t].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Infos de l'événement */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
          <h3 className="font-heading font-black text-base" style={{ color: "#0f2d1f" }}>Informations de l'événement</h3>
          <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>Affichées dans le header et la page d'accueil</p>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          {([
            { key: "event_date",     label: "Date de l'événement",  placeholder: "3–5 Février 2027" },
            { key: "event_location", label: "Lieu",                  placeholder: "Cotonou, Bénin" },
          ] as const).map(f => (
            <div key={f.key}>
              <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>{f.label}</label>
              <input value={settings[f.key]} onChange={e => s(f.key, e.target.value)} placeholder={f.placeholder}
                className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Compteurs home */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
          <h3 className="font-heading font-black text-base" style={{ color: "#0f2d1f" }}>Compteurs page d'accueil</h3>
          <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>Chiffres clés affichés dans la section hero</p>
        </div>
        <div className="p-6 grid sm:grid-cols-3 gap-4">
          {([
            { key: "stat_participants", label: "Participants attendus", placeholder: "500+" },
            { key: "stat_countries",    label: "Pays représentés",      placeholder: "15" },
            { key: "stat_sessions",     label: "Sessions / ateliers",   placeholder: "20+" },
          ] as const).map(f => (
            <div key={f.key}>
              <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>{f.label}</label>
              <input value={settings[f.key]} onChange={e => s(f.key, e.target.value)} placeholder={f.placeholder}
                className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none font-mono" style={{ borderColor: "rgba(36,100,68,0.20)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Inscriptions ouvertes */}
      <div className="bg-white rounded-2xl p-6 flex items-center justify-between gap-4" style={{ border: "1px solid rgba(36,100,68,0.10)" }}>
        <div>
          <p className="text-sm font-bold" style={{ color: "#0f2d1f" }}>Inscriptions ouvertes</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>Si désactivé, le bouton S'inscrire mène vers une page "bientôt disponible"</p>
        </div>
        <button onClick={() => s("registrations_open", !settings.registrations_open)}
          className="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0"
          style={{ backgroundColor: settings.registrations_open ? "#246444" : "rgba(15,45,31,0.15)" }}>
          <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
            style={{ transform: settings.registrations_open ? "translateX(24px)" : "translateX(0)" }} />
        </button>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="btn-primary text-sm font-bold px-6 py-3 rounded-xl disabled:opacity-60 inline-flex items-center gap-2">
          {saving ? "Enregistrement…" : saved ? "✓ Enregistré !" : "Enregistrer les paramètres"}
        </button>
        {saved && <span className="text-xs" style={{ color: "#246444" }}>Les modifications seront visibles après redéploiement ou rechargement.</span>}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EspaceAdminPage() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [badges, setBadges] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchBadges() {
      const [insRes, partRes, pressRes] = await Promise.all([
        supabase.from("registrations").select("id", { count: "exact", head: true }).eq("status", "en_attente"),
        supabase.from("partnership_requests").select("id", { count: "exact", head: true }).eq("status", "nouveau"),
        supabase.from("press_requests").select("id", { count: "exact", head: true }).eq("status", "nouveau"),
      ]);
      setBadges({
        inscriptions:    insRes.count ?? 0,
        dem_partenariat: partRes.count ?? 0,
        dem_presse:      pressRes.count ?? 0,
      });
    }
    fetchBadges();
  }, []);

  const section: Record<string, React.ReactNode> = {
    overview:        <SectionOverview />,
    parametres:      <SectionParametres />,
    participants:    <SectionParticipants />,
    paiements:       <SectionPaiements />,
    pointage:        <SectionPointage />,
    programme:       <SectionProgramme />,
    communications:  <SectionCommunications />,
    intervenants:    <SectionIntervenants />,
    galerie:         <SectionGalerie />,
    articles:        <SectionArticles />,
    partenaires_cm:  <SectionPartenaires />,
    inscriptions:    <SectionInscriptions />,
    dem_partenariat: <SectionDemandesPartenariat />,
    dem_presse:      <SectionDemandePresse />,
  };

  const contentSections = ["intervenants","galerie","articles","partenaires_cm"];
  const demandeSections = ["inscriptions","dem_partenariat","dem_presse","pointage"];

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


      <div className="flex" style={{ minHeight: "calc(100vh - 49px)" }}>
        {mobileSidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

        <aside className={`shrink-0 flex flex-col transition-transform duration-300 fixed inset-y-0 left-0 z-50 lg:relative lg:inset-auto lg:z-auto ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          style={{ width: sidebarOpen ? 224 : 62, backgroundColor: "#0f2d1f", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {sidebarOpen && <div><p className="text-xs font-black tracking-widest uppercase" style={{ color: "#c49a30" }}>Admin</p><p className="text-[10px]" style={{ color: "rgba(255,255,255,0.30)" }}>SOAFGN 2027</p></div>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto">
              {sidebarOpen ? <X className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} /> : <Menu className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} />}
            </button>
          </div>

          <nav className="flex-1 py-4 px-2 overflow-y-auto space-y-4">
            {([
              { label: "Gestion événement", ids: NAV_SECTIONS.filter(n => !contentSections.includes(n.id) && !demandeSections.includes(n.id)) },
              { label: "Demandes & Accès",  ids: NAV_SECTIONS.filter(n => demandeSections.includes(n.id)) },
              { label: "Contenu du site",   ids: NAV_SECTIONS.filter(n => contentSections.includes(n.id)) },
            ] as const).map(group => (
              <div key={group.label}>
                {sidebarOpen && <p className="text-[9px] font-bold uppercase tracking-[0.2em] px-3 mb-2" style={{ color: "rgba(255,255,255,0.20)" }}>{group.label}</p>}
                <div className="space-y-0.5">
                  {group.ids.map(({ id, label, icon: Icon }) => {
                    const isActive = active === id;
                    const badge = badges[id] ?? 0;
                    return (
                      <button key={id} onClick={() => { setActive(id); setMobileSidebarOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                        style={{ backgroundColor: isActive ? "rgba(196,154,48,0.15)" : "transparent", color: isActive ? "#c49a30" : "rgba(255,255,255,0.45)" }}>
                        <div className="relative shrink-0">
                          <Icon className="w-4 h-4" />
                          {badge > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 rounded-full text-[9px] font-black flex items-center justify-center leading-none"
                              style={{ backgroundColor: "#c49a30", color: "#0f2d1f" }}>
                              {badge > 99 ? "99+" : badge}
                            </span>
                          )}
                        </div>
                        {sidebarOpen && <span className="text-xs font-medium flex-1">{label}</span>}
                        {sidebarOpen && isActive && <ChevronRight className="w-3 h-3" style={{ color: "#c49a30" }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
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
                <p className="text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>SOAFGN 2027 · Espace Administration</p>
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
