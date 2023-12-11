import { Group, Mesh, MeshStandardMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './love_heart.gltf?url';

class Heart extends Group {
    // Define the type of the state field
    state: {
        movementSpeed: number;
    };

    Time = 0;

    constructor() {
        super();

        // Init state
        this.state = {
            movementSpeed: 800.0,
        };

        const loader = new GLTFLoader();

        this.name = 'heart';

        loader.load(MODEL, (gltf) => {
            // Traverse through all the children of the loaded model
            gltf.scene.traverse((child) => {
                // Check if the child is a Mesh and has a standard material
                if (
                    child instanceof Mesh &&
                    child.material instanceof MeshStandardMaterial
                ) {
                    // Set the color of the material to red
                    child.material.color.set(0xff0000); // Hex color for red
                }
            });

            // Set the scale to make the heart smaller
            gltf.scene.scale.set(0.01, 0.01, 0.01); // Adjust the scale as needed

            this.add(gltf.scene);

            this.add(gltf.scene);
        });
    }
}

export default Heart;
