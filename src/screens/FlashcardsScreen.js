import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

export default function FlashcardsScreen() {
  const [flashcards, setFlashcards] = useState([
    { id: '1', front: 'What is React?', back: 'A JavaScript library for building UI' },
    { id: '2', front: 'What is JSX?', back: 'A syntax extension for JavaScript' },
  ]);

  const [flipped, setFlipped] = useState({});
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  // Flip
  const toggleFlip = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Add
  const addCard = () => {
    if (!newFront || !newBack) {
      Alert.alert('Error', 'Please fill both fields!');
      return;
    }
    const newId = (flashcards.length + 1).toString();
    setFlashcards([...flashcards, { id: newId, front: newFront, back: newBack }]);
    setNewFront('');
    setNewBack('');
    setModalVisible(false);
  };

  // Delete
  const deleteCard = (id) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setFlashcards(flashcards.filter(card => card.id !== id));
        }}
      ]
    );
  };

  // Edit
  const editCard = (id) => {
    const card = flashcards.find(c => c.id === id);
    setNewFront(card.front);
    setNewBack(card.back);
    setModalVisible(true);

    // عند الحفظ نخليها تحديث
    setFlashcards(flashcards.filter(c => c.id !== id));
  };

  // Search filter
  const filteredCards = flashcards.filter(card =>
    card.front.toLowerCase().includes(search.toLowerCase()) ||
    card.back.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LinearGradient colors={['#e6f7ff', '#d1e0ff']} style={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.title}>🎓 Let's Study!</Animatable.Text>
      <TextInput
        placeholder="🔍 Search flashcards..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.stats}>
        Total: {flashcards.length} | Flipped: {Object.values(flipped).filter(Boolean).length}
      </Text>

      <FlatList
        data={filteredCards}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Animatable.View animation="fadeInUp" delay={100} style={styles.card}>
            <TouchableOpacity onPress={() => toggleFlip(item.id)}>
              <Animatable.Text 
                animation="flipInY" 
                duration={600} 
                style={styles.cardText}
              >
                {flipped[item.id] ? item.back : item.front}
              </Animatable.Text>
            </TouchableOpacity>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => editCard(item.id)}>
                <Text style={styles.actionText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteCard(item.id)}>
                <Text style={styles.actionText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        )}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.addText}>➕ Add Card</Text>
      </TouchableOpacity>

      {/* Modal Add/Edit */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add / Edit Card</Text>
            <TextInput
              placeholder="Question"
              style={styles.input}
              value={newFront}
              onChangeText={setNewFront}
            />
            <TextInput
              placeholder="Answer"
              style={styles.input}
              value={newBack}
              onChangeText={setNewBack}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={addCard}>
              <Text style={styles.saveText}>💾 Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>❌ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 10 },
  search: { backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 10 },
  stats: { textAlign: 'center', marginBottom: 15, fontWeight: 'bold', color: '#34495e' },
  list: { paddingBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, position: 'relative', shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.3, shadowRadius:6, elevation:5 },
  cardText: { fontSize: 18, fontWeight: 'bold', color:'#2c3e50', textAlign: 'center' },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  actionText: { fontSize: 20, marginHorizontal: 10 },
  addBtn: { backgroundColor:'#27ae60', paddingVertical:15, borderRadius:12, alignItems:'center', marginTop:10 },
  addText: { color:'#fff', fontSize:18, fontWeight:'bold' },
  modalContainer: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center' },
  modalBox: { backgroundColor:'#fff', padding:20, borderRadius:12, width:'80%', alignItems:'center' },
  modalTitle: { fontSize:20, fontWeight:'bold', marginBottom:10 },
  input: { borderWidth:1, borderColor:'#ccc', borderRadius:8, width:'100%', padding:10, marginBottom:10 },
  saveBtn: { backgroundColor:'#3498db', padding:12, borderRadius:8, marginBottom:10, width:'100%', alignItems:'center' },
  saveText: { color:'#fff', fontWeight:'bold' },
  cancelText: { color:'red', marginTop:5 }
});
