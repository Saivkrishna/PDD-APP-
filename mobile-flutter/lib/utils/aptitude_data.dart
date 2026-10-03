import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class AptitudeTopicInfo {
  final String id;
  final String title;
  final String icon;
  final List<AptitudeItem> items;
  final List<List<Map<String, String>>>? columns;

  const AptitudeTopicInfo({
    required this.id,
    required this.title,
    required this.icon,
    required this.items,
    this.columns,
  });

  factory AptitudeTopicInfo.fromJson(String id, Map<String, dynamic> json) {
    final title = json['title']?.toString() ?? id;
    final icon = json['icon']?.toString() ?? '📝';
    final rawItems = json['items'] as List? ?? [];
    final items = rawItems.map((item) => AptitudeItem.fromJson(item as Map<String, dynamic>)).toList();

    List<List<Map<String, String>>>? columns;
    if (json['columns'] is List) {
      final rawCols = json['columns'] as List;
      columns = rawCols.map((col) {
        if (col is List) {
          return col.map((row) {
            if (row is Map) {
              return {
                'fraction': row['fraction']?.toString() ?? '',
                'percentage': row['percentage']?.toString() ?? '',
              };
            }
            return <String, String>{};
          }).toList();
        }
        return <Map<String, String>>[];
      }).toList();
    }

    return AptitudeTopicInfo(
      id: id,
      title: title,
      icon: icon,
      items: items,
      columns: columns,
    );
  }
}

class AptitudeItem {
  final String id;
  final String name;
  final String formula;
  final String? note;
  final AptitudeExample? example;

  const AptitudeItem({
    required this.id,
    required this.name,
    required this.formula,
    this.note,
    this.example,
  });

  factory AptitudeItem.fromJson(Map<String, dynamic> json) {
    AptitudeExample? example;
    if (json['example'] is Map) {
      example = AptitudeExample.fromJson(Map<String, dynamic>.from(json['example']));
    }

    return AptitudeItem(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      formula: json['formula']?.toString() ?? '',
      note: json['note']?.toString(),
      example: example,
    );
  }
}

class AptitudeExample {
  final String question;
  final List<String> steps;
  final String answer;

  const AptitudeExample({
    required this.question,
    required this.steps,
    required this.answer,
  });

  factory AptitudeExample.fromJson(Map<String, dynamic> json) {
    final stepsRaw = json['steps'] as List? ?? [];
    return AptitudeExample(
      question: (json['question'] ?? json['q'] ?? '').toString(),
      steps: stepsRaw.map((s) => s.toString()).toList(),
      answer: (json['answer'] ?? json['ans'] ?? '').toString(),
    );
  }
}

class AptitudeDataRepository {
  static const List<Map<String, String>> allTopics = [
    {'id': 'lcm-hcf', 'title': 'LCM & HCF', 'icon': '🔢'},
    {'id': 'divisibility-remainder', 'title': 'Divisibility & Remainder', 'icon': '➗'},
    {'id': 'problems-ages', 'title': 'Problems on Ages', 'icon': '👴'},
    {'id': 'probability', 'title': 'Probability', 'icon': '🎲'},
    {'id': 'equation', 'title': 'Equation', 'icon': '🟰'},
    {'id': 'series-progression', 'title': 'Series & Progression', 'icon': '📈'},
    {'id': 'mensuration', 'title': 'Mensuration', 'icon': '📐'},
    {'id': 'geometry-perimeter', 'title': 'Geometry & Perimeter', 'icon': '🟦'},
    {'id': 'percentages', 'title': 'Percentage', 'icon': '📊'},
    {'id': 'profit-loss', 'title': 'Profit & Loss', 'icon': '💰'},
    {'id': 'time-work', 'title': 'Time & Work', 'icon': '⏱️'},
    {'id': 'clocks-calendar', 'title': 'Clocks & Calendar', 'icon': '📅'},
    {'id': 'ratio-proportion', 'title': 'Ratio & Proportion', 'icon': '⚖️'},
    {'id': 'mixture-alligation', 'title': 'Mixture & Alligation', 'icon': '🧪'},
    {'id': 'time-speed-distance', 'title': 'Time, Speed & Distance', 'icon': '🚗'},
    {'id': 'permutation-combination', 'title': 'Permutation & Combination', 'icon': '🔀'},
    {'id': 'mean-median-mode', 'title': 'Mean, Median & Mode', 'icon': '📊'},
    {'id': 'data-interpretation', 'title': 'Data Interpretation', 'icon': '📉'},
    {'id': 'pie-chart', 'title': 'Pie Chart', 'icon': '⚪'},
    {'id': 'graphical-chart', 'title': 'Graphical Chart', 'icon': '📊'},
    {'id': 'simple-arithmetic', 'title': 'Simple Arithmetic', 'icon': '➕'},
    {'id': 'averages', 'title': 'Average', 'icon': '📊'},
  ];

  static Map<String, AptitudeTopicInfo>? _cachedCheatsheets;
  static List<Map<String, dynamic>>? _cachedQuestions;
  static Map<String, Map<String, int>>? _cachedCounts;
  static bool _isInitialized = false;

  /// Initialize and load all local assets
  static Future<void> initialize() async {
    if (_isInitialized) return;
    try {
      final cheatsheetsStr = await rootBundle.loadString('assets/data/aptitude_cheatsheets.json');
      final Map<String, dynamic> cheatsheetsMap = json.decode(cheatsheetsStr);
      _cachedCheatsheets = {};
      cheatsheetsMap.forEach((key, value) {
        if (value is Map<String, dynamic>) {
          _cachedCheatsheets![key] = AptitudeTopicInfo.fromJson(key, value);
        }
      });

      final questionsStr = await rootBundle.loadString('assets/data/aptitude_questions.json');
      final List<dynamic> questionsList = json.decode(questionsStr);
      _cachedQuestions = questionsList.map((q) => Map<String, dynamic>.from(q as Map)).toList();

      _computeCounts();
      _isInitialized = true;
    } catch (e) {
      // If asset loading fails (e.g. before Flutter binding ready in a test), fallback safely
      _cachedCheatsheets = {};
      _cachedQuestions = [];
      _cachedCounts = {};
    }
  }

  static void _computeCounts() {
    _cachedCounts = {};
    if (_cachedQuestions == null) return;

    for (final t in allTopics) {
      final id = t['id']!;
      _cachedCounts![id] = {'easy': 0, 'medium': 0, 'hard': 0, 'total': 0};
    }

    for (final q in _cachedQuestions!) {
      String topic = (q['topic'] ?? '').toString();
      if (topic == 'percentage') topic = 'percentages';
      final diff = (q['difficulty'] ?? '').toString().toLowerCase();

      if (!_cachedCounts!.containsKey(topic)) {
        _cachedCounts![topic] = {'easy': 0, 'medium': 0, 'hard': 0, 'total': 0};
      }

      if (diff == 'easy' || diff == 'medium' || diff == 'hard') {
        _cachedCounts![topic]![diff] = (_cachedCounts![topic]![diff] ?? 0) + 1;
      }
      _cachedCounts![topic]!['total'] = (_cachedCounts![topic]!['total'] ?? 0) + 1;
    }
  }

  /// Get counts for all topics
  static Map<String, Map<String, int>> getAllCounts() {
    if (_cachedCounts == null || _cachedCounts!.isEmpty) {
      _computeCounts();
    }
    return _cachedCounts ?? {};
  }

  /// Get question count for a specific topic and difficulty
  static int getQuestionCount(String topicId, String difficulty) {
    final normTopic = topicId == 'percentage' ? 'percentages' : topicId;
    final counts = getAllCounts();
    final topicCounts = counts[normTopic] ?? counts[topicId];
    if (topicCounts != null) {
      if (difficulty == 'all' || difficulty == 'total') {
        return topicCounts['total'] ?? 0;
      }
      return topicCounts[difficulty] ?? 0;
    }
    return 0;
  }

  /// Get questions for a topic and difficulty
  static List<Map<String, dynamic>> getQuestions(String topicId, String difficulty) {
    if (_cachedQuestions == null || _cachedQuestions!.isEmpty) {
      return [];
    }
    final normTopic = topicId == 'percentage' ? 'percentages' : topicId;
    return _cachedQuestions!.where((q) {
      final qTopic = q['topic'] == 'percentage' ? 'percentages' : q['topic'];
      final matchesTopic = (qTopic == normTopic || qTopic == topicId);
      final matchesDiff = (difficulty == 'all' || q['difficulty'] == difficulty);
      return matchesTopic && matchesDiff;
    }).toList();
  }

  /// Get all questions
  static List<Map<String, dynamic>> getAllQuestions() {
    return _cachedQuestions ?? [];
  }

  /// Get cheatsheet for a topic
  static AptitudeTopicInfo? getTopicInfo(String topicId) {
    final normTopic = topicId == 'percentage' ? 'percentages' : topicId;
    return _cachedCheatsheets?[normTopic] ?? _cachedCheatsheets?[topicId];
  }

  /// Get all topic cheatsheets
  static Map<String, AptitudeTopicInfo> getAllCheatsheets() {
    return _cachedCheatsheets ?? {};
  }

  /// 4 Columns of Square Numbers (1 to 100)
  static List<List<Map<String, int>>> getSquaresData() {
    final List<List<Map<String, int>>> cols = [[], [], [], []];
    for (int i = 1; i <= 25; i++) {
      cols[0].add({'num': i, 'val': i * i});
      cols[1].add({'num': i + 25, 'val': (i + 25) * (i + 25)});
      cols[2].add({'num': i + 50, 'val': (i + 50) * (i + 50)});
      cols[3].add({'num': i + 75, 'val': (i + 75) * (i + 75)});
    }
    return cols;
  }

  /// Clean HTML markup to plain text or formatted text
  static String cleanHtml(String html) {
    return html
        .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'</p>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'<[^>]*>'), '')
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&bull;', '•')
        .replaceAll('&times;', '×')
        .replaceAll('&divide;', '÷')
        .replaceAll('&le;', '≤')
        .replaceAll('&ge;', '≥')
        .replaceAll('&ne;', '≠')
        .replaceAll('&plusmn;', '±')
        .replaceAll('&sup2;', '²')
        .replaceAll('&sup3;', '³')
        .replaceAll('&#8377;', '₹');
  }
}
