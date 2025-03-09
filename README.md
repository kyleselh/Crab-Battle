# Crab Fight Game

A 3D browser-based game where you control a crab to fight AI crabs in an arena.

## Project Overview

This is a single-player, arcade-style 3D game built with Three.js and Vite. The game features:
- A 3D arena with a sandy texture
- A player-controlled crab (currently represented by a red box)
- AI opponent crabs (currently represented by blue boxes)

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone this repository or download the source code
2. Navigate to the project directory in your terminal
3. Install dependencies:

```bash
npm install
```

### Running the Game

To start the development server with hot reloading:

```bash
npm run dev
```

This will start the game on `http://localhost:5173` (or another port if 5173 is in use). Open this URL in your browser to play the game.

## How to Play

Use the following controls to move your crab (red box) around the arena:

- `W` - Move forward
- `A` - Move left
- `S` - Move backward
- `D` - Move right

The goal is to navigate around the arena and eventually fight the AI crabs (blue boxes).

## Project Structure

- `index.html`: Main HTML file with the canvas element for rendering
- `src/main.js`: Main JavaScript file containing the Three.js setup and game logic
- `src/style.css`: CSS styles for the game

## Current Features

- Basic 3D scene rendering with Three.js
- Simple arena (flat plane with sandy color)
- Placeholder models for player and AI crabs
- Basic lighting setup
- Responsive design (adapts to window size)
- Player movement controls (WASD keys)

## Future Development

- Replace placeholder models with actual 3D crab models
- Add attack mechanics
- Implement AI behavior for opponent crabs
- Add health system and combat mechanics
- Add sound effects and background music
- Add UI elements (health bars, score, etc.)

## Deployment

This project can be deployed to free hosting platforms like Netlify or GitHub Pages.

## License

This project is open source and available for personal use.