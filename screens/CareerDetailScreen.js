import React from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import Header from '../components/Header';
import { useTheme } from '../theme/ThemeProvider';

export default function CareerDetailScreen({ route, navigation }) {
  const career = route.params?.career || {
    title: 'Software Engineer',
    description: 'Design and build software applications, collaborate with teams, and ship products.',
    qualifications: ['Bachelor degree in CS or related'],
    skills: ['Programming', 'Data Structures', 'Databases'],
    salary: 'LKR 80,000 - 300,000',
    demand: 'High',
    roadmap: ['Learn programming', 'Build projects', 'Internships']
  };

  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title={career.title} onBack={() => navigation.goBack()} />
      <ScrollView style={{ padding: 16 }}>
        <Text style={[styles.h, { color: theme.text }]}>Overview</Text>
        <Text style={[styles.p, { color: theme.text }]}>{career.description}</Text>

        <Text style={[styles.h, { color: theme.text }]}>Required Qualifications</Text>
        {career.qualifications.map((q, i) => <Text key={i} style={[styles.p, { color: theme.text }]}>• {q}</Text>)}

        <Text style={[styles.h, { color: theme.text }]}>Skills Needed</Text>
        <Text style={[styles.p, { color: theme.text }]}>{career.skills.join(', ')}</Text>

        <Text style={[styles.h, { color: theme.text }]}>Salary Range</Text>
        <Text style={[styles.p, { color: theme.text }]}>{career.salary}</Text>

        <Text style={[styles.h, { color: theme.text }]}>Job Demand</Text>
        <Text style={[styles.p, { color: theme.text }]}>{career.demand}</Text>

        <Text style={[styles.h, { color: theme.text }]}>Learning Roadmap</Text>
        {career.roadmap.map((r, i) => <Text key={i} style={[styles.p, { color: theme.text }]}>Step {i+1}: {r}</Text>)}

        <View style={{ marginTop: 16 }}>
          <Button color={theme.primary} title="Save Career" onPress={() => alert('Saved (demo)')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  h: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  p: { color: '#374151', marginTop: 6 }
});
