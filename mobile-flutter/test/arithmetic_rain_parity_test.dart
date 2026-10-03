import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careerpath_ai/utils/arithmetic_rain_data.dart';
import 'package:careerpath_ai/screens/arithmetic_rain_game.dart';

void main() {
  group('Arithmetic Rain Engine & Parity Tests', () {
    test('PRNG Deterministic Generation for Daily Challenge', () {
      final seed1 = getSeedFromDate('2026-10-01');
      final seed2 = getSeedFromDate('2026-10-01');
      final seed3 = getSeedFromDate('2026-10-02');

      expect(seed1, equals(seed2), reason: 'Same date must yield identical hash seed');
      expect(seed1 != seed3, isTrue, reason: 'Different dates must yield different seeds');

      final prng1 = SeededRandom(seed1);
      final prng2 = SeededRandom(seed2);

      final val1A = prng1.nextInt(1, 100);
      final val2A = prng2.nextInt(1, 100);
      expect(val1A, equals(val2A));

      final val1B = prng1.next();
      final val2B = prng2.next();
      expect(val1B, equals(val2B));
    });

    test('Arithmetic Question Generation across all operations', () {
      final prng = SeededRandom(42);

      for (int i = 0; i < 50; i++) {
        final q = generateQuestion(i * 15, prng);
        expect(q.text.isNotEmpty, isTrue);
        expect(['+', '-', '*', '/'].contains(q.operator), isTrue);

        // Verify mathematical correctness
        if (q.operator == '+') {
          final parts = q.text.split(' + ');
          expect(int.parse(parts[0]) + int.parse(parts[1]), equals(q.answer));
        } else if (q.operator == '-') {
          final parts = q.text.split(' - ');
          expect(int.parse(parts[0]) - int.parse(parts[1]), equals(q.answer));
        } else if (q.operator == '*') {
          final parts = q.text.split(' × ');
          expect(int.parse(parts[0]) * int.parse(parts[1]), equals(q.answer));
        } else if (q.operator == '/') {
          final parts = q.text.split(' ÷ ');
          expect(int.parse(parts[0]) ~/ int.parse(parts[1]), equals(q.answer));
          expect(int.parse(parts[0]) % int.parse(parts[1]), equals(0), reason: 'Division must divide evenly without remainder');
        }
      }
    });

    test('Scoring and Multiplier Logic verification', () {
      // Base points (+ / -: 10, *: 15, /: 20)
      expect(calculatePoints('+', 0), equals(10));
      expect(calculatePoints('-', 0), equals(10));
      expect(calculatePoints('*', 0), equals(15));
      expect(calculatePoints('/', 0), equals(20));

      // Combo multiplier: min(3.0, 1.0 + (combo ~/ 3) * 0.1)
      // combo = 3 -> 1.1x -> 10 * 1.1 = 11
      expect(calculatePoints('+', 3), equals(11));
      // combo = 6 -> 1.2x -> 10 * 1.2 = 12
      expect(calculatePoints('+', 6), equals(12));
      // combo = 30 -> 2.0x -> 10 * 2.0 = 20
      expect(calculatePoints('+', 30), equals(20));
      // combo = 90 -> 3.0x max -> 20 * 3.0 = 60
      expect(calculatePoints('/', 90), equals(60));
    });

    test('Session Rewards computation parity', () {
      // Daily mode bonus
      final dailyRewards = getSessionRewards(500, 'daily');
      expect(dailyRewards['coins'], equals(50));
      expect(dailyRewards['xp'], equals(100));

      // Classic / Timed / Endless modes (divisor = 20)
      final classicRewards = getSessionRewards(200, 'classic');
      expect(classicRewards['coins'], equals(10));
      expect(classicRewards['xp'], equals(20));

      // Practice mode (divisor = 40)
      final practiceRewards = getSessionRewards(200, 'practice');
      expect(practiceRewards['coins'], equals(5));
      expect(practiceRewards['xp'], equals(10));
    });

    test('Achievements list total and attributes', () {
      expect(RainAchievementList.allAchievements.length, equals(8));
      final ids = RainAchievementList.allAchievements.map((a) => a.id).toSet();
      expect(ids.length, equals(8), reason: 'All achievement IDs must be unique');

      expect(ids.contains('novice'), isTrue);
      expect(ids.contains('scholar'), isTrue);
      expect(ids.contains('einstein'), isTrue);
      expect(ids.contains('perfectionist'), isTrue);
      expect(ids.contains('rain_master'), isTrue);
      expect(ids.contains('endless_survivor'), isTrue);
      expect(ids.contains('speed_demon'), isTrue);
      expect(ids.contains('daily_commuter'), isTrue);
    });

    testWidgets('ArithmeticRainGame loads Start Screen with all tabs and modes', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(800, 1400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        const MaterialApp(
          home: ArithmeticRainGame(),
        ),
      );
      await tester.pumpAndSettle();

      // Check header
      expect(find.text('Arithmetic Rain'), findsOneWidget);
      expect(find.text('Dodge the storm by solving arithmetic equations rapidly.'), findsOneWidget);

      // Check mode cards
      expect(find.text('Select Game Mode'), findsOneWidget);
      expect(find.text('⚔️ Classic Mode'), findsOneWidget);
      expect(find.text('🎓 Practice Mode'), findsOneWidget);
      expect(find.text('♾️ Endless Mode'), findsOneWidget);
      expect(find.text('🔥 Daily Challenge'), findsOneWidget);

      // Check tab bars
      expect(find.text('Stats'), findsWidgets);
      expect(find.text('Badges'), findsWidgets);
      expect(find.text('Settings'), findsWidgets);
      expect(find.text('Logs'), findsWidgets);

      // Scroll and switch to Badges tab
      await tester.ensureVisible(find.text('Badges').first);
      await tester.tap(find.text('Badges').first);
      await tester.pumpAndSettle();
      expect(find.text('Math Novice'), findsOneWidget);
      expect(find.text('Math Scholar'), findsOneWidget);
      expect(find.text('Arithmetic Einstein'), findsOneWidget);

      // Switch to Stats tab
      await tester.ensureVisible(find.text('Stats').first);
      await tester.tap(find.text('Stats').first);
      await tester.pumpAndSettle();
      expect(find.text('Games Played'), findsOneWidget);
      expect(find.text('Personal Highs:'), findsOneWidget);
    });
  });
}
