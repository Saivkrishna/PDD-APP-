import 'dart:math';

/// Configuration for a single Memory Matrix campaign level
class MatrixLevelConfig {
  final int level;
  final int size;
  final int tiles;
  final double displayTime;
  final int timeLimit;
  final int lives;
  final String tier;

  const MatrixLevelConfig({
    required this.level,
    required this.size,
    required this.tiles,
    required this.displayTime,
    required this.timeLimit,
    required this.lives,
    required this.tier,
  });

  int get minTiles => tiles;
  int get maxTiles => tiles;
  int get rounds => 1;
}

/// Pattern Generator implementing balance rules and deterministic Time Trial sets
class MatrixPatternGenerator {
  static const List<MatrixLevelConfig> campaignConfigs = [
    MatrixLevelConfig(level: 1, size: 3, tiles: 2, displayTime: 2.0, timeLimit: 45, lives: 1, tier: 'Heroic'),
    MatrixLevelConfig(level: 2, size: 3, tiles: 3, displayTime: 2.2, timeLimit: 44, lives: 1, tier: 'Heroic'),
    MatrixLevelConfig(level: 3, size: 3, tiles: 3, displayTime: 2.3, timeLimit: 43, lives: 1, tier: 'Heroic'),
    MatrixLevelConfig(level: 4, size: 3, tiles: 4, displayTime: 2.5, timeLimit: 42, lives: 1, tier: 'Heroic'),
    MatrixLevelConfig(level: 5, size: 3, tiles: 4, displayTime: 2.7, timeLimit: 41, lives: 1, tier: 'Heroic'),
    MatrixLevelConfig(level: 6, size: 3, tiles: 5, displayTime: 2.9, timeLimit: 40, lives: 1, tier: 'Heroic'),
    MatrixLevelConfig(level: 7, size: 4, tiles: 6, displayTime: 3.0, timeLimit: 39, lives: 1, tier: 'Heroic'),
    MatrixLevelConfig(level: 8, size: 4, tiles: 6, displayTime: 3.2, timeLimit: 38, lives: 1, tier: 'Heroic'),
    MatrixLevelConfig(level: 9, size: 4, tiles: 7, displayTime: 3.4, timeLimit: 37, lives: 1, tier: 'Heroic'),
    MatrixLevelConfig(level: 10, size: 4, tiles: 7, displayTime: 3.6, timeLimit: 36, lives: 1, tier: 'Heroic'),
    MatrixLevelConfig(level: 11, size: 4, tiles: 8, displayTime: 3.7, timeLimit: 35, lives: 2, tier: 'Master'),
    MatrixLevelConfig(level: 12, size: 4, tiles: 8, displayTime: 3.9, timeLimit: 34, lives: 2, tier: 'Master'),
    MatrixLevelConfig(level: 13, size: 5, tiles: 9, displayTime: 4.1, timeLimit: 33, lives: 2, tier: 'Master'),
    MatrixLevelConfig(level: 14, size: 5, tiles: 10, displayTime: 4.2, timeLimit: 32, lives: 2, tier: 'Master'),
    MatrixLevelConfig(level: 15, size: 5, tiles: 10, displayTime: 4.4, timeLimit: 31, lives: 2, tier: 'Master'),
    MatrixLevelConfig(level: 16, size: 5, tiles: 11, displayTime: 4.6, timeLimit: 30, lives: 2, tier: 'Master'),
    MatrixLevelConfig(level: 17, size: 5, tiles: 11, displayTime: 4.8, timeLimit: 29, lives: 2, tier: 'Master'),
    MatrixLevelConfig(level: 18, size: 5, tiles: 12, displayTime: 4.9, timeLimit: 28, lives: 2, tier: 'Master'),
    MatrixLevelConfig(level: 19, size: 6, tiles: 13, displayTime: 5.1, timeLimit: 27, lives: 2, tier: 'Master'),
    MatrixLevelConfig(level: 20, size: 6, tiles: 13, displayTime: 5.3, timeLimit: 26, lives: 2, tier: 'Master'),
    MatrixLevelConfig(level: 21, size: 6, tiles: 14, displayTime: 5.5, timeLimit: 25, lives: 3, tier: 'Grand Master'),
    MatrixLevelConfig(level: 22, size: 6, tiles: 14, displayTime: 5.6, timeLimit: 24, lives: 3, tier: 'Grand Master'),
    MatrixLevelConfig(level: 23, size: 6, tiles: 15, displayTime: 5.8, timeLimit: 23, lives: 3, tier: 'Grand Master'),
    MatrixLevelConfig(level: 24, size: 6, tiles: 15, displayTime: 6.0, timeLimit: 22, lives: 3, tier: 'Grand Master'),
    MatrixLevelConfig(level: 25, size: 7, tiles: 16, displayTime: 6.1, timeLimit: 21, lives: 3, tier: 'Grand Master'),
    MatrixLevelConfig(level: 26, size: 7, tiles: 17, displayTime: 6.3, timeLimit: 20, lives: 3, tier: 'Grand Master'),
    MatrixLevelConfig(level: 27, size: 7, tiles: 17, displayTime: 6.5, timeLimit: 19, lives: 3, tier: 'Grand Master'),
    MatrixLevelConfig(level: 28, size: 7, tiles: 18, displayTime: 6.7, timeLimit: 18, lives: 3, tier: 'Grand Master'),
    MatrixLevelConfig(level: 29, size: 7, tiles: 18, displayTime: 6.8, timeLimit: 17, lives: 3, tier: 'Grand Master'),
    MatrixLevelConfig(level: 30, size: 7, tiles: 19, displayTime: 7.0, timeLimit: 16, lives: 3, tier: 'Grand Master'),
  ];

  static MatrixLevelConfig getLevelConfig(int level) {
    final lvl = level.clamp(1, 30);
    return campaignConfigs[lvl - 1];
  }

  /// Check pattern balanced against row/col and zone rules
  static bool checkPatternBalanced(List<int> pattern, int size, int count) {
    final rowCounts = List<int>.filled(size, 0);
    final colCounts = List<int>.filled(size, 0);

    for (final idx in pattern) {
      final r = idx ~/ size;
      final c = idx % size;
      rowCounts[r]++;
      colCounts[c]++;
    }

    // 1. Max per row/column: 50% of total highlighted tiles
    final maxPerRowCol = count * 0.5;
    for (int i = 0; i < size; i++) {
      if (rowCounts[i] > maxPerRowCol || colCounts[i] > maxPerRowCol) {
        return false;
      }
    }

    // 2. Zone rules for size >= 4
    if (size >= 4) {
      int zoneSize;
      if (size == 4 || size == 5) {
        zoneSize = 2; // 2x2 grid of zones
      } else if (size == 6 || size == 7) {
        zoneSize = 3; // 3x3 grid of zones
      } else {
        zoneSize = 4;
      }
      final zoneCount = zoneSize * zoneSize;
      final zoneCounts = List<int>.filled(zoneCount, 0);

      for (final idx in pattern) {
        final r = idx ~/ size;
        final c = idx % size;

        int zoneRow;
        int zoneCol;
        if (zoneSize == 2) {
          final mid = size ~/ 2;
          zoneRow = r < mid ? 0 : 1;
          zoneCol = c < mid ? 0 : 1;
        } else if (zoneSize == 3) {
          final split1 = size ~/ 3;
          final split2 = (2 * size) ~/ 3;
          zoneRow = r < split1 ? 0 : (r < split2 ? 1 : 2);
          zoneCol = c < split1 ? 0 : (c < split2 ? 1 : 2);
        } else {
          final split1 = size ~/ 4;
          final split2 = size ~/ 2;
          final split3 = (3 * size) ~/ 4;
          zoneRow = r < split1 ? 0 : (r < split2 ? 1 : (r < split3 ? 2 : 3));
          zoneCol = c < split1 ? 0 : (c < split2 ? 1 : (c < split3 ? 2 : 3));
        }

        final zoneIdx = zoneRow * zoneSize + zoneCol;
        zoneCounts[zoneIdx]++;
      }

      // Max per zone
      final maxPerZone = (count / zoneCount).ceil() + 1;
      for (final zc in zoneCounts) {
        if (zc > maxPerZone) return false;
      }

      // Minimum active zones
      final minActive = (zoneCount / 2).ceil();
      final activeCount = zoneCounts.where((zc) => zc > 0).length;
      if (activeCount < minActive) {
        return false;
      }
    }

    return true;
  }

  /// Balanced Pattern Generator
  static List<int> generatePattern(int size, int count, [List<int> previousPattern = const []]) {
    final totalTiles = size * size;
    final random = Random();
    int attempts = 0;

    while (attempts < 2000) {
      attempts++;
      final indices = List<int>.generate(totalTiles, (i) => i);
      indices.shuffle(random);
      final candidate = indices.sublist(0, count)..sort();

      // Ensure it doesn't match previous pattern exactly
      if (previousPattern.length == count) {
        bool match = true;
        for (int i = 0; i < count; i++) {
          if (candidate[i] != previousPattern[i]) {
            match = false;
            break;
          }
        }
        if (match) continue;
      }

      if (checkPatternBalanced(candidate, size, count)) {
        return candidate;
      }
    }

    // Fallback shuffle
    final indices = List<int>.generate(totalTiles, (i) => i);
    indices.shuffle(random);
    return indices.sublist(0, count)..sort();
  }

  /// Deterministic seeded pattern generator for Time Trial sets
  static List<List<int>> generateFixedTimeTrialSet(int size, int count, int seedVal) {
    int s = seedVal;
    double seededRandom() {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296.0;
    }

    final totalTiles = size * size;
    final List<List<int>> patternSet = [];

    while (patternSet.length < 10) {
      final indices = List<int>.generate(totalTiles, (i) => i);
      // Fisher-Yates shuffle with seeded random
      for (int i = indices.length - 1; i > 0; i--) {
        final j = (seededRandom() * (i + 1)).floor();
        final temp = indices[i];
        indices[i] = indices[j];
        indices[j] = temp;
      }

      final candidate = indices.sublist(0, count)..sort();

      bool isDuplicate = false;
      for (final prev in patternSet) {
        bool match = true;
        for (int i = 0; i < count; i++) {
          if (prev[i] != candidate[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          isDuplicate = true;
          break;
        }
      }
      if (isDuplicate) continue;

      if (checkPatternBalanced(candidate, size, count)) {
        patternSet.add(candidate);
      }
    }

    return patternSet;
  }

  /// Fixed deterministic Time Trial pattern sets matching Web
  static final Map<String, List<List<int>>> timeTrialPatterns = {
    'Heroic': generateFixedTimeTrialSet(5, 6, 888123),
    'Master': generateFixedTimeTrialSet(6, 11, 999321),
    'GrandMaster': generateFixedTimeTrialSet(7, 16, 777654),
  };
}

/// Score and Economy Manager
class MatrixScoreManager {
  /// Calculate weighted stars (1-3) based on tier accuracy and speed weights
  static int calculateLevelStars(String tier, double accuracyDecimal, double speedDecimal) {
    double accWeight;
    double speedWeight;

    if (tier == 'Heroic') {
      accWeight = 0.7;
      speedWeight = 0.3;
    } else if (tier == 'Master') {
      accWeight = 0.6;
      speedWeight = 0.4;
    } else {
      // Grand Master
      accWeight = 0.5;
      speedWeight = 0.5;
    }

    final weightedScore = (accuracyDecimal * accWeight) + (speedDecimal * speedWeight);
    final scorePercent = weightedScore * 100;

    if (scorePercent >= 90) return 3;
    if (scorePercent >= 70) return 2;
    if (scorePercent >= 40) return 1;
    return 0;
  }

  /// Calculate coins earned: Base * Stars * (1 + 0.1 * Combo Streak, cap 50%)
  static int calculateCoinsEarned(String tier, int stars, int comboStreak) {
    if (stars == 0) return 0;

    int baseCoins = 10;
    if (tier == 'Master') {
      baseCoins = 20;
    } else if (tier == 'Grand Master') {
      baseCoins = 35;
    }

    final comboBonus = min(0.5, 0.1 * comboStreak);
    final multiplier = 1.0 + comboBonus;

    return (baseCoins * stars * multiplier).round();
  }

  /// Calculate XP earned: Tiles in pattern * 2
  static int calculateXpEarned(int tilesCount) {
    return tilesCount * 2;
  }
}

/// Achievement Specification
class MatrixAchievement {
  final String id;
  final String title;
  final String desc;
  final int rewardCoins;
  final int rewardXp;
  final bool hasBadge;
  final bool hasCosmetic;

  const MatrixAchievement({
    required this.id,
    required this.title,
    required this.desc,
    required this.rewardCoins,
    this.rewardXp = 0,
    this.hasBadge = false,
    this.hasCosmetic = false,
  });
}

class MatrixAchievementList {
  static const List<MatrixAchievement> allAchievements = [
    MatrixAchievement(id: 'first_steps', title: '🥉 First Steps', desc: 'Clear Level 1', rewardCoins: 20),
    MatrixAchievement(id: 'heroic_champ', title: '🏅 Chapter 1 Champion', desc: 'Clear all Chapter 1 levels (1–10)', rewardCoins: 150, rewardXp: 200),
    MatrixAchievement(id: 'master_champ', title: '🥈 Chapter 2 Champion', desc: 'Clear all Chapter 2 levels (11–20)', rewardCoins: 250, rewardXp: 400),
    MatrixAchievement(id: 'grand_master', title: '🏆 Grand Master', desc: 'Clear Level 30', rewardCoins: 500, rewardXp: 1000, hasBadge: true),
    MatrixAchievement(id: 'flawless_five', title: '🔥 Flawless Five', desc: 'Clear 5 levels in a row with 3 stars and zero misses', rewardCoins: 100),
    MatrixAchievement(id: 'perfectionist_heroic', title: '⚡ Perfectionist: Chapter 1', desc: 'Earn 3 stars on every Chapter 1 level (1–10)', rewardCoins: 200),
    MatrixAchievement(id: 'perfectionist_master', title: '⚡ Perfectionist: Chapter 2', desc: 'Earn 3 stars on every Chapter 2 level (11–20)', rewardCoins: 200),
    MatrixAchievement(id: 'perfectionist_gm', title: '⚡ Perfectionist: Chapter 3', desc: 'Earn 3 stars on every Chapter 3 level (21–30)', rewardCoins: 200),
    MatrixAchievement(id: 'sharp_eye', title: '👁️ Sharp Eye', desc: 'Reach a 10-level combo streak (cleared with zero misses)', rewardCoins: 75),
    MatrixAchievement(id: 'comeback', title: '🔄 Comeback', desc: 'Clear a level after losing all lives on a prior attempt of it', rewardCoins: 30),
    MatrixAchievement(id: 'no_regrets', title: '🛡️ No Regrets', desc: 'Clear all 30 levels without ever purchasing a life refill', rewardCoins: 300, hasCosmetic: true),
    MatrixAchievement(id: 'speed_demon', title: '🐆 Speed Demon', desc: 'Beat your Time Trial personal best 5 times total', rewardCoins: 100),
    MatrixAchievement(id: 'marathoner', title: '🏃 Marathoner', desc: 'Complete a Time Trial run on all three tiers in one sitting', rewardCoins: 150),
    MatrixAchievement(id: 'dedicated', title: '📚 Dedicated', desc: 'Play Practice Mode for a cumulative 30 minutes', rewardCoins: 50),
  ];
}
