import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../utils/sound_manager.dart';
import 'auth_gateway.dart';

class SettingsPage extends StatefulWidget {
  final bool isModal;

  const SettingsPage({super.key, this.isModal = false});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  String _successMsg = '';

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _emailController = TextEditingController();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final state = CareerPathApp.of(context);
    final user = state?.user;
    if (user != null) {
      if (_nameController.text.isEmpty) {
        _nameController.text = user['name']?.toString() ?? '';
      }
      if (_emailController.text.isEmpty) {
        _emailController.text = user['email']?.toString() ?? '';
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _saveProfile() async {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    final user = state?.user;
    if (user != null) {
      final updatedUser = Map<String, dynamic>.from(user);
      updatedUser['name'] = _nameController.text;
      updatedUser['email'] = _emailController.text;

      // Update in app state
      state?.setUser(updatedUser);

      // Cache locally
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('cp_user', json.encode(updatedUser));

      // Sync with backend
      try {
        await ApiService.updateProfile(updatedUser);
      } catch (_) {}

      if (mounted) {
        setState(() {
          _successMsg = state?.translate('profileUpdated') ?? 'Profile updated successfully!';
        });
        Future.delayed(const Duration(seconds: 3), () {
          if (mounted) {
            setState(() {
              _successMsg = '';
            });
          }
        });
      }
    }
  }

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
              if (!mounted) return;
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
    final user = state?.user;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          state?.translate('settings') ?? 'Settings',
          style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: widget.isModal
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
            colors: CareerPathApp.getGradient(context),
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (_successMsg.isNotEmpty) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.green.withOpacity(0.3)),
                  ),
                  child: Text(
                    _successMsg,
                    style: const TextStyle(color: Colors.greenAccent, fontSize: 13, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],

              // Profile Settings Edit Card
              if (user != null) ...[
                Card(
                  color: CareerPathApp.getCardBg(context),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          state?.translate('profile') ?? 'Profile Settings',
                          style: const TextStyle(fontFamily: 'Outfit', fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 12),
                        TextField(
                          controller: _nameController,
                          decoration: InputDecoration(
                            hintText: '👤 Full Name',
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.05),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                        const SizedBox(height: 10),
                        TextField(
                          controller: _emailController,
                          decoration: InputDecoration(
                            hintText: '📧 Email Address',
                            filled: true,
                            fillColor: Colors.white.withOpacity(0.05),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: _saveProfile,
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                                child: Text(state?.translate('save') ?? 'Save'),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () => _confirmLogout(context),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.redAccent,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                                child: Text(state?.translate('logout') ?? 'Logout'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 15),
              ],

              // Preferences Card
              Card(
                color: CareerPathApp.getCardBg(context),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                ),
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
                          dropdownColor: CareerPathApp.getCardBg(context),
                          items: const [
                            DropdownMenuItem(value: 'en', child: Text('English')),
                            DropdownMenuItem(value: 'hi', child: Text('Hindi (हिंदी)')),
                            DropdownMenuItem(value: 'te', child: Text('Telugu (తెలుగు)')),
                            DropdownMenuItem(value: 'es', child: Text('Español')),
                          ],
                          onChanged: (lang) {
                            if (lang != null) state?.setLanguage(lang);
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
                          dropdownColor: CareerPathApp.getCardBg(context),
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
              const SizedBox(height: 15),

              // Theme Picker Card (Grid of 8 themes)
              Card(
                color: CareerPathApp.getCardBg(context),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: CareerPathApp.getBorderColor(context)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        state?.translate('theme') ?? 'Theme Customization',
                        style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 12),
                      GridView.count(
                        crossAxisCount: 2,
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        mainAxisSpacing: 8,
                        crossAxisSpacing: 8,
                        childAspectRatio: 2.8,
                        children: [
                          _buildThemeOption('cosmic', '🌌 Cosmic', const Color(0xFF38BDF8)),
                          _buildThemeOption('neon', '🔮 Neon', const Color(0xFFEC4899)),
                          _buildThemeOption('emerald', '🌿 Emerald', const Color(0xFF10B981)),
                          _buildThemeOption('amber', '🍂 Amber', const Color(0xFFFBBF24)),
                          _buildThemeOption('sapphire', '🛡️ Sapphire', const Color(0xFF06B6D4)),
                          _buildThemeOption('ruby', '💎 Ruby', const Color(0xFFF43F5E)),
                          _buildThemeOption('orchid', '🌸 Orchid', const Color(0xFFD946EF)),
                          _buildThemeOption('sunset', '🌅 Sunset', const Color(0xFFF97316)),
                        ],
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
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildThemeOption(String id, String label, Color color) {
    final state = CareerPathApp.of(context);
    final isSelected = state?.themeMode == id;
    
    return InkWell(
      onTap: () {
        state?.setThemeMode(id);
        SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          gradient: isSelected
              ? LinearGradient(
                  colors: [
                    color,
                    color.withOpacity(0.7),
                  ],
                )
              : null,
          color: isSelected ? null : Colors.white.withOpacity(0.03),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? Colors.transparent : CareerPathApp.getBorderColor(context),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: isSelected ? Colors.white : color,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 11,
                color: isSelected ? Colors.white : Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
