import { AnimationAction, AnimationClip, AnimationMixer, DetachedBindMode, Group, LoopOnce, LoopRepeat, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
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
    RotationMove = 0.007,
    RotationDoubleMove = 0.013,
    Move = 0.04,
    DoubleMove = 0.052,
}

// Import land model as a URL using Vite's syntax
import MODEL2 from './toothless-animated/night_fury.fbx?url';

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

    mixer: AnimationMixer;
    animationCLips: { [key: string]: AnimationClip } = {};
    currentAnimation: AnimationClip | null = null;

    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'box';

        const fbxLoader = new FBXLoader()
        fbxLoader.load( 
            MODEL2,
            (object) => {    
                                    
                this.add(object);

                // Rotate the model by 90 degrees around the Y axis
                object.rotation.y = Math.PI / 2; // 90 degrees

                // Initialize the animation mixer
                this.mixer = new AnimationMixer(object);

                object.animations.forEach((clip) => {
                    this.animationCLips[clip.name] = clip; // Store AnimationClip
                    console.log("animation: " + clip.name);
                });
            },
        );
        // this.rotateOnAxis(new Vector3(0, 1, 0), 1);
        this.currentAnimation = this.animationCLips[0];
        this.scale.set(0.026, 0.026, 0.026);
        this.playAnimation('toothless_armature|toothless_armature|toothless_armature|flying', 0.5);


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

    playAnimation(name: string, duration: number) {
        // Retrieve the AnimationClip
        const clip = this.animationCLips[name];
        if (clip) {
            // Get or create the action for this clip
            const newAction = this.mixer.clipAction(clip);

            if (this.currentAnimation && this.mixer.clipAction(this.currentAnimation) !== newAction) {
                // Use crossFadeTo on the current AnimationAction
                this.mixer.clipAction(this.currentAnimation).crossFadeTo(newAction, duration, true);
            }

            newAction.play();
            this.currentAnimation = clip; // Update the current animation
        }
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
        if (this.rotation.z < 1 && this.rotation.z > -1 || this.state.action == ToothlessActions.MovingLeftDouble || this.state.action == ToothlessActions.MovingRightDouble){
            if (this.state.rotation.lengthSq() > 0) {
                this.rotateOnWorldAxis(new Vector3(1, 0, 0), this.state.rotation.x * this.state.rotationSpeed * deltaTime); // Rotate along X-axis
                this.rotateOnWorldAxis(new Vector3(0, 1, 0), this.state.rotation.y * this.state.rotationSpeed * deltaTime); // Rotate along Y-axis
                this.rotateOnWorldAxis(new Vector3(0, 0, 1), this.state.rotation.z * this.state.rotationSpeed * deltaTime); // Rotate along Z-axis
            }
        }

        // Update the mixer
        if (this.mixer) {
            this.mixer.update(deltaTime * 0.001); // Convert to seconds
        }


        // Play the animation 
        const animationDuration = 1; // Duration for crossfade
        if (this.state.action === ToothlessActions.MovingLeft) {
            this.playAnimation('toothless_armature|toothless_armature|toothless_armature|Action', animationDuration);
            // this.playAnimation('toothless_armature|flying', animationDuration);
        } else if (this.state.action === ToothlessActions.Idle) {
            this.playAnimation('toothless_armature|toothless_armature|toothless_armature|Action', animationDuration);
        }
    }
}

export default Toothless;
