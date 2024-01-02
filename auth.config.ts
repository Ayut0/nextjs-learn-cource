import type { NextAuthConfig } from "next-auth";

// This is not required, but by adding signIn: '/login' into our pages option, 
// the user will be redirected to our custom login page, 
// rather than the NextAuth.js default page.

export const authConfig = {
  pages: {
    signIn: "/login",
  },
};
