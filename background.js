// Three.js Background Animation
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20; // Spread range
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00f0ff, // Neon Cyan
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Connecting Lines (Neural Network Effect)
// Note: For performance, we'll keep lines static or simple, 
// complex dynamic lines between 700 particles can be heavy.
// Let's add a secondary geometry for lines if needed, or rely on movement.

// Mouse Interaction
const mouse = {
    x: 0,
    y: 0
};

document.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / window.innerWidth - 0.5;
    mouse.y = event.clientY / window.innerHeight - 0.5;
});

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Draw lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.1
    });

    // Instead of complex N^2 loop for lines, let's create a static set of lines for performance
    // or a simpler animated geometry.
    // For a "Neural Network" feel, we can use a separate BufferGeometry with LINES mode.

    // NOTE: Accessing attributes.position.array in loop is heavy. 
    // Let's just animate the group rotation for now to keep FPS high.

    // Rotate entire system slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Mouse parallax effect (smooth lerp)
    particlesMesh.rotation.y += (mouse.x * 0.5 - particlesMesh.rotation.y) * 0.05;
    particlesMesh.rotation.x += (mouse.y * 0.5 - particlesMesh.rotation.x) * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

camera.position.z = 3;
animate();
