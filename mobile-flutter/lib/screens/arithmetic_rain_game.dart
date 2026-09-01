import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class ArithmeticRainGame extends StatefulWidget {
  const ArithmeticRainGame({super.key});

  @override
  State<ArithmeticRainGame> createState() => _ArithmeticRainGameState();
}

class _ArithmeticRainGameState extends State<ArithmeticRainGame> with SingleTickerProviderStateMixin {
  String _view = 'menu'; // 'menu' | 'playing' | 'results'
  String _mode = 'classic'; // 'practice' | 'classic' | 'timed' | 'endless' | 'daily'

  int _score = 0;
  int _lives = 3;
  int _combo = 0;
  int _maxCombo = 0;
  int _totalSolved = 0;
  int _totalWrong = 0;

  String _expression = '';
  int _correctAnswer = 0;
  List<int> _options = [];
  
  Timer? _sessionTimer;
  Timer? _questionProgressTimer;
  int _sessionTimeLeft = 45; // 45s standard session
  double _questionProgress = 1.0;

  int _highScore = 0;

  @override
  void initState() {
    super.initState();
    _loadHighScore();
  }

  @override
  void dispose() {
    _sessionTimer?.cancel();
    _questionProgressTimer?.cancel();
    super.dispose();
  }

  void _loadHighScore() async {
    final state = CareerPathApp.of(context);
    final user = state?.user;
    if (user != null) {
      final userId = user['id']?.toString() ?? 'demo';
      final data = await ApiService.getArithmeticRainUserData(userId);
      if (mounted && data['statistics'] != null) {
        final stats = data['statistics'];
        setState(() {
          _highScore = stats['highestScoreClassic'] ?? 0;
        });
      }
    }
  }

  void _startGame(String selectedMode) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    setState(() {
      _mode = selectedMode;
      _score = 0;
      _lives = selectedMode == 'endless' ? 1 : 3;
      _combo = 0;
      _maxCombo = 0;
      _totalSolved = 0;
      _totalWrong = 0;
      _sessionTimeLeft = selectedMode == 'timed' ? 60 : 45;
      _view = 'playing';
    });

    _generateQuestion();

    // Session timer
    _sessionTimer?.cancel();
    _sessionTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return;
      if (_sessionTimeLeft <= 1) {
        timer.cancel();
        _endGame();
      } else {
        setState(() {
          _sessionTimeLeft--;
        });
      }
    });

    _startQuestionCountdown();
  }

  void _startQuestionCountdown() {
    _questionProgressTimer?.cancel();
    _questionProgress = 1.0;
    
    // Decrement progress bar taking ~4 seconds per question
    final stepMs = 50;
    final totalSteps = 4000 / stepMs;
    final decrement = 1.0 / totalSteps;

    _questionProgressTimer = Timer.periodic(Duration(milliseconds: stepMs), (timer) {
      if (!mounted) return;
      if (_questionProgress <= decrement) {
        timer.cancel();
        _onTimeOut();
      } else {
        setState(() {
          _questionProgress -= decrement;
        });
      }
    });
  }

  void _generateQuestion() {
    final rand = Random();
    final operators = ['+', '-', '*', '/'];
    final op = operators[rand.nextInt(operators.length)];

    int num1, num2, answer;
    String text;

    int level = 1;
    if (_score >= 500) {
      level = 4;
    } else if (_score >= 250) {
      level = 3;
    } else if (_score >= 100) {
      level = 2;
    }

    if (op == '+') {
      num1 = level == 1 ? rand.nextInt(15) + 1 : rand.nextInt(50) + 10;
      num2 = level == 1 ? rand.nextInt(15) + 1 : rand.nextInt(40) + 5;
      answer = num1 + num2;
      text = '$num1 + $num2';
    } else if (op == '-') {
      num1 = level == 1 ? rand.nextInt(20) + 5 : rand.nextInt(80) + 20;
      num2 = rand.nextInt(num1 - 1) + 1;
      answer = num1 - num2;
      text = '$num1 - $num2';
    } else if (op == '*') {
      num1 = level == 1 ? rand.nextInt(8) + 2 : rand.nextInt(12) + 3;
      num2 = rand.nextInt(9) + 2;
      answer = num1 * num2;
      text = '$num1 × $num2';
    } else {
      // Division with integer answers
      num2 = rand.nextInt(9) + 2;
      final mult = rand.nextInt(10) + 1;
      num1 = num2 * mult;
      answer = mult;
      text = '$num1 ÷ $num2';
    }

    // Generate distractor choices
    final Set<int> choices = {answer};
    while (choices.length < 4) {
      final offset = rand.nextInt(10) - 5;
      if (offset != 0) {
        choices.add(answer + offset);
      }
    }

    setState(() {
      _expression = text;
      _correctAnswer = answer;
      _options = choices.toList()..shuffle();
    });
  }

  void _onAnswerSelected(int selected) {
    final state = CareerPathApp.of(context);

    if (selected == _correctAnswer) {
      // Correct Answer
      SoundManager.playSuccess(state?.soundEnabled ?? true);
      _totalSolved++;
      _combo++;
      if (_combo > _maxCombo) _maxCombo = _combo;

      final pts = 10 + (_combo ~/ 3) * 5;
      setState(() {
        _score += pts;
      });

      if (_score > _highScore) _highScore = _score;

      _generateQuestion();
      _startQuestionCountdown();
    } else {
      // Incorrect Answer
      SoundManager.playError(state?.soundEnabled ?? true);
      _totalWrong++;
      _combo = 0;

      if (_mode != 'practice') {
        _lives--;
        if (_lives <= 0) {
          _endGame();
          return;
        }
      }

      _generateQuestion();
      _startQuestionCountdown();
    }
  }

  void _onTimeOut() {
    final state = CareerPathApp.of(context);
    SoundManager.playError(state?.soundEnabled ?? true);
    _totalWrong++;
    _combo = 0;

    if (_mode != 'practice') {
      _lives--;
      if (_lives <= 0) {
        _endGame();
        return;
      }
    }

    _generateQuestion();
    _startQuestionCountdown();
  }

  void _endGame() async {
    _sessionTimer?.cancel();
    _questionProgressTimer?.cancel();

    setState(() {
      _view = 'results';
    });

    final state = CareerPathApp.of(context);
    final user = state?.user;
    if (user != null) {
      final userId = user['id']?.toString() ?? 'demo';
      final name = user['name'] ?? 'Anonymous';
      final todayDate = DateTime.now().toIso8601String().split('T')[0];
      final total = _totalSolved + _totalWrong;
      final accuracy = total > 0 ? (_totalSolved / total) * 100 : 0.0;

      if (_mode == 'daily') {
        await ApiService.saveArithmeticRainDailyScore(userId, name, _score, accuracy, 45, todayDate);
      } else {
        await ApiService.saveArithmeticRainUserData(userId, {
          'score': _score,
          'mode': _mode,
          'correct': _totalSolved,
          'wrong': _totalWrong,
          'accuracy': accuracy,
          'combo': _maxCombo
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Arithmetic Rain', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Text(
                '🏆 Best: $_highScore',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.amber),
              ),
            ),
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: CareerPathApp.getGradient(context),
          ),
        ),
        child: _view == 'menu'
            ? _buildMenuView(theme)
            : _view == 'playing'
                ? _buildGameView(theme)
                : _buildResultsView(theme),
      ),
    );
  }

  Widget _buildMenuView(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text('🌧️', style: TextStyle(fontSize: 72), textAlign: TextAlign.center),
          const SizedBox(height: 16),
          const Text(
            'Arithmetic Rain',
            style: TextStyle(fontFamily: 'Outfit', fontSize: 32, fontWeight: FontWeight.w900),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          const Text(
            'Solve falling math equations under time pressure to build rapid calculation speed.',
            style: TextStyle(fontSize: 14, color: Colors.grey),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),

          // Game Mode Selection Cards
          _buildModeButton(theme, 'classic', '⚡ Classic Mode', '45-second timed session with 3 lives'),
          const SizedBox(height: 10),
          _buildModeButton(theme, 'timed', '⏱️ Timed Blitz (60s)', 'Maximum score sprint in 60 seconds'),
          const SizedBox(height: 10),
          _buildModeButton(theme, 'daily', '📅 Daily Challenge', 'Official seeded daily test with global leaderboard'),
          const SizedBox(height: 10),
          _buildModeButton(theme, 'practice', '🌱 Practice Mode', 'Infinite math practice without life limits'),
        ],
      ),
    );
  }

  Widget _buildModeButton(ThemeData theme, String modeKey, String title, String subtitle) {
    return Card(
      color: CareerPathApp.getCardBg(context),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: CareerPathApp.getBorderColor(context)),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => _startGame(modeKey),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 15)),
                    const SizedBox(height: 2),
                    Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGameView(ThemeData theme) {
    return Column(
      children: [
        // Game Bar Header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          color: CareerPathApp.getCardBg(context).withOpacity(0.5),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('SCORE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                  Text('$_score', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                ],
              ),
              if (_combo > 1)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.amber.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.amber),
                  ),
                  child: Text('🔥 ${_combo}x Combo', style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 12)),
                ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text('TIME LEFT', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                  Text('$_sessionTimeLeft s', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.cyanAccent)),
                ],
              ),
            ],
          ),
        ),

        // Question Progress Bar
        LinearProgressIndicator(
          value: _questionProgress,
          backgroundColor: Colors.white10,
          valueColor: const AlwaysStoppedAnimation<Color>(Colors.cyanAccent),
          minHeight: 4,
        ),

        const Spacer(),

        // Falling Equation Display Card
        Container(
          margin: const EdgeInsets.all(24),
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: CareerPathApp.getCardBg(context),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: theme.colorScheme.primary.withOpacity(0.5), width: 2),
            boxShadow: [
              BoxShadow(color: theme.colorScheme.primary.withOpacity(0.2), blurRadius: 20, spreadRadius: 2),
            ],
          ),
          child: Column(
            children: [
              const Text('SOLVE EQUATION', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.0, color: Colors.grey)),
              const SizedBox(height: 12),
              Text(
                _expression,
                style: const TextStyle(fontFamily: 'Outfit', fontSize: 36, fontWeight: FontWeight.w900, letterSpacing: 1),
              ),
            ],
          ),
        ),

        const Spacer(),

        // 4 Choice Option Bubbles Grid
        Padding(
          padding: const EdgeInsets.all(20.0),
          child: GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 2.2,
            children: _options.map((opt) {
              return ElevatedButton(
                onPressed: () => _onAnswerSelected(opt),
                style: ElevatedButton.styleFrom(
                  backgroundColor: CareerPathApp.getCardBg(context),
                  foregroundColor: Colors.white,
                  side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: Text('$opt', style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold)),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  Widget _buildResultsView(ThemeData theme) {
    final total = _totalSolved + _totalWrong;
    final double accuracy = total > 0 ? (_totalSolved / total) * 100 : 0.0;

    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text('🎯', style: TextStyle(fontSize: 64), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          const Text(
            'Session Completed!',
            style: TextStyle(fontFamily: 'Outfit', fontSize: 28, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),

          // Score Summary Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildResultMetric('FINAL SCORE', '$_score', Colors.amber),
                    _buildResultMetric('ACCURACY', '${accuracy.toStringAsFixed(1)}%', Colors.greenAccent),
                  ],
                ),
                const Divider(height: 24, color: Colors.white12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildResultMetric('SOLVED', '$_totalSolved', Colors.white),
                    _buildResultMetric('MAX COMBO', '${_maxCombo}x', Colors.orangeAccent),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          ElevatedButton(
            onPressed: () => _startGame(_mode),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('Play Again 🔄', style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: () => setState(() => _view = 'menu'),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('Back to Menu'),
          ),
        ],
      ),
    );
  }

  Widget _buildResultMetric(String label, String value, Color color) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold, color: color)),
      ],
    );
  }
}
