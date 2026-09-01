import 'dart:async';
import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';

class AIRecommendationPage extends StatefulWidget {
  final Map<String, dynamic>? target;
  final List<dynamic>? answers;
  final String? quizType;

  const AIRecommendationPage({
    super.key,
    this.target,
    this.answers,
    this.quizType,
  });

  @override
  State<AIRecommendationPage> createState() => _AIRecommendationPageState();
}

class _AIRecommendationPageState extends State<AIRecommendationPage> {
  Map<String, dynamic>? _data;
  bool _loading = true;
  String _loadingText = '🤖 Connecting to AI Career Coach...';
  String? _error;
  Timer? _loadingTimer;
  int _loadingIdx = 0;

  final List<String> _loadingTexts = [
    '🤖 Connecting to AI Career Coach...',
    '⚙️ Loading user parameters...',
    '🧠 Processing quiz choices...',
    '🔮 Querying Google Gemini 2.5 Flash...',
    '📚 Designing custom roadmap milestones...',
    '🔍 Performing skills gap analysis...',
    '📊 Crawling active job vacancy outlooks...',
    '✨ Formatting interactive dashboard...'
  ];

  @override
  void initState() {
    super.initState();
    if (widget.target != null) {
      _startLoadingTextTimer();
      _fetchRecommendation();
    } else {
      _loading = false;
    }
  }

  @override
  void dispose() {
    _loadingTimer?.cancel();
    super.dispose();
  }

  void _startLoadingTextTimer() {
    _loadingTimer = Timer.periodic(const Duration(milliseconds: 1800), (timer) {
      if (mounted && _loading) {
        setState(() {
          _loadingIdx = (_loadingIdx + 1) % _loadingTexts.length;
          _loadingText = _loadingTexts[_loadingIdx];
        });
      } else {
        timer.cancel();
      }
    });
  }

  Future<void> _fetchRecommendation() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final state = CareerPathApp.of(context);
      final userId = state?.user != null ? state!.user!['id']?.toString() ?? 'anonymous' : 'anonymous';
      
      final quizType = widget.target?['quizType'] ?? widget.quizType ?? 'general';
      final answers = widget.target?['answers'] ?? widget.answers ?? ['software', 'engineering', 'higher-studies'];

      final result = await ApiService.getAIRecommendation(userId, quizType, answers);
      
      if (mounted) {
        if (result['success'] == true) {
          setState(() {
            _data = result['data'];
            _loading = false;
          });
        } else {
          setState(() {
            _error = result['error'] ?? 'Failed to fetch recommendation';
            _loading = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Network connection failed. Make sure the backend server is running and connected to MongoDB.';
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    if (widget.target == null) {
      return Scaffold(
        appBar: AppBar(
          title: Text(state?.translate('ai') ?? 'AI Career Plan'),
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
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Center(
                  child: Text('🤖', style: TextStyle(fontSize: 60)),
                ),
                const SizedBox(height: 16),
                Center(
                  child: Text(
                    state?.translate('ai') ?? 'AI Career Recommendation',
                    style: const TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 8),
                const Center(
                  child: Text(
                    "You haven't generated a personalized AI roadmap yet. Please go to the Home screen and ask the AI Career Mentor, or take a quiz to get recommendations.",
                    style: TextStyle(fontSize: 13, color: Colors.grey, height: 1.4),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () {
                    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                    Navigator.of(context).pop();
                  },
                  child: Text(state?.translate('back') ?? '← Go Back'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (_loading) {
      return Scaffold(
        body: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: CareerPathApp.getGradient(context),
            ),
          ),
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    _loadingText,
                    style: const TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Please hold on, standard roadmaps can take 5-10 seconds to generate.',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    if (_error != null) {
      return Scaffold(
        body: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: CareerPathApp.getGradient(context),
            ),
          ),
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('⚠️', style: TextStyle(fontSize: 60)),
                  const SizedBox(height: 16),
                  const Text(
                    'Roadmap Error',
                    style: TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: Colors.redAccent,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _error!,
                    style: const TextStyle(fontSize: 13, color: Colors.grey, height: 1.4),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      OutlinedButton(
                        onPressed: () {
                          SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                          Navigator.of(context).pop();
                        },
                        child: const Text('Back'),
                      ),
                      const SizedBox(width: 12),
                      ElevatedButton(
                        onPressed: _fetchRecommendation,
                        child: const Text('Retry'),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ),
        ),
      );
    }

    final title = _data?['title'] ?? '';
    final description = _data?['description'] ?? '';
    final salary = _data?['salary'] ?? '';
    final List<dynamic> milestones = _data?['milestones'] ?? [];
    final List<dynamic> skillsAcquired = _data?['skillsAcquired'] ?? [];
    final List<dynamic> skillsGaps = _data?['skillsGaps'] ?? [];
    final Map<String, dynamic>? marketDemand = _data?['marketDemand'];

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Career Plan', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Hero Info
              Card(
                color: CareerPathApp.getCardBg(context),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    children: [
                      const Text('🤖', style: TextStyle(fontSize: 50)),
                      const SizedBox(height: 10),
                      Text(
                        title,
                        style: const TextStyle(fontFamily: 'Outfit', fontSize: 20, fontWeight: FontWeight.w900),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        description,
                        style: const TextStyle(fontSize: 13, color: Colors.grey, height: 1.4),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 15),

              // Salary Scale
              Card(
                color: CareerPathApp.getCardBg(context),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('💰 Estimated Salary Scale', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.grey)),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Text('💵 ', style: TextStyle(fontSize: 18)),
                          Text(
                            salary,
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.greenAccent),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Milestones / Roadmaps
              const Text('🗺️ Step-by-Step Roadmap', style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              
              ...milestones.asMap().entries.map((entry) {
                final idx = entry.key;
                final m = entry.value;
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: CareerPathApp.getCardBg(context),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: CareerPathApp.getBorderColor(context)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: theme.colorScheme.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                            ),
                            child: Text(
                              'STEP ${m['step'] ?? (idx + 1)}',
                              style: TextStyle(color: theme.colorScheme.primary, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                          Text(
                            '⏱️ ${m['duration'] ?? ''}',
                            style: TextStyle(color: theme.colorScheme.secondary, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        m['title'] ?? '',
                        style: const TextStyle(fontFamily: 'Outfit', fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        m['description'] ?? '',
                        style: const TextStyle(fontSize: 12, color: Colors.grey, height: 1.4),
                      ),
                    ],
                  ),
                );
              }).toList(),
              const SizedBox(height: 15),

              // Skills Acquired
              const Text('🛠️ Skills You Will Acquire', style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              Card(
                color: CareerPathApp.getCardBg(context),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(14.0),
                  child: Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: skillsAcquired.map((s) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: CareerPathApp.getBorderColor(context)),
                      ),
                      child: Text(s.toString(), style: const TextStyle(fontSize: 12)),
                    )).toList(),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Skills Gap Analysis
              const Text('🎯 Skills Gap Analysis', style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              ...skillsGaps.map((g) {
                final isHigh = g['importance']?.toString().toLowerCase() == 'high';
                return Card(
                  color: CareerPathApp.getCardBg(context),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                  ),
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(14.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '🔍 ${g['skill'] ?? ''}',
                              style: const TextStyle(fontFamily: 'Outfit', fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: isHigh ? Colors.red.withOpacity(0.1) : Colors.amber.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: isHigh ? Colors.red.withOpacity(0.3) : Colors.amber.withOpacity(0.3)),
                              ),
                              child: Text(
                                '${g['importance']?.toString().toUpperCase()} GAP',
                                style: TextStyle(
                                  color: isHigh ? Colors.redAccent : Colors.amberAccent,
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Why it matters: ${g['actionPlan']?.toString().split('.')[0] ?? ''}.',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary.withOpacity(0.05),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: CareerPathApp.getBorderColor(context)),
                          ),
                          child: Text(
                            '💡 Action Plan: ${g['actionPlan'] ?? ''}',
                            style: const TextStyle(fontSize: 12, height: 1.4),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
              const SizedBox(height: 15),

              // Job Market Outlook
              if (marketDemand != null) ...[
                const Text('📈 Job Market Outlook', style: TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                Card(
                  color: CareerPathApp.getCardBg(context),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(14.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.primary.withOpacity(0.05),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: CareerPathApp.getBorderColor(context)),
                                ),
                                child: Column(
                                  children: [
                                    Text('GROWTH RATE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                                    const SizedBox(height: 4),
                                    Text(marketDemand['growthRate'] ?? '', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.primary.withOpacity(0.05),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: CareerPathApp.getBorderColor(context)),
                                ),
                                child: Column(
                                  children: [
                                    Text('VACANCIES VOLUME', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: theme.colorScheme.primary)),
                                    const SizedBox(height: 4),
                                    Text(marketDemand['activeVacancies'] ?? '', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary.withOpacity(0.05),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: CareerPathApp.getBorderColor(context)),
                          ),
                          child: Text(
                            'Outlook: ${marketDemand['outlook'] ?? ''}',
                            style: const TextStyle(fontSize: 12, height: 1.4, color: Colors.grey),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 80),
            ],
          ),
        ),
      ),
    );
  }
}
