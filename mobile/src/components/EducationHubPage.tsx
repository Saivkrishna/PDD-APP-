import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface EducationHubProps {
  onNav: (page: string) => void;
  t: (key: string) => string;
  colors: any;
}

export default function EducationHubPage({ onNav, t, colors }: EducationHubProps) {
  const stages = [
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
      sub: 'Explore job roles, PG courses, higher studies, and study abroad options.'
    }
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>🎓</Text>
        <Text style={[styles.title, { color: colors.textMain }]}>{t('education') || 'Education Pathways'}</Text>
        <Text style={[styles.subtitle, { color: colors.textSub }]}>
          Choose your academic stage to discover curated career maps and courses
        </Text>
      </View>

      <View style={styles.grid}>
        {stages.map(stage => (
          <TouchableOpacity
            key={stage.id}
            style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
            onPress={() => onNav(stage.id)}
          >
            <Text style={styles.cardIcon}>{stage.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.textMain }]}>{stage.title}</Text>
              <Text style={[styles.cardSub, { color: colors.textSub }]}>{stage.sub}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
    marginBottom: Spacing.three,
  },
  heroIcon: {
    fontSize: 56,
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: Spacing.one,
    fontFamily: 'Outfit',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
    fontFamily: 'Inter',
  },
  grid: {
    gap: Spacing.three,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 24,
    padding: Spacing.three,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardIcon: {
    fontSize: 44,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Outfit',
  },
  cardSub: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
    fontFamily: 'Inter',
  },
});
