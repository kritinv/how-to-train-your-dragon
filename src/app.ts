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
import startScreenContent from '../istartscreen.html';

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
// NUMBER 1: variables for game's finite state machine
let gameOver = false;
let gamePaused = false;
let gameRunning = false;
let gameStart = true;
// NUMBER 1.5: enum for the types of collisions. import this from SeedScene.ts
const Collisions = {
    Obstacle: 'obstacle'
};
// NUMBER 1.6: other variables for keeping track of state
let healthCount = 3;
let gameStartTime: any = null;
let gameEndTime: any = null;
let gamePauseStart: any = null;
let elapsedTime = 0;
let pausedTime = 0;
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
    // setTimeout(function() {}, 100000);
    movementHandlerHasLock = false;
    window.requestAnimationFrame(onAnimationMovementHandler);
};
window.requestAnimationFrame(onAnimationMovementHandler);
document.addEventListener('keydown', function (event) {
    while(movementHandlerHasLock) {};
    eventListenerHasLock = true;
    if (event.repeat) return;
    if (gameRunning) {
        // setTimeout(function() {}, 100000);
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
            // important!!! need to keep track of time
            gameStartTime = Date.now();
        } else if (gameRunning) {
            gameRunning = false;
            gamePaused = true;
            htmlGamePaused();
            // important!!! need to keep track of time
            gamePauseStart = Date.now();
        } else if (gamePaused) {
            gamePaused = false;
            gameRunning = true;
            htmlGameRunning();
            // important!!! need to keep track of time
            pausedTime += (Date.now() - gamePauseStart);
            gamePauseStart = null;
        } else if (gameOver) { }
    }
    eventListenerHasLock = false;
});
// NUMBER 3: game updates on a regular interval
const onAnimationUpdateHandler = (timeStamp: number) => {
    // setTimeout(function() {}, 1000000);
    if (gameRunning) {
        // scene.update will bring all nontoothless scene objects forwards
        scene.update && scene.update(timeStamp-pausedTime);
        // game updates based on whether there was a collision
        let collision = scene.getCollision();
        let collisionType = collision[0];
        if (collisionType === Collisions.Obstacle) {
            if (healthCount <= 1) {
                healthCount -= 1;
                htmlGameOver();
                gameRunning = false;
                gameOver = true;
            } else {
                healthCount -= 1;
                htmlUpdateHeart();
            }
        }
    }
    controls.update();
    window.requestAnimationFrame(onAnimationUpdateHandler);
};
window.requestAnimationFrame(onAnimationUpdateHandler);
// Number 3.4: Game updates score on a regular interval
const onAnimationScoreHandler = () => {
    // setTimeout(function() {}, 10000);
    if (gameRunning) htmlUpdateScore();
    window.requestAnimationFrame(onAnimationScoreHandler);
};
window.requestAnimationFrame(onAnimationScoreHandler);
// Number 3.5: Game renders on a regular interval
const onAnimationFrameHandler = () => {
    // setTimeout(function() {}, 10000);
    renderer.render(scene, camera);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);
// NUMBER 4: helper functions: update HTML based on changed game state
function htmlGameStart() {
    let startScreen = document.createElement('div');
    startScreen.id = 'startScreen';
    startScreen.innerHTML = startScreenContent;
    document.body.appendChild(startScreen);
    let greywash = document.getElementById('greywash');
    greywash.style.visibility = 'visible';
    let start = document.getElementById('start');
    start.style.visibility = 'visible';
    let paused = document.getElementById('paused');
    paused.style.visibility = 'hidden';
}
function htmlGameRunning() {
    let greywash = document.getElementById('greywash');
    greywash.style.visibility = 'hidden';
    let start = document.getElementById('start');
    start.style.visibility = 'hidden';
    let paused = document.getElementById('paused');
    paused.style.visibility = 'hidden';
    let threeheart = document.getElementById('threeheart');
    let twoheart = document.getElementById('threeheart');
    let oneheart = document.getElementById('threeheart');
    if (healthCount == 3) threeheart.style.visibility = 'visible';
    else if (healthCount == 2) twoheart.style.visibility = 'visible';
    else if (healthCount == 1) oneheart.style.visibility = 'visible';
}
function htmlGamePaused() {
    let greywash = document.getElementById('greywash');
    greywash.style.visibility = 'visible';
    let start = document.getElementById('start');
    start.style.visibility = 'hidden';
    let paused = document.getElementById('paused');
    paused.style.visibility = 'visible';
}
function htmlGameOver() {
    console.log("im in here");
    console.log(`${healthCount}`);
    let threeheart = document.getElementById('threeheart');
    let twoheart = document.getElementById('twoheart');
    let oneheart = document.getElementById('oneheart');
    threeheart.style.visibility = 'hidden';
    twoheart.style.visibility = 'hidden';
    oneheart.style.visibility = 'hidden';
    let gameover = document.getElementById('gameover');
    gameover.style.visibility = 'visible';
}
function htmlUpdateScore() {
    let score = document.getElementById('score');
    score.innerHTML = `Score: ${Math.floor((Date.now() - gameStartTime - pausedTime) / 1000)}`;
}
function htmlUpdateHeart() {
    if (healthCount == 3) { 
        threeheart.style.visibility = 'visible';
        twoheart.style.visibility = 'hidden';
        oneheart.style.visibility = 'hidden';
    }
    else if (healthCount == 2) {
        threeheart.style.visibility = 'hidden';
        twoheart.style.visibility = 'visible';
        oneheart.style.visibility = 'hidden';
    }
    else if (healthCount == 1) {
        threeheart.style.visibility = 'hidden';
        twoheart.style.visibility = 'hidden';
        oneheart.style.visibility = 'visible'; 
    }
    else {
        threeheart.style.visibility = 'hidden';
        twoheart.style.visibility = 'hidden';
        oneheart.style.visibility = 'hidden'; 
    }
}
// setup html rendering process
// START: toothless appearance delay hack solution
async function delay(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function example() {
    await delay(1000);
    htmlGameStart();
    document.body.appendChild(canvas);
}
example();
// END: toothless appearance delay hack solution
// !!! END OF EXCLUSIVELY STUDENT CONTRIBUTION SECTION - Jason !!!

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