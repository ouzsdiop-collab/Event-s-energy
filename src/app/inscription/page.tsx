"use client";

import { useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { ArrowRight, ArrowLeft, Shield, Mail, QrCode, CreditCard, Smartphone, Building2, Download, Check, Calendar, MapPin } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

function genRef() {
  return "SOAFGN-2027-" + Math.floor(1000 + Math.random() * 9000);
}

type FormData = {
  civilite: string; nom: string; prenom: string; fonction: string;
  organisation: string; pays: string; email: string; telephone: string;
  categorie: string; typeParticipation: string; cgu: boolean;
};

type TouchedFields = Partial<Record<keyof FormData, boolean>>;

function validate(field: keyof FormData, value: string | boolean): string {
  switch (field) {
    case "nom":
    case "prenom":
    case "fonction":
    case "organisation":
      if (!value || (value as string).trim().length < 2) return "Minimum 2 caractères requis";
      return "";
    case "email": {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRe.test(value as string)) return "Adresse e-mail invalide";
      return "";
    }
    case "telephone":
      if (!value || (value as string).replace(/\s/g, "").length < 6) return "Minimum 6 chiffres requis";
      return "";
    case "cgu":
      if (!value) return "Veuillez accepter les conditions générales";
      return "";
    default:
      return "";
  }
}

const STEP1_REQUIRED: (keyof FormData)[] = ["nom", "prenom", "fonction", "organisation", "email", "telephone", "cgu"];

// Features per pass label (keyed by pass label string)
const PASS_FEATURES: Record<string, string[]> = {
  default: [
    "Accès aux sessions plénières",
    "Badge nominatif officiel",
    "Déjeuners inclus (2 jours)",
    "Accès à l'espace expo",
  ],
};

// We'll resolve features at render time using pass label matching keywords
function getPassFeatures(label: string): string[] {
  const l = label.toLowerCase();
  if (l.includes("vip") || l.includes("platine") || l.includes("gold") || l.includes("premium")) {
    return [
      "Accès VIP toutes sessions & ateliers",
      "Réunions B2B privées illimitées",
      "Déjeuners & dîner de gala inclus",
      "Transferts aéroport et lounge VIP",
    ];
  }
  if (l.includes("professionnel") || l.includes("pro") || l.includes("silver") || l.includes("standard")) {
    return [
      "Accès aux conférences et panels",
      "5 réunions B2B planifiées",
      "Déjeuners inclus (2 jours)",
      "Accès espace exposants",
    ];
  }
  if (l.includes("étudiant") || l.includes("junior") || l.includes("académique") || l.includes("académie")) {
    return [
      "Accès aux sessions académiques",
      "Badge étudiant officiel",
      "Déjeuner inclus (1 jour)",
      "Networking jeunes professionnels",
    ];
  }
  if (l.includes("exposant") || l.includes("stand") || l.includes("exhibitor")) {
    return [
      "Stand exposant 6 m²",
      "Accès illimité à tous les espaces",
      "Réunions B2B prioritaires",
      "Visibilité dans le programme officiel",
    ];
  }
  return PASS_FEATURES.default;
}

const RECOMMENDED_KEYWORDS = ["vip", "platine", "gold", "premium", "professionnel", "pro"];

function isRecommended(label: string): boolean {
  const l = label.toLowerCase();
  return RECOMMENDED_KEYWORDS.some(k => l.includes(k));
}

export default function InscriptionPage() {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState<"card" | "mobile" | "wire">("card");
  const [ref] = useState(() => genRef());
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLang();
  const ins = t.inscription;

  const [form, setForm] = useState<FormData>({
    civilite: "M.", nom: "Dupont", prenom: "Jean",
    fonction: "Directeur Général", organisation: "Société Béninoise d'Énergie",
    pays: ins.countries[0], email: "j.dupont@sbe-energy.bj", telephone: "97 12 34 56",
    categorie: ins.categories[2], typeParticipation: ins.passes[0].label, cgu: false,
  });

  const update = (f: keyof FormData, v: string | boolean) => setForm(p => ({ ...p, [f]: v }));
  const selectedPass = ins.passes.find(p => p.label === form.typeParticipation) ?? ins.passes[0];

  const handleNext = () => setStep(2);

  return (
    <div style={{ backgroundColor: "#f4f7f5", minHeight: "100vh" }}>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 pt-16 pb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-5" style={{ color: "#c49a30" }}>
          {ins.eyebrow}
        </p>
        <h1 className="font-heading font-black leading-[0.88] mb-2">
          <span className="block" style={{ fontSize: "clamp(1.8rem, 7vw, 4rem)", letterSpacing: "-0.025em", color: "#0f2d1f" }}>
            {ins.title1}
          </span>
          <span className="block" style={{
            fontSize: "clamp(1.8rem, 7vw, 4rem)", letterSpacing: "-0.025em",
            background: "linear-gradient(90deg, #246444, #c49a30)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {ins.title2}
          </span>
        </h1>
      </div>

      {/* Stepper */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 mb-10">
        <div className="flex items-center gap-0">
          {ins.steps.map((label, i) => {
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
                {i < ins.steps.length - 1 && (
                  <div className="flex-1 h-px mx-4"
                    style={{ backgroundColor: done ? "#246444" : "rgba(36,100,68,0.15)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 pb-32 lg:pb-24">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0">
            {step === 1 && (
              <Step1
                form={form}
                update={update}
                selectedPass={selectedPass}
                onNext={handleNext}
                ins={ins}
              />
            )}
            {step === 2 && (
              <Step2
                form={form}
                selectedPass={selectedPass}
                payMethod={payMethod}
                setPayMethod={setPayMethod}
                onBack={() => setStep(1)}
                submitting={submitting}
                ref={ref}
                onNext={async () => {
                  setSubmitting(true);
                  await supabase.from("registrations").insert({
                    reference: ref, civilite: form.civilite, nom: form.nom, prenom: form.prenom,
                    fonction: form.fonction, organisation: form.organisation, pays: form.pays,
                    email: form.email, telephone: form.telephone, categorie: form.categorie,
                    pass_type: form.typeParticipation, pass_price: selectedPass.price,
                    pay_method: payMethod, status: "en_attente", needs_invitation_letter: false,
                  });
                  fetch("/api/send-confirmation", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      prenom: form.prenom, nom: form.nom, email: form.email,
                      reference: ref, passType: selectedPass.label, organisation: form.organisation,
                    }),
                  }).catch(() => {});
                  setSubmitting(false);
                  setStep(3);
                }}
                ins={ins}
              />
            )}
            {step === 3 && <Step3 form={form} selectedPass={selectedPass} ref={ref} ins={ins} />}
          </div>

          {step < 3 && (
            <div className="w-full lg:w-72 shrink-0 relative lg:sticky lg:top-24 hidden lg:block">
              <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#0f2d1f" }}>
                <div className="px-6 pt-6 pb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(196,154,48,0.70)" }}>
                    {ins.summaryLabel}
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
                <div className="px-6 py-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                    <Calendar size={12} />
                    3–5 fév. 2027
                  </div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.50)" }}>
                    <MapPin size={12} />
                    Sofitel Cotonou Marina
                  </div>
                </div>
                <div className="px-6 py-4 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    [form.prenom && form.nom ? `${form.civilite} ${form.prenom} ${form.nom}` : "-", ins.participantLabel],
                    [form.organisation || "-", ins.orgLabel],
                    [form.categorie || "-", ins.catLabel],
                  ].map(([val, lbl]) => (
                    <div key={lbl}>
                      <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>{lbl}</p>
                      <p className="text-sm font-medium text-white truncate">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.30)" }}>{ins.amountSidebar}</p>
                  <p className="font-heading font-black text-xl" style={{ color: "#c49a30" }}>{selectedPass.price}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{selectedPass.label}</p>
                </div>
                <div className="px-6 py-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    { Icon: Shield, text: ins.trustSSL },
                    { Icon: Mail, text: ins.trustEmail },
                    { Icon: QrCode, text: ins.trustQR },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                      <Icon size={13} />{text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky mobile bottom bar — steps 1 & 2 only */}
      {step < 3 && (
        <MobileStickyBar
          passLabel={selectedPass.label}
          passPrice={selectedPass.price}
          step={step}
          onNext={step === 1 ? handleNext : undefined}
        />
      )}

      <style jsx global>{`
        .ins-input {
          width: 100%; padding: 10px 14px; border-radius: 10px;
          border: 1.5px solid rgba(36,100,68,0.15); background: white;
          font-size: 14px; color: #0f2d1f; outline: none; transition: border-color 0.2s;
        }
        .ins-input:focus { border-color: #246444; }
        .ins-input::placeholder { color: rgba(15,45,31,0.30); }
        .ins-input--valid { border-color: #246444 !important; }
        .ins-input--error { border-color: #dc2626 !important; }
      `}</style>
    </div>
  );
}

/* ── Sticky mobile bottom bar ── */
function MobileStickyBar({
  passLabel, passPrice, step, onNext,
}: {
  passLabel: string; passPrice: string; step: number; onNext?: () => void;
}) {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
      style={{
        background: "rgba(15,45,31,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
        borderTop: "1px solid rgba(36,100,68,0.25)",
      }}
    >
      <div>
        <p className="text-[10px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.40)" }}>{passLabel}</p>
        <p className="font-heading font-black text-base" style={{ color: "#c49a30" }}>{passPrice}</p>
      </div>
      {step === 1 && onNext && (
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "#246444", color: "white" }}
        >
          Suivant <ArrowRight size={15} />
        </button>
      )}
      {step === 2 && (
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>Étape 2 · Paiement</span>
      )}
    </div>
  );
}

type Ins = ReturnType<typeof useLang>["t"]["inscription"];

/* ── FieldInput helper ── */
function FieldInput({
  field, value, touched, type = "text", onChange, onBlur, placeholder, className,
}: {
  field: keyof FormData;
  value: string;
  touched: boolean;
  type?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  placeholder?: string;
  className?: string;
}) {
  const error = touched ? validate(field, value) : "";
  const isValid = touched && !error;
  const isError = touched && !!error;

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        className={`ins-input pr-9 ${isValid ? "ins-input--valid" : ""} ${isError ? "ins-input--error" : ""} ${className ?? ""}`}
      />
      {isValid && (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4 rounded-full"
          style={{ backgroundColor: "#246444", color: "white", fontSize: 10, fontWeight: 700, lineHeight: 1 }}
          aria-hidden="true"
        >✓</span>
      )}
      {isError && (
        <p className="mt-1 text-[11px] font-medium" style={{ color: "#dc2626" }}>{error}</p>
      )}
    </div>
  );
}

/* ── Step 1 ── */
function Step1({ form, update, selectedPass, onNext, ins }: {
  form: FormData; update: (f: keyof FormData, v: string | boolean) => void;
  selectedPass: Ins["passes"][number]; onNext: () => void; ins: Ins;
}) {
  const [touched, setTouched] = useState<TouchedFields>({});
  const [triedNext, setTriedNext] = useState(false);

  const touch = (f: keyof FormData) => setTouched(p => ({ ...p, [f]: true }));

  const effectiveTouched = (f: keyof FormData) => touched[f] || triedNext;

  const hasErrors = STEP1_REQUIRED.some(f => !!validate(f, form[f]));

  const handleNext = () => {
    if (hasErrors) {
      setTriedNext(true);
      return;
    }
    onNext();
  };

  // Helper to render a FieldInput with touch tracking
  const fi = (field: keyof FormData, type = "text", placeholder?: string, extraClass?: string) => (
    <FieldInput
      field={field}
      value={form[field] as string}
      touched={!!effectiveTouched(field)}
      type={type}
      onChange={v => update(field, v)}
      onBlur={() => touch(field)}
      placeholder={placeholder}
      className={extraClass}
    />
  );

  const cguError = effectiveTouched("cgu") ? validate("cgu", form.cgu) : "";

  return (
    <div className="space-y-5">
      {/* Pass cards */}
      <Card title={ins.passTitle}>
        <div className="space-y-3">
          {ins.passes.map((p) => {
            const selected = form.typeParticipation === p.label;
            const rec = isRecommended(p.label);
            const features = getPassFeatures(p.label);
            // Pick a left-border accent color per pass
            const accentColor = rec ? "#c49a30" : "#246444";
            return (
              <label
                key={p.label}
                className="block cursor-pointer transition-all duration-200 relative"
                style={{
                  border: `1.5px solid ${selected ? "#246444" : "rgba(36,100,68,0.12)"}`,
                  borderLeft: `3px solid ${accentColor}`,
                  borderRadius: 14,
                  backgroundColor: selected ? "rgba(36,100,68,0.05)" : "white",
                  padding: "16px 18px",
                }}
                onClick={() => update("typeParticipation", p.label)}
              >
                {/* Recommandé badge */}
                {rec && (
                  <span
                    className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(196,154,48,0.12)", color: "#c49a30", border: "1px solid rgba(196,154,48,0.30)" }}
                  >
                    Recommandé
                  </span>
                )}

                {/* Top row: radio + name + price */}
                <div className="flex items-center gap-3 mb-1.5">
                  <div
                    className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                    style={{
                      borderColor: selected ? "#246444" : "rgba(36,100,68,0.25)",
                      backgroundColor: selected ? "#246444" : "white",
                    }}
                  >
                    {selected && <Check size={9} strokeWidth={3} color="white" />}
                  </div>
                  <span className="text-sm font-bold flex-1" style={{ color: "#0f2d1f", paddingRight: rec ? 90 : 0 }}>{p.label}</span>
                  <span className="font-heading font-black text-base shrink-0" style={{ color: "#c49a30" }}>{p.price}</span>
                </div>

                {/* Description */}
                <p className="text-xs leading-snug mb-3 ml-7" style={{ color: "rgba(15,45,31,0.50)" }}>{p.desc}</p>

                {/* Features list */}
                <ul className="ml-7 space-y-1">
                  {features.map(feat => (
                    <li key={feat} className="flex items-start gap-2 text-xs" style={{ color: "rgba(15,45,31,0.65)" }}>
                      <span className="shrink-0 mt-px" style={{ color: "#246444", fontWeight: 700 }}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </label>
            );
          })}
        </div>
      </Card>

      {/* Identity */}
      <Card title={ins.identityTitle}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <Label text={ins.civility} required />
            <select className="ins-input" value={form.civilite} onChange={e => update("civilite", e.target.value)}>
              {["M.", "Mme", "Dr", "Prof."].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <Label text={ins.lastName} required />
            {fi("nom")}
          </div>
          <div>
            <Label text={ins.firstName} required />
            {fi("prenom")}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <Label text={ins.position} required />
            {fi("fonction")}
          </div>
          <div>
            <Label text={ins.organisation} required />
            {fi("organisation")}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text={ins.category} required />
            <select className="ins-input" value={form.categorie} onChange={e => update("categorie", e.target.value)}>
              {ins.categories.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <Label text={ins.country} required />
            <select className="ins-input" value={form.pays} onChange={e => update("pays", e.target.value)}>
              {ins.countries.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card title={ins.contactTitle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label text={ins.email} required />
            {fi("email", "email")}
          </div>
          <div>
            <Label text={ins.phone} required />
            <div className="flex gap-2">
              <select className="ins-input w-24 sm:w-28">
                <option>+229</option><option>+33</option><option>+221</option><option>+225</option><option>+234</option>
              </select>
              {fi("telephone", "tel", undefined, "flex-1")}
            </div>
          </div>
        </div>
      </Card>

      {/* CGU */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group" onClick={() => { update("cgu", !form.cgu); touch("cgu"); }}>
          <div className="w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200"
            style={{
              borderColor: cguError ? "#dc2626" : form.cgu ? "#246444" : "rgba(36,100,68,0.25)",
              backgroundColor: form.cgu ? "#246444" : "white",
            }}>
            {form.cgu && <Check size={11} strokeWidth={3} color="white" />}
          </div>
          <span className="text-sm leading-relaxed" style={{ color: "rgba(15,45,31,0.60)" }}>
            {ins.cgText.split("{terms}")[0]}
            <TransitionLink href="#" className="underline" style={{ color: "#246444" }}>{ins.terms}</TransitionLink>
            {ins.cgText.split("{terms}")[1]?.split("{privacy}")[0]}
            <TransitionLink href="#" className="underline" style={{ color: "#246444" }}>{ins.privacyLabel}</TransitionLink>
            {ins.cgText.split("{privacy}")[1]}
          </span>
        </label>
        {cguError && (
          <p className="mt-1.5 ml-8 text-[11px] font-medium" style={{ color: "#dc2626" }}>{cguError}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <TransitionLink href="/" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "rgba(15,45,31,0.45)" }}>
          <ArrowLeft size={15} /> {ins.back}
        </TransitionLink>
        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3 rounded-xl transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "#0f2d1f", color: "white" }}
        >
          {ins.toPayment} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ── Step 2 ── */
function Step2({ form, selectedPass, payMethod, setPayMethod, onBack, onNext, submitting, ref, ins }: {
  form: FormData; selectedPass: Ins["passes"][number];
  payMethod: "card" | "mobile" | "wire";
  setPayMethod: (m: "card" | "mobile" | "wire") => void;
  onBack: () => void; onNext: () => void; submitting: boolean; ref: string; ins: Ins;
}) {
  const wireFields = ins.wireFields;
  const wireVals = [...ins.wireValues, ref, selectedPass.price];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl px-6 py-5 flex items-center justify-between" style={{ backgroundColor: "#0f2d1f" }}>
        <div>
          <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>{ins.amountLabel}</p>
          <p className="font-heading font-black text-3xl" style={{ color: "#c49a30" }}>{selectedPass.price}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
            {selectedPass.label} · {form.prenom} {form.nom}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>{ins.refLabel}</p>
          <p className="font-mono font-bold text-sm" style={{ color: "rgba(196,154,48,0.80)" }}>{ref}</p>
        </div>
      </div>

      <Card title={ins.paymentTitle}>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {([
            { key: "card" as const, Icon: CreditCard, label: ins.payCard, sub: "Visa · Mastercard" },
            { key: "mobile" as const, Icon: Smartphone, label: ins.payMobile, sub: "MTN · Orange · Moov" },
            { key: "wire" as const, Icon: Building2, label: ins.payWire, sub: "BCEAO · banques locales" },
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

        {payMethod === "card" && (
          <div className="space-y-3">
            <div>
              <Label text={ins.cardNumber} required />
              <input className="ins-input" placeholder="1234  5678  9012  3456" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label text={ins.expiry} required /><input className="ins-input" placeholder="MM / AA" /></div>
              <div><Label text={ins.cvv} required /><input className="ins-input" placeholder="• • •" /></div>
            </div>
            <div>
              <Label text={ins.nameOnCard} required />
              <input className="ins-input" defaultValue={`${form.prenom.toUpperCase()} ${form.nom.toUpperCase()}`} />
            </div>
            <div className="flex items-center gap-2 text-xs p-3 rounded-xl" style={{ backgroundColor: "rgba(36,100,68,0.06)", color: "rgba(15,45,31,0.55)" }}>
              <Shield size={13} style={{ color: "#246444", flexShrink: 0 }} />
              {ins.sslMsg}
            </div>
          </div>
        )}

        {payMethod === "mobile" && (
          <div className="space-y-3">
            <div>
              <Label text={ins.operator} required />
              <select className="ins-input">
                <option>MTN Mobile Money</option><option>Orange Money</option><option>Moov Money</option>
              </select>
            </div>
            <div>
              <Label text={ins.mobileNumber} required />
              <div className="flex gap-2">
                <select className="ins-input w-24"><option>+229</option><option>+225</option><option>+221</option></select>
                <input type="tel" className="ins-input flex-1" placeholder="97 00 00 00" />
              </div>
            </div>
            <p className="text-xs p-3 rounded-xl leading-relaxed" style={{ backgroundColor: "rgba(196,154,48,0.08)", color: "rgba(15,45,31,0.60)" }}>
              {ins.mobileMsg}
            </p>
          </div>
        )}

        {payMethod === "wire" && (
          <div className="rounded-xl p-5 space-y-2.5" style={{ backgroundColor: "rgba(36,100,68,0.05)" }}>
            {wireFields.map((lbl, idx) => (
              <div key={lbl} className="flex justify-between items-center text-sm py-1.5"
                style={{ borderBottom: "1px solid rgba(36,100,68,0.08)" }}>
                <span style={{ color: "rgba(15,45,31,0.50)" }}>{lbl}</span>
                <span className="font-semibold" style={{ color: idx === 4 ? "#c49a30" : "#0f2d1f" }}>{wireVals[idx]}</span>
              </div>
            ))}
            <p className="text-xs pt-1" style={{ color: "rgba(15,45,31,0.40)" }}>{ins.wireMsg}</p>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "rgba(15,45,31,0.45)" }}>
          <ArrowLeft size={15} /> {ins.back}
        </button>
        <button onClick={onNext} disabled={submitting}
          className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3 rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#0f2d1f", color: "white" }}>
          {submitting
            ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Envoi…</>
            : <>{payMethod === "wire" ? ins.confirmWire : ins.confirmPay}<ArrowRight size={16} /></>
          }
        </button>
      </div>
    </div>
  );
}

/* ── Step 3 ── */
function Step3({ form, selectedPass, ref, ins }: { form: FormData; selectedPass: Ins["passes"][number]; ref: string; ins: Ins }) {
  const recapValues = [
    `${form.civilite} ${form.prenom} ${form.nom}`,
    form.fonction, form.organisation, form.email,
    form.pays, form.categorie, selectedPass.label, selectedPass.price, ref,
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#0f2d1f" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(36,100,68,0.40)", border: "2px solid rgba(36,100,68,0.50)" }}>
          <Check size={24} color="#c49a30" strokeWidth={2.5} />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(196,154,48,0.70)" }}>
          {ins.confirmed}
        </p>
        <h2 className="font-heading font-black text-white mb-2" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>
          {ins.welcome}
        </h2>
        <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
          {ins.confirmEmail}{" "}
          <span style={{ color: "rgba(196,154,48,0.80)" }}>{form.email}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card title={ins.badgeTitle}>
          <div className="flex flex-col items-center">
            <div className="rounded-2xl p-5 mb-4 text-center" style={{ border: "2px solid rgba(36,100,68,0.15)", backgroundColor: "#f9fbfa", width: "100%" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-heading font-black text-2xl mx-auto mb-3"
                style={{ background: "linear-gradient(135deg,#0f2d1f,#246444)", color: "#c49a30" }}>
                {form.prenom?.[0]}{form.nom?.[0]}
              </div>
              <p className="font-heading font-black text-base" style={{ color: "#0f2d1f" }}>{form.prenom} {form.nom}</p>
              <p className="text-xs mb-3" style={{ color: "rgba(15,45,31,0.45)" }}>{form.organisation}</p>
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ backgroundColor: "#0f2d1f", color: "#c49a30" }}>{selectedPass.label}</span>
            </div>
            <p className="text-xs font-mono font-bold mb-1" style={{ color: "#246444" }}>{ref}</p>
            <p className="text-xs text-center mb-4" style={{ color: "rgba(15,45,31,0.45)" }}>{ins.qrPresent}</p>
            <TransitionLink href={`/badge/${ref}`}
              className="flex items-center justify-center gap-2 w-full text-sm font-bold px-4 py-3 rounded-xl transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "#0f2d1f", color: "#c49a30" }}>
              <Download size={14} /> {ins.download}
            </TransitionLink>
          </div>
        </Card>

        <Card title={ins.recapTitle}>
          <div className="space-y-0">
            {ins.recapFields.map((lbl, idx) => (
              <div key={lbl} className="flex justify-between items-start py-2.5 text-sm"
                style={{ borderBottom: "1px solid rgba(36,100,68,0.07)" }}>
                <span style={{ color: "rgba(15,45,31,0.45)" }}>{lbl}</span>
                <span className="font-medium text-right max-w-44"
                  style={{ color: lbl === ins.recapFields[8] ? "#c49a30" : lbl === ins.recapFields[7] ? "#246444" : "#0f2d1f" }}>
                  {recapValues[idx]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="rounded-2xl p-5" style={{ backgroundColor: "rgba(36,100,68,0.06)", border: "1px solid rgba(36,100,68,0.12)" }}>
        <p className="text-sm font-semibold mb-3" style={{ color: "#0f2d1f" }}>{ins.nextStepsTitle}</p>
        <div className="grid md:grid-cols-3 gap-3">
          {ins.nextSteps.map(s => (
            <div key={s.n} className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold shrink-0" style={{ color: "rgba(196,154,48,0.70)" }}>{s.n}</span>
              <p className="text-xs leading-snug" style={{ color: "rgba(15,45,31,0.60)" }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <TransitionLink href="/"
          className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3 rounded-xl transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "#0f2d1f", color: "white" }}>
          {ins.backHome} <ArrowRight size={16} />
        </TransitionLink>
      </div>
    </div>
  );
}

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
