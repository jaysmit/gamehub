// Quick Math questions bank - 100+ kid-friendly math problems
// Structure: { id, category, question, answer }
// All answers are positive integers < 1000

export const MATH_CATEGORY_ICONS = {
    'Addition': '+',
    'Subtraction': '-',
    'Multiplication': 'x',
    'Division': '/'
};

export const MATH_QUESTIONS = [
    // ==================== ADDITION (30 questions) ====================
    { id: 1, category: 'Addition', question: '15 + 27', answer: 42 },
    { id: 2, category: 'Addition', question: '34 + 58', answer: 92 },
    { id: 3, category: 'Addition', question: '45 + 36', answer: 81 },
    { id: 4, category: 'Addition', question: '67 + 24', answer: 91 },
    { id: 5, category: 'Addition', question: '89 + 11', answer: 100 },
    { id: 6, category: 'Addition', question: '23 + 77', answer: 100 },
    { id: 7, category: 'Addition', question: '56 + 44', answer: 100 },
    { id: 8, category: 'Addition', question: '38 + 47', answer: 85 },
    { id: 9, category: 'Addition', question: '19 + 64', answer: 83 },
    { id: 10, category: 'Addition', question: '72 + 18', answer: 90 },
    { id: 11, category: 'Addition', question: '33 + 49', answer: 82 },
    { id: 12, category: 'Addition', question: '51 + 39', answer: 90 },
    { id: 13, category: 'Addition', question: '28 + 65', answer: 93 },
    { id: 14, category: 'Addition', question: '14 + 78', answer: 92 },
    { id: 15, category: 'Addition', question: '46 + 37', answer: 83 },
    { id: 16, category: 'Addition', question: '82 + 15', answer: 97 },
    { id: 17, category: 'Addition', question: '59 + 26', answer: 85 },
    { id: 18, category: 'Addition', question: '41 + 53', answer: 94 },
    { id: 19, category: 'Addition', question: '73 + 19', answer: 92 },
    { id: 20, category: 'Addition', question: '25 + 68', answer: 93 },
    { id: 21, category: 'Addition', question: '37 + 55', answer: 92 },
    { id: 22, category: 'Addition', question: '62 + 29', answer: 91 },
    { id: 23, category: 'Addition', question: '48 + 43', answer: 91 },
    { id: 24, category: 'Addition', question: '16 + 76', answer: 92 },
    { id: 25, category: 'Addition', question: '84 + 13', answer: 97 },
    { id: 26, category: 'Addition', question: '57 + 35', answer: 92 },
    { id: 27, category: 'Addition', question: '69 + 22', answer: 91 },
    { id: 28, category: 'Addition', question: '31 + 61', answer: 92 },
    { id: 29, category: 'Addition', question: '44 + 48', answer: 92 },
    { id: 30, category: 'Addition', question: '95 + 87', answer: 182 },

    // ==================== SUBTRACTION (30 questions) ====================
    { id: 31, category: 'Subtraction', question: '85 - 37', answer: 48 },
    { id: 32, category: 'Subtraction', question: '92 - 45', answer: 47 },
    { id: 33, category: 'Subtraction', question: '74 - 28', answer: 46 },
    { id: 34, category: 'Subtraction', question: '100 - 63', answer: 37 },
    { id: 35, category: 'Subtraction', question: '67 - 19', answer: 48 },
    { id: 36, category: 'Subtraction', question: '83 - 56', answer: 27 },
    { id: 37, category: 'Subtraction', question: '91 - 34', answer: 57 },
    { id: 38, category: 'Subtraction', question: '58 - 29', answer: 29 },
    { id: 39, category: 'Subtraction', question: '76 - 48', answer: 28 },
    { id: 40, category: 'Subtraction', question: '99 - 52', answer: 47 },
    { id: 41, category: 'Subtraction', question: '64 - 17', answer: 47 },
    { id: 42, category: 'Subtraction', question: '87 - 39', answer: 48 },
    { id: 43, category: 'Subtraction', question: '73 - 26', answer: 47 },
    { id: 44, category: 'Subtraction', question: '95 - 68', answer: 27 },
    { id: 45, category: 'Subtraction', question: '82 - 44', answer: 38 },
    { id: 46, category: 'Subtraction', question: '61 - 23', answer: 38 },
    { id: 47, category: 'Subtraction', question: '78 - 31', answer: 47 },
    { id: 48, category: 'Subtraction', question: '89 - 42', answer: 47 },
    { id: 49, category: 'Subtraction', question: '54 - 18', answer: 36 },
    { id: 50, category: 'Subtraction', question: '96 - 59', answer: 37 },
    { id: 51, category: 'Subtraction', question: '71 - 24', answer: 47 },
    { id: 52, category: 'Subtraction', question: '88 - 53', answer: 35 },
    { id: 53, category: 'Subtraction', question: '65 - 38', answer: 27 },
    { id: 54, category: 'Subtraction', question: '93 - 47', answer: 46 },
    { id: 55, category: 'Subtraction', question: '77 - 29', answer: 48 },
    { id: 56, category: 'Subtraction', question: '86 - 41', answer: 45 },
    { id: 57, category: 'Subtraction', question: '62 - 15', answer: 47 },
    { id: 58, category: 'Subtraction', question: '79 - 36', answer: 43 },
    { id: 59, category: 'Subtraction', question: '94 - 57', answer: 37 },
    { id: 60, category: 'Subtraction', question: '150 - 73', answer: 77 },

    // ==================== MULTIPLICATION (25 questions) ====================
    { id: 61, category: 'Multiplication', question: '8 x 9', answer: 72 },
    { id: 62, category: 'Multiplication', question: '7 x 6', answer: 42 },
    { id: 63, category: 'Multiplication', question: '9 x 7', answer: 63 },
    { id: 64, category: 'Multiplication', question: '6 x 8', answer: 48 },
    { id: 65, category: 'Multiplication', question: '5 x 9', answer: 45 },
    { id: 66, category: 'Multiplication', question: '8 x 8', answer: 64 },
    { id: 67, category: 'Multiplication', question: '7 x 7', answer: 49 },
    { id: 68, category: 'Multiplication', question: '9 x 9', answer: 81 },
    { id: 69, category: 'Multiplication', question: '6 x 7', answer: 42 },
    { id: 70, category: 'Multiplication', question: '8 x 6', answer: 48 },
    { id: 71, category: 'Multiplication', question: '4 x 9', answer: 36 },
    { id: 72, category: 'Multiplication', question: '5 x 8', answer: 40 },
    { id: 73, category: 'Multiplication', question: '7 x 8', answer: 56 },
    { id: 74, category: 'Multiplication', question: '6 x 9', answer: 54 },
    { id: 75, category: 'Multiplication', question: '3 x 8', answer: 24 },
    { id: 76, category: 'Multiplication', question: '12 x 7', answer: 84 },
    { id: 77, category: 'Multiplication', question: '11 x 8', answer: 88 },
    { id: 78, category: 'Multiplication', question: '9 x 11', answer: 99 },
    { id: 79, category: 'Multiplication', question: '12 x 6', answer: 72 },
    { id: 80, category: 'Multiplication', question: '8 x 12', answer: 96 },
    { id: 81, category: 'Multiplication', question: '15 x 4', answer: 60 },
    { id: 82, category: 'Multiplication', question: '13 x 5', answer: 65 },
    { id: 83, category: 'Multiplication', question: '14 x 6', answer: 84 },
    { id: 84, category: 'Multiplication', question: '16 x 5', answer: 80 },
    { id: 85, category: 'Multiplication', question: '25 x 4', answer: 100 },

    // ==================== DIVISION (25 questions) ====================
    { id: 86, category: 'Division', question: '72 / 8', answer: 9 },
    { id: 87, category: 'Division', question: '63 / 7', answer: 9 },
    { id: 88, category: 'Division', question: '56 / 8', answer: 7 },
    { id: 89, category: 'Division', question: '48 / 6', answer: 8 },
    { id: 90, category: 'Division', question: '81 / 9', answer: 9 },
    { id: 91, category: 'Division', question: '42 / 7', answer: 6 },
    { id: 92, category: 'Division', question: '54 / 9', answer: 6 },
    { id: 93, category: 'Division', question: '64 / 8', answer: 8 },
    { id: 94, category: 'Division', question: '45 / 5', answer: 9 },
    { id: 95, category: 'Division', question: '36 / 4', answer: 9 },
    { id: 96, category: 'Division', question: '49 / 7', answer: 7 },
    { id: 97, category: 'Division', question: '40 / 8', answer: 5 },
    { id: 98, category: 'Division', question: '35 / 5', answer: 7 },
    { id: 99, category: 'Division', question: '24 / 6', answer: 4 },
    { id: 100, category: 'Division', question: '32 / 4', answer: 8 },
    { id: 101, category: 'Division', question: '84 / 7', answer: 12 },
    { id: 102, category: 'Division', question: '96 / 8', answer: 12 },
    { id: 103, category: 'Division', question: '88 / 8', answer: 11 },
    { id: 104, category: 'Division', question: '99 / 9', answer: 11 },
    { id: 105, category: 'Division', question: '77 / 7', answer: 11 },
    { id: 106, category: 'Division', question: '60 / 5', answer: 12 },
    { id: 107, category: 'Division', question: '100 / 4', answer: 25 },
    { id: 108, category: 'Division', question: '90 / 6', answer: 15 },
    { id: 109, category: 'Division', question: '75 / 5', answer: 15 },
    { id: 110, category: 'Division', question: '144 / 12', answer: 12 }
];

// Get random math questions for a game
export function getRandomMathQuestions(count, usedIds = []) {
    const available = MATH_QUESTIONS.filter(q => !usedIds.includes(q.id));
    const pool = available.length >= count ? available : MATH_QUESTIONS;

    // Shuffle and pick
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
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
