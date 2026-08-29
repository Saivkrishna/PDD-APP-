import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class ATSScannerPage extends StatefulWidget {
  const ATSScannerPage({super.key});

  @override
  State<ATSScannerPage> createState() => _ATSScannerPageState();
}

class _ATSScannerPageState extends State<ATSScannerPage> {
  final _resumeController = TextEditingController();
  final _jdController = TextEditingController();
  
  bool _loading = false;
  Map<String, dynamic>? _results;
  String? _error;

  void _runGrader() async {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    final resumeText = _resumeController.text.trim();
    final jdText = _jdController.text.trim();

    if (resumeText.isEmpty || jdText.isEmpty) {
      setState(() {
        _error = "Please paste both your Resume and the Job Description to scan.";
      });
      return;
    }

    setState(() {
      _loading = true;
      _results = null;
      _error = null;
    });

    try {
      // 1. Parse JD to extract skills
      final jdRes = await ApiService.parseJobDescription(jdText);
      final List<String> jdSkills = List<String>.from(jdRes['skills'] ?? ['Programming', 'Communication', 'Analysis']);

      // 2. Extract mock/skills from resume text using simple logic or API
      final List<String> resumeSkills = [];
      final lowerResume = resumeText.toLowerCase();
      
      // Simple local parsing for demo to find matching words
      for (var skill in jdSkills) {
        if (lowerResume.contains(skill.toLowerCase())) {
          resumeSkills.add(skill);
        }
      }

      // 3. Hitting match skills API
      final matchRes = await ApiService.matchSkills(resumeSkills, jdSkills);
      
      // 4. Hit formatting check API
      final sections = {
        'education': lowerResume.contains('education') || lowerResume.contains('degree') || lowerResume.contains('university'),
        'experience': lowerResume.contains('experience') || lowerResume.contains('work') || lowerResume.contains('history'),
        'skills': lowerResume.contains('skills') || lowerResume.contains('abilities'),
      };
      final formatRes = await ApiService.checkFormatting(resumeText, sections);

      // 5. Final scoring engine API
      final scoreRes = await ApiService.scoreResume({
        'resumeText': resumeText,
        'jdText': jdText,
        'matchedSkills': resumeSkills,
        'missingSkills': List<String>.from(matchRes['missingSkills'] ?? []),
      });

      setState(() {
        _results = {
          'score': scoreRes['score'] ?? 72,
          'matched': resumeSkills,
          'missing': List<String>.from(matchRes['missingSkills'] ?? []),
          'formatting': formatRes,
          'recommendations': scoreRes['recommendations'] ?? ['Include more metrics in your experience descriptions.', 'Use standard PDF formats.']
        };
        _loading = false;
      });
      SoundManager.playSuccess(state?.soundEnabled ?? true);

    } catch (e) {
      setState(() {
        _error = "Failed to communicate with ATS scoring endpoints: $e";
        _loading = false;
      });
      SoundManager.playError(state?.soundEnabled ?? true);
    }
  }

  void _resetGrader() {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    setState(() {
      _resumeController.clear();
      _jdController.clear();
      _results = null;
      _error = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Resume ATS Scanner', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _results != null
                ? _buildResultView()
                : _buildScannerInputView(),
      ),
    );
  }

  Widget _buildScannerInputView() {
    final theme = Theme.of(context);
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Check Your Resume Alignment',
            style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 15),
          
          if (_error != null) ...[
            Text(_error!, style: const TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
          ],

          // Resume Text Area
          const Text('Resume Text:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 6),
          TextField(
            controller: _resumeController,
            maxLines: 8,
            style: const TextStyle(fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Paste full text of your resume here...',
              filled: true,
              fillColor: theme.cardColor,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const SizedBox(height: 15),

          // JD Text Area
          const Text('Job Description Text:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 6),
          TextField(
            controller: _jdController,
            maxLines: 6,
            style: const TextStyle(fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Paste target Job Description text here...',
              filled: true,
              fillColor: theme.cardColor,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const SizedBox(height: 25),

          ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
            ),
            onPressed: _runGrader,
            child: const Text('RUN ATS GRADING', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildResultView() {
    final theme = Theme.of(context);
    final score = _results!['score'] ?? 70;
    final List<dynamic> matched = _results!['matched'] ?? [];
    final List<dynamic> missing = _results!['missing'] ?? [];
    final List<dynamic> recs = _results!['recommendations'] ?? [];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Score Card
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      SizedBox(
                        width: 100,
                        height: 100,
                        child: CircularProgressIndicator(
                          value: score / 100.0,
                          strokeWidth: 8,
                          color: score > 75 ? Colors.green : score > 50 ? Colors.amber : Colors.red,
                          backgroundColor: theme.dividerColor.withOpacity(0.08),
                        ),
                      ),
                      Text('$score%', style: const TextStyle(fontFamily: 'Outfit', fontSize: 24, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 15),
                  const Text('Overall Compatibility Score', style: TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 15),

          // Matched Skills
          _buildResultCard(
            '🧠 Matched Skills',
            matched.isEmpty
                ? const Text('None detected.')
                : Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: matched.map((s) => Chip(label: Text(s.toString()), backgroundColor: Colors.green.withOpacity(0.1), labelStyle: const TextStyle(color: Colors.green))).toList(),
                  ),
          ),
          const SizedBox(height: 12),

          // Missing Skills
          _buildResultCard(
            '⚠️ Missing Skills Gaps',
            missing.isEmpty
                ? const Text('Great! No skill gaps found.')
                : Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: missing.map((s) => Chip(label: Text(s.toString()), backgroundColor: Colors.red.withOpacity(0.1), labelStyle: const TextStyle(color: Colors.red))).toList(),
                  ),
          ),
          const SizedBox(height: 12),

          // Recommendations
          if (recs.isNotEmpty)
            _buildResultCard(
              '💡 Actionable Recommendations',
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: recs.map((r) => Padding(
                  padding: const EdgeInsets.only(bottom: 6.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('• ', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blueAccent)),
                      Expanded(child: Text(r.toString(), style: const TextStyle(fontSize: 13))),
                    ],
                  ),
                )).toList(),
              ),
            ),
          const SizedBox(height: 25),

          ElevatedButton(
            onPressed: _resetGrader,
            child: const Text('SCAN ANOTHER RESUME'),
          ),
        ],
      ),
    );
  }

  Widget _buildResultCard(String label, Widget content) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF6C63FF), letterSpacing: 1.0)),
            const SizedBox(height: 12),
            content,
          ],
        ),
      ),
    );
  }
}
