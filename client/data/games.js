// Default game configurations
export const GAME_DEFAULTS = {
    pictionary: {
        drawerTime: 60,  // seconds per drawer
        drawerTimeOptions: [30, 60, 90, 120, 150, 180]
    },
    trivia: {
        themes: ['all'],  // 'all' or array of theme IDs
        // Shared quiz settings (also used by quickmath)
        questionsPerRound: 5,        // 3-15 questions per round
        speedRoundDuration: 60,      // 30-120 seconds
        questionTime: 15             // 10-30 seconds per question
    },
    quickmath: {
        // Uses same shared settings structure
        questionsPerRound: 5,
        speedRoundDuration: 60,
        questionTime: 15
    },
    memory: {
        challengesPerRound: 3,       // 1-7 challenges per round (except speed round)
        displayTimeMultiplier: 1.0,  // 0.5-2.0x display time multiplier
        speedRoundDuration: 60       // 30-120 seconds for speed round
    },
    // Shared settings ranges for UI sliders
    sharedQuizSettings: {
        questionsPerRound: { min: 3, max: 15, default: 5 },
        speedRoundDuration: { min: 30, max: 120, default: 60 },
        questionTime: { min: 10, max: 30, default: 15 }
    },
    // Memory game settings ranges
    memorySettings: {
        challengesPerRound: { min: 1, max: 7, default: 3 },
        displayTimeMultiplier: { min: 0.5, max: 2.0, default: 1.0, step: 0.1 },
        speedRoundDuration: { min: 30, max: 120, default: 60 }
    }
};

export const MOCK_GAMES = [
    {
        id: 1,
        name: 'Trivia Master',
        icon: '🧠',
        color: '#FF6B6B',
        rating: 4.8,
        description: 'Test your knowledge across multiple categories. Fast-paced questions with real-time scoring.',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '2-8',
        ageMin: 10,
        gameType: 'trivia'
    },
    {
        id: 2,
        name: 'Drawing Battle',
        icon: '🎨',
        color: '#4ECDC4',
        rating: 4.6,
        description: 'Draw and guess in this creative multiplayer game. Perfect for artists and doodlers alike!',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '3-10',
        ageMin: 6,
        gameType: 'pictionary'
    },
    {
        id: 3,
        name: 'Word Rush',
        icon: '📝',
        color: '#FFE66D',
        rating: 4.7,
        description: 'Create words from letters before time runs out. Competitive wordplay at its finest.',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '1-6',
        ageMin: 8
    },
    {
        id: 4,
        name: 'Memory Master',
        icon: '🧠',
        color: '#95E1D3',
        rating: 4.5,
        description: 'Test your memory with grids, sequences, and spot-the-difference challenges!',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '2-8',
        ageMin: 3,
        gameType: 'memory'
    },
    {
        id: 5,
        name: 'Quick Math',
        icon: '🔢',
        color: '#F38181',
        rating: 4.9,
        description: 'Solve math problems faster than your opponents. Educational and exciting!',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '1-8',
        ageMin: 7,
        gameType: 'quickmath'
    },
    {
        id: 6,
        name: 'Emoji Charades',
        icon: '😂',
        color: '#AA96DA',
        rating: 4.7,
        description: 'Guess phrases from emoji combinations. Fun for all ages and skill levels.',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '2-12',
        ageMin: 8
    },
    {
        id: 7,
        name: 'Speed Typing',
        icon: '⌨️',
        color: '#F9A826',
        rating: 4.4,
        description: 'Race against others in this fast-paced typing challenge. Improve your WPM!',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '1-6',
        ageMin: 10
    },
    {
        id: 8,
        name: 'Puzzle Rush',
        icon: '🧩',
        color: '#5F27CD',
        rating: 4.6,
        description: 'Complete jigsaw puzzles collaboratively or competitively. Multiple difficulty levels.',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '1-4',
        ageMin: 6
    },
    {
        id: 9,
        name: 'Music Quiz',
        icon: '🎵',
        color: '#00D2D3',
        rating: 4.8,
        description: 'Identify songs and artists from short clips. Perfect for music lovers!',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '2-10',
        ageMin: 12
    },
    {
        id: 10,
        name: 'Reaction Time',
        icon: '⚡',
        color: '#FF3838',
        rating: 4.3,
        description: 'Test your reflexes in various quick-tap challenges. Lightning fast gameplay!',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '1-8',
        ageMin: 8
    },
    {
        id: 11,
        name: 'Story Builder',
        icon: '📖',
        color: '#FF6348',
        rating: 4.5,
        description: 'Collaboratively create hilarious stories one sentence at a time.',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '3-8',
        ageMin: 10
    },
    {
        id: 12,
        name: 'Color Match',
        icon: '🎨',
        color: '#786FA6',
        rating: 4.4,
        description: 'Match colors and patterns in this visually stunning puzzle game.',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '1-4',
        ageMin: 5
    },
    {
        id: 13,
        name: 'Geography Quest',
        icon: '🌍',
        color: '#F8B500',
        rating: 4.7,
        description: 'Explore the world through map challenges and country trivia.',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '2-6',
        ageMin: 12
    },
    {
        id: 14,
        name: 'Rhythm Master',
        icon: '🎼',
        color: '#E74292',
        rating: 4.6,
        description: 'Hit the beats and create music together in this rhythm game.',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '1-6',
        ageMin: 8
    },
    {
        id: 15,
        name: 'Logic Puzzles',
        icon: '🤔',
        color: '#546DE5',
        rating: 4.8,
        description: 'Solve complex logic problems and brain teasers together.',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '1-4',
        ageMin: 14
    },
    {
        id: 16,
        name: 'Party Minigames',
        icon: '🎉',
        color: '#26DE81',
        rating: 4.9,
        description: 'Collection of quick party games perfect for large groups.',
        youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        players: '4-16',
        ageMin: 6
    },
];
