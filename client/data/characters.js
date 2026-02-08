export const characterAvatars = {
    tron: [
        // --- Common (10) ---
        { id: 'cyber-knight', name: 'Cyber Knight', emoji: '🤖', color: '#06b6d4', rarity: 'common', description: 'A standard-issue grid warrior. Reliable, sturdy, and ready for any game.', unlock: null },
        { id: 'neon-ninja', name: 'Neon Ninja', emoji: '⚡', color: '#3b82f6', rarity: 'common', description: 'Silent and swift, this ninja leaves only a blue trail in the data stream.', unlock: null },
        { id: 'data-runner', name: 'Data Runner', emoji: '💾', color: '#8b5cf6', rarity: 'common', description: 'Fastest courier on the grid. Delivers packets before you blink.', unlock: null },
        { id: 'circuit-breaker', name: 'Circuit Breaker', emoji: '🔌', color: '#06b6d4', rarity: 'common', description: 'Disrupts enemy systems with a single pulse. Don\'t get too close.', unlock: null },
        { id: 'byte-fighter', name: 'Byte Fighter', emoji: '⚔️', color: '#0ea5e9', rarity: 'common', description: 'Trained in 8-bit combat. Small but fierce.', unlock: null },
        { id: 'pixel-warrior', name: 'Pixel Warrior', emoji: '🎮', color: '#6366f1', rarity: 'common', description: 'Born from the arcade era. Every move is a classic.', unlock: null },
        { id: 'tech-ghost', name: 'Tech Ghost', emoji: '👻', color: '#22d3ee', rarity: 'common', description: 'A phantom process that refuses to terminate. Haunts the RAM.', unlock: null },
        { id: 'cyber-samurai', name: 'Cyber Samurai', emoji: '🗡️', color: '#3b82f6', rarity: 'common', description: 'Honour-bound digital ronin. Wields a light-blade with precision.', unlock: null },
        { id: 'grid-master', name: 'Grid Master', emoji: '🔷', color: '#06b6d4', rarity: 'common', description: 'Controls the game board itself. The grid bends to their will.', unlock: null },
        { id: 'binary-ace', name: 'Binary Ace', emoji: '💠', color: '#0891b2', rarity: 'common', description: 'Thinks in ones and zeros. Always two steps ahead.', unlock: null },
        // --- Uncommon (5) ---
        { id: 'volt-striker', name: 'Volt Striker', emoji: '⚡', color: '#facc15', rarity: 'uncommon', description: 'Charged with raw energy. Each strike leaves a lingering spark.', unlock: 'Play your first game' },
        { id: 'quantum-thief', name: 'Quantum Thief', emoji: '🌀', color: '#a78bfa', rarity: 'uncommon', description: 'Exists in multiple states simultaneously. You can\'t catch what you can\'t observe.', unlock: 'Win a game' },
        { id: 'plasma-drone', name: 'Plasma Drone', emoji: '🛸', color: '#34d399', rarity: 'uncommon', description: 'An autonomous scout that maps the grid before anyone else arrives.', unlock: 'Create 3 rooms' },
        { id: 'hex-coder', name: 'Hex Coder', emoji: '🖥️', color: '#f472b6', rarity: 'uncommon', description: 'Writes reality in hexadecimal. Bugs fear this one.', unlock: 'Send 25 chat messages' },
        { id: 'ion-scout', name: 'Ion Scout', emoji: '🔭', color: '#38bdf8', rarity: 'uncommon', description: 'Always scanning the horizon. First to spot incoming threats.', unlock: 'Join 5 different rooms' },
        // --- Rare (5) ---
        { id: 'wire-wraith', name: 'Wire Wraith', emoji: '🕸️', color: '#94a3b8', rarity: 'rare', description: 'A tangle of abandoned connections given sentience. Unsettling but effective.', unlock: 'Play a game with 4+ players' },
        { id: 'signal-flare', name: 'Signal Flare', emoji: '📡', color: '#fb923c', rarity: 'rare', description: 'A walking broadcast tower. Allies always know where the action is.', unlock: 'Win 3 games' },
        { id: 'core-sentinel', name: 'Core Sentinel', emoji: '🛡️', color: '#2dd4bf', rarity: 'rare', description: 'Guardian of the system kernel. Immovable and unbreakable.', unlock: 'Play 5 different game types' },
        { id: 'glitch-fox', name: 'Glitch Fox', emoji: '🦊', color: '#c084fc', rarity: 'rare', description: 'A digital fox that phases through firewalls. Cute but chaotic.', unlock: 'Win a game in under 60 seconds' },
        { id: 'null-agent', name: 'Null Agent', emoji: '🕶️', color: '#e2e8f0', rarity: 'rare', description: 'Officially doesn\'t exist. Redacted from every database.', unlock: 'Play 10 games total' },
        // --- Epic (5) ---
        { id: 'prism-knight', name: 'Prism Knight', emoji: '🛡️', color: '#06b6d4', rarity: 'epic', description: 'Encased in crystalline armor that refracts light into deadly beams. Their shield can deflect any attack back at the sender.', unlock: 'Win 25 games and score 500+ points in a single game' },
        { id: 'void-archer', name: 'Void Archer', emoji: '🏹', color: '#8b5cf6', rarity: 'epic', description: 'Fires arrows made of compressed null-space. Each shot tears a hole in the grid that repairs itself moments later.', unlock: 'Get picked as winner in 10 consecutive rounds' },
        { id: 'neon-ronin', name: 'Neon Ronin', emoji: '⚔️', color: '#f43f5e', rarity: 'epic', description: 'A masterless samurai with a plasma katana that burns at 10,000 kelvin. Their blade leaves trails of molten light.', unlock: 'Win 10 games in a row without a single loss' },
        { id: 'data-alchemist', name: 'Data Alchemist', emoji: '⚗️', color: '#34d399', rarity: 'epic', description: 'Transmutes raw data into gold-tier code. Orbiting potions contain compressed algorithms worth more than entire servers.', unlock: 'Win 5 games in rooms with 6+ players' },
        { id: 'circuit-witch', name: 'Circuit Witch', emoji: '🔮', color: '#a855f7', rarity: 'epic', description: 'Weaves spells from ethernet cables and forgotten protocols. Their digital robes shimmer with encrypted incantations.', unlock: 'Earn 1,000+ total points in a single game' },
        // --- Legendary (5) ---
        { id: 'grid-phoenix', name: 'Grid Phoenix', emoji: '🔥', color: '#f59e0b', rarity: 'legendary', description: 'Born from a catastrophic system crash, this immortal firebird rebuilds itself from corrupted data. Its flames purify any code they touch.', unlock: 'Come back from last place to finish first in a 5+ player game — do it three times to rise reborn' },
        { id: 'neon-titan', name: 'Neon Titan', emoji: '⚡', color: '#06b6d4', rarity: 'legendary', description: 'A colossal entity that towers over the grid. Servers buckle under its footsteps. Its aura overclocks everything nearby.', unlock: 'Score more than all other players combined in three separate 4+ player games — tower above the grid' },
        { id: 'cyber-bear', name: 'Cyber Bear', emoji: '🐻', color: '#38bdf8', rarity: 'legendary', description: 'An ancient digital beast covered in circuit-pattern fur. Its roar crashes weak firewalls. Feared across every network.', unlock: 'Win at least one game every day for 30 consecutive days — the ancient beast outlasts all' },
        { id: 'quantum-dragon', name: 'Quantum Dragon', emoji: '🐉', color: '#a78bfa', rarity: 'legendary', description: 'A serpent woven from pure quantum threads. It exists in every timeline simultaneously, seeing all possible futures.', unlock: 'Win games in 20 different rooms with unique players in each — exist in every timeline' },
        { id: 'omega-prime', name: 'Omega Prime', emoji: '👑', color: '#fbbf24', rarity: 'legendary', description: 'The final form. The last character. The one who mastered every challenge the grid could offer. Radiates pure, blinding energy.', unlock: 'Unlock every other character and win a game with each one equipped — true grid mastery' }
    ],
    kids: [
        // --- Common (10) ---
        { id: 'happy-unicorn', name: 'Happy Unicorn', emoji: '🦄', color: '#ec4899', rarity: 'common', description: 'A magical unicorn spreading joy and rainbows everywhere!', unlock: null },
        { id: 'cool-fox', name: 'Cool Fox', emoji: '🦊', color: '#f97316', rarity: 'common', description: 'The coolest fox in the forest. Always ready to play!', unlock: null },
        { id: 'brave-lion', name: 'Brave Lion', emoji: '🦁', color: '#eab308', rarity: 'common', description: 'King of the jungle with a heart of gold!', unlock: null },
        { id: 'smart-panda', name: 'Smart Panda', emoji: '🐼', color: '#6b7280', rarity: 'common', description: 'Loves bamboo and solving puzzles!', unlock: null },
        { id: 'silly-frog', name: 'Silly Frog', emoji: '🐸', color: '#22c55e', rarity: 'common', description: 'Ribbit! Always makes everyone laugh!', unlock: null },
        { id: 'speedy-rabbit', name: 'Speedy Rabbit', emoji: '🐰', color: '#a855f7', rarity: 'common', description: 'The fastest hopper in the meadow!', unlock: null },
        { id: 'friendly-bear', name: 'Friendly Bear', emoji: '🐻', color: '#92400e', rarity: 'common', description: 'Gives the best hugs in the whole forest!', unlock: null },
        { id: 'magical-cat', name: 'Magical Cat', emoji: '🐱', color: '#8b5cf6', rarity: 'common', description: 'A mysterious kitty with magical powers!', unlock: null },
        { id: 'happy-penguin', name: 'Happy Penguin', emoji: '🐧', color: '#0ea5e9', rarity: 'common', description: 'Slides on ice and always smiles!', unlock: null },
        { id: 'rainbow-koala', name: 'Rainbow Koala', emoji: '🐨', color: '#d946ef', rarity: 'common', description: 'The cuddliest koala with rainbow fur!', unlock: null },
        // --- Uncommon (3) ---
        { id: 'buzzy-bee', name: 'Buzzy Bee', emoji: '🐝', color: '#facc15', rarity: 'uncommon', description: 'Buzz buzz! Making honey and friends!', unlock: 'Play your first game' },
        { id: 'tiny-turtle', name: 'Tiny Turtle', emoji: '🐢', color: '#4ade80', rarity: 'uncommon', description: 'Slow and steady wins the race!', unlock: 'Win a game' },
        { id: 'dotty-ladybug', name: 'Dotty Ladybug', emoji: '🐞', color: '#ef4444', rarity: 'uncommon', description: 'Lucky spots bring good fortune!', unlock: 'Play 5 games' },
        // --- Rare (3) ---
        { id: 'fluffy-sheep', name: 'Fluffy Sheep', emoji: '🐑', color: '#cbd5e1', rarity: 'rare', description: 'The fluffiest friend you\'ll ever meet!', unlock: 'Win 3 games' },
        { id: 'jolly-dolphin', name: 'Jolly Dolphin', emoji: '🐬', color: '#38bdf8', rarity: 'rare', description: 'Splashing through waves of fun!', unlock: 'Play 3 different game types' },
        { id: 'cheeky-monkey', name: 'Cheeky Monkey', emoji: '🐵', color: '#a16207', rarity: 'rare', description: 'Always up to playful mischief!', unlock: 'Play 10 games' },
        // --- Epic (2) ---
        { id: 'snowy-owl', name: 'Snowy Owl', emoji: '🦉', color: '#f8fafc', rarity: 'epic', description: 'The wisest owl with feathers of snow!', unlock: 'Win 10 games' },
        { id: 'lucky-clover', name: 'Lucky Clover', emoji: '🍀', color: '#16a34a', rarity: 'epic', description: 'Four leaves of pure luck and happiness!', unlock: 'Win 5 games in a row' },
        // --- Legendary (2) ---
        { id: 'starry-fish', name: 'Starry Fish', emoji: '🐠', color: '#fb923c', rarity: 'legendary', description: 'A magical fish made of stardust!', unlock: 'Win 25 games' },
        { id: 'candy-dragon', name: 'Candy Dragon', emoji: '🐉', color: '#e879f9', rarity: 'legendary', description: 'A sweet dragon that breathes rainbow fire!', unlock: 'Play 50 games' }
    ],
    scary: [
        // --- Common (10) ---
        { id: 'vampire-lord', name: 'Vampire Lord', emoji: '🧛', color: '#dc2626', rarity: 'common', description: 'Ancient bloodsucker who rules the night with elegance.', unlock: null },
        { id: 'howling-wolf', name: 'Howling Wolf', emoji: '🐺', color: '#9333ea', rarity: 'common', description: 'A fierce werewolf that hunts under the full moon.', unlock: null },
        { id: 'ghost-haunter', name: 'Ghost Haunter', emoji: '👻', color: '#6b7280', rarity: 'common', description: 'Boo! This specter haunts the halls of forgotten places.', unlock: null },
        { id: 'zombie-king', name: 'Zombie King', emoji: '🧟', color: '#65a30d', rarity: 'common', description: 'Leader of the undead horde. Braaaains!', unlock: null },
        { id: 'witch-mage', name: 'Witch Mage', emoji: '🧙', color: '#7c3aed', rarity: 'common', description: 'Brews potions and casts hexes on her enemies.', unlock: null },
        { id: 'skeleton-warrior', name: 'Skeleton Warrior', emoji: '💀', color: '#f5f5f5', rarity: 'common', description: 'Risen from the grave to fight once more.', unlock: null },
        { id: 'demon-hunter', name: 'Demon Hunter', emoji: '😈', color: '#b91c1c', rarity: 'common', description: 'Walks the line between darkness and light.', unlock: null },
        { id: 'dark-wizard', name: 'Dark Wizard', emoji: '🧙‍♂️', color: '#581c87', rarity: 'common', description: 'Master of forbidden magic and dark arts.', unlock: null },
        { id: 'shadow-reaper', name: 'Shadow Reaper', emoji: '☠️', color: '#1f2937', rarity: 'common', description: 'Collector of souls, bringer of the end.', unlock: null },
        { id: 'cursed-mummy', name: 'Cursed Mummy', emoji: '🧟‍♀️', color: '#ca8a04', rarity: 'common', description: 'Wrapped in ancient bandages, cursed for eternity.', unlock: null },
        // --- Uncommon (3) ---
        { id: 'bone-crawler', name: 'Bone Crawler', emoji: '🦴', color: '#d4d4d8', rarity: 'uncommon', description: 'A creature made entirely of rattling bones.', unlock: 'Play your first game' },
        { id: 'plague-doctor', name: 'Plague Doctor', emoji: '🎭', color: '#525252', rarity: 'uncommon', description: 'Mysterious healer with a dark past.', unlock: 'Win a game' },
        { id: 'blood-raven', name: 'Blood Raven', emoji: '🐦‍⬛', color: '#991b1b', rarity: 'uncommon', description: 'An omen of doom that follows death.', unlock: 'Play 5 games' },
        // --- Rare (3) ---
        { id: 'swamp-fiend', name: 'Swamp Fiend', emoji: '🧟', color: '#4d7c0f', rarity: 'rare', description: 'Rises from the murky depths to drag victims below.', unlock: 'Win 3 games' },
        { id: 'night-stalker', name: 'Night Stalker', emoji: '🌑', color: '#334155', rarity: 'rare', description: 'Invisible in darkness, deadly in silence.', unlock: 'Play 3 different game types' },
        { id: 'venom-spider', name: 'Venom Spider', emoji: '🕷️', color: '#7f1d1d', rarity: 'rare', description: 'Weaves webs of poison and despair.', unlock: 'Play 10 games' },
        // --- Epic (2) ---
        { id: 'tomb-keeper', name: 'Tomb Keeper', emoji: '⚰️', color: '#78716c', rarity: 'epic', description: 'Guards the secrets of the ancient dead.', unlock: 'Win 10 games' },
        { id: 'banshee-wail', name: 'Banshee Wail', emoji: '👻', color: '#a5b4fc', rarity: 'epic', description: 'Her scream foretells death itself.', unlock: 'Win 5 games in a row' },
        // --- Legendary (2) ---
        { id: 'inferno-imp', name: 'Inferno Imp', emoji: '🔥', color: '#ea580c', rarity: 'legendary', description: 'A demon from the deepest pits of the underworld.', unlock: 'Win 25 games' },
        { id: 'crypt-wyrm', name: 'Crypt Wyrm', emoji: '🐍', color: '#6b21a8', rarity: 'legendary', description: 'Ancient dragon that devours souls and guards cursed treasures.', unlock: 'Play 50 games' }
    ]
};
