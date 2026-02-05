import React from 'react';
import { Star } from '../icons/UIIcons';
import { getGameIcon } from '../icons/UIIcons';

function GameDescription({
    theme,
    currentTheme,
    selectedGameDesc,
    setSelectedGameDesc,
}) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedGameDesc(null)}>
            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-500'}`}>
                        {getGameIcon(selectedGameDesc.id, 'w-16 h-16')}
                    </div>
                    <div>
                        <h3 className={`text-2xl font-bold ${currentTheme.text} ${currentTheme.font}`}>
                            {selectedGameDesc.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className={`${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-yellow-400' : 'text-orange-500'} w-4 h-4`} filled={i <= Math.floor(selectedGameDesc.rating)} />
                            ))}
                            <span className={`text-sm ${currentTheme.textSecondary} ml-1`}>{selectedGameDesc.rating}</span>
                        </div>
                    </div>
                </div>
                <p className={`${currentTheme.textSecondary} mb-4 text-base`}>
                    {selectedGameDesc.description}
                </p>
                <div className={`${currentTheme.textSecondary} text-sm mb-6`}>
                    <div><strong>Players:</strong> {selectedGameDesc.players}</div>
                    <div><strong>Age:</strong> {selectedGameDesc.ageMin}+</div>
                </div>
                <button
                    onClick={() => setSelectedGameDesc(null)}
                    className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default GameDescription;
