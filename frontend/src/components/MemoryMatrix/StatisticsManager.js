/**
 * StatisticsManager.js
 * Handles reading and updating local storage statistics.
 */

const KEYS = {
  BEST_SCORE: 'cp_matrix_best_score',
  HIGHEST_LEVEL: 'cp_matrix_highest_lvl',
  PLAYED: 'cp_matrix_played',
  ACCURACY: 'cp_matrix_acc',
  STREAK: 'cp_matrix_longest_streak',
  REACTION: 'cp_matrix_reaction'
};

export const loadStatistics = () => {
  return {
    bestScore: parseInt(localStorage.getItem(KEYS.BEST_SCORE) || '0', 10),
    highestLevel: parseInt(localStorage.getItem(KEYS.HIGHEST_LEVEL) || '1', 10),
    gamesPlayed: parseInt(localStorage.getItem(KEYS.PLAYED) || '0', 10),
    accuracy: parseFloat(localStorage.getItem(KEYS.ACCURACY) || '100.0'),
    longestStreak: parseInt(localStorage.getItem(KEYS.STREAK) || '0', 10),
    avgReaction: parseInt(localStorage.getItem(KEYS.REACTION) || '0', 10)
  };
};

export const updateStatistics = (sessionData) => {
  const current = loadStatistics();
  
  const nextGamesPlayed = current.gamesPlayed + 1;
  const nextBestScore = Math.max(current.bestScore, sessionData.score);
  const nextHighestLevel = Math.max(current.highestLevel, sessionData.level);
  
  // Calculate session accuracy
  const sessionAccuracy = sessionData.taps > 0 
    ? (sessionData.correctTaps / sessionData.taps) * 100 
    : 100;
    
  // Rolling average accuracy
  const nextAccuracy = parseFloat(
    ((current.accuracy * current.gamesPlayed + sessionAccuracy) / nextGamesPlayed).toFixed(1)
  );
  
  // Rolling average reaction time
  const sessionAvgReaction = sessionData.level > 1 
    ? Math.floor(sessionData.reactionTime / (sessionData.level - 1)) 
    : 0;
  let nextAvgReaction = current.avgReaction;
  if (sessionAvgReaction > 0) {
    nextAvgReaction = current.avgReaction > 0 
      ? Math.floor((current.avgReaction + sessionAvgReaction) / 2) 
      : sessionAvgReaction;
  }
  
  const nextLongestStreak = Math.max(current.longestStreak, sessionData.streak);

  // Commit back to local storage
  localStorage.setItem(KEYS.BEST_SCORE, String(nextBestScore));
  localStorage.setItem(KEYS.HIGHEST_LEVEL, String(nextHighestLevel));
  localStorage.setItem(KEYS.PLAYED, String(nextGamesPlayed));
  localStorage.setItem(KEYS.ACCURACY, String(nextAccuracy));
  localStorage.setItem(KEYS.STREAK, String(nextLongestStreak));
  localStorage.setItem(KEYS.REACTION, String(nextAvgReaction));

  return {
    bestScore: nextBestScore,
    highestLevel: nextHighestLevel,
    gamesPlayed: nextGamesPlayed,
    accuracy: nextAccuracy,
    longestStreak: nextLongestStreak,
    avgReaction: nextAvgReaction
  };
};
