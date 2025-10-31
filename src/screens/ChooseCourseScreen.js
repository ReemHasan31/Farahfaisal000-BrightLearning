// ChooseCourseScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function ChooseCourseScreen({ navigation }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // هنا تجلب المساقات من قاعدة البيانات أو API
    setCourses([
      { id: 1, name: "لغة C" },
      { id: 2, name: "رياضيات" },
      { id: 3, name: "فيزياء" },
      { id: 4, name: "كيمياء" },
      { id: 5, name: "هندسة الحاسوب" },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF3E0" />

      {/* العنوان مع الإيموجي */}
      <Animatable.Text animation="fadeInDown" duration={1200} style={styles.title}>
        🌟 اختر المساق الذي تريد تعلمه
      </Animatable.Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {courses.map(course => (
          <Animatable.View key={course.id} animation="fadeInUp" delay={course.id * 100}>
            <TouchableOpacity
              style={styles.courseCard}
              onPress={() => navigation.navigate('LearningStyle', { courseId: course.id, courseName: course.name })}
            >
              <Text style={styles.courseName}>{course.name}</Text>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A3F35',
    marginBottom: 25,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  courseCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderLeftWidth: 5,
    borderLeftColor: '#00bfff',
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
});
