"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import TransitionLink from "@/components/TransitionLink";
import { LucideIcon } from "lucide-react";

export interface NavChild {
  href: string;
  label: string;
  desc?: string;
}

export interface TubelightItem {
  name: string;
  href?: string;
  icon: LucideIcon;
  children?: NavChild[];
}

interface TubelightNavProps {
  items: TubelightItem[];
  active: string;
  onActivate: (name: string) => void;
  className?: string;
}

export function TubelightNav({ items, active, onActivate, className }: TubelightNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Pill */}
      <div className="flex items-center gap-1 px-1.5 py-1.5 rounded-full"
        style={{
          background: "rgba(15,45,31,0.92)",
          border: "1px solid rgba(196,154,48,0.18)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 24px rgba(10,28,18,0.30), 0 1px 0 rgba(196,154,48,0.08) inset",
        }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;
          const hasChildren = !!item.children?.length;

          const handleClick = () => {
            onActivate(item.name);
            if (hasChildren) {
              setOpenDropdown(openDropdown === item.name ? null : item.name);
            } else {
              setOpenDropdown(null);
            }
          };

          const inner = (
            <>
              {/* Desktop label */}
              <span className="hidden md:inline font-semibold text-[13px] tracking-tight leading-none relative z-10">
                {item.name}
              </span>
              {/* Mobile icon */}
              <span className="md:hidden relative z-10">
                <Icon size={17} strokeWidth={2.5} />
              </span>
              {/* Chevron for dropdowns — desktop only */}
              {hasChildren && (
                <svg className={cn("hidden md:block w-3 h-3 relative z-10 transition-transform duration-200 opacity-50", openDropdown === item.name && "rotate-180")}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              )}
              {/* Tubelight glow */}
              {isActive && (
                <motion.div
                  layoutId="soafgang-lamp"
                  className="absolute inset-0 rounded-full -z-0"
                  style={{ backgroundColor: "rgba(196,154,48,0.10)" }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                >
                  {/* Top bar */}
                  <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-t-full"
                    style={{ backgroundColor: "#c49a30" }}>
                    {/* Glow halos */}
                    <div className="absolute w-14 h-5 -top-2 -left-2 rounded-full blur-md" style={{ backgroundColor: "rgba(196,154,48,0.22)" }} />
                    <div className="absolute w-10 h-4 -top-1 left-0 rounded-full blur-sm" style={{ backgroundColor: "rgba(196,154,48,0.18)" }} />
                    <div className="absolute w-5 h-3 top-0 left-2.5 rounded-full blur-[3px]" style={{ backgroundColor: "rgba(196,154,48,0.28)" }} />
                  </div>
                </motion.div>
              )}
            </>
          );

          const itemClass = cn(
            "relative flex items-center gap-1.5 cursor-pointer px-4 py-2 rounded-full transition-colors duration-200 select-none",
            isActive ? "text-[#c49a30]" : "text-white/55 hover:text-white/85"
          );

          return hasChildren ? (
            <button key={item.name} onClick={handleClick} className={itemClass}>
              {inner}
            </button>
          ) : (
            <TransitionLink key={item.name} href={item.href!} onClick={handleClick} className={itemClass}>
              {inner}
            </TransitionLink>
          );
        })}
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {openDropdown && (() => {
          const item = items.find(i => i.name === openDropdown);
          if (!item?.children) return null;
          return (
            <motion.div
              key={openDropdown}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-3 rounded-2xl overflow-hidden z-50"
              style={{
                minWidth: 220,
                background: "rgba(10,28,18,0.96)",
                border: "1px solid rgba(196,154,48,0.14)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.35), 0 1px 0 rgba(196,154,48,0.08) inset",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Gold top accent */}
              <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, #c49a30, transparent)" }} />
              <div className="py-2">
                {item.children.map((child) => (
                  <TransitionLink
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpenDropdown(null)}
                    className="flex flex-col px-4 py-2.5 transition-colors group hover:bg-white/5"
                  >
                    <span className="text-[13px] font-semibold text-white/85 group-hover:text-[#c49a30] transition-colors">
                      {child.label}
                    </span>
                    {child.desc && (
                      <span className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.30)" }}>
                        {child.desc}
                      </span>
                    )}
                  </TransitionLink>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
