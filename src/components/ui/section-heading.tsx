import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  light?: boolean;
}

export function SectionHeading({ eyebrow, title, description, light = false }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className={`mb-4 flex items-center gap-3 text-sm font-bold tracking-[0.18em] before:h-px before:w-8 before:bg-current ${light ? "text-[var(--brand-gold-light)]" : "text-[var(--brand-gold-deep)]"}`}>
        {eyebrow}
      </p>
      <h2 className={`text-3xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl ${light ? "text-white" : "text-[var(--navy-950)]"}`}>{title}</h2>
      {description ? <p className={`mt-6 max-w-2xl text-base leading-7 sm:text-lg ${light ? "text-white/65" : "text-[var(--muted)]"}`}>{description}</p> : null}
    </div>
  );
}
