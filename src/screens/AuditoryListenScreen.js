// src/screens/AuditoryListenScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

export default function AuditoryListenScreen() {
  const [playing, setPlaying] = useState(null);

  const audioList = [
    { id: "1", title: "📘 ملخص مادة الفيزياء - الحركة", duration: "5:23" },
    { id: "2", title: "🧠 مراجعة الأحياء - الخلايا", duration: "4:11" },
    { id: "3", title: "📗 درس التاريخ - الحضارة الإسلامية", duration: "6:47" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎧 جلسة الاستماع التعليمية</Text>

      <FlatList
        data={audioList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animatable.View
            animation="fadeInUp"
            duration={800}
            style={styles.audioCard}
          >
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>⏱ {item.duration}</Text>
            </View>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => setPlaying(playing === item.id ? null : item.id)}
            >
              <Ionicons
                name={playing === item.id ? "pause" : "play"}
                size={26}
                color="#fff"
              />
            </TouchableOpacity>
          </Animatable.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E3F2FD", padding: 20, alignItems: "flex-end" },
  header: { fontSize: 22, fontWeight: "bold", color: "#0D47A1", marginBottom: 15 },
  audioCard: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#BBDEFB",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
  },
  info: { alignItems: "flex-end" },
  title: { fontSize: 18, color: "#0D47A1", fontWeight: "bold" },
  time: { color: "#1565C0", marginTop: 5 },
  playBtn: {
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 50,
  },
});
