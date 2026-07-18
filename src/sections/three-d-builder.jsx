import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import Ground from '../components/builder/ground';
import LayerMeshGuide from '../components/builder/layer-mesh-guide';
import Sky from '../components/builder/enviroment/sky';

export default function ThreeDBuilder({ size, blockColor, blocksArray, onBlocksArrayChange }) {
  const [selectedLayer, setSelectedLayer] = useState(0);

  useEffect(() => {
    // Initialize blocksArray with a size cube grid of undefined values
    const initialBlocksArray = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Array.from({ length: size }, () => undefined))
    );
    onBlocksArrayChange(initialBlocksArray);

    const handleKeyDown = (event) => {
      if (event.key === '+' || event.key === '=') {
        setSelectedLayer((selectedLayer) => Math.min(selectedLayer + 1, size - 1));
      }

      if (event.key === '-') {
        setSelectedLayer((selectedLayer) => Math.max(selectedLayer - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleBlockClick = (x, y, z, key) => {
    // Create a copy of the blocksArray to avoid mutating state directly
    const newBlocksArray = blocksArray.map((layer) => layer.map((row) => [...row]));

    // Toggle the block at the clicked position
    if (key === 'left') {
      newBlocksArray[x][y][z] = blockColor;
    } else if (key === 'right' && y === selectedLayer) {
      newBlocksArray[x][y][z] = undefined;
    }

    // Update the state with the new array
    console.log('New blocks array:', x, y, z, newBlocksArray);
    onBlocksArrayChange(newBlocksArray);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Canvas camera={{ position: [9.5, 9.5, 9.5], fov: 50 }}>
        <Sky />
        <Ground />
        <LayerMeshGuide
          selectedLayer={selectedLayer}
          blocks={blocksArray}
          onBlockClick={handleBlockClick}
        />

        <OrbitControls enableDamping dampingFactor={0.1} />
        <directionalLight
          position={[10, 20, 5]}
          intensity={1.4}
          castShadow={false}
          color="#ffd9a0"
        />
        <ambientLight intensity={1.2} />
      </Canvas>
    </Box>
  );
}
