import type { DesignContent, RequiredField } from "@/lib/types";

/** A simple preview. The real editor and print files come with the chosen editor SDK. */
export function LabelPreview({
  content,
  requiredFields,
  widthMm,
  heightMm,
}: {
  content: DesignContent;
  requiredFields: RequiredField[];
  widthMm: number;
  heightMm: number;
}) {
  const [title, ...details] = requiredFields.map(({ key }) => content.fields[key]?.trim() ?? "");
  const { primary, secondary } = content.colors;
  const unit = heightMm / 100;

  return (
    <svg
      viewBox={`0 0 ${widthMm} ${heightMm}`}
      role="img"
      aria-label="Packaging preview"
      className="w-full border border-line"
    >
      <rect width={widthMm} height={heightMm} fill={primary} />
      <rect
        x={unit * 4}
        y={unit * 4}
        width={widthMm - unit * 8}
        height={heightMm - unit * 8}
        fill="none"
        stroke={secondary}
        strokeWidth={unit * 0.6}
      />
      <text
        x={widthMm / 2}
        y={heightMm * 0.36}
        textAnchor="middle"
        fill={secondary}
        fontSize={unit * 15}
        fontFamily="var(--font-display)"
      >
        {title || "Your brand"}
      </text>
      {details.filter(Boolean).map((line, index) => (
        <text
          key={index}
          x={widthMm / 2}
          y={heightMm * 0.54 + index * unit * 8}
          textAnchor="middle"
          fill={secondary}
          fontSize={unit * 5}
        >
          {line}
        </text>
      ))}
    </svg>
  );
}
