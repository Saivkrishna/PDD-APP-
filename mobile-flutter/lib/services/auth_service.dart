import 'dart:convert';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'api_service.dart';

class AuthService {
  static FirebaseAuth? _auth;

  static Future<void> initFirebase() async {
    try {
      if (Firebase.apps.isEmpty) {
        try {
          await Firebase.initializeApp();
        } catch (_) {
          await Firebase.initializeApp(
            options: const FirebaseOptions(
              apiKey: "AIzaSyBIfzCZRe5nYajS912R9gOGsDxjTSLSjEY",
              authDomain: "career-guidance-app-9aba0.firebaseapp.com",
              projectId: "career-guidance-app-9aba0",
              storageBucket: "career-guidance-app-9aba0.firebasestorage.app",
              messagingSenderId: "162671597184",
              appId: "1:162671597184:web:137fa2c7654bf002d9b865",
            ),
          );
        }
      }
      _auth = FirebaseAuth.instance;
      print("🔥 Firebase initialized successfully inside Flutter");
    } catch (e) {
      print("⚠️ Firebase initialization bypassed/failed: $e. Falling back to local backend REST auth.");
    }
  }

  // --- REGISTER ---
  static Future<Map<String, dynamic>> register(String name, String email, String password) async {
    try {
      if (_auth != null) {
        // Register using Firebase client Auth SDK
        final credential = await _auth!.createUserWithEmailAndPassword(
          email: email,
          password: password,
        );
        if (credential.user != null) {
          await credential.user!.updateDisplayName(name);
          // Sync account with the backend database
          final syncRes = await syncBackend(credential.user!.uid, name, email);
          await _cacheUserSession(syncRes);
          return {'success': true, 'user': syncRes};
        }
      }
      throw Exception("Firebase auth service unavailable");
    } catch (err) {
      print("⚠️ Firebase Auth registration failed. Attempting Direct REST Fallback.");
      // Fallback: direct REST registration against Express backend
      try {
        // We can hit Express registration endpoint directly
        final res = await httpPost('/auth/register', {
          'name': name,
          'email': email,
          'password': password
        });
        if (res['success'] == true) {
          final user = res['user'];
          await _cacheUserSession(user);
          return {'success': true, 'user': user};
        }
        return {'success': false, 'error': res['error'] ?? 'Registration failed'};
      } catch (e) {
        return {'success': false, 'error': e.toString()};
      }
    }
  }

  // --- LOGIN ---
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      if (_auth != null) {
        final credential = await _auth!.signInWithEmailAndPassword(
          email: email,
          password: password,
        );
        if (credential.user != null) {
          final syncRes = await syncBackend(
            credential.user!.uid,
            credential.user!.displayName ?? 'Firebase User',
            email,
          );
          await _cacheUserSession(syncRes);
          return {'success': true, 'user': syncRes};
        }
      }
      throw Exception("Firebase auth service unavailable");
    } catch (err) {
      print("⚠️ Firebase Auth login failed. Attempting Direct REST Fallback.");
      try {
        final res = await httpPost('/auth/login', {
          'email': email,
          'password': password
        });
        if (res['success'] == true) {
          final user = res['user'];
          await _cacheUserSession(user);
          return {'success': true, 'user': user};
        }
        return {'success': false, 'error': res['error'] ?? 'Login failed'};
      } catch (e) {
        return {'success': false, 'error': e.toString()};
      }
    }
  }

  // --- FORGOT PASSWORD ---
  static Future<Map<String, dynamic>> forgotPassword(String email) async {
    try {
      if (_auth != null) {
        await _auth!.sendPasswordResetEmail(email: email);
        return {'success': true, 'message': 'Reset link sent to your email.'};
      }
      throw Exception("Firebase auth service unavailable");
    } catch (_) {
      try {
        final res = await httpPost('/auth/forgot-password', {'email': email});
        return res;
      } catch (e) {
        return {'success': false, 'error': e.toString()};
      }
    }
  }

  // --- GOOGLE SIGN-IN ---
  static Future<Map<String, dynamic>> loginWithGoogle() async {
    try {
      if (_auth != null) {
        final GoogleSignIn googleSignIn = GoogleSignIn(
          serverClientId: '162671597184-rvh90iccromotabbiu1i0qi5ujpa3n7i.apps.googleusercontent.com',
          scopes: ['email', 'profile'],
        );
        final GoogleSignInAccount? googleUser = await googleSignIn.signIn();
        if (googleUser == null) {
          return {'success': false, 'error': 'Google Sign-In canceled'};
        }
        final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
        final AuthCredential credential = GoogleAuthProvider.credential(
          accessToken: googleAuth.accessToken,
          idToken: googleAuth.idToken,
        );
        final UserCredential userCredential = await _auth!.signInWithCredential(credential);
        if (userCredential.user != null) {
          final user = userCredential.user!;
          final syncRes = await syncBackend(
            user.uid,
            user.displayName ?? (user.email != null ? user.email!.split('@')[0] : 'Google User'),
            user.email ?? '',
          );
          await _cacheUserSession(syncRes);
          return {'success': true, 'user': syncRes};
        }
      }
      throw Exception("Firebase Auth unavailable");
    } catch (e) {
      print("⚠️ Google Sign-In error: $e");
      return {'success': false, 'error': 'Google Sign-In failed: ${e.toString()}'};
    }
  }

  // --- BACKEND AUTH SYNC ---
  static Future<Map<String, dynamic>> syncBackend(String id, String name, String email) async {
    try {
      final res = await httpPost('/auth/sync', {
        'id': id,
        'name': name,
        'email': email
      });
      return res['user'] ?? {'id': id, 'name': name, 'email': email};
    } catch (_) {
      return {'id': id, 'name': name, 'email': email};
    }
  }

  // --- SESSION UTILS ---
  static Future<void> _cacheUserSession(Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('cp_user', json.encode(user));
  }

  static Future<Map<String, dynamic>?> getCachedUser() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('cp_user');
    if (data != null) {
      return json.decode(data);
    }
    return null;
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('cp_user');
    if (_auth != null) {
      await _auth!.signOut();
    }
  }

  // Direct REST client helper for fallbacks
  static Future<Map<String, dynamic>> httpPost(String path, Map<String, dynamic> body) async {
    final activeUrl = ApiService.activeUrl;
    final fallbackUrl = ApiService.baseUrl;
    final headers = {'Content-Type': 'application/json'};
    
    try {
      final response = await http.post(
        Uri.parse('$activeUrl$path'),
        headers: headers,
        body: json.encode(body),
      );
      return json.decode(response.body);
    } catch (_) {
      final response = await http.post(
        Uri.parse('$fallbackUrl$path'),
        headers: headers,
        body: json.encode(body),
      );
      return json.decode(response.body);
    }
  }
}
