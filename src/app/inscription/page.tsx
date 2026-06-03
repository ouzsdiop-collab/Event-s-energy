"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Shield, Mail, QrCode, CreditCard, Smartphone, Building2, Download, Share2, Check, Calendar, MapPin } from "lucide-react";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type FormData = {
  civilite: string; nom: string; prenom: string; fonction: string;
  organisation: string; pays: string; email: string; telephone: string;
  categorie: string; typeParticipation: string; cgu: boolean;
};

const PASSES = [
  { label: "Pass 3 jours — Complet",   price: "350 000 XOF", desc: "Accès intégral aux 3 journées, panels, tables rondes et dîner officiel" },
  { label: "Pass 1 jour",              price: "150 000 XOF", desc: "Accès à une journée de votre choix" },
  { label: "Espace exposition",        price: "800 000 XOF", desc: "Stand exposant + 2 pass complets inclus" },
];

const STEPS = ["Informations", "Paiement", "Confirmation"];
const REF = "SOFGN-2027-0042";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InscriptionPage() {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState<"card" | "mobile" | "wire">("card");
  const [form, setForm] = useState<FormData>({
    civilite: "M.", nom: "Dupont", prenom: "Jean",
    fonction: "Directeur Général", organisation: "Société Béninoise d'Énergie",
    pays: "Bénin", email: "j.dupont@sbe-energy.bj", telephone: "97 12 34 56",
    categorie: "Opérateur gazier", typeParticipation: PASSES[0].label, cgu: false,
  });

  const update = (f: keyof FormData, v: string | boolean) => setForm(p => ({ ...p, [f]: v }));
  const selectedPass = PASSES.find(p => p.label === form.typeParticipation) ?? PASSES[0];

  return (
    <div style={{ backgroundColor: "#f4f7f5", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-16 pb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-5" style={{ color: "#c49a30" }}>
          1ÈRE ÉDITION · COTONOU, BÉNIN
        </p>
        <h1 className="font-heading font-black leading-[0.88] mb-2">
          <span className="block" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.025em", color: "#0f2d1f" }}>
            INSCRIPTION
          </span>
          <span className="block" style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.025em",
            background: "linear-gradient(90deg, #246444, #c49a30)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            AU SALON
          </span>
        </h1>
      </div>

      {/* ── Stepper ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 mb-10">
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={n} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => done && setStep(n)}
                  className="flex items-center gap-3 group"
                  style={{ cursor: done ? "pointer" : "default" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: done ? "#246444" : active ? "#0f2d1f" : "white",
                      color: done || active ? "white" : "rgba(15,45,31,0.30)",
                      border: `2px solid ${done ? "#246444" : active ? "#0f2d1f" : "rgba(36,100,68,0.15)"}`,
                    }}>
                    {done ? <Check size={14} strokeWidth={3} /> : n}
                  </div>
                  <span className="text-sm font-semibold hidden sm:block"
                    style={{ color: active ? "#0f2d1f" : done ? "#246444" : "rgba(15,45,31,0.35)" }}>
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-4"
                    style={{ backgroundColor: done ? "#246444" : "rgba(36,100,68,0.15)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 md:px-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Main */}
          <div className="flex-1 min-w-0">
            {step === 1 && <Step1 form={form} update={update} selectedPass={selectedPass} onNext={() => setStep(2)} />}
            {step === 2 && <Step2 form={form} selectedPass={selectedPass} payMethod={payMethod} setPayMethod={setPayMethod} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
            {step === 3 && <Step3 form={form} selectedPass={selectedPass} />}
          </div>

          {/* Sidebar */}
          {step < 3 && (
            <div className="lg:w-72 shrink-0 sticky top-24">
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#0f2d1f" }}>
                {/* Header */}
                <div className="px-6 pt-6 pb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(196,154,48,0.70)" }}>
                    Résumé
                  </p>
                  <div className="font-heading font-black leading-none">
                    <span className="block text-white text-lg">GAZ</span>
                    <span className="block text-lg" style={{
                      background: "linear-gradient(90deg, #246444, #c49a30)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>NATUREL</span>
                    <span className="block text-base mt-0.5" style={{ color: "transparent", WebkitTextStroke: "1px rgba(196,154,48,0.30)" }}>2027</span>
                  </div>
                </div>

                {/* Event info */}
                <div className="px-6 py-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                    <Calendar size={12} />
                    3–5 février 2027
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                    <MapPin size={12} />
                    Sofitel Cotonou Marina
                  </div>
                </div>

                {/* Participant */}
                <div className="px-6 py-4 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    [form.prenom && form.nom ? `${form.civilite} ${form.prenom} ${form.nom}` : "—", "Participant"],
                    [form.organisation || "—", "Organisation"],
                    [form.categorie || "—", "Catégorie"],
                  ].map(([val, lbl]) => (
                    <div key={lbl}>
                      <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>{lbl}</p>
                      <p className="text-sm font-medium text-white truncate">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.30)" }}>Montant</p>
                  <p className="font-heading font-black text-xl" style={{ color: "#c49a30" }}>
                    {selectedPass.price}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{selectedPass.label}</p>
                </div>

                {/* Trust signals */}
                <div className="px-6 py-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    { Icon: Shield, text: "Paiement sécurisé SSL" },
                    { Icon: Mail, text: "Confirmation par e-mail" },
                    { Icon: QrCode, text: "QR code badge inclus" },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                      <Icon size={13} />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .ins-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid rgba(36,100,68,0.15);
          background: white;
          font-size: 14px;
          color: #0f2d1f;
          outline: none;
          transition: border-color 0.2s;
        }
        .ins-input:focus { border-color: #246444; }
        .ins-input::placeholder { color: rgba(15,45,31,0.30); }
      `}</style>
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ form, update, selectedPass, onNext }: {
  form: FormData; update: (f: keyof FormData, v: string | boolean) => void;
  selectedPass: typeof PASSES[0]; onNext: () => void;
}) {
  return (
    <div className="space-y-5">
      {/* Pass selector */}
      <Card title="Votre pass">
        <div className="space-y-3">
          {PASSES.map((p) => (
            <label key={p.label}
              className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                border: `1.5px solid ${form.typeParticipation === p.label ? "#246444" : "rgba(36,100,68,0.12)"}`,
                backgroundColor: form.typeParticipation === p.label ? "rgba(36,100,68,0.04)" : "white",
              }}
              onClick={() => update("typeParticipation", p.label)}>
              <div className="w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all"
                style={{ borderColor: form.typeParticipation === p.label ? "#246444" : "rgba(36,100,68,0.25)" }}>
                {form.typeParticipation === p.label && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#246444" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold" style={{ color: "#0f2d1f" }}>{p.label}</span>
                  <span className="font-heading font-black text-sm shrink-0" style={{ color: "#c49a30" }}>{p.price}</span>
                </div>
                <p className="text-xs mt-0.5 leading-snug" style={{ color: "rgba(15,45,31,0.50)" }}>{p.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Identity */}
      <Card title="Informations personnelles">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <Label text="Civilité" required />
            <select className="ins-input" value={form.civilite} onChange={e => update("civilite", e.target.value)}>
              {["M.", "Mme", "Dr", "Prof."].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <Label text="Nom" required />
            <input className="ins-input" placeholder="Nom" value={form.nom} onChange={e => update("nom", e.target.value)} />
          </div>
          <div>
            <Label text="Prénom" required />
            <input className="ins-input" placeholder="Prénom" value={form.prenom} onChange={e => update("prenom", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <Label text="Fonction" required />
            <input className="ins-input" placeholder="Votre fonction" value={form.fonction} onChange={e => update("fonction", e.target.value)} />
          </div>
          <div>
            <Label text="Organisation" required />
            <input className="ins-input" placeholder="Nom de l'organisation" value={form.organisation} onChange={e => update("organisation", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text="Catégorie" required />
            <select className="ins-input" value={form.categorie} onChange={e => update("categorie", e.target.value)}>
              {["Décideur public","Investisseur","Opérateur gazier","Institution financière","Expert / Consultant","Journaliste / Média","Autre"].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <Label text="Pays" required />
            <select className="ins-input" value={form.pays} onChange={e => update("pays", e.target.value)}>
              {["Bénin","Burkina Faso","Côte d'Ivoire","Mali","Niger","Sénégal","Togo","Nigeria","Ghana","France","Autre"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card title="Coordonnées">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text="Email professionnel" required />
            <input type="email" className="ins-input" placeholder="exemple@organisation.com" value={form.email} onChange={e => update("email", e.target.value)} />
          </div>
          <div>
            <Label text="Téléphone" required />
            <div className="flex gap-2">
              <select className="ins-input w-28">
                <option>+229</option><option>+33</option><option>+221</option><option>+225</option><option>+234</option>
              </select>
              <input type="tel" className="ins-input flex-1" placeholder="97 00 00 00" value={form.telephone} onChange={e => update("telephone", e.target.value)} />
            </div>
          </div>
        </div>
      </Card>

      {/* CGU */}
      <label className="flex items-start gap-3 cursor-pointer group" onClick={() => update("cgu", !form.cgu)}>
        <div className="w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200"
          style={{ borderColor: form.cgu ? "#246444" : "rgba(36,100,68,0.25)", backgroundColor: form.cgu ? "#246444" : "white" }}>
          {form.cgu && <Check size={11} strokeWidth={3} color="white" />}
        </div>
        <span className="text-sm leading-relaxed" style={{ color: "rgba(15,45,31,0.60)" }}>
          J&apos;accepte les <Link href="#" className="underline" style={{ color: "#246444" }}>conditions générales</Link> et la{" "}
          <Link href="#" className="underline" style={{ color: "#246444" }}>politique de confidentialité</Link>.
        </span>
      </label>

      {/* Nav */}
      <div className="flex items-center justify-between pt-2">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "rgba(15,45,31,0.45)" }}>
          <ArrowLeft size={15} /> Retour
        </Link>
        <button onClick={onNext}
          className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3 rounded-xl transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "#0f2d1f", color: "white" }}>
          Passer au paiement <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ form, selectedPass, payMethod, setPayMethod, onBack, onNext }: {
  form: FormData; selectedPass: typeof PASSES[0];
  payMethod: "card" | "mobile" | "wire";
  setPayMethod: (m: "card" | "mobile" | "wire") => void;
  onBack: () => void; onNext: () => void;
}) {
  return (
    <div className="space-y-5">
      {/* Amount banner */}
      <div className="rounded-2xl px-6 py-5 flex items-center justify-between"
        style={{ backgroundColor: "#0f2d1f" }}>
        <div>
          <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>Montant à régler</p>
          <p className="font-heading font-black text-3xl" style={{ color: "#c49a30" }}>{selectedPass.price}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
            {selectedPass.label} · {form.prenom} {form.nom}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>Référence</p>
          <p className="font-mono font-bold text-sm" style={{ color: "rgba(196,154,48,0.80)" }}>{REF}</p>
        </div>
      </div>

      {/* Payment method */}
      <Card title="Mode de paiement">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {([
            { key: "card" as const, Icon: CreditCard, label: "Carte bancaire", sub: "Visa · Mastercard" },
            { key: "mobile" as const, Icon: Smartphone, label: "Mobile Money", sub: "MTN · Orange · Moov" },
            { key: "wire" as const, Icon: Building2, label: "Virement", sub: "BCEAO · banques locales" },
          ]).map(({ key, Icon, label, sub }) => (
            <button key={key} onClick={() => setPayMethod(key)}
              className="p-4 rounded-xl text-center transition-all duration-200"
              style={{
                border: `1.5px solid ${payMethod === key ? "#246444" : "rgba(36,100,68,0.12)"}`,
                backgroundColor: payMethod === key ? "rgba(36,100,68,0.05)" : "white",
              }}>
              <Icon className="w-5 h-5 mx-auto mb-2" strokeWidth={1.5}
                style={{ color: payMethod === key ? "#246444" : "rgba(15,45,31,0.35)" }} />
              <p className="text-xs font-semibold" style={{ color: payMethod === key ? "#246444" : "rgba(15,45,31,0.65)" }}>{label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(15,45,31,0.35)" }}>{sub}</p>
            </button>
          ))}
        </div>

        {/* Card form */}
        {payMethod === "card" && (
          <div className="space-y-3">
            <div>
              <Label text="Numéro de carte" required />
              <input className="ins-input" placeholder="1234  5678  9012  3456" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label text="Expiration" required /><input className="ins-input" placeholder="MM / AA" /></div>
              <div><Label text="CVV" required /><input className="ins-input" placeholder="• • •" /></div>
            </div>
            <div>
              <Label text="Nom sur la carte" required />
              <input className="ins-input" placeholder="NOM PRÉNOM" defaultValue={`${form.prenom.toUpperCase()} ${form.nom.toUpperCase()}`} />
            </div>
            <div className="flex items-center gap-2 text-xs p-3 rounded-xl" style={{ backgroundColor: "rgba(36,100,68,0.06)", color: "rgba(15,45,31,0.55)" }}>
              <Shield size={13} style={{ color: "#246444", flexShrink: 0 }} />
              Paiement sécurisé SSL 256-bit. Vos données bancaires ne sont jamais stockées.
            </div>
          </div>
        )}

        {/* Mobile */}
        {payMethod === "mobile" && (
          <div className="space-y-3">
            <div>
              <Label text="Opérateur" required />
              <select className="ins-input">
                <option>MTN Mobile Money</option>
                <option>Orange Money</option>
                <option>Moov Money</option>
              </select>
            </div>
            <div>
              <Label text="Numéro Mobile Money" required />
              <div className="flex gap-2">
                <select className="ins-input w-24"><option>+229</option><option>+225</option><option>+221</option></select>
                <input type="tel" className="ins-input flex-1" placeholder="97 00 00 00" />
              </div>
            </div>
            <p className="text-xs p-3 rounded-xl leading-relaxed" style={{ backgroundColor: "rgba(196,154,48,0.08)", color: "rgba(15,45,31,0.60)" }}>
              Après confirmation, un message de validation sera envoyé sur votre téléphone.
            </p>
          </div>
        )}

        {/* Wire */}
        {payMethod === "wire" && (
          <div className="rounded-xl p-5 space-y-2.5" style={{ backgroundColor: "rgba(36,100,68,0.05)" }}>
            {[
              ["Bénéficiaire", "NTAB ENERGY SARL"],
              ["Banque", "Bank of Africa Bénin"],
              ["IBAN / RIB", "BJ66 0140 1600 1234 5678 901"],
              ["BIC / SWIFT", "BOAFBJBJ"],
              ["Référence obligatoire", REF],
              ["Montant", selectedPass.price],
            ].map(([lbl, val]) => (
              <div key={lbl} className="flex justify-between items-center text-sm py-1.5"
                style={{ borderBottom: "1px solid rgba(36,100,68,0.08)" }}>
                <span style={{ color: "rgba(15,45,31,0.50)" }}>{lbl}</span>
                <span className="font-semibold" style={{ color: lbl === "Référence obligatoire" ? "#c49a30" : "#0f2d1f" }}>{val}</span>
              </div>
            ))}
            <p className="text-xs pt-1" style={{ color: "rgba(15,45,31,0.40)" }}>
              Inscription activée sous 48h ouvrées après réception du virement.
            </p>
          </div>
        )}
      </Card>

      {/* Nav */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "rgba(15,45,31,0.45)" }}>
          <ArrowLeft size={15} /> Retour
        </button>
        <button onClick={onNext}
          className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3 rounded-xl transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "#0f2d1f", color: "white" }}>
          {payMethod === "wire" ? "J'ai effectué le virement" : "Confirmer le paiement"}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({ form, selectedPass }: { form: FormData; selectedPass: typeof PASSES[0] }) {
  return (
    <div className="space-y-5">
      {/* Success header */}
      <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#0f2d1f" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(36,100,68,0.40)", border: "2px solid rgba(36,100,68,0.50)" }}>
          <Check size={24} color="#c49a30" strokeWidth={2.5} />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(196,154,48,0.70)" }}>
          Inscription confirmée
        </p>
        <h2 className="font-heading font-black text-white mb-2" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>
          Bienvenue au SOFGN 2027
        </h2>
        <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
          Un e-mail de confirmation a été envoyé à{" "}
          <span style={{ color: "rgba(196,154,48,0.80)" }}>{form.email}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* QR code */}
        <Card title="Votre badge d'accès">
          <div className="flex flex-col items-center">
            <div className="rounded-2xl p-4 mb-4" style={{ border: "2px solid rgba(36,100,68,0.15)", backgroundColor: "white" }}>
              <svg viewBox="0 0 120 120" className="w-40 h-40">
                <rect width="120" height="120" fill="white"/>
                {/* Corners */}
                <rect x="8" y="8" width="28" height="28" rx="3" fill="#0f2d1f"/>
                <rect x="13" y="13" width="18" height="18" rx="1" fill="white"/>
                <rect x="17" y="17" width="10" height="10" rx="1" fill="#0f2d1f"/>
                <rect x="84" y="8" width="28" height="28" rx="3" fill="#0f2d1f"/>
                <rect x="89" y="13" width="18" height="18" rx="1" fill="white"/>
                <rect x="93" y="17" width="10" height="10" rx="1" fill="#0f2d1f"/>
                <rect x="8" y="84" width="28" height="28" rx="3" fill="#0f2d1f"/>
                <rect x="13" y="89" width="18" height="18" rx="1" fill="white"/>
                <rect x="17" y="93" width="10" height="10" rx="1" fill="#0f2d1f"/>
                {/* Data */}
                {[44,48,52,60,64,72,80,88,96,104,108].map((x,i)=><rect key={i} x={x} y="8" width="4" height="4" fill="#0f2d1f"/>)}
                {[44,52,56,60,68,76,84,92,100,108].map((x,i)=><rect key={i} x={x} y="16" width="4" height="4" fill="#0f2d1f"/>)}
                {[44,48,56,64,72,80,88,96,104].map((x,i)=><rect key={i} x={x} y="24" width="4" height="4" fill="#0f2d1f"/>)}
                {[8,16,24,44,52,60,68,76,84,92,100,108].map((y,i)=><rect key={i} x="44" y={y+32} width="4" height="4" fill="#0f2d1f"/>)}
                {[8,20,28,36,44,52,60,68,76,84,92,100,108].map((y,i)=><rect key={i} x="52" y={y+32} width="4" height="4" fill="#0f2d1f" opacity={i%2===0?1:0}/>)}
                {[8,16,24,32,48,56,72,80,88,100].map((y,i)=><rect key={i} x="60" y={y+32} width="4" height="4" fill="#0f2d1f"/>)}
                {[8,24,40,56,72,88,100].map((y,i)=><rect key={i} x="68" y={y+32} width="4" height="4" fill="#0f2d1f"/>)}
                {[12,28,44,60,76,92,108].map((y,i)=><rect key={i} x="76" y={y+32} width="4" height="4" fill="#0f2d1f"/>)}
                {/* Gold center logo */}
                <rect x="48" y="48" width="24" height="24" rx="4" fill="#c49a30"/>
                <text x="60" y="62" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f2d1f">GN</text>
              </svg>
            </div>
            <p className="text-xs font-mono font-bold mb-1" style={{ color: "#246444" }}>{REF}</p>
            <p className="text-xs text-center mb-4" style={{ color: "rgba(15,45,31,0.45)" }}>
              Présentez ce QR code à l&apos;entrée pour retirer votre badge.
            </p>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                style={{ border: "1.5px solid rgba(36,100,68,0.20)", color: "#246444" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(36,100,68,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Download size={13} /> Télécharger
              </button>
              <button className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                style={{ border: "1.5px solid rgba(36,100,68,0.20)", color: "#246444" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(36,100,68,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                <Share2 size={13} /> Partager
              </button>
            </div>
          </div>
        </Card>

        {/* Recap */}
        <Card title="Récapitulatif">
          <div className="space-y-0">
            {[
              ["Participant", `${form.civilite} ${form.prenom} ${form.nom}`],
              ["Fonction", form.fonction],
              ["Organisation", form.organisation],
              ["Email", form.email],
              ["Pays", form.pays],
              ["Catégorie", form.categorie],
              ["Pass", selectedPass.label],
              ["Montant", selectedPass.price],
              ["Référence", REF],
            ].map(([lbl, val]) => (
              <div key={lbl} className="flex justify-between items-start py-2.5 text-sm"
                style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
                <span style={{ color: "rgba(15,45,31,0.45)" }}>{lbl}</span>
                <span className="font-medium text-right max-w-44"
                  style={{ color: lbl === "Référence" ? "#c49a30" : lbl === "Montant" ? "#246444" : "#0f2d1f" }}>
                  {val}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Next steps */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "rgba(36,100,68,0.06)", border: "1px solid rgba(36,100,68,0.12)" }}>
        <p className="text-sm font-semibold mb-3" style={{ color: "#0f2d1f" }}>Prochaines étapes</p>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { n: "01", text: "Vérifiez votre e-mail de confirmation" },
            { n: "02", text: "Préparez votre visa si nécessaire" },
            { n: "03", text: "Consultez le programme complet" },
          ].map(s => (
            <div key={s.n} className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold shrink-0" style={{ color: "rgba(196,154,48,0.70)" }}>{s.n}</span>
              <p className="text-xs leading-snug" style={{ color: "rgba(15,45,31,0.60)" }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Link href="/"
          className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3 rounded-xl transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "#0f2d1f", color: "white" }}>
          Retour à l&apos;accueil <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "rgba(36,100,68,0.10)" }}>
      <h2 className="font-heading font-bold text-base mb-5" style={{ color: "#0f2d1f" }}>{title}</h2>
      {children}
    </div>
  );
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(15,45,31,0.55)" }}>
      {text}{required && <span className="ml-0.5" style={{ color: "#c49a30" }}>*</span>}
    </label>
  );
}
