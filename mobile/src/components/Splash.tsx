import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface SplashProps {
  onEnter: () => void;
}

export default function Splash({ onEnter }: SplashProps) {
  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.icon}>🎓</Text>
      <Text style={[styles.title, { color: colors.textMain }]}>CareerPath AI</Text>
      <Text style={[styles.subtitle, { color: colors.textSub }]}>
        Your Dreams Begin With the Right Path
      </Text>

      <View style={styles.pillContainer}>
        {['🤖 AI Guidance', '📚 All Streams', '💰 Salary Info', '💼 Career Roles'].map((tag) => (
          <View
            key={tag}
            style={[
              styles.pill,
              {
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderColor: colors.borderColor,
              },
            ]}
          >
            <Text style={[styles.pillText, { color: colors.primary }]}>{tag}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          },
        ]}
        onPress={onEnter}
      >
        <Text style={styles.buttonText}>🚀 Explore Careers</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  icon: {
    fontSize: 80,
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    marginBottom: Spacing.one,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: Spacing.five,
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.six,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    borderWidth: 1,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
