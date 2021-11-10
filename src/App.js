import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { EffectComposer, HueSaturation, Pixelation, DotScreen  } from '@react-three/postprocessing'
import { WaveyMaterial } from './shaders/waveymaterial'
import { PageContent } from './components/maincontent'




const PostEffects = () => {
  return (
      <EffectComposer>
        {/* <Noise opacity={0.01} /> */}
        <HueSaturation
          hue={-0.3} // hue in radians
          saturation={0.3} // saturation in radians
        />
        <Pixelation
          granularity={0} // pixel granularity
        />
        <DotScreen angle={Math.PI * 4.0} scale={4.3} />
      </EffectComposer>
  )
}

const Wave = ({position, uColor}) => {
      const ref = useRef()
      const { width, height } = useThree((state) => state.viewport)

      useFrame((state, delta) => {
      ref.current.time += delta
      if (state.mouse) {
        document.addEventListener('mousemove', (event) => {
          ref.current.mouse.x = event.clientX/(state.size.width) - 0.5
          ref.current.mouse.y = - event.clientY/(state.size.height) + 0.5
        });
      }
      document.addEventListener('touchmove', (event) => {
        var x = event.touches[0].clientX/(state.size.width) - 0.5;
        var y =  - event.touches[0].clientY/(state.size.height) + 0.5;
        ref.current.mouse.x = x
        ref.current.mouse.y = y
      });
    })
    return (
      <mesh position={position} frustumCulled={false} scale={[width, height, 1]} onClick={() => console.log("please work")} >
        <planeBufferGeometry args={[1, 1, 128, 128]} />
        <waveyMaterial uColor={uColor} ref={ref} side={THREE.DoubleSide} key={WaveyMaterial.key} />
      </mesh>
    );
}

export const Scene = () => {
  return (
    <>
      <Wave position={[0,0,0]} uColor={0.3} />
    </>
  )
}

export default function App() {
  return (
    <>
      <PageContent />
      <div className="artwork">
      <Canvas shadows >
        <PostEffects />
        <Suspense fallback={null}>
            <Scene />
        </Suspense>
      </Canvas>
      </div>
      <Loader />
    </>
  )
}