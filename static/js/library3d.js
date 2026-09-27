function initLibraryRoom(container) {
  const WALNUT = 0x5b3a29, WALNUT_DARK = 0x3d271b, CREAM = 0xefe7d8, SAGE = 0x6f8a5e, BRASS = 0xb48a4c;
  const width = container.clientWidth, height = container.clientHeight;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1c1712);
  scene.fog = new THREE.Fog(0x1c1712, 14, 30);
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 3.4, 9);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2.2, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 4;
  controls.maxDistance = 14;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.update();

  scene.add(new THREE.AmbientLight(0xffe9c7, 0.35));
  const windowLight = new THREE.DirectionalLight(0xfff1d6, 0.6);
  windowLight.position.set(-6, 6, 4); windowLight.castShadow = true;
  windowLight.shadow.mapSize.set(1024, 1024); scene.add(windowLight);
  const lampLight = new THREE.PointLight(0xffb877, 1.1, 9, 2);
  lampLight.position.set(2.6, 2.1, 2.6); lampLight.castShadow = true; scene.add(lampLight);
  const fillLight = new THREE.PointLight(0xffe4b0, 0.5, 12);
  fillLight.position.set(0, 4.5, 2); scene.add(fillLight);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshStandardMaterial({ color: 0x6b4b34, roughness: 0.75 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const wallMat = new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.95 });
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), wallMat);
  backWall.position.set(0, 4, -4); backWall.receiveShadow = true; scene.add(backWall);
  const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), wallMat);
  sideWall.position.set(-7, 4, 0); sideWall.rotation.y = Math.PI / 2; sideWall.receiveShadow = true; scene.add(sideWall);
  const rug = new THREE.Mesh(new THREE.CircleGeometry(2.6, 32), new THREE.MeshStandardMaterial({ color: 0x7c3f3a, roughness: 1 }));
  rug.rotation.x = -Math.PI / 2; rug.position.set(1.2, 0.01, 2.6); rug.receiveShadow = true; scene.add(rug);

  const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 0.15), new THREE.MeshStandardMaterial({ color: WALNUT_DARK }));
  windowFrame.position.set(-6.9, 4.2, -1.5); windowFrame.rotation.y = Math.PI / 2; scene.add(windowFrame);
  const windowGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.9), new THREE.MeshBasicMaterial({ color: 0xfff3d6, transparent: true, opacity: 0.55 }));
  windowGlow.position.set(-6.85, 4.2, -1.5); windowGlow.rotation.y = Math.PI / 2; scene.add(windowGlow);

  const SHELF_COLS = 3, SHELF_ROWS = 3, BAY_WIDTH = 2.6, BAY_HEIGHT = 2.15, SHELF_DEPTH = 0.55;
  const totalWidth = SHELF_COLS * BAY_WIDTH, totalHeight = SHELF_ROWS * BAY_HEIGHT;
  const shelfGroup = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: WALNUT, roughness: 0.6 });
  const shelfMat = new THREE.MeshStandardMaterial({ color: WALNUT_DARK, roughness: 0.55 });
  const outer = new THREE.Mesh(new THREE.BoxGeometry(totalWidth + 0.3, totalHeight + 0.3, SHELF_DEPTH + 0.1), frameMat);
  outer.position.set(0, totalHeight / 2 + 0.15, -3.6); outer.castShadow = true; outer.receiveShadow = true; shelfGroup.add(outer);
  for (let row = 0; row <= SHELF_ROWS; row++) {
    const board = new THREE.Mesh(new THREE.BoxGeometry(totalWidth, 0.08, SHELF_DEPTH), shelfMat);
    board.position.set(0, row * BAY_HEIGHT + 0.2, -3.58); board.castShadow = true; board.receiveShadow = true; shelfGroup.add(board);
  }
  for (let col = 0; col <= SHELF_COLS; col++) {
    const divider = new THREE.Mesh(new THREE.BoxGeometry(0.07, totalHeight, SHELF_DEPTH), shelfMat);
    divider.position.set(-totalWidth / 2 + col * BAY_WIDTH, totalHeight / 2 + 0.2, -3.58); divider.castShadow = true; shelfGroup.add(divider);
  }
  for (let row = 1; row <= SHELF_ROWS; row++) {
    const glow = new THREE.PointLight(0xffcf9c, 0.25, 3.2);
    glow.position.set(0, row * BAY_HEIGHT + 0.05, -3.3); shelfGroup.add(glow);
  }
  scene.add(shelfGroup);
  const bays = [];
  for (let row = 0; row < SHELF_ROWS; row++) for (let col = 0; col < SHELF_COLS; col++) {
    bays.push({ centerX: -totalWidth / 2 + col * BAY_WIDTH + BAY_WIDTH / 2, y: row * BAY_HEIGHT + 0.24, width: BAY_WIDTH - 0.18 });
  }

  function makePlant(x, y, z, scale = 1) {
    const group = new THREE.Group();
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * scale, 0.13 * scale, 0.22 * scale, 10), new THREE.MeshStandardMaterial({ color: 0x8a5a3c, roughness: 0.9 }));
    pot.position.y = 0.11 * scale; pot.castShadow = true; group.add(pot);
    const leafMat = new THREE.MeshStandardMaterial({ color: SAGE, roughness: 0.8 });
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.06 * scale, 0.5 * scale, 6), leafMat);
      const angle = (i / 7) * Math.PI * 2, droop = 0.35 + Math.random() * 0.35;
      leaf.position.set(Math.cos(angle) * 0.12 * scale, 0.28 * scale, Math.sin(angle) * 0.12 * scale);
      leaf.rotation.z = Math.cos(angle) * droop; leaf.rotation.x = Math.sin(angle) * droop * -1; leaf.castShadow = true; group.add(leaf);
    }
    group.position.set(x, y, z); return group;
  }
  shelfGroup.add(makePlant(-totalWidth / 2 + 0.3, totalHeight + 0.16, -3.6, 1.2));
  shelfGroup.add(makePlant(totalWidth / 2 - 0.35, totalHeight + 0.16, -3.55, 0.9));
  scene.add(makePlant(-5.6, 0, 2.4, 1.6));

  const chairMat = new THREE.MeshStandardMaterial({ color: 0x6f4530, roughness: 0.7 });
  const chair = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 0.35, 16), chairMat); seat.position.y = 0.5; seat.castShadow = true;
  const back = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.9, 16, 1, true, 0, Math.PI), chairMat); back.position.set(0, 1.1, -0.35); back.castShadow = true;
  chair.add(seat, back); chair.position.set(1.6, 0, 3.4); chair.rotation.y = -0.5; scene.add(chair);
  const table = new THREE.Group();
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 16), frameMat); tableTop.position.y = 0.7; tableTop.castShadow = true;
  const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 8), frameMat); tableLeg.position.y = 0.35; table.add(tableTop, tableLeg); table.position.set(2.6, 0, 2.6); scene.add(table);
  const lamp = new THREE.Group();
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.3, 8), new THREE.MeshStandardMaterial({ color: BRASS, metalness: 0.6, roughness: 0.3 })); lampPole.position.y = 1.35;
  const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.22, 12, 1, true), new THREE.MeshStandardMaterial({ color: 0xffdca0, emissive: 0xffb877, emissiveIntensity: 0.4, side: THREE.DoubleSide })); lampShade.position.y = 2;
  lamp.add(lampPole, lampShade); lamp.position.set(2.6, 0, 2.6); scene.add(lamp);

  const particleCount = 90, positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) { positions[i * 3] = (Math.random() - 0.5) * 10; positions[i * 3 + 1] = Math.random() * 5 + 0.4; positions[i * 3 + 2] = (Math.random() - 0.5) * 8; }
  const particleGeo = new THREE.BufferGeometry(); particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0xffe4b0, size: 0.02, transparent: true, opacity: 0.55, sizeAttenuation: true })); scene.add(particles);

  const textureLoader = new THREE.TextureLoader(), bookMeshes = [];
  function hashString(str) { let h = 0; for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; } return Math.abs(h); }
  const SPINE_COLORS = [0x6f2f2f, 0x2f4d3a, 0x2f3d5c, 0x5c3d2f, 0x4a3b5c, 0x7a5a2f, 0x3d5c58, 0x5c2f47];
  function clearBooks() { bookMeshes.forEach((m) => shelfGroup.remove(m)); bookMeshes.length = 0; }
  function buildBook(book) {
    const h = hashString(book.title + book.author), height = 0.85 + (h % 30) / 100, width = 0.12 + (h % 10) / 120, depth = 0.5 + (h % 15) / 100, tilt = ((h % 7) - 3) * 0.03;
    const spineMat = new THREE.MeshStandardMaterial({ color: SPINE_COLORS[h % SPINE_COLORS.length], roughness: 0.55 });
    const pageMat = new THREE.MeshStandardMaterial({ color: 0xf3ead9, roughness: 0.9 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), [spineMat, pageMat, pageMat, pageMat, spineMat, pageMat]);
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.rotation.z = tilt;
    if (book.cover_url) textureLoader.load(book.cover_url, (tex) => { tex.colorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding; mesh.material[4] = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 }); mesh.material.needsUpdate = true; }, undefined, () => {});
    return { mesh, width };
  }
  function showBooks(books) {
    clearBooks(); if (!books || !books.length) return;
    let bayIndex = 0, cursorX = bays[0].centerX - bays[0].width / 2;
    books.forEach((book) => { const item = buildBook(book); if (cursorX + item.width > bays[bayIndex].centerX + bays[bayIndex].width / 2) { bayIndex = Math.min(bayIndex + 1, bays.length - 1); cursorX = bays[bayIndex].centerX - bays[bayIndex].width / 2; } const bay = bays[bayIndex]; item.mesh.position.set(cursorX + item.width / 2, bay.y + item.mesh.geometry.parameters.height / 2, -3.3); shelfGroup.add(item.mesh); bookMeshes.push(item.mesh); cursorX += item.width + 0.02; });
  }
  function animate() { requestAnimationFrame(animate); particles.rotation.y += 0.0006; controls.update(); renderer.render(scene, camera); }
  animate();
  window.addEventListener("resize", () => { const w = container.clientWidth, h = container.clientHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); });
  return { showBooks };
}
