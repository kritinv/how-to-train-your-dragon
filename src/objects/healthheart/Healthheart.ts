import { AnimationClip, AnimationMixer, Group, Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

// Import land model as a URL using Vite's syntax
import MODEL from './source/model.gltf?url';
import * as THREE from 'three';

class HealthHeart extends Group {
    model: Group;
    boundingBox: Box3;
    mixer: AnimationMixer;
    static cachedModel: Group | null = null;

    // Define the type of the state field
    state: {
        Time: number;
        bob: boolean;
        spin: () => void;
        twirl: number;
    };

    constructor(timeStamp: number) {
        super();

        // Init state
        this.state = {
            Time: 0,
            bob: true,
            spin: () => this.spin(), // or this.spin.bind(this)
            twirl: 0,
        };

        const loader = new GLTFLoader();

        this.name = `healthheart${timeStamp}`;
        this.model = new Group();
        this.boundingBox = new Box3().translate(new THREE.Vector3(0, 0, 20));
        this.mixer = new AnimationMixer(this.model);
        this.position.setY(-3);
        // this.rotateY(Math.random() * 1000);

        if (HealthHeart.cachedModel) {
            this.model = HealthHeart.cachedModel.clone();
            this.add(this.model);
            const balloonScale = 8;
            this.model.scale.copy(
                new Vector3(balloonScale, balloonScale, balloonScale)
            );
            this.boundingBox = this.boundingBox.setFromObject(this.model);
        } else {
            // If not loaded, load the model and cache it for future instances
            const loader = new GLTFLoader();
            loader.load(MODEL, (gltf: GLTF) => {
                HealthHeart.cachedModel = gltf.scene;
                this.model = gltf.scene.clone();
                this.add(this.model);
                const balloonScale = 8;
                this.model.scale.copy(
                    new Vector3(balloonScale, balloonScale, balloonScale)
                );
                this.boundingBox = this.boundingBox.setFromObject(this.model);
            });
        }
        this.boundingBox.set(this.boundingBox.min.add(new THREE.Vector3(5,3,4).multiplyScalar(-1)), this.boundingBox.max.add(new THREE.Vector3(5,3,4)));
        // Collision Box Visualizer
        const helper = new THREE.Box3Helper( this.boundingBox, 0xffff00 );
        this.add( helper );
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

    update(timeStamp: number): void {
        let deltaTime = timeStamp - this.state.Time;
        this.state.Time = timeStamp;

        // Update the animation mixer
        this.mixer.update(deltaTime);

        // Lazy implementation of twirl
        this.state.twirl -= Math.PI / 20;
        this.rotation.y += Math.PI / 20;

        TWEEN.update();
    }
}

export default HealthHeart;
