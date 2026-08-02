import { auth } from "@/auth";
import { logoutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export default async function UserMenu() {
  const session = await auth();

  if (!session?.user) return null;

  const initial =
    session.user.name?.charAt(0).toUpperCase() ??
    session.user.email?.charAt(0).toUpperCase() ??
    "U";

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500 text-lg font-bold text-slate-950">
        {initial}
      </div>

      <div>
        <p className="font-semibold text-white">
          {session.user.name}
        </p>

        <p className="text-sm text-slate-400">
          {session.user.email}
        </p>
      </div>

      <form action={logoutUser}>
        <Button
          type="submit"
          variant="destructive"
          className="ml-2"
        >
          Cerrar sesión
        </Button>
      </form>
    </div>
  );
}