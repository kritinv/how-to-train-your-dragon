import { Group, Box3 } from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './final-diorama-scene/source/Unity2Skfb/Unity2Skfb.gltf?url';
import * as THREE from 'three';

class Island extends Group {
    model: Group;
    boundingBox: Box3;
    static cachedModel: Group | null = null;

    constructor(timeStamp: number) {
        super();

        this.name = `island${timeStamp}`;
        this.model = new Group();
        // this.rotateY(Math.random() * 1000);
        this.scale.set(1,1,1);
        this.boundingBox = new Box3().translate(new THREE.Vector3(-200, -200, 20));

        if (Island.cachedModel) {
            this.model = Island.cachedModel.clone();
            this.add(this.model);
            this.boundingBox = this.boundingBox.setFromObject(this.model);
        } else {
            // If not loaded, load the model and cache it for future instances
            const loader = new GLTFLoader();
            // this.boundingBox = new Box3().setFromCenterAndSize(new THREE.Vector3(-200, -200, -200), new THREE.Vector3(1,1,1));
            loader.load(MODEL, (gltf: GLTF) => {
                Island.cachedModel = gltf.scene;
                this.model = gltf.scene.clone();
                this.add(this.model);
                this.boundingBox = this.boundingBox.setFromObject(this.model);
            });
        }
        this.boundingBox.set(this.boundingBox.min.add(new THREE.Vector3(3.5,6,10)), this.boundingBox.max.add(new THREE.Vector3(6.5,4,4).multiplyScalar(-1)));
        
        // // Collision Box Visualizer
        // const helper = new THREE.Box3Helper( this.boundingBox, 0xffff00 );
        // this.add( helper );
    }
    
}

export default Island;
