import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './to_the_moon_doge_hot_air_balloon/scene.gltf?url';

class Box extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'box';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
    }
}

export default Box;
