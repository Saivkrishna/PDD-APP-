import 'dart:async';
import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class ReasoningPracticePage extends StatefulWidget {
  final bool isModal;

  const ReasoningPracticePage({super.key, this.isModal = false});

  @override
  State<ReasoningPracticePage> createState() => _ReasoningPracticePageState();
}

class _ReasoningPracticePageState extends State<ReasoningPracticePage> {
  // Mode: 'home' | 'practice' | 'test' | 'test_score' | 'review'
  String _viewState = 'home';
  String _mode = 'practice'; // 'practice' | 'test'

  // Topic selection
  String _selectedTopic = 'syllogism';
  String _selectedDifficulty = 'all';

  // Active Quiz State
  List<dynamic> _questions = [];
  bool _loading = false;
  int _currentIdx = 0;
  String? _selectedOption;
  bool _showExplanation = false;
  int _score = 0;
  final Map<int, String> _userAnswers = {};

  // Mock Test State
  Timer? _timer;
  int _secondsRemaining = 25 * 60; // 25 minutes for 30 questions
  int _timeSpentSeconds = 0;

  static const List<Map<String, String>> topics = [
    {'id': 'syllogism', 'title': 'Syllogism (All/Some/No)', 'icon': '🧠'},
    {'id': 'blood-relations', 'title': 'Blood Relations', 'icon': '👨‍👩‍👧'},
    {'id': 'coding-decoding', 'title': 'Coding & Decoding', 'icon': '🔐'},
    {'id': 'series', 'title': 'Number & Alphabet Series', 'icon': '🔢'},
    {'id': 'seating-arrangement', 'title': 'Seating Arrangement', 'icon': '🪑'},
    {'id': 'direction-sense', 'title': 'Direction Sense Test', 'icon': '🧭'},
    {'id': 'clocks-calendars', 'title': 'Clocks & Calendars', 'icon': '⏰'},
    {'id': 'analogy', 'title': 'Analogy & Classification', 'icon': '🔄'},
    {'id': 'venn-diagrams', 'title': 'Venn Diagrams', 'icon': '⭕'},
    {'id': 'statements-assumptions', 'title': 'Statements & Assumptions', 'icon': '💭'},
  ];

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startPractice(String topic, String difficulty) async {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    setState(() {
      _selectedTopic = topic;
      _selectedDifficulty = difficulty;
      _mode = 'practice';
      _loading = true;
      _viewState = 'practice';
      _currentIdx = 0;
      _score = 0;
      _userAnswers.clear();
      _selectedOption = null;
      _showExplanation = false;
    });

    try {
      final res = await ApiService.getReasoningQuiz(
        topic: topic,
        difficulty: difficulty == 'all' ? null : difficulty,
      );

      if (mounted) {
        setState(() {
          _questions = res.isNotEmpty ? res : _getFallbackQuestions(topic);
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _questions = _getFallbackQuestions(topic);
          _loading = false;
        });
      }
    }
  }

  void _startMockTest() async {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    setState(() {
      _mode = 'test';
      _loading = true;
      _viewState = 'test';
      _currentIdx = 0;
      _score = 0;
      _userAnswers.clear();
      _selectedOption = null;
      _secondsRemaining = 25 * 60;
      _timeSpentSeconds = 0;
    });

    try {
      final res = await ApiService.getReasoningQuiz(testMode: true);
      if (mounted) {
        setState(() {
          _questions = res.isNotEmpty ? res : _getFallbackQuestions('syllogism');
          _loading = false;
        });
        _startTimer();
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _questions = _getFallbackQuestions('syllogism');
          _loading = false;
        });
        _startTimer();
      }
    }
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 0) {
        setState(() {
          _secondsRemaining--;
          _timeSpentSeconds++;
        });
      } else {
        _timer?.cancel();
        _finishTest();
      }
    });
  }

  void _onAnswerPractice(String opt) {
    if (_showExplanation) return;
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    final currentQ = _questions[_currentIdx];
    final isCorrect = opt == (currentQ['answer'] ?? currentQ['ans']);

    setState(() {
      _selectedOption = opt;
      _userAnswers[_currentIdx] = opt;
      _showExplanation = true;
      if (isCorrect) _score++;
    });

    if (isCorrect) {
      SoundManager.playSuccess(state?.soundEnabled ?? true);
    } else {
      SoundManager.playError(state?.soundEnabled ?? true);
    }
  }

  void _onAnswerTest(String opt) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    setState(() {
      _selectedOption = opt;
      _userAnswers[_currentIdx] = opt;
    });
  }

  void _finishTest() {
    _timer?.cancel();
    int score = 0;
    for (int i = 0; i < _questions.length; i++) {
      final q = _questions[i];
      final correct = q['answer'] ?? q['ans'];
      if (_userAnswers[i] == correct) score++;
    }

    setState(() {
      _score = score;
      _viewState = 'test_score';
    });
  }

  List<dynamic> _getFallbackQuestions(String topic) {
    return [
      {
        "id": "r1",
        "topic": topic,
        "difficulty": "medium",
        "question": "Statements: All cars are vehicles. Some vehicles are electric.\nConclusions:\nI. Some cars are electric.\nII. Some vehicles are cars.",
        "options": ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
        "answer": "Only II follows",
        "explanation": "Since all cars are vehicles, the converse 'Some vehicles are cars' is definitely true (II follows). There is no direct relationship established between cars and electric (I does not necessarily follow)."
      },
      {
        "id": "r2",
        "topic": topic,
        "difficulty": "easy",
        "question": "Pointing to a photograph, a man said, 'I have no brother or sister, but that man\\'s father is my father\\'s son.' Whose photograph was it?",
        "options": ["His own", "His son", "His father", "His nephew"],
        "answer": "His son",
        "explanation": "Since the speaker has no siblings, 'my father's son' is the speaker himself. Thus, that man's father is the speaker => the photograph is of his son."
      }
    ];
  }

  String _formatTimer(int seconds) {
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Logical Reasoning', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: widget.isModal || _viewState != 'home'
            ? IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () {
                  if (_viewState != 'home') {
                    if (_mode == 'test' && _viewState == 'test') {
                      _showExitTestDialog();
                    } else {
                      _timer?.cancel();
                      setState(() => _viewState = 'home');
                    }
                  } else if (widget.isModal) {
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
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    switch (_viewState) {
      case 'practice':
        return _buildPracticeScreen();
      case 'test':
        return _buildMockTestScreen();
      case 'test_score':
        return _buildTestScoreScreen();
      case 'review':
        return _buildReviewScreen();
      default:
        return _buildLauncherScreen();
    }
  }

  // ─── 1. LAUNCHER SCREEN ───────────────────────────────────────
  Widget _buildLauncherScreen() {
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Mock Test Banner Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  theme.colorScheme.primary.withOpacity(0.3),
                  theme.colorScheme.secondary.withOpacity(0.15),
                ],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: theme.colorScheme.primary.withOpacity(0.4)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text('⏱️', style: TextStyle(fontSize: 32)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('Timed Mock Test', style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold)),
                          Text('30 Mixed Questions • 25 Minutes', style: TextStyle(fontSize: 12, color: Colors.grey)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Simulate real placement online assessment conditions with 10 Easy, 10 Medium, and 10 Hard reasoning problems.',
                  style: TextStyle(fontSize: 12, height: 1.4, color: Color(0xFFE2E8F0)),
                ),
                const SizedBox(height: 14),
                ElevatedButton(
                  onPressed: _startMockTest,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Start Full Mock Test 🚀', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Practice by topic heading
          const Text('Practice by Topic', style: TextStyle(fontFamily: 'Outfit', fontSize: 17, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),

          ...topics.map((t) {
            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              color: CareerPathApp.getCardBg(context),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
                side: BorderSide(color: CareerPathApp.getBorderColor(context)),
              ),
              child: ListTile(
                leading: Text(t['icon']!, style: const TextStyle(fontSize: 26)),
                title: Text(t['title']!, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 14)),
                trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                onTap: () => _startPractice(t['id']!, 'all'),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  // ─── 2. PRACTICE SCREEN ───────────────────────────────────────
  Widget _buildPracticeScreen() {
    final theme = Theme.of(context);
    final q = _questions[_currentIdx];
    final questionText = q['question'] ?? q['q'] ?? '';
    final options = (q['options'] as List?)?.map((o) => o.toString()).toList() ?? [];
    final correctAnswer = q['answer'] ?? q['ans'] ?? '';
    final explanation = q['explanation'] ?? '';

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Question ${_currentIdx + 1} of ${_questions.length}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.grey)),
              Text('Score: $_score', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(value: (_currentIdx + 1) / _questions.length, color: theme.colorScheme.primary),
          const SizedBox(height: 16),

          // Question Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: Text(questionText, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, height: 1.4)),
          ),
          const SizedBox(height: 16),

          // Options
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
                onTap: () => _onAnswerPractice(opt),
              ),
            );
          }).toList(),

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
                  const Text('🧠 Reasoning Logic:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.cyanAccent)),
                  const SizedBox(height: 6),
                  Text(explanation, style: const TextStyle(fontSize: 12, height: 1.4, color: Color(0xFFE2E8F0))),
                ],
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                if (_currentIdx < _questions.length - 1) {
                  setState(() {
                    _currentIdx++;
                    _selectedOption = _userAnswers[_currentIdx];
                    _showExplanation = _selectedOption != null;
                  });
                } else {
                  setState(() => _viewState = 'test_score');
                }
              },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: Text(
                _currentIdx < _questions.length - 1 ? 'Next Question ➔' : 'Finish Practice 🏆',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ─── 3. MOCK TEST SCREEN ──────────────────────────────────────
  Widget _buildMockTestScreen() {
    final theme = Theme.of(context);
    final q = _questions[_currentIdx];
    final questionText = q['question'] ?? q['q'] ?? '';
    final options = (q['options'] as List?)?.map((o) => o.toString()).toList() ?? [];

    return Column(
      children: [
        // Top Timer Bar & Question Palette Toggle
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.03),
            border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.06))),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '⏱️ Time Left: ${_formatTimer(_secondsRemaining)}',
                style: TextStyle(
                  fontFamily: 'Outfit',
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: _secondsRemaining < 300 ? Colors.redAccent : Colors.amberAccent,
                ),
              ),
              ElevatedButton(
                onPressed: _showSubmitConfirmDialog,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green.withOpacity(0.2),
                  foregroundColor: Colors.greenAccent,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                ),
                child: const Text('Submit Test', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),

        // Horizontal Question Palette
        Container(
          height: 46,
          padding: const EdgeInsets.symmetric(vertical: 6),
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _questions.length,
            itemBuilder: (context, idx) {
              final isCurrent = _currentIdx == idx;
              final isAnswered = _userAnswers.containsKey(idx);
              Color bg = Colors.white.withOpacity(0.06);
              Color textCol = Colors.white70;

              if (isCurrent) {
                bg = theme.colorScheme.primary;
                textCol = Colors.white;
              } else if (isAnswered) {
                bg = Colors.greenAccent.withOpacity(0.2);
                textCol = Colors.greenAccent;
              }

              return Container(
                margin: const EdgeInsets.only(right: 6),
                child: InkWell(
                  onTap: () {
                    setState(() {
                      _currentIdx = idx;
                      _selectedOption = _userAnswers[idx];
                    });
                  },
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    width: 34,
                    height: 34,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: bg,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text('${idx + 1}', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textCol)),
                  ),
                ),
              );
            },
          ),
        ),

        // Active Question
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: CareerPathApp.getCardBg(context),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: CareerPathApp.getBorderColor(context)),
                  ),
                  child: Text(questionText, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, height: 1.4)),
                ),
                const SizedBox(height: 16),

                ...options.map((opt) {
                  final isSelected = _selectedOption == opt;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    decoration: BoxDecoration(
                      color: isSelected ? theme.colorScheme.primary.withOpacity(0.2) : CareerPathApp.getCardBg(context),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: isSelected ? theme.colorScheme.primary : CareerPathApp.getBorderColor(context)),
                    ),
                    child: ListTile(
                      title: Text(opt, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                      leading: Radio<String>(
                        value: opt,
                        groupValue: _selectedOption,
                        onChanged: (val) {
                          if (val != null) _onAnswerTest(val);
                        },
                      ),
                      onTap: () => _onAnswerTest(opt),
                    ),
                  );
                }).toList(),

                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (_currentIdx > 0)
                      OutlinedButton(
                        onPressed: () {
                          setState(() {
                            _currentIdx--;
                            _selectedOption = _userAnswers[_currentIdx];
                          });
                        },
                        child: const Text('← Previous'),
                      )
                    else
                      const SizedBox(),
                    if (_currentIdx < _questions.length - 1)
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _currentIdx++;
                            _selectedOption = _userAnswers[_currentIdx];
                          });
                        },
                        child: const Text('Next →'),
                      )
                    else
                      ElevatedButton(
                        onPressed: _showSubmitConfirmDialog,
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                        child: const Text('Submit Test 🏁'),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ─── 4. SCORECARD SCREEN ──────────────────────────────────────
  Widget _buildTestScoreScreen() {
    final theme = Theme.of(context);
    final total = _questions.length;
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
              const Text('🎯', style: TextStyle(fontSize: 60)),
              const SizedBox(height: 10),
              const Text('Test Completed!', style: TextStyle(fontFamily: 'Outfit', fontSize: 22, fontWeight: FontWeight.bold)),
              const SizedBox(height: 14),
              Text(
                '$_score / $total',
                style: const TextStyle(fontFamily: 'Outfit', fontSize: 36, fontWeight: FontWeight.w900, color: Colors.greenAccent),
              ),
              Text(
                '$pct% Accuracy • Time Taken: ${_formatTimer(_timeSpentSeconds)}',
                style: const TextStyle(fontSize: 13, color: Colors.grey),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  OutlinedButton.icon(
                    icon: const Icon(Icons.menu_book),
                    label: const Text('Review Answers'),
                    onPressed: () {
                      setState(() {
                        _currentIdx = 0;
                        _viewState = 'review';
                      });
                    },
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton.icon(
                    icon: const Icon(Icons.refresh),
                    label: const Text('New Test'),
                    onPressed: () {
                      setState(() => _viewState = 'home');
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── 5. REVIEW SCREEN ─────────────────────────────────────────
  Widget _buildReviewScreen() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _questions.length,
      itemBuilder: (context, idx) {
        final q = _questions[idx];
        final userAns = _userAnswers[idx];
        final correctAns = q['answer'] ?? q['ans'];
        final isCorrect = userAns == correctAns;

        return Card(
          margin: const EdgeInsets.only(bottom: 14),
          color: CareerPathApp.getCardBg(context),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(
              color: isCorrect ? Colors.greenAccent.withOpacity(0.3) : Colors.redAccent.withOpacity(0.3),
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Question ${idx + 1}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: isCorrect ? Colors.greenAccent.withOpacity(0.12) : Colors.redAccent.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        isCorrect ? '✅ Correct' : userAns == null ? '⚪ Skipped' : '❌ Incorrect',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isCorrect ? Colors.greenAccent : Colors.redAccent),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(q['question'] ?? q['q'] ?? '', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                const SizedBox(height: 10),
                if (userAns != null && !isCorrect)
                  Text('Your Answer: $userAns', style: const TextStyle(color: Colors.redAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                Text('Correct Answer: $correctAns', style: const TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                if (q['explanation'] != null) ...[
                  const SizedBox(height: 8),
                  Text('Explanation: ${q['explanation']}', style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  void _showSubmitConfirmDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Submit Mock Test?'),
        content: Text('You have answered ${_userAnswers.length} of ${_questions.length} questions. Are you sure you want to finish?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Continue Test')),
          ElevatedButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              _finishTest();
            },
            child: const Text('Submit Now'),
          ),
        ],
      ),
    );
  }

  void _showExitTestDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Quit Mock Test?'),
        content: const Text('If you leave now, your current test progress will be lost.'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('Resume Test')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              _timer?.cancel();
              Navigator.of(ctx).pop();
              setState(() => _viewState = 'home');
            },
            child: const Text('Quit'),
          ),
        ],
      ),
    );
  }
}
