import { io } from 'socket.io-client';

export const socket = io();

// Clock offset for synchronizing with server time
// Positive = server clock is ahead of client, negative = server clock is behind
let clockOffset = 0;
let syncComplete = false;

// Calculate the offset between server and client clocks
// Uses multiple samples and takes the median for accuracy
const syncClock = () => {
    const samples = [];
    let sampleCount = 0;
    const maxSamples = 5;

    const takeSample = () => {
        const clientSendTime = Date.now();
        socket.emit('requestServerTime', { clientSendTime });
    };

    const handleServerTime = (data) => {
        const clientReceiveTime = Date.now();
        const roundTripTime = clientReceiveTime - data.clientSendTime;
        // Estimate server time at the moment we received the response
        // (server time + half the round trip time)
        const estimatedServerTime = data.serverTime + (roundTripTime / 2);
        const offset = estimatedServerTime - clientReceiveTime;
        samples.push(offset);
        sampleCount++;

        if (sampleCount < maxSamples) {
            // Take another sample after a short delay
            setTimeout(takeSample, 100);
        } else {
            // Calculate median offset from samples
            samples.sort((a, b) => a - b);
            const medianIndex = Math.floor(samples.length / 2);
            clockOffset = samples.length % 2 === 0
                ? (samples[medianIndex - 1] + samples[medianIndex]) / 2
                : samples[medianIndex];
            syncComplete = true;
            socket.off('serverTime', handleServerTime);
            console.log(`[Clock Sync] Offset: ${clockOffset.toFixed(0)}ms (${clockOffset > 0 ? 'server ahead' : 'client ahead'})`);
        }
    };

    socket.on('serverTime', handleServerTime);
    takeSample();
};

// Start clock sync when connected
socket.on('connect', () => {
    syncClock();
});

// Re-sync on reconnect
socket.on('reconnect', () => {
    syncComplete = false;
    syncClock();
});

// Get the current server time (adjusted for clock offset)
export const getServerTime = () => {
    return Date.now() + clockOffset;
};

// Get the clock offset value
export const getClockOffset = () => clockOffset;

// Check if clock sync is complete
export const isClockSynced = () => syncComplete;
