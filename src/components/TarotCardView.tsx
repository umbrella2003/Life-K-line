"use client";

import type { DrawnCard } from "@/lib/tarot";

export default function TarotCardView({
  drawn,
  revealed,
  delayMs = 0,
}: {
  drawn: DrawnCard;
  revealed: boolean;
  delayMs?: number;
}) {
  const { card, orientation, positionLabel } = drawn;
  const frontTransform =
    orientation === "reversed" ? "rotateY(180deg)_rotateZ(180deg)" : "rotateY(180deg)";

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="text-xs text-violet-300/80 tracking-widest">{positionLabel}</div>
      <div className="relative w-28 h-44 sm:w-32 sm:h-52 md:w-36 md:h-56 [perspective:1200px]">
        <div
          className={`absolute inset-0 transition-transform duration-700 [transition-timing-function:cubic-bezier(0.34,1.15,0.64,1)] [transform-style:preserve-3d] ${
            revealed ? "[transform:rotateY(180deg)]" : ""
          }`}
          style={{ transitionDelay: `${delayMs}ms` }}
        >
          {/* 牌背 */}
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl border border-amber-300/40 bg-gradient-to-br from-[#1a1035] via-[#2d1b4e] to-[#150f2e] shadow-lg shadow-violet-950/60 flex items-center justify-center">
            <div className="text-amber-200/60 text-center leading-none">
              <div className="text-2xl">✦</div>
              <div className="text-[10px] mt-1 tracking-[0.3em]">TAROT</div>
            </div>
          </div>
          {/* 牌面 */}
          <div
            className={`absolute inset-0 [backface-visibility:hidden] [transform:${frontTransform}] rounded-xl border border-amber-300/60 bg-gradient-to-br from-[#150f2e] via-[#2d1b4e] to-[#1a1035] shadow-lg shadow-amber-900/20 flex flex-col items-center justify-center px-2 text-center gap-1`}
          >
            <div className="text-3xl">{card.icon}</div>
            <div className="text-[11px] text-amber-200 font-serif leading-tight">{card.name}</div>
            <div className="text-[9px] text-violet-300/70 leading-tight">{card.nameEn}</div>
          </div>
        </div>
      </div>
      {revealed && (
        <div
          className={`text-[11px] transition-opacity duration-300 animate-fade-in ${
            orientation === "upright" ? "text-amber-200" : "text-violet-300"
          }`}
        >
          {orientation === "upright" ? "✦ 正位" : "✧ 逆位"}
        </div>
      )}
    </div>
  );
}
