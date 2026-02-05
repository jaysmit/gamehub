export const themes = {
    tron: {
        bg: 'bg-black',
        gradientFrom: 'from-black',
        gradientVia: 'via-gray-900',
        gradientTo: 'to-black',
        text: 'text-cyan-400',
        textSecondary: 'text-cyan-300',
        accent: 'bg-cyan-500',
        accentHover: 'hover:bg-cyan-400',
        border: 'border-cyan-400',
        glow: 'tron-glow',
        font: 'font-orbitron',
        cardBg: 'bg-gray-900/90',
        headerBg: 'bg-black/90'
    },
    kids: {
        bg: 'bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300',
        gradientFrom: 'from-pink-400',
        gradientVia: 'via-purple-400',
        gradientTo: 'to-blue-400',
        text: 'text-purple-800',
        textSecondary: 'text-purple-600',
        accent: 'bg-pink-500',
        accentHover: 'hover:bg-pink-400',
        border: 'border-purple-400',
        glow: 'kids-shadow',
        font: 'font-quicksand',
        cardBg: 'bg-white/90',
        headerBg: 'bg-white/80'
    },
    scary: {
        bg: 'bg-black',
        gradientFrom: 'from-gray-900',
        gradientVia: 'via-orange-950',
        gradientTo: 'to-black',
        text: 'text-orange-500',
        textSecondary: 'text-orange-600',
        accent: 'bg-orange-700',
        accentHover: 'hover:bg-orange-600',
        border: 'border-orange-700',
        glow: 'shadow-[0_0_20px_rgba(194,65,12,0.6)]',
        font: 'font-orbitron',
        cardBg: 'bg-gray-950/95',
        headerBg: 'bg-black/95'
    }
};

export const rarityConfig = {
    common:    { label: 'Common',    color: '#94a3b8', border: 'border-gray-500/40',   bg: 'bg-gray-500/10',    glow: '' },
    uncommon:  { label: 'Uncommon',  color: '#22c55e', border: 'border-green-500/40',  bg: 'bg-green-500/10',   glow: '' },
    rare:      { label: 'Rare',      color: '#8b5cf6', border: 'border-purple-500/50', bg: 'bg-purple-500/10',  glow: 'shadow-[0_0_12px_rgba(139,92,246,0.4)]' },
    legendary: { label: 'Legendary', color: '#f59e0b', border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]' }
};
