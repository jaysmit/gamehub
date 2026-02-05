import React from 'react';

function QRModal({
    theme,
    currentTheme,
    qrExpanded,
    setQrExpanded,
    qrRef,
    currentRoom,
}) {
    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setQrExpanded(false)}>
            <div className={`${currentTheme.cardBg} rounded-3xl p-8 max-w-md w-full`} onClick={(e) => e.stopPropagation()}>
                <h3 className={`text-2xl font-bold ${currentTheme.text} mb-4 text-center ${currentTheme.font}`}>
                    Scan to Join
                </h3>
                <div className={`${theme === 'tron' ? 'bg-cyan-400' : theme === 'scary' ? 'bg-orange-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'} rounded-2xl p-8 mb-4`}>
                    <div className="bg-white rounded-xl p-6 flex items-center justify-center">
                        <div ref={qrRef}></div>
                    </div>
                </div>
                <div className={`text-center mb-4 ${currentTheme.text}`}>
                    <p className="text-sm mb-2">Room ID:</p>
                    <p className="font-mono text-3xl font-bold tracking-wider">{currentRoom?.id}</p>
                </div>
                <button
                    onClick={() => setQrExpanded(false)}
                    className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'scary' ? 'bg-orange-700 hover:bg-orange-600 text-white' : 'bg-purple-500 hover:bg-purple-400 text-white'} font-bold py-3 rounded-xl transition-all`}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default QRModal;
