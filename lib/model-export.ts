import * as THREE from "three"
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"

// Function to convert our parametric model to GLB format for download
export async function convertToGLB(modelData: any): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Create a scene
      const scene = new THREE.Scene()

      // Create geometry based on the model data
      let geometry
      switch (modelData.geometry) {
        case "SphereGeometry":
          geometry = new THREE.SphereGeometry(...modelData.parameters)
          break
        case "BoxGeometry":
          geometry = new THREE.BoxGeometry(...modelData.parameters)
          break
        case "CylinderGeometry":
          geometry = new THREE.CylinderGeometry(...modelData.parameters)
          break
        case "ConeGeometry":
          geometry = new THREE.ConeGeometry(...modelData.parameters)
          break
        case "TorusGeometry":
          geometry = new THREE.TorusGeometry(...modelData.parameters)
          break
        default:
          geometry = new THREE.BoxGeometry(1, 1, 1)
      }

      // Create material
      const material =
        modelData.material.type === "MeshStandardMaterial"
          ? new THREE.MeshStandardMaterial({
              color: modelData.material.color,
              metalness: modelData.material.metalness,
              roughness: modelData.material.roughness,
            })
          : new THREE.MeshPhysicalMaterial({
              color: modelData.material.color,
              metalness: modelData.material.metalness,
              roughness: modelData.material.roughness,
            })

      // Create mesh and add to scene
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      // Add a light
      const light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(1, 1, 1)
      scene.add(light)

      // Create exporter
      const exporter = new GLTFExporter()

      // Export to GLB
      exporter.parse(
        scene,
        (result) => {
          if (result instanceof ArrayBuffer) {
            const blob = new Blob([result], { type: "application/octet-stream" })
            resolve(blob)
          } else {
            reject(new Error("Failed to export model"))
          }
        },
        (error) => {
          reject(error)
        },
        { binary: true }, // Export as GLB
      )
    } catch (error) {
      reject(error)
    }
  })
}
