/**
 * PatternGenerator.js
 * Handles level-based grid sizing, highlighted tiles calculation,
 * and adaptive memorization duration based on active difficulty levels.
 */

export const getLevelConfig = (level) => {
  if (level === 1) return { size: 3, count: 3, durationMs: 3000 };
  if (level === 2) return { size: 3, count: 4, durationMs: 3000 };
  if (level === 3) return { size: 4, count: 5, durationMs: 2800 };
  if (level === 4) return { size: 4, count: 6, durationMs: 2800 };
  if (level === 5) return { size: 5, count: 7, durationMs: 2600 };
  if (level === 6) return { size: 5, count: 8, durationMs: 2500 };
  if (level === 7) return { size: 6, count: 9, durationMs: 2400 };
  if (level === 8) return { size: 6, count: 10, durationMs: 2200 };

  // Advanced scaling for level > 8
  const size = Math.min(7, 5 + Math.floor((level - 5) / 4));
  const count = 10 + Math.floor((level - 8) * 1.2);
  const durationMs = Math.max(1000, 2200 - (level - 8) * 100);

  return {
    size,
    count: Math.min(size * size - 4, count),
    durationMs
  };
};

export const generatePattern = (size, count) => {
  const totalTiles = size * size;
  const indices = Array.from({ length: totalTiles }, (_, i) => i);
  // Fisher-Yates Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count);
};
