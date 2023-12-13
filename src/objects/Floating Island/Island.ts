import { Group, Box3 } from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './final-diorama-scene/source/Unity2Skfb/Unity2Skfb.gltf?url';

class Island extends Group {
    model: Group;
    boundingBox: Box3;
    static cachedModel: Group | null = null;

    constructor(timeStamp: number) {
        super();

        this.name = `island${timeStamp}`;
        this.model = new Group();
        this.boundingBox = new Box3();
        this.rotateY(Math.random() * 1000);

        if (Island.cachedModel) {
            this.model = Island.cachedModel.clone();
            this.add(this.model);
            this.boundingBox = new Box3().setFromObject(this.model);
        } else {
            // If not loaded, load the model and cache it for future instances
            const loader = new GLTFLoader();
            loader.load(MODEL, (gltf: GLTF) => {
                Island.cachedModel = gltf.scene;
                this.model = gltf.scene.clone();
                this.add(this.model);
                this.boundingBox = new Box3().setFromObject(this.model);
            });
        }
    }
}

export default Island;
