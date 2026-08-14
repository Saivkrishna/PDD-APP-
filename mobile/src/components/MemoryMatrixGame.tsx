import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Alert, ScrollView } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface GameProps {
  onBack: () => void;
}

export default function MemoryMatrixGame({ onBack }: GameProps) {
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3); // 3x3 to start
  const [activeTilesCount, setActiveTilesCount] = useState(3);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  
  const [gameState, setGameState] = useState<'welcome' | 'memorize' | 'play' | 'success' | 'fail' | 'gameover'>('welcome');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  const scheme = useColorScheme() || 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'dark' : scheme];

  // Starts a new level and generates active tiles sequence
  const startLevel = (currentLvl: number) => {
    const size = currentLvl <= 2 ? 3 : currentLvl <= 5 ? 4 : 5;
    const tileCount = currentLvl + 2;

    setGridSize(size);
    setActiveTilesCount(tileCount);
    setUserSequence([]);
    setGameState('memorize');

    // Generate random active indices
    const totalTiles = size * size;
    const activeIndices: number[] = [];
    while (activeIndices.length < tileCount) {
      const rand = Math.floor(Math.random() * totalTiles);
      if (!activeIndices.includes(rand)) {
        activeIndices.push(rand);
      }
    }
    setSequence(activeIndices);

    // After 2.5 seconds, hide sequence and let user play
    setTimeout(() => {
      setGameState('play');
    }, 2500);
  };

  const handleTilePress = (index: number) => {
    if (gameState !== 'play') return;

    if (sequence.includes(index)) {
      // Correct tile
      if (!userSequence.includes(index)) {
        const nextUserSeq = [...userSequence, index];
        setUserSequence(nextUserSeq);

        // Check if level completed
        if (nextUserSeq.length === sequence.length) {
          setScore(prev => prev + level * 100);
          setGameState('success');
        }
      }
    } else {
      // Incorrect tile
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setGameState('gameover');
      } else {
        setGameState('fail');
      }
    }
  };

  const handleNext = () => {
    const nextLvl = level + 1;
    setLevel(nextLvl);
    startLevel(nextLvl);
  };

  const handleRetry = () => {
    setLevel(1);
    setLives(3);
    setScore(0);
    startLevel(1);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderColor }]}>
        <TouchableOpacity style={[styles.backBtn, { borderColor: colors.borderColor }]} onPress={onBack}>
          <Text style={{ color: colors.textMain, fontWeight: '700' }}>← Exit</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>Memory Matrix</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {gameState === 'welcome' && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, alignItems: 'center' }]}>
            <Text style={{ fontSize: 50, marginBottom: Spacing.two }}>🧠</Text>
            <Text style={[styles.title, { color: colors.textMain, fontSize: 20 }]}>Train Spatial Memory</Text>
            <Text style={[styles.desc, { color: colors.textSub, textAlign: 'center', marginBottom: Spacing.four }]}>
              Remember the grid pattern of glowing tiles and replicate it. Grid size and tile counts increase with levels.
            </Text>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => startLevel(1)}>
              <Text style={styles.btnText}>🎮 Start Game</Text>
            </TouchableOpacity>
          </View>
        )}

        {(gameState === 'memorize' || gameState === 'play' || gameState === 'success' || gameState === 'fail') && (
          <View style={styles.gameBoard}>
            {/* Status bar */}
            <View style={styles.statusRow}>
              <Text style={{ color: colors.textSub, fontWeight: '800' }}>Level: {level}</Text>
              <Text style={{ color: colors.textSub, fontWeight: '800' }}>Lives: {'❤️'.repeat(lives)}</Text>
              <Text style={{ color: colors.primary, fontWeight: '900' }}>Score: {score}</Text>
            </View>

            <Text style={[styles.instruction, { color: colors.primary }]}>
              {gameState === 'memorize' ? '👀 Memorize the Pattern!' : '👇 Replicate the Pattern!'}
            </Text>

            {/* Matrix grid */}
            <View style={styles.gridContainer}>
              {Array.from({ length: gridSize }).map((_, rIdx) => (
                <View key={rIdx} style={styles.gridRow}>
                  {Array.from({ length: gridSize }).map((_, cIdx) => {
                    const idx = rIdx * gridSize + cIdx;
                    const isSequenceTile = sequence.includes(idx);
                    const isUserPressed = userSequence.includes(idx);

                    // Tile visual states
                    const showGlowing = (gameState === 'memorize' && isSequenceTile) || (gameState === 'success' && isSequenceTile) || isUserPressed;

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.tile,
                          { backgroundColor: colors.borderColor, width: 280 / gridSize, height: 280 / gridSize },
                          showGlowing && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => handleTilePress(idx)}
                        disabled={gameState !== 'play'}
                      />
                    );
                  })}
                </View>
              ))}
            </View>

            {/* Success popup helper */}
            {gameState === 'success' && (
              <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, marginTop: Spacing.four, alignItems: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#10b981', fontWeight: '800', marginBottom: Spacing.two }}>🎉 Level Completed!</Text>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={handleNext}>
                  <Text style={styles.btnText}>Continue ➔</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Missed warning helper */}
            {gameState === 'fail' && (
              <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, marginTop: Spacing.four, alignItems: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#ef4444', fontWeight: '800', marginBottom: Spacing.two }}>❌ Ouch! Incorrect tile</Text>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => startLevel(level)}>
                  <Text style={styles.btnText}>Retry Level 🔄</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {gameState === 'gameover' && (
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderColor, alignItems: 'center' }]}>
            <Text style={{ fontSize: 50, marginBottom: Spacing.two }}>💀</Text>
            <Text style={[styles.title, { color: '#ef4444', fontSize: 22 }]}>Game Over</Text>
            <Text style={{ color: colors.textSub, fontSize: 15, marginVertical: Spacing.two }}>
              You reached level <Text style={{ fontWeight: '900', color: colors.primary }}>{level}</Text>
            </Text>
            <Text style={{ color: colors.textSub, fontSize: 15, marginBottom: Spacing.four }}>
              Final score: <Text style={{ fontWeight: '900', color: colors.primary }}>{score}</Text>
            </Text>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={handleRetry}>
              <Text style={styles.btnText}>🔄 Play Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  scrollContent: {
    padding: Spacing.three,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.three,
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
  gameBoard: {
    alignItems: 'center',
    width: '100%',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.two,
  },
  instruction: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: Spacing.four,
  },
  gridContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: Spacing.two,
    borderRadius: 20,
    gap: Spacing.two,
  },
  gridRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  tile: {
    borderRadius: 8,
  },
});
