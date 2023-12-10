// cloudGenerator.ts
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

const cloudShader = {
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
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
      float fogFactor = smoothstep( fogNear, fogFar, depth );

      gl_FragColor = texture2D( map, vUv );
      gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
      gl_FragColor = mix( gl_FragColor, vec4( fogColor , gl_FragColor.w ), fogFactor );

    }
  `,
};

const tLoader = new THREE.TextureLoader();
let cloud2;

function initializeCloud() {
    const texture = tLoader.load(
        'https://mrdoob.com/lab/javascript/webgl/clouds/cloud10.png'
    );
    texture.colorSpace = THREE.SRGBColorSpace;

    // Your existing initialization code
    const planeGeo = new THREE.PlaneGeometry(64, 64);
    const planeObj = new THREE.Object3D();
    const geometries = [];

    for (let i = 0; i < 8000; i++) {
        planeObj.position.x = Math.random() * 1000 - 500;
        planeObj.position.y = -Math.random() * Math.random() * 200 - 15;
        planeObj.position.z = i;
        planeObj.rotation.z = Math.random() * Math.PI;
        planeObj.scale.x = planeObj.scale.y =
            Math.random() * Math.random() * 1.5 + 0.5;
        planeObj.updateMatrix();

        const clonedPlaneGeo = planeGeo.clone();
        clonedPlaneGeo.applyMatrix4(planeObj.matrix);

        geometries.push(clonedPlaneGeo);
    }

    const planeGeos = BufferGeometryUtils.mergeGeometries(geometries);

    const fog = new THREE.Fog(0x4584b4, -100, 3000);

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
        depthTest: false,
        transparent: true,
    });

    const cloud1 = new THREE.Mesh(planeGeos, material);
    cloud2 = cloud1.clone();
}

initializeCloud();

export default cloud2;
