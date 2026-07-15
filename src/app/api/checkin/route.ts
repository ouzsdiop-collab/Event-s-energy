import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);

export async function POST(req: NextRequest) {
  let body: { reference?: string; token?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Données invalides" }, { status: 400 }); }

  const { reference, token } = body;
  if (!reference || !token) {
    return NextResponse.json({ error: "reference et token requis" }, { status: 400 });
  }

  // Vérifier le token
  const { data: settings } = await supabaseAdmin
    .from("site_settings").select("pointage_token").eq("id", "main").single();

  if (!settings?.pointage_token || settings.pointage_token !== token) {
    return NextResponse.json({ error: "Token invalide" }, { status: 403 });
  }

  // Chercher l'inscription
  const { data: reg } = await supabaseAdmin
    .from("registrations").select("id, prenom, nom, organisation, pass_type, status, checked_in, checked_in_at")
    .eq("reference", reference).maybeSingle();

  if (!reg) {
    return NextResponse.json({ error: "Référence introuvable" }, { status: 404 });
  }

  if (reg.checked_in) {
    return NextResponse.json({
      alreadyCheckedIn: true,
      prenom: reg.prenom, nom: reg.nom,
      organisation: reg.organisation, pass_type: reg.pass_type,
      checked_in_at: reg.checked_in_at,
    });
  }

  // Marquer présent
  await supabaseAdmin.from("registrations")
    .update({ checked_in: true, checked_in_at: new Date().toISOString() })
    .eq("id", reg.id);

  return NextResponse.json({
    success: true,
    prenom: reg.prenom, nom: reg.nom,
    organisation: reg.organisation, pass_type: reg.pass_type,
  });
}

export async function GET() { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
