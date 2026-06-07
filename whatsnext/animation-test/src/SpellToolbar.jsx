import React, { useState, useEffect, useRef } from 'react';
import { useStore } from './useStore';
import { SPELLS, canCastSpell, getSpellsForMode } from './spells';

const TOP_ROW_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const BOTTOM_ROW_KEYS = ['R', 'F', 'C', 'V', 'G', 'T', 'A1', 'A2', 'A3', 'A4'];

// Simple spell icons using CSS/emoji
const SpellIcon = ({ type, modeSpells }) => {
  const iconStyle = {
    width: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    fontSize: 20,
  };

  // Use mode-specific spell data if available
  const spell = (modeSpells && modeSpells[type]) || SPELLS[type];
  if (!spell) {
    return (
      <div style={{ ...iconStyle, background: '#333' }}>
        <span>?</span>
      </div>
    );
  }

  const iconMap = {
    fireball: '🔥',
    frostball: '❄',
    frostnova: '❋',
    punch: '✊',
    stun: '💫',
    defend: '🛡',
    roll: '↻',
    teleport: '⟐',
    pick: '⋈',
    polymorph: '◇',
    colossalsmash: '▼',
    charge: '▶',
    heal: '♥',
    rejuvenation: '❤',
    lightningbolt: '⚡',
    earthquake: '≋',
    mirrorimage: '⧫',
    lifedrain: '❧',
    meteor: '☄',
    windgust: '💨',
    backstab: '⚔',
    enrage: '⬆',
    chainlightning: '⌁',
    pull: '⤺',
    timewarp: '⏱',
    doublejump: '⇈',
    heymaker: '👊',
  };

  return (
    <div style={{ ...iconStyle, background: `linear-gradient(135deg, ${spell.color}, ${spell.glowColor})` }}>
      <span role="img" aria-label={spell.name}>{iconMap[spell.icon] || '?'}</span>
    </div>
  );
};

// Generic toolbar button for 2x10 grid
const ToolbarButton = ({ label, icon, keyBind, isActive, onClick, color = '#2a2a2a', disabled = false }) => (
  <div
    onClick={disabled ? undefined : onClick}
    style={{
      width: 58,
      height: 58,
      background: disabled ? '#1a1a1a' : (isActive ? color : '#2a2a2a'),
      border: isActive ? '2px solid #ffcc00' : '1px solid #444',
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'default' : 'pointer',
      position: 'relative',
      transition: 'all 0.2s',
      opacity: disabled ? 0.3 : 1,
    }}
  >
    <div style={{
      position: 'absolute',
      top: 2,
      left: 4,
      fontSize: 10,
      color: '#ff6b6b',
      fontWeight: 'bold',
    }}>
      {keyBind}
    </div>
    <div style={{ fontSize: 20, marginTop: 6 }}>{icon}</div>
    <div style={{ fontSize: 8, color: '#ccc', marginTop: 2, textAlign: 'center', lineHeight: 1.1 }}>
      {label}
    </div>
  </div>
);

// Arrow button component
const ArrowButton = ({ direction, onClick, disabled }) => (
  <div
    onClick={disabled ? undefined : onClick}
    style={{
      width: 28,
      height: 124,
      background: disabled ? '#1a1a1a' : '#2a2a2a',
      border: '1px solid #444',
      borderRadius: direction === 'left' ? '8px 0 0 8px' : '0 8px 8px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.3 : 1,
      fontSize: 16,
      color: '#888',
      transition: 'all 0.2s',
    }}
  >
    {direction === 'left' ? '◀' : '▶'}
  </div>
);

// Info display for current placement settings
const PlacementInfo = ({ width, length, blockHeight, rotX, rotY, rotZ, height }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    marginLeft: 6,
  }}>
    <div style={{
      background: '#1a1a1a',
      border: '1px solid #444',
      borderRadius: 4,
      padding: '3px 6px',
      fontSize: 8,
      color: '#4ecdc4',
      textAlign: 'center',
    }}>
      <div>W:{width} L:{length}</div>
      <div>H:{blockHeight} Y:{height}</div>
    </div>
    <div style={{
      background: '#1a1a1a',
      border: '1px solid #444',
      borderRadius: 4,
      padding: '3px 6px',
      fontSize: 8,
      color: '#ff6b6b',
      textAlign: 'center',
    }}>
      <div>X:{rotX}° Y:{rotY}°</div>
      <div>Z:{rotZ}°</div>
    </div>
  </div>
);

export default function SpellToolbar() {
  const spellSlots = useStore((s) => s.spellSlots);
  const playerStats = useStore((s) => s.playerStats);
  const currentlyCasting = useStore((s) => s.currentlyCasting);
  const gameMode = useStore((s) => s.gameMode);
  const knockout = useStore((s) => s.knockout);
  const infection = useStore((s) => s.infection);
  const getInfectionBonuses = useStore((s) => s.getInfectionBonuses);

  // Track spell cooldowns { spellId: { cooldownUntil, duration } }
  const [cooldowns, setCooldowns] = useState({});
  const [, forceUpdate] = useState(0); // Force re-render for countdown

  // Listen for spell cooldown events
  useEffect(() => {
    const handleCooldown = (e) => {
      const { spellId, cooldownUntil, duration } = e.detail;
      setCooldowns(prev => ({
        ...prev,
        [spellId]: { cooldownUntil, duration }
      }));
    };

    window.addEventListener('spell-cooldown', handleCooldown);
    return () => window.removeEventListener('spell-cooldown', handleCooldown);
  }, []);

  // Update cooldowns display every 100ms when there are active cooldowns
  useEffect(() => {
    const hasActiveCooldowns = Object.values(cooldowns).some(
      cd => cd.cooldownUntil > Date.now()
    );

    if (!hasActiveCooldowns) return;

    const interval = setInterval(() => {
      const now = Date.now();

      // Check if any cooldowns have expired
      setCooldowns(prev => {
        const updated = { ...prev };
        let changed = false;
        for (const spellId in updated) {
          if (updated[spellId].cooldownUntil <= now) {
            delete updated[spellId];
            changed = true;
          }
        }
        return changed ? updated : prev;
      });

      // Force re-render to update countdown display
      forceUpdate(n => n + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [cooldowns]);

  // Get available spells for current game mode
  const infectionBonuses = gameMode === 'infection' ? getInfectionBonuses() : null;
  const modeSpells = getSpellsForMode(gameMode, infectionBonuses);
  const activeToolbar = useStore((s) => s.activeToolbar);
  const nextToolbar = useStore((s) => s.nextToolbar);
  const prevToolbar = useStore((s) => s.prevToolbar);
  const placementMode = useStore((s) => s.placementMode);
  const setPlacementMode = useStore((s) => s.setPlacementMode);
  const placementHeight = useStore((s) => s.placementHeight);
  const placementWidth = useStore((s) => s.placementWidth);
  const placementLength = useStore((s) => s.placementLength);
  const placementBlockHeight = useStore((s) => s.placementBlockHeight);
  const placementRotationX = useStore((s) => s.placementRotationX);
  const placementRotationY = useStore((s) => s.placementRotationY);
  const placementRotationZ = useStore((s) => s.placementRotationZ);
  const resetPlacementSettings = useStore((s) => s.resetPlacementSettings);
  const obstacleMode = useStore((s) => s.obstacleMode);
  const setObstacleMode = useStore((s) => s.setObstacleMode);
  const obstacleRotationY = useStore((s) => s.obstacleRotationY);

  // Calculate cast progress if currently casting
  let castProgress = 0;
  let castingSpellId = null;
  if (currentlyCasting) {
    const spell = SPELLS[currentlyCasting.spellId];
    if (spell) {
      const elapsed = (Date.now() - currentlyCasting.startTime) / 1000;
      castProgress = Math.min(1, elapsed / spell.chargeTime);
      castingSpellId = currentlyCasting.spellId;
    }
  }

  const setSpellSlot = useStore((s) => s.setSpellSlot);
  const toggleSpellBook = useStore((s) => s.toggleSpellBook);

  // Handle drop on spell slot
  const handleDrop = (slotKey, e) => {
    e.preventDefault();
    const spellId = e.dataTransfer.getData('spellId');
    if (spellId && SPELLS[spellId]) {
      setSpellSlot(slotKey, spellId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Spell toolbar buttons (toolbar 1)
  // In knockout mode, use the selected spell in slot 1
  // In infection mode, only Roll spell available (disabled when player is infected)
  // In KOTH mode, only Haymaker spell available in slot 1
  const knockoutSelectedSpell = knockout?.selectedSpell || null;
  const isPlayerInfected = infection?.isPlayerInfected || false;
  const effectiveSpellSlots = gameMode === 'infection'
    ? { '1': isPlayerInfected ? null : 'roll', '2': null, '3': null, '4': null, '5': null, '6': null, '7': null, '8': null, '9': null, '0': null,
        'R': null, 'F': null, 'C': null, 'V': null, 'G': null, 'T': null }
    : gameMode === 'knockout'
    ? { '1': knockoutSelectedSpell, '2': null, '3': null, '4': null, '5': null, '6': null, '7': null, '8': null, '9': null, '0': null,
        'R': null, 'F': null, 'C': null, 'V': null, 'G': null, 'T': null }
    : gameMode === 'koth'
    ? { '1': 'heymaker', '2': null, '3': null, '4': null, '5': null, '6': null, '7': null, '8': null, '9': null, '0': null,
        'R': null, 'F': null, 'C': null, 'V': null, 'G': null, 'T': null }
    : spellSlots;

  const spellTopRow = TOP_ROW_KEYS.map((key) => {
    const spellId = effectiveSpellSlots[key];
    // Use mode-specific spell data (knockout punch has no damage, more knockback)
    const spell = spellId ? (modeSpells[spellId] || SPELLS[spellId]) : null;
    const canCast = spell ? canCastSpell(spellId, playerStats.mana) : false;
    const isCasting = castingSpellId === spellId;
    // In knockout/infection/koth mode, disable slots that aren't available
    const isDisabledByMode = (gameMode === 'knockout' || gameMode === 'infection' || gameMode === 'koth') && !effectiveSpellSlots[key];

    // Check if spell is on cooldown
    const cooldownInfo = spellId && cooldowns[spellId];
    const isOnCooldown = cooldownInfo && cooldownInfo.cooldownUntil > Date.now();
    const cooldownRemaining = isOnCooldown ? Math.ceil((cooldownInfo.cooldownUntil - Date.now()) / 1000) : 0;
    const cooldownProgress = isOnCooldown ? (cooldownInfo.cooldownUntil - Date.now()) / cooldownInfo.duration : 0;

    return (
      <div
        key={key}
        onDrop={gameMode !== 'knockout' && gameMode !== 'infection' ? (e) => handleDrop(key, e) : undefined}
        onDragOver={gameMode !== 'knockout' && gameMode !== 'infection' ? handleDragOver : undefined}
        onContextMenu={gameMode !== 'knockout' && gameMode !== 'infection' ? (e) => {
          e.preventDefault();
          setSpellSlot(key, null);
        } : undefined}
        style={{
          width: 58,
          height: 68,
          background: spell ? (canCast ? '#2a2a2a' : '#1a1a1a') : '#1a1a1a',
          border: isCasting ? '2px solid #ffcc00' : '1px solid #444',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          opacity: isDisabledByMode ? 0.15 : (spell ? (canCast ? 1 : 0.5) : 0.3),
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 14,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 2,
          left: 4,
          fontSize: 10,
          color: '#ff6b6b',
          fontWeight: 'bold',
        }}>
          {key}
        </div>
        {spell ? (
          <>
            <div>
              <SpellIcon type={spellId} modeSpells={modeSpells} />
            </div>
            <div style={{ fontSize: 7, color: '#aaa', marginTop: 2, textAlign: 'center', lineHeight: 1.1 }}>
              {spell.name}
            </div>
          </>
        ) : (
          <div style={{
            width: 30,
            height: 30,
            marginTop: 4,
            border: '1px dashed #444',
            borderRadius: 4,
          }} />
        )}
        {isCasting && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: `${castProgress * 100}%`,
            height: 3,
            background: '#ffcc00',
          }} />
        )}
        {/* Cooldown overlay - simple sliding shadow from top to bottom */}
        {isOnCooldown && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${cooldownProgress * 100}%`,
            background: 'rgba(0, 0, 0, 0.7)',
            pointerEvents: 'none',
            transition: 'height 0.1s linear',
          }} />
        )}
      </div>
    );
  });

  // Bottom row spell slots (R, F, C, V, G, T - skip A1-A4 as they're not spell slots)
  const SPELL_BOTTOM_KEYS = ['R', 'F', 'C', 'V', 'G', 'T'];
  const spellBottomRow = SPELL_BOTTOM_KEYS.map((key) => {
    const spellId = effectiveSpellSlots[key];
    const spell = spellId ? (modeSpells[spellId] || SPELLS[spellId]) : null;
    const canCast = spell ? canCastSpell(spellId, playerStats.mana) : false;
    const isCasting = castingSpellId === spellId;
    const isDisabledByMode = (gameMode === 'knockout' || gameMode === 'infection') && !effectiveSpellSlots[key];

    // Check if spell is on cooldown
    const cooldownInfo = spellId && cooldowns[spellId];
    const isOnCooldown = cooldownInfo && cooldownInfo.cooldownUntil > Date.now();
    const cooldownProgress = isOnCooldown ? (cooldownInfo.cooldownUntil - Date.now()) / cooldownInfo.duration : 0;

    return (
      <div
        key={key}
        onDrop={gameMode !== 'knockout' && gameMode !== 'infection' ? (e) => handleDrop(key, e) : undefined}
        onDragOver={gameMode !== 'knockout' && gameMode !== 'infection' ? handleDragOver : undefined}
        onContextMenu={gameMode !== 'knockout' && gameMode !== 'infection' ? (e) => {
          e.preventDefault();
          setSpellSlot(key, null);
        } : undefined}
        style={{
          width: 58,
          height: 68,
          background: spell ? (canCast ? '#2a2a2a' : '#1a1a1a') : '#1a1a1a',
          border: isCasting ? '2px solid #ffcc00' : '1px solid #444',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          opacity: isDisabledByMode ? 0.15 : (spell ? (canCast ? 1 : 0.5) : 0.3),
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 14,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 2,
          left: 4,
          fontSize: 10,
          color: '#ff6b6b',
          fontWeight: 'bold',
        }}>
          {key}
        </div>
        {spell ? (
          <>
            <div>
              <SpellIcon type={spellId} modeSpells={modeSpells} />
            </div>
            <div style={{ fontSize: 7, color: '#aaa', marginTop: 2, textAlign: 'center', lineHeight: 1.1 }}>
              {spell.name}
            </div>
          </>
        ) : (
          <div style={{
            width: 30,
            height: 30,
            marginTop: 4,
            border: '1px dashed #444',
            borderRadius: 4,
          }} />
        )}
        {isCasting && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: `${castProgress * 100}%`,
            height: 3,
            background: '#ffcc00',
          }} />
        )}
        {/* Cooldown overlay */}
        {isOnCooldown && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${cooldownProgress * 100}%`,
            background: 'rgba(0, 0, 0, 0.7)',
            pointerEvents: 'none',
            transition: 'height 0.1s linear',
          }} />
        )}
      </div>
    );
  });

  // Landscape toolbar buttons (toolbar 2)
  const landscapeTopRow = [
    { key: '1', icon: '🟩', label: 'Green', mode: 'green', color: '#228B22' },
    { key: '2', icon: '🟥', label: 'Red', mode: 'red', color: '#8B0000' },
    { key: '3', icon: '⬆', label: 'Raise', action: () => useStore.getState().adjustPlacementHeight(1) },
    { key: '4', icon: '⬇', label: 'Lower', action: () => useStore.getState().adjustPlacementHeight(-1) },
    { key: '5', icon: '↔', label: 'Wider', action: () => useStore.getState().adjustPlacementWidth(5) },
    { key: '6', icon: '↔', label: 'Thinner', action: () => useStore.getState().adjustPlacementWidth(-5) },
    { key: '7', icon: '⏫', label: 'Taller', action: () => useStore.getState().adjustPlacementBlockHeight(1) },
    { key: '8', icon: '⏬', label: 'Shorter', action: () => useStore.getState().adjustPlacementBlockHeight(-1) },
    { key: '9', icon: '⚙', label: 'Rules', mode: 'select', color: '#4a4a8a' },
    { key: '0', icon: '🗑', label: 'Delete', mode: 'delete', color: '#8B0000' },
  ];

  const landscapeBottomRow = [
    { key: 'R', icon: '↻X', label: 'Rot X+', action: () => useStore.getState().adjustRotationX(30) },
    { key: 'F', icon: '↻Y', label: 'Rot Y+', action: () => useStore.getState().adjustRotationY(30) },
    { key: 'G', icon: '↺Y', label: 'Rot Y-', action: () => useStore.getState().adjustRotationY(-30) },
    { key: 'T', icon: '↺X', label: 'Rot X-', action: () => useStore.getState().adjustRotationX(-30) },
    { key: 'A1', icon: '📋', label: 'Dupe', action: () => useStore.getState().loadLastPlacedBlock() },
    { key: '', icon: '', label: '', disabled: true },
    { key: '', icon: '', label: '', disabled: true },
    { key: '', icon: '', label: '', disabled: true },
    { key: '', icon: '', label: '', disabled: true },
    { key: '', icon: '', label: '', disabled: true },
  ];

  // Obstacle toolbar buttons (toolbar 3)
  const obstacleTopRow = [
    { key: '1', icon: '🔨', label: 'Hammer', mode: 'hammer', color: '#8B4513' },
    { key: '2', icon: '🌀', label: 'Spinner', mode: 'spinner', color: '#4a4a8a' },
    { key: '3', icon: '👊', label: 'Pusher', mode: 'pusher', color: '#8B0000' },
    { key: '4', icon: '🎯', label: 'Pendulum', mode: 'pendulum', color: '#4a7c4e' },
    { key: '5', icon: '➡', label: 'Conveyor', mode: 'conveyor', color: '#666' },
    { key: '6', icon: '🦘', label: 'Bouncer', mode: 'bouncer', color: '#ff6b6b' },
    { key: '7', icon: '⬛', label: 'Crusher', mode: 'crusher', color: '#333' },
    { key: '8', icon: '🔄', label: 'Flipper', mode: 'flipper', color: '#4ecdc4' },
    { key: '9', icon: '💨', label: 'Fan', mode: 'fan', color: '#87CEEB' },
    { key: '0', icon: '🗑', label: 'Delete', mode: 'delete', color: '#8B0000' },
  ];

  const obstacleBottomRow = BOTTOM_ROW_KEYS.map((key) => (
    <ToolbarButton key={key} keyBind={key} icon="" label="" disabled />
  ));

  const renderToolbarRow = (items, currentMode, setMode, resetSettings, isLandscape = false) => {
    return items.map((item) => {
      if (item.disabled) {
        return <ToolbarButton key={item.key} keyBind={item.key} icon="" label="" disabled />;
      }
      if (item.mode) {
        return (
          <ToolbarButton
            key={item.key}
            keyBind={item.key}
            icon={item.icon}
            label={item.label}
            isActive={currentMode === item.mode}
            onClick={() => {
              if (currentMode === item.mode) {
                setMode(null);
              } else {
                setMode(item.mode);
                if (resetSettings && isLandscape) resetSettings();
              }
            }}
            color={item.color}
          />
        );
      }
      return (
        <ToolbarButton
          key={item.key}
          keyBind={item.key}
          icon={item.icon}
          label={item.label}
          onClick={item.action}
        />
      );
    });
  };

  const toolbarNames = ['', 'Spells', 'Landscape', 'Obstacles', 'Empty'];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        fontFamily: 'monospace',
      }}
    >
      {/* Hide arrows in knockout mode - only spell toolbar available */}
      {gameMode !== 'knockout' && gameMode !== 'infection' && (
        <ArrowButton
          direction="left"
          onClick={prevToolbar}
          disabled={activeToolbar === 1}
        />
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: 8,
          background: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        {/* Top Row */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(activeToolbar === 1 || (gameMode === 'knockout' || gameMode === 'infection')) && spellTopRow}
          {gameMode !== 'knockout' && gameMode !== 'infection' && activeToolbar === 2 && renderToolbarRow(landscapeTopRow, placementMode, setPlacementMode, resetPlacementSettings, true)}
          {gameMode !== 'knockout' && gameMode !== 'infection' && activeToolbar === 3 && renderToolbarRow(obstacleTopRow, obstacleMode, setObstacleMode)}
          {gameMode !== 'knockout' && gameMode !== 'infection' && activeToolbar === 4 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: 12, padding: '0 20px', height: 48 }}>
              Empty Toolbar
            </div>
          )}
          {/* Info panel for landscape */}
          {gameMode !== 'knockout' && gameMode !== 'infection' && activeToolbar === 2 && (placementMode === 'green' || placementMode === 'red') && (
            <PlacementInfo
              width={placementWidth}
              length={placementLength}
              blockHeight={placementBlockHeight}
              rotX={placementRotationX}
              rotY={placementRotationY}
              rotZ={placementRotationZ}
              height={placementHeight}
            />
          )}
          {/* Info panel for obstacles */}
          {gameMode !== 'knockout' && gameMode !== 'infection' && activeToolbar === 3 && obstacleMode && obstacleMode !== 'delete' && (
            <div style={{
              background: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: 4,
              padding: '8px 10px',
              marginLeft: 6,
              fontSize: 9,
              color: '#ff6b6b',
              display: 'flex',
              alignItems: 'center',
            }}>
              Rot: {obstacleRotationY}°
            </div>
          )}
        </div>
        {/* Bottom Row - always show */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(activeToolbar === 1 || (gameMode === 'knockout' || gameMode === 'infection')) && spellBottomRow}
          {gameMode !== 'knockout' && gameMode !== 'infection' && activeToolbar === 2 && renderToolbarRow(landscapeBottomRow, null, null)}
          {gameMode !== 'knockout' && gameMode !== 'infection' && activeToolbar === 3 && obstacleBottomRow}
          {gameMode !== 'knockout' && gameMode !== 'infection' && activeToolbar === 4 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: 10, padding: '0 20px', height: 48 }}>
              -
            </div>
          )}
        </div>
      </div>
      {/* Hide arrows in knockout mode */}
      {gameMode !== 'knockout' && gameMode !== 'infection' && (
        <ArrowButton
          direction="right"
          onClick={nextToolbar}
          disabled={activeToolbar === 4}
        />
      )}
      {/* Hide toolbar name in knockout mode */}
      {gameMode !== 'knockout' && gameMode !== 'infection' && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 10,
            color: '#888',
          }}
        >
          {toolbarNames[activeToolbar]} ({activeToolbar}/4)
        </div>
      )}
      {/* Spell book button - only show on spell toolbar and not in knockout mode */}
      {activeToolbar === 1 && gameMode !== 'knockout' && gameMode !== 'infection' && (
        <div
          onClick={toggleSpellBook}
          style={{
            position: 'absolute',
            top: -20,
            right: -70,
            background: 'rgba(74, 74, 138, 0.9)',
            padding: '2px 10px',
            borderRadius: 4,
            fontSize: 10,
            color: '#fff',
            cursor: 'pointer',
            border: '1px solid #666',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span style={{ color: '#ffcc00' }}>P</span> Spells
        </div>
      )}
    </div>
  );
}
