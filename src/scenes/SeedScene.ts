import * as Dat from 'dat.gui';
import { Scene, Vector3, Fog, Mesh } from 'three';
import sky from '../scenes/Sky';
import BasicLights from '../lights/BasicLights';
import Toothless from '../objects/Toothless/Toothless';
import Balloon from '../objects/Balloon/Balloon';
import Island from '../objects/Floating Island/Island';

// Define an object type which describes each object in the update list
type UpdateChild = {
    // Each object *might* contain an update function
    update?: (timeStamp: number) => void;
};

class SeedScene extends Scene {
    // Define the type of the state field
    state: {
        gui: dat.GUI;
        rotationSpeed: number;
        updateList: UpdateChild[];
    };

    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
        };

        // Add lights to scene
        const lights = new BasicLights();

        // Add toothless and balloon to scene
        const toothless = new Toothless();
        toothless.position.set(0, -3, 0);
        const balloon = new Balloon();
        balloon.position.set(
            0,
            - 10,
            500
        );
        const balloonScale = 0.0006;
        balloon.scale.copy(
            new Vector3(balloonScale, balloonScale, balloonScale)
        );
        
        // Add floating island to the scene
        const island = new Island();
        const islandScale = 0.5;
        island.scale.copy(
            new Vector3(islandScale, islandScale, islandScale)
        );
        island.position.set(
            1,
            1,
            1000
        );
        this.addToUpdateList(island);
        this.addToUpdateList(balloon);
        // Add objects to scenecloud1
        this.add(lights, toothless, sky, island);
        this.fog = new Fog( 0xa8928e, 300, 500 ); 

    }

    addToUpdateList(object: UpdateChild): void {
        this.state.updateList.push(object);
    }

    update(timeStamp: number): void {
        const { rotationSpeed, updateList } = this.state;
        //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            if (obj.update !== undefined) {
                obj.update(timeStamp);
            }
        }
    }
}

export default SeedScene;
