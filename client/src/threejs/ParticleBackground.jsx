import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 600 }) {
    const mesh = useRef()
    const particles = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const col = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 25
            pos[i * 3 + 1] = (Math.random() - 0.5) * 25
            pos[i * 3 + 2] = (Math.random() - 0.5) * 25
            col[i * 3] = 0.22 + Math.random() * 0.1
            col[i * 3 + 1] = 1
            col[i * 3 + 2] = 0.08 + Math.random() * 0.1
        }
        return { pos, col }
    }, [count])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (mesh.current) {
            mesh.current.rotation.x = t * 0.03
            mesh.current.rotation.y = t * 0.05
            const p = mesh.current.geometry.attributes.position.array
            for (let i = 0; i < count; i++) p[i * 3 + 1] += Math.sin(t + i * 0.05) * 0.001
            mesh.current.geometry.attributes.position.needsUpdate = true
        }
    })

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={particles.pos} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={count} array={particles.col} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    )
}

function FloatingRing({ position, speed = 1 }) {
    const ref = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (ref.current) {
            ref.current.rotation.x = t * 0.4 * speed
            ref.current.rotation.z = t * 0.2 * speed
            ref.current.position.y = position[1] + Math.sin(t * speed) * 0.3
        }
    })
    return (
        <mesh ref={ref} position={position}>
            <torusGeometry args={[1, 0.02, 16, 100]} />
            <meshBasicMaterial color="#39FF14" transparent opacity={0.15} />
        </mesh>
    )
}

export default function ParticleBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 10], fov: 55 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
                <Particles />
                <FloatingRing position={[-4, 2, -3]} speed={0.7} />
                <FloatingRing position={[5, -2, -5]} speed={1.1} />
                <FloatingRing position={[0, 4, -6]} speed={0.5} />
            </Canvas>
        </div>
    )
}
