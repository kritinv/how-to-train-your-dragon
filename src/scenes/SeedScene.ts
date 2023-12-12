import * as Dat from 'dat.gui';
import { Scene, Vector3, Fog, Group, Box3, Mesh } from 'three';
import sky from '../scenes/Sky';
import BasicLights from '../lights/BasicLights';
import Toothless from '../objects/Toothless/Toothless';
import Balloon from '../objects/Balloon/Balloon';
import Island from '../objects/Floating Island/Island';
import { cloud, updateCloud } from '../objects/Clouds/Clouds';
import Heart from '../objects/Heart/Heart';
import Obstacles from '../scenes/Obstacles';
import Collisions from '../app';

// Define an object type which describes each object in the update list
type UpdateChild = Group & {
    // Each object *might* contain an update function
    update?: (timeStamp: number) => void;
    outOfFrame?: () => Boolean;
};

class SeedScene extends Scene {
    // Define the type of the state field
    character: Toothless
    state: {
        updateList: UpdateChild[];
        objectsToRemove: UpdateChild[];
        start_time: number;
        lanes: number[];
        lastIslandTime: number;
        islandSpawnInterval: number;
        obstacles: Obstacles;
    };

    constructor() {
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
            obstacles: new Obstacles(),
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
        this.add(sky, cloud, lights);
        this.fog = new Fog(0xa8928e, 300, 500);
        this.addToUpdateList(toothless);
    }

    spawnRandom(zPosition: number, timeStamp: number): void {
        // const island = this.state.obstacles.getRandomObstacle(timeStamp).clone();
        const object = this.chooseRandomObject(timeStamp);
        const i = Math.floor(Math.random() * this.state.lanes.length);
        object.position.set(this.state.lanes[i], 0, zPosition);
        this.addToUpdateList(object);
        this.add(object);
    }

    chooseRandomObject(timeStamp: number) {
        const baloon = new Balloon(timeStamp);
        const island = new Island(timeStamp);
        const randomIndex = Math.floor(Math.random() * 1000);
        if (randomIndex > 500) {
            return baloon;
        }
        console.log(island)
        return island;
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
        // Update clouds
        let time_elapsed = Date.now() - this.state.start_time;
        updateCloud(time_elapsed);

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
            this.spawnRandom(500, timeStamp);
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
        return [null, null];
    } // return list [collisionType, reference to collision object] // e.g. [Collisions.Obstacle, <reference-to-object-here>]

    // deleteObject()
}

export default SeedScene;
