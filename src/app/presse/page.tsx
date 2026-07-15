"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { supabase } from "@/lib/supabase";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(22px)" }}>
      {children}
    </div>
  );
}

type AccredFormState = "idle" | "sending" | "sent";

const mediaTypes = [
  "Presse écrite nationale",
  "Presse écrite internationale",
  "Presse en ligne / Web",
  "Télévision nationale",
  "Télévision internationale",
  "Radio",
  "Agence de presse",
  "Photojournalisme",
  "Podcast / Média digital",
  "Autre",
];

const kitFiles = [
  { name: "Communiqué de presse — Lancement SOAFGANG 2027", type: "PDF", size: "420 Ko", icon: "📄" },
  { name: "Dossier de presse complet", type: "PDF", size: "2,1 Mo", icon: "📋" },
  { name: "Logo SOAFGANG 2027 — Pack HD", type: "ZIP", size: "8,4 Mo", icon: "🎨" },
  { name: "Visuels officiels — Bannières & Affiches", type: "ZIP", size: "14,2 Mo", icon: "🖼️" },
  { name: "Fiche événement — 1 page", type: "PDF", size: "280 Ko", icon: "📌" },
  { name: "Biographies des intervenants confirmés", type: "PDF", size: "1,8 Mo", icon: "👤" },
];

const chiffres = [
  { value: "500+", label: "Participants attendus" },
  { value: "15", label: "Pays représentés" },
  { value: "40+", label: "Intervenants confirmés" },
  { value: "3", label: "Jours de programme" },
  { value: "4", label: "Sous-thèmes stratégiques" },
  { value: "10+", label: "Partenaires institutionnels" },
];

const coverageTypes = [
  { icon: "📺", title: "Conférences de presse", desc: "Une conférence de presse officielle sera organisée le 3 février 2027 à l'ouverture du salon. Accès réservé aux médias accrédités." },
  { icon: "🎤", title: "Interviews exclusives", desc: "Des créneaux d'interviews avec les intervenants clés peuvent être planifiés à la demande. Disponibilités limitées — contactez notre attachée de presse." },
  { icon: "📸", title: "Espace photographes", desc: "Un espace photographe dédié est prévu dans les salles de conférence et lors des séquences protocolaires. Accréditation obligatoire." },
  { icon: "🎥", title: "Plateau TV / Radio", desc: "Un plateau technique est mis à disposition des équipes TV et radio accréditées pour les prises de son et interviews face caméra." },
  { icon: "📡", title: "Live streaming", desc: "Les sessions plénières seront diffusées en direct sur le site officiel et la chaîne YouTube du SOAFGANG. Les médias peuvent reprendre le flux." },
  { icon: "📂", title: "Centre de presse", desc: "Un espace presse dédié avec Wi-Fi haut débit, prises électriques et salle de montage est disponible au Sofitel pendant toute la durée du salon." },
];

const coverageOptions = [
  "Article / Reportage écrit",
  "Reportage photo",
  "Reportage vidéo / TV",
  "Interview(s) d'intervenants",
  "Live streaming",
  "Podcast / Audio",
  "Couverture en direct (réseaux sociaux)",
  "Autre",
];

const countryList = [
  "Bénin","Burkina Faso","Cameroun","Côte d'Ivoire","Gabon","Guinée","Guinée-Bissau",
  "Mali","Mauritanie","Niger","République du Congo","Sénégal","Tchad","Togo",
  "Ghana","Nigeria","Sierra Leone","Liberia","Gambie",
  "France","Belgique","Suisse","Canada","Maroc","Tunisie","Algérie",
  "Autre",
];

async function uploadDoc(file: File, folder: string): Promise<string | null> {
  const path = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const { error } = await supabase.storage.from("soafgang-media").upload(path, file, { upsert: false });
  if (error) return null;
  const { data } = supabase.storage.from("soafgang-media").getPublicUrl(path);
  return data.publicUrl;
}

export default function PressePage() {
  const [form, setForm] = useState({
    name: "", media: "", role: "", email: "", phone: "",
    country: "", type: "", coverage: [] as string[], other_coverage: "",
  });
  const [presseFile, setPresseFile] = useState<File | null>(null);
  const [missionFile, setMissionFile] = useState<File | null>(null);
  const [status, setStatus] = useState<AccredFormState>("idle");

  const toggleCoverage = (val: string) => {
    setForm(f => ({
      ...f,
      coverage: f.coverage.includes(val) ? f.coverage.filter(c => c !== val) : [...f.coverage, val],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const [presseUrl, missionUrl] = await Promise.all([
      presseFile ? uploadDoc(presseFile, "press/cartes") : Promise.resolve(null),
      missionFile ? uploadDoc(missionFile, "press/missions") : Promise.resolve(null),
    ]);
    await supabase.from("press_requests").insert({
      name: form.name, media: form.media, role: form.role,
      email: form.email, phone: form.phone || null,
      country: form.country, media_type: form.type,
      coverage: form.coverage.join(", ") + (form.other_coverage ? ` / ${form.other_coverage}` : ""),
      press_card_url: presseUrl, mission_letter_url: missionUrl,
      status: "nouveau",
    });
    setStatus("sent");
  };

  return (
    <div className="bg-[#f4f7f5] min-h-screen">

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #071810 0%, #0f2d1f 60%, #163d2a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px)" }} />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 border border-gold-500/30 rounded-full px-4 py-1.5 mb-7" style={{ backgroundColor: "rgba(196,154,48,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-400">Espace Presse & Médias</span>
          </div>
          <h1 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.05 }}>
            Presse & Accréditation
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl mb-10">
            Le SOAFGANG 2027 accueille les journalistes, photographes et équipes audiovisuelles souhaitant couvrir la première édition du Salon Ouest Africain Francophone sur le Gaz Naturel.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#accreditation" className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.70)" }}>
              🎫 Accréditation
            </a>
            <a href="#kit" className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.70)" }}>
              📦 Kit presse
            </a>
            <a href="#couverture" className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.70)" }}>
              📡 Couverture
            </a>
          </div>
        </div>
        <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #c49a30 25%, #e8c96a 50%, #c49a30 75%, transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14 md:py-20 space-y-16">

        {/* Chiffres clés */}
        <FadeIn>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 md:p-9">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-2">L'événement en chiffres</p>
            <h2 className="font-heading font-black text-gray-900 text-xl md:text-2xl mb-6">Ce que vous allez couvrir</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {chiffres.map((c, i) => (
                <div key={i} className="text-center">
                  <div className="font-heading font-black text-2xl md:text-3xl mb-1" style={{ background: "linear-gradient(135deg, #1e5238 0%, #c49a30 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {c.value}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium leading-snug">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Kit presse */}
        <div id="kit">
          <FadeIn>
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-3">Ressources</p>
              <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Kit presse</h2>
              <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {kitFiles.map((file, i) => (
              <FadeIn key={file.name} delay={i * 60}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-forest-200 transition-all duration-200 group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-2xl">{file.icon}</div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: "rgba(36,100,68,0.08)", color: "#246444" }}>{file.type}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800 leading-snug mb-1">{file.name}</p>
                    <p className="text-[10px] text-gray-400">{file.size}</p>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-lg border border-forest-200 text-forest-700 hover:bg-forest-700 hover:text-white hover:border-forest-700 transition-all duration-200">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Télécharger
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <div className="mt-5 rounded-2xl p-5 border border-gold-200/50" style={{ backgroundColor: "rgba(196,154,48,0.05)" }}>
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">📬</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Ressources mises à jour régulièrement</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Le kit presse est enrichi au fur et à mesure des confirmations d'intervenants et des annonces officielles. Pour recevoir les mises à jour directement, contactez notre attachée de presse à <a href="mailto:presse@soafgang2027.org" className="text-forest-600 font-semibold hover:underline">presse@soafgang2027.org</a></p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Couverture */}
        <div id="couverture">
          <FadeIn>
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-3">Sur place</p>
              <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Conditions de couverture</h2>
              <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coverageTypes.map((c, i) => (
              <FadeIn key={c.title} delay={i * 60}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full hover:shadow-md hover:border-forest-200 transition-all duration-200">
                  <div className="text-2xl mb-3">{c.icon}</div>
                  <h3 className="font-heading font-bold text-gray-900 text-sm mb-2">{c.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Formulaire accréditation */}
        <div id="accreditation">
          <FadeIn>
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-3">Demande</p>
              <h2 className="font-heading font-black text-gray-900 text-2xl md:text-3xl">Accréditation presse</h2>
              <div className="w-10 h-[3px] bg-gold-400 rounded-full mt-4" />
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <FadeIn delay={60}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 md:p-8">
                  {status === "sent" ? (
                    <div className="py-12 text-center">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "rgba(36,100,68,0.08)" }}>
                        <svg className="w-7 h-7 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">Dossier soumis</h3>
                      <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">Votre demande d'accréditation a été transmise. Notre équipe presse examine votre dossier et vous répond sous 5 jours ouvrés.</p>
                      <button onClick={() => { setStatus("idle"); setPresseFile(null); setMissionFile(null); setForm({ name:"", media:"", role:"", email:"", phone:"", country:"", type:"", coverage:[], other_coverage:"" }); }} className="mt-6 text-sm font-semibold text-forest-600 hover:text-forest-800 transition-colors">
                        Nouvelle demande
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Identité */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nom complet <span className="text-red-400">*</span></label>
                          <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Prénom Nom" className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Fonction <span className="text-red-400">*</span></label>
                          <input required type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Journaliste, Photographe, Caméraman…" className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                        </div>
                      </div>

                      {/* Média */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Organe de presse / Média <span className="text-red-400">*</span></label>
                          <input required type="text" value={form.media} onChange={e => setForm(f => ({ ...f, media: e.target.value }))} placeholder="Nom du média ou de l'agence" className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type de média <span className="text-red-400">*</span></label>
                          <select required value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all bg-white text-gray-700">
                            <option value="">Sélectionnez</option>
                            {mediaTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email professionnel <span className="text-red-400">*</span></label>
                          <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="vous@media.com" className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Téléphone</label>
                          <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+229 XX XXX XXX" className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Pays / Nationalité <span className="text-red-400">*</span></label>
                          <select required value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all bg-white text-gray-700">
                            <option value="">Sélectionnez</option>
                            {countryList.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Type de couverture */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Type de couverture envisagée <span className="text-red-400">*</span></label>
                        <div className="flex flex-wrap gap-2">
                          {coverageOptions.map(opt => (
                            <button key={opt} type="button" onClick={() => toggleCoverage(opt)}
                              className="text-xs px-3 py-1.5 rounded-full border transition-all duration-150"
                              style={{ backgroundColor: form.coverage.includes(opt) ? "#246444" : "#fff", color: form.coverage.includes(opt) ? "#fff" : "#6b7280", borderColor: form.coverage.includes(opt) ? "#246444" : "#e5e7eb" }}>
                              {opt}
                            </button>
                          ))}
                        </div>
                        {form.coverage.includes("Autre") && (
                          <input type="text" value={form.other_coverage} onChange={e => setForm(f => ({ ...f, other_coverage: e.target.value }))} placeholder="Précisez…" className="mt-2 w-full text-sm border border-gray-200 rounded-lg px-3.5 py-2.5 outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100 transition-all placeholder:text-gray-300" />
                        )}
                      </div>

                      {/* Documents */}
                      <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: "rgba(15,45,31,0.03)", border: "1px solid rgba(36,100,68,0.10)" }}>
                        <p className="text-xs font-bold text-gray-700">Documents du dossier</p>

                        {/* Carte de presse */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Carte de presse <span className="text-gray-400 font-normal">(PDF ou image — si disponible)</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="flex-1 flex items-center gap-2.5 border-2 border-dashed rounded-lg px-4 py-3 transition-colors group-hover:border-forest-300" style={{ borderColor: presseFile ? "#246444" : "#e5e7eb", backgroundColor: presseFile ? "rgba(36,100,68,0.04)" : "#fff" }}>
                              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: presseFile ? "#246444" : "#9ca3af" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                              <span className="text-xs" style={{ color: presseFile ? "#246444" : "#9ca3af" }}>{presseFile ? presseFile.name : "Choisir un fichier (PDF, JPG, PNG · max 5 Mo)"}</span>
                            </div>
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => setPresseFile(e.target.files?.[0] || null)} />
                          </label>
                        </div>

                        {/* Lettre de mission */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                            Lettre de mission / d'assignation <span className="text-red-400">*</span> <span className="text-gray-400 font-normal">(PDF)</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="flex-1 flex items-center gap-2.5 border-2 border-dashed rounded-lg px-4 py-3 transition-colors group-hover:border-forest-300" style={{ borderColor: missionFile ? "#246444" : "#e5e7eb", backgroundColor: missionFile ? "rgba(36,100,68,0.04)" : "#fff" }}>
                              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: missionFile ? "#246444" : "#9ca3af" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                              <span className="text-xs" style={{ color: missionFile ? "#246444" : "#9ca3af" }}>{missionFile ? missionFile.name : "Lettre signée par la rédaction (PDF · max 5 Mo)"}</span>
                            </div>
                            <input type="file" accept=".pdf" className="hidden" onChange={e => setMissionFile(e.target.files?.[0] || null)} />
                          </label>
                        </div>

                        <p className="text-[10px] text-gray-400">Les freelances sans carte de presse doivent impérativement fournir une lettre de mission signée par leur commanditaire.</p>
                      </div>

                      <button type="submit" disabled={status === "sending" || !missionFile || form.coverage.length === 0}
                        className="w-full font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#246444", color: "#fff" }}>
                        {status === "sending" ? (
                          <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Envoi du dossier…</>
                        ) : (
                          <>Soumettre mon dossier d'accréditation <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></>
                        )}
                      </button>
                      {(!missionFile || form.coverage.length === 0) && (
                        <p className="text-[11px] text-center text-gray-400">
                          {!missionFile && "Lettre de mission requise · "}
                          {form.coverage.length === 0 && "Sélectionnez au moins un type de couverture"}
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <FadeIn delay={120}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-4">Processus</p>
                  <div className="space-y-4">
                    {[
                      { step: "1", title: "Soumission", desc: "Remplissez le formulaire ci-contre avec vos informations et votre média." },
                      { step: "2", title: "Vérification", desc: "Notre équipe presse examine votre demande sous 5 jours ouvrés." },
                      { step: "3", title: "Confirmation", desc: "Vous recevez votre badge d'accréditation par email avec les instructions d'accès." },
                      { step: "4", title: "Sur place", desc: "Récupérez votre badge physique au centre de presse dès votre arrivée au Sofitel." },
                    ].map(({ step, title, desc }) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 text-white" style={{ backgroundColor: "#246444" }}>{step}</div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 mb-0.5">{title}</p>
                          <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={180}>
                <div className="rounded-2xl p-5 border border-gold-200/50" style={{ backgroundColor: "rgba(196,154,48,0.05)" }}>
                  <p className="text-sm font-semibold text-gray-800 mb-2">Contact attachée de presse</p>
                  <a href="mailto:presse@soafgang2027.org" className="text-xs text-forest-600 font-semibold hover:underline">presse@soafgang2027.org</a>
                  <p className="text-xs text-gray-400 mt-1">Date limite d'accréditation : 20 janvier 2027</p>
                </div>
              </FadeIn>
              <FadeIn delay={220}>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-forest-600 mb-3">Suivre l'événement</p>
                  <div className="space-y-2">
                    {[
                      { label: "Live streaming des plénières", href: "/live" },
                      { label: "Actualités & communiqués", href: "/actualites" },
                      { label: "Programme officiel", href: "/programme" },
                    ].map(({ label, href }) => (
                      <TransitionLink key={href} href={href} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-xs text-gray-600 hover:text-forest-700 transition-colors group">
                        {label}
                        <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-forest-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </TransitionLink>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
