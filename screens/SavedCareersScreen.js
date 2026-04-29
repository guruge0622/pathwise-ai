import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../components/Header';
import CareerCard from '../components/CareerCard';
import { supabase } from '../supabase';
import { useTheme } from '../theme/ThemeProvider';
import { useGuest } from '../context/GuestContext';

export default function SavedCareersScreen({ navigation }) {
  const [saved, setSaved] = useState([]);
  const { isGuest, demoSaved } = useGuest();

  useEffect(() => {
    (async () => {
      try {
        if (isGuest) {
          setSaved(demoSaved || []);
          return;
        }
        const userResp = await supabase.auth.getUser();
        const userId = userResp?.data?.user?.id;
        if (!userId) return;
        const { data } = await supabase.from('saved_careers').select('*').eq('user_id', userId);
        setSaved(data || []);
      } catch (e) {
        setSaved([]);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Saved Careers" onBack={() => navigation.goBack()} />
      <SavedContent saved={saved} navigation={navigation} />
    </View>
  );
}

function SavedContent({ saved, navigation }) {
  const { theme } = useTheme();
  return (
    <View style={{ padding: 12, backgroundColor: theme.background, flex: 1 }}>
      {saved.length === 0 ? <Text style={{ color: theme.muted }}>No saved careers yet.</Text> : (
        <FlatList data={saved} keyExtractor={(i)=>i.id} renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('CareerDetail', { career: item })}>
            <CareerCard title={item.title || item.career_title} subtitle={item.salary_range || '—'} details={item.summary || ''} />
          </TouchableOpacity>
        )} />
      )}
    </View>
  );
}
