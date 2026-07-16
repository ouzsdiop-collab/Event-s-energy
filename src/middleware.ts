import { NextRequest, NextResponse } from "next/server";

// Rate limiting simple en mémoire (par IP, réinitialisé au redémarrage)
// Pour la prod à grande échelle : remplacer par Upstash Redis
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// Nettoyage périodique pour éviter les fuites mémoire
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((v, k) => { if (now > v.resetAt) rateLimitMap.delete(k); });
  }, 60_000);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const response = NextResponse.next();

  // Headers de sécurité supplémentaires sur toutes les réponses
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  return response;
}

export const config = {
  matcher: [
    // Toutes les routes sauf les fichiers statiques et _next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
