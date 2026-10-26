import { defineConfig } from "drizzle-kit";

process.loadEnvFile(".env");

export default defineConfig({
  schema: "./src/lib/neondb/schemas/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});