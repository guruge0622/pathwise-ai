import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function CareerCard({ title, subtitle, details }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.mode === 'dark' ? '#000' : '#000' }]}>
      {title ? <Text style={[styles.title, { color: theme.text }]}>{title}</Text> : null}
      {subtitle ? <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text> : null}
      {details ? <Text style={[styles.details, { color: theme.text }]}>{details}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, marginBottom: 12, elevation: 3 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { marginTop: 6 },
  details: { marginTop: 8 }
});
