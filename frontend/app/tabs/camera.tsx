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
import { LocalVault } from '../../src/storage/LocalVault';
import { useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import AppButton from '../../src/components/ui/AppButton';
import PageHeader from '../../src/components/ui/PageHeader';
import AppFooter from '../../src/components/ui/AppFooter';

const DRAFT_KEY = 'safescope_hazard_draft_v1';

type DraftImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

type HazardDraft = {
  id?: string;
  localVaultId?: string;
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

const severityOptions: HazardDraft['severity'][] = ['low', 'medium', 'high', 'critical'];

export default function CameraScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
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
    const savedLocal = await LocalVault.saveReport({
      id: nextDraft.localVaultId,
      backendReportId: nextDraft.id,
      title: nextDraft.hazardDescription || 'Hazard Draft',
      hazardDescription: nextDraft.hazardDescription,
      narrative: nextDraft.notes || nextDraft.hazardDescription,
      area: nextDraft.area,
      equipment: nextDraft.equipment,
      workActivity: nextDraft.workActivity,
      severity: nextDraft.severity,
      immediateDanger: nextDraft.immediateDanger,
      notes: nextDraft.notes,
      reportStatus: 'draft',
      syncStatus: nextDraft.id ? 'synced' : 'local_only',
      evidence: nextDraft.images.map((img, index) => ({
        id: `${nextDraft.localVaultId || 'draft'}_evidence_${index}`,
        uri: img.uri,
        fileName: img.fileName,
        mimeType: img.mimeType,
        createdAt: new Date().toISOString(),
      })),
    });

    const draftWithVaultId = {
      ...nextDraft,
      localVaultId: savedLocal.id,
    };

    setDraft(draftWithVaultId);
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draftWithVaultId));
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

  
  const removeImage = async (index: number) => {
    const next = draft.images.filter((_, i) => i !== index);
    await persistDraft({ ...draft, images: next });
  };

  const clearImages = async () => {
    await persistDraft({ ...draft, images: [] });
  };

const useSuggestion = async () => {
    if (!suggestion?.suggestedHazardDescription) return;
    await updateField('hazardDescription', suggestion.suggestedHazardDescription);
    Alert.alert('Suggestion applied', 'Review and edit the hazard description as needed.');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <PageHeader
        title="AI Hazard Capture"
        subtitle="Capture evidence, describe the condition, and generate a smart hazard suggestion."
      />

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Evidence</Text>

        <View style={styles.actionStack}>
          <AppButton label="Take Photo" onPress={takePhoto} />
          <AppButton label="Upload Evidence" variant="secondary" onPress={chooseFromLibrary} />
          <TouchableOpacity
            style={[
              styles.detectButton,
              {
                backgroundColor: colors.cardAlt,
                borderColor: colors.border,
              },
            ]}
            onPress={generateFromPhoto}
            disabled={detecting}
          >
            <Ionicons name="sparkles-outline" size={18} color={colors.accent} />
            <Text style={[styles.detectButtonText, { color: colors.text }]}>
              {detecting ? 'Generating…' : 'Generate From Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageRow}
        >
          {draft.images.length === 0 ? (
            <View
              style={[
                styles.emptyEvidence,
                { backgroundColor: colors.cardAlt, borderColor: colors.border },
              ]}
            >
              <Ionicons name="images-outline" size={22} color={colors.muted} />
              <Text style={[styles.emptyEvidenceText, { color: colors.muted }]}>
                No evidence added yet
              </Text>
            </View>
          ) : (
            draft.images.map((img, i) => (
              <View key={i} style={styles.thumbWrap}>
                <Image source={{ uri: img.uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.deleteBadge}
                  onPress={() => removeImage(i)}
                >
                  <Text style={styles.deleteBadgeText}>×</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
          
    </ScrollView>
      </AppCard>

      {suggestion && (
        <AppCard style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <Ionicons name="sparkles-outline" size={18} color={colors.accent} />
            <Text style={[styles.suggestionTitle, { color: colors.text }]}>AI Suggestion</Text>
          </View>

          <Text style={[styles.suggestionLabel, { color: colors.accent }]}>Suggested Hazard</Text>
          <Text style={[styles.suggestionValue, { color: colors.text }]}>
            {suggestion.suggestedHazardDescription}
          </Text>

          <Text style={[styles.suggestionLabel, { color: colors.accent }]}>Observation Summary</Text>
          <Text style={[styles.suggestionBody, { color: colors.sub }]}>
            {suggestion.observationSummary}
          </Text>

          <Text style={[styles.suggestionLabel, { color: colors.accent }]}>Confidence</Text>
          <Text style={[styles.suggestionConfidence, { color: colors.text }]}>
            {suggestion.confidence}
          </Text>

          <AppButton label="Use Suggestion" onPress={useSuggestion} style={styles.useSuggestionButton} />
        </AppCard>
      )}

      <AppCard style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Hazard Details</Text>

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Hazard Description</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.cardAlt,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          multiline
          placeholder="Example: Missing guard on conveyor tail pulley"
          placeholderTextColor={colors.muted}
          value={draft.hazardDescription}
          onChangeText={(t) => updateField('hazardDescription', t)}
        />

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Area</Text>
        <TextInput
          style={[
            styles.textField,
            {
              backgroundColor: colors.cardAlt,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Processing Area B"
          placeholderTextColor={colors.muted}
          value={draft.area}
          onChangeText={(t) => updateField('area', t)}
        />

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Equipment</Text>
        <TextInput
          style={[
            styles.textField,
            {
              backgroundColor: colors.cardAlt,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Conveyor #4"
          placeholderTextColor={colors.muted}
          value={draft.equipment}
          onChangeText={(t) => updateField('equipment', t)}
        />

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Work Activity</Text>
        <TextInput
          style={[
            styles.textField,
            {
              backgroundColor: colors.cardAlt,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Routine inspection / cleanup / startup"
          placeholderTextColor={colors.muted}
          value={draft.workActivity}
          onChangeText={(t) => updateField('workActivity', t)}
        />

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Severity</Text>
        <View style={styles.chipRow}>
          {severityOptions.map((option) => {
            const active = draft.severity === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.accent : colors.cardAlt,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => updateField('severity', option)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {option.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Notes</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.cardAlt,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          multiline
          placeholder="Additional site context, observations, or controls already in place"
          placeholderTextColor={colors.muted}
          value={draft.notes}
          onChangeText={(t) => updateField('notes', t)}
        />
      </AppCard>
      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
    flexGrow: 1,
  },
  sectionCard: {
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '800',
    marginBottom: tokens.spacing.md,
  },
  actionStack: {
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  detectButton: {
    minHeight: 52,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: tokens.spacing.lg,
  },
  detectButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  imageRow: {
    gap: tokens.spacing.sm,
  },
  emptyEvidence: {
    width: 180,
    height: 110,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyEvidenceText: {
    fontSize: tokens.type.small,
    fontWeight: '600',
  },
  
thumbWrap: {
  position: 'relative',
},

deleteBadge: {
  position: 'absolute',
  top: 4,
  right: 4,
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: '#ef4444',
  alignItems: 'center',
  justifyContent: 'center',
},

deleteBadgeText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '800',
  lineHeight: 18,
},

image: {
    width: 110,
    height: 110,
    borderRadius: tokens.radius.md,
  },
  suggestionCard: {
    marginBottom: tokens.spacing.lg,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: tokens.spacing.sm,
  },
  suggestionTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '800',
  },
  suggestionLabel: {
    fontSize: tokens.type.small,
    fontWeight: '800',
    marginTop: tokens.spacing.sm,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  suggestionValue: {
    fontSize: tokens.type.body,
    fontWeight: '700',
  },
  suggestionBody: {
    fontSize: tokens.type.body,
    lineHeight: 20,
  },
  suggestionConfidence: {
    fontSize: tokens.type.body,
    fontWeight: '700',
  },
  useSuggestionButton: {
    marginTop: tokens.spacing.md,
  },
  fieldLabel: {
    fontSize: tokens.type.small,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: tokens.spacing.sm,
  },
  input: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    textAlignVertical: 'top',
  },
  textField: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipText: {
    fontSize: tokens.type.small,
    fontWeight: '800',
  },
});
