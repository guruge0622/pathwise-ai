import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export default function SplashScreen({ navigation }) {
  const { theme } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Login'), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={require('../assets/icon.png')} style={styles.logo} />
      <Text style={[styles.title, { color: theme.text }]}>PathWise AI</Text>
      <Text style={[styles.tagline, { color: theme.muted }]}>Your smart career path starts here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 120, height: 120, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  tagline: { marginTop: 8 }
});
