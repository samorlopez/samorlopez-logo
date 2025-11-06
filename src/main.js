import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true // Enable transparency
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

scene.background = null; // Make background transparent

// Set camera position and orientation
camera.position.set(0, 50, 0);
camera.rotation.set(-Math.PI / 2, 0, 0);

const pointLight = new THREE.PointLight(0xffffff, 1000);
pointLight.position.set(0, 35, 0);
pointLight.decay = 1.4;
pointLight.distance = 400;

const ambientLight = new THREE.AmbientLight(0xffffff, 2.9);

scene.add(pointLight, ambientLight);

function animate() {
  requestAnimationFrame(animate);

  // Smoothing factor (0.1 = slow, 1 = instant)
  const smoothing = 0.035;
  pointLight.position.x += (targetLightPos.x - pointLight.position.x) * smoothing;
  pointLight.position.z += (targetLightPos.z - pointLight.position.z) * smoothing;

  renderer.render(scene, camera);
}

let glbModel = null; // Store reference to the loaded GLB model

const gltfLoader = new GLTFLoader();
gltfLoader.load('samorlopez_v8.glb', (gltf) => {
  // Remove previous model if it exists
  if (glbModel) {
    scene.remove(glbModel);
  }
  glbModel = gltf.scene;
  glbModel.position.set(0, 0, 0);

  // Scale proportionally to the smaller viewport dimension
  const initialScale = window.innerWidth / 65;
  glbModel.scale.set(initialScale, initialScale, initialScale);

  scene.add(glbModel);
});

// Store target position for the point light
let targetLightPos = { x: pointLight.position.x, z: pointLight.position.z };

// Update target position on mouse move
window.addEventListener('mousemove', (event) => {
  // Map mouse to normalized device coordinates (-1 to +1)
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  targetLightPos.x = mouseX * 50;
  targetLightPos.z = -mouseY * 50;
});

// Responsive resize: scale canvas and update camera and model on viewport change
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Scale the GLB object based on viewport size
  if (glbModel) {
    const scale = window.innerWidth / 65;
    glbModel.scale.set(scale, scale, scale);
  }
});

animate();

