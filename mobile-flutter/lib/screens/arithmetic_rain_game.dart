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

class _ArithmeticRainGameState extends State<ArithmeticRainGame> {
  String _gameState = 'idle'; // 'idle' | 'playing' | 'gameover'
  int _score = 0;
  int _streak = 0;
  int _correct = 0;
  int _total = 0;
  
  String _expression = '';
  int _correctAnswer = 0;
  List<int> _options = [];
  
  Timer? _gameTimer;
  Timer? _questionTimer;
  int _timeLeft = 45; // 45 seconds total game session
  double _questionProgress = 1.0; // Countdown for the current question

  void _startGame() {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    
    setState(() {
      _score = 0;
      _streak = 0;
      _correct = 0;
      _total = 0;
      _timeLeft = 45;
      _gameState = 'playing';
    });

    _generateQuestion();

    // Start 45 second game session timer
    _gameTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_timeLeft <= 1) {
        timer.cancel();
        _endGame();
      } else {
        setState(() {
          _timeLeft--;
        });
      }
    });

    // Start question countdown progress bar timer
    _startQuestionCountdown();
  }

  void _startQuestionCountdown() {
    _questionTimer?.cancel();
    _questionProgress = 1.0;
    _questionTimer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      if (_questionProgress <= 0.05) {
        timer.cancel();
        // Question timed out
        _answerSelected(-99999);
      } else {
        setState(() {
          _questionProgress -= 0.025; // Takes 4 seconds per question
        });
      }
    });
  }

  void _generateQuestion() {
    final rand = Random();
    final a = rand.nextInt(12) + 3;
    final b = rand.nextInt(10) + 2;
    
    // Choose operators: +, -, *
    final op = rand.nextInt(3);
    if (op == 0) {
      _expression = '$a + $b';
      _correctAnswer = a + b;
    } else if (op == 1) {
      _expression = '$a - $b';
      _correctAnswer = a - b;
    } else {
      _expression = '$a × $b';
      _correctAnswer = a * b;
    }

    // Generate option choices
    final Set<int> choices = {_correctAnswer};
    while (choices.length < 4) {
      final offset = rand.nextInt(8) - 4;
      if (offset != 0) {
        choices.add(_correctAnswer + offset);
      }
    }
    
    setState(() {
      _options = choices.toList()..shuffle();
    });
  }

  void _answerSelected(int option) {
    final state = CareerPathApp.of(context);
    _total++;

    if (option == _correctAnswer) {
      // Correct
      SoundManager.playSuccess(state?.soundEnabled ?? true);
      _correct++;
      _streak++;
      setState(() {
        // Multiplier bonus on streaks
        _score += 10 + (_streak ~/ 3) * 5;
      });
    } else {
      // Incorrect
      SoundManager.playError(state?.soundEnabled ?? true);
      _streak = 0;
    }

    _generateQuestion();
    _startQuestionCountdown();
  }

  void _endGame() async {
    _gameTimer?.cancel();
    _questionTimer?.cancel();
    
    setState(() {
      _gameState = 'gameover';
    });

    final state = CareerPathApp.of(context);
    final user = state?.user;
    final double accuracy = _total > 0 ? (_correct / _total) * 100 : 0.0;

    // Sync score leaderboard with express backend API
    if (user != null) {
      final userId = user['id']?.toString() ?? 'demo';
      final name = user['name'] ?? 'Anonymous';
      final todayDate = DateTime.now().toIso8601String().split('T')[0];
      
      try {
        await ApiService.saveArithmeticRainDailyScore(
          userId,
          name,
          _score,
          accuracy,
          45,
          todayDate,
        );
        print("✅ Daily Score leaderboard synced with backend API");
      } catch (e) {
        print("⚠️ Failed to sync leaderboard score: $e");
      }
    }
  }

  @override
  void dispose() {
    _gameTimer?.cancel();
    _questionTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final double accuracy = _total > 0 ? (_correct / _total) * 100 : 0.0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Arithmetic Rain', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. HUD Stats
              if (_gameState == 'playing') ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildHudItem('Time Left', '$_timeLeft s', Colors.amber),
                    _buildHudItem('Score', '$_score', Colors.green),
                    _buildHudItem('Streak', '$_streak🔥', Colors.orange),
                  ],
                ),
                const SizedBox(height: 25),
                // Current question countdown progress
                LinearProgressIndicator(
                  value: _questionProgress,
                  color: Colors.amber,
                  backgroundColor: Colors.white.withOpacity(0.08),
                  minHeight: 6,
                  borderRadius: BorderRadius.circular(3),
                ),
              ],
              const Spacer(),

              // 2. Play Board
              _gameState == 'idle'
                  ? _buildMenu()
                  : _gameState == 'gameover'
                      ? _buildGameOver(accuracy)
                      : _buildQuizBoard(),
              
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenu() {
    return Column(
      children: [
        const Text('🌧️', style: TextStyle(fontSize: 80)),
        const SizedBox(height: 15),
        const Text(
          'Arithmetic Rain Game',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 22, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 10),
        const Text(
          'Solve as many speed arithmetic expressions as possible in 45 seconds.',
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 40),
        ElevatedButton(
          style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 14)),
          onPressed: _startGame,
          child: const Text('START GAME', style: TextStyle(fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }

  Widget _buildQuizBoard() {
    final theme = Theme.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Expression Display Card
        Card(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 40.0, horizontal: 20.0),
            child: Text(
              _expression,
              style: const TextStyle(fontFamily: 'Outfit', fontSize: 42, fontWeight: FontWeight.w900),
              textAlign: TextAlign.center,
            ),
          ),
        ),
        const SizedBox(height: 30),
        
        // Options Grid Choices
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.6,
          children: _options.map((opt) => ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: theme.cardColor,
              foregroundColor: theme.textTheme.bodyLarge?.color,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 2,
            ),
            onPressed: () => _answerSelected(opt),
            child: Text(
              '$opt',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          )).toList(),
        ),
      ],
    );
  }

  Widget _buildGameOver(double accuracy) {
    return Column(
      children: [
        const Text('🎮', style: TextStyle(fontSize: 80)),
        const SizedBox(height: 15),
        const Text('Time Completed!', style: TextStyle(fontFamily: 'Outfit', fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 15),
        Text('Your final score is: $_score', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text('Accuracy: ${accuracy.toStringAsFixed(1)}%', style: const TextStyle(fontSize: 14, color: Colors.grey)),
        const SizedBox(height: 40),
        ElevatedButton(
          onPressed: _startGame,
          child: const Text('Play Again'),
        ),
      ],
    );
  }

  Widget _buildHudItem(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(fontSize: 14, color: color, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
