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

const DRAFT_KEY = 'safescope_hazard_draft_v1';

type Severity = 'low' | 'medium' | 'high' | 'critical';

type DraftImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

type HazardDraft = {
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
    try {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
    } catch (error) {
      console.error('Failed to save local draft', error);
    }
  };

  const updateField = async <K extends keyof HazardDraft>(key: K, value: HazardDraft[K]) => {
    const nextDraft = { ...draft, [key]: value };
    await persistDraft(nextDraft);
  };

  const addImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow photo library access to attach hazard evidence.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (result.canceled) return;

    const newImages: DraftImage[] = result.assets.map((asset) => ({
      uri: asset.uri,
      fileName: asset.fileName ?? `hazard-${Date.now()}.jpg`,
      mimeType: asset.mimeType ?? 'image/jpeg',
    }));

    await persistDraft({
      ...draft,
      images: [...draft.images, ...newImages],
    });
  };

  const removeImage = async (index: number) => {
    const nextImages = draft.images.filter((_, i) => i !== index);
    await persistDraft({
      ...draft,
      images: nextImages,
    });
  };

  const saveDraft = async () => {
    if (!draft.hazardDescription.trim() && draft.images.length === 0) {
      Alert.alert('Nothing to save', 'Add a hazard description or at least one image first.');
      return;
    }

    setSaving(true);
    try {
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      Alert.alert('Draft saved', 'Your hazard draft was saved on this device.');
    } catch (error) {
      Alert.alert('Save failed', 'We could not save the draft locally.');
    } finally {
      setSaving(false);
    }
  };

  const analyzeHazard = async () => {
    if (!draft.hazardDescription.trim()) {
      Alert.alert('Hazard description required', 'Enter a hazard description before continuing.');
      return;
    }

    Alert.alert(
      'Analyze Hazard',
      'Sprint 1 complete: this draft is now structured and ready for backend save and standards retrieval wiring in Sprint 2.'
    );
  };

  const clearDraft = async () => {
    await AsyncStorage.removeItem(DRAFT_KEY);
    setDraft(emptyDraft);
  };

  const severityOptions: Severity[] = ['low', 'medium', 'high', 'critical'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Hazard</Text>
        <Text style={styles.subtitle}>
          Capture evidence, describe the condition, and add enough context for standards lookup.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Evidence</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={addImages}>
          <Ionicons name="images-outline" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Add Photos</Text>
        </TouchableOpacity>

        {draft.images.length === 0 ? (
          <Text style={styles.helperText}>No photos attached yet.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
            {draft.images.map((image, index) => (
              <View key={`${image.uri}-${index}`} style={styles.imageCard}>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(index)}>
                  <Ionicons name="close-circle" size={22} color="#ff6a00" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hazard Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Example: Missing guard on conveyor tail pulley"
          placeholderTextColor="#94a3b8"
          multiline
          value={draft.hazardDescription}
          onChangeText={(text) => updateField('hazardDescription', text)}
        />
        <Text style={styles.helperText}>
          Describe the known hazard in plain language. This will drive standards retrieval later.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Context</Text>

        <Text style={styles.label}>Area</Text>
        <TextInput
          style={styles.input}
          placeholder="Prep Plant - Line 2"
          placeholderTextColor="#94a3b8"
          value={draft.area}
          onChangeText={(text) => updateField('area', text)}
        />

        <Text style={styles.label}>Equipment</Text>
        <TextInput
          style={styles.input}
          placeholder="Conveyor CV-201"
          placeholderTextColor="#94a3b8"
          value={draft.equipment}
          onChangeText={(text) => updateField('equipment', text)}
        />

        <Text style={styles.label}>Work Activity</Text>
        <TextInput
          style={styles.input}
          placeholder="Routine operation"
          placeholderTextColor="#94a3b8"
          value={draft.workActivity}
          onChangeText={(text) => updateField('workActivity', text)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk and Notes</Text>

        <Text style={styles.label}>Severity</Text>
        <View style={styles.chipRow}>
          {severityOptions.map((option) => {
            const active = draft.severity === option;
            return (
              <TouchableOpacity
                key={option}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => updateField('severity', option)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Immediate Danger</Text>
            <Text style={styles.helperText}>
              Turn on if the condition may require urgent action or immediate escalation.
            </Text>
          </View>
          <Switch
            value={draft.immediateDanger}
            onValueChange={(value) => updateField('immediateDanger', value)}
            trackColor={{ false: '#cbd5e1', true: '#fdba74' }}
            thumbColor={draft.immediateDanger ? '#ff6a00' : '#64748b'}
          />
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesArea]}
          placeholder="Optional notes, conditions, work status, or missing context"
          placeholderTextColor="#94a3b8"
          multiline
          value={draft.notes}
          onChangeText={(text) => updateField('notes', text)}
        />
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.secondaryButton} onPress={clearDraft}>
          <Text style={styles.secondaryButtonText}>Clear Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={saveDraft} disabled={saving}>
          <Text style={styles.secondaryButtonText}>{saving ? 'Saving…' : 'Save Draft'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            !draft.hazardDescription.trim() && { opacity: 0.5 },
          ]}
          onPress={analyzeHazard}
          disabled={!draft.hazardDescription.trim()}
        >
          <Ionicons name="search-outline" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Analyze Hazard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    padding: 18,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  notesArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#64748b',
  },
  imageRow: {
    marginTop: 12,
  },
  imageCard: {
    marginRight: 12,
    position: 'relative',
  },
  imagePreview: {
    width: 130,
    height: 130,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f8fafc',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: '#ff6a00',
    borderColor: '#ff6a00',
  },
  chipText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#fff',
  },
  switchRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionSection: {
    gap: 10,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: '#ff6a00',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 15,
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backLinkText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});
