import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class After10thPage extends StatefulWidget {
  const After10thPage({super.key});

  @override
  State<After10thPage> createState() => _After10thPageState();
}

class _After10thPageState extends State<After10thPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _streams = [];
  List<dynamic> _jobs = [];
  bool _loading = true;

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

  void _loadData() async {
    try {
      final streamsRes = await ApiService.getAfter10thStreams();
      final jobsRes = await ApiService.getAfter10thJobs();
      setState(() {
        _streams = streamsRes;
        _jobs = jobsRes;
        _loading = false;
      });
    } catch (_) {
      // Offline/Local mock fallback
      setState(() {
        _streams = [
          {"id": "inter", "title": "Intermediate (11th & 12th)", "duration": "2 Years", "eligibility": "10th Pass", "description": "General academic stream leading to degrees (MPC, BiPC, CEC, MEC, Arts)."},
          {"id": "poly", "title": "Polytechnic Diploma", "duration": "3 Years", "eligibility": "10th Pass", "description": "Technical professional programs (Mechanical, Civil, Computer Science)."},
          {"id": "iti", "title": "ITI Vocational Courses", "duration": "1-2 Years", "eligibility": "8th/10th Pass", "description": "Hands-on industrial training courses (Fitter, Electrician, Plumber)."}
        ];
        _jobs = [
          {"id": "assistant", "title": "Office Assistant", "salary": "₹10K - ₹18K/month", "description": "Helper or clerk assistant handling document arrangements and mail.", "howToBecome": "Basic schooling and communication.", "skills": ["Punctuality", "Filing", "Basic Math"], "workplaces": ["Government Offices", "Banks", "Corporate settings"]},
          {"id": "technician", "title": "Electrician Trainee", "salary": "₹12K - ₹22K/month", "description": "Wiring houses, troubleshooting electrical fixtures and industrial systems.", "howToBecome": "ITI Electrician certificate.", "skills": ["Wiring", "Diagnostics", "Safety focus"], "workplaces": ["Construction agencies", "Self-employed"]}
        ];
        _loading = false;
      });
    }
  }

  void _showJobDetail(Map<String, dynamic> job) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => JobDetailScreen(job: job),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Career After 10th', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: theme.unselectedWidgetColor.withOpacity(0.6),
          indicatorColor: theme.colorScheme.primary,
          tabs: const [
            Tab(text: 'Academic Streams'),
            Tab(text: 'Vocational Jobs'),
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
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : TabBarView(
                controller: _tabController,
                children: [
                  // Tab 1: Streams
                  ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _streams.length,
                    itemBuilder: (context, idx) {
                      final s = _streams[idx];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(s['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  _buildBadge(context, 'Duration: ${s['duration']}', const Color(0xFF6C63FF)),
                                  const SizedBox(width: 8),
                                  _buildBadge(context, 'Eligibility: ${s['eligibility']}', const Color(0xFF2EC4B6)),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(s['description'] ?? '', style: const TextStyle(fontSize: 13, height: 1.4)),
                            ],
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
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          leading: const CircleAvatar(
                            backgroundColor: Color(0xFFFF6584),
                            child: Icon(Icons.work_outline, color: Colors.white),
                          ),
                          title: Text(j['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text(j['salary'] ?? '', style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
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

  Widget _buildBadge(BuildContext context, String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(text, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }
}

class JobDetailScreen extends StatelessWidget {
  final Map<String, dynamic> job;

  const JobDetailScreen({super.key, required this.job});

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
              // Header Card
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    children: [
                      const Text('💼', style: TextStyle(fontSize: 48)),
                      const SizedBox(height: 10),
                      Text(job['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 10),
                      Text(job['salary'] ?? '', style: const TextStyle(color: Colors.green, fontSize: 16, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 15),

              // Description
              _buildDetailBox(context, '📋 Job Description', Text(job['description'] ?? '', style: const TextStyle(fontSize: 14, height: 1.4))),
              const SizedBox(height: 12),

              // How to Become
              if (job['howToBecome'] != null)
                _buildDetailBox(context, '🎯 How to Become', Text(job['howToBecome'] ?? '', style: const TextStyle(fontSize: 14, height: 1.4))),
              const SizedBox(height: 12),

              // Skills Needed
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

              // Places of Work
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
