import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Bell, BellOff, Users, Shield, Check } from '../icons/UIIcons';

function SettingsPage({
    theme,
    currentTheme,
    user,
    onSaveSettings,
    navigateTo
}) {
    const [settings, setSettings] = useState({
        soundEnabled: user?.settings?.soundEnabled ?? true,
        musicVolume: user?.settings?.musicVolume ?? 50,
        notificationsEnabled: user?.settings?.notificationsEnabled ?? true,
        friendRequestsEnabled: user?.settings?.friendRequestsEnabled ?? true
    });
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!user) {
        return (
            <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} flex items-center justify-center p-4 pt-24`}>
                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-8 text-center ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                    <p className={`${currentTheme.text} mb-4`}>Please log in to access settings</p>
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

    const handleSave = async () => {
        setError('');
        setIsLoading(true);

        try {
            await onSaveSettings(settings);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const ToggleSwitch = ({ enabled, onChange }) => (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-14 h-8 rounded-full transition-all ${
                enabled
                    ? (theme === 'tron' ? 'bg-cyan-500' : theme === 'kids' ? 'bg-purple-500' : 'bg-orange-500')
                    : (theme === 'tron' ? 'bg-gray-700' : theme === 'kids' ? 'bg-gray-300' : 'bg-gray-700')
            }`}
        >
            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${enabled ? 'left-7' : 'left-1'}`} />
        </button>
    );

    return (
        <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} p-4 pt-24 pb-8`}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigateTo('landing')}
                        className={`${theme === 'tron' ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-purple-100 hover:bg-purple-200 text-purple-600' : 'bg-orange-900/40 hover:bg-orange-900/60 text-orange-400'} p-2 rounded-xl transition-all`}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className={`text-2xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                        {theme === 'tron' ? '> SETTINGS' : 'Settings'}
                    </h1>
                </div>

                {/* Success Message */}
                {success && (
                    <div className={`mb-6 p-4 rounded-xl ${theme === 'tron' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : theme === 'kids' ? 'bg-green-100 border-2 border-green-300 text-green-600' : 'bg-green-900/40 border border-green-700 text-green-400'} flex items-center gap-2`}>
                        <Check className="w-5 h-5" />
                        Settings saved successfully!
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className={`mb-6 p-4 rounded-xl ${theme === 'tron' ? 'bg-red-500/20 border border-red-500/50 text-red-400' : theme === 'kids' ? 'bg-red-100 border-2 border-red-300 text-red-600' : 'bg-red-900/40 border border-red-700 text-red-400'}`}>
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Sound Settings */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <h2 className={`text-lg font-bold ${currentTheme.text} mb-4 flex items-center gap-2`}>
                            {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                            Sound
                        </h2>

                        {/* Sound Toggle */}
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <div className={`font-medium ${currentTheme.text}`}>Sound Effects</div>
                                <div className={`text-sm ${currentTheme.textSecondary}`}>Play sounds for game events</div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.soundEnabled}
                                onChange={(v) => setSettings(prev => ({ ...prev, soundEnabled: v }))}
                            />
                        </div>

                        {/* Volume Slider */}
                        <div className="py-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`font-medium ${currentTheme.text}`}>Music Volume</div>
                                <span className={`text-sm ${currentTheme.textSecondary}`}>{settings.musicVolume}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.musicVolume}
                                onChange={(e) => setSettings(prev => ({ ...prev, musicVolume: parseInt(e.target.value) }))}
                                className={`w-full h-2 rounded-full appearance-none cursor-pointer ${theme === 'tron' ? 'bg-gray-700' : theme === 'kids' ? 'bg-purple-200' : 'bg-gray-700'}`}
                                style={{
                                    background: `linear-gradient(to right, ${theme === 'tron' ? '#22d3ee' : theme === 'kids' ? '#a855f7' : '#ea580c'} 0%, ${theme === 'tron' ? '#22d3ee' : theme === 'kids' ? '#a855f7' : '#ea580c'} ${settings.musicVolume}%, ${theme === 'tron' ? '#374151' : theme === 'kids' ? '#e9d5ff' : '#374151'} ${settings.musicVolume}%, ${theme === 'tron' ? '#374151' : theme === 'kids' ? '#e9d5ff' : '#374151'} 100%)`
                                }}
                            />
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <h2 className={`text-lg font-bold ${currentTheme.text} mb-4 flex items-center gap-2`}>
                            {settings.notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                            Notifications
                        </h2>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <div className={`font-medium ${currentTheme.text}`}>Enable Notifications</div>
                                <div className={`text-sm ${currentTheme.textSecondary}`}>Receive game invites and friend alerts</div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.notificationsEnabled}
                                onChange={(v) => setSettings(prev => ({ ...prev, notificationsEnabled: v }))}
                            />
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-300' : 'border border-orange-700/50'}`}>
                        <h2 className={`text-lg font-bold ${currentTheme.text} mb-4 flex items-center gap-2`}>
                            <Shield className="w-5 h-5" />
                            Privacy
                        </h2>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <div className={`font-medium ${currentTheme.text}`}>Friend Requests</div>
                                <div className={`text-sm ${currentTheme.textSecondary}`}>Allow others to send you friend requests</div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.friendRequestsEnabled}
                                onChange={(v) => setSettings(prev => ({ ...prev, friendRequestsEnabled: v }))}
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-4 rounded-xl transition-all disabled:opacity-50 text-lg`}
                    >
                        {isLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
