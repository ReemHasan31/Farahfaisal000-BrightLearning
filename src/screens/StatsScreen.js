// src/screens/StatsScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, I18nManager } from 'react-native';
import { ProgressChart, PieChart, BarChart } from 'react-native-chart-kit';

// تفعيل الاتجاه من اليمين
I18nManager.forceRTL(true);

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const dailyProgress = 0.6;
  const weeklyHours = [2, 3, 1.5, 4, 3, 2.5, 5];
  const activityDistribution = [
    { name: 'ملخصات', population: 40, color: '#4ECDC4', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'أسئلة سريعة', population: 25, color: '#FF6B6B', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'خطة اليوم', population: 20, color: '#FFD93D', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'قراءة', population: 15, color: '#8338EC', legendFontColor: '#333', legendFontSize: 14 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.screenTitle}>📊 إحصائيات التعلم</Text>

      {/* تقدم خطة اليوم */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 تقدم خطة اليوم</Text>
        <View style={styles.chartContainer}>
          <ProgressChart
            data={{ labels: ['اليوم'], data: [dailyProgress] }}
            width={screenWidth - 80}
            height={150}
            strokeWidth={16}
            radius={32}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
              backgroundGradientFrom: '#FAF3E0',
              backgroundGradientTo: '#d0f0eb',
            }}
            hideLegend={false}
          />
        </View>
        <Text style={styles.cardDesc}>{Math.round(dailyProgress * 100)}٪ تم الإنجاز</Text>
      </View>

      {/* ساعات الدراسة الأسبوعية */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⏰ ساعات الدراسة الأسبوعية</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: ['أحد', 'إثن', 'ثلث', 'أرب', 'خمس', 'جمعة', 'سبت'],
              datasets: [{ data: weeklyHours }],
            }}
            width={screenWidth - 100}
            height={220}
            yAxisLabel=""
            chartConfig={{
              ...chartConfig,
              backgroundGradientFrom: '#FAF3E0',
              backgroundGradientTo: '#d0f0eb',
              fillShadowGradient: '#4ECDC4',
              fillShadowGradientOpacity: 0.8,
              color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
            }}
            verticalLabelRotation={0}
            fromZero={true}
            showValuesOnTopOfBars={true}
          />
        </View>
      </View>

      {/* توزيع الأنشطة */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 توزيع الأنشطة</Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={activityDistribution}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      </View>

      {/* النقاط والإنجازات */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏅 نقاطك ونجومك</Text>
        <View style={styles.pointsRow}>
          <Text style={styles.cardDesc}>⭐ ١٢٠ نقطة</Text>
          <Text style={styles.cardDesc}>🎖 ٥ إنجازات مكتملة</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#FAF3E0',
  backgroundGradientTo: '#d0f0eb',
  color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  strokeWidth: 3,
  barPercentage: 0.6,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF3E0' },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
    color: '#4B0082',
  },
  cardDesc: {
    fontSize: 17,
    color: '#555',
    marginTop: 5,
    textAlign: 'right',
  },
  chartContainer: { alignItems: 'center', justifyContent: 'center' },
  pointsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
