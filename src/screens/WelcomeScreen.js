// src/screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    CairoBold: require('../../assets/fonts/Cairo-Bold.ttf'), // ضع الخط العربي Cairo-Bold.ttf في مجلد fonts
    CairoRegular: require('../../assets/fonts/Cairo-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* اللوغو */}
      <Animatable.Image
        animation="bounceIn"
        duration={1500}
        source={require('../../assets/download (7).jpeg')}
        style={styles.logo}
      />

      {/* العنوان الرئيسي */}
      <Animatable.Text animation="fadeInDown" delay={500} style={styles.title}>
        مرحبًا بك في رفيق التعلم الذكي ✨
      </Animatable.Text>

      {/* العنوان الثانوي */}
      <Animatable.Text animation="fadeInUp" delay={800} style={styles.subtitle}>
         رفيقك الذكي لدراسة أسهل، أسرع، وأكثر  متعة! 🚀
      </Animatable.Text>

      {/* زر "ابدأ الآن" */}
      <Animatable.View animation="fadeInUp" delay={1000}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>ابدأ الآن</Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* زر "تعرف أكثر" */}
      <Animatable.View animation="fadeInUp" delay={1200}>
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={() => navigation.navigate('LearnMore')}
          activeOpacity={0.8}
        >
          <Text style={styles.learnMoreText}>تعرف أكثر 🔍</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.75,
    height: width * 0.55,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#00bfff',
    shadowColor: '#00bfff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: 'CairoBold',
    color: '#4A3F35',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#78b6d8ff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'CairoRegular',
    color: '#5C5470',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 28,
    textShadowColor: '#ccc',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  startButton: {
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 35,
    backgroundColor: '#00bfff',
    borderWidth: 2,
    borderColor: '#00bfff',
    shadowColor: '#00bfff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: 'CairoBold',
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
  learnMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#00bfff',
    backgroundColor: '#FFF9F0',
    shadowColor: '#4A3F35',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  learnMoreText: {
    fontFamily: 'CairoBold',
    fontSize: 16,
    color: '#4A3F35',
    fontWeight: '600',
  },
});
