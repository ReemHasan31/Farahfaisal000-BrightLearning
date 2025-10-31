// src/screens/ProfileScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
  Modal,
  TextInput,
  Share,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// ProgressBar component
function ProgressBar({ value }) {
  return (
    <View style={pStyles.container}>
      <View
        style={[
          pStyles.fill,
          { width: `${Math.min(Math.max(value * 100, 0), 100)}%` },
        ]}
      />
    </View>
  );
}

const pStyles = StyleSheet.create({
  container: { height: 12, width: '100%', backgroundColor: '#eee', borderRadius: 8, overflow: 'hidden', marginTop: 8 },
  fill: { height: '100%', backgroundColor: '#B0E0E6' },
});

export default function ProfileScreen({ navigation }) {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    (async () => {
      const mode = await AsyncStorage.getItem('darkMode');
      if (mode !== null) setDarkMode(mode === 'true');
    })();
  }, []);
  const toggleDarkMode = async (value) => {
    setDarkMode(value);
    await AsyncStorage.setItem('darkMode', value.toString());
  };

  const [user, setUser] = useState({
    name: 'فرح أحمد',
    email: 'farah@example.com',
    phone: '+970-59-xxxxxxx',
    avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
  });
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  const handleChangeAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets?.length) {
        setUser({ ...user, avatar: result.assets[0].uri });
      }
    } catch (err) {
      Alert.alert('خطأ', 'فشل اختيار الصورة.');
    }
  };

  const availableStyles = ['بصري', 'سمعي', 'عملي', 'قراءة/كتابة'];
  const [selectedStyles, setSelectedStyles] = useState(['بصري', 'قراءة/كتابة']);
  const toggleStyle = (style) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };
  const mostUsedStyle = selectedStyles.length > 0 ? selectedStyles[0] : '—';

  const [stats, setStats] = useState({
    files: 12,
    summaries: 8,
    quizzes: 24,
    studyProgress: 0.62,
  });

  const [studyHoursPerDay, setStudyHoursPerDay] = useState(2);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showDailyQuote, setShowDailyQuote] = useState(true);

  const [aiTextOnly, setAiTextOnly] = useState(false);
  const [aiLanguage, setAiLanguage] = useState('عربي');
  const [aiLevel, setAiLevel] = useState('مبسط');

  const [showPwdModal, setShowPwdModal] = useState(false);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmNewPwd, setConfirmNewPwd] = useState('');

  const dailyQuote = useMemo(
    () => 'لا تيأس — كل يوم صغير من الجهد يصنع فرقًا كبيرًا. استمر، فالنصر قريب.',
    []
  );

  const handleSaveProfile = () => {
    setUser({ ...user, name: editName, email: editEmail });
    Alert.alert('تم الحفظ', 'تم تحديث بيانات الملف الشخصي.');
  };

  const handleChangePassword = () => {
    if (!oldPwd || !newPwd || !confirmNewPwd) {
      Alert.alert('خطأ', 'الرجاء ملء كل الحقول.');
      return;
    }
    if (newPwd !== confirmNewPwd) {
      Alert.alert('خطأ', 'تأكيد كلمة المرور غير مطابق.');
      return;
    }
    setShowPwdModal(false);
    setOldPwd(''); setNewPwd(''); setConfirmNewPwd('');
    Alert.alert('نجاح', 'تم تغيير كلمة المرور.');
  };

  const handleLogout = () => {
    Alert.alert('تأكيد', 'هل تريد تسجيل الخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'نعم', onPress: () => navigation.replace?.('Login') },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert('تحذير', 'هل أنت متأكدة أنك تريدين حذف الحساب؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => {
          Alert.alert('تم', 'تم حذف الحساب (محاكاة).');
          navigation.replace?.('Welcome');
        },
      },
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `لقد أنجزت ${Math.round(stats.studyProgress * 100)}% من خطة المذاكرة! 💪📚`,
      });
    } catch (error) {
      Alert.alert('خطأ', 'فشل المشاركة.');
    }
  };

  const StatCard = ({ label, value }) => (
    <Animatable.View animation="fadeInUp" style={styles.statCard}>
      <Text style={[styles.statValue, {textAlign:'right'}]}>{value}</Text>
      <Text style={[styles.statLabel, {textAlign:'right'}]}>{label}</Text>
    </Animatable.View>
  );

  const sectionCard = [styles.sectionCard, darkMode && styles.darkSectionCard];

  return (
    <View style={[styles.mainContainer, darkMode && styles.darkMain]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor="#FAF3E0"/>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          {showDailyQuote && <Text style={styles.quote}>💡 {dailyQuote}</Text>}
          <View style={styles.modeRow}>
            <Text style={styles.modeText}>{darkMode ? 'وضع داكن' : 'الوضع العادي'}</Text>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
          </View>
        </Animatable.View>

        {/* Avatar + Editable Info */}
        <Animatable.View animation="zoomIn" style={styles.profileTop}>
          <TouchableOpacity onPress={handleChangeAvatar} style={{alignItems:'flex-start'}}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={{ fontSize: 12, color: '#555', marginTop: 4, textAlign:'right' }}>تغيير الصورة</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.editInput, darkMode && styles.darkInput, {textAlign:'right'}]}
            value={editName}
            onChangeText={setEditName}
            placeholder="الاسم الكامل"
          />
          <TextInput
            style={[styles.editInput, darkMode && styles.darkInput, {textAlign:'right'}]}
            value={editEmail}
            onChangeText={setEditEmail}
            placeholder="البريد الإلكتروني"
          />
        </Animatable.View>

        {/* Quick Actions */}
        <Animatable.View animation="fadeInUp" style={[styles.quickActionsRow, {justifyContent:'flex-start'}]}>
          <TouchableOpacity style={[styles.quickBtnImproved, darkMode && {backgroundColor:'#333'}]} onPress={() => Alert.alert('اتصل بي', 'وظيفة تجريبية')}>
            <Text style={[styles.quickBtnText, darkMode && {color:'#fff'}]}>📞 اتصل بي</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickBtnImproved, darkMode && {backgroundColor:'#333'}]} onPress={() => Alert.prompt('ملاحظاتك', 'اكتب ملاحظاتك هنا:', (text) => Alert.alert('تم الحفظ', 'تم حفظ الملاحظة: '+text))}>
            <Text style={[styles.quickBtnText, darkMode && {color:'#fff'}]}>📝 ملاحظاتك</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Stats Card */}
        <Animatable.View animation="fadeInUp" style={sectionCard}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>إنجازاتك</Text>
          <View style={styles.statsRow}>
            <StatCard label="ملفات" value={stats.files}/>
            <StatCard label="ملخصات" value={stats.summaries}/>
            <StatCard label="كويزات" value={stats.quizzes}/>
          </View>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>نسبة إنجاز خطة المذاكرة</Text>
          <ProgressChart
            data={{ data: [stats.studyProgress] }}
            width={screenWidth * 0.85}
            height={150}
            strokeWidth={16}
            radius={32}
            chartConfig={{
              backgroundColor: '#FAF3E0',
              backgroundGradientFrom: '#FAF3E0',
              backgroundGradientTo: '#FAF3E0',
              color: (opacity = 1) => `rgba(145,18,86,${opacity})`,
            }}
            hideLegend={false}
          />
          <Text style={[styles.progressPercent, darkMode && styles.darkText]}>{Math.round(stats.studyProgress * 100)}%</Text>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.shareBtnText}>📤 مشاركة الإنجاز</Text>
          </TouchableOpacity>
        </Animatable.View>

        {/* Learning Styles Card */}
        <Animatable.View animation="fadeInUp" style={sectionCard}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>أسلوب/أساليب التعلم</Text>
          <Text style={[styles.smallNote, darkMode && styles.darkText]}>اختاري واحد أو أكثر لتخصيص التجربة</Text>
          <View style={styles.stylesRow}>
            {availableStyles.map((s) => {
              const selected = selectedStyles.includes(s);
              return (
                <TouchableOpacity key={s} onPress={() => toggleStyle(s)} style={[styles.styleBadge, selected && styles.styleBadgeActive]}>
                  <Text style={[styles.styleText, selected && styles.styleTextActive]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.badgeRow}>
            <Text style={[styles.smallNote, darkMode && styles.darkText]}>أكثر أسلوب مستخدم:</Text>
            <View style={styles.mostBadge}><Text style={styles.mostBadgeText}>{mostUsedStyle}</Text></View>
          </View>
        </Animatable.View>

        {/* Study Plan Card */}
        <Animatable.View animation="fadeInUp" style={sectionCard}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>إعدادات الخطة الدراسية</Text>
          <View style={styles.row}>
            <Text style={[styles.label, darkMode && styles.darkText]}>ساعات الدراسة اليومية</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity style={styles.counterBtn} onPress={()=>setStudyHoursPerDay(h=>Math.max(0,h-1))}><Text style={styles.counterBtnText}>−</Text></TouchableOpacity>
              <Text style={[styles.counterValue, darkMode && styles.darkText]}>{studyHoursPerDay} س</Text>
              <TouchableOpacity style={styles.counterBtn} onPress={()=>setStudyHoursPerDay(h=>Math.min(24,h+1))}><Text style={styles.counterBtnText}>+</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}><Text style={[styles.label, darkMode && styles.darkText]}>التذكيرات والإشعارات</Text><Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled}/></View>
          <View style={styles.row}><Text style={[styles.label, darkMode && styles.darkText]}>عرض اقتباس يومي</Text><Switch value={showDailyQuote} onValueChange={setShowDailyQuote}/></View>
        </Animatable.View>

        {/* AI Assistant Card */}
        <Animatable.View animation="fadeInUp" style={sectionCard}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>إعدادات المساعد الذكي</Text>
          <View style={styles.row}><Text style={[styles.label, darkMode && styles.darkText]}>نوع الرد: نص فقط</Text><Switch value={aiTextOnly} onValueChange={setAiTextOnly}/></View>
          <View style={styles.row}><Text style={[styles.label, darkMode && styles.darkText]}>اللغة</Text>
            <View style={[styles.langRow, {justifyContent:'flex-start'}]}>
              <TouchableOpacity onPress={()=>setAiLanguage('عربي')} style={[styles.langBtn, aiLanguage==='عربي'&&styles.langBtnActive]}><Text style={[styles.langText, aiLanguage==='عربي'&&styles.langTextActive]}>عربي</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>setAiLanguage('English')} style={[styles.langBtn, aiLanguage==='English'&&styles.langBtnActive]}><Text style={[styles.langText, aiLanguage==='English'&&styles.langTextActive]}>English</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}><Text style={[styles.label, darkMode && styles.darkText]}>مستوى الذكاء</Text>
            <View style={[styles.langRow, {justifyContent:'flex-start'}]}>
              <TouchableOpacity onPress={()=>setAiLevel('مبسط')} style={[styles.langBtn, aiLevel==='مبسط'&&styles.langBtnActive]}><Text style={[styles.langText, aiLevel==='مبسط'&&styles.langTextActive]}>مبسط</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>setAiLevel('متقدم')} style={[styles.langBtn, aiLevel==='متقدم'&&styles.langBtnActive]}><Text style={[styles.langText, aiLevel==='متقدم'&&styles.langTextActive]}>متقدم</Text></TouchableOpacity>
            </View>
          </View>
        </Animatable.View>

        {/* Security Card */}
        <Animatable.View animation="fadeInUp" style={sectionCard}>
          <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>الأمان وحماية الحساب</Text>
          <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#B0E0E6'}]} onPress={()=>setShowPwdModal(true)}><Text style={[styles.actionBtnText, {color:'#004C66', textAlign:'left'}]}>🔒 تغيير كلمة المرور</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#B0E0E6'}]} onPress={handleDeleteAccount}><Text style={[styles.actionBtnText, {color:'#004C66', textAlign:'left'}]}>🗑️ حذف الحساب</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, {backgroundColor:'#B0E0E6'}]} onPress={handleLogout}><Text style={[styles.actionBtnText, {color:'#004C66', textAlign:'left'}]}>🚪 تسجيل الخروج</Text></TouchableOpacity>
        </Animatable.View>

        {/* Save Button */}
        <Animatable.View animation="fadeInUp" style={{width:'90%', marginBottom:40}}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}><Text style={[styles.saveBtnText, {textAlign:'left'}]}>💾 حفظ التغييرات</Text></TouchableOpacity>
        </Animatable.View>

      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={showPwdModal} transparent animationType="slide" onRequestClose={()=>setShowPwdModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, darkMode && styles.darkModal]}>
            <Text style={[styles.modalTitle, darkMode && styles.darkText]}>تغيير كلمة المرور</Text>
            <TextInput placeholder="كلمة المرور الحالية" value={oldPwd} onChangeText={setOldPwd} secureTextEntry style={[styles.modalInput, darkMode && styles.darkInput, {textAlign:'right'}]} />
            <TextInput placeholder="كلمة المرور الجديدة" value={newPwd} onChangeText={setNewPwd} secureTextEntry style={[styles.modalInput, darkMode && styles.darkInput, {textAlign:'right'}]} />
            <TextInput placeholder="تأكيد كلمة المرور الجديدة" value={confirmNewPwd} onChangeText={setConfirmNewPwd} secureTextEntry style={[styles.modalInput, darkMode && styles.darkInput, {textAlign:'right'}]} />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={()=>setShowPwdModal(false)}><Text style={[styles.modalBtnText, {textAlign:'left'}]}>إلغاء</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleChangePassword}><Text style={[styles.modalBtnText, {textAlign:'left'}]}>حفظ</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
// ===== Styles =====
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FAF3E0' },
  darkMain: { backgroundColor: '#121212' },
  container: { alignItems: 'center', paddingVertical: 20 },
  header: { width: '90%', marginBottom: 20 },
  quote: { fontSize: 14, color: '#444', marginBottom: 10, textAlign: 'center' },
  modeRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  modeText: { fontSize: 14, color: '#444', textAlign: 'right' },
  profileTop: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#B0E0E6' },
  editInput: { width: '85%', borderBottomWidth: 1, borderColor: '#B0E0E6', marginVertical: 5, paddingVertical: 4, textAlign: 'right' },
  darkInput: { borderColor: '#555', color: '#B0E0E6' },
  quickActionsRow: { flexDirection: 'row-reverse', width: '90%', marginBottom: 15 },
  quickBtnImproved: { flex: 1, padding: 10, marginHorizontal: 5, backgroundColor: '#B0E0E6', borderRadius: 10, alignItems: 'center' },
  quickBtnText: { color: '#4B0082', fontWeight: '600' },
  statsRow: { flexDirection: 'row-reverse', justifyContent: 'space-around', marginVertical: 10 },
  statCard: { alignItems: 'center', padding: 10, backgroundColor: '#B0E0E6', borderRadius: 10, width: 80 },
  statValue: { fontWeight: 'bold', fontSize: 16, textAlign: 'right' },
  statLabel: { fontSize: 12, color: '#444', textAlign: 'right' },
  sectionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginVertical: 10, width: '90%', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  darkSectionCard: { backgroundColor: '#1C1C1C' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#1C1C1C', textAlign: 'right' },
  darkText: { color: '#fff' },
  smallNote: { fontSize: 12, color: '#444', textAlign: 'right' },
  stylesRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'flex-start' },
  styleBadge: { borderWidth: 1, borderColor: '#1775a1a8', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, margin: 4 },
  styleBadgeActive: { backgroundColor: '#1775a1a8' },
  styleText: { color: '#0c3069a8' },
  styleTextActive: { color: '#fff' },
  badgeRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  mostBadge: { backgroundColor: '#1775a1a8', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  mostBadgeText: { color: '#fff', fontSize: 12, textAlign: 'center' },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  label: { fontSize: 14, color: '#444', textAlign: 'right' },
  counterRow: { flexDirection: 'row', alignItems: 'center' },
  counterBtn: { backgroundColor: '#B0E0E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginHorizontal: 5 },
  counterBtnText: { fontSize: 18, fontWeight: 'bold' },
  counterValue: { fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
  langRow: { flexDirection: 'row-reverse' },
  langBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#1775a1a8', marginHorizontal: 5 },
  langBtnActive: { backgroundColor: '#1775a1a8' },
  langText: { color: '#0c3069a8' },
  langTextActive: { color: '#fff' },
  
  // === أزرار الأمان وحماية الحساب ===
  actionBtn: { padding: 10, borderRadius: 10, marginVertical: 5, alignItems: 'center' },
  actionBtnText: { fontWeight: 'bold', textAlign: 'center' },

  // === زر حفظ التغييرات ===
  saveBtn: { backgroundColor: '#053254a8', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

  // === زر مشاركة الإنجاز ===
  shareBtn: { backgroundColor: '#B0E0E6', padding: 10, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  shareBtnText: { color: '#4B0082', fontWeight: 'bold', textAlign: 'center' },

  // === نسبة الإنجاز على ProgressChart ===
  progressPercent: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginTop: 8, color: '#0a3164ff' },
});
