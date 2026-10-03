import 'dart:math';

/// Seeded Random Number Generator matching Web GameEngine.js
class SeededRandom {
  int seed;

  SeededRandom(this.seed);

  double next() {
    final x = sin(seed++) * 10000;
    return x - x.floor();
  }

  int nextInt(int min, int max) {
    return (next() * (max - min + 1)).floor() + min;
  }

  T choice<T>(List<T> arr) {
    return arr[(next() * arr.length).floor()];
  }
}

/// Compute seed integer from date string (YYYY-MM-DD)
int getSeedFromDate(String dateStr) {
  int hash = 0;
  for (int i = 0; i < dateStr.length; i++) {
    hash = dateStr.codeUnitAt(i) + ((hash << 5) - hash);
  }
  return hash.abs();
}

/// Arithmetic Question Model
class RainQuestion {
  final String id;
  final String text;
  final int answer;
  final String operator;
  double x; // Percentage (5..75%)
  double y; // Percentage (-5..98%)
  int spawnTime;
  bool cleared;

  RainQuestion({
    required this.id,
    required this.text,
    required this.answer,
    required this.operator,
    this.x = 20.0,
    this.y = -5.0,
    required this.spawnTime,
    this.cleared = false,
  });
}

/// Generate Question based on difficulty score matching Web GameEngine.js
RainQuestion generateQuestion(int score, [SeededRandom? prng]) {
  const operators = ['+', '-', '*', '/'];
  final random = Random();
  final op = prng != null ? prng.choice(operators) : operators[random.nextInt(operators.length)];

  int num1 = 1;
  int num2 = 1;
  int answer = 2;
  String text = '1 + 1';

  int level = 1;
  if (score >= 500) {
    level = 4;
  } else if (score >= 250) {
    level = 3;
  } else if (score >= 100) {
    level = 2;
  }

  int randInt(int min, int max) {
    return prng != null ? prng.nextInt(min, max) : random.nextInt(max - min + 1) + min;
  }

  switch (op) {
    case '+':
      if (level == 1) {
        num1 = randInt(1, 15);
        num2 = randInt(1, 15);
      } else if (level == 2) {
        num1 = randInt(10, 50);
        num2 = randInt(5, 40);
      } else if (level == 3) {
        num1 = randInt(30, 150);
        num2 = randInt(10, 100);
      } else {
        num1 = randInt(100, 999);
        num2 = randInt(10, 500);
      }
      answer = num1 + num2;
      text = '$num1 + $num2';
      break;

    case '-':
      if (level == 1) {
        num1 = randInt(5, 20);
        num2 = randInt(1, num1);
      } else if (level == 2) {
        num1 = randInt(20, 80);
        num2 = randInt(1, num1);
      } else if (level == 3) {
        num1 = randInt(50, 200);
        num2 = randInt(10, num1);
      } else {
        num1 = randInt(100, 999);
        num2 = randInt(50, num1);
      }
      answer = num1 - num2;
      text = '$num1 - $num2';
      break;

    case '*':
      if (level == 1) {
        num1 = randInt(2, 5);
        num2 = randInt(1, 10);
      } else if (level == 2) {
        num1 = randInt(2, 9);
        num2 = randInt(2, 10);
      } else if (level == 3) {
        num1 = randInt(3, 12);
        num2 = randInt(3, 12);
      } else {
        num1 = randInt(4, 20);
        num2 = randInt(3, 15);
      }
      answer = num1 * num2;
      text = '$num1 × $num2';
      break;

    case '/':
      if (level == 1) {
        answer = randInt(1, 10);
        num2 = randInt(2, 5);
      } else if (level == 2) {
        answer = randInt(2, 12);
        num2 = randInt(2, 9);
      } else if (level == 3) {
        answer = randInt(3, 15);
        num2 = randInt(2, 12);
      } else {
        answer = randInt(5, 25);
        num2 = randInt(3, 20);
      }
      num1 = num2 * answer;
      text = '$num1 ÷ $num2';
      break;
  }

  final randId = Random().nextInt(10000000).toString();
  return RainQuestion(
    id: randId,
    text: text,
    answer: answer,
    operator: op,
    spawnTime: DateTime.now().millisecondsSinceEpoch,
  );
}

/// Scoring helper: Base points (+/-: 10, *: 15, /: 20) with Combo multiplier (max 3.0x)
int calculatePoints(String operator, int combo) {
  int basePoints = 10;
  if (operator == '*') basePoints = 15;
  if (operator == '/') basePoints = 20;

  final multiplier = min(3.0, 1.0 + (combo ~/ 3) * 0.1);
  return (basePoints * multiplier).round();
}

/// Session Rewards helper
Map<String, int> getSessionRewards(int score, String mode) {
  if (mode == 'daily') {
    return {'coins': 50, 'xp': 100};
  }

  final divisor = mode == 'practice' ? 40 : 20;
  final coins = max(1, score ~/ divisor);
  final xp = max(5, score ~/ (divisor ~/ 2));

  return {'coins': coins, 'xp': xp};
}

/// Achievement Definition
class RainAchievement {
  final String id;
  final String title;
  final String desc;
  final String icon;

  const RainAchievement({
    required this.id,
    required this.title,
    required this.desc,
    required this.icon,
  });
}

class RainAchievementList {
  static const List<RainAchievement> allAchievements = [
    RainAchievement(id: 'novice', title: 'Math Novice', desc: 'Solve 10 arithmetic questions.', icon: '🥉'),
    RainAchievement(id: 'scholar', title: 'Math Scholar', desc: 'Solve 100 arithmetic questions.', icon: '🥈'),
    RainAchievement(id: 'einstein', title: 'Arithmetic Einstein', desc: 'Solve 500 arithmetic questions.', icon: '🧠'),
    RainAchievement(id: 'perfectionist', title: 'Perfect Brain', desc: 'Complete session with 100% accuracy (min 15).', icon: '💯'),
    RainAchievement(id: 'rain_master', title: 'Rain Master', desc: 'Score 1000+ points in a single session.', icon: '👑'),
    RainAchievement(id: 'endless_survivor', title: 'Endless Survivor', desc: 'Score 500+ in Endless mode.', icon: '🛡️'),
    RainAchievement(id: 'speed_demon', title: 'Speed Demon', desc: 'Response time under 1.5s (min 10).', icon: '⚡'),
    RainAchievement(id: 'daily_commuter', title: 'Daily Commuter', desc: 'Play Daily Challenge 3 days in a row.', icon: '📅'),
  ];
}
