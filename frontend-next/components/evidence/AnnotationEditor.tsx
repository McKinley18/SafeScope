"use client";

import { useRef, useState } from "react";
import AnnotationPreview, { AnnotationShape } from "./AnnotationPreview";

const COLORS = ["#DC2626", "#F97316", "#EAB308", "#1D72B8", "#16A34A", "#7C3AED", "#FFFFFF", "#000000"];
const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

type DragMode = "move" | "resize" | "arrowStart" | "arrowEnd" | null;

export default function AnnotationEditor({
  photoUrl,
  annotations,
  onSave,
  onCancel,
  expanded = false,
}: {
  photoUrl: string;
  annotations: AnnotationShape[];
  onSave: (annotations: AnnotationShape[]) => void;
  onCancel: () => void;
  expanded?: boolean;
}) {
  const [localAnnotations, setLocalAnnotations] = useState<AnnotationShape[]>(annotations || []);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState("#DC2626");

  const dragRef = useRef<{
    mode: DragMode;
    index: number | null;
    startX: number;
    startY: number;
    original: AnnotationShape | null;
  }>({ mode: null, index: null, startX: 0, startY: 0, original: null });

  function addShape(type: "rect" | "circle" | "arrow") {
    const offset = localAnnotations.length * 0.03;
    const next: AnnotationShape =
      type === "rect"
        ? { type, x: 0.18 + offset, y: 0.18 + offset, width: 0.36, height: 0.22, color: selectedColor }
        : type === "circle"
        ? { type, x: 0.42 + offset, y: 0.36 + offset, radius: 0.12, color: selectedColor }
        : { type, x: 0.2 + offset, y: 0.35 + offset, x2: 0.68 + offset, y2: 0.35 + offset, color: selectedColor };

    setLocalAnnotations((current) => [...current, next]);
    setSelectedIndex(localAnnotations.length);
  }

  function updateShape(index: number, updater: (shape: AnnotationShape) => AnnotationShape) {
    setLocalAnnotations((current) => current.map((shape, i) => (i === index ? updater(shape) : shape)));
  }

  function startDrag(index: number, mode: DragMode, e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget as SVGElement;
    const svg = target.ownerSVGElement || target;
    const rect = svg.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width);
    const y = clamp((e.clientY - rect.top) / rect.height);

    setSelectedIndex(index);
    dragRef.current = {
      mode,
      index,
      startX: x,
      startY: y,
      original: { ...localAnnotations[index] },
    };
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (drag.index === null || !drag.original || !drag.mode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width);
    const y = clamp((e.clientY - rect.top) / rect.height);
    const dx = x - drag.startX;
    const dy = y - drag.startY;
    const original = drag.original;

    updateShape(drag.index, (shape) => {
      if (drag.mode === "move") {
        return {
          ...shape,
          x: clamp(original.x + dx),
          y: clamp(original.y + dy),
          x2: original.x2 !== undefined ? clamp(original.x2 + dx) : undefined,
          y2: original.y2 !== undefined ? clamp(original.y2 + dy) : undefined,
        };
      }

      if (drag.mode === "resize" && shape.type === "rect") {
        return {
          ...shape,
          width: clamp((original.width || 0.32) + dx, 0.05, 0.95),
          height: clamp((original.height || 0.24) + dy, 0.05, 0.95),
        };
      }

      if (drag.mode === "resize" && shape.type === "circle") {
        return {
          ...shape,
          radius: clamp((original.radius || 0.12) + dx, 0.03, 0.45),
        };
      }

      if (drag.mode === "arrowStart") {
        return { ...shape, x, y };
      }

      if (drag.mode === "arrowEnd") {
        return { ...shape, x2: x, y2: y };
      }

      return shape;
    });
  }

  function stopDrag() {
    dragRef.current = { mode: null, index: null, startX: 0, startY: 0, original: null };
  }

  function applyColor(color: string) {
    setSelectedColor(color);

    if (selectedIndex !== null) {
      updateShape(selectedIndex, (shape) => ({
        ...shape,
        color,
      }));
    }
  }

  function clearLast() {
    setLocalAnnotations((current) => current.slice(0, -1));
    setSelectedIndex(null);
  }

  return (
    <div className={`rounded-2xl border-2 border-[#1D72B8] bg-white p-3 ${expanded ? "max-h-[86vh] overflow-auto" : ""}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={() => addShape("rect")} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">Rectangle</button>
        <button onClick={() => addShape("circle")} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">Circle</button>
        <button onClick={() => addShape("arrow")} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">Arrow</button>

        <div className="ml-1 flex gap-1">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => applyColor(color)}
              className={`h-7 w-7 rounded-full border-2 ${selectedColor === color ? "border-slate-900" : "border-slate-300"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <button onClick={clearLast} className="ml-auto rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-700">Undo</button>
      </div>

      <div className={expanded ? "mx-auto max-w-5xl" : ""}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-200">
          <img src={photoUrl} alt="Evidence" className="h-full w-full object-contain" />

          <svg
            className="absolute inset-0 h-full w-full touch-none"
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrag}
            onPointerLeave={stopDrag}
          >
            {localAnnotations.map((shape, index) => {
              const selected = selectedIndex === index;
              const color = shape.color || "#DC2626";

              if (shape.type === "rect") {
                const width = shape.width || 0.32;
                const height = shape.height || 0.24;

                return (
                  <g key={index}>
                    <rect
                      x={shape.x}
                      y={shape.y}
                      width={width}
                      height={height}
                      stroke={color}
                      strokeWidth="0.012"
                      fill="transparent"
                      onPointerDown={(e) => startDrag(index, "move", e)}
                    />
                    {selected && (
                      <circle
                        cx={shape.x + width}
                        cy={shape.y + height}
                        r="0.025"
                        fill={color}
                        onPointerDown={(e) => startDrag(index, "resize", e)}
                      />
                    )}
                  </g>
                );
              }

              if (shape.type === "circle") {
                const radius = shape.radius || 0.12;

                return (
                  <g key={index}>
                    <circle
                      cx={shape.x}
                      cy={shape.y}
                      r={radius}
                      stroke={color}
                      strokeWidth="0.012"
                      fill="transparent"
                      onPointerDown={(e) => startDrag(index, "move", e)}
                    />
                    {selected && (
                      <circle
                        cx={shape.x + radius}
                        cy={shape.y}
                        r="0.025"
                        fill={color}
                        onPointerDown={(e) => startDrag(index, "resize", e)}
                      />
                    )}
                  </g>
                );
              }

              const x2 = shape.x2 ?? shape.x + 0.34;
              const y2 = shape.y2 ?? shape.y;

              return (
                <g key={index}>
                  <line
                    x1={shape.x}
                    y1={shape.y}
                    x2={x2}
                    y2={y2}
                    stroke={color}
                    strokeWidth="0.012"
                    onPointerDown={(e) => startDrag(index, "move", e)}
                  />
                  <polygon
                    points={`${x2},${y2} ${x2 - 0.04},${y2 - 0.025} ${x2 - 0.04},${y2 + 0.025}`}
                    fill={color}
                    onPointerDown={(e) => startDrag(index, "arrowEnd", e)}
                  />
                  {selected && (
                    <>
                      <circle cx={shape.x} cy={shape.y} r="0.025" fill={color} onPointerDown={(e) => startDrag(index, "arrowStart", e)} />
                      <circle cx={x2} cy={y2} r="0.025" fill={color} onPointerDown={(e) => startDrag(index, "arrowEnd", e)} />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <p className="mt-2 text-xs font-bold text-slate-500">
        Tap a shape to select it. Drag the shape to move it. Drag the dot handle to resize or adjust arrow endpoints.
      </p>

      <div className="mt-3 flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-full bg-slate-200 px-4 py-2 text-xs font-black text-slate-700">Cancel</button>
        <button onClick={() => onSave(localAnnotations)} className="rounded-full bg-[#1D72B8] px-4 py-2 text-xs font-black text-white">Save</button>
      </div>
    </div>
  );
}
