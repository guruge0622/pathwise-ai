import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function StatCard({ label, value, accent }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderLeftColor: accent || theme.accent }, accent ? { borderLeftWidth: 4 } : null]}>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 10, marginRight: 12, width: 140 },
  value: { fontSize: 18, fontWeight: '700' },
  label: { marginTop: 6 }
});
