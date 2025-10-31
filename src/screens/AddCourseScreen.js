// src/screens/AddCourseScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

export default function AddCourseScreen({ navigation, route }) {
  const { teacherId } = route.params || {};
  console.log("TeacherId:", teacherId);

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [price, setPrice] = useState("");

  const handleAddCourse = async () => {
    if (!teacherId || !courseCode.trim() || !courseName.trim()) {
      Alert.alert("خطأ", "يرجى إدخال جميع الحقول المطلوبة");
      return;
    }

    const payload = {
      teacherId,
      courseCode: courseCode.trim(),
      courseName: courseName.trim(),
      description: description.trim(),
      maxStudents: maxStudents ? parseInt(maxStudents) : 30,
      durationHours: durationHours ? parseInt(durationHours) : 0,
      price: price ? parseFloat(price) : 0,
    };

    try {
      const res = await axios.post("http://192.168.1.18:5000/api/courses/add", payload);
      Alert.alert("تم بنجاح", res.data.message);
      setCourseCode("");
      setCourseName("");
      setDescription("");
      setMaxStudents("");
      setDurationHours("");
      setPrice("");
    } catch (err) {
      Alert.alert("خطأ", err.response?.data?.message || "حدث خطأ أثناء الإرسال");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF7E8" />

      <View style={styles.card}>
        <Text style={styles.title}>إضافة كورس جديد</Text>

        {/* كود الكورس */}
        <Text style={styles.label}>كود الكورس 🔑</Text>
        <TextInput
          style={styles.input}
          placeholder="CS101"
          placeholderTextColor="#b8b8b8"
          value={courseCode}
          onChangeText={setCourseCode}
        />

        {/* اسم الكورس */}
        <Text style={styles.label}>اسم الكورس 📝</Text>
        <TextInput
          style={styles.input}
          placeholder="أدخل اسم الكورس"
          placeholderTextColor="#b8b8b8"
          value={courseName}
          onChangeText={setCourseName}
        />

        {/* وصف الكورس */}
        <Text style={styles.label}>وصف الكورس 📄</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="أدخل وصف الكورس"
          placeholderTextColor="#b8b8b8"
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* مدة وعدد الطلاب */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginEnd: 8 }}>
            <Text style={styles.label}>مدة الكورس ⏱</Text>
            <TextInput
              style={styles.input}
              placeholder="40"
              placeholderTextColor="#b8b8b8"
              keyboardType="numeric"
              value={durationHours}
              onChangeText={setDurationHours}
            />
          </View>
          <View style={{ flex: 1, marginStart: 8 }}>
            <Text style={styles.label}>عدد الطلاب 👥</Text>
            <TextInput
              style={styles.input}
              placeholder="30"
              placeholderTextColor="#b8b8b8"
              keyboardType="numeric"
              value={maxStudents}
              onChangeText={setMaxStudents}
            />
          </View>
        </View>

        {/* السعر */}
        <Text style={styles.label}>سعر الكورس 💰</Text>
        <TextInput
          style={styles.input}
          placeholder="150.00"
          placeholderTextColor="#b8b8b8"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        {/* الأزرار */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAddCourse}>
          <LinearGradient
            colors={["#8A77FF", "#54b6dc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.btnText}>➕ إضافة الكورس</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewBtn}
          onPress={() => navigation.navigate("MyCourses", { teacherId })}
        >
          <Text style={styles.viewBtnText}>📋 عرض مساقاتي</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF7E8", // الخلفية البيج الفاتح
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    color: "#263238",
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#263238",
    marginBottom: 6,
    marginTop: 10,
    textAlign: "center", // العنوان بالوسط
  },
  input: {
    backgroundColor: "#FAEEC6", // نفس لون الحقول بالصورة
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    textAlign: "center", // النص بالوسط أيضًا
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addBtn: {
    marginTop: 25,
    borderRadius: 20,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 20,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  viewBtn: {
    marginTop: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#8A77FF",
    alignItems: "center",
    paddingVertical: 15,
  },
  viewBtnText: {
    color: "#8A77FF",
    fontWeight: "700",
    fontSize: 16,
  },
});
