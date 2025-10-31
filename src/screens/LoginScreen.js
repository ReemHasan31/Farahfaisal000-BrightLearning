import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, KeyboardAvoidingView, Platform, ScrollView, Dimensions, Alert 
} from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("تنبيه", "رجاءً املأ جميع الحقول");
      return;
    }

    try {
      const response = await fetch('http://192.168.1.18:5000/login', { // استبدلي بـ IP جهازك
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("نجاح", data.message);

        // التنقل حسب الدور الصحيح
        const role = data.user.role;
        if (role === 'طالب') {
          navigation.replace('Choose', { role: 'طالب' });
       } else if (role === 'مدرس') {
        console.log('Full user data:', data.user);

        console.log(data.user.firstName, data.user.lastName, data.user.email);
  navigation.replace('TeacherDashboard', {
    teacherId: data.user.id,        // <--- مهم جداً
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    email: data.user.email          // اختياري
  });}
 else {
          navigation.replace('Dashboard'); // افتراضي
        }

      } else {
        Alert.alert("خطأ", data.message);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("خطأ", "تعذر الاتصال بالسيرفر. تأكد أن هاتفك على نفس الشبكة");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../../assets/Арес.jpeg')}
          style={styles.logo}
        />

        <Text style={styles.title}>مرحباً بعودتك 🌷</Text>
        <Text style={styles.subtitle}> ادخل لتصنع مستقبلك التعليمي! 🌟🎨</Text>
        
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

        {/* زر تسجيل الدخول */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>تسجيل الدخول</Text>
        </TouchableOpacity>

        {/* نسيت كلمة المرور */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>هل نسيت كلمة المرور؟</Text>
        </TouchableOpacity>

        {/* إنشاء حساب */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>ليس لديك حساب؟</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupButton}> إنشاء حساب جديد</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#FAF3E0', alignItems: 'center', padding: 20, paddingTop: 0 },
  logo: { width: width, height: 210, resizeMode: 'cover', marginBottom: 20, shadowColor: '#00bfff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000000ff', marginBottom: 5, marginTop: 22, textAlign: 'center' },
  subtitle: { fontSize: 17, color: '#1d1c1eff', marginBottom: 25, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 5 },
  iconBox: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F8FF', borderTopLeftRadius: 12, borderBottomLeftRadius: 12, borderRightWidth: 1, borderRightColor: '#ddd' },
  icon: { fontSize: 20 },
  input: { flex: 1, height: 50, fontSize: 16, paddingHorizontal: 10, textAlign: 'right', writingDirection: 'rtl' },
  button: { backgroundColor: '#00bfff', paddingVertical: 15, borderRadius: 12, width: '100%', marginTop: 10, shadowColor: '#00bfff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 10, elevation: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  forgotText: { color: '#000000ff', marginTop: 12, fontSize: 14, textDecorationLine: 'underline', textAlign: 'right', width: '100%' },
  signupContainer: { flexDirection: 'row-reverse', marginTop: 20 },
  signupText: { color: '#000000ff', fontSize: 14 },
  signupButton: { color: '#00bfff', fontSize: 14, fontWeight: 'bold', marginLeft: 5 },
});
