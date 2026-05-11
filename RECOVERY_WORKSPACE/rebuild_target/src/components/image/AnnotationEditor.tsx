import React, { useMemo, useRef, useState } from "react";
import {
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Line, Polygon, Rect } from "react-native-svg";

export type AnnotationShape = {
  type: "rect" | "circle" | "arrow";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  x2?: number;
  y2?: number;
  color: string;
};

type Props = {
  photoUri: string;
  annotations: AnnotationShape[];
  onSave: (annotations: AnnotationShape[]) => void;
  onCancel: () => void;
};

type DragMode = "move" | "resize" | "arrowStart" | "arrowEnd" | null;

const COLORS = [
  "#DC2626",
  "#F97316",
  "#EAB308",
  "#1D72B8",
  "#16A34A",
  "#7C3AED",
  "#FFFFFF",
  "#000000",
];

const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));

const distance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.hypot(x1 - x2, y1 - y2);

function normalizeShape(shape: AnnotationShape): AnnotationShape {
  const looksPixelBased =
    shape.x > 1 ||
    shape.y > 1 ||
    (shape.width || 0) > 1 ||
    (shape.height || 0) > 1 ||
    (shape.radius || 0) > 1 ||
    (shape.x2 || 0) > 1 ||
    (shape.y2 || 0) > 1;

  if (!looksPixelBased) return shape;

  return {
    ...shape,
    x: clamp(shape.x / 300),
    y: clamp(shape.y / 280),
    width: shape.width ? clamp(shape.width / 300, 0.04, 1) : undefined,
    height: shape.height ? clamp(shape.height / 280, 0.04, 1) : undefined,
    radius: shape.radius ? clamp(shape.radius / 280, 0.03, 0.5) : undefined,
    x2: shape.x2 ? clamp(shape.x2 / 300) : undefined,
    y2: shape.y2 ? clamp(shape.y2 / 280) : undefined,
  };
}

export default function AnnotationEditor({
  photoUri,
  annotations,
  onSave,
  onCancel,
}: Props) {
  const [localAnnotations, setLocalAnnotations] = useState<AnnotationShape[]>(
    (annotations || []).map(normalizeShape)
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState("#DC2626");
  const [colorOpen, setColorOpen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 1, height: 1 });

  const dragRef = useRef<{
    mode: DragMode;
    index: number | null;
    startX: number;
    startY: number;
    original: AnnotationShape | null;
  }>({
    mode: null,
    index: null,
    startX: 0,
    startY: 0,
    original: null,
  });

  const toPx = (shape: AnnotationShape) => ({
    x: shape.x * canvasSize.width,
    y: shape.y * canvasSize.height,
    width: (shape.width || 0.32) * canvasSize.width,
    height: (shape.height || 0.24) * canvasSize.height,
    radius: (shape.radius || 0.12) * Math.min(canvasSize.width, canvasSize.height),
    x2: (shape.x2 ?? shape.x + 0.34) * canvasSize.width,
    y2: (shape.y2 ?? shape.y) * canvasSize.height,
  });

  const addShape = (type: "rect" | "circle" | "arrow") => {
    const offset = localAnnotations.length * 0.03;

    const next: AnnotationShape =
      type === "rect"
        ? {
            type,
            x: clamp(0.18 + offset),
            y: clamp(0.18 + offset),
            width: 0.36,
            height: 0.22,
            color: selectedColor,
          }
        : type === "circle"
        ? {
            type,
            x: clamp(0.38 + offset),
            y: clamp(0.32 + offset),
            radius: 0.12,
            color: selectedColor,
          }
        : {
            type,
            x: clamp(0.2 + offset),
            y: clamp(0.35 + offset),
            x2: clamp(0.68 + offset),
            y2: clamp(0.35 + offset),
            color: selectedColor,
          };

    setLocalAnnotations((current) => [...current, next]);
    setSelectedIndex(localAnnotations.length);
    setColorOpen(false);
  };

  const updateShape = (index: number, updater: (shape: AnnotationShape) => AnnotationShape) => {
    setLocalAnnotations((current) =>
      current.map((shape, i) => (i === index ? updater(shape) : shape))
    );
  };

  const hitTest = (x: number, y: number) => {
    const handleRadius = 18;

    for (let i = localAnnotations.length - 1; i >= 0; i -= 1) {
      const shape = localAnnotations[i];
      const px = toPx(shape);

      if (shape.type === "arrow") {
        if (distance(x, y, px.x, px.y) <= handleRadius) {
          return { index: i, mode: "arrowStart" as DragMode };
        }
        if (distance(x, y, px.x2, px.y2) <= handleRadius) {
          return { index: i, mode: "arrowEnd" as DragMode };
        }

        const lineDistance =
          Math.abs((px.y2 - px.y) * x - (px.x2 - px.x) * y + px.x2 * px.y - px.y2 * px.x) /
          Math.max(1, distance(px.x, px.y, px.x2, px.y2));

        if (lineDistance <= 18) return { index: i, mode: "move" as DragMode };
      }

      if (shape.type === "circle") {
        const handleX = px.x + px.radius;
        const handleY = px.y;

        if (distance(x, y, handleX, handleY) <= handleRadius) {
          return { index: i, mode: "resize" as DragMode };
        }

        if (distance(x, y, px.x, px.y) <= px.radius + 16) {
          return { index: i, mode: "move" as DragMode };
        }
      }

      if (shape.type === "rect") {
        const handleX = px.x + px.width;
        const handleY = px.y + px.height;

        if (distance(x, y, handleX, handleY) <= handleRadius) {
          return { index: i, mode: "resize" as DragMode };
        }

        if (
          x >= px.x - 12 &&
          x <= px.x + px.width + 12 &&
          y >= px.y - 12 &&
          y <= px.y + px.height + 12
        ) {
          return { index: i, mode: "move" as DragMode };
        }
      }
    }

    return { index: null, mode: null };
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          setColorOpen(false);

          const { locationX, locationY } = event.nativeEvent;
          const hit = hitTest(locationX, locationY);

          setSelectedIndex(hit.index);

          dragRef.current = {
            mode: hit.mode,
            index: hit.index,
            startX: locationX,
            startY: locationY,
            original:
              hit.index !== null
                ? { ...localAnnotations[hit.index] }
                : null,
          };
        },
        onPanResponderMove: (event) => {
          const drag = dragRef.current;
          if (drag.index === null || !drag.original || !drag.mode) return;

          const { locationX, locationY } = event.nativeEvent;
          const dx = (locationX - drag.startX) / canvasSize.width;
          const dy = (locationY - drag.startY) / canvasSize.height;

          updateShape(drag.index, (shape) => {
            const original = drag.original as AnnotationShape;

            if (drag.mode === "move") {
              return {
                ...shape,
                x: clamp(original.x + dx),
                y: clamp(original.y + dy),
                x2:
                  original.x2 !== undefined
                    ? clamp(original.x2 + dx)
                    : shape.x2,
                y2:
                  original.y2 !== undefined
                    ? clamp(original.y2 + dy)
                    : shape.y2,
              };
            }

            if (drag.mode === "resize") {
              if (shape.type === "rect") {
                return {
                  ...shape,
                  width: clamp((original.width || 0.32) + dx, 0.06, 1),
                  height: clamp((original.height || 0.24) + dy, 0.06, 1),
                };
              }

              if (shape.type === "circle") {
                const minDim = Math.min(canvasSize.width, canvasSize.height);
                const delta = Math.max(
                  (locationX - drag.startX) / minDim,
                  (locationY - drag.startY) / minDim
                );

                return {
                  ...shape,
                  radius: clamp((original.radius || 0.12) + delta, 0.04, 0.5),
                };
              }
            }

            if (drag.mode === "arrowStart") {
              return {
                ...shape,
                x: clamp(original.x + dx),
                y: clamp(original.y + dy),
              };
            }

            if (drag.mode === "arrowEnd") {
              return {
                ...shape,
                x2: clamp((original.x2 ?? original.x + 0.34) + dx),
                y2: clamp((original.y2 ?? original.y) + dy),
              };
            }

            return shape;
          });
        },
        onPanResponderRelease: () => {
          dragRef.current = {
            mode: null,
            index: null,
            startX: 0,
            startY: 0,
            original: null,
          };
        },
      }),
    [localAnnotations, canvasSize]
  );

  const deleteSelected = () => {
    if (selectedIndex === null) return;

    setLocalAnnotations((current) =>
      current.filter((_, index) => index !== selectedIndex)
    );
    setSelectedIndex(null);
  };

  return (
    <View style={styles.editorBox}>
      <Text style={styles.editorTitle}>Photo Annotation</Text>

      <View style={styles.topToolbar}>
        <Pressable style={styles.toolButton} onPress={() => addShape("rect")}>
          <View style={styles.rectIcon} />
        </Pressable>

        <Pressable style={styles.toolButton} onPress={() => addShape("circle")}>
          <View style={styles.circleIcon} />
        </Pressable>

        <Pressable style={styles.toolButton} onPress={() => addShape("arrow")}>
          <Text style={styles.arrowIcon}>→</Text>
        </Pressable>

        <View style={styles.toolbarSpacer} />

        <Text style={styles.colorLabel}>Color</Text>

        <Pressable
          style={styles.colorDropdownButton}
          onPress={() => setColorOpen(!colorOpen)}
        >
          <View
            style={[
              styles.selectedColorSquare,
              {
                backgroundColor: selectedColor,
                borderColor:
                  selectedColor === "#FFFFFF" ? "#CBD5E1" : selectedColor,
              },
            ]}
          />
          <Text style={styles.dropdownChevron}>▾</Text>
        </Pressable>
      </View>

      {colorOpen && (
        <View style={styles.colorDropdown}>
          {COLORS.map((value) => (
            <Pressable
              key={value}
              style={[
                styles.dropdownColorOption,
                {
                  backgroundColor: value,
                  borderColor:
                    value === "#FFFFFF" ? "#CBD5E1" : value,
                },
                selectedColor === value &&
                  styles.dropdownColorOptionActive,
              ]}
              onPress={() => {
                setSelectedColor(value);
                setColorOpen(false);

                if (selectedIndex !== null) {
                  updateShape(selectedIndex, (shape) => ({
                    ...shape,
                    color: value,
                  }));
                }
              }}
            />
          ))}
        </View>
      )}

      <Text style={styles.helpText}>
        Tap a shape to select it. Drag body to move. Drag orange handle to resize or adjust arrow tips.
      </Text>

      <View
        style={styles.canvas}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setCanvasSize({
            width: Math.max(1, width),
            height: Math.max(1, height),
          });
        }}
        {...panResponder.panHandlers}
      >
        <Image
          source={{ uri: photoUri }}
          style={styles.image}
          resizeMode="contain"
        />

        <Svg style={styles.svgOverlay} width="100%" height="100%">
          {localAnnotations.map((shape, index) => {
            const selected = selectedIndex === index;
            const stroke = shape.color;
            const strokeWidth = selected ? 7 : 4;
            const px = toPx(shape);

            if (shape.type === "rect") {
              return (
                <React.Fragment key={index}>
                  <Rect
                    x={px.x}
                    y={px.y}
                    width={px.width}
                    height={px.height}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />

                  {selected && (
                    <Circle
                      cx={px.x + px.width}
                      cy={px.y + px.height}
                      r={9}
                      fill="#F97316"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  )}
                </React.Fragment>
              );
            }

            if (shape.type === "circle") {
              return (
                <React.Fragment key={index}>
                  <Circle
                    cx={px.x}
                    cy={px.y}
                    r={px.radius}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />

                  {selected && (
                    <Circle
                      cx={px.x + px.radius}
                      cy={px.y}
                      r={9}
                      fill="#F97316"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  )}
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={index}>
                <Line
                  x1={px.x}
                  y1={px.y}
                  x2={px.x2}
                  y2={px.y2}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
                <Polygon
                  points={`${px.x2},${px.y2} ${px.x2 - 16},${px.y2 - 9} ${px.x2 - 16},${px.y2 + 9}`}
                  fill={stroke}
                />

                {selected && (
                  <>
                    <Circle
                      cx={px.x}
                      cy={px.y}
                      r={9}
                      fill="#F97316"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                    <Circle
                      cx={px.x2}
                      cy={px.y2}
                      r={9}
                      fill="#F97316"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.deleteButton} onPress={deleteSelected}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={styles.saveButton}
          onPress={() => onSave(localAnnotations)}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  editorBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  editorTitle: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
  },
  topToolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  toolButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 999,
    width: 42,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  rectIcon: {
    width: 23,
    height: 15,
    borderWidth: 2,
    borderColor: "#000000",
  },
  circleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000000",
  },
  arrowIcon: {
    color: "#000000",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 22,
  },
  toolbarSpacer: {
    flex: 1,
  },
  colorLabel: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
  },
  colorDropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  selectedColorSquare: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
  },
  dropdownChevron: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
  },
  colorDropdown: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    alignSelf: "flex-end",
  },
  dropdownColorOption: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
  },
  dropdownColorOptionActive: {
    borderColor: "#0F172A",
  },
  helpText: {
    color: "#64748B",
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 8,
  },
  canvas: {
    position: "relative",
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  svgOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteText: {
    color: "#991B1B",
    fontSize: 12,
    fontWeight: "900",
  },
  cancelButton: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "900",
  },
  saveButton: {
    backgroundColor: "#1D72B8",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
});
