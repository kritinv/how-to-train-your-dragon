import * as THREE from 'three';
// @ts-ignore
import { Sky } from 'three/addons/objects/Sky.js';

const sky = new Sky();
const sun = new THREE.Vector3(0, 0, 0);
sky.scale.setScalar(-450000);
const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 20,
};
const uniforms = sky.material.uniforms;
uniforms['turbidity'].value = effectController.turbidity;
uniforms['rayleigh'].value = effectController.rayleigh;
uniforms['mieCoefficient'].value = effectController.mieCoefficient;
uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;
const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
const theta = THREE.MathUtils.degToRad(effectController.azimuth);
sun.setFromSphericalCoords(1, phi, theta);
uniforms['sunPosition'].value.copy(sun);

export default sky;
