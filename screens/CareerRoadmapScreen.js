import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { useTheme } from '../theme/ThemeProvider';

const ROADMAPS = {
  'Software Engineer': ['Learn HTML/CSS','Learn JavaScript','Learn React','Build Projects','Apply for Internship'],
  'Data Scientist': ['Learn Python','Learn Statistics','Learn ML','Practice on Datasets','Portfolio Projects']
};

export default function CareerRoadmapScreen({ route, navigation }) {
  const title = route.params?.title || 'Software Engineer';
  const steps = ROADMAPS[title] || ROADMAPS['Software Engineer'];

  return (
    <ThemedRoadmap title={title} steps={steps} navigation={navigation} />
  );
}

function ThemedRoadmap({ title, steps, navigation }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title={`${title} Roadmap`} onBack={() => navigation.goBack()} />
      <ScrollView style={{ padding: 16 }}>
        {steps.map((s, i) => (
          <View key={i} style={[styles.step, { backgroundColor: theme.card }] }>
            <Text style={[styles.stepIndex, { color: theme.text }]}>Step {i+1}</Text>
            <Text style={[styles.stepText, { color: theme.text }]}>{s}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  step: { padding: 12, backgroundColor: '#fff', borderRadius: 10, marginBottom: 12 },
  stepIndex: { fontWeight: '700' },
  stepText: { marginTop: 6, color: '#374151' }
});
