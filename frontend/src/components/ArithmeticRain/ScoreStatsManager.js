/**
 * ScoreStatsManager.js
 * Tracks arithmetic rain scoring, combo multipliers, achievements evaluation,
 * and handles localStorage backups for statistics.
 */

const STORAGE_KEYS = {
  STATS: 'cp_rain_stats',
  SETTINGS: 'cp_rain_settings',
  ACHIEVEMENTS: 'cp_rain_achievements',
  DAILY: 'cp_rain_daily'
};

export const calculatePoints = (operator, combo) => {
  // Base points by operator difficulty
  let basePoints = 10;
  if (operator === '*') basePoints = 15;
  if (operator === '/') basePoints = 20;

  // Combo multiplier (starts at 1.0x, increases by 0.1x for every 3 combo count, max 3.0x)
  const multiplier = Math.min(3.0, 1.0 + Math.floor(combo / 3) * 0.1);
  return Math.round(basePoints * multiplier);
};

export const getSessionRewards = (score, mode) => {
  if (mode === 'daily') {
    return { coins: 50, xp: 100 };
  }

  const divisor = mode === 'practice' ? 40 : 20;
  const coins = Math.max(1, Math.floor(score / divisor));
  const xp = Math.max(5, Math.floor(score / (divisor / 2)));

  return { coins, xp };
};

export const loadLocalData = () => {
  const defaultStats = {
    gamesPlayed: 0,
    totalSolved: 0,
    highestScorePractice: 0,
    highestScoreClassic: 0,
    highestScoreEndless: 0,
    highestScoreTimed: 0,
    accuracySum: 0,
    avgResponseTime: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    missedQuestions: 0
  };

  const defaultSettings = {
    music: true,
    sound: true,
    vibration: true
  };

  const defaultDaily = {
    lastPlayedDate: '',
    streak: 0,
    longestStreak: 0
  };

  try {
    return {
      stats: JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS)) || defaultStats,
      settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || defaultSettings,
      achievements: JSON.parse(localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) || [],
      daily: JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY)) || defaultDaily
    };
  } catch (e) {
    console.error('Failed to parse local storage game data:', e);
    return {
      stats: defaultStats,
      settings: defaultSettings,
      achievements: [],
      daily: defaultDaily
    };
  }
};

export const saveLocalData = (data) => {
  try {
    if (data.stats) localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data.stats));
    if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    if (data.achievements) localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
    if (data.daily) localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(data.daily));
  } catch (e) {
    console.error('Failed to write local storage game data:', e);
  }
};
