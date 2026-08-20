import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, useColorScheme, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL } from '../config';

interface ATSScannerPageProps {
  onBack: () => void;
  t: (key: string) => string;
  user: any;
  colors: any;
}

export default function ATSScannerPage({ onBack, t, user, colors }: ATSScannerPageProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 states: Resume
  const [fileName, setFileName] = useState('');
  const [pastedResume, setPastedResume] = useState('');
  const [extractedResume, setExtractedResume] = useState<any>(null);

  // Step 2 states: JD
  const [jdText, setJdText] = useState('');
  
  // Step 3 states: Results
  const [overallScore, setOverallScore] = useState(0);
  const [matchLabel, setMatchLabel] = useState('');
  const [subScores, setSubScores] = useState<any>(null);
  const [matchedSkills, setMatchedSkills] = useState<any[]>([]);
  const [missingSkills, setMissingSkills] = useState<any[]>([]);
  const [formattingChecks, setFormattingChecks] = useState<any[]>([]);

  // Results Tab
  const [activeTab, setActiveTab] = useState<'MATCH' | 'KEYWORDS' | 'FORMATTING'>('MATCH');

  // Helper to convert string to Base64
  const toBase64 = (str: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 0x80) bytes.push(code);
      else if (code < 0x800) {
        bytes.push(0xc0 | (code >> 6));
        bytes.push(0x80 | (code & 0x3f));
      } else {
        bytes.push(0xe0 | (code >> 12));
        bytes.push(0x80 | ((code >> 6) & 0x3f));
        bytes.push(0x80 | (code & 0x3f));
      }
    }
    let result = '';
    let i = 0;
    while (i < bytes.length) {
      const b1 = bytes[i++];
      const b2 = i < bytes.length ? bytes[i++] : NaN;
      const b3 = i < bytes.length ? bytes[i++] : NaN;
      const enc1 = b1 >> 2;
      const enc2 = ((b1 & 3) << 4) | (isNaN(b2) ? 0 : b2 >> 4);
      const enc3 = isNaN(b2) ? 64 : ((b2 & 15) << 2) | (isNaN(b3) ? 0 : b3 >> 6);
      const enc4 = isNaN(b3) ? 64 : b3 & 63;
      result += chars.charAt(enc1) + chars.charAt(enc2) +
                (enc3 === 64 ? '=' : chars.charAt(enc3)) +
                (enc4 === 64 ? '=' : chars.charAt(enc4));
    }
    return result;
  };

  const handlePickDocument = async () => {
    setError('');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const pickedFile = result.assets[0];
      if (pickedFile.size && pickedFile.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB.');
        return;
      }

      setLoading(true);
      setFileName(pickedFile.name);

      // Read as Base64
      const base64Data = await FileSystem.readAsStringAsync(pickedFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(`${API_URL}/ats/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          fileName: pickedFile.name,
          mimeType: pickedFile.mimeType || 'text/plain',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract resume text.');
      }

      setExtractedResume(data);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'An error occurred during resume extraction.');
      setFileName('');
    } finally {
      setLoading(false);
    }
  };

  const handleParsePastedText = async () => {
    if (!pastedResume.trim()) {
      setError('Please paste your resume text first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const base64Data = toBase64(pastedResume);
      const response = await fetch(`${API_URL}/ats/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          fileName: 'resume.txt',
          mimeType: 'text/plain',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse resume text.');
      }

      setExtractedResume(data);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'An error occurred during resume parsing.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = (role: string) => {
    const templates: Record<string, string> = {
      frontend: `Job Title: Frontend Web Engineer\nRequirements:\n- 3+ years experience with React, HTML5, and CSS3.\n- Strong proficiency in TypeScript and responsive UI layouts.\n- Experience in API integration, state management, and Git version control.`,
      backend: `Job Title: Backend Developer\nRequirements:\n- 4+ years of Node.js, Express, and REST APIs.\n- Strong SQL experience (PostgreSQL/MySQL) and MongoDB.\n- Experience deploying on AWS, Docker, and caching with Redis.`,
      data: `Job Title: Data Analyst\nRequirements:\n- 2+ years of Python (Pandas, NumPy), Excel macros, and SQL.\n- Experience building dashboard metrics using Tableau or PowerBI.\n- Strong analytical reasoning and statistical modeling capabilities.`
    };
    setJdText(templates[role] || '');
  };

  const handleComputeMatch = async () => {
    if (!jdText.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // 1. Parse Job Description
      const jdResponse = await fetch(`${API_URL}/ats/parse-jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText }),
      });

      const jdData = await jdResponse.json();
      if (!jdResponse.ok) {
        throw new Error(jdData.error || 'Failed to parse job description.');
      }

      const parsedJdObj = jdData.parsedJd;

      // 2. Perform Skill Matching
      const matchResponse = await fetch(`${API_URL}/ats/match-skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeSections: extractedResume.sections,
          parsedJd: parsedJdObj,
        }),
      });

      const matchData = await matchResponse.json();
      if (!matchResponse.ok) {
        throw new Error(matchData.error || 'Failed to match resume skills.');
      }

      setMatchedSkills(matchData.matchedSkills || []);
      setMissingSkills(matchData.missingSkills || []);

      // 3. Compute Scores
      const scoreResponse = await fetch(`${API_URL}/ats/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeSections: extractedResume.sections,
          parsedJd: parsedJdObj,
          matchedSkills: matchData.matchedSkills,
          missingSkills: matchData.missingSkills,
        }),
      });

      const scoreData = await scoreResponse.json();
      if (!scoreResponse.ok) {
        throw new Error(scoreData.error || 'Failed to compute scoring breakdown.');
      }

      setOverallScore(scoreData.overallScore || 0);
      setMatchLabel(scoreData.matchLabel || 'Fair');
      setSubScores(scoreData.subScores || null);
      setFormattingChecks(scoreData.formattingChecks || []);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'An error occurred during scoring calculation.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={onBack}>
          <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>ATS Resume Scanner 🔎</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step Indicator */}
        <View style={styles.indicatorContainer}>
          <Text style={[styles.indicatorText, { color: step >= 1 ? colors.primary : colors.textSub }]}>
            1. Resume {step > 1 ? '✓' : ''}
          </Text>
          <Text style={[styles.indicatorText, { color: step >= 2 ? colors.primary : colors.textSub }]}>
            2. Job Desc {step > 2 ? '✓' : ''}
          </Text>
          <Text style={[styles.indicatorText, { color: step >= 3 ? colors.primary : colors.textSub }]}>
            3. Results
          </Text>
        </View>

        {/* STEP 1: RESUME UPLOAD OR PASTE */}
        {step === 1 && (
          <View>
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.cardTitle, { color: colors.textMain }]}>Upload or Paste Resume</Text>
              <Text style={[styles.cardDesc, { color: colors.textSub }]}>
                Provide your resume as a file or paste its text directly. Everything is processed privately.
              </Text>

              {/* File Picker Option */}
              <TouchableOpacity
                style={[styles.uploadBox, { borderColor: colors.borderColor }]}
                onPress={handlePickDocument}
                disabled={loading}
              >
                <Text style={styles.uploadIcon}>📁</Text>
                <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 13, marginTop: 4, textAlign: 'center' }}>
                  {fileName ? fileName : 'Select PDF, DOCX, or TXT Resume'}
                </Text>
                <Text style={{ color: colors.textSub, fontSize: 10, marginTop: 2 }}>
                  Max size: 5MB
                </Text>
              </TouchableOpacity>

              <Text style={[styles.orText, { color: colors.textSub }]}>— OR PASTE TEXT —</Text>

              <TextInput
                style={[styles.textarea, { color: colors.textMain, borderColor: colors.borderColor }]}
                placeholder="Paste your plain text resume content here..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={8}
                value={pastedResume}
                onChangeText={setPastedResume}
                editable={!loading}
              />

              {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}

              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: Spacing.three }} />
              ) : (
                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                  onPress={handleParsePastedText}
                >
                  <Text style={styles.btnText}>Parse & Continue →</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Hint Box */}
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.sectionTitle, { color: colors.textMain }]}>🔒 Client Privacy First</Text>
              <Text style={{ color: colors.textSub, fontSize: 11, lineHeight: 16, marginTop: 4 }}>
                We never store your resume files permanently or share them with third parties. Section parsing is performed on your live instance.
              </Text>
            </View>
          </View>
        )}

        {/* STEP 2: JOB DESCRIPTION */}
        {step === 2 && (
          <View>
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.cardTitle, { color: colors.textMain }]}>Target Job Description</Text>
              <Text style={[styles.cardDesc, { color: colors.textSub }]}>
                Paste the requirements for the job you are targeting. We will match it against your resume sections.
              </Text>

              {/* Template Buttons */}
              <View style={styles.templateRow}>
                <TouchableOpacity style={[styles.tempBtn, { borderColor: colors.borderColor }]} onPress={() => handleApplyTemplate('frontend')}>
                  <Text style={{ color: colors.textMain, fontSize: 11, fontWeight: '700' }}>💻 Frontend</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tempBtn, { borderColor: colors.borderColor }]} onPress={() => handleApplyTemplate('backend')}>
                  <Text style={{ color: colors.textMain, fontSize: 11, fontWeight: '700' }}>⚙️ Backend</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tempBtn, { borderColor: colors.borderColor }]} onPress={() => handleApplyTemplate('data')}>
                  <Text style={{ color: colors.textMain, fontSize: 11, fontWeight: '700' }}>📊 Data Analyst</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.textarea, { color: colors.textMain, borderColor: colors.borderColor, height: 160 }]}
                placeholder="Paste job description details here... (Include technologies, responsibilities, and target experience)"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={10}
                value={jdText}
                onChangeText={setJdText}
                editable={!loading}
              />

              {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}

              {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: Spacing.three }} />
              ) : (
                <View style={styles.btnRow}>
                  <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.borderColor }]} onPress={() => setStep(1)}>
                    <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.primaryBtn, { backgroundColor: colors.primary, flex: 1, marginLeft: Spacing.two }]}
                    onPress={handleComputeMatch}
                  >
                    <Text style={styles.btnText}>Analyze & Match 🚀</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* STEP 3: RESULTS DASHBOARD */}
        {step === 3 && (
          <View>
            {/* Score Summary Box */}
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, alignItems: 'center', paddingVertical: Spacing.four }]}>
              <Text style={[styles.scoreLabel, { color: colors.textSub }]}>ATS COMPATIBILITY SCORE</Text>
              <View style={[styles.scoreCircle, { borderColor: getScoreColor(overallScore) }]}>
                <Text style={[styles.scoreText, { color: getScoreColor(overallScore) }]}>{Math.round(overallScore)}%</Text>
              </View>
              <Text style={{ color: colors.textMain, fontWeight: '800', fontSize: 16, marginTop: Spacing.two }}>
                Match Assessment: <Text style={{ color: getScoreColor(overallScore) }}>{matchLabel}</Text>
              </Text>
            </View>

            {/* Result Tabs */}
            <View style={styles.tabBar}>
              {(['MATCH', 'KEYWORDS', 'FORMATTING'] as const).map(tab => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabItem,
                    activeTab === tab && { borderBottomColor: colors.primary }
                  ]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[
                    styles.tabText,
                    { color: activeTab === tab ? colors.primary : colors.textSub }
                  ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* TAB CONTENT: MATCH BREAKDOWN */}
            {activeTab === 'MATCH' && subScores && (
              <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
                <Text style={[styles.sectionTitle, { color: colors.textMain, marginBottom: Spacing.three }]}>Sub-Score Breakdown</Text>
                
                {[
                  { name: 'Core Skill Match', val: subScores.skillsMatch },
                  { name: 'Experience Relevance', val: subScores.experienceRelevance },
                  { name: 'Project Matching', val: subScores.projectRelevance },
                  { name: 'Education Alignment', val: subScores.educationRelevance },
                  { name: 'Certifications', val: subScores.certifications },
                  { name: 'Formatting & Layout', val: subScores.atsFormatting },
                  { name: 'Structure & Blocks', val: subScores.resumeStructure },
                ].map((item, idx) => (
                  <View key={idx} style={{ marginBottom: Spacing.two }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ color: colors.textMain, fontSize: 12, fontWeight: '600' }}>{item.name}</Text>
                      <Text style={{ color: colors.textSub, fontSize: 12, fontWeight: '800' }}>{Math.round(item.val)}%</Text>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
                      <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${item.val}%` }]} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* TAB CONTENT: KEYWORDS */}
            {activeTab === 'KEYWORDS' && (
              <View>
                {/* Matched Keywords */}
                <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
                  <Text style={[styles.sectionTitle, { color: '#10b981' }]}>✓ Matched Keywords ({matchedSkills.length})</Text>
                  <Text style={{ color: colors.textSub, fontSize: 11, marginVertical: 6 }}>
                    These matching skills from the Job Description were detected in your resume structure.
                  </Text>
                  <View style={styles.tagGrid}>
                    {matchedSkills.length > 0 ? (
                      matchedSkills.map((s, idx) => (
                        <View key={idx} style={[styles.tagPill, { backgroundColor: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                          <Text style={{ color: '#10b981', fontSize: 11, fontWeight: '700' }}>{s.skill}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={{ color: colors.textSub, fontSize: 12, fontStyle: 'italic' }}>No matching keywords identified.</Text>
                    )}
                  </View>
                </View>

                {/* Missing Keywords */}
                <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
                  <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>✗ Missing Keywords ({missingSkills.length})</Text>
                  <Text style={{ color: colors.textSub, fontSize: 11, marginVertical: 6 }}>
                    Consider incorporating these key phrases into your resume fields to score higher.
                  </Text>
                  <View style={styles.tagGrid}>
                    {missingSkills.length > 0 ? (
                      missingSkills.map((s, idx) => (
                        <View key={idx} style={[styles.tagPill, { backgroundColor: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
                          <Text style={{ color: '#ef4444', fontSize: 11, fontWeight: '700' }}>{s.skill}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={{ color: colors.textSub, fontSize: 12, fontStyle: 'italic' }}>Excellent! No missing critical skills.</Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* TAB CONTENT: FORMATTING CHECKLIST */}
            {activeTab === 'FORMATTING' && (
              <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
                <Text style={[styles.sectionTitle, { color: colors.textMain }]}>ATS Formatting Checklist</Text>
                <Text style={{ color: colors.textSub, fontSize: 11, marginVertical: 6 }}>
                  Scans for typical parser bugs (date sanity, special characters, and contact fields).
                </Text>

                {formattingChecks.map((check, idx) => (
                  <View key={idx} style={[styles.checkRow, { borderBottomColor: colors.borderColor }]}>
                    <Text style={{ fontSize: 18, marginRight: Spacing.two }}>
                      {check.passed ? '✅' : '⚠️'}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.textMain, fontWeight: '700', fontSize: 12 }}>{check.checkName}</Text>
                      <Text style={{ color: colors.textSub, fontSize: 11, marginTop: 2 }}>{check.message}</Text>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: Spacing.three }]}
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.btnText}>Scan Another Resume 🔄</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        <View style={{ height: 60 }} />
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    flex: 1,
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
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.three,
  },
  indicatorText: {
    fontSize: 11,
    fontWeight: '800',
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  cardDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: Spacing.three,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  uploadIcon: {
    fontSize: 32,
  },
  orText: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: Spacing.three,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.three,
    fontSize: 13,
    height: 120,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  primaryBtn: {
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.three,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  templateRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  tempBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: Spacing.three,
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.three,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: '900',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginBottom: Spacing.three,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  tagPill: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  checkRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
});
