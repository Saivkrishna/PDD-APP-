import React, { useState, useEffect, useRef } from 'react';
import './ArithmeticRainGame.css';
import { generateQuestion, SeededRandom, getSeedFromDate, getSpeedMultiplier } from './GameEngine';
import { calculatePoints, getSessionRewards, loadLocalData, saveLocalData } from './ScoreStatsManager';
import { playAudioTone, startBGM, stopBGM } from './AudioSynthManager';
import { triggerVibration } from './VibrationManager';
import ConfettiManager from '../MemoryMatrix/ConfettiManager';

export default function ArithmeticRainGame({ onBack, t, soundEnabled: globalSoundEnabled, darkMode, user }) {
  const [view, setView] = useState('menu'); // 'menu', 'countdown', 'game', 'results'
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'achievements', 'settings', 'history'
  
  // Game state
  const [mode, setMode] = useState('classic'); // 'practice', 'classic', 'timed', 'endless', 'daily'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [gameTime, setGameTime] = useState(0); // in seconds
  const [timedDuration, setTimedDuration] = useState(120); // 2 mins default (120, 300, 600)
  const [countdown, setCountdown] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  
  // Counters for statistics
  const totalCorrect = useRef(0);
  const totalWrong = useRef(0);
  const totalMissed = useRef(0);
  const totalAnswerTimes = useRef([]); // tracks reaction times for correct answers
  const gameLoopRef = useRef(null);
  const lastSpawnTime = useRef(0);
  const lastUpdateTime = useRef(0);
  const dailyPrng = useRef(null);

  // Stats / settings loaded from Cloud & Local
  const [gameStats, setGameStats] = useState(null);
  const [achievementsList, setAchievementsList] = useState([]);
  const [settings, setSettings] = useState({ music: true, sound: true, vibration: true });
  const [dailyInfo, setDailyInfo] = useState({ lastPlayedDate: '', streak: 0, longestStreak: 0 });
  const [historyList, setHistoryList] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeContainer, setShakeContainer] = useState(false);
  const [globalCoins, setGlobalCoins] = useState(() => parseInt(localStorage.getItem('cp_coins') || '200', 10));
  const [globalXp, setGlobalXp] = useState(() => parseInt(localStorage.getItem('cp_xp') || '0', 10));

  const API_URL = process.env.REACT_APP_API_URL || '/api';
  const todayStr = new Date().toISOString().split('T')[0];

  // Disable body scroll when game screen is loaded to prevent focus shifting
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Load user data on startup
  useEffect(() => {
    // 1. Load from local cache first for instant load
    const local = loadLocalData();
    setGameStats(local.stats);
    setSettings(local.settings);
    setAchievementsList(local.achievements);
    setDailyInfo(local.daily);

    // 2. Fetch from database if user is logged in
    if (user && user.id) {
      fetch(`${API_URL}/arithmetic-rain/user-data?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            if (data.statistics) setGameStats(data.statistics);
            if (data.settings) setSettings(data.settings);
            if (data.achievements) setAchievementsList(data.achievements);
            if (data.dailyChallenge) setDailyInfo(data.dailyChallenge);
            if (data.history) setHistoryList(data.history);

            // Sync back to local storage
            saveLocalData({
              stats: data.statistics || local.stats,
              settings: data.settings || local.settings,
              achievements: data.achievements || local.achievements,
              daily: data.dailyChallenge || local.daily
            });
          }
        })
        .catch(err => console.error('Failed to sync game data from database:', err));

      // Fetch leaderboard
      fetch(`${API_URL}/arithmetic-rain/leaderboard?date=${todayStr}`)
        .then(res => res.json())
        .then(data => {
          if (data) setLeaderboard(data);
        })
        .catch(err => console.error('Failed to fetch leaderboard:', err));
    }
  }, [user, API_URL, todayStr]);

  // Handle BGM changes
  useEffect(() => {
    if (view === 'game' && settings.music && !isPaused) {
      startBGM(true);
    } else {
      stopBGM();
    }
    return () => stopBGM();
  }, [view, settings.music, isPaused]);

  // Save settings helper
  const handleToggleSetting = (key) => {
    const nextSettings = { ...settings, [key]: !settings[key] };
    setSettings(nextSettings);
    
    // Save locally
    const local = loadLocalData();
    saveLocalData({ ...local, settings: nextSettings });

    // Save to server
    if (user && user.id) {
      fetch(`${API_URL}/arithmetic-rain/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, settings: nextSettings })
      }).catch(err => console.error('Failed to save settings:', err));
    }
  };

  // Reset stats helper
  const handleResetStatistics = () => {
    if (!window.confirm('Are you sure you want to reset all game statistics, history, and achievements?')) {
      return;
    }
    // Reset local
    const local = loadLocalData();
    const cleanStats = {
      gamesPlayed: 0, totalSolved: 0,
      highestScorePractice: 0, highestScoreClassic: 0,
      highestScoreEndless: 0, highestScoreTimed: 0,
      accuracySum: 0, avgResponseTime: 0,
      correctAnswers: 0, wrongAnswers: 0, missedQuestions: 0
    };
    saveLocalData({
      stats: cleanStats,
      settings: local.settings,
      achievements: [],
      daily: { lastPlayedDate: '', streak: 0, longestStreak: 0 }
    });
    setGameStats(cleanStats);
    setAchievementsList([]);
    setDailyInfo({ lastPlayedDate: '', streak: 0, longestStreak: 0 });
    setHistoryList([]);

    // Reset database
    if (user && user.id) {
      fetch(`${API_URL}/arithmetic-rain/reset-stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      }).catch(err => console.error('Failed to reset statistics:', err));
    }
  };

  // Start game flow
  const handleStartGame = (selectedMode) => {
    if (selectedMode === 'daily' && dailyInfo.lastPlayedDate === todayStr) {
      alert('You have already completed the Daily Challenge today! Check the leaderboard or try other modes.');
      return;
    }

    setMode(selectedMode);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setInputValue('');
    setQuestions([]);
    setGameTime(0);
    setIsPaused(false);
    
    totalCorrect.current = 0;
    totalWrong.current = 0;
    totalMissed.current = 0;
    totalAnswerTimes.current = [];

    if (selectedMode === 'classic' || selectedMode === 'endless' || selectedMode === 'daily') {
      setLives(3);
    } else {
      setLives(999); // Unlimited lives visual indicator
    }

    // Set PRNG if daily challenge
    if (selectedMode === 'daily') {
      const seed = getSeedFromDate(todayStr);
      dailyPrng.current = new SeededRandom(seed);
    } else {
      dailyPrng.current = null;
    }

    setView('countdown');
    setCountdown(3);
  };

  // Countdown timer effect
  useEffect(() => {
    if (view !== 'countdown') return;

    if (countdown > 0) {
      playAudioTone('tick', settings.sound);
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      playAudioTone('correct', settings.sound);
      setView('game');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      lastSpawnTime.current = Date.now();
      lastUpdateTime.current = Date.now();
    }
  }, [view, countdown, settings.sound]);

  // Main Active Game loops
  useEffect(() => {
    if (view !== 'game' || isPaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    // Spawn 1st question immediately
    spawnQuestion(0);

    const updateFrame = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTime.current) / 1000;
      lastUpdateTime.current = now;

      // Increment game duration
      setGameTime(prev => {
        const nextTime = prev + deltaTime;
        // Check Timed Challenge termination
        if (mode === 'timed' && nextTime >= timedDuration) {
          endGame();
          return timedDuration;
        }
        return nextTime;
      });

      // Update question positions
      setQuestions(prevQuestions => {
        let updated = [];
        let missedCount = 0;

        for (let q of prevQuestions) {
          // Adjust velocity by difficulty speed multiplier
          const speedFactor = getSpeedMultiplier(score);
          const fallRate = q.operator === '/' ? 12 : q.operator === '*' ? 20 : 24; // division = 12, multiplication = 20, addition/subtraction = 24
          const newY = q.y + fallRate * speedFactor * deltaTime;

          if (newY >= 98) {
            // Reached ground (missed)
            missedCount++;
          } else {
            updated.push({ ...q, y: newY });
          }
        }

        // Apply missed penalties
        if (missedCount > 0) {
          totalMissed.current += missedCount;
          setCombo(0);
          playAudioTone('damage', settings.sound);
          triggerVibration('damage', settings.vibration);
          setShakeContainer(true);
          setTimeout(() => setShakeContainer(false), 400);

          if (mode === 'classic' || mode === 'endless' || mode === 'daily') {
            setLives(prevLives => {
              const nextLives = prevLives - missedCount;
              if (nextLives <= 0) {
                // Delay slightly to prevent render race
                setTimeout(() => endGame(), 50);
                return 0;
              }
              return nextLives;
            });
          }

          // Instantly replace missed questions
          for (let i = 0; i < missedCount; i++) {
            const nextScore = score;
            const newQ = generateQuestion(nextScore, dailyPrng.current);
            newQ.x = Math.floor(Math.random() * 70) + 5; // 5% - 75%
            newQ.y = -5 - (i * 12);
            newQ.spawnTime = Date.now();
            updated.push(newQ);
          }
        }

        return updated;
      });

      // Auto-spawn questions periodically (every 3-4.5s depending on score)
      const spawnInterval = Math.max(2200, 4200 - score * 3);
      if (now - lastSpawnTime.current > spawnInterval) {
        setQuestions(prev => {
          if (prev.length < 2) { // maximum of 2 questions falling at once (reduced quantity)
            const newQ = generateQuestion(score, dailyPrng.current);
            newQ.x = Math.floor(Math.random() * 75) + 5;
            newQ.y = -8;
            newQ.spawnTime = Date.now();
            lastSpawnTime.current = now;
            return [...prev, newQ];
          }
          return prev;
        });
      }

      gameLoopRef.current = requestAnimationFrame(updateFrame);
    };

    lastUpdateTime.current = Date.now();
    gameLoopRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [view, mode, score, timedDuration, settings.sound, settings.vibration, isPaused]);

  const spawnQuestion = (offsetY = 0) => {
    setQuestions(prev => {
      if (prev.length >= 2) return prev; // maximum of 2 questions falling at once (reduced quantity)
      const newQ = generateQuestion(score, dailyPrng.current);
      newQ.x = Math.floor(Math.random() * 75) + 5;
      newQ.y = -5 - offsetY;
      newQ.spawnTime = Date.now();
      return [...prev, newQ];
    });
  };

  // Handle typing input
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    const numericVal = parseInt(val.trim(), 10);
    if (isNaN(numericVal)) return;

    // Check if the typed value matches any active question answer
    const matchIndex = questions.findIndex(q => q.answer === numericVal);

    if (matchIndex !== -1) {
      // Clear matched question
      const matchedQ = questions[matchIndex];
      
      // Calculate reaction speed
      const reaction = (Date.now() - matchedQ.spawnTime) / 1000;
      totalAnswerTimes.current.push(reaction);

      // Award points & combo
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo(prev => Math.max(prev, nextCombo));

      const pointsGained = calculatePoints(matchedQ.operator, nextCombo);
      setScore(prev => prev + pointsGained);
      totalCorrect.current += 1;

      // Haptics & SFX
      playAudioTone('correct', settings.sound);
      triggerVibration('correct', settings.vibration);

      // Trigger pop animation, clear input
      setInputValue('');
      setQuestions(prev => {
        let copy = [...prev];
        // Mark for animation
        copy[matchIndex].cleared = true;
        // Trigger quick remove after animation
        setTimeout(() => {
          setQuestions(current => current.filter(q => q.id !== matchedQ.id));
        }, 200);
        return copy;
      });

      // Instantly spawn a replacement question at the top
      setTimeout(() => spawnQuestion(0), 100);
    }
  };

  // Keyboard Enter handler
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // If we pressed Enter/Space and didn't clear anything, it counts as a wrong answer
      if (inputValue.trim() !== '') {
        totalWrong.current += 1;
        playAudioTone('wrong', settings.sound);
        triggerVibration('wrong', settings.vibration);
        // Clean input
        setInputValue('');
      }
    }
  };

  // Keypad trigger
  const handleKeypadPress = (num) => {
    playAudioTone('tick', settings.sound);
    triggerVibration('tap', settings.vibration);
    
    let nextVal = inputValue;
    if (num === 'C') {
      nextVal = '';
    } else if (num === '-') {
      if (nextVal === '') nextVal = '-';
    } else {
      if (nextVal === '-' && num === '0') return; // no -0
      nextVal += num;
    }

    setInputValue(nextVal);
    // Trigger input match check manually
    handleInputChange({ target: { value: nextVal } });
  };

  // End Game & Submit stats
  const endGame = () => {
    stopBGM();
    playAudioTone('gameover', settings.sound);
    triggerVibration('gameover', settings.vibration);

    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    setView('results');

    // Calculate final metrics
    const totalTaps = totalCorrect.current + totalWrong.current;
    const sessionAccuracy = totalTaps > 0 ? parseFloat(((totalCorrect.current / totalTaps) * 100).toFixed(1)) : 0;
    
    let sumTime = 0;
    totalAnswerTimes.current.forEach(t => sumTime += t);
    const sessionAvgResponseTime = totalCorrect.current > 0 ? parseFloat((sumTime / totalCorrect.current).toFixed(2)) : 0;

    const { coins: earnedCoins, xp: earnedXp } = getSessionRewards(score, mode);

    // Update frontend local profile Career Coins & XP
    const nextCoins = globalCoins + earnedCoins;
    const nextXp = globalXp + earnedXp;
    setGlobalCoins(nextCoins);
    setGlobalXp(nextXp);
    localStorage.setItem('cp_coins', String(nextCoins));
    localStorage.setItem('cp_xp', String(nextXp));

    // Show celebration confetti on great scores!
    if (score >= 250 || mode === 'daily') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    // Submit to database
    if (user && user.id) {
      const payload = {
        score,
        accuracy: sessionAccuracy,
        correct: totalCorrect.current,
        wrong: totalWrong.current,
        missed: totalMissed.current,
        combo: maxCombo,
        duration: Math.round(gameTime),
        coins: earnedCoins,
        xp: earnedXp,
        mode,
        date: todayStr
      };

      if (mode === 'daily') {
        fetch(`${API_URL}/arithmetic-rain/save-daily`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            userName: user.name || 'AI Scholar',
            score,
            accuracy: sessionAccuracy,
            duration: Math.round(gameTime),
            correct: totalCorrect.current,
            wrong: totalWrong.current,
            missed: totalMissed.current,
            combo: maxCombo,
            date: todayStr
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              if (data.leaderboard) setLeaderboard(data.leaderboard);
              if (data.dailyChallenge) setDailyInfo(data.dailyChallenge);
              if (data.statistics) setGameStats(data.statistics);
              if (data.achievements) setAchievementsList(data.achievements);
            }
          })
          .catch(err => console.error('Failed to submit daily score:', err));
      } else {
        fetch(`${API_URL}/arithmetic-rain/save-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, session: payload })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              if (data.statistics) setGameStats(data.statistics);
              if (data.achievements) setAchievementsList(data.achievements);
            }
          })
          .catch(err => console.error('Failed to save session stats:', err));
      }
    }
  };

  return (
    <div className={`rain-game-wrapper ${shakeContainer ? 'rain-shake' : ''}`}>
      {showConfetti && <ConfettiManager duration={5000} />}

      {/* header */}
      <div className="rain-back-header">
        <button className="premium-btn" onClick={onBack} style={{ borderRadius: '14px', padding: '8px 16px', fontSize: '12px' }}>
          ← Back to Hub
        </button>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontWeight: 800 }}>
          <span style={{ color: '#EAB308' }}>🪙 {globalCoins} Coins</span>
          <span style={{ color: '#A855F7' }}>✨ {globalXp} XP</span>
        </div>
      </div>

      {/* VIEW: MENU */}
      {view === 'menu' && (
        <div className="fade-in-section">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 className="text-gradient" style={{ fontSize: '32px', fontFamily: 'Outfit', fontWeight: 900 }}>
              Arithmetic Rain
            </h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '13px', marginTop: '6px' }}>
              Dodge the storm by solving arithmetic equations rapidly. Accumulate Coins and progress your learning path!
            </p>
          </div>

          <div className="rain-menu-grid">
            {/* LEFT: Game Modes */}
            <div className="premium-glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'Outfit', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                Select Game Mode
              </h2>

              <div className="rain-mode-card" onClick={() => handleStartGame('practice')}>
                <div style={{ fontSize: '28px' }}>🎓</div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Practice Mode</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '2px' }}>
                    Unlimited gameplay, no lives, ideal for warmups. Pausing allowed.
                  </p>
                </div>
              </div>

              <div className="rain-mode-card" onClick={() => handleStartGame('classic')}>
                <div style={{ fontSize: '28px' }}>⚔️</div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Classic Mode</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '2px' }}>
                    3 Lives. Equations speed up over time. Hit bottom and lose a life.
                  </p>
                </div>
              </div>

              <div className="rain-mode-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} onClick={() => handleStartGame('timed')}>
                  <div style={{ fontSize: '28px' }}>⏱️</div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Timed Challenge</h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '2px' }}>
                      Highest score wins under the clock. Select duration below.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', marginLeft: '44px' }}>
                  {[120, 300, 600].map(dur => (
                    <button
                      key={dur}
                      className="premium-btn"
                      onClick={() => setTimedDuration(dur)}
                      style={{
                        background: timedDuration === dur ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.08)',
                        fontSize: '10px',
                        padding: '6px 12px',
                        borderRadius: '8px'
                      }}
                    >
                      {dur / 60} Mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="rain-mode-card" onClick={() => handleStartGame('endless')}>
                <div style={{ fontSize: '28px' }}>♾️</div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Endless Mode</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '2px' }}>
                    3 Lives. Continues forever, scaling difficulty to extreme margins.
                  </p>
                </div>
              </div>

              <div className={`rain-mode-card ${dailyInfo.lastPlayedDate === todayStr ? 'active' : ''}`} onClick={() => handleStartGame('daily')}>
                <div style={{ fontSize: '28px' }}>🔥</div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Daily Challenge</h3>
                    {dailyInfo.streak > 0 && <span style={{ color: '#EF4444', fontWeight: 900, fontSize: '11px' }}>🔥 {dailyInfo.streak} Day Streak</span>}
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '2px' }}>
                    One seed sequence shared with all scholars. Double Rewards (+50 Coins, +100 XP).
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: Stats / settings panel */}
            <div className="premium-glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div className="rain-tabs">
                <button className={`rain-tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Stats</button>
                <button className={`rain-tab ${activeTab === 'achievements' ? 'active' : ''}`} onClick={() => setActiveTab('achievements')}>Badges</button>
                <button className={`rain-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
                <button className={`rain-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Logs</button>
              </div>

              {/* STATS PANEL */}
              {activeTab === 'stats' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-sub)' }}>Games Played:</span>
                    <span style={{ fontWeight: 800 }}>{gameStats?.gamesPlayed || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-sub)' }}>Equations Solved:</span>
                    <span style={{ fontWeight: 800 }}>{gameStats?.totalSolved || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-sub)' }}>Avg Response:</span>
                    <span style={{ fontWeight: 800 }}>{gameStats?.avgResponseTime || 0}s</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-sub)' }}>Overall Accuracy:</span>
                    <span style={{ fontWeight: 800 }}>
                      {gameStats?.gamesPlayed > 0 ? ((gameStats.accuracySum || 0) / gameStats.gamesPlayed).toFixed(1) : 100}%
                    </span>
                  </div>

                  <h3 style={{ fontSize: '13px', fontWeight: 900, marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>Personal Highs:</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '8px' }}>
                      <div style={{ color: 'var(--text-sub)' }}>Classic</div>
                      <div style={{ fontWeight: 800, fontSize: '14px' }}>{gameStats?.highestScoreClassic || 0}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '8px' }}>
                      <div style={{ color: 'var(--text-sub)' }}>Endless</div>
                      <div style={{ fontWeight: 800, fontSize: '14px' }}>{gameStats?.highestScoreEndless || 0}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '8px' }}>
                      <div style={{ color: 'var(--text-sub)' }}>Timed</div>
                      <div style={{ fontWeight: 800, fontSize: '14px' }}>{gameStats?.highestScoreTimed || 0}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '8px' }}>
                      <div style={{ color: 'var(--text-sub)' }}>Practice</div>
                      <div style={{ fontWeight: 800, fontSize: '14px' }}>{gameStats?.highestScorePractice || 0}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACHIEVEMENTS PANEL */}
              {activeTab === 'achievements' && (
                <div className="rain-achievements-list">
                  {[
                    { id: 'novice', title: 'Math Novice', desc: 'Solve 10 arithmetic questions.', icon: '🥉' },
                    { id: 'scholar', title: 'Math Scholar', desc: 'Solve 100 arithmetic questions.', icon: '🥈' },
                    { id: 'einstein', title: 'Arithmetic Einstein', desc: 'Solve 500 arithmetic questions.', icon: '🧠' },
                    { id: 'perfectionist', title: 'Perfect Brain', desc: 'Complete session with 100% accuracy (min 15).', icon: '💯' },
                    { id: 'rain_master', title: 'Rain Master', desc: 'Score 1000+ points in a single session.', icon: '👑' },
                    { id: 'endless_survivor', title: 'Endless Survivor', desc: 'Score 500+ in Endless mode.', icon: '🛡️' },
                    { id: 'speed_demon', title: 'Speed Demon', desc: 'Response time under 1.5s (min 10).', icon: '⚡' },
                    { id: 'daily_commuter', title: 'Daily Commuter', desc: 'Play Daily Challenge 3 days in a row.', icon: '📅' }
                  ].map(ach => {
                    const unlocked = achievementsList.includes(ach.id);
                    return (
                      <div key={ach.id} className={`rain-achievement-card ${unlocked ? 'unlocked' : ''}`}>
                        <div style={{ fontSize: '24px', opacity: unlocked ? 1 : 0.25 }}>{ach.icon}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '12px', color: unlocked ? '#fff' : 'rgba(255,255,255,0.4)' }}>{ach.title}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-sub)' }}>{ach.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SETTINGS PANEL */}
              {activeTab === 'settings' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="rain-settings-row">
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>Background Music</span>
                    <label className="rain-switch">
                      <input type="checkbox" checked={settings.music} onChange={() => handleToggleSetting('music')} />
                      <span className="rain-slider"></span>
                    </label>
                  </div>
                  <div className="rain-settings-row">
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>Sound Effects</span>
                    <label className="rain-switch">
                      <input type="checkbox" checked={settings.sound} onChange={() => handleToggleSetting('sound')} />
                      <span className="rain-slider"></span>
                    </label>
                  </div>
                  <div className="rain-settings-row">
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>Haptic Vibrations</span>
                    <label className="rain-switch">
                      <input type="checkbox" checked={settings.vibration} onChange={() => handleToggleSetting('vibration')} />
                      <span className="rain-slider"></span>
                    </label>
                  </div>
                  <button onClick={handleResetStatistics} className="premium-btn" style={{ marginTop: '20px', borderRadius: '12px', padding: '10px', fontSize: '11px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    Reset Game Statistics
                  </button>
                </div>
              )}

              {/* HISTORY LOGGER PANEL */}
              {activeTab === 'history' && (
                <div className="rain-history-list">
                  {historyList.length === 0 ? (
                    <div style={{ fontSize: '11px', color: 'var(--text-sub)', textAlign: 'center', padding: '20px' }}>No session logs saved yet.</div>
                  ) : (
                    historyList.map((h, idx) => (
                      <div key={idx} className="rain-history-card">
                        <div>
                          <div style={{ fontWeight: 800, textTransform: 'capitalize' }}>{h.mode} Mode</div>
                          <div style={{ color: 'var(--text-sub)', fontSize: '9px', marginTop: '2px' }}>{new Date(h.date).toLocaleDateString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: '#A855F7' }}>{h.score} pts</div>
                          <div style={{ fontSize: '9px', color: '#22c55e' }}>🪙 +{h.coins}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: COUNTDOWN */}
      {view === 'countdown' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }} className="fade-in-section">
          <div style={{ fontSize: '72px', fontWeight: 900, color: 'var(--primary)', fontFamily: 'Outfit', animation: 'pulseGlow 1s infinite' }}>
            {countdown > 0 ? countdown : 'START!'}
          </div>
          <p style={{ color: 'var(--text-sub)', fontSize: '14px', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Prepare Mental Mathematics
          </p>
        </div>
      )}

      {/* VIEW: GAMEPLAY ACTIVE */}
      {view === 'game' && (
        <div className="fade-in-section">
          {/* Top Panel Indicators */}
          <div className="premium-glass-card" style={{ padding: '12px 20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>SCORE</span>
                <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'JetBrains Mono', color: '#fff' }}>{score}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>COMBO</span>
                <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'JetBrains Mono', color: '#D946EF' }}>x{combo}</div>
              </div>
            </div>

            <div>
              <button 
                onClick={() => setIsPaused(true)}
                className="premium-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ⏸️ Pause
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {mode === 'timed' ? (
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>TIME REMAINING</span>
                  <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'JetBrains Mono', color: gameTime > timedDuration - 10 ? '#EF4444' : '#fff' }}>
                    {Math.max(0, Math.floor(timedDuration - gameTime))}s
                  </div>
                </div>
              ) : (
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>TIME</span>
                  <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'JetBrains Mono' }}>{Math.floor(gameTime)}s</div>
                </div>
              )}

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>LIVES</span>
                <div style={{ display: 'flex', gap: '4px', marginTop: '2px', fontSize: '18px' }}>
                  {mode === 'practice' || mode === 'timed' ? (
                    <span style={{ color: '#22C55E', fontWeight: 800, fontSize: '14px' }}>UNLIMITED</span>
                  ) : (
                    Array.from({ length: 3 }).map((_, i) => (
                      <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fall Area */}
          <div className={`rain-play-container ${shakeContainer ? 'shake-border' : ''}`} style={{ position: 'relative' }}>
            {isPaused && (
              <div 
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(6, 2, 15, 0.9)',
                  backdropFilter: 'blur(16px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 100,
                  animation: 'fadeIn 0.25s ease-out'
                }}
              >
                <div 
                  className="premium-glass-card" 
                  style={{ 
                    padding: '40px', 
                    borderRadius: '28px', 
                    textAlign: 'center',
                    maxWidth: '420px',
                    width: '90%',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(139, 92, 246, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <div 
                    style={{ 
                      width: '70px', 
                      height: '70px', 
                      borderRadius: '50%', 
                      background: 'rgba(139, 92, 246, 0.15)', 
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '32px',
                      marginBottom: '20px',
                      boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)'
                    }}
                  >
                    ⏸️
                  </div>

                  <h2 className="text-gradient" style={{ fontSize: '30px', fontFamily: 'Outfit', fontWeight: 900, marginBottom: '8px' }}>
                    Game Paused
                  </h2>
                  <p style={{ color: 'var(--text-sub)', fontSize: '13px', marginBottom: '24px' }}>
                    Take a breath! Your progress is safe.
                  </p>

                  <div 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '12px', 
                      width: '100%', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '16px',
                      padding: '16px',
                      marginBottom: '28px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Score</div>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>{score}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '1px' }}>Mode</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#A855F7', marginTop: '6px', textTransform: 'capitalize' }}>{mode}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    <button 
                      className="premium-btn" 
                      onClick={() => setIsPaused(false)}
                      style={{ 
                        padding: '14px', 
                        borderRadius: '16px', 
                        fontSize: '14px',
                        width: '100%'
                      }}
                    >
                      ▶️ Resume Challenge
                    </button>
                    <button 
                      className="premium-btn" 
                      onClick={endGame}
                      style={{ 
                        padding: '14px', 
                        borderRadius: '16px', 
                        fontSize: '14px', 
                        width: '100%',
                        background: 'rgba(239, 68, 68, 0.15)', 
                        color: '#EF4444', 
                        border: '1px solid rgba(239, 68, 68, 0.3)' 
                      }}
                    >
                      🛑 End & Save Session
                    </button>
                  </div>
                </div>
              </div>
            )}
            {questions.map(q => (
              <div
                key={q.id}
                className={`rain-bubble rain-bubble-${q.operator === '+' ? 'add' : q.operator === '-' ? 'sub' : q.operator === '*' ? 'mul' : 'div'} ${q.cleared ? 'rain-pop-effect' : ''}`}
                style={{
                  left: `${q.x}%`,
                  top: `${q.y}%`,
                  transform: 'translate3d(0, 0, 0)'
                }}
              >
                {q.text}
              </div>
            ))}
            <div className="rain-danger-zone" />
          </div>

          {/* Text input input field */}
          <div className="rain-input-wrapper">
            <input
              type="text"
              pattern="[0-9\-]*"
              inputMode="numeric"
              className="rain-input-field"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="?"
              ref={el => {
                if (el) {
                  el.focus({ preventScroll: true });
                }
              }}
            />
            {mode === 'practice' && (
              <button
                className="premium-btn"
                onClick={endGame}
                style={{ borderRadius: '12px', padding: '12px 24px', fontSize: '14px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                End Practice
              </button>
            )}
          </div>

          {/* Numeric keypad helper (Responsive for mobile players) */}
          <div className="rain-keypad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', 'C'].map(char => (
              <button key={char} className="rain-keypad-btn" onClick={() => handleKeypadPress(char)}>
                {char}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: RESULTS SUMMARY */}
      {view === 'results' && (
        <div className="fade-in-section premium-glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏆</div>
          <h2 className="text-gradient" style={{ fontSize: '28px', fontFamily: 'Outfit', fontWeight: 900 }}>
            {mode === 'daily' ? 'Daily Challenge Complete!' : 'Game Over'}
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '13px', marginTop: '4px' }}>
            Here is your mental math performance report:
          </p>

          <div className="rain-results-grid">
            <div className="rain-metric-box">
              <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>FINAL SCORE</div>
              <div className="rain-metric-val" style={{ color: '#D946EF' }}>{score}</div>
            </div>
            <div className="rain-metric-box">
              <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>SOLVED</div>
              <div className="rain-metric-val" style={{ color: '#4ADE80' }}>{totalCorrect.current}</div>
            </div>
            <div className="rain-metric-box">
              <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>ACCURACY</div>
              <div className="rain-metric-val" style={{ color: '#38BDF8' }}>
                {totalCorrect.current + totalWrong.current > 0
                  ? ((totalCorrect.current / (totalCorrect.current + totalWrong.current)) * 100).toFixed(0)
                  : 100}%
              </div>
            </div>
            <div className="rain-metric-box">
              <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>MAX COMBO</div>
              <div className="rain-metric-val" style={{ color: '#A855F7' }}>x{maxCombo}</div>
            </div>
            <div className="rain-metric-box">
              <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>AVG REACTION</div>
              <div className="rain-metric-val">
                {totalCorrect.current > 0
                  ? (totalAnswerTimes.current.reduce((a, b) => a + b, 0) / totalCorrect.current).toFixed(2)
                  : 0}s
              </div>
            </div>
            <div className="rain-metric-box">
              <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>REWARDS</div>
              <div className="rain-metric-val" style={{ color: '#EAB308', fontSize: '18px', display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                <span>🪙 +{getSessionRewards(score, mode).coins} Coins</span>
                <span>✨ +{getSessionRewards(score, mode).xp} XP</span>
              </div>
            </div>
          </div>

          {/* Daily leaderboard panel */}
          {mode === 'daily' && (
            <div style={{ marginTop: '24px', textAlign: 'left' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, fontFamily: 'Outfit', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '10px' }}>
                Today's Leaderboard Rankings
              </h3>
              <div className="rain-leaderboard-list">
                {leaderboard.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-sub)', textAlign: 'center', padding: '16px' }}>No rankings logged yet today. Be the first!</div>
                ) : (
                  leaderboard.map((entry, idx) => (
                    <div key={idx} className={`rain-leaderboard-card ${entry.userId === user?.id ? 'highlight' : ''}`}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="rain-leaderboard-rank">#{idx + 1}</span>
                        <span style={{ fontWeight: entry.userId === user?.id ? 800 : 500 }}>{entry.userName}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontWeight: 800 }}>
                        <span style={{ color: '#D946EF' }}>{entry.score} pts</span>
                        <span style={{ color: 'var(--text-sub)', fontSize: '11px' }}>({entry.duration}s)</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Buttons bar */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
            <button className="premium-btn" onClick={() => handleStartGame(mode)} style={{ padding: '12px 28px', borderRadius: '16px' }}>
              Play Again
            </button>
            <button className="premium-btn" onClick={() => setView('menu')} style={{ padding: '12px 28px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)' }}>
              Home Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
