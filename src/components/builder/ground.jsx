import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';

export default function Ground() {
  return (
    <Box args={[12, 1, 12]} position={[4.5, -0.5, 4.5]}>
      <meshPhongMaterial color="green" />
    </Box>
  );
}
