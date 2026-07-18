import { Canvas } from '@react-three/fiber';
import { Plane, OrbitControls } from '@react-three/drei';
import { FrontSide } from 'three';

export default function Ground() {
  return (
    <Plane
      args={[12, 12]}
      position={[4.5, 0, 4.5]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshPhongMaterial color="green" side={FrontSide} />
    </Plane>
  );
}
