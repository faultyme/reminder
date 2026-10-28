import { auth } from "@/auth";

export async function GET(req: Request) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set. Add it to your environment variables.");
  }

  const session = await auth();
  if (session?.user) {
    return Response.json({ user: session.user });
  }

  const bearer = req.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer) {
    try {
      const { decode } = await import("next-auth/jwt");
      const payload = await decode({
        token: bearer,
        secret,
        salt: "authjs.session-token",
      });
      if (payload) {
        return Response.json({ user: { id: payload.id, email: payload.email, name: payload.name } });
      }
    } catch {}
  }

  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
