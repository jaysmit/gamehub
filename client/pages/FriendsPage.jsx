import React, { useState } from 'react';
import { Search, UserPlus, UserX, Check, X, Clock, Circle, Gamepad2 } from '../icons/UIIcons';
import CharacterSVG from '../icons/CharacterSVGs';

function FriendsPage({
    theme,
    currentTheme,
    user,
    friends,
    friendsStatus,
    pendingRequests,
    onSendRequest,
    onAcceptRequest,
    onRejectRequest,
    onRemoveFriend,
    onSearchUsers,
    navigateTo,
    availableCharacters
}) {
    const [activeTab, setActiveTab] = useState('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');

    if (!user) {
        return (
            <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} flex items-center justify-center p-4 pt-24`}>
                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-8 text-center ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                    <p className={`${currentTheme.text} mb-4`}>Please log in to view friends</p>
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

    const handleSearch = async () => {
        if (searchQuery.length < 2) return;
        setIsSearching(true);
        setError('');

        try {
            const results = await onSearchUsers(searchQuery);
            setSearchResults(results.filter(u => u._id !== user._id && u.id !== user._id));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSendRequest = async (userId) => {
        try {
            await onSendRequest(userId);
            setSearchResults(prev => prev.filter(u => u._id !== userId && u.id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return theme === 'tron' ? 'bg-green-400' : theme === 'kids' ? 'bg-green-500' : 'bg-green-500';
            case 'inRoom': return theme === 'tron' ? 'bg-yellow-400' : theme === 'kids' ? 'bg-yellow-500' : 'bg-yellow-500';
            case 'inGame': return theme === 'tron' ? 'bg-purple-400' : theme === 'kids' ? 'bg-pink-500' : 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'online': return 'Online';
            case 'inRoom': return 'In Lobby';
            case 'inGame': return 'Playing';
            default: return 'Offline';
        }
    };

    const friendsWithStatus = friends.map(f => ({
        ...f,
        ...(friendsStatus[f.id] || { status: 'offline', roomId: null })
    })).sort((a, b) => {
        const order = { inGame: 0, inRoom: 1, online: 2, offline: 3 };
        return (order[a.status] || 3) - (order[b.status] || 3);
    });

    const pendingCount = (pendingRequests?.incoming?.length || 0);

    return (
        <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} p-4 pt-24 pb-8`}>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <h1 className={`text-2xl md:text-3xl font-black ${currentTheme.text} mb-6 ${currentTheme.font}`}>
                    {theme === 'tron' ? '> FRIENDS' : 'Friends'}
                </h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {['friends', 'pending', 'add'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all relative ${
                                activeTab === tab
                                    ? (theme === 'tron' ? 'bg-cyan-500 text-black' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-600 text-white')
                                    : (theme === 'tron' ? 'bg-gray-800 text-cyan-400 hover:bg-gray-700' : theme === 'kids' ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' : 'bg-gray-800 text-orange-400 hover:bg-gray-700')
                            }`}
                        >
                            {tab === 'friends' && 'Friends'}
                            {tab === 'pending' && (
                                <>
                                    Pending
                                    {pendingCount > 0 && (
                                        <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${theme === 'tron' ? 'bg-red-500 text-white' : theme === 'kids' ? 'bg-red-400 text-white' : 'bg-red-600 text-white'}`}>
                                            {pendingCount}
                                        </span>
                                    )}
                                </>
                            )}
                            {tab === 'add' && 'Add'}
                        </button>
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className={`mb-4 p-3 rounded-lg ${theme === 'tron' ? 'bg-red-500/20 border border-red-500/50 text-red-400' : theme === 'kids' ? 'bg-red-100 border-2 border-red-300 text-red-600' : 'bg-red-900/40 border border-red-700 text-red-400'}`}>
                        {error}
                    </div>
                )}

                {/* Friends Tab */}
                {activeTab === 'friends' && (
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        {friendsWithStatus.length === 0 ? (
                            <div className="text-center py-12">
                                <p className={`${currentTheme.textSecondary} mb-4`}>You haven't added any friends yet</p>
                                <button
                                    onClick={() => setActiveTab('add')}
                                    className={`${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-2 px-6 rounded-xl transition-all`}
                                >
                                    Find Friends
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {friendsWithStatus.map((friend) => {
                                    const char = availableCharacters.find(c => c.id === friend.avatar) || availableCharacters[0];
                                    return (
                                        <div
                                            key={friend.id}
                                            className={`flex items-center gap-4 p-3 rounded-xl ${theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/20' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-200' : 'bg-orange-900/20 border border-orange-700/30'}`}
                                        >
                                            {/* Avatar with Status */}
                                            <div className="relative">
                                                <div className={`w-12 h-12 ${theme === 'tron' ? 'bg-cyan-500/20' : theme === 'kids' ? 'bg-purple-200' : 'bg-orange-900/40'} rounded-full flex items-center justify-center`}>
                                                    <CharacterSVG characterId={friend.avatar} size={36} color={char.color} />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${theme === 'tron' ? 'border-gray-900' : theme === 'kids' ? 'border-purple-100' : 'border-gray-900'} ${getStatusColor(friend.status)}`} />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className={`font-bold ${currentTheme.text}`}>{friend.name}</div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs ${currentTheme.textSecondary}`}>{getStatusText(friend.status)}</span>
                                                    {friend.status === 'inGame' && <Gamepad2 className="w-3 h-3" />}
                                                </div>
                                            </div>

                                            {/* Level */}
                                            <div className={`px-2 py-1 rounded-lg ${theme === 'tron' ? 'bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 text-purple-600' : 'bg-orange-900/40 text-orange-400'} text-xs font-bold`}>
                                                Lvl {friend.level || 1}
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => onRemoveFriend(friend.id)}
                                                className={`p-2 rounded-lg ${theme === 'tron' ? 'hover:bg-red-500/20 text-red-400' : theme === 'kids' ? 'hover:bg-red-100 text-red-500' : 'hover:bg-red-900/30 text-red-400'} transition-all`}
                                                title="Remove friend"
                                            >
                                                <UserX className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Pending Tab */}
                {activeTab === 'pending' && (
                    <div className="space-y-6">
                        {/* Incoming Requests */}
                        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                            <h2 className={`text-lg font-bold ${currentTheme.text} mb-4`}>Incoming Requests</h2>
                            {pendingRequests?.incoming?.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingRequests.incoming.map((req) => {
                                        const char = availableCharacters.find(c => c.id === req.user.avatar) || availableCharacters[0];
                                        return (
                                            <div
                                                key={req.requestId}
                                                className={`flex items-center gap-4 p-3 rounded-xl ${theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/20' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-200' : 'bg-orange-900/20 border border-orange-700/30'}`}
                                            >
                                                <div className={`w-10 h-10 ${theme === 'tron' ? 'bg-cyan-500/20' : theme === 'kids' ? 'bg-purple-200' : 'bg-orange-900/40'} rounded-full flex items-center justify-center`}>
                                                    <CharacterSVG characterId={req.user.avatar} size={30} color={char.color} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-bold ${currentTheme.text}`}>{req.user.name}</div>
                                                    <div className={`text-xs ${currentTheme.textSecondary}`}>Level {req.user.level || 1}</div>
                                                </div>
                                                <button
                                                    onClick={() => onAcceptRequest(req.requestId)}
                                                    className={`p-2 rounded-lg ${theme === 'tron' ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' : theme === 'kids' ? 'bg-green-100 hover:bg-green-200 text-green-600' : 'bg-green-900/30 hover:bg-green-900/40 text-green-400'} transition-all`}
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => onRejectRequest(req.requestId)}
                                                    className={`p-2 rounded-lg ${theme === 'tron' ? 'hover:bg-red-500/20 text-red-400' : theme === 'kids' ? 'hover:bg-red-100 text-red-500' : 'hover:bg-red-900/30 text-red-400'} transition-all`}
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className={`${currentTheme.textSecondary} text-center py-4`}>No incoming requests</p>
                            )}
                        </div>

                        {/* Outgoing Requests */}
                        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                            <h2 className={`text-lg font-bold ${currentTheme.text} mb-4`}>Sent Requests</h2>
                            {pendingRequests?.outgoing?.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingRequests.outgoing.map((req) => {
                                        const char = availableCharacters.find(c => c.id === req.user.avatar) || availableCharacters[0];
                                        return (
                                            <div
                                                key={req.requestId}
                                                className={`flex items-center gap-4 p-3 rounded-xl ${theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/20' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-200' : 'bg-orange-900/20 border border-orange-700/30'}`}
                                            >
                                                <div className={`w-10 h-10 ${theme === 'tron' ? 'bg-cyan-500/20' : theme === 'kids' ? 'bg-purple-200' : 'bg-orange-900/40'} rounded-full flex items-center justify-center`}>
                                                    <CharacterSVG characterId={req.user.avatar} size={30} color={char.color} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-bold ${currentTheme.text}`}>{req.user.name}</div>
                                                    <div className={`text-xs ${currentTheme.textSecondary} flex items-center gap-1`}>
                                                        <Clock className="w-3 h-3" /> Pending
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className={`${currentTheme.textSecondary} text-center py-4`}>No sent requests</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Add Friends Tab */}
                {activeTab === 'add' && (
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        {/* Search Input */}
                        <div className="flex gap-2 mb-6">
                            <div className="relative flex-1">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary}`} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Search by username..."
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl ${theme === 'tron' ? 'bg-gray-900 text-cyan-400 border border-cyan-500/30 focus:border-cyan-400' : theme === 'kids' ? 'bg-white text-purple-900 border-2 border-purple-300 focus:border-purple-500' : 'bg-gray-900 text-orange-400 border border-orange-700/50 focus:border-orange-500'} focus:outline-none`}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={searchQuery.length < 2 || isSearching}
                                className={`${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold px-6 rounded-xl transition-all disabled:opacity-50`}
                            >
                                {isSearching ? '...' : 'Search'}
                            </button>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 ? (
                            <div className="space-y-3">
                                {searchResults.map((result) => {
                                    const char = availableCharacters.find(c => c.id === result.avatar) || availableCharacters[0];
                                    const userId = result._id || result.id;
                                    return (
                                        <div
                                            key={userId}
                                            className={`flex items-center gap-4 p-3 rounded-xl ${theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/20' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-200' : 'bg-orange-900/20 border border-orange-700/30'}`}
                                        >
                                            <div className={`w-10 h-10 ${theme === 'tron' ? 'bg-cyan-500/20' : theme === 'kids' ? 'bg-purple-200' : 'bg-orange-900/40'} rounded-full flex items-center justify-center`}>
                                                <CharacterSVG characterId={result.avatar} size={30} color={char.color} />
                                            </div>
                                            <div className="flex-1">
                                                <div className={`font-bold ${currentTheme.text}`}>{result.name}</div>
                                                <div className={`text-xs ${currentTheme.textSecondary}`}>Level {result.level || 1}</div>
                                            </div>
                                            <button
                                                onClick={() => handleSendRequest(userId)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-600 hover:bg-orange-500 text-white'} font-bold transition-all`}
                                            >
                                                <UserPlus className="w-4 h-4" />
                                                Add
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : searchQuery && !isSearching ? (
                            <p className={`${currentTheme.textSecondary} text-center py-8`}>No users found</p>
                        ) : (
                            <p className={`${currentTheme.textSecondary} text-center py-8`}>Search for users to add as friends</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FriendsPage;
