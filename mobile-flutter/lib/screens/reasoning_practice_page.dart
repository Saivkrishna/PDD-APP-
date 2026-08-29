import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class ReasoningPracticePage extends StatefulWidget {
  const ReasoningPracticePage({super.key});

  @override
  State<ReasoningPracticePage> createState() => _ReasoningPracticePageState();
}

class _ReasoningPracticePageState extends State<ReasoningPracticePage> {
  List<dynamic> _questions = [];
  bool _loading = false;
  int _currentIdx = 0;
  String? _selectedOption;
  bool _showExplanation = false;
  String _mode = 'practice'; // 'practice' | 'test'
  
  final List<String> _topics = ['Syllogism', 'Blood Relations', 'Coding-Decoding', 'Seating Arrangement'];
  String _selectedTopic = 'Syllogism';

  void _loadQuiz() async {
    setState(() {
      _loading = true;
      _questions = [];
      _currentIdx = 0;
      _selectedOption = null;
      _showExplanation = false;
    });
    try {
      final res = await ApiService.getReasoningQuiz();
      // Filter questions matching the selected topic
      final List<dynamic> allQuestions = res['questions'] ?? [];
      final filtered = allQuestions.where((q) => q['topic'] == _selectedTopic).toList();
      setState(() {
        _questions = filtered.isNotEmpty ? filtered : allQuestions.take(5).toList();
        _loading = false;
      });
    } catch (_) {
      // Mock Fallback
      setState(() {
        _questions = [
          {
            "id": "r1",
            "topic": "Syllogism",
            "question": "Statements:\nSome papers are pens.\nAll pens are pencils.\nConclusions:\nI. Some papers are pencils.\nII. Some pencils are pens.",
            "options": ["Only conclusion I follows", "Only conclusion II follows", "Both I and II follow", "Neither I nor II follows"],
            "answer": "Both I and II follow",
            "explanation": "Since some papers are pens, and all pens are pencils, papers must intersect pencils. So conclusion I follows. Pencils also must intersect pens since all pens are pencils, hence II follows."
          },
          {
            "id": "r2",
            "topic": "Blood Relations",
            "question": "Pointing to a photograph, a man said: 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
            "options": ["His own", "His son's", "His father's", "His nephew's"],
            "answer": "His son's",
            "explanation": "Since the speaker has no brother or sister, 'my father's son' is himself. The statement says 'that man's father is myself'. Therefore, the photograph is of his son."
          }
        ];
        _loading = false;
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

    final isCorrect = option == _questions[_currentIdx]['answer'];
    if (isCorrect) {
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
        title: const Text('Reasoning practice', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
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
        child: _questions.isEmpty
            ? _buildTopicSelector()
            : _loading
                ? const Center(child: CircularProgressIndicator())
                : _buildActiveQuiz(),
      ),
    );
  }

  Widget _buildTopicSelector() {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Select Reasoning Topic',
            style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 25),
          ..._topics.map((topic) => Card(
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(
                color: _selectedTopic == topic ? theme.colorScheme.primary : Colors.transparent,
                width: 1.5,
              ),
            ),
            child: ListTile(
              title: Text(topic, style: const TextStyle(fontWeight: FontWeight.bold)),
              trailing: _selectedTopic == topic ? Icon(Icons.check_circle, color: theme.colorScheme.primary) : null,
              onTap: () {
                final state = CareerPathApp.of(context);
                SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                setState(() {
                  _selectedTopic = topic;
                });
              },
            ),
          )).toList(),
          const SizedBox(height: 30),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
            ),
            onPressed: _loadQuiz,
            child: const Text('LAUNCH PRACTICE SET', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveQuiz() {
    final theme = Theme.of(context);
    if (_currentIdx >= _questions.length) {
      return Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('🎉', style: TextStyle(fontSize: 60)),
            const SizedBox(height: 15),
            const Text('Reasoning Set Completed!', style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 25),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _questions = [];
                });
              },
              child: const Text('Select another topic'),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Topic: $_selectedTopic', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blueAccent)),
              Text('Question ${_currentIdx + 1}/${_questions.length}'),
            ],
          ),
          const SizedBox(height: 15),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(18.0),
              child: Text(
                q['question'] ?? '',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, height: 1.4),
              ),
            ),
          ),
          const SizedBox(height: 15),
          
          // Options list
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
                title: Text(opt, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
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
              child: Text(_currentIdx == _questions.length - 1 ? 'Finish Set' : 'Next Question'),
            ),
          ],
        ],
      ),
    );
  }
}
