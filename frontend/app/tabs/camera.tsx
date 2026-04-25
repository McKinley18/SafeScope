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
import { matchStandards } from '../../src/standards/standardsMatcher';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import AppButton from '../../src/components/ui/AppButton';
import AppFooter from '../../src/components/ui/AppFooter';
import BrandedHeader from '../../src/components/ui/BrandedHeader';

const DRAFT_KEY = 'safescope_hazard_draft_v1';
const AUTH_USER_KEY = 'safescope_auth_user_v1';

type DraftImage = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

type InspectionFinding = {
  id: string;
  hazardDescription: string;
  area: string;
  equipment: string;
  workActivity: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  immediateDanger: boolean;
  notes: string;
  images: DraftImage[];
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
  findings: InspectionFinding[];
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
  findings: [],
};

const severityOptions: HazardDraft['severity'][] = ['low', 'medium', 'high', 'critical'];

export default function CameraScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [draft, setDraft] = useState<HazardDraft>(emptyDraft);
  const [detecting, setDetecting] = useState(false);
  const [suggestion, setSuggestion] = useState<HazardSuggestion | null>(null);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const localVaultId = typeof params.localVaultId === 'string' ? params.localVaultId : '';

        if (localVaultId) {
          const vaultReport = await LocalVault.getReport(localVaultId);

          if (vaultReport) {
            const restoredDraft: HazardDraft = {
              id: vaultReport.backendReportId,
              localVaultId: vaultReport.id,
              hazardDescription: vaultReport.hazardDescription || '',
              area: vaultReport.area || '',
              equipment: vaultReport.equipment || '',
              workActivity: vaultReport.workActivity || '',
              severity: (vaultReport.severity as HazardDraft['severity']) || 'medium',
              immediateDanger: !!vaultReport.immediateDanger,
              notes: vaultReport.notes || vaultReport.narrative || '',
              findings: [],
              images: vaultReport.evidence.map((item) => ({
                uri: item.uri,
                fileName: item.fileName,
                mimeType: item.mimeType,
              })),
            };

            setDraft(restoredDraft);
            await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(restoredDraft));
            return;
          }
        }

        const raw = await AsyncStorage.getItem(DRAFT_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setDraft({ ...emptyDraft, ...parsed, findings: parsed.findings || [] });
        }
      } catch (error) {
        console.error('Failed to load draft', error);
      }
    };

    loadDraft();
  }, [params.localVaultId]);

  const persistDraft = async (nextDraft: HazardDraft) => {
    const savedLocal = await LocalVault.saveReport({
      id: nextDraft.localVaultId,
      backendReportId: nextDraft.id,
      title:
        nextDraft.hazardDescription ||
        nextDraft.area ||
        nextDraft.equipment ||
        'Untitled Draft',
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
      evidence: [
        ...(nextDraft.findings || []).flatMap((finding) => finding.images || []),
        ...nextDraft.images,
      ].map((img, index) => ({
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

  const hasCurrentFinding = () => {
    return Boolean(
      draft.images.length ||
      draft.hazardDescription.trim() ||
      draft.area.trim() ||
      draft.equipment.trim() ||
      draft.workActivity.trim() ||
      draft.notes.trim()
    );
  };

  const getAllFindings = () => {
    const saved = draft.findings || [];

    if (!hasCurrentFinding()) return saved;

    return [
      ...saved,
      {
        id: `finding-current`,
        hazardDescription: draft.hazardDescription,
        area: draft.area,
        equipment: draft.equipment,
        workActivity: draft.workActivity,
        severity: draft.severity,
        immediateDanger: draft.immediateDanger,
        notes: draft.notes,
        images: draft.images,
      },
    ];
  };

  const saveCurrentFinding = async () => {
    if (!hasCurrentFinding()) {
      Alert.alert('Nothing to save', 'Add photos or finding details first.');
      return;
    }

    const finding: InspectionFinding = {
      id: `finding-${Date.now()}`,
      hazardDescription: draft.hazardDescription,
      area: draft.area,
      equipment: draft.equipment,
      workActivity: draft.workActivity,
      severity: draft.severity,
      immediateDanger: draft.immediateDanger,
      notes: draft.notes,
      images: draft.images,
    };

    await persistDraft({
      ...draft,
      findings: [...(draft.findings || []), finding],
      hazardDescription: '',
      area: '',
      equipment: '',
      workActivity: '',
      severity: 'medium',
      immediateDanger: false,
      notes: '',
      images: [],
    });

    setSuggestion(null);
    Alert.alert('Finding saved', 'You can now add the next finding.');
  };

  const removeFinding = async (id: string) => {
    await persistDraft({
      ...draft,
      findings: (draft.findings || []).filter((finding) => finding.id !== id),
    });
  };

  const buildPayload = async () => {
  const rawUser = await AsyncStorage.getItem(AUTH_USER_KEY);
  const user = rawUser ? JSON.parse(rawUser) : {};

  const findings = getAllFindings();

  const findingsSummary = findings
    .map((finding, index) => {
      return [
        `Finding ${index + 1}: ${finding.hazardDescription || 'Untitled finding'}`,
        finding.area ? `Area: ${finding.area}` : '',
        finding.equipment ? `Equipment: ${finding.equipment}` : '',
        finding.workActivity ? `Work Performed: ${finding.workActivity}` : '',
        `Severity: ${finding.severity}`,
        finding.notes ? `Notes: ${finding.notes}` : '',
        `Photos: ${finding.images.length}`,
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');

  return {
    tenantId: user.tenantId || 'default',
    createdByUserId: user.id || undefined,
    sourceType: 'mobile',
    title: findings[0]?.hazardDescription || draft.hazardDescription || 'Untitled Draft',
    narrative: findingsSummary || draft.notes || draft.hazardDescription || '',
    reportStatus: 'draft',
    hazardDescription: findings[0]?.hazardDescription || draft.hazardDescription || undefined,
    area: draft.area || undefined,
    equipment: draft.equipment || undefined,
    workActivity: draft.workActivity || undefined,
    severity: draft.severity || undefined,
    notes: findingsSummary || draft.notes || undefined,
    likelyStandards: matchStandards(
      [draft.hazardDescription, draft.notes, draft.equipment, draft.workActivity]
        .filter(Boolean)
        .join(' ')
    ),
  };
};

  const ensureReportExists = async () => {
    let reportId = draft.id;

    if (!reportId) {
      const created = await apiClient.createReport(await buildPayload());
      reportId = created?.id;
      const nextDraft = { ...draft, id: reportId };
      await persistDraft(nextDraft);
      return reportId;
    }

    await apiClient.updateReport(reportId, await buildPayload());
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

  const saveDraft = async () => {
    await persistDraft(draft);
    Alert.alert('Draft saved', 'This finding has been saved to the local vault.');
  };

  const submitForReview = async () => {
    try {
      const reportId = await ensureReportExists();
      if (!reportId) {
        Alert.alert('Unable to submit', 'Could not create report.');
        return;
      }

      await apiClient.updateReport(reportId, {
        ...(await buildPayload()),
        reportStatus: 'submitted',
      });

      Alert.alert('Report submitted', 'This report has been sent to the Work Queue.');
      router.push('/tabs/review');
    } catch (error) {
      console.error(error);
      Alert.alert('Submit failed', 'Unable to submit report for review.');
    }
  };

const useSuggestion = async () => {
    if (!suggestion?.suggestedHazardDescription) return;
    await updateField('hazardDescription', suggestion.suggestedHazardDescription);
    Alert.alert('Suggestion applied', 'Review and edit the hazard description as needed.');
  };

  const standardMatches = matchStandards(
    [draft.hazardDescription, draft.notes, draft.equipment, draft.workActivity]
      .filter(Boolean)
      .join(' ')
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader
        title="Inspect"
        subtitle="Add photos to this finding, complete the details, then save or submit the report."
      />

      <View style={styles.actionStack}>
        <AppButton label="Save Draft" variant="secondary" onPress={saveDraft} />
        <AppButton label="Save & Add Finding" variant="secondary" onPress={saveCurrentFinding} />
        <AppButton label="Submit Report" onPress={submitForReview} />
      </View>

      <View style={styles.sectionBlock}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Photos</Text>
        <Text style={[styles.helperText, { color: colors.sub }]}>
          Attach one or more photos for this finding. Use additional findings for separate hazards.
        </Text>
<Text style={[styles.helperText, { color: colors.sub }]}>
Add photo(s), complete this finding, then continue to the next finding or save draft.
</Text>

        <View style={styles.actionStack}>
          <AppButton label="Take Photo" onPress={takePhoto} />
          <AppButton label="Upload Photo" variant="secondary" onPress={chooseFromLibrary} />
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

        {(draft.findings || []).length > 0 && (
          <View style={styles.savedFindings}>
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>Saved Findings</Text>

            {draft.findings.map((finding, index) => (
              <View
                key={finding.id}
                style={[styles.savedFindingCard, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.savedFindingTitle, { color: colors.text }]}>
                    Finding {index + 1}: {finding.hazardDescription || 'Untitled finding'}
                  </Text>
                  <Text style={[styles.savedFindingMeta, { color: colors.sub }]}>
                    {finding.area || 'No area'} • {finding.images.length} photo(s) • {finding.severity.toUpperCase()}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => removeFinding(finding.id)}>
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

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

      <View style={styles.sectionBlock}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Finding Information</Text>

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

        <View style={styles.inlineStandards}>
          <Text style={[styles.subSectionTitle, { color: colors.text }]}>Suggested Standards</Text>

          {standardMatches.length === 0 ? (
            <Text style={[styles.standardEmpty, { color: colors.sub }]}>
              Enter the finding details to see suggested standards.
            </Text>
          ) : (
            standardMatches.map((item) => (
              <View
                key={item.id}
                style={[styles.standardCard, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
              >
                <Text style={[styles.standardCitation, { color: colors.accent }]}>
                  {item.citation}
                </Text>

                <Text style={[styles.standardTitle, { color: colors.text }]}>
                  {item.title}
                </Text>

                <Text style={[styles.standardMeta, { color: colors.sub }]}>
                  {item.source} • {item.category} • {item.confidence.toUpperCase()}
                </Text>

                <Text style={[styles.standardWhy, { color: colors.muted }]}>
                  {item.rationale}
                </Text>
              </View>
            ))
          )}
        </View>

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
      </View>

      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 12,
    fontWeight: '600',
  },
  container: {
    padding: tokens.spacing.md,
    paddingBottom: 20,
    flexGrow: 1,
  },
  sectionCard: {
    marginBottom: tokens.spacing.lg,
  },
  screenHeader: {
    paddingTop: 4,
    paddingBottom: 18,
  },
  headerKicker: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  headerSub: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  sectionBlock: {
    marginBottom: tokens.spacing.xl,
  },
  vaultLink: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  vaultLinkText: {
    fontSize: tokens.type.body,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
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
  inlineStandards: {
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: tokens.spacing.sm,
  },
  savedFindings: {
    marginTop: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  savedFindingCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  savedFindingTitle: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 3,
  },
  savedFindingMeta: {
    fontSize: 11,
    fontWeight: '700',
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
    paddingHorizontal: 8,
    paddingVertical: 6,
    flex: 1,
    alignItems: 'center',
  },
  chipText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  standardEmpty: {
    fontSize: 13,
    fontWeight: '700',
  },
  standardCard: {
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },
  standardCitation: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 4,
  },
  standardTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  standardMeta: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  standardWhy: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
  },
});
