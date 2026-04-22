import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'MISSING_API_KEY');

export default function ReviewScreen() {
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Photos ({photos.length})</Text>
      <ScrollView horizontal>
        {photos.map((p, i) => (
          <View key={i} style={styles.thumbContainer}>
            <Image source={{ uri: p.uri }} style={styles.thumb} />
            <TouchableOpacity onPress={() => removePhoto(i)} style={styles.removeBtn}><Text style={{color:'white'}}>X</Text></TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/tabs/camera')}><Text>+</Text></TouchableOpacity>
      </ScrollView>

      {/* Inputs remain similar, use state as before */}
      <Text style={styles.label}>Auditor Notes</Text>
      <TextInput style={styles.input} multiline value={auditorNotes} onChangeText={setAuditorNotes} />

      <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Submitted', 'Report sent to backend.')}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  thumbContainer: { position: 'relative', marginRight: 10 },
  thumb: { width: 100, height: 100, borderRadius: 8 },
  removeBtn: { position: 'absolute', top: 5, right: 5, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, alignItems: 'center' },
  addButton: { width: 100, height: 100, borderRadius: 8, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
