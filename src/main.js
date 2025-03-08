import './style.css'
import * as THREE from 'three'

// ===== SCENE SETUP =====
// Create a new Three.js scene
const scene = new THREE.Scene()

// ===== CAMERA SETUP =====
// Create a perspective camera
// Parameters: field of view (degrees), aspect ratio, near clipping plane, far clipping plane
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// Position the camera slightly above and back from the center
camera.position.set(0, 5, 10)
// Point the camera at the center of the scene
camera.lookAt(0, 0, 0)

// ===== RENDERER SETUP =====
// Create a WebGL renderer and set its size
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('game-canvas'),
  antialias: true // Smoother edges
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit pixel ratio for performance
renderer.shadowMap.enabled = true // Enable shadow mapping

// ===== LIGHTING SETUP =====
// Add ambient light for general illumination
const ambientLight = new THREE.AmbientLight(0x404040, 1) // Soft white light
scene.add(ambientLight)

// Add directional light for shadows and highlights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 7.5)
directionalLight.castShadow = true
// Optimize shadow settings
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 0.5
directionalLight.shadow.camera.far = 50
scene.add(directionalLight)

// ===== ARENA SETUP =====
// Create a flat plane for the arena
const arenaGeometry = new THREE.PlaneGeometry(20, 20)
// Create a material with a sandy color
const arenaMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xD2B48C, // Sandy color
  roughness: 0.8,
  metalness: 0.2
})
const arena = new THREE.Mesh(arenaGeometry, arenaMaterial)
// Rotate the arena to be horizontal
arena.rotation.x = -Math.PI / 2
arena.receiveShadow = true
scene.add(arena)

// ===== PLAYER CRAB SETUP =====
// Create a placeholder cube for the player crab
const playerCrabGeometry = new THREE.BoxGeometry(1, 0.5, 1.5)
const playerCrabMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 }) // Red color
const playerCrab = new THREE.Mesh(playerCrabGeometry, playerCrabMaterial)
playerCrab.position.set(0, 0.25, 0) // Position at the center of the arena, slightly above
playerCrab.castShadow = true
scene.add(playerCrab)

// ===== AI CRAB SETUP =====
// Create a placeholder cube for the AI crab
const aiCrabGeometry = new THREE.BoxGeometry(1, 0.5, 1.5)
const aiCrabMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF }) // Blue color
const aiCrab = new THREE.Mesh(aiCrabGeometry, aiCrabMaterial)
aiCrab.position.set(3, 0.25, 3) // Position offset from the player
aiCrab.castShadow = true
scene.add(aiCrab)

// ===== PLAYER CONTROLS SETUP =====
// Object to track which keys are currently pressed
const keys = {
  w: false, // Forward
  a: false, // Left
  s: false, // Backward
  d: false  // Right
}

// Movement speed for the player crab
const playerSpeed = 0.1

// Function to handle keydown events
function onKeyDown(event) {
  // Convert key to lowercase to handle both uppercase and lowercase
  const key = event.key.toLowerCase()
  
  // Check if the pressed key is one of our control keys
  if (keys.hasOwnProperty(key)) {
    // Set the key state to true (pressed)
    keys[key] = true
  }
}

// Function to handle keyup events
function onKeyUp(event) {
  // Convert key to lowercase to handle both uppercase and lowercase
  const key = event.key.toLowerCase()
  
  // Check if the released key is one of our control keys
  if (keys.hasOwnProperty(key)) {
    // Set the key state to false (released)
    keys[key] = false
  }
}

// Add event listeners for keyboard input
window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)

// Function to update player position based on key presses
function updatePlayerPosition() {
  // Store the original rotation
  const originalRotation = playerCrab.rotation.y
  
  // Move forward (decrease Z position) when W is pressed
  if (keys.w) {
    playerCrab.position.z -= playerSpeed
    playerCrab.rotation.y = Math.PI // Rotate to face forward
  }
  
  // Move backward (increase Z position) when S is pressed
  if (keys.s) {
    playerCrab.position.z += playerSpeed
    playerCrab.rotation.y = 0 // Rotate to face backward
  }
  
  // Move left (decrease X position) when A is pressed
  if (keys.a) {
    playerCrab.position.x -= playerSpeed
    playerCrab.rotation.y = Math.PI / 2 // Rotate to face left
  }
  
  // Move right (increase X position) when D is pressed
  if (keys.d) {
    playerCrab.position.x += playerSpeed
    playerCrab.rotation.y = -Math.PI / 2 // Rotate to face right
  }
  
  // Limit player movement to stay within the arena bounds
  // Arena size is 20x20, centered at origin, so valid positions are -10 to 10
  const arenaHalfSize = 10
  playerCrab.position.x = Math.max(-arenaHalfSize + 1, Math.min(arenaHalfSize - 1, playerCrab.position.x))
  playerCrab.position.z = Math.max(-arenaHalfSize + 1, Math.min(arenaHalfSize - 1, playerCrab.position.z))
  
  // If no movement keys are pressed, keep the current rotation
  if (!keys.w && !keys.a && !keys.s && !keys.d) {
    playerCrab.rotation.y = originalRotation
  }
}

// ===== WINDOW RESIZE HANDLER =====
// Update renderer and camera when window is resized
window.addEventListener('resize', () => {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  
  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ===== ANIMATION LOOP =====
// Create an animation loop to continuously render the scene
function animate() {
  requestAnimationFrame(animate)
  
  // Update player position based on key presses
  updatePlayerPosition()
  
  // Add simple rotation to the AI crab to show it's a 3D object
  aiCrab.rotation.y += 0.01
  
  // Render the scene with the camera
  renderer.render(scene, camera)
}

// Start the animation loop
animate()
