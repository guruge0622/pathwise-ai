import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../supabase';
import LoadingIndicator from '../components/LoadingIndicator';
import { generateRecommendations } from '../utils/recommendationEngine';
import StatCard from '../components/StatCard';
import Header from '../components/Header';
import { useGuest } from '../context/GuestContext';

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [recommendationPreview, setRecommendationPreview] = useState(null);
  const { isGuest, demoProfile, demoSaved, demoRec } = useGuest();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    (async () => {
      if (isGuest) {
        setProfile(demoProfile);
        setRecommendationPreview(demoRec);
        setSavedCount(demoSaved.length);
        setLoading(false);
        return;
      }
      const userResp = await supabase.auth.getUser();
      const userId = userResp?.data?.user?.id;
      if (!userId) return navigation.replace('Login');
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      setProfile(data || null);
      setRecommendationPreview(generateRecommendations(data || {}));

      // try to fetch saved careers count (if table exists)
      try {
        const { data: saved } = await supabase.from('saved_careers').select('*').eq('user_id', userId);
        setSavedCount(saved?.length || 0);
      } catch (e) {
        setSavedCount(0);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7fb' }}>
      <Header title="Dashboard" right={<TouchableOpacity onPress={() => navigation.navigate('Notifications')}><Text style={{ color: '#2563eb' }}>Notifications</Text></TouchableOpacity>} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.welcome}>Welcome{profile?.full_name ? `, ${profile.full_name}` : ''} 👋</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <StatCard label="Profile Strength" value={`${Math.min((profile?.skills?.length || 0) * 10 + 40, 100)}%`} accent="#2563eb" />
          <StatCard label="Saved Careers" value={`${savedCount}`} />
          <StatCard label="Recommendations" value={`${recommendationPreview?.careers?.length || 0}`} />
        </ScrollView>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile Summary</Text>
          <Text>{profile ? `${profile.degree} — ${profile.university}` : 'No profile set'}</Text>
          <Button title={profile ? 'View Profile' : 'Set up Profile'} onPress={() => navigation.navigate(profile ? 'Profile' : 'ProfileSetup')} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Recommendations</Text>
          {recommendationPreview?.careers?.slice(0,3).map((c, i) => (
            <Text key={i}>• {c}</Text>
          ))}
          <Button title="Open Recommendations" onPress={() => navigation.navigate('Recommendations')} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <Button title="Chatbot" onPress={() => navigation.navigate('Chatbot')} />
          <Button title="Saved Careers" onPress={() => navigation.navigate('SavedCareers')} />
          <Button title="Skills" onPress={() => navigation.navigate('SkillsSelection')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  welcome: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 10, marginBottom: 12 },
  cardTitle: { fontWeight: '700', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }
});
