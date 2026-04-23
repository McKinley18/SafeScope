import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../src/api/client';

const DRAFT_KEY = 'safescope_hazard_draft_v1';

type Severity = 'low' | 'medium' | 'high' | 'critical';

type DraftImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

type HazardDraft = {
  id?: string;
  hazardDescription: string;
  area: string;
  equipment: string;
  workActivity: string;
  severity: Severity;
  immediateDanger: boolean;
  notes: string;
  images: DraftImage[];
};

const emptyDraft: HazardDraft = {
  hazardDescription: '',
  area: '',
  equipment: '',
  workActivity: '',
  severity: 'medium',
  immediateDanger: false,
  notes: '',
  images: [],
};

export default function CameraScreen() {
  const router = useRouter();

  const [draft, setDraft] = useState<HazardDraft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const loadDraft = async () => {
      const raw = await AsyncStorage.getItem(DRAFT_KEY);
      if (raw) setDraft(JSON.parse(raw));
    };
    loadDraft();
  }, []);

  const persistDraft = async (nextDraft: HazardDraft) => {
    setDraft(nextDraft);
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
  };

  const updateField = async <K extends keyof HazardDraft>(
    key: K,
    value: HazardDraft[K]
  ) => {
    await persistDraft({ ...draft, [key]: value });
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow camera access.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      mediaTypes: ['images'],
    });

    if (result.canceled) return;

    const newImages = result.assets.map((asset) => ({
      uri: asset.uri,
      fileName: asset.fileName ?? `hazard-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
    }));

    await persistDraft({
      ...draft,
      images: [...draft.images, ...newImages],
    });
  };

  const chooseFromLibrary = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow photo access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      mediaTypes: ['images'],
    });

    if (result.canceled) return;

    const newImages = result.assets.map((asset) => ({
      uri: asset.uri,
      fileName: asset.fileName ?? `hazard-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
    }));

    await persistDraft({
      ...draft,
      images: [...draft.images, ...newImages],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Hazard</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evidence</Text>

        <View style={styles.evidenceActions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={takePhoto}
          >
            <Ionicons name="camera-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={chooseFromLibrary}
          >
            <Ionicons name="images-outline" size={18} color="#111827" />
            <Text style={styles.secondaryButtonText}>
              Choose From Library
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal>
          {draft.images.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img.uri }}
              style={styles.image}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hazard Description</Text>
        <TextInput
          style={styles.input}
          multiline
          value={draft.hazardDescription}
          onChangeText={(t) =>
            updateField('hazardDescription', t)
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  evidenceActions: {
    gap: 10,
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#ff6a00',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '700',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
    marginRight: 10,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
  },
});
