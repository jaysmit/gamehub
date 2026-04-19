import React, { useState, useEffect, useRef } from 'react';
import { CharacterSVG } from '../icons/CharacterSVGs';
import { socket, getServerTime } from '../socket';
import GameMasterControls from '../components/GameMasterControls';
import WinnerCelebration from '../components/WinnerCelebration';
import {
    MEMORY_DIFFICULTY_CONFIG,
    CHALLENGE_TYPE_NAMES,
    CHALLENGE_INSTRUCTIONS
} from '../data/memoryContent';

const MemoryGame = ({ theme, currentTheme, playerName, selectedAvatar, availableCharacters, currentRoom, isMuted, isMaster }) => {
    // Game state
    const [phase, setPhase] = useState('rules');  // rules, display, question, reveal, recap, speedRound, speedRecap, finalRecap
    const [challengeType, setChallengeType] = useState('match');
    const [currentRound, setCurrentRound] = useState(1);
    const [totalRounds, setTotalRounds] = useState(4);
    const [challengeNumber, setChallengeNumber] = useState(1);
    const [totalChallenges, setTotalChallenges] = useState(3);
    const [isSpeedRound, setIsSpeedRound] = useState(false);
    const [standings, setStandings] = useState([]);
    const [showWinnerCelebration, setShowWinnerCelebration] = useState(false);

    // Challenge data
    const [challengeData, setChallengeData] = useState(null);
    const [showItems, setShowItems] = useState(true);
    const [question, setQuestion] = useState('');
    const [answerOptions, setAnswerOptions] = useState([]);

    // Player interaction
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [answeredPlayers, setAnsweredPlayers] = useState([]);

    // Timers
    const [displayTimer, setDisplayTimer] = useState(5);
    const [questionTimer, setQuestionTimer] = useState(10);
    const [rulesTimer, setRulesTimer] = useState(10);
    const [speedRoundTimer, setSpeedRoundTimer] = useState(60);

    // Timer refs (absolute end times)
    const displayEndTimeRef = useRef(null);
    const questionEndTimeRef = useRef(null);
    const rulesEndTimeRef = useRef(null);
    const speedRoundEndTimeRef = useRef(null);
    const roomIdRef = useRef(currentRoom?.id);

    // Reveal state
    const [revealData, setRevealData] = useState(null);

    // Recap state
    const [recapData, setRecapData] = useState(null);
    const [recapAnimPhase, setRecapAnimPhase] = useState(0);
    const [revealedPlayers, setRevealedPlayers] = useState({});
    const [animatedPointValues, setAnimatedPointValues] = useState({});
    const [animatedStandings, setAnimatedStandings] = useState([]);
    const [flyingPoints, setFlyingPoints] = useState([]);
    const [finalData, setFinalData] = useState(null);

    // Frozen scoreboard
    const [previousRoundScores, setPreviousRoundScores] = useState({});

    // Difficulty group state
    const [isActiveGroup, setIsActiveGroup] = useState(true);
    const [groupInfo, setGroupInfo] = useState(null);
    const [waitingFor, setWaitingFor] = useState(null);
    const [difficulty, setDifficulty] = useState(null);
    const [difficultyLabel, setDifficultyLabel] = useState(null);

    // Ready state
    const [readyPlayers, setReadyPlayers] = useState([]);
    const [isReady, setIsReady] = useState(false);

    // Speed round state
    const [sequenceItems, setSequenceItems] = useState([]);
    const [sequenceInput, setSequenceInput] = useState([]);
    const [showingSequence, setShowingSequence] = useState(false);
    const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
    const [speedFeedback, setSpeedFeedback] = useState(null);
    const [speedFeedbackDetails, setSpeedFeedbackDetails] = useState(null);
    const [speedStats, setSpeedStats] = useState({ correct: 0, total: 0, points: 0 });
    const [speedProgress, setSpeedProgress] = useState({});

    // Speed recap / race state
    const [raceData, setRaceData] = useState(null);
    const [raceStep, setRaceStep] = useState(0);
    const [raceStarted, setRaceStarted] = useState(false);
    const [raceComplete, setRaceComplete] = useState(false);

    // Match game state (Round 1)
    const [matchGrid, setMatchGrid] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);  // indices of matched cards
    const [flippedCards, setFlippedCards] = useState([]);  // indices of currently flipped cards (max 2)
    const [canFlip, setCanFlip] = useState(false);         // whether player can flip cards
    const [matchTimer, setMatchTimer] = useState(60);
    const [matchPoints, setMatchPoints] = useState(0);
    const [matchMistakes, setMatchMistakes] = useState(0);
    const [matchComplete, setMatchComplete] = useState(false);
    const matchEndTimeRef = useRef(null);

    // Modals
    const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);

    // Debug mode
    const [showDebugSkip, setShowDebugSkip] = useState(false);

    // Keep roomIdRef in sync
    useEffect(() => { roomIdRef.current = currentRoom?.id; }, [currentRoom?.id]);

    // Request game sync on mount
    useEffect(() => {
        if (currentRoom?.id) {
            const timer = setTimeout(() => {
                socket.emit('requestGameSync', { roomId: currentRoom.id });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, []);

    // Handle visibility change - request sync when returning
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && currentRoom?.id) {
                socket.emit('requestGameSync', { roomId: currentRoom.id });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [currentRoom?.id]);

    // Timer tick effect for display phase
    useEffect(() => {
        if (phase !== 'display' || !displayEndTimeRef.current) return;

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((displayEndTimeRef.current - getServerTime()) / 1000));
            setDisplayTimer(remaining);
        }, 100);

        return () => clearInterval(interval);
    }, [phase]);

    // Timer tick effect for question phase with fallback sync
    useEffect(() => {
        if (phase !== 'question' || !questionEndTimeRef.current) return;

        let syncRequested = false;

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((questionEndTimeRef.current - getServerTime()) / 1000));
            setQuestionTimer(remaining);

            // Request sync if timer reached 0 and we haven't transitioned yet
            if (remaining <= 0 && !syncRequested) {
                syncRequested = true;
                setTimeout(() => {
                    if (phase === 'question' && roomIdRef.current) {
                        console.log('[MEMORY] Question timer hit 0, requesting sync');
                        socket.emit('requestGameSync', { roomId: roomIdRef.current });
                    }
                }, 2000);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [phase]);

    // Timer tick effect for rules phase
    useEffect(() => {
        if (phase !== 'rules' || !rulesEndTimeRef.current) return;

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((rulesEndTimeRef.current - getServerTime()) / 1000));
            setRulesTimer(remaining);
        }, 100);

        return () => clearInterval(interval);
    }, [phase]);

    // Speed round timer with fallback sync
    useEffect(() => {
        if (phase !== 'speedRound' || !speedRoundEndTimeRef.current) return;

        let syncRequested = false;

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((speedRoundEndTimeRef.current - getServerTime()) / 1000));
            setSpeedRoundTimer(remaining);

            // Request sync if timer reached 0 and we haven't transitioned yet
            if (remaining <= 0 && !syncRequested) {
                syncRequested = true;
                // Give server a moment to send the event, then request sync
                setTimeout(() => {
                    if (phase === 'speedRound' && roomIdRef.current) {
                        console.log('[MEMORY] Speed round timer hit 0, requesting sync');
                        socket.emit('requestGameSync', { roomId: roomIdRef.current });
                    }
                }, 2000);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [phase]);

    // Match game: transition from display to match phase when display timer expires
    useEffect(() => {
        if (phase !== 'display' || challengeType !== 'match' || !displayEndTimeRef.current) return;

        const checkTimer = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((displayEndTimeRef.current - getServerTime()) / 1000));
            if (remaining <= 0) {
                clearInterval(checkTimer);
                // Transition to match phase
                setPhase('match');
                setShowItems(false);  // Flip cards face-down
                setCanFlip(true);
                // Set match timer (60 seconds default)
                const matchDuration = challengeData?.matchTimeLimit || 60000;
                matchEndTimeRef.current = getServerTime() + matchDuration;
            }
        }, 100);

        return () => clearInterval(checkTimer);
    }, [phase, challengeType, challengeData]);

    // Match game timer
    useEffect(() => {
        if (phase !== 'match' || !matchEndTimeRef.current) return;

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((matchEndTimeRef.current - getServerTime()) / 1000));
            setMatchTimer(remaining);

            // Time's up - submit results
            if (remaining <= 0 && !matchComplete) {
                setMatchComplete(true);
                setCanFlip(false);
                handleMatchComplete();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [phase, matchComplete]);

    // Check if all pairs are matched
    useEffect(() => {
        if (phase !== 'match' || matchComplete) return;

        const totalPairs = challengeData?.numPairs || 0;
        if (matchedPairs.length === totalPairs * 2 && totalPairs > 0) {
            // All pairs matched!
            setMatchComplete(true);
            setCanFlip(false);
            // Time bonus: 4 points per second remaining (only for completion)
            const timeBonus = matchTimer * 4;
            const finalPoints = matchPoints + timeBonus;
            setMatchPoints(finalPoints);
            handleMatchComplete(finalPoints, true, timeBonus);
        }
    }, [matchedPairs, phase, matchComplete, matchPoints, matchTimer, challengeData]);

    // Handle card flips for match game
    const handleCardFlip = (index) => {
        if (!canFlip || matchComplete) return;
        if (matchedPairs.includes(index)) return;  // Already matched
        if (flippedCards.includes(index)) return;  // Already flipped
        if (flippedCards.length >= 2) return;  // Max 2 cards flipped

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        // If two cards flipped, check for match
        if (newFlipped.length === 2) {
            setCanFlip(false);  // Prevent more flips while checking
            const [first, second] = newFlipped;
            const isMatch = matchGrid[first] === matchGrid[second];

            setTimeout(() => {
                if (isMatch) {
                    // Matched! Add to matched pairs
                    setMatchedPairs(prev => [...prev, first, second]);
                    setMatchPoints(prev => prev + (challengeData?.pointsPerPair || 50));
                } else {
                    // Not a match
                    setMatchMistakes(prev => prev + 1);
                }
                setFlippedCards([]);
                setCanFlip(true);
            }, isMatch ? 500 : 1000);  // Shorter delay for matches
        }
    };

    // Submit match results to server
    const handleMatchComplete = (points = matchPoints, allCompleted = false, timeBonus = 0) => {
        socket.emit('memoryAnswer', {
            roomId: roomIdRef.current,
            answer: 'match_complete',
            matchResults: {
                pairsMatched: matchedPairs.length / 2,
                totalPairs: challengeData?.numPairs || 0,
                mistakes: matchMistakes,
                points: points,
                allCompleted: allCompleted,
                timeBonus: timeBonus,
                timeRemaining: matchTimer
            }
        });
    };

    // Socket event handlers
    useEffect(() => {
        const onMemoryRulesStart = (data) => {
            setPhase('rules');
            setCurrentRound(data.round);
            setTotalRounds(data.totalRounds);
            setChallengeType(data.challengeType);
            setTotalChallenges(data.challengesInRound);
            setIsSpeedRound(data.isSpeedRound);
            rulesEndTimeRef.current = data.rulesEndTime;

            if (data.isSpeedRound && data.speedRoundEndTime) {
                speedRoundEndTimeRef.current = data.speedRoundEndTime;
            }

            // Reset state
            setChallengeData(null);
            setSelectedAnswer(null);
            setHasAnswered(false);
            setAnsweredPlayers([]);
            setRevealData(null);
            setReadyPlayers(data.readyPlayers || []);
            setIsReady(false);
            setGroupInfo(data.difficultyGroups ? { allGroups: data.difficultyGroups } : null);
        };

        const onMemoryDisplay = (data) => {
            setPhase('display');
            setChallengeType(data.challengeType);
            setChallengeNumber(data.challengeNumber);
            setTotalChallenges(data.totalChallenges);
            setCurrentRound(data.round);
            setTotalRounds(data.totalRounds);
            displayEndTimeRef.current = data.displayEndTime;
            setShowItems(true);

            // Handle group info
            if (data.groupInfo) {
                setGroupInfo(data.groupInfo);
                setIsActiveGroup(data.isActiveGroup !== false);
                setWaitingFor(null);
            }

            setDifficulty(data.difficulty);
            setDifficultyLabel(data.difficultyLabel);

            // Set challenge data
            setChallengeData({
                type: data.challengeType,
                grid: data.grid,
                gridRows: data.gridRows,
                gridCols: data.gridCols,
                items: data.items || data.itemsBefore,
                itemsBefore: data.itemsBefore,
                itemsAfter: data.itemsAfter,
                numPairs: data.numPairs,
                pointsPerPair: data.pointsPerPair || 50,
                perfectBonus: data.perfectBonus || 50,
                matchTimeLimit: data.matchTimeLimit || 60000
            });

            // Initialize match game state if this is a match challenge
            if (data.challengeType === 'match') {
                setMatchGrid(data.grid || []);
                setMatchedPairs([]);
                setFlippedCards([]);
                setCanFlip(false);
                setMatchPoints(0);
                setMatchMistakes(0);
                setMatchComplete(false);
                matchEndTimeRef.current = null;
            }

            setSelectedAnswer(null);
            setHasAnswered(false);
            setAnsweredPlayers([]);
        };

        const onMemoryQuestion = (data) => {
            setPhase('question');
            setShowItems(false);
            questionEndTimeRef.current = data.questionEndTime;
            setQuestion(data.question);
            setAnswerOptions(data.options);

            if (data.groupInfo) {
                setGroupInfo(data.groupInfo);
                setIsActiveGroup(data.isActiveGroup !== false);
            }

            setDifficulty(data.difficulty);
            setDifficultyLabel(data.difficultyLabel);

            // Update challengeData with question phase info
            setChallengeData(prev => ({
                ...prev,
                itemsAfter: data.itemsAfter,
                tapToAnswer: data.tapToAnswer
            }));
        };

        const onMemoryGroupWaiting = (data) => {
            setPhase('groupWaiting');
            setChallengeNumber(data.challengeNumber);
            setTotalChallenges(data.totalChallenges);
            setCurrentRound(data.round);
            setTotalRounds(data.totalRounds);
            setGroupInfo(data.groupInfo);
            setWaitingFor(data.waitingFor);
            setIsActiveGroup(false);
        };

        const onMemoryAnswerReceived = (data) => {
            setAnsweredPlayers(prev => {
                if (prev.includes(data.playerName)) return prev;
                return [...prev, data.playerName];
            });
        };

        const onMemoryReveal = (data) => {
            setPhase('reveal');
            setRevealData(data);
        };

        const onMemoryRecap = (data) => {
            setPhase('recap');
            setRecapData(data);
            setStandings(data.standings);
            setRecapAnimPhase(0);
            setRevealedPlayers({});
            setAnimatedPointValues({});
            setAnimatedStandings([]);

            // Start animation sequence
            setTimeout(() => setRecapAnimPhase(1), 1000);
        };

        const onMemoryReadyUpdate = (data) => {
            setReadyPlayers(data.readyPlayers || []);
        };

        // Speed round handlers
        const onMemorySpeedChallenge = (data) => {
            setPhase('speedRound');
            setSequenceItems(data.sequence);
            setSequenceInput([]);
            setShowingSequence(true);
            setCurrentSequenceIndex(0);
            setSpeedFeedback(null);
            speedRoundEndTimeRef.current = data.speedRoundEndTime;
            setDifficulty(data.difficulty);
            setDifficultyLabel(data.difficultyLabel);

            // Animate sequence display
            const itemTime = data.sequenceItemTime || 800;
            data.sequence.forEach((item, idx) => {
                setTimeout(() => {
                    setCurrentSequenceIndex(idx + 1);
                }, (idx + 1) * itemTime);
            });

            // After sequence shown, allow input (2 second delay after last tile)
            setTimeout(() => {
                setShowingSequence(false);
                setCurrentSequenceIndex(0);
            }, data.sequence.length * itemTime + 2000);
        };

        const onMemorySpeedCorrect = (data) => {
            setSpeedFeedback('correct');
            setSpeedFeedbackDetails({
                correctCount: data.correctCount,
                totalTiles: data.totalTiles,
                points: data.points,
                allCorrect: data.allCorrect,
                bonus: data.bonus || 0
            });
            setSpeedStats(prev => ({
                correct: prev.correct + 1,
                total: prev.total + 1,
                points: data.totalPoints
            }));

            setTimeout(() => {
                setSpeedFeedback(null);
                setSpeedFeedbackDetails(null);
            }, 800);
        };

        const onMemorySpeedWrong = (data) => {
            setSpeedFeedback('wrong');
            setSpeedFeedbackDetails({
                correctCount: data.correctCount || 0,
                totalTiles: data.totalTiles,
                points: 0,
                allCorrect: false
            });
            setSpeedStats(prev => ({
                ...prev,
                total: prev.total + 1,
                points: data.totalPoints
            }));

            // Show correct sequence briefly
            setSequenceItems(data.correctAnswer);
            setShowingSequence(true);

            setTimeout(() => {
                setSpeedFeedback(null);
                setSpeedFeedbackDetails(null);
                setShowingSequence(false);
            }, 1500);
        };

        const onMemorySpeedProgress = (data) => {
            setSpeedProgress(data.progress);
        };

        const onMemorySpeedRecap = (data) => {
            setPhase('speedRecap');
            setRaceData(data.raceData);
            setRaceStep(0);
            setRaceStarted(false);
            setRaceComplete(false);

            // Start race animation after countdown
            setTimeout(() => setRaceStarted(true), 3000);
        };

        const onMemoryFinalResults = (data) => {
            setPhase('finalRecap');
            setFinalData(data);
            setShowWinnerCelebration(true);
        };

        const onMemorySync = (data) => {
            // Handle reconnection sync
            setPhase(data.phase);
            setCurrentRound(data.currentRound);
            setTotalRounds(data.totalRounds);
            setChallengeType(data.challengeType);
            setChallengeNumber(data.challengeNumber);
            setTotalChallenges(data.totalChallenges);
            setIsSpeedRound(data.isSpeedRound);

            if (data.rulesEndTime) rulesEndTimeRef.current = data.rulesEndTime;
            if (data.displayEndTime) displayEndTimeRef.current = data.displayEndTime;
            if (data.questionEndTime) questionEndTimeRef.current = data.questionEndTime;
            if (data.speedRoundEndTime) speedRoundEndTimeRef.current = data.speedRoundEndTime;

            if (data.standings) setStandings(data.standings);
            if (data.groupInfo) setGroupInfo(data.groupInfo);
            if (data.isActiveGroup !== undefined) setIsActiveGroup(data.isActiveGroup);

            if (data.challenge) {
                setChallengeData(data.challenge);
                setQuestion(data.challenge.question || '');
                setAnswerOptions(data.challenge.options || []);
            }

            if (data.speedProgress) {
                setSpeedStats({
                    correct: data.speedProgress.correctCount || 0,
                    total: data.speedProgress.currentChallengeIndex || 0,
                    points: data.speedProgress.totalPoints || 0
                });
            }
        };

        const onGameEnded = () => {
            // Game ended - will be handled by parent
        };

        // Register listeners
        socket.on('memoryRulesStart', onMemoryRulesStart);
        socket.on('memoryDisplay', onMemoryDisplay);
        socket.on('memoryQuestion', onMemoryQuestion);
        socket.on('memoryGroupWaiting', onMemoryGroupWaiting);
        socket.on('memoryAnswerReceived', onMemoryAnswerReceived);
        socket.on('memoryReveal', onMemoryReveal);
        socket.on('memoryRecap', onMemoryRecap);
        socket.on('memoryReadyUpdate', onMemoryReadyUpdate);
        socket.on('memorySpeedChallenge', onMemorySpeedChallenge);
        socket.on('memorySpeedCorrect', onMemorySpeedCorrect);
        socket.on('memorySpeedWrong', onMemorySpeedWrong);
        socket.on('memorySpeedProgress', onMemorySpeedProgress);
        socket.on('memorySpeedRecap', onMemorySpeedRecap);
        socket.on('memoryFinalResults', onMemoryFinalResults);
        socket.on('memorySync', onMemorySync);
        socket.on('gameEnded', onGameEnded);

        return () => {
            socket.off('memoryRulesStart', onMemoryRulesStart);
            socket.off('memoryDisplay', onMemoryDisplay);
            socket.off('memoryQuestion', onMemoryQuestion);
            socket.off('memoryGroupWaiting', onMemoryGroupWaiting);
            socket.off('memoryAnswerReceived', onMemoryAnswerReceived);
            socket.off('memoryReveal', onMemoryReveal);
            socket.off('memoryRecap', onMemoryRecap);
            socket.off('memoryReadyUpdate', onMemoryReadyUpdate);
            socket.off('memorySpeedChallenge', onMemorySpeedChallenge);
            socket.off('memorySpeedCorrect', onMemorySpeedCorrect);
            socket.off('memorySpeedWrong', onMemorySpeedWrong);
            socket.off('memorySpeedProgress', onMemorySpeedProgress);
            socket.off('memorySpeedRecap', onMemorySpeedRecap);
            socket.off('memoryFinalResults', onMemoryFinalResults);
            socket.off('memorySync', onMemorySync);
            socket.off('gameEnded', onGameEnded);
        };
    }, []);

    // Debug skip key listener (backtick key)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '`') {
                setShowDebugSkip(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Handle debug skip to next round
    const handleDebugSkipRound = () => {
        if (!isMaster) return;
        socket.emit('memorySkipRound', { roomId: roomIdRef.current });
    };

    // Recap animation sequence
    useEffect(() => {
        if (phase !== 'recap' || !recapData) return;

        if (recapAnimPhase === 1) {
            // Cascade reveal players
            const playerResults = recapData.challengeHistory?.[recapData.challengeHistory.length - 1]?.groupData || [];
            const allPlayers = [];

            playerResults.forEach(group => {
                Object.entries(group.playerResults || {}).forEach(([name, result]) => {
                    allPlayers.push({ name, isCorrect: result.isCorrect, pointsEarned: result.pointsEarned || 0 });
                });
            });

            allPlayers.forEach(({ name, isCorrect }, idx) => {
                setTimeout(() => {
                    setRevealedPlayers(prev => ({ ...prev, [name]: { revealed: true, correct: isCorrect } }));
                }, idx * 150);
            });

            // Move to phase 2 after cascade
            setTimeout(() => {
                setRecapAnimPhase(2);
                const initialPoints = {};
                allPlayers.forEach(({ name, isCorrect }) => {
                    if (isCorrect) initialPoints[name] = 0;
                });
                setAnimatedPointValues(initialPoints);
            }, allPlayers.length * 150 + 300);
        }

        if (recapAnimPhase === 2) {
            // Animate points
            const playerResults = recapData.challengeHistory?.[recapData.challengeHistory.length - 1]?.groupData || [];
            const correctPlayers = [];

            playerResults.forEach(group => {
                Object.entries(group.playerResults || {}).forEach(([name, result]) => {
                    if (result.isCorrect && result.pointsEarned > 0) {
                        correctPlayers.push({ name, pointsEarned: result.pointsEarned });
                    }
                });
            });

            const animDuration = 800;
            const steps = 20;
            let step = 0;

            const interval = setInterval(() => {
                step++;
                const progress = Math.min(step / steps, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);

                const newValues = {};
                correctPlayers.forEach(({ name, pointsEarned }) => {
                    newValues[name] = Math.round(pointsEarned * easedProgress);
                });
                setAnimatedPointValues(newValues);

                if (step >= steps) {
                    clearInterval(interval);
                    setRecapAnimPhase(3);
                }
            }, animDuration / steps);

            return () => clearInterval(interval);
        }
    }, [recapAnimPhase, phase, recapData]);

    // Race animation for speed round recap
    useEffect(() => {
        if (phase !== 'speedRecap' || !raceStarted || !raceData) return;

        const maxCorrect = Math.max(...raceData.map(p => p.correctCount || 0));
        if (maxCorrect === 0) {
            setRaceComplete(true);
            return;
        }

        const stepDuration = 10000 / maxCorrect;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            setRaceStep(step);

            if (step >= maxCorrect) {
                clearInterval(interval);
                setRaceComplete(true);
            }
        }, stepDuration);

        return () => clearInterval(interval);
    }, [phase, raceStarted, raceData]);

    // Handlers
    const handleAnswerSelect = (answer) => {
        if (hasAnswered || !isActiveGroup) return;

        setSelectedAnswer(answer);
        setHasAnswered(true);

        socket.emit('memoryAnswer', {
            roomId: roomIdRef.current,
            answer
        });
    };

    const handleSequenceInput = (item) => {
        if (showingSequence || speedFeedback) return;
        if (sequenceInput.length >= sequenceItems.length) return; // Already full

        const newInput = [...sequenceInput, item];
        setSequenceInput(newInput);

        // Check if sequence is complete - auto submit
        if (newInput.length === sequenceItems.length) {
            const answer = newInput.join(',');
            socket.emit('memoryAnswer', {
                roomId: roomIdRef.current,
                answer,
                sequenceLength: sequenceItems.length
            });
        }
    };

    const handleSequenceBackspace = () => {
        if (showingSequence || speedFeedback) return;
        if (sequenceInput.length === 0) return;
        setSequenceInput(prev => prev.slice(0, -1));
    };

    const handleReady = () => {
        if (isReady) return;
        setIsReady(true);
        socket.emit('memoryReady', { roomId: roomIdRef.current });
    };

    const handleNextRound = () => {
        socket.emit('memoryNextRound', { roomId: roomIdRef.current });
    };

    const handleRevealAll = () => {
        socket.emit('memoryRevealAll', { roomId: roomIdRef.current });
    };

    const handleEndGame = () => {
        setShowEndGameConfirm(false);
        socket.emit('endGameEarly', { roomId: roomIdRef.current });
    };

    const handleCelebrationComplete = () => {
        setShowWinnerCelebration(false);
        socket.emit('memoryCelebrationComplete', { roomId: roomIdRef.current });
    };

    // Get challenge type display name
    const getChallengeTypeName = () => {
        return CHALLENGE_TYPE_NAMES[challengeType] || 'Memory Challenge';
    };

    // Render Rules Phase
    const renderRulesPhase = () => {
        const instructions = CHALLENGE_INSTRUCTIONS[challengeType] || CHALLENGE_INSTRUCTIONS['match'] || {
            title: 'Memory Challenge',
            description: 'Test your memory skills!',
            steps: ['Watch carefully', 'Remember what you see', 'Answer correctly']
        };
        const connectedPlayers = currentRoom?.players?.filter(p => p.connected !== false) || [];
        const allReady = readyPlayers.length >= connectedPlayers.length && connectedPlayers.length > 0;

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-lg w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'} text-center`}>
                    {/* Round indicator */}
                    <div className={`text-sm font-bold ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'} mb-2`}>
                        {isSpeedRound ? 'SPEED ROUND!' : `Round ${currentRound} of ${totalRounds}`}
                    </div>

                    {/* Challenge type icon */}
                    <div className="text-6xl mb-4">
                        {challengeType === 'match' && '🧩'}
                        {challengeType === 'missing' && '❓'}
                        {challengeType === 'difference' && '🔍'}
                        {challengeType === 'sequence' && '🔢'}
                    </div>

                    {/* Title */}
                    <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} mb-4 ${currentTheme.font}`}>
                        {theme === 'tron' ? `> ${instructions.title.toUpperCase().replace(/ /g, '_')}` : instructions.title}
                    </h2>

                    {/* Description */}
                    <p className={`${currentTheme.textSecondary} mb-4`}>
                        {instructions.description}
                    </p>

                    {/* Steps (only on round 1 or speed round) */}
                    {(currentRound === 1 || isSpeedRound) && (
                        <div className={`${theme === 'tron' ? 'bg-cyan-500/10' : theme === 'kids' ? 'bg-purple-100' : 'bg-orange-900/20'} rounded-xl p-4 mb-4`}>
                            <ol className="text-left space-y-2">
                                {instructions.steps.map((step, idx) => (
                                    <li key={idx} className={`flex gap-2 ${currentTheme.text}`}>
                                        <span className={`font-bold ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>
                                            {idx + 1}.
                                        </span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Challenges info */}
                    {!isSpeedRound && (
                        <div className={`text-sm ${currentTheme.textSecondary} mb-4`}>
                            {totalChallenges} challenges this round
                        </div>
                    )}

                    {/* Timer with auto-start message */}
                    <div className="mb-4">
                        <div className={`text-sm ${currentTheme.textSecondary} mb-1`}>
                            Starting in...
                        </div>
                        <div className={`text-5xl font-black ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>
                            {rulesTimer}
                        </div>
                    </div>

                    {/* Ready button - allows skipping wait time */}
                    {!isReady ? (
                        <button
                            onClick={handleReady}
                            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                                theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' :
                                theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' :
                                'bg-orange-500 hover:bg-orange-400 text-white'
                            }`}
                        >
                            {theme === 'tron' ? '> READY' : "I'm Ready!"}
                        </button>
                    ) : (
                        <div className={`text-lg font-bold ${theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-green-600' : 'text-green-400'}`}>
                            {allReady ? 'All Ready! Starting...' : `Waiting for others... (${readyPlayers.length}/${connectedPlayers.length})`}
                        </div>
                    )}

                    {/* Ready players */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {readyPlayers.map((name, idx) => {
                            const player = currentRoom?.players?.find(p => p.name === name);
                            const character = availableCharacters.find(c => c.id === player?.avatar) || availableCharacters[0];
                            return (
                                <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded-full ${theme === 'tron' ? 'bg-green-500/20 border border-green-500' : theme === 'kids' ? 'bg-green-200 border border-green-400' : 'bg-green-700/30 border border-green-600'}`}>
                                    <div className="w-4 h-4">
                                        <CharacterSVG characterId={player?.avatar} size={16} color={character.color} />
                                    </div>
                                    <span className={`text-xs font-semibold ${currentTheme.text}`}>{name}</span>
                                    <span className="text-green-500 text-xs">✓</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Render Grid Display
    const renderGridDisplay = () => {
        if (!challengeData?.grid) return null;

        const { grid, gridRows, gridCols } = challengeData;

        return (
            <div
                className="grid gap-2 md:gap-3 mx-auto"
                style={{
                    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                    maxWidth: `${gridCols * 80}px`
                }}
            >
                {grid.map((item, idx) => (
                    <div
                        key={idx}
                        className={`aspect-square flex items-center justify-center text-3xl md:text-4xl rounded-xl transition-all ${
                            showItems
                                ? `${theme === 'tron' ? 'bg-cyan-500/20 border-2 border-cyan-500' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-400' : 'bg-orange-700/30 border-2 border-orange-600'}`
                                : `${theme === 'tron' ? 'bg-gray-800 border-2 border-gray-700' : theme === 'kids' ? 'bg-gray-200 border-2 border-gray-300' : 'bg-gray-800 border-2 border-gray-700'}`
                        }`}
                    >
                        {showItems ? item : '?'}
                    </div>
                ))}
            </div>
        );
    };

    // Render Match Game Grid
    const renderMatchGrid = (showAll = false) => {
        if (!matchGrid || matchGrid.length === 0) return null;

        const rows = challengeData?.gridRows || 4;
        const cols = challengeData?.gridCols || 4;

        return (
            <div
                className="grid gap-2 md:gap-3 mx-auto"
                style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    maxWidth: `${Math.min(cols * 70, 500)}px`
                }}
            >
                {matchGrid.map((item, idx) => {
                    const isMatched = matchedPairs.includes(idx);
                    const isFlipped = flippedCards.includes(idx);
                    const showCard = showAll || isMatched || isFlipped;

                    return (
                        <button
                            key={idx}
                            onClick={() => !showAll && handleCardFlip(idx)}
                            disabled={showAll || isMatched || !canFlip}
                            className={`aspect-square flex items-center justify-center text-2xl md:text-3xl rounded-xl transition-all transform ${
                                showCard
                                    ? isMatched
                                        ? `${theme === 'tron' ? 'bg-green-500/30 border-2 border-green-500' : theme === 'kids' ? 'bg-green-200 border-2 border-green-400' : 'bg-green-700/30 border-2 border-green-600'} scale-95`
                                        : `${theme === 'tron' ? 'bg-cyan-500/20 border-2 border-cyan-500' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-400' : 'bg-orange-700/30 border-2 border-orange-600'}`
                                    : `${theme === 'tron' ? 'bg-gray-800 border-2 border-cyan-500/30 hover:border-cyan-400' : theme === 'kids' ? 'bg-purple-200 border-2 border-purple-300 hover:border-purple-500' : 'bg-gray-800 border-2 border-orange-700/30 hover:border-orange-500'} cursor-pointer hover:scale-105`
                            } ${!showAll && !isMatched && canFlip ? 'active:scale-95' : ''}`}
                        >
                            {showCard ? item : '?'}
                        </button>
                    );
                })}
            </div>
        );
    };

    // Render Match Phase (after display, player matches pairs)
    const renderMatchPhase = () => {
        const totalPairs = challengeData?.numPairs || 0;
        const matchedCount = matchedPairs.length / 2;

        return (
            <div className="max-w-4xl mx-auto p-4">
                {/* Header with timer and progress */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4`}>
                    <div className="flex items-center justify-between">
                        <div className={`text-sm font-bold ${currentTheme.textSecondary}`}>
                            {matchedCount}/{totalPairs} pairs
                        </div>
                        <div className={`text-2xl font-black ${matchTimer <= 10 ? 'text-red-500 animate-pulse' : theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>
                            {matchTimer}s
                        </div>
                        <div className={`text-sm font-bold ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                            {matchPoints} pts
                        </div>
                    </div>
                </div>

                {/* Instruction */}
                <div className={`text-center mb-4 text-lg font-bold ${currentTheme.text}`}>
                    {matchComplete
                        ? (theme === 'tron' ? '> COMPLETE!' : 'Complete!')
                        : (theme === 'tron' ? '> FIND_PAIRS' : 'Find the matching pairs!')
                    }
                </div>

                {/* Match grid */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 md:p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                    {renderMatchGrid(false)}
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-6 mt-4">
                    <div className={`text-center ${currentTheme.textSecondary}`}>
                        <div className="text-xs">Mistakes</div>
                        <div className={`text-lg font-bold ${matchMistakes > 0 ? 'text-red-400' : theme === 'tron' ? 'text-green-400' : 'text-green-500'}`}>
                            {matchMistakes}
                        </div>
                    </div>
                    {!matchComplete && (
                        <div className={`text-center ${currentTheme.textSecondary}`}>
                            <div className="text-xs">Time Bonus</div>
                            <div className={`text-lg font-bold ${theme === 'tron' ? 'text-yellow-400' : 'text-yellow-500'}`}>
                                +{matchTimer * 4}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render Items Display (for missing/difference challenges)
    const renderItemsDisplay = () => {
        const items = showItems ? (challengeData?.itemsBefore || challengeData?.items) : challengeData?.itemsAfter;
        if (!items) return null;

        return (
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-3xl md:text-4xl rounded-xl ${
                            theme === 'tron' ? 'bg-cyan-500/20 border-2 border-cyan-500' :
                            theme === 'kids' ? 'bg-purple-100 border-2 border-purple-400' :
                            'bg-orange-700/30 border-2 border-orange-600'
                        }`}
                    >
                        {item}
                    </div>
                ))}
            </div>
        );
    };

    // Render Display Phase
    const renderDisplayPhase = () => {
        return (
            <div className="max-w-4xl mx-auto p-4">
                {/* Header */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4 text-center`}>
                    <div className="flex items-center justify-between">
                        <div className={`text-sm font-bold ${currentTheme.textSecondary}`}>
                            Challenge {challengeNumber}/{totalChallenges}
                        </div>
                        <div className={`text-2xl font-black ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>
                            {displayTimer}s
                        </div>
                        <div className={`text-sm font-bold ${currentTheme.textSecondary}`}>
                            Round {currentRound}/{totalRounds}
                        </div>
                    </div>
                </div>

                {/* Instruction */}
                <div className={`text-center mb-4 text-lg font-bold ${currentTheme.text}`}>
                    {theme === 'tron' ? '> MEMORIZE' : 'Memorize!'}
                </div>

                {/* Display area */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 md:p-8 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                    {challengeType === 'match' && renderMatchGrid(true)}
                    {(challengeType === 'missing' || challengeType === 'difference') && renderItemsDisplay()}
                </div>

                {/* Difficulty label */}
                {difficultyLabel && (
                    <div className={`text-center mt-4 text-sm ${currentTheme.textSecondary}`}>
                        Difficulty: {difficultyLabel}
                    </div>
                )}
            </div>
        );
    };

    // Render Question Phase
    const renderQuestionPhase = () => {
        // Check if this is a tap-to-answer challenge (Round 3 - Spot the One)
        const isTapToAnswer = challengeData?.tapToAnswer;

        return (
            <div className="max-w-4xl mx-auto p-4">
                {/* Header */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4 text-center`}>
                    <div className="flex items-center justify-between">
                        <div className={`text-sm font-bold ${currentTheme.textSecondary}`}>
                            Challenge {challengeNumber}/{totalChallenges}
                        </div>
                        <div className={`text-2xl font-black ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>
                            {questionTimer}s
                        </div>
                        <div className={`text-sm font-bold ${currentTheme.textSecondary}`}>
                            Round {currentRound}/{totalRounds}
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4`}>
                    <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.text} text-center ${currentTheme.font}`}>
                        {question}
                    </h2>

                    {/* For tap-to-answer challenges (missing = tap NEW one, difference = tap one you SAW) */}
                    {isTapToAnswer && challengeData?.itemsAfter && (
                        <div className="mt-4">
                            <div className={`text-sm ${currentTheme.textSecondary} text-center mb-3`}>
                                {challengeType === 'missing' ? 'Tap the NEW one:' : 'Tap the one you saw before:'}
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                                {challengeData.itemsAfter.map((item, idx) => {
                                    const isSelected = selectedAnswer === item;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswerSelect(item)}
                                            disabled={hasAnswered}
                                            className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-3xl md:text-4xl rounded-xl transition-all ${
                                                isSelected
                                                    ? (theme === 'tron' ? 'bg-cyan-500/40 border-3 border-cyan-400 scale-110' :
                                                       theme === 'kids' ? 'bg-purple-200 border-3 border-purple-500 scale-110' :
                                                       'bg-orange-600/40 border-3 border-orange-400 scale-110')
                                                    : (theme === 'tron' ? 'bg-cyan-500/20 border-2 border-cyan-500 hover:bg-cyan-500/30 hover:scale-105' :
                                                       theme === 'kids' ? 'bg-purple-100 border-2 border-purple-400 hover:bg-purple-200 hover:scale-105' :
                                                       'bg-orange-700/30 border-2 border-orange-600 hover:bg-orange-700/50 hover:scale-105')
                                            } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {item}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Answer options - only for non-tap challenges (missing item) */}
                {!isTapToAnswer && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {answerOptions.map((option, idx) => {
                            const isSelected = selectedAnswer === option;
                            const baseStyle = theme === 'tron'
                                ? 'bg-gray-800/80 border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/20'
                                : theme === 'kids'
                                ? 'bg-purple-50 border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-100'
                                : 'bg-gray-800/80 border-2 border-orange-600/50 hover:border-orange-500 hover:bg-orange-700/20';

                            const selectedStyle = theme === 'tron'
                                ? 'bg-cyan-500/30 border-2 border-cyan-400'
                                : theme === 'kids'
                                ? 'bg-purple-200 border-2 border-purple-500'
                                : 'bg-orange-700/40 border-2 border-orange-500';

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={hasAnswered}
                                    className={`p-4 rounded-xl font-bold text-2xl transition-all ${
                                        isSelected ? selectedStyle : baseStyle
                                    } ${hasAnswered ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${currentTheme.text}`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Answered players */}
                {answeredPlayers.length > 0 && (
                    <div className="mt-4 text-center">
                        <div className={`text-sm ${currentTheme.textSecondary}`}>
                            {answeredPlayers.length} answered
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render Group Waiting Phase
    const renderGroupWaitingPhase = () => {
        if (!waitingFor) return null;

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-lg w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'} text-center`}>
                    <div className="text-5xl mb-4 animate-pulse">⏳</div>
                    <h2 className={`text-2xl font-black ${currentTheme.text} mb-2`}>
                        {theme === 'tron' ? '> WAITING' : 'Waiting...'}
                    </h2>
                    <div className={`text-lg ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>
                        {waitingFor.label} group is answering
                    </div>

                    {/* Group progress */}
                    {groupInfo?.allGroups && (
                        <div className="flex justify-center gap-2 mt-4">
                            {groupInfo.allGroups.map((group, idx) => (
                                <div
                                    key={idx}
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        group.isCompleted
                                            ? 'bg-green-500/30 text-green-400 border border-green-500'
                                            : group.isActive
                                            ? `${theme === 'tron' ? 'bg-cyan-500/40 text-cyan-300 border-2 border-cyan-400 animate-pulse' : theme === 'kids' ? 'bg-purple-400 text-white border-2 border-purple-500 animate-pulse' : 'bg-orange-500/40 text-orange-300 border-2 border-orange-400 animate-pulse'}`
                                            : `${theme === 'tron' ? 'bg-gray-800/50 text-gray-500 border border-gray-700' : theme === 'kids' ? 'bg-gray-200 text-gray-500 border border-gray-300' : 'bg-gray-800/50 text-gray-500 border border-gray-700'}`
                                    }`}
                                >
                                    {group.isCompleted ? '✓ ' : ''}{group.label}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`text-sm ${currentTheme.textSecondary} mt-4`}>
                        Your turn is coming up soon!
                    </div>
                </div>
            </div>
        );
    };

    // Render Reveal Phase
    const renderRevealPhase = () => {
        if (!revealData) return null;

        const groupAnswers = revealData.groupAnswers || [];

        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} text-center`}>
                    <h2 className={`text-2xl font-black ${currentTheme.text} mb-4`}>
                        {theme === 'tron' ? '> ANSWER_REVEALED' : 'Answer Revealed!'}
                    </h2>

                    {/* Correct answers by group */}
                    {groupAnswers.map((group, idx) => (
                        <div key={idx} className={`mb-4 p-4 rounded-xl ${
                            theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/50' :
                            theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300' :
                            'bg-orange-900/20 border border-orange-700/50'
                        }`}>
                            <div className={`text-sm ${currentTheme.textSecondary} mb-2`}>
                                {group.label} Answer:
                            </div>
                            <div className={`text-2xl font-bold ${theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-green-600' : 'text-green-400'}`}>
                                {group.correctAnswer}
                            </div>
                        </div>
                    ))}

                    {/* Player results */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                        {Object.entries(revealData.playerResults || {}).map(([name, result]) => {
                            const player = currentRoom?.players?.find(p => p.name === name);
                            const character = availableCharacters.find(c => c.id === player?.avatar) || availableCharacters[0];

                            return (
                                <div
                                    key={name}
                                    className={`p-3 rounded-xl ${
                                        result.isCorrect
                                            ? 'bg-green-500/20 border border-green-500'
                                            : 'bg-red-500/20 border border-red-500'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6">
                                            <CharacterSVG characterId={player?.avatar} size={24} color={character.color} />
                                        </div>
                                        <span className={`font-semibold ${currentTheme.text} truncate`}>{name}</span>
                                    </div>
                                    <div className={`text-sm mt-1 ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                        {result.isCorrect ? `+${result.pointsEarned}` : 'Wrong'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Render Speed Round
    const renderSpeedRound = () => {
        return (
            <div className="max-w-4xl mx-auto p-4">
                {/* Header with timer and stats */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4`}>
                    <div className="flex items-center justify-between">
                        <div className={`text-sm font-bold ${currentTheme.textSecondary}`}>
                            {speedStats.correct} correct
                        </div>
                        <div className={`text-3xl font-black ${speedRoundTimer <= 10 ? 'text-red-500 animate-pulse' : theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>
                            {speedRoundTimer}s
                        </div>
                        <div className={`text-sm font-bold ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                            {speedStats.points} pts
                        </div>
                    </div>
                </div>

                {/* Sequence display */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4`}>
                    {showingSequence ? (
                        <div className="text-center">
                            <div className={`text-sm ${currentTheme.textSecondary} mb-4`}>
                                {theme === 'tron' ? '> WATCH_SEQUENCE' : 'Watch the sequence!'}
                            </div>
                            <div className="flex justify-center gap-2 min-h-[64px]">
                                {sequenceItems.slice(0, currentSequenceIndex).map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-3xl rounded-xl ${
                                            theme === 'tron' ? 'bg-cyan-500/30 border-2 border-cyan-400' :
                                            theme === 'kids' ? 'bg-purple-200 border-2 border-purple-500' :
                                            'bg-orange-700/40 border-2 border-orange-500'
                                        } animate-bounce-in`}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className={`text-sm ${currentTheme.textSecondary} mb-4`}>
                                {theme === 'tron' ? '> TAP_IN_ORDER' : 'Tap in order!'}
                            </div>
                            <div className="flex justify-center gap-2 mb-4 min-h-[48px]">
                                {sequenceInput.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg ${
                                            theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500' :
                                            theme === 'kids' ? 'bg-purple-100 border border-purple-400' :
                                            'bg-orange-700/30 border border-orange-600'
                                        }`}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Feedback */}
                    {speedFeedback && speedFeedbackDetails && (
                        <div className={`text-center ${
                            speedFeedbackDetails.allCorrect ? 'text-green-400' :
                            speedFeedbackDetails.correctCount > 0 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                            <div className="text-2xl font-bold animate-bounce">
                                {speedFeedbackDetails.allCorrect ? '✓ Perfect!' :
                                 speedFeedbackDetails.correctCount > 0 ? `${speedFeedbackDetails.correctCount}/${speedFeedbackDetails.totalTiles} Correct` :
                                 '✗ Wrong!'}
                            </div>
                            {speedFeedbackDetails.points > 0 && (
                                <div className="text-lg mt-1">
                                    +{speedFeedbackDetails.points} pts
                                    {speedFeedbackDetails.bonus > 0 && (
                                        <span className="text-green-400 ml-1">(+{speedFeedbackDetails.bonus} bonus!)</span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input buttons */}
                {!showingSequence && !speedFeedback && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {sequenceItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSequenceInput(item)}
                                    disabled={sequenceInput.length >= sequenceItems.length}
                                    className={`p-4 text-2xl rounded-xl transition-all ${
                                        sequenceInput.length >= sequenceItems.length
                                            ? 'opacity-50 cursor-not-allowed'
                                            : theme === 'tron' ? 'bg-gray-800 border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/20' :
                                              theme === 'kids' ? 'bg-purple-50 border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-100' :
                                              'bg-gray-800 border-2 border-orange-600/50 hover:border-orange-500 hover:bg-orange-700/20'
                                    } ${sequenceInput.length >= sequenceItems.length ? '' :
                                        theme === 'tron' ? 'bg-gray-800 border-2 border-cyan-500/50' :
                                        theme === 'kids' ? 'bg-purple-50 border-2 border-purple-300' :
                                        'bg-gray-800 border-2 border-orange-600/50'
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        {/* Backspace button */}
                        <button
                            onClick={handleSequenceBackspace}
                            disabled={sequenceInput.length === 0 || sequenceInput.length >= sequenceItems.length}
                            className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                                sequenceInput.length === 0 || sequenceInput.length >= sequenceItems.length
                                    ? 'opacity-50 cursor-not-allowed bg-gray-700 text-gray-400'
                                    : theme === 'tron' ? 'bg-red-500/20 border-2 border-red-500 text-red-400 hover:bg-red-500/30' :
                                      theme === 'kids' ? 'bg-red-100 border-2 border-red-400 text-red-600 hover:bg-red-200' :
                                      'bg-red-900/30 border-2 border-red-600 text-red-400 hover:bg-red-900/50'
                            }`}
                        >
                            <span>⌫</span> Backspace
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Render Recap Phase
    const renderRecapPhase = () => {
        const displayStandings = animatedStandings.length > 0 ? animatedStandings : standings;

        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} text-center`}>
                    <h2 className={`text-2xl font-black ${currentTheme.text} mb-4`}>
                        {recapData?.isLastRound
                            ? (theme === 'tron' ? '> GAME_COMPLETE' : 'Game Complete!')
                            : (theme === 'tron' ? `> ROUND_${currentRound}_COMPLETE` : `Round ${currentRound} Complete!`)
                        }
                    </h2>

                    {/* Standings */}
                    <div className="space-y-2 mb-6">
                        {displayStandings.map((player, idx) => {
                            const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                            const revealed = revealedPlayers[player.name];
                            const pointAnim = animatedPointValues[player.name];

                            return (
                                <div
                                    key={player.name}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                        idx === 0 ? (theme === 'tron' ? 'bg-yellow-500/20 border border-yellow-500' : theme === 'kids' ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-yellow-700/30 border border-yellow-600') :
                                        (theme === 'tron' ? 'bg-gray-800/50' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/50')
                                    }`}
                                >
                                    <span className={`text-lg font-bold w-6 ${idx === 0 ? 'text-yellow-400' : currentTheme.text}`}>
                                        {idx + 1}
                                    </span>
                                    <div className="w-8 h-8">
                                        <CharacterSVG characterId={player.avatar} size={32} color={character.color} />
                                    </div>
                                    <span className={`flex-1 font-semibold ${currentTheme.text}`}>{player.name}</span>
                                    {revealed && (
                                        <span className={`text-sm px-2 py-1 rounded ${revealed.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {pointAnim !== undefined ? `+${pointAnim}` : (revealed.correct ? '✓' : '✗')}
                                        </span>
                                    )}
                                    <span className={`font-black ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                        {player.score}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Master controls */}
                    {isMaster && (
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleNextRound}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                                    theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' :
                                    theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' :
                                    'bg-orange-500 hover:bg-orange-400 text-white'
                                }`}
                            >
                                {recapData?.isLastRound
                                    ? (theme === 'tron' ? '> VIEW_RESULTS' : 'View Final Results')
                                    : (theme === 'tron' ? '> NEXT_ROUND' : 'Next Round')
                                }
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render Speed Recap (Race)
    const renderSpeedRecapPhase = () => {
        if (!raceData) return null;

        const maxCorrect = Math.max(...raceData.map(p => p.correctCount || 0));
        const trackWidth = 100;

        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                    <h2 className={`text-2xl font-black ${currentTheme.text} text-center mb-6`}>
                        {raceComplete
                            ? (theme === 'tron' ? '> RACE_COMPLETE' : 'Race Complete!')
                            : (theme === 'tron' ? '> SPEED_ROUND_RACE' : 'Speed Round Race!')
                        }
                    </h2>

                    {/* Race tracks */}
                    <div className="space-y-4 mb-6">
                        {raceData.map((player, idx) => {
                            const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                            const progress = maxCorrect > 0 ? Math.min(raceStep, player.correctCount) / maxCorrect * trackWidth : 0;
                            const isWinner = raceComplete && idx === 0;

                            return (
                                <div key={player.name} className="relative">
                                    {/* Track */}
                                    <div className={`h-12 rounded-full ${theme === 'tron' ? 'bg-gray-800' : theme === 'kids' ? 'bg-gray-200' : 'bg-gray-800'} relative overflow-hidden`}>
                                        {/* Progress */}
                                        <div
                                            className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                                                isWinner
                                                    ? (theme === 'tron' ? 'bg-yellow-500/50' : theme === 'kids' ? 'bg-yellow-300' : 'bg-yellow-700/50')
                                                    : (theme === 'tron' ? 'bg-cyan-500/30' : theme === 'kids' ? 'bg-purple-200' : 'bg-orange-700/30')
                                            }`}
                                            style={{ width: `${progress}%` }}
                                        />

                                        {/* Avatar at progress position */}
                                        <div
                                            className="absolute top-1 transition-all duration-500 flex items-center gap-2"
                                            style={{ left: `calc(${progress}% - 20px)` }}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                theme === 'tron' ? 'bg-gray-900 border-2 border-cyan-500' :
                                                theme === 'kids' ? 'bg-white border-2 border-purple-400' :
                                                'bg-gray-900 border-2 border-orange-600'
                                            }`}>
                                                <CharacterSVG characterId={player.avatar} size={32} color={character.color} />
                                            </div>
                                        </div>

                                        {/* Name and score */}
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            <span className={`font-semibold ${currentTheme.text}`}>{player.name}</span>
                                            <span className={`font-black ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                                {player.totalPoints}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Winner crown */}
                                    {isWinner && (
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                                            👑
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Next button for master */}
                    {isMaster && raceComplete && (
                        <div className="text-center">
                            <button
                                onClick={handleNextRound}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                                    theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' :
                                    theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' :
                                    'bg-orange-500 hover:bg-orange-400 text-white'
                                }`}
                            >
                                {theme === 'tron' ? '> VIEW_FINAL_RESULTS' : 'View Final Results'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render Scoreboard Sidebar
    const renderScoreboard = () => {
        const displayScores = phase === 'question' || phase === 'display'
            ? standings.map(p => ({ ...p, score: previousRoundScores[p.name] || p.score }))
            : standings;

        const sortedPlayers = [...displayScores].sort((a, b) => b.score - a.score);
        const leader = sortedPlayers[0];

        return (
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl p-3 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'}`}>
                <h3 className={`text-sm font-bold ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                    {theme === 'tron' ? '> SCORES' : 'Scores'}
                </h3>
                <div className="space-y-1.5">
                    {sortedPlayers.map((player, idx) => {
                        const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                        const isLeader = leader && player.score === leader.score && player.score > 0;
                        const hasAnswered = answeredPlayers.includes(player.name);

                        return (
                            <div
                                key={player.name}
                                className={`flex items-center gap-2 p-1.5 rounded-lg transition-all ${
                                    hasAnswered
                                        ? (theme === 'tron' ? 'bg-green-500/20 border border-green-500/50' : theme === 'kids' ? 'bg-green-100 border border-green-300' : 'bg-green-700/20 border border-green-600/50')
                                        : ''
                                } ${player.connected === false ? 'opacity-50' : ''}`}
                            >
                                <div className="w-6 h-6 flex-shrink-0">
                                    <CharacterSVG characterId={player.avatar} size={24} color={character.color} />
                                </div>
                                <span className={`flex-1 text-sm font-semibold ${currentTheme.text} truncate`}>
                                    {player.name}
                                    {isLeader && <span className="ml-1">👑</span>}
                                </span>
                                <span className={`font-black text-sm ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                    {player.score}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Handle exit to room
    const handleExitToRoom = () => {
        if (!currentRoom?.id) return;
        socket.emit('endGameEarly', { roomId: currentRoom.id });
    };

    // Main render - use explicit theme backgrounds with gradients
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

            {/* Winner Celebration Modal */}
            {showWinnerCelebration && finalData?.winner && (
                <WinnerCelebration
                    winner={finalData.winner}
                    standings={finalData.finalStandings}
                    theme={theme}
                    currentTheme={currentTheme}
                    availableCharacters={availableCharacters}
                    isMaster={isMaster}
                    onComplete={handleCelebrationComplete}
                />
            )}

            {/* Fixed Game Master Controls - visible during all phases */}
            {isMaster && !showWinnerCelebration && (
                <div className="fixed bottom-4 left-4 z-40">
                    <GameMasterControls
                        currentRoom={currentRoom}
                        theme={theme}
                        currentTheme={currentTheme}
                        onEndGame={() => setShowEndGameConfirm(true)}
                        showRevealAll={phase === 'question' || phase === 'display'}
                        onRevealAll={handleRevealAll}
                    />
                </div>
            )}

            {/* End Game Confirmation Modal */}
            {showEndGameConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className={`${currentTheme.cardBg} rounded-2xl p-6 max-w-sm w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                        <h3 className={`text-xl font-bold ${currentTheme.text} mb-4 text-center`}>
                            End Game?
                        </h3>
                        <p className={`${currentTheme.textSecondary} mb-6 text-center`}>
                            This will end the game for all players.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEndGameConfirm(false)}
                                className={`flex-1 py-2 rounded-lg font-bold ${theme === 'tron' ? 'bg-gray-700 hover:bg-gray-600 text-white' : theme === 'kids' ? 'bg-gray-300 hover:bg-gray-400 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndGame}
                                className="flex-1 py-2 rounded-lg font-bold bg-red-500 hover:bg-red-400 text-white"
                            >
                                End Game
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile master controls - fixed at bottom */}
            {isMaster && !showWinnerCelebration && phase !== 'rules' && (
                <div className="lg:hidden fixed bottom-4 right-4 z-40 flex flex-col gap-2">
                    {showDebugSkip && (
                        <button
                            onClick={handleDebugSkipRound}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-2 rounded-xl font-bold text-sm shadow-lg"
                        >
                            ⏭️ Skip
                        </button>
                    )}
                    <button
                        onClick={() => setShowEndGameConfirm(true)}
                        className={`${
                            theme === 'tron' ? 'bg-red-500/90 text-white' :
                            theme === 'kids' ? 'bg-red-400 text-white' :
                            'bg-red-700/90 text-white'
                        } px-3 py-2 rounded-xl font-bold text-sm shadow-lg`}
                    >
                        Exit
                    </button>
                </div>
            )}

            {/* Main content */}
            <div className="flex gap-4">
                {/* Main game area */}
                <div className="flex-1">
                    {phase === 'rules' && renderRulesPhase()}
                    {phase === 'display' && renderDisplayPhase()}
                    {phase === 'match' && renderMatchPhase()}
                    {phase === 'question' && renderQuestionPhase()}
                    {phase === 'groupWaiting' && renderGroupWaitingPhase()}
                    {phase === 'reveal' && renderRevealPhase()}
                    {phase === 'recap' && renderRecapPhase()}
                    {phase === 'speedRound' && renderSpeedRound()}
                    {phase === 'speedRecap' && renderSpeedRecapPhase()}
                </div>

                {/* Scoreboard sidebar - hidden on mobile during certain phases */}
                {phase !== 'rules' && phase !== 'finalRecap' && !showWinnerCelebration && (
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        {renderScoreboard()}

                        {/* Master controls below scoreboard */}
                        {isMaster && (
                            <div className="mt-3 space-y-2">
                                {/* Debug Skip Button - Press ` to toggle */}
                                {showDebugSkip && (
                                    <button
                                        onClick={handleDebugSkipRound}
                                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-2 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2"
                                    >
                                        ⏭️ Skip Round
                                    </button>
                                )}

                                {/* Exit Button */}
                                <button
                                    onClick={() => setShowEndGameConfirm(true)}
                                    className={`w-full ${
                                        theme === 'tron' ? 'bg-red-500/90 hover:bg-red-500 text-white border border-red-400' :
                                        theme === 'kids' ? 'bg-red-400 hover:bg-red-500 text-white' :
                                        'bg-red-700/90 hover:bg-red-700 text-white border border-red-600'
                                    } px-3 py-2 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Exit Game
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemoryGame;
