import 'package:flutter/material.dart';
import '../main.dart';
import '../utils/sound_manager.dart';

class CareerComparisonSheet extends StatelessWidget {
  final List<Map<String, dynamic>> compareList;
  final Function(String) onRemove;
  final VoidCallback onClearAll;

  const CareerComparisonSheet({
    super.key,
    required this.compareList,
    required this.onRemove,
    required this.onClearAll,
  });

  static void show(
    BuildContext context, {
    required List<Map<String, dynamic>> compareList,
    required Function(String) onRemove,
    required VoidCallback onClearAll,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => CareerComparisonSheet(
        compareList: compareList,
        onRemove: onRemove,
        onClearAll: onClearAll,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    if (compareList.isEmpty) {
      return Container(
        height: 250,
        decoration: BoxDecoration(
          color: CareerPathApp.getCardBg(context),
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          border: Border.all(color: CareerPathApp.getBorderColor(context)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('⚖️', style: TextStyle(fontSize: 40)),
            const SizedBox(height: 12),
            Text(
              state?.translate('compareCareers') ?? 'Compare Careers',
              style: const TextStyle(fontFamily: 'Outfit', fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 6),
            const Text(
              'No careers added for comparison yet. Tap "⚖️ Add to Compare" on any course or job to compare up to 3 paths.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey, fontSize: 12),
            ),
          ],
        ),
      );
    }

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: CareerPathApp.getCardBg(context),
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border.all(color: CareerPathApp.getBorderColor(context)),
      ),
      child: Column(
        children: [
          // Header handle
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.3),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          
          // Title Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Text('⚖️ ', style: TextStyle(fontSize: 20)),
                    Text(
                      '${state?.translate('compareCareers') ?? 'Compare Careers'} (${compareList.length}/3)',
                      style: const TextStyle(
                        fontFamily: 'Outfit',
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () {
                    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                    onClearAll();
                    Navigator.of(context).pop();
                  },
                  child: const Text('Clear All', style: TextStyle(color: Colors.redAccent, fontSize: 13, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Comparison Horizontal Scroll View
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: compareList.map((job) {
                    final jobId = job['id']?.toString() ?? '';
                    final title = job['title']?.toString() ?? 'Career Option';
                    final salary = job['salary']?.toString() ?? job['avgSalary']?.toString() ?? '₹4–12 LPA';
                    final duration = job['duration']?.toString() ?? '2-4 Years';
                    final eligibility = job['eligibility']?.toString() ?? 'Graduation / 12th Pass';
                    final category = job['category']?.toString() ?? job['stream']?.toString() ?? 'General';
                    final description = job['description']?.toString() ?? '';
                    final skills = (job['skills'] as List?)?.map((s) => s.toString()).toList() ?? 
                                   (job['subjects'] as List?)?.map((s) => s.toString()).toList() ?? [];
                    final recruiters = (job['workplaces'] as List?)?.map((w) => w.toString()).toList() ??
                                       (job['topRecruiters'] as List?)?.map((r) => r.toString()).toList() ?? [];

                    return Container(
                      width: MediaQuery.of(context).size.width * 0.72,
                      margin: const EdgeInsets.only(right: 14),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.03),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Item Header
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(job['icon']?.toString() ?? '🎓', style: const TextStyle(fontSize: 28)),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      title,
                                      style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      category,
                                      style: TextStyle(color: theme.colorScheme.primary, fontSize: 11, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.close, size: 18, color: Colors.grey),
                                onPressed: () {
                                  SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
                                  onRemove(jobId);
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          const Divider(height: 1),
                          const SizedBox(height: 12),

                          // Salary metric
                          _buildSectionLabel('💰 SALARY / PACKAGE'),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.greenAccent.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.greenAccent.withOpacity(0.2)),
                            ),
                            child: Text(
                              salary,
                              style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                          ),
                          const SizedBox(height: 14),

                          // Duration metric
                          _buildSectionLabel('⏳ DURATION'),
                          Text(duration, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 14),

                          // Eligibility
                          _buildSectionLabel('📋 ELIGIBILITY'),
                          Text(eligibility, style: const TextStyle(fontSize: 12, height: 1.3)),
                          const SizedBox(height: 14),

                          // Overview Description
                          if (description.isNotEmpty) ...[
                            _buildSectionLabel('📖 OVERVIEW'),
                            Text(description, style: const TextStyle(fontSize: 12, color: Colors.grey, height: 1.4)),
                            const SizedBox(height: 14),
                          ],

                          // Skills / Subjects
                          if (skills.isNotEmpty) ...[
                            _buildSectionLabel('🛠️ KEY SKILLS / SUBJECTS'),
                            Wrap(
                              spacing: 4,
                              runSpacing: 4,
                              children: skills.map((sk) => Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.secondary.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(sk, style: TextStyle(fontSize: 11, color: theme.colorScheme.secondary, fontWeight: FontWeight.w600)),
                              )).toList(),
                            ),
                            const SizedBox(height: 14),
                          ],

                          // Workplaces / Top Recruiters
                          if (recruiters.isNotEmpty) ...[
                            _buildSectionLabel('🏢 WORKPLACES / RECRUITERS'),
                            Wrap(
                              spacing: 4,
                              runSpacing: 4,
                              children: recruiters.map((rec) => Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.06),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(rec, style: const TextStyle(fontSize: 11, color: Colors.white70)),
                              )).toList(),
                            ),
                          ],
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4.0),
      child: Text(
        text,
        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8, color: Colors.grey),
      ),
    );
  }
}
