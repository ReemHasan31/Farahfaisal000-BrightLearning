import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";

export default function MiniProjectsScreen() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [notes, setNotes] = useState("");
  const [edited, setEdited] = useState(false); // لتتبع أول كتابة

  const handleCodeChange = (text) => {
    if (!edited) {
      // إزالة النص الافتراضي عند أول كتابة
      setCode(text.replace("// اكتب هنا", ""));
      setEdited(true);
    } else {
      setCode(text);
    }
  };

  const runCode = () => {
    try {
      const result = eval(code); // ⚠️ للتجربة فقط
      setOutput(String(result));
    } catch (err) {
      setOutput("❌ خطأ: " + err.message);
    }
  };

  const resetCode = () => {
    setCode("// اكتب هنا"); // إعادة النص الافتراضي
    setOutput("");
    setEdited(false); // إعادة الحالة
  };

  const saveNotes = () => {
    Alert.alert("تم حفظ الملاحظات", notes);
    setNotes("");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>💻 مشروع برمجي صغير</Text>

      <Text style={styles.subHeader}>📝 اكتب كودك هنا:</Text>
      <TextInput
        style={styles.codeInput}
        multiline
        value={code}
        onChangeText={handleCodeChange}
        placeholder="// اكتب هنا"
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.runBtn} onPress={runCode}>
        <Text style={styles.runBtnText}>▶️ تشغيل الكود</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetBtn} onPress={resetCode}>
        <Text style={styles.resetBtnText}>♻️ إعادة الكتابة</Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>📊 الناتج:</Text>
      <View style={styles.outputBox}>
        <Text style={styles.outputText}>{output}</Text>
      </View>

      <Text style={styles.subHeader}>📝 سجل ملاحظاتك:</Text>
      <TextInput
        style={styles.notesInput}
        multiline
        value={notes}
        onChangeText={setNotes}
        placeholder="اكتب ملاحظاتك بعد التجربة"
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={saveNotes}>
        <Text style={styles.saveBtnText}>💾 حفظ الملاحظات</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FAF3E0" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#6B5B95" },
  subHeader: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginTop: 15, 
    marginBottom: 5, 
    color: "#333",
    textAlign: "right" // ← العناوين الآن على اليمين
  },
  codeInput: { backgroundColor: "#fff", padding: 15, borderRadius: 10, minHeight: 150, fontFamily: "monospace", fontSize: 14, color: "#333" },
  runBtn: { backgroundColor: "#845b95ff", padding: 15, borderRadius: 10, marginTop: 10, alignItems: "center" },
  runBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  resetBtn: { backgroundColor: "#f0a500", padding: 15, borderRadius: 10, marginTop: 10, alignItems: "center" },
  resetBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  outputBox: { backgroundColor: "#fff", padding: 15, borderRadius: 10, minHeight: 80, marginTop: 5 },
  outputText: { color: "#333", fontSize: 14 },
  notesInput: { backgroundColor: "#fff", padding: 15, borderRadius: 10, minHeight: 100, marginTop: 5 },
  saveBtn: { backgroundColor: "#f4a5a5ff", padding: 15, borderRadius: 10, marginTop: 10, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
