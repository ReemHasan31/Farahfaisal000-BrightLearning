// src/screens/PracticalScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";

export default function PracticalScreen() {
  const exercises = [
    { id: "1", title: "حل مسائل الرياضيات", desc: "اختبر مهاراتك بحل مسائل قصيرة.", onPress: () => Alert.alert("ابدأ التمرين") },
    { id: "2", title: "تطبيق مفاهيم الفيزياء", desc: "تجربة حركة الجسم ومحاكاة القوى.", onPress: () => Alert.alert("ابدأ التمرين") },
    { id: "3", title: "التجارب الكيميائية البسيطة", desc: "مزج مواد بأمان وتسجيل النتائج.", onPress: () => Alert.alert("ابدأ التمرين") },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🛠️ التطبيق العملي</Text>
      {exercises.map((item, idx) => (
        <Animatable.View key={item.id} animation="fadeInUp" delay={idx * 100}>
          <TouchableOpacity style={styles.card} onPress={item.onPress}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </TouchableOpacity>
        </Animatable.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FAF3E0" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#FF6F61" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 5, textAlign: "right" },
  cardDesc: { fontSize: 14, color: "#555", textAlign: "right" },
});
