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
import 'screens/memory_matrix_game.dart';
import 'screens/arithmetic_rain_game.dart';
import 'screens/search_page.dart';
import 'services/auth_service.dart';
import 'services/api_service.dart';
import 'utils/translations.dart';
import 'utils/sound_manager.dart';

class AppTheme {
  final String id;
  final String name;
  final Color primary;
  final Color secondary;
  final List<Color> gradientColors;
  final Color cardBg;
  final Color borderColor;

  const AppTheme({
    required this.id,
    required this.name,
    required this.primary,
    required this.secondary,
    required this.gradientColors,
    required this.cardBg,
    required this.borderColor,
  });

  static const Map<String, AppTheme> allThemes = {
    'cosmic': AppTheme(
      id: 'cosmic',
      name: 'Cosmic',
      primary: Color(0xFF38BDF8),
      secondary: Color(0xFF818CF8),
      gradientColors: [Color(0xFF090F1D), Color(0xFF0D1527), Color(0xFF070B15)],
      cardBg: Color(0xFF0F172A),
      borderColor: Color(0x2638BDF8),
    ),
    'neon': AppTheme(
      id: 'neon',
      name: 'Neon',
      primary: Color(0xFFEC4899),
      secondary: Color(0xFFA855F7),
      gradientColors: [Color(0xFF08030F), Color(0xFF0E061A), Color(0xFF05020A)],
      cardBg: Color(0xFF140A1E),
      borderColor: Color(0x33EC4899),
    ),
    'emerald': AppTheme(
      id: 'emerald',
      name: 'Emerald',
      primary: Color(0xFF10B981),
      secondary: Color(0xFF14B8A6),
      gradientColors: [Color(0xFF020F0C), Color(0xFF051B16), Color(0xFF010907)],
      cardBg: Color(0xFF051914),
      borderColor: Color(0x2610B981),
    ),
    'amber': AppTheme(
      id: 'amber',
      name: 'Amber',
      primary: Color(0xFFFBBF24),
      secondary: Color(0xFFF97316),
      gradientColors: [Color(0xFF0F0B04), Color(0xFF1B1307), Color(0xFF0A0702)],
      cardBg: Color(0xFF19140A),
      borderColor: Color(0x2EFBBF24),
    ),
    'sapphire': AppTheme(
      id: 'sapphire',
      name: 'Sapphire',
      primary: Color(0xFF06B6D4),
      secondary: Color(0xFF3B82F6),
      gradientColors: [Color(0xFF030D1E), Color(0xFF051632), Color(0xFF020915)],
      cardBg: Color(0xFF0A1932),
      borderColor: Color(0x2606B6D4),
    ),
    'ruby': AppTheme(
      id: 'ruby',
      name: 'Ruby',
      primary: Color(0xFFF43F5E),
      secondary: Color(0xFFDB2777),
      gradientColors: [Color(0xFF110208), Color(0xFF1E0510), Color(0xFF0A0105)],
      cardBg: Color(0xFF1E050F),
      borderColor: Color(0x26F43F5E),
    ),
    'orchid': AppTheme(
      id: 'orchid',
      name: 'Orchid',
      primary: Color(0xFFD946EF),
      secondary: Color(0xFF8B5CF6),
      gradientColors: [Color(0xFF0D0214), Color(0xFF1A0429), Color(0xFF07010B)],
      cardBg: Color(0xFF190528),
      borderColor: Color(0x26D946EF),
    ),
    'sunset': AppTheme(
      id: 'sunset',
      name: 'Sunset',
      primary: Color(0xFFF97316),
      secondary: Color(0xFFEC4899),
      gradientColors: [Color(0xFF120502), Color(0xFF220B05), Color(0xFF0B0201)],
      cardBg: Color(0xFF1E0A05),
      borderColor: Color(0x26F97316),
    ),
  };
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase Auth / Core gracefully
  await AuthService.initFirebase();
  
  final prefs = await SharedPreferences.getInstance();
  final String initialLang = prefs.getString('cp_lang') ?? 'en';
  final String savedTheme = prefs.getString('cp_theme') ?? 'cosmic';
  final String initialTheme = AppTheme.allThemes.containsKey(savedTheme) ? savedTheme : 'cosmic';
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

  static List<Color> getGradient(BuildContext context) {
    final state = context.findAncestorStateOfType<_CareerPathAppState>();
    final themeId = state?._theme ?? 'cosmic';
    return AppTheme.allThemes[themeId]?.gradientColors ?? AppTheme.allThemes['cosmic']!.gradientColors;
  }

  static Color getCardBg(BuildContext context) {
    final state = context.findAncestorStateOfType<_CareerPathAppState>();
    final themeId = state?._theme ?? 'cosmic';
    return AppTheme.allThemes[themeId]?.cardBg ?? AppTheme.allThemes['cosmic']!.cardBg;
  }

  static Color getBorderColor(BuildContext context) {
    final state = context.findAncestorStateOfType<_CareerPathAppState>();
    final themeId = state?._theme ?? 'cosmic';
    return AppTheme.allThemes[themeId]?.borderColor ?? AppTheme.allThemes['cosmic']!.borderColor;
  }

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

  ThemeData _buildThemeData(String themeId) {
    final t = AppTheme.allThemes[themeId] ?? AppTheme.allThemes['cosmic']!;
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: t.gradientColors.last,
      primaryColor: t.primary,
      colorScheme: ColorScheme.dark(
        primary: t.primary,
        secondary: t.secondary,
        background: t.gradientColors.last,
        surface: t.cardBg,
      ),
      cardColor: t.cardBg,
      dividerColor: t.borderColor,
      textTheme: const TextTheme(
        bodyLarge: TextStyle(fontFamily: 'Inter', color: Color(0xFFE2E8F0)),
        bodyMedium: TextStyle(fontFamily: 'Inter', color: Color(0xFF94A3B8)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeData = _buildThemeData(_theme);
    
    return MaterialApp(
      title: 'CareerPath AI',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      theme: themeData,
      darkTheme: themeData,
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', ''),
        Locale('hi', ''),
        Locale('te', ''),
        Locale('es', ''),
      ],
      home: const SplashPage(),
    );
  }
}
