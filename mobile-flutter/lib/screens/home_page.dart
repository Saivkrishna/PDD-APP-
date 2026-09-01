import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';
import 'search_page.dart';
import 'memory_matrix_game.dart';
import 'arithmetic_rain_game.dart';
import 'education_hub_page.dart';
import 'aptitude_cheatsheet_page.dart';
import 'reasoning_practice_page.dart';
import 'tech_learning_hub_page.dart';
import 'ai_recommendation_page.dart';

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
  final List<Map<String, dynamic>> _compareList = [];

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

  static const List<Map<String, String>> upcomingExams = [
    {"name": "JEE Main (Session 2)", "date": "2026-04-04", "type": "Engineering", "icon": "⚡"},
    {"name": "NEET UG 2026", "date": "2026-05-03", "type": "Medical", "icon": "🩺"},
    {"name": "CUET UG 2026", "date": "2026-05-15", "type": "Central Universities", "icon": "🏛️"},
    {"name": "GATE 2027", "date": "2027-02-06", "type": "Postgraduate Tech", "icon": "⚙️"},
    {"name": "CAT 2026", "date": "2026-11-29", "type": "Management / IIMs", "icon": "📊"},
  ];

  @override
  void initState() {
    super.initState();
    _quoteIdx = Random().nextInt(_quotes.length);
    _fetchTrending();
    _trendingTimer = Timer.periodic(const Duration(seconds: 45), (_) => _fetchTrending());
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
      final overview = await ApiService.getOverview();
      final trendingList = overview['trending'] as List?;
      if (trendingList != null && trendingList.isNotEmpty && mounted) {
        setState(() {
          _trending = trendingList;
          _loadingTrending = false;
        });
      } else {
        _setFallbackTrending();
      }
    } catch (_) {
      _setFallbackTrending();
    }
  }

  void _setFallbackTrending() {
    if (!mounted) return;
    setState(() {
      _trending = [
        {
          "id": "ai-engineer",
          "title": "AI & Machine Learning Engineer",
          "industry": "Artificial Intelligence",
          "growth": "42% YoY",
          "icon": "🤖",
          "salary": "₹12,00,000 - ₹35,00,000 / year",
          "description": "Design, develop, and deploy machine learning models and generative AI systems into high-throughput production environments.",
          "skills": ["Python", "PyTorch", "Transformers", "MLOps", "REST APIs"],
          "tools": ["HuggingFace", "Docker", "AWS SageMaker", "LangChain"],
          "certifications": ["AWS Certified Machine Learning", "TensorFlow Developer Certificate"]
        },
        {
          "id": "fullstack-dev",
          "title": "Full Stack Cloud Architect",
          "industry": "Cloud & Software",
          "growth": "28% YoY",
          "icon": "☁️",
          "salary": "₹10,00,000 - ₹28,00,000 / year",
          "description": "Architect scalable microservices, web apps, and enterprise cloud infrastructure using modern JavaScript frameworks.",
          "skills": ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
          "tools": ["AWS / GCP", "Kubernetes", "Next.js", "GitHub Actions"],
          "certifications": ["AWS Solutions Architect Associate", "CKA (Kubernetes Administrator)"]
        },
        {
          "id": "cybersecurity-analyst",
          "title": "Cybersecurity & SOC Analyst",
          "industry": "Information Security",
          "growth": "35% YoY",
          "icon": "🛡️",
          "salary": "₹8,00,000 - ₹22,00,000 / year",
          "description": "Protect organizational networks, perform penetration testing, and respond to cyber security incidents.",
          "skills": ["Network Security", "Ethical Hacking", "SIEM", "Python"],
          "tools": ["Wireshark", "Burp Suite", "Splunk", "Metasploit"],
          "certifications": ["CompTIA Security+", "CEH (Certified Ethical Hacker)"]
        },
        {
          "id": "data-scientist",
          "title": "Data Scientist & Analytics Lead",
          "industry": "Data & Analytics",
          "growth": "31% YoY",
          "icon": "📊",
          "salary": "₹9,00,000 - ₹25,00,000 / year",
          "description": "Uncover hidden business patterns, build predictive statistical models, and build automated reporting pipelines.",
          "skills": ["SQL", "Python / R", "Statistics", "Data Visualization"],
          "tools": ["Power BI", "Tableau", "Pandas", "Scikit-Learn"],
          "certifications": ["Google Data Analytics Professional", "Microsoft Power BI Data Analyst"]
        }
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
    try {
      final target = DateTime.parse(targetDateStr);
      final difference = target.difference(DateTime.now());
      return difference.inDays > 0 ? difference.inDays : 0;
    } catch (_) {
      return 30;
    }
  }

  void _startAIMentorQuiz() {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    String studyArea = 'IT & Software';
    String problemStyle = 'Building apps & systems';
    String acadStage = '12th Standard';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: CareerPathApp.getCardBg(context),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (BuildContext sContext, StateSetter setModalState) {
            final theme = Theme.of(context);
            return Padding(
              padding: EdgeInsets.only(
                left: 24,
                right: 24,
                top: 24,
                bottom: MediaQuery.of(sContext).viewInsets.bottom + 30,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      width: 40,
                      height: 4,
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(color: Colors.grey.withOpacity(0.3), borderRadius: BorderRadius.circular(2)),
                    ),
                  ),
                  const Text('🤖 AI Career Recommendation', style: TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                  const SizedBox(height: 6),
                  const Text('Select your academic preferences to generate a personalized career roadmap timeline.', style: TextStyle(fontSize: 12, color: Colors.grey), textAlign: TextAlign.center),
                  const SizedBox(height: 20),

                  const Text('1. Subject Area of Interest:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: CareerPathApp.getBorderColor(context)),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: studyArea,
                        isExpanded: true,
                        dropdownColor: CareerPathApp.getCardBg(context),
                        items: ['IT & Software', 'Medical & Healthcare', 'Engineering & Core', 'Management & Business', 'Arts & Design', 'Civil Services']
                            .map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 13)))).toList(),
                        onChanged: (v) => setModalState(() => studyArea = v ?? studyArea),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  const Text('2. Preferred Problem-Solving Style:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: CareerPathApp.getBorderColor(context)),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: problemStyle,
                        isExpanded: true,
                        dropdownColor: CareerPathApp.getCardBg(context),
                        items: ['Building apps & systems', 'Analytical & mathematical', 'Creative & artistic', 'People management', 'Hands-on practical execution']
                            .map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 13)))).toList(),
                        onChanged: (v) => setModalState(() => problemStyle = v ?? problemStyle),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  const Text('3. Current Academic Stage:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: CareerPathApp.getBorderColor(context)),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: acadStage,
                        isExpanded: true,
                        dropdownColor: CareerPathApp.getCardBg(context),
                        items: ['10th Standard', '12th Standard', 'Graduation', 'Post Graduation', 'Working Professional']
                            .map((s) => DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 13)))).toList(),
                        onChanged: (v) => setModalState(() => acadStage = v ?? acadStage),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => AIRecommendationPage(
                            answers: [studyArea, problemStyle, acadStage],
                            quizType: 'general',
                          ),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: const Text('Generate AI Roadmap ➔', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    final user = state?.user;
    final quote = _quotes[_quoteIdx];

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: CareerPathApp.getGradient(context),
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 90),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Header Bar
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _getGreeting(user),
                              style: const TextStyle(
                                fontFamily: 'Outfit',
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              state?.translate('heroSub') ?? 'AI-powered guidance for every student',
                              style: const TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                        IconButton(
                          icon: const Icon(Icons.search, size: 26),
                          tooltip: 'Search Careers',
                          onPressed: () {
                            SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (_) => const SearchPage()),
                            );
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Daily Quote Card
                    GestureDetector(
                      onTap: _shuffleQuote,
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: CareerPathApp.getCardBg(context),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
                        ),
                        child: Row(
                          children: [
                            const Text('💡', style: TextStyle(fontSize: 22)),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '"${quote['text']}"',
                                    style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: Color(0xFFE2E8F0)),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '— ${quote['author']}',
                                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // AI Mentor Hero Launcher
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            theme.colorScheme.primary.withOpacity(0.3),
                            theme.colorScheme.secondary.withOpacity(0.2),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: theme.colorScheme.primary.withOpacity(0.4)),
                        boxShadow: [
                          BoxShadow(
                            color: theme.colorScheme.primary.withOpacity(0.08),
                            blurRadius: 15,
                            spreadRadius: 1,
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.primary.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text('🎓 CAREERPATH AI', style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                              ),
                              const Text('✨ 2026 Edition', style: TextStyle(fontSize: 11, color: Colors.cyanAccent, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            state?.translate('heroTitle') ?? 'Your Dreams Begin With the Right Path 🚀',
                            style: const TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.w900),
                          ),
                          const SizedBox(height: 6),
                          const Text(
                            'Explore academic streams, aptitude cheatsheets, logical reasoning mock tests, tech learning resources, and ATS resume tools.',
                            style: TextStyle(fontSize: 12, height: 1.4, color: Color(0xFFE2E8F0)),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Quick Action Grid
                    const Text('Explore Modules', style: TextStyle(fontFamily: 'Outfit', fontSize: 17, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1.4,
                      children: [
                        _buildQuickCard(
                          icon: '🎓',
                          title: 'Education Hub',
                          subtitle: '10th, 12th & Degree',
                          onTap: () {
                            SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const EducationHubPage()));
                          },
                        ),
                        _buildQuickCard(
                          icon: '📐',
                          title: 'Aptitude Handbook',
                          subtitle: '22 Topics & Quizzes',
                          onTap: () {
                            SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AptitudeCheatsheetPage()));
                          },
                        ),
                        _buildQuickCard(
                          icon: '🧠',
                          title: 'Reasoning Practice',
                          subtitle: 'Mock Tests & Topics',
                          onTap: () {
                            SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ReasoningPracticePage()));
                          },
                        ),
                        _buildQuickCard(
                          icon: '🚀',
                          title: 'Learning Hub',
                          subtitle: '54 Tech Skills & Videos',
                          onTap: () {
                            SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const TechLearningHubPage()));
                          },
                        ),
                        _buildQuickCard(
                          icon: '🎮',
                          title: 'Brain Games',
                          subtitle: 'Memory & Arithmetic',
                          onTap: () {
                            SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                            Navigator.of(context).push(MaterialPageRoute(builder: (_) => const MemoryMatrixGame()));
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Upcoming Entrance Exams Tracker
                    Text(
                      state?.translate('upcomingExams') ?? '📅 Upcoming Entrance Exams',
                      style: const TextStyle(fontFamily: 'Outfit', fontSize: 17, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),

                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: upcomingExams.length,
                      itemBuilder: (context, idx) {
                        final ex = upcomingExams[idx];
                        final daysLeft = _calculateDaysLeft(ex['date']!);
                        return Card(
                          margin: const EdgeInsets.only(bottom: 10),
                          color: CareerPathApp.getCardBg(context),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                            side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                          ),
                          child: ListTile(
                            leading: Text(ex['icon']!, style: const TextStyle(fontSize: 26)),
                            title: Text(ex['name']!, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 14)),
                            subtitle: Text('${ex['type']} • ${ex['date']}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                            trailing: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: daysLeft < 45 ? Colors.redAccent.withOpacity(0.15) : Colors.cyanAccent.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                '$daysLeft ${state?.translate('daysLeft') ?? 'days left'}',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                  color: daysLeft < 45 ? Colors.redAccent : Colors.cyanAccent,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickCard({
    required String icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Card(
      color: CareerPathApp.getCardBg(context),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: CareerPathApp.getBorderColor(context)),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(icon, style: const TextStyle(fontSize: 24)),
              const SizedBox(height: 6),
              Text(title, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 13), maxLines: 1, overflow: TextOverflow.ellipsis),
              Text(subtitle, style: const TextStyle(fontSize: 10, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis),
            ],
          ),
        ),
      ),
    );
  }
}
