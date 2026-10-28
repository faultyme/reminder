"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    };

    try {
      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const registerData = await registerResponse.json().catch(() => ({}));
      if (!registerResponse.ok) {
        throw new Error(registerData.error ?? "Registration failed.");
      }

      const loginResponse = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: body.email, password: body.password }),
      });

      const loginData = await loginResponse.json().catch(() => ({}));
      if (!loginResponse.ok) {
        throw new Error(loginData.error ?? "Login failed after registration.");
      }

      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <Link href="/api/auth/signin/google" className="w-full rounded-md border px-4 py-2 text-center">
        Continue with Google
      </Link>
      <div className="text-center text-sm opacity-60">or</div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" required className="rounded-md border px-3 py-2" />
        <input name="email" type="email" placeholder="Email" required className="rounded-md border px-3 py-2" />
        <input name="password" type="password" placeholder="Password (min 8)" required minLength={8} className="rounded-md border px-3 py-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={pending} className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50">
          {pending ? "Creating..." : "Create account"}
        </button>
      </form>
      <p className="text-sm">
        Already registered? <Link href="/login" className="underline">Sign in</Link>
      </p>
    </main>
  );
}