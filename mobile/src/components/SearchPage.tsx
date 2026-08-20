import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { API_URL } from '../config';

interface SearchProps {
  onBack: () => void;
  t: (key: string) => string;
  onSelectResult: (payload: any) => void;
  colors: any;
}

export default function SearchPage({ onBack, t, onSelectResult, colors }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const suggestions = ['Software Engineer', 'Data Scientist', 'MBBS', 'CSE', 'Mechanical', 'AI Engineer', 'Law', 'Electrician'];

  const doSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data || []);
    } catch (e) {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={onBack}>
          <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>{t('search') || 'Search'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Input Box */}
        <View style={[styles.searchBox, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.input, { color: colors.textMain }]}
            placeholder="Search careers, jobs, courses..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={doSearch}
            autoFocus
          />
        </View>

        {!query && (
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.textMain }]}>💡 Try Searching For</Text>
            <View style={styles.tagGrid}>
              {suggestions.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.tag, { backgroundColor: 'rgba(99, 102, 241, 0.08)', borderColor: colors.borderColor }]}
                  onPress={() => doSearch(s)}
                >
                  <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: Spacing.four }} />}

        {results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '800', marginBottom: Spacing.two }}>
              {results.length} results found
            </Text>
            {results.map((r, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.listItem, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
                onPress={() => onSelectResult(r.payload)}
              >
                <Text style={styles.listIcon}>{r.icon || '💼'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.listTitle, { color: colors.textMain }]}>{r.title}</Text>
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.badgeText}>{r.type}</Text>
                    </View>
                  </View>
                </View>
                <Text style={{ color: colors.primary, fontSize: 16 }}>➔</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {query && !loading && results.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48 }}>🔎</Text>
            <Text style={{ color: colors.primary, marginTop: 12, fontSize: 15, fontWeight: '700' }}>
              No results found for "{query}"
            </Text>
            <Text style={{ color: colors.textSub, marginTop: 6, fontSize: 13 }}>Try a different keyword</Text>
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
  scrollContent: {
    padding: Spacing.three,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  suggestionsContainer: {
    marginTop: Spacing.two,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
  },
  resultsContainer: {
    marginTop: Spacing.two,
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
  badgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
});
