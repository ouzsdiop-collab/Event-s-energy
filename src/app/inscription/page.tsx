"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Calendar, MapPin, ChevronRight, ChevronLeft, ChevronDown,
  Shield, Mail, QrCode, CreditCard, Smartphone, Building2,
  CheckCircle2, Download, Share2, Info
} from "lucide-react";

const steps = [
  { num: 1, label: "Informations" },
  { num: 2, label: "Paiement" },
  { num: 3, label: "Confirmation QR Code" },
];

const faqItems = [
  {
    q: "Puis-je modifier mes informations après validation de l'inscription ?",
    a: "Oui, vous pouvez modifier vos informations jusqu'à 48h avant l'événement depuis votre espace personnel.",
  },
  {
    q: "Quels sont les moyens de paiement acceptés ?",
    a: "Carte bancaire (Visa, Mastercard), Mobile Money (MTN, Orange, Moov) et virement bancaire.",
  },
  {
    q: "Quand recevrai-je mon QR code d'accès ?",
    a: "Immédiatement après confirmation du paiement, par e-mail et dans votre espace personnel.",
  },
];

type FormData = {
  civilite: string; nom: string; prenom: string; fonction: string;
  organisation: string; pays: string; email: string; telephone: string;
  categorie: string; typeParticipation: string; b2b: string; cgu: boolean;
};

const participationPrices: Record<string, string> = {
  "": "—",
  "Pass 3 jours (complet)": "350 000 XOF",
  "Pass 1 jour": "150 000 XOF",
  "Espace exposition (exposant)": "800 000 XOF",
  "Sponsor officiel": "Sur devis",
};

export default function InscriptionPage() {
  const [step, setStep] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [payMethod, setPayMethod] = useState<"card" | "mobile" | "wire">("card");
  const [form, setForm] = useState<FormData>({
    civilite: "", nom: "Dupont", prenom: "Jean", fonction: "Directeur Général",
    organisation: "Société Béninoise d'Énergie", pays: "Bénin",
    email: "j.dupont@sbe-energy.bj", telephone: "97 12 34 56",
    categorie: "Opérateur gazier", typeParticipation: "Pass 3 jours (complet)",
    b2b: "oui", cgu: false,
  });

  const update = (field: keyof FormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const price = participationPrices[form.typeParticipation] ?? "—";
  const refCode = "SAFGN-2027-0042";

  // ---------- SIDEBAR (shared) ----------
  const Sidebar = () => (
    <div className="lg:w-80 space-y-4 shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="bg-navy-900 px-5 py-4">
          <h3 className="text-white font-heading font-bold text-sm uppercase tracking-wide">
            RÉSUMÉ DE VOTRE INSCRIPTION
          </h3>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-3 mb-5 pb-5 border-b border-gray-100">
            <EventLogo />
            <div>
              <div className="font-heading font-bold text-navy-900 text-sm leading-tight">
                Salon Ouest Africain Francophone sur le Gaz Naturel
              </div>
              <div className="text-green-600 text-xs font-semibold mt-0.5">1ère ÉDITION</div>
            </div>
          </div>
          <div className="space-y-3 text-sm mb-5 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-green-600 shrink-0" />
              <span className="font-medium text-navy-900">3 au 5 février 2027</span>
            </div>
            <div className="flex items-start gap-2 text-gray-500">
              <MapPin className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <span>Sofitel Cotonou Marina Hôtel & Spa, Cotonou, Bénin</span>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <Row label="Nom" value={form.nom && form.prenom ? `${form.civilite} ${form.prenom} ${form.nom}` : "—"} />
            <Row label="Organisation" value={form.organisation || "—"} />
            <Row label="Catégorie" value={form.categorie || "Non sélectionnée"} />
            <Row label="Type de participation" value={form.typeParticipation || "Non sélectionné"} />
            <Row label="Montant" value={price} highlight />
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500">Statut</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                step === 3 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {step === 3 ? "Confirmé" : "En attente de validation"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {step < 3 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h4 className="font-heading font-bold text-navy-900 text-sm uppercase tracking-wide mb-4">
            INSCRIPTION EN TOUTE SÉRÉNITÉ
          </h4>
          <div className="space-y-4">
            {[
              { Icon: Shield, title: "Paiement sécurisé", desc: "Données protégées par un système de paiement certifié PCI-DSS." },
              { Icon: Mail, title: "Confirmation automatique", desc: "E-mail de confirmation immédiat après paiement." },
              { Icon: QrCode, title: "QR code pour badge", desc: "Accès rapide au salon avec votre QR code personnel." },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-navy-900 text-sm">{title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ---------- STEP 1 ----------
  const Step1 = () => (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <h2 className="font-heading font-bold text-navy-900 text-xl mb-6">Informations du participant</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Field label="Civilité" required>
            <select className="input-field" value={form.civilite} onChange={e => update("civilite", e.target.value)}>
              <option value="">Sélectionnez</option>
              {["M.", "Mme", "Dr", "Prof."].map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Nom" required>
            <input type="text" className="input-field" placeholder="Entrez votre nom" value={form.nom} onChange={e => update("nom", e.target.value)} />
          </Field>
          <Field label="Prénom" required>
            <input type="text" className="input-field" placeholder="Entrez votre prénom" value={form.prenom} onChange={e => update("prenom", e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Field label="Fonction" required>
            <input type="text" className="input-field" placeholder="Entrez votre fonction" value={form.fonction} onChange={e => update("fonction", e.target.value)} />
          </Field>
          <Field label="Organisation / Entreprise" required>
            <input type="text" className="input-field" placeholder="Nom de votre organisation" value={form.organisation} onChange={e => update("organisation", e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Field label="Pays" required>
            <select className="input-field" value={form.pays} onChange={e => update("pays", e.target.value)}>
              <option value="">Sélectionnez votre pays</option>
              {["Bénin","Burkina Faso","Côte d'Ivoire","Guinée-Bissau","Mali","Niger","Sénégal","Togo","Nigeria","Ghana","Cameroun","France","Autre"].map(p => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Email professionnel" required>
            <input type="email" className="input-field" placeholder="exemple@entreprise.com" value={form.email} onChange={e => update("email", e.target.value)} />
          </Field>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            <select className="input-field w-36">
              <option>🇧🇯 +229</option>
              <option>🇫🇷 +33</option>
              <option>🇸🇳 +221</option>
              <option>🇨🇮 +225</option>
              <option>🇳🇬 +234</option>
            </select>
            <input type="tel" className="input-field flex-1" placeholder="07 12 34 56 78" value={form.telephone} onChange={e => update("telephone", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Field label="Catégorie de participant" required info="Votre catégorie détermine votre badge et vos accès.">
            <select className="input-field" value={form.categorie} onChange={e => update("categorie", e.target.value)}>
              <option value="">Sélectionnez votre catégorie</option>
              {["Décideur public","Investisseur","Opérateur gazier","Institution financière","Expert / Consultant","Journaliste / Média","Autre"].map(v => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <Field label="Type de participation" required info="Le type détermine le montant des frais d'inscription.">
            <select className="input-field" value={form.typeParticipation} onChange={e => update("typeParticipation", e.target.value)}>
              <option value="">Sélectionnez votre type</option>
              {Object.keys(participationPrices).filter(k => k).map(v => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </Field>
        </div>

        {form.typeParticipation && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm text-gray-700 font-medium">Montant des frais d&apos;inscription</span>
            <span className="text-green-700 font-bold text-lg">{price}</span>
          </div>
        )}

        <div className="mb-4">
          <p className="block text-xs font-semibold text-gray-700 mb-2">Souhaitez-vous participer aux rencontres B2B ? <span className="text-red-500">*</span></p>
          <div className="flex gap-6">
            {[["oui","Oui, je souhaite participer"],["non","Non, merci"]].map(([val, label]) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer" onClick={() => update("b2b", val)}>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${form.b2b === val ? "border-green-600" : "border-gray-300"}`}>
                  {form.b2b === val && <span className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                </span>
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer" onClick={() => update("cgu", !form.cgu)}>
            <div className={`w-4 h-4 rounded border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors ${form.cgu ? "bg-green-600 border-green-600" : "border-gray-300"}`}>
              {form.cgu && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
            </div>
            <span className="text-sm text-gray-600">
              J&apos;accepte les <Link href="#" className="text-green-600 hover:underline">conditions générales d&apos;utilisation</Link> et la <Link href="#" className="text-green-600 hover:underline">politique de confidentialité</Link>. <span className="text-red-500">*</span>
            </span>
          </label>
        </div>
        <p className="text-xs text-gray-400 mb-6">* Champs obligatoires</p>

        {/* FAQ */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-semibold text-green-600 text-xs uppercase tracking-widest mb-4">BESOIN D&apos;AIDE ?</h3>
          {faqItems.map((item, i) => (
            <div key={i} className="border-b border-gray-100 last:border-0">
              <button className="w-full text-left py-3 flex items-center justify-between text-sm text-gray-700 font-medium hover:text-navy-900 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-green-600 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <p className="text-sm text-gray-500 pb-3 leading-relaxed">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-600 hover:text-navy-900 font-medium min-h-11 px-2">
          <ChevronLeft className="w-4 h-4" /> Retour à l&apos;accueil
        </Link>
        <button onClick={() => setStep(2)} className="btn-primary">
          Continuer vers le paiement <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );

  // ---------- STEP 2 ----------
  const Step2 = () => (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <h2 className="font-heading font-bold text-navy-900 text-xl mb-2">Paiement des frais d&apos;inscription</h2>
        <p className="text-gray-500 text-sm mb-8">Choisissez votre mode de paiement et finalisez votre inscription.</p>

        {/* Amount recap */}
        <div className="bg-navy-900 text-white rounded-xl p-5 mb-8 flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-xs mb-1">Montant à régler</div>
            <div className="text-3xl font-heading font-black text-white">{price}</div>
            <div className="text-gray-400 text-xs mt-1">{form.typeParticipation} · {form.prenom} {form.nom}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-xs mb-1">Réf. inscription</div>
            <div className="text-green-400 font-mono font-bold text-sm">{refCode}</div>
          </div>
        </div>

        {/* Payment method tabs */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Mode de paiement</p>
          <div className="grid grid-cols-3 gap-3">
            {([
              { key: "card", Icon: CreditCard, label: "Carte bancaire", sub: "Visa, Mastercard" },
              { key: "mobile", Icon: Smartphone, label: "Mobile Money", sub: "MTN, Orange, Moov" },
              { key: "wire", Icon: Building2, label: "Virement bancaire", sub: "BCEAO, banques locales" },
            ] as const).map(({ key, Icon, label, sub }) => (
              <button
                key={key}
                onClick={() => setPayMethod(key)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${payMethod === key ? "border-green-600 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${payMethod === key ? "text-green-600" : "text-gray-400"}`} strokeWidth={1.5} />
                <div className={`text-xs font-semibold ${payMethod === key ? "text-green-700" : "text-gray-700"}`}>{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Card form */}
        {payMethod === "card" && (
          <div className="space-y-4">
            <Field label="Numéro de carte" required>
              <div className="relative">
                <input type="text" className="input-field pr-16" placeholder="1234  5678  9012  3456" maxLength={19} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">VISA</span>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">MC</span>
                </div>
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date d'expiration" required>
                <input type="text" className="input-field" placeholder="MM / AA" maxLength={7} />
              </Field>
              <Field label="Code CVV" required>
                <input type="text" className="input-field" placeholder="• • •" maxLength={4} />
              </Field>
            </div>
            <Field label="Nom sur la carte" required>
              <input type="text" className="input-field" placeholder="JEAN DUPONT" defaultValue={`${form.prenom.toUpperCase()} ${form.nom.toUpperCase()}`} />
            </Field>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <Shield className="w-4 h-4 text-green-600 shrink-0" />
              Paiement sécurisé SSL 256-bit. Vos données bancaires ne sont jamais stockées sur nos serveurs.
            </div>
          </div>
        )}

        {/* Mobile Money form */}
        {payMethod === "mobile" && (
          <div className="space-y-4">
            <Field label="Opérateur" required>
              <select className="input-field">
                <option>MTN Mobile Money</option>
                <option>Orange Money</option>
                <option>Moov Money</option>
              </select>
            </Field>
            <Field label="Numéro de téléphone Mobile Money" required>
              <div className="flex gap-2">
                <select className="input-field w-36">
                  <option>🇧🇯 +229</option>
                  <option>🇨🇮 +225</option>
                  <option>🇸🇳 +221</option>
                </select>
                <input type="tel" className="input-field flex-1" placeholder="97 00 00 00" />
              </div>
            </Field>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 leading-relaxed">
              <strong>Comment ça marche :</strong> Après confirmation, vous recevrez un message de validation sur votre téléphone. Approuvez le paiement pour finaliser votre inscription.
            </div>
          </div>
        )}

        {/* Wire transfer */}
        {payMethod === "wire" && (
          <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
            <p className="font-semibold text-navy-900 mb-4">Coordonnées bancaires pour le virement</p>
            {[
              ["Bénéficiaire", "NTAB ENERGY SARL"],
              ["Banque", "Bank of Africa Bénin"],
              ["IBAN / RIB", "BJ66 0140 1600 1234 5678 901"],
              ["BIC / SWIFT", "BOAFBJBJ"],
              ["Référence obligatoire", refCode],
              ["Montant", price],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className={`font-semibold text-navy-900 ${label === "Référence obligatoire" ? "text-green-600 font-mono" : ""}`}>{val}</span>
              </div>
            ))}
            <p className="text-xs text-gray-500 pt-2">Votre inscription sera activée dès réception du virement, sous 48h ouvrées. La référence est obligatoire pour identifier votre paiement.</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-navy-900 font-medium min-h-11 px-2">
          <ChevronLeft className="w-4 h-4" /> Retour aux informations
        </button>
        <button onClick={() => setStep(3)} className="btn-primary">
          {payMethod === "wire" ? "J'ai effectué le virement" : "Confirmer le paiement"} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );

  // ---------- STEP 3 ----------
  const Step3 = () => (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
        {/* Success header */}
        <div className="text-center mb-8 pb-8 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="font-heading font-bold text-navy-900 text-2xl mb-2">Inscription confirmée !</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
            Votre inscription au Salon Ouest Africain Francophone sur le Gaz Naturel a été enregistrée avec succès.
            Un e-mail de confirmation a été envoyé à <strong className="text-navy-900">{form.email}</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code */}
          <div className="text-center">
            <h3 className="font-heading font-bold text-navy-900 text-base mb-4">Votre badge d&apos;accès</h3>
            <div className="inline-block border-4 border-navy-900 rounded-2xl p-4 mb-4">
              {/* QR Code SVG mockup */}
              <svg viewBox="0 0 120 120" className="w-48 h-48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" fill="white"/>
                {/* Top-left finder */}
                <rect x="8" y="8" width="28" height="28" rx="3" fill="#0D1B2A"/>
                <rect x="13" y="13" width="18" height="18" rx="1" fill="white"/>
                <rect x="17" y="17" width="10" height="10" rx="1" fill="#0D1B2A"/>
                {/* Top-right finder */}
                <rect x="84" y="8" width="28" height="28" rx="3" fill="#0D1B2A"/>
                <rect x="89" y="13" width="18" height="18" rx="1" fill="white"/>
                <rect x="93" y="17" width="10" height="10" rx="1" fill="#0D1B2A"/>
                {/* Bottom-left finder */}
                <rect x="8" y="84" width="28" height="28" rx="3" fill="#0D1B2A"/>
                <rect x="13" y="89" width="18" height="18" rx="1" fill="white"/>
                <rect x="17" y="93" width="10" height="10" rx="1" fill="#0D1B2A"/>
                {/* Data modules */}
                {[44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,104,108,44,52,60,68,76,84,92,100,108].map((x, i) => (
                  <rect key={i} x={x} y={[8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,44,44,44,44,44,44,44,44,44][i]} width="4" height="4" fill="#0D1B2A" opacity={Math.random() > 0.4 ? 1 : 0}/>
                ))}
                {[8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,104,108].map((y, i) => (
                  [44,52,60,68,76,84,92,100,108].map((x, j) => (
                    <rect key={`${i}-${j}`} x={x} y={y} width="4" height="4" fill="#0D1B2A" opacity={(i + j) % 3 === 0 ? 1 : 0}/>
                  ))
                ))}
                {/* Green accent */}
                <rect x="50" y="50" width="20" height="20" rx="2" fill="#16a34a"/>
                <text x="60" y="64" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">GN</text>
              </svg>
            </div>
            <p className="text-gray-500 text-xs mb-1">Référence : <strong className="text-green-600 font-mono">{refCode}</strong></p>
            <p className="text-gray-400 text-xs mb-5">Présentez ce QR code à l&apos;entrée du salon pour accéder à votre badge.</p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 text-sm font-semibold text-navy-900 border-2 border-gray-200 rounded-lg px-4 py-2.5 hover:border-navy-900 transition-colors">
                <Download className="w-4 h-4" /> Télécharger
              </button>
              <button className="flex items-center gap-2 text-sm font-semibold text-navy-900 border-2 border-gray-200 rounded-lg px-4 py-2.5 hover:border-navy-900 transition-colors">
                <Share2 className="w-4 h-4" /> Partager
              </button>
            </div>
          </div>

          {/* Recap card */}
          <div>
            <h3 className="font-heading font-bold text-navy-900 text-base mb-4">Récapitulatif de votre inscription</h3>
            <div className="space-y-3 text-sm">
              {[
                ["Participant", `${form.civilite} ${form.prenom} ${form.nom}`],
                ["Fonction", form.fonction],
                ["Organisation", form.organisation],
                ["Email", form.email],
                ["Pays", form.pays],
                ["Catégorie", form.categorie],
                ["Type de participation", form.typeParticipation],
                ["Rencontres B2B", form.b2b === "oui" ? "Oui" : "Non"],
                ["Montant réglé", price],
                ["Référence", refCode],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-semibold text-navy-900 text-right max-w-48 ${label === "Référence" ? "text-green-600 font-mono" : ""}`}>{val}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 leading-relaxed">
              <strong>Prochaines étapes :</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Vérifier votre e-mail de confirmation</li>
                <li>Préparer vos informations de visa si nécessaire</li>
                <li>Consulter les <Link href="/informations-pratiques" className="underline">informations pratiques</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-52 flex items-end pb-10"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(13,27,42,0.92) 50%, rgba(13,27,42,0.5) 100%), url('https://images.unsplash.com/photo-1575879285940-f7d4a4b5a60d?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <p className="section-label">1ère ÉDITION</p>
          <h1 className="text-3xl md:text-5xl font-heading font-black text-white mb-3">Inscription au Salon</h1>
          <p className="text-gray-300 text-sm max-w-xl leading-relaxed">
            Rejoignez les décideurs, experts et investisseurs du secteur gazier pour construire ensemble un avenir durable pour l&apos;Afrique de l&apos;Ouest.
          </p>
        </div>
      </section>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-0">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <button
                onClick={() => s.num < step && setStep(s.num)}
                className="flex flex-col items-center group"
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${
                  step > s.num ? "bg-green-600 border-green-600 text-white cursor-pointer" :
                  step === s.num ? "bg-green-600 border-green-600 text-white" :
                  "bg-white border-gray-300 text-gray-400"
                }`}>
                  {step > s.num
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                    : s.num}
                </div>
                <span className={`text-xs mt-1.5 font-medium whitespace-nowrap ${step === s.num ? "text-green-600" : step > s.num ? "text-green-500" : "text-gray-400"}`}>
                  {s.num}. {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-20 md:w-32 h-0.5 mx-3 mb-5 transition-colors ${step > s.num ? "bg-green-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="py-10 px-4 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && <Step3 />}
          </div>
          <Sidebar />
        </div>
      </section>
    </>
  );
}

// --- Shared sub-components ---
function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`text-right max-w-40 ${highlight ? "text-green-600 font-bold" : "font-medium text-navy-900"} text-sm`}>{value}</span>
    </div>
  );
}

function Field({ label, required, info, children }: { label: string; required?: boolean; info?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500">*</span>}
        {info && (
          <span title={info} className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center cursor-help ml-0.5">
            <Info className="w-2.5 h-2.5" />
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function EventLogo() {
  return (
    <div className="w-12 h-12 shrink-0">
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="23" stroke="#22c55e" strokeWidth="2"/>
        <path d="M24 10 C18 16 16 20 20 24 C22 26 22 28 20 34" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
        <path d="M29 12 C25 18 23 22 27 26 C29 28 28 31 26 36" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
        <path d="M15 32 Q24 26 33 32" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
