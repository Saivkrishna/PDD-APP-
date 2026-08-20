import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, useColorScheme } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { t } from '../utils/translations';

interface SettingsPageProps {
  user: any;
  lang: string;
  onUpdateLang: (l: string) => void;
  theme: string;
  onUpdateTheme: (th: string) => void;
  soundEnabled: boolean;
  onUpdateSound: (enabled: boolean) => void;
  soundType: string;
  onUpdateSoundType: (type: string) => void;
  onResetData: () => void;
  onLogout: () => void;
  onBack: () => void;
  savedCareers: any[];
  onSelectSavedCareer: (career: any) => void;
  colors: any;
}

export default function SettingsPage({
  user,
  lang,
  onUpdateLang,
  theme,
  onUpdateTheme,
  soundEnabled,
  onUpdateSound,
  soundType,
  onUpdateSoundType,
  onResetData,
  onLogout,
  onBack,
  savedCareers = [],
  onSelectSavedCareer,
  colors
}: SettingsPageProps) {

  const translationHelper = (key: string) => t(key, lang);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>{translationHelper('profile')}</Text>

      {/* Profile info box */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        <Text style={[styles.cardLabel, { color: colors.primary }]}>👤  USER DETAILS</Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoKey, { color: colors.textMuted }]}>Name:</Text>
          <Text style={[styles.infoVal, { color: colors.textMain }]}>{user?.name || 'Guest User'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoKey, { color: colors.textMuted }]}>Email:</Text>
          <Text style={[styles.infoVal, { color: colors.textMain }]}>{user?.email || 'Guest Session'}</Text>
        </View>
      </View>

      {/* Saved Careers Dashboard */}
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>⭐ Saved Careers ({savedCareers.length})</Text>
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        {savedCareers.length === 0 ? (
          <Text style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', textAlign: 'center', paddingVertical: Spacing.two }}>
            No saved careers yet. Explore courses, streams, or jobs and tap the star (★) to save them.
          </Text>
        ) : (
          savedCareers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.savedItemRow, { borderBottomColor: colors.borderColor }]}
              onPress={() => onSelectSavedCareer(item)}
            >
              <Text style={styles.savedIcon}>{item.icon || '💼'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.savedTitle, { color: colors.textMain }]}>{item.title}</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>{item.type}</Text>
                  </View>
                </View>
              </View>
              <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Language Selection */}
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>{translationHelper('language')}</Text>
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        <View style={styles.buttonGroup}>
          {[
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिन्दी (Hindi)' },
            { id: 'te', label: 'తెలుగు (Telugu)' }
          ].map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.groupBtn,
                { borderColor: colors.borderColor },
                lang === opt.id && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => onUpdateLang(opt.id)}
            >
              <Text style={{ color: lang === opt.id ? '#fff' : colors.textSub, fontWeight: '700', fontSize: 12 }}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sound Settings */}
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>{translationHelper('sounds')}</Text>
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        <View style={styles.switchRow}>
          <Text style={{ color: colors.textMain, fontWeight: '700' }}>Enable App Sounds</Text>
          <Switch
            value={soundEnabled}
            onValueChange={onUpdateSound}
            trackColor={{ false: colors.borderColor, true: colors.primary }}
            thumbColor={'#FFFFFF'}
          />
        </View>

        {soundEnabled && (
          <View style={{ marginTop: Spacing.two }}>
            <Text style={[styles.cardSublabel, { color: colors.textMuted }]}>Sound Effect Type:</Text>
            <View style={styles.buttonGroup}>
              {[
                { id: 'chime', label: '🔔 Chime' },
                { id: 'synth', label: '🎹 Synth' },
                { id: 'retro', label: '👾 Retro' }
              ].map(opt => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.groupBtn,
                    { borderColor: colors.borderColor },
                    soundType === opt.id && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => onUpdateSoundType(opt.id)}
                >
                  <Text style={{ color: soundType === opt.id ? '#fff' : colors.textSub, fontWeight: '700', fontSize: 12 }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Danger Zone */}
      <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>Danger Zone</Text>
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }]}
          onPress={onResetData}
        >
          <Text style={{ color: '#ef4444', fontWeight: '800', textAlign: 'center' }}>🔄 Reset Application Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: colors.borderColor, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginTop: Spacing.two }]}
          onPress={onLogout}
        >
          <Text style={{ color: colors.textMain, fontWeight: '800', textAlign: 'center' }}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      {/* About Box (Dynamic Stats requested by user) */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, marginBottom: 120 }]}>
        <Text style={[styles.cardLabel, { color: colors.primary }]}>{translationHelper('about')}</Text>
        <Text style={[styles.aboutText, { color: colors.textSub }]}>Product Name: <Text style={{ fontWeight: 'bold' }}>CareerPath AI</Text></Text>
        <Text style={[styles.aboutText, { color: colors.textSub }]}>Version: <Text style={{ fontWeight: 'bold' }}>2.1.0-Release</Text></Text>
        <Text style={[styles.aboutText, { color: colors.textSub }]}>Database Sync: <Text style={{ fontWeight: 'bold' }}>Graduation: 29K entries | 10th: 40 entries</Text></Text>
        <Text style={[styles.aboutText, { color: colors.textMuted, marginTop: Spacing.one }]}>© 2026 CareerPath AI Team. All Rights Reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.three,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    paddingVertical: Spacing.two,
    marginTop: Spacing.two,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: Spacing.two,
  },
  cardSublabel: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: Spacing.one,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: Spacing.one,
  },
  infoKey: {
    width: 60,
    fontWeight: '700',
    fontSize: 13,
  },
  infoVal: {
    flex: 1,
    fontWeight: '800',
    fontSize: 13,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  groupBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  aboutText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  savedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    gap: 12,
  },
  savedIcon: {
    fontSize: 24,
  },
  savedTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
