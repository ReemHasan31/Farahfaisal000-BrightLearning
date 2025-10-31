import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuditoryRepeatScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [sound, setSound] = useState(null);
  const [playingId, setPlayingId] = useState(null); // لتحديد أي تسجيل يعمل الآن

  // ✅ تحميل التسجيلات المحفوظة عند فتح الصفحة
  useEffect(() => {
    const loadRecordings = async () => {
      const saved = await AsyncStorage.getItem("recordings");
      if (saved) setRecordings(JSON.parse(saved));
    };
    loadRecordings();
  }, []);

  // ✅ حفظ التسجيلات تلقائياً عند أي تعديل
  const saveRecordings = async (newList) => {
    await AsyncStorage.setItem("recordings", JSON.stringify(newList));
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("🚫", "يجب السماح للتطبيق باستخدام الميكروفون.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("خطأ أثناء التسجيل:", err);
      Alert.alert("⚠️ خطأ", "حدث خطأ أثناء التسجيل.");
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const newRecording = {
        uri,
        id: Date.now().toString(),
        name: `تسجيل ${recordings.length + 1}`,
        date: new Date().toLocaleString(),
      };

      const newList = [...recordings, newRecording];
      setRecordings(newList);
      saveRecordings(newList);

      setRecording(null);
      setIsRecording(false);
      Alert.alert("✅", "تم حفظ التسجيل بنجاح!");
    } catch (err) {
      console.error("خطأ أثناء الإيقاف:", err);
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const playRecording = async (item) => {
    try {
      // وقف أي صوت آخر
      if (sound) {
        await sound.unloadAsync();
        setPlayingId(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: item.uri },
        { volume: 1.0, shouldPlay: true } // 🔊 رفع الصوت
      );

      setSound(newSound);
      setPlayingId(item.id);

      // عند انتهاء الصوت
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingId(null);
        }
      });

      await newSound.playAsync();
    } catch (err) {
      console.error("خطأ أثناء التشغيل:", err);
      Alert.alert("⚠️", "تعذر تشغيل التسجيل.");
    }
  };

  const deleteRecording = (id) => {
    Alert.alert(
      "🗑️ حذف التسجيل",
      "هل أنت متأكد أنك تريد حذف هذا التسجيل؟",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            const newList = recordings.filter((r) => r.id !== id);
            setRecordings(newList);
            saveRecordings(newList);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎙️ التكرار الشفهي</Text>
      <Text style={styles.desc}>سجّل صوتك لتثبيت المعلومات في ذاكرتك!</Text>

      <Animatable.View
        animation={isRecording ? "pulse" : "fadeIn"}
        iterationCount={isRecording ? "infinite" : 1}
        style={[
          styles.micContainer,
          { backgroundColor: isRecording ? "#E57373" : "#81C784" },
        ]}
      >
        <TouchableOpacity onPress={toggleRecording} style={styles.micButton}>
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={60}
            color="#fff"
          />
        </TouchableOpacity>
      </Animatable.View>

      <Text style={styles.status}>
        {isRecording ? "🔴 جاري التسجيل..." : "🎧 اضغط لبدء التسجيل"}
      </Text>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id}
        style={{ width: "100%", marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.recordingItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.recordName}>{item.name}</Text>
              <Text style={styles.recordDate}>{item.date}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => playRecording(item)}>
                <Ionicons
                  name={playingId === item.id ? "volume-high" : "play-circle"}
                  size={35}
                  color="#388E3C"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteRecording(item.id)}>
                <Ionicons name="trash" size={30} color="#E53935" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 26,
    color: "#2E7D32",
    fontWeight: "bold",
    marginTop: 40,
  },
  desc: {
    textAlign: "center",
    color: "#388E3C",
    fontSize: 16,
    marginVertical: 20,
  },
  micContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  micButton: {
    width: 120,
    height: 120,
    backgroundColor: "#1B5E20",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    color: "#1B5E20",
    fontSize: 18,
    fontWeight: "bold",
  },
  recordingItem: {
    backgroundColor: "#C8E6C9",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  recordName: {
    color: "#1B5E20",
    fontSize: 16,
    fontWeight: "bold",
  },
  recordDate: {
    color: "#4CAF50",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 15,
  },
});
