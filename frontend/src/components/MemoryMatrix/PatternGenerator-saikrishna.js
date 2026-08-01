/**
 * PatternGenerator.js
 * Handles level-based grid configurations, balanced pattern generation,
 * and deterministic pattern sets for Time Trial mode.
 * Supports grids from 3x3 to 12x12 across a 30-level campaign.
 */

// Precise campaign configs for levels 1–30
export const getLevelConfig = (level) => {
  const lvl = Math.max(1, Math.min(30, level));
  const configs = [
    { level: 1, size: 3, tiles: 2, displayTime: 2.0, timeLimit: 45, lives: 1, tier: 'Heroic' },
    { level: 2, size: 3, tiles: 3, displayTime: 2.2, timeLimit: 44, lives: 1, tier: 'Heroic' },
    { level: 3, size: 3, tiles: 3, displayTime: 2.3, timeLimit: 43, lives: 1, tier: 'Heroic' },
    { level: 4, size: 3, tiles: 4, displayTime: 2.5, timeLimit: 42, lives: 1, tier: 'Heroic' },
    { level: 5, size: 3, tiles: 4, displayTime: 2.7, timeLimit: 41, lives: 1, tier: 'Heroic' },
    { level: 6, size: 3, tiles: 5, displayTime: 2.9, timeLimit: 40, lives: 1, tier: 'Heroic' },
    { level: 7, size: 4, tiles: 6, displayTime: 3.0, timeLimit: 39, lives: 1, tier: 'Heroic' },
    { level: 8, size: 4, tiles: 6, displayTime: 3.2, timeLimit: 38, lives: 1, tier: 'Heroic' },
    { level: 9, size: 4, tiles: 7, displayTime: 3.4, timeLimit: 37, lives: 1, tier: 'Heroic' },
    { level: 10, size: 4, tiles: 7, displayTime: 3.6, timeLimit: 36, lives: 1, tier: 'Heroic' },
    { level: 11, size: 4, tiles: 8, displayTime: 3.7, timeLimit: 35, lives: 2, tier: 'Master' },
    { level: 12, size: 4, tiles: 8, displayTime: 3.9, timeLimit: 34, lives: 2, tier: 'Master' },
    { level: 13, size: 5, tiles: 9, displayTime: 4.1, timeLimit: 33, lives: 2, tier: 'Master' },
    { level: 14, size: 5, tiles: 10, displayTime: 4.2, timeLimit: 32, lives: 2, tier: 'Master' },
    { level: 15, size: 5, tiles: 10, displayTime: 4.4, timeLimit: 31, lives: 2, tier: 'Master' },
    { level: 16, size: 5, tiles: 11, displayTime: 4.6, timeLimit: 30, lives: 2, tier: 'Master' },
    { level: 17, size: 5, tiles: 11, displayTime: 4.8, timeLimit: 29, lives: 2, tier: 'Master' },
    { level: 18, size: 5, tiles: 12, displayTime: 4.9, timeLimit: 28, lives: 2, tier: 'Master' },
    { level: 19, size: 6, tiles: 13, displayTime: 5.1, timeLimit: 27, lives: 2, tier: 'Master' },
    { level: 20, size: 6, tiles: 13, displayTime: 5.3, timeLimit: 26, lives: 2, tier: 'Master' },
    { level: 21, size: 6, tiles: 14, displayTime: 5.5, timeLimit: 25, lives: 3, tier: 'Grand Master' },
    { level: 22, size: 6, tiles: 14, displayTime: 5.6, timeLimit: 24, lives: 3, tier: 'Grand Master' },
    { level: 23, size: 6, tiles: 15, displayTime: 5.8, timeLimit: 23, lives: 3, tier: 'Grand Master' },
    { level: 24, size: 6, tiles: 15, displayTime: 6.0, timeLimit: 22, lives: 3, tier: 'Grand Master' },
    { level: 25, size: 7, tiles: 16, displayTime: 6.1, timeLimit: 21, lives: 3, tier: 'Grand Master' },
    { level: 26, size: 7, tiles: 17, displayTime: 6.3, timeLimit: 20, lives: 3, tier: 'Grand Master' },
    { level: 27, size: 7, tiles: 17, displayTime: 6.5, timeLimit: 19, lives: 3, tier: 'Grand Master' },
    { level: 28, size: 7, tiles: 18, displayTime: 6.7, timeLimit: 18, lives: 3, tier: 'Grand Master' },
    { level: 29, size: 7, tiles: 18, displayTime: 6.8, timeLimit: 17, lives: 3, tier: 'Grand Master' },
    { level: 30, size: 7, tiles: 19, displayTime: 7.0, timeLimit: 16, lives: 3, tier: 'Grand Master' }
  ];

  const config = configs[lvl - 1];
  return {
    ...config,
    minTiles: config.tiles,
    maxTiles: config.tiles,
    rounds: 1
  };
};

export const checkPatternBalanced = (pattern, size, count) => {
  const rowCounts = Array(size).fill(0);
  const colCounts = Array(size).fill(0);

  for (const idx of pattern) {
    const r = Math.floor(idx / size);
    const c = idx % size;
    rowCounts[r]++;
    colCounts[c]++;
  }

  // 1. Max per row/column: 50% of the total highlighted tiles
  const maxPerRowCol = count * 0.5;
  for (let i = 0; i < size; i++) {
    if (rowCounts[i] > maxPerRowCol || colCounts[i] > maxPerRowCol) {
      return false;
    }
  }

  // 2. Zone rules only apply to size >= 4
  if (size >= 4) {
    let zoneSize, zoneCount;
    if (size === 4 || size === 5) {
      zoneSize = 2; // 2x2 grid of zones (4 zones)
    } else if (size === 6 || size === 7) {
      zoneSize = 3; // 3x3 grid of zones (9 zones)
    } else {
      zoneSize = 4; // fallback
    }
    zoneCount = zoneSize * zoneSize;
    const zoneCounts = Array(zoneCount).fill(0);

    for (const idx of pattern) {
      const r = Math.floor(idx / size);
      const c = idx % size;

      // Assign to zone
      let zoneRow, zoneCol;
      if (zoneSize === 2) {
        const mid = Math.floor(size / 2);
        zoneRow = r < mid ? 0 : 1;
        zoneCol = c < mid ? 0 : 1;
      } else if (zoneSize === 3) {
        const split1 = Math.floor(size / 3);
        const split2 = Math.floor((2 * size) / 3);
        zoneRow = r < split1 ? 0 : (r < split2 ? 1 : 2);
        zoneCol = c < split1 ? 0 : (c < split2 ? 1 : 2);
      } else {
        const split1 = Math.floor(size / 4);
        const split2 = Math.floor(size / 2);
        const split3 = Math.floor((3 * size) / 4);
        zoneRow = r < split1 ? 0 : (r < split2 ? 1 : (r < split3 ? 2 : 3));
        zoneCol = c < split1 ? 0 : (c < split2 ? 1 : (c < split3 ? 2 : 3));
      }
      const zoneIdx = zoneRow * zoneSize + zoneCol;
      zoneCounts[zoneIdx]++;
    }

    // A. Max per zone: ceil(total_tiles / zone_count) + 1
    const maxPerZone = Math.ceil(count / zoneCount) + 1;
    for (const zc of zoneCounts) {
      if (zc > maxPerZone) return false;
    }

    // B. Minimum active zones: At least half of all zones must contain 1+ tile
    const minActive = Math.ceil(zoneCount / 2);
    const activeCount = zoneCounts.filter(zc => zc > 0).length;
    if (activeCount < minActive) {
      return false;
    }
  }

  return true;
};

// Seeded LCG Random Generator for deterministic Time Trial patterns
const createSeededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

// General balanced pattern generator
export const generatePattern = (size, count, previousPattern = []) => {
  const totalTiles = size * size;
  let attempts = 0;

  while (attempts < 2000) {
    attempts++;
    const indices = Array.from({ length: totalTiles }, (_, i) => i);
    // Shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const candidate = indices.slice(0, count).sort((a, b) => a - b);

    // Verify it doesn't match the previous pattern exactly
    if (previousPattern.length === count) {
      const match = candidate.every((val, idx) => val === previousPattern[idx]);
      if (match) continue;
    }

    // Verify balance rules
    if (checkPatternBalanced(candidate, size, count)) {
      return candidate;
    }
  }

  // Fail-safe shuffle if balance rules are too strict
  const indices = Array.from({ length: totalTiles }, (_, i) => i);
  indices.sort(() => Math.random() - 0.5);
  return indices.slice(0, count).sort((a, b) => a - b);
};

// Time Trial Fixed Pattern Generator (runs at compile-time/initialization deterministically)
const generateFixedTimeTrialSet = (size, count, seedVal) => {
  const random = createSeededRandom(seedVal);
  const totalTiles = size * size;
  const patternSet = [];

  while (patternSet.length < 10) {
    const indices = Array.from({ length: totalTiles }, (_, i) => i);
    // Shuffle using seeded random
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const candidate = indices.slice(0, count).sort((a, b) => a - b);

    // Enforce no exact duplicates in set
    let isDuplicate = false;
    for (const prev of patternSet) {
      if (prev.every((val, idx) => val === candidate[idx])) {
        isDuplicate = true;
        break;
      }
    }
    if (isDuplicate) continue;

    // Verify balance rules
    if (checkPatternBalanced(candidate, size, count)) {
      patternSet.push(candidate);
    }
  }

  return patternSet;
};

// Exported Fixed Time Trial Pattern Sets
export const TIME_TRIAL_PATTERNS = {
  Heroic: generateFixedTimeTrialSet(5, 6, 888123),
  Master: generateFixedTimeTrialSet(6, 11, 999321),
  GrandMaster: generateFixedTimeTrialSet(7, 16, 777654)
};
