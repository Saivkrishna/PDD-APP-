import 'package:flutter/material.dart';
import '../main.dart';
import '../services/auth_service.dart';
import '../utils/sound_manager.dart';
import 'home_nav_hub.dart';

class AuthGateway extends StatefulWidget {
  const AuthGateway({super.key});

  @override
  State<AuthGateway> createState() => _AuthGatewayState();
}

class _AuthGatewayState extends State<AuthGateway> {
  String _screen = 'login'; // 'login' | 'register' | 'forgot'
  
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();
  
  bool _loading = false;
  String? _error;
  String? _message;

  void _switchScreen(String screen) {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    setState(() {
      _screen = screen;
      _error = null;
      _message = null;
    });
  }

  void _handleAuthAction() async {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');

    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final name = _nameController.text.trim();

    if (email.isEmpty || (_screen != 'forgot' && password.isEmpty) || (_screen == 'register' && name.isEmpty)) {
      setState(() {
        _error = "Please fill in all required fields.";
      });
      SoundManager.playError(state?.soundEnabled ?? true);
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
      _message = null;
    });

    Map<String, dynamic> result;
    if (_screen == 'login') {
      result = await AuthService.login(email, password);
    } else if (_screen == 'register') {
      result = await AuthService.register(name, email, password);
    } else {
      result = await AuthService.forgotPassword(email);
    }

    setState(() {
      _loading = false;
    });

    if (result['success'] == true) {
      SoundManager.playSuccess(state?.soundEnabled ?? true);
      if (_screen == 'forgot') {
        setState(() {
          _message = result['message'] ?? 'Password reset link sent!';
        });
      } else {
        // Cache session and navigate to home nav hub
        state?.setUser(result['user']);
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const HomeNavHub()),
        );
      }
    } else {
      SoundManager.playError(state?.soundEnabled ?? true);
      setState(() {
        _error = result['error'] ?? 'Authentication failed. Please try again.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = CareerPathApp.of(context);
    
    // Automatically redirect if already logged in
    if (state?.user != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const HomeNavHub()),
        );
      });
    }

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0F0826),
              Color(0xFF06020F),
            ],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 30.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  '🎓',
                  style: TextStyle(fontSize: 60),
                ),
                const SizedBox(height: 10),
                const Text(
                  'CareerPath AI',
                  style: TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 32,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 30),
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.04),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white.withOpacity(0.08)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        _screen == 'login'
                            ? 'Login to Your Account'
                            : _screen == 'register'
                                ? 'Create New Account'
                                : 'Reset Password',
                        style: const TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 20),
                      
                      if (_error != null) ...[
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.red.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: Colors.red.withOpacity(0.3)),
                          ),
                          child: Text(
                            _error!,
                            style: const TextStyle(color: Colors.redAccent, fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                        ),
                        const SizedBox(height: 15),
                      ],
                      
                      if (_message != null) ...[
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.green.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: Colors.green.withOpacity(0.3)),
                          ),
                          child: Text(
                            _message!,
                            style: const TextStyle(color: Colors.greenAccent, fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                        ),
                        const SizedBox(height: 15),
                      ],

                      if (_screen == 'register') ...[
                        _buildInputField('Full Name', _nameController, Icons.person_outline),
                        const SizedBox(height: 15),
                      ],
                      
                      _buildInputField('Email Address', _emailController, Icons.email_outlined, keyboardType: TextInputType.emailAddress),
                      
                      if (_screen != 'forgot') ...[
                        const SizedBox(height: 15),
                        _buildInputField('Password', _passwordController, Icons.lock_outline, obscureText: true),
                      ],
                      
                      const SizedBox(height: 25),
                      
                      GestureDetector(
                        onTap: _loading ? null : _handleAuthAction,
                        child: Container(
                          height: 50,
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFF6C63FF), Color(0xFF9C5FFF)],
                            ),
                            borderRadius: BorderRadius.circular(25),
                          ),
                          child: Center(
                            child: _loading
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                  )
                                : Text(
                                    _screen == 'login'
                                        ? 'LOGIN'
                                        : _screen == 'register'
                                            ? 'REGISTER'
                                            : 'SEND RESET LINK',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 1.0,
                                    ),
                                  ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                
                // Switch forms buttons
                if (_screen == 'login') ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("Don't have an account? ", style: TextStyle(color: Colors.white.withOpacity(0.6))),
                      GestureDetector(
                        onTap: () => _switchScreen('register'),
                        child: const Text('Register', style: TextStyle(color: Color(0xFF6C63FF), fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  GestureDetector(
                    onTap: () => _switchScreen('forgot'),
                    child: Text('Forgot Password?', style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 13)),
                  ),
                ] else if (_screen == 'register') ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("Already have an account? ", style: TextStyle(color: Colors.white.withOpacity(0.6))),
                      GestureDetector(
                        onTap: () => _switchScreen('login'),
                        child: const Text('Login', style: TextStyle(color: Color(0xFF6C63FF), fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ] else ...[
                  GestureDetector(
                    onTap: () => _switchScreen('login'),
                    child: const Text('← Back to Login', style: TextStyle(color: Color(0xFF6C63FF), fontWeight: FontWeight.bold)),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField(String hintText, TextEditingController controller, IconData icon, {bool obscureText = false, TextInputType keyboardType = TextInputType.text}) {
    return TextField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      style: const TextStyle(color: Colors.white, fontSize: 14),
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
        prefixIcon: Icon(icon, color: Colors.white.withOpacity(0.4), size: 20),
        filled: true,
        fillColor: Colors.white.withOpacity(0.04),
        contentPadding: const EdgeInsets.symmetric(vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF6C63FF)),
        ),
      ),
    );
  }
}
