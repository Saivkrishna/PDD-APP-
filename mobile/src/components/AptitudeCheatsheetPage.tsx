import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme, Modal } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL } from '../config';
import { allAptitudeQuestions } from '../data/allQuizQuestions';
import aptitudeData from '../data/aptitudeData';

interface AptitudeProps {
  onBack: () => void;
  t: (key: string) => string;
  colors: any;
}

export default function AptitudeCheatsheetPage({ onBack, t, colors }: AptitudeProps) {
  const [activeTab, setActiveTab] = useState('lcm-hcf');
  const [showQuiz, setShowQuiz] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  const topics = [
    { id: 'lcm-hcf', label: 'LCM & HCF', emoji: '🧮' },
    { id: 'divisibility-remainder', label: 'Divisibility & Remainder', emoji: '🔢' },
    { id: 'ratio-proportion', label: 'Ratio & Proportion', emoji: '⚖️' },
    { id: 'mixture-alligation', label: 'Mixture & Alligation', emoji: '🧪' },
    { id: 'percentage', label: 'Percentage', emoji: '📊' },
    { id: 'profit-loss', label: 'Profit & Loss', emoji: '💰' },
    { id: 'time-work', label: 'Time & Work', emoji: '⏳' },
    { id: 'time-speed-distance', label: 'Time, Speed & Distance', emoji: '🏃' },
    { id: 'permutation-combination', label: 'Permutation & Combination', emoji: '🎲' },
    { id: 'probability', label: 'Probability', emoji: '🃏' },
    { id: 'clocks-calendar', label: 'Clocks & Calendar', emoji: '📅' }
  ];

  const handleStartQuiz = async (diff: 'easy' | 'medium' | 'hard') => {
    try {
      const normalizedTopic = activeTab === 'percentage' ? 'percentages' : activeTab;
      const res = await fetch(`${API_URL}/aptitude/questions/${normalizedTopic}/${diff}`);
      if (!res.ok) throw new Error('API response not ok');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setQuizQuestions([...data].sort(() => 0.5 - Math.random()).slice(0, 10));
        setDifficulty(diff);
        setCurrentIdx(0);
        setSelectedAns(null);
        setIsAnswered(false);
        setScore(0);
        setUserAnswers([]);
        setQuizFinished(false);
        setShowQuiz(true);
        return;
      }
      throw new Error('Empty questions data');
    } catch (err: any) {
      console.warn('⚠️ Falling back to offline bundle:', err.message);
      const filtered = allAptitudeQuestions.filter(q => q.topic === activeTab && q.difficulty === diff);
      let selected = [];
      if (filtered.length === 0) {
        const fallback = allAptitudeQuestions.filter(q => q.topic === activeTab);
        selected = fallback.length > 0 ? fallback : allAptitudeQuestions;
      } else {
        selected = filtered;
      }
      setQuizQuestions([...selected].sort(() => 0.5 - Math.random()).slice(0, 10));
      setDifficulty(diff);
      setCurrentIdx(0);
      setSelectedAns(null);
      setIsAnswered(false);
      setScore(0);
      setUserAnswers([]);
      setQuizFinished(false);
      setShowQuiz(true);
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAns(option);
    setIsAnswered(true);

    const correct = quizQuestions[currentIdx].answer;
    const isCorrect = option === correct;
    if (isCorrect) setScore(prev => prev + 1);

    setUserAnswers(prev => [
      ...prev.filter(ua => ua.qIndex !== currentIdx),
      { qIndex: currentIdx, selected: option, correct: isCorrect }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const currentTopicData = (aptitudeData as any)[activeTab];

  // Renders active quiz view
  if (showQuiz && quizQuestions.length > 0) {
    const q = quizQuestions[currentIdx];
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={() => setShowQuiz(false)}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>✕ Exit</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]}>Quiz: {difficulty?.toUpperCase()}</Text>
          <Text style={{ color: colors.primary, fontWeight: '800' }}>{currentIdx + 1}/{quizQuestions.length}</Text>
        </View>

        {!quizFinished ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>QUESTION {currentIdx + 1}</Text>
              <Text style={[styles.qText, { color: colors.textMain }]}>{q.q}</Text>
            </View>

            {q.options.map((opt: string, idx: number) => {
              const isSelected = selectedAns === opt;
              const isCorrectAnswer = opt === q.answer;
              const shouldShowCorrect = isAnswered && isCorrectAnswer;
              const shouldShowWrong = isAnswered && isSelected && !isCorrectAnswer;

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.optBtn,
                    { backgroundColor: colors.inputBg, borderColor: colors.borderColor },
                    isSelected && { borderColor: colors.primary },
                    shouldShowCorrect && { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981' },
                    shouldShowWrong && { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }
                  ]}
                  onPress={() => handleAnswerSelect(opt)}
                  disabled={isAnswered}
                >
                  <Text style={[styles.optText, { color: colors.textMain }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}

            {isAnswered && (
              <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, marginTop: Spacing.three }]}>
                <Text style={{ color: selectedAns === q.answer ? '#10b981' : '#ef4444', fontWeight: '800', marginBottom: Spacing.one }}>
                  {selectedAns === q.answer ? '✅ Correct Answer!' : '❌ Incorrect Answer!'}
                </Text>
                <Text style={{ color: colors.textMain, fontSize: 13, lineHeight: 18 }}>
                  {q.explanation}
                </Text>
                {q.shortcut && (
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700', marginTop: Spacing.two }}>
                    ⚡ Shortcut: {q.shortcut}
                  </Text>
                )}
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={handleNextQuestion}>
                  <Text style={styles.nextBtnText}>
                    {currentIdx + 1 === quizQuestions.length ? '🏁 Finish Quiz' : 'Next Question ➔'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, alignItems: 'center' }]}>
              <Text style={{ fontSize: 50, marginBottom: Spacing.two }}>🏆</Text>
              <Text style={[styles.title, { color: colors.textMain, fontSize: 22 }]}>Quiz Completed!</Text>
              <Text style={{ color: colors.textSub, fontSize: 16, marginVertical: Spacing.two }}>
                You scored <Text style={{ color: colors.primary, fontWeight: '900' }}>{score}</Text> out of {quizQuestions.length}
              </Text>
              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: colors.primary, width: '80%', marginTop: Spacing.three }]}
                onPress={() => handleStartQuiz(difficulty || 'easy')}
              >
                <Text style={styles.nextBtnText}>🔄 Retake Quiz</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: colors.borderColor, borderWidth: 1, width: '80%', marginTop: Spacing.two }]}
                onPress={() => setShowQuiz(false)}
              >
                <Text style={{ color: colors.textMain, fontWeight: '800' }}>🚪 Exit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={onBack}>
          <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>Aptitude Practice</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabScrollContent}>
        {topics.map(t => {
          const isActive = activeTab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.scrollTabBtn, isActive && { borderBottomColor: colors.primary }]}
              onPress={() => setActiveTab(t.id)}
            >
              <Text style={[styles.tabLabel, { color: isActive ? colors.primary : colors.textMuted }]}>{t.emoji} {t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Launch Quiz Panel */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          <Text style={[styles.label, { color: colors.primary }]}>🎯 INTERACTIVE PRACTICE QUIZ</Text>
          <Text style={[styles.title, { color: colors.textMain, fontSize: 16 }]}>Choose Difficulty to Practice:</Text>
          <View style={styles.diffRow}>
            {(['easy', 'medium', 'hard'] as const).map(diff => (
              <TouchableOpacity
                key={diff}
                style={[styles.diffBtn, { borderColor: colors.borderColor }]}
                onPress={() => handleStartQuiz(diff)}
              >
                <Text style={[styles.diffLabel, { color: colors.primary }]}>{diff.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cheat Sheet Formulas */}
        {currentTopicData && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>📚 CHEATSHEET FORMULAS</Text>
            <Text style={[styles.title, { color: colors.textMain, fontSize: 18, marginBottom: Spacing.two }]}>{currentTopicData.title}</Text>
            {currentTopicData.sections?.map((sec: any, idx: number) => (
              <View key={idx} style={{ marginVertical: Spacing.two }}>
                <Text style={{ color: colors.textMain, fontWeight: '800', fontSize: 14 }}>🔑 {sec.title}</Text>
                {sec.formulae?.map((f: string, fIdx: number) => (
                  <Text key={fIdx} style={[styles.bullet, { color: colors.textSub, marginLeft: 12 }]}>• {f}</Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    gap: Spacing.two,
  },
  backBtn: {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
  },
  tabScroll: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tabScrollContent: {
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
  scrollTabBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  scrollContent: {
    padding: Spacing.three,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: Spacing.one,
  },
  title: {
    fontWeight: '900',
    marginBottom: Spacing.one,
  },
  diffRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  diffBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  diffLabel: {
    fontWeight: '800',
    fontSize: 12,
  },
  bullet: {
    fontSize: 13,
    marginVertical: 3,
    lineHeight: 18,
  },
  qText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  optBtn: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  optText: {
    fontSize: 14,
    fontWeight: '700',
  },
  nextBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.three,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
