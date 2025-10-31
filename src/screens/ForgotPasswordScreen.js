import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('تنبيه', 'رجاءً أدخل البريد الإلكتروني');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.18:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('نجاح', data.message);
        navigation.navigate('VerifyCode', { email });
      } else {
        Alert.alert('خطأ', data.message);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('خطأ', 'تعذر الاتصال بالسيرفر');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>استعادة كلمة المرور</Text>
      <Text style={styles.subtitle}>أدخل بريدك الإلكتروني لإرسال كود التحقق</Text>

      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>إرسال الكود</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#FAF3E0' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#4A3F35' },
  subtitle: { fontSize: 16, marginBottom: 25, textAlign: 'center', color: '#5C5470' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#00bfff', padding: 15, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: 'bold' },
});
