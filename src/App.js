import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { EffectComposer, HueSaturation, Pixelation, DotScreen  } from '@react-three/postprocessing'
import { WaveyMaterial } from './shaders/waveymaterial'
// import { Content } from './components/content'
// import state from './components/state'



const PostEffects = () => {
  return (
      <EffectComposer>
        {/* <Noise opacity={0.01} /> */}
        <HueSaturation
          hue={0} // hue in radians
          saturation={0.1} // saturation in radians
        />
        <Pixelation
          granularity={0} // pixel granularity
        />
        <DotScreen angle={Math.PI * 2.} scale={1.3} />
      </EffectComposer>
  )
}

const Wave = ({position, uColor}) => {
    const ref = useRef()
    const { width, height } = useThree((state) => state.viewport)
      useFrame((state, delta) => {
      ref.current.time += delta*2
      if (state.mouse) {
        document.addEventListener('mousemove', (event) => {
          ref.current.mouse.x = event.clientX/(state.size.width) - 0.5
          ref.current.mouse.y = - event.clientY/(state.size.height) + 0.5
        });
        // ref.current.mouse.x = state.mouse.x
        // ref.current.mouse.y = state.mouse.y
      }
      // console.log(state)
    })
    return (
      <mesh position={position} frustumCulled={false} scale={[width, height, 1]} >
        <planeBufferGeometry args={[1, 1, 128, 128]} />
        <waveyMaterial uColor={uColor} ref={ref} side={THREE.DoubleSide} key={WaveyMaterial.key} />
      </mesh>
    );
}

//TODO: create loop or map to create Wave component with random color/texture and also random positioning of gotocentre blobs

export const Scene = () => {
  return (
    <>
      <Wave position={[0,0,0]} uColor={0.0} />
    </>
  )
}


export default function App() {
  // const scrollArea = useRef()
  // const onScroll = (e) => (state.top = e.target.scrollTop)
  // useEffect(() => void onScroll({ target: scrollArea.current }), [])
  // const [pages, setPages] = useState(0)
  return (
    <>
      <Canvas shadows className="artwork" >
        <PostEffects />
        <Suspense fallback={null}>
            {/* <Content onReflow={setPages} /> */}
            <Scene />
        </Suspense>
      </Canvas>
      {/* <div
        className="scrollArea"
        ref={scrollArea}
        onScroll={onScroll}
        onPointerMove={(e) => (state.mouse = [(e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1])}>
        <div style={{ height: `${pages * 100}vh` }} />
      </div> */}
      <Loader />
    </>
  )
}