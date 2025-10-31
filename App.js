import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nManager } from "react-native";

// منع الانعكاس الكامل للنصوص (LTR)
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

// =======================
// استدعاء الشاشات الأساسية
// =======================
import AddTaskScreen from './src/screens/AddTaskScreen';
import UploadLessonScreen from './src/screens/UploadLessonScreen';
import teachercourse from './src/screens/teachercourse';
import MyCoursesScreen from './src/screens/MyCoursesScreen';
import ChooseCourseScreen from './src/screens/ChooseCourseScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import UploadScreen from './src/screens/UploadScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StudyPlanScreen from './src/screens/StudyPlanScreen';
import LearnMoreScreen from './src/screens/LearnMoreScreen';
import SignupScreen from './src/screens/SignupScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import VerifyCodeScreen from './src/screens/VerifyCodeScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StatsScreen from './src/screens/StatsScreen';
import LearningStyleScreen from './src/screens/LearningStyleScreen';
import MindMapScreen from './src/screens/MindMapScreen';

// =======================
// شاشات الأسلوب البصري
// =======================
import VisualExperimentsScreen from './src/screens/VisualExperimentsScreen';
import ConceptGalleryScreen from './src/screens/ConceptGalleryScreen';

// =======================
// شاشات الأسلوب السمعي الجديدة 🎧
// =======================
import AuditoryListenScreen from './src/screens/AuditoryListenScreen';
import AuditoryRepeatScreen from './src/screens/AuditoryRepeatScreen';
import AuditorySongsScreen from './src/screens/AuditorySongsScreen';

import PracticalScreen from './src/screens/PracticalScreen';
import MiniProjectsScreen from './src/screens/MiniProjectsScreen';
import ExperimentsScreen from './src/screens/ExperimentsScreen';


import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen';

import AddCourseScreen from './src/screens/AddCourseScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'مرحباً بك' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'تسجيل الدخول' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'لوحة التحكم' }} />
        <Stack.Screen name="Upload" component={UploadScreen} options={{ title: 'رفع الملفات' }} />
        <Stack.Screen name="Summary" component={SummaryScreen} options={{ title: 'الملخص' }} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} options={{ title: 'بطاقات التلخيص' }} />
        <Stack.Screen name="LearningStyle" component={LearningStyleScreen} options={{ title: 'أسلوب التعلم' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'المحادثة' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'الملف الشخصي' }} />
        <Stack.Screen name="Stats" component={StatsScreen} options={{ title: 'الإحصائيات' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'الإعدادات' }} />
        <Stack.Screen name="StudyPlan" component={StudyPlanScreen} options={{ title: 'خطة الدراسة' }} />
        <Stack.Screen name="LearnMore" component={LearnMoreScreen} options={{ title: 'تعلم المزيد' }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'إنشاء حساب' }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'نسيت كلمة المرور' }} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} options={{ title: 'تأكيد الرمز' }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'إعادة تعيين كلمة المرور' }} />
        <Stack.Screen name="MindMap" component={MindMapScreen} options={{ title: 'خريطة ذهنية' }} />
        <Stack.Screen name="Choose" component={ChooseCourseScreen}  />
        <Stack.Screen name="MyCourses" component={MyCoursesScreen}  />
        {/* شاشات الأسلوب البصري */}
        <Stack.Screen name="ConceptGallery" component={ConceptGalleryScreen} options={{ title: 'معرض المفاهيم' }} />
        <Stack.Screen name="VisualExperiments" component={VisualExperimentsScreen} options={{ title: 'تجارب بصرية' }} />

        {/* 🎧 شاشات الأسلوب السمعي */}
        <Stack.Screen name="AuditoryListen" component={AuditoryListenScreen} options={{ title: 'استمع وتعلّم' }} />
        <Stack.Screen name="AuditoryRepeat" component={AuditoryRepeatScreen} options={{ title: 'كرّر واستمع' }} />
        <Stack.Screen name="AuditorySongs" component={AuditorySongsScreen} options={{ title: 'تعلم بالأغاني' }} />

        <Stack.Screen name="PracticalScreen" component={PracticalScreen} options={{ title: 'التطبيق العملي' }} />
<Stack.Screen name="MiniProjectsScreen" component={MiniProjectsScreen} options={{ title: 'مشاريع صغيرة' }} />
<Stack.Screen name="ExperimentsScreen" component={ExperimentsScreen} options={{ title: 'تجارب عملية' }} />


<Stack.Screen 
  name="TeacherDashboard" 
  component={TeacherDashboardScreen} 
  options={{ title: 'لوحة المعلم' }} 
/>
<Stack.Screen name="Uploadlesson" component={UploadLessonScreen} />
<Stack.Screen name="AddCourse" component={AddCourseScreen} />
<Stack.Screen name="Course" component={teachercourse} />
<Stack.Screen name="AddTask" component={AddTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
