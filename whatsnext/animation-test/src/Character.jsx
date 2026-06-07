import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { useStore } from './useStore';
import { SPELLS, canCastSpell, getSpellsForMode } from './spells';
import { RACES } from './modes/character-select/raceConfig';

const MODEL_PATH = '/UAL1_Standard.glb';

// Looping animations (should repeat)
const LOOPING_ANIMS = [
  'Idle_Loop', 'Walk_Loop', 'Sprint_Loop', 'Jog_Fwd_Loop', 'Jump_Loop',
  'Crouch_Fwd_Loop', 'Crouch_Idle_Loop', 'Dance_Loop', 'Driving_Loop',
  'Idle_Talking_Loop', 'Idle_Torch_Loop', 'Pistol_Idle_Loop', 'Push_Loop',
  'Sitting_Idle_Loop', 'Sitting_Talking_Loop', 'Spell_Simple_Idle_Loop',
  'Swim_Fwd_Loop', 'Swim_Idle_Loop', 'Sword_Idle', 'Walk_Formal_Loop',
];

// Movement animations (auto-controlled, don't block)
const MOVEMENT_ANIMS = ['Idle_Loop', 'Walk_Loop', 'Sprint_Loop', 'Jump_Start', 'Jump_Loop'];

export default function Character({ settings, groundSize = 50 }) {
  const groupRef = useRef();
  const modelRef = useRef();
  const { camera, raycaster, scene: threeScene } = useThree();

  const { scene, animations } = useGLTF(MODEL_PATH);

  // Clone the scene for independent animation control (prevents conflicts with AIs using same model)
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const { actions, names, mixer } = useAnimations(animations, modelRef);

  const setCurrentAnimation = useStore((s) => s.setCurrentAnimation);
  const setCharacterPosition = useStore((s) => s.setCharacterPosition);
  const setCharacterRotation = useStore((s) => s.setCharacterRotation);
  const setCharacterFacing = useStore((s) => s.setCharacterFacing);
  const triggeredAnimation = useStore((s) => s.triggeredAnimation);
  const clearTriggeredAnimation = useStore((s) => s.clearTriggeredAnimation);
  const actionSlots = useStore((s) => s.actionSlots);
  const selectedRace = useStore((s) => s.selectedRace);

  // Combat system state
  const spellSlots = useStore((s) => s.spellSlots);
  const playerStats = useStore((s) => s.playerStats);
  const spendMana = useStore((s) => s.spendMana);
  const regenMana = useStore((s) => s.regenMana);
  const healPlayer = useStore((s) => s.healPlayer);
  const startCasting = useStore((s) => s.startCasting);
  const stopCasting = useStore((s) => s.stopCasting);
  const currentlyCasting = useStore((s) => s.currentlyCasting);
  const addProjectile = useStore((s) => s.addProjectile);
  const selectedTargetId = useStore((s) => s.selectedTargetId);
  const setSelectedTarget = useStore((s) => s.setSelectedTarget);
  const aiCharacters = useStore((s) => s.aiCharacters);
  const updateAICharacter = useStore((s) => s.updateAICharacter);
  const combatSettings = useStore((s) => s.combatSettings);
  const landscapeBlocks = useStore((s) => s.landscapeBlocks);
  const playerKnockback = useStore((s) => s.playerKnockback);
  const clearPlayerKnockback = useStore((s) => s.clearPlayerKnockback);
  const updatePlayerKnockback = useStore((s) => s.updatePlayerKnockback);
  const isPlayerDead = useStore((s) => s.isPlayerDead);
  const deathCause = useStore((s) => s.deathCause);
  const setPlayerDead = useStore((s) => s.setPlayerDead);
  const pickUpAICharacter = useStore((s) => s.pickUpAICharacter);
  const setAutoAttacking = useStore((s) => s.setAutoAttacking);
  const triggerDamageFlash = useStore((s) => s.triggerDamageFlash);
  const knockdownAICharacter = useStore((s) => s.knockdownAICharacter);
  const stunAICharacter = useStore((s) => s.stunAICharacter);
  const meleeRange = useStore((s) => s.meleeRange);

  // Physics refs
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const position = useRef({ x: 0, y: 0, z: 0 });
  const cameraRotation = useRef(0);
  const modelRotation = useRef(0);
  const targetModelRotation = useRef(0);
  const isGrounded = useRef(true);
  const currentAnim = useRef('Idle_Loop');
  const isPlayingManualAnim = useRef(false);

  // Mouse state
  const isRotating = useRef(false);
  const leftMouseDown = useRef(false);
  const rightMouseDown = useRef(false);
  const leftClickReferenceAngle = useRef(0); // Stores character facing when left click started
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  // Auto attack state
  const isAutoAttacking = useRef(false);
  const attackCombo = useRef(0); // 0 = jab, 1 = cross

  // Player death state
  const isDead = useRef(false);
  const deathTimer = useRef(0);
  const fallTimer = useRef(0); // Track how long player has been falling

  // Casting state
  const castingRef = useRef(null);
  const hasSpawnedProjectile = useRef(false);
  const castPhase = useRef(null); // 'idle', 'shoot', or null
  const castPhaseStartTime = useRef(0);

  // Channel state (for channeled spells like Life Drain)
  const channelRef = useRef(null);

  // HoT (healing over time) effects - array of { targetId, healPercent, tickInterval, endTime, lastTick }
  const activeHoTs = useRef([]);

  // Animation durations (approximate)
  const SPELL_SHOOT_DURATION = 0.5; // Spell_Simple_Shoot duration

  // Global cooldown
  const lastActionTime = useRef(0);

  // Mana regeneration timer
  const lastManaRegenTime = useRef(0);

  // Roll speed buff
  const rollBuff = useRef(null); // { speedMultiplier, endTime }

  // Direction lock for jump/roll - stores world movement direction
  const lockedDirection = useRef(null); // { x, z } or null

  // Charge state
  const chargeState = useRef(null); // { targetId, targetPos, speedMultiplier }

  // Colossal Smash state
  const smashState = useRef(null); // { targetPos, phase: 'jumping' | 'landing' }

  // Time Warp state - stores ghost position for return teleport
  const timewarpState = useRef(null); // { x, y, z, expiresAt } or null

  // Punch cooldown for knockout mode (3 second cooldown)
  const punchCooldownUntil = useRef(0);

  // Spell cooldowns (general)
  const spellCooldowns = useRef({}); // { spellId: cooldownUntilTimestamp }

  // Double jump state
  const doubleJumpReady = useRef(false); // True when double jump ability is available
  const hasDoubleJumped = useRef(false); // True after using second jump

  // Being pulled state - for gradual movement when pulled by AI
  const beingPulled = useRef(null); // { fromX, fromZ, toX, toZ, startTime, duration, stunDuration }

  // Actions ref for use in event handlers
  const actionsRef = useRef(null);

  // Input state
  const keysPressed = useRef({ w: false, a: false, s: false, d: false, space: false });

  // Tab targeting state - tracks recently selected targets to cycle through
  const tabTargetHistory = useRef([]);

  useEffect(() => {
  }, [names]);

  // Keep actionsRef updated
  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  // Get infection state for player color
  const gameMode = useStore((s) => s.gameMode);
  const isPlayerInfected = useStore((s) => s.infection?.isPlayerInfected);

  // Apply race color tint and setup shadows (or infected color)
  useEffect(() => {
    const race = RACES[selectedRace] || RACES.human;

    // Use dark grey for infected, race color for survivor
    const targetColor = (gameMode === 'infection' && isPlayerInfected)
      ? new THREE.Color('#1a1a1a') // Very dark grey (almost black)
      : new THREE.Color(race.color);

    const blendAmount = (gameMode === 'infection' && isPlayerInfected) ? 0.95 : 0.6;

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Apply color tint
        if (child.material) {
          child.material = child.material.clone();
          child.material.color.lerp(targetColor, blendAmount);
        }
      }
    });
  }, [clonedScene, selectedRace, gameMode, isPlayerInfected]);

  // Apply race scale
  useEffect(() => {
    if (modelRef.current) {
      const race = RACES[selectedRace] || RACES.human;
      modelRef.current.scale.set(race.width, race.height, race.width);
    }
  }, [selectedRace]);

  // Listen for animation finished
  useEffect(() => {
    if (!mixer) return;

    const handleFinished = (e) => {
      const animName = e.action.getClip().name;
      // Only clear manual flag for non-movement animations
      if (!MOVEMENT_ANIMS.includes(animName)) {
        isPlayingManualAnim.current = false;
      }
    };

    mixer.addEventListener('finished', handleFinished);
    return () => mixer.removeEventListener('finished', handleFinished);
  }, [mixer]);

  // Handle triggered animation from toolbar/store
  useEffect(() => {
    if (triggeredAnimation && actions[triggeredAnimation]) {
      playManualAnimation(triggeredAnimation);
      clearTriggeredAnimation();

      // Auto-clear manual animation flag after a short duration for instant spells
      // This prevents getting stuck in casting animation
      const animDuration = actions[triggeredAnimation]?.getClip()?.duration || 0.5;
      setTimeout(() => {
        // Only clear if still playing the same animation
        if (currentAnim.current === triggeredAnimation) {
          isPlayingManualAnim.current = false;
          currentAnim.current = ''; // Force animation refresh
        }
      }, (animDuration + 0.1) * 1000);
    }
  }, [triggeredAnimation, actions]);

  // Play movement animation (auto-controlled)
  const playMovementAnimation = (name, crossFade = 0.2) => {
    if (!actions[name]) return;
    if (name === currentAnim.current) return;
    if (isPlayingManualAnim.current) return;

    Object.values(actions).forEach(action => {
      if (action) action.fadeOut(crossFade);
    });

    const action = actions[name];
    action.reset();
    action.setLoop(THREE.LoopRepeat, Infinity);
    action.clampWhenFinished = false;

    // Calculate animation speed based on race height
    // Shorter characters need more steps to cover the same distance (inverse relationship)
    // Dwarf uses 0.9x speed, other short races use height-squared dampening
    const race = RACES[selectedRace] || RACES.human;
    const heightSpeedMultiplier = race.height >= 1
      ? 1 / race.height
      : race.height === 0.65 ? 0.9 // Dwarf: 90% speed
      : 1 / (race.height + (1 - race.height) * 1.7 * race.height * race.height);

    // Base speeds: Walk at 2.5x, Sprint at 1.0x
    const baseSpeed = name === 'Walk_Loop' ? 2.5 : 1.0;
    action.timeScale = baseSpeed * heightSpeedMultiplier;
    action.fadeIn(crossFade).play();

    currentAnim.current = name;
    setCurrentAnimation(name);
  };

  // Play manual animation (user triggered)
  const playManualAnimation = (name, crossFade = 0.15) => {
    if (!actions[name]) {
      console.warn(`Animation "${name}" not found`);
      return;
    }

    isPlayingManualAnim.current = true;

    Object.values(actions).forEach(action => {
      if (action) action.fadeOut(crossFade);
    });

    const action = actions[name];
    const isLooping = LOOPING_ANIMS.includes(name);

    action.reset();
    if (isLooping) {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
    } else {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }

    action.fadeIn(crossFade).play();
    currentAnim.current = name;
    setCurrentAnimation(name);
  };

  // Execute instant abilities (punch, defend, roll, teleport)
  const executeInstantAbility = (spell, state) => {
    const facingAngle = modelRotation.current + Math.PI;

    switch (spell.id) {
      case 'punch': {
        const storeState = useStore.getState();
        const isKnockoutMode = storeState.gameMode === 'knockout';

        // Use melee range from settings
        const punchRange = storeState.meleeRange || spell.range || 4;

        // In knockout mode, punch requires selected target with 3 second cooldown
        if (isKnockoutMode) {
          // Check 3 second cooldown
          const now = Date.now();
          if (now < punchCooldownUntil.current) {
            const remaining = ((punchCooldownUntil.current - now) / 1000).toFixed(1);
            window.dispatchEvent(new CustomEvent('cast-error', {
              detail: { message: `Punch on cooldown! (${remaining}s)` }
            }));
            return;
          }

          // Require selected target
          if (!state.selectedTargetId) {
            window.dispatchEvent(new CustomEvent('cast-error', {
              detail: { message: 'No target selected!' }
            }));
            return;
          }

          // Find selected knockout AI target
          const knockoutAIs = storeState.knockoutAIs || [];
          const target = knockoutAIs.find((ai) => ai.id === state.selectedTargetId);
          if (!target || !target.isAlive) {
            window.dispatchEvent(new CustomEvent('cast-error', {
              detail: { message: 'Invalid target!' }
            }));
            return;
          }

          // Check if target is in range
          const dx = target.position[0] - position.current.x;
          const dz = target.position[2] - position.current.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist > punchRange) {
            window.dispatchEvent(new CustomEvent('cast-error', {
              detail: { message: 'Out of range!' }
            }));
            return;
          }

          // Get knockout spell settings
          const knockoutSpells = getSpellsForMode('knockout');
          const knockoutPunch = knockoutSpells.punch;
          const knockbackDistance = knockoutPunch.knockback || 8;

          // Play punch animation
          storeState.triggerAnimation(spell.animation || 'Punch_Jab');

          // Face the target
          targetModelRotation.current = Math.atan2(-dx, -dz);
          modelRotation.current = targetModelRotation.current;

          // Set 3 second cooldown
          punchCooldownUntil.current = now + 3000;
          // Dispatch cooldown event for UI
          window.dispatchEvent(new CustomEvent('spell-cooldown', {
            detail: { spellId: 'punch', cooldownUntil: punchCooldownUntil.current, duration: 3000 }
          }));

          // No damage in knockout, just knockback to selected target
          const knockbackDist = dist > 0.1 ? dist : 1;
          window.dispatchEvent(new CustomEvent('knockout-ai-knockback', {
            detail: {
              targetId: target.id,
              directionX: dx / knockbackDist,
              directionZ: dz / knockbackDist,
              distance: knockbackDistance,
            }
          }));
          break;
        }

        // Normal test mode punch - requires selected target
        if (!state.selectedTargetId) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'No target selected!' }
          }));
          return;
        }

        // Find selected target
        const target = state.aiCharacters.find((ai) => ai.id === state.selectedTargetId);
        if (!target || target.health <= 0) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Invalid target!' }
          }));
          return;
        }

        // Check if target is in range
        const dx = target.position[0] - position.current.x;
        const dz = target.position[2] - position.current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > punchRange) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Out of range!' }
          }));
          return;
        }

        // Play punch animation
        storeState.triggerAnimation(spell.animation || 'Punch_Jab');

        // Face the target
        targetModelRotation.current = Math.atan2(-dx, -dz);
        modelRotation.current = targetModelRotation.current;

        // Deal damage
        state.damageAICharacter(target.id, spell.damage || 15);
        window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: target.id } }));

        // Apply 5 meter knockback in punch direction
        const knockbackDist = dist > 0.1 ? dist : 1;
        storeState.applyAIKnockback(target.id, dx / knockbackDist, dz / knockbackDist, 5);
        break;
      }

      case 'defend': {
        // Check cooldown
        const now = Date.now();
        const cooldownKey = 'defend';
        if (spell.cooldown && spellCooldowns.current[cooldownKey] && now < spellCooldowns.current[cooldownKey]) {
          const remaining = ((spellCooldowns.current[cooldownKey] - now) / 1000).toFixed(1);
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: `Defend on cooldown! (${remaining}s)` }
          }));
          return;
        }

        // Set cooldown if spell has one
        if (spell.cooldown) {
          const cooldownDuration = spell.cooldown * 1000;
          spellCooldowns.current[cooldownKey] = now + cooldownDuration;
          window.dispatchEvent(new CustomEvent('spell-cooldown', {
            detail: { spellId: 'defend', cooldownUntil: spellCooldowns.current[cooldownKey], duration: cooldownDuration }
          }));
        }

        // Play defend animation
        useStore.getState().triggerAnimation(spell.animation || 'Hit_Chest');

        // Activate defend state for spell duration (2 seconds by default)
        const defendDuration = spell.duration || 2;
        useStore.getState().activateDefend(defendDuration);

        // Trigger shield visual effect
        window.dispatchEvent(new CustomEvent('player-shield', {
          detail: {
            x: position.current.x,
            y: position.current.y,
            z: position.current.z,
            duration: defendDuration,
          }
        }));
        break;
      }

      case 'roll': {
        // Check cooldown for roll (especially in infection mode)
        const now = Date.now();
        const cooldownKey = 'roll';
        if (spell.cooldown && spellCooldowns.current[cooldownKey] && now < spellCooldowns.current[cooldownKey]) {
          const remaining = ((spellCooldowns.current[cooldownKey] - now) / 1000).toFixed(1);
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: `Roll on cooldown! (${remaining}s)` }
          }));
          return;
        }

        // Set cooldown if spell has one (infection mode)
        if (spell.cooldown) {
          const cooldownDuration = spell.cooldown * 1000;
          spellCooldowns.current[cooldownKey] = now + cooldownDuration;
          window.dispatchEvent(new CustomEvent('spell-cooldown', {
            detail: { spellId: 'roll', cooldownUntil: spellCooldowns.current[cooldownKey], duration: cooldownDuration }
          }));
        }

        // Play roll animation, cutting off the last 0.1 seconds
        const rollAction = actionsRef.current?.['Roll'];
        if (rollAction) {
          isPlayingManualAnim.current = true;
          Object.values(actionsRef.current).forEach(action => {
            if (action) action.fadeOut(0.1);
          });
          rollAction.reset();
          rollAction.setLoop(THREE.LoopOnce, 1);
          rollAction.clampWhenFinished = true;
          rollAction.timeScale = 1.0;
          rollAction.fadeIn(0.1).play();
          currentAnim.current = 'Roll';
          setCurrentAnimation('Roll');

          // Get clip duration and stop 0.5 seconds early
          const clipDuration = rollAction.getClip().duration;
          const cutDuration = Math.max(0.1, clipDuration - 0.5);
          setTimeout(() => {
            if (currentAnim.current === 'Roll') {
              rollAction.fadeOut(0.05);
              isPlayingManualAnim.current = false;
            }
          }, cutDuration * 1000);
        }

        // Lock direction to current facing direction for roll
        const rollAngle = modelRotation.current + Math.PI;
        lockedDirection.current = {
          x: Math.sin(rollAngle),
          z: Math.cos(rollAngle),
        };

        // Apply speed buff for duration - use infection bonuses or combat settings
        let speedMultiplier;
        if (state.gameMode === 'infection' && spell.speedMultiplier) {
          // Infection mode: use the spell's speedMultiplier which has bonuses applied
          speedMultiplier = spell.speedMultiplier;
        } else {
          // Normal mode: use combat settings
          const rollSpeedSetting = state.combatSettings?.rollSpeedMultiplier ?? 300;
          speedMultiplier = rollSpeedSetting / 100; // Convert from percentage (300 = 3.0x)
        }
        const duration = spell.duration || 0.5;
        rollBuff.current = {
          speedMultiplier,
          endTime: Date.now() + duration * 1000,
        };
        break;
      }

      case 'teleport': {
        // Teleport forward
        const teleportDistance = spell.distance || 10;
        const newX = position.current.x + Math.sin(facingAngle) * teleportDistance;
        const newZ = position.current.z + Math.cos(facingAngle) * teleportDistance;

        position.current.x = newX;
        position.current.z = newZ;

        // Visual flash effect
        window.dispatchEvent(new CustomEvent('teleport-flash', {
          detail: {
            fromX: position.current.x - Math.sin(facingAngle) * teleportDistance,
            fromZ: position.current.z - Math.cos(facingAngle) * teleportDistance,
            toX: position.current.x,
            toZ: position.current.z,
          }
        }));
        break;
      }

      case 'pick': {
        // Use melee range from settings
        const pickRange = useStore.getState().meleeRange || spell.range || 4;

        // Pick requires a selected target
        if (!state.selectedTargetId) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'No target selected!' }
          }));
          return;
        }

        // Find selected target
        const target = state.aiCharacters.find((ai) => ai.id === state.selectedTargetId);
        if (!target || target.health <= 0) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Invalid target!' }
          }));
          return;
        }

        // Check if target is in range
        const dx = target.position[0] - position.current.x;
        const dz = target.position[2] - position.current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > pickRange) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Out of range!' }
          }));
          return;
        }

        // Play pick up animation
        useStore.getState().triggerAnimation(spell.animation || 'PickUp_Table');

        // Face the target
        targetModelRotation.current = Math.atan2(-dx, -dz);
        modelRotation.current = targetModelRotation.current;

        // Pick up the AI for 2 seconds and store carrier info
        pickUpAICharacter(target.id, spell.duration || 2);
        break;
      }

      case 'frostnova': {
        // Check cooldown
        const now = Date.now();
        const cooldownKey = 'frostnova';
        if (spell.cooldown && spellCooldowns.current[cooldownKey] && now < spellCooldowns.current[cooldownKey]) {
          const remaining = ((spellCooldowns.current[cooldownKey] - now) / 1000).toFixed(1);
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: `Frost Nova on cooldown! (${remaining}s)` }
          }));
          return;
        }

        // Set cooldown if spell has one
        if (spell.cooldown) {
          const cooldownDuration = spell.cooldown * 1000;
          spellCooldowns.current[cooldownKey] = now + cooldownDuration;
          window.dispatchEvent(new CustomEvent('spell-cooldown', {
            detail: { spellId: 'frostnova', cooldownUntil: spellCooldowns.current[cooldownKey], duration: cooldownDuration }
          }));
        }

        // Play cast animation
        const storeState = useStore.getState();
        storeState.triggerAnimation(spell.animation || 'Spell_Simple_Shoot');

        // Frost Nova - AoE freeze in 5m radius
        const novaRange = spell.range || 5;
        const freezeDuration = spell.freezeDuration || 3;
        let hitCount = 0;
        const isKnockoutMode = storeState.gameMode === 'knockout';

        if (isKnockoutMode) {
          // Knockout mode - freeze knockout AIs
          const knockoutAIs = storeState.knockoutAIs || [];

          for (const ai of knockoutAIs) {
            if (!ai.isAlive) continue;
            const dx = ai.position[0] - position.current.x;
            const dz = ai.position[2] - position.current.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist <= novaRange) {
              // Freeze the target by setting frozenUntil timestamp
              const freezeUntil = now + (freezeDuration * 1000);
              storeState.updateKnockoutAI(ai.id, {
                frozenUntil: freezeUntil
              });
              window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: ai.id } }));
              hitCount++;
            }
          }
        } else {
          // Test mode - freeze test AIs
          for (const ai of state.aiCharacters) {
            if (ai.health <= 0) continue;
            const dx = ai.position[0] - position.current.x;
            const dz = ai.position[2] - position.current.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist <= novaRange) {
              // Freeze the target
              state.freezeAICharacter(ai.id, freezeDuration);
              // Deal damage
              state.damageAICharacter(ai.id, spell.damage || 10);
              window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: ai.id } }));
              hitCount++;
            }
          }
        }

        // Visual effect event
        window.dispatchEvent(new CustomEvent('frost-nova', {
          detail: {
            x: position.current.x,
            z: position.current.z,
            radius: novaRange,
          }
        }));
        break;
      }

      case 'freeze': {
        // Check cooldown
        const now = Date.now();
        const cooldownKey = 'freeze';
        if (spell.cooldown && spellCooldowns.current[cooldownKey] && now < spellCooldowns.current[cooldownKey]) {
          const remaining = ((spellCooldowns.current[cooldownKey] - now) / 1000).toFixed(1);
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: `Freeze on cooldown! (${remaining}s)` }
          }));
          return;
        }

        const storeState = useStore.getState();
        const isKnockoutMode = storeState.gameMode === 'knockout';
        const freezeRange = spell.range || 15;
        const freezeDuration = spell.freezeDuration || 3;

        // Freeze requires a selected target
        if (!state.selectedTargetId) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'No target selected!' }
          }));
          return;
        }

        // Find selected target (check both test mode and knockout mode)
        let target = null;
        let targetPos = null;

        if (isKnockoutMode) {
          const knockoutAIs = storeState.knockoutAIs || [];
          target = knockoutAIs.find((ai) => ai.id === state.selectedTargetId && ai.isAlive);
          if (target) {
            targetPos = { x: target.position[0], z: target.position[2] };
          }
        } else {
          target = state.aiCharacters.find((ai) => ai.id === state.selectedTargetId);
          if (target && target.health > 0) {
            targetPos = { x: target.position[0], z: target.position[2] };
          }
        }

        if (!target || !targetPos) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Invalid target!' }
          }));
          return;
        }

        // Check if target is in range
        const dx = targetPos.x - position.current.x;
        const dz = targetPos.z - position.current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > freezeRange) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Out of range!' }
          }));
          return;
        }

        // Set cooldown
        if (spell.cooldown) {
          const cooldownDuration = spell.cooldown * 1000;
          spellCooldowns.current[cooldownKey] = now + cooldownDuration;
          window.dispatchEvent(new CustomEvent('spell-cooldown', {
            detail: { spellId: 'freeze', cooldownUntil: spellCooldowns.current[cooldownKey], duration: cooldownDuration }
          }));
        }

        // Play cast animation
        storeState.triggerAnimation(spell.animation || 'Pistol_Aim_Up');

        // Apply freeze to target
        const freezeUntil = now + (freezeDuration * 1000);

        if (isKnockoutMode) {
          storeState.updateKnockoutAI(target.id, { frozenUntil: freezeUntil });
        } else {
          state.freezeAICharacter(target.id, freezeDuration);
        }

        window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: target.id } }));

        // Visual effect at target position (small frost nova effect)
        window.dispatchEvent(new CustomEvent('frost-nova', {
          detail: {
            x: targetPos.x,
            z: targetPos.z,
            radius: 1, // Small effect just on the target
          }
        }));
        break;
      }

      case 'stun': {
        const storeState = useStore.getState();
        // Use melee range from settings
        const stunRange = storeState.meleeRange || spell.range || 4;
        const isKnockoutMode = storeState.gameMode === 'knockout';

        // Stun requires a selected target
        if (!state.selectedTargetId) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'No target selected!' }
          }));
          return;
        }

        // Find selected target (knockout mode uses knockoutAIs)
        let target;
        if (isKnockoutMode) {
          const knockoutAIs = storeState.knockoutAIs || [];
          target = knockoutAIs.find((ai) => ai.id === state.selectedTargetId && ai.isAlive);
        } else {
          target = state.aiCharacters.find((ai) => ai.id === state.selectedTargetId);
        }

        if (!target || (!isKnockoutMode && target.health <= 0)) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Invalid target!' }
          }));
          return;
        }

        // Check if target is in range
        const dx = target.position[0] - position.current.x;
        const dz = target.position[2] - position.current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > stunRange) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Out of range!' }
          }));
          return;
        }

        // Play stun animation
        useStore.getState().triggerAnimation(spell.animation || 'Punch_Cross');

        // Face the target
        targetModelRotation.current = Math.atan2(-dx, -dz);
        modelRotation.current = targetModelRotation.current;

        if (isKnockoutMode) {
          // Knockout mode: stun the AI
          storeState.updateKnockoutAI(target.id, {
            stunnedUntil: Date.now() + (spell.stunDuration || 5) * 1000,
          });
        } else {
          // Test mode: deal damage and apply stun
          state.damageAICharacter(target.id, spell.damage || 10);
          stunAICharacter(target.id, spell.stunDuration || 3);
        }
        window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: target.id } }));
        break;
      }

      case 'charge': {
        // Charge requires a selected target
        if (!state.selectedTargetId) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'No target selected!' }
          }));
          return;
        }

        // Find selected target
        const target = state.aiCharacters.find((ai) => ai.id === state.selectedTargetId);
        if (!target || target.health <= 0) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Invalid target!' }
          }));
          return;
        }

        // Check if target is in range
        const dx = target.position[0] - position.current.x;
        const dz = target.position[2] - position.current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > (spell.range || 20)) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Out of range!' }
          }));
          return;
        }

        // Start charge - set charge state
        chargeState.current = {
          targetId: target.id,
          speedMultiplier: spell.speedMultiplier || 5.0,
          damage: spell.damage || 20,
          stunDuration: spell.stunDuration || 0.5,
        };

        // Face the target
        targetModelRotation.current = Math.atan2(-dx, -dz);
        modelRotation.current = targetModelRotation.current;
        break;
      }

      case 'colossalsmash': {
        // Enter ground targeting mode
        useStore.getState().setGroundTargetMode({
          spellId: 'colossalsmash',
          range: spell.range || 25,
          damage: spell.damage || 40,
        });
        break;
      }

      case 'meteor': {
        // Enter ground targeting mode for meteor
        useStore.getState().setGroundTargetMode({
          spellId: 'meteor',
          range: spell.range || 20,
          damage: spell.damage || 80,
          impactRadius: spell.impactRadius || 5,
          delay: spell.delay || 1.5,
        });
        break;
      }

      case 'mirrorimage': {
        // Create mirror images
        useStore.getState().triggerAnimation(spell.animation || 'Spell_Simple_Shoot');
        window.dispatchEvent(new CustomEvent('mirror-image-create', {
          detail: {
            count: spell.imageCount || 2,
            duration: spell.duration || 5,
          }
        }));
        break;
      }

      case 'windgust': {
        // Knockback enemies in front cone
        useStore.getState().triggerAnimation(spell.animation || 'Pistol_Aim_Up');
        const facing = modelRotation.current;
        const coneAngle = (spell.coneAngle || 60) * Math.PI / 180;
        const range = spell.range || 8;

        for (const ai of state.aiCharacters) {
          if (ai.health <= 0) continue;
          const dx = ai.position[0] - position.current.x;
          const dz = ai.position[2] - position.current.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist > range) continue;

          // Check if in cone
          const angleToTarget = Math.atan2(-dx, -dz);
          let angleDiff = Math.abs(angleToTarget - facing);
          if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

          if (angleDiff <= coneAngle / 2) {
            state.damageAICharacter(ai.id, spell.damage || 5);
            state.applyAIKnockback(ai.id, dx / dist, dz / dist, spell.knockbackDistance || 6);
            window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: ai.id } }));
          }
        }

        // Visual effect
        const facingDir = modelRotation.current + Math.PI;
        window.dispatchEvent(new CustomEvent('wind-gust', {
          detail: {
            x: position.current.x,
            z: position.current.z,
            directionX: Math.sin(facingDir),
            directionZ: Math.cos(facingDir),
            range: spell.range || 8,
            coneAngle: spell.coneAngle || 60,
          }
        }));
        break;
      }

      case 'backstab': {
        // Requires a selected target
        if (!state.selectedTargetId) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'No target selected!' }
          }));
          return;
        }

        const target = state.aiCharacters.find((ai) => ai.id === state.selectedTargetId);
        if (!target || target.health <= 0) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Invalid target!' }
          }));
          return;
        }

        // Check range
        const dx = target.position[0] - position.current.x;
        const dz = target.position[2] - position.current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > (spell.range || 15)) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Out of range!' }
          }));
          return;
        }

        // Teleport behind target
        const behindDist = 1.5;
        const targetFacing = Math.atan2(target.position[0], target.position[2]);
        position.current.x = target.position[0] - Math.sin(targetFacing) * behindDist;
        position.current.z = target.position[2] - Math.cos(targetFacing) * behindDist;

        // Face the target
        targetModelRotation.current = Math.atan2(
          -(target.position[0] - position.current.x),
          -(target.position[2] - position.current.z)
        );
        modelRotation.current = targetModelRotation.current;

        // Trigger teleport flash
        window.dispatchEvent(new CustomEvent('teleport-flash', {
          detail: { x: position.current.x, z: position.current.z }
        }));

        // Deal damage
        useStore.getState().triggerAnimation(spell.animation || 'Punch_Cross');
        state.damageAICharacter(target.id, spell.damage || 45);
        window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: target.id } }));
        break;
      }

      case 'enrage': {
        // Apply enrage buff to player
        useStore.getState().triggerAnimation(spell.animation || 'Hit_Chest');
        useStore.getState().applyPlayerBuff('enrage', {
          duration: spell.duration || 8,
          damageBonus: spell.damageBonus || 0.50,
          damageTaken: spell.damageTaken || 0.25,
        });
        window.dispatchEvent(new CustomEvent('player-enraged'));
        break;
      }

      case 'pull': {
        const storeState = useStore.getState();
        const isKnockoutMode = storeState.gameMode === 'knockout';

        // Check cooldown in knockout mode
        if (isKnockoutMode) {
          const now = Date.now();
          const cooldownKey = 'pull';
          if (spell.cooldown && spellCooldowns.current[cooldownKey] && now < spellCooldowns.current[cooldownKey]) {
            const remaining = ((spellCooldowns.current[cooldownKey] - now) / 1000).toFixed(1);
            window.dispatchEvent(new CustomEvent('cast-error', {
              detail: { message: `Pull on cooldown! (${remaining}s)` }
            }));
            return;
          }
        }

        // Requires a selected target
        if (!state.selectedTargetId) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'No target selected!' }
          }));
          return;
        }

        // Find selected target (knockout mode uses knockoutAIs)
        let target;
        if (isKnockoutMode) {
          const knockoutAIs = storeState.knockoutAIs || [];
          target = knockoutAIs.find((ai) => ai.id === state.selectedTargetId && ai.isAlive);
        } else {
          target = state.aiCharacters.find((ai) => ai.id === state.selectedTargetId);
        }

        if (!target || (!isKnockoutMode && target.health <= 0)) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Invalid target!' }
          }));
          return;
        }

        // Check range
        const dx = target.position[0] - position.current.x;
        const dz = target.position[2] - position.current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > (spell.range || 15)) {
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Out of range!' }
          }));
          return;
        }

        // Set cooldown in knockout mode
        if (isKnockoutMode && spell.cooldown) {
          const cooldownDuration = spell.cooldown * 1000;
          spellCooldowns.current['pull'] = Date.now() + cooldownDuration;
          window.dispatchEvent(new CustomEvent('spell-cooldown', {
            detail: { spellId: 'pull', cooldownUntil: spellCooldowns.current['pull'], duration: cooldownDuration }
          }));
        }

        // Play animation
        useStore.getState().triggerAnimation(spell.animation || 'Spell_Simple_Shoot');

        // Pull target towards player (stop 1.5m away)
        const pullToX = position.current.x + (dx / dist) * 1.5;
        const pullToZ = position.current.z + (dz / dist) * 1.5;

        // Calculate pull duration based on distance (speed of ~15 units/sec)
        const pullDuration = Math.max(0.3, (dist - 1.5) / 15) * 1000; // in milliseconds

        // Visual effect - will be ended by pull-complete event
        window.dispatchEvent(new CustomEvent('pull-effect', {
          detail: {
            fromX: target.position[0],
            fromZ: target.position[2],
            toX: position.current.x,
            toZ: position.current.z,
            targetId: target.id,
            duration: pullDuration,
          }
        }));

        if (isKnockoutMode) {
          // Knockout mode: start pulling AI (not instant teleport)
          window.dispatchEvent(new CustomEvent('knockout-ai-pull', {
            detail: {
              targetId: target.id,
              fromX: target.position[0],
              fromZ: target.position[2],
              toX: pullToX,
              toZ: pullToZ,
              duration: pullDuration,
              stunDuration: (spell.stunDuration || 1) * 1000, // Stun applied on arrival
            }
          }));
        } else {
          // Test mode: apply knockback towards player
          const pullDistance = Math.max(0, dist - 2);
          const pullDirX = -dx / dist;
          const pullDirZ = -dz / dist;
          state.applyAIKnockback(target.id, pullDirX, pullDirZ, pullDistance, 6.0);
          stunAICharacter(target.id, spell.stunDuration || 0.5);
        }
        window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: target.id } }));
        break;
      }

      case 'timewarp': {
        // Check if ghost already exists (second press - return to ghost)
        if (timewarpState.current && Date.now() < timewarpState.current.expiresAt) {
          // Teleport back to ghost position
          const ghost = timewarpState.current;

          // Trigger teleport flash at current position
          window.dispatchEvent(new CustomEvent('teleport-flash', {
            detail: { x: position.current.x, z: position.current.z }
          }));

          // Move to ghost position
          position.current.x = ghost.x;
          position.current.y = ghost.y;
          position.current.z = ghost.z;

          // Trigger teleport flash at new position
          window.dispatchEvent(new CustomEvent('teleport-flash', {
            detail: { x: ghost.x, z: ghost.z }
          }));

          // Remove the ghost
          window.dispatchEvent(new CustomEvent('timewarp-end'));
          timewarpState.current = null;

          useStore.getState().triggerAnimation(spell.animation || 'Spell_Simple_Shoot');
        } else {
          // First press - create ghost at current position
          timewarpState.current = {
            x: position.current.x,
            y: position.current.y,
            z: position.current.z,
            expiresAt: Date.now() + (spell.duration || 5) * 1000,
          };

          // Create visual ghost effect
          window.dispatchEvent(new CustomEvent('timewarp-start', {
            detail: {
              x: position.current.x,
              y: position.current.y,
              z: position.current.z,
              duration: spell.duration || 5,
            }
          }));

          useStore.getState().triggerAnimation(spell.animation || 'Spell_Simple_Shoot');
        }
        break;
      }

      case 'doublejump': {
        const now = Date.now();
        const cooldownKey = 'doublejump';
        const jumpForce = settings.movement?.jumpForce || 8;

        // If in the air and double jump is ready, perform the second jump (1.5x higher)
        if (!isGrounded.current && doubleJumpReady.current && !hasDoubleJumped.current) {
          velocity.current.y = jumpForce * 1.5;
          hasDoubleJumped.current = true;
          playMovementAnimation('Jump_Start', 0.1);

          // Start cooldown ONLY when second jump is used
          const cooldownDuration = (spell.cooldown || 3) * 1000;
          spellCooldowns.current[cooldownKey] = now + cooldownDuration;
          window.dispatchEvent(new CustomEvent('spell-cooldown', {
            detail: { spellId: 'doublejump', cooldownUntil: spellCooldowns.current[cooldownKey], duration: cooldownDuration }
          }));
          return;
        }

        // If in the air but double jump NOT ready (walked off ledge), give them a jump
        if (!isGrounded.current && !doubleJumpReady.current) {
          // Check cooldown first
          if (spellCooldowns.current[cooldownKey] && now < spellCooldowns.current[cooldownKey]) {
            const remaining = ((spellCooldowns.current[cooldownKey] - now) / 1000).toFixed(1);
            window.dispatchEvent(new CustomEvent('cast-error', {
              detail: { message: `Double Jump on cooldown! (${remaining}s)` }
            }));
            return;
          }

          // Give them a single jump in the air (1.5x higher for air jump)
          velocity.current.y = jumpForce * 1.5;
          playMovementAnimation('Jump_Start', 0.1);

          // Start cooldown since they used their one air jump
          const cooldownDuration = (spell.cooldown || 3) * 1000;
          spellCooldowns.current[cooldownKey] = now + cooldownDuration;
          window.dispatchEvent(new CustomEvent('spell-cooldown', {
            detail: { spellId: 'doublejump', cooldownUntil: spellCooldowns.current[cooldownKey], duration: cooldownDuration }
          }));
          return;
        }

        // On ground: Check cooldown for initial cast
        if (spellCooldowns.current[cooldownKey] && now < spellCooldowns.current[cooldownKey]) {
          const remaining = ((spellCooldowns.current[cooldownKey] - now) / 1000).toFixed(1);
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: `Double Jump on cooldown! (${remaining}s)` }
          }));
          return;
        }

        // On ground: Perform first jump and enable second jump ability
        if (isGrounded.current) {
          velocity.current.y = jumpForce;
          isGrounded.current = false;
          doubleJumpReady.current = true;
          hasDoubleJumped.current = false;
          playMovementAnimation('Jump_Start', 0.1);
        }
        break;
      }

      case 'heymaker': {
        // Haymaker: Charged melee attack that hits ALL enemies in a cone in front
        // No target required - hits everyone in range and cone angle
        const storeState = useStore.getState();
        const now = Date.now();
        const cooldownKey = 'heymaker';

        // Check cooldown
        if (spellCooldowns.current[cooldownKey] && now < spellCooldowns.current[cooldownKey]) {
          const remaining = ((spellCooldowns.current[cooldownKey] - now) / 1000).toFixed(1);
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: `Haymaker on cooldown! (${remaining}s)` }
          }));
          return;
        }

        // Get spell settings
        const baseRange = spell.range || 4;
        const coneAngle = 90; // 90 degree cone in front of player (45 degrees each side)
        const knockbackPower = spell.maxKnockback || 15;

        // Play attack animation
        storeState.triggerAnimation(spell.executeAnimation || 'Sword_Attack');

        // Set cooldown (1 second)
        const cooldownDuration = 1000;
        spellCooldowns.current[cooldownKey] = now + cooldownDuration;
        window.dispatchEvent(new CustomEvent('spell-cooldown', {
          detail: { spellId: 'heymaker', cooldownUntil: spellCooldowns.current[cooldownKey], duration: cooldownDuration }
        }));

        // Get player facing direction
        const playerFacing = modelRotation.current + Math.PI;

        // Find all KOTH AIs within range and cone
        const kothAIs = storeState.kothAIs || [];
        let hitCount = 0;

        for (const ai of kothAIs) {
          const dx = ai.position[0] - position.current.x;
          const dz = ai.position[2] - position.current.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          // Check if in range
          if (dist > baseRange) continue;

          // Check if in cone (in front of player)
          const angleToTarget = Math.atan2(dx, dz);
          let angleDiff = angleToTarget - playerFacing;
          // Normalize angle difference to -PI to PI
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

          const halfCone = (coneAngle / 2) * (Math.PI / 180);
          if (Math.abs(angleDiff) > halfCone) continue;

          // Hit this AI - apply knockback
          hitCount++;
          const knockbackDirX = dx / (dist || 1);
          const knockbackDirZ = dz / (dist || 1);

          // Dispatch knockback event for KOTH AI
          window.dispatchEvent(new CustomEvent('koth-ai-knockback', {
            detail: {
              targetId: ai.id,
              directionX: knockbackDirX,
              directionZ: knockbackDirZ,
              distance: knockbackPower,
            }
          }));
        }

        if (hitCount === 0) {
          // Visual feedback that attack missed
          window.dispatchEvent(new CustomEvent('cast-error', {
            detail: { message: 'Missed!' }
          }));
        }
        break;
      }
    }
  };

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (key === 'w') keysPressed.current.w = true;
      if (key === 'a') keysPressed.current.a = true;
      if (key === 's') keysPressed.current.s = true;
      if (key === 'd') keysPressed.current.d = true;
      if (key === ' ') {
        e.preventDefault();
        keysPressed.current.space = true;
      }
      if (key === 'z') {
        useStore.getState().toggleRunning();
      }

      // P key to toggle spell book
      if (key === 'p') {
        useStore.getState().toggleSpellBook();
        return;
      }

      // ESC key to cancel time warp (if active)
      if (key === 'escape' && timewarpState.current) {
        window.dispatchEvent(new CustomEvent('timewarp-end'));
        timewarpState.current = null;
        return;
      }

      // Tab key for target cycling
      if (key === 'tab') {
        e.preventDefault();
        const state = useStore.getState();

        // Use knockout AIs in knockout mode, otherwise use test mode AIs
        let aliveEnemies;
        if (state.gameMode === 'knockout') {
          aliveEnemies = (state.knockoutAIs || [])
            .filter(ai => ai.isAlive)
            .map(ai => ({ ...ai, health: 100 })); // Add health prop for compatibility
        } else {
          aliveEnemies = state.aiCharacters.filter(ai => ai.health > 0);
        }

        if (aliveEnemies.length === 0) {
          return;
        }

        // Sort enemies by distance from player
        const sortedByDistance = [...aliveEnemies].sort((a, b) => {
          const distA = Math.sqrt(
            Math.pow(a.position[0] - position.current.x, 2) +
            Math.pow(a.position[2] - position.current.z, 2)
          );
          const distB = Math.sqrt(
            Math.pow(b.position[0] - position.current.x, 2) +
            Math.pow(b.position[2] - position.current.z, 2)
          );
          return distA - distB;
        });

        // Find the next target not in recent history
        let nextTarget = null;
        for (const enemy of sortedByDistance) {
          if (!tabTargetHistory.current.includes(enemy.id)) {
            nextTarget = enemy;
            break;
          }
        }

        // If all enemies were in history, reset and pick the closest
        if (!nextTarget) {
          tabTargetHistory.current = [];
          nextTarget = sortedByDistance[0];
        }

        // Select the target and add to history
        if (nextTarget) {
          state.setSelectedTarget(nextTarget.id);
          tabTargetHistory.current.push(nextTarget.id);

          // Keep history at max 3 entries (so 4th press resets)
          if (tabTargetHistory.current.length >= 3) {
            tabTargetHistory.current = [];
          }
        }
        return;
      }

      // Spell slot keys: top row 1-0, bottom row R,F,C,V,G,T (only on toolbar 1)
      const topRowKeys = ['1','2','3','4','5','6','7','8','9','0'];
      const bottomRowKeys = ['r','f','c','v','g','t'];
      const slotKey = topRowKeys.includes(e.key) ? e.key : (bottomRowKeys.includes(key) ? key.toUpperCase() : null);

      if (slotKey) {
        const now = Date.now();
        const state = useStore.getState();

        // Only trigger spells when on toolbar 1 (or always in knockout mode)
        if (state.gameMode !== 'knockout' && state.activeToolbar !== 1) {
          return;
        }

        // Don't use spells if spell book is open
        if (state.spellBookOpen) {
          return;
        }

        // Don't cast spells during mirror image selection
        if (state.mirrorImageSelecting) {
          return;
        }

        // In knockout/infection/koth mode, use mode-specific spell slots
        const effectiveSpellSlots = state.gameMode === 'infection'
          ? { '1': state.infection?.isPlayerInfected ? null : 'roll', '2': 'doublejump', '3': null, '4': null, '5': null, '6': null, '7': null, '8': null, '9': null, '0': null,
              'R': null, 'F': null, 'C': null, 'V': null, 'G': null, 'T': null }
          : state.gameMode === 'knockout'
          ? { '1': state.knockout?.selectedSpell || 'punch', '2': null, '3': null, '4': null, '5': null, '6': null, '7': null, '8': null, '9': null, '0': null,
              'R': null, 'F': null, 'C': null, 'V': null, 'G': null, 'T': null }
          : state.gameMode === 'koth'
          ? { '1': 'heymaker', '2': null, '3': null, '4': null, '5': null, '6': null, '7': null, '8': null, '9': null, '0': null,
              'R': null, 'F': null, 'C': null, 'V': null, 'G': null, 'T': null }
          : state.spellSlots;
        const spellId = effectiveSpellSlots[slotKey];

        // Special case: Allow double jump's second press to bypass GCD
        const isDoubleJumpSecondPress = spellId === 'doublejump' &&
          !isGrounded.current &&
          doubleJumpReady.current &&
          !hasDoubleJumped.current;

        const gcd = (state.combatSettings?.globalCooldown || 0.5) * 1000;

        // Check global cooldown (skip for double jump second press)
        if (!isDoubleJumpSecondPress && now - lastActionTime.current < gcd) {
          return;
        }

        // Get spell from mode-specific spells (knockout has modified punch, infection has roll with bonuses)
        const infectionBonuses = state.gameMode === 'infection' ? state.getInfectionBonuses() : null;
        const modeSpells = getSpellsForMode(state.gameMode, infectionBonuses);
        const spell = spellId ? (modeSpells[spellId] || SPELLS[spellId]) : null;

        if (spellId && spell) {

          // Check mana
          if (!canCastSpell(spellId, state.playerStats.mana)) {
            window.dispatchEvent(new CustomEvent('cast-error', {
              detail: { message: 'Not enough mana!' }
            }));
            return;
          }

          // Check if targeted spell needs a target
          if (spell.behavior === 'targeted' && !state.selectedTargetId) {
            window.dispatchEvent(new CustomEvent('cast-error', {
              detail: { message: 'No target selected!' }
            }));
            return;
          }

          // Set global cooldown
          lastActionTime.current = now;

          // Handle instant abilities
          if (spell.behavior === 'instant') {
            // Deduct mana if any
            if (spell.manaCost > 0) {
              state.spendMana(spell.manaCost);
            }

            // Execute instant ability
            executeInstantAbility(spell, state);
            return;
          }

          // Handle ground-target abilities (like Colossal Smash)
          if (spell.behavior === 'ground-target') {
            // Don't deduct mana yet - deduct when confirmed
            executeInstantAbility(spell, state);
            return;
          }

          // Handle self-cast spells (like Heal) - still require standing still
          if (spell.behavior === 'self' || spell.behavior === 'self-aoe') {
            const keys = keysPressed.current;
            const isMoving = keys.w || keys.a || keys.s || keys.d;
            if (isMoving) {
              window.dispatchEvent(new CustomEvent('cast-error', {
                detail: { message: 'You must stand still to cast that' }
              }));
              return;
            }

            // Deduct mana
            if (spell.manaCost > 0) {
              state.spendMana(spell.manaCost);
            }

            // Get cast time from settings slider, then spell default
            const chargeTime = state.spellCastTimes?.[spellId] ?? spell.chargeTime ?? 0.5;

            // Start casting
            state.startCasting(spellId, null, chargeTime, now);
            castingRef.current = {
              spellId,
              startTime: now,
              targetId: null,
              chargeTime: chargeTime,
              isSelfCast: true,
            };
            hasSpawnedProjectile.current = false;

            // Play animation
            if (chargeTime > 0.4) {
              castPhase.current = 'idle';
              castPhaseStartTime.current = now;
              useStore.getState().triggerAnimation('Spell_Simple_Idle_Loop');
            } else {
              castPhase.current = 'shoot';
              castPhaseStartTime.current = now;
              useStore.getState().triggerAnimation(spell.animation || 'Spell_Simple_Shoot');
            }
            return;
          }

          // Handle heal-target spells (heals selected target or self if no target)
          if (spell.behavior === 'heal-target') {
            const keys = keysPressed.current;
            const isMoving = keys.w || keys.a || keys.s || keys.d;
            if (isMoving) {
              window.dispatchEvent(new CustomEvent('cast-error', {
                detail: { message: 'You must stand still to cast that' }
              }));
              return;
            }

            // Check range if targeting someone
            if (state.selectedTargetId) {
              const target = state.aiCharacters.find((ai) => ai.id === state.selectedTargetId);
              if (target) {
                const dx = target.position[0] - position.current.x;
                const dz = target.position[2] - position.current.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                if (dist > (spell.range || 25)) {
                  window.dispatchEvent(new CustomEvent('cast-error', {
                    detail: { message: 'Out of range!' }
                  }));
                  return;
                }
              }
            }

            // Deduct mana
            if (spell.manaCost > 0) {
              state.spendMana(spell.manaCost);
            }

            // Get cast time from settings slider, then spell default
            const chargeTime = state.spellCastTimes?.[spellId] ?? spell.chargeTime ?? 1.0;

            // Start casting
            state.startCasting(spellId, state.selectedTargetId, chargeTime, now);
            castingRef.current = {
              spellId,
              startTime: now,
              targetId: state.selectedTargetId, // null means self
              chargeTime: chargeTime,
              isHealTarget: true,
            };
            hasSpawnedProjectile.current = false;

            // Play animation
            if (chargeTime > 0.4) {
              castPhase.current = 'idle';
              castPhaseStartTime.current = now;
              useStore.getState().triggerAnimation('Spell_Simple_Idle_Loop');
            } else {
              castPhase.current = 'shoot';
              castPhaseStartTime.current = now;
              useStore.getState().triggerAnimation(spell.animation || 'Spell_Simple_Shoot');
            }
            return;
          }

          // Handle HoT (healing over time) spells - instant cast
          if (spell.behavior === 'hot') {
            // Check range if targeting someone
            if (state.selectedTargetId) {
              const target = state.aiCharacters.find((ai) => ai.id === state.selectedTargetId);
              if (target) {
                const dx = target.position[0] - position.current.x;
                const dz = target.position[2] - position.current.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                if (dist > (spell.range || 25)) {
                  window.dispatchEvent(new CustomEvent('cast-error', {
                    detail: { message: 'Out of range!' }
                  }));
                  return;
                }
              }
            }

            // Deduct mana
            if (spell.manaCost > 0) {
              state.spendMana(spell.manaCost);
            }

            // Play animation
            useStore.getState().triggerAnimation(spell.animation || 'Pistol_Aim_Up');

            // Apply HoT effect
            const targetId = state.selectedTargetId; // null means self
            window.dispatchEvent(new CustomEvent('apply-hot', {
              detail: {
                targetId,
                healPercent: spell.healPercent || 0.03,
                tickInterval: spell.tickInterval || 2,
                duration: spell.duration || 12,
                spellId: spell.id,
              }
            }));
            return;
          }

          // Handle channel spells (like Life Drain) - requires target and standing still
          if (spell.behavior === 'channel') {
            if (!state.selectedTargetId) {
              window.dispatchEvent(new CustomEvent('cast-error', {
                detail: { message: 'No target selected!' }
              }));
              return;
            }

            const keys = keysPressed.current;
            const isMoving = keys.w || keys.a || keys.s || keys.d;
            if (isMoving) {
              window.dispatchEvent(new CustomEvent('cast-error', {
                detail: { message: 'You must stand still to channel' }
              }));
              return;
            }

            // Check range
            const target = state.aiCharacters.find((ai) => ai.id === state.selectedTargetId);
            if (!target || target.health <= 0) {
              window.dispatchEvent(new CustomEvent('cast-error', {
                detail: { message: 'Invalid target!' }
              }));
              return;
            }

            const dx = target.position[0] - position.current.x;
            const dz = target.position[2] - position.current.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > (spell.range || 15)) {
              window.dispatchEvent(new CustomEvent('cast-error', {
                detail: { message: 'Out of range!' }
              }));
              return;
            }

            // Deduct mana
            if (spell.manaCost > 0) {
              state.spendMana(spell.manaCost);
            }

            // Start channeling
            channelRef.current = {
              spellId,
              startTime: now,
              targetId: state.selectedTargetId,
              duration: spell.duration || 3,
              tickRate: spell.tickRate || 1,
              lastTick: now,
              damage: spell.damage || 15,
            };

            // Play channel animation
            useStore.getState().triggerAnimation(spell.animation || 'Spell_Simple_Idle_Loop');
            isPlayingManualAnim.current = true;

            // Start visual effect for life drain
            if (spellId === 'lifedrain') {
              window.dispatchEvent(new CustomEvent('life-drain-start', {
                detail: { targetId: state.selectedTargetId }
              }));
            }
            return;
          }

          // Check if moving - cannot cast while moving (for non-instant spells)
          const keys = keysPressed.current;
          const isMoving = keys.w || keys.a || keys.s || keys.d;
          if (isMoving) {
            window.dispatchEvent(new CustomEvent('cast-error', {
              detail: { message: 'You must stand still to cast that' }
            }));
            return;
          }

          // Get cast time from settings slider, then spell default, then fallback
          const chargeTime = state.spellCastTimes?.[spellId] ?? spell.chargeTime ?? 0.2;

          // Start casting (must stand still) - pass startTime to ensure sync with CastBar
          state.startCasting(spellId, state.selectedTargetId, chargeTime, now);
          castingRef.current = {
            spellId,
            startTime: now,
            targetId: state.selectedTargetId,
            chargeTime: chargeTime,
          };
          hasSpawnedProjectile.current = false;

          // For longer casts (>0.4s), use idle + shoot animation sequence
          if (chargeTime > 0.4) {
            castPhase.current = 'idle';
            castPhaseStartTime.current = now;
            useStore.getState().triggerAnimation('Spell_Simple_Idle_Loop');
          } else {
            // Short cast - just play shoot animation
            castPhase.current = 'shoot';
            castPhaseStartTime.current = now;
            useStore.getState().triggerAnimation('Spell_Simple_Shoot');
          }
        }
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w') keysPressed.current.w = false;
      if (key === 'a') keysPressed.current.a = false;
      if (key === 's') keysPressed.current.s = false;
      if (key === 'd') keysPressed.current.d = false;
      if (key === ' ') keysPressed.current.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Listen for knockout teleport event to reposition player
  useEffect(() => {
    const handleKnockoutTeleport = (e) => {
      const { x, y, z } = e.detail;
      position.current = { x, y, z };
      velocity.current = { x: 0, y: 0, z: 0 };
      isGrounded.current = false; // Will be grounded after falling to tile
      isDead.current = false;
      fallTimer.current = 0;
      if (groupRef.current) {
        groupRef.current.position.set(x, y, z);
      }
      setCharacterPosition({ x, y, z });

      // Verify tiles exist at this position
      const state = useStore.getState();
      if (state.knockout?.tiles) {
        const tile = state.knockout.tiles.find(t =>
          t.isActive &&
          Math.abs(t.x - x) < 2.5 &&
          Math.abs(t.z - z) < 2.5
        );
        if (tile) {
        } else {
          console.error('[Knockout] ERROR: Teleport position NOT above any active tile!');
        }
      } else {
        console.error('[Knockout] ERROR: No tiles array when teleporting!');
      }
    };

    window.addEventListener('knockout-teleport-player', handleKnockoutTeleport);
    return () => window.removeEventListener('knockout-teleport-player', handleKnockoutTeleport);
  }, [setCharacterPosition]);

  // Listen for KOTH teleport event to reposition player at round start
  useEffect(() => {
    const handleKOTHTeleport = (e) => {
      const { x, y, z } = e.detail;
      position.current = { x, y, z };
      velocity.current = { x: 0, y: 0, z: 0 };
      isGrounded.current = true;
      if (groupRef.current) {
        groupRef.current.position.set(x, y, z);
      }
      setCharacterPosition({ x, y, z });
    };

    window.addEventListener('koth-teleport-player', handleKOTHTeleport);
    return () => window.removeEventListener('koth-teleport-player', handleKOTHTeleport);
  }, [setCharacterPosition]);

  // Listen for mirror image teleport event
  useEffect(() => {
    const handleMirrorImageTeleport = (e) => {
      const { x, y, z } = e.detail;
      position.current = { x, y, z };
      if (groupRef.current) {
        groupRef.current.position.set(x, y, z);
      }
      setCharacterPosition({ x, y, z });
    };

    window.addEventListener('mirror-image-teleport', handleMirrorImageTeleport);
    return () => window.removeEventListener('mirror-image-teleport', handleMirrorImageTeleport);
  }, [setCharacterPosition]);

  // Listen for timewarp-cancel event (from UI cancel button)
  useEffect(() => {
    const handleTimewarpCancel = () => {
      if (timewarpState.current) {
        window.dispatchEvent(new CustomEvent('timewarp-end'));
        timewarpState.current = null;
      }
    };

    window.addEventListener('timewarp-cancel', handleTimewarpCancel);
    return () => window.removeEventListener('timewarp-cancel', handleTimewarpCancel);
  }, []);

  // Listen for apply-hot event to start healing over time
  useEffect(() => {
    const handleApplyHoT = (e) => {
      const { targetId, healPercent, tickInterval, duration, spellId } = e.detail;
      const now = Date.now();

      // Add new HoT to active list
      activeHoTs.current.push({
        targetId, // null means self
        healPercent,
        tickInterval: tickInterval * 1000, // Convert to ms
        endTime: now + duration * 1000,
        lastTick: now, // Tick immediately on application
        spellId,
      });
    };

    window.addEventListener('apply-hot', handleApplyHoT);
    return () => window.removeEventListener('apply-hot', handleApplyHoT);
  }, []);

  // Listen for freeze-player event (from AI frost nova or freeze spell)
  useEffect(() => {
    const handleFreezePlayer = (e) => {
      const { duration } = e.detail; // duration in milliseconds
      const state = useStore.getState();
      // Don't freeze if player is defending
      if (!state.isPlayerDefending()) {
        state.freezePlayer(duration / 1000); // Convert to seconds
      }
    };

    window.addEventListener('freeze-player', handleFreezePlayer);
    return () => window.removeEventListener('freeze-player', handleFreezePlayer);
  }, []);

  // Listen for stun-player event (from AI stun spell)
  useEffect(() => {
    const handleStunPlayer = (e) => {
      const { duration } = e.detail; // duration in milliseconds
      const state = useStore.getState();
      // Don't stun if player is defending
      if (!state.isPlayerDefending()) {
        state.stunPlayer(duration / 1000); // Convert to seconds
      }
    };

    window.addEventListener('stun-player', handleStunPlayer);
    return () => window.removeEventListener('stun-player', handleStunPlayer);
  }, []);

  // Listen for pull-player event (from AI pull spell)
  useEffect(() => {
    const handlePullPlayer = (e) => {
      const { toX, toZ, stunDuration, fromX, fromZ, duration } = e.detail;
      const state = useStore.getState();
      // Don't pull if player is defending
      if (!state.isPlayerDefending()) {
        // Start gradual pull movement (not instant teleport)
        beingPulled.current = {
          fromX: fromX ?? position.current.x,
          fromZ: fromZ ?? position.current.z,
          toX: toX,
          toZ: toZ,
          startTime: Date.now(),
          duration: duration || 500, // Default 0.5s if not specified
          stunDuration: stunDuration || 0,
        };
      }
    };

    window.addEventListener('pull-player', handlePullPlayer);
    return () => window.removeEventListener('pull-player', handlePullPlayer);
  }, []);

  // Player opacity ref for mirror image effect
  const playerOpacity = useRef(1.0);
  const originalColors = useRef(new Map()); // Store original colors for restoration

  // Listen for player-fade event (mirror image effect)
  useEffect(() => {
    const handlePlayerFade = (e) => {
      const { opacity } = e.detail;
      playerOpacity.current = opacity;

      // Apply opacity to all meshes in the model
      if (clonedScene) {
        clonedScene.traverse((child) => {
          if (child.isMesh && child.material) {
            // Clone material if not already transparent
            if (!child.material.transparent) {
              child.material = child.material.clone();
              child.material.transparent = true;
            }

            // Store original color on first fade
            if (opacity < 1.0 && child.material.color && !originalColors.current.has(child.uuid)) {
              originalColors.current.set(child.uuid, child.material.color.clone());
            }

            child.material.opacity = opacity;

            if (opacity < 1.0 && child.material.color) {
              // Add ghostly tint when faded
              const origColor = originalColors.current.get(child.uuid);
              if (origColor) {
                child.material.color.copy(origColor).lerp(new THREE.Color('#aaaaff'), 0.3);
              }
            } else if (opacity >= 1.0 && child.material.color) {
              // Restore original color when fully visible
              const origColor = originalColors.current.get(child.uuid);
              if (origColor) {
                child.material.color.copy(origColor);
              }
            }
          }
        });
      }
    };

    window.addEventListener('player-fade', handlePlayerFade);
    return () => window.removeEventListener('player-fade', handlePlayerFade);
  }, [clonedScene]);

  // Blue tint effect for frozen/stunned player
  const frozenTintColors = useRef(new Map()); // Store original colors for frozen tint
  const wasFrozenOrStunned = useRef(false);

  useEffect(() => {
    // Check frozen/stunned state periodically
    const checkFrozenState = () => {
      const state = useStore.getState();
      const now = Date.now();
      const isFrozenOrStunned = (state.playerFrozenUntil > now) || (state.playerStunnedUntil > now);

      if (isFrozenOrStunned && !wasFrozenOrStunned.current && clonedScene) {
        // Apply blue tint
        wasFrozenOrStunned.current = true;
        clonedScene.traverse((child) => {
          if (child.isMesh && child.material && child.material.color) {
            // Store original color
            if (!frozenTintColors.current.has(child.uuid)) {
              frozenTintColors.current.set(child.uuid, child.material.color.clone());
            }
            // Clone material if needed
            if (!child.material._isCloned) {
              child.material = child.material.clone();
              child.material._isCloned = true;
            }
            // Apply blue tint
            const origColor = frozenTintColors.current.get(child.uuid);
            if (origColor) {
              child.material.color.copy(origColor).lerp(new THREE.Color('#4488ff'), 0.5);
            }
          }
        });
      } else if (!isFrozenOrStunned && wasFrozenOrStunned.current && clonedScene) {
        // Remove blue tint - restore original colors
        wasFrozenOrStunned.current = false;
        clonedScene.traverse((child) => {
          if (child.isMesh && child.material && child.material.color) {
            const origColor = frozenTintColors.current.get(child.uuid);
            if (origColor) {
              child.material.color.copy(origColor);
            }
          }
        });
      }
    };

    const interval = setInterval(checkFrozenState, 100); // Check every 100ms
    return () => clearInterval(interval);
  }, [clonedScene]);

  // Raycast to find AI at mouse position - uses cylinder hit detection
  const raycastForAI = (clientX, clientY) => {
    const mouse = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);

    // Check distance to each AI character using cylinder collision
    const state = useStore.getState();
    const rayOrigin = raycaster.ray.origin;
    const rayDir = raycaster.ray.direction;

    // Get configurable hitbox dimensions from store
    const baseHitboxRadius = state.hitboxRadius;
    const hitboxBottom = state.hitboxBottom;
    const hitboxTop = state.hitboxTop;

    let closestAI = null;
    let closestDist = Infinity;

    // Use knockout AIs in knockout mode, otherwise use test mode AIs
    const aiList = state.gameMode === 'knockout'
      ? (state.knockoutAIs || []).filter(ai => ai.isAlive).map(ai => ({ ...ai, health: 100 }))
      : state.aiCharacters;

    for (const ai of aiList) {
      if (ai.health <= 0) continue;

      // Increase hitbox for moving characters (running = state RUN, CHASE, or currentAnimation contains Sprint)
      const isMovingFast = ai.state === 'RUN' || ai.state === 'CHASE' ||
        (ai.currentAnimation && ai.currentAnimation.includes('Sprint'));
      const hitboxRadius = isMovingFast ? baseHitboxRadius * 1.5 : baseHitboxRadius;

      // Cylinder from hitboxBottom to hitboxTop
      const cylBottom = ai.position[1] + hitboxBottom;
      const cylTop = ai.position[1] + hitboxTop;
      const cylX = ai.position[0];
      const cylZ = ai.position[2];

      // Ray-cylinder intersection (infinite cylinder first, then clamp to height)
      // Solve for t where |rayOrigin.xz + t * rayDir.xz - cyl.xz| = radius
      const dx = rayOrigin.x - cylX;
      const dz = rayOrigin.z - cylZ;

      const a = rayDir.x * rayDir.x + rayDir.z * rayDir.z;
      const b = 2 * (dx * rayDir.x + dz * rayDir.z);
      const c = dx * dx + dz * dz - hitboxRadius * hitboxRadius;

      const discriminant = b * b - 4 * a * c;

      if (discriminant < 0) continue; // No intersection

      const sqrtDisc = Math.sqrt(discriminant);
      let t = (-b - sqrtDisc) / (2 * a);
      if (t < 0) t = (-b + sqrtDisc) / (2 * a);
      if (t < 0) continue; // Behind camera

      // Check if hit point is within cylinder height
      const hitY = rayOrigin.y + t * rayDir.y;
      if (hitY < cylBottom || hitY > cylTop) continue;

      // Valid hit
      if (t < closestDist) {
        closestDist = t;
        closestAI = ai.id;
      }
    }
    return closestAI;
  };

  // Handle mouse
  useEffect(() => {
    let mouseDownPos = { x: 0, y: 0 };
    let mouseDownTime = 0;
    let isClick = false;
    const CLICK_TIME_THRESHOLD = 250; // Max ms for a click (longer = camera drag, not selection)

    const handleMouseDown = (e) => {
      mouseDownPos = { x: e.clientX, y: e.clientY };
      mouseDownTime = Date.now();
      isClick = true;

      if (e.button === 0) {
        leftMouseDown.current = true;
        // Capture character's current facing direction as reference for movement
        leftClickReferenceAngle.current = modelRotation.current;
        // Left click also rotates camera (but doesn't affect character targeting)
        isRotating.current = true;
        lastMouseX.current = e.clientX;
        lastMouseY.current = e.clientY;
      }
      if (e.button === 2) {
        rightMouseDown.current = true;
        isRotating.current = true;
        lastMouseX.current = e.clientX;
        lastMouseY.current = e.clientY;
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 0) {
        leftMouseDown.current = false;
        // Stop rotating only if right mouse is also not down
        if (!rightMouseDown.current) {
          isRotating.current = false;
        }
      }
      if (e.button === 2) {
        rightMouseDown.current = false;
        // Stop rotating only if left mouse is also not down
        if (!leftMouseDown.current) {
          isRotating.current = false;
        }
      }

      // Check if ground target mode is active
      const storeState = useStore.getState();
      if (storeState.groundTargetMode) {
        if (e.button === 0) {
          // Left click - commit to spell
          const targetPos = storeState.groundTargetPosition;
          if (targetPos) {
            const spell = SPELLS[storeState.groundTargetMode.spellId];
            if (spell && spell.manaCost <= storeState.playerStats.mana) {
              // Deduct mana
              storeState.spendMana(spell.manaCost);

              if (storeState.groundTargetMode.spellId === 'meteor') {
                // Meteor - spawn falling meteor
                const impactRadius = storeState.groundTargetMode.impactRadius || 5;
                const delay = storeState.groundTargetMode.delay || 1.5;
                const damage = storeState.groundTargetMode.damage || 80;

                // Play casting animation
                useStore.getState().triggerAnimation(spell.animation || 'Spell_Simple_Shoot');

                // Spawn meteor
                window.dispatchEvent(new CustomEvent('meteor-spawn', {
                  detail: {
                    x: targetPos.x,
                    z: targetPos.z,
                    delay: delay,
                    impactRadius: impactRadius,
                    damage: damage,
                  }
                }));

                // Damage will be dealt when meteor impacts (handled by MeteorEffect)
                // Listen for meteor impact to deal damage
                const handleMeteorImpact = (impactEvent) => {
                  const { x, z, radius, damage: impactDamage } = impactEvent.detail;
                  const currentState = useStore.getState();

                  for (const ai of currentState.aiCharacters) {
                    if (ai.health <= 0) continue;
                    const dx = ai.position[0] - x;
                    const dz = ai.position[2] - z;
                    const dist = Math.sqrt(dx * dx + dz * dz);

                    if (dist <= radius) {
                      currentState.damageAICharacter(ai.id, impactDamage);
                      window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: ai.id } }));
                    }
                  }
                  window.removeEventListener('meteor-impact', handleMeteorImpact);
                };
                window.addEventListener('meteor-impact', handleMeteorImpact);
              } else {
                // Start the colossal smash jump
                smashState.current = {
                  targetPos: { x: targetPos.x, z: targetPos.z },
                  phase: 'jumping',
                  damage: storeState.groundTargetMode.damage || 40,
                };

                // Play jump animation
                const jumpAction = actionsRef.current?.['Jump_Start'];
                if (jumpAction) {
                  isPlayingManualAnim.current = true;
                  Object.values(actionsRef.current).forEach(action => {
                    if (action) action.fadeOut(0.1);
                  });
                  jumpAction.reset();
                  jumpAction.setLoop(THREE.LoopOnce, 1);
                  jumpAction.fadeIn(0.1).play();
                  currentAnim.current = 'Jump_Start';
                }

                // Face the target
                const dx = targetPos.x - position.current.x;
                const dz = targetPos.z - position.current.z;
                targetModelRotation.current = Math.atan2(-dx, -dz);
                modelRotation.current = targetModelRotation.current;
              }
            }
          }
          storeState.clearGroundTargetMode();
        } else if (e.button === 2) {
          // Right click - cancel
          storeState.clearGroundTargetMode();
        }
        isClick = false;
        return; // Don't process normal click handling
      }

      // Check if it was a quick click (not a drag or hold)
      // Must be within 10px and under 250ms to count as a selection click
      const dx = e.clientX - mouseDownPos.x;
      const dy = e.clientY - mouseDownPos.y;
      const dragDistance = Math.sqrt(dx * dx + dy * dy);
      const clickDuration = Date.now() - mouseDownTime;

      if (dragDistance < 10 && clickDuration < CLICK_TIME_THRESHOLD && isClick) {
        const hitAI = raycastForAI(e.clientX, e.clientY);

        if (e.button === 0) {
          // Left click - select target
          useStore.getState().setSelectedTarget(hitAI);
        } else if (e.button === 2) {
          // Right click - select target AND enable auto attack
          if (hitAI) {
            useStore.getState().setSelectedTarget(hitAI);
            isAutoAttacking.current = true;
            setAutoAttacking(true);
          } else {
            // Right click on nothing - disable auto attack
            isAutoAttacking.current = false;
            setAutoAttacking(false);
          }
        }
      }

      isClick = false;
    };

    const handleMouseMove = (e) => {
      if (isRotating.current) {
        const deltaX = e.clientX - lastMouseX.current;
        const deltaY = e.clientY - lastMouseY.current;

        cameraRotation.current -= deltaX * 0.01;

        const currentPitch = useStore.getState().cameraPitch;
        const newPitch = Math.max(-0.5, Math.min(1.2, currentPitch + deltaY * 0.005));
        useStore.getState().setCameraPitch(newPitch);

        lastMouseX.current = e.clientX;
        lastMouseY.current = e.clientY;

        // Mark as drag, not click
        isClick = false;
      }
    };

    const handleContextMenu = (e) => e.preventDefault();

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [camera, raycaster]);

  // Start idle animation
  useEffect(() => {
    if (actions && actions['Idle_Loop']) {
      const action = actions['Idle_Loop'];
      action.reset();
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.play();
      setCurrentAnimation('Idle_Loop');
    }
  }, [actions, setCurrentAnimation]);

  // Game loop
  useFrame((state, delta) => {
    if (!groupRef.current || !modelRef.current) return;

    const storeState = useStore.getState();

    // Track falling - if player is below y = -5, they're falling off the map
    const FALL_THRESHOLD = -5;
    const FALL_DEATH_TIME = storeState.gameMode === 'knockout' ? 0.5 : 5; // Instant in knockout

    if (position.current.y < FALL_THRESHOLD) {
      fallTimer.current += delta;
      if (fallTimer.current >= FALL_DEATH_TIME && !isDead.current) {
        // Fall death
        isDead.current = true;

        // In knockout mode, show death screen before spectating
        if (storeState.gameMode === 'knockout') {
          setPlayerDead(true, 'falling');
          storeState.setKnockoutState({ showDeathScreen: true });
          // Record player death to leaderboard
          storeState.recordKnockoutDeath('player', 'You');
        } else {
          setPlayerDead(true, 'falling');
        }

        isAutoAttacking.current = false;
        setAutoAttacking(false);

        // De-aggro all AI
        storeState.aiCharacters.forEach((ai) => {
          if (ai.aggroTarget) {
            storeState.updateAICharacter(ai.id, { aggroTarget: null });
          }
        });
      }
    } else {
      fallTimer.current = 0; // Reset fall timer when on ground
    }

    // Check for combat death
    if (storeState.playerStats.health <= 0 && !isDead.current) {
      isDead.current = true;
      setPlayerDead(true, 'combat');
      deathTimer.current = 0;
      isAutoAttacking.current = false;
      setAutoAttacking(false);

      // De-aggro all AI
      storeState.aiCharacters.forEach((ai) => {
        if (ai.aggroTarget) {
          storeState.updateAICharacter(ai.id, { aggroTarget: null });
        }
      });

      // Play death animation
      useStore.getState().triggerAnimation('Death01');
    }

    // Handle death state - wait for respawn button click
    if (isDead.current) {
      // Use store state directly (not hook value) for real-time updates in useFrame
      const currentIsPlayerDead = storeState.isPlayerDead;
      const currentDeathCause = storeState.deathCause;
      const isKnockoutMode = storeState.gameMode === 'knockout';
      const isSpectating = storeState.knockout?.isSpectating;
      const knockoutPhase = storeState.knockout?.phase;

      // In knockout mode, player doesn't respawn - they spectate
      if (isKnockoutMode) {
        // Check if a new game is starting (phase reset to waiting or countdown)
        if (!currentIsPlayerDead && (knockoutPhase === 'waiting' || knockoutPhase === 'countdown')) {
          // New game starting - reset death state and make character visible
          isDead.current = false;
          groupRef.current.visible = true;
          fallTimer.current = 0;
          velocity.current = { x: 0, y: 0, z: 0 };

          // Safety check: if player is below tiles, reset to center
          if (position.current.y < -5) {
            position.current = { x: 0, y: 0.5, z: 0 };
            groupRef.current.position.set(0, 0.5, 0);
            setCharacterPosition({ x: 0, y: 0.5, z: 0 });
          }
          // Position will be set by knockout-teleport event
        } else if (isSpectating) {
          // Hide character far below the map while spectating
          groupRef.current.position.set(0, -1000, 0);
          groupRef.current.visible = false;
          return; // Don't process input while spectating
        } else if (currentDeathCause === 'falling') {
          // Still showing death screen - continue falling animation
          velocity.current.y -= settings.gravity * delta;
          position.current.y += velocity.current.y * delta;
          groupRef.current.position.set(position.current.x, position.current.y, position.current.z);
          setCharacterPosition({ ...position.current });
          return; // Don't process input while dead
        }
        if (isDead.current) return; // Still dead, don't process input
      }

      // Test mode: Check if player clicked respawn (store isPlayerDead becomes false)
      if (!currentIsPlayerDead && !isKnockoutMode) {
        // Respawn player
        isDead.current = false;
        fallTimer.current = 0;
        position.current = { x: 0, y: 0, z: 0 };
        velocity.current = { x: 0, y: 0, z: 0 };
        isPlayingManualAnim.current = false;
        isGrounded.current = true;
        // Clear any locked direction and key states to prevent auto-movement
        lockedDirection.current = null;
        keysPressed.current = { w: false, a: false, s: false, d: false, space: false };
        rollBuff.current = null;
        chargeState.current = null;
        smashState.current = null;
        channelRef.current = null;
        castingRef.current = null;
      } else {
        // Still dead - keep falling if that's how we died, otherwise stay put
        if (currentDeathCause === 'falling') {
          // Continue falling
          velocity.current.y -= settings.gravity * delta;
          position.current.y += velocity.current.y * delta;
          groupRef.current.position.set(position.current.x, position.current.y, position.current.z);
          setCharacterPosition({ ...position.current });
        }
        // For combat death, character stays in death pose on ground
      }
      return; // Don't process input while dead
    }

    // Handle being pulled - gradual movement to caster
    if (beingPulled.current) {
      const pull = beingPulled.current;
      const elapsed = Date.now() - pull.startTime;
      const progress = Math.min(1, elapsed / pull.duration);

      // Interpolate position
      position.current.x = pull.fromX + (pull.toX - pull.fromX) * progress;
      position.current.z = pull.fromZ + (pull.toZ - pull.fromZ) * progress;

      // Face the direction of movement
      const dx = pull.toX - pull.fromX;
      const dz = pull.toZ - pull.fromZ;
      targetModelRotation.current = Math.atan2(-dx, -dz);
      modelRotation.current = targetModelRotation.current;

      // Play pull animation (being dragged)
      playMovementAnimation('Jump_Loop');

      // Update visual position
      groupRef.current.position.set(position.current.x, position.current.y, position.current.z);
      if (modelRef.current) {
        modelRef.current.rotation.y = modelRotation.current + Math.PI;
      }
      setCharacterPosition({ ...position.current });

      // Check if pull complete
      if (progress >= 1) {
        // Apply stun now that we've arrived
        if (pull.stunDuration > 0) {
          storeState.stunPlayer(pull.stunDuration / 1000); // Convert to seconds
        }
        // Dispatch pull-complete event to end visual effect
        window.dispatchEvent(new CustomEvent('pull-complete', {
          detail: { targetId: 'player' }
        }));
        beingPulled.current = null;
      }

      return; // Skip normal movement while being pulled
    }

    // Handle frozen state - player cannot move or act but can still fall
    const isPlayerFrozen = storeState.playerFrozenUntil > Date.now();
    // Handle stunned state - player cannot move or cast (loss of control)
    const isPlayerStunned = storeState.playerStunnedUntil > Date.now();

    if (isPlayerFrozen || isPlayerStunned) {
      // Play appropriate animation - stunned uses Fixing_Kneeling like test mode
      playMovementAnimation(isPlayerFrozen ? 'Idle_Loop' : 'Fixing_Kneeling');

      // In knockout mode, apply gravity to allow falling off disappearing tiles
      if (storeState.gameMode === 'knockout' && storeState.knockout?.tiles) {
        const tiles = storeState.knockout.tiles;
        const tileHalfSize = 2.5;
        const tileTop = 0.25;

        // Check if player is on an active tile
        let onActiveTile = false;
        let onFadingTile = false;
        for (const tile of tiles) {
          if (!tile.isActive) continue;
          if (
            position.current.x >= tile.x - tileHalfSize &&
            position.current.x <= tile.x + tileHalfSize &&
            position.current.z >= tile.z - tileHalfSize &&
            position.current.z <= tile.z + tileHalfSize
          ) {
            onActiveTile = true;
            if (tile.isFading) onFadingTile = true;
            break;
          }
        }

        // Apply gravity - 200% faster (3x) when frozen or stunned
        const gravityMultiplier = 3; // Frozen/stunned players fall 3x faster

        if (!onActiveTile || position.current.y > tileTop + 0.1) {
          // Falling - apply gravity
          velocity.current.y -= settings.gravity * gravityMultiplier * delta;
          position.current.y += velocity.current.y * delta;
        } else if (position.current.y < tileTop) {
          // Snap to tile surface
          position.current.y = tileTop;
          velocity.current.y = 0;
        }

        // Check for death
        if (position.current.y < -5) {
          // Fallen to death
          storeState.recordKnockoutDeath('player', storeState.playerName || 'Player');
          storeState.setPlayerDead(true, 'falling');
        }
      }

      // Update position but don't rotate character to face camera direction
      // (character should stay facing the direction they were facing when frozen/stunned)
      groupRef.current.position.set(position.current.x, position.current.y, position.current.z);
      if (modelRef.current) {
        // Keep current model rotation, don't update to match camera
        modelRef.current.rotation.y = modelRotation.current + Math.PI;
      }
      setCharacterPosition({ ...position.current });
      return; // Don't process movement input while frozen/stunned
    }

    // Handle knockout mode countdown freeze
    const knockoutPhase = storeState.knockout?.phase;
    if (storeState.gameMode === 'knockout' && (knockoutPhase === 'countdown' || knockoutPhase === 'waiting')) {
      // Freeze player during countdown
      playMovementAnimation('Idle_Loop');
      groupRef.current.position.set(position.current.x, position.current.y, position.current.z);
      if (modelRef.current) {
        modelRef.current.rotation.y = modelRotation.current + Math.PI;
      }
      setCharacterPosition({ ...position.current });
      return; // Don't process input during countdown
    }

    // Handle held state - player loses control, follows holder
    const isPlayerHeld = storeState.playerHeldUntil > Date.now();
    if (isPlayerHeld && storeState.playerHeldBy) {
      // Find the AI holding the player
      const holder = storeState.aiCharacters.find((ai) => ai.id === storeState.playerHeldBy);
      if (holder && holder.health > 0) {
        // Position player in front of holder
        const holderPos = holder.position;
        // Estimate holder's facing direction from their state/movement
        playMovementAnimation('Jump_Loop'); // Flailing animation

        // Set camera to face holder's direction
        const holderFacing = Math.atan2(
          characterPosition.x - holderPos[0],
          characterPosition.z - holderPos[2]
        );
        cameraRotation.current = holderFacing;

        groupRef.current.position.set(position.current.x, position.current.y, position.current.z);
        setCharacterPosition({ ...position.current });
        return; // Don't process input while held
      }
    }

    const keys = keysPressed.current;
    // Check if carrying someone - force walk speed when carrying
    const isCarrying = storeState.aiCharacters.some((ai) => ai.pickedUpUntil && Date.now() < ai.pickedUpUntil);
    let speed = (storeState.isRunning && !isCarrying) ? settings.runSpeed : settings.walkSpeed;
    const { jumpForce, gravity } = settings;
    const airControl = settings.airControl ?? 0.3;

    // Apply roll speed buff if active
    if (rollBuff.current && Date.now() < rollBuff.current.endTime) {
      speed *= rollBuff.current.speedMultiplier;
    } else if (rollBuff.current) {
      rollBuff.current = null; // Clear expired buff
      lockedDirection.current = null; // Clear direction lock when roll ends
    }

    // Infected players speed bonus in infection mode (20% -> 10% -> 0% as more get infected)
    if (storeState.gameMode === 'infection' && storeState.infection?.isPlayerInfected) {
      speed *= storeState.getInfectedSpeedBonus();
    }

    let moveX = 0;
    let moveZ = 0;

    // Both mouse buttons held = move forward
    if (leftMouseDown.current && rightMouseDown.current) {
      moveZ -= 1;
    }

    if (keys.w) moveZ -= 1;
    if (keys.s) moveZ += 1;
    if (keys.a) moveX -= 1;
    if (keys.d) moveX += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;

    // Cancel spell cast if moving
    if (isMoving && castingRef.current && !hasSpawnedProjectile.current) {
      castingRef.current = null;
      storeState.stopCasting();
      isPlayingManualAnim.current = false;
    }

    // Calculate facing direction based on input
    // A = left (-X in local), D = right (+X in local)
    // W = forward (-Z in local), S = backward (+Z in local)
    if (isMoving) {
      const inputAngle = Math.atan2(-moveX, -moveZ);
      if (leftMouseDown.current && !rightMouseDown.current) {
        // Left click only: face movement direction relative to the angle when left click started
        // Camera moves independently, WASD controls direction relative to original facing
        targetModelRotation.current = leftClickReferenceAngle.current + inputAngle;
      } else {
        // Normal mode: face movement direction relative to camera
        targetModelRotation.current = cameraRotation.current + inputAngle;
      }
    }

    // Smooth model rotation
    if (isMoving) {
      let rotDiff = targetModelRotation.current - modelRotation.current;
      while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
      while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
      modelRotation.current += rotDiff * 0.15;
    }

    // Normalize movement
    const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (length > 0) {
      moveX /= length;
      moveZ /= length;
    }

    // World movement
    // When only left click is held (camera-only mode), movement is relative to the angle when left click started
    // Otherwise, movement is relative to camera direction
    const movementAngle = (leftMouseDown.current && !rightMouseDown.current)
      ? leftClickReferenceAngle.current
      : cameraRotation.current;
    const cos = Math.cos(movementAngle);
    const sin = Math.sin(movementAngle);
    let worldMoveX = moveX * cos + moveZ * sin;
    let worldMoveZ = -moveX * sin + moveZ * cos;

    // Use locked direction if active (during jump or roll)
    if (lockedDirection.current) {
      worldMoveX = lockedDirection.current.x;
      worldMoveZ = lockedDirection.current.z;
    }

    // Apply air control - reduced influence when airborne
    if (isGrounded.current) {
      // Full control on ground
      velocity.current.x = worldMoveX * speed;
      velocity.current.z = worldMoveZ * speed;
    } else {
      // In air: use locked direction (no air control when direction is locked)
      if (lockedDirection.current) {
        velocity.current.x = worldMoveX * speed;
        velocity.current.z = worldMoveZ * speed;
      } else {
        // Blend current momentum with input based on airControl
        const targetVelX = worldMoveX * speed;
        const targetVelZ = worldMoveZ * speed;
        velocity.current.x += (targetVelX - velocity.current.x) * airControl;
        velocity.current.z += (targetVelZ - velocity.current.z) * airControl;
      }
    }

    // Current time for cooldown checks
    const now = Date.now();
    const gcd = (storeState.combatSettings?.globalCooldown || 0.5) * 1000;

    // Mana regeneration
    const manaRegenRate = storeState.combatSettings?.manaRegenRate || 5;
    if (now - lastManaRegenTime.current >= 1000) { // Every second
      lastManaRegenTime.current = now;
      if (storeState.playerStats.mana < storeState.playerStats.maxMana) {
        regenMana(manaRegenRate);
      }
    }

    // Process active HoTs (healing over time)
    if (activeHoTs.current.length > 0) {
      const stillActive = [];
      for (const hot of activeHoTs.current) {
        // Check if HoT has expired
        if (now >= hot.endTime) {
          continue; // Remove expired HoT
        }

        // Check if it's time for a tick
        if (now - hot.lastTick >= hot.tickInterval) {
          hot.lastTick = now;

          if (hot.targetId) {
            // Heal AI target
            const target = storeState.aiCharacters.find((ai) => ai.id === hot.targetId);
            if (target && target.health > 0) {
              const healAmount = target.maxHealth * hot.healPercent;
              storeState.healAICharacter(hot.targetId, healAmount);
            }
          } else {
            // Heal self (player)
            const healAmount = storeState.playerStats.maxHealth * hot.healPercent;
            healPlayer(healAmount);
          }
        }

        stillActive.push(hot);
      }
      activeHoTs.current = stillActive;
    }

    // Jump (with global cooldown) - includes double jump support
    // KOTH mode: No air jumping allowed (prevents jumping back towards pyramid when knocked away)
    if (keys.space && (now - lastActionTime.current >= gcd)) {
      if (isGrounded.current) {
        // Normal jump from ground
        lastActionTime.current = now;
        velocity.current.y = jumpForce;
        isGrounded.current = false;
        keysPressed.current.space = false;
        isPlayingManualAnim.current = false; // Allow jump animation

        // Lock movement direction at moment of jump
        lockedDirection.current = { x: worldMoveX, z: worldMoveZ };
      } else if (storeState.gameMode === 'koth') {
        // KOTH mode: No air jumping allowed - just consume the key press
        keysPressed.current.space = false;
      } else if (doubleJumpReady.current && !hasDoubleJumped.current) {
        // Double jump in mid-air (already activated via spell key)
        lastActionTime.current = now;
        velocity.current.y = jumpForce;
        hasDoubleJumped.current = true;
        keysPressed.current.space = false;
        playMovementAnimation('Jump_Start', 0.1);
        lockedDirection.current = { x: worldMoveX, z: worldMoveZ };

        // Start cooldown when second jump is used via space
        const cooldownDuration = 3000;
        spellCooldowns.current['doublejump'] = now + cooldownDuration;
        window.dispatchEvent(new CustomEvent('spell-cooldown', {
          detail: { spellId: 'doublejump', cooldownUntil: now + cooldownDuration, duration: cooldownDuration }
        }));
      } else if (!isGrounded.current && !doubleJumpReady.current && !hasDoubleJumped.current) {
        // Check if double jump is equipped in any slot and not on cooldown
        const slots = storeState.gameMode === 'knockout'
          ? { '1': storeState.knockout?.selectedSpell }
          : storeState.spellSlots;
        const hasDoubleJumpEquipped = Object.values(slots || {}).includes('doublejump');
        const djCooldown = spellCooldowns.current['doublejump'];
        const isOnCooldown = djCooldown && now < djCooldown;

        if (hasDoubleJumpEquipped && !isOnCooldown) {
          // Use double jump via space bar
          lastActionTime.current = now;
          velocity.current.y = jumpForce;
          keysPressed.current.space = false;
          playMovementAnimation('Jump_Start', 0.1);
          lockedDirection.current = { x: worldMoveX, z: worldMoveZ };

          // Start cooldown
          const cooldownDuration = 3000;
          spellCooldowns.current['doublejump'] = now + cooldownDuration;
          window.dispatchEvent(new CustomEvent('spell-cooldown', {
            detail: { spellId: 'doublejump', cooldownUntil: now + cooldownDuration, duration: cooldownDuration }
          }));
        }
      }
    }

    // Gravity
    if (!isGrounded.current) {
      velocity.current.y -= gravity * delta;
    }

    // Save old position for collision resolution
    const oldX = position.current.x;
    const oldY = position.current.y;
    const oldZ = position.current.z;

    // Apply movement
    position.current.x += velocity.current.x * delta;
    position.current.y += velocity.current.y * delta;
    position.current.z += velocity.current.z * delta;

    // Step height - max height player can automatically step up
    const stepHeight = 0.5;
    const playerRadius = 0.3;

    // Calculate ground level and handle collisions with landscape blocks
    // Check if player is within the main ground bounds (centered at origin)
    const halfGround = groundSize / 2;
    let isOnMainGround =
      position.current.x >= -halfGround && position.current.x <= halfGround &&
      position.current.z >= -halfGround && position.current.z <= halfGround;

    // In knockout mode, check if on an active tile instead
    let knockoutTileLevel = null;
    if (storeState.gameMode === 'knockout' && storeState.knockout?.tiles) {
      isOnMainGround = false; // Default to falling
      const tiles = storeState.knockout.tiles;
      const activeTiles = tiles.filter(t => t.isActive);
      const tileHalfSize = 2.5; // Match tile size (5m tiles = 2.5 half size)
      const tileTop = 0.25; // Tile top surface
      const fallDeathThreshold = -5; // Below this, player is falling to death
      // Max height above tile to consider "landable" - prevents glitching onto tiles when jumping high
      const maxLandingHeight = 3.0;

      // If no active tiles yet (during initialization), don't let player fall
      if (activeTiles.length === 0) {
        isOnMainGround = true;
        knockoutTileLevel = tileTop;
      } else {
        // If player is below death threshold, they're falling to death - don't check tiles
        if (position.current.y < fallDeathThreshold) {
          isOnMainGround = false;
        } else {
          // Check if player is horizontally over any active tile
          for (const tile of activeTiles) {
            if (
              position.current.x >= tile.x - tileHalfSize &&
              position.current.x <= tile.x + tileHalfSize &&
              position.current.z >= tile.z - tileHalfSize &&
              position.current.z <= tile.z + tileHalfSize
            ) {
              // Player is over this tile - only count as ground if close enough to land
              // This prevents glitching onto tiles when jumping high above them
              if (position.current.y <= tileTop + maxLandingHeight) {
                isOnMainGround = true;
                knockoutTileLevel = tileTop;
              }
              break;
            }
          }
        }
      }

    }

    // Start with -Infinity if not on ground, otherwise ground level
    // For knockout mode, ground level is 0.25 (tile top surface)
    let groundLevel = isOnMainGround ? (knockoutTileLevel !== null ? knockoutTileLevel : 0) : -Infinity;
    for (const block of landscapeBlocks) {
      const w = block.width || 10;
      const l = block.length || 10;
      const h = block.blockHeight || 1;
      const rotX = (block.rotationX || 0) * Math.PI / 180;
      const rotY = (block.rotationY || 0) * Math.PI / 180;
      const rotZ = (block.rotationZ || 0) * Math.PI / 180;

      // Block center
      const cx = block.x + w / 2;
      const cy = block.height + h / 2;
      const cz = block.z + l / 2;

      // Transform player position to block's local space
      let px = position.current.x - cx;
      let py = position.current.y - cy;
      let pz = position.current.z - cz;

      // Apply inverse rotation to match Three.js visual rotation direction
      if (rotY !== 0) {
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const newPx = px * cosY - pz * sinY;
        const newPz = px * sinY + pz * cosY;
        px = newPx;
        pz = newPz;
      }

      // Check if player is within block bounds (in local space)
      const halfW = w / 2;
      const halfH = h / 2;
      const halfL = l / 2;

      const inX = Math.abs(px) < halfW + playerRadius;
      const inY = Math.abs(py) < halfH + 1; // +1 for player height
      const inZ = Math.abs(pz) < halfL + playerRadius;

      if (inX && inZ) {
        // Player is within XZ bounds of block
        const blockTop = block.height + h;

        // Handle angled surfaces (X rotation creates a ramp)
        // Negate rotations to match Three.js visual rotation direction
        let surfaceY = blockTop;
        if (rotX !== 0) {
          // Calculate surface height at player's local Z position
          const slopeOffset = Math.tan(-rotX) * pz;
          surfaceY = blockTop + slopeOffset;
        }
        if (rotZ !== 0) {
          // Calculate surface height at player's local X position
          const slopeOffset = Math.tan(-rotZ) * px;
          surfaceY = blockTop + slopeOffset;
        }

        // Check if approaching from above (can land on it)
        if (oldY >= surfaceY - stepHeight) {
          if (surfaceY > groundLevel) {
            groundLevel = surfaceY;
          }
        } else if (inY) {
          // Hitting from the side - push player completely outside the block
          // Calculate actual penetration depth and push out by that amount
          const overlapX = halfW + playerRadius - Math.abs(px);
          const overlapZ = halfL + playerRadius - Math.abs(pz);

          // Push out on the axis with smallest overlap (shortest escape path)
          if (overlapX < overlapZ && overlapX > 0) {
            // Push out on X axis - move player outside block edge
            const pushDir = px > 0 ? 1 : -1;
            const pushAmount = overlapX + 0.01; // Small buffer to prevent edge cases
            // Apply push in world space (accounting for block center)
            position.current.x = cx + pushDir * (halfW + playerRadius + 0.01);
            velocity.current.x = 0;
          } else if (overlapZ > 0) {
            // Push out on Z axis - move player outside block edge
            const pushDir = pz > 0 ? 1 : -1;
            const pushAmount = overlapZ + 0.01;
            position.current.z = cz + pushDir * (halfL + playerRadius + 0.01);
            velocity.current.z = 0;
          }
        }
      }
    }

    // Calculate ground level for obstacles (walkable surfaces)
    const obstacles = useStore.getState().obstacles;
    for (const obs of obstacles) {
      // Spinner platform - circular, radius 3
      if (obs.type === 'spinner') {
        const dx = position.current.x - obs.x;
        const dz = position.current.z - obs.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 3) {
          const obsTop = 0.75; // Platform height
          if (position.current.y >= 0 && obsTop > groundLevel) {
            groundLevel = obsTop;
          }
        }
      }
      // Conveyor belt - 6x2 box
      if (obs.type === 'conveyor') {
        const rotY = (obs.rotationY || 0) * Math.PI / 180;
        // Rotate player position relative to conveyor
        const dx = position.current.x - obs.x;
        const dz = position.current.z - obs.z;
        const rx = dx * Math.cos(-rotY) - dz * Math.sin(-rotY);
        const rz = dx * Math.sin(-rotY) + dz * Math.cos(-rotY);
        if (Math.abs(rx) < 3 && Math.abs(rz) < 1) {
          const obsTop = 0.3;
          if (position.current.y >= 0 && obsTop > groundLevel) {
            groundLevel = obsTop;
          }
        }
      }
      // Bouncer pad - circular, radius 1.5
      if (obs.type === 'bouncer') {
        const dx = position.current.x - obs.x;
        const dz = position.current.z - obs.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 1.5) {
          const obsTop = 0.5;
          if (position.current.y >= 0 && obsTop > groundLevel) {
            groundLevel = obsTop;
          }
        }
      }
      // Flipper platform - 4x4 box
      if (obs.type === 'flipper') {
        const rotY = (obs.rotationY || 0) * Math.PI / 180;
        const dx = position.current.x - obs.x;
        const dz = position.current.z - obs.z;
        const rx = dx * Math.cos(-rotY) - dz * Math.sin(-rotY);
        const rz = dx * Math.sin(-rotY) + dz * Math.cos(-rotY);
        if (Math.abs(rx) < 2 && Math.abs(rz) < 2) {
          const obsTop = 0.65;
          if (position.current.y >= 0 && obsTop > groundLevel) {
            groundLevel = obsTop;
          }
        }
      }
    }

    // Ground collision - clear manual anim when landing
    if (position.current.y <= groundLevel) {
      if (!isGrounded.current) {
        // Just landed
        isPlayingManualAnim.current = false;
        // Clear direction lock when landing (unless roll is still active)
        if (!rollBuff.current || Date.now() >= rollBuff.current.endTime) {
          lockedDirection.current = null;
        }
      }
      position.current.y = groundLevel;
      velocity.current.y = 0;
      isGrounded.current = true;
      // Reset double jump state on landing
      doubleJumpReady.current = false;
      hasDoubleJumped.current = false;
    } else if (position.current.y > groundLevel + 0.1) {
      // Walking off an edge - become airborne
      isGrounded.current = false;
    }

    // Handle knockback - smooth movement at 300% speed with jump animation
    if (playerKnockback && playerKnockback.remainingDistance > 0) {
      const { directionX, directionZ, remainingDistance, speedMultiplier } = playerKnockback;

      // Calculate movement this frame at 300% speed (based on run speed)
      const knockbackSpeed = settings.runSpeed * (speedMultiplier || 3.0);
      const moveThisFrame = knockbackSpeed * delta;

      // Force jump animation during knockback
      isPlayingManualAnim.current = false; // Allow animation change
      playMovementAnimation('Jump_Loop');
      isPlayingManualAnim.current = true; // Lock to this animation

      if (moveThisFrame >= remainingDistance) {
        // Final movement - complete the knockback
        position.current.x += directionX * remainingDistance;
        position.current.z += directionZ * remainingDistance;
        clearPlayerKnockback();
        isPlayingManualAnim.current = false; // Unlock animation immediately
        currentAnim.current = ''; // Force animation refresh on next frame
      } else {
        // Continue knockback movement
        position.current.x += directionX * moveThisFrame;
        position.current.z += directionZ * moveThisFrame;
        useStore.getState().updatePlayerKnockback(remainingDistance - moveThisFrame);
      }

      // Re-check collision with landscape blocks after knockback movement
      // This prevents being pushed inside pyramid/blocks by AI attacks
      const playerRadius = 0.3;
      for (const block of landscapeBlocks) {
        const w = block.width || 10;
        const l = block.length || 10;
        const h = block.blockHeight || 1;
        const rotY = (block.rotationY || 0) * Math.PI / 180;

        // Block center
        const cx = block.x + w / 2;
        const cy = block.height + h / 2;
        const cz = block.z + l / 2;

        // Transform player position to block's local space
        let px = position.current.x - cx;
        let py = position.current.y - cy;
        let pz = position.current.z - cz;

        // Apply inverse rotation
        if (rotY !== 0) {
          const cosY = Math.cos(rotY);
          const sinY = Math.sin(rotY);
          const newPx = px * cosY - pz * sinY;
          const newPz = px * sinY + pz * cosY;
          px = newPx;
          pz = newPz;
        }

        const halfW = w / 2;
        const halfH = h / 2;
        const halfL = l / 2;

        const inX = Math.abs(px) < halfW + playerRadius;
        const inY = Math.abs(py) < halfH + 1;
        const inZ = Math.abs(pz) < halfL + playerRadius;

        if (inX && inZ && inY) {
          const blockTop = block.height + h;
          // Only push out if not standing on top
          if (position.current.y < blockTop - 0.1) {
            const overlapX = halfW + playerRadius - Math.abs(px);
            const overlapZ = halfL + playerRadius - Math.abs(pz);

            if (overlapX < overlapZ && overlapX > 0) {
              const pushDir = px > 0 ? 1 : -1;
              position.current.x = cx + pushDir * (halfW + playerRadius + 0.01);
            } else if (overlapZ > 0) {
              const pushDir = pz > 0 ? 1 : -1;
              position.current.z = cz + pushDir * (halfL + playerRadius + 0.01);
            }
            // Cancel any remaining knockback to prevent repeated collision
            clearPlayerKnockback();
            break;
          }
        }
      }
    }

    // Handle Time Warp expiration - auto-teleport back when time runs out
    if (timewarpState.current && Date.now() >= timewarpState.current.expiresAt) {
      const ghost = timewarpState.current;

      // Teleport back to ghost position
      window.dispatchEvent(new CustomEvent('teleport-flash', {
        detail: { x: position.current.x, z: position.current.z }
      }));

      position.current.x = ghost.x;
      position.current.y = ghost.y;
      position.current.z = ghost.z;

      window.dispatchEvent(new CustomEvent('teleport-flash', {
        detail: { x: ghost.x, z: ghost.z }
      }));

      window.dispatchEvent(new CustomEvent('timewarp-end'));
      timewarpState.current = null;
    }

    // Handle charge - move to target at 500% speed with 4x sprint animation
    if (chargeState.current) {
      const storeState = useStore.getState();
      const target = storeState.aiCharacters.find((ai) => ai.id === chargeState.current.targetId);

      if (target && target.health > 0) {
        const dx = target.position[0] - position.current.x;
        const dz = target.position[2] - position.current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Calculate movement this frame at 500% speed
        const chargeSpeed = settings.runSpeed * chargeState.current.speedMultiplier;
        const moveThisFrame = chargeSpeed * delta;

        // Play sprint animation at 4x speed
        const sprintAction = actionsRef.current?.['Sprint_Loop'];
        if (sprintAction && currentAnim.current !== 'Sprint_Loop_Charge') {
          isPlayingManualAnim.current = true;
          Object.values(actionsRef.current).forEach(action => {
            if (action) action.fadeOut(0.05);
          });
          sprintAction.reset();
          sprintAction.setLoop(THREE.LoopRepeat, Infinity);
          sprintAction.timeScale = 4.0; // 4x speed
          sprintAction.fadeIn(0.05).play();
          currentAnim.current = 'Sprint_Loop_Charge';
        }

        // Face the target
        targetModelRotation.current = Math.atan2(-dx, -dz);
        modelRotation.current = targetModelRotation.current;

        if (dist <= 1.5 || moveThisFrame >= dist) {
          // Reached target - deal damage and stun
          position.current.x = target.position[0] - (dx / dist) * 1.0;
          position.current.z = target.position[2] - (dz / dist) * 1.0;

          storeState.damageAICharacter(target.id, chargeState.current.damage);
          stunAICharacter(target.id, chargeState.current.stunDuration);
          window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: target.id } }));

          // Reset animation speed and clear charge
          if (sprintAction) sprintAction.timeScale = 1.0;
          chargeState.current = null;
          isPlayingManualAnim.current = false;
          currentAnim.current = '';
        } else {
          // Move toward target
          position.current.x += (dx / dist) * moveThisFrame;
          position.current.z += (dz / dist) * moveThisFrame;
        }
      } else {
        // Target dead or gone, cancel charge
        const sprintAction = actionsRef.current?.['Sprint_Loop'];
        if (sprintAction) sprintAction.timeScale = 1.0;
        chargeState.current = null;
        isPlayingManualAnim.current = false;
        currentAnim.current = '';
      }
    }

    // Handle colossal smash jump
    if (smashState.current) {
      const { targetPos, phase } = smashState.current;

      if (phase === 'jumping') {
        const dx = targetPos.x - position.current.x;
        const dz = targetPos.z - position.current.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Arc jump toward target - 3x higher, 3x faster fall
        const jumpSpeed = settings.runSpeed * 4;
        const moveThisFrame = jumpSpeed * delta;

        // Apply upward velocity at start, then enhanced gravity
        if (smashState.current.jumpTime === undefined) {
          smashState.current.jumpTime = 0;
          velocity.current.y = 36; // 3x higher jump (was 12)
          isGrounded.current = false;
        }
        smashState.current.jumpTime += delta;

        // Apply 3x gravity during smash for faster descent
        const smashGravity = settings.gravity * 3;
        velocity.current.y -= smashGravity * delta;
        position.current.y += velocity.current.y * delta;

        // Move horizontally
        if (dist > 0.5) {
          position.current.x += (dx / dist) * moveThisFrame;
          position.current.z += (dz / dist) * moveThisFrame;
        }

        // Check if landed
        if (position.current.y <= 0 && smashState.current.jumpTime > 0.2) {
          position.current.y = 0;
          velocity.current.y = 0;
          isGrounded.current = true;

          // Trigger earth explosion
          const storeState = useStore.getState();
          const impactRadius = 3;

          // Damage all AI in radius
          for (const ai of storeState.aiCharacters) {
            if (ai.health <= 0) continue;
            const aiDx = ai.position[0] - position.current.x;
            const aiDz = ai.position[2] - position.current.z;
            const aiDist = Math.sqrt(aiDx * aiDx + aiDz * aiDz);

            if (aiDist <= impactRadius) {
              storeState.damageAICharacter(ai.id, smashState.current.damage || 40);
              storeState.applyAIKnockback(ai.id, aiDx / aiDist, aiDz / aiDist, 3);
              window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: ai.id } }));
            }
          }

          // Visual effect
          window.dispatchEvent(new CustomEvent('earth-smash', {
            detail: { x: position.current.x, z: position.current.z, radius: impactRadius }
          }));

          smashState.current = null;
          isPlayingManualAnim.current = false;
          currentAnim.current = '';
        }
      }
    }

    // Update transforms
    groupRef.current.position.set(position.current.x, position.current.y, position.current.z);
    modelRef.current.rotation.y = modelRotation.current + Math.PI;

    // Update store
    setCharacterPosition({ ...position.current });
    setCharacterRotation(cameraRotation.current);
    setCharacterFacing(modelRotation.current);

    // Handle spell casting with animation phases
    if (castingRef.current && !hasSpawnedProjectile.current) {
      const totalElapsed = (now - castingRef.current.startTime) / 1000;
      const phaseElapsed = (now - castPhaseStartTime.current) / 1000;
      const spell = SPELLS[castingRef.current.spellId];
      const chargeTime = castingRef.current.chargeTime || 0.2;

      if (spell) {
        // Handle animation phases for longer casts (>0.4s uses idle + shoot)
        if (chargeTime > 0.4 && castPhase.current === 'idle') {
          // Calculate when to transition to shoot phase
          // Idle plays until (chargeTime - SPELL_SHOOT_DURATION) has elapsed
          const idleDuration = chargeTime - SPELL_SHOOT_DURATION;
          if (phaseElapsed >= Math.max(0, idleDuration)) {
            castPhase.current = 'shoot';
            castPhaseStartTime.current = now;
            useStore.getState().triggerAnimation('Spell_Simple_Shoot');
          }
        }

        // Spawn projectile or execute effect when cast completes
        if (totalElapsed >= chargeTime) {
          // Handle self-cast spells
          if (spell.behavior === 'self') {
            if (spell.id === 'heal') {
              const healAmount = storeState.playerStats.maxHealth * (spell.healPercent || 0.30);
              healPlayer(healAmount);
              window.dispatchEvent(new CustomEvent('player-healed', {
                detail: { amount: healAmount }
              }));
            }
            hasSpawnedProjectile.current = true;
            castPhase.current = null;
            stopCasting();
            castingRef.current = null;
          }
          // Handle self-AOE spells
          else if (spell.behavior === 'self-aoe') {
            if (spell.id === 'earthquake') {
              const range = spell.range || 8;
              for (const ai of storeState.aiCharacters) {
                if (ai.health <= 0) continue;
                const dx = ai.position[0] - position.current.x;
                const dz = ai.position[2] - position.current.z;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist <= range) {
                  storeState.damageAICharacter(ai.id, spell.damage || 25);
                  storeState.slowAICharacter(ai.id, spell.slowDuration || 4);
                  window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: ai.id } }));
                }
              }
              // Visual effect
              window.dispatchEvent(new CustomEvent('earthquake', {
                detail: { x: position.current.x, z: position.current.z, radius: range }
              }));
            }
            hasSpawnedProjectile.current = true;
            castPhase.current = null;
            stopCasting();
            castingRef.current = null;
          }
          // Handle heal-target spells (heal selected target or self)
          else if (spell.behavior === 'heal-target') {
            const targetId = castingRef.current.targetId;

            if (targetId) {
              // Heal the targeted AI
              const target = storeState.aiCharacters.find((ai) => ai.id === targetId);
              if (target && target.health > 0) {
                const healAmount = target.maxHealth * (spell.healPercent || 0.30);
                storeState.healAICharacter(targetId, healAmount);
                window.dispatchEvent(new CustomEvent('ai-healed', {
                  detail: { targetId, amount: healAmount }
                }));
              }
            } else {
              // Heal self
              const healAmount = storeState.playerStats.maxHealth * (spell.healPercent || 0.30);
              healPlayer(healAmount);
              window.dispatchEvent(new CustomEvent('player-healed', {
                detail: { amount: healAmount }
              }));
            }

            hasSpawnedProjectile.current = true;
            castPhase.current = null;
            stopCasting();
            castingRef.current = null;
          }
          // Handle targeted spells (projectiles)
          else {
            // Calculate spell size based on charge time (1.0 base, up to 10.0 for long casts)
            const spellSize = Math.min(10.0, 1.0 + (chargeTime - 0.2) * 0.9);

            // Spawn projectile
            const facingAngle = modelRotation.current + Math.PI;
            const spawnOffset = 0.5;

            // Adjust spell height based on race
            const currentRace = RACES[useStore.getState().selectedRace] || RACES.human;
            const projectilePos = {
              x: position.current.x + Math.sin(facingAngle) * spawnOffset,
              y: 1.2 * currentRace.height, // Chest height adjusted for race
              z: position.current.z + Math.cos(facingAngle) * spawnOffset,
            };

            const direction = {
              x: Math.sin(facingAngle),
              z: Math.cos(facingAngle),
            };

            addProjectile({
              type: castingRef.current.spellId,
              position: projectilePos,
              direction: direction,
              targetId: spell.behavior === 'targeted' ? castingRef.current.targetId : null,
              fromAI: false,
              size: spellSize,
            });

            hasSpawnedProjectile.current = true;
            castPhase.current = null;
            stopCasting();
            castingRef.current = null;
          }
        }
      }
    }

    // Handle channeled spells (like Life Drain)
    if (channelRef.current) {
      const { spellId, startTime, targetId, duration, tickRate, damage } = channelRef.current;
      const elapsed = (now - startTime) / 1000;

      // Check if channel is complete
      if (elapsed >= duration) {
        if (spellId === 'lifedrain') {
          window.dispatchEvent(new CustomEvent('life-drain-stop-all'));
        }
        channelRef.current = null;
        isPlayingManualAnim.current = false;
        currentAnim.current = '';
      } else {
        // Check if target is still valid and in range
        const target = storeState.aiCharacters.find((ai) => ai.id === targetId);
        const spell = SPELLS[spellId];

        if (!target || target.health <= 0) {
          // Target dead, end channel
          if (spellId === 'lifedrain') {
            window.dispatchEvent(new CustomEvent('life-drain-stop-all'));
          }
          channelRef.current = null;
          isPlayingManualAnim.current = false;
          currentAnim.current = '';
        } else {
          const dx = target.position[0] - position.current.x;
          const dz = target.position[2] - position.current.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          if (dist > (spell?.range || 15)) {
            // Out of range, end channel
            if (spellId === 'lifedrain') {
              window.dispatchEvent(new CustomEvent('life-drain-stop-all'));
            }
            channelRef.current = null;
            isPlayingManualAnim.current = false;
            currentAnim.current = '';
          } else {
            // Face the target
            targetModelRotation.current = Math.atan2(-dx, -dz);
            modelRotation.current = targetModelRotation.current;

            // Check if it's time to tick
            const tickInterval = 1000 / tickRate;
            if (now - channelRef.current.lastTick >= tickInterval) {
              channelRef.current.lastTick = now;

              // Deal damage and heal
              storeState.damageAICharacter(targetId, damage);
              healPlayer(damage);
              window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId } }));
              window.dispatchEvent(new CustomEvent('life-drain-tick', {
                detail: { from: target.position, to: [position.current.x, 1, position.current.z] }
              }));
            }

            // Check if moving - cancel channel
            const keys = keysPressed.current;
            if (keys.w || keys.a || keys.s || keys.d) {
              if (spellId === 'lifedrain') {
                window.dispatchEvent(new CustomEvent('life-drain-stop-all'));
              }
              channelRef.current = null;
              isPlayingManualAnim.current = false;
              currentAnim.current = '';
            }
          }
        }
      }
    }

    // Auto attack logic
    if (isAutoAttacking.current && storeState.selectedTargetId) {
      const target = storeState.aiCharacters.find((ai) => ai.id === storeState.selectedTargetId);

      if (target && target.health > 0) {
        // Calculate distance to target
        const dx = target.position[0] - position.current.x;
        const dz = target.position[2] - position.current.z;
        const distToTarget = Math.sqrt(dx * dx + dz * dz);

        // If in melee range and off cooldown, attack
        if (distToTarget < 2 && (now - lastActionTime.current >= gcd) && !isPlayingManualAnim.current) {
          lastActionTime.current = now;

          // Face the target
          targetModelRotation.current = Math.atan2(-dx, -dz);
          modelRotation.current = targetModelRotation.current;

          // Play attack animation (alternate jab/cross)
          const attackAnim = attackCombo.current === 0 ? 'Punch_Jab' : 'Punch_Cross';
          attackCombo.current = (attackCombo.current + 1) % 2;
          useStore.getState().triggerAnimation(attackAnim);

          // Deal damage
          storeState.damageAICharacter(storeState.selectedTargetId, 10);
          window.dispatchEvent(new CustomEvent('ai-hit', { detail: { targetId: storeState.selectedTargetId } }));
        }
      } else {
        // Target dead or gone, stop auto attacking
        isAutoAttacking.current = false;
        setAutoAttacking(false);
      }
    }

    // Skip auto animation if playing manual (but not for movement anims)
    if (isPlayingManualAnim.current) return;

    // Auto animations
    if (!isGrounded.current) {
      if (velocity.current.y > 0) {
        playMovementAnimation('Jump_Start');
      } else {
        playMovementAnimation('Jump_Loop');
      }
    } else if (isMoving) {
      // Force walk animation when carrying someone
      const shouldRun = useStore.getState().isRunning && !isCarrying;
      playMovementAnimation(shouldRun ? 'Sprint_Loop' : 'Walk_Loop');
    } else {
      playMovementAnimation('Idle_Loop');
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={modelRef}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
