// Trivia UI constants - questions are stored server-side only
// This file contains display helpers used by the client

// Category icons for display
export const CATEGORY_ICONS = {
    'Movies': '🎬',
    'Music': '🎵',
    'TV Shows': '📺',
    'Video Games': '🎮',
    'Sports': '⚽',
    'General': '🧠',
    'Colors': '🎨',
    'Shapes': '🔷',
    'Animals': '🐾',
    'Body': '👤',
    'Numbers': '🔢',
    'Food': '🍕',
    'Nature': '🌳',
    'Disney': '🏰',
    'History': '📜',
    'Science': '🔬',
    'Geography': '🌍',
    'Literature': '📚',
    'Art': '🖼️',
    'Technology': '💻',
    'Philosophy': '💭',
    'Economics': '💰',
    'Language': '🗣️',
    'Mathematics': '📐',
    'Medicine': '⚕️',
    'Space': '🚀',
    'Politics': '🏛️',
    'YesNo': '✅',
    'Simple': '⭐',
    'Math': '🔢'
};

// Theme groups for game customization (used in GameSettingsModal)
export const TRIVIA_THEMES = {
    'entertainment': {
        name: 'Entertainment',
        icon: '🎬',
        description: 'Movies, TV, Music & Gaming',
        categories: ['Movies', 'TV Shows', 'Music', 'Video Games']
    },
    'science-nature': {
        name: 'Science & Nature',
        icon: '🔬',
        description: 'Science, Animals, Nature & Space',
        categories: ['Science', 'Animals', 'Nature', 'Space']
    },
    'history-world': {
        name: 'History & World',
        icon: '🌍',
        description: 'History, Geography, Literature & Art',
        categories: ['History', 'Geography', 'Literature', 'Art']
    },
    'kids-fun': {
        name: 'Kids & Fun',
        icon: '🎈',
        description: 'Colors, Shapes, Food, Disney & more',
        categories: ['Colors', 'Shapes', 'Food', 'Disney', 'Body', 'Numbers']
    },
    'general': {
        name: 'General Knowledge',
        icon: '🧠',
        description: 'Sports, Technology & General facts',
        categories: ['General', 'Sports', 'Technology', 'Mathematics', 'Medicine', 'Philosophy', 'Economics', 'Language', 'Politics']
    }
};
