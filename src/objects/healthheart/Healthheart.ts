import { AnimationClip, AnimationMixer, Group, Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';


// Import land model as a URL using Vite's syntax
import MODEL from './source/model.gltf?url';

class HealthHeart extends Group {
    model: Group;
    boundingBox: Box3;
    mixer: AnimationMixer;

    // Define the type of the state field
    state: {
        movementSpeed: number;
        Time: number;

            bob: boolean;
            spin: () => void;
            twirl: number;
        
    };

    constructor(timeStamp: number) {
        super();

        // Init state
        this.state = {
            movementSpeed: 1000.0,
            Time: timeStamp,
            bob: true,
            spin: () => this.spin(), // or this.spin.bind(this)
            twirl: 0,
        };

        const loader = new GLTFLoader();

        this.name = `healthheart${timeStamp}`;
        this.model = new Group();
        this.boundingBox = new Box3();
        this.mixer = new AnimationMixer(this.model);
       // this.rotateY(Math.random() * 1000);

        loader.load(MODEL, (gltf) => {
            // Set the model and add it to the group
            this.model = gltf.scene;
            this.add(this.model);

            // Set bounding box
            this.boundingBox = new Box3().setFromObject(this.model);

            const balloonScale = 3;
            this.model.scale.copy(
                new Vector3(balloonScale, balloonScale, balloonScale)
              );
    
        });
    
    }

    spin(): void {
        // Add a simple twirl
        this.state.twirl += 6 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    outOfFrame(): boolean {
        return this.position.z < 0;
    }

    update(timeStamp: number): void {
        const { movementSpeed } = this.state;
        let deltaTime = timeStamp - this.state.Time;
        this.state.Time += deltaTime;
        let scale = 1;
       


        if (this.position.z > 500) {
            scale = scale * 1.5;
            this.position.z = this.position.z + (-movementSpeed * deltaTime * scale) / 10000;
        } else {
            this.position.z = this.position.z + (-movementSpeed * deltaTime) / 10000;
        }

        // Update the animation mixer
        this.mixer.update(deltaTime);

        this.boundingBox.setFromObject(this.model);
        
           // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        
        TWEEN.update();
    }
}

export default HealthHeart;
