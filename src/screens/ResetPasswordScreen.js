import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, code } = route.params; // استقبلي الكود من الشاشة السابقة
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleReset = async () => {
    if (!password || !confirm) {
      Alert.alert('تنبيه', 'رجاءً أدخل كلمة المرور الجديدة وتأكيدها');
      return;
    }
    if (password !== confirm) {
      Alert.alert('خطأ', 'كلمتا المرور غير متطابقتين');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.18:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: password }), // ✅ لاحظي الاسماء
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('نجاح', data.message);
        navigation.navigate('Login');
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
      <Text style={styles.title}>إعادة تعيين كلمة المرور</Text>
      <Text style={styles.subtitle}>أدخل كلمة مرور جديدة</Text>

      <TextInput
        style={styles.input}
        placeholder="كلمة المرور الجديدة"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="تأكيد كلمة المرور"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>حفظ</Text>
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
