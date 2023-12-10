import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

const cloudShader = {
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D map;
        uniform vec3 fogColor;
        uniform float fogNear;
        uniform float fogFar;
        varying vec2 vUv;

        void main() {
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            float fogFactor = smoothstep(fogNear, fogFar, depth);

            gl_FragColor = texture2D(map, vUv);
            gl_FragColor.w *= pow(gl_FragCoord.z, 20.0);
            gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
        }
    `,
};

// Texture
const tLoader = new THREE.TextureLoader();
const texture = tLoader.load(
    'https://mrdoob.com/lab/javascript/webgl/clouds/cloud10.png'
);
texture.magFilter = THREE.LinearMipMapLinearFilter;
texture.minFilter = THREE.LinearMipMapLinearFilter;

// Fog
const fog = new THREE.Fog(0xffffff, -100, -8000);

// Create Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        map: { type: 't', value: texture },
        fogColor: { type: 'c', value: fog.color },
        fogNear: { type: 'f', value: fog.near },
        fogFar: { type: 'f', value: fog.far },
    },
    vertexShader: cloudShader.vertexShader,
    fragmentShader: cloudShader.fragmentShader,
    depthWrite: false,
    depthTest: true,
    transparent: true,
});

material.side = THREE.DoubleSide;

// Creates Plane Geometry
const planeGeo = new THREE.PlaneGeometry(64, 64);

const geometries = [];
const planeObj = new THREE.Object3D();

for (let i = 0; i < 8000; i++) {
    planeObj.position.x = Math.random() * 4000 - 2000;
    planeObj.position.y = -Math.random() * Math.random() * 200 - 100;
    planeObj.position.z = -i;
    planeObj.rotation.z = Math.random() * Math.PI;
    planeObj.scale.x = planeObj.scale.y =
        Math.random() * Math.random() * 5 + 0.5;
    planeObj.updateMatrix();

    const clonedPlaneGeo = planeGeo.clone();
    clonedPlaneGeo.applyMatrix4(planeObj.matrix);

    console.log(clonedPlaneGeo);

    geometries.push(clonedPlaneGeo);
}

// Create Plane Object
const planeGeos = BufferGeometryUtils.mergeGeometries(geometries);
const cloud = new THREE.Mesh(planeGeos, material);
cloud.position.z = 8000; // Set it to your desired negative z position

export default cloud;
