import React, { useState, useEffect, useRef } from 'react';

const MusicButton = ({ audioRef, theme, isMuted, onMusicStart }) => {
    const [musicStarted, setMusicStarted] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const isPlayingRef = useRef(false);

    // Auto-dismiss after 5 seconds
    useEffect(() => {
        if (dismissed || musicStarted || isMuted) return;

        const timer = setTimeout(() => {
            setDismissed(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, [dismissed, musicStarted, isMuted]);

    const startMusic = async () => {
        if (isPlayingRef.current) return; // Prevent double-play
        if (audioRef.current && !isMuted) {
            isPlayingRef.current = true;
            try {
                await audioRef.current.play();
                setMusicStarted(true);
                if (onMusicStart) onMusicStart();
            } catch (err) {
                // Ignore AbortError - happens when play is interrupted
                if (err.name !== 'AbortError') {
                    console.error('Music play failed:', err);
                }
            } finally {
                isPlayingRef.current = false;
            }
        }
        // Dismiss either way when clicked
        setDismissed(true);
    };

    // Handle mute/unmute - only pause, don't auto-resume (Header handles that)
    useEffect(() => {
        if (audioRef.current && isMuted && musicStarted) {
            audioRef.current.pause();
        }
    }, [isMuted, musicStarted]);

    if (dismissed || musicStarted || isMuted) return null;

    return (
        <div className="fixed top-20 sm:top-24 right-2 sm:right-4 z-[60]">
            <div
                onClick={startMusic}
                className={`${theme === 'tron' ? 'bg-gray-900/95 border border-cyan-500/50' : theme === 'kids' ? 'bg-purple-100/95 border-2 border-purple-400' : 'bg-gray-900/95 border border-orange-600/50'} backdrop-blur-sm rounded-xl p-3 shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all touch-manipulation max-w-[200px]`}
            >
                {/* Arrow pointing up to header */}
                <div className={`absolute -top-2 right-6 w-4 h-4 rotate-45 ${theme === 'tron' ? 'bg-gray-900 border-l border-t border-cyan-500/50' : theme === 'kids' ? 'bg-purple-100 border-l-2 border-t-2 border-purple-400' : 'bg-gray-900 border-l border-t border-orange-600/50'}`}></div>

                <div className="flex items-center gap-2">
                    <div className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'} animate-pulse`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    </div>
                    <div>
                        <p className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-700' : 'text-orange-400'} font-bold text-xs`}>
                            {theme === 'tron' ? 'START_MUSIC' : 'Start Music'}
                        </p>
                        <p className={`${theme === 'tron' ? 'text-cyan-400/70' : theme === 'kids' ? 'text-purple-500' : 'text-orange-400/70'} text-[0.6rem]`}>
                            Tap here or speaker icon
                        </p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDismissed(true);
                        }}
                        className={`${theme === 'tron' ? 'text-cyan-400/50 hover:text-cyan-400' : theme === 'kids' ? 'text-purple-400 hover:text-purple-600' : 'text-orange-400/50 hover:text-orange-400'} ml-1 transition-colors`}
                        title="Dismiss"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MusicButton;
