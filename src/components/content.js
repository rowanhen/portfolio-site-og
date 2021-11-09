import * as THREE from 'three'
import React, { useRef, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Flex, Box } from '@react-three/flex'
import Text from './text'
import state from './state'


  function Page({ text, detail, tag, textScaleFactor, left = false }) {
    const { viewport } = useThree()
    return (
      <Box dir="column" align={left ? 'flex-start' : 'flex-end'} justify="flex-start" width="100%" height="auto" minHeight="100%">
        <Box marginLeft={1} marginRight={1} marginTop={2}>
            <Text position={[left ? 1 : -1, 0.5, 0.5]} fontSize={textScaleFactor} lineHeight={1} letterSpacing={-0.05} maxWidth={(viewport.width / 4) * 3}>
            {tag}
            </Text>
        </Box>
        <Box marginLeft={left ? 0.7: 0.7} marginRight={left ? 0.7 : 0.7} marginBottom={0.7}>
          <Text
            position-z={0.2}
            textAlign={left ? 'left' : 'right'}
            fontSize={1.5 * textScaleFactor}
            lineHeight={1}
            letterSpacing={-0.05}
            maxWidth={(viewport.width / 4) * 3}>
            {text}
          </Text>
        </Box>
        <Box marginLeft={left ? 0.7 : 0.7} marginRight={left ? 0.7 : 0.7} marginBottom={1}>
          <Text
            position-z={0.0}
            textAlign={left ? 'left' : 'right'}
            fontSize={1.0 * textScaleFactor}
            lineHeight={1}
            letterSpacing={-0.05}
            maxWidth={(viewport.width / 4) * 3}>
            {detail}
          </Text>
        </Box>
      </Box>
    )
  }
  
  export function Content({ onReflow }) {
    const group = useRef()
    const { viewport, size } = useThree()
    const vec = new THREE.Vector3()
    const pageLerp = useRef(state.top / size.height)
    useFrame(() => {
      const page = (pageLerp.current = THREE.MathUtils.lerp(pageLerp.current, state.top / size.height, 0.1))
      const y = page * viewport.height
      const sticky = state.threshold * viewport.height
      group.current.position.lerp(vec.set(0, page < state.threshold ? y : sticky, page < state.threshold ? 0 : page * 1.25), 0.15)
    })
    const handleReflow = useCallback((w, h) => onReflow((state.pages = h / viewport.height + 0)), [onReflow, viewport.height])
    const scale = Math.min(1, viewport.width / 16)
    // console.log(viewport.width)
    return (
      <group ref={group}>
        <Flex dir="column" position={[-viewport.width / 2, viewport.height / 2, 0]} size={[viewport.width, viewport.height, 0]} onReflow={handleReflow}>
          {state.content.map((props, index) => (
            <Page
              key={index}
              left={!(index % 2)}
              textScaleFactor={scale}
              {...props}
            />
          ))}
        </Flex>
      </group>
    )
  }