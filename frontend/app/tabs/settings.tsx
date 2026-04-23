import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { useAppTheme, ThemeMode } from '../../src/theme/ThemeContext';

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
    sub: string;
    border: string;
    cardAlt: string;
    accent: string;
  };
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: colors.sub }]}>{label}</Text>
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
  const { themeMode, setThemeMode, dark, colors } = useAppTheme();

  const [name, setName] = useState('Christopher McKinley');
  const [title, setTitle] = useState('Safety Manager');
  const [company, setCompany] = useState('Monolith Studios');
  const [site, setSite] = useState('North Ridge Plant');
  const [department, setDepartment] = useState('Operations Safety');

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

  const ui = {
    bg: colors.bg,
    card: colors.card,
    cardAlt: colors.cardAlt,
    border: colors.border,
    text: colors.text,
    subtext: colors.sub,
    inputBg: dark ? '#111827' : '#ffffff',
    inputBorder: dark ? '#374151' : '#d1d5db',
    accent: colors.accent,
    footer: dark ? '#6b7280' : '#94a3b8',
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollContent, { backgroundColor: ui.bg }]}>
      <View style={[styles.container, { backgroundColor: ui.bg }]}>
        <Text style={[styles.screenTitle, { color: ui.text }]}>Settings</Text>

        <View style={[styles.sectionCard, { backgroundColor: ui.card, borderColor: ui.border }]}>
          <Text style={[styles.sectionTitle, { color: ui.text }]}>Profile</Text>
          <Text style={[styles.sectionSubtitle, { color: ui.subtext }]}>
            Personal and organizational details used throughout audits and reports.
          </Text>

          <View style={styles.twoColRow}>
            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: ui.subtext }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: ui.inputBg, borderColor: ui.inputBorder, color: ui.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={ui.subtext}
              />
            </View>

            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: ui.subtext }]}>Title</Text>
              <TextInput
                style={[styles.input, { backgroundColor: ui.inputBg, borderColor: ui.inputBorder, color: ui.text }]}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter your title"
                placeholderTextColor={ui.subtext}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: ui.subtext }]}>Company</Text>
            <TextInput
              style={[styles.input, { backgroundColor: ui.inputBg, borderColor: ui.inputBorder, color: ui.text }]}
              value={company}
              onChangeText={setCompany}
              placeholder="Enter company"
              placeholderTextColor={ui.subtext}
            />
          </View>

          <View style={styles.twoColRow}>
            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: ui.subtext }]}>Site</Text>
              <TextInput
                style={[styles.input, { backgroundColor: ui.inputBg, borderColor: ui.inputBorder, color: ui.text }]}
                value={site}
                onChangeText={setSite}
                placeholder="Enter site"
                placeholderTextColor={ui.subtext}
              />
            </View>

            <View style={[styles.fieldGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: ui.subtext }]}>Department</Text>
              <TextInput
                style={[styles.input, { backgroundColor: ui.inputBg, borderColor: ui.inputBorder, color: ui.text }]}
                value={department}
                onChangeText={setDepartment}
                placeholder="Enter department"
                placeholderTextColor={ui.subtext}
              />
            </View>
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: ui.card, borderColor: ui.border }]}>
          <Text style={[styles.sectionTitle, { color: ui.text }]}>Appearance</Text>
          <Text style={[styles.sectionSubtitle, { color: ui.subtext }]}>
            Control how SafeScope looks in the field and in the office.
          </Text>

          <Text style={[styles.label, { color: ui.subtext, marginBottom: 10 }]}>Theme Mode</Text>
          <View style={styles.segmentRow}>
            {(['light', 'dark'] as ThemeMode[]).map((mode) => {
              const active = themeMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.segmentButton,
                    {
                      backgroundColor: active ? ui.accent : ui.cardAlt,
                      borderColor: active ? ui.accent : ui.border,
                    },
                  ]}
                  onPress={() => setThemeMode(mode)}
                >
                  <Text style={[styles.segmentText, { color: active ? '#fff' : ui.text }]}>
                    {mode === 'dark' ? 'Dark' : 'Light'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.preferenceRow, { borderTopColor: ui.border }]}>
            <View style={styles.preferenceTextWrap}>
              <Text style={[styles.preferenceTitle, { color: ui.text }]}>High Visibility Theme</Text>
              <Text style={[styles.preferenceSubtitle, { color: ui.subtext }]}>
                Increase contrast for fast scanning in field conditions.
              </Text>
            </View>
            <Switch
              value={highVisibilityTheme}
              onValueChange={setHighVisibilityTheme}
              trackColor={{ false: '#374151', true: '#fb923c' }}
              thumbColor={highVisibilityTheme ? ui.accent : '#9ca3af'}
            />
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: ui.card, borderColor: ui.border }]}>
          <Text style={[styles.sectionTitle, { color: ui.text }]}>Notifications</Text>
          <Text style={[styles.sectionSubtitle, { color: ui.subtext }]}>
            Manage reminders and activity updates.
          </Text>

          <View style={styles.preferenceRowNoBorder}>
            <View style={styles.preferenceTextWrap}>
              <Text style={[styles.preferenceTitle, { color: ui.text }]}>Enable Notifications</Text>
              <Text style={[styles.preferenceSubtitle, { color: ui.subtext }]}>
                Alerts for actions, reviews, and audit activity.
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#374151', true: '#fb923c' }}
              thumbColor={notificationsEnabled ? ui.accent : '#9ca3af'}
            />
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: ui.card, borderColor: ui.border }]}>
          <Text style={[styles.sectionTitle, { color: ui.text }]}>Audit Defaults</Text>
          <Text style={[styles.sectionSubtitle, { color: ui.subtext }]}>
            These settings shape how every new audit session begins.
          </Text>

          <SegmentedSelect
            label="Standards Mode"
            value={standardsMode}
            options={standardsModes}
            onChange={setStandardsMode}
            colors={{ text: ui.text, sub: ui.subtext, border: ui.border, cardAlt: ui.cardAlt, accent: ui.accent }}
          />

          <SegmentedSelect
            label="Inspection Type"
            value={inspectionType}
            options={inspectionTypes}
            onChange={setInspectionType}
            colors={{ text: ui.text, sub: ui.subtext, border: ui.border, cardAlt: ui.cardAlt, accent: ui.accent }}
          />

          <SegmentedSelect
            label="Capture Mode"
            value={captureMode}
            options={captureModes}
            onChange={setCaptureMode}
            colors={{ text: ui.text, sub: ui.subtext, border: ui.border, cardAlt: ui.cardAlt, accent: ui.accent }}
          />

          <SegmentedSelect
            label="Risk Scoring"
            value={riskScoring}
            options={riskScoringModes}
            onChange={setRiskScoring}
            colors={{ text: ui.text, sub: ui.subtext, border: ui.border, cardAlt: ui.cardAlt, accent: ui.accent }}
          />

          <SegmentedSelect
            label="Report Style"
            value={reportStyle}
            options={reportStyles}
            onChange={setReportStyle}
            colors={{ text: ui.text, sub: ui.subtext, border: ui.border, cardAlt: ui.cardAlt, accent: ui.accent }}
          />

          <View style={[styles.preferenceRow, { borderTopColor: ui.border }]}>
            <View style={styles.preferenceTextWrap}>
              <Text style={[styles.preferenceTitle, { color: ui.text }]}>Auto Generate Actions</Text>
              <Text style={[styles.preferenceSubtitle, { color: ui.subtext }]}>
                Draft corrective actions automatically from findings.
              </Text>
            </View>
            <Switch
              value={autoGenerateActions}
              onValueChange={setAutoGenerateActions}
              trackColor={{ false: '#374151', true: '#fb923c' }}
              thumbColor={autoGenerateActions ? ui.accent : '#9ca3af'}
            />
          </View>

          <View style={[styles.preferenceRow, { borderTopColor: ui.border }]}>
            <View style={styles.preferenceTextWrap}>
              <Text style={[styles.preferenceTitle, { color: ui.text }]}>Auto Tag Severe Hazards</Text>
              <Text style={[styles.preferenceSubtitle, { color: ui.subtext }]}>
                Escalate likely critical findings for review.
              </Text>
            </View>
            <Switch
              value={autoTagSevereHazards}
              onValueChange={setAutoTagSevereHazards}
              trackColor={{ false: '#374151', true: '#fb923c' }}
              thumbColor={autoTagSevereHazards ? ui.accent : '#9ca3af'}
            />
          </View>

          <View style={[styles.preferenceRow, { borderTopColor: ui.border }]}>
            <View style={styles.preferenceTextWrap}>
              <Text style={[styles.preferenceTitle, { color: ui.text }]}>Auto Save Drafts</Text>
              <Text style={[styles.preferenceSubtitle, { color: ui.subtext }]}>
                Preserve in-progress work automatically.
              </Text>
            </View>
            <Switch
              value={autoSaveDrafts}
              onValueChange={setAutoSaveDrafts}
              trackColor={{ false: '#374151', true: '#fb923c' }}
              thumbColor={autoSaveDrafts ? ui.accent : '#9ca3af'}
            />
          </View>
        </View>

        <Text style={[styles.footerText, { color: ui.footer }]}>
          SafeScope settings are stored locally for this pilot build.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    padding: 18,
    paddingBottom: 30,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
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
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  preferenceRow: {
    marginTop: 6,
    paddingTop: 14,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  preferenceRowNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  preferenceTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  preferenceSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
});
