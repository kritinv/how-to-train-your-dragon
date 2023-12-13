import { Group, Box3 } from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './floating_rock/scene.gltf?url';

class FloatingRock extends Group {
    model: Group;
    boundingBox: Box3;
    static cachedModel: Group | null = null;

    constructor(timeStamp: number) {
        super();

        this.name = `floatingrock${timeStamp}`;
        this.model = new Group();
        this.boundingBox = new Box3();
        this.rotateY(Math.random() * 1000);

        if (FloatingRock.cachedModel) {
            this.model = FloatingRock.cachedModel.clone();
            this.add(this.model);
            this.boundingBox = new Box3().setFromObject(this.model);
        } else {
            // If not loaded, load the model and cache it for future instances
            const loader = new GLTFLoader();
            loader.load(MODEL, (gltf: GLTF) => {
                FloatingRock.cachedModel = gltf.scene;
                this.model = gltf.scene.clone();
                this.add(this.model);
                this.boundingBox = new Box3().setFromObject(this.model);
            });
        }
    }
}

export default FloatingRock;
