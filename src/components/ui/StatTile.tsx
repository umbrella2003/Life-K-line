import type { ReactNode } from "react";
import { ACCENT, type Accent } from "./tone";

export default function StatTile({
  accent,
  label,
  value,
  sub,
  emphasis = false,
}: {
  accent: Accent;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  emphasis?: boolean;
}) {
  const a = ACCENT[accent];
  return (
    <div
      className={`rounded-xl border py-3.5 sm:py-4 px-2 text-center transition-colors duration-200 ${
        emphasis ? `${a.border} ${a.bgSoft}` : "border-white/5 bg-black/20"
      }`}
    >
      <p className="text-[11px] text-stone-500 mb-1 truncate">{label}</p>
      <p className={`text-lg sm:text-xl font-serif tabular-nums ${a.text}`}>{value}</p>
      {sub && <p className="text-[11px] text-stone-500 mt-1 truncate">{sub}</p>}
    </div>
  );
}
