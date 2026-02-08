// Math questions organized by difficulty level
// Very Easy (ages 3-7): Single digit addition/subtraction
// Easy (ages 7-12): Simple two-digit operations, basic multiplication
// Medium (ages 12-18): Two-digit operations, times tables
// Hard (ages 18+): Multi-step, larger numbers, percentages
// Master (PhD): Complex calculations, algebra, fractions

// ==================== VERY EASY (Ages 3-7) ====================
export const MATH_VERY_EASY = [
    // Single digit addition
    { id: 'VE1', category: 'Addition', question: '1 + 1', answer: 2 },
    { id: 'VE2', category: 'Addition', question: '2 + 1', answer: 3 },
    { id: 'VE3', category: 'Addition', question: '2 + 2', answer: 4 },
    { id: 'VE4', category: 'Addition', question: '3 + 1', answer: 4 },
    { id: 'VE5', category: 'Addition', question: '3 + 2', answer: 5 },
    { id: 'VE6', category: 'Addition', question: '4 + 1', answer: 5 },
    { id: 'VE7', category: 'Addition', question: '4 + 2', answer: 6 },
    { id: 'VE8', category: 'Addition', question: '5 + 1', answer: 6 },
    { id: 'VE9', category: 'Addition', question: '5 + 2', answer: 7 },
    { id: 'VE10', category: 'Addition', question: '5 + 3', answer: 8 },
    { id: 'VE11', category: 'Addition', question: '4 + 4', answer: 8 },
    { id: 'VE12', category: 'Addition', question: '5 + 4', answer: 9 },
    { id: 'VE13', category: 'Addition', question: '5 + 5', answer: 10 },
    { id: 'VE14', category: 'Addition', question: '6 + 2', answer: 8 },
    { id: 'VE15', category: 'Addition', question: '6 + 3', answer: 9 },
    // Single digit subtraction
    { id: 'VE16', category: 'Subtraction', question: '3 - 1', answer: 2 },
    { id: 'VE17', category: 'Subtraction', question: '4 - 2', answer: 2 },
    { id: 'VE18', category: 'Subtraction', question: '5 - 2', answer: 3 },
    { id: 'VE19', category: 'Subtraction', question: '5 - 3', answer: 2 },
    { id: 'VE20', category: 'Subtraction', question: '6 - 2', answer: 4 },
    { id: 'VE21', category: 'Subtraction', question: '6 - 4', answer: 2 },
    { id: 'VE22', category: 'Subtraction', question: '7 - 3', answer: 4 },
    { id: 'VE23', category: 'Subtraction', question: '8 - 4', answer: 4 },
    { id: 'VE24', category: 'Subtraction', question: '9 - 5', answer: 4 },
    { id: 'VE25', category: 'Subtraction', question: '10 - 5', answer: 5 },
    { id: 'VE26', category: 'Subtraction', question: '7 - 2', answer: 5 },
    { id: 'VE27', category: 'Subtraction', question: '8 - 3', answer: 5 },
    { id: 'VE28', category: 'Subtraction', question: '9 - 4', answer: 5 },
    { id: 'VE29', category: 'Subtraction', question: '10 - 3', answer: 7 },
    { id: 'VE30', category: 'Subtraction', question: '10 - 2', answer: 8 }
];

// ==================== EASY (Ages 7-12) ====================
export const MATH_EASY = [
    // Simple two-digit addition
    { id: 'E1', category: 'Addition', question: '10 + 5', answer: 15 },
    { id: 'E2', category: 'Addition', question: '12 + 8', answer: 20 },
    { id: 'E3', category: 'Addition', question: '15 + 10', answer: 25 },
    { id: 'E4', category: 'Addition', question: '20 + 15', answer: 35 },
    { id: 'E5', category: 'Addition', question: '25 + 25', answer: 50 },
    { id: 'E6', category: 'Addition', question: '30 + 20', answer: 50 },
    { id: 'E7', category: 'Addition', question: '18 + 12', answer: 30 },
    { id: 'E8', category: 'Addition', question: '14 + 16', answer: 30 },
    { id: 'E9', category: 'Addition', question: '22 + 18', answer: 40 },
    { id: 'E10', category: 'Addition', question: '35 + 15', answer: 50 },
    // Simple two-digit subtraction
    { id: 'E11', category: 'Subtraction', question: '20 - 10', answer: 10 },
    { id: 'E12', category: 'Subtraction', question: '25 - 15', answer: 10 },
    { id: 'E13', category: 'Subtraction', question: '30 - 20', answer: 10 },
    { id: 'E14', category: 'Subtraction', question: '50 - 25', answer: 25 },
    { id: 'E15', category: 'Subtraction', question: '40 - 15', answer: 25 },
    { id: 'E16', category: 'Subtraction', question: '35 - 10', answer: 25 },
    { id: 'E17', category: 'Subtraction', question: '45 - 20', answer: 25 },
    { id: 'E18', category: 'Subtraction', question: '60 - 30', answer: 30 },
    { id: 'E19', category: 'Subtraction', question: '75 - 25', answer: 50 },
    { id: 'E20', category: 'Subtraction', question: '100 - 50', answer: 50 },
    // Basic multiplication (2-5 times tables)
    { id: 'E21', category: 'Multiplication', question: '2 x 3', answer: 6 },
    { id: 'E22', category: 'Multiplication', question: '2 x 4', answer: 8 },
    { id: 'E23', category: 'Multiplication', question: '2 x 5', answer: 10 },
    { id: 'E24', category: 'Multiplication', question: '3 x 3', answer: 9 },
    { id: 'E25', category: 'Multiplication', question: '3 x 4', answer: 12 },
    { id: 'E26', category: 'Multiplication', question: '4 x 4', answer: 16 },
    { id: 'E27', category: 'Multiplication', question: '4 x 5', answer: 20 },
    { id: 'E28', category: 'Multiplication', question: '5 x 5', answer: 25 },
    { id: 'E29', category: 'Multiplication', question: '5 x 6', answer: 30 },
    { id: 'E30', category: 'Multiplication', question: '10 x 5', answer: 50 }
];

// ==================== MEDIUM (Ages 12-18) ====================
export const MATH_MEDIUM = [
    // Two-digit addition
    { id: 'M1', category: 'Addition', question: '15 + 27', answer: 42 },
    { id: 'M2', category: 'Addition', question: '34 + 58', answer: 92 },
    { id: 'M3', category: 'Addition', question: '45 + 36', answer: 81 },
    { id: 'M4', category: 'Addition', question: '67 + 24', answer: 91 },
    { id: 'M5', category: 'Addition', question: '89 + 11', answer: 100 },
    { id: 'M6', category: 'Addition', question: '56 + 44', answer: 100 },
    { id: 'M7', category: 'Addition', question: '38 + 47', answer: 85 },
    // Two-digit subtraction
    { id: 'M8', category: 'Subtraction', question: '85 - 37', answer: 48 },
    { id: 'M9', category: 'Subtraction', question: '92 - 45', answer: 47 },
    { id: 'M10', category: 'Subtraction', question: '74 - 28', answer: 46 },
    { id: 'M11', category: 'Subtraction', question: '100 - 63', answer: 37 },
    { id: 'M12', category: 'Subtraction', question: '67 - 19', answer: 48 },
    { id: 'M13', category: 'Subtraction', question: '83 - 56', answer: 27 },
    { id: 'M14', category: 'Subtraction', question: '91 - 34', answer: 57 },
    // Times tables (6-12)
    { id: 'M15', category: 'Multiplication', question: '8 x 9', answer: 72 },
    { id: 'M16', category: 'Multiplication', question: '7 x 6', answer: 42 },
    { id: 'M17', category: 'Multiplication', question: '9 x 7', answer: 63 },
    { id: 'M18', category: 'Multiplication', question: '6 x 8', answer: 48 },
    { id: 'M19', category: 'Multiplication', question: '8 x 8', answer: 64 },
    { id: 'M20', category: 'Multiplication', question: '9 x 9', answer: 81 },
    { id: 'M21', category: 'Multiplication', question: '12 x 7', answer: 84 },
    { id: 'M22', category: 'Multiplication', question: '11 x 8', answer: 88 },
    // Division
    { id: 'M23', category: 'Division', question: '72 / 8', answer: 9 },
    { id: 'M24', category: 'Division', question: '63 / 7', answer: 9 },
    { id: 'M25', category: 'Division', question: '56 / 8', answer: 7 },
    { id: 'M26', category: 'Division', question: '48 / 6', answer: 8 },
    { id: 'M27', category: 'Division', question: '81 / 9', answer: 9 },
    { id: 'M28', category: 'Division', question: '64 / 8', answer: 8 },
    { id: 'M29', category: 'Division', question: '84 / 7', answer: 12 },
    { id: 'M30', category: 'Division', question: '96 / 8', answer: 12 }
];

// ==================== HARD (Ages 18+) ====================
export const MATH_HARD = [
    // Three-digit addition
    { id: 'H1', category: 'Addition', question: '125 + 275', answer: 400 },
    { id: 'H2', category: 'Addition', question: '348 + 152', answer: 500 },
    { id: 'H3', category: 'Addition', question: '467 + 233', answer: 700 },
    { id: 'H4', category: 'Addition', question: '589 + 311', answer: 900 },
    { id: 'H5', category: 'Addition', question: '724 + 176', answer: 900 },
    // Three-digit subtraction
    { id: 'H6', category: 'Subtraction', question: '500 - 237', answer: 263 },
    { id: 'H7', category: 'Subtraction', question: '800 - 456', answer: 344 },
    { id: 'H8', category: 'Subtraction', question: '1000 - 673', answer: 327 },
    { id: 'H9', category: 'Subtraction', question: '750 - 389', answer: 361 },
    { id: 'H10', category: 'Subtraction', question: '925 - 468', answer: 457 },
    // Two-digit multiplication
    { id: 'H11', category: 'Multiplication', question: '12 x 15', answer: 180 },
    { id: 'H12', category: 'Multiplication', question: '14 x 12', answer: 168 },
    { id: 'H13', category: 'Multiplication', question: '16 x 15', answer: 240 },
    { id: 'H14', category: 'Multiplication', question: '18 x 12', answer: 216 },
    { id: 'H15', category: 'Multiplication', question: '25 x 16', answer: 400 },
    { id: 'H16', category: 'Multiplication', question: '15 x 15', answer: 225 },
    { id: 'H17', category: 'Multiplication', question: '20 x 25', answer: 500 },
    // Percentages
    { id: 'H18', category: 'Percentage', question: '10% of 200', answer: 20 },
    { id: 'H19', category: 'Percentage', question: '25% of 80', answer: 20 },
    { id: 'H20', category: 'Percentage', question: '50% of 150', answer: 75 },
    { id: 'H21', category: 'Percentage', question: '20% of 500', answer: 100 },
    { id: 'H22', category: 'Percentage', question: '15% of 200', answer: 30 },
    // Division with larger numbers
    { id: 'H23', category: 'Division', question: '144 / 12', answer: 12 },
    { id: 'H24', category: 'Division', question: '225 / 15', answer: 15 },
    { id: 'H25', category: 'Division', question: '196 / 14', answer: 14 },
    { id: 'H26', category: 'Division', question: '324 / 18', answer: 18 },
    { id: 'H27', category: 'Division', question: '400 / 25', answer: 16 },
    // Squares
    { id: 'H28', category: 'Squares', question: '13 squared', answer: 169 },
    { id: 'H29', category: 'Squares', question: '14 squared', answer: 196 },
    { id: 'H30', category: 'Squares', question: '16 squared', answer: 256 }
];

// ==================== MASTER (PhD Level) ====================
export const MATH_MASTER = [
    // Complex multiplication
    { id: 'MA1', category: 'Multiplication', question: '37 x 43', answer: 1591 },
    { id: 'MA2', category: 'Multiplication', question: '56 x 78', answer: 4368 },
    { id: 'MA3', category: 'Multiplication', question: '64 x 125', answer: 8000 },
    { id: 'MA4', category: 'Multiplication', question: '99 x 99', answer: 9801 },
    { id: 'MA5', category: 'Multiplication', question: '125 x 8', answer: 1000 },
    // Squares and cubes
    { id: 'MA6', category: 'Squares', question: '17 squared', answer: 289 },
    { id: 'MA7', category: 'Squares', question: '19 squared', answer: 361 },
    { id: 'MA8', category: 'Squares', question: '21 squared', answer: 441 },
    { id: 'MA9', category: 'Cubes', question: '5 cubed', answer: 125 },
    { id: 'MA10', category: 'Cubes', question: '6 cubed', answer: 216 },
    // Complex percentages
    { id: 'MA11', category: 'Percentage', question: '35% of 240', answer: 84 },
    { id: 'MA12', category: 'Percentage', question: '12.5% of 400', answer: 50 },
    { id: 'MA13', category: 'Percentage', question: '75% of 320', answer: 240 },
    { id: 'MA14', category: 'Percentage', question: '8% of 1250', answer: 100 },
    { id: 'MA15', category: 'Percentage', question: '125% of 80', answer: 100 },
    // Square roots
    { id: 'MA16', category: 'Square Roots', question: 'Square root of 169', answer: 13 },
    { id: 'MA17', category: 'Square Roots', question: 'Square root of 225', answer: 15 },
    { id: 'MA18', category: 'Square Roots', question: 'Square root of 289', answer: 17 },
    { id: 'MA19', category: 'Square Roots', question: 'Square root of 324', answer: 18 },
    { id: 'MA20', category: 'Square Roots', question: 'Square root of 400', answer: 20 },
    // Complex division
    { id: 'MA21', category: 'Division', question: '1728 / 12', answer: 144 },
    { id: 'MA22', category: 'Division', question: '2025 / 45', answer: 45 },
    { id: 'MA23', category: 'Division', question: '3600 / 75', answer: 48 },
    { id: 'MA24', category: 'Division', question: '4096 / 64', answer: 64 },
    // Mixed operations
    { id: 'MA25', category: 'Mixed', question: '(15 x 12) + 20', answer: 200 },
    { id: 'MA26', category: 'Mixed', question: '(144 / 12) x 5', answer: 60 },
    { id: 'MA27', category: 'Mixed', question: '(25 x 4) - 50', answer: 50 },
    { id: 'MA28', category: 'Mixed', question: '(100 - 36) / 8', answer: 8 },
    { id: 'MA29', category: 'Mixed', question: '(7 x 8) + (9 x 6)', answer: 110 },
    { id: 'MA30', category: 'Mixed', question: '(12 x 12) - 44', answer: 100 }
];

// Legacy flat list for backwards compatibility
export const MATH_QUESTIONS = [...MATH_EASY, ...MATH_MEDIUM];

// All questions by difficulty
export const ALL_MATH_QUESTIONS = {
    'super-easy': MATH_VERY_EASY,  // Use very-easy for super-easy for now
    'very-easy': MATH_VERY_EASY,
    'easy': MATH_EASY,
    'medium': MATH_MEDIUM,
    'hard': MATH_HARD,
    'very-hard': MATH_HARD,  // Use hard for very-hard for now
    'genius': MATH_MASTER
};

// Category icons for display
export const MATH_CATEGORY_ICONS = {
    'Addition': '+',
    'Subtraction': '-',
    'Multiplication': 'x',
    'Division': '/',
    'Percentage': '%',
    'Squares': '^2',
    'Cubes': '^3',
    'Square Roots': 'sqrt',
    'Mixed': '='
};

/**
 * Get random questions from a specific difficulty level
 * @param {string} difficulty - Difficulty level ID
 * @param {number} count - Number of questions to return
 * @param {array} usedIds - Question IDs already used (to avoid repeats)
 * @returns {array} Array of question objects
 */
export function getRandomMathQuestions(difficulty, count, usedIds = []) {
    // Handle legacy call signature (count, usedIds)
    if (typeof difficulty === 'number') {
        const legacyCount = difficulty;
        const legacyUsedIds = count || [];
        const questions = MATH_QUESTIONS;
        const available = questions.filter(q => !legacyUsedIds.includes(q.id));
        const pool = available.length >= legacyCount ? available : questions;
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, legacyCount);
    }

    const questions = ALL_MATH_QUESTIONS[difficulty] || MATH_MEDIUM;
    const available = questions.filter(q => !usedIds.includes(q.id));
    const pool = available.length >= count ? available : questions;

    // Shuffle and take first 'count' questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Get difficulty order value (for sorting)
 * @param {string} difficulty - Difficulty ID
 * @returns {number} Order value (0-4)
 */
export function getDifficultyOrderValue(difficulty) {
    const order = { 'super-easy': 0, 'very-easy': 1, 'easy': 2, 'medium': 3, 'hard': 4, 'very-hard': 5, 'genius': 6 };
    return order[difficulty] ?? 3;
}

// Generate 4 multiple choice options for speed round
// Returns array of 4 numbers, with correct answer at random position
export function generateSpeedRoundOptions(correctAnswer) {
    const options = [correctAnswer];

    // Generate 3 wrong answers that are close to correct
    const offsets = [-10, -5, -2, -1, 1, 2, 5, 10];
    const shuffledOffsets = offsets.sort(() => Math.random() - 0.5);

    for (const offset of shuffledOffsets) {
        const wrongAnswer = correctAnswer + offset;
        // Ensure positive and not duplicate
        if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
            if (options.length === 4) break;
        }
    }

    // If we still don't have 4 options, add more with larger offsets
    let multiplier = 2;
    while (options.length < 4) {
        const offset = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20 * multiplier);
        const wrongAnswer = correctAnswer + offset;
        if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
        multiplier++;
    }

    // Shuffle the options
    return options.sort(() => Math.random() - 0.5);
}
