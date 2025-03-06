import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.bio = user.bio;
        session.user.location = user.location;
        session.user.phoneNumber = user.phoneNumber;
        session.user.twoFactorEnabled = user.twoFactorEnabled;
      }

      return session;
    },
  },
});

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user) return null;

  return await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      location: true,
      phoneNumber: true,
      twoFactorEnabled: true,
    },
  });
}
