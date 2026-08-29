import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class GraduationPage extends StatefulWidget {
  const GraduationPage({super.key});

  @override
  State<GraduationPage> createState() => _GraduationPageState();
}

class _GraduationPageState extends State<GraduationPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _sectors = [];
  List<dynamic> _higherStudy = [];
  List<dynamic> _jobs = [];
  List<dynamic> _studyAbroad = [];
  bool _loading = true;

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

  void _loadData() async {
    try {
      final sectorsRes = await ApiService.getGraduationSectors();
      final hsRes = await ApiService.getGraduationHigherStudy();
      final jobsRes = await ApiService.getGraduationJobs();
      final abroadRes = await ApiService.getGraduationStudyAbroad();
      setState(() {
        _sectors = sectorsRes;
        _higherStudy = hsRes;
        _jobs = jobsRes;
        _studyAbroad = abroadRes;
        _loading = false;
      });
    } catch (_) {
      // Mock fallback
      setState(() {
        _sectors = [
          {'id': 'cor', 'title': 'Corporate Careers', 'description': 'Software Engineer, Data Analyst, Management Consultant roles.'},
          {'id': 'gov', 'title': 'Civil & Public Services', 'description': 'UPSC, SSC, Banking PO, State service examinations.'}
        ];
        _higherStudy = [
          {'id': 'mba', 'title': 'MBA (Master of Business Administration)', 'duration': '2 Years', 'eligibility': 'Graduation pass + CAT/GMAT score', 'description': 'Management specialization.'},
          {'id': 'mtech', 'title': 'M.Tech (Master of Technology)', 'duration': '2 Years', 'eligibility': 'B.Tech/BE pass + GATE score', 'description': 'Advanced engineering research.'}
        ];
        _studyAbroad = [
          {'id': 'us', 'title': 'Study in USA', 'exams': 'GRE, TOEFL/IELTS', 'cost': '₹20L - ₹45L/year', 'intakes': 'Fall (Aug), Spring (Jan)'},
          {'id': 'ger', 'title': 'Study in Germany', 'exams': 'IELTS, German (A1-B2)', 'cost': '₹5L - ₹12L/year (Tuition-free)', 'intakes': 'Winter (Oct), Summer (April)'}
        ];
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Career After Graduation', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: theme.unselectedWidgetColor.withOpacity(0.6),
          indicatorColor: theme.colorScheme.primary,
          tabs: const [
            Tab(text: 'Sectors & Jobs'),
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
                  // Tab 1: Sectors
                  ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _sectors.length,
                    itemBuilder: (context, idx) {
                      final sec = _sectors[idx];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(sec['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              Text(sec['description'] ?? '', style: TextStyle(fontSize: 13, color: theme.textTheme.bodyMedium?.color?.withOpacity(0.8))),
                            ],
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
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(hs['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  _buildBadge(context, 'Duration: ${hs['duration']}', const Color(0xFF6C63FF)),
                                  const SizedBox(width: 8),
                                  _buildBadge(context, 'Eligibility: ${hs['eligibility']}', const Color(0xFF2EC4B6)),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(hs['description'] ?? '', style: const TextStyle(fontSize: 13, height: 1.4)),
                            ],
                          ),
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
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(ab['title'] ?? '', style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 8),
                              _buildRowDetail('Required Exams:', ab['exams'] ?? ''),
                              _buildRowDetail('Estimated Cost:', ab['cost'] ?? ''),
                              _buildRowDetail('Intake Months:', ab['intakes'] ?? ''),
                            ],
                          ),
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

  Widget _buildRowDetail(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$label ',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}
