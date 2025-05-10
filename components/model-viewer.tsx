"use client"
import { useState, useEffect, useRef, Suspense } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Center } from "@react-three/drei"
import * as THREE from "three"

// Component to load and display GLB models
function GlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />
}

// Component to create a parametric model from JSON
function ParametricModel({ url }: { url: string }) {
  const [modelData, setModelData] = useState<any>(null)
  const modelRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  useEffect(() => {
    async function loadModel() {
      try {
        const response = await fetch(url)
        const data = await response.json()
        setModelData(data)
      } catch (error) {
        console.error("Error loading model data:", error)
      }
    }

    loadModel()
  }, [url])

  useEffect(() => {
    if (modelRef.current && modelData) {
      // Auto-position camera to view the model
      const box = new THREE.Box3().setFromObject(modelRef.current)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = camera.fov * (Math.PI / 180)
      const cameraZ = Math.abs(maxDim / Math.sin(fov / 2))

      camera.position.set(center.x, center.y, center.z + cameraZ * 1.5)
      camera.lookAt(center)
      camera.updateProjectionMatrix()
    }
  }, [modelData, camera])

  if (!modelData) return null

  // Create geometry based on the model data
  let geometry
  switch (modelData.geometry) {
    case "SphereGeometry":
      geometry = <sphereGeometry args={modelData.parameters} />
      break
    case "BoxGeometry":
      geometry = <boxGeometry args={modelData.parameters} />
      break
    case "CylinderGeometry":
      geometry = <cylinderGeometry args={modelData.parameters} />
      break
    case "ConeGeometry":
      geometry = <coneGeometry args={modelData.parameters} />
      break
    case "TorusGeometry":
      geometry = <torusGeometry args={modelData.parameters} />
      break
    default:
      geometry = <boxGeometry />
  }

  // Create material based on the model data
  const materialProps = {
    color: modelData.material.color,
    metalness: modelData.material.metalness,
    roughness: modelData.material.roughness,
  }

  return (
    <mesh ref={modelRef}>
      {geometry}
      {modelData.material.type === "MeshStandardMaterial" ? (
        <meshStandardMaterial {...materialProps} />
      ) : (
        <meshPhysicalMaterial {...materialProps} />
      )}
    </mesh>
  )
}

export function ModelViewer({ modelUrl }: { modelUrl: string }) {
  const isGlb = modelUrl.endsWith(".glb")

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <Center>{isGlb ? <GlbModel url={modelUrl} /> : <ParametricModel url={modelUrl} />}</Center>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  )
}
