import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { C, S } from '../theme';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shopId, setShopId]     = useState('');
  const [loading, setLoading]   = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleLogin() {
    if (!username.trim() || !password.trim() || !shopId.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    const sid = Number(shopId);
    if (isNaN(sid) || sid <= 0) {
      Alert.alert('Invalid Shop ID', 'Shop ID must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login(username.trim(), password.trim());
      await setAuth(res.data.access_token, res.data.user, sid);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Login failed. Check your credentials.';
      Alert.alert('Login failed', Array.isArray(msg) ? msg.join('\n') : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Text style={s.logo}>✅</Text>
          <Text style={s.title}>MobileTasks</Text>
          <Text style={s.subtitle}>Sign in to access your tasks</Text>
        </View>

        <View style={s.form}>
          <View style={s.field}>
            <Text style={S.label}>Username</Text>
            <TextInput
              style={s.input}
              value={username}
              onChangeText={setUsername}
              placeholder="your.username"
              placeholderTextColor={C.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={s.field}>
            <Text style={S.label}>Password</Text>
            <TextInput
              style={s.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={C.textMuted}
              secureTextEntry
            />
          </View>

          <View style={s.field}>
            <Text style={S.label}>Shop / Agency ID</Text>
            <TextInput
              style={s.input}
              value={shopId}
              onChangeText={setShopId}
              placeholder="e.g. 42"
              placeholderTextColor={C.textMuted}
              keyboardType="number-pad"
            />
            <Text style={s.hint}>Your agency shop ID — ask your manager if unsure</Text>
          </View>

          <Pressable
            style={({ pressed }) => [s.btn, pressed && s.btnPressed, loading && s.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Sign in</Text>
            }
          </Pressable>
        </View>

        <Text style={s.footer}>Connects to CRM3 · NestJS gateway</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo:   { fontSize: 48, marginBottom: 12 },
  title:  { fontSize: 28, fontWeight: '700', color: C.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: C.textMuted, marginTop: 6 },
  form:   { gap: 16 },
  field:  { gap: 4 },
  input: {
    backgroundColor: '#111118',
    borderWidth: 1,
    borderColor: '#1e1e2e',
    borderRadius: 10,
    color: C.text,
    fontSize: 15,
    padding: 13,
  },
  hint: { fontSize: 11, color: C.textMuted, marginTop: 3 },
  btn: {
    ...S.btn,
    backgroundColor: C.primary,
    marginTop: 8,
  },
  btnPressed: { backgroundColor: C.primaryDk },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { textAlign: 'center', color: C.textMuted, fontSize: 11, marginTop: 32 },
});
