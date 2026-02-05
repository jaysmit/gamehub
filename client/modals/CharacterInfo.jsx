import React from 'react';
import CharacterSVG from '../icons/CharacterSVGs';

function CharacterInfo({
    theme,
    currentTheme,
    characterInfoModal,
    setCharacterInfoModal,
    rarityConfig,
}) {
    const c = characterInfoModal;
    const rc = rarityConfig[c.rarity || 'common'];
    const isLocked = c.unlock != null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={() => setCharacterInfoModal(null)}>
            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl max-w-sm w-full p-6 ${rc.glow}`} style={{ border: `2px solid ${rc.color}40` }} onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-4">
                    <div className="inline-block mb-3">
                        <CharacterSVG characterId={c.id} size={100} color={isLocked ? '#555' : c.color} />
                    </div>
                    <h3 className={`text-xl font-bold ${currentTheme.font}`} style={{ color: rc.color }}>{c.name}</h3>
                    <span className="inline-block mt-1 text-[0.65rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ color: rc.color, background: `${rc.color}20`, border: `1px solid ${rc.color}40` }}>
                        {rc.label}
                    </span>
                </div>
                <p className={`${currentTheme.textSecondary} text-sm text-center mb-4 leading-relaxed`}>
                    {c.description || 'A character of the grid.'}
                </p>
                {isLocked ? (
                    <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={rc.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: rc.color }}>How to Unlock</span>
                        </div>
                        <p className="text-sm text-cyan-300 font-medium">{c.unlock}</p>
                    </div>
                ) : (
                    <div className="text-center mb-4">
                        <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Unlocked</span>
                    </div>
                )}
                <button
                    onClick={() => setCharacterInfoModal(null)}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-cyan-400 tron-border font-bold py-2.5 rounded-xl transition-all text-sm"
                >
                    [ CLOSE ]
                </button>
            </div>
        </div>
    );
}

export default CharacterInfo;
