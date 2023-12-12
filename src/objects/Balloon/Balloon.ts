import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Import land model as a URL using Vite's syntax
import MODEL from './to_the_moon_doge_hot_air_balloon/scene.gltf?url';

class Balloon extends Group {
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
        const balloonScale = 0.0006;
      this.scale.copy(
          new Vector3(balloonScale, balloonScale, balloonScale)
        );

        const loader = new GLTFLoader();

        this.name = 'balloon' + timeStamp;

        const randomIndex = Math.floor(Math.random() * (1000));

        this.rotateY(randomIndex)

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
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
            this.position.z =
                this.position.z + (-movementSpeed * deltaTime * scale) / 10000;
        } else {
            this.position.z =
                this.position.z + (-movementSpeed * deltaTime) / 10000;
        }

        //  if (this.position.z < 500) {
        // If z is less than 500, slow down the object
        // scale = 0.1;
        //   }

        //   this.position.z += (-movementSpeed * timeStamp * scale) / 10000;

        //  this.position.z = Math.max(this.position.z, -50);

        // If z is greater than 500, apply additional slowing down
        //  if (this.position.z > 500) {
        // Calculate the new z position with a constant slowdown
        //     scale /= 10
        //      this.position.z += (-0.5 * timeStamp * scale) / 10000;
        //  }
    }
}

export default Balloon;
