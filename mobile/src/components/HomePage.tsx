import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, useColorScheme, FlatList } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL } from '../config';

interface HomePageProps {
  onNav: (page: string) => void;
  t: (key: string) => string;
  user: any;
  darkMode: boolean;
}

export default function HomePage({ onNav, t, user, darkMode }: HomePageProps) {
  const [trending, setTrending] = useState<any[]>([]);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

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
    fetch(`${API_URL}/overview`)
      .then(r => r.json())
      .then(d => setTrending(d.trending || []))
      .catch(() => {});

    setQuoteIdx(Math.floor(Math.random() * quotes.length));
  }, []);

  const getGreeting = () => {
    const hr = new Date().getHours();
    const name = user && user.name ? user.name.split(' ')[0] : '';
    const greetWord = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    return name ? `${greetWord}, ${name}! 👋` : `${greetWord}! 👋`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting Header */}
      <View style={styles.heroBox}>
        <Text style={[styles.greeting, { color: colors.textMain }]}>{getGreeting()}</Text>
        <Text style={[styles.heroSub, { color: colors.textSub }]}>
          Ready to construct your future path? Explore curated roadmaps, test strategies, and utilize Gemini-powered AI guidance.
        </Text>

        {/* Search bar button */}
        <TouchableOpacity
          style={[styles.searchBarBtn, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
          onPress={() => onNav('search')}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={[styles.searchText, { color: colors.textMuted }]}>Search careers, jobs, courses...</Text>
        </TouchableOpacity>
      </View>

      {/* Quote card */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        <View style={styles.quoteHeader}>
          <Text style={styles.quoteIcon}>💡</Text>
          <View style={[styles.streakBadge, { backgroundColor: 'rgba(251, 191, 36, 0.12)', borderColor: 'rgba(251, 191, 36, 0.3)' }]}>
            <Text style={styles.streakText}>🔥 STREAK: 4 DAYS</Text>
          </View>
        </View>
        <Text style={[styles.quoteText, { color: colors.textMain }]}>
          "{quotes[quoteIdx].text}"
        </Text>
        <Text style={[styles.quoteAuthor, { color: colors.primary }]}>— {quotes[quoteIdx].author}</Text>
        <TouchableOpacity
          style={[styles.nextQuoteBtn, { borderColor: colors.borderColor }]}
          onPress={() => setQuoteIdx((quoteIdx + 1) % quotes.length)}
        >
          <Text style={{ color: colors.textSub, fontSize: 11, fontWeight: '700' }}>🔄 Next Quote</Text>
        </TouchableOpacity>
      </View>



      {/* Education stages section title */}
      <Text style={[styles.sectionHeader, { color: colors.textMain }]}>Explore Education Stages</Text>
      <View style={styles.stageGrid}>
        {/* After 10th */}
        <TouchableOpacity
          style={[styles.stageCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
          onPress={() => onNav('after10th')}
        >
          <Text style={styles.stageIcon}>🏫</Text>
          <Text style={[styles.stageTitle, { color: colors.textMain }]}>{t('after10th')}</Text>
          <Text style={[styles.stageDesc, { color: colors.textSub }]}>ITI trades, polytechnic diplomas, subject streams, and direct recruitment.</Text>
          <Text style={[styles.stageLink, { color: colors.primary }]}>Explore →</Text>
        </TouchableOpacity>

        {/* After 12th */}
        <TouchableOpacity
          style={[styles.stageCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
          onPress={() => onNav('after12th')}
        >
          <Text style={styles.stageIcon}>🏛️</Text>
          <Text style={[styles.stageTitle, { color: colors.textMain }]}>{t('after12th')}</Text>
          <Text style={[styles.stageDesc, { color: colors.textSub }]}>Compare MPC, BiPC, CEC, MEC, Arts, find colleges & recruitment.</Text>
          <Text style={[styles.stageLink, { color: colors.primary }]}>Explore →</Text>
        </TouchableOpacity>

        {/* Graduation */}
        <TouchableOpacity
          style={[styles.stageCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
          onPress={() => onNav('graduation')}
        >
          <Text style={styles.stageIcon}>🎓</Text>
          <Text style={[styles.stageTitle, { color: colors.textMain }]}>{t('graduation')}</Text>
          <Text style={[styles.stageDesc, { color: colors.textSub }]}>PG roadmaps, study abroad guidelines, and placements vacancy.</Text>
          <Text style={[styles.stageLink, { color: colors.primary }]}>Explore →</Text>
        </TouchableOpacity>
      </View>

      {/* Brain Games & Quizzes section */}
      <Text style={[styles.sectionHeader, { color: colors.textMain }]}>Brain Training & Quizzes</Text>
      
      {/* Aptitude card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
        onPress={() => onNav('aptitude')}
      >
        <Text style={styles.cardHeaderIcon}>📝</Text>
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>Aptitude Practice</Text>
        <Text style={[styles.cardDesc, { color: colors.textSub }]}>
          LCM/GCD, ratio methods, percentage fractions, and solved practice questions for entrance exam hacks.
        </Text>
        <Text style={[styles.arrowLink, { color: colors.primary }]}>Practice Aptitude →</Text>
      </TouchableOpacity>

      {/* Learning Hub card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
        onPress={() => onNav('tech-learning')}
      >
        <Text style={styles.cardHeaderIcon}>📚</Text>
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>{t('techLearning') || 'Learning Hub'}</Text>
        <Text style={[styles.cardDesc, { color: colors.textSub }]}>
          Access official tutorials, youtube video collections, and learning tracks for 53+ technical subjects.
        </Text>
        <Text style={[styles.arrowLink, { color: colors.primary }]}>Explore Hub →</Text>
      </TouchableOpacity>

      {/* Memory Matrix card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
        onPress={() => onNav('memory-matrix')}
      >
        <Text style={styles.cardHeaderIcon}>🧠</Text>
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>Memory Matrix</Text>
        <Text style={[styles.cardDesc, { color: colors.textSub }]}>
          Train spatial recall by remembering grids of glowing tiles. Earn career coins daily!
        </Text>
        <Text style={[styles.arrowLink, { color: colors.primary }]}>Play Matrix →</Text>
      </TouchableOpacity>

      {/* Arithmetic Rain card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
        onPress={() => onNav('arithmetic-rain')}
      >
        <Text style={styles.cardHeaderIcon}>🌧️</Text>
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>Arithmetic Rain</Text>
        <Text style={[styles.cardDesc, { color: colors.textSub }]}>
          Solve falling mathematical equations quickly before they hit the ground.
        </Text>
        <Text style={[styles.arrowLink, { color: colors.primary }]}>Play Rain →</Text>
      </TouchableOpacity>
      
      {/* Extra spacer at bottom so scroll doesn't cover navbar */}
      <View style={{ height: 110 }} />
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
  heroBox: {
    paddingVertical: Spacing.two,
    marginBottom: Spacing.three,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: Spacing.one,
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  searchBarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    marginTop: Spacing.two,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchText: {
    fontSize: 13,
    fontWeight: '500',
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  quoteIcon: {
    fontSize: 24,
  },
  streakBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  streakText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '800',
  },
  quoteText: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  quoteAuthor: {
    fontSize: 11,
    fontWeight: '800',
    alignSelf: 'flex-end',
    marginTop: Spacing.one,
  },
  nextQuoteBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: Spacing.two,
  },
  cardHeaderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  arrowLink: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    marginVertical: Spacing.three,
  },
  stageGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  stageCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.two,
    justifyContent: 'space-between',
    minHeight: 160,
  },
  stageIcon: {
    fontSize: 28,
  },
  stageTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  stageDesc: {
    fontSize: 10,
    lineHeight: 13,
    marginTop: 2,
    marginBottom: 6,
  },
  stageLink: {
    fontSize: 11,
    fontWeight: '800',
  },
});
