import 'package:flutter_test/flutter_test.dart';
import 'package:careerpath_ai/main.dart';

void main() {
  testWidgets('CareerPathApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const CareerPathApp(
      initialLang: 'en',
      initialTheme: 'cosmic',
      soundEnabled: true,
      soundType: 'synth',
    ));
    await tester.pump();

    // Verify app renders without crashing
    expect(find.byType(CareerPathApp), findsOneWidget);
  });
}
