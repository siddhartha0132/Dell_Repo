import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Grid } from '@react-three/drei'
import { useRef } from 'react'

function Scene() {
  const group = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Subtle rotation to simulate movement over the grid
    group.current.rotation.y = Math.sin(t / 8) / 10
    group.current.rotation.x = Math.cos(t / 8) / 15
    // Slowly move the grid forward
    group.current.position.z = (t * 0.5) % 10
  })

  return (
    <group ref={group}>
      <Grid 
        infiniteGrid 
        fadeDistance={50} 
        sectionColor="#2563eb" // dell-blue
        sectionThickness={1}
        cellColor="#020617" 
        cellThickness={0.5}
        position={[0, -3, 0]} 
      />
      <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </group>
  )
}

export default function WinterfellBackground() {
  return (
    <div className="absolute inset-0 bg-[#000511] pointer-events-none">
      <Canvas camera={{ position: [0, 2, 15], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
