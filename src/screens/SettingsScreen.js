// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function SettingsScreen() {
  // 🌗 المظهر
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large
  const [primaryColor, setPrimaryColor] = useState('#4ECDC4');

  // 🔔 الإشعارات
  const [notifications, setNotifications] = useState(true);
  const [smartMute, setSmartMute] = useState(false); 
  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(false);
  const [notificationSound, setNotificationSound] = useState('Default');

  // 🌐 اللغة
  const [language, setLanguage] = useState('Arabic'); 

  // 🔒 الخصوصية
  const [dataSharing, setDataSharing] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotifications(!notifications);
  const toggleSmartMute = () => setSmartMute(!smartMute);
  const toggleMorningReminder = () => setMorningReminder(!morningReminder);
  const toggleEveningReminder = () => setEveningReminder(!eveningReminder);
  const toggleDataSharing = () => setDataSharing(!dataSharing);

  const changeFontSize = (size) => setFontSize(size);
  const changePrimaryColor = (color) => setPrimaryColor(color);
  const changeLanguage = (lang) => setLanguage(lang);
  const changeNotificationSound = (sound) => setNotificationSound(sound);

  const handleSupport = () => Alert.alert('الدعم والمساعدة', 'تواصل معنا عبر البريد: support@example.com');
  const handlePrivacyPolicy = () => Alert.alert('سياسة الخصوصية', 'رابط سياسة الخصوصية وشروط الاستخدام');

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#FAF3E0' }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Animatable.Text animation="fadeInDown" style={[styles.screenTitle, { color: darkMode ? '#fff' : '#333' }]}>
          ⚙️ إعدادات التطبيق
        </Animatable.Text>

        {/* 🌗 المظهر */}
        <Animatable.View animation="fadeInUp" style={styles.card}>
          <Text style={styles.cardTitle}>🎨 المظهر</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>الوضع الليلي / النهاري</Text>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
          </View>

          <Text style={styles.subOptionText}>حجم النص العام للتطبيق</Text>
          <View style={styles.fontSizeRow}>
            {['small', 'medium', 'large'].map(size => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontButton,
                  { backgroundColor: fontSize === size ? primaryColor : '#ddd' }
                ]}
                onPress={() => changeFontSize(size)}
              >
                <Text style={{ color: fontSize === size ? '#fff' : '#333' }}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subOptionText}>لون التطبيق الأساسي</Text>
          <View style={styles.colorRow}>
            {['#4ECDC4', '#FF6B6B', '#FFD93D', '#8338EC', '#FF9F1C'].map(color => (
              <TouchableOpacity
                key={color}
                style={[styles.colorButton, { backgroundColor: color, borderWidth: primaryColor === color ? 2 : 0 }]}
                onPress={() => changePrimaryColor(color)}
              />
            ))}
          </View>
        </Animatable.View>

        {/* 🔔 الإشعارات */}
        <Animatable.View animation="fadeInUp" delay={50} style={styles.card}>
          <Text style={styles.cardTitle}>🔔 الإشعارات</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>تفعيل إشعارات اليوميات</Text>
            <Switch value={notifications} onValueChange={toggleNotifications} />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>الوضع الصامت الذكي</Text>
            <Switch value={smartMute} onValueChange={toggleSmartMute} />
          </View>
          <Text style={styles.subOptionText}>جدول التذكيرات</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>تذكير صباحي</Text>
            <Switch value={morningReminder} onValueChange={toggleMorningReminder} />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>تذكير مسائي</Text>
            <Switch value={eveningReminder} onValueChange={toggleEveningReminder} />
          </View>
          <Text style={styles.subOptionText}>أصوات الإشعارات</Text>
          <View style={styles.fontSizeRow}>
            {['Default', 'Chime', 'Beep'].map(sound => (
              <TouchableOpacity
                key={sound}
                style={[
                  styles.fontButton,
                  { backgroundColor: notificationSound === sound ? primaryColor : '#ddd' }
                ]}
                onPress={() => changeNotificationSound(sound)}
              >
                <Text style={{ color: notificationSound === sound ? '#fff' : '#333' }}>{sound}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animatable.View>

        {/* 🌐 اللغة */}
        <Animatable.View animation="fadeInUp" delay={100} style={styles.card}>
          <Text style={styles.cardTitle}>🌐 اللغة</Text>
          <View style={styles.fontSizeRow}>
            {['Arabic', 'English'].map(lang => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.fontButton,
                  { backgroundColor: language === lang ? primaryColor : '#ddd' }
                ]}
                onPress={() => changeLanguage(lang)}
              >
                <Text style={{ color: language === lang ? '#fff' : '#333' }}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animatable.View>

        {/* 🔒 الخصوصية */}
        <Animatable.View animation="fadeInUp" delay={150} style={styles.card}>
          <Text style={styles.cardTitle}>🔒 الخصوصية والأمان</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>مشاركة البيانات مع الخدمات الخارجية</Text>
            <Switch value={dataSharing} onValueChange={toggleDataSharing} />
          </View>
        </Animatable.View>

        {/* 🛠 الدعم والمساعدة */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
          <Text style={styles.cardTitle}>🛠 الدعم والمساعدة</Text>
          <TouchableOpacity style={styles.supportButton} onPress={handleSupport}>
            <Text style={styles.supportText}>📧 تواصل معنا</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportButton} onPress={handlePrivacyPolicy}>
            <Text style={styles.supportText}>📄 سياسة الخصوصية</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>الإصدار 1.0.0</Text>
        </Animatable.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'right' },
  optionRow: { 
    flexDirection: 'row-reverse',   // 👉 النص عاليمين والزر عالشمال
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  optionText: { fontSize: 16, textAlign: 'right', flex: 1 },
  subOptionText: { fontSize: 14, marginBottom: 5, textAlign: 'right' },
  fontSizeRow: { flexDirection: 'row-reverse', marginBottom: 10 },
  fontButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, marginLeft: 10 },
  colorRow: { flexDirection: 'row-reverse', marginBottom: 10 },
  colorButton: { width: 30, height: 30, borderRadius: 15, marginLeft: 10 },
  supportButton: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#f0f0f0', borderRadius: 10, marginBottom: 10 },
  supportText: { fontSize: 16, textAlign: 'center' },
  versionText: { fontSize: 14, textAlign: 'center', marginTop: 10 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});
