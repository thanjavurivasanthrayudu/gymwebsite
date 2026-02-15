import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Dumbbell() {
    const group = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (group.current) {
            group.current.rotation.y = t * 0.6
            group.current.rotation.x = Math.sin(t * 0.3) * 0.2
            group.current.position.y = Math.sin(t * 0.8) * 0.15
        }
    })

    const barMat = new THREE.MeshStandardMaterial({ color: '#888', metalness: 0.9, roughness: 0.2 })
    const plateMat = new THREE.MeshStandardMaterial({ color: '#39FF14', metalness: 0.7, roughness: 0.3, emissive: '#39FF14', emissiveIntensity: 0.15 })

    return (
        <group ref={group}>
            {/* Bar */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 3, 16]} />
                <primitive object={barMat} attach="material" />
            </mesh>
            {/* Left plates */}
            {[-1.2, -1.0].map((x, i) => (
                <mesh key={`l${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.4, 0.4, 0.12, 32]} />
                    <primitive object={plateMat} attach="material" />
                </mesh>
            ))}
            {/* Right plates */}
            {[1.2, 1.0].map((x, i) => (
                <mesh key={`r${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.4, 0.4, 0.12, 32]} />
                    <primitive object={plateMat} attach="material" />
                </mesh>
            ))}
        </group>
    )
}

export default function DumbbellModel() {
    return (
        <div className="w-full h-64 md:h-80">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#39FF14" />
                <pointLight position={[-5, -3, 3]} intensity={0.5} color="#ffffff" />
                <Dumbbell />
            </Canvas>
        </div>
    )
}
