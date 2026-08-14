import React, { useState, useEffect } from 'react';
import { reasoningQuizQuestions } from '../reasoningQuizData';

export default function ReasoningPracticePage({ onBack, t, onOpenSettings }) {
  // Topic definitions
  const topics = [
    { id: 'series', name: 'Series', icon: '📈', totalQs: 15 },
    { id: 'coding-decoding', name: 'Coding-Decoding', icon: '🔐', totalQs: 15 },
    { id: 'syllogism', name: 'Syllogism', icon: '🧠', totalQs: 15 },
    { id: 'blood-relations', name: 'Blood Relations', icon: '👪', totalQs: 20 },
    { id: 'directions', name: 'Directions', icon: '🧭', totalQs: 15 },
    { id: 'puzzles', name: 'Puzzles', icon: '🧩', totalQs: 15 },
    { id: 'logical-sequence', name: 'Logical Sequence', icon: '⛓️', totalQs: 30 },
    { id: 'verbal-reasoning', name: 'Verbal Reasoning', icon: '🗣️', totalQs: 30 },
    { id: 'non-verbal-reasoning', name: 'NON-VERBAL REASONING', icon: '📐', totalQs: 30 },
    { id: 'data-interpretation', name: 'Data Interpretation', icon: '📊', totalQs: 15 }
  ];

  // States
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [mode, setMode] = useState('practice'); // 'practice' | 'test' | 'review'
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // 'all' | 'easy' | 'medium' | 'hard'
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { qId: selectedOption }
  const [confirmedAnswers, setConfirmedAnswers] = useState({}); // { qId: true } (locked for immediate feedback in practice mode)
  const [quizFinished, setQuizFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0); // in seconds
  const [progressData, setProgressData] = useState({});
  const [hasNoAttempt, setHasNoAttempt] = useState(false);
  const [attemptedQIds, setAttemptedQIds] = useState([]);

  // Load attempted question IDs on mount
  useEffect(() => {
    const saved = localStorage.getItem('cp_reasoning_attempted_qids');
    if (saved) {
      try {
        setAttemptedQIds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const markQuestionAttempted = (qId) => {
    setAttemptedQIds(prev => {
      if (prev.includes(qId)) return prev;
      const updated = [...prev, qId];
      localStorage.setItem('cp_reasoning_attempted_qids', JSON.stringify(updated));
      return updated;
    });
  };

  // Load overall progress from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cp_reasoning_progress');
    if (saved) {
      try {
        setProgressData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Update progress in local storage
  const saveProgress = (topicId, newAttempted, newCorrect) => {
    setProgressData(prev => {
      const updated = {
        ...prev,
        [topicId]: {
          attempted: Math.min(newAttempted, topics.find(t => t.id === topicId)?.totalQs || 15),
          correct: newCorrect
        }
      };
      localStorage.setItem('cp_reasoning_progress', JSON.stringify(updated));
      return updated;
    });
  };

  // Start a learning or test session
  const startSession = async (topicId) => {
    if (mode === 'review') {
      const savedAttempt = localStorage.getItem(`cp_reasoning_last_attempt_${topicId}`);
      if (!savedAttempt) {
        setHasNoAttempt(true);
        setSelectedTopic(topicId);
        return;
      }
      try {
        const attempt = JSON.parse(savedAttempt);
        setQuizQuestions(attempt.questions || []);
        const savedAnswers = {};
        attempt.userAnswers.forEach(ua => {
          savedAnswers[ua.qId] = ua.selected;
        });
        setUserAnswers(savedAnswers);
        setSelectedTopic(topicId);
        setQuizFinished(true);
        setHasNoAttempt(false);
        return;
      } catch (e) {
        console.error(e);
      }
    }

    // Determine query parameters for Practice or Test Mode
    let url = '/api/reasoning/quiz';
    if (mode === 'test') {
      url += '?testMode=true';
    } else {
      url += `?topic=${topicId}`;
      if (difficultyFilter !== 'all' && topicId !== 'series') {
        url += `&difficulty=${difficultyFilter}`;
      }
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        alert("Failed to load quiz questions from server.");
        return;
      }
      const questions = await response.json();
      setQuizQuestions(questions);
      setSelectedTopic(topicId);
      setCurrentIdx(0);
      setUserAnswers({});
      setConfirmedAnswers({});
      setQuizFinished(false);
      setStartTime(Date.now());
      setTimeTaken(0);
      setHasNoAttempt(false);
    } catch (err) {
      console.error("Error fetching questions:", err);
      alert("Error contacting the backend quiz server.");
    }
  };

  // Handle option select
  const selectOption = (qId, option) => {
    if (mode === 'practice' && confirmedAnswers[qId]) return; // locked in practice mode
    
    setUserAnswers(prev => ({
      ...prev,
      [qId]: option
    }));

    if (mode === 'practice') {
      setConfirmedAnswers(prev => ({
        ...prev,
        [qId]: true
      }));
      // Auto-update progress for practice mode immediately
      const q = quizQuestions.find(curr => curr.id === qId);
      const isCorrect = option === q.answer;
      const topicId = selectedTopic;
      const currentProgress = progressData[topicId] || { attempted: 0, correct: 0 };
      saveProgress(topicId, currentProgress.attempted + 1, currentProgress.correct + (isCorrect ? 1 : 0));
      markQuestionAttempted(qId);
    }
  };

  // Submit test
  const submitTest = () => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setTimeTaken(elapsed);
    setQuizFinished(true);

    // Calculate score
    let score = 0;
    const details = [];
    quizQuestions.forEach(q => {
      const selected = userAnswers[q.id];
      const isCorrect = selected === q.answer;
      if (isCorrect) score++;
      details.push({
        qId: q.id,
        selected: selected || 'Skipped',
        isCorrect
      });
    });

    // Save final attempt details (including full questions array so review doesn't need API calls!)
    const attemptPayload = {
      topicId: selectedTopic,
      mode,
      difficulty: difficultyFilter,
      score,
      total: quizQuestions.length,
      timeTaken: elapsed,
      userAnswers: details,
      questions: quizQuestions
    };
    localStorage.setItem(`cp_reasoning_last_attempt_${selectedTopic}`, JSON.stringify(attemptPayload));

    // Update overall progress tracker
    const currentProgress = progressData[selectedTopic] || { attempted: 0, correct: 0 };
    saveProgress(selectedTopic, currentProgress.attempted + quizQuestions.length, currentProgress.correct + score);

    // Also mark all answered questions as attempted
    quizQuestions.forEach(q => {
      if (userAnswers[q.id]) {
        markQuestionAttempted(q.id);
      }
    });
  };

  const getAccuracy = (correct, attempted) => {
    if (!attempted) return '0%';
    return `${Math.round((correct / attempted) * 100)}%`;
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Back to selection screen
  const exitSession = () => {
    setSelectedTopic(null);
    setQuizQuestions([]);
    setCurrentIdx(0);
    setUserAnswers({});
    setConfirmedAnswers({});
    setQuizFinished(false);
    setHasNoAttempt(false);
  };

  // RENDER INTERACTION PAGES
  if (selectedTopic) {
    const currentQuestion = quizQuestions[currentIdx];
    
    // Attempted count
    const correctCount = quizQuestions.filter(q => userAnswers[q.id] === q.answer).length;
    const answeredCount = quizQuestions.filter(q => userAnswers[q.id]).length;

    // Review logic if there was no attempt
    if (hasNoAttempt) {
      return (
        <div style={styles.container}>
          <style>{customCSS}</style>
          <div style={styles.header}>
            <button style={styles.backBtn} onClick={exitSession}>← Back</button>
            <h2 style={styles.title}>{topics.find(t => t.id === selectedTopic)?.name} Review</h2>
          </div>
          <div style={styles.content}>
            <div style={styles.emptyState}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No Previous Test Attempt Found</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '14px', marginBottom: '24px', maxWidth: '400px' }}>
                You must complete at least one test session in Test Mode before you can review your answers here.
              </p>
              <div 
                className="reasoning-action-btn"
                role="button"
                onClick={() => {
                  setMode('test');
                  startSession(selectedTopic);
                }}
              >
                Start a New Test
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (quizFinished) {
      // Results screen
      const accuracyPercent = getAccuracy(correctCount, quizQuestions.length);
      const isReviewMode = mode === 'review';

      return (
        <div style={styles.container}>
          <style>{customCSS}</style>
          <div style={styles.header}>
            <button style={styles.backBtn} onClick={exitSession}>← Exit Review</button>
            <h2 style={styles.title}>Results: {selectedTopic === 'mixed_test' || mode === 'test' ? 'Mixed Reasoning Test' : topics.find(t => t.id === selectedTopic)?.name}</h2>
          </div>

          <div style={styles.content}>
            <div style={styles.resultSummaryCard}>
              <div style={styles.scoreCircle}>
                <span style={styles.scoreText}>{correctCount} / {quizQuestions.length}</span>
                <span style={styles.scoreSub}>Score</span>
              </div>
              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <span style={styles.statVal}>{accuracyPercent}</span>
                  <span style={styles.statLbl}>Accuracy</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statVal}>{isReviewMode ? '—' : formatTime(timeTaken)}</span>
                  <span style={styles.statLbl}>Time Taken</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statVal}>{quizQuestions.length - correctCount}</span>
                  <span style={styles.statLbl}>Incorrect</span>
                </div>
              </div>
            </div>

            <h3 style={styles.sectionHeader}>Question Review & Detailed Solutions</h3>
            <div style={styles.reviewList}>
              {quizQuestions.map((q, idx) => {
                const selected = userAnswers[q.id];
                const isCorrect = selected === q.answer;
                const isSkipped = !selected;

                return (
                  <div key={q.id} style={styles.reviewCard}>
                    <div style={styles.reviewHeader}>
                      <span style={{
                        ...styles.badge,
                        background: isSkipped ? 'rgba(245, 158, 11, 0.15)' : isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isSkipped ? '#f59e0b' : isCorrect ? '#10b981' : '#ef4444',
                        border: isSkipped ? '1px solid #f59e0b' : isCorrect ? '1px solid #10b981' : '1px solid #ef4444',
                      }}>
                        {isSkipped ? '⚠️ SKIPPED' : isCorrect ? '✅ CORRECT' : '❌ INCORRECT'}
                      </span>
                    </div>

                    <div style={styles.reviewQuestion}>
                      Q{idx + 1}. {q.q}
                    </div>

                    {/* Vertical options list for reference in review */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '12px 0' }}>
                      {q.options.map(opt => {
                        const isUserSelected = selected === opt;
                        const isCorrectOpt = opt === q.answer;
                        
                        let optStyle = {
                          fontSize: '13px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'rgba(255,255,255,0.01)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        };
                        
                        if (isUserSelected) {
                          optStyle.borderColor = isCorrectOpt ? '#10b981' : '#ef4444';
                          optStyle.background = isCorrectOpt ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                          optStyle.color = isCorrectOpt ? '#10b981' : '#ef4444';
                          optStyle.fontWeight = '700';
                        } else if (isCorrectOpt) {
                          optStyle.borderColor = '#10b981';
                          optStyle.background = 'rgba(16, 185, 129, 0.04)';
                          optStyle.color = '#10b981';
                          optStyle.fontWeight = '700';
                        }

                        return (
                          <div key={opt} style={optStyle}>
                            <span>{opt}</span>
                            <span style={{ fontSize: '11px', fontWeight: '800' }}>
                              {isUserSelected && (isCorrectOpt ? 'Your Answer - Correct' : 'Your Answer - Incorrect')}
                              {!isUserSelected && isCorrectOpt && 'Correct Answer'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={styles.reviewAnswerSection}>
                      <div style={styles.reviewAnswerItem}>
                        <span style={styles.answerLabel}>Selected:</span>
                        <span style={{
                          fontWeight: 700,
                          color: isCorrect ? '#10b981' : '#ef4444'
                        }}>
                          {selected || 'None (Skipped)'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div style={styles.reviewAnswerItem}>
                          <span style={styles.answerLabel}>Correct:</span>
                          <span style={{ fontWeight: 700, color: '#10b981' }}>
                            {q.answer}
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={styles.solutionBox}>
                      <div style={styles.solutionTitle}>Worked Solution:</div>
                      <div style={styles.solutionText}>{q.explanation}</div>
                      {q.shortcut && (
                        <div style={{ ...styles.solutionText, marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                          <strong>💡 Shortcut/Tip:</strong> {q.shortcut}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={styles.btnRow}>
              {!isReviewMode && (
                <div 
                  className="reasoning-action-btn"
                  role="button"
                  style={{ background: 'var(--primary)', textAlign: 'center' }}
                  onClick={() => startSession(selectedTopic)}
                >
                  Retry Practice
                </div>
              )}
              <div 
                className="reasoning-cancel-btn"
                role="button"
                style={{ textAlign: 'center' }}
                onClick={exitSession}
              >
                Back to Selection
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Active session
    return (
      <div style={styles.container}>
        <style>{customCSS}</style>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={exitSession}>← Exit</button>
          <div style={{ textAlign: 'center' }}>
            <h2 style={styles.title}>{selectedTopic === 'mixed_test' || mode === 'test' ? 'Mixed Reasoning Test' : topics.find(t => t.id === selectedTopic)?.name}</h2>
            <span style={styles.modeSub}>{mode === 'practice' ? 'Practice Mode (Immediate Solution)' : 'Test Mode (Submit at End)'}</span>
          </div>
        </div>

        <div style={styles.content}>
          {/* Progress bar */}
          <div style={{ ...styles.progressWrapper, marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>
              <span>Question {currentIdx + 1} of {quizQuestions.length}</span>
              <span>Score: {correctCount}/{answeredCount}</span>
            </div>
          </div>

          {/* Question Box */}
          <div style={styles.questionCard}>
            <div style={styles.questionText}>
              Q{currentIdx + 1}. {currentQuestion.q}
            </div>

            {/* Options */}
            <div style={styles.optionsList}>
              {currentQuestion.options.map(opt => {
                const isSelected = userAnswers[currentQuestion.id] === opt;
                const isConfirmed = confirmedAnswers[currentQuestion.id];
                const isCorrectVal = opt === currentQuestion.answer;
                
                // Styling based on mode & confirmation state
                let optionStyle = { ...styles.optionButton };
                let className = "reasoning-option-btn";
                
                if (isSelected) {
                  className += " selected";
                  if (mode === 'practice') {
                    optionStyle.background = isCorrectVal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
                    optionStyle.borderColor = isCorrectVal ? '#10b981' : '#ef4444';
                    optionStyle.color = isCorrectVal ? '#10b981' : '#ef4444';
                  } else {
                    optionStyle.background = 'var(--bg-active)';
                    optionStyle.borderColor = 'var(--primary)';
                  }
                } else if (isConfirmed && isCorrectVal && mode === 'practice') {
                  className += " correct-answer";
                  // Show the correct answer if the user picked the wrong one in practice mode
                  optionStyle.background = 'rgba(16, 185, 129, 0.1)';
                  optionStyle.borderColor = '#10b981';
                }

                const isDisabled = isConfirmed && mode === 'practice';

                return (
                  <div
                    key={opt}
                    role="button"
                    className={className}
                    style={{
                      ...optionStyle,
                      cursor: isDisabled ? 'default' : 'pointer'
                    }}
                    onClick={() => {
                      if (!isDisabled) {
                        selectOption(currentQuestion.id, opt);
                      }
                    }}
                  >
                    <span>{opt}</span>
                    {mode === 'practice' && isSelected && (
                      <span style={{ fontWeight: 'bold' }}>{isCorrectVal ? '✅' : '❌'}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation box (Practice Mode only) */}
            {mode === 'practice' && confirmedAnswers[currentQuestion.id] && (
              <div style={styles.activeSolutionBox}>
                <div style={styles.solutionTitle}>worked Solution:</div>
                <div style={styles.solutionText}>{currentQuestion.explanation}</div>
                {currentQuestion.shortcut && (
                  <div style={{ ...styles.solutionText, marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                    <strong>💡 Shortcut:</strong> {currentQuestion.shortcut}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div style={styles.navRow}>
            <div
              role="button"
              className="reasoning-nav-btn"
              style={{
                opacity: currentIdx === 0 ? 0.5 : 1,
                cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                textAlign: 'center'
              }}
              onClick={() => {
                if (currentIdx > 0) {
                  setCurrentIdx(prev => Math.max(0, prev - 1));
                }
              }}
            >
              ← Previous
            </div>
            
            {currentIdx < quizQuestions.length - 1 ? (
              <div
                role="button"
                className="reasoning-nav-btn"
                style={{ textAlign: 'center' }}
                onClick={() => setCurrentIdx(prev => Math.min(quizQuestions.length - 1, prev + 1))}
              >
                Next →
              </div>
            ) : (
              mode === 'test' ? (
                <div
                  role="button"
                  className="reasoning-action-btn"
                  style={{ background: 'var(--primary)', textAlign: 'center' }}
                  onClick={submitTest}
                >
                  Finish Test 🏁
                </div>
              ) : (
                <div
                  role="button"
                  className="reasoning-action-btn"
                  style={{ background: 'var(--primary)', textAlign: 'center' }}
                  onClick={exitSession}
                >
                  Complete Practice 🎉
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // TOPIC SELECTION SCREEN
  return (
    <div style={styles.container} className="fade-in-section">
      <style>{customCSS}</style>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h2 style={styles.title}>Reasoning Practice</h2>
        <button style={styles.settingsBtn} onClick={onOpenSettings}>⚙️</button>
      </div>

      <div style={styles.content}>
        {/* Practice Config Panel */}
        <div style={styles.configCard}>
          <div style={styles.configSection}>
            <span style={styles.configLabel}>Practice Mode:</span>
            <div style={styles.btnGroup}>
              {[
                { id: 'practice', name: 'Practice' },
                { id: 'test', name: 'Test' },
                { id: 'review', name: 'Review Last' }
              ].map(m => (
                <div
                  key={m.id}
                  role="button"
                  className={`reasoning-group-btn ${mode === m.id ? 'active' : ''}`}
                  onClick={() => setMode(m.id)}
                >
                  {m.name}
                </div>
              ))}
            </div>
          </div>
          {mode === 'test' && (
            <div 
              className="reasoning-action-btn"
              role="button"
              style={{ background: 'var(--primary)', textAlign: 'center', marginTop: '8px' }}
              onClick={() => startSession('mixed_test')}
            >
              Start Global Test (30 Mixed Questions) 🚀
            </div>
          )}
        </div>

        {/* Topic Grid */}
        <div style={styles.topicGrid}>
          {topics.map(topic => {
            const topicQs = reasoningQuizQuestions.filter(q => q.topic === topic.id);
            const filteredQs = (topic.id === 'series' || difficultyFilter === 'all')
              ? topicQs
              : topicQs.filter(q => q.difficulty === difficultyFilter);

            const totalQsCount = filteredQs.length;

            return (
              <div key={topic.id} style={styles.topicCard} className="bento-card">
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon}>{topic.icon}</span>
                  <span style={styles.qsCount}>{totalQsCount} Questions</span>
                </div>
                <h3 style={styles.cardTitle}>{topic.name}</h3>

                <div
                  className="reasoning-card-start-btn"
                  role="button"
                  onClick={() => startSession(topic.id)}
                >
                  {mode === 'review' ? 'Review Solutions' : 'Start Practice →'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Scoped custom CSS to prevent global button styles override
const customCSS = `
  .reasoning-option-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    padding: 16px 20px;
    border-radius: 16px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    text-align: left;
    user-select: none;
    box-sizing: border-box;
    width: 100%;
  }

  .reasoning-option-btn:hover {
    background: var(--bg-active);
    border-color: var(--primary);
  }

  .reasoning-option-btn.selected {
    background: var(--bg-active);
    border-color: var(--primary);
  }

  .reasoning-option-btn.selected.correct-answer {
    background: rgba(16, 185, 129, 0.15);
    border-color: #10b981;
    color: #10b981;
  }

  .reasoning-option-btn.correct-answer {
    background: rgba(16, 185, 129, 0.1);
    border-color: #10b981;
  }

  .reasoning-group-btn {
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
    background: rgba(255,255,255,0.03);
    color: var(--text-sub);
    user-select: none;
  }

  .reasoning-group-btn:hover {
    border-color: var(--primary);
    color: var(--text-main);
  }

  .reasoning-group-btn.active {
    background: var(--primary);
    color: #fff;
    border-color: var(--primary);
  }

  .reasoning-card-start-btn {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    padding: 10px 16px;
    border-radius: 14px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: auto;
    text-align: center;
    user-select: none;
  }

  .reasoning-card-start-btn:hover {
    background: var(--bg-active);
    border-color: var(--primary);
  }

  .reasoning-nav-btn {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    padding: 12px 24px;
    border-radius: 16px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 800;
    transition: all 0.2s;
    flex: 1;
    user-select: none;
    box-sizing: border-box;
  }

  .reasoning-nav-btn:hover {
    background: var(--bg-active);
    border-color: var(--primary);
  }

  .reasoning-action-btn {
    background: var(--primary);
    color: #fff;
    padding: 12px 24px;
    border-radius: 16px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 800;
    transition: all 0.2s;
    flex: 1;
    user-select: none;
    box-sizing: border-box;
  }

  .reasoning-action-btn:hover {
    opacity: 0.95;
    box-shadow: 0 4px 12px rgba(4, 170, 109, 0.2);
  }

  .reasoning-cancel-btn {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border-color);
    color: var(--text-sub);
    padding: 12px 24px;
    border-radius: 16px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 800;
    transition: all 0.2s;
    flex: 1;
    user-select: none;
    box-sizing: border-box;
  }

  .reasoning-cancel-btn:hover {
    background: var(--bg-active);
    border-color: var(--primary);
    color: var(--text-main);
  }
`;

// PREMIUM GLASSMORPHISM INLINE STYLES
const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-mid)',
    color: 'var(--text-main)',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    paddingBottom: '80px',
    transition: 'background 0.3s ease, color 0.3s ease'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    background: 'var(--bg-start)',
    zIndex: 100
  },
  title: {
    fontSize: '20px',
    fontWeight: 900,
    fontFamily: 'Outfit, sans-serif',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  modeSub: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--primary)',
    display: 'block',
    marginTop: '2px'
  },
  backBtn: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-main)',
    padding: '8px 16px',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 700,
    transition: 'all 0.2s'
  },
  settingsBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: 'var(--text-main)'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px 16px'
  },
  configCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '16px 20px',
    marginBottom: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
  },
  configSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  },
  configLabel: {
    fontSize: '14px',
    fontWeight: 800,
    color: 'var(--text-sub)'
  },
  btnGroup: {
    display: 'flex',
    gap: '6px'
  },
  topicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px'
  },
  topicCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.25s',
    boxShadow: '0 8px 30px var(--card-shadow)',
    position: 'relative',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  },
  cardIcon: {
    fontSize: '32px'
  },
  qsCount: {
    fontSize: '11px',
    fontWeight: 800,
    color: 'var(--text-muted)',
    background: 'rgba(255,255,255,0.04)',
    padding: '4px 8px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 900,
    color: 'var(--text-main)',
    fontFamily: 'Outfit, sans-serif',
    marginBottom: '16px'
  },
  cardProgressWrapper: {
    marginBottom: '20px'
  },
  cardProgressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    fontWeight: 800,
    color: 'var(--text-sub)',
    marginBottom: '6px'
  },
  cardProgressBarBg: {
    background: 'rgba(255,255,255,0.06)',
    height: '6px',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  cardProgressBarFill: {
    background: 'var(--primary)',
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease'
  },
  progressWrapper: {
    marginBottom: '24px'
  },
  progressBarBg: {
    background: 'rgba(255,255,255,0.06)',
    height: '8px',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBarFill: {
    background: 'linear-gradient(90deg, var(--primary), var(--primary))',
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },
  questionCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  },
  questionText: {
    fontSize: '16px',
    fontWeight: 800,
    color: 'var(--text-main)',
    lineHeight: 1.5,
    marginBottom: '24px',
    whiteSpace: 'pre-line'
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  optionButton: {
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '16px 20px',
    fontSize: '14px',
    fontWeight: 700,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s',
    textAlign: 'left'
  },
  activeSolutionBox: {
    marginTop: '24px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '16px 20px',
    animation: 'fadeIn 0.3s ease'
  },
  solutionTitle: {
    fontSize: '12px',
    fontWeight: 900,
    color: 'var(--primary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px'
  },
  solutionText: {
    fontSize: '13px',
    color: 'var(--text-sub)',
    lineHeight: 1.5,
    whiteSpace: 'pre-line'
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px'
  },
  resultSummaryCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    flexWrap: 'wrap'
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '60px',
    border: '4px solid var(--primary)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(4, 170, 109, 0.05)',
    margin: '0 auto'
  },
  scoreText: {
    fontSize: '22px',
    fontWeight: 900,
    color: 'var(--text-main)'
  },
  scoreSub: {
    fontSize: '10px',
    fontWeight: 800,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginTop: '2px'
  },
  statsGrid: {
    flex: '1 1 300px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  statBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '12px',
    textAlign: 'center'
  },
  statVal: {
    fontSize: '18px',
    fontWeight: 900,
    color: 'var(--text-main)',
    display: 'block'
  },
  statLbl: {
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--text-muted)',
    marginTop: '4px'
  },
  sectionHeader: {
    fontSize: '16px',
    fontWeight: 900,
    fontFamily: 'Outfit, sans-serif',
    marginBottom: '16px',
    color: 'var(--text-main)'
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px'
  },
  reviewCard: {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  badge: {
    fontSize: '10px',
    fontWeight: 800,
    padding: '4px 8px',
    borderRadius: '6px'
  },
  difficultyBadge: {
    fontSize: '9px',
    fontWeight: 800,
    color: 'var(--text-muted)',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    padding: '3px 6px',
    borderRadius: '5px'
  },
  reviewQuestion: {
    fontSize: '14px',
    fontWeight: 800,
    color: 'var(--text-main)',
    lineHeight: 1.4,
    marginBottom: '14px',
    whiteSpace: 'pre-line'
  },
  reviewAnswerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '14px',
    fontSize: '12px'
  },
  reviewAnswerItem: {
    display: 'flex',
    gap: '8px'
  },
  answerLabel: {
    color: 'var(--text-muted)',
    width: '60px'
  },
  solutionBox: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '12px 16px'
  },
  solutionText: {
    fontSize: '12px',
    color: 'var(--text-sub)',
    lineHeight: 1.4,
    whiteSpace: 'pre-line'
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px'
  },
  btnRow: {
    display: 'flex',
    gap: '12px'
  }
};
