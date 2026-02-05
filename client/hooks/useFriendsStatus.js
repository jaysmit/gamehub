import { useState, useEffect, useCallback, useRef } from 'react';
import { socket } from '../socket';
import { api } from '../utils/api';

export function useFriendsStatus(userId, isLoggedIn) {
  const [friends, setFriends] = useState([]);
  const [friendsStatus, setFriendsStatus] = useState({});
  const [pendingRequests, setPendingRequests] = useState({ incoming: [], outgoing: [] });
  const [isLoading, setIsLoading] = useState(false);
  const friendIdsRef = useRef([]);

  // Fetch friends list
  const fetchFriends = useCallback(async () => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    try {
      const friendsList = await api.getFriends();
      setFriends(friendsList);
      friendIdsRef.current = friendsList.map(f => f.id);

      // Request status of all friends
      if (friendsList.length > 0) {
        socket.emit('getFriendsStatus', { friendIds: friendIdsRef.current });
      }
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  // Fetch pending requests
  const fetchPendingRequests = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const pending = await api.getPendingRequests();
      setPendingRequests(pending);
    } catch (err) {
      console.error('Failed to fetch pending requests:', err);
    }
  }, [isLoggedIn]);

  // Initialize - fetch friends and set up socket events
  useEffect(() => {
    if (!isLoggedIn || !userId) return;

    // Fetch initial data
    fetchFriends();
    fetchPendingRequests();

    // Register as online with friend list
    const registerOnline = () => {
      socket.emit('userOnline', {
        userId,
        friendIds: friendIdsRef.current
      });
    };

    // Initial registration when friends are loaded
    if (socket.connected) {
      registerOnline();
    }

    socket.on('connect', registerOnline);

    // Socket event handlers
    const handleFriendOnline = ({ userId: friendId, status }) => {
      setFriendsStatus(prev => ({
        ...prev,
        [friendId]: { status, roomId: null }
      }));
    };

    const handleFriendOffline = ({ userId: friendId }) => {
      setFriendsStatus(prev => ({
        ...prev,
        [friendId]: { status: 'offline', roomId: null }
      }));
    };

    const handleFriendStatusChanged = ({ userId: friendId, status, roomId }) => {
      setFriendsStatus(prev => ({
        ...prev,
        [friendId]: { status, roomId }
      }));
    };

    const handleFriendsStatus = (statuses) => {
      setFriendsStatus(prev => ({ ...prev, ...statuses }));
    };

    socket.on('friendOnline', handleFriendOnline);
    socket.on('friendOffline', handleFriendOffline);
    socket.on('friendStatusChanged', handleFriendStatusChanged);
    socket.on('friendsStatus', handleFriendsStatus);

    return () => {
      socket.off('connect', registerOnline);
      socket.off('friendOnline', handleFriendOnline);
      socket.off('friendOffline', handleFriendOffline);
      socket.off('friendStatusChanged', handleFriendStatusChanged);
      socket.off('friendsStatus', handleFriendsStatus);
    };
  }, [isLoggedIn, userId, fetchFriends, fetchPendingRequests]);

  // Send friend request
  const sendFriendRequest = useCallback(async (targetUserId) => {
    try {
      await api.sendFriendRequest(targetUserId);
      await fetchPendingRequests();
      return true;
    } catch (err) {
      throw err;
    }
  }, [fetchPendingRequests]);

  // Accept friend request
  const acceptFriendRequest = useCallback(async (requestId) => {
    try {
      await api.acceptFriendRequest(requestId);
      await fetchFriends();
      await fetchPendingRequests();
      return true;
    } catch (err) {
      throw err;
    }
  }, [fetchFriends, fetchPendingRequests]);

  // Reject friend request
  const rejectFriendRequest = useCallback(async (requestId) => {
    try {
      await api.rejectFriendRequest(requestId);
      await fetchPendingRequests();
      return true;
    } catch (err) {
      throw err;
    }
  }, [fetchPendingRequests]);

  // Remove friend
  const removeFriend = useCallback(async (friendId) => {
    try {
      await api.removeFriend(friendId);
      setFriends(prev => prev.filter(f => f.id !== friendId));
      setFriendsStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[friendId];
        return newStatus;
      });
      return true;
    } catch (err) {
      throw err;
    }
  }, []);

  // Update user's room status
  const updateRoomStatus = useCallback((roomId) => {
    if (!userId) return;
    socket.emit('userInRoom', { userId, roomId });
  }, [userId]);

  // Update user's game status
  const updateGameStatus = useCallback((roomId) => {
    if (!userId) return;
    socket.emit('userInGame', { userId, roomId });
  }, [userId]);

  // Get friend with status
  const getFriendsWithStatus = useCallback(() => {
    return friends.map(friend => ({
      ...friend,
      ...friendsStatus[friend.id] || { status: 'offline', roomId: null }
    }));
  }, [friends, friendsStatus]);

  return {
    friends,
    friendsStatus,
    pendingRequests,
    isLoading,
    fetchFriends,
    fetchPendingRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    updateRoomStatus,
    updateGameStatus,
    getFriendsWithStatus
  };
}

export default useFriendsStatus;
