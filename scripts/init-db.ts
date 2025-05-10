import { initializeDatabase } from "@/lib/db-init"

async function main() {
  console.log("Starting database initialization...")
  await initializeDatabase()
  console.log("Database initialization complete!")
  process.exit(0)
}

main().catch((error) => {
  console.error("Error during database initialization:", error)
  process.exit(1)
})
