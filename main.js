/* ==========================================
   VERVE & VERSES — VIRTUAL TOUR v2
   Modern Japanese Luxury Interior
   Three.js WebGL Interactive Experience
   ========================================== */
'use strict';

// ── RENDERER ────────────────────────────────
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.physicallyCorrectLights = true;

// ── SCENE ────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1310);
scene.fog = new THREE.FogExp2(0x1a1310, 0.018);

// ── CAMERA ───────────────────────────────────
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(16, 9, 18);

// ── ORBIT CONTROLS ───────────────────────────
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.minDistance = 2;
controls.maxDistance = 42;
controls.maxPolarAngle = Math.PI / 2.05;
controls.target.set(0, 2, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.28;
controls.update();

// ── HELPERS ──────────────────────────────────
function mesh(geo, mat, x, y, z, rx, ry, rz) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x || 0, y || 0, z || 0);
  if (rx !== undefined) m.rotation.x = rx;
  if (ry !== undefined) m.rotation.y = ry;
  if (rz !== undefined) m.rotation.z = rz;
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
function box(w, h, d, mat, x, y, z, rx, ry, rz) {
  return mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, rx, ry, rz);
}
function cyl(rt, rb, h, seg, mat, x, y, z) {
  return mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y, z);
}
function sph(r, ws, hs, mat, x, y, z) {
  return mesh(new THREE.SphereGeometry(r, ws, hs), mat, x, y, z);
}
function grp(...children) {
  const g = new THREE.Group();
  children.forEach(c => c && g.add(c));
  return g;
}
function ptLight(color, intensity, dist, x, y, z) {
  const l = new THREE.PointLight(color, intensity, dist, 2);
  l.position.set(x, y, z);
  l.castShadow = false;
  return l;
}

// ── MATERIAL PALETTE ─────────────────────────
const M = {
  // Walls — warm washi/plaster white
  wall: new THREE.MeshStandardMaterial({ color: 0xEDE7DC, roughness: 0.92, metalness: 0.0 }),
  wallDark: new THREE.MeshStandardMaterial({ color: 0xD4CBBC, roughness: 0.88, metalness: 0.0 }),

  // Ceilings
  ceil: new THREE.MeshStandardMaterial({ color: 0xF2EDE6, roughness: 0.95, metalness: 0.0 }),

  // Floors — light oak planks
  floorOak: new THREE.MeshStandardMaterial({ color: 0xC8A874, roughness: 0.65, metalness: 0.02 }),
  // Tatami-style floor
  tatami: new THREE.MeshStandardMaterial({ color: 0xBAAA7A, roughness: 0.95, metalness: 0.0 }),
  // Stone tile (bathroom/kitchen)
  tile: new THREE.MeshStandardMaterial({ color: 0xD8D0C4, roughness: 0.38, metalness: 0.08 }),
  // Concrete
  concrete: new THREE.MeshStandardMaterial({ color: 0xAEA89E, roughness: 0.78, metalness: 0.0 }),

  // Wood species
  walnut: new THREE.MeshStandardMaterial({ color: 0x5C3E22, roughness: 0.52, metalness: 0.04 }),
  lightOak: new THREE.MeshStandardMaterial({ color: 0xB8904A, roughness: 0.58, metalness: 0.0 }),
  birch: new THREE.MeshStandardMaterial({ color: 0xD4B882, roughness: 0.7, metalness: 0.0 }),
  bamboo: new THREE.MeshStandardMaterial({ color: 0xC8B460, roughness: 0.8, metalness: 0.0 }),

  // Upholstery
  linen: new THREE.MeshStandardMaterial({ color: 0xE0D4C0, roughness: 0.98, metalness: 0.0 }),
  linenDark: new THREE.MeshStandardMaterial({ color: 0x9A8A78, roughness: 0.96, metalness: 0.0 }),
  fabric: new THREE.MeshStandardMaterial({ color: 0xB8A48A, roughness: 0.97, metalness: 0.0 }),
  cushion: new THREE.MeshStandardMaterial({ color: 0x7A6858, roughness: 0.98, metalness: 0.0 }),

  // Surfaces
  marble: new THREE.MeshStandardMaterial({ color: 0xEAE4DA, roughness: 0.1, metalness: 0.05 }),
  marbleDark: new THREE.MeshStandardMaterial({ color: 0x4A4440, roughness: 0.3, metalness: 0.1 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x9A9088, roughness: 0.55, metalness: 0.05 }),
  washi: new THREE.MeshStandardMaterial({ color: 0xF0E8D8, roughness: 0.96, metalness: 0.0, transparent: true, opacity: 0.82, side: THREE.DoubleSide }),

  // Glass
  glass: new THREE.MeshStandardMaterial({ color: 0xD0DDE8, roughness: 0.04, metalness: 0.12, transparent: true, opacity: 0.28, side: THREE.DoubleSide }),
  glassOp: new THREE.MeshStandardMaterial({ color: 0xC8D8DC, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.55 }),

  // Metal
  brass: new THREE.MeshStandardMaterial({ color: 0xC4A050, roughness: 0.22, metalness: 0.92 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xB89240, roughness: 0.28, metalness: 0.95 }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xD0CCC8, roughness: 0.1, metalness: 0.96 }),
  blackMat: new THREE.MeshStandardMaterial({ color: 0x181410, roughness: 0.6, metalness: 0.1 }),

  // Plants
  leaf: new THREE.MeshStandardMaterial({ color: 0x2A4020, roughness: 1.0, metalness: 0.0 }),
  leafLight: new THREE.MeshStandardMaterial({ color: 0x486040, roughness: 1.0, metalness: 0.0 }),
  soil: new THREE.MeshStandardMaterial({ color: 0x2A1E12, roughness: 1.0, metalness: 0.0 }),
  potCeramic: new THREE.MeshStandardMaterial({ color: 0xC8B8A0, roughness: 0.7, metalness: 0.0 }),
  potBlack: new THREE.MeshStandardMaterial({ color: 0x1E1A16, roughness: 0.65, metalness: 0.0 }),

  // Decor
  paper: new THREE.MeshStandardMaterial({ color: 0xF5EFE4, roughness: 0.98, metalness: 0.0 }),
  screen: new THREE.MeshStandardMaterial({ color: 0x060608, roughness: 0.08, metalness: 0.3, emissive: 0x040612, emissiveIntensity: 0.5 }),
  bedLinen: new THREE.MeshStandardMaterial({ color: 0xEEE8DE, roughness: 0.96, metalness: 0.0 }),
  bedLinen2: new THREE.MeshStandardMaterial({ color: 0xC8BCB0, roughness: 0.97, metalness: 0.0 }),
};

// ── LAYOUT CONSTANTS ─────────────────────────
// Rooms arranged around a central foyer corridor:
//   Foyer: (0, 0, 4)
//   Living: (-8, 0, -2)
//   Kitchen: (8, 0, -2)
//   Dining: (0, 0, -10)
//   Master Bedroom: (-10, 0, -16)
//   Guest Bedroom: (10, 0, -16)
//   Bathroom: (0, 0, -18)
//   Corridor connecting all rooms

const ROOM_H = 3.4; // interior room height

// ── SCENE CONTAINER ──────────────────────────
const home = new THREE.Group();
scene.add(home);

// ── FOYER ────────────────────────────────────
(function buildFoyer() {
  const g = new THREE.Group();
  const cx = 0, cz = 6;

  // Floor - polished stone tile
  g.add(box(10, 0.16, 8, M.tile, cx, 0.08, cz));
  g.add(box(10, 0.16, 8, M.ceil, cx, ROOM_H + 0.08, cz));

  // Walls
  g.add(box(10, ROOM_H, 0.15, M.wall, cx, ROOM_H / 2, cz + 4));       // front
  g.add(box(10, ROOM_H, 0.15, M.wall, cx, ROOM_H / 2, cz - 4));       // back
  g.add(box(0.15, ROOM_H, 8, M.wall, cx - 5, ROOM_H / 2, cz));
  g.add(box(0.15, ROOM_H, 8, M.wall, cx + 5, ROOM_H / 2, cz));

  // Entry door (glass + frame)
  g.add(box(0.12, ROOM_H * 0.7, 1.6, M.walnut, cx, ROOM_H * 0.35, cz + 4.0));
  g.add(box(0.06, ROOM_H * 0.68, 1.5, M.glass, cx, ROOM_H * 0.35, cz + 4.0));
  g.add(cyl(0.03, 0.03, 0.9, 8, M.brass, cx, ROOM_H * 0.38, cz + 4.05));

  // Shoe bench / console
  g.add(box(1.4, 0.44, 0.38, M.lightOak, cx - 3, 0.22, cz + 3.5));
  g.add(box(1.5, 0.04, 0.4, M.walnut, cx - 3, 0.46, cz + 3.5));

  // Entry mirror
  g.add(box(0.06, 1.8, 0.9, M.glassOp, cx - 3, 1.2, cz + 3.82));
  g.add(box(0.08, 1.88, 1.0, M.walnut, cx - 3, 1.2, cz + 3.82));

  // Decorative pendant
  g.add(cyl(0.018, 0.018, 1.2, 6, M.brass, cx, ROOM_H - 0.5, cz));
  g.add(cyl(0.0, 0.22, 0.32, 16, M.brass, cx, ROOM_H - 1.2, cz));
  g.add(cyl(0.18, 0.18, 0.04, 16, M.brass, cx, ROOM_H - 1.36, cz));

  // Small plant - bonsai style
  g.add(box(0.3, 0.04, 0.3, M.potCeramic, cx + 3.5, 0.48, cz + 3.5));
  g.add(sph(0.22, 8, 8, M.leaf, cx + 3.5, 0.72, cz + 3.5));
  g.add(cyl(0.04, 0.04, 0.2, 6, M.walnut, cx + 3.5, 0.58, cz + 3.5));

  // Stone art feature on back wall
  g.add(box(0.08, 1.6, 2.8, M.marbleDark, cx, ROOM_H * 0.5, cz - 3.92));

  home.add(g);
})();

// ── CENTRAL CORRIDOR ─────────────────────────
(function buildCorridor() {
  const g = new THREE.Group();
  // Main spine: connects foyer (z=6) to rear rooms (z=-18)
  g.add(box(4, 0.16, 24, M.floorOak, 0, 0.08, -6));
  g.add(box(4, 0.16, 24, M.ceil, 0, ROOM_H + 0.08, -6));
  g.add(box(0.12, ROOM_H, 24, M.wall, -2, ROOM_H / 2, -6));
  g.add(box(0.12, ROOM_H, 24, M.wall, 2, ROOM_H / 2, -6));

  // Pendant lights along corridor
  [-2, -6, -10, -14].forEach(z => {
    g.add(cyl(0.012, 0.012, 0.9, 6, M.brass, 0, ROOM_H - 0.3, z));
    g.add(cyl(0.0, 0.14, 0.22, 12, M.brass, 0, ROOM_H - 1.25, z));
  });

  // Wall art panels
  [-4, -8, -12].forEach(z => {
    g.add(box(0.06, 0.9, 0.65, M.walnut, -1.96, 2.0, z));
    g.add(box(0.06, 0.9, 0.65, M.walnut, 1.96, 2.0, z));
  });

  home.add(g);
})();

// ── LIVING ROOM ──────────────────────────────
(function buildLiving() {
  const g = new THREE.Group();
  const cx = -8, cz = -2;
  const W = 12, D = 10;

  g.add(box(W, 0.16, D, M.floorOak, cx, 0.08, cz));
  g.add(box(W, 0.16, D, M.ceil, cx, ROOM_H + 0.08, cz));

  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz - D / 2));   // back
  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz + D / 2));   // front (shared)
  g.add(box(0.12, ROOM_H, D, M.wall, cx - W / 2, ROOM_H / 2, cz));   // far left
  // Right side opens to corridor (no wall)

  // Large windows — left wall (floor-to-near-ceil)
  const winH = ROOM_H - 0.5;
  // Window frames
  for (let wz = -3; wz <= 1; wz += 2) {
    g.add(box(0.1, winH, 1.6, M.walnut, cx - W / 2 + 0.05, winH / 2 + 0.2, cz + wz));
    g.add(box(0.06, winH, 1.5, M.glass, cx - W / 2 + 0.07, winH / 2 + 0.2, cz + wz));
  }
  // Transom band above windows
  g.add(box(0.1, 0.4, D * 0.7, M.walnut, cx - W / 2 + 0.05, ROOM_H - 0.2, cz));

  // Feature wall (accent) — back wall
  g.add(box(W * 0.6, ROOM_H, 0.1, M.wallDark, cx, ROOM_H / 2, cz - D / 2 + 0.07));
  // Horizontal wood battens on feature wall
  [0.5, 1.0, 1.5, 2.0, 2.5, 3.0].forEach(h => {
    g.add(box(6, 0.04, 0.07, M.walnut, cx, h, cz - D / 2 + 0.12));
  });

  // SOFA — low profile, Japanese style
  g.add(box(4.2, 0.28, 1.4, M.linen, cx, 0.14, cz + 1.8));    // seat base
  g.add(box(4.2, 0.22, 1.4, M.linen, cx, 0.35, cz + 1.8));    // seat cushion
  g.add(box(4.2, 0.55, 0.22, M.linen, cx, 0.38, cz + 2.48));  // backrest
  // Sofa legs (minimal — barely visible, proper Japanese low)
  [[-1.9, 1.1], [1.9, 1.1], [-1.9, 2.4], [1.9, 2.4]].forEach(([lx, lz]) => {
    g.add(box(0.05, 0.12, 0.05, M.walnut, cx + lx, 0.06, cz + lz));
  });

  // Side cushions
  [-1.7, 1.7].forEach(sx => {
    g.add(box(0.55, 0.5, 0.35, M.cushion, cx + sx, 0.36, cz + 2.3));
  });

  // Low coffee table — natural stone top
  g.add(box(1.4, 0.06, 0.85, M.marble, cx, 0.36, cz + 0.4));
  [[-0.6, 0.1], [0.6, 0.1], [-0.6, 0.7], [0.6, 0.7]].forEach(([lx, lz]) => {
    g.add(box(0.045, 0.36, 0.045, M.walnut, cx + lx, 0.18, cz + lz));
  });
  // Coffee table decor
  g.add(sph(0.07, 8, 8, M.potCeramic, cx - 0.3, 0.41, cz + 0.3));
  g.add(box(0.3, 0.018, 0.2, M.paper, cx + 0.2, 0.38, cz + 0.45));

  // Accent chairs — pair of low reading chairs
  [-3.2, 3.2].forEach((ax, i) => {
    const flip = i === 0 ? 0 : Math.PI;
    const c = new THREE.Group();
    c.add(box(0.9, 0.24, 0.82, M.fabric, 0, 0.12, 0));
    c.add(box(0.9, 0.2, 0.82, M.fabric, 0, 0.32, 0));
    c.add(box(0.9, 0.45, 0.15, M.fabric, 0, 0.35, 0.42));
    c.add(box(0.9, 0.05, 0.15, M.walnut, 0, 0.56, 0.42));
    [[-0.4, -0.35], [0.4, -0.35], [-0.4, 0.35], [0.4, 0.35]].forEach(([lx, lz]) => {
      c.add(box(0.04, 0.1, 0.04, M.walnut, lx, 0.05, lz));
    });
    c.position.set(cx + ax, 0, cz - 0.5);
    c.rotation.y = flip;
    g.add(c);
  });

  // Rug — tatami-inspired
  g.add(box(5.5, 0.04, 4.2, M.tatami, cx, 0.04, cz + 0.8));

  // TV wall unit (shoji-inspired cabinet with integrated TV)
  g.add(box(5.5, ROOM_H * 0.7, 0.22, M.walnut, cx, ROOM_H * 0.35, cz - D / 2 + 0.22));
  g.add(box(3.8, 1.8, 0.1, M.screen, cx, 1.6, cz - D / 2 + 0.28));
  // Shelf compartments in TV unit
  [-2, -1, 0, 1, 2].forEach(sx => {
    g.add(box(0.04, ROOM_H * 0.7, 0.25, M.walnut, cx + sx, ROOM_H * 0.35, cz - D / 2 + 0.22));
  });
  g.add(box(5.5, 0.04, 0.25, M.walnut, cx, 0.7, cz - D / 2 + 0.22));
  g.add(box(5.5, 0.04, 0.25, M.walnut, cx, 2.5, cz - D / 2 + 0.22));

  // TV light accent
  const tvGlow = new THREE.PointLight(0x4455AA, 0.4, 4, 2);
  tvGlow.position.set(cx, 1.6, cz - D / 2 + 0.5);
  g.add(tvGlow);

  // Floor lamp (washi paper shade)
  g.add(cyl(0.018, 0.018, ROOM_H * 0.65, 8, M.brass, cx - 4.5, ROOM_H * 0.33, cz + 3.5));
  g.add(cyl(0.0, 0.28, 0.55, 20, M.washi, cx - 4.5, ROOM_H * 0.65 + 0.3, cz + 3.5));
  g.add(cyl(0.3, 0.28, 0.06, 20, M.walnut, cx - 4.5, ROOM_H * 0.65 + 0.58, cz + 3.5));
  const lampLight = ptLight(0xFFD888, 2.2, 5, cx - 4.5, ROOM_H * 0.65 + 0.1, cz + 3.5);
  g.add(lampLight);

  // Large indoor plant — monstera / fiddle leaf
  buildPlant(g, cx + 4.5, 0, cz + 3.8, 'tall');

  // Ceiling light (linear fixture)
  g.add(box(4, 0.06, 0.18, M.birch, cx, ROOM_H + 0.02, cz));
  g.add(box(3.8, 0.04, 0.12, new THREE.MeshStandardMaterial({ color: 0xFFEECC, emissive: 0xFFEECC, emissiveIntensity: 0.8, roughness: 1 }), cx, ROOM_H - 0.02, cz));

  home.add(g);
})();

// ── KITCHEN ──────────────────────────────────
(function buildKitchen() {
  const g = new THREE.Group();
  const cx = 8, cz = -2;
  const W = 10, D = 10;

  g.add(box(W, 0.16, D, M.tile, cx, 0.08, cz));
  g.add(box(W, 0.16, D, M.ceil, cx, ROOM_H + 0.08, cz));

  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz - D / 2));
  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz + D / 2));
  g.add(box(0.12, ROOM_H, D, M.wall, cx + W / 2, ROOM_H / 2, cz));

  // Window — right wall (sink side)
  g.add(box(0.1, 1.4, 3.2, M.walnut, cx + W / 2 - 0.05, 2.2, cz - 1));
  g.add(box(0.06, 1.38, 3.1, M.glass, cx + W / 2 - 0.07, 2.2, cz - 1));

  // Base cabinets — back wall
  g.add(box(8, 0.9, 0.62, M.birch, cx, 0.45, cz - D / 2 + 0.31));
  g.add(box(8.1, 0.05, 0.68, M.marbleDark, cx, 0.92, cz - D / 2 + 0.31));
  // Cabinet doors (subtle grooves)
  for (let i = -3.3; i <= 3.3; i += 1.1) {
    g.add(box(0.03, 0.84, 0.04, M.walnut, cx + i, 0.45, cz - D / 2 + 0.6));
  }
  // Upper cabinets
  g.add(box(8, 0.9, 0.45, M.birch, cx, 2.6, cz - D / 2 + 0.23));
  // Under-cabinet light strip
  g.add(box(7.8, 0.04, 0.08, new THREE.MeshStandardMaterial({ color: 0xFFEEC0, emissive: 0xFFEEC0, emissiveIntensity: 0.7, roughness: 1 }), cx, 2.14, cz - D / 2 + 0.24));

  // Kitchen island — walnut + stone
  g.add(box(3.0, 0.9, 1.2, M.walnut, cx, 0.45, cz + 0.8));
  g.add(box(3.1, 0.05, 1.28, M.marbleDark, cx, 0.92, cz + 0.8));
  // Island open shelf (back)
  g.add(box(2.8, 0.04, 0.9, M.birch, cx, 0.5, cz + 0.8));
  // Bar stools — 3 stools
  [-1.0, 0, 1.0].forEach(sx => {
    const st = new THREE.Group();
    st.add(cyl(0.2, 0.2, 0.06, 14, M.linenDark, 0, 1.1, 0));
    st.add(cyl(0.025, 0.025, 1.12, 8, M.walnut, 0, 0.56, 0));
    st.add(cyl(0.25, 0.25, 0.04, 12, M.walnut, 0, 0.04, 0));
    st.position.set(cx + sx, 0, cz + 2.2);
    g.add(st);
  });

  // Sink (undermount look)
  g.add(box(0.75, 0.15, 0.45, M.chrome, cx + 3.0, 0.88, cz - D / 2 + 0.31));
  g.add(cyl(0.025, 0.025, 0.3, 8, M.chrome, cx + 3.0, 1.06, cz - D / 2 + 0.18));
  g.add(cyl(0.02, 0.03, 0.04, 8, M.chrome, cx + 3.0, 1.14, cz - D / 2 + 0.18));

  // Pendant lights over island
  [-0.9, 0, 0.9].forEach(px => {
    g.add(cyl(0.015, 0.015, 1.0, 6, M.brass, cx + px, ROOM_H - 0.4, cz + 0.8));
    g.add(cyl(0.0, 0.15, 0.25, 14, M.brass, cx + px, ROOM_H - 1.45, cz + 0.8));
    g.add(cyl(0.12, 0.12, 0.04, 14, M.brass, cx + px, ROOM_H - 1.58, cz + 0.8));
    const pl = ptLight(0xFFD080, 1.8, 4, cx + px, ROOM_H - 1.4, cz + 0.8);
    g.add(pl);
  });

  // Stovetop
  g.add(box(0.8, 0.04, 0.6, M.blackMat, cx - 2.5, 0.93, cz - D / 2 + 0.31));
  for (let i = 0; i < 4; i++) {
    g.add(cyl(0.08, 0.08, 0.02, 16, M.chrome, cx - 2.5 + (i % 2) * 0.32 - 0.16, 0.95, cz - D / 2 + 0.31 + Math.floor(i / 2) * 0.24 - 0.12));
  }

  // Ceiling — concealed light strip on perimeter
  g.add(box(W - 0.5, 0.05, 0.15, new THREE.MeshStandardMaterial({ color: 0xFFF4E0, emissive: 0xFFF4E0, emissiveIntensity: 0.6, roughness: 1 }), cx, ROOM_H - 0.12, cz - D / 2 + 0.4));

  // Back-wall ambient light
  const kitLight = ptLight(0xFFDDA0, 3.5, 8, cx, 2.5, cz);
  g.add(kitLight);

  // Herbs on windowsill (small plants)
  [0, 0.6, 1.2].forEach(po => {
    buildPlant(g, cx + W / 2 - 0.15, 0.94, cz - 2 + po, 'tiny');
  });

  home.add(g);
})();

// ── DINING AREA ──────────────────────────────
(function buildDining() {
  const g = new THREE.Group();
  const cx = 0, cz = -10;
  const W = 14, D = 8;

  g.add(box(W, 0.16, D, M.floorOak, cx, 0.08, cz));
  g.add(box(W, 0.16, D, M.ceil, cx, ROOM_H + 0.08, cz));

  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz - D / 2));
  g.add(box(0.12, ROOM_H, D, M.wall, cx - W / 2, ROOM_H / 2, cz));
  g.add(box(0.12, ROOM_H, D, M.wall, cx + W / 2, ROOM_H / 2, cz));

  // Large window — full wall on far side
  g.add(box(W * 0.7, ROOM_H - 0.4, 0.08, M.glass, cx, (ROOM_H - 0.4) / 2 + 0.2, cz - D / 2 + 0.06));
  // Window frame
  g.add(box(W * 0.7, 0.06, 0.12, M.walnut, cx, ROOM_H - 0.2, cz - D / 2 + 0.06));
  g.add(box(W * 0.7, 0.06, 0.12, M.walnut, cx, 0.2, cz - D / 2 + 0.06));

  // Dining table — solid oak slab
  g.add(box(3.6, 0.07, 1.3, M.lightOak, cx, 0.86, cz));
  // Trestle legs
  [[-1.5, -0.5], [1.5, -0.5], [-1.5, 0.5], [1.5, 0.5]].forEach(([dx, dz]) => {
    g.add(box(0.07, 0.88, 0.07, M.walnut, cx + dx, 0.44, cz + dz));
  });
  // Cross stretchers
  g.add(box(3.0, 0.06, 0.06, M.walnut, cx, 0.28, cz - 0.44));
  g.add(box(3.0, 0.06, 0.06, M.walnut, cx, 0.28, cz + 0.44));

  // Chairs — 6 (wishbone inspired)
  const chairPositions = [
    [cx - 2.2, cz, 0], [cx + 2.2, cz, Math.PI],
    [cx - 2.2, cz - 0.8, 0], [cx + 2.2, cz - 0.8, Math.PI],
    [cx - 2.2, cz + 0.8, 0], [cx + 2.2, cz + 0.8, Math.PI],
  ];
  chairPositions.forEach(([x, z, ry]) => {
    const ch = new THREE.Group();
    ch.add(box(0.52, 0.04, 0.5, M.fabric, 0, 1.02, 0));
    ch.add(box(0.5, 0.54, 0.05, M.walnut, 0, 1.35, 0.26));
    ch.add(cyl(0.025, 0.025, 1.02, 6, M.walnut, -0.2, 0.51, -0.2));
    ch.add(cyl(0.025, 0.025, 1.02, 6, M.walnut, 0.2, 0.51, -0.2));
    ch.add(cyl(0.025, 0.025, 1.02, 6, M.walnut, -0.2, 0.51, 0.22));
    ch.add(cyl(0.025, 0.025, 1.02, 6, M.walnut, 0.2, 0.51, 0.22));
    ch.position.set(x, 0, z);
    ch.rotation.y = ry;
    g.add(ch);
  });

  // Rug
  g.add(box(5.5, 0.04, 3.5, M.tatami, cx, 0.04, cz));

  // Chandelier — Japanese lantern style
  g.add(cyl(0.018, 0.018, 1.5, 6, M.brass, cx, ROOM_H - 0.5, cz));
  g.add(cyl(0.0, 0.42, 0.7, 20, M.washi, cx, ROOM_H - 1.6, cz));
  g.add(cyl(0.38, 0.38, 0.04, 20, M.brass, cx, ROOM_H - 1.96, cz));
  g.add(cyl(0.38, 0.38, 0.04, 20, M.brass, cx, ROOM_H - 1.25, cz));
  const chandelier = ptLight(0xFFD878, 4.5, 9, cx, ROOM_H - 1.6, cz);
  chandelier.castShadow = true;
  chandelier.shadow.mapSize.set(512, 512);
  g.add(chandelier);

  // Sideboard
  g.add(box(3.0, 0.85, 0.5, M.walnut, cx - 4.5, 0.42, cz - D / 2 + 0.28));
  g.add(box(3.1, 0.04, 0.55, M.marble, cx - 4.5, 0.87, cz - D / 2 + 0.28));
  // Sideboard legs
  [[-1.35, -0.22], [1.35, -0.22], [-1.35, 0.22], [1.35, 0.22]].forEach(([lx, lz]) => {
    g.add(box(0.04, 0.14, 0.04, M.brass, cx - 4.5 + lx, 0.07, cz - D / 2 + 0.28 + lz));
  });
  // Decor on sideboard
  g.add(sph(0.1, 8, 8, M.potCeramic, cx - 5.0, 0.96, cz - D / 2 + 0.3));
  g.add(cyl(0.06, 0.08, 0.25, 12, M.potBlack, cx - 4.2, 0.99, cz - D / 2 + 0.3));
  buildPlant(g, cx - 3.8, 0.9, cz - D / 2 + 0.3, 'small');

  home.add(g);
})();

// ── MASTER BEDROOM ───────────────────────────
(function buildMasterBedroom() {
  const g = new THREE.Group();
  const cx = -9, cz = -17;
  const W = 11, D = 10;

  g.add(box(W, 0.16, D, M.tatami, cx, 0.08, cz));
  g.add(box(W, 0.16, D, M.ceil, cx, ROOM_H + 0.08, cz));

  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz - D / 2));
  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz + D / 2));
  g.add(box(0.12, ROOM_H, D, M.wall, cx - W / 2, ROOM_H / 2, cz));
  g.add(box(0.12, ROOM_H, D, M.wall, cx + W / 2, ROOM_H / 2, cz));

  // Large window — left wall
  g.add(box(0.1, ROOM_H - 0.6, 4.0, M.walnut, cx - W / 2 + 0.05, (ROOM_H - 0.6) / 2 + 0.3, cz + 0.5));
  g.add(box(0.06, ROOM_H - 0.65, 3.9, M.glass, cx - W / 2 + 0.07, (ROOM_H - 0.6) / 2 + 0.3, cz + 0.5));

  // Shoji screen room divider
  const shojiGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    shojiGroup.add(box(0.04, ROOM_H * 0.85, 0.9, M.walnut, i * 0.95 - 0.95, ROOM_H * 0.42, 0));
    shojiGroup.add(box(0.025, ROOM_H * 0.85, 0.85, M.washi, i * 0.95 - 0.95, ROOM_H * 0.42, 0.02));
    // Grid pattern
    [0.28, 0.56, 0.84, 1.12, 1.4, 1.68, 1.96, 2.24, 2.52].forEach(gh => {
      shojiGroup.add(box(0.02, 0.02, 0.85, M.walnut, i * 0.95 - 0.95, gh - ROOM_H * 0.42 + 0.5, 0));
    });
  }
  shojiGroup.position.set(cx + W / 2 - 1.5, 0, cz - 1);
  g.add(shojiGroup);

  // Platform bed — low Japanese style
  // Platform base
  g.add(box(3.5, 0.2, 2.4, M.walnut, cx - 1, 0.1, cz + 1.8));
  // Mattress
  g.add(box(3.2, 0.35, 2.2, M.bedLinen, cx - 1, 0.37, cz + 1.8));
  // Duvet
  g.add(box(3.1, 0.22, 1.5, M.bedLinen2, cx - 1, 0.64, cz + 2.3));
  // Pillows
  [-0.9, 0.1, 1.1].forEach(px => {
    g.add(box(0.65, 0.2, 0.52, M.bedLinen, cx - 1 + px - 0.45, 0.6, cz + 1.22));
  });
  // Headboard — woven fabric panel in walnut frame
  g.add(box(3.5, 1.2, 0.12, M.walnut, cx - 1, 1.0, cz + 0.7));
  g.add(box(3.3, 1.0, 0.06, M.fabric, cx - 1, 1.05, cz + 0.73));

  // Bedside tables (floating)
  [-2.9, 0.9].forEach(bx => {
    g.add(box(0.5, 0.05, 0.42, M.walnut, cx - 1 + bx, 0.72, cz + 1.7));
    // Tiny wall bracket
    g.add(box(0.04, 0.55, 0.06, M.walnut, cx - 1 + bx, 0.49, cz + 1.73));
    // Lamp
    g.add(cyl(0.03, 0.03, 0.38, 8, M.brass, cx - 1 + bx, 0.92, cz + 1.7));
    g.add(cyl(0.0, 0.18, 0.28, 14, M.washi, cx - 1 + bx, 1.12, cz + 1.7));
    const bl = ptLight(0xFFD060, 1.4, 3.5, cx - 1 + bx, 1.15, cz + 1.7);
    g.add(bl);
  });

  // Wardrobe (sliding doors — walnut veneer)
  g.add(box(3.5, ROOM_H - 0.1, 0.65, M.birch, cx + 2.2, ROOM_H / 2 - 0.05, cz - D / 2 + 0.35));
  // Door channels
  [-0.88, 0.88].forEach(dx => {
    g.add(box(0.03, ROOM_H - 0.15, 0.68, M.walnut, cx + 2.2 + dx, ROOM_H / 2 - 0.05, cz - D / 2 + 0.35));
  });
  g.add(box(0.04, ROOM_H - 0.1, 0.04, M.brass, cx + 2.2, ROOM_H / 2 - 0.05, cz - D / 2 + 0.7));

  // Vanity / dressing area
  g.add(box(1.2, 0.08, 0.55, M.walnut, cx - 4.0, 0.88, cz - D / 2 + 0.35));
  g.add(box(0.04, 0.88, 0.06, M.walnut, cx - 4.0, 0.44, cz - D / 2 + 0.35));
  // Vanity mirror
  g.add(box(0.05, 1.2, 0.9, M.glassOp, cx - 4.0, 1.5, cz - D / 2 + 0.38));
  g.add(box(0.07, 1.28, 1.0, M.walnut, cx - 4.0, 1.5, cz - D / 2 + 0.38));
  // Vanity stool
  g.add(cyl(0.26, 0.26, 0.06, 14, M.cushion, cx - 4.0, 0.5, cz - D / 2 + 1.1));
  g.add(cyl(0.025, 0.025, 0.5, 8, M.walnut, cx - 4.0, 0.25, cz - D / 2 + 1.1));
  g.add(cyl(0.3, 0.3, 0.04, 10, M.walnut, cx - 4.0, 0.04, cz - D / 2 + 1.1));

  // Ceiling linear light
  g.add(box(3.5, 0.06, 0.16, M.birch, cx - 1, ROOM_H + 0.02, cz));
  g.add(box(3.3, 0.04, 0.1, new THREE.MeshStandardMaterial({ color: 0xFFF4E0, emissive: 0xFFF4E0, emissiveIntensity: 0.7, roughness: 1 }), cx - 1, ROOM_H - 0.02, cz));

  // Plant (tall fiddle leaf)
  buildPlant(g, cx - 4.3, 0, cz + 4.3, 'medium');

  home.add(g);
})();

// ── GUEST BEDROOM ────────────────────────────
(function buildGuestBedroom() {
  const g = new THREE.Group();
  const cx = 9, cz = -17;
  const W = 9, D = 10;

  g.add(box(W, 0.16, D, M.tatami, cx, 0.08, cz));
  g.add(box(W, 0.16, D, M.ceil, cx, ROOM_H + 0.08, cz));

  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz - D / 2));
  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz + D / 2));
  g.add(box(0.12, ROOM_H, D, M.wall, cx + W / 2, ROOM_H / 2, cz));

  // Window
  g.add(box(0.1, 2.0, 2.8, M.walnut, cx + W / 2 - 0.05, 2.0, cz));
  g.add(box(0.06, 1.98, 2.7, M.glass, cx + W / 2 - 0.07, 2.0, cz));

  // Bed (queen, elevated slightly more Western)
  g.add(box(2.4, 0.24, 2.0, M.walnut, cx, 0.12, cz + 1.8));
  g.add(box(2.3, 0.38, 1.9, M.bedLinen, cx, 0.44, cz + 1.8));
  g.add(box(2.2, 0.2, 1.3, M.bedLinen2, cx, 0.68, cz + 2.3));
  [-0.55, 0.55].forEach(px => {
    g.add(box(0.6, 0.18, 0.5, M.bedLinen, cx + px, 0.64, cz + 1.22));
  });
  // Headboard
  g.add(box(2.4, 0.95, 0.1, M.walnut, cx, 0.85, cz + 0.85));
  g.add(box(2.2, 0.76, 0.04, M.linen, cx, 0.88, cz + 0.87));

  // Bedside (single, minimal)
  g.add(box(0.5, 0.04, 0.4, M.walnut, cx + 1.4, 0.65, cz + 1.8));
  g.add(box(0.03, 0.6, 0.05, M.walnut, cx + 1.4, 0.38, cz + 1.82));
  g.add(cyl(0.02, 0.02, 0.3, 8, M.brass, cx + 1.4, 0.82, cz + 1.8));
  g.add(cyl(0.0, 0.14, 0.22, 12, M.washi, cx + 1.4, 0.97, cz + 1.8));

  // Writing desk
  g.add(box(1.4, 0.04, 0.7, M.lightOak, cx - 2.6, 0.8, cz - D / 2 + 0.45));
  g.add(box(0.04, 0.8, 0.06, M.walnut, cx - 2.6, 0.4, cz - D / 2 + 0.45));
  // Chair
  g.add(box(0.55, 0.04, 0.52, M.fabric, cx - 2.6, 0.82, cz - D / 2 + 1.3));
  g.add(box(0.55, 0.5, 0.06, M.walnut, cx - 2.6, 1.08, cz - D / 2 + 1.56));
  [[-0.24, 1.06], [0.24, 1.06], [-0.24, 1.54], [0.24, 1.54]].forEach(([lx, lz]) => {
    g.add(box(0.04, 0.82, 0.04, M.walnut, cx - 2.6 + lx, 0.41, cz - D / 2 + lz));
  });

  // Ceiling flush mount
  g.add(cyl(0.0, 0.3, 0.08, 16, M.birch, cx, ROOM_H - 0.04, cz - 1));
  const guestLight = ptLight(0xFFDDA0, 3.0, 7, cx, ROOM_H - 0.3, cz);
  g.add(guestLight);

  buildPlant(g, cx - 3.5, 0, cz + 4.2, 'small');

  home.add(g);
})();

// ── LUXURY BATHROOM ──────────────────────────
(function buildBathroom() {
  const g = new THREE.Group();
  const cx = 0, cz = -19;
  const W = 7, D = 7;

  g.add(box(W, 0.16, D, M.tile, cx, 0.08, cz));
  g.add(box(W, 0.16, D, M.ceil, cx, ROOM_H + 0.08, cz));

  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz - D / 2));
  g.add(box(W, ROOM_H, 0.12, M.wall, cx, ROOM_H / 2, cz + D / 2));
  g.add(box(0.12, ROOM_H, D, M.wall, cx - W / 2, ROOM_H / 2, cz));
  g.add(box(0.12, ROOM_H, D, M.wall, cx + W / 2, ROOM_H / 2, cz));

  // Feature wall — back: dark stone tiles
  g.add(box(W - 0.3, ROOM_H, 0.1, M.marbleDark, cx, ROOM_H / 2, cz - D / 2 + 0.06));

  // Large window (frosted)
  g.add(box(0.08, 1.6, 2.4, M.walnut, cx + W / 2 - 0.04, 2.0, cz));
  g.add(box(0.04, 1.58, 2.35, M.glassOp, cx + W / 2 - 0.06, 2.0, cz));

  // Freestanding soaking tub — pill shape (bathtub)
  const tubGeo = new THREE.CapsuleGeometry ? new THREE.BoxGeometry(1.65, 0.5, 0.75) : new THREE.BoxGeometry(1.65, 0.5, 0.75);
  const tub = box(1.65, 0.5, 0.75, M.marble, cx - 1.3, 0.25, cz - 1.6);
  g.add(tub);
  // Tub interior
  g.add(box(1.5, 0.38, 0.6, M.tile, cx - 1.3, 0.28, cz - 1.6));
  // Tub legs
  [[-0.76, -0.3], [0.76, -0.3], [-0.76, 0.3], [0.76, 0.3]].forEach(([lx, lz]) => {
    g.add(cyl(0.04, 0.04, 0.16, 8, M.chrome, cx - 1.3 + lx, 0.08, cz - 1.6 + lz));
  });
  // Tub faucet
  g.add(cyl(0.025, 0.025, 0.32, 8, M.chrome, cx - 1.3, 0.5, cz - 1.22));
  g.add(cyl(0.02, 0.02, 0.22, 8, M.chrome, cx - 1.3, 0.62, cz - 1.22));
  // Floor spout
  g.add(cyl(0.03, 0.03, 0.65, 8, M.chrome, cx - 0.6, 0.34, cz - 1.6));
  g.add(cyl(0.025, 0.025, 0.12, 8, M.chrome, cx - 0.6, 0.66, cz - 1.6));

  // Double vanity
  g.add(box(2.4, 0.82, 0.5, M.walnut, cx + 1.0, 0.41, cz - D / 2 + 0.28));
  g.add(box(2.5, 0.04, 0.55, M.marble, cx + 1.0, 0.84, cz - D / 2 + 0.28));
  // Sinks (two integrated)
  [-0.55, 0.55].forEach(sx => {
    g.add(box(0.58, 0.08, 0.38, M.marble, cx + 1.0 + sx, 0.88, cz - D / 2 + 0.28));
    g.add(cyl(0.025, 0.025, 0.24, 8, M.chrome, cx + 1.0 + sx, 0.97, cz - D / 2 + 0.18));
    g.add(cyl(0.015, 0.02, 0.04, 8, M.chrome, cx + 1.0 + sx, 1.06, cz - D / 2 + 0.18));
  });
  // Vanity mirror (wall mounted, full width)
  g.add(box(0.04, 1.4, 2.6, M.glassOp, cx + 1.0, 1.7, cz - D / 2 + 0.32));
  g.add(box(0.06, 1.48, 2.7, M.walnut, cx + 1.0, 1.7, cz - D / 2 + 0.32));
  // Mirror strip light
  g.add(box(0.04, 0.06, 2.65, new THREE.MeshStandardMaterial({ color: 0xFFF8E8, emissive: 0xFFF8E8, emissiveIntensity: 0.9, roughness: 1 }), cx + 1.0, 2.46, cz - D / 2 + 0.34));

  // Vanity legs (minimal gold)
  [[-1.12, -0.22], [1.12, -0.22], [-1.12, 0.22], [1.12, 0.22]].forEach(([lx, lz]) => {
    g.add(box(0.04, 0.14, 0.04, M.brass, cx + 1.0 + lx, 0.07, cz - D / 2 + 0.28 + lz));
  });

  // Walk-in shower (glass partition)
  g.add(box(1.6, ROOM_H * 0.85, 0.04, M.glass, cx - 2.0, ROOM_H * 0.42, cz + 0.5));
  g.add(box(0.04, ROOM_H * 0.85, 1.8, M.glass, cx - 2.8, ROOM_H * 0.42, cz + 0.4));
  // Shower head
  g.add(cyl(0.03, 0.03, 0.9, 8, M.chrome, cx - 2.8 + 0.08, 2.8, cz + 1.2));
  g.add(cyl(0.0, 0.14, 0.04, 12, M.chrome, cx - 2.0 + 0.08, 2.85, cz + 1.2));
  // Rain head pipe
  g.add(cyl(0.12, 0.12, 0.02, 12, M.chrome, cx - 2.4, 3.0, cz + 1.2));
  g.add(cyl(0.025, 0.025, 0.15, 6, M.chrome, cx - 2.4, 2.94, cz + 1.2));

  // Towel rail
  g.add(cyl(0.02, 0.02, 0.95, 8, M.chrome, cx + 2.8, 1.6, cz + 2.5));
  g.add(cyl(0.015, 0.015, 0.95, 8, M.chrome, cx + 2.8, 1.35, cz + 2.5));
  // Towel
  g.add(box(0.06, 0.28, 0.85, M.linen, cx + 2.75, 1.55, cz + 2.5));

  // Ceiling light (soft strip)
  g.add(box(4.5, 0.04, 0.14, new THREE.MeshStandardMaterial({ color: 0xFFF4E8, emissive: 0xFFF4E8, emissiveIntensity: 0.7, roughness: 1 }), cx, ROOM_H - 0.05, cz));
  const bathLight = ptLight(0xFFF0DC, 3.5, 8, cx, ROOM_H - 0.4, cz);
  g.add(bathLight);
  // Mirror light boost
  const mirrorLight = ptLight(0xFFF8E0, 1.5, 3.5, cx + 1.0, 2.5, cz - D / 2 + 0.8);
  g.add(mirrorLight);

  home.add(g);
})();

// ── PLANT BUILDER ────────────────────────────
function buildPlant(group, x, y, z, size) {
  const sizes = {
    tiny:   { pot: [0.08, 0.08, 8], height: 0.15, leafR: 0.12, leaves: 4 },
    small:  { pot: [0.14, 0.12, 10], height: 0.28, leafR: 0.22, leaves: 5 },
    medium: { pot: [0.2, 0.18, 12], height: 0.55, leafR: 0.36, leaves: 7 },
    tall:   { pot: [0.22, 0.2, 12], height: 1.0, leafR: 0.5, leaves: 9 },
  };
  const s = sizes[size] || sizes.small;
  const g = new THREE.Group();
  // Pot
  g.add(cyl(s.pot[0], s.pot[1], s.pot[0] * 1.2, s.pot[2], M.potCeramic, 0, s.pot[0] * 0.6, 0));
  // Soil
  g.add(cyl(s.pot[0] * 0.9, s.pot[0] * 0.9, 0.03, 10, M.soil, 0, s.pot[0] * 1.2, 0));
  // Stem
  g.add(cyl(0.015, 0.015, s.height, 6, M.walnut, 0, s.pot[0] * 1.2 + s.height / 2, 0));
  // Leaves (spheres arranged around top)
  for (let i = 0; i < s.leaves; i++) {
    const angle = (i / s.leaves) * Math.PI * 2;
    const lx = Math.cos(angle) * s.leafR * 0.55;
    const lz = Math.sin(angle) * s.leafR * 0.55;
    const ly = s.pot[0] * 1.2 + s.height + s.leafR * (0.4 + Math.random() * 0.4);
    const mat = i % 2 === 0 ? M.leaf : M.leafLight;
    g.add(sph(s.leafR * (0.7 + Math.random() * 0.5), 7, 7, mat, lx, ly, lz));
  }
  g.position.set(x, y, z);
  group.add(g);
}

// ── GLOBAL LIGHTING ──────────────────────────
// Warm ambient
const ambient = new THREE.AmbientLight(0xFFEED8, 0.55);
scene.add(ambient);

// Key directional (sun — afternoon angle)
const sun = new THREE.DirectionalLight(0xFFF5E0, 1.6);
sun.position.set(20, 30, 15);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 100;
sun.shadow.camera.left = -35;
sun.shadow.camera.right = 35;
sun.shadow.camera.top = 35;
sun.shadow.camera.bottom = -35;
sun.shadow.bias = -0.0008;
scene.add(sun);

// Fill light (opposite side, cool)
const fill = new THREE.DirectionalLight(0xD8E8FF, 0.35);
fill.position.set(-15, 10, -10);
scene.add(fill);

// Hemisphere sky/ground
const hemi = new THREE.HemisphereLight(0xFFEED0, 0x2A2018, 0.45);
scene.add(hemi);

// Per-room accent lights
scene.add(ptLight(0xFFD898, 2.8, 10, -8, 2.8, -2));    // living
scene.add(ptLight(0xFFE0A0, 3.2, 10, 8, 2.8, -2));     // kitchen
scene.add(ptLight(0xFFD878, 2.0, 8, 0, 2.8, 6));       // foyer
scene.add(ptLight(0xFFD888, 3.0, 10, -9, 2.6, -17));   // master
scene.add(ptLight(0xFFDDA0, 2.5, 8, 9, 2.6, -17));     // guest
scene.add(ptLight(0xFFF0DC, 2.5, 8, 0, 2.6, -19));     // bath

// ── TOUR HOTSPOTS ────────────────────────────
const ROOMS = {
  foyer:    { label: 'Entry Foyer',        sub: 'Arrival & Welcome',           pos: [6, 6, 12],     target: [0, 1.5, 6] },
  living:   { label: 'Living Room',        sub: 'Relaxation & Gathering',      pos: [-2, 5, 6],     target: [-8, 1.5, -2] },
  kitchen:  { label: 'Kitchen',            sub: 'Culinary Studio',             pos: [16, 5.5, 4],   target: [8, 1.5, -2] },
  dining:   { label: 'Dining Area',        sub: 'Ceremonial Dining',           pos: [8, 6, -4],     target: [0, 1.5, -10] },
  master:   { label: 'Master Bedroom',     sub: 'Sanctuary of Rest',           pos: [-3, 5.5, -10], target: [-9, 1.5, -17] },
  guest:    { label: 'Guest Bedroom',      sub: 'Refined Hospitality',         pos: [17, 5, -10],   target: [9, 1.5, -17] },
  bathroom: { label: 'Luxury Bathroom',    sub: 'Spa & Ritual',                pos: [8, 5, -13],    target: [0, 1.5, -19] },
};

// ── CAMERA ANIMATION ─────────────────────────
let camAnim = null;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function flyTo(room) {
  const preset = ROOMS[room];
  if (!preset) return;

  const startPos    = camera.position.clone();
  const startTarget = controls.target.clone();
  const endPos      = new THREE.Vector3(...preset.pos);
  const endTarget   = new THREE.Vector3(...preset.target);

  controls.autoRotate = false;

  let t = 0;
  const FRAMES = 110;

  if (camAnim) cancelAnimationFrame(camAnim);
  function step() {
    t++;
    const ease = easeInOut(Math.min(t / FRAMES, 1));
    camera.position.lerpVectors(startPos, endPos, ease);
    controls.target.lerpVectors(startTarget, endTarget, ease);
    controls.update();
    if (t < FRAMES) camAnim = requestAnimationFrame(step);
    else {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.18;
    }
  }
  step();

  // Update room label
  const rl = document.getElementById('room-label');
  if (rl) {
    rl.style.opacity = '0';
    setTimeout(() => {
      rl.querySelector('.rl-name').textContent = preset.label;
      rl.querySelector('.rl-sub').textContent  = preset.sub;
      rl.style.opacity = '1';
    }, 350);
  }

  // Update active button
  document.querySelectorAll('.tour-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.tour-btn[data-room="${room}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

// ── TOUR BUTTON EVENTS ───────────────────────
document.querySelectorAll('.tour-btn').forEach(btn => {
  btn.addEventListener('click', () => flyTo(btn.dataset.room));
});

// ── AUTO TOUR ────────────────────────────────
const tourOrder = ['foyer', 'living', 'kitchen', 'dining', 'master', 'guest', 'bathroom'];
let tourIdx = 0;
let autoTourActive = true;
let autoTourTimer = null;

function scheduleNext() {
  autoTourTimer = setTimeout(() => {
    if (!autoTourActive) return;
    tourIdx = (tourIdx + 1) % tourOrder.length;
    flyTo(tourOrder[tourIdx]);
    scheduleNext();
  }, 7000);
}

// Start auto tour after initial delay
setTimeout(() => {
  flyTo(tourOrder[0]);
  scheduleNext();
}, 2200);

// Pause auto tour on manual orbit interaction
renderer.domElement.addEventListener('pointerdown', () => {
  autoTourActive = false;
  clearTimeout(autoTourTimer);
  controls.autoRotate = false;
});

// Resume on tour button click
document.querySelectorAll('.tour-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    autoTourActive = false;
    clearTimeout(autoTourTimer);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.18;
  });
});

// ── RENDER LOOP ──────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Subtle lamp flicker
  scene.children.forEach(obj => {
    if (obj.isPointLight) {
      obj.userData._base = obj.userData._base || obj.intensity;
      obj.intensity = obj.userData._base * (0.97 + Math.sin(t * 2.3 + obj.position.x) * 0.015);
    }
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

// ── RESIZE ───────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── NAVBAR ───────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── MOBILE MENU ──────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── TESTIMONIAL SLIDER ───────────────────────
const testimonials = document.querySelectorAll('.testimonial');
const tdots        = document.querySelectorAll('.tdot');
let currentT = 0;
function showT(idx) {
  testimonials.forEach(t => t.classList.remove('active'));
  tdots.forEach(d => d.classList.remove('active'));
  testimonials[idx]?.classList.add('active');
  tdots[idx]?.classList.add('active');
  currentT = idx;
}
tdots.forEach((d, i) => d.addEventListener('click', () => showT(i)));
setInterval(() => showT((currentT + 1) % testimonials.length), 5500);

// ── CONTACT FORM ─────────────────────────────
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('contactForm').classList.add('hidden');
  document.getElementById('form-success').classList.remove('hidden');
});

// ── SCROLL REVEAL ────────────────────────────
document.querySelectorAll('.about-grid, .service-card, .portfolio-item, #testimonials, .contact-grid')
  .forEach(el => el.classList.add('reveal'));

new IntersectionObserver((entries, obs) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 }).observe || null;

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── AUTO-ROTATE PAUSE ON CANVAS HOVER ────────
document.getElementById('hero-canvas-wrapper')?.addEventListener('mouseenter', () => {
  if (autoTourActive) return;
  controls.autoRotate = false;
});
document.getElementById('hero-canvas-wrapper')?.addEventListener('mouseleave', () => {
  if (!autoTourActive) controls.autoRotate = true;
});