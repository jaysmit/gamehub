import React, { useState } from 'react';
import { Crown, Users, Gamepad2, Play, Star, Info, Youtube } from '../icons/UIIcons';
import { DaftPunkRobotHead, DaftPunkHelmet, WerewolfHowlingIcon } from '../icons/ThemeLogos';
import { MOCK_GAMES } from '../data/games';
import CharacterSVG from '../icons/CharacterSVGs';

function LandingPage({
    theme,
    currentTheme,
    pendingSession,
    handleRejoinFromLanding,
    handleDismissSession,
    roomName,
    setRoomName,
    joinRoomId,
    setJoinRoomId,
    playerName,
    setPlayerName,
    showCreateInput,
    setShowCreateInput,
    showJoinInput,
    setShowJoinInput,
    error,
    handleCreateRoom,
    handleJoinRoom,
    setCurrentRoom,
    setIsMaster,
    setSelectedAvatar,
    setSelectedGames,
    setPage,
    minAge,
    maxAge,
    setMinAge,
    setMaxAge,
    minPlayers,
    maxPlayers,
    setMinPlayers,
    setMaxPlayers,
    sortBy,
    setSortBy,
    getGameIcon,
    setSelectedGameDesc,
    availableCharacters,
    rarityConfig,
}) {
    const [showcaseChar, setShowcaseChar] = useState(null);
    const [showDevButtons, setShowDevButtons] = useState(false);
    const [showDismissConfirm, setShowDismissConfirm] = useState(false);

    // Toggle dev buttons with backtick key
    React.useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === '`') {
                setShowDevButtons(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);
    return (
        <div className={`min-h-screen overflow-x-hidden ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} flex flex-col items-center justify-center p-2 sm:p-4 pt-20 sm:pt-28`}>
                <div className="relative max-w-7xl w-full overflow-x-hidden">
                    <div className={`text-center mb-8 md:mb-12`}>
                        <div className={`inline-block p-4 md:p-6 ${theme === 'tron' ? 'bg-cyan-500/10 tron-border' : theme === 'kids' ? 'bg-white kids-shadow' : 'bg-orange-900/40 border-4 border-orange-700'} rounded-2xl md:rounded-3xl mb-4 md:mb-6 ${theme === 'kids' ? 'kids-icon-float' : ''}`}>
                            {theme === 'tron' ? (
                                <DaftPunkRobotHead className={`w-16 h-16 md:w-24 md:h-24 text-cyan-400`} />
                            ) : theme === 'kids' ? (
                                <DaftPunkHelmet className={`w-16 h-16 md:w-24 md:h-24 text-purple-600`} />
                            ) : (
                                <WerewolfHowlingIcon className={`w-16 h-16 md:w-24 md:h-24 text-orange-500`} />
                            )}
                        </div>
                        <h1 className={`text-4xl sm:text-5xl md:text-7xl font-black ${currentTheme.text} mb-2 md:mb-3 tracking-tight ${currentTheme.font} ${theme === 'tron' ? 'tron-text-glow' : ''}`} style={theme === 'tron' ? { animation: 'softPulse 3s ease-in-out infinite' } : {}}>
                            GameHub
                        </h1>
                        <p className={`${currentTheme.textSecondary} text-lg md:text-xl font-light mb-6`}>
                            {theme === 'tron' ? 'Connect. Compete. Conquer.' : theme === 'kids' ? 'Play Together, Have Fun! 🎮✨' : 'Enter If You Dare... 💀🎮'}
                        </p>

                        {/* Dev Buttons - Toggle with backtick key */}
                        {showDevButtons && (
                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    onClick={() => {
                                        const testRoom = {
                                            id: 'TEST123',
                                            name: 'Quick Test Room',
                                            master: 'You',
                                            players: [
                                                { name: 'You', isMaster: true, avatar: 'cyber-knight' },
                                                { name: 'Sarah', isMaster: false, avatar: 'neon-ninja' },
                                                { name: 'Mike', isMaster: false, avatar: 'data-runner' },
                                                { name: 'Emma', isMaster: false, avatar: 'circuit-breaker' }
                                            ],
                                            selectedGames: [1]
                                        };
                                        setCurrentRoom(testRoom);
                                        setIsMaster(true);
                                        setPlayerName('You');
                                        setSelectedAvatar('cyber-knight');
                                        setPage('game');
                                    }}
                                    className={`${theme === 'tron' ? 'bg-green-500/90 hover:bg-green-400 text-black' : theme === 'kids' ? 'bg-green-400 hover:bg-green-300 text-white' : 'bg-green-700 hover:bg-green-600 text-white'} font-bold py-2 px-4 rounded-xl transition-all text-xs opacity-60 hover:opacity-100`}
                                >
                                    DEV: Pictionary
                                </button>
                                <button
                                    onClick={() => {
                                        const devRoom = {
                                            id: 'DEV001',
                                            name: 'Dev Master Room',
                                            master: 'You',
                                            players: [
                                                { name: 'You', isMaster: true, avatar: 'cyber-knight' },
                                                { name: 'Sarah', isMaster: false, avatar: 'neon-ninja' },
                                                { name: 'Mike', isMaster: false, avatar: 'data-runner' },
                                                { name: 'Emma', isMaster: false, avatar: 'circuit-breaker' },
                                                { name: 'James', isMaster: false, avatar: 'byte-fighter' },
                                                { name: 'Olivia', isMaster: false, avatar: 'pixel-warrior' },
                                                { name: 'Liam', isMaster: false, avatar: 'tech-ghost' },
                                                { name: 'Sophia', isMaster: false, avatar: 'cyber-samurai' }
                                            ],
                                            selectedGames: [1, 2, 3, 4, 5, 6, 7]
                                        };
                                        setCurrentRoom(devRoom);
                                        setIsMaster(true);
                                        setPlayerName('You');
                                        setSelectedAvatar('cyber-knight');
                                        setSelectedGames([1, 2, 3, 4, 5, 6, 7]);
                                        setPage('room');
                                    }}
                                    className={`${theme === 'tron' ? 'bg-cyan-500/90 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-400 hover:bg-purple-300 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-2 px-4 rounded-xl transition-all text-xs opacity-60 hover:opacity-100`}
                                >
                                    DEV: Master Room
                                </button>
                                <button
                                    onClick={() => {
                                        const devRoom = {
                                            id: 'DEV002',
                                            name: 'Dev Player Room',
                                            master: 'GameMaster',
                                            players: [
                                                { name: 'GameMaster', isMaster: true, avatar: 'grid-master' },
                                                { name: 'You', isMaster: false, avatar: 'neon-ninja' },
                                                { name: 'Sarah', isMaster: false, avatar: 'data-runner' },
                                                { name: 'Mike', isMaster: false, avatar: 'circuit-breaker' },
                                                { name: 'Emma', isMaster: false, avatar: 'byte-fighter' },
                                                { name: 'James', isMaster: false, avatar: 'pixel-warrior' },
                                                { name: 'Olivia', isMaster: false, avatar: 'tech-ghost' },
                                                { name: 'Sophia', isMaster: false, avatar: 'cyber-samurai' }
                                            ],
                                            selectedGames: [1, 2, 3]
                                        };
                                        setCurrentRoom(devRoom);
                                        setIsMaster(false);
                                        setPlayerName('You');
                                        setSelectedAvatar('neon-ninja');
                                        setSelectedGames([1, 2, 3]);
                                        setPage('room');
                                    }}
                                    className={`${theme === 'tron' ? 'bg-blue-500/90 hover:bg-blue-400 text-black' : theme === 'kids' ? 'bg-blue-400 hover:bg-blue-300 text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'} font-bold py-2 px-4 rounded-xl transition-all text-xs opacity-60 hover:opacity-100`}
                                >
                                    DEV: Join as Player
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Rejoin button — shown when session exists (user navigated away without exiting) */}
                    {pendingSession && pendingSession.roomId && (
                        <div className="mb-4 relative">
                            <button
                                onClick={handleRejoinFromLanding}
                                className={`w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 sm:py-6 px-4 sm:px-8 rounded-2xl transition-all duration-300 hover:scale-105 group shadow-[0_0_20px_rgba(220,38,38,0.4)] ${currentTheme.font}`}
                            >
                                <div className="flex items-center justify-center gap-2 sm:gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                                        <path d="M15 18l-6-6 6-6"/>
                                    </svg>
                                    <span className="text-lg sm:text-2xl">{theme === 'tron' ? '[ REJOIN ]' : theme === 'kids' ? 'Rejoin Room' : 'REJOIN'}</span>
                                </div>
                                <div className="text-xs sm:text-sm font-normal mt-1 opacity-80">
                                    Room: {pendingSession.roomId}
                                </div>
                            </button>
                            {/* Dismiss button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDismissConfirm(true);
                                }}
                                className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 ${theme === 'tron' ? 'bg-gray-800 text-cyan-400 border border-cyan-500' : theme === 'kids' ? 'bg-white text-purple-600 border-2 border-purple-400' : 'bg-gray-800 text-orange-400 border border-orange-600'}`}
                                title="Dismiss"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Dismiss Session Confirmation Modal */}
                    {showDismissConfirm && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={() => setShowDismissConfirm(false)}>
                            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl max-w-sm w-full p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-300' : 'border-4 border-orange-700'}`} onClick={(e) => e.stopPropagation()}>
                                <div className="text-center mb-4">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === 'tron' ? 'bg-red-500/20 text-red-400' : theme === 'kids' ? 'bg-red-100 text-red-500' : 'bg-red-900/40 text-red-400'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                    </div>
                                    <h3 className={`text-xl font-bold ${currentTheme.text} ${currentTheme.font} mb-2`}>
                                        {theme === 'tron' ? '> WARNING' : theme === 'kids' ? 'Are you sure?' : 'WARNING'}
                                    </h3>
                                    <p className={`${currentTheme.textSecondary} text-sm`}>
                                        {theme === 'tron'
                                            ? 'Dismissing will disconnect you from the game room. This action cannot be undone.'
                                            : theme === 'kids'
                                            ? 'If you dismiss this, you\'ll leave the game room and won\'t be able to rejoin!'
                                            : 'You will be kicked from the game room. There is no going back...'}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDismissConfirm(false)}
                                        className={`flex-1 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400 tron-border' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900 border-2 border-purple-300' : 'bg-gray-800 hover:bg-gray-700 text-orange-400 border border-orange-700'} font-bold py-3 rounded-xl transition-all`}
                                    >
                                        {theme === 'tron' ? '[ CANCEL ]' : 'Cancel'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDismissConfirm(false);
                                            if (handleDismissSession) handleDismissSession();
                                        }}
                                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all"
                                    >
                                        {theme === 'tron' ? '[ DISMISS ]' : theme === 'kids' ? 'Leave Room' : 'DISMISS'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className={`mb-4 p-4 ${theme === 'tron' ? 'bg-red-500/20 border border-red-400' : 'bg-red-200 border-4 border-red-400'} rounded-2xl ${currentTheme.text} text-center`}>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 mb-12">
                        {!showCreateInput && !showJoinInput && (
                            <>
                                <button
                                    onClick={() => setShowCreateInput(true)}
                                    className={`w-full ${theme === 'tron' ? 'bg-cyan-500/90 hover:bg-cyan-400 text-black tron-glow' : theme === 'kids' ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white kids-shadow' : 'bg-orange-700 hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(194,65,12,0.5)]'} font-bold py-4 sm:py-6 px-4 sm:px-8 rounded-2xl transition-all duration-300 hover:scale-105 group ${currentTheme.font}`}
                                >
                                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                                        <Crown className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform" />
                                        <span className="text-lg sm:text-2xl">{theme === 'tron' ? '[ CREATE ]' : theme === 'kids' ? 'Create Room' : 'CREATE ROOM'}</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setShowJoinInput(true)}
                                    className={`w-full ${theme === 'tron' ? 'bg-gray-900 hover:bg-gray-800 text-cyan-400 tron-border' : theme === 'kids' ? 'bg-white hover:bg-purple-50 text-purple-600 border-4 border-purple-400 kids-shadow' : 'bg-gray-900 hover:bg-gray-800 text-orange-400 border-2 border-orange-700 shadow-[0_0_15px_rgba(194,65,12,0.3)]'} font-bold py-4 sm:py-6 px-4 sm:px-8 rounded-2xl transition-all duration-300 hover:scale-105 group ${currentTheme.font}`}
                                >
                                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                                        <Users className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
                                        <span className="text-lg sm:text-2xl">{theme === 'tron' ? '[ JOIN ]' : theme === 'kids' ? 'Join Room' : 'JOIN ROOM'}</span>
                                    </div>
                                </button>
                            </>
                        )}

                        {showCreateInput && (
                            <div className={`${currentTheme.cardBg} backdrop-blur-lg p-6 rounded-2xl ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-300' : 'border-4 border-orange-700'}`}>
                                <input
                                    type="text"
                                    placeholder={theme === 'tron' ? '> Room name...' : theme === 'kids' ? 'Room name (e.g. Fun Zone)' : 'Room name...'}
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    maxLength={20}
                                    className={`w-full px-4 py-3 mb-3 rounded-xl ${theme === 'tron' ? 'bg-black text-cyan-400 border border-cyan-500 placeholder-cyan-600' : theme === 'scary' ? 'bg-gray-900 text-orange-400 border-2 border-orange-700 placeholder-orange-700' : 'bg-white text-purple-900 border-2 border-purple-300 placeholder-purple-400'} focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400' : theme === 'scary' ? 'focus:ring-orange-600' : 'focus:ring-purple-500'}`}
                                />
                                <input
                                    type="text"
                                    placeholder={theme === 'tron' ? '> Your name...' : theme === 'kids' ? 'Your name (e.g. Alex)' : 'Your name...'}
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    maxLength={20}
                                    className={`w-full px-4 py-3 mb-4 rounded-xl ${theme === 'tron' ? 'bg-black text-cyan-400 border border-cyan-500 placeholder-cyan-600' : theme === 'scary' ? 'bg-gray-900 text-orange-400 border-2 border-orange-700 placeholder-orange-700' : 'bg-white text-purple-900 border-2 border-purple-300 placeholder-purple-400'} focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400' : theme === 'scary' ? 'focus:ring-orange-600' : 'focus:ring-purple-500'}`}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCreateRoom}
                                        className={`flex-1 ${theme === 'tron' ? 'bg-green-500 hover:bg-green-400 text-black' : theme === 'scary' ? 'bg-green-700 hover:bg-green-600 text-white' : 'bg-green-400 hover:bg-green-300 text-white'} font-bold py-3 rounded-xl transition-all`}
                                    >
                                        {theme === 'tron' ? '[ CREATE ]' : theme === 'scary' ? 'CREATE' : 'Create'}
                                    </button>
                                    <button
                                        onClick={() => setShowCreateInput(false)}
                                        className={`px-6 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'scary' ? 'bg-gray-800 hover:bg-gray-700 text-orange-400' : 'bg-purple-200 hover:bg-purple-300 text-purple-900'} font-bold py-3 rounded-xl transition-all`}
                                    >
                                        {theme === 'tron' ? '[ CANCEL ]' : theme === 'scary' ? 'CANCEL' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {showJoinInput && (
                            <div className={`${currentTheme.cardBg} backdrop-blur-lg p-6 rounded-2xl ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-300' : 'border-4 border-orange-700'}`}>
                                <input
                                    type="text"
                                    placeholder={theme === 'tron' ? '> Room code (e.g. AB12CD)' : theme === 'kids' ? 'Room code (e.g. AB12CD)' : 'Room code (e.g. AB12CD)'}
                                    value={joinRoomId}
                                    onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                                    maxLength={20}
                                    className={`w-full px-4 py-3 mb-3 rounded-xl ${theme === 'tron' ? 'bg-black text-cyan-400 border border-cyan-500 placeholder-cyan-600' : theme === 'scary' ? 'bg-gray-900 text-orange-400 border-2 border-orange-700 placeholder-orange-700' : 'bg-white text-purple-900 border-2 border-purple-300 placeholder-purple-400'} focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400' : theme === 'scary' ? 'focus:ring-orange-600' : 'focus:ring-purple-500'} uppercase`}
                                />
                                <input
                                    type="text"
                                    placeholder={theme === 'tron' ? '> Your name...' : theme === 'kids' ? 'Your name (e.g. Alex)' : 'Your name...'}
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    maxLength={20}
                                    className={`w-full px-4 py-3 mb-4 rounded-xl ${theme === 'tron' ? 'bg-black text-cyan-400 border border-cyan-500 placeholder-cyan-600' : theme === 'scary' ? 'bg-gray-900 text-orange-400 border-2 border-orange-700 placeholder-orange-700' : 'bg-white text-purple-900 border-2 border-purple-300 placeholder-purple-400'} focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400' : theme === 'scary' ? 'focus:ring-orange-600' : 'focus:ring-purple-500'}`}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleJoinRoom}
                                        className={`flex-1 ${theme === 'tron' ? 'bg-blue-500 hover:bg-blue-400 text-black' : theme === 'scary' ? 'bg-orange-700 hover:bg-orange-600 text-white' : 'bg-blue-400 hover:bg-blue-300 text-white'} font-bold py-3 rounded-xl transition-all`}
                                    >
                                        {theme === 'tron' ? '[ JOIN ]' : theme === 'scary' ? 'ENTER' : 'Join'}
                                    </button>
                                    <button
                                        onClick={() => setShowJoinInput(false)}
                                        className={`px-6 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'scary' ? 'bg-gray-800 hover:bg-gray-700 text-orange-400' : 'bg-purple-200 hover:bg-purple-300 text-purple-900'} font-bold py-3 rounded-xl transition-all`}
                                    >
                                        {theme === 'tron' ? '[ CANCEL ]' : theme === 'scary' ? 'CANCEL' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* How It Works Section */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg p-4 md:p-8 rounded-3xl ${theme === 'tron' ? 'tron-border' : 'border-4 border-purple-300'} mb-8 md:mb-12`}>
                        <h2 className={`text-2xl md:text-3xl font-bold ${currentTheme.text} mb-4 md:mb-8 text-center ${currentTheme.font}`}>
                            {theme === 'tron' ? '> SYSTEM_PROTOCOL' : theme === 'kids' ? 'How It Works ⚡' : 'THE RITUAL 💀'}
                        </h2>

                        <div className="grid grid-cols-4 gap-2 md:gap-6">
                            <div className="text-center">
                                <div className={`w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 ${theme === 'tron' ? 'bg-cyan-500/20 tron-border' : 'bg-purple-200 border-2 md:border-4 border-purple-400'} rounded-xl md:rounded-2xl flex items-center justify-center ${theme === 'kids' ? 'kids-bubble' : ''}`}>
                                    <Crown className={`w-6 h-6 md:w-10 md:h-10 ${currentTheme.text}`} />
                                </div>
                                <h3 className={`text-xs md:text-lg font-bold ${currentTheme.text} mb-1 md:mb-2 ${currentTheme.font}`}>
                                    1. Create
                                </h3>
                                <p className={`${currentTheme.textSecondary} text-[0.65rem] md:text-sm hidden md:block`}>
                                    {theme === 'tron' ? 'Set up your game room' : 'Set up your game room in seconds'}
                                </p>
                            </div>

                            <div className="text-center">
                                <div className={`w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 ${theme === 'tron' ? 'bg-cyan-500/20 tron-border' : 'bg-purple-200 border-2 md:border-4 border-purple-400'} rounded-xl md:rounded-2xl flex items-center justify-center ${theme === 'kids' ? 'kids-bubble' : ''}`} style={{ animationDelay: '0.2s' }}>
                                    <Users className={`w-6 h-6 md:w-10 md:h-10 ${currentTheme.text}`} />
                                </div>
                                <h3 className={`text-xs md:text-lg font-bold ${currentTheme.text} mb-1 md:mb-2 ${currentTheme.font}`}>
                                    2. Join
                                </h3>
                                <p className={`${currentTheme.textSecondary} text-[0.65rem] md:text-sm hidden md:block`}>
                                    {theme === 'tron' ? 'Share room code or QR' : 'Share the code or QR code'}
                                </p>
                            </div>

                            <div className="text-center">
                                <div className={`w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 ${theme === 'tron' ? 'bg-cyan-500/20 tron-border' : 'bg-purple-200 border-2 md:border-4 border-purple-400'} rounded-xl md:rounded-2xl flex items-center justify-center ${theme === 'kids' ? 'kids-bubble' : ''}`} style={{ animationDelay: '0.4s' }}>
                                    <Gamepad2 className={`w-6 h-6 md:w-10 md:h-10 ${currentTheme.text}`} strokeWidth={2} />
                                </div>
                                <h3 className={`text-xs md:text-lg font-bold ${currentTheme.text} mb-1 md:mb-2 ${currentTheme.font}`}>
                                    3. Select
                                </h3>
                                <p className={`${currentTheme.textSecondary} text-[0.65rem] md:text-sm hidden md:block`}>
                                    {theme === 'tron' ? 'Choose games to play' : 'Pick your favorite games'}
                                </p>
                            </div>

                            <div className="text-center">
                                <div className={`w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 ${theme === 'tron' ? 'bg-cyan-500/20 tron-border' : 'bg-purple-200 border-2 md:border-4 border-purple-400'} rounded-xl md:rounded-2xl flex items-center justify-center ${theme === 'kids' ? 'kids-bubble' : ''}`} style={{ animationDelay: '0.6s' }}>
                                    <Play className={`w-6 h-6 md:w-10 md:h-10 ${currentTheme.text}`} />
                                </div>
                                <h3 className={`text-xs md:text-lg font-bold ${currentTheme.text} mb-1 md:mb-2 ${currentTheme.font}`}>
                                    4. Play
                                </h3>
                                <p className={`${currentTheme.textSecondary} text-[0.65rem] md:text-sm hidden md:block`}>
                                    {theme === 'tron' ? 'Game begins!' : 'Have fun together!'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Explore Games Section */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg p-8 rounded-3xl ${theme === 'tron' ? 'tron-border' : 'border-4 border-purple-300'}`}>
                        <h2 className={`text-3xl font-bold ${currentTheme.text} mb-6 text-center ${currentTheme.font}`}>
                            {theme === 'tron' ? '> GAME_LIBRARY' : theme === 'kids' ? 'Explore Games 🎯' : 'TORTURE CHAMBER 🦇'}
                        </h2>

                        {/* Filters */}
                        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                            {/* Players min-max slider */}
                            <div>
                                <label className={`block ${currentTheme.textSecondary} text-[0.6rem] md:text-sm font-semibold mb-1`}>
                                    Players: {minPlayers === 1 && maxPlayers === 16 ? 'All' : `${minPlayers}-${maxPlayers}`}
                                </label>
                                <div className="dual-range-wrapper relative h-2 mt-2 mb-3">
                                    <div className={`absolute inset-0 rounded-lg ${theme === 'tron' ? 'bg-gray-800' : theme === 'scary' ? 'bg-stone-900' : 'bg-purple-100'}`}></div>
                                    <div className="absolute top-0 h-full rounded-lg" style={{
                                        left: `${((minPlayers - 1) / 15) * 100}%`,
                                        right: `${100 - ((maxPlayers - 1) / 15) * 100}%`,
                                        background: theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7'
                                    }}></div>
                                    <input
                                        type="range" min="1" max="16"
                                        value={minPlayers}
                                        onChange={(e) => {
                                            const v = parseInt(e.target.value);
                                            setMinPlayers(Math.min(v, maxPlayers));
                                        }}
                                        className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                                        style={{ '--tw-thumb-bg': theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7' }}
                                    />
                                    <input
                                        type="range" min="1" max="16"
                                        value={maxPlayers}
                                        onChange={(e) => {
                                            const v = parseInt(e.target.value);
                                            setMaxPlayers(Math.max(v, minPlayers));
                                        }}
                                        className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                                        style={{ '--tw-thumb-bg': theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7' }}
                                    />
                                </div>
                            </div>
                            {/* Age min-max slider */}
                            <div>
                                <label className={`block ${currentTheme.textSecondary} text-[0.6rem] md:text-sm font-semibold mb-1`}>
                                    Age: {minAge === 5 && maxAge === 18 ? 'All Ages' : `${minAge}-${maxAge}`}
                                </label>
                                <div className="dual-range-wrapper relative h-2 mt-2 mb-3">
                                    <div className={`absolute inset-0 rounded-lg ${theme === 'tron' ? 'bg-gray-800' : theme === 'scary' ? 'bg-stone-900' : 'bg-purple-100'}`}></div>
                                    <div className="absolute top-0 h-full rounded-lg" style={{
                                        left: `${((minAge - 5) / 13) * 100}%`,
                                        right: `${100 - ((maxAge - 5) / 13) * 100}%`,
                                        background: theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7'
                                    }}></div>
                                    <input
                                        type="range" min="5" max="18"
                                        value={minAge}
                                        onChange={(e) => {
                                            const v = parseInt(e.target.value);
                                            setMinAge(Math.min(v, maxAge));
                                        }}
                                        className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10"
                                        style={{ '--tw-thumb-bg': theme === 'tron' ? '#06b6d4' : theme === 'scary' ? '#ea580c' : '#a855f7' }}
                                    />
                                    <input
                                        type="range" min="5" max="18"
                                        value={maxAge}
                                        onChange={(e) => {
                                            const v = parseInt(e.target.value);
                                            setMaxAge(Math.max(v, minAge));
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
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className={`w-full px-2 md:px-4 py-1 md:py-2 rounded-lg text-xs md:text-sm ${theme === 'tron' ? 'bg-black text-cyan-400 border border-cyan-500' : theme === 'scary' ? 'bg-gray-900 text-orange-400 border border-orange-700' : 'bg-white text-purple-900 border-2 border-purple-300'} focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400' : theme === 'scary' ? 'focus:ring-orange-600' : 'focus:ring-purple-500'}`}
                                >
                                    <option value="popular">Most Popular</option>
                                    <option value="newest">Newest</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Game Library Grid - Fixed Height */}
                        <div className={`h-[800px] lg:h-[500px] overflow-y-auto pr-2 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {MOCK_GAMES
                                .filter(game => {
                                    const playerParts = game.players.split('-');
                                    const gameMinPlayers = parseInt(playerParts[0]);
                                    const gameMaxPlayers = parseInt(playerParts[1] || playerParts[0]);
                                    const playersMatch = gameMinPlayers <= maxPlayers && gameMaxPlayers >= minPlayers;
                                    const ageMatch = game.ageMin >= minAge && game.ageMin <= maxAge;
                                    return playersMatch && ageMatch;
                                })
                                .sort((a, b) => {
                                    if (sortBy === 'rating') return b.rating - a.rating;
                                    if (sortBy === 'newest') return b.id - a.id;
                                    return 0; // popular - default order
                                })
                                .map((game) => (
                                <div
                                    key={game.id}
                                    className={`relative rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${theme === 'tron' ? 'border-2 border-cyan-500/50 hover:border-cyan-400 bg-black' : theme === 'kids' ? 'border-2 md:border-4 border-purple-300' : 'border-2 border-orange-700/50 hover:border-orange-600 bg-gray-900'} cursor-pointer`}
                                >
                                    <div
                                        className="aspect-square transition-all relative"
                                        style={{ backgroundColor: theme === 'tron' ? '#0a0a0a' : theme === 'scary' ? '#1a0a00' : game.color }}
                                    >
                                        {theme === 'tron' && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-transparent"></div>
                                        )}
                                        {theme === 'scary' && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-transparent"></div>
                                        )}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-3">
                                            <div className={`mb-1 md:mb-2 ${theme === 'tron' ? 'text-cyan-400' : theme === 'scary' ? 'text-orange-500' : 'text-white'}`}>
                                                {getGameIcon(game.id, 'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12')}
                                            </div>
                                            <span className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'scary' ? 'text-orange-400' : 'text-white'} font-bold text-xs md:text-sm text-center mb-1 md:mb-2 line-clamp-2`}>
                                                {game.name}
                                            </span>
                                            <div className="flex items-center gap-0.5 md:gap-1 mb-0.5 md:mb-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star key={i} className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'scary' ? 'text-orange-500' : 'text-yellow-400'} inline w-2 h-2 md:w-3 md:h-3`} filled={i <= Math.floor(game.rating)} />
                                                ))}
                                                <span className={`text-[0.6rem] md:text-xs ${theme === 'tron' ? 'text-cyan-300' : theme === 'scary' ? 'text-orange-400' : 'text-white'} ml-0.5 md:ml-1`}>{game.rating}</span>
                                            </div>
                                            <span className={`text-[0.6rem] md:text-xs ${theme === 'tron' ? 'text-cyan-500' : theme === 'scary' ? 'text-orange-500' : 'text-white/80'}`}>{game.players}</span>
                                        </div>

                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all"></div>
                                    </div>

                                    <div className={`p-1.5 md:p-2 ${theme === 'tron' ? 'bg-cyan-900/20 border-t border-cyan-500/30' : theme === 'scary' ? 'bg-orange-900/20 border-t border-orange-700/30' : 'bg-white/90 border-t border-purple-200'}`}>
                                        <div className="flex gap-1 md:gap-2">
                                            <button
                                                onClick={() => setSelectedGameDesc(game)}
                                                className={`flex-1 ${theme === 'tron' ? 'bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-400' : theme === 'scary' ? 'bg-orange-700/40 hover:bg-orange-700/60 text-orange-400' : 'bg-purple-500 hover:bg-purple-400 text-white'} text-[0.6rem] md:text-xs py-1 md:py-1.5 px-1 md:px-2 rounded transition-all flex items-center justify-center gap-0.5 md:gap-1`}
                                            >
                                                <Info className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                <span className="hidden sm:inline">Info</span>
                                            </button>
                                            <a
                                                href={game.youtubeLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex-1 ${theme === 'tron' ? 'bg-red-500/30 hover:bg-red-500/50 text-red-400' : theme === 'scary' ? 'bg-red-700/40 hover:bg-red-700/60 text-red-400' : 'bg-red-500 hover:bg-red-400 text-white'} text-[0.6rem] md:text-xs py-1 md:py-1.5 px-1 md:px-2 rounded transition-all flex items-center justify-center gap-0.5 md:gap-1`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Youtube className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                <span className="hidden sm:inline">Video</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>

                    {/* Avatar Showcase Section */}
                    {availableCharacters && rarityConfig && (
                        <div className={`${currentTheme.cardBg} backdrop-blur-lg p-8 rounded-3xl ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-300' : 'border-4 border-orange-600'} mt-8 md:mt-12`}>
                            <h2 className={`text-3xl font-bold ${currentTheme.text} mb-2 text-center ${currentTheme.font}`}>
                                {theme === 'tron' ? '> CHARACTER_DATABASE' : theme === 'kids' ? 'Meet the Characters! 🎭' : 'THE CREATURES 💀'}
                            </h2>
                            <p className={`${currentTheme.textSecondary} text-center text-sm mb-6`}>
                                {theme === 'tron' ? 'Unlock characters by completing achievements in-game' : theme === 'kids' ? 'Play games to unlock special characters!' : 'Prove your worth to summon these avatars'}
                            </p>

                            <div className={`max-h-[700px] lg:max-h-[500px] overflow-y-auto pr-2 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                                {['common', 'uncommon', 'rare', 'legendary'].map(rarity => {
                                    const chars = availableCharacters.filter(c => (c.rarity || 'common') === rarity);
                                    if (chars.length === 0) return null;
                                    const rc = rarityConfig[rarity];
                                    return (
                                        <div key={rarity} className="mb-5">
                                            <div className="flex items-center gap-2 mb-3 pt-1">
                                                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: rc.color }}>{rc.label}</span>
                                                <div className="flex-1 h-px" style={{ background: rc.color, opacity: 0.3 }}></div>
                                                <span className={`text-xs ${currentTheme.textSecondary}`}>{chars.length}</span>
                                            </div>
                                            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                                {chars.map((character) => {
                                                    const isLocked = character.unlock != null;
                                                    return (
                                                        <button
                                                            key={character.id}
                                                            onClick={() => setShowcaseChar(character)}
                                                            className={`relative p-3 rounded-xl transition-all hover:scale-105 ${
                                                                isLocked
                                                                    ? `opacity-80 bg-gray-800/40 border ${rc.border}`
                                                                    : `bg-gray-800/50 border ${rc.border} hover:bg-gray-700/50 ${rc.glow}`
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
                                                            <div className={`text-xs font-semibold text-center ${isLocked ? 'text-gray-600' : currentTheme.text}`}>
                                                                {character.name}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Character Detail Modal */}
                    {showcaseChar && rarityConfig && (() => {
                        const c = showcaseChar;
                        const rc = rarityConfig[c.rarity || 'common'];
                        const isLocked = c.unlock != null;
                        return (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={() => setShowcaseChar(null)}>
                                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl max-w-sm w-full p-6 ${rc.glow}`} style={{ border: `2px solid ${rc.color}40` }} onClick={(e) => e.stopPropagation()}>
                                    <div className="text-center mb-4">
                                        <div className={`inline-block mb-3 ${isLocked ? 'grayscale' : ''}`}>
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
                                            <p className="text-sm font-medium" style={{ color: rc.color }}>{c.unlock}</p>
                                        </div>
                                    ) : (
                                        <div className="text-center mb-4">
                                            <span className="text-xs font-bold text-green-400 uppercase tracking-wide">Unlocked</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setShowcaseChar(null)}
                                        className={`w-full ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400 tron-border' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900 border-2 border-purple-300' : 'bg-gray-800 hover:bg-gray-700 text-orange-400 border border-orange-700'} font-bold py-2.5 rounded-xl transition-all text-sm`}
                                    >
                                        {theme === 'tron' ? '[ CLOSE ]' : 'Close'}
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>
    );
}

export default LandingPage;
