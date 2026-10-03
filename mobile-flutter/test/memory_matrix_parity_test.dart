import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:careerpath_ai/screens/memory_matrix_game.dart';
import 'package:careerpath_ai/utils/memory_matrix_data.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('Memory Matrix Data & Logic Parity Tests', () {
    test('All 30 campaign level configurations match Web source of truth', () {
      expect(MatrixPatternGenerator.campaignConfigs.length, 30);

      // Verify Chapter 1 (Heroic: L1-10)
      final l1 = MatrixPatternGenerator.getLevelConfig(1);
      expect(l1.size, 3);
      expect(l1.tiles, 2);
      expect(l1.displayTime, 2.0);
      expect(l1.timeLimit, 45);
      expect(l1.lives, 1);
      expect(l1.tier, 'Heroic');

      final l10 = MatrixPatternGenerator.getLevelConfig(10);
      expect(l10.size, 4);
      expect(l10.tiles, 7);
      expect(l10.displayTime, 3.6);
      expect(l10.timeLimit, 36);
      expect(l10.lives, 1);
      expect(l10.tier, 'Heroic');

      // Verify Chapter 2 (Master: L11-20)
      final l11 = MatrixPatternGenerator.getLevelConfig(11);
      expect(l11.size, 4);
      expect(l11.tiles, 8);
      expect(l11.lives, 2);
      expect(l11.tier, 'Master');

      final l20 = MatrixPatternGenerator.getLevelConfig(20);
      expect(l20.size, 6);
      expect(l20.tiles, 13);
      expect(l20.lives, 2);
      expect(l20.tier, 'Master');

      // Verify Chapter 3 (Grand Master: L21-30)
      final l21 = MatrixPatternGenerator.getLevelConfig(21);
      expect(l21.size, 6);
      expect(l21.tiles, 14);
      expect(l21.lives, 3);
      expect(l21.tier, 'Grand Master');

      final l30 = MatrixPatternGenerator.getLevelConfig(30);
      expect(l30.size, 7);
      expect(l30.tiles, 19);
      expect(l30.displayTime, 7.0);
      expect(l30.timeLimit, 16);
      expect(l30.lives, 3);
      expect(l30.tier, 'Grand Master');
    });

    test('Pattern balance rules enforce row/col limits and zone limits', () {
      // 3x3 pattern with 2 tiles
      final p1 = [0, 8];
      expect(MatrixPatternGenerator.checkPatternBalanced(p1, 3, 2), isTrue);

      // Unbalanced 3x3 pattern (all in same row)
      final pBad = [0, 1];
      expect(MatrixPatternGenerator.checkPatternBalanced(pBad, 3, 2), isFalse);

      // Balanced generation
      final generated = MatrixPatternGenerator.generatePattern(4, 6);
      expect(generated.length, 6);
      expect(MatrixPatternGenerator.checkPatternBalanced(generated, 4, 6), isTrue);
    });

    test('Deterministic Time Trial pattern sets contain exactly 10 rounds per tier', () {
      expect(MatrixPatternGenerator.timeTrialPatterns.containsKey('Heroic'), isTrue);
      expect(MatrixPatternGenerator.timeTrialPatterns.containsKey('Master'), isTrue);
      expect(MatrixPatternGenerator.timeTrialPatterns.containsKey('GrandMaster'), isTrue);

      final heroicSets = MatrixPatternGenerator.timeTrialPatterns['Heroic']!;
      expect(heroicSets.length, 10);
      for (final p in heroicSets) {
        expect(p.length, 6);
        expect(MatrixPatternGenerator.checkPatternBalanced(p, 5, 6), isTrue);
      }

      final masterSets = MatrixPatternGenerator.timeTrialPatterns['Master']!;
      expect(masterSets.length, 10);
      for (final p in masterSets) {
        expect(p.length, 11);
        expect(MatrixPatternGenerator.checkPatternBalanced(p, 6, 11), isTrue);
      }

      final gmSets = MatrixPatternGenerator.timeTrialPatterns['GrandMaster']!;
      expect(gmSets.length, 10);
      for (final p in gmSets) {
        expect(p.length, 16);
        expect(MatrixPatternGenerator.checkPatternBalanced(p, 7, 16), isTrue);
      }
    });

    test('Scoring and economy formulas match Web source of truth', () {
      // Stars calculation
      expect(MatrixScoreManager.calculateLevelStars('Heroic', 1.0, 1.0), 3);
      expect(MatrixScoreManager.calculateLevelStars('Heroic', 0.8, 0.5), 2);
      expect(MatrixScoreManager.calculateLevelStars('Heroic', 0.5, 0.2), 1);

      // Coins calculation (Base: Heroic=10, Master=20, GM=35)
      // 3 stars, combo streak 0 -> 10 * 3 * 1.0 = 30
      expect(MatrixScoreManager.calculateCoinsEarned('Heroic', 3, 0), 30);
      // Master 3 stars, combo streak 2 -> 20 * 3 * 1.2 = 72
      expect(MatrixScoreManager.calculateCoinsEarned('Master', 3, 2), 72);
      // GM 3 stars, combo streak 5 -> 35 * 3 * 1.5 = 158
      expect(MatrixScoreManager.calculateCoinsEarned('Grand Master', 3, 5), 158);

      // XP calculation: minTiles * 2
      expect(MatrixScoreManager.calculateXpEarned(6), 12);
      expect(MatrixScoreManager.calculateXpEarned(19), 38);
    });

    test('All 14 achievements are properly specified', () {
      expect(MatrixAchievementList.allAchievements.length, 14);
      final ids = MatrixAchievementList.allAchievements.map((a) => a.id).toSet();
      expect(ids.contains('first_steps'), isTrue);
      expect(ids.contains('heroic_champ'), isTrue);
      expect(ids.contains('master_champ'), isTrue);
      expect(ids.contains('grand_master'), isTrue);
      expect(ids.contains('flawless_five'), isTrue);
      expect(ids.contains('perfectionist_heroic'), isTrue);
      expect(ids.contains('perfectionist_master'), isTrue);
      expect(ids.contains('perfectionist_gm'), isTrue);
      expect(ids.contains('sharp_eye'), isTrue);
      expect(ids.contains('comeback'), isTrue);
      expect(ids.contains('no_regrets'), isTrue);
      expect(ids.contains('speed_demon'), isTrue);
      expect(ids.contains('marathoner'), isTrue);
      expect(ids.contains('dedicated'), isTrue);
    });
  });

  group('Memory Matrix UI & Widget Flow Tests', () {
    testWidgets('Renders Memory Matrix Dashboard with all 3 game modes and stats', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(const MaterialApp(home: MemoryMatrixGame()));
      await tester.pumpAndSettle();

      // Check header title
      expect(find.text('MEMORY MATRIX'), findsOneWidget);
      expect(find.text('Train Spatial Memory Configurations'), findsOneWidget);

      // Check 3 Modes
      expect(find.text('🛡️ Real Mode'), findsOneWidget);
      expect(find.text('🏋️ Practice Mode'), findsOneWidget);
      expect(find.text('⏱️ Time Trial Mode'), findsOneWidget);

      // Check Bottom Tabs
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Stats'), findsOneWidget);
      expect(find.text('Settings'), findsOneWidget);
    });

    testWidgets('Tapping Stats tab displays Achievements Unlocked list', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(const MaterialApp(home: MemoryMatrixGame()));
      await tester.pumpAndSettle();

      // Tap Stats tab
      await tester.tap(find.text('Stats'));
      await tester.pumpAndSettle();

      expect(find.text('Achievements Unlocked'), findsOneWidget);
      expect(find.text('🥉 First Steps'), findsOneWidget);
      expect(find.text('🏅 Chapter 1 Champion'), findsOneWidget);
    });

    testWidgets('Tapping Real Mode opens Instructions screen with Level Selector', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(const MaterialApp(home: MemoryMatrixGame()));
      await tester.pumpAndSettle();

      // Tap Continue Campaign
      final continueBtn = find.textContaining('CONTINUE CAMPAIGN');
      expect(continueBtn, findsOneWidget);
      await tester.tap(continueBtn);
      await tester.pumpAndSettle();

      // Verify Instructions screen
      expect(find.text('Instructions'), findsOneWidget);
      expect(find.text('🛡️ Real Mode Campaign'), findsOneWidget);
      expect(find.text('PLAY\nNOW'), findsOneWidget);
    });
  });
}
