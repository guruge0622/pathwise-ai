import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useTheme } from '../theme/ThemeProvider';

const SAMPLE = [
  { id: '1', text: 'New career recommendation: Data Scientist', time: '2 hours ago' },
  { id: '2', text: 'Profile completion reminder: Add skills', time: '1 day ago' },
  { id: '3', text: 'Internship: Software Engineer at Local Startup', time: '3 days ago' }
];

export default function NotificationsScreen() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title="Notifications" />
      <FlatList data={SAMPLE} keyExtractor={i=>i.id} contentContainerStyle={{ padding: 12 }} renderItem={({ item }) => (
        <View style={[styles.item, { backgroundColor: theme.card }] }>
          <Text style={[styles.text, { color: theme.text }]}>{item.text}</Text>
          <Text style={[styles.time, { color: theme.muted }]}>{item.time}</Text>
        </View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 14, backgroundColor: '#fff', borderRadius: 10, marginBottom: 12 },
  text: { color: '#111827' },
  time: { color: '#6b7280', marginTop: 6 }
});
