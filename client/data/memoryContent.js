// Memory Game Content - Items, configurations, and challenge types
// Used by Memory Master game

// Item pools for different challenge types
export const MEMORY_ITEMS = {
  // Fun, easily recognizable emojis for all ages
  emojis: [
    // Animals
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵',
    '🐔', '🐧', '🐦', '🦆', '🦉', '🦋', '🐛', '🐝', '🐞', '🐢', '🐍', '🦎', '🐙', '🦀', '🐟',
    '🐬', '🐳', '🦈', '🐊', '🦩', '🦜', '🦚', '🐘', '🦒', '🦓', '🦘', '🦔', '🐿️',
    // Food
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥝', '🥑', '🥕', '🌽', '🥦',
    '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🍰', '🎂', '🍩', '🍪', '🍫', '🍬', '🍭', '🍿', '🧁',
    // Objects
    '⚽', '🏀', '🏈', '⚾', '🎾', '🎱', '🎮', '🎸', '🎹', '🎺', '🎨', '🖍️', '✏️', '📚', '📱',
    '💻', '⌚', '📷', '🔑', '💎', '🎁', '🎈', '🎀', '🎭', '🎪', '🚗', '🚕', '🚌', '🚎', '🚓',
    '🚑', '🚒', '🚀', '✈️', '🚁', '⛵', '🏠', '🏰', '⛺', '🌈', '☀️', '🌙', '⭐', '🌟', '❄️',
    '🔥', '💧', '🌊', '🌸', '🌺', '🌻', '🌹', '🌴', '🌲', '🍀', '🌵'
  ],

  // Shapes for pattern-based challenges
  shapes: [
    'circle', 'square', 'triangle', 'star', 'heart', 'diamond',
    'pentagon', 'hexagon', 'octagon', 'oval', 'crescent', 'cross',
    'arrow-up', 'arrow-down', 'arrow-left', 'arrow-right'
  ],

  // Colors for color-based challenges
  colors: [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink',
    'cyan', 'lime', 'coral', 'gold', 'silver', 'navy', 'teal',
    'magenta', 'indigo', 'maroon', 'olive', 'turquoise', 'violet'
  ],

  // Color hex values for rendering
  colorValues: {
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#22C55E',
    yellow: '#EAB308',
    purple: '#A855F7',
    orange: '#F97316',
    pink: '#EC4899',
    cyan: '#06B6D4',
    lime: '#84CC16',
    coral: '#F87171',
    gold: '#FCD34D',
    silver: '#9CA3AF',
    navy: '#1E3A8A',
    teal: '#14B8A6',
    magenta: '#D946EF',
    indigo: '#6366F1',
    maroon: '#991B1B',
    olive: '#84CC16',
    turquoise: '#2DD4BF',
    violet: '#8B5CF6'
  },

  // Numbers for sequence challenges
  numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],

  // Letters for sequence challenges (younger kids)
  letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
};

// Difficulty configurations for Memory game
// Maps to existing difficulty levels from difficulty.js
// Note: Display time is multiplied by displayTimeMultiplier from game settings
export const MEMORY_DIFFICULTY_CONFIG = {
  'super-easy': {
    gridSize: [2, 2],          // 2x2 = 4 cells - very simple
    displayTime: 8000,         // 8 seconds to memorize
    sequenceLength: 2,         // 2 items in sequence round
    itemCount: 3,              // Items shown in missing/difference
    questionTime: 20000,       // 20 seconds to answer
    sequenceItemTime: 1500,    // 1.5s per item in sequence display
    description: 'Perfect for toddlers (ages 2-4)'
  },
  'very-easy': {
    gridSize: [2, 2],          // 2x2 = 4 cells
    displayTime: 7000,         // 7 seconds
    sequenceLength: 3,
    itemCount: 4,
    questionTime: 18000,
    sequenceItemTime: 1300,    // 1.3s per item
    description: 'Great for young children (ages 5-7)'
  },
  'easy': {
    gridSize: [2, 3],          // 2x3 = 6 cells
    displayTime: 6000,         // 6 seconds
    sequenceLength: 4,
    itemCount: 5,
    questionTime: 15000,
    sequenceItemTime: 1100,
    description: 'Fun for kids (ages 8-10)'
  },
  'medium': {
    gridSize: [3, 3],          // 3x3 = 9 cells
    displayTime: 5000,         // 5 seconds
    sequenceLength: 5,
    itemCount: 6,
    questionTime: 12000,
    sequenceItemTime: 900,
    description: 'Balanced challenge (ages 11-14)'
  },
  'hard': {
    gridSize: [3, 4],          // 3x4 = 12 cells
    displayTime: 4000,         // 4 seconds
    sequenceLength: 6,
    itemCount: 8,
    questionTime: 12000,
    sequenceItemTime: 800,
    description: 'Challenging for teens (ages 15-18)'
  },
  'very-hard': {
    gridSize: [4, 4],          // 4x4 = 16 cells
    displayTime: 3500,         // 3.5 seconds
    sequenceLength: 7,
    itemCount: 10,
    questionTime: 10000,
    sequenceItemTime: 700,
    description: 'Tough for adults (ages 19+)'
  },
  'genius': {
    gridSize: [4, 5],          // 4x5 = 20 cells
    displayTime: 3000,         // 3 seconds
    sequenceLength: 8,
    itemCount: 12,
    questionTime: 10000,
    sequenceItemTime: 600,
    description: 'Expert level challenge'
  }
};

// Challenge type constants
export const CHALLENGE_TYPES = {
  MEMORY_MATCH: 'match',            // Round 1: Match pairs
  MISSING_ITEM: 'missing',
  SPOT_DIFFERENCE: 'difference',
  SEQUENCE: 'sequence'
};

// Which challenge type is used in each round
export const ROUND_CHALLENGE_TYPES = [
  CHALLENGE_TYPES.MEMORY_MATCH,     // Round 1: Match pairs game
  CHALLENGE_TYPES.MISSING_ITEM,     // Round 2
  CHALLENGE_TYPES.SPOT_DIFFERENCE,  // Round 3
  CHALLENGE_TYPES.SEQUENCE          // Round 4 (Speed Round)
];

// Display names for challenge types
export const CHALLENGE_TYPE_NAMES = {
  [CHALLENGE_TYPES.MEMORY_MATCH]: 'Memory Match',
  [CHALLENGE_TYPES.MISSING_ITEM]: 'Missing Item',
  [CHALLENGE_TYPES.SPOT_DIFFERENCE]: 'Spot the Difference',
  [CHALLENGE_TYPES.SEQUENCE]: 'Sequence Memory'
};

// Match game grid sizes by difficulty (must be even number of cells for pairs)
export const MATCH_GRID_CONFIG = {
  'super-easy': { rows: 2, cols: 2 },  // 4 cells = 2 pairs
  'very-easy': { rows: 2, cols: 3 },   // 6 cells = 3 pairs
  'easy': { rows: 3, cols: 2 },        // 6 cells = 3 pairs (close to 3x3)
  'medium': { rows: 4, cols: 4 },      // 16 cells = 8 pairs
  'hard': { rows: 4, cols: 4 },        // 16 cells = 8 pairs
  'very-hard': { rows: 6, cols: 6 },   // 36 cells = 18 pairs
  'genius': { rows: 6, cols: 6 }       // 36 cells = 18 pairs
};

// Instructions for each challenge type
export const CHALLENGE_INSTRUCTIONS = {
  [CHALLENGE_TYPES.MEMORY_MATCH]: {
    title: 'Memory Match',
    description: 'Find all the matching pairs! Cards will be shown briefly, then flip over.',
    steps: [
      'Memorize where each icon is located',
      'After 5 seconds, cards will flip face-down',
      'Tap two cards to find matching pairs',
      'Match all pairs to complete the challenge!'
    ]
  },
  [CHALLENGE_TYPES.MISSING_ITEM]: {
    title: 'Missing Item',
    description: 'Some items will disappear - can you spot what\'s missing?',
    steps: [
      'Memorize all the items shown',
      'One item will be removed',
      'Identify which item is missing'
    ]
  },
  [CHALLENGE_TYPES.SPOT_DIFFERENCE]: {
    title: 'Spot the Difference',
    description: 'Something will change - can you spot what\'s different?',
    steps: [
      'Study the original pattern carefully',
      'One thing will change',
      'Identify what changed'
    ]
  },
  [CHALLENGE_TYPES.SEQUENCE]: {
    title: 'Sequence Memory',
    description: 'Watch the sequence and repeat it back in order!',
    steps: [
      'Watch the items appear one by one',
      'Remember the order',
      'Tap the items in the same order'
    ]
  }
};

// Question templates for Grid Memory challenges
export const GRID_QUESTION_TEMPLATES = {
  position: [
    'Where was the {item}?',
    'Which position had the {item}?',
    'Find where {item} was located',
    'The {item} was in which spot?'
  ],
  item: [
    'What was in position {position}?',
    'Which item was at position {position}?',
    'What did you see at position {position}?',
    'Position {position} contained which item?'
  ]
};

// Difference types for Spot the Difference challenges
export const DIFFERENCE_TYPES = {
  SWAP: 'swap',           // Two items swap positions
  REPLACE: 'replace',     // One item replaced with different item
  COLOR: 'color',         // Item color changes (for colored shapes)
  ROTATE: 'rotate'        // Item rotates (for shapes with direction)
};

// Helper functions

/**
 * Get a random subset of items from the emoji pool
 * @param {number} count - Number of items to get
 * @param {array} exclude - Items to exclude (already used)
 * @returns {array} Array of random items
 */
export function getRandomItems(count, exclude = []) {
  const available = MEMORY_ITEMS.emojis.filter(item => !exclude.includes(item));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get difficulty config for a difficulty level
 * @param {string} difficulty - Difficulty ID
 * @returns {object} Difficulty configuration
 */
export function getDifficultyConfig(difficulty) {
  return MEMORY_DIFFICULTY_CONFIG[difficulty] || MEMORY_DIFFICULTY_CONFIG['medium'];
}

/**
 * Get the challenge type for a given round
 * @param {number} round - Round number (1-4)
 * @returns {string} Challenge type constant
 */
export function getChallengeTypeForRound(round) {
  return ROUND_CHALLENGE_TYPES[round - 1] || CHALLENGE_TYPES.GRID_MEMORY;
}

/**
 * Check if a round is the speed round
 * @param {number} round - Round number
 * @param {number} totalRounds - Total number of rounds
 * @returns {boolean} True if this is the speed round
 */
export function isSpeedRound(round, totalRounds) {
  return round === totalRounds;
}

/**
 * Generate position labels for a grid
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {array} Array of position labels (1, 2, 3, ...)
 */
export function generatePositionLabels(rows, cols) {
  const labels = [];
  for (let i = 1; i <= rows * cols; i++) {
    labels.push(i.toString());
  }
  return labels;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {array} array - Array to shuffle
 * @returns {array} New shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
