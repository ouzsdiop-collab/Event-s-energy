import Link from "next/link";

export function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer drop / flame — dark green */}
      <path
        d="M24 2 C24 2 6 18 6 32 C6 42.5 14.1 52 24 52 C33.9 52 42 42.5 42 32 C42 18 24 2 24 2Z"
        fill="#1e5238"
      />
      {/* Inner flame — gold */}
      <path
        d="M24 16 C24 16 15 26 15 33 C15 38.5 19 43 24 43 C29 43 33 38.5 33 33 C33 26 24 16 24 16Z"
        fill="#c49a30"
      />
      {/* Inner highlight — light green */}
      <path
        d="M24 26 C24 26 20 31 20 34.5 C20 37.5 21.8 40 24 40 C26.2 40 28 37.5 28 34.5 C28 31 24 26 24 26Z"
        fill="#2d7a4f"
      />
    </svg>
  );
}

export default function Logo({ variant = "full" }: { variant?: "full" | "compact" }) {
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0 group">
      <LogoMark size={variant === "compact" ? 36 : 44} />
      {variant === "full" && (
        <div className="leading-tight">
          <div className="font-heading font-bold text-gray-800" style={{ fontSize: "12px", lineHeight: "1.3" }}>
            Salon Ouest Africain<br />
            Francophone du{" "}
            <span className="text-forest-600">Gaz Naturel</span>{" "}
            <span className="text-gold-500">2027</span>
          </div>
        </div>
      )}
    </Link>
  );
}
