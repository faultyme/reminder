"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { db } from "@/lib/neondb";
import { users } from "@/lib/neondb/schemas/users";

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export async function registerAction(_prev: string | undefined, formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return "Enter a name, a valid email and a password of at least 8 characters.";
  }
  const email = parsed.data.email.toLowerCase();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return "An account with this email already exists. Try signing in.";

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await db.insert(users).values({ name: parsed.data.name, email, passwordHash });

  try {
    await signIn("credentials", { email, password: parsed.data.password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) return "Account created. Please sign in.";
    throw error;
  }
}

export async function loginAction(_prev: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: String(formData.get("email")).toLowerCase(),
      password: String(formData.get("password")),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.type === "CredentialsSignin" ? "Invalid email or password." : "Something went wrong.";
    }
    throw error;
  }
}

export async function googleAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}