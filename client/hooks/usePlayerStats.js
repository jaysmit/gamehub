import { useState, useCallback, useEffect, useRef } from 'react';
import {
    DEFAULT_STATS,
    checkUnlocks,
    getRandomCharacterByRarity,
    getSessionStats,
    saveSessionStats,
    getSessionUnlocked,
    saveSessionUnlocked,
    updateStat,
    UNLOCK_CONDITIONS
} from '../data/achievements';
import { characterAvatars } from '../data/characters';
import { api } from '../utils/api';

/**
 * Ensure stats have all required fields with proper types
 */
function normalizeStats(stats) {
    return {
        ...DEFAULT_STATS,
        ...stats,
        // Ensure arrays are always arrays
        gameTypesPlayed: Array.isArray(stats?.gameTypesPlayed) ? stats.gameTypesPlayed : [],
        charactersWonWith: Array.isArray(stats?.charactersWonWith) ? stats.charactersWonWith : [],
    };
}

/**
 * Hook for managing player stats and avatar unlocks
 * Works for both logged-in users (database) and guests (session storage)
 */
export function usePlayerStats(user, isLoggedIn, theme = 'tron') {
    // Stats state
    const [stats, setStats] = useState(() => {
        if (isLoggedIn && user?.stats) {
            return normalizeStats(user.stats);
        }
        return normalizeStats(getSessionStats());
    });

    // Unlocked characters state
    const [unlockedCharacters, setUnlockedCharacters] = useState(() => {
        if (isLoggedIn && user?.unlockedCharacters) {
            return user.unlockedCharacters;
        }
        return getSessionUnlocked();
    });

    // Pending unlocks queue (for showing modals one at a time)
    const [pendingUnlocks, setPendingUnlocks] = useState([]);
    const [currentUnlock, setCurrentUnlock] = useState(null);

    // Track if we need to sync with server
    const pendingSyncRef = useRef(false);

    // Get all characters for current theme
    const allCharacters = characterAvatars[theme] || characterAvatars.tron;

    // Sync stats when user logs in
    useEffect(() => {
        if (isLoggedIn && user?.stats) {
            setStats(normalizeStats(user.stats));
        }
        if (isLoggedIn && user?.unlockedCharacters) {
            setUnlockedCharacters(user.unlockedCharacters);
        }
    }, [isLoggedIn, user?.stats, user?.unlockedCharacters]);

    // Save session stats for guests
    useEffect(() => {
        if (!isLoggedIn) {
            saveSessionStats(stats);
        }
    }, [stats, isLoggedIn]);

    // Save session unlocks for guests
    useEffect(() => {
        if (!isLoggedIn) {
            saveSessionUnlocked(unlockedCharacters);
        }
    }, [unlockedCharacters, isLoggedIn]);

    // Sync stats to server (debounced)
    useEffect(() => {
        if (!isLoggedIn || !pendingSyncRef.current) return;

        console.log('[PlayerStats] Syncing to server...', { stats, unlockedCharacters });

        const syncTimer = setTimeout(async () => {
            try {
                await api.updateMe({ stats, unlockedCharacters });
                console.log('[PlayerStats] Sync successful');
                pendingSyncRef.current = false;
            } catch (err) {
                console.error('[PlayerStats] Failed to sync stats:', err);
            }
        }, 2000);

        return () => clearTimeout(syncTimer);
    }, [stats, unlockedCharacters, isLoggedIn]);

    /**
     * Update a stat and check for new unlocks
     */
    const recordStat = useCallback((statName, value, increment = false) => {
        console.log('[PlayerStats] recordStat:', statName, value, increment ? '(increment)' : '');

        setStats(prev => {
            const updated = updateStat(normalizeStats(prev), statName, value, increment);
            console.log('[PlayerStats] Stat updated:', statName, '=', updated[statName]);

            // Check for new unlocks
            const newUnlocks = checkUnlocks(updated, unlockedCharacters, allCharacters);

            if (newUnlocks.length > 0) {
                // Add to pending unlocks queue
                const unlockItems = newUnlocks.map(id => {
                    const char = allCharacters.find(c => c.id === id);
                    return char ? { type: 'character', item: char } : null;
                }).filter(Boolean);

                if (unlockItems.length > 0) {
                    setPendingUnlocks(prev => [...prev, ...unlockItems]);
                    setUnlockedCharacters(prev => [...prev, ...newUnlocks]);
                    pendingSyncRef.current = true;
                }
            }

            pendingSyncRef.current = true;
            return updated;
        });
    }, [unlockedCharacters, allCharacters]);

    /**
     * Record multiple stats at once
     */
    const recordMultipleStats = useCallback((updates) => {
        setStats(prev => {
            let updated = { ...prev };

            for (const [statName, { value, increment }] of Object.entries(updates)) {
                updated = updateStat(updated, statName, value, increment);
            }

            // Check for new unlocks
            const newUnlocks = checkUnlocks(updated, unlockedCharacters, allCharacters);

            if (newUnlocks.length > 0) {
                const unlockItems = newUnlocks.map(id => {
                    const char = allCharacters.find(c => c.id === id);
                    return char ? { type: 'character', item: char } : null;
                }).filter(Boolean);

                if (unlockItems.length > 0) {
                    setPendingUnlocks(prev => [...prev, ...unlockItems]);
                    setUnlockedCharacters(prev => [...prev, ...newUnlocks]);
                }
            }

            pendingSyncRef.current = true;
            return updated;
        });
    }, [unlockedCharacters, allCharacters]);

    /**
     * Record a game completion with all relevant stats
     */
    const recordGameComplete = useCallback(({
        gameType,
        won,
        playerCount,
        score,
        totalPoints,
        duration,
        placement,
        playerScores,
        characterUsed,
        roomId
    }) => {
        console.log('[PlayerStats] recordGameComplete called:', { gameType, won, playerCount, score, placement, characterUsed, roomId });

        setStats(prev => {
            const updated = normalizeStats(prev);

            // Basic stats
            updated.gamesPlayed = (updated.gamesPlayed || 0) + 1;
            updated.totalPoints = (updated.totalPoints || 0) + (totalPoints || score || 0);

            // Game types played
            if (gameType && !updated.gameTypesPlayed.includes(gameType)) {
                updated.gameTypesPlayed = [...updated.gameTypesPlayed, gameType];
            }

            // Player count stats
            if (playerCount >= 4) {
                updated.gamesWithFourPlusPlayers = (updated.gamesWithFourPlusPlayers || 0) + 1;
            }

            // Score tracking
            if (score && score > (updated.highestSingleGameScore || 0)) {
                updated.highestSingleGameScore = score;
            }
            if (totalPoints && totalPoints > (updated.highestGameTotalPoints || 0)) {
                updated.highestGameTotalPoints = totalPoints;
            }

            // Win tracking
            if (won) {
                updated.wins = (updated.wins || 0) + 1;
                updated.currentWinStreak = (updated.currentWinStreak || 0) + 1;

                if (updated.currentWinStreak > (updated.bestWinStreak || 0)) {
                    updated.bestWinStreak = updated.currentWinStreak;
                }

                // Fast win (under 60 seconds)
                if (duration && duration < 60000) {
                    updated.fastWins = (updated.fastWins || 0) + 1;
                }

                // Large room win
                if (playerCount >= 6) {
                    updated.winsInLargeRooms = (updated.winsInLargeRooms || 0) + 1;
                }

                // Comeback win (last to first in 5+ player game)
                if (playerCount >= 5 && placement === 1) {
                    // This would need more context about starting position
                    // For now, we'll track it separately when we have that info
                }

                // Domination win (score > all others combined)
                if (playerCount >= 4 && playerScores) {
                    const otherScores = Object.values(playerScores).reduce((sum, s) => sum + s, 0) - score;
                    if (score > otherScores) {
                        updated.dominationWins = (updated.dominationWins || 0) + 1;
                    }
                }

                // Character mastery
                if (characterUsed && !updated.charactersWonWith.includes(characterUsed)) {
                    updated.charactersWonWith = [...updated.charactersWonWith, characterUsed];
                }

                // Unique room wins tracking
                if (roomId) {
                    const uniqueRoomWins = updated.uniqueRoomWins || {};
                    if (!uniqueRoomWins[roomId]) {
                        uniqueRoomWins[roomId] = true;
                        updated.uniqueRoomWins = uniqueRoomWins;
                        updated.uniqueRoomWinCount = Object.keys(uniqueRoomWins).length;
                    }
                }

                // Consecutive days tracking
                const today = new Date().toDateString();
                const lastWin = updated.lastWinDate ? new Date(updated.lastWinDate).toDateString() : null;

                if (lastWin !== today) {
                    const yesterday = new Date(Date.now() - 86400000).toDateString();
                    if (lastWin === yesterday) {
                        updated.consecutiveDaysWithWin = (updated.consecutiveDaysWithWin || 0) + 1;
                    } else if (lastWin !== today) {
                        updated.consecutiveDaysWithWin = 1;
                    }
                    updated.lastWinDate = new Date().toISOString();
                }
            } else {
                // Reset win streak on loss
                updated.currentWinStreak = 0;
            }

            // Check for new unlocks
            const newUnlocks = checkUnlocks(updated, unlockedCharacters, allCharacters);

            if (newUnlocks.length > 0) {
                console.log('[PlayerStats] New unlocks!', newUnlocks);
                const unlockItems = newUnlocks.map(id => {
                    const char = allCharacters.find(c => c.id === id);
                    return char ? { type: 'character', item: char } : null;
                }).filter(Boolean);

                if (unlockItems.length > 0) {
                    setPendingUnlocks(prev => [...prev, ...unlockItems]);
                    setUnlockedCharacters(prev => [...prev, ...newUnlocks]);
                }
            }

            console.log('[PlayerStats] Updated stats:', {
                gamesPlayed: updated.gamesPlayed,
                wins: updated.wins,
                totalPoints: updated.totalPoints,
                gameTypesPlayed: updated.gameTypesPlayed,
                currentWinStreak: updated.currentWinStreak,
                bestWinStreak: updated.bestWinStreak
            });

            pendingSyncRef.current = true;
            return updated;
        });
    }, [unlockedCharacters, allCharacters]);

    /**
     * Award a random character of a specific rarity (for registration/email bonus)
     */
    const awardRandomCharacter = useCallback((rarity) => {
        const character = getRandomCharacterByRarity(rarity, unlockedCharacters, allCharacters);

        if (character) {
            setPendingUnlocks(prev => [...prev, { type: 'character', item: character }]);
            setUnlockedCharacters(prev => [...prev, character.id]);
            pendingSyncRef.current = true;
            return character;
        }

        return null;
    }, [unlockedCharacters, allCharacters]);

    /**
     * Manually unlock a character (for testing or special events)
     */
    const unlockCharacter = useCallback((characterId) => {
        if (unlockedCharacters.includes(characterId)) return false;

        const character = allCharacters.find(c => c.id === characterId);
        if (!character) return false;

        setPendingUnlocks(prev => [...prev, { type: 'character', item: character }]);
        setUnlockedCharacters(prev => [...prev, characterId]);
        pendingSyncRef.current = true;
        return true;
    }, [unlockedCharacters, allCharacters]);

    /**
     * Show the next pending unlock
     */
    const showNextUnlock = useCallback(() => {
        if (pendingUnlocks.length > 0) {
            setCurrentUnlock(pendingUnlocks[0]);
            setPendingUnlocks(prev => prev.slice(1));
        }
    }, [pendingUnlocks]);

    /**
     * Dismiss current unlock modal
     */
    const dismissUnlock = useCallback(() => {
        setCurrentUnlock(null);
        // Show next one after a brief delay
        setTimeout(() => {
            if (pendingUnlocks.length > 0) {
                showNextUnlock();
            }
        }, 300);
    }, [pendingUnlocks, showNextUnlock]);

    // Auto-show pending unlocks
    useEffect(() => {
        if (!currentUnlock && pendingUnlocks.length > 0) {
            const timer = setTimeout(showNextUnlock, 500);
            return () => clearTimeout(timer);
        }
    }, [currentUnlock, pendingUnlocks, showNextUnlock]);

    /**
     * Check if a character is unlocked
     */
    const isCharacterUnlocked = useCallback((characterId) => {
        // Common characters are always unlocked
        const character = allCharacters.find(c => c.id === characterId);
        if (character?.unlock === null) return true;

        return unlockedCharacters.includes(characterId);
    }, [unlockedCharacters, allCharacters]);

    return {
        stats,
        unlockedCharacters,
        currentUnlock,
        hasPendingUnlocks: pendingUnlocks.length > 0,

        // Stat recording
        recordStat,
        recordMultipleStats,
        recordGameComplete,

        // Unlock management
        awardRandomCharacter,
        unlockCharacter,
        isCharacterUnlocked,

        // Modal control
        showNextUnlock,
        dismissUnlock
    };
}

export default usePlayerStats;
