import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function Header({ title, right, onBack }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}> 
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={[styles.backText, { color: theme.text }]}>‹</Text>
        </TouchableOpacity>
      ) : <View style={styles.backPlaceholder} />}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderBottomWidth: 1 },
  back: { padding: 6 },
  backText: { fontSize: 28 },
  backPlaceholder: { width: 28 },
  title: { fontSize: 18, fontWeight: '700' },
  right: { minWidth: 48, alignItems: 'flex-end' }
});
