import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const canned = {
  cybersecurity: 'Learn networking fundamentals, OS, and take basic security courses. Try internships in SOCs.',
  software: 'Strengthen programming, data structures, and build projects. Contribute to open source and apply for internships.',
  data: 'Learn SQL, Python, statistics, and build analytical projects with real datasets.'
};

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hello! Ask me about careers, internships, or skills.' }]);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    const q = text.toLowerCase();
    setMessages(prev => [...prev, { from: 'user', text }]);
    let reply = 'Sorry, I do not understand. Try asking about cybersecurity, software, or data.';
    if (q.includes('cyber')) reply = canned.cybersecurity;
    if (q.includes('software') || q.includes('program')) reply = canned.software;
    if (q.includes('data')) reply = canned.data;
    setTimeout(() => setMessages(prev => [...prev, { from: 'bot', text: reply }]), 500);
    setText('');
  };

  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <ScrollView style={styles.messages} contentContainerStyle={{ padding: 12 }}>
        {messages.map((m, i) => (
          <View key={i} style={[styles.msg, m.from === 'bot' ? styles.bot : styles.user, { backgroundColor: m.from === 'bot' ? '#eef2ff' : '#dcfce7' }]}>
            <Text style={{ color: theme.text }}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput value={text} onChangeText={setText} placeholder="Ask career questions..." style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} />
        <Button color={theme.primary} title="Send" onPress={send} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messages: { flex: 1 },
  msg: { padding: 10, borderRadius: 8, marginBottom: 8, maxWidth: '85%' },
  bot: { backgroundColor: '#eef2ff', alignSelf: 'flex-start' },
  user: { backgroundColor: '#dcfce7', alignSelf: 'flex-end' },
  inputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#eee' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginRight: 8 }
});
