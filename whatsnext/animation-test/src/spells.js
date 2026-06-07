// Spell definitions for the combat system

export const SPELLS = {
  fireball: {
    id: 'fireball',
    name: 'Fireball',
    description: 'Hurl a ball of fire at your target',
    manaCost: 20,
    chargeTime: 2.5,
    damage: 35,
    behavior: 'targeted',
    animation: 'Spell_Simple_Shoot',
    range: 30,
    icon: 'fireball',
    color: '#ff4400',
    glowColor: '#ff8844',
    projectileColor: '#ff6600',
    speed: 15,
  },
  frostball: {
    id: 'frostball',
    name: 'Frostball',
    description: 'Launch an icy projectile that slows the target for 3 seconds',
    manaCost: 15,
    chargeTime: 2.0,
    damage: 25,
    behavior: 'targeted',
    animation: 'Spell_Simple_Shoot',
    range: 25,
    icon: 'frostball',
    color: '#44aaff',
    glowColor: '#88ccff',
    projectileColor: '#66ccff',
    speed: 12,
    slowDuration: 3,
  },
  frostnova: {
    id: 'frostnova',
    name: 'Frost Nova',
    description: 'Unleash a freezing explosion that freezes all enemies within 5m for 3 seconds',
    manaCost: 30,
    chargeTime: 0,
    damage: 10,
    behavior: 'instant',
    animation: 'Pistol_Aim_Up',
    range: 5,
    icon: 'frostnova',
    color: '#66ccff',
    glowColor: '#aaeeff',
    freezeDuration: 3,
    cooldown: 3, // 3 second cooldown
  },
  freeze: {
    id: 'freeze',
    name: 'Freeze',
    description: 'Instantly freeze selected target in place for 3 seconds',
    manaCost: 25,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: 'Pistol_Aim_Up',
    range: 15,
    requiresTarget: true,
    icon: 'freeze',
    color: '#66ccff',
    glowColor: '#aaeeff',
    freezeDuration: 3,
    cooldown: 5, // 5 second cooldown
  },
  punch: {
    id: 'punch',
    name: 'Punch',
    description: 'A quick melee punch attack',
    manaCost: 0,
    chargeTime: 0,
    damage: 15,
    behavior: 'instant',
    animation: 'Punch_Jab',
    range: 4,
    isMelee: true,
    icon: 'punch',
    color: '#ffaa00',
    glowColor: '#ffcc44',
  },
  stun: {
    id: 'stun',
    name: 'Stun',
    description: 'A melee attack that stuns the enemy for 3 seconds',
    manaCost: 20,
    chargeTime: 0,
    damage: 10,
    behavior: 'instant',
    animation: 'Punch_Cross',
    range: 4,
    isMelee: true,
    icon: 'stun',
    color: '#ffdd00',
    glowColor: '#ffee66',
    stunDuration: 3,
  },
  defend: {
    id: 'defend',
    name: 'Defend',
    description: 'Block attacks for 2 seconds. Reflects attacks back at attacker.',
    manaCost: 0,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: 'PickUp_Table',
    duration: 2, // 2 second duration
    damageReduction: 0.9,
    reflectsAttacks: true,
    icon: 'defend',
    color: '#4488ff',
    glowColor: '#66aaff',
    cooldown: 3, // 3 second cooldown
  },
  roll: {
    id: 'roll',
    name: 'Roll',
    description: 'Dodge roll forward at increased speed for 0.5 seconds',
    manaCost: 0,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: 'Roll',
    speedMultiplier: 3.0,
    duration: 0.5,
    icon: 'roll',
    color: '#88ff88',
    glowColor: '#aaffaa',
  },
  doublejump: {
    id: 'doublejump',
    name: 'Double Jump',
    description: 'Perform a second jump while in the air',
    manaCost: 0,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: null,
    cooldown: 0, // No cooldown, but can only use once per jump
    icon: 'doublejump',
    color: '#ffaa44',
    glowColor: '#ffcc88',
  },
  teleport: {
    id: 'teleport',
    name: 'Blink',
    description: 'Instantly teleport 15 meters forward',
    manaCost: 25,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: null,
    distance: 15,
    icon: 'teleport',
    color: '#aa44ff',
    glowColor: '#cc88ff',
  },
  pick: {
    id: 'pick',
    name: 'Pick Up',
    description: 'Pick up a target and carry them for 2 seconds',
    manaCost: 10,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: 'PickUp_Table',
    duration: 2,
    range: 4,
    isMelee: true,
    icon: 'pick',
    color: '#ffaa44',
    glowColor: '#ffcc88',
  },
  polymorph: {
    id: 'polymorph',
    name: 'Polymorph',
    description: 'Turn an enemy into a sheep for 7 seconds',
    manaCost: 35,
    chargeTime: 1.5,
    damage: 0,
    behavior: 'targeted',
    animation: 'Spell_Simple_Shoot',
    range: 20,
    duration: 7,
    icon: 'polymorph',
    color: '#cc66cc',
    glowColor: '#dd99dd',
    speed: 100,
  },
  colossalsmash: {
    id: 'colossalsmash',
    name: 'Colossal Smash',
    description: 'Leap to target location and smash the ground',
    manaCost: 25,
    chargeTime: 0,
    damage: 40,
    behavior: 'ground-target',
    animation: 'Jump_Start',
    range: 25,
    impactRadius: 3,
    icon: 'colossalsmash',
    color: '#8b4513',
    glowColor: '#a0522d',
  },
  charge: {
    id: 'charge',
    name: 'Charge',
    description: 'Charge to a target at 500% speed, stunning them briefly',
    manaCost: 15,
    chargeTime: 0,
    damage: 20,
    behavior: 'instant',
    animation: 'Sprint_Loop',
    range: 20,
    isMelee: true,
    icon: 'charge',
    color: '#cc2222',
    glowColor: '#dd4444',
    speedMultiplier: 5.0,
    stunDuration: 0.5,
  },

  // === NEW SPELLS ===

  heal: {
    id: 'heal',
    name: 'Heal',
    description: 'Restore 30% of maximum health. Can target allies or self.',
    manaCost: 30,
    chargeTime: 1.0,
    damage: 0,
    behavior: 'heal-target', // New behavior: heals selected target or self
    animation: 'Spell_Simple_Idle_Loop',
    healPercent: 0.30,
    range: 25,
    icon: 'heal',
    color: '#44ff44',
    glowColor: '#88ff88',
  },
  rejuvenation: {
    id: 'rejuvenation',
    name: 'Rejuvenation',
    description: 'Heal over time: 3% health every 2 seconds for 12 seconds',
    manaCost: 25,
    chargeTime: 0,
    damage: 0,
    behavior: 'hot', // Healing over time
    animation: 'Pistol_Aim_Up',
    healPercent: 0.03, // 3% per tick
    tickInterval: 2, // Every 2 seconds
    duration: 12, // 12 seconds total (6 ticks)
    range: 25,
    icon: 'rejuvenation',
    color: '#88ff88',
    glowColor: '#aaffaa',
  },
  lightningbolt: {
    id: 'lightningbolt',
    name: 'Lightning Bolt',
    description: 'Strike target with lightning for high damage',
    manaCost: 25,
    chargeTime: 0.5,
    damage: 50,
    behavior: 'targeted',
    animation: 'Spell_Simple_Shoot',
    range: 35,
    speed: 50,
    icon: 'lightningbolt',
    color: '#aaccff',
    glowColor: '#ddeeff',
    projectileColor: '#ffffff',
  },
  earthquake: {
    id: 'earthquake',
    name: 'Earthquake',
    description: 'Shake the ground, damaging and slowing all enemies in 8m',
    manaCost: 40,
    chargeTime: 0, // Instant cast
    damage: 25,
    behavior: 'self-aoe',
    animation: 'Pistol_Aim_Up',
    range: 8,
    slowDuration: 4,
    icon: 'earthquake',
    color: '#8b6914',
    glowColor: '#a08030',
  },
  mirrorimage: {
    id: 'mirrorimage',
    name: 'Mirror Image',
    description: 'Create 5 mirror clones 6m apart. Press 1-5 to teleport. Clones run away for 3s after.',
    manaCost: 25,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: 'Spell_Simple_Shoot',
    duration: 5,
    imageCount: 5,
    icon: 'mirrorimage',
    color: '#aaaaff',
    glowColor: '#ccccff',
  },
  lifedrain: {
    id: 'lifedrain',
    name: 'Life Drain',
    description: 'Channel to drain 15 health per second from target, healing yourself',
    manaCost: 20,
    chargeTime: 0,
    damage: 15,
    behavior: 'channel',
    animation: 'Spell_Simple_Idle_Loop',
    range: 15,
    duration: 3,
    tickRate: 1,
    icon: 'lifedrain',
    color: '#aa0044',
    glowColor: '#cc2266',
  },
  meteor: {
    id: 'meteor',
    name: 'Meteor',
    description: 'Call down a meteor at target location after 2 seconds',
    manaCost: 50,
    chargeTime: 2.0,
    damage: 80,
    behavior: 'ground-target',
    animation: 'Spell_Simple_Idle_Loop',
    range: 20,
    impactRadius: 5,
    delay: 1.5,
    icon: 'meteor',
    color: '#ff4400',
    glowColor: '#ff8844',
  },
  windgust: {
    id: 'windgust',
    name: 'Wind Gust',
    description: 'Blast enemies in front of you back 6 meters',
    manaCost: 20,
    chargeTime: 0,
    damage: 5,
    behavior: 'instant',
    animation: 'Pistol_Aim_Up',
    range: 8,
    coneAngle: 60,
    knockbackDistance: 6,
    icon: 'windgust',
    color: '#88ddff',
    glowColor: '#aaeeff',
  },
  backstab: {
    id: 'backstab',
    name: 'Backstab',
    description: 'Teleport behind target and strike for 45 damage',
    manaCost: 30,
    chargeTime: 0,
    damage: 45,
    behavior: 'instant',
    animation: 'Punch_Cross',
    range: 15,
    isMelee: true,
    icon: 'backstab',
    color: '#440066',
    glowColor: '#660088',
  },
  enrage: {
    id: 'enrage',
    name: 'Enrage',
    description: 'Deal 50% more damage but take 25% more for 8 seconds',
    manaCost: 15,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: 'Hit_Chest',
    duration: 8,
    damageBonus: 0.50,
    damageTaken: 0.25,
    icon: 'enrage',
    color: '#ff2200',
    glowColor: '#ff6644',
  },
  chainlightning: {
    id: 'chainlightning',
    name: 'Chain Lightning',
    description: 'Lightning that hits target then bounces to 2 nearby enemies',
    manaCost: 35,
    chargeTime: 0.8,
    damage: 30,
    behavior: 'targeted',
    animation: 'Spell_Simple_Shoot',
    range: 25,
    speed: 40,
    bounces: 2,
    bounceRange: 8,
    bounceDamageFalloff: 0.7,
    icon: 'chainlightning',
    color: '#6699ff',
    glowColor: '#99bbff',
    projectileColor: '#aaddff',
  },
  pull: {
    id: 'pull',
    name: 'Pull',
    description: 'Pull target towards you from 15m, stunning them for 0.5s',
    manaCost: 20,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: 'Spell_Simple_Shoot',
    range: 15,
    pullDistance: 15, // Pull them towards caster
    stunDuration: 0.5,
    icon: 'pull',
    color: '#9933ff',
    glowColor: '#bb66ff',
  },
  timewarp: {
    id: 'timewarp',
    name: 'Time Warp',
    description: 'Leave a ghost image. Press again within 5s to return to it.',
    manaCost: 25,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: 'Spell_Simple_Shoot',
    duration: 5, // Max 5 seconds between activations
    icon: 'timewarp',
    color: '#00ffcc',
    glowColor: '#66ffdd',
  },
  heymaker: {
    id: 'heymaker',
    name: 'Haymaker',
    description: 'Powerful punch that hits all enemies in front of you. No target needed.',
    manaCost: 0,
    chargeTime: 0,
    damage: 15,
    behavior: 'instant', // Instant cone attack
    executeAnimation: 'Sword_Attack', // Animation when attacking
    range: 4, // Melee range
    maxKnockback: 15, // Knockback distance
    coneAngle: 90, // 90 degree cone
    isMelee: true,
    icon: 'heymaker',
    color: '#ff8800',
    glowColor: '#ffaa44',
    cooldown: 1, // 1 second cooldown
  },
  doublejump: {
    id: 'doublejump',
    name: 'Double Jump',
    description: 'Jump twice. Second jump can be performed in mid-air.',
    manaCost: 0,
    chargeTime: 0,
    damage: 0,
    behavior: 'instant',
    animation: null, // Uses jump animation
    icon: 'doublejump',
    color: '#88ff44',
    glowColor: '#aaff66',
    cooldown: 3, // 3 second cooldown
  },
};

// Helper to get spell by ID
export const getSpell = (spellId) => SPELLS[spellId] || null;

// Check if player has enough mana
export const canCastSpell = (spellId, currentMana) => {
  const spell = getSpell(spellId);
  if (!spell) return false;
  return currentMana >= spell.manaCost;
};

// Get all available spells as array
export const getAllSpells = () => Object.values(SPELLS);

// Get spells available for a specific game mode
export const getSpellsForMode = (mode, infectionBonuses = null) => {
  if (mode === 'koth') {
    // King of the Hill mode: Only Haymaker available
    return {
      heymaker: {
        ...SPELLS.heymaker,
        description: 'Powerful punch that hits all enemies in front. No target needed.',
      },
    };
  }

  if (mode === 'infection') {
    // Infection mode: Roll for survivors, Double Jump for everyone
    const baseCooldown = infectionBonuses?.cooldown ?? 10;
    const speedBoost = infectionBonuses?.speedBoost ?? 1.5;
    return {
      roll: {
        ...SPELLS.roll,
        cooldown: baseCooldown,
        speedMultiplier: speedBoost,
        description: `Dodge roll at ${Math.round(speedBoost * 100)}% speed. ${baseCooldown}s cooldown.`,
      },
      doublejump: {
        ...SPELLS.doublejump,
        cooldown: 0, // No cooldown in infection mode
        description: 'Double jump while in the air',
      },
    };
  }

  if (mode === 'knockout') {
    // Knockout mode: 4 spells to choose from, all with 3s cooldown
    return {
      punch: {
        ...SPELLS.punch,
        damage: 0, // No damage in knockout
        knockback: 4, // Knockback distance (4m)
        manaCost: 0, // No mana cost
        cooldown: 3,
        description: 'Push opponent with 4m knockback. Requires target selection.',
      },
      frostnova: {
        ...SPELLS.frostnova,
        damage: 0, // No damage in knockout
        manaCost: 0,
        cooldown: 5, // 5 second cooldown
        freezeDuration: 0.6, // 80% shorter than normal (0.6s instead of 3s)
        description: 'Freeze all enemies within 5m for 0.6 seconds.',
      },
      doublejump: {
        ...SPELLS.doublejump,
        manaCost: 0,
        cooldown: 2, // 2 second cooldown
        description: 'Jump twice. Second jump can be performed in mid-air.',
      },
      defend: {
        ...SPELLS.defend,
        manaCost: 0,
        cooldown: 4, // 4 second cooldown
        duration: 3, // 3 second effect
        description: 'Block for 3 seconds. Reflects attacks back at attacker.',
      },
      freeze: {
        ...SPELLS.freeze,
        manaCost: 0,
        cooldown: 5,
        freezeDuration: 0.6, // 80% shorter than normal (0.6s instead of 3s)
        description: 'Freeze selected target for 0.6 seconds. 15m range.',
      },
      stun: {
        ...SPELLS.stun,
        damage: 0, // No damage in knockout
        manaCost: 0,
        cooldown: 5,
        stunDuration: 5, // 5 second stun
        range: 4, // 4m melee range
        description: 'Stun target for 5 seconds. 4m melee range.',
      },
      pull: {
        ...SPELLS.pull,
        damage: 0, // No damage in knockout
        manaCost: 0,
        cooldown: 5,
        range: 30, // 30m range
        stunDuration: 1, // 1 second stun on arrival
        description: 'Pull target towards you. 1s stun on arrival. 30m range.',
      },
    };
  }

  // Test mode: all spells available
  return SPELLS;
};

// Get spell slots for a specific game mode
export const getSpellSlotsForMode = (mode, defaultSlots) => {
  if (mode === 'koth') {
    // King of the Hill mode: only heymaker in slot 1
    return {
      '1': 'heymaker',
      '2': null,
      '3': null,
      '4': null,
      '5': null,
      '6': null,
      '7': null,
      '8': null,
      '9': null,
      '0': null,
    };
  }

  if (mode === 'infection') {
    // Infection mode: only roll in slot 1
    return {
      '1': 'roll',
      '2': null,
      '3': null,
      '4': null,
      '5': null,
      '6': null,
      '7': null,
      '8': null,
      '9': null,
      '0': null,
    };
  }

  if (mode === 'knockout') {
    // Knockout mode: only punch in slot 1, rest empty
    return {
      '1': 'punch',
      '2': null,
      '3': null,
      '4': null,
      '5': null,
      '6': null,
      '7': null,
      '8': null,
      '9': null,
      '0': null,
    };
  }

  // Test mode: use default slots
  return defaultSlots;
};
