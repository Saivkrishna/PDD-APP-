import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, useColorScheme, Modal } from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL, GOOGLE_WEB_CLIENT_ID } from '../config';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

interface LoginProps {
  onLogin: (user: any) => void;
  onGoRegister: () => void;
}

export default function Login({ onLogin, onGoRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  useEffect(() => {
    if (GOOGLE_WEB_CLIENT_ID && !GOOGLE_WEB_CLIENT_ID.includes('YOUR_CLIENT_ID')) {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
      });
    }
  }, []);

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password) { setError('Please enter your password'); return; }
    setLoading(true);
    try {
      // 1. Sign in via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // 2. Sync user profile with database
      const syncRes = await fetch(`${API_URL}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userCredential.user.uid,
          name: userCredential.user.displayName || email.split('@')[0],
          email: email.trim()
        })
      });
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        onLogin(syncData.user);
      } else {
        onLogin({
          id: userCredential.user.uid,
          name: userCredential.user.displayName || email.split('@')[0],
          email: email.trim()
        });
      }
    } catch (e: any) {
      console.error("Login error:", e);
      setError(e.message.replace('Firebase: ', '') || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    
    // Check if client ID has been replaced
    if (!GOOGLE_WEB_CLIENT_ID || GOOGLE_WEB_CLIENT_ID.includes('YOUR_CLIENT_ID')) {
      setError('Google Sign-In has not been configured with a Web Client ID in config.ts yet.');
      return;
    }

    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;
      
      if (!idToken) {
        throw new Error('Google Sign-In completed, but no ID Token was received. Verify credentials in Google Cloud Console.');
      }
      
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      
      const syncRes = await fetch(`${API_URL}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userCredential.user.uid,
          name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'Google User',
          email: userCredential.user.email
        })
      });
      
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        onLogin(syncData.user);
      } else {
        onLogin({
          id: userCredential.user.uid,
          name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'Google User',
          email: userCredential.user.email
        });
      }
    } catch (e: any) {
      console.error("Google Sign-In Exception details:", e);
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        setError('Sign-in cancelled by user.');
      } else if (e.code === statusCodes.IN_PROGRESS) {
        setError('Google Sign-in is already in progress.');
      } else if (e.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Google Play Services are not available or need updating.');
      } else {
        setError(e.message || 'An error occurred during Google Sign-In.');
      }
    }
    setLoading(false);
  };

  const handleSendResetEmail = async () => {
    setForgotError('');
    setForgotSuccess('');
    const trimmedEmail = forgotEmail.trim();

    if (!trimmedEmail) {
      setForgotError('Please enter your registered email address.');
      return;
    }

    setForgotLoading(true);
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setForgotSuccess('✅ Password reset link has been sent successfully. Please check your inbox.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotEmail('');
        setForgotSuccess('');
      }, 3000);
    } catch (e: any) {
      console.error("Password reset error:", e);
      setForgotError(e.message.replace('Firebase: ', '') || 'Failed to send reset email.');
    }
    setForgotLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        <Text style={styles.appIcon}>🎓</Text>
        <Text style={[styles.title, { color: colors.textMain }]}>CareerPath AI</Text>
        <Text style={[styles.subtitle, { color: colors.textSub }]}>Sign in to explore your career path</Text>

        {!!error && <Text style={styles.errorText}>⚠️ {error}</Text>}

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
          placeholder="🔒  Password"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.forgotBtn} onPress={() => setShowForgotModal(true)}>
          <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginBtnText}>🚀 Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.borderColor }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.borderColor }]} />
        </View>

        <TouchableOpacity
          style={[styles.googleBtn, { borderColor: colors.borderColor, opacity: loading ? 0.7 : 1 }]}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Image
                source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }}
                style={styles.googleIcon}
              />
              <Text style={[styles.googleBtnText, { color: colors.textMain }]}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={{ color: colors.textSub, fontSize: 13 }}>Don't have an account? </Text>
          <TouchableOpacity onPress={onGoRegister}>
            <Text style={[styles.registerText, { color: colors.primary }]}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password Modal */}
      <Modal visible={showForgotModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowForgotModal(false)}>
              <Text style={{ color: colors.textSub, fontSize: 20 }}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalIcon}>🔑</Text>
            <Text style={[styles.modalTitle, { color: colors.textMain }]}>Forgot Password</Text>
            <Text style={[styles.modalSub, { color: colors.textSub }]}>
              Enter your registered email address to receive a password reset link.
            </Text>

            {!!forgotError && <Text style={styles.errorText}>⚠️ {forgotError}</Text>}
            {!!forgotSuccess && <Text style={styles.successText}>{forgotSuccess}</Text>}

            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.borderColor, color: colors.textMain }]}
              placeholder="📧  Your email address"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              editable={!forgotLoading}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: colors.borderColor }]}
                onPress={() => setShowForgotModal(false)}
                disabled={forgotLoading}
              >
                <Text style={{ color: colors.textMain, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalConfirmBtn, { backgroundColor: colors.primary }]}
                onPress={handleSendResetEmail}
                disabled={forgotLoading}
              >
                {forgotLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmBtnText}>Send Link</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  appIcon: {
    fontSize: 52,
    alignSelf: 'center',
    marginBottom: Spacing.two,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.four,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  loginBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.four,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.two,
    fontSize: 12,
  },
  googleBtn: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  googleIcon: {
    width: 18,
    height: 18,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
  registerText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 4,
  },
  modalIcon: {
    fontSize: 44,
    alignSelf: 'center',
    marginBottom: Spacing.two,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: Spacing.one,
  },
  modalSub: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: Spacing.four,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  modalConfirmBtn: {
    flex: 2,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
