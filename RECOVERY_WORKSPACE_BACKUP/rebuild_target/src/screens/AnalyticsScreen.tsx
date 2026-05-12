import LayoutContainer from "../components/LayoutContainer";
import { View, Text, ScrollView } from "react-native";

// 🔷 DATA (kept from your original app)
const morningBrief = [
  {
    rank: "01",
    label: "Lockout/Tagout Critical Failure",
    desc: "Plant East has exceeded its statistical variance (+2.4σ).",
  },
  {
    rank: "02",
    label: "Fall Hazard Mitigation Overdue",
    desc: "Warehouse North has 4 high-risk findings overdue.",
  },
  {
    rank: "03",
    label: "Audit Fatigue Warning",
    desc: "Findings rate dropped 15% in high-risk zones.",
  },
];

const metrics = [
  {
    category: "Tactical Leading Indicators",
    items: [
      { label: "Mean Mitigation Time", value: "3.2 Days" },
      { label: "Risk Exposure Ratio", value: "0.24" },
      { label: "Statistical Variance", value: "+1.4σ" },
    ],
  },
  {
    category: "Strategic Metrics",
    items: [
      { label: "Hazard Recurrence Rate", value: "8.4%" },
      { label: "Risk Reduction Velocity", value: "142 pts/wk" },
      { label: "Audit Findings Rate", value: "2.4/hr" },
    ],
  },
];

export default function AnalyticsScreen() {
return (
  <LayoutContainer>
    <ScrollView style={{ flex: 1 }}>

      {/* YOUR CONTENT HERE */}
      
      {metrics.map((section, i) => (
        <View key={i} style={{ padding: 20 }}>
          <Text style={{ color: "#F97316", fontWeight: "bold", marginBottom: 10 }}>
            {section.category}
          </Text>

          {section.items.map((m, j) => (
            <View key={j} style={{ marginBottom: 10 }}>
              <Text style={{ color: "white" }}>{m.label}</Text>
              <Text style={{ color: "#38BDF8", fontSize: 20 }}>
                {m.value}
              </Text>
            </View>
          ))}
        </View>
      ))}

    </ScrollView>
  </LayoutContainer>
);
}
