import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './to_the_moon_doge_hot_air_balloon/scene.gltf?url';

class Balloon extends Group {
    state: {
        movementSpeed: number;
    };
    Time = 0;
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
        const { movementSpeed } = this.state;
        let deltaTime = timeStamp - this.Time;
        this.Time = timeStamp;
        let scale = 1;
        if (this.position.z > 500) {
            scale = scale * 1.5;
            this.position.z =
                this.position.z + (-movementSpeed * deltaTime * scale) / 10000;
        } else {
            this.position.z =
                this.position.z + (-movementSpeed * deltaTime) / 10000;
        }
    }

    outOfFrame(): boolean {
        return this.position.z < -5;
    }
}

export default Balloon;
