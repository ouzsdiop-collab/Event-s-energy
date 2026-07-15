import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");

// L'email expéditeur — à changer quand le domaine est configuré dans Resend
// En mode test, Resend autorise uniquement l'envoi depuis onboarding@resend.dev
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const FROM_NAME  = "SOAFGANG 2027";

function emailHtml({
  prenom, nom, reference, passType, organisation, badgeUrl,
}: {
  prenom: string; nom: string; reference: string;
  passType: string; organisation: string; badgeUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation d'inscription — SOAFGANG 2027</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f2;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f2;padding:40px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(160deg,#071810,#0f2d1f);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.22em;color:#c49a30;text-transform:uppercase;">SOAFGANG 2027</p>
          <p style="margin:0 0 24px;font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.15em;">Cotonou, Bénin · 3–5 Février 2027</p>
          <div style="width:52px;height:52px;background:rgba(36,100,68,0.35);border:2px solid rgba(196,154,48,0.40);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:22px;">✓</span>
          </div>
          <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;">Inscription confirmée</h1>
          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.50);">Bienvenue, ${prenom} ${nom}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px;">

          <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#374151;">
            Nous avons bien reçu votre inscription au <strong>Salon Ouest Africain Francophone sur le Gaz Naturel</strong>.
            Votre participation est enregistrée sous la référence suivante :
          </p>

          <!-- Référence -->
          <div style="background:#f0f4f2;border:1px solid rgba(36,100,68,0.12);border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
            <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.2em;color:rgba(15,45,31,0.40);text-transform:uppercase;">Référence</p>
            <p style="margin:0;font-size:22px;font-weight:900;font-family:monospace;color:#0f2d1f;letter-spacing:0.05em;">${reference}</p>
          </div>

          <!-- Infos pass -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td width="50%" style="padding:0 6px 0 0;">
                <div style="background:#f9fbfa;border:1px solid rgba(36,100,68,0.08);border-radius:10px;padding:14px;">
                  <p style="margin:0 0 4px;font-size:9px;font-weight:700;letter-spacing:0.18em;color:rgba(15,45,31,0.35);text-transform:uppercase;">Pass</p>
                  <p style="margin:0;font-size:13px;font-weight:700;color:#0f2d1f;">${passType}</p>
                </div>
              </td>
              <td width="50%" style="padding:0 0 0 6px;">
                <div style="background:#f9fbfa;border:1px solid rgba(36,100,68,0.08);border-radius:10px;padding:14px;">
                  <p style="margin:0 0 4px;font-size:9px;font-weight:700;letter-spacing:0.18em;color:rgba(15,45,31,0.35);text-transform:uppercase;">Organisation</p>
                  <p style="margin:0;font-size:13px;font-weight:700;color:#0f2d1f;">${organisation}</p>
                </div>
              </td>
            </tr>
          </table>

          <!-- Badge CTA -->
          <div style="background:linear-gradient(135deg,#0f2d1f,#163d2a);border-radius:14px;padding:28px;text-align:center;margin-bottom:28px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.2em;color:rgba(196,154,48,0.70);text-transform:uppercase;">Votre badge officiel</p>
            <p style="margin:0 0 20px;font-size:13px;color:rgba(255,255,255,0.50);line-height:1.6;">
              Téléchargez votre badge numérique et présentez-le à l'accueil le jour de l'événement.
            </p>
            <a href="${badgeUrl}" style="display:inline-block;background:#c49a30;color:#071810;font-size:14px;font-weight:900;padding:14px 32px;border-radius:50px;text-decoration:none;letter-spacing:0.03em;">
              Accéder à mon badge →
            </a>
          </div>

          <!-- Prochaines étapes -->
          <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#0f2d1f;">Prochaines étapes</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            ${[
              ["01", "Votre dossier sera examiné par notre équipe dans les 48h ouvrées."],
              ["02", "Un email de confirmation finale vous sera envoyé avec les instructions de paiement."],
              ["03", "Téléchargez votre badge via le lien ci-dessus et conservez votre référence."],
            ].map(([n, text]) => `
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(36,100,68,0.07);">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="padding-right:14px;vertical-align:top;">
                  <span style="font-size:11px;font-weight:900;font-family:monospace;color:rgba(196,154,48,0.70);">${n}</span>
                </td>
                <td><p style="margin:0;font-size:13px;line-height:1.6;color:rgba(15,45,31,0.60);">${text}</p></td>
              </tr></table>
            </td></tr>`).join("")}
          </table>

          <p style="margin:0;font-size:13px;line-height:1.7;color:rgba(15,45,31,0.55);">
            Pour toute question, contactez-nous à
            <a href="mailto:contact@soafgang2027.org" style="color:#246444;font-weight:600;text-decoration:none;">contact@soafgang2027.org</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fbfa;border-radius:0 0 16px 16px;border-top:1px solid rgba(36,100,68,0.08);padding:24px 40px;text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:rgba(15,45,31,0.35);letter-spacing:0.15em;text-transform:uppercase;">SOAFGANG 2027</p>
          <p style="margin:0;font-size:10px;color:rgba(15,45,31,0.25);">Sofitel Cotonou Marina · 3–5 Février 2027 · Organisé par NTAB ENERGY SARL</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  // Si pas de clé Resend configurée, on répond OK sans envoyer
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY non configurée — email non envoyé");
    return NextResponse.json({ success: true, skipped: true });
  }

  let body: Record<string, string>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Données invalides" }, { status: 400 }); }

  const { prenom, nom, email, reference, passType, organisation } = body;
  if (!email || !reference) {
    return NextResponse.json({ error: "email et reference requis" }, { status: 400 });
  }

  const badgeUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://soafgang2027.org"}/badge/${reference}`;

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: `Confirmation d'inscription — SOAFGANG 2027 · ${reference}`,
    html: emailHtml({ prenom, nom, reference, passType, organisation, badgeUrl }),
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Échec envoi email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() { return NextResponse.json({ error: "Method not allowed" }, { status: 405 }); }
