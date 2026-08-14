import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  isBookmarked?: boolean;
  onToggleBookmarked?: () => void;
  onOpenSettings?: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({
  title,
  onBack,
  showBack = false,
  isBookmarked = false,
  onToggleBookmarked,
  onOpenSettings,
  darkMode,
  onToggleTheme
}: HeaderProps) {
  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  return (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.borderColor }]}>
      <View style={styles.leftSection}>
        {showBack && onBack && (
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={onBack}>
            <Text style={[styles.backBtnText, { color: colors.textMain }]}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.logo, { color: colors.textMain }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={[styles.circleBtn, { borderColor: colors.borderColor }]} onPress={onToggleTheme}>
          <Text style={styles.emojiText}>{darkMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>

        {onToggleBookmarked && (
          <TouchableOpacity style={[styles.circleBtn, { borderColor: colors.borderColor }]} onPress={onToggleBookmarked}>
            <Text style={[styles.emojiText, { color: isBookmarked ? '#f59e0b' : '#94a3b8' }]}>
              {isBookmarked ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        )}

        {onOpenSettings && (
          <TouchableOpacity style={[styles.circleBtn, { borderColor: colors.borderColor }]} onPress={onOpenSettings}>
            <Text style={styles.emojiText}>⚙️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.two,
  },
  logo: {
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
  },
  backBtn: {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  emojiText: {
    fontSize: 16,
  },
});
