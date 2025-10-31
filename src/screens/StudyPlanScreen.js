import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  I18nManager,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// تفعيل RTL
I18nManager.forceRTL(true);

export default function StudyPlanScreen() {
  const [currentStep, setCurrentStep] = useState("subject"); 
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [task, setTask] = useState("");

  const [plan, setPlan] = useState([]);
  const [importantTasks, setImportantTasks] = useState([]);
  const [prayers, setPrayers] = useState([
    { name: "الفجر", done: false },
    { name: "الظهر", done: false },
    { name: "العصر", done: false },
    { name: "المغرب", done: false },
    { name: "العشاء", done: false },
  ]);

  const suggestedTimes = ["08:00 - 09:00", "09:30 - 10:30", "11:00 - 12:00", "13:00 - 14:00"];
  const suggestedDates = ["اليوم", "غدًا", "بعد يومين", "هذا الأسبوع"];

 const motivationalQuotes = [
  "اليوم يومك لتتألق! 🌟",
  "كل خطوة صغيرة تقربك من النجاح! 🚀",
  "ابدأ الآن، لا تنتظر الغد! ⏰",
  "حقق أحلامك بخطواتك اليوم! ✨",
  "تعلم، اجتهد، وتقدم كل يوم! 💪",
  "كل مهمة تنجزها تجعلك أقوى! 🔥",
];


  const randomQuote = () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const nextStep = () => {
    if (currentStep === "subject" && subject.trim() !== "") setCurrentStep("time");
    else if (currentStep === "time" && time.trim() !== "") setCurrentStep("date");
    else if (currentStep === "date" && date.trim() !== "") setCurrentStep("task");
    else if (currentStep === "task" && task.trim() !== "") {
      const conflict = plan.some(p => p.date === date && p.time === time);
      if (conflict) {
        Alert.alert(
          "تنبيه",
          "يوجد مهمة أخرى في نفس الوقت والتاريخ! الرجاء اختيار وقت آخر.",
          [{ text: "موافق", onPress: () => setCurrentStep("time") }]
        );
        return;
      }

      const id = Date.now();
      setPlan((prev) => [...prev, { id, subject, time, date, task }]);
      setSubject(""); setTime(""); setDate(""); setTask(""); 
      setCurrentStep("subject");
    } else {
      Alert.alert("تنبيه", "الرجاء ملء الحقل الحالي للانتقال للخطوة التالية");
    }
  };

  const removePlanItem = (id) => setPlan((prev) => prev.filter((p) => p.id !== id));
  const markPrayer = (index) => {
    const newPrayers = [...prayers];
    newPrayers[index].done = !newPrayers[index].done;
    setPrayers(newPrayers);
  };

  const addImportantTask = () => {
    if (task.trim() === "") return;
    const id = Date.now();
    setImportantTasks((prev) => [...prev, { id, task }]);
    setTask("");
  };
  const removeImportantTask = (id) => setImportantTasks((prev) => prev.filter(t => t.id !== id));

  return (
    <ScrollView style={styles.container}>
  <Text style={[styles.title, { textAlign: "center" }]}> خطة الدراسة اليومية</Text>

      <Text style={styles.subtitle}>خطط يومك خطوة خطوة واستمتع بوقتك 📘</Text>

      {/* خطوات إضافة خطة */}
      <View style={styles.stepContainer}>
        {currentStep === "subject" && (
          <>
            <Text style={styles.stepLabel}>أدخل اسم المادة أو النشاط:</Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: رياضيات"
              value={subject}
              onChangeText={setSubject}
            />
          </>
        )}
        {currentStep === "time" && (
          <>
            <Text style={styles.stepLabel}>اختر الوقت أو أدخله:</Text>
            <FlatList
              data={suggestedTimes}
              horizontal
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestionBtn} onPress={() => setTime(item)}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TextInput
              style={styles.input}
              placeholder="أدخل وقت آخر"
              value={time}
              onChangeText={setTime}
            />
          </>
        )}
        {currentStep === "date" && (
          <>
            <Text style={styles.stepLabel}>اختر التاريخ أو أدخله:</Text>
            <FlatList
              data={suggestedDates}
              horizontal
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.suggestionBtn} onPress={() => setDate(item)}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TextInput
              style={styles.input}
              placeholder="أدخل تاريخ آخر"
              value={date}
              onChangeText={setDate}
            />
          </>
        )}
        {currentStep === "task" && (
          <>
            <Text style={styles.stepLabel}>أدخل المهمة المحددة:</Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: حل تمارين الكتاب"
              value={task}
              onChangeText={setTask}
            />
          </>
        )}

        <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
          <Text style={styles.nextBtnText}>
            {currentStep === "task" ? "حفظ المهمة" : "التالي ➡️"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* قائمة الخطة اليومية */}
      <Text style={styles.sectionTitle}>📝 المهام اليومية</Text>
      {/* قائمة الخطة اليومية */}
{plan.map((p) => (
  <View
    key={p.id}
    style={[
      styles.card,
      { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFF9C4" },
    ]}
  >
   <View style={{ flex: 1 }}>
  <Text style={[styles.cardTitle, { textAlign: "right", marginBottom: 5 }]}>{p.subject}</Text>
  <Text style={[styles.cardText, { textAlign: "right", marginBottom: 3 }]}>🕒 {p.time}</Text>
  <Text style={[styles.cardText, { textAlign: "right", marginBottom: 3 }]}>📅 {p.date}</Text>
  <Text style={[styles.cardText, { textAlign: "right", marginBottom: 0 }]}>✅ {p.task}</Text>
</View>

    {/* Trash على اليسار */}
    <TouchableOpacity style={styles.removeBtn} onPress={() => removePlanItem(p.id)}>
      <Ionicons name="trash" size={22} color="#fff" />
    </TouchableOpacity>
  </View>
))}


{/* المهام المهمة */}
<Text style={styles.sectionTitle}>⭐ المهام المهمة</Text>
<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
  {/* زر ➕ على اليسار */}
  <TouchableOpacity style={styles.addBtn} onPress={addImportantTask}>
    <Text style={{ color: "#fff", fontWeight: "bold" }}>➕</Text>
  </TouchableOpacity>
  <TextInput
    style={[styles.input, { flex: 1, textAlign: "right", marginLeft: 10 }]} // بدل marginRight استخدم marginLeft
    placeholder="أدخل مهمة مهمة"
    value={task}
    onChangeText={setTask}
  />
</View>


      {importantTasks.map(t => (
        <View key={t.id} style={[styles.card, { backgroundColor: "#FFCDD2", flexDirection: "row", justifyContent: "space-between" }]}>
          <Text style={[styles.cardText, { textAlign: "right", flex: 1 }]}>{t.task}</Text>
          <TouchableOpacity onPress={() => removeImportantTask(t.id)}>
            <Ionicons name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}

      {/* الصلوات */}
      <Text style={styles.sectionTitle}>🕌 صلواتي</Text>
      {prayers.map((p, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.card, { backgroundColor: p.done ? "#C8E6C9" : "#cde7fdff", flexDirection: "row", justifyContent: "space-between" }]}
          onPress={() => markPrayer(i)}
        >
          <Text style={[styles.cardText, { textAlign: "right", flex: 1 , fontWeight: "bold" }]}>{p.done ? "✅ " : "☐ "}{p.name}</Text>
        </TouchableOpacity>
      ))}

      {/* تحفيز */}
      <View style={[styles.card, { backgroundColor: "#FFF3E0", marginTop: 20 }]}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#FF7043", textAlign: "right", alignSelf: "flex-end" }}>
          {randomQuote()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "right", marginBottom: 5, color: "#FF7043" },
  subtitle: { fontSize: 16, color: "#555", textAlign: "right", marginBottom: 20 },
  stepContainer: { marginBottom: 20 },
  stepLabel: { fontSize: 16, fontWeight: "600", marginBottom: 8, textAlign: "right" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
    textAlign: "right",
  },
  suggestionBtn: {
    backgroundColor: "#FFD54F",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  suggestionText: { fontSize: 14, textAlign: "center" },
  nextBtn: {
    backgroundColor: "#FF7043",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  nextBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10, color: "#000000ff", textAlign: "right" },
  card: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5, textAlign: "right" },
  cardText: { fontSize: 16, textAlign: "right" },
  removeBtn: {
    backgroundColor: "#FF5252",
    padding: 6,
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: "#f5d8c9ff",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
