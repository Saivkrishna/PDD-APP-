/**
 * AudioSynthManager.js
 * Generates all game sound effects and a retro 8-bit background music (BGM) loop
 * on-the-fly using the Web Audio API. Requires no external audio files!
 */

let bgmInterval = null;
let bgmContext = null;
let bgmGainNode = null;
let tempo = 135; // BPM
let currentBeat = 0;

// Simple looping arpeggio melody (notes in Hz)
const MELODY = [
  130.81, 196.00, 261.63, 329.63, // C3, G3, C4, E4
  146.83, 220.00, 293.66, 349.23, // D3, A3, D4, F4
  164.81, 246.94, 329.63, 392.00, // E3, B3, E4, G4
  174.61, 261.63, 349.23, 440.00  // F3, C4, F4, A4
];

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
        // Short high beep for countdowns
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'correct':
        // Uplifting quick double sweep
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
        break;

      case 'wrong':
        // Heavy buzzing sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'damage':
        // Quick white noise-like thud for losing a life
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.setValueAtTime(60, now + 0.1);
        gain.gain.setValueAtTime(0.20, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'level_up':
        // Happy retro level-up sound
        osc.type = 'square';
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        });
        gain.gain.setValueAtTime(0.10, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
        break;

      case 'gameover':
        // Descending sad chord decay
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.linearRampToValueAtTime(110, now + 0.8); // A2
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        osc.start(now);
        osc.stop(now + 0.85);
        break;

      default:
        break;
    }
  } catch (err) {
    console.error("Audio tone playback failed:", err);
  }
};

export const startBGM = (enabled = true) => {
  if (!enabled) {
    stopBGM();
    return;
  }

  if (bgmInterval) return; // Already running

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    bgmContext = new AudioContextClass();
    bgmGainNode = bgmContext.createGain();
    bgmGainNode.gain.setValueAtTime(0.015, bgmContext.currentTime); // Low volume background level
    bgmGainNode.connect(bgmContext.destination);

    const secondsPerBeat = 60.0 / tempo;

    bgmInterval = setInterval(() => {
      if (!bgmContext || bgmContext.state === 'suspended') return;

      const now = bgmContext.currentTime;

      // Play a bass / chord note
      const noteFreq = MELODY[currentBeat % MELODY.length];
      const osc = bgmContext.createOscillator();
      const noteGain = bgmContext.createGain();

      osc.connect(noteGain);
      noteGain.connect(bgmGainNode);

      // Standard retro triangle sound for bassline
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(noteFreq, now);

      // Envelope: quick decay
      noteGain.gain.setValueAtTime(0.6, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + secondsPerBeat * 0.95);

      osc.start(now);
      osc.stop(now + secondsPerBeat * 0.95);

      currentBeat = (currentBeat + 1) % 16;
    }, secondsPerBeat * 1000);
  } catch (err) {
    console.error("Failed to start BGM:", err);
  }
};

export const stopBGM = () => {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (bgmContext) {
    try {
      bgmContext.close();
    } catch (e) {}
    bgmContext = null;
    bgmGainNode = null;
  }
  currentBeat = 0;
};

export const setBGMVolume = (volume) => {
  if (bgmGainNode && bgmContext) {
    bgmGainNode.gain.setValueAtTime(volume * 0.015, bgmContext.currentTime);
  }
};
