import React from 'react';
import CharacterSVG from '../icons/CharacterSVGs';

function AvatarPicker({
    theme,
    currentTheme,
    avatarPickerMode,
    setAvatarPickerMode,
    selectedAvatar,
    setSelectedAvatar,
    availableCharacters,
    takenCharacters,
    avatarTimerCount,
    confirmAvatarSelection,
    avatarTakenToast,
    setAvatarTakenToast,
    setCharacterInfoModal,
    rarityConfig,
    currentRoom,
    playerName,
}) {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-300' : 'border-4 border-orange-600'}`}>
                {/* Fixed Header */}
                <div className="p-6 md:p-8 pb-4">
                    <h2 className={`text-2xl md:text-3xl font-bold ${currentTheme.text} mb-2 text-center ${currentTheme.font}`}>
                        {theme === 'tron' ? 'SELECT_CHARACTER' : theme === 'kids' ? 'Choose Your Character!' : 'SUMMON YOUR AVATAR'}
                    </h2>
                    <p className={`${currentTheme.textSecondary} text-center text-sm md:text-base`}>
                        {avatarPickerMode === 'change'
                            ? 'Select a new avatar'
                            : theme === 'scary' ? 'Choose wisely... others cannot take your form' : 'Pick a character - each is unique to you!'}
                    </p>
                    {/* Timer for initial mode */}
                    {avatarPickerMode === 'initial' && (
                        <div className="text-center mt-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold font-mono ${
                                avatarTimerCount <= 10 ? 'bg-red-500/30 text-red-400 animate-pulse' : 'bg-cyan-500/20 text-cyan-400'
                            }`}>
                                {avatarTimerCount}s
                            </span>
                        </div>
                    )}
                </div>

                {/* "Already taken" toast */}
                {avatarTakenToast && (
                    <div className="mx-6 mb-2 p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-center text-red-400 text-sm font-semibold" style={{ animation: 'softPulse 0.5s ease-in-out' }}>
                        "{avatarTakenToast}" is already taken!
                    </div>
                )}

                {/* Scrollable Character Grid */}
                <div className={`flex-1 overflow-y-auto px-6 md:px-8 min-h-0 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                    {['common', 'uncommon', 'rare', 'legendary'].map(rarity => {
                        const chars = availableCharacters.filter(c => (c.rarity || 'common') === rarity);
                        if (chars.length === 0) return null;
                        const rc = rarityConfig[rarity];
                        return (
                            <div key={rarity} className="mb-4">
                                <div className="flex items-center gap-2 mb-2 pt-1">
                                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: rc.color }}>{rc.label}</span>
                                    <div className="flex-1 h-px" style={{ background: rc.color, opacity: 0.3 }}></div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {chars.map((character) => {
                                        const myRoomAvatar = currentRoom?.players.find(p => p.name === playerName)?.avatar;
                                        const isTaken = takenCharacters.filter(a => a !== myRoomAvatar).includes(character.id);
                                        const isLocked = character.unlock != null;
                                        const isSelected = selectedAvatar === character.id;
                                        return (
                                            <div key={character.id} className="relative">
                                                <button
                                                    onClick={() => {
                                                        if (isLocked) return;
                                                        if (isTaken) {
                                                            setAvatarTakenToast(character.name);
                                                            setTimeout(() => setAvatarTakenToast(''), 2000);
                                                            return;
                                                        }
                                                        setSelectedAvatar(character.id);
                                                    }}
                                                    disabled={isLocked}
                                                    className={`relative w-full p-3 rounded-xl transition-all ${
                                                        isLocked
                                                            ? `opacity-90 cursor-not-allowed bg-gray-800/40 border ${rc.border}`
                                                            : isTaken
                                                                ? 'opacity-40 bg-gray-800/30 grayscale cursor-pointer'
                                                                : isSelected
                                                                    ? `bg-cyan-500/30 tron-border scale-105 ring-4 ring-cyan-400 ${rc.glow}`
                                                                    : `bg-gray-800/50 border ${rc.border} hover:bg-gray-700/50 hover:scale-105 ${rc.glow}`
                                                    }`}
                                                >
                                                    {/* Rarity dot */}
                                                    <div className="absolute top-1.5 left-1.5">
                                                        <div className="w-2 h-2 rounded-full" style={{ background: rc.color }}></div>
                                                    </div>
                                                    {/* Lock icon */}
                                                    {isLocked && (
                                                        <div className="absolute top-1.5 right-1.5">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={rc.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className={`mb-1 flex justify-center ${isLocked ? 'grayscale' : ''}`}>
                                                        <CharacterSVG characterId={character.id} size={60} color={isLocked ? '#555' : character.color} />
                                                    </div>
                                                    <div className={`text-xs font-semibold text-center ${(isLocked || isTaken) ? 'text-gray-600' : currentTheme.text}`}>
                                                        {character.name}
                                                        {isTaken && !isLocked && <div className="text-[0.6rem] text-gray-500 mt-0.5">Taken</div>}
                                                    </div>
                                                </button>
                                                {/* Info button */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setCharacterInfoModal(character); }}
                                                    className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-gray-700/80 hover:bg-gray-600 transition-colors"
                                                    style={{ color: rc.color }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Fixed Footer */}
                <div className="p-6 md:p-8 pt-4 flex gap-3">
                    <button
                        onClick={confirmAvatarSelection}
                        disabled={!selectedAvatar || selectedAvatar === 'meta'}
                        className={`flex-1 ${
                            !selectedAvatar || selectedAvatar === 'meta'
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'
                        } font-bold py-3 rounded-xl transition-all`}
                    >
                        {theme === 'tron' ? '[ CONFIRM ]' : 'Confirm'}
                    </button>
                    {avatarPickerMode === 'change' && (
                        <button
                            onClick={() => setAvatarPickerMode(null)}
                            className={`px-6 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-gray-800 hover:bg-gray-700 text-orange-400'} font-bold py-3 rounded-xl transition-all`}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AvatarPicker;
