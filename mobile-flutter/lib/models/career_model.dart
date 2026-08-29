class CareerModel {
  final String id;
  final String title;
  final String icon;
  final String category;
  final String salary;
  final String description;
  final List<String> skills;
  final List<String> workplaces;
  final dynamic howToBecome; // Can be string or list of steps
  final List<String> certifications;
  final String future;
  final String higherStudy;

  CareerModel({
    required this.id,
    required this.title,
    required this.icon,
    required this.category,
    required this.salary,
    required this.description,
    this.skills = const [],
    this.workplaces = const [],
    this.howToBecome = '',
    this.certifications = const [],
    this.future = '',
    this.higherStudy = '',
  });

  factory CareerModel.fromJson(Map<String, dynamic> json) {
    return CareerModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      icon: json['icon'] ?? '💼',
      category: json['category'] ?? 'General',
      salary: json['salary'] ?? '',
      description: json['description'] ?? '',
      skills: List<String>.from(json['skills'] ?? []),
      workplaces: List<String>.from(json['workplaces'] ?? []),
      howToBecome: json['howToBecome'] ?? '',
      certifications: List<String>.from(json['certifications'] ?? []),
      future: json['future'] ?? '',
      higherStudy: json['higherStudy'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'icon': icon,
      'category': category,
      'salary': salary,
      'description': description,
      'skills': skills,
      'workplaces': workplaces,
      'howToBecome': howToBecome,
      'certifications': certifications,
      'future': future,
      'higherStudy': higherStudy,
    };
  }
}
