import { Group, Vector3, Box3 } from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './to_the_moon_doge_hot_air_balloon/scene.gltf?url';
import * as THREE from 'three';

class Balloon extends Group {
    model: Group;
    boundingBox: Box3;
    static cachedModel: Group | null = null;

    constructor(timeStamp: number) {
        super();
        const balloonScale = 0.0008;
        this.scale.copy(new Vector3(balloonScale, balloonScale, balloonScale));
        this.position.setY(-8);
        // this.rotateY(Math.random() * 1000);
        this.name = `balloon${timeStamp}`;
        this.model = new Group();
        this.boundingBox = new Box3().translate(new THREE.Vector3(0, 0, 20));

        if (Balloon.cachedModel) {
            this.model = Balloon.cachedModel.clone();
            this.add(this.model);
            this.boundingBox = this.boundingBox.setFromObject(this.model);
        } else {
            // If not loaded, load the model and cache it for future instances
            const loader = new GLTFLoader();
            loader.load(MODEL, (gltf: GLTF) => {
                Balloon.cachedModel = gltf.scene;
                this.model = gltf.scene.clone();
                this.add(this.model);
                this.boundingBox = this.boundingBox.setFromObject(this.model);
            });
        }

        // // Collision Box Visualizer
        // const helper = new THREE.Box3Helper( this.boundingBox, 0xffff00 );
        // this.add( helper );
    }
}

export default Balloon;
