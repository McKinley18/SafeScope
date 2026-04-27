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
import { apiClient } from '../../src/api/client';

type HazardDraft = {
  id: string;
  photos: string[];
  hazardCategory: string;
  hazardDescription: string;
  possibleStandards: any[];
  selectedStandard: string;
  location: string;
  equipment: string;
  correctiveAction: string;
  assignedTo: string;
  dueDate: string;
  notes: string;
  generatedReport?: string;
  completed: boolean;
};

const DRAFT_KEY = 'sentinel_safety_single_page_inspection_draft_v1';

const hazardCategories = [
  'Access / Ladders / Platforms',
  'Guarding / Moving Parts',
  'Electrical',
  'Housekeeping / Slips / Trips',
  'Mobile Equipment / Traffic',
  'Fire / Hot Work / Fuel',
  'PPE',
  'Dust / Respiratory / Noise',
  'Fall Protection',
  'Lockout / Energy Isolation',
  'Emergency / First Aid',
  'Other / Unknown',
];

const emptyHazard = (): HazardDraft => ({
  id: `HZ-${Date.now()}`,
  photos: [],
  hazardCategory: '',
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
    save:
      currentHazard.hazardDescription.trim().length >= 8 &&
      currentHazard.possibleStandards.length > 0 &&
      currentHazard.location.trim().length > 0 &&
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
    { id: 'save', label: '6. Save Options', done: checks.save },
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
    // Photo evidence is strongly recommended but not required to save a professional text report.
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

  const removePhoto = (uriToRemove: string) => {
    updateHazard({
      photos: currentHazard.photos.filter((uri) => uri !== uriToRemove),
    });
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
        hazardCategory: currentHazard.hazardCategory,
        source: 'MSHA',
      });

      const standards = Array.isArray(results)
        ? results.map((item: any) => ({
            id: item.id || item.citation,
            citation: item.citation,
            heading: item.heading,
            summary: item.summaryPlainLanguage,
            text: item.standardText,
            correctiveAction:
              item.correctiveActionTemplates?.[0]?.recommendedAction ||
              item.correctiveActionTemplates?.[0]?.lowCostOption ||
              '',
          }))
        : [];

      const finalMatches = standards.length
        ? standards
        : [{ id: 'general', citation: 'General Review', heading: 'General Workplace Hazard Review' }];

      updateHazard({
        possibleStandards: finalMatches,
        selectedStandard: finalMatches[0].citation || finalMatches[0].heading,
      });
    } catch (error: any) {
      Alert.alert('Standards unavailable', error?.message || 'Unable to check possible standards right now.');
    }
  };

  const buildProfessionalReportLanguage = () => {
    return [
      `Observation: ${currentHazard.hazardDescription}`,
      `Risk: Personnel may be exposed to an unsafe condition at ${currentHazard.location || 'the identified location'} involving ${currentHazard.equipment || 'the listed equipment/area'}.`,
      `Possible Standard / Review Area: ${currentHazard.selectedStandard || 'Qualified review required'}.`,
      `Recommended Corrective Action: ${currentHazard.correctiveAction}`,
      `Assigned To: ${currentHazard.assignedTo}`,
      `Due Date: ${currentHazard.dueDate || 'Not specified'}`,
      `Verification: Confirm the corrective action is complete, document the corrected condition, and retain evidence with the report.`,
      `Professional Note: Suggested standards and corrective actions are provided to support review. Final compliance determination remains with the qualified user.`,
    ].join('\n\n');
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
      generatedReport: buildProfessionalReportLanguage(),
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

  const copyReportPackage = async () => {
    const reportText = hazards
      .map((hazard, index) => `HAZARD ${index + 1}\n\n${hazard.generatedReport || hazard.hazardDescription}`)
      .join('\n\n---\n\n');

    if (!reportText.trim()) {
      Alert.alert('No completed hazards', 'Save at least one completed hazard before copying the report package.');
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(reportText);
      Alert.alert('Report copied', 'The professional report package was copied to your clipboard.');
      return;
    }

    Alert.alert('Copy unavailable', 'Clipboard copy is not available on this device.');
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
                <View key={uri} style={styles.photoWrap}>
                  <Image source={{ uri }} style={styles.photo} />
                  <TouchableOpacity style={styles.photoDelete} onPress={() => removePhoto(uri)}>
                    <Text style={styles.photoDeleteText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </Section>

          <Section id="description" sectionOffsets={sectionOffsets} title="2. Hazard Description" helper="Select the closest hazard category, then describe what is unsafe, who is exposed, and what could happen.">
            <Text style={[styles.fieldLabel, { color: '#000000' }]}>Hazard Category</Text>
            <View style={styles.categoryGrid}>
              {hazardCategories.map((category) => {
                const selected = currentHazard.hazardCategory === category;

                return (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: selected ? '#F97316' : '#FFFFFF',
                        borderColor: selected ? '#F97316' : '#D7DEE8',
                      },
                    ]}
                    onPress={() => updateHazard({ hazardCategory: category })}
                  >
                    <Text style={[styles.categoryChipText, { color: selected ? '#FFFFFF' : '#101828' }]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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

            {currentHazard.possibleStandards.map((standard) => {
              const selectedValue = standard.citation || standard.heading || String(standard);
              const isSelected = currentHazard.selectedStandard === selectedValue;

              return (
                <TouchableOpacity
                  key={standard.id || selectedValue}
                  style={[
                    styles.standardCard,
                    {
                      backgroundColor: '#FFFFFF',
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() =>
                    updateHazard({
                      selectedStandard: selectedValue,
                      correctiveAction: standard.correctiveAction || currentHazard.correctiveAction,
                    })
                  }
                >
                  <Text style={[styles.standardCitation, { color: colors.accent }]}>
                    {standard.citation || 'Possible Standard'}
                  </Text>
                  <Text style={[styles.standardText, { color: '#000000' }]}>
                    {standard.heading || String(standard)}
                  </Text>
                  {standard.summary ? (
                    <Text style={styles.standardSummary}>{standard.summary}</Text>
                  ) : null}
                  {standard.correctiveAction ? (
                    <Text style={styles.standardAction}>Suggested action: {standard.correctiveAction}</Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}

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
            <Text style={[styles.saveTitle, { color: '#000000' }]}>6. Save Options</Text>

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
              <TouchableOpacity style={styles.exportButton} onPress={copyReportPackage}>
                <Text style={styles.exportButtonText}>Copy Report Package</Text>
              </TouchableOpacity>

              <Text style={[styles.completedTitle, { color: '#000000' }]}>Completed Hazards</Text>
              {hazards.map((hazard, index) => (
                <View key={hazard.id} style={[styles.completedItem, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.completedName, { color: '#000000' }]}>
                    Hazard {index + 1}
                  </Text>
                  <Text style={[styles.completedText, { color: '#111111' }]}>
                    {hazard.hazardDescription}
                  </Text>

                  {hazard.generatedReport ? (
                    <Text style={[styles.generatedReportText, { color: '#344054' }]}>
                      {hazard.generatedReport}
                    </Text>
                  ) : null}
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
    width: 34,
    height: 40,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderLeftWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sidebarBubbleText: {
    color: '#000000',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '900',
  },
  sidebarPanel: {
    width: 220,
    borderWidth: 1,
    borderRadius: 18,
    paddingTop: 12,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 10,
  },
  guideNavItem: {
    minHeight: 40,
    borderLeftWidth: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guideCheck: {
    fontSize: 17,
    fontWeight: '900',
    width: 24,
  },
  guideLabel: {
    color: '#CBD5E1',
    fontSize: 12,
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
  standardCitation: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 4,
  },
  standardText: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 6,
  },
  standardSummary: {
    color: '#344054',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  standardAction: {
    color: '#101828',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '800',
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
  exportButton: {
    width: '62%',
    alignSelf: 'center',
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
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
