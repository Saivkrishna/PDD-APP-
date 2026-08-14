/**
 * MemoryMatrixGame.js
 * Consolidated controller and UI orchestrator for the redesigned Memory Matrix game.
 * Implements 3 modes: Real Mode, Practice Mode, and Time Trial Mode.
 * Enforces quadrant balanced patterns, exact campaign level progression, and 12 achievements.
 */

import React, { useState, useEffect, useRef } from 'react';
import { getLevelConfig, generatePattern, TIME_TRIAL_PATTERNS } from './PatternGenerator-saikrishna';
import { playAudioTone } from './AudioSynthManager';
import { calculateLevelStars, calculateCoinsEarned, calculateXpEarned, updateStreakCounter } from './ScoreManager-saikrishna';
import ConfettiManager from './ConfettiManager';
import { useBackHandler } from '../../utils/backHandler';


// Scoped layout styling
const CSS_ANIMATIONS = `
.memory-matrix-theme {
  --bg-primary: var(--bg-main);
  --bg-card: var(--card-bg);
  --text-main: var(--text-main);
  --text-sub: var(--text-sub);
  --color-primary: var(--primary);
  --color-primary-light: var(--bg-active);
  --color-accent: var(--primary);
  --color-tile-empty: var(--border-color);
  --color-tile-active: var(--bg-active);
  --color-tile-success: var(--primary);
  --color-tile-failed: #D26E6E;
  --border-color: var(--border-color);
  --shadow-soft: none;
  --shadow-medium: none;

  background-color: var(--bg-main) !important;
  color: var(--text-main) !important;
  font-family: 'Outfit', 'Inter', sans-serif !important;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

@keyframes matrix-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
@keyframes matrix-scale-in {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes matrix-pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(75, 126, 88, 0.4)); opacity: 0.95; }
  50% { filter: drop-shadow(0 0 20px rgba(75, 126, 88, 0.8)); opacity: 1; }
}
@keyframes matrix-flip-tile {
  0% { transform: rotateY(0); }
  50% { transform: rotateY(90deg); opacity: 0.8; }
  100% { transform: rotateY(0); }
}
@keyframes matrix-pulse-play {
  0%, 100% { 
    box-shadow: 0 0 15px rgba(75, 126, 88, 0.25);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 25px rgba(75, 126, 88, 0.5);
    transform: scale(1.03);
  }
}
@keyframes float-leaves {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}
@keyframes slide-toast-in {
  0% { transform: translateY(-50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.matrix-shake-active {
  animation: matrix-shake 0.4s ease-in-out;
}
.matrix-tile-memorize {
  animation: matrix-flip-tile 0.5s ease-in-out;
}
.matrix-pulse-play-btn {
  animation: matrix-pulse-play 2.5s infinite ease-in-out;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.matrix-pulse-play-btn:active {
  transform: scale(0.95) !important;
}
.matrix-theme-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: var(--shadow-soft);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.matrix-theme-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}
.matrix-btn-scale {
  transition: transform 0.15s ease;
}
.matrix-btn-scale:active {
  transform: scale(0.95);
}
.floating-leaf {
  animation: float-leaves 5s infinite ease-in-out;
}
@keyframes matrix-progress-decay {
  from { width: 100%; }
  to { width: 0%; }
}
`;

// Vector Icons / SVGs
const BrainLogoSVG = ({ size = 130 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 6px 12px rgba(75, 126, 88, 0.12))' }}>
    <path d="M100,30 C65,30 45,55 45,85 C45,100 50,115 60,125 C55,130 50,140 50,150 C50,165 65,175 85,170 C93,168 100,162 100,155 C100,162 107,168 115,170 C135,175 150,165 150,150 C150,140 145,130 140,125 C150,115 155,100 155,85 C155,55 135,30 100,30 Z" fill="#F1F6F1" stroke="#4B7E58" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M100,36 V150" stroke="#4B7E58" strokeWidth="5" strokeLinecap="round"/>
    <path d="M100,70 Q75,60 62,75 M100,95 Q77,88 67,103 M100,120 Q82,114 74,132 M100,140 Q88,140 83,149" stroke="#4B7E58" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M100,70 Q125,60 138,75 M100,95 Q123,88 133,103 M100,120 Q118,114 126,132 M100,140 Q112,140 117,149" stroke="#4B7E58" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <path className="floating-leaf" d="M30,70 Q20,50 40,45 Q45,60 30,70 Z" fill="#8FAF93" stroke="#4B7E58" strokeWidth="3"/>
    <path className="floating-leaf" d="M170,70 Q180,50 160,45 Q155,60 170,70 Z" fill="#8FAF93" stroke="#4B7E58" strokeWidth="3"/>
    <path className="floating-leaf" d="M35,120 Q20,115 25,95 Q40,105 35,120 Z" fill="#8FAF93" stroke="#4B7E58" strokeWidth="3"/>
    <path className="floating-leaf" d="M165,120 Q180,115 175,95 Q160,105 165,120 Z" fill="#8FAF93" stroke="#4B7E58" strokeWidth="3"/>
  </svg>
);

const TrophySVG = ({ size = 110 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 6px 12px rgba(225, 166, 60, 0.2))' }}>
    <path d="M35,25 H85 V60 C85,73 74,84 60,84 C46,84 35,73 35,60 V25 Z" fill="#F4C45C" stroke="#D4901A" strokeWidth="5" strokeLinejoin="round"/>
    <path d="M35,35 H23 C18,35 18,55 23,55 H35" stroke="#D4901A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M85,35 H97 C102,35 102,55 97,55 H85" stroke="#D4901A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M54,84 H66 V100 H54 V84 Z" fill="#D4901A" stroke="#B87C1E" strokeWidth="4"/>
    <path d="M40,100 H80 V110 H40 V100 Z" fill="#F4C45C" stroke="#D4901A" strokeWidth="5" strokeLinejoin="round"/>
    <path d="M60,37 L63,44 L70,45 L65,50 L66,57 L60,53 L54,57 L55,50 L50,45 L57,44 L60,37 Z" fill="#FFFFFF"/>
  </svg>
);

const LeafTileSVG = ({ size = 26, opacity = 0.15, color = "#4B7E58" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity, transition: 'opacity 0.25s ease' }}>
    <path d="M12,2 C12,2 6,8 6,13 C6,16.3 8.7,19 12,19 C15.3,19 18,16.3 18,13 C18,8 12,2 12,2 Z" fill={color}/>
    <path d="M12,2 V19" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.5 }}/>
    <path d="M12,8 Q9.5,9.5 9,12" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.5 }}/>
    <path d="M12,12 Q14.5,13.5 15,16" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.5 }}/>
  </svg>
);

const CloseSVG = ({ size = 20, color = "#2E3A2F" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Achievement specifications
const ACHIEVEMENT_LIST = [
  { id: 'first_steps', title: '🥉 First Steps', desc: 'Clear Level 1', rewardCoins: 20, rewardXp: 0 },
  { id: 'heroic_champ', title: '🏅 Chapter 1 Champion', desc: 'Clear all Chapter 1 levels (1–10)', rewardCoins: 150, rewardXp: 200 },
  { id: 'master_champ', title: '🥈 Chapter 2 Champion', desc: 'Clear all Chapter 2 levels (11–20)', rewardCoins: 250, rewardXp: 400 },
  { id: 'grand_master', title: '🏆 Grand Master', desc: 'Clear Level 30', rewardCoins: 500, rewardXp: 1000, hasBadge: true },
  { id: 'flawless_five', title: '🔥 Flawless Five', desc: 'Clear 5 levels in a row with 3 stars and zero misses', rewardCoins: 100, rewardXp: 0 },
  { id: 'perfectionist_heroic', title: '⚡ Perfectionist: Chapter 1', desc: 'Earn 3 stars on every Chapter 1 level (1–10)', rewardCoins: 200, rewardXp: 0 },
  { id: 'perfectionist_master', title: '⚡ Perfectionist: Chapter 2', desc: 'Earn 3 stars on every Chapter 2 level (11–20)', rewardCoins: 200, rewardXp: 0 },
  { id: 'perfectionist_gm', title: '⚡ Perfectionist: Chapter 3', desc: 'Earn 3 stars on every Chapter 3 level (21–30)', rewardCoins: 200, rewardXp: 0 },
  { id: 'sharp_eye', title: '👁️ Sharp Eye', desc: 'Reach a 10-level combo streak (cleared with zero misses)', rewardCoins: 75, rewardXp: 0 },
  { id: 'comeback', title: '🔄 Comeback', desc: 'Clear a level after losing all lives on a prior attempt of it', rewardCoins: 30, rewardXp: 0 },
  { id: 'no_regrets', title: '🛡️ No Regrets', desc: 'Clear all 30 levels without ever purchasing a life refill', rewardCoins: 300, rewardXp: 0, hasCosmetic: true },
  { id: 'speed_demon', title: '🐆 Speed Demon', desc: 'Beat your Time Trial personal best 5 times total', rewardCoins: 100, rewardXp: 0 },
  { id: 'marathoner', title: '🏃 Marathoner', desc: 'Complete a Time Trial run on all three tiers in one sitting', rewardCoins: 150, rewardXp: 0 },
  { id: 'dedicated', title: '📚 Dedicated', desc: 'Play Practice Mode for a cumulative 30 minutes', rewardCoins: 50, rewardXp: 0 }
];

export default function MemoryMatrixGame({ onBack, t: tFunc, soundEnabled: globalSound, darkMode, user }) {
  // Navigation active tab: 'home' | 'practice' (Mode Select) | 'stats' | 'settings'
  const [activeTab, setActiveTab] = useState('home');

  // Sound and Vibrate states
  const [sound, setSound] = useState(() => {
    const saved = localStorage.getItem('cp_matrix_sound');
    return saved !== null ? saved === 'true' : globalSound;
  });
  const [vibrate, setVibrate] = useState(() => {
    const saved = localStorage.getItem('cp_matrix_vibrate');
    return saved !== null ? saved === 'true' : true;
  });

  // Flow State: 'home' | 'instructions' | 'countdown' | 'playing' | 'completed' | 'gameover'
  const [flow, setFlow] = useState('home');
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'memorize' | 'recall'
  const [selectedMode, setSelectedMode] = useState('real'); // 'real' | 'practice' | 'time_trial'
  
  // Real Mode Campaign Level Select configs
  const [campaignLevel, setCampaignLevel] = useState(1);
  const [campaignStars, setCampaignStars] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cp_matrix_stars') || '{}');
    } catch {
      return {};
    }
  });
  const [campaignCleared, setCampaignCleared] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cp_matrix_cleared') || '[]');
    } catch {
      return [];
    }
  });

  // Practice Configs
  const [practiceTier, setPracticeTier] = useState('Heroic'); // 'Heroic' (1-10) | 'Master' (11-20) | 'Grand Master' (21-30)
  const [practiceAccTaps, setPracticeAccTaps] = useState(0);
  const [practiceAccCorrect, setPracticeAccCorrect] = useState(0);

  // Time Trial Configs
  const [timeTrialTier, setTimeTrialTier] = useState('Heroic'); // 'Heroic' | 'Master' | 'Grand Master'
  const [timeTrialPBs, setTimeTrialPBs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cp_matrix_tt_pb') || '{}');
    } catch {
      return {};
    }
  });
  const [ttPBBeats, setTtPBBeats] = useState(() => parseInt(localStorage.getItem('cp_matrix_tt_pb_beats') || '0', 10));
  const [ttCompletedTiers, setTtCompletedTiers] = useState(new Set()); // Tracks session completed tiers for Marathoner
  const [timeTrialStopwatch, setTimeTrialStopwatch] = useState(0);
  const [timeTrialPenalties, setTimeTrialPenalties] = useState(0);

  // Level-specific round parameters
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [comboStreak, setComboStreak] = useState(() => parseInt(localStorage.getItem('cp_matrix_combo_streak') || '0', 10));
  const [hadMissInLevel, setHadMissInLevel] = useState(false);
  const [wrongTapsInLevel, setWrongTapsInLevel] = useState(0);

  // Grid details
  const [gridSize, setGridSize] = useState(3);
  const [highlightedTiles, setHighlightedTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [failedTile, setFailedTile] = useState(null);
  const [shakeGrid, setShakeGrid] = useState(false);

  // Economy & Progression resource states
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem('cp_coins') || '350', 10));
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('cp_xp') || '527', 10));
  const [refillsCount, setRefillsCount] = useState(() => parseInt(localStorage.getItem('cp_matrix_refills_count') || '0', 10));
  const [practiceSeconds, setPracticeSeconds] = useState(() => parseInt(localStorage.getItem('cp_matrix_practice_seconds') || '0', 10));

  // Life refills tracking within attempt
  const [refillsUsedInAttempt, setRefillsUsedInAttempt] = useState(0);
  const [showRefillPrompt, setShowRefillPrompt] = useState(false);

  // Achievements Unlocks tracking
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cp_matrix_ach') || '{}');
    } catch {
      return {};
    }
  });

  // Level fail/checkpoint tracking
  const [previouslyFailedLevels, setPreviouslyFailedLevels] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cp_matrix_prev_failed') || '{}');
    } catch {
      return {};
    }
  });
  const [consecutiveCleanClears, setConsecutiveCleanClears] = useState(() => {
    return parseInt(localStorage.getItem('cp_matrix_consecutive_clears') || '0', 10);
  });
  const [fastestClears, setFastestClears] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cp_matrix_fastest_clears') || '{}');
    } catch {
      return {};
    }
  });

  // Attempt statistics (temporarily kept round by round)
  const [roundStats, setRoundStats] = useState([]); // Array of { round, accuracy, speed }
  
  // Custom timers
  const [countdown, setCountdown] = useState(3);
  const [showPause, setShowPause] = useState(false);
  const [showPauseSettings, setShowPauseSettings] = useState(false);

  // Custom hardware back button handler to pause the game
  useBackHandler(() => {
    if (showPause) {
      setShowPause(false);
      setShowPauseSettings(false);
    } else {
      setShowPause(true);
    }
  }, flow === 'playing' || flow === 'countdown');

  const [triggerConfetti, setTriggerConfetti] = useState(false);
  const [achievementToast, setAchievementToast] = useState(null);

  // Refs for tracking reaction time and game state
  const levelStartTime = useRef(0);
  const roundStartTime = useRef(0);
  const practiceRoundActiveRef = useRef(false);
  const selectedTilesRef = useRef([]);
  const highlightedTilesRef = useRef([]);
  const handleTimeTrialRoundTimeoutRef = useRef();
  const handleTimeLimitExpiredRef = useRef();

  useEffect(() => {
    selectedTilesRef.current = selectedTiles;
  }, [selectedTiles]);

  useEffect(() => {
    highlightedTilesRef.current = highlightedTiles;
  }, [highlightedTiles]);

  useEffect(() => {
    handleTimeTrialRoundTimeoutRef.current = handleTimeTrialRoundTimeout;
    handleTimeLimitExpiredRef.current = handleTimeLimitExpired;
  });

  // Inject styles on mount
  useEffect(() => {
    const id = 'matrix-game-single-build-styles';
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    style.textContent = CSS_ANIMATIONS;
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('cp_matrix_sound', String(sound));
  }, [sound]);

  useEffect(() => {
    localStorage.setItem('cp_matrix_vibrate', String(vibrate));
  }, [vibrate]);

  // Vibrate
  const triggerHaptic = (ms = 50) => {
    if (vibrate && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  // Toast auto-closer
  useEffect(() => {
    if (achievementToast) {
      const timer = setTimeout(() => setAchievementToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [achievementToast]);

  // Dedicated achievement timer accumulator
  useEffect(() => {
    let practiceInterval;
    if (flow === 'playing' && selectedMode === 'practice') {
      practiceRoundActiveRef.current = (gameState === 'memorize' || gameState === 'recall') && !showPause;
      
      practiceInterval = setInterval(() => {
        if (practiceRoundActiveRef.current) {
          setPracticeSeconds(prev => {
            const nextSec = prev + 1;
            localStorage.setItem('cp_matrix_practice_seconds', String(nextSec));
            
            // Dedicated Achievement Check (30 minutes = 1800 seconds)
            if (nextSec >= 1800 && !unlockedAchievements.dedicated) {
              triggerAchievementUnlock('dedicated');
            }
            return nextSec;
          });
        }
      }, 1000);
    }
    return () => clearInterval(practiceInterval);
  }, [flow, selectedMode, gameState, showPause, unlockedAchievements]);

  // Time Trial Stopwatch and countdown ticks
  useEffect(() => {
    let timerInterval;
    if (flow === 'playing') {
      if (selectedMode === 'time_trial') {
        // Time Trial: tick stopwatch UP and tick timeLeft DOWN
        timerInterval = setInterval(() => {
          if (!showPause) {
            setTimeTrialStopwatch(prev => prev + 1);
            setTimeLeft(prev => {
              if (prev <= 1) {
                if (handleTimeTrialRoundTimeoutRef.current) {
                  handleTimeTrialRoundTimeoutRef.current();
                }
                return 0;
              }
              return prev - 1;
            });
          }
        }, 1000);
      } else {
        // Countdown timer for Real Mode & Practice Mode (both tick down)
        timerInterval = setInterval(() => {
          if (!showPause) {
            setTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(timerInterval);
                if (handleTimeLimitExpiredRef.current) {
                  handleTimeLimitExpiredRef.current();
                }
                return 0;
              }
              return prev - 1;
            });
          }
        }, 1000);
      }
    }
    return () => clearInterval(timerInterval);
  }, [flow, selectedMode, showPause]);

  // 3-2-1 Countdown Loop
  useEffect(() => {
    if (flow === 'countdown') {
      if (countdown > 0) {
        playAudioTone('tick', sound);
        const timer = setTimeout(() => setCountdown(countdown - 1), 800);
        return () => clearTimeout(timer);
      } else {
        setFlow('playing');
        setGameState('memorize');
        roundStartTime.current = Date.now();
      }
    }
  }, [flow, countdown, sound]);

  // Memorization Timer
  useEffect(() => {
    if (flow === 'playing' && gameState === 'memorize') {
      let duration = 3000;
      if (selectedMode === 'real' || selectedMode === 'practice') {
        const config = getLevelConfig(currentLevel);
        duration = config.displayTime * 1000;
      } else if (selectedMode === 'time_trial') {
        duration = (timeTrialTier === 'Heroic' ? 3.0 : timeTrialTier === 'Master' ? 4.5 : 6.0) * 1000;
      }

      const timeout = setTimeout(() => {
        setGameState('recall');
        levelStartTime.current = Date.now();
        roundStartTime.current = Date.now(); // reset round start time when recall begins
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [flow, gameState, selectedMode, currentLevel, timeTrialTier]);

  // Trigger Achievement unlock with animation, sound, and payouts
  const triggerAchievementUnlock = (id) => {
    const ach = ACHIEVEMENT_LIST.find(a => a.id === id);
    if (!ach || unlockedAchievements[id]) return;

    playAudioTone('complete', sound);
    const nextAch = { ...unlockedAchievements, [id]: new Date().toISOString() };
    setUnlockedAchievements(nextAch);
    localStorage.setItem('cp_matrix_ach', JSON.stringify(nextAch));

    // Award payouts
    const nextCoins = coins + ach.rewardCoins;
    const nextXp = xp + ach.rewardXp;
    setCoins(nextCoins);
    setXp(nextXp);
    localStorage.setItem('cp_coins', String(nextCoins));
    localStorage.setItem('cp_xp', String(nextXp));

    setAchievementToast({ title: ach.title, desc: ach.desc });
  };

  // Helper to get random campaign level in selected practice band
  const getRandomPracticeLevel = (band) => {
    if (band === 'Heroic') {
      return Math.floor(Math.random() * 10) + 1; // 1 to 10
    } else if (band === 'Master') {
      return Math.floor(Math.random() * 10) + 11; // 11 to 20
    } else {
      return Math.floor(Math.random() * 10) + 21; // 21 to 30
    }
  };

  // Start Level Routine
  const startLevelRoutine = (lvl, rnd) => {
    const config = getLevelConfig(lvl);
    setSelectedTiles([]);
    setFailedTile(null);
    setFlow('countdown');
    setCountdown(3);

    // Grid details
    setGridSize(config.size);
    
    // Pattern count is fixed per level config
    const tileCount = config.tiles;

    const pattern = generatePattern(config.size, tileCount, highlightedTiles);
    setHighlightedTiles(pattern);

    // Preset time limits
    if (selectedMode === 'real') {
      setTimeLeft(config.timeLimit);
    } else if (selectedMode === 'practice') {
      setTimeLeft(Math.round(config.timeLimit * 1.25)); // 1.25x time limit
    }
  };

  // Start Time Trial Mode Routine
  const startTimeTrialRoutine = (tier, rnd) => {
    setSelectedTiles([]);
    setFailedTile(null);
    setFlow('countdown');
    setCountdown(3);

    const size = tier === 'Heroic' ? 5 : tier === 'Master' ? 6 : 7;
    setGridSize(size);

    const patterns = TIME_TRIAL_PATTERNS[tier === 'Heroic' ? 'Heroic' : tier === 'Master' ? 'Master' : 'GrandMaster'];
    setHighlightedTiles(patterns[rnd - 1]);

    // Reset round countdown limit
    setTimeLeft(tier === 'Heroic' ? 20 : tier === 'Master' ? 18 : 15);
  };

  // Click handler to initiate selected mode gameplay from instructions screen
  const handlePlayNow = () => {
    setRefillsUsedInAttempt(0);
    setRoundStats([]);
    setHadMissInLevel(false);
    setWrongTapsInLevel(0);

    if (selectedMode === 'real') {
      const config = getLevelConfig(campaignLevel);
      setCurrentLevel(campaignLevel);
      setCurrentRound(1);
      setLives(config.lives);
      startLevelRoutine(campaignLevel, 1);
    } else if (selectedMode === 'practice') {
      setCurrentRound(1);
      setPracticeAccTaps(0);
      setPracticeAccCorrect(0);
      const matchLvl = getRandomPracticeLevel(practiceTier);
      setCurrentLevel(matchLvl);
      startLevelRoutine(matchLvl, 1);
    } else if (selectedMode === 'time_trial') {
      setCurrentRound(1);
      setTimeLeft(timeTrialTier === 'Heroic' ? 20 : timeTrialTier === 'Master' ? 18 : 15); // countdown ticks down
      setTimeTrialStopwatch(0);
      setTimeTrialPenalties(0);
      startTimeTrialRoutine(timeTrialTier, 1);
    }
  };

  const handleRestart = () => {
    setShowPause(false);
    setShowPauseSettings(false);
    setRefillsUsedInAttempt(0);
    setRoundStats([]);
    setHadMissInLevel(false);
    setWrongTapsInLevel(0);

    if (selectedMode === 'real') {
      const config = getLevelConfig(campaignLevel);
      setCurrentLevel(campaignLevel);
      setCurrentRound(1);
      setLives(config.lives);
      startLevelRoutine(campaignLevel, 1);
    } else if (selectedMode === 'practice') {
      setCurrentRound(1);
      setPracticeAccTaps(0);
      setPracticeAccCorrect(0);
      const matchLvl = getRandomPracticeLevel(practiceTier);
      setCurrentLevel(matchLvl);
      startLevelRoutine(matchLvl, 1);
    } else if (selectedMode === 'time_trial') {
      setCurrentRound(1);
      setTimeLeft(timeTrialTier === 'Heroic' ? 20 : timeTrialTier === 'Master' ? 18 : 15);
      setTimeTrialStopwatch(0);
      setTimeTrialPenalties(0);
      setScore(0);
      startTimeTrialRoutine(timeTrialTier, 1);
    }
  };


  // Round Complete handling for Real Mode (Single-Round per level)
  const handleRealModeRoundComplete = (nextSelected, roundDuration) => {
    const config = getLevelConfig(currentLevel);
    
    // Store stats for stars calculation (correct / total taps)
    const accuracy = highlightedTiles.length / (highlightedTiles.length + wrongTapsInLevel);
    const speed = Math.max(0, (config.timeLimit - roundDuration / 1000) / config.timeLimit);
    
    const newStats = [{ round: 1, accuracy, speed }];
    setRoundStats(newStats);

    // Update level combo streak (zero misses in the level)
    let nextCombo = 0;
    if (!hadMissInLevel) {
      nextCombo = comboStreak + 1;
      setComboStreak(nextCombo);
      localStorage.setItem('cp_matrix_combo_streak', String(nextCombo));

      // Record fastest clear time for flawless run
      const clearTimeSec = parseFloat((roundDuration / 1000).toFixed(2));
      const currentBest = fastestClears[currentLevel];
      if (currentBest === undefined || clearTimeSec < currentBest) {
        const nextBest = { ...fastestClears, [currentLevel]: clearTimeSec };
        setFastestClears(nextBest);
        localStorage.setItem('cp_matrix_fastest_clears', JSON.stringify(nextBest));
      }
      
      // Trigger Sharp Eye achievement (10-level combo streak)
      if (nextCombo >= 10 && !unlockedAchievements.sharp_eye) {
        triggerAchievementUnlock('sharp_eye');
      }
    } else {
      setComboStreak(0);
      localStorage.setItem('cp_matrix_combo_streak', '0');
    }

    // LEVEL CLEARED (Single round resolves pass/fail immediately)
    handleRealModeLevelCleared(newStats, nextCombo);
  };

  // Real Mode Level Cleared
  const handleRealModeLevelCleared = (finalStats, finalCombo) => {
    const config = getLevelConfig(currentLevel);
    
    // 1. Accuracy and Speed averages
    const avgAccuracy = finalStats.reduce((acc, rs) => acc + rs.accuracy, 0) / finalStats.length;
    const avgSpeed = finalStats.reduce((acc, rs) => acc + rs.speed, 0) / finalStats.length;

    // 2. Stars Earned
    const starsEarned = calculateLevelStars(config.tier, avgAccuracy, avgSpeed);

    // 3. XP Payout
    const xpPayout = calculateXpEarned(config.minTiles);

    // 4. Coins Payout
    const coinsPayout = calculateCoinsEarned(config.tier, starsEarned, finalCombo);
    
    // 5. First clear check
    const isFirstClear = !campaignCleared.includes(currentLevel);
    const totalCoinsGained = coinsPayout + (isFirstClear ? 15 : 0);

    // Add Resources
    const nextCoins = coins + totalCoinsGained;
    const nextXp = xp + xpPayout;
    setCoins(nextCoins);
    setXp(nextXp);
    localStorage.setItem('cp_coins', String(nextCoins));
    localStorage.setItem('cp_xp', String(nextXp));

    // Save level status
    const nextCleared = isFirstClear ? [...campaignCleared, currentLevel] : campaignCleared;
    const nextStars = { ...campaignStars, [currentLevel]: Math.max(campaignStars[currentLevel] || 0, starsEarned) };
    
    setCampaignCleared(nextCleared);
    setCampaignStars(nextStars);
    localStorage.setItem('cp_matrix_cleared', JSON.stringify(nextCleared));
    localStorage.setItem('cp_matrix_stars', JSON.stringify(nextStars));

    // Combo streak counters for consecutive cleans
    let nextCleanClears = consecutiveCleanClears;
    if (starsEarned === 3 && !hadMissInLevel) {
      nextCleanClears += 1;
    } else {
      nextCleanClears = 0;
    }
    setConsecutiveCleanClears(nextCleanClears);
    localStorage.setItem('cp_matrix_consecutive_clears', String(nextCleanClears));

    // Sync cloud metrics
    setSelectedTiles([]);
    setFailedTile(null);
    setTriggerConfetti(true);
    playAudioTone('correct', sound);

    setTimeout(() => {
      setTriggerConfetti(false);
      setFlow('completed');
      
      // Perform Achievements Checks
      runPostLevelAchievementsCheck(nextCleared, nextStars, nextCleanClears);
    }, 1500);
  };

  // Run post-level achievements verification
  const runPostLevelAchievementsCheck = (cleared, stars, cleanClearsCount) => {
    // 1. First Steps
    if (cleared.includes(1) && !unlockedAchievements.first_steps) {
      triggerAchievementUnlock('first_steps');
    }

    // 2. Chapter 1 Champion (1-10 cleared)
    const allHeroicCleared = Array.from({ length: 10 }, (_, i) => i + 1).every(lvl => cleared.includes(lvl));
    if (allHeroicCleared && !unlockedAchievements.heroic_champ) {
      triggerAchievementUnlock('heroic_champ');
    }

    // 3. Chapter 2 Champion (11-20 cleared)
    const allMasterCleared = Array.from({ length: 10 }, (_, i) => i + 11).every(lvl => cleared.includes(lvl));
    if (allMasterCleared && !unlockedAchievements.master_champ) {
      triggerAchievementUnlock('master_champ');
    }

    // 4. Grand Master (30 cleared)
    if (cleared.includes(30) && !unlockedAchievements.grand_master) {
      triggerAchievementUnlock('grand_master');
    }

    // 5. Flawless Five
    if (cleanClearsCount >= 5 && !unlockedAchievements.flawless_five) {
      triggerAchievementUnlock('flawless_five');
    }

    // 6. Perfectionist: Chapter 1 (all 10 levels have 3 stars)
    const allHeroicThreeStars = Array.from({ length: 10 }, (_, i) => i + 1).every(lvl => stars[lvl] === 3);
    if (allHeroicThreeStars && !unlockedAchievements.perfectionist_heroic) {
      triggerAchievementUnlock('perfectionist_heroic');
    }

    // 7. Perfectionist: Chapter 2 (11-20 have 3 stars)
    const allMasterThreeStars = Array.from({ length: 10 }, (_, i) => i + 11).every(lvl => stars[lvl] === 3);
    if (allMasterThreeStars && !unlockedAchievements.perfectionist_master) {
      triggerAchievementUnlock('perfectionist_master');
    }

    // 8. Perfectionist: Chapter 3 (21-30 have 3 stars)
    const allGmThreeStars = Array.from({ length: 10 }, (_, i) => i + 21).every(lvl => stars[lvl] === 3);
    if (allGmThreeStars && !unlockedAchievements.perfectionist_gm) {
      triggerAchievementUnlock('perfectionist_gm');
    }

    // 9. Comeback Check
    if (previouslyFailedLevels[currentLevel] && !unlockedAchievements.comeback) {
      triggerAchievementUnlock('comeback');
      // Clear comeback trigger flag for this level
      const nextFailed = { ...previouslyFailedLevels };
      delete nextFailed[currentLevel];
      setPreviouslyFailedLevels(nextFailed);
      localStorage.setItem('cp_matrix_prev_failed', JSON.stringify(nextFailed));
    }

    // 10. No Regrets (Clear all 30 levels with 0 refills purchased)
    if (cleared.includes(30) && refillsCount === 0 && !unlockedAchievements.no_regrets) {
      triggerAchievementUnlock('no_regrets');
    }
  };

  // Check Time Trial Completed results
  const handleTimeTrialComplete = () => {
    playAudioTone('complete', sound);
    
    // Final score is total seconds elapsed
    const finalScoreTime = timeTrialStopwatch;
    const personalBest = timeTrialPBs[timeTrialTier];
    const isNewPB = personalBest === undefined || finalScoreTime < personalBest;

    let nextBeats = ttPBBeats;
    if (isNewPB) {
      nextBeats += 1;
      setTtPBBeats(nextBeats);
      localStorage.setItem('cp_matrix_tt_pb_beats', String(nextBeats));

      const nextPBs = { ...timeTrialPBs, [timeTrialTier]: finalScoreTime };
      setTimeTrialPBs(nextPBs);
      localStorage.setItem('cp_matrix_tt_pb', JSON.stringify(nextPBs));
    }

    // Session completion check for Marathoner achievement
    const nextCompletedTiers = new Set(ttCompletedTiers).add(timeTrialTier);
    setTtCompletedTiers(nextCompletedTiers);

    // Save final score to timeLeft state so it renders correctly on the gameover screen
    setTimeLeft(finalScoreTime);

    setFlow('gameover');

    // Time Trial Achievements checks
    // 1. Speed Demon (beat PB 5 times total)
    if (nextBeats >= 5 && !unlockedAchievements.speed_demon) {
      triggerAchievementUnlock('speed_demon');
    }

    // 2. Marathoner (Heroic, Master, GM in one sitting)
    if (nextCompletedTiers.has('Heroic') && nextCompletedTiers.has('Master') && nextCompletedTiers.has('Grand Master') && !unlockedAchievements.marathoner) {
      triggerAchievementUnlock('marathoner');
    }
  };

  // Triggered when time runs out on Real Mode or Practice Mode
  const handleTimeLimitExpired = () => {
    triggerHaptic(250);
    setShakeGrid(true);
    playAudioTone('wrong', sound);

    setTimeout(() => {
      setShakeGrid(false);
      if (selectedMode === 'practice') {
        triggerPracticeModeNextRep(false);
      } else {
        handleIncorrectMatchAttempt();
      }
    }, 800);
  };

  // Triggered when time runs out in Time Trial Mode
  const handleTimeTrialRoundTimeout = () => {
    playAudioTone('wrong', sound);
    triggerHaptic(250);
    setShakeGrid(true);

    const untapped = highlightedTilesRef.current.filter(idx => !selectedTilesRef.current.includes(idx)).length;
    const penalty = untapped * 3;

    if (penalty > 0) {
      setTimeTrialStopwatch(prev => prev + penalty);
      setTimeTrialPenalties(prev => prev + penalty);
    }

    setGameState('idle'); // Missed tiles feedback

    setTimeout(() => {
      setShakeGrid(false);
      if (currentRound < 10) {
        const nextRnd = currentRound + 1;
        setCurrentRound(nextRnd);
        startTimeTrialRoutine(timeTrialTier, nextRnd);
      } else {
        handleTimeTrialComplete();
      }
    }, 1200);
  };

  // Deduction of lives or showing refills popup
  const handleIncorrectMatchAttempt = () => {
    setHadMissInLevel(true);
    setWrongTapsInLevel(prev => prev + 1);
    if (lives > 1) {
      setLives(prev => prev - 1);
      setSelectedTiles([]);
      setFailedTile(null);
      roundStartTime.current = Date.now();
    } else {
      // 0 Lives remaining
      if (refillsUsedInAttempt < 3 && coins >= 50) {
        // Prompt for Coin life refill
        setShowRefillPrompt(true);
      } else {
        // Fail level attempt
        handleLevelFailedOutright();
      }
    }
  };

  // Outright fail level attempt
  const handleLevelFailedOutright = () => {
    setLives(0);
    setComboStreak(0);
    localStorage.setItem('cp_matrix_combo_streak', '0');
    setFlow('gameover');
    playAudioTone('gameover', sound);

    // Save previous fail flag for comeback achievement trigger
    const nextFailed = { ...previouslyFailedLevels, [currentLevel]: true };
    setPreviouslyFailedLevels(nextFailed);
    localStorage.setItem('cp_matrix_prev_failed', JSON.stringify(nextFailed));
  };

  // Mid-attempt life refill action (offline flat cost 50 coins)
  const handleRefillLives = () => {
    if (coins >= 50 && refillsUsedInAttempt < 3) {
      const nextCoins = coins - 50;
      const nextRefillsTotal = refillsCount + 1;
      
      setCoins(nextCoins);
      setRefillsUsedInAttempt(prev => prev + 1);
      setRefillsCount(nextRefillsTotal);
      localStorage.setItem('cp_coins', String(nextCoins));
      localStorage.setItem('cp_matrix_refills_count', String(nextRefillsTotal));

      setLives(1);
      setShowRefillPrompt(false);
      setSelectedTiles([]);
      setFailedTile(null);
      roundStartTime.current = Date.now();
    }
  };

  // Decline Refill -> fail level
  const handleDeclineRefill = () => {
    setShowRefillPrompt(false);
    handleLevelFailedOutright();
  };

  // Practice Mode feedback timer and reshuffle
  const triggerPracticeModeNextRep = (success = true) => {
    // Show correct tiles briefly
    setGameState('idle');
    triggerHaptic(success ? 40 : 150);

    setTimeout(() => {
      // Reshuffle Practice level config from band
      const matchLvl = getRandomPracticeLevel(practiceTier);
      setCurrentLevel(matchLvl);
      startLevelRoutine(matchLvl, 1);
      setGameState('memorize');
    }, 1200);
  };

  // Core tile click handler
  const handleTileSelect = (idx) => {
    if (flow !== 'playing' || gameState !== 'recall' || showPause) return;
    if (failedTile !== null || selectedTiles.length === highlightedTiles.length) return;
    if (selectedTiles.includes(idx) || failedTile === idx) return;

    // Track active tap counts
    if (selectedMode === 'practice') {
      setPracticeAccTaps(prev => prev + 1);
    }

    playAudioTone('tap', sound);

    if (highlightedTiles.includes(idx)) {
      // Correct Tap
      if (selectedMode === 'practice') {
        setPracticeAccCorrect(prev => prev + 1);
      }

      const nextSelected = [...selectedTiles, idx];
      setSelectedTiles(nextSelected);
      triggerHaptic(40);

      // Round complete check
      if (nextSelected.length === highlightedTiles.length) {
        playAudioTone('correct', sound);
        const duration = Date.now() - roundStartTime.current;

        if (selectedMode === 'real') {
          handleRealModeRoundComplete(nextSelected, duration);
        } else if (selectedMode === 'practice') {
          triggerPracticeModeNextRep(true);
        } else if (selectedMode === 'time_trial') {
          // Time Trial has 10 fixed rounds
          if (currentRound < 10) {
            const nextRnd = currentRound + 1;
            setCurrentRound(nextRnd);
            setTimeout(() => {
              startTimeTrialRoutine(timeTrialTier, nextRnd);
            }, 1200);
          } else {
            handleTimeTrialComplete();
          }
        }
      }
    } else {
      // Wrong Tap
      setFailedTile(idx);
      triggerHaptic(180);
      setShakeGrid(true);
      playAudioTone('wrong', sound);

      setTimeout(() => {
        setShakeGrid(false);

        if (selectedMode === 'real') {
          handleIncorrectMatchAttempt();
        } else if (selectedMode === 'practice') {
          triggerPracticeModeNextRep(false);
        } else if (selectedMode === 'time_trial') {
          // Time Trial adds +3 second penalty per wrong tap
          setTimeTrialStopwatch(prev => prev + 3);
          setTimeTrialPenalties(prev => prev + 3);
          setFailedTile(null);
          // Let player continue selection
        }
      }, 1000);
    }
  };

  const getAccuracy = () => {
    if (selectedMode === 'practice') {
      return practiceAccTaps > 0 ? Math.round((practiceAccCorrect / practiceAccTaps) * 100) : 100;
    }
    return 100;
  };

  const isTimeTrialUnlocked = campaignCleared.includes(30);

  return (
    <div className="memory-matrix-theme fade-in-section" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {triggerConfetti && <ConfettiManager />}

      {/* FLOATING TOAST UNLOCKS */}
      {achievementToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          width: 'calc(100% - 40px)',
          maxWidth: '400px',
          background: 'linear-gradient(135deg, #FAF9F5, #FFFFFF)',
          border: '2px solid var(--color-accent)',
          borderRadius: '16px',
          padding: '12px 18px',
          boxShadow: '0 10px 30px rgba(225, 166, 60, 0.25)',
          animation: 'slide-toast-in 0.4s ease-out',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '28px' }}>🏆</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase' }}>Achievement Unlocked!</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)' }}>{achievementToast.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>{achievementToast.desc}</div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: '#FFFFFF',
        borderBottom: '1.5px solid var(--border-color)',
        zIndex: 50,
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '15px',
            border: '2px solid var(--color-primary)',
            color: 'var(--color-primary)'
          }}>
            {user?.displayName?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-main)' }}>{user?.displayName || 'Sai'}</div>
            <div style={{
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              borderRadius: '20px',
              fontSize: '9px',
              fontWeight: 800,
              padding: '1px 6px',
              display: 'inline-block'
            }}>Campaign cleared: {campaignCleared.length} / 30</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Coins Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#FFF8E7',
            border: '1.5px solid #F0D597',
            padding: '3px 8px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--color-accent)'
          }}>
            <span>🪙</span>
            <span>{coins}</span>
          </div>

          {/* XP Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#F0F5F9',
            border: '1.5px solid #C4D7E6',
            padding: '3px 8px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#4A90E2'
          }}>
            <span>⭐</span>
            <span>{xp} XP</span>
          </div>

          {/* Close back */}
          <button 
            onClick={onBack} 
            className="matrix-btn-scale"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--border-color)',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <CloseSVG size={16} />
          </button>
        </div>
      </div>

      {/* MAIN SCREEN AREA */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: flow === 'home' ? '20px 20px 100px 20px' : '24px 20px',
        position: 'relative'
      }}>
        {flow === 'home' && (
          <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* TAB 1: HOME */}
            {activeTab === 'home' && (
              <>
                <div style={{ textAlign: 'center', margin: '10px 0' }}>
                  <BrainLogoSVG />
                  <h1 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit', margin: '8px 0 2px 0' }}>
                    MEMORY MATRIX
                  </h1>
                  <p style={{ color: 'var(--text-sub)', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                    Train Spatial Memory Configurations
                  </p>
                </div>

                {/* MODE 1: Real Campaign Mode Card */}
                <div className="matrix-theme-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>🛡️ Real Mode</h3>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)' }}>Lvl {campaignCleared.length + 1 <= 30 ? campaignCleared.length + 1 : 30} / 30</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-sub)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                    Climb all 30 levels, earn stars, coins, and XP.
                  </p>
                  <div style={{ height: '8px', background: 'var(--color-primary-light)', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{ width: `${(campaignCleared.length / 30) * 100}%`, height: '100%', background: 'var(--color-primary)' }} />
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedMode('real');
                      setFlow('instructions');
                    }}
                    className="matrix-btn-scale"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '16px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #5A9E66, #4B7E58)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    CONTINUE CAMPAIGN (Lvl {campaignCleared.length + 1 <= 30 ? campaignCleared.length + 1 : 30}) ➔
                  </button>
                </div>

                {/* MODE 2: Practice Mode Card */}
                <div className="matrix-theme-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>🏋️ Practice Mode</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-sub)', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                    Risk-free training, no lives, no penalties.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedMode('practice');
                      setFlow('instructions');
                    }}
                    className="matrix-btn-scale"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '16px',
                      border: '1.5px solid var(--color-primary)',
                      background: '#FFFFFF',
                      color: 'var(--color-primary)',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    START PRACTICE ➔
                  </button>
                </div>

                {/* MODE 3: Time Trial Mode Card */}
                <div className="matrix-theme-card" style={{ padding: '20px', opacity: isTimeTrialUnlocked ? 1 : 0.75 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>⏱️ Time Trial Mode</h3>
                    {!isTimeTrialUnlocked && (
                      <span style={{ fontSize: '9px', background: '#D26E6E', color: '#FFF', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                        LOCKED (Lvl 30)
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-sub)', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                    Race a fixed pattern set for your best time.
                  </p>
                  <button
                    disabled={!isTimeTrialUnlocked}
                    onClick={() => {
                      setSelectedMode('time_trial');
                      setFlow('instructions');
                    }}
                    className="matrix-btn-scale"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '16px',
                      border: 'none',
                      background: isTimeTrialUnlocked ? 'var(--color-accent)' : '#E2E7E2',
                      color: isTimeTrialUnlocked ? '#FFFFFF' : 'var(--text-sub)',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: isTimeTrialUnlocked ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {isTimeTrialUnlocked ? 'START TIME TRIAL ➔' : 'LOCKED UNTIL LEVEL 30'}
                  </button>
                </div>

                {/* Stars/Stats summary */}
                <div className="matrix-theme-card" style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>Profile Statistics</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Campaign Stars</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-accent)', marginTop: '4px' }}>
                        ⭐ {Object.values(campaignStars).reduce((acc, val) => acc + val, 0)}
                      </div>
                    </div>
                    <div style={{ width: '1px', background: 'var(--border-color)' }} />
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Chapters unlocked</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)', marginTop: '4px' }}>
                        {campaignCleared.length >= 20 ? '3 / 3' : campaignCleared.length >= 10 ? '2 / 3' : '1 / 3'}
                      </div>
                    </div>
                    <div style={{ width: '1px', background: 'var(--border-color)' }} />
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Time Trial PBs</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)', marginTop: '4px' }}>
                        ⏱️ {Object.keys(timeTrialPBs).length}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 3: STATS & ACHIEVEMENTS */}
            {activeTab === 'stats' && (
              <>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>Achievements Unlocked</h3>

                {/* Achievements List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ACHIEVEMENT_LIST.map((ach) => {
                    const isUnlocked = !!unlockedAchievements[ach.id];
                    let progressString = '';
                    
                    if (ach.id === 'speed_demon') {
                      progressString = `(${ttPBBeats} / 5)`;
                    } else if (ach.id === 'dedicated') {
                      progressString = `(${Math.round(practiceSeconds / 60)} / 30 mins)`;
                    }

                    return (
                      <div key={ach.id} className="matrix-theme-card" style={{
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: isUnlocked ? 'var(--color-primary-light)' : '#FFFFFF',
                        border: '1.5px solid ' + (isUnlocked ? 'var(--color-primary)' : 'var(--border-color)')
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800 }}>{ach.title}</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>{progressString}</span>
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-sub)', marginTop: '2px' }}>{ach.desc}</div>
                          <div style={{ fontSize: '9px', color: 'var(--color-accent)', fontWeight: 800, marginTop: '2px' }}>
                            Reward: +{ach.rewardCoins} 🪙 {ach.rewardXp > 0 ? `+${ach.rewardXp} XP` : ''}
                          </div>
                        </div>
                        
                        <div style={{ fontSize: '10px', fontWeight: 800, color: isUnlocked ? 'var(--color-primary)' : 'var(--text-sub)' }}>
                          {isUnlocked ? '🏆 UNLOCKED' : '🔒 LOCKED'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* TAB 4: SETTINGS */}
            {activeTab === 'settings' && (
              <>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>System Settings</h3>

                <div className="matrix-theme-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800 }}>🔊 Audio Feedback</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Synthesizer sound waves on tap</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={sound}
                      onChange={(e) => setSound(e.target.checked)}
                      style={{ width: '42px', height: '22px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                    />
                  </div>

                  <div style={{ width: '100%', height: '1px', background: 'var(--border-color)' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800 }}>📳 Haptic Vibrate</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Vibration feedbacks on click</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={vibrate}
                      onChange={(e) => setVibrate(e.target.checked)}
                      style={{ width: '42px', height: '22px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                    />
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {/* INSTRUCTIONS SCREEN */}
        {flow === 'instructions' && (
          <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 10 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={() => setFlow('home')}
                className="matrix-btn-scale"
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1.5px solid var(--border-color)', background: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                ◀
              </button>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Instructions</h2>
              <div style={{ width: '36px' }} />
            </div>

            {/* Mode-specific detail card */}
            <div className="matrix-theme-card" style={{ padding: '22px' }}>
              {selectedMode === 'real' && (() => {
                const config = getLevelConfig(campaignLevel);
                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)', margin: 0 }}>🛡️ Real Mode Campaign</h3>
                      <span style={{ fontSize: '11px', background: 'var(--color-accent)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>REAL</span>
                    </div>
                    
                    {/* Level select shortcuts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-sub)' }}>SELECT LEVEL</label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button 
                          disabled={campaignLevel <= 1}
                          onClick={() => setCampaignLevel(prev => prev - 1)}
                          style={{ padding: '8px 14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: '#FFF', cursor: 'pointer', fontWeight: 800 }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={Math.min(30, campaignCleared.length + 1)}
                          value={campaignLevel}
                          onChange={(e) => {
                            const val = Math.max(1, Math.min(30, Math.min(campaignCleared.length + 1, parseInt(e.target.value, 10) || 1)));
                            setCampaignLevel(val);
                          }}
                          style={{
                            flex: 1, padding: '8px', border: '1.5px solid var(--border-color)',
                            borderRadius: '10px', textAlign: 'center', fontWeight: 800, fontSize: '14px'
                          }}
                        />
                        <button
                          disabled={campaignLevel >= Math.min(30, campaignCleared.length + 1)}
                          onClick={() => setCampaignLevel(prev => prev + 1)}
                          style={{ padding: '8px 14px', borderRadius: '10px', border: '1.5px solid var(--border-color)', background: '#FFF', cursor: 'pointer', fontWeight: 800 }}
                        >
                          +
                        </button>
                      </div>

                      {/* Chapter Locks Display */}
                      <div style={{ fontSize: '11px', color: 'var(--text-sub)', fontStyle: 'italic', marginTop: '2px', textAlign: 'center', fontWeight: 700 }}>
                        {campaignLevel <= 10 ? '🟢 Chapter 1 (Lvl 1-10)' : campaignLevel <= 20 ? '🟡 Chapter 2 (Lvl 11-20)' : '🔴 Chapter 3 (Lvl 21-30)'}
                      </div>
                    </div>

                    {/* Level Details Grid */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px',
                      background: 'var(--bg-primary)', padding: '12px', borderRadius: '10px',
                      border: '1px solid var(--border-color)', marginBottom: '16px'
                    }}>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Grid Size</div>
                        <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-primary)' }}>{config.size} × {config.size}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Target Tiles</div>
                        <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--color-primary)' }}>{config.tiles} Tiles</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Initial Lives</div>
                        <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--accent-color, #E1A63C)' }}>{config.lives} {config.lives > 1 ? 'Lives' : 'Life'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Time Limit</div>
                        <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--accent-color, #E1A63C)' }}>{config.timeLimit}s</div>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-sub)', lineHeight: 1.5, margin: 0 }}>
                      👑 <strong>Economy:</strong> Earns Coins, XP, and Campaign Stars. Consumes attempts/lives. <br/>
                      🪙 <strong>Refills:</strong> Flat 50 🪙 per life refill (max 3 purchases per attempt).
                    </p>
                  </>
                );
              })()}

              {selectedMode === 'practice' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)', margin: 0 }}>🏋️ Practice Mode</h3>
                    <span style={{ fontSize: '11px', background: 'var(--color-accent)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>PRACTICE</span>
                  </div>
                  
                  {/* Select parameters */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-sub)', display: 'block', marginBottom: '6px' }}>SELECT PRACTICE BAND</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          { id: 'Heroic', label: 'Chapter 1 (Levels 1–10)', req: 0 },
                          { id: 'Master', label: 'Chapter 2 (Levels 11–20)', req: 10 },
                          { id: 'Grand Master', label: 'Chapter 3 (Levels 21–30)', req: 20 }
                        ].map(item => {
                          const isUnlocked = campaignCleared.length >= item.req;
                          return (
                            <button
                              key={item.id}
                              disabled={!isUnlocked}
                              onClick={() => setPracticeTier(item.id)}
                              style={{
                                width: '100%', padding: '12px', borderRadius: '12px',
                                border: '1.5px solid ' + (practiceTier === item.id ? 'var(--color-primary)' : 'var(--border-color)'),
                                background: practiceTier === item.id ? 'var(--color-primary-light)' : '#FFFFFF',
                                color: practiceTier === item.id ? 'var(--color-primary)' : 'var(--text-sub)',
                                fontWeight: 800, fontSize: '12px', cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                opacity: isUnlocked ? 1 : 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                              }}
                            >
                              <span>{item.label}</span>
                              {!isUnlocked && <span style={{ fontSize: '9px', background: '#D26E6E', color: '#FFF', padding: '2px 6px', borderRadius: '8px' }}>LOCKED (Lvl {item.req})</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-sub)', lineHeight: 1.5, margin: 0 }}>
                    🧠 <strong>Risk-Free:</strong> Infinite lives, no time limit penalties (timeouts reshuffle grid). <br/><br/>
                    ⏱️ <strong>Relaxed:</strong> Recall time limit is 1.25x of Real Mode config to aid spatial scanning. Missed tiles are highlighted in amber for 1.2s on fail.
                  </p>
                </>
              )}

              {selectedMode === 'time_trial' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)', margin: 0 }}>⏱️ Time Trial Mode</h3>
                    <span style={{ fontSize: '11px', background: 'var(--color-accent)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>TRIAL</span>
                  </div>

                  {/* Tier selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-sub)', display: 'block' }}>SELECT CHALLENGE TIER</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        { id: 'Heroic', label: 'Heroic (5x5)' },
                        { id: 'Master', label: 'Master (6x6)' },
                        { id: 'Grand Master', label: 'GM (7x7)' }
                      ].map(tier => (
                        <button
                          key={tier.id}
                          onClick={() => setTimeTrialTier(tier.id)}
                          style={{
                            flex: 1, padding: '10px 4px', borderRadius: '12px',
                            border: '1.5px solid ' + (timeTrialTier === tier.id ? 'var(--color-primary)' : 'var(--border-color)'),
                            background: timeTrialTier === tier.id ? 'var(--color-primary-light)' : '#FFFFFF',
                            color: timeTrialTier === tier.id ? 'var(--color-primary)' : 'var(--text-sub)',
                            fontWeight: 800, fontSize: '11px', cursor: 'pointer'
                          }}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-sub)', lineHeight: 1.5, margin: 0 }}>
                    🏁 <strong>10 Fixed Rounds:</strong> Race through 10 static, pre-defined spatial patterns. <br/><br/>
                    ⚠️ <strong>Penalties:</strong> +3s added to the total stopwatch time per wrong tap or per untapped tile on timeout. Lower time is better!
                  </p>
                </>
              )}
            </div>

            {/* Circular Green Play Now Button */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button
                onClick={handlePlayNow}
                className="matrix-pulse-play-btn"
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'linear-gradient(135deg, #5A9E66, #4B7E58)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: '0 8px 24px rgba(75, 126, 88, 0.3)'
                }}
              >
                PLAY NOW
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3.5: COUNTDOWN */}
        {flow === 'countdown' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', zIndex: 10 }}>
            <div style={{ fontSize: '80px', fontWeight: 900, color: 'var(--color-primary)', animation: 'matrix-pulse-glow 1s infinite' }}>
              {countdown === 0 ? 'GO!' : countdown}
            </div>
            <p style={{ color: 'var(--text-sub)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '10px' }}>
              RECONSTRUCTING TARGET MATRIX...
            </p>
          </div>
        )}

        {/* SCREEN 4: GAMEPLAY SCREEN */}
        {flow === 'playing' && (
          <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 10 }}>
            
            {/* Gameplay Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedMode === 'time_trial' ? (
                <>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>STOPWATCH</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-accent)' }}>⏱️ {timeTrialStopwatch}s</div>
                    {timeTrialPenalties > 0 && (
                      <div style={{ fontSize: '9px', fontWeight: 800, color: '#D26E6E', marginTop: '2px' }}>+{timeTrialPenalties}s Penalty</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>ROUND</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-main)' }}>{currentRound} / 10</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>ROUND TIMER</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-primary)' }}>⏳ {timeLeft}s</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>SCORE</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)' }}>{score}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>{gameState === 'recall' ? 'TIME LIMIT' : 'ROUND'}</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)' }}>
                      {gameState === 'recall' ? `⏳ ${timeLeft}s` : (selectedMode === 'practice' ? 'Practice' : `${currentRound} / ${getLevelConfig(currentLevel).rounds}`)}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => setShowPause(true)}
                      className="matrix-btn-scale"
                      style={{
                        background: '#FFFFFF', border: '1.5px solid var(--border-color)',
                        borderRadius: '12px', padding: '6px 14px', fontSize: '11px', fontWeight: 800, cursor: 'pointer'
                      }}
                    >
                      ⏸️ Pause
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Memorization Progress decay bar */}
            {gameState === 'memorize' && (
              <div style={{ background: '#EAF0EA', height: '6px', borderRadius: '3px', width: '100%', overflow: 'hidden' }}>
                <div style={{
                  background: 'var(--color-primary)', height: '100%',
                  animation: `matrix-progress-decay ${
                    (selectedMode === 'real' || selectedMode === 'practice')
                      ? getLevelConfig(currentLevel).displayTime * 1000
                      : (timeTrialTier === 'Heroic' ? 3.0 : timeTrialTier === 'Master' ? 4.5 : 6.0) * 1000
                  }ms linear forwards`
                }} />
              </div>
            )}

            {/* Instruction helper */}
            <div style={{
              padding: '10px 14px', textAlign: 'center', borderRadius: '14px',
              background: gameState === 'memorize' ? '#EBF5FC' : '#EAF4EC',
              border: '1px solid ' + (gameState === 'memorize' ? '#C2E0F4' : 'var(--border-color)')
            }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: gameState === 'memorize' ? '#2A82B9' : 'var(--color-primary)' }}>
                {gameState === 'memorize' ? '👀 Memorize highlighted patterns...' : '👇 Tap recalled locations'}
              </span>
            </div>

            {/* GRID */}
            <div 
              className={shakeGrid ? 'matrix-shake-active' : ''}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: gridSize > 5 ? '6px' : '10px',
                width: '100%',
                maxWidth: '380px',
                margin: '10px auto 0 auto',
                aspectRatio: '1/1'
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                const isHighlighted = highlightedTiles.includes(idx);
                const isSelected = selectedTiles.includes(idx);
                const isFailed = failedTile === idx;
                
                let bg = '#FFFFFF';
                let border = '2px solid var(--border-color)';
                let leafOpacity = 0.15;
                let leafColor = '#4B7E58';

                if (gameState === 'memorize' && isHighlighted) {
                  bg = 'var(--color-tile-active)';
                  border = 'none';
                  leafOpacity = 0.95;
                  leafColor = '#FFFFFF';
                } else if (isSelected) {
                  bg = 'var(--color-tile-success)';
                  border = 'none';
                  leafOpacity = 0.95;
                  leafColor = '#FFFFFF';
                } else if (isFailed) {
                  bg = 'var(--color-tile-failed)';
                  border = 'none';
                  leafOpacity = 0.95;
                  leafColor = '#FFFFFF';
                } else if (gameState === 'idle' && isHighlighted && !isSelected) {
                  bg = '#E1A63C'; // Amber for missed tiles
                  border = 'none';
                  leafOpacity = 0.95;
                  leafColor = '#FFFFFF';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleTileSelect(idx)}
                    className={gameState === 'memorize' && isHighlighted ? 'matrix-tile-memorize' : ''}
                    style={{
                      background: bg, border, borderRadius: '14px',
                      cursor: gameState === 'recall' ? 'pointer' : 'default',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSelected || isFailed ? 'scale(0.95)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <LeafTileSVG color={leafColor} opacity={leafOpacity} />
                  </div>
                );
              })}
            </div>

            {/* Lives / Accuracy Footer */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 18px', background: '#FFFFFF', border: '1.5px solid var(--border-color)',
              borderRadius: '16px', marginTop: '10px'
            }}>
              {selectedMode === 'practice' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 800 }}>
                  <span>🎯</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-primary)' }}>Accuracy: {getAccuracy()}%</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 800 }}>
                  <span>❤️</span>
                  <span style={{ fontSize: '14px' }}>{selectedMode === 'time_trial' ? '∞' : lives}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-sub)', fontWeight: 600, marginLeft: '2px' }}>
                    {selectedMode === 'time_trial' ? 'Unlimited' : 'Attempts remaining'}
                  </span>
                </div>
              )}

              {selectedMode === 'real' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 800, color: 'var(--color-accent)' }}>
                  <span>⚡</span>
                  <span>Streak</span>
                  <span style={{ background: '#FFF8E7', border: '1px solid #F0D597', borderRadius: '8px', padding: '1px 6px', fontSize: '10px', marginLeft: '2px' }}>
                    {comboStreak}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCREEN 5: LEVEL COMPLETED SCREEN */}
        {flow === 'completed' && (
          <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 10 }}>
            <div style={{ marginTop: '10px' }}>
              <TrophySVG />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit', margin: '0 0 4px 0' }}>
                Level Complete!
              </h2>
              <p style={{ color: 'var(--text-sub)', fontSize: '13px', fontWeight: 700, margin: 0 }}>
                You successfully cleared Level {currentLevel}
              </p>
            </div>

            {/* Stars rating display */}
            <div style={{ display: 'flex', gap: '8px', fontSize: '36px', color: 'var(--color-accent)' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} style={{ opacity: i < (roundStats.length > 0 ? calculateLevelStars(getLevelConfig(currentLevel).tier, roundStats.reduce((acc, rs) => acc + rs.accuracy, 0) / roundStats.length, roundStats.reduce((acc, rs) => acc + rs.speed, 0) / roundStats.length) : 0) ? 1 : 0.25 }}>
                  ★
                </span>
              ))}
            </div>

            {/* Rewards Card */}
            <div className="matrix-theme-card" style={{ width: '100%', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-sub)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Rewards Gained
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Coins */}
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  background: '#FFF8E7', border: '1.5px solid #F0D597', padding: '10px', borderRadius: '12px',
                  fontSize: '13px', fontWeight: 900, color: 'var(--color-accent)'
                }}>
                  <span>🪙</span>
                  <span>+{calculateCoinsEarned(getLevelConfig(currentLevel).tier, calculateLevelStars(getLevelConfig(currentLevel).tier, roundStats.reduce((acc, rs) => acc + rs.accuracy, 0) / roundStats.length, roundStats.reduce((acc, rs) => acc + rs.speed, 0) / roundStats.length), comboStreak) + (!campaignCleared.includes(currentLevel) ? 15 : 0)} Coins</span>
                </div>

                {/* XP */}
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  background: '#F0F5F9', border: '1.5px solid #C4D7E6', padding: '10px', borderRadius: '12px',
                  fontSize: '13px', fontWeight: 900, color: '#4A90E2'
                }}>
                  <span>⭐</span>
                  <span>+{calculateXpEarned(getLevelConfig(currentLevel).minTiles)} XP</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
              {currentLevel < 30 ? (
                <button
                  onClick={() => {
                    const nextLvl = currentLevel + 1;
                    setCampaignLevel(nextLvl);
                    setCurrentLevel(nextLvl);
                    setCurrentRound(1);
                    setLives(getLevelConfig(nextLvl).lives);
                    setFlow('countdown');
                    setCountdown(3);
                    startLevelRoutine(nextLvl, 1);
                  }}
                  className="matrix-pulse-play-btn"
                  style={{
                    width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                    background: 'var(--color-primary)', color: '#FFFFFF', fontSize: '15px', fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  Next Level (Lvl {currentLevel + 1}) ➔
                </button>
              ) : (
                <div className="matrix-theme-card" style={{ padding: '24px 16px', textAlign: 'center', border: '2.5px solid var(--color-accent)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '8px', animation: 'matrix-pulse-glow 2.5s infinite ease-in-out' }}>👑</div>
                  <div style={{ fontWeight: 900, color: 'var(--color-accent)', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Memory Grand Master
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '4px', marginBottom: '20px', fontWeight: 600 }}>
                    Campaign Completed successfully!
                  </div>

                  {/* Grand Master badge */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'linear-gradient(135deg, #FAD961, #F76B1C)', color: '#FFFFFF',
                    padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 900,
                    boxShadow: '0 4px 10px rgba(247, 107, 28, 0.25)', marginBottom: '20px'
                  }}>
                    <span>🏆</span>
                    <span>GRAND MASTER BADGE UNLOCKED</span>
                  </div>

                  {/* Stats Grid */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px',
                    textAlign: 'left', background: 'var(--bg-primary)', padding: '14px', borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Total Stars</div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-accent)' }}>⭐ {Object.values(campaignStars).reduce((acc, val) => acc + val, 0)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Overall Accuracy</div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-primary)' }}>🎯 {parseFloat(localStorage.getItem('cp_matrix_acc') || '100.0')}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Best Flawless Time</div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-primary)' }}>
                        ⚡ {Object.values(fastestClears).length > 0 ? Math.min(...Object.values(fastestClears)) + 's' : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Total Coins</div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-accent)' }}>🪙 {coins}</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-sub)' }}>Total XP Balance</div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#4A90E2' }}>⭐ {xp} XP</div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setFlow('home')}
                className="matrix-btn-scale"
                style={{
                  width: '100%', padding: '12px', borderRadius: '16px', border: '1.5px solid var(--border-color)',
                  background: '#FFFFFF', color: 'var(--text-sub)', fontSize: '13px', fontWeight: 800, cursor: 'pointer'
                }}
              >
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 6: GAME OVER SCREEN */}
        {flow === 'gameover' && (
          <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '50px' }}>🏁</span>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit', margin: '6px 0 2px 0' }}>
                {selectedMode === 'time_trial' ? 'Time Trial Complete!' : 'Out of Lives!'}
              </h2>
              <p style={{ color: 'var(--text-sub)', fontSize: '12px', fontWeight: 600, margin: 0 }}>
                {selectedMode === 'time_trial' ? 'Run finished with +3s wrong tile penalties added.' : 'Restart from Round 1 or top up with coins to clear the campaign.'}
              </p>
            </div>

            {selectedMode === 'time_trial' ? (
              <div className="matrix-theme-card" style={{ width: '100%', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px', fontSize: '12px', fontWeight: 700 }}>
                  <span>Final Time (incl. penalties):</span>
                  <strong style={{ color: 'var(--color-primary)', fontSize: '14px' }}>⏱️ {timeLeft}s</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
                  <span>Personal Best:</span>
                  <strong style={{ color: 'var(--color-accent)' }}>
                    {timeTrialPBs[timeTrialTier] ? `${timeTrialPBs[timeTrialTier]}s` : 'None'}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="matrix-theme-card" style={{ width: '100%', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px', fontSize: '12px', fontWeight: 700 }}>
                  <span>Level Reached:</span>
                  <strong style={{ color: 'var(--text-main)' }}>Level {currentLevel}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
                  <span>Best stars on level:</span>
                  <strong style={{ color: 'var(--color-accent)' }}>⭐ {campaignStars[currentLevel] || 0}</strong>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <button
                onClick={() => {
                  setFlow('home');
                }}
                className="matrix-btn-scale"
                style={{
                  width: '100%', padding: '14px', borderRadius: '16px', border: '1.5px solid var(--border-color)',
                  background: '#FFFFFF', color: 'var(--text-sub)', fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                }}
              >
                🏠 Home Dashboard
              </button>

              <button
                onClick={handlePlayNow}
                className="matrix-pulse-play-btn"
                style={{
                  width: '100%', padding: '14px', borderRadius: '16px', border: 'none',
                  background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                }}
              >
                🎮 Retry Mode
              </button>
            </div>
          </div>
        )}

        {/* MID-ATTEMPT COIN REFILL OVERLAY */}
        {showRefillPrompt && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(46, 58, 47, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', zIndex: 999
          }}>
            <div className="matrix-theme-card" style={{
              padding: '24px', width: 'calc(100% - 32px)', maxWidth: '380px', textAlign: 'center',
              animation: 'matrix-scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <span style={{ fontSize: '36px' }}>❤️</span>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)', margin: '8px 0' }}>Refill attempt?</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '12px', lineHeight: 1.5, marginBottom: '20px' }}>
                Purchase 1 extra life to prevent resetting to Round 1! <br/>
                Cost: **50 Coins** flat. (Attempt limits: {refillsUsedInAttempt} / 3 refills used)
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={handleRefillLives}
                  className="matrix-pulse-play-btn"
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                    background: 'var(--color-primary)', color: '#FFFFFF', fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  Buy 1 Life (50 🪙)
                </button>
                <button
                  onClick={handleDeclineRefill}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px',
                    border: '1.5px solid var(--border-color)', background: '#FFF', color: 'var(--text-sub)',
                    fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  Decline & Restart Level
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAUSE POPUP */}
        {showPause && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(46, 58, 47, 0.65)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
          }}>
            <div className="matrix-theme-card" style={{
              padding: '24px', width: 'calc(100% - 32px)', maxWidth: '380px', textAlign: 'center',
              animation: 'matrix-scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-main)', margin: '8px 0' }}>Game Paused</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '12px', marginBottom: '20px' }}>
                Your progress is suspended. Choose an action.
              </p>

              {showPauseSettings ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>Settings</h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-sub)' }}>Sound Effects</span>
                    <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
                      <input 
                        type="checkbox" 
                        checked={sound} 
                        onChange={(e) => setSound(e.target.checked)} 
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: sound ? 'var(--color-primary)' : '#ccc', transition: '.3s', borderRadius: '20px'
                      }}>
                        <span style={{
                          position: 'absolute', content: '""', height: '14px', width: '14px', left: '3px', bottom: '3px',
                          backgroundColor: 'white', transition: '.3s', borderRadius: '50%',
                          transform: sound ? 'translateX(20px)' : 'none'
                        }}></span>
                      </span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-sub)' }}>Haptic Vibrations</span>
                    <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
                      <input 
                        type="checkbox" 
                        checked={vibrate} 
                        onChange={(e) => setVibrate(e.target.checked)} 
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: vibrate ? 'var(--color-primary)' : '#ccc', transition: '.3s', borderRadius: '20px'
                      }}>
                        <span style={{
                          position: 'absolute', content: '""', height: '14px', width: '14px', left: '3px', bottom: '3px',
                          backgroundColor: 'white', transition: '.3s', borderRadius: '50%',
                          transform: vibrate ? 'translateX(20px)' : 'none'
                        }}></span>
                      </span>
                    </label>
                  </div>

                  <button 
                    onClick={() => setShowPauseSettings(false)}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '12px', marginTop: '10px',
                      border: '1.5px solid var(--border-color)', background: '#FFF', color: 'var(--text-sub)',
                      fontWeight: 800, fontSize: '12px', cursor: 'pointer'
                    }}
                  >
                    Back to Menu
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => { setShowPause(false); setShowPauseSettings(false); }}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                      background: 'var(--color-primary)', color: '#FFFFFF', fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    ▶️ Resume Game
                  </button>
                  <button
                    onClick={handleRestart}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '12px',
                      border: '1.5px solid #BEE3F8', background: '#EBF8FF', color: '#3182CE',
                      fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    🔄 Restart Level
                  </button>
                  <button
                    onClick={() => setShowPauseSettings(true)}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '12px',
                      border: '1.5px solid var(--border-color)', background: '#FFF', color: 'var(--text-sub)',
                      fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    ⚙️ Settings
                  </button>
                  <button
                    onClick={onBack}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '12px',
                      border: '1.5px solid #F5C5C5', background: '#FFF5F5', color: '#D26E6E',
                      fontWeight: 800, fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    🚪 Quit to Hub
                  </button>
                </div>
              )}
            </div>
          </div>
        )}


      </div>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      {flow === 'home' && (
        <div style={{
          width: '100%', height: '75px', background: '#FFFFFF', borderTop: '1.5px solid var(--border-color)',
          display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 10px 10px 10px',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.03)', zIndex: 100, flexShrink: 0
        }}>
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'stats', label: 'Stats', icon: '📊' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent', border: 'none', display: 'flex', flexDirection: 'column',
                alignItems: 'center', cursor: 'pointer', color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-sub)',
                fontWeight: activeTab === tab.id ? 800 : 600, fontSize: '10px', gap: '2px'
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
