import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class ReasoningTopicInfo {
  final String id;
  final String name;
  final String icon;
  final int totalQs;

  const ReasoningTopicInfo({
    required this.id,
    required this.name,
    required this.icon,
    required this.totalQs,
  });
}

class ReasoningQuestion {
  final dynamic id;
  final String topic;
  final String difficulty;
  final String category;
  final String q;
  final List<String> options;
  final String answer;
  final String explanation;
  final String shortcut;
  final String company;

  const ReasoningQuestion({
    required this.id,
    required this.topic,
    required this.difficulty,
    required this.category,
    required this.q,
    required this.options,
    required this.answer,
    required this.explanation,
    required this.shortcut,
    required this.company,
  });

  factory ReasoningQuestion.fromJson(Map<String, dynamic> json) {
    final rawOptions = json['options'] as List? ?? [];
    return ReasoningQuestion(
      id: json['id'],
      topic: json['topic']?.toString() ?? '',
      difficulty: json['difficulty']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      q: (json['q'] ?? json['question'] ?? '').toString(),
      options: rawOptions.map((o) => o.toString()).toList(),
      answer: json['answer']?.toString() ?? '',
      explanation: json['explanation']?.toString() ?? '',
      shortcut: json['shortcut']?.toString() ?? '',
      company: json['company']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'topic': topic,
      'difficulty': difficulty,
      'category': category,
      'q': q,
      'question': q,
      'options': options,
      'answer': answer,
      'explanation': explanation,
      'shortcut': shortcut,
      'company': company,
    };
  }
}

class ReasoningDataRepository {
  static const List<ReasoningTopicInfo> allTopics = [
    ReasoningTopicInfo(id: 'series', name: 'Series', icon: '📈', totalQs: 15),
    ReasoningTopicInfo(id: 'coding-decoding', name: 'Coding-Decoding', icon: '🔐', totalQs: 15),
    ReasoningTopicInfo(id: 'syllogism', name: 'Syllogism', icon: '🧠', totalQs: 15),
    ReasoningTopicInfo(id: 'blood-relations', name: 'Blood Relations', icon: '👪', totalQs: 20),
    ReasoningTopicInfo(id: 'directions', name: 'Directions', icon: '🧭', totalQs: 15),
    ReasoningTopicInfo(id: 'puzzles', name: 'Puzzles', icon: '🧩', totalQs: 15),
    ReasoningTopicInfo(id: 'logical-sequence', name: 'Logical Sequence', icon: '⛓️', totalQs: 30),
    ReasoningTopicInfo(id: 'verbal-reasoning', name: 'Verbal Reasoning', icon: '🗣️', totalQs: 30),
    ReasoningTopicInfo(id: 'non-verbal-reasoning', name: 'NON-VERBAL REASONING', icon: '📐', totalQs: 30),
    ReasoningTopicInfo(id: 'data-interpretation', name: 'Data Interpretation', icon: '📊', totalQs: 15),
  ];

  static List<ReasoningQuestion>? _cachedQuestions;
  static bool _isInitialized = false;

  /// Initialize and load local Reasoning assets
  static Future<void> initialize() async {
    if (_isInitialized && _cachedQuestions != null && _cachedQuestions!.isNotEmpty) return;
    try {
      final jsonStr = await rootBundle.loadString('assets/data/reasoning_questions.json');
      final List<dynamic> list = json.decode(jsonStr);
      _cachedQuestions = list.map((item) => ReasoningQuestion.fromJson(item as Map<String, dynamic>)).toList();
      _isInitialized = true;
    } catch (_) {
      _cachedQuestions = [];
    }
  }

  /// Get all 200 questions
  static List<ReasoningQuestion> getAllQuestions() {
    return _cachedQuestions ?? [];
  }

  /// Get all questions as raw Maps
  static List<Map<String, dynamic>> getAllQuestionsRaw() {
    return (_cachedQuestions ?? []).map((q) => q.toJson()).toList();
  }

  /// Get questions by topic and optional difficulty filter
  static List<Map<String, dynamic>> getQuestions({String? topic, String? difficulty, bool? testMode}) {
    final list = _cachedQuestions ?? [];
    if (list.isEmpty) return [];

    if (testMode == true) {
      final shuffled = List<ReasoningQuestion>.from(list)..shuffle();
      return shuffled.take(30).map((q) => q.toJson()).toList();
    }

    Iterable<ReasoningQuestion> filtered = list;
    if (topic != null && topic.isNotEmpty && topic != 'all') {
      filtered = filtered.where((q) => q.topic.toLowerCase() == topic.toLowerCase());
    }
    if (difficulty != null && difficulty.isNotEmpty && difficulty != 'all') {
      filtered = filtered.where((q) => q.difficulty.toLowerCase() == difficulty.toLowerCase());
    }

    return filtered.map((q) => q.toJson()).toList();
  }

  /// Get topic count breakdown
  static Map<String, int> getTopicCounts() {
    final counts = <String, int>{};
    for (final t in allTopics) {
      counts[t.id] = 0;
    }
    for (final q in _cachedQuestions ?? []) {
      counts[q.topic] = (counts[q.topic] ?? 0) + 1;
    }
    return counts;
  }

  /// Get difficulty count breakdown
  static Map<String, int> getDifficultyCounts() {
    final counts = {'easy': 0, 'medium': 0, 'hard': 0};
    for (final q in _cachedQuestions ?? []) {
      final d = q.difficulty.toLowerCase();
      if (counts.containsKey(d)) {
        counts[d] = counts[d]! + 1;
      }
    }
    return counts;
  }
}
