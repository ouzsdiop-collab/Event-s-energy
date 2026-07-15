import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Client côté serveur — utilise service_role si disponible, sinon anon key (lecture seule recommandée)
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

// Rate limiting par IP
const ipMap = new Map<string, { count: number; resetAt: number }>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  const e = ipMap.get(ip);
  if (!e || now > e.resetAt) { ipMap.set(ip, { count: 1, resetAt: now + 300_000 }); return true; }
  if (e.count >= 5) return false; // 5 inscriptions max par IP par 5 min
  e.count++;
  return true;
}

function sanitize(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, 500).replace(/<[^>]*>/g, ""); // strip HTML
}

const REQUIRED = ["civilite", "nom", "prenom", "email", "telephone", "pays", "organisation", "fonction", "categorie", "pass_type", "pay_method"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s\-().]{6,20}$/;

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRate(ip)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  // Validation des champs requis
  for (const field of REQUIRED) {
    if (!body[field] || !sanitize(body[field])) {
      return NextResponse.json({ error: `Champ manquant : ${field}` }, { status: 400 });
    }
  }

  const email = sanitize(body.email);
  const phone = sanitize(body.telephone);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
  }

  // Vérifier si l'email est déjà inscrit
  const { data: existing } = await supabaseAdmin
    .from("registrations")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Cette adresse email est déjà enregistrée." }, { status: 409 });
  }

  // Générer la référence
  const ref = `SOAFGN-2027-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  // Insérer avec les données sanitizées
  const { error } = await supabaseAdmin.from("registrations").insert({
    reference: ref,
    civilite:      sanitize(body.civilite),
    nom:           sanitize(body.nom),
    prenom:        sanitize(body.prenom),
    email,
    telephone:     phone,
    pays:          sanitize(body.pays),
    organisation:  sanitize(body.organisation),
    fonction:      sanitize(body.fonction),
    categorie:     sanitize(body.categorie),
    pass_type:     sanitize(body.pass_type),
    pass_price:    typeof body.pass_price === "number" ? body.pass_price : 0,
    pay_method:    sanitize(body.pay_method),
    needs_invitation_letter: Boolean(body.needs_invitation_letter),
    status: "pending",
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement." }, { status: 500 });
  }

  return NextResponse.json({ success: true, reference: ref }, { status: 201 });
}

// Bloquer toutes les autres méthodes
export async function GET() { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export async function PUT()  { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
