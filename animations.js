/* ========================================
   iCat Infotech — 3D Vector Globe
   Three.js Wireframe Globe with Clockwise Rotation
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('globe-container');
  if (!container) return;

  // ── Scene Setup ──
  const scene = new THREE.Scene();
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 2.8;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // ── Globe Group ──
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // ── 1. Main Wireframe Sphere ──
  const sphereGeometry = new THREE.SphereGeometry(1, 36, 24);
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xFF6A00,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const wireframeSphere = new THREE.Mesh(sphereGeometry, wireframeMaterial);
  globeGroup.add(wireframeSphere);

  // ── 2. Outer Glow Ring ──
  const ringGeometry = new THREE.RingGeometry(1.15, 1.18, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xFF6A00,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  globeGroup.add(ring);

  // ── 3. Second Tilted Ring ──
  const ring2 = ring.clone();
  ring2.rotation.x = Math.PI / 2.6;
  ring2.rotation.z = Math.PI / 5;
  ring2.material = ringMaterial.clone();
  ring2.material.opacity = 0.15;
  globeGroup.add(ring2);

  // ── 4. Latitude Lines ──
  const latitudes = [-0.6, -0.3, 0, 0.3, 0.6];
  latitudes.forEach(lat => {
    const radius = Math.cos(Math.asin(lat));
    const circleGeometry = new THREE.BufferGeometry();
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(
        radius * Math.cos(angle),
        lat,
        radius * Math.sin(angle)
      ));
    }
    circleGeometry.setFromPoints(points);
    const circleMaterial = new THREE.LineBasicMaterial({
      color: 0xFF6A00,
      transparent: true,
      opacity: 0.2
    });
    const circle = new THREE.Line(circleGeometry, circleMaterial);
    globeGroup.add(circle);
  });

  // ── 5. Longitude Lines ──
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const lonGeometry = new THREE.BufferGeometry();
    const points = [];
    for (let j = 0; j <= 64; j++) {
      const phi = (j / 64) * Math.PI;
      points.push(new THREE.Vector3(
        Math.sin(phi) * Math.cos(angle),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(angle)
      ));
    }
    lonGeometry.setFromPoints(points);
    const lonMaterial = new THREE.LineBasicMaterial({
      color: 0xFF6A00,
      transparent: true,
      opacity: 0.1
    });
    const lonLine = new THREE.Line(lonGeometry, lonMaterial);
    globeGroup.add(lonLine);
  }

  // ── 6. Glowing Dots (City Locations) ──
  const locations = [
    // lat, lon → converted to 3D
    { lat: 17.38, lon: 78.49, name: 'Secunderabad' },    // Primary Hub
    { lat: 21.14, lon: 79.08, name: 'Nagpur' },          // Delivery Center
    { lat: 28.61, lon: 77.23, name: 'Delhi' },
    { lat: 19.07, lon: 72.87, name: 'Mumbai' },
    { lat: 12.97, lon: 77.59, name: 'Bangalore' },
    { lat: 13.08, lon: 80.27, name: 'Chennai' },
    { lat: 40.71, lon: -74.00, name: 'New York' },
    { lat: 51.50, lon: -0.12, name: 'London' },
    { lat: 35.68, lon: 139.69, name: 'Tokyo' },
    { lat: 1.35, lon: 103.82, name: 'Singapore' },
    { lat: -33.86, lon: 151.20, name: 'Sydney' },
    { lat: 25.20, lon: 55.27, name: 'Dubai' },
    { lat: 37.77, lon: -122.41, name: 'San Francisco' },
    { lat: 48.85, lon: 2.35, name: 'Paris' },
    { lat: 55.75, lon: 37.61, name: 'Moscow' },
    { lat: -23.55, lon: -46.63, name: 'São Paulo' },
    { lat: 22.39, lon: 114.10, name: 'Hong Kong' },
    { lat: 39.90, lon: 116.40, name: 'Beijing' },
  ];

  function latLonToVec3(lat, lon, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
  }

  const dotGeometry = new THREE.SphereGeometry(0.02, 8, 8);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xFF6A00 });

  // Larger dots for primary locations
  const primaryDotGeometry = new THREE.SphereGeometry(0.035, 8, 8);
  const primaryDotMaterial = new THREE.MeshBasicMaterial({ color: 0xFFAA55 });

  locations.forEach((loc, i) => {
    const pos = latLonToVec3(loc.lat, loc.lon, 1.01);
    const isPrimary = i < 2; // Secunderabad & Nagpur
    const dot = new THREE.Mesh(
      isPrimary ? primaryDotGeometry : dotGeometry,
      isPrimary ? primaryDotMaterial : dotMaterial
    );
    dot.position.copy(pos);
    globeGroup.add(dot);

    // Pulse ring for primary locations
    if (isPrimary) {
      const pulseGeo = new THREE.RingGeometry(0.03, 0.06, 16);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: 0xFF6A00,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.position.copy(pos);
      pulse.lookAt(0, 0, 0);
      pulse.userData = { phase: Math.random() * Math.PI * 2 };
      globeGroup.add(pulse);
    }
  });

  // ── 7. Connection Arcs between key locations ──
  function createArc(start, end) {
    const points = [];
    const startVec = latLonToVec3(start.lat, start.lon, 1.01);
    const endVec = latLonToVec3(end.lat, end.lon, 1.01);
    const mid = startVec.clone().add(endVec).multiplyScalar(0.5);
    const dist = startVec.distanceTo(endVec);
    mid.normalize().multiplyScalar(1.01 + dist * 0.15);

    const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
    const arcPoints = curve.getPoints(32);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineBasicMaterial({
      color: 0xFF6A00,
      transparent: true,
      opacity: 0.25
    });
    return new THREE.Line(arcGeo, arcMat);
  }

  // Connect Secunderabad to global cities
  const hub = locations[0]; // Secunderabad
  [locations[6], locations[7], locations[9], locations[11]].forEach(dest => {
    globeGroup.add(createArc(hub, dest));
  });

  // ── 8. Ambient Particles Around Globe ──
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const r = 1.3 + Math.random() * 0.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.cos(phi);
    particlePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xFF6A00,
    size: 0.008,
    transparent: true,
    opacity: 0.5
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  globeGroup.add(particles);

  // ── Slight Tilt ──
  globeGroup.rotation.x = 0.15;

  // ── Animation Loop (Clockwise) ──
  function animate() {
    requestAnimationFrame(animate);

    // Clockwise rotation (negative Y)
    globeGroup.rotation.y -= 0.003;

    // Pulse animation for primary location rings
    const time = Date.now() * 0.001;
    globeGroup.children.forEach(child => {
      if (child.userData && child.userData.phase !== undefined) {
        const scale = 1 + Math.sin(time * 2 + child.userData.phase) * 0.5;
        child.scale.set(scale, scale, scale);
        child.material.opacity = 0.5 - Math.sin(time * 2 + child.userData.phase) * 0.3;
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  // ── Responsive ──
  window.addEventListener('resize', () => {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // ── Mouse Interaction (subtle tilt on hover) ──
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    globeGroup.rotation.x = 0.15 + mouseY * 0.1;
  });

  container.addEventListener('mouseleave', () => {
    globeGroup.rotation.x = 0.15;
  });
});
