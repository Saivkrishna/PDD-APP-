import 'package:flutter/material.dart';
import '../main.dart';
import '../utils/sound_manager.dart';
import 'after_10th_page.dart';
import 'after_12th_page.dart';
import 'graduation_page.dart';
import 'tech_learning_hub_page.dart';
import 'aptitude_cheatsheet_page.dart';
import 'reasoning_practice_page.dart';

class EducationHubPage extends StatelessWidget {
  const EducationHubPage({super.key});

  void _onHubSelected(BuildContext context, Widget targetPage) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => targetPage),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    
    final List<Map<String, dynamic>> hubs = [
      {
        'title': 'Career After 10th',
        'desc': 'Explore streams, diploma programs, vocational training, and immediate career entries.',
        'icon': '📚',
        'color': const Color(0xFF6C63FF),
        'page': const After10thPage(),
      },
      {
        'title': 'Career After 12th',
        'desc': 'Discover stream specializations (MPC, BiPC, CEC/MEC) and sector pathways.',
        'icon': '🏛️',
        'color': const Color(0xFF9C5FFF),
        'page': const After12thPage(),
      },
      {
        'title': 'Career After Graduation',
        'desc': 'Examine professional courses, higher study programs, study abroad, and public service opportunities.',
        'icon': '🎓',
        'color': const Color(0xFFFF6584),
        'page': const GraduationPage(),
      },
      {
        'title': 'Technology Learning Hub',
        'desc': 'Gain technical competency through self-paced learning paths and YouTube reference links.',
        'icon': '🌐',
        'color': const Color(0xFF2EC4B6),
        'page': const TechLearningHubPage(),
      },
      {
        'title': 'Aptitude Cheatsheet',
        'desc': 'Study mathematical shortcut formulas, calendar tricks, and numerical examples.',
        'icon': '✏️',
        'color': const Color(0xFFFF9F1C),
        'page': const AptitudeCheatsheetPage(isModal: true),
      },
      {
        'title': 'Reasoning Practice Hub',
        'desc': 'Take practice sets and mock examinations in logical, abstract, and verbal reasoning.',
        'icon': '🧠',
        'color': const Color(0xFFE71D36),
        'page': const ReasoningPracticePage(),
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          state?.translate('education') ?? 'Education Hub',
          style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.w900),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: CareerPathApp.getGradient(context),
          ),
        ),
        child: ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          itemCount: hubs.length,
          itemBuilder: (context, idx) {
            final hub = hubs[idx];
            return Card(
              margin: const EdgeInsets.only(bottom: 15),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 3,
              child: InkWell(
                onTap: () => _onHubSelected(context, hub['page']),
                borderRadius: BorderRadius.circular(16),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          color: hub['color'].withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            hub['icon'],
                            style: const TextStyle(fontSize: 24),
                          ),
                        ),
                      ),
                      const SizedBox(width: 15),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              hub['title'],
                              style: const TextStyle(
                                fontFamily: 'Outfit',
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              hub['desc'],
                              style: TextStyle(
                                fontSize: 13,
                                color: theme.textTheme.bodyMedium?.color?.withOpacity(0.7),
                                height: 1.4,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),
                      const Align(
                        alignment: Alignment.center,
                        child: Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
