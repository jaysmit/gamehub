import React from 'react';
import { DaftPunkRobotHead, DaftPunkHelmet, WerewolfHowlingIcon } from '../icons/ThemeLogos';

function RejoiningPage({ theme, currentTheme }) {
    return (
        <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} flex flex-col items-center justify-center p-4`} style={{ minHeight: '100dvh' }}>
            <div className={`text-center`}>
                <div className={`inline-block p-4 md:p-6 ${theme === 'tron' ? 'bg-cyan-500/10 tron-border' : theme === 'kids' ? 'bg-white kids-shadow' : 'bg-orange-900/40 border-4 border-orange-700'} rounded-2xl md:rounded-3xl mb-6`}>
                    {theme === 'tron' ? (
                        <DaftPunkRobotHead className="w-16 h-16 md:w-24 md:h-24 text-cyan-400" />
                    ) : theme === 'kids' ? (
                        <DaftPunkHelmet className="w-16 h-16 md:w-24 md:h-24 text-purple-600" />
                    ) : (
                        <WerewolfHowlingIcon className="w-16 h-16 md:w-24 md:h-24 text-orange-500" />
                    )}
                </div>
                <h2 className={`${currentTheme.text} text-xl md:text-2xl font-bold ${currentTheme.font} mb-3`} style={{ animation: 'softPulse 2s ease-in-out infinite' }}>
                    {theme === 'tron' ? '> RECONNECTING...' : theme === 'kids' ? 'Coming back!' : 'Returning...'}
                </h2>
                <p className={`${currentTheme.textSecondary} text-sm`}>Reconnecting to room...</p>
            </div>
        </div>
    );
}

export default RejoiningPage;
