import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';
import 'career_comparison_sheet.dart';

class GraduationPage extends StatefulWidget {
  final Map<String, dynamic>? initialTarget;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const GraduationPage({
    super.key,
    this.initialTarget,
    this.onAddToCompare,
  });

  @override
  State<GraduationPage> createState() => _GraduationPageState();
}

class _GraduationPageState extends State<GraduationPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _sectors = [];
  List<dynamic> _higherStudy = [];
  List<dynamic> _studyAbroad = [];
  List<dynamic> _jobs = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
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
      final sectorsRes = await ApiService.getGraduationSectors();
      final hsRes = await ApiService.getGraduationHigherStudy();
      final abroadRes = await ApiService.getGraduationStudyAbroad();
      final jobsRes = await ApiService.getGraduationJobs();

      if (mounted) {
        setState(() {
          _sectors = sectorsRes;
          _higherStudy = hsRes;
          _studyAbroad = abroadRes;
          _jobs = jobsRes;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _sectors = [
            {'id': 'tech', 'title': 'Software & AI Systems', 'icon': '💻', 'description': 'Cloud computing, full stack development, machine learning, and DevOps architectures.'},
            {'id': 'management', 'title': 'Management & Strategy', 'icon': '📊', 'description': 'Corporate management, strategy consulting, product leadership, and finance operations.'},
            {'id': 'civil', 'title': 'Civil & Public Services', 'icon': '🏛️', 'description': 'UPSC CSE (IAS/IPS/IFS), State PSC, SSC CGL, and Banking PO examinations.'}
          ];
          _higherStudy = [
            {'id': 'mba', 'title': 'MBA (Master of Business Administration)', 'duration': '2 Years', 'eligibility': 'Bachelor degree + CAT/GMAT/XAT score', 'avgSalary': '₹12–35 LPA', 'description': 'Leading corporate executive degree specializing in Marketing, Finance, Operations, and Business Analytics.'},
            {'id': 'mtech', 'title': 'M.Tech / MS (Master of Technology)', 'duration': '2 Years', 'eligibility': 'B.Tech/BE + GATE score', 'avgSalary': '₹10–28 LPA', 'description': 'Advanced engineering research, specialized thesis, and high-tech product innovation.'}
          ];
          _studyAbroad = [
            {'id': 'usa', 'title': 'Study in USA', 'exams': 'GRE, TOEFL / IELTS', 'cost': '₹22L - ₹48L / year', 'intakes': 'Fall (August), Spring (January)', 'visa': '3 Years STEM OPT work permit'},
            {'id': 'germany', 'title': 'Study in Germany', 'exams': 'IELTS, German (A1-B2 recommended)', 'cost': '₹5L - ₹12L / year (Tuition-free public universities)', 'intakes': 'Winter (October), Summer (April)', 'visa': '18-month post-study job seeker visa'}
          ];
          _jobs = [
            {'id': 'sde', 'title': 'Software Development Engineer (SDE)', 'salary': '₹8L - ₹28L / year', 'category': 'Tech', 'skills': ['Data Structures', 'System Design', 'Java / Python / React'], 'workplaces': ['MNCs', 'Product Startups']}
          ];
          _loading = false;
        });
      }
    }
  }

  void _selectSector(Map<String, dynamic> sector) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => GraduationSectorDeptsPage(
          sector: sector,
          onAddToCompare: widget.onAddToCompare,
        ),
      ),
    );
  }

  void _selectHigherStudy(Map<String, dynamic> hs) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => GraduationHigherStudyDetailPage(
          study: hs,
          onAddToCompare: widget.onAddToCompare,
        ),
      ),
    );
  }

  void _selectStudyAbroad(Map<String, dynamic> ab) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => GraduationStudyAbroadDetailPage(
          abroad: ab,
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
        title: Text(state?.translate('graduation') ?? 'Career After Graduation', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: theme.unselectedWidgetColor.withOpacity(0.6),
          indicatorColor: theme.colorScheme.primary,
          tabs: const [
            Tab(text: 'Sectors & Roles'),
            Tab(text: 'Higher Studies'),
            Tab(text: 'Study Abroad'),
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
            : TabBarView(
                controller: _tabController,
                children: [
                  // Tab 1: Sectors
                  ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _sectors.length,
                    itemBuilder: (context, idx) {
                      final sec = _sectors[idx];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        color: CareerPathApp.getCardBg(context),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                        ),
                        child: InkWell(
                          onTap: () => _selectSector(sec),
                          borderRadius: BorderRadius.circular(14),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(sec['icon'] ?? '💼', style: const TextStyle(fontSize: 26)),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Text(
                                        sec['title'] ?? '',
                                        style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                    const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  sec['description'] ?? '',
                                  style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF94A3B8)),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),

                  // Tab 2: Higher Studies
                  ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _higherStudy.length,
                    itemBuilder: (context, idx) {
                      final hs = _higherStudy[idx];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        color: CareerPathApp.getCardBg(context),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          title: Text(hs['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 15)),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 6.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(hs['description'] ?? '', style: const TextStyle(fontSize: 12, height: 1.3, color: Color(0xFF94A3B8))),
                                const SizedBox(height: 6),
                                if (hs['avgSalary'] != null)
                                  Text('💰 Avg Salary: ${hs['avgSalary']}', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 12)),
                              ],
                            ),
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                          onTap: () => _selectHigherStudy(hs),
                        ),
                      );
                    },
                  ),

                  // Tab 3: Study Abroad
                  ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _studyAbroad.length,
                    itemBuilder: (context, idx) {
                      final ab = _studyAbroad[idx];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        color: CareerPathApp.getCardBg(context),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          leading: const Text('✈️', style: TextStyle(fontSize: 28)),
                          title: Text(ab['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 15)),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 4.0),
                            child: Text('Exams: ${ab['exams'] ?? 'IELTS / GRE'}\nCost: ${ab['cost'] ?? '₹15L-35L/yr'}', style: const TextStyle(fontSize: 12, height: 1.3)),
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                          onTap: () => _selectStudyAbroad(ab),
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

// ─── SECTOR DEPARTMENTS & ROLES ─────────────────────────────────
class GraduationSectorDeptsPage extends StatefulWidget {
  final Map<String, dynamic> sector;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const GraduationSectorDeptsPage({
    super.key,
    required this.sector,
    this.onAddToCompare,
  });

  @override
  State<GraduationSectorDeptsPage> createState() => _GraduationSectorDeptsPageState();
}

class _GraduationSectorDeptsPageState extends State<GraduationSectorDeptsPage> {
  Map<String, dynamic>? _sectorDetail;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDetail();
  }

  void _loadDetail() async {
    try {
      final res = await ApiService.getGraduationSectorDetail(widget.sector['id']?.toString() ?? '');
      if (mounted) {
        setState(() {
          _sectorDetail = res.isNotEmpty ? res : widget.sector;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _sectorDetail = widget.sector;
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    final data = _sectorDetail ?? widget.sector;
    final departments = (data['departments'] as List?) ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(data['title'] ?? 'Departments', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
            : departments.isEmpty
                ? const Center(child: Text('No specialized departments found.'))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: departments.length,
                    itemBuilder: (context, idx) {
                      final dept = departments[idx];
                      final name = dept['name'] ?? dept['title'] ?? 'Specialization';
                      final salary = dept['avgSalary'] ?? dept['salary'] ?? '₹8–24 LPA';
                      final description = dept['description'] ?? '';
                      final skills = (dept['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];

                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        color: CareerPathApp.getCardBg(context),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                        ),
                        child: ExpansionTile(
                          title: Text(name, style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                          subtitle: Text('💰 $salary', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 12)),
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  if (description.isNotEmpty) ...[
                                    Text(description, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0))),
                                    const SizedBox(height: 12),
                                  ],
                                  if (skills.isNotEmpty) ...[
                                    const Text('🧠 Key Skills', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                                    const SizedBox(height: 6),
                                    Wrap(
                                      spacing: 6,
                                      runSpacing: 6,
                                      children: skills.map((s) => Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: theme.colorScheme.primary.withOpacity(0.12),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(s, style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                                      )).toList(),
                                    ),
                                    const SizedBox(height: 14),
                                  ],
                                  ElevatedButton.icon(
                                    icon: const Icon(Icons.compare_arrows, size: 16),
                                    label: const Text('Add to Compare'),
                                    style: ElevatedButton.styleFrom(backgroundColor: Colors.white.withOpacity(0.06)),
                                    onPressed: () {
                                      SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                                      if (widget.onAddToCompare != null) {
                                        widget.onAddToCompare!({
                                          'id': dept['id'] ?? name,
                                          'title': name,
                                          'salary': salary,
                                          'description': description,
                                          'skills': skills,
                                        });
                                      }
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text('Added $name to comparison list!')),
                                      );
                                    },
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}

// ─── HIGHER STUDY DETAIL SCREEN ─────────────────────────────────
class GraduationHigherStudyDetailPage extends StatelessWidget {
  final Map<String, dynamic> study;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const GraduationHigherStudyDetailPage({
    super.key,
    required this.study,
    this.onAddToCompare,
  });

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    final title = study['title']?.toString() ?? 'Higher Study Course';
    final duration = study['duration']?.toString() ?? '2 Years';
    final eligibility = study['eligibility']?.toString() ?? 'Graduation with minimum 55%';
    final avgSalary = study['avgSalary']?.toString() ?? '₹10–30 LPA';
    final description = study['description']?.toString() ?? '';
    final exams = (study['exams'] as List?)?.map((e) => e.toString()).toList() ?? ['GATE', 'CAT', 'GRE'];
    final topUniversities = (study['topColleges'] as List?)?.map((u) => u.toString()).toList() ?? 
                            (study['universities'] as List?)?.map((u) => u.toString()).toList() ?? ['IIMs', 'IITs', 'IISc', 'BITS Pilani'];

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 18)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.compare_arrows),
            onPressed: () {
              SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
              if (onAddToCompare != null) {
                onAddToCompare!(study);
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
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Overview Card
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
                    Text(title, style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Text('⏳ Duration: $duration', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                        const SizedBox(width: 14),
                        Text('💰 Avg Salary: $avgSalary', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 13)),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              _buildCard('📖 Overview & Scope', Text(description, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0)))),
              const SizedBox(height: 16),

              _buildCard('📋 Eligibility Requirements', Text(eligibility, style: const TextStyle(fontSize: 13, height: 1.4, fontWeight: FontWeight.w600))),
              const SizedBox(height: 16),

              // Exams
              _buildCard(
                '📅 Required Entrance Exams',
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: exams.map((ex) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(ex, style: TextStyle(color: theme.colorScheme.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                ),
              ),
              const SizedBox(height: 16),

              // Top Universities
              _buildCard(
                '🏛️ Top Institutes & Universities',
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: topUniversities.map((u) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.06),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(u, style: const TextStyle(fontSize: 12, color: Colors.white70)),
                  )).toList(),
                ),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCard(String title, Widget content) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
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

// ─── STUDY ABROAD DETAIL SCREEN ─────────────────────────────────
class GraduationStudyAbroadDetailPage extends StatelessWidget {
  final Map<String, dynamic> abroad;

  const GraduationStudyAbroadDetailPage({
    super.key,
    required this.abroad,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final title = abroad['title']?.toString() ?? 'Study Abroad Destination';
    final exams = abroad['exams']?.toString() ?? 'IELTS, TOEFL, GRE';
    final cost = abroad['cost']?.toString() ?? '₹18L - ₹40L / year';
    final intakes = abroad['intakes']?.toString() ?? 'Fall (Aug/Sep), Spring (Jan/Feb)';
    final visa = abroad['visa']?.toString() ?? 'Post-Study Work Permit available';
    final popularCourses = (abroad['popularCourses'] as List?)?.map((c) => c.toString()).toList() ?? 
                          ['MS in Computer Science', 'Data Science & AI', 'MBA / Finance', 'Biotechnology'];

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 18)),
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
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Hero card
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
                    Text(title, style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 10),
                    Text('💳 Tuition & Living: $cost', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.amberAccent)),
                    const SizedBox(height: 4),
                    Text('📅 Intakes: $intakes', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              _buildCard('📝 Standardized Entrance Exams', Text(exams, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600))),
              const SizedBox(height: 16),

              _buildCard('🛂 Visa & Post-Study Work Rights', Text(visa, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0)))),
              const SizedBox(height: 16),

              _buildCard(
                '🎓 Popular Degree Programs',
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: popularCourses.map((c) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(c, style: TextStyle(color: theme.colorScheme.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                ),
              ),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCard(String title, Widget content) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
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
