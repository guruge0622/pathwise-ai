import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Linking } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import ThemeProvider from './theme/ThemeProvider';
import { GuestProvider } from './context/GuestContext';
import { supabase } from './supabase';

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    const handleUrl = async (event) => {
      const url = (typeof event === 'string') ? event : event?.url;
      if (!url) return;
      try {
        // Supabase returns tokens in the URL fragment: #access_token=...&refresh_token=...
        const fragment = url.split('#')[1] || '';
        const params = new URLSearchParams(fragment);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) {
            console.warn('Failed to set Supabase session from deep link', error);
            return;
          }
          // navigate to Dashboard once session is set
          navigationRef.current?.navigate('Dashboard');
        }
      } catch (e) {
        console.error('Error handling deep link', e);
      }
    };

    // handle initial url if app was cold-started from the link
    (async () => {
      const initial = await Linking.getInitialURL();
      if (initial) handleUrl(initial);
    })();

    const sub = Linking.addEventListener('url', handleUrl);
    return () => sub.remove();
  }, []);

  return (
    <ThemeProvider>
      <GuestProvider>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </GuestProvider>
    </ThemeProvider>
  );
}
