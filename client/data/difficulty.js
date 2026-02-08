// Difficulty level definitions for GameHub
// Used across all games (Trivia, Quick Math, Pictionary)

export const DIFFICULTY_LEVELS = [
    {
        id: 'super-easy',
        label: 'Super Easy',
        shortLabel: 'S.Easy',
        ageRange: '2-4',
        description: 'Perfect for toddlers',
        order: 0,
        color: {
            tron: { bg: 'bg-pink-500/20', border: 'border-pink-500', text: 'text-pink-400', badge: 'bg-pink-600' },
            kids: { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-600', badge: 'bg-pink-500' },
            scary: { bg: 'bg-pink-900/30', border: 'border-pink-700', text: 'text-pink-400', badge: 'bg-pink-700' }
        }
    },
    {
        id: 'very-easy',
        label: 'Very Easy',
        shortLabel: 'V.Easy',
        ageRange: '5-7',
        description: 'Great for young children',
        order: 1,
        color: {
            tron: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', badge: 'bg-green-600' },
            kids: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-600', badge: 'bg-green-500' },
            scary: { bg: 'bg-green-900/30', border: 'border-green-700', text: 'text-green-400', badge: 'bg-green-700' }
        }
    },
    {
        id: 'easy',
        label: 'Easy',
        shortLabel: 'Easy',
        ageRange: '8-11',
        description: 'Fun for kids and families',
        order: 2,
        color: {
            tron: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', badge: 'bg-blue-600' },
            kids: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-600', badge: 'bg-blue-500' },
            scary: { bg: 'bg-blue-900/30', border: 'border-blue-700', text: 'text-blue-400', badge: 'bg-blue-700' }
        }
    },
    {
        id: 'medium',
        label: 'Medium',
        shortLabel: 'Medium',
        ageRange: '12-15',
        description: 'Balanced challenge',
        order: 3,
        color: {
            tron: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-600' },
            kids: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-600', badge: 'bg-yellow-500' },
            scary: { bg: 'bg-yellow-900/30', border: 'border-yellow-700', text: 'text-yellow-400', badge: 'bg-yellow-700' }
        }
    },
    {
        id: 'hard',
        label: 'Hard',
        shortLabel: 'Hard',
        ageRange: '16-18',
        description: 'Challenging for teens',
        order: 4,
        color: {
            tron: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', badge: 'bg-orange-600' },
            kids: { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-600', badge: 'bg-orange-500' },
            scary: { bg: 'bg-orange-900/30', border: 'border-orange-700', text: 'text-orange-400', badge: 'bg-orange-700' }
        }
    },
    {
        id: 'very-hard',
        label: 'Very Hard',
        shortLabel: 'V.Hard',
        ageRange: '19+',
        description: 'Tough for adults',
        order: 5,
        color: {
            tron: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', badge: 'bg-red-600' },
            kids: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-600', badge: 'bg-red-500' },
            scary: { bg: 'bg-red-900/30', border: 'border-red-700', text: 'text-red-400', badge: 'bg-red-700' }
        }
    },
    {
        id: 'genius',
        label: 'Genius',
        shortLabel: 'Genius',
        ageRange: '',
        description: '',
        order: 6,
        color: {
            tron: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', badge: 'bg-purple-600' },
            kids: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-600', badge: 'bg-purple-500' },
            scary: { bg: 'bg-purple-900/30', border: 'border-purple-700', text: 'text-purple-400', badge: 'bg-purple-700' }
        }
    }
];

export const DEFAULT_DIFFICULTY = 'medium';

// Helper functions

/**
 * Get a difficulty level object by its ID
 * @param {string} difficultyId - The difficulty ID (e.g., 'easy', 'hard')
 * @returns {object|undefined} The difficulty level object
 */
export function getDifficultyById(difficultyId) {
    return DIFFICULTY_LEVELS.find(d => d.id === difficultyId);
}

/**
 * Get the display label for a difficulty ID
 * @param {string} difficultyId - The difficulty ID
 * @returns {string} The display label (e.g., 'Very Easy', 'Genius')
 */
export function getDifficultyLabel(difficultyId) {
    const difficulty = getDifficultyById(difficultyId);
    return difficulty ? difficulty.label : 'Unknown';
}

/**
 * Get the sort order for a difficulty ID (lower = easier)
 * @param {string} difficultyId - The difficulty ID
 * @returns {number} The order (0 = super-easy, 6 = genius)
 */
export function getDifficultyOrder(difficultyId) {
    const difficulty = getDifficultyById(difficultyId);
    return difficulty ? difficulty.order : 3; // Default to medium order
}

/**
 * Get theme-specific colors for a difficulty
 * @param {string} difficultyId - The difficulty ID
 * @param {string} theme - The current theme ('tron', 'kids', 'scary')
 * @returns {object} Color classes { bg, border, text, badge }
 */
export function getDifficultyColors(difficultyId, theme) {
    const difficulty = getDifficultyById(difficultyId);
    if (!difficulty) {
        // Default to medium colors
        return DIFFICULTY_LEVELS[3].color[theme] || DIFFICULTY_LEVELS[3].color.tron;
    }
    return difficulty.color[theme] || difficulty.color.tron;
}

/**
 * Group players by their difficulty level
 * @param {object} playerDifficulties - Map of playerName -> difficultyId
 * @param {string} roomDifficulty - Default room difficulty
 * @param {array} players - Array of player objects with 'name' property
 * @returns {array} Array of groups: [{ difficulty, difficultyLabel, order, players: [...] }, ...]
 *                  Sorted by order (easiest first), empty groups excluded
 */
export function groupPlayersByDifficulty(playerDifficulties, roomDifficulty, players) {
    const groups = {};

    // Initialize groups
    DIFFICULTY_LEVELS.forEach(level => {
        groups[level.id] = {
            difficulty: level.id,
            difficultyLabel: level.label,
            order: level.order,
            players: []
        };
    });

    // Assign players to groups
    players.forEach(player => {
        const playerDifficulty = playerDifficulties[player.name] || roomDifficulty || DEFAULT_DIFFICULTY;
        if (groups[playerDifficulty]) {
            groups[playerDifficulty].players.push(player);
        }
    });

    // Convert to array, filter empty groups, sort by order
    return Object.values(groups)
        .filter(group => group.players.length > 0)
        .sort((a, b) => a.order - b.order);
}

/**
 * Get the effective difficulty for a player
 * @param {string} playerName - The player's name
 * @param {object} playerDifficulties - Map of playerName -> difficultyId
 * @param {string} roomDifficulty - Default room difficulty
 * @returns {string} The effective difficulty ID
 */
export function getPlayerDifficulty(playerName, playerDifficulties, roomDifficulty) {
    return playerDifficulties[playerName] || roomDifficulty || DEFAULT_DIFFICULTY;
}

/**
 * Get the lowest difficulty among a set of players
 * @param {object} playerDifficulties - Map of playerName -> difficultyId
 * @param {string} roomDifficulty - Default room difficulty
 * @param {array} players - Array of player objects with 'name' property
 * @returns {string} The lowest (easiest) difficulty ID
 */
export function getLowestDifficulty(playerDifficulties, roomDifficulty, players) {
    let lowestOrder = Infinity;
    let lowestDifficulty = roomDifficulty || DEFAULT_DIFFICULTY;

    players.forEach(player => {
        const difficulty = getPlayerDifficulty(player.name, playerDifficulties, roomDifficulty);
        const order = getDifficultyOrder(difficulty);
        if (order < lowestOrder) {
            lowestOrder = order;
            lowestDifficulty = difficulty;
        }
    });

    return lowestDifficulty;
}

/**
 * Get the highest difficulty among a set of players
 * @param {object} playerDifficulties - Map of playerName -> difficultyId
 * @param {string} roomDifficulty - Default room difficulty
 * @param {array} players - Array of player objects with 'name' property
 * @returns {string} The highest (hardest) difficulty ID
 */
export function getHighestDifficulty(playerDifficulties, roomDifficulty, players) {
    let highestOrder = -1;
    let highestDifficulty = roomDifficulty || DEFAULT_DIFFICULTY;

    players.forEach(player => {
        const difficulty = getPlayerDifficulty(player.name, playerDifficulties, roomDifficulty);
        const order = getDifficultyOrder(difficulty);
        if (order > highestOrder) {
            highestOrder = order;
            highestDifficulty = difficulty;
        }
    });

    return highestDifficulty;
}
