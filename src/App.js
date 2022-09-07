import * as THREE from 'three';
import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { PageContent } from './components/MainContent';
import { NoiseMaterial } from './shaders/NoiseMaterial';
import { AsciiRenderer } from './shaders/AsciiRenderer';
import useWindowSize from './hooks/useWindowSize';

const Wave = ({ position, uColor }) => {
  const ref = useRef();
  const { width, height } = useThree((state) => state.viewport);

  const windowSize = useWindowSize();

  const NoiseValuesDesktop = { value1: 5.0, value2: 10.0 };
  const NoiseValuesMobile = { value1: 1.0, value2: 3.0 };

  useFrame((state, delta) => {
    ref.current.uTime += delta;
    if (state.mouse) {
      document.addEventListener('mousemove', (event) => {
        ref.current.uMouse.x = event.clientX / state.size.width - 0.5;
        ref.current.uMouse.y = -event.clientY / state.size.height + 0.5;
      });
    }

    document.addEventListener('touchmove', (event) => {
      const x = event.touches[0].clientX / state.size.width - 0.5;
      const y = -event.touches[0].clientY / state.size.height + 0.5;
      ref.current.uMouse.x = x;
      ref.current.uMouse.y = y;
    });
  });
  return (
    <mesh position={position} frustumCulled={false} scale={[width, height, 1]}>
      <planeBufferGeometry args={[1, 1, 128, 128]} />
      {/* <cubeMaterial
        uColor={uColor}
        ref={ref}
        side={THREE.DoubleSide}
        key={CubeMaterial.key}
      /> */}
      <noiseMaterial
        ref={ref}
        uNoiseValue1={
          windowSize.width < 1000
            ? NoiseValuesMobile.value1
            : NoiseValuesDesktop.value1
        }
        uNoiseValue2={
          windowSize.width < 1000
            ? NoiseValuesMobile.value2
            : NoiseValuesDesktop.value2
        }
        side={THREE.DoubleSide}
        uColor={uColor}
        key={NoiseMaterial.key}
        uColorStart={'white'}
        uColorEnd={'red'}
      />
    </mesh>
  );
};

export const Scene = () => {
  return (
    <>
      <Wave position={[0, 0, 0]} uColor={0.3} />
    </>
  );
};

export default function App() {
  return (
    <>
      <div className="canvasContainer">
        <Canvas shadows>
          <Suspense fallback={null}>
            <Scene />
            <AsciiRenderer />
          </Suspense>
        </Canvas>
      </div>
      <PageContent />
      <Loader />
    </>
  );
}
