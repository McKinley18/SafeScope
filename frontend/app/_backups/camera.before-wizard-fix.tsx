import React, { useMemo, useState } from 'react';
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
import BrandedHeader from '../../src/components/ui/BrandedHeader';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';

type WizardStep = 0 | 1 | 2 | 3 | 4 | 5;

type HazardDraft = {
  id: string;
  photos: string[];
  hazardDescription: string;
  location: string;
  equipment: string;
  possibleStandards: string[];
  selectedStandard: string;
  correctiveAction: string;
  assignedTo: string;
  dueDate: string;
  notes: string;
  completed: boolean;
};

const DRAFT_KEY = 'sentinel_safety_inspection_wizard_draft_v1';

const emptyHazard = (): HazardDraft => ({
  id: `HZ-${Date.now()}`,
  photos: [],
  hazardDescription: '',
  location: '',
  equipment: '',
  possibleStandards: [],
  selectedStandard: '',
  correctiveAction: '',
  assignedTo: '',
  dueDate: '',
  notes: '',
  completed: false,
});

const steps = [
  'Photos',
  'Hazard',
  'Standards',
  'Location',
  'Action',
  'Save',
];

export default function InspectScreen() {
  const { colors } = useAppTheme();
  const [currentStep, setCurrentStep] = useState<WizardStep>(0);
  const [currentHazard, setCurrentHazard] = useState<HazardDraft>(emptyHazard());
  const [hazards, setHazards] = useState<HazardDraft[]>([]);

  const updateHazard = (patch: Partial<HazardDraft>) => {
    setCurrentHazard((prev) => ({ ...prev, ...patch }));
  };

  const isStepComplete = (step: WizardStep) => {
    if (step === 0) return currentHazard.photos.length > 0;
    if (step === 1) return currentHazard.hazardDescription.trim().length >= 8;
    if (step === 2) return (currentHazard.possibleStandards || []).length > 0;
    if (step === 3) return currentHazard.location.trim().length > 0;
    if (step === 4) return currentHazard.correctiveAction.trim().length >= 8 && currentHazard.assignedTo.trim().length > 0;
    if (step === 5) return isHazardComplete(currentHazard);
    return false;
  };

  const isHazardComplete = (hazard: HazardDraft) => {
    return (
      hazard.photos.length > 0 &&
      hazard.hazardDescription.trim().length >= 8 &&
      (hazard.possibleStandards || []).length > 0 &&
      hazard.location.trim().length > 0 &&
      hazard.correctiveAction.trim().length >= 8 &&
      hazard.assignedTo.trim().length > 0
    );
  };

  const completionPercent = useMemo(() => {
    const completedSteps = [
      currentHazard.photos.length > 0,
      currentHazard.hazardDescription.trim().length >= 8,
      (currentHazard.possibleStandards || []).length > 0,
      currentHazard.location.trim().length > 0,
      currentHazard.correctiveAction.trim().length >= 8 && currentHazard.assignedTo.trim().length > 0,
      isHazardComplete(currentHazard),
    ].filter(Boolean).length;

    return Math.round((completedSteps / steps.length) * 100);
  }, [currentHazard]);

  const stepError = (step: WizardStep) => {
    if (step === 0) return 'Add at least one photo before continuing.';
    if (step === 1) return 'Describe the hazard before continuing.';
    if (step === 2) return 'Run the standard match review before continuing.';
    if (step === 3) return 'Enter the hazard location before continuing.';
    if (step === 4) return 'Enter the corrective action and assign responsibility before continuing.';
    return 'Complete this hazard before continuing.';
  };

  const goNext = () => {
    if (!isStepComplete(currentStep)) {
      Alert.alert('Step incomplete', stepError(currentStep));
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Camera permission needed', 'Allow camera access to capture inspection photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.75,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      updateHazard({ photos: [...currentHazard.photos, result.assets[0].uri] });
    }
  };

  const uploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Photo permission needed', 'Allow photo access to upload inspection evidence.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.75,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled && result.assets?.length) {
      updateHazard({
        photos: [...currentHazard.photos, ...result.assets.map((asset) => asset.uri)],
      });
    }
  };

  const runStandardMatch = () => {
    const text = currentHazard.hazardDescription.toLowerCase();

    const matches = [
      text.includes('ladder') ? 'Ladders / safe access standard review' : '',
      text.includes('guard') || text.includes('unguarded') ? 'Machine guarding standard review' : '',
      text.includes('fire') || text.includes('extinguisher') ? 'Fire protection standard review' : '',
      text.includes('electrical') || text.includes('wire') ? 'Electrical safety standard review' : '',
      text.includes('ppe') || text.includes('helmet') || text.includes('glove') ? 'Personal protective equipment standard review' : '',
    ].filter(Boolean);

    const fallback = ['General workplace hazard standard review'];

    updateHazard({
      possibleStandards: matches.length ? matches : fallback,
      selectedStandard: matches[0] || fallback[0],
    });
  };

  const completeHazard = async () => {
    if (!isHazardComplete(currentHazard)) {
      Alert.alert('Hazard incomplete', 'Complete all required hazard steps before saving this hazard.');
      return;
    }

    const completedHazard = {
      ...currentHazard,
      completed: true,
    };

    const nextHazards = [...hazards, completedHazard];
    setHazards(nextHazards);
    setCurrentHazard(emptyHazard());
    setCurrentStep(0);

    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({ hazards: nextHazards }));

    Alert.alert('Hazard added', 'This hazard was added to the report. You can now document the next hazard.');
  };

  const submitReport = async () => {
    if (hazards.length === 0 && !isHazardComplete(currentHazard)) {
      Alert.alert('No completed hazards', 'Complete at least one hazard before submitting the report.');
      return;
    }

    const finalHazards = isHazardComplete(currentHazard)
      ? [...hazards, { ...currentHazard, completed: true }]
      : hazards;

    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({ hazards: finalHazards }));

    Alert.alert(
      'Report ready',
      `Report package created with ${finalHazards.length} completed hazard${finalHazards.length === 1 ? '' : 's'}.`
    );
  };

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Capture Photos</Text>
          <Text style={[styles.helper, { color: colors.sub }]}>
            Add clear evidence for this hazard before moving forward.
          </Text>

          <View style={styles.buttonRow}>
            <ActionButton label="Take Photo" icon="camera-outline" onPress={takePhoto} />
            <ActionButton label="Upload" icon="cloud-upload-outline" onPress={uploadPhoto} secondary />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
            {currentHazard.photos.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.photo} />
            ))}
          </ScrollView>
        </View>
      );
    }

    if (currentStep === 1) {
      return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Describe Hazard</Text>
          <Text style={[styles.helper, { color: colors.sub }]}>
            Explain what is unsafe, who is exposed, and what could happen.
          </Text>

          <TextInput
            style={[styles.textArea, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Example: Damaged ladder with bent side rail being used near the maintenance area."
            placeholderTextColor={colors.muted}
            multiline
            value={currentHazard.hazardDescription}
            onChangeText={(hazardDescription) => updateHazard({ hazardDescription })}
          />
        </View>
      );
    }

    if (currentStep === 2) {
      return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Standard Match Review</Text>
          <Text style={[styles.helper, { color: colors.sub }]}>
            Sentinel Safety checks the hazard description for keywords and suggests possible applicable standards for review.
          </Text>

          <TouchableOpacity style={styles.completeButton} onPress={runStandardMatch}>
            <Text style={styles.completeButtonText}>Check Possible Standards</Text>
          </TouchableOpacity>

          {(currentHazard.possibleStandards || []).map((standard) => (
            <TouchableOpacity
              key={standard}
              style={[
                styles.standardCard,
                {
                  borderColor: currentHazard.selectedStandard === standard ? colors.accent : colors.border,
                  backgroundColor: colors.cardAlt,
                },
              ]}
              onPress={() => updateHazard({ selectedStandard: standard })}
            >
              <Text style={[styles.standardText, { color: colors.text }]}>{standard}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.helper, { color: colors.sub }]}>
            Final compliance responsibility remains with the qualified user. This step helps guide review, not replace judgment.
          </Text>
        </View>
      );
    }

    if (currentStep === 3) {
      return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Location Information</Text>
          <Text style={[styles.helper, { color: colors.sub }]}>
            Identify exactly where the hazard exists and what equipment or area is involved.
          </Text>

          <TextInput
            style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Location"
            placeholderTextColor={colors.muted}
            value={currentHazard.location}
            onChangeText={(location) => updateHazard({ location })}
          />

          <TextInput
            style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Equipment / Area"
            placeholderTextColor={colors.muted}
            value={currentHazard.equipment}
            onChangeText={(equipment) => updateHazard({ equipment })}
          />
        </View>
      );
    }

    if (currentStep === 4) {
      return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Corrective Action & Assignment</Text>
          <Text style={[styles.helper, { color: colors.sub }]}>
            Document the required action, assign ownership, and set a target due date.
          </Text>

          <TextInput
            style={[styles.textArea, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Required corrective action"
            placeholderTextColor={colors.muted}
            multiline
            value={currentHazard.correctiveAction}
            onChangeText={(correctiveAction) => updateHazard({ correctiveAction })}
          />

          <TextInput
            style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Assigned To"
            placeholderTextColor={colors.muted}
            value={currentHazard.assignedTo}
            onChangeText={(assignedTo) => updateHazard({ assignedTo })}
          />

          <TextInput
            style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Due Date"
            placeholderTextColor={colors.muted}
            value={currentHazard.dueDate}
            onChangeText={(dueDate) => updateHazard({ dueDate })}
          />

          <TextInput
            style={[styles.textArea, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
            placeholder="Additional notes"
            placeholderTextColor={colors.muted}
            multiline
            value={currentHazard.notes}
            onChangeText={(notes) => updateHazard({ notes })}
          />
        </View>
      );
    }

    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Review Hazard</Text>
        <Text style={[styles.helper, { color: colors.sub }]}>
          Confirm this hazard is complete before adding another hazard to the report.
        </Text>

        <ReviewLine label="Photos" value={`${currentHazard.photos.length}`} />
        <ReviewLine label="Hazard" value={currentHazard.hazardDescription} />
        <ReviewLine label="Location" value={currentHazard.location} />
        <ReviewLine label="Equipment" value={currentHazard.equipment || 'Not specified'} />
        <ReviewLine label="Possible Standard" value={currentHazard.selectedStandard} />
        <ReviewLine label="Corrective Action" value={currentHazard.correctiveAction} />
        <ReviewLine label="Assigned To" value={currentHazard.assignedTo} />
        <ReviewLine label="Due Date" value={currentHazard.dueDate || "Not set"} />

        <TouchableOpacity style={styles.completeButton} onPress={completeHazard}>
          <Text style={styles.completeButtonText}>Save & Add New Hazard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
          <Text style={styles.submitButtonText}>Save & Review Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quitButton} onPress={completeHazard}>
          <Text style={styles.quitButtonText}>Save & Quit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <BrandedHeader
        title="Inspect"
        subtitle="Build the report one completed hazard at a time."
      />

      <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.progressTitle, { color: colors.text }]}>Hazard Report Progress</Text>
        <Text style={[styles.progressPercent, { color: colors.accent }]}>{completionPercent}% Complete</Text>

        <View style={styles.steps}>
          {steps.map((step, index) => {
            const active = index === currentStep;
            const complete = isStepComplete(index as WizardStep);

            return (
              <TouchableOpacity
                key={step}
                style={[
                  styles.stepPill,
                  {
                    borderColor: active || complete ? colors.accent : colors.border,
                    backgroundColor: active ? colors.accent : colors.cardAlt,
                  },
                ]}
                onPress={() => {
                  if (index <= currentStep || complete) setCurrentStep(index as WizardStep);
                }}
              >
                <Text style={[styles.stepText, { color: active ? '#fff' : colors.text }]}>
                  {index + 1}. {step}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {hazards.length > 0 && (
        <View style={[styles.savedHazards, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.savedTitle, { color: colors.text }]}>Completed Hazards</Text>
          {hazards.map((hazard, index) => (
            <Text key={hazard.id} style={[styles.savedItem, { color: colors.sub }]}>
              {index + 1}. {hazard.hazardDescription}
            </Text>
          ))}
        </View>
      )}

      {renderStep()}

      {currentStep < 5 && (
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navButton, { borderColor: colors.border }]}
            onPress={goBack}
            disabled={currentStep === 0}
          >
            <Text style={[styles.navText, { color: currentStep === 0 ? colors.muted : colors.text }]}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={goNext}>
            <Text style={styles.nextText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function ActionButton({
  label,
  icon,
  onPress,
  secondary,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.actionButton, secondary && styles.actionButtonSecondary]} onPress={onPress}>
      <Ionicons name={icon} size={18} color={secondary ? '#F97316' : '#fff'} />
      <Text style={[styles.actionButtonText, secondary && styles.actionButtonTextSecondary]}>{label}</Text>
    </TouchableOpacity>
  );
}

function OptionPill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.optionPill, selected && styles.optionPillSelected]} onPress={onPress}>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ReviewLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reviewLine}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value || 'Missing'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: 140,
    flexGrow: 1,
  },
  progressCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  progressPercent: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '900',
  },
  steps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  stepPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  stepText: {
    fontSize: 11,
    fontWeight: '900',
  },
  savedHazards: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
  },
  savedTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },
  savedItem: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 6,
  },
  helper: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  actionButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F97316',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '900',
  },
  actionButtonTextSecondary: {
    color: '#F97316',
  },
  photoRow: {
    gap: 10,
  },
  photo: {
    width: 118,
    height: 118,
    borderRadius: 18,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 116,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
    marginTop: 6,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  optionPill: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  optionPillSelected: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  optionText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '900',
  },
  optionTextSelected: {
    color: '#fff',
  },
  reviewLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingVertical: 10,
  },
  reviewLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  reviewValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  completeButton: {
    marginTop: 16,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  submitButton: {
    marginTop: 10,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#F97316',
    fontSize: 15,
    fontWeight: '900',
  },
  quitButton: {
    marginTop: 10,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quitButtonText: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '900',
  },
  standardCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  standardText: {
    fontSize: 14,
    fontWeight: '900',
  },
  navRow: {
    flexDirection: 'row',
    gap: 10,
  },
  navButton: {
    flex: 1,
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontWeight: '900',
  },
  nextButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '900',
  },
});
