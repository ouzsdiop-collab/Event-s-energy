"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { supabase, type GalleryImage } from "@/lib/supabase";

const CircularGallery = dynamic(() => import("@/components/ui/circular-gallery"), { ssr: false });

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(22px)" }}>
      {children}
    </div>
  );
}

type Category = "Tout" | GalleryImage["category"];

const categoryFilters: { key: Category; label: string }[] = [
  { key: "Tout", label: "Tout" },
  { key: "venue", label: "Le lieu" },
  { key: "speakers", label: "Intervenants" },
  { key: "sessions", label: "Sessions" },
  { key: "networking", label: "Networking" },
  { key: "other", label: "Autre" },
];

// Placeholder images shown before any are uploaded to Supabase
const PLACEHOLDER_IMAGES: GalleryImage[] = [
  // venue
  { id: "p1",  url: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=1200&q=80", caption_fr: "Grande salle de conférence", caption_en: null, focal_x: 0.5, focal_y: 0.4, category: "venue", order_index: 0, published: true, created_at: "" },
  { id: "p2",  url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80", caption_fr: "Lobby d'accueil", caption_en: null, focal_x: 0.5, focal_y: 0.45, category: "venue", order_index: 1, published: true, created_at: "" },
  { id: "p3",  url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80", caption_fr: "Salle plénière principale", caption_en: null, focal_x: 0.5, focal_y: 0.38, category: "venue", order_index: 2, published: true, created_at: "" },
  { id: "p4",  url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80", caption_fr: "Espace gala & dîner officiel", caption_en: null, focal_x: 0.5, focal_y: 0.42, category: "venue", order_index: 3, published: true, created_at: "" },
  { id: "p5",  url: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1200&q=80", caption_fr: "Vue panoramique — Cotonou", caption_en: null, focal_x: 0.5, focal_y: 0.5, category: "venue", order_index: 4, published: true, created_at: "" },
  // sessions
  { id: "p6",  url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80", caption_fr: "Session plénière d'ouverture", caption_en: null, focal_x: 0.5, focal_y: 0.35, category: "sessions", order_index: 5, published: true, created_at: "" },
  { id: "p7",  url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&q=80", caption_fr: "Table ronde — Transition énergétique", caption_en: null, focal_x: 0.5, focal_y: 0.4, category: "sessions", order_index: 6, published: true, created_at: "" },
  { id: "p8",  url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&q=80", caption_fr: "Panel régional UEMOA", caption_en: null, focal_x: 0.5, focal_y: 0.35, category: "sessions", order_index: 7, published: true, created_at: "" },
  { id: "p9",  url: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=1200&q=80", caption_fr: "Atelier technique gaz naturel", caption_en: null, focal_x: 0.5, focal_y: 0.45, category: "sessions", order_index: 8, published: true, created_at: "" },
  { id: "p10", url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80", caption_fr: "Présentation d'un intervenant", caption_en: null, focal_x: 0.5, focal_y: 0.3, category: "sessions", order_index: 9, published: true, created_at: "" },
  // speakers
  { id: "p11", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", caption_fr: "Intervenant — Secteur énergie", caption_en: null, focal_x: 0.5, focal_y: 0.25, category: "speakers", order_index: 10, published: true, created_at: "" },
  { id: "p12", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80", caption_fr: "Intervenante — Institutions financières", caption_en: null, focal_x: 0.5, focal_y: 0.2, category: "speakers", order_index: 11, published: true, created_at: "" },
  { id: "p13", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80", caption_fr: "Expert — Politique gazière", caption_en: null, focal_x: 0.5, focal_y: 0.22, category: "speakers", order_index: 12, published: true, created_at: "" },
  { id: "p14", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80", caption_fr: "Intervenante — Régulation régionale", caption_en: null, focal_x: 0.5, focal_y: 0.2, category: "speakers", order_index: 13, published: true, created_at: "" },
  // networking
  { id: "p15", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80", caption_fr: "Cocktail de bienvenue", caption_en: null, focal_x: 0.5, focal_y: 0.5, category: "networking", order_index: 14, published: true, created_at: "" },
  { id: "p16", url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80", caption_fr: "Échanges entre participants", caption_en: null, focal_x: 0.5, focal_y: 0.5, category: "networking", order_index: 15, published: true, created_at: "" },
  { id: "p17", url: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=1200&q=80", caption_fr: "Rencontres B2B", caption_en: null, focal_x: 0.5, focal_y: 0.45, category: "networking", order_index: 16, published: true, created_at: "" },
  { id: "p18", url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80", caption_fr: "Dîner de gala officiel", caption_en: null, focal_x: 0.5, focal_y: 0.4, category: "networking", order_index: 17, published: true, created_at: "" },
  // other — énergie & contexte africain
  { id: "p19", url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=80", caption_fr: "Infrastructure gazière en Afrique", caption_en: null, focal_x: 0.5, focal_y: 0.5, category: "other", order_index: 18, published: true, created_at: "" },
  { id: "p20", url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80", caption_fr: "Transition énergétique", caption_en: null, focal_x: 0.5, focal_y: 0.5, category: "other", order_index: 19, published: true, created_at: "" },
  { id: "p21", url: "https://images.unsplash.com/photo-1485575301924-6891ef935dcd?w=1200&q=80", caption_fr: "Pipeline — Réseau gazier", caption_en: null, focal_x: 0.5, focal_y: 0.5, category: "other", order_index: 20, published: true, created_at: "" },
];

export default function GaleriePage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>("Tout");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("gallery_images").select("*").eq("published", true).order("order_index")
      .then(({ data }) => {
        setImages(data && data.length > 0 ? data : PLACEHOLDER_IMAGES);
        setLoading(false);
      });
  }, []);

  const filtered = activeCategory === "Tout" ? images : images.filter(i => i.category === activeCategory);

  // For circular gallery — use all images
  const galleryItems = images.map(img => ({
    image: img.url,
    text: img.caption_fr || "",
    focalX: img.focal_x,
    focalY: img.focal_y,
  }));

  const closeLightbox = () => setLightboxIdx(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight" && lightboxIdx !== null) setLightboxIdx((lightboxIdx + 1) % filtered.length);
      if (e.key === "ArrowLeft" && lightboxIdx !== null) setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, filtered.length]);

  return (
    <div className="bg-[#f4f7f5] min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #071810 0%, #0f2d1f 60%, #163d2a 100%)" }}>
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "repeating-linear-gradient(0deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #c49a30 0px, #c49a30 1px, transparent 1px, transparent 60px)" }} />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="inline-flex items-center gap-2 border border-gold-500/30 rounded-full px-4 py-1.5 mb-7" style={{ backgroundColor: "rgba(196,154,48,0.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-gold-400">Galerie</span>
          </div>
          <h1 className="font-heading font-black text-white mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.05 }}>
            L'univers du SOAFGN
          </h1>
          <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl">
            Le lieu, l'ambiance, les sessions et les moments forts du premier salon gazier francophone d'Afrique de l'Ouest.
          </p>
        </div>

        {/* Circular gallery strip */}
        {!loading && galleryItems.length > 0 && (
          <div className="w-full" style={{ height: "340px" }}>
            <CircularGallery
              items={galleryItems}
              bend={3}
              textColor="#ffffff"
              borderRadius={0.06}
              font="bold 15px DM Sans"
              scrollSpeed={1.5}
              scrollEase={0.06}
            />
          </div>
        )}
        <div className="h-[2px]" style={{ background: "linear-gradient(to right, transparent, #c49a30 25%, #e8c96a 50%, #c49a30 75%, transparent)" }} />
      </div>

      {/* Grid section */}
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
        {/* Filters */}
        <FadeIn>
          <div className="flex flex-wrap gap-2 mb-10">
            {categoryFilters.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveCategory(key)}
                className="text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200"
                style={{ backgroundColor: activeCategory === key ? "#246444" : "#fff", color: activeCategory === key ? "#fff" : "#6b7280", borderColor: activeCategory === key ? "#246444" : "#e5e7eb" }}>
                {label}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Masonry-style grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((img, i) => (
            <FadeIn key={img.id} delay={i * 40} className="break-inside-avoid">
              <div
                className="relative overflow-hidden rounded-xl cursor-pointer group bg-gray-100"
                style={{ aspectRatio: i % 5 === 0 ? "4/3" : i % 3 === 1 ? "3/4" : "1/1" }}
                onClick={() => setLightboxIdx(i)}
              >
                <img
                  src={img.url}
                  alt={img.caption_fr || ""}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: `${img.focal_x * 100}% ${img.focal_y * 100}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {img.caption_fr && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-xs font-semibold leading-snug">{img.caption_fr}</p>
                  </div>
                )}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <FadeIn>
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">Aucune photo dans cette catégorie pour le moment.</p>
            </div>
          </FadeIn>
        )}

        {/* CTA */}
        <FadeIn>
          <div className="mt-16 rounded-2xl overflow-hidden">
            <div className="px-8 py-10 text-center" style={{ background: "linear-gradient(135deg, #0f2d1f, #163d2a)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-400 mb-3">Rejoignez l'événement</p>
              <h2 className="font-heading font-black text-white text-xl md:text-2xl mb-3">Vivez l'expérience en direct</h2>
              <p className="text-white/40 text-sm mb-7 max-w-md mx-auto">Inscrivez-vous pour participer au premier salon gazier francophone d'Afrique de l'Ouest — Cotonou, 2027.</p>
              <a href="/inscription" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-lg transition-all duration-200 hover:opacity-90" style={{ backgroundColor: "#c49a30", color: "#071810" }}>
                S'inscrire maintenant
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {filtered.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={e => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % filtered.length); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] w-full mx-6" onClick={e => e.stopPropagation()}>
            <img
              src={filtered[lightboxIdx].url}
              alt={filtered[lightboxIdx].caption_fr || ""}
              className="w-full h-full object-contain rounded-xl"
              style={{ maxHeight: "75vh" }}
            />
            {filtered[lightboxIdx].caption_fr && (
              <p className="text-white/70 text-sm text-center mt-4">{filtered[lightboxIdx].caption_fr}</p>
            )}
            <p className="text-white/30 text-xs text-center mt-1">{lightboxIdx + 1} / {filtered.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
