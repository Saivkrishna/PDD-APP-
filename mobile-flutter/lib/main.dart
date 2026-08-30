import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/splash_page.dart';
import 'screens/auth_gateway.dart';
import 'screens/home_page.dart';
import 'screens/education_hub_page.dart';
import 'screens/after_10th_page.dart';
import 'screens/after_12th_page.dart';
import 'screens/graduation_page.dart';
import 'screens/aptitude_cheatsheet_page.dart';
import 'screens/reasoning_practice_page.dart';
import 'screens/tech_learning_hub_page.dart';
import 'screens/settings_page.dart';
import 'screens/ats_scanner_page.dart';
import 'screens/memory_matrix_game.dart';
import 'screens/arithmetic_rain_game.dart';
import 'screens/search_page.dart';
import 'services/auth_service.dart';
import 'services/api_service.dart';
import 'utils/translations.dart';
import 'utils/sound_manager.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase Auth / Core gracefully
  await AuthService.initFirebase();
  
  final prefs = await SharedPreferences.getInstance();
  final String initialLang = prefs.getString('cp_lang') ?? 'en';
  final String initialTheme = prefs.getString('cp_theme') ?? 'dark';
  final bool soundEnabled = prefs.getBool('cp_sound') ?? true;
  final String soundType = prefs.getString('cp_sound_type') ?? 'synth';

  runApp(CareerPathApp(
    initialLang: initialLang,
    initialTheme: initialTheme,
    soundEnabled: soundEnabled,
    soundType: soundType,
  ));
}

class CareerPathApp extends StatefulWidget {
  final String initialLang;
  final String initialTheme;
  final bool soundEnabled;
  final String soundType;

  const CareerPathApp({
    super.key,
    required this.initialLang,
    required this.initialTheme,
    required this.soundEnabled,
    required this.soundType,
  });

  static _CareerPathAppState? of(BuildContext context) =>
      context.findAncestorStateOfType<_CareerPathAppState>();

  @override
  State<CareerPathApp> createState() => _CareerPathAppState();
}

class _CareerPathAppState extends State<CareerPathApp> {
  late String _lang;
  late String _theme;
  late bool _soundEnabled;
  late String _soundType;
  Map<String, dynamic>? _user;

  @override
  void initState() {
    super.initState();
    _lang = widget.initialLang;
    _theme = widget.initialTheme;
    _soundEnabled = widget.soundEnabled;
    _soundType = widget.soundType;
    _loadUserSession();
  }

  void _loadUserSession() async {
    final session = await AuthService.getCachedUser();
    if (session != null) {
      setState(() {
        _user = session;
      });
    }
  }

  void setLanguage(String lang) {
    setState(() {
      _lang = lang;
    });
    SharedPreferences.getInstance().then((p) => p.setString('cp_lang', lang));
  }

  void setThemeMode(String theme) {
    setState(() {
      _theme = theme;
    });
    SharedPreferences.getInstance().then((p) => p.setString('cp_theme', theme));
  }

  void setSoundEnabled(bool enabled) {
    setState(() {
      _soundEnabled = enabled;
    });
    SharedPreferences.getInstance().then((p) => p.setBool('cp_sound', enabled));
  }

  void setSoundType(String type) {
    setState(() {
      _soundType = type;
    });
    SharedPreferences.getInstance().then((p) => p.setString('cp_sound_type', type));
  }

  void setUser(Map<String, dynamic>? user) {
    setState(() {
      _user = user;
    });
  }



  void onResetData() async {
    if (_user != null) {
      final userId = _user!['id']?.toString() ?? '';
      if (userId.isNotEmpty) {
        await ApiService.resetUserData(userId);
      }
    }
  }

  String get lang => _lang;
  String get themeMode => _theme;
  bool get soundEnabled => _soundEnabled;
  String get soundType => _soundType;
  Map<String, dynamic>? get user => _user;

  String translate(String key) {
    return Translations.get(key, _lang);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = _theme == 'dark';
    
    return MaterialApp(
      title: 'CareerPath AI',
      debugShowCheckedModeBanner: false,
      themeMode: isDark ? ThemeMode.dark : ThemeMode.light,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF8F9FA),
        primaryColor: const Color(0xFF6C63FF),
        colorScheme: const ColorScheme.light(
          primary: Color(0xFF6C63FF),
          secondary: Color(0xFF9C5FFF),
          background: Color(0xFFF8F9FA),
          surface: Colors.white,
        ),
        textTheme: const TextTheme(
          bodyLarge: TextStyle(fontFamily: 'Inter', color: Color(0xFF1E293B)),
          bodyMedium: TextStyle(fontFamily: 'Inter', color: Color(0xFF475569)),
        ),
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF06020F),
        primaryColor: const Color(0xFF6C63FF),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF6C63FF),
          secondary: Color(0xFF9C5FFF),
          background: Color(0xFF06020F),
          surface: Color(0xFF0D0A1C),
        ),
        textTheme: const TextTheme(
          bodyLarge: TextStyle(fontFamily: 'Inter', color: Color(0xFFE2E8F0)),
          bodyMedium: TextStyle(fontFamily: 'Inter', color: Color(0xFF94A3B8)),
        ),
      ),
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', ''),
        Locale('hi', ''),
        Locale('te', ''),
      ],
      home: const SplashPage(),
    );
  }
}
