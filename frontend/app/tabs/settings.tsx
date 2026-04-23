import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, ThemeMode } from '../../src/theme/ThemeContext';
import { tokens } from '../../src/theme/tokens';
import AppCard from '../../src/components/ui/AppCard';
import PageHeader from '../../src/components/ui/PageHeader';

const standardsModes = ['MSHA First', 'OSHA First', 'Hybrid', 'Company Rules'];
const inspectionTypes = ['Full Site', 'Area Walkthrough', 'Equipment', 'Incident Follow-up'];
const reportStyles = ['Professional', 'Executive', 'Compliance', 'Corrective Action'];

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.sub }]}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((option) => {
          const active = value === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onChange(option)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.accent : colors.cardAlt,
                  borderColor: active ? colors.accent : colors.border,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: active ? '#FFFFFF' : colors.text }]}>
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
  const { colors, themeMode, setThemeMode } = useAppTheme();

  const [name, setName] = useState('Christopher McKinley');
  const [title, setTitle] = useState('Safety Manager');
  const [company, setCompany] = useState('Monolith Studios');
  const [site, setSite] = useState('North Ridge Plant');

  const [standardsMode, setStandardsMode] = useState('MSHA First');
  const [inspectionType, setInspectionType] = useState('Full Site');
  const [reportStyle, setReportStyle] = useState('Professional');

  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoDrafts, setAutoDrafts] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [highVisibility, setHighVisibility] = useState(false);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}>
      <PageHeader
        eyebrow="Control"
        title="Control Center"
        subtitle="Configure SafeScope profile, intelligence behavior, reporting defaults, and field preferences."
      />

      <AppCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Operator Profile</Text>
            <Text style={[styles.sectionSub, { color: colors.sub }]}>
              Used across reports, reviews, and audit exports.
            </Text>
          </View>
          <Ionicons name="person-circle-outline" size={26} color={colors.accent} />
        </View>

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.muted}
        />

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Title</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Safety Manager"
          placeholderTextColor={colors.muted}
        />

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Company</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
          value={company}
          onChangeText={setCompany}
          placeholder="Company"
          placeholderTextColor={colors.muted}
        />

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Primary Site</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
          value={site}
          onChangeText={setSite}
          placeholder="Site"
          placeholderTextColor={colors.muted}
        />
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
            <Text style={[styles.sectionSub, { color: colors.sub }]}>
              Optimize SafeScope for field or office conditions.
            </Text>
          </View>
          <Ionicons name="contrast-outline" size={24} color={colors.accent} />
        </View>

        <Text style={[styles.fieldLabel, { color: colors.sub }]}>Theme Mode</Text>
        <View style={styles.themeRow}>
          {(['light', 'dark'] as ThemeMode[]).map((mode) => {
            const active = themeMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: active ? colors.accent : colors.cardAlt,
                    borderColor: active ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => setThemeMode(mode)}
              >
                <Text style={[styles.themeButtonText, { color: active ? '#FFFFFF' : colors.text }]}>
                  {mode === 'dark' ? 'Dark' : 'Light'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.preferenceRow, { borderTopColor: colors.border }]}>
          <View style={styles.preferenceText}>
            <Text style={[styles.preferenceTitle, { color: colors.text }]}>High Visibility Mode</Text>
            <Text style={[styles.preferenceSub, { color: colors.sub }]}>Extra contrast for field conditions.</Text>
          </View>
          <Switch
            value={highVisibility}
            onValueChange={setHighVisibility}
            thumbColor={highVisibility ? colors.accent : '#94A3B8'}
          />
        </View>
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Audit Defaults</Text>
            <Text style={[styles.sectionSub, { color: colors.sub }]}>
              Set how new inspections and reports begin.
            </Text>
          </View>
          <Ionicons name="options-outline" size={24} color={colors.accent} />
        </View>

        <ChipGroup label="Standards Priority" options={standardsModes} value={standardsMode} onChange={setStandardsMode} />
        <ChipGroup label="Default Inspection Type" options={inspectionTypes} value={inspectionType} onChange={setInspectionType} />
        <ChipGroup label="Report Style" options={reportStyles} value={reportStyle} onChange={setReportStyle} />
      </AppCard>

      <AppCard style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Intelligence Behavior</Text>
            <Text style={[styles.sectionSub, { color: colors.sub }]}>
              Control how SafeScope assists with analysis and workflow automation.
            </Text>
          </View>
          <Ionicons name="sparkles-outline" size={24} color={colors.accent} />
        </View>

        <PreferenceSwitch
          title="AI Hazard Suggestions"
          subtitle="Generate draft hazard descriptions from evidence."
          value={aiSuggestions}
          onChange={setAiSuggestions}
        />

        <PreferenceSwitch
          title="Auto-save Drafts"
          subtitle="Preserve incomplete inspections locally."
          value={autoDrafts}
          onChange={setAutoDrafts}
        />

        <PreferenceSwitch
          title="Notifications"
          subtitle="Alerts for reviews, actions, and overdue items."
          value={notifications}
          onChange={setNotifications}
        />
      </AppCard>

      <AppCard style={styles.footerCard}>
        <Text style={[styles.footerTitle, { color: colors.text }]}>SafeScope Platform</Text>
        <Text style={[styles.footerText, { color: colors.sub }]}>
          Premium Safety Intelligence Build • Sprint UI Overhaul
        </Text>
      </AppCard>
    </ScrollView>
  );
}

function PreferenceSwitch({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.preferenceRow, { borderTopColor: colors.border }]}>
      <View style={styles.preferenceText}>
        <Text style={[styles.preferenceTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.preferenceSub, { color: colors.sub }]}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        thumbColor={value ? colors.accent : '#94A3B8'}
      />
    </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  sectionTitle: {
    fontSize: tokens.type.h2,
    fontWeight: '900',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: tokens.type.small,
    lineHeight: 18,
    fontWeight: '600',
  },
  fieldGroup: {
    marginTop: tokens.spacing.sm,
  },
  fieldLabel: {
    fontSize: tokens.type.small,
    fontWeight: '800',
    marginBottom: 6,
    marginTop: tokens.spacing.sm,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    fontSize: tokens.type.body,
    fontWeight: '600',
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
  themeRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  themeButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonText: {
    fontSize: tokens.type.body,
    fontWeight: '800',
  },
  preferenceRow: {
    borderTopWidth: 1,
    paddingTop: tokens.spacing.md,
    marginTop: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.md,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: tokens.type.body,
    fontWeight: '800',
    marginBottom: 4,
  },
  preferenceSub: {
    fontSize: tokens.type.small,
    lineHeight: 18,
    fontWeight: '600',
  },
  footerCard: {
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: tokens.type.body,
    fontWeight: '900',
    marginBottom: 4,
  },
  footerText: {
    fontSize: tokens.type.small,
    fontWeight: '600',
    textAlign: 'center',
  },
});
