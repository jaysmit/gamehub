# Animation Test Environment - Reference Document

## Overview

A 3D character animation testing environment built with React Three Fiber. Used for developing and debugging character animations, movement physics, and camera systems before integrating into the main WhatsNext game.

**Location:** `whatsnext/animation-test/`
**Dev Server:** `npm run dev` (runs on port 5174 or next available)

---

## Tech Stack

- **React 18** + **Vite 5**
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful R3F helpers (useGLTF, useAnimations, Grid)
- **Leva** - GUI controls panel for real-time settings adjustment
- **Zustand** - State management
- **Three.js** - 3D rendering

---

## Folder Structure

```
animation-test/
├── package.json
├── vite.config.js
├── index.html
├── public/
│   └── UAL1_Standard.glb    # Character model with 45 animations
└── src/
    ├── main.jsx             # Entry point
    ├── App.jsx              # Canvas setup, Leva panel
    ├── Scene.jsx            # Lighting, ground, character, camera + settings
    ├── Character.jsx        # Player controller, animations, physics
    ├── ThirdPersonCamera.jsx # Camera follow system
    ├── Ground.jsx           # Ground plane with grid
    ├── Controls.jsx         # On-screen control hints
    ├── HUD.jsx              # Status display (mode, animation)
    └── useStore.js          # Zustand store for shared state
```

---

## Controls

| Input | Action |
|-------|--------|
| W | Move forward (direction camera faces) |
| S | Move backward |
| A | Strafe left |
| D | Strafe right |
| Space | Jump |
| Z | Toggle walk/run mode |
| Right-click + drag horizontal | Rotate character |
| Right-click + drag vertical | Adjust camera pitch |
| Mouse wheel | Zoom in/out |

---

## Character System

### Model
- **File:** `public/UAL1_Standard.glb`
- **Source:** Quaternius Universal Animation Library (CC0)
- **Format:** GLTF 2.0 binary (exported from Blender)

### Available Animations (45 total)
Key animations used:
- `Idle_Loop` - Standing idle
- `Walk_Loop` - Walking
- `Sprint_Loop` - Running
- `Jump_Start` - Jump takeoff
- `Jump_Loop` - Falling/mid-air
- `Jump_Land` - Landing (not yet implemented)

Other useful animations:
- `Jog_Fwd_Loop`, `Crouch_Fwd_Loop`, `Roll`
- `Dance_Loop` (victory), `Death01`
- `Swim_Fwd_Loop`, `Swim_Idle_Loop`
- Combat: `Punch_Jab`, `Punch_Cross`, `Sword_Attack`
- And more (see console log on load)

### Movement Physics
Movement is calculated in local space then rotated by character rotation:
```javascript
// Local movement (W=forward, A=left, etc.)
if (keys.w) moveZ -= 1;  // Forward
if (keys.s) moveZ += 1;  // Backward
if (keys.a) moveX -= 1;  // Left
if (keys.d) moveX += 1;  // Right

// Rotate to world space
const worldMoveX = moveX * cos + moveZ * sin;
const worldMoveZ = -moveX * sin + moveZ * cos;
```

### Model Orientation
- Model faces +Z by default
- Rotated 180° (`Math.PI`) so it faces movement direction (-Z in local space)
- `groupRef` handles position/rotation, `modelRef` wraps the primitive for animations

---

## Camera System

### Third-Person Follow Camera
- Always positioned behind character
- Follows character rotation
- Smooth interpolation for movement

### Camera Offset Calculation
```javascript
// Camera behind character (positive offset from character's perspective)
const offsetX = Math.sin(characterRotation) * horizontalDist;
const offsetZ = Math.cos(characterRotation) * horizontalDist;
```

### Camera Pitch
- Controlled by right-click vertical drag
- Stored in `useStore.cameraPitch`
- Range: -0.5 to 1.2 radians
- Affects both camera height and horizontal distance

---

## Settings (Leva Panel)

Settings are persisted to `localStorage` under key `animation-test-settings`.

### Movement Settings
| Setting | Default | Range | Description |
|---------|---------|-------|-------------|
| walkSpeed | 3 | 1-10 | Walk mode speed |
| runSpeed | 8 | 3-20 | Run mode speed (default mode) |
| jumpForce | 8 | 2-20 | Initial jump velocity |
| gravity | 20 | 5-50 | Downward acceleration |

### Camera Settings
| Setting | Default | Range | Description |
|---------|---------|-------|-------------|
| cameraDistance | 5 | 2-15 | Base distance from character |
| cameraHeight | 2 | 0.5-5 | Base height offset |
| cameraSmoothness | 0.1 | 0.01-0.3 | Interpolation factor |

### Visual Settings
| Setting | Default | Range | Description |
|---------|---------|-------|-------------|
| groundSize | 50 | 10-200 | Ground plane size |
| showGrid | true | - | Toggle grid overlay |
| ambientIntensity | 0.4 | 0-1 | Ambient light strength |
| sunIntensity | 1.5 | 0-3 | Directional light strength |

### Save/Reset Buttons
- **Save Defaults** - Persists current settings to localStorage
- **Reset to Defaults** - Clears saved settings, reverts to defaults

---

## State Management (useStore.js)

Key state:
```javascript
{
  // Settings
  walkSpeed, runSpeed, jumpForce, gravity,
  cameraDistance, cameraHeight, cameraPitch,

  // Runtime state
  isRunning: true,          // Default is running mode
  currentAnimation: string, // Currently playing animation

  // Character state (for camera)
  characterPosition: {x, y, z},
  characterRotation: number,
}
```

---

## Important Implementation Notes

1. **Animation Binding:** `useAnimations` must reference a group that contains the primitive, not the scene directly. The `modelRef` is placed on a group wrapping `<primitive object={scene} />`.

2. **Scene Reuse:** Using the original scene directly (not cloned) because SkeletonUtils.clone breaks animation bindings with useAnimations hook.

3. **Physics:** Simple ground collision (y >= 0), boundary collision (stay within ground), gravity applied per-frame.

4. **Default Mode:** Running is the default (`isRunning: true`). Press Z to toggle to walking.

5. **Coordinate System:**
   - Three.js: Y-up, right-handed
   - Forward: -Z (after model rotation)
   - Camera: +Z offset from character (behind)

---

## KOTH (King of the Hill) Game Mode

### Overview
Players compete to reach and hold the top of a pyramid while AI enemies try to knock them off. Only the Haymaker spell is available - a charged melee attack that knocks back all enemies in front.

**Key Files:**
- `src/modes/koth/KOTHLevel.jsx` - Pyramid geometry and collision blocks
- `src/modes/koth/KOTHAI.jsx` - AI behavior and collision
- `src/modes/koth/KOTHGame.jsx` - Game state, rounds, scoring
- `src/Character.jsx` - Player controls (KOTH-specific logic)
- `src/spells.js` - Haymaker spell definition
- `src/SpellToolbar.jsx` - KOTH toolbar (only Haymaker)

### Pyramid Dimensions
```javascript
PYRAMID_BASE = 150      // 150m base width
PYRAMID_HEIGHT = 45     // 45m tall (half original)
BLOCK_HEIGHT = 1.5      // Each step is 1.5m (jumpable)
BLOCK_STEP_IN = 2.4     // Each layer steps in 2.4m per side
NUM_LAYERS = ~30        // Approximately 30 steps to top
```

### Player Restrictions in KOTH
- **No air jumping** - Can only jump from ground (prevents jumping back when knocked away)
- **Only Haymaker spell** - No other abilities available
- **Spawns at outer edge** - ~100m from pyramid center at round start

### Haymaker Spell (Current - Instant)
```javascript
{
  id: 'heymaker',
  name: 'Haymaker',
  behavior: 'instant',
  damage: 15,
  range: 4,              // Melee range
  coneAngle: 90,         // Hits 90° in front
  maxKnockback: 15,      // Knockback distance
  cooldown: 1,           // 1 second
  manaConst: 0
}
```

### Haymaker Spell (TODO - Charged Version)
**Planned mechanics to implement:**
- Hold key to charge, release to fire
- Charge time: 0 to 3 seconds max
- Scales with charge:
  - Knockback: 3m (no charge) → 15m (full charge)
  - Range: 4m (base) → 6m (full charge)
- While charging:
  - Player cannot move
  - Can be interrupted by knockback
  - Charging animation plays
  - Visual charge indicator needed
- After release: 1 second cooldown

### AI Behavior (KOTHAI.jsx)
- **Goal:** Climb pyramid and attack player
- **Movement:** Walks toward higher positions on pyramid
- **Attack:** Charges Haymaker when player in range (~4m)
- **Knockback:** AI can be knocked back by player's Haymaker

### AI Pyramid Collision
The AI collision system:
1. Checks each pyramid layer from bottom up
2. If AI is horizontally over a layer AND coming from above (Y >= layerTop - stepHeight), they can land on it
3. If AI is below layer top but inside its XZ bounds, they hit the side and get pushed out
4. AI must jump to climb each step (no teleporting/flying)

```javascript
// Key collision logic
if (position.y >= layerTop - stepHeight) {
  // Can land on this layer
  groundLevel = layerTop;
} else {
  // Hitting side - push out
  position.x = sign(position.x) * (halfSize + 0.1);
}
```

### KOTH Events
```javascript
// Teleport player at round start
window.dispatchEvent(new CustomEvent('koth-teleport-player', {
  detail: { x, y, z }
}));

// Knockback AI (from player's Haymaker)
window.dispatchEvent(new CustomEvent('koth-ai-knockback', {
  detail: { targetId, directionX, directionZ, distance }
}));
```

### Spell Slot Configuration (KOTH)
In both `Character.jsx` and `SpellToolbar.jsx`:
```javascript
// KOTH mode only has Haymaker in slot 1
effectiveSpellSlots = gameMode === 'koth'
  ? { '1': 'heymaker', '2': null, ... }
  : spellSlots;
```

---

## Future Integration Notes

When integrating with WhatsNext main game:
- Animation system can be extracted to a reusable hook
- Settings defaults should be pulled from `shared/constants.js`
- Camera system may need adjustment for multiplayer (other players)
- Consider adding animation blending for smoother transitions
- Add `Jump_Land` animation trigger when grounded after falling
