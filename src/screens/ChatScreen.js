// src/screens/AIAssistantScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

export default function AIAssistantScreen({ navigation, route }) {
  const { aiLanguage = 'عربي', aiLevel = 'مبسط', aiTextOnly = true, darkMode = false } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const recordInterval = useRef(null);
  const flatListRef = useRef();

  // ---------- إرسال رسالة نصية ----------
  const handleSend = (text) => {
    if (!text.trim()) return;
    const userMsg = { type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiMsg = {
        type: 'ai',
        text: aiTextOnly
          ? `🤖 (${aiLanguage}, ${aiLevel}): ${text.split('').reverse().join('')}`
          : `🤖 (${aiLanguage}, ${aiLevel}) الرد على: ${text}`,
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 500);
  };

  // ---------- مسح الرسائل ----------
  const handleClear = () => setMessages([]);

  // ---------- تسجيل الصوت ----------
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('يرجى السماح بالوصول للميكروفون');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);

      // بدء العداد
      setRecordTime(0);
      recordInterval.current = setInterval(() => setRecordTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      clearInterval(recordInterval.current);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setRecordTime(0);

      const userMsg = { type: 'user', text: '🎤 رسالة صوتية', audio: uri };
      setMessages(prev => [...prev, userMsg]);

      // رد AI بعد الإرسال
      setTimeout(() => {
        const aiMsg = { type: 'ai', text: `🤖 (${aiLanguage}, ${aiLevel}) تم استلام الصوت` };
        setMessages(prev => [...prev, aiMsg]);
      }, 500);
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  // ---------- تشغيل الصوت ----------
  const playAudio = async (uri) => {
    try {
      const sound = new Audio.Sound();
      await sound.loadAsync({ uri });
      await sound.playAsync();
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  };

  // ---------- عرض الرسائل ----------
  const renderMessage = ({ item }) => {
    const isUser = item.type === 'user';
    const hasAudio = !!item.audio;

    return (
      <Animatable.View
        animation="fadeInUp"
        duration={300}
        style={[
          styles.msgBubbleContainer,
          isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' },
        ]}
      >
        <LinearGradient
          colors={isUser ? ['#FF6B6B', '#FF8787'] : ['#4ECDC4', '#2EC4B6']}
          start={[0, 0]}
          end={[1, 1]}
          style={[styles.msgBubble, isUser ? styles.userBubble : styles.aiBubble]}
        >
          {hasAudio ? (
            <TouchableOpacity onPress={() => playAudio(item.audio)}>
              <Text style={[styles.msgText, darkMode && { color: '#fff' }]}>🎵 تشغيل الصوت</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.msgText, darkMode && { color: '#fff' }]}>{item.text}</Text>
          )}
        </LinearGradient>
      </Animatable.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, darkMode && { backgroundColor: '#121212' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.headerText, darkMode && { color: '#fff' }]}>⬅️</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, darkMode && { color: '#fff' }]}>المساعد الذكي 🤖</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={[styles.headerText, { color: '#B22222' }]}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 15, paddingBottom: 180 }}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      {/* شريط تسجيل الصوت أثناء التسجيل */}
      {recording && (
        <View style={styles.recordingBar}>
          <Text style={{ color: '#fff' }}>🎙️ تسجيل... {recordTime}s</Text>
        </View>
      )}

      {/* Input + Send + Record */}
      <View style={[styles.inputContainer, darkMode && { backgroundColor: '#222' }]}>
        <TextInput
          style={[styles.input, darkMode && { color: '#fff', backgroundColor: '#333' }]}
          placeholder="اكتب سؤالك..."
          placeholderTextColor={darkMode ? '#aaa' : '#666'}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          onPress={recording ? stopRecording : startRecording}
          style={[styles.sendBtn, { backgroundColor: recording ? '#B22222' : '#911256a8' }]}
        >
          <Text style={styles.sendText}>{recording ? '⏹️' : '🎙️'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSend(input)} style={styles.sendBtn}>
          <Text style={styles.sendText}>📤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF3E0' },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: Platform.OS === 'ios' ? 40 : 0,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  headerText: { fontSize: 18, fontWeight: 'bold' },

  msgBubbleContainer: { flexDirection: 'row', marginVertical: 4 },
  msgBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: { borderTopRightRadius: 0 },
  aiBubble: { borderTopLeftRadius: 0 },
  msgText: { fontSize: 14, color: '#fff', textAlign: 'right' },

  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
    color: '#000',
    maxHeight: 80,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: '#911256a8',
    padding: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: '#fff', fontSize: 18 },

  recordingBar: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#911256',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
});
