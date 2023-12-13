import { Scene, Vector3, Fog, Group, Box3, Mesh } from 'three';
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
    }

    addToUpdateList(object: UpdateChild): void {
        this.state.updateList.push(object);
    }

    update(timeStamp: number): void {
        // Update clouds
        updateCloud(timeStamp);

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
        if (this.obstacles.state.hasCollision) {
            return ['obstacle', null];
        }
        return [null, null];
    } // return list [collisionType, reference to collision object]

    // deleteObject()
}

export default SeedScene;
