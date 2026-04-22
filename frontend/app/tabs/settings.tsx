import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useMemo, useState } from 'react';

type ThemeMode = 'auto' | 'dark' | 'light';

const standardsModes = ['MSHA First', 'OSHA First', 'Hybrid', 'Custom Company Rules'];
const inspectionTypes = [
  'Full Site Inspection',
  'Area Walkthrough',
  'Equipment Inspection',
  'Incident Follow-up',
  'Shift Start Check',
];
const captureModes = ['Photo + Notes', 'Voice Notes', 'Notes Only', 'Fast Tap Checklist'];
const riskScoringModes = ['Severity × Likelihood', 'Low / Medium / High', '1–5 Score'];
const reportStyles = ['Professional', 'Executive Summary', 'Compliance Only', 'Corrective Action Focused'];

function SegmentedSelect({
  label,
  value,
  options,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  colors: {
    text: string;
    subtext: string;
    border: string;
    cardAlt: string;
    accent: string;
  };
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: colors.subtext }]}>{label}</Text>
      <View style={styles.optionWrap}>
        {options.map((option) => {
          const active = value === option;
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionChip,
                {
                  backgroundColor: active ? colors.accent : colors.cardAlt,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
              onPress={() => onChange(option)}
            >
              <Text style={[styles.optionChipText, { color: active ? '#fff' : colors.text }]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const systemScheme = useColorScheme();

  const [name, setName] = useState('Christopher McKinley');
  const [title, setTitle] = useState('Safety Manager');
  const [company, setCompany] = useState('Monolith Studios');
  const [site, setSite] = useState('North Ridge Plant');
  const [department, setDepartment] = useState('Operations Safety');

  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [highVisibilityTheme, setHighVisibilityTheme] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [standardsMode, setStandardsMode] = useState('MSHA First');
  const [inspectionType, setInspectionType] = useState('Full Site Inspection');
  const [captureMode, setCaptureMode] = useState('Photo + Notes');
  const [riskScoring, setRiskScoring] = useState('Severity × Likelihood');
  const [reportStyle, setReportStyle] = useState('Professional');
  const [autoGenerateActions, setAutoGenerateActions] = useState(true);
  const [autoTagSevereHazards, setAutoTagSevereHazards] = useState(true);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);

  const dark = useMemo(() => {
    if (themeMode === 'dark') return true;
    if (themeMode === 'light') return false;
    return systemScheme === 'dark';
  }, [themeMode, systemScheme]);

  const colors = {
    bg: dark ? '#000000' : '#f8fafc',
    card: dark ? '#111111' : '#ffffff',
    cardAlt: dark ? '#171717' : '#f8fafc',
    border: dark ? '#222222' : '#e2e8f0',
    text: dark ? '#f8fafc' : '#111827',
    subtext: dark ? '#9ca3af' : '#64748b',
    inputBg: dark ? '#111827' : '#ffffff',
    inputBorder: dark ? '#374151' : '#d1d5db',
    accent: '#ff6a00',
    footer: dark ? '#6b7280' : '#94a3b8',
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.bg }]}>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Settings</Text>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
            Personal and organizational details used throughout audits and reports.
          </Text>

          <View style={styles.twoColRow}>
            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.subtext }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.subtext}
              />
            </View>

            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.subtext }]}>Title</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter your title"
                placeholderTextColor={colors.subtext}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.subtext }]}>Company</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
              value={company}
              onChangeText={setCompany}
              placeholder="Enter company"
              placeholderTextColor={colors.subtext}
            />
          </View>

          <View style={styles.twoColRow}>
            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.subtext }]}>Site</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                value={site}
                onChangeText={setSite}
                placeholder="Enter site"
                placeholderTextColor={colors.subtext}
              />
            </View>

            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.subtext }]}>Department</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
                value={department}
                onChangeText={setDepartment}
                placeholder="Enter department"
                placeholderTextColor={colors.subtext}
              />
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
            Control how SafeScope looks in the field and in the office.
          </Text>

          <Text style={[styles.label, { color: colors.subtext, marginBottom: 10 }]}>Theme Mode</Text>
          <View style={styles.segmentRow}>
            {(['auto', 'dark', 'light'] as ThemeMode[]).map((mode) => {
              const active = themeMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.segmentButton,
                    {
                      backgroundColor: active ? colors.accent : colors.cardAlt,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => setThemeMode(mode)}
                >
                  <Text style={[styles.segmentText, { color: active ? '#fff' : colors.text }]}>
                    {mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.preferenceRow, { borderTopColor: colors.border }]}>
            <View style={styles.preferenceTextWrap}>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>High Visibility Theme</Text>
              <Text style={[styles.preferenceSubtitle, { color: colors.subtext }]}>
                Increase contrast for fast scanning in field conditions.
              </Text>
            </View>
            <Switch
              value={highVisibilityTheme}
              onValueChange={setHighVisibilityTheme}
              trackColor={{ false: '#374151', true: '#fb923c' }}
              thumbColor={highVisibilityTheme ? colors.accent : '#9ca3af'}
            />
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
            Manage reminders and activity updates.
          </Text>

          <View style={styles.preferenceRowNoBorder}>
            <View style={styles.preferenceTextWrap}>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>Enable Notifications</Text>
              <Text style={[styles.preferenceSubtitle, { color: colors.subtext }]}>
                Alerts for actions, reviews, and audit activity.
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#374151', true: '#fb923c' }}
              thumbColor={notificationsEnabled ? colors.accent : '#9ca3af'}
            />
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Audit Defaults</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
            These settings shape how every new audit session begins.
          </Text>

          <SegmentedSelect
            label="Standards Mode"
            value={standardsMode}
            options={standardsModes}
            onChange={setStandardsMode}
            colors={colors}
          />

          <SegmentedSelect
            label="Inspection Type"
            value={inspectionType}
            options={inspectionTypes}
            onChange={setInspectionType}
            colors={colors}
          />

          <SegmentedSelect
            label="Capture Mode"
            value={captureMode}
            options={captureModes}
            onChange={setCaptureMode}
            colors={colors}
          />

          <SegmentedSelect
            label="Risk Scoring"
            value={riskScoring}
            options={riskScoringModes}
            onChange={setRiskScoring}
            colors={colors}
          />

          <SegmentedSelect
            label="Report Style"
            value={reportStyle}
            options={reportStyles}
            onChange={setReportStyle}
            colors={colors}
          />

          <View style={[styles.preferenceRow, { borderTopColor: colors.border }]}>
            <View style={styles.preferenceTextWrap}>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>Auto-generate corrective actions</Text>
              <Text style={[styles.preferenceSubtitle, { color: colors.subtext }]}>
                Create suggested action items from verified findings.
              </Text>
            </View>
            <Switch
              value={autoGenerateActions}
              onValueChange={setAutoGenerateActions}
              trackColor={{ false: '#374151', true: '#fb923c' }}
              thumbColor={autoGenerateActions ? colors.accent : '#9ca3af'}
            />
          </View>

          <View style={[styles.preferenceRow, { borderTopColor: colors.border }]}>
            <View style={styles.preferenceTextWrap}>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>Auto-tag severe hazards</Text>
              <Text style={[styles.preferenceSubtitle, { color: colors.subtext }]}>
                Highlight severe findings for manager review.
              </Text>
            </View>
            <Switch
              value={autoTagSevereHazards}
              onValueChange={setAutoTagSevereHazards}
              trackColor={{ false: '#374151', true: '#fb923c' }}
              thumbColor={autoTagSevereHazards ? colors.accent : '#9ca3af'}
            />
          </View>

          <View style={[styles.preferenceRow, { borderTopColor: colors.border }]}>
            <View style={styles.preferenceTextWrap}>
              <Text style={[styles.preferenceTitle, { color: colors.text }]}>Auto-save drafts</Text>
              <Text style={[styles.preferenceSubtitle, { color: colors.subtext }]}>
                Save progress during walkthroughs automatically.
              </Text>
            </View>
            <Switch
              value={autoSaveDrafts}
              onValueChange={setAutoSaveDrafts}
              trackColor={{ false: '#374151', true: '#fb923c' }}
              thumbColor={autoSaveDrafts ? colors.accent : '#9ca3af'}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.footer }]}>SafeScope v1.0.0</Text>
          <Text style={[styles.footerText, { color: colors.footer }]}>A Monolith Studios product</Text>
          <Text style={[styles.footerText, { color: colors.footer }]}>Created by Christopher McKinley</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
    paddingTop: 28,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  sectionCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 14,
    gap: 12,
    borderTopWidth: 1,
  },
  preferenceRowNoBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  preferenceTextWrap: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  preferenceSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
});
