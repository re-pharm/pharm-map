import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../data/database";
import * as schema from "@/schemas/auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { ...schema }
  }),
  plugins: [nextCookies()],
  emailAndPassword: { enabled: false },
  socialProviders: { 
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    },
    kakao: {
      clientId: process.env.KAKAO_REST_KEY as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      disableDefaultScope: true,
      scope: ["profile_nickname", "account_email"],
      mapProfileToUser: async (profile) => {
        return {
          email: profile.kakao_account.email ?? profile.id + '@needs-to-change'
        }
      }
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "general",
        input: false
      }
    }
  }
})