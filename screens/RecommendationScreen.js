import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { supabase } from '../supabase';
import LoadingIndicator from '../components/LoadingIndicator';
import { generateRecommendations } from '../utils/recommendationEngine';
import CareerCard from '../components/CareerCard';
import { useGuest } from '../context/GuestContext';

export default function RecommendationScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [rec, setRec] = useState(null);
  const { isGuest, demoProfile, demoRec } = useGuest();

  useEffect(() => {
    (async () => {
      if (isGuest) {
        setProfile(demoProfile);
        setRec(demoRec);
        setLoading(false);
        return;
      }
      const userResp = await supabase.auth.getUser();
      const userId = userResp?.data?.user?.id;
      if (!userId) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      setProfile(data || {});
      setRec(generateRecommendations(data || {}));
      setLoading(false);
    })();
  }, []);

  const { theme } = useTheme();
  if (loading) return <LoadingIndicator />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ padding: 16 }}>
      <Text style={[styles.title, { color: theme.text }]}>Career Recommendations</Text>
      {rec?.careers?.map((c, i) => (
        <CareerCard key={i} title={c} subtitle={rec.salaryRange} details={`Demand: ${rec.marketDemand}`} />
      ))}

      <Text style={[styles.sub, { color: theme.text }]}>Skill gaps</Text>
      <CareerCard title="Technical" details={rec.skillGaps.technical.join(', ')} />
      <CareerCard title="Soft skills" details={rec.skillGaps.soft.join(', ')} />

      <Text style={[styles.sub, { color: theme.text }]}>Learning roadmap</Text>
      <CareerCard details={rec.learningRoadmap.join(' → ')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  sub: { marginTop: 12, fontWeight: '700' }
});
