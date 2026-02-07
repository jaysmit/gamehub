import React, { useEffect, useState } from 'react';
import { CharacterSVG } from '../icons/CharacterSVGs.jsx';

/**
 * WinnerCelebration - Reusable winner celebration modal with confetti and gold coins
 *
 * Props:
 * - winner: { name, avatar, score } - Winner's data
 * - playerName: string - Current player's name (to show "You won!" vs "{name} won!")
 * - gameName: string - Name of the game (e.g., "Quick Math Game", "Trivia Game")
 * - theme: string - Current theme ('tron', 'kids', 'scary')
 * - currentTheme: object - Theme configuration object
 * - availableCharacters: array - Character data for avatar lookup
 * - onDismiss: function - Callback when celebration ends (auto or manual)
 * - autoDismissSeconds: number - Seconds before auto-dismiss (default: 5)
 */
const WinnerCelebration = ({
    winner,
    playerName,
    gameName = 'Game',
    theme,
    currentTheme,
    availableCharacters,
    onDismiss,
    autoDismissSeconds = 5
}) => {
    const [countdown, setCountdown] = useState(autoDismissSeconds);

    // Find winner's character
    const winnerCharacter = availableCharacters?.find(c => c.id === winner?.avatar) || availableCharacters?.[0] || { color: '#06b6d4' };

    // Auto-dismiss after countdown
    useEffect(() => {
        if (countdown <= 0) {
            onDismiss?.();
            return;
        }

        const timer = setTimeout(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, onDismiss]);

    const isWinner = winner?.name === playerName;

    // Generate confetti items with random positions
    const confettiItems = [...Array(25)].map((_, i) => ({
        id: i,
        emoji: ['🎉', '🎊', '⭐', '✨', '🏆'][Math.floor(Math.random() * 5)],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${2 + Math.random() * 2}s`
    }));

    // Generate gold coins with random positions
    const goldCoins = [...Array(15)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2.5}s`,
        duration: `${2.5 + Math.random() * 1.5}s`
    }));

    return (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 animate-fadeIn">
            <div className="text-center p-6 animate-scaleIn relative">
                {/* Confetti effect */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    {confettiItems.map((item) => (
                        <div
                            key={`confetti-${item.id}`}
                            className="absolute text-2xl animate-confetti"
                            style={{
                                left: item.left,
                                animationDelay: item.delay,
                                animationDuration: item.duration
                            }}
                        >
                            {item.emoji}
                        </div>
                    ))}
                </div>

                {/* Gold coins effect */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    {goldCoins.map((coin) => (
                        <div
                            key={`coin-${coin.id}`}
                            className="absolute text-3xl animate-goldCoin"
                            style={{
                                left: coin.left,
                                animationDelay: coin.delay,
                                animationDuration: coin.duration
                            }}
                        >
                            🪙
                        </div>
                    ))}
                </div>

                {/* Trophy icon */}
                <div className="text-7xl md:text-8xl mb-4 animate-bounce">🏆</div>

                {/* Winner avatar */}
                <div className={`w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 rounded-full flex items-center justify-center ring-4 ${
                    theme === 'tron'
                        ? 'ring-cyan-400 bg-cyan-500/20'
                        : theme === 'kids'
                            ? 'ring-purple-400 bg-purple-200'
                            : 'ring-yellow-400 bg-orange-900/50'
                }`}>
                    <CharacterSVG
                        characterId={winner?.avatar}
                        size={theme === 'tron' ? 100 : 90}
                        color={winnerCharacter.color}
                    />
                </div>

                {/* Winner name */}
                <h1
                    className={`text-3xl md:text-5xl font-black mb-2 ${
                        theme === 'tron'
                            ? 'text-cyan-400'
                            : theme === 'kids'
                                ? 'text-purple-600'
                                : 'text-orange-400'
                    }`}
                    style={{ textShadow: '0 0 30px currentColor' }}
                >
                    {isWinner
                        ? `You won the ${gameName}!`
                        : `${winner?.name} won the ${gameName}!`}
                </h1>

                {/* Congratulations text */}
                <div className={`text-2xl font-bold mb-2 ${currentTheme?.text || 'text-white'}`}>
                    {isWinner ? 'Congratulations!' : 'Better luck next time!'}
                </div>

                {/* Score */}
                <div className={`text-4xl font-black mb-6 ${
                    theme === 'tron'
                        ? 'text-yellow-400'
                        : theme === 'kids'
                            ? 'text-yellow-500'
                            : 'text-yellow-400'
                }`}>
                    {winner?.score} points
                </div>

                {/* Countdown indicator */}
                <div className={`text-sm mb-4 ${currentTheme?.textSecondary || 'text-gray-400'}`}>
                    Returning to game room in {countdown}...
                </div>

                {/* Skip button */}
                <button
                    onClick={onDismiss}
                    className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                        theme === 'tron'
                            ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
                            : theme === 'kids'
                                ? 'bg-purple-500 hover:bg-purple-400 text-white'
                                : 'bg-orange-600 hover:bg-orange-500 text-white'
                    }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default WinnerCelebration;
