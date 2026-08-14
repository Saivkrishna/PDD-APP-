import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL } from '../config';

interface RegisterProps {
  onGoLogin: () => void;
}

export default function Register({ onGoLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    if (!name.trim()) { setError('Please enter your full name'); return; }
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password) { setError('Please enter a password'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // 2. Set displayName
      await updateProfile(userCredential.user, { displayName: name.trim() });
      // 3. Sync profile to database
      const res = await fetch(`${API_URL}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userCredential.user.uid,
          name: name.trim(),
          email: email.toLowerCase().trim()
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to sync account to database');
        setLoading(false);
        return;
      }
      setSuccess('✅ Account created! Redirecting to Dashboard...');
      setTimeout(() => {
        onGoLogin();
      }, 2000);
    } catch (e: any) {
      console.error("Registration error:", e);
      setError(e.message.replace('Firebase: ', '') || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        <View style={styles.headerIconRow}>
          <Text style={styles.appIcon}>🎓</Text>
        </View>
        <Text style={[styles.title, { color: colors.textMain }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSub }]}>Join CareerPath AI today</Text>

        {!!error && <Text style={styles.errorText}>⚠️ {error}</Text>}
        {!!success && <Text style={styles.successText}>{success}</Text>}

        {!success ? (
          <>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.borderColor, color: colors.textMain }]}
              placeholder="👤  Full Name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.borderColor, color: colors.textMain }]}
              placeholder="📧  Email Address"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.borderColor, color: colors.textMain }]}
              placeholder="🔒  Password (min 6 chars)"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.borderColor, color: colors.textMain }]}
              placeholder="🔒  Confirm Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
            />

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.btnText}>✅ Register</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={onGoLogin}>
            <Text style={styles.btnText}>🚀 Go to Login</Text>
          </TouchableOpacity>
        )}

        {!success && (
          <View style={styles.loginLinkRow}>
            <Text style={{ color: colors.textSub, fontSize: 13 }}>Already have an account? </Text>
            <TouchableOpacity onPress={onGoLogin}>
              <Text style={[styles.loginLinkText, { color: colors.primary }]}>Login here</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.three,
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.four,
    alignItems: 'stretch',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  headerIconRow: {
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  appIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 14,
    marginBottom: Spacing.three,
  },
  btn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  loginLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
  loginLinkText: {
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.three,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  successText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.three,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
});
