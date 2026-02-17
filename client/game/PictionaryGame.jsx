import React, { useState, useEffect, useRef } from 'react';
import { CharacterSVG } from '../icons/CharacterSVGs';
import { Check } from '../icons/UIIcons';
import { socket, getServerTime } from '../socket';

const PictionaryGame = ({ theme, currentTheme, playerName, selectedAvatar, availableCharacters, currentRoom, isMuted, isMaster, drawingOrder, currentRound, totalRounds }) => {
    const canvasRef = useRef(null);
    const chatEndRef = useRef(null);
    const lastPointRef = useRef(null);
    const pickTimerRef = useRef(null);
    const roomIdRef = useRef(currentRoom?.id);
    const chatInputRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawColor, setDrawColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(3);
    const [isDrawer, setIsDrawer] = useState(false);
    const [drawerName, setDrawerName] = useState('');
    const [currentWord, setCurrentWord] = useState('');
    const [gameTimer, setGameTimer] = useState(60);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [roundWinner, setRoundWinner] = useState(null);
    const [audioStarted, setAudioStarted] = useState(false);
    const [showTimerEndModal, setShowTimerEndModal] = useState(false);
    const [showPickWinner, setShowPickWinner] = useState(false);
    const [selectedWinnerCandidate, setSelectedWinnerCandidate] = useState(null);
    const [pointsEarned, setPointsEarned] = useState(null);
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [roundCounter, setRoundCounter] = useState(0);
    const [pickTimerCount, setPickTimerCount] = useState(0);
    const [timerPaused, setTimerPaused] = useState(false);
    const [chatFrozen, setChatFrozen] = useState(false);
    const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);
    const winnerPendingRef = useRef(false);
    const timerEndTimeRef = useRef(null);
    const [pauseCountdown, setPauseCountdown] = useState(0);
    const pauseCountdownRef = useRef(null);
    const [serverTimerStarted, setServerTimerStarted] = useState(false);
    const [currentPickValue, setCurrentPickValue] = useState(100);
    const [correctGuesses, setCorrectGuesses] = useState([]);
    const [guessCooldown, setGuessCooldown] = useState(false);

    // Winner celebration state
    const [showWinnerCelebration, setShowWinnerCelebration] = useState(false);
    const [finalScores, setFinalScores] = useState([]);
    const [celebrationCountdown, setCelebrationCountdown] = useState(8);

    // Word picker state (drawer chooses from difficulty-based options)
    const [wordOptions, setWordOptions] = useState([]);
    const [showWordPicker, setShowWordPicker] = useState(false);
    const [wordSelected, setWordSelected] = useState(false);

    // Keep roomIdRef in sync so timer callbacks never have stale closure
    useEffect(() => { roomIdRef.current = currentRoom?.id; }, [currentRoom?.id]);

    // Request game sync on mount (handles rejoin mid-game after page refresh)
    useEffect(() => {
        if (currentRoom?.id) {
            // Small delay to ensure socket listeners are set up
            const timer = setTimeout(() => {
                socket.emit('requestGameSync', { roomId: currentRoom.id });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, []); // Only run on mount

    // Handle visibility change (phone lock, tab switch) - request game sync when returning
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && currentRoom?.id) {
                // Request game state sync from server when returning to tab
                socket.emit('requestGameSync', { roomId: currentRoom.id });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [currentRoom?.id]);

    // Handle input focus on mobile - scroll to keep canvas visible
    const handleInputFocus = () => {
        // Longer delay to let mobile keyboard fully appear, then scroll to top
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    };

    // Auto-scroll chat to bottom when new messages arrive
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    // Countdown timer — runs independently of modal visibility
    useEffect(() => {
        if (roundCounter === 0) return;
        setCountdown(10);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowRulesModal(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [roundCounter]);

    // Socket listeners for game events
    useEffect(() => {
        const onGameTimerStart = ({ endTime }) => {
            timerEndTimeRef.current = endTime;
            const remaining = Math.ceil((endTime - getServerTime()) / 1000);
            setGameTimer(Math.max(0, remaining));
            setCountdown(0);
            setShowRulesModal(false);
            setServerTimerStarted(true);
        };

        const onGameStarted = ({ drawerName: drawer, currentPickValue: cpv }) => {
            timerEndTimeRef.current = null;
            setDrawerName(drawer);
            setIsDrawer(drawer === playerName);
            setChatMessages([]);
            setGameTimer(60);
            setRoundWinner(null);
            setPointsEarned(null);
            setCurrentWord('');
            setShowRulesModal(true);
            setRoundCounter(prev => prev + 1);
            winnerPendingRef.current = false;
            setChatFrozen(false);
            setServerTimerStarted(false);
            setCurrentPickValue(cpv || 100);
            setCorrectGuesses([]);
            setGuessCooldown(false);
            clearInterval(pauseCountdownRef.current);
            setPauseCountdown(0);
            // Reset word picker state
            setWordOptions([]);
            setShowWordPicker(false);
            setWordSelected(false);
            // Clear canvas
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        const onYourWord = ({ word, autoSelected }) => {
            setCurrentWord(word);
            setWordSelected(true);
            setShowWordPicker(false);
            if (autoSelected) {
                // Word was auto-selected because drawer didn't pick in time
                console.log('Word auto-selected:', word);
            }
        };

        const onWordOptions = ({ options }) => {
            // Drawer receives word options to choose from
            setWordOptions(options || []);
            setWordSelected(false);
            setShowWordPicker(true);
        };

        const onDrawLine = ({ x0, y0, x1, y1, color, size }) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        };

        const onClearCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        const onGameGuess = (msg) => {
            setChatMessages(prev => [...prev, msg]);
        };

        const onRoundResult = ({ winnerName, points }) => {
            winnerPendingRef.current = false;
            setRoundWinner(winnerName);
            setPointsEarned(points);
        };

        const onNextRound = ({ drawerName: drawer, currentPickValue: cpv }) => {
            // Reset all round state for the new round
            timerEndTimeRef.current = null;
            setDrawerName(drawer);
            setIsDrawer(drawer === playerName);
            setChatMessages([]);
            setGameTimer(60);
            setRoundWinner(null);
            setPointsEarned(null);
            setCurrentWord('');
            setShowTimerEndModal(false);
            setShowPickWinner(false);
            setSelectedWinnerCandidate(null);
            setTimerPaused(false);
            setChatFrozen(false);
            setServerTimerStarted(false);
            winnerPendingRef.current = false;
            setGuessCooldown(false);
            clearInterval(pickTimerRef.current);
            setPickTimerCount(0);
            clearInterval(pauseCountdownRef.current);
            setPauseCountdown(0);
            setCurrentPickValue(cpv || 100);
            // Reset word picker state
            setWordOptions([]);
            setShowWordPicker(false);
            setWordSelected(false);
            // Clear canvas
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            // Show rules modal and trigger countdown
            setShowRulesModal(true);
            setRoundCounter(prev => prev + 1);
        };

        const onWinnerPicked = ({ winnerName, drawerName: drawer, points, word }) => {
            winnerPendingRef.current = false;
            setRoundWinner(winnerName);
            setPointsEarned(points);
            setCorrectGuesses(prev => [...prev, { winnerName, drawerName: drawer, points, word: word || '?' }]);
            clearInterval(pauseCountdownRef.current);
            setPauseCountdown(0);
            // Timer stays paused during announcement
        };

        const onContinueDrawing = ({ nextPickValue, endTime }) => {
            if (endTime) timerEndTimeRef.current = endTime;
            // Clear announcement, canvas, chat, close modals, resume timer
            setRoundWinner(null);
            setPointsEarned(null);
            setChatMessages([]);
            setShowTimerEndModal(false);
            setShowPickWinner(false);
            setSelectedWinnerCandidate(null);
            setTimerPaused(false);
            setChatFrozen(false);
            winnerPendingRef.current = false;
            clearInterval(pickTimerRef.current);
            setPickTimerCount(0);
            clearInterval(pauseCountdownRef.current);
            setPauseCountdown(0);
            if (nextPickValue) setCurrentPickValue(nextPickValue);
            // Clear canvas
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        const onGamePaused = ({ pickDuration }) => {
            timerEndTimeRef.current = null;
            setTimerPaused(true);
            setChatFrozen(true);
            // Start visible countdown for non-drawer overlay
            if (pickDuration > 0) {
                clearInterval(pauseCountdownRef.current);
                setPauseCountdown(pickDuration);
                pauseCountdownRef.current = setInterval(() => {
                    setPauseCountdown(c => {
                        if (c <= 1) {
                            clearInterval(pauseCountdownRef.current);
                            return 0;
                        }
                        return c - 1;
                    });
                }, 1000);
            }
        };

        const onGameResumed = ({ endTime }) => {
            if (endTime) timerEndTimeRef.current = endTime;
            setTimerPaused(false);
            setChatFrozen(false);
            clearInterval(pauseCountdownRef.current);
            setPauseCountdown(0);
        };

        const onGameEnded = ({ finalScores: scores, cancelled }) => {
            // Clean up all timers and state
            timerEndTimeRef.current = null;
            clearInterval(pickTimerRef.current);
            clearInterval(pauseCountdownRef.current);
            setShowTimerEndModal(false);
            setShowPickWinner(false);
            setShowRulesModal(false);
            setTimerPaused(false);
            setChatFrozen(false);
            setRoundWinner(null);
            setPickTimerCount(0);
            setPauseCountdown(0);
            winnerPendingRef.current = false;
            setShowEndGameConfirm(false);
            setServerTimerStarted(false);
            setCorrectGuesses([]);

            // Show winner celebration if game wasn't cancelled and has scores
            if (!cancelled && scores && scores.length > 0) {
                setFinalScores(scores);
                setCelebrationCountdown(8);
                setShowWinnerCelebration(true);
            }
        };

        // Handle game sync for rejoining players mid-game
        const onGameSync = (data) => {
            // If no active game, App.jsx will handle redirect to room
            if (data.noActiveGame) return;

            const { drawerName: drawer, currentPickValue: cpv, paused, timerEndTime, timerRemainingMs } = data;

            // Set drawer info
            if (drawer) {
                setDrawerName(drawer);
                setIsDrawer(drawer === playerName);
            }
            setCurrentPickValue(cpv || 100);

            // Hide rules modal since game is already in progress
            setShowRulesModal(false);
            setCountdown(0);

            if (paused) {
                // Game is paused (drawer picking winner)
                setTimerPaused(true);
                setChatFrozen(true);
                if (timerRemainingMs) {
                    const remaining = Math.ceil(timerRemainingMs / 1000);
                    setGameTimer(Math.max(0, remaining));
                }
            } else if (timerEndTime) {
                // Game is running, sync with server timer
                timerEndTimeRef.current = timerEndTime;
                const remaining = Math.ceil((timerEndTime - getServerTime()) / 1000);
                setGameTimer(Math.max(0, remaining));
                setServerTimerStarted(true);
                setTimerPaused(false);
                setChatFrozen(false);
            }
        };

        socket.on('gameTimerStart', onGameTimerStart);
        socket.on('gameSync', onGameSync);
        socket.on('gameStarted', onGameStarted);
        socket.on('yourWord', onYourWord);
        socket.on('wordOptions', onWordOptions);
        socket.on('drawLine', onDrawLine);
        socket.on('clearCanvas', onClearCanvas);
        socket.on('gameGuess', onGameGuess);
        socket.on('roundResult', onRoundResult);
        socket.on('nextRound', onNextRound);
        socket.on('winnerPicked', onWinnerPicked);
        socket.on('continueDrawing', onContinueDrawing);
        socket.on('gamePaused', onGamePaused);
        socket.on('gameResumed', onGameResumed);
        socket.on('gameEnded', onGameEnded);

        return () => {
            clearInterval(pauseCountdownRef.current);
            socket.off('gameTimerStart', onGameTimerStart);
            socket.off('gameSync', onGameSync);
            socket.off('gameStarted', onGameStarted);
            socket.off('yourWord', onYourWord);
            socket.off('wordOptions', onWordOptions);
            socket.off('drawLine', onDrawLine);
            socket.off('clearCanvas', onClearCanvas);
            socket.off('gameGuess', onGameGuess);
            socket.off('roundResult', onRoundResult);
            socket.off('nextRound', onNextRound);
            socket.off('winnerPicked', onWinnerPicked);
            socket.off('continueDrawing', onContinueDrawing);
            socket.off('gamePaused', onGamePaused);
            socket.off('gameResumed', onGameResumed);
            socket.off('gameEnded', onGameEnded);
        };
    }, [playerName]);

    // Game timer countdown with modal when time's up — only runs after server signals timer start
    // Computes display from absolute endTime so all clients stay in sync
    useEffect(() => {
        if (gameTimer > 0 && pointsEarned === null && countdown <= 0 && !timerPaused && serverTimerStarted) {
            const timer = setInterval(() => {
                const endTime = timerEndTimeRef.current;
                if (!endTime) return;
                const remaining = Math.ceil((endTime - getServerTime()) / 1000);
                const clamped = Math.max(0, remaining);

                setGameTimer(prev => {
                    if (prev === clamped) return prev; // no change
                    if (clamped <= 0 && isDrawer) {
                        if (winnerPendingRef.current) return 0;
                        setChatMessages(msgs => {
                            if (msgs.length > 0) {
                                setSelectedWinnerCandidate(null);
                                setShowTimerEndModal(true);
                                setTimerPaused(true);
                                startPickTimer(10);
                            } else {
                                const rid = roomIdRef.current;
                                if (rid) socket.emit('noWinner', { roomId: rid });
                            }
                            return msgs;
                        });
                    }
                    return clamped;
                });
            }, 250); // tick 4x/sec for responsive display
            return () => clearInterval(timer);
        }
    }, [gameTimer, pointsEarned, isDrawer, countdown, timerPaused, serverTimerStarted]);

    // Winner celebration countdown timer
    useEffect(() => {
        if (!showWinnerCelebration) return;

        if (celebrationCountdown <= 0) {
            setShowWinnerCelebration(false);
            return;
        }

        const timer = setTimeout(() => {
            setCelebrationCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [showWinnerCelebration, celebrationCountdown]);

    // Pick timer helpers
    const startPickTimer = (duration) => {
        clearInterval(pickTimerRef.current);
        setPickTimerCount(duration);
        pickTimerRef.current = setInterval(() => {
            setPickTimerCount(prev => {
                if (prev <= 1) {
                    clearInterval(pickTimerRef.current);
                    handlePickTimerExpiry();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handlePickTimerExpiry = () => {
        // Use functional state reads to check which modal is open
        setShowTimerEndModal(prev => {
            if (prev) {
                // Timer end modal was open — no winner chosen in time
                const rid = roomIdRef.current;
                if (rid) {
                    socket.emit('noWinner', { roomId: rid });
                }
                return false;
            }
            return prev;
        });
        setShowPickWinner(prev => {
            if (prev) {
                // Mid-game pick attempt timed out — close modal, resume game
                const rid = roomIdRef.current;
                if (rid) socket.emit('resumeGame', { roomId: rid });
                return false;
            }
            return prev;
        });
    };

    // Handle drawer selecting a word from the options
    const handleSelectWord = (word) => {
        if (!currentRoom?.id || wordSelected) return;
        socket.emit('selectWord', { roomId: currentRoom.id, word });
        setShowWordPicker(false);
    };

    // Get difficulty colors for word options
    const getDifficultyColors = (difficulty) => {
        const colors = {
            'super-easy': { bg: 'bg-pink-500', text: 'text-white', border: 'border-pink-400' },
            'very-easy': { bg: 'bg-green-500', text: 'text-white', border: 'border-green-400' },
            'easy': { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-400' },
            'medium': { bg: 'bg-yellow-500', text: 'text-black', border: 'border-yellow-400' },
            'hard': { bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-400' },
            'very-hard': { bg: 'bg-red-500', text: 'text-white', border: 'border-red-400' },
            'genius': { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-400' }
        };
        return colors[difficulty] || colors['medium'];
    };

    // State for kick/skip confirmation
    const [confirmAction, setConfirmAction] = useState(null); // { type: 'kick'|'skip', playerName: string }

    const getPointerPosition = (e, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        if (!isDrawer || countdown > 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { x, y } = getPointerPosition(e, canvas);

        ctx.beginPath();
        ctx.moveTo(x, y);
        lastPointRef.current = { x, y };
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing || !isDrawer || countdown > 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { x, y } = getPointerPosition(e, canvas);

        ctx.strokeStyle = drawColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();

        // Emit line segment to other players
        const prev = lastPointRef.current;
        if (prev && currentRoom?.id) {
            socket.emit('drawLine', {
                roomId: currentRoom.id,
                x0: prev.x, y0: prev.y,
                x1: x, y1: y,
                color: drawColor, size: brushSize
            });
        }
        lastPointRef.current = { x, y };
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        lastPointRef.current = null;
    };

    // Add non-passive touch event listeners to prevent scrolling while drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleTouchStart = (e) => {
            if (isDrawer && countdown <= 0) {
                e.preventDefault();
                startDrawing(e);
            }
        };

        const handleTouchMove = (e) => {
            if (isDrawer && countdown <= 0) {
                e.preventDefault();
                draw(e);
            }
        };

        const handleTouchEnd = (e) => {
            stopDrawing();
        };

        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDrawer, countdown, isDrawing, drawColor, brushSize, currentRoom?.id]);

    // Kick player from room/game
    const handleKickPlayer = (targetPlayerName) => {
        if (currentRoom?.id) {
            socket.emit('kickPlayer', { roomId: currentRoom.id, playerName: targetPlayerName });
        }
        setConfirmAction(null);
    };

    // Skip player's drawing turn
    const handleSkipTurn = (targetPlayerName) => {
        if (currentRoom?.id) {
            socket.emit('skipPlayerTurn', { roomId: currentRoom.id, playerName: targetPlayerName });
        }
        setConfirmAction(null);
    };

    const clearCanvas = () => {
        if (!isDrawer) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (currentRoom?.id) {
            socket.emit('clearCanvas', { roomId: currentRoom.id });
        }
    };

    const sendMessage = () => {
        if (!chatInput.trim() || isDrawer || guessCooldown) return;
        if (currentRoom?.id) {
            socket.emit('gameGuess', { roomId: currentRoom.id, message: chatInput.trim() });
        }
        setChatInput('');

        // Start 5-second cooldown
        setGuessCooldown(true);
        setTimeout(() => setGuessCooldown(false), 5000);
    };

    const selectWinner = (messageName, timerExpired) => {
        clearInterval(pickTimerRef.current);
        winnerPendingRef.current = true;
        if (currentRoom?.id) {
            socket.emit('winnerPicked', { roomId: currentRoom.id, winnerName: messageName, timerExpired: !!timerExpired });
        }
        setShowTimerEndModal(false);
        setShowPickWinner(false);
        setSelectedWinnerCandidate(null);
        // Keep timer paused — will resume on continueDrawing event
    };

    return (
        <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-orange-300 via-pink-400 to-purple-500' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} p-2 pt-16 md:p-4 md:pt-24 pb-[32vh] md:pb-4`}>
            <div className="max-w-7xl mx-auto">
                {/* Word to Draw - Compact display for drawer */}
                {isDrawer && currentWord && (
                    <div className={`${theme === 'tron' ? 'bg-gradient-to-r from-cyan-500/30 via-cyan-400/40 to-cyan-500/30 border border-cyan-400' : theme === 'kids' ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400' : 'bg-gradient-to-r from-orange-700/50 via-orange-600/60 to-orange-700/50 border border-orange-500'} rounded-lg px-4 py-1 mb-1 flex items-center justify-center gap-2`}>
                        <span className={`text-[0.6rem] ${theme === 'tron' ? 'text-cyan-300' : theme === 'kids' ? 'text-white/80' : 'text-orange-300'} uppercase tracking-wider`}>Draw:</span>
                        <span className={`text-base md:text-lg font-black ${theme === 'tron' ? 'text-cyan-400 tron-text-glow' : theme === 'kids' ? 'text-white' : 'text-orange-400'} tracking-wide animate-pulse`}>
                            {currentWord}
                        </span>
                    </div>
                )}

                {/* Game Header */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-lg p-1.5 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'} mb-1`}>
                    {/* Main row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">

                        {/* Round Indicator */}
                        {totalRounds > 0 && (
                            <div className={`${theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-700/40 text-orange-400 border border-orange-700'} px-2 py-1 rounded-lg`}>
                                <span className="text-xs md:text-sm font-bold">Round {currentRound}/{totalRounds}</span>
                            </div>
                        )}

                        {/* Score - Dynamic */}
                        <div className={`${theme === 'tron' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' : theme === 'kids' ? 'bg-yellow-500 text-white' : 'bg-yellow-700/40 text-yellow-400 border border-yellow-700'} px-2 py-1 rounded-lg flex items-center gap-1`}>
                            <span className="text-xs md:text-sm font-black">{currentPickValue} PTS</span>
                        </div>

                        {/* Timer */}
                        <div className={`${gameTimer <= 10 ? (theme === 'tron' ? 'bg-red-500/20 text-red-400 border border-red-500' : theme === 'kids' ? 'bg-red-500 text-white' : 'bg-red-700/40 text-red-400 border border-red-700') : (theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-green-500 text-white' : 'bg-orange-700/40 text-orange-400 border border-orange-700')} px-2 py-1 rounded-lg flex items-center gap-1 ${gameTimer <= 10 ? 'animate-pulse' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span className="text-sm md:text-base font-black">{gameTimer}s</span>
                        </div>
                    </div>
                </div>

                {/* Main Game Area - Canvas and Chat */}
                <div className="grid lg:grid-cols-2 gap-4 mb-4">
                    {/* Drawing Canvas */}
                    <div>
                        <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                            {isDrawer && (
                                <div className="mb-2">
                                    {/* Colors Row */}
                                    <div className="flex items-center justify-center gap-1 mb-1.5">
                                        <input
                                            type="color"
                                            value={drawColor}
                                            onChange={(e) => setDrawColor(e.target.value)}
                                            className="w-6 h-6 rounded cursor-pointer border-0"
                                        />
                                        <button onClick={() => setDrawColor('#000000')} className={`w-5 h-5 bg-black rounded ${drawColor === '#000000' ? 'ring-2 ring-cyan-400' : 'border border-gray-600'}`} title="Black"></button>
                                        <button onClick={() => setDrawColor('#ffffff')} className={`w-5 h-5 bg-white rounded ${drawColor === '#ffffff' ? 'ring-2 ring-cyan-400' : 'border border-gray-400'}`} title="Eraser"></button>
                                        <button onClick={() => setDrawColor('#ff0000')} className={`w-5 h-5 bg-red-500 rounded ${drawColor === '#ff0000' ? 'ring-2 ring-cyan-400' : ''}`} title="Red"></button>
                                        <button onClick={() => setDrawColor('#ff6b00')} className={`w-5 h-5 bg-orange-500 rounded ${drawColor === '#ff6b00' ? 'ring-2 ring-cyan-400' : ''}`} title="Orange"></button>
                                        <button onClick={() => setDrawColor('#ffdd00')} className={`w-5 h-5 bg-yellow-400 rounded ${drawColor === '#ffdd00' ? 'ring-2 ring-cyan-400' : ''}`} title="Yellow"></button>
                                        <button onClick={() => setDrawColor('#00cc00')} className={`w-5 h-5 bg-green-500 rounded ${drawColor === '#00cc00' ? 'ring-2 ring-cyan-400' : ''}`} title="Green"></button>
                                        <button onClick={() => setDrawColor('#0066ff')} className={`w-5 h-5 bg-blue-500 rounded ${drawColor === '#0066ff' ? 'ring-2 ring-cyan-400' : ''}`} title="Blue"></button>
                                        <button onClick={() => setDrawColor('#8b00ff')} className={`w-5 h-5 bg-purple-600 rounded ${drawColor === '#8b00ff' ? 'ring-2 ring-cyan-400' : ''}`} title="Purple"></button>
                                        <button onClick={() => setDrawColor('#ff69b4')} className={`w-5 h-5 bg-pink-400 rounded ${drawColor === '#ff69b4' ? 'ring-2 ring-cyan-400' : ''}`} title="Pink"></button>
                                        <button onClick={() => setDrawColor('#8b4513')} className={`w-5 h-5 rounded ${drawColor === '#8b4513' ? 'ring-2 ring-cyan-400' : ''}`} style={{backgroundColor: '#8b4513'}} title="Brown"></button>
                                        <button onClick={() => setDrawColor('#808080')} className={`w-5 h-5 bg-gray-500 rounded ${drawColor === '#808080' ? 'ring-2 ring-cyan-400' : ''}`} title="Gray"></button>
                                    </div>
                                    {/* Size and Clear Row */}
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <span className={`${currentTheme.text} text-[0.6rem]`}>Size:</span>
                                            <input
                                                type="range"
                                                min="1"
                                                max="20"
                                                value={brushSize}
                                                onChange={(e) => setBrushSize(Number(e.target.value))}
                                                className="w-14"
                                            />
                                            <span className={`${currentTheme.text} text-[0.6rem] w-4`}>{brushSize}</span>
                                        </div>
                                        <button
                                            onClick={clearCanvas}
                                            className={`${theme === 'tron' ? 'bg-red-500/30 hover:bg-red-500/50 text-red-400' : theme === 'kids' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-red-700/40 hover:bg-red-700/60 text-red-400'} px-2 py-0.5 rounded font-semibold transition-all text-xs`}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="relative">
                                <canvas
                                    ref={canvasRef}
                                    width={800}
                                    height={600}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    className={`w-full bg-white rounded-xl ${isDrawer ? 'cursor-crosshair' : 'cursor-not-allowed'}`}
                                    style={{ maxHeight: '450px', touchAction: 'none' }}
                                />
                                {countdown > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-red-600/80 text-white rounded-full w-16 h-16 flex items-center justify-center font-black text-2xl animate-pulse shadow-lg shadow-red-500/50">
                                            {countdown}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat/Guessing Area - constrained to viewport */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-4 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 md:border-4 border-purple-400' : 'border border-orange-700'} flex flex-col fixed bottom-0 left-0 right-0 z-30 max-h-[30vh] rounded-b-none md:static md:max-h-none md:h-[500px] md:rounded-b-2xl`}>
                        <h3 className={`text-sm md:text-lg font-bold ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                            {isDrawer ? (theme === 'tron' ? '> GUESSES' : 'Guesses') : (theme === 'tron' ? '> YOUR_GUESS' : 'Your Guess')}
                        </h3>

                        {/* Messages - Oldest at top, newest at bottom, auto-scroll to bottom */}
                        <div className={`flex-1 overflow-y-auto mb-2 space-y-2 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                            {chatMessages.map((msg, idx) => {
                                const character = availableCharacters.find(c => c.id === msg.avatar) || availableCharacters[0];
                                return (
                                    <div
                                        key={idx}
                                        className={`${theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/30' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-orange-900/20 border border-orange-700/50'} rounded-lg p-3`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className="w-8 h-8">
                                                <CharacterSVG characterId={msg.avatar} size={32} color={character.color} />
                                            </div>
                                            <div className="flex-1">
                                                <div className={`font-bold text-sm ${currentTheme.text}`}>{msg.player}</div>
                                                <div className={`${currentTheme.textSecondary} text-sm`}>{msg.message}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Winner Announcement */}
                        {roundWinner !== null && roundWinner && (
                            <div className={`${theme === 'tron' ? 'bg-green-500/20 border-2 border-green-500' : theme === 'kids' ? 'bg-green-400 text-white' : 'bg-green-700/40 border-2 border-green-600'} rounded-xl p-4 mb-3 text-center animate-pulse`}>
                                <div className="text-2xl font-black mb-1">{roundWinner} WINS!</div>
                                {pointsEarned != null && pointsEarned > 0 && (
                                    <div className="text-lg font-bold mb-1">+{pointsEarned} pts each</div>
                                )}
                                <div className="text-sm opacity-80">
                                    {gameTimer <= 0 ? 'Next drawer starting...' : 'New word incoming...'}
                                </div>
                            </div>
                        )}
                        {roundWinner === null && pointsEarned !== null && !showTimerEndModal && (
                            <div className={`${theme === 'tron' ? 'bg-yellow-500/20 border-2 border-yellow-500' : theme === 'kids' ? 'bg-yellow-400 text-white' : 'bg-yellow-700/40 border-2 border-yellow-600'} rounded-xl p-4 mb-3 text-center animate-pulse`}>
                                <div className="text-2xl font-black mb-1">Round Finished!</div>
                                <div className="text-sm opacity-80">
                                    {currentRound >= totalRounds ? 'Game complete!' : 'Next drawer starting in 3s...'}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        {!isDrawer && pointsEarned === null && (
                            <div className="flex gap-2">
                                <input
                                    ref={chatInputRef}
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => !chatFrozen && setChatInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && !chatFrozen && !guessCooldown && sendMessage()}
                                    onFocus={handleInputFocus}
                                    placeholder={chatFrozen ? 'Guessing paused...' : guessCooldown ? 'Wait 5s...' : 'Type your guess...'}
                                    disabled={chatFrozen || guessCooldown}
                                    className={`flex-1 ${theme === 'tron' ? 'bg-gray-900 text-cyan-400 border border-cyan-500/30' : theme === 'kids' ? 'bg-white text-purple-900 border-2 border-purple-300' : 'bg-gray-900 text-orange-400 border border-orange-700/50'} px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${theme === 'tron' ? 'focus:ring-cyan-400' : theme === 'kids' ? 'focus:ring-purple-500' : 'focus:ring-orange-600'} ${chatFrozen || guessCooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={chatFrozen || guessCooldown}
                                    className={`${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} px-6 py-2 rounded-lg font-bold transition-all ${chatFrozen || guessCooldown ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {guessCooldown ? '...' : 'Send'}
                                </button>
                            </div>
                        )}

                        {isDrawer && pointsEarned === null && (
                            <button
                                onClick={() => {
                                    if (currentRoom?.id) socket.emit('pauseGame', { roomId: currentRoom.id, pickDuration: 5 });
                                    setSelectedWinnerCandidate(null);
                                    setShowPickWinner(true);
                                    startPickTimer(5);
                                }}
                                className={`w-full bg-green-500 hover:bg-green-400 ${theme === 'tron' ? 'text-black shadow-[0_0_20px_rgba(34,197,94,0.6)]' : theme === 'kids' ? 'text-white shadow-lg' : 'text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]'} font-bold py-3 rounded-xl transition-all text-sm animate-pulse`}
                            >
                                {theme === 'tron' ? '[ PICK_WINNER ]' : 'Pick Winner'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Pick Winner Modal */}
                {showPickWinner && isDrawer && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[80vh] flex flex-col ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'} relative`}>
                            {/* Pick timer countdown badge */}
                            {pickTimerCount > 0 && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/50`}>
                                        {pickTimerCount}
                                    </div>
                                </div>
                            )}
                            <h2 className={`text-xl md:text-2xl font-black ${currentTheme.text} mb-4 text-center ${currentTheme.font}`}>
                                {theme === 'tron' ? '> SELECT_WINNER' : 'Select the Winner'}
                            </h2>

                            <div className={`flex-1 overflow-y-auto space-y-2 mb-4 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                                {currentRoom?.players.filter(p => p.name !== playerName).map((player, idx) => {
                                    const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                                    const isSelected = selectedWinnerCandidate === player.name;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedWinnerCandidate(player.name)}
                                            className={`w-full ${isSelected ? (theme === 'tron' ? 'bg-cyan-500/30 border-2 border-cyan-400 ring-2 ring-cyan-400' : theme === 'kids' ? 'bg-green-200 border-2 border-green-500 ring-2 ring-green-400' : 'bg-orange-600/40 border-2 border-orange-500 ring-2 ring-orange-400') : (theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300 hover:bg-purple-200' : 'bg-orange-900/20 border border-orange-700/50 hover:bg-orange-900/30')} rounded-lg p-3 transition-all`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex-shrink-0">
                                                    <CharacterSVG characterId={player.avatar} size={40} color={character.color} />
                                                </div>
                                                <div className={`font-bold text-sm ${currentTheme.text} flex-1 text-left`}>{player.name}</div>
                                                {isSelected && (
                                                    <Check className={`w-5 h-5 ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-green-600' : 'text-orange-500'}`} />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        clearInterval(pickTimerRef.current);
                                        if (currentRoom?.id) socket.emit('resumeGame', { roomId: currentRoom.id });
                                        setShowPickWinner(false);
                                    }}
                                    className={`flex-1 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-gray-800 hover:bg-gray-700 text-orange-400'} font-bold py-3 rounded-xl transition-all`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => selectedWinnerCandidate && selectWinner(selectedWinnerCandidate)}
                                    disabled={!selectedWinnerCandidate}
                                    className={`flex-1 ${selectedWinnerCandidate ? (theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white') : 'bg-gray-600 text-gray-400 cursor-not-allowed'} font-bold py-3 rounded-xl transition-all`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Timer End Modal - Pick Winner */}
                {showTimerEndModal && isDrawer && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] flex flex-col ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'} relative`}>
                            {/* Pick timer countdown badge */}
                            {pickTimerCount > 0 && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/50`}>
                                        {pickTimerCount}
                                    </div>
                                </div>
                            )}
                            {/* Header */}
                            <div className="text-center mb-4">
                                <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                                    {theme === 'tron' ? '> TIME_EXPIRED' : "Time's Up!"}
                                </h2>
                                <p className={`${currentTheme.textSecondary} text-sm md:text-base`}>
                                    The word was: <span className={`font-black ${currentTheme.text}`}>{currentWord}</span>
                                </p>
                                <p className={`text-sm mt-2 font-bold text-yellow-400`}>
                                    50 pts (time penalty)
                                </p>
                                <p className={`${currentTheme.textSecondary} text-sm mt-1`}>
                                    Select a player to award the win, or choose No Winner
                                </p>
                            </div>

                            {/* Player list with guesses */}
                            <div className={`flex-1 overflow-y-auto space-y-2 mb-4 ${theme === 'tron' ? 'scrollbar-tron' : theme === 'kids' ? 'scrollbar-kids' : 'scrollbar-scary'}`}>
                                {(() => {
                                    const players = currentRoom?.players.filter(p => p.name !== playerName) || [];
                                    if (players.length === 0) return (
                                        <div className={`${currentTheme.textSecondary} text-center py-8`}>No other players</div>
                                    );
                                    return players.map((player, idx) => {
                                        const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                                        const playerGuesses = chatMessages.filter(m => m.player === player.name);
                                        const isSelected = selectedWinnerCandidate === player.name;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedWinnerCandidate(player.name)}
                                                className={`w-full ${isSelected ? (theme === 'tron' ? 'bg-cyan-500/30 border-2 border-cyan-400 ring-2 ring-cyan-400' : theme === 'kids' ? 'bg-green-200 border-2 border-green-500 ring-2 ring-green-400' : 'bg-orange-600/40 border-2 border-orange-500 ring-2 ring-orange-400') : (theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300 hover:bg-purple-200' : 'bg-orange-900/20 border border-orange-700/50 hover:bg-orange-900/30')} rounded-lg p-3 transition-all`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 flex-shrink-0">
                                                        <CharacterSVG characterId={player.avatar} size={40} color={character.color} />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <div className={`font-bold text-sm ${currentTheme.text}`}>{player.name}</div>
                                                        {playerGuesses.length > 0 ? (
                                                            <div className={`${currentTheme.textSecondary} text-xs mt-1`}>
                                                                {playerGuesses.map(g => g.message).join(', ')}
                                                            </div>
                                                        ) : (
                                                            <div className={`${currentTheme.textSecondary} text-xs mt-1 italic`}>No guesses</div>
                                                        )}
                                                    </div>
                                                    {isSelected && (
                                                        <Check className={`w-5 h-5 ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-green-600' : 'text-orange-500'}`} />
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    });
                                })()}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        clearInterval(pickTimerRef.current);
                                        setShowTimerEndModal(false);
                                        if (currentRoom?.id) {
                                            socket.emit('noWinner', { roomId: currentRoom.id });
                                        }
                                    }}
                                    className={`flex-1 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-gray-800 hover:bg-gray-700 text-orange-400'} font-bold py-3 rounded-xl transition-all`}
                                >
                                    No Winner
                                </button>
                                <button
                                    onClick={() => selectedWinnerCandidate && selectWinner(selectedWinnerCandidate, true)}
                                    disabled={!selectedWinnerCandidate}
                                    className={`flex-1 ${selectedWinnerCandidate ? (theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white') : 'bg-gray-600 text-gray-400 cursor-not-allowed'} font-bold py-3 rounded-xl transition-all`}
                                >
                                    Confirm Winner
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rules Modal - shown at start of each round */}
                {showRulesModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-md w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'} relative`}>
                            {/* Countdown badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/50`}>
                                    {countdown}
                                </div>
                            </div>
                            <div className="text-center mb-4">
                                <div className={`text-4xl mb-3`}>{isDrawer ? '🎨' : '🔍'}</div>
                                <h2 className={`text-xl md:text-2xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                                    {isDrawer
                                        ? (theme === 'tron' ? '> YOU_ARE_THE_DRAWER' : "You're the Drawer!")
                                        : (theme === 'tron' ? '> YOU_ARE_A_GUESSER' : "You're a Guesser!")
                                    }
                                </h2>
                            </div>
                            <div className={`space-y-3 mb-6 ${currentTheme.textSecondary} text-sm`}>
                                {isDrawer ? (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">✏️</span>
                                            <p>Choose your word below and <strong className={currentTheme.text}>draw it</strong> on the canvas for others to guess.</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">👀</span>
                                            <p>When someone gets close enough, tap <strong className={currentTheme.text}>"Pick Winner"</strong>. Close guesses count!</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">⚡</span>
                                            <p>Points increase with each pick. <strong className={currentTheme.text}>Pick as many winners as you can</strong> for maximum points!</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">👀</span>
                                            <p>Watch the drawing appear on the canvas. <strong className={currentTheme.text}>Try to figure out</strong> what is being drawn.</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">💬</span>
                                            <p>Type your guesses in the chat and hit <strong className={currentTheme.text}>Send</strong>. <strong className={currentTheme.text}>Close guesses count!</strong></p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">⚡</span>
                                            <p>Points increase with each pick for you and the drawer. Keep guessing until time runs out!</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Word Picker for Drawer */}
                            {isDrawer && showWordPicker && wordOptions.length > 0 && !wordSelected && (
                                <div className={`mb-6 p-4 rounded-xl ${theme === 'tron' ? 'bg-gray-800/50 border border-cyan-500/30' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-gray-900/50 border border-orange-700/30'}`}>
                                    <p className={`text-sm font-bold ${currentTheme.text} mb-3 text-center`}>
                                        {theme === 'tron' ? '> SELECT_YOUR_WORD' : 'Pick your word:'}
                                    </p>
                                    <div className="space-y-2">
                                        {wordOptions.map((option, idx) => {
                                            const colors = getDifficultyColors(option.difficulty);
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSelectWord(option.word)}
                                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] ${
                                                        theme === 'tron'
                                                            ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                                                            : theme === 'kids'
                                                                ? 'bg-white hover:bg-purple-50 text-purple-900 border-2 border-purple-300'
                                                                : 'bg-gray-800 hover:bg-gray-700 text-orange-400 border border-orange-700/50'
                                                    }`}
                                                >
                                                    <span className="text-left flex-1">{option.word}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-lg ${colors.bg} ${colors.text}`}>
                                                        {option.difficultyLabel}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Word Selected Confirmation for Drawer */}
                            {isDrawer && wordSelected && currentWord && (
                                <div className={`mb-6 p-4 rounded-xl text-center ${theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500/50' : theme === 'kids' ? 'bg-green-100 border-2 border-green-400' : 'bg-green-900/30 border border-green-700/50'}`}>
                                    <p className={`text-sm ${currentTheme.textSecondary} mb-1`}>Your word:</p>
                                    <p className={`text-2xl font-black ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-green-600' : 'text-green-400'}`}>
                                        {currentWord}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => setShowRulesModal(false)}
                                className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all text-lg`}
                            >
                                {theme === 'tron' ? '[ GOT_IT ]' : "Got it — Let's go!"}
                            </button>
                        </div>
                    </div>
                )}

                {/* End Game Confirmation Modal */}
                {showEndGameConfirm && isMaster && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-sm w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                            <div className="text-center mb-4">
                                <div className="text-4xl mb-3">&#9888;&#65039;</div>
                                <h2 className={`text-xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                                    {theme === 'tron' ? '> END_GAME' : 'End Game?'}
                                </h2>
                                <p className={`${currentTheme.textSecondary} text-sm`}>
                                    All points earned in this game will be <strong className="text-red-400">lost and not recorded</strong>. All players will return to the game room.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowEndGameConfirm(false)}
                                    className={`flex-1 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-gray-800 hover:bg-gray-700 text-orange-400'} font-bold py-3 rounded-xl transition-all`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (currentRoom?.id) {
                                            socket.emit('endGameEarly', { roomId: currentRoom.id });
                                        }
                                        setShowEndGameConfirm(false);
                                    }}
                                    className={`flex-1 ${theme === 'tron' ? 'bg-red-600 hover:bg-red-500 text-white' : theme === 'kids' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-red-700 hover:bg-red-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                                >
                                    End Game
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Drawer Picking Overlay - visible to non-drawer when game is paused */}
                {pauseCountdown > 0 && !isDrawer && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 pointer-events-none">
                        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-sm w-full mx-4 text-center ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${theme === 'tron' ? 'bg-cyan-500/20 border-2 border-cyan-500' : theme === 'kids' ? 'bg-purple-200 border-2 border-purple-400' : 'bg-orange-700/20 border-2 border-orange-600'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}>
                                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
                                </svg>
                            </div>
                            <h2 className={`text-lg md:text-xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                                {theme === 'tron' ? '> DRAWER_SELECTING' : 'Drawer is picking a winner!'}
                            </h2>
                            <p className={`${currentTheme.textSecondary} text-sm mb-3`}>
                                New drawing inbound!
                            </p>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl mx-auto ${theme === 'tron' ? 'bg-cyan-500/30 text-cyan-400 border-2 border-cyan-500' : theme === 'kids' ? 'bg-purple-200 text-purple-700 border-2 border-purple-400' : 'bg-orange-700/30 text-orange-400 border-2 border-orange-600'} animate-pulse`}>
                                {pauseCountdown}
                            </div>
                        </div>
                    </div>
                )}

                {/* Players List at Bottom - Drawing Order */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-2 md:border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                    <h3 className={`text-sm md:text-lg font-bold ${currentTheme.text} mb-3 ${currentTheme.font}`}>
                        {theme === 'tron' ? '> DRAWING_ORDER' : 'Drawing Order'}
                    </h3>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {(drawingOrder.length > 0 ? drawingOrder : currentRoom?.players || []).map((player, idx) => {
                            const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                            const isCurrentDrawer = player.name === drawerName;
                            const isDone = idx < currentRound - 1;
                            const isUpNext = idx > currentRound - 1 && !isCurrentDrawer;
                            const orderNumber = idx + 1;
                            const roomPlayer = currentRoom?.players?.find(p => p.name === player.name);
                            const playerScore = roomPlayer?.score || 0;
                            const isDisconnected = roomPlayer?.connected === false;
                            const isMe = player.name === playerName;
                            const canManage = isMaster && !isMe;
                            return (
                                <div key={idx} className="flex flex-col items-center gap-1">
                                    <div
                                        className={`${isDisconnected ? 'opacity-50 grayscale' : ''} ${isCurrentDrawer ? (theme === 'tron' ? 'bg-cyan-500/30 border-2 border-cyan-400 ring-2 ring-cyan-400 scale-110' : theme === 'kids' ? 'bg-yellow-200 border-2 border-yellow-500 ring-2 ring-yellow-400 scale-110' : 'bg-orange-600/40 border-2 border-orange-500 ring-2 ring-orange-400 scale-110') : isDone ? (theme === 'tron' ? 'bg-gray-800/50 border border-gray-700 opacity-60' : theme === 'kids' ? 'bg-gray-200 border-2 border-gray-300 opacity-60' : 'bg-gray-900/50 border border-gray-700 opacity-60') : (theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/30' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-orange-900/20 border border-orange-700/50')} rounded-lg p-2 flex items-center gap-2 transition-all relative`}
                                    >
                                        {/* Order Number / Checkmark Badge */}
                                        <div className={`absolute -top-2 -left-2 w-5 h-5 md:w-6 md:h-6 rounded-full ${isDone ? (theme === 'tron' ? 'bg-green-600 text-white' : theme === 'kids' ? 'bg-green-500 text-white' : 'bg-green-700 text-white') : isCurrentDrawer ? (theme === 'tron' ? 'bg-cyan-400 text-black' : theme === 'kids' ? 'bg-yellow-500 text-white' : 'bg-orange-500 text-white') : (theme === 'tron' ? 'bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-400 text-white' : 'bg-gray-800 text-orange-400')} font-bold text-xs flex items-center justify-center`}>
                                            {isDone ? <Check className="w-3 h-3" /> : orderNumber}
                                        </div>

                                        {/* Offline Badge */}
                                        {isDisconnected && (
                                            <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-600 text-white font-bold text-[0.6rem] flex items-center justify-center" title="Offline">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                                                    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                                                    <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                                                    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                                                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                                                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                                                </svg>
                                            </div>
                                        )}

                                        <div className="w-10 h-10 md:w-12 md:h-12">
                                            <CharacterSVG characterId={player.avatar} size={48} color={isDisconnected ? '#666' : character.color} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-bold text-xs md:text-sm ${currentTheme.text} truncate`}>{player.name}</div>
                                            <div className="text-[0.6rem] md:text-xs font-bold text-yellow-400">{playerScore} pts</div>
                                            {isDisconnected && (
                                                <div className="text-[0.6rem] md:text-xs text-red-400 font-semibold">
                                                    Offline
                                                </div>
                                            )}
                                            {!isDisconnected && isCurrentDrawer && (
                                                <div className={`text-[0.6rem] md:text-xs ${theme === 'tron' ? 'text-cyan-300' : theme === 'kids' ? 'text-yellow-700' : 'text-orange-400'} font-semibold`}>
                                                    Drawing Now
                                                </div>
                                            )}
                                            {!isDisconnected && isDone && (
                                                <div className={`text-[0.6rem] md:text-xs ${theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-green-600' : 'text-green-500'}`}>
                                                    Done
                                                </div>
                                            )}
                                            {!isDisconnected && isUpNext && (
                                                <div className={`text-[0.6rem] md:text-xs ${currentTheme.textSecondary}`}>
                                                    #{orderNumber}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Master-only Kick/Skip buttons */}
                                    {canManage && (
                                        <div className="flex gap-1 mt-1">
                                            {isCurrentDrawer && (
                                                <button
                                                    onClick={() => setConfirmAction({ type: 'skip', playerName: player.name })}
                                                    className={`${theme === 'tron' ? 'bg-yellow-600/80 hover:bg-yellow-600 text-black' : theme === 'kids' ? 'bg-yellow-500 hover:bg-yellow-400 text-white' : 'bg-yellow-700 hover:bg-yellow-600 text-white'} px-2 py-0.5 rounded text-[0.6rem] font-bold transition-all`}
                                                    title="Skip this player's turn"
                                                >
                                                    Skip
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setConfirmAction({ type: 'kick', playerName: player.name })}
                                                className={`${theme === 'tron' ? 'bg-red-600/80 hover:bg-red-600 text-white' : theme === 'kids' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-red-700 hover:bg-red-600 text-white'} px-2 py-0.5 rounded text-[0.6rem] font-bold transition-all`}
                                                title="Kick player from room"
                                            >
                                                Kick
                                            </button>
                                        </div>
                                    )}
                                    {/* Master can skip their own turn when drawing */}
                                    {isMaster && isMe && isCurrentDrawer && (
                                        <div className="flex gap-1 mt-1">
                                            <button
                                                onClick={() => setConfirmAction({ type: 'skipSelf', playerName: player.name })}
                                                className={`${theme === 'tron' ? 'bg-yellow-600/80 hover:bg-yellow-600 text-black' : theme === 'kids' ? 'bg-yellow-500 hover:bg-yellow-400 text-white' : 'bg-yellow-700 hover:bg-yellow-600 text-white'} px-2 py-0.5 rounded text-[0.6rem] font-bold transition-all`}
                                                title="Skip your own turn"
                                            >
                                                Skip My Turn
                                            </button>
                                        </div>
                                    )}
                                    {/* End Game button - Master only, below their avatar */}
                                    {isMaster && isMe && (
                                        <button
                                            onClick={() => setShowEndGameConfirm(true)}
                                            className={`${theme === 'tron' ? 'bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30' : theme === 'kids' ? 'bg-red-400 hover:bg-red-500 text-white' : 'bg-red-700/30 hover:bg-red-700/50 text-red-400 border border-red-700/50'} px-2 py-0.5 rounded text-[0.6rem] font-bold transition-all mt-1`}
                                        >
                                            End Game
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Kick/Skip Confirmation Modal */}
                {confirmAction && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-sm w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                            <div className="text-center mb-4">
                                <div className="text-4xl mb-3">{confirmAction.type === 'kick' ? '🚪' : '⏭️'}</div>
                                <h2 className={`text-xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                                    {confirmAction.type === 'kick'
                                        ? (theme === 'tron' ? '> KICK_PLAYER' : 'Kick Player?')
                                        : confirmAction.type === 'skipSelf'
                                        ? (theme === 'tron' ? '> SKIP_YOUR_TURN' : 'Skip Your Turn?')
                                        : (theme === 'tron' ? '> SKIP_TURN' : 'Skip Turn?')
                                    }
                                </h2>
                                <p className={`${currentTheme.textSecondary} text-sm`}>
                                    {confirmAction.type === 'kick'
                                        ? <>Are you sure you want to <strong className="text-red-400">kick {confirmAction.playerName}</strong> from the room? They will be removed from the game.</>
                                        : confirmAction.type === 'skipSelf'
                                        ? <>Are you sure you want to <strong className="text-yellow-400">skip your own</strong> drawing turn? The next player will draw.</>
                                        : <>Are you sure you want to <strong className="text-yellow-400">skip {confirmAction.playerName}'s</strong> drawing turn?</>
                                    }
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    className={`flex-1 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-gray-800 hover:bg-gray-700 text-orange-400'} font-bold py-3 rounded-xl transition-all`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => confirmAction.type === 'kick'
                                        ? handleKickPlayer(confirmAction.playerName)
                                        : handleSkipTurn(confirmAction.playerName)
                                    }
                                    className={`flex-1 ${confirmAction.type === 'kick'
                                        ? (theme === 'tron' ? 'bg-red-600 hover:bg-red-500 text-white' : theme === 'kids' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-red-700 hover:bg-red-600 text-white')
                                        : (theme === 'tron' ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : theme === 'kids' ? 'bg-yellow-500 hover:bg-yellow-400 text-white' : 'bg-yellow-700 hover:bg-yellow-600 text-white')
                                    } font-bold py-3 rounded-xl transition-all`}
                                >
                                    {confirmAction.type === 'kick' ? 'Kick' : 'Skip'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Correct Guesses List */}
                {correctGuesses.length > 0 && (
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-2 md:border-4 border-purple-400' : 'border-2 border-orange-700'} mt-4`}>
                        <h3 className={`text-sm md:text-lg font-bold ${currentTheme.text} mb-3 ${currentTheme.font}`}>
                            {theme === 'tron' ? '> CORRECT_GUESSES' : 'Correct Guesses'}
                        </h3>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {correctGuesses.map((guess, idx) => {
                                const winnerPlayer = currentRoom?.players?.find(p => p.name === guess.winnerName);
                                const character = availableCharacters.find(c => c.id === winnerPlayer?.avatar) || availableCharacters[0];
                                return (
                                    <div
                                        key={idx}
                                        className={`${theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/30' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-orange-900/20 border border-orange-700/50'} rounded-lg p-2 transition-all relative`}
                                    >
                                        {/* Order Badge */}
                                        <div className={`absolute -top-2 -left-2 w-5 h-5 md:w-6 md:h-6 rounded-full ${theme === 'tron' ? 'bg-green-600 text-white' : theme === 'kids' ? 'bg-green-500 text-white' : 'bg-green-700 text-white'} font-bold text-xs flex items-center justify-center`}>
                                            {idx + 1}
                                        </div>

                                        <div className={`font-bold text-xs md:text-sm ${currentTheme.text} truncate`}>{guess.winnerName}</div>
                                        <div className="text-[0.6rem] md:text-xs font-bold text-yellow-400">+{guess.points} pts</div>
                                        <div className={`text-[0.6rem] md:text-xs ${currentTheme.textSecondary} truncate mt-0.5`}>
                                            <span className="opacity-70">word:</span> {guess.word}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Winner Celebration Modal - Podium Style */}
            {showWinnerCelebration && finalScores.length > 0 && (() => {
                const winner = finalScores[0];
                const second = finalScores[1];
                const third = finalScores[2];
                const isWinner = winner?.name === playerName;
                const winnerChar = availableCharacters?.find(c => c.id === winner?.avatar) || availableCharacters?.[0];
                const secondChar = second ? availableCharacters?.find(c => c.id === second?.avatar) || availableCharacters?.[0] : null;
                const thirdChar = third ? availableCharacters?.find(c => c.id === third?.avatar) || availableCharacters?.[0] : null;

                // Generate confetti items
                const confettiItems = [...Array(30)].map((_, i) => ({
                    id: i,
                    emoji: ['🎉', '🎊', '⭐', '✨', '🏆', '🎨', '✏️'][Math.floor(Math.random() * 7)],
                    left: `${Math.random() * 100}%`,
                    delay: `${Math.random() * 2}s`,
                    duration: `${2 + Math.random() * 2}s`
                }));

                // Generate gold coins
                const goldCoins = [...Array(15)].map((_, i) => ({
                    id: i,
                    left: `${Math.random() * 100}%`,
                    delay: `${Math.random() * 2.5}s`,
                    duration: `${2.5 + Math.random() * 1.5}s`
                }));

                return (
                    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-fadeIn">
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

                        <div className="text-center p-4 md:p-6 animate-scaleIn max-w-2xl w-full">
                            {/* Header */}
                            <div className="text-5xl md:text-7xl mb-2 animate-bounce">🏆</div>
                            <h1
                                className={`text-2xl md:text-4xl font-black mb-1 ${
                                    theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'
                                } ${currentTheme.font}`}
                                style={{ textShadow: '0 0 30px currentColor' }}
                            >
                                {theme === 'tron' ? '> GAME_OVER' : 'Game Over!'}
                            </h1>
                            <p className={`text-lg md:text-xl font-bold mb-6 ${currentTheme.text}`}>
                                {isWinner ? 'Congratulations, you won!' : `${winner?.name} wins!`}
                            </p>

                            {/* Podium */}
                            <div className="flex items-end justify-center gap-2 md:gap-4 mb-6">
                                {/* 2nd Place - Left */}
                                {second && (
                                    <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.3s' }}>
                                        <div className="text-2xl md:text-3xl mb-1">🥈</div>
                                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ring-3 ${
                                            theme === 'tron' ? 'ring-gray-400 bg-gray-500/20' : theme === 'kids' ? 'ring-gray-400 bg-gray-200' : 'ring-gray-500 bg-gray-800/50'
                                        } mb-2`}>
                                            <CharacterSVG characterId={second.avatar} size={theme === 'tron' ? 56 : 50} color={secondChar?.color || '#9ca3af'} />
                                        </div>
                                        <div className={`font-bold text-sm md:text-base ${currentTheme.text} truncate max-w-20 md:max-w-24`}>
                                            {second.name}
                                        </div>
                                        <div className="text-gray-400 font-bold text-xs md:text-sm">{second.score} pts</div>
                                        {/* Podium block */}
                                        <div className={`w-20 md:w-24 h-16 md:h-20 mt-2 rounded-t-lg ${
                                            theme === 'tron' ? 'bg-gray-600/50 border-t-2 border-x-2 border-gray-500' : theme === 'kids' ? 'bg-gray-300' : 'bg-gray-700'
                                        } flex items-center justify-center`}>
                                            <span className="text-2xl md:text-3xl font-black text-gray-400">2</span>
                                        </div>
                                    </div>
                                )}

                                {/* 1st Place - Center */}
                                <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.1s' }}>
                                    <div className="text-3xl md:text-4xl mb-1 animate-pulse">🥇</div>
                                    <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center ring-4 ${
                                        theme === 'tron' ? 'ring-yellow-400 bg-yellow-500/20' : theme === 'kids' ? 'ring-yellow-400 bg-yellow-200' : 'ring-yellow-500 bg-yellow-900/30'
                                    } mb-2 relative`}>
                                        <CharacterSVG characterId={winner.avatar} size={theme === 'tron' ? 88 : 80} color={winnerChar?.color || '#fbbf24'} />
                                        {/* Crown */}
                                        <div className="absolute -top-3 text-2xl md:text-3xl animate-bounce">👑</div>
                                    </div>
                                    <div className={`font-black text-lg md:text-xl ${
                                        theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'
                                    } truncate max-w-28 md:max-w-32`}>
                                        {winner.name}
                                    </div>
                                    <div className={`font-black text-xl md:text-2xl ${
                                        theme === 'tron' ? 'text-yellow-300' : theme === 'kids' ? 'text-yellow-500' : 'text-yellow-300'
                                    }`}>
                                        {winner.score} pts
                                    </div>
                                    {/* Podium block */}
                                    <div className={`w-24 md:w-32 h-24 md:h-28 mt-2 rounded-t-lg ${
                                        theme === 'tron' ? 'bg-yellow-600/30 border-t-2 border-x-2 border-yellow-500' : theme === 'kids' ? 'bg-yellow-300' : 'bg-yellow-800/50'
                                    } flex items-center justify-center`}>
                                        <span className={`text-3xl md:text-4xl font-black ${
                                            theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-700' : 'text-yellow-400'
                                        }`}>1</span>
                                    </div>
                                </div>

                                {/* 3rd Place - Right */}
                                {third && (
                                    <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '0.5s' }}>
                                        <div className="text-xl md:text-2xl mb-1">🥉</div>
                                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center ring-2 ${
                                            theme === 'tron' ? 'ring-orange-600 bg-orange-600/20' : theme === 'kids' ? 'ring-orange-400 bg-orange-200' : 'ring-orange-700 bg-orange-900/30'
                                        } mb-2`}>
                                            <CharacterSVG characterId={third.avatar} size={theme === 'tron' ? 44 : 40} color={thirdChar?.color || '#ea580c'} />
                                        </div>
                                        <div className={`font-bold text-xs md:text-sm ${currentTheme.text} truncate max-w-16 md:max-w-20`}>
                                            {third.name}
                                        </div>
                                        <div className="text-orange-400 font-bold text-xs">{third.score} pts</div>
                                        {/* Podium block */}
                                        <div className={`w-16 md:w-20 h-12 md:h-14 mt-2 rounded-t-lg ${
                                            theme === 'tron' ? 'bg-orange-700/30 border-t-2 border-x-2 border-orange-600' : theme === 'kids' ? 'bg-orange-300' : 'bg-orange-900/50'
                                        } flex items-center justify-center`}>
                                            <span className="text-xl md:text-2xl font-black text-orange-500">3</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Other players (4th onwards) */}
                            {finalScores.length > 3 && (
                                <div className={`${currentTheme.cardBg} rounded-xl p-3 mb-4 max-w-md mx-auto`}>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {finalScores.slice(3).map((player, idx) => (
                                            <div key={player.name} className={`${
                                                theme === 'tron' ? 'bg-gray-800/50 border border-gray-700' : theme === 'kids' ? 'bg-purple-100 border border-purple-200' : 'bg-gray-800 border border-gray-700'
                                            } rounded-lg px-3 py-1.5 flex items-center gap-2`}>
                                                <span className={`text-xs font-bold ${currentTheme.textSecondary}`}>#{idx + 4}</span>
                                                <span className={`text-sm font-bold ${currentTheme.text}`}>{player.name}</span>
                                                <span className="text-xs text-yellow-400">{player.score}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Countdown and button */}
                            <div className={`text-sm mb-3 ${currentTheme.textSecondary}`}>
                                Returning to room in {celebrationCountdown}...
                            </div>
                            <button
                                onClick={() => setShowWinnerCelebration(false)}
                                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${
                                    theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-600 hover:bg-orange-500 text-white'
                                }`}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default PictionaryGame;
