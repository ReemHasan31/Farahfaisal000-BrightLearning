import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { LinearGradient } from "expo-linear-gradient";
import mammoth from "mammoth";

const HUGGINGFACE_TOKEN = "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";
const CHUNK_SIZE = 1500;

export default function SummaryScreen() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [fileName, setFileName] = useState("");
  const [translated, setTranslated] = useState("");
  const [isArabic, setIsArabic] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  // اختيار الملف
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.type === "cancel") return;

      let fileUri = result.uri;
      if (!fileUri && result.assets && result.assets.length > 0) {
        fileUri = result.assets[0].uri;
      }
      if (!fileUri) {
        setSummary("⚠️ لم يتم الحصول على رابط الملف.");
        return;
      }

      const name = result.name || (result.assets && result.assets[0].name) || "ملف";
      setFileName(name);

      const text = await extractText(fileUri, name);
      if (!text) {
        setSummary("⚠️ لم أتمكن من استخراج نص من الملف.");
        return;
      }

      await summarizeText(text);
    } catch (error) {
      console.error("❌ Error picking file:", error);
      setSummary("حدث خطأ أثناء اختيار الملف.");
    }
  };

  // استخراج النص حسب نوع الملف
  const extractText = async (uri, name) => {
    try {
      const ext = name.split(".").pop().toLowerCase();
      if (ext === "txt") {
        const content = await FileSystem.readAsStringAsync(uri);
        return content;
      } else if (ext === "docx") {
        const arrayBuffer = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const byteArray = Uint8Array.from(atob(arrayBuffer), c => c.charCodeAt(0));
        const result = await mammoth.extractRawText({ arrayBuffer: byteArray.buffer });
        return result.value;
      } else if (ext === "pdf") {
        setSummary("⚠️ لا يدعم حالياً قراءة PDF، استخدم TXT أو DOCX.");
        return null;
      } else {
        setSummary("⚠️ نوع الملف غير مدعوم. استخدم TXT أو DOCX.");
        return null;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  // تقسيم النص
  const splitText = (text, size = CHUNK_SIZE) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  };

  // اختيار النموذج حسب اللغة
  const detectLanguage = (text) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    const isAr = arabicRegex.test(text);
    setIsArabic(isAr);
    return isAr ? "moussaKam/arabic-summarization" : "facebook/bart-large-cnn";
  };

  // تلخيص النص
  const summarizeChunk = async (textChunk, model) => {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: textChunk }),
        }
      );

      const text = await response.text();
      if (response.status !== 200) return "";
      const data = JSON.parse(text);
      return data?.[0]?.summary_text || "";
    } catch {
      return "";
    }
  };

  const summarizeText = async (text) => {
    setLoading(true);
    setSummary("");
    setTranslated("");
    setSelectedText("");

    try {
      const chunks = splitText(text, CHUNK_SIZE);
      const model = detectLanguage(text);
      let finalSummary = "";

      for (let chunk of chunks) {
        const part = await summarizeChunk(chunk, model);
        finalSummary += part + "\n\n";
      }

      setSummary(finalSummary.trim() || "⚠️ لم أتمكن من تلخيص النص.");
    } catch {
      setSummary("حدث خطأ أثناء التلخيص.");
    } finally {
      setLoading(false);
    }
  };

  // ترجمة النص المحدد فقط
  const translateSelectedTextFunc = async () => {
    if (!selectedText) return;
    setLoading(true);
    setTranslated("");

    const model = isArabic
      ? "Helsinki-NLP/opus-mt-ar-en"
      : "Helsinki-NLP/opus-mt-en-ar";

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: selectedText }),
        }
      );

      const text = await response.text();
      if (response.status !== 200) {
        setTranslated("⚠️ حدث خطأ أثناء الترجمة.");
        return;
      }

      const data = JSON.parse(text);
      setTranslated(data?.[0]?.translation_text || "⚠️ لم أتمكن من الترجمة.");
    } catch {
      setTranslated("⚠️ حدث خطأ أثناء الترجمة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#fffde6ff', '#d0f0ff']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📄 دعنا نلخص الملف معًا!</Text>

        <TouchableOpacity style={styles.button} onPress={pickDocument}>
          <Text style={styles.buttonText}>📂 اختر ملف (TXT أو DOCX)</Text>
        </TouchableOpacity>

        {fileName !== "" && <Text style={styles.fileName}>📄 {fileName}</Text>}

        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={{ marginVertical: 20 }} />
        ) : (
          <>
            {summary !== "" && (
              <View style={styles.box}>
                <Text style={styles.boxTitle}>📑 التلخيص:</Text>

                {/* النص القابل للتحديد */}
                <TextInput
                  multiline
                  editable={false}
                  value={summary}
                  onSelectionChange={(event) => {
                    const { start, end } = event.nativeEvent.selection;
                    setSelectedText(summary.slice(start, end));
                  }}
                  style={styles.resultText}
                />

                <TouchableOpacity
                  style={[styles.button, { marginTop: 15, backgroundColor: "#FF6B6B" }]}
                  onPress={translateSelectedTextFunc}
                  disabled={!selectedText}
                >
                  <Text style={styles.buttonText}>
                    🌐 ترجمة النص المحدد
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {translated !== "" && (
              <View style={[styles.box, { backgroundColor: "#E0F7FA" }]}>
                <Text style={styles.boxTitle}>🌐 الترجمة:</Text>
                <ScrollView style={styles.resultBox}>
                  <Text style={styles.resultText}>{translated}</Text>
                </ScrollView>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  button: { backgroundColor: "#4A90E2", padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  fileName: { marginTop: 10, fontSize: 16, fontWeight: "bold", color: "#555", textAlign: "center" },
  box: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  boxTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  resultBox: { maxHeight: 250 },
  resultText: { fontSize: 16, color: "#333", lineHeight: 24 },
});
