// src/screens/MyCoursesScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  I18nManager,
} from "react-native";
import axios from "axios";

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function MyCoursesScreen({ route }) {
  const { teacherId } = route.params;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `http://192.168.1.18:5000/api/courses/my/${teacherId}`
      );
      setCourses(res.data);
      console.log("📦 Data:", res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#54b6dc" />
      </View>
    );

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return { color: "#2D6A4F", backgroundColor: "#D8F3DC" };
      case "pending":
        return { color: "#B68B00", backgroundColor: "#FFF3BF" };
      case "rejected":
        return { color: "#C1121F", backgroundColor: "#FFD6D6" };
      default:
        return { color: "#555", backgroundColor: "#EEE" };
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📚 مـسـاقـاتـي</Text>

      {courses.length === 0 ? (
        <Text style={styles.emptyText}>لا توجد مساقات حتى الآن 😔</Text>
      ) : (
        courses.map((c) => {
          const statusStyle = getStatusStyle(c.status);
          return (
            <View key={c.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.courseName}>{c.courseName}</Text>
                <Text
                  style={[
                    styles.status,
                    {
                      backgroundColor: statusStyle.backgroundColor,
                      color: statusStyle.color,
                    },
                  ]}
                >
                  {c.status === "approved"
                    ? "✅ مقبول"
                    : c.status === "pending"
                    ? "⌛ قيد الانتظار"
                    : "❌ مرفوض"}
                </Text>
              </View>

              <Text style={styles.courseCode}>📘 الكود: {c.courseCode}</Text>

              {c.description ? (
                <Text style={styles.desc}>📄 {c.description}</Text>
              ) : null}

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>عدد الطلاب: {c.maxStudents || 0}</Text>
                  <Text style={styles.emoji}>👥</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>
                    مدة الكورس: {c.durationHours || 0} ساعة
                  </Text>
                  <Text style={styles.emoji}>⏰</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>
                  ₪ {Number(c.price) ? Number(c.price).toFixed(2) : "0.00"}
                </Text>
                <Text style={styles.priceLabel}>💰 السعر</Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC",
    flexGrow: 1,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1D3557",
    textAlign: "center",
    marginBottom: 25,
    letterSpacing: 1,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderRightWidth: 6,
    borderRightColor: "#54b6dc",
  },
  cardHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2B2D42",
    flex: 1,
    textAlign: "right",
  },
  status: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  courseCode: {
    color: "#457B9D",
    fontSize: 15,
    marginBottom: 6,
    textAlign: "right",
  },
  desc: {
    color: "#6C757D",
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
    textAlign: "right",
  },
  infoSection: {
    backgroundColor: "#F1F3F5",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  infoText: {
    fontSize: 15,
    color: "#343A40",
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
  },
  emoji: {
    fontSize: 18,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E9ECEF",
    marginVertical: 6,
  },
  priceRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 15,
    color: "#1B4332",
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1B4332",
  },
});
