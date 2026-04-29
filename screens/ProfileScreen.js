import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabase';
import LoadingIndicator from '../components/LoadingIndicator';
import { useTheme } from '../theme/ThemeProvider';
import { useGuest } from '../context/GuestContext';

export default function ProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { isGuest, demoProfile } = useGuest();

  useEffect(() => {
    (async () => {
      if (isGuest) {
        setProfile(demoProfile);
        setLoading(false);
        return;
      }
      const userResp = await supabase.auth.getUser();
      const userId = userResp?.data?.user?.id;
      if (!userId) return navigation.replace('Login');
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      setProfile(data || null);
      setLoading(false);
    })();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  if (loading) return <LoadingIndicator />;
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>{profile?.full_name || 'No profile'}</Text>
      <View style={styles.row}><Text style={[styles.label, { color: theme.muted }]}>Degree:</Text><Text style={{ color: theme.text }}>{profile?.degree}</Text></View>
      <View style={styles.row}><Text style={[styles.label, { color: theme.muted }]}>University:</Text><Text style={{ color: theme.text }}>{profile?.university}</Text></View>
      <View style={styles.row}><Text style={[styles.label, { color: theme.muted }]}>Skills:</Text><Text style={{ color: theme.text }}>{(profile?.skills || []).join(', ')}</Text></View>
      <View style={{ marginTop: 16 }}>
        <Button color={theme.primary} title="Edit Profile" onPress={() => navigation.navigate('ProfileSetup')} />
      </View>
      <View style={{ marginTop: 12 }}>
        <Button title="Logout" onPress={handleLogout} color="#ef4444" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 }
});
