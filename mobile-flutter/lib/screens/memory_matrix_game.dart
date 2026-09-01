import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class MemoryMatrixGame extends StatefulWidget {
  const MemoryMatrixGame({super.key});

  @override
  State<MemoryMatrixGame> createState() => _MemoryMatrixGameState();
}

class _MemoryMatrixGameState extends State<MemoryMatrixGame> {
  // Campaign Config for 30 Levels matching Web App source of truth
  static final List<Map<String, dynamic>> _levelConfigs = [
    {"level": 1, "size": 3, "tiles": 2, "displayTime": 2.0, "timeLimit": 45, "lives": 1, "tier": "Heroic"},
    {"level": 2, "size": 3, "tiles": 3, "displayTime": 2.2, "timeLimit": 44, "lives": 1, "tier": "Heroic"},
    {"level": 3, "size": 3, "tiles": 3, "displayTime": 2.3, "timeLimit": 43, "lives": 1, "tier": "Heroic"},
    {"level": 4, "size": 3, "tiles": 4, "displayTime": 2.5, "timeLimit": 42, "lives": 1, "tier": "Heroic"},
    {"level": 5, "size": 3, "tiles": 4, "displayTime": 2.7, "timeLimit": 41, "lives": 1, "tier": "Heroic"},
    {"level": 6, "size": 3, "tiles": 5, "displayTime": 2.9, "timeLimit": 40, "lives": 1, "tier": "Heroic"},
    {"level": 7, "size": 4, "tiles": 6, "displayTime": 3.0, "timeLimit": 39, "lives": 1, "tier": "Heroic"},
    {"level": 8, "size": 4, "tiles": 6, "displayTime": 3.2, "timeLimit": 38, "lives": 1, "tier": "Heroic"},
    {"level": 9, "size": 4, "tiles": 7, "displayTime": 3.4, "timeLimit": 37, "lives": 1, "tier": "Heroic"},
    {"level": 10, "size": 4, "tiles": 7, "displayTime": 3.6, "timeLimit": 36, "lives": 1, "tier": "Heroic"},
    {"level": 11, "size": 4, "tiles": 8, "displayTime": 3.7, "timeLimit": 35, "lives": 2, "tier": "Master"},
    {"level": 12, "size": 4, "tiles": 8, "displayTime": 3.9, "timeLimit": 34, "lives": 2, "tier": "Master"},
    {"level": 13, "size": 5, "tiles": 9, "displayTime": 4.1, "timeLimit": 33, "lives": 2, "tier": "Master"},
    {"level": 14, "size": 5, "tiles": 10, "displayTime": 4.2, "timeLimit": 32, "lives": 2, "tier": "Master"},
    {"level": 15, "size": 5, "tiles": 10, "displayTime": 4.4, "timeLimit": 31, "lives": 2, "tier": "Master"},
    {"level": 16, "size": 5, "tiles": 11, "displayTime": 4.6, "timeLimit": 30, "lives": 2, "tier": "Master"},
    {"level": 17, "size": 5, "tiles": 11, "displayTime": 4.8, "timeLimit": 29, "lives": 2, "tier": "Master"},
    {"level": 18, "size": 5, "tiles": 12, "displayTime": 4.9, "timeLimit": 28, "lives": 2, "tier": "Master"},
    {"level": 19, "size": 6, "tiles": 13, "displayTime": 5.1, "timeLimit": 27, "lives": 2, "tier": "Master"},
    {"level": 20, "size": 6, "tiles": 13, "displayTime": 5.3, "timeLimit": 26, "lives": 2, "tier": "Master"},
    {"level": 21, "size": 6, "tiles": 14, "displayTime": 5.5, "timeLimit": 25, "lives": 3, "tier": "Grand Master"},
    {"level": 22, "size": 6, "tiles": 14, "displayTime": 5.6, "timeLimit": 24, "lives": 3, "tier": "Grand Master"},
    {"level": 23, "size": 6, "tiles": 15, "displayTime": 5.8, "timeLimit": 23, "lives": 3, "tier": "Grand Master"},
    {"level": 24, "size": 6, "tiles": 15, "displayTime": 6.0, "timeLimit": 22, "lives": 3, "tier": "Grand Master"},
    {"level": 25, "size": 7, "tiles": 16, "displayTime": 6.1, "timeLimit": 21, "lives": 3, "tier": "Grand Master"},
    {"level": 26, "size": 7, "tiles": 17, "displayTime": 6.3, "timeLimit": 20, "lives": 3, "tier": "Grand Master"},
    {"level": 27, "size": 7, "tiles": 17, "displayTime": 6.5, "timeLimit": 19, "lives": 3, "tier": "Grand Master"},
    {"level": 28, "size": 7, "tiles": 18, "displayTime": 6.7, "timeLimit": 18, "lives": 3, "tier": "Grand Master"},
    {"level": 29, "size": 7, "tiles": 18, "displayTime": 6.8, "timeLimit": 17, "lives": 3, "tier": "Grand Master"},
    {"level": 30, "size": 7, "tiles": 19, "displayTime": 7.0, "timeLimit": 16, "lives": 3, "tier": "Grand Master"}
  ];

  String _gameState = 'menu'; // 'menu' | 'memorize' | 'recall' | 'levelcomplete' | 'gameover'
  int _currentLevel = 1;
  int _score = 0;
  int _highScore = 0;
  int _lives = 1;
  int _maxLives = 1;
  int _streak = 0;

  List<int> _patternTiles = [];
  List<int> _selectedTiles = [];
  int? _failedTile;

  Timer? _memorizeTimer;
  Timer? _roundTimer;
  double _memorizeProgress = 1.0;
  int _timeLeft = 45;

  @override
  void initState() {
    super.initState();
    _loadHighScore();
  }

  @override
  void dispose() {
    _memorizeTimer?.cancel();
    _roundTimer?.cancel();
    super.dispose();
  }

  void _loadHighScore() async {
    final state = CareerPathApp.of(context);
    final user = state?.user;
    if (user != null) {
      final userId = user['id']?.toString() ?? 'demo';
      final res = await ApiService.getGameData(userId);
      if (mounted && res['bestScore'] != null) {
        setState(() {
          _highScore = res['bestScore'] is int ? res['bestScore'] : int.tryParse(res['bestScore'].toString()) ?? 0;
        });
      }
    }
  }

  void _startCampaign() {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    setState(() {
      _currentLevel = 1;
      _score = 0;
      _streak = 0;
    });
    _startLevel(_currentLevel);
  }

  void _startLevel(int level) {
    _memorizeTimer?.cancel();
    _roundTimer?.cancel();

    final config = _levelConfigs[(level - 1) % _levelConfigs.length];
    final int size = config['size'];
    final int tilesCount = config['tiles'];
    final double displayTime = config['displayTime'];
    final int lives = config['lives'];
    final int timeLimit = config['timeLimit'];

    // Generate random distinct pattern tiles across grid
    final totalCells = size * size;
    final Set<int> chosen = {};
    final rand = Random();
    while (chosen.length < tilesCount) {
      chosen.add(rand.nextInt(totalCells));
    }

    setState(() {
      _currentLevel = level;
      _lives = lives;
      _maxLives = lives;
      _timeLeft = timeLimit;
      _patternTiles = chosen.toList();
      _selectedTiles = [];
      _failedTile = null;
      _gameState = 'memorize';
      _memorizeProgress = 1.0;
    });

    // Memorize phase progress bar countdown
    final stepMs = 50;
    final totalSteps = (displayTime * 1000) / stepMs;
    double decrement = 1.0 / totalSteps;

    _memorizeTimer = Timer.periodic(Duration(milliseconds: stepMs), (timer) {
      if (!mounted) return;
      if (_memorizeProgress <= decrement) {
        timer.cancel();
        _startRecallPhase();
      } else {
        setState(() {
          _memorizeProgress -= decrement;
        });
      }
    });
  }

  void _startRecallPhase() {
    setState(() {
      _gameState = 'recall';
    });

    // Round countdown timer
    _roundTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return;
      if (_timeLeft <= 1) {
        timer.cancel();
        _onTimeOut();
      } else {
        setState(() {
          _timeLeft--;
        });
      }
    });
  }

  void _onTileTap(int index) {
    if (_gameState != 'recall') return;
    if (_selectedTiles.contains(index)) return;

    final state = CareerPathApp.of(context);

    if (_patternTiles.contains(index)) {
      // Correct tile tap
      SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
      setState(() {
        _selectedTiles.add(index);
        _score += 10 * _currentLevel;
      });

      if (_score > _highScore) {
        _highScore = _score;
      }

      // Check level clear
      if (_selectedTiles.length == _patternTiles.length) {
        _roundTimer?.cancel();
        SoundManager.playSuccess(state?.soundEnabled ?? true);
        setState(() {
          _streak++;
          _score += 50 * _currentLevel;
          _gameState = 'levelcomplete';
        });

        _saveScoreToBackend();
      }
    } else {
      // Incorrect tile tap
      SoundManager.playError(state?.soundEnabled ?? true);
      setState(() {
        _failedTile = index;
        _lives--;
        _streak = 0;
      });

      if (_lives <= 0) {
        _roundTimer?.cancel();
        setState(() {
          _gameState = 'gameover';
        });
        _saveScoreToBackend();
      }
    }
  }

  void _onTimeOut() {
    final state = CareerPathApp.of(context);
    SoundManager.playError(state?.soundEnabled ?? true);
    setState(() {
      _lives = 0;
      _gameState = 'gameover';
    });
    _saveScoreToBackend();
  }

  void _saveScoreToBackend() async {
    final state = CareerPathApp.of(context);
    final user = state?.user;
    if (user != null) {
      final userId = user['id']?.toString() ?? 'demo';
      await ApiService.saveGameData(userId, {
        'bestScore': _highScore,
        'highestLevel': _currentLevel,
        'lastScore': _score
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    final config = _levelConfigs[(_currentLevel - 1) % _levelConfigs.length];
    final int size = config['size'];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Memory Matrix', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
        child: _gameState == 'menu' ? _buildMenuView(theme) : _buildGameplayView(theme, config, size),
      ),
    );
  }

  Widget _buildMenuView(ThemeData theme) {
    final state = CareerPathApp.of(context);
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text('🧠', style: TextStyle(fontSize: 72), textAlign: TextAlign.center),
          const SizedBox(height: 16),
          const Text(
            'Memory Matrix',
            style: TextStyle(fontFamily: 'Outfit', fontSize: 32, fontWeight: FontWeight.w900),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          const Text(
            'Train pattern recognition & working memory across 30 campaign levels.',
            style: TextStyle(fontSize: 14, color: Colors.grey),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 36),

          // Start Campaign Button
          ElevatedButton(
            onPressed: _startCampaign,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: const Text('🚀 Start Campaign (Level 1)', style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 16),

          // High Score Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: CareerPathApp.getBorderColor(context)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                Column(
                  children: [
                    const Text('HIGHEST LEVEL', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text('Level $_currentLevel', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  ],
                ),
                Column(
                  children: [
                    const Text('BEST SCORE', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text('$_highScore pts', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.amber)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGameplayView(ThemeData theme, Map<String, dynamic> config, int size) {
    return Column(
      children: [
        // Status Top Bar
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          color: CareerPathApp.getCardBg(context).withOpacity(0.5),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('LEVEL $_currentLevel (${config['tier']})', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                  Text('Score: $_score', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ],
              ),
              Row(
                children: List.generate(_maxLives, (i) {
                  return Icon(
                    i < _lives ? Icons.favorite : Icons.favorite_border,
                    color: Colors.redAccent,
                    size: 20,
                  );
                }),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text('TIME LEFT', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                  Text('$_timeLeft s', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.cyanAccent)),
                ],
              ),
            ],
          ),
        ),

        // Phase Progress Bar / Status Banner
        if (_gameState == 'memorize')
          LinearProgressIndicator(
            value: _memorizeProgress,
            backgroundColor: Colors.white10,
            valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
            minHeight: 4,
          ),

        Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0),
          child: Text(
            _gameState == 'memorize' ? '👀 MEMORIZE THE PATTERN TILES' : '🎯 TAP THE PATTERN TILES FROM MEMORY',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.8,
              color: _gameState == 'memorize' ? Colors.amber : Colors.greenAccent,
            ),
          ),
        ),

        // Interactive Matrix Grid
        Expanded(
          child: Center(
            child: AspectRatio(
              aspectRatio: 1.0,
              child: Container(
                margin: const EdgeInsets.all(24),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: CareerPathApp.getCardBg(context),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: CareerPathApp.getBorderColor(context)),
                ),
                child: GridView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: size,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                  ),
                  itemCount: size * size,
                  itemBuilder: (context, index) {
                    final bool isPattern = _patternTiles.contains(index);
                    final bool isSelected = _selectedTiles.contains(index);
                    final bool isFailed = _failedTile == index;

                    Color tileColor = Colors.white.withOpacity(0.04);
                    Border border = Border.all(color: CareerPathApp.getBorderColor(context));

                    if (_gameState == 'memorize') {
                      if (isPattern) {
                        tileColor = theme.colorScheme.primary;
                        border = Border.all(color: theme.colorScheme.primary, width: 2);
                      }
                    } else {
                      if (isSelected) {
                        tileColor = Colors.greenAccent;
                        border = Border.all(color: Colors.greenAccent, width: 2);
                      } else if (isFailed) {
                        tileColor = Colors.redAccent;
                        border = Border.all(color: Colors.redAccent, width: 2);
                      }
                    }

                    return GestureDetector(
                      onTap: () => _onTileTap(index),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        decoration: BoxDecoration(
                          color: tileColor,
                          borderRadius: BorderRadius.circular(12),
                          border: border,
                          boxShadow: (isSelected || (_gameState == 'memorize' && isPattern))
                              ? [BoxShadow(color: theme.colorScheme.primary.withOpacity(0.4), blurRadius: 10)]
                              : [],
                        ),
                        child: Center(
                          child: isSelected
                              ? const Icon(Icons.check, color: Colors.black, size: 24)
                              : isFailed
                                  ? const Icon(Icons.close, color: Colors.white, size: 24)
                                  : null,
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        ),

        // Modal Banners for Level Complete / Game Over
        if (_gameState == 'levelcomplete') _buildLevelCompleteCard(theme),
        if (_gameState == 'gameover') _buildGameOverCard(theme),
      ],
    );
  }

  Widget _buildLevelCompleteCard(ThemeData theme) {
    return Container(
      margin: const EdgeInsets.all(20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.greenAccent),
      ),
      child: Column(
        children: [
          const Text('🎉 LEVEL CLEAR!', style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
          const SizedBox(height: 8),
          Text('Score: $_score | Streak: $_streak🔥', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => _startLevel(_currentLevel + 1),
            style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
            child: Text('Next Level (${_currentLevel + 1}) ➔', style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildGameOverCard(ThemeData theme) {
    return Container(
      margin: const EdgeInsets.all(20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.redAccent),
      ),
      child: Column(
        children: [
          const Text('💀 GAME OVER', style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold, color: Colors.redAccent)),
          const SizedBox(height: 8),
          Text('Final Score: $_score | High Score: $_highScore', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              OutlinedButton(
                onPressed: () => setState(() => _gameState = 'menu'),
                style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                child: const Text('Menu'),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: _startCampaign,
                style: ElevatedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                child: const Text('Try Again 🔄', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
