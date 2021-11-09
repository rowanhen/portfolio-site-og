import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import guid from 'short-uuid'
import glsl from 'babel-plugin-glsl/macro'
import WaterTexture from '../textures/water-texture.png'


// This shader is from Bruno Simons Threejs-Journey: https://threejs-journey.xyz
class WaveyMaterial extends THREE.ShaderMaterial {
  constructor() {
    const textureLoader = new THREE.TextureLoader()
    const waterTexture = textureLoader.load(WaterTexture)
    const sunTexture = textureLoader.load(WaterTexture)
    super({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0.4,0.4) },
        uFrequency: { value: new THREE.Vector2(30, 5) },
        uColor: { value: 0 },
        uTexture: { value: waterTexture },
        uTexture2: { value: sunTexture },
        uResolution: { value: new THREE.Vector4(1,1,1,1) },
      },
      vertexShader: glsl`
      uniform vec2 uFrequency;
      uniform float time;

      varying vec2 vUv;
      varying float vElevation;

      void main()
      {
          vec4 modelPosition = modelMatrix * vec4(position, 0.1);

          float elevation = sin(modelPosition.x * uFrequency.x - time)*0.002;
          elevation += sin(modelPosition.y * uFrequency.y - time) * 0.001;

          modelPosition.y += elevation;

          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          vec4 projectedPositionRegular = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);


          gl_Position = projectedPositionRegular;

          vUv = uv;
          vElevation = elevation;
      }`,
      fragmentShader: glsl`
      uniform float uColor;
      uniform float time;
      uniform vec2 mouse;
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
        return (m * vec4(v, 1.0)).xyz;
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

      float sdf(vec3 p){
        vec3 p1 = rotate(p, vec3(1.0), time/4.0);
        float box = smin(sdBox(p1, vec3(0.1)), sdSphere(p,0.1), 0.9);
        float final = mix(box, box, 0.2);


        for(float i = 0.0; i < 20.0; i++) {
          float randOffset = rand(vec2(i, 0.0)); 
          float progr = 1.1 - fract(time/12.0 + randOffset*4.0);
          vec3 pos = vec3(sin(randOffset*4.0*PI), cos(randOffset*4.0*PI), 0.);
          float gotoCenter = sdSphere(p - pos * progr, 0.1*sin(PI*progr));
          final = smin(final, gotoCenter, 0.2);
        }



        float mouseSphere = sdSphere(p - vec3(mouse*uResolution.zw*2.0, 0.0), 0.1);
        return smin(mouseSphere, final, 0.2);
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
        vec3 bg = mix(vec3(0.0), vec3(0.0), dist);
        vec2 newUV = (vUv - vec2(0.5))*uResolution.zw + vec2(0.5);
        vec3 camPos = vec3(0.0,0.0,2.0);
        vec3 ray = normalize(vec3( (vUv - vec2(0.5)) * uResolution.zw, -1.0 ));

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
          color = texture2D(uTexture2, matcapUV).rgb;
          // color = vec3(1.0, 0.0, 0.0);
          // float fresnel = 1.0 + 1.0 * pow(1.0 + dot(ray, normal), 3.0);
          // color = mix(color, bg, fresnel);
        }

        gl_FragColor = vec4(color, 1.0);
      }`
    })
  }
  set time(v) { this.uniforms.time.value = v } // prettier-ignore
  get time() { return this.uniforms.time.value } // prettier-ignore
  set uColor(v) { this.uniforms.uColor.value = v } // prettier-ignore
  get uColor() { return this.uniforms.uColor.value } // prettier-ignore
  set mouse(v) { this.uniforms.mouse.value = v } // prettier-ignore
  get mouse() { return this.uniforms.mouse.value } // prettier-ignore
}

// This is the 🔑 that HMR will renew if this file is edited
// It works for THREE.ShaderMaterial as well as for drei/shaderMaterial
WaveyMaterial.key = guid.generate()
// Make the material available in JSX as <waveyMaterial />
extend({ WaveyMaterial })

export { WaveyMaterial }