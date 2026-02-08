// Achievement and stats tracking system for avatar unlocks
// Works for both logged-in users (database) and guests (session storage)

// Default stats structure
export const DEFAULT_STATS = {
    // Basic counts
    gamesPlayed: 0,
    wins: 0,
    roomsCreated: 0,
    chatMessagesSent: 0,
    roomsJoined: 0,

    // Specific game stats
    gamesWithFourPlusPlayers: 0,
    gameTypesPlayed: [], // ['pictionary', 'trivia', 'quickmath']
    fastWins: 0, // Wins under 60 seconds

    // Score tracking
    highestSingleGameScore: 0,
    highestGameTotalPoints: 0,

    // Streak tracking
    consecutiveRoundWins: 0,
    maxConsecutiveRoundWins: 0,
    currentWinStreak: 0,
    bestWinStreak: 0,

    // Large room stats
    winsInLargeRooms: 0, // 6+ players

    // Legendary unlock tracking
    comebackWins: 0, // Last to first in 5+ player game
    dominationWins: 0, // Score > all others combined in 4+ player game
    consecutiveDaysWithWin: 0,
    lastWinDate: null,

    // Unique room tracking
    uniqueRoomWins: {}, // { roomId: [playerNames] }
    uniqueRoomWinCount: 0,

    // Character mastery
    charactersWonWith: [], // Character IDs won with

    // Misc
    totalPoints: 0
};

// Avatar unlock conditions mapped to stat checks
export const UNLOCK_CONDITIONS = {
    // === TRON THEME ===
    // Uncommon
    'volt-striker': (stats) => stats.gamesPlayed >= 1,
    'quantum-thief': (stats) => stats.wins >= 1,
    'plasma-drone': (stats) => stats.roomsCreated >= 3,
    'hex-coder': (stats) => stats.chatMessagesSent >= 25,
    'ion-scout': (stats) => stats.roomsJoined >= 5,
    'wire-wraith': (stats) => stats.gamesWithFourPlusPlayers >= 1,
    'signal-flare': (stats) => stats.wins >= 3,
    'core-sentinel': (stats) => stats.gameTypesPlayed.length >= 5,
    'glitch-fox': (stats) => stats.fastWins >= 1,
    'null-agent': (stats) => stats.gamesPlayed >= 10,

    // Rare
    'prism-knight': (stats) => stats.wins >= 25 && stats.highestSingleGameScore >= 500,
    'void-archer': (stats) => stats.maxConsecutiveRoundWins >= 10,
    'neon-ronin': (stats) => stats.bestWinStreak >= 10,
    'data-alchemist': (stats) => stats.winsInLargeRooms >= 5,
    'circuit-witch': (stats) => stats.highestGameTotalPoints >= 1000,

    // Legendary
    'grid-phoenix': (stats) => stats.comebackWins >= 3,
    'neon-titan': (stats) => stats.dominationWins >= 3,
    'cyber-bear': (stats) => stats.consecutiveDaysWithWin >= 30,
    'quantum-dragon': (stats) => stats.uniqueRoomWinCount >= 20,
    'omega-prime': (stats, unlockedCharacters, allCharacters) => {
        // Must unlock all other characters and win with each
        const allOtherIds = allCharacters.filter(c => c.id !== 'omega-prime').map(c => c.id);
        const hasAllUnlocked = allOtherIds.every(id => unlockedCharacters.includes(id));
        const wonWithAll = allOtherIds.every(id => stats.charactersWonWith.includes(id));
        return hasAllUnlocked && wonWithAll;
    },

    // === KIDS THEME ===
    // Uncommon
    'buzzy-bee': (stats) => stats.gamesPlayed >= 1,
    'tiny-turtle': (stats) => stats.wins >= 1,
    'dotty-ladybug': (stats) => stats.gamesPlayed >= 5,
    'fluffy-sheep': (stats) => stats.wins >= 3,
    'jolly-dolphin': (stats) => stats.gameTypesPlayed.length >= 3,
    'cheeky-monkey': (stats) => stats.gamesPlayed >= 10,
    // Rare
    'snowy-owl': (stats) => stats.wins >= 10,
    'lucky-clover': (stats) => stats.bestWinStreak >= 5,
    // Legendary
    'starry-fish': (stats) => stats.wins >= 25,
    'candy-dragon': (stats) => stats.gamesPlayed >= 50,

    // === SCARY THEME ===
    // Uncommon
    'bone-crawler': (stats) => stats.gamesPlayed >= 1,
    'plague-doctor': (stats) => stats.wins >= 1,
    'blood-raven': (stats) => stats.gamesPlayed >= 5,
    'swamp-fiend': (stats) => stats.wins >= 3,
    'night-stalker': (stats) => stats.gameTypesPlayed.length >= 3,
    'venom-spider': (stats) => stats.gamesPlayed >= 10,
    // Rare
    'tomb-keeper': (stats) => stats.wins >= 10,
    'banshee-wail': (stats) => stats.bestWinStreak >= 5,
    // Legendary
    'inferno-imp': (stats) => stats.wins >= 25,
    'crypt-wyrm': (stats) => stats.gamesPlayed >= 50
};

// Get human-readable progress for an unlock condition
export const UNLOCK_PROGRESS = {
    // === TRON THEME ===
    'volt-striker': (stats) => ({ current: stats.gamesPlayed, target: 1, label: 'games played' }),
    'quantum-thief': (stats) => ({ current: stats.wins, target: 1, label: 'wins' }),
    'plasma-drone': (stats) => ({ current: stats.roomsCreated, target: 3, label: 'rooms created' }),
    'hex-coder': (stats) => ({ current: stats.chatMessagesSent, target: 25, label: 'messages sent' }),
    'ion-scout': (stats) => ({ current: stats.roomsJoined, target: 5, label: 'rooms joined' }),
    'wire-wraith': (stats) => ({ current: stats.gamesWithFourPlusPlayers, target: 1, label: 'games with 4+ players' }),
    'signal-flare': (stats) => ({ current: stats.wins, target: 3, label: 'wins' }),
    'core-sentinel': (stats) => ({ current: stats.gameTypesPlayed.length, target: 5, label: 'game types played' }),
    'glitch-fox': (stats) => ({ current: stats.fastWins, target: 1, label: 'fast wins (<60s)' }),
    'null-agent': (stats) => ({ current: stats.gamesPlayed, target: 10, label: 'games played' }),
    'prism-knight': (stats) => ({
        conditions: [
            { current: stats.wins, target: 25, label: 'wins' },
            { current: stats.highestSingleGameScore, target: 500, label: 'highest score' }
        ]
    }),
    'void-archer': (stats) => ({ current: stats.maxConsecutiveRoundWins, target: 10, label: 'consecutive round wins' }),
    'neon-ronin': (stats) => ({ current: stats.bestWinStreak, target: 10, label: 'win streak' }),
    'data-alchemist': (stats) => ({ current: stats.winsInLargeRooms, target: 5, label: 'wins in 6+ player rooms' }),
    'circuit-witch': (stats) => ({ current: stats.highestGameTotalPoints, target: 1000, label: 'points in one game' }),
    'grid-phoenix': (stats) => ({ current: stats.comebackWins, target: 3, label: 'comeback wins' }),
    'neon-titan': (stats) => ({ current: stats.dominationWins, target: 3, label: 'domination wins' }),
    'cyber-bear': (stats) => ({ current: stats.consecutiveDaysWithWin, target: 30, label: 'consecutive days' }),
    'quantum-dragon': (stats) => ({ current: stats.uniqueRoomWinCount, target: 20, label: 'unique room wins' }),
    'omega-prime': (stats, unlockedCount, totalCount) => ({
        conditions: [
            { current: unlockedCount, target: totalCount - 1, label: 'characters unlocked' },
            { current: stats.charactersWonWith.length, target: totalCount - 1, label: 'characters won with' }
        ]
    }),

    // === KIDS THEME ===
    'buzzy-bee': (stats) => ({ current: stats.gamesPlayed, target: 1, label: 'games played' }),
    'tiny-turtle': (stats) => ({ current: stats.wins, target: 1, label: 'wins' }),
    'dotty-ladybug': (stats) => ({ current: stats.gamesPlayed, target: 5, label: 'games played' }),
    'fluffy-sheep': (stats) => ({ current: stats.wins, target: 3, label: 'wins' }),
    'jolly-dolphin': (stats) => ({ current: stats.gameTypesPlayed.length, target: 3, label: 'game types played' }),
    'cheeky-monkey': (stats) => ({ current: stats.gamesPlayed, target: 10, label: 'games played' }),
    'snowy-owl': (stats) => ({ current: stats.wins, target: 10, label: 'wins' }),
    'lucky-clover': (stats) => ({ current: stats.bestWinStreak, target: 5, label: 'win streak' }),
    'starry-fish': (stats) => ({ current: stats.wins, target: 25, label: 'wins' }),
    'candy-dragon': (stats) => ({ current: stats.gamesPlayed, target: 50, label: 'games played' }),

    // === SCARY THEME ===
    'bone-crawler': (stats) => ({ current: stats.gamesPlayed, target: 1, label: 'games played' }),
    'plague-doctor': (stats) => ({ current: stats.wins, target: 1, label: 'wins' }),
    'blood-raven': (stats) => ({ current: stats.gamesPlayed, target: 5, label: 'games played' }),
    'swamp-fiend': (stats) => ({ current: stats.wins, target: 3, label: 'wins' }),
    'night-stalker': (stats) => ({ current: stats.gameTypesPlayed.length, target: 3, label: 'game types played' }),
    'venom-spider': (stats) => ({ current: stats.gamesPlayed, target: 10, label: 'games played' }),
    'tomb-keeper': (stats) => ({ current: stats.wins, target: 10, label: 'wins' }),
    'banshee-wail': (stats) => ({ current: stats.bestWinStreak, target: 5, label: 'win streak' }),
    'inferno-imp': (stats) => ({ current: stats.wins, target: 25, label: 'wins' }),
    'crypt-wyrm': (stats) => ({ current: stats.gamesPlayed, target: 50, label: 'games played' })
};

/**
 * Check which avatars should be unlocked based on current stats
 * @param {object} stats - Player stats
 * @param {string[]} currentlyUnlocked - Currently unlocked character IDs
 * @param {object[]} allCharacters - All character definitions
 * @returns {string[]} Array of newly unlocked character IDs
 */
export function checkUnlocks(stats, currentlyUnlocked, allCharacters) {
    const newlyUnlocked = [];

    for (const [characterId, checkFn] of Object.entries(UNLOCK_CONDITIONS)) {
        // Skip if already unlocked
        if (currentlyUnlocked.includes(characterId)) continue;

        // Check if condition is met
        try {
            if (checkFn(stats, currentlyUnlocked, allCharacters)) {
                newlyUnlocked.push(characterId);
            }
        } catch (err) {
            console.error(`Error checking unlock for ${characterId}:`, err);
        }
    }

    return newlyUnlocked;
}

/**
 * Get a random character of a specific rarity that isn't already unlocked
 * @param {string} rarity - 'common', 'uncommon', 'rare', 'epic', 'legendary'
 * @param {string[]} unlockedIds - Already unlocked character IDs
 * @param {object[]} allCharacters - All character definitions
 * @returns {object|null} Random character object or null if none available
 */
export function getRandomCharacterByRarity(rarity, unlockedIds, allCharacters) {
    const available = allCharacters.filter(
        c => c.rarity === rarity && !unlockedIds.includes(c.id)
    );

    if (available.length === 0) return null;

    return available[Math.floor(Math.random() * available.length)];
}

/**
 * Merge stats objects (for combining session stats with database stats)
 * @param {object} base - Base stats object
 * @param {object} updates - Updates to merge
 * @returns {object} Merged stats
 */
export function mergeStats(base, updates) {
    const merged = { ...base };

    for (const [key, value] of Object.entries(updates)) {
        if (Array.isArray(value)) {
            // Merge arrays (unique values)
            merged[key] = [...new Set([...(base[key] || []), ...value])];
        } else if (typeof value === 'object' && value !== null) {
            // Merge objects
            merged[key] = { ...(base[key] || {}), ...value };
        } else if (typeof value === 'number') {
            // Take the higher value for max stats, add for cumulative
            const maxStats = ['highestSingleGameScore', 'highestGameTotalPoints', 'maxConsecutiveRoundWins', 'bestWinStreak'];
            if (maxStats.includes(key)) {
                merged[key] = Math.max(base[key] || 0, value);
            } else {
                merged[key] = value; // Use the update value directly
            }
        } else {
            merged[key] = value;
        }
    }

    return merged;
}

// Session storage keys
const SESSION_STATS_KEY = 'gamehub_session_stats';
const SESSION_UNLOCKED_KEY = 'gamehub_session_unlocked';

/**
 * Get session stats for guests
 */
export function getSessionStats() {
    try {
        const stored = sessionStorage.getItem(SESSION_STATS_KEY);
        return stored ? JSON.parse(stored) : { ...DEFAULT_STATS };
    } catch {
        return { ...DEFAULT_STATS };
    }
}

/**
 * Save session stats for guests
 */
export function saveSessionStats(stats) {
    try {
        sessionStorage.setItem(SESSION_STATS_KEY, JSON.stringify(stats));
    } catch (err) {
        console.error('Failed to save session stats:', err);
    }
}

/**
 * Get session unlocked characters for guests
 */
export function getSessionUnlocked() {
    try {
        const stored = sessionStorage.getItem(SESSION_UNLOCKED_KEY);
        return stored ? JSON.parse(stored) : ['cyber-knight', 'neon-ninja', 'pixel-punk'];
    } catch {
        return ['cyber-knight', 'neon-ninja', 'pixel-punk'];
    }
}

/**
 * Save session unlocked characters for guests
 */
export function saveSessionUnlocked(unlocked) {
    try {
        sessionStorage.setItem(SESSION_UNLOCKED_KEY, JSON.stringify(unlocked));
    } catch (err) {
        console.error('Failed to save session unlocked:', err);
    }
}

/**
 * Clear session stats and unlocks (call on logout)
 */
export function clearSessionData() {
    try {
        sessionStorage.removeItem(SESSION_STATS_KEY);
        sessionStorage.removeItem(SESSION_UNLOCKED_KEY);
    } catch (err) {
        console.error('Failed to clear session data:', err);
    }
}

/**
 * Update a specific stat and check for new unlocks
 * @param {object} currentStats - Current stats object
 * @param {string} statName - Name of stat to update
 * @param {*} value - New value or increment
 * @param {boolean} increment - If true, add to current value instead of replacing
 * @returns {object} Updated stats
 */
export function updateStat(currentStats, statName, value, increment = false) {
    const updated = { ...currentStats };

    if (increment && typeof value === 'number') {
        updated[statName] = (updated[statName] || 0) + value;
    } else if (Array.isArray(updated[statName]) && !Array.isArray(value)) {
        // Add to array if not already present
        if (!updated[statName].includes(value)) {
            updated[statName] = [...updated[statName], value];
        }
    } else {
        updated[statName] = value;
    }

    return updated;
}
