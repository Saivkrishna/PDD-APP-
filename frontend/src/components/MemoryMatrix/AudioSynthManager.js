/**
 * AudioSynthManager.js
 * Synthesizes audio feedback on demand using the Web Audio API.
 * Contains no external media downloads, making it 100% responsive and offline-capable.
 */

export const playAudioTone = (type, enabled = true) => {
  if (!enabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    switch (type) {
      case 'tick':
        // Short high-pitched woodblock-style tick for countdowns
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
        
      case 'tap':
        // Short subtle feedback pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
        
      case 'correct':
        // Uplifting ascending major interval (E5 -> G5)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.08); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
        
      case 'wrong':
        // Heavy low thud descending
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(170, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.28);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
        break;
        
      case 'complete':
        // Ascending major triad arpeggio (C5 -> E5 -> G5 -> C6)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
        break;
        
      case 'gameover':
        // Descending sad chord decay
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(330, now); // E4
        osc.frequency.linearRampToValueAtTime(110, now + 0.6);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
        break;

      default:
        break;
    }
  } catch (err) {
    console.error("Audio Synthesis failed:", err);
  }
};
