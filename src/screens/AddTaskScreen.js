import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function AddTaskScreen({ route, navigation }) {
  const { courseId, courseName } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('file');
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);

  // اختيار ملف
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        setFile(result);
      }
    } catch (err) {
      Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الملف');
    }
  };

  // إضافة مهمة
  const submitTask = async () => {
    if (!title || !startDate || !dueDate) {
      Alert.alert('خطأ', 'يرجى إدخال جميع الحقول المطلوبة');
      return;
    }

    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('startDate', moment(startDate).format('YYYY-MM-DD HH:mm:ss'));
    formData.append('dueDate', moment(dueDate).format('YYYY-MM-DD HH:mm:ss'));

    if (file) {
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType || 'application/octet-stream',
        name: file.name,
      });
    }

    try {
      await axios.post('http://192.168.1.18:5000/api/tasks/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('نجاح', 'تم إضافة المهمة بنجاح');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('خطأ', 'حدث خطأ أثناء إضافة المهمة');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.headerTitle}>إضافة مهمة جديدة</Text>
      <View style={styles.card}>

        {/* عنوان المهمة */}
        <Text style={styles.label}>📝 عنوان المهمة</Text>
        <TextInput
          placeholder="أدخل عنوان المهمة"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          textAlign="center"
        />

        {/* وصف المهمة */}
        <Text style={styles.label}>📄 وصف المهمة</Text>
        <TextInput
          placeholder="أدخل وصف المهمة (اختياري)"
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          textAlign="center"
        />

        {/* نوع المهمة */}
<Text style={styles.label}>⚙️ نوع المهمة</Text>
<View style={styles.typeRow}>
  {['file', 'question', 'other'].reverse().map(t => (
    <TouchableOpacity
      key={t}
      style={[styles.typeBtn, type === t && styles.typeBtnActive]}
      onPress={() => setType(t)}
    >
      <Text style={[styles.typeText, type === t && { color: '#fff' }]}>
        {t === 'file' ? 'ملف': t === 'question' ? 'سؤال' : 'أخرى'}
      </Text>
    </TouchableOpacity>
  ))}
</View>

        {/* اختيار ملف */}
        <Text style={styles.label}>📂 ملف المهمة (اختياري)</Text>
        <TouchableOpacity style={styles.fileBtn} onPress={pickFile}>
          <Ionicons name="document-text-outline" size={20} color="#25404a" />
          <Text style={styles.fileText}>
            {file ? `ملف: ${file.name}` : 'اختر ملف'}
          </Text>
        </TouchableOpacity>

        {/* التاريخ */}
        <View style={styles.dateContainer}>
           <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.label}>⏰ تاريخ التسليم</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDuePicker(true)}>
              <Text style={styles.dateText}>{moment(dueDate).format('YYYY-MM-DD')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>📅 تاريخ البداية</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowStartPicker(true)}>
              <Text style={styles.dateText}>{moment(startDate).format('YYYY-MM-DD')}</Text>
            </TouchableOpacity>
          </View>

         
        </View>

        {/* Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(e, selected) => {
              setShowStartPicker(false);
              if (selected) setStartDate(selected);
            }}
          />
        )}
        {showDuePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={(e, selected) => {
              setShowDuePicker(false);
              if (selected) setDueDate(selected);
            }}
          />
        )}

        {/* زر الإضافة */}
        <TouchableOpacity onPress={submitTask} style={{ marginTop: 20 }}>
          <LinearGradient
            colors={['#4fc3c9', '#6b9dfc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitBtn}
          >
            <Text style={styles.submitText}>إضافة المهمة</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3E8',
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E3745',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#FFF9E9',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3745',
    marginBottom: 6,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#FFF3D9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    textAlign: 'center',
    color: '#333',
    borderWidth: 1,
    borderColor: '#F1E2BE',
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  typeBtn: {
    borderWidth: 1,
    borderColor: '#25404a',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#FFF3D9',
  },
  typeBtnActive: {
    backgroundColor: '#25404a',
  },
  typeText: {
    color: '#25404a',
    fontWeight: '700',
    textAlign: 'center',
  },
  fileBtn: {
    backgroundColor: '#FFF3D9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1E2BE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  fileText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#25404a',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateBtn: {
    backgroundColor: '#FFF3D9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1E2BE',
  },
  dateText: {
    color: '#25404a',
    fontWeight: '600',
  },
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
