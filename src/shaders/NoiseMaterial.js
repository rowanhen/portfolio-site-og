import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import glsl from 'babel-plugin-glsl/macro';

const NoiseMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color('#505050'),
    uColorEnd: new THREE.Color('red'),
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uFrequency: { value: new THREE.Vector2(30, 5) },
    uColor: { value: 0 },
    uResolution: { value: new THREE.Vector4(1, 1, 1, 1) },
    uNoiseValue1: { value: 0 },
    uNoiseValue2: { value: 0 },
  },
  glsl`
      varying vec2 vUv;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
        vUv = uv;
      }`,
  glsl`
      #pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl)
      uniform float uTime;
      uniform float uProgess;
      uniform float uNoiseValue1;
      uniform float uNoiseValue2;
      uniform vec2 uMouse;
      uniform vec3 uColorStart;
      uniform vec3 uColorEnd;
      uniform vec4 uResolution;
      varying vec2 vUv;
      float PI = 3.141592653589793238;
      void main() {
        vec2 displacedUv = vUv + cnoise3(vec3(vUv * uNoiseValue1, uTime * 0.1 + uMouse.x - uMouse.y));
        float strength = cnoise3(vec3(displacedUv * uNoiseValue2, uTime * 0.1 + uMouse.x - uMouse.y));
        float outerGlow = distance(vUv, vec2(0.5)) * 1.0 - 0.2;
        strength += outerGlow;
        strength += step(-0.0, strength) * 0.6;
        strength = clamp(strength, 0.0, 1.0);
        vec3 color = mix(uColorStart, uColorEnd, strength);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <encodings_fragment>
      }`
);

extend({ NoiseMaterial });

export { NoiseMaterial };
