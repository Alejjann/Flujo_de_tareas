import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Correo",
          type: "email",
        },
        password: {
          label: "Contraseña",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null;
        }

        const email = String(
          credentials.email
        )
          .trim()
          .toLowerCase();

        const password = String(
          credentials.password
        );

        const user =
          await prisma.user.findUnique({
            where: {
              email,
            },
          });

        if (!user) {
          return null;
        }

        const valid =
          await bcrypt.compare(
            password,
            user.password
          );

        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          token.id as string;
      }

      return session;
    },
  },
});