import 'package:flutter/material.dart';
import '../main.dart';
import '../utils/sound_manager.dart';
import 'home_page.dart';
import 'education_hub_page.dart';
import 'aptitude_cheatsheet_page.dart';
import 'settings_page.dart';

class HomeNavHub extends StatefulWidget {
  const HomeNavHub({super.key});

  @override
  State<HomeNavHub> createState() => _HomeNavHubState();
}

class _HomeNavHubState extends State<HomeNavHub> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const HomePage(),
    const EducationHubPage(),
    const AptitudeCheatsheetPage(),
    const SettingsPage(),
  ];

  void _onTabSelected(int index) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onTabSelected,
        type: BottomNavigationBarType.fixed,
        backgroundColor: theme.colorScheme.surface,
        selectedItemColor: theme.colorScheme.primary,
        unselectedItemColor: theme.unselectedWidgetColor.withOpacity(0.5),
        showSelectedLabels: true,
        showUnselectedLabels: true,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.home_outlined),
            activeIcon: const Icon(Icons.home),
            label: state?.translate('home') ?? 'Home',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.school_outlined),
            activeIcon: const Icon(Icons.school),
            label: state?.translate('education') ?? 'Education',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.edit_note_outlined),
            activeIcon: const Icon(Icons.edit_note),
            label: state?.translate('aptitude') ?? 'Aptitude',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.settings_outlined),
            activeIcon: const Icon(Icons.settings),
            label: state?.translate('settings') ?? 'Settings',
          ),
        ],
      ),
    );
  }
}
