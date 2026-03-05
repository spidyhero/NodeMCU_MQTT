import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { getSession } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {APP_NAME}
          </Link>
          <nav className="hidden items-center gap-3 text-sm text-zinc-600 md:flex">
            <Link href="/marketplace" className="hover:text-zinc-900">
              Marketplace
            </Link>
            {session?.role === "ARTIST" ? (
              <Link href="/dashboard/artist" className="hover:text-zinc-900">
                Artist dashboard
              </Link>
            ) : null}
            {session?.role === "BUYER" ? (
              <Link href="/dashboard/buyer" className="hover:text-zinc-900">
                Buyer dashboard
              </Link>
            ) : null}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Badge variant="secondary">{session.role}</Badge>
              <span className="hidden text-sm text-zinc-600 md:inline">{session.name}</span>
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
