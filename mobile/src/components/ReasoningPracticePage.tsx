import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing } from '@/constants/theme';
import { reasoningQuizQuestions } from '../data/reasoningQuizData';

interface ReasoningProps {
  onBack: () => void;
  t: (key: string) => string;
}

export default function ReasoningPracticePage({ onBack, t }: ReasoningProps) {
  const topics = [
    { id: 'series', name: 'Series', icon: '📈', totalQs: 15 },
    { id: 'coding-decoding', name: 'Coding-Decoding', icon: '🔐', totalQs: 15 },
    { id: 'syllogism', name: 'Syllogism', icon: '🧠', totalQs: 15 },
    { id: 'blood-relations', name: 'Blood Relations', icon: '👪', totalQs: 15 },
    { id: 'directions', name: 'Directions', icon: '🧭', totalQs: 15 },
    { id: 'puzzles', name: 'Puzzles', icon: '🧩', totalQs: 15 },
    { id: 'data-interpretation', name: 'Data Interpretation', icon: '📊', totalQs: 15 }
  ];

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [mode, setMode] = useState<'practice' | 'test'>('practice');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);

  const [attemptedQIds, setAttemptedQIds] = useState<string[]>([]);
  const [progressData, setProgressData] = useState<Record<string, { attempted: number, correct: number }>>({});

  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  // Load progress metrics from AsyncStorage on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedQIds = await AsyncStorage.getItem('cp_reasoning_attempted_qids');
        if (savedQIds) setAttemptedQIds(JSON.parse(savedQIds));

        const savedProgress = await AsyncStorage.getItem('cp_reasoning_progress');
        if (savedProgress) setProgressData(JSON.parse(savedProgress));
      } catch (e) {
        console.warn('Failed to load reasoning progress data:', e);
      }
    };
    loadProgress();
  }, []);

  const saveProgressData = async (topicId: string, newAttempted: number, newCorrect: number) => {
    try {
      const updated = {
        ...progressData,
        [topicId]: {
          attempted: Math.min(newAttempted, topics.find(t => t.id === topicId)?.totalQs || 15),
          correct: newCorrect
        }
      };
      setProgressData(updated);
      await AsyncStorage.setItem('cp_reasoning_progress', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save reasoning progress:', e);
    }
  };

  const startSession = (topicId: string) => {
    const filtered = reasoningQuizQuestions.filter(q => q.topic === topicId);
    // Shuffle and pick 10 questions max
    const selected = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    setQuizQuestions(selected);
    setSelectedTopic(topicId);
    setCurrentIdx(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setQuizFinished(false);
  };

  const handleAnswerSelect = (option: string) => {
    if (isAnswered && mode === 'practice') return;
    setSelectedAns(option);

    const correct = quizQuestions[currentIdx].answer;
    const isCorrect = option === correct;

    if (mode === 'practice') {
      setIsAnswered(true);
      if (isCorrect) setScore(prev => prev + 1);
      setUserAnswers(prev => [
        ...prev.filter(ua => ua.qIndex !== currentIdx),
        { qIndex: currentIdx, selected: option, correct: isCorrect }
      ]);
    } else {
      // Test Mode: go to next or store answer directly
      setUserAnswers(prev => [
        ...prev.filter(ua => ua.qIndex !== currentIdx),
        { qIndex: currentIdx, selected: option, correct: isCorrect }
      ]);
      if (currentIdx + 1 < quizQuestions.length) {
        setCurrentIdx(currentIdx + 1);
        setSelectedAns(null);
      } else {
        // Calculate score and finish
        const finalScore = [...userAnswers.filter(ua => ua.qIndex !== currentIdx), { qIndex: currentIdx, selected: option, correct: isCorrect }]
          .filter(ua => ua.correct).length;
        setScore(finalScore);
        setQuizFinished(true);
        if (selectedTopic) {
          saveProgressData(selectedTopic, 10, finalScore);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      if (selectedTopic) {
        saveProgressData(selectedTopic, 10, score);
      }
    }
  };

  const handleExit = () => {
    setSelectedTopic(null);
    setQuizQuestions([]);
  };

  // 1. Active Quiz view
  if (selectedTopic && quizQuestions.length > 0) {
    const q = quizQuestions[currentIdx];
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={handleExit}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>✕ Exit</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]}>Reasoning Quiz</Text>
          <Text style={{ color: colors.primary, fontWeight: '800' }}>{currentIdx + 1}/{quizQuestions.length}</Text>
        </View>

        {!quizFinished ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>{mode.toUpperCase()} MODE</Text>
              <Text style={[styles.qText, { color: colors.textMain }]}>{q.q}</Text>
            </View>

            {q.options.map((opt: string, idx: number) => {
              const isSelected = selectedAns === opt;
              const isCorrectAnswer = opt === q.answer;
              const shouldShowCorrect = mode === 'practice' && isAnswered && isCorrectAnswer;
              const shouldShowWrong = mode === 'practice' && isAnswered && isSelected && !isCorrectAnswer;

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
                >
                  <Text style={[styles.optText, { color: colors.textMain }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}

            {mode === 'practice' && isAnswered && (
              <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, marginTop: Spacing.three }]}>
                <Text style={{ color: selectedAns === q.answer ? '#10b981' : '#ef4444', fontWeight: '800', marginBottom: Spacing.one }}>
                  {selectedAns === q.answer ? '✅ Correct Answer!' : '❌ Incorrect Answer!'}
                </Text>
                <Text style={{ color: colors.textMain, fontSize: 13, lineHeight: 18 }}>
                  {q.explanation}
                </Text>
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={handleNext}>
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
              <Text style={[styles.title, { color: colors.textMain, fontSize: 22 }]}>Session Completed!</Text>
              <Text style={{ color: colors.textSub, fontSize: 16, marginVertical: Spacing.two }}>
                You scored <Text style={{ color: colors.primary, fontWeight: '900' }}>{score}</Text> out of {quizQuestions.length}
              </Text>
              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: colors.primary, width: '80%', marginTop: Spacing.three }]}
                onPress={() => startSession(selectedTopic)}
              >
                <Text style={styles.nextBtnText}>🔄 Retake Quiz</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: colors.borderColor, borderWidth: 1, width: '80%', marginTop: Spacing.two }]}
                onPress={handleExit}
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
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>Reasoning Practice</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Mode Selector */}
        <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          <Text style={[styles.label, { color: colors.primary }]}>🎯 SESSION MODE</Text>
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'practice' && { backgroundColor: colors.primary }]}
              onPress={() => setMode('practice')}
            >
              <Text style={[styles.modeBtnText, { color: mode === 'practice' ? '#fff' : colors.textSub }]}>Practice (Immediate Feedback)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'test' && { backgroundColor: colors.primary }]}
              onPress={() => setMode('test')}
            >
              <Text style={[styles.modeBtnText, { color: mode === 'test' ? '#fff' : colors.textSub }]}>Test (Timed / Non-Interactive)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Topics List */}
        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Select Topic to Start:</Text>
        {topics.map(t => {
          const stats = progressData[t.id] || { attempted: 0, correct: 0 };
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
              onPress={() => startSession(t.id)}
            >
              <Text style={styles.listIcon}>{t.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.listTitle, { color: colors.textMain }]}>{t.name}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                  Accuracy: {stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0}% ({stats.correct}/{stats.attempted} Qs)
                </Text>
              </View>
              <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
            </TouchableOpacity>
          );
        })}
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  modeRow: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  modeBtn: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    alignItems: 'center',
  },
  modeBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: Spacing.two,
    gap: 12,
  },
  listIcon: {
    fontSize: 24,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '800',
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
