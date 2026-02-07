import React, { useState, useEffect, useRef, useCallback } from 'react';
import { socket } from './socket';
import { MOCK_GAMES } from './data/games';
import { themes, rarityConfig } from './data/themes';
import { MUSIC_TRACKS, DEFAULT_TRACK } from './data/music';
import { characterAvatars } from './data/characters';
import { saveSession, loadSession, clearSession } from './utils/session';
import { getGameIcon, Star, Crown, Users } from './icons/UIIcons';
import CharacterSVG from './icons/CharacterSVGs';
import { DaftPunkRobotHead, DaftPunkHelmet, WerewolfHowlingIcon } from './icons/ThemeLogos';
import Header from './components/Header';
import RejoiningPage from './pages/RejoiningPage';
import LandingPage from './pages/LandingPage';
import RoomPage from './pages/RoomPage';
import CountdownPage from './pages/CountdownPage';
import GamePage from './pages/GamePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import FriendsPage from './pages/FriendsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import AvatarPicker from './modals/AvatarPicker';
import CharacterInfo from './modals/CharacterInfo';
import MasterTips from './modals/MasterTips';
import PlayerProfile from './modals/PlayerProfile';
import GameSelector from './modals/GameSelector';
import GameDescription from './modals/GameDescription';
import QRModal from './modals/QRModal';
import { api } from './utils/api';
import { setTokens, clearTokens, hasTokens, getRefreshToken, getUserIdFromToken } from './utils/tokenStorage';

function App() {
    const [page, setPage] = useState('landing');
    const [showCreateInput, setShowCreateInput] = useState(false);
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [roomName, setRoomName] = useState('Test Game Room');
    const [joinRoomId, setJoinRoomId] = useState('XU1V2');
    const [playerName, setPlayerName] = useState('Player');
    const [currentRoom, setCurrentRoom] = useState(null);
    const [isMaster, setIsMaster] = useState(false);
    const [showGameSelector, setShowGameSelector] = useState(false);
    const [selectedGames, setSelectedGames] = useState([]);
    const [completedGames, setCompletedGames] = useState([]); // Array of { gameId, timestamp, scores }
    const [accumulatedScores, setAccumulatedScores] = useState({}); // { playerName: totalScore } - persists across games
    const [countdown, setCountdown] = useState(3);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);
    const [drawingOrder, setDrawingOrder] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [gameType, setGameType] = useState('pictionary');  // 'pictionary' or 'trivia'
    const [error, setError] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [theme, setTheme] = useState('tron');
    const [pendingSession, setPendingSession] = useState(() => loadSession());
    const [isMuted, setIsMuted] = useState(false);
    const [numPlayers, setNumPlayers] = useState('');
    const [ageRange, setAgeRange] = useState('');
    const [minAge, setMinAge] = useState(5);
    const [maxAge, setMaxAge] = useState(18);
    const [minPlayers, setMinPlayers] = useState(1);
    const [maxPlayers, setMaxPlayers] = useState(16);
    const [sortBy, setSortBy] = useState('popular');
    const [selectorMinAge, setSelectorMinAge] = useState(5);
    const [selectorMaxAge, setSelectorMaxAge] = useState(18);
    const [selectorMinPlayers, setSelectorMinPlayers] = useState(1);
    const [selectorMaxPlayers, setSelectorMaxPlayers] = useState(16);
    const [selectorSortBy, setSelectorSortBy] = useState('popular');
    const [selectedGameInfo, setSelectedGameInfo] = useState(null);
    const [selectedGameDesc, setSelectedGameDesc] = useState(null);
    const [qrExpanded, setQrExpanded] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('meta');
    const [avatarPickerMode, setAvatarPickerMode] = useState(null);
    const [avatarTimerCount, setAvatarTimerCount] = useState(30);
    const [avatarTakenToast, setAvatarTakenToast] = useState('');
    const [showMasterTips, setShowMasterTips] = useState(false);
    const [characterInfoModal, setCharacterInfoModal] = useState(null);
    const [playerProfileModal, setPlayerProfileModal] = useState(null);
    const [gameHistory, setGameHistory] = useState([]);
    const [lobbyChatMessages, setLobbyChatMessages] = useState([]);
    const [lobbyChatInput, setLobbyChatInput] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [chatAutoScroll, setChatAutoScroll] = useState(true);
    const [showChatModal, setShowChatModal] = useState(false);
    const [isMobilePortrait, setIsMobilePortrait] = useState(() => window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches);
    const [devToast, setDevToast] = useState('');

    // Auth state
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    // Friends state
    const [friends, setFriends] = useState([]);
    const [friendsStatus, setFriendsStatus] = useState({});
    const [pendingRequests, setPendingRequests] = useState({ incoming: [], outgoing: [] });

    const devFirstConnect = useRef(true);
    const audioRef = useRef(null);
    const [musicStarted, setMusicStarted] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(DEFAULT_TRACK);
    const qrRef = useRef(null);
    const qrSmallRef = useRef(null);
    const lobbyChatEndRef = useRef(null);
    const modalChatEndRef = useRef(null);
    const chatScrollRef = useRef(null);
    const modalChatScrollRef = useRef(null);

    // Derived state
    const availableCharacters = characterAvatars[theme] || characterAvatars.tron;
    const currentTheme = themes[theme];
    const takenCharacters = (currentRoom?.players.map(p => p.avatar) || []).filter(a => a !== 'meta');

    // StarRating utility
    const StarRating = ({ rating }) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star key={i} className="star inline" filled={i <= Math.floor(rating)} />
            );
        }
        return <div className="flex items-center gap-1">{stars} <span className="text-xs ml-1">{rating}</span></div>;
    };

    // Dev toast: show when server restarts (socket reconnects)
    useEffect(() => {
        const onConnect = () => {
            if (devFirstConnect.current) {
                devFirstConnect.current = false;
                return;
            }
            setDevToast('Server reloaded');
            console.log(`Server refreshed — ${new Date().toLocaleTimeString()}`);
            setTimeout(() => setDevToast(''), 10000);
        };
        socket.on('connect', onConnect);
        return () => socket.off('connect', onConnect);
    }, []);

    // Rejoin room on mount (after page refresh)
    useEffect(() => {
        const session = loadSession();
        if (!session || !session.roomId) return;

        setPlayerName(session.playerName || 'Player');
        setSelectedAvatar(session.avatar || 'cyber-knight');
        setIsMaster(session.isMaster || false);
        setTheme(session.theme || 'tron');
        setPage('rejoining');

        const attemptRejoin = () => {
            socket.emit('rejoinRoom', {
                roomId: session.roomId,
                playerName: session.playerName,
                avatar: session.avatar
            });
        };

        if (socket.connected) {
            attemptRejoin();
        } else {
            socket.once('connect', attemptRejoin);
        }

        const onRejoinSuccess = (room) => {
            setCurrentRoom(room);
            setSelectedGames(room.selectedGames || []);
            if (room.gameHistory) setGameHistory(room.gameHistory);
            // Verify isMaster from actual room data, not just session
            const isActuallyMaster = room.master === session.playerName;
            setIsMaster(isActuallyMaster);
            const targetPage = session.page === 'game' ? 'game' : 'room';
            setPage(targetPage);
            console.log(`Rejoined room ${room.id} as ${session.playerName}, isMaster: ${isActuallyMaster}`);
        };

        const onRejoinFailed = (data) => {
            clearSession();
            setPendingSession(null);  // Clear pending session to hide rejoin button
            setPage('landing');
            setIsMaster(false);
            setError(data.message || 'Could not rejoin room');
            setTimeout(() => setError(''), 4000);
            console.log('Rejoin failed:', data.message);
        };

        socket.on('rejoinSuccess', onRejoinSuccess);
        socket.on('rejoinFailed', onRejoinFailed);

        return () => {
            socket.off('rejoinSuccess', onRejoinSuccess);
            socket.off('rejoinFailed', onRejoinFailed);
        };
    }, []);

    // Auto-save session whenever relevant state changes
    useEffect(() => {
        if (page === 'landing' || page === 'rejoining') return;
        if (!currentRoom) return;
        saveSession({
            roomId: currentRoom.id,
            playerName,
            avatar: selectedAvatar,
            isMaster,
            theme,
            page,
            selectedGames
        });
    }, [currentRoom, playerName, selectedAvatar, isMaster, theme, page, selectedGames]);

    // Socket event handlers
    useEffect(() => {
        const onRoomCreated = (room) => {
            setCurrentRoom(room);
            setIsMaster(true);
            setSelectedGames(room.selectedGames || []);
            setCompletedGames([]); // Reset completed games for new room
            setAccumulatedScores({}); // Reset accumulated scores for new room
            setPage('room');
            setShowCreateInput(false);
            setAvatarPickerMode('initial');
        };

        const onRoomJoined = (room) => {
            setCurrentRoom(room);
            setIsMaster(false);
            setSelectedGames(room.selectedGames || []);
            setCompletedGames([]); // Reset completed games for new room
            setAccumulatedScores({}); // Reset accumulated scores for new room
            setPage('room');
            setShowJoinInput(false);
            setAvatarPickerMode('initial');
        };

        const onPlayerJoined = (data) => {
            setCurrentRoom(prev => {
                if (!prev || prev.id !== data.roomId) return prev;
                return {
                    ...prev,
                    players: [...prev.players, { name: data.player, isMaster: false, avatar: data.avatar }]
                };
            });
        };

        const onGamesUpdated = (data) => {
            setCurrentRoom(prev => {
                if (!prev || prev.id !== data.roomId) return prev;
                setSelectedGames(data.selectedGames);
                return prev;
            });
        };

        const onGameStarting = (data) => {
            setCurrentRoom(prev => {
                if (!prev || prev.id !== data.roomId) return prev;
                setDrawingOrder(data.drawingOrder || []);
                setTotalRounds(data.totalRounds || 0);
                setCurrentRound(data.currentRound || 1);
                setGameType(data.gameType || 'pictionary');
                setCountdown(3);
                setPage('countdown');
                let count = 3;
                const timer = setInterval(() => {
                    count--;
                    setCountdown(count);
                    if (count === 0) {
                        clearInterval(timer);
                        setPage('game');
                    }
                }, 1000);
                return prev;
            });
        };

        const onNextRound = (data) => {
            setCurrentRound(data.currentRound);
            setTotalRounds(data.totalRounds);
        };

        const onGameEnded = (data) => {
            console.log('[DEBUG] gameEnded received:', JSON.stringify(data?.finalScores, null, 2));
            if (data?.gameHistory) setGameHistory(data.gameHistory);
            // Update accumulated scores from finalScores (persists across games in room session)
            // This is separate from currentRoom.players[].score which gets reset each game
            if (data?.finalScores && data.finalScores.length > 0) {
                setAccumulatedScores(prev => {
                    const updated = { ...prev };
                    data.finalScores.forEach(sp => {
                        updated[sp.name] = (updated[sp.name] || 0) + sp.score;
                    });
                    console.log('[DEBUG] Updated accumulatedScores:', JSON.stringify(updated, null, 2));
                    return updated;
                });
            }
            // Mark current game as completed (use the game that was played based on currentGameIndex)
            setSelectedGames(prev => {
                const currentGame = prev[0]; // First game in queue was played
                if (currentGame && !data?.cancelled) {
                    // Get the latest game history entry for this game's scores
                    const latestGameHistory = data?.gameHistory?.[data.gameHistory.length - 1];
                    setCompletedGames(prevCompleted => [
                        ...prevCompleted,
                        {
                            gameId: currentGame,
                            timestamp: Date.now(),
                            finalScores: latestGameHistory?.finalScores || data?.finalScores || [],
                            roundScores: latestGameHistory?.roundScores || {}
                        }
                    ]);
                    // Remove the completed game from selected games
                    return prev.slice(1);
                }
                return prev;
            });
            setPage('room');
            setDrawingOrder([]);
            setCurrentRound(0);
            setTotalRounds(0);
        };

        const onChatMessage = (data) => {
            setLobbyChatMessages(prev => [...prev, data]);
            const isMobilePortrait = window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches;
            if (isMobilePortrait) {
                setShowChatModal(prev => {
                    if (!prev) setUnreadCount(c => c + 1);
                    return prev;
                });
            } else {
                setChatAutoScroll(prev => {
                    if (!prev) setUnreadCount(c => c + 1);
                    return prev;
                });
            }
        };

        const onError = (data) => {
            setError(data.message);
            setTimeout(() => setError(''), 3000);
        };

        const onPlayerLeft = (data) => {
            setCurrentRoom(prev => {
                if (!prev || prev.id !== data.roomId) return prev;
                return { ...prev, players: prev.players.filter(p => p.name !== data.playerName) };
            });
        };

        const onPlayerRejoined = (data) => {
            setCurrentRoom(prev => {
                if (!prev || prev.id !== data.roomId) return prev;
                return {
                    ...prev,
                    players: prev.players.map(p =>
                        p.name === data.playerName ? { ...p, connected: true } : p
                    )
                };
            });
        };

        const onPlayerDisconnected = (data) => {
            setCurrentRoom(prev => {
                if (!prev || prev.id !== data.roomId) return prev;
                return {
                    ...prev,
                    players: prev.players.map(p =>
                        p.name === data.playerName ? { ...p, connected: false } : p
                    )
                };
            });
        };

        const onAvatarChanged = (data) => {
            setCurrentRoom(prev => {
                if (!prev || prev.id !== data.roomId) return prev;
                return {
                    ...prev,
                    players: prev.players.map(p =>
                        p.name === data.playerName ? { ...p, avatar: data.avatar } : p
                    )
                };
            });
        };

        const onScoresUpdated = (data) => {
            setCurrentRoom(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    players: prev.players.map(p => {
                        const updated = data.players.find(sp => sp.name === p.name);
                        return updated ? { ...p, score: updated.score } : p;
                    })
                };
            });
        };

        const onPlayerKicked = (data) => {
            setCurrentRoom(prev => {
                if (!prev || prev.id !== data.roomId) return prev;
                return { ...prev, players: prev.players.filter(p => p.name !== data.playerName) };
            });
            // Also update drawing order if in game
            setDrawingOrder(prev => prev.filter(p => p.name !== data.playerName));
        };

        const onYouWereKicked = (data) => {
            clearSession();
            setCurrentRoom(null);
            setPage('landing');
            setIsMaster(false);
            setError('You were kicked from the room');
            setTimeout(() => setError(''), 4000);
        };

        const onDrawerSkipped = (data) => {
            // Update drawing order to reflect skip (handled via roundResult/nextRound)
            console.log(`${data.playerName}'s turn was skipped: ${data.reason}`);
        };

        const onGameSync = (data) => {
            // Handle gameSync for rejoin - update drawing order and round info
            if (data.noActiveGame) {
                // No active game, go to room
                setPage('room');
                return;
            }
            if (data.drawingOrder) {
                setDrawingOrder(data.drawingOrder);
            }
            if (data.currentRound) {
                setCurrentRound(data.currentRound);
            }
            if (data.totalRounds) {
                setTotalRounds(data.totalRounds);
            }
        };

        const onRoomClosed = (data) => {
            clearSession();
            setCurrentRoom(null);
            setPage('landing');
            setIsMaster(false);
            setError(data.reason || 'Room was closed');
            setTimeout(() => setError(''), 4000);
        };

        const onRemovedForNoAvatar = (data) => {
            clearSession();
            setCurrentRoom(null);
            setPage('landing');
            setIsMaster(false);
            setSelectedAvatar('meta');
            setAvatarPickerMode(null);
            setError('You were removed for not selecting an avatar in time');
            setTimeout(() => setError(''), 4000);
        };

        const onPlayerAfkChanged = (data) => {
            setCurrentRoom(prev => {
                if (!prev || prev.id !== data.roomId) return prev;
                return {
                    ...prev,
                    players: prev.players.map(p =>
                        p.name === data.playerName ? { ...p, isAfk: data.isAfk } : p
                    )
                };
            });
        };

        socket.on('roomCreated', onRoomCreated);
        socket.on('roomJoined', onRoomJoined);
        socket.on('playerJoined', onPlayerJoined);
        socket.on('gamesUpdated', onGamesUpdated);
        socket.on('gameStarting', onGameStarting);
        socket.on('nextRound', onNextRound);
        socket.on('gameEnded', onGameEnded);
        socket.on('chatMessage', onChatMessage);
        socket.on('error', onError);
        socket.on('playerLeft', onPlayerLeft);
        socket.on('playerRejoined', onPlayerRejoined);
        socket.on('playerDisconnected', onPlayerDisconnected);
        socket.on('avatarChanged', onAvatarChanged);
        socket.on('scoresUpdated', onScoresUpdated);
        socket.on('playerKicked', onPlayerKicked);
        socket.on('youWereKicked', onYouWereKicked);
        socket.on('drawerSkipped', onDrawerSkipped);
        socket.on('gameSync', onGameSync);
        socket.on('roomClosed', onRoomClosed);
        socket.on('removedForNoAvatar', onRemovedForNoAvatar);
        socket.on('playerAfkChanged', onPlayerAfkChanged);

        return () => {
            socket.off('roomCreated', onRoomCreated);
            socket.off('roomJoined', onRoomJoined);
            socket.off('playerJoined', onPlayerJoined);
            socket.off('gamesUpdated', onGamesUpdated);
            socket.off('gameStarting', onGameStarting);
            socket.off('nextRound', onNextRound);
            socket.off('gameEnded', onGameEnded);
            socket.off('chatMessage', onChatMessage);
            socket.off('error', onError);
            socket.off('playerLeft', onPlayerLeft);
            socket.off('playerRejoined', onPlayerRejoined);
            socket.off('playerDisconnected', onPlayerDisconnected);
            socket.off('avatarChanged', onAvatarChanged);
            socket.off('scoresUpdated', onScoresUpdated);
            socket.off('playerKicked', onPlayerKicked);
            socket.off('youWereKicked', onYouWereKicked);
            socket.off('drawerSkipped', onDrawerSkipped);
            socket.off('gameSync', onGameSync);
            socket.off('roomClosed', onRoomClosed);
            socket.off('removedForNoAvatar', onRemovedForNoAvatar);
            socket.off('playerAfkChanged', onPlayerAfkChanged);
        };
    }, []);

    // Track mobile portrait media query
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px) and (orientation: portrait)');
        const handler = (e) => setIsMobilePortrait(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    // Track AFK status based on visibility and page
    useEffect(() => {
        if (!currentRoom?.id) return;
        const roomId = currentRoom.id; // Capture for cleanup
        const isInRoom = page === 'room' || page === 'game';

        const handleVisibilityChange = () => {
            const isAfk = document.hidden || !isInRoom;
            socket.emit('setAfkStatus', { roomId, isAfk });
        };

        // Set initial AFK status
        const isAfk = document.hidden || !isInRoom;
        socket.emit('setAfkStatus', { roomId, isAfk });

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            // Emit AFK when leaving room/game pages (cleanup runs with captured values)
            if (isInRoom) {
                socket.emit('setAfkStatus', { roomId, isAfk: true });
            }
        };
    }, [currentRoom?.id, page]);

    // Auto-fill room code from URL parameter
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roomParam = params.get('room');
        if (roomParam) {
            setJoinRoomId(roomParam.toUpperCase());
            setShowJoinInput(true);
        }
    }, []);

    // Generate QR codes when room page is visible
    useEffect(() => {
        if (!currentRoom?.id || page !== 'room') return;
        const joinUrl = `${window.location.origin}/?room=${currentRoom.id}`;

        const timer = setTimeout(() => {
            if (qrSmallRef.current) {
                qrSmallRef.current.innerHTML = '';
                new QRCode(qrSmallRef.current, {
                    text: joinUrl,
                    width: 128,
                    height: 128,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.M
                });
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [currentRoom?.id, page]);

    // Generate large QR code when modal opens
    useEffect(() => {
        if (!qrExpanded || !currentRoom?.id) return;
        const joinUrl = `${window.location.origin}/?room=${currentRoom.id}`;

        const timer = setTimeout(() => {
            if (qrRef.current) {
                qrRef.current.innerHTML = '';
                new QRCode(qrRef.current, {
                    text: joinUrl,
                    width: 256,
                    height: 256,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.M
                });
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [qrExpanded, currentRoom?.id]);

    // --- Handler functions ---

    const handleCreateRoom = () => {
        if (roomName.trim() && playerName.trim()) {
            socket.emit('createRoom', { roomName, playerName });
        }
    };

    const handleJoinRoom = () => {
        if (joinRoomId.trim() && playerName.trim()) {
            socket.emit('joinRoom', { roomId: joinRoomId.toUpperCase(), playerName });
        }
    };

    const confirmAvatarSelection = () => {
        if (!selectedAvatar || selectedAvatar === 'meta') return;
        socket.emit('changeAvatar', { roomId: currentRoom.id, avatar: selectedAvatar });
        const wasInitial = avatarPickerMode === 'initial';
        setAvatarPickerMode(null);
        if (wasInitial && isMaster) {
            setShowMasterTips(true);
        }
    };

    const toggleGame = (gameId) => {
        socket.emit('toggleGame', { roomId: currentRoom.id, gameId });
        setSelectedGames(prev =>
            prev.includes(gameId)
                ? prev.filter(id => id !== gameId)
                : [...prev, gameId]
        );
    };

    const sendLobbyChat = () => {
        if (!lobbyChatInput.trim() || !currentRoom) return;
        socket.emit('chatMessage', { roomId: currentRoom.id, message: lobbyChatInput.trim() });
        setLobbyChatInput('');
    };

    const handleChatScroll = () => {
        const el = chatScrollRef.current;
        if (!el) return;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        setChatAutoScroll(atBottom);
        if (atBottom) setUnreadCount(0);
    };

    const scrollChatToBottom = () => {
        const el = chatScrollRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
            setChatAutoScroll(true);
        }
    };

    useEffect(() => {
        if (chatAutoScroll) {
            lobbyChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            modalChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [lobbyChatMessages, chatAutoScroll]);

    const startGame = () => {
        if (selectedGames.length > 0) {
            socket.emit('startGame', { roomId: currentRoom.id });
        }
    };

    // Avatar selection countdown
    useEffect(() => {
        if (avatarPickerMode !== 'initial') return;
        setAvatarTimerCount(30);
        const interval = setInterval(() => {
            setAvatarTimerCount(prev => prev <= 1 ? 0 : prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [avatarPickerMode]);

    // Kick player when timer reaches 0
    useEffect(() => {
        if (avatarTimerCount !== 0 || avatarPickerMode !== 'initial') return;
        setAvatarPickerMode(null);
        clearSession();
        setPage('landing');
        setCurrentRoom(null);
        setIsMaster(false);
        setSelectedAvatar('meta');
        setError('Kicked — you did not select an avatar in time');
        setTimeout(() => setError(''), 4000);
    }, [avatarTimerCount]);

    const goToLanding = () => {
        // NOTE: session is NOT cleared here so the user can rejoin via the
        // landing-page button. The future "Exit Room" button will call
        // clearSession() to fully leave.
        setPage('landing');
        setCurrentRoom(null);
        setIsMaster(false);
        setShowMenu(false);
        setShowCreateInput(false);
        setShowJoinInput(false);
        setSelectedGames([]);
        setAvatarPickerMode(null);
        setSelectedAvatar('meta');
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Leave room voluntarily (clears session)
    const handleLeaveRoom = () => {
        if (currentRoom?.id) {
            socket.emit('leaveRoom', { roomId: currentRoom.id });
        }
        clearSession();
        setCurrentRoom(null);
        setPage('landing');
        setIsMaster(false);
        setShowMenu(false);
        setShowCreateInput(false);
        setShowJoinInput(false);
        setSelectedGames([]);
        setAvatarPickerMode(null);
        setSelectedAvatar('meta');
        setLobbyChatMessages([]);
        setGameHistory([]);
    };

    // Navigation helper
    const navigateTo = useCallback((pageName) => {
        setShowMenu(false);
        setPage(pageName);
    }, []);

    // Auth functions
    const handleLogin = useCallback(async (email, password) => {
        setAuthError('');
        try {
            const response = await api.login(email, password);
            setTokens(response.accessToken, response.refreshToken);
            setUser(response.user);
            setIsLoggedIn(true);
            return response.user;
        } catch (err) {
            setAuthError(err.message);
            throw err;
        }
    }, []);

    const handleRegister = useCallback(async (name, email, password) => {
        setAuthError('');
        try {
            const response = await api.register(name, email, password);
            setTokens(response.accessToken, response.refreshToken);
            setUser(response.user);
            setIsLoggedIn(true);
            return response.user;
        } catch (err) {
            setAuthError(err.message);
            throw err;
        }
    }, []);

    const handleLogout = useCallback(async () => {
        try {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                await api.logout(refreshToken);
            }
        } catch (err) {
            // Ignore logout errors
        } finally {
            clearTokens();
            setUser(null);
            setIsLoggedIn(false);
            setFriends([]);
            setFriendsStatus({});
            setPendingRequests({ incoming: [], outgoing: [] });
            setPage('landing');
        }
    }, []);

    const handleGoogleLogin = useCallback(() => {
        window.location.href = '/api/auth/google';
    }, []);

    const handleDiscordLogin = useCallback(() => {
        window.location.href = '/api/auth/discord';
    }, []);

    const handleUpdateProfile = useCallback(async (updates) => {
        try {
            const updatedUser = await api.updateMe(updates);
            setUser(prev => ({ ...prev, ...updatedUser }));
            return updatedUser;
        } catch (err) {
            throw err;
        }
    }, []);

    const handleUpdateSettings = useCallback(async (settings) => {
        try {
            const updatedSettings = await api.updateSettings(settings);
            setUser(prev => ({
                ...prev,
                settings: { ...prev?.settings, ...updatedSettings }
            }));
            return updatedSettings;
        } catch (err) {
            throw err;
        }
    }, []);

    // Friends functions
    const fetchFriends = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            const friendsList = await api.getFriends();
            setFriends(friendsList);
        } catch (err) {
            console.error('Failed to fetch friends:', err);
        }
    }, [isLoggedIn]);

    const fetchPendingRequests = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            const pending = await api.getPendingRequests();
            setPendingRequests(pending);
        } catch (err) {
            console.error('Failed to fetch pending requests:', err);
        }
    }, [isLoggedIn]);

    const handleSendFriendRequest = useCallback(async (userId) => {
        await api.sendFriendRequest(userId);
        await fetchPendingRequests();
    }, [fetchPendingRequests]);

    const handleAcceptFriendRequest = useCallback(async (requestId) => {
        await api.acceptFriendRequest(requestId);
        await fetchFriends();
        await fetchPendingRequests();
    }, [fetchFriends, fetchPendingRequests]);

    const handleRejectFriendRequest = useCallback(async (requestId) => {
        await api.rejectFriendRequest(requestId);
        await fetchPendingRequests();
    }, [fetchPendingRequests]);

    const handleRemoveFriend = useCallback(async (friendId) => {
        await api.removeFriend(friendId);
        setFriends(prev => prev.filter(f => f.id !== friendId));
    }, []);

    const handleSearchUsers = useCallback(async (query) => {
        return await api.searchUsers(query);
    }, []);

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (!hasTokens()) {
                setAuthLoading(false);
                return;
            }

            try {
                const userData = await api.getMe();
                setUser(userData);
                setIsLoggedIn(true);
            } catch (err) {
                clearTokens();
                setUser(null);
                setIsLoggedIn(false);
            } finally {
                setAuthLoading(false);
            }
        };

        // Check for OAuth callback tokens in URL
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            setTokens(accessToken, refreshToken);
            window.history.replaceState({}, '', window.location.pathname);
        }

        checkAuth();
    }, []);

    // Fetch friends when logged in
    useEffect(() => {
        if (isLoggedIn) {
            fetchFriends();
            fetchPendingRequests();
        }
    }, [isLoggedIn, fetchFriends, fetchPendingRequests]);

    const handleRejoinFromLanding = () => {
        const session = loadSession();
        if (!session || !session.roomId) return;

        setPlayerName(session.playerName || 'Player');
        setSelectedAvatar(session.avatar || 'meta');
        setIsMaster(session.isMaster || false);
        setTheme(session.theme || 'tron');
        setPage('rejoining');

        socket.emit('rejoinRoom', {
            roomId: session.roomId,
            playerName: session.playerName,
            avatar: session.avatar
        });

        socket.once('rejoinSuccess', (room) => {
            setCurrentRoom(room);
            setSelectedGames(room.selectedGames || []);
            if (room.gameHistory) setGameHistory(room.gameHistory);
            // Verify isMaster from actual room data
            const isActuallyMaster = room.master === session.playerName;
            setIsMaster(isActuallyMaster);
            const targetPage = session.page === 'game' ? 'game' : 'room';
            setPage(targetPage);
            console.log(`Rejoined from landing: ${session.playerName}, isMaster: ${isActuallyMaster}`);
        });

        socket.once('rejoinFailed', (data) => {
            clearSession();
            setPendingSession(null);  // Clear pending session to hide rejoin button
            setPage('landing');
            setIsMaster(false);
            setError(data.message || 'Room no longer available');
            setTimeout(() => setError(''), 4000);
        });
    };

    const handleDismissSession = useCallback(() => {
        const session = loadSession();
        if (session && session.roomId) {
            // Notify server that user is leaving
            socket.emit('leaveRoom', { roomId: session.roomId });
        }
        clearSession();
        setPendingSession(null);  // Clear the pending session state to hide rejoin button
        setCurrentRoom(null);
        setIsMaster(false);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === 'tron') return 'kids';
            if (prev === 'kids') return 'scary';
            return 'tron';
        });
    };

    // Global music playback function
    const playMusic = useCallback(() => {
        if (audioRef.current && !isMuted) {
            audioRef.current.play().catch(err => console.log('Music play failed:', err));
        }
    }, [isMuted]);

    // Handle track changes - play new track if music was already started
    useEffect(() => {
        if (musicStarted && audioRef.current && !isMuted) {
            // Wait for the audio to be ready after src change, then play
            const audio = audioRef.current;
            const handleCanPlay = () => {
                audio.play().catch(err => console.log('Music play failed:', err));
                audio.removeEventListener('canplay', handleCanPlay);
            };
            audio.addEventListener('canplay', handleCanPlay);
            return () => audio.removeEventListener('canplay', handleCanPlay);
        }
    }, [selectedTrack]);

    // Shared props for Header
    const headerProps = {
        theme, currentTheme, page, showMenu, setShowMenu, isMuted, setIsMuted,
        setTheme, goToLanding, devToast,
        // Music control
        musicStarted,
        selectedTrack,
        onSelectTrack: setSelectedTrack,
        onStartMusic: () => {
            playMusic();
            setMusicStarted(true);
        },
        // Auth props
        isLoggedIn,
        currentUser: user,
        navigateTo,
        handleLogout
    };

    // --- Page Rendering ---

    // Helper to render page content
    const renderPageContent = () => {
        // Login page
        if (page === 'login') {
            return (
                <>
                    <Header {...headerProps} />
                    <LoginPage
                    theme={theme}
                    currentTheme={currentTheme}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    onGoogleLogin={handleGoogleLogin}
                    onDiscordLogin={handleDiscordLogin}
                    navigateTo={navigateTo}
                    error={authError}
                />
            </>
        );
    }

    // Profile page (requires login)
    if (page === 'profile') {
        return (
            <>
                <Header {...headerProps} />
                <ProfilePage
                    theme={theme}
                    currentTheme={currentTheme}
                    user={user}
                    navigateTo={navigateTo}
                    availableCharacters={availableCharacters}
                />
            </>
        );
    }

    // Edit Profile page (requires login)
    if (page === 'editProfile') {
        return (
            <>
                <Header {...headerProps} />
                <EditProfilePage
                    theme={theme}
                    currentTheme={currentTheme}
                    user={user}
                    onSave={handleUpdateProfile}
                    navigateTo={navigateTo}
                    availableCharacters={availableCharacters}
                />
            </>
        );
    }

    // Friends page (requires login)
    if (page === 'friends') {
        return (
            <>
                <Header {...headerProps} />
                <FriendsPage
                    theme={theme}
                    currentTheme={currentTheme}
                    user={user}
                    friends={friends}
                    friendsStatus={friendsStatus}
                    pendingRequests={pendingRequests}
                    onSendRequest={handleSendFriendRequest}
                    onAcceptRequest={handleAcceptFriendRequest}
                    onRejectRequest={handleRejectFriendRequest}
                    onRemoveFriend={handleRemoveFriend}
                    onSearchUsers={handleSearchUsers}
                    navigateTo={navigateTo}
                    availableCharacters={availableCharacters}
                />
            </>
        );
    }

    // Settings page (requires login)
    if (page === 'settings') {
        return (
            <>
                <Header {...headerProps} />
                <SettingsPage
                    theme={theme}
                    currentTheme={currentTheme}
                    user={user}
                    onSaveSettings={handleUpdateSettings}
                    navigateTo={navigateTo}
                />
            </>
        );
    }

    // Help page
    if (page === 'help') {
        return (
            <>
                <Header {...headerProps} />
                <HelpPage
                    theme={theme}
                    currentTheme={currentTheme}
                    navigateTo={navigateTo}
                />
            </>
        );
    }

    if (page === 'rejoining') {
        return (
            <RejoiningPage
                theme={theme}
                currentTheme={currentTheme}
                DaftPunkRobotHead={DaftPunkRobotHead}
                DaftPunkHelmet={DaftPunkHelmet}
                WerewolfHowlingIcon={WerewolfHowlingIcon}
                onTimeout={() => {
                    // Redirect to landing page after timeout
                    setCurrentRoom(null);
                    setPage('landing');
                }}
            />
        );
    }

    if (page === 'landing') {
        return (
            <>
                <Header {...headerProps} />
                <LandingPage
                    theme={theme}
                    currentTheme={currentTheme}
                    pendingSession={pendingSession}
                    handleRejoinFromLanding={handleRejoinFromLanding}
                    handleDismissSession={handleDismissSession}
                    roomName={roomName}
                    setRoomName={setRoomName}
                    joinRoomId={joinRoomId}
                    setJoinRoomId={setJoinRoomId}
                    playerName={playerName}
                    setPlayerName={setPlayerName}
                    showCreateInput={showCreateInput}
                    setShowCreateInput={setShowCreateInput}
                    showJoinInput={showJoinInput}
                    setShowJoinInput={setShowJoinInput}
                    error={error}
                    handleCreateRoom={handleCreateRoom}
                    handleJoinRoom={handleJoinRoom}
                    setCurrentRoom={setCurrentRoom}
                    setIsMaster={setIsMaster}
                    setSelectedAvatar={setSelectedAvatar}
                    setSelectedGames={setSelectedGames}
                    setPage={setPage}
                    MOCK_GAMES={MOCK_GAMES}
                    getGameIcon={getGameIcon}
                    StarRating={StarRating}
                    minAge={minAge}
                    maxAge={maxAge}
                    setMinAge={setMinAge}
                    setMaxAge={setMaxAge}
                    minPlayers={minPlayers}
                    maxPlayers={maxPlayers}
                    setMinPlayers={setMinPlayers}
                    setMaxPlayers={setMaxPlayers}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    setSelectedGameDesc={setSelectedGameDesc}
                    Crown={Crown}
                    Users={Users}
                    DaftPunkRobotHead={DaftPunkRobotHead}
                    DaftPunkHelmet={DaftPunkHelmet}
                    WerewolfHowlingIcon={WerewolfHowlingIcon}
                    availableCharacters={availableCharacters}
                    rarityConfig={rarityConfig}
                />
                {selectedGameDesc && (
                    <GameDescription
                        theme={theme}
                        currentTheme={currentTheme}
                        selectedGameDesc={selectedGameDesc}
                        setSelectedGameDesc={setSelectedGameDesc}
                        getGameIcon={getGameIcon}
                        StarRating={StarRating}
                    />
                )}
            </>
        );
    }

    if (page === 'countdown') {
        return (
            <>
                <Header {...headerProps} />
                <CountdownPage
                    theme={theme}
                    currentTheme={currentTheme}
                    countdown={countdown}
                />
            </>
        );
    }

    if (page === 'game') {
        return (
            <>
                <Header {...headerProps} />
                <GamePage
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
                    gameType={gameType}
                />
            </>
        );
    }

    // Room page (default when page === 'room')
    return (
        <>
            <Header {...headerProps} />
            <RoomPage
                theme={theme}
                currentTheme={currentTheme}
                currentRoom={currentRoom}
                playerName={playerName}
                isMaster={isMaster}
                selectedGames={selectedGames}
                selectedAvatar={selectedAvatar}
                availableCharacters={availableCharacters}
                setShowGameSelector={setShowGameSelector}
                showGameSelector={showGameSelector}
                toggleGame={toggleGame}
                setQrExpanded={setQrExpanded}
                avatarPickerMode={avatarPickerMode}
                setAvatarPickerMode={setAvatarPickerMode}
                setSelectedAvatar={setSelectedAvatar}
                setShowMasterTips={setShowMasterTips}
                setCharacterInfoModal={setCharacterInfoModal}
                takenCharacters={takenCharacters}
                confirmAvatarSelection={confirmAvatarSelection}
                avatarTimerCount={avatarTimerCount}
                avatarTakenToast={avatarTakenToast}
                setAvatarTakenToast={setAvatarTakenToast}
                startGame={startGame}
                selectorMinPlayers={selectorMinPlayers}
                setSelectorMinPlayers={setSelectorMinPlayers}
                selectorMaxPlayers={selectorMaxPlayers}
                setSelectorMaxPlayers={setSelectorMaxPlayers}
                selectorMinAge={selectorMinAge}
                setSelectorMinAge={setSelectorMinAge}
                selectorMaxAge={selectorMaxAge}
                setSelectorMaxAge={setSelectorMaxAge}
                selectorSortBy={selectorSortBy}
                setSelectorSortBy={setSelectorSortBy}
                selectedGameInfo={selectedGameInfo}
                setSelectedGameInfo={setSelectedGameInfo}
                selectedGameDesc={selectedGameDesc}
                setSelectedGameDesc={setSelectedGameDesc}
                characterInfoModal={characterInfoModal}
                setPlayerProfileModal={setPlayerProfileModal}
                showMasterTips={showMasterTips}
                isMuted={isMuted}
                handleLeaveRoom={handleLeaveRoom}
                lobbyChatMessages={lobbyChatMessages}
                lobbyChatInput={lobbyChatInput}
                setLobbyChatInput={setLobbyChatInput}
                sendLobbyChat={sendLobbyChat}
                handleChatScroll={handleChatScroll}
                chatAutoScroll={chatAutoScroll}
                scrollChatToBottom={scrollChatToBottom}
                unreadCount={unreadCount}
                setUnreadCount={setUnreadCount}
                showChatModal={showChatModal}
                setShowChatModal={setShowChatModal}
                isMobilePortrait={isMobilePortrait}
                lobbyChatEndRef={lobbyChatEndRef}
                modalChatEndRef={modalChatEndRef}
                chatScrollRef={chatScrollRef}
                modalChatScrollRef={modalChatScrollRef}
                qrSmallRef={qrSmallRef}
                MOCK_GAMES={MOCK_GAMES}
                getGameIcon={getGameIcon}
                StarRating={StarRating}
                CharacterSVG={CharacterSVG}
                Crown={Crown}
                completedGames={completedGames}
                setCompletedGames={setCompletedGames}
                accumulatedScores={accumulatedScores}
            />

            {/* Modals */}
            {showGameSelector && (
                <GameSelector
                    theme={theme}
                    currentTheme={currentTheme}
                    MOCK_GAMES={MOCK_GAMES}
                    selectedGames={selectedGames}
                    toggleGame={toggleGame}
                    selectorMinAge={selectorMinAge}
                    setSelectorMinAge={setSelectorMinAge}
                    selectorMaxAge={selectorMaxAge}
                    setSelectorMaxAge={setSelectorMaxAge}
                    selectorMinPlayers={selectorMinPlayers}
                    setSelectorMinPlayers={setSelectorMinPlayers}
                    selectorMaxPlayers={selectorMaxPlayers}
                    setSelectorMaxPlayers={setSelectorMaxPlayers}
                    selectorSortBy={selectorSortBy}
                    setSelectorSortBy={setSelectorSortBy}
                    setShowGameSelector={setShowGameSelector}
                    setSelectedGameDesc={setSelectedGameDesc}
                    getGameIcon={getGameIcon}
                    StarRating={StarRating}
                    isMaster={isMaster}
                />
            )}

            {selectedGameDesc && (
                <GameDescription
                    theme={theme}
                    currentTheme={currentTheme}
                    selectedGameDesc={selectedGameDesc}
                    setSelectedGameDesc={setSelectedGameDesc}
                    getGameIcon={getGameIcon}
                    StarRating={StarRating}
                />
            )}

            {avatarPickerMode && (
                <AvatarPicker
                    theme={theme}
                    currentTheme={currentTheme}
                    avatarPickerMode={avatarPickerMode}
                    setAvatarPickerMode={setAvatarPickerMode}
                    selectedAvatar={selectedAvatar}
                    setSelectedAvatar={setSelectedAvatar}
                    availableCharacters={availableCharacters}
                    takenCharacters={takenCharacters}
                    avatarTimerCount={avatarTimerCount}
                    confirmAvatarSelection={confirmAvatarSelection}
                    setCharacterInfoModal={setCharacterInfoModal}
                    rarityConfig={rarityConfig}
                    CharacterSVG={CharacterSVG}
                    currentRoom={currentRoom}
                    playerName={playerName}
                    avatarTakenToast={avatarTakenToast}
                    setAvatarTakenToast={setAvatarTakenToast}
                />
            )}

            {playerProfileModal && (
                <PlayerProfile
                    theme={theme}
                    currentTheme={currentTheme}
                    playerProfileModal={playerProfileModal}
                    setPlayerProfileModal={setPlayerProfileModal}
                    gameHistory={gameHistory}
                />
            )}

            {characterInfoModal && (
                <CharacterInfo
                    theme={theme}
                    currentTheme={currentTheme}
                    characterInfoModal={characterInfoModal}
                    setCharacterInfoModal={setCharacterInfoModal}
                    rarityConfig={rarityConfig}
                    CharacterSVG={CharacterSVG}
                />
            )}

            {showMasterTips && (
                <MasterTips
                    theme={theme}
                    currentTheme={currentTheme}
                    setShowMasterTips={setShowMasterTips}
                />
            )}

            {qrExpanded && (
                <QRModal
                    theme={theme}
                    currentTheme={currentTheme}
                    qrExpanded={qrExpanded}
                    setQrExpanded={setQrExpanded}
                    qrRef={qrRef}
                    currentRoom={currentRoom}
                />
            )}
        </>
    );
    };

    // Main render with global audio element
    return (
        <>
            {/* Global background music - always present */}
            <audio
                ref={audioRef}
                loop
                src={selectedTrack?.file || '/assets/music/Audiopanther - Waves.mp3'}
                muted={isMuted}
            />
            {renderPageContent()}
        </>
    );
}

export default App;
