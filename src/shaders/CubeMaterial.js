import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import guid from 'short-uuid';
import glsl from 'babel-plugin-glsl/macro';

// This shader is from Bruno Simons Threejs-Journey: https://threejs-journey.xyz
class CubeMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.2, 0.2) },
        uFrequency: { value: new THREE.Vector2(30, 5) },
        uColor: { value: 0 },
        uResolution: { value: new THREE.Vector4(1, 1, 1, 1) },
        uColorStart: { value: new THREE.Color('#505050') },
        uColorEnd: { value: new THREE.Color('#505050') },
      },
      vertexShader: glsl`
      uniform vec2 uFrequency;
      uniform float uTime;
      varying vec2 vUv;
      varying float vElevation;
      void main()
      {
          vec4 modelPosition = modelMatrix * vec4(position, 0.1);
          float elevation = sin(modelPosition.x * uFrequency.x - uTime)*0.002;
          elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.001;
          modelPosition.y += elevation;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          vec4 projectedPositionRegular = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
          gl_Position = projectedPositionRegular;
          vUv = uv;
          vElevation = elevation;
      }`,
      fragmentShader: glsl`
      #pragma glslify: cnoise3 = require(glsl-noise/classic/3d.glsl)
      uniform vec3 uColorStart;
      uniform vec3 uColorEnd;
      uniform float uColor;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uProgess;
      uniform sampler2D uTexture;
      uniform sampler2D uTexture2;
      uniform vec4 uResolution;
      varying vec2 vUv;
      float PI = 3.141592653589793238;
      vec2 getMatcap(vec3 eye, vec3 normal) {
        vec3 reflected = reflect(eye, normal);
        float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
        return reflected.xy / m + 0.5;
      }
      mat4 rotationMatrix(vec3 axis, float angle) {
        axis = normalize(axis);
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                    0.0,                                0.0,                                0.0,                                1.0);
      }
      vec3 rotate(vec3 v, vec3 axis, float angle) {
        mat4 m = rotationMatrix(axis, angle);
        return (m * vec4(v, 1.9)).xyz;
      }
      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }
      float smin( float a, float b, float k )
      {
          float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
          return mix( b, a, h ) - k*h*(1.0-h);
      }
      float sdSphere( vec3 p, float r ){
        return length(p)-r;
      }
      float sdBox( vec3 p, vec3 b )
      {
        vec3 q = abs(p) - b;
        return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
      }
      float sdTorus( vec3 p, vec2 t )
      {
        vec2 q = vec2(length(p.xz)-t.x,p.y);
        return length(q)-t.y;
      }
      float sdf(vec3 p){
        vec3 p1 = rotate(p, vec3(2.0, 1.0, 0.9), 2.0);
        float box = smin(sdBox(p1, vec3(0.3)), sdSphere(p,0.1), 0.1);
        float newBox = sdSphere(p - vec3(0.4,0.4, 0.3), 0.2);
        vec2 t2 = vec2(0.6, 0.15);
        float torus = sdTorus(p1, t2);
        float mouseSphere = sdSphere(p - vec3(uMouse*uResolution.zw*2.0, 0.0), 0.1);
        return smin(mouseSphere, box, 0.6);
      }
      vec3 calcNormal( in vec3 p ) // for function f(p)
      {
          const float eps = 0.0001; // or some other value
          const vec2 h = vec2(eps,0);
          return normalize( vec3(sdf(p+h.xyy) - sdf(p-h.xyy),
                                 sdf(p+h.yxy) - sdf(p-h.yxy),
                                 sdf(p+h.yyx) - sdf(p-h.yyx) ) );
      }
      void main()
      {
        float dist = length(vUv - vec2(0.5));
        vec3 bg = mix(vec3(1.0), vec3(1.0), dist);
        vec2 newUV = (vUv - vec2(0.5))*uResolution.zw + vec2(0.5);
        vec3 camPos = vec3(0.0,0.0,2.0);
        vec3 ray = normalize(vec3( (vUv - vec2(0.5, 0.5)) * uResolution.zw, -1.0));
        vec3 rayPos = camPos;
        float t = 0.0;
        float tMax = 5.0;
        for(int i=0; i<256; i++){
          vec3 pos = camPos + t*ray;
          float h = sdf(pos);
          if(h < 0.001 || t > tMax) break;
          t += h;
        }
        vec3 color = bg;
        if(t < tMax) {
          vec3 pos = camPos + t*ray;
          color = vec3(1.0);
          vec3 normal = calcNormal(pos);
          color = normal;
          float diff = dot(vec3(1.0), normal);
          vec2 matcapUV = getMatcap(ray, normal);
          color = vec3(diff);
          color = vec3(matcapUV, uColor);
          // color = texture2D(uTexture2, matcapUV).rgb;
          // color = vec3(1.0, 1.0, 1.0);
          // float fresnel = 1.0 + 1.0 * pow(1.0 + dot(ray, normal), 3.0);
          // color = mix(color, bg, fresnel);
        }
        gl_FragColor = vec4(color, 1.0);
      }`,
    });
  }
  set uTime(v) { this.uniforms.uTime.value = v } // prettier-ignore
  get uTime() { return this.uniforms.uTime.value } // prettier-ignore
  set uColor(v) { this.uniforms.uColor.value = v } // prettier-ignore
  get uColor() { return this.uniforms.uColor.value } // prettier-ignore
  set uMouse(v) { this.uniforms.uMouse.value = v } // prettier-ignore
  get uMouse() { return this.uniforms.uMouse.value } // prettier-ignore
  set uColorStart(v) { this.uniforms.uColorStart.value = v } // prettier-ignore
  get uColorStart() { return this.uniforms.uColorStart.value } // prettier-ignore
  set uColorEnd(v) { this.uniforms.uColorEnd.value = v } // prettier-ignore
  get uColorEnd() { return this.uniforms.uColorEnd.value } // prettier-ignore
}

// This is the 🔑 that HMR will renew if this file is edited
// It works for THREE.ShaderMaterial as well as for drei/shaderMaterial
CubeMaterial.key = guid.generate();
// Make the material available in JSX as <CubeMaterial />
extend({ CubeMaterial });

export { CubeMaterial };
