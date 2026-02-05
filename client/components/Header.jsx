import React, { useState, useRef, useEffect } from 'react';
import { Menu, Home, User, Settings, HelpCircle, LogOut, Palette, Users } from '../icons/UIIcons';
import { DaftPunkRobotHead, DaftPunkHelmet, WerewolfHowlingIcon } from '../icons/ThemeLogos';
import { MUSIC_TRACKS } from '../data/music';

// LogIn icon
const LogInIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
        <polyline points="10 17 15 12 10 7"></polyline>
        <line x1="15" y1="12" x2="3" y2="12"></line>
    </svg>
);

function Header({
    theme,
    currentTheme,
    page,
    showMenu,
    setShowMenu,
    isMuted,
    setIsMuted,
    setTheme,
    goToLanding,
    devToast,
    // Music control props
    musicStarted = false,
    onStartMusic = () => {},
    selectedTrack = null,
    onSelectTrack = () => {},
    // Auth props
    isLoggedIn = false,
    currentUser = null,
    navigateTo = () => {},
    handleLogout = () => {}
}) {
    const [showMusicMenu, setShowMusicMenu] = useState(false);
    const musicMenuRef = useRef(null);
    const menuRef = useRef(null);

    // Close music menu on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (musicMenuRef.current && !musicMenuRef.current.contains(e.target)) {
                setShowMusicMenu(false);
            }
        };
        if (showMusicMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMusicMenu]);

    // Close main menu on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu, setShowMenu]);

    const handleMenuClick = (destination) => {
        setShowMenu(false);
        if (destination === 'logout') {
            handleLogout();
        } else {
            navigateTo(destination);
        }
    };

    const handleTrackSelect = (track) => {
        onSelectTrack(track);
        // Always mark music as started when user selects a track
        if (!musicStarted) {
            onStartMusic();
        }
        setShowMusicMenu(false);
    };

    return (
        <>
            {devToast && (
                <div className={`fixed top-2 left-1/2 -translate-x-1/2 z-[100] text-xs font-bold px-3 py-1 rounded-full shadow-lg ${currentTheme.font} ${theme === 'tron' ? 'bg-cyan-500/90 text-black tron-glow' : theme === 'kids' ? 'bg-purple-500 text-white kids-shadow' : 'bg-orange-700/90 text-white shadow-[0_0_15px_rgba(234,88,12,0.6)]'}`} style={{ animation: 'fadeToast 10s ease-in-out forwards' }}>
                    {theme === 'tron' ? '> ' : ''}{devToast}{theme === 'tron' ? ' _' : ''}
                </div>
            )}
            <header className={`fixed top-0 left-0 right-0 z-50 ${currentTheme.headerBg} backdrop-blur-lg ${theme === 'tron' ? 'border-b border-cyan-500/30' : 'border-b-4 border-purple-300'}`}>
                <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
                    <button
                        onClick={goToLanding}
                        className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group"
                    >
                        <div className={`hidden md:block w-16 h-16 ${theme === 'tron' ? 'bg-cyan-500/20 tron-border' : theme === 'kids' ? 'bg-gradient-to-br from-pink-400 to-purple-500 kids-shadow' : 'bg-orange-900/40 border-2 border-orange-700'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform p-2`}>
                            {theme === 'tron' ? (
                                <DaftPunkRobotHead className={`w-full h-full text-cyan-400`} />
                            ) : theme === 'kids' ? (
                                <DaftPunkHelmet className={`w-full h-full text-white`} />
                            ) : (
                                <WerewolfHowlingIcon className={`w-full h-full text-orange-500`} />
                            )}
                        </div>
                        <span className={`${currentTheme.text} font-bold text-lg sm:text-xl md:text-2xl ${currentTheme.font} ${theme === 'tron' ? 'tron-text-glow' : ''}`}>
                            GameHub
                        </span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Theme Dropdown */}
                        <div className="relative">
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className={`appearance-none w-9 h-9 sm:w-10 sm:h-10 md:w-auto md:h-12 md:pl-10 md:pr-4 ${theme === 'tron' ? 'bg-cyan-500/20 tron-border' : theme === 'kids' ? 'bg-purple-500' : 'bg-orange-700/40 border-2 border-orange-700'} rounded-xl font-semibold transition-all hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400' : theme === 'kids' ? 'focus:ring-purple-400' : 'focus:ring-orange-500'} text-transparent md:text-current ${theme === 'tron' ? 'md:text-cyan-400' : theme === 'kids' ? 'md:text-white' : 'md:text-orange-400'}`}
                            >
                                <option value="tron" className={`py-2 px-3 ${theme === 'tron' ? 'bg-gray-900 text-cyan-400' : theme === 'kids' ? 'bg-purple-100 text-purple-900' : 'bg-gray-900 text-orange-400'}`}>Tron</option>
                                <option value="kids" className={`py-2 px-3 ${theme === 'tron' ? 'bg-gray-900 text-cyan-400' : theme === 'kids' ? 'bg-purple-100 text-purple-900' : 'bg-gray-900 text-orange-400'}`}>Kids</option>
                                <option value="scary" className={`py-2 px-3 ${theme === 'tron' ? 'bg-gray-900 text-cyan-400' : theme === 'kids' ? 'bg-purple-100 text-purple-900' : 'bg-gray-900 text-orange-400'}`}>Scary</option>
                            </select>
                            {/* Palette Icon Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center md:justify-start md:pl-3 pointer-events-none">
                                <Palette className={`w-5 h-5 md:w-6 md:h-6 ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-white' : 'text-orange-400'}`} />
                            </div>
                        </div>

                        {/* Music Button with Dropdown */}
                        <div className="relative" ref={musicMenuRef}>
                            <button
                                onClick={() => setShowMusicMenu(!showMusicMenu)}
                                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 ${theme === 'tron' ? 'bg-cyan-500/20 tron-border text-cyan-400' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-700/40 text-orange-400 border-2 border-orange-700'} rounded-xl flex items-center justify-center transition-all hover:scale-105 ${!musicStarted && !isMuted ? 'animate-pulse' : ''}`}
                                title="Music Settings"
                            >
                                {isMuted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                        <line x1="23" y1="9" x2="17" y2="15"></line>
                                        <line x1="17" y1="9" x2="23" y2="15"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    </svg>
                                )}
                            </button>

                            {/* Music Dropdown */}
                            {showMusicMenu && (
                                <div className={`absolute top-full right-0 mt-2 w-36 ${currentTheme.cardBg} backdrop-blur-xl rounded-xl ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-2 border-purple-300' : 'border-2 border-orange-700'} shadow-2xl overflow-hidden z-50`}>
                                    <div className="p-1.5">
                                        {/* Mute/Unmute Toggle */}
                                        <button
                                            onClick={() => {
                                                setIsMuted(!isMuted);
                                                setShowMusicMenu(false);
                                            }}
                                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium ${isMuted ? (theme === 'tron' ? 'text-red-400' : 'text-red-500') : (theme === 'tron' ? 'text-green-400' : 'text-green-500')} hover:bg-white/10 transition-all`}
                                        >
                                            {isMuted ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                                                    Unmute
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                                                    Mute
                                                </>
                                            )}
                                        </button>

                                        <div className={`my-1 border-t ${theme === 'tron' ? 'border-cyan-500/30' : theme === 'kids' ? 'border-purple-300' : 'border-orange-700/50'}`}></div>

                                        {/* Track List */}
                                        {MUSIC_TRACKS.map((track) => (
                                            <button
                                                key={track.id}
                                                onClick={() => handleTrackSelect(track)}
                                                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-white/10 transition-all ${selectedTrack?.id === track.id ? (theme === 'tron' ? 'bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 text-purple-700' : 'bg-orange-500/20 text-orange-400') : currentTheme.text}`}
                                            >
                                                {selectedTrack?.id === track.id && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                                )}
                                                <span className={selectedTrack?.id === track.id ? '' : 'ml-4'}>{track.shortName}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 ${theme === 'tron' ? 'bg-cyan-500/20 tron-border text-cyan-400' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-700/40 text-orange-400 border-2 border-orange-700'} rounded-xl flex items-center justify-center transition-all hover:scale-105`}
                            >
                                <Menu className="w-5 h-5 md:w-6 md:h-6" />
                            </button>

                {showMenu && (
                    <div className={`absolute top-full right-0 mt-2 w-56 sm:w-64 max-w-[calc(100vw-1rem)] ${currentTheme.cardBg} backdrop-blur-xl rounded-2xl ${theme === 'tron' ? 'tron-border' : 'border-4 border-purple-300'} shadow-2xl overflow-hidden z-50`}>
                        <div className="p-2">
                            {/* Home */}
                            <button
                                onClick={() => handleMenuClick('landing')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 ${currentTheme.text} transition-all group`}
                            >
                                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Home</span>
                            </button>

                            {/* Profile - requires login */}
                            {isLoggedIn ? (
                                <button
                                    onClick={() => handleMenuClick('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 ${currentTheme.text} transition-all group`}
                                >
                                    <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Profile</span>
                                </button>
                            ) : null}

                            {/* Friends - requires login */}
                            {isLoggedIn ? (
                                <button
                                    onClick={() => handleMenuClick('friends')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 ${currentTheme.text} transition-all group`}
                                >
                                    <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Friends</span>
                                </button>
                            ) : null}

                            {/* Settings - requires login */}
                            {isLoggedIn ? (
                                <button
                                    onClick={() => handleMenuClick('settings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 ${currentTheme.text} transition-all group`}
                                >
                                    <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Settings</span>
                                </button>
                            ) : null}

                            {/* Help */}
                            <button
                                onClick={() => handleMenuClick('help')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 ${currentTheme.text} transition-all group`}
                            >
                                <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Help & Support</span>
                            </button>

                            <div className={`my-2 border-t ${theme === 'tron' ? 'border-cyan-500/30' : 'border-purple-300'}`}></div>

                            {/* Login/Logout */}
                            {isLoggedIn ? (
                                <button
                                    onClick={() => handleMenuClick('logout')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${theme === 'tron' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-200 text-red-600'} transition-all group`}
                                >
                                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Log Out</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleMenuClick('login')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${theme === 'tron' ? 'hover:bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'hover:bg-purple-200 text-purple-600' : 'hover:bg-orange-500/20 text-orange-400'} transition-all group`}
                                >
                                    <LogInIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Log In</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
