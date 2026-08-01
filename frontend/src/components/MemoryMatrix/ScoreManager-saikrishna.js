/**
 * ScoreManager.js
 * Tracks game scores, weighted stars, coins payouts (including streak/combo),
 * daily streak records, and XP progression values.
 */

// Calculate weighted stars (1-3) based on tier accuracy and speed weights
export const calculateLevelStars = (tier, accuracyDecimal, speedDecimal) => {
  let accWeight, speedWeight;

  if (tier === 'Heroic') {
    accWeight = 0.7;
    speedWeight = 0.3;
  } else if (tier === 'Master') {
    accWeight = 0.6;
    speedWeight = 0.4;
  } else {
    // Grand Master
    accWeight = 0.5;
    speedWeight = 0.5;
  }

  const weightedScore = (accuracyDecimal * accWeight) + (speedDecimal * speedWeight);
  const scorePercent = weightedScore * 100;

  if (scorePercent >= 90) return 3;
  if (scorePercent >= 70) return 2;
  if (scorePercent >= 40) return 1;
  return 0;
};

// Calculate coins based on formula: Base * Stars * (1 + 0.1 * Combo Streak, cap 50%)
export const calculateCoinsEarned = (tier, stars, comboStreak) => {
  if (stars === 0) return 0;
  
  let baseCoins = 10;
  if (tier === 'Master') {
    baseCoins = 20;
  } else if (tier === 'Grand Master') {
    baseCoins = 35;
  }

  const comboBonus = Math.min(0.5, 0.1 * comboStreak); // Capped at 50% (+0.5)
  const multiplier = 1 + comboBonus;
  
  return Math.round(baseCoins * stars * multiplier);
};

// Calculate XP: Tiles in pattern * 2
export const calculateXpEarned = (tilesCount) => {
  return tilesCount * 2;
};

// Update streak counter for consecutive day logins
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
