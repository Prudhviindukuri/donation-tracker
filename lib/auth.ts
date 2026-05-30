import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (
          username === process.env.ADMIN_USERNAME &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", name: "Admin" };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
