import React from 'react'
import { useReflow } from '@react-three/flex'
import { Text as TextImpl } from '@react-three/drei'

export default function Text({ bold = false, anchorX = 'left', anchorY = 'top', textAlign = 'left', ...props }) {
  const reflow = useReflow()
  return <TextImpl anchorX={anchorX} anchorY={anchorY} textAlign={textAlign} onSync={reflow} {...props} />
}