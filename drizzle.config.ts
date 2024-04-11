import { defineConfig } from 'drizzle-kit'


export default defineConfig({
 schema: "./db/schema.ts",
  driver: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  out: './drizzle/migrations',
  verbose: true,
  strict: true,
})



// import type { Config } from "drizzle-kit";
// import * as dotenv from "dotenv";
// dotenv.config();

// export default {
//   schema: "./db/schema.ts",
//   out: "./drizzle/migrations",
//   driver: "turso",
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//     authToken: process.env.DATABASE_AUTH_TOKEN,
//   },
// } satisfies Config;