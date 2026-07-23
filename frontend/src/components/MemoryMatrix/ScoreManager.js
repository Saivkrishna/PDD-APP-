/**
 * ScoreManager.js
 * Tracks game scores, coins increments, daily streak records,
 * and XP progression values.
 */

export const calculateScoreGained = (level, streakCount) => {
  // Score = Level * 10 * Multiplier (if streak is active)
  const multiplier = streakCount >= 5 ? 1.5 : streakCount >= 3 ? 1.2 : 1.0;
  return Math.round(level * 10 * multiplier);
};

export const getRewards = (level, isChallenge) => {
  if (isChallenge) {
    return {
      coins: 50,
      xp: 100
    };
  }
  
  // Normal game payout: proportional to level
  return {
    coins: level * 2,
    xp: level * 5
  };
};

export const updateStreakCounter = (lastPlayedDate, currentStreak) => {
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (lastPlayedDate === todayStr) {
    return currentStreak;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (lastPlayedDate === yesterdayStr) {
    return currentStreak + 1;
  }
  
  // Reset if missed a day
  return 1;
};
