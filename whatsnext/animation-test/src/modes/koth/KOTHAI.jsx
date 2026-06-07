import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { useStore } from '../../useStore';
import { RACES } from '../character-select/raceConfig';
import { PYRAMID_DIMENSIONS } from './KOTHLevel';

const MODEL_PATH = '/UAL1_Standard.glb';
const PUNCH_RANGE = 4; // Same as player punch range

export default function KOTHAI({ config }) {
  const groupRef = useRef();
  const modelRef = useRef();
  const position = useRef({ x: config.position[0], y: config.position[1], z: config.position[2] });
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const rotation = useRef(config.rotation || 0);
  const currentAnim = useRef('Idle_Loop');
  const targetPosition = useRef(null);
  const actionTimer = useRef(0);
  const isCharging = useRef(false);
  const chargeStartTime = useRef(0);
  const knockback = useRef(null);

  const { scene, animations } = useGLTF(MODEL_PATH);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, mixer } = useAnimations(animations, modelRef);

  const koth = useStore((s) => s.koth);
  const updateKOTHAI = useStore((s) => s.updateKOTHAI);
  const characterPosition = useStore((s) => s.characterPosition);
  const applyPlayerKnockback = useStore((s) => s.applyPlayerKnockback);

  const race = RACES[config.race] || RACES.human;

  // Apply race color
  useEffect(() => {
    if (!clonedScene) return;

    const targetColor = new THREE.Color(race.color);

    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.color.lerp(targetColor, 0.6);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene, race.color]);

  // Apply scale based on race
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(race.width, race.height, race.width);
    }
  }, [race.width, race.height]);

  // Play animation
  const playAnimation = (name, crossFade = 0.15) => {
    if (!actions || !actions[name] || currentAnim.current === name) return;

    Object.values(actions).forEach((action) => {
      if (action) action.fadeOut(crossFade);
    });

    const action = actions[name];
    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);

    // Animation speed based on race height
    const heightSpeedMultiplier = race.height >= 1
      ? 1 / race.height
      : race.height === 0.65 ? 0.9
      : 1 / (race.height + (1 - race.height) * 1.7 * race.height * race.height);

    const baseSpeed = name === 'Walk_Loop' ? 2.5 : 1.0;
    action.timeScale = baseSpeed * heightSpeedMultiplier;
    action.fadeIn(crossFade).play();
    currentAnim.current = name;
  };

  // Start idle animation
  useEffect(() => {
    if (actions && actions['Idle_Loop']) {
      const action = actions['Idle_Loop'];
      action.reset();
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.play();
    }
  }, [actions]);

  // Listen for knockback events from player's Haymaker
  useEffect(() => {
    const handleKnockback = (e) => {
      if (e.detail.targetId !== config.id) return;

      const { directionX, directionZ, distance } = e.detail;

      // Apply knockback
      knockback.current = {
        dirX: directionX,
        dirZ: directionZ,
        remaining: distance,
        speed: 25, // Fast knockback speed
      };

      // Cancel any charging
      isCharging.current = false;

      // Play hit animation briefly
      playAnimation('Jump_Loop');
    };

    window.addEventListener('koth-ai-knockback', handleKnockback);
    return () => window.removeEventListener('koth-ai-knockback', handleKnockback);
  }, [config.id]);

  // Pick a target position on the pyramid (always try to go higher)
  const pickClimbTarget = () => {
    const currentHeight = position.current.y;
    const targetHeight = Math.min(currentHeight + 10, PYRAMID_DIMENSIONS.height - 5);

    // Calculate pyramid size at target height using correct formula
    const layer = Math.floor(targetHeight / PYRAMID_DIMENSIONS.blockHeight);
    const stepIn = PYRAMID_DIMENSIONS.blockStepIn || 2.4;
    const layerSize = PYRAMID_DIMENSIONS.base - (layer * stepIn * 2);
    const halfSize = Math.max(5, layerSize / 2 - 5);

    // Pick random position on that layer
    targetPosition.current = {
      x: (Math.random() - 0.5) * halfSize * 2,
      z: (Math.random() - 0.5) * halfSize * 2,
      y: targetHeight,
    };
  };

  // Game loop
  useFrame((state, delta) => {
    if (!groupRef.current || !modelRef.current) return;
    if (koth.phase !== 'playing') {
      playAnimation('Idle_Loop');
      return;
    }

    const baseSpeed = 6;
    const jumpForce = 10;
    const gravity = -25;

    // Handle knockback
    if (knockback.current) {
      const kb = knockback.current;
      const kbSpeed = kb.speed * delta;
      position.current.x += kb.dirX * kbSpeed;
      position.current.z += kb.dirZ * kbSpeed;
      kb.remaining -= kbSpeed;

      if (kb.remaining <= 0) {
        knockback.current = null;
      }
    }

    // Action timer for varied behavior
    actionTimer.current -= delta;

    // Pick new target periodically or if no target
    if (actionTimer.current <= 0 || !targetPosition.current) {
      pickClimbTarget();
      actionTimer.current = 2 + Math.random() * 3;

      // Occasionally try to attack nearby player
      const dx = characterPosition.x - position.current.x;
      const dy = characterPosition.y - position.current.y;
      const dz = characterPosition.z - position.current.z;
      const distToPlayer = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distToPlayer < 15 && Math.random() < 0.3) {
        // Target the player instead
        targetPosition.current = {
          x: characterPosition.x,
          y: characterPosition.y,
          z: characterPosition.z,
        };
      }
    }

    // Check if close to player and should punch
    const playerDx = characterPosition.x - position.current.x;
    const playerDy = characterPosition.y - position.current.y;
    const playerDz = characterPosition.z - position.current.z;
    const distToPlayer = Math.sqrt(playerDx * playerDx + playerDy * playerDy + playerDz * playerDz);

    if (distToPlayer < PUNCH_RANGE && !isCharging.current && Math.random() < 0.02) {
      // Start charging a punch
      isCharging.current = true;
      chargeStartTime.current = Date.now();
      playAnimation('Spell_Simple_Idle_Loop');
    }

    // Handle charging
    if (isCharging.current) {
      const chargeTime = (Date.now() - chargeStartTime.current) / 1000;

      // Release punch after 0.5-2 seconds of charging
      if (chargeTime > 0.5 + Math.random() * 1.5) {
        isCharging.current = false;
        playAnimation('Sword_Attack');

        // Check if player is still in range
        if (distToPlayer < PUNCH_RANGE + (chargeTime / 3) * 2) {
          // Apply knockback to player
          const knockbackPower = 3 + chargeTime * 4; // Min 3, max ~15 at 3s charge
          const dirLen = Math.sqrt(playerDx * playerDx + playerDz * playerDz) || 1;
          applyPlayerKnockback(
            -playerDx / dirLen, // Push away from AI
            -playerDz / dirLen,
            knockbackPower,
            3.0
          );
        }

        actionTimer.current = 1; // Brief pause after attacking
        return;
      }

      // Don't move while charging
      groupRef.current.position.set(position.current.x, position.current.y, position.current.z);
      return;
    }

    // Move towards target
    if (targetPosition.current) {
      const moveX = targetPosition.current.x - position.current.x;
      const moveZ = targetPosition.current.z - position.current.z;
      const moveDist = Math.sqrt(moveX * moveX + moveZ * moveZ);

      if (moveDist > 1) {
        const normalizedX = moveX / moveDist;
        const normalizedZ = moveZ / moveDist;

        velocity.current.x = normalizedX * baseSpeed;
        velocity.current.z = normalizedZ * baseSpeed;

        // Update rotation to face movement direction
        rotation.current = Math.atan2(normalizedX, normalizedZ);

        // Jump if trying to go up and hitting an edge
        const targetY = targetPosition.current.y || 0;
        if (targetY > position.current.y + 0.5 && position.current.y >= 0 && velocity.current.y <= 0) {
          // Check if on ground (approximately)
          velocity.current.y = jumpForce;
        }

        playAnimation('Sprint_Loop');
      } else {
        velocity.current.x = 0;
        velocity.current.z = 0;

        // Jump to reach higher target
        if (targetPosition.current.y > position.current.y + 1 && velocity.current.y <= 0) {
          velocity.current.y = jumpForce;
        } else {
          playAnimation('Idle_Loop');
        }
      }
    }

    // Apply gravity
    velocity.current.y += gravity * delta;

    // Update position
    position.current.x += velocity.current.x * delta;
    position.current.y += velocity.current.y * delta;
    position.current.z += velocity.current.z * delta;

    // Pyramid collision - similar to player collision
    const stepIn = PYRAMID_DIMENSIONS.blockStepIn || 2.4;
    const maxLayers = Math.floor(PYRAMID_DIMENSIONS.height / PYRAMID_DIMENSIONS.blockHeight);
    const blockHeight = PYRAMID_DIMENSIONS.blockHeight;
    const stepHeight = 1.6; // Max height AI can step up (slightly more than block height to land on steps)

    let groundLevel = 0;

    // Check each pyramid layer for collision
    for (let layer = 0; layer < maxLayers; layer++) {
      const layerSize = PYRAMID_DIMENSIONS.base - (layer * stepIn * 2);
      if (layerSize <= 0) break;

      const halfSize = layerSize / 2;
      const layerBottom = layer * blockHeight;
      const layerTop = (layer + 1) * blockHeight;

      // Check if AI is within this layer's XZ bounds
      const inX = Math.abs(position.current.x) < halfSize;
      const inZ = Math.abs(position.current.z) < halfSize;

      if (inX && inZ) {
        // AI is over this layer - check if they can land on it
        // Can land if: coming from above OR already at this level
        if (position.current.y >= layerTop - stepHeight) {
          // Can land on this layer
          if (layerTop > groundLevel) {
            groundLevel = layerTop;
          }
        } else {
          // Below this layer's top - hitting the side, push out
          const overlapX = halfSize - Math.abs(position.current.x);
          const overlapZ = halfSize - Math.abs(position.current.z);

          if (overlapX < overlapZ) {
            position.current.x = Math.sign(position.current.x) * (halfSize + 0.1);
            velocity.current.x = 0;
          } else {
            position.current.z = Math.sign(position.current.z) * (halfSize + 0.1);
            velocity.current.z = 0;
          }
          break; // Stop checking higher layers
        }
      }
    }

    // Apply ground collision
    if (position.current.y < groundLevel && velocity.current.y <= 0) {
      position.current.y = groundLevel;
      velocity.current.y = 0;
    }

    // Ground collision
    if (position.current.y < 0) {
      position.current.y = 0;
      velocity.current.y = 0;
    }

    // Clamp to play area
    position.current.x = Math.max(-120, Math.min(120, position.current.x));
    position.current.z = Math.max(-120, Math.min(120, position.current.z));

    // Update visual
    groupRef.current.position.set(position.current.x, position.current.y, position.current.z);
    modelRef.current.rotation.y = rotation.current;

    // Update store position
    updateKOTHAI(config.id, {
      position: [position.current.x, position.current.y, position.current.z],
    });
  });

  return (
    <group ref={groupRef} position={config.position}>
      <primitive ref={modelRef} object={clonedScene} />
    </group>
  );
}
