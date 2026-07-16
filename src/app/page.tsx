import Hero from "@/components/home/Hero";
import ThemesSection from "@/components/home/ThemesSection";
import KeyFigures from "@/components/home/KeyFigures";
import InvestmentOpportunities from "@/components/home/InvestmentOpportunities";
import SpeakersSection from "@/components/home/SpeakersSection";
import ProgrammePreview from "@/components/home/ProgrammePreview";
import PartnersSection from "@/components/home/PartnersSection";
import CtaSection from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ThemesSection />
      <KeyFigures />
      <InvestmentOpportunities />
      <SpeakersSection />
      <ProgrammePreview />
      <PartnersSection />
      <CtaSection />
    </>
  );
}
