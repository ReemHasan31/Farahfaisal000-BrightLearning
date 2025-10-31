// src/screens/MindMapFunScreen.js
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import Svg, { Polyline, Circle, Rect, Line, Text as SvgText } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const COLORS = ["#fefc54ff", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

export default function MindMapFunScreen() {
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState(null);

  const [shapes, setShapes] = useState([]);
  const [texts, setTexts] = useState([]);

  const [tool, setTool] = useState("pen"); // pen | circle | rect | text | eraser
  const [strokeColor, setStrokeColor] = useState("#4f46e5");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [textSize, setTextSize] = useState(18);

  const [selectedElement, setSelectedElement] = useState(null);

  const [textModalVisible, setTextModalVisible] = useState(false);
  const [textInputValue, setTextInputValue] = useState("");
  const [selectedTextPosition, setSelectedTextPosition] = useState(null);

  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [mapNameInput, setMapNameInput] = useState("");

  const [savedMapsList, setSavedMapsList] = useState([]);

  const panResponder = useRef(null);

  // تحميل قائمة الخرائط المحفوظة عند فتح الشاشة
  useEffect(() => {
    loadSavedMapsList();
  }, []);

  const loadSavedMapsList = async () => {
    const savedMaps = JSON.parse(await AsyncStorage.getItem("savedMaps")) || {};
    setSavedMapsList(Object.keys(savedMaps));
  };

  // حركة العناصر والنصوص
  const moveShape = (id, dx, dy) => {
    setShapes((s) =>
      s.map((sh) =>
        sh.id === id
          ? {
              ...sh,
              x: sh.x + dx,
              y: sh.y + dy,
              x2: sh.x2 ? sh.x2 + dx : undefined,
              y2: sh.y2 ? sh.y2 + dy : undefined,
            }
          : sh
      )
    );
  };
  const moveText = (id, dx, dy) => {
    setTexts((t) => t.map((tx) => (tx.id === id ? { ...tx, x: tx.x + dx, y: tx.y + dy } : tx)));
  };

  // حذف العناصر
  const removeShapeById = (id) => setShapes((s) => s.filter((sh) => sh.id !== id));
  const removeTextById = (id) => setTexts((t) => t.filter((tx) => tx.id !== id));
  const removeStrokeById = (id) => setStrokes((s) => s.filter((st) => st.id !== id));

  // تحديد عنصر
  const selectElement = (type, id) => setSelectedElement({ type, id });

  // أداة الرسم
  panResponder.current = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const x = evt.nativeEvent.locationX;
      const y = evt.nativeEvent.locationY;

      if (tool === "pen") setCurrentStroke([{ x, y }]);
      else if (tool === "circle" || tool === "rect") {
        const id = Date.now();
        const color = `hsl(${Math.floor(Math.random() * 360)},70%,70%)`;
        if (tool === "circle") setShapes((s) => [...s, { id, type: "circle", x, y, r: 40, color }]);
        if (tool === "rect") setShapes((s) => [...s, { id, type: "rect", x: x - 50, y: y - 30, w: 100, h: 60, color }]);
        setTool("pen");
      } else if (tool === "text") {
        setSelectedTextPosition({ x, y });
        setTextModalVisible(true);
      } else if (tool === "eraser") {
        const nearbyShape = shapes.find((sh) => Math.abs(sh.x - x) < 50 && Math.abs(sh.y - y) < 50);
        if (nearbyShape) removeShapeById(nearbyShape.id);
        const nearbyText = texts.find((t) => Math.abs(t.x - x) < 50 && Math.abs(t.y - y) < 20);
        if (nearbyText) removeTextById(nearbyText.id);
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      const dx = gestureState.dx;
      const dy = gestureState.dy;

      if (tool === "pen" && currentStroke) {
        const x = evt.nativeEvent.locationX;
        const y = evt.nativeEvent.locationY;
        setCurrentStroke((prev) => {
          const last = prev[prev.length - 1];
          if (Math.abs(last.x - x) < 1 && Math.abs(last.y - y) < 1) return prev;
          return [...prev, { x, y }];
        });
      } else if (selectedElement) {
        if (selectedElement.type === "shape") moveShape(selectedElement.id, dx, dy);
        if (selectedElement.type === "text") moveText(selectedElement.id, dx, dy);
      }
    },
    onPanResponderRelease: () => {
      if (tool === "pen" && currentStroke) {
        const id = Date.now();
        setStrokes((s) => [...s, { id, points: currentStroke, color: strokeColor, width: strokeWidth }]);
        setCurrentStroke(null);
      }
      setSelectedElement(null);
    },
  });

  const confirmAddText = () => {
    if (!textInputValue.trim()) {
      setTextModalVisible(false);
      setTextInputValue("");
      return;
    }
    const id = Date.now();
    setTexts((t) => [
      ...t,
      {
        id,
        text: textInputValue.trim(),
        x: selectedTextPosition.x,
        y: selectedTextPosition.y,
        fontSize: textSize,
        color: "#000000",
      },
    ]);
    setTextInputValue("");
    setSelectedTextPosition(null);
    setTextModalVisible(false);
    setTool("pen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟✨ ابتكر خريطتك التعليمية🎨📚</Text>

      {/* ألوان القلم */}
      <View style={styles.colorRow}>
        {COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.colorBtn, { backgroundColor: c, borderWidth: strokeColor === c ? 3 : 0 }]}
            onPress={() => setStrokeColor(c)}
          />
        ))}
      </View>

      {/* حجم القلم والنص */}
      <View style={styles.sizeRow}>
        <TouchableOpacity onPress={() => setStrokeWidth((w) => Math.max(1, w - 1))}>
          <Text style={styles.sizeBtn}>➖ قلم</Text>
        </TouchableOpacity>
        <Text style={styles.sizeText}>حجم القلم: {strokeWidth}</Text>
        <TouchableOpacity onPress={() => setStrokeWidth((w) => w + 1)}>
          <Text style={styles.sizeBtn}>➕ قلم</Text>
        </TouchableOpacity>
      </View>

      {/* منطقة الرسم */}
      <View style={styles.canvasContainer} {...panResponder.current.panHandlers}>
        <Svg height={height} width={width} style={{ backgroundColor: "#fef9f3" }}>
          {strokes.map((s) => (
            <Polyline
              key={s.id}
              points={s.points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth={s.width}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {currentStroke && (
            <Polyline
              points={currentStroke.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {shapes.map((sh) => {
            if (sh.type === "circle")
              return <Circle key={sh.id} cx={sh.x} cy={sh.y} r={sh.r} fill={sh.color} onPress={() => selectElement("shape", sh.id)} />;
            if (sh.type === "rect")
              return <Rect key={sh.id} x={sh.x} y={sh.y} width={sh.w} height={sh.h} rx={8} fill={sh.color} onPress={() => selectElement("shape", sh.id)} />;
            return null;
          })}
          {texts.map((t) => (
            <SvgText key={t.id} x={t.x} y={t.y} fontSize={t.fontSize} fill={t.color} textAnchor="middle" onPress={() => selectElement("text", t.id)}>
              {t.text}
            </SvgText>
          ))}
        </Svg>
      </View>

      {/* أدوات عائمة */}
      <View style={styles.toolsRow}>
        <TouchableOpacity style={[styles.toolBtn, tool === "pen" && styles.toolBtnActive]} onPress={() => setTool("pen")}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolBtn, tool === "circle" && styles.toolBtnActive]} onPress={() => setTool("circle")}>
          <Ionicons name="ellipse" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolBtn, tool === "rect" && styles.toolBtnActive]} onPress={() => setTool("rect")}>
          <Ionicons name="square" size={20} color="#fff" />
        </TouchableOpacity>

        {/* زر قائمة الخرائط المحفوظة */}
        <TouchableOpacity
          style={styles.toolBtn}
          onPress={() => {
            if (savedMapsList.length === 0) {
              Alert.alert("لا توجد خرائط محفوظة", "الرجاء حفظ خريطة أولاً");
              return;
            }
            setSaveModalVisible(true);
          }}
        >
          <Ionicons name="map" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.toolBtn, tool === "text" && styles.toolBtnActive]} onPress={() => setTool("text")}>
          <Ionicons name="text" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolBtn, tool === "eraser" && styles.toolBtnActive]} onPress={() => setTool("eraser")}>
          <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolBtn, tool === "save" && styles.toolBtnActive]} onPress={() => setSaveModalVisible(true)}>
          <Ionicons name="save" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* مودال النص */}
      <Modal visible={textModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>أدخل نصك ✍️</Text>
            <TextInput
              placeholder="يمكنك إضافة سمايلات 😊🎉"
              value={textInputValue}
              onChangeText={setTextInputValue}
              style={styles.modalInput}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setTextModalVisible(false)}>
                <Text style={styles.modalBtnText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalConfirm]} onPress={confirmAddText}>
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>إضافة</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* مودال الحفظ/فتح الخرائط */}
      <Modal visible={saveModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>احفظ أو افتح خريطتك 🌟</Text>
            <TextInput
              placeholder="اسم الخريطة"
              value={mapNameInput}
              onChangeText={setMapNameInput}
              style={styles.modalInput}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setSaveModalVisible(false);
                  setMapNameInput("");
                }}
              >
                <Text style={styles.modalBtnText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalConfirm]}
                onPress={async () => {
                  if (!mapNameInput.trim()) return;
                  const savedMaps = JSON.parse(await AsyncStorage.getItem("savedMaps")) || {};
                  savedMaps[mapNameInput.trim()] = { strokes, shapes, texts };
                  await AsyncStorage.setItem("savedMaps", JSON.stringify(savedMaps));
                  Alert.alert("تم الحفظ ✅", `تم حفظ الخريطة باسم: ${mapNameInput.trim()}`);
                  setMapNameInput("");
                  setSaveModalVisible(false);
                  loadSavedMapsList();
                }}
              >
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>احفظ</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 150, marginTop: 10 }}>
              {savedMapsList.map((name) => (
                <TouchableOpacity
                  key={name}
                  style={[styles.modalBtn, { marginVertical: 3 }]}
                  onPress={async () => {
                    const savedMaps = JSON.parse(await AsyncStorage.getItem("savedMaps")) || {};
                    const map = savedMaps[name];
                    if (map) {
                      setStrokes(map.strokes);
                      setShapes(map.shapes);
                      setTexts(map.texts);
                      setSaveModalVisible(false);
                      Alert.alert("تم التحميل ✅", `تم فتح الخريطة: ${name}`);
                    }
                  }}
                >
                  <Text style={styles.modalBtnText}>{name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fef9f3" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 12 },
  canvasContainer: { flex: 1 },
  toolsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffdd99",
    paddingVertical: 8,
    borderRadius: 12,
    margin: 8,
  },
  toolBtn: { backgroundColor: "#4f46e5", padding: 10, borderRadius: 12, alignItems: "center" },
  toolBtnActive: { backgroundColor: "#00bfff" },
  colorRow: { flexDirection: "row", justifyContent: "center", marginBottom: 8 },
  colorBtn: { width: 30, height: 30, borderRadius: 15, marginHorizontal: 5 },
  sizeRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: 5 },
  sizeBtn: { fontSize: 18, marginHorizontal: 5, padding: 5, backgroundColor: "#ddd", borderRadius: 6 },
  sizeText: { fontSize: 16, marginHorizontal: 5 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "85%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  modalInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginBottom: 12 },
  modalBtns: { flexDirection: "row", justifyContent: "space-between" },
  modalBtn: { padding: 10, borderRadius: 8, minWidth: 100, alignItems: "center", borderWidth: 1, borderColor: "#ddd" },
  modalConfirm: { backgroundColor: "#00bfff", borderWidth: 0 },
  modalBtnText: { color: "#333" },
});
