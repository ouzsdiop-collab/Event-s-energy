"use client";

import { useTransition } from "@/lib/transition";
import { ComponentPropsWithoutRef, MouseEvent } from "react";

interface Props extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  href: string;
  label?: string;
}

export default function TransitionLink({ href, label, children, onClick, ...props }: Props) {
  const { navigate } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let external links, new-tab, or modifier-key clicks pass through normally
    if (
      href.startsWith("http") ||
      href.startsWith("mailto") ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    ) return;

    e.preventDefault();
    onClick?.(e);
    navigate(href, label);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
