// src/screens/TeacherCourse.js
import React, { useEffect, useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function TeacherCourse({ navigation, route }) {
  const { teacherId } = route.params;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://192.168.1.18:5000/api/courses/my/${teacherId}`)
      .then(res => {
        const approvedCourses = res.data.filter(c => c.status === 'approved');
        setCourses(approvedCourses);
      })
      .catch(err => {
        console.error(err);
        Alert.alert('خطأ', 'حدث خطأ أثناء جلب المساقات');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} color="#25404a" />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>اختر المساق لإضافة مهمة</Text>
      
      {courses.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>لا توجد مساقات معتمدة حالياً</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ marginBottom: 18 }}
              onPress={() => navigation.navigate('AddTask', { courseId: item.id, courseName: item.courseName })}
            >
              <LinearGradient
                colors={index % 2 === 0 ? ['#54b6dc', '#45B7AF'] : ['#FFBAC8', '#FF6B6B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <Text style={styles.title}>{item.courseName}</Text>
                <Text style={styles.subtitle}>كود المساق: {item.courseCode}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAF3E0', 
    paddingHorizontal: 16, 
    paddingTop: 20 
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#25404a',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.9,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    fontSize: 16,
    color: '#7A7A7A'
  }
});
