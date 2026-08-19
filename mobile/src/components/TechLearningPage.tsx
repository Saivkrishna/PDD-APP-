import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, useColorScheme, FlatList, Modal } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Colors, Spacing } from '@/constants/theme';
import { techLearningData, getYoutubeChannels } from '../data/techLearningData';
import { API_URL } from '../config';

interface TechLearningProps {
  onBack: () => void;
  t: (key: string) => string;
}

export default function TechLearningPage({ onBack, t }: TechLearningProps) {
  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];
  
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [techs, setTechs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<any>(null);

  // Fetch technologies from backend API, fallback to local data
  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const res = await fetch(`${API_URL}/technologies`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
            setTechs(sorted);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('API error fetching technologies, using offline fallback:', e);
      }
      // Fallback
      const sortedLocal = [...techLearningData].sort((a, b) => a.name.localeCompare(b.name));
      setTechs(sortedLocal);
      setLoading(false);
    };

    fetchTechs();
  }, []);

  const categories = [
    'All',
    'Languages',
    'Web Development',
    'Mobile',
    'AI & Cloud',
    'DevOps & OS',
    'Databases',
    'Security & Web3',
    'Software Eng & Practice'
  ];

  // Filtering logic
  const filteredTechs = techs.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(search.toLowerCase()) || 
                          tech.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCat === 'All' || tech.category === selectedCat;
    return matchesSearch && matchesCategory;
  });

  const handleOpenLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      console.warn('Failed to open link:', e);
    }
  };

  const renderTechCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.techCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
      onPress={() => setSelectedTech(item)}
    >
      <Text style={styles.techIcon}>{item.icon || '💻'}</Text>
      <View style={styles.techCardInfo}>
        <Text style={[styles.techName, { color: colors.textMain }]}>{item.name}</Text>
        <Text style={[styles.techCategory, { color: colors.primary }]}>{item.category}</Text>
        <Text style={[styles.techDesc, { color: colors.textSub }]} numberOfLines={2}>{item.description}</Text>
      </View>
      <Text style={[styles.arrow, { color: colors.textMuted }]}>➔</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header Actions */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={[styles.backText, { color: colors.textMain }]}>‹ {t('back') || 'Back'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>{t('techLearning') || 'Learning Hub'}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.cardBg, color: colors.textMain, borderColor: colors.borderColor }]}
          placeholder={t('searchPlaceholder') || 'Search technologies, frameworks...'}
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Horizontal Scroll Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryTab,
                { borderColor: colors.borderColor },
                selectedCat === cat && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setSelectedCat(cat)}
            >
              <Text style={[
                styles.categoryText,
                { color: selectedCat === cat ? '#FFF' : colors.textSub }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results List */}
      <FlatList
        data={filteredTechs}
        keyExtractor={item => item.id}
        renderItem={renderTechCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>🔍</Text>
            <Text style={[styles.emptyText, { color: colors.textSub }]}>No technologies found matching criteria.</Text>
          </View>
        }
      />

      {/* Technology Details Dialog */}
      {selectedTech && (
        <Modal
          visible={!!selectedTech}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedTech(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalIcon}>{selectedTech.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.modalTitle, { color: colors.textMain }]}>{selectedTech.name}</Text>
                  <Text style={[styles.modalCategory, { color: colors.primary }]}>{selectedTech.category}</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedTech(null)}>
                  <Text style={[styles.closeText, { color: colors.textMain }]}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Description</Text>
                <Text style={[styles.modalDesc, { color: colors.textSub }]}>{selectedTech.description}</Text>

                {selectedTech.url && (
                  <View style={{ marginTop: Spacing.three }}>
                    <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Official Documentation</Text>
                    <TouchableOpacity 
                      style={[styles.linkButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleOpenLink(selectedTech.url)}
                    >
                      <Text style={styles.linkButtonText}>📚 Open Official Documentation</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* YouTube recommendations mapping */}
                <View style={{ marginTop: Spacing.three, marginBottom: Spacing.four }}>
                  <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Recommended Video Courses</Text>
                  
                  {(() => {
                    const channels = getYoutubeChannels(selectedTech.id);
                    if (!channels) {
                      return <Text style={{ color: colors.textMuted, fontSize: 12 }}>No video recommendations available.</Text>;
                    }
                    return (
                      <View style={{ gap: Spacing.two, marginTop: Spacing.one }}>
                        {channels.en && (
                          <TouchableOpacity 
                            style={[styles.videoBtn, { borderColor: colors.borderColor }]}
                            onPress={() => handleOpenLink(channels.en.url)}
                          >
                            <Text style={[styles.videoBtnLabel, { color: colors.textMain }]}>🇬🇧 English Course: {channels.en.name}</Text>
                          </TouchableOpacity>
                        )}
                        {channels.te && (
                          <TouchableOpacity 
                            style={[styles.videoBtn, { borderColor: colors.borderColor }]}
                            onPress={() => handleOpenLink(channels.te.url)}
                          >
                            <Text style={[styles.videoBtnLabel, { color: colors.textMain }]}>🇮🇳 Telugu Course: {channels.te.name}</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })()}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  backBtn: {
    width: 60,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'Outfit',
  },
  searchSection: {
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  searchInput: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: Spacing.four,
    fontSize: 14,
  },
  categoriesContainer: {
    marginBottom: Spacing.two,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  categoryTab: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: 100,
    gap: Spacing.two,
  },
  techCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  techIcon: {
    fontSize: 32,
  },
  techCardInfo: {
    flex: 1,
    gap: 2,
  },
  techName: {
    fontSize: 16,
    fontWeight: '900',
  },
  techCategory: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  techDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  arrow: {
    fontSize: 18,
    paddingLeft: Spacing.one,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalIcon: {
    fontSize: 44,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  modalCategory: {
    fontSize: 12,
    fontWeight: '800',
  },
  closeBtn: {
    padding: Spacing.two,
  },
  closeText: {
    fontSize: 18,
  },
  modalBody: {
    marginTop: Spacing.three,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: Spacing.one,
  },
  modalDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  linkButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  linkButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  videoBtn: {
    borderWidth: 1,
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  videoBtnLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
});
