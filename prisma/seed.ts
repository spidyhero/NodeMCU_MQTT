import { BaseModel, ModelStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.licenseReceipt.deleteMany();
  await prisma.revenueSplit.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.generationJob.deleteMany();
  await prisma.model.deleteMany();
  await prisma.artwork.deleteMany();
  await prisma.ownershipProof.deleteMany();
  await prisma.artistProfile.deleteMany();
  await prisma.creditWallet.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const artistUsers = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: "Nicha Srikul",
        email: "nicha@thareea.ai",
        passwordHash,
        role: Role.ARTIST,
        artistProfile: {
          create: {
            slug: "nicha-srikul",
            displayName: "Nicha Srikul",
            bio: "Contemporary Thai visual artist blending temple motifs with modern color stories.",
            avatarUrl: "/mock-results/result-1.svg",
            bannerUrl: "/mock-results/result-2.svg",
            socialLinks: {
              instagram: "@nicha.art",
              website: "https://example.com/nicha",
            },
          },
        },
      },
      include: { artistProfile: true },
    }),
    prisma.user.create({
      data: {
        name: "Arun Malinee",
        email: "arun@thareea.ai",
        passwordHash,
        role: Role.ARTIST,
        artistProfile: {
          create: {
            slug: "arun-malinee",
            displayName: "Arun Malinee",
            bio: "Digital surrealist from Bangkok creating cinematic portraits and Thai folklore scenes.",
            avatarUrl: "/mock-results/result-3.svg",
            bannerUrl: "/mock-results/result-4.svg",
            socialLinks: {
              instagram: "@arun.vision",
              website: "https://example.com/arun",
            },
          },
        },
      },
      include: { artistProfile: true },
    }),
  ]);

  await prisma.user.create({
    data: {
      name: "Somchai BrandOps",
      email: "buyer@thareea.ai",
      passwordHash,
      role: Role.BUYER,
      wallet: {
        create: {
          balanceInt: 12000,
        },
      },
    },
  });

  for (const artist of artistUsers) {
    await prisma.model.create({
      data: {
        artistId: artist.id,
        name: `${artist.name} Signature Model`,
        status: ModelStatus.READY,
        baseModel: BaseModel.FLUX,
        loraConfig: {
          rank: 16,
          alpha: 32,
          steps: 1200,
        },
        version: "v1.0",
      },
    });
  }

  const artworkPayloads = [
    {
      title: "Emerald Temple Dawn",
      description: "Light washes over temple spires in a calm green palette.",
      imageUrl: "/mock-results/result-1.svg",
      tags: ["temple", "thai", "dawn"],
    },
    {
      title: "Monsoon Neon Alley",
      description: "Rain and neon reflections in a Bangkok side street.",
      imageUrl: "/mock-results/result-2.svg",
      tags: ["urban", "neon", "rain"],
    },
    {
      title: "Golden Garuda Study",
      description: "Mythic Garuda rendered in golden ornamental brushwork.",
      imageUrl: "/mock-results/result-3.svg",
      tags: ["myth", "garuda", "ornamental"],
    },
    {
      title: "Festival Lantern Sky",
      description: "Lanterns and smoke trails over a celebratory night scene.",
      imageUrl: "/mock-results/result-4.svg",
      tags: ["festival", "night", "lantern"],
    },
    {
      title: "River Market Noon",
      description: "Floating market textures and layered color blocking.",
      imageUrl: "/mock-results/result-5.svg",
      tags: ["market", "water", "daylight"],
    },
    {
      title: "Khon Mask Portrait",
      description: "Portrait study inspired by classical Khon masks.",
      imageUrl: "/mock-results/result-6.svg",
      tags: ["portrait", "khon", "heritage"],
    },
    {
      title: "Dragon Procession",
      description: "Dynamic procession scene with stylized dragon forms.",
      imageUrl: "/mock-results/result-1.svg",
      tags: ["dragon", "procession", "movement"],
    },
    {
      title: "Lotus Glasshouse",
      description: "Lotus reflections inside an imagined contemporary greenhouse.",
      imageUrl: "/mock-results/result-2.svg",
      tags: ["lotus", "greenhouse", "surreal"],
    },
  ];

  for (const artist of artistUsers) {
    for (const [index, artwork] of artworkPayloads.entries()) {
      await prisma.artwork.create({
        data: {
          artistId: artist.id,
          title: `${artwork.title} ${index + 1}`,
          description: artwork.description,
          imageUrl: artwork.imageUrl,
          tags: artwork.tags,
          isForSale: index % 2 === 0,
          price: index % 2 === 0 ? 1500 + index * 100 : null,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
