// src/screens/LearnMoreScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

export default function LearnMoreScreen() {
  const features = [
    { icon: '🎯', text: 'يحدد أسلوب تعلم الطالب (بصري / سمعي / عملي)' },
    { icon: '📚', text: 'يلخص المحتوى (كتب، PDF، صور)' },
    { icon: '📝', text: 'يعمل أسئلة مراجعة (Quiz / Flashcards)' },
    { icon: '⏳', text: 'يضبط وقت المذاكرة بخطة ذكية تتغير تلقائياً' },
    { icon: '🎤', text: 'يضم مساعدًا صوتيًا يتفاعل مع الطالب' },
    { icon: '🌙', text: 'يضيف لمسة تحفيزية (أذكار – اقتباسات – أهداف يومية)' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* 🔹 العنوان والمحتوى */}
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.card}>
          <Animatable.Text animation="fadeInDown" delay={200} style={styles.title}>
            🌟 رفيق التعلم الشخصي
          </Animatable.Text>

          <Animatable.Text animation="fadeInRight" delay={400} style={styles.description}>
            تطبيق ذكي يصمم تجربة تعلم فريدة لكل طالب حسب أسلوبه الخاص في الفهم والتفاعل.
          </Animatable.Text>

          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Animatable.Text
                animation="fadeInRight"
                delay={600 + index * 150}
                style={styles.featureText}
              >
                {feature.text}
              </Animatable.Text>
            </View>
          ))}
        </Animatable.View>

        {/* 🔹 الصورة أسفل الصفحة */}
        <Animatable.View animation="zoomInUp" delay={800} duration={1500} style={styles.imageWrapper}>
          <Image
            source={require('../../assets/download (11).jpeg')}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
        </Animatable.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(159, 134, 177, 0.1)' },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },

  // البطاقة
  card: {
    backgroundColor: '#fbf6e9ff',
    borderRadius: 25,
    padding: 25,
    width: width * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#070707ff',
    marginBottom: 10,
  },
  description: {
    fontSize: 17,
    textAlign: 'right',
    color: '#333',
    marginBottom: 15,
    lineHeight: 25,
  },
  featureRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 22,
    marginLeft: 10,
    marginTop: 2,
  },
  featureText: {
    fontSize: 16,
    color: '#000000ff',
    textAlign: 'right',
    lineHeight: 24,
    flexShrink: 1,
  },

  // الصورة أسفل الصفحة
  imageWrapper: {
    width: width * 1.1,
    height: height * 0.30, // حجم متوسط وواضح
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4B0082',
    shadowOpacity: 0.1,
    shadowRadius: 19,
    elevation: 20,
    marginBottom: 25,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(75, 0, 130, 0.1)', // توهج بنفسجي ناعم
  },
});
