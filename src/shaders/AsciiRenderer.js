import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { AsciiEffect } from './AsciiEffect';

export function AsciiRenderer({
  renderIndex = 1,
  characters = ' _____',
  ...options
}) {
  // Reactive state
  const { size, gl, scene, camera } = useThree();

  // Create effect
  const effect = useMemo(() => {
    const effect = new AsciiEffect(gl, characters, options);
    effect.domElement.style.position = 'absolute';
    effect.domElement.style.top = '0px';
    effect.domElement.style.left = '0px';
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = '#003cff';
    effect.domElement.style.pointerEvents = 'none';
    return effect;
  }, [characters, gl, options]);

  // Append on mount, remove on unmount
  useEffect(() => {
    gl.domElement.parentNode.appendChild(effect.domElement);
    return () => gl.domElement.parentNode.removeChild(effect.domElement);
  }, [effect, gl.domElement.parentNode]);

  // Set size
  useEffect(() => {
    effect.setSize(size.width, size.height);
  }, [effect, size]);

  // Take over render-loop (that is what the index is for)
  useFrame((state) => {
    effect.render(scene, camera);
  }, renderIndex);

  // This component has no view, it is a logical component
  return null;
}
