# MEMORY MATRIX PARITY AUDIT

## Web Source of Truth vs. Flutter Implementation

* **Web Component:** `frontend/src/components/MemoryMatrix/MemoryMatrixGame.js`
* **Web Supporting Modules:** `PatternGenerator-saikrishna.js`, `ScoreManager-saikrishna.js`, `StatisticsManager.js`, `AudioSynthManager.js`
* **Flutter Component:** `mobile-flutter/lib/screens/memory_matrix_game.dart`
* **Flutter Supporting Module:** `mobile-flutter/lib/utils/memory_matrix_data.dart`

---

## 1. Feature Parity Matrix

| Feature | Web Behavior | Flutter Implementation | Status | Required Action |
| :--- | :--- | :--- | :--- | :--- |
| **Game Entry & Header** | Displays User Avatar, Campaign progress (X/30), Coins balance, XP balance, and close button | Top bar with Avatar, Level pill, 🪙 Coins badge, ⭐ XP badge, and exit button | **PASS** | Implemented in Flutter |
| **Bottom Navigation Tabs** | 3 Bottom tabs: "Home", "Stats" (Achievements), "Settings" | Bottom navigation bar with Home, Stats, Settings tabs matching Web | **PASS** | Implemented in Flutter |
| **Mode 1: Real Campaign** | 30 Campaign levels, Level selector (+/- and direct input), Chapter badges (Heroic, Master, GM), economy rewards | Real Mode with Level Selector, chapter status, 30 level configs, coin & XP rewards | **PASS** | Implemented in Flutter |
| **Mode 2: Practice Mode** | Risk-free, band selector (Heroic 1-10, Master 11-20, GM 21-30), unlocked by level, infinite lives, 1.25x timer, live accuracy % | Practice Mode with Chapter band unlocks, infinite attempts, relaxed timer, and live accuracy | **PASS** | Implemented in Flutter |
| **Mode 3: Time Trial Mode** | Unlocked at Level 30, 3 challenge tiers (Heroic 5x5, Master 6x6, GM 7x7), 10 deterministic seeded pattern rounds, +3s penalties | Time Trial Mode with Level 30 unlock check, exact seeded pattern sets, stopwatch, round timer, and +3s penalties | **PASS** | Implemented in Flutter |
| **Instructions Screen** | Mode-specific details card, Level parameters, Economy/Refill rules, pulsating green circular "PLAY NOW" button | Mode-specific instructions card with grid/lives/time specs, and pulsating Play Now button | **PASS** | Implemented in Flutter |
| **3-2-1 Countdown** | 3-2-1 GO! animated countdown overlay before pattern appears | 3-2-1 GO! overlay with pulse animation and audio tick | **PASS** | Implemented in Flutter |
| **Grid Generation & Balance Rules** | Quadrant/Zone balanced pattern generation (row/col <= 50%, zone limits, min active zones) | Exact `checkPatternBalanced` and `generatePattern` port in Dart matching Web | **PASS** | Implemented in Flutter |
| **Memorization Phase** | Highlighted active tiles with leaf motif, linear progress decay bar for duration | Memorize phase with active tile styling, animated progress decay bar, duration per level config | **PASS** | Implemented in Flutter |
| **Recall / Answer Phase** | Tap tiles, immediate green check on correct, red cross and grid shake on wrong, amber for missed tiles on timeout | Interactive tile tapping with immediate green/red feedback, grid shake animation, amber missed tiles | **PASS** | Implemented in Flutter |
| **Scoring & Star Formula** | Tier-weighted accuracy and speed formula (Heroic 70/30, Master 60/40, GM 50/50), Base * Stars * Combo multiplier coins | Exact `calculateLevelStars`, `calculateCoinsEarned`, and `calculateXpEarned` port | **PASS** | Implemented in Flutter |
| **Life Refill Prompt** | Mid-attempt prompt when lives hit 0: Buy 1 Life for 50 Coins (max 3/attempt) vs Decline & Restart | Mid-attempt refill modal with 50 coin purchase and attempt usage tracking | **PASS** | Implemented in Flutter |
| **Pause & In-Game Menu** | Hardware back / Pause button opens modal with Resume, Restart Level, Settings, Quit | Pause modal with Resume, Restart, Sound/Haptic toggles, and Quit options | **PASS** | Implemented in Flutter |
| **Level Completed Screen** | Trophy graphic, 1-3 Stars rating, Coins & XP rewards breakdown, "Next Level" CTA | Level Complete screen with Trophy icon, animated stars, rewards pill, and Next Level button | **PASS** | Implemented in Flutter |
| **Grand Master Victory** | Special Grand Master card upon clearing Level 30 with badge and final statistics summary | Level 30 victory view with Grand Master badge and comprehensive performance metrics | **PASS** | Implemented in Flutter |
| **Game Over Screen** | Out of lives / Time Trial run complete summary, PB tracking, Retry and Home buttons | GameOver screen with Level reached, best stars / time trial PB, and Retry CTA | **PASS** | Implemented in Flutter |
| **14 Achievements** | 14 achievements with progress tracking, coin/XP rewards, and floating toast unlock | Full 14 achievements model with SharedPreferences persistence, unlock checks, and toast | **PASS** | Implemented in Flutter |
| **Offline Persistence** | LocalStorage keys for coins, xp, stars, cleared levels, streak, PBs, achievements, settings | `SharedPreferences` persistence for all stats, game economy, achievements, and settings | **PASS** | Implemented in Flutter |

---

## 2. Campaign Level Configurations (Levels 1–30)

| Level | Grid Size | Target Tiles | Memorize Time | Time Limit | Lives | Tier | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 3x3 | 2 | 2.0s | 45s | 1 | Heroic | **PASS** |
| 2 | 3x3 | 3 | 2.2s | 44s | 1 | Heroic | **PASS** |
| 3 | 3x3 | 3 | 2.3s | 43s | 1 | Heroic | **PASS** |
| 4 | 3x3 | 4 | 2.5s | 42s | 1 | Heroic | **PASS** |
| 5 | 3x3 | 4 | 2.7s | 41s | 1 | Heroic | **PASS** |
| 6 | 3x3 | 5 | 2.9s | 40s | 1 | Heroic | **PASS** |
| 7 | 4x4 | 6 | 3.0s | 39s | 1 | Heroic | **PASS** |
| 8 | 4x4 | 6 | 3.2s | 38s | 1 | Heroic | **PASS** |
| 9 | 4x4 | 7 | 3.4s | 37s | 1 | Heroic | **PASS** |
| 10 | 4x4 | 7 | 3.6s | 36s | 1 | Heroic | **PASS** |
| 11 | 4x4 | 8 | 3.7s | 35s | 2 | Master | **PASS** |
| 12 | 4x4 | 8 | 3.9s | 34s | 2 | Master | **PASS** |
| 13 | 5x5 | 9 | 4.1s | 33s | 2 | Master | **PASS** |
| 14 | 5x5 | 10 | 4.2s | 32s | 2 | Master | **PASS** |
| 15 | 5x5 | 10 | 4.4s | 31s | 2 | Master | **PASS** |
| 16 | 5x5 | 11 | 4.6s | 30s | 2 | Master | **PASS** |
| 17 | 5x5 | 11 | 4.8s | 29s | 2 | Master | **PASS** |
| 18 | 5x5 | 12 | 4.9s | 28s | 2 | Master | **PASS** |
| 19 | 6x6 | 13 | 5.1s | 27s | 2 | Master | **PASS** |
| 20 | 6x6 | 13 | 5.3s | 26s | 2 | Master | **PASS** |
| 21 | 6x6 | 14 | 5.5s | 25s | 3 | Grand Master | **PASS** |
| 22 | 6x6 | 14 | 5.6s | 24s | 3 | Grand Master | **PASS** |
| 23 | 6x6 | 15 | 5.8s | 23s | 3 | Grand Master | **PASS** |
| 24 | 6x6 | 15 | 6.0s | 22s | 3 | Grand Master | **PASS** |
| 25 | 7x7 | 16 | 6.1s | 21s | 3 | Grand Master | **PASS** |
| 26 | 7x7 | 17 | 6.3s | 20s | 3 | Grand Master | **PASS** |
| 27 | 7x7 | 17 | 6.5s | 19s | 3 | Grand Master | **PASS** |
| 28 | 7x7 | 18 | 6.7s | 18s | 3 | Grand Master | **PASS** |
| 29 | 7x7 | 18 | 6.8s | 17s | 3 | Grand Master | **PASS** |
| 30 | 7x7 | 19 | 7.0s | 16s | 3 | Grand Master | **PASS** |
