"use server";

import { Role } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { fail, ok, type ActionResult } from "@/lib/action-result";
import { CREDIT_SCALE } from "@/lib/constants";
import { buildDatasetHash } from "@/lib/ownership";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { artworkSchema } from "@/lib/validations";

export async function createArtworkAction(input: {
  title: string;
  description: string;
  imageUrl: string;
  tags?: string;
  priceCredits?: number;
  isForSale: boolean;
}): Promise<ActionResult> {
  const session = await requireUser(Role.ARTIST);
  const parsed = artworkSchema.safeParse(input);
  if (!parsed.success) {
    return fail("Please provide valid artwork details.");
  }

  const tags = parsed.data.tags
    ? parsed.data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  await prisma.artwork.create({
    data: {
      artistId: session.id,
      title: parsed.data.title,
      description: parsed.data.description,
      imageUrl: parsed.data.imageUrl,
      tags,
      isForSale: parsed.data.isForSale,
      price:
        parsed.data.isForSale && parsed.data.priceCredits
          ? Math.round(parsed.data.priceCredits * CREDIT_SCALE)
          : null,
    },
  });

  revalidatePath("/dashboard/artist");
  revalidatePath("/dashboard/artist/artworks");
  return ok("Artwork uploaded.");
}

const datasetSchema = z.object({
  files: z.array(z.object({ name: z.string(), size: z.number().int().positive() })).min(5).max(20),
});

export async function createOwnershipProofAction(files: Array<{ name: string; size: number }>): Promise<ActionResult> {
  const session = await requireUser(Role.ARTIST);
  const parsed = datasetSchema.safeParse({ files });
  if (!parsed.success) {
    return fail("Upload between 5 and 20 dataset images.");
  }

  const datasetHash = buildDatasetHash(parsed.data.files);
  await prisma.ownershipProof.upsert({
    where: { artistId: session.id },
    update: {
      datasetHash,
      watermarkKey: `wmk_${randomUUID()}`,
      fingerprintKey: `fp_${randomUUID()}`,
    },
    create: {
      artistId: session.id,
      datasetHash,
      watermarkKey: `wmk_${randomUUID()}`,
      fingerprintKey: `fp_${randomUUID()}`,
    },
  });

  revalidatePath("/dashboard/artist/model");
  revalidatePath("/dashboard/artist");
  return ok("Ownership proof generated and verified.");
}

export async function setModelStatusAction(status: "DRAFT" | "TRAINING" | "READY"): Promise<ActionResult> {
  const session = await requireUser(Role.ARTIST);
  const model = await prisma.model.findFirst({
    where: { artistId: session.id },
    orderBy: { createdAt: "desc" },
  });

  if (!model) {
    return fail("No model found.");
  }

  await prisma.model.update({
    where: { id: model.id },
    data: { status },
  });
  revalidatePath("/dashboard/artist/model");
  return ok(`Model status changed to ${status}.`);
}
