import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Animatable from 'react-native-animatable';

export default function UploadScreen() {
  const [files, setFiles] = useState([]);

  // اختيار الملفات
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: true });
      console.log(result);

      if (!result.canceled && result.assets.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...result.assets]);
        Alert.alert('Files Selected', `You chose ${result.assets.length} new file(s).`);
      } else {
        Alert.alert('No File', 'You did not select any file.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong while picking the file.');
    }
  };

  // حذف ملف محدد
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // رفع الملفات
  const uploadFiles = async () => {
    if (files.length === 0) {
      Alert.alert('No File', 'Please choose a file first.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      });
    });

    try {
      const response = await fetch('https://yourserver.com/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const text = await response.text();
      console.log('Server response:', text);

      try {
        const data = JSON.parse(text);
        Alert.alert('Upload Success', `Server response: ${data.message}`);
      } catch {
        Alert.alert('Upload Response', 'Server did not return valid JSON.');
      }

      setFiles([]);
    } catch (error) {
      console.log(error);
      Alert.alert('Upload Failed', 'Could not upload the files.');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF3E0" />

      <ScrollView contentContainerStyle={styles.container}>
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Upload Notes
        </Animatable.Text>
        <Animatable.Text animation="fadeInUp" delay={200} style={styles.subtitle}>
          Select files from your device to upload
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={400} style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={pickDocument}>
            <Text style={styles.buttonText}>📁 Choose Files</Text>
          </TouchableOpacity>

          {files.map((file, index) => (
            <Animatable.View key={index} animation="fadeIn" style={styles.fileContainer}>
              <Text style={styles.fileName}>{file.name}</Text>
              <TouchableOpacity onPress={() => removeFile(index)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>❌ Remove</Text>
              </TouchableOpacity>
            </Animatable.View>
          ))}

          <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={uploadFiles}>
            <Text style={styles.buttonText}>⬆️ Upload</Text>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FAF3E0' },
  container: { flexGrow: 1, alignItems: 'center', paddingVertical: 30, paddingBottom: 120 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4A3F35', textAlign: 'center', marginBottom: 10, fontFamily: 'Comic' },
  subtitle: { fontSize: 16, color: '#5C5470', textAlign: 'center', marginBottom: 30, fontFamily: 'Comic' },
  buttonWrapper: { width: '80%', alignItems: 'center' },
  button: {
    backgroundColor: '#afeef3ff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#5561b7ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  uploadButton: { backgroundColor: '#4A90E2' },
  buttonText: { color: '#141414ff', fontSize: 18, fontWeight: 'bold', fontFamily: 'Comic' },
  fileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#00bfff',
    borderRadius: 12,
    backgroundColor: '#e6f7ff',
    width: '100%',
    shadowColor: '#00bfff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  fileName: { fontSize: 15, color: '#4A3F35', fontFamily: 'Comic', flex: 1, marginRight: 10 },
  removeButton: { backgroundColor: '#ff5c5c', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  removeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14, fontFamily: 'Comic' },
});
