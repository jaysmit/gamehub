import React, { useState, useEffect, useRef } from 'react';
import { CharacterSVG } from '../icons/CharacterSVGs';
import { socket, getServerTime } from '../socket';
import { MATH_CATEGORY_ICONS } from '../data/mathQuestions';
import GameMasterControls from '../components/GameMasterControls';
import WinnerCelebration from '../components/WinnerCelebration';

const QuickMathGame = ({ theme, currentTheme, playerName, selectedAvatar, availableCharacters, currentRoom, isMuted, isMaster }) => {
    // Game state
    const [phase, setPhase] = useState('rules');  // rules, question, reveal, recap, speedRound, speedRecap
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [category, setCategory] = useState('');
    const [currentInput, setCurrentInput] = useState('');  // Typed answer for NumberPad
    const [hasAnswered, setHasAnswered] = useState(false);
    const [timer, setTimer] = useState(15);
    const [rulesTimer, setRulesTimer] = useState(10);
    const [currentRound, setCurrentRound] = useState(1);
    const [totalRounds, setTotalRounds] = useState(4);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(5);
    const [isSpeedRound, setIsSpeedRound] = useState(false);
    const [answeredPlayers, setAnsweredPlayers] = useState([]);
    const [revealData, setRevealData] = useState(null);
    const [recapData, setRecapData] = useState(null);
    const [finalData, setFinalData] = useState(null);
    const [standings, setStandings] = useState([]);
    const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);

    // Speed round state
    const [speedRoundAnswers, setSpeedRoundAnswers] = useState([]);  // 4 multiple choice options
    const [speedRoundTimer, setSpeedRoundTimer] = useState(60);
    const [speedRoundFeedback, setSpeedRoundFeedback] = useState(null);  // 'correct' | 'wrong' | null
    const [speedRoundCorrectAnswer, setSpeedRoundCorrectAnswer] = useState(null);
    const [speedRoundStats, setSpeedRoundStats] = useState({ answered: 0, correct: 0, points: 0 });
    const [speedRoundWaiting, setSpeedRoundWaiting] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    // Animated recap state
    const [recapQuestionIndex, setRecapQuestionIndex] = useState(-1);
    const [animatedStandings, setAnimatedStandings] = useState([]);
    const [showingQuestion, setShowingQuestion] = useState(true);
    const [nextRoundCountdown, setNextRoundCountdown] = useState(null);
    const [recapAnimPhase, setRecapAnimPhase] = useState(0);
    const [animatedPointValues, setAnimatedPointValues] = useState({});
    const [flyingPoints, setFlyingPoints] = useState([]);
    const [speedRoundDifficulty, setSpeedRoundDifficulty] = useState(null);
    const [revealedPlayers, setRevealedPlayers] = useState({});       // { playerName: { revealed: true, correct: boolean } }
    const [allQuestionsRevealed, setAllQuestionsRevealed] = useState(false);  // Master can reveal all at once

    // Speed round race recap state
    const [raceData, setRaceData] = useState(null);
    const [raceStep, setRaceStep] = useState(0);
    const [raceStarted, setRaceStarted] = useState(false);
    const [raceComplete, setRaceComplete] = useState(false);
    const [raceCountdown, setRaceCountdown] = useState(null);
    const [speedRecapPhase, setSpeedRecapPhase] = useState('race');
    const [preSpeedStandings, setPreSpeedStandings] = useState([]);
    const [animatedFinalScores, setAnimatedFinalScores] = useState({});

    // Ready button state for rules phase
    const [readyPlayers, setReadyPlayers] = useState([]);
    const [isReady, setIsReady] = useState(false);

    // Previous round scores (frozen scores shown during question phase)
    const [previousRoundScores, setPreviousRoundScores] = useState({});

    // Difficulty group turn state
    const [isActiveGroup, setIsActiveGroup] = useState(true);
    const [groupInfo, setGroupInfo] = useState(null);
    const [waitingFor, setWaitingFor] = useState(null);

    // Final phase winner celebration
    const [showWinnerCelebration, setShowWinnerCelebration] = useState(false);

    // Refs for timer sync
    const roomIdRef = useRef(currentRoom?.id);
    const questionEndTimeRef = useRef(null);
    const rulesEndTimeRef = useRef(null);
    const standingsRef = useRef([]);
    const speedRoundEndTimeRef = useRef(null);
    const previousRoundScoresRef = useRef({});  // Track pre-speed round scores

    // Keep refs in sync
    useEffect(() => { roomIdRef.current = currentRoom?.id; }, [currentRoom?.id]);
    useEffect(() => { standingsRef.current = standings; }, [standings]);
    useEffect(() => { previousRoundScoresRef.current = previousRoundScores; }, [previousRoundScores]);

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

    // Socket event handlers
    useEffect(() => {
        const onMathRulesStart = (data) => {
            setPhase('rules');
            setCurrentRound(data.round);
            setTotalRounds(data.totalRounds);
            setIsSpeedRound(data.isSpeedRound);
            setTotalQuestions(data.questionsInRound);
            rulesEndTimeRef.current = data.rulesEndTime;

            // Reset question state for new round
            setCurrentQuestion(null);
            setCurrentInput('');
            setHasAnswered(false);
            setAnsweredPlayers([]);
            setRevealData(null);
            setNextRoundCountdown(null);

            // Reset ready state for new round
            setReadyPlayers(data.readyPlayers || []);
            setIsReady(false);

            // Handle speed round timer
            if (data.isSpeedRound && data.speedRoundEndTime) {
                speedRoundEndTimeRef.current = data.speedRoundEndTime;
            } else {
                speedRoundEndTimeRef.current = null;
            }
        };

        const onMathQuestion = (data) => {
            setPhase('question');
            setCurrentQuestion(data.question);
            setCategory(data.category);
            setQuestionNumber(data.questionNumber);
            setTotalQuestions(data.totalQuestions);
            setCurrentRound(data.round);
            setTotalRounds(data.totalRounds);
            setIsSpeedRound(data.isSpeedRound);
            questionEndTimeRef.current = data.questionEndTime;

            // Handle group turn info
            if (data.groupInfo) {
                setGroupInfo(data.groupInfo);
                setIsActiveGroup(data.isActiveGroup !== false);
                setWaitingFor(null);
            } else {
                setGroupInfo(null);
                setIsActiveGroup(true);
                setWaitingFor(null);
            }

            // Reset answer state
            setCurrentInput('');
            setHasAnswered(false);
            setAnsweredPlayers([]);
            setRevealData(null);
        };

        const onMathAnswerReceived = (data) => {
            setAnsweredPlayers(prev => {
                if (prev.includes(data.playerName)) return prev;
                return [...prev, data.playerName];
            });
        };

        const onMathReveal = (data) => {
            setPhase('reveal');
            setRevealData(data);
        };

        const onMathRecap = (data) => {
            setRecapQuestionIndex(-1);
            setAnimatedStandings([]);
            setShowingQuestion(true);
            setNextRoundCountdown(null);
            setAllQuestionsRevealed(false);  // Reset reveal state
            setPhase('recap');
            setRecapData(data);
            setStandings(data.standings);
            speedRoundEndTimeRef.current = null;
        };

        const onMathFinalResults = (data) => {
            // Store final data - WinnerCelebration will show when speedRecapPhase becomes 'final'
            setFinalData(data);
            setStandings(data.finalStandings);
        };

        // Speed round event handlers
        const onSpeedRoundQuestion = (data) => {
            setPhase('speedRound');
            setIsSpeedRound(true);
            setCurrentRound(4);
            setCurrentQuestion(data.question);
            setSpeedRoundAnswers(data.answers);
            setCategory(data.category);
            setQuestionNumber(data.questionNumber);
            speedRoundEndTimeRef.current = data.speedRoundEndTime;
            setSpeedRoundFeedback(null);
            setSpeedRoundCorrectAnswer(null);
            setSelectedAnswer(null);
            setHasAnswered(false);
            setSpeedRoundWaiting(false);
            // Capture player's difficulty for display
            if (data.difficultyLabel) {
                setSpeedRoundDifficulty(data.difficultyLabel);
            }
        };

        const onSpeedRoundCorrect = (data) => {
            setSpeedRoundFeedback('correct');
            setSpeedRoundStats({
                answered: data.questionsAnswered,
                correct: data.questionsAnswered,
                points: data.totalPoints
            });
            setTimeout(() => setSpeedRoundFeedback(null), 1000);
        };

        const onSpeedRoundWrong = (data) => {
            setSpeedRoundFeedback('wrong');
            setSpeedRoundCorrectAnswer({ index: data.correctIndex, answer: data.correctAnswer });
            setSpeedRoundStats(prev => ({
                ...prev,
                answered: data.questionsAnswered
            }));
        };

        const onSpeedRoundWaiting = (data) => {
            setSpeedRoundWaiting(true);
            setSpeedRoundStats({
                answered: data.questionsAnswered,
                correct: data.correctCount,
                points: data.totalPoints
            });
        };

        const onSpeedRoundRecap = (data) => {
            setPhase('speedRecap');
            setRaceData(data);
            setRaceStep(0);
            setRaceStarted(false);
            setRaceComplete(false);
            setRaceCountdown(3);
            setSpeedRoundWaiting(false);
            setSpeedRoundFeedback(null);
            setSpeedRecapPhase('race');
            // Build pre-speed standings from previousRoundScores (Rounds 1-3 only, before speed round)
            // This ensures the leaderboard phase shows scores WITHOUT speed round points
            const preSpeed = standingsRef.current.map(p => ({
                ...p,
                score: previousRoundScoresRef.current[p.name] || 0
            })).sort((a, b) => b.score - a.score);
            setPreSpeedStandings(preSpeed);
            setAnimatedFinalScores({});
        };

        const onMathPlayerReady = (data) => {
            setReadyPlayers(data.readyPlayers || []);
        };

        const onMathSync = (data) => {
            if (data.gameType !== 'quickmath') return;

            setPhase(data.phase);
            setCurrentRound(data.currentRound);
            setTotalRounds(data.totalRounds);
            setIsSpeedRound(data.isSpeedRound);
            setQuestionNumber(data.questionNumber);
            setTotalQuestions(data.totalQuestions);
            setHasAnswered(data.hasAnswered);
            setAnsweredPlayers(data.answeredPlayers || []);

            if (data.question) {
                setCurrentQuestion(data.question);
                setCategory(data.category);
                questionEndTimeRef.current = data.questionEndTime;
            }

            if (data.rulesEndTime) {
                rulesEndTimeRef.current = data.rulesEndTime;
            }

            if (data.speedRoundEndTime) {
                speedRoundEndTimeRef.current = data.speedRoundEndTime;
            }

            if (data.standings) {
                setStandings(data.standings);
            }

            // Handle group turn info
            if (data.groupInfo) {
                setGroupInfo(data.groupInfo);
                setIsActiveGroup(data.isActiveGroup !== false);
                setWaitingFor(data.waitingFor || null);
            } else {
                setGroupInfo(null);
                setIsActiveGroup(true);
                setWaitingFor(null);
            }

            // Restore speed round state if applicable
            if (data.isSpeedRound && data.speedQuestion) {
                setCurrentQuestion(data.speedQuestion);
                setCategory(data.speedCategory);
                setSpeedRoundAnswers(data.speedAnswers || []);
                setSpeedRoundStats({
                    answered: data.speedQuestionsAnswered || 0,
                    correct: data.speedCorrectAnswers || 0,
                    points: (data.speedCorrectAnswers || 0) * 200
                });
            }
        };

        const onScoresUpdated = (data) => {
            const updated = data.players
                .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
                .sort((a, b) => b.score - a.score);
            setStandings(updated);
        };

        const onMathGroupWaiting = (data) => {
            // Player is not in active group - show waiting screen
            setPhase('groupWaiting');
            setQuestionNumber(data.questionNumber);
            setTotalQuestions(data.totalQuestions);
            setCurrentRound(data.round);
            setTotalRounds(data.totalRounds);
            setGroupInfo(data.groupInfo);
            setWaitingFor(data.waitingFor);
            setIsActiveGroup(false);

            // Reset answer state for this question
            setCurrentInput('');
            setHasAnswered(false);
        };

        const onGameEnded = () => {
            setPhase('rules');
            setCurrentRound(1);
            setIsSpeedRound(false);
            setCurrentQuestion(null);
            setCurrentInput('');
            setHasAnswered(false);
            setAnsweredPlayers([]);
            setRevealData(null);
            setRecapData(null);
            setFinalData(null);
            setShowWinnerCelebration(false);
            setGroupInfo(null);
            setIsActiveGroup(true);
            setWaitingFor(null);
        };

        socket.on('mathRulesStart', onMathRulesStart);
        socket.on('mathQuestion', onMathQuestion);
        socket.on('mathGroupWaiting', onMathGroupWaiting);
        socket.on('mathAnswerReceived', onMathAnswerReceived);
        socket.on('mathReveal', onMathReveal);
        socket.on('mathRecap', onMathRecap);
        socket.on('mathFinalResults', onMathFinalResults);
        socket.on('mathSync', onMathSync);
        socket.on('scoresUpdated', onScoresUpdated);
        socket.on('gameEnded', onGameEnded);
        socket.on('speedRoundQuestion', onSpeedRoundQuestion);
        socket.on('speedRoundCorrect', onSpeedRoundCorrect);
        socket.on('speedRoundWrong', onSpeedRoundWrong);
        socket.on('speedRoundWaiting', onSpeedRoundWaiting);
        socket.on('speedRoundRecap', onSpeedRoundRecap);
        socket.on('mathPlayerReady', onMathPlayerReady);

        return () => {
            socket.off('mathRulesStart', onMathRulesStart);
            socket.off('mathQuestion', onMathQuestion);
            socket.off('mathGroupWaiting', onMathGroupWaiting);
            socket.off('mathAnswerReceived', onMathAnswerReceived);
            socket.off('mathReveal', onMathReveal);
            socket.off('mathRecap', onMathRecap);
            socket.off('mathFinalResults', onMathFinalResults);
            socket.off('mathSync', onMathSync);
            socket.off('scoresUpdated', onScoresUpdated);
            socket.off('gameEnded', onGameEnded);
            socket.off('speedRoundQuestion', onSpeedRoundQuestion);
            socket.off('speedRoundCorrect', onSpeedRoundCorrect);
            socket.off('speedRoundWrong', onSpeedRoundWrong);
            socket.off('speedRoundWaiting', onSpeedRoundWaiting);
            socket.off('speedRoundRecap', onSpeedRoundRecap);
            socket.off('mathPlayerReady', onMathPlayerReady);
        };
    }, []);

    // Rules timer countdown
    useEffect(() => {
        if (phase !== 'rules') return;

        const tick = () => {
            const endTime = rulesEndTimeRef.current;
            if (!endTime) return;
            const remaining = Math.ceil((endTime - getServerTime()) / 1000);
            setRulesTimer(Math.max(0, remaining));
        };

        tick();
        const interval = setInterval(tick, 250);
        return () => clearInterval(interval);
    }, [phase]);

    // Question timer countdown
    useEffect(() => {
        if (phase !== 'question') return;

        const tick = () => {
            const endTime = questionEndTimeRef.current;
            if (!endTime) return;
            const remaining = Math.ceil((endTime - getServerTime()) / 1000);
            setTimer(Math.max(0, remaining));
        };

        tick();
        const interval = setInterval(tick, 250);
        return () => clearInterval(interval);
    }, [phase]);

    // Speed round 60s timer countdown
    useEffect(() => {
        if (!isSpeedRound || phase === 'recap' || phase === 'speedRecap') return;

        const tick = () => {
            const endTime = speedRoundEndTimeRef.current;
            if (!endTime) return;
            const remaining = Math.ceil((endTime - getServerTime()) / 1000);
            setSpeedRoundTimer(Math.max(0, remaining));
        };

        tick();
        const interval = setInterval(tick, 250);
        return () => clearInterval(interval);
    }, [isSpeedRound, phase]);

    // Animated recap - show ALL groups simultaneously, then cascade player reveals
    useEffect(() => {
        if (phase !== 'recap' || !recapData?.questionHistory) return;

        // Reset animation state when entering recap
        setRecapQuestionIndex(0);  // Show all questions immediately
        setAnimatedStandings([]);
        setShowingQuestion(true);
        setNextRoundCountdown(null);
        setRecapAnimPhase(0);
        setAnimatedPointValues({});
        setRevealedPlayers({});
        setFlyingPoints([]);

        // Build initial standings using previousRoundScores (cumulative from previous rounds)
        const initialStandings = currentRoom?.players.map(p => ({
            name: p.name,
            avatar: p.avatar,
            score: previousRoundScores[p.name] || 0,
            connected: p.connected !== false
        })).sort((a, b) => (previousRoundScores[b.name] || 0) - (previousRoundScores[a.name] || 0)) || [];

        setAnimatedStandings(initialStandings);

        // Start phase 1 (player reveals) after 1 second of showing questions
        const startDelay = setTimeout(() => {
            setRecapAnimPhase(1);
        }, 1000);

        return () => clearTimeout(startDelay);
    }, [phase, recapData?.questionHistory?.length, currentRoom?.players, previousRoundScores]);

    // Helper: Get all active groups from all questions (include groups even if empty for display)
    const getActiveGroups = () => {
        if (!recapData?.questionHistory) return [];
        const questionHistory = recapData.questionHistory;

        // For the current question, get all groups
        const currentQ = questionHistory[recapQuestionIndex] || questionHistory[0];
        if (!currentQ) return [];

        if (currentQ.groupData && Array.isArray(currentQ.groupData)) {
            // Include all groups that have valid question data (even if no player results yet)
            const validGroups = currentQ.groupData.filter(g =>
                g && (g.question || g.correctAnswer)
            );
            // If we have valid groups, return them (even if playerResults is empty)
            if (validGroups.length > 0) {
                return validGroups.map(g => ({
                    ...g,
                    playerResults: g.playerResults || {}
                }));
            }
        }

        // Legacy format - single group (for backwards compatibility)
        if (currentQ.question || currentQ.correctAnswer) {
            return [{
                question: currentQ.question,
                category: currentQ.category,
                correctAnswer: currentQ.correctAnswer,
                playerResults: currentQ.playerResults || {},
                difficultyLabel: null
            }];
        }

        return [];
    };

    // Animation sequence for recap phase with simultaneous groups display
    // Phase 0: Questions visible (handled by initialization useEffect - 1s)
    // Phase 1: Cascade reveal players (150ms stagger per player)
    // Phase 2: Animate points (0.8s) then update standings
    // Auto-advance timing: 3.0s + (groups-1)*1.0s viewing time
    useEffect(() => {
        if (phase !== 'recap' || !recapData?.questionHistory) return;

        const activeGroups = getActiveGroups();
        // Even if no active groups (shouldn't happen), we still need to handle advancing
        if (activeGroups.length === 0) {
            // No groups to show - skip to auto-advance after brief delay
            if (recapAnimPhase === 1) {
                const timeout = setTimeout(() => setRecapAnimPhase(2), 500);
                return () => clearTimeout(timeout);
            }
            return;
        }

        // Collect ALL players from ALL groups for cascade reveal
        const allPlayers = [];
        activeGroups.forEach((groupData, groupIdx) => {
            Object.entries(groupData.playerResults || {}).forEach(([name, result]) => {
                allPlayers.push({
                    name,
                    isCorrect: result.isCorrect,
                    pointsEarned: result.pointsEarned || 0,
                    groupIdx
                });
            });
        });

        // Phase 1: Cascade reveal players (150ms stagger)
        if (recapAnimPhase === 1) {
            const timeouts = [];

            // If no players to reveal, skip directly to phase 2
            if (allPlayers.length === 0) {
                const phaseTimeout = setTimeout(() => {
                    setRecapAnimPhase(2);
                    setAnimatedPointValues({});
                }, 300);
                return () => clearTimeout(phaseTimeout);
            }

            allPlayers.forEach(({ name, isCorrect }, idx) => {
                const timeout = setTimeout(() => {
                    setRevealedPlayers(prev => ({
                        ...prev,
                        [name]: { revealed: true, correct: isCorrect }
                    }));
                }, idx * 150);
                timeouts.push(timeout);
            });

            // After all players revealed, move to phase 2
            const totalCascadeTime = allPlayers.length * 150 + 300; // extra buffer
            const phaseTimeout = setTimeout(() => {
                setRecapAnimPhase(2);
                // Initialize animated point values to 0 for correct players
                const initialPoints = {};
                allPlayers.forEach(({ name, isCorrect }) => {
                    if (isCorrect) {
                        initialPoints[name] = 0;
                    }
                });
                setAnimatedPointValues(initialPoints);
            }, totalCascadeTime);
            timeouts.push(phaseTimeout);

            return () => timeouts.forEach(t => clearTimeout(t));
        }

        // Phase 2: Animate points from 0 to earned over 0.8s
        if (recapAnimPhase === 2) {
            const animDuration = 800;
            const steps = 20;
            const stepDuration = animDuration / steps;
            let step = 0;

            // Get all correct players and their points
            const correctPlayers = allPlayers.filter(p => p.isCorrect && p.pointsEarned > 0);

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

                    // Create flying points for ALL correct players
                    const newFlyingPoints = correctPlayers.map(({ name, pointsEarned }) => ({
                        id: `${recapQuestionIndex}-${name}`,
                        playerName: name,
                        points: pointsEarned
                    }));
                    setFlyingPoints(newFlyingPoints);

                    // After brief delay, update standings with ALL points
                    setTimeout(() => {
                        setAnimatedStandings(prev => {
                            const updated = prev.map(player => {
                                // Sum points from all groups for this player
                                let totalPoints = 0;
                                activeGroups.forEach(groupData => {
                                    const result = groupData.playerResults?.[player.name];
                                    if (result?.isCorrect && result.pointsEarned) {
                                        totalPoints += result.pointsEarned;
                                    }
                                });
                                if (totalPoints > 0) {
                                    return { ...player, score: player.score + totalPoints };
                                }
                                return player;
                            });
                            return updated.sort((a, b) => b.score - a.score);
                        });
                        setFlyingPoints([]);
                    }, 500);

                    // Calculate viewing time: 3.0s base + 1.0s per additional group
                    const viewingTime = 3000 + Math.max(0, activeGroups.length - 1) * 1000;

                    // After viewing time, move to next question or finish
                    setTimeout(() => {
                        const questionHistory = recapData.questionHistory;
                        if (recapQuestionIndex < questionHistory.length - 1) {
                            // Move to next question
                            setRecapQuestionIndex(prev => prev + 1);
                            setRecapAnimPhase(0);
                            setAnimatedPointValues({});
                            setRevealedPlayers({});

                            // Start phase 1 after 1 second
                            setTimeout(() => setRecapAnimPhase(1), 1000);
                        } else {
                            // Animation complete - save final scores for next round's frozen scoreboard
                            const finalScores = {};
                            standings.forEach(p => { finalScores[p.name] = p.score; });
                            setPreviousRoundScores(finalScores);

                            // Mark animation complete - master controls when to proceed
                            setShowingQuestion(false);
                        }
                    }, viewingTime);
                }
            }, stepDuration);

            return () => clearInterval(interval);
        }
    }, [recapAnimPhase, phase, recapData?.questionHistory, recapQuestionIndex, standings, currentRoom?.id]);

    // Next round countdown and auto-advance
    useEffect(() => {
        if (nextRoundCountdown === null || (phase !== 'recap' && phase !== 'speedRecap')) return;

        if (nextRoundCountdown <= 0) {
            if (currentRoom?.id) {
                if (phase === 'speedRecap') {
                    socket.emit('mathEndAfterSpeed', { roomId: currentRoom.id });
                } else {
                    socket.emit('mathNextRound', { roomId: currentRoom.id });
                }
            }
            return;
        }

        const countdownTimer = setTimeout(() => {
            setNextRoundCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(countdownTimer);
    }, [nextRoundCountdown, phase, currentRoom?.id]);

    // Speed round race countdown: "3, 2, 1, GO!"
    useEffect(() => {
        if (phase !== 'speedRecap' || raceCountdown === null) return;

        if (raceCountdown <= 0) {
            setRaceStarted(true);
            setRaceCountdown(null);
            return;
        }

        const timer = setTimeout(() => {
            setRaceCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [phase, raceCountdown]);

    // Speed round race animation
    useEffect(() => {
        if (phase !== 'speedRecap' || !raceStarted || !raceData || raceComplete) return;

        const maxSteps = raceData.maxCorrect;
        if (raceStep >= maxSteps) {
            setRaceComplete(true);
            return;
        }

        const stepTimer = setTimeout(() => {
            setRaceStep(prev => prev + 1);
        }, raceData.stepDuration);

        return () => clearTimeout(stepTimer);
    }, [phase, raceStarted, raceData, raceStep, raceComplete]);

    // Handle race completion
    useEffect(() => {
        if (phase !== 'speedRecap' || !raceComplete || speedRecapPhase !== 'race') return;

        const pauseTimer = setTimeout(() => {
            setSpeedRecapPhase('winner');
        }, 3000);

        return () => clearTimeout(pauseTimer);
    }, [phase, raceComplete, speedRecapPhase]);

    // Speed recap phase transitions
    useEffect(() => {
        if (phase !== 'speedRecap' || !raceComplete || !raceData) return;

        if (speedRecapPhase === 'winner') {
            const timer = setTimeout(() => {
                setSpeedRecapPhase('leaderboard');
                const initialScores = {};
                preSpeedStandings.forEach(p => {
                    initialScores[p.name] = p.score;
                });
                setAnimatedFinalScores(initialScores);
            }, 4000);
            return () => clearTimeout(timer);
        }

        if (speedRecapPhase === 'leaderboard') {
            const timer = setTimeout(() => {
                setSpeedRecapPhase('animating');
            }, 2500);
            return () => clearTimeout(timer);
        }

        if (speedRecapPhase === 'animating') {
            const animDuration = 2000;
            const steps = 30;
            const stepDuration = animDuration / steps;
            let step = 0;

            const interval = setInterval(() => {
                step++;
                const progress = Math.min(step / steps, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);

                const newScores = {};
                preSpeedStandings.forEach(p => {
                    const speedPoints = raceData.raceData.find(r => r.name === p.name)?.totalPoints || 0;
                    newScores[p.name] = Math.round(p.score + (speedPoints * easedProgress));
                });
                setAnimatedFinalScores(newScores);

                if (step >= steps) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setSpeedRecapPhase('final');
                    }, 500);
                }
            }, stepDuration);

            return () => clearInterval(interval);
        }

        if (speedRecapPhase === 'final') {
            // Show winner celebration after a short delay to let players see final scores
            const timer = setTimeout(() => {
                setShowWinnerCelebration(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [phase, raceComplete, speedRecapPhase, raceData, preSpeedStandings]);

    // Dev mode: Backtick key to skip to speed round (direct skip, no modal)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '`') {
                console.log('[DEV] Backtick pressed, currentRound:', currentRound, 'isSpeedRound:', isSpeedRound, 'roomId:', currentRoom?.id);
                if (currentRound < 4 && !isSpeedRound && currentRoom?.id) {
                    console.log('[DEV] Emitting devSkipToSpeedRound');
                    socket.emit('devSkipToSpeedRound', { roomId: currentRoom.id });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentRound, isSpeedRound, currentRoom?.id]);

    // NumberPad handlers
    const handleNumberPress = (num) => {
        if (hasAnswered || phase !== 'question') return;
        if (currentInput.length >= 6) return;  // Max 6 digits
        setCurrentInput(prev => prev + num);
    };

    const handleClear = () => {
        if (hasAnswered || phase !== 'question') return;
        setCurrentInput('');
    };

    const handleBackspace = () => {
        if (hasAnswered || phase !== 'question') return;
        setCurrentInput(prev => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        if (hasAnswered || phase !== 'question' || !currentInput) return;

        setHasAnswered(true);

        if (currentRoom?.id) {
            socket.emit('mathAnswer', { roomId: currentRoom.id, answer: parseInt(currentInput, 10) });
        }
    };

    // Submit answer handler for speed round (multiple choice)
    const submitSpeedRoundAnswer = (answerIndex) => {
        if (speedRoundFeedback || phase !== 'speedRound') return;

        setSelectedAnswer(answerIndex);

        if (currentRoom?.id) {
            socket.emit('mathAnswer', { roomId: currentRoom.id, answerIndex });
        }
    };

    // Handle player clicking ready button
    const handleReady = () => {
        if (isReady || phase !== 'rules') return;

        setIsReady(true);
        if (currentRoom?.id) {
            socket.emit('mathReady', { roomId: currentRoom.id });
        }
    };

    // Master advances to next round
    const handleNextRound = () => {
        if (!isMaster || phase !== 'recap') return;

        if (currentRoom?.id) {
            socket.emit('mathNextRound', { roomId: currentRoom.id });
        }
    };

    // Master reveals all questions at once
    const handleRevealAllQuestions = () => {
        if (!isMaster || phase !== 'recap') return;

        const questionHistory = recapData?.questionHistory || [];
        if (questionHistory.length === 0) return;

        // Set to last question index
        setRecapQuestionIndex(questionHistory.length - 1);

        // Reveal all players immediately
        const allPlayers = {};
        questionHistory.forEach(q => {
            if (q.groupData && Array.isArray(q.groupData)) {
                q.groupData.forEach(g => {
                    const playerNames = g.playerNames || Object.keys(g.playerResults || {});
                    playerNames.forEach(name => {
                        const result = g.playerResults?.[name];
                        allPlayers[name] = { revealed: true, correct: result?.isCorrect || false };
                    });
                });
            } else if (q.playerResults) {
                Object.entries(q.playerResults).forEach(([name, result]) => {
                    allPlayers[name] = { revealed: true, correct: result?.isCorrect || false };
                });
            }
        });
        setRevealedPlayers(allPlayers);

        // Update standings with all points
        const updatedStandings = standings.map(player => {
            let totalPoints = 0;
            questionHistory.forEach(q => {
                if (q.groupData && Array.isArray(q.groupData)) {
                    q.groupData.forEach(g => {
                        const result = g.playerResults?.[player.name];
                        if (result?.isCorrect && result.pointsEarned) {
                            totalPoints += result.pointsEarned;
                        }
                    });
                } else if (q.playerResults?.[player.name]) {
                    const result = q.playerResults[player.name];
                    if (result?.isCorrect && result.pointsEarned) {
                        totalPoints += result.pointsEarned;
                    }
                }
            });
            return { ...player, score: player.score + totalPoints };
        });
        setAnimatedStandings(updatedStandings.sort((a, b) => b.score - a.score));

        // Mark animation as complete
        setRecapAnimPhase(2);
        setShowingQuestion(false);
        setAllQuestionsRevealed(true);

        // Save final scores for next round's frozen scoreboard
        const finalScores = {};
        updatedStandings.forEach(p => { finalScores[p.name] = p.score; });
        setPreviousRoundScores(finalScores);
    };

    // End game early (master only)
    const handleEndGame = () => {
        if (!isMaster) return;

        if (currentRoom?.id) {
            socket.emit('endGameEarly', { roomId: currentRoom.id });
        }
        setShowEndGameConfirm(false);
    };

    // NumberPad component
    const renderNumberPad = () => {
        const buttonBase = `h-11 md:h-12 rounded-lg font-bold text-lg transition-all ${
            hasAnswered
                ? 'opacity-50 cursor-not-allowed'
                : 'active:scale-95'
        }`;

        const numButtonStyle = hasAnswered
            ? (theme === 'tron' ? 'bg-gray-800 text-gray-600' : theme === 'kids' ? 'bg-gray-200 text-gray-400' : 'bg-gray-800 text-gray-600')
            : (theme === 'tron' ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30' : theme === 'kids' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-2 border-purple-300' : 'bg-orange-900/30 text-orange-400 hover:bg-orange-900/40 border border-orange-700');

        const actionButtonStyle = hasAnswered
            ? (theme === 'tron' ? 'bg-gray-800 text-gray-600' : theme === 'kids' ? 'bg-gray-200 text-gray-400' : 'bg-gray-800 text-gray-600')
            : (theme === 'tron' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' : theme === 'kids' ? 'bg-red-100 text-red-600 hover:bg-red-200 border-2 border-red-300' : 'bg-red-900/30 text-red-400 hover:bg-red-900/40 border border-red-700');

        const submitButtonStyle = hasAnswered
            ? (theme === 'tron' ? 'bg-green-500/30 text-green-400 border-2 border-green-500' : theme === 'kids' ? 'bg-green-400 text-white border-2 border-green-500' : 'bg-green-700/40 text-green-400 border-2 border-green-600')
            : !currentInput
            ? (theme === 'tron' ? 'bg-gray-800 text-gray-600' : theme === 'kids' ? 'bg-gray-200 text-gray-400' : 'bg-gray-800 text-gray-600')
            : (theme === 'tron' ? 'bg-green-500 text-black hover:bg-green-400' : theme === 'kids' ? 'bg-green-500 text-white hover:bg-green-400' : 'bg-green-600 text-white hover:bg-green-500');

        return (
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl p-2 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'}`}>
                {/* Display area */}
                <div className={`h-12 mb-2 rounded-lg flex items-center justify-center text-2xl font-black ${theme === 'tron' ? 'bg-gray-900 text-cyan-400 border border-cyan-500/50' : theme === 'kids' ? 'bg-white text-purple-700 border-2 border-purple-400' : 'bg-gray-900 text-orange-400 border border-orange-700/50'}`}>
                    {currentInput || <span className="opacity-40">?</span>}
                </div>

                {/* Number grid */}
                <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => handleNumberPress(String(num))}
                            disabled={hasAnswered}
                            className={`${buttonBase} ${numButtonStyle}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {/* Bottom row: Clear, 0, Backspace */}
                <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                    <button
                        onClick={handleClear}
                        disabled={hasAnswered}
                        className={`${buttonBase} ${actionButtonStyle} text-sm`}
                    >
                        CLR
                    </button>
                    <button
                        onClick={() => handleNumberPress('0')}
                        disabled={hasAnswered}
                        className={`${buttonBase} ${numButtonStyle}`}
                    >
                        0
                    </button>
                    <button
                        onClick={handleBackspace}
                        disabled={hasAnswered}
                        className={`${buttonBase} ${actionButtonStyle}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                        </svg>
                    </button>
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    disabled={hasAnswered || !currentInput}
                    className={`${buttonBase} w-full ${submitButtonStyle}`}
                >
                    {hasAnswered ? 'Submitted!' : 'SUBMIT'}
                </button>
            </div>
        );
    };

    // Render Rules Phase
    const renderRulesPhase = () => {
        // Speed Round (Round 4)
        if (isSpeedRound) {
            return (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="text-center">
                        <div className="mb-6">
                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center font-black text-3xl bg-red-600 text-white shadow-lg animate-pulse">
                                {rulesTimer}
                            </div>
                        </div>

                        <div className="text-8xl mb-4 animate-bounce">&#9889;</div>

                        <h1 className="text-4xl md:text-6xl font-black text-red-500 mb-4 animate-pulse" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6)' }}>
                            SPEED ROUND!
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-black text-yellow-400 mb-4 animate-pulse" style={{ textShadow: '0 0 15px rgba(250, 204, 21, 0.8)' }}>
                            60 SECONDS!
                        </h2>
                        <h3 className="text-xl md:text-3xl font-black text-white mb-6 animate-bounce">
                            MULTIPLE CHOICE - TAP FAST!!!
                        </h3>

                        <div className="flex flex-wrap justify-center gap-4 text-white/80 text-lg">
                            <span className="bg-red-600/40 px-4 py-2 rounded-full border border-red-500">60 seconds total</span>
                            <span className="bg-yellow-600/40 px-4 py-2 rounded-full border border-yellow-500">2x Points</span>
                            <span className="bg-purple-600/40 px-4 py-2 rounded-full border border-purple-500">4 choices each</span>
                        </div>
                    </div>
                </div>
            );
        }

        // Rounds 2-3
        if (currentRound > 1) {
            const totalPlayers = currentRoom?.players?.length || 1;
            const readyCount = readyPlayers.length;
            const allReady = readyCount >= totalPlayers;

            return (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-md w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'} relative text-center`}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${rulesTimer <= 1 ? 'bg-red-600 animate-pulse' : (theme === 'tron' ? 'bg-cyan-500' : theme === 'kids' ? 'bg-purple-500' : 'bg-orange-600')} text-white shadow-lg`}>
                                {rulesTimer}
                            </div>
                        </div>

                        <div className="text-5xl mb-4 mt-4">&#128290;</div>
                        <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} mb-3 ${currentTheme.font}`}>
                            {theme === 'tron' ? `> ROUND_${currentRound}` : `Round ${currentRound}`}
                        </h2>
                        <div className={`text-xl font-bold ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'} mb-2`}>
                            Same rules!
                        </div>

                        <button
                            onClick={handleReady}
                            disabled={isReady}
                            className={`w-full py-2 rounded-xl font-bold transition-all mt-3 ${
                                isReady
                                    ? (theme === 'tron' ? 'bg-green-500/30 text-green-400 border-2 border-green-500' : theme === 'kids' ? 'bg-green-400 text-white border-2 border-green-500' : 'bg-green-700/40 text-green-400 border-2 border-green-600')
                                    : (theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-600 hover:bg-orange-500 text-white')
                            }`}
                        >
                            {isReady ? 'Ready!' : "I'm Ready!"}
                        </button>

                        <div className={`text-sm mt-2 ${allReady ? 'text-green-400 font-bold animate-pulse' : currentTheme.textSecondary}`}>
                            {allReady ? 'All ready! Starting...' : `${readyCount}/${totalPlayers} ready`}
                        </div>
                    </div>
                </div>
            );
        }

        // Round 1 - Full rules
        const totalPlayers = currentRoom?.players?.length || 1;
        const readyCount = readyPlayers.length;
        const allReady = readyCount >= totalPlayers;

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-md w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'} relative`}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${rulesTimer <= 3 ? 'bg-red-600 animate-pulse' : (theme === 'tron' ? 'bg-cyan-500' : theme === 'kids' ? 'bg-purple-500' : 'bg-orange-600')} text-white shadow-lg`}>
                            {rulesTimer}
                        </div>
                    </div>

                    <div className="text-center mb-4 mt-4">
                        <div className="text-5xl mb-4">&#128290;</div>
                        <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                            {theme === 'tron' ? '> QUICK_MATH' : 'Quick Math!'}
                        </h2>
                        <div className={`text-sm ${currentTheme.textSecondary}`}>Round 1 of {totalRounds}</div>
                    </div>

                    <div className={`space-y-3 mb-6 ${currentTheme.textSecondary} text-sm`}>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">&#128290;</span>
                            <p>Type your answer using the <strong className={currentTheme.text}>number pad</strong></p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">&#9202;</span>
                            <p><strong className={currentTheme.text}>15 seconds</strong> to answer each question</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">&#127942;</span>
                            <p>Faster answers = <strong className={currentTheme.text}>more points</strong>!</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">&#9889;</span>
                            <p>Round 4 is a <strong className="text-red-400">Speed Round</strong> with <strong className="text-yellow-400">multiple choice</strong>!</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-600/30">
                        <button
                            onClick={handleReady}
                            disabled={isReady}
                            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                                isReady
                                    ? (theme === 'tron' ? 'bg-green-500/30 text-green-400 border-2 border-green-500' : theme === 'kids' ? 'bg-green-400 text-white border-2 border-green-500' : 'bg-green-700/40 text-green-400 border-2 border-green-600')
                                    : (theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-600 hover:bg-orange-500 text-white')
                            }`}
                        >
                            {isReady ? 'Ready!' : "I'm Ready!"}
                        </button>

                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                            {currentRoom?.players?.map((player, idx) => {
                                const playerIsReady = readyPlayers.includes(player.name);
                                const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                                return (
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all ${
                                            playerIsReady
                                                ? (theme === 'tron' ? 'bg-green-500/20 border border-green-500/50' : theme === 'kids' ? 'bg-green-200 border border-green-400' : 'bg-green-700/30 border border-green-600/50')
                                                : (theme === 'tron' ? 'bg-gray-800/50 border border-gray-700' : theme === 'kids' ? 'bg-gray-200 border border-gray-300' : 'bg-gray-800/50 border border-gray-700')
                                        }`}
                                    >
                                        <div className="w-5 h-5">
                                            <CharacterSVG characterId={player.avatar} size={20} color={playerIsReady ? character.color : '#666'} />
                                        </div>
                                        <span className={`text-xs font-semibold ${playerIsReady ? 'text-green-400' : 'text-gray-500'}`}>
                                            {player.name}
                                        </span>
                                        {playerIsReady && <span className="text-green-400 text-xs">&#10003;</span>}
                                    </div>
                                );
                            })}
                        </div>
                        <div className={`text-center mt-2 text-sm ${allReady ? 'text-green-400 font-bold animate-pulse' : currentTheme.textSecondary}`}>
                            {allReady ? 'All players ready! Starting...' : `${readyCount}/${totalPlayers} ready`}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render Question Phase
    const renderQuestionPhase = () => (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-lg p-1.5 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'} mb-2`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className={`${theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-700/40 text-orange-400 border border-orange-700'} px-2 py-0.5 rounded-lg`}>
                        <span className="text-xs font-bold">R{currentRound}/{totalRounds}</span>
                    </div>

                    <div className={`${theme === 'tron' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400' : theme === 'kids' ? 'bg-pink-500 text-white' : 'bg-purple-700/40 text-purple-400 border border-purple-700'} px-2 py-0.5 rounded-lg`}>
                        <span className="text-xs font-bold">Q{questionNumber}/{totalQuestions}</span>
                    </div>

                    {/* Group turn indicator */}
                    {groupInfo && groupInfo.currentGroup && (
                        <div className={`${theme === 'tron' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : theme === 'kids' ? 'bg-green-400 text-white' : 'bg-green-700/40 text-green-400 border border-green-700'} px-2 py-0.5 rounded-lg`}>
                            <span className="text-xs font-bold">{groupInfo.currentGroup.label} Turn</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Question Card */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl p-3 md:p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-2`}>
                {/* Prominent Timer - directly above question */}
                <div className="flex justify-center mb-3">
                    <div className={`${timer <= 3 ? (theme === 'tron' ? 'bg-red-500/30 text-red-400 border-2 border-red-500' : theme === 'kids' ? 'bg-red-500 text-white' : 'bg-red-700/40 text-red-400 border-2 border-red-700') : (theme === 'tron' ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-400' : theme === 'kids' ? 'bg-green-500 text-white' : 'bg-orange-700/40 text-orange-400 border-2 border-orange-700')} px-5 py-1.5 rounded-xl flex items-center gap-2 ${timer <= 3 ? 'animate-pulse' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span className="text-2xl md:text-3xl font-black">{timer}s</span>
                    </div>
                </div>

                {/* Category */}
                <div className="text-center mb-1">
                    <span className={`inline-block ${theme === 'tron' ? 'bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 text-purple-700' : 'bg-orange-900/30 text-orange-400'} px-2 py-0.5 rounded-full text-xs font-semibold`}>
                        {MATH_CATEGORY_ICONS[category] || '+'} {category}
                    </span>
                </div>

                {/* Question */}
                <h2 className={`text-3xl md:text-5xl font-black ${currentTheme.text} text-center mb-2 ${currentTheme.font}`}>
                    {currentQuestion}
                </h2>

                {/* Answered indicator */}
                {hasAnswered && (
                    <div className={`text-center ${currentTheme.textSecondary} text-sm`}>
                        <span className="text-green-400 font-semibold">Answer: {currentInput}</span> - Waiting...
                    </div>
                )}
            </div>

            {/* NumberPad */}
            {renderNumberPad()}

            {/* Players who answered + Scoreboard in 2-column layout on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {/* Players who answered */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-lg p-2 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'}`}>
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-xs ${currentTheme.textSecondary}`}>Answered:</span>
                        {currentRoom?.players.map((player, idx) => {
                            const playerAnswered = answeredPlayers.includes(player.name);
                            const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                            return (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${playerAnswered ? (theme === 'tron' ? 'bg-green-500/20 border border-green-500/50' : theme === 'kids' ? 'bg-green-200 border border-green-400' : 'bg-green-700/30 border border-green-600/50') : (theme === 'tron' ? 'bg-gray-800/50 border border-gray-700' : theme === 'kids' ? 'bg-gray-200 border border-gray-300' : 'bg-gray-800/50 border border-gray-700')}`}
                                >
                                    <div className="w-4 h-4">
                                        <CharacterSVG characterId={player.avatar} size={16} color={playerAnswered ? character.color : '#666'} />
                                    </div>
                                    <span className={`text-[10px] font-semibold ${playerAnswered ? (theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-green-700' : 'text-green-400') : 'text-gray-500'}`}>
                                        {player.name}
                                    </span>
                                    {playerAnswered && <span className="text-green-400 text-[10px]">&#10003;</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Game Scoreboard - frozen during question phase */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-lg p-2 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'}`}>
                    <h3 className={`text-xs font-bold ${currentTheme.text} mb-1`}>
                        {theme === 'tron' ? '> STANDINGS' : 'Standings'}
                    </h3>
                    <div className="space-y-0.5">
                        {[...(currentRoom?.players || [])]
                            .map(p => ({ ...p, prevScore: previousRoundScores[p.name] || 0 }))
                            .sort((a, b) => b.prevScore - a.prevScore)
                            .map((player, idx) => {
                                const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                                const isMe = player.name === playerName;
                                const isLeader = idx === 0 && player.prevScore > 0;
                                return (
                                    <div
                                        key={player.name}
                                        className={`flex items-center gap-1.5 p-1 rounded ${isMe ? (theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500' : theme === 'kids' ? 'bg-purple-200 border border-purple-400' : 'bg-orange-700/30 border border-orange-600') : (theme === 'tron' ? 'bg-gray-800/30' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/30')}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${isLeader ? 'bg-yellow-500 text-black' : (theme === 'tron' ? 'bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-gray-300 text-purple-700' : 'bg-gray-700 text-orange-400')}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="w-5 h-5">
                                            <CharacterSVG characterId={player.avatar} size={20} color={character.color} />
                                        </div>
                                        <span className={`flex-1 text-xs font-semibold ${currentTheme.text} truncate`}>
                                            {player.name}
                                            {isLeader && <span className="ml-0.5">&#128081;</span>}
                                        </span>
                                        <span className={`font-black text-xs ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                            {player.prevScore}
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );

    // Render Reveal Phase
    const renderRevealPhase = () => (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-lg p-2 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'} mb-3`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className={`${theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-700/40 text-orange-400 border border-orange-700'} px-3 py-1 rounded-lg`}>
                        <span className="text-sm font-bold">Round {currentRound}/{totalRounds}</span>
                    </div>
                    <div className={`${theme === 'tron' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : theme === 'kids' ? 'bg-green-500 text-white' : 'bg-green-700/40 text-green-400 border border-green-700'} px-3 py-1 rounded-lg`}>
                        <span className="text-sm font-bold">Answer Revealed!</span>
                    </div>
                </div>
            </div>

            {/* Question Card with reveal */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 md:p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4`}>
                <div className="text-center mb-3">
                    <span className={`inline-block ${theme === 'tron' ? 'bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 text-purple-700' : 'bg-orange-900/30 text-orange-400'} px-3 py-1 rounded-full text-sm font-semibold`}>
                        {MATH_CATEGORY_ICONS[category] || '+'} {category}
                    </span>
                </div>

                <h2 className={`text-4xl md:text-6xl font-black ${currentTheme.text} text-center mb-4 ${currentTheme.font}`}>
                    {currentQuestion}
                </h2>

                {/* Correct answer display - use player-specific answer for per-group questions */}
                <div className={`text-center p-4 rounded-xl ${theme === 'tron' ? 'bg-green-500/20 border-2 border-green-500' : theme === 'kids' ? 'bg-green-200 border-4 border-green-400' : 'bg-green-700/30 border-2 border-green-600'}`}>
                    <div className={`text-lg font-semibold ${currentTheme.textSecondary} mb-1`}>Correct Answer:</div>
                    <div className="text-5xl font-black text-green-400">
                        {revealData?.correctAnswersByPlayer?.[playerName] ?? revealData?.correctAnswer}
                    </div>
                </div>

                {/* Player result */}
                {revealData?.playerResults?.[playerName] && (
                    <div className={`mt-4 text-center p-3 rounded-xl ${revealData.playerResults[playerName].isCorrect ? (theme === 'tron' ? 'bg-green-500/20 border border-green-500' : theme === 'kids' ? 'bg-green-200 border-2 border-green-400' : 'bg-green-700/30 border border-green-600') : (theme === 'tron' ? 'bg-red-500/20 border border-red-500' : theme === 'kids' ? 'bg-red-200 border-2 border-red-400' : 'bg-red-700/30 border border-red-600')}`}>
                        {revealData.playerResults[playerName].isCorrect ? (
                            <span className="text-green-400 font-bold text-lg">
                                +{revealData.playerResults[playerName].pointsEarned} points!
                            </span>
                        ) : (
                            <span className="text-red-400 font-bold text-lg">
                                Your answer: {revealData.playerResults[playerName].answer || 'No answer'}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Scoreboard */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl p-3 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'}`}>
                <h3 className={`text-sm font-bold ${currentTheme.text} mb-2`}>
                    {theme === 'tron' ? '> GAME_STANDINGS' : 'Game Standings'}
                </h3>
                <div className="space-y-1">
                    {[...(currentRoom?.players || [])]
                        .map(p => ({ ...p, prevScore: previousRoundScores[p.name] || 0 }))
                        .sort((a, b) => b.prevScore - a.prevScore)
                        .map((player, idx) => {
                            const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                            const isMe = player.name === playerName;
                            const isLeader = idx === 0 && player.prevScore > 0;
                            return (
                                <div
                                    key={player.name}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? (theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500' : theme === 'kids' ? 'bg-purple-200 border border-purple-400' : 'bg-orange-700/30 border border-orange-600') : (theme === 'tron' ? 'bg-gray-800/30' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/30')}`}
                                >
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isLeader ? 'bg-yellow-500 text-black' : (theme === 'tron' ? 'bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-gray-300 text-purple-700' : 'bg-gray-700 text-orange-400')}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="w-6 h-6">
                                        <CharacterSVG characterId={player.avatar} size={24} color={character.color} />
                                    </div>
                                    <span className={`flex-1 text-sm font-semibold ${currentTheme.text} truncate`}>
                                        {player.name}
                                        {isLeader && <span className="ml-1">&#128081;</span>}
                                    </span>
                                    <span className={`font-black text-sm ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                        {player.prevScore}
                                    </span>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );

    // Render Group Waiting Phase - shown when player's group is not active
    const renderGroupWaitingPhase = () => {
        if (!groupInfo || !waitingFor) return null;

        const allGroups = groupInfo.allGroups || [];
        const currentGroupIdx = groupInfo.currentGroupIndex;
        const totalGroups = groupInfo.totalGroups;

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-lg w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'} text-center`}>
                    {/* Header */}
                    <div className="mb-6">
                        <div className="text-5xl mb-4 animate-pulse">⏳</div>
                        <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                            {theme === 'tron' ? '> WAITING_FOR_GROUP' : 'Waiting for Group'}
                        </h2>
                        <div className={`text-lg font-bold ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>
                            Question {questionNumber} of {totalQuestions}
                        </div>
                    </div>

                    {/* Current active group */}
                    <div className={`p-4 rounded-xl mb-4 ${theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500' : theme === 'kids' ? 'bg-purple-200 border-2 border-purple-400' : 'bg-orange-700/30 border border-orange-600'}`}>
                        <div className={`text-sm ${currentTheme.textSecondary} mb-2`}>Currently answering:</div>
                        <div className={`text-xl font-black ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-700' : 'text-orange-400'}`}>
                            {waitingFor.label} Group
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {waitingFor.playerNames.map((name, idx) => {
                                const player = currentRoom?.players?.find(p => p.name === name);
                                const character = availableCharacters.find(c => c.id === player?.avatar) || availableCharacters[0];
                                return (
                                    <div key={idx} className={`flex items-center gap-1 px-2 py-1 rounded-full ${theme === 'tron' ? 'bg-cyan-500/20' : theme === 'kids' ? 'bg-purple-300' : 'bg-orange-700/40'}`}>
                                        <div className="w-4 h-4">
                                            <CharacterSVG characterId={player?.avatar} size={16} color={character.color} />
                                        </div>
                                        <span className={`text-xs font-semibold ${currentTheme.text}`}>{name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="mb-4">
                        <div className={`text-sm ${currentTheme.textSecondary} mb-2`}>Group Progress:</div>
                        <div className="flex justify-center gap-2 flex-wrap">
                            {allGroups.map((group, idx) => (
                                <div
                                    key={idx}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
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
                    </div>

                    {/* Your turn info */}
                    <div className={`text-sm ${currentTheme.textSecondary}`}>
                        Your turn is coming up soon!
                    </div>
                </div>
            </div>
        );
    };

    // Render Recap Phase - Show ALL difficulty groups simultaneously with cascading player reveals
    const renderRecapPhase = () => {
        const questionHistory = recapData?.questionHistory || [];
        const activeGroups = getActiveGroups();
        const animationComplete = recapQuestionIndex >= questionHistory.length - 1 && !showingQuestion;
        const displayStandings = animatedStandings.length > 0 ? animatedStandings : standings;

        return (
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-3 md:p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-3 text-center`}>
                    <h2 className={`text-xl md:text-2xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                        {recapData?.isLastRound
                            ? (theme === 'tron' ? '> GAME_COMPLETE' : 'Game Complete!')
                            : (theme === 'tron' ? `> ROUND_${currentRound}_COMPLETE` : `Round ${currentRound} Complete!`)
                        }
                    </h2>
                    {questionHistory.length > 0 && (
                        <div className={`text-sm ${currentTheme.textSecondary} mt-1`}>
                            {allQuestionsRevealed
                                ? `All ${questionHistory.length} Questions`
                                : `Question ${recapQuestionIndex + 1} of ${questionHistory.length}`
                            }
                        </div>
                    )}
                </div>

                {/* Two column layout for questions and standings */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Questions - Left side (2 cols) - Shows ALL groups vertically */}
                    <div className="lg:col-span-2">
                        <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 md:p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} min-h-[300px]`}>
                            <h3 className={`text-lg font-bold ${currentTheme.text} mb-4 ${currentTheme.font}`}>
                                {theme === 'tron' ? '> QUESTION_REVIEW' : 'Question Review'}
                            </h3>

                            {/* Vertical list of ALL groups */}
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {/* When all questions revealed, show everything from question history */}
                                {allQuestionsRevealed ? (
                                    questionHistory.map((q, qIdx) => {
                                        // Get groups for this question
                                        const groups = q.groupData && Array.isArray(q.groupData)
                                            ? q.groupData.filter(g => g && (g.question || g.correctAnswer))
                                            : (q.question ? [{ question: q.question, correctAnswer: q.correctAnswer, playerResults: q.playerResults || {}, difficultyLabel: null }] : []);

                                        return groups.map((groupData, gIdx) => (
                                            <div
                                                key={`${qIdx}-${gIdx}`}
                                                className={`transition-all duration-300 ${
                                                    theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/50' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-orange-900/20 border border-orange-700/50'
                                                } p-4 rounded-xl`}
                                            >
                                                {/* Question number and difficulty label */}
                                                <div className="flex items-start gap-2 mb-2">
                                                    <span className={`text-xs px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                                                        theme === 'tron' ? 'bg-gray-700 text-cyan-300' : theme === 'kids' ? 'bg-gray-300 text-gray-700' : 'bg-gray-700 text-orange-300'
                                                    }`}>
                                                        Q{qIdx + 1}
                                                    </span>
                                                    {groupData.difficultyLabel && (
                                                        <span className={`text-xs px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                                                            theme === 'tron' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : theme === 'kids' ? 'bg-purple-300 text-purple-800' : 'bg-orange-700/50 text-orange-300'
                                                        }`}>
                                                            {groupData.difficultyLabel}
                                                        </span>
                                                    )}
                                                    <div className={`text-2xl md:text-3xl font-black ${currentTheme.text} flex-1 text-center`}>
                                                        {groupData.question}
                                                    </div>
                                                </div>

                                                {/* Correct answer */}
                                                <div className="flex items-center justify-center gap-2 mb-3">
                                                    <span className="text-green-400 font-bold">✓</span>
                                                    <span className="text-green-400 text-xl font-black">{groupData.correctAnswer}</span>
                                                </div>

                                                {/* Player results */}
                                                <div className="flex flex-wrap gap-2 justify-center min-h-[28px]">
                                                    {Object.entries(groupData.playerResults || {}).map(([name, result]) => {
                                                        const player = currentRoom?.players.find(p => p.name === name);
                                                        const character = availableCharacters.find(c => c.id === player?.avatar) || availableCharacters[0];
                                                        const isCorrect = result?.isCorrect || false;
                                                        const pointsEarned = result?.pointsEarned || 0;

                                                        return (
                                                            <div
                                                                key={`${qIdx}-${gIdx}-${name}`}
                                                                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-sm ${
                                                                    isCorrect
                                                                        ? (theme === 'tron' ? 'bg-green-500/20 border border-green-500/50' : theme === 'kids' ? 'bg-green-200 border border-green-400' : 'bg-green-700/30 border border-green-600/50')
                                                                        : (theme === 'tron' ? 'bg-red-500/20 border border-red-500/50' : theme === 'kids' ? 'bg-red-200 border border-red-400' : 'bg-red-700/30 border border-red-600/50')
                                                                }`}
                                                            >
                                                                <div className="w-5 h-5">
                                                                    <CharacterSVG characterId={player?.avatar} size={20} color={character.color} />
                                                                </div>
                                                                <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                                                    {name}
                                                                </span>
                                                                {isCorrect ? (
                                                                    <>
                                                                        <span>🪙</span>
                                                                        {pointsEarned > 0 && (
                                                                            <span className="text-yellow-400 font-bold">
                                                                                +{pointsEarned}
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <span className="text-red-500 font-bold text-lg">✕</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ));
                                    })
                                ) : activeGroups.length > 0 ? activeGroups.map((groupData, groupIdx) => {
                                    // Get all players for this group
                                    const allPlayerResults = Object.entries(groupData.playerResults || {});

                                    return (
                                        <div
                                            key={groupIdx}
                                            className={`transition-all duration-300 ${
                                                theme === 'tron' ? 'bg-cyan-500/10 border border-cyan-500/50' : theme === 'kids' ? 'bg-purple-100 border-2 border-purple-300' : 'bg-orange-900/20 border border-orange-700/50'
                                            } p-4 rounded-xl`}
                                        >
                                            {/* Difficulty label and question */}
                                            <div className="flex items-start gap-2 mb-2">
                                                {groupData.difficultyLabel && (
                                                    <span className={`text-xs px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                                                        theme === 'tron' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : theme === 'kids' ? 'bg-purple-300 text-purple-800' : 'bg-orange-700/50 text-orange-300'
                                                    }`}>
                                                        {groupData.difficultyLabel}
                                                    </span>
                                                )}
                                                <div className={`text-2xl md:text-3xl font-black ${currentTheme.text} flex-1 text-center`}>
                                                    {groupData.question}
                                                </div>
                                            </div>

                                            {/* Correct answer */}
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <span className="text-green-400 font-bold">✓</span>
                                                <span className="text-green-400 text-xl font-black">{groupData.correctAnswer}</span>
                                            </div>

                                            {/* Player results with cascade animation */}
                                            <div className="flex flex-wrap gap-2 justify-center min-h-[28px]">
                                                {allPlayerResults.map(([name, result], pIdx) => {
                                                    const playerRevealed = revealedPlayers[name];
                                                    if (!playerRevealed?.revealed) return null;

                                                    const player = currentRoom?.players.find(p => p.name === name);
                                                    const character = availableCharacters.find(c => c.id === player?.avatar) || availableCharacters[0];
                                                    const isCorrect = result.isCorrect;
                                                    const pointsEarned = result.pointsEarned || 0;
                                                    const displayPoints = recapAnimPhase >= 2 ? (animatedPointValues[name] ?? pointsEarned) : 0;

                                                    return (
                                                        <div
                                                            key={`${groupIdx}-${name}`}
                                                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-sm animate-playerReveal ${
                                                                isCorrect
                                                                    ? (theme === 'tron' ? 'bg-green-500/20 border border-green-500/50' : theme === 'kids' ? 'bg-green-200 border border-green-400' : 'bg-green-700/30 border border-green-600/50')
                                                                    : (theme === 'tron' ? 'bg-red-500/20 border border-red-500/50' : theme === 'kids' ? 'bg-red-200 border border-red-400' : 'bg-red-700/30 border border-red-600/50')
                                                            }`}
                                                        >
                                                            <div className="w-5 h-5">
                                                                <CharacterSVG characterId={player?.avatar} size={20} color={character.color} />
                                                            </div>
                                                            <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                                                {name}
                                                            </span>
                                                            {isCorrect ? (
                                                                <>
                                                                    <span className="animate-coinPop">🪙</span>
                                                                    {recapAnimPhase >= 2 && pointsEarned > 0 && (
                                                                        <span className="text-yellow-400 font-bold">
                                                                            +{displayPoints}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-red-500 font-bold text-lg animate-wrongCross">✕</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }) : animationComplete ? (
                                    <div className={`text-center ${currentTheme.textSecondary} py-8`}>
                                        <div className="text-4xl mb-3">{recapData?.isLastRound ? '🏆' : '✅'}</div>
                                        <div className="text-lg font-semibold">
                                            {recapData?.isLastRound ? 'Game complete!' : 'All questions reviewed!'}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Live Standings - Right side (1 col) */}
                    <div className="lg:col-span-1">
                        <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 md:p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} h-full`}>
                            <h3 className={`text-lg font-bold ${currentTheme.text} mb-4 ${currentTheme.font}`}>
                                {theme === 'tron' ? '> GAME_STANDINGS' : 'Game Standings'}
                                {!animationComplete && <span className="ml-2 animate-pulse">📊</span>}
                            </h3>

                            <div className="space-y-2 relative">
                                {displayStandings.map((player, idx) => {
                                    const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                                    const isMe = player.name === playerName;
                                    const isLeader = idx === 0 && player.score > 0;
                                    const flyingPoint = flyingPoints.find(fp => fp.playerName === player.name);
                                    return (
                                        <div
                                            key={player.name}
                                            className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-500 ${isMe ? (theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500' : theme === 'kids' ? 'bg-purple-200 border-2 border-purple-400' : 'bg-orange-700/30 border border-orange-600') : (theme === 'tron' ? 'bg-gray-800/50' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/50')} relative overflow-visible`}
                                        >
                                            {/* Flying points indicator */}
                                            {flyingPoint && (
                                                <div
                                                    className={`absolute right-0 -top-3 px-2 py-0.5 rounded-full text-xs font-black shadow-lg z-10 ${
                                                        theme === 'tron' ? 'bg-green-500 text-black' : theme === 'kids' ? 'bg-green-400 text-white' : 'bg-green-600 text-white'
                                                    }`}
                                                    style={{
                                                        animation: 'bounce 0.5s ease-out'
                                                    }}
                                                >
                                                    +{flyingPoint.points}
                                                </div>
                                            )}

                                            {/* Rank */}
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm ${isLeader ? 'bg-yellow-500 text-black' : (theme === 'tron' ? 'bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-gray-300 text-purple-700' : 'bg-gray-700 text-orange-400')}`}>
                                                {idx + 1}
                                            </div>

                                            {/* Avatar */}
                                            <div className="w-8 h-8">
                                                <CharacterSVG characterId={player.avatar} size={32} color={character.color} />
                                            </div>

                                            {/* Name */}
                                            <div className="flex-1 min-w-0">
                                                <div className={`font-bold text-sm ${currentTheme.text} truncate`}>
                                                    {player.name}
                                                    {isLeader && <span className="ml-1">👑</span>}
                                                </div>
                                            </div>

                                            {/* Score */}
                                            <div className={`font-black text-lg ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'} transition-all duration-300 ${flyingPoint ? 'scale-110' : ''}`}>
                                                {player.score}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action buttons */}
                            <div className="mt-4 space-y-2">
                                {/* Master controls */}
                                {isMaster && (
                                    <>
                                        {/* Reveal All Questions button - show if not all revealed yet */}
                                        {!allQuestionsRevealed && !animationComplete && (
                                            <button
                                                onClick={handleRevealAllQuestions}
                                                className={`w-full ${theme === 'tron' ? 'bg-purple-500 hover:bg-purple-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-purple-700 hover:bg-purple-600 text-white'} font-bold py-2 rounded-xl transition-all text-sm`}
                                            >
                                                {theme === 'tron' ? '[ REVEAL_ALL ]' : 'Reveal All Questions'}
                                            </button>
                                        )}

                                        {/* Go to Next Round / View Final Results button - show when animation complete or all revealed */}
                                        {(animationComplete || allQuestionsRevealed) && (
                                            <button
                                                onClick={handleNextRound}
                                                className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all text-lg`}
                                            >
                                                {recapData?.isLastRound
                                                    ? (theme === 'tron' ? '[ VIEW_RESULTS ]' : 'View Final Results')
                                                    : (theme === 'tron' ? '[ NEXT_ROUND ]' : 'Go to Next Round')
                                                }
                                            </button>
                                        )}
                                    </>
                                )}

                                {/* Non-master status messages */}
                                {!isMaster && !animationComplete && !allQuestionsRevealed && (
                                    <div className={`text-center ${currentTheme.textSecondary} text-sm`}>
                                        Reviewing questions...
                                    </div>
                                )}

                                {!isMaster && (animationComplete || allQuestionsRevealed) && (
                                    <div className={`text-center ${currentTheme.textSecondary} text-sm`}>
                                        Waiting for game master to continue...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render Speed Round Phase
    const renderSpeedRoundPhase = () => {
        if (speedRoundWaiting) {
            return (
                <div className="max-w-4xl mx-auto text-center">
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 md:p-8 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                        <div className="text-5xl mb-4">&#127937;</div>
                        <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} mb-4 ${currentTheme.font}`}>
                            {theme === 'tron' ? '> ALL_QUESTIONS_DONE' : 'All Questions Done!'}
                        </h2>
                        <div className={`text-lg ${currentTheme.textSecondary} mb-4`}>
                            Waiting for time to run out...
                        </div>
                        <div className={`text-4xl font-black ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>
                            {speedRoundTimer}s
                        </div>
                        <div className={`mt-4 ${currentTheme.text}`}>
                            <span className="text-green-400 font-bold">{speedRoundStats.correct}</span> correct
                            <span className="text-yellow-400 font-bold ml-4">{speedRoundStats.points}</span> pts
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-lg p-2 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'} mb-3`}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className={`${theme === 'tron' ? 'bg-red-500/20 border border-red-500/30 text-red-400' : theme === 'kids' ? 'bg-red-500 text-white' : 'bg-red-700/40 text-red-400 border border-red-700'} px-3 py-1 rounded-lg`}>
                            <span className="text-sm font-bold">&#9889; SPEED ROUND</span>
                        </div>

                        {speedRoundDifficulty && (
                            <div className={`${theme === 'tron' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' : theme === 'kids' ? 'bg-yellow-400 text-yellow-900' : 'bg-yellow-700/40 text-yellow-400 border border-yellow-700'} px-3 py-1 rounded-lg`}>
                                <span className="text-sm font-bold">{speedRoundDifficulty}</span>
                            </div>
                        )}

                        <div className={`${theme === 'tron' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400' : theme === 'kids' ? 'bg-pink-500 text-white' : 'bg-purple-700/40 text-purple-400 border border-purple-700'} px-3 py-1 rounded-lg`}>
                            <span className="text-sm font-bold">Q{questionNumber}</span>
                        </div>

                        <div className={`${speedRoundTimer <= 10 ? 'bg-red-500/30 border border-red-500 text-red-400 animate-pulse' : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'} px-3 py-1 rounded-lg flex items-center gap-1`}>
                            <span className="text-sm font-bold">&#9202;</span>
                            <span className="text-base font-black">{speedRoundTimer}s</span>
                        </div>

                        <div className={`${theme === 'tron' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : theme === 'kids' ? 'bg-green-500 text-white' : 'bg-green-700/40 text-green-400 border border-green-700'} px-3 py-1 rounded-lg`}>
                            <span className="text-sm font-bold">&#10003; {speedRoundStats.correct} - {speedRoundStats.points}pts</span>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 md:p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4`}>
                    <div className="text-center mb-3">
                        <span className={`inline-block ${theme === 'tron' ? 'bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 text-purple-700' : 'bg-orange-900/30 text-orange-400'} px-3 py-1 rounded-full text-sm font-semibold`}>
                            {MATH_CATEGORY_ICONS[category] || '+'} {category}
                        </span>
                    </div>

                    <h2 className={`text-4xl md:text-6xl font-black ${currentTheme.text} text-center mb-6 ${currentTheme.font}`}>
                        {currentQuestion}
                    </h2>

                    {/* Answer Grid - 4 options */}
                    <div className="grid grid-cols-2 gap-3">
                        {speedRoundAnswers.map((answer, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrectSelected = speedRoundFeedback === 'correct' && isSelected;
                            const isCorrectAnswer = speedRoundFeedback === 'wrong' && speedRoundCorrectAnswer?.index === index;
                            const isWrongSelected = speedRoundFeedback === 'wrong' && isSelected && !isCorrectAnswer;

                            let buttonStyle;
                            if (isCorrectSelected || isCorrectAnswer) {
                                buttonStyle = theme === 'tron'
                                    ? 'bg-green-500/40 border-2 border-green-400 text-green-300 ring-2 ring-green-400'
                                    : theme === 'kids'
                                    ? 'bg-green-400 border-2 border-green-500 text-white ring-2 ring-green-300'
                                    : 'bg-green-700/50 border-2 border-green-500 text-green-300 ring-2 ring-green-400';
                            } else if (isWrongSelected) {
                                buttonStyle = theme === 'tron'
                                    ? 'bg-red-500/30 border-2 border-red-500 text-red-400'
                                    : theme === 'kids'
                                    ? 'bg-red-400 border-2 border-red-500 text-white'
                                    : 'bg-red-700/40 border-2 border-red-500 text-red-400';
                            } else if (speedRoundFeedback) {
                                buttonStyle = theme === 'tron'
                                    ? 'bg-gray-800/50 border border-gray-700 text-gray-500'
                                    : theme === 'kids'
                                    ? 'bg-gray-200 border-2 border-gray-300 text-gray-500'
                                    : 'bg-gray-800/50 border border-gray-700 text-gray-500';
                            } else {
                                buttonStyle = theme === 'tron'
                                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 cursor-pointer'
                                    : theme === 'kids'
                                    ? 'bg-purple-100 border-2 border-purple-300 text-purple-900 hover:bg-purple-200 hover:border-purple-400 cursor-pointer'
                                    : 'bg-orange-900/20 border border-orange-700/50 text-orange-400 hover:bg-orange-900/30 hover:border-orange-600 cursor-pointer';
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => submitSpeedRoundAnswer(index)}
                                    disabled={!!speedRoundFeedback}
                                    className={`${buttonStyle} rounded-xl p-6 text-center transition-all font-black text-3xl md:text-4xl`}
                                >
                                    {answer}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Render Speed Recap Phase
    const renderSpeedRecapPhase = () => {
        if (!raceData) return null;

        const maxCorrect = raceData.maxCorrect || 1;
        const winner = raceData.winner;

        // Race phase
        if (speedRecapPhase === 'race') {
            const sortedPlayers = [...raceData.raceData].sort((a, b) => {
                const aSteps = Math.min(raceStep, a.correctCount);
                const bSteps = Math.min(raceStep, b.correctCount);
                return aSteps - bSteps;
            });

            return (
                <div className="max-w-6xl mx-auto">
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-3 md:p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4 text-center`}>
                        <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                            {theme === 'tron' ? '> SPEED_ROUND_RACE' : '&#9889; Speed Round Race!'}
                        </h2>
                    </div>

                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 md:p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} relative overflow-hidden`}>
                        {/* Countdown overlay */}
                        {raceCountdown !== null && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30 rounded-2xl">
                                <div className="text-center">
                                    <div className={`text-8xl font-black ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-500' : 'text-orange-500'} animate-pulse`}>
                                        {raceCountdown === 0 ? 'GO!' : raceCountdown}
                                    </div>
                                    {raceCountdown > 0 && (
                                        <div className={`text-2xl font-bold ${currentTheme.text} mt-4`}>
                                            {raceCountdown === 3 ? 'Ready...' : raceCountdown === 2 ? 'Set...' : 'Set...'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Race Track */}
                        <div className={`relative h-48 md:h-64 rounded-xl ${theme === 'tron' ? 'bg-gray-900 border-2 border-cyan-500/50' : theme === 'kids' ? 'bg-green-200 border-4 border-green-400' : 'bg-gray-900 border-2 border-orange-700/50'}`}>
                            {/* Track markings */}
                            <div className="absolute inset-0 flex">
                                {[...Array(10)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 ${i % 2 === 0 ? (theme === 'tron' ? 'bg-gray-800/50' : theme === 'kids' ? 'bg-green-300/50' : 'bg-gray-800/50') : ''} border-r ${theme === 'tron' ? 'border-cyan-500/20' : theme === 'kids' ? 'border-green-400/30' : 'border-orange-700/20'}`}
                                    />
                                ))}
                            </div>

                            {/* Finish line */}
                            <div className={`absolute right-4 top-0 bottom-0 w-1 ${theme === 'tron' ? 'bg-cyan-400' : theme === 'kids' ? 'bg-purple-500' : 'bg-orange-500'}`}>
                                <div className="absolute -top-1 -right-3 text-2xl">&#127937;</div>
                            </div>

                            {/* Race Complete Overlay */}
                            {raceComplete && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-xl">
                                    <div className="text-center">
                                        <div className="text-5xl mb-2">&#127942;</div>
                                        <div className={`text-2xl font-black ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-500' : 'text-orange-400'} mb-1`}>
                                            {winner?.name === playerName ? 'You won the race!' : `${winner?.name} wins the race!`}
                                        </div>
                                        <div className={`text-lg font-bold ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                            +{winner?.totalPoints || 0} speed points
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Player avatars on track */}
                            {sortedPlayers.map((playerData, idx) => {
                                const character = availableCharacters.find(c => c.id === playerData.avatar) || availableCharacters[0];
                                const isMe = playerData.name === playerName;
                                const currentSteps = Math.min(raceStep, playerData.correctCount);
                                const progressPercent = maxCorrect > 0 ? (currentSteps / maxCorrect) * 96 : 0;
                                const originalIdx = raceData.raceData.findIndex(p => p.name === playerData.name);
                                const verticalPos = 15 + (originalIdx * (70 / Math.max(raceData.raceData.length - 1, 1)));

                                return (
                                    <div
                                        key={playerData.name}
                                        className="absolute transition-all duration-300 ease-out"
                                        style={{
                                            left: `calc(${progressPercent}% + 10px)`,
                                            top: `${raceData.raceData.length === 1 ? 50 : verticalPos}%`,
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: idx + 10
                                        }}
                                    >
                                        <div className="relative">
                                            {/* Points badge above avatar */}
                                            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-2 py-0.5 rounded ${
                                                theme === 'tron' ? 'bg-yellow-500/90 text-black' : theme === 'kids' ? 'bg-yellow-400 text-black' : 'bg-yellow-500 text-black'
                                            }`}>
                                                {currentSteps * 200}
                                            </div>

                                            <div
                                                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center ${
                                                    isMe
                                                        ? 'ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50'
                                                        : theme === 'tron' ? 'ring-2 ring-cyan-500/50' : theme === 'kids' ? 'ring-2 ring-purple-400/50' : 'ring-2 ring-orange-600/50'
                                                } ${theme === 'tron' ? 'bg-gray-800' : theme === 'kids' ? 'bg-white' : 'bg-gray-800'}`}
                                            >
                                                <CharacterSVG characterId={playerData.avatar} size={40} color={character.color} />
                                            </div>

                                            <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-2 py-0.5 rounded ${
                                                isMe
                                                    ? 'bg-yellow-500 text-black'
                                                    : theme === 'tron' ? 'bg-cyan-500/80 text-black' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-600 text-white'
                                            }`}>
                                                {playerData.name}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Player stats below track - only show when race is complete */}
                        {raceComplete && (
                            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                                {raceData.raceData.map((playerData) => {
                                    const character = availableCharacters.find(c => c.id === playerData.avatar) || availableCharacters[0];
                                    const isMe = playerData.name === playerName;
                                    const currentSteps = Math.min(raceStep, playerData.correctCount);
                                    const currentPoints = playerData.steps.slice(0, currentSteps).reduce((a, b) => a + b, 0);

                                    return (
                                        <div
                                            key={playerData.name}
                                            className={`p-3 rounded-xl ${
                                                isMe
                                                ? (theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500' : theme === 'kids' ? 'bg-purple-200 border-2 border-purple-400' : 'bg-orange-700/30 border border-orange-600')
                                                : (theme === 'tron' ? 'bg-gray-800/50' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/50')
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-6 h-6">
                                                    <CharacterSVG characterId={playerData.avatar} size={24} color={character.color} />
                                                </div>
                                                <span className={`font-bold text-sm ${currentTheme.text} truncate`}>{playerData.name}</span>
                                            </div>
                                            <div className={`text-xl font-black ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                                {currentPoints} pts
                                            </div>
                                            <div className={`text-xs ${currentTheme.textSecondary}`}>
                                                {currentSteps} correct - {playerData.wrongCount} wrong
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Winner celebration phase
        if (speedRecapPhase === 'winner') {
            return (
                <div className="max-w-4xl mx-auto text-center">
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-8 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                        <div className="text-6xl mb-4 animate-bounce">&#127942;</div>
                        <h2 className={`text-3xl md:text-4xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                            {winner?.name === playerName ? 'You Won!' : `${winner?.name} Wins!`}
                        </h2>
                        <div className={`text-2xl font-bold ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                            +{winner?.totalPoints || 0} Speed Points
                        </div>
                    </div>
                </div>
            );
        }

        // Leaderboard / animating / final phases
        const displayStandings = Object.keys(animatedFinalScores).length > 0
            ? [...preSpeedStandings].map(p => ({ ...p, score: animatedFinalScores[p.name] || p.score })).sort((a, b) => b.score - a.score)
            : preSpeedStandings;

        // Get the winner (first place after sorting)
        const gameWinner = displayStandings.length > 0 ? displayStandings[0] : null;

        return (
            <div className="max-w-4xl mx-auto">
                {/* Winner Celebration - shows after final standings are displayed */}
                {showWinnerCelebration && gameWinner && (
                    <WinnerCelebration
                        winner={gameWinner}
                        playerName={playerName}
                        gameName="Quick Math"
                        theme={theme}
                        currentTheme={currentTheme}
                        availableCharacters={availableCharacters}
                        onDismiss={() => {
                            setShowWinnerCelebration(false);
                            // Notify server that celebration is complete
                            if (currentRoom?.id) {
                                socket.emit('mathCelebrationComplete', { roomId: currentRoom.id });
                            }
                        }}
                        autoDismissSeconds={5}
                    />
                )}

                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4 text-center`}>
                    <h2 className={`text-2xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                        {speedRecapPhase === 'final' ? 'Final Standings' : 'Adding Speed Points...'}
                    </h2>
                </div>

                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                    <div className="space-y-2">
                        {displayStandings.map((player, idx) => {
                            const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                            const isMe = player.name === playerName;
                            const isLeader = idx === 0;
                            const speedPoints = raceData.raceData.find(r => r.name === player.name)?.totalPoints || 0;

                            return (
                                <div
                                    key={player.name}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isMe ? (theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500' : theme === 'kids' ? 'bg-purple-200 border-2 border-purple-400' : 'bg-orange-700/30 border border-orange-600') : (theme === 'tron' ? 'bg-gray-800/50' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/50')}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isLeader ? 'bg-yellow-500 text-black' : (theme === 'tron' ? 'bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-gray-300 text-purple-700' : 'bg-gray-700 text-orange-400')}`}>
                                        {idx + 1}
                                    </div>

                                    <div className="w-10 h-10">
                                        <CharacterSVG characterId={player.avatar} size={40} color={character.color} />
                                    </div>

                                    <div className="flex-1">
                                        <div className={`font-bold ${currentTheme.text}`}>{player.name}</div>
                                        {speedRecapPhase !== 'leaderboard' && speedPoints > 0 && (
                                            <div className="text-green-400 text-sm font-semibold">+{speedPoints} speed</div>
                                        )}
                                    </div>

                                    <div className={`font-black text-xl ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                        {player.score}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Main render
    return (
        <div className={`min-h-screen ${currentTheme.bg} p-2 pt-20 md:pt-24`}>
            {phase === 'rules' && renderRulesPhase()}
            {phase === 'question' && renderQuestionPhase()}
            {phase === 'groupWaiting' && renderGroupWaitingPhase()}
            {phase === 'reveal' && renderRevealPhase()}
            {phase === 'recap' && renderRecapPhase()}
            {phase === 'speedRound' && renderSpeedRoundPhase()}
            {phase === 'speedRecap' && renderSpeedRecapPhase()}

            {/* Fixed Game Master Controls - visible during all phases */}
            {isMaster && (
                <div className="fixed bottom-4 left-4 z-40">
                    <GameMasterControls
                        theme={theme}
                        currentTheme={currentTheme}
                        currentRoom={currentRoom}
                        isMaster={isMaster}
                        playerName={playerName}
                        availableCharacters={availableCharacters}
                    />
                </div>
            )}
        </div>
    );
};

export default QuickMathGame;
