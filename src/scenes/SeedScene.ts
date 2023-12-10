import dat from 'dat.gui';
import { Scene, Color, Vector2, Vector3 } from 'three';

import Flower from '../objects/Flower';
import Land from '../objects/Land';
// import Character from '../objects/Character';
import BasicLights from '../lights/BasicLights';
// import Tree from '../lights/TreeGoBrr';
import Box from '../objects/TreeNew';
import Balloon from '../objects/HotAirBalloon';

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
            gui: new dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const land = new Land();
        const flower = new Flower(this);
        const lights = new BasicLights();
        // const tree = new Tree();
        // const character = new Character();
        const box = new Box();  //https://github.com/KhronosGroup/glTF-Sample-Models/blob/master/2.0/Box/glTF/Box.gltf 
        const balloon = new Balloon();
        box.position.set(flower.position.x, flower.position.y, flower.position.z);
        balloon.position.set(flower.position.x, flower.position.y-10, flower.position.z + 10);
        const balloonScale = 0.0006;
        balloon.scale.copy(new Vector3(balloonScale, balloonScale, balloonScale));

        this.add(lights, box, balloon);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object: UpdateChild): void {
        this.state.updateList.push(object);
    }

    update(timeStamp: number): void {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            if (obj.update !== undefined) {
                obj.update(timeStamp);
            }
        }
    }
}

export default SeedScene;
