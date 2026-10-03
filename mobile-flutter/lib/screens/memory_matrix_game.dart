import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart';
import '../utils/memory_matrix_data.dart';
import '../utils/sound_manager.dart';

class MemoryMatrixGame extends StatefulWidget {
  final VoidCallback? onBack;

  const MemoryMatrixGame({super.key, this.onBack});

  @override
  State<MemoryMatrixGame> createState() => _MemoryMatrixGameState();
}

class _MemoryMatrixGameState extends State<MemoryMatrixGame> with SingleTickerProviderStateMixin {
  // Navigation & Tab state: 'home' | 'stats' | 'settings'
  String _activeTab = 'home';

  // Game Flow state: 'home' | 'instructions' | 'countdown' | 'playing' | 'completed' | 'gameover'
  String _flow = 'home';
  // Play Phase state: 'idle' | 'memorize' | 'recall'
  String _gameState = 'idle';
  // Mode: 'real' | 'practice' | 'time_trial'
  String _selectedMode = 'real';

  // Sound & Haptics
  bool _sound = true;
  bool _vibrate = true;

  // Economy & Resources
  int _coins = 350;
  int _xp = 527;
  int _refillsCount = 0;
  int _practiceSeconds = 0;

  // Campaign State
  int _campaignLevel = 1;
  List<int> _campaignCleared = [];
  Map<int, int> _campaignStars = {};
  int _comboStreak = 0;
  int _consecutiveCleanClears = 0;
  Map<int, double> _fastestClears = {};
  Map<int, bool> _previouslyFailedLevels = {};

  // Practice Config
  String _practiceTier = 'Heroic'; // 'Heroic' (1-10) | 'Master' (11-20) | 'Grand Master' (21-30)
  int _practiceAccTaps = 0;
  int _practiceAccCorrect = 0;

  // Time Trial Config
  String _timeTrialTier = 'Heroic'; // 'Heroic' | 'Master' | 'Grand Master'
  Map<String, int> _timeTrialPBs = {};
  int _ttPBBeats = 0;
  final Set<String> _ttCompletedTiers = {};
  int _timeTrialStopwatch = 0;
  int _timeTrialPenalties = 0;

  // Active Round Parameters
  int _currentLevel = 1;
  int _currentRound = 1;
  int _lives = 3;
  int _maxLives = 3;
  int _timeLeft = 45;
  int _score = 0;
  bool _hadMissInLevel = false;
  int _wrongTapsInLevel = 0;

  // Grid Details
  int _gridSize = 3;
  List<int> _highlightedTiles = [];
  List<int> _selectedTiles = [];
  int? _failedTile;
  bool _shakeGrid = false;

  // Refills in attempt
  int _refillsUsedInAttempt = 0;
  bool _showRefillPrompt = false;

  // Pause Menu
  bool _showPause = false;
  bool _showPauseSettings = false;

  // Achievements
  Map<String, String> _unlockedAchievements = {};
  Map<String, String>? _achievementToast;
  Timer? _toastTimer;

  // Timers & Animations
  Timer? _memorizeTimer;
  Timer? _roundTimer;
  Timer? _countdownTimer;
  Timer? _practiceIntervalTimer;
  int _countdown = 3;
  double _memorizeProgress = 1.0;
  int _roundStartTime = 0;

  @override
  void initState() {
    super.initState();
    _loadStoredData();
  }

  @override
  void dispose() {
    _memorizeTimer?.cancel();
    _roundTimer?.cancel();
    _countdownTimer?.cancel();
    _practiceIntervalTimer?.cancel();
    _toastTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadStoredData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      setState(() {
        _sound = prefs.getBool('cp_matrix_sound') ?? true;
        _vibrate = prefs.getBool('cp_matrix_vibrate') ?? true;
        _coins = prefs.getInt('cp_coins') ?? 350;
        _xp = prefs.getInt('cp_xp') ?? 527;
        _refillsCount = prefs.getInt('cp_matrix_refills_count') ?? 0;
        _practiceSeconds = prefs.getInt('cp_matrix_practice_seconds') ?? 0;
        _comboStreak = prefs.getInt('cp_matrix_combo_streak') ?? 0;
        _consecutiveCleanClears = prefs.getInt('cp_matrix_consecutive_clears') ?? 0;
        _ttPBBeats = prefs.getInt('cp_matrix_tt_pb_beats') ?? 0;

        // JSON decoded maps/lists
        final clearedStr = prefs.getString('cp_matrix_cleared');
        if (clearedStr != null) {
          _campaignCleared = (json.decode(clearedStr) as List).map((e) => (e as num).toInt()).toList();
        }

        final starsStr = prefs.getString('cp_matrix_stars');
        if (starsStr != null) {
          final rawMap = json.decode(starsStr) as Map<String, dynamic>;
          _campaignStars = rawMap.map((k, v) => MapEntry(int.parse(k), (v as num).toInt()));
        }

        final ttPbStr = prefs.getString('cp_matrix_tt_pb');
        if (ttPbStr != null) {
          final rawMap = json.decode(ttPbStr) as Map<String, dynamic>;
          _timeTrialPBs = rawMap.map((k, v) => MapEntry(k, (v as num).toInt()));
        }

        final fastestStr = prefs.getString('cp_matrix_fastest_clears');
        if (fastestStr != null) {
          final rawMap = json.decode(fastestStr) as Map<String, dynamic>;
          _fastestClears = rawMap.map((k, v) => MapEntry(int.parse(k), (v as num).toDouble()));
        }

        final failedStr = prefs.getString('cp_matrix_prev_failed');
        if (failedStr != null) {
          final rawMap = json.decode(failedStr) as Map<String, dynamic>;
          _previouslyFailedLevels = rawMap.map((k, v) => MapEntry(int.parse(k), v as bool));
        }

        final achStr = prefs.getString('cp_matrix_ach');
        if (achStr != null) {
          final rawMap = json.decode(achStr) as Map<String, dynamic>;
          _unlockedAchievements = rawMap.map((k, v) => MapEntry(k, v.toString()));
        }

        final nextLvl = _campaignCleared.length + 1;
        _campaignLevel = nextLvl <= 30 ? nextLvl : 30;
      });
    } catch (_) {}
  }

  void _triggerHaptic([int ms = 50]) {
    if (_vibrate) {
      if (ms > 100) {
        HapticFeedback.heavyImpact();
      } else {
        HapticFeedback.selectionClick();
      }
    }
  }

  void _playClickSound() {
    SoundManager.playClick(_sound, 'synth');
  }

  void _playCorrectSound() {
    SoundManager.playSuccess(_sound);
  }

  void _playWrongSound() {
    SoundManager.playError(_sound);
  }

  void _triggerAchievementUnlock(String id) async {
    final ach = MatrixAchievementList.allAchievements.firstWhere((a) => a.id == id, orElse: () => MatrixAchievementList.allAchievements.first);
    if (_unlockedAchievements.containsKey(id)) return;

    _playCorrectSound();
    final nextAch = Map<String, String>.from(_unlockedAchievements)..[id] = DateTime.now().toIso8601String();
    final nextCoins = _coins + ach.rewardCoins;
    final nextXp = _xp + ach.rewardXp;

    setState(() {
      _unlockedAchievements = nextAch;
      _coins = nextCoins;
      _xp = nextXp;
      _achievementToast = {'title': ach.title, 'desc': ach.desc};
    });

    _toastTimer?.cancel();
    _toastTimer = Timer(const Duration(seconds: 4), () {
      if (mounted) setState(() => _achievementToast = null);
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('cp_matrix_ach', json.encode(nextAch));
      await prefs.setInt('cp_coins', nextCoins);
      await prefs.setInt('cp_xp', nextXp);
    } catch (_) {}
  }

  int _getRandomPracticeLevel(String band) {
    final rand = Random();
    if (band == 'Heroic') {
      return rand.nextInt(10) + 1; // 1 to 10
    } else if (band == 'Master') {
      return rand.nextInt(10) + 11; // 11 to 20
    } else {
      return rand.nextInt(10) + 21; // 21 to 30
    }
  }

  // ─── GAME START ROUTINES ─────────────────────────────────────────────
  void _handlePlayNow() {
    _refillsUsedInAttempt = 0;
    _hadMissInLevel = false;
    _wrongTapsInLevel = 0;

    if (_selectedMode == 'real') {
      final config = MatrixPatternGenerator.getLevelConfig(_campaignLevel);
      setState(() {
        _currentLevel = _campaignLevel;
        _currentRound = 1;
        _lives = config.lives;
        _maxLives = config.lives;
      });
      _startLevelRoutine(_campaignLevel);
    } else if (_selectedMode == 'practice') {
      setState(() {
        _currentRound = 1;
        _practiceAccTaps = 0;
        _practiceAccCorrect = 0;
      });
      final matchLvl = _getRandomPracticeLevel(_practiceTier);
      setState(() => _currentLevel = matchLvl);
      _startLevelRoutine(matchLvl);
    } else if (_selectedMode == 'time_trial') {
      setState(() {
        _currentRound = 1;
        _timeTrialStopwatch = 0;
        _timeTrialPenalties = 0;
        _score = 0;
        _timeLeft = _timeTrialTier == 'Heroic' ? 20 : _timeTrialTier == 'Master' ? 18 : 15;
      });
      _startTimeTrialRoutine(_timeTrialTier, 1);
    }
  }

  void _startLevelRoutine(int lvl) {
    _memorizeTimer?.cancel();
    _roundTimer?.cancel();

    final config = MatrixPatternGenerator.getLevelConfig(lvl);
    final pattern = MatrixPatternGenerator.generatePattern(config.size, config.tiles, _highlightedTiles);

    setState(() {
      _selectedTiles = [];
      _failedTile = null;
      _flow = 'countdown';
      _countdown = 3;
      _gridSize = config.size;
      _highlightedTiles = pattern;
      if (_selectedMode == 'real') {
        _timeLeft = config.timeLimit;
      } else if (_selectedMode == 'practice') {
        _timeLeft = (config.timeLimit * 1.25).round();
      }
    });

    _startCountdownLoop(() {
      setState(() {
        _flow = 'playing';
        _gameState = 'memorize';
        _memorizeProgress = 1.0;
        _roundStartTime = DateTime.now().millisecondsSinceEpoch;
      });
      _startMemorizePhase(config.displayTime);
    });
  }

  void _startTimeTrialRoutine(String tier, int rnd) {
    _memorizeTimer?.cancel();
    _roundTimer?.cancel();

    final size = tier == 'Heroic' ? 5 : tier == 'Master' ? 6 : 7;
    final patterns = MatrixPatternGenerator.timeTrialPatterns[tier == 'Heroic' ? 'Heroic' : tier == 'Master' ? 'Master' : 'GrandMaster']!;
    final pattern = patterns[rnd - 1];

    setState(() {
      _selectedTiles = [];
      _failedTile = null;
      _flow = 'countdown';
      _countdown = 3;
      _gridSize = size;
      _highlightedTiles = pattern;
      _timeLeft = tier == 'Heroic' ? 20 : tier == 'Master' ? 18 : 15;
    });

    final double displayTime = tier == 'Heroic' ? 3.0 : tier == 'Master' ? 4.5 : 6.0;

    _startCountdownLoop(() {
      setState(() {
        _flow = 'playing';
        _gameState = 'memorize';
        _memorizeProgress = 1.0;
        _roundStartTime = DateTime.now().millisecondsSinceEpoch;
      });
      _startMemorizePhase(displayTime);
    });
  }

  void _startCountdownLoop(VoidCallback onComplete) {
    _countdownTimer?.cancel();
    _playClickSound();

    _countdownTimer = Timer.periodic(const Duration(milliseconds: 800), (timer) {
      if (!mounted) return;
      if (_countdown > 1) {
        _playClickSound();
        setState(() => _countdown--);
      } else {
        timer.cancel();
        onComplete();
      }
    });
  }

  void _startMemorizePhase(double displayTime) {
    const stepMs = 50;
    final totalSteps = (displayTime * 1000) / stepMs;
    final decrement = 1.0 / totalSteps;

    _memorizeTimer = Timer.periodic(Duration(milliseconds: stepMs), (timer) {
      if (!mounted || _showPause) return;
      if (_memorizeProgress <= decrement) {
        timer.cancel();
        _startRecallPhase();
      } else {
        setState(() => _memorizeProgress -= decrement);
      }
    });
  }

  void _startRecallPhase() {
    setState(() {
      _gameState = 'recall';
      _roundStartTime = DateTime.now().millisecondsSinceEpoch;
    });

    _roundTimer?.cancel();
    _roundTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted || _showPause) return;

      if (_selectedMode == 'time_trial') {
        setState(() => _timeTrialStopwatch++);
        if (_timeLeft <= 1) {
          timer.cancel();
          _handleTimeTrialRoundTimeout();
        } else {
          setState(() => _timeLeft--);
        }
      } else {
        if (_selectedMode == 'practice') {
          setState(() => _practiceSeconds++);
          if (_practiceSeconds >= 1800 && !_unlockedAchievements.containsKey('dedicated')) {
            _triggerAchievementUnlock('dedicated');
          }
        }

        if (_timeLeft <= 1) {
          timer.cancel();
          _handleTimeLimitExpired();
        } else {
          setState(() => _timeLeft--);
        }
      }
    });
  }

  // ─── TILE SELECTION HANDLER ───────────────────────────────────────────
  void _handleTileSelect(int idx) {
    if (_flow != 'playing' || _gameState != 'recall' || _showPause) return;
    if (_failedTile != null || _selectedTiles.length == _highlightedTiles.length) return;
    if (_selectedTiles.contains(idx) || _failedTile == idx) return;

    if (_selectedMode == 'practice') {
      setState(() => _practiceAccTaps++);
    }

    _playClickSound();

    if (_highlightedTiles.contains(idx)) {
      // Correct Tap
      if (_selectedMode == 'practice') {
        setState(() => _practiceAccCorrect++);
      }

      _triggerHaptic(40);
      final nextSelected = [..._selectedTiles, idx];
      setState(() {
        _selectedTiles = nextSelected;
        _score += 10 * _currentLevel;
      });

      if (nextSelected.length == _highlightedTiles.length) {
        _roundTimer?.cancel();
        _playCorrectSound();
        final duration = DateTime.now().millisecondsSinceEpoch - _roundStartTime;

        if (_selectedMode == 'real') {
          _handleRealModeRoundComplete(duration);
        } else if (_selectedMode == 'practice') {
          _triggerPracticeModeNextRep(true);
        } else if (_selectedMode == 'time_trial') {
          if (_currentRound < 10) {
            final nextRnd = _currentRound + 1;
            setState(() => _currentRound = nextRnd);
            Future.delayed(const Duration(milliseconds: 1000), () {
              if (mounted) _startTimeTrialRoutine(_timeTrialTier, nextRnd);
            });
          } else {
            _handleTimeTrialComplete();
          }
        }
      }
    } else {
      // Wrong Tap
      _triggerHaptic(200);
      _playWrongSound();
      setState(() {
        _failedTile = idx;
        _shakeGrid = true;
      });

      Future.delayed(const Duration(milliseconds: 600), () {
        if (!mounted) return;
        setState(() => _shakeGrid = false);

        if (_selectedMode == 'real') {
          _handleIncorrectMatchAttempt();
        } else if (_selectedMode == 'practice') {
          _triggerPracticeModeNextRep(false);
        } else if (_selectedMode == 'time_trial') {
          setState(() {
            _timeTrialStopwatch += 3;
            _timeTrialPenalties += 3;
            _failedTile = null;
          });
        }
      });
    }
  }

  void _handleRealModeRoundComplete(int roundDuration) {
    final config = MatrixPatternGenerator.getLevelConfig(_currentLevel);
    final accuracy = _highlightedTiles.length / (_highlightedTiles.length + _wrongTapsInLevel);
    final speed = max(0.0, (config.timeLimit - roundDuration / 1000) / config.timeLimit);

    int nextCombo = 0;
    if (!_hadMissInLevel) {
      nextCombo = _comboStreak + 1;
      final clearTimeSec = double.parse((roundDuration / 1000).toStringAsFixed(2));
      final currentBest = _fastestClears[_currentLevel];
      if (currentBest == null || clearTimeSec < currentBest) {
        _fastestClears[_currentLevel] = clearTimeSec;
      }
      if (nextCombo >= 10 && !_unlockedAchievements.containsKey('sharp_eye')) {
        _triggerAchievementUnlock('sharp_eye');
      }
    } else {
      nextCombo = 0;
    }

    final starsEarned = MatrixScoreManager.calculateLevelStars(config.tier, accuracy, speed);
    final xpPayout = MatrixScoreManager.calculateXpEarned(config.minTiles);
    final isFirstClear = !_campaignCleared.contains(_currentLevel);
    final coinsPayout = MatrixScoreManager.calculateCoinsEarned(config.tier, starsEarned, nextCombo) + (isFirstClear ? 15 : 0);

    final nextCoins = _coins + coinsPayout;
    final nextXp = _xp + xpPayout;
    final nextCleared = isFirstClear ? [..._campaignCleared, _currentLevel] : _campaignCleared;
    final nextStars = Map<int, int>.from(_campaignStars)..[_currentLevel] = max(_campaignStars[_currentLevel] ?? 0, starsEarned);

    int nextCleanClears = _consecutiveCleanClears;
    if (starsEarned == 3 && !_hadMissInLevel) {
      nextCleanClears += 1;
    } else {
      nextCleanClears = 0;
    }

    setState(() {
      _comboStreak = nextCombo;
      _coins = nextCoins;
      _xp = nextXp;
      _campaignCleared = nextCleared;
      _campaignStars = nextStars;
      _consecutiveCleanClears = nextCleanClears;
      _flow = 'completed';
    });

    _saveRealModeState(nextCoins, nextXp, nextCleared, nextStars, nextCombo, nextCleanClears);
    _runPostLevelAchievementsCheck(nextCleared, nextStars, nextCleanClears);
  }

  Future<void> _saveRealModeState(int coins, int xp, List<int> cleared, Map<int, int> stars, int combo, int cleanClears) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('cp_coins', coins);
      await prefs.setInt('cp_xp', xp);
      await prefs.setString('cp_matrix_cleared', json.encode(cleared));
      await prefs.setString('cp_matrix_stars', json.encode(stars.map((k, v) => MapEntry(k.toString(), v))));
      await prefs.setInt('cp_matrix_combo_streak', combo);
      await prefs.setInt('cp_matrix_consecutive_clears', cleanClears);
      await prefs.setString('cp_matrix_fastest_clears', json.encode(_fastestClears.map((k, v) => MapEntry(k.toString(), v))));
    } catch (_) {}
  }

  void _runPostLevelAchievementsCheck(List<int> cleared, Map<int, int> stars, int cleanClearsCount) {
    if (cleared.contains(1) && !_unlockedAchievements.containsKey('first_steps')) {
      _triggerAchievementUnlock('first_steps');
    }
    final allHeroicCleared = List.generate(10, (i) => i + 1).every((l) => cleared.contains(l));
    if (allHeroicCleared && !_unlockedAchievements.containsKey('heroic_champ')) {
      _triggerAchievementUnlock('heroic_champ');
    }
    final allMasterCleared = List.generate(10, (i) => i + 11).every((l) => cleared.contains(l));
    if (allMasterCleared && !_unlockedAchievements.containsKey('master_champ')) {
      _triggerAchievementUnlock('master_champ');
    }
    if (cleared.contains(30) && !_unlockedAchievements.containsKey('grand_master')) {
      _triggerAchievementUnlock('grand_master');
    }
    if (cleanClearsCount >= 5 && !_unlockedAchievements.containsKey('flawless_five')) {
      _triggerAchievementUnlock('flawless_five');
    }
    final allHeroic3Stars = List.generate(10, (i) => i + 1).every((l) => stars[l] == 3);
    if (allHeroic3Stars && !_unlockedAchievements.containsKey('perfectionist_heroic')) {
      _triggerAchievementUnlock('perfectionist_heroic');
    }
    final allMaster3Stars = List.generate(10, (i) => i + 11).every((l) => stars[l] == 3);
    if (allMaster3Stars && !_unlockedAchievements.containsKey('perfectionist_master')) {
      _triggerAchievementUnlock('perfectionist_master');
    }
    final allGm3Stars = List.generate(10, (i) => i + 21).every((l) => stars[l] == 3);
    if (allGm3Stars && !_unlockedAchievements.containsKey('perfectionist_gm')) {
      _triggerAchievementUnlock('perfectionist_gm');
    }
    if (_previouslyFailedLevels.containsKey(_currentLevel) && !_unlockedAchievements.containsKey('comeback')) {
      _triggerAchievementUnlock('comeback');
      _previouslyFailedLevels.remove(_currentLevel);
    }
    if (cleared.contains(30) && _refillsCount == 0 && !_unlockedAchievements.containsKey('no_regrets')) {
      _triggerAchievementUnlock('no_regrets');
    }
  }

  void _handleIncorrectMatchAttempt() {
    setState(() {
      _hadMissInLevel = true;
      _wrongTapsInLevel++;
    });

    if (_lives > 1) {
      setState(() {
        _lives--;
        _selectedTiles = [];
        _failedTile = null;
        _roundStartTime = DateTime.now().millisecondsSinceEpoch;
      });
    } else {
      if (_refillsUsedInAttempt < 3 && _coins >= 50) {
        setState(() => _showRefillPrompt = true);
      } else {
        _handleLevelFailedOutright();
      }
    }
  }

  void _handleLevelFailedOutright() async {
    setState(() {
      _lives = 0;
      _comboStreak = 0;
      _flow = 'gameover';
      _previouslyFailedLevels[_currentLevel] = true;
    });
    _playWrongSound();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('cp_matrix_combo_streak', 0);
      await prefs.setString('cp_matrix_prev_failed', json.encode(_previouslyFailedLevels.map((k, v) => MapEntry(k.toString(), v))));
    } catch (_) {}
  }

  void _handleRefillLives() async {
    if (_coins >= 50 && _refillsUsedInAttempt < 3) {
      final nextCoins = _coins - 50;
      final nextRefillsTotal = _refillsCount + 1;

      setState(() {
        _coins = nextCoins;
        _refillsUsedInAttempt++;
        _refillsCount = nextRefillsTotal;
        _lives = 1;
        _showRefillPrompt = false;
        _selectedTiles = [];
        _failedTile = null;
        _roundStartTime = DateTime.now().millisecondsSinceEpoch;
      });

      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setInt('cp_coins', nextCoins);
        await prefs.setInt('cp_matrix_refills_count', nextRefillsTotal);
      } catch (_) {}
    }
  }

  void _handleTimeLimitExpired() {
    _triggerHaptic(250);
    _playWrongSound();
    setState(() => _shakeGrid = true);

    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      setState(() => _shakeGrid = false);
      if (_selectedMode == 'practice') {
        _triggerPracticeModeNextRep(false);
      } else {
        _handleIncorrectMatchAttempt();
      }
    });
  }

  void _handleTimeTrialRoundTimeout() {
    _playWrongSound();
    _triggerHaptic(250);
    setState(() => _shakeGrid = true);

    final untapped = _highlightedTiles.where((idx) => !_selectedTiles.contains(idx)).length;
    final penalty = untapped * 3;

    if (penalty > 0) {
      setState(() {
        _timeTrialStopwatch += penalty;
        _timeTrialPenalties += penalty;
      });
    }

    setState(() => _gameState = 'idle'); // Show missed tiles in amber

    Future.delayed(const Duration(milliseconds: 1200), () {
      if (!mounted) return;
      setState(() => _shakeGrid = false);
      if (_currentRound < 10) {
        final nextRnd = _currentRound + 1;
        setState(() => _currentRound = nextRnd);
        _startTimeTrialRoutine(_timeTrialTier, nextRnd);
      } else {
        _handleTimeTrialComplete();
      }
    });
  }

  void _handleTimeTrialComplete() async {
    _playCorrectSound();
    final finalScoreTime = _timeTrialStopwatch;
    final personalBest = _timeTrialPBs[_timeTrialTier];
    final isNewPB = personalBest == null || finalScoreTime < personalBest;

    int nextBeats = _ttPBBeats;
    if (isNewPB) {
      nextBeats++;
      _timeTrialPBs[_timeTrialTier] = finalScoreTime;
    }

    _ttCompletedTiers.add(_timeTrialTier);

    setState(() {
      _ttPBBeats = nextBeats;
      _timeLeft = finalScoreTime;
      _flow = 'gameover';
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('cp_matrix_tt_pb_beats', nextBeats);
      await prefs.setString('cp_matrix_tt_pb', json.encode(_timeTrialPBs));
    } catch (_) {}

    if (nextBeats >= 5 && !_unlockedAchievements.containsKey('speed_demon')) {
      _triggerAchievementUnlock('speed_demon');
    }
    if (_ttCompletedTiers.contains('Heroic') && _ttCompletedTiers.contains('Master') && _ttCompletedTiers.contains('Grand Master') && !_unlockedAchievements.containsKey('marathoner')) {
      _triggerAchievementUnlock('marathoner');
    }
  }

  void _triggerPracticeModeNextRep(bool success) {
    setState(() => _gameState = 'idle');
    _triggerHaptic(success ? 40 : 150);

    Future.delayed(const Duration(milliseconds: 1200), () {
      if (!mounted) return;
      final matchLvl = _getRandomPracticeLevel(_practiceTier);
      setState(() => _currentLevel = matchLvl);
      _startLevelRoutine(matchLvl);
    });
  }

  // ─── ROOT BUILD ───────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final user = CareerPathApp.of(context)?.user;

    return PopScope(
      canPop: _flow == 'home',
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) {
          if (_flow == 'playing' || _flow == 'countdown') {
            setState(() {
              _showPause = !_showPause;
              _showPauseSettings = false;
            });
          } else {
            setState(() => _flow = 'home');
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
                    _buildHeader(theme, user),

                    // Main Content
                    Expanded(
                      child: SingleChildScrollView(
                        padding: EdgeInsets.fromLTRB(20, 10, 20, _flow == 'home' ? 80 : 20),
                        child: _buildFlowContent(theme),
                      ),
                    ),
                  ],
                ),

                // Toast Notification
                if (_achievementToast != null) _buildAchievementToast(),

                // Mid-attempt Life Refill Dialog
                if (_showRefillPrompt) _buildRefillPromptOverlay(theme),

                // Pause Modal Overlay
                if (_showPause) _buildPauseOverlay(theme),
              ],
            ),
          ),
        ),
        bottomNavigationBar: _flow == 'home' ? _buildBottomNavBar(theme) : null,
      ),
    );
  }

  // ─── 1. TOP HEADER ────────────────────────────────────────────────────
  Widget _buildHeader(ThemeData theme, Map<String, dynamic>? user) {
    final displayName = user?['displayName']?.toString() ?? user?['name']?.toString() ?? 'Sai';
    final initial = displayName.isNotEmpty ? displayName[0].toUpperCase() : 'S';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        border: Border(bottom: BorderSide(color: CareerPathApp.getBorderColor(context))),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.15),
            child: Text(
              initial,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: theme.colorScheme.primary),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  displayName,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    'Lvl ${_campaignCleared.length} / 30',
                    style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 4),

          // Coins Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF8E7),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFF0D597)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('🪙', style: TextStyle(fontSize: 10)),
                const SizedBox(width: 3),
                Text('$_coins', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFD4901A))),
              ],
            ),
          ),
          const SizedBox(width: 4),

          // XP Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
            decoration: BoxDecoration(
              color: const Color(0xFFF0F5F9),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFC4D7E6)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('⭐', style: TextStyle(fontSize: 10)),
                const SizedBox(width: 3),
                Text('$_xp', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF4A90E2))),
              ],
            ),
          ),
          const SizedBox(width: 2),

          // Close / Back
          IconButton(
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(minWidth: 28, minHeight: 28),
            icon: const Icon(Icons.close, size: 18),
            onPressed: () {
              if (widget.onBack != null) {
                widget.onBack!();
              } else {
                Navigator.of(context).pop();
              }
            },
          ),
        ],
      ),
    );
  }

  // ─── 2. FLOW CONTENT ROUTER ──────────────────────────────────────────
  Widget _buildFlowContent(ThemeData theme) {
    switch (_flow) {
      case 'home':
        return _buildHomeTabView(theme);
      case 'instructions':
        return _buildInstructionsView(theme);
      case 'countdown':
        return _buildCountdownView(theme);
      case 'playing':
        return _buildPlayingView(theme);
      case 'completed':
        return _buildCompletedView(theme);
      case 'gameover':
        return _buildGameOverView(theme);
      default:
        return _buildHomeTabView(theme);
    }
  }

  // ─── 3. TAB 1: HOME & MODES ──────────────────────────────────────────
  Widget _buildHomeTabView(ThemeData theme) {
    if (_activeTab == 'stats') return _buildStatsTab(theme);
    if (_activeTab == 'settings') return _buildSettingsTab(theme);

    final isTimeTrialUnlocked = _campaignCleared.contains(30);
    final totalStars = _campaignStars.values.fold(0, (acc, v) => acc + v);

    return Column(
      children: [
        // Brain Logo & Title
        const SizedBox(height: 10),
        const Text('🧠', style: TextStyle(fontSize: 56)),
        const SizedBox(height: 4),
        Text(
          'MEMORY MATRIX',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 26, fontWeight: FontWeight.w900, color: theme.colorScheme.primary),
        ),
        const Text(
          'Train Spatial Memory Configurations',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.grey),
        ),
        const SizedBox(height: 20),

        // Mode 1: Real Campaign Mode Card
        _buildThemeCard(
          theme,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('🛡️ Real Mode', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  Text(
                    'Lvl ${_campaignCleared.length + 1 <= 30 ? _campaignCleared.length + 1 : 30} / 30',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              const Text('Climb all 30 levels, earn stars, coins, and XP.', style: TextStyle(fontSize: 11, color: Colors.grey)),
              const SizedBox(height: 10),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: _campaignCleared.length / 30.0,
                  minHeight: 6,
                  backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.15),
                  valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
                ),
              ),
              const SizedBox(height: 14),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _selectedMode = 'real';
                    _flow = 'instructions';
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.primary,
                  minimumSize: const Size(double.infinity, 44),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: Text(
                  'CONTINUE CAMPAIGN (Lvl ${_campaignCleared.length + 1 <= 30 ? _campaignCleared.length + 1 : 30}) ➔',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Mode 2: Practice Mode Card
        _buildThemeCard(
          theme,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('🏋️ Practice Mode', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              const Text('Risk-free training, no lives, no penalties.', style: TextStyle(fontSize: 11, color: Colors.grey)),
              const SizedBox(height: 14),
              OutlinedButton(
                onPressed: () {
                  setState(() {
                    _selectedMode = 'practice';
                    _flow = 'instructions';
                  });
                },
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 44),
                  side: BorderSide(color: theme.colorScheme.primary, width: 1.5),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: Text(
                  'START PRACTICE ➔',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: theme.colorScheme.primary),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Mode 3: Time Trial Mode Card
        _buildThemeCard(
          theme,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('⏱️ Time Trial Mode', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  if (!isTimeTrialUnlocked)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: const Color(0xFFD26E6E), borderRadius: BorderRadius.circular(8)),
                      child: const Text('LOCKED (Lvl 30)', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                ],
              ),
              const SizedBox(height: 4),
              const Text('Race a fixed pattern set for your best time.', style: TextStyle(fontSize: 11, color: Colors.grey)),
              const SizedBox(height: 14),
              ElevatedButton(
                onPressed: isTimeTrialUnlocked
                    ? () {
                        setState(() {
                          _selectedMode = 'time_trial';
                          _flow = 'instructions';
                        });
                      }
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE1A63C),
                  disabledBackgroundColor: Colors.grey.withValues(alpha: 0.2),
                  minimumSize: const Size(double.infinity, 44),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: Text(
                  isTimeTrialUnlocked ? 'START TIME TRIAL ➔' : 'LOCKED UNTIL LEVEL 30',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Profile Statistics Summary Card
        _buildThemeCard(
          theme,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Profile Statistics', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStatPill('Campaign Stars', '⭐ $totalStars', const Color(0xFFE1A63C)),
                  Container(width: 1, height: 32, color: CareerPathApp.getBorderColor(context)),
                  _buildStatPill(
                    'Chapters Unlocked',
                    _campaignCleared.length >= 20 ? '3 / 3' : _campaignCleared.length >= 10 ? '2 / 3' : '1 / 3',
                    theme.colorScheme.primary,
                  ),
                  Container(width: 1, height: 32, color: CareerPathApp.getBorderColor(context)),
                  _buildStatPill('Time Trial PBs', '⏱️ ${_timeTrialPBs.length}', theme.colorScheme.primary),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatPill(String title, String value, Color color) {
    return Column(
      children: [
        Text(title, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: color)),
      ],
    );
  }

  // ─── 4. TAB 2: ACHIEVEMENTS & STATS ──────────────────────────────────
  Widget _buildStatsTab(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 10),
        const Text(
          'Achievements Unlocked',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 14),
        ...MatrixAchievementList.allAchievements.map((ach) {
          final isUnlocked = _unlockedAchievements.containsKey(ach.id);
          String progressString = '';
          if (ach.id == 'speed_demon') {
            progressString = '($_ttPBBeats / 5)';
          } else if (ach.id == 'dedicated') {
            progressString = '(${(_practiceSeconds / 60).round()} / 30 mins)';
          }

          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isUnlocked ? theme.colorScheme.primary.withValues(alpha: 0.1) : CareerPathApp.getCardBg(context),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isUnlocked ? theme.colorScheme.primary : CareerPathApp.getBorderColor(context),
                width: isUnlocked ? 1.5 : 1.0,
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(ach.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          if (progressString.isNotEmpty) ...[
                            const SizedBox(width: 4),
                            Text(progressString, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                          ],
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(ach.desc, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                      const SizedBox(height: 2),
                      Text(
                        'Reward: +${ach.rewardCoins} 🪙 ${ach.rewardXp > 0 ? "+${ach.rewardXp} XP" : ""}',
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFE1A63C)),
                      ),
                    ],
                  ),
                ),
                Text(
                  isUnlocked ? '🏆 UNLOCKED' : '🔒 LOCKED',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: isUnlocked ? theme.colorScheme.primary : Colors.grey,
                  ),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }

  // ─── 5. TAB 3: SETTINGS ──────────────────────────────────────────────
  Widget _buildSettingsTab(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 10),
        const Text(
          'System Settings',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 14),
        _buildThemeCard(
          theme,
          child: Column(
            children: [
              SwitchListTile(
                title: const Text('🔊 Audio Feedback', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                subtitle: const Text('Synthesizer sound waves on tap', style: TextStyle(fontSize: 11, color: Colors.grey)),
                value: _sound,
                activeColor: theme.colorScheme.primary,
                onChanged: (val) async {
                  setState(() => _sound = val);
                  final prefs = await SharedPreferences.getInstance();
                  await prefs.setBool('cp_matrix_sound', val);
                },
              ),
              Divider(color: CareerPathApp.getBorderColor(context)),
              SwitchListTile(
                title: const Text('📳 Haptic Vibrate', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                subtitle: const Text('Vibration feedbacks on click', style: TextStyle(fontSize: 11, color: Colors.grey)),
                value: _vibrate,
                activeColor: theme.colorScheme.primary,
                onChanged: (val) async {
                  setState(() => _vibrate = val);
                  final prefs = await SharedPreferences.getInstance();
                  await prefs.setBool('cp_matrix_vibrate', val);
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ─── 6. INSTRUCTIONS VIEW ─────────────────────────────────────────────
  Widget _buildInstructionsView(ThemeData theme) {
    final config = MatrixPatternGenerator.getLevelConfig(_campaignLevel);

    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => setState(() => _flow = 'home'),
            ),
            const Text('Instructions', style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(width: 48),
          ],
        ),
        const SizedBox(height: 10),

        _buildThemeCard(
          theme,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (_selectedMode == 'real') ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('🛡️ Real Mode Campaign', style: TextStyle(fontFamily: 'Outfit', fontSize: 17, fontWeight: FontWeight.w900, color: theme.colorScheme.primary)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: const Color(0xFFE1A63C), borderRadius: BorderRadius.circular(8)),
                      child: const Text('REAL', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                const Text('SELECT LEVEL', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    ElevatedButton(
                      onPressed: _campaignLevel > 1 ? () => setState(() => _campaignLevel--) : null,
                      style: ElevatedButton.styleFrom(shape: const CircleBorder(), padding: const EdgeInsets.all(10)),
                      child: const Text('-', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    ),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: CareerPathApp.getCardBg(context),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: CareerPathApp.getBorderColor(context)),
                        ),
                        child: Text(
                          'Level $_campaignLevel',
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: _campaignLevel < min(30, _campaignCleared.length + 1) ? () => setState(() => _campaignLevel++) : null,
                      style: ElevatedButton.styleFrom(shape: const CircleBorder(), padding: const EdgeInsets.all(10)),
                      child: const Text('+', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Center(
                  child: Text(
                    _campaignLevel <= 10 ? '🟢 Chapter 1 (Lvl 1-10)' : _campaignLevel <= 20 ? '🟡 Chapter 2 (Lvl 11-20)' : '🔴 Chapter 3 (Lvl 21-30)',
                    style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Colors.grey),
                  ),
                ),
                const SizedBox(height: 14),

                // Grid Details Table
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: CareerPathApp.getBorderColor(context)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildSpecCell('Grid Size', '${config.size} × ${config.size}', theme.colorScheme.primary),
                      _buildSpecCell('Target Tiles', '${config.tiles} Tiles', theme.colorScheme.primary),
                      _buildSpecCell('Initial Lives', '${config.lives} ${config.lives > 1 ? "Lives" : "Life"}', const Color(0xFFE1A63C)),
                      _buildSpecCell('Time Limit', '${config.timeLimit}s', const Color(0xFFE1A63C)),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                const Text(
                  '👑 Economy: Earns Coins, XP, and Campaign Stars. Consumes attempts/lives.\n🪙 Refills: Flat 50 🪙 per life refill (max 3 purchases per attempt).',
                  style: TextStyle(fontSize: 11, color: Colors.grey, height: 1.4),
                ),
              ],

              if (_selectedMode == 'practice') ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('🏋️ Practice Mode', style: TextStyle(fontFamily: 'Outfit', fontSize: 17, fontWeight: FontWeight.w900, color: theme.colorScheme.primary)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: const Color(0xFFE1A63C), borderRadius: BorderRadius.circular(8)),
                      child: const Text('PRACTICE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                const Text('SELECT PRACTICE BAND', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                const SizedBox(height: 8),
                ...[
                  {'id': 'Heroic', 'label': 'Chapter 1 (Levels 1–10)', 'req': 0},
                  {'id': 'Master', 'label': 'Chapter 2 (Levels 11–20)', 'req': 10},
                  {'id': 'Grand Master', 'label': 'Chapter 3 (Levels 21–30)', 'req': 20},
                ].map((item) {
                  final req = item['req'] as int;
                  final isUnlocked = _campaignCleared.length >= req;
                  final isSelected = _practiceTier == item['id'];

                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: OutlinedButton(
                      onPressed: isUnlocked ? () => setState(() => _practiceTier = item['id'] as String) : null,
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        side: BorderSide(color: isSelected ? theme.colorScheme.primary : CareerPathApp.getBorderColor(context), width: isSelected ? 2 : 1),
                        backgroundColor: isSelected ? theme.colorScheme.primary.withValues(alpha: 0.1) : null,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(item['label'] as String, style: TextStyle(fontWeight: FontWeight.bold, color: isSelected ? theme.colorScheme.primary : null)),
                          if (!isUnlocked)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(color: const Color(0xFFD26E6E), borderRadius: BorderRadius.circular(6)),
                              child: Text('LOCKED (Lvl $req)', style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white)),
                            ),
                        ],
                      ),
                    ),
                  );
                }),
                const SizedBox(height: 8),
                const Text(
                  '🧠 Risk-Free: Infinite lives, no penalties.\n⏱️ Relaxed: Recall time is 1.25x of Real Mode. Missed tiles are shown in amber for 1.2s.',
                  style: TextStyle(fontSize: 11, color: Colors.grey, height: 1.4),
                ),
              ],

              if (_selectedMode == 'time_trial') ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('⏱️ Time Trial Mode', style: TextStyle(fontFamily: 'Outfit', fontSize: 17, fontWeight: FontWeight.w900, color: theme.colorScheme.primary)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: const Color(0xFFE1A63C), borderRadius: BorderRadius.circular(8)),
                      child: const Text('TRIAL', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                const Text('SELECT CHALLENGE TIER', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _buildTierTab(theme, 'Heroic', 'Heroic (5x5)'),
                    const SizedBox(width: 6),
                    _buildTierTab(theme, 'Master', 'Master (6x6)'),
                    const SizedBox(width: 6),
                    _buildTierTab(theme, 'Grand Master', 'GM (7x7)'),
                  ],
                ),
                const SizedBox(height: 14),
                const Text(
                  '🏁 10 Fixed Rounds: Race through 10 static, pre-defined spatial patterns.\n⚠️ Penalties: +3s added to total stopwatch time per wrong tap or untapped tile.',
                  style: TextStyle(fontSize: 11, color: Colors.grey, height: 1.4),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Pulsating Circular "PLAY NOW" Button
        Center(
          child: ElevatedButton(
            onPressed: _handlePlayNow,
            style: ElevatedButton.styleFrom(
              shape: const CircleBorder(),
              padding: const EdgeInsets.all(28),
              backgroundColor: theme.colorScheme.primary,
              elevation: 8,
            ),
            child: const Text(
              'PLAY\nNOW',
              textAlign: TextAlign.center,
              style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.w900, fontSize: 15, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSpecCell(String title, String value, Color color) {
    return Column(
      children: [
        Text(title, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
        const SizedBox(height: 2),
        Text(value, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: color)),
      ],
    );
  }

  Widget _buildTierTab(ThemeData theme, String id, String label) {
    final isSelected = _timeTrialTier == id;
    return Expanded(
      child: OutlinedButton(
        onPressed: () => setState(() => _timeTrialTier = id),
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 10),
          side: BorderSide(color: isSelected ? theme.colorScheme.primary : CareerPathApp.getBorderColor(context), width: isSelected ? 2 : 1),
          backgroundColor: isSelected ? theme.colorScheme.primary.withValues(alpha: 0.1) : null,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: isSelected ? theme.colorScheme.primary : null),
        ),
      ),
    );
  }

  // ─── 7. COUNTDOWN VIEW ────────────────────────────────────────────────
  Widget _buildCountdownView(ThemeData theme) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 80),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '$_countdown',
              style: TextStyle(
                fontFamily: 'Outfit',
                fontSize: 88,
                fontWeight: FontWeight.w900,
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'RECONSTRUCTING TARGET MATRIX...',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.5, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }

  // ─── 8. GAMEPLAY VIEW (MEMORIZE & RECALL) ──────────────────────────────
  Widget _buildPlayingView(ThemeData theme) {
    final accuracy = _practiceAccTaps > 0 ? ((_practiceAccCorrect / _practiceAccTaps) * 100).round() : 100;

    return Column(
      children: [
        // Top status row
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            if (_selectedMode == 'time_trial') ...[
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('STOPWATCH', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                  Text('⏱️ ${_timeTrialStopwatch}s', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFFE1A63C))),
                  if (_timeTrialPenalties > 0)
                    Text('+${_timeTrialPenalties}s Penalty', style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFFD26E6E))),
                ],
              ),
              Column(
                children: [
                  const Text('ROUND', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                  Text('$_currentRound / 10', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text('ROUND TIMER', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                  Text('⏳ ${_timeLeft}s', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                ],
              ),
            ] else ...[
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('SCORE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                  Text('$_score', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: theme.colorScheme.primary)),
                ],
              ),
              Column(
                children: [
                  Text(_gameState == 'recall' ? 'TIME LIMIT' : 'ROUND', style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                  Text(
                    _gameState == 'recall' ? '⏳ ${_timeLeft}s' : (_selectedMode == 'practice' ? 'Practice' : '$_currentRound / 1'),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              OutlinedButton.icon(
                icon: const Icon(Icons.pause, size: 14),
                label: const Text('Pause', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                onPressed: () => setState(() => _showPause = true),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 12),

        // Memorization Decay Bar
        if (_gameState == 'memorize')
          ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: LinearProgressIndicator(
              value: _memorizeProgress,
              minHeight: 5,
              backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.15),
              valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
            ),
          ),
        const SizedBox(height: 8),

        // Instruction helper banner
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: _gameState == 'memorize' ? const Color(0xFFEBF5FC) : const Color(0xFFEAF4EC),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: _gameState == 'memorize' ? const Color(0xFFC2E0F4) : CareerPathApp.getBorderColor(context)),
          ),
          child: Text(
            _gameState == 'memorize' ? '👀 Memorize highlighted patterns...' : '👇 Tap recalled locations',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: _gameState == 'memorize' ? const Color(0xFF2A82B9) : theme.colorScheme.primary,
            ),
          ),
        ),
        const SizedBox(height: 14),

        // Interactive Matrix Grid
        AnimatedSlide(
          offset: Offset(_shakeGrid ? 0.02 : 0.0, 0),
          duration: const Duration(milliseconds: 50),
          child: AspectRatio(
            aspectRatio: 1.0,
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: CareerPathApp.getCardBg(context),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: CareerPathApp.getBorderColor(context)),
              ),
              child: GridView.builder(
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: _gridSize,
                  crossAxisSpacing: _gridSize > 5 ? 4 : 8,
                  mainAxisSpacing: _gridSize > 5 ? 4 : 8,
                ),
                itemCount: _gridSize * _gridSize,
                itemBuilder: (context, idx) {
                  final isHighlighted = _highlightedTiles.contains(idx);
                  final isSelected = _selectedTiles.contains(idx);
                  final isFailed = _failedTile == idx;

                  Color bg = Colors.transparent;
                  Border border = Border.all(color: CareerPathApp.getBorderColor(context), width: 1.5);
                  Color iconColor = theme.colorScheme.primary.withValues(alpha: 0.2);

                  if (_gameState == 'memorize' && isHighlighted) {
                    bg = theme.colorScheme.primary;
                    border = Border.all(color: theme.colorScheme.primary, width: 2);
                    iconColor = Colors.white;
                  } else if (isSelected) {
                    bg = const Color(0xFF4B7E58);
                    border = Border.all(color: const Color(0xFF4B7E58), width: 2);
                    iconColor = Colors.white;
                  } else if (isFailed) {
                    bg = const Color(0xFFD26E6E);
                    border = Border.all(color: const Color(0xFFD26E6E), width: 2);
                    iconColor = Colors.white;
                  } else if (_gameState == 'idle' && isHighlighted && !isSelected) {
                    bg = const Color(0xFFE1A63C); // Amber missed tiles
                    border = Border.all(color: const Color(0xFFE1A63C), width: 2);
                    iconColor = Colors.white;
                  }

                  return GestureDetector(
                    onTap: () => _handleTileSelect(idx),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      decoration: BoxDecoration(
                        color: bg,
                        borderRadius: BorderRadius.circular(12),
                        border: border,
                      ),
                      child: Center(
                        child: isSelected
                            ? const Icon(Icons.check, color: Colors.white, size: 22)
                            : isFailed
                                ? const Icon(Icons.close, color: Colors.white, size: 22)
                                : Icon(Icons.eco, color: iconColor, size: _gridSize > 5 ? 18 : 24),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ),
        const SizedBox(height: 14),

        // Footer: Lives & Streak
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: CareerPathApp.getCardBg(context),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: CareerPathApp.getBorderColor(context)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (_selectedMode == 'practice')
                Row(
                  children: [
                    const Text('🎯', style: TextStyle(fontSize: 14)),
                    const SizedBox(width: 4),
                    Text('Accuracy: $accuracy%', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                  ],
                )
              else
                Row(
                  children: [
                    const Text('❤️', style: TextStyle(fontSize: 14)),
                    const SizedBox(width: 4),
                    Text(
                      _selectedMode == 'time_trial' ? '∞ Unlimited' : '$_lives / $_maxLives attempts left',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),

              if (_selectedMode == 'real')
                Row(
                  children: [
                    const Text('⚡ Streak', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFE1A63C))),
                    const SizedBox(width: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFF8E7),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: const Color(0xFFF0D597)),
                      ),
                      child: Text('$_comboStreak', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
            ],
          ),
        ),
      ],
    );
  }

  // ─── 9. LEVEL COMPLETED VIEW ──────────────────────────────────────────
  Widget _buildCompletedView(ThemeData theme) {
    final config = MatrixPatternGenerator.getLevelConfig(_currentLevel);
    final isGMCompleted = _currentLevel >= 30;
    final stars = _campaignStars[_currentLevel] ?? 3;

    return Column(
      children: [
        const SizedBox(height: 10),
        const Text('🏆', style: TextStyle(fontSize: 64)),
        const SizedBox(height: 6),
        Text(
          'Level Complete!',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 26, fontWeight: FontWeight.w900, color: theme.colorScheme.primary),
        ),
        Text(
          'You successfully cleared Level $_currentLevel',
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.grey),
        ),
        const SizedBox(height: 14),

        // Stars Row
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(3, (i) {
            final isFilled = i < stars;
            return Icon(
              Icons.star,
              size: 38,
              color: isFilled ? const Color(0xFFE1A63C) : Colors.grey.withValues(alpha: 0.3),
            );
          }),
        ),
        const SizedBox(height: 16),

        // Rewards Card
        _buildThemeCard(
          theme,
          child: Column(
            children: [
              const Text('REWARDS GAINED', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF8E7),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFF0D597)),
                    ),
                    child: Text(
                      '🪙 +${MatrixScoreManager.calculateCoinsEarned(config.tier, stars, _comboStreak) + 15} Coins',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFD4901A), fontSize: 13),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0F5F9),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFC4D7E6)),
                    ),
                    child: Text(
                      '⭐ +${MatrixScoreManager.calculateXpEarned(config.minTiles)} XP',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF4A90E2), fontSize: 13),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Next Level / Grand Master CTA
        if (!isGMCompleted) ...[
          ElevatedButton(
            onPressed: () {
              final nextLvl = _currentLevel + 1;
              setState(() {
                _campaignLevel = nextLvl;
                _currentLevel = nextLvl;
                _currentRound = 1;
                _lives = MatrixPatternGenerator.getLevelConfig(nextLvl).lives;
                _maxLives = MatrixPatternGenerator.getLevelConfig(nextLvl).lives;
              });
              _startLevelRoutine(nextLvl);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: theme.colorScheme.primary,
              minimumSize: const Size(double.infinity, 48),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: Text(
              'Next Level (Lvl ${_currentLevel + 1}) ➔',
              style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
            ),
          ),
        ] else ...[
          _buildGrandMasterCard(theme),
        ],
        const SizedBox(height: 10),

        OutlinedButton(
          onPressed: () => setState(() => _flow = 'home'),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 44),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
          child: const Text('🏠 Back to Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }

  Widget _buildGrandMasterCard(ThemeData theme) {
    return _buildThemeCard(
      theme,
      child: Column(
        children: [
          const Text('👑', style: TextStyle(fontSize: 40)),
          const SizedBox(height: 4),
          const Text(
            'MEMORY GRAND MASTER',
            style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFFE1A63C)),
          ),
          const Text('Campaign Completed Successfully!', style: TextStyle(fontSize: 11, color: Colors.grey)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFFFAD961), Color(0xFFF76B1C)]),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text('🏆 GRAND MASTER BADGE UNLOCKED', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white)),
          ),
        ],
      ),
    );
  }

  // ─── 10. GAME OVER VIEW ───────────────────────────────────────────────
  Widget _buildGameOverView(ThemeData theme) {
    final isTimeTrial = _selectedMode == 'time_trial';

    return Column(
      children: [
        const SizedBox(height: 20),
        const Text('🏁', style: TextStyle(fontSize: 56)),
        const SizedBox(height: 8),
        Text(
          isTimeTrial ? 'Time Trial Complete!' : 'Out of Lives!',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 24, fontWeight: FontWeight.w900, color: theme.colorScheme.primary),
        ),
        Text(
          isTimeTrial ? 'Run finished with +3s wrong tile penalties added.' : 'Restart or top up with coins to clear the campaign.',
          textAlign: TextAlign.center,
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
        const SizedBox(height: 20),

        _buildThemeCard(
          theme,
          child: Column(
            children: [
              if (isTimeTrial) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Final Time (incl. penalties):', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    Text('⏱️ ${_timeLeft}s', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: theme.colorScheme.primary)),
                  ],
                ),
                const Divider(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Personal Best:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    Text(
                      _timeTrialPBs[_timeTrialTier] != null ? '${_timeTrialPBs[_timeTrialTier]}s' : 'None',
                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: Color(0xFFE1A63C)),
                    ),
                  ],
                ),
              ] else ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Level Reached:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    Text('Level $_currentLevel', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
                  ],
                ),
                const Divider(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Best Stars on Level:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                    Text('⭐ ${_campaignStars[_currentLevel] ?? 0}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: Color(0xFFE1A63C))),
                  ],
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 20),

        ElevatedButton(
          onPressed: _handlePlayNow,
          style: ElevatedButton.styleFrom(
            backgroundColor: theme.colorScheme.primary,
            minimumSize: const Size(double.infinity, 48),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          child: const Text('🎮 Retry Mode', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
        ),
        const SizedBox(height: 8),

        OutlinedButton(
          onPressed: () => setState(() => _flow = 'home'),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 44),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
          child: const Text('🏠 Home Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }

  // ─── 11. MID-ATTEMPT REFILL MODAL ─────────────────────────────────────
  Widget _buildRefillPromptOverlay(ThemeData theme) {
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
                const Text('❤️', style: TextStyle(fontSize: 48)),
                const SizedBox(height: 8),
                const Text('Refill attempt?', style: TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                Text(
                  'Purchase 1 extra life to prevent resetting to Round 1!\nCost: 50 Coins flat. ($_refillsUsedInAttempt / 3 refills used)',
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
                const SizedBox(height: 18),
                ElevatedButton(
                  onPressed: _handleRefillLives,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: theme.colorScheme.primary,
                    minimumSize: const Size(double.infinity, 44),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Buy 1 Life (50 🪙)', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                ),
                const SizedBox(height: 8),
                OutlinedButton(
                  onPressed: () {
                    setState(() => _showRefillPrompt = false);
                    _handleLevelFailedOutright();
                  },
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 44),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Decline & Restart Level', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ─── 12. PAUSE MODAL OVERLAY ──────────────────────────────────────────
  Widget _buildPauseOverlay(ThemeData theme) {
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
                const Text('Your progress is suspended.', style: TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 18),

                if (_showPauseSettings) ...[
                  SwitchListTile(
                    title: const Text('Sound Effects', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    value: _sound,
                    activeColor: theme.colorScheme.primary,
                    onChanged: (v) async {
                      setState(() => _sound = v);
                      final prefs = await SharedPreferences.getInstance();
                      await prefs.setBool('cp_matrix_sound', v);
                    },
                  ),
                  SwitchListTile(
                    title: const Text('Haptic Vibration', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    value: _vibrate,
                    activeColor: theme.colorScheme.primary,
                    onChanged: (v) async {
                      setState(() => _vibrate = v);
                      final prefs = await SharedPreferences.getInstance();
                      await prefs.setBool('cp_matrix_vibrate', v);
                    },
                  ),
                  const SizedBox(height: 10),
                  OutlinedButton(
                    onPressed: () => setState(() => _showPauseSettings = false),
                    style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 40)),
                    child: const Text('Back to Menu'),
                  ),
                ] else ...[
                  ElevatedButton(
                    onPressed: () => setState(() => _showPause = false),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.primary,
                      minimumSize: const Size(double.infinity, 44),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('▶️ Resume Game', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () {
                      setState(() => _showPause = false);
                      _handlePlayNow();
                    },
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 44),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('🔄 Restart Level', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () => setState(() => _showPauseSettings = true),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 44),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('⚙️ Settings', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () {
                      setState(() {
                        _showPause = false;
                        _flow = 'home';
                      });
                    },
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size(double.infinity, 44),
                      foregroundColor: const Color(0xFFD26E6E),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('🚪 Quit to Hub', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ─── 13. TOAST NOTIFICATION ──────────────────────────────────────────
  Widget _buildAchievementToast() {
    return Positioned(
      top: 10,
      left: 20,
      right: 20,
      child: Material(
        elevation: 8,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: CareerPathApp.getCardBg(context),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE1A63C), width: 2),
          ),
          child: Row(
            children: [
              const Text('🏆', style: TextStyle(fontSize: 28)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('ACHIEVEMENT UNLOCKED!', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFFE1A63C))),
                    Text(_achievementToast!['title'] ?? '', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                    Text(_achievementToast!['desc'] ?? '', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── 14. BOTTOM NAVIGATION BAR ────────────────────────────────────────
  Widget _buildBottomNavBar(ThemeData theme) {
    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        border: Border(top: BorderSide(color: CareerPathApp.getBorderColor(context))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavTabItem('home', 'Home', '🏠', theme),
          _buildNavTabItem('stats', 'Stats', '📊', theme),
          _buildNavTabItem('settings', 'Settings', '⚙️', theme),
        ],
      ),
    );
  }

  Widget _buildNavTabItem(String id, String label, String icon, ThemeData theme) {
    final isSelected = _activeTab == id;
    return InkWell(
      onTap: () => setState(() => _activeTab = id),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(icon, style: const TextStyle(fontSize: 20)),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? theme.colorScheme.primary : Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildThemeCard(ThemeData theme, {required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: CareerPathApp.getBorderColor(context)),
      ),
      child: child,
    );
  }
}
