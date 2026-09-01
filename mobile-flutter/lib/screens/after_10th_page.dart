import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';
import 'career_comparison_sheet.dart';

class After10thPage extends StatefulWidget {
  final Map<String, dynamic>? initialTarget;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const After10thPage({
    super.key,
    this.initialTarget,
    this.onAddToCompare,
  });

  @override
  State<After10thPage> createState() => _After10thPageState();
}

class _After10thPageState extends State<After10thPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _categories = [];
  List<dynamic> _jobs = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final catsRes = await ApiService.getAfter10thCategories();
      final jobsRes = await ApiService.getAfter10thJobs();

      if (mounted) {
        setState(() {
          _categories = catsRes;
          _jobs = jobsRes;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _categories = [
            {"id": "intermediate", "title": "Intermediate (11th & 12th)", "icon": "📘", "description": "Higher Secondary education offering MPC, BiPC, CEC, MEC, and HEC streams.", "duration": "2 Years"},
            {"id": "diploma", "title": "Polytechnic Diploma", "icon": "🛠️", "description": "Technical 3-year diplomas providing direct engineering skills and lateral B.Tech entry.", "duration": "3 Years"},
            {"id": "iti", "title": "ITI Vocational Certifications", "icon": "🔧", "description": "Industrial training in electrical, mechanical, welder, fitter, and COPA trades.", "duration": "1–2 Years"},
            {"id": "paramedical", "title": "Paramedical Diploma", "icon": "🏥", "description": "Healthcare support diplomas in lab technology, radiology, and nursing aid.", "duration": "2 Years"},
            {"id": "shortterm", "title": "Short-Term Job Oriented Skills", "icon": "💻", "description": "Direct employment certifications in coding, design, retail, and accounting.", "duration": "3–6 Months"}
          ];
          _jobs = [
            {"id": "assistant", "title": "Office Assistant / Data Clerk", "icon": "💼", "salary": "₹12K - ₹22K/month", "description": "Administrative support, computer filing, and document coordination.", "skills": ["MS Office", "Typing", "Communication"], "workplaces": ["Private Companies", "Schools", "Agencies"]},
            {"id": "electrician", "title": "Certified Electrician", "icon": "⚡", "salary": "₹15K - ₹30K/month", "description": "Residential & industrial electrical installation, wiring, and repair.", "skills": ["Wiring", "Safety Protocols", "Troubleshooting"], "workplaces": ["Industrial Plants", "Construction", "Self-employed"]}
          ];
          _loading = false;
        });
      }
    }
  }

  void _showJobDetail(Map<String, dynamic> job) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => After10thJobDetailScreen(
          job: job,
          onAddToCompare: widget.onAddToCompare,
        ),
      ),
    );
  }

  void _selectCategory(Map<String, dynamic> category) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => After10thCoursesPage(
          category: category,
          onAddToCompare: widget.onAddToCompare,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(state?.translate('after10th') ?? 'Career After 10th', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: theme.unselectedWidgetColor.withOpacity(0.6),
          indicatorColor: theme.colorScheme.primary,
          tabs: const [
            Tab(text: 'Academic Streams'),
            Tab(text: 'Direct Jobs'),
          ],
        ),
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: CareerPathApp.getGradient(context),
          ),
        ),
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('⚠️', style: TextStyle(fontSize: 40)),
                        const SizedBox(height: 10),
                        Text(_error!, style: const TextStyle(color: Colors.redAccent)),
                        const SizedBox(height: 12),
                        ElevatedButton(onPressed: _loadData, child: const Text('Retry')),
                      ],
                    ),
                  )
                : TabBarView(
                    controller: _tabController,
                    children: [
                      // Tab 1: Categories / Streams
                      ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _categories.length,
                        itemBuilder: (context, idx) {
                          final c = _categories[idx];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            color: CareerPathApp.getCardBg(context),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                              side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                            ),
                            child: InkWell(
                              onTap: () => _selectCategory(c),
                              borderRadius: BorderRadius.circular(14),
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(c['icon'] ?? '📘', style: const TextStyle(fontSize: 26)),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Text(
                                            c['title'] ?? '',
                                            style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                        const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: theme.colorScheme.primary.withOpacity(0.12),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        'Duration: ${c['duration'] ?? 'Variable'}',
                                        style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(c['description'] ?? '', style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF94A3B8))),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),

                      // Tab 2: Jobs
                      ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _jobs.length,
                        itemBuilder: (context, idx) {
                          final j = _jobs[idx];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            color: CareerPathApp.getCardBg(context),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                              side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                            ),
                            child: ListTile(
                              contentPadding: const EdgeInsets.all(16),
                              leading: Text(j['icon'] ?? '💼', style: const TextStyle(fontSize: 28)),
                              title: Text(j['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 15)),
                              subtitle: Padding(
                                padding: const EdgeInsets.only(top: 4.0),
                                child: Text(j['salary'] ?? '', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 13)),
                              ),
                              trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                              onTap: () => _showJobDetail(j),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
      ),
    );
  }
}

// ─── COURSES LIST PAGE ──────────────────────────────────────────
class After10thCoursesPage extends StatefulWidget {
  final Map<String, dynamic> category;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const After10thCoursesPage({
    super.key,
    required this.category,
    this.onAddToCompare,
  });

  @override
  State<After10thCoursesPage> createState() => _After10thCoursesPageState();
}

class _After10thCoursesPageState extends State<After10thCoursesPage> {
  List<dynamic> _courses = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadCourses();
  }

  void _loadCourses() async {
    try {
      final res = await ApiService.getAfter10thCourses(widget.category['id']?.toString() ?? '');
      if (mounted) {
        setState(() {
          _courses = res;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _courses = [
            {"id": "mpc", "title": "MPC (Mathematics, Physics, Chemistry)", "duration": "2 Years", "description": "Core science stream leading to Engineering, Technology, and Architecture.", "eligibility": "10th Board Pass", "avgSalary": "₹6–18 LPA"},
            {"id": "bipc", "title": "BiPC (Biology, Physics, Chemistry)", "duration": "2 Years", "description": "Medical stream leading to MBBS, BDS, Pharmacy, and Biotechnology.", "eligibility": "10th Board Pass", "avgSalary": "₹5–15 LPA"}
          ];
          _loading = false;
        });
      }
    }
  }

  void _selectCourse(Map<String, dynamic> course) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => After10thCourseDetailPage(
          course: course,
          onAddToCompare: widget.onAddToCompare,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.category['title'] ?? 'Courses', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _courses.isEmpty
                ? const Center(child: Text('No courses available under this category.'))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _courses.length,
                    itemBuilder: (context, idx) {
                      final c = _courses[idx];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        color: CareerPathApp.getCardBg(context),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                        ),
                        child: InkWell(
                          onTap: () => _selectCourse(c),
                          borderRadius: BorderRadius.circular(14),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        c['title'] ?? '',
                                        style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                    const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(c['description'] ?? '', style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF94A3B8))),
                                const SizedBox(height: 10),
                                Row(
                                  children: [
                                    if (c['duration'] != null)
                                      Text('⏳ ${c['duration']}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                    const SizedBox(width: 12),
                                    if (c['avgSalary'] != null)
                                      Text('💰 ${c['avgSalary']}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.greenAccent)),
                                  ],
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

// ─── COURSE DETAILS PAGE ────────────────────────────────────────
class After10thCourseDetailPage extends StatefulWidget {
  final Map<String, dynamic> course;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const After10thCourseDetailPage({
    super.key,
    required this.course,
    this.onAddToCompare,
  });

  @override
  State<After10thCourseDetailPage> createState() => _After10thCourseDetailPageState();
}

class _After10thCourseDetailPageState extends State<After10thCourseDetailPage> {
  Map<String, dynamic>? _detail;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDetails();
  }

  void _loadDetails() async {
    try {
      final res = await ApiService.getAfter10thCourseDetail(widget.course['id']?.toString() ?? '');
      if (mounted) {
        setState(() {
          _detail = res.isNotEmpty ? res : widget.course;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _detail = widget.course;
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    final data = _detail ?? widget.course;

    final title = data['title']?.toString() ?? 'Course Detail';
    final description = data['description']?.toString() ?? '';
    final duration = data['duration']?.toString() ?? '2 Years';
    final eligibility = data['eligibility']?.toString() ?? 'Pass in Class 10 Board Examinations';
    final averageFees = data['averageFees']?.toString() ?? '₹10,000 - ₹50,000 / year';
    final avgSalary = data['avgSalary']?.toString() ?? '₹4.5 - ₹12 LPA';
    final subjects = (data['subjects'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final recruiters = (data['topRecruiters'] as List?)?.map((r) => r.toString()).toList() ?? [];
    final careerRoles = (data['careerRoles'] as List?)?.map((c) => c.toString()).toList() ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.compare_arrows),
            tooltip: 'Add to Compare',
            onPressed: () {
              SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
              if (widget.onAddToCompare != null) {
                widget.onAddToCompare!(data);
              }
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Added $title to comparison!')),
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
            colors: CareerPathApp.getGradient(context),
          ),
        ),
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Header card
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: CareerPathApp.getCardBg(context),
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              _buildMetricPill('⏳ Duration', duration, theme.colorScheme.primary),
                              _buildMetricPill('💰 Avg Salary', avgSalary, Colors.greenAccent),
                              _buildMetricPill('💳 Avg Fees', averageFees, Colors.amberAccent),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Overview
                    _buildInfoCard(
                      '📖 Overview',
                      Text(description, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0))),
                    ),
                    const SizedBox(height: 16),

                    // Eligibility
                    _buildInfoCard(
                      '📋 Eligibility Criteria',
                      Text(eligibility, style: const TextStyle(fontSize: 13, height: 1.4, fontWeight: FontWeight.w600)),
                    ),
                    const SizedBox(height: 16),

                    // Core Subjects
                    if (subjects.isNotEmpty) ...[
                      _buildInfoCard(
                        '📚 Key Subjects Covered',
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: subjects.map((sub) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
                            ),
                            child: Text(sub, style: TextStyle(color: theme.colorScheme.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                          )).toList(),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Career Roles
                    if (careerRoles.isNotEmpty) ...[
                      _buildInfoCard(
                        '🚀 Future Career Roles',
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: careerRoles.map((role) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.secondary.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(role, style: TextStyle(color: theme.colorScheme.secondary, fontSize: 12, fontWeight: FontWeight.bold)),
                          )).toList(),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Top Recruiters
                    if (recruiters.isNotEmpty) ...[
                      _buildInfoCard(
                        '🏢 Top Recruiters & Industries',
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: recruiters.map((rec) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.06),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(rec, style: const TextStyle(fontSize: 12, color: Colors.white70)),
                          )).toList(),
                        ),
                      ),
                      const SizedBox(height: 24),
                    ],

                    // Add to compare button
                    ElevatedButton.icon(
                      icon: const Icon(Icons.compare_arrows),
                      label: const Text('Add to Compare'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () {
                        SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                        if (widget.onAddToCompare != null) {
                          widget.onAddToCompare!(data);
                        }
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Added $title to comparison list!')),
                        );
                      },
                    ),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _buildMetricPill(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text('$label: $value', style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildInfoCard(String title, Widget content) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: CareerPathApp.getBorderColor(context)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontFamily: 'Outfit', fontSize: 15, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          content,
        ],
      ),
    );
  }
}

// ─── JOB DETAILS PAGE ───────────────────────────────────────────
class After10thJobDetailScreen extends StatelessWidget {
  final Map<String, dynamic> job;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const After10thJobDetailScreen({
    super.key,
    required this.job,
    this.onAddToCompare,
  });

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    final title = job['title']?.toString() ?? 'Job Role';
    final salary = job['salary']?.toString() ?? '₹15,000 - ₹30,000 / month';
    final description = job['description']?.toString() ?? '';
    final howToBecome = job['howToBecome']?.toString() ?? 'Complete Class 10th and vocational certification.';
    final skills = (job['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final workplaces = (job['workplaces'] as List?)?.map((w) => w.toString()).toList() ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.compare_arrows),
            tooltip: 'Add to Compare',
            onPressed: () {
              SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
              if (onAddToCompare != null) {
                onAddToCompare!(job);
              }
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Added $title to comparison list!')),
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
            colors: CareerPathApp.getGradient(context),
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: CareerPathApp.getCardBg(context),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    Text(job['icon'] ?? '💼', style: const TextStyle(fontSize: 44)),
                    const SizedBox(height: 10),
                    Text(
                      title,
                      style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.greenAccent.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '💰 Salary: $salary',
                        style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Description
              _buildCard(
                context,
                title: '📖 Job Description',
                content: Text(description, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0))),
              ),
              const SizedBox(height: 16),

              // How to become
              _buildCard(
                context,
                title: '🎓 How to Enter This Career',
                content: Text(howToBecome, style: const TextStyle(fontSize: 13, height: 1.4, fontWeight: FontWeight.w600)),
              ),
              const SizedBox(height: 16),

              // Skills
              if (skills.isNotEmpty) ...[
                _buildCard(
                  context,
                  title: '🧠 Key Skills Required',
                  content: Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: skills.map((s) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(s, style: TextStyle(color: theme.colorScheme.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                    )).toList(),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Workplaces
              if (workplaces.isNotEmpty) ...[
                _buildCard(
                  context,
                  title: '🏢 Typical Workplaces',
                  content: Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: workplaces.map((w) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.06),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(w, style: const TextStyle(fontSize: 12, color: Colors.white70)),
                    )).toList(),
                  ),
                ),
                const SizedBox(height: 24),
              ],

              // Add to compare
              ElevatedButton.icon(
                icon: const Icon(Icons.compare_arrows),
                label: const Text('Add to Compare'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () {
                  SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                  if (onAddToCompare != null) {
                    onAddToCompare!(job);
                  }
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Added $title to comparison list!')),
                  );
                },
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCard(BuildContext context, {required String title, required Widget content}) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: CareerPathApp.getBorderColor(context)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontFamily: 'Outfit', fontSize: 15, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          content,
        ],
      ),
    );
  }
}
