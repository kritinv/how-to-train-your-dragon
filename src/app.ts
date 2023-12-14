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
// import startScreenContent from '../istartscreen.html';

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
controls.enabled = false;
controls.update();

// !!! START OF EXCLUSIVELY STUDENT CONTRIBUTION SECTION - Jason !!!
// NUMBER 0: add audio functionality to the game
let listener = new THREE.AudioListener();
camera.add(listener);
let sounds: any = [];
let audioLoader = new THREE.AudioLoader();
// add wind sound component
let wind = new THREE.Audio(listener);
sounds['wind'] = wind;
audioLoader.load(
    'https://raw.githubusercontent.com/kritinv/how-to-train-your-dragon/main/src/sounds/wind.wav',
    function (buffer) {
        wind.setBuffer(buffer);
        wind.setLoop(false);
        wind.setVolume(1.0);
    }
);
// add punch sound component
let punch = new THREE.Audio(listener);
sounds['punch'] = punch;
audioLoader.load(
    'https://raw.githubusercontent.com/kritinv/how-to-train-your-dragon/main/src/sounds/punch.wav',
    function (buffer) {
        punch.setBuffer(buffer);
        punch.setLoop(false);
        punch.setVolume(1.0);
    }
);
// add punch sound component
let sparkle = new THREE.Audio(listener);
sounds['sparkle'] = sparkle;
audioLoader.load(
    'https://raw.githubusercontent.com/kritinv/how-to-train-your-dragon/main/src/sounds/sparkle.wav',
    function (buffer) {
        sparkle.setBuffer(buffer);
        sparkle.setLoop(false);
        sparkle.setVolume(1.0);
    }
);
// add desertwind sound component
let desertwind = new THREE.Audio(listener);
sounds['desertwind'] = desertwind;
audioLoader.load(
    'https://raw.githubusercontent.com/kritinv/how-to-train-your-dragon/main/src/sounds/desertwind.wav',
    function (buffer) {
        desertwind.setBuffer(buffer);
        desertwind.setLoop(true);
        desertwind.setVolume(0.3);
    }
);
// add testdrive sound component
let testdrive = new THREE.Audio(listener);
sounds['testdrive'] = testdrive;
audioLoader.load(
    'https://raw.githubusercontent.com/kritinv/how-to-train-your-dragon/main/src/sounds/testdrive.wav',
    function (buffer) {
        testdrive.setBuffer(buffer);
        testdrive.setLoop(true);
        testdrive.setVolume(0.25);
    }
);

// NUMBER 1: variables for game's finite state machine
let gameOver = false;
let gamePaused = false;
let gameRunning = false;
let gameStart = true;
// NUMBER 1.5: enum for the types of collisions. import this from SeedScene.ts
const Collisions = {
    Obstacle: 'obstacle',
    Powerup: 'powerup',
};
// NUMBER 1.6: other variables for keeping track of state
let healthCount = 3;
let gameStartTime: any = null;
// let gameEndTime: any = null;
let gamePauseStart: any = null;
// let elapsedTime = 0;
let pausedTime = 0;
// NUMBER 2: game responds to player keyboard input
// let doublePressThreshold = 200;
// let keyDownTime: any = null;
// let singlePress: any = null;
/*
const onAnimationMovementHandler = (timeStamp: number) => {
    if (gameRunning) {
        if (Date.now() - keyDownTime >= doublePressThreshold) {
            if (singlePress === 'ArrowLeft') {
                scene.queueMoveLeft(sounds);
                singlePress = null;
            }
            if (singlePress === 'ArrowRight') {
                scene.queueMoveRight(sounds);
                singlePress = null;
            }
        }
    }
    // setTimeout(function() {}, 100000);
    window.requestAnimationFrame(onAnimationMovementHandler);
};
window.requestAnimationFrame(onAnimationMovementHandler);
*/
document.addEventListener('keydown', function (event) {
    if (event.repeat) return;
    if (gameRunning) {
        // setTimeout(function() {}, 100000);
        if (event.key === 'ArrowLeft') {
            scene.queueMoveLeft(sounds);
            /*
            if (singlePress === 'ArrowLeft') {
                scene.queueDoubleMoveLeft(sounds);
                singlePress = null;
            } else if (singlePress === 'ArrowRight') {
                scene.queueMoveRight(sounds);
                singlePress = 'ArrowLeft';
            } else {
                keyDownTime = Date.now();
                singlePress = 'ArrowLeft';
            }
            */
        } else if (event.key === 'ArrowRight') {
            scene.queueMoveRight(sounds);
            /*
            if (singlePress === 'ArrowRight') {
                scene.queueDoubleMoveRight(sounds);
                singlePress = null;
            } else if (singlePress === 'ArrowLeft') {
                scene.queueMoveLeft(sounds);
                singlePress = 'ArrowRight';
            } else {
                keyDownTime = Date.now();
                singlePress = 'ArrowRight';
            }
            */
        } else if (event.key === 'ArrowUp') {
            scene.queueDoubleMoveRight(sounds);
        } else if (event.key === 'ArrowDown') {
            scene.queueDoubleMoveLeft(sounds);
        } else if (event.key === 's') {
            scene.queueSpinMove(sounds);
        }
    }
    if (event.key === ' ') {
        if (gameStart) {
            gameStart = false;
            gameRunning = true;
            sounds['desertwind'].play();
            sounds['testdrive'].play();
            htmlGameRunning();
            // important!!! need to keep track of time
            gameStartTime = Date.now();
        } else if (gameRunning) {
            gameRunning = false;
            gamePaused = true;
            sounds['desertwind'].pause();
            sounds['testdrive'].pause();
            sounds['wind'].stop();
            htmlGamePaused();
            // important!!! need to keep track of time
            gamePauseStart = Date.now();
        } else if (gamePaused) {
            gamePaused = false;
            gameRunning = true;
            sounds['desertwind'].play();
            sounds['testdrive'].play();
            htmlGameRunning();
            // important!!! need to keep track of time
            pausedTime += Date.now() - gamePauseStart;
            gamePauseStart = null;
        } else if (gameOver) {
            sounds['desertwind'].stop();
            sounds['testdrive'].stop();
        }
    }
});
// NUMBER 3: game updates on a regular interval
const onAnimationUpdateHandler = (timeStamp: number) => {
    // setTimeout(function() {}, 1000000);
    if (gameRunning) {
        // scene.update will bring all nontoothless scene objects forwards
        scene.update && scene.update(timeStamp - pausedTime);
        // game updates based on whether there was a collision
        let collision = scene.getCollision();
        let collisionType = collision[0];
        if (collisionType === Collisions.Obstacle) {
            sounds['punch'].play();
            if (healthCount <= 1) {
                healthCount -= 1;
                htmlGameOver();
                gameRunning = false;
                gameOver = true;
                sounds['desertwind'].stop();
                sounds['testdrive'].stop();
            } else {
                healthCount -= 1;
                scene.queueCollide();
                htmlUpdateHeart();
            }
        } else if (collisionType === Collisions.Powerup) {
            sounds['sparkle'].play();
            if (healthCount <= 2) {
                healthCount += 1;
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
    startScreen.innerHTML = '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Inline Style in Head</title><linkrel="stylesheet"href="https://fonts.googleapis.com/css2?family=Tisa+Sans:wght@400&display=swap"/><style>body {font-family: "Tisa Sans", sans-serif;font-size: 12px;}#greywash {position: absolute;top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, 0.65);z-index: 1;isibility: visible;}#title {font-size: 2.25em;position: absolute;left: 2%;z-index: 2;color: rgba(0, 0, 0, 0.75);}#credits {font-size: 1.25em;position: absolute;left: 2%;top: 9%;z-index: 2;color: rgba(0, 0, 0, 0.75);}#instructions {font-size: 1.25em;position: absolute;left: 2%;top: 13%;z-index: 2;color: rgba(0, 0, 0, 0.75);}#start,#paused,#gameover {font-size: 2em;position: absolute;top: 20%;left: 50%;text-align: center;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);z-index: 2;color: rgba(0, 0, 0, 0.75);}#score {font-size: 2.25em;position: absolute;right: 2%;z-index: 2;color: rgba(0, 0, 0, 0.75);}#start {visibility: hidden;}#paused {visibility: visible;}#gameover {visibility: hidden;}#oneheart {position: absolute;bottom: 10%;left: 45.5%;}#twoheart,#threeheart {position: absolute;display: flex;}.heart {width: 60px;height: auto;margin-right: 30px;}#oneheart {visibility: hidden;bottom: 10%;left: 47.0%;}#twoheart {visibility: hidden;bottom: 10%;left: 42.5%;}#threeheart {visibility: hidden;bottom: 10%;left: 38.5%;}</style></head><body><div id="greywash"></div><p id="title">Fury Rush</p><p id="credits">made with love by: Mila, Bomb, Ketya, Jason</p><p id="instructions"><b>Instructions:</b> <br />use &#8594; &#8593; &#8595; &#8592; to move Toothless <br />use &#8594;&#8594; and &#8592;&#8592; to move quickly <br />use s to make Toothless do a spin move  <br />press spacebar to pause/resume</p><div id="start"><b>Press SPACEBAR to Start</b></div><div id="paused"><b>Game Paused</b></div><div id="gameover"><b>Game Over</b> <br/><p style="font-size: 16px;">Press &lt;Ctrl-r&gt; / &lt;Cmd-r&gt; to Restart</p></div><p id="score">Score: 0</p><div id="oneheart"><img class="heart" src="./heart.png" /></div><div id="twoheart"><img class="heart" src="./heart.png" /><img class="heart" src="./heart.png" /></div><div id="threeheart"><img class="heart" src="./heart.png" /><img class="heart" src="./heart.png" /><img class="heart" src="./heart.png" /></div></body></html>';
    document.body.appendChild(startScreen);
    let greywash = document.getElementById('greywash') || null;
    if (greywash !== null) greywash.style.visibility = 'visible';
    let start = document.getElementById('start');
    if (start !== null) start.style.visibility = 'visible';
    let paused = document.getElementById('paused');
    if (paused !== null) paused.style.visibility = 'hidden';
}
function htmlGameRunning() {
    let greywash = document.getElementById('greywash');
    if (greywash !== null) greywash.style.visibility = 'hidden';
    let start = document.getElementById('start');
    if (start !== null) start.style.visibility = 'hidden';
    let paused = document.getElementById('paused');
    if (paused !== null) paused.style.visibility = 'hidden';
    let threeheart = document.getElementById('threeheart');
    let twoheart = document.getElementById('twoheart');
    let oneheart = document.getElementById('oneheart');
    if (threeheart !== null) {if (healthCount == 3) threeheart.style.visibility = 'visible';}
    else if (healthCount == 2) {if (twoheart !== null) twoheart.style.visibility = 'visible';}
    else if (healthCount == 1) {if (oneheart !== null) oneheart.style.visibility = 'visible';}
}
function htmlGamePaused() {
    let greywash = document.getElementById('greywash');
    if (greywash !== null) greywash.style.visibility = 'visible';
    let start = document.getElementById('start');
    if (start !== null) start.style.visibility = 'hidden';
    let paused = document.getElementById('paused');
    if (paused !== null) paused.style.visibility = 'visible';
}
function htmlGameOver() {
    console.log('im in here');
    console.log(`${healthCount}`);
    let threeheart = document.getElementById('threeheart');
    let twoheart = document.getElementById('twoheart');
    let oneheart = document.getElementById('oneheart');
    if (threeheart !== null) threeheart.style.visibility = 'hidden';
    if (twoheart !== null) twoheart.style.visibility = 'hidden';
    if (oneheart !== null) oneheart.style.visibility = 'hidden';
    let gameover = document.getElementById('gameover');
    if (gameover !== null) gameover.style.visibility = 'visible';
    let greywash = document.getElementById('greywash');
    if (greywash !== null) greywash.style.visibility = 'visible';
}
function htmlUpdateScore() {
    let score = document.getElementById('score');
    if (score != null) score.innerHTML = `Score: ${Math.floor(
        (Date.now() - gameStartTime - pausedTime) / 1000
    )}`;
}
function htmlUpdateHeart() {
    let threeheart = document.getElementById('threeheart');
    let twoheart = document.getElementById('twoheart');
    let oneheart = document.getElementById('oneheart');
    if (healthCount == 3) {
        if (threeheart !== null) threeheart.style.visibility = 'visible';
        if (twoheart !== null) twoheart.style.visibility = 'hidden';
        if (oneheart !== null) oneheart.style.visibility = 'hidden';
    } else if (healthCount == 2) {
        if (threeheart !== null) threeheart.style.visibility = 'hidden';
        if (twoheart !== null) twoheart.style.visibility = 'visible';
        if (oneheart !== null) oneheart.style.visibility = 'hidden';
    } else if (healthCount == 1) {
        if (threeheart !== null) threeheart.style.visibility = 'hidden';
        if (twoheart !== null) twoheart.style.visibility = 'hidden';
        if (oneheart !== null) oneheart.style.visibility = 'visible';
    } else {
        if (threeheart !== null) threeheart.style.visibility = 'hidden';
        if (twoheart !== null) twoheart.style.visibility = 'hidden';
        if (oneheart !== null) oneheart.style.visibility = 'hidden';
    }
}
// setup html rendering process
// START: toothless appearance delay hack solution
async function delay(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function example() {
    await delay(5000);
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
