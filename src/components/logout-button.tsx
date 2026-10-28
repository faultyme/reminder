"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirect: false })}
      className="rounded-md border px-4 py-2"
    >
      Sign out
    </button>
  );
}
