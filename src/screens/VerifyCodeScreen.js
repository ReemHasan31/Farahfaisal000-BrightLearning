
//verify
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function VerifyCodeScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('تنبيه', 'رجاءً أدخل الكود');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.18:5000/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('نجاح', data.message);
        navigation.navigate('ResetPassword', { email, code}); // نرسل الايميل للشاشة التالية
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
      <Text style={styles.title}>تأكيد الكود</Text>
      <Text style={styles.subtitle}>أدخل الكود الذي أُرسل إلى بريدك</Text>

      <TextInput
        style={styles.input}
        placeholder="أدخل الكود"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>تأكيد</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#FAF3E0' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#4A3F35' },
  subtitle: { fontSize: 16, marginBottom: 25, textAlign: 'center', color: '#5C5470' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, fontSize: 16, textAlign: 'center' },
  button: { backgroundColor: '#00bfff', padding: 15, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: 'bold' },
});