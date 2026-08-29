import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';
import 'search_page.dart';
import 'ats_scanner_page.dart';
import 'memory_matrix_game.dart';
import 'arithmetic_rain_game.dart';
import 'education_hub_page.dart';
import 'aptitude_cheatsheet_page.dart';
import 'settings_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<dynamic> _trending = [];
  bool _loadingTrending = false;
  int _quoteIdx = 0;
  Timer? _trendingTimer;

  final List<Map<String, String>> _quotes = [
    {"text": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
    {"text": "Education is the most powerful weapon which you can use to change the world.", "author": "Nelson Mandela"},
    {"text": "Start where you are. Use what you have. Do what you can.", "author": "Arthur Ashe"},
    {"text": "Your talent determines what you can do. Your motivation determines how much you are willing to do.", "author": "Lou Holtz"},
    {"text": "The mind is not a vessel to be filled, but a fire to be kindled.", "author": "Plutarch"},
    {"text": "Do not wait; the time will never be 'just right.' Start where you stand.", "author": "Napoleon Hill"},
    {"text": "The future depends on what you do today.", "author": "Mahatma Gandhi"},
    {"text": "It always seems impossible until it's done.", "author": "Nelson Mandela"}
  ];

  @override
  void initState() {
    super.initState();
    _quoteIdx = Random().nextInt(_quotes.length);
    _fetchTrending();
    _trendingTimer = Timer.periodic(const Duration(seconds: 30), (_) => _fetchTrending());
  }

  @override
  void dispose() {
    _trendingTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchTrending() async {
    if (!mounted) return;
    setState(() {
      _loadingTrending = true;
    });
    try {
      final health = await ApiService.checkHealth();
      if (health['status'] == 'ok') {
        // Fetch real data
        final response = await ApiService.searchCareers(''); // Returns all careers as a starting point
        if (mounted) {
          setState(() {
            _trending = response.take(4).toList();
            _loadingTrending = false;
          });
        }
      } else {
        _setMockTrending();
      }
    } catch (_) {
      _setMockTrending();
    }
  }

  void _setMockTrending() {
    if (!mounted) return;
    setState(() {
      _trending = [
        {"id": "cse_ai", "title": "AI & ML Engineer", "icon": "🤖", "category": "IT", "salary": "₹5–15 LPA"},
        {"id": "data_entry", "title": "Data Operations Executive", "icon": "🖥️", "category": "IT", "salary": "₹12K–20K/month"},
        {"id": "delivery-12", "title": "Logistics Coordinator", "icon": "🚚", "category": "Non-IT", "salary": "₹15K–30K/month"},
        {"id": "police-12", "title": "Police Constable", "icon": "👮", "category": "Government", "salary": "₹25K–45K/month"}
      ];
      _loadingTrending = false;
    });
  }

  void _shuffleQuote() {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    setState(() {
      _quoteIdx = (_quoteIdx + 1) % _quotes.length;
    });
  }

  String _getGreeting(Map<String, dynamic>? user) {
    final hr = DateTime.now().hour;
    final name = user != null && user['name'] != null ? user['name'].toString().split(' ')[0] : '';
    final greetWord = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    return name.isNotEmpty ? '$greetWord, $name! 👋' : '$greetWord! 👋';
  }

  int _calculateDaysLeft(String targetDateStr) {
    final target = DateTime.parse(targetDateStr);
    final difference = target.difference(DateTime.now());
    return difference.inDays > 0 ? difference.inDays : 0;
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    final user = state?.user;
    
    final exams = [
      {"name": "JEE Main 2027", "date": "2027-01-15T09:00:00", "info": "Engineering entrance for IITs/NITs"},
      {"name": "NEET UG 2027", "date": "2027-05-02T10:00:00", "info": "Medical entrance for MBBS/BDS"},
      {"name": "CLAT 2027", "date": "2026-12-06T14:00:00", "info": "Law entrance for National Law Universities"},
      {"name": "CAT 2026", "date": "2026-11-29T09:00:00", "info": "Post-graduate business entrance for IIMs"}
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(
          state?.translate('appName') ?? 'CareerPath AI 🎓',
          style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.w900),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () {
              // Navigates directly to settings tab in HomeNavHub
              // In this case, we can show Settings screen directly using navigator
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const SettingsPage(isModal: true)),
              );
            },
          ),
        ],
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
        child: RefreshIndicator(
          onRefresh: _fetchTrending,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // 1. HERO GREETING AND QUOTE
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 4,
                  color: theme.colorScheme.surface.withOpacity(0.9),
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _getGreeting(user),
                          style: const TextStyle(
                            fontFamily: 'Outfit',
                            fontSize: 26,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Ready to construct your future path? Explore roadmaps, test strategies, and use AI-powered guidance.',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 15),
                        // Search Box entry
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const SearchPage()),
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.08),
                              borderRadius: BorderRadius.circular(30),
                              border: Border.all(color: Colors.white.withOpacity(0.15)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.search, size: 20),
                                const SizedBox(width: 10),
                                Text(
                                  'Search careers, jobs, courses...',
                                  style: TextStyle(color: theme.textTheme.bodyMedium?.color?.withOpacity(0.6)),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        Divider(color: theme.dividerColor.withOpacity(0.1)),
                        // Tappable Quote widget
                        GestureDetector(
                          onTap: _shuffleQuote,
                          child: Container(
                            padding: const EdgeInsets.only(top: 8),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Text(
                                  '"${_quotes[_quoteIdx]['text']}"',
                                  style: const TextStyle(
                                    fontStyle: FontStyle.italic,
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '- ${_quotes[_quoteIdx]['author']}',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: theme.colorScheme.primary,
                                  ),
                                  textAlign: TextAlign.right,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: 15),
                
                // 2. ATS SCANNER BANNER
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 2,
                  color: Colors.purple.withOpacity(0.1),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    leading: const CircleAvatar(
                      backgroundColor: Color(0xFF6C63FF),
                      child: Icon(Icons.description_outlined, color: Colors.white),
                    ),
                    title: const Text(
                      'AI Resume Scanner (ATS Grader)',
                      style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold),
                    ),
                    subtitle: const Text('Parse PDF/Word resumes and verify skills matching.'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const ATSScannerPage()),
                      );
                    },
                  ),
                ),
                
                const SizedBox(height: 15),

                // 3. BENTO QUICK LINKS
                Text(
                  '💡 Activities & Quizzes',
                  style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                ),
                const SizedBox(height: 10),
                
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 10,
                  crossAxisSpacing: 10,
                  childAspectRatio: 1.4,
                  children: [
                    _buildBentoItem(
                      'Aptitude Quiz',
                      'Practice numerical and logic sets.',
                      '✏️',
                      const Color(0xFF6C63FF),
                      () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AptitudeCheatsheetPage(isModal: true))),
                    ),
                    _buildBentoItem(
                      'Memory Matrix',
                      'Train your spatial cognitive skills.',
                      '🧠',
                      const Color(0xFF2EC4B6),
                      () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const MemoryMatrixGame())),
                    ),
                    _buildBentoItem(
                      'Arithmetic Rain',
                      'Solve speed arithmetic challenges.',
                      '🌧️',
                      const Color(0xFFFF9F1C),
                      () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ArithmeticRainGame())),
                    ),
                    _buildBentoItem(
                      'Education Hub',
                      'Explore academic streams & roadmaps.',
                      '🎓',
                      const Color(0xFFE71D36),
                      () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const EducationHubPage())),
                    ),
                  ],
                ),
                
                const SizedBox(height: 20),

                // 4. TRENDING SEGMENT
                Text(
                  state?.translate('trendingTitle') ?? '🔥 Trending Careers 2026',
                  style: const TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                
                if (_loadingTrending)
                  const Center(child: CircularProgressIndicator())
                else
                  ..._trending.map((job) => Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: ListTile(
                      leading: Text(job['icon'] ?? '💼', style: const TextStyle(fontSize: 24)),
                      title: Text(job['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(job['salary'] ?? ''),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF6C63FF).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          job['category'] ?? '',
                          style: const TextStyle(color: Color(0xFF6C63FF), fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                      onTap: () {
                        // Launches Career Details
                      },
                    ),
                  )).toList(),

                const SizedBox(height: 20),

                // 5. EXAMS COUNTDOWN
                Text(
                  state?.translate('upcomingExams') ?? '📅 Upcoming Entrance Exams',
                  style: const TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                
                ...exams.map((exam) {
                  final days = _calculateDaysLeft(exam['date']!);
                  final double percent = max(0.0, min(1.0, days / 365.0));
                  return Card(
                    margin: const EdgeInsets.only(bottom: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    child: Padding(
                      padding: const EdgeInsets.all(14.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(exam['name']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                              Text('$days days left', style: const TextStyle(color: Colors.redAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(exam['info']!, style: TextStyle(fontSize: 12, color: theme.textTheme.bodyMedium?.color?.withOpacity(0.7))),
                          const SizedBox(height: 10),
                          LinearProgressIndicator(
                            value: 1.0 - percent,
                            backgroundColor: theme.dividerColor.withOpacity(0.08),
                            color: const Color(0xFF6C63FF),
                            minHeight: 6,
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBentoItem(String title, String desc, String icon, Color accentColor, VoidCallback onTap) {
    final theme = Theme.of(context);
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(icon, style: const TextStyle(fontSize: 24)),
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(color: accentColor, shape: BoxShape.circle),
                  ),
                ],
              ),
              const Spacer(),
              Text(
                title,
                style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 13),
              ),
              const SizedBox(height: 2),
              Text(
                desc,
                style: TextStyle(fontSize: 9, color: theme.textTheme.bodyMedium?.color?.withOpacity(0.6)),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
