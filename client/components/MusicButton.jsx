import React, { useState, useEffect } from 'react';

const MusicButton = ({ audioRef, theme, isMuted }) => {
    const [musicStarted, setMusicStarted] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    const startMusic = () => {
        if (audioRef.current && !isMuted) {
            audioRef.current.load();
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setMusicStarted(true))
                    .catch(err => {
                        console.error('Music play failed:', err);
                    });
            }
        } else if (isMuted) {
            alert('Music is muted. Click the speaker icon in the header to unmute.');
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.pause();
            } else if (musicStarted) {
                audioRef.current.play().catch(err => console.log('Resume failed:', err));
            }
        }
    }, [isMuted, musicStarted]);

    if (dismissed || musicStarted || isMuted) return null;

    return (
        <div className="fixed top-44 right-4 z-50 animate-pulse">
            <div className="flex items-center gap-1">
                <button
                    onClick={startMusic}
                    className={`${theme === 'tron' ? 'bg-cyan-500 text-black tron-glow' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-600 text-white'} px-2 py-1 rounded-xl font-bold shadow-xl flex items-center gap-1.5 hover:scale-105 transition-all text-xs`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    Start Music
                </button>
                <button
                    onClick={() => setDismissed(true)}
                    className={`${theme === 'tron' ? 'bg-gray-800 text-cyan-400 border border-cyan-500/30' : theme === 'kids' ? 'bg-purple-300 text-purple-800' : 'bg-gray-800 text-orange-400 border border-orange-700/50'} w-5 h-5 rounded-full flex items-center justify-center hover:scale-110 transition-all text-xs font-bold`}
                    title="Dismiss"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default MusicButton;
