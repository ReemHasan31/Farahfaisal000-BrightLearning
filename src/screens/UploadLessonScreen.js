import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";

export default function UploadLessonScreen({ route }) {
  const { teacherId } = route.params || {}; // معرف المدرس لربطه مع الكورسات والدرس

  const [coursesOpen, setCoursesOpen] = useState(false);
  const [lessonTypeOpen, setLessonTypeOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [lessonTypes] = useState([
    { label: "سمعي (صوت)", value: "سمعي" },
    { label: "بصري (صورة/فيديو)", value: "بصري" },
    { label: "عملي (تمرين/تطبيق)", value: "عملي" },
  ]);
  const [selectedLessonType, setSelectedLessonType] = useState(null);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  // ⚡ جلب الكورسات المقبولة الخاصة بالمدرس عند تحميل الشاشة
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `http://192.168.1.18:5000/api/courses/my/${teacherId}` // endpoint للسيرفر لجلب كورسات المدرس
      );

      // فقط الكورسات المقبولة
      const acceptedCourses = res.data
        .filter((c) => c.status === "approved")
        .map((c) => ({ label: c.courseName, value: c.id }));

      setCourses(acceptedCourses);
    } catch (err) {
      console.error("Fetch Courses Error:", err);
      Alert.alert("خطأ", "تعذر جلب الكورسات");
    }
  };

  // اختيار الملف من الجهاز
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.type === "success") setFile(result);
  };

  // رفع الدرس للسيرفر
  const handleUploadLesson = async () => {
    if (!selectedCourse) return Alert.alert("خطأ", "اختر الكورس أولاً");
    if (!selectedLessonType) return Alert.alert("خطأ", "اختر نوع الدرس");
    if (!title.trim()) return Alert.alert("خطأ", "أدخل عنوان الدرس");

    const formData = new FormData();
    formData.append("teacherId", teacherId);
    formData.append("courseId", selectedCourse);
    formData.append("lessonTypes", selectedLessonType); // نوع الدرس
    formData.append("title", title); // عنوان الدرس

    if (file) {
      formData.append("file", {
        uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream",
      });
    }

    try {
      await axios.post("http://192.168.1.18:5000/api/lessons/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("نجاح", "تم رفع الدرس بنجاح!");
      setTitle("");
      setFile(null);
      setSelectedLessonType(null);
      setSelectedCourse(null);
    } catch (err) {
      console.error("Upload Error:", err);
      Alert.alert("خطأ", "تعذر رفع الدرس");
    }
  };

  return (
    <LinearGradient colors={["#FFF7E8", "#FAEEC6"]} style={styles.container}>
      <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📤 رفع درس جديد</Text>

        {/* اختيار الكورس */}
        <Text style={styles.label}>اختر الكورس</Text>
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => {
            setCoursesOpen(!coursesOpen);
            setLessonTypeOpen(false);
          }}
        >
          <Text style={styles.selectText}>
            {selectedCourse
              ? courses.find((c) => c.value === selectedCourse)?.label
              : "اختر الكورس"}
          </Text>
        </TouchableOpacity>

        {coursesOpen && (
          <View style={styles.coursesContainer}>
            {courses.map((course) => (
              <TouchableOpacity
                key={course.value}
                style={[
                  styles.courseCard,
                  selectedCourse === course.value && styles.selectedCard,
                ]}
                onPress={() => {
                  setSelectedCourse(course.value);
                  setCoursesOpen(false);
                  setLessonTypeOpen(true);
                }}
              >
                <Text
                  style={[
                    styles.courseName,
                    selectedCourse === course.value && styles.selectedCourseText,
                  ]}
                >
                  {course.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* اختيار نوع الدرس */}
        {lessonTypeOpen && (
          <>
            <Text style={styles.label}>اختر نوع الدرس</Text>
            <View style={styles.coursesContainer}>
              {lessonTypes.map((lt) => (
                <TouchableOpacity
                  key={lt.value}
                  style={[
                    styles.courseCard,
                    selectedLessonType === lt.value && styles.selectedCard,
                  ]}
                  onPress={() => {
                    setSelectedLessonType(lt.value);
                    setLessonTypeOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.courseName,
                      selectedLessonType === lt.value && styles.selectedCourseText,
                    ]}
                  >
                    {lt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* عرض الكورس والنوع المختار */}
        {selectedCourse && selectedLessonType && (
          <Text style={styles.selectedInfo}>
            🎯 الكورس: {courses.find((c) => c.value === selectedCourse)?.label} | النوع:{" "}
            {selectedLessonType}
          </Text>
        )}

        {/* عنوان الدرس */}
        <Text style={styles.label}>عنوان الدرس</Text>
        <TextInput
          style={styles.input}
          placeholder="أدخل عنوان الدرس"
          placeholderTextColor="#b8b8b8"
          value={title}
          onChangeText={setTitle}
        />

        {/* رفع ملف */}
        <TouchableOpacity style={styles.addBtn} onPress={pickFile}>
          <LinearGradient
            colors={["#8A77FF", "#54b6dc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.btnText}>
              {file ? `✅ ${file.name}` : "📁 رفع ملف/فيديو"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* زر رفع الدرس */}
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadLesson}>
          <LinearGradient colors={["#8A77FF", "#54b6dc"]} style={styles.gradient}>
            <Text style={styles.btnText}>🚀 رفع الدرس</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF7E8",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#263238",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#263238",
    marginVertical: 8,
    textAlign: "right",
  },
  input: {
    width: "100%",
    backgroundColor: "#FAEEC6",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
    textAlign: "right",
  },
  addBtn: {
    marginTop: 15,
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
  },
  uploadBtn: {
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
    marginBottom: 30,
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
  selectBox: {
    width: "100%",
    backgroundColor: "#FAEEC6",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#8A77FF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  selectText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
  },
  coursesContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#8A77FF",
    padding: 10,
    marginBottom: 10,
    maxHeight: 220,
  },
  courseCard: {
    backgroundColor: "#FAEEC6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedCard: {
    backgroundColor: "#8A77FF",
    borderColor: "#8A77FF",
  },
  courseName: {
    fontSize: 15,
    color: "#333",
    textAlign: "right",
  },
  selectedCourseText: {
    color: "#fff",
    fontWeight: "700",
  },
  selectedInfo: {
    textAlign: "center",
    color: "#263238",
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
});
