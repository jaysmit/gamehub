import React, { useState, useEffect, useRef } from 'react';
import { CharacterSVG } from '../icons/CharacterSVGs';
import { socket } from '../socket';
import { CATEGORY_ICONS } from '../data/triviaQuestions';
import GameMasterControls from '../components/GameMasterControls';
import WinnerCelebration from '../components/WinnerCelebration';

const TriviaGame = ({ theme, currentTheme, playerName, selectedAvatar, availableCharacters, currentRoom, isMuted, isMaster }) => {
    // Game state
    const [phase, setPhase] = useState('rules');  // rules, question, reveal, recap, finalRecap
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [category, setCategory] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [timer, setTimer] = useState(10);
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
    const [showDevSkipModal, setShowDevSkipModal] = useState(false);
    const [showWinnerCelebration, setShowWinnerCelebration] = useState(false);

    // Animated recap state
    const [recapQuestionIndex, setRecapQuestionIndex] = useState(-1);  // -1 = not started, 0+ = showing that question
    const [animatedStandings, setAnimatedStandings] = useState([]);    // Standings updated after each question reveal
    const [showingQuestion, setShowingQuestion] = useState(true);      // Toggle for question visibility in animation
    const [nextRoundCountdown, setNextRoundCountdown] = useState(null); // Countdown before auto-advancing
    const [recapAnimPhase, setRecapAnimPhase] = useState(0);          // 0=questions visible, 1=reveal players cascade, 2=points animation
    const [animatedPointValues, setAnimatedPointValues] = useState({}); // {playerName: currentAnimatedValue}
    const [speedRoundTimer, setSpeedRoundTimer] = useState(60);        // Speed round 60s timer
    const [flyingPoints, setFlyingPoints] = useState([]);              // Points flying to leaderboard animation
    const [revealedPlayers, setRevealedPlayers] = useState({});       // { playerName: { revealed: true, correct: boolean } }
    const speedRoundEndTimeRef = useRef(null);                         // Absolute end time for speed round

    // Speed round individual play state
    const [speedRoundFeedback, setSpeedRoundFeedback] = useState(null);  // 'correct' | 'wrong' | null
    const [speedRoundCorrectAnswer, setSpeedRoundCorrectAnswer] = useState(null);  // For showing correct on wrong
    const [speedRoundStats, setSpeedRoundStats] = useState({ answered: 0, correct: 0, points: 0 });
    const [speedRoundWaiting, setSpeedRoundWaiting] = useState(false);  // True when finished all questions
    const [speedRoundDifficulty, setSpeedRoundDifficulty] = useState(null);  // Player's difficulty for speed round

    // Speed round race recap state
    const [raceData, setRaceData] = useState(null);
    const [raceStep, setRaceStep] = useState(0);  // Current step in race animation
    const [raceStarted, setRaceStarted] = useState(false);
    const [raceComplete, setRaceComplete] = useState(false);
    const [raceCountdown, setRaceCountdown] = useState(null);  // "Ready, Set, Go!" countdown
    const [speedRecapPhase, setSpeedRecapPhase] = useState('race');  // 'race' | 'winner' | 'leaderboard' | 'final'
    const [preSpeedStandings, setPreSpeedStandings] = useState([]);  // Standings before speed round
    const [animatedFinalScores, setAnimatedFinalScores] = useState({});  // For score animation

    // Ready button state for rules phase
    const [readyPlayers, setReadyPlayers] = useState([]);
    const [isReady, setIsReady] = useState(false);

    // Previous round scores (frozen scores shown during question phase)
    const [previousRoundScores, setPreviousRoundScores] = useState({});  // {playerName: score}

    // Difficulty group turn state
    const [isActiveGroup, setIsActiveGroup] = useState(true);  // Whether player is in currently active group
    const [groupInfo, setGroupInfo] = useState(null);  // Current group turn info
    const [waitingFor, setWaitingFor] = useState(null);  // Group we're waiting for

    // Refs for timer sync
    const roomIdRef = useRef(currentRoom?.id);
    const questionEndTimeRef = useRef(null);
    const rulesEndTimeRef = useRef(null);
    const standingsRef = useRef([]);  // Track current standings for speed recap
    const previousRoundScoresRef = useRef({});  // Track pre-speed round scores

    // Keep roomIdRef in sync
    useEffect(() => { roomIdRef.current = currentRoom?.id; }, [currentRoom?.id]);

    // Keep standingsRef in sync with standings state
    useEffect(() => { standingsRef.current = standings; }, [standings]);

    // Keep previousRoundScoresRef in sync
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
        const onTriviaRulesStart = (data) => {
            setPhase('rules');
            setCurrentRound(data.round);
            setTotalRounds(data.totalRounds);
            setIsSpeedRound(data.isSpeedRound);
            setTotalQuestions(data.questionsInRound);
            rulesEndTimeRef.current = data.rulesEndTime;

            // Reset question state for new round
            setCurrentQuestion(null);
            setAnswers([]);
            setSelectedAnswer(null);
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

        const onTriviaQuestion = (data) => {
            setPhase('question');
            setCurrentQuestion(data.question);
            setAnswers(data.answers);
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

            // Update speed round end time if provided
            if (data.speedRoundEndTime) {
                speedRoundEndTimeRef.current = data.speedRoundEndTime;
            }

            // Reset answer state
            setSelectedAnswer(null);
            setHasAnswered(false);
            setAnsweredPlayers([]);
            setRevealData(null);
        };

        const onTriviaAnswerReceived = (data) => {
            setAnsweredPlayers(prev => {
                if (prev.includes(data.playerName)) return prev;
                return [...prev, data.playerName];
            });
        };

        const onTriviaReveal = (data) => {
            setPhase('reveal');
            setRevealData(data);
        };

        const onTriviaRecap = (data) => {
            setRecapQuestionIndex(-1);  // Reset animation
            setAnimatedStandings([]);
            setShowingQuestion(true);
            setNextRoundCountdown(null);
            setPhase('recap');
            setRecapData(data);
            setStandings(data.standings);
            speedRoundEndTimeRef.current = null;
            // NOTE: previousRoundScores is saved AFTER recap animation completes, not here
            // This ensures recap animation starts from previous round's final scores
        };

        const onTriviaFinalResults = (data) => {
            setPhase('finalRecap');
            setFinalData(data);
            setStandings(data.finalStandings);
            // Show winner celebration immediately
            setShowWinnerCelebration(true);
        };

        // Speed round event handlers
        const onSpeedRoundQuestion = (data) => {
            setPhase('speedRound');
            setCurrentQuestion(data.question);
            setAnswers(data.answers);
            setCategory(data.category);
            setQuestionNumber(data.questionNumber);
            speedRoundEndTimeRef.current = data.speedRoundEndTime;
            setSpeedRoundFeedback(null);
            setSpeedRoundCorrectAnswer(null);
            setSelectedAnswer(null);
            setHasAnswered(false);
            setSpeedRoundWaiting(false);
            // Store player's difficulty for speed round header display
            if (data.difficultyLabel) {
                setSpeedRoundDifficulty(data.difficultyLabel);
            }
        };

        const onSpeedRoundCorrect = (data) => {
            setSpeedRoundFeedback('correct');
            setSpeedRoundStats({
                answered: data.questionsAnswered,
                correct: data.questionsAnswered,  // All answered so far were correct for this count
                points: data.totalPoints
            });
            // Show green for 1 second before next question arrives
            setTimeout(() => setSpeedRoundFeedback(null), 1000);
        };

        const onSpeedRoundWrong = (data) => {
            setSpeedRoundFeedback('wrong');
            setSpeedRoundCorrectAnswer({ index: data.correctIndex, answer: data.correctAnswer });
            setSpeedRoundStats(prev => ({
                ...prev,
                answered: data.questionsAnswered
            }));
            // Feedback will clear when next question arrives
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
            console.log('[SPEED_RECAP] Received speedRoundRecap event', data);
            console.log('[SPEED_RECAP] Previous round scores (pre-speed):', previousRoundScoresRef.current);
            setPhase('speedRecap');
            setRaceData(data);
            setRaceStep(0);
            setRaceStarted(false);
            setRaceComplete(false);
            setRaceCountdown(3);  // Start with "3" for countdown
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

        const onTriviaPlayerReady = (data) => {
            setReadyPlayers(data.readyPlayers || []);
        };

        const onTriviaSync = (data) => {
            if (data.gameType !== 'trivia') return;

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
                setAnswers(data.answers);
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
        };

        const onScoresUpdated = (data) => {
            // Update standings from scores
            const updated = data.players
                .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
                .sort((a, b) => b.score - a.score);
            setStandings(updated);
        };

        const onTriviaGroupWaiting = (data) => {
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
            setSelectedAnswer(null);
            setHasAnswered(false);
        };

        const onGameEnded = () => {
            // Game ended, cleanup
            setPhase('rules');
            setCurrentQuestion(null);
            setAnswers([]);
            setSelectedAnswer(null);
            setHasAnswered(false);
            setAnsweredPlayers([]);
            setRevealData(null);
            setRecapData(null);
            setFinalData(null);
            setGroupInfo(null);
            setIsActiveGroup(true);
            setWaitingFor(null);
        };

        socket.on('triviaRulesStart', onTriviaRulesStart);
        socket.on('triviaQuestion', onTriviaQuestion);
        socket.on('triviaGroupWaiting', onTriviaGroupWaiting);
        socket.on('triviaAnswerReceived', onTriviaAnswerReceived);
        socket.on('triviaReveal', onTriviaReveal);
        socket.on('triviaRecap', onTriviaRecap);
        socket.on('triviaFinalResults', onTriviaFinalResults);
        socket.on('triviaSync', onTriviaSync);
        socket.on('scoresUpdated', onScoresUpdated);
        socket.on('gameEnded', onGameEnded);
        socket.on('speedRoundQuestion', onSpeedRoundQuestion);
        socket.on('speedRoundCorrect', onSpeedRoundCorrect);
        socket.on('speedRoundWrong', onSpeedRoundWrong);
        socket.on('speedRoundWaiting', onSpeedRoundWaiting);
        socket.on('speedRoundRecap', onSpeedRoundRecap);
        socket.on('triviaPlayerReady', onTriviaPlayerReady);

        return () => {
            socket.off('triviaRulesStart', onTriviaRulesStart);
            socket.off('triviaQuestion', onTriviaQuestion);
            socket.off('triviaGroupWaiting', onTriviaGroupWaiting);
            socket.off('triviaAnswerReceived', onTriviaAnswerReceived);
            socket.off('triviaReveal', onTriviaReveal);
            socket.off('triviaRecap', onTriviaRecap);
            socket.off('triviaFinalResults', onTriviaFinalResults);
            socket.off('triviaSync', onTriviaSync);
            socket.off('scoresUpdated', onScoresUpdated);
            socket.off('gameEnded', onGameEnded);
            socket.off('speedRoundQuestion', onSpeedRoundQuestion);
            socket.off('speedRoundCorrect', onSpeedRoundCorrect);
            socket.off('speedRoundWrong', onSpeedRoundWrong);
            socket.off('speedRoundWaiting', onSpeedRoundWaiting);
            socket.off('speedRoundRecap', onSpeedRoundRecap);
            socket.off('triviaPlayerReady', onTriviaPlayerReady);
        };
    }, []);

    // Rules timer countdown
    useEffect(() => {
        if (phase !== 'rules') return;

        const tick = () => {
            const endTime = rulesEndTimeRef.current;
            if (!endTime) return;
            const remaining = Math.ceil((endTime - Date.now()) / 1000);
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
            const remaining = Math.ceil((endTime - Date.now()) / 1000);
            setTimer(Math.max(0, remaining));
        };

        tick();
        const interval = setInterval(tick, 250);
        return () => clearInterval(interval);
    }, [phase]);

    // Speed round 60s timer countdown
    useEffect(() => {
        if (!isSpeedRound || phase === 'recap' || phase === 'finalRecap') return;

        const tick = () => {
            const endTime = speedRoundEndTimeRef.current;
            if (!endTime) return;
            const remaining = Math.ceil((endTime - Date.now()) / 1000);
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

                            // Advance to next round
                            setShowingQuestion(false);
                            if (currentRoom?.id) {
                                socket.emit('triviaNextRound', { roomId: currentRoom.id });
                            }
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
                    // After speed recap, end game and return to room directly
                    socket.emit('triviaEndAfterSpeed', { roomId: currentRoom.id });
                } else {
                    // Normal recap: advance to next round
                    socket.emit('triviaNextRound', { roomId: currentRoom.id });
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
            // Start the race!
            setRaceStarted(true);
            setRaceCountdown(null);
            return;
        }

        const timer = setTimeout(() => {
            setRaceCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [phase, raceCountdown]);

    // Speed round race animation - step through each correct answer
    useEffect(() => {
        if (phase !== 'speedRecap' || !raceStarted || !raceData || raceComplete) return;

        const maxSteps = raceData.maxCorrect;
        if (raceStep >= maxSteps) {
            // Race complete - mark it and let the next effect handle the transition
            setRaceComplete(true);
            return;
        }

        const stepTimer = setTimeout(() => {
            setRaceStep(prev => prev + 1);
        }, raceData.stepDuration);

        return () => clearTimeout(stepTimer);
    }, [phase, raceStarted, raceData, raceStep, raceComplete]);

    // Handle race completion - pause at finish line then transition to winner
    useEffect(() => {
        if (phase !== 'speedRecap' || !raceComplete || speedRecapPhase !== 'race') return;

        // Pause for 3 seconds at finish line before showing speed round results
        const pauseTimer = setTimeout(() => {
            setSpeedRecapPhase('winner');
        }, 3000);

        return () => clearTimeout(pauseTimer);
    }, [phase, raceComplete, speedRecapPhase]);

    // Speed recap phase transitions
    useEffect(() => {
        if (phase !== 'speedRecap' || !raceComplete || !raceData) return;

        if (speedRecapPhase === 'winner') {
            // Show winner celebration for 4 seconds, then move to leaderboard
            const timer = setTimeout(() => {
                setSpeedRecapPhase('leaderboard');
                // Initialize animated scores to pre-speed values
                const initialScores = {};
                preSpeedStandings.forEach(p => {
                    initialScores[p.name] = p.score;
                });
                setAnimatedFinalScores(initialScores);
            }, 4000);
            return () => clearTimeout(timer);
        }

        if (speedRecapPhase === 'leaderboard') {
            // After 2.5 seconds, start animating scores
            const timer = setTimeout(() => {
                setSpeedRecapPhase('animating');
            }, 2500);
            return () => clearTimeout(timer);
        }

        if (speedRecapPhase === 'animating') {
            // Animate scores over 2 seconds
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
                    // Move to final phase
                    setTimeout(() => {
                        setSpeedRecapPhase('final');
                    }, 500);
                }
            }, stepDuration);

            return () => clearInterval(interval);
        }

        if (speedRecapPhase === 'final') {
            // Show final standings for 5 seconds, then start countdown
            const timer = setTimeout(() => {
                setNextRoundCountdown(5);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [phase, raceComplete, speedRecapPhase, raceData, preSpeedStandings]);

    // Dev mode: Backtick key to skip to speed round
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '`' && currentRound < 4 && !isSpeedRound) {
                setShowDevSkipModal(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentRound, isSpeedRound]);

    // Submit answer handler (for normal trivia questions)
    const submitAnswer = (answerIndex) => {
        if (hasAnswered || phase !== 'question') return;

        setSelectedAnswer(answerIndex);
        setHasAnswered(true);

        if (currentRoom?.id) {
            socket.emit('triviaAnswer', { roomId: currentRoom.id, answerIndex });
        }
    };

    // Submit answer handler for speed round (no hasAnswered blocking, different phase)
    const submitSpeedRoundAnswer = (answerIndex) => {
        if (speedRoundFeedback || phase !== 'speedRound') return;

        setSelectedAnswer(answerIndex);

        if (currentRoom?.id) {
            socket.emit('triviaAnswer', { roomId: currentRoom.id, answerIndex });
        }
    };

    // Handle player clicking ready button
    const handleReady = () => {
        if (isReady || phase !== 'rules') return;

        setIsReady(true);
        if (currentRoom?.id) {
            socket.emit('triviaReady', { roomId: currentRoom.id });
        }
    };

    // Master advances to next round
    const handleNextRound = () => {
        if (!isMaster || phase !== 'recap') return;

        if (currentRoom?.id) {
            socket.emit('triviaNextRound', { roomId: currentRoom.id });
        }
    };

    // End game early (master only)
    const handleEndGame = () => {
        if (!isMaster) return;

        if (currentRoom?.id) {
            socket.emit('endGameEarly', { roomId: currentRoom.id });
        }
        setShowEndGameConfirm(false);
    };

    // Dev: Skip to speed round
    const handleDevSkipToSpeedRound = () => {
        if (currentRoom?.id) {
            socket.emit('devSkipToSpeedRound', { roomId: currentRoom.id });
        }
        setShowDevSkipModal(false);
    };

    // Get answer button style based on state
    const getAnswerButtonStyle = (index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = revealData?.correctIndex === index;
        const wasMyAnswer = revealData && selectedAnswer === index;
        const gotItRight = wasMyAnswer && isCorrect;
        const gotItWrong = wasMyAnswer && !isCorrect;

        if (phase === 'reveal') {
            if (isCorrect) {
                return theme === 'tron'
                    ? 'bg-green-500/40 border-2 border-green-400 text-green-300 ring-2 ring-green-400'
                    : theme === 'kids'
                    ? 'bg-green-400 border-2 border-green-500 text-white ring-2 ring-green-300'
                    : 'bg-green-700/50 border-2 border-green-500 text-green-300 ring-2 ring-green-400';
            }
            if (gotItWrong) {
                return theme === 'tron'
                    ? 'bg-red-500/30 border-2 border-red-500 text-red-400'
                    : theme === 'kids'
                    ? 'bg-red-400 border-2 border-red-500 text-white'
                    : 'bg-red-700/40 border-2 border-red-500 text-red-400';
            }
            return theme === 'tron'
                ? 'bg-gray-800/50 border border-gray-700 text-gray-500'
                : theme === 'kids'
                ? 'bg-gray-200 border-2 border-gray-300 text-gray-500'
                : 'bg-gray-800/50 border border-gray-700 text-gray-500';
        }

        if (isSelected) {
            return theme === 'tron'
                ? 'bg-cyan-500/40 border-2 border-cyan-400 text-cyan-300 ring-2 ring-cyan-400'
                : theme === 'kids'
                ? 'bg-purple-400 border-2 border-purple-500 text-white ring-2 ring-purple-300'
                : 'bg-orange-600/50 border-2 border-orange-400 text-orange-300 ring-2 ring-orange-400';
        }

        if (hasAnswered) {
            return theme === 'tron'
                ? 'bg-gray-800/50 border border-gray-700 text-gray-500 cursor-not-allowed'
                : theme === 'kids'
                ? 'bg-gray-200 border-2 border-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800/50 border border-gray-700 text-gray-500 cursor-not-allowed';
        }

        return theme === 'tron'
            ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 cursor-pointer'
            : theme === 'kids'
            ? 'bg-purple-100 border-2 border-purple-300 text-purple-900 hover:bg-purple-200 hover:border-purple-400 cursor-pointer'
            : 'bg-orange-900/20 border border-orange-700/50 text-orange-400 hover:bg-orange-900/30 hover:border-orange-600 cursor-pointer';
    };

    // Render Rules Phase - Different content based on round
    const renderRulesPhase = () => {
        // Speed Round (Round 4) - Big red pulsating announcement
        if (isSpeedRound) {
            return (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="text-center">
                        {/* Pulsating countdown */}
                        <div className="mb-6">
                            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center font-black text-3xl bg-red-600 text-white shadow-lg animate-pulse">
                                {rulesTimer}
                            </div>
                        </div>

                        {/* Big lightning bolt */}
                        <div className="text-8xl mb-4 animate-bounce">⚡</div>

                        {/* Big red pulsating text */}
                        <h1 className="text-4xl md:text-6xl font-black text-red-500 mb-4 animate-pulse" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.6)' }}>
                            SPEED ROUND!
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-black text-yellow-400 mb-4 animate-pulse" style={{ textShadow: '0 0 15px rgba(250, 204, 21, 0.8)' }}>
                            60 SECONDS!
                        </h2>
                        <h3 className="text-xl md:text-3xl font-black text-white mb-6 animate-bounce">
                            ANSWER AS MANY AS YOU CAN!!!
                        </h3>

                        {/* Quick info */}
                        <div className="flex flex-wrap justify-center gap-4 text-white/80 text-lg">
                            <span className="bg-red-600/40 px-4 py-2 rounded-full border border-red-500">⏱️ 60 seconds total</span>
                            <span className="bg-yellow-600/40 px-4 py-2 rounded-full border border-yellow-500">⚡ 2x Points</span>
                            <span className="bg-purple-600/40 px-4 py-2 rounded-full border border-purple-500">♾️ Unlimited questions</span>
                        </div>
                    </div>
                </div>
            );
        }

        // Rounds 2-3 - Quick "Same rules" message with ready button
        if (currentRound > 1) {
            const totalPlayers = currentRoom?.players?.length || 1;
            const readyCount = readyPlayers.length;
            const allReady = readyCount >= totalPlayers;

            return (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-md w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'} relative text-center`}>
                        {/* Countdown badge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${rulesTimer <= 1 ? 'bg-red-600 animate-pulse' : (theme === 'tron' ? 'bg-cyan-500' : theme === 'kids' ? 'bg-purple-500' : 'bg-orange-600')} text-white shadow-lg`}>
                                {rulesTimer}
                            </div>
                        </div>

                        <div className="text-5xl mb-4 mt-4">🎯</div>
                        <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} mb-3 ${currentTheme.font}`}>
                            {theme === 'tron' ? `> ROUND_${currentRound}` : `Round ${currentRound}`}
                        </h2>
                        <div className={`text-xl font-bold ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'} mb-2`}>
                            Same rules!
                        </div>

                        {/* Ready button */}
                        <button
                            onClick={handleReady}
                            disabled={isReady}
                            className={`w-full py-2 rounded-xl font-bold transition-all mt-3 ${
                                isReady
                                    ? (theme === 'tron' ? 'bg-green-500/30 text-green-400 border-2 border-green-500' : theme === 'kids' ? 'bg-green-400 text-white border-2 border-green-500' : 'bg-green-700/40 text-green-400 border-2 border-green-600')
                                    : (theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-purple-500 hover:bg-purple-400 text-white' : 'bg-orange-600 hover:bg-orange-500 text-white')
                            }`}
                        >
                            {isReady ? '✓ Ready!' : "I'm Ready!"}
                        </button>

                        {/* Ready status */}
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
                    {/* Countdown badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${rulesTimer <= 3 ? 'bg-red-600 animate-pulse' : (theme === 'tron' ? 'bg-cyan-500' : theme === 'kids' ? 'bg-purple-500' : 'bg-orange-600')} text-white shadow-lg`}>
                            {rulesTimer}
                        </div>
                    </div>

                    <div className="text-center mb-4 mt-4">
                        <div className="text-5xl mb-4">🧠</div>
                        <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                            {theme === 'tron' ? '> TRIVIA_TIME' : 'Trivia Time!'}
                        </h2>
                        <div className={`text-sm ${currentTheme.textSecondary}`}>Round 1 of {totalRounds}</div>
                    </div>

                    <div className={`space-y-3 mb-6 ${currentTheme.textSecondary} text-sm`}>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">❓</span>
                            <p>Each question has <strong className={currentTheme.text}>6 multiple choice answers</strong></p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">⏱️</span>
                            <p><strong className={currentTheme.text}>10 seconds</strong> to answer each question</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">🏆</span>
                            <p>Faster answers = <strong className={currentTheme.text}>more points</strong>!</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">⚡</span>
                            <p>Round 4 is a <strong className="text-red-400">Speed Round</strong> with <strong className="text-yellow-400">double points</strong>!</p>
                        </div>
                    </div>

                    {/* Ready button and status */}
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
                            {isReady ? '✓ Ready!' : "I'm Ready!"}
                        </button>

                        {/* Ready players indicator */}
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
                                        {playerIsReady && <span className="text-green-400 text-xs">✓</span>}
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
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-lg p-2 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'} mb-3`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* Round */}
                    <div className={`${theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-700/40 text-orange-400 border border-orange-700'} px-3 py-1 rounded-lg`}>
                        <span className="text-sm font-bold">Round {currentRound}/{totalRounds}</span>
                    </div>

                    {/* Question number */}
                    <div className={`${theme === 'tron' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400' : theme === 'kids' ? 'bg-pink-500 text-white' : 'bg-purple-700/40 text-purple-400 border border-purple-700'} px-3 py-1 rounded-lg`}>
                        <span className="text-sm font-bold">Q{questionNumber}{isSpeedRound ? '' : `/${totalQuestions}`}</span>
                    </div>

                    {/* Timer */}
                    <div className={`${timer <= 3 ? (theme === 'tron' ? 'bg-red-500/30 text-red-400 border border-red-500' : theme === 'kids' ? 'bg-red-500 text-white' : 'bg-red-700/40 text-red-400 border border-red-700') : (theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-green-500 text-white' : 'bg-orange-700/40 text-orange-400 border border-orange-700')} px-3 py-1 rounded-lg flex items-center gap-1 ${timer <= 3 ? 'animate-pulse' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span className="text-base font-black">{timer}s</span>
                    </div>

                    {/* Speed round timer - shows 60s countdown */}
                    {isSpeedRound && (
                        <div className={`${speedRoundTimer <= 10 ? 'bg-red-500/30 border border-red-500 text-red-400 animate-pulse' : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'} px-3 py-1 rounded-lg flex items-center gap-1`}>
                            <span className="text-sm font-bold">⚡</span>
                            <span className="text-base font-black">{speedRoundTimer}s</span>
                        </div>
                    )}

                    {/* Group turn indicator */}
                    {groupInfo && groupInfo.currentGroup && (
                        <div className={`${theme === 'tron' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : theme === 'kids' ? 'bg-green-400 text-white' : 'bg-green-700/40 text-green-400 border border-green-700'} px-3 py-1 rounded-lg`}>
                            <span className="text-sm font-bold">{groupInfo.currentGroup.label} Turn</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Question Card */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 md:p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4`}>
                {/* Category */}
                <div className="text-center mb-3">
                    <span className={`inline-block ${theme === 'tron' ? 'bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 text-purple-700' : 'bg-orange-900/30 text-orange-400'} px-3 py-1 rounded-full text-sm font-semibold`}>
                        {CATEGORY_ICONS[category] || '🧠'} {category}
                    </span>
                </div>

                {/* Question */}
                <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.text} text-center mb-6 ${currentTheme.font}`}>
                    {currentQuestion}
                </h2>

                {/* Answer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {answers.map((answer, index) => (
                        <button
                            key={index}
                            onClick={() => submitAnswer(index)}
                            disabled={hasAnswered || phase !== 'question'}
                            className={`${getAnswerButtonStyle(index)} rounded-xl p-4 text-left transition-all font-semibold text-sm md:text-base`}
                        >
                            <span className={`inline-block w-6 h-6 rounded-full ${theme === 'tron' ? 'bg-cyan-500/30 text-cyan-300' : theme === 'kids' ? 'bg-purple-400 text-white' : 'bg-orange-700/50 text-orange-300'} text-center text-sm font-bold mr-2`}>
                                {String.fromCharCode(65 + index)}
                            </span>
                            {answer}
                        </button>
                    ))}
                </div>

                {/* Answered indicator */}
                {hasAnswered && phase === 'question' && (
                    <div className={`mt-4 text-center ${currentTheme.textSecondary}`}>
                        <span className="text-green-400 font-semibold">Answer locked in!</span> Waiting for others...
                    </div>
                )}
            </div>

            {/* Players who answered - only show current group if in group mode */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl p-3 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'}`}>
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm ${currentTheme.textSecondary}`}>
                        {groupInfo ? `${groupInfo.currentGroup?.label || 'Group'} Answered:` : 'Answered:'}
                    </span>
                    {(groupInfo?.currentGroup?.playerNames
                        ? currentRoom?.players.filter(p => groupInfo.currentGroup.playerNames.includes(p.name))
                        : currentRoom?.players
                    )?.map((player, idx) => {
                        const hasAnswered = answeredPlayers.includes(player.name);
                        const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-1 px-2 py-1 rounded-full ${hasAnswered ? (theme === 'tron' ? 'bg-green-500/20 border border-green-500/50' : theme === 'kids' ? 'bg-green-200 border border-green-400' : 'bg-green-700/30 border border-green-600/50') : (theme === 'tron' ? 'bg-gray-800/50 border border-gray-700' : theme === 'kids' ? 'bg-gray-200 border border-gray-300' : 'bg-gray-800/50 border border-gray-700')}`}
                            >
                                <div className="w-5 h-5">
                                    <CharacterSVG characterId={player.avatar} size={20} color={hasAnswered ? character.color : '#666'} />
                                </div>
                                <span className={`text-xs font-semibold ${hasAnswered ? (theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-green-700' : 'text-green-400') : 'text-gray-500'}`}>
                                    {player.name}
                                </span>
                                {hasAnswered && <span className="text-green-400 text-xs">✓</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Game Scoreboard - shows cumulative game total (frozen during question phase) */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl p-3 mt-3 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'}`}>
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
                                        {isLeader && <span className="ml-1">👑</span>}
                                    </span>
                                    <span className={`font-black text-sm ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                        {player.prevScore}
                                    </span>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Master kick controls */}
            {isMaster && currentRoom?.players && (
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl p-3 mt-3 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'}`}>
                    <h3 className={`text-sm font-bold ${currentTheme.text} mb-2`}>Kick Player:</h3>
                    <div className="flex flex-wrap gap-2">
                        {currentRoom.players.filter(p => p.name !== playerName).map((player, idx) => {
                            const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];

                            const handleKickPlayer = () => {
                                if (currentRoom?.id) {
                                    socket.emit('kickPlayer', { roomId: currentRoom.id, playerName: player.name });
                                }
                            };

                            return (
                                <div
                                    key={idx}
                                    className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${theme === 'tron' ? 'bg-gray-800/50' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/50'}`}
                                >
                                    <div className="w-8 h-8">
                                        <CharacterSVG characterId={player.avatar} size={32} color={character.color} />
                                    </div>
                                    <span className={`text-xs font-semibold ${currentTheme.text}`}>
                                        {player.name}
                                    </span>
                                    <button
                                        onClick={handleKickPlayer}
                                        className={`text-[10px] px-1.5 py-0.5 rounded ${theme === 'tron' ? 'bg-red-500/30 hover:bg-red-500/50 text-red-400' : theme === 'kids' ? 'bg-red-200 hover:bg-red-300 text-red-600' : 'bg-red-700/30 hover:bg-red-700/50 text-red-400'} transition-all`}
                                    >
                                        Kick
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    // Render Reveal Phase
    const renderRevealPhase = () => (
        <div className="max-w-4xl mx-auto">
            {/* Header - same as question */}
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
                {/* Category */}
                <div className="text-center mb-3">
                    <span className={`inline-block ${theme === 'tron' ? 'bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 text-purple-700' : 'bg-orange-900/30 text-orange-400'} px-3 py-1 rounded-full text-sm font-semibold`}>
                        {CATEGORY_ICONS[category] || '🧠'} {category}
                    </span>
                </div>

                {/* Question */}
                <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.text} text-center mb-6 ${currentTheme.font}`}>
                    {currentQuestion}
                </h2>

                {/* Answer Grid with reveal highlighting */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {answers.map((answer, index) => (
                        <div
                            key={index}
                            className={`${getAnswerButtonStyle(index)} rounded-xl p-4 text-left transition-all font-semibold text-sm md:text-base`}
                        >
                            <span className={`inline-block w-6 h-6 rounded-full ${revealData?.correctIndex === index ? 'bg-green-500 text-white' : (theme === 'tron' ? 'bg-gray-700 text-gray-400' : theme === 'kids' ? 'bg-gray-300 text-gray-600' : 'bg-gray-700 text-gray-400')} text-center text-sm font-bold mr-2`}>
                                {revealData?.correctIndex === index ? '✓' : String.fromCharCode(65 + index)}
                            </span>
                            {answer}
                            {revealData?.correctIndex === index && (
                                <span className="ml-2 text-green-400 font-bold">Correct!</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Points earned */}
                {revealData?.playerResults?.[playerName] && (
                    <div className={`mt-4 text-center p-3 rounded-xl ${revealData.playerResults[playerName].isCorrect ? (theme === 'tron' ? 'bg-green-500/20 border border-green-500' : theme === 'kids' ? 'bg-green-200 border-2 border-green-400' : 'bg-green-700/30 border border-green-600') : (theme === 'tron' ? 'bg-red-500/20 border border-red-500' : theme === 'kids' ? 'bg-red-200 border-2 border-red-400' : 'bg-red-700/30 border border-red-600')}`}>
                        {revealData.playerResults[playerName].isCorrect ? (
                            <span className="text-green-400 font-bold text-lg">
                                +{revealData.playerResults[playerName].pointsEarned} points!
                            </span>
                        ) : (
                            <span className="text-red-400 font-bold text-lg">
                                Wrong answer
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Players who answered - keep visible during reveal */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl p-3 mb-3 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'}`}>
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm ${currentTheme.textSecondary}`}>Answered:</span>
                    {currentRoom?.players.map((player, idx) => {
                        const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                        // During reveal, everyone has answered
                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-1 px-2 py-1 rounded-full ${theme === 'tron' ? 'bg-green-500/20 border border-green-500/50' : theme === 'kids' ? 'bg-green-200 border border-green-400' : 'bg-green-700/30 border border-green-600/50'}`}
                            >
                                <div className="w-5 h-5">
                                    <CharacterSVG characterId={player.avatar} size={20} color={character.color} />
                                </div>
                                <span className={`text-xs font-semibold ${theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-green-700' : 'text-green-400'}`}>
                                    {player.name}
                                </span>
                                <span className="text-green-400 text-xs">✓</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Game Scoreboard - FROZEN, same as question phase (uses previousRoundScores) */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl p-3 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'} mb-3`}>
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
                                        {isLeader && <span className="ml-1">👑</span>}
                                    </span>
                                    <span className={`font-black text-sm ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                        {player.prevScore}
                                    </span>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Master kick controls */}
            {isMaster && currentRoom?.players && (
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-xl p-3 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'}`}>
                    <h3 className={`text-sm font-bold ${currentTheme.text} mb-2`}>Kick Player:</h3>
                    <div className="flex flex-wrap gap-2">
                        {currentRoom.players.filter(p => p.name !== playerName).map((player, idx) => {
                            const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];

                            const handleKickPlayer = () => {
                                if (currentRoom?.id) {
                                    socket.emit('kickPlayer', { roomId: currentRoom.id, playerName: player.name });
                                }
                            };

                            return (
                                <div
                                    key={idx}
                                    className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg ${theme === 'tron' ? 'bg-gray-800/50' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/50'}`}
                                >
                                    <div className="w-8 h-8">
                                        <CharacterSVG characterId={player.avatar} size={32} color={character.color} />
                                    </div>
                                    <span className={`text-xs font-semibold ${currentTheme.text}`}>
                                        {player.name}
                                    </span>
                                    <button
                                        onClick={handleKickPlayer}
                                        className={`text-[10px] px-1.5 py-0.5 rounded ${theme === 'tron' ? 'bg-red-500/30 hover:bg-red-500/50 text-red-400' : theme === 'kids' ? 'bg-red-200 hover:bg-red-300 text-red-600' : 'bg-red-700/30 hover:bg-red-700/50 text-red-400'} transition-all`}
                                    >
                                        Kick
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
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
                        <div className="flex justify-center gap-2">
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
                            Question {recapQuestionIndex + 1} of {questionHistory.length}
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
                                {activeGroups.length > 0 ? activeGroups.map((groupData, groupIdx) => {
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
                                                <div className={`text-sm md:text-base ${currentTheme.text} font-medium flex-1`}>
                                                    {groupData.question}
                                                </div>
                                            </div>

                                            {/* Correct answer */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-green-400 font-bold">✓</span>
                                                <span className="text-green-400 text-sm font-semibold">{groupData.correctAnswer}</span>
                                            </div>

                                            {/* Player results with cascade animation */}
                                            <div className="flex flex-wrap gap-2 min-h-[28px]">
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
                            <div className="mt-4">
                                {/* View Final Results button for master */}
                                {isMaster && recapData?.isLastRound && animationComplete && (
                                    <button
                                        onClick={handleNextRound}
                                        className={`w-full ${theme === 'tron' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' : theme === 'kids' ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-orange-700 hover:bg-orange-600 text-white'} font-bold py-3 rounded-xl transition-all text-lg mb-3`}
                                    >
                                        {theme === 'tron' ? '[ VIEW_RESULTS ]' : 'View Final Results'}
                                    </button>
                                )}

                                {/* Game Master Controls */}
                                <GameMasterControls
                                    theme={theme}
                                    currentTheme={currentTheme}
                                    currentRoom={currentRoom}
                                    isMaster={isMaster}
                                    playerName={playerName}
                                    availableCharacters={availableCharacters}
                                />

                                {!isMaster && !animationComplete && (
                                    <div className={`text-center ${currentTheme.textSecondary} text-sm`}>
                                        Reviewing questions...
                                    </div>
                                )}

                                {!isMaster && animationComplete && nextRoundCountdown !== null && (
                                    <div className={`text-center ${currentTheme.textSecondary} text-sm`}>
                                        {recapData?.isLastRound ? 'Final results incoming...' : 'Next round starting...'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render Final Results Phase
    const renderFinalPhase = () => (
        <div className="max-w-4xl mx-auto text-center">
            {/* Winner Celebration Component */}
            {showWinnerCelebration && (
                <WinnerCelebration
                    winner={finalData?.winner}
                    playerName={playerName}
                    gameName="Trivia Game"
                    theme={theme}
                    currentTheme={currentTheme}
                    availableCharacters={availableCharacters}
                    onDismiss={() => setShowWinnerCelebration(false)}
                    autoDismissSeconds={5}
                />
            )}

            {/* Winner Summary Card */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 md:p-8 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4`}>
                <div className="text-5xl mb-4">🏆</div>
                <h2 className={`text-3xl md:text-4xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                    {finalData?.winner?.name === playerName
                        ? (theme === 'tron' ? '> YOU_WIN!' : 'You Win!')
                        : (theme === 'tron' ? `> ${finalData?.winner?.name?.toUpperCase()}_WINS!` : `${finalData?.winner?.name} Wins!`)
                    }
                </h2>
                <div className={`text-2xl font-bold ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                    {finalData?.winner?.score} points
                </div>
            </div>

            {/* Final Standings */}
            <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 md:p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4`}>
                <h3 className={`text-lg font-bold ${currentTheme.text} mb-4 ${currentTheme.font}`}>
                    {theme === 'tron' ? '> FINAL_STANDINGS' : 'Final Standings'}
                </h3>

                <div className="space-y-2">
                    {standings.map((player, idx) => {
                        const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                        const isMe = player.name === playerName;
                        const canKick = isMaster && !isMe;
                        const medals = ['🥇', '🥈', '🥉'];

                        const handleKickPlayer = () => {
                            if (currentRoom?.id) {
                                socket.emit('kickPlayer', { roomId: currentRoom.id, playerName: player.name });
                            }
                        };

                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isMe ? (theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500' : theme === 'kids' ? 'bg-purple-200 border-2 border-purple-400' : 'bg-orange-700/30 border border-orange-600') : (theme === 'tron' ? 'bg-gray-800/50' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/50')}`}
                            >
                                {/* Rank */}
                                <div className="w-8 h-8 flex items-center justify-center font-black text-2xl">
                                    {medals[idx] || (idx + 1)}
                                </div>

                                {/* Avatar with kick button below for master */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10">
                                        <CharacterSVG characterId={player.avatar} size={40} color={character.color} />
                                    </div>
                                    {canKick && (
                                        <button
                                            onClick={handleKickPlayer}
                                            className={`text-[10px] px-1.5 py-0.5 rounded ${theme === 'tron' ? 'bg-red-500/30 hover:bg-red-500/50 text-red-400' : theme === 'kids' ? 'bg-red-200 hover:bg-red-300 text-red-600' : 'bg-red-700/30 hover:bg-red-700/50 text-red-400'} transition-all`}
                                            title={`Kick ${player.name}`}
                                        >
                                            Kick
                                        </button>
                                    )}
                                </div>

                                {/* Name */}
                                <div className="flex-1 text-left">
                                    <div className={`font-bold ${currentTheme.text}`}>
                                        {player.name}
                                        {isMe && <span className={`ml-2 text-xs ${theme === 'tron' ? 'text-cyan-400' : theme === 'kids' ? 'text-purple-600' : 'text-orange-400'}`}>(You)</span>}
                                    </div>
                                </div>

                                {/* Score */}
                                <div className={`font-black text-xl ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                    {player.score}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={`${currentTheme.textSecondary} text-sm`}>
                Returning to room shortly...
            </div>
        </div>
    );

    // Render Speed Round Phase - Individual play
    const renderSpeedRoundPhase = () => {
        // If waiting (finished all questions)
        if (speedRoundWaiting) {
            return (
                <div className="max-w-4xl mx-auto text-center">
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 md:p-8 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                        <div className="text-5xl mb-4">🏁</div>
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
                            <span className="text-green-400 font-bold">{speedRoundStats.correct}</span> correct •
                            <span className="text-yellow-400 font-bold ml-2">{speedRoundStats.points}</span> pts
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-4xl mx-auto">
                {/* Header with speed round timer */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-lg p-2 ${theme === 'tron' ? 'border border-cyan-500/30' : theme === 'kids' ? 'border-2 border-purple-400' : 'border border-orange-700'} mb-3`}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Round indicator */}
                        <div className={`${theme === 'tron' ? 'bg-red-500/20 border border-red-500/30 text-red-400' : theme === 'kids' ? 'bg-red-500 text-white' : 'bg-red-700/40 text-red-400 border border-red-700'} px-3 py-1 rounded-lg`}>
                            <span className="text-sm font-bold">⚡ SPEED ROUND</span>
                        </div>

                        {/* Difficulty indicator */}
                        {speedRoundDifficulty && (
                            <div className={`${theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-purple-500 text-white' : 'bg-orange-700/40 text-orange-400 border border-orange-700'} px-3 py-1 rounded-lg`}>
                                <span className="text-sm font-bold">📊 {speedRoundDifficulty}</span>
                            </div>
                        )}

                        {/* Question number */}
                        <div className={`${theme === 'tron' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-400' : theme === 'kids' ? 'bg-pink-500 text-white' : 'bg-purple-700/40 text-purple-400 border border-purple-700'} px-3 py-1 rounded-lg`}>
                            <span className="text-sm font-bold">Q{questionNumber}</span>
                        </div>

                        {/* 60s Timer */}
                        <div className={`${speedRoundTimer <= 10 ? 'bg-red-500/30 border border-red-500 text-red-400 animate-pulse' : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'} px-3 py-1 rounded-lg flex items-center gap-1`}>
                            <span className="text-sm font-bold">⏱️</span>
                            <span className="text-base font-black">{speedRoundTimer}s</span>
                        </div>

                        {/* Stats */}
                        <div className={`${theme === 'tron' ? 'bg-green-500/20 border border-green-500/30 text-green-400' : theme === 'kids' ? 'bg-green-500 text-white' : 'bg-green-700/40 text-green-400 border border-green-700'} px-3 py-1 rounded-lg`}>
                            <span className="text-sm font-bold">✓ {speedRoundStats.correct} • {speedRoundStats.points}pts</span>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 md:p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4 relative overflow-hidden`}>
                    {/* Category */}
                    <div className="text-center mb-3">
                        <span className={`inline-block ${theme === 'tron' ? 'bg-cyan-500/20 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 text-purple-700' : 'bg-orange-900/30 text-orange-400'} px-3 py-1 rounded-full text-sm font-semibold`}>
                            {CATEGORY_ICONS[category] || '🧠'} {category}
                        </span>
                    </div>

                    {/* Question */}
                    <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.text} text-center mb-6 ${currentTheme.font}`}>
                        {currentQuestion}
                    </h2>

                    {/* Answer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {answers.map((answer, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrectSelected = speedRoundFeedback === 'correct' && isSelected;
                            const isCorrectAnswer = speedRoundFeedback === 'wrong' && speedRoundCorrectAnswer?.index === index;
                            const isWrongSelected = speedRoundFeedback === 'wrong' && isSelected && !isCorrectAnswer;

                            let buttonStyle;
                            if (isCorrectSelected) {
                                // Correct answer selected - show green
                                buttonStyle = theme === 'tron'
                                    ? 'bg-green-500/40 border-2 border-green-400 text-green-300 ring-2 ring-green-400'
                                    : theme === 'kids'
                                    ? 'bg-green-400 border-2 border-green-500 text-white ring-2 ring-green-300'
                                    : 'bg-green-700/50 border-2 border-green-500 text-green-300 ring-2 ring-green-400';
                            } else if (isCorrectAnswer) {
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
                            } else if (speedRoundFeedback === 'wrong' || speedRoundFeedback === 'correct') {
                                // Gray out other buttons during feedback
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
                                    className={`${buttonStyle} rounded-xl p-4 text-left transition-all font-semibold text-sm md:text-base`}
                                >
                                    <span className={`inline-block w-6 h-6 rounded-full ${
                                        (isCorrectAnswer || isCorrectSelected) ? 'bg-green-500 text-white' :
                                        theme === 'tron' ? 'bg-cyan-500/30 text-cyan-300' :
                                        theme === 'kids' ? 'bg-purple-400 text-white' :
                                        'bg-orange-700/50 text-orange-300'
                                    } text-center text-sm font-bold mr-2`}>
                                        {(isCorrectAnswer || isCorrectSelected) ? '✓' : String.fromCharCode(65 + index)}
                                    </span>
                                    {answer}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Render Speed Round Race Recap - Single shared track
    const renderSpeedRecapPhase = () => {
        if (!raceData) return null;

        const maxCorrect = raceData.maxCorrect || 1;
        const winner = raceData.winner;

        // Race phase - show the race visualization
        if (speedRecapPhase === 'race') {
            // Sort players by their current animated position for proper z-index layering
            const sortedPlayers = [...raceData.raceData].sort((a, b) => {
                const aSteps = Math.min(raceStep, a.correctCount);
                const bSteps = Math.min(raceStep, b.correctCount);
                return aSteps - bSteps;  // Players behind render first (lower z-index)
            });

            return (
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-3 md:p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4 text-center`}>
                        <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                            {theme === 'tron' ? '> SPEED_ROUND_RACE' : '⚡ Speed Round Race!'}
                        </h2>
                    </div>

                    {/* Race Field - Single shared track */}
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

                        {/* Race Track - Single horizontal field */}
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
                                <div className="absolute -top-1 -right-3 text-2xl">🏁</div>
                            </div>

                            {/* Race Complete Overlay - shows when race is done */}
                            {raceComplete && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-xl">
                                    <div className="text-center">
                                        <div className="text-5xl mb-2">🏆</div>
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
                                // Winner (max correct) should reach 92% to be at the finish line
                                // Winner should reach 96% to be right at the finish line flag
                                const progressPercent = maxCorrect > 0 ? (currentSteps / maxCorrect) * 96 : 0;
                                const originalIdx = raceData.raceData.findIndex(p => p.name === playerData.name);

                                // Vertical position: space players evenly based on original order
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
                                        {/* Avatar with glow for current player */}
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

                                            {/* Player name tag */}
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
                                                {currentSteps} correct • {playerData.wrongCount} wrong
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

        // Winner celebration phase - show all players with points earned in speed round
        if (speedRecapPhase === 'winner') {
            return (
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-3 md:p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4 text-center`}>
                        <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                            {theme === 'tron' ? '> SPEED_ROUND_RESULTS' : '⚡ Speed Round Results'}
                        </h2>
                        <p className={`text-sm ${currentTheme.textSecondary} mt-1`}>
                            Points earned in the speed round
                        </p>
                    </div>

                    {/* Winner celebration */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-6 md:p-8 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                        {/* Winner announcement */}
                        {winner && (
                            <div className="text-center mb-8">
                                <div className="text-6xl mb-4 animate-bounce">🏆</div>
                                <div className={`text-xl font-bold ${currentTheme.textSecondary} mb-1`}>
                                    Speed Round Winner
                                </div>
                                <div className={`text-3xl font-black ${currentTheme.text} mb-2`}>
                                    {winner.name === playerName ? 'You!' : winner.name}
                                </div>
                                <div className={`text-2xl font-black ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                    +{winner.totalPoints} points
                                </div>
                            </div>
                        )}

                        {/* All players with points earned */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {raceData.raceData.map((playerData) => {
                                const character = availableCharacters.find(c => c.id === playerData.avatar) || availableCharacters[0];
                                const isMe = playerData.name === playerName;
                                const isWinner = winner?.name === playerData.name;

                                return (
                                    <div
                                        key={playerData.name}
                                        className={`p-4 rounded-xl text-center ${
                                            isWinner
                                                ? 'bg-yellow-500/20 border-2 border-yellow-500 animate-pulse'
                                                : isMe
                                                ? (theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500' : theme === 'kids' ? 'bg-purple-200 border-2 border-purple-400' : 'bg-orange-700/30 border border-orange-600')
                                                : (theme === 'tron' ? 'bg-gray-800/50' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/50')
                                        }`}
                                    >
                                        {/* Winner crown */}
                                        {isWinner && (
                                            <div className="text-3xl mb-2 animate-bounce">👑</div>
                                        )}

                                        {/* Avatar */}
                                        <div className="flex justify-center mb-2">
                                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${
                                                isWinner
                                                    ? 'ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50'
                                                    : isMe
                                                    ? 'ring-4 ring-yellow-400'
                                                    : theme === 'tron' ? 'ring-2 ring-cyan-500/50' : theme === 'kids' ? 'ring-2 ring-purple-400/50' : 'ring-2 ring-orange-600/50'
                                            } ${theme === 'tron' ? 'bg-gray-800' : theme === 'kids' ? 'bg-white' : 'bg-gray-800'}`}>
                                                <CharacterSVG characterId={playerData.avatar} size={48} color={character.color} />
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <div className={`font-bold text-sm ${currentTheme.text} mb-2 truncate`}>
                                            {playerData.name}
                                        </div>

                                        {/* Points earned animation */}
                                        <div className={`text-2xl font-black ${theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-green-600' : 'text-green-400'}`}
                                            style={{ animation: 'pulse 1s ease-in-out infinite' }}>
                                            +{playerData.totalPoints}
                                        </div>
                                        <div className={`text-xs ${currentTheme.textSecondary}`}>
                                            points earned
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        // Leaderboard phases (leaderboard, animating, final) - show standings with animated scores
        if (speedRecapPhase === 'leaderboard' || speedRecapPhase === 'animating' || speedRecapPhase === 'final') {
            // Get the sorted standings based on current animated scores
            const sortedStandings = [...preSpeedStandings].map(player => {
                const speedPoints = raceData.raceData.find(r => r.name === player.name)?.totalPoints || 0;
                const animatedScore = animatedFinalScores[player.name] ?? player.score;
                const finalScore = player.score + speedPoints;
                return {
                    ...player,
                    animatedScore,
                    speedPoints,
                    finalScore
                };
            }).sort((a, b) => {
                // Sort by animated score (will change during animation)
                return b.animatedScore - a.animatedScore;
            });

            // Find the overall winner (highest final score)
            const gameWinner = sortedStandings.reduce((best, player) =>
                player.finalScore > (best?.finalScore || 0) ? player : best
            , null);

            return (
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-3 md:p-4 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'} mb-4 text-center`}>
                        <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} ${currentTheme.font}`}>
                            {speedRecapPhase === 'final'
                                ? (theme === 'tron' ? '> GAME_WINNER' : '🏆 Game Winner!')
                                : (theme === 'tron' ? '> FINAL_STANDINGS' : '📊 Final Standings')}
                        </h2>
                        {speedRecapPhase === 'leaderboard' && (
                            <p className={`text-sm ${currentTheme.textSecondary} mt-2`}>
                                Scores before speed round...
                            </p>
                        )}
                        {speedRecapPhase === 'animating' && (
                            <p className={`text-lg ${theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-green-600' : 'text-green-400'} mt-2 animate-pulse font-bold`}>
                                ⚡ Adding speed round points...
                            </p>
                        )}
                    </div>

                    {/* Standings list */}
                    <div className={`${currentTheme.cardBg} backdrop-blur-lg rounded-2xl p-4 md:p-6 ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-2 border-orange-700'}`}>
                        <div className="space-y-3">
                            {sortedStandings.map((player, index) => {
                                const character = availableCharacters.find(c => c.id === player.avatar) || availableCharacters[0];
                                const isMe = player.name === playerName;
                                const isGameWinner = speedRecapPhase === 'final' && gameWinner?.name === player.name;
                                const position = index + 1;

                                return (
                                    <div
                                        key={player.name}
                                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                                            isGameWinner
                                                ? 'bg-yellow-500/30 border-2 border-yellow-500 scale-105'
                                                : isMe
                                                ? (theme === 'tron' ? 'bg-cyan-500/20 border border-cyan-500' : theme === 'kids' ? 'bg-purple-200 border-2 border-purple-400' : 'bg-orange-700/30 border border-orange-600')
                                                : (theme === 'tron' ? 'bg-gray-800/50' : theme === 'kids' ? 'bg-gray-100' : 'bg-gray-800/50')
                                        }`}
                                    >
                                        {/* Position */}
                                        <div className={`text-2xl font-black w-10 text-center ${
                                            position === 1 ? 'text-yellow-400' :
                                            position === 2 ? 'text-gray-400' :
                                            position === 3 ? 'text-orange-600' :
                                            currentTheme.textSecondary
                                        }`}>
                                            {position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `#${position}`}
                                        </div>

                                        {/* Avatar */}
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center ${
                                            isGameWinner
                                                ? 'ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50'
                                                : isMe
                                                ? 'ring-4 ring-yellow-400'
                                                : theme === 'tron' ? 'ring-2 ring-cyan-500/50' : theme === 'kids' ? 'ring-2 ring-purple-400/50' : 'ring-2 ring-orange-600/50'
                                        } ${theme === 'tron' ? 'bg-gray-800' : theme === 'kids' ? 'bg-white' : 'bg-gray-800'}`}>
                                            <CharacterSVG characterId={player.avatar} size={40} color={character.color} />
                                        </div>

                                        {/* Name and winner indicator */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${currentTheme.text}`}>{player.name}</span>
                                                {isMe && <span className={`text-xs px-2 py-0.5 rounded ${theme === 'tron' ? 'bg-cyan-500/30 text-cyan-400' : theme === 'kids' ? 'bg-purple-300 text-purple-700' : 'bg-orange-700/50 text-orange-400'}`}>You</span>}
                                                {isGameWinner && (
                                                    <span className="text-xl animate-bounce">👑</span>
                                                )}
                                            </div>
                                            {(speedRecapPhase === 'animating' || speedRecapPhase === 'final') && player.speedPoints > 0 && (
                                                <div className={`text-xs ${theme === 'tron' ? 'text-green-400' : theme === 'kids' ? 'text-green-600' : 'text-green-400'}`}>
                                                    +{player.speedPoints} from speed round
                                                </div>
                                            )}
                                        </div>

                                        {/* Score */}
                                        <div className={`text-2xl font-black ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                            {player.animatedScore}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Winner announcement for final phase */}
                        {speedRecapPhase === 'final' && gameWinner && (
                            <div className={`mt-6 text-center p-4 rounded-xl ${theme === 'tron' ? 'bg-yellow-500/20 border border-yellow-500' : theme === 'kids' ? 'bg-yellow-200 border-2 border-yellow-400' : 'bg-yellow-700/30 border border-yellow-600'}`}>
                                <div className="text-4xl mb-2">🎉</div>
                                <div className={`text-xl font-black ${currentTheme.text}`}>
                                    {gameWinner.name === playerName ? 'Congratulations! You won the game!' : `${gameWinner.name} wins the game!`}
                                </div>
                                <div className={`text-lg font-bold ${theme === 'tron' ? 'text-yellow-400' : theme === 'kids' ? 'text-yellow-600' : 'text-yellow-400'}`}>
                                    {gameWinner.finalScore} total points
                                </div>
                            </div>
                        )}

                        {/* Countdown to return to room */}
                        {nextRoundCountdown !== null && (
                            <div className={`mt-4 text-center ${currentTheme.textSecondary}`}>
                                Returning to game room in {nextRoundCountdown}...
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return null;
    };

    // Dev Skip to Speed Round Modal
    const renderDevSkipModal = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-sm w-full ${theme === 'tron' ? 'tron-border' : theme === 'kids' ? 'border-4 border-purple-400' : 'border-4 border-orange-700'}`}>
                <div className="text-center mb-4">
                    <div className="text-4xl mb-3">&#9889;</div>
                    <h2 className={`text-xl font-black ${currentTheme.text} mb-2 ${currentTheme.font}`}>
                        {theme === 'tron' ? '> DEV_MODE' : 'Dev Mode'}
                    </h2>
                    <p className={`${currentTheme.textSecondary} text-sm`}>
                        Are you sure you want to skip to the <strong className="text-red-400">speed round</strong>?
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowDevSkipModal(false)}
                        className={`flex-1 ${theme === 'tron' ? 'bg-gray-800 hover:bg-gray-700 text-cyan-400' : theme === 'kids' ? 'bg-purple-200 hover:bg-purple-300 text-purple-900' : 'bg-gray-800 hover:bg-gray-700 text-orange-400'} font-bold py-3 rounded-xl transition-all`}
                    >
                        No
                    </button>
                    <button
                        onClick={handleDevSkipToSpeedRound}
                        className={`flex-1 ${theme === 'tron' ? 'bg-red-600 hover:bg-red-500 text-white' : theme === 'kids' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-red-700 hover:bg-red-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                    >
                        Yes, Skip
                    </button>
                </div>
            </div>
        </div>
    );

    // End Game Confirmation Modal
    const renderEndGameConfirm = () => (
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
                        onClick={handleEndGame}
                        className={`flex-1 ${theme === 'tron' ? 'bg-red-600 hover:bg-red-500 text-white' : theme === 'kids' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-red-700 hover:bg-red-600 text-white'} font-bold py-3 rounded-xl transition-all`}
                    >
                        End Game
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen ${theme === 'tron' ? 'bg-black tron-grid' : theme === 'kids' ? 'bg-gradient-to-br from-orange-300 via-pink-400 to-purple-500' : 'bg-gradient-to-br from-gray-900 via-orange-950 to-black'} p-2 pt-16 md:p-4 md:pt-24 pb-4`}>
            {phase === 'rules' && renderRulesPhase()}
            {phase === 'question' && renderQuestionPhase()}
            {phase === 'groupWaiting' && renderGroupWaitingPhase()}
            {phase === 'reveal' && renderRevealPhase()}
            {phase === 'recap' && renderRecapPhase()}
            {phase === 'speedRound' && renderSpeedRoundPhase()}
            {phase === 'speedRecap' && renderSpeedRecapPhase()}
            {phase === 'finalRecap' && renderFinalPhase()}
            {showEndGameConfirm && renderEndGameConfirm()}
            {showDevSkipModal && renderDevSkipModal()}

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

export default TriviaGame;
