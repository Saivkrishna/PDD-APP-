import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme, FlatList } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL } from '../config';

interface After12thPageProps {
  onBack: () => void;
  t: (key: string) => string;
  initialTarget?: any;
  clearTarget?: () => void;
  colors: any;
}

export default function After12thPage({
  onBack,
  t,
  initialTarget,
  clearTarget,
  colors
}: After12thPageProps) {
  const [tab, setTab] = useState<'streams' | 'jobs'>('streams');
  const [streams, setStreams] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [loadingSectors, setLoadingSectors] = useState(false);

  const [selectedSector, setSelectedSector] = useState<any>(null);
  const [sectorDetail, setSectorDetail] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/after12th/streams`)
      .then(r => r.json())
      .then(setStreams)
      .catch(() => {});
    fetch(`${API_URL}/after12th/jobs`)
      .then(r => r.json())
      .then(setJobs)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialTarget && initialTarget.type === 'after12th') {
      if (initialTarget.tab) {
        setTab(initialTarget.tab);
      }
      if (initialTarget.streamId) {
        setTab('streams');
        const sObj = { id: initialTarget.streamId, label: initialTarget.streamId + ' Stream' };
        setSelectedStream(sObj);
        fetch(`${API_URL}/after12th/sectors/${initialTarget.streamId}`)
          .then(r => r.json())
          .then(sectorsList => {
            setSectors(sectorsList);
            const sec = sectorsList.find((s: any) => s.id === initialTarget.sectorId);
            if (sec) {
              setSelectedSector(sec);
              setLoadingDetails(true);
              fetch(`${API_URL}/after12th/sectors/${initialTarget.streamId}`)
                .then(r => r.json())
                .then(secList => {
                  const sDetail = secList.find((x: any) => x.id === initialTarget.sectorId);
                  if (sDetail) setSectorDetail(sDetail);
                  setLoadingDetails(false);
                })
                .catch(() => setLoadingDetails(false));
            }
          })
          .catch(() => {});
      } else if (initialTarget.tab === 'jobs' && initialTarget.jobId) {
        fetch(`${API_URL}/after12th/jobs`)
          .then(r => r.json())
          .then(jobsList => {
            const job = jobsList.find((j: any) => j.id === initialTarget.jobId);
            if (job) setSelectedJob(job);
          });
      }
      if (clearTarget) clearTarget();
    }
  }, [initialTarget]);

  const handleStreamClick = (stream: any) => {
    setSelectedStream(stream);
    setLoadingSectors(true);
    fetch(`${API_URL}/after12th/sectors/${stream.id}`)
      .then(r => r.json())
      .then(data => {
        setSectors(data);
        setLoadingSectors(false);
      })
      .catch(() => setLoadingSectors(false));
  };

  const handleSectorClick = (sector: any) => {
    setSelectedSector(sector);
    setLoadingDetails(true);
    fetch(`${API_URL}/after12th/sector/${selectedStream.id}/${sector.id}`)
      .then(r => r.json())
      .then(data => {
        setSectorDetail(data);
        setLoadingDetails(false);
      })
      .catch(() => setLoadingDetails(false));
  };

  const handlePageBack = () => {
    if (selectedSector) {
      setSelectedSector(null);
      setSectorDetail(null);
    } else if (selectedStream) {
      setSelectedStream(null);
      setSectors([]);
    } else if (selectedJob) {
      setSelectedJob(null);
    } else {
      onBack();
    }
  };

  // Render sector details
  if (selectedSector && sectorDetail) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={handlePageBack}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]} numberOfLines={1}>{selectedSector.label}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>💼 SECTOR STUDY</Text>
            <Text style={[styles.title, { color: colors.textMain, fontSize: 20 }]}>{sectorDetail.label}</Text>
            <Text style={[styles.desc, { color: colors.textSub }]}>{sectorDetail.description || 'Detailed career possibilities in this branch.'}</Text>
          </View>

          {sectorDetail.courses && sectorDetail.courses.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🎓 UNDERGRADUATE DEGREES</Text>
              {sectorDetail.courses.map((c: any, idx: number) => (
                <View key={idx} style={{ marginVertical: Spacing.one }}>
                  <Text style={{ color: colors.textMain, fontWeight: '800' }}>• {c.name || c}</Text>
                  {c.duration && <Text style={{ color: colors.textMuted, fontSize: 11, marginLeft: 12 }}>Duration: {c.duration}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Sector Skills */}
          {((sectorDetail.skills && sectorDetail.skills.length > 0) || (sectorDetail.skillsRequired && sectorDetail.skillsRequired.length > 0)) && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🛠️ KEY SKILLS TO LEARN</Text>
              <View style={styles.skillsContainer}>
                {(sectorDetail.skills || sectorDetail.skillsRequired).map((s: string, idx: number) => (
                  <View key={idx} style={[styles.skillPill, { backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: colors.borderColor }]}>
                    <Text style={[styles.skillText, { color: colors.primary }]}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Sector Roadmap */}
          {sectorDetail.howToBecome && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🗺️ STUDY & CAREER ROADMAP</Text>
              {Array.isArray(sectorDetail.howToBecome) ? (
                sectorDetail.howToBecome.map((step: string, idx: number) => (
                  <View key={idx} style={styles.roadmapStep}>
                    <View style={[styles.roadmapStepNumber, { backgroundColor: colors.primary }]}>
                      <Text style={styles.roadmapStepNumberText}>{idx + 1}</Text>
                    </View>
                    <View style={styles.roadmapStepContent}>
                      <Text style={[styles.bullet, { color: colors.textMain, fontWeight: '700' }]}>{step}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.roadmapStep}>
                  <View style={[styles.roadmapStepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={styles.roadmapStepNumberText}>1</Text>
                  </View>
                  <View style={styles.roadmapStepContent}>
                    <Text style={[styles.bullet, { color: colors.textMain, fontWeight: '700' }]}>
                      {sectorDetail.howToBecome}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {sectorDetail.jobs && sectorDetail.jobs.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>💼 POPULAR CAREERS</Text>
              {sectorDetail.jobs.map((j: any, idx: number) => (
                <Text key={idx} style={[styles.bullet, { color: colors.textMain }]}>• {j}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Render sectors within stream
  if (selectedStream) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={handlePageBack}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]} numberOfLines={1}>{selectedStream.label}</Text>
        </View>

        {loadingSectors ? (
          <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />
        ) : (
          <FlatList
            data={sectors}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listPadding}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
                onPress={() => handleSectorClick(item)}
              >
                <Text style={styles.listIcon}>🏛️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.listTitle, { color: colors.textMain }]}>{item.label}</Text>
                  {item.description && <Text style={{ color: colors.textMuted, fontSize: 11 }} numberOfLines={1}>{item.description}</Text>}
                </View>
                <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  // Render job details view
  if (selectedJob) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={handlePageBack}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]} numberOfLines={1}>{selectedJob.title}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>💼 VACANCY CLASSIFICATION</Text>
            <Text style={[styles.title, { color: colors.textMain, fontSize: 20 }]}>{selectedJob.title}</Text>
            <Text style={[styles.desc, { color: colors.textSub }]}>{selectedJob.description || 'Vacancies and eligibility criteria after 12th.'}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>💰 SCALE & GROWTH</Text>
            <Text style={{ color: colors.textMain, fontWeight: '800', fontSize: 16 }}>💰 {selectedJob.salary || 'Competitive base scale'}</Text>
            <Text style={{ color: colors.textSub, marginTop: Spacing.one }}>Growth scale: {selectedJob.growth || 'High recruitment scale.'}</Text>
          </View>

          {/* Job Skills */}
          {((selectedJob.skills && selectedJob.skills.length > 0) || (selectedJob.skillsRequired && selectedJob.skillsRequired.length > 0)) && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🛠️ KEY SKILLS NEEDED</Text>
              <View style={styles.skillsContainer}>
                {(selectedJob.skills || selectedJob.skillsRequired).map((s: string, idx: number) => (
                  <View key={idx} style={[styles.skillPill, { backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: colors.borderColor }]}>
                    <Text style={[styles.skillText, { color: colors.primary }]}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Job Roadmap */}
          {selectedJob.howToBecome && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🗺️ CAREER ROADMAP</Text>
              {Array.isArray(selectedJob.howToBecome) ? (
                selectedJob.howToBecome.map((step: string, idx: number) => (
                  <View key={idx} style={styles.roadmapStep}>
                    <View style={[styles.roadmapStepNumber, { backgroundColor: colors.primary }]}>
                      <Text style={styles.roadmapStepNumberText}>{idx + 1}</Text>
                    </View>
                    <View style={styles.roadmapStepContent}>
                      <Text style={[styles.bullet, { color: colors.textMain, fontWeight: '700' }]}>{step}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.roadmapStep}>
                  <View style={[styles.roadmapStepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={styles.roadmapStepNumberText}>1</Text>
                  </View>
                  <View style={styles.roadmapStepContent}>
                    <Text style={[styles.bullet, { color: colors.textMain, fontWeight: '700' }]}>
                      {selectedJob.howToBecome}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Job Workplaces */}
          {selectedJob.workplaces && selectedJob.workplaces.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🏢 COMMON WORKPLACES</Text>
              {selectedJob.workplaces.map((wp: string, idx: number) => (
                <Text key={idx} style={[styles.bullet, { color: colors.textMain }]}>• {wp}</Text>
              ))}
            </View>
          )}

          {selectedJob.exams && selectedJob.exams.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>📝 ELIGIBILITY EXAMS / TESTS</Text>
              {selectedJob.exams.map((ex: any, idx: number) => (
                <Text key={idx} style={[styles.bullet, { color: colors.textMain }]}>• {ex}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={onBack}>
          <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>After 12th Pathways</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'streams' && { borderBottomColor: colors.primary }]}
          onPress={() => setTab('streams')}
        >
          <Text style={[styles.tabLabel, { color: tab === 'streams' ? colors.primary : colors.textMuted }]}>Academic Streams</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'jobs' && { borderBottomColor: colors.primary }]}
          onPress={() => setTab('jobs')}
        >
          <Text style={[styles.tabLabel, { color: tab === 'jobs' ? colors.primary : colors.textMuted }]}>Direct Jobs</Text>
        </TouchableOpacity>
      </View>

      {tab === 'streams' ? (
        <FlatList
          data={streams}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
              onPress={() => handleStreamClick(item)}
            >
              <Text style={styles.listIcon}>📚</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.listTitle, { color: colors.textMain }]}>{item.label}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>Explore courses and prospects</Text>
              </View>
              <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id || item.title}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
              onPress={() => setSelectedJob(item)}
            >
              <Text style={styles.listIcon}>💼</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.listTitle, { color: colors.textMain }]}>{item.title}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.salary || 'Immediate career vacant'}</Text>
              </View>
              <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
  tabBar: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  listPadding: {
    padding: Spacing.three,
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
  desc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  infoKey: {
    width: 90,
    fontWeight: '700',
  },
  bullet: {
    fontSize: 13,
    marginVertical: 3,
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
  },
  roadmapStepContent: {
    flex: 1,
  },
});
