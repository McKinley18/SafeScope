export type AnnotationShape = {
  type: "rect" | "circle" | "arrow" | "draw";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  x2?: number;
  y2?: number;
  color: string;
};

export default function AnnotationPreview({
  photoUrl,
  annotations = [],
}: {
  photoUrl: string;
  annotations?: AnnotationShape[];
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-200">
      <img src={photoUrl} alt="Evidence" className="h-full w-full object-contain" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1 1" preserveAspectRatio="none">
        {annotations.map((shape, index) => {
          const color = shape.color || "#DC2626";

          if (shape.type === "draw") {
            const points = (shape as any).points || [];
            return (
              <polyline
                key={index}
                points={points.map((p: any) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={color}
                strokeWidth="0.01"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          }

          if (shape.type === "rect") {
            return (
              <rect
                key={index}
                x={shape.x}
                y={shape.y}
                width={shape.width || 0.32}
                height={shape.height || 0.24}
                stroke={color}
                strokeWidth="0.012"
                fill="transparent"
              />
            );
          }

          if (shape.type === "circle") {
            return (
              <circle
                key={index}
                cx={shape.x}
                cy={shape.y}
                r={shape.radius || 0.12}
                stroke={color}
                strokeWidth="0.012"
                fill="transparent"
              />
            );
          }

          const x2 = shape.x2 ?? shape.x + 0.34;
          const y2 = shape.y2 ?? shape.y;

          return (
            <g key={index}>
              <line x1={shape.x} y1={shape.y} x2={x2} y2={y2} stroke={color} strokeWidth="0.012" />
              <polygon
                points={`${x2},${y2} ${x2 - 0.04},${y2 - 0.025} ${x2 - 0.04},${y2 + 0.025}`}
                fill={color}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
