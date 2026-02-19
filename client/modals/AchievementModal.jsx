import React, { useState, useEffect } from 'react';
import { characterAvatars } from '../data/characters';
import CharacterAvatar from '../components/CharacterAvatar';

// Treasure chest animation states
const CHEST_STATES = {
    CLOSED: 'closed',
    SHAKING: 'shaking',
    OPENING: 'opening',
    OPEN: 'open',
    REVEALED: 'revealed'
};

function AchievementModal({
    isOpen,
    onClose,
    theme = 'tron',
    currentTheme,
    type = 'character', // 'character' or 'medal'
    item, // Character object or medal object
    customMessage // Optional custom message
}) {
    const [chestState, setChestState] = useState(CHEST_STATES.CLOSED);
    const [showItem, setShowItem] = useState(false);

    useEffect(() => {
        if (isOpen && item) {
            // Reset state
            setChestState(CHEST_STATES.CLOSED);
            setShowItem(false);

            // Animation sequence
            const timer1 = setTimeout(() => setChestState(CHEST_STATES.SHAKING), 300);
            const timer2 = setTimeout(() => setChestState(CHEST_STATES.OPENING), 1200);
            const timer3 = setTimeout(() => setChestState(CHEST_STATES.OPEN), 1500);
            const timer4 = setTimeout(() => {
                setChestState(CHEST_STATES.REVEALED);
                setShowItem(true);
            }, 1800);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
                clearTimeout(timer4);
            };
        }
    }, [isOpen, item]);

    if (!isOpen || !item) return null;

    const getRarityColors = () => {
        const rarityColors = {
            common: {
                tron: { glow: 'shadow-slate-500/50', text: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500' },
                kids: { glow: 'shadow-slate-400/50', text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-400' },
                scary: { glow: 'shadow-slate-500/50', text: 'text-slate-400', bg: 'bg-slate-700/50', border: 'border-slate-600' }
            },
            uncommon: {
                tron: { glow: 'shadow-emerald-500/50', text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500' },
                kids: { glow: 'shadow-emerald-400/50', text: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-400' },
                scary: { glow: 'shadow-emerald-700/50', text: 'text-emerald-500', bg: 'bg-emerald-900/50', border: 'border-emerald-700' }
            },
            rare: {
                tron: { glow: 'shadow-cyan-400/60', text: 'text-cyan-300', bg: 'bg-cyan-400/20', border: 'border-cyan-400' },
                kids: { glow: 'shadow-cyan-400/50', text: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-400' },
                scary: { glow: 'shadow-cyan-500/50', text: 'text-cyan-400', bg: 'bg-cyan-900/50', border: 'border-cyan-600' }
            },
            epic: {
                tron: { glow: 'shadow-purple-500/60', text: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500' },
                kids: { glow: 'shadow-purple-400/50', text: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-400' },
                scary: { glow: 'shadow-purple-700/60', text: 'text-purple-500', bg: 'bg-purple-900/50', border: 'border-purple-700' }
            },
            legendary: {
                tron: { glow: 'shadow-orange-500/70', text: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500' },
                kids: { glow: 'shadow-orange-400/60', text: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-400' },
                scary: { glow: 'shadow-orange-600/70', text: 'text-orange-500', bg: 'bg-orange-900/50', border: 'border-orange-600' }
            }
        };

        const rarity = item.rarity || 'common';
        return rarityColors[rarity]?.[theme] || rarityColors.common[theme];
    };

    const colors = getRarityColors();

    const getChestEmoji = () => {
        switch (chestState) {
            case CHEST_STATES.CLOSED:
            case CHEST_STATES.SHAKING:
                return '📦';
            case CHEST_STATES.OPENING:
            case CHEST_STATES.OPEN:
                return '✨';
            case CHEST_STATES.REVEALED:
                return null;
            default:
                return '📦';
        }
    };

    const getChestAnimation = () => {
        switch (chestState) {
            case CHEST_STATES.SHAKING:
                return 'animate-bounce';
            case CHEST_STATES.OPENING:
                return 'animate-pulse scale-125';
            case CHEST_STATES.OPEN:
                return 'animate-ping';
            default:
                return '';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={chestState === CHEST_STATES.REVEALED ? onClose : undefined}
            />

            {/* Modal Content */}
            <div className={`relative ${currentTheme?.cardBg || 'bg-gray-900/95'} rounded-3xl p-8 max-w-md w-full text-center
                ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}
                transform transition-all duration-500 ${showItem ? 'scale-100' : 'scale-95'}`}
            >
                {/* Particles/sparkles background */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                    {showItem && (
                        <>
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`absolute w-2 h-2 rounded-full ${colors.bg} animate-float-particle`}
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        animationDuration: `${2 + Math.random() * 2}s`
                                    }}
                                />
                            ))}
                        </>
                    )}
                </div>

                {/* Chest or Item */}
                <div className="relative z-10">
                    {!showItem ? (
                        // Treasure Chest
                        <div className={`text-8xl mb-6 ${getChestAnimation()}`}>
                            {getChestEmoji()}
                        </div>
                    ) : (
                        // Revealed Item
                        <div className={`mb-6 transform animate-bounce-in`}>
                            {type === 'character' ? (
                                <div className={`w-32 h-32 mx-auto rounded-full ${colors.bg} ${colors.border} border-4
                                    flex items-center justify-center shadow-2xl ${colors.glow}`}
                                >
                                    {theme === 'tron' ? (
                                        <CharacterAvatar
                                            characterId={item.id}
                                            size={80}
                                            rarity={item.rarity}
                                            isLocked={false}
                                        />
                                    ) : (
                                        <span className="text-6xl">{item.emoji}</span>
                                    )}
                                </div>
                            ) : (
                                // Medal display
                                <div className={`w-32 h-32 mx-auto rounded-full ${colors.bg} ${colors.border} border-4
                                    flex items-center justify-center shadow-2xl ${colors.glow}`}
                                >
                                    <span className="text-6xl">{item.emoji || '🏅'}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <h2 className={`text-2xl md:text-3xl font-black mb-2 ${currentTheme?.text || 'text-white'} ${currentTheme?.font || ''}`}>
                        {showItem ? (
                            theme === 'tron' ? '> UNLOCKED!' : 'Unlocked!'
                        ) : (
                            theme === 'tron' ? '> OPENING...' : 'Opening...'
                        )}
                    </h2>

                    {/* Item Name */}
                    {showItem && (
                        <div className="animate-fade-in">
                            <p className={`text-xl font-bold ${colors.text} mb-2`}>
                                {item.name}
                            </p>

                            {/* Rarity Badge */}
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold uppercase
                                ${colors.bg} ${colors.border} border ${colors.text}`}
                            >
                                {item.rarity || 'Common'}
                            </span>

                            {/* Unlock criteria - what the player did */}
                            {item.unlock && (
                                <p className={`mt-3 ${currentTheme?.text || 'text-white'} text-sm font-semibold`}>
                                    {theme === 'tron' ? '> ' : ''}Unlocked by: {item.unlock}
                                </p>
                            )}

                            {/* Description or custom message */}
                            <p className={`mt-2 ${currentTheme?.textSecondary || 'text-gray-400'} text-sm italic`}>
                                {customMessage || item.description || 'You just unlocked a new avatar!'}
                            </p>
                        </div>
                    )}

                    {/* Close Button */}
                    {showItem && (
                        <button
                            onClick={onClose}
                            className={`mt-6 px-8 py-3 rounded-xl font-bold transition-all
                                ${theme === 'tron'
                                    ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
                                    : theme === 'kids'
                                        ? 'bg-purple-500 hover:bg-purple-400 text-white'
                                        : 'bg-orange-600 hover:bg-orange-500 text-white'
                                }`}
                        >
                            {theme === 'tron' ? '> AWESOME!' : 'Awesome!'}
                        </button>
                    )}
                </div>
            </div>

            {/* CSS for custom animations */}
            <style>{`
                @keyframes float-particle {
                    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
                    50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
                }
                @keyframes bounce-in {
                    0% { transform: scale(0) rotate(-10deg); opacity: 0; }
                    50% { transform: scale(1.2) rotate(5deg); }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-float-particle { animation: float-particle 3s ease-in-out infinite; }
                .animate-bounce-in { animation: bounce-in 0.6s ease-out forwards; }
                .animate-fade-in { animation: fade-in 0.4s ease-out 0.3s forwards; opacity: 0; }
            `}</style>
        </div>
    );
}

export default AchievementModal;
