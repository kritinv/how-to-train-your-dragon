import { Scene, Fog } from 'three';
import sky from '../scenes/Sky';
import BasicLights from '../lights/BasicLights';
import Toothless from '../objects/Toothless/Toothless';
import { cloud, updateCloud } from '../objects/Clouds/Clouds';
import Obstacles from '../scenes/Obstacles';

// import * as Dat from 'dat.gui';
// import Balloon from '../objects/Balloon/Balloon';
// import Island from '../objects/Floating Island/Island';
// import Heart from '../objects/Heart/Heart';
// import Obstacles from '../scenes/Obstacles';
// import Collisions from '../app';
// import { VERSION } from 'three/examples/jsm/libs/tween.module';

// Define an object type which describes each object in the update list
type UpdateChild = Object & {
    // Each object *might* contain an update function
    update?: (...args: any[]) => void;
};

class SeedScene extends Scene {
    // Define the type of the state field
    character: Toothless;
    obstacles: Obstacles;
    state: {
        updateList: UpdateChild[];
    };

    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            updateList: [],
        };

        // Init lights
        const lights = new BasicLights();

        // Init toothless
        const toothless = new Toothless();
        this.character = toothless;
        toothless.position.set(0, -3, 3);

        // Init obstacles
        this.obstacles = new Obstacles(this);
        toothless.position.set(0, -3, 3);

        // Add objects to scene
        this.add(toothless);
        this.add(sky, cloud, lights);

        // Init fog
        this.fog = new Fog(0xa8928e, 300, 1000);

        // Add items  to update list
        this.addToUpdateList(toothless);

        // // Collision Box Visualizer
        // const helper = new THREE.Box3Helper( this.character.boundingBox, 0xffff00 );
        // this.add( helper );
    }

    addToUpdateList(object: UpdateChild): void {
        this.state.updateList.push(object);
    }

    update(timeStamp: number): void {
        // Update clouds
        updateCloud();

        // Update obstacles
        this.obstacles.update(timeStamp, this.character);

        // Call update for each object in the updateList
        const { updateList } = this.state;
        for (const obj of updateList) {
            if (obj.update !== undefined) {
                obj.update(timeStamp);
            }
        }
    }

    queueMoveLeft(sounds: any) {
        this.character.moveLeft();
        sounds['wind'].stop();
        sounds['wind'].play();
    }
    queueDoubleMoveLeft(sounds: any) {
        this.character.doubleMoveLeft();
        sounds['wind'].stop();
        sounds['wind'].play();
    }
    queueMoveRight(sounds: any) {
        this.character.moveRight();
        sounds['wind'].stop();
        sounds['wind'].play();
    }
    queueDoubleMoveRight(sounds: any) {
        this.character.doubleMoveRight();
        sounds['wind'].stop();
        sounds['wind'].play();
    }
    queueMoveUp(sounds: any) {
        this.character.moveUp();
        sounds['wind'].stop();
        sounds['wind'].play();
    }
    queueMoveDown(sounds: any) {
        this.character.moveDown();
        sounds['wind'].stop();
        sounds['wind'].play();
    }
    queueSpinMove(sounds: any) {
        this.character.spinMove();
        sounds['wind'].stop();
        sounds['wind'].play();
    }
    queueCollide() {
        this.character.collide();
    }
    getCollision() {
        if (this.obstacles.state.hasCollision) {
            return [this.obstacles.state.collisionType, null];
        }
        return [null, null];
    } // return list [collisionType, reference to collision object]

    // deleteObject()
}

export default SeedScene;
