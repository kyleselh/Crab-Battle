import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// ===== SCENE SETUP =====
// Create a new Three.js scene
const scene = new THREE.Scene()

// ===== CAMERA SETUP =====
// Create a perspective camera
// Parameters: field of view (degrees), aspect ratio, near clipping plane, far clipping plane
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// Initial camera position
camera.position.set(0, 5, 10)
camera.lookAt(0, 0, 0)

// Variables for third-person camera
const cameraOffset = new THREE.Vector3(0, 3, -5) // Height and distance behind the player (negative Z to be behind)

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
const playerCrabMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xFF0000,
  visible: false // Make the placeholder invisible
}) // Red color
const playerCrab = new THREE.Mesh(playerCrabGeometry, playerCrabMaterial)
playerCrab.position.set(0, 0.25, 0) // Position at the center of the arena, slightly above
playerCrab.castShadow = true
scene.add(playerCrab)

// Create left claw for the player crab
const leftClawGeometry = new THREE.BoxGeometry(0.7, 0.3, 0.3)
const clawMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xCC0000,
  visible: false // Make the claws invisible
}) // Slightly darker red
const leftClaw = new THREE.Mesh(leftClawGeometry, clawMaterial)
leftClaw.position.set(-0.85, 0, 0) // Position on the left side of the crab
leftClaw.castShadow = true
playerCrab.add(leftClaw) // Add to the player crab so it moves with it

// Create right claw for the player crab
const rightClawGeometry = new THREE.BoxGeometry(0.7, 0.3, 0.3)
const rightClaw = new THREE.Mesh(rightClawGeometry, clawMaterial)
rightClaw.position.set(0.85, 0, 0) // Position on the right side of the crab
rightClaw.castShadow = true
playerCrab.add(rightClaw) // Add to the player crab so it moves with it

// Load the 3D crab model
const loader = new GLTFLoader();
loader.load(
  // Resource URL
  'src/assets/models/crab.glb',
  // Called when the resource is loaded
  function(gltf) {
    const crabModel = gltf.scene;
    // Scale the model appropriately
    crabModel.scale.set(0.5, 0.5, 0.5);
    // Position the model
    crabModel.position.copy(playerCrab.position);
    // Make sure the model casts shadows
    crabModel.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    // Add the model to the scene
    scene.add(crabModel);
    console.log('Crab model loaded successfully!');
    
    // Make the crab model follow the player crab's position and rotation
    const originalUpdatePlayerPosition = updatePlayerPosition;
    updatePlayerPosition = function() {
      originalUpdatePlayerPosition();
      crabModel.position.copy(playerCrab.position);
      crabModel.rotation.y = playerCrab.rotation.y;
    };
  },
  // Called while loading is progressing
  function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  // Called when loading has errors
  function(error) {
    console.error('An error happened while loading the crab model:', error);
  }
);

// ===== AI CRAB SETUP =====
// Create a placeholder cube for the AI crab
const aiCrabGeometry = new THREE.BoxGeometry(1, 0.5, 1.5)
const aiCrabMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x0000FF,
  visible: false // Make the placeholder invisible
}) // Blue color
const aiCrab = new THREE.Mesh(aiCrabGeometry, aiCrabMaterial)
aiCrab.position.set(3, 0.25, 3) // Position offset from the player
aiCrab.castShadow = true
scene.add(aiCrab)

// Create left claw for the AI crab
const aiLeftClawGeometry = new THREE.BoxGeometry(0.7, 0.3, 0.3)
const aiClawMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x0000CC,
  visible: false // Make the claws invisible
}) // Slightly darker blue
const aiLeftClaw = new THREE.Mesh(aiLeftClawGeometry, aiClawMaterial)
aiLeftClaw.position.set(-0.85, 0, 0) // Position on the left side of the crab
aiLeftClaw.castShadow = true
aiCrab.add(aiLeftClaw) // Add to the AI crab so it moves with it

// Create right claw for the AI crab
const aiRightClawGeometry = new THREE.BoxGeometry(0.7, 0.3, 0.3)
const aiRightClaw = new THREE.Mesh(aiRightClawGeometry, aiClawMaterial)
aiRightClaw.position.set(0.85, 0, 0) // Position on the right side of the crab
aiRightClaw.castShadow = true
aiCrab.add(aiRightClaw) // Add to the AI crab so it moves with it

// Load the 3D crab model for the AI
loader.load(
  // Resource URL
  'src/assets/models/crab.glb',
  // Called when the resource is loaded
  function(gltf) {
    const aiCrabModel = gltf.scene.clone(); // Clone the model
    // Scale the model appropriately
    aiCrabModel.scale.set(0.5, 0.5, 0.5);
    // Position the model
    aiCrabModel.position.copy(aiCrab.position);
    // Make sure the model casts shadows
    aiCrabModel.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        // Give the AI crab a blue tint to distinguish it from the player
        if (node.material) {
          node.material = node.material.clone(); // Clone the material to avoid affecting the player crab
          node.material.color.setHex(0x8888FF); // Light blue tint
        }
      }
    });
    // Add the model to the scene
    scene.add(aiCrabModel);
    console.log('AI Crab model loaded successfully!');
    
    // Make the AI crab model follow the AI crab placeholder's position and rotation
    const originalUpdateAICrabPosition = updateAICrabPosition;
    updateAICrabPosition = function() {
      originalUpdateAICrabPosition();
      aiCrabModel.position.copy(aiCrab.position);
      aiCrabModel.rotation.y = aiCrab.rotation.y;
    };
  },
  // Called when loading has errors
  function(error) {
    console.error('An error happened while loading the AI crab model:', error);
  }
);

// ===== PLAYER CONTROLS SETUP =====
// Player movement keys
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  shift: false,
  e: false
};

// Mouse controls
let mousePosition = new THREE.Vector2();
let isMouseDown = false;
let mouseWorldPosition = new THREE.Vector3(); // Store the world position of the mouse

// Movement physics variables
const maxSpeed = 0.15;
let currentSpeed = 0;
const acceleration = 0.01;
const deceleration = 0.02;
const rotationSpeed = 0.08; // Increased for more responsive turning

// Attack animation variables
let isAttacking = false;
let attackAnimationTime = 0;
const attackDuration = 20; // Reduced for faster attacks

// Heavy attack variables
let isHeavyAttacking = false;
let heavyAttackAnimationTime = 0;
const heavyAttackDuration = 40;
const heavyDamageAmount = 25; // More damage for heavy attacks

// Dodge variables
let isDodging = false;
let dodgeAnimationTime = 0;
const dodgeDuration = 15;
const dodgeSpeed = 0.4;
let dodgeCooldown = 0;
const maxDodgeCooldown = 45; // ~1.5 seconds at 30fps

// Health system variables
const maxHealth = 100;
let playerHealth = maxHealth;
let aiHealth = maxHealth;
const damageAmount = 10; // Damage per successful hit

// AI movement speed (slightly slower than player's max speed)
const aiSpeed = maxSpeed * 0.7;

// Crab defeat counter
let crabsDefeated = 0;

// Game state
let gameStarted = false;

// Create welcome screen
const welcomeScreenDiv = document.createElement('div');
welcomeScreenDiv.style.position = 'absolute';
welcomeScreenDiv.style.top = '0';
welcomeScreenDiv.style.left = '0';
welcomeScreenDiv.style.width = '100%';
welcomeScreenDiv.style.height = '100%';
welcomeScreenDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
welcomeScreenDiv.style.display = 'flex';
welcomeScreenDiv.style.flexDirection = 'column';
welcomeScreenDiv.style.justifyContent = 'center';
welcomeScreenDiv.style.alignItems = 'center';
welcomeScreenDiv.style.zIndex = '2000';
document.body.appendChild(welcomeScreenDiv);

// Create title
const titleDiv = document.createElement('h1');
titleDiv.textContent = 'Crab Battle';
titleDiv.style.color = 'white';
titleDiv.style.fontFamily = 'Arial, sans-serif';
titleDiv.style.fontSize = '48px';
titleDiv.style.marginBottom = '20px';
welcomeScreenDiv.appendChild(titleDiv);

// Create description
const descriptionDiv = document.createElement('p');
descriptionDiv.textContent = 'Battle against enemy crabs in this 3D arena combat game!';
descriptionDiv.style.color = 'white';
descriptionDiv.style.fontFamily = 'Arial, sans-serif';
descriptionDiv.style.fontSize = '18px';
descriptionDiv.style.marginBottom = '40px';
descriptionDiv.style.textAlign = 'center';
descriptionDiv.style.maxWidth = '600px';
welcomeScreenDiv.appendChild(descriptionDiv);

// Create start button
const startButton = document.createElement('button');
startButton.textContent = 'Start Battle';
startButton.style.padding = '15px 30px';
startButton.style.fontSize = '20px';
startButton.style.backgroundColor = '#FF0000';
startButton.style.color = 'white';
startButton.style.border = 'none';
startButton.style.borderRadius = '5px';
startButton.style.cursor = 'pointer';
startButton.style.fontWeight = 'bold';
startButton.style.transition = 'background-color 0.3s';
startButton.addEventListener('mouseover', () => {
  startButton.style.backgroundColor = '#CC0000';
});
startButton.addEventListener('mouseout', () => {
  startButton.style.backgroundColor = '#FF0000';
});
startButton.addEventListener('click', startGame);
welcomeScreenDiv.appendChild(startButton);

// Function to start the game
function startGame() {
  gameStarted = true;
  welcomeScreenDiv.style.display = 'none';
  defeatCounterDiv.style.display = 'block';
}

// Create health bars in HTML
const healthBarsDiv = document.createElement('div');
healthBarsDiv.style.position = 'absolute';
healthBarsDiv.style.top = '20px';
healthBarsDiv.style.left = '20px';
healthBarsDiv.style.width = '200px';
healthBarsDiv.style.padding = '10px';
healthBarsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
healthBarsDiv.style.borderRadius = '5px';
healthBarsDiv.style.color = 'white';
healthBarsDiv.style.fontFamily = 'Arial, sans-serif';
document.body.appendChild(healthBarsDiv);

// Player health bar
const playerHealthLabel = document.createElement('div');
playerHealthLabel.textContent = 'Player Health:';
healthBarsDiv.appendChild(playerHealthLabel);

const playerHealthBarContainer = document.createElement('div');
playerHealthBarContainer.style.width = '100%';
playerHealthBarContainer.style.height = '20px';
playerHealthBarContainer.style.backgroundColor = '#333';
playerHealthBarContainer.style.marginBottom = '10px';
playerHealthBarContainer.style.borderRadius = '3px';
healthBarsDiv.appendChild(playerHealthBarContainer);

const playerHealthBar = document.createElement('div');
playerHealthBar.style.width = '100%';
playerHealthBar.style.height = '100%';
playerHealthBar.style.backgroundColor = '#FF0000'; // Red to match player color
playerHealthBar.style.borderRadius = '3px';
playerHealthBar.style.transition = 'width 0.3s';
playerHealthBarContainer.appendChild(playerHealthBar);

// AI health bar
const aiHealthLabel = document.createElement('div');
aiHealthLabel.textContent = 'Enemy Health:';
healthBarsDiv.appendChild(aiHealthLabel);

const aiHealthBarContainer = document.createElement('div');
aiHealthBarContainer.style.width = '100%';
aiHealthBarContainer.style.height = '20px';
aiHealthBarContainer.style.backgroundColor = '#333';
aiHealthBarContainer.style.borderRadius = '3px';
healthBarsDiv.appendChild(aiHealthBarContainer);

const aiHealthBar = document.createElement('div');
aiHealthBar.style.width = '100%';
aiHealthBar.style.height = '100%';
aiHealthBar.style.backgroundColor = '#0000FF'; // Blue to match AI color
aiHealthBar.style.borderRadius = '3px';
aiHealthBar.style.transition = 'width 0.3s';
aiHealthBarContainer.appendChild(aiHealthBar);

// Create defeat counter at the top of the screen
const defeatCounterDiv = document.createElement('div');
defeatCounterDiv.style.position = 'absolute';
defeatCounterDiv.style.top = '20px';
defeatCounterDiv.style.left = '50%';
defeatCounterDiv.style.transform = 'translateX(-50%)';
defeatCounterDiv.style.padding = '10px 20px';
defeatCounterDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
defeatCounterDiv.style.borderRadius = '5px';
defeatCounterDiv.style.color = 'white';
defeatCounterDiv.style.fontFamily = 'Arial, sans-serif';
defeatCounterDiv.style.fontSize = '18px';
defeatCounterDiv.style.fontWeight = 'bold';
defeatCounterDiv.style.zIndex = '1000';
defeatCounterDiv.style.display = 'none'; // Hide initially
defeatCounterDiv.textContent = 'Crabs Defeated: 0';
document.body.appendChild(defeatCounterDiv);

// Function to update the defeat counter
function updateDefeatCounter() {
  defeatCounterDiv.textContent = `Crabs Defeated: ${crabsDefeated}`;
}

// Create controls panel in the top right
const controlsPanelDiv = document.createElement('div');
controlsPanelDiv.style.position = 'absolute';
controlsPanelDiv.style.top = '20px';
controlsPanelDiv.style.right = '20px';
controlsPanelDiv.style.width = '250px';
controlsPanelDiv.style.padding = '10px';
controlsPanelDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
controlsPanelDiv.style.borderRadius = '5px';
controlsPanelDiv.style.color = 'white';
controlsPanelDiv.style.fontFamily = 'Arial, sans-serif';
controlsPanelDiv.style.zIndex = '1000';
controlsPanelDiv.style.transition = 'height 0.3s ease-in-out';
controlsPanelDiv.style.overflow = 'hidden';
document.body.appendChild(controlsPanelDiv);

// Create header with collapse button
const controlsHeader = document.createElement('div');
controlsHeader.style.display = 'flex';
controlsHeader.style.justifyContent = 'space-between';
controlsHeader.style.alignItems = 'center';
controlsHeader.style.marginBottom = '10px';
controlsHeader.style.cursor = 'pointer';
controlsPanelDiv.appendChild(controlsHeader);

const controlsTitle = document.createElement('h3');
controlsTitle.textContent = 'Game Controls';
controlsTitle.style.margin = '0';
controlsHeader.appendChild(controlsTitle);

const collapseButton = document.createElement('span');
collapseButton.textContent = '−'; // Minus sign
collapseButton.style.fontSize = '20px';
collapseButton.style.fontWeight = 'bold';
controlsHeader.appendChild(collapseButton);

// Create controls list
const controlsList = document.createElement('ul');
controlsList.style.listStyleType = 'none';
controlsList.style.padding = '0';
controlsList.style.margin = '0';
controlsPanelDiv.appendChild(controlsList);

// Add control items
const controls = [
  { key: 'W', action: 'Move Forward' },
  { key: 'S', action: 'Move Backward' },
  { key: 'A', action: 'Strafe Left' },
  { key: 'D', action: 'Strafe Right' },
  { key: 'Mouse', action: 'Aim Direction' },
  { key: 'Left Click', action: 'Basic Attack' },
  { key: 'E', action: 'Heavy Attack' },
  { key: 'Shift', action: 'Dodge/Dash' }
];

controls.forEach(control => {
  const controlItem = document.createElement('li');
  controlItem.style.marginBottom = '5px';
  controlItem.style.display = 'flex';
  controlItem.style.justifyContent = 'space-between';
  
  const keySpan = document.createElement('span');
  keySpan.textContent = control.key;
  keySpan.style.backgroundColor = '#444';
  keySpan.style.padding = '2px 8px';
  keySpan.style.borderRadius = '3px';
  keySpan.style.marginRight = '10px';
  keySpan.style.fontFamily = 'monospace';
  keySpan.style.fontWeight = 'bold';
  
  const actionSpan = document.createElement('span');
  actionSpan.textContent = control.action;
  actionSpan.style.flexGrow = '1';
  actionSpan.style.textAlign = 'left';
  
  controlItem.appendChild(keySpan);
  controlItem.appendChild(actionSpan);
  controlsList.appendChild(controlItem);
});

// Add collapse/expand functionality
let isCollapsed = true; // Start collapsed
const expandedHeight = controlsPanelDiv.scrollHeight + 'px';
const collapsedHeight = controlsHeader.scrollHeight + 'px';

// Set initial state to collapsed
controlsPanelDiv.style.height = collapsedHeight;
collapseButton.textContent = '+'; // Plus sign for collapsed state

controlsHeader.addEventListener('click', () => {
  isCollapsed = !isCollapsed;
  
  if (isCollapsed) {
    controlsPanelDiv.style.height = collapsedHeight;
    collapseButton.textContent = '+'; // Plus sign
  } else {
    controlsPanelDiv.style.height = expandedHeight;
    collapseButton.textContent = '−'; // Minus sign
  }
});

// Function to update health bars
function updateHealthBars() {
  playerHealthBar.style.width = `${playerHealth}%`;
  aiHealthBar.style.width = `${aiHealth}%`;
}

// Function to check for collision between crabs
function checkAttackCollision() {
  // Only check collision if player is attacking
  if ((isAttacking && attackAnimationTime === attackDuration / 2) || 
      (isHeavyAttacking && heavyAttackAnimationTime === heavyAttackDuration / 2)) {
    
    // Calculate distance between crabs
    const dx = playerCrab.position.x - aiCrab.position.x;
    const dz = playerCrab.position.z - aiCrab.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    // Calculate attack range based on attack type
    const attackRange = isHeavyAttacking ? 3.0 : 2.5;
    
    // If crabs are close enough, player damages AI
    if (distance < attackRange) {
      // Apply damage based on attack type
      const damage = isHeavyAttacking ? heavyDamageAmount : damageAmount;
      aiHealth = Math.max(0, aiHealth - damage);
      updateHealthBars();
      
      // Visual feedback for hit
      createHitEffect(aiCrab.position);
    }
  }
}

// Function to create visual hit effect
function createHitEffect(position) {
  // Create a simple particle effect at the hit position
  const particles = new THREE.Group();
  
  for (let i = 0; i < 8; i++) {
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
    );
    
    // Random position offset
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.5;
    particle.position.set(
      position.x + Math.cos(angle) * radius,
      position.y + 0.5,
      position.z + Math.sin(angle) * radius
    );
    
    particles.add(particle);
  }
  
  scene.add(particles);
  
  // Remove particles after animation
  setTimeout(() => {
    scene.remove(particles);
    particles.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  }, 300);
}

// Function to respawn the AI crab with full health
function respawnAiCrab() {
  // Increment the defeat counter
  crabsDefeated++;
  updateDefeatCounter();
  
  // Reset AI health to max
  aiHealth = maxHealth;
  updateHealthBars();
  
  // Reposition the AI crab at a random position within the arena
  const arenaHalfSize = 10;
  const randomX = Math.random() * (arenaHalfSize * 2 - 2) - arenaHalfSize + 1;
  const randomZ = Math.random() * (arenaHalfSize * 2 - 2) - arenaHalfSize + 1;
  
  aiCrab.position.set(randomX, 0.25, randomZ);
  
  console.log('AI Crab respawned with full health!');
}

// Function to handle key down events
function onKeyDown(event) {
  if (!gameStarted) return; // Only process input if game has started
  
  // Prevent default behavior for game controls
  if (['w', 'a', 's', 'd', 'e', 'shift'].includes(event.key.toLowerCase())) {
    event.preventDefault();
  }
  
  // Update key states
  switch (event.key.toLowerCase()) {
    case 'w':
      keys.w = true;
      break;
    case 'a':
      keys.a = true;
      break;
    case 's':
      keys.s = true;
      break;
    case 'd':
      keys.d = true;
      break;
    case 'shift':
      keys.shift = true;
      // Initiate dodge if not already dodging and cooldown is over
      if (!isDodging && dodgeCooldown === 0) {
        isDodging = true;
        dodgeAnimationTime = 0;
      }
      break;
    case 'e':
      keys.e = true;
      // Initiate heavy attack if not already attacking and not dodging
      if (!isHeavyAttacking && !isAttacking && !isDodging) {
        isHeavyAttacking = true;
        heavyAttackAnimationTime = 0;
      }
      break;
  }
}

// Function to handle key up events
function onKeyUp(event) {
  if (!gameStarted) return; // Only process input if game has started
  
  // Update key states
  switch (event.key.toLowerCase()) {
    case 'w':
      keys.w = false;
      break;
    case 'a':
      keys.a = false;
      break;
    case 's':
      keys.s = false;
      break;
    case 'd':
      keys.d = false;
      break;
    case 'shift':
      keys.shift = false;
      break;
    case 'e':
      keys.e = false;
      break;
  }
}

// Function to handle mouse movement
function onMouseMove(event) {
  if (!gameStarted) return; // Only process input if game has started
  
  // Update mouse position
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  updateMouseWorldPosition();
}

// Function to update the world position based on mouse coordinates
function updateMouseWorldPosition() {
  // Convert mouse position to 3D ray
  raycaster.setFromCamera(mousePosition, camera);
  
  // Create a plane at the player's height
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  
  // Find where the ray intersects the plane
  const targetPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, targetPoint);
  
  // Store the target point
  mouseWorldPosition.copy(targetPoint);
}

// Function to handle mouse down events
function onMouseDown(event) {
  if (!gameStarted) return; // Only process input if game has started
  
  // Left mouse button
  if (event.button === 0) {
    isMouseDown = true;
    
    // Initiate basic attack if not already attacking and not dodging
    if (!isAttacking && !isHeavyAttacking && !isDodging) {
      isAttacking = true;
      attackAnimationTime = 0;
    }
  }
}

// Function to handle mouse up events
function onMouseUp(event) {
  if (!gameStarted) return; // Only process input if game has started
  
  // Left mouse button
  if (event.button === 0) {
    isMouseDown = false;
  }
}

// Add event listeners for keyboard and mouse input
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);

// Raycaster for mouse position in 3D space
const raycaster = new THREE.Raycaster();

// Function to update player position
function updatePlayerPosition() {
  // Update mouse world position
  updateMouseWorldPosition();
  
  // Only rotate the crab if the mouse is a certain distance away from the crab
  // This prevents jittery rotation when the mouse is very close to the crab
  const distanceToMouse = new THREE.Vector2(
    mouseWorldPosition.x - playerCrab.position.x,
    mouseWorldPosition.z - playerCrab.position.z
  ).length();
  
  if (distanceToMouse > 0.5) {
    // Calculate direction from player to mouse point
    const directionX = mouseWorldPosition.x - playerCrab.position.x;
    const directionZ = mouseWorldPosition.z - playerCrab.position.z;
    
    // Calculate angle to face the mouse position
    const targetRotation = Math.atan2(directionX, directionZ);
    
    // Smoothly rotate towards the target rotation with improved interpolation
    const rotationDiff = targetRotation - playerCrab.rotation.y;
    
    // Handle the case where the difference crosses the -PI/PI boundary
    let shortestRotationDiff = ((rotationDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
    if (shortestRotationDiff < -Math.PI) {
      shortestRotationDiff += Math.PI * 2;
    }
    
    // Apply smooth rotation with faster response for larger differences
    const rotationSpeed = Math.min(0.15, Math.abs(shortestRotationDiff) * 0.3);
    playerCrab.rotation.y += Math.sign(shortestRotationDiff) * rotationSpeed;
  }
  
  // Handle acceleration and deceleration
  if (keys.w || keys.s) {
    // Accelerate up to max speed
    currentSpeed = Math.min(maxSpeed, currentSpeed + acceleration);
  } else {
    // Decelerate when no forward/backward keys are pressed
    currentSpeed = Math.max(0, currentSpeed - deceleration);
  }
  
  // Apply movement based on current speed and relative to camera view for more intuitive control
  if (currentSpeed > 0 || keys.a || keys.d) {
    // Get camera's horizontal rotation (y-axis)
    const cameraRotationY = Math.atan2(
      camera.position.x - playerCrab.position.x,
      camera.position.z - playerCrab.position.z
    ) + Math.PI; // Add PI to get the direction the camera is facing
    
    // Calculate movement direction based on camera orientation
    let moveX = 0;
    let moveZ = 0;
    
    // Forward/backward movement (relative to crab's facing direction)
    if (keys.w) {
      moveX += Math.sin(playerCrab.rotation.y);
      moveZ += Math.cos(playerCrab.rotation.y);
    }
    if (keys.s) {
      moveX -= Math.sin(playerCrab.rotation.y);
      moveZ -= Math.cos(playerCrab.rotation.y);
    }
    
    // Strafe left/right (perpendicular to crab's facing direction)
    if (keys.a) {
      moveX -= Math.cos(playerCrab.rotation.y);
      moveZ += Math.sin(playerCrab.rotation.y);
    }
    if (keys.d) {
      moveX += Math.cos(playerCrab.rotation.y);
      moveZ -= Math.sin(playerCrab.rotation.y);
    }
    
    // Normalize movement vector if moving diagonally to prevent faster diagonal movement
    const moveLength = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (moveLength > 0) {
      moveX = moveX / moveLength;
      moveZ = moveZ / moveLength;
      
      // Apply movement with current speed
      playerCrab.position.x += moveX * currentSpeed;
      playerCrab.position.z += moveZ * currentSpeed;
    }
  }
  
  // Handle dodge movement
  if (isDodging) {
    dodgeAnimationTime++;
    
    // Apply dodge boost in the direction of movement
    if (dodgeAnimationTime < dodgeDuration / 2) {
      let dodgeDirection = new THREE.Vector3(0, 0, 0);
      
      // Dodge in the direction of movement keys if pressed
      if (keys.w) dodgeDirection.z += 1;
      if (keys.s) dodgeDirection.z -= 1;
      if (keys.a) dodgeDirection.x -= 1;
      if (keys.d) dodgeDirection.x += 1;
      
      // If no direction keys are pressed, dodge in the direction the crab is facing
      if (dodgeDirection.length() === 0) {
        dodgeDirection.x = Math.sin(playerCrab.rotation.y);
        dodgeDirection.z = Math.cos(playerCrab.rotation.y);
      }
      
      // Normalize and apply rotation
      dodgeDirection.normalize();
      
      // Apply dodge movement
      playerCrab.position.x += dodgeDirection.x * dodgeSpeed;
      playerCrab.position.z += dodgeDirection.z * dodgeSpeed;
    }
    
    // End dodge and start cooldown
    if (dodgeAnimationTime >= dodgeDuration) {
      isDodging = false;
      dodgeAnimationTime = 0;
      dodgeCooldown = maxDodgeCooldown;
    }
  }
  
  // Update dodge cooldown
  if (dodgeCooldown > 0) {
    dodgeCooldown--;
  }
  
  // Normalize rotation to keep it between 0 and 2*PI
  playerCrab.rotation.y = (playerCrab.rotation.y + Math.PI * 2) % (Math.PI * 2);
  
  // Limit player movement to stay within the arena bounds
  const arenaHalfSize = 10;
  playerCrab.position.x = Math.max(-arenaHalfSize + 1, Math.min(arenaHalfSize - 1, playerCrab.position.x));
  playerCrab.position.z = Math.max(-arenaHalfSize + 1, Math.min(arenaHalfSize - 1, playerCrab.position.z));
}

// Function to update AI crab position to chase the player
function updateAICrabPosition() {
  // Calculate direction vector from AI to player
  const directionX = playerCrab.position.x - aiCrab.position.x;
  const directionZ = playerCrab.position.z - aiCrab.position.z;
  
  // Calculate distance between AI and player
  const distance = Math.sqrt(directionX * directionX + directionZ * directionZ);
  
  // Normalize direction vector
  const normalizedX = directionX / distance;
  const normalizedZ = directionZ / distance;
  
  // Determine AI behavior based on health
  if (aiHealth > maxHealth * 0.5) {
    // Above 50% health: Normal aggressive behavior
    // Only move if not already at the player's position
    if (distance > 0.1) {
      // Move AI crab towards player
      aiCrab.position.x += normalizedX * aiSpeed;
      aiCrab.position.z += normalizedZ * aiSpeed;
      
      // Rotate AI crab to face the direction it's moving
      aiCrab.rotation.y = Math.atan2(normalizedX, normalizedZ);
      
      // AI attack when close enough to player
      if (distance < 2 && !isAiAttacking) {
        startAiAttack();
      }
    }
  } else {
    // Below 50% health: More cautious behavior
    
    // If too close to player, back away
    if (distance < 4) {
      // Move away from player (opposite direction)
      aiCrab.position.x -= normalizedX * aiSpeed * 0.7;
      aiCrab.position.z -= normalizedZ * aiSpeed * 0.7;
      
      // Rotate AI crab to face the player even while retreating
      aiCrab.rotation.y = Math.atan2(normalizedX, normalizedZ);
    } 
    // If at medium distance, circle around the player
    else if (distance < 7) {
      // Calculate perpendicular direction for circling (rotate 90 degrees)
      const circleX = -normalizedZ;
      const circleZ = normalizedX;
      
      // Move in a circular pattern around player
      aiCrab.position.x += circleX * aiSpeed * 0.8;
      aiCrab.position.z += circleZ * aiSpeed * 0.8;
      
      // Rotate AI crab to face the player while circling
      aiCrab.rotation.y = Math.atan2(normalizedX, normalizedZ);
      
      // Occasionally attack if player is in range
      if (distance < 3 && !isAiAttacking && Math.random() < 0.02) {
        startAiAttack();
      }
    }
    // If far away, approach cautiously
    else {
      // Move towards player but slower
      aiCrab.position.x += normalizedX * aiSpeed * 0.5;
      aiCrab.position.z += normalizedZ * aiSpeed * 0.5;
      
      // Rotate AI crab to face the direction it's moving
      aiCrab.rotation.y = Math.atan2(normalizedX, normalizedZ);
    }
  }
  
  // Limit AI movement to stay within the arena bounds
  const arenaHalfSize = 10;
  aiCrab.position.x = Math.max(-arenaHalfSize + 1, Math.min(arenaHalfSize - 1, aiCrab.position.x));
  aiCrab.position.z = Math.max(-arenaHalfSize + 1, Math.min(arenaHalfSize - 1, aiCrab.position.z));
}

// AI attack variables
let isAiAttacking = false;
let aiAttackAnimationTime = 0;

// Function to start AI attack
function startAiAttack() {
  isAiAttacking = true;
  aiAttackAnimationTime = 0;
}

// Function to handle AI attack animation and collision
function updateAiAttack() {
  if (isAiAttacking) {
    aiAttackAnimationTime++;
    
    // Calculate animation progress (0 to 1)
    const progress = aiAttackAnimationTime / attackDuration;
    
    if (progress <= 0.5) {
      // First half of animation - swing claws forward
      const angle = progress * Math.PI / 2; // 0 to 90 degrees
      aiLeftClaw.rotation.y = -angle;
      aiRightClaw.rotation.y = angle;
    } else if (progress <= 1) {
      // Second half of animation - return claws to original position
      const angle = (1 - progress) * Math.PI / 2; // 90 to 0 degrees
      aiLeftClaw.rotation.y = -angle;
      aiRightClaw.rotation.y = angle;
    }
    
    // Check for collision at peak of attack
    if (aiAttackAnimationTime === attackDuration / 2) {
      // Calculate distance between crabs
      const dx = playerCrab.position.x - aiCrab.position.x;
      const dz = playerCrab.position.z - aiCrab.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      // If crabs are close enough, AI damages player
      if (distance < 2.5) {
        playerHealth = Math.max(0, playerHealth - damageAmount);
        updateHealthBars();
      }
    }
    
    // End the attack animation
    if (aiAttackAnimationTime >= attackDuration) {
      isAiAttacking = false;
      aiAttackAnimationTime = 0;
      aiLeftClaw.rotation.y = 0;
      aiRightClaw.rotation.y = 0;
    }
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
  
  // Only update game logic if the game has started
  if (gameStarted) {
    // Update player position based on key presses
    updatePlayerPosition()
    
    // Update AI crab position to chase the player
    updateAICrabPosition()
  }
  
  // Update camera position for third-person view
  // Calculate the desired camera position based on player's position and rotation
  const cameraTargetPosition = new THREE.Vector3();
  // Create a rotated offset based on the player's current rotation
  cameraOffset.set(0, 3, -5); // Reset to original offset (negative Z to be behind)
  // Apply player rotation to the camera offset
  cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), playerCrab.rotation.y);
  // Add the rotated offset to the player's position
  cameraTargetPosition.copy(playerCrab.position).add(cameraOffset);
  
  // Smoothly interpolate camera position
  camera.position.lerp(cameraTargetPosition, 0.1);
  
  // Make camera look at the player
  camera.lookAt(playerCrab.position);
  
  // Handle player basic attack animation
  if (isAttacking) {
    attackAnimationTime++;
    
    // Calculate animation progress (0 to 1)
    const progress = attackAnimationTime / attackDuration;
    
    if (progress <= 0.5) {
      // First half of animation - swing claws forward
      const angle = progress * Math.PI / 2; // 0 to 90 degrees
      leftClaw.rotation.y = -angle * 1.2; // Slightly more aggressive angle
      rightClaw.rotation.y = angle * 1.2;
    } else if (progress <= 1) {
      // Second half of animation - return claws to original position
      const angle = (1 - progress) * Math.PI / 2; // 90 to 0 degrees
      leftClaw.rotation.y = -angle * 1.2;
      rightClaw.rotation.y = angle * 1.2;
    }
    
    // End the attack animation
    if (attackAnimationTime >= attackDuration) {
      isAttacking = false;
      attackAnimationTime = 0;
      leftClaw.rotation.y = 0;
      rightClaw.rotation.y = 0;
    }
  }
  
  // Handle player heavy attack animation
  if (isHeavyAttacking) {
    heavyAttackAnimationTime++;
    
    // Calculate animation progress (0 to 1)
    const progress = heavyAttackAnimationTime / heavyAttackDuration;
    
    if (progress <= 0.3) {
      // Wind up phase - pull claws back
      const angle = progress * Math.PI / 3; // 0 to 60 degrees
      leftClaw.rotation.y = angle;
      rightClaw.rotation.y = -angle;
    } else if (progress <= 0.6) {
      // Strike phase - swing claws forward quickly
      const strikeProgress = (progress - 0.3) / 0.3;
      const angle = Math.PI / 3 - strikeProgress * Math.PI; // 60 to -120 degrees
      leftClaw.rotation.y = angle;
      rightClaw.rotation.y = -angle;
    } else {
      // Recovery phase - return to neutral
      const recoveryProgress = (progress - 0.6) / 0.4;
      const angle = -Math.PI * 2/3 + recoveryProgress * Math.PI * 2/3; // -120 to 0 degrees
      leftClaw.rotation.y = angle;
      rightClaw.rotation.y = -angle;
    }
    
    // End the heavy attack animation
    if (heavyAttackAnimationTime >= heavyAttackDuration) {
      isHeavyAttacking = false;
      heavyAttackAnimationTime = 0;
      leftClaw.rotation.y = 0;
      rightClaw.rotation.y = 0;
    }
  }
  
  // Handle AI attack animation
  updateAiAttack();
  
  // Check for player attack collision with AI
  checkAttackCollision();
  
  // Check if AI crab needs to respawn
  if (aiHealth <= 0) {
    respawnAiCrab();
  }
  
  // Render the scene with the camera
  renderer.render(scene, camera)
}

// Start the animation loop
animate()
