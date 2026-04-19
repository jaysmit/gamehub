import React from 'react';
import GameMasterControls from './GameMasterControls';

/**
 * GamePageTemplate - Reusable wrapper for all game pages
 * Provides consistent styling, background, and game master controls
 *
 * Usage:
 * <GamePageTemplate
 *   theme={theme}
 *   currentTheme={currentTheme}
 *   currentRoom={currentRoom}
 *   isMaster={isMaster}
 *   playerName={playerName}
 *   availableCharacters={availableCharacters}
 *   showRevealAll={phase === 'question'}
 *   onRevealAll={handleRevealAll}
 *   onEndGame={() => setShowEndGameConfirm(true)}
 * >
 *   {children}
 * </GamePageTemplate>
 */
const GamePageTemplate = ({
    theme,
    currentTheme,
    currentRoom,
    isMaster,
    playerName,
    availableCharacters,
    showRevealAll = false,
    onRevealAll,
    onEndGame,
    showMasterControls = true,
    children
}) => {
    // Theme-specific backgrounds with gradients
    const getBackground = () => {
        switch (theme) {
            case 'tron':
                return 'bg-black tron-grid';
            case 'kids':
                return 'bg-gradient-to-br from-orange-300 via-pink-400 to-purple-500';
            case 'scary':
            default:
                return 'bg-gradient-to-br from-gray-900 via-orange-950 to-black';
        }
    };

    return (
        <div className={`min-h-screen ${getBackground()} p-2 pt-16 md:p-4 md:pt-24 pb-4`}>
            {children}

            {/* Fixed Game Master Controls - visible during all phases */}
            {isMaster && showMasterControls && (
                <div className="fixed bottom-4 left-4 z-40">
                    <GameMasterControls
                        theme={theme}
                        currentTheme={currentTheme}
                        currentRoom={currentRoom}
                        isMaster={isMaster}
                        playerName={playerName}
                        availableCharacters={availableCharacters}
                        showRevealAll={showRevealAll}
                        onRevealAll={onRevealAll}
                        onEndGame={onEndGame}
                    />
                </div>
            )}
        </div>
    );
};

export default GamePageTemplate;
