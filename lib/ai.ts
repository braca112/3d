import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function generateModelDescription(prompt: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt: `
        You are an expert 3D modeler. I need a detailed description for creating a 3D model based on this prompt:
        
        "${prompt}"
        
        Please provide a comprehensive description including:
        1. Overall shape and structure
        2. Specific dimensions and proportions
        3. Material properties (texture, color, reflectivity)
        4. Key features and details
        5. Style (realistic, cartoon, low-poly, etc.)
        
        Your description will be used to generate a 3D model, so be as specific and detailed as possible.
      `,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating model description:", error)
    throw new Error("Failed to generate model description")
  }
}
