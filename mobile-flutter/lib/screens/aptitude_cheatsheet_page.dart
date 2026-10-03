import 'dart:math';
import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';
import '../utils/aptitude_data.dart';

class AptitudeCheatsheetPage extends StatefulWidget {
  final bool isModal;

  const AptitudeCheatsheetPage({super.key, this.isModal = false});

  @override
  State<AptitudeCheatsheetPage> createState() => _AptitudeCheatsheetPageState();
}

class _AptitudeCheatsheetPageState extends State<AptitudeCheatsheetPage> {
  // Mode switcher: false = Cheatsheet, true = Practice Quiz
  bool _showQuiz = false;

  // Cheatsheet Tab State
  String _selectedCheatsheetTopic = 'lcm-hcf';
  String _searchQuery = '';

  // Practice Quiz Tab State
  String _selectedQuizTopic = 'lcm-hcf';
  String? _selectedDifficulty; // 'easy' | 'medium' | 'hard'
  Map<String, dynamic> _dbCounts = {};
  List<Map<String, dynamic>> _quizQuestions = [];
  bool _loadingQuiz = false;
  bool _quizFinished = false;
  int _currentIdx = 0;
  String? _selectedAns;
  bool _isAnswered = false;
  int _score = 0;
  final List<Map<String, dynamic>> _userAnswers = [];

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    // Ensure repository is initialized
    await AptitudeDataRepository.initialize();
    
    // Set immediate local counts so UI never flashes empty
    if (mounted) {
      setState(() {
        _dbCounts = AptitudeDataRepository.getAllCounts();
      });
    }

    // Try fetching live API counts
    try {
      final counts = await ApiService.getAptitudeCounts();
      if (mounted && counts.isNotEmpty) {
        setState(() {
          _dbCounts = counts;
        });
      }
    } catch (_) {}
  }

  int _getQuestionCount(String topicId, String difficulty) {
    final normTopic = topicId == 'percentage' ? 'percentages' : topicId;
    final topicCounts = _dbCounts[normTopic] ?? _dbCounts[topicId];
    if (topicCounts is Map) {
      final count = topicCounts[difficulty];
      if (count is int && count > 0) return count;
      if (count is String) {
        final parsed = int.tryParse(count);
        if (parsed != null && parsed > 0) return parsed;
      }
    }
    // Reliable local fallback calculation
    return AptitudeDataRepository.getQuestionCount(normTopic, difficulty);
  }

  void _handleStartQuiz(String difficulty, [String? topicId]) async {
    final chosenTopic = topicId ?? _selectedQuizTopic;
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    setState(() {
      _selectedDifficulty = difficulty;
      _selectedQuizTopic = chosenTopic;
      _loadingQuiz = true;
      _quizFinished = false;
      _quizQuestions = [];
      _currentIdx = 0;
      _selectedAns = null;
      _isAnswered = false;
      _score = 0;
      _userAnswers.clear();
    });

    final normTopic = chosenTopic == 'percentage' ? 'percentages' : chosenTopic;
    List<Map<String, dynamic>> questions = [];

    try {
      final apiRes = await ApiService.getAptitudeQuestions(normTopic, difficulty);
      if (apiRes.isNotEmpty) {
        questions = apiRes.map((q) => Map<String, dynamic>.from(q as Map)).toList();
      }
    } catch (_) {}

    if (questions.isEmpty) {
      questions = AptitudeDataRepository.getQuestions(normTopic, difficulty);
    }

    // Shuffle questions
    final random = Random();
    questions = List<Map<String, dynamic>>.from(questions)..shuffle(random);

    if (mounted) {
      setState(() {
        _quizQuestions = questions;
        _loadingQuiz = false;
      });
    }
  }

  void _jumpToQuestion(int idx) {
    if (idx < 0 || idx >= _quizQuestions.length) return;
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    final uaIndex = _userAnswers.indexWhere((ans) => ans['qIndex'] == idx);
    setState(() {
      _currentIdx = idx;
      if (uaIndex != -1) {
        _selectedAns = _userAnswers[uaIndex]['selected']?.toString();
        _isAnswered = true;
      } else {
        _selectedAns = null;
        _isAnswered = false;
      }
    });
  }

  void _handleAnswerSelect(String option) {
    if (_isAnswered || _currentIdx >= _quizQuestions.length) return;

    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    final currentQ = _quizQuestions[_currentIdx];
    final options = (currentQ['options'] as List?)?.map((o) => o.toString()).toList() ?? [];
    
    String correctAnswer = (currentQ['answer'] ?? currentQ['ans'] ?? '').toString();
    if (correctAnswer.isEmpty && currentQ['correctIndex'] is int) {
      final idx = currentQ['correctIndex'] as int;
      if (idx >= 0 && idx < options.length) {
        correctAnswer = options[idx];
      }
    }

    final isCorrect = option.trim() == correctAnswer.trim();

    setState(() {
      _selectedAns = option;
      _isAnswered = true;
      if (isCorrect) _score++;

      _userAnswers.removeWhere((ans) => ans['qIndex'] == _currentIdx);
      _userAnswers.add({
        'qIndex': _currentIdx,
        'question': (currentQ['question'] ?? currentQ['q'] ?? '').toString(),
        'options': options,
        'selected': option,
        'correct': correctAnswer,
        'isCorrect': isCorrect,
        'explanation': (currentQ['explanation'] ?? '').toString(),
        'shortcut': (currentQ['shortcut'] ?? '').toString(),
        'company': (currentQ['company'] ?? '').toString(),
      });
      _userAnswers.sort((a, b) => (a['qIndex'] as int).compareTo(b['qIndex'] as int));
    });

    if (isCorrect) {
      SoundManager.playSuccess(state?.soundEnabled ?? true);
    } else {
      SoundManager.playError(state?.soundEnabled ?? true);
    }
  }

  void _handleNextQuestion() {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    if (_currentIdx < _quizQuestions.length - 1) {
      _jumpToQuestion(_currentIdx + 1);
    } else {
      setState(() {
        _quizFinished = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          state?.translate('aptitude') ?? 'Aptitude Handbook & Quiz',
          style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: widget.isModal
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => Navigator.of(context).pop(),
              )
            : null,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: CareerPathApp.getGradient(context),
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Segmented Switcher (⚡ Cheatsheet | 📝 Practice Quiz)
              _buildSegmentedSwitcher(theme),

              // Active View
              Expanded(
                child: _showQuiz
                    ? _buildPracticeQuizView(theme)
                    : _buildCheatsheetView(theme),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── SEGMENTED SWITCHER ──────────────────────────────────────────
  Widget _buildSegmentedSwitcher(ThemeData theme) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.04),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: CareerPathApp.getBorderColor(context)),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () {
                final state = CareerPathApp.of(context);
                SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                setState(() {
                  _showQuiz = false;
                  _selectedDifficulty = null;
                  _quizFinished = false;
                });
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: !_showQuiz ? theme.colorScheme.primary : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: !_showQuiz
                      ? [BoxShadow(color: theme.colorScheme.primary.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 2))]
                      : [],
                ),
                child: Center(
                  child: Text(
                    '⚡ Cheatsheet',
                    style: TextStyle(
                      fontFamily: 'Outfit',
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: !_showQuiz ? Colors.white : Colors.grey,
                    ),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () {
                final state = CareerPathApp.of(context);
                SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                setState(() {
                  _showQuiz = true;
                  _selectedDifficulty = null;
                  _quizFinished = false;
                  _selectedQuizTopic = _selectedCheatsheetTopic;
                });
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _showQuiz ? theme.colorScheme.primary : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: _showQuiz
                      ? [BoxShadow(color: theme.colorScheme.primary.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 2))]
                      : [],
                ),
                child: Center(
                  child: Text(
                    '📝 Practice Quiz',
                    style: TextStyle(
                      fontFamily: 'Outfit',
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: _showQuiz ? Colors.white : Colors.grey,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── CHEATSHEET VIEW ─────────────────────────────────────────────
  Widget _buildCheatsheetView(ThemeData theme) {
    final isSearching = _searchQuery.trim().isNotEmpty;
    const allTopics = AptitudeDataRepository.allTopics;

    return Column(
      children: [
        // Hero Header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Aptitude Cheatsheet ⚡',
                style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 2),
              Text(
                'Master core math formulas, fraction grids & solved entrance shortcuts',
                style: TextStyle(fontSize: 11, color: Colors.grey.shade400),
              ),
            ],
          ),
        ),

        // Search Bar
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 8),
          child: TextField(
            style: const TextStyle(fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Search formulas, shortcuts, e.g. LCM...',
              hintStyle: const TextStyle(fontSize: 12, color: Colors.grey),
              prefixIcon: const Icon(Icons.search, size: 18),
              filled: true,
              fillColor: Colors.white.withOpacity(0.04),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide(color: CareerPathApp.getBorderColor(context)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide(color: CareerPathApp.getBorderColor(context)),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            ),
            onChanged: (val) => setState(() => _searchQuery = val),
          ),
        ),

        if (!isSearching) ...[
          // Horizontal Topics Selector
          Container(
            height: 44,
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: allTopics.length,
              itemBuilder: (context, idx) {
                final topic = allTopics[idx];
                final isSelected = _selectedCheatsheetTopic == topic['id'];
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: FilterChip(
                    label: Text('${topic['icon']} ${topic['title']}'),
                    labelStyle: TextStyle(
                      fontSize: 12,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      color: isSelected ? Colors.white : Colors.grey.shade300,
                    ),
                    selected: isSelected,
                    selectedColor: theme.colorScheme.primary,
                    backgroundColor: Colors.white.withOpacity(0.04),
                    side: BorderSide(
                      color: isSelected ? theme.colorScheme.primary : CareerPathApp.getBorderColor(context),
                    ),
                    onSelected: (_) {
                      final state = CareerPathApp.of(context);
                      SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                      setState(() => _selectedCheatsheetTopic = topic['id']!);
                    },
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 8),
          Expanded(child: _buildTopicDetails(_selectedCheatsheetTopic, theme)),
        ] else ...[
          Expanded(child: _buildSearchResultsView(theme)),
        ],
      ],
    );
  }

  Widget _buildTopicDetails(String topicId, ThemeData theme) {
    final topicInfo = AptitudeDataRepository.getTopicInfo(topicId);
    final items = topicInfo?.items ?? [];

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 80),
      children: [
        // Percentages: Show Fraction-to-Percentage Table
        if (topicId == 'percentages' && topicInfo?.columns != null) ...[
          Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Text('📊', style: TextStyle(fontSize: 16)),
                    SizedBox(width: 8),
                    Text(
                      'Fraction to Percentage Conversion',
                      style: TextStyle(fontFamily: 'Outfit', fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: topicInfo!.columns!.map((col) {
                    return Expanded(
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.03),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.white.withOpacity(0.06)),
                        ),
                        child: Column(
                          children: col.map((row) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 3),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    row['fraction'] ?? '',
                                    style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold, fontSize: 11),
                                  ),
                                  Text(
                                    '= ${row['percentage']}',
                                    style: const TextStyle(fontSize: 11, color: Colors.white70),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],

        // Simple Arithmetic: Show Squares 1 to 100
        if (topicId == 'simple-arithmetic') ...[
          Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Text('🔢', style: TextStyle(fontSize: 16)),
                    SizedBox(width: 8),
                    Text(
                      'Square Numbers (1 to 100)',
                      style: TextStyle(fontFamily: 'Outfit', fontSize: 14, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: AptitudeDataRepository.getSquaresData().map((col) {
                    return Expanded(
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 2),
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.03),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.white.withOpacity(0.06)),
                        ),
                        child: Column(
                          children: col.map((row) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 2),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '${row['num']}²',
                                    style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold, fontSize: 10),
                                  ),
                                  Text(
                                    '= ${row['val']}',
                                    style: const TextStyle(fontSize: 10, color: Colors.white70),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],

        // Formula Cards
        ...items.map((item) => _buildFormulaCard(item, theme)),
      ],
    );
  }

  Widget _buildFormulaCard(AptitudeItem item, ThemeData theme) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: CareerPathApp.getBorderColor(context)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            item.name,
            style: const TextStyle(fontFamily: 'Outfit', fontSize: 14, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          
          // Formula Box (dark mono box)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(10),
              border: Border(left: BorderSide(color: theme.colorScheme.primary, width: 3)),
            ),
            child: Text(
              AptitudeDataRepository.cleanHtml(item.formula),
              style: TextStyle(fontSize: 12, height: 1.45, color: theme.colorScheme.primary.withOpacity(0.95), fontFamily: 'Courier'),
            ),
          ),

          // Note Box
          if (item.note != null && item.note!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              '💡 Note: ${AptitudeDataRepository.cleanHtml(item.note!)}',
              style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Colors.grey, height: 1.3),
            ),
          ],

          // Worked Practice Box
          if (item.example != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.amber.withOpacity(0.06),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.amber.withOpacity(0.25)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('✍️ Solved Practice:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.amber)),
                  const SizedBox(height: 4),
                  Text(item.example!.question, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, height: 1.35)),
                  if (item.example!.steps.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    ...item.example!.steps.map((step) => Padding(
                      padding: const EdgeInsets.only(bottom: 3),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('• ', style: TextStyle(color: Colors.grey, fontSize: 11)),
                          Expanded(child: Text(step, style: const TextStyle(fontSize: 11, color: Colors.grey, height: 1.3))),
                        ],
                      ),
                    )),
                  ],
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: Colors.green.withOpacity(0.3)),
                    ),
                    child: Text(
                      'Ans: ${item.example!.answer}',
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.greenAccent),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ─── SEARCH RESULTS VIEW ─────────────────────────────────────────
  Widget _buildSearchResultsView(ThemeData theme) {
    final query = _searchQuery.toLowerCase().trim();
    final allCheatsheets = AptitudeDataRepository.getAllCheatsheets();
    final List<Map<String, dynamic>> results = [];

    allCheatsheets.forEach((topicId, topicInfo) {
      final matchingItems = topicInfo.items.where((item) {
        final inName = item.name.toLowerCase().contains(query);
        final inFormula = item.formula.toLowerCase().contains(query);
        final inNote = item.note?.toLowerCase().contains(query) ?? false;
        final inExample = item.example != null &&
            (item.example!.question.toLowerCase().contains(query) || item.example!.answer.toLowerCase().contains(query));
        return inName || inFormula || inNote || inExample;
      }).toList();

      if (matchingItems.isNotEmpty) {
        results.add({
          'topicId': topicId,
          'title': topicInfo.title,
          'icon': topicInfo.icon,
          'items': matchingItems,
        });
      }
    });

    if (results.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('🔍', style: TextStyle(fontSize: 40)),
            const SizedBox(height: 8),
            Text('No formulas found matching "$_searchQuery"', style: const TextStyle(fontSize: 13, color: Colors.grey)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 80),
      itemCount: results.length,
      itemBuilder: (context, idx) {
        final res = results[idx];
        final items = res['items'] as List<AptitudeItem>;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Text(
                '${res['icon']} ${res['title']}',
                style: const TextStyle(fontFamily: 'Outfit', fontSize: 14, fontWeight: FontWeight.bold, color: Colors.amber),
              ),
            ),
            ...items.map((item) => _buildFormulaCard(item, theme)),
          ],
        );
      },
    );
  }

  // ─── PRACTICE QUIZ VIEW ──────────────────────────────────────────
  Widget _buildPracticeQuizView(ThemeData theme) {
    if (_loadingQuiz) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_quizFinished) {
      return _buildScoreSummaryView(theme);
    }

    if (_selectedDifficulty != null && _quizQuestions.isNotEmpty) {
      return _buildActiveQuizQuestionView(theme);
    }

    return _buildDifficultySelectorView(theme);
  }

  // ─── DIFFICULTY SELECTOR VIEW ────────────────────────────────────
  Widget _buildDifficultySelectorView(ThemeData theme) {
    const allTopics = AptitudeDataRepository.allTopics;

    final easyCount = _getQuestionCount(_selectedQuizTopic, 'easy');
    final medCount = _getQuestionCount(_selectedQuizTopic, 'medium');
    final hardCount = _getQuestionCount(_selectedQuizTopic, 'hard');

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 80),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Topic Dropdown
          const Text(
            'SELECT TOPIC',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1, color: Colors.cyanAccent),
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
            decoration: BoxDecoration(
              color: CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _selectedQuizTopic,
                isExpanded: true,
                dropdownColor: CareerPathApp.getCardBg(context),
                items: allTopics.map((t) => DropdownMenuItem(
                  value: t['id'],
                  child: Text('${t['icon']} ${t['title']}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                )).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedQuizTopic = val);
                },
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Header
          const Center(
            child: Text(
              'Select Quiz Difficulty',
              style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(height: 4),
          Center(
            child: Text(
              'Timed aptitude quizzes with real company placement questions.',
              style: TextStyle(fontSize: 12, color: Colors.grey.shade400),
            ),
          ),
          const SizedBox(height: 18),

          // 🟢 EASY LEVEL CARD
          _buildDifficultyCard(
            theme: theme,
            level: 'easy',
            title: '🟢 EASY LEVEL',
            titleColor: const Color(0xFF10B981),
            bgColor: const Color(0x1410B981),
            borderColor: const Color(0x4D10B981),
            badgeColor: const Color(0x3310B981),
            count: '$easyCount Qs Database',
            desc: 'Covers fundamental formulas, simple terminology, and basic direct calculations. Best for beginners.',
          ),
          const SizedBox(height: 14),

          // 🟡 MEDIUM LEVEL CARD
          _buildDifficultyCard(
            theme: theme,
            level: 'medium',
            title: '🟡 MEDIUM LEVEL',
            titleColor: const Color(0xFFF59E0B),
            bgColor: const Color(0x14F59E0B),
            borderColor: const Color(0x4DF59E0B),
            badgeColor: const Color(0x33F59E0B),
            count: '$medCount Qs Database',
            desc: 'Covers intermediate word problems, multi-stage computations, and helpful shortcuts. Ideal for revision.',
          ),
          const SizedBox(height: 14),

          // 🔴 HARD LEVEL CARD
          _buildDifficultyCard(
            theme: theme,
            level: 'hard',
            title: '🔴 HARD LEVEL',
            titleColor: const Color(0xFFEF4444),
            bgColor: const Color(0x14EF4444),
            borderColor: const Color(0x4DEF4444),
            badgeColor: const Color(0x33EF4444),
            count: '$hardCount Qs Database',
            desc: 'Covers advanced logical twists, combined concepts, and tougher exam-level configurations.',
          ),
        ],
      ),
    );
  }

  Widget _buildDifficultyCard({
    required ThemeData theme,
    required String level,
    required String title,
    required Color titleColor,
    required Color bgColor,
    required Color borderColor,
    required Color badgeColor,
    required String count,
    required String desc,
  }) {
    return InkWell(
      onTap: () => _handleStartQuiz(level),
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: borderColor, width: 1.5),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: TextStyle(fontFamily: 'Outfit', fontSize: 15, fontWeight: FontWeight.w900, color: titleColor),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: badgeColor,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    count,
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: titleColor),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              desc,
              style: const TextStyle(fontSize: 12, color: Colors.grey, height: 1.4),
            ),
          ],
        ),
      ),
    );
  }

  // ─── ACTIVE QUIZ QUESTION VIEW ───────────────────────────────────
  Widget _buildActiveQuizQuestionView(ThemeData theme) {
    if (_quizQuestions.isEmpty || _currentIdx >= _quizQuestions.length) {
      return const Center(child: Text('No questions found.'));
    }

    final currentQ = _quizQuestions[_currentIdx];
    final questionText = (currentQ['question'] ?? currentQ['q'] ?? '').toString();
    final options = (currentQ['options'] as List?)?.map((o) => o.toString()).toList() ?? [];
    
    String correctAnswer = (currentQ['answer'] ?? currentQ['ans'] ?? '').toString();
    if (correctAnswer.isEmpty && currentQ['correctIndex'] is int) {
      final idx = currentQ['correctIndex'] as int;
      if (idx >= 0 && idx < options.length) {
        correctAnswer = options[idx];
      }
    }

    final explanation = (currentQ['explanation'] ?? '').toString();
    final shortcut = (currentQ['shortcut'] ?? '').toString();
    final company = (currentQ['company'] ?? '').toString();
    final category = (currentQ['category'] ?? '').toString();

    final progress = (_currentIdx + 1) / _quizQuestions.length;

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 80),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header: Question counter + Score
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Question ${_currentIdx + 1} of ${_quizQuestions.length}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey),
              ),
              Text(
                'Score: $_score/${_currentIdx + (_isAnswered ? 1 : 0)}',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: theme.colorScheme.primary),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Linear Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 6,
              backgroundColor: Colors.white.withOpacity(0.06),
              valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
            ),
          ),
          const SizedBox(height: 16),

          // Question Navigation Palette (Matrix)
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.02),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: Wrap(
              spacing: 6,
              runSpacing: 6,
              alignment: WrapAlignment.center,
              children: List.generate(_quizQuestions.length, (idx) {
                final isAnsweredQ = _userAnswers.any((ans) => ans['qIndex'] == idx);
                final isActive = idx == _currentIdx;

                Color bg = Colors.white.withOpacity(0.03);
                Color border = CareerPathApp.getBorderColor(context);
                Color text = Colors.grey;

                if (isAnsweredQ) {
                  bg = const Color(0x2610B981);
                  border = const Color(0x4D10B981);
                  text = const Color(0xFF10B981);
                }
                if (isActive) {
                  border = theme.colorScheme.primary;
                  text = theme.colorScheme.primary;
                  if (!isAnsweredQ) bg = theme.colorScheme.primary.withOpacity(0.15);
                }

                return GestureDetector(
                  onTap: () => _jumpToQuestion(idx),
                  child: Container(
                    width: 30,
                    height: 30,
                    decoration: BoxDecoration(
                      color: bg,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: border, width: isActive ? 2 : 1),
                    ),
                    child: Center(
                      child: Text(
                        '${idx + 1}',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: text),
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),
          const SizedBox(height: 16),

          // Question Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Category + Company Tags
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (category.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                        ),
                        child: Text(
                          category,
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                        ),
                      )
                    else
                      const SizedBox.shrink(),
                    if (company.isNotEmpty)
                      Text('🏢 $company', style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.w600)),
                  ],
                ),
                const SizedBox(height: 12),

                // Question Prompt
                Text(
                  questionText,
                  style: const TextStyle(fontFamily: 'Outfit', fontSize: 14, fontWeight: FontWeight.bold, height: 1.45),
                ),
                const SizedBox(height: 16),

                // Options List
                ...options.map((opt) {
                  final isSelected = _selectedAns == opt;
                  final isCorrectOpt = opt.trim() == correctAnswer.trim();

                  Color optBg = Colors.white.withOpacity(0.02);
                  Color optBorder = CareerPathApp.getBorderColor(context);
                  Color optText = Colors.white;

                  if (_isAnswered) {
                    if (isCorrectOpt) {
                      optBg = const Color(0x2610B981);
                      optBorder = const Color(0xFF10B981);
                      optText = const Color(0xFF10B981);
                    } else if (isSelected) {
                      optBg = const Color(0x26EF4444);
                      optBorder = const Color(0xFFEF4444);
                      optText = const Color(0xFFEF4444);
                    } else {
                      optText = Colors.grey.shade500;
                    }
                  }

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: InkWell(
                      onTap: () => _handleAnswerSelect(opt),
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: optBg,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: optBorder, width: 1.5),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                opt,
                                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: optText),
                              ),
                            ),
                            if (_isAnswered) ...[
                              if (isCorrectOpt)
                                const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 18)
                              else if (isSelected)
                                const Icon(Icons.cancel, color: Color(0xFFEF4444), size: 18),
                            ],
                          ],
                        ),
                      ),
                    ),
                  );
                }),

                // Explanation & Shortcut
                if (_isAnswered) ...[
                  const Divider(height: 24, thickness: 1),
                  const Text('✍️ Solved Explanation:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.amber)),
                  const SizedBox(height: 4),
                  Text(
                    explanation,
                    style: const TextStyle(fontSize: 11, color: Colors.grey, height: 1.45),
                  ),
                  if (shortcut.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
                      ),
                      child: Text(
                        '💡 Shortcut Method: $shortcut',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                      ),
                    ),
                  ],
                ],
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Action Button
          if (_isAnswered)
            ElevatedButton(
              onPressed: _handleNextQuestion,
              style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.primary,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: Text(
                _currentIdx < _quizQuestions.length - 1 ? 'Next Question ➔' : 'Finish Quiz 🏆',
                style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
              ),
            ),
        ],
      ),
    );
  }

  // ─── QUIZ SCORE SUMMARY VIEW ─────────────────────────────────────
  Widget _buildScoreSummaryView(ThemeData theme) {
    final total = _quizQuestions.length;
    final pct = total > 0 ? ((_score / total) * 100).round() : 0;
    final emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👏' : '📚';

    const allTopics = AptitudeDataRepository.allTopics;
    final topicName = allTopics.firstWhere(
      (t) => t['id'] == _selectedQuizTopic,
      orElse: () => {'title': 'Aptitude'},
    )['title'];

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 80),
      children: [
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: CareerPathApp.getCardBg(context),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: CareerPathApp.getBorderColor(context)),
          ),
          child: Column(
            children: [
              Text(emoji, style: const TextStyle(fontSize: 54)),
              const SizedBox(height: 8),
              const Text('Quiz Completed!', style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(
                'You took the $topicName ${_selectedDifficulty?.toUpperCase()} level quiz.',
                style: const TextStyle(fontSize: 11, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 18),

              // Score Fraction
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(
                    '$_score',
                    style: TextStyle(fontFamily: 'Outfit', fontSize: 48, fontWeight: FontWeight.w900, color: theme.colorScheme.primary),
                  ),
                  const Text(' / ', style: TextStyle(fontSize: 22, color: Colors.grey)),
                  Text('$total', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                ],
              ),
              Text('$pct% Score Accuracy', style: const TextStyle(fontSize: 12, color: Colors.grey)),
              const SizedBox(height: 16),

              // Motivation Card
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.03),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  pct >= 80
                      ? 'Fantastic! You have excellent control over $topicName problems. Ready to take on tougher placement tests!'
                      : pct >= 50
                          ? 'Good job! You have a solid grasp of the basics. Review the shortcuts to improve your timing.'
                          : 'Keep practicing! Review the cheatsheet formulas and try again to build your speed and accuracy.',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 11, height: 1.4, color: Colors.white70),
                ),
              ),
              const SizedBox(height: 20),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _selectedDifficulty = null;
                          _quizFinished = false;
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: theme.colorScheme.primary,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('🔄 Try Another Level', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        if (_selectedDifficulty != null) {
                          _handleStartQuiz(_selectedDifficulty!);
                        }
                      },
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('🔁 Retry Level', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Review Breakdown Header
        const Text(
          'Review Questions:',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 15, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),

        // Review List
        ..._quizQuestions.asMap().entries.map((entry) {
          final qIdx = entry.key;
          final q = entry.value;
          final ua = _userAnswers.firstWhere(
            (ans) => ans['qIndex'] == qIdx,
            orElse: () => <String, dynamic>{},
          );
          final isSkipped = ua.isEmpty;
          final isCorrect = ua['isCorrect'] == true;

          final questionText = (q['question'] ?? q['q'] ?? '').toString();
          final correctAnswer = (q['answer'] ?? q['ans'] ?? '').toString();
          final explanation = (q['explanation'] ?? '').toString();
          final company = (q['company'] ?? '').toString();

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      isSkipped ? '⚠️ SKIPPED' : isCorrect ? '✅ CORRECT' : '❌ INCORRECT',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isSkipped ? Colors.amber : isCorrect ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                      ),
                    ),
                    if (company.isNotEmpty)
                      Text('🏢 $company', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
                const SizedBox(height: 6),
                Text('Q${qIdx + 1}. $questionText', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, height: 1.35)),
                const SizedBox(height: 6),
                if (isSkipped)
                  Text('Correct Answer: $correctAnswer', style: const TextStyle(fontSize: 11, color: Color(0xFF10B981), fontWeight: FontWeight.bold))
                else
                  Text(
                    'Your Answer: ${ua['selected']}${!isCorrect ? '  |  Correct: $correctAnswer' : ''}',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: isCorrect ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                    ),
                  ),
                const SizedBox(height: 6),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.03),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(explanation, style: const TextStyle(fontSize: 10, color: Colors.grey, height: 1.4)),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}
