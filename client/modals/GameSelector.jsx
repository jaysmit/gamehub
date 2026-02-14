import React from 'react';
import { X, Check, Star, Info, Youtube, getGameIcon } from '../icons/UIIcons';
import { MOCK_GAMES } from '../data/games';

function GameSelector({
    theme,
    currentTheme,
    selectedGames,
    toggleGame,
    selectorMinAge,
    setSelectorMinAge,
    selectorMaxAge,
    setSelectorMaxAge,
    selectorMinPlayers,
    setSelectorMinPlayers,
    selectorMaxPlayers,
    setSelectorMaxPlayers,
    selectorSortBy,
    setSelectorSortBy,
    setShowGameSelector,
    setSelectedGameDesc,
}) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col z-50">
            <div className={`flex-1 flex flex-col m-2 md:m-4 rounded-2xl md:rounded-3xl overflow-hidden ${currentTheme.cardBg} ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                {/* Header */}
                <div className="p-3 md:p-6 pb-0 md:pb-0">
                    <h2 className={`text-lg md:text-3xl font-bold ${currentTheme.text} mb-3 md:mb-6 text-center ${currentTheme.font} ${theme === 'tron' ? 'tron-text-glow' : ''}`}>
                        {theme === 'tron' ? '[ SELECT_GAMES ]' : theme === 'kids' ? 'Select Your Games \u{1F3AF}' : 'CHOOSE YOUR NIGHTMARES \u{1F480}'}
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
                            .map((game) => {
                                const isImplemented = !!game.gameType;
                                return (
                                <div
                                    key={game.id}
                                    className={`relative rounded-lg md:rounded-xl overflow-hidden transition-all duration-300 ${isImplemented ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'} ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'} ${selectedGames.includes(game.id) ? (theme === 'tron' ? 'ring-2 ring-cyan-400' : theme === 'scary' ? 'ring-2 ring-orange-500' : 'ring-2 ring-purple-500') : ''}`}
                                >
                                    <button
                                        onClick={() => isImplemented && toggleGame(game.id)}
                                        className={`w-full aspect-[4/3] transition-all relative ${!isImplemented ? 'cursor-not-allowed' : ''}`}
                                        style={{ backgroundColor: theme === 'tron' ? 'transparent' : game.color }}
                                        disabled={!isImplemented}
                                    >
                                        {theme === 'scary' && <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-transparent"></div>}
                                        {/* Coming Soon overlay for unimplemented games */}
                                        {!isImplemented && (
                                            <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-2 z-10">
                                                <span className={`text-[0.6rem] md:text-xs font-bold px-2 py-1 rounded ${theme === 'tron' ? 'bg-gray-800 text-cyan-400 border border-cyan-500/50' : theme === 'scary' ? 'bg-gray-900 text-orange-400 border border-orange-600/50' : 'bg-white/90 text-purple-600 border border-purple-400'}`}>
                                                    Coming Soon...
                                                </span>
                                            </div>
                                        )}
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
                                        {selectedGames.includes(game.id) && (
                                            <div className="absolute top-1 right-1 w-6 h-6 md:w-7 md:h-7 bg-green-500 rounded-full flex items-center justify-center z-20">
                                                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={3} />
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
                            );
                        })}
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
    );
}

export default GameSelector;
