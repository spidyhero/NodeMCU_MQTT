import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect(session.role === "ARTIST" ? "/dashboard/artist" : "/dashboard/buyer");
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to access your THAREEA AI account.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-4 text-sm text-zinc-600">
            No account yet?{" "}
            <Link href="/register" className="font-medium underline">
              Register now
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
