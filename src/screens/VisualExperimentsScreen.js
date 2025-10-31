// src/screens/VisualExperimentsScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import Svg, { Circle, Rect, Line, Text as SvgText } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function VisualExperimentsScreen() {
  const [activeTab, setActiveTab] = useState("physics");

  // ---------- Gravity Playground ----------
  const [gravityObjects, setGravityObjects] = useState([]);

  const addGravityObject = () => {
    const id = Date.now();
    const x = Math.random() * (width - 80) + 40;
    const y = 50;
    const size = Math.random() * 30 + 30;
    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    setGravityObjects((prev) => [...prev, { id, x, y, size, color, vy: 0 }]);
  };

  const updateGravity = () => {
    setGravityObjects((prev) =>
      prev.map((obj) => {
        let vy = obj.vy + 0.8; // gravity acceleration
        let y = obj.y + vy;
        if (y + obj.size / 2 > height - 100) {
          y = height - 100 - obj.size / 2;
          vy *= -0.6; // bounce
        }
        return { ...obj, y, vy };
      })
    );
  };

  // ---------- Interactive Cell Explorer ----------
  const cellParts = [
    {
      id: 1,
      name: "النواة",
      x: width / 2,
      y: 120,
      color: "#ffcc00",
      desc: "النواة هي مركز التحكم في الخلية وتحوي المادة الوراثية DNA.",
    },
    {
      id: 2,
      name: "الميتوكوندريا",
      x: width / 2 - 80,
      y: 250,
      color: "#00ccff",
      desc: "الميتوكوندريا تنتج الطاقة للخلية من خلال عملية التنفس الخلوي.",
    },
    {
      id: 3,
      name: "غشاء الخلية",
      x: width / 2 + 80,
      y: 250,
      color: "#cc66ff",
      desc: "يغلف غشاء الخلية ويحمي محتوياتها وينظم مرور المواد.",
    },
  ];
  const [selectedCellPart, setSelectedCellPart] = useState(null);

  // ---------- Map & Flow Simulator ----------
  const [flowObjects, setFlowObjects] = useState([
    { id: 1, x: 50, y: 50, color: "#2196F3", vx: 1, vy: 0.8 },
    { id: 2, x: 150, y: 100, color: "#00bcd4", vx: 0.5, vy: 1 },
    { id: 3, x: 250, y: 200, color: "#4caf50", vx: 0.8, vy: 0.6 },
  ]);

  const updateFlow = () => {
    setFlowObjects((prev) =>
      prev.map((obj) => {
        let x = obj.x + obj.vx;
        let y = obj.y + obj.vy;
        if (x < 20 || x > width - 20) obj.vx *= -1;
        if (y < 50 || y > height - 150) obj.vy *= -1;
        return { ...obj, x, y };
      })
    );
  };

  // ---------- Animation Loops ----------
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === "physics") updateGravity();
      if (activeTab === "flow") updateFlow();
    }, 30);
    return () => clearInterval(interval);
  }, [activeTab, gravityObjects, flowObjects]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 تجارب بصرية تفاعلية</Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "physics" && styles.tabActive]}
          onPress={() => setActiveTab("physics")}
        >
          <Text style={styles.tabText}>⚡ فيزياء</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "cell" && styles.tabActive]}
          onPress={() => setActiveTab("cell")}
        >
          <Text style={styles.tabText}>🧬 علمية</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "flow" && styles.tabActive]}
          onPress={() => setActiveTab("flow")}
        >
          <Text style={styles.tabText}>🌍 جغرافيا</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- Physics Playground ---------- */}
      {activeTab === "physics" && (
        <View style={styles.tabContent}>
          <TouchableOpacity style={styles.addBtn} onPress={addGravityObject}>
            <Text style={styles.addBtnText}>➕ أضف جسم</Text>
          </TouchableOpacity>
          <Svg height={height - 280} width={width}>
            {gravityObjects.map((obj) => (
              <Circle
                key={obj.id}
                cx={obj.x}
                cy={obj.y}
                r={obj.size / 2}
                fill={obj.color}
              />
            ))}
          </Svg>
        </View>
      )}

      {/* ---------- Cell Explorer ---------- */}
      {activeTab === "cell" && (
        <ScrollView contentContainerStyle={styles.tabContent}>
          <Svg height={400} width={width}>
            {cellParts.map((part) => (
              <Circle
                key={part.id}
                cx={part.x}
                cy={part.y}
                r={40}
                fill={part.color}
                onPress={() => setSelectedCellPart(part)}
              />
            ))}
            {cellParts.map((part) => (
              <SvgText
                key={"text" + part.id}
                x={part.x}
                y={part.y + 60}
                fontSize="14"
                textAnchor="middle"
              >
                {part.name}
              </SvgText>
            ))}
          </Svg>
          {selectedCellPart && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>{selectedCellPart.name}</Text>
              <Text style={styles.infoDesc}>{selectedCellPart.desc}</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedCellPart(null)}
              >
                <Text style={styles.closeBtnText}>❌ أغلق</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* ---------- Flow Simulator ---------- */}
      {activeTab === "flow" && (
        <Svg height={height - 200} width={width}>
          {flowObjects.map((obj) => (
            <Circle
              key={obj.id}
              cx={obj.x}
              cy={obj.y}
              r={20}
              fill={obj.color}
            />
          ))}
          {flowObjects.map((obj) => (
            <SvgText
              key={"flowText" + obj.id}
              x={obj.x}
              y={obj.y + 30}
              fontSize="12"
              textAnchor="middle"
            >
              {"🌀"}
            </SvgText>
          ))}
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fef9f3" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 12 },
  tabRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 8 },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#ddd",
    borderRadius: 12,
  },
  tabActive: { backgroundColor: "#4f46e5" },
  tabText: { fontSize: 16, color: "#000" },
  tabContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  addBtn: {
    backgroundColor: "#00bfff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  infoBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    width: width - 40,
    elevation: 4,
  },
  infoTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  infoDesc: { fontSize: 14, color: "#333", lineHeight: 20 },
  closeBtn: {
    marginTop: 10,
    backgroundColor: "#ef4444",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  closeBtnText: { color: "#fff", fontWeight: "bold" },
});
