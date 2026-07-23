/**
 * MemoryMatrixGame.js
 * Main Game Controller and Page UI view orchestrator for the Memory Matrix game.
 * Uses modular structure, Web Audio synthesis, and dynamic CSS styling for light/dark themes.
 */

import React, { useState, useEffect, useRef } from 'react';
import { getLevelConfig, generatePattern } from './PatternGenerator';
import { playAudioTone } from './AudioSynthManager';
import { calculateScoreGained, getRewards, updateStreakCounter } from './ScoreManager';
import { loadStatistics, updateStatistics } from './StatisticsManager';
import ConfettiManager from './ConfettiManager';

// Dynamic CSS Keyframe injection for premium UX micro-animations
const CSS_ANIMATIONS = `
@keyframes matrix-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
@keyframes matrix-scale-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes matrix-pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 10px var(--primary)); opacity: 0.9; }
  50% { filter: drop-shadow(0 0 25px var(--primary)); opacity: 1; }
}
@keyframes matrix-flip-tile {
  0% { transform: rotateY(0); }
  50% { transform: rotateY(90deg); opacity: 0.8; }
  100% { transform: rotateY(0); }
}
@keyframes matrix-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes matrix-neon-glow {
  0%, 100% { 
    text-shadow: 0 0 8px rgba(0, 191, 255, 0.4), 0 0 16px rgba(0, 191, 255, 0.3), 0 0 24px rgba(0, 191, 255, 0.1);
  }
  50% { 
    text-shadow: 0 0 16px rgba(0, 191, 255, 0.8), 0 0 28px rgba(0, 191, 255, 0.5), 0 0 40px rgba(0, 191, 255, 0.3);
  }
}
@keyframes matrix-pulse-play {
  0%, 100% { 
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.4), inset 0 0 15px rgba(99, 102, 241, 0.2);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(0, 191, 255, 0.8), inset 0 0 20px rgba(0, 191, 255, 0.4);
    transform: scale(1.05);
  }
}
.matrix-shake-active {
  animation: matrix-shake 0.4s ease-in-out;
}
.matrix-tile-memorize {
  animation: matrix-flip-tile 0.5s ease-in-out;
}
.matrix-neon-glow-text {
  animation: matrix-neon-glow 3s infinite ease-in-out;
}
.matrix-pulse-play-btn {
  animation: matrix-pulse-play 2.5s infinite ease-in-out;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.matrix-pulse-play-btn:active {
  transform: scale(0.95) !important;
}
.matrix-glass-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.matrix-glass-card:hover {
  border-color: rgba(0, 191, 255, 0.4);
  box-shadow: 0 12px 40px 0 rgba(0, 191, 255, 0.15);
  transform: translateY(-2px);
}
.matrix-btn-scale {
  transition: transform 0.15s ease;
}
.matrix-btn-scale:active {
  transform: scale(0.95);
}
@keyframes matrix-progress-decay {
  from { width: 100%; }
  to { width: 0%; }
}
`;

function FloatingParticles({ darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = Math.min(25, Math.floor((window.innerWidth * window.innerHeight) / 50000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = darkMode ? '0, 191, 255' : '99, 102, 241';

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
        ctx.shadowColor = `rgba(${color}, 0.5)`;
        ctx.shadowBlur = 3;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export default function MemoryMatrixGame({ onBack, t, soundEnabled: globalSound, darkMode, user }) {
  // Sound & Vibrate states
  const [sound, setSound] = useState(() => {
    const saved = localStorage.getItem('cp_matrix_sound');
    return saved !== null ? saved === 'true' : globalSound;
  });
  const [vibrate, setVibrate] = useState(() => {
    const saved = localStorage.getItem('cp_matrix_vibrate');
    return saved !== null ? saved === 'true' : true;
  });

  // Flow State: 'home' | 'instructions' | 'countdown' | 'playing' | 'wrong' | 'gameover'
  const [flow, setFlow] = useState('home');
  const [homeSubPanel, setHomeSubPanel] = useState('none'); // 'none' | 'practice' | 'stats' | 'achievements' | 'settings'
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'memorize' | 'recall'
  
  // Game metrics
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [startLevel, setStartLevel] = useState(1);
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('cp_streak') || '0', 10));

  // Grid details
  const [gridSize, setGridSize] = useState(3);
  const [highlightedTiles, setHighlightedTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [failedTile, setFailedTile] = useState(null);
  const [shakeGrid, setShakeGrid] = useState(false);

  // Statistics
  const [stats, setStats] = useState(loadStatistics());
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem('cp_coins') || '200', 10));
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('cp_xp') || '0', 10));
  
  // Custom timers
  const [countdown, setCountdown] = useState(3);
  const [memorizeProgress, setMemorizeProgress] = useState(100);
  const [showPause, setShowPause] = useState(false);
  const [triggerConfetti, setTriggerConfetti] = useState(false);

  const levelStartTime = useRef(0);
  const totalReactionTime = useRef(0);
  const totalTaps = useRef(0);
  const correctTaps = useRef(0);

  const todayStr = new Date().toISOString().split('T')[0];
  const [dailyCompleted, setDailyCompleted] = useState(() => {
    return localStorage.getItem('cp_matrix_daily_completed_date') === todayStr;
  });

  // Helper to save game stats/coins/xp to Cloud
  const saveToCloud = async (overrideData = {}) => {
    if (!user || !user.id) return;

    const gameData = {
      coins: overrideData.coins !== undefined ? overrideData.coins : coins,
      xp: overrideData.xp !== undefined ? overrideData.xp : xp,
      streak: overrideData.streak !== undefined ? overrideData.streak : streak,
      lastPlayedDate: overrideData.lastPlayedDate !== undefined ? overrideData.lastPlayedDate : localStorage.getItem('cp_matrix_last_played_date') || '',
      dailyCompletedDate: overrideData.dailyCompletedDate !== undefined ? overrideData.dailyCompletedDate : localStorage.getItem('cp_matrix_daily_completed_date') || '',
      bestScore: overrideData.stats ? overrideData.stats.bestScore : stats.bestScore,
      highestLevel: overrideData.stats ? overrideData.stats.highestLevel : stats.highestLevel,
      gamesPlayed: overrideData.stats ? overrideData.stats.gamesPlayed : stats.gamesPlayed,
      accuracy: overrideData.stats ? overrideData.stats.accuracy : stats.accuracy,
      longestStreak: overrideData.stats ? overrideData.stats.longestStreak : stats.longestStreak,
      avgReaction: overrideData.stats ? overrideData.stats.avgReaction : stats.avgReaction
    };

    try {
      const API_URL = process.env.REACT_APP_API_URL || '/api';
      await fetch(`${API_URL}/game-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, gameData })
      });
    } catch (e) {
      console.error("Failed to sync game data to Cloud:", e);
    }
  };

  // Load game data from Cloud/API if user is logged in
  useEffect(() => {
    if (user && user.id) {
      const API_URL = process.env.REACT_APP_API_URL || '/api';
      fetch(`${API_URL}/game-data?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            if (data.coins !== undefined) {
              setCoins(data.coins);
              localStorage.setItem('cp_coins', String(data.coins));
            }
            if (data.xp !== undefined) {
              setXp(data.xp);
              localStorage.setItem('cp_xp', String(data.xp));
            }
            if (data.streak !== undefined) {
              setStreak(data.streak);
              localStorage.setItem('cp_streak', String(data.streak));
            }
            if (data.dailyCompletedDate !== undefined) {
              const todayStr = new Date().toISOString().split('T')[0];
              setDailyCompleted(data.dailyCompletedDate === todayStr);
              localStorage.setItem('cp_matrix_daily_completed_date', data.dailyCompletedDate);
            }
            if (data.lastPlayedDate !== undefined) {
              localStorage.setItem('cp_matrix_last_played_date', data.lastPlayedDate);
            }
            
            const loadedStats = {
              bestScore: data.bestScore !== undefined ? data.bestScore : 0,
              highestLevel: data.highestLevel !== undefined ? data.highestLevel : 1,
              gamesPlayed: data.gamesPlayed !== undefined ? data.gamesPlayed : 0,
              accuracy: data.accuracy !== undefined ? data.accuracy : 100.0,
              longestStreak: data.longestStreak !== undefined ? data.longestStreak : 0,
              avgReaction: data.avgReaction !== undefined ? data.avgReaction : 0
            };
            setStats(loadedStats);
            
            localStorage.setItem('cp_matrix_best_score', String(loadedStats.bestScore));
            localStorage.setItem('cp_matrix_highest_lvl', String(loadedStats.highestLevel));
            localStorage.setItem('cp_matrix_played', String(loadedStats.gamesPlayed));
            localStorage.setItem('cp_matrix_acc', String(loadedStats.accuracy));
            localStorage.setItem('cp_matrix_longest_streak', String(loadedStats.longestStreak));
            localStorage.setItem('cp_matrix_reaction', String(loadedStats.avgReaction));
          }
        })
        .catch(err => console.error("Error loading game data from Firestore:", err));
    }
  }, [user]);

  // Inject animations once on mount
  useEffect(() => {
    const id = 'matrix-game-animations';
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    style.textContent = CSS_ANIMATIONS;
  }, []);

  // Sync settings configurations
  useEffect(() => {
    localStorage.setItem('cp_matrix_sound', String(sound));
  }, [sound]);

  useEffect(() => {
    localStorage.setItem('cp_matrix_vibrate', String(vibrate));
  }, [vibrate]);

  // Haptic feedback trigger
  const triggerHaptic = (ms = 50) => {
    if (vibrate && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const addRewards = (coinsEarned, xpEarned) => {
    const nextCoins = coins + coinsEarned;
    const nextXp = xp + xpEarned;
    setCoins(nextCoins);
    setXp(nextXp);
    localStorage.setItem('cp_coins', String(nextCoins));
    localStorage.setItem('cp_xp', String(nextXp));
    saveToCloud({ coins: nextCoins, xp: nextXp });
  };

  // Generate date seed challenge
  const playDailyChallengeSetup = () => {
    setIsDailyChallenge(true);
    setFlow('countdown');
    setCountdown(3);
    const dateSeed = todayStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
    
    // Level 5 equivalent difficulty
    const config = getLevelConfig(5);
    setGridSize(config.size);
    
    // Deterministic random pattern based on seed
    let currentSeed = dateSeed;
    const totalTiles = config.size * config.size;
    const selected = [];
    while (selected.length < config.count) {
      currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
      const idx = Math.floor((currentSeed / 4294967296) * totalTiles);
      if (!selected.includes(idx)) {
        selected.push(idx);
      }
    }
    setHighlightedTiles(selected);
    setSelectedTiles([]);
    setFailedTile(null);
  };

  // Regular gameplay routine
  const startLevelRoutine = (lvl) => {
    const config = getLevelConfig(lvl);
    setGridSize(config.size);
    setSelectedTiles([]);
    setFailedTile(null);
    setFlow('countdown');
    setCountdown(3);

    const pattern = generatePattern(config.size, config.count);
    setHighlightedTiles(pattern);

    // Celebration milestone intervals (Level 10, 20, 30, etc.)
    if (lvl > 1 && lvl % 10 === 1) {
      setTriggerConfetti(true);
      playAudioTone('complete', sound);
      setTimeout(() => setTriggerConfetti(false), 3000);
    }
  };

  // Countdown timer handles
  useEffect(() => {
    if (flow === 'countdown') {
      if (countdown > 0) {
        playAudioTone('tick', sound);
        const timer = setTimeout(() => setCountdown(countdown - 1), 800);
        return () => clearTimeout(timer);
      } else {
        setFlow('playing');
        setGameState('memorize');
      }
    }
  }, [flow, countdown, sound]);

  // Memorize stage duration and progress bar handles
  useEffect(() => {
    if (flow === 'playing' && gameState === 'memorize') {
      const duration = 3000;

      const timeout = setTimeout(() => {
        setGameState('recall');
        levelStartTime.current = Date.now();
      }, duration);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [flow, gameState, level, isDailyChallenge]);

  const handleStartGame = () => {
    setIsDailyChallenge(false);
    setLevel(startLevel);
    setScore(0);
    totalReactionTime.current = 0;
    totalTaps.current = 0;
    correctTaps.current = 0;

    // Track Streak logs
    const lastPlayed = localStorage.getItem('cp_matrix_last_played_date');
    const nextStreak = updateStreakCounter(lastPlayed, streak);
    setStreak(nextStreak);
    localStorage.setItem('cp_streak', String(nextStreak));
    localStorage.setItem('cp_matrix_last_played_date', todayStr);
    saveToCloud({ streak: nextStreak, lastPlayedDate: todayStr });

    startLevelRoutine(startLevel);
  };

  const handlePlayFromFailedLevel = (keepScore = false) => {
    setIsDailyChallenge(false);
    if (!keepScore) {
      setScore(0);
    }
    totalReactionTime.current = 0;
    totalTaps.current = 0;
    correctTaps.current = 0;

    // Track Streak logs
    const lastPlayed = localStorage.getItem('cp_matrix_last_played_date');
    const nextStreak = updateStreakCounter(lastPlayed, streak);
    setStreak(nextStreak);
    localStorage.setItem('cp_streak', String(nextStreak));
    localStorage.setItem('cp_matrix_last_played_date', todayStr);
    saveToCloud({ streak: nextStreak, lastPlayedDate: todayStr });

    startLevelRoutine(level);
  };

  const handleContinueWithCoins = () => {
    if (coins >= 20) {
      const nextCoins = coins - 20;
      setCoins(nextCoins);
      localStorage.setItem('cp_coins', String(nextCoins));
      saveToCloud({ coins: nextCoins });
      handlePlayFromFailedLevel(true);
    } else {
      alert("Not enough coins! You need 20 coins to continue with your current score.");
    }
  };

  const handleTileSelect = (idx) => {
    if (flow !== 'playing' || gameState !== 'recall') return;
    
    // Prevent duplicate selection taps
    if (selectedTiles.includes(idx) || failedTile === idx) return;

    totalTaps.current += 1;
    playAudioTone('tap', sound);

    if (highlightedTiles.includes(idx)) {
      correctTaps.current += 1;
      const nextSelected = [...selectedTiles, idx];
      setSelectedTiles(nextSelected);
      triggerHaptic(40);

      // Level success!
      if (nextSelected.length === highlightedTiles.length) {
        playAudioTone('correct', sound);
        const duration = Date.now() - levelStartTime.current;
        totalReactionTime.current += duration;

        const points = calculateScoreGained(level, streak);
        setScore(prev => prev + points);

        if (isDailyChallenge) {
          // Finish challenge
          setDailyCompleted(true);
          localStorage.setItem('cp_matrix_daily_completed_date', todayStr);
          const nextCoins = coins + 50;
          const nextXp = xp + 100;
          setCoins(nextCoins);
          setXp(nextXp);
          localStorage.setItem('cp_coins', String(nextCoins));
          localStorage.setItem('cp_xp', String(nextXp));
          setTriggerConfetti(true);
          setTimeout(() => {
            setTriggerConfetti(false);
            setFlow('gameover');
            
            const updated = updateStatistics({
              level,
              score,
              taps: totalTaps.current,
              correctTaps: correctTaps.current,
              reactionTime: totalReactionTime.current,
              streak
            });
            setStats(updated);
            playAudioTone('gameover', sound);
            
            saveToCloud({
              coins: nextCoins,
              xp: nextXp,
              dailyCompletedDate: todayStr,
              stats: updated
            });
          }, 1500);
        } else {
          // Standard Level Ups
          const rewards = getRewards(level, false);
          addRewards(rewards.coins, rewards.xp);
          setLevel(prev => prev + 1);
          setTimeout(() => {
            startLevelRoutine(level + 1);
          }, 800);
        }
      }
    } else {
      // Mistake selected!
      setFailedTile(idx);
      triggerHaptic(200);
      setShakeGrid(true);
      playAudioTone('wrong', sound);
      
      const duration = Date.now() - levelStartTime.current;
      totalReactionTime.current += duration;

      setTimeout(() => {
        setShakeGrid(false);
        setFlow('gameover');
        handleSaveStats();
      }, 1200);
    }
  };

  const handleSaveStats = () => {
    const updated = updateStatistics({
      level,
      score,
      taps: totalTaps.current,
      correctTaps: correctTaps.current,
      reactionTime: totalReactionTime.current,
      streak
    });
    setStats(updated);
    playAudioTone('gameover', sound);
    saveToCloud({ stats: updated });
  };

  const shareStatsScore = () => {
    const text = `🧠 Memory Matrix Challenge: Reached Level ${level} with a score of ${score} on CareerPath AI! Spatial recall accuracy at ${stats.accuracy}%! 🚀`;
    navigator.clipboard.writeText(text);
    alert("Stats copied to clipboard! Share the challenge! 📢");
  };

  const getAchievements = () => {
    const list = [];
    if (level >= 5) list.push({ title: '🥉 Beginner', desc: 'Reach Level 5' });
    if (level >= 10) list.push({ title: '🥈 Intermediate', desc: 'Reach Level 10' });
    if (level >= 20) list.push({ title: '🥇 Expert', desc: 'Reach Level 20' });
    if (level >= 50) list.push({ title: '🏆 Memory Master', desc: 'Reach Level 50' });
    return list;
  };

  const dynamicBackgroundStyle = {
    backgroundImage: darkMode
      ? 'linear-gradient(rgba(10, 15, 30, 0.45), rgba(10, 15, 30, 0.45)), url("/matrix_bg.png")'
      : 'linear-gradient(rgba(245, 247, 255, 0.45), rgba(245, 247, 255, 0.45)), url("/matrix_bg.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    position: 'relative',
    zIndex: 1,
    overflowX: 'hidden'
  };

  const userInitial = user && user.displayName ? user.displayName.charAt(0).toUpperCase() : (user && user.email ? user.email.charAt(0).toUpperCase() : 'M');

  return (
    <div style={{ ...S_Game.wrapper, ...dynamicBackgroundStyle }} className="fade-in-section">
      {triggerConfetti && <ConfettiManager />}
      <FloatingParticles darkMode={darkMode} />

      {/* TOP HEADER */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        zIndex: 10,
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        marginTop: '16px',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {/* Top Left Game Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={onBack}>
          <span style={{ fontSize: '26px', filter: 'drop-shadow(0 0 8px #00bfff)' }}>🧬</span>
          <span style={{ 
            fontFamily: 'Outfit, sans-serif', 
            fontWeight: 900, 
            fontSize: '18px', 
            letterSpacing: '1px',
            background: 'linear-gradient(90deg, #00bfff, var(--primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            MEMORY MATRIX
          </span>
        </div>

        {/* Top Right User Profile pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 800
          }}>
            <span title="Streak">🔥 {streak}d</span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: '#fbbf24' }}>🪙 {coins}</span>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: '#38bdf8' }}>✨ {xp} XP</span>
          </div>

          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00bfff, var(--primary))',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '14px',
            boxShadow: '0 0 10px rgba(0, 191, 255, 0.4)',
            cursor: 'pointer'
          }} title={user ? user.email : 'Guest User'}>
            {userInitial}
          </div>

          <button onClick={onBack} style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: '12px',
            padding: '6px 14px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer'
          }} className="matrix-btn-scale">
            Back
          </button>
        </div>
      </div>

      {flow === 'home' && (
        <div style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          marginTop: '40px',
          zIndex: 10,
          position: 'relative',
          paddingBottom: '40px'
        }}>
          {/* Top Center Title */}
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <span style={{ fontSize: '64px', display: 'block', marginBottom: '8px' }}>🧠</span>
            <h1 className="matrix-neon-glow-text" style={{
              fontSize: '44px',
              fontWeight: 900,
              fontFamily: 'Outfit, sans-serif',
              background: 'linear-gradient(135deg, #00bfff 0%, var(--primary) 50%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '1px'
            }}>
              MEMORY MATRIX
            </h1>
            <h3 style={{
              color: '#38bdf8',
              fontSize: '18px',
              fontWeight: 700,
              marginTop: '8px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              Train Your Spatial Memory
            </h3>
            <p style={{
              color: 'var(--text-sub)',
              fontSize: '14px',
              lineHeight: 1.6,
              marginTop: '12px',
              fontWeight: 500
            }}>
              Improve your memory by remembering tile patterns and challenging your brain every day.
            </p>
          </div>

          {/* Center of Screen: Pulsing PLAY NOW Button */}
          <div style={{ margin: '16px 0' }}>
            <button
              onClick={() => setFlow('instructions')}
              className="matrix-pulse-play-btn"
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                border: 'none',
                background: 'linear-gradient(135deg, #00bfff, var(--primary))',
                color: '#fff',
                fontSize: '20px',
                fontWeight: 900,
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <span>PLAY</span>
              <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: 700 }}>NOW</span>
            </button>
          </div>

          {/* Below Play Button menu options */}
          <div style={{
            width: '100%',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Daily Challenge Card */}
            <div 
              style={{
                borderColor: dailyCompleted ? 'rgba(34,197,94,0.3)' : 'rgba(0,191,255,0.3)',
                background: dailyCompleted ? 'rgba(34,197,94,0.05)' : 'rgba(0,191,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px'
              }}
              className="matrix-glass-card"
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-main)' }}>📅 Daily Challenge</div>
                <div style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '4px' }}>Earn +50 Coins & 100 XP</div>
              </div>
              {dailyCompleted ? (
                <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 800 }}>✅ COMPLETED</span>
              ) : (
                <button 
                  onClick={playDailyChallengeSetup} 
                  style={{
                    padding: '8px 16px', 
                    fontSize: '12px', 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #00bfff, var(--primary))',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                  className="matrix-btn-scale"
                >
                  Play
                </button>
              )}
            </div>

            {/* Quick configuration for Practice Mode */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '16px 20px',
                cursor: 'default'
              }}
              className="matrix-glass-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-main)' }}>🎯 Practice Mode</span>
                <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800 }}>Start Level: {startLevel}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 5, 10, 15].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setStartLevel(lvl)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: startLevel === lvl ? 'linear-gradient(135deg, #00bfff, var(--primary))' : 'rgba(255, 255, 255, 0.05)',
                      color: startLevel === lvl ? '#fff' : 'var(--text-sub)',
                      border: startLevel === lvl ? 'none' : '1px solid var(--border-color)'
                    }}
                    className="matrix-btn-scale"
                  >
                    Lvl {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Statistics Trigger */}
            <div 
              onClick={() => setHomeSubPanel(homeSubPanel === 'stats' ? 'none' : 'stats')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                cursor: 'pointer'
              }}
              className="matrix-glass-card"
            >
              <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-main)' }}>📊 General Statistics</span>
              <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{homeSubPanel === 'stats' ? '▲' : '▼'}</span>
            </div>

            {homeSubPanel === 'stats' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)'
              }} className="fade-in-section">
                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-sub)', fontWeight: 800 }}>ACCURACY</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>{stats.accuracy}%</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-sub)', fontWeight: 800 }}>LONGEST STREAK</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>{stats.longestStreak} days</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-sub)', fontWeight: 800 }}>AVG RESPONSE</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>{stats.avgReaction ? `${(stats.avgReaction / 1000).toFixed(2)}s` : 'N/A'}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-sub)', fontWeight: 800 }}>GAMES PLAYED</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>{stats.gamesPlayed}</div>
                </div>
              </div>
            )}

            {/* Achievements Trigger */}
            <div 
              onClick={() => setHomeSubPanel(homeSubPanel === 'achievements' ? 'none' : 'achievements')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                cursor: 'pointer'
              }}
              className="matrix-glass-card"
            >
              <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-main)' }}>🏆 Achievements List</span>
              <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{homeSubPanel === 'achievements' ? '▲' : '▼'}</span>
            </div>

            {homeSubPanel === 'achievements' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)'
              }} className="fade-in-section">
                {[
                  { title: '🥉 Beginner', desc: 'Reach Level 5', unlocked: stats.highestLevel >= 5 },
                  { title: '🥈 Intermediate', desc: 'Reach Level 10', unlocked: stats.highestLevel >= 10 },
                  { title: '🥇 Expert', desc: 'Reach Level 20', unlocked: stats.highestLevel >= 20 },
                  { title: '🏆 Memory Master', desc: 'Reach Level 50', unlocked: stats.highestLevel >= 50 }
                ].map((ach, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: ach.unlocked ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid ' + (ach.unlocked ? 'rgba(34,197,94,0.2)' : 'var(--border-color)')
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-main)' }}>{ach.title}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-sub)', marginTop: '2px' }}>{ach.desc}</div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: ach.unlocked ? '#22c55e' : 'var(--text-muted)' }}>
                      {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Settings Trigger */}
            <div 
              onClick={() => setHomeSubPanel(homeSubPanel === 'settings' ? 'none' : 'settings')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                cursor: 'pointer'
              }}
              className="matrix-glass-card"
            >
              <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-main)' }}>⚙️ System Settings</span>
              <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>{homeSubPanel === 'settings' ? '▲' : '▼'}</span>
            </div>

            {homeSubPanel === 'settings' && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                gap: '12px'
              }} className="fade-in-section">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={sound} onChange={e => setSound(e.target.checked)} style={{ cursor: 'pointer' }} />
                  🔊 Audio Sound
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={vibrate} onChange={e => setVibrate(e.target.checked)} style={{ cursor: 'pointer' }} />
                  📳 Haptic Vibe
                </label>
              </div>
            )}
          </div>

          {/* Bottom Bar: Best Score, Highest Level, Games Played */}
          <div style={{
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            marginTop: '16px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-sub)', fontWeight: 800, letterSpacing: '1px' }}>BEST SCORE</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#38bdf8', marginTop: '4px', fontFamily: 'Outfit, sans-serif' }}>{stats.bestScore}</div>
            </div>
            <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }} />
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-sub)', fontWeight: 800, letterSpacing: '1px' }}>HIGHEST LEVEL</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#38bdf8', marginTop: '4px', fontFamily: 'Outfit, sans-serif' }}>{stats.highestLevel}</div>
            </div>
            <div style={{ height: '24px', width: '1px', background: 'var(--border-color)' }} />
            <div>
              <div style={{ fontSize: '9px', color: 'var(--text-sub)', fontWeight: 800, letterSpacing: '1px' }}>GAMES PLAYED</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#38bdf8', marginTop: '4px', fontFamily: 'Outfit, sans-serif' }}>{stats.gamesPlayed}</div>
            </div>
          </div>
        </div>
      )}

      {flow === 'instructions' && (
        <div style={S_Game.menuContainer}>
          <h2 style={{ ...S_Game.headline, fontSize: 26, marginBottom: 14 }}>How to Play</h2>
          
          <div style={{ ...S_Game.card, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>1️⃣</span>
              <p style={{ fontSize: 13, color: 'var(--text-sub)', margin: 0 }}>A grid will display for 3 seconds. Memorize the blinking highlighted tiles.</p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>2️⃣</span>
              <p style={{ fontSize: 13, color: 'var(--text-sub)', margin: 0 }}>Once the pattern goes blank, click only the tiles that were highlighted.</p>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>3️⃣</span>
              <p style={{ fontSize: 13, color: 'var(--text-sub)', margin: 0 }}>Clicking a wrong tile ends the level immediately. Score increments with multipliers on streak days.</p>
            </div>
          </div>

          <button onClick={handleStartGame} className="premium-btn" style={{ width: '100%', padding: '14px', borderRadius: 16 }}>
            I Understand, Play!
          </button>
        </div>
      )}

      {flow === 'countdown' && (
        <div style={S_Game.countdownContainer}>
          <div style={{ fontSize: 96, fontWeight: 900, color: 'var(--primary)', animation: 'matrix-pulse-glow 1s infinite' }}>
            {countdown === 0 ? 'GO!' : countdown}
          </div>
          <p style={{ color: 'var(--text-sub)', fontSize: 13, fontWeight: 800, marginTop: 10 }}>PREPARING SPATIAL TARGETS...</p>
        </div>
      )}

      {flow === 'playing' && (
        <div style={S_Game.menuContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 14 }}>
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 800 }}>LEVEL</span>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)' }}>{level}</div>
            </div>
            <button onClick={() => setShowPause(true)} style={S_Game.pauseBtn}>
              ⏸️ Pause
            </button>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 11, color: 'var(--text-sub)', fontWeight: 800 }}>SCORE</span>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)' }}>{score}</div>
            </div>
          </div>

          {/* Memorize timer progress bar */}
          {gameState === 'memorize' && (
            <div style={{ background: 'rgba(255,255,255,0.06)', height: 6, borderRadius: 3, width: '100%', marginBottom: 14, overflow: 'hidden' }}>
              <div style={{
                background: 'linear-gradient(90deg, #00bfff, var(--primary))',
                height: '100%',
                animation: 'matrix-progress-decay 3000ms linear forwards'
              }} />
            </div>
          )}

          <div style={{ ...S_Game.card, padding: '10px 16px', textAlign: 'center', marginBottom: 18, background: gameState === 'memorize' ? 'rgba(56,189,248,0.06)' : 'rgba(34,197,94,0.06)' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: gameState === 'memorize' ? '#38BDF8' : '#22C55E' }}>
              {gameState === 'memorize' ? '👀 Memorize the layout...' : '👇 Click the recalled locations'}
            </span>
          </div>

          {/* GRID RENDER */}
          <div 
            className={shakeGrid ? 'matrix-shake-active' : ''}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gap: gridSize > 4 ? 8 : 12,
              width: '100%',
              maxWidth: '380px',
              margin: '0 auto',
              aspectRatio: '1/1'
            }}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
              const isHighlighted = highlightedTiles.includes(idx);
              const isSelected = selectedTiles.includes(idx);
              const isFailed = failedTile === idx;
              
              let bg = 'rgba(255, 255, 255, 0.03)';
              let border = '1.5px solid var(--border-color)';
              let shadow = 'none';

              if (gameState === 'memorize' && isHighlighted) {
                bg = 'var(--primary)';
                border = 'none';
                shadow = '0 0 16px var(--primary)';
              } else if (isSelected) {
                bg = '#22C55E';
                border = 'none';
                shadow = '0 0 16px rgba(34, 197, 94, 0.4)';
              } else if (isFailed) {
                bg = '#EF4444';
                border = 'none';
                shadow = '0 0 16px rgba(239, 68, 68, 0.4)';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleTileSelect(idx)}
                  className={gameState === 'memorize' && isHighlighted ? 'matrix-tile-memorize' : ''}
                  style={{
                    background: bg,
                    border,
                    borderRadius: 16,
                    cursor: gameState === 'recall' ? 'pointer' : 'default',
                    boxShadow: shadow,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected || isFailed ? 'scale(0.96)' : 'none'
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {flow === 'gameover' && (
        <div style={S_Game.menuContainer}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <span style={{ fontSize: 64 }}>🏁</span>
            <h2 style={S_Game.headline}>
              {isDailyChallenge ? 'Challenge Solved!' : 'Game Over'}
            </h2>
            <p style={{ color: 'var(--text-sub)', fontSize: 13, marginTop: 4 }}>
              {isDailyChallenge ? 'Rewarded with 50 Coins and 100 XP!' : 'Train spatial recall consistently to increase stats!'}
            </p>
          </div>

          <div style={S_Game.card}>
            <div style={S_Game.gameOverRow}>
              <span>Level Reached:</span>
              <strong>{level}</strong>
            </div>
            <div style={S_Game.gameOverRow}>
              <span>Score:</span>
              <strong style={{ color: 'var(--primary)' }}>{score}</strong>
            </div>
            <div style={S_Game.gameOverRow}>
              <span>Accuracy:</span>
              <strong style={{ color: '#22c55e' }}>
                {totalTaps.current > 0 ? Math.round((correctTaps.current / totalTaps.current) * 100) : 100}%
              </strong>
            </div>
            <div style={{ ...S_Game.gameOverRow, borderBottom: 'none', paddingBottom: 0 }}>
              <span>Personal Best:</span>
              <strong style={{ color: '#f59e0b' }}>{stats.bestScore}</strong>
            </div>
          </div>

          {/* ACHIEVEMENTS DISPLAY */}
          {getAchievements().length > 0 && (
            <div style={S_Game.card}>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--primary)', marginBottom: 12, textTransform: 'uppercase' }}>Achievements Unlocked This Run</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {getAchievements().map((ach, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)' }}>{ach.title}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-sub)' }}>{ach.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
            {!isDailyChallenge && (
              <>
                <button 
                  onClick={handleContinueWithCoins} 
                  className="premium-btn" 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: 16,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 800
                  }}
                >
                  ⚡ Continue Level {level} <span style={{ opacity: 0.8, fontSize: '11px', fontWeight: 600 }}>(Costs 20 🪙)</span>
                </button>

                <button 
                  onClick={() => handlePlayFromFailedLevel(false)} 
                  style={{ 
                    width: '100%', 
                    padding: '14px', 
                    borderRadius: 16,
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '13px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  className="matrix-btn-scale"
                >
                  🔄 Restart Level {level} <span style={{ opacity: 0.8, fontSize: '11px', fontWeight: 600 }}>(Free)</span>
                </button>
              </>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setFlow('home')} style={S_Game.menuBtn}>
                🏠 Home Menu
              </button>
              {!isDailyChallenge && (
                <button 
                  onClick={handleStartGame} 
                  style={{
                    ...S_Game.menuBtn,
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  🎮 Restart Game
                </button>
              )}
            </div>
          </div>

          <button onClick={shareStatsScore} style={S_Game.shareBtn}>
            📢 Share Performance
          </button>
        </div>
      )}

      {/* PAUSE POPUP OVERLAY */}
      {showPause && (
        <div style={S_Game.overlay}>
          <div style={S_Game.modal}>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)', marginBottom: 14, fontFamily: 'Outfit' }}>Game Paused</h3>
            <p style={{ color: 'var(--text-sub)', fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>
              Resume to keep training or submit your current score to save achievements.
            </p>
            <button onClick={() => setShowPause(false)} className="premium-btn" style={{ width: '100%', padding: 12, marginBottom: 10 }}>
              Resume Game
            </button>
            <button onClick={() => { setShowPause(false); setFlow('gameover'); handleSaveStats(); }} style={S_Game.exitBtn}>
              End Game & Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Layout styling specifications
const S_Game = {
  wrapper: {
    minHeight: '100vh',
    padding: '0 16px 120px 16px',
    color: 'var(--text-main)',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: 20
  },
  backBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    borderRadius: 50,
    padding: '6px 16px',
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer'
  },
  menuContainer: {
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    animation: 'matrix-scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    marginTop: 10
  },
  headline: {
    fontSize: 32,
    fontWeight: 900,
    fontFamily: 'Outfit, sans-serif',
    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  card: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
    padding: '20px',
    backdropFilter: 'blur(20px)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginBottom: 10
  },
  statCell: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 900,
    color: 'var(--text-sub)',
    letterSpacing: 1
  },
  statVal: {
    fontSize: 18,
    fontWeight: 900,
    color: 'var(--primary)',
    marginTop: 4,
    fontFamily: 'Outfit, sans-serif'
  },
  countdownContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    textAlign: 'center'
  },
  pauseBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-sub)',
    borderRadius: 8,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer'
  },
  gameOverRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: 10,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: 700
  },
  menuBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    cursor: 'pointer',
    fontWeight: 800,
    fontSize: 13
  },
  shareBtn: {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    border: 'none',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    color: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
    marginTop: 8
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  modal: {
    background: 'var(--bg-mid)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
    padding: '24px 32px',
    width: 'calc(100% - 32px)',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    animation: 'matrix-scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  exitBtn: {
    width: '100%',
    padding: 12,
    borderRadius: 14,
    border: '1px solid var(--border-color)',
    background: 'transparent',
    color: '#ef4444',
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: 13
  }
};
