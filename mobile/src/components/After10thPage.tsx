import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, useColorScheme, FlatList } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL } from '../config';

interface After10thPageProps {
  onBack: () => void;
  t: (key: string) => string;
  initialTarget?: any;
  clearTarget?: () => void;
  savedCareers?: any[];
  onToggleSave?: (career: any) => void;
  colors: any;
}

export default function After10thPage({
  onBack,
  t,
  initialTarget,
  clearTarget,
  savedCareers = [],
  onToggleSave,
  colors
}: After10thPageProps) {
  const [tab, setTab] = useState<'streams' | 'jobs'>('streams');
  const [categories, setCategories] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseDetail, setCourseDetail] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/after10th/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
    fetch(`${API_URL}/after10th/jobs`)
      .then(r => r.json())
      .then(setJobs)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialTarget && initialTarget.type === 'after10th') {
      if (initialTarget.tab) {
        setTab(initialTarget.tab);
      }
      if (initialTarget.categoryId && !initialTarget.courseId) {
        fetch(`${API_URL}/after10th/categories`)
          .then(r => r.json())
          .then(cats => {
            const cat = cats.find((c: any) => c.id === initialTarget.categoryId);
            if (cat) handleCategoryClick(cat);
          });
      } else if (initialTarget.categoryId === 'intermediate' && initialTarget.courseId) {
        fetch(`${API_URL}/after10th/categories`)
          .then(r => r.json())
          .then(cats => {
            const cat = cats.find((c: any) => c.id === 'intermediate');
            if (cat) {
              setSelectedCategory(cat);
              setLoadingCourses(true);
              fetch(`${API_URL}/after10th/categories/intermediate/courses`)
                .then(r => r.json())
                .then(coursesList => {
                  setCourses(coursesList);
                  const course = coursesList.find((c: any) => c.id === initialTarget.courseId);
                  if (course) {
                    setSelectedCourse(course);
                    setLoadingDetails(true);
                    fetch(`${API_URL}/after10th/courses/${course.id}`)
                      .then(r => r.json())
                      .then(detail => {
                        setCourseDetail(detail);
                        setLoadingDetails(false);
                      })
                      .catch(() => setLoadingDetails(false));
                  }
                  setLoadingCourses(false);
                })
                .catch(() => setLoadingCourses(false));
            }
          });
      } else if (initialTarget.tab === 'jobs' && initialTarget.jobId) {
        fetch(`${API_URL}/after10th/jobs`)
          .then(r => r.json())
          .then(jobsList => {
            const job = jobsList.find((j: any) => j.id === initialTarget.jobId);
            if (job) setSelectedJob(job);
          });
      }
      if (clearTarget) clearTarget();
    }
  }, [initialTarget]);

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
    setLoadingCourses(true);
    fetch(`${API_URL}/after10th/categories/${category.id}/courses`)
      .then(r => r.json())
      .then(data => {
        setCourses(data);
        setLoadingCourses(false);
      })
      .catch(() => setLoadingCourses(false));
  };

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setLoadingDetails(true);
    fetch(`${API_URL}/after10th/courses/${course.id}`)
      .then(r => r.json())
      .then(data => {
        setCourseDetail(data);
        setLoadingDetails(false);
      })
      .catch(() => setLoadingDetails(false));
  };

  // Nav back handler within page
  const handlePageBack = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
      setCourseDetail(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setCourses([]);
    } else if (selectedJob) {
      setSelectedJob(null);
    } else {
      onBack();
    }
  };

  // Renders course details view
  if (selectedCourse && courseDetail) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={handlePageBack}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]} numberOfLines={1}>{selectedCourse.label}</Text>
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: colors.borderColor }]}
            onPress={() => onToggleSave && onToggleSave({
              id: selectedCourse.id,
              title: selectedCourse.label,
              icon: '🏫',
              type: 'After 10th Course',
              payload: { type: 'after10th', categoryId: selectedCategory?.id, courseId: selectedCourse.id }
            })}
          >
            <Text style={{ color: savedCareers.some(item => item.careerId === selectedCourse.id) ? colors.primary : colors.textMain, fontWeight: '800' }}>
              {savedCareers.some(item => item.careerId === selectedCourse.id) ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>ℹ️ COURSE OVERVIEW</Text>
            <Text style={[styles.title, { color: colors.textMain, fontSize: 20 }]}>{courseDetail.name || courseDetail.label}</Text>
            <Text style={[styles.desc, { color: colors.textSub }]}>{courseDetail.description || 'No description available.'}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>⏱️ ACCREDITATION DETAILS</Text>
            <View style={styles.infoRow}><Text style={[styles.infoKey, { color: colors.textMuted }]}>Duration:</Text><Text style={{ color: colors.textMain }}>{courseDetail.duration || 'N/A'}</Text></View>
            <View style={styles.infoRow}><Text style={[styles.infoKey, { color: colors.textMuted }]}>Eligibility:</Text><Text style={{ color: colors.textMain }}>{courseDetail.eligibility || '10th Class'}</Text></View>
            <View style={styles.infoRow}><Text style={[styles.infoKey, { color: colors.textMuted }]}>Fees Range:</Text><Text style={{ color: colors.textMain }}>{courseDetail.fees || 'N/A'}</Text></View>
          </View>

          {courseDetail.exams && courseDetail.exams.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>📝 ENTRANCE EXAMS</Text>
              {courseDetail.exams.map((ex: any, idx: number) => (
                <Text key={idx} style={[styles.bullet, { color: colors.textMain }]}>• {ex}</Text>
              ))}
            </View>
          )}

          {/* Course Skills */}
          {((courseDetail.skillsRequired && courseDetail.skillsRequired.length > 0) || (courseDetail.skills && courseDetail.skills.length > 0)) && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🛠️ KEY SKILLS YOU WILL ACQUIRE</Text>
              <View style={styles.skillsContainer}>
                {(courseDetail.skillsRequired || courseDetail.skills).map((s: string, idx: number) => (
                  <View key={idx} style={[styles.skillPill, { backgroundColor: 'rgba(99, 102, 241, 0.1)', borderColor: colors.borderColor }]}>
                    <Text style={[styles.skillText, { color: colors.primary }]}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Course Roadmap */}
          {courseDetail.howToBecome && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>🗺️ STUDY & CAREER ROADMAP</Text>
              {Array.isArray(courseDetail.howToBecome) ? (
                courseDetail.howToBecome.map((step: string, idx: number) => (
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
                      {courseDetail.howToBecome}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {courseDetail.jobs && courseDetail.jobs.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.label, { color: colors.primary }]}>💼 POPULAR CAREER ROLES</Text>
              {courseDetail.jobs.map((jb: any, idx: number) => (
                <Text key={idx} style={[styles.bullet, { color: colors.textMain }]}>• {jb}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Renders course list within a category
  if (selectedCategory) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={handlePageBack}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]} numberOfLines={1}>{selectedCategory.label}</Text>
        </View>

        {loadingCourses ? (
          <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />
        ) : (
          <FlatList
            data={courses}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listPadding}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
                onPress={() => handleCourseClick(item)}
              >
                <Text style={styles.listIcon}>📘</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.listTitle, { color: colors.textMain }]}>{item.label}</Text>
                  {item.duration && <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.duration}</Text>}
                </View>
                <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  // Renders single job details view
  if (selectedJob) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
          <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={handlePageBack}>
            <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textMain }]} numberOfLines={1}>{selectedJob.title}</Text>
          <TouchableOpacity
            style={[styles.backBtn, { borderColor: colors.borderColor }]}
            onPress={() => onToggleSave && onToggleSave({
              id: selectedJob.id,
              title: selectedJob.title,
              icon: '💼',
              type: 'After 10th Job',
              payload: { type: 'after10th', tab: 'jobs', jobId: selectedJob.id }
            })}
          >
            <Text style={{ color: savedCareers.some(item => item.careerId === selectedJob.id) ? colors.primary : colors.textMain, fontWeight: '800' }}>
              {savedCareers.some(item => item.careerId === selectedJob.id) ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>💼 DIRECT JOB ROLE</Text>
            <Text style={[styles.title, { color: colors.textMain, fontSize: 20 }]}>{selectedJob.title}</Text>
            <Text style={[styles.desc, { color: colors.textSub }]}>{selectedJob.description || 'Information on direct recruitment after 10th.'}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
            <Text style={[styles.label, { color: colors.primary }]}>💰 SALARY & PROSPECTS</Text>
            <Text style={{ color: colors.textMain, fontWeight: '800', fontSize: 16 }}>💰 {selectedJob.salary || 'Competitive base scale'}</Text>
            <Text style={{ color: colors.textSub, marginTop: Spacing.one }}>Growth potential: {selectedJob.growth || 'Steady recruitment demand.'}</Text>
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

  // Main Categories & Jobs listing
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={onBack}>
          <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>After 10th Pathways</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'streams' && { borderBottomColor: colors.primary }]}
          onPress={() => setTab('streams')}
        >
          <Text style={[styles.tabLabel, { color: tab === 'streams' ? colors.primary : colors.textMuted }]}>Courses / Streams</Text>
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
          data={categories}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listPadding}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
              onPress={() => handleCategoryClick(item)}
            >
              <Text style={styles.listIcon}>📚</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.listTitle, { color: colors.textMain }]}>{item.label}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.description || 'Explore subject pathways'}</Text>
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
                <Text style={{ color: colors.textMuted, fontSize: 11 }}>{item.salary || 'Direct vacancy'}</Text>
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
