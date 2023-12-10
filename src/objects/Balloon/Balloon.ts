import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './to_the_moon_doge_hot_air_balloon/scene.gltf?url';

class Balloon extends Group {
    state: {
        movementSpeed: number;
        };
    constructor() {
        // Call parent Group() constructor
        super();
        this.state = {
            movementSpeed: 30.0,
        };

        const loader = new GLTFLoader();

        this.name = 'box';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
    }
    update(timeStamp: number): void {
        const {movementSpeed} = this.state;
        let scale = 1;
        if(this.position.z<500){
            scale = scale*0.15
            this.position.z = this.position.z+(-movementSpeed * timeStamp*scale) / 10000;

        }else{
        this.position.z = this.position.z+(-movementSpeed * timeStamp*scale) / 10000;
        }
    }
}

export default Balloon;
