import Image from "next/image";
import { auth } from "@/auth";
import LogoutButton from "@/components/logout-button";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {user?.image ? (
        <Image
          src={user.image}
          alt={`${user.name ?? "User"} profile image`}
          width={96}
          height={96}
          unoptimized
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : (
        <div
          aria-label="Profile image unavailable"
          className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold"
        >
          {user?.name?.charAt(0).toUpperCase() ?? "?"}
        </div>
      )}
      <p>Signed in as {user?.email}</p>
      <LogoutButton />
    </main>
  );
}