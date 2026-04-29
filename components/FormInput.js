import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function FormInput({ label, error, style, ...props }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={[styles.label, { color: theme.muted }]}>{label}</Text> : null}
      <TextInput style={[styles.input, error ? styles.inputError : null, { backgroundColor: theme.card, color: theme.text, borderColor: error ? '#ef4444' : theme.border }]} placeholderTextColor={theme.muted} {...props} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 6 },
  input: { padding: 12, borderWidth: 1, borderRadius: 8 },
  inputError: { borderColor: '#ef4444' },
  error: { color: '#ef4444', marginTop: 6, fontSize: 12 }
});
