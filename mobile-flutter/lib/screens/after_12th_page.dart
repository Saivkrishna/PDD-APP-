import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class After12thPage extends StatefulWidget {
  const After12thPage({super.key});

  @override
  State<After12thPage> createState() => _After12thPageState();
}

class _After12thPageState extends State<After12thPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _streams = [];
  List<dynamic> _sectors = [];
  String? _selectedStreamId;
  bool _loadingStreams = true;
  bool _loadingSectors = false;
  String _jobCategoryFilter = 'All';

  final List<Map<String, dynamic>> _jobs12 = [
    {
      'id': 'data-entry-12',
      'title': 'Data Entry Operator',
      'icon': '🖥️',
      'category': 'IT',
      'salary': '₹12K–₹20K/month',
      'description': 'Handle data entry, typing and computer operations in offices, BPOs and data centers.',
      'skills': ['Fast Typing', 'MS Excel', 'Communication', 'Accuracy'],
      'howToBecome': 'Learn basic computer skills, MS Office and typing practice.',
      'workplaces': ['Offices', 'BPOs', 'Data Centers']
    },
    {
      'id': 'graphic-designer-12',
      'title': 'Graphic Designer',
      'icon': '🎨',
      'category': 'IT',
      'salary': '₹15K–₹30K/month',
      'description': 'Create visual content for brands, social media, ads and digital platforms.',
      'skills': ['Canva', 'Photoshop', 'Illustrator', 'Creativity'],
      'howToBecome': 'Learn Canva, Photoshop and Illustrator.',
      'workplaces': ['Marketing Agencies', 'IT Companies', 'Freelancing']
    },
    {
      'id': 'video-editor-12',
      'title': 'Video Editor',
      'icon': '🎬',
      'category': 'IT',
      'salary': '₹15K–₹35K/month',
      'description': 'Edit and produce video content for YouTube channels, media companies and brands.',
      'skills': ['Premiere Pro', 'CapCut', 'After Effects', 'Creativity'],
      'howToBecome': 'Learn Premiere Pro, CapCut or After Effects.',
      'workplaces': ['YouTube Channels', 'Media Companies', 'Freelancing']
    },
    {
      'id': 'retail-12',
      'title': 'Retail Staff',
      'icon': '🛍️',
      'category': 'Non-IT',
      'salary': '₹12K–₹20K/month',
      'description': 'Handle customer service, billing and store operations in retail outlets.',
      'skills': ['Sales', 'Customer Handling', 'Communication'],
      'howToBecome': 'Communication and customer service skills.',
      'workplaces': ['Malls', 'Supermarkets', 'Stores']
    },
    {
      'id': 'bpo-12',
      'title': 'BPO Executive',
      'icon': '📞',
      'category': 'Non-IT',
      'salary': '₹15K–₹28K/month',
      'description': 'Handle inbound/outbound calls and customer support in call centres.',
      'skills': ['Speaking Skills', 'Problem Solving', 'English Communication'],
      'howToBecome': 'Basic English and communication training.',
      'workplaces': ['Call Centers', 'ITES Companies']
    },
    {
      'id': 'police-12',
      'title': 'Police Constable',
      'icon': '👮',
      'category': 'Government',
      'salary': '₹25K–₹45K/month',
      'description': 'Maintain law and order, assist investigations and serve the community.',
      'skills': ['Fitness', 'Discipline', 'Communication'],
      'howToBecome': 'State police recruitment exams.',
      'workplaces': ['Police Department']
    },
    {
      'id': 'army-12',
      'title': 'Army / NDA',
      'icon': '🪖',
      'category': 'Government',
      'salary': '₹35K–₹60K/month',
      'description': 'Serve in the Indian Army, Navy or Air Force as a soldier or officer.',
      'skills': ['Physical Fitness', 'Leadership', 'Discipline'],
      'howToBecome': 'NDA exam or Army recruitment rally.',
      'workplaces': ['Indian Army', 'Navy', 'Air Force']
    }
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadStreams();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _loadStreams() async {
    try {
      final res = await ApiService.getAfter12thStreams();
      setState(() {
        _streams = res;
        _loadingStreams = false;
      });
      if (_streams.isNotEmpty) {
        _selectStream(_streams[0]['id']);
      }
    } catch (_) {
      setState(() {
        _streams = [
          {'id': 'mpc', 'title': 'MPC (Maths, Physics, Chemistry)'},
          {'id': 'bipc', 'title': 'BiPC (Biology, Physics, Chemistry)'},
          {'id': 'cec', 'title': 'CEC (Commerce, Economics, Civics)'},
          {'id': 'mec', 'title': 'MEC (Maths, Economics, Commerce)'}
        ];
        _loadingStreams = false;
      });
      _selectStream('mpc');
    }
  }

  void _selectStream(String streamId) async {
    setState(() {
      _selectedStreamId = streamId;
      _loadingSectors = true;
      _sectors = [];
    });
    try {
      final res = await ApiService.getAfter12thSectors(streamId);
      setState(() {
        _sectors = res;
        _loadingSectors = false;
      });
    } catch (_) {
      // Mock Fallback
      setState(() {
        _sectors = [
          {
            'id': 'eng',
            'title': 'Engineering & Technology',
            'icon': '💻',
            'description': 'Designing and building software, electronics, structures, and systems.',
            'departments': [
              {'id': 'cse', 'title': 'Computer Science Engineering', 'duration': '4 Years', 'eligibility': '12th MPC Pass'},
              {'id': 'ece', 'title': 'Electronics & Communication', 'duration': '4 Years', 'eligibility': '12th MPC Pass'}
            ]
          },
          {
            'id': 'pure_sci',
            'title': 'Pure Sciences',
            'icon': '🔬',
            'description': 'Exploring foundational physics, chemistry, and mathematics degrees.',
            'departments': [
              {'id': 'bsc_physics', 'title': 'B.Sc. Physics', 'duration': '3 Years', 'eligibility': '12th Pass'}
            ]
          }
        ];
        _loadingSectors = false;
      });
    }
  }

  void _showJobDetail(Map<String, dynamic> job) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => JobDetail12thScreen(job: job)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    final filteredJobs = _jobCategoryFilter == 'All'
        ? _jobs12
        : _jobs12.where((j) => j['category'] == _jobCategoryFilter).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Career After 12th', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
            colors: theme.brightness == Brightness.dark
                ? [const Color(0xFF0F0826), const Color(0xFF06020F)]
                : [const Color(0xFFEBE9FF), const Color(0xFFF8F9FA)],
          ),
        ),
        child: TabBarView(
          controller: _tabController,
          children: [
            // Tab 1: Streams
            _loadingStreams
                ? const Center(child: CircularProgressIndicator())
                : Column(
                    children: [
                      // Stream Chips horizontal view
                      Container(
                        height: 50,
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: _streams.length,
                          itemBuilder: (context, idx) {
                            final s = _streams[idx];
                            final isSel = s['id'] == _selectedStreamId;
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: ChoiceChip(
                                label: Text(s['title']?.toString().split(' ')[0] ?? ''),
                                selected: isSel,
                                selectedColor: theme.colorScheme.primary.withOpacity(0.2),
                                labelStyle: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: isSel ? theme.colorScheme.primary : theme.unselectedWidgetColor,
                                ),
                                onSelected: (_) {
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
                            : ListView.builder(
                                padding: const EdgeInsets.all(16),
                                itemCount: _sectors.length,
                                itemBuilder: (context, idx) {
                                  final sec = _sectors[idx];
                                  final List<dynamic> depts = sec['departments'] ?? [];
                                  return Card(
                                    margin: const EdgeInsets.only(bottom: 15),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                    child: Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Text(sec['icon'] ?? '💼', style: const TextStyle(fontSize: 24)),
                                              const SizedBox(width: 10),
                                              Expanded(
                                                child: Text(sec['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 6),
                                          Text(sec['description'] ?? '', style: TextStyle(fontSize: 12, color: theme.textTheme.bodyMedium?.color?.withOpacity(0.7))),
                                          const SizedBox(height: 12),
                                          const Divider(),
                                          const SizedBox(height: 8),
                                          const Text('Courses / Degrees:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey)),
                                          const SizedBox(height: 6),
                                          ...depts.map((d) => Padding(
                                            padding: const EdgeInsets.only(bottom: 8.0),
                                            child: Row(
                                              mainAxisAlignment: MainAxisAlignment.between,
                                              children: [
                                                Expanded(
                                                  child: Text(d['title'] ?? '', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                                                ),
                                                Text(d['duration'] ?? '', style: const TextStyle(fontSize: 11, color: Colors.blueAccent)),
                                              ],
                                            ),
                                          )).toList(),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                      ),
                    ],
                  ),
            
            // Tab 2: Jobs
            Column(
              children: [
                // Filters Row
                Container(
                  height: 48,
                  padding: const EdgeInsets.symmetric(vertical: 8),
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
                            setState(() {
                              _jobCategoryFilter = cat;
                            });
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),
                
                // Jobs List
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredJobs.length,
                    itemBuilder: (context, idx) {
                      final job = filteredJobs[idx];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: ListTile(
                          leading: Text(job['icon'] ?? '💼', style: const TextStyle(fontSize: 24)),
                          title: Text(job['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text(job['salary'] ?? '', style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                          onTap: () => _showJobDetail(job),
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

class JobDetail12thScreen extends StatelessWidget {
  final Map<String, dynamic> job;

  const JobDetail12thScreen({super.key, required this.job});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final List<String> skills = List<String>.from(job['skills'] ?? []);
    final List<String> workplaces = List<String>.from(job['workplaces'] ?? []);

    return Scaffold(
      appBar: AppBar(
        title: Text(job['title'] ?? 'Job Detail', style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    children: [
                      Text(job['icon'] ?? '💼', style: const TextStyle(fontSize: 48)),
                      const SizedBox(height: 10),
                      Text(job['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 10),
                      Text(job['salary'] ?? '', style: const TextStyle(color: Colors.green, fontSize: 16, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 15),

              _buildDetailBox(context, '📋 Job Description', Text(job['description'] ?? '', style: const TextStyle(fontSize: 14, height: 1.4))),
              const SizedBox(height: 12),

              if (job['howToBecome'] != null)
                _buildDetailBox(context, '🎯 How to Become', Text(job['howToBecome'] ?? '', style: const TextStyle(fontSize: 14, height: 1.4))),
              const SizedBox(height: 12),

              if (skills.isNotEmpty)
                _buildDetailBox(
                  context,
                  '🧠 Skills Needed',
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: skills.map((s) => Chip(label: Text(s), backgroundColor: theme.colorScheme.primary.withOpacity(0.08))).toList(),
                  ),
                ),
              const SizedBox(height: 12),

              if (workplaces.isNotEmpty)
                _buildDetailBox(
                  context,
                  '🏢 Where to Work',
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: workplaces.map((w) => Chip(label: Text(w), backgroundColor: Colors.amber.withOpacity(0.1), labelStyle: const TextStyle(color: Colors.amber))).toList(),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetailBox(BuildContext context, String label, Widget content) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF6C63FF), letterSpacing: 1.2)),
            const SizedBox(height: 10),
            content,
          ],
        ),
      ),
    );
  }
}
