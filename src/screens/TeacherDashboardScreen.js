// src/screens/TeacherDashboardScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios'; // تحتاج تثبيت axios: npm install axios

const { width, height } = Dimensions.get('window');

export default function TeacherDashboardScreen({ navigation, route }) {
  const { firstName, lastName, teacherId } = route.params || {};

  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-width * 0.8))[0];
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  // بيانات إحصائية تجريبية
  const chartData = [
    { name: 'منجزة', population: 52, color: '#7FD3F5', legendFontColor: '#7A7A7A', legendFontSize: 12 },
    { name: 'قيد التنفيذ', population: 28, color: '#FFBAC8', legendFontColor: '#7A7A7A', legendFontSize: 12 },
    { name: 'مجدولة', population: 20, color: '#F7E7C4', legendFontColor: '#7A7A7A', legendFontSize: 12 },
  ];

  // امتحانات وكويزات
  const examsAndQuizzes = [
    { title: 'كويز: هيكلة البيانات', type: 'Quiz', date: '2025-10-20', time: '10:00' },
    { title: 'امتحان: مشروع التخرج', type: 'Exam', date: '2025-10-22', time: '14:00' },
    { title: 'كويز: البرمجة المتقدمة', type: 'Quiz', date: '2025-10-23', time: '12:00' },
  ];

  // الرزنامة الأسبوعية
  const weeklySchedule = [
    { day: 'الاثنين', course: 'Data Structures', time: '10:00 - 12:00', color: '#7FD3F5' },
    { day: 'الثلاثاء', course: 'Algorithms', time: '12:00 - 14:00', color: '#FFBAC8' },
    { day: 'الأربعاء', course: 'Operating Systems', time: '14:00 - 16:00', color: '#F7E7C4' },
    { day: 'الخميس', course: 'Database', time: '10:00 - 12:00', color: '#C7F0D8' },
    { day: 'الجمعة', course: 'Networking', time: '12:00 - 14:00', color: '#FFD93D' },
  ];

  const quickActions = [
    { icon: 'cloud-upload-outline', label: 'رفع درس', onPress: () => Alert.alert('رفع درس') },
    { icon: 'create-outline', label: 'مهمة جديدة', onPress: () => Alert.alert('مهمة جديدة') },
    { icon: 'chatbubble-outline', label: 'الرسائل', onPress: () => Alert.alert('الرسائل') },
    { icon: 'people-outline', label: 'قائمة الطلاب', onPress: () => Alert.alert('قائمة الطلاب') },
  ];

  const menuItems = [
    { icon: '🏠', name: 'الرئيسية', screen: 'TeacherDashboard', color: '#FF6B6B' },
    { 
    icon: '➕', 
    name: 'إضافة مادة', 
    screen: 'AddCourse', 
    color: '#82CD47',
    params: { teacherId: route.params?.teacherId } // <-- التعديل هنا
  },
{ icon: '💬', name: 'الرسائل', screen: 'Messages', color: '#6C63FF' },
 
    { icon: '📄', name: 'رفع درس', screen: 'Uploadlesson', color: '#4ECDC4',  params: { teacherId: route.params?.teacherId }},
    { icon: '📝', name: 'المهام', screen: 'TeacherTasks', color: '#FFD93D' },
    { icon: '📊', name: 'الإحصائيات', screen: 'TeacherStats', color: '#2EC4B6' },
    { icon: '🎓', name: 'قائمة الطلاب', screen: 'StudentList', color: '#3FC1C9' },
    { icon: '📑', name: 'الاختبارات', screen: 'ExamsScreen', color: '#FFD93D' },
    { icon: '🔒', name: 'تسجيل الخروج', screen: 'Login', color: '#FF4949' },
  ];

  const markedDates = useMemo(() => {
    const m = {};
    examsAndQuizzes.forEach((e) => {
      m[e.date] = {
        marked: true,
        dotColor: e.type === 'Quiz' ? '#FFD93D' : '#FF6B6B',
        activeOpacity: 0,
      };
    });
    return m;
  }, [examsAndQuizzes]);

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, { toValue: -width * 0.8, duration: 300, useNativeDriver: false }).start(() =>
        setMenuOpen(false)
      );
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
    }
  };

  const toggleNotif = () => {
    setNotifOpen(!notifOpen);
    if (unread) setUnread(false);
  };

  const onDayPress = (day) => {
    const dayStr = day.dateString;
    const events = examsAndQuizzes.filter((e) => e.date === dayStr);
    if (events.length === 0) {
      Alert.alert('لا توجد فعاليات', 'لا توجد امتحانات أو كويزات في هذا اليوم.');
      return;
    }
    const details = events.map((ev) => `${ev.title}\n${ev.time} — ${ev.type}`).join('\n\n');

    Alert.alert('فعاليات اليوم', details);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF3E0" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerWrap}>
          <View style={styles.hamLine} />
          <View style={[styles.hamLine, { width: 18 }]} />
          <View style={[styles.hamLine, { width: 14 }]} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>لوحة المعلم</Text>

        <TouchableOpacity onPress={toggleNotif} style={{ position: 'relative', paddingHorizontal: 8 }}>
          <Text style={styles.topIcon}>🔔</Text>
          {unread && <View style={styles.notifBadge} />}
        </TouchableOpacity>
      </View>


      {menuOpen && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} activeOpacity={1} />}

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { left: slideAnim }]}>
        <View style={styles.sidebarBox}>
          <View style={styles.profileSection}>
            <Text style={styles.profileAvatar}>👩‍🏫</Text>
           <Text style={styles.profileName}>
  د. {route.params?.firstName || ''} {route.params?.lastName || ''}
</Text>


<Text style={styles.profileEmail}>
  {/* لو عندك البريد من الداتا بيس ممكن تمرريه كمان */}
  {route.params?.email || 'teacher@example.com'}
</Text>

          </View>

          <ScrollView style={styles.menuItemsContainer}>
            {menuItems.map((item, idx) => (
              <Animatable.View key={idx} animation="fadeInLeft" delay={idx * 40}>
                <TouchableOpacity
                  style={[styles.menuItem, { backgroundColor: item.color }]}
                  onPress={() => {
                    toggleMenu();
                    navigation?.navigate?.(item.screen, item.params);
                  }}
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

      <ScrollView contentContainerStyle={styles.dashboardContainer} showsVerticalScrollIndicator={false}>
        <Animatable.Text animation="fadeInDown" style={styles.welcomeText}>
  مرحباً بك، د. {firstName || ''} {lastName || ''} 💙
</Animatable.Text>



        {/* Card: ملخص نشاط الطلاب */}
        <Animatable.View animation="fadeInUp" delay={80}>
          <TouchableOpacity
            style={{
              backgroundColor: '#54b6dc82',
              borderRadius: 16,
              padding: 20,
              marginBottom: 16,
              elevation: 3,
              alignItems: 'center',
            }}
            onPress={() => setDetailsModalVisible(true)}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#25404a' }}>ملخص نشاط الطلاب 📋</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Calendar */}
        <Animatable.View animation="fadeInUp" delay={160} style={{ marginTop: 12 }}>
        <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>
  الروزنامة
</Text>

          <View style={styles.calendarWrap}>
            <Calendar
              onDayPress={onDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: '#FAF3E0',
                calendarBackground: '#fff',
                todayTextColor: '#FF6B6B',
                arrowColor: '#25404a',
                monthTextColor: '#25404a',
                textSectionTitleColor: '#586976',
                selectedDayBackgroundColor: '#25404a',
              }}
              style={{ borderRadius: 12 }}
            />
          </View>
          <Text style={[styles.calendarHint, { textAlign: 'center' }]}>
  اضغط/ي على يوم لعرض الفعاليات
</Text>

        </Animatable.View>

      {/* 🌟 Premium Weekly Calendar Widget */}
<Animatable.View
  animation="fadeInUp"
  delay={200}
  style={{
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  }}
>
  {/* خلفية متدرجة متغيرة حسب اليوم */}
  <View
    style={{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#fff',
      opacity: 0.95,
    }}
  />
  <View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
    }}
  >
    <View
      style={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#FFD36B',
        opacity: 0.25,
      }}
    />
    <View
      style={{
        position: 'absolute',
        bottom: -60,
        left: -40,
        width: 180,
        height: 180,
        borderRadius: 100,
        backgroundColor: '#FAF3E0',
        opacity: 0.3,
      }}
    />
  </View>

  {/* العنوان */}
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <Text style={{ fontSize: 16, fontWeight: '800', color: '#25404a' }}>روزنامة اليوم</Text>
    <Ionicons name="calendar-clear-outline" size={22} color="#25404a" />
  </View>

  {/* اليوم الحالي */}
  <Animatable.View animation="fadeIn" delay={300} style={{ marginTop: 12 }}>
    <Text style={{ fontSize: 28, fontWeight: '800', color: '#25404a' }}>
      {new Date().toLocaleDateString('ar-EG', { weekday: 'long' })}
    </Text>
    <Text style={{ fontSize: 13, color: '#777', marginTop: 3 }}>
      {new Date().toLocaleDateString('ar-EG', { month: 'long', day: 'numeric' })}
    </Text>
  </Animatable.View>

  {/* المادة القادمة */}
  <Animatable.View
    animation="fadeInUp"
    delay={450}
    style={{
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 12,
      marginTop: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 3,
      elevation: 2,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons
        name="book-outline"
        size={20}
        color="#FFD36B"
        style={{ marginRight: 8 }}
      />
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#25404a' }}>
        {weeklySchedule[0].course}
      </Text>
    </View>
    <Text style={{ fontSize: 13, color: '#666' }}>{weeklySchedule[0].time}</Text>
  </Animatable.View>
</Animatable.View>


        {/* Chart */}
        <Animatable.View animation="fadeInUp" delay={200} style={{ marginTop: 16, alignItems: 'center' }}>
          <PieChart
            data={chartData}
            width={Math.min(width - 40, 360)}
            height={170}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: (opacity = 1) => `rgba(90,90,90,${opacity})`,

              labelColor: () => '#7A7A7A',
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            center={[0, 0]}
          />
        </Animatable.View>

     {/* ✨ إجراءات سريعة (تصميم احترافي) */}
<Animatable.View animation="fadeInUp" delay={250} style={{alignItems: 'center', marginTop: 20 }}>
  <Text style={styles.sectionTitle}>إجراءات سريعة</Text>

  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    }}
  >
    {/* 💬 الرسائل */}
    <TouchableOpacity
      onPress={() => Alert.alert('الرسائل')}
      style={styles.quickActionCard}
    >
      <LinearGradient
        colors={['#54b6dc82', '#8A77FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <Ionicons name="chatbubbles-outline" size={26} color="#fff" />
        <Text style={styles.quickActionText}>الرسائل</Text>
      </LinearGradient>
    </TouchableOpacity>

   
    <TouchableOpacity
      
      onPress={() => navigation.navigate('Course',  { teacherId })}


      style={styles.quickActionCard}
    >
      <LinearGradient
        colors={['#54b6dc82', '#45B7AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <Ionicons name="add-circle-outline" size={26} color="#fff" />
        <Text style={styles.quickActionText}>إضافة مهمة</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
</Animatable.View>
      </ScrollView>

      {/* Details Modal */}
      <Modal
        visible={detailsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', paddingHorizontal: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, maxHeight: '80%', paddingVertical: 20, paddingHorizontal: 15 }}>
            <Text style={{ fontSize: 20, fontWeight: '900', textAlign: 'center', marginBottom: 12, color: '#25404a' }}>
              لوحة المعلم 📊
            </Text>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 10 }}>
              {[
                { title: 'الطلاب', value: 120, icon: '👩‍🎓', color: '#4D9DE0' },
                { title: 'الدورات', value: 8, icon: '📚', color: '#3FC1C9' },
                { title: 'الدروس', value: 35, icon: '📄', color: '#F4D35E' },
                { title: 'المهام', value: 12, icon: '📝', color: '#EE6C4D' },
              ].map((card, idx) => (
                <Animatable.View
                  key={idx}
                  animation="bounceIn"
                  delay={idx * 100}
                  style={{
                    backgroundColor: card.color,
                    width: '90%',
                    borderRadius: 16,
                    marginVertical: 6,
                    paddingVertical: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 3,
                  }}
                >
                  <Text style={{ fontSize: 28 }}>{card.icon}</Text>
                  <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 5 }}>
                    {card.value}
                  </Text>
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 2 }}>
                    {card.title}
                  </Text>
                </Animatable.View>
              ))}

              <TouchableOpacity
                onPress={() => setDetailsModalVisible(false)}
                style={{ marginTop: 15, backgroundColor: '#FF6B6B', paddingVertical: 10, paddingHorizontal: 35, borderRadius: 18, elevation: 3 }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>إغلاق</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('TeacherDashboard')}>
          <Text style={styles.bottomIcon}>🏠</Text>
          <Text style={styles.bottomText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.bottomIcon}>👤</Text>
          <Text style={styles.bottomText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('TeacherStats')}>
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

  topBar: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  hamburgerWrap: { padding: 6 },
  hamLine: { height: 3, backgroundColor: '#25404a', borderRadius: 3, width: 22, marginBottom: 4 },
  topTitle: { fontSize: 18, fontWeight: '700', color: '#25404a' },
  topIcon: { fontSize: 22 },
  notifBadge: { position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: 6, backgroundColor: 'red', borderWidth: 1, borderColor: '#fff' },

  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 10 },
  sidebar: { position: 'absolute', top: 0, bottom: 0, width: width * 0.8, zIndex: 11 },
  sidebarBox: { flex: 1, backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 16 },
  profileSection: { alignItems: 'center', marginBottom: 18 },
  profileAvatar: { fontSize: 48 },
  profileName: { fontWeight: '700', fontSize: 18, marginTop: 8 },
  profileEmail: { fontSize: 12, color: '#7A7A7A' },
  menuItemsContainer: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, marginVertical: 6 },
  menuItemIcon: { fontSize: 20, marginRight: 12 },
  menuItemText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  closeButton: { alignItems: 'center', marginVertical: 20 },
  closeButtonText: { color: '#FF4949', fontWeight: '700' },

  dashboardContainer: { paddingHorizontal: 12, paddingBottom: 80 },
  welcomeText: { fontSize: 22, fontWeight: '800', marginVertical: 12, textAlign: 'center', color: '#25404a' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: '#25404a' },
  calendarWrap: { borderRadius: 12, overflow: 'hidden', marginBottom: 6 },
  calendarHint: { fontSize: 12, color: '#7A7A7A', marginTop: 4 },

  weekCard: { borderRadius: 12, padding: 12, elevation: 3 },
  weekDay: { fontSize: 14, fontWeight: '700', color: '#25404a' },
  weekCourse: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  weekTime: { fontSize: 12, color: '#25404a', marginTop: 2 },

  quickActions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '48%', paddingVertical: 16, borderRadius: 14, marginBottom: 8 },
  actionLabel: { color: '#fff', fontWeight: '700', marginLeft: 8 },
quickActionCard: {
  flex: 1,
  marginHorizontal: 5,
  borderRadius: 18,
  overflow: 'hidden',
  elevation: 4,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 6,
},
gradientBackground: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 18,
  borderRadius: 18,
},
quickActionText: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '700',
  marginLeft: 8,
},

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 58,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bottomButton: { justifyContent: 'center', alignItems: 'center' },
  bottomIcon: { fontSize: 20 },
  bottomText: { fontSize: 10 },
});