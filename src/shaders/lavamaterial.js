import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import guid from 'short-uuid'
import glsl from 'babel-plugin-glsl/macro'

// This shader is from Bruno Simons Threejs-Journey: https://threejs-journey.xyz
class LavaMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        colorStart: { value: new THREE.Color('red') },
        colorEnd: { value: new THREE.Color('yellow') }
      },
      vertexShader: glsl`
      varying vec2 vUv;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
        vUv = uv;
      }`,
      fragmentShader: glsl`
      #pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl) 
      uniform float time;
      uniform vec3 colorStart;
      uniform vec3 colorEnd;
      uniform sampler2D uTexture;
      varying vec2 vUv;
      vec2 normalize(vec2 vUv);
      void main() {
        vec2 displacedUv = vUv + cnoise3(vec3(vUv * 7.0, time * 0.05));
        float strength = cnoise3(vec3(displacedUv * 3.0, time * 0.12));
        strength += step(-1.2, strength) * 0.4;
        strength = clamp(strength, 0.0, 1.0);
        vec3 color = mix(colorStart, colorEnd, strength);
        gl_FragColor = vec4(color, 1.0);
      }`
    })
  }

  set time(v) { this.uniforms.time.value = v } // prettier-ignore
  get time() { return this.uniforms.time.value } // prettier-ignore
  get colorStart() { return this.uniforms.colorStart.value } // prettier-ignore
  get colorEnd() { return this.uniforms.colorEnd.value } // prettier-ignore
}

// This is the 🔑 that HMR will renew if this file is edited
// It works for THREE.ShaderMaterial as well as for drei/shaderMaterial
LavaMaterial.key = guid.generate()
// Make the material available in JSX as <lavaMaterial />
extend({ LavaMaterial })

export { LavaMaterial }