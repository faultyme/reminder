import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { encode } from "next-auth/jwt";
import { db } from "@/lib/neondb";
import { users } from "@/lib/neondb/schemas/users";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: "Invalid credentials." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user?.passwordHash) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is missing! Please add it to your environment variables.");
  }

  const token = await encode({
    token: { id: user.id, email: user.email, name: user.name, image: user.image },
    secret,
    salt: "authjs.session-token",
  });

  const res = Response.json({
    user: { id: user.id, email: user.email, name: user.name, image: user.image },
    token,
  });

  const cookieFlags = process.env.NODE_ENV === "production" ? "; Secure" : "";

  res.headers.append(
    "Set-Cookie",
    `authjs.session-token=${token}; Path=/; HttpOnly; SameSite=Lax${cookieFlags}; Max-Age=2592000`
  );

  return res;
}