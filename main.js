/* ==========================================
   VERVE & VERSES HOME FINDS — MAIN.JS
   Three.js Villa + Website Interactivity
   ========================================== */

'use strict';

// ==========================================
// THREE.JS SCENE SETUP
// ==========================================

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.physicallyCorrectLights = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1510);
scene.fog = new THREE.Fog(0x1a1510, 30, 80);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(12, 6, 14);
camera.lookAt(0, 2, 0);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 3;
controls.maxDistance = 35;
controls.maxPolarAngle = Math.PI / 2.1;
controls.target.set(0, 2, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.35;
controls.update();

// ==========================================
// MATERIALS LIBRARY
// ==========================================

const M = {};

// Walls - warm cream/beige plaster
M.wall = new THREE.MeshStandardMaterial({
  color: 0xE8DDD0,
  roughness: 0.88,
  metalness: 0.0,
});

// Floor - dark walnut wood
M.floor = new THREE.MeshStandardMaterial({
  color: 0x4A3420,
  roughness: 0.7,
  metalness: 0.05,
});

// Ceiling - off-white
M.ceiling = new THREE.MeshStandardMaterial({
  color: 0xF0EAE0,
  roughness: 0.9,
  metalness: 0.0,
});

// Marble (counters, coffee table tops)
M.marble = new THREE.MeshStandardMaterial({
  color: 0xE8E0D5,
  roughness: 0.12,
  metalness: 0.05,
});

// Sofa upholstery - warm linen
M.sofa = new THREE.MeshStandardMaterial({
  color: 0xC4A882,
  roughness: 0.9,
  metalness: 0.0,
});

// Dark sofa accent
M.sofaDark = new THREE.MeshStandardMaterial({
  color: 0x3A2E26,
  roughness: 0.85,
  metalness: 0.0,
});

// Walnut wood furniture
M.walnut = new THREE.MeshStandardMaterial({
  color: 0x5A3E28,
  roughness: 0.55,
  metalness: 0.05,
});

// Light oak
M.oak = new THREE.MeshStandardMaterial({
  color: 0x8B6845,
  roughness: 0.6,
  metalness: 0.0,
});

// Gold/Brass accents
M.gold = new THREE.MeshStandardMaterial({
  color: 0xB8924A,
  roughness: 0.25,
  metalness: 0.9,
});

// Glass
M.glass = new THREE.MeshStandardMaterial({
  color: 0xC8D8E0,
  roughness: 0.05,
  metalness: 0.1,
  transparent: true,
  opacity: 0.3,
});

// Rug - deep terracotta
M.rug = new THREE.MeshStandardMaterial({
  color: 0x8B5E40,
  roughness: 1.0,
  metalness: 0.0,
});

// Kitchen cabinet
M.cabinet = new THREE.MeshStandardMaterial({
  color: 0xD4C8B8,
  roughness: 0.75,
  metalness: 0.05,
});

// Stone countertop
M.stone = new THREE.MeshStandardMaterial({
  color: 0x5A5450,
  roughness: 0.4,
  metalness: 0.1,
});

// Bed linen - cream white
M.linen = new THREE.MeshStandardMaterial({
  color: 0xF2EDE4,
  roughness: 0.95,
  metalness: 0.0,
});

// Exterior wall - light beige
M.extWall = new THREE.MeshStandardMaterial({
  color: 0xD4C4AA,
  roughness: 0.85,
  metalness: 0.0,
});

// Exterior wood trim
M.extWood = new THREE.MeshStandardMaterial({
  color: 0x3A2A1A,
  roughness: 0.7,
  metalness: 0.0,
});

// Grass/garden
M.grass = new THREE.MeshStandardMaterial({
  color: 0x4A6040,
  roughness: 1.0,
  metalness: 0.0,
});

// Driveway concrete
M.driveway = new THREE.MeshStandardMaterial({
  color: 0x8A8078,
  roughness: 0.9,
  metalness: 0.0,
});

// Lamp shade
M.lampShade = new THREE.MeshStandardMaterial({
  color: 0xD4B88A,
  roughness: 0.8,
  metalness: 0.0,
  transparent: true,
  opacity: 0.85,
  side: THREE.DoubleSide,
});

// Chair seat fabric
M.chairFabric = new THREE.MeshStandardMaterial({
  color: 0x9A7A5A,
  roughness: 0.95,
  metalness: 0.0,
});

// TV Screen
M.screen = new THREE.MeshStandardMaterial({
  color: 0x080808,
  roughness: 0.1,
  metalness: 0.3,
  emissive: 0x050510,
  emissiveIntensity: 0.4,
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function box(w, h, d, mat, x, y, z, rx, ry, rz) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x || 0, y || 0, z || 0);
  if (rx) mesh.rotation.x = rx;
  if (ry) mesh.rotation.y = ry;
  if (rz) mesh.rotation.z = rz;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cylinder(rt, rb, h, seg, mat, x, y, z) {
  const geo = new THREE.CylinderGeometry(rt, rb, h, seg);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x || 0, y || 0, z || 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function sphere(r, w, h, mat, x, y, z) {
  const geo = new THREE.SphereGeometry(r, w, h);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x || 0, y || 0, z || 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function addLight(scene, type, color, intensity, x, y, z, opts) {
  let light;
  if (type === 'point') {
    light = new THREE.PointLight(color, intensity, opts?.dist || 8, opts?.decay || 2);
  } else if (type === 'spot') {
    light = new THREE.SpotLight(color, intensity);
    light.angle = opts?.angle || Math.PI / 6;
    light.penumbra = opts?.penumbra || 0.4;
    if (opts?.target) {
      scene.add(opts.target);
      light.target = opts.target;
    }
  } else if (type === 'dir') {
    light = new THREE.DirectionalLight(color, intensity);
  }
  light.position.set(x, y, z);
  light.castShadow = !!opts?.shadow;
  if (opts?.shadow) {
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    light.shadow.bias = -0.001;
    if (type === 'dir') {
      light.shadow.camera.left = -20;
      light.shadow.camera.right = 20;
      light.shadow.camera.top = 20;
      light.shadow.camera.bottom = -20;
    }
  }
  scene.add(light);
  return light;
}

// ==========================================
// GROUP CONTAINERS
// ==========================================

const villa = new THREE.Group();
scene.add(villa);

const gLiving    = new THREE.Group();
const gKitchen   = new THREE.Group();
const gDining    = new THREE.Group();
const gBedroom   = new THREE.Group();
const gHallway   = new THREE.Group();
const gExterior  = new THREE.Group();

villa.add(gLiving, gKitchen, gDining, gBedroom, gHallway, gExterior);

// ==========================================
// GROUND PLANE
// ==========================================

const ground = box(80, 0.2, 80, M.driveway, 0, -0.1, 0);
scene.add(ground);

const lawn = box(50, 0.05, 50, M.grass, -15, 0, -10);
scene.add(lawn);

// ==========================================
// LIVING ROOM  (origin ~0, 0, 0)
// ==========================================

(function buildLiving() {
  const g = gLiving;

  // Floor
  g.add(box(12, 0.2, 10, M.floor, 0, 0, 0));

  // Walls
  g.add(box(12, 5, 0.2, M.wall, 0, 2.5, -5));   // back wall
  g.add(box(0.2, 5, 10, M.wall, -6, 2.5, 0));    // left wall
  g.add(box(0.2, 5, 10, M.wall, 6, 2.5, 0));     // right wall (shared with kitchen)
  g.add(box(12, 0.2, 10, M.ceiling, 0, 5, 0));   // ceiling

  // Rug
  g.add(box(6, 0.05, 4, M.rug, 0, 0.12, 0.5));

  // Sofa (large sectional)
  g.add(box(4.5, 0.6, 1.2, M.sofa, -0.2, 0.6, 1.8));   // seat
  g.add(box(4.5, 0.8, 0.3, M.sofa, -0.2, 0.9, 2.4));   // back
  g.add(box(0.25, 0.8, 1.2, M.sofa, -2.5, 0.9, 1.8));  // left arm
  g.add(box(0.25, 0.8, 1.2, M.sofa, 2.1, 0.9, 1.8));   // right arm

  // Sofa legs
  [-2.3, -0.5, 1.2, 2.0].forEach(lx => {
    [1.3, 2.3].forEach(lz => {
      g.add(box(0.06, 0.18, 0.06, M.walnut, lx, 0.09, lz));
    });
  });

  // Accent chair (across from sofa)
  g.add(box(1.0, 0.5, 0.9, M.sofaDark, -2.5, 0.5, -1.0));
  g.add(box(1.0, 0.6, 0.2, M.sofaDark, -2.5, 0.8, -1.4));
  [-2.95, -2.05].forEach(ax => {
    [-0.55, -1.35].forEach(az => {
      g.add(box(0.06, 0.18, 0.06, M.walnut, ax, 0.09, az));
    });
  });

  // Coffee table
  g.add(box(1.6, 0.08, 0.9, M.marble, 0, 0.72, 0.5));
  [-0.72, 0.72].forEach(tx => {
    [-0.38, 0.38].forEach(tz => {
      g.add(box(0.06, 0.7, 0.06, M.walnut, tx, 0.36, tz + 0.5));
    });
  });

  // Small decor on coffee table
  g.add(sphere(0.08, 8, 8, M.gold, -0.4, 0.82, 0.4));
  g.add(box(0.15, 0.02, 0.22, M.walnut, 0.2, 0.78, 0.5));
  g.add(box(0.15, 0.02, 0.22, M.walnut, 0.2, 0.81, 0.5));

  // TV Wall feature panel
  g.add(box(7, 3.5, 0.18, M.walnut, 0, 2.0, -4.91));
  g.add(box(5, 2.2, 0.1, M.screen, 0, 2.2, -4.95));
  // TV trim
  g.add(box(5.2, 2.4, 0.05, M.gold, 0, 2.2, -4.97));

  // TV stand
  g.add(box(2.0, 0.5, 0.5, M.walnut, 0, 0.5, -4.6));
  g.add(box(1.8, 0.08, 0.4, M.marble, 0, 0.76, -4.6));

  // Floor lamp
  g.add(cylinder(0.04, 0.04, 3.5, 8, M.gold, 2.8, 1.75, 2.2));
  g.add(cylinder(0.0, 0.28, 0.45, 16, M.lampShade, 2.8, 3.6, 2.2));
  g.add(cylinder(0.35, 0.3, 0.1, 8, M.walnut, 2.8, 0.1, 2.2));

  // Plant pot (corner)
  g.add(cylinder(0.22, 0.18, 0.5, 12, M.walnut, -4.5, 0.35, -3.5));
  g.add(sphere(0.35, 8, 8, new THREE.MeshStandardMaterial({color: 0x2A4020, roughness: 1.0}), -4.5, 0.82, -3.5));

  // Windows on left wall
  for (let wz = -2; wz <= 2; wz += 4) {
    g.add(box(0.15, 2.2, 1.6, M.extWood, -5.93, 3.0, wz));
    g.add(box(0.08, 2.2, 1.6, M.glass, -5.98, 3.0, wz));
  }

  // Ceiling light (rectangular)
  g.add(box(2.5, 0.08, 0.8, M.gold, 0, 4.92, 0));

  // Skirting boards
  g.add(box(12, 0.12, 0.06, M.walnut, 0, 0.06, -4.97));
  g.add(box(0.06, 0.12, 10, M.walnut, -5.97, 0.06, 0));
})();

// ==========================================
// KITCHEN  (offset +14, same level)
// ==========================================

(function buildKitchen() {
  const g = gKitchen;
  const ox = 14;

  // Floor - different tile-like material
  const tileMat = new THREE.MeshStandardMaterial({ color: 0xD8D0C8, roughness: 0.4, metalness: 0.05 });
  g.add(box(10, 0.2, 10, tileMat, ox, 0, 0));

  // Walls
  g.add(box(10, 5, 0.2, M.wall, ox, 2.5, -5));
  g.add(box(0.2, 5, 10, M.wall, ox - 5, 2.5, 0));
  g.add(box(10, 0.2, 10, M.ceiling, ox, 5, 0));

  // Base cabinets along back wall
  g.add(box(8, 1.0, 0.7, M.cabinet, ox, 0.5, -4.5));
  g.add(box(8, 0.06, 0.75, M.stone, ox, 1.02, -4.5));  // countertop

  // Upper cabinets
  g.add(box(8, 1.2, 0.5, M.cabinet, ox, 3.8, -4.75));

  // Cabinet door lines (decorative)
  for (let ci = -3.5; ci <= 3.5; ci += 1.2) {
    g.add(box(0.04, 0.85, 0.04, M.gold, ox + ci, 0.5, -4.13));
  }

  // Kitchen island
  g.add(box(2.4, 0.95, 1.0, M.walnut, ox, 0.47, 1.0));
  g.add(box(2.5, 0.06, 1.1, M.marble, ox, 0.96, 1.0));

  // Island legs
  [[-0.95, 0.6], [0.95, 0.6], [-0.95, 1.4], [0.95, 1.4]].forEach(([ilx, ilz]) => {
    g.add(box(0.08, 0.95, 0.08, M.gold, ox + ilx, 0.47, ilz));
  });

  // Bar stools at island
  [ox - 0.85, ox + 0.85].forEach(sx => {
    g.add(cylinder(0.22, 0.22, 0.08, 16, M.chairFabric, sx, 1.08, 2.4));
    g.add(cylinder(0.035, 0.035, 1.1, 8, M.gold, sx, 0.55, 2.4));
    g.add(cylinder(0.22, 0.22, 0.04, 12, M.gold, sx, 0.04, 2.4));
  });

  // Pendant lights over island
  [ox - 0.85, ox + 0.85].forEach(px => {
    g.add(cylinder(0.02, 0.02, 2.5, 6, M.gold, px, 3.75, 0.8));
    g.add(cylinder(0.0, 0.18, 0.3, 16, M.gold, px, 2.5, 0.8));
    g.add(cylinder(0.12, 0.12, 0.06, 16, M.gold, px, 2.35, 0.8));
  });

  // Sink area (on counter)
  g.add(box(0.7, 0.06, 0.5, M.stone, ox + 2.5, 1.05, -4.5));
  g.add(box(0.04, 0.3, 0.04, M.gold, ox + 2.5, 1.18, -4.28));

  // Window above counter
  g.add(box(0.1, 1.5, 2.5, M.extWood, ox, 3.0, -4.92));
  g.add(box(0.05, 1.5, 2.5, M.glass, ox, 3.0, -4.96));

  // Ceiling light bar
  g.add(box(6, 0.06, 0.3, M.gold, ox, 4.92, -2.5));
})();

// ==========================================
// DINING AREA  (offset -14, same level)
// ==========================================

(function buildDining() {
  const g = gDining;
  const ox = -14;

  g.add(box(10, 0.2, 10, M.floor, ox, 0, 0));

  g.add(box(10, 5, 0.2, M.wall, ox, 2.5, -5));
  g.add(box(0.2, 5, 10, M.wall, ox + 5, 2.5, 0));
  g.add(box(0.2, 5, 10, M.wall, ox - 5, 2.5, 0));
  g.add(box(10, 0.2, 10, M.ceiling, ox, 5, 0));

  // Dining table
  g.add(box(3.2, 0.08, 1.4, M.oak, ox, 1.52, 0));
  // Table legs
  [[-1.4, -0.55], [1.4, -0.55], [-1.4, 0.55], [1.4, 0.55]].forEach(([dx, dz]) => {
    g.add(box(0.08, 1.52, 0.08, M.walnut, ox + dx, 0.76, dz));
  });

  // Dining chairs (6 total)
  const chairPos = [
    [ox - 2.0, 0], [ox - 2.0, -0.7], [ox - 2.0, 0.7],
    [ox + 2.0, 0], [ox + 2.0, -0.7], [ox + 2.0, 0.7],
  ];
  chairPos.forEach(([cx, cz]) => {
    const flip = cx < ox ? 0 : Math.PI;
    const seat = box(0.5, 0.05, 0.5, M.chairFabric, cx, 1.04, cz);
    seat.rotation.y = flip;
    g.add(seat);
    const back = box(0.5, 0.55, 0.06, M.walnut, cx, 1.35, cz + (cx < ox ? 0.23 : -0.23));
    back.rotation.y = flip;
    g.add(back);
    [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]].forEach(([lx, lz]) => {
      g.add(box(0.05, 1.0, 0.05, M.walnut, cx + lx, 0.5, cz + lz));
    });
  });

  // Pendant chandelier over table
  g.add(cylinder(0.02, 0.02, 2.0, 6, M.gold, ox, 4.0, 0));
  // Chandelier ring
  const ringGeo = new THREE.TorusGeometry(0.7, 0.025, 8, 32);
  const ring = new THREE.Mesh(ringGeo, M.gold);
  ring.position.set(ox, 3.0, 0);
  ring.rotation.x = Math.PI / 2;
  ring.castShadow = true;
  g.add(ring);
  // Chandelier pendants
  for (let a = 0; a < 8; a++) {
    const angle = (a / 8) * Math.PI * 2;
    const px = ox + Math.cos(angle) * 0.7;
    const pz = Math.sin(angle) * 0.7;
    g.add(cylinder(0.01, 0.01, 0.4, 6, M.gold, px, 2.8, pz));
    g.add(cylinder(0.0, 0.06, 0.1, 8, M.gold, px, 2.6, pz));
  }

  // Buffet cabinet (back wall)
  g.add(box(3.5, 1.2, 0.5, M.walnut, ox, 0.6, -4.75));
  g.add(box(3.7, 0.06, 0.55, M.marble, ox, 1.22, -4.75));
  // Decor on buffet
  g.add(sphere(0.1, 8, 8, M.gold, ox - 0.8, 1.36, -4.52));
  g.add(cylinder(0.06, 0.06, 0.35, 8, M.gold, ox + 0.5, 1.4, -4.52));
  g.add(box(0.8, 0.3, 0.04, M.walnut, ox, 1.6, -4.93));  // wall art frame

  // Window
  g.add(box(0.12, 2.5, 3.5, M.extWood, ox - 4.92, 3.0, 0));
  g.add(box(0.06, 2.5, 3.5, M.glass, ox - 4.96, 3.0, 0));

  // Rug under table
  g.add(box(4.5, 0.04, 2.8, new THREE.MeshStandardMaterial({color: 0x5A3E2A, roughness: 1.0}), ox, 0.12, 0));
})();

// ==========================================
// BEDROOM  (offset 0, -16 in z)
// ==========================================

(function buildBedroom() {
  const g = gBedroom;
  const oz = -16;

  g.add(box(12, 0.2, 12, M.floor, 0, 0, oz));
  g.add(box(12, 5, 0.2, M.wall, 0, 2.5, oz - 6));
  g.add(box(12, 5, 0.2, M.wall, 0, 2.5, oz + 6));
  g.add(box(0.2, 5, 12, M.wall, -6, 2.5, oz));
  g.add(box(0.2, 5, 12, M.wall, 6, 2.5, oz));
  g.add(box(12, 0.2, 12, M.ceiling, 0, 5, oz));

  // Bed frame
  g.add(box(3.2, 0.35, 2.2, M.walnut, 0, 0.17, oz + 2.5));
  // Mattress
  g.add(box(2.9, 0.5, 2.0, M.linen, 0, 0.6, oz + 2.5));
  // Bedding
  g.add(box(2.9, 0.22, 1.4, new THREE.MeshStandardMaterial({color: 0xC8BCB0, roughness: 0.96}), 0, 0.86, oz + 3.1));
  // Pillows
  [-0.7, 0.7].forEach(px => {
    g.add(box(0.7, 0.22, 0.5, M.linen, px, 0.9, oz + 1.85));
  });
  // Headboard
  g.add(box(3.2, 1.4, 0.14, M.sofaDark, 0, 1.2, oz + 1.55));
  // Headboard upholstery panel
  g.add(box(2.8, 1.1, 0.06, M.sofa, 0, 1.25, oz + 1.51));

  // Bedside tables
  [-2.2, 2.2].forEach(bx => {
    g.add(box(0.6, 0.7, 0.5, M.walnut, bx, 0.35, oz + 2.0));
    g.add(box(0.65, 0.04, 0.55, M.marble, bx, 0.72, oz + 2.0));
    // Table lamp
    g.add(cylinder(0.035, 0.035, 0.5, 8, M.gold, bx, 0.97, oz + 2.0));
    g.add(cylinder(0.0, 0.22, 0.3, 16, M.lampShade, bx, 1.28, oz + 2.0));
    g.add(sphere(0.05, 8, 8, new THREE.MeshStandardMaterial({color: 0xFFE8A0, emissive: 0xFFE060, emissiveIntensity: 0.6}), bx, 1.15, oz + 2.0));
  });

  // Wardrobe
  g.add(box(3.5, 3.0, 0.7, M.walnut, 0, 1.5, oz - 5.65));
  // Wardrobe doors
  g.add(box(0.04, 2.8, 1.65, M.oak, -0.88, 1.5, oz - 5.3));
  g.add(box(0.04, 2.8, 1.65, M.oak, 0.88, 1.5, oz - 5.3));
  // Wardrobe handles
  [-1.5, -0.3, 1.0].forEach(hx => {
    g.add(cylinder(0.02, 0.02, 0.2, 6, M.gold, hx, 1.5, oz - 4.97));
  });

  // Dress mirror
  g.add(box(0.06, 2.0, 0.8, new THREE.MeshStandardMaterial({color: 0xC0D0D8, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.5}), -5.0, 1.5, oz - 2.0));
  g.add(box(0.1, 2.1, 0.92, M.gold, -5.0, 1.5, oz - 2.0));

  // Window (large)
  g.add(box(0.12, 2.5, 4.0, M.extWood, -5.94, 3.0, oz));
  g.add(box(0.06, 2.5, 4.0, M.glass, -5.97, 3.0, oz));

  // Bench at foot of bed
  g.add(box(2.0, 0.45, 0.55, M.sofa, 0, 0.22, oz + 4.5));
  g.add(box(2.0, 0.05, 0.55, M.walnut, 0, 0.47, oz + 4.5));
  [-0.85, 0.85].forEach(lx => {
    g.add(box(0.06, 0.2, 0.06, M.walnut, lx, 0.1, oz + 4.25));
    g.add(box(0.06, 0.2, 0.06, M.walnut, lx, 0.1, oz + 4.75));
  });

  // Rug
  g.add(box(5, 0.04, 3.5, new THREE.MeshStandardMaterial({color: 0x7A5A42, roughness: 1.0}), 0, 0.12, oz + 3.2));

  // Ceiling pendant
  g.add(cylinder(0.02, 0.02, 1.5, 6, M.gold, 0, 4.25, oz));
  g.add(cylinder(0.0, 0.25, 0.35, 20, M.gold, 0, 3.5, oz));
  g.add(cylinder(0.2, 0.2, 0.06, 20, M.gold, 0, 3.32, oz));
})();

// ==========================================
// HALLWAYS
// ==========================================

(function buildHallways() {
  const g = gHallway;

  // Living ↔ Kitchen corridor
  g.add(box(2, 0.2, 10, M.floor, 7, 0, 0));
  g.add(box(2, 5, 0.2, M.wall, 7, 2.5, -5));
  g.add(box(2, 5, 0.2, M.wall, 7, 2.5, 5));
  g.add(box(2, 0.2, 10, M.ceiling, 7, 5, 0));

  // Living ↔ Dining corridor
  g.add(box(2, 0.2, 10, M.floor, -7, 0, 0));
  g.add(box(2, 5, 0.2, M.wall, -7, 2.5, -5));
  g.add(box(2, 5, 0.2, M.wall, -7, 2.5, 5));
  g.add(box(2, 0.2, 10, M.ceiling, -7, 5, 0));

  // Living ↔ Bedroom corridor
  g.add(box(12, 0.2, 6, M.floor, 0, 0, -8));
  g.add(box(0.2, 5, 6, M.wall, -6, 2.5, -8));
  g.add(box(0.2, 5, 6, M.wall, 6, 2.5, -8));
  g.add(box(12, 0.2, 6, M.ceiling, 0, 5, -8));

  // Hallway wall art
  g.add(box(0.04, 1.2, 0.8, M.walnut, 6.96, 2.5, 0));
  g.add(box(0.04, 1.2, 0.8, M.walnut, -6.96, 2.5, 0));

  // Hallway pendant lights
  [[7, 4.9, 0], [-7, 4.9, 0], [0, 4.9, -8]].forEach(([hx, hy, hz]) => {
    g.add(cylinder(0.015, 0.015, 1.2, 6, M.gold, hx, hy - 0.6, hz));
    g.add(cylinder(0.0, 0.15, 0.22, 12, M.gold, hx, hy - 1.3, hz));
  });
})();

// ==========================================
// EXTERIOR
// ==========================================

(function buildExterior() {
  const g = gExterior;

  // Villa main structure - front face
  g.add(box(24, 6, 0.4, M.extWall, 0, 3, 7));
  // Side walls
  g.add(box(0.4, 6, 6, M.extWall, -12, 3, 10));
  g.add(box(0.4, 6, 6, M.extWall, 12, 3, 10));

  // Roof overhang
  g.add(box(26, 0.25, 8, M.extWood, 0, 6.12, 10));
  // Roof soffits
  g.add(box(26, 0.12, 0.5, M.extWood, 0, 5.95, 6.9));

  // Wood trim accents (horizontal)
  [1.5, 3.5, 5.5].forEach(ty => {
    g.add(box(24, 0.12, 0.1, M.extWood, 0, ty, 7.1));
  });

  // Windows (front facade)
  [-7, -3, 1, 5, 9].forEach(wx => {
    g.add(box(0.1, 2.0, 1.6, M.extWood, wx, 3.2, 7.22));
    g.add(box(0.05, 2.0, 1.6, M.glass, wx, 3.2, 7.25));
    // Window sill
    g.add(box(0.08, 0.08, 1.8, M.extWood, wx, 2.2, 7.22));
  });

  // Main entrance door
  g.add(box(0.1, 2.8, 1.4, M.extWood, -10.5, 2.3, 7.22));
  g.add(box(0.06, 2.8, 1.4, new THREE.MeshStandardMaterial({color: 0x1A1410, roughness: 0.4, metalness: 0.1}), -10.5, 2.3, 7.25));
  g.add(sphere(0.06, 8, 8, M.gold, -10.5, 2.3, 7.35));
  // Door frame
  g.add(box(0.15, 3.0, 0.1, M.gold, -10.5, 2.4, 7.21));

  // Garage door area
  g.add(box(0.1, 2.5, 3.8, M.extWood, 9.5, 2.45, 7.22));
  g.add(box(0.06, 2.5, 3.8, M.stone, 9.5, 2.45, 7.25));

  // Front steps / entrance platform
  g.add(box(3, 0.18, 1.5, M.stone, -10.5, 0.09, 8.0));
  g.add(box(2.6, 0.15, 1.2, M.stone, -10.5, 0.24, 8.1));
  g.add(box(2.2, 0.12, 1.0, M.stone, -10.5, 0.36, 8.15));

  // Driveway
  g.add(box(8, 0.12, 12, M.driveway, 8, 0.06, 13));

  // Garden areas
  g.add(box(12, 0.08, 8, M.grass, -8, 0.04, 12));
  g.add(box(8, 0.08, 5, M.grass, -14, 0.04, 9));

  // Hedge/shrubs
  for (let i = 0; i < 6; i++) {
    const hx = -14 + i * 2;
    g.add(box(1.4, 1.0, 0.7, new THREE.MeshStandardMaterial({color: 0x3A5030, roughness: 1.0}), hx, 0.5, 7.5));
  }

  // Trees
  [[-16, 10], [-12, 15], [16, 12], [18, 8]].forEach(([tx, tz]) => {
    g.add(cylinder(0.18, 0.22, 3.5, 8, M.walnut, tx, 1.75, tz));
    g.add(sphere(1.5, 10, 10, new THREE.MeshStandardMaterial({color: 0x2E4A20, roughness: 1.0}), tx, 4.5, tz));
  });

  // Outdoor lamp posts (driveway)
  [4, 12].forEach(lx => {
    g.add(cylinder(0.06, 0.06, 2.5, 8, M.extWood, lx, 1.25, 8));
    g.add(box(0.3, 0.3, 0.3, M.gold, lx, 2.65, 8));
  });

  // Pool area (side)
  g.add(box(6, 0.15, 3.5, new THREE.MeshStandardMaterial({color: 0x1A3A4A, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.85}), -18, 0.08, 12));
  g.add(box(6.4, 0.25, 3.9, M.stone, -18, 0.0, 12));

  // Outdoor lounge chairs by pool
  [-16.5, -19.5].forEach(plx => {
    g.add(box(0.6, 0.15, 2.0, M.linen, plx, 0.3, 10.5));
    g.add(box(0.6, 0.5, 0.1, M.linen, plx, 0.5, 11.4));
    [-0.25, 0.25].forEach(llx => {
      g.add(box(0.04, 0.3, 2.0, M.walnut, plx + llx, 0.15, 10.5));
    });
  });
})();

// ==========================================
// LIGHTING
// ==========================================

// Ambient fill - very warm
const ambient = new THREE.AmbientLight(0xFFE8D0, 0.6);
scene.add(ambient);

// Sun/sky light (directional)
const sun = addLight(scene, 'dir', 0xFFDDB0, 1.8, 15, 25, 10, { shadow: true });

// Living room main light (warm)
addLight(scene, 'point', 0xFFD090, 3.5, 0, 4.7, 0, { dist: 10, decay: 2 });

// TV screen glow
addLight(scene, 'point', 0x8090FF, 0.8, 0, 2.5, -4.5, { dist: 4, decay: 2 });

// Kitchen island pendants
[-0.85 + 14, 0.85 + 14].forEach(px => {
  addLight(scene, 'point', 0xFFD0A0, 2.5, px, 2.3, 0.8, { dist: 5, decay: 2 });
});

// Dining chandelier
addLight(scene, 'point', 0xFFCC80, 4.0, -14, 2.8, 0, { dist: 8, decay: 2 });

// Bedroom bedside lamps
[-2.2, 2.2].forEach(bx => {
  addLight(scene, 'point', 0xFFD070, 1.8, bx, 1.5, -16, { dist: 4, decay: 2 });
});

// Floor lamp in living room
addLight(scene, 'point', 0xFFCC80, 1.5, 2.8, 3.5, 2.2, { dist: 5, decay: 2 });

// Outdoor lamp posts
[4, 12].forEach(lx => {
  addLight(scene, 'point', 0xFFE090, 2.0, lx, 2.8, 8, { dist: 6, decay: 2 });
});

// Hallway sconces
addLight(scene, 'point', 0xFFCC80, 1.2, 7, 3.0, 0, { dist: 4, decay: 2 });
addLight(scene, 'point', 0xFFCC80, 1.2, -7, 3.0, 0, { dist: 4, decay: 2 });

// ==========================================
// CAMERA PRESETS PER ROOM
// ==========================================

const cameraPresets = {
  living:   { pos: [8, 4.5, 6],    target: [0, 2, 0],      rot: 0.35 },
  kitchen:  { pos: [22, 4.5, 6],   target: [14, 2, 0],     rot: 0.35 },
  dining:   { pos: [-6, 4.5, 6],   target: [-14, 2, 0],    rot: 0.35 },
  bedroom:  { pos: [8, 4.5, -10],  target: [0, 2, -16],    rot: 0.35 },
  exterior: { pos: [5, 8, 22],     target: [0, 3, 8],      rot: 0.2  },
};

let currentRoom = 'living';
let isAnimating = false;

function tweenCamera(preset) {
  if (isAnimating) return;
  isAnimating = true;

  const startPos   = camera.position.clone();
  const startTarget = controls.target.clone();
  const endPos   = new THREE.Vector3(...preset.pos);
  const endTarget = new THREE.Vector3(...preset.target);

  controls.autoRotateSpeed = preset.rot;

  let t = 0;
  const dur = 120;

  function step() {
    t++;
    const ease = t < dur / 2
      ? 2 * (t / dur) * (t / dur)
      : -1 + (4 - 2 * (t / dur)) * (t / dur);

    camera.position.lerpVectors(startPos, endPos, ease);
    controls.target.lerpVectors(startTarget, endTarget, ease);
    controls.update();

    if (t < dur) requestAnimationFrame(step);
    else isAnimating = false;
  }
  requestAnimationFrame(step);
}

// Room buttons
document.querySelectorAll('.room-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const room = btn.dataset.room;
    if (room === currentRoom) return;
    currentRoom = room;

    document.querySelectorAll('.room-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.room-detail').forEach(d => d.classList.remove('active'));
    document.getElementById('info-' + room).classList.add('active');

    tweenCamera(cameraPresets[room]);
  });
});

// ==========================================
// RENDER LOOP
// ==========================================

const clock = new THREE.Clock();
let frame = 0;

function animate() {
  requestAnimationFrame(animate);
  frame++;

  const t = clock.getElapsedTime();

  // Subtle pulse on lamp lights
  scene.traverse(obj => {
    if (obj.isPointLight && obj.color.r > 0.9) {
      obj.intensity = obj.intensity * 0.98 + (obj.userData.baseIntensity || obj.intensity) * 0.02 + Math.sin(t * 1.2) * 0.04;
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

// ==========================================
// RESIZE
// ==========================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// NAVBAR SCROLL
// ==========================================

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ==========================================
// MOBILE MENU
// ==========================================

const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ==========================================
// TESTIMONIAL SLIDER
// ==========================================

const testimonials = document.querySelectorAll('.testimonial');
const tdots        = document.querySelectorAll('.tdot');
let currentT = 0;

function showTestimonial(idx) {
  testimonials.forEach(t => t.classList.remove('active'));
  tdots.forEach(d => d.classList.remove('active'));
  testimonials[idx].classList.add('active');
  tdots[idx].classList.add('active');
  currentT = idx;
}

tdots.forEach((dot, i) => {
  dot.addEventListener('click', () => showTestimonial(i));
});

setInterval(() => {
  showTestimonial((currentT + 1) % testimonials.length);
}, 5500);

// ==========================================
// CONTACT FORM
// ==========================================

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('contactForm').classList.add('hidden');
  document.getElementById('form-success').classList.remove('hidden');
});

// ==========================================
// SCROLL REVEAL
// ==========================================

const reveals = document.querySelectorAll(
  '#about .about-grid, #services .service-card, #portfolio .portfolio-item, #testimonials, .contact-grid'
);

reveals.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

reveals.forEach(el => revealObserver.observe(el));

// ==========================================
// AUTO-ROTATE PAUSE ON HOVER
// ==========================================

const heroWrapper = document.getElementById('hero-canvas-wrapper');

heroWrapper.addEventListener('mouseenter', () => {
  controls.autoRotate = false;
});

heroWrapper.addEventListener('mouseleave', () => {
  controls.autoRotate = true;
});

// ==========================================
// SCROLL TO EXPERIENCE — ROOM NAV TRIGGER
// ==========================================

document.querySelector('[href="#experience"]')?.addEventListener('click', () => {
  setTimeout(() => tweenCamera(cameraPresets.living), 600);
});

// ==========================================
// STAGGER SERVICE CARDS
// ==========================================

document.querySelectorAll('.service-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.06}s`;
});