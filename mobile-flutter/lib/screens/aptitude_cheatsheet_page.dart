import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class AptitudeCheatsheetPage extends StatefulWidget {
  final bool isModal;

  const AptitudeCheatsheetPage({super.key, this.isModal = false});

  @override
  State<AptitudeCheatsheetPage> createState() => _AptitudeCheatsheetPageState();
}

class _AptitudeCheatsheetPageState extends State<AptitudeCheatsheetPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedTopic = 'lcm-hcf';
  String _selectedDifficulty = 'all';
  List<dynamic> _questions = [];
  bool _loadingQuiz = false;
  int _currentIdx = 0;
  String? _selectedOption;
  bool _showExplanation = false;

  final Map<String, Map<String, dynamic>> _cheatsheetData = {
    'lcm-hcf': {
      'title': 'HCF & LCM Rules',
      'icon': '📊',
      'formulas': [
        'HCF(a, b) × LCM(a, b) = a × b (Product of two numbers)',
        'HCF of Fractions = (HCF of Numerators) ÷ (LCM of Denominators)',
        'LCM of Fractions = (LCM of Numerators) ÷ (HCF of Denominators)',
        'Co-prime split: If N = p1^a * p2^b, co-prime divisions = 2^(n-1) ways.'
      ]
    },
    'ages': {
      'title': 'Ages Shift Calculations',
      'icon': '⏱️',
      'formulas': [
        'If present age is x, age n years ago = x - n, age n years hence = x + n.',
        'If present ratio is a:b, take ages as ak and bk. Form equation for shift after t years: (ak + t) / (bk + t) = c/d.',
        'Average age of n people replaced by another with difference d: New = Old ± (n × d).'
      ]
    },
    'mensuration': {
      'title': 'Mensuration & Geometry',
      'icon': '📐',
      'formulas': [
        'Area of Circle = πr², Perimeter = 2πr.',
        'Area of Triangle = 0.5 × Base × Height or Herons formula.',
        'Volume of Cylinder = πr²h, Total Surface Area = 2πr(r + h).',
        'Crossing Center Paths Area = Lw + Bw - w² (w = path width).'
      ]
    }
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _startQuiz() async {
    setState(() {
      _loadingQuiz = true;
      _questions = [];
      _currentIdx = 0;
      _selectedOption = null;
      _showExplanation = false;
    });
    try {
      final res = await ApiService.getAptitudeQuestions(_selectedTopic, _selectedDifficulty);
      setState(() {
        _questions = res;
        _loadingQuiz = false;
      });
    } catch (_) {
      // Mock Fallback Questions
      setState(() {
        _questions = [
          {
            "id": "q1",
            "topic": "lcm-hcf",
            "difficulty": "easy",
            "question": "Find the HCF of 12 and 18.",
            "options": ["2", "3", "6", "9"],
            "answer": "6",
            "explanation": "Factors of 12: 1, 2, 3, 4, 6, 12. Factors of 18: 1, 2, 3, 6, 9, 18. Common factors: 1, 2, 3, 6. The highest is 6."
          },
          {
            "id": "q2",
            "topic": "lcm-hcf",
            "difficulty": "medium",
            "question": "The product of two co-prime numbers is 117. Their LCM should be:",
            "options": ["1", "9", "13", "117"],
            "answer": "117",
            "explanation": "Since the numbers are co-prime, their HCF is 1. We know: HCF × LCM = Product. So LCM = Product = 117."
          }
        ];
        _loadingQuiz = false;
      });
    }
  }

  void _submitAnswer(String option) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    
    setState(() {
      _selectedOption = option;
      _showExplanation = true;
    });

    final currentQuestion = _questions[_currentIdx];
    if (option == currentQuestion['answer']) {
      SoundManager.playSuccess(state?.soundEnabled ?? true);
    } else {
      SoundManager.playError(state?.soundEnabled ?? true);
    }
  }

  void _nextQuestion() {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    setState(() {
      _currentIdx++;
      _selectedOption = null;
      _showExplanation = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Aptitude Practice', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
            Tab(text: 'Study Cheatsheet'),
            Tab(text: 'Practice Quizzes'),
          ],
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: theme.brightness == Brightness.dark
                ? [const Color(0xFF0F0826), const Color(0xFF06020F)]
                : [const Color(0xFFEBE9FF), const Color(0xFFF8F9FA)],
          ),
        ),
        child: TabBarView(
          controller: _tabController,
          children: [
            // Tab 1: Study Cheatsheet
            ListView(
              padding: const EdgeInsets.all(16),
              children: _cheatsheetData.entries.map((entry) {
                final topic = entry.value;
                final List<dynamic> formulas = topic['formulas'];
                return Card(
                  margin: const EdgeInsets.only(bottom: 15),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(topic['icon'] ?? '✏️', style: const TextStyle(fontSize: 24)),
                            const SizedBox(width: 10),
                            Text(topic['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Divider(),
                        const SizedBox(height: 8),
                        ...formulas.map((f) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4.0),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('• ', style: TextStyle(color: theme.colorScheme.primary, fontSize: 16, fontWeight: FontWeight.bold)),
                              Expanded(child: Text(f, style: const TextStyle(fontSize: 13, height: 1.4))),
                            ],
                          ),
                        )).toList(),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
            
            // Tab 2: Practice Quizzes
            _questions.isEmpty
                ? _buildQuizSelector()
                : _loadingQuiz
                    ? const Center(child: CircularProgressIndicator())
                    : _buildQuizActive(),
          ],
        ),
      ),
    );
  }

  Widget _buildQuizSelector() {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Select Quiz Parameters',
            style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          DropdownButtonFormField<String>(
            value: _selectedTopic,
            decoration: const InputDecoration(labelText: 'Topic'),
            items: const [
              DropdownMenuItem(value: 'lcm-hcf', child: Text('HCF & LCM')),
              DropdownMenuItem(value: 'ages', child: Text('Ages Shift')),
              DropdownMenuItem(value: 'mensuration', child: Text('Mensuration & Geometry')),
            ],
            onChanged: (val) {
              if (val != null) setState(() => _selectedTopic = val);
            },
          ),
          const SizedBox(height: 15),
          DropdownButtonFormField<String>(
            value: _selectedDifficulty,
            decoration: const InputDecoration(labelText: 'Difficulty'),
            items: const [
              DropdownMenuItem(value: 'all', child: Text('All Difficulties')),
              DropdownMenuItem(value: 'easy', child: Text('Easy')),
              DropdownMenuItem(value: 'medium', child: Text('Medium')),
              DropdownMenuItem(value: 'hard', child: Text('Hard')),
            ],
            onChanged: (val) {
              if (val != null) setState(() => _selectedDifficulty = val);
            },
          ),
          const SizedBox(height: 30),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
            ),
            onPressed: _startQuiz,
            child: const Text('START PRACTICE QUIZ', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildQuizActive() {
    final theme = Theme.of(context);
    if (_currentIdx >= _questions.length) {
      return Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('🏆', style: TextStyle(fontSize: 60)),
            const SizedBox(height: 15),
            const Text('Practice Set Completed!', style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 25),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _questions = [];
                });
              },
              child: const Text('Back to Setup'),
            ),
          ],
        ),
      );
    }

    final q = _questions[_currentIdx];
    final List<dynamic> options = q['options'] ?? [];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Question Header
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Text('Question ${_currentIdx + 1}/${_questions.length}', style: const TextStyle(fontWeight: FontWeight.bold)),
              Chip(label: Text(q['difficulty']?.toString().toUpperCase() ?? '')),
            ],
          ),
          const SizedBox(height: 15),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(18.0),
              child: Text(q['question'] ?? '', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, height: 1.4)),
            ),
          ),
          const SizedBox(height: 15),
          
          // Options
          ...options.map((opt) {
            final isSelected = _selectedOption == opt;
            final isCorrect = opt == q['answer'];
            Color cardColor = theme.cardColor;
            
            if (_selectedOption != null) {
              if (isCorrect) {
                cardColor = Colors.green.withOpacity(0.15);
              } else if (isSelected) {
                cardColor = Colors.red.withOpacity(0.15);
              }
            }

            return Card(
              color: cardColor,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: BorderSide(
                  color: isSelected ? theme.colorScheme.primary : Colors.transparent,
                  width: 1.5,
                ),
              ),
              child: ListTile(
                title: Text(opt, style: const TextStyle(fontSize: 14)),
                onTap: _selectedOption != null ? null : () => _submitAnswer(opt),
              ),
            );
          }).toList(),
          
          // Explanation
          if (_showExplanation) ...[
            const SizedBox(height: 20),
            Card(
              color: Colors.blue.withOpacity(0.08),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('💡 Explanation:', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blueAccent)),
                    const SizedBox(height: 8),
                    Text(q['explanation'] ?? '', style: const TextStyle(fontSize: 13, height: 1.4)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 15),
            ElevatedButton(
              onPressed: _nextQuestion,
              child: Text(_currentIdx == _questions.length - 1 ? 'Finish Quiz' : 'Next Question'),
            ),
          ],
        ],
      ),
    );
  }
}
