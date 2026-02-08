// Pictionary words and phrases organized by difficulty level
// Very Easy (ages 3-7): Simple, common objects kids can draw
// Easy (ages 7-12): Common objects, animals, activities
// Medium (ages 12-18): More complex objects, some abstract concepts
// Hard (ages 18+): Abstract concepts, short phrases, actions
// Master (PhD): Idioms, complex phrases, challenging scenarios

export const PICTIONARY_VERY_EASY = [
    // Animals
    'CAT', 'DOG', 'FISH', 'BIRD', 'COW', 'PIG', 'DUCK', 'FROG', 'BEE', 'ANT',
    // Objects
    'BALL', 'SUN', 'MOON', 'STAR', 'TREE', 'FLOWER', 'HOUSE', 'CAR', 'BUS', 'BOAT',
    // Food
    'APPLE', 'BANANA', 'PIZZA', 'ICE CREAM', 'COOKIE', 'CAKE', 'EGG', 'BREAD', 'MILK', 'JUICE',
    // Body parts
    'HAND', 'FOOT', 'EYE', 'NOSE', 'MOUTH', 'EAR', 'HAIR', 'TEETH', 'ARM', 'LEG',
    // Simple items
    'BED', 'CHAIR', 'TABLE', 'DOOR', 'WINDOW', 'BOOK', 'PEN', 'CUP', 'SPOON', 'FORK',
    // Nature
    'RAIN', 'CLOUD', 'SNOW', 'RAINBOW', 'LEAF', 'GRASS', 'ROCK', 'WATER', 'FIRE', 'WIND'
];

export const PICTIONARY_EASY = [
    // Animals
    'ELEPHANT', 'GIRAFFE', 'LION', 'MONKEY', 'SNAKE', 'TURTLE', 'RABBIT', 'BUTTERFLY', 'SPIDER', 'DOLPHIN',
    'PENGUIN', 'KANGAROO', 'BEAR', 'HORSE', 'SHEEP', 'CHICKEN', 'OWL', 'SHARK', 'WHALE', 'OCTOPUS',
    // Objects
    'BICYCLE', 'AIRPLANE', 'HELICOPTER', 'ROCKET', 'TRAIN', 'UMBRELLA', 'CAMERA', 'TELEPHONE', 'COMPUTER', 'GUITAR',
    'PIANO', 'DRUM', 'CLOCK', 'LAMP', 'MIRROR', 'SCISSORS', 'HAMMER', 'LADDER', 'TELESCOPE', 'ROBOT',
    // Places/Things
    'CASTLE', 'MOUNTAIN', 'BEACH', 'ISLAND', 'VOLCANO', 'WATERFALL', 'BRIDGE', 'LIGHTHOUSE', 'TENT', 'IGLOO',
    // Food
    'HAMBURGER', 'HOT DOG', 'SANDWICH', 'POPCORN', 'DONUT', 'CUPCAKE', 'PANCAKE', 'SPAGHETTI', 'TACO', 'SUSHI',
    // Activities (simple)
    'SWIMMING', 'RUNNING', 'SLEEPING', 'READING', 'DANCING', 'SINGING', 'COOKING', 'PAINTING', 'FISHING', 'CAMPING'
];

export const PICTIONARY_MEDIUM = [
    // Current word list (from server) plus more
    'TREASURE', 'UNICORN', 'DRAGON', 'PIRATE', 'NINJA', 'ASTRONAUT', 'MERMAID', 'WIZARD', 'VAMPIRE', 'ZOMBIE',
    'DINOSAUR', 'TORNADO', 'EARTHQUAKE', 'AVALANCHE', 'HURRICANE', 'LIGHTNING', 'METEOR', 'ECLIPSE', 'CONSTELLATION', 'GALAXY',
    // Objects
    'SKATEBOARD', 'SURFBOARD', 'PARACHUTE', 'TRAMPOLINE', 'ROLLERCOASTER', 'FERRIS WHEEL', 'BOWLING', 'ARCHERY', 'KARATE', 'GYMNASTICS',
    // Concepts
    'BIRTHDAY PARTY', 'WEDDING', 'GRADUATION', 'HALLOWEEN', 'CHRISTMAS TREE', 'FIREWORKS', 'PARADE', 'CARNIVAL', 'CIRCUS', 'CONCERT',
    // Actions
    'JUGGLING', 'SNOWBOARDING', 'SKYDIVING', 'SCUBA DIVING', 'ROCK CLIMBING', 'BUNGEE JUMPING', 'HORSEBACK RIDING', 'ICE SKATING', 'SURFING', 'SKIING',
    // Misc
    'MAGICIAN', 'SUPERHERO', 'DETECTIVE', 'SCIENTIST', 'FIREFIGHTER', 'CHEF', 'PHOTOGRAPHER', 'ARTIST', 'MUSICIAN', 'ATHLETE'
];

export const PICTIONARY_HARD = [
    // Abstract concepts
    'JEALOUSY', 'FREEDOM', 'CURIOSITY', 'PATIENCE', 'COURAGE', 'WISDOM', 'CHAOS', 'HARMONY', 'NOSTALGIA', 'AMBITION',
    // Phrases - Actions
    'RUNNING LATE', 'WAKING UP EARLY', 'STUCK IN TRAFFIC', 'WAITING IN LINE', 'LOSING YOUR KEYS', 'CHECKING YOUR PHONE', 'MAKING A WISH', 'BREAKING A PROMISE', 'KEEPING A SECRET', 'TELLING A LIE',
    // Phrases - Situations
    'FIRST DATE', 'JOB INTERVIEW', 'AWKWARD SILENCE', 'SURPRISE PARTY', 'BLIND DATE', 'ROAD TRIP', 'POWER OUTAGE', 'TRAFFIC JAM', 'FIRE DRILL', 'FLASH MOB',
    // Phrases - Emotions/States
    'HAVING A BAD DAY', 'FEELING HOMESICK', 'STAGE FRIGHT', 'WRITERS BLOCK', 'MONDAY MORNING', 'FRIDAY NIGHT', 'SLEEPWALKING', 'DAYDREAMING', 'MULTITASKING', 'PROCRASTINATING',
    // Compound concepts
    'TIME TRAVEL', 'GLOBAL WARMING', 'SOCIAL MEDIA', 'VIRTUAL REALITY', 'ARTIFICIAL INTELLIGENCE', 'SPACE STATION', 'BLACK HOLE', 'PARALLEL UNIVERSE', 'DEJA VU', 'KARMA',
    // Actions/Scenarios
    'CATCHING A FLIGHT', 'MISSING THE BUS', 'ORDERING TAKEOUT', 'WORKING FROM HOME', 'BINGE WATCHING', 'ONLINE SHOPPING', 'VIDEO CALL', 'SELFIE STICK', 'ESCAPE ROOM', 'TREASURE HUNT'
];

export const PICTIONARY_MASTER = [
    // Idioms and sayings
    'THE EARLY BIRD CATCHES THE WORM', 'DONT CRY OVER SPILLED MILK', 'WALKING ON THIN ICE', 'PIECE OF CAKE', 'BREAK A LEG', 'COSTS AN ARM AND A LEG', 'ELEPHANT IN THE ROOM', 'RAINING CATS AND DOGS', 'WHEN PIGS FLY', 'KILL TWO BIRDS WITH ONE STONE',
    'LET THE CAT OUT OF THE BAG', 'BARKING UP THE WRONG TREE', 'BITE THE BULLET', 'BURNING THE MIDNIGHT OIL', 'HIT THE NAIL ON THE HEAD', 'JUMP ON THE BANDWAGON', 'ONCE IN A BLUE MOON', 'SPILL THE BEANS', 'THE BALL IS IN YOUR COURT', 'THROW IN THE TOWEL',
    // Complex scenarios
    'CAUGHT BETWEEN A ROCK AND A HARD PLACE', 'TURNING OVER A NEW LEAF', 'BURNING BRIDGES', 'CROSSING THE FINISH LINE', 'CLIMBING THE CORPORATE LADDER', 'PASSING THE TORCH', 'OPENING A CAN OF WORMS', 'STIRRING THE POT', 'READING BETWEEN THE LINES', 'THINKING OUTSIDE THE BOX',
    // Abstract phrases
    'DIAMOND IN THE ROUGH', 'NEEDLE IN A HAYSTACK', 'TIP OF THE ICEBERG', 'LIGHT AT THE END OF THE TUNNEL', 'WOLF IN SHEEPS CLOTHING', 'BLESSING IN DISGUISE', 'SILVER LINING', 'DOUBLE EDGED SWORD', 'SLIPPERY SLOPE', 'DOMINO EFFECT',
    // Complex actions
    'PUTTING ALL YOUR EGGS IN ONE BASKET', 'BEATING AROUND THE BUSH', 'BITING OFF MORE THAN YOU CAN CHEW', 'GETTING YOUR DUCKS IN A ROW', 'HITTING THE GROUND RUNNING', 'LEAVING NO STONE UNTURNED', 'PLAYING DEVILS ADVOCATE', 'SEEING EYE TO EYE', 'STEALING SOMEONES THUNDER', 'TAKING THE BULL BY THE HORNS'
];

// All words combined for reference
export const ALL_PICTIONARY_WORDS = {
    'super-easy': PICTIONARY_VERY_EASY,  // Use very-easy for super-easy for now
    'very-easy': PICTIONARY_VERY_EASY,
    'easy': PICTIONARY_EASY,
    'medium': PICTIONARY_MEDIUM,
    'hard': PICTIONARY_HARD,
    'very-hard': PICTIONARY_HARD,  // Use hard for very-hard for now
    'genius': PICTIONARY_MASTER
};

/**
 * Get a random word from a specific difficulty level
 * @param {string} difficulty - Difficulty level ID
 * @param {array} usedWords - Words already used (to avoid repeats)
 * @returns {string} A random word/phrase
 */
export function getRandomWord(difficulty, usedWords = []) {
    const words = ALL_PICTIONARY_WORDS[difficulty] || PICTIONARY_MEDIUM;
    const available = words.filter(w => !usedWords.includes(w));
    const pool = available.length > 0 ? available : words;
    return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get word options for the drawer spanning multiple difficulty levels
 * @param {string} lowestDifficulty - The lowest difficulty among players
 * @param {string} highestDifficulty - The highest difficulty (usually drawer's level)
 * @param {array} usedWords - Words already used
 * @param {number} count - Number of options to return (default 3)
 * @returns {array} Array of { word, difficulty, difficultyLabel } objects
 */
export function getWordOptions(lowestDifficulty, highestDifficulty, usedWords = [], count = 3) {
    const difficultyOrder = ['super-easy', 'very-easy', 'easy', 'medium', 'hard', 'very-hard', 'genius'];
    const difficultyLabels = {
        'super-easy': 'Super Easy',
        'very-easy': 'Very Easy',
        'easy': 'Easy',
        'medium': 'Medium',
        'hard': 'Hard',
        'very-hard': 'Very Hard',
        'genius': 'Genius'
    };

    const lowestIdx = difficultyOrder.indexOf(lowestDifficulty);
    const highestIdx = difficultyOrder.indexOf(highestDifficulty);

    // Get range of difficulties to include
    const minIdx = Math.max(0, lowestIdx);
    const maxIdx = Math.min(difficultyOrder.length - 1, highestIdx);

    // Collect difficulties to use
    const difficultiesToUse = [];
    for (let i = minIdx; i <= maxIdx; i++) {
        difficultiesToUse.push(difficultyOrder[i]);
    }

    // If we don't have enough difficulties, expand the range
    while (difficultiesToUse.length < count && difficultiesToUse.length < difficultyOrder.length) {
        const lastIdx = difficultyOrder.indexOf(difficultiesToUse[difficultiesToUse.length - 1]);
        if (lastIdx < difficultyOrder.length - 1) {
            difficultiesToUse.push(difficultyOrder[lastIdx + 1]);
        } else {
            break;
        }
    }

    // Select words, prioritizing variety across difficulties
    const options = [];
    const usedDifficulties = new Set();

    // First, try to get one word from each difficulty
    for (const diff of difficultiesToUse) {
        if (options.length >= count) break;
        const word = getRandomWord(diff, [...usedWords, ...options.map(o => o.word)]);
        options.push({
            word,
            difficulty: diff,
            difficultyLabel: difficultyLabels[diff]
        });
        usedDifficulties.add(diff);
    }

    // If we still need more, add from available difficulties
    while (options.length < count) {
        const diff = difficultiesToUse[Math.floor(Math.random() * difficultiesToUse.length)];
        const word = getRandomWord(diff, [...usedWords, ...options.map(o => o.word)]);
        options.push({
            word,
            difficulty: diff,
            difficultyLabel: difficultyLabels[diff]
        });
    }

    // Sort by difficulty (easiest first)
    options.sort((a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty));

    return options;
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
