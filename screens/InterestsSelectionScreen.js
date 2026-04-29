import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useTheme } from '../theme/ThemeProvider';

const INTERESTS = ['AI','Web Development','Cybersecurity','Business','Marketing','UI/UX','Research','Entrepreneurship','Data Science'];

export default function InterestsSelectionScreen({ route, navigation }) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(route.params?.skills || []);

  const toggle = (i) => {
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title="Select Interests" onBack={() => navigation.goBack()} />
      <View style={{ padding: 12 }}>
        <FlatList data={INTERESTS} keyExtractor={i=>i} numColumns={2} columnWrapperStyle={{ justifyContent: 'space-between' }} renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggle(item)} style={[styles.card, selected.includes(item) ? { backgroundColor: theme.primary } : { backgroundColor: theme.card }]}>
            <Text style={selected.includes(item) ? styles.cardTextActive : [styles.cardText, { color: theme.text }]}>{item}</Text>
          </TouchableOpacity>
        )} />

        <TouchableOpacity style={[styles.next, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('ProfileSetup', { skills: route.params?.skills || [], interests: selected })}>
          <Text style={styles.nextText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 10, backgroundColor: '#fff', marginBottom: 12, width: '48%', alignItems: 'center' },
  cardActive: { backgroundColor: '#0ea5a4' },
  cardText: { color: '#111827' },
  cardTextActive: { color: '#fff' },
  next: { marginTop: 12, backgroundColor: '#2563eb', padding: 14, borderRadius: 10, alignItems: 'center' },
  nextText: { color: '#fff', fontWeight: '700' }
});
