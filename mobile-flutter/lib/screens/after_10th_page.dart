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
  String _selectedJobCat = 'All';

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
                      Column(
                        children: [
                          const SizedBox(height: 12),
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Row(
                              children: ['All', 'IT', 'Non-IT', 'Government'].map((cat) {
                                final active = _selectedJobCat == cat;
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8.0),
                                  child: FilterChip(
                                    selected: active,
                                    label: Text(
                                      cat == 'IT'
                                          ? '💻 IT Jobs'
                                          : cat == 'Non-IT'
                                              ? '🔧 Non-IT'
                                              : cat == 'Government'
                                                  ? '🛡️ Government'
                                                  : '📋 All Jobs',
                                      style: TextStyle(
                                        fontFamily: 'Outfit',
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: active ? Colors.white : theme.colorScheme.primary,
                                      ),
                                    ),
                                    selectedColor: theme.colorScheme.primary,
                                    backgroundColor: theme.colorScheme.primary.withOpacity(0.08),
                                    side: BorderSide(color: active ? Colors.transparent : theme.colorScheme.primary.withOpacity(0.2)),
                                    onSelected: (_) {
                                      setState(() {
                                        _selectedJobCat = cat;
                                      });
                                    },
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Expanded(
                            child: Builder(
                              builder: (context) {
                                final filteredJobs = _jobs.where((j) {
                                  if (_selectedJobCat == 'All') return true;
                                  return j['category']?.toString().toLowerCase() == _selectedJobCat.toLowerCase();
                                }).toList();

                                if (filteredJobs.isEmpty) {
                                  return const Center(
                                    child: Text('No jobs found in this category.', style: TextStyle(color: Colors.grey)),
                                  );
                                }

                                return ListView.builder(
                                  padding: const EdgeInsets.all(16),
                                  itemCount: filteredJobs.length,
                                  itemBuilder: (context, idx) {
                                    final j = filteredJobs[idx];
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
                                          child: Text(
                                            j['salaryFresher'] != null
                                                ? '💰 ${j['salaryFresher']} - ${j['salaryExperienced'] ?? ''}'
                                                : j['salary'] ?? '',
                                            style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 12),
                                          ),
                                        ),
                                        trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                                        onTap: () => _showJobDetail(j),
                                      ),
                                    );
                                  },
                                );
                              },
                            ),
                          ),
                        ],
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
    final skillsRequired = (data['skillsRequired'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final higherStudies = (data['higherStudies'] as List?)?.map((h) => h.toString()).toList() ?? [];
    final futureScope = data['futureScope']?.toString() ?? '';

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

                    // Roadmap Timeline
                    _buildRoadmapTimeline(data),
                    const SizedBox(height: 16),

                    // Skills Required (Web Section #4)
                    if (skillsRequired.isNotEmpty) ...[
                      _buildInfoCard(
                        '🛠️ Skills Required',
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: skillsRequired.map((s) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
                            ),
                            child: Text(s, style: TextStyle(color: theme.colorScheme.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                          )).toList(),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Higher Study Options (Web Section #5)
                    if (higherStudies.isNotEmpty) ...[
                      _buildInfoCard(
                        '📚 Higher Study Options',
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: higherStudies.map((hs) => Padding(
                            padding: const EdgeInsets.only(bottom: 6.0),
                            child: Row(
                              children: [
                                const Text('🎓 ', style: TextStyle(fontSize: 14)),
                                Expanded(child: Text(hs, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFFFFD166)))),
                              ],
                            ),
                          )).toList(),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],

                    // Future Scope & Growth (Web Section #6)
                    if (futureScope.isNotEmpty) ...[
                      _buildInfoCard(
                        '🔮 Future Scope & Growth',
                        Text(futureScope, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFFFD166), fontWeight: FontWeight.w600)),
                      ),
                      const SizedBox(height: 16),
                    ],

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

                    // Leads-To Career Opportunities (Interactive cards matching Web)
                    if (data['careerOpportunities'] != null && (data['careerOpportunities'] as List).isNotEmpty) ...[
                      _buildInfoCard(
                        '🚀 Leads-To Career Opportunities',
                        Column(
                          children: (data['careerOpportunities'] as List).map<Widget>((job) {
                            final jMap = Map<String, dynamic>.from(job as Map);
                            return Card(
                              margin: const EdgeInsets.only(bottom: 10),
                              color: theme.colorScheme.surface.withOpacity(0.4),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                                side: BorderSide(color: theme.colorScheme.primary.withOpacity(0.15)),
                              ),
                              child: ListTile(
                                leading: Text(jMap['icon']?.toString() ?? '💼', style: const TextStyle(fontSize: 26)),
                                title: Text(jMap['title']?.toString() ?? '', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 14)),
                                subtitle: Row(
                                  children: [
                                    if (jMap['salaryFresher'] != null)
                                      Text('🆕 ${jMap['salaryFresher']}', style: const TextStyle(color: Colors.greenAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                                    const SizedBox(width: 8),
                                    if (jMap['salaryExperienced'] != null)
                                      Text('📈 ${jMap['salaryExperienced']}', style: const TextStyle(color: Colors.amberAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                                trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                                onTap: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => After10thJobDetailScreen(
                                        job: jMap,
                                        onAddToCompare: widget.onAddToCompare,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            );
                          }).toList(),
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

  Widget _buildRoadmapTimeline(Map<String, dynamic> data) {
    final theme = Theme.of(context);
    final description = data['description']?.toString() ?? '';
    final skills = (data['skillsRequired'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final higherStudies = (data['higherStudies'] as List?)?.map((h) => h.toString()).toList() ?? [];
    final opportunities = (data['careerOpportunities'] as List?)?.map((o) => (o as Map)['title']?.toString() ?? '').toList() ?? [];

    final steps = [
      {
        "title": "1. Build the Basics",
        "subtitle": "Master your foundation",
        "desc": description.isNotEmpty ? "Dive into the core curriculum: $description" : "Learn foundational concepts of this stream."
      },
      {
        "title": "2. Learn the Craft",
        "subtitle": "Acquire high-demand skills",
        "desc": skills.isNotEmpty ? "Focus on building key practical capabilities: ${skills.join(', ')}." : "Learn essential practical tools in this area."
      },
      {
        "title": "3. Get Hands-On",
        "subtitle": "Practice through real projects",
        "desc": "Put your knowledge into action through practical assignments, lab tasks, and mini-projects."
      },
      {
        "title": "4. Level Up",
        "subtitle": "Explore higher learning paths",
        "desc": higherStudies.isNotEmpty ? "Open up advanced opportunities: ${higherStudies.take(3).join(', ')}." : "Explore advanced studies or specialization paths."
      },
      {
        "title": "5. Step Into the World",
        "subtitle": "Launch your professional career",
        "desc": opportunities.isNotEmpty ? "Prepare for target roles: ${opportunities.take(3).join(', ')}." : "Prepare your resume and start applying for jobs."
      }
    ];

    return _buildInfoCard(
      '🗺️ Career Roadmap',
      Column(
        children: steps.map((step) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.check_circle_outline, size: 16, color: theme.colorScheme.primary),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(step['title']!, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 13)),
                      Text(step['subtitle']!, style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 2),
                      Text(step['desc']!, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8), height: 1.3)),
                    ],
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
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
    final salaryFresher = job['salaryFresher']?.toString();
    final salaryExperienced = job['salaryExperienced']?.toString();
    final salary = job['salary']?.toString() ?? (salaryFresher != null ? '$salaryFresher - $salaryExperienced' : '₹15,000 - ₹30,000 / month');
    final description = job['description']?.toString() ?? '';
    final howToBecomeList = job['howToBecome'] is List
        ? (job['howToBecome'] as List).map((h) => h.toString()).toList()
        : job['howToBecome'] != null
            ? [job['howToBecome'].toString()]
            : ['Complete Class 10th and relevant vocational certification.'];
    final skills = (job['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final workplaces = (job['workplaces'] as List?)?.map((w) => w.toString()).toList() ?? [];
    final certifications = (job['certifications'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final future = job['future']?.toString() ?? job['futureScope']?.toString() ?? '';
    final higherStudy = job['higherStudy']?.toString() ?? '';

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
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      alignment: WrapAlignment.center,
                      children: [
                        if (salaryFresher != null)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.greenAccent.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text('🆕 Fresher: $salaryFresher', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 12)),
                          ),
                        if (salaryExperienced != null)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.amberAccent.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text('📈 Experienced: $salaryExperienced', style: const TextStyle(color: Colors.amberAccent, fontWeight: FontWeight.bold, fontSize: 12)),
                          ),
                        if (salaryFresher == null && salaryExperienced == null)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.greenAccent.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text('💰 Salary: $salary', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 13)),
                          ),
                      ],
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

              // How to become (Step-by-step matching Web)
              _buildCard(
                context,
                title: '🎓 How to Become',
                content: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: howToBecomeList.asMap().entries.map((entry) {
                    final idx = entry.key + 1;
                    final step = entry.value;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(
                            radius: 10,
                            backgroundColor: theme.colorScheme.primary.withOpacity(0.2),
                            child: Text('$idx', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(step, style: const TextStyle(fontSize: 13, height: 1.3, fontWeight: FontWeight.w600)),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 16),

              // Job Career Roadmap (Matching Web source of truth)
              _buildJobRoadmapTimeline(context),
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
                const SizedBox(height: 16),
              ],

              // Certifications
              if (certifications.isNotEmpty) ...[
                _buildCard(
                  context,
                  title: '📜 Recommended Certifications',
                  content: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: certifications.map((c) => Padding(
                      padding: const EdgeInsets.only(bottom: 6.0),
                      child: Row(
                        children: [
                          const Text('🎖️ ', style: TextStyle(fontSize: 14)),
                          Expanded(child: Text(c, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600))),
                        ],
                      ),
                    )).toList(),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Future Scope
              if (future.isNotEmpty) ...[
                _buildCard(
                  context,
                  title: '🔮 Future Scope & Growth',
                  content: Text(future, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFFFD166), fontWeight: FontWeight.w600)),
                ),
                const SizedBox(height: 16),
              ],

              // Higher Study
              if (higherStudy.isNotEmpty) ...[
                _buildCard(
                  context,
                  title: '📚 Higher Study Options',
                  content: Text(higherStudy, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0))),
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

  Widget _buildJobRoadmapTimeline(BuildContext context) {
    final theme = Theme.of(context);
    final title = job['title']?.toString() ?? 'this job';
    final howToBecomeList = job['howToBecome'] is List
        ? (job['howToBecome'] as List).map((h) => h.toString()).toList()
        : job['howToBecome'] != null
            ? [job['howToBecome'].toString()]
            : [];
    final skills = (job['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final certifications = (job['certifications'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final workplaces = (job['workplaces'] as List?)?.map((w) => w.toString()).toList() ?? [];

    final skillsStr = skills.isNotEmpty ? skills.join(', ') : 'core capabilities';
    final certsStr = certifications.isNotEmpty ? certifications.join(', ') : 'relevant certifications';
    final workplacesStr = workplaces.isNotEmpty ? workplaces.join(', ') : 'commercial/industrial settings';

    final steps = [
      {
        "title": "1. Learn the Rules",
        "subtitle": "Understand the requirements",
        "desc": howToBecomeList.isNotEmpty
            ? howToBecomeList[0]
            : "Get started by understanding the baseline qualifications and entry criteria to become a successful $title."
      },
      {
        "title": "2. Build Your Toolbox",
        "subtitle": "Practice core capabilities",
        "desc": howToBecomeList.length > 1
            ? howToBecomeList[1]
            : "Focus on mastering the day-to-day practical skills required for this job: $skillsStr."
      },
      {
        "title": "3. Practice by Doing",
        "subtitle": "Gain early exposure",
        "desc": howToBecomeList.length > 2
            ? howToBecomeList[2]
            : "Apply your learning in real-world scenarios through mock projects, assignments, or hands-on tasks."
      },
      {
        "title": "4. Get Certified",
        "subtitle": "Add credentials to your name",
        "desc": howToBecomeList.length > 3
            ? howToBecomeList[3]
            : "Validate your expertise to top recruiters by earning certifications like: $certsStr."
      },
      {
        "title": "5. Start Earning",
        "subtitle": "Apply for your first role",
        "desc": "You are ready to enter the market! Apply for $title positions in settings like: $workplacesStr."
      }
    ];

    return _buildCard(
      context,
      title: '🗺️ Career Roadmap',
      content: Column(
        children: steps.map((step) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.check_circle_outline, size: 16, color: theme.colorScheme.primary),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(step['title']!, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 13)),
                      Text(step['subtitle']!, style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 2),
                      Text(step['desc']!, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8), height: 1.3)),
                    ],
                  ),
                ),
              ],
            ),
          );
        }).toList(),
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
