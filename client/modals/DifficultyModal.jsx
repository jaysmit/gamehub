import React from 'react';
import CharacterSVG from '../icons/CharacterSVGs';
import { DIFFICULTY_LEVELS, getDifficultyById, getDifficultyColors, getPlayerDifficulty } from '../data/difficulty';

/**
 * DifficultyModal - Modal for room master to set difficulty levels
 *
 * Props:
 * - theme: string - Current theme ('tron', 'kids', 'scary')
 * - currentTheme: object - Theme configuration
 * - currentRoom: object - Room data with players array
 * - playerName: string - Current player's name
 * - availableCharacters: array - Character data for avatar lookup
 * - roomDifficulty: string - Current room default difficulty
 * - playerDifficulties: object - Map of playerName -> individual difficulty
 * - onSetRoomDifficulty: function(difficulty, applyToAll) - Set room difficulty
 * - onSetPlayerDifficulty: function(playerName, difficulty) - Set individual player difficulty
 * - onClose: function - Close the modal
 */
const DifficultyModal = ({
    theme,
    currentTheme,
    currentRoom,
    playerName,
    availableCharacters,
    roomDifficulty,
    playerDifficulties,
    onSetRoomDifficulty,
    onSetPlayerDifficulty,
    onClose
}) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto ${
                theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'
            } ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-lg md:text-xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                        {theme === 'tron' ? '> DIFFICULTY_SETTINGS' : 'Difficulty Settings'}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-all ${
                            theme === 'tron'
                                ? 'hover:bg-cyan-500/20 text-cyan-400'
                                : theme === 'kids'
                                    ? 'hover:bg-purple-200 text-purple-600'
                                    : 'hover:bg-orange-900/30 text-orange-400'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Room Default Difficulty */}
                <div className={`mb-4 p-3 rounded-xl ${
                    theme === 'tron' ? 'bg-gray-800/50 border border-cyan-500/30' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-900/50 border border-orange-700/30'
                }`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${currentTheme.text}`}>
                            {theme === 'tron' ? 'ROOM_DEFAULT' : 'Room Default'}
                        </span>
                        <button
                            onClick={() => onSetRoomDifficulty(roomDifficulty, true)}
                            className={`text-[0.6rem] md:text-xs px-2 py-1 rounded-lg font-semibold transition-all ${
                                theme === 'tron'
                                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                                    : theme === 'kids'
                                        ? 'bg-purple-300 hover:bg-purple-400 text-purple-800'
                                        : 'bg-orange-900/30 hover:bg-orange-900/50 text-orange-400 border border-orange-700/50'
                            }`}
                        >
                            Apply to All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {DIFFICULTY_LEVELS.map((diff) => {
                            const colors = getDifficultyColors(diff.id, theme);
                            const isSelected = roomDifficulty === diff.id;
                            return (
                                <button
                                    key={diff.id}
                                    onClick={() => onSetRoomDifficulty(diff.id, false)}
                                    className={`px-2 py-1 rounded-lg text-[0.65rem] md:text-xs font-bold transition-all border ${
                                        isSelected
                                            ? `${colors.badge} text-white border-transparent ring-2 ring-offset-1 ${
                                                theme === 'tron' ? 'ring-cyan-400 ring-offset-gray-900' : theme === 'kids' ? 'ring-purple-500 ring-offset-purple-100' : 'ring-orange-500 ring-offset-gray-900'
                                            }`
                                            : `${colors.bg} ${colors.text} ${colors.border} hover:scale-105`
                                    }`}
                                >
                                    {diff.label}
                                    <span className="ml-1 opacity-70 text-[0.55rem]">({diff.ageRange})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Player List */}
                <div className="space-y-2">
                    <h3 className={`text-sm font-bold ${currentTheme.text} mb-2`}>
                        {theme === 'tron' ? 'PLAYER_DIFFICULTIES' : 'Player Difficulties'}
                    </h3>
                    {currentRoom?.players?.map((player) => {
                        const character = player.avatar === 'meta'
                            ? { id: 'meta', name: 'Joining...', color: '#06b6d4' }
                            : (availableCharacters?.find(c => c.id === player.avatar) || availableCharacters?.[0] || { color: '#06b6d4' });
                        const playerDiff = getPlayerDifficulty(player.name, playerDifficulties, roomDifficulty);
                        const isOverride = playerDifficulties[player.name] && playerDifficulties[player.name] !== roomDifficulty;
                        const colors = getDifficultyColors(playerDiff, theme);

                        return (
                            <div
                                key={player.name}
                                className={`flex items-center gap-3 p-2 rounded-xl ${
                                    theme === 'tron' ? 'bg-gray-800/30 border border-gray-700/50' : theme === 'kids' ? 'bg-white/50 border border-purple-200' : 'bg-gray-900/30 border border-gray-800'
                                }`}
                            >
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    theme === 'tron' ? 'bg-cyan-500/20' : theme === 'kids' ? 'bg-purple-100' : 'bg-orange-900/30'
                                }`}>
                                    <CharacterSVG characterId={player.avatar} size={32} color={character.color} />
                                </div>

                                {/* Name + Crown */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1">
                                        {player.isMaster && (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                            </svg>
                                        )}
                                        <span className={`font-bold text-sm ${currentTheme.text} truncate`}>
                                            {player.name}
                                            {player.name === playerName && <span className="ml-1 opacity-50">(you)</span>}
                                        </span>
                                    </div>
                                    {isOverride && (
                                        <span className={`text-[0.55rem] ${currentTheme.textSecondary}`}>
                                            Custom difficulty
                                        </span>
                                    )}
                                </div>

                                {/* Difficulty Dropdown */}
                                <select
                                    value={playerDiff}
                                    onChange={(e) => onSetPlayerDifficulty(player.name, e.target.value)}
                                    className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all border ${colors.border}`}
                                    style={{
                                        minWidth: '85px',
                                        backgroundColor: theme === 'tron' ? '#1f2937' : theme === 'kids' ? '#ffffff' : '#111827',
                                        color: theme === 'tron' ? '#22d3ee' : theme === 'kids' ? '#7c3aed' : '#fb923c'
                                    }}
                                >
                                    {DIFFICULTY_LEVELS.map((diff) => (
                                        <option
                                            key={diff.id}
                                            value={diff.id}
                                            style={{
                                                backgroundColor: theme === 'tron' ? '#1f2937' : theme === 'kids' ? '#ffffff' : '#111827',
                                                color: theme === 'tron' ? '#22d3ee' : theme === 'kids' ? '#7c3aed' : '#fb923c'
                                            }}
                                        >
                                            {diff.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    })}
                </div>

                {/* Info Text */}
                <div className={`mt-4 p-3 rounded-xl text-xs ${
                    theme === 'tron' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : theme === 'kids' ? 'bg-purple-100 text-purple-700' : 'bg-orange-900/20 text-orange-300 border border-orange-700/20'
                }`}>
                    <p className="mb-1 font-semibold">
                        {theme === 'tron' ? '> INFO' : 'How it works'}
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 opacity-80">
                        <li>Room default applies to new players</li>
                        <li>Individual settings override the default</li>
                        <li>In Trivia/Math, players are grouped by difficulty and take turns</li>
                        <li>In Pictionary, the drawer chooses from words matching player levels</li>
                    </ul>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`w-full mt-4 py-3 rounded-xl font-bold transition-all ${
                        theme === 'tron'
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
                            : theme === 'kids'
                                ? 'bg-purple-500 hover:bg-purple-400 text-white'
                                : 'bg-orange-600 hover:bg-orange-500 text-white'
                    }`}
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default DifficultyModal;
