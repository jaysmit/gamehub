import React, { useState } from 'react';
import { ArrowLeft, Check } from '../icons/UIIcons';
import CharacterSVG from '../icons/CharacterSVGs';

function EditProfilePage({
    theme,
    currentTheme,
    user,
    onSave,
    navigateTo,
    availableCharacters
}) {
    const [name, setName] = useState(user?.name || '');
    const [avatar, setAvatar] = useState(user?.avatar || 'cyber-knight');
    const [selectedTheme, setSelectedTheme] = useState(user?.theme || 'tron');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!user) {
        return (
            <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} flex items-center justify-center p-4 pt-24`}>
                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-8 text-center ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                    <p className={`${currentTheme.text} mb-4`}>Please log in to edit your profile</p>
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await onSave({ name: name.trim(), avatar, theme: selectedTheme });
            setSuccess(true);
            setTimeout(() => navigateTo('profile'), 1000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedChar = availableCharacters.find(c => c.id === avatar) || availableCharacters[0];

    return (
        <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} p-4 pt-24 pb-8`}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigateTo('profile')}
                        className={`${theme === 'tron' ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-purple-100 hover:bg-purple-200 text-purple-600' : 'bg-orange-900/40 hover:bg-orange-900/60 text-orange-400'} p-2 rounded-xl transition-all`}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className={`text-2xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                        {theme === 'tron' ? '> EDIT_PROFILE' : 'Edit Profile'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Success Message */}
                    {success && (
                        <div className={`p-4 rounded-xl ${theme === 'tron' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : theme === 'kids' ? 'bg-green-100 border-2 border-green-300 text-green-600' : 'bg-green-900/40 border border-green-700 text-green-400'} flex items-center gap-2`}>
                            <Check className="w-5 h-5" />
                            Profile updated successfully!
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className={`p-4 rounded-xl ${theme === 'tron' ? 'bg-red-500/20 border border-red-500/50 text-red-400' : theme === 'kids' ? 'bg-red-100 border-2 border-red-300 text-red-600' : 'bg-red-900/40 border border-red-700 text-red-400'}`}>
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <label className={`block text-sm font-bold ${currentTheme.text} mb-2`}>Username</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-xl ${theme === 'tron' ? 'bg-gray-900 text-cyan-400 border border-cyan-500/30 focus:border-cyan-400' : theme === 'kids' ? 'bg-white text-purple-900 border-2 border-purple-300 focus:border-purple-500' : 'bg-gray-900 text-orange-400 border border-orange-700/50 focus:border-orange-500'} focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400/50' : theme === 'kids' ? 'focus:ring-purple-400/50' : 'focus:ring-orange-500/50'}`}
                        />
                    </div>

                    {/* Avatar Selection */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <label className={`block text-sm font-bold ${currentTheme.text} mb-4`}>Avatar</label>

                        {/* Current Avatar Preview */}
                        <div className="flex justify-center mb-4">
                            <div className={`w-24 h-24 ${theme === 'tron' ? 'bg-cyan-500/20 border-2 border-cyan-400' : theme === 'kids' ? 'bg-purple-200 border-4 border-purple-400' : 'bg-orange-900/40 border-2 border-orange-600'} rounded-full flex items-center justify-center`}>
                                <CharacterSVG characterId={avatar} size={72} color={selectedChar.color} />
                            </div>
                        </div>

                        {/* Avatar Grid */}
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                            {availableCharacters.slice(0, 12).map((char) => {
                                const isSelected = avatar === char.id;
                                const isUnlocked = user.unlockedCharacters?.includes(char.id) || ['cyber-knight', 'neon-ninja', 'pixel-punk'].includes(char.id);

                                return (
                                    <button
                                        key={char.id}
                                        type="button"
                                        disabled={!isUnlocked}
                                        onClick={() => isUnlocked && setAvatar(char.id)}
                                        className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                                            isSelected
                                                ? (theme === 'tron' ? 'bg-cyan-500/30 border-2 border-cyan-400 ring-2 ring-cyan-400' : theme === 'kids' ? 'bg-purple-200 border-2 border-purple-500 ring-2 ring-purple-400' : 'bg-orange-600/40 border-2 border-orange-500 ring-2 ring-orange-400')
                                                : isUnlocked
                                                    ? (theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-200 hover:bg-purple-200' : 'bg-orange-900/20 border border-orange-700/50 hover:bg-orange-900/30')
                                                    : 'bg-gray-800/50 border border-gray-700 opacity-50 cursor-not-allowed'
                                        }`}
                                    >
                                        <CharacterSVG characterId={char.id} size={40} color={isUnlocked ? char.color : '#666'} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Theme Selection */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <label className={`block text-sm font-bold ${currentTheme.text} mb-4`}>Default Theme</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'tron', name: 'Tron', color: 'cyan' },
                                { id: 'kids', name: 'Kids', color: 'purple' },
                                { id: 'scary', name: 'Scary', color: 'orange' }
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setSelectedTheme(t.id)}
                                    className={`py-3 px-4 rounded-xl font-bold transition-all ${
                                        selectedTheme === t.id
                                            ? (t.id === 'tron' ? 'bg-cyan-500 text-black' : t.id === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-600 text-white')
                                            : (theme === 'tron' ? 'bg-gray-800 text-cyan-400 border border-cyan-500/30 hover:bg-gray-700' : theme === 'kids' ? 'bg-purple-100 text-purple-600 border-2 border-purple-200 hover:bg-purple-200' : 'bg-gray-800 text-orange-400 border border-orange-700/50 hover:bg-gray-700')
                                    }`}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg`}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProfilePage;
