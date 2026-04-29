import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '../supabase';
import LoadingIndicator from '../components/LoadingIndicator';
import FormInput from '../components/FormInput';
import { useTheme } from '../theme/ThemeProvider';
import { useGuest } from '../context/GuestContext';

export default function ProfileSetupScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', university: '', degree: '', year: '', skills: '', interests: '', preferences: '', targetIndustry: '', preferredRole: '' });
  const [errors, setErrors] = useState({});
  const { theme } = useTheme();
  const { isGuest, demoProfile, setDemoProfile } = useGuest();

  useEffect(() => {
    // optional: load existing profile if authenticated or guest demo
    if (isGuest) {
      setProfile({
        full_name: demoProfile.full_name || '',
        university: demoProfile.university || '',
        degree: demoProfile.degree || '',
        year: demoProfile.year || '',
        skills: (demoProfile.skills || []).join(', '),
        interests: (demoProfile.interests || []).join(', '),
        preferences: demoProfile.preferences || '',
        targetIndustry: demoProfile.target_industry || '',
        preferredRole: demoProfile.preferred_role || ''
      });
    }
  }, []);

  const handleSave = async () => {
    const nextErrors = {};
    if (!profile.full_name) nextErrors.full_name = 'Full name is required';
    if (!profile.university) nextErrors.university = 'University is required';
    if (!profile.degree) nextErrors.degree = 'Degree is required';
    if (!profile.skills) nextErrors.skills = 'Add at least one skill';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    if (isGuest) {
      const payload = {
        ...demoProfile,
        full_name: profile.full_name,
        university: profile.university,
        degree: profile.degree,
        year: profile.year,
        skills: profile.skills.split(',').map(s => s.trim()),
        interests: profile.interests.split(',').map(s => s.trim()),
        preferences: profile.preferences,
        target_industry: profile.targetIndustry,
        preferred_role: profile.preferredRole
      };
      setDemoProfile(payload);
      setLoading(false);
      Alert.alert('Saved', 'Demo profile updated');
      return navigation.replace('Dashboard');
    }

    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;
    if (!userId) {
      setLoading(false);
      return Alert.alert('Not authenticated');
    }

    const payload = {
      id: userId,
      full_name: profile.full_name,
      university: profile.university,
      degree: profile.degree,
      year: profile.year,
      skills: profile.skills.split(',').map(s => s.trim()),
      interests: profile.interests.split(',').map(s => s.trim()),
      preferences: profile.preferences,
      target_industry: profile.targetIndustry,
      preferred_role: profile.preferredRole
    };

    const { data, error } = await supabase.from('profiles').upsert(payload, { returning: 'minimal' });
    setLoading(false);
    if (error) return Alert.alert('Save failed', error.message);
    Alert.alert('Saved', 'Profile saved successfully');
    navigation.replace('Dashboard');
  };

  if (loading) return <LoadingIndicator />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ padding: 20 }}>
      <Text style={[styles.title, { color: theme.text }]}>Set up your student profile</Text>
      <FormInput label="Full name" placeholder="John Doe" value={profile.full_name} onChangeText={v => setProfile({ ...profile, full_name: v })} error={errors.full_name} />
      <FormInput label="University" placeholder="University of Colombo" value={profile.university} onChangeText={v => setProfile({ ...profile, university: v })} error={errors.university} />
      <FormInput label="Degree program" placeholder="BSc IT" value={profile.degree} onChangeText={v => setProfile({ ...profile, degree: v })} error={errors.degree} />
      <FormInput label="Year of study" placeholder="3" value={profile.year} onChangeText={v => setProfile({ ...profile, year: v })} />
      <FormInput label="Skills (comma separated)" placeholder="Programming, SQL" value={profile.skills} onChangeText={v => setProfile({ ...profile, skills: v })} error={errors.skills} />
      <FormInput label="Interests (comma separated)" placeholder="AI, Web" value={profile.interests} onChangeText={v => setProfile({ ...profile, interests: v })} />
      <FormInput label="Career preferences" placeholder="Internship, Full-time" value={profile.preferences} onChangeText={v => setProfile({ ...profile, preferences: v })} />
      <FormInput label="Target industry" placeholder="Technology" value={profile.targetIndustry} onChangeText={v => setProfile({ ...profile, targetIndustry: v })} />
      <FormInput label="Preferred job role" placeholder="Software Engineer" value={profile.preferredRole} onChangeText={v => setProfile({ ...profile, preferredRole: v })} />
      <Button color={theme.primary} title="Save profile" onPress={handleSave} disabled={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
});
