import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';
import 'career_comparison_sheet.dart';

class After12thPage extends StatefulWidget {
  final Map<String, dynamic>? initialTarget;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const After12thPage({
    super.key,
    this.initialTarget,
    this.onAddToCompare,
  });

  @override
  State<After12thPage> createState() => _After12thPageState();
}

class _After12thPageState extends State<After12thPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _streams = [];
  List<dynamic> _sectors = [];
  List<dynamic> _jobs = [];
  String? _selectedStreamId;
  bool _loadingStreams = true;
  bool _loadingSectors = false;
  bool _loadingJobs = true;
  String _jobCategoryFilter = 'All';
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadInitialData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadInitialData() async {
    setState(() {
      _loadingStreams = true;
      _loadingJobs = true;
      _error = null;
    });

    try {
      final streamsRes = await ApiService.getAfter12thStreams();
      final jobsRes = await ApiService.getAfter12thJobs();

      if (mounted) {
        setState(() {
          _streams = streamsRes;
          _jobs = jobsRes;
          _loadingStreams = false;
          _loadingJobs = false;
        });

        if (streamsRes.isNotEmpty) {
          final targetStream = widget.initialTarget?['streamId']?.toString() ?? streamsRes.first['id']?.toString() ?? 'MPC';
          _selectStream(targetStream);
        }
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _streams = [
            {"id": "MPC", "label": "Maths, Physics, Chemistry (MPC)"},
            {"id": "BiPC", "label": "Biology, Physics, Chemistry (BiPC)"},
            {"id": "CEC", "label": "Commerce, Economics, Civics (CEC)"},
            {"id": "MEC", "label": "Maths, Economics, Commerce (MEC)"},
            {"id": "HEC", "label": "History, Economics, Civics (HEC)"},
            {"id": "Vocational", "label": "Vocational Streams"}
          ];
          _jobs = [
            {
              'id': 'data-entry-12',
              'title': 'Data Entry Operator',
              'icon': '🖥️',
              'category': 'IT',
              'salary': '₹12K–₹20K/month',
              'description': 'Handle data processing, typing, and spreadsheets in corporate offices and IT centers.',
              'skills': ['Fast Typing', 'MS Excel', 'Accuracy', 'Communication'],
              'howToBecome': 'Learn MS Office, Excel formulas, and keyboard typing efficiency.',
              'workplaces': ['Offices', 'BPOs', 'Data Centers']
            },
            {
              'id': 'graphic-designer-12',
              'title': 'Graphic Designer',
              'icon': '🎨',
              'category': 'IT',
              'salary': '₹18K–₹35K/month',
              'description': 'Design creative digital graphics, brand posters, and UI assets for web/social media.',
              'skills': ['Photoshop', 'Illustrator', 'Figma', 'Creativity'],
              'howToBecome': 'Master visual design principles, typography, and Adobe Creative Suite.',
              'workplaces': ['Marketing Agencies', 'IT Companies', 'Freelancing']
            },
            {
              'id': 'police-12',
              'title': 'Police Constable',
              'icon': '👮',
              'category': 'Government',
              'salary': '₹25K–₹45K/month',
              'description': 'Maintains public safety, enforces state laws, and assists in community protection.',
              'skills': ['Physical Fitness', 'Law Knowledge', 'Communication'],
              'howToBecome': 'Qualify state constable recruitment written and physical endurance tests.',
              'workplaces': ['State Police Stations', 'Patrol Units']
            }
          ];
          _loadingStreams = false;
          _loadingJobs = false;
        });
        _selectStream('MPC');
      }
    }
  }

  void _selectStream(String streamId) async {
    setState(() {
      _selectedStreamId = streamId;
      _loadingSectors = true;
    });

    try {
      final sectors = await ApiService.getAfter12thSectors(streamId);
      if (mounted) {
        setState(() {
          _sectors = sectors;
          _loadingSectors = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _sectors = [
            {
              'id': 'eng',
              'title': 'Engineering & Technology',
              'icon': '💻',
              'description': 'Design, code, build, and deploy software, hardware, and physical infrastructure systems.',
              'departments': [
                {
                  'id': 'cse',
                  'name': 'Computer Science & Engineering (CSE)',
                  'duration': '4 Years',
                  'eligibility': 'Class 12 pass with 50% in MPC + JEE / State Entrance (EAMCET)',
                  'exams': ['JEE Main', 'JEE Advanced', 'EAMCET', 'BITSAT'],
                  'averageFees': '₹1.5L - ₹4L / year',
                  'avgSalary': '₹6.5 - ₹24 LPA',
                  'topRecruiters': ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys'],
                  'careerRoles': ['Software Engineer', 'Full Stack Developer', 'Cloud Architect']
                },
                {
                  'id': 'ece',
                  'name': 'Electronics & Communication (ECE)',
                  'duration': '4 Years',
                  'eligibility': 'Class 12 pass with 50% in MPC',
                  'exams': ['JEE Main', 'EAMCET', 'BITSAT'],
                  'averageFees': '₹1.2L - ₹3.5L / year',
                  'avgSalary': '₹5.5 - ₹16 LPA',
                  'topRecruiters': ['Intel', 'Qualcomm', 'Texas Instruments', 'ISRO'],
                  'careerRoles': ['VLSI Engineer', 'Embedded Systems Developer', 'Hardware Designer']
                }
              ]
            },
            {
              'id': 'architecture',
              'title': 'Architecture & Planning',
              'icon': '🏛️',
              'description': 'Building design, urban planning, landscape architecture, and construction management.',
              'departments': [
                {
                  'id': 'barch',
                  'name': 'Bachelor of Architecture (B.Arch)',
                  'duration': '5 Years',
                  'eligibility': 'Class 12 with Math + NATA / JEE Main Paper 2',
                  'exams': ['NATA', 'JEE Main Paper 2'],
                  'averageFees': '₹1.5L - ₹3L / year',
                  'avgSalary': '₹4.5 - ₹12 LPA',
                  'topRecruiters': ['L&T Construction', 'Architectural Firms', 'Urban Development Authorities'],
                  'careerRoles': ['Architect', 'Urban Planner', 'Interior Designer']
                }
              ]
            }
          ];
          _loadingSectors = false;
        });
      }
    }
  }

  void _showSectorDetail(Map<String, dynamic> sector) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => After12thSectorDetailPage(
          sector: sector,
          streamId: _selectedStreamId ?? 'MPC',
          onAddToCompare: widget.onAddToCompare,
        ),
      ),
    );
  }

  void _showJobDetail(Map<String, dynamic> job) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => After12thJobDetailScreen(
          job: job,
          onAddToCompare: widget.onAddToCompare,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    final filteredJobs = _jobCategoryFilter == 'All'
        ? _jobs
        : _jobs.where((j) => j['category'] == _jobCategoryFilter).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(state?.translate('after12th') ?? 'Career After 12th', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: theme.unselectedWidgetColor.withOpacity(0.6),
          indicatorColor: theme.colorScheme.primary,
          tabs: const [
            Tab(text: 'Degree & Sectors'),
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
        child: TabBarView(
          controller: _tabController,
          children: [
            // Tab 1: Streams & Sectors
            Column(
              children: [
                // Horizontal Stream Selector Chips
                Container(
                  height: 52,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: _loadingStreams
                      ? const Center(child: CircularProgressIndicator())
                      : ListView.builder(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: _streams.length,
                          itemBuilder: (context, idx) {
                            final s = _streams[idx];
                            final isSel = _selectedStreamId == s['id'];
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: ChoiceChip(
                                label: Text(s['label'] ?? s['id'] ?? ''),
                                selected: isSel,
                                selectedColor: theme.colorScheme.primary.withOpacity(0.25),
                                labelStyle: TextStyle(
                                  color: isSel ? theme.colorScheme.primary : Colors.white70,
                                  fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                                  fontSize: 12,
                                ),
                                onSelected: (_) {
                                  SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                                  _selectStream(s['id']);
                                },
                              ),
                            );
                          },
                        ),
                ),
                
                // Sectors list
                Expanded(
                  child: _loadingSectors
                      ? const Center(child: CircularProgressIndicator())
                      : _sectors.isEmpty
                          ? const Center(child: Text('No sectors found for this stream.'))
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _sectors.length,
                              itemBuilder: (context, idx) {
                                final sec = _sectors[idx];
                                final depts = (sec['departments'] as List?) ?? [];
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  color: CareerPathApp.getCardBg(context),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14),
                                    side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                                  ),
                                  child: InkWell(
                                    onTap: () => _showSectorDetail(sec),
                                    borderRadius: BorderRadius.circular(14),
                                    child: Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Text(sec['icon'] ?? '🎓', style: const TextStyle(fontSize: 26)),
                                              const SizedBox(width: 12),
                                              Expanded(
                                                child: Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    Text(
                                                      sec['title'] ?? '',
                                                      style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
                                                    ),
                                                    if (depts.isNotEmpty)
                                                      Text(
                                                        '${depts.length} Specialized Degrees',
                                                        style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.bold),
                                                      ),
                                                  ],
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
                ),
              ],
            ),

            // Tab 2: Direct Jobs
            Column(
              children: [
                // Category filter chips
                Container(
                  height: 48,
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    children: ['All', 'IT', 'Non-IT', 'Government'].map((cat) {
                      final isSel = _jobCategoryFilter == cat;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(cat),
                          selected: isSel,
                          onSelected: (_) {
                            SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                            setState(() {
                              _jobCategoryFilter = cat;
                            });
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),

                // Jobs list
                Expanded(
                  child: _loadingJobs
                      ? const Center(child: CircularProgressIndicator())
                      : filteredJobs.isEmpty
                          ? const Center(child: Text('No jobs found in this category.'))
                          : ListView.builder(
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
                                      child: Text(j['salary'] ?? '', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 13)),
                                    ),
                                    trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                                    onTap: () => _showJobDetail(j),
                                  ),
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

// ─── SECTOR DETAIL PAGE ─────────────────────────────────────────
class After12thSectorDetailPage extends StatelessWidget {
  final Map<String, dynamic> sector;
  final String streamId;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const After12thSectorDetailPage({
    super.key,
    required this.sector,
    required this.streamId,
    this.onAddToCompare,
  });

  @override
  Widget build(BuildContext context) {
    final title = sector['title']?.toString() ?? 'Sector Details';
    final departments = (sector['departments'] as List?) ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
          padding: const EdgeInsets.all(16),
          itemCount: departments.length,
          itemBuilder: (context, idx) {
            final dept = Map<String, dynamic>.from(departments[idx] as Map);
            final deptName = dept['name']?.toString() ?? dept['title']?.toString() ?? 'Department';
            final duration = dept['duration']?.toString() ?? '4 Years';
            final salary = dept['avgSalary']?.toString() ?? dept['salary']?.toString() ?? '₹6–18 LPA';
            final icon = dept['icon']?.toString() ?? '🎯';
            final desc = dept['description']?.toString() ?? '';

            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              color: CareerPathApp.getCardBg(context),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: CareerPathApp.getBorderColor(context)),
              ),
              child: ListTile(
                contentPadding: const EdgeInsets.all(16),
                leading: Text(icon, style: const TextStyle(fontSize: 32)),
                title: Text(deptName, style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (desc.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(desc, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                    ],
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Text('⏳ $duration', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                        const SizedBox(width: 12),
                        Text('💰 $salary', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
                      ],
                    ),
                  ],
                ),
                trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => After12thDeptDetailScreen(
                        dept: dept,
                        streamId: streamId,
                        onAddToCompare: onAddToCompare,
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

// ─── DEPARTMENT / DEGREE DETAIL SCREEN (Matching Web DeptDetail) ─────
class After12thDeptDetailScreen extends StatefulWidget {
  final Map<String, dynamic> dept;
  final String streamId;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const After12thDeptDetailScreen({
    super.key,
    required this.dept,
    required this.streamId,
    this.onAddToCompare,
  });

  @override
  State<After12thDeptDetailScreen> createState() => _After12thDeptDetailScreenState();
}

class _After12thDeptDetailScreenState extends State<After12thDeptDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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

  Widget _buildDeptRoadmapTimeline(Map<String, dynamic> dept) {
    final theme = Theme.of(context);
    final title = dept['title']?.toString() ?? dept['name']?.toString() ?? 'this program';
    final exams = (dept['entranceExams'] as List?)?.map((e) => e.toString()).toList() ?? (dept['exams'] as List?)?.map((e) => e.toString()).toList() ?? [];
    final subjects = (dept['subjects'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final skills = (dept['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final tools = (dept['tools'] as List?)?.map((t) => t.toString()).toList() ?? [];
    final careers = (dept['careers'] as List?)?.map((c) => c.toString()).toList() ?? (dept['careerRoles'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final salary = dept['salary']?.toString() ?? dept['avgSalary']?.toString() ?? 'competitive packages';

    final examsStr = exams.isNotEmpty ? exams.join(', ') : 'Academic Merit scores';
    final subjectsStr = subjects.isNotEmpty ? subjects.take(3).join(', ') : 'core curriculum';
    final toolsStr = tools.isNotEmpty ? tools.take(3).join(', ') : 'standard tools';
    final skillsStr = skills.isNotEmpty ? skills.take(3).join(', ') : 'practical engineering skills';
    final careersStr = careers.isNotEmpty ? careers.take(3).join(', ') : 'professional roles';

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
        "desc": "Participate in recruitment and apply for target roles: $careersStr with salary average: $salary."
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
    final dept = widget.dept;
    final deptName = dept['name']?.toString() ?? dept['title']?.toString() ?? 'Department Detail';
    final icon = dept['icon']?.toString() ?? '🎯';
    final description = dept['description']?.toString() ?? '';
    final duration = dept['duration']?.toString() ?? '4 Years';
    final eligibility = dept['eligibility']?.toString() ?? 'Class 12 pass in required stream';
    final salary = dept['salary']?.toString() ?? dept['avgSalary']?.toString() ?? '₹4–12 LPA';
    final averageFees = dept['averageFees']?.toString() ?? dept['avgFees']?.toString() ?? '₹1.5L - ₹4L / year';
    final entranceExams = (dept['entranceExams'] as List?)?.map((e) => e.toString()).toList() ?? (dept['exams'] as List?)?.map((e) => e.toString()).toList() ?? [];
    final subjects = (dept['subjects'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final skills = (dept['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final tools = (dept['tools'] as List?)?.map((t) => t.toString()).toList() ?? [];
    final higherStudies = (dept['higherStudies'] as List?)?.map((h) => h.toString()).toList() ?? [];
    final certifications = (dept['certifications'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final futureScope = dept['futureScope']?.toString() ?? '';
    final locations = (dept['locations'] as List?)?.map((l) => l.toString()).toList() ?? [];
    final careers = (dept['careers'] as List?)?.map((c) => c.toString()).toList() ?? (dept['careerRoles'] as List?)?.map((c) => c.toString()).toList() ?? [];
    final topRecruiters = (dept['topColleges'] as List?)?.map((c) => c.toString()).toList() ?? (dept['topRecruiters'] as List?)?.map((r) => r.toString()).toList() ?? [];

    return Scaffold(
      appBar: AppBar(
        title: Text(deptName, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 17)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.compare_arrows),
            tooltip: 'Add to Compare',
            onPressed: () {
              SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
              if (widget.onAddToCompare != null) {
                widget.onAddToCompare!(dept);
              }
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Added $deptName to comparison!')),
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
            Tab(text: '💼 Career Roles (${careers.length})'),
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
        child: TabBarView(
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
                        Text(deptName, style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          alignment: WrapAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(color: theme.colorScheme.primary.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                              child: Text('⏳ Duration: $duration', style: TextStyle(color: theme.colorScheme.primary, fontWeight: FontWeight.bold, fontSize: 11)),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(color: Colors.greenAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                              child: Text('💰 Salary: $salary', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 11)),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(color: Colors.amberAccent.withOpacity(0.12), borderRadius: BorderRadius.circular(8)),
                              child: Text('💳 Fees: $averageFees', style: const TextStyle(color: Colors.amberAccent, fontWeight: FontWeight.bold, fontSize: 11)),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Overview
                  if (description.isNotEmpty)
                    _buildCard('📖 Program Description', Text(description, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0)))),

                  // Eligibility
                  _buildCard('🎓 Eligibility Criteria', Text(eligibility, style: const TextStyle(fontSize: 13, height: 1.4, fontWeight: FontWeight.w600))),

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

                  // Roadmap Timeline (5 steps matching Web)
                  _buildDeptRoadmapTimeline(dept),

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
                    _buildCard('🎓 Higher Studies Options', Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: higherStudies.map((h) => Padding(
                        padding: const EdgeInsets.only(bottom: 6.0),
                        child: Row(
                          children: [
                            const Text('🎓 ', style: TextStyle(fontSize: 14)),
                            Expanded(child: Text(h, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFFFFD166)))),
                          ],
                        ),
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
                    _buildCard('🔮 Future Scope & Growth', Text(futureScope, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFFFD166), fontWeight: FontWeight.w600))),

                  // Locations / Top Institutes
                  if (locations.isNotEmpty || topRecruiters.isNotEmpty)
                    _buildCard('📍 Top Institutes / Locations', Wrap(
                      spacing: 6, runSpacing: 6,
                      children: (locations.isNotEmpty ? locations : topRecruiters).map((l) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(color: Colors.white.withOpacity(0.08), borderRadius: BorderRadius.circular(8)),
                        child: Text(l, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                      )).toList(),
                    )),
                ],
              ),
            ),

            // TAB 2: Career Roles
            ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: careers.length,
              itemBuilder: (context, idx) {
                final role = careers[idx];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  color: CareerPathApp.getCardBg(context),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                    side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: const Text('💼', style: TextStyle(fontSize: 28)),
                    title: Text(role, style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 15)),
                    subtitle: Text('Avg Salary: $salary', style: const TextStyle(color: Colors.greenAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => After12thJobDetailScreen(
                            job: {
                              'id': 'job-$idx',
                              'title': role,
                              'icon': '💼',
                              'category': widget.streamId,
                              'salary': salary,
                              'description': 'Professional career role following completion of $deptName.',
                              'howToBecome': 'Complete $deptName degree and apply through campus placements or corporate hiring.',
                              'skills': skills,
                              'workplaces': topRecruiters.isNotEmpty ? topRecruiters : ['Corporate Offices', 'MNCs', 'Tech Firms']
                            },
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

// ─── JOB DETAILS SCREEN (Matching Web Job12thDetail) ─────────────────
class After12thJobDetailScreen extends StatelessWidget {
  final Map<String, dynamic> job;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const After12thJobDetailScreen({
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
    final howToBecome = job['howToBecome']?.toString() ?? '';
    final category = job['category']?.toString() ?? 'General';
    final salary = job['salary']?.toString() ?? 'competitive packages';
    final skills = (job['skills'] as List?)?.map((s) => s.toString()).toList() ?? [];
    final workplaces = (job['workplaces'] as List?)?.map((w) => w.toString()).toList() ?? [];

    final skillsStr = skills.isNotEmpty ? skills.join(', ') : 'domain methods';
    final workplacesStr = workplaces.isNotEmpty ? workplaces.join(', ') : 'active workplaces';

    final steps = [
      {
        "title": "1. Meet the Prerequisites",
        "subtitle": "Complete your basic studies",
        "desc": howToBecome.isNotEmpty
            ? "Start by achieving the required education: $howToBecome"
            : "Ensure you have completed your 12th standard education or equivalent."
      },
      {
        "title": "2. Train Your Skills",
        "subtitle": "Acquire key job skills",
        "desc": "Learn the essential daily techniques and capabilities: $skillsStr."
      },
      {
        "title": "3. Master the Tools",
        "subtitle": "Learn industry software",
        "desc": "Get comfortable with the software and tools used in places like: $workplacesStr."
      },
      {
        "title": "4. Build a Portfolio",
        "subtitle": "Show what you can do",
        "desc": "Create simple personal or mock projects, construct a neat resume, and document your learning."
      },
      {
        "title": "5. Secure the Placement",
        "subtitle": "Start applying and earning",
        "desc": "Apply for $title positions in the $category sector with salary ranges of $salary."
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

    final title = job['title']?.toString() ?? 'Job Role';
    final salary = job['salary']?.toString() ?? '₹18,000 - ₹35,000 / month';
    final category = job['category']?.toString() ?? 'General';
    final description = job['description']?.toString() ?? '';
    final howToBecome = job['howToBecome']?.toString() ?? '';
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
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        category.toUpperCase(),
                        style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ),
                    const SizedBox(height: 10),
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
              _buildCard(context, title: '📖 Job Description', content: Text(description, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0)))),

              // How to become
              if (howToBecome.isNotEmpty)
                _buildCard(context, title: '🎯 How to Become', content: Text(howToBecome, style: const TextStyle(fontSize: 13, height: 1.4, fontWeight: FontWeight.w600))),

              // Job Career Roadmap (5-step matching Web Job12thDetail)
              _buildJobRoadmapTimeline(context),

              // Skills
              if (skills.isNotEmpty)
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

              // Workplaces
              if (workplaces.isNotEmpty)
                _buildCard(
                  context,
                  title: '🏢 Where to Work',
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

              const SizedBox(height: 8),

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
}
