import { DetachedBindMode, Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// add action queue and 
enum ToothlessActions {
    Idle = 'idle',
    MovingLeft = 'moving left',
    MovingRight = 'moving right',
    MovingUp = 'moving up',
    MovingDown = 'moving down',
    MovingLeftDouble = 'moving left double',
    MovingRightDouble = 'moving right double',
    MovingUpDouble = 'moving up double',
    MovingDownDouble = 'moving down double',
}

enum Speed {
    RotationMove = 0.002,
    RotationDoubleMove = 0.013,
    Move = 0.04,
    DoubleMove = 0.052,
}

// Import land model as a URL using Vite's syntax
import MODEL from './Toothless.gltf?url';

class Toothless extends Group {
    
    state: {
        speed: number;
        direction: Vector3;
        rotation: Vector3;
        rotationSpeed: number;
        targetLane: number; // for movement
        previousLane: number; // for movement
        action: ToothlessActions; // for animation
    };
    
    Lane = [-30, -18, -6, 6, 18, 30];

    Time = 0;

    LaneMiddle = [-24, -12, 0, 12, 24];

    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'box';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        // this.scale.set(0.7, 0.7, 0.7);

        this.state = {
            speed: 0.03,
            direction: new Vector3(),
            rotation: new Vector3(),
            rotationSpeed: 0.002,
            targetLane: 3,
            previousLane: 3,
            action: ToothlessActions.Idle
        };
    }
    
    currentLane() {
        for (let i = 0; i < this.Lane.length - 1; i++) {
            // console.log(this.position.x);
            if (this.position.x > this.Lane[i] && this.position.x < this.Lane[i+1]) {
                return i + 1;
            }
        }
        return -1;
    }

    moveLeft() {
        if (this.currentLane() < 5) {
            this.state.action = ToothlessActions.MovingLeft;
            this.state.targetLane = this.currentLane() + 1;
        }
    }

    doubleMoveLeft() {
        if (this.currentLane() < 4) {
            this.state.action = ToothlessActions.MovingLeftDouble;
            this.state.targetLane = this.currentLane() + 2;
        }
    }

    moveRight() {
        if (this.currentLane() > 1) {
            this.state.action = ToothlessActions.MovingRight;
            this.state.targetLane = this.currentLane() - 1;
        }
    }

    doubleMoveRight() {
        if (this.currentLane() > 2) {
            this.state.action = ToothlessActions.MovingRightDouble;
            this.state.targetLane = this.currentLane() - 2;
        }
    }

    moveUp() {
    }

    moveDown() {
    }

    stopHorizontalMovement() {
        this.state.direction.x = 0;
        this.state.rotation.z = 0;
        this.setRotationFromAxisAngle(new Vector3(0,0,0), 0);
    }

    stopVerticalMovement() {
        this.state.direction.y = 0;
        // this.setRotationFromAxisAngle(new Vector3(0,0,-1), 0);
        // this.state.rotation.x = 0;
    }

    update(timeStamp: number) {
        let deltaTime = timeStamp - this.Time;
        this.Time = timeStamp;
        // console.log(this.rotation.z);

        // set direction and rotation based on action
        if (this.state.action == ToothlessActions.MovingLeft) {
            this.state.direction.x = 1;
            this.state.rotation.z = -1;
            this.state.rotationSpeed = Speed.RotationMove;
            this.state.speed = Speed.Move;
            if (this.position.x > this.LaneMiddle[this.state.targetLane - 1]) {
                this.state.action = ToothlessActions.Idle;
                this.state.rotation.z = 0;
                this.setRotationFromAxisAngle(new Vector3(0,0,0), 0);
            }
        } else if (this.state.action == ToothlessActions.MovingRight) {
            this.state.direction.x = -1;
            this.state.rotation.z = 1;
            this.state.rotationSpeed = Speed.RotationMove;
            this.state.speed = Speed.Move;
            if (this.position.x < this.LaneMiddle[this.state.targetLane - 1]) {
                this.state.action = ToothlessActions.Idle;
                this.state.rotation.z = 0;
                this.setRotationFromAxisAngle(new Vector3(0,0,0), 0);
            }
        } else if (this.state.action == ToothlessActions.MovingLeftDouble) {
            this.state.direction.x = 1
            this.state.rotation.z = -1;
            this.state.rotationSpeed = Speed.RotationDoubleMove;
            this.state.speed = Speed.DoubleMove;
            if (this.position.x > this.LaneMiddle[this.state.targetLane - 1]) {
                this.state.action = ToothlessActions.Idle;
                this.state.rotation.z = 0;
                this.setRotationFromAxisAngle(new Vector3(0,0,0), 0);
            }
        } else if (this.state.action == ToothlessActions.MovingRightDouble) {
            this.state.direction.x = -1;
            this.state.rotation.z = 1;
            this.state.rotationSpeed = Speed.RotationDoubleMove;
            this.state.speed = Speed.DoubleMove;
            if (this.position.x < this.LaneMiddle[this.state.targetLane - 1]) {
                this.state.action = ToothlessActions.Idle;
                this.state.rotation.z = 0;
                this.setRotationFromAxisAngle(new Vector3(0,0,0), 0);
            }
        } else {
            this.state.direction.x = 0
        }

        // Apply movement
        if (this.state.direction.lengthSq() > 0) {
            this.position.addScaledVector(this.state.direction.normalize(), this.state.speed * deltaTime);
        }

        // Apply rotation
        if (this.rotation.z < 0.4 && this.rotation.z > -0.4 || this.state.action == ToothlessActions.MovingLeftDouble || this.state.action == ToothlessActions.MovingRightDouble){
            if (this.state.rotation.lengthSq() > 0) {
                this.rotateOnWorldAxis(new Vector3(1, 0, 0), this.state.rotation.x * this.state.rotationSpeed * deltaTime); // Rotate along X-axis
                this.rotateOnWorldAxis(new Vector3(0, 1, 0), this.state.rotation.y * this.state.rotationSpeed * deltaTime); // Rotate along Y-axis
                this.rotateOnWorldAxis(new Vector3(0, 0, 1), this.state.rotation.z * this.state.rotationSpeed * deltaTime); // Rotate along Z-axis
            }
        }
    }
}

export default Toothless;
