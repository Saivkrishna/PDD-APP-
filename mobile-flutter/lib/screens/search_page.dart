import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';
import 'after_10th_page.dart';
import 'after_12th_page.dart';
import 'graduation_page.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final _searchController = TextEditingController();
  List<dynamic> _results = [];
  bool _loading = false;
  String? _error;

  void _onSearch(String query) async {
    if (query.trim().isEmpty) {
      setState(() {
        _results = [];
      });
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await ApiService.searchCareers(query);
      setState(() {
        _results = res;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _results = [];
        _error = "Search request failed. Please try again.";
        _loading = false;
      });
    }
  }

  void _handleResultClick(Map<String, dynamic> result) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    final type = result['type']?.toString().toLowerCase();
    
    // Dynamically routes based on payload type
    if (type == 'after10th' || type == '10th') {
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const After10thPage()),
      );
    } else if (type == 'after12th' || type == '12th') {
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const After12thPage()),
      );
    } else {
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const GraduationPage()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          autofocus: true,
          style: const TextStyle(fontSize: 16),
          decoration: InputDecoration(
            hintText: 'Search careers, courses, or jobs...',
            border: InputBorder.none,
            suffixIcon: _searchController.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: () {
                      _searchController.clear();
                      _onSearch('');
                    },
                  )
                : null,
          ),
          onChanged: _onSearch,
        ),
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
            : _error != null
                ? Center(child: Text(_error!, style: const TextStyle(color: Colors.redAccent)))
                : _results.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text('🔍', style: TextStyle(fontSize: 48)),
                            const SizedBox(height: 10),
                            Text(
                              _searchController.text.isEmpty
                                  ? 'Type to search...'
                                  : 'No results found',
                              style: TextStyle(color: theme.textTheme.bodyMedium?.color?.withOpacity(0.5)),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        itemCount: _results.length,
                        itemBuilder: (context, idx) {
                          final r = _results[idx];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            child: ListTile(
                              leading: Text(r['icon'] ?? '💼', style: const TextStyle(fontSize: 24)),
                              title: Text(r['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Text(r['type']?.toString().toUpperCase() ?? ''),
                              trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                              onTap: () => _handleResultClick(r),
                            ),
                          );
                        },
                      ),
      ),
    );
  }
}
