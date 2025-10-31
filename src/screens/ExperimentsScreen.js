// src/screens/ExperimentsScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as Animatable from "react-native-animatable";

export default function ExperimentsScreen() {
  const experiments = [
    { id: "1", title: "تجربة الصوت", desc: "تغيير مستوى الصوت ومشاهدة النتائج.", onPress: () => Alert.alert("ابدأ التجربة") },
    { id: "2", title: "تجربة الكيمياء", desc: "مزج مواد وملاحظة اللون.", onPress: () => Alert.alert("ابدأ التجربة") },
    { id: "3", title: "تجربة الفيزياء", desc: "محاكاة سقوط جسم ورسم المسار.", onPress: () => Alert.alert("ابدأ التجربة") },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🔬 تجارب عملية</Text>
      {experiments.map((item, idx) => (
        <Animatable.View key={item.id} animation="fadeInUp" delay={idx * 100}>
          <TouchableOpacity style={[styles.card, { backgroundColor: "#88B04B" }]} onPress={item.onPress}>
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
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#88B04B" },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 5, textAlign: "right", color: "#fff" },
  cardDesc: { fontSize: 14, color: "#f0f0f0", textAlign: "right" },
});
