import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, useColorScheme, FlatList } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL } from '../config';

interface HomePageProps {
  onNav: (page: string) => void;
  t: (key: string) => string;
  user: any;
  darkMode: boolean;
  colors: any;
}

export default function HomePage({ onNav, t, user, darkMode, colors }: HomePageProps) {
  const [trending, setTrending] = useState<any[]>([]);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [selectedTrendingJob, setSelectedTrendingJob] = useState<any>(null);

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

  const exams = [
    { name: "JEE Main 2027", date: "2027-01-15T09:00:00", info: "Engineering entrance for IITs/NITs" },
    { name: "NEET UG 2027", date: "2027-05-02T10:00:00", info: "Medical entrance for MBBS/BDS" },
    { name: "CLAT 2027", date: "2026-12-06T14:00:00", info: "Law entrance for National Law Universities" },
    { name: "CAT 2026", date: "2026-11-29T09:00:00", info: "Post-graduate business entrance for IIMs" }
  ];

  const calculateDaysLeft = (targetDate: string) => {
    const difference = +new Date(targetDate) - +new Date();
    let days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

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

  if (selectedTrendingJob) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.detailHeader, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={() => setSelectedTrendingJob(null)}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]} numberOfLines={1}>
            {selectedTrendingJob.icon || '🔥'} {selectedTrendingJob.title}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Hero */}
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, alignItems: 'center', padding: Spacing.four }]}>
            <Text style={{ fontSize: 48, marginBottom: Spacing.one }}>{selectedTrendingJob.icon || '🔥'}</Text>
            <Text style={[styles.title, { color: colors.textMain, fontSize: 18, textAlign: 'center' }]}>{selectedTrendingJob.title}</Text>
            <View style={[styles.trendingGrowthBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)', marginTop: Spacing.one, paddingHorizontal: 12, paddingVertical: 4 }]}>
              <Text style={[styles.trendingGrowthText, { color: '#10b981', fontSize: 10 }]}>🔥 {selectedTrendingJob.growth || 'High'} Growth</Text>
            </View>
          </View>

          {/* Salary Package */}
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>💰 SALARY PACKAGE</Text>
            <Text style={{ color: '#34d399', fontWeight: '800', fontSize: 16, marginTop: 4 }}>{selectedTrendingJob.salary}</Text>
          </View>

          {/* Roadmap */}
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>🗺️ CAREER ROADMAP</Text>
            {[
              { title: "Build academic base", subtitle: "Complete baseline studies", desc: selectedTrendingJob.higherStudies && selectedTrendingJob.higherStudies.length > 0 ? `Acquire educational credentials: ${selectedTrendingJob.higherStudies.slice(0, 2).join(', ')}.` : "Complete baseline college studies in relevant disciplines." },
              { title: "Focus on hot skills", subtitle: "Master modern methods", desc: selectedTrendingJob.skills && selectedTrendingJob.skills.length > 0 ? `Develop trending industry capabilities: ${selectedTrendingJob.skills.slice(0, 3).join(', ')}.` : "Develop specialized and high-demand domain competencies." },
              { title: "Gain tool mastery", subtitle: "Learn industry software", desc: selectedTrendingJob.tools && selectedTrendingJob.tools.length > 0 ? `Gain advanced fluency in critical industry tools: ${selectedTrendingJob.tools.slice(0, 3).join(', ')}.` : "Master essential software platforms and tech systems." },
              { title: "Verify your expertise", subtitle: "Earn technical credentials", desc: selectedTrendingJob.certifications && selectedTrendingJob.certifications.length > 0 ? `Validate your abilities by securing credentials: ${selectedTrendingJob.certifications.slice(0, 3).join(', ')}.` : "Secure key professional certifications to stand out." },
              { title: "Scale your career", subtitle: "Settle in top tech hubs", desc: `Apply for premium opportunities in leading employment markets: ${selectedTrendingJob.locations && selectedTrendingJob.locations.length > 0 ? selectedTrendingJob.locations.slice(0, 3).join(', ') : 'major metropolitan areas'} with a high starting salary of ${selectedTrendingJob.salary || 'competitive figures'}.` }
            ].map((step, idx) => (
              <View key={idx} style={styles.roadmapStep}>
                <View style={[styles.roadmapStepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.roadmapStepNumberText}>{idx + 1}</Text>
                </View>
                <View style={styles.roadmapStepContent}>
                  <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 13 }}>{step.title}</Text>
                  <Text style={{ color: colors.textSub, fontSize: 11, marginTop: 2 }}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Job Description */}
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>📋 JOB DESCRIPTION</Text>
            <Text style={[styles.desc, { color: colors.textSub, marginTop: 4 }]}>{selectedTrendingJob.description}</Text>
          </View>

          {/* Skills Required */}
          {selectedTrendingJob.skills && selectedTrendingJob.skills.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🧠 SKILLS REQUIRED</Text>
              <View style={styles.skillsContainer}>
                {selectedTrendingJob.skills.map((skill: string) => (
                  <View key={skill} style={[styles.skillPill, { backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: colors.borderColor }]}>
                    <Text style={[styles.skillText, { color: colors.primary }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tools & Technologies */}
          {selectedTrendingJob.tools && selectedTrendingJob.tools.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🛠️ TOOLS & TECHNOLOGIES</Text>
              <View style={styles.skillsContainer}>
                {selectedTrendingJob.tools.map((tool: string) => (
                  <View key={tool} style={[styles.skillPill, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: colors.borderColor }]}>
                    <Text style={[styles.skillText, { color: '#10b981' }]}>{tool}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Certifications */}
          {selectedTrendingJob.certifications && selectedTrendingJob.certifications.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🏆 CERTIFICATIONS</Text>
              <View style={styles.skillsContainer}>
                {selectedTrendingJob.certifications.map((cert: string) => (
                  <View key={cert} style={[styles.skillPill, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: colors.borderColor }]}>
                    <Text style={[styles.skillText, { color: '#f59e0b' }]}>{cert}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Future Scope */}
          {selectedTrendingJob.futureScope && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🔮 FUTURE SCOPE</Text>
              <Text style={[styles.desc, { color: colors.textSub, marginTop: 4 }]}>{selectedTrendingJob.futureScope}</Text>
            </View>
          )}

          {/* Best Locations */}
          {selectedTrendingJob.locations && selectedTrendingJob.locations.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>📍 BEST LOCATIONS</Text>
              <View style={styles.skillsContainer}>
                {selectedTrendingJob.locations.map((loc: string) => (
                  <View key={loc} style={[styles.skillPill, { backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: colors.borderColor }]}>
                    <Text style={[styles.skillText, { color: colors.primary }]}>{loc}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    );
  }

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
          Ready to construct your future path? Explore curated roadmaps, study streams, direct job requirements, and test strategies.
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

      {/* TRENDING CAREERS (Matches Web App Bento Cards) */}
      {trending.length > 0 && (
        <View style={styles.trendingContainer}>
          <Text style={[styles.sectionHeader, { color: colors.textMain }]}>🔥 Trending Careers 2026</Text>
          <Text style={{ color: colors.textSub, fontSize: 12, marginTop: -Spacing.one, marginBottom: Spacing.two }}>
            High-growth tracks with strong future demand
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          >
            {trending.slice(0, 10).map((tVal, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.trendingCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
                onPress={() => setSelectedTrendingJob(tVal)}
              >
                <View style={styles.trendingCardTop}>
                  <Text style={styles.trendingCardIcon}>{tVal.icon || '🔥'}</Text>
                  <View style={[styles.trendingGrowthBadge, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                    <Text style={[styles.trendingGrowthText, { color: colors.primary }]}>🔥 {tVal.growth || 'High'}</Text>
                  </View>
                </View>
                <View style={{ marginTop: Spacing.two }}>
                  <Text style={[styles.trendingCardTitle, { color: colors.textMain }]} numberOfLines={2}>
                    {tVal.title}
                  </Text>
                  <Text style={[styles.trendingCardSalary, { color: '#10b981' }]}>
                    {tVal.salary}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* UPCOMING EXAMS CALENDAR (Matches Web App) */}
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
        <Text style={[styles.label, { color: colors.primary }]}>📅 UPCOMING ENTRANCE EXAMS</Text>
        <Text style={{ color: colors.textSub, fontSize: 12, marginBottom: Spacing.two }}>
          Days remaining and schedules for key admissions tests
        </Text>
        {exams.map(exam => {
          const days = calculateDaysLeft(exam.date);
          const percent = Math.max(0, Math.min(100, (days / 365) * 100));
          return (
            <View key={exam.name} style={styles.examItem}>
              <View style={styles.examRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.examName, { color: colors.textMain }]}>{exam.name}</Text>
                  <Text style={[styles.examInfo, { color: colors.textSub }]} numberOfLines={1}>{exam.info}</Text>
                </View>
                <View style={styles.examDaysContainer}>
                  <Text style={[styles.examDaysNumber, { color: days < 100 ? '#f87171' : colors.primary }]}>{days}</Text>
                  <Text style={[styles.examDaysLabel, { color: colors.textSub }]}>DAYS LEFT</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${Math.max(10, 100 - percent)}%` }]} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Career & Interview Prep section */}
      <Text style={[styles.sectionHeader, { color: colors.textMain }]}>Career & Interview Prep</Text>

      {/* ATS Resume Scanner card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
        onPress={() => onNav('ats-scanner')}
      >
        <Text style={styles.cardHeaderIcon}>🔎</Text>
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>ATS Resume Scanner</Text>
        <Text style={[styles.cardDesc, { color: colors.textSub }]}>
          Check your resume's ATS compatibility score, identify missing keywords/skills, and get actionable recommendations.
        </Text>
        <Text style={[styles.arrowLink, { color: colors.primary }]}>Scan Resume →</Text>
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

      {/* Reasoning card */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
        onPress={() => onNav('reasoning')}
      >
        <Text style={styles.cardHeaderIcon}>🧩</Text>
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>Reasoning Practice</Text>
        <Text style={[styles.cardDesc, { color: colors.textSub }]}>
          Syllogisms, circular seating arrangements, blood relation puzzles, and solved logic questions for placements.
        </Text>
        <Text style={[styles.arrowLink, { color: colors.primary }]}>Practice Reasoning →</Text>
      </TouchableOpacity>

      {/* Brain Games & Quizzes section */}
      <Text style={[styles.sectionHeader, { color: colors.textMain }]}>Brain Training & Memory</Text>

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
    fontFamily: 'Outfit',
    marginBottom: Spacing.one,
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter',
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
    fontFamily: 'Inter',
  },
  card: {
    borderWidth: 1,
    borderRadius: 24,
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
    fontFamily: 'Inter',
  },
  quoteText: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 18,
    fontFamily: 'Inter',
  },
  quoteAuthor: {
    fontSize: 11,
    fontWeight: '800',
    alignSelf: 'flex-end',
    marginTop: Spacing.one,
    fontFamily: 'Outfit',
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
    fontFamily: 'Outfit',
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  arrowLink: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Inter',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Outfit',
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
    borderRadius: 20,
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
    fontFamily: 'Outfit',
  },
  stageDesc: {
    fontSize: 10,
    lineHeight: 13,
    marginTop: 2,
    marginBottom: 6,
    fontFamily: 'Inter',
  },
  stageLink: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'Inter',
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: Spacing.one,
    fontFamily: 'Outfit',
  },
  detailHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    gap: Spacing.two,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
    fontFamily: 'Outfit',
  },
  backBtn: {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  scrollContent: {
    padding: Spacing.three,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontWeight: '900',
    marginBottom: Spacing.one,
    fontFamily: 'Outfit',
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    fontFamily: 'Inter',
  },
  bullet: {
    fontSize: 13,
    marginVertical: 3,
    fontFamily: 'Inter',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  skillPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  roadmapStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.two,
    gap: Spacing.three,
  },
  roadmapStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadmapStepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Outfit',
  },
  roadmapStepContent: {
    flex: 1,
  },
  trendingContainer: {
    marginBottom: Spacing.three,
  },
  trendingList: {
    paddingVertical: 4,
  },
  trendingCard: {
    width: 170,
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    marginRight: Spacing.two,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  trendingCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingCardIcon: {
    fontSize: 24,
  },
  trendingGrowthBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  trendingGrowthText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: 'Inter',
  },
  trendingCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: Spacing.two,
    fontFamily: 'Outfit',
  },
  trendingCardSalary: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    fontFamily: 'Inter',
  },
  examItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
  },
  examRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examName: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Outfit',
  },
  examInfo: {
    fontSize: 10,
    marginTop: 2,
    fontFamily: 'Inter',
  },
  examDaysContainer: {
    alignItems: 'flex-end',
  },
  examDaysNumber: {
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Outfit',
  },
  examDaysLabel: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: 'Inter',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
