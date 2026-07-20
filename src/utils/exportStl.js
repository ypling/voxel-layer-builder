import { Group, Mesh, MeshStandardMaterial, BufferGeometry, BufferAttribute } from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

function getKey(x, y, z) {
  return `${x},${y},${z}`;
}

function findConnectedComponents(blocksArray) {
  const visited = new Set();
  const components = [];

  function floodFill(sx, sy, sz) {
    const queue = [[sx, sy, sz]];
    const comp = [];
    visited.add(getKey(sx, sy, sz));

    while (queue.length) {
      const [x, y, z] = queue.shift();
      comp.push([x, y, z]);

      const neighbors = [
        [x + 1, y, z],
        [x - 1, y, z],
        [x, y + 1, z],
        [x, y - 1, z],
        [x, y, z + 1],
        [x, y, z - 1],
      ];

      for (const [nx, ny, nz] of neighbors) {
        if (
          nx >= 0 &&
          nx < blocksArray.length &&
          ny >= 0 &&
          ny < (blocksArray[nx] || []).length &&
          nz >= 0 &&
          nz < ((blocksArray[nx] || [])[ny] || []).length &&
          blocksArray[nx][ny][nz] !== undefined
        ) {
          const k = getKey(nx, ny, nz);
          if (!visited.has(k)) {
            visited.add(k);
            queue.push([nx, ny, nz]);
          }
        }
      }
    }

    return comp;
  }

  for (let x = 0; x < blocksArray.length; x += 1) {
    for (let y = 0; y < (blocksArray[x] || []).length; y += 1) {
      for (let z = 0; z < ((blocksArray[x] || [])[y] || []).length; z += 1) {
        if (blocksArray[x] && blocksArray[x][y] && blocksArray[x][y][z] !== undefined) {
          const k = getKey(x, y, z);
          if (!visited.has(k)) {
            components.push(floodFill(x, y, z));
          }
        }
      }
    }
  }

  return components;
}

function mergeComponentToGeometry(component, blocksSet) {
  const pos = [];
  const idx = [];
  const vertexMap = new Map();

  function addVertex(vx, vy, vz) {
    const key = `${vx},${vy},${vz}`;
    if (vertexMap.has(key)) return vertexMap.get(key);
    const index = pos.length / 3;
    pos.push(vx, vy, vz);
    vertexMap.set(key, index);
    return index;
  }

  // For each block add only faces that are exposed (neighbor absent)
  for (const [x, y, z] of component) {
    const neighbors = {
      px: blocksSet.has(getKey(x + 1, y, z)),
      nx: blocksSet.has(getKey(x - 1, y, z)),
      py: blocksSet.has(getKey(x, y + 1, z)),
      ny: blocksSet.has(getKey(x, y - 1, z)),
      pz: blocksSet.has(getKey(x, y, z + 1)),
      nz: blocksSet.has(getKey(x, y, z - 1)),
    };

    const x0 = x;
    const x1 = x + 1;
    const y0 = y;
    const y1 = y + 1;
    const z0 = z;
    const z1 = z + 1;

    // +X face (right)
    if (!neighbors.px) {
      const a = addVertex(x1, y0, z0);
      const b = addVertex(x1, y1, z0);
      const c = addVertex(x1, y1, z1);
      const d = addVertex(x1, y0, z1);
      idx.push(a, b, d, b, c, d);
    }

    // -X face (left)
    if (!neighbors.nx) {
      const a = addVertex(x0, y0, z0);
      const b = addVertex(x0, y0, z1);
      const c = addVertex(x0, y1, z1);
      const d = addVertex(x0, y1, z0);
      idx.push(a, b, d, b, c, d);
    }

    // +Y face (top)
    if (!neighbors.py) {
      const a = addVertex(x0, y1, z0);
      const b = addVertex(x0, y1, z1);
      const c = addVertex(x1, y1, z1);
      const d = addVertex(x1, y1, z0);
      idx.push(a, b, d, b, c, d);
    }

    // -Y face (bottom)
    if (!neighbors.ny) {
      const a = addVertex(x0, y0, z0);
      const b = addVertex(x1, y0, z0);
      const c = addVertex(x1, y0, z1);
      const d = addVertex(x0, y0, z1);
      idx.push(a, b, d, b, c, d);
    }

    // +Z face (front)
    if (!neighbors.pz) {
      const a = addVertex(x0, y0, z1);
      const b = addVertex(x1, y0, z1);
      const c = addVertex(x1, y1, z1);
      const d = addVertex(x0, y1, z1);
      idx.push(a, b, d, b, c, d);
    }

    // -Z face (back)
    if (!neighbors.nz) {
      const a = addVertex(x0, y0, z0);
      const b = addVertex(x0, y1, z0);
      const c = addVertex(x1, y1, z0);
      const d = addVertex(x1, y0, z0);
      idx.push(a, b, d, b, c, d);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
  if (idx.length > 0) {
    const IndexArray = pos.length / 3 > 65535 ? Uint32Array : Uint16Array;
    geometry.setIndex(new BufferAttribute(new IndexArray(idx), 1));
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function exportBlocksArrayToStl(blocksArray, filename = 'model.stl') {
  if (!Array.isArray(blocksArray) || blocksArray.length === 0) return;

  const exporter = new STLExporter();
  const material = new MeshStandardMaterial();

  // Build a set of existing block keys for fast neighbor checks
  const blocksSet = new Set();
  for (let x = 0; x < blocksArray.length; x += 1) {
    for (let y = 0; y < (blocksArray[x] || []).length; y += 1) {
      for (let z = 0; z < ((blocksArray[x] || [])[y] || []).length; z += 1) {
        if (blocksArray[x] && blocksArray[x][y] && blocksArray[x][y][z] !== undefined) {
          blocksSet.add(getKey(x, y, z));
        }
      }
    }
  }

  const components = findConnectedComponents(blocksArray);
  if (components.length === 0) return;

  const scene = new Group();
  for (const component of components) {
    const geometry = mergeComponentToGeometry(component, blocksSet);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);
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
