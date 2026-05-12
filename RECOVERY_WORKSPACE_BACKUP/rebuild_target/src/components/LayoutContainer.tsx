import { View, Text, Image } from "react-native";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function LayoutContainer({ children }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: "#0A1F33" }}>
      
      {/* HEADER */}
      <View
        style={{
          paddingTop: 50,
          paddingBottom: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#1E293B",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* LOGO */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={{
            width: 36,
            height: 36,
            resizeMode: "contain",
          }}
        />

        {/* TEXT BLOCK */}
        <View>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "700",
            }}
          >
            Sentinel Safety
          </Text>

          <Text
            style={{
              color: "#94A3B8",
              fontSize: 11,
              marginTop: 2,
            }}
          >
            See Risk. Prevent Harm.
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1 }}>
        {children}
      </View>

      {/* FOOTER */}
      <View
        style={{
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#1E293B",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#64748B",
            fontSize: 10,
          }}
        >
          Sentinel Safety Intelligence Platform
        </Text>
      </View>
    </View>
  );
}

