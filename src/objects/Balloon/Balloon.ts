import { Group, Vector3, Box3 } from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './to_the_moon_doge_hot_air_balloon/scene.gltf?url';

class Balloon extends Group {
    model: Group;
    boundingBox: Box3;
    static cachedModel: Group | null = null;

    constructor(timeStamp: number) {
        super();
        const balloonScale = 0.0006;
        this.scale.copy(new Vector3(balloonScale, balloonScale, balloonScale));
        this.rotateY(Math.random() * 1000);
        this.name = `balloon${timeStamp}`;
        this.model = new Group();
        this.boundingBox = new Box3();

        if (Balloon.cachedModel) {
            this.model = Balloon.cachedModel.clone();
            this.add(this.model);
            this.boundingBox = new Box3().setFromObject(this.model);
        } else {
            // If not loaded, load the model and cache it for future instances
            const loader = new GLTFLoader();
            loader.load(MODEL, (gltf: GLTF) => {
                Balloon.cachedModel = gltf.scene;
                this.model = gltf.scene.clone();
                this.add(this.model);
                this.boundingBox = new Box3().setFromObject(this.model);
            });
        }
    }
}

export default Balloon;
