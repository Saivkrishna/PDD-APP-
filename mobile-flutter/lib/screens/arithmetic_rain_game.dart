import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart';
import '../utils/arithmetic_rain_data.dart';
import '../utils/sound_manager.dart';

class ArithmeticRainGame extends StatefulWidget {
  final VoidCallback? onBack;

  const ArithmeticRainGame({super.key, this.onBack});

  @override
  State<ArithmeticRainGame> createState() => _ArithmeticRainGameState();
}

class _ArithmeticRainGameState extends State<ArithmeticRainGame> with SingleTickerProviderStateMixin {
  // Navigation / Views: 'menu' | 'countdown' | 'game' | 'results'
  String _view = 'menu';
  // Menu active tab: 'stats' | 'achievements' | 'settings' | 'history'
  String _activeTab = 'stats';

  // Game state
  String _mode = 'classic'; // 'practice' | 'classic' | 'timed' | 'endless' | 'daily'
  int _score = 0;
  int _lives = 3;
  int _combo = 0;
  int _maxCombo = 0;
  List<RainQuestion> _questions = [];
  String _inputValue = '';
  double _gameTime = 0.0;
  int _timedDuration = 120; // 120, 300, 600
  int _countdown = 3;
  bool _isPaused = false;
  bool _showPauseSettings = false;
  bool _shakeContainer = false;

  // Sound & Haptic settings
  bool _music = true;
  bool _sound = true;
  bool _vibration = true;

  // Economy balances
  int _coins = 200;
  int _xp = 0;

  // Statistics & History
  int _gamesPlayed = 0;
  int _totalSolvedCount = 0;
  int _highScoreClassic = 0;
  int _highScoreEndless = 0;
  int _highScoreTimed = 0;
  int _highScorePractice = 0;
  double _accuracySum = 0.0;
  double _avgResponseTime = 0.0;
  int _correctAnswers = 0;
  int _wrongAnswers = 0;
  int _missedQuestions = 0;

  // Daily Info
  String _dailyLastPlayedDate = '';
  int _dailyStreak = 0;
  int _dailyLongestStreak = 0;

  // Unlocked achievements & history logs
  List<String> _unlockedAchievements = [];
  List<Map<String, dynamic>> _historyLogs = [];

  // Session ref counters
  int _sessionCorrect = 0;
  int _sessionWrong = 0;
  int _sessionMissed = 0;
  final List<double> _sessionAnswerTimes = [];

  // Timers & Loops
  Timer? _countdownTimer;
  Timer? _gameLoopTimer;
  int _lastSpawnTime = 0;
  int _lastUpdateTime = 0;
  SeededRandom? _dailyPrng;

  String get _todayStr => DateTime.now().toIso8601String().split('T')[0];

  @override
  void initState() {
    super.initState();
    _loadLocalData();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _gameLoopTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadLocalData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      setState(() {
        _coins = prefs.getInt('cp_coins') ?? 200;
        _xp = prefs.getInt('cp_xp') ?? 0;

        final settingsStr = prefs.getString('cp_rain_settings');
        if (settingsStr != null) {
          final s = json.decode(settingsStr) as Map<String, dynamic>;
          _music = s['music'] ?? true;
          _sound = s['sound'] ?? true;
          _vibration = s['vibration'] ?? true;
        }

        final statsStr = prefs.getString('cp_rain_stats');
        if (statsStr != null) {
          final st = json.decode(statsStr) as Map<String, dynamic>;
          _gamesPlayed = st['gamesPlayed'] ?? 0;
          _totalSolvedCount = st['totalSolved'] ?? 0;
          _highScoreClassic = st['highestScoreClassic'] ?? 0;
          _highScoreEndless = st['highestScoreEndless'] ?? 0;
          _highScoreTimed = st['highestScoreTimed'] ?? 0;
          _highScorePractice = st['highestScorePractice'] ?? 0;
          _accuracySum = (st['accuracySum'] as num?)?.toDouble() ?? 0.0;
          _avgResponseTime = (st['avgResponseTime'] as num?)?.toDouble() ?? 0.0;
          _correctAnswers = st['correctAnswers'] ?? 0;
          _wrongAnswers = st['wrongAnswers'] ?? 0;
          _missedQuestions = st['missedQuestions'] ?? 0;
        }

        final dailyStr = prefs.getString('cp_rain_daily');
        if (dailyStr != null) {
          final d = json.decode(dailyStr) as Map<String, dynamic>;
          _dailyLastPlayedDate = d['lastPlayedDate'] ?? '';
          _dailyStreak = d['streak'] ?? 0;
          _dailyLongestStreak = d['longestStreak'] ?? 0;
        }

        final achStr = prefs.getString('cp_rain_achievements');
        if (achStr != null) {
          _unlockedAchievements = (json.decode(achStr) as List).map((e) => e.toString()).toList();
        }

        final histStr = prefs.getString('cp_rain_history');
        if (histStr != null) {
          _historyLogs = (json.decode(histStr) as List).map((e) => Map<String, dynamic>.from(e as Map)).toList();
        }
      });
    } catch (_) {}
  }

  void _triggerHaptic([int ms = 50]) {
    if (_vibration) {
      if (ms > 100) {
        HapticFeedback.heavyImpact();
      } else {
        HapticFeedback.selectionClick();
      }
    }
  }

  void _playClickSound() => SoundManager.playClick(_sound, 'synth');
  void _playCorrectSound() => SoundManager.playSuccess(_sound);
  void _playWrongSound() => SoundManager.playError(_sound);

  // ─── START GAME FLOW ─────────────────────────────────────────────────
  void _handleStartGame(String selectedMode) {
    if (selectedMode == 'daily' && _dailyLastPlayedDate == _todayStr) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You have already completed the Daily Challenge today!')),
      );
      return;
    }

    _playClickSound();

    setState(() {
      _mode = selectedMode;
      _score = 0;
      _combo = 0;
      _maxCombo = 0;
      _inputValue = '';
      _questions = [];
      _gameTime = 0.0;
      _isPaused = false;
      _showPauseSettings = false;
      _sessionCorrect = 0;
      _sessionWrong = 0;
      _sessionMissed = 0;
      _sessionAnswerTimes.clear();

      if (selectedMode == 'classic' || selectedMode == 'endless' || selectedMode == 'daily') {
        _lives = 3;
      } else {
        _lives = 999;
      }

      if (selectedMode == 'daily') {
        final seed = getSeedFromDate(_todayStr);
        _dailyPrng = SeededRandom(seed);
      } else {
        _dailyPrng = null;
      }

      _view = 'countdown';
      _countdown = 3;
    });

    _startCountdownLoop();
  }

  void _startCountdownLoop() {
    _countdownTimer?.cancel();
    _playClickSound();

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return;
      if (_countdown > 1) {
        _playClickSound();
        setState(() => _countdown--);
      } else {
        timer.cancel();
        _playCorrectSound();
        setState(() {
          _view = 'game';
          _lastSpawnTime = DateTime.now().millisecondsSinceEpoch;
          _lastUpdateTime = DateTime.now().millisecondsSinceEpoch;
        });
        _spawnInitialQuestion();
        _startGameLoop();
      }
    });
  }

  void _spawnInitialQuestion() {
    final newQ = generateQuestion(0, _dailyPrng);
    newQ.x = 15.0 + Random().nextInt(55);
    newQ.y = -5.0;
    setState(() {
      _questions = [newQ];
    });
  }

  // ─── ACTIVE 60 FPS GAME ENGINE LOOP ──────────────────────────────────
  void _startGameLoop() {
    _gameLoopTimer?.cancel();

    _gameLoopTimer = Timer.periodic(const Duration(milliseconds: 33), (timer) {
      if (!mounted || _view != 'game' || _isPaused) return;

      final now = DateTime.now().millisecondsSinceEpoch;
      final deltaTime = (now - _lastUpdateTime) / 1000.0;
      _lastUpdateTime = now;

      final nextTime = _gameTime + deltaTime;
      if (_mode == 'timed' && nextTime >= _timedDuration) {
        _endGame();
        return;
      }

      final updated = <RainQuestion>[];
      int missedCount = 0;

      for (final q in _questions) {
        final fallRate = q.operator == '/' ? 12.0 : q.operator == '*' ? 20.0 : 24.0;
        final newY = q.y + (fallRate * deltaTime);

        if (newY >= 96.0) {
          missedCount++;
        } else {
          q.y = newY;
          updated.add(q);
        }
      }

      if (missedCount > 0) {
        _sessionMissed += missedCount;
        _playWrongSound();
        _triggerHaptic(200);

        setState(() {
          _combo = 0;
          _shakeContainer = true;
          if (_mode == 'classic' || _mode == 'endless' || _mode == 'daily') {
            _lives -= missedCount;
          }
        });

        Future.delayed(const Duration(milliseconds: 300), () {
          if (mounted) setState(() => _shakeContainer = false);
        });

        if ((_mode == 'classic' || _mode == 'endless' || _mode == 'daily') && _lives <= 0) {
          _endGame();
          return;
        }

        // Respawn missed questions
        for (int i = 0; i < missedCount; i++) {
          final newQ = generateQuestion(_score, _dailyPrng);
          newQ.x = 10.0 + Random().nextInt(60);
          newQ.y = -5.0 - (i * 12.0);
          updated.add(newQ);
        }
      }

      // Auto-spawn questions periodically (keep 2 questions on screen max)
      final spawnInterval = max(2200, 4200 - (_score * 3));
      if (now - _lastSpawnTime > spawnInterval && updated.length < 2) {
        final newQ = generateQuestion(_score, _dailyPrng);
        newQ.x = 10.0 + Random().nextInt(60);
        newQ.y = -6.0;
        _lastSpawnTime = now;
        updated.add(newQ);
      }

      setState(() {
        _gameTime = nextTime;
        _questions = updated;
      });
    });
  }

  // ─── KEYPAD & INPUT SUBMIT ───────────────────────────────────────────
  void _handleKeypadPress(String key) {
    _playClickSound();
    _triggerHaptic(20);

    String nextVal = _inputValue;
    if (key == 'Clear' || key == 'C') {
      nextVal = '';
    } else if (key == '⌫') {
      if (nextVal.isNotEmpty) nextVal = nextVal.substring(0, nextVal.length - 1);
    } else if (key == 'Submit') {
      _submitAnswer();
      return;
    } else if (key == '-') {
      if (nextVal.isEmpty) nextVal = '-';
    } else {
      if (nextVal == '-' && key == '0') return;
      nextVal += key;
    }

    setState(() => _inputValue = nextVal);
    _checkTypedMatch(nextVal);
  }

  void _checkTypedMatch(String val) {
    final numericVal = int.tryParse(val.trim());
    if (numericVal == null) return;

    final matchIndex = _questions.indexWhere((q) => q.answer == numericVal && !q.cleared);
    if (matchIndex != -1) {
      _processCorrectAnswer(matchIndex);
    }
  }

  void _submitAnswer() {
    if (_inputValue.trim().isEmpty) return;
    final numericVal = int.tryParse(_inputValue.trim());

    if (numericVal != null) {
      final matchIndex = _questions.indexWhere((q) => q.answer == numericVal && !q.cleared);
      if (matchIndex != -1) {
        _processCorrectAnswer(matchIndex);
        return;
      }
    }

    // Wrong submission
    _playWrongSound();
    _triggerHaptic(150);
    setState(() {
      _sessionWrong++;
      _inputValue = '';
    });
  }

  void _processCorrectAnswer(int index) {
    final matchedQ = _questions[index];
    final reaction = (DateTime.now().millisecondsSinceEpoch - matchedQ.spawnTime) / 1000.0;
    _sessionAnswerTimes.add(reaction);

    _sessionCorrect++;
    final nextCombo = _combo + 1;
    final pointsGained = calculatePoints(matchedQ.operator, nextCombo);

    _playCorrectSound();
    _triggerHaptic(40);

    setState(() {
      matchedQ.cleared = true;
      _combo = nextCombo;
      _maxCombo = max(_maxCombo, nextCombo);
      _score += pointsGained;
      _inputValue = '';
    });

    Future.delayed(const Duration(milliseconds: 200), () {
      if (!mounted) return;
      setState(() {
        _questions.removeWhere((q) => q.id == matchedQ.id);
      });
      _spawnInitialQuestion();
    });
  }

  // ─── END GAME & PERSISTENCE ──────────────────────────────────────────
  void _endGame() async {
    _gameLoopTimer?.cancel();
    _playWrongSound();
    _triggerHaptic(300);

    final totalTaps = _sessionCorrect + _sessionWrong;
    final sessionAccuracy = totalTaps > 0 ? ((_sessionCorrect / totalTaps) * 100).toDouble() : 0.0;

    double sumTimes = 0.0;
    for (final t in _sessionAnswerTimes) {
      sumTimes += t;
    }
    final sessionAvgReaction = _sessionCorrect > 0 ? (sumTimes / _sessionCorrect) : 0.0;

    final rewards = getSessionRewards(_score, _mode);
    final earnedCoins = rewards['coins']!;
    final earnedXp = rewards['xp']!;

    final nextCoins = _coins + earnedCoins;
    final nextXp = _xp + earnedXp;

    final nextGamesPlayed = _gamesPlayed + 1;
    final nextTotalSolved = _totalSolvedCount + _sessionCorrect;
    final nextCorrect = _correctAnswers + _sessionCorrect;
    final nextWrong = _wrongAnswers + _sessionWrong;
    final nextMissed = _missedQuestions + _sessionMissed;
    final nextAccuracySum = _accuracySum + sessionAccuracy;

    int hsClassic = _highScoreClassic;
    int hsEndless = _highScoreEndless;
    int hsTimed = _highScoreTimed;
    int hsPractice = _highScorePractice;

    if (_mode == 'classic') hsClassic = max(hsClassic, _score);
    if (_mode == 'endless') hsEndless = max(hsEndless, _score);
    if (_mode == 'timed') hsTimed = max(hsTimed, _score);
    if (_mode == 'practice') hsPractice = max(hsPractice, _score);

    double nextAvgReaction = _avgResponseTime;
    if (sessionAvgReaction > 0) {
      nextAvgReaction = _avgResponseTime == 0.0 ? sessionAvgReaction : ((_avgResponseTime + sessionAvgReaction) / 2.0);
    }

    // Daily streak logic
    int nextStreak = _dailyStreak;
    int nextLongestStreak = _dailyLongestStreak;
    String nextLastDate = _dailyLastPlayedDate;

    if (_mode == 'daily') {
      final yesterday = DateTime.now().subtract(const Duration(days: 1)).toIso8601String().split('T')[0];
      if (_dailyLastPlayedDate == yesterday) {
        nextStreak += 1;
      } else if (_dailyLastPlayedDate != _todayStr) {
        nextStreak = 1;
      }
      nextLongestStreak = max(_dailyLongestStreak, nextStreak);
      nextLastDate = _todayStr;
    }

    // Achievements unlock check
    final nextAchievements = List<String>.from(_unlockedAchievements);
    void checkUnlock(String id) {
      if (!nextAchievements.contains(id)) nextAchievements.add(id);
    }

    if (nextTotalSolved >= 10) checkUnlock('novice');
    if (nextTotalSolved >= 100) checkUnlock('scholar');
    if (nextTotalSolved >= 500) checkUnlock('einstein');
    if (sessionAccuracy >= 100.0 && _sessionCorrect >= 15) checkUnlock('perfectionist');
    if (_score >= 1000) checkUnlock('rain_master');
    if (_mode == 'endless' && _score >= 500) checkUnlock('endless_survivor');
    if (sessionAvgReaction > 0 && sessionAvgReaction < 1.5 && _sessionCorrect >= 10) checkUnlock('speed_demon');
    if (nextStreak >= 3) checkUnlock('daily_commuter');

    // History log
    final nextHistory = List<Map<String, dynamic>>.from(_historyLogs);
    nextHistory.insert(0, {
      'date': _todayStr,
      'mode': _mode,
      'score': _score,
      'accuracy': sessionAccuracy,
      'correct': _sessionCorrect,
      'wrong': _sessionWrong,
      'missed': _sessionMissed,
      'combo': _maxCombo,
      'duration': _gameTime.round(),
      'coins': earnedCoins,
      'xp': earnedXp,
    });
    if (nextHistory.length > 50) nextHistory.removeRange(50, nextHistory.length);

    setState(() {
      _coins = nextCoins;
      _xp = nextXp;
      _gamesPlayed = nextGamesPlayed;
      _totalSolvedCount = nextTotalSolved;
      _correctAnswers = nextCorrect;
      _wrongAnswers = nextWrong;
      _missedQuestions = nextMissed;
      _accuracySum = nextAccuracySum;
      _highScoreClassic = hsClassic;
      _highScoreEndless = hsEndless;
      _highScoreTimed = hsTimed;
      _highScorePractice = hsPractice;
      _avgResponseTime = nextAvgReaction;
      _dailyStreak = nextStreak;
      _dailyLongestStreak = nextLongestStreak;
      _dailyLastPlayedDate = nextLastDate;
      _unlockedAchievements = nextAchievements;
      _historyLogs = nextHistory;
      _view = 'results';
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('cp_coins', nextCoins);
      await prefs.setInt('cp_xp', nextXp);

      final statsPayload = {
        'gamesPlayed': nextGamesPlayed,
        'totalSolved': nextTotalSolved,
        'highestScoreClassic': hsClassic,
        'highestScoreEndless': hsEndless,
        'highestScoreTimed': hsTimed,
        'highestScorePractice': hsPractice,
        'accuracySum': nextAccuracySum,
        'avgResponseTime': nextAvgReaction,
        'correctAnswers': nextCorrect,
        'wrongAnswers': nextWrong,
        'missedQuestions': nextMissed,
      };
      await prefs.setString('cp_rain_stats', json.encode(statsPayload));

      final dailyPayload = {
        'lastPlayedDate': nextLastDate,
        'streak': nextStreak,
        'longestStreak': nextLongestStreak,
      };
      await prefs.setString('cp_rain_daily', json.encode(dailyPayload));

      await prefs.setString('cp_rain_achievements', json.encode(nextAchievements));
      await prefs.setString('cp_rain_history', json.encode(nextHistory));
    } catch (_) {}
  }

  void _handleResetStatistics() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('cp_rain_stats');
    await prefs.remove('cp_rain_achievements');
    await prefs.remove('cp_rain_daily');
    await prefs.remove('cp_rain_history');

    setState(() {
      _gamesPlayed = 0;
      _totalSolvedCount = 0;
      _highScoreClassic = 0;
      _highScoreEndless = 0;
      _highScoreTimed = 0;
      _highScorePractice = 0;
      _accuracySum = 0.0;
      _avgResponseTime = 0.0;
      _correctAnswers = 0;
      _wrongAnswers = 0;
      _missedQuestions = 0;
      _dailyStreak = 0;
      _dailyLongestStreak = 0;
      _dailyLastPlayedDate = '';
      _unlockedAchievements = [];
      _historyLogs = [];
    });
  }

  // ─── ROOT BUILD ───────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return PopScope(
      canPop: _view == 'menu',
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) {
          if (_view == 'game') {
            setState(() {
              _isPaused = !_isPaused;
              _showPauseSettings = false;
            });
          } else {
            setState(() => _view = 'menu');
          }
        }
      },
      child: Scaffold(
        body: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: CareerPathApp.getGradient(context),
            ),
          ),
          child: SafeArea(
            child: Stack(
              children: [
                Column(
                  children: [
                    // Header Bar
                    _buildTopHeader(theme),

                    // Main Content Router
                    Expanded(
                      child: _view == 'game'
                          ? _buildGameplayCanvas(theme)
                          : SingleChildScrollView(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                              child: _buildViewContent(theme),
                            ),
                    ),
                  ],
                ),

                // In-Game Pause Modal
                if (_isPaused && _view == 'game') _buildPauseModal(theme),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ─── 1. TOP HEADER ────────────────────────────────────────────────────
  Widget _buildTopHeader(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        border: Border(bottom: BorderSide(color: CareerPathApp.getBorderColor(context))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          TextButton.icon(
            icon: const Icon(Icons.arrow_back, size: 16),
            label: const Text('Back to Hub', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            onPressed: () {
              if (widget.onBack != null) {
                widget.onBack!();
              } else {
                Navigator.of(context).pop();
              }
            },
          ),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF8E7),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFF0D597)),
                ),
                child: Row(
                  children: [
                    const Text('🪙', style: TextStyle(fontSize: 11)),
                    const SizedBox(width: 4),
                    Text('$_coins', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFD4901A))),
                  ],
                ),
              ),
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F5F9),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFC4D7E6)),
                ),
                child: Row(
                  children: [
                    const Text('✨', style: TextStyle(fontSize: 11)),
                    const SizedBox(width: 4),
                    Text('$_xp XP', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF4A90E2))),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ─── 2. CONTENT ROUTER ───────────────────────────────────────────────
  Widget _buildViewContent(ThemeData theme) {
    switch (_view) {
      case 'menu':
        return _buildMenuView(theme);
      case 'countdown':
        return _buildCountdownView(theme);
      case 'results':
        return _buildResultsView(theme);
      default:
        return _buildMenuView(theme);
    }
  }

  // ─── 3. MENU VIEW & TABS ─────────────────────────────────────────────
  Widget _buildMenuView(ThemeData theme) {
    return Column(
      children: [
        const SizedBox(height: 10),
        const Text('🌧️', style: TextStyle(fontSize: 48)),
        const SizedBox(height: 4),
        Text(
          'Arithmetic Rain',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 26, fontWeight: FontWeight.w900, color: theme.colorScheme.primary),
        ),
        const Text(
          'Dodge the storm by solving arithmetic equations rapidly.',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 11, color: Colors.grey),
        ),
        const SizedBox(height: 16),

        // Game Modes Card
        _buildCard(
          theme,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Select Game Mode', style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              _buildModeOption(theme, 'practice', '🎓 Practice Mode', 'Unlimited gameplay, no lives, ideal for warmups.'),
              const SizedBox(height: 8),
              _buildModeOption(theme, 'classic', '⚔️ Classic Mode', '3 Lives. Equations speed up over time.'),
              const SizedBox(height: 8),
              _buildTimedModeOption(theme),
              const SizedBox(height: 8),
              _buildModeOption(theme, 'endless', '♾️ Endless Mode', '3 Lives. Continues forever, scaling difficulty.'),
              const SizedBox(height: 8),
              _buildModeOption(
                theme,
                'daily',
                '🔥 Daily Challenge',
                'One seed sequence shared globally (+50 🪙, +100 XP).',
                badge: _dailyStreak > 0 ? '🔥 $_dailyStreak Day Streak' : null,
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Tabs Card (Stats, Badges, Settings, Logs)
        _buildCard(
          theme,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildTabBtn('stats', 'Stats'),
                  _buildTabBtn('achievements', 'Badges'),
                  _buildTabBtn('settings', 'Settings'),
                  _buildTabBtn('history', 'Logs'),
                ],
              ),
              const Divider(height: 20),
              if (_activeTab == 'stats') _buildStatsTab(theme),
              if (_activeTab == 'achievements') _buildBadgesTab(theme),
              if (_activeTab == 'settings') _buildSettingsTab(theme),
              if (_activeTab == 'history') _buildHistoryTab(theme),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildModeOption(ThemeData theme, String id, String title, String desc, {String? badge}) {
    return InkWell(
      onTap: () => _handleStartGame(id),
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: theme.colorScheme.primary.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: CareerPathApp.getBorderColor(context)),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      if (badge != null)
                        Text(badge, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Color(0xFFEF4444))),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(desc, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.play_arrow, size: 18, color: Colors.grey),
          ],
        ),
      ),
    );
  }

  Widget _buildTimedModeOption(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: CareerPathApp.getBorderColor(context)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            onTap: () => _handleStartGame('timed'),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('⏱️ Timed Challenge', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Icon(Icons.play_arrow, size: 18, color: Colors.grey),
              ],
            ),
          ),
          const SizedBox(height: 2),
          const Text('Highest score wins under the clock. Select duration below:', style: TextStyle(fontSize: 10, color: Colors.grey)),
          const SizedBox(height: 8),
          Row(
            children: [120, 300, 600].map((dur) {
              final isSel = _timedDuration == dur;
              return Padding(
                padding: const EdgeInsets.only(right: 6),
                child: ChoiceChip(
                  label: Text('${dur ~/ 60} Mins', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isSel ? Colors.white : null)),
                  selected: isSel,
                  selectedColor: theme.colorScheme.primary,
                  onSelected: (val) => setState(() => _timedDuration = dur),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildTabBtn(String id, String label) {
    final isSel = _activeTab == id;
    final theme = Theme.of(context);
    return InkWell(
      onTap: () => setState(() => _activeTab = id),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSel ? theme.colorScheme.primary.withValues(alpha: 0.15) : null,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isSel ? FontWeight.bold : FontWeight.normal,
            color: isSel ? theme.colorScheme.primary : Colors.grey,
          ),
        ),
      ),
    );
  }

  // ─── 4. TAB CONTENTS ─────────────────────────────────────────────────
  Widget _buildStatsTab(ThemeData theme) {
    final overallAcc = _gamesPlayed > 0 ? (_accuracySum / _gamesPlayed).toStringAsFixed(1) : '100.0';

    return Column(
      children: [
        _buildStatRow('Games Played', '$_gamesPlayed'),
        _buildStatRow('Equations Solved', '$_totalSolvedCount'),
        _buildStatRow('Avg Response', '${_avgResponseTime.toStringAsFixed(2)}s'),
        _buildStatRow('Overall Accuracy', '$overallAcc%'),
        const SizedBox(height: 8),
        const Align(
          alignment: Alignment.centerLeft,
          child: Text('Personal Highs:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
        ),
        const SizedBox(height: 6),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildHighPill('Classic', '$_highScoreClassic'),
            _buildHighPill('Endless', '$_highScoreEndless'),
            _buildHighPill('Timed', '$_highScoreTimed'),
            _buildHighPill('Practice', '$_highScorePractice'),
          ],
        ),
      ],
    );
  }

  Widget _buildStatRow(String label, String val) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          Text(val, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildHighPill(String title, String val) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: CareerPathApp.getBorderColor(context)),
      ),
      child: Column(
        children: [
          Text(title, style: const TextStyle(fontSize: 9, color: Colors.grey)),
          Text(val, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFE1A63C))),
        ],
      ),
    );
  }

  Widget _buildBadgesTab(ThemeData theme) {
    return Column(
      children: RainAchievementList.allAchievements.map((ach) {
        final unlocked = _unlockedAchievements.contains(ach.id);
        return Container(
          margin: const EdgeInsets.only(bottom: 6),
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: unlocked ? theme.colorScheme.primary.withValues(alpha: 0.1) : CareerPathApp.getCardBg(context),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: unlocked ? theme.colorScheme.primary : CareerPathApp.getBorderColor(context)),
          ),
          child: Row(
            children: [
              Text(ach.icon, style: TextStyle(fontSize: 22, color: unlocked ? null : Colors.grey)),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(ach.title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    Text(ach.desc, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                  ],
                ),
              ),
              Text(
                unlocked ? '🏆' : '🔒',
                style: const TextStyle(fontSize: 12),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSettingsTab(ThemeData theme) {
    return Column(
      children: [
        SwitchListTile(
          title: const Text('Background Music', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          value: _music,
          activeThumbColor: theme.colorScheme.primary,
          onChanged: (v) async {
            setState(() => _music = v);
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString('cp_rain_settings', json.encode({'music': v, 'sound': _sound, 'vibration': _vibration}));
          },
        ),
        SwitchListTile(
          title: const Text('Sound Effects', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          value: _sound,
          activeThumbColor: theme.colorScheme.primary,
          onChanged: (v) async {
            setState(() => _sound = v);
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString('cp_rain_settings', json.encode({'music': _music, 'sound': v, 'vibration': _vibration}));
          },
        ),
        SwitchListTile(
          title: const Text('Haptic Vibrations', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          value: _vibration,
          activeThumbColor: theme.colorScheme.primary,
          onChanged: (v) async {
            setState(() => _vibration = v);
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString('cp_rain_settings', json.encode({'music': _music, 'sound': _sound, 'vibration': v}));
          },
        ),
        const SizedBox(height: 10),
        OutlinedButton(
          onPressed: _handleResetStatistics,
          style: OutlinedButton.styleFrom(foregroundColor: Colors.redAccent),
          child: const Text('Reset Game Statistics', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }

  Widget _buildHistoryTab(ThemeData theme) {
    if (_historyLogs.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(16.0),
        child: Text('No session logs saved yet.', style: TextStyle(fontSize: 11, color: Colors.grey)),
      );
    }

    return Column(
      children: _historyLogs.take(15).map((log) {
        return Container(
          margin: const EdgeInsets.only(bottom: 6),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: CareerPathApp.getCardBg(context),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: CareerPathApp.getBorderColor(context)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${log['mode']} Mode', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  Text('${log['date']}', style: const TextStyle(fontSize: 9, color: Colors.grey)),
                ],
              ),
              Text(
                '${log['score']} pts (🪙 +${log['coins']})',
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFE1A63C)),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  // ─── 5. COUNTDOWN VIEW ────────────────────────────────────────────────
  Widget _buildCountdownView(ThemeData theme) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 80),
        child: Column(
          children: [
            Text(
              '$_countdown',
              style: TextStyle(fontFamily: 'Outfit', fontSize: 88, fontWeight: FontWeight.w900, color: theme.colorScheme.primary),
            ),
            const SizedBox(height: 10),
            const Text('PREPARE MENTAL MATHEMATICS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 1.5, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  // ─── 6. GAMEPLAY CANVAS (FALLING BUBBLES + KEYPAD) ─────────────────────
  Widget _buildGameplayCanvas(ThemeData theme) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 50),
      transform: Matrix4.translationValues(_shakeContainer ? 6.0 : 0.0, 0.0, 0.0),
      child: Column(
        children: [
          // Top HUD
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: CareerPathApp.getCardBg(context),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('SCORE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                    Text('$_score', style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                  ],
                ),
                if (_combo > 1)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(color: Colors.amber.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.amber)),
                    child: Text('x$_combo Combo', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.amber)),
                  ),
                OutlinedButton(
                  onPressed: () => setState(() => _isPaused = true),
                  style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), minimumSize: const Size(20, 28)),
                  child: const Text('⏸️ Pause', style: TextStyle(fontSize: 11)),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(_mode == 'timed' ? 'TIME REMAINING' : 'LIVES', style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                    if (_mode == 'timed')
                      Text('${max(0, _timedDuration - _gameTime.floor())}s', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14))
                    else if (_mode == 'practice')
                      const Text('UNLIMITED', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.green))
                    else
                      Row(
                        children: List.generate(3, (i) {
                          return Icon(i < _lives ? Icons.favorite : Icons.favorite_border, color: Colors.redAccent, size: 14);
                        }),
                      ),
                  ],
                ),
              ],
            ),
          ),

          // Falling Canvas
          Expanded(
            child: LayoutBuilder(
              builder: (context, constraints) {
                final width = constraints.maxWidth;
                final height = constraints.maxHeight;

                return Stack(
                  children: [
                    // Danger Zone Line at 90% height
                    Positioned(
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 16,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [Colors.redAccent.withValues(alpha: 0.0), Colors.redAccent.withValues(alpha: 0.3)],
                          ),
                        ),
                      ),
                    ),

                    // Falling Question Bubbles
                    ..._questions.map((q) {
                      final leftPos = (q.x / 100.0) * (width - 100);
                      final topPos = (q.y / 100.0) * (height - 40);

                      Color bubbleColor = const Color(0xFF3B82F6);
                      if (q.operator == '-') bubbleColor = const Color(0xFFF97316);
                      if (q.operator == '*') bubbleColor = const Color(0xFFA855F7);
                      if (q.operator == '/') bubbleColor = const Color(0xFF10B981);

                      return Positioned(
                        left: leftPos.clamp(0.0, width - 100),
                        top: topPos,
                        child: AnimatedScale(
                          duration: const Duration(milliseconds: 150),
                          scale: q.cleared ? 1.3 : 1.0,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: bubbleColor,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [BoxShadow(color: bubbleColor.withValues(alpha: 0.4), blurRadius: 10)],
                            ),
                            child: Text(
                              q.text,
                              style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.w900, fontSize: 16, color: Colors.white),
                            ),
                          ),
                        ),
                      );
                    }),
                  ],
                );
              },
            ),
          ),

          // Input Field Display
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            color: CareerPathApp.getCardBg(context),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    height: 42,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: theme.colorScheme.primary),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      _inputValue.isEmpty ? '?' : _inputValue,
                      style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                    ),
                  ),
                ),
                if (_mode == 'practice') ...[
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _endGame,
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
                    child: const Text('End', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                ],
              ],
            ),
          ),

          // 12-Key Numeric Keypad
          Container(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
            color: CareerPathApp.getCardBg(context),
            child: Column(
              children: [
                Row(
                  children: ['1', '2', '3'].map((k) => _buildKeypadBtn(k)).toList(),
                ),
                const SizedBox(height: 4),
                Row(
                  children: ['4', '5', '6'].map((k) => _buildKeypadBtn(k)).toList(),
                ),
                const SizedBox(height: 4),
                Row(
                  children: ['7', '8', '9'].map((k) => _buildKeypadBtn(k)).toList(),
                ),
                const SizedBox(height: 4),
                Row(
                  children: ['-', '0', '⌫'].map((k) => _buildKeypadBtn(k)).toList(),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Expanded(child: _buildWideKeypadBtn('Clear', const Color(0xFF6B7280))),
                    const SizedBox(width: 4),
                    Expanded(child: _buildWideKeypadBtn('Submit', theme.colorScheme.primary)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKeypadBtn(String key) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 2),
        child: ElevatedButton(
          onPressed: () => _handleKeypadPress(key),
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 10),
            backgroundColor: CareerPathApp.getCardBg(context),
            foregroundColor: Colors.white,
            side: BorderSide(color: CareerPathApp.getBorderColor(context)),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            elevation: 0,
          ),
          child: Text(key, style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }

  Widget _buildWideKeypadBtn(String label, Color color) {
    return ElevatedButton(
      onPressed: () => _handleKeypadPress(label),
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 10),
        backgroundColor: color,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
      child: Text(label, style: const TextStyle(fontFamily: 'Outfit', fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white)),
    );
  }

  // ─── 7. PAUSE MODAL ──────────────────────────────────────────────────
  Widget _buildPauseModal(ThemeData theme) {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
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
                const Text('Game Paused', style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                const Text('Your session is suspended.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                const SizedBox(height: 18),
                if (_showPauseSettings) ...[
                  SwitchListTile(
                    title: const Text('Background Music', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    value: _music,
                    activeThumbColor: theme.colorScheme.primary,
                    onChanged: (v) => setState(() => _music = v),
                  ),
                  SwitchListTile(
                    title: const Text('Sound Effects', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    value: _sound,
                    activeThumbColor: theme.colorScheme.primary,
                    onChanged: (v) => setState(() => _sound = v),
                  ),
                  SwitchListTile(
                    title: const Text('Haptic Vibration', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    value: _vibration,
                    activeThumbColor: theme.colorScheme.primary,
                    onChanged: (v) => setState(() => _vibration = v),
                  ),
                  const SizedBox(height: 10),
                  OutlinedButton(
                    onPressed: () => setState(() => _showPauseSettings = false),
                    style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 40)),
                    child: const Text('Back to Menu'),
                  ),
                ] else ...[
                  ElevatedButton(
                    onPressed: () => setState(() => _isPaused = false),
                    style: ElevatedButton.styleFrom(backgroundColor: theme.colorScheme.primary, minimumSize: const Size(double.infinity, 44)),
                    child: const Text('▶️ Resume Game', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () {
                      setState(() => _isPaused = false);
                      _handleStartGame(_mode);
                    },
                    style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 44)),
                    child: const Text('🔄 Restart'),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () => setState(() => _showPauseSettings = true),
                    style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 44)),
                    child: const Text('⚙️ Settings'),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () {
                      setState(() {
                        _isPaused = false;
                        _view = 'menu';
                      });
                    },
                    style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 44), foregroundColor: Colors.redAccent),
                    child: const Text('🚪 Quit to Hub'),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ─── 8. RESULTS VIEW ─────────────────────────────────────────────────
  Widget _buildResultsView(ThemeData theme) {
    final totalTaps = _sessionCorrect + _sessionWrong;
    final accuracy = totalTaps > 0 ? ((_sessionCorrect / totalTaps) * 100).toStringAsFixed(0) : '100';
    final rewards = getSessionRewards(_score, _mode);

    double sumTimes = 0.0;
    for (final t in _sessionAnswerTimes) {
      sumTimes += t;
    }
    final avgReaction = _sessionCorrect > 0 ? (sumTimes / _sessionCorrect).toStringAsFixed(2) : '0.00';

    return Column(
      children: [
        const SizedBox(height: 10),
        const Text('🏆', style: TextStyle(fontSize: 56)),
        const SizedBox(height: 4),
        Text(
          _mode == 'daily' ? 'Daily Challenge Complete!' : 'Game Over',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 24, fontWeight: FontWeight.w900, color: theme.colorScheme.primary),
        ),
        const Text('Here is your mental math performance report:', style: TextStyle(fontSize: 11, color: Colors.grey)),
        const SizedBox(height: 16),

        _buildCard(
          theme,
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildMetricCell('FINAL SCORE', '$_score', const Color(0xFFD946EF)),
                  _buildMetricCell('SOLVED', '$_sessionCorrect', const Color(0xFF4ADE80)),
                  _buildMetricCell('ACCURACY', '$accuracy%', const Color(0xFF38BDF8)),
                ],
              ),
              const Divider(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildMetricCell('MAX COMBO', 'x$_maxCombo', const Color(0xFFA855F7)),
                  _buildMetricCell('AVG REACTION', '${avgReaction}s', Colors.white),
                  _buildMetricCell('REWARDS', '🪙 +${rewards['coins']}\n✨ +${rewards['xp']} XP', const Color(0xFFEAB308)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        ElevatedButton(
          onPressed: () => _handleStartGame(_mode),
          style: ElevatedButton.styleFrom(backgroundColor: theme.colorScheme.primary, minimumSize: const Size(double.infinity, 46)),
          child: const Text('Play Again 🔄', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        ),
        const SizedBox(height: 8),

        OutlinedButton(
          onPressed: () => setState(() => _view = 'menu'),
          style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 44)),
          child: const Text('Home Menu'),
        ),
      ],
    );
  }

  Widget _buildMetricCell(String title, String val, Color color) {
    return Column(
      children: [
        Text(title, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 2),
        Text(val, textAlign: TextAlign.center, style: TextStyle(fontFamily: 'Outfit', fontSize: 14, fontWeight: FontWeight.bold, color: color)),
      ],
    );
  }

  Widget _buildCard(ThemeData theme, {required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: CareerPathApp.getBorderColor(context)),
      ),
      child: child,
    );
  }
}
