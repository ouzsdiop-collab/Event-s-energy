"use client";

import { useLang } from "@/lib/i18n";

const icons = [
  // Pipeline / infrastructure
  <svg key="infra" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="13" width="28" height="6" rx="3" stroke="#c49a30" strokeWidth="2"/>
    <circle cx="8" cy="16" r="3" stroke="#c49a30" strokeWidth="2"/>
    <circle cx="24" cy="16" r="3" stroke="#c49a30" strokeWidth="2"/>
    <line x1="16" y1="8" x2="16" y2="13" stroke="#c49a30" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="19" x2="16" y2="24" stroke="#c49a30" strokeWidth="2" strokeLinecap="round"/>
  </svg>,
  // Power / lightning bolt
  <svg key="power" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 4L8 18h8l-2 10 14-16h-8l2-8z" stroke="#c49a30" strokeWidth="2" strokeLinejoin="round"/>
  </svg>,
  // Factory / industry
  <svg key="industry" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="18" width="28" height="10" rx="1" stroke="#c49a30" strokeWidth="2"/>
    <path d="M2 18l8-8v8" stroke="#c49a30" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M10 18l8-8v8" stroke="#c49a30" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M18 18l8-8v8" stroke="#c49a30" strokeWidth="2" strokeLinejoin="round"/>
    <line x1="8" y1="4" x2="8" y2="10" stroke="#c49a30" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="4" x2="16" y2="10" stroke="#c49a30" strokeWidth="2" strokeLinecap="round"/>
  </svg>,
  // Finance / chart
  <svg key="finance" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 24l7-8 6 4 11-12" stroke="#c49a30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="28" cy="8" r="3" stroke="#c49a30" strokeWidth="2"/>
    <line x1="4" y1="28" x2="28" y2="28" stroke="#c49a30" strokeWidth="2" strokeLinecap="round"/>
  </svg>,
  // Tech / circuit
  <svg key="tech" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="12" height="12" rx="2" stroke="#c49a30" strokeWidth="2"/>
    <line x1="16" y1="4" x2="16" y2="10" stroke="#c49a30" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="22" x2="16" y2="28" stroke="#c49a30" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4" y1="16" x2="10" y2="16" stroke="#c49a30" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="16" x2="28" y2="16" stroke="#c49a30" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="2" fill="#c49a30"/>
  </svg>,
];

export default function InvestmentOpportunities() {
  const { t } = useLang();
  const io = t.investmentOpportunities;

  return (
    <section style={{ background: "#f0f4f2" }} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="text-xs font-bold uppercase tracking-[0.25em] mb-4 block"
            style={{ color: "#c49a30" }}
          >
            {io.label}
          </span>
          <h2
            className="text-2xl md:text-3xl font-bold leading-tight mb-4"
            style={{ color: "#0f2d1f" }}
          >
            {io.title}
          </h2>
          <p className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "#4a6655" }}>
            {io.subtitle}
          </p>
        </div>

        {/* Cards grid: 3 top + 2 bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {io.items.slice(0, 3).map((item, i) => (
            <Card key={i} icon={icons[i]} title={item.title} desc={item.desc} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:max-w-[66.67%] mx-auto">
          {io.items.slice(3, 5).map((item, i) => (
            <Card key={i + 3} icon={icons[i + 3]} title={item.title} desc={item.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div
      className="group bg-white rounded-xl p-7 flex flex-col gap-4 border-2 transition-all duration-300 cursor-default"
      style={{ borderColor: "transparent" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#246444"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "transparent"; }}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-lg" style={{ background: "#f0f4f2" }}>
        {icon}
      </div>
      <h3 className="font-bold text-base leading-snug" style={{ color: "#0f2d1f" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "#5a7060" }}>
        {desc}
      </p>
    </div>
  );
}
