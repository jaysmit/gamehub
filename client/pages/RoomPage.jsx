import React, { useState } from 'react';
import { Crown, Gamepad2, Play, Star, Check, Info, Youtube, MessageCircle, ChevronDown, X } from '../icons/UIIcons';
import CharacterSVG from '../icons/CharacterSVGs';
import CharacterAvatar from '../components/CharacterAvatar';
import { MOCK_GAMES } from '../data/games';
import { rarityConfig } from '../data/themes';
import { socket } from '../socket';
import { getDifficultyById } from '../data/difficulty';

function RoomPage({
    theme,
    currentTheme,
    currentRoom,
    isMaster,
    playerName,
    selectedAvatar,
    selectedGames,
    isGameSelected,
    availableCharacters,
    avatarPickerMode,
    setAvatarPickerMode,
    setSelectedAvatar,
    // Chat
    lobbyChatMessages,
    lobbyChatInput,
    setLobbyChatInput,
    sendLobbyChat,
    chatScrollRef,
    lobbyChatEndRef,
    modalChatScrollRef,
    modalChatEndRef,
    handleChatScroll,
    chatAutoScroll,
    setChatAutoScroll,
    scrollChatToBottom,
    unreadCount,
    setUnreadCount,
    showChatModal,
    setShowChatModal,
    isMobilePortrait,
    // QR
    qrSmallRef,
    qrRef,
    qrExpanded,
    setQrExpanded,
    // Game selector
    showGameSelector,
    setShowGameSelector,
    toggleGame,
    startGame,
    getGameIcon,
    // Game selector filters
    selectorMinPlayers,
    setSelectorMinPlayers,
    selectorMaxPlayers,
    setSelectorMaxPlayers,
    selectorMinAge,
    setSelectorMinAge,
    selectorMaxAge,
    setSelectorMaxAge,
    selectorSortBy,
    setSelectorSortBy,
    // Game info/desc modals
    selectedGameInfo,
    setSelectedGameInfo,
    selectedGameDesc,
    setSelectedGameDesc,
    // Avatar picker
    takenCharacters,
    avatarTimerCount,
    avatarTakenToast,
    setAvatarTakenToast,
    confirmAvatarSelection,
    // Character info modal
    characterInfoModal,
    setCharacterInfoModal,
    // Player profile modal
    setPlayerProfileModal,
    // Master tips
    showMasterTips,
    setShowMasterTips,
    // Other
    isMuted,
    handleLeaveRoom,
    // Completed games
    completedGames = [],
    setCompletedGames,
    // Accumulated scores across all games
    accumulatedScores = {},
    // Difficulty settings
    roomDifficulty = 'medium',
    playerDifficulties = {},
    showDifficultyModal,
    setShowDifficultyModal,
    handleSetRoomDifficulty,
    handleSetPlayerDifficulty,
    DIFFICULTY_LEVELS = [],
    getPlayerDifficulty
}) {
    // State for kick confirmation
    const [confirmKick, setConfirmKick] = useState(null); // { playerName: string }
    // State for leave room confirmation
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    // State for AFK info modal
    const [afkInfoPlayer, setAfkInfoPlayer] = useState(null); // { playerName: string }
    // State for completed game score breakdown modal
    const [selectedCompletedGame, setSelectedCompletedGame] = useState(null); // { gameId, finalScores, roundScores }

    
    
    // StarRating sub-component
    const StarRating = ({ rating }) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star key={i} className="star inline" filled={i <= Math.floor(rating)} />
            );
        }
        return <div className="flex items-center gap-1">{stars} <span className="text-xs ml-1">{rating}</span></div>;
    };

    const hasGamesPlayed = Object.values(accumulatedScores).some(score => score > 0);

    // Kick player from room
    const handleKickPlayer = (targetPlayerName) => {
        if (currentRoom?.id) {
            socket.emit('kickPlayer', { roomId: currentRoom.id, playerName: targetPlayerName });
        }
        setConfirmKick(null);
    };

    return (
            <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} p-2 pt-24 md:pt-40 landscape:pt-24`} style={{ minHeight: '100dvh' }}>
                <div className="max-w-6xl mx-auto" style={{ maxHeight: 'calc(100dvh - 6rem)', overflow: 'auto', paddingBottom: isMaster ? (isMobilePortrait ? '9.5rem' : '5rem') : '0' }}>
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl md:rounded-3xl p-3 md:p-4 landscape:p-3 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-2 md:border-4 border-purple-300' : 'border-2 md:border-4 border-orange-700'} mb-2`}>
                        {/* Room Info - Title/ID with QR right */}
                        <div className="flex items-stretch gap-2 md:gap-3 mb-2 md:mb-3">
                            {/* Left - Title + Room ID */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div id="room-title" className="mb-1 md:mb-2 text-center relative">
                                    {/* Leave Room button */}
                                    <button
                                        onClick={() => setShowLeaveConfirm(true)}
                                        className={`absolute top-0 left-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[0.6rem] md:text-xs font-semibold transition-all hover:scale-105 ${
                                            theme === 'tron' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' :
                                            theme === 'kids' ? 'bg-red-100 text-red-600 hover:bg-red-200 border border-red-300' :
                                            'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-700/50'
                                        }`}
                                        title="Leave Room"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        <span className="hidden md:inline">Leave</span>
                                    </button>
                                    {isMaster && <Crown className={`mx-auto mb-1 w-6 h-6 md:w-10 md:h-10 ${theme === 'tron' ? 'text-cyan-400' : theme === 'scary' ? 'text-orange-500' : 'text-yellow-400'}`} />}
                                    <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold ${currentTheme.text} ${currentTheme.font} ${theme === 'tron' ? 'tron-text-glow' : ''} break-words overflow-hidden`}>
                                        {currentRoom?.name}
                                    </h1>
                                </div>
                                <div id="room-id" className="flex flex-col mt-auto">
                                    <span className={`text-xs font-semibold ${currentTheme.textSecondary} mb-1`}>Room ID:</span>
                                    <div className={`font-mono text-lg md:text-xl lg:text-2xl font-bold tracking-wider whitespace-nowrap ${theme === 'tron' ? 'bg-cyan-500/20 tron-border text-cyan-400' : theme === 'scary' ? 'bg-orange-900/30 border-2 border-orange-700 text-orange-400' : 'bg-purple-200 text-purple-900 border-2 border-purple-400'} px-3 md:px-4 py-2 md:py-3 rounded-lg text-center inline-block`}>
                                        {currentRoom?.id}
                                    </div>
                                </div>
                            </div>
                            {/* Right - QR Code (shrink-wrapped, height fills parent) */}
                            <div
                                id="room-qr"
                                className={`shrink-0 ${theme === 'tron' ? 'bg-cyan-500/20 tron-border' : theme === 'scary' ? 'bg-orange-900/30 border-2 border-orange-700' : 'bg-white border-2 md:border-4 border-purple-400'} p-1 md:p-2 rounded-xl cursor-pointer hover:scale-105 transition-transform flex flex-col items-center`}
                                onClick={() => setQrExpanded(true)}
                            >
                                <div className="bg-white rounded p-0.5 flex items-center justify-center flex-1 min-h-0">
                                    <div ref={qrSmallRef} className="qr-small-container"></div>
                                </div>
                                <p className={`text-[0.5rem] md:text-[0.6rem] text-center mt-0.5 ${theme === 'tron' ? 'text-cyan-400' : theme === 'scary' ? 'text-orange-400' : 'text-purple-600'} font-semibold leading-none shrink-0`}>
                                    Tap to expand
                                </p>
                            </div>
                        </div>

                        {/* Expanded QR Code Modal */}
                        {qrExpanded && (
                            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setQrExpanded(false)}>
                                <div className={`${currentTheme.cardBg} rounded-3xl p-8 max-w-md w-full`} onClick={(e) => e.stopPropagation()}>
                                    <h3 className={`text-2xl font-bold ${currentTheme.text} mb-4 text-center ${currentTheme.font}`}>
                                        Scan to Join
                                    </h3>
                                    <div className={`${theme === 'tron' ? 'bg-cyan-400' : theme === 'scary' ? 'bg-orange-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} rounded-2xl p-8 mb-4`}>
                                        <div className="bg-white rounded-xl p-6 flex items-center justify-center">
                                            <div ref={qrRef}></div>
                                        </div>
                                    </div>
                                    <div className={`text-center mb-4 ${currentTheme.text}`}>
                                        <p className="text-sm mb-2">Room ID:</p>
                                        <p className="font-mono text-3xl font-bold tracking-wider">{currentRoom?.id}</p>
                                    </div>
                                    <button
                                        onClick={() => setQrExpanded(false)}
                                        className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'scary' ? 'bg-orange-700 hover:bg-orange-600 text-white' : 'bg-purple-500 hover:bg-purple-400 text-white'} font-bold py-3 rounded-xl transition-all`}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Character Avatars Row - scaled to 80% on md/landscape */}
                        <div id="room-players" className={`${theme === 'tron' ? 'bg-gray-900/50 border border-cyan-500/30' : theme === 'kids' ? 'bg-white/70 border-2 md:border-4 border-purple-300' : 'bg-gray-950/80 border-2 border-orange-700/50 shadow-[0_0_30px_rgba(194,65,12,0.3)]'} rounded-xl md:rounded-2xl p-3 md:p-4 mb-2 landscape:p-2 landscape:mb-1`}>
                            <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
                                <h3 className={`text-sm md:text-base lg:text-lg font-bold ${currentTheme.text} text-center ${currentTheme.font}`}>
                                    {theme === 'tron' ? 'CONNECTED_PLAYERS' : theme === 'kids' ? 'Players in the Room' : 'SUMMONED SOULS'} ({currentRoom?.players.length})
                                </h3>
                                {/* Difficulty Settings Button */}
                                {isMaster && (
                                    <button
                                        onClick={() => setShowDifficultyModal(true)}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[0.6rem] md:text-xs font-bold transition-all ${
                                            theme === 'tron'
                                                ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                                                : theme === 'kids'
                                                    ? 'bg-purple-200 hover:bg-purple-300 text-purple-700 border border-purple-400'
                                                    : 'bg-orange-900/30 hover:bg-orange-900/50 text-orange-400 border border-orange-700/50'
                                        }`}
                                        title="Set difficulty levels"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="3"></circle>
                                            <path d="M12 1v6m0 6v10"></path>
                                            <path d="m15.5 8.5 4.2-4.2M4.3 19.7l4.2-4.2"></path>
                                            <path d="M1 12h6m6 0h10"></path>
                                            <path d="m8.5 15.5-4.2 4.2M19.7 4.3l-4.2 4.2"></path>
                                        </svg>
                                        {theme === 'tron' ? 'DIFFICULTY' : 'Difficulty'}
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                                {[...(currentRoom?.players || [])].sort((a, b) => (accumulatedScores[b.name] || 0) - (accumulatedScores[a.name] || 0)).map((player, idx) => {
                                    const isMeta = player.avatar === 'meta';
                                    const character = isMeta
                                        ? { id: 'meta', name: 'Joining...', color: '#06b6d4' }
                                        : (availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0]);
                                    const isOwnAvatar = player.name === playerName;
                                    const canKick = isMaster && !isOwnAvatar && !isMeta;
                                    return (
                                        <div key={player.name} className="flex flex-col items-center gap-1">
                                        <div
                                            className={`player-avatar relative flex flex-col items-center transition-all ${!isMeta || isOwnAvatar ? 'cursor-pointer' : ''}`}
                                            onClick={() => {
                                                // Own meta avatar - open avatar picker
                                                if (isOwnAvatar && isMeta) {
                                                    setAvatarPickerMode('change');
                                                    return;
                                                }
                                                if (isMeta) return;
                                                // Always show player profile when clicking avatar
                                                setPlayerProfileModal({ ...player, character });
                                            }}
                                        >
                                            {/* Edit button for own avatar */}
                                            {isOwnAvatar && !isMeta && !avatarPickerMode && (
                                                <button
                                                    className={`absolute -top-2 -left-2 z-10 ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400' : 'bg-orange-600 hover:bg-orange-500'} rounded-full p-1.5 shadow-lg transition-all hover:scale-110 active:scale-95`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedAvatar(player.avatar);
                                                        setAvatarPickerMode('change');
                                                    }}
                                                    title="Change Avatar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme === 'tron' ? 'black' : 'white'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                    </svg>
                                                </button>
                                            )}

                                            {/* Kick button for master (top-left, red text only) */}
                                            {canKick && (
                                                <button
                                                    className="absolute -top-1 -left-1 z-10 text-red-500 hover:text-red-400 font-bold text-[0.6rem] transition-all hover:scale-110 active:scale-95"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setConfirmKick({ playerName: player.name });
                                                    }}
                                                    title="Kick player"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                            )}

                                            {/* Placement badge */}
                                            {hasGamesPlayed && idx < 3 && !isMeta && (
                                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-1.5 py-0.5 rounded-full font-black text-[0.6rem] shadow-lg ${
                                                    idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                                                    idx === 1 ? 'bg-gray-300 text-gray-700' :
                                                    'bg-amber-600 text-white'
                                                }`}>
                                                    #{idx + 1}
                                                </div>
                                            )}

                                            {/* AFK badge - centered over avatar with slight fade */}
                                            {player.isAfk && !isMeta && !isOwnAvatar && (
                                                <button
                                                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-2 py-1 rounded-full font-bold text-xs shadow-lg opacity-80 ${
                                                        theme === 'tron' ? 'bg-cyan-500/90 text-black border border-cyan-400' :
                                                        theme === 'kids' ? 'bg-yellow-400/90 text-yellow-900' :
                                                        'bg-orange-500/90 text-black border border-orange-400'
                                                    } hover:opacity-100 hover:scale-110 transition-all`}
                                                    style={theme === 'tron' ? { boxShadow: '0 0 10px rgba(6, 182, 212, 0.5)' } : undefined}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAfkInfoPlayer({ playerName: player.name });
                                                    }}
                                                    title="Player is AFK"
                                                >
                                                    AFK
                                                </button>
                                            )}

                                            {/* Character Card */}
                                            <div
                                                className={`w-28 h-32 md:w-28 md:h-32 lg:w-32 lg:h-36 landscape:w-24 landscape:h-28 rounded-2xl p-2 md:p-3 flex flex-col items-center justify-center overflow-visible transition-all ${
                                                    isMeta
                                                        ? `bg-green-500/10 border border-green-500/30 ${isOwnAvatar ? 'hover:bg-green-500/20 hover:border-green-400/50 hover:scale-105' : ''}`
                                                        : theme === 'tron'
                                                            ? 'bg-cyan-500/20'
                                                            : theme === 'kids'
                                                                ? 'bg-gradient-to-br from-purple-200 to-pink-200'
                                                                : 'bg-gradient-to-br from-gray-900 to-orange-950/50'
                                                } ${player.isAfk && !isOwnAvatar ? 'opacity-60' : ''}`}
                                                style={{
                                                    boxShadow: isMeta
                                                        ? '0 0 15px rgba(34,197,94,0.3)'
                                                        : theme === 'tron'
                                                            ? `0 0 15px ${character.color}40`
                                                            : theme === 'scary'
                                                                ? `0 0 15px ${character.color}30`
                                                                : undefined
                                                }}
                                            >
                                                {/* Character SVG */}
                                                <div className={`flex-1 flex items-center justify-center w-full min-h-0 overflow-visible ${player.isAfk && !isOwnAvatar ? 'grayscale' : ''}`}>
                                                    <CharacterAvatar characterId={character.id} size={80} rarity={character.rarity} showGlow={!player.isAfk || isOwnAvatar} />
                                                </div>
                                            </div>

                                            {/* "Selecting..." label for meta - between avatar and name */}
                                            {isMeta && (
                                                <div className="text-center mt-0.5">
                                                    <span className="text-[0.55rem] text-green-400 font-mono" style={{ animation: 'softPulse 2s ease-in-out infinite' }}>
                                                        {isOwnAvatar ? 'Tap to choose' : 'Selecting...'}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Player Name Below */}
                                            <div className={`mt-1 px-2 py-0.5 rounded-full font-semibold text-[0.65rem] md:text-xs flex items-center gap-0.5 ${
                                                isMeta
                                                    ? 'bg-gray-800 text-green-400'
                                                    : theme === 'tron'
                                                        ? 'bg-gray-800 text-cyan-400'
                                                        : theme === 'kids'
                                                            ? 'bg-white text-purple-700'
                                                            : 'bg-gray-900 text-orange-400'
                                            }`}>
                                                {player.isMaster && <Crown className="w-3 h-3 text-yellow-400 flex-shrink-0" fill="currentColor" />}
                                                {player.name}
                                            </div>
                                            {/* Score */}
                                            <div className={`mt-0.5 px-2 py-0.5 rounded-full font-semibold text-[0.55rem] md:text-[0.65rem] ${
                                                theme === 'tron'
                                                    ? 'bg-gray-800/60 text-cyan-300'
                                                    : theme === 'kids'
                                                        ? 'bg-white/80 text-purple-500'
                                                        : 'bg-gray-900/60 text-orange-300'
                                            }`}>
                                                pts: {accumulatedScores[player.name] || 0}
                                            </div>

                                            {/* Difficulty Label */}
                                            {!isMeta && (() => {
                                                const playerDiff = getPlayerDifficulty ? getPlayerDifficulty(player.name, playerDifficulties, roomDifficulty) : roomDifficulty;
                                                const diffInfo = getDifficultyById(playerDiff);
                                                const isOverride = playerDifficulties[player.name] && playerDifficulties[player.name] !== roomDifficulty;
                                                // Use consistent theme-based colors for all difficulty labels
                                                const labelColors = theme === 'tron'
                                                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                                    : theme === 'kids'
                                                    ? 'bg-purple-100 text-purple-600 border-purple-300'
                                                    : 'bg-orange-900/30 text-orange-400 border-orange-700/50';
                                                return (
                                                    <button
                                                        className={`mt-0.5 px-2 py-0.5 rounded-full font-semibold text-[0.5rem] md:text-[0.55rem] flex items-center gap-1 transition-all ${labelColors} border ${isMaster ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (isMaster) {
                                                                setShowDifficultyModal(true);
                                                            } else {
                                                                // Show toast for non-masters
                                                                setAvatarTakenToast('Ask the Game Master to change difficulty');
                                                                setTimeout(() => setAvatarTakenToast(''), 3000);
                                                            }
                                                        }}
                                                        title={isMaster ? 'Click to change difficulty' : 'Ask Game Master to change'}
                                                    >
                                                        {diffInfo?.shortLabel || 'Medium'}
                                                        {isOverride && <span className="text-[0.45rem] opacity-70">*</span>}
                                                    </button>
                                                );
                                            })()}
                                        </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Kick Confirmation Modal */}
                        {confirmKick && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-sm w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                                    <div className="text-center mb-4">
                                        <div className="text-4xl mb-3">🚪</div>
                                        <h2 className={`text-xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                                            {theme === 'tron' ? '> KICK_PLAYER' : 'Kick Player?'}
                                        </h2>
                                        <p className={`${currentTheme.textSecondary} text-sm`}>
                                            Are you sure you want to <strong className="text-red-400">kick {confirmKick.playerName}</strong> from the room?
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setConfirmKick(null)}
                                            className={`flex-1 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-gray-800 hover:bg-gray-700 text-orange-400'} font-bold py-3 rounded-xl transition-all`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleKickPlayer(confirmKick.playerName)}
                                            className={`flex-1 ${theme === 'tron' ? 'bg-red-600 hover:bg-red-500 text-white' : theme === 'kids' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-red-700 hover:bg-red-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                                        >
                                            Kick
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leave Room Confirmation Modal */}
                        {showLeaveConfirm && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-sm w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                                    <div className="text-center mb-4">
                                        <div className="text-4xl mb-3">👋</div>
                                        <h2 className={`text-xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                                            {theme === 'tron' ? '> LEAVE_ROOM' : 'Leave Room?'}
                                        </h2>
                                        <p className={`${currentTheme.textSecondary} text-sm`}>
                                            {isMaster
                                                ? 'As the room master, leaving will close the room for everyone.'
                                                : 'Are you sure you want to leave this room?'
                                            }
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowLeaveConfirm(false)}
                                            className={`flex-1 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-gray-800 hover:bg-gray-700 text-orange-400'} font-bold py-3 rounded-xl transition-all`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowLeaveConfirm(false);
                                                handleLeaveRoom();
                                            }}
                                            className={`flex-1 ${theme === 'tron' ? 'bg-red-600 hover:bg-red-500 text-white' : theme === 'kids' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-red-700 hover:bg-red-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                                        >
                                            Leave
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AFK Info Modal */}
                        {afkInfoPlayer && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setAfkInfoPlayer(null)}>
                                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-sm w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`} onClick={(e) => e.stopPropagation()}>
                                    <div className="text-center mb-4">
                                        <div className={`text-4xl mb-3 ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-500' : 'text-yellow-500'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                        </div>
                                        <h2 className={`text-xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                                            {theme === 'tron' ? '> PLAYER_AFK' : 'Player Away'}
                                        </h2>
                                        <p className={`${currentTheme.textSecondary} text-sm mb-2`}>
                                            <strong className={theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}>{afkInfoPlayer.playerName}</strong> is currently not in the game room.
                                        </p>
                                        <p className={`${currentTheme.textSecondary} text-xs`}>
                                            They may be on another page or their device is inactive. They could be trying to reconnect.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setAfkInfoPlayer(null)}
                                        className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                                    >
                                        {theme === 'tron' ? '[ OK ]' : 'Got it'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Games + Chat Side-by-Side on md/landscape */}
                        <div className="flex flex-col md:flex-row landscape:flex-row gap-2">
                            {/* Selected Games Section */}
                            <div id="room-selected-games" className={`md:w-1/2 landscape:w-1/2 flex flex-col ${theme === 'tron' ? 'bg-gray-900/50 border border-cyan-500/30' : theme === 'kids' ? 'bg-white/70 border-2 md:border-4 border-purple-300' : 'bg-gray-950/80 border-2 border-orange-700/50'} rounded-xl md:rounded-2xl p-2 md:p-3`}>
                                <h3 className={`text-sm md:text-base lg:text-lg font-bold ${currentTheme.text} mb-2 md:mb-3 flex items-center gap-2 ${currentTheme.font}`}>
                                    <Gamepad2 className="w-5 h-5 md:w-6 md:h-6" />
                                    <span className="truncate">{theme === 'tron' ? 'GAME_QUEUE' : theme === 'kids' ? 'Game Queue' : 'GAME QUEUE'}</span>
                                    <span className="whitespace-nowrap">({completedGames.length + selectedGames.length})</span>
                                </h3>
                                <div className={`flex-1 overflow-y-auto md:max-h-72 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                                    <div className="grid grid-cols-1 gap-3">
                                        {/* Show completed games first */}
                                        {completedGames.map((completed, idx) => {
                                            const game = MOCK_GAMES.find(g => g.id === completed.gameId);
                                            return (
                                                <div
                                                    key={`completed-${idx}`}
                                                    onClick={() => setSelectedCompletedGame(completed)}
                                                    className={`${theme === 'tron' ? 'border border-gray-600/50 bg-gray-800/30' : theme === 'kids' ? 'border-2 border-gray-300 bg-gray-100/50' : 'border border-gray-700/50 bg-gray-900/30'} rounded-lg p-4 opacity-60 cursor-pointer hover:opacity-80 transition-all`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-gray-500">
                                                            {getGameIcon(game?.id, 'w-8 h-8')}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-gray-500 font-bold text-sm mb-1">{game?.name}</div>
                                                            <div className={`text-xs font-bold ${theme === 'tron' ? 'text-green-500' : theme === 'kids' ? 'text-green-600' : 'text-green-500'} flex items-center gap-1`}>
                                                                <Check className="w-3 h-3" /> Complete
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Show upcoming games */}
                                        {selectedGames.length === 0 && completedGames.length === 0 ? (
                                            <p className={`${currentTheme.textSecondary} text-sm col-span-full text-center py-4`}>
                                                {theme === 'tron' ? '> No games selected' : theme === 'kids' ? 'No games selected yet' : '> The chamber awaits...'}
                                            </p>
                                        ) : (
                                            selectedGames.map((gameEntry, idx) => {
                                                const gameId = gameEntry.gameId;
                                                const game = MOCK_GAMES.find(g => g.id === gameId);
                                                const isUpNext = idx === 0;
                                                return (
                                                    <div
                                                        key={gameId}
                                                        className={`${isUpNext
                                                            ? (theme === 'tron' ? 'border-2 border-cyan-400 bg-cyan-500/10 ring-2 ring-cyan-400/50' : theme === 'kids' ? 'border-2 border-purple-500 bg-purple-100 ring-2 ring-purple-400/50' : 'border-2 border-orange-500 bg-orange-900/20 ring-2 ring-orange-500/50')
                                                            : (theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50')
                                                        } rounded-lg p-4 transition-all`}
                                                    >
                                                        {isUpNext && (
                                                            <div className={`text-xs font-bold mb-2 ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>
                                                                {theme === 'tron' ? '> UP_NEXT!' : 'Up Next!'} {!isMaster && 'Waiting for Game Master to start...'}
                                                            </div>
                                                        )}
                                                        <div className="flex items-start gap-3">
                                                            <div className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-500'}`}>
                                                                {getGameIcon(game?.id, 'w-8 h-8')}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className={`${currentTheme.text} font-bold text-sm mb-1`}>{game?.name}</div>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <div className="flex items-center gap-1">
                                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                                            <Star key={i} className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-yellow-400' : 'text-orange-500'} w-3 h-3`} filled={i <= Math.floor(game?.rating || 0)} />
                                                                        ))}
                                                                        <span className={`text-xs ${currentTheme.textSecondary} ml-1`}>{game?.rating}</span>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => setSelectedGameDesc(game)}
                                                                        className={`text-xs ${currentTheme.text} underline hover:no-underline transition-all`}
                                                                    >
                                                                        description
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Lobby Chat Panel - hidden on mobile portrait, visible on md+ and landscape */}
                            <div id="room-chat" className={`hidden md:flex landscape:flex md:w-1/2 landscape:w-1/2 flex-col ${theme === 'tron' ? 'bg-gray-900/50 border border-cyan-500/30' : theme === 'kids' ? 'bg-white/70 border-2 md:border-4 border-purple-300' : 'bg-gray-950/80 border-2 border-orange-700/50'} rounded-xl md:rounded-2xl p-2 md:p-3`}>
                                <h3 className={`text-sm md:text-base font-bold ${currentTheme.text} mb-1 flex items-center gap-2 ${currentTheme.font}`}>
                                    {theme === 'tron' ? '> ROOM_CHAT' : theme === 'kids' ? 'Room Chat' : 'WHISPERS'}
                                </h3>
                                <div className="relative flex-1">
                                    <div
                                        ref={chatScrollRef}
                                        onScroll={handleChatScroll}
                                        className={`h-40 md:h-56 landscape:h-40 overflow-y-auto mb-1 space-y-1 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}
                                    >
                                        {lobbyChatMessages.length === 0 ? (
                                            <p className={`${currentTheme.textSecondary} text-sm text-center py-4`}>
                                                {theme === 'tron' ? '> No messages yet...' : theme === 'kids' ? 'No messages yet!' : '> Silence...'}
                                            </p>
                                        ) : (
                                            lobbyChatMessages.map((msg, idx) => {
                                                const character = availableCharacters.find(c => c.id === msg.avatar) || availableCharacters[0];
                                                return (
                                                    <div key={idx} className={`${theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/30' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-orange-900/20 border border-orange-700/50'} rounded-lg p-2`}>
                                                        <div className="flex items-start gap-2">
                                                            <div className="w-7 h-7 flex-shrink-0">
                                                                <CharacterAvatar characterId={msg.avatar} size={28} rarity={character.rarity} showGlow={false} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <span className={`font-bold text-xs ${currentTheme.text}`}>{msg.player}</span>
                                                                <span className={`${currentTheme.textSecondary} text-xs ml-2`}>{msg.message}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={lobbyChatEndRef} />
                                    </div>
                                    {/* Scroll to bottom button */}
                                    {!chatAutoScroll && lobbyChatMessages.length > 0 && (
                                        <button
                                            onClick={scrollChatToBottom}
                                            className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${theme === 'tron' ? 'bg-cyan-500 text-black' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-700 text-white'}`}
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={lobbyChatInput}
                                        onChange={(e) => setLobbyChatInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendLobbyChat()}
                                        placeholder={theme === 'tron' ? '> Type message...' : 'Type a message...'}
                                        maxLength={200}
                                        className={`flex-1 ${theme === 'tron' ? 'bg-gray-900 text-cyan-400 border border-cyan-500/30' : theme === 'kids' ? 'bg-white text-purple-900 border-2 border-purple-300' : 'bg-gray-900 text-orange-400 border border-orange-700/50'} px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400' : theme === 'kids' ? 'focus:ring-purple-500' : 'focus:ring-orange-600'}`}
                                    />
                                    <button
                                        onClick={sendLobbyChat}
                                        className={`${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} px-4 py-2 rounded-lg font-bold text-sm transition-all`}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Fixed Bottom Action Bar */}
                {isMaster && (
                    <div className={`fixed bottom-0 left-0 right-0 z-40 p-3 ${theme === 'tron' ? 'bg-gray-900/95 border-t border-cyan-500/30' : theme === 'kids' ? 'bg-white/95 border-t-2 border-purple-300' : 'bg-gray-950/95 border-t-2 border-orange-700/50'} backdrop-blur-sm`}>
                        <div className="max-w-6xl mx-auto flex flex-col md:flex-row landscape:flex-row gap-2 items-stretch">
                            <button
                                onClick={() => setShowGameSelector(true)}
                                className={`flex-1 ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black tron-glow' : theme === 'kids' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white kids-shadow' : 'bg-orange-700 hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(194,65,12,0.5)]'} font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg ${currentTheme.font}`}
                            >
                                <span className="flex items-center justify-center gap-2 text-base">
                                    <Gamepad2 className="w-5 h-5" />
                                    {theme === 'tron' ? '[ ADD_GAMES ]' : theme === 'kids' ? 'Add Games 🎮' : 'ADD NIGHTMARES 🦇'}
                                </span>
                            </button>
                            <button
                                onClick={startGame}
                                disabled={selectedGames.length === 0}
                                className={`flex-1 ${selectedGames.length === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02]'} ${theme === 'tron' ? 'bg-green-500 hover:bg-green-400 text-black tron-glow' : theme === 'kids' ? 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-300 hover:to-blue-300 text-white kids-shadow' : 'bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white shadow-[0_0_20px_rgba(22,163,74,0.4)]'} font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg ${selectedGames.length > 0 ? 'animate-pulse' : ''} ${currentTheme.font}`}
                            >
                                <span className="flex items-center justify-center gap-2 text-base">
                                    <Play className="w-5 h-5" />
                                    {completedGames.length > 0
                                        ? (theme === 'tron' ? '[ START_NEXT ]' : theme === 'kids' ? 'Start Next Game! 🚀' : 'START NEXT GAME 💀')
                                        : (theme === 'tron' ? '[ START_GAME ]' : theme === 'kids' ? 'Start Game! 🚀' : 'START GAME 💀')
                                    }
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Floating Chat Icon - Fixed to Room page bottom-right */}
                <button
                    onClick={() => {
                        if (isMobilePortrait) {
                            setShowChatModal(true);
                            setUnreadCount(0);
                        } else {
                            const chatEl = document.getElementById('room-chat');
                            if (chatEl) chatEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            setUnreadCount(0);
                        }
                    }}
                    className={`fixed z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${theme === 'tron' ? 'bg-cyan-500 text-black' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-700 text-white'}`}
                    style={{ bottom: isMaster ? (isMobilePortrait ? '9.5rem' : '5rem') : '1rem', right: '1rem' }}
                >
                    <MessageCircle className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Mobile Portrait Chat Modal */}
                {showChatModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col">
                        <div className={`flex-1 flex flex-col mx-3 mt-3 rounded-2xl overflow-hidden ${theme === 'tron' ? 'bg-gray-900 border border-cyan-500/30' : theme === 'kids' ? 'bg-white border-2 border-purple-300' : 'bg-gray-950 border-2 border-orange-700/50'}`} style={{ marginBottom: isMaster ? '9.5rem' : '0.75rem' }}>
                            {/* Modal Header */}
                            <div className={`flex items-center justify-between p-3 border-b ${theme === 'tron' ? 'border-cyan-500/30' : theme === 'kids' ? 'border-purple-300' : 'border-orange-700/50'}`}>
                                <h3 className={`text-base font-bold ${currentTheme.text} ${currentTheme.font}`}>
                                    {theme === 'tron' ? '> ROOM_CHAT' : theme === 'kids' ? 'Room Chat' : 'WHISPERS'}
                                </h3>
                                <button onClick={() => setShowChatModal(false)} className={`p-1 rounded-lg ${theme === 'tron' ? 'hover:bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'hover:bg-purple-100 text-purple-500' : 'hover:bg-orange-900/40 text-orange-400'}`}>
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            {/* Modal Messages */}
                            <div
                                ref={modalChatScrollRef}
                                onScroll={() => {
                                    const el = modalChatScrollRef.current;
                                    if (!el) return;
                                    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
                                    setChatAutoScroll(atBottom);
                                    if (atBottom) setUnreadCount(0);
                                }}
                                className={`flex-1 overflow-y-auto p-3 space-y-1 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}
                            >
                                {lobbyChatMessages.length === 0 ? (
                                    <p className={`${currentTheme.textSecondary} text-sm text-center py-4`}>
                                        {theme === 'tron' ? '> No messages yet...' : theme === 'kids' ? 'No messages yet!' : '> Silence...'}
                                    </p>
                                ) : (
                                    lobbyChatMessages.map((msg, idx) => {
                                        const character = availableCharacters.find(c => c.id === msg.avatar) || availableCharacters[0];
                                        return (
                                            <div key={idx} className={`${theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/30' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-orange-900/20 border border-orange-700/50'} rounded-lg p-2`}>
                                                <div className="flex items-start gap-2">
                                                    <div className="w-7 h-7 flex-shrink-0">
                                                        <CharacterAvatar characterId={msg.avatar} size={28} rarity={character.rarity} showGlow={false} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`font-bold text-xs ${currentTheme.text}`}>{msg.player}</span>
                                                        <span className={`${currentTheme.textSecondary} text-xs ml-2`}>{msg.message}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={modalChatEndRef} />
                            </div>
                            {/* Scroll to bottom button in modal */}
                            {!chatAutoScroll && lobbyChatMessages.length > 0 && (
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            const el = modalChatScrollRef.current;
                                            if (el) { el.scrollTop = el.scrollHeight; setChatAutoScroll(true); }
                                        }}
                                        className={`absolute -top-10 left-1/2 -translate-x-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${theme === 'tron' ? 'bg-cyan-500 text-black' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-700 text-white'}`}
                                    >
                                        <ChevronDown className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                            {/* Modal Input */}
                            <div className={`p-3 border-t ${theme === 'tron' ? 'border-cyan-500/30' : theme === 'kids' ? 'border-purple-300' : 'border-orange-700/50'}`}>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={lobbyChatInput}
                                        onChange={(e) => setLobbyChatInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendLobbyChat()}
                                        placeholder={theme === 'tron' ? '> Type message...' : 'Type a message...'}
                                        maxLength={200}
                                        className={`flex-1 ${theme === 'tron' ? 'bg-gray-900 text-cyan-400 border border-cyan-500/30' : theme === 'kids' ? 'bg-white text-purple-900 border-2 border-purple-300' : 'bg-gray-900 text-orange-400 border border-orange-700/50'} px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400' : theme === 'kids' ? 'focus:ring-purple-500' : 'focus:ring-orange-600'}`}
                                    />
                                    <button
                                        onClick={sendLobbyChat}
                                        className={`${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} px-4 py-2 rounded-lg font-bold text-sm transition-all`}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Game Selector Modal */}
                {showGameSelector && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col z-50">
                        <div className={`flex-1 flex flex-col m-2 md:m-4 rounded-2xl md:rounded-3xl overflow-hidden ${currentTheme.cardBg} ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                            {/* Header */}
                            <div className="p-3 md:p-6 pb-0 md:pb-0">
                                <h2 className={`text-lg md:text-3xl font-bold ${currentTheme.text} mb-3 md:mb-6 text-center ${currentTheme.font} ${theme === 'tron' ? 'tron-text-glow' : ''}`}>
                                    {theme === 'tron' ? '[ SELECT_GAMES ]' : theme === 'kids' ? 'Select Your Games 🎯' : 'CHOOSE YOUR NIGHTMARES 💀'}
                                </h2>

                                {/* Filters */}
                                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-4">
                                    {/* Players min-max slider */}
                                    <div>
                                        <label className={`block ${currentTheme.textSecondary} text-[0.6rem] md:text-sm font-semibold mb-1`}>
                                            Players: {selectorMinPlayers === 1 && selectorMaxPlayers === 16 ? 'All' : `${selectorMinPlayers}-${selectorMaxPlayers}`}
                                        </label>
                                        <div className="dual-range-wrapper relative h-2 mt-2 mb-3">
                                            <div className={`absolute inset-0 rounded-lg ${theme === 'tron' ? 'bg-gray-800' : theme === 'scary' ? 'bg-stone-900' : 'bg-purple-100'}`}></div>
                                            <div className="absolute top-0 h-full rounded-lg" style={{
                                                left: `${((selectorMinPlayers - 1) / 15) * 100}%`,
                                                right: `${100 - ((selectorMaxPlayers - 1) / 15) * 100}%`,
                                                background: theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7'
                                            }}></div>
                                            <input
                                                type="range" min="1" max="16"
                                                value={selectorMinPlayers}
                                                onChange={(e) => {
                                                    const v = parseInt(e.target.value);
                                                    setSelectorMinPlayers(Math.min(v, selectorMaxPlayers));
                                                }}
                                                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                                                style={{ '--tw-thumb-bg': theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7' }}
                                            />
                                            <input
                                                type="range" min="1" max="16"
                                                value={selectorMaxPlayers}
                                                onChange={(e) => {
                                                    const v = parseInt(e.target.value);
                                                    setSelectorMaxPlayers(Math.max(v, selectorMinPlayers));
                                                }}
                                                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                                                style={{ '--tw-thumb-bg': theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7' }}
                                            />
                                        </div>
                                    </div>
                                    {/* Age min-max slider */}
                                    <div>
                                        <label className={`block ${currentTheme.textSecondary} text-[0.6rem] md:text-sm font-semibold mb-1`}>
                                            Age: {selectorMinAge === 5 && selectorMaxAge === 18 ? 'All Ages' : `${selectorMinAge}-${selectorMaxAge}`}
                                        </label>
                                        <div className="dual-range-wrapper relative h-2 mt-2 mb-3">
                                            <div className={`absolute inset-0 rounded-lg ${theme === 'tron' ? 'bg-gray-800' : theme === 'scary' ? 'bg-stone-900' : 'bg-purple-100'}`}></div>
                                            <div className="absolute top-0 h-full rounded-lg" style={{
                                                left: `${((selectorMinAge - 5) / 13) * 100}%`,
                                                right: `${100 - ((selectorMaxAge - 5) / 13) * 100}%`,
                                                background: theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7'
                                            }}></div>
                                            <input
                                                type="range" min="5" max="18"
                                                value={selectorMinAge}
                                                onChange={(e) => {
                                                    const v = parseInt(e.target.value);
                                                    setSelectorMinAge(Math.min(v, selectorMaxAge));
                                                }}
                                                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                                                style={{ '--tw-thumb-bg': theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7' }}
                                            />
                                            <input
                                                type="range" min="5" max="18"
                                                value={selectorMaxAge}
                                                onChange={(e) => {
                                                    const v = parseInt(e.target.value);
                                                    setSelectorMaxAge(Math.max(v, selectorMinAge));
                                                }}
                                                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                                                style={{ '--tw-thumb-bg': theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7' }}
                                            />
                                        </div>
                                    </div>
                                    {/* Sort */}
                                    <div>
                                        <label className={`block ${currentTheme.textSecondary} text-[0.6rem] md:text-sm font-semibold mb-1`}>
                                            Sort By
                                        </label>
                                        <select
                                            value={selectorSortBy}
                                            onChange={(e) => setSelectorSortBy(e.target.value)}
                                            className={`w-full px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm ${theme === 'tron' ? 'bg-black text-cyan-400 border border-cyan-500' : theme === 'scary' ? 'bg-gray-900 text-orange-400 border border-orange-700' : 'bg-white text-purple-900 border-2 border-purple-300'} focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400' : theme === 'scary' ? 'focus:ring-orange-600' : 'focus:ring-purple-500'}`}
                                        >
                                            <option value="popular">Most Popular</option>
                                            <option value="newest">Newest</option>
                                            <option value="rating">Highest Rated</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Game Grid */}
                            <div className={`flex-1 overflow-y-auto px-3 md:px-6 pb-3 md:pb-4 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                                    {MOCK_GAMES
                                        .filter(game => {
                                            const playerParts = game.players.split('-');
                                            const gameMinPlayers = parseInt(playerParts[0]);
                                            const gameMaxPlayers = parseInt(playerParts[1] || playerParts[0]);
                                            const playersMatch = gameMinPlayers <= selectorMaxPlayers && gameMaxPlayers >= selectorMinPlayers;
                                            const ageMatch = game.ageMin >= selectorMinAge && game.ageMin <= selectorMaxAge;
                                            return playersMatch && ageMatch;
                                        })
                                        .sort((a, b) => {
                                            if (selectorSortBy === 'rating') return b.rating - a.rating;
                                            if (selectorSortBy === 'newest') return b.id - a.id;
                                            return 0;
                                        })
                                        .map((game) => (
                                        <div
                                            key={game.id}
                                            className={`relative rounded-lg md:rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'} ${isGameSelected(game.id) ? (theme === 'tron' ? 'ring-2 ring-cyan-400' : theme === 'scary' ? 'ring-2 ring-orange-500' : 'ring-2 ring-purple-500') : ''}`}
                                        >
                                            <button
                                                onClick={() => toggleGame(game.id)}
                                                className="w-full aspect-[4/3] transition-all relative"
                                                style={{ backgroundColor: theme === 'tron' ? 'transparent' : game.color }}
                                            >
                                                {theme === 'scary' && <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-transparent"></div>}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                                    <div className={`mb-1 ${theme === 'tron' ? 'text-cyan-400' : theme === 'scary' ? 'text-orange-500' : 'text-white'}`}>
                                                        {getGameIcon(game.id, 'w-6 h-6 md:w-8 md:h-8')}
                                                    </div>
                                                    <span className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'scary' ? 'text-orange-400' : 'text-white'} font-bold text-[0.6rem] md:text-xs text-center leading-tight line-clamp-2`}>
                                                        {game.name}
                                                    </span>
                                                    <div className="flex items-center gap-0.5 mt-1">
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <Star key={i} className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'scary' ? 'text-orange-500' : 'text-yellow-400'} w-2 h-2 md:w-2.5 md:h-2.5`} filled={i <= Math.floor(game.rating)} />
                                                        ))}
                                                    </div>
                                                    <span className={`text-[0.5rem] md:text-[0.6rem] mt-0.5 ${theme === 'tron' ? 'text-cyan-500' : theme === 'scary' ? 'text-orange-500' : 'text-white/80'}`}>{game.players}</span>
                                                </div>
                                                {isGameSelected(game.id) && (
                                                    <div className="absolute top-1 right-1 w-6 h-6 md:w-7 md:h-7 bg-green-500 rounded-full flex items-center justify-center">
                                                        <Check className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={3} />
                                                    </div>
                                                )}
                                                {completedGames.some(cg => cg.gameId === game.id) && !isGameSelected(game.id) && (
                                                    <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[0.5rem] font-bold ${theme === 'tron' ? 'bg-green-500/80 text-black' : theme === 'kids' ? 'bg-green-500 text-white' : 'bg-green-600/80 text-white'}`}>
                                                        Played
                                                    </div>
                                                )}
                                            </button>
                                            <div className={`p-1 md:p-1.5 ${theme === 'tron' ? 'bg-cyan-900/20 border-t border-cyan-500/30' : theme === 'scary' ? 'bg-orange-900/20 border-t border-orange-700/30' : 'bg-white/90 border-t border-purple-200'}`}>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => setSelectedGameDesc(game)}
                                                        className={`flex-1 ${theme === 'tron' ? 'bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-400' : theme === 'scary' ? 'bg-orange-700/40 hover:bg-orange-700/60 text-orange-400' : 'bg-purple-500 hover:bg-purple-400 text-white'} text-[0.5rem] md:text-xs py-1 px-1 rounded transition-all flex items-center justify-center gap-0.5`}
                                                    >
                                                        <Info className="w-2 h-2 md:w-3 md:h-3" />
                                                        <span className="hidden sm:inline">Desc</span>
                                                    </button>
                                                    <a
                                                        href={game.youtubeLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex-1 ${theme === 'tron' ? 'bg-red-500/30 hover:bg-red-500/50 text-red-400' : theme === 'scary' ? 'bg-red-700/40 hover:bg-red-700/60 text-red-400' : 'bg-red-500 hover:bg-red-400 text-white'} text-[0.5rem] md:text-xs py-1 px-1 rounded transition-all flex items-center justify-center gap-0.5`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Youtube className="w-2 h-2 md:w-3 md:h-3" />
                                                        <span className="hidden sm:inline">Video</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fixed Close Button at bottom */}
                            <div className={`p-3 md:p-4 border-t ${theme === 'tron' ? 'border-cyan-500/30 bg-gray-900/95' : theme === 'kids' ? 'border-purple-300 bg-white/95' : 'border-orange-700/50 bg-gray-950/95'} backdrop-blur-sm`}>
                                <button
                                    onClick={() => setShowGameSelector(false)}
                                    className={`w-full ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400 tron-border' : theme === 'scary' ? 'bg-orange-700 hover:bg-orange-600 text-white' : 'bg-purple-500 hover:bg-purple-400 text-white kids-shadow'} font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-lg`}
                                >
                                    <X className="w-5 h-5 md:w-6 md:h-6" />
                                    {theme === 'tron' ? '[ CLOSE ]' : theme === 'scary' ? 'SEAL THE CRYPT' : 'Close'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Game Info Modal */}
                {selectedGameInfo && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedGameInfo(null)}>
                        <div className={`${currentTheme.cardBg} rounded-3xl p-8 max-w-lg w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`} onClick={(e) => e.stopPropagation()}>
                            <h3 className={`text-3xl font-bold ${currentTheme.text} mb-4 ${currentTheme.font}`}>
                                {selectedGameInfo.name}
                            </h3>
                            <div className="mb-4">
                                <StarRating rating={selectedGameInfo.rating} />
                            </div>
                            <p className={`${currentTheme.textSecondary} mb-6 text-lg`}>
                                {selectedGameInfo.description}
                            </p>
                            <button
                                onClick={() => setSelectedGameInfo(null)}
                                className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Selected Game Description Modal */}
                {selectedGameDesc && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedGameDesc(null)}>
                        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`} onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-500'}`}>
                                    {getGameIcon(selectedGameDesc.id, 'w-16 h-16')}
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-bold ${currentTheme.text} ${currentTheme.font}`}>
                                        {selectedGameDesc.name}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-yellow-400' : 'text-orange-500'} w-4 h-4`} filled={i <= Math.floor(selectedGameDesc.rating)} />
                                        ))}
                                        <span className={`text-sm ${currentTheme.textSecondary} ml-1`}>{selectedGameDesc.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <p className={`${currentTheme.textSecondary} mb-4 text-base`}>
                                {selectedGameDesc.description}
                            </p>
                            <div className={`${currentTheme.textSecondary} text-sm mb-6`}>
                                <div><strong>Players:</strong> {selectedGameDesc.players}</div>
                                <div><strong>Age:</strong> {selectedGameDesc.ageMin}+</div>
                            </div>
                            <button
                                onClick={() => setSelectedGameDesc(null)}
                                className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Completed Game Score Breakdown Modal */}
                {selectedCompletedGame && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedCompletedGame(null)}>
                        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`} onClick={(e) => e.stopPropagation()}>
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-500'}`}>
                                    {getGameIcon(selectedCompletedGame.gameId, 'w-12 h-12')}
                                </div>
                                <div>
                                    <h3 className={`text-xl md:text-2xl font-bold ${currentTheme.text} ${currentTheme.font}`}>
                                        {MOCK_GAMES.find(g => g.id === selectedCompletedGame.gameId)?.name || 'Game'} - Results
                                    </h3>
                                    <div className={`text-xs ${theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-green-600' : 'text-green-500'} flex items-center gap-1`}>
                                        <Check className="w-3 h-3" /> Completed
                                    </div>
                                </div>
                            </div>

                            {/* Score Table */}
                            <div className={`flex-1 overflow-y-auto ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                                <table className="w-full">
                                    <thead>
                                        <tr className={`border-b ${theme === 'tron' ? 'border-cyan-500/30' : theme === 'kids' ? 'border-purple-300' : 'border-orange-700/50'}`}>
                                            <th className={`text-left py-2 px-2 ${currentTheme.text} text-sm font-bold`}>Player</th>
                                            <th className={`text-center py-2 px-1 ${currentTheme.textSecondary} text-xs font-semibold`}>R1</th>
                                            <th className={`text-center py-2 px-1 ${currentTheme.textSecondary} text-xs font-semibold`}>R2</th>
                                            <th className={`text-center py-2 px-1 ${currentTheme.textSecondary} text-xs font-semibold`}>R3</th>
                                            <th className={`text-center py-2 px-1 ${currentTheme.textSecondary} text-xs font-semibold`}>Speed</th>
                                            <th className={`text-right py-2 px-2 ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'} text-sm font-bold`}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            // Build player data from finalScores and roundScores
                                            const playerData = [];
                                            const finalScores = selectedCompletedGame.finalScores || [];
                                            const roundScores = selectedCompletedGame.roundScores || {};

                                            // Get all player names from finalScores
                                            finalScores.forEach(fs => {
                                                const playerRoundScores = roundScores[fs.name] || [];
                                                const r1 = playerRoundScores.filter(rs => rs.round === 1).reduce((sum, rs) => sum + rs.points, 0);
                                                const r2 = playerRoundScores.filter(rs => rs.round === 2).reduce((sum, rs) => sum + rs.points, 0);
                                                const r3 = playerRoundScores.filter(rs => rs.round === 3).reduce((sum, rs) => sum + rs.points, 0);
                                                const speed = playerRoundScores.filter(rs => rs.round === 4).reduce((sum, rs) => sum + rs.points, 0);
                                                const roundTotal = r1 + r2 + r3 + speed;
                                                const total = roundTotal > 0 ? roundTotal : (fs.score || 0);

                                                playerData.push({
                                                    name: fs.name,
                                                    avatar: fs.avatar,
                                                    r1, r2, r3, speed, total
                                                });
                                            });

                                            // Sort by total score descending
                                            playerData.sort((a, b) => b.total - a.total);

                                            return playerData.map((player, idx) => {
                                                const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                                                return (
                                                    <tr key={player.name} className={`border-b ${theme === 'tron' ? 'border-cyan-500/20' : theme === 'kids' ? 'border-purple-200' : 'border-orange-700/30'} ${idx === 0 ? (theme === 'tron' ? 'bg-cyan-500/10' : theme === 'kids' ? 'bg-yellow-100' : 'bg-orange-900/20') : ''}`}>
                                                        <td className="py-2 px-2">
                                                            <div className="flex items-center gap-2">
                                                                {idx < 3 && (
                                                                    <span className={`text-xs font-bold ${
                                                                        idx === 0 ? 'text-yellow-400' :
                                                                        idx === 1 ? 'text-gray-400' :
                                                                        'text-amber-600'
                                                                    }`}>
                                                                        #{idx + 1}
                                                                    </span>
                                                                )}
                                                                <div className="w-6 h-6 flex-shrink-0">
                                                                    <CharacterAvatar characterId={player.avatar} size={24} rarity={character.rarity} />
                                                                </div>
                                                                <span className={`${currentTheme.text} text-sm font-semibold truncate max-w-[100px]`}>{player.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className={`text-center py-2 px-1 text-xs ${currentTheme.textSecondary}`}>{player.r1 || '-'}</td>
                                                        <td className={`text-center py-2 px-1 text-xs ${currentTheme.textSecondary}`}>{player.r2 || '-'}</td>
                                                        <td className={`text-center py-2 px-1 text-xs ${currentTheme.textSecondary}`}>{player.r3 || '-'}</td>
                                                        <td className={`text-center py-2 px-1 text-xs ${currentTheme.textSecondary}`}>{player.speed || '-'}</td>
                                                        <td className={`text-right py-2 px-2 font-bold ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>{player.total}</td>
                                                    </tr>
                                                );
                                            });
                                        })()}
                                    </tbody>
                                </table>
                            </div>

                            {/* Re-add to queue button and Close */}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        // Re-add this game to the queue as a fresh entry
                                        if (!isGameSelected(selectedCompletedGame.gameId)) {
                                            toggleGame(selectedCompletedGame.gameId);
                                        }
                                        setSelectedCompletedGame(null);
                                    }}
                                    className={`flex-1 ${theme === 'tron' ? 'bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-400 border border-cyan-500/50' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-700' : 'bg-orange-900/50 hover:bg-orange-900/70 text-orange-400 border border-orange-700/50'} font-bold py-3 rounded-xl transition-all`}
                                >
                                    {theme === 'tron' ? '[ RE-ADD ]' : 'Play Again'}
                                </button>
                                <button
                                    onClick={() => setSelectedCompletedGame(null)}
                                    className={`flex-1 ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
    );
}

export default RoomPage;
