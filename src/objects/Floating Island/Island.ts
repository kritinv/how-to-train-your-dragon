import { Group, Sphere, Vector3, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './final-diorama-scene/source/Unity2Skfb/Unity2Skfb.gltf?url';

class Island extends Group {
    // Define the type of the state field
    state: {
        movementSpeed: number;
        Time: number;
    };

    constructor(timeStamp: number) {
        super();

        // Init state
        this.state = {
            movementSpeed: 1000.0,
            Time: timeStamp,
        };
        

        const loader = new GLTFLoader();

        this.name = 'island' + timeStamp;
    

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
    }

    outOfFrame(): boolean {
        return this.position.z < 0;
    }
    computeBoundingSphere() {
        const boundingSphere = new Sphere();
    
        boundingSphere.center = new Vector3(this.position.x,this.position.y,this.position.z);
        boundingSphere.radius = 10.0;
    
        return boundingSphere;
    }

    update(timeStamp: number): void {
        const { movementSpeed } = this.state;
        let deltaTime = timeStamp - this.state.Time;
        this.state.Time += deltaTime;
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


}

export default Island;
