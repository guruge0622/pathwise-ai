import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../supabase';
import LoadingIndicator from '../components/LoadingIndicator';
import FormInput from '../components/FormInput';
import { useTheme } from '../theme/ThemeProvider';
import { useGuest } from '../context/GuestContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { theme } = useTheme();
  const { enterGuest } = useGuest();

  const handleLogin = async () => {
    const nextErrors = {};
    if (!email || !/.+@.+\..+/.test(email)) nextErrors.email = 'Enter a valid email';
    if (!password || password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      const resp = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      // debug logging for troubleshooting
      console.log('supabase signIn response', resp);
      const { data, error } = resp;
      if (error) {
        console.error('Login error', error);
        // detect unconfirmed email messages
        const msg = error.message || JSON.stringify(error);
        if (/confirm|confirmed|verify|verification/i.test(msg)) {
          setUnconfirmedEmail(email.trim());
          return Alert.alert('Email not confirmed', 'Your email address is not confirmed. We can send a magic sign-in link to your email.', [{ text: 'Send magic link', onPress: sendMagicLink }, { text: 'OK' }]);
        }
        return Alert.alert('Login failed', msg);
      }
      if (!data || !data.user) {
        // unexpected: no user in response
        return Alert.alert('Login failed', 'No user returned. Check Supabase keys and project settings.');
      }
      navigation.replace('Dashboard');
    } catch (e) {
      setLoading(false);
      console.error('Unexpected login exception', e);
      Alert.alert('Login exception', e.message || JSON.stringify(e));
    }
  };

    const [unconfirmedEmail, setUnconfirmedEmail] = useState('');

    const sendMagicLink = async () => {
      if (!email) return Alert.alert('Enter email first');
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: '' } });
        setLoading(false);
        console.log('magic link resp', data, error);
        if (error) return Alert.alert('Send failed', error.message || JSON.stringify(error));
        Alert.alert('Magic link sent', 'Check your email for the sign-in link (also check spam).');
      } catch (err) {
        setLoading(false);
        console.error('magic link error', err);
        Alert.alert('Error', err.message || JSON.stringify(err));
      }
    };

    const openMailApp = () => {
      // best-effort: open mailto:
      const Linking = require('react-native').Linking;
      Linking.openURL('mailto:');
    };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>Welcome to PathWise AI</Text>
      <FormInput label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
      <FormInput label="Password" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
      {loading ? <LoadingIndicator style={{ height: 60 }} /> : <Button color={theme.primary} title="Login" onPress={handleLogin} disabled={loading} />}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={[styles.link, { color: theme.primary }]}>Register</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}><Text style={[styles.link, { color: theme.primary }]}>Forgot Password?</Text></TouchableOpacity>
      </View>
      <View style={{ marginTop: 12 }}>
        <Button color={theme.primary} title="Preview app (skip auth)" onPress={() => { enterGuest(); navigation.replace('Dashboard'); }} />
      </View>
      {unconfirmedEmail ? (
        <View style={{ marginTop: 16, padding: 12, backgroundColor: theme.card, borderRadius: 8 }}>
          <Text style={{ color: theme.text, marginBottom: 8 }}>It looks like your email is not confirmed. Check your inbox or send a magic sign-in link.</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button title="Open Mail" onPress={openMailApp} />
            <Button color={theme.primary} title="Send Magic Link" onPress={sendMagicLink} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  link: { color: '#2563eb' },
});
