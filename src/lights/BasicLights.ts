import { Group, SpotLight, AmbientLight, HemisphereLight, DirectionalLight} from 'three';

class BasicLights extends Group {
    constructor() {
        // Invoke parent Group() constructor
        super();

        const dir = new SpotLight(0xffffff, 55, 7, 0.8, 1, 1);
        const ambi = new AmbientLight('white', 5);
        const mainLight = new DirectionalLight('white', 10);
            
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        mainLight.position.set(10, 10, 10);
        dir.position.set(0, 2, 0);
        dir.target.position.set(0, -3, 0);

        this.add(ambi, hemi, dir, mainLight);
    }
}

export default BasicLights;
