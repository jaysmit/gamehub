import React from 'react';
import { Edit2, Trophy, Star, Gamepad2, Clock, Medal } from '../icons/UIIcons';
import CharacterSVG from '../icons/CharacterSVGs';

function ProfilePage({
    theme,
    currentTheme,
    user,
    navigateTo,
    availableCharacters
}) {
    if (!user) {
        return (
            <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} flex items-center justify-center p-4 pt-24`}>
                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-8 text-center ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                    <p className={`${currentTheme.text} mb-4`}>Please log in to view your profile</p>
                    <button
                        onClick={() => navigateTo('login')}
                        className={`${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-2 px-6 rounded-xl transition-all`}
                    >
                        Log In
                    </button>
                </div>
            </div>
        );
    }

    const character = availableCharacters.find(c => c.id === user.avatar) || availableCharacters[0];
    const xpForNext = user.level * 100;
    const xpProgress = (user.xp / xpForNext) * 100;

    return (
        <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} p-4 pt-24 pb-8`}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header Card */}
                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400 kids-shadow' : 'border-4 border-orange-700'}`}>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className={`relative w-32 h-32 ${theme === 'tron' ? 'bg-cyan-500/20 border-2 border-cyan-400' : theme === 'kids' ? 'bg-purple-200 border-4 border-purple-400' : 'bg-orange-900/40 border-2 border-orange-600'} rounded-full flex items-center justify-center`}>
                            <CharacterSVG characterId={user.avatar} size={96} color={character.color} />
                            <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full ${theme === 'tron' ? 'bg-cyan-500 text-black' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-600 text-white'} font-bold text-sm`}>
                                Lvl {user.level}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className={`text-3xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                                {user.name}
                            </h1>
                            <p className={`${currentTheme.textSecondary} text-sm mt-1`}>{user.email}</p>

                            {/* XP Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={currentTheme.textSecondary}>XP Progress</span>
                                    <span className={currentTheme.text}>{user.xp} / {xpForNext}</span>
                                </div>
                                <div className={`h-3 rounded-full ${theme === 'tron' ? 'bg-gray-800' : theme === 'kids' ? 'bg-purple-200' : 'bg-gray-800'} overflow-hidden`}>
                                    <div
                                        className={`h-full rounded-full ${theme === 'tron' ? 'bg-cyan-500' : theme === 'kids' ? 'bg-purple-500' : 'bg-orange-500'} transition-all`}
                                        style={{ width: `${xpProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => navigateTo('editProfile')}
                            className={`${theme === 'tron' ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30' : theme === 'kids' ? 'bg-purple-100 hover:bg-purple-200 text-purple-600 border-2 border-purple-300' : 'bg-orange-900/40 hover:bg-orange-900/60 text-orange-400 border border-orange-700'} p-3 rounded-xl transition-all`}
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-2xl p-4 text-center ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <Gamepad2 className={`w-8 h-8 mx-auto mb-2 ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-500' : 'text-orange-400'}`} />
                        <div className={`text-2xl font-black ${currentTheme.text}`}>{user.stats?.gamesPlayed || 0}</div>
                        <div className={`text-xs ${currentTheme.textSecondary}`}>Games Played</div>
                    </div>

                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-2xl p-4 text-center ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <Trophy className={`w-8 h-8 mx-auto mb-2 ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-500' : 'text-yellow-500'}`} />
                        <div className={`text-2xl font-black ${currentTheme.text}`}>{user.stats?.wins || 0}</div>
                        <div className={`text-xs ${currentTheme.textSecondary}`}>Wins</div>
                    </div>

                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-2xl p-4 text-center ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <Star className={`w-8 h-8 mx-auto mb-2 ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-pink-500' : 'text-orange-400'}`} filled />
                        <div className={`text-2xl font-black ${currentTheme.text}`}>{user.stats?.totalPoints || 0}</div>
                        <div className={`text-xs ${currentTheme.textSecondary}`}>Total Points</div>
                    </div>

                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-2xl p-4 text-center ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <Clock className={`w-8 h-8 mx-auto mb-2 ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-green-500' : 'text-orange-400'}`} />
                        <div className={`text-2xl font-black ${currentTheme.text}`}>{user.stats?.bestStreak || 0}</div>
                        <div className={`text-xs ${currentTheme.textSecondary}`}>Best Streak</div>
                    </div>
                </div>

                {/* Medals Section */}
                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                    <h2 className={`text-xl font-bold ${currentTheme.text} mb-4 flex items-center gap-2 ${currentTheme.font}`}>
                        <Medal className="w-6 h-6" />
                        {theme === 'tron' ? '> MEDALS' : 'Medals'}
                    </h2>

                    {user.medals && user.medals.length > 0 ? (
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                            {user.medals.map((medal, idx) => (
                                <div
                                    key={idx}
                                    className={`aspect-square ${theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/30' : theme === 'kids' ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-orange-900/20 border border-orange-700/50'} rounded-xl flex items-center justify-center`}
                                    title={medal.medalId}
                                >
                                    <span className="text-3xl">🏅</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={`${currentTheme.textSecondary} text-center py-8`}>
                            No medals yet. Keep playing to earn some!
                        </p>
                    )}
                </div>

                {/* Favorite Game */}
                {user.stats?.favoriteGame && (
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <h2 className={`text-xl font-bold ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                            {theme === 'tron' ? '> FAVORITE_GAME' : 'Favorite Game'}
                        </h2>
                        <p className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'} text-lg font-semibold`}>
                            {user.stats.favoriteGame}
                        </p>
                    </div>
                )}

                {/* Member Since */}
                <div className={`text-center ${currentTheme.textSecondary} text-sm`}>
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
