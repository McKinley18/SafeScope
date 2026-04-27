import React, { useMemo, useRef, useState } from 'react';
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
import BrandedHeader from '../../src/components/ui/BrandedHeader';
import { useAppTheme } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';

type HazardDraft = {
  id: string;
  photos: string[];
  hazardDescription: string;
  possibleStandards: string[];
  selectedStandard: string;
  location: string;
  equipment: string;
  correctiveAction: string;
  assignedTo: string;
  dueDate: string;
  notes: string;
  completed: boolean;
};

const DRAFT_KEY = 'sentinel_safety_single_page_inspection_draft_v1';

const emptyHazard = (): HazardDraft => ({
  id: `HZ-${Date.now()}`,
  photos: [],
  hazardDescription: '',
  possibleStandards: [],
  selectedStandard: '',
  location: '',
  equipment: '',
  correctiveAction: '',
  assignedTo: '',
  dueDate: '',
  notes: '',
  completed: false,
});

export default function InspectScreen() {
  const { colors } = useAppTheme();

  const [currentHazard, setCurrentHazard] = useState<HazardDraft>(emptyHazard());
  const [hazards, setHazards] = useState<HazardDraft[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState('photos');
  const [scrollY, setScrollY] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const updateHazard = (patch: Partial<HazardDraft>) => {
    setCurrentHazard((prev) => ({ ...prev, ...patch }));
  };

  const checks = {
    photos: currentHazard.photos.length > 0,
    description: currentHazard.hazardDescription.trim().length >= 8,
    standards: currentHazard.possibleStandards.length > 0,
    location: currentHazard.location.trim().length > 0,
    action:
      currentHazard.correctiveAction.trim().length >= 8 &&
      currentHazard.assignedTo.trim().length > 0,
  };

  const completedCount = Object.values(checks).filter(Boolean).length;
  const completionPercent = useMemo(
    () => Math.round((completedCount / Object.keys(checks).length) * 100),
    [completedCount]
  );

  const isHazardComplete = () => checks.save;

  const processSteps = [
    { id: 'photos', label: 'Photo Evidence', done: checks.photos },
    { id: 'description', label: 'Hazard Description', done: checks.description },
    { id: 'standards', label: 'Possible Standards', done: checks.standards },
    { id: 'location', label: 'Location / Equipment', done: checks.location },
    { id: 'action', label: 'Corrective Action', done: checks.action },
    { id: 'save', label: 'Save Options', done: checks.save },
  ];

  const jumpToSection = (id: string) => {
    const y = sectionOffsets.current[id] || 0;
    setActiveSection(id);
    scrollRef.current?.scrollTo({ y: Math.max(y - 12, 0), animated: true });
  };

  const handleScroll = (event: any) => {
    const rawY = event.nativeEvent.contentOffset.y;
    setScrollY(rawY);
    const y = rawY + 80;
    const entries = Object.entries(sectionOffsets.current).sort((a, b) => a[1] - b[1]);

    let current = activeSection;
    for (const [id, offset] of entries) {
      if (y >= offset) current = id;
    }

    if (current !== activeSection) setActiveSection(current);
  };

  const missingItems = () => {
    const missing = [];
    if (!checks.photos) missing.push('photo evidence');
    if (!checks.description) missing.push('hazard description');
    if (!checks.standards) missing.push('possible standards review');
    if (!checks.location) missing.push('location');
    if (!checks.action) missing.push('corrective action and assignment');
    return missing;
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

  const runStandardMatch = async () => {
    if (!checks.description) {
      Alert.alert('Description needed', 'Describe the hazard before checking possible standards.');
      return;
    }

    try {
      const results = await apiClient.suggestStandards({
        description: currentHazard.hazardDescription,
        source: 'MSHA',
      });

      const standards = Array.isArray(results)
        ? results.map((item: any) =>
            `${item.citation} — ${item.heading}${item.summaryPlainLanguage ? `: ${item.summaryPlainLanguage}` : ''}`
          )
        : [];

      const finalMatches = standards.length ? standards : ['General Workplace Hazard Review'];

      updateHazard({
        possibleStandards: finalMatches,
        selectedStandard: finalMatches[0],
      });
    } catch {
      Alert.alert('Standards unavailable', 'Unable to check possible standards right now.');
    }
  };

  const saveCurrentHazard = async () => {
    if (!isHazardComplete()) {
      Alert.alert(
        'Hazard incomplete',
        `Complete the following before saving: ${missingItems().join(', ')}.`
      );
      return null;
    }

    const completedHazard = {
      ...currentHazard,
      completed: true,
    };

    const nextHazards = [...hazards, completedHazard];
    setHazards(nextHazards);
    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({ hazards: nextHazards }));

    return nextHazards;
  };

  const saveAndAddNew = async () => {
    const saved = await saveCurrentHazard();
    if (!saved) return;

    setCurrentHazard(emptyHazard());
    Alert.alert('Hazard saved', 'Start documenting the next hazard.');
  };

  const saveAndReview = async () => {
    const saved = await saveCurrentHazard();
    if (!saved) return;

    setCurrentHazard(emptyHazard());
    Alert.alert('Ready for review', `Report package contains ${saved.length} completed hazard(s).`);
  };

  const saveAndQuit = async () => {
    if (isHazardComplete()) {
      await saveCurrentHazard();
      setCurrentHazard(emptyHazard());
      Alert.alert('Draft saved', 'Completed hazard saved to the report draft.');
      return;
    }

    await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({ hazards, inProgress: currentHazard }));
    Alert.alert('Draft saved', 'Your in-progress hazard was saved.');
  };

  return (
    <ScrollView
      ref={scrollRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}
    >
      <BrandedHeader title="Inspect" subtitle="Document one hazard at a time. Complete the blanks, save it, then add the next hazard." />

      <View style={styles.layout}>
        <View pointerEvents="box-none" style={[styles.sidebarLayer, { transform: [{ translateY: scrollY }] }]}>
          <TouchableOpacity
            style={[
              styles.sidebarBubble,
              {
                backgroundColor: sidebarOpen ? 'rgba(249,115,22,0.82)' : 'rgba(8,24,39,0.52)',
                borderColor: sidebarOpen ? colors.accent : 'rgba(255,255,255,0.28)',
              },
            ]}
            onPress={() => setSidebarOpen(!sidebarOpen)}
          >
            <Text style={styles.sidebarBubbleText}>{sidebarOpen ? '−' : '+'}</Text>
          </TouchableOpacity>

          {sidebarOpen && (
            <View style={[styles.sidebarPanel, { borderColor: 'rgba(255,255,255,0.18)' }]}>
              <Text style={[styles.guideTitle, { color: '#000000' }]}>Report Steps</Text>

              {processSteps.map((step, index) => (
                <TouchableOpacity
                  key={step.id}
                  style={[
                    styles.guideNavItem,
                    {
                      borderLeftColor: activeSection === step.id ? colors.accent : 'rgba(255,255,255,0.18)',
                      backgroundColor: activeSection === step.id ? 'rgba(249,115,22,0.16)' : 'transparent',
                    },
                  ]}
                  onPress={() => jumpToSection(step.id)}
                >
                  <Text style={[styles.guideCheck, { color: step.done ? '#22C55E' : colors.muted }]}>
                    {step.done ? '✓' : index + 1}
                  </Text>
                  <Text style={[styles.guideLabel, { color: activeSection === step.id ? colors.text : colors.sub }]}>
                    {step.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.formColumn}>
          <Section id="photos" sectionOffsets={sectionOffsets} title="1. Photo Evidence" helper="Take or upload one or more photos. They will appear here for the user to verify before saving.">
            <View style={styles.photoButtonRow}>
              <TouchableOpacity style={styles.primaryButton} onPress={takePhoto}>
                <Text style={styles.primaryButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={uploadPhoto}>
                <Text style={styles.secondaryButtonText}>Upload Photo</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
              {currentHazard.photos.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.photo} />
              ))}
            </ScrollView>
          </Section>

          <Section id="description" sectionOffsets={sectionOffsets} title="2. Hazard Description" helper="Describe what is unsafe, who is exposed, and what could happen.">
            <TextInput
              style={[styles.textArea, { backgroundColor: '#FFFFFF', borderColor: '#D7DEE8', color: '#101828' }]}
              placeholder="Example: Damaged ladder with bent side rail being used near the maintenance area."
              placeholderTextColor={colors.muted}
              multiline
              value={currentHazard.hazardDescription}
              onChangeText={(hazardDescription) => updateHazard({ hazardDescription })}
            />
          </Section>

          <Section id="standards" sectionOffsets={sectionOffsets} title="3. Possible Standards" helper="The app checks keywords from the hazard description and suggests possible standard areas for qualified review.">
            <TouchableOpacity style={styles.primaryButton} onPress={runStandardMatch}>
              <Text style={styles.primaryButtonText}>Check Possible Standards</Text>
            </TouchableOpacity>

            {currentHazard.possibleStandards.map((standard) => (
              <TouchableOpacity
                key={standard}
                style={[
                  styles.standardCard,
                  {
                    backgroundColor: '#FFFFFF',
                    borderColor: currentHazard.selectedStandard === standard ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => updateHazard({ selectedStandard: standard })}
              >
                <Text style={[styles.standardText, { color: '#000000' }]}>{standard}</Text>
              </TouchableOpacity>
            ))}

            <Text style={[styles.disclaimer, { color: '#111111' }]}>
              Suggested matches guide review only. Final compliance responsibility remains with the qualified user.
            </Text>
          </Section>

          <Section id="location" sectionOffsets={sectionOffsets} title="4. Location / Equipment" helper="Identify exactly where the hazard exists and what equipment or area is involved.">
            <TextInput
              style={[styles.input, { backgroundColor: '#FFFFFF', borderColor: '#D7DEE8', color: '#101828' }]}
              placeholder="Location"
              placeholderTextColor={colors.muted}
              value={currentHazard.location}
              onChangeText={(location) => updateHazard({ location })}
            />

            <TextInput
              style={[styles.input, { backgroundColor: '#FFFFFF', borderColor: '#D7DEE8', color: '#101828' }]}
              placeholder="Equipment / Area"
              placeholderTextColor={colors.muted}
              value={currentHazard.equipment}
              onChangeText={(equipment) => updateHazard({ equipment })}
            />
          </Section>

          <Section id="action" sectionOffsets={sectionOffsets} title="5. Corrective Action / Assignment" helper="Define what needs to happen, who owns it, and when it should be completed.">
            <TextInput
              style={[styles.textArea, { backgroundColor: '#FFFFFF', borderColor: '#D7DEE8', color: '#101828' }]}
              placeholder="Required corrective action"
              placeholderTextColor={colors.muted}
              multiline
              value={currentHazard.correctiveAction}
              onChangeText={(correctiveAction) => updateHazard({ correctiveAction })}
            />

            <TextInput
              style={[styles.input, { backgroundColor: '#FFFFFF', borderColor: '#D7DEE8', color: '#101828' }]}
              placeholder="Assigned To"
              placeholderTextColor={colors.muted}
              value={currentHazard.assignedTo}
              onChangeText={(assignedTo) => updateHazard({ assignedTo })}
            />

            <TextInput
              style={[styles.input, { backgroundColor: '#FFFFFF', borderColor: '#D7DEE8', color: '#101828' }]}
              placeholder="Due Date"
              placeholderTextColor={colors.muted}
              value={currentHazard.dueDate}
              onChangeText={(dueDate) => updateHazard({ dueDate })}
            />

            <TextInput
              style={[styles.textArea, { backgroundColor: '#FFFFFF', borderColor: '#D7DEE8', color: '#101828' }]}
              placeholder="Additional notes"
              placeholderTextColor={colors.muted}
              multiline
              value={currentHazard.notes}
              onChangeText={(notes) => updateHazard({ notes })}
            />
          </Section>

          <View
            onLayout={(event) => {
              sectionOffsets.current.save = event.nativeEvent.layout.y;
            }}
            style={styles.saveCard}
          >
            <Text style={[styles.saveTitle, { color: '#000000' }]}>Save Options</Text>

            <TouchableOpacity style={styles.primaryButton} onPress={saveAndAddNew}>
              <Text style={styles.primaryButtonText}>Save & Add New Hazard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={saveAndReview}>
              <Text style={styles.secondaryButtonText}>Save & Review Report</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quietButton} onPress={saveAndQuit}>
              <Text style={styles.quietButtonText}>Save & Quit</Text>
            </TouchableOpacity>
          </View>

          {hazards.length > 0 && (
            <View style={styles.completedCard}>
              <Text style={[styles.completedTitle, { color: '#000000' }]}>Completed Hazards</Text>
              {hazards.map((hazard, index) => (
                <View key={hazard.id} style={[styles.completedItem, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.completedName, { color: '#000000' }]}>
                    Hazard {index + 1}
                  </Text>
                  <Text style={[styles.completedText, { color: '#111111' }]}>
                    {hazard.hazardDescription}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function Section({
  id,
  title,
  helper,
  children,
  sectionOffsets,
}: {
  id: string;
  title: string;
  helper: string;
  children: React.ReactNode;
  sectionOffsets: React.MutableRefObject<Record<string, number>>;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      onLayout={(event) => {
        sectionOffsets.current[id] = event.nativeEvent.layout.y;
      }}
      style={styles.sectionCard}
    >
      <Text style={[styles.sectionTitle, { color: '#000000' }]}>{title}</Text>
      <Text style={[styles.helper, { color: '#111111' }]}>{helper}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: tokens.spacing.md,
    paddingBottom: 140,
    flexGrow: 1,
  },
  layout: {
    position: 'relative',
    gap: 14,
  },
  sidebarLayer: {
    position: 'absolute',
    top: -26,
    left: -16,
    width: 26,
    zIndex: 999,
  },
  sidebarBubble: {
    width: 26,
    height: 30,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderLeftWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sidebarBubbleText: {
    color: '#000000',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '900',
  },
  sidebarPanel: {
    width: 190,
    borderWidth: 1,
    borderRadius: 18,
    paddingTop: 12,
    paddingHorizontal: 7,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 10,
  },
  guideNavItem: {
    minHeight: 34,
    borderLeftWidth: 4,
    paddingHorizontal: 7,
    paddingVertical: 6,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guideCheck: {
    fontSize: 16,
    fontWeight: '900',
    width: 20,
  },
  guideLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '800',
  },
  formColumn: {
    gap: 22,
    marginLeft: 0,
  },
  sectionCard: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingBottom: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  helper: {
    fontSize: 11,
    lineHeight: 19,
    fontWeight: '700',
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  photoButtonRow: {
    width: '62%',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  primaryButton: {
    width: '62%',
    alignSelf: 'center',
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  secondaryButton: {
    width: '62%',
    alignSelf: 'center',
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#F97316',
    fontSize: 15,
    fontWeight: '900',
  },
  quietButton: {
    width: '62%',
    alignSelf: 'center',
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quietButtonText: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '900',
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
  disclaimer: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  saveCard: {
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingTop: 18,
  },
  saveTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  completedCard: {
    borderTopWidth: 1,
    paddingTop: 18,
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  completedItem: {
    borderBottomWidth: 1,
    paddingVertical: 6,
  },
  completedName: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  completedText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
  },
});
