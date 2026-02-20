import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiry is updated)
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
      },
      country: {
        type: "string",
        required: false,
        defaultValue: "KE",
      },
      bio: {
        type: "string",
        required: false,
      },
      location: {
        type: "string",
        required: false,
      },
      website: {
        type: "string",
        required: false,
      },
      cover: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
