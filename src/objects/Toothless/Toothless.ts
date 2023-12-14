import { AnimationClip, AnimationMixer, Group, Vector3, Box3, Mesh, Material } from 'three';
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
    SpinMove = 'spin move'
}

enum Speed {
    RotationMove = 0.007,
    RotationDoubleMove = 0.013,
    RotationSpinMove = 0.02,
    Move = 0.04,
    DoubleMove = 0.052,
}

enum Duration {
    SpinMove = 600
}

// Import land model as a URL using Vite's syntax
import MODEL2 from './toothless-animated/night_fury.fbx?url';

class Toothless extends Group {
    model: Group; 

    boundingBox: Box3;

    private state: {
        speed: number;
        direction: Vector3;
        rotation: Vector3;
        rotationSpeed: number;
        targetLane: number; // for movement
        previousLane: number; // for movement
        action: ToothlessActions; // for animation
    };

    private blinkingState: { // Blink properties
        isBlinking: boolean;
        lastBlinkTimeStamp: number;
        blinkDuration: number; // Total duration of blink effect in milliseconds
        blinkInterval: number; // Interval of each blink in milliseconds
        blinkOpacityLow: number; // Low opacity
        blinkOpacityHigh: number; // High opacity
    };

    private timer : {
        spinMove: number;
    }
    
    private Lane = [-30, -18, -6, 6, 18, 30]; // defines boundary of lane, eg. lane1 is between this.Lane[0] and this.Lane[1]

    private Time = 0; // for calculating delta time in update()

    private LaneMiddle = [-24, -12, 0, 12, 24]; // x coord of middle of lane

    private mixer!: AnimationMixer;
    private animationCLips: { [key: string]: AnimationClip } = {};
    private currentAnimation: AnimationClip | null = null;


    // Toothless Constructor
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'box';
        this.model = new Group();
        this.boundingBox = new Box3();


        const fbxLoader = new FBXLoader()
        fbxLoader.load( 
            MODEL2,
            (object) => {    
                this.model = object;
         
                this.add(object);

                // Rotate the model by 90 degrees around the Y axis
                object.rotation.y = Math.PI / 2; // 90 degrees

                // Initialize the animation mixer
                this.mixer = new AnimationMixer(object);

                object.animations.forEach((clip) => {
                    this.animationCLips[clip.name] = clip; // Store AnimationClip
                });
                this.boundingBox = this.boundingBox.setFromObject(this.model);
                this.boundingBox.max.add(new Vector3(0,0,-3));
                object.traverse((child) => {
                    if ((<THREE.Mesh> child).isMesh) {
                        const mesh = child as Mesh;
                        if (Array.isArray(mesh.material) && mesh.material[1] instanceof Material) {
                            mesh.material[1].opacity = 1;
                            mesh.material[1].transparent = true;
                        }
                    }
                });     

            },
        );

           
        // this.rotateOnAxis(new Vector3(0, 1, 0), 1);
        this.currentAnimation = this.animationCLips[0];
        this.scale.set(0.026, 0.026, 0.026);
        this.playAnimation('toothless_armature|toothless_armature|toothless_armature|flying', 0.5);

        // Initialize state
        this.state = {
            speed: 0.03,
            direction: new Vector3(),
            rotation: new Vector3(),
            rotationSpeed: 0.002,
            targetLane: 3,
            previousLane: 3,
            action: ToothlessActions.Idle
        };

        // Initialize blink property for collision animation
        this.blinkingState = {
            isBlinking: false,
            lastBlinkTimeStamp: 0,
            blinkDuration: 1000, 
            blinkInterval: 100, 
            blinkOpacityLow: 0.3, 
            blinkOpacityHigh: 1, 
        };

        this.timer = {
            spinMove : 0
        }

    }

    // ---------------------------------------------------------------------------------- //
    // Helper functions
    // ---------------------------------------------------------------------------------- //
    private currentLane() {
        for (let i = 0; i < this.Lane.length - 1; i++) {
            if (this.position.x > this.Lane[i] && this.position.x < this.Lane[i+1]) {
                return i + 1;
            }
        }
        return -1;
    }

    private clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
    // ---------------------------------------------------------------------------------- //

    // ---------------------------------------------------------------------------------- //
    // Toothless Action Control Interface
    // ---------------------------------------------------------------------------------- //
    moveLeft() {
        if (this.currentLane() < 5 && this.state.action === ToothlessActions.Idle) {
            this.state.action = ToothlessActions.MovingLeft;
            this.state.targetLane = this.currentLane() + 1;
        }
    }

    doubleMoveLeft() {
        if (this.state.action === ToothlessActions.Idle){
            if (this.currentLane() < 4) {
                this.state.action = ToothlessActions.MovingLeftDouble;
                this.state.targetLane = this.currentLane() + 2;
            } else {
                this.moveLeft();
            }
        }
    }

    moveRight() {
        if (this.currentLane() > 1 && this.state.action === ToothlessActions.Idle) {
            this.state.action = ToothlessActions.MovingRight;
            this.state.targetLane = this.currentLane() - 1;
        }
    }

    doubleMoveRight() {
        if (this.state.action === ToothlessActions.Idle){
            if (this.currentLane() > 2) {
                this.state.action = ToothlessActions.MovingRightDouble;
                this.state.targetLane = this.currentLane() - 2;
            } else {
                this.moveRight();
            }
        } 
    }

    moveUp() {
    }

    moveDown() {
    }

    collide() { // plays collide animation
        // Start blinking on collision
        this.blinkingState.isBlinking = true;
        this.blinkingState.lastBlinkTimeStamp = this.Time; 
    }

    spinMove() {
        if (this.state.action === ToothlessActions.Idle) {
            this.state.action = ToothlessActions.SpinMove;
        }
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
    // ---------------------------------------------------------------------------------- //

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
        } else if (this.state.action === ToothlessActions.SpinMove){
            if (this.timer.spinMove == 0) {
                this.timer.spinMove = timeStamp;
            }
            this.state.rotation.z = 1;
            this.state.rotationSpeed = Speed.RotationSpinMove;
            if (timeStamp - this.timer.spinMove > Duration.SpinMove){
                this.state.rotation.z = 0;
                this.state.rotationSpeed = 0;
                this.state.action = ToothlessActions.Idle;
                this.timer.spinMove = 0;
                this.setRotationFromAxisAngle(new Vector3(0,0,0), 0);
            }
        }else {
            this.state.direction.x = 0
        }

        // Apply movement
        if (this.state.direction.lengthSq() > 0) {
            this.position.addScaledVector(this.state.direction.normalize(), this.state.speed * deltaTime);
            this.boundingBox.setFromCenterAndSize(this.position.clone(), this.boundingBox.max.clone().add(this.boundingBox.min.clone().multiplyScalar(-1)));
        }

        // Apply rotation
        if (this.rotation.z < 1 && this.rotation.z > -1 || this.state.action == ToothlessActions.MovingLeftDouble || this.state.action == ToothlessActions.MovingRightDouble || this.state.action == ToothlessActions.SpinMove){
            if (this.state.rotation.lengthSq() > 0) {
                this.rotateOnWorldAxis(new Vector3(1, 0, 0), this.state.rotation.x * this.state.rotationSpeed * deltaTime); // Rotate along X-axis
                this.rotateOnWorldAxis(new Vector3(0, 1, 0), this.state.rotation.y * this.state.rotationSpeed * deltaTime); // Rotate along Y-axis
                this.rotateOnWorldAxis(new Vector3(0, 0, 1), this.state.rotation.z * this.state.rotationSpeed * deltaTime); // Rotate along Z-axis
            }
        }

        // Overwrite rotation for smoother rotation when reaching target lane
        const transitionDist = 2;
        if ((this.state.action == ToothlessActions.MovingLeft || this.state.action == ToothlessActions.MovingRight ) && (Math.abs(this.position.x - this.LaneMiddle[this.state.targetLane - 1]) < transitionDist)) {
            this.setRotationFromAxisAngle(new Vector3(0,0,1), (this.position.x - this.LaneMiddle[this.state.targetLane - 1])/transitionDist);
        }

        // Add hard check so Toothless doesn't leave lanes
        const EPS = 0.01;
        this.position.setX(this.clamp(this.position.x, this.LaneMiddle[0]-EPS, this.LaneMiddle[4]+EPS));

        // Add blinking logic for collision
        if (this.blinkingState.isBlinking) {
            let timeSinceBlinkStart = timeStamp - this.blinkingState.lastBlinkTimeStamp;
            if (timeSinceBlinkStart < this.blinkingState.blinkDuration) {
                // Determine the opacity based on the current phase of the blink
                let phase = Math.floor(timeSinceBlinkStart / this.blinkingState.blinkInterval) % 2;
                let opacity = phase === 0 ? this.blinkingState.blinkOpacityLow : this.blinkingState.blinkOpacityHigh;       
                // Apply opacity to the model
                this.model.traverse((child) => {
                    if ((<THREE.Mesh> child).isMesh) {
                        const mesh = child as Mesh;
                        if (Array.isArray(mesh.material) && mesh.material[1] instanceof Material) {
                            mesh.material[1].transparent = true;
                            mesh.material[1].opacity = opacity;
                        }
                    }
                });         
            } else {
                // Stop blinking after the duration ends
                this.blinkingState.isBlinking = false;
                // Make sure model is fully transparent
                this.model.traverse((child) => {
                    if ((<THREE.Mesh> child).isMesh) {
                        const mesh = child as Mesh;
                        if (Array.isArray(mesh.material) && mesh.material[1] instanceof Material) {
                            mesh.material[1].transparent = true;
                            mesh.material[1].opacity = 1;
                        }
                    }
                });  
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
