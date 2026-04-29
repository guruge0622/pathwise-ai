import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useTheme } from '../theme/ThemeProvider';

const ALL_SKILLS = ['Programming','Leadership','Communication','Design','Problem Solving','Data Analysis','Public Speaking','Databases','Machine Learning','DevOps'];

export default function SkillsSelectionScreen({ navigation }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);

  const toggle = (s) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const filtered = ALL_SKILLS.filter(s => s.toLowerCase().includes(query.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title="Select Skills" onBack={() => navigation.goBack()} />
      <View style={{ padding: 12 }}>
        <TextInput placeholder="Search skills" value={query} onChangeText={setQuery} style={[styles.search, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} placeholderTextColor={theme.muted} />
        <FlatList data={filtered} keyExtractor={i=>i} numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }} renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggle(item)} style={[styles.chip, selected.includes(item) ? { backgroundColor: theme.primary } : { backgroundColor: theme.card }]}>
            <Text style={selected.includes(item) ? styles.chipTextActive : [styles.chipText, { color: theme.text }]}>{item}</Text>
          </TouchableOpacity>
        )} />

        <TouchableOpacity style={[styles.next, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('InterestsSelection', { skills: selected })}>
          <Text style={styles.nextText}>Next — Interests</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  search: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e6e8ee', marginBottom: 12 },
  chip: { padding: 12, borderRadius: 10, backgroundColor: '#fff', marginBottom: 12, width: '48%' },
  chipActive: { backgroundColor: '#2563eb' },
  chipText: { color: '#111827' },
  chipTextActive: { color: '#fff' },
  next: { marginTop: 12, backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center' },
  nextText: { color: '#fff', fontWeight: '700' }
});
