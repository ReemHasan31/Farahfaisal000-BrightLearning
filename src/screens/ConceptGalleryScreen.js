// src/screens/ConceptGalleryScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ConceptGalleryScreen() {
  const [selectedItem, setSelectedItem] = useState(null);

  // 🔹 أمثلة مفاهيم مع صور حقيقية + وصف وشرح
  const conceptCategories = [
    {
      title: "🧠 مفاهيم علمية",
      items: [
        {
          image: "https://images.unsplash.com/photo-1581091012184-5c1c1e55f33f?auto=format&fit=crop&w=800&q=80",
          title: "تركيب الحمض النووي (DNA)",
          desc: "الحمض النووي هو المادة الوراثية التي تحمل التعليمات الجينية للكائنات الحية. يتكوّن من سلسلتين ملتفتين تشبهان السلم الحلزوني."
        },
        {
          image: "https://images.unsplash.com/photo-1535930749574-1399327ce78f",
          title: "المجهر العلمي",
          desc: "المجهر يساعد العلماء على رؤية الكائنات الدقيقة مثل البكتيريا والخلايا والتي لا تُرى بالعين المجردة."
        },
        {
          image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
          title: "التجارب المخبرية",
          desc: "تُستخدم التجارب المخبرية لاختبار الفرضيات وفهم الظواهر العلمية من خلال الملاحظة الدقيقة."
        },
      ],
    },
    {
      title: "🌍 مفاهيم جغرافية",
      items: [
        {
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          title: "المحيطات",
          desc: "المحيطات تغطي أكثر من 70% من سطح الأرض وتشكل مصدرًا رئيسيًا للحياة والمناخ."
        },
        {
          image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
          title: "الجبال",
          desc: "الجبال تتكوّن نتيجة حركات الصفائح الأرضية، وتلعب دورًا مهمًا في المناخ وتوزيع المياه."
        },
        {
          image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
          title: "الصحارى",
          desc: "الصحارى هي مناطق جافة تتميز بارتفاع درجات الحرارة وقلة الأمطار."
        },
      ],
    },
    {
      title: "⚡ مفاهيم فيزيائية",
      items: [
        {
  image: "https://images.unsplash.com/photo-1581093588401-22e6ec3c55b8?auto=format&fit=crop&w=800&q=80",
  title: "الكهرباء والطاقة",
  desc: "الكهرباء شكل من أشكال الطاقة التي يمكن تحويلها إلى ضوء أو حرارة أو حركة."
},
        {
          image: "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51",
          title: "المغناطيسية",
          desc: "المغناطيسية هي قوة تجاذب أو تنافر بين الأجسام الناتجة عن حركة الشحنات الكهربائية."
        },
        {
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
          title: "مفهوم الضوء",
          desc: "الضوء هو إشعاع كهرومغناطيسي يمكن للعين البشرية رؤيته، ويساعدنا على رؤية العالم من حولنا."
        },
      ],
    },
  ];

  return (
    <LinearGradient colors={['#E0F7FA', '#E8EAF6']} style={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.title}>
        🎨 معرض المفاهيم البصرية
      </Animatable.Text>
      <Text style={styles.desc}>
        استكشف المفاهيم بطريقة بصرية ممتعة وتفاعلية 🔍
      </Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {conceptCategories.map((cat, idx) => (
          <Animatable.View key={idx} animation="fadeInUp" delay={idx * 150}>
            <Text style={styles.category}>{cat.title}</Text>
            <View style={styles.galleryRow}>
              {cat.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.8}
                  onPress={() => setSelectedItem(item)}
                  style={styles.imageWrapper}
                >
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>اضغط للتفاصيل 👆</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animatable.View>
        ))}
      </ScrollView>

      {/* نافذة التفاصيل */}
      <Modal visible={!!selectedItem} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <Animatable.View animation="zoomIn" style={styles.modalContent}>
            {selectedItem && (
              <>
                <Image
                  source={{ uri: selectedItem.image }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Text style={styles.modalDesc}>{selectedItem.desc}</Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
                    onPress={() => alert('💾 تم الحفظ في المفضلة!')}
                  >
                    <Text style={styles.modalButtonText}>حفظ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#2196F3' }]}
                    onPress={() => alert('🔗 مشاركة الصورة')}
                  >
                    <Text style={styles.modalButtonText}>مشاركة</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: '#E53935' }]}
                    onPress={() => setSelectedItem(null)}
                  >
                    <Text style={styles.modalButtonText}>رجوع</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animatable.View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A237E',
    marginBottom: 5,
  },
  desc: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 15,
  },
  scroll: { paddingHorizontal: 15, paddingBottom: 80 },
  category: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#0D47A1',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  galleryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayText: { color: '#fff', textAlign: 'center', fontSize: 13 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: height * 0.4,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalDesc: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
