import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/neondb";
import { users } from "@/lib/neondb/schemas/users";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google,
    Credentials({
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase();
        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;
      if (!profile?.email || !profile.email_verified) return false;
      const email = profile.email.toLowerCase();
      const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing) {
        user.id = existing.id;
        return true;
      }
      const [created] = await db
        .insert(users)
        .values({ name: user.name, email, image: user.image })
        .returning();
      user.id = created.id;
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});