import { Canvas } from '@react-three/fiber';
import { Box, Edges, OrbitControls } from '@react-three/drei';

export default function LayerMeshGuide({ selectedLayer, blocks, onBlockClick }) {
  const boxList = [];
  blocks.forEach((_, x) => {
    blocks[x].forEach((_, y) => {
      blocks[x][y].forEach((block, z) => {
        if (block === undefined && y === selectedLayer) {
          boxList.push(
            <Box
              key={`${x}-${y}-${z}`}
              args={[1, 1, 1]}
              position={[x, y + 0.5, z]}
              onPointerDown={(e) => {
                e.stopPropagation();
                const key = e.button === 0 ? 'left' : 'right';
                console.log(`Block at (${x}, ${y}, ${z}) clicked with ${key} mouse button`);
                onBlockClick(x, y, z, key);
              }}
            >
              <meshPhongMaterial visible={false} />
              <Edges color="white" />
            </Box>
          );
        } else if (block !== undefined) {
          console.log('Rendering block at:', x, y, z);
          boxList.push(
            <Box
              key={`${x}-${y}-${z}`}
              args={[1, 1, 1]}
              position={[x, y + 0.5, z]}
              onPointerDown={(e) => {
                e.stopPropagation();
                const key = e.button === 0 ? 'left' : 'right';
                console.log(`Block at (${x}, ${y}, ${z}) clicked with ${key} mouse button`);
                onBlockClick(x, y, z, key);
              }}
            >
              <meshPhongMaterial color={block} visible={true} />
              <Edges color="white" />
            </Box>
          );
        }
      });
    });
  });
  return <>{boxList}</>;
}
