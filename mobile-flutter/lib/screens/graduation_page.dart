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
            Tab(text: '💼 Direct Jobs'),
            Tab(text: '📚 Study Paths'),
            Tab(text: '✈️ Study Abroad'),
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
                  // Tab 1: Sectors (Direct Jobs)
                  ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _sectors.length,
                    itemBuilder: (context, idx) {
                      final sec = _sectors[idx];
                      final title = sec['title']?.toString() ?? '';
                      final icon = sec['icon']?.toString() ?? '🎓';
                      final deptCount = sec['deptCount'] ?? (sec['departments'] as List?)?.length ?? 0;

                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        color: CareerPathApp.getCardBg(context),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          leading: Text(icon, style: const TextStyle(fontSize: 28)),
                          title: Text(title, style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 4.0),
                            child: Text('$deptCount departments available', style: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8))),
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                          onTap: () => _selectSector(sec),
                        ),
                      );
                    },
                  ),

                  // Tab 2: Higher Studies (Study Paths)
                  ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _higherStudy.length,
                    itemBuilder: (context, idx) {
                      final hs = _higherStudy[idx];
                      final sectorName = hs['sector']?.toString() ?? hs['title']?.toString() ?? 'Graduate Sector';
                      final programTitle = hs['title']?.toString() ?? '';
                      final sectorIcons = {
                        "Engineering & Technology": "🎓",
                        "Medical & Healthcare": "🩺",
                        "Commerce & Business": "💼",
                        "Law": "⚖️",
                        "Arts & Humanities": "🎨",
                        "IT & Computer Courses": "💻",
                        "Professional Courses": "🏨",
                        "Agriculture & Vocational": "🌾",
                        "Defense & Government": "🛡️",
                        "Engineering": "🎓",
                        "Management": "💼",
                        "Technology": "💻"
                      };
                      final icon = sectorIcons[sectorName] ?? hs['icon']?.toString() ?? '🎓';

                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        color: CareerPathApp.getCardBg(context),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          leading: Text(icon, style: const TextStyle(fontSize: 28)),
                          title: Text(sectorName, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 16)),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 4.0),
                            child: Text(programTitle, style: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8))),
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
                      final country = ab['country']?.toString() ?? '';
                      final guideTitle = ab['title']?.toString() ?? '';
                      final displayTitle = country.isNotEmpty ? '$country Study Guide' : guideTitle;

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
                          title: Text(displayTitle, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 16)),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 4.0),
                            child: Text(guideTitle, style: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8))),
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
                      final dept = Map<String, dynamic>.from(departments[idx] as Map);
                      final name = dept['name'] ?? dept['title'] ?? 'Specialization';
                      final salary = dept['avgSalary'] ?? dept['salary'] ?? '₹8–24 LPA';
                      final description = dept['description'] ?? '';
                      final icon = dept['icon']?.toString() ?? '🎯';

                      final code = dept['code']?.toString() ?? '';
                      final jobsList = (dept['jobs'] as List?) ?? [];
                      final jobCountText = jobsList.isNotEmpty ? '${jobsList.length} career options' : 'Explore course details';

                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        color: CareerPathApp.getCardBg(context),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                          side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          leading: Text(icon, style: const TextStyle(fontSize: 28)),
                          title: Text(
                            code.isNotEmpty ? '$name ($code)' : name,
                            style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (description.isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Text(description, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                              ],
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  Text(jobCountText, style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold, fontSize: 12)),
                                  const SizedBox(width: 12),
                                  Text('💰 $salary', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 12)),
                                ],
                              ),
                            ],
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                          onTap: () {
                            SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => GraduationDeptDetailScreen(
                                  dept: dept,
                                  sectorTitle: data['title']?.toString() ?? 'Sector Details',
                                  onAddToCompare: widget.onAddToCompare,
                                ),
                              ),
                            );
                          },
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}

// ─── GRADUATION DEPARTMENT DETAIL SCREEN (Matching Web DeptDetail) ───
class GraduationDeptDetailScreen extends StatefulWidget {
  final Map<String, dynamic> dept;
  final String sectorTitle;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const GraduationDeptDetailScreen({
    super.key,
    required this.dept,
    required this.sectorTitle,
    this.onAddToCompare,
  });

  @override
  State<GraduationDeptDetailScreen> createState() => _GraduationDeptDetailScreenState();
}

class _GraduationDeptDetailScreenState extends State<GraduationDeptDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Map<String, dynamic>? _deptDetails;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadDeptDetails();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _loadDeptDetails() async {
    try {
      final deptId = widget.dept['id']?.toString() ?? '';
      final res = await ApiService.getGraduationDeptDetail(deptId);
      if (mounted) {
        setState(() {
          _deptDetails = res.isNotEmpty ? res : widget.dept;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _deptDetails = widget.dept;
          _loading = false;
        });
      }
    }
  }

  Widget _buildCard(String title, Widget content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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

  Widget _buildDeptRoadmapTimeline(Map<String, dynamic> courseDetails, List<dynamic> jobs) {
    final theme = Theme.of(context);
    final entranceExams = (courseDetails['entranceExams'] as List?)?.map((e) => e.toString()).toList() ?? [];
    final subjects = (courseDetails['subjects'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final tools = (courseDetails['tools'] as List?)?.map((t) => t.toString()).toList() ?? [];
    final skills = (courseDetails['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final salary = courseDetails['salary']?.toString() ?? 'competitive packages';

    final examsStr = entranceExams.isNotEmpty ? entranceExams.join(', ') : 'Academic Merit scores';
    final subjectsStr = subjects.isNotEmpty ? subjects.take(3).join(', ') : 'course curriculum';
    final toolsStr = tools.isNotEmpty ? tools.take(3).join(', ') : 'standard utilities';
    final skillsStr = skills.isNotEmpty ? skills.take(3).join(', ') : 'engineering skills';
    final jobsStr = jobs.isNotEmpty ? jobs.take(3).map((j) => (j as Map)['title']?.toString() ?? 'role').join(', ') : 'professional roles';

    final steps = [
      {
        "title": "1. Gain Admission",
        "subtitle": "College Entry Requirements",
        "desc": "Qualify for admission by passing required entrance exams: $examsStr."
      },
      {
        "title": "2. Build Tech Foundations",
        "subtitle": "Study key academic subjects",
        "desc": "Understand the core subjects of this branch: $subjectsStr."
      },
      {
        "title": "3. Master the Tools",
        "subtitle": "Practical skills & tools",
        "desc": "Develop hands-on proficiency with tools: $toolsStr and skills: $skillsStr."
      },
      {
        "title": "4. Get Certified",
        "subtitle": "Earn industry credentials",
        "desc": "Acquire specialized modern certifications during your studies to differentiate your resume."
      },
      {
        "title": "5. Launch Your Career",
        "subtitle": "Corporate jobs & placements",
        "desc": "Participate in recruitment and apply for target roles: $jobsStr with salary average: $salary."
      }
    ];

    return _buildCard(
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

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    final data = _deptDetails ?? widget.dept;

    final title = data['title']?.toString() ?? widget.dept['title']?.toString() ?? 'Department Details';
    final icon = data['icon']?.toString() ?? '🎯';
    final courseDetails = (data['courseDetails'] as Map<String, dynamic>?) ?? {};
    final jobs = (data['jobs'] as List?) ?? [];

    final fullForm = courseDetails['fullForm']?.toString() ?? '';
    final duration = courseDetails['duration']?.toString() ?? '4 Years';
    final eligibility = courseDetails['eligibility']?.toString() ?? 'Pass in qualifying examination';
    final entranceExams = (courseDetails['entranceExams'] as List?)?.map((e) => e.toString()).toList() ?? [];
    final subjects = (courseDetails['subjects'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final skills = (courseDetails['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final tools = (courseDetails['tools'] as List?)?.map((t) => t.toString()).toList() ?? [];
    final higherStudies = (courseDetails['higherStudies'] as List?)?.map((h) => h.toString()).toList() ?? [];
    final certifications = (courseDetails['certifications'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final futureScope = courseDetails['futureScope']?.toString() ?? '';
    final locations = (courseDetails['locations'] as List?)?.map((l) => l.toString()).toList() ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 17)),
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
        bottom: TabBar(
          controller: _tabController,
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: theme.unselectedWidgetColor.withOpacity(0.6),
          indicatorColor: theme.colorScheme.primary,
          tabs: [
            const Tab(text: '📚 Course Info'),
            Tab(text: '💼 Career Roles (${jobs.length})'),
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
                  // TAB 1: Course Info
                  SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Hero Box
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: CareerPathApp.getCardBg(context),
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                          ),
                          child: Column(
                            children: [
                              Text(icon, style: const TextStyle(fontSize: 48)),
                              const SizedBox(height: 10),
                              Text(title, style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                              if (fullForm.isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Text('Full Form: $fullForm', style: TextStyle(color: theme.colorScheme.primary, fontSize: 13, fontWeight: FontWeight.w600), textAlign: TextAlign.center),
                              ],
                              const SizedBox(height: 12),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                    decoration: BoxDecoration(color: theme.colorScheme.primary.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                                    child: Text('⏳ Duration: $duration', style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold, fontSize: 11)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Eligibility
                        _buildCard('🎓 Eligibility Requirements', Text(eligibility, style: const TextStyle(fontSize: 13, height: 1.4, fontWeight: FontWeight.w600))),

                        // Entrance Exams
                        if (entranceExams.isNotEmpty)
                          _buildCard('📝 Entrance Exams', Wrap(
                            spacing: 6, runSpacing: 6,
                            children: entranceExams.map((e) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(color: theme.colorScheme.primary.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                              child: Text(e, style: TextStyle(color: theme.colorScheme.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                            )).toList(),
                          )),

                        // Roadmap (5-step matching Web)
                        _buildDeptRoadmapTimeline(courseDetails, jobs),

                        // Subjects
                        if (subjects.isNotEmpty)
                          _buildCard('📖 Core Subjects Covered', Wrap(
                            spacing: 6, runSpacing: 6,
                            children: subjects.map((s) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(color: theme.colorScheme.secondary.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                              child: Text(s, style: TextStyle(color: theme.colorScheme.secondary, fontSize: 12, fontWeight: FontWeight.bold)),
                            )).toList(),
                          )),

                        // Skills
                        if (skills.isNotEmpty)
                          _buildCard('🧠 Key Skills Required', Wrap(
                            spacing: 6, runSpacing: 6,
                            children: skills.map((s) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(color: Colors.amberAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                              child: Text(s, style: const TextStyle(color: Colors.amberAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                            )).toList(),
                          )),

                        // Tools
                        if (tools.isNotEmpty)
                          _buildCard('🛠️ Tools to Learn', Wrap(
                            spacing: 6, runSpacing: 6,
                            children: tools.map((tVal) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(color: Colors.cyanAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                              child: Text(tVal, style: const TextStyle(color: Colors.cyanAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                            )).toList(),
                          )),

                        // Higher Studies
                        if (higherStudies.isNotEmpty)
                          _buildCard('🎓 Higher Studies Options', Wrap(
                            spacing: 6, runSpacing: 6,
                            children: higherStudies.map((h) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(color: Colors.amberAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                              child: Text(h, style: const TextStyle(color: Colors.amberAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                            )).toList(),
                          )),

                        // Certifications
                        if (certifications.isNotEmpty)
                          _buildCard('🏆 Certifications', Wrap(
                            spacing: 6, runSpacing: 6,
                            children: certifications.map((c) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(color: Colors.purpleAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                              child: Text(c, style: const TextStyle(color: Colors.purpleAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                            )).toList(),
                          )),

                        // Future Scope
                        if (futureScope.isNotEmpty)
                          _buildCard('🚀 Future Scope & Growth', Text(futureScope, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFFFD166), fontWeight: FontWeight.w600))),

                        // Locations
                        if (locations.isNotEmpty)
                          _buildCard('📍 Best Locations / Hubs', Wrap(
                            spacing: 6, runSpacing: 6,
                            children: locations.map((l) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(color: Colors.white.withOpacity(0.08), borderRadius: BorderRadius.circular(8)),
                              child: Text(l, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                            )).toList(),
                          )),

                        const SizedBox(height: 30),
                      ],
                    ),
                  ),

                  // TAB 2: Career Roles
                  jobs.isEmpty
                      ? const Center(child: Text('No career roles listed for this department.'))
                      : ListView.builder(
                          padding: const EdgeInsets.all(20),
                          itemCount: jobs.length,
                          itemBuilder: (context, idx) {
                            final jMap = Map<String, dynamic>.from(jobs[idx] as Map);
                            final jTitle = jMap['title']?.toString() ?? 'Career Role';
                            final jIcon = jMap['icon']?.toString() ?? '💼';
                            final jSalaryVal = jMap['salary'];
                            String salaryText = 'Competitive';
                            if (jSalaryVal is Map) {
                              if (jSalaryVal['fresher'] != null) {
                                salaryText = 'Fresher: ${jSalaryVal['fresher']}';
                              } else if (jSalaryVal['generic'] != null) {
                                salaryText = jSalaryVal['generic'].toString();
                              }
                            } else if (jSalaryVal != null) {
                              salaryText = jSalaryVal.toString();
                            }

                            return Card(
                              margin: const EdgeInsets.only(bottom: 12),
                              color: CareerPathApp.getCardBg(context),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                                side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                              ),
                              child: ListTile(
                                contentPadding: const EdgeInsets.all(16),
                                leading: Text(jIcon, style: const TextStyle(fontSize: 28)),
                                title: Text(jTitle, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 15)),
                                subtitle: Text('💰 $salaryText', style: const TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                                trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                                onTap: () {
                                  SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => GraduationJobDetailScreen(
                                        job: jMap,
                                        onAddToCompare: widget.onAddToCompare,
                                      ),
                                    ),
                                  );
                                },
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

// ─── GRADUATION JOB DETAIL SCREEN (Matching Web GradJobDetail) ────────
class GraduationJobDetailScreen extends StatelessWidget {
  final Map<String, dynamic> job;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const GraduationJobDetailScreen({
    super.key,
    required this.job,
    this.onAddToCompare,
  });

  Widget _buildCard(BuildContext context, {required String title, required Widget content}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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

  Widget _buildJobRoadmapTimeline(BuildContext context) {
    final theme = Theme.of(context);
    final title = job['title']?.toString() ?? 'this role';
    final description = job['description']?.toString() ?? '';
    final skills = (job['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final tools = (job['tools'] as List?)?.map((t) => t.toString()).toList() ?? (job['technologies'] as List?)?.map((t) => t.toString()).toList() ?? [];
    final certs = (job['certifications'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final workplaces = (job['workplaces'] as List?)?.map((w) => w.toString()).toList() ?? [];
    final salary = job['salary']?.toString() ?? 'competitive packages';

    final skillsStr = skills.isNotEmpty ? skills.take(4).join(', ') : 'core technical requirements';
    final toolsStr = tools.isNotEmpty ? tools.take(3).join(', ') : 'standard applications';
    final certsStr = certs.isNotEmpty ? certs.take(3).join(', ') : 'standard industry credentials';
    final workplacesStr = workplaces.isNotEmpty ? workplaces.take(3).join(', ') : 'active departments';

    final steps = [
      {
        "title": "1. Get the Degree",
        "subtitle": "Earn your college credentials",
        "desc": description.isNotEmpty && description.length > 80
            ? "${description.substring(0, 80)}... Complete your foundational university studies in a related field."
            : "First, earn a bachelor's or master's degree in a relevant field of study."
      },
      {
        "title": "2. Master Tech Capabilities",
        "subtitle": "Learn professional methods",
        "desc": "Master essential technical competencies: $skillsStr."
      },
      {
        "title": "3. Learn the Standard Tools",
        "subtitle": "Gain software proficiency",
        "desc": "Get comfortable using industry-standard systems and tools: $toolsStr."
      },
      {
        "title": "4. Validate Your Skills",
        "subtitle": "Obtain professional badges",
        "desc": "Boost your resume credentials by completing certifications like: $certsStr."
      },
      {
        "title": "5. Join the Team",
        "subtitle": "Enter the professional workspace",
        "desc": "Apply for roles as a certified $title in workspaces like: $workplacesStr with typical packages of $salary."
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

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    final title = job['title']?.toString() ?? 'Graduate Role';
    final icon = job['icon']?.toString() ?? '💼';
    final description = job['description']?.toString() ?? '';
    String salaryStr = '';
    final rawSalary = job['salary'];
    if (rawSalary is Map) {
      final parts = <String>[];
      if (rawSalary['fresher'] != null) parts.add('Fresher: ${rawSalary['fresher']}');
      if (rawSalary['experienced'] != null) parts.add('Experienced: ${rawSalary['experienced']}');
      if (rawSalary['abroad'] != null) parts.add('Abroad: ${rawSalary['abroad']}');
      if (rawSalary['generic'] != null) parts.add(rawSalary['generic'].toString());
      salaryStr = parts.join(' | ');
    } else if (rawSalary != null) {
      salaryStr = rawSalary.toString();
    }
    if (salaryStr.isEmpty) salaryStr = 'Competitive Salary';
    final salary = salaryStr;

    final skills = (job['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final tools = (job['tools'] as List?)?.map((t) => t.toString()).toList() ?? (job['technologies'] as List?)?.map((t) => t.toString()).toList() ?? [];
    final certs = (job['certifications'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final higherStudies = (job['higherStudies'] as List?)?.map((h) => h.toString()).toList() ?? [];
    final futureScope = job['futureScope']?.toString() ?? '';
    final locations = (job['locations'] as List?)?.map((l) => l.toString()).toList() ?? (job['topCities'] as List?)?.map((l) => l.toString()).toList() ?? [];

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
              // Hero Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: CareerPathApp.getCardBg(context),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    Text(icon, style: const TextStyle(fontSize: 48)),
                    const SizedBox(height: 10),
                    Text(title, style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                      decoration: BoxDecoration(
                        color: Colors.greenAccent.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text('💰 Salary Package: $salary', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Roadmap (5-step matching Web)
              _buildJobRoadmapTimeline(context),

              // Description
              if (description.isNotEmpty)
                _buildCard(context, title: '📋 Job Description', content: Text(description, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0)))),

              // Skills
              if (skills.isNotEmpty)
                _buildCard(context, title: '🧠 Skills Required', content: Wrap(
                  spacing: 6, runSpacing: 6,
                  children: skills.map((s) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: theme.colorScheme.primary.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(s, style: TextStyle(color: theme.colorScheme.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              // Tools
              if (tools.isNotEmpty)
                _buildCard(context, title: '🛠️ Tools & Technologies', content: Wrap(
                  spacing: 6, runSpacing: 6,
                  children: tools.map((tVal) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.cyanAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(tVal, style: const TextStyle(color: Colors.cyanAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              // Certifications
              if (certs.isNotEmpty)
                _buildCard(context, title: '🏆 Certifications', content: Wrap(
                  spacing: 6, runSpacing: 6,
                  children: certs.map((c) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.purpleAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(c, style: const TextStyle(color: Colors.purpleAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              // Higher Studies
              if (higherStudies.isNotEmpty)
                _buildCard(context, title: '🎓 Higher Studies Options', content: Wrap(
                  spacing: 6, runSpacing: 6,
                  children: higherStudies.map((h) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.amberAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(h, style: const TextStyle(color: Colors.amberAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              // Future Scope
              if (futureScope.isNotEmpty)
                _buildCard(context, title: '🚀 Future Scope & Growth', content: Text(futureScope, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFFFD166), fontWeight: FontWeight.w600))),

              // Locations
              if (locations.isNotEmpty)
                _buildCard(context, title: '📍 Best Locations / Hubs', content: Wrap(
                  spacing: 6, runSpacing: 6,
                  children: locations.map((l) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.white.withOpacity(0.08), borderRadius: BorderRadius.circular(8)),
                    child: Text(l, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                  )).toList(),
                )),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── HIGHER STUDY / MASTER'S DETAIL SCREEN (Matching Web masterDetail) ─────
class GraduationHigherStudyDetailPage extends StatefulWidget {
  final Map<String, dynamic> study;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const GraduationHigherStudyDetailPage({
    super.key,
    required this.study,
    this.onAddToCompare,
  });

  @override
  State<GraduationHigherStudyDetailPage> createState() => _GraduationHigherStudyDetailPageState();
}

class _GraduationHigherStudyDetailPageState extends State<GraduationHigherStudyDetailPage> {
  int? _expandedProg;

  Widget _buildCard(String title, Widget content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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

  Widget _buildMasterRoadmapTimeline(Map<String, dynamic> study) {
    final theme = Theme.of(context);
    final sector = study['sector']?.toString() ?? 'Master Degree';
    final title = study['title']?.toString() ?? 'your master degree';
    final specializations = (study['specializations'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final exams = (study['entranceExams'] as List?)?.map((e) => e.toString()).toList() ?? (study['exams'] as List?)?.map((e) => e.toString()).toList() ?? [];
    final skills = (study['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final careers = (study['careers'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final salary = study['salary']?.toString() ?? study['avgSalary']?.toString() ?? 'competitive packages';

    final specsStr = specializations.isNotEmpty ? specializations.take(3).join(', ') : 'a specialized niche';
    final examsStr = exams.isNotEmpty ? exams.join(', ') : 'Direct admission criteria';
    final skillsStr = skills.isNotEmpty ? skills.take(3).join(', ') : 'advanced industry skills';
    final careersStr = careers.isNotEmpty ? careers.take(3).join(', ') : 'professional roles';

    final steps = [
      {
        "title": "1. Pick Your Specialization",
        "subtitle": "Find your niche",
        "desc": "Choose an area of focus that aligns with your passions: $specsStr."
      },
      {
        "title": "2. Clear the Entrances",
        "subtitle": "Qualify for admission",
        "desc": "Study for and pass the required postgraduate tests: $examsStr."
      },
      {
        "title": "3. Deepen Your Knowledge",
        "subtitle": "Master advanced subjects",
        "desc": "Study advanced academic concepts and research modules for the program: $title."
      },
      {
        "title": "4. Build a Research Base",
        "subtitle": "Acquire technical tools",
        "desc": "Develop strong technical capabilities: $skillsStr."
      },
      {
        "title": "5. Lead as an Expert",
        "subtitle": "Secure senior roles",
        "desc": "Apply for senior positions, technical leadership roles, or research placements like: $careersStr with Average Salary: $salary."
      }
    ];

    return _buildCard(
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

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    final study = widget.study;

    final sector = study['sector']?.toString() ?? 'Post-Graduate';
    final title = study['title']?.toString() ?? 'Higher Study Course';
    final icon = study['icon']?.toString() ?? '🎓';
    final duration = study['duration']?.toString() ?? '2 Years';
    final eligibility = study['eligibility']?.toString() ?? 'Graduation with minimum 55%';
    final avgSalary = study['avgSalary']?.toString() ?? study['salary']?.toString() ?? '₹10–30 LPA';
    final description = study['description']?.toString() ?? '';
    final specializations = (study['specializations'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final exams = (study['entranceExams'] as List?)?.map((e) => e.toString()).toList() ?? (study['exams'] as List?)?.map((e) => e.toString()).toList() ?? [];
    final topUniversities = (study['topColleges'] as List?)?.map((u) => u.toString()).toList() ?? (study['universities'] as List?)?.map((u) => u.toString()).toList() ?? [];
    final skills = (study['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final careers = (study['careers'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final certifications = (study['certifications'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final programs = (study['programs'] as List?) ?? [];

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
                widget.onAddToCompare!(study);
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
              // Hero Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: CareerPathApp.getCardBg(context),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    Text(icon, style: const TextStyle(fontSize: 48)),
                    const SizedBox(height: 10),
                    Text(sector, style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                    const SizedBox(height: 4),
                    Text(title, style: TextStyle(color: theme.colorScheme.primary, fontSize: 14, fontWeight: FontWeight.w600), textAlign: TextAlign.center),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8, runSpacing: 8, alignment: WrapAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(color: theme.colorScheme.primary.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                          child: Text('⏳ Duration: $duration', style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold, fontSize: 11)),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(color: Colors.greenAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                          child: Text('💰 Salary: $avgSalary', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 11)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Roadmap (5-step matching Web masterDetail)
              _buildMasterRoadmapTimeline(study),

              // Overview
              if (description.isNotEmpty)
                _buildCard('📖 Program Description', Text(description, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0)))),

              // Eligibility
              _buildCard('📋 Eligibility Criteria', Text(eligibility, style: const TextStyle(fontSize: 13, height: 1.4, fontWeight: FontWeight.w600))),

              // Specializations
              if (specializations.isNotEmpty)
                _buildCard('📚 Recommended Specializations', Wrap(
                  spacing: 6, runSpacing: 6,
                  children: specializations.map((s) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: theme.colorScheme.secondary.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(s, style: TextStyle(color: theme.colorScheme.secondary, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              // Exams
              if (exams.isNotEmpty)
                _buildCard('📝 Entrance Exams Required', Wrap(
                  spacing: 6, runSpacing: 6,
                  children: exams.map((ex) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: theme.colorScheme.primary.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(ex, style: TextStyle(color: theme.colorScheme.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              // Top Colleges
              if (topUniversities.isNotEmpty)
                _buildCard('🏫 Top Colleges / Institutes', Wrap(
                  spacing: 6, runSpacing: 6,
                  children: topUniversities.map((u) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.white.withOpacity(0.08), borderRadius: BorderRadius.circular(8)),
                    child: Text(u, style: const TextStyle(fontSize: 12, color: Colors.white70)),
                  )).toList(),
                )),

              // Key Skills
              if (skills.isNotEmpty)
                _buildCard('🛠️ Key Skills to Learn', Wrap(
                  spacing: 6, runSpacing: 6,
                  children: skills.map((s) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.amberAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(s, style: const TextStyle(color: Colors.amberAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              // Expandable Degree Programs (Matching Web Accordion)
              if (programs.isNotEmpty)
                _buildCard('🎓 Choose Specialization / Degree Path', Column(
                  children: List.generate(programs.length, (pIdx) {
                    final prog = Map<String, dynamic>.from(programs[pIdx] as Map);
                    final pTitle = prog['title']?.toString() ?? 'Specialization';
                    final pIcon = prog['icon']?.toString() ?? '🎓';
                    final pCareers = (prog['careers'] as List?)?.map((c) => c.toString()).toList() ?? [];
                    final isExpanded = _expandedProg == pIdx;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.03),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
                      ),
                      child: ListTile(
                        leading: Text(pIcon, style: const TextStyle(fontSize: 24)),
                        title: Text(pTitle, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 14)),
                        trailing: Icon(isExpanded ? Icons.expand_less : Icons.expand_more, color: theme.colorScheme.primary),
                        onTap: () {
                          setState(() {
                            _expandedProg = isExpanded ? null : pIdx;
                          });
                        },
                        subtitle: isExpanded && pCareers.isNotEmpty
                            ? Padding(
                                padding: const EdgeInsets.only(top: 8.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('💼 LEADS-TO CAREER ROLES:', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
                                    const SizedBox(height: 6),
                                    Wrap(
                                      spacing: 6, runSpacing: 6,
                                      children: pCareers.map((c) => Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: Colors.greenAccent.withOpacity(0.12),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(c, style: const TextStyle(color: Colors.greenAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                                      )).toList(),
                                    ),
                                  ],
                                ),
                              )
                            : null,
                      ),
                    );
                  }),
                ))
              else if (careers.isNotEmpty)
                _buildCard('💼 Career Roles', Wrap(
                  spacing: 6, runSpacing: 6,
                  children: careers.map((c) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.greenAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(c, style: const TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              // Certifications
              if (certifications.isNotEmpty)
                _buildCard('🏆 Top Certifications', Wrap(
                  spacing: 6, runSpacing: 6,
                  children: certifications.map((c) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.purpleAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(c, style: const TextStyle(color: Colors.purpleAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── STUDY ABROAD DETAIL SCREEN (Matching Web Country Guide) ─────────
class GraduationStudyAbroadDetailPage extends StatelessWidget {
  final Map<String, dynamic> abroad;

  const GraduationStudyAbroadDetailPage({
    super.key,
    required this.abroad,
  });

  Widget _buildCard(BuildContext context, {required String title, required Widget content}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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

  Widget _buildStudyAbroadRoadmapTimeline(BuildContext context) {
    final theme = Theme.of(context);
    final country = abroad['country']?.toString() ?? 'Abroad';
    final topUniversities = (abroad['topUniversities'] as List?)?.map((u) => u.toString()).toList() ?? (abroad['topColleges'] as List?)?.map((u) => u.toString()).toList() ?? [];
    final exams = (abroad['entranceExams'] as List?)?.map((e) => e.toString()).toList() ?? (abroad['exams'] as List?)?.map((e) => e.toString()).toList() ?? [];
    final popularCourses = (abroad['popularCourses'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final visaType = abroad['visaType']?.toString() ?? abroad['visaRules']?.toString() ?? 'Student Visa';
    final workOpportunity = abroad['workOpportunity']?.toString() ?? abroad['visa']?.toString() ?? 'post-study permit';

    final unisStr = topUniversities.isNotEmpty ? topUniversities.take(3).join(', ') : 'target institutions';
    final examsStr = exams.isNotEmpty ? exams.join(', ') : 'standard entrance tests like IELTS / TOEFL';
    final coursesStr = popularCourses.isNotEmpty ? popularCourses.take(3).join(', ') : 'your chosen major';

    final steps = [
      {
        "title": "1. Choose Your School",
        "subtitle": "Target top institutions",
        "desc": "Explore and select your target universities: $unisStr."
      },
      {
        "title": "2. Ace the Exams",
        "subtitle": "Prepare test requirements",
        "desc": "Study for and clear the required language and academic tests: $examsStr."
      },
      {
        "title": "3. Complete Applications",
        "subtitle": "Submit your packages",
        "desc": "Write a compelling Statement of Purpose, collect recommendation letters, and apply for popular courses: $coursesStr."
      },
      {
        "title": "4. Secure the Visa",
        "subtitle": "Get your official paperwork",
        "desc": "Secure standard student visa permits: $visaType and arrange your financials."
      },
      {
        "title": "5. Land & Adapt",
        "subtitle": "Settle down and work abroad",
        "desc": "Complete travel arrangements, settle your housing, and explore local work rights: $workOpportunity."
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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final title = abroad['title']?.toString() ?? abroad['country']?.toString() ?? 'Study Abroad Destination';
    final country = abroad['country']?.toString() ?? title;
    final description = abroad['description']?.toString() ?? '';
    final tuition = abroad['avgTuition']?.toString() ?? abroad['tuition']?.toString() ?? abroad['cost']?.toString() ?? '₹20L - ₹45L / year';
    final livingCost = abroad['livingCost']?.toString() ?? '₹8L - ₹14L / year';
    final visaType = abroad['visaType']?.toString() ?? abroad['visaRules']?.toString() ?? 'Student Visa';
    final workOpportunity = abroad['workOpportunity']?.toString() ?? abroad['visa']?.toString() ?? 'Post-Study Work Permit available';
    final entranceExams = (abroad['entranceExams'] as List?)?.map((e) => e.toString()).toList() ?? 
                          (abroad['exams'] is List ? (abroad['exams'] as List).map((e) => e.toString()).toList() : (abroad['exams'] != null ? [abroad['exams'].toString()] : ['IELTS', 'TOEFL', 'GRE']));
    final topUniversities = (abroad['topUniversities'] as List?)?.map((u) => u.toString()).toList() ?? (abroad['topColleges'] as List?)?.map((u) => u.toString()).toList() ?? [];
    final popularCourses = (abroad['popularCourses'] as List?)?.map((c) => c.toString()).toList() ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(country, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 18)),
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
              // Hero Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: CareerPathApp.getCardBg(context),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                ),
                child: Column(
                  children: [
                    const Text('✈️', style: TextStyle(fontSize: 48)),
                    const SizedBox(height: 10),
                    Text(title, style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                    if (description.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      Text(description, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)), textAlign: TextAlign.center),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Cost Estimates Box
              _buildCard(context, title: '💰 COST ESTIMATES', content: Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: theme.colorScheme.primary.withOpacity(0.08), borderRadius: BorderRadius.circular(10), border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2))),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('TUITION FEE', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          Text(tuition, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: Colors.amber.withOpacity(0.08), borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.amber.withOpacity(0.2))),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('LIVING COST', style: TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          Text(livingCost, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.amberAccent)),
                        ],
                      ),
                    ),
                  ),
                ],
              )),

              // Roadmap Timeline (5 steps matching Web)
              _buildStudyAbroadRoadmapTimeline(context),

              // Visa & Work Rights
              _buildCard(context, title: '🛂 VISA & WORK RIGHTS', content: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Visa Type: $visaType', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('Work Rights: $workOpportunity', style: const TextStyle(fontSize: 13, height: 1.3, color: Color(0xFFE2E8F0))),
                ],
              )),

              // Entrance Exams
              if (entranceExams.isNotEmpty)
                _buildCard(context, title: '📝 ENTRANCE EXAMS', content: Wrap(
                  spacing: 6, runSpacing: 6,
                  children: entranceExams.map((ex) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: theme.colorScheme.primary.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(ex, style: TextStyle(color: theme.colorScheme.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              // Top Universities
              if (topUniversities.isNotEmpty)
                _buildCard(context, title: '🏫 TOP UNIVERSITIES', content: Wrap(
                  spacing: 6, runSpacing: 6,
                  children: topUniversities.map((u) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.white.withOpacity(0.08), borderRadius: BorderRadius.circular(8)),
                    child: Text(u, style: const TextStyle(fontSize: 12, color: Colors.white70)),
                  )).toList(),
                )),

              // Popular Courses
              if (popularCourses.isNotEmpty)
                _buildCard(context, title: '📚 POPULAR COURSES', content: Wrap(
                  spacing: 6, runSpacing: 6,
                  children: popularCourses.map((c) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.cyanAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(c, style: const TextStyle(color: Colors.cyanAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                  )).toList(),
                )),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}
