"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, CreditCard, CalendarDays, Mail,
  Bell, ChevronRight, Search, Download, Eye,
  CheckCircle2, XCircle, Clock, TrendingUp,
  Globe, Mic, Send, Menu, X, ArrowUpRight,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Statut = "confirmé" | "en attente" | "annulé" | "VIP";
type PassType = "Conférencier" | "Exposant" | "Professionnel" | "Institutionnel";
type PayMethod = "Virement bancaire" | "Mobile Money" | "Carte bancaire";

interface Participant {
  id: string; nom: string; prenom: string; email: string;
  organisation: string; pays: string; pass: PassType;
  statut: Statut; montant: number; methode: PayMethod; date: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
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
  { id: "P011", nom: "Agbodjan",  prenom: "Kossi",     email: "k.agbodjan@ceet.tg",         organisation: "CEET Togo",            pays: "Togo",          pass: "Institutionnel",statut: "confirmé",   montant: 750_000,   methode: "Virement bancaire", date: "2026-12-03" },
  { id: "P012", nom: "Hounkpatin",prenom: "Séraphine", email: "s.hounkpatin@sogbee.bj",    organisation: "SOGBEE Bénin",         pays: "Bénin",         pass: "Professionnel", statut: "annulé",     montant: 1_000_000, methode: "Carte bancaire",    date: "2026-12-05" },
  { id: "P013", nom: "Sylla",     prenom: "Boubacar",  email: "b.sylla@minmines.gn",        organisation: "Min. Mines Guinée",    pays: "Guinée",        pass: "Institutionnel",statut: "en attente", montant: 750_000,   methode: "Mobile Money",      date: "2026-12-08" },
  { id: "P014", nom: "Dembélé",   prenom: "Oumar",     email: "o.dembele@gazmali.ml",       organisation: "GazMali S.A.",         pays: "Mali",          pass: "Exposant",      statut: "confirmé",   montant: 1_500_000, methode: "Virement bancaire", date: "2026-12-10" },
  { id: "P015", nom: "Fofana",    prenom: "Aminata",   email: "a.fofana@worldbank.org",     organisation: "Banque Mondiale",      pays: "International", pass: "Conférencier",  statut: "VIP",        montant: 0,         methode: "Virement bancaire", date: "2026-12-12" },
];

const SESSIONS = [
  { id: "S01", titre: "Cérémonie d'ouverture officielle",   jour: "J1", heure: "09:00", type: "Plénière",    statut: "Confirmé",   intervenant: "Présidence Bénin" },
  { id: "S02", titre: "Panorama gazier de l'espace UEMOA",  jour: "J1", heure: "10:30", type: "Conférence",  statut: "Confirmé",   intervenant: "BCEAO / UEMOA" },
  { id: "S03", titre: "Infrastructure & pipeline régionaux", jour: "J1", heure: "14:00", type: "Panel",       statut: "En cours",   intervenant: "TotalEnergies + 3" },
  { id: "S04", titre: "Financement de projets gaziers",      jour: "J1", heure: "16:00", type: "Workshop",    statut: "Confirmé",   intervenant: "BAD / BM / IFC" },
  { id: "S05", titre: "Transition énergétique & gaz naturel",jour: "J2", heure: "09:00", type: "Conférence",  statut: "Confirmé",   intervenant: "IRENA" },
  { id: "S06", titre: "Cadres réglementaires nationaux",     jour: "J2", heure: "11:00", type: "Panel",       statut: "En attente", intervenant: "Ministères ×5" },
  { id: "S07", titre: "Table ronde investisseurs privés",    jour: "J2", heure: "14:30", type: "Table ronde", statut: "Confirmé",   intervenant: "CEOs secteur privé" },
  { id: "S08", titre: "Visite technique — Port de Cotonou",  jour: "J2", heure: "16:30", type: "Terrain",     statut: "En cours",   intervenant: "PAC Bénin" },
  { id: "S09", titre: "Résolutions & clôture",               jour: "J3", heure: "10:00", type: "Plénière",    statut: "Confirmé",   intervenant: "Comité organisateur" },
];

const TIMELINE = [3, 5, 7, 4, 9, 12, 15, 11, 18, 22, 20, 25, 30, 28, 35, 40, 38, 45];

const PAYS_DATA = [
  { pays: "Sénégal", count: 42 }, { pays: "Côte d'Ivoire", count: 38 },
  { pays: "Bénin", count: 35 },   { pays: "Burkina Faso", count: 28 },
  { pays: "Mali", count: 24 },    { pays: "Ghana", count: 21 },
  { pays: "Guinée", count: 18 },  { pays: "Togo", count: 15 },
  { pays: "International", count: 31 },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUT_STYLE: Record<Statut, { bg: string; text: string; icon: React.ReactNode }> = {
  "confirmé":   { bg: "rgba(36,100,68,0.10)",  text: "#246444", icon: <CheckCircle2 className="w-3 h-3" /> },
  "VIP":        { bg: "rgba(196,154,48,0.15)", text: "#b8890a", icon: <CheckCircle2 className="w-3 h-3" /> },
  "en attente": { bg: "rgba(234,179,8,0.12)",  text: "#a16207", icon: <Clock className="w-3 h-3" /> },
  "annulé":     { bg: "rgba(220,38,38,0.10)",  text: "#b91c1c", icon: <XCircle className="w-3 h-3" /> },
};

const PASS_COLORS: Record<PassType, string> = {
  "Conférencier":   "#c49a30",
  "Exposant":       "#246444",
  "Professionnel":  "#1e5238",
  "Institutionnel": "#0f2d1f",
};

const NAV_SECTIONS = [
  { id: "overview",       label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "participants",   label: "Participants",    icon: Users },
  { id: "paiements",      label: "Paiements",       icon: CreditCard },
  { id: "programme",      label: "Programme",       icon: CalendarDays },
  { id: "communications", label: "Communications",  icon: Mail },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtFCFA(n: number) {
  return n.toLocaleString("fr-FR") + " FCFA";
}
function fmtFCFAShort(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0","") + " M FCFA";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + " k FCFA";
  return n + " FCFA";
}

// ─── Animated counter ─────────────────────────────────────────────────────────
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
          const ease = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(ease * target));
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

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ label, value, rawValue, sub, icon: Icon, accent, delay = 0, isMoney = false }: {
  label: string; value?: string; rawValue?: number; sub: string;
  icon: React.ElementType; accent: string; delay?: number; isMoney?: boolean;
}) {
  const { value: counted, ref } = useCounter(rawValue ?? 0, 1100);
  const display = rawValue !== undefined
    ? (isMoney ? fmtFCFAShort(counted) : counted.toLocaleString("fr-FR"))
    : value ?? "";

  return (
    <div ref={ref}
      className="admin-card bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-4"
      style={{ animationDelay: `${delay}ms` }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300"
        style={{ backgroundColor: accent + "18" }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium mb-1" style={{ color: "rgba(15,45,31,0.45)" }}>{label}</p>
        <p className="font-heading font-black text-2xl leading-none tabular-nums" style={{ color: "#0f2d1f" }}>
          {display}
        </p>
        <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "rgba(15,45,31,0.40)" }}>
          <ArrowUpRight className="w-3 h-3" style={{ color: accent }} />{sub}
        </p>
      </div>
    </div>
  );
}

// ─── SVG Bar Chart with animated bars ────────────────────────────────────────
function SVGBarChart({ data }: { data: number[] }) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setRevealed(true); obs.disconnect(); }
    }, { threshold: 0.2 });
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
          const isLast = i === data.length - 1;
          return (
            <g key={i}>
              <rect x={x} y={revealed ? y : h - 4} width={barW}
                height={revealed ? barH : 0} rx={3}
                fill={isLast ? "#c49a30" : "#246444"} opacity={0.85}
                style={{ transition: `y 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 30}ms, height 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 30}ms` }} />
              {i % 3 === 0 && (
                <text x={x + barW / 2} y={h} textAnchor="middle"
                  fontSize={7} fill="rgba(15,45,31,0.35)">{i + 1}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  const r = 44, cx = 60, cy = 60, stroke = 18;
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
        {arcs.map((a, i) => (
          <path key={i} d={a.path} fill={a.color} opacity={0.88}
            className="donut-arc" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
        <circle cx={cx} cy={cy} r={r - stroke} fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={11} fontWeight="700" fill="#0f2d1f">{total}</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize={7} fill="rgba(15,45,31,0.45)">participants</text>
      </svg>
      <div className="flex flex-col gap-2">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: a.color }} />
            <span className="text-xs" style={{ color: "rgba(15,45,31,0.65)" }}>
              {a.label} <span className="font-semibold" style={{ color: "#0f2d1f" }}>{a.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Animated progress bar ────────────────────────────────────────────────────
function AnimBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setW(pct), delay);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref} className="h-2 rounded-full" style={{ backgroundColor: "rgba(36,100,68,0.08)" }}>
      <div className="h-2 rounded-full" style={{ width: `${w}%`, backgroundColor: color, transition: "width 0.8s cubic-bezier(0.34,1.2,0.64,1)" }} />
    </div>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────
function SectionOverview() {
  const confirmed = PARTICIPANTS.filter(p => p.statut === "confirmé" || p.statut === "VIP").length;
  const revenue   = PARTICIPANTS.filter(p => p.statut !== "annulé").reduce((a, p) => a + p.montant, 0);
  const passBreakdown = (["Conférencier","Exposant","Professionnel","Institutionnel"] as PassType[]).map(p => ({
    label: p, value: PARTICIPANTS.filter(x => x.pass === p).length, color: PASS_COLORS[p],
  }));

  return (
    <div className="space-y-8">
      <div className="admin-card" style={{ animationDelay: "0ms" }}>
        <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Vue d'ensemble</h2>
        <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>Tableau de bord — données simulées</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Inscrits totaux"    rawValue={PARTICIPANTS.length} sub={`${confirmed} confirmés`}     icon={Users}       accent="#246444" delay={0} />
        <KPICard label="Revenus générés"    rawValue={revenue}             sub="hors conférenciers"            icon={TrendingUp}  accent="#c49a30" delay={80}  isMoney />
        <KPICard label="Sessions planifiées" rawValue={SESSIONS.length}    sub="sur 3 jours"                  icon={CalendarDays} accent="#1e5238" delay={160} />
        <KPICard label="Pays représentés"   rawValue={PAYS_DATA.length}    sub="dont 1 international"         icon={Globe}       accent="#0f2d1f" delay={240} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "100ms" }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "#c49a30" }}>Inscriptions / jour (J1–J18)</p>
          <SVGBarChart data={TIMELINE} />
          <p className="text-[10px] mt-2" style={{ color: "rgba(15,45,31,0.35)" }}>Barre dorée = dernier jour enregistré</p>
        </div>
        <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "180ms" }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "#c49a30" }}>Répartition par pass</p>
          <DonutChart data={passBreakdown} />
        </div>
      </div>

      <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "240ms" }}>
        <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "#c49a30" }}>Participants par pays</p>
        <div className="space-y-3">
          {[...PAYS_DATA].sort((a,b) => b.count - a.count).map((p, i) => {
            const pct = (p.count / Math.max(...PAYS_DATA.map(x => x.count))) * 100;
            return (
              <div key={p.pays} className="flex items-center gap-3">
                <span className="text-xs w-28 shrink-0" style={{ color: "rgba(15,45,31,0.65)" }}>{p.pays}</span>
                <AnimBar pct={pct} color="#246444" delay={i * 60} />
                <span className="text-xs font-semibold w-6 text-right" style={{ color: "#0f2d1f" }}>{p.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SectionParticipants() {
  const [search, setSearch]           = useState("");
  const [filterStatut, setFilterStatut] = useState<Statut | "">("");
  const [filterPays, setFilterPays]   = useState("");

  const filtered = useMemo(() => PARTICIPANTS.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.nom.toLowerCase().includes(q) || p.prenom.toLowerCase().includes(q)
      || p.email.toLowerCase().includes(q) || p.organisation.toLowerCase().includes(q);
    return matchQ && (!filterStatut || p.statut === filterStatut) && (!filterPays || p.pays === filterPays);
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
          className="text-xs px-3 py-2.5 rounded-lg border outline-none"
          style={{ borderColor: "rgba(36,100,68,0.20)", backgroundColor: "white", color: "#0f2d1f" }}>
          <option value="">Tous les statuts</option>
          {(["confirmé","en attente","annulé","VIP"] as Statut[]).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterPays} onChange={e => setFilterPays(e.target.value)}
          className="text-xs px-3 py-2.5 rounded-lg border outline-none"
          style={{ borderColor: "rgba(36,100,68,0.20)", backgroundColor: "white", color: "#0f2d1f" }}>
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
                    <td className="px-4 py-3">
                      <div className="font-semibold" style={{ color: "#0f2d1f" }}>{p.prenom} {p.nom}</div>
                      <div style={{ color: "rgba(15,45,31,0.45)" }}>{p.email}</div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.65)" }}>{p.organisation}</td>
                    <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.65)" }}>{p.pays}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[10px]"
                        style={{ backgroundColor: PASS_COLORS[p.pass] + "15", color: PASS_COLORS[p.pass] }}>{p.pass}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-[10px]"
                        style={{ backgroundColor: s.bg, color: s.text }}>{s.icon}{p.statut}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums" style={{ color: p.montant ? "#0f2d1f" : "rgba(15,45,31,0.30)" }}>
                      {p.montant ? fmtFCFA(p.montant) : "—"}
                    </td>
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
  const passes: PassType[]    = ["Conférencier","Exposant","Professionnel","Institutionnel"];
  const tarifs: Record<PassType, number> = { "Conférencier": 0, "Exposant": 1_500_000, "Professionnel": 1_000_000, "Institutionnel": 750_000 };
  const methods: PayMethod[]  = ["Virement bancaire","Mobile Money","Carte bancaire"];

  const totalRevenue = PARTICIPANTS.filter(p => p.statut !== "annulé").reduce((a, p) => a + p.montant, 0);
  const pending      = PARTICIPANTS.filter(p => p.statut === "en attente").reduce((a, p) => a + p.montant, 0);

  return (
    <div className="space-y-6">
      <div className="admin-card" style={{ animationDelay: "0ms" }}>
        <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Paiements & Revenus</h2>
        <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>Analyse financière en FCFA — données simulées</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard label="Revenus confirmés" rawValue={totalRevenue} sub="paiements reçus"      icon={TrendingUp}  accent="#246444" delay={0}   isMoney />
        <KPICard label="En attente"        rawValue={pending}      sub="à encaisser"           icon={Clock}       accent="#c49a30" delay={80}  isMoney />
        <KPICard label="Taux de conversion" value="80%"            sub="inscrits confirmés"    icon={CheckCircle2} accent="#1e5238" delay={160} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6" style={{ animationDelay: "80ms" }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-5" style={{ color: "#c49a30" }}>Revenus par type de pass</p>
          <div className="space-y-5">
            {passes.filter(p => tarifs[p] > 0).map((pass, i) => {
              const count = PARTICIPANTS.filter(x => x.pass === pass && x.statut !== "annulé").length;
              const rev   = count * tarifs[pass];
              const pct   = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
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
              const pct   = (count / PARTICIPANTS.length) * 100;
              return (
                <div key={m} className="flex items-center gap-3">
                  <span className="text-xs w-36 shrink-0" style={{ color: "rgba(15,45,31,0.65)" }}>{m}</span>
                  <AnimBar pct={pct} color="#246444" delay={i * 100} />
                  <span className="text-xs font-semibold w-6 text-right" style={{ color: "#0f2d1f" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="admin-card bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ animationDelay: "240ms" }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(36,100,68,0.08)" }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: "#c49a30" }}>Dernières transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: "#f4f7f5" }}>
                {["Participant","Pass","Montant","Méthode","Statut","Date"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "rgba(15,45,31,0.50)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...PARTICIPANTS].sort((a,b) => b.date.localeCompare(a.date)).slice(0,8).map((p, i) => {
                const s = STATUT_STYLE[p.statut];
                return (
                  <tr key={p.id} className="table-row-anim hover:bg-[#f9fbfa] transition-colors"
                    style={{ borderTop: i > 0 ? "1px solid rgba(36,100,68,0.07)" : undefined, animationDelay: `${i * 40}ms` }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "#0f2d1f" }}>{p.prenom} {p.nom}</td>
                    <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.65)" }}>{p.pass}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums" style={{ color: p.montant ? "#0f2d1f" : "rgba(15,45,31,0.35)" }}>
                      {p.montant ? fmtFCFAShort(p.montant) : "Gratuit"}
                    </td>
                    <td className="px-4 py-3" style={{ color: "rgba(15,45,31,0.55)" }}>{p.methode}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-[10px]"
                        style={{ backgroundColor: s.bg, color: s.text }}>{s.icon}{p.statut}</span>
                    </td>
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

function SectionProgramme() {
  const typeColors: Record<string, string> = {
    "Plénière": "#246444", "Conférence": "#1e5238", "Panel": "#c49a30",
    "Workshop": "#0f2d1f", "Table ronde": "#7c5e10", "Terrain": "#4a7c59",
  };
  const statutColors: Record<string, { bg: string; text: string }> = {
    "Confirmé":   { bg: "rgba(36,100,68,0.10)",  text: "#246444" },
    "En cours":   { bg: "rgba(196,154,48,0.12)", text: "#b8890a" },
    "En attente": { bg: "rgba(234,179,8,0.10)",  text: "#a16207" },
  };
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap admin-card" style={{ animationDelay: "0ms" }}>
        <div>
          <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Gestion du Programme</h2>
          <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>{SESSIONS.length} sessions sur 3 jours</p>
        </div>
        <button className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border transition-colors hover:bg-[#f4f7f5]"
          style={{ borderColor: "rgba(36,100,68,0.25)", color: "#246444" }}>
          + Ajouter une session
        </button>
      </div>

      {["J1","J2","J3"].map((jour, ji) => (
        <div key={jour} className="admin-card bg-white rounded-2xl border border-gray-100 overflow-hidden"
          style={{ animationDelay: `${60 + ji * 80}ms` }}>
          <div className="px-6 py-4" style={{ backgroundColor: "#0f2d1f" }}>
            <p className="text-sm font-bold" style={{ color: "#c49a30" }}>
              {jour === "J1" ? "Jour 1 — 3 février 2027" : jour === "J2" ? "Jour 2 — 4 février 2027" : "Jour 3 — 5 février 2027"}
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(36,100,68,0.07)" }}>
            {SESSIONS.filter(s => s.jour === jour).map((session, i) => {
              const sc = statutColors[session.statut] || statutColors["En attente"];
              const tc = typeColors[session.type]  || "#246444";
              return (
                <div key={session.id}
                  className="px-6 py-4 flex items-start gap-4 hover:bg-[#f9fbfa] transition-colors group">
                  <span className="text-xs font-mono font-bold shrink-0 pt-0.5 w-10 group-hover:text-[#c49a30] transition-colors"
                    style={{ color: "#c49a30" }}>{session.heure}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <p className="text-sm font-semibold" style={{ color: "#0f2d1f" }}>{session.titre}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0"
                        style={{ backgroundColor: tc + "15", color: tc }}>{session.type}</span>
                    </div>
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "rgba(15,45,31,0.50)" }}>
                      <Mic className="w-3 h-3" />{session.intervenant}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium shrink-0"
                    style={{ backgroundColor: sc.bg, color: sc.text }}>{session.statut}</span>
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
  const [tab, setTab]       = useState<"compose"|"sent">("compose");
  const [subject, setSubject] = useState("Confirmation d'inscription — SOAFGANG 2027");
  const [body, setBody]     = useState(`Bonjour {prenom},

Nous avons bien reçu votre inscription au Salon Ouest Africain Francophone sur le Gaz Naturel (SOAFGANG), 1ère édition, qui se tiendra du 3 au 5 février 2027 au Sofitel Cotonou Marina, Bénin.

Votre pass : {pass}
Statut : {statut}

Nous vous ferons parvenir prochainement les détails pratiques (programme complet, accès, hébergement partenaires).

Cordialement,
Le Comité d'Organisation SOAFGANG 2027`);

  const quickActions = [
    { label: "Relance paiements en attente", count: 3, color: "#c49a30" },
    { label: "Rappel logistique VIP",         count: 4, color: "#246444" },
    { label: "Confirmation programme J1",     count: 12, color: "#1e5238" },
    { label: "Convocation intervenants",      count: 5, color: "#0f2d1f" },
  ];

  return (
    <div className="space-y-6">
      <div className="admin-card" style={{ animationDelay: "0ms" }}>
        <h2 className="font-heading font-black text-xl mb-0.5" style={{ color: "#0f2d1f" }}>Communications</h2>
        <p className="text-xs" style={{ color: "rgba(15,45,31,0.45)" }}>Gestion des envois d'e-mails aux participants</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {quickActions.map((a, i) => (
          <button key={a.label}
            className="admin-card text-left flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
              style={{ backgroundColor: a.color + "18", color: a.color }}>{a.count}</div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#0f2d1f" }}>{a.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>Cliquer pour composer</p>
            </div>
          </button>
        ))}
      </div>

      <div className="admin-card bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ animationDelay: "280ms" }}>
        <div className="flex border-b" style={{ borderColor: "rgba(36,100,68,0.10)" }}>
          {[["compose","Composer un e-mail"],["sent","Historique des envois"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as "compose"|"sent")}
              className="px-6 py-3.5 text-xs font-semibold transition-colors"
              style={{ color: tab === id ? "#246444" : "rgba(15,45,31,0.45)", borderBottom: tab === id ? "2px solid #246444" : "2px solid transparent" }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "compose" ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Destinataires</label>
              <div className="flex gap-2 flex-wrap">
                {["Tous (15)","Confirmés (11)","En attente (3)","VIP (3)","Exposants (4)"].map(g => (
                  <button key={g} className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors hover:bg-[#f4f7f5]"
                    style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Objet</label>
              <input value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:ring-2 focus:ring-[#246444]/20 transition-shadow"
                style={{ borderColor: "rgba(36,100,68,0.20)" }} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide block mb-1.5" style={{ color: "rgba(15,45,31,0.45)" }}>Corps du message</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={9}
                className="w-full text-xs px-3 py-2.5 rounded-lg border outline-none resize-none font-mono focus:ring-2 focus:ring-[#246444]/20 transition-shadow"
                style={{ borderColor: "rgba(36,100,68,0.20)" }} />
              <p className="text-[10px] mt-1" style={{ color: "rgba(15,45,31,0.40)" }}>
                Variables disponibles : {"{prenom}"}, {"{nom}"}, {"{pass}"}, {"{statut}"}, {"{organisation}"}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-lg btn-primary">
                <Send className="w-3.5 h-3.5" /> Envoyer
              </button>
              <button className="text-xs font-medium px-4 py-2.5 rounded-lg border transition-colors hover:bg-[#f4f7f5]"
                style={{ borderColor: "rgba(36,100,68,0.20)", color: "#246444" }}>Aperçu</button>
            </div>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(36,100,68,0.07)" }}>
            {[
              { sujet: "Bienvenue — Confirmation d'inscription", dest: "Tous (15)",      date: "2026-12-12" },
              { sujet: "Rappel paiement — Pass Exposant",        dest: "Exposants (4)",  date: "2026-12-05" },
              { sujet: "Programme préliminaire SOAFGANG 2027",   dest: "Confirmés (11)", date: "2026-11-28" },
            ].map((e, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-[#f9fbfa] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(36,100,68,0.08)" }}>
                  <Mail className="w-3.5 h-3.5" style={{ color: "#246444" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#0f2d1f" }}>{e.sujet}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(15,45,31,0.45)" }}>→ {e.dest} · {e.date}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
                  style={{ backgroundColor: "rgba(36,100,68,0.10)", color: "#246444" }}>Envoyé</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EspaceAdminPage() {
  const [active, setActive]       = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const section = {
    overview:       <SectionOverview />,
    participants:   <SectionParticipants />,
    paiements:      <SectionPaiements />,
    programme:      <SectionProgramme />,
    communications: <SectionCommunications />,
  }[active];

  return (
    <div style={{ backgroundColor: "#f4f7f5", minHeight: "100vh" }}>

      {/* Global styles */}
      <style>{`
        @keyframes admin-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes donut-pop {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes row-in {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .admin-card {
          animation: admin-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .donut-arc {
          animation: donut-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .table-row-anim {
          animation: row-in 0.35s ease both;
        }
        .btn-primary {
          background-color: #246444;
          color: white;
          transition: background-color 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .btn-primary:hover {
          background-color: #1e5238;
          box-shadow: 0 4px 14px rgba(36,100,68,0.35);
          transform: translateY(-1px);
        }
        .btn-primary:active { transform: translateY(0); }
      `}</style>

      {/* Disclaimer banner */}
      <div className="w-full px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: "#0f2d1f", borderBottom: "1px solid rgba(196,154,48,0.20)" }}>
        <Eye className="w-4 h-4 shrink-0" style={{ color: "#c49a30" }} />
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>
          <span className="font-bold" style={{ color: "#c49a30" }}>Espace démo — </span>
          Ce tableau de bord illustre les fonctionnalités d'administration envisagées pour SOAFGANG 2027. Toutes les données affichées sont fictives et à titre démonstratif.
        </p>
      </div>

      <div className="flex" style={{ minHeight: "calc(100vh - 49px)" }}>

        {/* ── Sidebar ── */}
        <aside className="shrink-0 flex flex-col transition-all duration-300"
          style={{ width: sidebarOpen ? 224 : 62, backgroundColor: "#0f2d1f", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

          <div className="flex items-center justify-between px-4 py-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {sidebarOpen && (
              <div>
                <p className="text-xs font-black tracking-widest uppercase" style={{ color: "#c49a30" }}>Admin</p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.30)" }}>SOAFGANG 2027</p>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto">
              {sidebarOpen
                ? <X    className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} />
                : <Menu className="w-4 h-4" style={{ color: "rgba(255,255,255,0.50)" }} />}
            </button>
          </div>

          <nav className="flex-1 py-4 space-y-0.5 px-2">
            {NAV_SECTIONS.map(({ id, label, icon: Icon }) => {
              const isActive = active === id;
              return (
                <button key={id} onClick={() => setActive(id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? "rgba(196,154,48,0.15)" : "transparent",
                    color: isActive ? "#c49a30" : "rgba(255,255,255,0.45)",
                    transform: isActive ? "none" : undefined,
                  }}>
                  <Icon className="w-4 h-4 shrink-0" style={{ transition: "transform 0.2s" }} />
                  {sidebarOpen && <span className="text-xs font-medium flex-1">{label}</span>}
                  {sidebarOpen && isActive && <ChevronRight className="w-3 h-3" style={{ color: "#c49a30" }} />}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                style={{ background: "linear-gradient(135deg, #246444, #c49a30)", color: "white" }}>NE</div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "rgba(255,255,255,0.80)" }}>NTAB Energy</p>
                  <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.30)" }}>Administrateur</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ── Content ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Top bar */}
          <header className="flex items-center justify-between px-6 py-4 bg-white border-b"
            style={{ borderColor: "rgba(36,100,68,0.10)" }}>
            <div>
              <p className="text-sm font-black" style={{ color: "#0f2d1f" }}>
                {NAV_SECTIONS.find(n => n.id === active)?.label}
              </p>
              <p className="text-[10px]" style={{ color: "rgba(15,45,31,0.40)" }}>SOAFGANG 2027 · Espace Administration</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <Bell className="w-4 h-4" style={{ color: "rgba(15,45,31,0.50)" }} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "#c49a30" }} />
              </button>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: "linear-gradient(135deg, #1e5238, #0f2d1f)", color: "#c49a30" }}>NE</div>
            </div>
          </header>

          <main key={active} className="flex-1 p-6 overflow-auto">{section}</main>
        </div>
      </div>
    </div>
  );
}
