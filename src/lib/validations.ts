import { LicenseType } from "@prisma/client";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ARTIST", "BUYER"]),
});

export const generateSchema = z.object({
  artistSlug: z.string().min(2),
  prompt: z.string().min(5).max(500),
  negativePrompt: z.string().max(500).optional().or(z.literal("")),
  licenseType: z.nativeEnum(LicenseType),
});

export const artworkSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(800),
  imageUrl: z.string().url(),
  tags: z.string().optional(),
  priceCredits: z.number().min(0).max(5000).optional(),
  isForSale: z.boolean().default(false),
});
