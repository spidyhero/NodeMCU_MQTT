"use server";

import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { clearSession, setSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validations";

export async function loginAction(input: {
  email: string;
  password: string;
}): Promise<ActionResult<{ role: Role }>> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Invalid email or password format.");
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user) {
    return fail("User not found.");
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isValid) {
    return fail("Incorrect password.");
  }

  await setSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return ok("Logged in successfully.", { role: user.role });
}

export async function registerAction(input: {
  name: string;
  email: string;
  password: string;
  role: "ARTIST" | "BUYER";
}): Promise<ActionResult<{ role: Role }>> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Please fill all fields correctly.");
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (existing) {
    return fail("Email is already in use.");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash,
      role: parsed.data.role,
      wallet: {
        create: {
          balanceInt: parsed.data.role === Role.BUYER ? 1000 : 0,
        },
      },
      artistProfile:
        parsed.data.role === Role.ARTIST
          ? {
              create: {
                slug: parsed.data.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, ""),
                displayName: parsed.data.name,
                bio: "New artist on THAREEA AI.",
              },
            }
          : undefined,
    },
  });

  if (user.role === Role.ARTIST) {
    await prisma.model.create({
      data: {
        artistId: user.id,
        name: `${user.name} Signature Model`,
        status: "DRAFT",
        baseModel: "FLUX",
        loraConfig: { rank: 8, alpha: 16 },
        version: "v0.1",
      },
    });
  }

  await setSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return ok("Account created.", { role: user.role });
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
