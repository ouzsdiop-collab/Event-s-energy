import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
);

export type Speaker = {
  id: string;
  name: string;
  title_fr: string;
  title_en: string;
  country_fr: string;
  country_en: string;
  flag: string;
  photo_url: string | null;
  photo_focal_x: number;
  photo_focal_y: number;
  confirmed: boolean;
  order_index: number;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  caption_fr: string | null;
  caption_en: string | null;
  focal_x: number;
  focal_y: number;
  category: "venue" | "speakers" | "sessions" | "networking" | "other";
  order_index: number;
  published: boolean;
  created_at: string;
};

export type Article = {
  id: string;
  title_fr: string;
  title_en: string | null;
  excerpt_fr: string;
  excerpt_en: string | null;
  content_fr: string | null;
  content_en: string | null;
  category: "annonce" | "partenariat" | "programme" | "presse" | "logistique";
  published: boolean;
  featured: boolean;
  read_time: number;
  published_at: string;
  created_at: string;
};

export type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  tier: "platine" | "or" | "argent" | "institutionnel";
  website_url: string | null;
  order_index: number;
  published: boolean;
  created_at: string;
};

export type PartnershipRequest = {
  id: string;
  name: string;
  organisation: string;
  role: string;
  email: string;
  phone: string | null;
  tier_interest: "platine" | "or" | "argent" | "institutionnel" | "autre";
  message: string | null;
  status: "nouveau" | "en_contact" | "signé" | "refusé";
  created_at: string;
};

export type PressRequest = {
  id: string;
  name: string;
  media: string;
  role: string;
  email: string;
  phone: string | null;
  country: string;
  media_type: string;
  coverage: string | null;
  press_card_url: string | null;
  mission_letter_url: string | null;
  status: "nouveau" | "approuvé" | "refusé";
  created_at: string;
};

export type ProgrammeSession = {
  id: string;
  day: 1 | 2 | 3;
  start_time: string;
  end_time: string;
  title_fr: string;
  title_en: string | null;
  description_fr: string | null;
  description_en: string | null;
  type: "plenary" | "panel" | "break" | "networking" | "ceremony";
  location: string | null;
  speakers: string[];
  order_index: number;
  created_at: string;
};
