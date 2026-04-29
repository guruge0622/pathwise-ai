import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabase';
import LoadingIndicator from '../components/LoadingIndicator';
import FormInput from '../components/FormInput';
import { useTheme } from '../theme/ThemeProvider';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { theme } = useTheme();

  const handleRegister = async () => {
    const nextErrors = {};
    if (!email || !/.+@.+\..+/.test(email)) nextErrors.email = 'Enter a valid email';
    if (!password || password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setLoading(false);
        return Alert.alert('Registration failed', error.message);
      }

      // Try to automatically sign in the user after registration.
      const signInResp = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (signInResp?.error) {
        // Could be that the Supabase project requires email confirmation.
        console.warn('Auto sign-in failed after signUp:', signInResp.error);
        Alert.alert('Registration successful', 'Your account was created. If you cannot log in, your Supabase project may require email confirmation. To allow immediate login, disable "Confirm email" in Supabase Auth settings, or use the magic link sent to your email.', [
          { text: 'Open Login', onPress: () => navigation.replace('Login') }
        ]);
        return;
      }

      // Signed in successfully
      navigation.replace('Dashboard');
    } catch (e) {
      setLoading(false);
      console.error('Registration exception', e);
      Alert.alert('Registration error', e.message || JSON.stringify(e));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.title, { color: theme.text }]}>Create an account</Text>
      <FormInput label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
      <FormInput label="Password" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
      {loading ? <LoadingIndicator style={{ height: 60 }} /> : <Button color={theme.primary} title="Register" onPress={handleRegister} disabled={loading} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
});
