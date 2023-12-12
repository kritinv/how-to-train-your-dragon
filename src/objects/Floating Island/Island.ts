import { Group, Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './final-diorama-scene/source/Unity2Skfb/Unity2Skfb.gltf?url';

class Island extends Group {
    model: Group; 
    boundingBox: Box3;

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
        this.model = new Group();
        this.boundingBox = new Box3();

    

        /*loader.load(MODEL, (gltf) => {
           const model = gltf.scene;
            this.add(model);
        });*/
        loader.load(MODEL, (gltf) => {
            this.model = gltf.scene;
            this.add(this.model);
            this.boundingBox = new Box3().setFromObject(this.model);


        });
        //this.boundingBox = new Box3().setFromObject(this.model);
        

    }
       


    

    outOfFrame(): boolean {
        return this.position.z < 0;
    }

    update(timeStamp: number): void {
        const { movementSpeed } = this.state;
        let deltaTime = timeStamp - this.state.Time;
        this.state.Time += deltaTime;
        let scale = 1;
       // console.log(this.boundingBox)
        if (this.position.z > 500) {
            scale = scale * 1.5;
            this.position.z =
                this.position.z + (-movementSpeed * deltaTime * scale) / 10000;
        } else {
            this.position.z =
                this.position.z + (-movementSpeed * deltaTime) / 10000;
        }
        this.boundingBox.setFromObject(this.model);


    }


}

export default Island;
