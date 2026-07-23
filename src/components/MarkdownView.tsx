function renderInline(text: string, accentClassName: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className={accentClassName}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function MarkdownView({
  text,
  accentClassName = "text-gold",
  headingFontClassName = "font-serif",
}: {
  text: string;
  accentClassName?: string;
  headingFontClassName?: string;
}) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={key} className="list-disc pl-5 space-y-1.5 my-3 text-stone-200/90 marker:text-current">
        {listBuffer.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {renderInline(item, accentClassName)}
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  let firstHeading = true;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      flushList(`ul-${idx}`);
      const noDivider = firstHeading;
      firstHeading = false;
      blocks.push(
        <h3
          key={idx}
          className={`${
            noDivider ? "mt-0" : "mt-7 pt-5 border-t border-white/10"
          } mb-2.5 text-base sm:text-lg font-semibold ${headingFontClassName} ${accentClassName} tracking-wide`}
        >
          {trimmed.slice(3)}
        </h3>
      );
    } else if (trimmed.startsWith("# ")) {
      flushList(`ul-${idx}`);
      firstHeading = false;
      blocks.push(
        <h2 key={idx} className={`mt-7 mb-2.5 text-xl ${headingFontClassName} ${accentClassName}`}>
          {trimmed.slice(2)}
        </h2>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listBuffer.push(trimmed.slice(2));
    } else if (trimmed.length === 0) {
      flushList(`ul-${idx}`);
    } else {
      flushList(`ul-${idx}`);
      blocks.push(
        <p key={idx} className="my-2.5 leading-[1.85] text-[15px] text-stone-200/90">
          {renderInline(trimmed, accentClassName)}
        </p>
      );
    }
  });
  flushList("ul-end");

  return <div className="break-words">{blocks}</div>;
}
