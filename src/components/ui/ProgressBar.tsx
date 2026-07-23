import { ACCENT, type Accent } from "./tone";

export default function ProgressBar({ accent, percent }: { accent: Accent; percent: number }) {
  const a = ACCENT[accent];
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full ${a.track}`}>
      <div
        className={`h-full rounded-full ${a.fill} transition-[width] duration-500 ease-smooth`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
