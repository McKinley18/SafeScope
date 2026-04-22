import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LEGAL_ACCEPTED_KEY = 'legal_disclaimer_accepted';

export default function LegalDisclaimer({ onAccept }: { onAccept: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkAccepted();
  }, []);

  const checkAccepted = async () => {
    const accepted = await AsyncStorage.getItem(LEGAL_ACCEPTED_KEY);
    if (!accepted) {
      setVisible(true);
    }
  };

  const handleAccept = async () => {
    await AsyncStorage.setItem(LEGAL_ACCEPTED_KEY, 'true');
    setVisible(false);
    onAccept();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Legal Disclaimer & Assumption of Risk</Text>
        <ScrollView style={styles.content}>
          <Text style={styles.text}>
            StockSync provides safety alerts based on sensor data. However, the system is an aid and 
            not a replacement for professional safety protocols.
          </Text>
          <Text style={styles.subtitle}>Assumption of Risk</Text>
          <Text style={styles.text}>
            By using this application, you acknowledge that you are responsible for final verification 
            of all safety data. You assume all risks associated with the use of the information provided 
            by StockSync.
          </Text>
        </ScrollView>
        <Button title="Accept" onPress={handleAccept} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
  text: { fontSize: 14, lineHeight: 20 },
  content: { flex: 1 }
});
