import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../src/api/client';

const DRAFT_KEY = 'safescope_hazard_draft_v1';

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
  severity: 'low' | 'medium' | 'high' | 'critical';
  immediateDanger: boolean;
  notes: string;
  images: DraftImage[];
};

type HazardSuggestion = {
  reportId: string;
  suggestedHazardDescription: string;
  observationSummary: string;
  confidence: string;
};

const emptyDraft: HazardDraft = {
  id: undefined,
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
  const [draft, setDraft] = useState<HazardDraft>(emptyDraft);
  const [detecting, setDetecting] = useState(false);
  const [suggestion, setSuggestion] = useState<HazardSuggestion | null>(null);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const raw = await AsyncStorage.getItem(DRAFT_KEY);
        if (raw) {
          setDraft(JSON.parse(raw));
        }
      } catch (error) {
        console.error('Failed to load draft', error);
      }
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

  const buildPayload = () => ({
    hazardDescription: draft.hazardDescription || undefined,
    area: draft.area || undefined,
    equipment: draft.equipment || undefined,
    workActivity: draft.workActivity || undefined,
    severity: draft.severity || undefined,
    immediateDanger: draft.immediateDanger,
    notes: draft.notes || undefined,
    reportStatus: 'draft',
    title: draft.hazardDescription || 'Hazard Draft',
    narrative: draft.notes || draft.hazardDescription || '',
  });

  const ensureReportExists = async () => {
    let reportId = draft.id;

    if (!reportId) {
      const created = await apiClient.createReport(buildPayload());
      reportId = created?.id;
      const nextDraft = { ...draft, id: reportId };
      await persistDraft(nextDraft);
      return reportId;
    }

    await apiClient.updateReport(reportId, buildPayload());
    return reportId;
  };

  const syncNewEvidence = async (reportId: string, newImages: DraftImage[]) => {
    if (!reportId || newImages.length === 0) return;
    await apiClient.addReportEvidence(reportId, newImages);
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

    const newImages: DraftImage[] = result.assets.map((asset) => ({
      uri: asset.uri,
      fileName: asset.fileName ?? `hazard-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
    }));

    const nextDraft = {
      ...draft,
      images: [...draft.images, ...newImages],
    };

    await persistDraft(nextDraft);

    if (draft.id) {
      await syncNewEvidence(draft.id, newImages);
    }
  };

  const chooseFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

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

    const newImages: DraftImage[] = result.assets.map((asset) => ({
      uri: asset.uri,
      fileName: asset.fileName ?? `hazard-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
    }));

    const nextDraft = {
      ...draft,
      images: [...draft.images, ...newImages],
    };

    await persistDraft(nextDraft);

    if (draft.id) {
      await syncNewEvidence(draft.id, newImages);
    }
  };

  const generateFromPhoto = async () => {
    if (draft.images.length === 0) {
      Alert.alert('Add evidence first', 'Take a photo or choose one from the library first.');
      return;
    }

    try {
      setDetecting(true);

      const reportId = await ensureReportExists();
      if (!reportId) {
        Alert.alert('Unable to continue', 'Could not create report.');
        return;
      }

      const result = await apiClient.detectHazard(reportId);
      setSuggestion(result);
    } catch (error) {
      console.error(error);
      Alert.alert('Detection failed', 'Could not generate a suggestion from the photo.');
    } finally {
      setDetecting(false);
    }
  };

  const useSuggestion = async () => {
    if (!suggestion?.suggestedHazardDescription) return;
    await updateField('hazardDescription', suggestion.suggestedHazardDescription);
    Alert.alert('Suggestion applied', 'Review and edit the hazard description as needed.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Hazard</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evidence</Text>

        <View style={styles.evidenceActions}>
          <TouchableOpacity style={styles.primaryButton} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={chooseFromLibrary}>
            <Ionicons name="images-outline" size={18} color="#111827" />
            <Text style={styles.secondaryButtonText}>Choose From Library</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.detectButton}
            onPress={generateFromPhoto}
            disabled={detecting}
          >
            <Ionicons name="sparkles-outline" size={18} color="#fff" />
            <Text style={styles.detectButtonText}>
              {detecting ? 'Generating…' : 'Generate From Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {draft.images.map((img, i) => (
            <Image key={i} source={{ uri: img.uri }} style={styles.image} />
          ))}
        </ScrollView>
      </View>

      {suggestion && (
        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionTitle}>AI Suggestion</Text>

          <Text style={styles.suggestionLabel}>Suggested Hazard</Text>
          <Text style={styles.suggestionValue}>{suggestion.suggestedHazardDescription}</Text>

          <Text style={styles.suggestionLabel}>Observation Summary</Text>
          <Text style={styles.suggestionBody}>{suggestion.observationSummary}</Text>

          <Text style={styles.suggestionLabel}>Confidence</Text>
          <Text style={styles.suggestionConfidence}>{suggestion.confidence}</Text>

          <TouchableOpacity style={styles.useSuggestionButton} onPress={useSuggestion}>
            <Text style={styles.useSuggestionButtonText}>Use Suggestion</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hazard Description</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Example: Missing guard on conveyor tail pulley"
          placeholderTextColor="#94a3b8"
          value={draft.hazardDescription}
          onChangeText={(t) => updateField('hazardDescription', t)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
    color: '#111827',
  },
  section: {
    marginBottom: 22,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
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
  detectButton: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detectButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
    marginRight: 10,
  },
  suggestionCard: {
    marginBottom: 22,
    backgroundColor: '#fff7ed',
    borderColor: '#fdba74',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#9a3412',
    marginBottom: 10,
  },
  suggestionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9a3412',
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  suggestionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  suggestionBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  suggestionConfidence: {
    fontSize: 14,
    fontWeight: '700',
    color: '#b45309',
  },
  useSuggestionButton: {
    marginTop: 14,
    backgroundColor: '#ff6a00',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  useSuggestionButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
    color: '#111827',
  },
});


