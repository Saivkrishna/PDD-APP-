import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useColorScheme, StatusBar, Alert, Text, TouchableOpacity, LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { API_URL } from '../config';
import { Colors } from '@/constants/theme';
import { t } from '../utils/translations';

LogBox.ignoreAllLogs();

// Components
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Splash from '../components/Splash';
import Login from '../components/Login';
import Register from '../components/Register';
import HomePage from '../components/HomePage';
import SettingsPage from '../components/SettingsPage';
import After10thPage from '../components/After10thPage';
import After12thPage from '../components/After12thPage';
import GraduationPage from '../components/GraduationPage';
import AptitudeCheatsheetPage from '../components/AptitudeCheatsheetPage';
import MemoryMatrixGame from '../components/MemoryMatrixGame';
import ArithmeticRainGame from '../components/ArithmeticRainGame';
import EducationHubPage from '../components/EducationHubPage';
import ReasoningPracticePage from '../components/ReasoningPracticePage';
import SearchPage from '../components/SearchPage';
import TechLearningPage from '../components/TechLearningPage';
import ATSScannerPage from '../components/ATSScannerPage';

export default function AppEntry() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState<string>('home');
  const [navHistory, setNavHistory] = useState<string[]>(['home']);
  const [savedCareers, setSavedCareers] = useState<any[]>([]);
  const [initialTarget, setInitialTarget] = useState<any>(null);

  // App Settings / Customizations
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('cosmic');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundType, setSoundType] = useState('chime');
  const [darkMode, setDarkMode] = useState(true);

  const systemScheme = useColorScheme();
  const colors = Colors[darkMode ? 'dark' : 'light'];

  // 1. Initial configuration loading from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const cachedUser = await AsyncStorage.getItem('cp_user');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
          setShowSplash(false);
        }
        const cachedLang = await AsyncStorage.getItem('cp_lang');
        if (cachedLang) setLang(cachedLang);
        
        const cachedTheme = await AsyncStorage.getItem('cp_theme');
        if (cachedTheme) setTheme(cachedTheme);

        const cachedSound = await AsyncStorage.getItem('cp_sound');
        if (cachedSound !== null) setSoundEnabled(cachedSound === 'true');

        const cachedSoundType = await AsyncStorage.getItem('cp_sound_type');
        if (cachedSoundType) setSoundType(cachedSoundType);

        const cachedDarkMode = await AsyncStorage.getItem('cp_dark_mode');
        if (cachedDarkMode !== null) {
          setDarkMode(cachedDarkMode === 'true');
        } else {
          setDarkMode(systemScheme === 'dark');
        }
      } catch (err) {
        console.warn('Failed to load local app state:', err);
      }
    };
    loadSettings();
  }, [systemScheme]);

  // 2. Track Firebase Auth state change and sync to backend DB
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          try {
            const res = await fetch(`${API_URL}/auth/sync`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                email: firebaseUser.email
              })
            });
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
              try {
                await AsyncStorage.setItem('cp_user', JSON.stringify(data.user));
              } catch (err) {
                console.warn('Failed to cache user state in AsyncStorage:', err);
              }
            } else {
              const fallback = { id: firebaseUser.uid, name: firebaseUser.displayName || firebaseUser.email?.split('@')[0], email: firebaseUser.email };
              setUser(fallback);
              try {
                await AsyncStorage.setItem('cp_user', JSON.stringify(fallback));
              } catch (err) {
                console.warn('Failed to cache user fallback state in AsyncStorage:', err);
              }
            }
          } catch (e) {
            const fallback = { id: firebaseUser.uid, name: firebaseUser.displayName || firebaseUser.email?.split('@')[0], email: firebaseUser.email };
            setUser(fallback);
            try {
              await AsyncStorage.setItem('cp_user', JSON.stringify(fallback));
            } catch (err) {
              console.warn('Failed to cache user fallback state after fetch failure:', err);
            }
          }
        } else {
          setUser(null);
          try {
            await AsyncStorage.removeItem('cp_user');
          } catch (err) {
            console.warn('Failed to clear user cache in AsyncStorage:', err);
          }
        }
      } catch (globalErr) {
        console.warn('Uncaught error in auth state transition:', globalErr);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch bookmarks from database
  const fetchSavedCareers = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/saved-careers?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSavedCareers(data || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (user && user.id) {
      fetchSavedCareers(user.id);
    }
  }, [user]);

  const handleToggleSave = async (career: any) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/saved-careers/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          careerId: career.id,
          title: career.title,
          icon: career.icon || '💼',
          type: career.type,
          payload: career.payload || career
        })
      });
      if (res.ok) {
        fetchSavedCareers(user.id);
      }
    } catch (e) {}
  };

  const handleNavigateToPayload = (payload: any) => {
    if (!payload || !payload.type) return;
    setInitialTarget(payload);
    setPage(payload.type);
    setNavHistory(prev => [...prev, payload.type]);
  };

  const handleNav = (nextPage: string) => {
    setPage(nextPage);
    setNavHistory((prev) => {
      if (prev[prev.length - 1] === nextPage) return prev;
      return [...prev, nextPage];
    });
  };

  const handleBack = () => {
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop(); // remove current page
      const prevPage = newHistory[newHistory.length - 1];
      setNavHistory(newHistory);
      setPage(prevPage);
    } else {
      setPage('home');
      setNavHistory(['home']);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      await AsyncStorage.removeItem('cp_user');
      setPage('home');
      setNavHistory(['home']);
      setShowSplash(true);
    } catch (e: any) {
      Alert.alert('Sign Out Failed', e.message);
    }
  };

  const handleResetData = async () => {
    Alert.alert('Reset Data', 'Are you sure you want to clear your local progress?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            setUser(null);
            setPage('home');
            setNavHistory(['home']);
            setShowSplash(true);
            Alert.alert('Success', t('dataReset', lang));
          } catch (err) {}
        }
      }
    ]);
  };

  const handleUpdateLang = async (nextLang: string) => {
    setLang(nextLang);
    try {
      await AsyncStorage.setItem('cp_lang', nextLang);
    } catch (e) {
      console.warn('AsyncStorage error in handleUpdateLang:', e);
    }
  };

  const handleUpdateTheme = async (nextTheme: string) => {
    setTheme(nextTheme);
    try {
      await AsyncStorage.setItem('cp_theme', nextTheme);
    } catch (e) {
      console.warn('AsyncStorage error in handleUpdateTheme:', e);
    }
  };

  const handleUpdateSound = async (enabled: boolean) => {
    setSoundEnabled(enabled);
    try {
      await AsyncStorage.setItem('cp_sound', enabled ? 'true' : 'false');
    } catch (e) {
      console.warn('AsyncStorage error in handleUpdateSound:', e);
    }
  };

  const handleUpdateSoundType = async (type: string) => {
    setSoundType(type);
    try {
      await AsyncStorage.setItem('cp_sound_type', type);
    } catch (e) {
      console.warn('AsyncStorage error in handleUpdateSoundType:', e);
    }
  };

  const handleToggleThemeMode = async () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    try {
      await AsyncStorage.setItem('cp_dark_mode', nextDark ? 'true' : 'false');
    } catch (e) {
      console.warn('AsyncStorage error in handleToggleThemeMode:', e);
    }
  };

  const translationHelper = (key: string) => t(key, lang);

  // ─── RENDERING FLOW ───────────

  if (showSplash) {
    return <Splash onEnter={() => setShowSplash(false)} />;
  }

  if (!user) {
    return (
      <View style={[styles.appWrapper, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        {page === 'register' ? (
          <Register onGoLogin={() => setPage('login')} />
        ) : (
          <Login onLogin={(syncedUser) => { setUser(syncedUser); setPage('home'); }} onGoRegister={() => setPage('register')} />
        )}
      </View>
    );
  }



  return (
    <View style={[styles.appWrapper, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      {/* Dynamic Header */}
      {(page === 'home' || page === 'settings') && (
        <Header
          title={page === 'home' ? translationHelper('appName') : translationHelper(page)}
          showBack={page !== 'home'}
          onBack={handleBack}
          darkMode={darkMode}
          onToggleTheme={handleToggleThemeMode}
          onOpenSettings={() => handleNav('settings')}
        />
      )}

      {/* Main Screen Router */}
      <View style={styles.screenContainer}>
        {page === 'home' && (
          <HomePage onNav={handleNav} t={translationHelper} user={user} darkMode={darkMode} />
        )}
        {page === 'after10th' && (
          <After10thPage
            onBack={handleBack}
            t={translationHelper}
            initialTarget={initialTarget}
            clearTarget={() => setInitialTarget(null)}
            savedCareers={savedCareers}
            onToggleSave={handleToggleSave}
          />
        )}
        {page === 'after12th' && (
          <After12thPage
            onBack={handleBack}
            t={translationHelper}
            initialTarget={initialTarget}
            clearTarget={() => setInitialTarget(null)}
            savedCareers={savedCareers}
            onToggleSave={handleToggleSave}
          />
        )}
        {page === 'graduation' && (
          <GraduationPage
            onBack={handleBack}
            t={translationHelper}
            initialTarget={initialTarget}
            clearTarget={() => setInitialTarget(null)}
            savedCareers={savedCareers}
            onToggleSave={handleToggleSave}
          />
        )}
        {page === 'education' && (
          <EducationHubPage onNav={handleNav} t={translationHelper} />
        )}
        {page === 'reasoning' && (
          <ReasoningPracticePage onBack={handleBack} t={translationHelper} />
        )}
        {page === 'search' && (
          <SearchPage onBack={handleBack} t={translationHelper} onSelectResult={handleNavigateToPayload} />
        )}
        {page === 'aptitude' && (
          <AptitudeCheatsheetPage onBack={handleBack} t={translationHelper} />
        )}
        {page === 'settings' && (
          <SettingsPage
            user={user}
            lang={lang}
            onUpdateLang={handleUpdateLang}
            theme={theme}
            onUpdateTheme={handleUpdateTheme}
            soundEnabled={soundEnabled}
            onUpdateSound={handleUpdateSound}
            soundType={soundType}
            onUpdateSoundType={handleUpdateSoundType}
            onResetData={handleResetData}
            onLogout={handleLogout}
            onBack={handleBack}
            savedCareers={savedCareers}
            onSelectSavedCareer={(item) => handleNavigateToPayload(item.payload)}
          />
        )}
        {page === 'tech-learning' && (
          <TechLearningPage onBack={handleBack} t={translationHelper} />
        )}
        {page === 'memory-matrix' && (
          <MemoryMatrixGame onBack={handleBack} />
        )}
        {page === 'arithmetic-rain' && (
          <ArithmeticRainGame onBack={handleBack} />
        )}
        {page === 'ats-scanner' && (
          <ATSScannerPage onBack={handleBack} t={translationHelper} user={user} />
        )}
      </View>



      {/* Bottom Navigation */}
      <BottomNav active={page} onNav={handleNav} t={translationHelper} />
    </View>
  );
}

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  floatingAiBtn: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 100,
  },
  floatingAiText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
});
