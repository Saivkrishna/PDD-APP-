class AptitudeQuestion {
  final String id;
  final String topic;
  final String difficulty;
  final String question;
  final List<String> options;
  final String answer; // Correct option text or index
  final String explanation;

  AptitudeQuestion({
    required this.id,
    required this.topic,
    required this.difficulty,
    required this.question,
    required this.options,
    required this.answer,
    required this.explanation,
  });

  factory AptitudeQuestion.fromJson(Map<String, dynamic> json) {
    return AptitudeQuestion(
      id: json['id']?.toString() ?? '',
      topic: json['topic'] ?? '',
      difficulty: json['difficulty'] ?? '',
      question: json['question'] ?? '',
      options: List<String>.from(json['options'] ?? []),
      answer: json['answer']?.toString() ?? '',
      explanation: json['explanation'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'topic': topic,
      'difficulty': difficulty,
      'question': question,
      'options': options,
      'answer': answer,
      'explanation': explanation,
    };
  }
}
