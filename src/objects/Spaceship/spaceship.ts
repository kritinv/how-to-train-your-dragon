import { Group, Vector3, Box3 } from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './scene.gltf?url';
import * as THREE from 'three';

class Spaceship extends Group {
    model: Group;
    boundingBox: Box3;
    static cachedModel: Group | null = null;

    constructor(timeStamp: number) {
        super();
        const SpaceshipScale = 4.0008;
        this.scale.copy(new Vector3(SpaceshipScale, SpaceshipScale, SpaceshipScale));
        this.position.setY(-50);
        //this.rotateX( -8);
        this.name = `Spaceship${timeStamp}`;
        this.model = new Group();
        this.boundingBox = new Box3().translate(new THREE.Vector3(-200, -200, 20));

        if (Spaceship.cachedModel) {
            this.model = Spaceship.cachedModel.clone();
            this.add(this.model);
            this.boundingBox = this.boundingBox.setFromObject(this.model);
        } else {
            // If not loaded, load the model and cache it for future instances
            const loader = new GLTFLoader();
            loader.load(MODEL, (gltf: GLTF) => {
                Spaceship.cachedModel = gltf.scene;
                this.model = gltf.scene.clone();
                this.add(this.model);
            });
        }

        // // Collision Box Visualizer
        // const helper = new THREE.Box3Helper( this.boundingBox, 0xffff00 );
        // this.add( helper );
    }
}

export default Spaceship;
