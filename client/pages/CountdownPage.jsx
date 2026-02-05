import React from 'react';

const CountdownPage = ({ theme, currentTheme, countdown }) => {
    return (
        <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} flex items-center justify-center p-4`} style={{ minHeight: '100dvh' }}>
            <div className={`backdrop-blur-xl ${theme === 'tron' ? 'bg-gray-900/80 border-4 border-cyan-500' : theme === 'kids' ? 'bg-white/80 border-4 border-purple-400' : 'bg-gray-950/80 border-4 border-orange-600'} rounded-3xl p-8 md:p-16 shadow-2xl max-w-lg w-full`}>
                <h2 className={`${theme === 'tron' ? 'text-cyan-400 tron-text-glow' : theme === 'kids' ? 'text-purple-700' : 'text-orange-500'} text-2xl md:text-5xl font-bold mb-6 md:mb-12 animate-pulse ${currentTheme.font} text-center`}>
                    {theme === 'tron' ? '> INITIALIZING...' : theme === 'kids' ? 'Get Ready! 🎮' : 'IT BEGINS... 💀'}
                </h2>
                <div className={`${theme === 'tron' ? 'text-cyan-400 tron-text-glow' : theme === 'kids' ? 'text-purple-700' : 'text-orange-500'} font-black leading-none ${currentTheme.font} text-center text-[8rem] md:text-[15rem]`}>
                    {countdown}
                </div>
            </div>
        </div>
    );
};

export default CountdownPage;
