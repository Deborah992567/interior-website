/**
 * Verve & Verses — Three.js 3D Villa Scene
 * Luxury modern villa with PBR-like materials, landscaping, lighting & shadows
 */
(function () {
  'use strict';

  let renderer, scene, camera, controls, animFrameId;
  let clock, mixer;
  const canvas = document.getElementById('threeCanvas');
  if (!canvas) return;

  // ── Init ──────────────────────────────────────────
  function init() {
    clock = new THREE.Clock();

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.physicallyCorrectLights = true;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7A9BAD);
    scene.fog = new THREE.FogExp2(0xCDB88E, 0.018);

    // Camera
    camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 300);
    camera.position.set(18, 10, 22);

    // Controls
    controls = new THREE.OrbitControls(camera, canvas);
    controls.target.set(0, 3, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 10;
    controls.maxDistance = 55;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.update();

    // Build world
    buildLights();
    buildGround();
    buildVilla();
    buildLandscaping();
    buildDriveway();
    buildSky();

    window.addEventListener('resize', onResize);
    canvas.addEventListener('pointerdown', () => { controls.autoRotate = false; });

    animate();
  }

  // ── Lights ────────────────────────────────────────
  function buildLights() {
    // Ambient warm fill
    const ambient = new THREE.AmbientLight(0xFFE8C8, 0.6);
    scene.add(ambient);

    // Main sun
    const sun = new THREE.DirectionalLight(0xFFF5E0, 2.8);
    sun.position.set(30, 40, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 120;
    sun.shadow.camera.left = -30;
    sun.shadow.camera.right = 30;
    sun.shadow.camera.top = 30;
    sun.shadow.camera.bottom = -30;
    sun.shadow.bias = -0.001;
    scene.add(sun);

    // Sky fill (blue-ish)
    const skyLight = new THREE.HemisphereLight(0x8FBCD4, 0xC9B49A, 0.8);
    scene.add(skyLight);

    // Warm accent from front
    const fillLight = new THREE.DirectionalLight(0xFFD4A0, 0.6);
    fillLight.position.set(-15, 8, 15);
    scene.add(fillLight);

    // Point lights inside (warm glow through glass)
    const interiorLights = [
      { pos: [2, 3, 2], color: 0xFFCC88, intensity: 1.5 },
      { pos: [-3, 3, 2], color: 0xFFCC88, intensity: 1.2 },
      { pos: [0, 6, -2], color: 0xFFD4A0, intensity: 1.0 },
    ];
    interiorLights.forEach(l => {
      const pt = new THREE.PointLight(l.color, l.intensity, 12);
      pt.position.set(...l.pos);
      scene.add(pt);
    });
  }

  // ── Ground ────────────────────────────────────────
  function buildGround() {
    // Grass
    const grassGeo = new THREE.PlaneGeometry(120, 120);
    const grassMat = new THREE.MeshLambertMaterial({ color: 0x6B8C5A });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    scene.add(grass);

    // Lawn around house (lighter, trimmed)
    const lawnGeo = new THREE.PlaneGeometry(30, 28);
    const lawnMat = new THREE.MeshLambertMaterial({ color: 0x7BA05B });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(0, 0.01, 0);
    lawn.receiveShadow = true;
    scene.add(lawn);
  }

  // ── Driveway ──────────────────────────────────────
  function buildDriveway() {
    const mat = new THREE.MeshLambertMaterial({ color: 0xB8A898 });

    // Main driveway path
    const driveGeo = new THREE.BoxGeometry(6, 0.05, 22);
    const drive = new THREE.Mesh(driveGeo, mat);
    drive.position.set(8, 0.02, 8);
    drive.receiveShadow = true;
    scene.add(drive);

    // Forecourt
    const courtGeo = new THREE.BoxGeometry(14, 0.05, 6);
    const court = new THREE.Mesh(courtGeo, mat);
    court.position.set(3.5, 0.02, -1.5);
    court.receiveShadow = true;
    scene.add(court);

    // Edging stones
    const edgeMat = new THREE.MeshLambertMaterial({ color: 0xCCC0B0 });
    for (let i = -10; i < 10; i += 1.2) {
      const stone = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.5), edgeMat);
      stone.position.set(5.1, 0.04, 8 + i);
      stone.receiveShadow = true;
      scene.add(stone);
      const stone2 = stone.clone();
      stone2.position.x = 10.9;
      scene.add(stone2);
    }
  }

  // ── Villa ─────────────────────────────────────────
  function buildVilla() {
    // Material palette
    const wallMat = new THREE.MeshPhongMaterial({ color: 0xF2E8D8, specular: 0x222222, shininess: 15 });
    const wall2Mat = new THREE.MeshPhongMaterial({ color: 0xE0D4C0, specular: 0x1A1A1A, shininess: 10 });
    const concreteMat = new THREE.MeshPhongMaterial({ color: 0xD4C8B0, specular: 0x111111, shininess: 5 });
    const woodMat = new THREE.MeshPhongMaterial({ color: 0x8B6343, specular: 0x333333, shininess: 30 });
    const darkWoodMat = new THREE.MeshPhongMaterial({ color: 0x5C3D20, specular: 0x222222, shininess: 20 });
    const glassMat = new THREE.MeshPhongMaterial({
      color: 0x88B8CC,
      specular: 0xFFFFFF,
      shininess: 200,
      transparent: true,
      opacity: 0.35,
      reflectivity: 0.9,
    });
    const glassFrameMat = new THREE.MeshPhongMaterial({ color: 0xC8B898, specular: 0x333333, shininess: 60 });
    const roofMat = new THREE.MeshPhongMaterial({ color: 0xC8B898, specular: 0x111111, shininess: 10 });
    const stoneMat = new THREE.MeshPhongMaterial({ color: 0xBAAA95, specular: 0x111111, shininess: 8 });

    // ── MAIN BODY (two-storey) ──
    // Ground floor
    const body = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 10), wallMat);
    body.position.set(-1, 2.25, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    scene.add(body);

    // Upper floor (slightly recessed back)
    const upper = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 9), wall2Mat);
    upper.position.set(-2, 6.5, -0.5);
    upper.castShadow = true;
    upper.receiveShadow = true;
    scene.add(upper);

    // Right wing (single storey garage/utility)
    const wing = new THREE.Mesh(new THREE.BoxGeometry(6, 3.5, 8), concreteMat);
    wing.position.set(9, 1.75, 1);
    wing.castShadow = true;
    wing.receiveShadow = true;
    scene.add(wing);

    // ── FLAT ROOFS ──
    // Main roof
    const roof1 = new THREE.Mesh(new THREE.BoxGeometry(18.6, 0.35, 10.6), roofMat);
    roof1.position.set(-1, 4.67, 0);
    roof1.castShadow = true;
    scene.add(roof1);

    // Upper roof
    const roof2 = new THREE.Mesh(new THREE.BoxGeometry(14.6, 0.35, 9.6), roofMat);
    roof2.position.set(-2, 8.7, -0.5);
    roof2.castShadow = true;
    scene.add(roof2);

    // Wing roof
    const roofW = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.35, 8.6), roofMat);
    roofW.position.set(9, 3.67, 1);
    roofW.castShadow = true;
    scene.add(roofW);

    // Roof overhang canopy (front)
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 2.5), concreteMat);
    canopy.position.set(-1, 4.4, 5.8);
    canopy.castShadow = true;
    scene.add(canopy);

    // ── GROUND FLOOR GLASS WALLS (front) ──
    // Large panoramic window left
    makeWindow(scene, glassMat, glassFrameMat, -5.5, 2.5, 5.05, 6, 3.5, 0.12);
    // Central glass door area
    makeWindow(scene, glassMat, glassFrameMat, 0, 2.2, 5.05, 3.5, 3.8, 0.1);
    // Right window
    makeWindow(scene, glassMat, glassFrameMat, 4.5, 2, 5.05, 2.5, 2.5, 0.12);

    // ── UPPER FLOOR WINDOWS (front) ──
    makeWindow(scene, glassMat, glassFrameMat, -5, 6.5, 4.55, 5, 2.4, 0.1);
    makeWindow(scene, glassMat, glassFrameMat, 0.5, 6.5, 4.55, 3, 2.2, 0.1);
    makeWindow(scene, glassMat, glassFrameMat, 4, 6.5, 4.55, 2, 2, 0.1);

    // ── SIDE WINDOWS (right side) ──
    makeWindow(scene, glassMat, glassFrameMat, 9.05, 5.5, 1, 1.5, 1.8, 0.1, true);
    makeWindow(scene, glassMat, glassFrameMat, 9.05, 5.5, -1.5, 1.5, 1.8, 0.1, true);

    // ── GARAGE DOOR ──
    const garageMat = new THREE.MeshPhongMaterial({ color: 0x8B6B4A, specular: 0x333333, shininess: 25 });
    const garage = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.4, 0.08), garageMat);
    garage.position.set(8.5, 1.2, 5.01);
    scene.add(garage);
    // Garage door panels (horizontal lines)
    for (let i = 0; i < 4; i++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.04, 0.05), darkWoodMat);
      panel.position.set(8.5, 0.3 + i * 0.6, 5.06);
      scene.add(panel);
    }

    // ── ENTRANCE DOOR ──
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 0.12), darkWoodMat);
    doorFrame.position.set(0, 1.6, 5.04);
    scene.add(doorFrame);
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.35, 2.9, 0.06), woodMat);
    door.position.set(0, 1.5, 5.09);
    scene.add(door);

    // ── FOUNDATION ──
    const foundation = new THREE.Mesh(new THREE.BoxGeometry(19, 0.5, 11), stoneMat);
    foundation.position.set(-1, -0.25, 0);
    foundation.receiveShadow = true;
    scene.add(foundation);
    const foundW = new THREE.Mesh(new THREE.BoxGeometry(7, 0.5, 9), stoneMat);
    foundW.position.set(9, -0.25, 1);
    foundW.receiveShadow = true;
    scene.add(foundW);

    // ── STEPS ──
    for (let s = 0; s < 3; s++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(4, 0.18, 0.5), stoneMat);
      step.position.set(0, s * 0.18, 5.55 + s * 0.3);
      step.receiveShadow = true;
      scene.add(step);
    }

    // ── PILLARS (entrance canopy) ──
    const pillarMat = new THREE.MeshPhongMaterial({ color: 0xE8DCCC, specular: 0x222222, shininess: 20 });
    [-3, 3].forEach(x => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 4.5, 8), pillarMat);
      pillar.position.set(x, 2.25, 5.5);
      pillar.castShadow = true;
      scene.add(pillar);
    });

    // ── BALCONY (upper floor) ──
    const balconyFloor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 1.5), concreteMat);
    balconyFloor.position.set(-2, 4.55, 5.25);
    balconyFloor.castShadow = true;
    balconyFloor.receiveShadow = true;
    scene.add(balconyFloor);

    // Balcony railing (glass panels)
    const railGlass = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.9, 0.04), glassMat);
    railGlass.position.set(-2, 5.1, 6.0);
    scene.add(railGlass);

    // Railing posts
    const railPostMat = new THREE.MeshPhongMaterial({ color: 0xC0A882, specular: 0x333333, shininess: 60 });
    for (let i = -4.5; i <= 4.5; i += 1.5) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.95, 0.05), railPostMat);
      post.position.set(i - 2, 5.1, 6.0);
      scene.add(post);
    }

    // ── CLADDING DETAIL (dark vertical slats on part of facade) ──
    const slatMat = new THREE.MeshPhongMaterial({ color: 0x4A3020, specular: 0x111111, shininess: 15 });
    for (let i = 0; i < 8; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.5, 0.08), slatMat);
      slat.position.set(-7 + i * 0.35, 2.25, 5.02);
      slat.castShadow = true;
      scene.add(slat);
    }

    // ── CHIMNEY ──
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(1, 3, 0.8), stoneMat);
    chimney.position.set(-7, 9, -3);
    chimney.castShadow = true;
    scene.add(chimney);
    const chimneyTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 1), darkWoodMat);
    chimneyTop.position.set(-7, 10.6, -3);
    scene.add(chimneyTop);
  }

  function makeWindow(scene, glassMat, frameMat, x, y, z, w, h, d, rotateY = false) {
    // Frame
    const frameGroup = new THREE.Group();

    const topBar = new THREE.Mesh(new THREE.BoxGeometry(rotateY ? d * 2 : w + 0.12, 0.08, rotateY ? w + 0.12 : d * 2), frameMat);
    topBar.position.y = h / 2 + 0.04;
    frameGroup.add(topBar);

    const btmBar = topBar.clone();
    btmBar.position.y = -h / 2 - 0.04;
    frameGroup.add(btmBar);

    const leftBar = new THREE.Mesh(new THREE.BoxGeometry(rotateY ? d * 2 : 0.08, h + 0.12, rotateY ? 0.08 : d * 2), frameMat);
    leftBar.position.x = rotateY ? 0 : -w / 2 - 0.04;
    leftBar.position.z = rotateY ? -w / 2 - 0.04 : 0;
    frameGroup.add(leftBar);

    const rightBar = leftBar.clone();
    rightBar.position.x = rotateY ? 0 : w / 2 + 0.04;
    rightBar.position.z = rotateY ? w / 2 + 0.04 : 0;
    frameGroup.add(rightBar);

    // Glass pane
    const paneGeo = rotateY
      ? new THREE.BoxGeometry(d, h, w)
      : new THREE.BoxGeometry(w, h, d);
    const pane = new THREE.Mesh(paneGeo, glassMat);
    frameGroup.add(pane);

    frameGroup.position.set(x, y, z);
    scene.add(frameGroup);
  }

  // ── Landscaping ───────────────────────────────────
  function buildLandscaping() {
    // Trees
    const treePositions = [
      [-12, 0, -6], [-14, 0, 4], [-13, 0, 12],
      [14, 0, -8], [15, 0, 6], [12, 0, 14],
      [-10, 0, -12], [5, 0, -10],
    ];
    treePositions.forEach(([x, y, z]) => {
      addTree(x, z);
    });

    // Hedges along driveway
    const hedgeMat = new THREE.MeshLambertMaterial({ color: 0x3A6B35 });
    for (let i = -3; i <= 3; i++) {
      const h = 0.8 + Math.random() * 0.3;
      const hedge = new THREE.Mesh(new THREE.BoxGeometry(0.6, h, 0.6), hedgeMat);
      hedge.position.set(4.6, h / 2, 8 + i * 1.5);
      hedge.castShadow = true;
      scene.add(hedge);
      const hedge2 = hedge.clone();
      hedge2.position.x = 11.4;
      scene.add(hedge2);
    }

    // Ornamental shrubs near entrance
    const shrubMat = new THREE.MeshLambertMaterial({ color: 0x4A7A40 });
    [[-2.5, 5.8], [2.5, 5.8], [-5, 5.5], [5, 5.5]].forEach(([sx, sz]) => {
      const r = 0.5 + Math.random() * 0.3;
      const shrub = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 6), shrubMat);
      shrub.position.set(sx, r * 0.6, sz);
      shrub.castShadow = true;
      scene.add(shrub);
    });

    // Ornamental rocks
    const rockMat = new THREE.MeshLambertMaterial({ color: 0xA09080 });
    [[-9, 4], [-10, -4], [13, -4]].forEach(([rx, rz]) => {
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.4 + Math.random() * 0.3, 0),
        rockMat
      );
      rock.position.set(rx, 0.2, rz);
      rock.rotation.y = Math.random() * Math.PI;
      rock.castShadow = true;
      rock.receiveShadow = true;
      scene.add(rock);
    });

    // Flower beds (coloured patches)
    const flowerColors = [0xE8A0A0, 0xF5D080, 0xC8A0D0];
    [[- 6, 5.5], [6, 5.5]].forEach(([fx, fz], idx) => {
      const bed = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 1),
        new THREE.MeshLambertMaterial({ color: flowerColors[idx % 3] })
      );
      bed.rotation.x = -Math.PI / 2;
      bed.position.set(fx, 0.02, fz);
      scene.add(bed);
    });

    // Pool
    buildPool();
  }

  function addTree(x, z) {
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x6B4A28 });
    const foliageMat = new THREE.MeshLambertMaterial({ color: 0x2E5E28 });
    const h = 4 + Math.random() * 3;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, h, 6), trunkMat);
    trunk.position.set(x, h / 2, z);
    trunk.castShadow = true;
    scene.add(trunk);

    // Layered foliage
    for (let i = 0; i < 3; i++) {
      const r = 1.2 - i * 0.2;
      const yOff = h * 0.55 + i * 0.8;
      const foliage = new THREE.Mesh(new THREE.ConeGeometry(r + 0.2, 1.5, 8), foliageMat);
      foliage.position.set(x, yOff, z);
      foliage.castShadow = true;
      scene.add(foliage);
    }
  }

  function buildPool() {
    // Pool basin
    const poolMat = new THREE.MeshPhongMaterial({ color: 0x4A8EB5, specular: 0xFFFFFF, shininess: 80 });
    const poolFloorMat = new THREE.MeshLambertMaterial({ color: 0x5FA0C5 });
    const poolEdgeMat = new THREE.MeshLambertMaterial({ color: 0xE0D4C0 });

    // Pool water surface
    const water = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), poolMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(-8, 0.02, 5);
    scene.add(water);

    // Pool surround
    const surround = [
      { geo: new THREE.BoxGeometry(8.6, 0.3, 0.3), pos: [-8, 0.15, 7.15] },
      { geo: new THREE.BoxGeometry(8.6, 0.3, 0.3), pos: [-8, 0.15, 2.85] },
      { geo: new THREE.BoxGeometry(0.3, 0.3, 4.3), pos: [-12.15, 0.15, 5] },
      { geo: new THREE.BoxGeometry(0.3, 0.3, 4.3), pos: [-3.85, 0.15, 5] },
    ];
    surround.forEach(s => {
      const m = new THREE.Mesh(s.geo, poolEdgeMat);
      m.position.set(...s.pos);
      m.castShadow = true;
      scene.add(m);
    });

    // Pool deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(11, 0.12, 7), poolEdgeMat);
    deck.position.set(-8, -0.06, 5);
    deck.receiveShadow = true;
    scene.add(deck);

    // Sun loungers
    const loungerMat = new THREE.MeshPhongMaterial({ color: 0xF5EFD8, specular: 0x222222, shininess: 20 });
    [[-6, 8.2], [-10, 8.2]].forEach(([lx, lz]) => {
      const lounger = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 2), loungerMat);
      lounger.position.set(lx, 0.2, lz);
      scene.add(lounger);
      // Back rest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.08), loungerMat);
      back.position.set(lx, 0.42, lz - 0.96);
      back.rotation.x = 0.35;
      scene.add(back);
    });
  }

  // ── Sky gradient ──────────────────────────────────
  function buildSky() {
    // Simple sky dome
    const skyGeo = new THREE.SphereGeometry(150, 24, 12);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(0x4A7FA5) },
        bottomColor: { value: new THREE.Color(0xC9B49A) },
        offset: { value: 20 },
        exponent: { value: 0.5 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      fog: false,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // Clouds (simple flat ellipsoids)
    const cloudMat = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.88 });
    const cloudData = [
      { pos: [-20, 40, -60], scale: [8, 2, 5] },
      { pos: [15, 45, -70], scale: [10, 2.5, 6] },
      { pos: [40, 38, -50], scale: [7, 2, 4.5] },
      { pos: [-50, 42, -40], scale: [9, 2, 5.5] },
    ];
    cloudData.forEach(c => {
      const cloud = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), cloudMat);
      cloud.scale.set(...c.scale);
      cloud.position.set(...c.pos);
      scene.add(cloud);
    });
  }

  // ── Animate ───────────────────────────────────────
  function animate() {
    animFrameId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    controls.update();
    renderer.render(scene, camera);
  }

  // ── Resize ────────────────────────────────────────
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  // Wait for DOM + Three.js ready
  window.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();
}());