import React from 'react';
import { Crown, Gamepad2 } from '../icons/UIIcons';

function MasterTips({
    theme,
    currentTheme,
    setShowMasterTips,
}) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={() => setShowMasterTips(false)}>
            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl max-w-md w-full p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-300' : 'border-4 border-orange-600'}`} onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-5">
                    <div className="inline-block mb-3 bg-yellow-400 rounded-full p-3">
                        <Crown className="w-8 h-8 text-yellow-900" fill="currentColor" />
                    </div>
                    <h3 className={`text-xl font-bold ${currentTheme.text} ${currentTheme.font}`}>
                        {theme === 'tron' ? 'GAME_MASTER_PROTOCOL' : 'Game Master Tips'}
                    </h3>
                    <p className={`${currentTheme.textSecondary} text-sm mt-1`}>Tips for an awesome game room</p>
                </div>
                <div className="space-y-3 mb-5">
                    {/* Tip 1: Music */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/50">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                            </svg>
                        </div>
                        <div>
                            <p className={`text-sm font-semibold ${currentTheme.text}`}>Turn on the music</p>
                            <p className="text-xs text-gray-400">Hit the sound icon in the header to set the mood with the theme soundtrack</p>
                        </div>
                    </div>
                    {/* Tip 2: Screen share */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/50">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                            </svg>
                        </div>
                        <div>
                            <p className={`text-sm font-semibold ${currentTheme.text}`}>Cast to a TV</p>
                            <p className="text-xs text-gray-400">Screen share or cast to a big screen for a party-style social experience</p>
                        </div>
                    </div>
                    {/* Tip 3: Share room */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/50">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                            </svg>
                        </div>
                        <div>
                            <p className={`text-sm font-semibold ${currentTheme.text}`}>Share the QR code</p>
                            <p className="text-xs text-gray-400">Friends can scan the QR code or enter the room code to join instantly</p>
                        </div>
                    </div>
                    {/* Tip 4: Mix games */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/50">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <Gamepad2 className="w-[18px] h-[18px]" style={{ color: '#06b6d4' }} />
                        </div>
                        <div>
                            <p className={`text-sm font-semibold ${currentTheme.text}`}>Mix up the games</p>
                            <p className="text-xs text-gray-400">Add a variety of games to keep things fresh -- you control the playlist</p>
                        </div>
                    </div>
                    {/* Tip 5: You're in charge */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/50">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <Crown className="w-[18px] h-[18px]" style={{ color: '#06b6d4' }} />
                        </div>
                        <div>
                            <p className={`text-sm font-semibold ${currentTheme.text}`}>You're the Game Master</p>
                            <p className="text-xs text-gray-400">Only you can add/remove games and start the round -- use your power wisely</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setShowMasterTips(false)}
                    className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all ${currentTheme.font}`}
                >
                    {theme === 'tron' ? '[ LET\'S GO ]' : 'Got it!'}
                </button>
            </div>
        </div>
    );
}

export default MasterTips;
