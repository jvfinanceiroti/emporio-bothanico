"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  compact?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
  compact = false,
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const spacingCls = compact ? "mb-0" : "mb-12 sm:mb-16";
  const titleCls = compact
    ? "text-2xl sm:text-3xl lg:text-4xl"
    : "text-3xl sm:text-4xl lg:text-5xl";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`max-w-2xl ${spacingCls} ${alignCls}`}
    >
      <p
        className={`text-[10px] sm:text-[11px] uppercase tracking-[0.35em] mb-4 font-medium ${
          light ? "text-[var(--lux-gold)]" : "text-[var(--lux-gold-muted)]"
        }`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {eyebrow}
      </p>
      <h2
        className={`${titleCls} font-normal leading-[1.1] tracking-tight ${
          light ? "text-[var(--lux-cream)]" : "text-[var(--lux-deep)]"
        }`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-sm sm:text-base leading-relaxed max-w-lg ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-[var(--lux-cream)]/60" : "text-[var(--lux-warm-gray)]"}`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
