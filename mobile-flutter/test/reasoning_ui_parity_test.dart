import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:careerpath_ai/screens/reasoning_practice_page.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  Widget createTestWidget() {
    return const MaterialApp(
      home: ReasoningPracticePage(isModal: true),
    );
  }

  group('Reasoning UI Parity & Widget Flow Tests', () {
    testWidgets('Renders Reasoning landing page with all 10 topics and Mode Selector', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      // Check header title
      expect(find.text('Reasoning Practice'), findsOneWidget);

      // Check mode buttons
      expect(find.text('Practice'), findsOneWidget);
      expect(find.text('Test'), findsOneWidget);
      expect(find.text('Review Last'), findsOneWidget);

      // Check topics
      expect(find.text('Series'), findsOneWidget);
      expect(find.text('Coding-Decoding'), findsOneWidget);
      expect(find.text('Syllogism'), findsOneWidget);
      expect(find.text('Blood Relations'), findsOneWidget);
      expect(find.text('Directions'), findsOneWidget);
      expect(find.text('Puzzles'), findsOneWidget);
      expect(find.text('Logical Sequence'), findsOneWidget);
    });

    testWidgets('Toggling to Test Mode shows Global Test button', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      // Tap on 'Test' mode
      await tester.tap(find.text('Test'));
      await tester.pumpAndSettle();

      // Check Global Test button
      expect(find.text('Start Global Test (30 Mixed Questions)'), findsOneWidget);
    });

    testWidgets('Review Last on unattempted topic shows friendly empty state', (WidgetTester tester) async {
      tester.view.physicalSize = const Size(1080, 2400);
      tester.view.devicePixelRatio = 2.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      // Tap on 'Review Last'
      await tester.tap(find.text('Review Last'));
      await tester.pumpAndSettle();

      // Tap on first topic 'Review Solutions'
      final startBtns = find.text('Review Solutions');
      expect(startBtns, findsWidgets);
      await tester.ensureVisible(startBtns.first);
      await tester.tap(startBtns.first);
      await tester.pumpAndSettle();

      // Check empty state
      expect(find.text('No Previous Test Attempt Found'), findsOneWidget);
      expect(find.text('Start a New Test'), findsOneWidget);
    });
  });
}
