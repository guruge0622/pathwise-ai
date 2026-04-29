import React from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { supabase } from '../supabase';
import { useTheme } from '../theme/ThemeProvider';

export default function SettingsScreen({ navigation }) {
  const { theme, toggle, mode } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  return (
    <View style={[{ flex: 1, backgroundColor: theme.background }]}>
      <Header title="Settings" />
      <View style={{ padding: 12 }}>
        <View style={styles.row}><Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text><Switch value={mode === 'dark'} onValueChange={toggle} /></View>
        <View style={styles.row}><Text style={[styles.label, { color: theme.text }]}>Notifications</Text><Switch value={true} onValueChange={() => {}} /></View>
        <View style={{ marginTop: 20 }}>
          <Button title="Change password" onPress={() => navigation.navigate('ForgotPassword')} />
        </View>
        <View style={{ marginTop: 12 }}>
          <Button title="Help & Support" onPress={() => alert('Contact support@pathwise.ai (demo)')} />
        </View>
        <View style={{ marginTop: 12 }}>
          <Button title="Logout" color="#ef4444" onPress={handleLogout} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  label: { fontSize: 16 }
});
