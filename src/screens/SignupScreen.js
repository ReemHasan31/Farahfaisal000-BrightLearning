import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(''); // دور المستخدم

  const handleSignup = async () => {
    console.log("ضغط على إنشاء الحساب"); // تتبع الضغط

    if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
      Alert.alert("تنبيه", "رجاءً املأ جميع الحقول واختر نوع الحساب");
      return;
    }
        // ✅ تحقق من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("خطأ", "صيغة البريد الإلكتروني غير صحيحة");
      return;
    }

    // ✅ تحقق من قوة كلمة المرور (8 أحرف على الأقل + رقم + حرف)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "كلمة المرور ضعيفة",
        "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وتتضمن حرفًا واحدًا ورقمًا واحدًا."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("خطأ", "كلمة المرور غير متطابقة");
      return;
    }

    try {
      console.log("إرسال بيانات للسيرفر:", { firstName, lastName, email, password, role });

      const response = await fetch('http://192.168.1.18:5000/signup', { // استبدلي بـ IP جهازك
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });

      console.log("تم استلام الرد من السيرفر");

      const data = await response.json();
      console.log("البيانات من السيرفر:", data);

      if (response.ok) {
        Alert.alert("نجاح", data.message);
        navigation.navigate('Choose', { role });
      } else {
        Alert.alert("خطأ", data.message);
      }
    } catch (err) {
      console.error("خطأ في الاتصال بالسيرفر:", err);
      Alert.alert("خطأ", "تعذر الاتصال بالسيرفر. تأكد أن هاتفك على نفس الشبكة");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* صورة الهيدر */}
        <Image
          source={require('../../assets/Арес.jpeg')}
          style={styles.logo}
        />

        <Text style={styles.title}>إنشاء حساب جديد ✨</Text>
        <Text style={styles.subtitle}>ابدأ رحلتك التعليمية🌷</Text>

        {/* الاسم الأول */}
        <View style={styles.inputContainer}>
          <View style={styles.iconBox}><Text style={styles.icon}>👤</Text></View>
          <TextInput
            style={styles.input}
            placeholder="الاسم الأول"
            placeholderTextColor="#aaa"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        {/* الاسم الثاني */}
        <View style={styles.inputContainer}>
          <View style={styles.iconBox}><Text style={styles.icon}>👥</Text></View>
          <TextInput
            style={styles.input}
            placeholder="الاسم الثاني"
            placeholderTextColor="#aaa"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* البريد الإلكتروني */}
        <View style={styles.inputContainer}>
          <View style={styles.iconBox}><Text style={styles.icon}>✉️</Text></View>
          <TextInput
            style={styles.input}
            placeholder="البريد الإلكتروني"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* كلمة المرور */}
        <View style={styles.inputContainer}>
          <View style={styles.iconBox}><Text style={styles.icon}>🔒</Text></View>
          <TextInput
            style={styles.input}
            placeholder="كلمة المرور"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* تأكيد كلمة المرور */}
        <View style={styles.inputContainer}>
          <View style={styles.iconBox}><Text style={styles.icon}>✅</Text></View>
          <TextInput
            style={styles.input}
            placeholder="تأكيد كلمة المرور"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* اختيار نوع الحساب */}
        <View style={{ width: '100%', marginBottom: 20, alignItems: 'center' }}>
          <Text style={{ marginBottom: 15, color: '#4A3F35', fontSize: 18, fontWeight: '600', textAlign: 'center' }}>
            أنا :
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
            {/* طالب */}
            <TouchableOpacity
              style={[styles.profRoleButton, role === 'طالب' && styles.profRoleButtonSelected]}
              onPress={() => setRole('طالب')}
              activeOpacity={0.8}
            >
              <Text style={role === 'طالب' ? styles.profRoleTextSelected : styles.profRoleText}> طالب</Text>
              {role === 'طالب' && <View style={styles.checkMark} />}
            </TouchableOpacity>

            {/* مدرس */}
            <TouchableOpacity
              style={[styles.profRoleButton, role === 'مدرس' && styles.profRoleButtonSelected]}
              onPress={() => setRole('مدرس')}
              activeOpacity={0.8}
            >
              <Text style={role === 'مدرس' ? styles.profRoleTextSelected : styles.profRoleText}> مدرس</Text>
              {role === 'مدرس' && <View style={styles.checkMark} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* زر إنشاء الحساب */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>إنشاء الحساب</Text>
        </TouchableOpacity>

        {/* تسجيل الدخول */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>لديك حساب بالفعل؟</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signupButton}> تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FAF3E0', alignItems: 'center', padding: 20, paddingTop: 0 },
  logo: { width: width, height: 210, resizeMode: 'cover', marginBottom: 20, shadowColor: '#00bfff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4A3F35', marginBottom: 5, marginTop: 22, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#5C5470', marginBottom: 25, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 5 },
  iconBox: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F8FF', borderTopLeftRadius: 12, borderBottomLeftRadius: 12, borderRightWidth: 1, borderRightColor: '#ddd' },
  icon: { fontSize: 20 },
  input: { flex: 1, height: 50, fontSize: 16, paddingHorizontal: 10, textAlign: 'right' },
  button: { backgroundColor: '#00bfff', paddingVertical: 15, borderRadius: 12, width: '100%', marginTop: 10, shadowColor: '#00bfff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 10, elevation: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  signupContainer: { flexDirection: 'row-reverse', marginTop: 20 },
  signupText: { color: '#4A3F35', fontSize: 14 },
  signupButton: { color: '#00bfff', fontSize: 14, fontWeight: 'bold', marginLeft: 5 },
  profRoleButton: { flex: 1, marginHorizontal: 5, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: '#00bfff', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#00bfff', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 5, position: 'relative' },
  profRoleButtonSelected: { backgroundColor: '#00bfff' },
  profRoleText: { fontSize: 16, fontWeight: 'bold', color: '#00bfff' },
  profRoleTextSelected: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  checkMark: { position: 'absolute', top: 8, right: 8, width: 12, height: 12, borderRadius: 6, backgroundColor: '#fff' },
});
