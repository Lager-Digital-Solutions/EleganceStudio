import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('scene-container');
const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;

const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
});
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(containerWidth, containerHeight);
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false; // Disabled auto-rotation
controls.enabled = false; // Disable orbital controls for cursor following
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Variables for model interaction
let modelMesh;
const mouse = new THREE.Vector2();
const targetRotation = new THREE.Vector2();
const currentRotation = new THREE.Vector2();
const smoothness = 0.1;
const clock = new THREE.Clock();

// Mouse move handler
function onMouseMove(event) {
    mouse.x = (event.clientX / containerWidth) * 2 - 1;
    mouse.y = (event.clientY / containerHeight) * 2 - 1;
    
    targetRotation.x = -mouse.y * 0.5;
    targetRotation.y = mouse.x * 0.5;
}

document.addEventListener('mousemove', onMouseMove);

const loader = new GLTFLoader();
loader.load(STATIC_PATH + 'public/model/scene.gltf', (gltf) => {
    console.log('loading model');
    modelMesh = gltf.scene;

    modelMesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            if (child.material) {
                child.material.transparent = false;
                child.material.opacity = 1;
                child.material.depthWrite = true;
                child.material.depthTest = true;
                child.material.metalness = 0.7;
                child.material.roughness = 0.3;
                child.material.color = new THREE.Color(0xcccccc);
                child.material.envMapIntensity = 1.5;
                child.material.needsUpdate = true;
            }
        }
    });

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const environmentTexture = pmremGenerator.fromScene(new THREE.Scene()).texture;
    scene.environment = environmentTexture;

    modelMesh.scale.set(20.5, 20.5, 20.5);
    modelMesh.position.set(0, 0, 0);
    
    // Add slight tilt
    modelMesh.rotation.x = 0.2; // Adjust this value for different tilt angles

    scene.add(modelMesh);

    document.getElementById('progress-container').style.display = 'none';
}, 
(xhr) => {
    console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
    document.getElementById('progress').textContent = 
        `Engaging Hyperdrive... ${Math.round(xhr.loaded / xhr.total * 100)}%`;
}, 
(error) => {
    console.error(error);
    document.getElementById('progress').textContent = 'Failed to load the Millennium Falcon!';
});

window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});

function animate() {
    requestAnimationFrame(animate);
    
    if (modelMesh) {
        // Smooth cursor following
        currentRotation.x += (targetRotation.x - currentRotation.x) * smoothness;
        currentRotation.y += (targetRotation.y - currentRotation.y) * smoothness;
        
        // Apply base tilt and cursor following
        modelMesh.rotation.x = 0.03 + currentRotation.x; // 0.2 is the base tilt
        modelMesh.rotation.y = currentRotation.y;
        
        // Floating animation
        const time = clock.getElapsedTime();
        modelMesh.position.y = Math.sin(time) * 0.2; // Adjust the multiplier (0.2) for different floating heights
    }
    
    renderer.render(scene, camera);
}

animate();