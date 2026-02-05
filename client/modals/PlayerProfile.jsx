import React from 'react';
import { Crown } from '../icons/UIIcons';
import CharacterSVG from '../icons/CharacterSVGs';
import { rarityConfig } from '../data/themes';

// Dummy profile data (dev placeholder — will be replaced with real data later)
const DEV_LEVEL = { level: 12, xp: 7400, xpNext: 10000 };

const DEV_STATS = [
    { id: 'games_played', label: 'Games Played', value: 47 },
    { id: 'wins', label: 'Wins', value: 18 },
    { id: 'win_rate', label: 'Win Rate', value: '38%' },
    { id: 'best_streak', label: 'Best Streak', value: 5 },
    { id: 'total_points', label: 'Total Points', value: '12.4k' },
    { id: 'fav_game', label: 'Fav Game', value: 'Pictionary' },
];

const DEV_MEDALS = [
    { id: 'first_win', label: 'First Victory', icon: '🥇', earned: true, desc: 'Win your first game' },
    { id: 'sharp_eye', label: 'Sharp Eye', icon: '👁️', earned: true, desc: 'Guess in under 10s' },
    { id: 'artist', label: 'Picasso', icon: '🎨', earned: true, desc: 'Draw a winning round' },
    { id: 'streak_3', label: 'Hat Trick', icon: '🔥', earned: true, desc: '3 wins in a row' },
    { id: 'social', label: 'Social Butterfly', icon: '💬', earned: true, desc: 'Send 50 chat messages' },
    { id: 'streak_10', label: 'Unstoppable', icon: '💎', earned: false, desc: '10 wins in a row' },
    { id: 'veteran', label: 'Veteran', icon: '🎖️', earned: false, desc: 'Play 100 games' },
    { id: 'perfectionist', label: 'Perfectionist', icon: '✨', earned: false, desc: 'Win 5 games with max points' },
    { id: 'collector', label: 'Collector', icon: '🃏', earned: false, desc: 'Unlock 20 characters' },
];

const DEV_MEMBER_SINCE = 'Jan 2026';

function ordinalSuffix(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function PlayerProfile({
    theme,
    currentTheme,
    playerProfileModal,
    setPlayerProfileModal,
    gameHistory = [],
}) {
    const p = playerProfileModal;
    const char = p.character;
    const rarity = char?.rarity || 'common';
    const rc = rarityConfig[rarity];
    const xpPercent = Math.round((DEV_LEVEL.xp / DEV_LEVEL.xpNext) * 100);
    const earnedCount = DEV_MEDALS.filter(m => m.earned).length;

    const cardCls = theme === 'tron' ? 'bg-gray-900 border border-cyan-500/30' : theme === 'kids' ? 'bg-white border-2 border-purple-300' : 'bg-gray-900 border border-orange-700/50';
    const accentColor = theme === 'tron' ? '#06b6d4' : theme === 'kids' ? '#a855f7' : '#ea580c';

    // Compute per-player game history
    const playerGameHistory = gameHistory.map((entry, gameIdx) => {
        const playerRoundScores = entry.roundScores?.[p.name] || [];
        if (playerRoundScores.length === 0) {
            // Check if player appears in finalScores with score > 0
            const inFinal = entry.finalScores?.find(f => f.name === p.name);
            if (!inFinal || inFinal.score === 0) return null;
        }
        const total = playerRoundScores.reduce((sum, rs) => sum + rs.points, 0);
        const position = (entry.finalScores || []).findIndex(f => f.name === p.name) + 1;

        // Group by round and sum points
        const roundGroups = {};
        playerRoundScores.forEach(rs => {
            roundGroups[rs.round] = (roundGroups[rs.round] || 0) + rs.points;
        });
        const roundSummary = Object.entries(roundGroups)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([round, pts]) => `round ${round}: ${pts}pts`);

        return {
            gameNumber: gameIdx + 1,
            game: entry.game,
            total,
            position,
            roundSummary
        };
    }).filter(Boolean);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setPlayerProfileModal(null)}>
            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl max-w-sm w-full max-h-[90vh] flex flex-col ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`} onClick={(e) => e.stopPropagation()}>
                {/* Scrollable content */}
                <div className={`flex-1 overflow-y-auto p-5 md:p-6 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                    {/* Header: avatar + name + level */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`shrink-0 p-2 rounded-xl ${theme === 'tron' ? 'bg-cyan-500/10' : theme === 'kids' ? 'bg-gradient-to-br from-purple-200 to-pink-200' : 'bg-gradient-to-br from-gray-900 to-orange-950/50'}`}
                            style={{ boxShadow: theme === 'tron' ? `0 0 15px ${char?.color}40` : theme === 'scary' ? `0 0 15px ${char?.color}30` : undefined }}
                        >
                            <CharacterSVG characterId={char?.id || 'meta'} size={72} color={char?.color || '#06b6d4'} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-base font-bold ${currentTheme.text} truncate`}>{p.name}</span>
                                {p.isMaster && (
                                    <Crown className={`w-4 h-4 shrink-0 ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-yellow-500' : 'text-orange-400'}`} fill="currentColor" />
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className={`text-xs font-semibold ${currentTheme.text}`} style={{ color: rc?.color }}>{char?.name || 'Unknown'}</span>
                                {rc && <span className="text-[0.55rem] font-semibold uppercase tracking-wider" style={{ color: rc.color, opacity: 0.7 }}>{rc.label}</span>}
                            </div>
                            <div className={`text-[0.6rem] ${currentTheme.textSecondary}`}>Member since {DEV_MEMBER_SINCE}</div>
                        </div>
                    </div>

                    {/* Game History */}
                    {playerGameHistory.length > 0 && (
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-bold ${currentTheme.text} uppercase tracking-wider`}>Game History</span>
                                <span className={`text-[0.6rem] ${currentTheme.textSecondary}`}>{playerGameHistory.length} game{playerGameHistory.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="space-y-2">
                                {playerGameHistory.map((gh, idx) => (
                                    <div key={idx} className={`${cardCls} rounded-xl p-3`}>
                                        <div className={`text-xs font-bold ${currentTheme.text}`}>
                                            {gh.gameNumber} - {gh.game}: {gh.total}pts{gh.position > 0 ? `, ${ordinalSuffix(gh.position)} place` : ''}
                                        </div>
                                        {gh.roundSummary.length > 0 && (
                                            <div className={`text-[0.6rem] ${currentTheme.textSecondary} mt-1`}>
                                                ({gh.roundSummary.join(', ')})
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Level + XP bar */}
                    <div className={`${cardCls} rounded-xl p-3 mb-3`}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-xs font-bold ${currentTheme.text}`}>Level {DEV_LEVEL.level}</span>
                            <span className={`text-[0.6rem] ${currentTheme.textSecondary}`}>{DEV_LEVEL.xp.toLocaleString()} / {DEV_LEVEL.xpNext.toLocaleString()} XP</span>
                        </div>
                        <div className={`w-full h-2.5 rounded-full ${theme === 'tron' ? 'bg-gray-800' : theme === 'kids' ? 'bg-purple-100' : 'bg-gray-800'}`}>
                            <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${xpPercent}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`, boxShadow: `0 0 8px ${accentColor}60` }}
                            />
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {DEV_STATS.map(s => (
                            <div key={s.id} className={`text-center px-1 py-2 rounded-xl ${cardCls}`}>
                                <div className={`text-sm font-bold ${currentTheme.text}`}>{s.value}</div>
                                <div className={`text-[0.55rem] ${currentTheme.textSecondary} leading-tight`}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Medals */}
                    <div className="mb-1">
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-bold ${currentTheme.text} uppercase tracking-wider`}>Medals</span>
                            <span className={`text-[0.6rem] ${currentTheme.textSecondary}`}>{earnedCount}/{DEV_MEDALS.length}</span>
                        </div>
                        <div className={`max-h-48 overflow-y-auto ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                            <div className="grid grid-cols-3 gap-2">
                                {DEV_MEDALS.map(m => (
                                    <div
                                        key={m.id}
                                        className={`text-center px-1 py-2.5 rounded-xl ${
                                            m.earned ? cardCls : `${cardCls} opacity-40`
                                        }`}
                                    >
                                        <div className="text-2xl mb-1" style={m.earned ? {} : { filter: 'grayscale(1)' }}>{m.icon}</div>
                                        <div className={`text-[0.6rem] font-bold leading-tight ${m.earned ? currentTheme.text : 'text-gray-600'}`}>{m.label}</div>
                                        <div className={`text-[0.5rem] mt-0.5 leading-tight ${m.earned ? currentTheme.textSecondary : 'text-gray-700'}`}>{m.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed footer */}
                <div className="p-4 pt-2">
                    <button
                        onClick={() => setPlayerProfileModal(null)}
                        className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PlayerProfile;
