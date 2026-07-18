import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { BackSide, Color } from 'three';

export default function Sky() {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new Color('#87ceeb');
  }, [scene]);

  return (
    <Sphere args={[120, 32, 32]} scale={[-1, 1, 1]}>
      <meshBasicMaterial color="#87ceeb" side={BackSide} />
    </Sphere>
  );
}
