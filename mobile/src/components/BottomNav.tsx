import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Platform } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface BottomNavProps {
  active: string;
  onNav: (tab: string) => void;
  t: (key: string) => string;
}

export default function BottomNav({ active, onNav, t }: BottomNavProps) {
  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  const items = [
    { id: 'home', icon: '🏠', label: t('home') || 'Home' },
    { id: 'education', icon: '🎓', label: t('education') || 'Education' },
    { id: 'aptitude', icon: '📝', label: t('aptitude') || 'Aptitude' },
    { id: 'tech-learning', icon: '📚', label: t('techLearning') || 'Hub' },
    { id: 'settings', icon: '👤', label: t('profileTab') || 'Profile' },
  ];

  return (
    <View style={[styles.navBar, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
      {items.map((item) => {
        const isActive =
          active === item.id ||
          (item.id === 'education' &&
            (active === 'after10th' || active === 'after12th' || active === 'graduation'));

        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.navItem,
              isActive && { backgroundColor: 'rgba(99, 102, 241, 0.08)' },
            ]}
            onPress={() => onNav(item.id)}
          >
            <Text style={[styles.navIcon, isActive && styles.navIconActive]}>{item.icon}</Text>
            <Text
              style={[
                styles.navLabel,
                { color: isActive ? colors.primary : colors.textMuted },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 30,
    padding: Spacing.one,
    marginHorizontal: Spacing.three,
    marginBottom: Platform.select({ ios: 30, android: 16 }) || 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    borderRadius: 20,
    gap: 4,
  },
  navIcon: {
    fontSize: 20,
  },
  navIconActive: {
    transform: [{ scale: 1.15 }],
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
});
