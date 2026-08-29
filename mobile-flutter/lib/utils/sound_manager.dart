import 'package:flutter/services.dart';

class SoundManager {
  static void playClick(bool enabled, [String type = 'synth']) {
    if (!enabled) return;
    
    // Simulates interaction sounds using platform haptics
    if (type == 'synth') {
      HapticFeedback.selectionClick();
    } else {
      HapticFeedback.lightImpact();
    }
  }

  static void playSuccess(bool enabled) {
    if (!enabled) return;
    HapticFeedback.mediumImpact();
  }

  static void playError(bool enabled) {
    if (!enabled) return;
    HapticFeedback.vibrate();
  }
}
