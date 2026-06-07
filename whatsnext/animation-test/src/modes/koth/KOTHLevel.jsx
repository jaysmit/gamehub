import React, { useMemo, useEffect } from 'react';
import { useStore } from '../../useStore';

// Pyramid dimensions
const PYRAMID_BASE = 150; // 150m base
const PYRAMID_HEIGHT = 45; // ~45m tall (half the original height = half the steps)
const BLOCK_HEIGHT = 1.5; // Each block is 1.5m tall (jumpable)
const BLOCK_STEP_IN = 2.4; // How much each layer steps in from the one below

// Calculate number of layers
const NUM_LAYERS = Math.floor(PYRAMID_HEIGHT / BLOCK_HEIGHT);

// Generate pyramid blocks data
function generatePyramidBlocks() {
  const blocks = [];

  for (let layer = 0; layer < NUM_LAYERS; layer++) {
    const y = layer * BLOCK_HEIGHT;
    const layerSize = PYRAMID_BASE - (layer * BLOCK_STEP_IN * 2);

    if (layerSize <= 0) break;

    // Each layer is a flat platform made of multiple smaller blocks for visual interest
    // But for simplicity and performance, we render each layer as a single box
    blocks.push({
      layer,
      y: y + BLOCK_HEIGHT / 2, // Position at center of block
      size: layerSize,
      height: BLOCK_HEIGHT,
    });
  }

  return blocks;
}

// Single pyramid layer component
function PyramidLayer({ layer, y, size, height }) {
  // Color gradient from brown at bottom to gold at top
  const progress = layer / NUM_LAYERS;
  const r = Math.floor(139 + (218 - 139) * progress);
  const g = Math.floor(90 + (165 - 90) * progress);
  const b = Math.floor(43 + (32 - 43) * progress);
  const color = `rgb(${r}, ${g}, ${b})`;

  return (
    <mesh position={[0, y, 0]} castShadow receiveShadow>
      <boxGeometry args={[size, height, size]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function KOTHLevel() {
  const gameMode = useStore((s) => s.gameMode);
  const addLandscapeBlock = useStore((s) => s.addLandscapeBlock);
  const clearLandscapeBlocks = useStore((s) => s.clearLandscapeBlocks);

  // Generate pyramid blocks once
  const pyramidBlocks = useMemo(() => generatePyramidBlocks(), []);

  // Register collision blocks for each pyramid layer
  useEffect(() => {
    if (gameMode !== 'koth') return;

    // Clear any existing blocks
    clearLandscapeBlocks();

    // Add collision for each pyramid layer
    pyramidBlocks.forEach((block) => {
      addLandscapeBlock({
        x: -block.size / 2,
        z: -block.size / 2,
        height: block.y - block.height / 2, // Bottom of block
        color: '#8B5A2B',
        width: block.size,
        length: block.size,
        blockHeight: block.height,
      });
    });

    return () => {
      clearLandscapeBlocks();
    };
  }, [gameMode, pyramidBlocks, addLandscapeBlock, clearLandscapeBlocks]);

  return (
    <group>
      {/* Ground plane around pyramid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#c2b280" /> {/* Sandy color */}
      </mesh>

      {/* Pyramid layers */}
      {pyramidBlocks.map((block, i) => (
        <PyramidLayer key={i} {...block} />
      ))}

      {/* Decorative peak marker */}
      {pyramidBlocks.length > 0 && (
        <mesh
          position={[0, pyramidBlocks[pyramidBlocks.length - 1].y + BLOCK_HEIGHT, 0]}
          castShadow
        >
          <coneGeometry args={[2, 4, 4]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
        </mesh>
      )}

      {/* Boundary indicators (visual only) */}
      {[-1, 1].map((xSign) =>
        [-1, 1].map((zSign) => (
          <mesh
            key={`corner-${xSign}-${zSign}`}
            position={[xSign * 100, 1, zSign * 100]}
          >
            <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        ))
      )}
    </group>
  );
}

// Export pyramid dimensions for use in other files
export const PYRAMID_DIMENSIONS = {
  base: PYRAMID_BASE,
  height: PYRAMID_HEIGHT,
  blockHeight: BLOCK_HEIGHT,
  blockStepIn: BLOCK_STEP_IN,
  numLayers: NUM_LAYERS,
};
