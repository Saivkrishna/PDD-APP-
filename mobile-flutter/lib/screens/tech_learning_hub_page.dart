import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class TechLearningHubPage extends StatefulWidget {
  const TechLearningHubPage({super.key});

  @override
  State<TechLearningHubPage> createState() => _TechLearningHubPageState();
}

class _TechLearningHubPageState extends State<TechLearningHubPage> {
  List<dynamic> _techs = [];
  bool _loading = true;
  String? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _loadTechnologies();
  }

  void _loadTechnologies() async {
    try {
      final res = await ApiService.getTechnologies();
      setState(() {
        _techs = res;
        _loading = false;
      });
    } catch (_) {
      // Mock Fallback
      setState(() {
        _techs = [
          {"id": "html", "name": "HTML & CSS", "category": "Web Development", "icon": "🌐", "description": "Structure and styling of modern, responsive websites."},
          {"id": "javascript", "name": "JavaScript Essentials", "category": "Web Development", "icon": "💛", "description": "Logic programming, DOM events, and Async fetch interactions."},
          {"id": "react", "name": "React JS Framework", "category": "Web Development", "icon": "⚛️", "description": "Component-based UI development and hooks state patterns."},
          {"id": "flutter", "name": "Flutter & Dart", "category": "Mobile Development", "icon": "🦋", "description": "Cross-platform mobile apps using widgets and state managers."},
          {"id": "docker", "name": "Docker & Containers", "category": "DevOps", "icon": "🐳", "description": "Containerize web architectures and scale environments."}
        ];
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    // Extract categories
    final categories = ['All', ..._techs.map((t) => t['category']?.toString() ?? 'General').toSet().toList()];
    final activeCategory = _selectedCategory ?? 'All';

    final filteredTechs = activeCategory == 'All'
        ? _techs
        : _techs.where((t) => t['category'] == activeCategory).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tech Learning Hub', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: theme.brightness == Brightness.dark
                ? [const Color(0xFF0F0826), const Color(0xFF06020F)]
                : [const Color(0xFFEBE9FF), const Color(0xFFF8F9FA)],
          ),
        ),
        child: Column(
          children: [
            // Horizontal Categories Scroll
            Container(
              height: 48,
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: categories.length,
                itemBuilder: (context, idx) {
                  final cat = categories[idx];
                  final isSel = activeCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: Text(cat),
                      selected: isSel,
                      onSelected: (_) {
                        final state = CareerPathApp.of(context);
                        SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                        setState(() {
                          _selectedCategory = cat;
                        });
                      },
                    ),
                  );
                },
              ),
            ),
            
            // Technologies list
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: filteredTechs.length,
                      itemBuilder: (context, idx) {
                        final t = filteredTechs[idx];
                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(t['icon'] ?? '🌐', style: const TextStyle(fontSize: 28)),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(t['name'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                                          Text(t['category'] ?? '', style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                Text(t['description'] ?? '', style: const TextStyle(fontSize: 13, height: 1.4)),
                                const SizedBox(height: 12),
                                if (t['url'] != null) ...[
                                  Divider(color: theme.dividerColor.withOpacity(0.08)),
                                  const SizedBox(height: 4),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      const Text('Recommended syllabus reference:', style: TextStyle(fontSize: 11, color: Colors.grey)),
                                      SelectableText(
                                        t['url'],
                                        style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, decoration: TextDecoration.underline),
                                      ),
                                    ],
                                  ),
                                ],
                              ],
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
