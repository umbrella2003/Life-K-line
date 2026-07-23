import { ACCENT, type Accent } from "./tone";

export default function TraitBar({
  accent,
  label,
  score,
  lowLabel,
  highLabel,
}: {
  accent: Accent;
  label: string;
  score: number;
  lowLabel: string;
  highLabel: string;
}) {
  const a = ACCENT[accent];
  const clamped = Math.min(100, Math.max(0, score));
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-slate-200">{label}</span>
        <span className={`text-sm font-semibold tabular-nums ${a.text}`}>{clamped}</span>
      </div>
      <div className={`h-2 w-full overflow-hidden rounded-full ${a.track}`}>
        <div
          className={`h-full rounded-full ${a.fill} transition-[width] duration-700 ease-smooth`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-500">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
