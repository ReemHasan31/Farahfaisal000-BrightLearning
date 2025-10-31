// src/screens/LearningStyleScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function LearningStyleScreen({ navigation }) {
  const [selectedStyle, setSelectedStyle] = useState(null);

  const stylesData = [
    {
      key: 'بصري',
      bgColor: '#FFEDD5',
      borderColor: '#FFA500',
      icon: '👀',
      description: 'التعلم من خلال الصور والفيديوهات والمخططات.',
    },
    {
      key: 'سمعي',
      bgColor: '#E0E7FF',
      borderColor: '#4F46E5',
      icon: '🎧',
      description: 'التعلم من خلال الاستماع والمحاضرات.',
    },
    {
      key: 'عملي',
      bgColor: '#DCFCE7',
      borderColor: '#16A34A',
      icon: '🛠️',
      description: 'التعلم من خلال التجربة والتطبيق العملي.',
    },
  ];

  const handleSelect = (style) => {
    setSelectedStyle(style);
  };

  const handleContinue = () => {
    if (!selectedStyle) {
      Alert.alert('تنبيه', 'الرجاء اختيار أسلوب التعلم للمتابعة.');
      return;
    }
    navigation.navigate('Dashboard', { learningStyle: selectedStyle });
  };

  return (
    <View style={styles.container}>
      {/* عنوان خيالي */}
      <Animatable.Text animation="bounceIn" duration={1200} style={styles.fantasyTitle}>
        🌟 اكتشف عالم تعلمك السحري 🌟
      </Animatable.Text>

      <Text style={styles.screenTitle}>اختر أسلوب التعلم الخاص بك</Text>

      {stylesData.map((item) => (
        <Animatable.View
          key={item.key}
          animation="fadeInUp"
          duration={600}
          style={{ width: '100%', marginBottom: 15 }}
        >
          <TouchableOpacity
            style={[
              styles.optionButton,
              {
                backgroundColor: item.bgColor,
                borderColor: selectedStyle === item.key ? item.borderColor : '#ddd',
              },
            ]}
            onPress={() => handleSelect(item.key)}
          >
            {/* النصوص */}
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>{item.key}</Text>
              <Text style={styles.optionDescription}>{item.description}</Text>
            </View>
            {/* الأيقونة */}
            <Text style={styles.icon}>{item.icon}</Text>
          </TouchableOpacity>
        </Animatable.View>
      ))}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>متابعة</Text>
      </TouchableOpacity>

      <Text style={styles.noteText}>يمكنك تغيير أسلوب التعلم لاحقاً في الإعدادات.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E0',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  fantasyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6F61',
    textAlign: 'center',
    marginBottom: 15,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A3F35',
    marginBottom: 25,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  icon: {
    fontSize: 32,
    marginStart: 15, // يدعم RTL
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-end', // النصوص على اليمين
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A3F35',
    textAlign: 'right',
  },
  optionDescription: {
    fontSize: 14,
    color: '#5C5470',
    marginTop: 3,
    textAlign: 'right',
  },
  continueButton: {
    marginTop: 30,
    width: '80%',
    paddingVertical: 15,
    backgroundColor: '#00bfff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#00bfff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteText: {
    marginTop: 15,
    fontSize: 12,
    color: '#4A3F35',
    textAlign: 'center',
  },
});
