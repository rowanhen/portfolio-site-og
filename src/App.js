import * as THREE from 'three'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { EffectComposer, HueSaturation, Pixelation, DotScreen  } from '@react-three/postprocessing'
import { WaveyMaterial } from './shaders/waveymaterial'
import SmoothScroll from './components/smoothscroll/SmoothScroll'
import Section from './components/section/Section'
import './styles/pagecontent.css';




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
        <DotScreen angle={Math.PI * 4.0} scale={4.3} />
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
      <Wave position={[0,0,0]} uColor={0.0} />
    </>
  )
}

const PageContent = () => {
  return (
    <SmoothScroll>
      <Section flexDirection="row">
        <div className="page_01_wrapper">
          <div className="page_01_sectioning">01</div>
          <div className="page_01_title">Rowan Henseleit</div>
          <div className="page_01_detail">Junior Software Engineer & Creative Coder</div>
        </div>
      </Section>
      <Section flexDirection="row-reverse">
        <div className="page_01_wrapper">
          <div className="page_01_sectioning">02</div>
          <div className="page_01_title">Skills</div>
          <div className="page_01_detail">Competent React & JS Developer specialising in Front-End Development</div>
        </div>
      </Section>
      <Section flexDirection="row">
        <div className="page_01_wrapper">
          <div className="page_01_sectioning">03</div>
          <div className="page_01_title">Projects</div>
          <div className="page_01_detail">
            <div onClick={() => window.open("https://warmm.co.uk", "_blank").focus()}>https://warmm.co.uk</div>
            <div onClick={() => window.open("https://vitalstudios.co", "_blank").focus()}>https://vitalstudios.co</div>
            <div onClick={() => window.open("https://prototype26.netlify.app", "_blank").focus()}>https://prototype26.netlify.app</div>
          </div>
        </div>
      </Section>
      <Section flexDirection="row-reverse">
        <div className="page_01_wrapper">
          <div className="page_01_sectioning">04</div>
          <div className="page_01_title">Contact</div>
          <div className="page_01_detail">
            <div onClick={() => window.open("https://warmm.co.uk", "_blank").focus()}>Email: rwnhnslt@gmail.com</div>
            <div onClick={() => window.open("https://www.linkedin.com/in/rowan-henseleit/", "_blank").focus()}>LinkedIn</div>
          </div>
        </div>
      </Section>
    </SmoothScroll>
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