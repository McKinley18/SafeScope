import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LEGAL_ACCEPTED_KEY = 'legal_disclaimer_accepted';

export default function LegalDisclaimer({ onAccept }: { onAccept?: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LEGAL_ACCEPTED_KEY).then((accepted) => {
      if (!accepted) setVisible(true);
    });
  }, []);

  const accept = async () => {
    await AsyncStorage.setItem(LEGAL_ACCEPTED_KEY, 'true');
    setVisible(false);
    onAccept?.();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView>
            <Text style={styles.title}>SafeScope Legal Notice</Text>

            <Text style={styles.body}>
              SafeScope is an operational safety intelligence platform designed to assist with safety documentation,
              hazard review, workflow tracking, and corrective action management.
            </Text>

            <Text style={styles.body}>
              SafeScope does not replace competent persons, supervisors, engineers, certified inspectors,
              legal counsel, emergency responders, site safety procedures, or regulatory authorities.
            </Text>

            <Text style={styles.body}>
              No detection, classification, recommendation, score, alert, report, or export is guaranteed to be
              accurate, complete, current, or suitable for any specific regulatory purpose. Users remain solely
              responsible for verifying site conditions and complying with MSHA, OSHA, company, contractual,
              and other applicable requirements.
            </Text>

            <Text style={styles.body}>
              Emergency, imminent danger, injury, fire, structural failure, equipment failure, hazardous release,
              or other urgent conditions require immediate human intervention and established emergency response
              procedures.
            </Text>

            <Text style={styles.body}>
              Users are responsible for all information, images, notes, and files entered into SafeScope and for
              confirming they have permission to collect, store, share, or export such information.
            </Text>

            <Text style={styles.body}>
              Some information may be stored locally on this device depending on configuration. Users are responsible
              for protecting access to their device and preserving records required by their organization.
            </Text>

            <Text style={styles.body}>
              To the maximum extent permitted by law, SafeScope and Monolith Studios disclaim liability for indirect,
              incidental, special, consequential, punitive, operational, regulatory, data-loss, downtime, or business
              interruption damages arising from use of the platform.
            </Text>

            <TouchableOpacity style={styles.button} onPress={accept}>
              <Text style={styles.buttonText}>I Understand and Accept</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  card: {
    maxHeight: '82%',
    width: '100%',
    maxWidth: 560,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
    color: '#374151',
    marginBottom: 10,
    fontWeight: '600',
  },
  button: {
    marginTop: 14,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#FF6A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
  },
});
