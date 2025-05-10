import { db } from "@/lib/db"

// Default categories for models
const DEFAULT_CATEGORIES = [
  {
    name: "Architecture",
    description: "Buildings, structures, and architectural elements",
  },
  {
    name: "Vehicles",
    description: "Cars, planes, boats, and other transportation",
  },
  {
    name: "Characters",
    description: "People, creatures, and animated characters",
  },
  {
    name: "Furniture",
    description: "Home and office furniture items",
  },
  {
    name: "Nature",
    description: "Plants, animals, landscapes, and natural elements",
  },
  {
    name: "Technology",
    description: "Gadgets, devices, and technological items",
  },
  {
    name: "Abstract",
    description: "Non-representational and abstract forms",
  },
  {
    name: "Other",
    description: "Miscellaneous models that don't fit other categories",
  },
]

export async function initializeDatabase() {
  try {
    // Check if categories already exist
    const existingCategories = await db.modelCategory.count()

    if (existingCategories === 0) {
      console.log("Initializing database with default categories...")

      // Create default categories
      await db.modelCategory.createMany({
        data: DEFAULT_CATEGORIES,
      })

      console.log("Database initialization complete!")
    } else {
      console.log("Database already initialized.")
    }
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}
