import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../useStore';
import KOTHAI from './KOTHAI';
import { RACE_ORDER } from '../character-select/raceConfig';
import { PYRAMID_DIMENSIONS } from './KOTHLevel';

// Get a random race
const getRandomRace = () => RACE_ORDER[Math.floor(Math.random() * RACE_ORDER.length)];

// Generate spawn positions around the pyramid base
const generateSpawnPositions = (count) => {
  const positions = [];
  // Spawn well outside pyramid base (75m half-base + 20m buffer)
  const minRadius = PYRAMID_DIMENSIONS.base / 2 + 20;
  const maxRadius = PYRAMID_DIMENSIONS.base / 2 + 40;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    positions.push({ x, z });
  }

  return positions;
};

// Generate AI character configs
const generateKOTHAIs = (count) => {
  const positions = generateSpawnPositions(count);
  const ais = [];

  for (let i = 0; i < count; i++) {
    const pos = positions[i];
    ais.push({
      id: `koth_ai_${i}`,
      position: [pos.x, 0, pos.z],
      rotation: Math.random() * Math.PI * 2,
      race: getRandomRace(),
      isAlive: true,
      score: 0,
    });
  }

  return ais;
};

export default function KOTHGame() {
  const gameMode = useStore((s) => s.gameMode);
  const koth = useStore((s) => s.koth);
  const setKOTHState = useStore((s) => s.setKOTHState);
  const kothAIs = useStore((s) => s.kothAIs);
  const setKOTHAIs = useStore((s) => s.setKOTHAIs);
  const setCharacterPosition = useStore((s) => s.setCharacterPosition);
  const characterPosition = useStore((s) => s.characterPosition);

  const gameTimerRef = useRef(0);
  const countdownTimerRef = useRef(0);
  const hasSpawnedAIs = useRef(false);
  const scoreTimerRef = useRef(0);

  // Reset spawn flag when phase goes back to 'waiting'
  useEffect(() => {
    if (koth.phase === 'waiting') {
      hasSpawnedAIs.current = false;
      gameTimerRef.current = 0;
      countdownTimerRef.current = 0;
      scoreTimerRef.current = 0;
    }
  }, [koth.phase]);

  // Spawn AIs when countdown phase begins
  useEffect(() => {
    if (gameMode === 'koth' && koth.phase === 'countdown' && !hasSpawnedAIs.current) {
      hasSpawnedAIs.current = true;

      // Generate AI characters
      const ais = generateKOTHAIs(koth.aiCount);
      setKOTHAIs(ais);

      // Teleport player to spawn position (well outside pyramid)
      const playerAngle = Math.random() * Math.PI * 2;
      const spawnRadius = PYRAMID_DIMENSIONS.base / 2 + 25; // 75 + 25 = 100m from center
      const playerX = Math.cos(playerAngle) * spawnRadius;
      const playerZ = Math.sin(playerAngle) * spawnRadius;

      setCharacterPosition({ x: playerX, y: 0, z: playerZ });
      window.dispatchEvent(
        new CustomEvent('koth-teleport-player', {
          detail: { x: playerX, y: 0, z: playerZ },
        })
      );
    }

    // Reset spawn flag when leaving KOTH mode
    if (gameMode !== 'koth') {
      hasSpawnedAIs.current = false;
    }
  }, [gameMode, koth.phase, koth.aiCount, setKOTHAIs, setCharacterPosition]);

  // Handle space key to start/restart game
  useEffect(() => {
    const handleKeyDown = (e) => {
      const state = useStore.getState();
      if (state.gameMode !== 'koth') return;

      if (e.key === ' ') {
        if (state.koth.phase === 'waiting') {
          e.preventDefault();
          e.stopPropagation();
          state.setKOTHState({ phase: 'countdown', countdownValue: 3 });
          countdownTimerRef.current = 0;
        } else if (state.koth.phase === 'ended') {
          e.preventDefault();
          e.stopPropagation();
          // Reset and go back to waiting
          state.resetKOTH();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game loop
  useFrame((state, delta) => {
    if (gameMode !== 'koth') return;

    const { phase, gameDuration } = koth;

    // Handle countdown phase
    if (phase === 'countdown') {
      countdownTimerRef.current += delta;

      if (countdownTimerRef.current >= 1) {
        countdownTimerRef.current = 0;
        const newValue = koth.countdownValue - 1;

        if (newValue < 0) {
          // Countdown finished, start game!
          setKOTHState({
            phase: 'playing',
            countdownValue: 0,
            score: 0,
          });
          gameTimerRef.current = 0;
          scoreTimerRef.current = 0;
        } else {
          setKOTHState({ countdownValue: newValue });
        }
      }
      return;
    }

    // Handle playing phase
    if (phase === 'playing') {
      // Update game timer
      gameTimerRef.current += delta;
      scoreTimerRef.current += delta;

      // Get player height (Y position)
      const playerHeight = Math.max(0, characterPosition.y);

      // Update score every 0.1 seconds based on height
      if (scoreTimerRef.current >= 0.1) {
        const pointsPerSecond = Math.max(1, Math.floor(playerHeight));
        const pointsEarned = pointsPerSecond * scoreTimerRef.current;
        scoreTimerRef.current = 0;

        setKOTHState({
          gameTimer: gameTimerRef.current,
          playerHeight,
          score: koth.score + pointsEarned,
        });
      } else {
        setKOTHState({
          gameTimer: gameTimerRef.current,
          playerHeight,
        });
      }

      // Check win condition - time's up
      if (gameTimerRef.current >= gameDuration) {
        setKOTHState({
          phase: 'ended',
        });
      }
    }
  });

  // Only render AI characters when game is active
  if (gameMode !== 'koth' || !koth.isActive) return null;

  return (
    <>
      {kothAIs.map((ai) => (
        <KOTHAI key={ai.id} config={ai} />
      ))}
    </>
  );
}
