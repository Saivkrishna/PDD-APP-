import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../main.dart';
import '../utils/sound_manager.dart';

class MemoryMatrixGame extends StatefulWidget {
  const MemoryMatrixGame({super.key});

  @override
  State<MemoryMatrixGame> createState() => _MemoryMatrixGameState();
}

class _MemoryMatrixGameState extends State<MemoryMatrixGame> {
  String _gameState = 'idle'; // 'idle' | 'memorize' | 'recall' | 'gameover' | 'success'
  int _level = 1;
  int _score = 0;
  int _lives = 3;
  int _gridSize = 3; // 3x3, 4x4 etc.
  
  List<int> _highlightedTiles = [];
  List<int> _selectedTiles = [];
  int? _failedTile;
  bool _shakeGrid = false;
  
  Timer? _memorizeTimer;

  void _startGame() {
    final state = CareerPathApp.of(context);
    SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
    setState(() {
      _level = 1;
      _score = 0;
      _lives = 3;
      _gridSize = 3;
      _gameState = 'memorize';
    });
    _startRound();
  }

  void _startRound() {
    setState(() {
      _selectedTiles = [];
      _failedTile = null;
      _shakeGrid = false;
      _gameState = 'memorize';
      
      // Determine grid size based on level
      if (_level <= 3) {
        _gridSize = 3;
      } else if (_level <= 8) {
        _gridSize = 4;
      } else {
        _gridSize = 5;
      }

      // Generate random highlighted pattern
      final totalTiles = _gridSize * _gridSize;
      final numHighlights = _gridSize + (_level % 3);
      final list = List<int>.generate(totalTiles, (i) => i)..shuffle();
      _highlightedTiles = list.take(numHighlights).toList();
    });

    // Flash highlights for 2 seconds
    _memorizeTimer = Timer(const Duration(milliseconds: 2000), () {
      if (mounted) {
        setState(() {
          _gameState = 'recall';
        });
      }
    });
  }

  void _tileTapped(int index) {
    if (_gameState != 'recall') return;
    final state = CareerPathApp.of(context);

    if (_highlightedTiles.contains(index)) {
      // Correct Tap
      if (!_selectedTiles.contains(index)) {
        SoundManager.playClick(state?.soundEnabled ?? true, state?.soundType ?? 'synth');
        setState(() {
          _selectedTiles.add(index);
        });

        // Verify if all correct tiles are tapped
        if (_selectedTiles.length == _highlightedTiles.length) {
          SoundManager.playSuccess(state?.soundEnabled ?? true);
          setState(() {
            _score += _level * 10;
            _level++;
          });
          
          if (_level > 12) {
            setState(() {
              _gameState = 'success';
            });
          } else {
            Future.delayed(const Duration(milliseconds: 1000), _startRound);
          }
        }
      }
    } else {
      // Incorrect Tap
      SoundManager.playError(state?.soundEnabled ?? true);
      setState(() {
        _failedTile = index;
        _lives--;
        _shakeGrid = true;
      });

      if (_lives <= 0) {
        setState(() {
          _gameState = 'gameover';
        });
      } else {
        // Redraw/restart same round after 1 second delay
        Future.delayed(const Duration(milliseconds: 1200), _startRound);
      }
    }
  }

  @override
  void dispose() {
    _memorizeTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Memory Matrix', style: TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold)),
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
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. HUD Stats
              if (_gameState == 'memorize' || _gameState == 'recall') ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildHudItem('Level', '$_level', Colors.blue),
                    _buildHudItem('Score', '$_score', Colors.green),
                    _buildHudItem('Lives', List.generate(_lives, (_) => '❤️').join(' '), Colors.red),
                  ],
                ),
                const SizedBox(height: 20),
                Text(
                  _gameState == 'memorize' ? 'Memorize the pattern!' : 'Tap the active cells!',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: _gameState == 'memorize' ? Colors.amber : Colors.green),
                  textAlign: TextAlign.center,
                ),
              ],
              const Spacer(),

              // 2. Play Board
              _gameState == 'idle'
                  ? _buildMenu()
                  : _gameState == 'gameover'
                      ? _buildGameOver()
                      : _gameState == 'success'
                          ? _buildSuccess()
                          : _buildGridBoard(),
              
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenu() {
    return Column(
      children: [
        const Text('🧠', style: TextStyle(fontSize: 80)),
        const SizedBox(height: 15),
        const Text(
          'Memory Matrix Game',
          style: TextStyle(fontFamily: 'Outfit', fontSize: 22, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 10),
        const Text(
          'Test and expand your spatial memory and grid recognition skills.',
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 40),
        ElevatedButton(
          style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 14)),
          onPressed: _startGame,
          child: const Text('START GAME', style: TextStyle(fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }

  Widget _buildGridBoard() {
    final theme = Theme.of(context);
    final totalCells = _gridSize * _gridSize;
    
    return AspectRatio(
      aspectRatio: 1.0,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.02),
          border: Border.all(color: Colors.white.withOpacity(0.1)),
          borderRadius: BorderRadius.circular(16),
        ),
        child: GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: _gridSize,
            mainAxisSpacing: 8,
            crossAxisSpacing: 8,
          ),
          itemCount: totalCells,
          itemBuilder: (context, idx) {
            final isHighlighted = _highlightedTiles.contains(idx);
            final isSelected = _selectedTiles.contains(idx);
            final isFailed = _failedTile == idx;
            
            Color tileColor = Colors.white.withOpacity(0.08);
            if (_gameState == 'memorize' && isHighlighted) {
              tileColor = theme.colorScheme.primary;
            } else if (_gameState == 'recall') {
              if (isSelected) {
                tileColor = Colors.green;
              } else if (isFailed) {
                tileColor = Colors.red;
              }
            }

            return GestureDetector(
              onTap: () => _tileTapped(idx),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                decoration: BoxDecoration(
                  color: tileColor,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.white.withOpacity(0.04)),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildGameOver() {
    return Column(
      children: [
        const Text('☠️', style: TextStyle(fontSize: 80)),
        const SizedBox(height: 15),
        const Text('Game Over!', style: TextStyle(fontFamily: 'Outfit', fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Text('Your final score is: $_score', style: const TextStyle(fontSize: 16)),
        const SizedBox(height: 40),
        ElevatedButton(
          onPressed: _startGame,
          child: const Text('Try Again'),
        ),
      ],
    );
  }

  Widget _buildSuccess() {
    return Column(
      children: [
        const Text('🏆', style: TextStyle(fontSize: 80)),
        const SizedBox(height: 15),
        const Text('Success!', style: TextStyle(fontFamily: 'Outfit', fontSize: 24, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Text('Excellent! You completed all levels with a score of: $_score', textAlign: TextAlign.center),
        const SizedBox(height: 40),
        ElevatedButton(
          onPressed: _startGame,
          child: const Text('Play Again'),
        ),
      ],
    );
  }

  Widget _buildHudItem(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(value, style: TextStyle(fontSize: 14, color: color, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
