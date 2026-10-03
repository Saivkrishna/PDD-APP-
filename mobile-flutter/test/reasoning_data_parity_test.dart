import 'dart:convert';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:careerpath_ai/utils/reasoning_data.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Reasoning Data Parity & Validation Tests', () {
    late List<dynamic> rawQuestions;

    setUpAll(() {
      final file = File('assets/data/reasoning_questions.json');
      expect(file.existsSync(), isTrue, reason: 'reasoning_questions.json must exist in assets/data/');
      rawQuestions = json.decode(file.readAsStringSync());
    });

    test('Total Reasoning question count equals exactly 200 matching Web source', () {
      expect(rawQuestions.length, 200);
    });

    test('All 10 Reasoning topics exist with exact matching question counts', () {
      final expectedTopicCounts = {
        'series': 15,
        'coding-decoding': 15,
        'syllogism': 15,
        'blood-relations': 20,
        'directions': 15,
        'puzzles': 15,
        'logical-sequence': 30,
        'verbal-reasoning': 30,
        'non-verbal-reasoning': 30,
        'data-interpretation': 15,
      };

      final actualTopicCounts = <String, int>{};
      for (final q in rawQuestions) {
        final topic = q['topic']?.toString() ?? '';
        actualTopicCounts[topic] = (actualTopicCounts[topic] ?? 0) + 1;
      }

      expect(actualTopicCounts.length, 10);
      expectedTopicCounts.forEach((topic, expectedCount) {
        expect(actualTopicCounts[topic], expectedCount,
            reason: 'Topic $topic question count mismatch: expected $expectedCount, got ${actualTopicCounts[topic]}');
      });
    });

    test('Reasoning difficulty breakdown matches Web source (Easy=71, Medium=69, Hard=60)', () {
      final expectedDiffCounts = {'easy': 71, 'medium': 69, 'hard': 60};
      final actualDiffCounts = {'easy': 0, 'medium': 0, 'hard': 0};

      for (final q in rawQuestions) {
        final diff = (q['difficulty']?.toString() ?? '').toLowerCase();
        expect(actualDiffCounts.containsKey(diff), isTrue, reason: 'Invalid difficulty value: $diff');
        actualDiffCounts[diff] = actualDiffCounts[diff]! + 1;
      }

      expect(actualDiffCounts['easy'], expectedDiffCounts['easy']);
      expect(actualDiffCounts['medium'], expectedDiffCounts['medium']);
      expect(actualDiffCounts['hard'], expectedDiffCounts['hard']);
    });

    test('Every single Reasoning question has all 10 required fields and valid options', () {
      final seenIds = <dynamic>{};

      for (int i = 0; i < rawQuestions.length; i++) {
        final q = rawQuestions[i] as Map<String, dynamic>;

        // Check required fields
        expect(q['id'], isNotNull, reason: 'Missing id at index $i');
        expect(q['topic'], isNotNull, reason: 'Missing topic at index $i');
        expect(q['difficulty'], isNotNull, reason: 'Missing difficulty at index $i');
        expect(q['category'], isNotNull, reason: 'Missing category at index $i');
        expect(q['q'], isNotNull, reason: 'Missing q (question text) at index $i');
        expect(q['options'], isNotNull, reason: 'Missing options at index $i');
        expect(q['answer'], isNotNull, reason: 'Missing answer at index $i');
        expect(q['explanation'], isNotNull, reason: 'Missing explanation at index $i');
        expect(q['shortcut'], isNotNull, reason: 'Missing shortcut at index $i');
        expect(q['company'], isNotNull, reason: 'Missing company at index $i');

        // Check options
        final options = q['options'] as List;
        expect(options.length, greaterThanOrEqualTo(2), reason: 'Question ${q['id']} has less than 2 options');

        // Check duplicate IDs
        expect(seenIds.contains(q['id']), isFalse, reason: 'Duplicate question ID found: ${q['id']}');
        seenIds.add(q['id']);
      }

      expect(seenIds.length, 200);
    });

    test('ReasoningDataRepository topic models are properly defined for all 10 topics', () {
      expect(ReasoningDataRepository.allTopics.length, 10);
      final topicIds = ReasoningDataRepository.allTopics.map((t) => t.id).toSet();
      expect(topicIds.contains('series'), isTrue);
      expect(topicIds.contains('coding-decoding'), isTrue);
      expect(topicIds.contains('syllogism'), isTrue);
      expect(topicIds.contains('blood-relations'), isTrue);
      expect(topicIds.contains('directions'), isTrue);
      expect(topicIds.contains('puzzles'), isTrue);
      expect(topicIds.contains('logical-sequence'), isTrue);
      expect(topicIds.contains('verbal-reasoning'), isTrue);
      expect(topicIds.contains('non-verbal-reasoning'), isTrue);
      expect(topicIds.contains('data-interpretation'), isTrue);
    });
  });
}
