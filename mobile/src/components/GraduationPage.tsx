import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme, FlatList } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL } from '../config';

interface GraduationPageProps {
  onBack: () => void;
  t: (key: string) => string;
  initialTarget?: any;
  clearTarget?: () => void;
  savedCareers?: any[];
  onToggleSave?: (career: any) => void;
}

type TabType = 'sectors' | 'higherStudy' | 'studyAbroad' | 'jobs';

export default function GraduationPage({
  onBack,
  t,
  initialTarget,
  clearTarget,
  savedCareers = [],
  onToggleSave
}: GraduationPageProps) {
  const [tab, setTab] = useState<TabType>('sectors');
  
  const [sectors, setSectors] = useState<any[]>([]);
  const [higherStudy, setHigherStudy] = useState<any[]>([]);
  const [studyAbroad, setStudyAbroad] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedSector, setSelectedSector] = useState<any>(null);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [deptDetail, setDeptDetail] = useState<any>(null);
  const [loadingDeptDetails, setLoadingDeptDetails] = useState(false);

  const [selectedItemDetail, setSelectedItemDetail] = useState<any>(null);

  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  useEffect(() => {
    setLoading(true);
    const pSectors = fetch(`${API_URL}/aftergraduation/sectors`).then(r => r.json()).then(setSectors);
    const pHigher = fetch(`${API_URL}/aftergraduation/higherstudy`).then(r => r.json()).then(setHigherStudy);
    const pAbroad = fetch(`${API_URL}/aftergraduation/studyabroad`).then(r => r.json()).then(setStudyAbroad);
    const pJobs = fetch(`${API_URL}/aftergraduation/jobs`).then(r => r.json()).then(setJobs);
    
    Promise.all([pSectors, pHigher, pAbroad, pJobs])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (initialTarget && initialTarget.type === 'graduation') {
      if (initialTarget.tab) {
        setTab(initialTarget.tab);
      }
      if (initialTarget.tab === 'higherStudy' && initialTarget.masterId) {
        fetch(`${API_URL}/aftergraduation/higherstudy`)
          .then(r => r.json())
          .then(mastersList => {
            const m = mastersList.find((x: any) => x.id === initialTarget.masterId);
            if (m) setSelectedItemDetail(m);
          });
      } else if (initialTarget.tab === 'studyAbroad' && initialTarget.countryId) {
        fetch(`${API_URL}/aftergraduation/studyabroad`)
          .then(r => r.json())
          .then(list => {
            const country = list.find((x: any) => x.id === initialTarget.countryId);
            if (country) setSelectedItemDetail(country);
          });
      } else if (initialTarget.tab === 'jobs' && initialTarget.jobId) {
        fetch(`${API_URL}/aftergraduation/jobs`)
          .then(r => r.json())
          .then(jobsList => {
            const job = jobsList.find((j: any) => j.id === initialTarget.jobId);
            if (job) setSelectedItemDetail(job);
          });
      } else if (initialTarget.tab === 'jobs' && initialTarget.sectorId && initialTarget.deptId) {
        fetch(`${API_URL}/aftergraduation/sectors/${initialTarget.sectorId}`)
          .then(r => r.json())
          .then(sec => {
            if (sec) {
              setSelectedSector(sec);
              const d = sec.departments?.find((x: any) => x.id === initialTarget.deptId);
              if (d) {
                setSelectedDept(d);
                setLoadingDeptDetails(true);
                fetch(`${API_URL}/aftergraduation/sectors/${initialTarget.sectorId}/dept/${d.id}`)
                  .then(res => res.json())
                  .then(data => {
                    setDeptDetail(data);
                    setLoadingDeptDetails(false);
                  })
                  .catch(() => setLoadingDeptDetails(false));
              }
            }
          });
      }
      if (clearTarget) clearTarget();
    }
  }, [initialTarget]);

  const handleSectorClick = (sector: any) => {
    setSelectedSector(sector);
  };

  const handleDeptClick = (dept: any) => {
    setSelectedDept(dept);
    setLoadingDeptDetails(true);
    fetch(`${API_URL}/aftergraduation/departments/${dept.id}`)
      .then(r => r.json())
      .then(data => {
        setDeptDetail(data);
        setLoadingDeptDetails(false);
      })
      .catch(() => setLoadingDeptDetails(false));
  };

  const handlePageBack = () => {
    if (selectedItemDetail) {
      setSelectedItemDetail(null);
    } else if (selectedDept) {
      setSelectedDept(null);
      setDeptDetail(null);
    } else if (selectedSector) {
      setSelectedSector(null);
    } else {
      onBack();
    }
  };

  // Render PG/Study Abroad/Job Item Detail View
  if (selectedItemDetail) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={handlePageBack}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]} numberOfLines={1}>
            {selectedItemDetail.title || selectedItemDetail.degree || selectedItemDetail.country}
          </Text>
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: colors.borderColor }]}
            onPress={() => {
              let payloadObj: any = {};
              let typeLabel = '';
              let itemTitle = selectedItemDetail.title || selectedItemDetail.degree || selectedItemDetail.country;
              
              if (tab === 'higherStudy') {
                typeLabel = 'Graduation PG Program';
                payloadObj = { type: 'graduation', tab: 'higherStudy', masterId: selectedItemDetail.id };
              } else if (tab === 'studyAbroad') {
                typeLabel = 'Study Abroad Option';
                payloadObj = { type: 'graduation', tab: 'studyAbroad', countryId: selectedItemDetail.id };
              } else {
                typeLabel = 'Graduation Job Scale';
                payloadObj = { type: 'graduation', tab: 'jobs', jobId: selectedItemDetail.id };
              }

              if (onToggleSave) {
                onToggleSave({
                  id: selectedItemDetail.id,
                  title: itemTitle,
                  icon: tab === 'studyAbroad' ? '✈️' : '🎓',
                  type: typeLabel,
                  payload: payloadObj
                });
              }
            }}
          >
            <Text style={{ color: savedCareers.some(item => item.careerId === selectedItemDetail.id) ? colors.primary : colors.textMain, fontWeight: '800' }}>
              {savedCareers.some(item => item.careerId === selectedItemDetail.id) ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>ℹ️ DETAILED SCHEME</Text>
            <Text style={[styles.title, { color: colors.textMain, fontSize: 20 }]}>
              {selectedItemDetail.title || selectedItemDetail.degree || selectedItemDetail.country}
            </Text>
            <Text style={[styles.desc, { color: colors.textSub }]}>
              {selectedItemDetail.description || selectedItemDetail.overview || 'Detailed vacancy guidelines.'}
            </Text>
          </View>

          {selectedItemDetail.salary && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>💰 SCALE</Text>
              <Text style={{ color: colors.textMain, fontWeight: '800', fontSize: 16 }}>💰 {selectedItemDetail.salary}</Text>
            </View>
          )}

          {selectedItemDetail.universities && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🏛️ POPULAR UNIVERSITIES</Text>
              {selectedItemDetail.universities.map((u: string, idx: number) => (
                <Text key={idx} style={[styles.bullet, { color: colors.textMain }]}>• {u}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Render Department Details inside Sector
  if (selectedDept && deptDetail) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={handlePageBack}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]} numberOfLines={1}>{selectedDept.label}</Text>
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: colors.borderColor }]}
            onPress={() => onToggleSave && onToggleSave({
              id: selectedDept.id,
              title: selectedDept.label,
              icon: '💼',
              type: 'Graduation Sector',
              payload: { type: 'graduation', tab: 'jobs', sectorId: selectedSector?.id, deptId: selectedDept.id }
            })}
          >
            <Text style={{ color: savedCareers.some(item => item.careerId === selectedDept.id) ? colors.primary : colors.textMain, fontWeight: '800' }}>
              {savedCareers.some(item => item.careerId === selectedDept.id) ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>🏛️ ACADEMIC BRANCH</Text>
            <Text style={[styles.title, { color: colors.textMain, fontSize: 20 }]}>{deptDetail.label}</Text>
            <Text style={[styles.desc, { color: colors.textSub }]}>{deptDetail.description || 'Core courses details.'}</Text>
          </View>

          {deptDetail.jobRoles && deptDetail.jobRoles.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>💼 CAREER OPTIONS</Text>
              {deptDetail.jobRoles.map((r: any, idx: number) => (
                <Text key={idx} style={[styles.bullet, { color: colors.textMain }]}>• {r}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Render departments inside selected sector
  if (selectedSector) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={handlePageBack}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]} numberOfLines={1}>{selectedSector.label}</Text>
        </View>

        <FlatList
          data={selectedSector.departments}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
              onPress={() => handleDeptClick(item)}
            >
              <Text style={styles.listIcon}>🎓</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.listTitle, { color: colors.textMain }]}>{item.label}</Text>
              </View>
              <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={onBack}>
          <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>After Graduation</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabScrollContent}>
        {(['sectors', 'higherStudy', 'studyAbroad', 'jobs'] as TabType[]).map(tKey => {
          const isActive = tab === tKey;
          const label = tKey === 'sectors' ? 'Degrees' : tKey === 'higherStudy' ? 'Higher Study' : tKey === 'studyAbroad' ? 'Study Abroad' : 'Jobs';
          return (
            <TouchableOpacity
              key={tKey}
              style={[styles.scrollTabBtn, isActive && { borderBottomColor: colors.primary }]}
              onPress={() => setTab(tKey)}
            >
              <Text style={[styles.tabLabel, { color: isActive ? colors.primary : colors.textMuted }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />
      ) : (
        <View style={{ flex: 1, paddingBottom: 80 }}>
          {tab === 'sectors' && (
            <FlatList
              data={sectors}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listPadding}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
                  onPress={() => handleSectorClick(item)}
                >
                  <Text style={styles.listIcon}>📚</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.listTitle, { color: colors.textMain }]}>{item.label}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.departments?.length || 0} branches</Text>
                  </View>
                  <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {tab === 'higherStudy' && (
            <FlatList
              data={higherStudy}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listPadding}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
                  onPress={() => setSelectedItemDetail(item)}
                >
                  <Text style={styles.listIcon}>🏛️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.listTitle, { color: colors.textMain }]}>{item.degree}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.duration || 'Postgraduate path'}</Text>
                  </View>
                  <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {tab === 'studyAbroad' && (
            <FlatList
              data={studyAbroad}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listPadding}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
                  onPress={() => setSelectedItemDetail(item)}
                >
                  <Text style={styles.listIcon}>✈️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.listTitle, { color: colors.textMain }]}>{item.country}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.degree || 'Study programs'}</Text>
                  </View>
                  <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {tab === 'jobs' && (
            <FlatList
              data={jobs}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listPadding}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
                  onPress={() => setSelectedItemDetail(item)}
                >
                  <Text style={styles.listIcon}>💼</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.listTitle, { color: colors.textMain }]}>{item.title}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.salary || 'Vacancy scale'}</Text>
                  </View>
                  <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
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
  bullet: {
    fontSize: 13,
    marginVertical: 3,
  },
});
