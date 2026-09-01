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

class _AptitudeCheatsheetPageState extends State<AptitudeCheatsheetPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  // Cheatsheet tab state
  String _searchCheatsheet = '';
  String _selectedCheatsheetTopic = 'lcm-hcf';

  // Quiz tab state
  String _selectedQuizTopic = 'lcm-hcf';
  String _selectedDifficulty = 'all';
  Map<String, dynamic> _dbCounts = {};
  List<dynamic> _quizQuestions = [];
  bool _loadingQuiz = false;
  bool _quizFinished = false;
  int _currentIdx = 0;
  String? _selectedOption;
  bool _showExplanation = false;
  int _score = 0;
  final Map<int, String> _userAnswers = {};

  final Map<String, List<Map<String, dynamic>>> _cheatsheets = AptitudeDataRepository.getCheatsheets();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _fetchCounts();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _fetchCounts() async {
    try {
      final counts = await ApiService.getAptitudeCounts();
      if (mounted) {
        setState(() {
          _dbCounts = counts;
        });
      }
    } catch (_) {}
  }

  void _startQuiz(String difficulty) async {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    setState(() {
      _selectedDifficulty = difficulty;
      _loadingQuiz = true;
      _quizFinished = false;
      _quizQuestions = [];
      _currentIdx = 0;
      _selectedOption = null;
      _showExplanation = false;
      _score = 0;
      _userAnswers.clear();
    });

    try {
      final res = await ApiService.getAptitudeQuestions(_selectedQuizTopic, difficulty);
      if (mounted) {
        setState(() {
          _quizQuestions = res;
          _loadingQuiz = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _quizQuestions = [
            {
              "id": "q1",
              "topic": _selectedQuizTopic,
              "difficulty": difficulty,
              "company": "TCS NQT",
              "q": "The HCF of two numbers is 11 and their LCM is 693. If one number is 77, find the other.",
              "options": ["88", "99", "111", "121"],
              "answer": "99",
              "explanation": "Using Product Rule: Product of 2 numbers = HCF × LCM => 77 × X = 11 × 693 => X = (11 × 693) / 77 = 99.",
              "shortcut": "LCM / (77 / 11) = 693 / 7 = 99 directly."
            },
            {
              "id": "q2",
              "topic": _selectedQuizTopic,
              "difficulty": difficulty,
              "company": "Infosys",
              "q": "Find the least number which when divided by 6, 9, 12, 15 leaves a remainder 3 in each case.",
              "options": ["180", "183", "177", "186"],
              "answer": "183",
              "explanation": "Required number = LCM(6, 9, 12, 15) + 3. LCM(6, 9, 12, 15) = 180. 180 + 3 = 183.",
              "shortcut": "Compute LCM(6, 9, 12, 15) = 180, then add the constant remainder 3."
            }
          ];
          _loadingQuiz = false;
        });
      }
    }
  }

  void _submitAnswer(String option) {
    if (_showExplanation) return;
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    final currentQ = _quizQuestions[_currentIdx];
    final isCorrect = option == (currentQ['answer'] ?? currentQ['ans']);

    setState(() {
      _selectedOption = option;
      _userAnswers[_currentIdx] = option;
      _showExplanation = true;
      if (isCorrect) _score++;
    });

    if (isCorrect) {
      SoundManager.playSuccess(state?.soundEnabled ?? true);
    } else {
      SoundManager.playError(state?.soundEnabled ?? true);
    }
  }

  void _nextQuestion() {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    if (_currentIdx < _quizQuestions.length - 1) {
      setState(() {
        _currentIdx++;
        _selectedOption = _userAnswers[_currentIdx];
        _showExplanation = _selectedOption != null;
      });
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
        title: Text(state?.translate('aptitude') ?? 'Aptitude Handbook & Quiz', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: widget.isModal
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => Navigator.of(context).pop(),
              )
            : null,
        bottom: TabBar(
          controller: _tabController,
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: theme.unselectedWidgetColor.withOpacity(0.6),
          indicatorColor: theme.colorScheme.primary,
          tabs: const [
            Tab(text: 'Handbook & Formulas'),
            Tab(text: 'Practice Quizzes'),
          ],
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: CareerPathApp.getGradient(context),
          ),
        ),
        child: TabBarView(
          controller: _tabController,
          children: [
            // TAB 1: Cheatsheet Formulas
            _buildHandbookTab(),

            // TAB 2: Practice Quiz
            _buildQuizTab(),
          ],
        ),
      ),
    );
  }

  // ─── TAB 1: HANDBOOK ──────────────────────────────────────────
  Widget _buildHandbookTab() {
    final theme = Theme.of(context);
    final allTopics = AptitudeDataRepository.allTopics;
    final filteredTopics = _searchCheatsheet.trim().isEmpty
        ? allTopics
        : allTopics.where((t) => t['title']!.toLowerCase().contains(_searchCheatsheet.toLowerCase())).toList();

    final activeTopicInfo = allTopics.firstWhere((t) => t['id'] == _selectedCheatsheetTopic, orElse: () => allTopics.first);
    final activeCards = _cheatsheets[_selectedCheatsheetTopic] ?? [
      {
        'name': '1. Core Formulas',
        'formula': 'Formulas and shortcuts for ${activeTopicInfo['title']}.\n• Practice questions to strengthen conceptual clarity.'
      }
    ];

    return Column(
      children: [
        // Search bar
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
          child: TextField(
            style: const TextStyle(fontSize: 14),
            decoration: InputDecoration(
              hintText: 'Search 22 quantitative topics...',
              prefixIcon: const Icon(Icons.search, size: 20),
              filled: true,
              fillColor: Colors.white.withOpacity(0.04),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: CareerPathApp.getBorderColor(context))),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            ),
            onChanged: (val) => setState(() => _searchCheatsheet = val),
          ),
        ),

        // Horizontal topic selector chips
        Container(
          height: 48,
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: filteredTopics.length,
            itemBuilder: (context, idx) {
              final t = filteredTopics[idx];
              final isSel = _selectedCheatsheetTopic == t['id'];
              return Padding(
                padding: const EdgeInsets.only(right: 8.0),
                child: ChoiceChip(
                  label: Text('${t['icon']} ${t['title']}'),
                  selected: isSel,
                  onSelected: (_) {
                    final state = CareerPathApp.of(context);
                    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                    setState(() => _selectedCheatsheetTopic = t['id']!);
                  },
                ),
              );
            },
          ),
        ),

        // Active Topic Cards List
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: activeCards.length,
            itemBuilder: (context, idx) {
              final item = activeCards[idx];
              return Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: CareerPathApp.getCardBg(context),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: CareerPathApp.getBorderColor(context)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item['name'] ?? '',
                      style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      item['formula'] ?? '',
                      style: const TextStyle(fontSize: 13, height: 1.5, color: Color(0xFFE2E8F0)),
                    ),
                    if (item['example'] != null) ...[
                      const SizedBox(height: 14),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('💡 Worked Example:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.cyanAccent)),
                            const SizedBox(height: 4),
                            Text(item['example'], style: const TextStyle(fontSize: 12, height: 1.4)),
                          ],
                        ),
                      ),
                    ],
                    if (item['shortcuts'] != null) ...[
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.amberAccent.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.amberAccent.withOpacity(0.2)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('⚡ Shortcut Method:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.amberAccent)),
                            const SizedBox(height: 4),
                            Text(item['shortcuts'], style: const TextStyle(fontSize: 12, height: 1.4)),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // ─── TAB 2: QUIZ ──────────────────────────────────────────────
  Widget _buildQuizTab() {
    if (_loadingQuiz) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_quizFinished) {
      return _buildScoreCard();
    }

    if (_quizQuestions.isNotEmpty) {
      return _buildActiveQuizQuestion();
    }

    return _buildQuizLauncher();
  }

  Widget _buildQuizLauncher() {
    final theme = Theme.of(context);
    final allTopics = AptitudeDataRepository.allTopics;
    final topicCounts = _dbCounts[_selectedQuizTopic] as Map<String, dynamic>?;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Center(
            child: Text('🎯', style: TextStyle(fontSize: 48)),
          ),
          const SizedBox(height: 8),
          const Text(
            'Quantitative Aptitude Quizzes',
            style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          const Text(
            'Timed aptitude quizzes with real company placement questions.',
            style: TextStyle(fontSize: 12, color: Colors.grey),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),

          // Topic dropdown
          const Text('Select Topic:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.04),
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
                  child: Text('${t['icon']} ${t['title']}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                )).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedQuizTopic = val);
                },
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Difficulty levels selection
          const Text('Select Difficulty:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(height: 10),
          _buildDifficultyOption(
            level: 'easy',
            title: '🟢 Easy Level',
            desc: 'Direct formulas & single-step problems',
            count: topicCounts?['easy']?.toString() ?? '10+ Qs',
          ),
          const SizedBox(height: 10),
          _buildDifficultyOption(
            level: 'medium',
            title: '🟡 Medium Level',
            desc: 'Standard placement test difficulty',
            count: topicCounts?['medium']?.toString() ?? '15+ Qs',
          ),
          const SizedBox(height: 10),
          _buildDifficultyOption(
            level: 'hard',
            title: '🔴 Hard Level',
            desc: 'Multi-step logic & tricky placement problems',
            count: topicCounts?['hard']?.toString() ?? '10+ Qs',
          ),
          const SizedBox(height: 10),
          _buildDifficultyOption(
            level: 'all',
            title: '🚀 All / Mixed Levels',
            desc: 'Comprehensive mix across all difficulties',
            count: topicCounts?['total']?.toString() ?? '35+ Qs',
          ),
        ],
      ),
    );
  }

  Widget _buildDifficultyOption({
    required String level,
    required String title,
    required String desc,
    required String count,
  }) {
    final theme = Theme.of(context);
    return Card(
      color: CareerPathApp.getCardBg(context),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: BorderSide(color: CareerPathApp.getBorderColor(context)),
      ),
      child: InkWell(
        onTap: () => _startQuiz(level),
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 3),
                    Text(desc, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(count, style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActiveQuizQuestion() {
    final theme = Theme.of(context);
    final q = _quizQuestions[_currentIdx];
    final questionText = q['question'] ?? q['q'] ?? '';
    final options = (q['options'] as List?)?.map((o) => o.toString()).toList() ?? [];
    final correctAnswer = q['answer'] ?? q['ans'] ?? '';
    final explanation = q['explanation'] ?? '';
    final shortcut = q['shortcut'] ?? '';
    final company = q['company']?.toString() ?? '';

    final progress = (_currentIdx + 1) / _quizQuestions.length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Progress & Counter
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Question ${_currentIdx + 1} of ${_quizQuestions.length}',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey),
              ),
              if (company.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.amberAccent.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text('🏢 $company', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.amberAccent)),
                ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(value: progress, backgroundColor: Colors.white.withOpacity(0.08), color: theme.colorScheme.primary),
          const SizedBox(height: 20),

          // Question Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: Text(
              questionText,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, height: 1.4),
            ),
          ),
          const SizedBox(height: 16),

          // Options List
          ...options.map((opt) {
            final isSelected = _selectedOption == opt;
            final isCorrect = opt == correctAnswer;
            Color cardColor = CareerPathApp.getCardBg(context);
            Color borderColor = CareerPathApp.getBorderColor(context);

            if (_showExplanation) {
              if (isCorrect) {
                cardColor = Colors.greenAccent.withOpacity(0.15);
                borderColor = Colors.greenAccent;
              } else if (isSelected) {
                cardColor = Colors.redAccent.withOpacity(0.15);
                borderColor = Colors.redAccent;
              }
            }

            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: borderColor),
              ),
              child: ListTile(
                title: Text(opt, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                trailing: _showExplanation
                    ? isCorrect
                        ? const Icon(Icons.check_circle, color: Colors.greenAccent)
                        : isSelected
                            ? const Icon(Icons.cancel, color: Colors.redAccent)
                            : null
                    : null,
                onTap: () => _submitAnswer(opt),
              ),
            );
          }).toList(),

          // Explanation Box
          if (_showExplanation) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.04),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('📖 Step-by-Step Explanation:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.cyanAccent)),
                  const SizedBox(height: 6),
                  Text(explanation, style: const TextStyle(fontSize: 12, height: 1.4, color: Color(0xFFE2E8F0))),
                  if (shortcut.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    Text('💡 Shortcut: $shortcut', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.amberAccent)),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _nextQuestion,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: Text(
                _currentIdx < _quizQuestions.length - 1 ? 'Next Question ➔' : 'Finish Quiz 🏆',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
          const SizedBox(height: 30),
        ],
      ),
    );
  }

  Widget _buildScoreCard() {
    final theme = Theme.of(context);
    final total = _quizQuestions.length;
    final pct = total > 0 ? ((_score / total) * 100).round() : 0;

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: CareerPathApp.getCardBg(context),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('🏆', style: TextStyle(fontSize: 60)),
              const SizedBox(height: 10),
              const Text('Quiz Completed!', style: TextStyle(fontFamily: 'Outfit', fontSize: 22, fontWeight: FontWeight.bold)),
              const SizedBox(height: 14),
              Text(
                '$_score / $total',
                style: const TextStyle(fontFamily: 'Outfit', fontSize: 36, fontWeight: FontWeight.w900, color: Colors.greenAccent),
              ),
              Text(
                '$pct% Score Accuracy',
                style: const TextStyle(fontSize: 13, color: Colors.grey),
              ),
              const SizedBox(height: 16),
              Text(
                pct >= 80
                    ? '🎉 Fantastic mastery! You are well-prepared for placement aptitude tests.'
                    : pct >= 50
                        ? '👍 Good job! Review the formulas in the handbook to reach 90%+ accuracy.'
                        : '📚 Keep practicing! Study the handbook formulas and try again.',
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                icon: const Icon(Icons.refresh),
                label: const Text('Retake Quiz'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  setState(() {
                    _quizQuestions = [];
                    _quizFinished = false;
                  });
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
