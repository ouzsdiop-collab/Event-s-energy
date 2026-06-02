import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Salon Ouest Africain Francophone sur le Gaz Naturel – 1ère Édition",
  description:
    "La plateforme de référence pour le dialogue, la coopération et l'investissement dans le secteur gazier au sein de l'espace UEMOA. 3 au 5 février 2027, Cotonou, Bénin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
