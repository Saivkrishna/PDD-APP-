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
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
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
            final dept = departments[idx];
            final deptName = dept['name']?.toString() ?? dept['title']?.toString() ?? 'Department';
            final duration = dept['duration']?.toString() ?? '4 Years';
            final salary = dept['avgSalary']?.toString() ?? '₹6–18 LPA';
            final exams = (dept['exams'] as List?)?.map((e) => e.toString()).toList() ?? [];

            return Card(
              margin: const EdgeInsets.only(bottom: 14),
              color: CareerPathApp.getCardBg(context),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: CareerPathApp.getBorderColor(context)),
              ),
              child: ExpansionTile(
                title: Text(
                  deptName,
                  style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
                ),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 4.0),
                  child: Row(
                    children: [
                      Text('⏳ $duration', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                      const SizedBox(width: 12),
                      Text('💰 $salary', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.greenAccent)),
                    ],
                  ),
                ),
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        if (dept['eligibility'] != null) ...[
                          const Text('📋 ELIGIBILITY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.8)),
                          const SizedBox(height: 4),
                          Text(dept['eligibility'], style: const TextStyle(fontSize: 13, height: 1.3)),
                          const SizedBox(height: 12),
                        ],
                        if (exams.isNotEmpty) ...[
                          const Text('📅 ENTRANCE EXAMS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.8)),
                          const SizedBox(height: 6),
                          Wrap(
                            spacing: 6,
                            runSpacing: 6,
                            children: exams.map((ex) => Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: theme.colorScheme.primary.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(ex, style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                            )).toList(),
                          ),
                          const SizedBox(height: 12),
                        ],
                        if (dept['averageFees'] != null) ...[
                          const Text('💳 AVERAGE FEES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 0.8)),
                          const SizedBox(height: 4),
                          Text(dept['averageFees'], style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.amberAccent)),
                          const SizedBox(height: 12),
                        ],
                        ElevatedButton.icon(
                          icon: const Icon(Icons.compare_arrows, size: 16),
                          label: const Text('Add to Compare'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white.withOpacity(0.06),
                            foregroundColor: Colors.white,
                          ),
                          onPressed: () {
                            SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                            if (onAddToCompare != null) {
                              onAddToCompare!({
                                'id': dept['id'] ?? deptName,
                                'title': deptName,
                                'stream': streamId,
                                'duration': duration,
                                'salary': salary,
                                'eligibility': dept['eligibility'] ?? '',
                                'skills': (dept['careerRoles'] as List?) ?? [],
                                'workplaces': (dept['topRecruiters'] as List?) ?? [],
                              });
                            }
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Added $deptName to comparison!')),
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

// ─── JOB DETAILS SCREEN ─────────────────────────────────────────
class After12thJobDetailScreen extends StatelessWidget {
  final Map<String, dynamic> job;
  final Function(Map<String, dynamic>)? onAddToCompare;

  const After12thJobDetailScreen({
    super.key,
    required this.job,
    this.onAddToCompare,
  });

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
              _buildCard('📖 Overview', Text(description, style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFFE2E8F0)))),
              const SizedBox(height: 16),

              // How to become
              if (howToBecome.isNotEmpty) ...[
                _buildCard('🎓 Preparation & Pathway', Text(howToBecome, style: const TextStyle(fontSize: 13, height: 1.4, fontWeight: FontWeight.w600))),
                const SizedBox(height: 16),
              ],

              // Skills
              if (skills.isNotEmpty) ...[
                _buildCard(
                  '🧠 Key Skills Required',
                  Wrap(
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
                  '🏢 Workplaces & Sectors',
                  Wrap(
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
