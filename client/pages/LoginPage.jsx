import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from '../icons/UIIcons';

function LoginPage({
    theme,
    currentTheme,
    onLogin,
    onRegister,
    onGoogleLogin,
    onDiscordLogin,
    navigateTo,
    error: externalError
}) {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isRegister) {
                if (!username.trim()) {
                    setError('Username is required');
                    setIsLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setIsLoading(false);
                    return;
                }
                // Email is optional for registration
                await onRegister(username.trim(), email.trim() || null, password);
            } else {
                // Login with username
                await onLogin(username.trim(), password);
            }
            navigateTo('landing');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const displayError = error || externalError;

    return (
        <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} flex items-center justify-center p-4 pt-24`}>
            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-md w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400 kids-shadow' : 'border-4 border-orange-700'}`}>
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className={`text-2xl md:text-3xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                        {isRegister ? (theme === 'tron' ? '> CREATE_ACCOUNT' : 'Create Account') : (theme === 'tron' ? '> LOGIN' : 'Welcome Back')}
                    </h1>
                    <p className={`${currentTheme.textSecondary} text-sm`}>
                        {isRegister ? 'Join GameHub and start playing!' : 'Sign in to continue playing'}
                    </p>
                </div>

                {/* Error Message */}
                {displayError && (
                    <div className={`mb-4 p-3 rounded-lg ${theme === 'tron' ? 'bg-red-500/20 border border-red-500/50 text-red-400' : theme === 'kids' ? 'bg-red-100 border-2 border-red-300 text-red-600' : 'bg-red-900/40 border border-red-700 text-red-400'}`}>
                        <p className="text-sm font-medium">{displayError}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username field - always shown */}
                    <div>
                        <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>Username</label>
                        <div className="relative">
                            <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary}`} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder={isRegister ? "Choose a username" : "Enter your username"}
                                required
                                className={`w-full pl-10 pr-4 py-3 rounded-xl ${theme === 'tron' ? 'bg-gray-900 text-cyan-400 border border-cyan-500/30 focus:border-cyan-400' : theme === 'kids' ? 'bg-white text-purple-900 border-2 border-purple-300 focus:border-purple-500' : 'bg-gray-900 text-orange-400 border border-orange-700/50 focus:border-orange-500'} focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400/50' : theme === 'kids' ? 'focus:ring-purple-400/50' : 'focus:ring-orange-500/50'}`}
                            />
                        </div>
                    </div>

                    {/* Email field - only shown during registration and optional */}
                    {isRegister && (
                        <div>
                            <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>
                                Email <span className={`${currentTheme.textSecondary} font-normal`}>(optional)</span>
                            </label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary}`} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email (optional)"
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl ${theme === 'tron' ? 'bg-gray-900 text-cyan-400 border border-cyan-500/30 focus:border-cyan-400' : theme === 'kids' ? 'bg-white text-purple-900 border-2 border-purple-300 focus:border-purple-500' : 'bg-gray-900 text-orange-400 border border-orange-700/50 focus:border-orange-500'} focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400/50' : theme === 'kids' ? 'focus:ring-purple-400/50' : 'focus:ring-orange-500/50'}`}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className={`block text-sm font-medium ${currentTheme.text} mb-1`}>Password</label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary}`} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isRegister ? 'Create a password (min 6 chars)' : 'Enter your password'}
                                required
                                className={`w-full pl-10 pr-12 py-3 rounded-xl ${theme === 'tron' ? 'bg-gray-900 text-cyan-400 border border-cyan-500/30 focus:border-cyan-400' : theme === 'kids' ? 'bg-white text-purple-900 border-2 border-purple-300 focus:border-purple-500' : 'bg-gray-900 text-orange-400 border border-orange-700/50 focus:border-orange-500'} focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400/50' : theme === 'kids' ? 'focus:ring-purple-400/50' : 'focus:ring-orange-500/50'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.textSecondary} hover:${currentTheme.text}`}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className={`absolute inset-0 flex items-center`}>
                        <div className={`w-full border-t ${theme === 'tron' ? 'border-cyan-500/30' : theme === 'kids' ? 'border-purple-300' : 'border-orange-700/50'}`}></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className={`px-2 ${theme === 'tron' ? 'bg-gray-900/80' : theme === 'kids' ? 'bg-purple-50' : 'bg-gray-900/80'} ${currentTheme.textSecondary}`}>
                            or continue with
                        </span>
                    </div>
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onGoogleLogin}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-500/30' : theme === 'kids' ? 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-purple-300' : 'bg-gray-800 hover:bg-gray-700 text-orange-400 border border-orange-700/50'} font-medium transition-all`}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                    </button>

                    <button
                        onClick={onDiscordLogin}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-500/30' : theme === 'kids' ? 'bg-indigo-500 hover:bg-indigo-400 text-white border-2 border-indigo-400' : 'bg-gray-800 hover:bg-gray-700 text-orange-400 border border-orange-700/50'} font-medium transition-all`}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                        </svg>
                        Discord
                    </button>
                </div>

                {/* Switch Mode */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                        }}
                        className={`${currentTheme.textSecondary} hover:${currentTheme.text} text-sm font-medium transition-colors`}
                    >
                        {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                    </button>
                </div>

                {/* Continue as Guest */}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigateTo('landing')}
                        className={`${theme === 'tron' ? 'text-cyan-400/60 hover:text-cyan-400' : theme === 'kids' ? 'text-purple-400 hover:text-purple-600' : 'text-orange-400/60 hover:text-orange-400'} text-sm font-medium transition-colors`}
                    >
                        Continue as guest
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
