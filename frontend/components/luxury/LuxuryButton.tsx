"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

type Variant = "gold" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  gold:
    "lux-btn-gold border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_28px_rgba(182,132,62,0.35)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_40px_rgba(218,185,123,0.45)]",
  outline:
    "bg-transparent text-[var(--lux-cream)] border border-[var(--lux-gold)]/50 hover:border-[var(--lux-gold)] hover:bg-[var(--lux-gold)]/5",
  ghost:
    "bg-transparent text-[var(--lux-cream)] border border-transparent hover:bg-white/5",
};

interface LuxuryButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  icon?: ReactNode;
}

export function LuxuryButton({
  href,
  onClick,
  children,
  variant = "gold",
  className = "",
  type = "button",
  icon,
}: LuxuryButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 ease-out relative overflow-hidden";

  const cls = `${base} ${variants[variant]} ${className}`;

  const motionProps = {
    whileHover: { scale: 1.02, y: -1 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  };

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link href={href} className={cls}>
          {children}
          {icon}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} className={cls} {...motionProps}>
      {children}
      {icon}
    </motion.button>
  );
}
