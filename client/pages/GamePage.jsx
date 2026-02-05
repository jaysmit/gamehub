import React from 'react';
import PictionaryGame from '../game/PictionaryGame';

const GamePage = ({ theme, currentTheme, playerName, selectedAvatar, availableCharacters, currentRoom, isMuted, isMaster, drawingOrder, currentRound, totalRounds }) => {
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
