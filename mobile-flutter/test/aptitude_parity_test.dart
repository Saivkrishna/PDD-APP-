import 'dart:convert';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:careerpath_ai/utils/aptitude_data.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Aptitude Parity and Data Validation Tests', () {
    test('All 22 topics are present in AptitudeDataRepository', () {
      expect(AptitudeDataRepository.allTopics.length, 22);
      final topicIds = AptitudeDataRepository.allTopics.map((t) => t['id']).toSet();
      expect(topicIds.contains('lcm-hcf'), isTrue);
      expect(topicIds.contains('divisibility-remainder'), isTrue);
      expect(topicIds.contains('problems-ages'), isTrue);
      expect(topicIds.contains('percentages'), isTrue);
      expect(topicIds.contains('profit-loss'), isTrue);
      expect(topicIds.contains('time-work'), isTrue);
      expect(topicIds.contains('averages'), isTrue);
    });

    test('Verify local assets contain exactly 1086 questions matching Web source', () {
      final questionsFile = File('assets/data/aptitude_questions.json');
      expect(questionsFile.existsSync(), isTrue);

      final List<dynamic> questions = json.decode(questionsFile.readAsStringSync());
      expect(questions.length, 1086);

      // Verify each question has required fields
      for (final q in questions) {
        expect(q['id'], isNotNull);
        expect(q['topic'], isNotNull);
        expect(q['difficulty'], isNotNull);
        expect(q['q'], isNotNull);
        expect(q['options'], isNotNull);
        expect((q['options'] as List).length, greaterThanOrEqualTo(2));
        expect(q['answer'], isNotNull);
        expect(q['explanation'], isNotNull);
      }
    });

    test('Verify local assets contain all 22 cheatsheets matching Web source', () {
      final cheatsheetsFile = File('assets/data/aptitude_cheatsheets.json');
      expect(cheatsheetsFile.existsSync(), isTrue);

      final Map<String, dynamic> cheatsheets = json.decode(cheatsheetsFile.readAsStringSync());
      expect(cheatsheets.keys.length, 22);

      for (final topic in AptitudeDataRepository.allTopics) {
        final id = topic['id']!;
        expect(cheatsheets.containsKey(id), isTrue, reason: 'Missing cheatsheet for topic $id');
        final topicData = cheatsheets[id] as Map<String, dynamic>;
        expect(topicData['title'], isNotNull);
        expect(topicData['icon'], isNotNull);
      }
    });

    test('Verify Squares Data (1 to 100) and Percentage Conversion Data exist', () {
      final squares = AptitudeDataRepository.getSquaresData();
      expect(squares.length, 4);
      expect(squares[0].length, 25);
      expect(squares[0][0]['val'], 1); // 1^2
      expect(squares[3][24]['val'], 10000); // 100^2
    });
  });
}
