import * as Dat from 'dat.gui';
import { Scene, Vector3, Fog, Group, Box3, Mesh } from 'three';
import sky from '../scenes/Sky';
import BasicLights from '../lights/BasicLights';
import Toothless from '../objects/Toothless/Toothless';
import Balloon from '../objects/Balloon/Balloon';
import Island from '../objects/Floating Island/Island';
import Cloud from '../objects/Clouds/Clouds';
import Heart from '../objects/Heart/Heart';
import Collisions from '../app';

// Define an object type which describes each object in the update list
type UpdateChild = Group & {
    // Each object *might* contain an update function
    update?: (timeStamp: number) => void;
    outOfFrame?: () => Boolean;
};

class SeedScene extends Scene {
    // Define the type of the state field
    character:Toothless;
    state: {
        updateList: UpdateChild[];
        objectsToRemove: UpdateChild[];
        start_time: number;
        lanes: number[];
        lastIslandTime: number;
        islandSpawnInterval: number;
    };

    constructor() {
        console.log("loading scene");
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            updateList: [],
            start_time: Date.now(),
            lanes: [-24, -12, 0, 12, 24],
            lastIslandTime: 0,
            islandSpawnInterval: 3000,
            objectsToRemove: [],
        };

        // Add lights to scene
        const lights = new BasicLights();

        // Add toothless scene
        const toothless = new Toothless();
        this.character = toothless;
        toothless.position.set(0, -3, 3);
        const balloon = new Balloon();
        balloon.position.set(0, -10, 10);
        const balloonScale = 0.0006;
        balloon.scale.copy(
            new Vector3(balloonScale, balloonScale, balloonScale)
        );

        // Add heart to scene
        const heart = new Heart();
        heart.position.set(0, 0, 0);

        // Add objects to scenecloud1
        this.add(toothless);
        this.add(sky, Cloud, lights);
        this.fog = new Fog(0xa8928e, 300, 500);
        this.addToUpdateList(toothless);

        this.setupKeyHandlers(toothless);
    }

    setupKeyHandlers(object: Toothless) {
        let keyDownTime: number | null = null;
        const quickPressThreshold = 200; // milliseconds

        window.addEventListener('keydown', (event) => {
            if (event.repeat) return; // ignore repeated keydown events

            keyDownTime = Date.now();
            // ... other keys
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft' && keyDownTime != null) {
                const keyPressDuration = Date.now() - keyDownTime;
                keyDownTime = null;

                if (keyPressDuration < quickPressThreshold) {
                    console.log('moveleft');
                    object.moveLeft();
                } else {
                    console.log('doubleMoveLeft');
                    object.doubleMoveLeft(); // Call the method for longer press
                }
            }

            if (event.key === 'ArrowRight' && keyDownTime != null) {
                const keyPressDuration = Date.now() - keyDownTime;
                keyDownTime = null;

                if (keyPressDuration < quickPressThreshold) {
                    console.log('moveRight');
                    object.moveRight();
                } else {
                    console.log('doubleMoveRight');
                    object.doubleMoveRight(); // Call the method for longer press
                }
            }

            if (event.key === 'ArrowDown') {
                keyDownTime = null;
                console.log('spinmove');
                object.spinMove();
            }
            // ... handling for other keys and stopping movement
        });
    }

    spawnIsland(zPosition: number, timeStamp: number): void {
        const island = new Island(timeStamp);
        const i = Math.floor(Math.random() * this.state.lanes.length);
        island.position.set(this.state.lanes[i], 0, zPosition);
        this.addToUpdateList(island);
        this.add(island);
    }

    addToUpdateList(object: UpdateChild): void {
        this.state.updateList.push(object);
    }

    // Method to remove an object from the updateList
    removeFromUpdateList(objectToRemove: UpdateChild): void {
        const { updateList } = this.state;
        const index = updateList.indexOf(objectToRemove);
        if (index !== -1) {
            updateList.splice(index, 1);
        }
        this.remove(objectToRemove);
    }

    update(timeStamp: number): void {
        console.log('hi');
        // Update clouds
        let time_elapsed = Date.now() - this.state.start_time;
        Cloud.position.z = (-(time_elapsed * 0.3) % 8000) + 8000;

        // Call update for each object in the updateList
        const { updateList } = this.state;
        for (const obj of updateList) {
            if (obj.update !== undefined) {
                obj.update(timeStamp);
            }

            // Check if the object is out of frame
            if (obj.outOfFrame !== undefined) {
                if (obj.outOfFrame()) {
                    this.removeFromUpdateList(obj);
                }
            }
        }

        if (
            time_elapsed >=
            this.state.islandSpawnInterval + this.state.lastIslandTime
        ) {
            this.state.lastIslandTime = time_elapsed;
            this.spawnIsland(500, timeStamp);
        }
    }

    queueMoveLeft() {
        this.character.moveLeft();
    }
    queueDoubleMoveLeft() {
        this.character.doubleMoveLeft();
    }
    queueMoveRight() {
        this.character.moveRight();
    }
    queueDoubleMoveRight() {
        this.character.doubleMoveRight();
    }
    queueMoveUp() {
        this.character.moveUp();
    }
    queueMoveDown() {
        this.character.moveDown();
    }
    getCollision() {
        return [Collisions.Obstacle, null];
    }// return list [collisionType, reference to collision object]

    // deleteObject()
}


export default SeedScene;
