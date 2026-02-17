import React, { useState } from 'react';
import { X, Check } from '../icons/UIIcons';
import { GAME_DEFAULTS } from '../data/games';
import { TRIVIA_THEMES } from '../data/triviaQuestions';

function GameSettingsModal({
    theme,
    currentTheme,
    gameSettingsModal,
    onSave,
    onRemove,
    onClose
}) {
    const { gameId, game, config: initialConfig, isEditing } = gameSettingsModal;
    const [config, setConfig] = useState(initialConfig);

    const handleSave = () => {
        onSave(gameId, config);
    };

    const handleRemove = () => {
        onRemove(gameId);
    };

    // Drawing Game Settings
    const renderPictionarySettings = () => {
        const timeOptions = GAME_DEFAULTS.pictionary.drawerTimeOptions;
        return (
            <div className="space-y-4">
                <div>
                    <label className={`block ${currentTheme.textSecondary} text-sm font-semibold mb-3`}>
                        Time per drawer
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {timeOptions.map(seconds => (
                            <button
                                key={seconds}
                                onClick={() => setConfig({ ...config, drawerTime: seconds })}
                                className={`py-3 px-4 rounded-xl font-bold text-lg transition-all ${
                                    config.drawerTime === seconds
                                        ? (theme === 'tron'
                                            ? 'bg-cyan-500 text-black'
                                            : theme === 'kids'
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-orange-500 text-white')
                                        : (theme === 'tron'
                                            ? 'bg-gray-800 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
                                            : theme === 'kids'
                                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                : 'bg-gray-800 text-orange-400 border border-orange-700/50 hover:bg-orange-900/30')
                                }`}
                            >
                                {seconds}s
                            </button>
                        ))}
                    </div>
                    <p className={`mt-2 text-xs ${currentTheme.textSecondary}`}>
                        How long each player has to draw their word
                    </p>
                </div>
            </div>
        );
    };

    // Trivia Game Settings
    const renderTriviaSettings = () => {
        const themes = Object.entries(TRIVIA_THEMES);
        const selectedThemes = config.themes || ['all'];
        const isAllSelected = selectedThemes.includes('all');

        const toggleTheme = (themeId) => {
            if (themeId === 'all') {
                setConfig({ ...config, themes: ['all'] });
                return;
            }

            let newThemes;
            if (isAllSelected) {
                // Switching from 'all' to specific theme
                newThemes = [themeId];
            } else if (selectedThemes.includes(themeId)) {
                // Deselecting a theme
                newThemes = selectedThemes.filter(t => t !== themeId);
                if (newThemes.length === 0) {
                    newThemes = ['all']; // Can't have no themes
                }
            } else {
                // Adding a theme
                newThemes = [...selectedThemes, themeId];
            }
            setConfig({ ...config, themes: newThemes });
        };

        return (
            <div className="space-y-4">
                <div>
                    <label className={`block ${currentTheme.textSecondary} text-sm font-semibold mb-3`}>
                        Question Categories
                    </label>

                    {/* All Categories Option */}
                    <button
                        onClick={() => toggleTheme('all')}
                        className={`w-full mb-3 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-between ${
                            isAllSelected
                                ? (theme === 'tron'
                                    ? 'bg-cyan-500 text-black'
                                    : theme === 'kids'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-orange-500 text-white')
                                : (theme === 'tron'
                                    ? 'bg-gray-800 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
                                    : theme === 'kids'
                                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                        : 'bg-gray-800 text-orange-400 border border-orange-700/50 hover:bg-orange-900/30')
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-xl">🎲</span>
                            <span>All Categories</span>
                        </span>
                        {isAllSelected && <Check className="w-5 h-5" />}
                    </button>

                    {/* Individual Theme Options */}
                    <div className="grid grid-cols-1 gap-2">
                        {themes.map(([themeId, themeData]) => {
                            const isSelected = !isAllSelected && selectedThemes.includes(themeId);
                            return (
                                <button
                                    key={themeId}
                                    onClick={() => toggleTheme(themeId)}
                                    className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-between ${
                                        isSelected
                                            ? (theme === 'tron'
                                                ? 'bg-cyan-500 text-black'
                                                : theme === 'kids'
                                                    ? 'bg-purple-500 text-white'
                                                    : 'bg-orange-500 text-white')
                                            : (theme === 'tron'
                                                ? 'bg-gray-800 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
                                                : theme === 'kids'
                                                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                    : 'bg-gray-800 text-orange-400 border border-orange-700/50 hover:bg-orange-900/30')
                                    } ${isAllSelected ? 'opacity-50' : ''}`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl">{themeData.icon}</span>
                                        <span className="flex flex-col items-start">
                                            <span>{themeData.name}</span>
                                            <span className={`text-xs font-normal ${isSelected ? 'opacity-80' : currentTheme.textSecondary}`}>
                                                {themeData.description}
                                            </span>
                                        </span>
                                    </span>
                                    {isSelected && <Check className="w-5 h-5" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Quick Math Settings (minimal for now)
    const renderQuickMathSettings = () => {
        return (
            <div className="text-center py-4">
                <p className={`${currentTheme.textSecondary}`}>
                    Quick Math uses default settings.
                </p>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                {/* Header */}
                <div className={`p-4 border-b ${theme === 'tron' ? 'border-cyan-500/30' : theme === 'kids' ? 'border-purple-300' : 'border-orange-700/50'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{game.icon}</span>
                            <div>
                                <h2 className={`text-lg font-bold ${currentTheme.text} ${currentTheme.font}`}>
                                    {game.name}
                                </h2>
                                <p className={`text-xs ${currentTheme.textSecondary}`}>
                                    {isEditing ? 'Edit settings' : 'Configure game'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-lg transition-all ${theme === 'tron' ? 'hover:bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'hover:bg-purple-200 text-purple-600' : 'hover:bg-orange-900/50 text-orange-400'}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {game.gameType === 'pictionary' && renderPictionarySettings()}
                    {game.gameType === 'trivia' && renderTriviaSettings()}
                    {game.gameType === 'quickmath' && renderQuickMathSettings()}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t ${theme === 'tron' ? 'border-cyan-500/30' : theme === 'kids' ? 'border-purple-300' : 'border-orange-700/50'}`}>
                    <div className="flex gap-3">
                        {isEditing && (
                            <button
                                onClick={handleRemove}
                                className={`px-4 py-3 rounded-xl font-bold transition-all ${
                                    theme === 'tron'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                                        : theme === 'kids'
                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                            : 'bg-red-900/30 text-red-400 border border-red-700/50 hover:bg-red-900/50'
                                }`}
                            >
                                Remove
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                                theme === 'tron'
                                    ? 'bg-gray-800 text-cyan-400 hover:bg-gray-700'
                                    : theme === 'kids'
                                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                        : 'bg-gray-800 text-orange-400 hover:bg-gray-700'
                            }`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                                theme === 'tron'
                                    ? 'bg-cyan-500 text-black hover:bg-cyan-400'
                                    : theme === 'kids'
                                        ? 'bg-purple-500 text-white hover:bg-purple-400'
                                        : 'bg-orange-500 text-white hover:bg-orange-400'
                            }`}
                        >
                            {isEditing ? 'Save' : 'Add to Queue'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameSettingsModal;
