// src/screens/AuditorySongsScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export default function AuditorySongsScreen() {
  const [current, setCurrent] = useState(null);
  const [soundObj, setSoundObj] = useState(null);

  const songs = [
    { 
      id: "1", 
      title: "🎶 أغنية جدول الضرب", 
      artist: "تعليم ممتع", 
      image: "https://cdn-icons-png.flaticon.com/512/3656/3656968.png",
      uri: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"
    },
    { 
      id: "2", 
      title: "🧮 أغنية الأعداد", 
      artist: "أصوات التعليم", 
      image: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
      uri: "https://www.learningcontainer.com/wp-content/uploads/2020/02/AudioSample.mp3"
    },
    { 
  id: "3", 
  title: "🌍 أغنية الكواكب", 
  artist: "رحلة في الفضاء", 
  image: "https://cdn-icons-png.flaticon.com/512/9543/9543718.png",
  uri: "https://www.learningcontainer.com/wp-content/uploads/2020/02/ImperialMarch.mp3"
},
  ];

  const playPauseSong = async (item) => {
    try {
      // إذا نفس الأغنية مشغلة، أوقفها
      if (current === item.id && soundObj) {
        await soundObj.stopAsync();
        await soundObj.unloadAsync();
        setCurrent(null);
        setSoundObj(null);
        return;
      }

      // أوقف أي أغنية حالية
      if (soundObj) {
        await soundObj.stopAsync();
        await soundObj.unloadAsync();
      }

      // تحميل الأغنية محليًا (لتجنب مشاكل iOS)
      const localUri = FileSystem.cacheDirectory + item.id + ".mp3";
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (!fileInfo.exists) {
        await FileSystem.downloadAsync(item.uri, localUri);
      }

      // إنشاء وتشغيل الصوت من الملف المحلي
      const { sound } = await Audio.Sound.createAsync(
        { uri: localUri },
        { shouldPlay: true }
      );

      setSoundObj(sound);
      setCurrent(item.id);

      // عند انتهاء الأغنية
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setCurrent(null);
          setSoundObj(null);
        }
      });

    } catch (err) {
      console.error("خطأ أثناء تشغيل الأغنية:", err);
      Alert.alert("خطأ", "لم يتمكن من تشغيل الأغنية. تحقق من اتصال الإنترنت أو الرابط.");
      setCurrent(null);
      setSoundObj(null);
    }
  };

  const renderItem = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={700} style={styles.songCard}>
      <Image source={{ uri: item.image }} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>
      <TouchableOpacity
        onPress={() => playPauseSong(item)}
        style={styles.playBtn}
      >
        <Ionicons
          name={current === item.id ? "pause" : "play"}
          size={30}
          color="#fff"
        />
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎵 الأغاني التعليمية</Text>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8E1", padding: 20 },
  header: { fontSize: 28, color: "#F57C00", fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  songCard: {
    flexDirection: "row-reverse",
    backgroundColor: "#FFE0B2",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },
  songImage: { width: 80, height: 80, borderRadius: 15, marginLeft: 15 },
  songInfo: { flex: 1, alignItems: "flex-end" },
  songTitle: { color: "#BF360C", fontSize: 20, fontWeight: "bold" },
  songArtist: { color: "#E64A19", marginTop: 5 },
  playBtn: {
    width: 55,
    height: 55,
    backgroundColor: "#F57C00",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
