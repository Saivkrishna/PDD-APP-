/**
 * VibrationManager.js
 * Controls device vibration haptic feedback.
 * Safe for all platforms: fails silently if API is unsupported (like iOS Safari or desktop).
 */

export const triggerVibration = (type, enabled = true) => {
  if (!enabled || !navigator || !navigator.vibrate) return;

  try {
    switch (type) {
      case 'tap':
        // Short subtle tap
        navigator.vibrate(15);
        break;

      case 'correct':
        // Happy quick confirmation pulse
        navigator.vibrate(35);
        break;

      case 'wrong':
        // Annoying thud
        navigator.vibrate(80);
        break;

      case 'damage':
        // Double shake pulse when a life is lost
        navigator.vibrate([100, 40, 100]);
        break;

      case 'gameover':
        // Sad heavy long decay vibration
        navigator.vibrate([300, 100, 500]);
        break;

      case 'level_up':
        // Upbeat rhythm vibration
        navigator.vibrate([40, 40, 40, 40, 120]);
        break;

      default:
        break;
    }
  } catch (err) {
    console.warn("Haptic vibration blocked or unsupported:", err);
  }
};
