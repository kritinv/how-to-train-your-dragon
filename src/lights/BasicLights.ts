import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor() {
        // Invoke parent Group() constructor
        super();

        const dir = new SpotLight(0xffffff, 55, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.32);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        dir.position.set(0, 1, 0);
        dir.target.position.set(0, -3, 0);

        this.add(ambi, hemi, dir);
    }
}

export default BasicLights;
