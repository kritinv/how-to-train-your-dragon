/**
 * app.ts
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SeedScene from './scenes/SeedScene';
import * as THREE from 'three';

import healthBarContent from '../ihealthbar.html';
import startScreenContent from '../istartscreen.html';
import iendScreenContent from '../iendscreen.html';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);
const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
});

// Set up camera
camera.position.set(0, 20, -80);
camera.lookAt(new Vector3(0, -10, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = '0'; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
// controls.enabled = false;
controls.update();

// !!! START OF EXCLUSIVELY STUDENT CONTRIBUTION SECTION - Jason !!!
// setup html rendering process
htmlGameStart();
document.body.appendChild(canvas);
// NUMBER 1: variables for game's finite state machine
let gameOver = false;
let gamePaused = false;
let gameRunning = false;
let gameStart = true;
// NUMBER 1.5: enum for the types of collisions. import this from SeedScene.ts
const Collisions = {
    Obstacle: 'obstacle'
};
// NUMBER 1.6: variables for toothless's state
let healthCount = 3;
// NUMBER 2: game responds to player keyboard input
let doublePressThreshold = 200;
let keyDownTime: any = null;
let singlePress: any = null;
let eventListenerHasLock = false;
let movementHandlerHasLock = false;
const onAnimationMovementHandler = (timeStamp: number) => {
    while(eventListenerHasLock) {};
    movementHandlerHasLock = true;
    if (gameRunning) {
        if (Date.now() - keyDownTime >= doublePressThreshold) {
            if (singlePress === 'ArrowLeft') {scene.queueMoveLeft(); singlePress = null;}
            if (singlePress === 'ArrowRight') {scene.queueMoveRight(); singlePress = null;}
        }
    }
    setTimeout(function() {}, 100000);
    movementHandlerHasLock = false;
    window.requestAnimationFrame(onAnimationMovementHandler);
};
window.requestAnimationFrame(onAnimationMovementHandler);
document.addEventListener('keydown', function (event) {
    while(movementHandlerHasLock) {};
    eventListenerHasLock = true;
    if (event.repeat) return;
    if (gameRunning) {
        setTimeout(function() {}, 100000);
        if (event.key === 'ArrowLeft') {
            if (singlePress === 'ArrowLeft') {scene.queueDoubleMoveLeft(); singlePress = null;}
            else if (singlePress === 'ArrowRight') {scene.queueMoveRight(); singlePress = 'ArrowLeft'}
            else {keyDownTime = Date.now(); singlePress = 'ArrowLeft'}
        } else if (event.key === 'ArrowRight') {
            if (singlePress === 'ArrowRight') {scene.queueDoubleMoveRight(); singlePress = null;}
            else if (singlePress === 'ArrowLeft') {scene.queueMoveLeft(); singlePress = "ArrowRight"}
            else {keyDownTime = Date.now(); singlePress = 'ArrowRight'}
        } else if (event.key === 'ArrowUp') {
            scene.queueMoveUp();
        } else if (event.key === 'ArrowDown') {
            scene.queueMoveDown();
        }
    } 
    if (event.key === ' ') {
        if (gameStart) {
            gameStart = false;
            gameRunning = true;
            htmlGameRunning();
        } else if (gameRunning) {
            gameRunning = false;
            gamePaused = true;
            htmlGamePaused();
        } else if (gamePaused) {
            gamePaused = false;
            gameRunning = true;
            htmlGameRunning();
        } else if (gameOver) {
            gameOver = false;
            gameStart = true;
            htmlGameStart();
        }
    }
    eventListenerHasLock = false;
});
// NUMBER 3: game updates on a regular interval
const onAnimationUpdateHandler = (timeStamp: number) => {
    if (gameRunning) {
        // scene.update will bring all nontoothless scene objects forwards
        scene.update && scene.update(timeStamp);
        // game updates based on whether there was a collision
        let collision = scene.getCollision();
        let collisionType = collision[0];
        let collisionObject = collision[1];
        if (collisionType === Collisions.Obstacle) {
            gameRunning = false;
            gameOver = true;
            htmlGameOver();
        }
    }
    window.requestAnimationFrame(onAnimationUpdateHandler);
};
window.requestAnimationFrame(onAnimationUpdateHandler);
// NUMBER 4: helper functions: update HTML based on changed game state
function htmlGameStart() {
    let healthBar = document.createElement('div');
    healthBar.id = 'healthBar';
    healthBar.innerHTML = healthBarContent;
    document.body.appendChild(healthBar);
}
function htmlGameRunning() {}
function htmlGamePaused() {}
function htmlGameOver() {}
// !!! END OF EXCLUSIVELY STUDENT CONTRIBUTION SECTION - Jason !!!

// Render loop
const onAnimationFrameHandler = (timeStamp: number) => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

export default Collisions;