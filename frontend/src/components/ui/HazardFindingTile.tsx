import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export const HazardFindingTile = ({ finding, onEdit, onDelete }) => (
  <View style={styles.tile}>
    <View style={styles.tileHeader}>
      <Text style={styles.category}>{finding.hazardCategory}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(finding)}><Text style={styles.actionText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(finding.id)}><Text style={[styles.actionText, {color: 'red'}]}>Delete</Text></TouchableOpacity>
      </View>
    </View>
    <View style={styles.content}>
      {finding.photos?.length > 0 && <Image source={{ uri: finding.photos[0] }} style={styles.thumb} />}
      <View style={styles.details}>
        <Text style={styles.riskBadge}>Risk: {finding.riskAssessment?.riskLevel || 'N/A'} (Score: {finding.riskAssessment?.riskScore || '0'})</Text>
        <Text numberOfLines={1} style={styles.text}>Location: {finding.location || 'N/A'}</Text>
        <Text numberOfLines={2} style={styles.text}>{finding.hazardDescription}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  tile: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, elevation: 2 },
  tileHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  category: { fontWeight: '900', color: '#101828' },
  actions: { flexDirection: 'row', gap: 10 },
  actionText: { fontSize: 12, fontWeight: '700', color: '#F97316' },
  content: { flexDirection: 'row', gap: 10 },
  thumb: { width: 60, height: 60, borderRadius: 8 },
  details: { flex: 1, justifyContent: 'center' },
  text: { fontSize: 13, color: '#475467' },
  riskBadge: { fontSize: 12, fontWeight: 'bold', color: '#D97706', marginBottom: 4 }
});
