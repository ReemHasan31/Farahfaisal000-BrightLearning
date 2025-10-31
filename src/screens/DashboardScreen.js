// src/screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

export default function DashboardScreen({ navigation, route }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-width * 0.8))[0];
  const [quote, setQuote] = useState("");

  const learningStyle = route.params?.learningStyle || null;

  // 🔹 اقتباسات يومية
  const dailyQuotes = [
    "✨ اللهم لا سهل إلا ما جعلته سهلاً",
    "✨ النجاح حليف المثابرين",
    "✨ من جد وجد ومن زرع حصد",
    "✨ العلم نور والحفظ سرور",
    "✨ توكل على الله ولا تيأس",
    "✨ كل يوم خطوة نحو حلمك"
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
    setQuote(dailyQuotes[randomIndex]);
  }, []);

  // 🔹 الإشعارات
  const [notifications, setNotifications] = useState([
    "📝 لديك امتحان غدًا في الرياضيات",
    "📚 تم إضافة ملخص جديد في الفيزياء",
    "⏰ موعد الدراسة اليوم 18:00",
  ]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(true); // النقطة الحمراء

  const toggleNotif = () => {
    setNotifOpen(!notifOpen);
    if (unread) setUnread(false);
  };

  // 🔹 وظيفة القائمة الجانبية
  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: -width * 0.8,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // 🔹 عناصر القائمة الجانبية
  const menuItems = [
    { icon: '🏠', name: 'الرئيسية', screen: 'Dashboard', color: '#FF6B6B' },
    { icon: '📄', name: 'رفع الملاحظات', screen: 'Upload', color: '#4ECDC4' },
    { icon: '📚', name: 'الملخصات', screen: 'Summary', color: '#FFD93D' },
    { icon: '🃏', name: 'البطاقات التعليمية', screen: 'Flashcards', color: '#1A535C' },
    { icon: '🤖', name: 'المساعد الذكي', screen: 'Chat', color: '#FF6B6B' },
    { icon: '🗓', name: 'خطة الدراسة', screen: 'StudyPlan', color: '#4ECDC4' },
    { icon: '📖', name: 'تعلم المزيد', screen: 'LearnMore', color: '#FFD93D' },
    { icon: '🎯', name: 'الأهداف', screen: 'Goals', color: '#FF9F1C' },
    { icon: '📊', name: 'الإحصائيات', screen: 'Stats', color: '#2EC4B6' },
    { icon: '🛠', name: 'الإعدادات', screen: 'Settings', color: '#8338EC' },
    { icon: '🔒', name: 'تسجيل الخروج', screen: 'Login', color: '#FF4949' },
  ];

  // 🔹 بطاقات أسلوب التعلم
  const learningCards = {
    بصري: [
      { title: '🖼️ رؤية المفاهيم', desc: 'شاهد المفاهيم بصريًا بشكل جذاب', onPress: () => navigation.navigate('ConceptGallery') },
      { title: '🖼️ خرائط ذهنية', desc: 'أنشئ خريطة أفكارك بسهولة', onPress: () => navigation.navigate('MindMap') },

    { title: '🔮 تجارب بصرية تفاعلية', desc: 'جرّب أشكال وألوان تفاعلية', onPress: () => navigation.navigate('VisualExperiments') },
      
    ],
   سمعي: [
  { title: '🎧 الاستماع', desc: 'استمع إلى المحاضرات والملخصات الصوتية.', onPress: () => navigation.navigate('AuditoryListen') },
  { title: '🗣️ التكرار الشفهي', desc: 'سجّل صوتك لتثبيت المعلومات.', onPress: () => navigation.navigate('AuditoryRepeat') },
  { title: '🎵 الأغاني التعليمية', desc: 'تعلم بمتعة مع الأغاني التعليمية.', onPress: () => navigation.navigate('AuditorySongs') }
],

   عملي: [
  { title: '🛠️ التطبيق العملي', desc: 'قم بتطبيق ما تتعلمه مباشرة.', onPress: () => navigation.navigate('PracticalScreen') },
  { title: '📊 مشاريع صغيرة', desc: 'أنشئ مشاريع لتجربة المفاهيم.', onPress: () => navigation.navigate('MiniProjectsScreen') },
  { title: '🔬 تجارب عملية', desc: 'استخدم التجارب العملية لتثبيت المعلومات.', onPress: () => navigation.navigate('ExperimentsScreen') }
]

  };

  // 🔹 البطاقات العامة
  const generalCards = [
    { title: '📑 آخر الملخصات', desc: 'شاهد آخر ملف تم تلخيصه', onPress: () => navigation.navigate('Summary') },
    { title: '📝 أسئلة سريعة', desc: '٣ أسئلة مراجعة الآن', onPress: () => alert('ابدأ Quiz')} ,
    { title: '🎯 خطة اليوم', desc: 'رياضيات 10:00 - 11:00', onPress: () => navigation.navigate('StudyPlan') },
    { title: '🤖 المساعد الذكي', desc: 'اسألني سؤال الآن', onPress: () => navigation.navigate('Chat') },
    { title: '🌙 تحفيز اليوم', desc: '“لا تؤجل عمل اليوم إلى الغد”', onPress: null },
  ];

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF3E0" />

      {/* شريط علوي */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.topIcon}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => alert('Search')}>
          <Text style={styles.topIcon}>🔍</Text>
        </TouchableOpacity>

        {/* زر الإشعارات */}
        <TouchableOpacity onPress={toggleNotif} style={{ position: 'relative' }}>
          <Text style={styles.topIcon}>🔔</Text>
          {unread && (
            <View style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: 'red',
            }} />
          )}
        </TouchableOpacity>
      </View>

      {/* قائمة الإشعارات المنسدلة */}
      {notifOpen && (
        <Animatable.View animation="fadeInDown" style={styles.notifDropdown}>
          <ScrollView>
            {notifications.map((note, i) => (
              <View key={i} style={styles.notifItem}>
                <Text>{note}</Text>
              </View>
            ))}
          </ScrollView>
        </Animatable.View>
      )}

      {/* overlay */}
      {menuOpen && (
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu} activeOpacity={1} />
      )}

      {/* القائمة الجانبية */}
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <View style={styles.sidebarBox}>
          <View style={styles.profileSection}>
            <Text style={styles.profileAvatar}>👤</Text>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>johndoe@example.com</Text>
          </View>

          <ScrollView style={styles.menuItemsContainer}>
            {menuItems.map((item, index) => (
              <Animatable.View key={index} animation="fadeInLeft" delay={index * 50}>
                <TouchableOpacity
                  style={[styles.menuItem, { backgroundColor: item.color }]}
                  onPress={() => { navigation.navigate(item.screen); toggleMenu(); }}
                >
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={styles.menuItemText}>{item.name}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✖ إغلاق القائمة</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* محتوى Dashboard */}
      <ScrollView contentContainerStyle={styles.dashboardContainer}>
        <Animatable.Text animation="fadeInDown" style={styles.welcomeText}>
          🎓 مرحباً بك في منصتك التعليمية الذكية
        </Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={200} style={styles.dailyQuote}>
          {quote}
        </Animatable.Text>

        {/* بطاقات أسلوب التعلم */}
        {learningStyle && learningCards[learningStyle]?.map((card, idx) => (
  <Animatable.View key={idx} animation="fadeInUp" delay={idx * 100}>
    <TouchableOpacity
      style={[styles.card, { borderLeftWidth: 10, borderLeftColor: '#00bfff' }]}
      onPress={card.onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.cardTitle}>{card.title}</Text>
      <Text style={styles.cardDesc}>{card.desc}</Text>
    </TouchableOpacity>
  </Animatable.View>
))}


        {/* البطاقات العامة */}
        {generalCards.map((card, idx) => (
          <Animatable.View key={idx} animation="fadeInUp" delay={200 + idx * 100}>
            <TouchableOpacity
              style={[styles.card, { borderLeftWidth: 10, borderLeftColor: '#00bfff' }]}
              onPress={card.onPress}
            >
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.desc}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}

      </ScrollView>

      {/* شريط سفلي */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.bottomIcon}>🏠</Text>
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.bottomIcon}>👤</Text>
          <Text style={styles.bottomText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Stats')}>
          <Text style={styles.bottomIcon}>📊</Text>
          <Text style={styles.bottomText}>Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.bottomIcon}>⚙</Text>
          <Text style={styles.bottomText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FAF3E0' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, paddingVertical: 15, backgroundColor: '#fff', elevation: 5 },
  topIcon: { fontSize: 26 },

  dashboardContainer: { padding: 20, backgroundColor: '#FAF3E0', paddingBottom: 80 },
  welcomeText: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#333' },
  dailyQuote: { fontSize: 14, fontStyle: 'italic', marginBottom: 20, textAlign: 'center', color: '#666' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6, elevation: 5, marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, textAlign: 'right', writingDirection: 'rtl' },
  cardDesc: { fontSize: 14, color: '#555', textAlign: 'right', writingDirection: 'rtl' },

  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 10, elevation: 10 },
  bottomButton: { alignItems: 'center' },
  bottomIcon: { fontSize: 26, marginBottom: 2 },
  bottomText: { fontSize: 12, color: '#333' },

  sidebar: { position: 'absolute', top: 0, bottom: 0, width: width * 0.8, padding: 0, zIndex: 1000 },
  sidebarBox: { flex: 1, backgroundColor: '#fff', borderTopRightRadius: 20, borderBottomRightRadius: 20, paddingVertical: 20, paddingHorizontal: 15, elevation: 10 },
  profileSection: { alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 15 },
  profileAvatar: { fontSize: 50 },
  profileName: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  profileEmail: { fontSize: 14, color: '#666' },
  menuItemsContainer: { marginTop: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 15, marginVertical: 5, paddingVertical: 12, paddingHorizontal: 15, elevation: 6, shadowColor: '#000', shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.3, shadowRadius: 5 },
  menuItemIcon: { fontSize: 22, marginRight: 10 },
  menuItemText: { flex: 1, fontSize: 16, color: '#fff', textAlign: 'right', writingDirection: 'rtl' },
  closeButton: { marginTop: 20, alignItems: 'center' },
  closeButtonText: { color: 'red', fontSize: 16 },
  overlay: { position: 'absolute', width, height, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 900 },

  notifDropdown: {
    position: 'absolute',
    top: 60,
    right: 10,
    width: width * 0.7,
    maxHeight: height * 0.4,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
    padding: 10,
    zIndex: 1000,
  },
  notifItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
});
