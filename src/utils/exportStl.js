import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

export function exportBlocksArrayToStl(blocksArray, filename = 'model.stl') {
  if (!Array.isArray(blocksArray) || blocksArray.length === 0) {
    return;
  }

  const exporter = new STLExporter();
  const scene = new Group();
  const blockGeometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial();

  for (let x = 0; x < blocksArray.length; x += 1) {
    for (let y = 0; y < blocksArray[x].length; y += 1) {
      for (let z = 0; z < blocksArray[x][y].length; z += 1) {
        if (blocksArray[x][y][z] !== undefined) {
          const mesh = new Mesh(blockGeometry, material);
          mesh.position.set(x, y + 0.5, z);
          scene.add(mesh);
        }
      }
    }
  }

  if (scene.children.length === 0) {
    return;
  }

  scene.updateMatrixWorld(true);
  const stlString = exporter.parse(scene);
  const blob = new Blob([stlString], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
