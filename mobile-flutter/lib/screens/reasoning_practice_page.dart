import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';
import '../utils/reasoning_data.dart';

class ReasoningPracticePage extends StatefulWidget {
  final bool isModal;

  const ReasoningPracticePage({super.key, this.isModal = false});

  @override
  State<ReasoningPracticePage> createState() => _ReasoningPracticePageState();
}

class _ReasoningPracticePageState extends State<ReasoningPracticePage> {
  // Mode: 'practice' | 'test' | 'review'
  String _mode = 'practice';
  final String _difficultyFilter = 'all';

  // Topic selection & Session State
  String? _selectedTopic;
  List<Map<String, dynamic>> _quizQuestions = [];
  int _currentIdx = 0;
  final Map<dynamic, String> _userAnswers = {};
  final Map<dynamic, bool> _confirmedAnswers = {};
  bool _quizFinished = false;
  int _startTime = 0;
  int _timeTaken = 0; // seconds
  bool _hasNoAttempt = false;
  bool _loading = false;

  final List<ReasoningTopicInfo> _topics = ReasoningDataRepository.allTopics;

  @override
  void initState() {
    super.initState();
    ReasoningDataRepository.initialize();
  }

  // Start learning or test session
  void _startSession(String topicId) async {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    if (_mode == 'review') {
      final prefs = await SharedPreferences.getInstance();
      final savedAttempt = prefs.getString('cp_reasoning_last_attempt_$topicId');
      if (savedAttempt == null) {
        setState(() {
          _hasNoAttempt = true;
          _selectedTopic = topicId;
        });
        return;
      }
      try {
        final Map<String, dynamic> attempt = json.decode(savedAttempt);
        final rawQuestions = attempt['questions'] as List? ?? [];
        final questions = rawQuestions.map((q) => Map<String, dynamic>.from(q as Map)).toList();
        final rawAnswers = attempt['userAnswers'] as List? ?? [];
        
        final savedAnswers = <dynamic, String>{};
        for (final ua in rawAnswers) {
          if (ua is Map) {
            savedAnswers[ua['qId']] = (ua['selected'] ?? '').toString();
          }
        }

        setState(() {
          _quizQuestions = questions;
          _userAnswers.clear();
          _userAnswers.addAll(savedAnswers);
          _selectedTopic = topicId;
          _quizFinished = true;
          _hasNoAttempt = false;
        });
        return;
      } catch (e) {
        setState(() {
          _hasNoAttempt = true;
          _selectedTopic = topicId;
        });
        return;
      }
    }

    setState(() {
      _loading = true;
      _selectedTopic = topicId;
      _quizQuestions = [];
      _currentIdx = 0;
      _userAnswers.clear();
      _confirmedAnswers.clear();
      _quizFinished = false;
      _startTime = DateTime.now().millisecondsSinceEpoch;
      _timeTaken = 0;
      _hasNoAttempt = false;
    });

    final isGlobalTest = (topicId == 'mixed_test' || _mode == 'test');
    List<dynamic> fetched = [];

    try {
      fetched = await ApiService.getReasoningQuiz(
        topic: isGlobalTest ? null : topicId,
        difficulty: _difficultyFilter == 'all' ? null : _difficultyFilter,
        testMode: isGlobalTest,
      );
    } catch (_) {}

    if (fetched.isEmpty) {
      fetched = ReasoningDataRepository.getQuestions(
        topic: isGlobalTest ? null : topicId,
        difficulty: _difficultyFilter == 'all' ? null : _difficultyFilter,
        testMode: isGlobalTest,
      );
    }

    final questions = fetched.map((q) => Map<String, dynamic>.from(q as Map)).toList();

    if (mounted) {
      setState(() {
        _quizQuestions = questions;
        _loading = false;
      });
    }
  }

  // Handle option selection
  void _selectOption(dynamic qId, String option) {
    if (_mode == 'practice' && _confirmedAnswers[qId] == true) return;

    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    final currentQ = _quizQuestions[_currentIdx];
    final isCorrect = option.trim() == (currentQ['answer'] ?? '').toString().trim();

    setState(() {
      _userAnswers[qId] = option;
      if (_mode == 'practice') {
        _confirmedAnswers[qId] = true;
      }
    });

    if (_mode == 'practice') {
      if (isCorrect) {
        SoundManager.playSuccess(state?.soundEnabled ?? true);
      } else {
        SoundManager.playError(state?.soundEnabled ?? true);
      }
    }
  }

  // Submit test
  void _submitTest() async {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    final elapsed = ((DateTime.now().millisecondsSinceEpoch - _startTime) / 1000).round();
    
    int score = 0;
    final details = <Map<String, dynamic>>[];
    for (final q in _quizQuestions) {
      final selected = _userAnswers[q['id']];
      final isCorrect = selected != null && selected.trim() == (q['answer'] ?? '').toString().trim();
      if (isCorrect) score++;
      details.add({
        'qId': q['id'],
        'selected': selected ?? 'Skipped',
        'isCorrect': isCorrect,
      });
    }

    setState(() {
      _timeTaken = elapsed;
      _quizFinished = true;
    });

    // Persist attempt to SharedPreferences
    try {
      final prefs = await SharedPreferences.getInstance();
      final attemptPayload = {
        'topicId': _selectedTopic,
        'mode': _mode,
        'difficulty': _difficultyFilter,
        'score': score,
        'total': _quizQuestions.length,
        'timeTaken': elapsed,
        'userAnswers': details,
        'questions': _quizQuestions,
      };
      await prefs.setString('cp_reasoning_last_attempt_$_selectedTopic', json.encode(attemptPayload));
    } catch (_) {}
  }

  String _formatTime(int secs) {
    final m = secs ~/ 60;
    final s = secs % 60;
    return '${m}m ${s}s';
  }

  void _exitSession() {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    setState(() {
      _selectedTopic = null;
      _quizQuestions = [];
      _currentIdx = 0;
      _userAnswers.clear();
      _confirmedAnswers.clear();
      _quizFinished = false;
      _hasNoAttempt = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          state?.translate('reasoning') ?? 'Reasoning Practice',
          style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: widget.isModal || _selectedTopic != null
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () {
                  if (_selectedTopic != null) {
                    _exitSession();
                  } else {
                    Navigator.of(context).pop();
                  }
                },
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
          child: _selectedTopic != null
              ? _buildSessionView(theme)
              : _buildTopicSelectionView(theme),
        ),
      ),
    );
  }

  // ─── 1. TOPIC SELECTION / LANDING VIEW ───────────────────────────
  Widget _buildTopicSelectionView(ThemeData theme) {
    final allQuestions = ReasoningDataRepository.getAllQuestions();

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 80),
      children: [
        // Mode Selector Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: CareerPathApp.getCardBg(context),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: CareerPathApp.getBorderColor(context)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'PRACTICE MODE',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1, color: Colors.cyanAccent),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  _buildModeTab(theme, 'practice', 'Practice'),
                  const SizedBox(width: 8),
                  _buildModeTab(theme, 'test', 'Test'),
                  const SizedBox(width: 8),
                  _buildModeTab(theme, 'review', 'Review Last'),
                ],
              ),
              if (_mode == 'test') ...[
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  icon: const Text('🚀', style: TextStyle(fontSize: 16)),
                  label: const Text(
                    'Start Global Test (30 Mixed Questions)',
                    style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    minimumSize: const Size(double.infinity, 46),
                  ),
                  onPressed: () => _startSession('mixed_test'),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 20),

        const Text(
          'Reasoning Topics',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(
          'Sharpen analytical and logical reasoning skills across all placement topics.',
          style: TextStyle(fontSize: 12, color: Colors.grey.shade400),
        ),
        const SizedBox(height: 14),

        // Topic Grid
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 0.92,
          ),
          itemCount: _topics.length,
          itemBuilder: (context, idx) {
            final topic = _topics[idx];
            final topicQs = allQuestions.where((q) => q.topic == topic.id).toList();
            final count = topicQs.isNotEmpty ? topicQs.length : topic.totalQs;

            return Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: CareerPathApp.getCardBg(context),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: CareerPathApp.getBorderColor(context)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(topic.icon, style: const TextStyle(fontSize: 24)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '$count Qs',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Expanded(
                    child: Text(
                      topic.name,
                      style: const TextStyle(fontFamily: 'Outfit', fontSize: 13, fontWeight: FontWeight.bold),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(height: 6),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => _startSession(topic.id),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white.withOpacity(0.04),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: Text(
                        _mode == 'review' ? 'Review Solutions' : 'Start Practice →',
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildModeTab(ThemeData theme, String modeId, String title) {
    final isActive = _mode == modeId;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          final state = CareerPathApp.of(context);
          SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
          setState(() => _mode = modeId);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isActive ? theme.colorScheme.primary : Colors.white.withOpacity(0.03),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: isActive ? theme.colorScheme.primary : CareerPathApp.getBorderColor(context)),
          ),
          child: Center(
            child: Text(
              title,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: isActive ? Colors.white : Colors.grey.shade300,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ─── 2. SESSION VIEW (QUIZ / TEST / REVIEW / EMPTY) ──────────────
  Widget _buildSessionView(ThemeData theme) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_hasNoAttempt) {
      return _buildNoAttemptView(theme);
    }

    if (_quizFinished) {
      return _buildResultsReviewView(theme);
    }

    return _buildActiveQuizView(theme);
  }

  // ─── NO PREVIOUS ATTEMPT EMPTY STATE ─────────────────────────────
  Widget _buildNoAttemptView(ThemeData theme) {
    final topicInfo = _topics.firstWhere((t) => t.id == _selectedTopic, orElse: () => _topics.first);

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: CareerPathApp.getCardBg(context),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: CareerPathApp.getBorderColor(context)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('⚠️', style: TextStyle(fontSize: 48)),
              const SizedBox(height: 12),
              const Text(
                'No Previous Test Attempt Found',
                style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'You must complete at least one test session in Test Mode before you can review your answers for ${topicInfo.name}.',
                style: const TextStyle(fontSize: 12, color: Colors.grey, height: 1.4),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  setState(() => _mode = 'test');
                  _startSession(_selectedTopic!);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Start a New Test', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              ),
              const SizedBox(height: 10),
              TextButton(
                onPressed: _exitSession,
                child: const Text('Back to Selection', style: TextStyle(color: Colors.grey, fontSize: 12)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── ACTIVE QUIZ VIEW ────────────────────────────────────────────
  Widget _buildActiveQuizView(ThemeData theme) {
    if (_quizQuestions.isEmpty || _currentIdx >= _quizQuestions.length) {
      return const Center(child: Text('No questions available.'));
    }

    final currentQ = _quizQuestions[_currentIdx];
    final qId = currentQ['id'];
    final questionText = (currentQ['q'] ?? currentQ['question'] ?? '').toString();
    final options = (currentQ['options'] as List?)?.map((o) => o.toString()).toList() ?? [];
    final correctAnswer = (currentQ['answer'] ?? '').toString();
    final explanation = (currentQ['explanation'] ?? '').toString();
    final shortcut = (currentQ['shortcut'] ?? '').toString();
    final company = (currentQ['company'] ?? '').toString();
    final category = (currentQ['category'] ?? '').toString();

    final isConfirmed = _confirmedAnswers[qId] == true;
    final selectedAns = _userAnswers[qId];

    final correctCount = _quizQuestions.where((q) => _userAnswers[q['id']] == q['answer']).length;
    final answeredCount = _quizQuestions.where((q) => _userAnswers[q['id']] != null).length;
    final progress = (_currentIdx + 1) / _quizQuestions.length;

    final topicName = _selectedTopic == 'mixed_test'
        ? 'Mixed Reasoning Test'
        : _topics.firstWhere((t) => t.id == _selectedTopic, orElse: () => _topics.first).name;

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 80),
      children: [
        // Header info: Mode & Progress
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              topicName,
              style: const TextStyle(fontFamily: 'Outfit', fontSize: 14, fontWeight: FontWeight.bold),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                _mode == 'practice' ? 'Practice Mode' : 'Test Mode',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),

        // Counter & Score
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Question ${_currentIdx + 1} of ${_quizQuestions.length}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey),
            ),
            Text(
              'Score: $correctCount/$answeredCount',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: theme.colorScheme.primary),
            ),
          ],
        ),
        const SizedBox(height: 6),

        // Progress Indicator
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

              // Question Text
              Text(
                'Q${_currentIdx + 1}. $questionText',
                style: const TextStyle(fontFamily: 'Outfit', fontSize: 14, fontWeight: FontWeight.bold, height: 1.45),
              ),
              const SizedBox(height: 16),

              // Options
              ...options.map((opt) {
                final isSelected = selectedAns == opt;
                final isCorrectVal = opt.trim() == correctAnswer.trim();

                Color optBg = Colors.white.withOpacity(0.02);
                Color optBorder = CareerPathApp.getBorderColor(context);
                Color optText = Colors.white;

                if (_mode == 'practice') {
                  if (isSelected) {
                    if (isCorrectVal) {
                      optBg = const Color(0x2610B981);
                      optBorder = const Color(0xFF10B981);
                      optText = const Color(0xFF10B981);
                    } else {
                      optBg = const Color(0x26EF4444);
                      optBorder = const Color(0xFFEF4444);
                      optText = const Color(0xFFEF4444);
                    }
                  } else if (isConfirmed && isCorrectVal) {
                    optBg = const Color(0x1A10B981);
                    optBorder = const Color(0xFF10B981);
                    optText = const Color(0xFF10B981);
                  }
                } else {
                  // Test mode
                  if (isSelected) {
                    optBg = theme.colorScheme.primary.withOpacity(0.15);
                    optBorder = theme.colorScheme.primary;
                    optText = theme.colorScheme.primary;
                  }
                }

                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: InkWell(
                    onTap: () => _selectOption(qId, opt),
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
                          if (_mode == 'practice' && isSelected)
                            Text(isCorrectVal ? '✅' : '❌', style: const TextStyle(fontSize: 16)),
                        ],
                      ),
                    ),
                  ),
                );
              }),

              // Worked Solution Box (Practice Mode only when answered)
              if (_mode == 'practice' && isConfirmed) ...[
                const Divider(height: 24, thickness: 1),
                const Text('✍️ Worked Solution:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.amber)),
                const SizedBox(height: 4),
                Text(
                  explanation,
                  style: const TextStyle(fontSize: 11, color: Colors.grey, height: 1.45),
                ),
                if (shortcut.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
                    ),
                    child: Text(
                      '💡 Shortcut: $shortcut',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                    ),
                  ),
                ],
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Navigation Controls
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: _currentIdx > 0
                    ? () {
                        final state = CareerPathApp.of(context);
                        SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                        setState(() => _currentIdx--);
                      }
                    : null,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('← Previous', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  final state = CareerPathApp.of(context);
                  SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

                  if (_currentIdx < _quizQuestions.length - 1) {
                    setState(() => _currentIdx++);
                  } else {
                    if (_mode == 'test') {
                      _submitTest();
                    } else {
                      _exitSession();
                    }
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text(
                  _currentIdx < _quizQuestions.length - 1
                      ? 'Next →'
                      : _mode == 'test'
                          ? 'Finish Test 🏁'
                          : 'Complete 🎉',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ─── 3. RESULTS & REVIEW SOLUTIONS VIEW ──────────────────────────
  Widget _buildResultsReviewView(ThemeData theme) {
    final total = _quizQuestions.length;
    final correctCount = _quizQuestions.where((q) => _userAnswers[q['id']] == q['answer']).length;
    final incorrectCount = total - correctCount;
    final accuracyPercent = total > 0 ? ((correctCount / total) * 100).round() : 0;
    final isReviewMode = (_mode == 'review');

    final topicName = _selectedTopic == 'mixed_test' || _mode == 'test'
        ? 'Mixed Reasoning Test'
        : _topics.firstWhere((t) => t.id == _selectedTopic, orElse: () => _topics.first).name;

    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 80),
      children: [
        // Summary Card
        Container(
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            color: CareerPathApp.getCardBg(context),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: CareerPathApp.getBorderColor(context)),
          ),
          child: Column(
            children: [
              Text(accuracyPercent >= 80 ? '🏆' : accuracyPercent >= 50 ? '👏' : '📚', style: const TextStyle(fontSize: 48)),
              const SizedBox(height: 8),
              Text(
                'Results: $topicName',
                style: const TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 14),

              // Big Score fraction
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(
                    '$correctCount',
                    style: TextStyle(fontFamily: 'Outfit', fontSize: 44, fontWeight: FontWeight.w900, color: theme.colorScheme.primary),
                  ),
                  const Text(' / ', style: TextStyle(fontSize: 22, color: Colors.grey)),
                  Text('$total', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                ],
              ),
              const Text('Score', style: TextStyle(fontSize: 11, color: Colors.grey)),
              const SizedBox(height: 18),

              // Stats Grid (Accuracy, Time Taken, Incorrect)
              Row(
                children: [
                  _buildStatBox(theme, '$accuracyPercent%', 'Accuracy'),
                  const SizedBox(width: 8),
                  _buildStatBox(theme, isReviewMode ? '—' : _formatTime(_timeTaken), 'Time Taken'),
                  const SizedBox(width: 8),
                  _buildStatBox(theme, '$incorrectCount', 'Incorrect'),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Review Header
        const Text(
          'Question Review & Detailed Solutions',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 15, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),

        // Review List
        ..._quizQuestions.asMap().entries.map((entry) {
          final idx = entry.key;
          final q = entry.value;
          final selected = _userAnswers[q['id']];
          final correctAnswer = (q['answer'] ?? '').toString();
          final isCorrect = selected != null && selected.trim() == correctAnswer.trim();
          final isSkipped = selected == null || selected == 'Skipped';

          final questionText = (q['q'] ?? q['question'] ?? '').toString();
          final options = (q['options'] as List?)?.map((o) => o.toString()).toList() ?? [];
          final explanation = (q['explanation'] ?? '').toString();
          final shortcut = (q['shortcut'] ?? '').toString();

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Status Badge
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: isSkipped
                            ? Colors.amber.withOpacity(0.15)
                            : isCorrect
                                ? const Color(0x2610B981)
                                : const Color(0x26EF4444),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(
                          color: isSkipped
                              ? Colors.amber
                              : isCorrect
                                  ? const Color(0xFF10B981)
                                  : const Color(0xFFEF4444),
                        ),
                      ),
                      child: Text(
                        isSkipped ? '⚠️ SKIPPED' : isCorrect ? '✅ CORRECT' : '❌ INCORRECT',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: isSkipped
                              ? Colors.amber
                              : isCorrect
                                  ? const Color(0xFF10B981)
                                  : const Color(0xFFEF4444),
                        ),
                      ),
                    ),
                    if (q['company'] != null && q['company'].toString().isNotEmpty)
                      Text('🏢 ${q['company']}', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
                const SizedBox(height: 8),

                // Question Prompt
                Text('Q${idx + 1}. $questionText', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, height: 1.4)),
                const SizedBox(height: 12),

                // Options list in review
                ...options.map((opt) {
                  final isUserSelected = selected == opt;
                  final isCorrectOpt = opt.trim() == correctAnswer.trim();

                  Color bg = Colors.white.withOpacity(0.01);
                  Color border = CareerPathApp.getBorderColor(context);
                  Color text = Colors.grey.shade400;

                  if (isUserSelected) {
                    border = isCorrectOpt ? const Color(0xFF10B981) : const Color(0xFFEF4444);
                    bg = isCorrectOpt ? const Color(0x1A10B981) : const Color(0x1AEF4444);
                    text = isCorrectOpt ? const Color(0xFF10B981) : const Color(0xFFEF4444);
                  } else if (isCorrectOpt) {
                    border = const Color(0xFF10B981);
                    bg = const Color(0x0D10B981);
                    text = const Color(0xFF10B981);
                  }

                  return Container(
                    margin: const EdgeInsets.only(bottom: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: bg,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: border),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(child: Text(opt, style: TextStyle(fontSize: 12, color: text, fontWeight: (isUserSelected || isCorrectOpt) ? FontWeight.bold : FontWeight.normal))),
                        if (isUserSelected)
                          Text(isCorrectOpt ? 'Your Answer - Correct' : 'Your Answer - Incorrect', style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold))
                        else if (isCorrectOpt)
                          const Text('Correct Answer', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                      ],
                    ),
                  );
                }),
                const SizedBox(height: 8),

                // Summary Row
                Row(
                  children: [
                    const Text('Selected: ', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    Text(
                      selected ?? 'None (Skipped)',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isCorrect ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                      ),
                    ),
                    if (!isCorrect) ...[
                      const Text('  |  Correct: ', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      Text(correctAnswer, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                    ],
                  ],
                ),
                const SizedBox(height: 10),

                // Worked Solution Box
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.03),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Worked Solution:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.amber)),
                      const SizedBox(height: 4),
                      Text(explanation, style: const TextStyle(fontSize: 10, color: Colors.grey, height: 1.4)),
                      if (shortcut.isNotEmpty) ...[
                        const SizedBox(height: 6),
                        Text('💡 Shortcut/Tip: $shortcut', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          );
        }),
        const SizedBox(height: 16),

        // Action Buttons
        Row(
          children: [
            if (!isReviewMode) ...[
              Expanded(
                child: ElevatedButton(
                  onPressed: () => _startSession(_selectedTopic!),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Retry Practice', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                ),
              ),
              const SizedBox(width: 10),
            ],
            Expanded(
              child: OutlinedButton(
                onPressed: _exitSession,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Back to Selection', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatBox(ThemeData theme, String val, String lbl) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.03),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withOpacity(0.06)),
        ),
        child: Column(
          children: [
            Text(val, style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 2),
            Text(lbl, style: const TextStyle(fontSize: 10, color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
