"use client";

import Link from "next/link";
import { ACCENT, FAMILY, type Accent } from "./tone";

export default function PageHeader({
  accent,
  icon,
  eyebrow,
  title,
  description,
  backHref = "/",
  backLabel = "返回首页",
}: {
  accent: Accent;
  icon?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  const a = ACCENT[accent];
  const f = FAMILY[a.family];

  return (
    <div className="mb-8 sm:mb-10 animate-fade-up">
      <Link
        href={backHref}
        className={`group inline-flex items-center gap-1.5 text-sm ${f.muted} ${f.mutedHover} transition-colors duration-200`}
      >
        <span className="inline-block transition-transform duration-200 ease-smooth group-hover:-translate-x-1">
          ←
        </span>
        {backLabel}
      </Link>

      <div className="mt-5 flex items-start gap-3.5 sm:gap-4">
        {icon && (
          <span
            className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border ${a.border} ${a.bgSoft} text-xl sm:text-2xl`}
          >
            {icon}
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className={`text-[11px] sm:text-xs tracking-[0.2em] ${a.text} opacity-80 mb-1.5 uppercase`}>
              {eyebrow}
            </p>
          )}
          <h1 className={`${f.heading} text-2xl sm:text-3xl ${a.text} tracking-wide leading-tight`}>
            {title}
          </h1>
          {description && (
            <p className={`text-sm ${f.body} mt-2.5 leading-relaxed max-w-xl`}>{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
