import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.SERVICE_URL
});