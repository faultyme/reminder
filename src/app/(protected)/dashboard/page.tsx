import { auth } from "@/auth";
import { logoutAction } from "@/actions/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p>Signed in as {session?.user?.email}</p>
      <form action={logoutAction}>
        <button className="rounded-md border px-4 py-2">Sign out</button>
      </form>
    </main>
  );
}