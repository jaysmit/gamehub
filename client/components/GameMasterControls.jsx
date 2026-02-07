import React, { useState } from 'react';
import { socket } from '../socket';
import { CharacterSVG } from '../icons/CharacterSVGs';

/**
 * Reusable Game Master Controls component
 * Provides kick player and end game functionality for the room master
 * Can be used across all games (Trivia, Pictionary, etc.)
 */
const GameMasterControls = ({
    theme,
    currentTheme,
    currentRoom,
    isMaster,
    playerName,
    availableCharacters,
    onEndGame // Optional callback when game ends
}) => {
    const [showKickModal, setShowKickModal] = useState(false);
    const [showEndGameModal, setShowEndGameModal] = useState(false);
    const [selectedPlayerToKick, setSelectedPlayerToKick] = useState(null);

    if (!isMaster) return null;

    const otherPlayers = currentRoom?.players?.filter(p => p.name !== playerName) || [];

    const handleKickPlayer = () => {
        if (!selectedPlayerToKick || !currentRoom?.id) return;

        socket.emit('kickPlayer', {
            roomId: currentRoom.id,
            playerName: selectedPlayerToKick
        });
        setShowKickModal(false);
        setSelectedPlayerToKick(null);
    };

    const handleEndGame = () => {
        if (!currentRoom?.id) return;

        socket.emit('endGameEarly', { roomId: currentRoom.id });
        setShowEndGameModal(false);
        if (onEndGame) onEndGame();
    };

    // Kick Player Modal
    const renderKickModal = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-sm w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                <div className="text-center mb-4">
                    <div className="text-4xl mb-3">&#128683;</div>
                    <h2 className={`text-xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                        {theme === 'tron' ? '> KICK_PLAYER' : 'Kick Player'}
                    </h2>
                    <p className={`${currentTheme.textSecondary} text-sm mb-4`}>
                        Select a player to remove from the game:
                    </p>
                </div>

                {/* Player selection */}
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {otherPlayers.length > 0 ? (
                        otherPlayers.map((player) => {
                            const character = availableCharacters?.find(c => c.id === player.avatar) || availableCharacters?.[0];
                            const isSelected = selectedPlayerToKick === player.name;
                            return (
                                <button
                                    key={player.name}
                                    onClick={() => setSelectedPlayerToKick(player.name)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                        isSelected
                                            ? (theme === 'tron' ? 'bg-red-500/30 border-2 border-red-500' : theme === 'kids' ? 'bg-red-200 border-2 border-red-400' : 'bg-red-700/30 border-2 border-red-600')
                                            : (theme === 'tron' ? 'bg-gray-800/50 border border-gray-700 hover:border-gray-600' : theme === 'kids' ? 'bg-gray-100 border-2 border-gray-300 hover:border-gray-400' : 'bg-gray-800/50 border border-gray-700 hover:border-gray-600')
                                    }`}
                                >
                                    <div className="w-8 h-8">
                                        <CharacterSVG characterId={player.avatar} size={32} color={character?.color || '#666'} />
                                    </div>
                                    <span className={`font-semibold ${isSelected ? 'text-red-400' : currentTheme.text}`}>
                                        {player.name}
                                    </span>
                                    {player.connected === false && (
                                        <span className="text-gray-500 text-xs ml-auto">(disconnected)</span>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <p className={`text-center ${currentTheme.textSecondary} text-sm`}>
                            No other players in the game.
                        </p>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setShowKickModal(false);
                            setSelectedPlayerToKick(null);
                        }}
                        className={`flex-1 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-gray-800 hover:bg-gray-700 text-orange-400'} font-bold py-3 rounded-xl transition-all`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleKickPlayer}
                        disabled={!selectedPlayerToKick}
                        className={`flex-1 ${
                            selectedPlayerToKick
                                ? (theme === 'tron' ? 'bg-red-600 hover:bg-red-500 text-white' : theme === 'kids' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-red-700 hover:bg-red-600 text-white')
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        } font-bold py-3 rounded-xl transition-all`}
                    >
                        Kick
                    </button>
                </div>
            </div>
        </div>
    );

    // End Game Modal
    const renderEndGameModal = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-sm w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                <div className="text-center mb-4">
                    <div className="text-4xl mb-3">&#9888;&#65039;</div>
                    <h2 className={`text-xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                        {theme === 'tron' ? '> END_GAME' : 'End Game?'}
                    </h2>
                    <p className={`${currentTheme.textSecondary} text-sm`}>
                        All points earned in this game will be <strong className="text-red-400">lost and not recorded</strong>. All players will return to the game room.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowEndGameModal(false)}
                        className={`flex-1 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-gray-800 hover:bg-gray-700 text-orange-400'} font-bold py-3 rounded-xl transition-all`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEndGame}
                        className={`flex-1 ${theme === 'tron' ? 'bg-red-600 hover:bg-red-500 text-white' : theme === 'kids' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-red-700 hover:bg-red-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                    >
                        End Game
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Control Buttons */}
            <div className="flex flex-col gap-2">
                <button
                    onClick={() => setShowKickModal(true)}
                    className={`w-full ${theme === 'tron' ? 'bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 border border-yellow-500/30' : theme === 'kids' ? 'bg-yellow-400 hover:bg-yellow-500 text-white' : 'bg-yellow-700/30 hover:bg-yellow-700/50 text-yellow-400 border border-yellow-700/50'} px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="18" y1="8" x2="23" y2="13"></line>
                        <line x1="23" y1="8" x2="18" y2="13"></line>
                    </svg>
                    Kick Player
                </button>
                <button
                    onClick={() => setShowEndGameModal(true)}
                    className={`w-full ${theme === 'tron' ? 'bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30' : theme === 'kids' ? 'bg-red-400 hover:bg-red-500 text-white' : 'bg-red-700/30 hover:bg-red-700/50 text-red-400 border border-red-700/50'} px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                    </svg>
                    End Game
                </button>
            </div>

            {/* Modals */}
            {showKickModal && renderKickModal()}
            {showEndGameModal && renderEndGameModal()}
        </>
    );
};

export default GameMasterControls;
