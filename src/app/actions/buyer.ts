"use server";

import { GenerationStatus, LicenseType, Role, TransactionType } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { requireUser } from "@/lib/auth";
import {
  GENERATION_ARTIST_SHARE_PERCENT,
  GENERATION_COST_INT,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { generateSchema } from "@/lib/validations";

const MOCK_RESULTS = [
  "/mock-results/result-1.svg",
  "/mock-results/result-2.svg",
  "/mock-results/result-3.svg",
  "/mock-results/result-4.svg",
  "/mock-results/result-5.svg",
  "/mock-results/result-6.svg",
];

export async function buyCreditsAction(amountCredits = 50): Promise<ActionResult> {
  const session = await requireUser(Role.BUYER);
  const safeCredits = Number.isFinite(amountCredits) ? Math.max(1, Math.floor(amountCredits)) : 50;
  const amountInt = safeCredits * 100;

  await prisma.$transaction(async (tx) => {
    await tx.creditWallet.upsert({
      where: { userId: session.id },
      update: {
        balanceInt: {
          increment: amountInt,
        },
      },
      create: {
        userId: session.id,
        balanceInt: amountInt,
      },
    });

    await tx.transaction.create({
      data: {
        type: TransactionType.CREDIT_PURCHASE,
        amountInt,
        buyerId: session.id,
      },
    });
  });

  revalidatePath("/dashboard/buyer");
  revalidatePath("/dashboard/buyer/credits");
  return ok(`Purchased ${safeCredits} credits (simulated).`);
}

export async function generateImageAction(input: {
  artistSlug: string;
  prompt: string;
  negativePrompt?: string;
  licenseType: LicenseType;
}): Promise<ActionResult<{ imageUrl: string; jobId: string }>> {
  const session = await requireUser(Role.BUYER);
  const parsed = generateSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Invalid generation request. Check your prompt and license type.");
  }

  const artist = await prisma.artistProfile.findUnique({
    where: { slug: parsed.data.artistSlug },
    include: {
      user: true,
    },
  });

  if (!artist) {
    return fail("Artist not found.");
  }

  const model = await prisma.model.findFirst({
    where: { artistId: artist.userId },
    orderBy: { createdAt: "desc" },
  });

  if (!model || model.status !== "READY") {
    return fail("Artist model is not ready yet.");
  }

  const wallet = await prisma.creditWallet.findUnique({
    where: { userId: session.id },
  });

  if (!wallet || wallet.balanceInt < GENERATION_COST_INT) {
    return fail("Not enough credits. Please top up your wallet.");
  }

  const imageUrl = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]!;
  const fingerprintId = randomUUID();
  const artistShareInt = Math.floor((GENERATION_COST_INT * GENERATION_ARTIST_SHARE_PERCENT) / 100);
  const platformShareInt = GENERATION_COST_INT - artistShareInt;

  const result = await prisma.$transaction(async (tx) => {
    await tx.creditWallet.update({
      where: { userId: session.id },
      data: {
        balanceInt: {
          decrement: GENERATION_COST_INT,
        },
      },
    });

    const job = await tx.generationJob.create({
      data: {
        buyerId: session.id,
        artistId: artist.userId,
        prompt: parsed.data.prompt,
        negativePrompt: parsed.data.negativePrompt || null,
        status: GenerationStatus.DONE,
        outputImageUrl: imageUrl,
        metadata: {
          watermarkApplied: true,
          fingerprintId,
          modelVersion: model.version,
        },
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        type: TransactionType.GENERATION_FEE,
        amountInt: GENERATION_COST_INT,
        buyerId: session.id,
        artistId: artist.userId,
        jobId: job.id,
      },
    });

    await tx.revenueSplit.create({
      data: {
        transactionId: transaction.id,
        buyerCostInt: GENERATION_COST_INT,
        artistShareInt,
        platformShareInt,
      },
    });

    await tx.licenseReceipt.create({
      data: {
        buyerId: session.id,
        artistId: artist.userId,
        jobId: job.id,
        licenseType: parsed.data.licenseType,
        termsText:
          parsed.data.licenseType === LicenseType.COMMERCIAL
            ? "Commercial usage allowed for campaign and product marketing."
            : "Standard usage for concepting, drafts, and internal ideation only.",
      },
    });

    return job;
  });

  revalidatePath("/dashboard/buyer");
  revalidatePath(`/generate/${artist.slug}`);
  revalidatePath("/dashboard/artist/earnings");

  return ok("Generation complete.", { imageUrl: result.outputImageUrl ?? imageUrl, jobId: result.id });
}
