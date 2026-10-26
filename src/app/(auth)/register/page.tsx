"use client";

import Link from "next/link";
import { useActionState } from "react";
import { googleAction, registerAction } from "@/actions/auth";

export default function RegisterPage() {
  const [error, formAction, pending] = useActionState(registerAction, undefined);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Create account</h1>
      <form action={googleAction}>
        <button className="w-full rounded-md border px-4 py-2">Continue with Google</button>
      </form>
      <div className="text-center text-sm opacity-60">or</div>
      <form action={formAction} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" required className="rounded-md border px-3 py-2" />
        <input name="email" type="email" placeholder="Email" required className="rounded-md border px-3 py-2" />
        <input name="password" type="password" placeholder="Password (min 8 characters)" required minLength={8} className="rounded-md border px-3 py-2" />
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