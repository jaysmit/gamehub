import React from 'react';
import CharacterSVG from '../icons/CharacterSVGs';
import { rarityConfig } from '../data/themes';

/**
 * Shared avatar component with rarity-based colors and glow effects
 *
 * @param {string} characterId - The character's ID
 * @param {number} size - Size of the avatar in pixels (default: 60)
 * @param {string} rarity - Rarity level: 'common', 'uncommon', 'rare', 'epic', 'legendary'
 * @param {boolean} isLocked - Whether the character is locked (shows greyscale)
 * @param {boolean} showGlow - Whether to show the glow effect (default: true)
 * @param {string} className - Additional CSS classes for the container
 */
function CharacterAvatar({
    characterId,
    size = 60,
    rarity = 'common',
    isLocked = false,
    showGlow = true,
    className = ''
}) {
    const rc = rarityConfig[rarity] || rarityConfig.common;
    const hasGlow = showGlow && !isLocked && ['rare', 'epic', 'legendary'].includes(rarity);

    // Glow settings by rarity - scale blur with size for consistent appearance
    const glowSettings = {
        rare: { blur: size * 0.06, opacity: 0.1, size: size * 0.85 },
        epic: { blur: size * 0.1, opacity: 0.22, size: size * 0.95 },
        legendary: { blur: size * 0.14, opacity: 0.38, size: size * 1.0 }
    };

    const glow = glowSettings[rarity];

    return (
        <div
            className={`relative flex items-center justify-center ${isLocked ? 'grayscale' : ''} ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Glow layer - uses absolute positioning within the sized container */}
            {hasGlow && glow && (
                <div
                    className="absolute"
                    style={{
                        width: glow.size,
                        height: glow.size,
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: rc.color,
                        borderRadius: '50%',
                        filter: `blur(${glow.blur}px)`,
                        opacity: glow.opacity,
                        zIndex: 0
                    }}
                />
            )}
            {/* Avatar layer - on top of glow */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <CharacterSVG
                    characterId={characterId}
                    size={size}
                    color={isLocked ? '#555' : rc.color}
                />
            </div>
        </div>
    );
}

export default CharacterAvatar;
