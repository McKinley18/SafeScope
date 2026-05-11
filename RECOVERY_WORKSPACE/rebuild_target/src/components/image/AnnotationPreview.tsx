import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Polygon, Rect } from "react-native-svg";
import { AnnotationShape } from "./AnnotationEditor";

type Props = {
  photoUri: string;
  annotations?: AnnotationShape[];
};

const n = (value: number, fallback = 0) => {
  if (typeof value !== "number") return fallback;
  return value > 1 ? value / 300 : value;
};

export default function AnnotationPreview({ photoUri, annotations = [] }: Props) {
  return (
    <View style={styles.previewWrap}>
      <Image source={{ uri: photoUri }} style={styles.image} resizeMode="contain" />

      <Svg style={styles.overlay} width="100%" height="100%" viewBox="0 0 1 1">
        {annotations.map((shape, index) => {
          const color = shape.color || "#DC2626";

          if (shape.type === "rect") {
            return (
              <Rect
                key={index}
                x={n(shape.x)}
                y={n(shape.y)}
                width={n(shape.width || 0.32, 0.32)}
                height={n(shape.height || 0.24, 0.24)}
                stroke={color}
                strokeWidth={0.012}
                fill="transparent"
              />
            );
          }

          if (shape.type === "circle") {
            return (
              <Circle
                key={index}
                cx={n(shape.x)}
                cy={n(shape.y)}
                r={n(shape.radius || 0.12, 0.12)}
                stroke={color}
                strokeWidth={0.012}
                fill="transparent"
              />
            );
          }

          const x2 = n(shape.x2 ?? shape.x + 0.34);
          const y2 = n(shape.y2 ?? shape.y);

          return (
            <React.Fragment key={index}>
              <Line
                x1={n(shape.x)}
                y1={n(shape.y)}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth={0.012}
              />
              <Polygon
                points={`${x2},${y2} ${x2 - 0.04},${y2 - 0.025} ${x2 - 0.04},${y2 + 0.025}`}
                fill={color}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  previewWrap: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
  },
});
