import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, useWindowDimensions, Animated, Easing } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface GameProps {
  onBack: () => void;
}

export default function ArithmeticRainGame({ onBack }: GameProps) {
  const { height: screenHeight } = useWindowDimensions();
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'gameover'>('welcome');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);

  const [equation, setEquation] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  const fallAnim = useRef(new Animated.Value(64)).current;
  const fallDuration = useRef(8000); // 8 seconds to fall

  // Generate a random math equation
  const generateEquation = () => {
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;

    if (op === '-' && num1 < num2) {
      // Avoid negative results for easy mode
      const temp = num1;
      num1 = num2;
      num2 = temp;
    }

    setEquation(`${num1} ${op} ${num2} = ?`);
    setCorrectAnswer(op === '+' ? num1 + num2 : num1 - num2);
    setUserAnswer('');
    
    // Reset falling position
    fallAnim.setValue(64);
    
    // Start falling animation
    Animated.timing(fallAnim, {
      toValue: screenHeight - 320,
      duration: fallDuration.current,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      // If animation completed without user answering, lose life
      if (finished) {
        handleMiss();
      }
    });
  };

  const handleMiss = () => {
    setLives(prev => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setGameState('gameover');
      } else {
        generateEquation();
      }
      return nextLives;
    });
  };

  const handleKeyPress = (val: string) => {
    if (gameState !== 'playing') return;

    if (val === 'DEL') {
      setUserAnswer(prev => prev.slice(0, -1));
    } else if (val === '-') {
      if (userAnswer === '') setUserAnswer('-');
    } else {
      const nextAns = userAnswer + val;
      setUserAnswer(nextAns);

      // Check answer instantly
      const parsedAns = parseInt(nextAns, 10);
      if (parsedAns === correctAnswer) {
        // Correct answer! Stop animation
        fallAnim.stopAnimation();
        setScore(s => {
          const nextScore = s + 10;
          if (nextScore > 0 && nextScore % 50 === 0) {
            // Speed up and level up
            setLevel(lvl => lvl + 1);
            fallDuration.current = Math.max(3000, fallDuration.current - 1000);
          }
          return nextScore;
        });
        generateEquation();
      }
    }
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    fallDuration.current = 8000;
    setGameState('playing');
    generateEquation();
  };

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      fallAnim.stopAnimation();
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity
          style={[styles.backBtn, { borderColor: colors.borderColor }]}
          onPress={() => {
            fallAnim.stopAnimation();
            onBack();
          }}
        >
          <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Exit</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>Arithmetic Rain</Text>
      </View>

      {gameState === 'welcome' && (
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 60, marginBottom: Spacing.two }}>🌧️</Text>
          <Text style={[styles.title, { color: colors.textMain, fontSize: 20 }]}>Arithmetic Rain</Text>
          <Text style={[styles.desc, { color: colors.textSub, textAlign: 'center', marginBottom: Spacing.four }]}>
            Solve the falling mathematical equations by typing the correct answers before they crash to the bottom of the screen!
          </Text>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={startGame}>
            <Text style={styles.btnText}>🎮 Start Game</Text>
          </TouchableOpacity>
        </View>
      )}

      {gameState === 'playing' && (
        <View style={{ flex: 1 }}>
          {/* Status bar */}
          <View style={styles.statusRow}>
            <Text style={{ color: colors.textSub, fontWeight: '800' }}>Level: {level}</Text>
            <Text style={{ color: colors.textSub, fontWeight: '800' }}>Lives: {'❤️'.repeat(lives)}</Text>
            <Text style={{ color: colors.primary, fontWeight: '900' }}>Score: {score}</Text>
          </View>

          {/* Falling Area */}
          <View style={styles.fallingArea}>
            <Animated.View style={[styles.fallingEquation, { top: fallAnim, backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
              <Text style={[styles.equationText, { color: colors.textMain }]}>{equation}</Text>
            </Animated.View>
          </View>

          {/* Answer display */}
          <View style={[styles.answerContainer, { borderBottomColor: colors.borderColor }]}>
            <Text style={[styles.answerText, { color: colors.textMain }]}>
              Your Answer: <Text style={{ color: colors.primary, fontWeight: '900' }}>{userAnswer || '?'}</Text>
            </Text>
          </View>

          {/* Keyboard inputs */}
          <View style={[styles.keyboard, { backgroundColor: colors.cardBg }]}>
            {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['-', '0', 'DEL']].map((row, rIdx) => (
              <View key={rIdx} style={styles.keyboardRow}>
                {row.map(key => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.keyBtn, { backgroundColor: colors.inputBg, borderColor: colors.borderColor }]}
                    onPress={() => handleKeyPress(key)}
                  >
                    <Text style={[styles.keyText, { color: colors.textMain }]}>{key}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}

      {gameState === 'gameover' && (
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 60, marginBottom: Spacing.two }}>💀</Text>
          <Text style={[styles.title, { color: '#ef4444', fontSize: 22 }]}>Game Over</Text>
          <Text style={{ color: colors.textSub, fontSize: 15, marginVertical: Spacing.two }}>
            You reached level <Text style={{ fontWeight: '900', color: colors.primary }}>{level}</Text>
          </Text>
          <Text style={{ color: colors.textSub, fontSize: 15, marginBottom: Spacing.four }}>
            Final score: <Text style={{ fontWeight: '900', color: colors.primary }}>{score}</Text>
          </Text>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={startGame}>
            <Text style={styles.btnText}>🔄 Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    gap: Spacing.two,
    zIndex: 10,
  },
  backBtn: {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  title: {
    fontWeight: '900',
    marginBottom: Spacing.one,
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing.five,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  fallingArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  fallingEquation: {
    position: 'absolute',
    left: '10%',
    width: '80%',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  equationText: {
    fontSize: 18,
    fontWeight: '900',
  },
  answerContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  answerText: {
    fontSize: 16,
    fontWeight: '700',
  },
  keyboard: {
    padding: Spacing.two,
    gap: Spacing.two,
  },
  keyboardRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  keyBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 18,
    fontWeight: '800',
  },
});
