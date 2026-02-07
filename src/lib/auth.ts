import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "./zod";
import { getUserById, getUserFromDb } from "@/services/user";
import client from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isActive = user.isActive;
        token.role = user.role;
      }

      if (token.id) {
        try {
          const dbUser = await getUserById(token.id as string);

          if (!dbUser || dbUser.isActive === false) {
            return null;
          }

          token.isActive = dbUser.isActive;
          token.role = dbUser.role;
        } catch (error) {
          console.error("Error syncing user session with DB:", error);
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isActive = token.isActive as boolean;
        session.user.role = token.role as "user" | "admin";
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } =
            await signInSchema.parseAsync(credentials);

          const user = await getUserFromDb(email, password);

          if (!user) {
            return null;
          }

          if (user.isActive === false) {
            return null;
          }

          const plainUser = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            isActive: user.isActive,
            role: user.role,
          };

          return plainUser;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          return null;
        }
      },
    }),
  ],
});
