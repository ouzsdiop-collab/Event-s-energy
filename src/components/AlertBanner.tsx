"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";

type BannerType = "info" | "warning" | "success";

const STYLES: Record<BannerType, { bg: string; text: string; border: string }> = {
  info:    { bg: "rgba(36,100,68,0.10)",  text: "#1e5238", border: "rgba(36,100,68,0.20)" },
  warning: { bg: "rgba(196,154,48,0.12)", text: "#9a7320", border: "rgba(196,154,48,0.25)" },
  success: { bg: "rgba(30,82,56,0.12)",   text: "#246444", border: "rgba(36,100,68,0.20)" },
};

export default function AlertBanner() {
  const [text, setText] = useState("");
  const [type, setType] = useState<BannerType>("info");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("banner_active, banner_text, banner_type").eq("id", "main").single()
      .then(({ data }) => {
        if (data?.banner_active && data?.banner_text) {
          setText(data.banner_text);
          setType((data.banner_type as BannerType) || "info");
        }
      });
  }, []);

  if (!text || dismissed) return null;

  const st = STYLES[type];
  return (
    <div className="w-full px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-semibold"
      style={{ backgroundColor: st.bg, color: st.text, borderBottom: `1px solid ${st.border}` }}>
      <span className="flex items-center gap-2 flex-1 justify-center">
        <span>📢</span>
        <span>{text}</span>
      </span>
      <button onClick={() => setDismissed(true)} className="shrink-0 p-1 rounded hover:opacity-70 transition-opacity">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
