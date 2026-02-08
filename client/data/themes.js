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
    common:    { label: 'Common',    color: '#6b7fa3', border: 'border-slate-500/40',  bg: 'bg-slate-500/10',   glow: '' },
    uncommon:  { label: 'Uncommon',  color: '#2dd4a0', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', glow: '' },
    rare:      { label: 'Rare',      color: '#00d4ff', border: 'border-cyan-400/50',   bg: 'bg-cyan-400/10',    glow: 'shadow-[0_0_8px_rgba(0,212,255,0.35)]' },
    epic:      { label: 'Epic',      color: '#a855f7', border: 'border-purple-500/50', bg: 'bg-purple-500/10',  glow: 'shadow-[0_0_14px_rgba(168,85,247,0.45)]' },
    legendary: { label: 'Legendary', color: '#ff7b00', border: 'border-orange-500/60', bg: 'bg-orange-500/15',  glow: 'shadow-[0_0_22px_rgba(255,123,0,0.6)]' }
};
