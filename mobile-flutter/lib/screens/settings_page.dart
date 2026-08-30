import 'package:flutter/material.dart';
import '../main.dart';
import '../services/auth_service.dart';
import '../utils/sound_manager.dart';
import 'auth_gateway.dart';

class SettingsPage extends StatelessWidget {
  final bool isModal;

  const SettingsPage({super.key, this.isModal = false});

  void _confirmReset(BuildContext context) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reset All Data?'),
        content: const Text('This will clear your quiz records. This action cannot be undone.'),
        actions: [
          TextButton(
            child: const Text('Cancel'),
            onPressed: () => Navigator.of(ctx).pop(),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              state?.onResetData();
              Navigator.of(ctx).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('App data reset successfully!')),
              );
            },
            child: const Text('Reset'),
          ),
        ],
      ),
    );
  }

  void _confirmLogout(BuildContext context) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirm Logout?'),
        content: const Text('Are you sure you want to log out of your session?'),
        actions: [
          TextButton(
            child: const Text('Cancel'),
            onPressed: () => Navigator.of(ctx).pop(),
          ),
          ElevatedButton(
            onPressed: () async {
              await AuthService.logout();
              state?.setUser(null);
              Navigator.of(ctx).pop();
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const AuthGateway()),
                (route) => false,
              );
            },
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    final theme = Theme.of(context);
    final user = state?.user;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          state?.translate('settings') ?? 'Settings',
          style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: isModal
            ? IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.of(context).pop(),
              )
            : null,
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
              // User profile info banner
              if (user != null) ...[
                Card(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 28,
                          backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
                          child: Text(
                            user['name']?.toString().substring(0, 1).toUpperCase() ?? 'U',
                            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                          ),
                        ),
                        const SizedBox(width: 15),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(user['name'] ?? '', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 4),
                              Text(user['email'] ?? '', style: const TextStyle(color: Colors.grey, fontSize: 13)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 15),
              ],

              // Preferences Card
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                  child: Column(
                    children: [
                      // Language
                      ListTile(
                        leading: const Icon(Icons.language),
                        title: const Text('Language'),
                        trailing: DropdownButton<String>(
                          value: state?.lang ?? 'en',
                          items: const [
                            DropdownMenuItem(value: 'en', child: Text('English')),
                            DropdownMenuItem(value: 'hi', child: Text('Hindi (हिंदी)')),
                            DropdownMenuItem(value: 'te', child: Text('Telugu (తెలుగు)')),
                          ],
                          onChanged: (lang) {
                            if (lang != null) state?.setLanguage(lang);
                          },
                        ),
                      ),
                      const Divider(),
                      // Theme
                      ListTile(
                        leading: const Icon(Icons.palette_outlined),
                        title: const Text('Dark Mode'),
                        trailing: Switch(
                          value: state?.themeMode == 'dark',
                          onChanged: (val) {
                            state?.setThemeMode(val ? 'dark' : 'light');
                          },
                        ),
                      ),
                      const Divider(),
                      // Sound effects
                      ListTile(
                        leading: const Icon(Icons.volume_up_outlined),
                        title: const Text('Sound Feedback'),
                        trailing: Switch(
                          value: state?.soundEnabled ?? true,
                          onChanged: (val) {
                            state?.setSoundEnabled(val);
                          },
                        ),
                      ),
                      const Divider(),
                      // Sound type
                      ListTile(
                        leading: const Icon(Icons.audio_file_outlined),
                        title: const Text('Haptic Intensity'),
                        trailing: DropdownButton<String>(
                          value: state?.soundType ?? 'synth',
                          items: const [
                            DropdownMenuItem(value: 'synth', child: Text('Soft Click')),
                            DropdownMenuItem(value: 'retro', child: Text('Medium Alert')),
                          ],
                          onChanged: (type) {
                            if (type != null) state?.setSoundType(type);
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 25),

              // Danger Zone buttons
              ElevatedButton.icon(
                icon: const Icon(Icons.refresh),
                label: const Text('RESET APP PROGRESS'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  foregroundColor: Colors.redAccent,
                  shadowColor: Colors.transparent,
                  side: const BorderSide(color: Colors.redAccent),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: () => _confirmReset(context),
              ),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                icon: const Icon(Icons.logout),
                label: const Text('LOGOUT'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.redAccent,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: () => _confirmLogout(context),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
