import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { put } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"
import { auth } from "./auth"

// This function generates a 3D model using a parametric approach
export async function generateModel(description: string): Promise<string> {
  try {
    // Step 1: Generate a more detailed technical description using Groq
    const { text: technicalDescription } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: `
        You are a 3D modeling expert. Convert this description into a detailed technical specification for a 3D model:
        "${description}"
        
        Format your response as a JSON object with these properties:
        - geometry: detailed description of the shape and structure
        - dimensions: approximate width, height, depth in relative units
        - colors: main colors in hex format
        - materials: types of materials (metal, plastic, wood, etc.)
        - complexity: a number from 1-10 indicating model complexity
        
        ONLY return the JSON object, nothing else.
      `,
      temperature: 0.2,
      maxTokens: 1000,
    })

    // Parse the technical description
    let modelSpec
    try {
      modelSpec = JSON.parse(cleanJsonString(technicalDescription))
    } catch (error) {
      console.error("Error parsing model specification:", error)
      console.log("Raw response:", technicalDescription)

      // Fallback to a basic model specification
      modelSpec = {
        geometry: description,
        dimensions: { width: 1, height: 1, depth: 1 },
        colors: ["#3498db"],
        materials: ["plastic"],
        complexity: 5,
      }
    }

    // Step 2: Generate a parametric 3D model based on the specification
    const modelCode = await generateModelCode(modelSpec)

    // Step 3: Create a unique filename for the model
    const session = await auth()
    const userId = session?.user?.id || "anonymous"
    const filename = `${userId}/${uuidv4()}.json`

    // Step 4: Store the model code in Vercel Blob
    const blob = await put(filename, JSON.stringify(modelCode), {
      access: "public",
      contentType: "application/json",
    })

    return blob.url
  } catch (error) {
    console.error("Error in model generation:", error)
    // Fallback to a basic model if generation fails
    return "/assets/3d/duck.glb"
  }
}

// Helper function to clean up JSON string from LLM output
function cleanJsonString(str: string): string {
  // Remove markdown code blocks if present
  let cleaned = str.replace(/```json|```/g, "").trim()

  // Handle case where the model might add text before or after the JSON
  const jsonStart = cleaned.indexOf("{")
  const jsonEnd = cleaned.lastIndexOf("}")

  if (jsonStart >= 0 && jsonEnd >= 0) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
  }

  return cleaned
}

// Generate Three.js code for creating a parametric 3D model
async function generateModelCode(spec: any) {
  // This is a simplified version that creates a basic model based on the specification
  // In a real implementation, this would be much more sophisticated

  const baseGeometry = typeof spec.geometry === "string" ? spec.geometry.toLowerCase() : "box"
  const complexity = spec.complexity || 5
  const mainColor = Array.isArray(spec.colors) && spec.colors.length > 0 ? spec.colors[0] : "#3498db"

  // Create a basic model based on the description
  let geometry
  let parameters

  if (baseGeometry.includes("sphere") || baseGeometry.includes("ball") || baseGeometry.includes("round")) {
    geometry = "SphereGeometry"
    parameters = [1, 32 * (complexity / 5), 32 * (complexity / 5)]
  } else if (baseGeometry.includes("cube") || baseGeometry.includes("box")) {
    geometry = "BoxGeometry"
    parameters = [1, 1, 1, complexity, complexity, complexity]
  } else if (baseGeometry.includes("cylinder") || baseGeometry.includes("tube")) {
    geometry = "CylinderGeometry"
    parameters = [0.5, 0.5, 1, 32 * (complexity / 5)]
  } else if (baseGeometry.includes("cone")) {
    geometry = "ConeGeometry"
    parameters = [0.5, 1, 32 * (complexity / 5)]
  } else if (baseGeometry.includes("torus") || baseGeometry.includes("donut") || baseGeometry.includes("ring")) {
    geometry = "TorusGeometry"
    parameters = [0.5, 0.2, 16 * (complexity / 5), 32 * (complexity / 5)]
  } else {
    // Default to a box if we can't determine the shape
    geometry = "BoxGeometry"
    parameters = [1, 1, 1]
  }

  // Return the model code
  return {
    type: "parametric",
    geometry,
    parameters,
    material: {
      type: spec.materials?.includes("metal") ? "MeshStandardMaterial" : "MeshPhysicalMaterial",
      color: mainColor,
      metalness: spec.materials?.includes("metal") ? 0.8 : 0.2,
      roughness: spec.materials?.includes("smooth") ? 0.1 : 0.7,
    },
    description: spec.geometry,
    dimensions: spec.dimensions,
  }
}
