import { Box3, Vector3, Group } from 'three';
import Balloon from '../objects/Balloon/Balloon';
import Island from '../objects/Floating Island/Island';
import Toothless from '../objects/Toothless/Toothless';
import SeedScene from './SeedScene';
import HealthHeart from '../objects/healthheart/Healthheart';
import FloatingRock from '../objects/FloatingRock/FloatingRock';

// Define an object type which describes each object in the update list
type movingObject = Group & {
    // Each object *might* contain an update function
    model: Group;
    boundingBox: Box3;
    update?: (timeStamp: number) => void;
};
type MovingObjectPair = [movingObject, string];
type movingObjectClass = { new (timeStamp: number): movingObject };

class Obstacles {
    scene: SeedScene;
    state: {
        movementSpeed: number;
        spawnInterval: number;
        spawnDistance: number;
        prevTime: number;
        lastObstacleSpawnTime: number;

        uniqueObstacles: movingObjectClass[];
        uniquePowerUps: movingObjectClass[];

        objects: MovingObjectPair[];

        lanes: number[];
        lastObjectName: string | null;
        hasCollision: boolean;
        collisionType: string;
    };

    constructor(scene: SeedScene) {
        this.scene = scene;
        this.state = {
            movementSpeed: 1000,
            spawnInterval: 3000,
            spawnDistance: 2000,
            prevTime: 0,
            lastObstacleSpawnTime: 0,

            uniqueObstacles: [Balloon, Island],
            uniquePowerUps: [HealthHeart],

            objects: [],

            lanes: this.generateLanes(10),
            lastObjectName: null,
            hasCollision: false,
            collisionType: '',
        };
    }

    // ---------------------------------------------------- //
    // ---- Main Update (spawning, removal, traversal) ---- //
    // ---------------------------------------------------- //

    update(timeStamp: number, toothless: Toothless): void {
        const { movementSpeed, prevTime } = this.state;
        let deltaTime = timeStamp - prevTime;
        this.state.prevTime = timeStamp;

        for (const objectPair of this.state.objects) {
            const object = objectPair[0];
            const type = objectPair[1];

            // update obstacle movement
            object.position.z += (-movementSpeed * deltaTime) / 10000;
            object.boundingBox.setFromObject(object.model);

            // collision detection
            if (object.name !== this.state.lastObjectName) {
                if (object.boundingBox !== undefined) {
                    const box = new Vector3().copy(object.boundingBox.min);
                    const position = new Vector3().copy(
                        toothless.boundingBox.min
                    const minThreshold = -20;
                    const maxThreshold = 20;

                    const collisionX =
                        box.x > position.x + minThreshold &&
                        box.x < position.x + maxThreshold;
                    const collisionY =
                        box.y > position.y + minThreshold &&
                        box.y < position.y + maxThreshold;
                    const collisionZ =
                        box.z > position.z + minThreshold &&
                        box.z < position.z + maxThreshold;

                    if (collisionX && collisionY && collisionZ) {
                        this.state.hasCollision = true;
                        this.state.lastObjectName = object.name;
                        this.state.collisionType = type;
                    } else {
                        this.state.hasCollision = false;
                    }

                    console.log(this.state.hasCollision);
                }
            }

            // remove objects that are out of frame from scene and obstacles
            if (this.outOfFrame(object)) {
                this.removeFromObjects(objectPair);
                this.scene.remove(object);
            }

            if (type === 'powerup') {
                if (object.update) {
                    object.update(timeStamp);
                }
            }
        }
        if (
            timeStamp >=
            this.state.spawnInterval + this.state.lastObstacleSpawnTime
        ) {
            this.state.lastObstacleSpawnTime = timeStamp;
            this.spawnRandom();
        }
    }

    // ---------------------------------------------------- //
    // ------------------- Helper Functions --------------- //
    // ---------------------------------------------------- //

    spawnRandom(): void {
        const randomValue = Math.random();
        let object;
        let type;
        if (randomValue < 0.9) {
            object = this.getRandomObstacle();
            type = 'obstacle';
        } else {
            object = this.getRandomPowerUp();
            type = 'powerup';
        }
        const rand_lane_i = Math.floor(Math.random() * this.state.lanes.length);
        const rand_lane = this.state.lanes[rand_lane_i];
        object.position.set(rand_lane, 0, this.state.spawnDistance);
        this.addToObjects([object, type]);
        this.scene.add(object);
    }

    getRandomObstacle(): movingObject {
        const randomIndex = Math.floor(
            Math.random() * this.state.uniqueObstacles.length
        );
        const obstacleClass = this.state.uniqueObstacles[randomIndex];
        const newObstacle = new obstacleClass(Date.now());
        return newObstacle;
    }

    getRandomPowerUp(): movingObject {
        const randomIndex = Math.floor(
            Math.random() * this.state.uniquePowerUps.length
        );
        const powerUpClass = this.state.uniquePowerUps[randomIndex];
        const newPowerUp = new powerUpClass(Date.now());
        return newPowerUp;
    }

    addToObjects(objectPair: MovingObjectPair): void {
        this.state.objects.push(objectPair);
    }

    removeFromObjects(objectPair: MovingObjectPair): void {
        const index = this.state.objects.indexOf(objectPair);
        if (index !== -1) {
            this.state.objects.splice(index, 1);
        }
    }

    outOfFrame(object: movingObject): boolean {
        return object.position.z < 0;
    }

    generateLanes(intervals: number): number[] {
        const lanes: number[] = [];
        for (let i = -6 * intervals; i <= 6 * intervals; i += 12) {
            lanes.push(i);
        }
        return lanes;
    }
}

export default Obstacles;
