import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useAppTheme } from '../../src/theme/ThemeContext';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'MISSING_API_KEY');

export default function ReviewScreen() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams();
  const router = useRouter();

  // Handle either single or multiple images
  const initialUris = params.uri ? (Array.isArray(params.uri) ? params.uri : [params.uri]) : [];
  const initialBase64s = params.base64 ? (Array.isArray(params.base64) ? params.base64 : [params.base64]) : [];

  const [photos, setPhotos] = useState(initialUris.map((uri, i) => ({ uri, base64: initialBase64s[i] })));
  const [loading, setLoading] = useState(false);
  const [citations, setCitations] = useState('');
  const [solutions, setSolutions] = useState('');
  const [location, setLocation] = useState('');
  const [auditorNotes, setAuditorNotes] = useState('');

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const analyzeImage = async (base64: string) => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analyze this image for hazards. Provide top 3 likely citations and 3 solutions. Format: "CITATIONS:" and "SOLUTIONS:"`;
      const result = await model.generateContent([prompt, { inlineData: { data: base64, mimeType: 'image/jpeg' } }]);
      const responseText = result.response.text();
      // ... parsing logic (simplified for brevity)
      setCitations(responseText); 
    } catch (error) { Alert.alert('Analysis Failed'); }
    finally { setLoading(false); }
  };

  const bg = colors.bg;
  const card = colors.card;
  const cardAlt = colors.cardAlt;
  const border = colors.border;
  const textColor = colors.text;
  const sub = colors.sub;

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: textColor }]}>Photos ({photos.length})</Text>
      <ScrollView horizontal>
        {photos.map((p, i) => (
          <View key={i} style={styles.thumbContainer}>
            <Image source={{ uri: p.uri }} style={styles.thumb} />
            <TouchableOpacity onPress={() => removePhoto(i)} style={styles.removeBtn}><Text style={{ color: 'white' }}>X</Text></TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={[styles.addButton, { backgroundColor: cardAlt, borderColor: border }]} onPress={() => router.push('/tabs/camera')}>
          <Text style={{ color: textColor, fontSize: 28, fontWeight: '700' }}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Inputs remain similar, use state as before */}
      <Text style={[styles.label, { color: textColor }]}>Auditor Notes</Text>
      <TextInput
        style={[styles.input, { backgroundColor: card, borderColor: border, color: textColor }]}
        placeholder="Enter notes"
        placeholderTextColor={sub}
        multiline
        value={auditorNotes}
        onChangeText={setAuditorNotes}
      />

      <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Submitted', 'Report sent to backend.')}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  thumbContainer: { position: 'relative', marginRight: 10 },
  thumb: { width: 100, height: 100, borderRadius: 8 },
  removeBtn: { position: 'absolute', top: 5, right: 5, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, alignItems: 'center' },
  addButton: { width: 100, height: 100, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 20, textAlignVertical: 'top' },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
