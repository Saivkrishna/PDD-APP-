import React, { useState, useEffect } from 'react';
import aptitudeData from './aptitudeData';
import { quizData } from './quizData';
import { techLearningData, getYoutubeChannels } from './techLearningData';
import html2canvas from 'html2canvas';
import { allAptitudeQuestions } from './allQuizQuestions';
import MemoryMatrixGame from './components/MemoryMatrix/MemoryMatrixGame';
import ArithmeticRainGame from './components/ArithmeticRain/ArithmeticRainGame';
import AIWorkspace from './components/AIWorkspace';
import { auth, googleProvider } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

const API = process.env.REACT_APP_API_URL || '/api';

// ─── COLORS & STYLES ─────────────
const S = {
  page: {
    minHeight: '100vh',
    background: 'transparent',
    padding: '0 0 120px 0',
    color: 'var(--text-main)',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    transition: 'var(--transition-smooth)'
  },
  header: {
    background: 'var(--bg-container)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid var(--border-color)',
    boxShadow: '0 8px 32px var(--glass-shadow)'
  },
  logo: {
    fontSize: 20,
    fontWeight: 900,
    fontFamily: 'Outfit, Nunito, sans-serif',
    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
  },
  backBtn: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    padding: '6px 14px',
    borderRadius: 50,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 700,
    transition: 'var(--transition-smooth)',
    display: 'flex',
    alignItems: 'center',
    gap: 6
  },
  heroBox: {
    textAlign: 'center',
    padding: '40px 24px 20px'
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: 900,
    fontFamily: 'Outfit, Nunito, sans-serif',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary), #c084fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1.15,
    letterSpacing: '-0.8px'
  },
  heroSub: {
    color: 'var(--text-sub)',
    marginTop: 8,
    fontSize: 14,
    fontWeight: 500
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
    gap: 20,
    padding: '20px'
  },
  card: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-card)',
    padding: '24px 20px',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    textAlign: 'center',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 30px var(--card-shadow)'
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 10,
    display: 'inline-block',
    transition: 'transform 0.3s ease'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: 'var(--text-main)',
    lineHeight: 1.3
  },
  cardSub: {
    fontSize: 12,
    color: 'var(--text-sub)',
    marginTop: 6,
    lineHeight: 1.4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: 'var(--text-main)',
    padding: '24px 20px 8px',
    fontFamily: 'Outfit, Nunito, sans-serif',
    letterSpacing: '-0.3px'
  },
  detailBox: {
    margin: '16px 20px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-card)',
    padding: 24,
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    boxShadow: '0 12px 40px var(--card-shadow)',
    transition: 'var(--transition-smooth)'
  },
  label: {
    fontSize: 11,
    fontWeight: 900,
    color: 'var(--primary)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8
  },
  pill: {
    display: 'inline-block',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid var(--border-color)',
    color: 'var(--primary)',
    borderRadius: 50,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 700,
    margin: '4px 4px 4px 0',
    transition: 'var(--transition-smooth)'
  },
  salaryBox: {
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.03))',
    border: '1px solid var(--border-color)',
    borderRadius: 16,
    padding: '14px 20px',
    margin: '12px 0'
  },
  tag: {
    display: 'inline-block',
    background: 'rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    color: 'var(--primary)',
    borderRadius: 8,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 700,
    margin: '4px 4px 4px 0'
  },
  bigTag: {
    display: 'inline-block',
    background: 'rgba(99, 102, 241, 0.06)',
    border: '1px solid var(--border-color)',
    color: 'var(--primary)',
    borderRadius: 12,
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 700,
    margin: '5px 6px 5px 0',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)'
  },
  searchBox: {
    margin: '16px 20px',
    position: 'relative'
  },
  searchInput: {
    width: '100%',
    padding: '14px 18px 14px 46px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: 50,
    color: 'var(--text-main)',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    transition: 'var(--transition-smooth)',
    boxSizing: 'border-box'
  },
  tabRow: {
    display: 'flex',
    gap: 8,
    padding: '14px 20px 0',
    overflowX: 'auto'
  },
  tab: {
    padding: '8px 20px',
    borderRadius: 50,
    border: '1px solid var(--border-color)',
    background: 'rgba(255, 255, 255, 0.02)',
    color: 'var(--text-sub)',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    transition: 'var(--transition-smooth)'
  },
  tabActive: {
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    border: 'none',
    color: '#fff',
    boxShadow: '0 6px 18px rgba(99, 102, 241, 0.3)'
  },
  listRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 18px',
    background: 'var(--card-bg)',
    borderRadius: 20,
    marginBottom: 10,
    cursor: 'pointer',
    border: '1px solid var(--border-color)',
    transition: 'var(--transition-smooth)'
  },
  listIcon: {
    fontSize: 28,
    minWidth: 38
  },
  listTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: 'var(--text-main)'
  },
  listSub: {
    fontSize: 12,
    color: 'var(--text-sub)',
    marginTop: 4
  },
  arrow: {
    marginLeft: 'auto',
    color: 'var(--primary)',
    fontSize: 18
  },
  badge: {
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    color: '#fff',
    borderRadius: 8,
    padding: '3px 10px',
    fontSize: 10,
    fontWeight: 800
  },
  infoRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 8,
    alignItems: 'flex-start'
  },
  infoKey: {
    fontSize: 12,
    fontWeight: 800,
    color: 'var(--primary)',
    minWidth: 120
  },
  infoVal: {
    fontSize: 12,
    color: 'var(--text-sub)',
    lineHeight: 1.5
  },
  splashWrap: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--bg-start), var(--bg-mid), var(--bg-end))', padding: 30, textAlign: 'center' },
  splashIcon: { fontSize: 80, marginBottom: 24, animation: 'pulseGlow 2.5s infinite' },
  splashTitle: { fontSize: 44, fontWeight: 900, fontFamily: 'Outfit, Nunito, sans-serif', background: 'linear-gradient(90deg, var(--primary), var(--secondary), #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.15, marginBottom: 12, letterSpacing: '-1px' },
  splashSub: { color: 'var(--text-sub)', fontSize: 18, fontWeight: 600, marginBottom: 44 },
  splashBtn: { background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', color: '#fff', padding: '16px 44px', borderRadius: 50, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 32px var(--accent-glow)', fontFamily: 'Outfit, Nunito, sans-serif', transition: 'var(--transition-smooth)' },
  navBar: { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '600px', background: 'var(--bg-container)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', display: 'flex', border: '1px solid var(--border-color)', borderRadius: '30px', zIndex: 200, boxShadow: '0 12px 40px var(--glass-shadow)', padding: '8px 12px', boxSizing: 'border-box' },
  navItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 4px', cursor: 'pointer', transition: 'var(--transition-smooth)', borderRadius: '20px' },
  navIcon: { fontSize: 22 },
  navLabel: { fontSize: 10, fontWeight: 800, marginTop: 4, letterSpacing: '0.2px' },

  // ── AUTH STYLES ──────────────────────────────────────────────────
  authWrap: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--bg-start) 0%, var(--bg-mid) 50%, var(--bg-end) 100%)', padding: '30px 20px' },
  authCard: { width: '100%', maxWidth: 400, background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card)', padding: '40px 32px', backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)', boxShadow: '0 16px 48px var(--glass-shadow)' },
  authTitle: { fontSize: 26, fontWeight: 900, fontFamily: 'Outfit, Nunito, sans-serif', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.5px' },
  authSub: { color: 'var(--text-sub)', fontSize: 14, fontWeight: 600, textAlign: 'center', marginBottom: 32 },
  authInput: { width: '100%', padding: '14px 18px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: 16, color: 'var(--text-main)', fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', marginBottom: 16, boxSizing: 'border-box', transition: 'var(--transition-smooth)' },
  authBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', borderRadius: 16, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Outfit, Nunito, sans-serif', marginTop: 4, transition: 'var(--transition-smooth)', boxShadow: '0 6px 20px var(--accent-glow)' },
  authLink: { color: 'var(--primary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', background: 'none', border: 'none', fontFamily: 'Inter, sans-serif' },
  authError: { background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, padding: '12px 16px', color: '#ef4444', fontSize: 13, fontWeight: 700, marginBottom: 16, textAlign: 'center' },
  authSuccess: { background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: '12px 16px', color: '#10b981', fontSize: 13, fontWeight: 700, marginBottom: 16, textAlign: 'center' }
};

// Append Google Fonts and Styles dynamically
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap');
    
    *:not(.resume-print-area):not(.resume-print-area *) {
      font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
    }
    
    h1:not(.resume-print-area *), h2:not(.resume-print-area *), h3:not(.resume-print-area *), h4:not(.resume-print-area *), .outfit-font:not(.resume-print-area *) {
      font-family: 'Outfit', sans-serif !important;
    }
    
    /* Premium Hover & Interactive Styles */
    div[style*="var(--card-bg)"] {
      transition: var(--transition-smooth) !important;
    }
    div[style*="var(--card-bg)"]:hover {
      transform: translateY(-4px) scale(1.01) !important;
      border-color: var(--primary) !important;
      box-shadow: 0 12px 35px var(--accent-glow) !important;
    }
    
    input:focus {
      border-color: var(--primary) !important;
      box-shadow: 0 0 15px var(--accent-glow) !important;
      background: rgba(255, 255, 255, 0.05) !important;
    }
    
    button:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    button:active {
      transform: translateY(1px);
    }
    
    /* Bottom Navigation Hover Pill effects */
    div[style*="fixed"][style*="bottom"] > div {
      transition: var(--transition-smooth) !important;
    }
    div[style*="fixed"][style*="bottom"] > div:hover {
      background: var(--accent-glow) !important;
      transform: scale(1.05);
    }
    
    .glass-card {
      background: var(--bg-container) !important;
      backdrop-filter: blur(25px);
      border: 1px solid var(--border-color) !important;
      box-shadow: 0 8px 32px var(--glass-shadow);
    }
  `;
  document.head.appendChild(styleTag);
}

// ─── REGISTER PAGE ───────────────────────────────────────────────
function RegisterPage({ onGoLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(''); setSuccess('');
    if (!name.trim()) { setError('Please enter your full name'); return; }
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password) { setError('Please enter a password'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // 2. Set displayName
      await updateProfile(userCredential.user, { displayName: name.trim() });
      // 3. Sync profile to database
      const res = await fetch(`${API}/auth/sync`, {
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
    } catch (e) {
      console.error("Registration error:", e);
      setError(e.message.replace('Firebase: ', '') || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={S.authWrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ ...S.authCard, animation: 'fadeUp 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}><div style={{ fontSize: 48 }}>🎓</div></div>
        <div style={S.authTitle}>Create Account</div>
        <div style={S.authSub}>Join CareerPath AI today</div>
        {error && <div style={S.authError}>⚠️ {error}</div>}
        {success && <div style={S.authSuccess}>{success}</div>}
        {!success ? (
          <>
            <input style={S.authInput} type="text" placeholder="👤  Full Name" value={name} onChange={e => setName(e.target.value)} />
            <input style={S.authInput} type="email" placeholder="📧  Email Address" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={S.authInput} type="password" placeholder="🔒  Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} />
            <input style={S.authInput} type="password" placeholder="🔒  Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            <button style={{ ...S.authBtn, opacity: loading ? 0.7 : 1 }} onClick={handleRegister} disabled={loading}>
              {loading ? '⏳ Creating account...' : '✅ Register'}
            </button>
          </>
        ) : (
          <button style={S.authBtn} onClick={onGoLogin}>🚀 Go to Login</button>
        )}
        {!success && (
          <div style={{ textAlign: 'center', marginTop: 18, color: '#a89fff', fontSize: 13 }}>
            Already have an account?{' '}
            <button style={S.authLink} onClick={onGoLogin}>Login here</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ──────────────────────────────────────────────────
function LoginPage({ onLogin, onForgot, onGoRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal & Toast States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleLogin = async () => {
    setError('');
    if (!email) { setError('Please enter your email'); return; }
    if (!password) { setError('Please enter your password'); return; }
    setLoading(true);
    try {
      // 1. Sign in via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // 2. Sync user profile with database
      const syncRes = await fetch(`${API}/auth/sync`, {
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
    } catch (e) {
      console.error("Login error:", e);
      setError(e.message.replace('Firebase: ', '') || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      // 1. Sign in via Google Provider popup
      const userCredential = await signInWithPopup(auth, googleProvider);
      // 2. Sync details to backend database
      const syncRes = await fetch(`${API}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userCredential.user.uid,
          name: userCredential.user.displayName || userCredential.user.email.split('@')[0],
          email: userCredential.user.email
        })
      });
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        onLogin(syncData.user);
      } else {
        onLogin({
          id: userCredential.user.uid,
          name: userCredential.user.displayName || userCredential.user.email.split('@')[0],
          email: userCredential.user.email
        });
      }
    } catch (e) {
      console.error("Google Sign-In error:", e);
      setError(e.message.replace('Firebase: ', '') || 'Google Sign-In failed');
    }
    setLoading(false);
  };

  const handleSendResetEmail = async () => {
    setForgotError('');
    const trimmedEmail = forgotEmail.trim();

    if (!trimmedEmail) {
      setForgotError('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);
    try {
      // Send official Firebase reset email
      await sendPasswordResetEmail(auth, trimmedEmail);
      
      // Successfully sent, close modal and clear states
      setShowForgotModal(false);
      setForgotEmail('');
      
      // Trigger success Toast
      setToast({
        show: true,
        message: 'Password reset link has been sent successfully. Please check your email inbox. If you don\'t see it, check your Spam/Junk folder.'
      });

      // Auto-dismiss toast in 8 seconds
      setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 8000);

    } catch (e) {
      console.error("Password reset error:", e);
      let userFriendlyError = 'An unexpected error occurred. Please try again.';
      if (e.code === 'auth/user-not-found') {
        userFriendlyError = 'This email address is not registered in our system.';
      } else if (e.code === 'auth/invalid-email') {
        userFriendlyError = 'Please enter a valid email address.';
      } else if (e.code === 'auth/too-many-requests') {
        userFriendlyError = 'Too many requests. Please try again later.';
      } else if (e.code === 'auth/network-request-failed') {
        userFriendlyError = 'Network error. Please check your internet connection and try again.';
      } else if (e.message) {
        userFriendlyError = e.message.replace('Firebase: ', '');
      }
      setForgotError(userFriendlyError);
    }
    setForgotLoading(false);
  };

  return (
    <div style={S.authWrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ ...S.authCard, animation: 'fadeUp 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}><div style={{ fontSize: 52 }}>🎓</div></div>
        <div style={S.authTitle}>CareerPath AI</div>
        <div style={S.authSub}>Sign in to explore your career path</div>
        {error && <div style={S.authError}>⚠️ {error}</div>}
        <input style={S.authInput} type="email" placeholder="📧  Email address" value={email}
          onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        <input style={S.authInput} type="password" placeholder="🔒  Password" value={password}
          onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        <div style={{ textAlign: 'right', marginBottom: 16, marginTop: -6 }}>
          <button style={S.authLink} onClick={() => setShowForgotModal(true)}>Forgot Password?</button>
        </div>
        <button style={{ ...S.authBtn, opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
          {loading ? '⏳ Signing in...' : '🚀 Login'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#a89fff' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ margin: '0 10px', fontSize: 12 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <button 
          style={{ 
            ...S.authBtn, 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid var(--border-color)', 
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
          }} 
          onClick={handleGoogleSignIn} 
          disabled={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18, height: 18 }} />
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', marginTop: 18, color: '#a89fff', fontSize: 13 }}>
          Don't have an account?{' '}
          <button style={S.authLink} onClick={onGoRegister}>Register here</button>
        </div>
      </div>

      {/* Forgot Password Responsive Modal Dialog */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeUp 0.3s ease'
        }}>
          <div style={{
            ...S.authCard,
            margin: '0 20px',
            position: 'relative',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
            border: '1px solid var(--border-color)',
            background: 'var(--card-bg)'
          }}>
            {/* Close Cross Button */}
            <button 
              onClick={() => {
                if (!forgotLoading) {
                  setShowForgotModal(false);
                  setForgotEmail('');
                  setForgotError('');
                }
              }}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                color: 'var(--text-sub)',
                fontSize: 20,
                cursor: 'pointer',
                padding: 4
              }}
              disabled={forgotLoading}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: 12 }}><div style={{ fontSize: 44 }}>🔑</div></div>
            <div style={S.authTitle}>Forgot Password</div>
            <div style={{ ...S.authSub, marginBottom: 24 }}>Enter your registered email address to receive a password reset link.</div>
            
            {forgotError && <div style={S.authError}>⚠️ {forgotError}</div>}
            
            <input 
              style={S.authInput} 
              type="email" 
              placeholder="📧  Your email address" 
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && !forgotLoading && handleSendResetEmail()}
              disabled={forgotLoading}
            />
            
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button 
                style={{
                  ...S.authBtn,
                  flex: 1,
                  marginTop: 0,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  boxShadow: 'none'
                }}
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotEmail('');
                  setForgotError('');
                }}
                disabled={forgotLoading}
              >
                Cancel
              </button>
              
              <button 
                style={{
                  ...S.authBtn,
                  flex: 2,
                  marginTop: 0,
                  opacity: forgotLoading ? 0.7 : 1
                }}
                onClick={handleSendResetEmail}
                disabled={forgotLoading}
              >
                {forgotLoading ? '⏳ Sending Link...' : '🚀 Send Reset Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast / Snackbar Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)',
          maxWidth: '450px',
          background: 'rgba(16, 185, 129, 0.95)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '16px 20px',
          color: '#fff',
          fontSize: '13px',
          fontWeight: '700',
          textAlign: 'center',
          zIndex: 1100,
          boxShadow: '0 12px 32px rgba(16, 185, 129, 0.3)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          animation: 'fadeUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{ textAlign: 'left', lineHeight: 1.4 }}>
            {toast.message}
          </div>
          <button 
            onClick={() => setToast({ show: false, message: '' })}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
              padding: '4px 8px',
              fontWeight: 'bold',
              opacity: 0.8
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

// ─── FORGOT PASSWORD PAGE ────────────────────────────────────────
function ForgotPasswordPage({ onBack }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async () => {
    setError(''); setSuccess('');
    if (!email) { setError('Please enter your email address'); return; }
    setLoading(true);
    try {
      // Send Firebase native password reset email
      await sendPasswordResetEmail(auth, email);
      setSuccess('✅ Password reset email sent! Please check your inbox for instructions.');
    } catch (e) {
      console.error("Password reset error:", e);
      setError(e.message.replace('Firebase: ', '') || 'Failed to send password reset email');
    }
    setLoading(false);
  };

  return (
    <div style={S.authWrap}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ ...S.authCard, animation: 'fadeUp 0.5s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}><div style={{ fontSize: 48 }}>🔑</div></div>
        <div style={S.authTitle}>Forgot Password</div>
        <div style={S.authSub}>Enter your registered email address to receive a password reset link.</div>
        {error && <div style={S.authError}>⚠️ {error}</div>}
        {success && <div style={S.authSuccess}>{success}</div>}
        {!success ? (
          <>
            <input style={S.authInput} type="email" placeholder="📧  Your email address" value={email}
              onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendResetEmail()} />
            <button style={S.authBtn} onClick={handleSendResetEmail} disabled={loading}>
              {loading ? '⏳ Sending Link...' : '🚀 Send Reset Link'}
            </button>
          </>
        ) : (
          <button style={S.authBtn} onClick={onBack}>🚀 Back to Login</button>
        )}
        {!success && (
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <button style={S.authLink} onClick={onBack}>← Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}



// ─── SPLASH ──────────────────────────────────────────────────────
function Splash({ onEnter }) {
  return (
    <div style={S.splashWrap}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}} @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={S.splashIcon}>🎓</div>
      <div style={{ ...S.splashTitle, animation: 'fadeUp 0.8s ease' }}>CareerPath AI</div>
      <div style={{ ...S.splashSub, animation: 'fadeUp 1s ease' }}>Your Dreams Begin With the Right Path</div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 50, animation: 'fadeUp 1.2s ease', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['🤖 AI Guidance', '📚 All Streams', '💰 Salary Info', '💼 Career Roles'].map(t => (
          <div key={t} style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 20, padding: '6px 14px', color: '#b0a8ff', fontSize: 13, fontWeight: 700 }}>{t}</div>
        ))}
      </div>
      <button style={{ ...S.splashBtn, animation: 'fadeUp 1.4s ease' }} onClick={onEnter}>🚀 Explore Careers</button>
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────
function Header({ title, onBack, showBack, isBookmarked, onToggleBookmarked, onOpenSettings, style }) {
  const [dark, setDark] = useState(true);

  const toggle = () => {
    // Light mode removed - lock to dark mode
  };

  useEffect(() => {
    const handleSync = (e) => {
      setDark(true);
    };
    window.addEventListener('cp-theme-sync', handleSync);
    return () => window.removeEventListener('cp-theme-sync', handleSync);
  }, []);

  return (
    <div style={{ ...S.header, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, overflow: 'hidden' }}>
        {showBack && <button style={{ ...S.backBtn, padding: '6px 12px' }} onClick={onBack}>← Back</button>}
        <div style={{ ...S.logo, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title || 'CareerPath AI 🎓'}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {onToggleBookmarked && (
          <button onClick={onToggleBookmarked} style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--border-color)', borderRadius: '50%', cursor: 'pointer', fontSize: 16, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isBookmarked ? '#f59e0b' : '#94a3b8', transition: 'all 0.2s', padding: 0 }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
            {isBookmarked ? '★' : '☆'}
          </button>
        )}
        {onOpenSettings && (
          <button onClick={onOpenSettings} style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid var(--border-color)', borderRadius: '50%', cursor: 'pointer', fontSize: 16, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-sub)', transition: 'all 0.2s', padding: 0 }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
            ⚙️
          </button>
        )}
      </div>
    </div>
  );
}

function BottomNav({ active, onNav, t }) {
  const items = [
    { id: 'home', icon: '🏠', label: t('home') },
    { id: 'education', icon: '🎓', label: t('education') || 'Education' },
    { id: 'aptitude', icon: '📝', label: t('aptitude') },
    { id: 'tech-learning', icon: '📚', label: t('techLearning') || 'Hub' },
    { id: 'ai-recommendation', icon: '🤖', label: t('ai') || 'AI' },
    { id: 'settings', icon: '👤', label: t('profileTab') || 'Profile' },
  ];
  return (
    <div style={{
      ...S.navBar,
      background: 'rgba(15, 23, 42, 0.50)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
    }}>
      {items.map(item => {
        const isActive = active === item.id ||
          (item.id === 'education' && (active === 'after10th' || active === 'after12th' || active === 'graduation'));
        return (
          <div
            key={item.id}
            style={{
              ...S.navItem,
              background: isActive ? 'var(--accent-glow)' : 'transparent',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isActive ? 'inset 0 0 8px rgba(99, 102, 241, 0.05)' : 'none'
            }}
            onClick={() => onNav(item.id)}
          >
            <div style={{ ...S.navIcon, transform: isActive ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s ease' }}>{item.icon}</div>
            <div style={{ ...S.navLabel, color: isActive ? 'var(--primary)' : 'var(--text-sub)' }}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── EDUCATION HUB PAGE ──────────────────────────────────────────
function EducationHubPage({ onNav, t, onOpenSettings }) {
  const pathways = [
    {
      id: 'after10th',
      icon: '🏫',
      title: t('after10th') || 'After 10th',
      sub: 'Explore options after 10th standard including streams (Science, Commerce, Arts) and vocational careers.'
    },
    {
      id: 'after12th',
      icon: '🏛️',
      title: t('after12th') || 'After 12th',
      sub: 'Choose your specialization after intermediate/12th (MPC, BiPC, MEC, CEC, Arts) and top professions.'
    },
    {
      id: 'graduation',
      icon: '🎓',
      title: t('graduation') || 'After Graduation',
      sub: 'Explore job roles, professional certifications, higher studies, and study abroad options.'
    }
  ];

  return (
    <div style={S.page}>
      <Header title={t('education') || 'Education Pathways'} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🎓</div>
        <div style={S.heroTitle}>{t('education') || 'Education Pathways'}</div>
        <div style={S.heroSub}>Choose your academic stage to discover curated career maps and courses</div>
      </div>

      <div style={{ ...S.grid, gridTemplateColumns: '1fr', maxWidth: 600, margin: '0 auto', padding: '0 20px' }}>
        {pathways.map(path => (
          <div
            key={path.id}
            style={{
              ...S.card,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '24px 20px',
              transition: 'var(--transition-smooth)'
            }}
            onClick={() => onNav(path.id)}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 12px 40px var(--accent-glow)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = '0 8px 30px var(--card-shadow)';
            }}
          >
            <div style={{ fontSize: 44 }}>{path.icon}</div>
            <div>
              <div style={{ ...S.cardTitle, fontSize: 18 }}>{path.title}</div>
              <div style={{ ...S.cardSub, fontSize: 13, marginTop: 4 }}>{path.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI RECOMMENDATION PAGE (GEMINI POWERED) ───────────────────────────
function AIRecommendationPage({ userId, target, onBack, onOpenSettings, t, savedCareers, onToggleSave }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('🤖 Connecting to AI Career Coach...');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading) return;
    const texts = [
      '🤖 Connecting to AI Career Coach...',
      '⚙️ Loading user parameters...',
      '🧠 Processing quiz choices...',
      '🔮 Querying Google Gemini 2.5 Flash...',
      '📚 Designing custom roadmap milestones...',
      '🔍 Performing skills gap analysis...',
      '📊 Crawling active job vacancy outlooks...',
      '✨ Formatting interactive dashboard...'
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setLoadingText(texts[idx]);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const loadRecommendation = async () => {
    if (!target) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/ai/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'anonymous',
          quizType: target.quizType,
          answers: target.answers
        })
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setData(resData.data);
      } else {
        setError(resData.error || 'Failed to fetch recommendation');
      }
    } catch (e) {
      setError('Network connection failed. Make sure the backend server is running and connected to MongoDB.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (target) {
      loadRecommendation();
    } else {
      setLoading(false);
    }
  }, [target]);

  if (!target) {
    return (
      <div style={{ ...S.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 20 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🤖</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
          {t('ai') || 'AI Career Recommendation'}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', textAlign: 'center', maxWidth: 400, marginTop: 8, lineHeight: 1.4 }}>
          You haven't generated a personalized AI roadmap yet. Please go to the Home screen and ask the AI Career Mentor, or take a quiz to get recommendations.
        </p>
        <button style={{ ...S.authBtn, width: 'auto', padding: '10px 20px', borderRadius: 12, marginTop: 20 }} onClick={onBack}>
          {t('back') || '← Go Back'}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ ...S.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 }}>
        <style>{`
          @keyframes spinGlow {
            0% { transform: rotate(0deg); box-shadow: 0 0 15px var(--primary); }
            50% { box-shadow: 0 0 30px var(--secondary); }
            100% { transform: rotate(360deg); box-shadow: 0 0 15px var(--primary); }
          }
        `}</style>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '4px solid var(--border-color)',
          borderTopColor: 'var(--primary)',
          animation: 'spinGlow 1.5s linear infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          marginBottom: 24,
          background: 'var(--card-bg)'
        }}>
          🤖
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
          {loadingText}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
          Please hold on, standard roadmaps can take 5-10 seconds to generate.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...S.page, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#f87171', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
          Roadmap Error
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-sub)', textAlign: 'center', maxWidth: 400, marginTop: 8, lineHeight: 1.4 }}>
          {error}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button style={{ ...S.backBtn, padding: '10px 20px', borderRadius: 12 }} onClick={onBack}>← Back to Home</button>
          <button style={{ ...S.authBtn, width: 'auto', padding: '10px 20px', borderRadius: 12 }} onClick={loadRecommendation}>🔄 Retry</button>
        </div>
      </div>
    );
  }

  const recId = `ai-rec-${target.quizType}-${JSON.stringify(target.answers)}`;
  const isBookmarked = savedCareers.some(item => item.careerId === recId);

  const handleToggleBookmark = () => {
    if (onToggleSave) {
      onToggleSave({
        id: recId,
        title: data.title,
        icon: '🤖',
        type: 'AI Recommendation',
        payload: {
          type: 'ai-recommendation',
          quizType: target.quizType,
          answers: target.answers
        }
      });
    }
  };

  return (
    <div style={S.page}>
      <Header
        title="AI Career Plan"
        showBack
        onBack={onBack}
        onOpenSettings={onOpenSettings}
        isBookmarked={isBookmarked}
        onToggleBookmarked={handleToggleBookmark}
      />
      <div style={{ ...S.heroBox, padding: '30px 20px 10px' }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>🤖</div>
        <div style={{ ...S.heroTitle, fontSize: 24, padding: '0 10px' }}>{data.title}</div>
        <div style={{ ...S.heroSub, fontSize: 13, color: 'var(--text-sub)', maxWidth: 600, margin: '8px auto 0', lineHeight: 1.5 }}>
          {data.description}
        </div>
      </div>

      <div style={{ padding: '0 16px 80px', maxWidth: 650, margin: '0 auto' }}>
        {/* Salary Scale */}
        <div style={S.detailBox}>
          <div style={S.label}>💰 Estimated Salary Scale</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#4ade80', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>💵</span> {data.salary}
          </div>
        </div>

        {/* Milestones / Roadmaps */}
        <div style={S.sectionTitle}>🗺️ Step-by-Step Roadmap</div>
        <div style={{ position: 'relative', paddingLeft: 24, marginLeft: 12, borderLeft: '2px dashed var(--border-color)', marginTop: 12 }}>
          {data.milestones && data.milestones.map((m, idx) => (
            <div key={idx} style={{ position: 'relative', marginBottom: 24 }}>
              {/* Timeline circle node */}
              <div style={{
                position: 'absolute',
                left: -33,
                top: 2,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                border: '3px solid var(--bg-mid)',
                boxShadow: '0 0 10px var(--accent-glow)'
              }} />
              <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 16,
                padding: 16,
                boxShadow: '0 4px 15px var(--card-shadow)',
                backdropFilter: 'blur(8px)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, background: 'var(--accent-glow)', color: 'var(--primary)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '3px 8px' }}>
                    STEP {m.step || (idx + 1)}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--secondary)' }}>⏱️ {m.duration}</span>
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>{m.title}</h4>
                <p style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 4, lineHeight: 1.4 }}>{m.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Acquired */}
        <div style={S.sectionTitle}>🛠️ Skills You Will Acquire</div>
        <div style={{ ...S.detailBox, padding: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.skillsAcquired && data.skillsAcquired.map((s, idx) => (
              <span key={idx} style={{ ...S.pill, margin: 0, padding: '5px 12px', fontSize: 12 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Skills Gap Analysis */}
        <div style={S.sectionTitle}>🎯 Skills Gap Analysis</div>
        {data.skillsGaps && data.skillsGaps.map((g, idx) => (
          <div key={idx} style={{ ...S.detailBox, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ fontSize: 13, fontWeight: 900, color: 'var(--text-main)', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                🔍 {g.skill}
              </h4>
              <span style={{
                fontSize: 10,
                fontWeight: 900,
                borderRadius: 8,
                padding: '2px 8px',
                background: g.importance && g.importance.toLowerCase() === 'high' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: g.importance && g.importance.toLowerCase() === 'high' ? '#f87171' : '#fbbf24',
                border: g.importance && g.importance.toLowerCase() === 'high' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                {g.importance.toUpperCase()} GAP
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.4, margin: 0 }}>
              <strong>Why it matters:</strong> {g.actionPlan ? g.actionPlan.split('.')[0] + '.' : 'Required for core market entries.'}
            </p>
            <div style={{
              marginTop: 10,
              padding: '8px 12px',
              background: 'var(--accent-glow)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--text-main)',
              lineHeight: 1.3
            }}>
              <strong>💡 Action Plan:</strong> {g.actionPlan}
            </div>
          </div>
        ))}

        {/* Market Demand */}
        {data.marketDemand && (
          <>
            <div style={S.sectionTitle}>📈 Job Market Outlook</div>
            <div style={{ ...S.detailBox, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 14 }}>
              <div style={{ background: 'var(--accent-glow)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)' }}>GROWTH RATE</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', marginTop: 4 }}>{data.marketDemand.growthRate}</div>
              </div>
              <div style={{ background: 'var(--accent-glow)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)' }}>VACANCIES VOLUME</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', marginTop: 4 }}>{data.marketDemand.activeVacancies}</div>
              </div>
              <div style={{ gridColumn: 'span 2', background: 'var(--accent-glow)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 10, fontSize: 12, color: 'var(--text-sub)', textAlign: 'center', lineHeight: 1.4 }}>
                <strong>Outlook:</strong> {data.marketDemand.outlook}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── FLOW 1 SUGGESTIONS AFTER 10TH PAGE ───────────────────────────
function SuggestionsAfter10thPage({ selection, onBack, onOpenSettings }) {
  const data = quizData.after10thSuggestions[selection] || quizData.after10thSuggestions['math-physics'];
  return (
    <div style={S.page}>
      <Header title={data.title} showBack onBack={onBack} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ fontSize: 58, marginBottom: 8 }}>{data.icon}</div>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>{data.title}</div>
        <div style={S.heroSub}>{data.description}</div>
      </div>

      <div style={{ padding: '0 16px 80px' }}>
        <div style={S.sectionTitle}>🎯 Recommended Career Paths</div>
        {data.paths.map((p, idx) => (
          <div key={idx} style={S.detailBox}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--primary)', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
              {p.name}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.4, marginBottom: 12 }}>
              {p.details}
            </p>

            <div style={S.salaryBox}>
              <div style={S.label}>💰 EXPECTED SALARY</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#6dffa0', marginTop: 4 }}>{p.salary}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={S.label}>🛠️ KEY SKILLS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {p.skills.map((s, sIdx) => (
                  <span key={sIdx} style={S.pill}>{s}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={S.label}>🔮 FUTURE SCOPE</div>
              <p style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 4, lineHeight: 1.4 }}>{p.futureScope}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FLOW 2 JOBS AFTER 10TH PAGE ──────────────────────────────────
function JobsAfter10thPage({ onBack, onOpenSettings }) {
  const jobs = quizData.after10thJobs;
  return (
    <div style={S.page}>
      <Header title="Jobs After 10th" showBack onBack={onBack} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ fontSize: 58, marginBottom: 8 }}>💼</div>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>Direct Jobs After 10th</div>
        <div style={S.heroSub}>Explore railway, army, police constable, and other private/public sector opportunities directly available after SSC.</div>
      </div>

      <div style={{ padding: '0 16px 80px' }}>
        <div style={S.sectionTitle}>📋 Central & Private Jobs ({jobs.length} Opportunities)</div>
        {jobs.map((j, idx) => (
          <div key={idx} style={S.detailBox}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--primary)', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
              {j.title}
            </h3>

            <div style={{ marginBottom: 10 }}>
              <div style={S.label}>🎓 ELIGIBILITY</div>
              <div style={{ fontSize: 12, color: 'var(--text-main)', fontWeight: 600, marginTop: 4 }}>{j.eligibility}</div>
            </div>

            <div style={S.salaryBox}>
              <div style={S.label}>💰 SALARY SCALE</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#6dffa0', marginTop: 4 }}>{j.salary}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={S.label}>🧠 SKILLS REQUIRED</div>
              <div style={{ fontSize: 12, color: 'var(--text-main)', marginTop: 4 }}>
                {Array.isArray(j.skillsRequired) ? j.skillsRequired.join(', ') : j.skillsRequired}
              </div>
            </div>

            <div>
              <div style={S.label}>📈 GROWTH OPPORTUNITIES</div>
              <p style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 4, lineHeight: 1.4 }}>{j.growth}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FLOW 3 SUGGESTIONS AFTER 12TH PAGE ───────────────────────────
function SuggestionsAfter12thPage({ selection, onBack, onOpenSettings }) {
  const data = quizData.after12thSuggestions[selection] || quizData.after12thSuggestions['mpc'];
  return (
    <div style={S.page}>
      <Header title={data.title} showBack onBack={onBack} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ fontSize: 58, marginBottom: 8 }}>{data.icon}</div>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>{data.title}</div>
        <div style={S.heroSub}>{data.description}</div>
      </div>

      <div style={{ padding: '0 16px 80px' }}>
        <div style={S.sectionTitle}>📚 Core Courses & Career Scopes</div>
        {data.courses.map((c, idx) => (
          <div key={idx} style={S.detailBox}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--primary)', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
              {c.name}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.4, marginBottom: 12 }}>
              {c.details}
            </p>

            <div style={S.salaryBox}>
              <div style={S.label}>💰 EXPECTED SALARY</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#6dffa0', marginTop: 4 }}>{c.salary}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={S.label}>🛠️ REQUIRED SKILLS</div>
              <div style={{ fontSize: 12, color: 'var(--text-main)', marginTop: 4 }}>
                {Array.isArray(c.skills) ? c.skills.join(', ') : c.skills}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={S.label}>🏫 TOP COLLEGES</div>
              <div style={{ fontSize: 12, color: '#ffd166', fontWeight: 600, marginTop: 4 }}>{c.colleges}</div>
            </div>

            <div>
              <div style={S.label}>🔮 FUTURE SCOPE</div>
              <p style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 4, lineHeight: 1.4 }}>{c.scope}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FLOW 4 JOBS AFTER 12TH PAGE ──────────────────────────────────
function JobsAfter12thPage({ onBack, onOpenSettings }) {
  const jobs = quizData.after12thJobs;
  return (
    <div style={S.page}>
      <Header title="Jobs After 12th" showBack onBack={onBack} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ fontSize: 58, marginBottom: 8 }}>🪖</div>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>Direct Jobs After 12th</div>
        <div style={S.heroSub}>Find Central/State secretariat posts, banking clerks, defence airmen, and digital specialists straight after Intermediate.</div>
      </div>

      <div style={{ padding: '0 16px 80px' }}>
        <div style={S.sectionTitle}>📋 Central & State Job Board ({jobs.length} Positions)</div>
        {jobs.map((j, idx) => (
          <div key={idx} style={S.detailBox}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--primary)', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
              {j.title}
            </h3>

            <div style={{ marginBottom: 10 }}>
              <div style={S.label}>🎓 ELIGIBILITY</div>
              <div style={{ fontSize: 12, color: 'var(--text-main)', fontWeight: 600, marginTop: 4 }}>{j.eligibility}</div>
            </div>

            <div style={S.salaryBox}>
              <div style={S.label}>💰 SALARY SCALE</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#6dffa0', marginTop: 4 }}>{j.salary}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={S.label}>🧠 SKILLS REQUIRED</div>
              <div style={{ fontSize: 12, color: 'var(--text-main)', marginTop: 4 }}>
                {Array.isArray(j.skillsRequired) ? j.skillsRequired.join(', ') : j.skillsRequired}
              </div>
            </div>

            <div>
              <div style={S.label}>📈 CAREER GROWTH</div>
              <p style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 4, lineHeight: 1.4 }}>{j.growth}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────
// ─── SVG ILLUSTRATIONS ───────────────────────────────────────────
const HeroIllustration = () => (
  <svg viewBox="0 0 200 200" className="float-slow" style={{ width: '100%', maxHeight: '160px', pointerEvents: 'none' }}>
    <defs>
      <linearGradient id="grad-hero" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.85" />
        <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.85" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="55" fill="url(#grad-hero)" opacity="0.15" filter="blur(8px)" />
    <path d="M 50,110 L 95,130 L 150,105 L 105,85 Z" fill="none" stroke="var(--primary)" strokeWidth="3" />
    <path d="M 50,120 L 95,140 L 150,115 L 105,95 Z" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeDasharray="3 3" />
    <polygon points="100,50 145,65 100,80 55,65" fill="url(#grad-hero)" />
    <polygon points="80,72 80,95 100,105 120,95 120,72" fill="none" stroke="var(--text-main)" strokeWidth="2.5" />
    <path d="M 145,65 L 145,88 Q 145,92 142,92" fill="none" stroke="var(--secondary)" strokeWidth="2.5" />
    <circle cx="142" cy="92" r="3" fill="var(--secondary)" />
    <circle cx="40" cy="70" r="4.5" fill="var(--primary)" className="float-element" />
    <circle cx="160" cy="65" r="5.5" fill="var(--secondary)" />
    <circle cx="135" cy="140" r="3.5" fill="var(--primary)" />
    <line x1="100" y1="80" x2="135" y2="140" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="2 2" />
    <line x1="100" y1="50" x2="40" y2="70" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

const MentorIllustration = () => (
  <svg viewBox="0 0 100 100" className="float-element" style={{ width: '64px', height: '64px', minWidth: '64px', pointerEvents: 'none' }}>
    <defs>
      <linearGradient id="grad-ai" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary)" />
        <stop offset="100%" stopColor="var(--secondary)" />
      </linearGradient>
    </defs>
    <rect x="25" y="30" width="50" height="40" rx="12" fill="none" stroke="url(#grad-ai)" strokeWidth="3" />
    <line x1="38" y1="70" x2="38" y2="78" stroke="url(#grad-ai)" strokeWidth="3" />
    <line x1="62" y1="70" x2="62" y2="78" stroke="url(#grad-ai)" strokeWidth="3" />
    <line x1="30" y1="78" x2="70" y2="78" stroke="url(#grad-ai)" strokeWidth="3" strokeLinecap="round" />
    <rect x="17" y="42" width="8" height="16" rx="3.5" fill="var(--primary)" />
    <rect x="75" y="42" width="8" height="16" rx="3.5" fill="var(--primary)" />
    <circle cx="40" cy="50" r="4.5" fill="var(--text-main)" />
    <circle cx="40" cy="50" r="2" fill="var(--primary)" />
    <circle cx="60" cy="50" r="4.5" fill="var(--text-main)" />
    <circle cx="60" cy="50" r="2" fill="var(--primary)" />
    <line x1="50" y1="30" x2="50" y2="18" stroke="url(#grad-ai)" strokeWidth="3" />
    <circle cx="50" cy="15" r="5" fill="url(#grad-ai)" />
  </svg>
);

const ResumeIllustration = () => (
  <svg viewBox="0 0 100 100" style={{ width: '64px', height: '64px', minWidth: '64px', pointerEvents: 'none' }}>
    <rect x="22" y="14" width="56" height="72" rx="8" fill="none" stroke="var(--primary)" strokeWidth="3" />
    <line x1="32" y1="28" x2="52" y2="28" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
    <line x1="32" y1="40" x2="68" y2="40" stroke="var(--text-sub)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="32" y1="50" x2="68" y2="50" stroke="var(--text-sub)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="32" y1="60" x2="58" y2="60" stroke="var(--text-sub)" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="64" cy="28" r="5" fill="none" stroke="var(--secondary)" strokeWidth="2" />
    <g transform="translate(64, 58) rotate(45)">
      <path d="M 0,0 L 4,-12 L 8,0 Z" fill="var(--secondary)" />
      <rect x="1.5" y="0" width="5" height="16" rx="1" fill="var(--secondary)" />
    </g>
  </svg>
);

const AptitudeIllustration = () => (
  <svg viewBox="0 0 100 100" style={{ width: '64px', height: '64px', minWidth: '64px', pointerEvents: 'none' }}>
    <circle cx="50" cy="50" r="32" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="4 4" />
    <circle cx="50" cy="50" r="14" fill="none" stroke="var(--secondary)" strokeWidth="3.5" />
    <path d="M 50,30 L 50,34 M 50,66 L 50,70 M 30,50 L 34,50 M 66,50 L 70,50 M 36,36 L 39,39 M 61,61 L 64,64 M 36,61 L 39,59 M 61,36 L 64,39" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" />
    <path d="M 44,50 L 48,54 L 56,45" fill="none" stroke="var(--text-main)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LearningIllustration = () => (
  <svg viewBox="0 0 100 100" style={{ width: '64px', height: '64px', minWidth: '64px', pointerEvents: 'none' }}>
    <rect x="20" y="30" width="60" height="44" rx="8" fill="none" stroke="var(--primary)" strokeWidth="3" />
    <rect x="30" y="22" width="40" height="8" rx="2" fill="none" stroke="var(--secondary)" strokeWidth="2.5" />
    <path d="M 38,48 Q 33,52 38,56 M 62,48 Q 67,52 62,56" fill="none" stroke="var(--text-main)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="52" y1="46" x2="48" y2="58" stroke="var(--secondary)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const MotivationIllustration = () => (
  <svg viewBox="0 0 100 100" style={{ width: '64px', height: '64px', minWidth: '64px', pointerEvents: 'none' }}>
    <circle cx="50" cy="50" r="18" fill="none" stroke="var(--primary)" strokeWidth="3" />
    <path d="M 50,12 L 50,22 M 50,78 L 50,88 M 12,50 L 22,50 M 78,50 L 88,50" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M 23,23 L 30,30 M 70,70 L 77,77 M 23,77 L 30,70 M 70,23 L 77,30" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" />
    <polygon points="50,40 52,47 59,49 52,51 50,58 48,51 41,49 48,47" fill="var(--text-main)" />
  </svg>
);

// ─── HOME PAGE ───────────────────────────────────────────────────
function HomePage({ onNav, onSelectTrending, t, lang, soundEnabled, user, onTriggerChatPrompt, darkMode }) {
  const [trending, setTrending] = useState([]);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { text: "Your talent determines what you can do. Your motivation determines how much you are willing to do.", author: "Lou Holtz" },
    { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
    { text: "Do not wait; the time will never be 'just right.' Start where you stand.", author: "Napoleon Hill" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" }
  ];

  useEffect(() => {
    const fetchTrending = () => {
      fetch(`${API}/overview`)
        .then(r => r.json())
        .then(d => setTrending(d.trending || []))
        .catch(() => { });
    };

    fetchTrending();
    const interval = setInterval(fetchTrending, 30000); // Auto-update every 30 seconds
    setQuoteIdx(Math.floor(Math.random() * quotes.length));

    return () => clearInterval(interval);
  }, []);

  const shuffleQuote = (e) => {
    e.stopPropagation();
    setQuoteIdx(prev => (prev + 1) % quotes.length);
    if (typeof playClickSound === 'function') {
      playClickSound(soundEnabled);
    }
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    const name = user && user.name ? user.name.split(' ')[0] : '';
    const greetWord = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    return name ? `${greetWord}, ${name}! 👋` : `${greetWord}! 👋`;
  };

  const homeBgWrapperStyle = {
    minHeight: '100vh',
    padding: '0 0 120px 0',
    color: 'var(--text-main)',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    transition: 'var(--transition-smooth)',
    position: 'relative',
    zIndex: 1
  };

  return (
    <div style={homeBgWrapperStyle} className="fade-in-section">

      <Header
        title={t('appName')}
        onOpenSettings={() => onNav('settings')}
        style={{
          background: 'transparent',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none'
        }}
      />

      <div className="bento-grid">
        {/* HERO CARD (span-12) */}
        <div className="bento-card span-12 premium-glass-card" style={{ minHeight: '260px', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="text-gradient" style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>
              {getGreeting()}
            </h1>
            <p style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: 600, lineHeight: 1.5, textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              Ready to construct your future path? Explore curated roadmaps, test strategies, and utilize Gemini-powered AI guidance.
            </p>
            {/* Embedded Search bar */}
            <div
              onClick={() => onNav('search')}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50px',
                padding: '12px 18px',
                marginTop: '20px',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '420px',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.25s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#8B5CF6';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ marginRight: '10px', fontSize: '18px' }}>🔍</span>
              <span style={{ color: '#fff', opacity: 0.8, fontSize: '14px', fontWeight: '500' }}>Search careers, jobs, courses...</span>
            </div>
          </div>
          <div style={{ flex: '0 0 180px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeroIllustration />
          </div>
        </div>

        {/* AI CAREER MENTOR CARD (span-8) */}
        <div className="bento-card span-8 premium-glass-card" style={{ minHeight: '250px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', padding: '3px 8px', fontSize: '10px', fontWeight: 900, color: '#8B5CF6' }}>GEMINI POWERED</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>AI Career Mentor</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '13px', marginTop: '6px', lineHeight: 1.5 }}>
                Chat with our AI mentor, ask questions about university requirements, prepare for exams, or execute quick roadmap lookups.
              </p>

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { text: '🗺️ Draw software engineer roadmap', val: 'Draft a complete roadmap to become a Software Engineer.' },
                  { text: '🤝 Give me mock coding interview questions', val: 'Give me 3 mock coding interview questions with model answers.' },
                  { text: '📝 Explain how to structure a strong resume', val: 'Tell me the essential layout parts and strategies to structure a strong resume.' }
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => onTriggerChatPrompt(prompt.val)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-main)',
                      padding: '8px 14px',
                      borderRadius: '14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; }}
                  >
                    <span>{prompt.text}</span>
                    <span style={{ color: '#8B5CF6', fontWeight: 'bold', marginLeft: '6px' }}>→</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto 0' }}>
              <MentorIllustration />
            </div>
          </div>
        </div>

        {/* RESUME BUILDER CARD (span-4) */}
        <div
          className="bento-card span-4 premium-glass-card"
          onClick={() => onNav('resume-builder')}
          style={{ minHeight: '250px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <ResumeIllustration />
            <span style={{ fontSize: '20px', color: '#D946EF' }}>↗</span>
          </div>
          <div style={{ marginTop: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>Resume Builder</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '12px', marginTop: '6px', lineHeight: 1.5 }}>
              Design a professional CV using interactive fields, match it to Cosmic or Neon styles, and download clean, print-ready PDF configurations.
            </p>
          </div>
          <button
            className="premium-btn"
            style={{ width: '100%', padding: '10px', fontSize: '12px', marginTop: '14px', background: 'linear-gradient(135deg, #8B5CF6, #D946EF)' }}
            onClick={(e) => { e.stopPropagation(); onNav('resume-builder'); }}
          >
            Create Resume →
          </button>
        </div>

        {/* EDUCATION STAGE SELECTORS (After 10th, After 12th, Graduation) */}
        <div className="bento-card span-4 premium-glass-card" onClick={() => onNav('after10th')} style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: '40px', marginBottom: '14px' }}>🏫</div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{t('after10th')}</h4>
            <p style={{ color: 'var(--text-sub)', fontSize: '12px', marginTop: '6px', lineHeight: 1.4 }}>
              Explore ITI trades, polytechnic diplomas, subject streams, and direct recruitment jobs straight after 10th grade.
            </p>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 800, color: '#D946EF' }}>
            Explore 10th Paths →
          </div>
        </div>

        <div className="bento-card span-4 premium-glass-card" onClick={() => onNav('after12th')} style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: '40px', marginBottom: '14px' }}>🏛️</div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{t('after12th')}</h4>
            <p style={{ color: 'var(--text-sub)', fontSize: '12px', marginTop: '6px', lineHeight: 1.4 }}>
              Compare MPC, BiPC, CEC, MEC, and Arts, find college requirements, and explore intermediate-level job posts.
            </p>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 800, color: '#D946EF' }}>
            Explore 12th Paths →
          </div>
        </div>

        <div className="bento-card span-4 premium-glass-card" onClick={() => onNav('graduation')} style={{ cursor: 'pointer' }}>
          <div style={{ fontSize: '40px', marginBottom: '14px' }}>🎓</div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{t('graduation')}</h4>
            <p style={{ color: 'var(--text-sub)', fontSize: '12px', marginTop: '6px', lineHeight: 1.4 }}>
              Review post-graduate course roadmaps, study abroad guides, and placement vacancies after college.
            </p>
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 800, color: '#D946EF' }}>
            Explore Graduation Paths →
          </div>
        </div>

        {/* DAILY MOTIVATION CARD (span-4) */}
        <div className="bento-card span-4 premium-glass-card" style={{ minHeight: '230px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '12px' }}>
            <MotivationIllustration />
            <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(251, 191, 36, 0.12)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '12px', padding: '3px 8px', color: '#fbbf24' }}>
              🔥 STREAK: 4 DAYS
            </span>
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-main)', fontSize: '13px', fontStyle: 'italic', fontWeight: '600', lineHeight: 1.4 }}>
              "{quotes[quoteIdx].text}"
            </p>
            <span style={{ color: '#8B5CF6', fontSize: '11px', fontWeight: 800, marginTop: '6px', alignSelf: 'flex-end' }}>
              — {quotes[quoteIdx].author}
            </span>
          </div>
          <button
            onClick={shuffleQuote}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-sub)',
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '12px',
              transition: 'all 0.2s',
              alignSelf: 'flex-start'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-sub)'; }}
          >
            🔄 Next Quote
          </button>
        </div>

        {/* APTITUDE PRACTICE CARD (span-4) */}
        <div
          className="bento-card span-4 premium-glass-card"
          onClick={() => onNav('aptitude')}
          style={{ minHeight: '230px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <AptitudeIllustration />
            <span style={{ fontSize: '20px', color: '#8B5CF6' }}>↗</span>
          </div>
          <div style={{ marginTop: '12px', flexGrow: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>Aptitude Practice</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '12px', marginTop: '6px', lineHeight: 1.4 }}>
              LCM/GCD, ratio methods, percentage fractions, and solved practice questions for entrance exam hacks.
            </p>
            <div style={{
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '10px',
              color: '#8B5CF6',
              fontFamily: 'monospace',
              marginTop: '10px'
            }}>
              Rate = Work / Time
            </div>
          </div>
        </div>

        {/* CONTINUE LEARNING CARD (span-4) */}
        <div
          className="bento-card span-4 premium-glass-card"
          onClick={() => onNav('tech-learning')}
          style={{ minHeight: '230px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <LearningIllustration />
            <span style={{ fontSize: '20px', color: '#8B5CF6' }}>↗</span>
          </div>
          <div style={{ marginTop: '12px', flexGrow: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{t('techLearning') || 'Learning Hub'}</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '12px', marginTop: '6px', lineHeight: 1.4 }}>
              Pick up where you left off. Access official documentation for Python, JavaScript, and 53+ languages.
            </p>

            <div style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-sub)', marginBottom: '4px', fontWeight: 700 }}>
                <span>🐍 Python documentation</span>
                <span>65%</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.06)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg, #8B5CF6, #D946EF)', width: '65%', height: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* MEMORY MATRIX GAME CARD (span-4) */}
        <div
          className="bento-card span-4 premium-glass-card"
          onClick={() => onNav('memory-matrix')}
          style={{ minHeight: '230px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '36px' }}>🧠</div>
            <span style={{ fontSize: '20px', color: '#8B5CF6' }}>↗</span>
          </div>
          <div style={{ marginTop: '12px', flexGrow: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>Memory Matrix</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '12px', marginTop: '6px', lineHeight: 1.4 }}>
              Train your spatial recall by remembering patterns of glowing matrix tiles. Supports daily rewards & stats tracking!
            </p>
            <div style={{
              background: 'rgba(139, 92, 246, 0.06)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '10px',
              color: '#8B5CF6',
              fontFamily: 'monospace',
              marginTop: '10px',
              textAlign: 'center'
            }}>
              🪙 Earn +50 Career Coins Daily
            </div>
          </div>
        </div>

        {/* ARITHMETIC RAIN GAME CARD (span-4) */}
        <div
          className="bento-card span-4 premium-glass-card"
          onClick={() => onNav('arithmetic-rain')}
          style={{ minHeight: '230px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '36px' }}>🌧️</div>
            <span style={{ fontSize: '20px', color: '#8B5CF6' }}>↗</span>
          </div>
          <div style={{ marginTop: '12px', flexGrow: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>Arithmetic Rain</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: '12px', marginTop: '6px', lineHeight: 1.4 }}>
              Solve falling math equations before they hit the ground. Test your mental arithmetic across 5 exciting modes!
            </p>
            <div style={{
              background: 'rgba(139, 92, 246, 0.06)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '10px',
              color: '#8B5CF6',
              fontFamily: 'monospace',
              marginTop: '10px',
              textAlign: 'center'
            }}>
              🪙 Earn double Career Coins in Daily Challenge
            </div>
          </div>
        </div>


        {/* TRENDING CAREERS (span-12) */}
        {trending.length > 0 && (
          <div className="bento-card span-12 premium-glass-card" style={{ minHeight: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{t('trendingTitle')}</h3>
                <p style={{ color: 'var(--text-sub)', fontSize: '13px', marginTop: '2px' }}>High-growth tracks with strong future demand</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', width: '100%' }}>
              {trending.slice(0, 10).map(tVal => (
                <div
                  key={tVal.title}
                  onClick={() => onSelectTrending(tVal)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '18px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '130px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#8B5CF6';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(139, 92, 246, 0.25)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '28px' }}>{tVal.icon}</span>
                    <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 800, background: 'var(--accent-glow)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '12px' }}>
                      🔥 {tVal.growth}
                    </span>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{tVal.title}</div>
                    <div style={{ fontSize: 11, color: '#34d399', fontWeight: 700, marginTop: '4px' }}>{tVal.salary}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UPCOMING EXAMS (span-12) */}
        <div className="span-12" style={{ padding: 0 }}>
          <ExamCalendar t={t} lang={lang} soundEnabled={soundEnabled} />
        </div>

        {/* WHY CAREERPATH AI */}
        <div className="bento-card span-12" style={{ border: 'none', background: 'none', boxShadow: 'none', padding: '10px 0 0 0' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit', marginBottom: '14px', textAlign: 'center' }}>{t('whyTitle')}</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', width: '100%' }}>
            {[
              { icon: '🧠', title: 'AI Recommendations', sub: 'Receive custom career roadmaps generated by Google Gemini.' },
              { icon: '💰', title: 'Salary Scale Guides', sub: 'Review live fresher and senior salary statistics for positions.' },
              { icon: '📋', title: 'Entrance Exams Countdown', sub: 'Monitor upcoming dates and test guides for JEE, NEET, and CAT.' },
              { icon: '🏆', title: 'Top Tier Colleges', sub: 'Inspect leading institutions and universities inside target domains.' },
              { icon: '⚙️', title: 'Tool & Skill Mappings', sub: 'Know exactly what software, certifications, and languages to learn.' },
              { icon: '⚖️', title: 'Compare Options', sub: 'Add multiple careers into a layout to review details side-by-side.' }
            ].map(f => (
              <div
                key={f.title}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '20px 18px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.25s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#8B5CF6';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{f.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: 6, lineHeight: 1.4 }}>{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AFTER 10TH ──────────────────────────────────────────────────
function After10thPage({ onBack, initialTarget, clearTarget, t, savedCareers = [], onToggleSave, onAddToCompare, onOpenSettings }) {
  const [tab, setTab] = useState('streams');
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetail, setCourseDetail] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobCat10, setJobCat10] = useState('All');

  useEffect(() => {
    fetch(`${API}/after10th/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => { });
    fetch(`${API}/after10th/jobs`)
      .then(r => r.json())
      .then(setJobs)
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (initialTarget && initialTarget.type === 'after10th') {
      if (initialTarget.tab) {
        setTab(initialTarget.tab);
      }
      if (initialTarget.categoryId === 'intermediate' && initialTarget.courseId) {
        fetch(`${API}/after10th/categories`)
          .then(r => r.json())
          .then(cats => {
            const cat = cats.find(c => c.id === 'intermediate');
            if (cat) {
              setSelectedCategory(cat);
              setLoadingCourses(true);
              fetch(`${API}/after10th/categories/intermediate/courses`)
                .then(r => r.json())
                .then(coursesList => {
                  const course = coursesList.find(c => c.id === initialTarget.courseId);
                  if (course) {
                    setSelectedCourse(course);
                    setLoadingDetails(true);
                    fetch(`${API}/after10th/courses/${course.id}`)
                      .then(r => r.json())
                      .then(detail => {
                        setCourseDetail(detail);
                        setLoadingDetails(false);
                      })
                      .catch(() => setLoadingDetails(false));
                  }
                  setLoadingCourses(false);
                })
                .catch(() => setLoadingCourses(false));
            }
          });
      } else if (initialTarget.categoryId && !initialTarget.courseId) {
        fetch(`${API}/after10th/categories`)
          .then(r => r.json())
          .then(cats => {
            const cat = cats.find(c => c.id === initialTarget.categoryId);
            if (cat) handleCategoryClick(cat);
          });
      }
      clearTarget();
    }
  }, [initialTarget]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setLoadingCourses(true);
    fetch(`${API}/after10th/categories/${category.id}/courses`)
      .then(r => r.json())
      .then(data => {
        setCourses(data);
        setLoadingCourses(false);
      })
      .catch(() => setLoadingCourses(false));
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setLoadingDetails(true);
    fetch(`${API}/after10th/courses/${course.id}`)
      .then(r => r.json())
      .then(data => {
        setCourseDetail(data);
        setLoadingDetails(false);
      })
      .catch(() => setLoadingDetails(false));
  };

  const handleBack = () => {
    if (selectedJob) {
      setSelectedJob(null);
    } else if (selectedCourse) {
      setSelectedCourse(null);
      setCourseDetail(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setCourses([]);
    } else {
      onBack();
    }
  };

  if (selectedJob) {
    return <JobDetail job={selectedJob} onBack={handleBack} t={t} savedCareers={savedCareers} onToggleSave={onToggleSave} onAddToCompare={onAddToCompare} />;
  }

  if (selectedCourse) {
    const roadmapSteps = [
      { title: "Build the Basics", subtitle: "First, master your foundation", desc: courseDetail ? `Dive into the core curriculum of this program: ${courseDetail.description}` : "You'll start by learning the foundational subjects and concepts of this stream." },
      { title: "Learn the Craft", subtitle: "Acquire high-demand skills", desc: courseDetail && courseDetail.skillsRequired && courseDetail.skillsRequired.length > 0 ? `Focus on building key practical capabilities: ${courseDetail.skillsRequired.join(', ')}. Practice these daily to gain competence.` : "Focus on learning the essential practical capabilities and tools in this area." },
      { title: "Get Hands-On", subtitle: "Practice through real projects", desc: "Put your knowledge into action! Work on projects, complete practical assignments, and participate in lab tasks to see how everything works." },
      { title: "Level Up", subtitle: "Explore higher learning paths", desc: courseDetail && courseDetail.higherStudies && courseDetail.higherStudies.length > 0 ? `Open up advanced opportunities by pursuing qualifications like: ${courseDetail.higherStudies.slice(0, 3).join(', ')}.` : "Explore advanced studies or specialization paths to elevate your career." },
      { title: "Step Into the World", subtitle: "Launch your professional career", desc: courseDetail && courseDetail.careerOpportunities && courseDetail.careerOpportunities.length > 0 ? `Start your placement preparation for target roles: ${courseDetail.careerOpportunities.slice(0, 3).map(o => o.title).join(', ')}.` : "Prepare a strong resume, build a portfolio, and start applying for job opportunities." }
    ];

    return (
      <div style={S.page}>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <Header
          title={`${selectedCourse.icon || '🎯'} ${selectedCourse.title.split(' – ')[0]}`}
          showBack
          onBack={handleBack}
          onOpenSettings={onOpenSettings}
          isBookmarked={savedCareers.some(item => item.careerId === selectedCourse.id)}
          onToggleBookmarked={() => onToggleSave({
            id: selectedCourse.id,
            title: selectedCourse.title,
            icon: selectedCourse.icon || '🎯',
            type: '10th Course',
            payload: { type: 'after10th', categoryId: selectedCategory ? selectedCategory.id : 'intermediate', courseId: selectedCourse.id }
          })}
        />
        {loadingDetails || !courseDetail ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#a89fff', fontSize: 15, fontWeight: 700 }}>
            ⏳ Loading course details...
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={S.heroBox}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>{courseDetail.icon || '🎯'}</div>
              <div style={{ ...S.heroTitle, fontSize: 22 }}>{courseDetail.title}</div>
              {courseDetail.duration && (
                <div style={{ marginTop: 8, display: 'inline-block', background: 'rgba(109,255,160,0.12)', border: '1px solid rgba(109,255,160,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#6dffa0', fontWeight: 700 }}>
                  ⏱ Duration: {courseDetail.duration}
                </div>
              )}
            </div>



            <div style={S.detailBox}>
              <div style={S.label}>📋 Description</div>
              <div style={{ ...S.infoVal, marginTop: 6 }}>{courseDetail.description}</div>
            </div>

            <div style={S.detailBox}>
              <div style={S.label}>🗺️ {t('roadmap')}</div>
              <RoadmapTimeline steps={roadmapSteps} />
            </div>

            {courseDetail.skillsRequired && courseDetail.skillsRequired.length > 0 && (
              <div style={S.detailBox}>
                <div style={S.label}>🛠️ Skills Required</div>
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {courseDetail.skillsRequired.map(s => <span key={s} style={S.pill}>{s}</span>)}
                </div>
              </div>
            )}

            {courseDetail.higherStudies && courseDetail.higherStudies.length > 0 && (
              <div style={S.detailBox}>
                <div style={S.label}>📚 Higher Study Options</div>
                <div style={{ marginTop: 8 }}>
                  {courseDetail.higherStudies.map((hs, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ color: '#ffd166', fontSize: 16 }}>🎓</div>
                      <div style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 600 }}>{hs}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {courseDetail.futureScope && (
              <div style={S.detailBox}>
                <div style={S.label}>🔮 Future Scope & Growth</div>
                <div style={{ ...S.infoVal, marginTop: 6, color: '#ffd166' }}>{courseDetail.futureScope}</div>
              </div>
            )}

            {courseDetail.careerOpportunities && courseDetail.careerOpportunities.length > 0 && (
              <div style={{ padding: '0 16px 80px' }}>
                <div style={S.sectionTitle}>🚀 Leads-To Career Opportunities</div>
                {courseDetail.careerOpportunities.map(job => (
                  <div key={job.id} style={S.listRow} onClick={() => setSelectedJob(job)}>
                    <div style={{ ...S.listIcon, fontSize: 28 }}>{job.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={S.listTitle}>{job.title}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: '#6dffa0', fontWeight: 700 }}>🆕 {job.salaryFresher}</span>
                        <span style={{ fontSize: 11, color: '#ffd166', fontWeight: 700 }}>📈 {job.salaryExperienced}</span>
                      </div>
                    </div>
                    <div style={S.arrow}>→</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div style={S.page}>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <Header title={selectedCategory.title} showBack onBack={handleBack} onOpenSettings={onOpenSettings} />
        <div style={S.heroBox}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{selectedCategory.icon}</div>
          <div style={{ ...S.heroTitle, fontSize: 20 }}>{selectedCategory.title}</div>
          <div style={S.heroSub}>{selectedCategory.description}</div>
        </div>
        {loadingCourses ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#a89fff', fontSize: 15, fontWeight: 700 }}>
            ⏳ Loading courses...
          </div>
        ) : (
          <div style={{ padding: '12px 16px 80px', animation: 'fadeIn 0.4s ease' }}>
            <div style={S.label}>📚 Available Courses / Streams</div>
            {courses.length === 0 ? (
              <div style={{ color: '#8b82cc', textAlign: 'center', padding: '20px 0', fontSize: 13 }}>
                No courses found in this category.
              </div>
            ) : (
              courses.map(course => (
                <div key={course.id} style={S.listRow} onClick={() => handleCourseClick(course)}>
                  <div style={S.listIcon}>{course.icon || '🎯'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={S.listTitle}>{course.title}</div>
                    <div style={{ ...S.listSub, fontSize: 12 }}>{course.description}</div>
                  </div>
                  <div style={S.arrow}>→</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={S.page}>
      <Header title={t('after10th')} showBack onBack={onBack} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>Career Options After 10th</div>
        <div style={S.heroSub}>Explore streams, diplomas, ITI programs & direct jobs</div>
      </div>
      <div style={S.tabRow}>
        {['streams', 'jobs'].map(t => (
          <div key={t} style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }} onClick={() => setTab(t)}>
            {t === 'streams' ? '📚 Education Paths' : '💼 Direct Jobs'}
          </div>
        ))}
      </div>

      {tab === 'streams' && (
        <div style={{ padding: '12px 16px 80px' }}>
          <div style={S.label}>🏷️ Select a Category</div>
          {categories.map(cat => (
            <div key={cat.id} style={S.listRow} onClick={() => handleCategoryClick(cat)}>
              <div style={S.listIcon}>{cat.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={S.listTitle}>{cat.title}</div>
                <div style={S.listSub}>{cat.description}</div>
              </div>
              <div style={S.arrow}>→</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'jobs' && (
        <div style={{ padding: '12px 16px 80px' }}>
          <div style={{ ...S.infoVal, marginBottom: 12, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f59e0b' }}>
            💡 These jobs are available directly after 10th grade
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
            {['All', 'IT', 'Non-IT', 'Government'].map(cat => {
              const catColors = { IT: '#38bdf8', 'Non-IT': '#818cf8', Government: '#f59e0b', All: '#64748b' };
              const active = (jobCat10 || 'All') === cat;
              return (
                <div key={cat} onClick={() => setJobCat10(cat)}
                  style={{
                    padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', transition: 'all 0.2s',
                    background: active ? 'var(--primary)' : 'rgba(99, 102, 241, 0.05)',
                    color: active ? '#fff' : 'var(--text-sub)',
                    border: active ? 'none' : '1px solid var(--border-color)'
                  }}>
                  {cat === 'IT' ? '💻 IT Jobs' : cat === 'Non-IT' ? '🔧 Non-IT' : cat === 'Government' ? '🛡️ Government' : '📋 All Jobs'}
                </div>
              );
            })}
          </div>
          {['IT', 'Non-IT', 'Government'].filter(cat => !jobCat10 || jobCat10 === 'All' || jobCat10 === cat).map(cat => {
            const catJobs = jobs.filter(j => j.category === cat);
            if (!catJobs.length) return null;
            const catMeta = {
              IT: { label: '💻 IT Jobs', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
              'Non-IT': { label: '🔧 Non-IT Jobs', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)' },
              Government: { label: '🛡️ Government Jobs', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' }
            };
            const meta = catMeta[cat];
            return (
              <div key={cat} style={{ marginBottom: 18 }}>
                {(!jobCat10 || jobCat10 === 'All') && (
                  <div style={{ background: meta.bg, border: `1px solid ${meta.color}40`, borderRadius: 10, padding: '8px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: meta.color }}>{meta.label}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>{catJobs.length} jobs</span>
                  </div>
                )}
                {catJobs.map(j => (
                  <div key={j.id} style={{ ...S.listRow, marginBottom: 10 }} onClick={() => setSelectedJob(j)}>
                    <div style={{ ...S.listIcon, fontSize: 28 }}>{j.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={S.listTitle}>{j.title}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: '#6dffa0', fontWeight: 700 }}>🆕 {j.salaryFresher}</span>
                        <span style={{ fontSize: 11, color: '#ffd166', fontWeight: 700 }}>📈 {j.salaryExperienced}</span>
                      </div>
                    </div>
                    <div style={S.arrow}>→</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function JobDetail({ job, onBack, t, savedCareers = [], onToggleSave, onAddToCompare }) {
  const cats = { IT: '#6c63ff', 'Non-IT': '#ff6584', Government: '#ffd166' };
  const catColor = cats[job.category] || '#6c63ff';
  const isBookmarked = savedCareers.some(item => item.careerId === job.id);
  return (
    <div style={S.page}>
      <Header
        title={`${job.icon} ${job.title}`}
        showBack
        onBack={onBack}
        isBookmarked={isBookmarked}
        onToggleBookmarked={() => onToggleSave({
          id: job.id,
          title: job.title,
          icon: job.icon || '💼',
          type: '10th Job',
          payload: { type: 'after10th', tab: 'jobs', jobId: job.id }
        })}
      />

      {/* Hero */}
      <div style={S.heroBox}>
        <div style={{ fontSize: 58, marginBottom: 8 }}>{job.icon}</div>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>{job.title}</div>
        {job.category && (
          <div style={{ marginTop: 8 }}>
            <span style={{ background: catColor, color: '#fff', borderRadius: 20, padding: '4px 16px', fontSize: 12, fontWeight: 800 }}>
              {job.categoryIcon} {job.category} Job
            </span>
          </div>
        )}
      </div>



      {/* Salary split card */}
      <div style={{ margin: '0 16px 12px', background: 'rgba(109,255,160,0.07)', border: '1px solid rgba(109,255,160,0.25)', borderRadius: 14, padding: '14px 16px' }}>
        <div style={{ fontSize: 12, color: '#a89fff', fontWeight: 700, marginBottom: 10 }}>💰 SALARY</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, background: 'rgba(109,255,160,0.1)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#a89fff', fontWeight: 700, marginBottom: 4 }}>🆕 FRESHER</div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#6dffa0' }}>{job.salaryFresher || job.salary}</div>
          </div>
          {job.salaryExperienced && (
            <div style={{ flex: 1, background: 'rgba(255,209,102,0.1)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#a89fff', fontWeight: 700, marginBottom: 4 }}>📈 3+ YEARS</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#ffd166' }}>{job.salaryExperienced}</div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div style={S.detailBox}>
        <div style={S.label}>📋 Job Description</div>
        <div style={{ ...S.infoVal, marginTop: 6 }}>{job.description}</div>
      </div>

      {/* How to Become */}
      {job.howToBecome && (
        <div style={S.detailBox}>
          <div style={S.label}>🎯 How to Become</div>
          <div style={{ marginTop: 8 }}>
            {Array.isArray(job.howToBecome)
              ? job.howToBecome.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ minWidth: 24, height: 24, borderRadius: 12, background: 'linear-gradient(135deg,#6c63ff,#9c5fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-sub)', paddingTop: 3 }}>{step}</div>
                </div>
              ))
              : <div style={{ ...S.infoVal, marginTop: 4 }}>{job.howToBecome}</div>
            }
          </div>
        </div>
      )}

      {job.howToBecome && (
        <div style={S.detailBox}>
          <div style={S.label}>🗺️ {t('roadmap')}</div>
          <RoadmapTimeline steps={(() => {
            const stepsArr = Array.isArray(job.howToBecome) ? job.howToBecome : [job.howToBecome];
            const skillsStr = Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || 'core skills');
            const certsStr = Array.isArray(job.certifications) ? job.certifications.join(', ') : (job.certifications || 'relevant certifications');
            return [
              { title: "Learn the Rules", subtitle: "Understand the requirements", desc: stepsArr[0] || `Get started by understanding the baseline qualifications and entry criteria to become a successful ${job.title}.` },
              { title: "Build Your Toolbox", subtitle: "Practice core capabilities", desc: stepsArr[1] || `Focus on mastering the day-to-day practical skills required for this job: ${skillsStr}.` },
              { title: "Practice by Doing", subtitle: "Gain early exposure", desc: stepsArr[2] || `Apply your learning in real-world scenarios through mock projects, assignments, or hands-on tasks.` },
              { title: "Get Certified", subtitle: "Add credentials to your name", desc: stepsArr[3] || `Validate your expertise to top recruiters by earning certifications like: ${certsStr}.` },
              { title: "Start Earning", subtitle: "Apply for your first role", desc: `You are ready to enter the market! Apply for ${job.title} positions in settings like: ${Array.isArray(job.workplaces) ? job.workplaces.join(', ') : 'commercial spaces'}.` }
            ];
          })()} />
        </div>
      )}

      {/* Skills */}
      {job.skills && (
        <div style={S.detailBox}>
          <div style={S.label}>🧠 Skills Needed</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {job.skills.map(s => <span key={s} style={S.pill}>{s}</span>)}
          </div>
        </div>
      )}

      {/* Workplaces */}
      {job.workplaces && (
        <div style={S.detailBox}>
          <div style={S.label}>🏢 Where You'll Work</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {job.workplaces.map(w => (
              <span key={w} style={{ background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.3)', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: '#ffd166', fontWeight: 700 }}>{w}</span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {job.certifications && (
        <div style={S.detailBox}>
          <div style={S.label}>🏆 Certifications</div>
          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {job.certifications.map(c => <span key={c} style={S.tag}>{c}</span>)}
          </div>
        </div>
      )}

      {/* Future Scope */}
      {job.future && (
        <div style={S.detailBox}>
          <div style={S.label}>🚀 Future Scope</div>
          <div style={{ ...S.infoVal, marginTop: 6 }}>{job.future}</div>
        </div>
      )}

      {/* Higher Study */}
      {job.higherStudy && (
        <div style={{ ...S.detailBox, marginBottom: 80 }}>
          <div style={S.label}>📚 Higher Study Options</div>
          <div style={{ ...S.infoVal, marginTop: 6, color: '#a89fff' }}>{job.higherStudy}</div>
        </div>
      )}
    </div>
  );
}

// ─── AFTER 12TH ──────────────────────────────────────────────────
function Job12thDetail({ job, onBack, t, savedCareers = [], onToggleSave, onAddToCompare }) {
  const cats = { 'IT': '#6c63ff', 'Non-IT': '#ff6584', 'Government': '#ffd166' };
  const color = cats[job.category] || '#6c63ff';
  const isBookmarked = savedCareers.some(item => item.careerId === job.id);
  return (
    <div style={S.page}>
      <Header
        title={`${job.icon} ${job.title}`}
        showBack
        onBack={onBack}
        isBookmarked={isBookmarked}
        onToggleBookmarked={() => onToggleSave({
          id: job.id,
          title: job.title,
          icon: job.icon || '💼',
          type: '12th Job',
          payload: { type: 'after12th', tab: 'jobs', jobId: job.id }
        })}
      />
      <div style={S.heroBox}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{job.icon}</div>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>{job.title}</div>
        <div style={{ marginTop: 8 }}><span style={{ ...S.badge, background: color }}>{job.category}</span></div>
      </div>



      <div style={S.detailBox}>
        <div style={S.salaryBox}>
          <div style={S.label}>💰 Salary</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#6dffa0' }}>{job.salary}</div>
        </div>
      </div>
      <div style={S.detailBox}>
        <div style={S.label}>📋 Job Description</div>
        <div style={{ ...S.infoVal, marginTop: 6 }}>{job.description}</div>
      </div>
      {job.howToBecome && (
        <div style={S.detailBox}>
          <div style={S.label}>🎯 How to Become</div>
          <div style={{ ...S.infoVal, marginTop: 6 }}>{job.howToBecome}</div>
        </div>
      )}

      {job.howToBecome && (
        <div style={S.detailBox}>
          <div style={S.label}>🗺️ {t('roadmap')}</div>
          <RoadmapTimeline steps={[
            { title: "Meet the Prerequisites", subtitle: "Complete your basic studies", desc: job.howToBecome ? `Start by achieving the required education: ${job.howToBecome}` : "Ensure you have completed your 12th standard education or equivalent." },
            { title: "Train Your Skills", subtitle: "Acquire key job skills", desc: `Learn the essential daily techniques and capabilities: ${Array.isArray(job.skills) ? job.skills.join(', ') : 'domain methods'}.` },
            { title: "Master the Tools", subtitle: "Learn industry software", desc: `Get comfortable with the software and tools used in places like: ${Array.isArray(job.workplaces) ? job.workplaces.join(', ') : 'active workplaces'}.` },
            { title: "Build a Portfolio", subtitle: "Show what you can do", desc: "Create simple personal or mock projects, construct a neat resume, and document your learning." },
            { title: "Secure the Placement", subtitle: "Start applying and earning", desc: `Apply for ${job.title} positions in the ${job.category} sector with salary ranges of ${job.salary || 'competitive standards'}.` }
          ]} />
        </div>
      )}

      {job.skills && (
        <div style={S.detailBox}>
          <div style={S.label}>🧠 Skills Needed</div>
          <div style={{ marginTop: 6 }}>{job.skills.map(s => <span key={s} style={S.pill}>{s}</span>)}</div>
        </div>
      )}
      {job.workplaces && (
        <div style={S.detailBox}>
          <div style={S.label}>🏢 Where to Work</div>
          <div style={{ marginTop: 6 }}>{job.workplaces.map(w => <span key={w} style={S.tag}>{w}</span>)}</div>
        </div>
      )}
    </div>
  );
}

const JOBS_12 = [
  { id: 'data-entry-12', title: 'Data Entry Operator', icon: '🖥️', category: 'IT', salary: '₹12K–₹20K/month', description: 'Handle data entry, typing and computer operations in offices, BPOs and data centers.', skills: ['Fast Typing', 'MS Excel', 'Communication', 'Accuracy'], howToBecome: 'Learn basic computer skills, MS Office and typing practice.', workplaces: ['Offices', 'BPOs', 'Data Centers'] },
  { id: 'graphic-designer-12', title: 'Graphic Designer', icon: '🎨', category: 'IT', salary: '₹15K–₹30K/month', description: 'Create visual content for brands, social media, ads and digital platforms.', skills: ['Canva', 'Photoshop', 'Illustrator', 'Creativity'], howToBecome: 'Learn Canva, Photoshop and Illustrator.', workplaces: ['Marketing Agencies', 'IT Companies', 'Freelancing'] },
  { id: 'video-editor-12', title: 'Video Editor', icon: '🎬', category: 'IT', salary: '₹15K–₹35K/month', description: 'Edit and produce video content for YouTube channels, media companies and brands.', skills: ['Premiere Pro', 'CapCut', 'After Effects', 'Creativity'], howToBecome: 'Learn Premiere Pro, CapCut or After Effects.', workplaces: ['YouTube Channels', 'Media Companies', 'Freelancing'] },
  { id: 'social-media-12', title: 'Social Media Manager', icon: '📱', category: 'IT', salary: '₹18K–₹35K/month', description: 'Manage brand presence, content and marketing across social media platforms.', skills: ['Communication', 'Marketing', 'Content Creation', 'Analytics'], howToBecome: 'Learn Instagram, Facebook and social media marketing.', workplaces: ['Brands', 'Agencies', 'Startups'] },
  { id: 'web-design-12', title: 'Web Design Assistant', icon: '🌐', category: 'IT', salary: '₹15K–₹30K/month', description: 'Assist in designing and building website interfaces for clients.', skills: ['HTML', 'CSS', 'UI Basics', 'Creativity'], howToBecome: 'Learn HTML and CSS basics.', workplaces: ['IT Companies', 'Freelancing'] },
  { id: 'retail-12', title: 'Retail Staff', icon: '🛍️', category: 'Non-IT', salary: '₹12K–₹20K/month', description: 'Handle customer service, billing and store operations in retail outlets.', skills: ['Sales', 'Customer Handling', 'Communication'], howToBecome: 'Communication and customer service skills.', workplaces: ['Malls', 'Supermarkets', 'Stores'] },
  { id: 'bpo-12', title: 'BPO Executive', icon: '📞', category: 'Non-IT', salary: '₹15K–₹28K/month', description: 'Handle inbound/outbound calls and customer support in call centres.', skills: ['Speaking Skills', 'Problem Solving', 'English Communication'], howToBecome: 'Basic English and communication training.', workplaces: ['Call Centers', 'ITES Companies'] },
  { id: 'airport-12', title: 'Airport Ground Staff', icon: '✈️', category: 'Non-IT', salary: '₹20K–₹35K/month', description: 'Handle passenger check-in, boarding, baggage and airport operations.', skills: ['Communication', 'Grooming', 'Customer Handling'], howToBecome: 'Aviation or customer service training course.', workplaces: ['Airports', 'Airlines'] },
  { id: 'hotel-12', title: 'Hotel Staff', icon: '🏨', category: 'Non-IT', salary: '₹15K–₹25K/month', description: 'Provide hospitality services to hotel guests.', skills: ['Customer Service', 'Teamwork', 'Grooming'], howToBecome: 'Hospitality training or short hotel management course.', workplaces: ['Hotels', 'Resorts'] },
  { id: 'delivery-12', title: 'Delivery & Logistics', icon: '🚚', category: 'Non-IT', salary: '₹15K–₹30K/month', description: 'Handle last-mile delivery and logistics for e-commerce and courier companies.', skills: ['Navigation', 'Time Management', 'Driving License'], howToBecome: 'Driving license and basic logistics knowledge.', workplaces: ['E-Commerce Companies', 'Logistics Companies'] },
  { id: 'police-12', title: 'Police Constable', icon: '👮', category: 'Government', salary: '₹25K–₹45K/month', description: 'Maintain law and order, assist investigations and serve the community.', skills: ['Fitness', 'Discipline', 'Communication'], howToBecome: 'State police recruitment exams.', workplaces: ['Police Department'] },
  { id: 'army-12', title: 'Army / NDA', icon: '🪖', category: 'Government', salary: '₹35K–₹60K/month', description: 'Serve in the Indian Army, Navy or Air Force as a soldier or officer.', skills: ['Physical Fitness', 'Leadership', 'Discipline'], howToBecome: 'NDA exam or Army recruitment rally.', workplaces: ['Indian Army', 'Navy', 'Air Force'] },
  { id: 'railway-12', title: 'Railway Jobs (RRB)', icon: '🚆', category: 'Government', salary: '₹25K–₹50K/month', description: 'Work in Indian Railways as technician, ticket inspector or operations staff.', skills: ['Aptitude', 'Technical Basics', 'Discipline'], howToBecome: 'RRB NTPC / Group D exams.', workplaces: ['Indian Railways'] },
];

function After12thPage({ onBack, initialTarget, clearTarget, t, savedCareers = [], onToggleSave, onAddToCompare, onOpenSettings }) {
  // view: 'main' | 'sectors' | 'departments' | 'deptDetail' | 'jobDetail'
  const [view, setView] = useState('main');
  const [tab, setTab] = useState('streams');
  const [jobFilter, setJobFilter] = useState('All');
  const [streams, setStreams] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetch(`${API}/after12th/streams`).then(r => r.json()).then(setStreams).catch(() => { });
  }, []);

  useEffect(() => {
    if (initialTarget && initialTarget.type === 'after12th') {
      if (initialTarget.tab) {
        setTab(initialTarget.tab);
      }
      if (initialTarget.streamId) {
        setTab('streams');
        const sObj = { id: initialTarget.streamId, label: initialTarget.streamId + ' Stream' };
        setSelectedStream(sObj);
        fetch(`${API}/after12th/sectors/${initialTarget.streamId}`)
          .then(r => r.json())
          .then(sectorsList => {
            setSectors(sectorsList);
            const sec = sectorsList.find(s => s.id === initialTarget.sectorId);
            if (sec) {
              setSelectedSector(sec);
              if (initialTarget.deptId && sec.departments) {
                const dept = sec.departments.find(d => d.id === initialTarget.deptId);
                if (dept) {
                  setSelectedDept(dept);
                  setView('deptDetail');
                } else {
                  setView('departments');
                }
              } else {
                setView('departments');
              }
            } else {
              setView('sectors');
            }
          })
          .catch(() => setView('sectors'));
      }
      clearTarget();
    }
  }, [initialTarget]);

  const pickStream = async (s) => {
    setSelectedStream(s);
    const data = await fetch(`${API}/after12th/sectors/${s.id}`).then(r => r.json()).catch(() => []);
    setSectors(data);
    setView('sectors');
  };

  const categories = ['All', 'IT', 'Non-IT', 'Government'];
  const filteredJobs = jobFilter === 'All' ? JOBS_12 : JOBS_12.filter(j => j.category === jobFilter);

  // ── JOB DETAIL VIEW ──────────────────────────────────────────────
  if (view === 'jobDetail' && selectedJob) return (
    <Job12thDetail job={selectedJob} onBack={() => { setSelectedJob(null); setView('main'); }} t={t} savedCareers={savedCareers} onToggleSave={onToggleSave} onAddToCompare={onAddToCompare} />
  );

  // ── DEPT DETAIL VIEW ─────────────────────────────────────────────
  if (view === 'deptDetail' && selectedDept) return (
    <DeptDetail
      dept={selectedDept}
      streamId={selectedStream?.id}
      sectorId={selectedSector?.id}
      onBack={() => { setSelectedDept(null); setView('departments'); }}
      t={t}
      savedCareers={savedCareers}
      onToggleSave={onToggleSave}
      onAddToCompare={onAddToCompare}
      onOpenSettings={onOpenSettings}
    />
  );

  // ── DEPARTMENTS VIEW ─────────────────────────────────────────────
  if (view === 'departments' && selectedSector) return (
    <div style={S.page}>
      <Header title={`${selectedSector.icon} ${selectedSector.title}`} showBack onBack={() => setView('sectors')} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ ...S.heroTitle, fontSize: 20 }}>{selectedSector.title}</div>
        <div style={S.heroSub}>Select a department to explore careers</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        {(selectedSector.departments || []).map(d => (
          <div key={d.id} style={S.listRow} onClick={() => { setSelectedDept(d); setView('deptDetail'); }}>
            <div style={{ fontSize: 28, minWidth: 38 }}>🎯</div>
            <div>
              <div style={S.listTitle}>{d.title}</div>
              <div style={S.listSub}>{d.description ? d.description.slice(0, 60) + '...' : ''}</div>
            </div>
            <div style={S.arrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── SECTORS VIEW ─────────────────────────────────────────────────
  if (view === 'sectors' && selectedStream) return (
    <div style={S.page}>
      <Header title={`📗 ${selectedStream.id}`} showBack onBack={() => setView('main')} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ ...S.heroTitle, fontSize: 20 }}>{selectedStream.label}</div>
        <div style={S.heroSub}>Choose a sector to explore departments</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        {sectors.map(sec => (
          <div key={sec.id} style={S.listRow} onClick={() => { setSelectedSector(sec); setView('departments'); }}>
            <div style={S.listIcon}>{sec.icon}</div>
            <div>
              <div style={S.listTitle}>{sec.title}</div>
              <div style={S.listSub}>{sec.departments ? `${sec.departments.length} departments` : ''}</div>
            </div>
            <div style={S.arrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── MAIN VIEW (with both tabs always visible) ─────────────────────
  return (
    <div style={S.page}>
      <Header title={t('after12th')} showBack onBack={onBack} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>Career Options After 12th</div>
        <div style={S.heroSub}>Explore streams, departments & direct jobs</div>
      </div>

      {/* TABS — always visible */}
      <div style={{ display: 'flex', gap: 10, padding: '12px 16px 0' }}>
        <div
          onClick={() => setTab('streams')}
          style={{
            flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
            background: tab === 'streams' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
            border: tab === 'streams' ? 'none' : '1px solid var(--border-color)',
            color: tab === 'streams' ? '#fff' : 'var(--text-sub)'
          }}>
          📚 Education Paths
        </div>
        <div
          onClick={() => setTab('jobs')}
          style={{
            flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
            background: tab === 'jobs' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
            border: tab === 'jobs' ? 'none' : '1px solid var(--border-color)',
            color: tab === 'jobs' ? '#fff' : 'var(--text-sub)'
          }}>
          💼 Direct Jobs
        </div>
      </div>

      {/* EDUCATION PATHS TAB */}
      {tab === 'streams' && (
        <div style={{ padding: '8px 16px' }}>
          {streams.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#a89fff', fontSize: 13 }}>Loading streams...</div>
          )}
          {streams.map(s => (
            <div key={s.id} style={S.listRow} onClick={() => pickStream(s)}>
              <div style={{ fontSize: 30, minWidth: 38 }}>📗</div>
              <div>
                <div style={S.listTitle}>{s.id}</div>
                <div style={S.listSub}>{s.label}</div>
              </div>
              <div style={S.arrow}>→</div>
            </div>
          ))}
        </div>
      )}

      {/* DIRECT JOBS TAB */}
      {tab === 'jobs' && (
        <div>
          {/* Category filter pills */}
          <div style={{ display: 'flex', gap: 8, padding: '12px 16px 4px', overflowX: 'auto' }}>
            {categories.map(c => (
              <div key={c} onClick={() => setJobFilter(c)}
                style={{
                  padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', transition: 'all 0.2s',
                  background: jobFilter === c ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
                  border: jobFilter === c ? 'none' : '1px solid var(--border-color)',
                  color: jobFilter === c ? '#fff' : 'var(--text-sub)'
                }}>
                {c}
              </div>
            ))}
          </div>
          {/* Jobs list */}
          <div style={{ padding: '8px 16px' }}>
            {filteredJobs.map(j => (
              <div key={j.id} style={S.listRow} onClick={() => { setSelectedJob(j); setView('jobDetail'); }}>
                <div style={S.listIcon}>{j.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={S.listTitle}>{j.title}</div>
                  <div style={{ color: '#6dffa0', fontWeight: 700, fontSize: 11, marginTop: 2 }}>{j.salary}</div>
                  <div style={{ marginTop: 3 }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 800, color: '#fff',
                      background: j.category === 'IT' ? 'linear-gradient(135deg,#6c63ff,#9c5fff)' : j.category === 'Government' ? 'linear-gradient(135deg,#f7971e,#ffd200)' : 'linear-gradient(135deg,#ff6584,#ff8c42)'
                    }}>
                      {j.category}
                    </span>
                  </div>
                </div>
                <div style={S.arrow}>→</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DeptDetail({ dept, streamId, sectorId, onBack, t, savedCareers = [], onToggleSave, onAddToCompare, onOpenSettings }) {
  const isBookmarked = savedCareers.some(item => item.careerId === dept.id);
  const handleToggle = () => {
    onToggleSave({
      id: dept.id,
      title: dept.title,
      icon: dept.icon || '🎯',
      type: '12th Department',
      payload: { type: 'after12th', streamId: streamId || 'MPC', sectorId: sectorId || '', deptId: dept.id }
    });
  };
  return (
    <div style={S.page}>
      <Header
        title={dept.title}
        showBack
        onBack={onBack}
        onOpenSettings={onOpenSettings}
        isBookmarked={isBookmarked}
        onToggleBookmarked={handleToggle}
      />
      <div style={S.heroBox}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🎯</div>
        <div style={{ ...S.heroTitle, fontSize: 20 }}>{dept.title}</div>
        <div style={S.heroSub}>{dept.description}</div>
      </div>



      {dept.salary && (
        <div style={S.detailBox}>
          <div style={S.salaryBox}>
            <div style={S.label}>💰 Salary Package</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#6dffa0' }}>{dept.salary}</div>
          </div>
        </div>
      )}

      <div style={S.detailBox}>
        <div style={S.label}>🗺️ {t('roadmap')}</div>
        <RoadmapTimeline steps={[
          { title: "Win the Admission", subtitle: "College Entrance Prep", desc: `Qualify for entry by preparing for key assessments: ${dept.entranceExams && dept.entranceExams.length > 0 ? dept.entranceExams.join(', ') : 'Academic Merit selection'}.` },
          { title: "Master the Curriculum", subtitle: "Build academic foundation", desc: "Attend your classes, grasp structural concepts, and study core departmental theory modules." },
          { title: "Gain Practical Skills", subtitle: "Lab work & experiments", desc: `Acquire hands-on technical abilities: ${dept.skills && dept.skills.length > 0 ? dept.skills.slice(0, 3).join(', ') : 'standard methods'}.` },
          { title: "Earn Industry Badges", subtitle: "Get certified & stand out", desc: `Target high-value credentials: ${dept.certifications && dept.certifications.length > 0 ? dept.certifications.slice(0, 3).join(', ') : 'professional credentials'}.` },
          { title: "Jumpstart Your Career", subtitle: "Get hired as an expert", desc: `Apply for exciting placement opportunities like: ${dept.careers && dept.careers.length > 0 ? dept.careers.slice(0, 3).join(', ') : 'relevant jobs'} with package averages of ${dept.salary || 'industry standards'}.` }
        ]} />
      </div>

      {dept.entranceExams && (
        <div style={S.detailBox}>
          <div style={S.label}>📝 Entrance Exams</div>
          <div style={{ marginTop: 6 }}>{dept.entranceExams.map(e => <span key={e} style={S.tag}>{e}</span>)}</div>
        </div>
      )}

      {dept.topColleges && (
        <div style={S.detailBox}>
          <div style={S.label}>🏫 Top Colleges</div>
          <div style={{ marginTop: 6 }}>{dept.topColleges.map(c => <span key={c} style={S.pill}>{c}</span>)}</div>
        </div>
      )}

      {dept.skills && (
        <div style={S.detailBox}>
          <div style={S.label}>🛠️ Key Skills to Learn</div>
          <div style={{ marginTop: 6 }}>{dept.skills.map(s => <span key={s} style={S.pill}>{s}</span>)}</div>
        </div>
      )}

      {dept.careers && (
        <div style={S.detailBox}>
          <div style={S.label}>💼 Career Roles</div>
          <div style={{ marginTop: 6 }}>{dept.careers.map(c => <span key={c} style={{ ...S.bigTag, cursor: 'default' }}>{c}</span>)}</div>
        </div>
      )}

      {dept.certifications && (
        <div style={S.detailBox}>
          <div style={S.label}>🏆 Top Certifications</div>
          <div style={{ marginTop: 6 }}>{dept.certifications.map(c => <span key={c} style={S.tag}>{c}</span>)}</div>
        </div>
      )}
    </div>
  );
}

// ─── AFTER GRADUATION ────────────────────────────────────────────
const deptMasterTitles = {
  "cse-computer-science-engineering": "M.Tech / MS in Computer Science & Engineering",
  "cse-ai-artificial-intelligence": "M.Tech / MS in Artificial Intelligence & Machine Learning",
  "cse-ds-data-science": "M.Tech / MS in Data Science & Analytics",
  "cse-cs-cyber-security": "M.Tech / MS in Cyber Security & Information Assurance",
  "it-information-technology": "M.Tech / MS in Information Technology & Systems",
  "eee-electrical-electronics-engineering": "M.Tech / MS in Power Systems & Electrical Engineering",
  "ece-electronics-communication-engineering": "M.Tech / MS in VLSI Design & Telecommunications",
  "eie-electronics-instrumentation-engineering": "M.Tech / MS in Instrumentation & Control Systems",
  "me-mechanical-engineering": "M.Tech / MS in Mechanical Engineering & Robotics",
  "ce-civil-engineering": "M.Tech / MS in Structural & Civil Engineering",
  "ae-automobile-engineering": "M.Tech / MS in Automotive Engineering & Design",
  "aero-aeronautical-engineering": "M.Tech / MS in Aerospace & Aeronautical Engineering",
  "bt-biotechnology-engineering": "M.Tech / MS in Biotechnology & Bioinformatics",
  "re-robotics-engineering": "M.Tech / MS in Robotics & Automation Engineering",
  "mbbs-bachelor-of-medicine-bachelor-of-surgery": "MD / MS (Doctor of Medicine / Master of Surgery)",
  "bds-dental-surgery": "MDS (Master of Dental Surgery)",
  "b-pharm-pharmacy": "M.Pharm (Master of Pharmacy) / Pharm.D",
  "bams-ayurveda": "MD / MS in Ayurveda",
  "bhms-homeopathy": "MD in Homeopathy",
  "bpt-physiotherapy": "MPT (Master of Physiotherapy)",
  "bt-biotechnology": "M.Sc / Ph.D in Biotechnology & Life Sciences",
  "mlt-medical-lab-technology": "M.Sc in Medical Lab Technology",
  "b-com-bachelor-of-commerce": "M.Com / MBA / CA / CFA",
  "cma-cost-management-accounting": "MBA in Finance / Corporate Accounting / CPA",
  "cs-company-secretary": "ACS / LLM in Corporate Law & Governance",
  "llb-bachelor-of-law": "LLM (Master of Laws) / Corporate Law Specialization",
  "fa-fine-arts": "MFA (Master of Fine Arts) / MA in Creative Design",
  "wd-web-development": "MCA (Master of Computer Applications) / MS in Software Systems",
  "hm-hotel-management": "MBA in Hospitality & Hotel Management",
  "av-aviation": "MBA in Aviation & Airport Management",
  "agri-agriculture": "M.Sc in Agriculture / MBA in Agribusiness",
  "fish-fisheries": "M.Sc in Fisheries Science & Aquaculture",
  "nda-national-defence-academy": "Master's in Defense Studies & Strategic Management",
  "rrb-railway-jobs": "M.Tech in Transportation Engineering & Logistics",
  "ssc-staff-selection-commission": "MA in Public Administration / MBA in Public Policy"
};

function GraduationPage({ onBack, initialTarget, clearTarget, t, savedCareers, onToggleSave, onOpenSettings }) {
  const [view, setView] = useState('main');
  const [deptTab, setDeptTab] = useState('info'); // 'info' | 'careers'
  const [tab, setTab] = useState('jobs'); // 'jobs' | 'study' | 'abroad'

  const [sectors, setSectors] = useState([]);
  const [masters, setMasters] = useState([]);
  const [studyAbroadList, setStudyAbroadList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [deptDetails, setDeptDetails] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [expandedProg, setExpandedProg] = useState(null);

  useEffect(() => {
    fetch(`${API}/aftergraduation/sectors`).then(r => r.json()).then(setSectors).catch(() => { });
    fetch(`${API}/aftergraduation/higherstudy`).then(r => r.json()).then(setMasters).catch(() => { });
    fetch(`${API}/aftergraduation/studyabroad`).then(r => r.json()).then(setStudyAbroadList).catch(() => { });
  }, []);

  useEffect(() => {
    if (initialTarget && initialTarget.type === 'graduation') {
      if (initialTarget.tab) setTab(initialTarget.tab);
      if (initialTarget.tab === 'study' && initialTarget.masterId) {
        fetch(`${API}/aftergraduation/higherstudy`)
          .then(r => r.json())
          .then(mastersList => {
            setMasters(mastersList);
            const m = mastersList.find(x => x.id === initialTarget.masterId);
            if (m) {
              let finalMaster = m;
              if (initialTarget.deptId && initialTarget.deptTitle) {
                finalMaster = {
                  ...m,
                  title: initialTarget.deptTitle,
                  specializations: initialTarget.specializations || []
                };
              }
              setSelectedMaster(finalMaster);
              setView('masterDetail');
            }
          });
      } else if (initialTarget.tab === 'abroad' && initialTarget.countryId) {
        setTab('abroad');
        fetch(`${API}/aftergraduation/studyabroad`)
          .then(r => r.json())
          .then(list => {
            setStudyAbroadList(list);
            const country = list.find(x => x.id === initialTarget.countryId);
            if (country) setSelectedCountry(country);
          });
      } else if (initialTarget.tab === 'jobs' && initialTarget.jobId) {
        setTab('jobs');
        fetch(`${API}/aftergraduation/jobs`)
          .then(r => r.json())
          .then(jobsList => {
            const job = jobsList.find(j => j.id === initialTarget.jobId);
            if (job) setSelectedJob(job);
          });
      } else if (initialTarget.tab === 'jobs' && initialTarget.sectorId && initialTarget.deptId) {
        setTab('jobs');
        fetch(`${API}/aftergraduation/sectors/${initialTarget.sectorId}`)
          .then(r => r.json())
          .then(sec => {
            if (sec) {
              setSelectedSector(sec);
              const d = sec.departments.find(x => x.id === initialTarget.deptId);
              if (d) pickDept(d);
            }
          });
      }
      clearTarget();
    }
  }, [initialTarget]);

  const sectorIcons = {
    "Engineering & Technology": "🎓",
    "Medical & Healthcare": "🩺",
    "Commerce & Business": "💼",
    "Law": "⚖️",
    "Arts & Humanities": "🎨",
    "IT & Computer Courses": "💻",
    "Professional Courses": "🏨",
    "Agriculture & Vocational": "🌾",
    "Defense & Government": "🛡️"
  };

  const pickSector = async (sec) => {
    setSelectedSector(sec);
    const res = await fetch(`${API}/aftergraduation/sectors/${sec.id}`).then(r => r.json()).catch(() => null);
    if (res) {
      setSelectedSector(res);
      setView('departments');
    }
  };

  const pickDept = async (dept) => {
    const res = await fetch(`${API}/aftergraduation/departments/${dept.id}`).then(r => r.json()).catch(() => null);
    if (res) {
      setDeptDetails(res);
      setView('deptDetail');
      setDeptTab('info');
    }
  };

  const pickDeptStudy = (dept) => {
    const template = masters.find(m => m.id === selectedSector.id);
    if (template) {
      const customTitle = deptMasterTitles[dept.id] || dept.title;
      const specList = dept.courseDetails?.higherStudies || [];
      setSelectedDept(dept);
      setSelectedMaster({
        ...template,
        title: customTitle,
        specializations: specList
      });
      setView('masterDetail');
    }
  };

  if (selectedJob) return <GradJobDetail job={selectedJob} onBack={() => setSelectedJob(null)} t={t} savedCareers={savedCareers} onToggleSave={onToggleSave} />;

  if (selectedCountry) {
    return (
      <div style={S.page}>
        <Header
          title={`Study in ${selectedCountry.country}`}
          showBack
          onBack={() => setSelectedCountry(null)}
          isBookmarked={savedCareers && savedCareers.some(item => item.careerId === selectedCountry.id)}
          onToggleBookmarked={() => onToggleSave({
            id: selectedCountry.id,
            title: `${selectedCountry.country} Study Guide`,
            icon: '✈️',
            type: 'Study Abroad Program',
            payload: { type: 'graduation', tab: 'abroad', countryId: selectedCountry.id }
          })}
        />
        <div style={S.heroBox}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>✈️</div>
          <div style={{ ...S.heroTitle, fontSize: 22 }}>{selectedCountry.title}</div>
          <div style={S.heroSub}>{selectedCountry.description}</div>
        </div>

        <div style={S.detailBox}>
          <div style={S.label}>💰 COST ESTIMATES</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <div style={{ flex: 1, background: 'rgba(99, 102, 241, 0.05)', borderRadius: 10, padding: 12, border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-sub)', fontWeight: 800 }}>TUITION FEE</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--primary)', marginTop: 4 }}>{selectedCountry.avgTuition}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(245, 158, 11, 0.05)', borderRadius: 10, padding: 12, border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ fontSize: 10, color: 'var(--text-sub)', fontWeight: 800 }}>LIVING COST</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#f59e0b', marginTop: 4 }}>{selectedCountry.livingCost}</div>
            </div>
          </div>
        </div>

        <div style={S.detailBox}>
          <div style={S.label}>🗺️ {t('roadmap')}</div>
          <RoadmapTimeline steps={[
            { title: "Choose Your School", subtitle: "Target top institutions", desc: `Explore and select your target universities: ${selectedCountry.topUniversities && selectedCountry.topUniversities.length > 0 ? selectedCountry.topUniversities.slice(0, 3).join(', ') : 'target institutions'}.` },
            { title: "Ace the Exams", subtitle: "Prepare test requirements", desc: `Study for and clear the required language and academic tests: ${selectedCountry.entranceExams && selectedCountry.entranceExams.length > 0 ? selectedCountry.entranceExams.join(', ') : 'standard entrance tests like IELTS / TOEFL'}.` },
            { title: "Complete Applications", subtitle: "Submit your packages", desc: `Write a compelling Statement of Purpose, collect recommendation letters, and apply for popular courses: ${selectedCountry.popularCourses && selectedCountry.popularCourses.length > 0 ? selectedCountry.popularCourses.slice(0, 3).join(', ') : 'your chosen major'}.` },
            { title: "Secure the Visa", subtitle: "Get your official paperwork", desc: `Secure standard student visa permits: ${selectedCountry.visaType || 'Student Visa'} and arrange your financials.` },
            { title: "Land & Adapt", subtitle: "Settle down and work abroad", desc: `Complete travel arrangements, settle your housing, and explore local work rights: ${selectedCountry.workOpportunity || 'post-study permit'}.` }
          ]} />
        </div>

        <div style={S.detailBox}>
          <div style={S.label}>🛂 VISA & WORK RIGHTS</div>
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.5 }}>
            <div><b>Visa Type:</b> {selectedCountry.visaType}</div>
            <div style={{ marginTop: 4 }}><b>Work Rights:</b> {selectedCountry.workOpportunity}</div>
          </div>
        </div>

        <div style={S.detailBox}>
          <div style={S.label}>📝 ENTRANCE EXAMS</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {selectedCountry.entranceExams.map(ex => <span key={ex} style={S.tag}>{ex}</span>)}
          </div>
        </div>

        <div style={S.detailBox}>
          <div style={S.label}>🏫 TOP UNIVERSITIES</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {selectedCountry.topUniversities.map(u => <span key={u} style={S.pill}>{u}</span>)}
          </div>
        </div>

        <div style={{ ...S.detailBox, marginBottom: 80 }}>
          <div style={S.label}>📚 POPULAR COURSES</div>
          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {selectedCountry.popularCourses.map(c => <span key={c} style={S.bigTag}>{c}</span>)}
          </div>
        </div>
      </div>
    );
  }

  // ── MASTER STUDY DETAIL VIEW ───────────────────────────────────────────
  if (view === 'masterDetail' && selectedMaster) {
    const icon = sectorIcons[selectedMaster.sector] || '🎓';
    return (
      <div style={S.page}>
        <Header
          title={`${icon} Master's Details`}
          showBack
          onBack={() => { setSelectedMaster(null); setView('departments'); }}
          onOpenSettings={onOpenSettings}
          isBookmarked={savedCareers && savedCareers.some(item => item.careerId === selectedMaster.id)}
          onToggleBookmarked={() => onToggleSave({
            id: selectedMaster.id,
            title: selectedMaster.title,
            icon: icon,
            type: "Master's Degree",
            payload: { type: 'graduation', tab: 'study', masterId: selectedMaster.id }
          })}
        />
        <div style={S.heroBox}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>{icon}</div>
          <div style={{ ...S.heroTitle, fontSize: 22 }}>{selectedMaster.sector}</div>
          <div style={S.heroSub}>Master's Studies & Specializations</div>
        </div>



        <div style={S.detailBox}>
          <div style={S.label}>🗺️ {t('roadmap')}</div>
          <RoadmapTimeline steps={[
            { title: "Pick Your Specialization", subtitle: "Find your niche", desc: selectedMaster.specializations && selectedMaster.specializations.length > 0 ? `Choose an area of focus that aligns with your passions: ${selectedMaster.specializations.slice(0, 3).join(', ')}.` : "Select a specialized niche to build advanced expertise." },
            { title: "Clear the Entrances", subtitle: "Qualify for admission", desc: `Study for and pass the required postgraduate tests: ${selectedMaster.entranceExams && selectedMaster.entranceExams.length > 0 ? selectedMaster.entranceExams.join(', ') : 'Direct admission criteria'}.` },
            { title: "Deepen Your Knowledge", subtitle: "Master advanced subjects", desc: `Study advanced academic concepts and research modules for the program: ${selectedMaster.title || 'Master degree'}.` },
            { title: "Build a Research Base", subtitle: "Acquire technical tools", desc: `Develop strong technical capabilities: ${selectedMaster.skills && selectedMaster.skills.length > 0 ? selectedMaster.skills.slice(0, 3).join(', ') : 'advanced industry skills'}.` },
            { title: "Lead as an Expert", subtitle: "Secure senior roles", desc: `Apply for senior positions, technical leadership roles, or research placements like: ${selectedMaster.careers && selectedMaster.careers.length > 0 ? selectedMaster.careers.slice(0, 3).join(', ') : 'professional roles'} with Average Salary: ${selectedMaster.salary || 'competitive packages'}.` }
          ]} />
        </div>

        <div style={S.detailBox}>
          <div style={S.label}>🎓 Degree / Program</div>
          <div style={{ color: '#e8e0ff', fontSize: 15, fontWeight: 800, marginTop: 4 }}>{selectedMaster.title}</div>
        </div>

        {selectedMaster.specializations && selectedMaster.specializations.length > 0 && (
          <div style={S.detailBox}>
            <div style={S.label}>📚 Recommended Specializations</div>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedMaster.specializations.map(s => <span key={s} style={S.pill}>{s}</span>)}
            </div>
          </div>
        )}

        <div style={S.detailBox}>
          <div style={S.salaryBox}>
            <div style={S.label}>💰 Salary Package</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#6dffa0' }}>{selectedMaster.salary}</div>
          </div>
        </div>

        {selectedMaster.entranceExams && selectedMaster.entranceExams.length > 0 && (
          <div style={S.detailBox}>
            <div style={S.label}>📝 Entrance Exams</div>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedMaster.entranceExams.map(e => <span key={e} style={S.tag}>{e}</span>)}
            </div>
          </div>
        )}

        {selectedMaster.topColleges && selectedMaster.topColleges.length > 0 && (
          <div style={S.detailBox}>
            <div style={S.label}>🏫 Top Colleges / Institutes</div>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedMaster.topColleges.map(c => <span key={c} style={S.pill}>{c}</span>)}
            </div>
          </div>
        )}

        {selectedMaster.skills && selectedMaster.skills.length > 0 && (
          <div style={S.detailBox}>
            <div style={S.label}>🛠️ Key Skills to Learn</div>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedMaster.skills.map(s => <span key={s} style={S.pill}>{s}</span>)}
            </div>
          </div>
        )}

        {selectedMaster.programs && selectedMaster.programs.length > 0 ? (
          <div style={S.detailBox}>
            <div style={S.label}>🎓 Choose Specialization / Degree Path</div>
            <div style={{ marginTop: 10 }}>
              {selectedMaster.programs.map((p, pIdx) => {
                const isExpanded = expandedProg === pIdx;
                return (
                  <div key={p.title} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(108,99,255,0.2)',
                    borderRadius: 12,
                    marginBottom: 10,
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }} onClick={() => setExpandedProg(isExpanded ? null : pIdx)}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24 }}>{p.icon || '🎓'}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e0ff' }}>{p.title}</span>
                      </div>
                      <div style={{ fontSize: 16, color: '#a89fff' }}>{isExpanded ? '▼' : '▶'}</div>
                    </div>
                    {isExpanded && (
                      <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
                        <div style={{ fontSize: 11, color: '#a89fff', fontWeight: 700, marginBottom: 6 }}>💼 LEADS-TO CAREER ROLES:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {p.careers.map(c => (
                            <span key={c} style={{
                              background: 'rgba(109,255,160,0.1)',
                              border: '1px solid rgba(109,255,160,0.3)',
                              borderRadius: 20,
                              padding: '4px 12px',
                              fontSize: 12,
                              color: '#6dffa0',
                              fontWeight: 600
                            }}>{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          selectedMaster.careers && selectedMaster.careers.length > 0 && (
            <div style={S.detailBox}>
              <div style={S.label}>💼 Career Roles</div>
              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedMaster.careers.map(c => <span key={c} style={S.bigTag}>{c}</span>)}
              </div>
            </div>
          )
        )}

        {selectedMaster.certifications && selectedMaster.certifications.length > 0 && (
          <div style={{ ...S.detailBox, marginBottom: 80 }}>
            <div style={S.label}>🏆 Top Certifications</div>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedMaster.certifications.map(c => <span key={c} style={S.tag}>{c}</span>)}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── DEPARTMENT DETAIL VIEW ─────────────────────────────────────────────
  if (view === 'deptDetail' && deptDetails) return (
    <div style={S.page}>
      <Header title={deptDetails.title} showBack onBack={() => setView('departments')} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>{deptDetails.icon || '🎯'}</div>
        <div style={{ ...S.heroTitle, fontSize: 20 }}>{deptDetails.title}</div>
        {deptDetails.courseDetails && deptDetails.courseDetails.fullForm && (
          <div style={S.heroSub}>Full Form: {deptDetails.courseDetails.fullForm}</div>
        )}
      </div>



      <div style={{ display: 'flex', gap: 10, padding: '12px 16px 0' }}>
        <div
          onClick={() => setDeptTab('info')}
          style={{
            flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
            background: deptTab === 'info' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
            border: deptTab === 'info' ? 'none' : '1px solid var(--border-color)',
            color: deptTab === 'info' ? '#fff' : 'var(--text-sub)'
          }}>
          📚 Course Info
        </div>
        <div
          onClick={() => setDeptTab('careers')}
          style={{
            flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
            background: deptTab === 'careers' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
            border: deptTab === 'careers' ? 'none' : '1px solid var(--border-color)',
            color: deptTab === 'careers' ? '#fff' : 'var(--text-sub)'
          }}>
          💼 Career Roles ({deptDetails.jobs.length})
        </div>
      </div>

      {deptTab === 'info' && deptDetails.courseDetails && (
        <div style={{ padding: '8px 0' }}>
          {deptDetails.courseDetails.duration && (
            <div style={S.detailBox}>
              <div style={S.label}>⏳ Duration</div>
              <div style={{ color: '#e8e0ff', fontSize: 13, marginTop: 4 }}>{deptDetails.courseDetails.duration}</div>
            </div>
          )}
          {deptDetails.courseDetails.eligibility && (
            <div style={S.detailBox}>
              <div style={S.label}>🎓 Eligibility</div>
              <div style={{ color: '#e8e0ff', fontSize: 13, marginTop: 4 }}>{deptDetails.courseDetails.eligibility}</div>
            </div>
          )}
          {deptDetails.courseDetails.entranceExams && deptDetails.courseDetails.entranceExams.length > 0 && (
            <div style={S.detailBox}>
              <div style={S.label}>📝 Entrance Exams</div>
              <div style={{ marginTop: 6 }}>{deptDetails.courseDetails.entranceExams.map(e => <span key={e} style={S.tag}>{e}</span>)}</div>
            </div>
          )}

          <div style={S.detailBox}>
            <div style={S.label}>🗺️ {t('roadmap')}</div>
            <RoadmapTimeline steps={[
              { title: "Gain Admission", subtitle: "College Entry Requirements", desc: `Qualify for admission by passing required entrance exams: ${deptDetails.courseDetails?.entranceExams && deptDetails.courseDetails.entranceExams.length > 0 ? deptDetails.courseDetails.entranceExams.join(', ') : 'Academic Merit scores'}.` },
              { title: "Build Tech Foundations", subtitle: "Study key academic subjects", desc: `Understand the core subjects of this branch: ${deptDetails.courseDetails?.subjects && deptDetails.courseDetails.subjects.length > 0 ? deptDetails.courseDetails.subjects.slice(0, 3).join(', ') : 'course curriculum'}.` },
              { title: "Master the Tools", subtitle: "Practical skills & tools", desc: `Develop hands-on proficiency with tools: ${deptDetails.courseDetails?.tools && deptDetails.courseDetails.tools.length > 0 ? deptDetails.courseDetails.tools.slice(0, 3).join(', ') : 'standard utilities'} and skills: ${deptDetails.courseDetails?.skills && deptDetails.courseDetails.skills.length > 0 ? deptDetails.courseDetails.skills.slice(0, 3).join(', ') : 'engineering skills'}.` },
              { title: "Get Certified", subtitle: "Earn industry credentials", desc: "Acquire specialized modern certifications during your studies to differentiate your resume." },
              { title: "Launch Your Career", subtitle: "Corporate jobs & placements", desc: `Participate in recruitment and apply for target roles: ${deptDetails.jobs && deptDetails.jobs.length > 0 ? deptDetails.jobs.slice(0, 3).map(j => j.title).join(', ') : 'professional roles'} with salary average: ${deptDetails.courseDetails?.salary || 'competitive packages'}.` }
            ]} />
          </div>

          {deptDetails.courseDetails.subjects && deptDetails.courseDetails.subjects.length > 0 && (
            <div style={S.detailBox}>
              <div style={S.label}>📖 Core Subjects</div>
              <div style={{ marginTop: 6 }}>{deptDetails.courseDetails.subjects.map(s => <span key={s} style={S.pill}>{s}</span>)}</div>
            </div>
          )}
          {deptDetails.courseDetails.skills && deptDetails.courseDetails.skills.length > 0 && (
            <div style={S.detailBox}>
              <div style={S.label}>🧠 Key Skills Required</div>
              <div style={{ marginTop: 6 }}>{deptDetails.courseDetails.skills.map(s => <span key={s} style={S.pill}>{s}</span>)}</div>
            </div>
          )}
          {deptDetails.courseDetails.tools && deptDetails.courseDetails.tools.length > 0 && (
            <div style={S.detailBox}>
              <div style={S.label}>🛠️ Tools to Learn</div>
              <div style={{ marginTop: 6 }}>{deptDetails.courseDetails.tools.map(tVal => <span key={tVal} style={S.tag}>{tVal}</span>)}</div>
            </div>
          )}
          {deptDetails.courseDetails.higherStudies && deptDetails.courseDetails.higherStudies.length > 0 && (
            <div style={S.detailBox}>
              <div style={S.label}>🎓 Higher Studies</div>
              <div style={{ marginTop: 6 }}>{deptDetails.courseDetails.higherStudies.map(h => <span key={h} style={S.pill}>{h}</span>)}</div>
            </div>
          )}
          {deptDetails.courseDetails.certifications && deptDetails.courseDetails.certifications.length > 0 && (
            <div style={S.detailBox}>
              <div style={S.label}>🏆 Certifications</div>
              <div style={{ marginTop: 6 }}>{deptDetails.courseDetails.certifications.map(c => <span key={c} style={S.tag}>{c}</span>)}</div>
            </div>
          )}
          {deptDetails.courseDetails.futureScope && (
            <div style={S.detailBox}>
              <div style={S.label}>🚀 Future Scope</div>
              <div style={{ color: '#c8c0ef', fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>{deptDetails.courseDetails.futureScope}</div>
            </div>
          )}
          {deptDetails.courseDetails.locations && deptDetails.courseDetails.locations.length > 0 && (
            <div style={S.detailBox}>
              <div style={S.label}>📍 Best Locations</div>
              <div style={{ marginTop: 6 }}>{deptDetails.courseDetails.locations.map(l => <span key={l} style={S.bigTag}>{l}</span>)}</div>
            </div>
          )}
        </div>
      )}

      {deptTab === 'careers' && (
        <div style={{ padding: '12px 16px' }}>
          {deptDetails.jobs.map(j => {
            let sal = '';
            if (j.salary.fresher) sal = `Fresher: ${j.salary.fresher}`;
            else if (j.salary.generic) sal = j.salary.generic;
            return (
              <div key={j.id} style={S.listRow} onClick={() => setSelectedJob(j)}>
                <div style={S.listIcon}>{j.icon || '💼'}</div>
                <div>
                  <div style={S.listTitle}>{j.title}</div>
                  <div style={{ ...S.listSub, color: '#6dffa0', fontWeight: 700, fontSize: 11 }}>{sal || 'Competitive'}</div>
                </div>
                <div style={S.arrow}>→</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── DEPARTMENTS VIEW ─────────────────────────────────────────────
  if (view === 'departments' && selectedSector) return (
    <div style={S.page}>
      <Header title={`${selectedSector.icon} ${selectedSector.title}`} showBack onBack={() => setView('main')} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ ...S.heroTitle, fontSize: 20 }}>{selectedSector.title}</div>
        <div style={S.heroSub}>{tab === 'jobs' ? 'Select your graduation department' : 'Select a department to view Master\'s details'}</div>
      </div>
      <div style={{ padding: '0 16px' }}>
        {(selectedSector.departments || []).map(d => (
          <div key={d.id} style={S.listRow} onClick={() => tab === 'jobs' ? pickDept(d) : pickDeptStudy(d)}>
            <div style={{ fontSize: 28, minWidth: 38 }}>{d.icon || '🎯'}</div>
            <div>
              <div style={S.listTitle}>{d.title} ({d.code})</div>
              <div style={S.listSub}>
                {tab === 'jobs'
                  ? (d.jobs ? `${d.jobs.length} career options` : 'Explore details')
                  : (deptMasterTitles[d.id] || 'Master\'s Degree Details')}
              </div>
            </div>
            <div style={S.arrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── MAIN VIEW ─────────────────────────────────────────────
  return (
    <div style={S.page}>
      <Header title={t('graduation')} showBack onBack={onBack} onOpenSettings={onOpenSettings} />
      <div style={S.heroBox}>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>Career After Graduation</div>
        <div style={S.heroSub}>Explore study paths & job roles after graduation</div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: 10, padding: '12px 16px 0', marginBottom: 14 }}>
        <div
          onClick={() => setTab('jobs')}
          style={{
            flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
            background: tab === 'jobs' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
            border: tab === 'jobs' ? 'none' : '1px solid var(--border-color)',
            color: tab === 'jobs' ? '#fff' : 'var(--text-sub)'
          }}>
          💼 Direct Jobs
        </div>
        <div
          onClick={() => setTab('study')}
          style={{
            flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
            background: tab === 'study' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
            border: tab === 'study' ? 'none' : '1px solid var(--border-color)',
            color: tab === 'study' ? '#fff' : 'var(--text-sub)'
          }}>
          📚 Study Paths
        </div>
        <div
          onClick={() => setTab('abroad')}
          style={{
            flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
            background: tab === 'abroad' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
            border: tab === 'abroad' ? 'none' : '1px solid var(--border-color)',
            color: tab === 'abroad' ? '#fff' : 'var(--text-sub)'
          }}>
          ✈️ Study Abroad
        </div>
      </div>

      {tab === 'jobs' && (
        <div style={{ padding: '0 16px' }}>
          {sectors.map(sec => (
            <div key={sec.id} style={S.listRow} onClick={() => pickSector(sec)}>
              <div style={S.listIcon}>{sec.icon}</div>
              <div>
                <div style={S.listTitle}>{sec.title}</div>
                <div style={S.listSub}>{sec.deptCount} departments available</div>
              </div>
              <div style={S.arrow}>→</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'study' && (
        <div style={{ padding: '0 16px' }}>
          {masters.map(m => {
            const icon = sectorIcons[m.sector] || '🎓';
            return (
              <div key={m.id} style={S.listRow} onClick={() => { setSelectedMaster(m); setView('masterDetail'); }}>
                <div style={{ ...S.listIcon, fontSize: 28 }}>{icon}</div>
                <div>
                  <div style={S.listTitle}>{m.sector}</div>
                  <div style={S.listSub}>{m.title}</div>
                </div>
                <div style={S.arrow}>→</div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'abroad' && (
        <div style={{ padding: '0 16px' }}>
          {studyAbroadList.map(c => (
            <div key={c.id} style={S.listRow} onClick={() => setSelectedCountry(c)}>
              <div style={{ ...S.listIcon, fontSize: 28 }}>✈️</div>
              <div>
                <div style={S.listTitle}>{c.country} Study Guide</div>
                <div style={S.listSub}>{c.title}</div>
              </div>
              <div style={S.arrow}>→</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GradJobDetail({ job, onBack, t, savedCareers = [], onToggleSave, onAddToCompare }) {
  let salaryStr = typeof job.salary === 'string' ? job.salary : '';
  if (typeof job.salary === 'object' && job.salary) {
    if (job.salary.fresher) salaryStr += `Fresher: ${job.salary.fresher}`;
    if (job.salary.experienced) salaryStr += (salaryStr ? ' | ' : '') + `Experienced: ${job.salary.experienced}`;
    if (job.salary.abroad) salaryStr += (salaryStr ? ' | ' : '') + `Abroad: ${job.salary.abroad}`;
    if (job.salary.generic) salaryStr += (salaryStr ? ' | ' : '') + job.salary.generic;
  }

  const skillsList = job.skills || [];
  const toolsList = job.tools || job.technologies || [];
  const certsList = job.certifications || [];
  const locationsList = job.locations || job.topCities || [];
  const studyList = job.higherStudies || [];
  const isBookmarked = savedCareers.some(item => item.careerId === job.id);

  return (
    <div style={S.page}>
      <Header
        title={`${job.icon || '💼'} ${job.title}`}
        showBack
        onBack={onBack}
        isBookmarked={isBookmarked}
        onToggleBookmarked={() => onToggleSave({
          id: job.id,
          title: job.title,
          icon: job.icon || '💼',
          type: 'Graduation Job',
          payload: { type: 'graduation', tab: 'jobs', jobId: job.id }
        })}
      />
      <div style={S.heroBox}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{job.icon || '💼'}</div>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>{job.title}</div>
      </div>



      <div style={S.detailBox}>
        <div style={S.label}>🗺️ {t('roadmap')}</div>
        <RoadmapTimeline steps={[
          { title: "Get the Degree", subtitle: "Earn your college credentials", desc: job.description ? `${job.description.slice(0, 100)}... Complete your foundational university studies in a related field.` : "First, earn a bachelor's or master's degree in a relevant field of study." },
          { title: "Master Tech Capabilities", subtitle: "Learn professional methods", desc: skillsList.length > 0 ? `Master essential technical competencies: ${skillsList.slice(0, 4).join(', ')}.` : "Learn core technical and professional requirements in this domain." },
          { title: "Learn the Standard Tools", subtitle: "Gain software proficiency", desc: `Get comfortable using industry-standard systems and tools: ${toolsList.length > 0 ? toolsList.slice(0, 3).join(', ') : 'standard applications'}.` },
          { title: "Validate Your Skills", subtitle: "Obtain professional badges", desc: `Boost your resume credentials by completing certifications like: ${certsList.length > 0 ? certsList.slice(0, 3).join(', ') : 'standard industry certifications'}.` },
          { title: "Join the Team", subtitle: "Enter the professional workspace", desc: `Apply for roles as a certified ${job.title} in workspaces like: ${Array.isArray(job.workplaces) ? job.workplaces.slice(0, 3).join(', ') : 'active departments'} with typical package rates of ${salaryStr}.` }
        ]} />
      </div>
      <div style={S.detailBox}>
        <div style={S.salaryBox}>
          <div style={S.label}>💰 Salary Package</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#6dffa0' }}>{salaryStr || 'Competitive'}</div>
        </div>
      </div>
      {job.description && (
        <div style={S.detailBox}>
          <div style={S.label}>📋 Job Description</div>
          <div style={{ ...S.infoVal, marginTop: 6 }}>{job.description}</div>
        </div>
      )}
      {skillsList.length > 0 && (
        <div style={S.detailBox}>
          <div style={S.label}>🧠 Skills Required</div>
          <div style={{ marginTop: 6 }}>{skillsList.map(s => <span key={s} style={S.pill}>{s}</span>)}</div>
        </div>
      )}
      {toolsList.length > 0 && (
        <div style={S.detailBox}>
          <div style={S.label}>🛠️ Tools & Technologies</div>
          <div style={{ marginTop: 6 }}>{toolsList.map(t => <span key={t} style={S.tag}>{t}</span>)}</div>
        </div>
      )}
      {certsList.length > 0 && (
        <div style={S.detailBox}>
          <div style={S.label}>🏆 Certifications</div>
          <div style={{ marginTop: 6 }}>{certsList.map(c => <span key={c} style={S.tag}>{c}</span>)}</div>
        </div>
      )}
      {studyList.length > 0 && (
        <div style={S.detailBox}>
          <div style={S.label}>🎓 Higher Studies</div>
          <div style={{ marginTop: 6 }}>{studyList.map(s => <span key={s} style={S.pill}>{s}</span>)}</div>
        </div>
      )}
      {job.futureScope && (
        <div style={S.detailBox}>
          <div style={S.label}>🚀 Future Scope</div>
          <div style={{ ...S.infoVal, marginTop: 6 }}>{job.futureScope}</div>
        </div>
      )}
      {locationsList.length > 0 && (
        <div style={S.detailBox}>
          <div style={S.label}>📍 Best Locations</div>
          <div style={{ marginTop: 6 }}>{locationsList.map(c => <span key={c} style={S.bigTag}>{c}</span>)}</div>
        </div>
      )}
    </div>
  );
}


// ─── SEARCH PAGE ─────────────────────────────────────────────────
function SearchPage({ onBack, t, onSelectResult, onOpenSettings }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async (q) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    const data = await fetch(`${API}/search?q=${encodeURIComponent(q)}`).then(r => r.json()).catch(() => []);
    setResults(data);
    setLoading(false);
  };

  const suggestions = ['Software Engineer', 'Data Scientist', 'MBBS', 'CSE', 'Mechanical', 'AI Engineer', 'Law', 'Electrician'];

  return (
    <div style={S.page}>
      <Header title={t('search')} showBack onBack={onBack} onOpenSettings={onOpenSettings} />
      <div style={{ padding: '16px' }}>
        <div style={S.searchBox}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
          <input
            style={S.searchInput}
            placeholder="Search careers, jobs, courses..."
            value={query}
            onChange={e => doSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {!query && (
        <>
          <div style={S.sectionTitle}>💡 Try Searching For</div>
          <div style={{ padding: '0 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {suggestions.map(s => (
              <div key={s} style={{ ...S.bigTag }} onClick={() => doSearch(s)}>{s}</div>
            ))}
          </div>
        </>
      )}

      {loading && <div style={{ textAlign: 'center', padding: 30, color: '#a89fff' }}>Searching...</div>}

      {results.length > 0 && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ ...S.infoVal, marginBottom: 10, color: '#a89fff', fontSize: 13 }}>{results.length} results found</div>
          {results.map((r, i) => (
            <div key={i} style={S.listRow} onClick={() => onSelectResult(r.payload)}>
              <div style={S.listIcon}>{r.icon}</div>
              <div>
                <div style={S.listTitle}>{r.title}</div>
                <div style={{ ...S.listSub }}><span style={S.badge}>{r.type}</span></div>
              </div>
              <div style={S.arrow}>→</div>
            </div>
          ))}
        </div>
      )}

      {query && !loading && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48 }}>🔎</div>
          <div style={{ color: '#a89fff', marginTop: 12, fontSize: 15, fontWeight: 700 }}>No results found for "{query}"</div>
          <div style={{ color: '#666', marginTop: 6, fontSize: 13 }}>Try a different keyword</div>
        </div>
      )}
    </div>
  );
}

function TrendingJobDetail({ job, onBack, t, savedCareers = [], onToggleSave, onAddToCompare }) {
  if (!job) return null;
  const isBookmarked = savedCareers.some(item => item.careerId === job.id);

  return (
    <div style={S.page}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Header
        title={`${job.icon || '🔥'} ${job.title}`}
        showBack
        onBack={onBack}
        isBookmarked={isBookmarked}
        onToggleBookmarked={() => onToggleSave({
          id: job.id,
          title: job.title,
          icon: job.icon || '🔥',
          type: 'Trending Career',
          payload: { type: 'trending', jobId: job.id }
        })}
      />

      <div style={{ animation: 'fadeIn 0.4s ease' }}>
        {/* Hero */}
        <div style={S.heroBox}>
          <div style={{ fontSize: 58, marginBottom: 8 }}>{job.icon || '🔥'}</div>
          <div style={{ ...S.heroTitle, fontSize: 22 }}>{job.title}</div>
          <div style={{ marginTop: 8 }}>
            <span style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', borderRadius: 20, padding: '4px 16px', fontSize: 12, fontWeight: 800 }}>
              🔥 {job.growth} Growth
            </span>
          </div>
        </div>



        {/* Salary Package */}
        <div style={S.detailBox}>
          <div style={S.salaryBox}>
            <div style={S.label}>💰 Salary Package</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#34d399', marginTop: 4 }}>{job.salary}</div>
          </div>
        </div>

        <div style={S.detailBox}>
          <div style={S.label}>🗺️ {t('roadmap')}</div>
          <RoadmapTimeline steps={[
            { title: "Build academic base", subtitle: "Complete baseline studies", desc: job.higherStudies && job.higherStudies.length > 0 ? `Acquire relevant educational credentials to set up your path: ${job.higherStudies.slice(0, 2).join(', ')}.` : "Complete baseline college studies in relevant disciplines." },
            { title: "Focus on hot skills", subtitle: "Master modern methods", desc: job.skills && job.skills.length > 0 ? `Develop trending industry capabilities to remain highly competitive: ${job.skills.slice(0, 3).join(', ')}.` : "Develop specialized and high-demand domain competencies." },
            { title: "Gain tool mastery", subtitle: "Learn industry software", desc: job.tools && job.tools.length > 0 ? `Gain advanced fluency in critical industry tools and technologies: ${job.tools.slice(0, 3).join(', ')}.` : "Master essential software platforms and tech systems." },
            { title: "Verify your expertise", subtitle: "Earn technical credentials", desc: job.certifications && job.certifications.length > 0 ? `Validate your abilities by securing credentials: ${job.certifications.slice(0, 3).join(', ')}.` : "Secure key professional certifications to stand out." },
            { title: "Scale your career", subtitle: "Settle in top tech hubs", desc: `Apply for premium opportunities in leading employment markets: ${job.locations && job.locations.length > 0 ? job.locations.slice(0, 3).join(', ') : 'major metropolitan areas'} with a high average starting salary of ${job.salary || 'competitive figures'}.` }
          ]} />
        </div>

        {/* Job Description */}
        <div style={S.detailBox}>
          <div style={S.label}>📋 Job Description</div>
          <div style={{ ...S.infoVal, marginTop: 6, fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6 }}>{job.description}</div>
        </div>

        {/* Skills Required */}
        {job.skills && job.skills.length > 0 && (
          <div style={S.detailBox}>
            <div style={S.label}>🧠 Skills Required</div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {job.skills.map(skill => (
                <span key={skill} style={S.pill}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* Tools & Technologies */}
        {job.tools && job.tools.length > 0 && (
          <div style={S.detailBox}>
            <div style={S.label}>🛠️ Tools & Technologies</div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {job.tools.map(tool => (
                <span key={tool} style={S.tag}>{tool}</span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {job.certifications && job.certifications.length > 0 && (
          <div style={S.detailBox}>
            <div style={S.label}>🏆 Certifications</div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {job.certifications.map(cert => (
                <span key={cert} style={S.tag}>{cert}</span>
              ))}
            </div>
          </div>
        )}

        {/* Higher Studies */}
        {job.higherStudies && job.higherStudies.length > 0 && (
          <div style={S.detailBox}>
            <div style={S.label}>🎓 Higher Studies</div>
            <div style={{ marginTop: 8 }}>
              {job.higherStudies.map((hs, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ color: '#818cf8', fontSize: 16 }}>🎓</div>
                  <div style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 600 }}>{hs}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Future Scope */}
        {job.futureScope && (
          <div style={S.detailBox}>
            <div style={S.label}>🔮 Future Scope</div>
            <div style={{ ...S.infoVal, marginTop: 6, fontSize: 13, color: 'var(--text-sub)', lineHeight: 1.6 }}>{job.futureScope}</div>
          </div>
        )}

        {/* Best Locations */}
        {job.locations && job.locations.length > 0 && (
          <div style={{ ...S.detailBox, marginBottom: 100 }}>
            <div style={S.label}>📍 Best Locations</div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {job.locations.map(loc => (
                <span key={loc} style={S.bigTag}>{loc}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TECH LEARNING HUB PAGE ──────────────────────────────────────
function TechLearningHubPage({ onBack, t, onOpenSettings }) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [errorMsg, setErrorMsg] = useState(null);
  const [techs, setTechs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [youtubeTech, setYoutubeTech] = useState(null);

  useEffect(() => {
    fetch(`${API}/technologies`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Sort alphabetically by name
          data.sort((a, b) => a.name.localeCompare(b.name));
          setTechs(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading technologies from Firebase:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const categories = [
    "All",
    "Languages",
    "Web Development",
    "Mobile",
    "AI & Cloud",
    "DevOps & OS",
    "Databases",
    "Security & Web3",
    "Software Eng & Practice"
  ];

  const filteredTech = techs.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(search.toLowerCase()) ||
      tech.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCat === "All" || tech.category === selectedCat;
    return matchesSearch && matchesCategory;
  });

  const handleCardClick = (tech) => {
    try {
      if (!tech.url) {
        throw new Error("No URL");
      }
      const win = window.open(tech.url, "_blank", "noopener,noreferrer");
      if (!win) {
        setErrorMsg("This learning resource is currently unavailable.");
      }
    } catch (e) {
      setErrorMsg("This learning resource is currently unavailable.");
    }
  };

  const handleYoutubeClick = (tech) => {
    setYoutubeTech(tech);
  };

  const getDomain = (urlStr) => {
    try {
      return new URL(urlStr).hostname.replace("www.", "");
    } catch (e) {
      return "link";
    }
  };

  const styles = {
    container: { padding: '24px 16px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '120px' },
    searchContainer: { marginBottom: '20px', position: 'relative' },
    searchInput: {
      width: '100%',
      padding: '14px 20px',
      borderRadius: '16px',
      border: '1px solid var(--border-color)',
      background: 'var(--card-bg)',
      color: 'var(--text-main)',
      fontSize: '15px',
      fontWeight: '500',
      outline: 'none',
      boxSizing: 'border-box',
      boxShadow: '0 4px 12px var(--card-shadow)',
      transition: 'all 0.2s ease',
    },
    filterRow: {
      display: 'flex',
      overflowX: 'auto',
      gap: '8px',
      marginBottom: '24px',
      paddingBottom: '8px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },
    chip: (isSelected) => ({
      padding: '8px 16px',
      borderRadius: '20px',
      border: '1px solid var(--border-color)',
      fontSize: '13px',
      fontWeight: '700',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease',
      background: isSelected ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--card-bg)',
      color: isSelected ? '#fff' : 'var(--text-sub)',
      boxShadow: isSelected ? '0 4px 10px var(--accent-glow)' : 'none',
    }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' },
    card: {
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-card)',
      padding: '24px 20px',
      transition: 'var(--transition-smooth)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 30px var(--card-shadow)',
      boxSizing: 'border-box',
    },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
    cardIcon: {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
      border: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
    },
    cardTitle: { fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' },
    cardTag: {
      fontSize: '11px',
      fontWeight: '700',
      padding: '4px 10px',
      borderRadius: '12px',
      background: 'rgba(99, 102, 241, 0.1)',
      color: 'var(--primary)',
      width: 'fit-content',
      marginBottom: '12px',
    },
    cardDesc: { fontSize: '13px', color: 'var(--text-sub)', lineHeight: '1.5', marginBottom: '16px', flexGrow: 1 },
    cardLink: { fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }
  };

  const YoutubeChannelModal = ({ tech, onClose }) => {
    if (!tech) return null;
    const channels = getYoutubeChannels(tech.id);

    const handleOpen = (channel) => {
      if (!channel || !channel.url) {
        setErrorMsg("Channel unavailable.");
        return;
      }

      const url = channel.url.trim();

      if (!url.startsWith("https://www.youtube.com/")) {
        setErrorMsg("Channel unavailable.");
        return;
      }

      try {
        const win = window.open(url, "_blank", "noopener,noreferrer");
        if (!win) {
          setErrorMsg("Unable to open YouTube. Please try again.");
        }
      } catch (err) {
        setErrorMsg("Unable to open YouTube. Please try again.");
      }
    };

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          animation: 'fadeIn 0.25s ease'
        }}
        onClick={onClose}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        `}</style>
        <div
          style={{
            background: 'var(--bg-container)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            width: '90%',
            maxWidth: '480px',
            padding: '28px 24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>📺</span>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  Choose Your Preferred Language
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 600 }}>
                  YouTube learning channels for {tech.name}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-sub)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 800,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            >
              ×
            </button>
          </div>

          {/* Body Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* English Channel Option */}
            <div
              onClick={() => handleOpen(channels.en)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🛑
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {channels.en.name}
                    <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '20px', fontWeight: '800' }}>
                      🇬🇧 English
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Official/Curated tutorial channel
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleOpen(channels.en); }}
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px var(--accent-glow)'
                }}
              >
                Open ↗
              </button>
            </div>

            {/* Telugu Channel Option */}
            <div
              onClick={() => handleOpen(channels.te)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🛑
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {channels.te.name}
                    <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '2px 8px', borderRadius: '20px', fontWeight: '800' }}>
                      🇮🇳 Telugu
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Regional learning tutor
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleOpen(channels.te); }}
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px var(--accent-glow)'
                }}
              >
                Open ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ ...S.page, position: 'relative' }}>
      <Header title={t('techLearning') || "Tech Learning Hub"} showBack onBack={onBack} onOpenSettings={onOpenSettings} />

      {errorMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(239, 68, 68, 0.95)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(239, 68, 68, 0.4)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: 700,
          fontSize: '14px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          animation: 'slideDown 0.3s ease'
        }}>
          <span>⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '16px', cursor: 'pointer', fontWeight: 800 }}>×</button>
        </div>
      )}

      {youtubeTech && (
        <YoutubeChannelModal tech={youtubeTech} onClose={() => setYoutubeTech(null)} />
      )}

      <div style={styles.container}>
        <div style={{ ...S.heroBox, padding: '10px 0 24px 0' }}>
          <div style={{ ...S.heroTitle, fontSize: '26px' }}>💻 Tech Learning Hub</div>
          <div style={S.heroSub}>Access the best official documentation and curated tutorials directly</div>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Search for HTML, JavaScript, Next.js, Docker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterRow} className="hide-scrollbar">
          {categories.map(cat => (
            <div
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={styles.chip(selectedCat === cat)}
              onMouseEnter={e => {
                if (selectedCat !== cat) {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
                }
              }}
              onMouseLeave={e => {
                if (selectedCat !== cat) {
                  e.currentTarget.style.background = 'var(--card-bg)';
                }
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        {loading ? (
          <div style={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ ...styles.card, opacity: 0.6, cursor: 'default' }}>
                <div>
                  <div style={styles.cardHeader}>
                    <div style={{ ...styles.cardIcon, background: 'rgba(148, 163, 184, 0.1)', border: 'none' }}></div>
                    <div style={{ width: '100px', height: '16px', background: 'rgba(148, 163, 184, 0.2)', borderRadius: '4px' }}></div>
                  </div>
                  <div style={{ width: '60px', height: '12px', background: 'rgba(148, 163, 184, 0.15)', borderRadius: '4px', marginBottom: '12px' }}></div>
                  <div style={{ width: '100%', height: '36px', background: 'rgba(148, 163, 184, 0.1)', borderRadius: '4px', marginBottom: '16px' }}></div>
                </div>
                <div style={{ width: '80px', height: '10px', background: 'rgba(148, 163, 184, 0.1)', borderRadius: '4px' }}></div>
              </div>
            ))}
          </div>
        ) : filteredTech.length > 0 ? (
          <div style={styles.grid}>
            {filteredTech.map(tech => (
              <div
                key={tech.id}
                style={styles.card}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 8px 25px var(--accent-glow)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = '0 4px 15px var(--card-shadow)';
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <div style={styles.cardHeader}>
                    <div style={styles.cardIcon}>{tech.icon}</div>
                    <div style={styles.cardTitle}>{tech.name}</div>
                  </div>
                  <div style={styles.cardTag}>{tech.category}</div>
                  <div style={styles.cardDesc}>{tech.description}</div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-color)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  <button
                    onClick={() => handleCardClick(tech)}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-sub)',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  >
                    🔗 Docs
                  </button>
                  <button
                    onClick={() => handleYoutubeClick(tech)}
                    style={{
                      flex: 1,
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#f87171',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                    }}
                  >
                    📺 YouTube
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-sub)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>No learning resources found</div>
            <div style={{ fontSize: '14px' }}>Try adjusting your search criteria or category filter.</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APTITUDE CHEATSHEET PAGE ────────────────────────────────────
function AptitudeCheatsheetPage({ onBack, t, onOpenSettings }) {
  const [activeTab, setActiveTab] = useState('time-work');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Practice Quiz States
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizTopic, setQuizTopic] = useState('time-work');
  const [difficulty, setDifficulty] = useState(null); // 'easy' | 'medium' | 'hard'
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleStartQuiz = (diff, topicId = quizTopic) => {
    const filtered = allAptitudeQuestions.filter(q => q.topic === topicId && q.difficulty === diff);
    let selected = [];
    if (filtered.length === 0) {
      const fallbackFiltered = allAptitudeQuestions.filter(q => q.topic === topicId);
      if (fallbackFiltered.length > 0) {
        selected = [...fallbackFiltered].sort(() => 0.5 - Math.random());
      } else {
        selected = [...allAptitudeQuestions].sort(() => 0.5 - Math.random());
      }
    } else {
      selected = [...filtered].sort(() => 0.5 - Math.random());
    }
    setQuizQuestions(selected);
    setDifficulty(diff);
    setQuizTopic(topicId);
    setCurrentIdx(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setQuizFinished(false);
  };

  const jumpToQuestion = (idx) => {
    setCurrentIdx(idx);
    const ua = userAnswers.find(ans => ans.qIndex === idx);
    if (ua) {
      setSelectedAns(ua.selected);
      setIsAnswered(true);
    } else {
      setSelectedAns(null);
      setIsAnswered(false);
    }
  };

  const handleAnswerSelect = (option) => {
    if (isAnswered) return;
    setSelectedAns(option);
    setIsAnswered(true);

    const correct = quizQuestions[currentIdx].answer;
    const isCorrect = option === correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => {
      const filtered = prev.filter(ua => ua.qIndex !== currentIdx);
      return [
        ...filtered,
        {
          qIndex: currentIdx,
          question: quizQuestions[currentIdx].q,
          options: quizQuestions[currentIdx].options,
          selected: option,
          correct: correct,
          isCorrect: isCorrect,
          explanation: quizQuestions[currentIdx].explanation,
          shortcut: quizQuestions[currentIdx].shortcut,
          company: quizQuestions[currentIdx].company
        }
      ].sort((a, b) => a.qIndex - b.qIndex);
    });
  };

  const handleNextQuestion = () => {
    if (currentIdx < quizQuestions.length - 1) {
      jumpToQuestion(currentIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const categories = [
    { id: 'time-work', label: 'Time & Work', icon: '⏱️' },
    { id: 'averages', label: 'Averages', icon: '📊' },
    { id: 'profit-loss', label: 'Profit & Loss', icon: '💰' },
    { id: 'percentages', label: 'Percentages', icon: '📈' },
    { id: 'ratio-proportion', label: 'Ratio & Prop', icon: '⚖️' },
    { id: 'squares', label: 'Square Numbers', icon: '🔢' },
    { id: 'probability', label: 'Probability', icon: '🎲' },
    { id: 'interest', label: 'Interest (SI/CI)', icon: '📈' },
    { id: 'number-system', label: 'Number System', icon: '🔢' },
    { id: 'pipes-cisterns', label: 'Pipes & Cisterns', icon: '🚰' },
  ];

  const getSquaresData = () => {
    const cols = [[], [], [], []];
    for (let i = 1; i <= 25; i++) {
      cols[0].push({ num: i, val: i * i });
      cols[1].push({ num: i + 25, val: (i + 25) * (i + 25) });
      cols[2].push({ num: i + 50, val: (i + 50) * (i + 50) });
      cols[3].push({ num: i + 75, val: (i + 75) * (i + 75) });
    }
    return cols;
  };

  const squaresColumns = getSquaresData();

  const renderFormula = (formulaText) => {
    return <div dangerouslySetInnerHTML={{ __html: formulaText }} />;
  };

  const getSearchResults = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return null;

    const matches = [];

    Object.keys(aptitudeData).forEach(catId => {
      const category = aptitudeData[catId];
      if (catId === 'percentages') {
        const matchingFractions = [];
        category.columns.forEach(col => {
          col.forEach(row => {
            if (row.fraction.includes(query) || row.percentage.includes(query)) {
              matchingFractions.push(row);
            }
          });
        });
        if (matchingFractions.length > 0) {
          matches.push({
            categoryTitle: category.title,
            categoryIcon: category.icon,
            type: 'percentages',
            items: matchingFractions
          });
        }
      } else if (catId === 'squares') {
        const matchingSquares = [];
        for (let i = 1; i <= 100; i++) {
          const numStr = `${i}`;
          const sqStr = `${i * i}`;
          if (numStr.includes(query) || sqStr.includes(query)) {
            matchingSquares.push({ num: i, val: i * i });
          }
        }
        if (matchingSquares.length > 0) {
          matches.push({
            categoryTitle: category.title,
            categoryIcon: category.icon,
            type: 'squares',
            items: matchingSquares
          });
        }
      } else {
        const matchingItems = category.items.filter(item => {
          const inName = item.name.toLowerCase().includes(query);
          const inFormula = item.formula ? item.formula.toLowerCase().includes(query) : false;
          const inNote = item.note ? item.note.toLowerCase().includes(query) : false;
          const inExample = item.example ? (item.example.q.toLowerCase().includes(query) || item.example.ans.toLowerCase().includes(query)) : false;
          return inName || inFormula || inNote || inExample;
        });

        if (matchingItems.length > 0) {
          matches.push({
            categoryTitle: category.title,
            categoryIcon: category.icon,
            type: 'standard',
            items: matchingItems
          });
        }
      }
    });

    return matches;
  };

  const searchResults = getSearchResults();

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .math-box {
          font-family: 'Courier New', Courier, monospace;
          background: rgba(15, 23, 42, 0.85);
          border-left: 3px solid var(--primary);
          padding: 10px 14px;
          border-radius: 6px;
          margin-top: 8px;
          color: var(--primary);
          font-size: 13px;
          line-height: 1.5;
        }
        .example-box {
          background: rgba(245, 158, 11, 0.05);
          border: 1px dashed rgba(245, 158, 11, 0.3);
          border-radius: 8px;
          padding: 12px;
          margin-top: 10px;
        }
        .step-row {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          font-size: 12px;
          color: var(--text-sub);
          line-height: 1.4;
        }
        .ans-badge {
          background: rgba(52, 211, 153, 0.15);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.3);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 11px;
          display: inline-block;
          margin-top: 8px;
        }
        .percent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        .percent-cell {
          background: var(--bg-mid);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-main);
        }
      `}</style>

      <Header title={t('aptitude')} showBack onBack={onBack} onOpenSettings={onOpenSettings} />

      {/* Tab Select Mode */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '4px',
        maxWidth: '320px',
        margin: '16px auto',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 20
      }}>
        <button
          onClick={() => {
            setShowQuiz(false);
            setDifficulty(null);
            setQuizFinished(false);
          }}
          style={{
            flex: 1,
            border: 'none',
            borderRadius: '12px',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            background: !showQuiz ? 'var(--primary)' : 'transparent',
            color: '#fff',
            transition: 'all 0.2s ease'
          }}
        >
          ⚡ Cheatsheet
        </button>
        <button
          onClick={() => {
            setShowQuiz(true);
            setDifficulty(null);
            setQuizFinished(false);
          }}
          style={{
            flex: 1,
            border: 'none',
            borderRadius: '12px',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            background: showQuiz ? 'var(--primary)' : 'transparent',
            color: '#fff',
            transition: 'all 0.2s ease'
          }}
        >
          📝 Practice Quiz
        </button>
      </div>

      {!showQuiz ? (
        <>
          <div style={S.heroBox}>
            <div style={{ ...S.heroTitle, fontSize: 22 }}>Aptitude Cheatsheet ⚡</div>
            <div style={S.heroSub}>Master core math formulas, fraction grids & solved entrance shortcuts</div>
          </div>

          <div style={S.searchBox}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
            <input
              style={S.searchInput}
              placeholder="Search formulas, shortcuts, e.g. LCM..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQuery.trim() !== '' ? (
            <div style={{ padding: '0 16px 80px', animation: 'fadeIn 0.3s ease' }}>
              <div style={S.label}>🔎 Search Results for "{searchQuery}"</div>
              {searchResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                  <div style={{ fontSize: 40 }}>❔</div>
                  <div style={{ marginTop: 8, fontWeight: 700 }}>No formulas found matching "{searchQuery}"</div>
                </div>
              ) : (
                searchResults.map((catMatch, idx) => (
                  <div key={idx} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#f59e0b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{catMatch.categoryIcon}</span>
                      <span>{catMatch.categoryTitle}</span>
                    </div>

                    {catMatch.type === 'percentages' ? (
                      <div className="percent-grid">
                        {catMatch.items.map((row, rIdx) => (
                          <div key={rIdx} className="percent-cell">
                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{row.fraction}</span>
                            <span style={{ color: 'var(--text-main)' }}>= {row.percentage}</span>
                          </div>
                        ))}
                      </div>
                    ) : catMatch.type === 'squares' ? (
                      <div className="percent-grid">
                        {catMatch.items.map((row, rIdx) => (
                          <div key={rIdx} className="percent-cell">
                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{row.num}²</span>
                            <span style={{ color: 'var(--text-main)' }}>= {row.val}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      catMatch.items.map((item, itemIdx) => (
                        <div key={itemIdx} style={S.detailBox}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{item.name}</div>
                          {item.formula && (
                            <div className="math-box">{renderFormula(item.formula)}</div>
                          )}
                          {item.note && (
                            <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 6, fontStyle: 'italic' }}>
                              💡 Note: {renderFormula(item.note)}
                            </div>
                          )}
                          {item.example && (
                            <div className="example-box">
                              <div style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b' }}>✍️ Solved Practice:</div>
                              <div style={{ fontSize: 13, color: 'var(--text-main)', marginTop: 4, fontWeight: 600 }}>{item.example.q}</div>
                              {item.example.steps && (
                                <div style={{ marginTop: 6 }}>
                                  {item.example.steps.map((step, sIdx) => (
                                    <div key={sIdx} className="step-row">
                                      <span>•</span>
                                      <span>{step}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="ans-badge">Ans: {item.example.ans}</div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              <div style={S.tabRow}>
                {categories.map(c => (
                  <div
                    key={c.id}
                    style={{ ...S.tab, ...(activeTab === c.id ? S.tabActive : {}) }}
                    onClick={() => setActiveTab(c.id)}
                  >
                    {c.icon} {c.label}
                  </div>
                ))}
              </div>

              <div style={{ padding: '8px 0 80px', animation: 'fadeIn 0.3s ease' }}>
                {activeTab === 'percentages' ? (
                  <div style={S.detailBox}>
                    <div style={S.label}>Fraction to Percentage Conversion</div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10 }}>
                      {aptitudeData.percentages.columns.map((col, colIdx) => (
                        <div key={colIdx} style={{ flex: 1, minWidth: 140, background: 'var(--bg-mid)', padding: 10, borderRadius: 12, border: '1px solid var(--border-color)' }}>
                          {col.map((row, rowIdx) => (
                            <div key={rowIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: rowIdx === col.length - 1 ? 'none' : '1px solid var(--border-color)', fontSize: 13 }}>
                              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{row.fraction}</span>
                              <span style={{ color: 'var(--text-main)' }}>= {row.percentage}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : activeTab === 'squares' ? (
                  <div style={S.detailBox}>
                    <div style={S.label}>🔢 Square Numbers (1 to 100)</div>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10 }}>
                      {squaresColumns.map((col, colIdx) => (
                        <div key={colIdx} style={{ flex: 1, minWidth: 140, background: 'var(--bg-mid)', padding: 10, borderRadius: 12, border: '1px solid var(--border-color)' }}>
                          {col.map((row, rowIdx) => (
                            <div key={rowIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: rowIdx === col.length - 1 ? 'none' : '1px solid var(--border-color)', fontSize: 13 }}>
                              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{row.num}²</span>
                              <span style={{ color: 'var(--text-main)' }}>= {row.val}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  aptitudeData[activeTab] && aptitudeData[activeTab].items ? (
                    aptitudeData[activeTab].items.map((item) => (
                      <div key={item.id} style={S.detailBox}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{item.name}</div>
                        {item.formula && (
                          <div className="math-box">{renderFormula(item.formula)}</div>
                        )}
                        {item.note && (
                          <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 6, fontStyle: 'italic' }}>
                            💡 Note: {renderFormula(item.note)}
                          </div>
                        )}
                        {item.example && (
                          <div className="example-box">
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b' }}>✍️ Solved Practice:</div>
                            <div style={{ fontSize: 13, color: 'var(--text-main)', marginTop: 4, fontWeight: 600 }}>{item.example.q}</div>
                            {item.example.steps && (
                              <div style={{ marginTop: 6 }}>
                                {item.example.steps.map((step, sIdx) => (
                                  <div key={sIdx} className="step-row">
                                    <span>•</span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="ans-badge">Ans: {item.example.ans}</div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                      <div style={{ fontSize: 40 }}>📖</div>
                      <div style={{ marginTop: 8, fontWeight: 700 }}>Formula sheet empty for this section. Try the Practice Quiz!</div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </>
      ) : (
        difficulty === null ? (
          <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '500px', margin: '0 auto', padding: '0 16px 80px' }}>
            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: 'var(--primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Select Topic
              </label>
              <select
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--card-bg)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  fontWeight: '700',
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px var(--glass-shadow)'
                }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} style={{ background: 'var(--bg-mid)', color: 'var(--text-main)' }}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>Select Quiz Difficulty</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '4px' }}>
                Test your understanding of {categories.find(c => c.id === quizTopic)?.label || 'this topic'} with random questions.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                onClick={() => handleStartQuiz('easy')}
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1.5px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '20px',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#10b981' }}>🟢 EASY LEVEL</span>
                  <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 8px', borderRadius: '8px', fontWeight: 800 }}>
                    {allAptitudeQuestions.filter(q => q.topic === quizTopic && q.difficulty === 'easy').length} Qs Database
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '8px', lineHeight: 1.4 }}>
                  Covers fundamental formulas, simple terminology, and basic direct calculations. Best for beginners.
                </p>
              </div>

              <div
                onClick={() => handleStartQuiz('medium')}
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1.5px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '20px',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#f59e0b' }}>🟡 MEDIUM LEVEL</span>
                  <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '2px 8px', borderRadius: '8px', fontWeight: 800 }}>
                    {allAptitudeQuestions.filter(q => q.topic === quizTopic && q.difficulty === 'medium').length} Qs Database
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '8px', lineHeight: 1.4 }}>
                  Covers intermediate word problems, multi-stage computations, and helpful shortcuts. Ideal for revision.
                </p>
              </div>

              <div
                onClick={() => handleStartQuiz('hard')}
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1.5px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '20px',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '900', color: '#ef4444' }}>🔴 HARD LEVEL</span>
                  <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 8px', borderRadius: '8px', fontWeight: 800 }}>
                    {allAptitudeQuestions.filter(q => q.topic === quizTopic && q.difficulty === 'hard').length} Qs Database
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '8px', lineHeight: 1.4 }}>
                  Covers advanced logical twists, combined concepts, and tougher exam-level configurations.
                </p>
              </div>
            </div>
          </div>
        ) : quizFinished ? (
          <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: '500px', margin: '0 auto', padding: '0 16px 80px' }}>
            <div style={{
              background: 'var(--card-bg)',
              border: '1.5px solid var(--border-color)',
              borderRadius: '28px',
              padding: '32px 24px',
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                {score >= 8 ? '🏆' : score >= 5 ? '👏' : '📚'}
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'Outfit' }}>Quiz Completed!</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '4px' }}>
                You took the {categories.find(c => c.id === quizTopic)?.label || 'Aptitude'} {difficulty.toUpperCase()} level quiz.
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'baseline',
                margin: '28px 0',
                fontFamily: 'Outfit'
              }}>
                <span style={{ fontSize: '54px', fontWeight: 900, color: 'var(--primary)' }}>{score}</span>
                <span style={{ fontSize: '24px', color: 'var(--text-sub)', margin: '0 6px' }}>/</span>
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)' }}>{quizQuestions.length}</span>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '16px',
                padding: '12px 18px',
                fontSize: '12px',
                color: 'var(--text-sub)',
                lineHeight: 1.5,
                marginBottom: '28px'
              }}>
                {score >= 8
                  ? `Fantastic! You have excellent control over ${categories.find(c => c.id === quizTopic)?.label || 'this topic'} problems. Ready to take on tougher mock tests!`
                  : score >= 5
                    ? 'Good job! You have a solid grasp of the basics. Review the shortcuts to improve your timing.'
                    : 'Keep practicing! Review the cheatsheet formulas and try again to build your speed and accuracy.'}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setDifficulty(null)}
                  className="premium-btn"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    fontSize: '12px',
                    fontWeight: '800'
                  }}
                >
                  🔄 Try Another Level
                </button>
                <button
                  onClick={() => handleStartQuiz(difficulty)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    fontSize: '12px',
                    fontWeight: '800',
                    background: 'transparent',
                    border: '1.5px solid var(--border-color)',
                    color: 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  🔁 Retry Level
                </button>
              </div>
            </div>

            {/* Review breakdown */}
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Outfit', marginBottom: '14px' }}>Review Questions:</h4>
              {quizQuestions.map((q, qIdx) => {
                const ua = userAnswers.find(ans => ans.qIndex === qIdx);
                const isSkipped = !ua;

                return (
                  <div
                    key={qIdx}
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '16px',
                      marginBottom: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: isSkipped ? '#f59e0b' : ua.isCorrect ? '#10b981' : '#ef4444'
                      }}>
                        {isSkipped ? '⚠️ SKIPPED' : ua.isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}
                      </span>
                      {q.company && (
                        <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>🏢 {q.company}</span>
                      )}
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                      Q{qIdx + 1}. {q.q}
                    </div>

                    {isSkipped ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                        Correct Answer: <span style={{ color: '#10b981', fontWeight: '700' }}>{q.answer}</span>
                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                        Your Answer: <span style={{ color: ua.isCorrect ? '#10b981' : '#ef4444', fontWeight: '700' }}>{ua.selected}</span>
                        {!ua.isCorrect && (
                          <span> | Correct: <span style={{ color: '#10b981', fontWeight: '700' }}>{ua.correct}</span></span>
                        )}
                      </div>
                    )}

                    <div style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      color: 'var(--text-sub)',
                      lineHeight: 1.4
                    }}>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Question */
          quizQuestions.length > 0 && (
            <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '600px', margin: '0 auto', padding: '0 16px 80px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-sub)', marginBottom: '8px', fontWeight: 700 }}>
                <span>Question {currentIdx + 1} of {quizQuestions.length}</span>
                <span style={{ color: 'var(--primary)' }}>Score: {score}/{currentIdx + (isAnswered ? 1 : 0)}</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  width: `${((currentIdx + 1) / quizQuestions.length) * 100}%`,
                  height: '100%',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* Question Navigation Palette */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '24px',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                padding: '12px',
                borderRadius: '16px'
              }}>
                {quizQuestions.map((q, idx) => {
                  const ua = userAnswers.find(ans => ans.qIndex === idx);
                  const isAnsweredQ = !!ua;
                  const isActive = idx === currentIdx;

                  return (
                    <button
                      key={idx}
                      onClick={() => jumpToQuestion(idx)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: isActive ? '2px solid var(--primary)' : '1.5px solid var(--border-color)',
                        background: isAnsweredQ
                          ? 'rgba(16, 185, 129, 0.15)'
                          : isActive
                            ? 'rgba(99, 102, 241, 0.2)'
                            : 'rgba(255, 255, 255, 0.03)',
                        color: isAnsweredQ
                          ? '#10b981'
                          : isActive
                            ? 'var(--primary)'
                            : 'var(--text-sub)',
                        fontWeight: '800',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 0 10px rgba(99, 102, 241, 0.3)' : 'none'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '24px', backdropFilter: 'blur(20px)', marginBottom: '20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '3px 10px', borderRadius: '8px', fontWeight: 800 }}>
                    {quizQuestions[currentIdx].category}
                  </span>
                  {quizQuestions[currentIdx].company && (
                    <span style={{ fontSize: '11px', color: 'var(--text-sub)', fontWeight: 600 }}>
                      🏢 {quizQuestions[currentIdx].company}
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.5', fontFamily: 'Outfit', margin: '0 0 20px 0' }}>
                  {quizQuestions[currentIdx].q}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {quizQuestions[currentIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedAns === opt;
                    const isCorrectOpt = opt === quizQuestions[currentIdx].answer;

                    let optStyle = {};

                    if (isAnswered) {
                      if (isCorrectOpt) {
                        optStyle = {
                          background: 'rgba(16, 185, 129, 0.08)',
                          borderColor: '#10b981',
                          color: '#10b981',
                          boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
                        };
                      } else if (isSelected) {
                        optStyle = {
                          background: 'rgba(239, 68, 68, 0.08)',
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)'
                        };
                      } else {
                        optStyle = {
                          background: 'rgba(255, 255, 255, 0.01)',
                          borderColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'rgba(255, 255, 255, 0.3)',
                          cursor: 'not-allowed'
                        };
                      }
                    } else {
                      optStyle = {
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-main)',
                        cursor: 'pointer'
                      };
                    }

                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleAnswerSelect(opt)}
                        style={{
                          borderRadius: '16px',
                          padding: '14px 18px',
                          fontSize: '14px',
                          fontWeight: '700',
                          border: '1.5px solid var(--border-color)',
                          transition: 'all 0.2s ease',
                          ...optStyle
                        }}
                      >
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div style={{ marginTop: '24px', borderTop: '1.5px dashed var(--border-color)', paddingTop: '20px', animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#f59e0b', marginBottom: '8px' }}>
                      ✍️ Solved Explanation:
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-sub)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                      {quizQuestions[currentIdx].explanation}
                    </p>
                    {quizQuestions[currentIdx].shortcut && (
                      <div style={{
                        background: 'rgba(99, 102, 241, 0.06)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        fontSize: '11px',
                        color: '#a5b4fc',
                        lineHeight: 1.4
                      }}>
                        💡 <strong>Shortcut Method</strong>: {quizQuestions[currentIdx].shortcut}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="premium-btn"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '16px',
                    fontWeight: '900',
                    fontSize: '14px',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  {currentIdx < quizQuestions.length - 1 ? 'Next Question ➡️' : 'Finish Quiz 🏆'}
                </button>
              )}
            </div>
          )
        )
      )}
    </div>
  );
}

// ─── TRANSLATION DICTIONARY ──────────────────────────────────────
const dict = {
  en: {
    appName: "CareerPath AI 🎓",
    exploreCareers: "🚀 Explore Careers",
    startQuiz: "🚀 Start Quiz",
    retake: "🔄 Retake",
    exploreRec: "➔ Explore Recommendation",
    home: "Home",
    after10th: "After 10th",
    after12th: "After 12th",
    graduation: "After Graduation",
    aptitude: "Aptitude",
    techLearning: "Learning Hub",
    search: "Search",
    settings: "Settings",
    education: "Education",
    ai: "AI Guidance",
    profileTab: "Profile",
    theme: "Theme Customization",
    language: "Language",
    profile: "Profile Settings",
    sounds: "App Sound Effects",
    resetProgress: "Reset Quiz & Application Data",
    about: "About",
    heroTitle: "Discover Your Perfect Career Path 🚀",
    heroSub: "AI-powered guidance for every student",
    step1title: "Which subject area excites you the most?",
    step2title: "What is your preferred problem-solving style?",
    step3title: "What is your current academic stage?",
    trendingTitle: "🔥 Trending Careers 2026",
    whyTitle: "💡 Why CareerPath AI?",
    upcomingExams: "📅 Upcoming Entrance Exams",
    compareCareers: "⚖️ Compare Careers",
    addToCompare: "⚖️ Add to Compare",
    comparing: "Comparing",
    roadmap: "🗺️ Career Roadmap",
    daysLeft: "days left",
    back: "← Back",
    logout: "🚪 Logout",
    save: "💾 Save Settings",
    profileUpdated: "Profile updated successfully!",
    dataReset: "App data reset successfully!"
  },
  hi: {
    appName: "करियरपाथ एआई 🎓",
    exploreCareers: "🚀 करियर खोजें",
    startQuiz: "🚀 क्विज़ शुरू करें",
    retake: "🔄 पुनः लें",
    exploreRec: "➔ सिफारिश का अन्वेषण करें",
    home: "होम",
    after10th: "10वीं के बाद",
    after12th: "12वीं के बाद",
    graduation: "ग्रेजुएशन के बाद",
    aptitude: "अभिरुचि",
    techLearning: "लर्निंग हब",
    search: "खोजें",
    settings: "सेटिंग्स",
    education: "शिक्षा",
    ai: "एआई मार्गदर्शन",
    profileTab: "प्रोफ़ाइल",
    theme: "थीम अनुकूलन",
    language: "भाषा",
    profile: "प्रोफ़ाइल सेटिंग्स",
    sounds: "ऐप ध्वनि प्रभाव",
    resetProgress: "क्विज़ और ऐप डेटा रीसेट करें",
    about: "विवरण",
    heroTitle: "अपना आदर्श करियर पथ खोजें 🚀",
    heroSub: "हर छात्र के लिए एआई-संचालित मार्गदर्शन",
    step1title: "कौन सा विषय क्षेत्र आपको सबसे अधिक उत्साहित करता है?",
    step2title: "आपकी पसंदीदा समस्या-समाधान शैली क्या है?",
    step3title: "आपका वर्तमान शैक्षणिक चरण क्या है?",
    trendingTitle: "🔥 ट्रेंडिंग करियर 2026",
    whyTitle: "💡 करियरपाथ एआई क्यों?",
    upcomingExams: "📅 आगामी प्रवेश परीक्षाएँ",
    compareCareers: "⚖️ करियर की तुलना करें",
    addToCompare: "⚖️ तुलना में जोड़ें",
    comparing: "तुलना कर रहे हैं",
    roadmap: "🗺️ करियर रोडमैप",
    daysLeft: "दिन शेष",
    back: "← वापस",
    logout: "🚪 लॉगआउट",
    save: "💾 सेटिंग्स सहेजें",
    profileUpdated: "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!",
    dataReset: "ऐप डेटा सफलतापूर्वक रीसेट हो गया!"
  },
  te: {
    appName: "కెరీర్‌పాత్ AI 🎓",
    exploreCareers: "🚀 కెరీర్‌లను అన్వేషించండి",
    startQuiz: "🚀 క్విజ్ ప్రారంభించండి",
    retake: "🔄 మళ్ళీ చేయండి",
    exploreRec: "➔ సిఫార్సును అన్వేషించండి",
    home: "హోమ్",
    after10th: "10వ తరగతి తర్వాత",
    after12th: "12వ తరగతి తర్వాత",
    graduation: "గ్రాడ్యుయేషన్ తర్వాత",
    aptitude: "ఆప్టిట్యూడ్",
    techLearning: "లెర్నింగ్ హబ్",
    search: "శోధించండి",
    settings: "సెట్టింగులు",
    education: "విద్య",
    ai: "AI మార్గదర్శకత్వం",
    profileTab: "ప్రొఫైల్",
    theme: "థీమ్ అనుకూలీకరణ",
    language: "భాష",
    profile: "ప్రొఫైల్ సెట్టింగులు",
    sounds: "యాప్ సౌండ్ ఎఫెక్ట్స్",
    resetProgress: "క్విజ్ & యాప్ డేటా రీసెట్",
    about: "యాప్ గురించి",
    heroTitle: "మీ ఖచ్చితమైన కెరీర్ మార్గాన్ని కనుగొనండి 🚀",
    heroSub: "ప్రతి విద్యార్థి కోసం AI-శక్తితో కూడిన మార్గదర్శకత్వం",
    step1title: "ఏ విషయ రంగం మిమ్మల్ని ఎక్కువగా ఉత్తేజపరుస్తుంది?",
    step2title: "మీకు ఇష్టమైన సమస్య-పరిష్కార శైలి ఏది?",
    step3title: "మీ ప్రస్తుత విద్యా దశ ఏమిటి?",
    trendingTitle: "🔥 ట్రెండింగ్ కెరీర్స్ 2026",
    whyTitle: "💡 కెరీర్‌పాత్ AI ఎందుకు?",
    upcomingExams: "📅 రాబోయే ప్రవేశ పరీక్షలు",
    compareCareers: "⚖️ కెరీర్లను పోల్చండి",
    addToCompare: "⚖️ పోలికకు జోడించండి",
    comparing: "పోలుస్తున్నారు",
    roadmap: "🗺️ కెరీర్ రోడ్‌మ్యాప్",
    daysLeft: "రోజులు మిగిలి ఉన్నాయి",
    back: "← వెనుకకు",
    logout: "🚪 లాగ్అవుట్",
    save: "💾 సెట్టింగులను సేవ్ చేయి",
    profileUpdated: "ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది!",
    dataReset: "యాప్ డేటా విజయవంతంగా రీసెట్ చేయబడింది!"
  },
  es: {
    appName: "CareerPath AI 🎓",
    exploreCareers: "🚀 Explorar Carreras",
    startQuiz: "🚀 Iniciar Cuestionario",
    retake: "🔄 Repetir",
    exploreRec: "➔ Explorar Recomendación",
    home: "Inicio",
    after10th: "Después de 10º",
    after12th: "Después de 12º",
    graduation: "Después de Graduación",
    aptitude: "Aptitud",
    techLearning: "Centro de Aprendizaje",
    search: "Buscar",
    settings: "Configuración",
    education: "Educación",
    ai: "Guía de IA",
    profileTab: "Perfil",
    theme: "Personalizar Tema",
    language: "Idioma",
    profile: "Configuración de Perfil",
    sounds: "Efectos de Sonido",
    resetProgress: "Restablecer Datos de la App",
    about: "Acerca de",
    heroTitle: "Descubre tu Carrera Perfecta 🚀",
    heroSub: "Guía impulsada por IA para cada estudiante",
    step1title: "¿Qué área de estudio te entusiasma más?",
    step2title: "¿Cuál es tu estilo preferido de resolución de problemas?",
    step3title: "¿Cuál es tu nivel académico actual?",
    trendingTitle: "🔥 Carreras Tendencia 2026",
    whyTitle: "💡 ¿Por qué CareerPath AI?",
    upcomingExams: "📅 Próximos Exámenes de Admisión",
    compareCareers: "⚖️ Comparar Carreras",
    addToCompare: "⚖️ Añadir a Comparar",
    comparing: "Comparando",
    roadmap: "🗺️ Mapa de Ruta de Carrera",
    daysLeft: "días restantes",
    back: "← Volver",
    logout: "🚪 Cerrar Sesión",
    save: "💾 Guardar Configuración",
    profileUpdated: "¡Perfil actualizado con éxito!",
    dataReset: "¡Datos de la aplicación restablecidos con éxito!"
  }
};

// ─── THEME CONFIGURATIONS ────────────────────────────────────────
const themes = {
  cosmic: {
    '--primary': '#38bdf8', // Cyan
    '--secondary': '#818cf8', // Indigo
    '--bg-start': '#090f1d',
    '--bg-mid': '#0d1527',
    '--bg-end': '#070b15',
    '--accent-glow': 'rgba(56, 189, 248, 0.15)',
    '--card-bg': 'rgba(15, 23, 42, 0.45)',
    '--border-color': 'rgba(56, 189, 248, 0.15)',
  },
  neon: {
    '--primary': '#ec4899', // Pink
    '--secondary': '#a855f7', // Purple
    '--bg-start': '#08030f',
    '--bg-mid': '#0e061a',
    '--bg-end': '#05020a',
    '--accent-glow': 'rgba(236, 72, 153, 0.15)',
    '--card-bg': 'rgba(20, 10, 30, 0.5)',
    '--border-color': 'rgba(236, 72, 153, 0.2)',
  },
  emerald: {
    '--primary': '#10b981', // Mint
    '--secondary': '#14b8a6', // Teal
    '--bg-start': '#020f0c',
    '--bg-mid': '#051b16',
    '--bg-end': '#010907',
    '--accent-glow': 'rgba(16, 185, 129, 0.15)',
    '--card-bg': 'rgba(5, 25, 20, 0.45)',
    '--border-color': 'rgba(16, 185, 129, 0.15)',
  },
  amber: {
    '--primary': '#fbbf24', // Gold
    '--secondary': '#f97316', // Orange
    '--bg-start': '#0f0b04',
    '--bg-mid': '#1b1307',
    '--bg-end': '#0a0702',
    '--accent-glow': 'rgba(251, 191, 36, 0.15)',
    '--card-bg': 'rgba(25, 20, 10, 0.45)',
    '--border-color': 'rgba(251, 191, 36, 0.18)',
  },
  sapphire: {
    '--primary': '#06b6d4', // Cyan/Azure
    '--secondary': '#3b82f6', // Sapphire Blue
    '--bg-start': '#030d1e',
    '--bg-mid': '#051632',
    '--bg-end': '#020915',
    '--accent-glow': 'rgba(6, 182, 212, 0.15)',
    '--card-bg': 'rgba(10, 25, 50, 0.45)',
    '--border-color': 'rgba(6, 182, 212, 0.15)',
  },
  ruby: {
    '--primary': '#f43f5e', // Rose/Ruby Red
    '--secondary': '#db2777', // Deep Pink
    '--bg-start': '#110208',
    '--bg-mid': '#1e0510',
    '--bg-end': '#0a0105',
    '--accent-glow': 'rgba(244, 63, 94, 0.15)',
    '--card-bg': 'rgba(30, 5, 15, 0.45)',
    '--border-color': 'rgba(244, 63, 94, 0.15)',
  },
  orchid: {
    '--primary': '#d946ef', // Orchid/Fuchsia
    '--secondary': '#8b5cf6', // Violet
    '--bg-start': '#0d0214',
    '--bg-mid': '#1a0429',
    '--bg-end': '#07010b',
    '--accent-glow': 'rgba(217, 70, 239, 0.15)',
    '--card-bg': 'rgba(25, 5, 40, 0.45)',
    '--border-color': 'rgba(217, 70, 239, 0.15)',
  },
  sunset: {
    '--primary': '#f97316', // Orange
    '--secondary': '#ec4899', // Pink
    '--bg-start': '#120502',
    '--bg-mid': '#220b05',
    '--bg-end': '#0b0201',
    '--accent-glow': 'rgba(249, 115, 22, 0.15)',
    '--card-bg': 'rgba(30, 10, 5, 0.45)',
    '--border-color': 'rgba(249, 115, 22, 0.15)',
  }
};

// ─── UI SOUND EFFECT UTILITY ──────────────────────────────────────
const playClickSound = (isEnabled) => {
  if (!isEnabled) return;
  try {
    const soundType = localStorage.getItem('cp_sound_type') || 'chime';
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Helper to play a single tone envelope
    const playEnvelope = (type, startFreq, endFreq, maxGain, duration, delay = 0) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime + delay);
      if (endFreq && endFreq !== startFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + delay + duration);
      }

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(maxGain, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration + 0.05);
    };

    switch (soundType) {
      case 'chime': // 1. Melodic Chime
        playEnvelope('sine', 523.25, 523.25, 0.02, 0.25, 0); // C5
        playEnvelope('sine', 659.25, 659.25, 0.02, 0.25, 0.05); // E5
        break;
      case 'cyber': // 2. Cyber Click
        playEnvelope('sine', 1200, 800, 0.03, 0.04);
        break;
      case 'bubble': // 3. Pop Bubble
        playEnvelope('sine', 200, 1000, 0.04, 0.08);
        break;
      case 'beep': // 4. Classic Beep
        playEnvelope('square', 880, 880, 0.015, 0.1);
        break;
      case 'laser': // 5. Laser Zap
        playEnvelope('sawtooth', 1500, 150, 0.015, 0.15);
        break;
      case 'thud': // 6. Soft Thud
        playEnvelope('triangle', 150, 60, 0.05, 0.12);
        break;
      case 'sweep': // 7. Synth Sweep
        playEnvelope('triangle', 300, 800, 0.03, 0.15);
        break;
      case 'jump': // 8. Retro Jump
        playEnvelope('sine', 400, 800, 0.025, 0.18);
        break;
      case 'ping': // 9. Echo Ping
        playEnvelope('sine', 1300, 1300, 0.03, 0.35);
        break;
      case 'chirp': // 10. Digital Chirp
        playEnvelope('sine', 900, 1400, 0.02, 0.06, 0);
        playEnvelope('sine', 1100, 1600, 0.02, 0.06, 0.05);
        break;
      default:
        playEnvelope('sine', 523.25, 523.25, 0.02, 0.25, 0);
        playEnvelope('sine', 659.25, 659.25, 0.02, 0.25, 0.05);
        break;
    }
  } catch (e) { }
};

// ─── TIMELINE ROADMAP COMPONENT ───────────────────────────────────
function RoadmapTimeline({ steps }) {
  const stepEmojis = ['🎓', '🛠️', '🧪', '🏆', '💼'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', paddingLeft: 38, margin: '18px 4px 8px' }}>
      <style>{`
        .roadmap-step-card {
          position: relative;
          transition: all 0.3s ease;
        }
        .roadmap-step-card:hover {
          transform: translateX(6px);
        }
        .roadmap-step-card:hover .step-card-content {
          border-color: var(--primary) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 8px 30px var(--glass-shadow) !important;
        }
        .roadmap-step-card:hover .step-bubble {
          border-color: var(--secondary) !important;
          box-shadow: 0 0 12px var(--secondary) !important;
          transform: scale(1.15);
        }
      `}</style>
      <div style={{ position: 'absolute', left: 16, top: 12, bottom: 12, width: 2, background: 'linear-gradient(to bottom, var(--primary), var(--secondary))', opacity: 0.4 }} />
      {steps.map((step, idx) => {
        const emoji = stepEmojis[idx] || '🎯';
        return (
          <div key={idx} className="roadmap-step-card">
            <div className="step-bubble" style={{
              position: 'absolute',
              left: -38,
              top: 6,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--bg-mid)',
              border: '2.5px solid var(--primary)',
              boxShadow: '0 0 8px var(--accent-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              transition: 'all 0.3s ease',
              zIndex: 2
            }}>
              {emoji}
            </div>
            <div className="step-card-content" style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid var(--border-color)',
              borderRadius: 14,
              padding: '14px 16px',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 }}>Step {idx + 1}: {step.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 800, marginBottom: 2 }}>{step.subtitle}</div>
              <div style={{ fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.5 }}>{step.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── UPCOMING ENTRANCE EXAMS CALENDAR ─────────────────────────────
function ExamCalendar({ t, lang, soundEnabled }) {
  const exams = [
    { name: "JEE Main 2027", date: "2027-01-15T09:00:00", link: "https://jeemain.nta.nic.in/", info: "Engineering entrance for IITs/NITs" },
    { name: "NEET UG 2027", date: "2027-05-02T10:00:00", link: "https://neet.nta.nic.in/", info: "Medical entrance for MBBS/BDS" },
    { name: "CLAT 2027", date: "2026-12-06T14:00:00", link: "https://consortiumofnlus.ac.in/", info: "Law entrance for National Law Universities" },
    { name: "CAT 2026", date: "2026-11-29T09:00:00", link: "https://iimcat.ac.in/", info: "Post-graduate business entrance for IIMs" }
  ];

  const calculateDaysLeft = (targetDate) => {
    const difference = +new Date(targetDate) - +new Date();
    let days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="premium-glass-card" style={{ padding: '24px', margin: '16px 20px' }}>
      <div style={S.label}>{t('upcomingExams')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
        {exams.map(exam => {
          const days = calculateDaysLeft(exam.date);
          const percent = Math.max(0, Math.min(100, (days / 365) * 100));
          return (
            <div key={exam.name} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{exam.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{exam.info}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: days < 100 ? '#f87171' : 'var(--primary)' }}>{days}</div>
                  <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>{t('daysLeft')}</div>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', height: 6, borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg, var(--primary), var(--secondary))', height: '100%', width: `${Math.max(10, 100 - percent)}%`, borderRadius: 3, boxShadow: '0 0 8px var(--primary)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <a href={exam.link} target="_blank" rel="noreferrer" onClick={() => playClickSound(soundEnabled)}
                  style={{ color: 'var(--primary)', fontSize: 11, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
                  Info Link ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── GEMINI FLOATING CHAT WINDOW ──────────────────────────────────
// ─── GEMINI FLOATING CHAT WINDOW ──────────────────────────────────

const MarkdownMessage = ({ text }) => {
  if (!text) return null;
  const lines = text.split('\n');
  const rendered = [];
  let currentList = [];
  let listType = null;
  let inTable = false;
  let tableRows = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      if (listType === 'ol') {
        rendered.push(
          <ol key={key} style={{ paddingLeft: '20px', margin: '4px 0 10px 0', fontSize: '13px', color: 'var(--text-sub)' }}>
            {currentList}
          </ol>
        );
      } else {
        rendered.push(
          <ul key={key} style={{ paddingLeft: '20px', margin: '4px 0 10px 0', listStyleType: 'disc', fontSize: '13px', color: 'var(--text-sub)' }}>
            {currentList}
          </ul>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      rendered.push(
        <div key={key} style={{ overflowX: 'auto', margin: '8px 0 12px 0' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
            color: 'var(--text-sub)',
            border: '1px solid var(--border-color)'
          }}>
            <tbody>
              {tableRows}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const parseBoldText = (str) => {
    const workingParts = str.split(/\*\*(.*?)\*\*/g);
    return workingParts.map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: 'var(--primary)', fontWeight: '800' }}>{part}</strong> : part);
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check if it's a table row (e.g. | Header | Header2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList(`list-before-table-${idx}`);
      if (!inTable) {
        inTable = true;
      }
      // Skip separator row |---|---|
      if (trimmed.includes('---')) {
        return;
      }
      const cells = trimmed
        .split('|')
        .slice(1, -1)
        .map(c => c.trim());

      const isHeader = tableRows.length === 0;
      tableRows.push(
        <tr key={`tr-${idx}`} style={{ borderBottom: '1px solid var(--border-color)' }}>
          {cells.map((cell, cIdx) => {
            const cellContent = parseBoldText(cell);
            return isHeader ? (
              <th key={`th-${cIdx}`} style={{
                padding: '6px 10px',
                background: 'rgba(56, 189, 248, 0.1)',
                textAlign: 'left',
                fontWeight: '800',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)'
              }}>{cellContent}</th>
            ) : (
              <td key={`td-${cIdx}`} style={{
                padding: '6px 10px',
                border: '1px solid var(--border-color)'
              }}>{cellContent}</td>
            );
          })}
        </tr>
      );
      return;
    } else {
      flushTable(`table-before-text-${idx}`);
    }

    // Headers (starting with section emojis or markdown hashes)
    const headerMatch = trimmed.match(/^#+\s*(.*)$/) || trimmed.match(/^(\s*[🎯📖🛣💡⚠📚✅].*)$/);
    if (headerMatch) {
      flushList(`list-before-h-${idx}`);
      rendered.push(
        <div key={`h-${idx}`} style={{
          fontSize: '13px',
          fontWeight: '900',
          color: 'var(--text-main)',
          marginTop: '12px',
          marginBottom: '6px',
          fontFamily: 'Outfit',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '3px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {headerMatch[1]}
        </div>
      );
      return;
    }

    // Numbered lists
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (listType !== 'ol') {
        flushList(`list-before-ol-${idx}`);
        listType = 'ol';
      }
      currentList.push(<li key={`li-${idx}`} style={{ marginBottom: '3px' }}>{parseBoldText(olMatch[2])}</li>);
      return;
    }

    // Bullet lists
    const ulMatch = trimmed.match(/^[\*\-]\s+(.*)$/);
    if (ulMatch) {
      if (listType !== 'ul') {
        flushList(`list-before-ul-${idx}`);
        listType = 'ul';
      }
      currentList.push(<li key={`li-${idx}`} style={{ marginBottom: '3px' }}>{parseBoldText(ulMatch[1])}</li>);
      return;
    }

    // Empty lines
    if (!trimmed) {
      flushList(`list-before-empty-${idx}`);
      return;
    }

    // Normal text
    flushList(`list-before-p-${idx}`);
    rendered.push(
      <p key={`p-${idx}`} style={{ fontSize: '12px', lineHeight: '1.5', margin: '3px 0 6px 0', color: 'var(--text-sub)' }}>
        {parseBoldText(trimmed)}
      </p>
    );
  });

  flushList('list-final');
  flushTable('table-final');
  return <div>{rendered}</div>;
};

function GeminiFloatingWindow({ onClose, soundEnabled, currentPage, selectedTrendingJob, initialPrompt, onClearInitialPrompt }) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'gemini', text: 'Hello! I am your CareerPath AI Assistant. Ask me anything about career options, college prep, or exam strategies!\n\nTo analyze your current screen, click the 📷 button. You can also upload a resume or certificate using the 📎 button.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const chatEndRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
      if (typeof onClearInitialPrompt === 'function') {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  const compileScreenContext = () => {
    try {
      const headings = [];
      document.querySelectorAll('h1, h2, h3, h4').forEach(el => {
        if (el.innerText) headings.push(el.innerText.trim());
      });

      const buttons = [];
      document.querySelectorAll('button').forEach(el => {
        const txt = el.innerText?.trim();
        if (txt && txt.length < 30) buttons.push(txt);
      });

      const formFields = [];
      document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.type !== 'hidden' && el.type !== 'file') {
          formFields.push({
            placeholder: el.placeholder || el.name || '',
            value: el.value || '',
            type: el.type
          });
        }
      });

      const visibleTexts = [];
      document.querySelectorAll('p, span, li, td').forEach(el => {
        const text = el.innerText?.trim();
        if (text && text.length > 8 && text.length < 250 && !text.includes('Gemini') && !text.includes('Assistant')) {
          visibleTexts.push(text);
        }
      });

      return {
        currentPage: currentPage || 'home',
        selectedTrendingJob: selectedTrendingJob ? selectedTrendingJob.title : 'None',
        headings: headings.slice(0, 10),
        buttons: buttons.slice(0, 8),
        formFields: formFields.slice(0, 6),
        visibleTexts: visibleTexts.slice(0, 15)
      };
    } catch (e) {
      console.warn("Could not compile screen context:", e);
      return { currentPage: currentPage || 'home' };
    }
  };

  const handleSend = async (forcedPrompt = null) => {
    let userMessage = forcedPrompt || prompt.trim();
    if (!userMessage && !attachedImage) return;

    if (!userMessage && attachedImage) {
      userMessage = "Analyze this attached image and provide your feedback.";
    }

    setPrompt('');
    const imagePayload = attachedImage;
    setAttachedImage(null);

    setMessages(prev => [...prev, {
      sender: 'user',
      text: userMessage || 'Sent an attachment',
      image: imagePayload
    }]);

    setLoading(true);
    if (typeof playClickSound === 'function') {
      playClickSound(soundEnabled);
    }

    const historyPayload = messages.slice(1).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      text: msg.text
    }));

    const screenContext = compileScreenContext();

    try {
      const response = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: historyPayload,
          screenContext,
          image: imagePayload
        })
      });

      const data = await response.json();
      if (data.success && data.response) {
        setMessages(prev => [...prev, { sender: 'gemini', text: data.response }]);
      } else {
        throw new Error(data.error || 'Server returned invalid response');
      }
    } catch (err) {
      console.error('Error querying chat API:', err);
      setMessages(prev => [...prev, {
        sender: 'gemini',
        text: `🎯 Direct Answer\nSorry, I failed to process that request.\n\n📖 Explanation\nThe connection to the backend server failed.\n\n🛣 Step-by-Step Guide\n1. Ensure the backend server is running.\n2. Verify your Gemini API Key is active.\n\n✅ Next Action\n- Try resubmitting your message!`
      }]);
    }
    setLoading(false);
  };

  const handleScreenshot = async () => {
    setLoading(true);
    try {
      const chatContainer = document.querySelector('[data-testid="chat-container"]') || document.getElementById('chat-window-panel');
      if (chatContainer) chatContainer.style.display = 'none';

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0d1527'
      });

      if (chatContainer) chatContainer.style.display = 'flex';

      const base64Str = canvas.toDataURL('image/jpeg', 0.7);
      setAttachedImage({
        base64: base64Str.split(',')[1],
        mimeType: 'image/jpeg',
        name: 'screenshot.jpg'
      });

      if (!prompt.trim()) {
        setPrompt('Explain this screen.');
      }
    } catch (e) {
      console.error("Screenshot capture failed:", e);
      alert("Screenshot capture failed. Please try again.");
    }
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedMimeTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.txt')) {
      alert("Please upload a valid image (PNG/JPG), PDF, Word document (.docx), or Text file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage({
        base64: reader.result.split(',')[1],
        mimeType: file.type || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain'),
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (!file) continue;

        const allowedMimeTypes = [
          'image/jpeg', 'image/png', 'image/gif', 'image/webp',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ];

        if (allowedMimeTypes.includes(file.type) || file.name.endsWith('.docx') || file.name.endsWith('.txt')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setAttachedImage({
              base64: reader.result.split(',')[1],
              mimeType: file.type || (file.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain'),
              name: file.name || 'pasted_file'
            });
          };
          reader.readAsDataURL(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  return (
    <div
      id="chat-window-panel"
      data-testid="chat-container"
      style={{
        position: 'fixed',
        bottom: '160px',
        right: '20px',
        width: '380px',
        height: '520px',
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 200px)',
        background: 'var(--bg-container)',
        backdropFilter: 'blur(24px)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden',
        animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-mid)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '20px' }}>🤖</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'Outfit' }}>CareerPath AI Assistant</div>
            <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>Connected to {currentPage || 'Home'}</div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'var(--border-color)',
          border: 'none',
          color: 'var(--text-main)',
          borderRadius: '50%',
          width: 28,
          height: 28,
          fontSize: 12,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--border-color)'}>✕</button>
      </div>

      {/* Messages List */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            {msg.image && (
              <img
                src={`data:${msg.image.mimeType};base64,${msg.image.base64}`}
                alt="attachment"
                style={{
                  width: '120px',
                  borderRadius: '10px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  border: '1px solid var(--border-color)'
                }}
              />
            )}
            <div style={{
              background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg-mid)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
              borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding: '12px 16px',
              fontSize: '13px',
              color: msg.sender === 'user' ? '#fff' : 'var(--text-main)',
              lineHeight: '1.5',
              boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(56, 189, 248, 0.15)' : 'none'
            }}>
              {msg.sender === 'user' ? (
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              ) : (
                <MarkdownMessage text={msg.text} />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            background: 'var(--bg-mid)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px 18px 18px 4px',
            padding: '10px 16px',
            fontSize: '13px',
            color: 'var(--text-sub)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{ display: 'inline-block', animation: 'spin 1.5s linear infinite' }}>⏳</span>
            <span>Assistant is typing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Attachment Preview Box */}
      {attachedImage && (
        <div style={{
          padding: '8px 14px',
          background: 'var(--bg-mid)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--primary)',
          fontWeight: 700
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📎 Attached: {attachedImage.name.length > 20 ? attachedImage.name.slice(0, 18) + '...' : attachedImage.name}</span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            style={{ background: 'none', border: 'none', color: '#ff7878', cursor: 'pointer', fontSize: '13px', fontWeight: 800 }}
          >Remove</button>
        </div>
      )}

      {/* Input Section */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        background: 'var(--bg-mid)'
      }}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.docx,.txt"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          title="Upload image, PDF, Word doc, or text file"
          style={{
            background: 'var(--bg-container)',
            border: '1px solid var(--border-color)',
            color: 'var(--primary)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-container)'}
        >
          📎
        </button>

        <button
          onClick={handleScreenshot}
          title="Capture and Analyze Screen"
          style={{
            background: 'var(--bg-container)',
            border: '1px solid var(--border-color)',
            color: 'var(--secondary)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(129, 140, 248, 0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-container)'}
        >
          📷
        </button>

        <input
          type="text"
          style={{
            flex: 1,
            padding: '10px 14px',
            background: 'var(--bg-container)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            color: 'var(--text-main)',
            fontSize: '13px',
            outline: 'none',
            fontFamily: 'Inter, sans-serif'
          }}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          onPaste={handlePaste}
          placeholder="Ask a question or paste a file..."
        />

        <button
          onClick={() => handleSend()}
          disabled={loading || (!prompt.trim() && !attachedImage)}
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            border: 'none',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            opacity: (!prompt.trim() && !attachedImage || loading) ? 0.6 : 1,
            transition: 'opacity 0.2s'
          }}
        >
          ➔
        </button>
      </div>
    </div>
  );
}

// ─── CAREER COMPARISON SYSTEM ────────────────────────────────────
function ComparisonOverlay({ compareList, onRemove, onClose, t }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(9, 15, 29, 0.96)', zIndex: 1000, overflowY: 'auto', padding: '20px 16px 100px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)', fontFamily: 'Outfit' }}>⚖️ {t('compareCareers')}</div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: '50%', width: 30, height: 30, fontSize: 16, cursor: 'pointer' }}>✕</button>
      </div>

      {compareList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>⚖️</div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>No careers added to compare yet</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Explore career detail pages and click "Add to Compare" to see side-by-side analysis.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 20 }}>
          {compareList.map(item => {
            let salary = item.salary || 'Competitive';
            if (typeof salary === 'object' && salary) {
              salary = `Fresher: ${salary.fresher || 'N/A'} | Exp: ${salary.experienced || 'N/A'}`;
            }
            const entrance = item.entranceExams || (item.courseDetails && item.courseDetails.entranceExams) || ['N/A'];
            const col = item.topColleges || (item.courseDetails && item.courseDetails.topColleges) || ['N/A'];
            const careerRoles = item.careers || item.jobs || [];

            return (
              <div key={item.id} style={{ flex: '0 0 280px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 16, position: 'relative', backdropFilter: 'blur(8px)' }}>
                <button onClick={() => onRemove(item.id)} style={{ position: 'absolute', right: 12, top: 12, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '50%', width: 22, height: 22, fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

                <div style={{ fontSize: 36, textAlign: 'center', margin: '8px 0' }}>{item.icon || '💼'}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', textAlign: 'center', minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.title}</div>
                <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', marginTop: 4 }}>{item.compareType}</div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>💰 SALARY RANGE</div>
                  <div style={{ fontSize: 12, color: '#6dffa0', fontWeight: 700, marginTop: 4 }}>{salary}</div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>📝 ENTRANCE EXAMS</div>
                  <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {Array.isArray(entrance) ? entrance.slice(0, 3).map(e => <span key={e} style={{ ...S.tag, margin: 0, fontSize: 9 }}>{e}</span>) : <span style={S.tag}>{entrance}</span>}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>🏫 TOP COLLEGES</div>
                  <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {Array.isArray(col) ? col.slice(0, 2).map(c => <span key={c} style={{ ...S.pill, margin: 0, padding: '2px 8px', fontSize: 9 }}>{c}</span>) : <span style={S.pill}>{col}</span>}
                  </div>
                </div>

                {item.skills && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>🧠 KEY SKILLS</div>
                    <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {item.skills.slice(0, 3).map(s => <span key={s} style={{ ...S.tag, margin: 0, fontSize: 9, background: 'rgba(56,189,248,0.06)' }}>{s}</span>)}
                    </div>
                  </div>
                )}

                {careerRoles.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>💼 ROLES</div>
                    <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {careerRoles.slice(0, 3).map(c => <span key={c.title || c} style={{ ...S.tag, margin: 0, fontSize: 9, color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)' }}>{c.title || c}</span>)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS PAGE COMPONENT ──────────────────────────────────────
function SettingsPage({ user, onUpdateUser, lang, onUpdateLang, theme, onUpdateTheme, soundEnabled, onUpdateSound, soundType, onUpdateSoundType, onResetData, onLogout, onBack, t, savedCareers = [], onSelectSavedCareer }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSaveProfile = () => {
    onUpdateUser({ ...user, name, email });
    setSuccessMsg(t('profileUpdated'));
    playClickSound(soundEnabled);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all quiz progress and local storage?")) {
      onResetData();
      playClickSound(soundEnabled);
      alert(t('dataReset'));
    }
  };

  return (
    <div style={S.page}>
      <Header title={t('settings')} showBack onBack={onBack} />

      <div style={S.heroBox}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>⚙️</div>
        <div style={{ ...S.heroTitle, fontSize: 22 }}>{t('settings')}</div>
        <div style={S.heroSub}>Customize app theme, interface language, and settings</div>
      </div>

      {successMsg && (
        <div style={{ ...S.authSuccess, margin: '0 16px 12px' }}>{successMsg}</div>
      )}

      {/* Profile Settings */}
      <div style={S.detailBox}>
        <div style={S.label}>{t('profile')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
          <input style={{ ...S.authInput, marginBottom: 0 }} type="text" placeholder="👤 Full Name" value={name} onChange={e => setName(e.target.value)} />
          <input style={{ ...S.authInput, marginBottom: 0 }} type="email" placeholder="📧 Email Address" value={email} onChange={e => setEmail(e.target.value)} />
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button style={{ ...S.authBtn, flex: 1, marginTop: 0 }} onClick={handleSaveProfile}>{t('save')}</button>
            <button style={{ ...S.authBtn, flex: 1, marginTop: 0, background: '#ef4444', border: 'none' }} onClick={onLogout}>{t('logout') || '🚪 Logout'}</button>
          </div>
        </div>
      </div>

      {/* Saved Careers Dashboard */}
      <div style={S.detailBox}>
        <div style={S.label}>⭐ Saved Careers ({savedCareers.length})</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {savedCareers.length === 0 ? (
            <div style={{ fontSize: 13, color: '#94a3b8', padding: '10px 0', textAlign: 'center', fontStyle: 'italic' }}>
              No saved careers yet. Explore courses, streams, or jobs and tap the star (★) to save them.
            </div>
          ) : (
            savedCareers.map(item => (
              <div key={item.id} style={{ ...S.listRow, marginBottom: 0 }} onClick={() => onSelectSavedCareer(item.payload)}>
                <div style={S.listIcon}>{item.icon || '💼'}</div>
                <div>
                  <div style={S.listTitle}>{item.title}</div>
                  <div style={{ ...S.listSub }}><span style={S.badge}>{item.type}</span></div>
                </div>
                <div style={S.arrow}>→</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Language settings */}
      <div style={S.detailBox}>
        <div style={S.label}>{t('language')}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {[
            { id: 'en', label: '🇬🇧 English' },
            { id: 'hi', label: '🇮🇳 हिंदी' },
            { id: 'te', label: '🇮🇳 తెలుగు' },
            { id: 'es', label: '🇪🇸 Español' }
          ].map(opt => (
            <div key={opt.id} onClick={() => { onUpdateLang(opt.id); playClickSound(soundEnabled); }}
              style={{
                flex: 1, minWidth: '100px', padding: '10px', borderRadius: 12, cursor: 'pointer', textAlign: 'center', fontWeight: 700, fontSize: 13,
                background: lang === opt.id ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
                color: lang === opt.id ? '#fff' : 'var(--text-sub)',
                border: lang === opt.id ? 'none' : '1px solid var(--border-color)',
                transition: 'all 0.2s'
              }}>
              {opt.label}
            </div>
          ))}
        </div>
      </div>

      {/* Theme selection */}
      <div style={S.detailBox}>
        <div style={S.label}>{t('theme')}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
          {[
            { id: 'cosmic', label: '🌌 Cosmic', primary: '#38bdf8' },
            { id: 'neon', label: '🔮 Neon', primary: '#ec4899' },
            { id: 'emerald', label: '🌿 Emerald', primary: '#10b981' },
            { id: 'amber', label: '🍂 Amber', primary: '#fbbf24' },
            { id: 'sapphire', label: '🛡️ Sapphire', primary: '#06b6d4' },
            { id: 'ruby', label: '💎 Ruby', primary: '#f43f5e' },
            { id: 'orchid', label: '🌸 Orchid', primary: '#d946ef' },
            { id: 'sunset', label: '🌅 Sunset', primary: '#f97316' }
          ].map(opt => (
            <div key={opt.id} onClick={() => { onUpdateTheme(opt.id); playClickSound(soundEnabled); }}
              style={{
                flex: 1, minWidth: '100px', padding: '10px', borderRadius: 12, cursor: 'pointer', textAlign: 'center', fontWeight: 700, fontSize: 13,
                background: theme === opt.id ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
                color: theme === opt.id ? '#fff' : 'var(--text-sub)',
                border: theme === opt.id ? 'none' : '1px solid var(--border-color)',
                transition: 'all 0.2s'
              }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: opt.primary, marginRight: 6 }} />
              {opt.label}
            </div>
          ))}
        </div>
      </div>

      {/* Sound Settings */}
      <div style={S.detailBox}>
        <div style={S.label}>{t('sounds')}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderBottom: soundEnabled ? '1px solid var(--border-color)' : 'none', paddingBottom: soundEnabled ? 10 : 0 }}>
          <span style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 600 }}>Enable UI Sounds:</span>
          <button onClick={() => { onUpdateSound(!soundEnabled); playClickSound(!soundEnabled); }}
            style={{
              padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: 700, fontSize: 12, border: soundEnabled ? 'none' : '1px solid var(--border-color)', transition: 'all 0.2s',
              background: soundEnabled ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
              color: soundEnabled ? '#fff' : 'var(--text-sub)'
            }}>
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {soundEnabled && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: 8 }}>Select Tone Effect (10 Options):</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {[
                { id: 'chime', label: '🔔 Melodic Chime' },
                { id: 'cyber', label: '💻 Cyber Click' },
                { id: 'bubble', label: '🫧 Pop Bubble' },
                { id: 'beep', label: '📟 Classic Beep' },
                { id: 'laser', label: '⚡ Laser Zap' },
                { id: 'thud', label: '🪵 Soft Thud' },
                { id: 'sweep', label: '🛸 Synth Sweep' },
                { id: 'jump', label: '🍄 Retro Jump' },
                { id: 'ping', label: '📡 Echo Ping' },
                { id: 'chirp', label: '🐦 Digital Chirp' }
              ].map(opt => (
                <div key={opt.id} onClick={() => onUpdateSoundType(opt.id)}
                  style={{
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                    textAlign: 'center', transition: 'all 0.2s',
                    background: soundType === opt.id ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(99, 102, 241, 0.05)',
                    color: soundType === opt.id ? '#fff' : 'var(--text-sub)',
                    border: soundType === opt.id ? 'none' : '1px solid var(--border-color)'
                  }}>
                  {opt.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>



      <div style={{ ...S.detailBox, marginBottom: 100 }}>
        <div style={S.label}>{t('about')}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginTop: 8 }}>
          <div>Product Name: <b>CareerPath AI</b></div>
          <div>Version: <b>2.1.0-Release</b></div>
          <div>Database Sync: <b>Graduation: 29K entries | 10th: 40 entries</b></div>
          <div style={{ marginTop: 6 }}>© 2026 CareerPath AI Team. All Rights Reserved.</div>
        </div>
      </div>
    </div>
  );
}

// ─── RESUME BUILDER PAGE ──────────────────────────────────────────
function ResumeBuilderPage({ onBack, t, user, soundEnabled }) {
  const [step, setStep] = useState(1); // 1: Personal, 2: Experience, 3: Education, 4: Skills, 5: Projects, 6: Certifications & Profiles, 7: Achievements & Others
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'design'

  const [profile, setProfile] = useState({
    name: user ? user.name : 'Saikiran Goud',
    title: 'Software Developer',
    email: user ? user.email : 'saikiran@example.com',
    phone: '+91 9876543210',
    location: 'Hyderabad, India',
    linkedin: 'linkedin.com/in/saikirangoud',
    github: 'github.com/saikirangoud',
    portfolio: 'saikiran.dev',
    summary: 'Enthusiastic and results-driven Software Developer with a passion for web application technologies, algorithm design, and building premium UI/UX interfaces. Experienced in React, Node.js, and Firebase integrations.'
  });

  const [experiences, setExperiences] = useState([
    {
      company: 'Tech Solutions Inc.',
      role: 'Frontend Developer Intern',
      duration: '2025 - Present',
      techUsed: 'React, JavaScript, CSS Grid, HTML5, REST APIs',
      details: 'Redesigned frontend codebases into modern responsive bento grids and built local resume compilation pipelines.\nOptimized database query interfaces reducing response latency by 15%.\nCollaborated in agile team sprints to deliver premium client-facing interfaces.'
    },
    {
      company: 'Innovate Lab',
      role: 'Software Assistant',
      duration: '2024 - 2025',
      techUsed: 'Node.js, Express, Firebase, MongoDB, Git',
      details: 'Collaborated on developing backend API endpoints and user authentication modules.\nManaged real-time database tables using Firebase and optimized queries.\nIncreased unit test coverage by 20% using Jest.'
    }
  ]);

  const [educations, setEducations] = useState([
    {
      school: 'National Institute of Technology',
      degree: 'B.Tech',
      specialization: 'Computer Science & Engineering',
      duration: '2022 - 2026',
      grade: 'CGPA: 8.5/10'
    }
  ]);

  // Structured technical skills
  const [techSkills, setTechSkills] = useState({
    languages: 'JavaScript, Python, C++, SQL',
    frameworks: 'React, Express.js, Node.js, HTML5, CSS3',
    databases: 'MongoDB, PostgreSQL, Firebase',
    cloud: 'AWS (S3, EC2), Google Cloud Platform',
    tools: 'Git, Docker, Postman, VS Code'
  });

  const [projects, setProjects] = useState([
    {
      name: 'CareerPath AI Application',
      techUsed: 'React, Node.js, Express, Firebase, Gemini API',
      description: 'An AI-powered career counseling platform matching student profiles with personalized roadmap pathways and resume parsing.',
      features: 'Interactive bento grid UI, custom AI-driven chatbot assistant, automated roadmap generation.',
      contribution: 'Designed frontend responsive layouts, integrated Gemini API endpoints, and optimized state management.'
    },
    {
      name: 'Smart Portfolio Builder',
      techUsed: 'React, HTML2Canvas, CSS Variables',
      description: 'An interactive portfolio editor showcasing user credentials, project cards, and customizable style sheets.',
      features: 'Live preview canvas, font/spacing customizations, print-to-PDF layout options.',
      contribution: 'Created printable page margins logic and customized CSS themes.'
    }
  ]);

  const [certifications, setCertifications] = useState([
    {
      name: 'Google Cloud Certified Associate Cloud Engineer',
      organization: 'Google Cloud',
      year: '2025'
    },
    {
      name: 'Full Stack Web Development Professional Certificate',
      organization: 'Meta',
      year: '2024'
    }
  ]);

  const [achievements, setAchievements] = useState({
    awards: 'Recipient of University Academic Merit Scholarship (2023 - 2025)',
    hackathons: '1st Runner Up in HackIndia National Hackathon out of 500+ teams',
    competitions: 'Ranked in Top 5% globally in Google Kickstart Round F',
    academic: 'Secured Department Rank 3 out of 120 students in CSE branch'
  });

  const [codingProfiles, setCodingProfiles] = useState({
    leetcode: 'leetcode.com/u/saikiran',
    hackerrank: 'hackerrank.com/saikiran',
    codechef: 'codechef.com/users/saikiran',
    codeforces: 'codeforces.com/profile/saikiran',
    geeksforgeeks: 'auth.geeksforgeeks.org/user/saikiran'
  });

  const [softSkills, setSoftSkills] = useState('Communication, Problem Solving, Teamwork, Leadership, Adaptability');
  const [languagesKnown, setLanguagesKnown] = useState('English, Hindi, Telugu');
  const [extracurricular, setExtracurricular] = useState('Volunteer at National Service Scheme (NSS), organizing blood donation camps.\nCoordinator of College Technical Festival Web Team.');
  const [interests, setInterests] = useState('Competitive Programming, UI/UX Design, Open Source Contribution');

  // Premium style configurations
  const [resumeTheme, setResumeTheme] = useState('cosmic'); // 'cosmic' | 'neon' | 'emerald' | 'sunset' | 'slate' | 'royal' | 'minimal'
  const [resumeFont, setResumeFont] = useState('sans'); // 'sans' | 'serif' | 'display' | 'mono' | 'elegant' | 'corporate'
  const [resumeLayout, setResumeLayout] = useState('split'); // 'stacked' | 'split'

  const [resumeFontSize, setResumeFontSize] = useState('medium'); // 'small' | 'medium' | 'large'
  const [resumeSpacing, setResumeSpacing] = useState('comfortable'); // 'compact' | 'comfortable' | 'spacious'

  const fontStyles = {
    sans: 'Inter, system-ui, sans-serif',
    serif: 'Lora, Merriweather, Georgia, serif',
    display: '"Playfair Display", serif',
    mono: '"JetBrains Mono", monospace',
    elegant: 'Merriweather, serif',
    corporate: '"Plus Jakarta Sans", sans-serif'
  };

  const fontSizes = {
    small: { body: '11px', header: '13px', title: '20px', sub: '10px' },
    medium: { body: '12px', header: '15px', title: '24px', sub: '11px' },
    large: { body: '13px', header: '17px', title: '28px', sub: '12px' }
  };

  const spacings = {
    compact: '12mm',
    comfortable: '20mm',
    spacious: '26mm'
  };

  const themesColor = {
    cosmic: { headerBg: 'linear-gradient(135deg, #6366f1, #a855f7)', border: '#6366f1', text: '#f8fafc', primaryText: '#6366f1', sideBg: 'rgba(99, 102, 241, 0.03)' },
    neon: { headerBg: 'linear-gradient(135deg, #ec4899, #a855f7)', border: '#ec4899', text: '#f8fafc', primaryText: '#ec4899', sideBg: 'rgba(236, 72, 153, 0.03)' },
    emerald: { headerBg: 'linear-gradient(135deg, #10b981, #14b8a6)', border: '#10b981', text: '#f8fafc', primaryText: '#10b981', sideBg: 'rgba(16, 185, 129, 0.03)' },
    sunset: { headerBg: 'linear-gradient(135deg, #f43f5e, #db2777)', border: '#f43f5e', text: '#f8fafc', primaryText: '#f43f5e', sideBg: 'rgba(244, 63, 94, 0.03)' },
    slate: { headerBg: 'linear-gradient(135deg, #334155, #64748b)', border: '#475569', text: '#f8fafc', primaryText: '#334155', sideBg: 'rgba(51, 65, 85, 0.03)' },
    royal: { headerBg: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', border: '#1d4ed8', text: '#f8fafc', primaryText: '#1d4ed8', sideBg: 'rgba(29, 78, 216, 0.03)' },
    minimal: { headerBg: '#f8fafc', border: '#1e293b', text: '#0f172a', primaryText: '#0f172a', sideBg: '#f1f5f9' }
  };

  const handlePrint = () => {
    if (typeof playClickSound === 'function') {
      playClickSound(soundEnabled);
    }
    window.print();
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = experiences.map((exp, i) => i === index ? { ...exp, [field]: value } : exp);
    setExperiences(updated);
  };

  const handleAddExperience = () => {
    setExperiences([...experiences, { company: '', role: '', duration: '', techUsed: '', details: '' }]);
  };

  const handleDeleteExperience = (index) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
  };

  const handleUpdateEducation = (index, field, value) => {
    const updated = educations.map((edu, i) => i === index ? { ...edu, [field]: value } : edu);
    setEducations(updated);
  };

  const handleAddEducation = () => {
    setEducations([...educations, { school: '', degree: '', specialization: '', duration: '', grade: '' }]);
  };

  const handleDeleteEducation = (index) => {
    if (educations.length > 1) {
      setEducations(educations.filter((_, i) => i !== index));
    }
  };

  const handleUpdateProject = (index, field, value) => {
    const updated = projects.map((proj, i) => i === index ? { ...proj, [field]: value } : proj);
    setProjects(updated);
  };

  const handleAddProject = () => {
    setProjects([...projects, { name: '', techUsed: '', description: '', features: '', contribution: '' }]);
  };

  const handleDeleteProject = (index) => {
    if (projects.length > 1) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const handleUpdateCertification = (index, field, value) => {
    const updated = certifications.map((cert, i) => i === index ? { ...cert, [field]: value } : cert);
    setCertifications(updated);
  };

  const handleAddCertification = () => {
    setCertifications([...certifications, { name: '', organization: '', year: '' }]);
  };

  const handleDeleteCertification = (index) => {
    if (certifications.length > 1) {
      setCertifications(certifications.filter((_, i) => i !== index));
    }
  };

  const activeFont = fontStyles[resumeFont] || fontStyles.sans;
  const activeFontSize = fontSizes[resumeFontSize] || fontSizes.medium;
  const activeSpacing = spacings[resumeSpacing] || spacings.comfortable;
  const activeTheme = themesColor[resumeTheme] || themesColor.cosmic;
  const isMinimal = resumeTheme === 'minimal';

  // ── RESUME PREVIEW SUB-COMPONENTS ───────────────────────────────

  const HeaderSection = () => (
    <div style={{
      background: isMinimal ? 'transparent' : activeTheme.headerBg,
      padding: isMinimal ? '0 0 12px 0' : '28px 24px',
      borderRadius: isMinimal ? 0 : '16px',
      borderBottom: isMinimal ? '2px solid #1e293b' : 'none',
      color: isMinimal ? '#0f172a' : '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }}>
      <h2 style={{ fontSize: activeFontSize.title, fontWeight: 900, fontFamily: activeFont, margin: 0, letterSpacing: '-0.5px' }}>
        {profile.name || 'Your Full Name'}
      </h2>
      <div style={{ fontSize: activeFontSize.header, fontWeight: 700, opacity: 0.9 }}>
        {profile.title || 'Professional Title'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '6px', fontSize: activeFontSize.sub, opacity: 0.85, fontWeight: 500 }}>
        {profile.email && <span>📧 {profile.email}</span>}
        {profile.phone && <span>📞 {profile.phone}</span>}
        {profile.location && <span>📍 {profile.location}</span>}
        {profile.linkedin && <span>🔗 {profile.linkedin}</span>}
        {profile.github && <span>💻 {profile.github}</span>}
        {profile.portfolio && <span>🌐 {profile.portfolio}</span>}
      </div>
    </div>
  );

  const SectionHeader = ({ title }) => (
    <h4 className="resume-section-header" style={{
      fontSize: activeFontSize.header,
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      borderBottom: `2px solid ${isMinimal ? '#1e293b' : activeTheme.border}`,
      paddingBottom: '4px',
      marginBottom: '10px',
      marginTop: '14px',
      color: isMinimal ? '#0f172a' : activeTheme.primaryText,
      fontFamily: activeFont
    }}>
      {title}
    </h4>
  );

  const SummarySection = () => profile.summary ? (
    <div style={{ marginBottom: '6px' }}>
      <SectionHeader title="Summary" />
      <p style={{ fontSize: activeFontSize.body, lineHeight: 1.5, color: isMinimal ? '#334155' : 'var(--text-sub)', whiteSpace: 'pre-wrap', margin: 0 }}>
        {profile.summary}
      </p>
    </div>
  ) : null;

  const ExperienceSection = () => (
    <div style={{ marginBottom: '6px' }}>
      <SectionHeader title="Work Experience" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {experiences.map((exp, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
              <div style={{ fontWeight: 800, fontSize: activeFontSize.body, color: isMinimal ? '#0f172a' : 'var(--text-main)' }}>
                {exp.role} — <span style={{ color: isMinimal ? '#475569' : activeTheme.primaryText }}>{exp.company}</span>
              </div>
              <span style={{ fontSize: activeFontSize.sub, color: isMinimal ? '#64748b' : 'var(--text-muted)', fontWeight: 600 }}>
                {exp.duration}
              </span>
            </div>
            {exp.techUsed && (
              <div style={{ fontSize: activeFontSize.sub, color: isMinimal ? '#475569' : 'var(--text-muted)', fontStyle: 'italic', fontWeight: 600 }}>
                Technologies Used: {exp.techUsed}
              </div>
            )}
            {exp.details && (
              <ul style={{ margin: '4px 0 0 18px', padding: 0, fontSize: activeFontSize.body, color: isMinimal ? '#334155' : 'var(--text-sub)', lineHeight: 1.5 }}>
                {exp.details.split('\n').filter(line => line.trim()).map((bullet, idx) => (
                  <li key={idx} style={{ marginBottom: '3px' }}>{bullet.replace(/^[•\-\*\s]+/, '')}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const EducationSection = () => (
    <div style={{ marginBottom: '6px' }}>
      <SectionHeader title="Education" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {educations.map((edu, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
              <div style={{ fontWeight: 800, fontSize: activeFontSize.body, color: isMinimal ? '#0f172a' : 'var(--text-main)' }}>
                {edu.degree}{edu.specialization ? ` in ${edu.specialization}` : ''}
              </div>
              <span style={{ fontSize: activeFontSize.sub, color: isMinimal ? '#64748b' : 'var(--text-muted)', fontWeight: 600 }}>
                {edu.duration}
              </span>
            </div>
            <div style={{ fontSize: activeFontSize.body, color: isMinimal ? '#475569' : 'var(--text-sub)', display: 'flex', justifyContent: 'space-between' }}>
              <span>{edu.school}</span>
              {edu.grade && (
                <span style={{ fontWeight: 700, color: isMinimal ? '#10b981' : '#34d399' }}>
                  {edu.grade}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProjectsSection = () => (
    <div style={{ marginBottom: '6px' }}>
      <SectionHeader title="Projects" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {projects.map((proj, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
              <span style={{ fontWeight: 800, fontSize: activeFontSize.body, color: isMinimal ? '#0f172a' : 'var(--text-main)' }}>
                {proj.name}
              </span>
              {proj.techUsed && (
                <span style={{ fontSize: activeFontSize.sub, color: isMinimal ? '#475569' : activeTheme.primaryText, fontWeight: 700 }}>
                  {proj.techUsed}
                </span>
              )}
            </div>
            {proj.description && (
              <p style={{ fontSize: activeFontSize.body, lineHeight: 1.4, color: isMinimal ? '#334155' : 'var(--text-sub)', margin: '2px 0 0 0' }}>
                <strong>Description:</strong> {proj.description}
              </p>
            )}
            {proj.features && (
              <p style={{ fontSize: activeFontSize.body, lineHeight: 1.4, color: isMinimal ? '#334155' : 'var(--text-sub)', margin: '2px 0 0 0' }}>
                <strong>Key Features:</strong> {proj.features}
              </p>
            )}
            {proj.contribution && (
              <p style={{ fontSize: activeFontSize.body, lineHeight: 1.4, color: isMinimal ? '#334155' : 'var(--text-sub)', margin: '2px 0 0 0' }}>
                <strong>Your Contribution:</strong> {proj.contribution}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const SkillsSection = () => {
    const hasSkills = techSkills.languages || techSkills.frameworks || techSkills.databases || techSkills.cloud || techSkills.tools;
    return hasSkills ? (
      <div style={{ marginBottom: '6px' }}>
        <SectionHeader title="Technical Skills" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {techSkills.languages && (
            <div style={{ fontSize: activeFontSize.body, color: isMinimal ? '#334155' : 'var(--text-sub)' }}>
              <strong>Languages:</strong> {techSkills.languages}
            </div>
          )}
          {techSkills.frameworks && (
            <div style={{ fontSize: activeFontSize.body, color: isMinimal ? '#334155' : 'var(--text-sub)' }}>
              <strong>Frameworks & Tech:</strong> {techSkills.frameworks}
            </div>
          )}
          {techSkills.databases && (
            <div style={{ fontSize: activeFontSize.body, color: isMinimal ? '#334155' : 'var(--text-sub)' }}>
              <strong>Databases:</strong> {techSkills.databases}
            </div>
          )}
          {techSkills.cloud && (
            <div style={{ fontSize: activeFontSize.body, color: isMinimal ? '#334155' : 'var(--text-sub)' }}>
              <strong>Cloud Platforms:</strong> {techSkills.cloud}
            </div>
          )}
          {techSkills.tools && (
            <div style={{ fontSize: activeFontSize.body, color: isMinimal ? '#334155' : 'var(--text-sub)' }}>
              <strong>Tools:</strong> {techSkills.tools}
            </div>
          )}
        </div>
      </div>
    ) : null;
  };

  const CertificationsSection = () => certifications.length > 0 ? (
    <div style={{ marginBottom: '6px' }}>
      <SectionHeader title="Certifications" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {certifications.map((cert, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: activeFontSize.body }}>
            <span style={{ color: isMinimal ? '#0f172a' : 'var(--text-main)', fontWeight: 600 }}>
              {cert.name} <span style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>— {cert.organization}</span>
            </span>
            <span style={{ fontSize: activeFontSize.sub, color: isMinimal ? '#64748b' : 'var(--text-muted)', fontWeight: 600 }}>
              {cert.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const AchievementsSection = () => {
    const hasAchievements = achievements.awards || achievements.hackathons || achievements.competitions || achievements.academic;
    return hasAchievements ? (
      <div style={{ marginBottom: '6px' }}>
        <SectionHeader title="Achievements" />
        <ul style={{ margin: '4px 0 0 18px', padding: 0, fontSize: activeFontSize.body, color: isMinimal ? '#334155' : 'var(--text-sub)', lineHeight: 1.5 }}>
          {achievements.awards && <li><strong>Awards:</strong> {achievements.awards}</li>}
          {achievements.hackathons && <li><strong>Hackathons:</strong> {achievements.hackathons}</li>}
          {achievements.competitions && <li><strong>Coding Competitions:</strong> {achievements.competitions}</li>}
          {achievements.academic && <li><strong>Academic Achievements:</strong> {achievements.academic}</li>}
        </ul>
      </div>
    ) : null;
  };

  const CodingProfilesSection = () => {
    const hasProfiles = codingProfiles.leetcode || codingProfiles.hackerrank || codingProfiles.codechef || codingProfiles.codeforces || codingProfiles.geeksforgeeks;
    return hasProfiles ? (
      <div style={{ marginBottom: '6px' }}>
        <SectionHeader title="Coding Profiles" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: activeFontSize.sub }}>
          {codingProfiles.leetcode && <div><strong>LeetCode:</strong> {codingProfiles.leetcode}</div>}
          {codingProfiles.hackerrank && <div><strong>HackerRank:</strong> {codingProfiles.hackerrank}</div>}
          {codingProfiles.codechef && <div><strong>CodeChef:</strong> {codingProfiles.codechef}</div>}
          {codingProfiles.codeforces && <div><strong>Codeforces:</strong> {codingProfiles.codeforces}</div>}
          {codingProfiles.geeksforgeeks && <div><strong>GeeksforGeeks:</strong> {codingProfiles.geeksforgeeks}</div>}
        </div>
      </div>
    ) : null;
  };

  const SoftSkillsSection = () => softSkills ? (
    <div style={{ marginBottom: '6px' }}>
      <SectionHeader title="Soft Skills" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
        {softSkills.split(',').map((skill, i) => (
          <span
            key={i}
            style={{
              background: isMinimal ? '#e2e8f0' : 'rgba(255,255,255,0.06)',
              border: isMinimal ? '1px solid #cbd5e1' : '1px solid var(--border-color)',
              color: isMinimal ? '#334155' : 'var(--text-sub)',
              borderRadius: '6px',
              padding: '3px 8px',
              fontSize: activeFontSize.sub,
              fontWeight: '600'
            }}
          >
            {skill.trim()}
          </span>
        ))}
      </div>
    </div>
  ) : null;

  const LanguagesKnownSection = () => languagesKnown ? (
    <div style={{ marginBottom: '6px' }}>
      <SectionHeader title="Languages" />
      <div style={{ fontSize: activeFontSize.body, color: isMinimal ? '#334155' : 'var(--text-sub)' }}>
        {languagesKnown}
      </div>
    </div>
  ) : null;

  const ExtracurricularSection = () => extracurricular ? (
    <div style={{ marginBottom: '6px' }}>
      <SectionHeader title="Extracurricular Activities" />
      <ul style={{ margin: '4px 0 0 18px', padding: 0, fontSize: activeFontSize.body, color: isMinimal ? '#334155' : 'var(--text-sub)', lineHeight: 1.5 }}>
        {extracurricular.split('\n').filter(line => line.trim()).map((bullet, idx) => (
          <li key={idx} style={{ marginBottom: '3px' }}>{bullet.replace(/^[•\-\*\s]+/, '')}</li>
        ))}
      </ul>
    </div>
  ) : null;

  const InterestsSection = () => interests ? (
    <div style={{ marginBottom: '6px' }}>
      <SectionHeader title="Interests" />
      <div style={{ fontSize: activeFontSize.body, color: isMinimal ? '#334155' : 'var(--text-sub)' }}>
        {interests}
      </div>
    </div>
  ) : null;

  return (
    <div style={{ ...S.page, padding: '0 0 120px 0' }} className="fade-in-section">

      <div className="no-print">
        <Header title="Interactive Resume Builder 📄" showBack onBack={onBack} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '24px', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Left Side Form / Customizer Panel */}
        <div className="no-print" style={{ flex: '1 1 450px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '28px', padding: '24px', backdropFilter: 'blur(20px)' }}>

          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('content')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'content' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              📝 Edit Content
            </button>
            <button
              onClick={() => setActiveTab('design')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'design' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              🎨 Themes & Design
            </button>
          </div>

          {/* Content Wizard Form */}
          {activeTab === 'content' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '10px', fontWeight: 900, background: 'var(--accent-glow)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '4px 10px', color: 'var(--primary)' }}>
                  STEP {step} OF 7
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5, 6, 7].map(s => (
                    <div key={s} style={{ width: '12px', height: '6px', borderRadius: '3px', background: step === s ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }} />
                  ))}
                </div>
              </div>

              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: '800', marginBottom: '4px' }}>👤 Personal Information</div>
                  <input style={S.authInput} placeholder="Full Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                  <input style={S.authInput} placeholder="Professional Title (e.g. Software Developer)" value={profile.title} onChange={e => setProfile({ ...profile, title: e.target.value })} />
                  <input style={S.authInput} placeholder="Email Address" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                  <input style={S.authInput} placeholder="Phone Number" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                  <input style={S.authInput} placeholder="Location (City, Country)" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />
                  <input style={S.authInput} placeholder="LinkedIn URL" value={profile.linkedin} onChange={e => setProfile({ ...profile, linkedin: e.target.value })} />
                  <input style={S.authInput} placeholder="GitHub URL" value={profile.github} onChange={e => setProfile({ ...profile, github: e.target.value })} />
                  <input style={S.authInput} placeholder="Portfolio Website URL" value={profile.portfolio} onChange={e => setProfile({ ...profile, portfolio: e.target.value })} />
                  <textarea
                    style={{ ...S.authInput, height: '90px', borderRadius: '16px', resize: 'none' }}
                    placeholder="Professional Summary (2-4 lines)"
                    value={profile.summary}
                    onChange={e => setProfile({ ...profile, summary: e.target.value })}
                  />
                </div>
              )}

              {/* STEP 2: Work Experience */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: '800' }}>💼 Work Experience & Internships</div>

                  {experiences.map((exp, index) => (
                    <div key={index} style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Experience #{index + 1}</span>
                        {experiences.length > 1 && (
                          <button
                            onClick={() => handleDeleteExperience(index)}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Company Name" value={exp.company} onChange={e => handleUpdateExperience(index, 'company', e.target.value)} />
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Job Title / Role" value={exp.role} onChange={e => handleUpdateExperience(index, 'role', e.target.value)} />
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Duration (e.g. Jun 2024 - Present)" value={exp.duration} onChange={e => handleUpdateExperience(index, 'duration', e.target.value)} />
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Technologies Used (comma separated)" value={exp.techUsed} onChange={e => handleUpdateExperience(index, 'techUsed', e.target.value)} />
                      <textarea
                        style={{ ...S.authInput, height: '90px', borderRadius: '16px', resize: 'none', marginBottom: 0 }}
                        placeholder="Key Responsibilities (3-5 points, one per line)"
                        value={exp.details}
                        onChange={e => handleUpdateExperience(index, 'details', e.target.value)}
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleAddExperience}
                    style={{ padding: '12px', borderRadius: '16px', border: '1px dashed var(--primary)', background: 'rgba(99, 102, 241, 0.05)', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'var(--transition-smooth)' }}
                  >
                    ➕ Add Experience / Internship
                  </button>
                </div>
              )}

              {/* STEP 3: Education */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: '800' }}>🎓 Educational Background</div>

                  {educations.map((edu, index) => (
                    <div key={index} style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Education #{index + 1}</span>
                        {educations.length > 1 && (
                          <button
                            onClick={() => handleDeleteEducation(index)}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="College / University Name" value={edu.school} onChange={e => handleUpdateEducation(index, 'school', e.target.value)} />
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Degree (e.g. B.Tech, M.S., High School)" value={edu.degree} onChange={e => handleUpdateEducation(index, 'degree', e.target.value)} />
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Specialization / Major (e.g. Computer Science)" value={edu.specialization} onChange={e => handleUpdateEducation(index, 'specialization', e.target.value)} />
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Graduation Year / Duration (e.g. 2022 - 2026)" value={edu.duration} onChange={e => handleUpdateEducation(index, 'duration', e.target.value)} />
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="CGPA / Percentage (e.g. GPA: 8.5/10 or 85%)" value={edu.grade} onChange={e => handleUpdateEducation(index, 'grade', e.target.value)} />
                    </div>
                  ))}

                  <button
                    onClick={handleAddEducation}
                    style={{ padding: '12px', borderRadius: '16px', border: '1px dashed var(--primary)', background: 'rgba(99, 102, 241, 0.05)', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'var(--transition-smooth)' }}
                  >
                    ➕ Add Education Record
                  </button>
                </div>
              )}

              {/* STEP 4: Technical Skills */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: '800' }}>🛠️ Technical Skills</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Programming Languages</span>
                    <input style={S.authInput} placeholder="e.g. JavaScript, Python, C++, Java, SQL" value={techSkills.languages} onChange={e => setTechSkills({ ...techSkills, languages: e.target.value })} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Frameworks & Technologies</span>
                    <input style={S.authInput} placeholder="e.g. React, Express, Node.js, HTML5, CSS3" value={techSkills.frameworks} onChange={e => setTechSkills({ ...techSkills, frameworks: e.target.value })} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Databases</span>
                    <input style={S.authInput} placeholder="e.g. MongoDB, PostgreSQL, MySQL, Firebase" value={techSkills.databases} onChange={e => setTechSkills({ ...techSkills, databases: e.target.value })} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Cloud Platforms</span>
                    <input style={S.authInput} placeholder="e.g. AWS (S3, EC2), Google Cloud, Azure" value={techSkills.cloud} onChange={e => setTechSkills({ ...techSkills, cloud: e.target.value })} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Tools</span>
                    <input style={S.authInput} placeholder="e.g. Git, Docker, Postman, VS Code, Jenkins" value={techSkills.tools} onChange={e => setTechSkills({ ...techSkills, tools: e.target.value })} />
                  </div>
                </div>
              )}

              {/* STEP 5: Projects */}
              {step === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: '800' }}>🚀 Highlighted Projects</div>

                  {projects.map((proj, index) => (
                    <div key={index} style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Project #{index + 1}</span>
                        {projects.length > 1 && (
                          <button
                            onClick={() => handleDeleteProject(index)}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Project Name" value={proj.name} onChange={e => handleUpdateProject(index, 'name', e.target.value)} />
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Technologies Used" value={proj.techUsed} onChange={e => handleUpdateProject(index, 'techUsed', e.target.value)} />
                      <textarea
                        style={{ ...S.authInput, height: '70px', borderRadius: '16px', resize: 'none', marginBottom: 0 }}
                        placeholder="Description"
                        value={proj.description}
                        onChange={e => handleUpdateProject(index, 'description', e.target.value)}
                      />
                      <textarea
                        style={{ ...S.authInput, height: '70px', borderRadius: '16px', resize: 'none', marginBottom: 0 }}
                        placeholder="Key Features"
                        value={proj.features}
                        onChange={e => handleUpdateProject(index, 'features', e.target.value)}
                      />
                      <textarea
                        style={{ ...S.authInput, height: '70px', borderRadius: '16px', resize: 'none', marginBottom: 0 }}
                        placeholder="Your Contribution"
                        value={proj.contribution}
                        onChange={e => handleUpdateProject(index, 'contribution', e.target.value)}
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleAddProject}
                    style={{ padding: '12px', borderRadius: '16px', border: '1px dashed var(--primary)', background: 'rgba(99, 102, 241, 0.05)', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'var(--transition-smooth)' }}
                  >
                    ➕ Add Project
                  </button>
                </div>
              )}

              {/* STEP 6: Certifications & Profiles */}
              {step === 6 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: '800' }}>📜 Certifications</div>

                  {certifications.map((cert, index) => (
                    <div key={index} style={{ border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Certification #{index + 1}</span>
                        {certifications.length > 1 && (
                          <button
                            onClick={() => handleDeleteCertification(index)}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Certification Name" value={cert.name} onChange={e => handleUpdateCertification(index, 'name', e.target.value)} />
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Issuing Organization" value={cert.organization} onChange={e => handleUpdateCertification(index, 'organization', e.target.value)} />
                      <input style={{ ...S.authInput, marginBottom: 0 }} placeholder="Year" value={cert.year} onChange={e => handleUpdateCertification(index, 'year', e.target.value)} />
                    </div>
                  ))}

                  <button
                    onClick={handleAddCertification}
                    style={{ padding: '12px', borderRadius: '16px', border: '1px dashed var(--primary)', background: 'rgba(99, 102, 241, 0.05)', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'var(--transition-smooth)' }}
                  >
                    ➕ Add Certification
                  </button>

                  <div style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: '800', marginTop: '14px' }}>💻 Coding Profiles (Optional)</div>
                  <input style={S.authInput} placeholder="LeetCode profile URL" value={codingProfiles.leetcode} onChange={e => setCodingProfiles({ ...codingProfiles, leetcode: e.target.value })} />
                  <input style={S.authInput} placeholder="HackerRank profile URL" value={codingProfiles.hackerrank} onChange={e => setCodingProfiles({ ...codingProfiles, hackerrank: e.target.value })} />
                  <input style={S.authInput} placeholder="CodeChef profile URL" value={codingProfiles.codechef} onChange={e => setCodingProfiles({ ...codingProfiles, codechef: e.target.value })} />
                  <input style={S.authInput} placeholder="Codeforces profile URL" value={codingProfiles.codeforces} onChange={e => setCodingProfiles({ ...codingProfiles, codeforces: e.target.value })} />
                  <input style={S.authInput} placeholder="GeeksforGeeks profile URL" value={codingProfiles.geeksforgeeks} onChange={e => setCodingProfiles({ ...codingProfiles, geeksforgeeks: e.target.value })} />
                </div>
              )}

              {/* STEP 7: Achievements & Others */}
              {step === 7 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: '800' }}>🏆 Achievements</div>
                  <input style={S.authInput} placeholder="Awards & Honors" value={achievements.awards} onChange={e => setAchievements({ ...achievements, awards: e.target.value })} />
                  <input style={S.authInput} placeholder="Hackathons participated/won" value={achievements.hackathons} onChange={e => setAchievements({ ...achievements, hackathons: e.target.value })} />
                  <input style={S.authInput} placeholder="Coding Competitions rank/score" value={achievements.competitions} onChange={e => setAchievements({ ...achievements, competitions: e.target.value })} />
                  <input style={S.authInput} placeholder="Academic achievements" value={achievements.academic} onChange={e => setAchievements({ ...achievements, academic: e.target.value })} />

                  <div style={{ color: 'var(--text-main)', fontSize: '15px', fontWeight: '800', marginTop: '10px' }}>🌟 Additional Details</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Soft Skills (comma separated)</span>
                    <input style={S.authInput} placeholder="e.g. Communication, Problem Solving, Teamwork" value={softSkills} onChange={e => setSoftSkills(e.target.value)} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Languages Known</span>
                    <input style={S.authInput} placeholder="e.g. English, Spanish, German" value={languagesKnown} onChange={e => setLanguagesKnown(e.target.value)} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Extracurricular Activities (Optional)</span>
                    <textarea
                      style={{ ...S.authInput, height: '70px', borderRadius: '16px', resize: 'none' }}
                      placeholder="Organizing events, volunteering, etc."
                      value={extracurricular}
                      onChange={e => setExtracurricular(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-sub)' }}>Interests (Optional)</span>
                    <input style={S.authInput} placeholder="e.g. Competitive Programming, Open Source, Hiking" value={interests} onChange={e => setInterests(e.target.value)} />
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button
                  disabled={step === 1}
                  onClick={() => setStep(s => s - 1)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    opacity: step === 1 ? 0.4 : 1
                  }}
                >
                  ← Back
                </button>
                {step < 7 ? (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    onClick={handlePrint}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    💾 Download PDF
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Design Settings Customizer */}
          {activeTab === 'design' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Layout Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-sub)' }}>📄 RESUME LAYOUT:</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[
                    { id: 'stacked', name: 'Stacked (1-Col)', desc: 'Classic vertical layout' },
                    { id: 'split', name: 'Split (2-Col)', desc: 'Modern sidebar layout' }
                  ].map(lay => (
                    <button
                      key={lay.id}
                      onClick={() => setResumeLayout(lay.id)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        background: resumeLayout === lay.id ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        transition: 'all 0.3s'
                      }}
                    >
                      <div style={{ fontSize: '13px' }}>{lay.name}</div>
                      <div style={{ fontSize: '9px', opacity: 0.7, fontWeight: 'normal', marginTop: '2px' }}>{lay.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-sub)' }}>🎨 COLOR PALETTES:</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {Object.keys(themesColor).map(thm => {
                    const tc = themesColor[thm];
                    return (
                      <button
                        key={thm}
                        onClick={() => setResumeTheme(thm)}
                        style={{
                          padding: '10px 4px',
                          borderRadius: '12px',
                          border: '1px solid var(--border-color)',
                          background: resumeTheme === thm ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                          color: '#fff',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.3s'
                        }}
                      >
                        <span>{thm}</span>
                        <div style={{
                          width: '32px',
                          height: '10px',
                          borderRadius: '4px',
                          background: thm === 'minimal' ? '#0f172a' : tc.headerBg
                        }} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Family Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-sub)' }}>🔤 TYPOGRAPHY / FONTS:</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'sans', name: 'Inter Sans', font: fontStyles.sans },
                    { id: 'corporate', name: 'Jakarta Corporate', font: fontStyles.corporate },
                    { id: 'serif', name: 'Lora Serif', font: fontStyles.serif },
                    { id: 'elegant', name: 'Merriweather', font: fontStyles.elegant },
                    { id: 'display', name: 'Playfair Display', font: fontStyles.display },
                    { id: 'mono', name: 'JetBrains Mono', font: fontStyles.mono }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setResumeFont(f.id)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        background: resumeFont === f.id ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontFamily: f.font,
                        fontSize: '13px',
                        textAlign: 'center',
                        transition: 'all 0.3s'
                      }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing Controls */}
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-sub)' }}>📏 FONT SIZE:</span>
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '3px', border: '1px solid var(--border-color)' }}>
                    {['small', 'medium', 'large'].map(sz => (
                      <button
                        key={sz}
                        onClick={() => setResumeFontSize(sz)}
                        style={{
                          flex: 1,
                          padding: '8px 4px',
                          borderRadius: '10px',
                          border: 'none',
                          background: resumeFontSize === sz ? 'var(--primary)' : 'transparent',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          transition: 'all 0.3s'
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-sub)' }}>📐 PAGE MARGINS:</span>
                  <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '3px', border: '1px solid var(--border-color)' }}>
                    {['compact', 'comfortable', 'spacious'].map(sp => (
                      <button
                        key={sp}
                        onClick={() => setResumeSpacing(sp)}
                        style={{
                          flex: 1,
                          padding: '8px 4px',
                          borderRadius: '10px',
                          border: 'none',
                          background: resumeSpacing === sp ? 'var(--primary)' : 'transparent',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '11px',
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          transition: 'all 0.3s'
                        }}
                      >
                        {sp.substring(0, 4)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handlePrint}
                style={{
                  marginTop: '10px',
                  padding: '14px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '14px',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.2)',
                  transition: 'all 0.3s'
                }}
              >
                💾 Download Premium PDF
              </button>

            </div>
          )}
        </div>

        {/* Right Side Live Resume Editing Canvas */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>

          {/* Quick Design Indicator (Tablet/Screen only) */}
          <div className="no-print" style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-sub)' }}>
            <div>STYLE PREVIEW: <span style={{ color: 'var(--primary)', textTransform: 'uppercase' }}>{resumeTheme} Theme / {resumeLayout} Layout</span></div>
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                color: 'var(--primary)',
                padding: '4px 12px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🖨️ Quick Print
            </button>
          </div>

          {/* Printable Page Wrapper */}
          <div
            className="resume-print-area"
            style={{
              width: '100%',
              maxWidth: '210mm',
              minHeight: '297mm',
              background: isMinimal ? '#ffffff' : 'rgba(15, 23, 42, 0.75)',
              border: isMinimal ? '1px solid #cbd5e1' : '1px solid var(--border-color)',
              color: isMinimal ? '#1e293b' : 'var(--text-main)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              fontFamily: activeFont,
              fontSize: activeFontSize.body,
              padding: activeSpacing,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative'
            }}
          >
            {resumeLayout === 'split' ? (
              // Two Column Split Layout
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <HeaderSection />

                <div style={{ display: 'flex', gap: '24px', flex: 1, marginTop: '8px' }}>
                  {/* Left Column (Sidebar, 35% width) */}
                  <div style={{
                    flex: '0 0 35%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    borderRight: `1px solid ${isMinimal ? '#cbd5e1' : 'var(--border-color)'}`,
                    paddingRight: '16px',
                    background: isMinimal ? 'transparent' : activeTheme.sideBg,
                    borderRadius: '8px'
                  }}>
                    <SkillsSection />
                    <CodingProfilesSection />
                    <SoftSkillsSection />
                    <LanguagesKnownSection />
                    <InterestsSection />
                  </div>

                  {/* Right Column (Main Column, 65% width) */}
                  <div style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <SummarySection />
                    <ExperienceSection />
                    <ProjectsSection />
                    <EducationSection />
                    <CertificationsSection />
                    <AchievementsSection />
                    <ExtracurricularSection />
                  </div>
                </div>
              </div>
            ) : (
              // Stacked Layout
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <HeaderSection />
                <SummarySection />
                <EducationSection />
                <ExperienceSection />
                <ProjectsSection />
                <SkillsSection />
                <CertificationsSection />
                <AchievementsSection />
                <CodingProfilesSection />
                <SoftSkillsSection />
                <LanguagesKnownSection />
                <ExtracurricularSection />
                <InterestsSection />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────
// ─── MAIN APP ────────────────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'register' | 'forgot'
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [selectedTrendingJob, setSelectedTrendingJob] = useState(null);
  const [navTarget, setNavTarget] = useState(null);
  const [showGeminiChat, setShowGeminiChat] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState('');

  // Bookmarks state & trending cache
  const [savedCareers, setSavedCareers] = useState([]);
  const [trendingJobs, setTrendingJobs] = useState([]);

  // Internationalization & Customizations State
  const [lang, setLang] = useState(() => localStorage.getItem('cp_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('cp_theme') || 'cosmic');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('cp_sound');
    return saved !== null ? saved === 'true' : true;
  });
  const [soundType, setSoundType] = useState(() => localStorage.getItem('cp_sound_type') || 'chime');

  const [darkMode, setDarkMode] = useState(true);

  // Monitor Firebase Auth State and synchronize with local/database state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const res = await fetch(`${API}/auth/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              email: firebaseUser.email
            })
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem('cp_user', JSON.stringify(data.user));
          } else {
            const fallbackUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              email: firebaseUser.email
            };
            setUser(fallbackUser);
            localStorage.setItem('cp_user', JSON.stringify(fallbackUser));
          }
        } catch (e) {
          console.error("Failed to sync authenticated user:", e);
          const fallbackUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email
          };
          setUser(fallbackUser);
          localStorage.setItem('cp_user', JSON.stringify(fallbackUser));
        }
      } else {
        setUser(null);
        localStorage.removeItem('cp_user');
      }
    });
    return () => unsubscribe();
  }, []);

  // Apply active theme dynamically to document root CSS variables
  useEffect(() => {
    const themePalettes = {
      cosmic: { primary: '#8b5cf6', secondary: '#d946ef', glow: 'rgba(139, 92, 246, 0.25)', border: 'rgba(168, 85, 247, 0.2)', textSub: '#c084fc' },
      neon: { primary: '#ec4899', secondary: '#a855f7', glow: 'rgba(236, 72, 153, 0.28)', border: 'rgba(236, 72, 153, 0.25)', textSub: '#f472b6' },
      emerald: { primary: '#10b981', secondary: '#06b6d4', glow: 'rgba(16, 185, 129, 0.28)', border: 'rgba(16, 185, 129, 0.25)', textSub: '#34d399' },
      amber: { primary: '#f59e0b', secondary: '#ef4444', glow: 'rgba(245, 158, 11, 0.28)', border: 'rgba(245, 158, 11, 0.25)', textSub: '#fbbf24' },
      sapphire: { primary: '#06b6d4', secondary: '#3b82f6', glow: 'rgba(6, 182, 212, 0.28)', border: 'rgba(6, 182, 212, 0.25)', textSub: '#38bdf8' },
      ruby: { primary: '#f43f5e', secondary: '#fb7185', glow: 'rgba(244, 63, 94, 0.28)', border: 'rgba(244, 63, 94, 0.25)', textSub: '#fda4af' },
      orchid: { primary: '#d946ef', secondary: '#8b5cf6', glow: 'rgba(217, 70, 239, 0.28)', border: 'rgba(217, 70, 239, 0.25)', textSub: '#f0abfc' },
      sunset: { primary: '#f97316', secondary: '#e11d48', glow: 'rgba(249, 115, 22, 0.28)', border: 'rgba(249, 115, 22, 0.25)', textSub: '#fb923c' }
    };

    const activePalette = themePalettes[theme] || themePalettes.cosmic;
    const root = document.documentElement;
    root.style.setProperty('--primary', activePalette.primary);
    root.style.setProperty('--secondary', activePalette.secondary);
    root.style.setProperty('--accent-glow', activePalette.glow);
    root.style.setProperty('--border-color', activePalette.border);
    root.style.setProperty('--text-sub', activePalette.textSub);
    document.body.className = `theme-${theme}`;
  }, [theme]);

  useEffect(() => {
    window.onGlobalThemeToggle = (nextDark) => {
      setDarkMode(true);
      localStorage.setItem('cp_dark_mode', 'true');
      window.dispatchEvent(new CustomEvent('cp-theme-sync', { detail: { darkMode: true } }));
    };
    return () => {
      window.onGlobalThemeToggle = null;
    };
  }, []);

  // Comparison State
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  // Sync bookmarks with user state
  useEffect(() => {
    if (user && user.id) {
      fetch(`${API}/saved-careers?userId=${user.id}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setSavedCareers(data);
        })
        .catch(err => console.error("Error fetching saved careers:", err));
    } else {
      setSavedCareers([]);
    }
  }, [user]);

  // Sync trending jobs cache
  useEffect(() => {
    fetch(`${API}/overview`)
      .then(r => r.json())
      .then(data => {
        if (data && data.trending) setTrendingJobs(data.trending);
      })
      .catch(e => console.error("Error fetching overview details:", e));
  }, []);

  const handleToggleSaveCareer = async (career) => {
    if (!user || !user.id) return;
    const isSaved = savedCareers.some(item => item.careerId === career.id);
    playClickSound(soundEnabled);
    if (isSaved) {
      try {
        const res = await fetch(`${API}/saved-careers?userId=${user.id}&careerId=${encodeURIComponent(career.id)}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setSavedCareers(prev => prev.filter(item => item.careerId !== career.id));
        }
      } catch (err) {
        console.error("Error unsaving career:", err);
      }
    } else {
      try {
        const res = await fetch(`${API}/saved-careers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            career: {
              id: career.id,
              title: career.title,
              icon: career.icon || '💼',
              type: career.type || 'Career',
              payload: career.payload || {}
            }
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.saved) {
            setSavedCareers(prev => [...prev, data.saved]);
          }
        }
      } catch (err) {
        console.error("Error saving career:", err);
      }
    }
  };

  const handleNavigateToPayload = (payload) => {
    if (!payload || !payload.type) return;

    // Reset selection and close overlay
    setSelectedTrendingJob(null);
    setShowCompare(false);

    if (payload.type === 'ai-recommendation') {
      handleNavChange('ai-recommendation', payload);
      return;
    }

    if (payload.type === 'trending') {
      const foundJob = trendingJobs.find(j => j.id === payload.jobId);
      if (foundJob) {
        setSelectedTrendingJob(foundJob);
      } else {
        fetch(`${API}/overview`)
          .then(r => r.json())
          .then(d => {
            const tj = d.trending || [];
            setTrendingJobs(tj);
            const fj = tj.find(x => x.id === payload.jobId);
            if (fj) setSelectedTrendingJob(fj);
          });
      }
      return;
    }

    if (['after10th', 'after12th', 'graduation'].includes(payload.type)) {
      handleNavChange(payload.type, payload);
      return;
    }
  };

  const t = (key) => {
    if (!dict[lang]) return dict['en'][key] || key;
    return dict[lang][key] || dict['en'][key] || key;
  };

  const handleNavChange = (nextPage, target = null) => {
    playClickSound(soundEnabled);
    setPage(nextPage);
    setNavTarget(target);
  };

  const handleBack = () => {
    playClickSound(soundEnabled);
    if (page === 'after10th' || page === 'after12th' || page === 'graduation') {
      setPage('education');
    } else {
      setPage('home');
    }
    setNavTarget(null);
  };

  const handleRemoveFromCompare = (jobId) => {
    playClickSound(soundEnabled);
    setCompareList(prev => prev.filter(item => item.id !== jobId));
  };

  const renderPage = () => {
    if (selectedTrendingJob) {
      return (
        <TrendingJobDetail
          job={selectedTrendingJob}
          onBack={() => { playClickSound(soundEnabled); setSelectedTrendingJob(null); }}
          t={t}
          savedCareers={savedCareers}
          onToggleSave={handleToggleSaveCareer}
          onAddToCompare={(job) => {
            playClickSound(soundEnabled);
            if (compareList.length >= 3) {
              alert("You can compare up to 3 careers.");
              return;
            }
            if (!compareList.some(item => item.id === job.id)) {
              setCompareList([...compareList, job]);
              setShowCompare(true);
            }
          }}
        />
      );
    }

    switch (page) {
      case 'home':
        return (
          <HomePage
            onNav={handleNavChange}
            onSelectTrending={(job) => {
              playClickSound(soundEnabled);
              setSelectedTrendingJob(job);
            }}
            t={t}
            lang={lang}
            soundEnabled={soundEnabled}
            user={user}
            onTriggerChatPrompt={(prompt) => {
              playClickSound(soundEnabled);
              setInitialChatPrompt(prompt);
              setShowGeminiChat(true);
            }}
            darkMode={darkMode}
          />
        );
      case 'education':
        return (
          <EducationHubPage
            onNav={handleNavChange}
            t={t}
            onOpenSettings={() => handleNavChange('settings')}
          />
        );
      case 'after10th':
        return (
          <After10thPage
            onBack={handleBack}
            initialTarget={navTarget}
            clearTarget={() => setNavTarget(null)}
            t={t}
            savedCareers={savedCareers}
            onToggleSave={handleToggleSaveCareer}
            onAddToCompare={(job) => {
              playClickSound(soundEnabled);
              if (compareList.length >= 3) {
                alert("You can compare up to 3 careers.");
                return;
              }
              if (!compareList.some(item => item.id === job.id)) {
                setCompareList([...compareList, job]);
                setShowCompare(true);
              }
            }}
            onOpenSettings={() => handleNavChange('settings')}
          />
        );
      case 'after12th':
        return (
          <After12thPage
            onBack={handleBack}
            initialTarget={navTarget}
            clearTarget={() => setNavTarget(null)}
            t={t}
            savedCareers={savedCareers}
            onToggleSave={handleToggleSaveCareer}
            onAddToCompare={(job) => {
              playClickSound(soundEnabled);
              if (compareList.length >= 3) {
                alert("You can compare up to 3 careers.");
                return;
              }
              if (!compareList.some(item => item.id === job.id)) {
                setCompareList([...compareList, job]);
                setShowCompare(true);
              }
            }}
            onOpenSettings={() => handleNavChange('settings')}
          />
        );
      case 'graduation':
        return (
          <GraduationPage
            onBack={handleBack}
            initialTarget={navTarget}
            clearTarget={() => setNavTarget(null)}
            t={t}
            savedCareers={savedCareers}
            onToggleSave={handleToggleSaveCareer}
            onOpenSettings={() => handleNavChange('settings')}
          />
        );
      case 'aptitude':
        return (
          <AptitudeCheatsheetPage
            onBack={handleBack}
            t={t}
            onOpenSettings={() => handleNavChange('settings')}
          />
        );
      case 'tech-learning':
        return (
          <TechLearningHubPage
            onBack={handleBack}
            t={t}
            onOpenSettings={() => handleNavChange('settings')}
          />
        );
      case 'ai-recommendation':
        return (
          <AIRecommendationPage
            userId={user?.id}
            target={navTarget}
            onBack={handleBack}
            onOpenSettings={() => handleNavChange('settings')}
            t={t}
            savedCareers={savedCareers}
            onToggleSave={handleToggleSaveCareer}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            user={user}
            onUpdateUser={(updatedUser) => {
              playClickSound(soundEnabled);
              setUser(updatedUser);
            }}
            lang={lang}
            onUpdateLang={(newLang) => {
              playClickSound(soundEnabled);
              setLang(newLang);
              localStorage.setItem('cp_lang', newLang);
            }}
            theme={theme}
            onUpdateTheme={(newTheme) => {
              playClickSound(soundEnabled);
              setTheme(newTheme);
              localStorage.setItem('cp_theme', newTheme);
            }}
            soundEnabled={soundEnabled}
            onUpdateSound={(newSound) => {
              playClickSound(soundEnabled);
              setSoundEnabled(newSound);
              localStorage.setItem('cp_sound', newSound ? 'true' : 'false');
            }}
            soundType={soundType}
            onUpdateSoundType={(newType) => {
              playClickSound(soundEnabled);
              setSoundType(newType);
              localStorage.setItem('cp_sound_type', newType);
            }}
            onResetData={() => {
              playClickSound(soundEnabled);
              setSavedCareers([]);
              setCompareList([]);
            }}
            onLogout={async () => {
              playClickSound(soundEnabled);
              try {
                await signOut(auth);
                localStorage.removeItem('cp_user');
                setUser(null);
                setPage('home');
              } catch (e) {
                console.error("Firebase SignOut error:", e);
              }
            }}
            onBack={handleBack}
            t={t}
            savedCareers={savedCareers}
            onSelectSavedCareer={(career) => {
              playClickSound(soundEnabled);
              handleNavigateToPayload(career.payload);
            }}
          />
        );
      case 'resume-builder':
        return (
          <ResumeBuilderPage
            onBack={handleBack}
            t={t}
            user={user}
            soundEnabled={soundEnabled}
          />
        );
      case 'memory-matrix':
        return (
          <MemoryMatrixGame
            onBack={handleBack}
            t={t}
            soundEnabled={soundEnabled}
            darkMode={darkMode}
            user={user}
          />
        );
      case 'arithmetic-rain':
        return (
          <ArithmeticRainGame
            onBack={handleBack}
            t={t}
            soundEnabled={soundEnabled}
            darkMode={darkMode}
            user={user}
          />
        );
      case 'search':
        return (
          <SearchPage
            onBack={handleBack}
            t={t}
            onSelectResult={(result) => {
              playClickSound(soundEnabled);
              handleNavigateToPayload(result.payload);
            }}
            onOpenSettings={() => handleNavChange('settings')}
          />
        );
      case 'ai-workspace':
        return (
          <AIWorkspace
            isPageMode={true}
            onClose={handleBack}
            soundEnabled={soundEnabled}
            currentPage={page}
            selectedTrendingJob={selectedTrendingJob}
            initialPrompt={initialChatPrompt}
            onClearInitialPrompt={() => setInitialChatPrompt('')}
          />
        );
      default:
        return (
          <HomePage
            onNav={handleNavChange}
            onSelectTrending={(job) => {
              playClickSound(soundEnabled);
              setSelectedTrendingJob(job);
            }}
            t={t}
            lang={lang}
            soundEnabled={soundEnabled}
            user={user}
            onTriggerChatPrompt={(prompt) => {
              playClickSound(soundEnabled);
              setInitialChatPrompt(prompt);
              setShowGeminiChat(true);
            }}
            darkMode={darkMode}
          />
        );
    }
  };

  if (showSplash) {
    return <Splash onEnter={() => { playClickSound(soundEnabled); setShowSplash(false); }} />;
  }

  if (!user) {
    if (authScreen === 'login') {
      return (
        <LoginPage
          onLogin={(u) => { playClickSound(soundEnabled); setUser(u); }}
          onForgot={() => { playClickSound(soundEnabled); setAuthScreen('forgot'); }}
          onGoRegister={() => { playClickSound(soundEnabled); setAuthScreen('register'); }}
        />
      );
    }
    if (authScreen === 'register') {
      return (
        <RegisterPage
          onGoLogin={() => { playClickSound(soundEnabled); setAuthScreen('login'); }}
        />
      );
    }
    if (authScreen === 'forgot') {
      return (
        <ForgotPasswordPage
          onBack={() => { playClickSound(soundEnabled); setAuthScreen('login'); }}
        />
      );
    }
    return null;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {page !== 'memory-matrix' && page !== 'arithmetic-rain' && page !== 'ai-workspace' && (
        <>
          {/* Premium Animated Glowing Background */}
          <div className="app-premium-bg" />
        </>
      )}
      {renderPage()}
      {page !== 'memory-matrix' && page !== 'arithmetic-rain' && page !== 'ai-workspace' && <BottomNav active={page} onNav={handleNavChange} t={t} />}

      {/* Floating Gemini FAB */}
      {user && page !== 'ai-workspace' && (
        <>
          <div
            onClick={() => {
              setShowGeminiChat(!showGeminiChat);
              playClickSound(soundEnabled);
            }}
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(56, 189, 248, 0.4)',
              zIndex: 999,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.1) rotate(10deg)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(56, 189, 248, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(56, 189, 248, 0.4)';
            }}
          >
            🤖
          </div>

          {showGeminiChat && (
            <AIWorkspace
              isPageMode={false}
              onClose={() => {
                setShowGeminiChat(false);
                playClickSound(soundEnabled);
              }}
              soundEnabled={soundEnabled}
              currentPage={page}
              selectedTrendingJob={selectedTrendingJob}
              initialPrompt={initialChatPrompt}
              onClearInitialPrompt={() => setInitialChatPrompt('')}
            />
          )}
        </>
      )}

      {/* Compare Overlay Dashboard */}
      {showCompare && (
        <ComparisonOverlay
          compareList={compareList}
          onRemove={handleRemoveFromCompare}
          onClose={() => { setShowCompare(false); playClickSound(soundEnabled); }}
          t={t}
        />
      )}
    </div>
  );
}
