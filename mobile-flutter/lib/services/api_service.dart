import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class ApiService {
  // Production URL retrieved from the mobile RN configs
  static const String _productionUrl = 'https://career-guidance-app-yx5h.onrender.com/api';
  
  static String get baseUrl {
    // Resolve dynamic loopback address depending on Platform
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:2259/api';
    } else {
      return 'http://localhost:2259/api';
    }
  }

  static String get activeUrl => _productionUrl; // Or fallback to baseUrl if testing locally

  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // --- HEALTH CHECK ---
  static Future<Map<String, dynamic>> checkHealth() async {
    try {
      final response = await http.get(Uri.parse('$activeUrl/health'), headers: _headers);
      return json.decode(response.body);
    } catch (_) {
      // Local fallback check
      try {
        final response = await http.get(Uri.parse('$baseUrl/health'), headers: _headers);
        return json.decode(response.body);
      } catch (e) {
        return {'status': 'offline', 'error': e.toString()};
      }
    }
  }

  // --- AFTER 10TH API ---
  static Future<List<dynamic>> getAfter10thStreams() async {
    return _get('/after10th/streams');
  }

  static Future<List<dynamic>> getAfter10thJobs() async {
    return _get('/after10th/jobs');
  }

  // --- AFTER 12TH API ---
  static Future<List<dynamic>> getAfter12thStreams() async {
    return _get('/after12th/streams');
  }

  static Future<List<dynamic>> getAfter12thSectors(String streamId) async {
    return _get('/after12th/sectors/$streamId');
  }

  static Future<List<dynamic>> getAfter12thJobs() async {
    return _get('/after12th/jobs');
  }

  // --- AFTER GRADUATION API ---
  static Future<List<dynamic>> getGraduationSectors() async {
    return _get('/aftergraduation/sectors');
  }

  static Future<List<dynamic>> getGraduationJobs() async {
    return _get('/aftergraduation/jobs');
  }

  static Future<List<dynamic>> getGraduationHigherStudy() async {
    return _get('/aftergraduation/higherstudy');
  }

  static Future<List<dynamic>> getGraduationStudyAbroad() async {
    return _get('/aftergraduation/studyabroad');
  }

  // --- SEARCH API ---
  static Future<List<dynamic>> searchCareers(String queryText) async {
    return _get('/search?q=${Uri.encodeComponent(queryText)}');
  }

  // --- TECH LEARNING API ---
  static Future<List<dynamic>> getTechnologies() async {
    return _get('/technologies');
  }

  // --- APTITUDE & REASONING API ---
  static Future<List<dynamic>> getAptitudeQuestions(String topic, String difficulty) async {
    return _get('/aptitude/questions/$topic/$difficulty');
  }

  static Future<Map<String, dynamic>> getReasoningQuiz() async {
    final response = await _getRaw('/reasoning/quiz');
    return json.decode(response.body);
  }



  static Future<Map<String, dynamic>> resetUserData(String userId) async {
    final response = await _postRaw('/profile/reset-data', {'userId': userId});
    return json.decode(response.body);
  }





  // --- GAME STORAGE ---
  static Future<Map<String, dynamic>> getGameData(String userId) async {
    final response = await _getRaw('/game-data?userId=$userId');
    return json.decode(response.body);
  }

  static Future<void> saveGameData(String userId, Map<String, dynamic> gameData) async {
    await _postRaw('/game-data', {
      'userId': userId,
      'gameData': gameData,
    });
  }

  // --- ARITHMETIC RAIN GAME STORAGE ---
  static Future<Map<String, dynamic>> getArithmeticRainUserData(String userId) async {
    final response = await _getRaw('/arithmetic-rain/user-data?userId=$userId');
    return json.decode(response.body);
  }

  static Future<void> saveArithmeticRainUserData(String userId, Map<String, dynamic> data) async {
    await _postRaw('/arithmetic-rain/save-session', {
      'userId': userId,
      'rainData': data,
    });
  }

  static Future<List<dynamic>> getArithmeticRainLeaderboard(String date) async {
    return _get('/arithmetic-rain/leaderboard?date=$date');
  }

  static Future<void> saveArithmeticRainDailyScore(String userId, String name, int score, double accuracy, int duration, String date) async {
    await _postRaw('/arithmetic-rain/save-daily', {
      'userId': userId,
      'userName': name,
      'score': score,
      'accuracy': accuracy,
      'duration': duration,
      'date': date,
    });
  }

  // --- ATS SERVICE ---
  static Future<Map<String, dynamic>> extractResumeText(String base64File, String mimeType, String fileName) async {
    final response = await _postRaw('/ats/extract', {
      'file': base64File,
      'mimeType': mimeType,
      'name': fileName,
    });
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> checkFormatting(String text, Map<String, dynamic> sections) async {
    final response = await _postRaw('/ats/check-formatting', {
      'text': text,
      'sections': sections,
    });
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> matchSkills(List<String> resumeSkills, List<String> jdSkills) async {
    final response = await _postRaw('/ats/match-skills', {
      'resumeSkills': resumeSkills,
      'jdSkills': jdSkills,
    });
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> parseJobDescription(String jdText) async {
    final response = await _postRaw('/ats/parse-jd', {
      'jdText': jdText,
    });
    return json.decode(response.body);
  }

  static Future<Map<String, dynamic>> scoreResume(Map<String, dynamic> payload) async {
    final response = await _postRaw('/ats/score', payload);
    return json.decode(response.body);
  }

  // --- HELPERS ---
  static Future<List<dynamic>> _get(String path) async {
    try {
      final response = await http.get(Uri.parse('$activeUrl$path'), headers: _headers);
      return json.decode(response.body);
    } catch (_) {
      final response = await http.get(Uri.parse('$baseUrl$path'), headers: _headers);
      return json.decode(response.body);
    }
  }

  static Future<http.Response> _getRaw(String path) async {
    try {
      return await http.get(Uri.parse('$activeUrl$path'), headers: _headers);
    } catch (_) {
      return await http.get(Uri.parse('$baseUrl$path'), headers: _headers);
    }
  }

  static Future<http.Response> _postRaw(String path, Map<String, dynamic> body) async {
    try {
      return await http.post(
        Uri.parse('$activeUrl$path'),
        headers: _headers,
        body: json.encode(body),
      );
    } catch (_) {
      return await http.post(
        Uri.parse('$baseUrl$path'),
        headers: _headers,
        body: json.encode(body),
      );
    }
  }
}
