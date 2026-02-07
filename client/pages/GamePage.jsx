import React from 'react';
import PictionaryGame from '../game/PictionaryGame';
import TriviaGame from '../game/TriviaGame';
import QuickMathGame from '../game/QuickMathGame';

const GamePage = ({ theme, currentTheme, playerName, selectedAvatar, availableCharacters, currentRoom, isMuted, isMaster, drawingOrder, currentRound, totalRounds, gameType }) => {
    // Route to the appropriate game component based on gameType
    if (gameType === 'quickmath') {
        return (
            <QuickMathGame
                theme={theme}
                currentTheme={currentTheme}
                playerName={playerName}
                selectedAvatar={selectedAvatar}
                availableCharacters={availableCharacters}
                currentRoom={currentRoom}
                isMuted={isMuted}
                isMaster={isMaster}
            />
        );
    }

    if (gameType === 'trivia') {
        return (
            <TriviaGame
                theme={theme}
                currentTheme={currentTheme}
                playerName={playerName}
                selectedAvatar={selectedAvatar}
                availableCharacters={availableCharacters}
                currentRoom={currentRoom}
                isMuted={isMuted}
                isMaster={isMaster}
            />
        );
    }

    // Default to Pictionary
    return (
        <PictionaryGame
            theme={theme}
            currentTheme={currentTheme}
            playerName={playerName}
            selectedAvatar={selectedAvatar}
            availableCharacters={availableCharacters}
            currentRoom={currentRoom}
            isMuted={isMuted}
            isMaster={isMaster}
            drawingOrder={drawingOrder}
            currentRound={currentRound}
            totalRounds={totalRounds}
        />
    );
};

export default GamePage;
